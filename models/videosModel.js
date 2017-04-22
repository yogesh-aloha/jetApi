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

var moviesTableMapping = {
	'Id'                  : 'id',
	'Title'               : "title",
	'Created'             : "created_date",
	'Modified'            : "modified_date",
	'OriginalTitle'       : "original_title",
	'OriginalReleaseDate' : "original_release_date",
	'Year'                : "year",
	'OriginalLanguage'    : "original_language",
	'Revenue'             : "revenue",
	'Budget'              : "budget",
	'Runtime'             : "runtime",
	'OfficialSiteUrl'     : "official_site_url",
	'Status'              : "status",
	'Type'                : "type",
	'VersionId'           : "version_id",
	'Idx'                 : 'idx',
	'RedirectTo'          : 'redirect_to'
}

var commons = {
	getAllVideos : function(req, cb) {
		
	},

	postViewsCount : function(req, cb) {
		var videoId =  req.body.videoId; 
		var deviceId =  req.body.deviceId; 
		if(deviceId !== '' && videoId > 0) {
		var getDeviceId = "SELECT device_Id FROM devices WHERE device_Id = '" + deviceId + "'";
			dbPool.query(getDeviceId,function(err,data){
				if(err) {return cb('error in select deviceID'+err)}
				else {
					if(data.length > 0) {
						var sql = "INSERT IGNORE INTO video_views (video_Id, device_Id) VALUES ('"+videoId+"','"+deviceId+"')";
							dbPool.query(sql,function(ddata){
								if(err) {return cb('error in insert video_views '+err)}
								else {
									cb(null,'success');
								}
 						});
					} else {
						cb('No device_Id found');
					}
				}
			});
		}else{
			cb('Please provide device_Id and video_Id');
		}
	},

	postLikesCount : function(req, cb) {
		var videoId =  req.body.videoId; 
		var deviceId =  req.body.deviceId; 
		if(deviceId !== '' && videoId > 0) {
		var getDeviceId = "SELECT device_Id FROM devices WHERE device_Id = '" + deviceId + "'";
			dbPool.query(getDeviceId,function(err,ddata){
				if(err) {return cb('error in select deviceID '+err)}
				else {
					if(ddata.length > 0) {
						var sql = "INSERT IGNORE INTO video_Likes (video_Id, device_Id) VALUES ('"+videoId+"','"+deviceId+"')";
							dbPool.query(sql,function(data){
								if(err) {return cb('error in insert video_Likes '+err)}
								else {
									cb(null,'success');
								}
 						});
					} else {
						cb('No device_Id found');
					}
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
	}

}

module.exports = commons;