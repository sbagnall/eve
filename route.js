var util = require('util'); 

module.exports = (function () {
	var getPath = function (options) {

			if (options.systemIds && options.systemIds.length >= 2) {
				return util.format('/api/route/from/%s/to/%s', 
				 	options.systemIds[0],
					options.systemIds[1]);	
			} else {
				return '';
			}
		};

	return { 
		getPath: getPath
	};
})();
