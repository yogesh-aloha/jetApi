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
		
	}
}

module.exports = commons;