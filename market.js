module.exports = (function () {
	'use strict';

	var request = require('request'),
		util = require('util'),
		host = 'http://api.eve-central.com';

	function makeApiCall (endpoint, options, cb) {

		var url = host + endpoint.getPath(options);

		console.log('requesting: ' + url);

		request({
			url: url,
			json: true
		}, function (err, res, body) {
			if (err) {
				cb(err, null);
			} else {
				cb(null, body);
			}
		});
	}

	return {
		makeApiCall: makeApiCall
	};
})();