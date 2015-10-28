var staticData = require('./staticData'),
	market = require('./market'),
	marketstat = require('./marketstat');

staticData.mapRegions(function (err, region) {
	console.log(region.id, region.name);
});
market.makeApiCall(marketstat, { typeIds: [34] });

