var express      = require('express'),
	path         = require('path'),
	cors         = require('cors'),
	favicon      = require('serve-favicon'),
	logger       = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser'),
	yaml         = require("js-yaml"),
	envVar       = process.env.NODE_ENV,
	fs           = require("fs");
	
// Routing
var	index = require('./routes/index'),
	users = require('./routes/users'),
	common = require('./routes/common');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
// app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow
	// Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use('/', index);
app.use('/users', users);
app.use('/common', common);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

 //Make our db accessible to our router
app.use(function(req, res, next) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
        console.log('\n**********');
        console.log('Time: ' + req._startTime);
        console.log('ENV: ' + process.env.NODE_ENV);
        console.log('Req url: ' + req.method + ':' + req.url);
        console.log('Req Headers: ' + JSON.stringify(req.headers));
        console.log('Req Params: ' + JSON.stringify(req.params));
        console.log('Req Body: ' + JSON.stringify(req.body) + '\n----\n');
    }
    next();
});

module.exports = app;
