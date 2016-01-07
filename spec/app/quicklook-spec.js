describe('test quicklook options', function () {
	var quicklook;

	beforeEach(function () {
		quicklook = require('../../quicklook');
	});

	it('is not null', function () {
		expect(quicklook).toBeDefined();
	});

	describe('implements getPath correctly', function () {
		it('when there is a single typeid', function () {
			var expected = '/api/quicklook/json?typeid=34';
			var options = {
				typeIds: [34],
			};

			var actual = quicklook.getPath(options);

			expect(expected).toBe(actual);
					
		});
	});

});