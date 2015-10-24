module.exports = function () {
	'use strict';

	var options = {
		host: 'api.eve-central.com',
		port: 80,
		path: '/api/marketstat/json?typeid=34',
		method: 'GET'
	},
	http = require('http');


	http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	}).end();

};