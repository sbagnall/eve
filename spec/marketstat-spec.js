describe('test makestat options', function () {
	var marketstat;

	beforeEach(function () {
		marketstat = require('../marketstat');
	});

	it('is not null', function () {
		expect(marketstat).toBeDefined();
	});

	it('implements endpointName', function () {
		expect(marketstat.endpointName).toBe('marketstat');
	});

	describe('implements getQueryString correctly', function () {
		it('when there are multiple typeids', function () {
			var expected = 'typeid=34&typeid=35&regionlimit=10000002';
			var options = {
				typeIds: [34, 35],
				regionIds: [10000002]
			};

			var actual = marketstat.getQueryString(options);

			expect(expected).toBe(actual);
					
		});
		it('when there is a system limit', function () {
			var expected = 'typeid=34&usesystem=30000142';
			var options = {
				typeIds: [34],
				systemId: 30000142
			}

			var actual = marketstat.getQueryString(options);

			expect(expected).toBe(actual);
		});
	});

});