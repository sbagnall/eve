var staticData = require('./staticData'),
	market = require('./market'),
	marketstat = require('./marketstat');

staticData.getStuff();
market.makeApiCall(marketstat, { typeIds: [34] });

