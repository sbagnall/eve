var aStar = require('a-star'),
	_ = require('lodash'),
	assert = require('assert');

module.exports = function RouteFinder(waypointIDs, getNeighbours) {

	'use strict';

	assert(waypointIDs);
	assert(getNeighbours);

	var startNode = waypointIDs[0],
		endNode = waypointIDs[waypointIDs.length - 1],
		route = [startNode],
		visitedWaypoints = [];

	this.getNeighbours = getNeighbours;

	this.getRoute = function () {

		route = [startNode];

		visitedWaypoints = [startNode];

		// visit all waypoints - except last
		while (visitedWaypoints.length < (waypointIDs.length - 1)) {
			addWaypoint(isAllowedWaypoint);
		}

		// get final leg
		addWaypoint(function (node) { return node === endNode; });

		return route;
	};


	var getPath = function (options) {
			var defaults = {
					neighbor: getNeighbours,
					distance: function (a, b) { return 1; },
					heuristic: function (node) { return 1; }
				};

			_.extend(defaults, options);

			var result = aStar(defaults); 

			return (result.status === 'success') ? result.path : [];
		},
		// allowed waypoints are all but the start and
		// last - which is delt with seperately as it 
		// must be the fial destination
		isAllowedWaypoint = function (node) {
			return node !== startNode && 
				node !== endNode && 
				!_.contains(visitedWaypoints, node) &&
				_.contains(waypointIDs, node); 
		},

		addWaypoint = function (isEnd) {
			var options = {
				start: route[route.length - 1],
				isEnd: isEnd
			};

			// remove the first node which is the
			// last node already in route
			var path = getPath(options).slice(1);
			route = route.concat(path);
			visitedWaypoints.push(path[path.length - 1]);
		};
};

