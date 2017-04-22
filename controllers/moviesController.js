var moviesModel = require('../models/moviesModel'),
	controller  = require('./appController');

var movie = {
	getGeners: function(req,callback){
		moviesModel.allGeners(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getThetericalMovies: function(req, callback) {
		moviesModel.StoreAllThetericalMovies(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = movie;