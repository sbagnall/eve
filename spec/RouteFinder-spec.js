var RouteFinder = require('../RouteFinder');

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

	
});	

