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

	function getItem(item, cb) {
		if (isDbFileExists) {

			var sql = '';

			if (item.id) {
				sql = util.format(
					'SELECT typeID, typeName, volume FROM invTypes WHERE typeID = \'%s\' COLLATE NOCASE',
					item.id);
			} else if (item.name) {
				sql = util.format(
					'SELECT typeID, typeName, volume FROM invTypes WHERE typeName = \'%s\' COLLATE NOCASE',
					item.name);
			}

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

	function getRegion(region, cb) {
		if (isDbFileExists) {

			var sql = '';

			if (region.id) {
				sql = util.format(
					'SELECT * FROM mapRegions WHERE regionID = %s', 
					region.id);
			} else if (region.name) {
				sql = util.format(
					'SELECT regionID, regionName FROM mapRegions WHERE regionName = \'%s\' COLLATE NOCASE', 
					region.name);	
			}

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
		getRegion: getRegion,
		getItem: getItem,
		findRegion: findRegion,
		findItems: findItems
	};
})();