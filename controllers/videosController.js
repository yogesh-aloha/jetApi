var videoModel = require('../models/videosModel'),
	controller  = require('./appController');

var movie = {
	getVideos: function(req, callback) {
		videoModel.getAllVideos(req,function(err,data){
			controller.responsify(err,data,function(response){
				callback(response);
			})
		});
	}
};

module.exports = movie;