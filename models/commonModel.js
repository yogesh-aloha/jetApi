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

	allCompanies : function(req, cb){
		var nxt = true;
		var total_row = 0;
		if(nxt) {
			async.whilst(
				function () { return nxt; },
				function (callback) {
					console.log(total_row);
					options.path = '/Common/Companies/?Skip='+total_row+'&Take=5000';
					commons.sendReq(options, function(err, result) {
						console.log(result.length);        
						if(err) { return cb('error while getting data for Companies'+err)}
						if(result.length <= 0) {
							nxt = false;
						} else if(_.isArray(result)) {
							// store data in companies table
							var values = [];
							async.waterfall([
								function(cb2){
										console.log(result);
									_.each(result, function(data){
										replaceDash = (data.Name).replace(/\\/g, "\\\\");
										name = (replaceDash).replace(/'/g, "\\'");
										values.push("("+data.Id+",'"+name+"',1)");
									});
									cb2(null,values);
								},
								function(values, cb2){
									// console.log(values);
									var qry = "REPLACE INTO companies (id,name,version_number) VALUES "+values.join(',');
									// console.log(qry);
									dbPool.query(qry,function(err, rows){
										if(err) {return cb2('error in insert companies'+err)}
										else {
											total_row = total_row + rows.affectedRows;
											cb2(null, total_row);
										}
									});
								}
							], function (err, result) {
								callback(err, total_row);
							});
						} else {
							nxt = false;
							callback(result.message);
						}
					});
				},
				function (err) {
					if(err) {
						console.log(err);
						return cb(err);
					} else {
						cb(null, total_row);
					}
				}
			);
		}
	},

	allCountries : function(req, cb){
		cb(null, 'data from model');
	},
}

module.exports = commons;