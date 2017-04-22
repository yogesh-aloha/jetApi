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

var imagesTableMapping = {
	"ImageType" : "image_type",
	"FilePath"  : "file_path",
	"Width"     : "width",
	"Height"    : "height",
	"Violence"  : "violence_level",
	"Sexuality" : "sexuality_level",
	"Official"  : "official"
}

var commons = {
	insertGenres : function(req, cb) {
		req.param.table   = 'genres';
		req.param.fields  = ['id','name'];
		req.param.columns = ['Id','Name'];

		commons.storeData(req, function(err, data) {
			cb(err, data);
		});
	},

	StoreAllThetericalMovies : function(req, cb) {
		var nxt       = true;
		var start     = 0;
		var total_row = 10;
		if(nxt) {
			async.whilst(
				function () { return nxt; },
				function (callback) {
					async.waterfall([
						function(cb1) {
							if( total_row === 0 ) {
								qryCount = "SELECT count(*) as total FROM movies";
								dbPool.query(qryCount,function(err, rows){
									if(err) {return cb1('error in insert companies'+err)}
									else {
										if(rows !== undefined && rows.length > 0) {
											total_row = rows[0].total;
											start     = rows[0].total;
											cb1(null, total_row);
										} else {
											cb1(null, total_row);
										}
									}
								});
							} else {
								cb1(null,total_row);
							}
						}, 
						function(total_row,cb1) {
							var options        = {};
							options.theterical = true;
							options.path       = '/TheatricalMovies/?Skip=1&Take=1&Includes=Images';
							request.sendReq(options, function(err, result) {
								console.log(result);        
								if(err) { return cb('error while getting data for Companies '+err)}
								
								if(result.length <= 0) {
									nxt = false;
									cb1(null, total_row);
								} else if(!_.isArray(result)) {
									nxt = false;
									cb1(result.message, total_row);
								} else {
									cb1(null, result);
								}
							});
						}, function(result, cb1) {
							// for each movie
							async.each(result, function(data, cb2){
								var movie_id = data['Id'];
								var theterical_data             = {},
									genres                      = {},
									movie_genre                 = {},
									releases                    = {},
									contributors                = {},
									alternate_titles            = {},
									descriptions                = {},
									companies                   = {},
									movie_companies             = {},
									tags                        = {},
									movie_tags                  = {},
									image_tags                  = {},
									movie_images                = {},
									videos                      = {},
									countries                   = {},
									movie_video_screen_captures = {},
									movie_video_encodes         = {},
									movie_video_countris        = {};

								_.each(data, function(v, k){
									if (k === 'Created' || k === 'Modified' || k === 'OriginalReleaseDate' ) {
										v = f.fullDate(v);
									}

									if(_.isArray(v)) {
										switch (k) {
											case 'Genres':
												genres = v;
												break;
											case 'Releases':
												releases = v;
												break;
											case 'Contributors':
												contributors = v;
												break;
											case 'AlternateTitles':
												alternate_titles = v;
												break;
											case 'Descriptions':
												descriptions = v;
												break;
											case 'Companies':
												companies = v;
												break;
											case 'Tags':
												tags = v;
												break;
											case 'Images':
												movie_images = v;
												break;
											case 'Videos':
												videos.push({
													'id'                  : v['Id'],
													'movie_id'            : movie_id,
													'title'               : f.empty(v['Title']),
													'type'                : f.empty(v['Type']),
													'start_date'          : f.fullDate(v['StartDate']),
													'expiration_date'     : f.fullDate(v['ExpirationDate']),
													'duration'            : f.empty(v['Duration']),
													'language'            : f.empty(v['Language']),
													'language_subtitled'  : f.empty(v['LanguageSubtitled']),
													'company'             : f.empty(v['Company']),
													'source_video_width'  : f.empty(v['SourceVideoWidth']),
													'source_video_height' : f.empty(v['SourceVideoHeight']),
													'allow_advertising'   : f.empty(v['AllowAdvertising']),
													'encoded'             : f.fullDate(v['Encoded']),
													'certification'       : f.empty(v['Certification']),
													'theatrical'          : f.empty(v['Theatrical']),
													'home_video'          : f.empty(v['HomeVideo']),
													'clean'               : f.empty(v['Clean']),
													'mature'              : f.empty(v['Mature']),
												});
												if(v['ScreenCaptures'] !== undefined && _.isArray(V['ScreenCaptures']) && V['ScreenCaptures'].length > 0) {
													_.each(v['ScreenCaptures'], function (sc_v, sc_k){
														movie_video_screen_captures.push({
															"id"             : sc_v['Id'],
															"movie_video_id" : v['Id'],
															"height"         : f.empty(sc_v['Height']),
															"width"          : f.empty(sc_v['Width']),
															"aspect"         : f.empty(sc_v['Aspect']),
															"file_path"      : f.empty(sc_v['FilePath'])
														});
													});
												}

												if(v['Encodes'] !== undefined && _.isArray(V['Encodes']) && V['Encodes'].length > 0) {
													_.each(v['Encodes'], function (en_v, en_k){
														movie_video_encodes.push({
															"id"             : en_v['Id'],
															"movie_video_id" : v['Id'],
															"bitrate"        : f.empty(en_v['BitRate']),
															"encode_type"    : f.empty(en_v['EncodeType'])
														});
													});
												}

												if(v['TargetCountries'] !== undefined && _.isArray(V['TargetCountries']) && V['TargetCountries'].length > 0) {
													_.each(v['TargetCountries'], function (c_v, c_v){
														countries.push({
															'id'   : c_v['CountryId'],
															'name' : f.empty(c_v['Name'])
														});
														movie_video_countris.push({
															"id"                : c_v['Id'],
															"video_id"          : v['Id'],
															"target_country_id" : f.empty(c_v['CountryId']),
															"country_id"        : f.empty(c_v['CountryId'])
														});
													});
												}
												break;
											default:
												break;
										}												
									} else {
										theterical_data[moviesTableMapping[k]] = v;
									}
								});

								async.parallel([
									function (cb0) {
										if(!_.isEmpty(genres)) {
											async.parallel([ // Inserting generes for movies in series
												function(cbSeries){
													req.table   = 'genres';
													req.fields  = ['id','name'];
													req.columns = ['Id','Name'];
													req.dataset = genres;
													commonModel.storeData(req, function(err, data){
														if(err) {return cb0(err);}
														else { cbSeries(null);}
													});
												}, 
												function(cbSeries){
													var mov_gen_vals = _.map(_.pluck(genres, 'Id'), function(num){ return "("+num +","+ movie_id +")"});
													var qry = "INSERT IGNORE INTO movie_genres (genre_id, movie_id) VALUES "+mov_gen_vals.join(',');
													console.log(qry);
													dbPool.query(qry,function(err, rows){
														if(err) {return cb0('error in insert movie genres '+err)}
														else {
															cbSeries(null, rows.affectedRows);
														}
													});
												}
											],
											function(err){
												if (err) {
													console.log('ERROR in insert genres on async series '+err);
													cb0(err);
												} else {
													cb0(null);
												}
											});
										} else {
											return cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(releases)) {
											countries     = _.uniq(_.pluck(releases, 'Country'));
											release_types = _.uniq(_.pluck(releases, 'Type'));
											async.waterfall([ // Inserting generes for movies in series
												function(releaseCB) {
													async.parallel({
														country_ids : function(cbContries) {
															commonModel.getStoreCountries(countries, function(err, data){
																if(err) {cb0(err);}
																else { 
																	cbContries(null, data);
																}
															});
														},
														release_type_ids : function(cbContries) {
															commonModel.getStoreReleaseTypes(release_types, function(err, data){
																if(err) {cb0(err);}
																else { 
																	cbContries(null, data);
																}
															});
														},
													},function(err, data){
														if(err) {return cb0(err);}
														else {releaseCB(null,data)}
													});
												},
												function(data,releaseCB) {
													// releases
													console.log('before insering movie_releases',data);
													var release_type_ids = data.release_type_ids;
													var country_ids      = data.country_ids;
													var releaseVals      = [];
													async.each(releases, function(rel, eachCB) {
														rel_type_id = _.find(_.map(release_type_ids, function(type){ if(type.type === rel['Type']) {return type.id} }), function(num){ return num !==undefined; });
														country_id = _.find(_.map(country_ids, function(cntry){ if(cntry.name == rel['Country']) {return cntry.id}}), function(num){ return num !==undefined; });
														releaseVals.push("("+movie_id+",'"+f.fullDate(rel['Date'])+"',"+ rel_type_id +","+ country_id +",'"+ f.empty(rel['Certification'])+"')");
														eachCB(null);
													}, function(err){
														var qry = "INSERT INTO movie_releases (movie_id,date,release_type_id,country_id,certification) VALUES "+releaseVals.join(',');
														dbPool.query(qry,function(err, data){
															if(err) {return cb1('error in insert release_types '+err)}
															else {
																releaseCB(null);
															}
														});
													});
												}
											],
											function(err){
												if (err) {
													console.log('ERROR in insert genres on async series '+err);
													cb0(err);
												} else {
													nxt = false;
													cb0(null);
												}
											});//async series
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(contributors)) {
									        _.each(contributors, function(data){
									        	data.movie_id = movie_id;
									        });
									        console.log(contributors);
											req.table   = 'movie_contributors';
											req.fields  = ['movie_id','person_id','person_name','job','character','order'];
											req.columns = ['movie_id','PersonId','PersonName','Job','Character','Order'];
											req.dataset = contributors;
											commonModel.storeData(req, function(err, data){
												if(err) {return cb0(err);}
												else { cb0(null);}
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(alternate_titles)) {
											countries     = _.uniq(_.pluck(alternate_titles, 'Country'));
											async.waterfall([ // Inserting generes for movies in series
												function(titleCB) {
													commonModel.getStoreCountries(countries, function(err, data){
														if(err) {cb0(err);}
														else { 
															titleCB(null, data);
														}
													});
												},
												function(country_ids,titleCB) {
													// releases
													var titleVals      = [];
													async.each(alternate_titles, function(rel, eachCB) {
														country_id = _.find(_.map(country_ids, function(cntry){ if(cntry.name == rel['Country']) {return cntry.id}}), function(num){ return num !==undefined; });
														console.log(country_id);
														titleVals.push("("+movie_id+",'"+ f.empty(rel['Title']) +"',"+ country_id +")");
														eachCB(null);
													}, function(err){
														console.log(titleVals);
														var qry = "INSERT INTO movie_alternate_titles (movie_id,alternate_title,country_id) VALUES "+titleVals.join(',');
														dbPool.query(qry,function(err, data){
															if(err) {return cb0('error in insert release_types '+err)}
															else {
																titleCB(null);
															}
														});
													});
												}
											],
											function(err){
												if (err) {
													console.log('ERROR in insert alternate title '+err);
													cb0(err);
												} else {
													nxt = false;
													cb0(null);
												}
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(descriptions)) {
											languages     = _.uniq(_.pluck(descriptions, 'Language'));
											async.waterfall([ // Inserting generes for movies in series
												function(descCB) {
													commonModel.getStoreLanguages(languages, function(err, data){
														if(err) {cb0(err);}
														else { 
															descCB(null, data);
														}
													});
												},
												function(language_ids,descCB) {
													// releases
													var titleVals   = [];
													async.each(descriptions, function(rel, eachCB) {
														language_id = _.find(_.map(language_ids, function(lang){ if(lang.name == rel['Language']) {return lang.id}}), function(num){ return num !==undefined; });
														titleVals.push("("+movie_id+",'"+ f.empty(rel['Description']) +"','"+ f.empty(rel['Attribution']) +"',"+ language_id +")");
														eachCB(null);
													}, function(err){
														console.log(titleVals);
														var qry = "INSERT INTO movie_descriptions (movie_id,movie_description,attribution,language_id) VALUES "+titleVals.join(',');
														dbPool.query(qry,function(err, data){
															if(err) {return cb0('error in insert movie descriptions '+err)}
															else {
																descCB(null);
															}
														});
													});
												}
											],
											function(err){
												if (err) {
													console.log('ERROR in insert moviedescriptions '+err);
													cb0(err);
												} else {
													nxt = false;
													cb0(null);
												}
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(companies)) {
											var compVals    = [];
											var movCompVals = [];
											async.each(companies, function(rel, eachCB) {
												compVals.push("("+rel['CompanyId']+",'"+ f.empty(rel['Name']) +"')");
												movCompVals.push("("+movie_id+","+ rel['CompanyId'] +")");
												eachCB(null);
											}, function(err){
												async.parallel([
													function(compCb) {
														if(compVals.length > 0) {
															var qry = "INSERT IGNORE INTO companies (id,name) VALUES "+compVals.join(',');
															dbPool.query(qry,function(err, data){
																if(err) {return cb0('error in insert companies '+err)}
																else {
																	compCb(null);
																}
															});
														} else {
															compCb(null);
														}
													},
													function(compCb) {
														if(movCompVals.length > 0) {
															var qry = "INSERT IGNORE INTO movie_companies (movie_id,company_id) VALUES "+movCompVals.join(',');
															dbPool.query(qry,function(err, data){
																if(err) {return cb0('error in insert movie movie companies '+err)}
																else {
																	compCb(null);
																}
															});
														} else {
															compCb(null);
														}
													},
												],function(err, data){
													if(err) {return cb0(err);}
													else {cb0(null)}
												});
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(tags)) {
											var tagVals    = [];
											var movTagVals = [];
											async.each(tags, function(rel, eachCB) {
												tagVals.push("("+rel['TagId']+",'"+ f.empty(rel['Name']) +"')");
												movTagVals.push("("+movie_id+","+ rel['TagId'] +")");
												eachCB(null);
											}, function(err){
												async.parallel([
													function(tagCb) {
														if(tagVals.length > 0) {
															var qry = "INSERT IGNORE INTO tags (id,name) VALUES "+tagVals.join(',');
															dbPool.query(qry,function(err, data){
																if(err) {return cb0('error in insert tags '+err)}
																else {
																	tagCb(null);
																}
															});
														} else {
															tagCb(null);
														}
													},
													function(tagCb) {
														if(movTagVals.length > 0) {
															var qry = "INSERT IGNORE INTO movie_tags (movie_id,tag_id) VALUES "+movTagVals.join(',');
															dbPool.query(qry,function(err, data){
																if(err) {return cb0('error in insert movie movie tags '+err)}
																else {
																	tagCb(null);
																}
															});
														} else {
															tagCb(null);
														}
													},
												],function(err, data){
													if(err) {return cb0(err);}
													else {cb0(null)}
												});
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(movie_images)) {
											async.eachSeries(movie_images, function(images, eachImageCB) {
												var image_type = []
												var languages = [];
												var image_tags = [];
												if(f.empty(images['ImageType']) !== null) {
													image_type.push(images['ImageType']);
												}
												if(f.empty(images['Language']) !== null) {
													languages.push(images['Language']);
												}
											
												console.log(image_type,languages);
												async.waterfall([ // Inserting generes for movies in series
													function(ImageCB) {
														async.parallel({
															image_type_ids : function(cbLang) {
																if(image_type.length > 0){
																	commonModel.getStoreImageType(image_type, function(err, data){
																		if(err) {cb0(err);}
																		else { 
																			cbLang(null, data);
																		}
																	});
																} else {
																	cbLang(null, []);
																}
															},
															language_ids : function(cbLang) {
																if(languages.length > 0){
																	commonModel.getStoreLanguages(languages, function(err, data){
																		if(err) {cb0(err);}
																		else { 
																			cbLang(null, data);
																		}
																	});
																} else {
																	cbLang(null, []);
																}
															},
														},function(err, data){
															if(err) {return cb0(err);}
															else {ImageCB(null,data)}
														});
													},
													function(data,ImageCB) {
														var image_type_ids = data.image_type_ids;
														var language_ids   = data.language_ids;
														var imageVals      = [];
														// async.eachof(images, function(img, eachCB) {
														async.forEachOf(images, function (img, key, eachCB){
															if(key === 'Language') {
																lang_id       = _.find(_.map(language_ids, function(lang){ if(lang.name == img) {return lang.id}}), function(num){ return num !==undefined; });
																imageVals['language_id'] = lang_id;
															} else if(key === 'ImageType') {
																image_type_id = _.find(_.map(image_type_ids, function(type){ if(type.type === img) {return type.id} }), function(num){ return num !==undefined; });
																imageVals['image_type_id'] = image_type_id;
															} else if(key === 'Tags') {
																console.log()
																image_tags = img;
															} 
															else {
																imageVals[imagesTableMapping[key]] = img;
															} 
															eachCB(null);
														}, function(err){
															imageVals['movie_id'] = movie_id;
															var insertData = {
																which: 'insert',
																table: 'movie_images',
																values: imageVals
															};
															dbPool.insert(insertData,  function(err, data) {
																if (err) { cb0(err); }
																 else {
																 	ImageCB(null,data['insertId'])
																 }
															});
														});
													}, 
													function(image_id,ImageCB) {
														if(!_.isEmpty(image_tags)) {
															var tagVals    = [];
															var imgTagVals = [];
															console.log(image_id);
															async.each(image_tags, function(tag, eachCB) {
																tagVals.push("("+tag['TagId']+",'"+ f.empty(tag['Name']) +"')");
																imgTagVals.push("("+image_id+","+ tag['TagId'] +")");
																eachCB(null);
															}, function(err){
																async.parallel([
																	function(tagCb) {
																		if(tagVals.length > 0) {
																			var qry = "INSERT IGNORE INTO tags (id,name) VALUES "+tagVals.join(',');
																			dbPool.query(qry,function(err, data){
																				if(err) {return cb0('error in insert tags '+err)}
																				else {
																					tagCb(null);
																				}
																			});
																		} else {
																			tagCb(null);
																		}
																	},
																	function(tagCb) {
																		if(imgTagVals.length > 0) {
																			var qry = "INSERT IGNORE INTO movie_image_tags (image_id,tag_id) VALUES "+imgTagVals.join(',');
																			dbPool.query(qry,function(err, data){
																				if(err) {return cb0('error in insert movie movie tags '+err)}
																				else {
																					tagCb(null);
																				}
																			});
																		} else {
																			tagCb(null);
																		}
																	},
																],function(err, data){
																	if(err) {return cb0(err);}
																	else {ImageCB(null)}
																});
															});
														} else {
															ImageCB(null);
														}
													}
												],
												function(err){
													if (err) {
														console.log('ERROR in insert genres on async series '+err);
														eachImageCB(err);
													} else {
														nxt = false;
														eachImageCB(null);
													}
												});
											}, function(err){
												if(err) {return cb0(err); } 
												else {cb0(null); }
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(videos)) {
											var insertData = {
												which: 'insert',
												table: 'movie_videos',
												values: videos
											};
											dbPool.insert(insertData,  function(err, data) {
												if (err) { cb0(err); }
												 else { 
												 	cb0(null); 
												 }
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(movie_video_screen_captures)) {
											var insertData = {
												which: 'insert',
												table: 'movie_video_screen_captures',
												values: movie_video_screen_captures
											};
											dbPool.insert(insertData,  function(err, data) {
												if (err) { cb0(err); }
												 else { 
												 	cb0(null); 
												 }
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(movie_video_encodes)) {
											var insertData = {
												which: 'insert',
												table: 'movie_video_encodes',
												values: movie_video_encodes
											};
											dbPool.insert(insertData,  function(err, data) {
												if (err) { cb0(err); }
												 else { 
												 	cb0(null); 
												 }
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										if(!_.isEmpty(movie_video_countris)) {
											var insertData = {
												which: 'insert',
												table: 'movie_video_countries',
												values: movie_video_countris
											};
											dbPool.insert(insertData,  function(err, data) {
												if (err) { cb0(err); }
												 else { 
												 	cb0(null); 
												 }
											});
										} else {
											cb0(null);
										}
									},
									function (cb0) {
										console.log('In TheatricalMovies');
										nxt = false;
										if(!_.isEmpty(theterical_data)) {
											var insertData = {
												which : 'insert',
												table : 'movies',
												values: theterical_data
											};
											// console.log(insertData);
											// dbPool.insert(insertData,  function(err, data) {
											// 	if (err) { console.log(err); cb0(err); }
											// 	 else {
											// 	 	total_row++; 
											// 	 	console.log('total_row',total_row)
											// 	 	cb0(null,total_row); 
											// 	 }
											// });
										} else {
											cb0(null, total_row);
										}
									},
								],function (err, data) {
									cb2(null, data[18]); 
								});
							},
							function(err, data){
								cb1(err, data);
							}); 
						}
					], function (err, rows) {
						if(err) {
							return callback(err, rows);
						} else {
							callback(null, rows);
						}
					});
				},
				function (err, data) {
					if(err) {
						console.log(err);
						return cb(err);
					} else {
						cb(null,( total_row - start));
					}
				}
			)
		}
	},
}

module.exports = commons;