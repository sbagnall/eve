describe('facade tests', function () {
	var facade;

	beforeEach(function () {
		facade = require('../facade');
	});

	it('is not null', function () {
		expect(facade).toBeDefined();
	});

	it('test region by name', function () {
		var expected = { id: 10000067, name: 'Genesis' };

		facade.getRegion({ name: 'Genesis' })
		.then(function (data) {
			expect(expected).toEqual(data);
		});
	});

	it('test region by id', function () {
		var expected = { id: 10000067, name: 'Genesis' };

		facade.getRegion({ id: 10000067 })
		.then(function (data) {
			expect(expected).toEqual(data);
		});
	});

	it('test item by name', function () {
		var expected = { id: 2889, name: '200mm AutoCannon II', volume: 5 };

		facade.getItem({ name: '200mm AutoCannon II' })
		.then(function (data) {
			expect(expected).toEqual(data);
		});
	});

	it('test item by id', function () {
		var expected = { id: 2889, name: '200mm AutoCannon II', volume: 5 };

		facade.getItem({ id: 2889 })
		.then(function (data) {
			expect(expected).toEqual(data);
		});
	});

});