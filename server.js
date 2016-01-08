var staticData = require('./staticData'),
	market = require('./market'),
	marketstat = require('./marketstat'),
	regionId = '',
	systemId = '',
	hours = '',
	minQty = 0,
	typeIds = [];

// staticData.findRegion(
// 	'enesis', 
// 	function (err, regions) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			regionId = regions[0].id;	
// 		}
// 	});

// staticData.findItem(
// 	'200mm AutoCannon',
// 	function (err, items) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			typeIds = items.map(function (item) {
// 				return item.id;
// 			});
// 		}
// 	});


staticData.getRegionByName(
	'Genesis', 
	function (err, region) {
		regionId = region.id;	
	});

console.log(regionId);

// staticData.findItem(
// 	'200mm AutoCannon II',
// 	function (err, item) {
// 		typeIds.push(item.id);
// 	});



// market.makeApiCall(
// 	marketstat, 
// 	{ typeIds: [34] },
// 	function (err, data) {
// 		console.log(data);
// 	});

