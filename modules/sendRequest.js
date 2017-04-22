var	http   = require('http'),
	https  = require('https'),
	envVar = process.env.NODE_ENV,
	yaml   = require("js-yaml"),
	fs     = require("fs"),
	e      = yaml.load(fs.readFileSync("config/iva.yml"));

var options = {
	hostname: e[envVar].base_url,
	method  : 'GET',
	headers : { 'Ocp-Apim-Subscription-Key': e[envVar].subscription_key_common,
				'Content-Type': 'application/json'}
};

var request = {
	sendReq: function(reqOptions, cb) {
		options.path = reqOptions.path;
		if(reqOptions.theterical) {
			options.headers = { 'Ocp-Apim-Subscription-Key': e[envVar].subscription_key_theterical,
				'Content-Type': 'application/json'}
		}
		console.log(options);
		https.get(options, function (res) {
			var data = '';
			var ret = [];

			res.on('data', function (chunk) {
				data += chunk;
			});

			res.on('end', function () {
				console.log('sending result');
				console.log(data);
				if(data !== undefined && data !== '' && data.length > 0 ) {
					cb(null, JSON.parse(data));
				} else {
					cb('No data found.', data);
				}
			});
		}).on('error', function (e) {
			cb('Received error making request: ' + e.message);
		}).end();
	},	

	// http: function(data, cb){
	// 	//data.payload = {this: 'that'}
	// 	var url = require('url'),
	// 		parsedUrl = url.parse(data.url),
	// 		https = require('https'),
	// 		http = require('http'),
	// 		protocol = http,
	// 		secure = false,
	// 		param = require('jquery-param');

	// 	var out_text = data.payload;


	// 	var options = {
	// 		host: parsedUrl.hostname,
	// 	  	port: parsedUrl.port,
	// 		path: parsedUrl.path,
	// 		headers: {
	// 			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
	// 			'Referer': parsedUrl.protocol + '//' + parsedUrl.hostname
	// 		}
	// 	};

	// 	if (parsedUrl.protocol === 'https:') {
	// 		options.rejectUnauthorized = false;
	// 		protocol = https;
	// 	}
	// 	switch(data.format.toLowerCase()){
	// 		case 'json':
	// 			options.headers['Content-Type'] = 'application/json';
	// 			out_text = out_text = JSON.stringify(data.payload);
	// 			options.headers['Content-Length'] = out_text.length;
	// 			break;
	// 		case 'form-urlencoded':
	// 			options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	// 			out_text = param(data.payload);
	// 			options.headers['Content-Length'] = out_text.length;
	// 			break;
	// 		case 'xml':
	// 			var xmlParser = require("js2xmlparser");
	// 			var xmlParser = require("jstoxml");//Changed to jstoxml because j2xmlparser url encodes the s3 link.
	// 			out_text = xmlParser.toXML(data.payload);
	// 			options.headers['Content-Type'] = 'text/xml';
 //            	options.headers['Content-Length'] = Buffer.byteLength(out_text);
	// 			break;
	// 	}
	// 	options.method = 'GET';
	// 	switch(data.method.toLowerCase()){
	// 		case 'post':
	// 			options.method = 'POST';
	// 			break;
	// 		case 'put':
	// 			options.method = 'PUT';
	// 			break;
	// 		case 'get':
	// 			options.method = 'GET';
	// 			// str = qs.escape(JSON.stringify(data.payload));
	// 			// options.path = parsedUrl.path+'?'+str;
	// 			break;
	// 	}


	// 	var buffer = '';
	// 	var request = protocol.request(options, function (response) {
	// 		var data ='';
	// 		response.setEncoding('utf8');
	// 		if(response.statusCode == 201) {
	// 			cb(null, data);
	// 		}
	// 		response.setTimeout(5000, function(){
	// 			cb("timeout",null);
	// 		})
	// 		response.on('data', function (chunk) {
	// 		 	console.log('BODY: ' + chunk);
	// 			data +=chunk;
	// 			if(response.statusCode == 200 || response.statusCode == 302) {
	// 				cb(null, data);
	// 			} else {
	// 				cb('could not connect.', data);
	// 			}
	// 	  });
	// 	});

	// 	request.on('error', function (e) {
	// 			console.log('problem with request: ');
	// 			console.log(e);
	// 			cb(e,null);
	// 	});
	// 	request.write(out_text);
	// 	request.end();
	// }
};

module.exports = request;
