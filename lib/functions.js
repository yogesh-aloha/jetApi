function mysqlTimestamp() {
	Number.prototype.padLeft = function(base,chr){
	   var  len = (String(base || 10).length - String(this).length)+1;
	   return len > 0? new Array(len).join(chr || '0')+this : this;
	};

	var d = new Date(),
		dformat = [ d.getFullYear(),
					(d.getMonth()+1).padLeft(),
					d.getDate().padLeft()].join('-')+
					' ' +
				  [ d.getHours().padLeft(),
					d.getMinutes().padLeft(),
					d.getSeconds().padLeft()].join(':');

		return dformat;
}

function formatDateTime(dt) {
	Number.prototype.padLeft = function(base,chr){
	   var  len = (String(base || 10).length - String(this).length)+1;
	   return len > 0? new Array(len).join(chr || '0')+this : this;
	};

	var d = new Date(dt),
		dformat = [ d.getFullYear(),
					(d.getMonth()+1).padLeft(),
					d.getDate().padLeft()].join('-')+
					' ' +
				  [ d.getHours().padLeft(),
					d.getMinutes().padLeft(),
					d.getSeconds().padLeft()].join(':');

	return dformat;
}

function inDateRange(start, end, dte){
	start_date = null;
	if (start) {
		start_date = new Date(start);
	}
	var end_date = null;
	if (end) {
		end_date = new Date(end);
	}
	var chk_date = new Date(dte);
	if ((start_date <= chk_date || !start_date) && (chk_date <= end_date || !end_date)) {
		return true;
	} else {
		return false;
	}
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function diffArray(a, b) {
	var seen = [], diff = [];
	for ( var i = 0; i < b.length; i++)
		seen[b[i]] = true;
	for ( var j = 0; j < a.length; j++)
		if (!seen[a[j]])
		diff.push(a[j]);
	return diff;
}

function removeJsonNode(obj, node){
	var r = {};
	for (var key in obj){
		if (key != node) {
			r[key] = obj[key];
		}
	}
	return r;
}

function pg_escape_string (str) {
	str = str.replace("'","''");
  	return (str + '').replace(/[\\"()@#!*$%^&]/g,'\\$&').replace(/\u0000/g, '\\0');
}
function empty(e) {

	if (typeof e == 'object') {
		return JSON.stringify(e) === '{}';
	}
	switch (e) {
	case "":
	case null:
	case false:
	case undefined:
		return null;
	default:
		return e;
	}
}

function fullDate(date,toEnd){
	var dateStr = date.split(' ')[0];
	var dateArr = dateStr.split('-');
	var timeStr = date.split(' ')[1];
	var fDate = '';

	if (!timeStr) {
		switch(dateArr.length){
			case 1:
				if(toEnd){
					fDate = new Date(dateArr[0], 11, 31,23,59,59);
				} else {
					fDate = new Date(dateArr[0], 0, 1,0,0,0);
				}
			break;
			case 2:
				if (toEnd) {
					fDate = new Date(dateArr[0],parseInt(dateArr[1]),0,23,59,59);
				}else{
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),1,0,0,0);
				}
			break;
			case 3:
				if (toEnd) {
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),23,59,59);
				}else{
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),0,0,0);
				}
			break;
		}
	} else {
		var timeArr = timeStr.split(':');
		switch(timeArr.length){
			case 1:
				if(toEnd){
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),timeArr[0],59,59);
				} else {
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),timeArr[0],0,0);
				}
			break;
			case 2:
				if (toEnd) {
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),timeArr[0],timeArr[1],59);
				}else{
					fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),timeArr[0],timeArr[1],0);
				}
			break;
			case 3:
				fDate = new Date(dateArr[0],parseInt(dateArr[1]-1),parseInt(dateArr[2]),timeArr[0],timeArr[1],timeArr[2]);
			break;
		}
	}
	return formatDateTime(fDate);
}

module.exports = {
	mysqlTimestamp: mysqlTimestamp,
	inDateRange: inDateRange,
	toTitleCase: toTitleCase,
	diffArray: diffArray,
	removeJsonNode: removeJsonNode,
	fullDate: fullDate,
	empty: empty,
	pg_escape_string:pg_escape_string
};
