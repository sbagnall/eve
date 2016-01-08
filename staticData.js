module.exports = (function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './sqlite-latest.sqlite',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile),
		util = require('util');

	function findItems(searchTerm, cb) {
		if (isDbFileExists) {

			var error = null,
				items = [],
				sql = util.format(
					'SELECT typeID, typeName, volume FROM invTypes WHERE typeName LIKE \'%%%s%%\'', 
					searchTerm);

			db.each(
				sql,
				function (err, row) {
					if (!err && row) {
						items.push({ id: row.typeID, name: row.typeName, volume: row.volume});
					} else {
						error = err || 'no data';
					}
				},
				function (err, num) {
					cb(error, items);
				});
		}
	}

	function getItemByName(itemName, cb) {
		if (isDbFileExists) {

			var sql = util.format(
				'SELECT typeID, typeName, volume FROM invTypes WHERE typeName = \'%s\' COLLATE NOCASE',
				itemName);

			db.get(
				sql,
				function (err, row) {
					if (err || !row) {
						cb(err || 'no data');
					} else {
						cb(null, { id: row.typeID, name: row.typeName, volume: row.volume });
					}
				});
		}
	}

	function findRegion(searchTerm, cb) {
		if (isDbFileExists) {

			var error = null,
				regions = [],
				sql = util.format(
					'SELECT regionID, regionName FROM mapRegions WHERE regionName LIKE \'%%%s%%\'', 
					searchTerm);

			db.each(
				sql,
				function (err, row) {
					if (!err && row) {
						regions.push({ id: row.regionID, name: row.regionName});
					} else {
						error = err || 'no data';
					}
				},
				function (err, num) {
					cb(error, regions);
				});
		}
	}

	function getRegionByName(regionName, cb) {
		if (isDbFileExists) {

			var sql = util.format(
				'SELECT regionID, regionName FROM mapRegions WHERE regionName = \'%s\' COLLATE NOCASE', 
				regionName);

			db.get(
				sql,
				function (err, row) {
					if (err || !row) {
						cb(err || 'no data');
					} else {
						cb(null, { id: row.regionID, name: row.regionName });	
					}
				});
		}
	}

	function getRegionById (regionID, cb) {
		if (isDbFileExists) {

			var sql = util.format(
				'SELECT * FROM mapRegions WHERE regionID = %s', 
				regionID);

			db.get(
				sql,
				function (err, row) {
					if (err || !row) {
						cb(err || 'no data');
					} else {
						cb(null, { id: row.regionID, name: row.regionName });
					}
				});
		}
	}

	return {
		isDbFileExists: isDbFileExists,
		getRegionById: getRegionById,
		getRegionByName: getRegionByName,
		getItemByName: getItemByName,
		findRegion: findRegion,
		findItems: findItems
	};
})();