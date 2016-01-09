var RouteFinder = require('../RouteFinder'),
	spokeAndWheel = function (node) {
		if (node === 0) {
			return [1, 2, 3, 4, 5, 6];
		} else {
			return [0, (node % 6) + 1, (node % 6) - 1];
		}
	};

describe('RouteFinder tests', function () {

	it('constructor fails if no waypoints are defined', function () {

		expect(function () { new RouteFinder(); }).toThrow();
	});

	it('constructor fails if no getNeighbours function not defined', function () {

		expect(function () { new RouteFinder([1, 2]); }).toThrow();
	});

	it('is not null', function () {

		var finder = new RouteFinder([1, 2], function (node) { return (node === 1) ? [2] : [1] ; });

		expect(finder).toBeDefined();
	});

	it('simple route should return as expected', function () {

		var finder = new RouteFinder([1, 2], function (node) { return (node === 1) ? [2] : [1] ; }),
			expected = [1, 2];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});


	it('a simple route with multiple hops', function () {

		var finder = new RouteFinder([1, 5], function (node) { return [node + 1, node - 1]; }),
			expected = [1, 2, 3, 4, 5];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});

	it('hub to outer node', function () {

		var finder = new RouteFinder([0, 5], spokeAndWheel),
			expected = [0, 5];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});

	it('outer to adjacent outer', function () {

		var finder = new RouteFinder([2, 3], spokeAndWheel),
			expected = [2, 3];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});

	it('outer to three adjacent outer - quickest route through hub', function () {

		var finder = new RouteFinder([1, 4], spokeAndWheel),
			expected = [1, 0, 4];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});

	it('multiple waypoints', function () {

		var finder = new RouteFinder([1, 2, 5, 4], spokeAndWheel),
			expected = [1, 2, 0, 5, 4];

		var actual = finder.getRoute();

		expect(expected).toEqual(actual);
	});





	
});	

