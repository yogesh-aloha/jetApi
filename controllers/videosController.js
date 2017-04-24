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
	getVideoByID: function(req, callback) {
		videoModel.getVideoDetailById(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = video;