var express          = require('express'), 
	videoController = require('../controllers/videosController'),
	router = express.Router();

// Add headers
router.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


    /**
    * @api {get} /videos list
    * @apiName /get/list
    * @apiGroup videos
    *
    * @apiParam {null} -
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/list', function(req, res) {
    videoController.getVideos(req, function(data){
        res.send(data);
    });
});
    
    /**
    * @api {get} /videos/views/id views
    * @apiName /get/views
    * @apiGroup videos
    *
    * @apiParam {Number} id Video ID.
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/views/:videoId', function(req, res) {
    videoController.getViews(req, function(data){
        res.send(data);
    });
});

    /**
    * @api {get} /videos/sort sort
    * @apiName /get/sort
    * @apiGroup videos
    *
    * @apiParam {string} type genre,release_date,title,contributors
    * @apiParam {string} subType asc or desc
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/sort', function(req, res) {
    videoController.getSortedVideos(req, function(data){
        res.send(data);
    });
});


    /**
    * @api {get} /videos/search search
    * @apiName /get/search
    * @apiGroup videos
    *
    * @apiParam {string} search parameter to search in video.
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/search', function(req, res) {
    videoController.getSearchVideos(req, function(data){
        res.send(data);
    });
});

    /**
    * @api {get} /videos/ymal YMAL
    * @apiName /get/ymal
    * @apiGroup videos
    *
    * @apiParam {Number} Id Video Id 
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/ymal/:id', function(req, res) {
    videoController.getYMAL(req, function(data){
        res.send(data);
    });
});
    /**
    * @api {post} /videos/views views
    * @apiName /getYMAL
    * @apiGroup videos
    *
    * @apiParam {number} video_id Video id
    * @apiParam {string} device_id Device id
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.post('/views', function(req, res) {
    videoController.insertViews(req, function(data){
        res.send(data);
    });
});

    /**
    * @api {get} /videos/likes/id likes
    * @apiName /get/likes
    * @apiGroup videos
    *
    * @apiParam {Number} Id Video Id
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.get('/likes/:videoId', function(req, res) {
    videoController.getLikes(req, function(data){
        res.send(data);
    });
});

    /**
    * @api {post} /videos/likes likes
    * @apiName /post/likes
    * @apiGroup videos
    *
    * @apiParam {number} video_id Video id
    * @apiParam {string} device_id Device id
    * @apiParam {bollean} like Like / Dislike
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
router.post('/likes', function(req, res) {
    videoController.insertLikes(req, function(data){
        res.send(data);
    });

});
    /**
    * @api {get} /videos/details details
    * @apiName /get/details
    * @apiGroup videos
    *
    * @apiParam {Number} Id Video Id
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */

router.get('/details/:id', function(req, res) {
    videoController.getVideoByID(req, function(data){
        res.send(data);
    });
});

    

module.exports = router;
