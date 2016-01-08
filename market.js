module.exports = (function () {
	'use strict';

	var request = require('request'),
		util = require('util'),
		host = 'http://api.eve-central.com';

	function makeApiCall (endpoint, options, cb) {
		request({
			url: host + endpoint.getPath(options),
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