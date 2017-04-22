var	dbPool  = require('./dbModel'),
	_       = require('underscore');
	f =  require('../lib/functions.js');


function getCompanyId (name) {
	checkQry = "SELECT id FROM companies WHERE name = '"+ name +"'";
	dbPool.query(checkQry,function(err, rows){
		if(rows.length > 0) {
			return rows[0].id;
		}
	}
}

module.exports = {
	getCompanyId: getCompanyId
};