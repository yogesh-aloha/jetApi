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
		if(!req.params.take) req.params.take = 100;
		if(!req.params.skip) req.params.skip = 0;

		var qry = "SELECT mv.id, mv.title, mov.duration, mi.file_path, ";
		qry += "mi.height, mi.width, mov.title, mov.original_release_date ";
		qry += "mve.encode_type, mov.title from movie_videos mv " ;
		qry += "LEFT JOIN movie_images mi ON (mv.movie_id = mi.movie_id) ";
		qry += "LEFT JOIN movie mov ON (mv.movie_id = mov.id) ";
		qry += "LEFT JOIN movie_video_encodes mve ON (mv.id = mve.movie_video_id) "

		var where = "";

		var limit = "LIMIT " + req.params.take;
		var take = " OFFSET " + req.params.skip;

		qry = qry + where + limit + take;
		
		dbPool.query(qry,function(err, data){
		});	
	}
}

module.exports = commons;