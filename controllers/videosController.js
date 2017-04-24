var videoModel = require('../models/videosModel'),
	controller  = require('./appController');

var video = {
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
	},
	getVideoByID: function(req, callback) {
		videoModel.getVideoDetailById(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = video;