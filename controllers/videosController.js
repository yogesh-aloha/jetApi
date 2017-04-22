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

	insertViews: function(req, callback) {
		videoModel.postViewsCount(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	insertLikes: function(req, callback) {
		videoModel.postLikesCount(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getViews: function(req, callback) {
		videoModel.getViewsCount(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	},

	getLikes: function(req, callback) {
		videoModel.getLikesCount(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}

};

module.exports = movie;