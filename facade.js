module.exports = (function () {
	'use strict';

	var staticData = require('./staticData'),
	q = require('q');

	function getRegion(region) {

		var defer = q.defer();

		staticData.getRegion(
			region,
			function (err, data) {
				if (err) {
					defer.reject();
				} else {
					defer.resolve(data);
				}
			});

		return defer.promise;
	}

	function getItem (item) {
		var defer = q.defer();

		staticData.getItem(
			item,
			function (err, data) {
				if (err) {
					defer.reject();
				} else {
					defer.resolve(data);
				}
			});

		return defer.promise;

	}

	return {
		getRegion: getRegion,
		getItem: getItem
	};

})();