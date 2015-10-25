module.exports = function () {
	'use strict';

	var defaultOptions = {
		typeIds: [],
		regionsIds: [],
		systemId: null,
		minQuantity: 0,
		numHours: 24,
	};

	var request = require('request'),
		util = require('util'),
		host = 'http://api.eve-central.com';

	function makeApiCall (endpoint) {
		request({
			url: host + endpoint.path,
			json: true
		}, function (err, res, body) {
			if (!err) {
				console.log(body);
			}
		});
	}

	return {
		makeApiCall: makeApiCall
	};
};