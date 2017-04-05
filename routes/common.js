var express          = require('express'), 
	commonController = require('../controllers/commonController.js'),
	// commonModel = require('./models/commonModel.js');
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

/* GET users listing. */
router.get('/companies', function(req, res) {
	commonController.getCompanies(req, function(data){
        res.send(data);
   	});
	// res.send('respond with a resource');
});

router.get('/countries', function(req, res) {
    commonController.getCountries(req, function(data){
        res.send(data);
    });
});

module.exports = router;
