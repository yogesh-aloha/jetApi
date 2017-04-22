var express          = require('express'), 
	moviesController = require('../controllers/moviesController'),
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

router.get('/genre', function(req, res) {
    moviesController.getGenres(req, function(data){
        res.send(data);
    });
});

router.get('/theterical', function(req, res) {
    /**
    * @api {get} /movies/theterical Request to store theterical data
    * @apiName /movies/theterical
    * @apiGroup movies
    *
    * @apiParam {null} -
    *
    * @apiSuccess {String} Error Error if any
    * @apiSuccess {String} Success  Success message
    */
    moviesController.getThetericalMovies(req, function(data){
        res.send(data);
    });
});

module.exports = router;
