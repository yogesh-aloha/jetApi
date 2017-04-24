var express          = require('express')
	// commonModel = require('./models/commonModel.js');
    path    = require("path"),
	router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

module.exports = router;
