var util = require('util');

module.exports = {
	process: function (qry, values, name) {
		if (values) {

			if (qry.string !== '') {
				qry.string += '&';
			}

			// can be specified more than once
			qry.string += values.map(function (e) { 
				return util.format('%s=%s', name, e);
			}).join('&');
		}
	}
};