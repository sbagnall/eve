module.exports = function() {
	'use strict';

	var fs = require('fs'),
		dbFile = './universeDataDx.db',
		isDbFileExists = fs.existsSync(dbFile),
		sqlite3 = require('sqlite3').verbose(),
		db = new sqlite3.Database(dbFile);

	function getStuff () {
		if (isDbFileExists) {
			db.each('SELECT * FROM mapRegions', function (err, row) {
				if (err) {
					console.log('error: ' + err);
				} else {
					console.log('regionName: ' + row.regionName);
				}
				
			});
		}
	}

	return {
		getStuff: getStuff
	};
};