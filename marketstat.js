//marketstat.js


var multipleQueryValue = require('./multipleQueryValue'); 
var singleQueryValue = require('./singleQueryValue');
module.exports = {
	endpointName: 'marketstat',
	getQueryString: function (options) {

		// required
		if (!options.typeIds || options.typeIds.length < 1) {
			return '';
		}

		var qry = { string: '' };

		multipleQueryValue.process(qry, options.typeIds, 'typeid');

		singleQueryValue.process(qry, options.hours, 'hours');

		singleQueryValue.process(qry, options.minQuantity, 'minQ');

		multipleQueryValue.process(qry, options.regionIds, 'regionlimit');

		singleQueryValue.process(qry, options.systemId, 'usesystem');
		
		return qry.string;
	}
};
