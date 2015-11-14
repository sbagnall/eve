module.exports = (function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './universeDataDx.db',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile);

	function mapRegions (cbItem, cbComplete) {

		if (isDbFileExists) {
			db.each('SELECT * FROM mapRegions', 
				function item (err, row) {
					if (err) {
						cbItem(err);
					} else {
						cbItem(null, { 
								id: row.regionID,
								name: row.regionName
							});
					}
					
				},
				function complete (err, found) {
					if (err) {
						cbComplete(err);
					} else {
						cbComplete(null, found);
					}
				});
		}
	}

	return {
		isDbFileExists: isDbFileExists,
		mapRegions: mapRegions
	};
})();