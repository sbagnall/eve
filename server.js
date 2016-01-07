var staticData = require('./staticData'),
	market = require('./market'),
	marketstat = require('./marketstat');

staticData.getRegionByName(
	'Genesis', 
	function (err, region) {
		if (err) {
			console.log(err);
		} else {
			console.log(region.id, region.name);	
		}
	});

staticData.getRegionById(
	'10000067', 
	function (err, region) {
		if (err) {
			console.log(err);
		} else {
			console.log(region.id, region.name);	
		}
	});


market.makeApiCall(marketstat, { typeIds: [34] });

