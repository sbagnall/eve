describe('test static data', function (done) {
	var staticData;

	beforeEach(function () {
		staticData = require('../staticData');
	});

	it('is not null', function () {
		expect(staticData).toBeDefined();
	});

	it('the db file is defined', function () {
		expect(staticData.isDbFileExists).toBeTruthy();
	});

	describe('test item functions', function () {

		it('test find', function (done) {
			var expected = [
				{ id: 486, name: '200mm AutoCannon I', volume: 5 },
				{ id: 821, name: '200mm AutoCannon I Blueprint', volume: 0.01 },
				{ id: 2889, name: '200mm AutoCannon II', volume: 5 },
				{ id: 2890, name: '200mm AutoCannon II Blueprint', volume: 0.01 }
			];

			staticData.findItems(
				'200mm AutoCannon I',
				function (err, items) {
					expect(expected).toEqual(items);

					done();
				});
		});
	});

	describe('test region functions', function () {
		describe('test find', function () {

			it('test find', function (done) {
				var	expected = [
					{ id: 10000067, name: 'Genesis' }
				];

				staticData.findRegion(
					'enesis', 
					function (err, regions) {
						expect(expected).toEqual(regions);

						done();	
					});
			});

		});
		
		
		describe('test get by name', function () {

			it('test correct capitalization', function(done) {

				var expectedName = 'Genesis',
				expectedId = 10000067;

				staticData.getRegionByName(
					'Genesis', 
					function (err, region) {
						expect(expectedName).toBe(region.name);
						expect(expectedId).toBe(region.id);

						done();
					});
			});


			it('test incorrect capitalization', function(done) {

				var expectedName = 'Genesis';
					expectedId = 10000067;

				staticData.getRegionByName(
					'genesis', 
					function (err, region) {
						expect(expectedName).toBe(region.name);
						expect(expectedId).toBe(region.id);		
						
						done();
					});
			});
		});
	});
	
	describe('test get region by id', function () {

		it('by id', function (done) {

			var expectedName = 'Genesis',
				expectedId = 10000067;

			staticData.getRegionById(
				'10000067', 
				function (err, region) {
					expect(expectedId).toBe(region.id);
					expect(expectedName).toBe(region.name);

					done();
				});
		});
	});
});