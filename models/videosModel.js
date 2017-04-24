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
	},
	
	formatVideoDetailData : function(videoData) {
		var formatedData = [];
		_.each(videoData, function(data){
			var index = _.findIndex(formatedData, {videoID : data.videoID});
			//console.log(index);
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

				var encodeIndex = _.findIndex(formatedData[index].encodeData, {id : data.encodeTypeId});
				var tempHash = {
					id: data.encodeTypeId,
					type: data.encodeType
				}
				if(encodeIndex === -1)
					formatedData[index].encodeData.push(tempHash);

				var genereIndex = _.findIndex(formatedData[index].genreData, {id: data.genreId});
				if(genereIndex === -1) formatedData[index].genreData.push({id: data.genreId, genre: data.genre});

				var studioIndex = _.findIndex(formatedData[index].studioData, {id: data.studioId});
				if(studioIndex === -1) formatedData[index].studioData.push({id: data.studioId, studio: data.studio});

				var actorIndex = _.findIndex(formatedData[index].actorData, {id: data.actorId});
				if(actorIndex === -1) formatedData[index].actorData.push({id: data.actorId, studio: data.actor});

			}else {
				var tempHash = {		
				   	videoID: data.videoID,
				   	videoTitle: data.videoTitle,
				   	duration: data.duration,
					movieTitle: data.movieTitle,
					viewCount: data.viewCount,
					likeCount: data.likeCount,
					rating: data.rating,
					releaseDate: data.releaseDate,
					description: data.description,
					budget: data.budget, 
				   	movieRunTime: data.movieRunTime,
				   	imageData: [{
				   		imageId: data.imageId,
						imagePath: data.imagePath,
						imageHeight: data.imageHeight,
						imageWidth: data.imageHeight	
					}],
					encodeData: [{
						id: data.encodeTypeId,
						type: data.encodeType
					}],
					genreData: [{
						id: data.genreId,
						genre: data.genre
					}],
					studioData: [{
						id: data.studioId,
						studio: data.studio
					}],
					actorData: [{
						id: data.actorId,
						actor: data.actor
					}]
				}
				formatedData.push(tempHash);
			}
		});
		return formatedData;
	},
	getVideoDetailById : function(req, cb) {
		console.log("req===",req.query);
		var qry = "SELECT mv.id as videoID,mv.title as videoTitle, mv.duration as duration,"+ 
		" mi.id as imageId, mi.file_path as imagePath, mi.height as imageHeight, mi.width as imageWidth," +
		"mov.title as movieTitle, 'unrated' as rating, mov.original_release_date as releaseDate," + 
		"et.id as encodeTypeId, et.name as encodeType,("+
		"select count(*) from video_views where video_Id = " + req.query.id +
		") as viewCount,( " +
		"select count(*) from video_Likes where video_Id = " + req.query.id +") as likeCount, " +
		"mdesc.movie_description as description, movc.person_id as actorId, movc.person_name as actor, gen.id as genreId, gen.name as genre,"+ 
		"mov.runtime as movieRunTime, comp.id as studioId, comp.name as studio, mov.budget as budget FROM "+
		"movie_videos mv LEFT JOIN movies mov ON (mv.movie_id = mov.id)" +
		"LEFT JOIN movie_images mi ON (mov.id = mi.movie_id) "+ 
		"LEFT JOIN video_encodes ven ON (ven.video_id = mv.id) " +
		"LEFT JOIN encode_types et ON (et.id = ven.encode_type_id) " +
		"LEFT JOIN movie_descriptions mdesc ON (mov.id = mdesc.movie_id) " +
		"LEFT JOIN movie_genres movgen ON (mov.id = movgen.movie_id) "+
		"LEFT JOIN genres gen ON (movgen.genre_id = gen.id) "+
		"LEFT JOIN movie_contributors movc ON (mov.id = movc.movie_id) "+ 
		"LEFT JOIN video_views vv ON (mv.id = vv.video_Id) "+ 
		"LEFT JOIN video_Likes vl ON (mv.id = vl.video_Id) "+
		"JOIN movie_companies mvc ON (mov.id = mvc.movie_id) "+
		"JOIN companies comp ON (comp.id = mvc.company_id) "+
		"where mv.id ="+req.query.id;
		
		dbPool.query(qry,function(err, rows){
			if(err) {return cb('error in get Video Details '+err)}
			else {				
				var data = videos.formatVideoDetailData(rows);
				cb(null,data)
			}
		});
		
	}
}

module.exports = videos;