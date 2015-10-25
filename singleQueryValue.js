var util = require('util');

module.exports = {
	process: function (qry, value, name) {
		if (value) {
			
			if (qry.string !== '') {
				qry.string += '&';
			}

			qry.string += util.format('%s=%s', name, value);	
		}
	}
}; 