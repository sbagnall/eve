module.exports = (function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './universeDataDx.db',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile);

	function foundItem (err, row, cb) {

		if (!cb) {
			return;
		}

		if (err) {
			cb(err);
		} else {
			cb(null, { 
				id: row.regionID,
				name: row.regionName
			});
		}
	}

	function completeItem (err, row, cb) {

		if (!cb) {
			return;
		}

		if (err) {
			cb(err);
		} else {
			cb(null, row);
		}
	}

	function getRegionByName(regionName, cb) {
		if (isDbFileExists) {
			db.get('SELECT * FROM mapRegions WHERE regionName = \'' + regionName + '\'',
				function (err, row) {
					foundItem(err, row, cb);
				});
		}
	}

	function getRegionById (regionID, cb) {
		if (isDbFileExists) {
			db.get(
				'SELECT * FROM mapRegions WHERE regionID = \'' + regionID + '\'',
				function (err, row) {
					foundItem(err, row, cb);
				});
		}
	}

	function getAllMapRegions (cbItem, cbComplete) {

		if (isDbFileExists) {
			db.each('SELECT * FROM mapRegions', 
				function (err, row) {
					foundItem(err, row, cbItem);
				},
				function (err, found) {
					completeItem(err, row, cbComplete);
				});
		}
	}

	return {
		isDbFileExists: isDbFileExists,
		getAllMapRegions: getAllMapRegions,
		getRegionById: getRegionById,
		getRegionByName: getRegionByName
	};
})();