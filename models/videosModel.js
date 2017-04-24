var	dbPool  = require('./dbModel'),
	async   = require('async'),
	request = require('../modules/sendRequest'),
	commonModel = require('./commonModel'),
	_       = require('underscore'),
	f =  require('../lib/functions.js');

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
		qry += "LEFT JOIN movie_video_encodes mve ON (mv.id = mve.video_id) "
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
		if(!req.query.type) return cb("Please provide type to sort ");
		if(!req.query.subType && _.indexOf(sortSubType, req.params.type) === -1) return cb("Please provide sub type to sort");
		
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
		if(!req.params.id) return cb("Please provide videoID");


		var qry = "SELECT mv.title as 'title', gn.name as 'genreName' from movie_videos mv ";
		qry += "LEFT JOIN movie_genres mg ON (mv.movie_id = mg.movie_id) "
		qry += "LEFT JOIN genres gn ON (gn.id = mg.genre_id) "
		qry += "WHERE mv.id=" + req.params.id;
		dbPool.query(qry,function(err, data){
			if(err) {
				cb(err);
			}else{
				if(data.length > 0) {
					req.params.where = videos.getSearchQry(data[0].title, data[0].genreName, data[0].genreName);
					videos.getAllVideos(req, function(err, data) {
						cb(err, data)
					});
				} else {
					cb(null, []);
}
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

	getDeviceId : function(deviceId,cb){
		if(deviceId !== ''){
		 	var getDeviceId = "SELECT device_Id FROM devices WHERE device_Id = '" + deviceId + "'";
			dbPool.query(getDeviceId,function(err,ddata){
				if(err) {return cb('error in select deviceID '+err)}
				else {
					if(ddata.length > 0){
						cb(ddata);
					}else{
						var sql = "INSERT IGNORE INTO devices (device_Id) VALUES ('"+deviceId+"')";
						dbPool.query(sql,function(err,data){
							if(err) {return cb('error in insert video_Likes '+err)}
							else {
								if(data.length > 0){
									cb(null, data);
								}else
									cd("Error in inserting device_Id");
							}
						});
					}
				}
			});
		}else
			cb('Please provide device_Id');
	},

	postViewsCount : function(req, cb) {
		var videoId =  req.body.video_id; 
		var deviceId =  req.body.device_id; 
		if(deviceId !== '' && videoId > 0) {
			videos.getDeviceId(deviceId, function(result){
				if(result.length > 0) {
					var sql = "INSERT IGNORE INTO video_views (video_Id, device_Id) VALUES ('"+videoId+"','"+result[0].device_Id+"')";
					dbPool.query(sql,function(ddata){
						if(err) {return cb('error in insert video_views '+err)}
						else {
							cb(null,ddata);
						}
					});
				} else {
					cb('No device_Id found');
				}
			});
		}else{
			cb('Please provide device_Id and video_Id');
		}
	},

	postLikesCount : function(req, cb) {
		var videoId =  req.body.video_id; 
		var deviceId =  req.body.device_id; 
		if(deviceId !== '' && videoId > 0) {
			videos.getDeviceId(deviceId, function(result){
				if(result.length > 0) {
					var sql = "INSERT IGNORE INTO video_Likes (video_Id, device_Id) VALUES ('"+videoId+"','"+result[0].device_Id+"')";
						dbPool.query(sql,function(err,data){
							if(err) {return cb('error in insert video_Likes '+err)}
							else {
								cb(null, data);
							}
						});
				} else {
					cb('Error to get device Id');
				}		
			});
		}else{
			cb('Please provide device_Id and video_Id');
		}
	},

	getViewsCount : function(req, cb) {
		var videoId =  req.params.videoId; 
		if(videoId.length > 0) {
			var sql = "SELECT count(device_Id) as viewCount FROM video_views WHERE video_Id = "+ videoId;
				dbPool.query(sql,function(err, data){
					if(err) {return cb('error in select deviceID '+err)}
					else {
						if(data.length > 0) {
							console.log(data);
							cb(null, data);
						} else {
							cb(null,0);
						}
					}
				});
		}else{
			cb('Please Insert device_Id');
		}
	},

	getLikesCount : function(req, cb) {
		var videoId =  req.params.videoId; 
		if(videoId.length > 0) {
			var sql = "SELECT count(device_Id) as viewCount FROM video_Likes WHERE video_Id = "+ videoId;
				dbPool.query(sql,function(err, data){
					if(err) {return cb('error in select deviceID '+err)}
					else {
						if(data.length > 0) {
							console.log(data);
							cb(null, data);
						} else {
							cb(null,0);
						}
					}
				});
		}else{
			cb('Please Insert device_Id');
		}
	},
	getVideoDetailById : function(req, cb) {
		
		if(!req.params.id) return cb("Please provide video id.");

		var qry ="SELECT mv.id as videoID,mv.title as videoTitle, mv.duration as duration, mi.file_path as imagePath, mi.height as imageHeight,"+
		" mi.width as imageWidth, mov.title as movieTitle, null as rating, mov.original_release_date as releaseDate, "+
		"et.name as EncodeType,null as viewCount,null as likeCount, mdesc.movie_description as Description, movc.person_name as Actors, gen.name as Genre, mov.runtime as MovieRunTime,null as Studio, mov.budget as Budget"+
		" FROM movie_videos mv JOIN movies mov ON (mv.movie_id = mov.id) JOIN movie_images mi ON (mov.id = mi.movie_id) JOIN movie_video_encodes mven ON (mven.video_id = mv.id) JOIN encode_types et ON (et.name = mven.encode_type_id)"+
		"JOIN movie_descriptions mdesc ON (mov.id = mdesc.id) JOIN movie_genres movgen ON (mov.id = movgen.movie_id) JOIN genres gen ON (movgen.genre_id = gen.id) JOIN movie_contributors movc ON (mov.id = movc.movie_id) "+
		"where mv.id ="+req.params.id;
		dbPool.query(qry,function(err, rows){
			if(err) {return cb('error in get Video Details '+err)}
			else {
				console.log("rows===",rows);
				cb(null,rows)
			}
		});
		
	}
}

module.exports = videos;