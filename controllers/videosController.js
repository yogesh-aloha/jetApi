var videoModel = require('../models/videosModel'),
	controller  = require('./appController');

var movie = {
	getVideos: function(req, callback) {
		videoModel.getAllVideos(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getSortedVideos: function(req, callback) {
		videoModel.getSortedVideos(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getSearchVideos: function(req, callback) {
		videoModel.getSearchVideos(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getYMAL: function(req, callback) {
		videoModel.getYMAL(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = movie;