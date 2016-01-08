describe('test route options', function () {
	var route;

	beforeEach(function () {
		route = require('../route');
	});

	it('is not null', function () {
		expect(route).toBeDefined();
	});

	describe('implements getPath correctly', function () {
		it('even when system IDs are specified incorrectly', function () {
			var expected = '/api/route/from/Jita/to/V2-VC2';
			var options = {
				systemIds: ['Jita', 'V2-VC2'],
			};

			var actual = route.getPath(options);

			expect(expected).toBe(actual);
					
		});

		it('when two system IDs are specified', function () {
			var expected = '/api/route/from/30000142/to/30001222';
			var options = {
				systemIds: [30000142, 30001222],
			};

			var actual = route.getPath(options);

			expect(expected).toBe(actual);
					
		});
	});

});