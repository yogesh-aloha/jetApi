var db     = require('./dbModel.js'),
	http   = require('http'),
	https  = require('https'),
	envVar = process.env.NODE_ENV,
	yaml   = require("js-yaml"),
	fs     = require("fs"),
	e      = yaml.load(fs.readFileSync("config/iva.yml")),
	dbPool = require('./dbModel'),
	async = require('async'),
	_ = require('underscore');

var options = {
	hostname:'ee.iva-api.com',
	method  :'GET',
	headers : { 'Ocp-Apim-Subscription-Key': e[envVar].subscription_key_common,
				'Content-Type': 'application/json'}
};
var commons = {
	sendReq: function(options, cb) {
		console.log(options);
		https.get(options, function (res) {
			var data = '';
			var ret = [];

			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function () {
				console.log('sending result');
				cb(null, JSON.parse(data));
			});
		}).on('error', function (e) {
			cb('Received error making request: ' + e.message);
		}).end();
	},

	allCompanies : function(req, cb) {
		var nxt = true;
		var total_row = 0;
		if(nxt) {
			async.whilst(
				function () { return nxt; },
				function (callback) {
					async.waterfall([
						function(cb1) {
							if( total_row === 0 ) {
								qryCount = "SELECT count(*) as total FROM companies";
								dbPool.query(qryCount,function(err, rows){
									if(err) {return cb2('error in insert companies'+err)}
									else {
										if(rows !== undefined && rows.length > 0) {
											total_row = rows[0].total;
											cb1(null, total_row);
										} else {
											cb1(null, total_row);
										}
									}
								});
							} else {
								cb1(null,total_row);
							}
						}, function(total_row, cb1) {
							console.log(total_row);
							options.path = '/Common/Companies/?Skip='+total_row+'&Take=';
							commons.sendReq(options, function(err, result) {
								console.log(result.length);        
								if(err) { return cb('error while getting data for Companies'+err)}
								
								if(result.length <= 0) {
									nxt = false;
									cb1(null, total_row);
								} else if(!_.isArray(result)) {
									cb1(result.message, total_row);
								} else {
									var values = [];
									_.each(result, function(data){
										replaceDash = (data.Name).replace(/\\/g, "\\\\");
										name = (replaceDash).replace(/'/g, "\\'");
										values.push("("+data.Id+",'"+name+"',1)");
									});
									cb1(null, values);
								}
							});
						}, function(values, cb1) {
							if(values.length > 0) {
								var qry = "REPLACE INTO companies (id,name,version_number) VALUES "+values.join(',');
								console.log(qry);
								dbPool.query(qry,function(err, rows){
									if(err) {return cb2('error in insert companies'+err)}
									else {
										total_row = total_row + rows.affectedRows;
										cb1(null, total_row);
									}
								});
							} else {
								cb1('null', total_row);
							}
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
						cb(null, total_row);
					}
				}
			)
		}
	},

	allCountries : function(req, cb){
		cb(null, 'data from model');
	},
}

module.exports = commons;