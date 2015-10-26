module.exports = (function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './universeDataDx.db',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile);

	function mapRegions (cb) {
		if (isDbFileExists) {
			db.each('SELECT * FROM mapRegions', function (err, row) {
				if (err) {
					cb(err);
				} else {
					cb(null, { 
							id: row.regionID,
							name: row.regionName
						});
				}
				
			});
		}
	}

	return {
		mapRegions: mapRegions
	};
})();