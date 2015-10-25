describe('test marketstat options', function () {
	var marketstat;

	beforeEach(function () {
		marketstat = require('../marketstat');
	});

	it('is not null', function () {
		expect(marketstat).toBeDefined();
	});

	describe('implements getPath correctly', function () {

		it('when there are multiple typeids', function () {
			var expected = '/api/marketstat/json?typeid=34&typeid=35&regionlimit=10000002';
			var options = {
				typeIds: [34, 35],
				regionIds: [10000002]
			};

			var actual = marketstat.getPath(options);

			expect(expected).toBe(actual);
					
		});

		it('when there is a system limit', function () {
			var expected = '/api/marketstat/json?typeid=34&usesystem=30000142';
			var options = {
				typeIds: [34],
				systemId: 30000142
			};

			var actual = marketstat.getPath(options);

			expect(expected).toBe(actual);
		});
	});

});