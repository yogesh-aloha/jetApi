var mysql            = require('mysql'),
	yaml    	     = require("js-yaml"),
	fs      		 = require("fs"),
	envVar  		 = process.env.NODE_ENV,
	e       		 = yaml.load(fs.readFileSync("config/database.yml"));
	dbConnectionPool = mysql.createPool({
	    host     : e[envVar].host,
	    user     : e[envVar].username,
	    password : e[envVar].password,
	    database : e[envVar].database
	});


var dbPool = {
	query: function(qry,res){
		console.log('Query: ' + qry);
		dbConnectionPool.getConnection(function(err, connection) {
			// if (err) {
			// 	console.log('Call Engine connection error: '+err);
			// 	res(err);
			// 	return;
			// }
			connection.query(qry, function(err, rows, fields) {
				if (err) {
					console.log('Query error: ' + err);
					res(err);
				}
				connection.release();
				res(err, rows);
			});
		});
	},
	insert: function(data, res){
		var qry = queryBuilder('insert', data);
		console.log('Call Engine Insert: ' + qry);
		dbConnectionPool.getConnection(function(err, connection) {
			if (err) {
				console.log('Ce Connection error: ' + err);
			}
			connection.query(qry, function(err, rows, fields) {
				if (err) {
					console.log('Query error: ' + err);
					res(err);
				} else {
					res(null, rows);
				}
				connection.release();

			});
		});
	},
	update: function(data, res){
		var qry = queryBuilder('update', data);
		console.log('Call Engine Update: ' + qry);
		dbConnectionPool.getConnection(function(err, connection) {
			connection.query(qry, function(err, rows, fields) {
				if (err) {
					console.log('Query error: ' + err);
					res(err);
				}
				connection.release();
				res(err, rows);
			});
		});
	},
	delete: function(table, id, res){
		var qry = "DELETE FROM " + table + " WHERE id = " + id + " LIMIT 1";
		console.log('Call Engine Delete: ' + qry);
		dbConnectionPool.getConnection(function(err, connection) {
			connection.query(qry, function(err, rows, fields) {
				if (err) {
					console.log('Query error: ' + err);
					res(err);
				}
				connection.release();
				res(null, rows);
			});
		});
	}
};


module.exports = dbConnectionPool

function queryBuilder(type,data){
	var qry = '';
	switch(type){
		case 'insert':
			var fields = [];
			var values = '';
			var count = 0;
			for (var key in data.values) {
				count ++;
				fields.push(key);
				var val = data.values[key];

				if (val === 'CURRENT_TIMESTAMP' || val === 'NOW()' || val === 'NOT NULL') {
					values += val;
				} else if (val === '' || val === 'null' || val === 'NULL' || val === null) {
					values += 'NULL';
				} else if (typeof val === 'string') {
					if (val.indexOf("'") >= 0) {
						val = val.replace(/'/g, "''"); // escape single quotes
					}
					values += "'" + val + "'"; 
				} else {
					values += val;
				}
				if (count < Object.keys(data.values).length) {
					values += ",";
				}
			}
			qry = "INSERT INTO " + data.table + " (" + fields.join(',') + ") VALUES (" + values + ")";
		break;

		case 'update':
			var set = [];
			for (var field in data.values) {
				if (field === data.table + '_id' || field === 'id') { continue; } // skip primary key
				var val = data.values[field];
				var str = field + " = ";
				if (typeof val === 'string') {
					if (val === 'CURRENT_TIMESTAMP' || val === 'NOW()' || val === 'NOT NULL') {
						str += val;
					} else if (val === '' || val === 'null' || val === 'NULL' || val === null) {
						str += 'NULL';
					} else {
						if ((val).indexOf("\'") > -1) {
							val = (val).replace(/\'/g, "''"); // escape single quotes
						} else if ((val).indexOf("'") > -1) {
							val = (val).replace(/'/g, "''"); // escape single quotes
						}
						str += "'"+val+"'";
					}
				} else {
					str += val;
				}
				set.push(str);
			}
			qry = "UPDATE " +  data.table + " SET " + set.join(',')+(data.where ? data.where : " WHERE " + data.table + "_id = " + data.values[data.table + '_id']);
		break;
	}
	return qry;
}
