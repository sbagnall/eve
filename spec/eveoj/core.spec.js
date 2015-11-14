var EVEoj = require("../../eveoj/EVEoj.js");

describe("core", function() {
	'use strict';
	
	it("has expected version", function() {
		expect(EVEoj.VERSION).toEqual("0.2.0");
	});
});