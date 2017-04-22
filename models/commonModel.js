var	dbPool  = require('./dbModel'),
	async   = require('async'),
	request = require('../modules/sendRequest'),
	_       = require('underscore'),
	options = {},
	f =  require('../lib/functions.js');
var commons = {
	allCountries : function(req, cb) {
		req.param.table   = 'countries';
		req.param.path    = '/Common/Countries';
		req.param.fields  = ['id','iso_code','name','version_number'];
		req.param.columns = ['Id','IsoCode','Name',1];
		commons.storeData(req, function(err, data) {
			cb(err, data);
		});
	},

	getStoreCountries : function(countries, cb) {
		if(countries.length > 0) {
			var country_ids = [];
			async.each(countries, function(country, eachCB) {
				var getCountry = "SELECT id,name FROM countries WHERE name = '" + country + "'";
				dbPool.query(getCountry,function(err, data){
					if(err) {return cb1('error in insert countries '+err)}
					else {
						if(data.length > 0) {
							country_ids.push({"id":data[0].id, "name":country});
							eachCB(null);
						} else {
							var storeCountry = "INSERT IGNORE INTO countries (name) VALUES ('"+country+"')";
							dbPool.query(storeCountry,function(err, data){
								if(err) {return cb1('error in insert countries '+err)}
								else {
									country_ids.push({"id":data['insertId'], "name":country});
									eachCB(null);
								}
							});
						}
					}
				});
			}, function(err){
				if(err) {cb(err);}
				else { 
					cb(null, country_ids);
				}
			});
		} else {
			cb(null, []);
		}
	},

	getStoreLanguages : function(languages, cb) {
		if(languages.length > 0) {
			var lang_ids = [];
			async.each(languages, function(language, eachCB) {
				var getlanguage = "SELECT id,name FROM languages WHERE name = '" + language + "'";
				dbPool.query(getlanguage,function(err, data){
					if(err) {return cb1('error in insert languages '+err)}
					else {
						if(data.length > 0) {
							lang_ids.push({"id":data[0].id, "name":language});
							eachCB(null);
						} else {
							var storeLanguage = "INSERT IGNORE INTO languages (name) VALUES ('"+languages+"')";
							dbPool.query(storeLanguage,function(err, data){
								if(err) {return cb1('error in insert languages '+err)}
								else {
									lang_ids.push({"id":data['insertId'], "name":languages});
									eachCB(null);
								}
							});
						}
					}
				});
			}, function(err){
				if(err) {cb(err);}
				else { 
					cb(null, lang_ids);
				}
			});
		} else {
			cb(null, []);
		}
	},
	getStoreImageType : function(imageTypes, cb) {
		if(imageTypes.length > 0) {
			var image_type_ids = [];
			async.each(imageTypes, function(type, eachCB) {
				var getCountry = "SELECT id,name FROM image_types WHERE name = '" + type + "'";
				dbPool.query(getCountry,function(err, data){
					if(err) {return cb1('error in insert image types '+err)}
					else {
						if(data.length > 0) {
							image_type_ids.push({"id":data[0].id, "type":type});
							eachCB(null, data[0].id);
						} else {
							var storeCountry = "INSERT IGNORE INTO image_types (name) VALUES ('"+type+"')";
							dbPool.query(storeCountry,function(err, data){
								if(err) {return cb1('error in insert image types '+err)}
								else {
									image_type_ids.push({"id":data['insertId'], "type":type});
									eachCB(null);
								}
							});
						}
					}
				});
			}, function(err){
				if(err) {cb(err);}
				else { 
					cb(null, image_type_ids);
				}
			});
		} else {
			cb(null, []);
		}
	},
	getStoreReleaseTypes : function(releaseTypes, cb) {
		if(releaseTypes.length > 0) {
			var release_type_ids = [];
			async.each(releaseTypes, function(type, eachCB) {
				var getCountry = "SELECT id,name FROM release_types WHERE name = '" + type + "'";
				dbPool.query(getCountry,function(err, data){
					if(err) {return cb1('error in insert release_types '+err)}
					else {
						if(data.length > 0) {
							release_type_ids.push({"id":data[0].id, "type":type});
							eachCB(null, data[0].id);
						} else {
							var storeCountry = "INSERT IGNORE INTO release_types (name) VALUES ('"+type+"')";
							dbPool.query(storeCountry,function(err, data){
								if(err) {return cb1('error in insert release_types '+err)}
								else {
									release_type_ids.push({"id":data['insertId'], "type":type});
									eachCB(null);
								}
							});
						}
					}
				});
			}, function(err){
				if(err) {cb(err);}
				else { 
					cb(null, release_type_ids);
				}
			});
		} else {
			cb(null, []);
		}
	},

	storeData : function(req, cb){
		var table   = req.table;
		var fields  = req.fields;
		var columns = req.columns;
		var result  = req.dataset;
		var values = [];
		async.waterfall([
			function(cb1) {
				async.each(result, function(data, eachCb){
					arrVal = [];
					_.each(columns, function(column) {
						data[column] = f.empty(data[column]);
						if(_.isString(data[column])){
							replaceDash = (data[column]).replace(/\\/g, "\\\\");
							col = (replaceDash).replace(/'/g, "\\'");
							arrVal.push("'"+col+"'");
						} else if(data[column] === null) {
							arrVal.push("''");
						} else {
							arrVal.push(data[column]);
						}
					});
					values.push("("+ arrVal.join(',') +")");
					eachCb(null, values);
				},
				function(err) {
					if(err) {cb1(err);}
					else {cb1(err,values);}
				});
			}, function(values, cb1) {
				if(values.length > 0) {
					var qry = "INSERT IGNORE INTO "+table+" ("+"`"+fields.join('`,`')+"`"+" ) VALUES "+values.join(',');
					dbPool.query(qry,function(err, rows){
						if(err) {return cb1('error in insert ' +table+' '+err)}
						else {
							cb1(null, rows.affectedRows);
						}
					});
				} else {
					cb1(null);
				}
			}
		], function (err, rows) {
			if(err) {
				return cb(err, rows);
			} else {
				cb(null, rows);
			}
		});
	},
}

module.exports = commons;