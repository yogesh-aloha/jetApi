var	dbPool  = require('./dbModel'),
	async   = require('async'),
	request = require('../modules/sendRequest'),
	commonModel = require('./commonModel'),
	_       = require('underscore'),
	f =  require('../lib/functions.js');

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */

var dbSearchMapping = {
	genre: {
		column: 'gn.id',
		type: 'integer'
	},
	release_date: {
		column: 'mov.original_release_date',
		type: 'booleanOp'
	},
	title: {
		column: 'mv.title',
		type: 'stringOP'
	},
	contributors: {
		column: 'mv.title',
		type: 'stringOP'
	},
}

var operators = {
	integer: ["="],
	booleanOp: ["<",">"],
	stringOP : ["LIKE"]
}


var columnMapping = {
	"Family" : 6
}

var sortType    = ['rating','genre','release_date','popularity','review'];
var sortSubType = ['genre','release_date','review'];

var videos = {
	getAllVideos : function(req, cb) {
		if(!req.params.take) req.params.take = 10;
		if(!req.params.skip) req.params.skip = 0;	
		var where = req.params.where ? req.params.where : "";

		var qry = "SELECT mv.id as 'videoID', mv.title as 'videoTitle', mv.duration as 'duration', ";
		qry += "mi.id as 'imageId', mi.file_path as 'imagePath', mi.height as 'imageHeight', mi.width as imageWidth, ";
		qry += "mov.title as 'movieTitle', mov.original_release_date as releaseDate, "
		qry += "et.name as 'encodeType', et.id as 'encodedId' from movie_videos mv " ;
		qry += "LEFT JOIN movie_images mi ON (mv.movie_id = mi.movie_id) ";
		qry += "LEFT JOIN movies mov ON (mv.movie_id = mov.id) ";
		qry += "LEFT JOIN movie_video_encodes mve ON (mv.id = mve.movie_video_id) "
		qry += "LEFT JOIN encode_types et ON (et.id = mve.encode_type_id) "
		qry += "LEFT JOIN movie_genres mg ON (mv.movie_id = mg.movie_id) "
		qry += "LEFT JOIN genres gn ON (gn.id = mg.genre_id) "



		var limit = "LIMIT " + req.params.take;
		var take = " OFFSET " + req.params.skip;

		qry = qry + where + limit + take;

		dbPool.query(qry,function(err, data){
			if(err) {
				cb(err);
			}else{
				cb(null , videos.formatVideoData(data));
			}
		});	
	},

	getSortedVideos : function(req, cb) {
		console.log(req.query);
		if(!req.query.type) return cb("Please provide type to search");
		if(!req.query.subType && _.indexOf(sortSubType, req.params.type) === -1) return cb("Please provide sub type to search");
		
		var sortTerm = req.query.subType ?  req.query.subType : req.query.type;
		var operator = dbSearchMapping[req.query.type].type 

		if(operator = 'integer'){
			operator = '='
		}
		if(req.query.type === 'genre')
			req.query.subType = columnMapping[req.query.subType];

		var where = "WHERE " + dbSearchMapping[req.query.type].column + " " + operator + " " + "'" + req.query.subType + "'" + " ";
		req.params.where = where;

		videos.getAllVideos(req, function(err, data) {
			cb(err, data)
		})
	},
	
	getSearchVideos : function(req, cb) {
		if(!req.query.search) return cb("Please provide search term");
		req.params.where = videos.getSearchQry(req.query.search, req.query.search, req.query.search);
		
		videos.getAllVideos(req, function(err, data) {
			cb(err, data)
		})
	},

	getYMAL : function(req, cb) {
		if(!req.query.videoID) return cb("Please provide videoID");


		var qry = "SELECT mv.title as 'title', gn.name as 'genreName' from movie_videos mv ";
		qry += "LEFT JOIN movie_genres mg ON (mv.movie_id = mg.movie_id) "
		qry += "LEFT JOIN genres gn ON (gn.id = mg.genre_id) "
		qry += "WHERE mv.id=" + req.query.videoID;
		dbPool.query(qry,function(err, data){
			if(err) {
				cb(err);
			}else{
				req.params.where = videos.getSearchQry(data[0].title, data[0].genreName, data[0].genreName);
				videos.getAllVideos(req, function(err, data) {
					cb(err, data)
				})
			}
		});	
	},

	getSearchQry : function(searchGenerTerm, searchTitleTerm, searchcontributorsTerm){
		var searchCriteria = {
			'genre' : searchGenerTerm,
			'title' : searchTitleTerm,
			'contributors' : searchcontributorsTerm
		}	
		var where = "WHERE ";
		var OR = "OR";
		_.each(searchCriteria, function(val, key){
			var sortTerm = val;
			console.log(key);
			var operator = dbSearchMapping[key].type;

			if(operator = 'integer'){
				operator = '='
			}

			if(key === 'genre' && columnMapping[val])
			 val = columnMapping[val];

			if(_.indexOf(Object.keys(searchCriteria), key) == Object.keys(searchCriteria).length - 1)
				OR = "";
			where += dbSearchMapping[key].column + " " + operator + " " + "'" + val + "' " +OR + " ";
		});
		return where;
	},

	formatVideoData : function(videoData) {
		var formatedData = [];
		_.each(videoData, function(data){
			var index = _.findIndex(formatedData, {videoID : data.videoID});
			console.log(index);
			if(index > -1){
				var imageIndex = _.findIndex(formatedData[index].imageData, {imageId : data.imageId});
				var tempHash = {
					imageId: data.imageId,
					imagePath:data.imagePath,
					imageHeight: data.imageHeight,
					imageWidth: data.imageHeight
				}
				if(imageIndex === -1)
					formatedData[index].imageData.push(tempHash);


				var encodeIndex = _.findIndex(formatedData[index].encodeData, {imageId : data.encodedId});
				var tempHash = {
					id: data.encodedId,
					type: data.encodeType
				}
				if(encodeIndex === -1)
					formatedData[index].encodeData.push(tempHash);
			}else {
				var tempHash = {		
				   videoID: data.videoID,
				   videoTitle: data.videoTitle,
				   duration: data.duration,
				   imageData: [{
				   		imageId: data.imageId,
						imagePath:data.imagePath,
						imageHeight: data.imageHeight,
						imageWidth: data.imageHeight	
					}],
					movieTitle: data.movieTitle,
					releaseDate: data.releaseDate,
					encodeData: [{
						id: data.encodedId,
						type: data.encodeType
					}],
				}
				formatedData.push(tempHash);
			}
		});
		return formatedData;
	}
}

module.exports = videos;