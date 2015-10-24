//marketstat.js



modules.exports = {
	endpointName: 'marketstat',
	getOptionsString: function (options) {
		if (!options.typeIds || options.typeIds.length < 1) {
			return '';
		}


		var optString = '';
		optString += options.typeIds.map(function (e) { 
			return util.format('typeId=%s', e);
		}).join('&');

		optString += util.format('&hours%s', options.hours)


}

