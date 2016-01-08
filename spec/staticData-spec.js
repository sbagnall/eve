describe('test static data', function () {
	var staticData;

	beforeEach(function () {
		staticData = require('../../staticData');
	});

	it('is not null', function () {
		expect(staticData).toBeDefined();
	});

	it('the db file is defined', function () {
		expect(staticData.isDbFileExists).toBeTruthy();
	});

	it('async tests for map regions', function () {

		var regions = [];

		beforeEach(function (done) {

			staticData.mapRegions(
				function (err, region) {
					if (!err) {
						regions.push(region);
					}
				},
				function (err, found) {
					done();
				});
		});

		afterEach(function () {
			regions = [];
		});

		it('finds regions', function (done) {
			expect(regions.length).toBeGreaterThan(0);
			expect(regions[0]).toBeDefined();
			expect(regions[0].id).toBeDefined();
			expect(regions[0].name).toBeDefined();
		});
	});
});