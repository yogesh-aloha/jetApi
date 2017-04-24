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
	},
	getVideoDetailById : function(req, cb) {
		console.log("req===",req.query);
		var qry ="SELECT mv.id as videoID,mv.title as videoTitle, mv.duration as duration, mi.file_path as imagePath, mi.height as imageHeight,"+
		" mi.width as imageWidth, mov.title as movieTitle, null as rating, mov.original_release_date as releaseDate, "+
		"et.name as EncodeType,null as viewCount,null as likeCount, mdesc.movie_description as Description, movc.person_name as Actors, gen.name as Genre, mov.runtime as MovieRunTime,null as Studio, mov.budget as Budget"+
		" FROM movie_videos mv JOIN movies mov ON (mv.movie_id = mov.id) JOIN movie_images mi ON (mov.id = mi.movie_id) JOIN movie_video_encodes mven ON (mven.video_id = mv.id) JOIN encode_types et ON (et.name = mven.encode_type)"+
		"JOIN movie_descriptions mdesc ON (mov.id = mdesc.id) JOIN movie_genres movgen ON (mov.id = movgen.movie_id) JOIN genres gen ON (movgen.genre_id = gen.id) JOIN movie_contributors movc ON (mov.id = movc.movie_id) "+
		"where mv.id ="+req.query.id;
		dbPool.query(qry,function(err, rows){
			if(err) {return cb('error in get Video Details '+err)}
			else {
				console.log("rows===",rows);
				cb(null,rows)
			}
		});
		
	}


}

module.exports = commons;