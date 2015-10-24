module.exports = function () {
	'use strict';

	var defaultOptions = {
		typeIds: [],
		regionsIds: [],
		systemId: null,
		minQuantity: 0,
		numHours: 24,
	};

	var _ = require('lodash');

	var request = require('request'),
		util = require('util'),
		host = 'http://api.eve-central.com',
		endpoint = '/api/%s/json';

	function makeApiCall (endpoint) {
		request({
			url: util.format('%s%s?%s',
				host,
				util.format(endpointFormat, endpoint.Name),
				endpoint.getOptionsString(_.extend(defaultOptions, options)),
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