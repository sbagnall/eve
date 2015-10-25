var util = require('util'), 
	multipleQueryValue = require('./multipleQueryValue'), 
	singleQueryValue = require('./singleQueryValue');


module.exports = (function () {
	var endpointName = 'quicklook',
		getQueryString = function (options) {

			// required
			if (!options.typeIds) {
				return '';
			}

			var qry = { string: '' };

			singleQueryValue.process(qry, options.typeIds[0], 'typeid');

			singleQueryValue.process(qry, options.hours, 'sethours');

			singleQueryValue.process(qry, options.minQuantity, 'setminQ');

			multipleQueryValue.process(qry, options.regionIds, 'regionlimit');

			singleQueryValue.process(qry, options.systemId, 'usesystem');
			
			return qry.string;
		},
		getPath = function (options) {
			return util.format('/api/%s/json?%s', 
			 	endpointName,
				getQueryString(options));
		};

	return { 
		getPath: getPath
	};
})();
