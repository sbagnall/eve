var facade = require('./facade'),
market = require('./market'),
marketstat = require('./marketstat');

(function () {
	'use strict';

	var regionId = 0,
	systemId = 0,
	hours = 24,
	minQty = 0,
	typeId = 0;

	facade.getRegion({ name: 'Genesis' })
	.then(function (region) {
		regionId = region.id;
		return facade.getItem({ name: '200mm AutoCannon II' });
	})
	.then(function (item) {
		typeId = item.id;
	})
	.then(function () {
		market.makeApiCall(
			marketstat, 
			{ regionIds: [regionId], systemId: systemId, hours: hours, minQty: minQty, typeIds: [typeId]  },
			function (err, data) {
				console.log(data);
			});	
	});
})();
