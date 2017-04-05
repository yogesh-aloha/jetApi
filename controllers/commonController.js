var commonModel = require('../models/commonModel.js'),
	controller  = require('./appController.js');
var common = {
	getCompanies: function(req,callback){
		commonModel.allCompanies(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},
	getCountries: function(req,callback){
		commonModel.allCountries(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = common;