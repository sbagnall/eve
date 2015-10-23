var fs = require('fs'),
	dbFile = './universeDataDx.db',
	isDbFileExists = fs.existsSync(dbFile),
	sqlite3 = require('sqlite3').verbose(),
	db = new sqlite3.Database(dbFile);

var options = {
		host: url,
		port: 80,
		path: '/resource?id=foo&bar=baz',
		method: 'GET'
	},
	http = require('http');

if (isDbFileExists) {
	db.each('SELECT * FROM mapRegions', function (err, row) {
		if (err) {
			consol.log('error: ' + err);
		} else {
			console.log('regionID: ' + row.regionID);
			console.log('regionName: ' + row.regionName);
			console.log('factionID: ' + row.factionID);
		}
		
	});

	http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	}).end();

}