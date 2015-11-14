var props = require("./testprops.js");
var EVEoj = require("../../eveoj/EVEoj.js");

var SDD;
var promise;

var promise_done;
var promise_fail;
var progress_counter;

var inv_types_size = 22328;

function promise_wait() {
	if (promise_done) return true;
	return false;
}

function promise_thenDone() {
	promise_done = true;
	promise_fail = false;
}

function promise_thenFail() {
	promise_done = true;
	promise_fail = true;
}

function progress_track() {
	progress_counter++;
}

describe("SDD.Table setup", function() {
	'use strict';
	
	it("loads a valid source", function() {
		if (EVEoj.Utils.isBrowser) {
			SDD = EVEoj.SDD.Create("json", {
				path: props.SDD_URL_path
			});
		} else {
			SDD = EVEoj.SDD.Create("json", {
				path: props.SDD_file_path
			});
		}
		expect(SDD).not.toBeNull(null);
		promise = SDD.LoadMeta();
		expect(promise).not.toEqual(null);
		promise_done = false;
		promise_fail = undefined;
		promise.then(promise_thenDone, promise_thenFail);
	});
});

describe("SDD.Table setup", function() {
	it("succeeds asynchronously", function() {
		waitsFor(promise_wait, 2500);
		runs(function() {
			expect(promise_done).toEqual(true);
			expect(promise_fail).toBeDefined();
			expect(promise_fail).toEqual(false);
		});
	});
	it("has valid metainfo", function() {
		expect(SDD.version).toEqual(props.SDD_version);
		expect(SDD.verdesc).toEqual(props.SDD_verdesc);
		expect(SDD.schema).toEqual(props.SDD_schema);
	});
});

describe("SDD.Table pre-load", function() {
	var table;

	beforeEach(function() {
		table = SDD.GetTable("invTypes");
	});

	it("has expected metainfo", function() {
		var table = SDD.GetTable("invTypes");
		var columns = [
			"typeID", "groupID", "typeName", "mass", "volume", "capacity", "portionSize",
			"raceID", "basePrice", "published", "marketGroupID", "chanceOfDuplicating", "iconID"
		];
		expect(table.name).toEqual("invTypes");
		expect(table.keyname).toEqual("typeID");
		expect(table.columns).toEqual(columns);
		expect(table.segments.length).toEqual(1);
		expect(table.c.index).toEqual(0);
		expect(table.c.published).toEqual(9);
	});
	it("returns false for unknown entries", function() {
		expect(table.GetEntry(37)).toEqual(false);
		expect(table.GetEntry(60000000)).toEqual(false);
	});

});

describe("SDD.Table.Load", function() {
	it("returns a promise", function() {
		promise = SDD.GetTable("invTypes").Load();
		expect(promise).not.toBeNull(null);
		expect(typeof(promise.then)).toEqual("function");
		promise_done = false;
		promise_fail = undefined;
		promise.then(promise_thenDone, promise_thenFail);
	});
});

describe("SDD.Table", function() {
	var table;

	beforeEach(function() {
		table = SDD.GetTable("invTypes");
	});

	it("succeeds asynchronously", function() {
		waitsFor(promise_wait, 2500);
		runs(function() {
			expect(promise_done).toEqual(true);
			expect(promise_fail).toBeDefined();
			expect(promise_fail).toEqual(false);
		});
	});
	it("has expected data", function() {
		expect(table.length).toEqual(table.loaded);
		expect(table.length).toEqual(inv_types_size);
	});
	it("returns null for non-existent entries", function() {
		expect(table.GetEntry(60000000)).toBeNull();
		expect(table.GetEntry("potato")).toBeNull();
	});
	it("returns row for valid entries", function() {
		var row1 = table.GetEntry("37");
		var row2 = table.GetEntry(37);
		expect(row1).not.toBeNull();
		expect(row2).not.toBeNull();
		expect(row1).toBe(row2);
	});
	it("has expected index data for entry", function() {
		var row = table.GetEntry(37);
		expect(row.length).toEqual(13);
		expect(row[0]).toEqual(37);
		expect(row[table.c.index]).toEqual(37);
		expect(row[table.c.typeID]).toEqual(37);
	});
	it("has expected column data for entry", function() {
		var row = table.GetEntry(37);
		expect(row[table.c.groupID]).toEqual(18);
		expect(row[table.c.typeName]).toEqual("Isogen");
		expect(row[table.c.mass]).toEqual(0);
		expect(row[table.c.volume]).toEqual(0.01);
		expect(row[table.c.capacity]).toEqual(0);
		expect(row[table.c.portionSize]).toEqual(1);
		expect(row[table.c.raceID]).toEqual(0);
		expect(row[table.c.basePrice]).toEqual(128.00);
		expect(row[table.c.published]).toEqual(true);
		expect(row[table.c.marketGroupID]).toEqual(1857);
		expect(row[table.c.chanceOfDuplicating]).toEqual(0);
		expect(row[table.c.iconID]).toEqual(402);
	});
});

describe("SDD.Table.Load partial", function() {
	it("returns a promise", function() {
		var table = SDD.GetTable("invTypesDesc");
		expect(table.segments.length).toEqual(3);
		progress_counter = 0;
		promise = table.Load({
			key: 37,
			progress: progress_track
		});
		expect(promise).not.toBeNull(null);
		expect(typeof(promise.then)).toEqual("function");
		promise_done = false;
		promise_fail = undefined;
		promise.then(promise_thenDone, promise_thenFail);
	});
});

describe("SDD.Table partial", function() {
	var table;

	beforeEach(function() {
		table = SDD.GetTable("invTypesDesc");
	});

	it("succeeds asynchronously", function() {
		waitsFor(promise_wait, 2500);
		runs(function() {
			expect(promise_done).toEqual(true);
			expect(promise_fail).toBeDefined();
			expect(promise_fail).toEqual(false);
		});
	});
	it("called progress tracker", function() {
		expect(progress_counter).toEqual(1);
	});
	it("has expected data", function() {
		expect(table.loaded).toEqual(7500);
		expect(table.length).toEqual(inv_types_size);
		expect(table.segments[0].loaded).toEqual(true);
		expect(table.segments[1].loaded).toEqual(false);
	});
	it("returns null for non-existent entries", function() {
		expect(table.GetEntry(1)).toBeNull();
	});
	it("returns false for still unknown entries", function() {
		expect(table.GetEntry(16966)).toEqual(false);
	});
	it("returns row for valid entries", function() {
		var row1 = table.GetEntry("37");
		var row2 = table.GetEntry(37);
		expect(row1).toBeDefined();
		expect(row2).toBeDefined();
		expect(row1).not.toBeNull();
		expect(row2).not.toBeNull();
		expect(row1).not.toBe(false);
		expect(row2).not.toBe(false);
		expect(row1).toBe(row2);
	});
	it("has expected index data for entry", function() {
		var row = table.GetEntry(37);
		expect(row.length).toEqual(3);
		expect(row[0]).toEqual(37);
		expect(row[table.c.index]).toEqual(37);
		expect(row[table.c.typeID]).toEqual(37);
	});
	it("has expected column data for entry", function() {
		var row = table.GetEntry(37);
		expect(row[table.c.description]).toEqual("Light-bluish crystal, formed by intense pressure deep within large asteroids and moons. Used in electronic and weapon manufacturing. Only found in abundance in a few areas.\n\nMay be obtained by reprocessing the following ores:\n\n<color='0xFFFF0000'>0.0</color> security status solar system or lower:\n<a href=showinfo:1229>Gneiss</a>, <a href=showinfo:17865>Iridescent Gneiss</a>, <a href=showinfo:17866>Prismatic Gneiss</a>\n\n<color='0xFFFF4D00'>0.2</color> security status solar system or lower:\n<a href=showinfo:21>Hedbergite</a>, <a href=showinfo:17440>Vitric Hedbergite</a>, <a href=showinfo:17441>Glazed Hedbergite</a>\n<a href=showinfo:1231>Hemorphite</a>, <a href=showinfo:17444>Vivid Hemorphite</a>, <a href=showinfo:17445>Radiant Hemorphite</a>\n\n<color='0xFF00FF00'>0.7</color> security status solar system or lower:\n<a href=showinfo:20>Kernite</a>, <a href=showinfo:17452>Luminous Kernite</a>, <a href=showinfo:17453>Fiery Kernite</a>\n<a href=showinfo:1227>Omber</a>, <a href=showinfo:17867>Silvery Omber</a>, <a href=showinfo:17868>Golden Omber</a>");
		expect(row[table.c.yamldata].hasOwnProperty("iconID")).toEqual(true);
		expect(row[table.c.yamldata].iconID).toEqual(402);
	});
});

describe("SDD.Table.Load remaining", function() {
	it("returns a promise", function() {
		var table = SDD.GetTable("invTypesDesc");
		expect(table.segments.length).toEqual(3);
		progress_counter = 0;
		promise = table.Load({
			progress: progress_track
		});
		expect(promise).not.toBeNull(null);
		expect(typeof(promise.then)).toEqual("function");
		promise_done = false;
		promise_fail = undefined;
		promise.then(promise_thenDone, promise_thenFail);
	});
});

describe("SDD.Table remaining", function() {
	var table;

	beforeEach(function() {
		table = SDD.GetTable("invTypesDesc");
	});

	it("succeeds asynchronously", function() {
		waitsFor(promise_wait, 2500);
		runs(function() {
			expect(promise_done).toEqual(true);
			expect(promise_fail).toBeDefined();
			expect(promise_fail).toEqual(false);
		});
	});
	it("called progress tracker", function() {
		expect(progress_counter).toEqual(2);
	});
	it("has expected data", function() {
		expect(table.loaded).toEqual(table.length);
		expect(table.length).toEqual(inv_types_size);
		expect(table.segments[0].loaded).toEqual(true);
		expect(table.segments[1].loaded).toEqual(true);
		expect(table.segments[2].loaded).toEqual(true);
	});
	it("returns null for non-existent entries", function() {
		expect(table.GetEntry(1)).toBeNull();
	});
	it("returns row for valid entries", function() {
		var row1 = table.GetEntry("37");
		var row2 = table.GetEntry(37);
		var row3 = table.GetEntry(16966);
		var row4 = table.GetEntry(367230);
		expect(row1).toBeDefined();
		expect(row2).toBeDefined();
		expect(row3).toBeDefined();
		expect(row4).toBeDefined();
		expect(row1).not.toBeNull();
		expect(row2).not.toBeNull();
		expect(row3).not.toBeNull();
		expect(row4).not.toBeNull();
		expect(row1).not.toBe(false);
		expect(row2).not.toBe(false);
		expect(row3).not.toBe(false);
		expect(row4).not.toBe(false);
	});
});