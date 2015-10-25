//marketstat.js

var util = require('util');

module.exports = {
	endpointName: 'marketstat',
	getQueryString: function (options) {

		// required
		if (!options.typeIds || options.typeIds.length < 1) {
			return '';
		}

		var qry = '';

		if (options.typeIds) {

			if (qry !== '') {
				qry += '&';
			}

			// can be specified more than once
			qry += options.typeIds.map(function (e) { 
				return util.format('typeid=%s', e);
			}).join('&');
		}

		if (options.hours) {
			
			if (qry !== '') {
				qry += '&';
			}

			qry += util.format('hours=%s', options.hours);	
		}

		if (options.minQuantity) {
			
			if (qry !== '') {
				qry += '&';
			}

			qry += util.format('minQ=%s', options.minQuantity);
		}

		if (options.regionIds) {

			if (qry !== '') {
				qry += '&';
			}

			// can be specified more than once
			qry += options.regionIds.map(function (e) { 
				return util.format('regionlimit=%s', e);
			}).join('&');
		}
		
		if (options.systemId) {

			if (qry !== '') {
				qry += '&';
			}

			qry += util.format('usesystem=%s', options.systemId);	
		}


		return qry;
	}
};
