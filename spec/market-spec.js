describe('test market', function () {
	var market,
		marketstat;

	beforeEach(function () {
		market = require('../market');
		marketstat = require('../marketstat');
	});

	it('test', function () {
		market.makeApiCall(
			marketstat, 
			{ typeIds: [34] },
			function (err, data) {
				// TODO: 
			});

	});
});