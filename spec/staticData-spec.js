describe('test static data', function () {
	var staticData;

	beforeEach(function () {
		staticData = require('../staticData');
	});

	it('is not null', function () {
		expect(staticData).toBeDefined();
	});
});