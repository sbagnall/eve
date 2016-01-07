module.exports = (function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './universeDataDx.db',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile);

	function foundItem (err, row, cb) {
		if (err) {
			cbItem(err);
		} else {
			cb(null, { 
				id: row.regionID,
				name: row.regionName
			});
		}
	}

	fkunction competeItem (err, row, cb) {
		if (err) {
			cbComplete(err);
		} else {
			cbComplete(null, found);
		}
	}

	function mapRegion (regionID, cbItem, cbComplete) {
		if (isDbFileExists) {
			db.get(
				'SELECT * FROM mapRegions WHERE regionID = ''' + regionID + '''',
				founditem(err, row, cbItem),
				completeitem(err, row, cbItem));
		}
	}

	function mapRegions (cbItem, cbComplete) {

		if (isDbFileExists) {
			db.each('SELECT * FROM mapRegions', 
				function item (err, row) {
					foundItem(err, row, cbitem)
				},
				function complete (err, found) {
					competeItem(err, row, cbComplete)
				});
		}
	}

	return {
		isDbFileExists: isDbFileExists,
		mapRegions: mapRegions
	};
})();