!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EVEoj=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/extend');


},{"./lib/extend":2}],2:[function(_dereq_,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = _dereq_('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.0.8';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":3}],3:[function(_dereq_,module,exports){

/**!
 * is
 * the definitive JavaScript type testing library
 * 
 * @copyright 2013 Enrico Marino
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toString = objProto.toString;
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  "boolean": 1,
  "number": 1,
  "string": 1,
  "undefined": 1
};

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a =
is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return value !== undefined;
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toString.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) if (owns.call(value, key)) return false;
    return true;
  }

  if ('[object String]' === type) {
    return '' === value;
  }

  return false;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function (value, other) {
  var strictlyEqual = value === other;
  if (strictlyEqual) {
    return true;
  }

  var type = toString.call(value);
  var key;

  if (type !== toString.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return strictlyEqual;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is['undefined'] = function (value) {
  return value === undefined;
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is['arguments'] = function (value) {
  var isStandardArguments = '[object Arguments]' === toString.call(value);
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = function (value) {
  return '[object Array]' === toString.call(value);
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.boolean(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.boolean
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.boolean = function (value) {
  return '[object Boolean]' === toString.call(value);
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.boolean(value) && (value === false || value.valueOf() === false);
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.boolean(value) && (value === true || value.valueOf() === true);
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return '[object Date]' === toString.call(value);
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return '[object Error]' === toString.call(value);
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || '[object Function]' === toString.call(value);
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return '[object Number]' === toString.call(value);
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.int
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.int = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return value && '[object Object]' === toString.call(value);
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return '[object RegExp]' === toString.call(value);
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return '[object String]' === toString.call(value);
};


},{}],4:[function(_dereq_,module,exports){
"use strict";

exports.M_per_LY = 9.4605284e+15; // meters per lightyear
exports.M_per_AU = 149597870700; // meters per AU

},{}],5:[function(_dereq_,module,exports){
"use strict";

exports.Const = _dereq_("./Const.js");
exports.Utils = _dereq_("./Utils.js");
exports.SDD = _dereq_("./SDD.js");
exports.map = _dereq_("./map.js");
if (exports.Utils.isBrowser) {
	exports.IGB = _dereq_("./IGB.js");
}

exports.V_MAJOR = 0;
exports.V_MINOR = 2;
exports.V_PATCH = 0;
exports.VERSION = exports.V_MAJOR + "." + exports.V_MINOR + "." + exports.V_PATCH;

},{"./Const.js":4,"./IGB.js":6,"./SDD.js":11,"./Utils.js":12,"./map.js":15}],6:[function(_dereq_,module,exports){
/* global jQuery: false */
/* global CCPEVE: false */
"use strict";

var $ = jQuery;

function IGBClick(ev) {
	var corp_id,
		chan,
		cctype,
		trustme,
		trust_req = false,
		href
		;
	
	href = $(this).attr("href");
	if (!href.match(/^eve:/i)) return; // huh.. that's odd
	ev.preventDefault();		

	if (href.match(/^eve:trust:/i)) trust_req = true;
	href = href.replace(/^eve:\s*/i, "").replace(/^trust:\s*/i, "");
	
	/*
	if (typeof(navigator) != 'undefined' && navigator.hasOwnProperty('userAgent') && !navigator.userAgent.match(/EVE\-IGB/)) {
		// straight browser detection for IGB
		return;
	}
	*/
	if (typeof(CCPEVE) == "undefined") {
		// impl based detection for IGB
		return;
	}
	
	corp_id = $(this).data("igb-corpid");
	chan = $(this).data("igb-chan");
	cctype = $(this).data("igb-cctype");
	trustme = $(this).data("igb-trustme");

	if (corp_id && corp_id > 0) CCPEVE.showInfo(2, corp_id);
	if (chan) CCPEVE.joinChannel(chan);
	if (cctype) CCPEVE.createContract(cctype);
	if (trustme) CCPEVE.requestTrust(trustme);	
}

$(function () {
	$("a[href^='eve:']").click(IGBClick);
});	

},{}],7:[function(_dereq_,module,exports){
"use strict";

// var Utils = require('./Utils');
var P = exports.P = {}; // public methods

exports.D = {
	// default object properties
	tables: {},
	version: null,
	verdesc: null,
	schema: null
};

// return promise:
//		reject({context: ctx, source: this, stats: status, error: errmsg});
//		resolve({context: ctx, source: this});
P.LoadMeta = function() {
	return null;
};

P.HasTable = function (tbl) {
	return this.tables.hasOwnProperty(tbl);
};

P.GetTables = function () {
	var tbl_list = [],
		tbl
		;
	for (tbl in this.tables) {
		if (!this.tables.hasOwnProperty(tbl)) continue;
		tbl_list.push(tbl);
	}
	
	return tbl_list;
};

P.GetTable = function (tbl) {
	if (!tbl || !this.tables.hasOwnProperty(tbl)) return null;
	return this.tables[tbl];
};

},{}],8:[function(_dereq_,module,exports){
"use strict";

var Utils = _dereq_("./Utils");
var req_browser_ignore = _dereq_;
		
if (Utils.isBrowser) {
	// AJAX-based JSON loader; only for browserify/standalone version
	module.exports = _dereq_("./SDD.Source.json_browser.js");
}
else {
	// nodeFS based JSON loader; required in a way that browserify will ignore
	module.exports = req_browser_ignore("./SDD.Source.json_node.js");
}

},{"./SDD.Source.json_browser.js":9,"./Utils":12}],9:[function(_dereq_,module,exports){
"use strict";

var extend = _dereq_("node.extend");
var Source = _dereq_("./SDD.Source.js");
var Table = _dereq_("./SDD.Table.js");
var Utils = _dereq_("./Utils.js");
		
var P = exports.P = Utils.create(Source.P); // public methods, inherit from base Source class

exports.D = extend(true, {}, Source.D, {
	// default object properties
	cfg: {
		cache: true,
		datatype: "json",
		timeout: 0
	},
	jsonfiles: {}
});

exports.Create = function(config) {
	var obj = Utils.create(P);
	extend(true, obj, exports.D);
	obj.Config(config);
	return obj;
};

P.Config = function(config) {
	extend(this.cfg, config);
};

function MetainfDone(data, status, jqxhr, p, ctx) {
	var tbl,
		newt,
		i;

	if (!data) return p.reject({context: ctx, source: this, status: "error", error: "invalid data object"});
	if (!data.hasOwnProperty("formatID") || data.formatID != "1") return p.reject({context: ctx, source: this, status: "error", error: "unknown data format"});
	if (!data.hasOwnProperty("schema") || !data.hasOwnProperty("version")) return p.reject({context: ctx, source: this, status:"error", error: "data has no version information"});
	if (!data.hasOwnProperty("tables") || !data.hasOwnProperty("tables")) return p.reject({context: ctx, source: this, status: "error", error: "data has no table information"});
	this.version = data.version;
	this.schema = data.schema;
	if (data.hasOwnProperty("verdesc")) this.verdesc = data.verdesc;

	// reset stuff
	this.tables = {};
	this.jsonfiles = {};
	
	for (tbl in data.tables) {
		if (!data.tables.hasOwnProperty(tbl)) continue;
		
		// create a new table from our metadata
		newt = Table.Create(tbl, this, data.tables[tbl]);
		this.tables[newt.name] = newt;
		
		// collect a list of json sources
		for (i = 0; i < newt.segments.length; i++) {
			if (this.jsonfiles.hasOwnProperty(newt.segments[i].tag)) continue;
			this.jsonfiles[newt.segments[i].tag] = {loaded: false, p: null};
		}
	}
	
	p.resolve({context: ctx, source: this});
}

function MetainfFail(jqxhr, status, error, p, ctx) {
	p.reject({context: ctx, source: this, status: status, error: error});
}

P.LoadMeta = function(ctx) {
	var self = this,
		p = Utils.deferred()
		;
		
	if (!this.cfg.hasOwnProperty("path") || typeof this.cfg.path != "string") {
		return p.reject({context: ctx, source: this, status: "error", error: "path is required"}).promise;
	}
	if (this.cfg.datatype != "json" && this.cfg.datatype != "jsonp") {
		return p.reject({context: ctx, source: this, status: "error", error: "invalid datatype: " + this.cfg.datatype}).promise;
	}

	Utils.ajax({
		dataType: this.cfg.datatype,
		cache: this.cfg.cache,
		jsonp: false,
		timeout: this.cfg.timeout,
		jsonpCallback: "EVEoj_metainf_callback",
		url: this.cfg.path + "/metainf." + this.cfg.datatype
	}).then(
		function (data, status, jqxhr) { MetainfDone.apply(self, [data, status, jqxhr, p, ctx]) },
		function (jqxhr, status, error) { MetainfFail.apply(self, [jqxhr, status, error, p, ctx]) }
	);
	
	return p.promise;
};

function LoadFileDone(ctx, jsf, data) {
	if (!data || !data.hasOwnProperty("tables")) {
		this.jsonfiles[jsf].p.reject({context: ctx, tag: jsf, status: "error", error: "invalid data object"});
	}
	else if (!data.hasOwnProperty("formatID") || data.formatID != "1") {
		this.jsonfiles[jsf].p.reject({context: ctx, tag: jsf, status: "error", error: "unknown data format"});
	}
	else {
		this.jsonfiles[jsf].loaded = true;
		this.jsonfiles[jsf].data = data;
		this.jsonfiles[jsf].p.resolve({context: ctx, tag: jsf, data: data});
	}
}
function LoadFileFail(ctx, jsf, status, error) {
	this.jsonfiles[jsf].p.reject({context: ctx, tag: jsf, status: status, error: error});
}
P.LoadTag = function(jsf, ctx) {
	var self = this;
	if (this.jsonfiles[jsf].loaded) {
		return Utils.deferred().resolve({tag: jsf, data: this.jsonfiles[jsf].data}).promise;
	}
	else if (this.jsonfiles[jsf].p !== null) {
		return this.jsonfiles[jsf].p.promise;
	}
	else {
		this.jsonfiles[jsf].p = Utils.deferred();
		Utils.ajax({
			dataType: this.cfg.datatype,
			cache: this.cfg.cache,
			jsonp: false,
			timeout: this.cfg.timeout,
			jsonpCallback: "EVEoj_" + jsf + "_callback",
			url: this.cfg.path + "/" + jsf + "." + this.cfg.datatype
		}).then(
			function (data) { LoadFileDone.apply(self, [ctx, jsf, data]) },
			function (jqxhr, status, error) { LoadFileFail.apply(self, [ctx, jsf, status, error]) }
		);
		return this.jsonfiles[jsf].p.promise;		
	}	
};

},{"./SDD.Source.js":7,"./SDD.Table.js":10,"./Utils.js":12,"node.extend":1}],10:[function(_dereq_,module,exports){
"use strict";

var extend = _dereq_("node.extend");
var Utils = _dereq_("./Utils.js");

var P = exports.P = {}; // public methods
			
// default object properties
exports.D = {
	src: null, // the EVEoj.SDD.Source that owns this table
	name: null, // the name of this table
	keyname: null, // the primary key name
	columns: [], // the list of columns
	colmap: {}, // a reverse lookup map for column indexes
	c: null, // shortcut to colmap
	colmeta: {}, // a map of metainfo about each complex column
	subkeys: [], // any subkeys (this implies a nested entry structure)
	data: {}, // the data for this table (shallow references into raw data from source)
	segments: [], // the segment information for this table
	length: 0, // the total number of entries in this table
	loaded: 0 // the total number of currently loaded entries
};
exports.Create = function (name, src, meta) {
	var obj,
		i,
		keyarr
		;
							
	obj = Utils.create(P);
	extend(true, obj, exports.D);
	
	// sort out relevant metadata details
	obj.src = src;
	obj.name = name;
	
	// determine the source(s) of this table's data
	if (meta.hasOwnProperty("j")) {
		// only one segment and it is stored with other stuff
		obj.segments.push({min: 0, max: -1, tag: meta.j, loaded: false, p: null });
	}
	else if (meta.hasOwnProperty("s")) {
		//  at least one segment that is stored independently
		for (i = 0; i < meta.s.length; i++) {
			obj.segments.push({min: meta.s[i][1], max: meta.s[i][2], tag: name + "_" + meta.s[i][0], loaded: false, p: null });
		}
	}
		
	// find out the key info for this table
	if (meta.hasOwnProperty("k")) {
		keyarr = meta.k.split(":");
		obj.keyname = keyarr.shift();
		for (i = 0; i < keyarr.length; i++) obj.subkeys.push(keyarr[i]);
	}
	
	// add keys to the column definition
	if (obj.keyname) obj.columns.push(obj.keyname);
	else obj.columns.push("index");
	for (i = 0; i < obj.subkeys.length; i++) {
		obj.columns.push(obj.subkeys[i]);
	}

	// add meta columns to column definition
	if (meta.hasOwnProperty("c")) {
		for (i = 0; i < meta.c.length; i++) obj.columns.push(meta.c[i]);
	}
	
	// create a reverse lookup map for columns
	for (i = 0; i < obj.columns.length; i++) obj.colmap[obj.columns[i]] = i;
	obj.colmap.index = 0;
	obj.c = obj.colmap;
	
	// grab the colmeta extra info
	if (meta.hasOwnProperty("m")) {		
		extend(true, obj.colmeta, meta.m);
	}

	// grab the length
	if (meta.hasOwnProperty("l")) {
		obj.length = meta.l;
	}
	
	return obj;
};

// get the entry for the key provided; all keys must be numeric values for segmentation
P.GetEntry = function (key) {
	var i,
		nkey,
		skey;
	
	// get a guaranteed numeric and guaranteed string version of the key; numeric
	// is for segment comparison, string is for object property lookup
	nkey = parseInt(key, 10);
	if (isNaN(nkey)) return null;
	skey = nkey.toString(10);
	if (this.data.hasOwnProperty(skey)) return this.data[skey];
	
	// if we don't have this key, determine if we ought to by now
	for (i = 0; i < this.segments.length; i++) {
		if (nkey >= this.segments[i].min && (nkey <= this.segments[i].max || this.segments[i].max == -1)) {
			if (this.segments[i].loaded) return null; // the key should be in this segment
			else return false; // the segment isn't loaded yet
		}
	}
	
	return null;		
};		

// get the value for the key (or entry array) and column provided
P.GetValue = function (key, col) {
	var entry;
	if (key instanceof Array) entry = key;
	else entry = this.GetEntry(key);
	if (entry === null || entry === false) return entry;
	if (isNaN(col)) {
		if (!this.colmap.hasOwnProperty(col)) return null;
		col = this.colmap[col];
	}
	return entry[col];
};

function UnshiftIndexes(data, indexes) {
	var key, i;
	for (key in data) {
		if (!data.hasOwnProperty(key)) return;
		if (!data[key]) return;
		indexes.push(parseInt(key, 10));
		if (data[key] instanceof Array) {
			for (i = indexes.length - 1; i >= 0; i--) {
				data[key].unshift(indexes[i]);
			}
		}
		else UnshiftIndexes(data[key], indexes);
		indexes.pop();
	}
}
function SegLoadDone(tag, data, done, p, ctx, progress) {
	var i;
	done.has++;
	for (i = 0; i < this.segments.length; i++) {
		if (this.segments[i].tag != tag) continue;
		if (data.tables.hasOwnProperty(this.name) && data.tables[this.name].hasOwnProperty("d")) {		
			if (!data.tables[this.name].hasOwnProperty("U")) {
				// put the indexes into the first columns of every row
				UnshiftIndexes(data.tables[this.name].d, []);
				data.tables[this.name].U = true;
			}
			extend(this.data, data.tables[this.name].d);
			if (data.tables[this.name].hasOwnProperty("L")) {
				this.loaded += data.tables[this.name].L;
			}
			else if (done.needs == 1) {
				this.loaded = this.length;
			}
			this.segments[i].loaded = true;
		}
		break;
	}	
	if (progress !== null) progress({context: ctx, table: this, has: done.has, needs: done.needs});
	if (done.has >= done.needs) p.resolve({context: ctx, table: this});
}
function SegLoadFail(tag, status, error, p, ctx) {
	p.reject({context: ctx, table: this, status: status, error: error});
}

// load data for this table; returns a deferred promise object as this is an async thing
// if key is provided, loads ONLY the segment containing that key
P.Load = function(opts) {
	var p = Utils.deferred(),
		self = this,
		all_needs,
		done,
		nkey,
		skey,
		i,
		segment,
		o = {
			context: null,
			key: null,
			progress: null
		},
		thenDone,
		thenFail
		;
	extend(o, opts);
	
	if (o.key === null) {
		// load all segments
		all_needs = [];
		for (i = 0; i < this.segments.length; i++) {
			if (!this.segments[i].loaded) {
				// this segment not yet loaded
				all_needs.push(i);
			}
		}
		done = {needs: all_needs.length, has: 0};
		if (all_needs.length > 0) {
			thenDone = function (arg) { SegLoadDone.apply(self, [arg.tag, arg.data, done, p, o.context, o.progress]) };
			thenFail = function (arg) { SegLoadFail.apply(self, [arg.tag, arg.status, arg.error, p, o.context]) };
			for (i = 0; i < all_needs.length; i++) {
				segment = this.segments[all_needs[i]];
				if (!segment.p) {
					// this segment not pending load
					segment.p = this.src.LoadTag(segment.tag);
				}
				segment.p.then(thenDone, thenFail);
			}
			return p.promise;
		}
		else {
			p.resolve({context: o.context, table: this});
			return p.promise;
		}	
	}
	else {
		// determine which segment the key is in
		nkey = parseInt(o.key, 10);
		if (isNaN(nkey)) {
			p.reject({context: o.context, table: this, status: "badkey", error: "invalid key; not numeric"});
			return this.p.promise;
		}
		skey = nkey.toString(10);
		segment = -1;
		for (i = 0; i < this.segments.length; i++) {
			if (nkey >= this.segments[i].min && (nkey <= this.segments[i].max || this.segments[i].max == -1)) {
				// the key should be in this segment
				segment = this.segments[i];
				break;
			}
		}
		
		if (segment === -1) return p.reject({context: o.context, table: this, status: "badkey", error: "invalid key; no segment contains it"}).promise;
		if (segment.loaded) return p.resolve({context: o.context, table: this}).promise;
		
		if (segment.p === null) segment.p = this.src.LoadTag(segment.tag);
		done = {needs: 1, has: 0};
		segment.p.then(
			function (arg) { SegLoadDone.apply(self, [arg.tag, arg.data, done, p, o.context, o.progress]) },
			function (arg) { SegLoadFail.apply(self, [arg.tag, arg.status, arg.error, p, o.context]) }
		);
		
		return p.promise;
	}
};

P.ColIter = function (colname) {
	var colnum;
	if (this.colmap.hasOwnProperty(colname)) {
		colnum = this.colmap[colname];
		return function (e) { return e[colnum] };
	}
	else return function () { return undefined };
};

P.ColPred = function (colname, compare, value) {
	var colnum;
	if (this.colmap.hasOwnProperty(colname)) {
		colnum = this.colmap[colname];
		if (compare == "==" || compare == "eq") return function (e) { return e[colnum] == value };
		if (compare == "!=" || compare == "ne") return function (e) { return e[colnum] != value };
		if (compare == "===" || compare == "seq") return function (e) { return e[colnum] === value };
		if (compare == "!==" || compare == "sne") return function (e) { return e[colnum] !== value };
		else if (compare == ">" || compare == "gt") return function (e) { return e[colnum] > value };
		else if (compare == ">=" || compare == "gte") return function (e) { return e[colnum] >= value };
		else if (compare == "<" || compare == "lt") return function (e) { return e[colnum] < value };
		else if (compare == "<=" || compare == "lte") return function (e) { return e[colnum] < value };
	}
	else return function () { return false };	
};

},{"./Utils.js":12,"node.extend":1}],11:[function(_dereq_,module,exports){
"use strict";

// var Utils = require('./Utils');

exports.Source = _dereq_("./SDD.Source.js");
exports.Source.json = _dereq_("./SDD.Source.json.js");
exports.Table = _dereq_("./SDD.Table.js");

// create a new data source of the type specified with the config provided;
// EVEoj.data.Source.<type> handles the implementation details
exports.Create = function(type, config) {
	if (typeof exports.Source[type] === "undefined" || typeof exports.Source[type].Create !== "function") return null;
	return exports.Source[type].Create(config);
};

},{"./SDD.Source.js":7,"./SDD.Source.json.js":8,"./SDD.Table.js":10}],12:[function(_dereq_,module,exports){
/* global jQuery: false */
/* global Promise: false */
"use strict";

exports.isBrowser = typeof(window) !== "undefined";

var req_browser_ignore = _dereq_;
var BB;

var F = function () {};

// implementations from external stuff (mostly jQuery) that might theoretically change later
exports.create = (typeof Object.create === "function") ?
	Object.create :
	function (o) {
		// object create polyfill (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
		if (arguments.length > 1) throw Error("Second argument not supported");
		if (o === null) throw Error("Cannot set a null [[Prototype]]");
		if (typeof(o) !== "object") throw TypeError("Argument must be an object");
		F.prototype = o;
		return new F();
	};

if (exports.isBrowser) {
	// grab deferred from global, custom-built bluebird (inserted by uglify)
	exports.deferred = Promise.defer;

	// grab ajax from jQuery (implied dependency)
	exports.ajax = jQuery.ajax;
}
else {
	// bluebird required in a way that browserify will ignore (since using custom built for standalone)
	BB = req_browser_ignore("bluebird");
	exports.deferred = BB.defer;
}

exports.FormatNum = function (val, fixed) {
	var stringy = [],
		base = String(Math.floor(val)),
		k = -1,
		i = 0,
		decimals
		;
	
	fixed = fixed || 0;
	
	for (i = base.length - 1; i >= 0; i--) {
		if (k % 3 === 0) {
			k = 1;
			stringy.push(",");
		}
		else if (k == -1) {
			k = 1;
		}
		else {
			k++;
		}
		stringy.push(base.charAt(i));
	}
	base = "";
	for (i = stringy.length - 1; i >= 0; i--) {
		base = base.concat(stringy[i]);
	}		
	
	if (fixed > 0) {
		decimals = val.toFixed(fixed);
		base += decimals.substring(decimals.length - fixed - 1);
	}
	
	return base;
};

},{}],13:[function(_dereq_,module,exports){
"use strict";
var extend = _dereq_("node.extend");
var Utils = _dereq_("./Utils.js");

var P = exports.P = {}; // public methods

exports.D = {
	ID: null,
	name: null,
	regionID: null,
	constellationID: null,
	pos: {x: null, y: null, z: null},
	posMax: {x: null, y: null, z: null},
	posMin: {x: null, y: null, z: null},
	luminosity: null,
	border: null,
	fringe: null,
	corridor: null,
	hub: null,
	international: null,
	regional: null,
	constellation: null,
	contiguous: null,
	security: null,
	sec: null,
	factionID: null,
	radius: null,
	sunTypeID: null,
	securityClass: null,
	wormholeClassID: null,
	stationCount: null		
};
exports.Create = function (tbl, ID) {	
	var obj,
		sys,
		col,
		nID
		;
		
	nID = parseInt(ID, 10);
		
	sys = tbl.GetEntry(nID);
	if (!sys) return null;
	obj = Utils.create(P);
	extend(true, obj, exports.D);
	col = tbl.colmap;
	
	obj.ID = nID;
	obj.name = sys[col.solarSystemName];
	obj.regionID = sys[col.regionId];
	obj.constellationID = sys[col.constellationID];
	obj.pos = {x: sys[col.x], y: sys[col.y], z: sys[col.z]};
	obj.posMin = {x: sys[col.xMin], y: sys[col.yMin], z: sys[col.zMin]};
	obj.posMax = {x: sys[col.xMax], y: sys[col.yMax], z: sys[col.zMax]};
	obj.luminosity = sys[col.luminosity];
	obj.border = sys[col.border];
	obj.fringe = sys[col.fringe];
	obj.corridor = sys[col.corridor];
	obj.hub = sys[col.hub];
	obj.international = sys[col.international];
	obj.regional = sys[col.regional];
	obj.constellation = sys[col.constellation];
	obj.contiguous = sys[col.contiguous];
	obj.security = sys[col.security];
	obj.sec = (obj.security > 0) ? obj.security.toFixed(1) : "0.0";
	obj.factionID = (sys[col.factionID] !== 0) ? sys[col.factionID] : null;
	obj.radius = sys[col.radius];
	obj.sunTypeID = sys[col.sunTypeID];
	obj.securityClass = sys[col.securityClass];
	obj.wormholeClassID = sys[col.wormholeClassID];
	obj.stationCount = (sys[col.stationCount]) ? sys[col.stationCount] : 0;

	return obj;
};

},{"./Utils.js":12,"node.extend":1}],14:[function(_dereq_,module,exports){
"use strict";

var extend = _dereq_("node.extend");
var Utils = _dereq_("./Utils.js");

var P = exports.P = {}; // public methods
exports.D = {
	// default object properties
	curidx: 0,
	map: null,
	keyset: []
};
exports.Create = function (map) {
	var obj,
		key,
		tbl
		;

	obj = Utils.create(P);
	extend(true, obj, exports.D);
	obj.map = map;
	tbl = map.tables["map" + map.space + "SolarSystems"].tbl;
	
	for (key in tbl.data) {
		if (!tbl.data.hasOwnProperty(key)) continue;
		obj.keyset.push(key);
	}
	
	return obj;	
};

P.HasNext = function () {
	if (this.curidx < this.keyset.length) return true;
};

P.Next = function () {
	return this.map.GetSystem({id: this.keyset[this.curidx++]});
};

},{"./Utils.js":12,"node.extend":1}],15:[function(_dereq_,module,exports){
"use strict";

var extend = _dereq_("node.extend");
var Const = _dereq_("./Const.js");
var Utils = _dereq_("./Utils.js");
var System = _dereq_("./map.System.js");
var SystemIter = _dereq_("./map.SystemIter.js");

var P = exports.P = {}; // public methods for this class
	
exports.D = {
	// default properties for new instances
	src: null,
	tables: {},
	sysNameMap: {},
	sysNames: [],
	routeGraph: {},
	space: null,
	loaded: false,
	loadingP: null,
	c: {
		jumps: false,
		planets: false,
		moons: false,
		belts: false,
		gates: false,
		celestials: false,
		statistics: false,
		landmarks: false
	}
};

var sys_cache = null; // a place to put generated systems so we don't keep re-creating them
	
exports.Create = function(src, type, config) {
	if (!src || typeof src.HasTable != "function") return null;
	if (type != "J" && type != "K" && type != "W") return null;
	var obj = Utils.create(P);
	extend(true, obj, exports.D);
	if (config) extend(true, obj.c, config);
	obj.src = src;
	obj.space = type;
	
	return obj;
};

function LoadDone(tbl, ctx) {
	var has = 0,
		needs = 0,
		key
		;

	for (key in this.tables) {
		if (!this.tables.hasOwnProperty(key)) continue;
		needs += this.tables[key].tbl.segments.length;
		if (key == tbl.name) this.tables[key].done = true;
		if (this.tables[key].done) {
			has += this.tables[key].tbl.segments.length;
		}
	}
	
	if (has >= needs) {
		LoadInit.apply(this);
		this.loadingP.resolve({context: ctx, map: this});
	}
}
function LoadFail(tbl, ctx, status, error) {
	this.loadingP.reject({context: ctx, map: this, status: status, error: error});
}
function LoadProgress(arg, progress) {
	var has = 0,
		needs = 0,
		key,
		i
		;

	if (progress === null) return;
	
	// arg: {context: ctx, table: this, has: done.has, needs: done.needs}
	// ignoring input progress info and counting finished segments ourself
	for (key in this.tables) {
		if (!this.tables.hasOwnProperty(key)) continue;
		needs += this.tables[key].tbl.segments.length;
		for (i = 0; i < this.tables[key].tbl.segments.length; i++) {
			if (this.tables[key].tbl.segments[i].loaded) has++;
		}
	}
	
	progress({context: arg.context, map: this, has: has, needs: needs});
}
P.Load = function(opts) {
	var self = this,
		t = this.tables,
		key,
		thenDone,
		thenFail,
		progressFunc = null,
		o = {
			context: null,
			progress: null
		}		
		;
	extend(o, opts);

	if (this.loaded) return Utils.deferred().resolve({context: o.context, map: this}).promise;
	if (this.loadingP) return this.loadingP.promise;
	this.loadingP = Utils.deferred();
	
	// setup required and optional tables
	t["map" + this.space + "Regions"] = false;
	t["map" + this.space + "Constellations"] = false;
	t["map" + this.space + "SolarSystems"] = false;
	if (this.space == "K" || this.space == "J") {
		t["map" + this.space + "SolarSystemJumps"] = false;
		if (this.c.jumps) {
			t.mapRegionJumps = false;
			t.mapConstellationJumps = false;
			t.mapJumps = false;
		}
		if (this.c.belts) t["map" + this.space + "Belts"] = false;
		if (this.c.gates) t["map" + this.space + "Gates"] = false;		
		if (this.c.landmarks) t.mapLandmarks = false;
	}
	if (this.c.planets) t["map" + this.space + "Planets"] = false;
	if (this.c.moons) t["map" + this.space + "Moons"] = false;
	if (this.c.celestials) t["map" + this.space + "Celestials"] = false;
	if (this.c.statistics) t["map" + this.space + "CelestialStatistics"] = false;

	thenDone = function (arg) { LoadDone.apply(self, [arg.table, arg.context]) };
	thenFail = function (arg) { LoadFail.apply(self, [arg.table, arg.context, arg.status, arg.error]) };
	if (o.progress !== null) {
		progressFunc = function (arg) { LoadProgress.apply(self, [arg, o.progress]) };
	}
	for (key in t) {
		if (!t.hasOwnProperty(key)) continue;
		t[key] = {tbl: this.src.GetTable(key), done: false };
		if (!t[key].tbl) return this.loadingP.reject({context: o.context, map: self, status: "error", error: "source does not contain requested table: " + key}).promise;
		t[key].tbl.Load({context: o.context, progress: progressFunc}).then(thenDone, thenFail);
	}	
	
	return this.loadingP.promise;
};

function LoadInit() {
	var systbl = this.tables["map" + this.space + "SolarSystems"].tbl,
		colmap = systbl.colmap,
		solarSystemID,
		toSolarSystemID,
		system,
		jumptblnm,
		jumptbl,
		sys
		;
	
	sys_cache = {};
	for (solarSystemID in systbl.data) {
		if (!systbl.data.hasOwnProperty(solarSystemID)) continue;
		system = systbl.data[solarSystemID];
		this.sysNameMap[system[colmap.solarSystemName]] = parseInt(solarSystemID, 10);
		this.sysNames.push(system[colmap.solarSystemName]);
		jumptblnm = false;
		if (this.space != "W") jumptblnm = "map" + this.space + "SolarSystemJumps";
		if (jumptblnm && this.tables.hasOwnProperty(jumptblnm)) {
			// create the routing graph used for path finding
			sys = {
				jumps: [],
				cont: system[colmap.contiguous],
				sec: system[colmap.security].toFixed(1),
				name: system[colmap.solarSystemName]
			};
			jumptbl = this.tables[jumptblnm].tbl.data[solarSystemID];
			for (toSolarSystemID in jumptbl) {
				if (!jumptbl.hasOwnProperty(toSolarSystemID)) continue;
				sys.jumps.push(toSolarSystemID);
			}
			this.routeGraph[solarSystemID] = sys;
		}
	}
	this.sysNames.sort();
}

P.GetSystem = function (input) {
	var nSystemID,
		sSystemID
		;
		
	if (!input) return null;
	if (input.hasOwnProperty("name") && this.sysNameMap.hasOwnProperty(input.name)) nSystemID = this.sysNameMap[input.name];
	else if (input.hasOwnProperty("id")) nSystemID = parseInt(input.id, 10);
	else return null;
	sSystemID = nSystemID.toString(10);
	
	if (!sys_cache.hasOwnProperty(sSystemID)) {
		sys_cache[sSystemID] = System.Create(this.tables["map" + this.space + "SolarSystems"].tbl, nSystemID);
	}
	return sys_cache[sSystemID];
};

P.GetSystems = function () {
	return SystemIter.Create(this);
	// this.tables["map" + this.space + "SolarSystems"].tbl);
};	

P.JumpDist = function (fromID, toID) {
	var systbl = this.tables["map" + this.space + "SolarSystems"].tbl,
		colmap = systbl.colmap,
		x1 = systbl.data[fromID][colmap.x],
		x2 = systbl.data[toID][colmap.x],			
		y1 = systbl.data[fromID][colmap.y],
		y2 = systbl.data[toID][colmap.y],
		z1 = systbl.data[fromID][colmap.z],
		z2 = systbl.data[toID][colmap.z],
		dist
		;
			
	dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
	return dist/Const.M_per_LY;
};

P.Route = function (fromSystemID, toSystemID, avoidList, avoidLow, avoidHi) {
	var route = [],
		avoids = {},
		sFromID,
		sToID,
		solarSystemID,
		currentID,
		systemID,
		nID,
		prevID,
		sys_td,
		td,
		i,
		tmp,
		testset = [],
		test_td,
		testidx,
		dist
		;
		
	sFromID = parseInt(fromSystemID, 10).toString(10);
	sToID = parseInt(toSystemID, 10).toString(10);
	if (!this.routeGraph.hasOwnProperty(sFromID) || !this.routeGraph.hasOwnProperty(sToID)) return route;

	// reset the route graph
	for (solarSystemID in this.routeGraph) {
		if (!this.routeGraph.hasOwnProperty(solarSystemID)) continue;
		this.routeGraph[solarSystemID].td = -1;
		this.routeGraph[solarSystemID].prevID = -1;
		this.routeGraph[solarSystemID].visited = false;
	}
	
	// populate avoid list lookup table
	if (avoidList && avoidList.length > 0) {
		for (i = 0; i < avoidList.length; i++) {
			avoids[avoidList[i]] = true;
		}
	}
	
	if (sFromID === sToID) return route;
	
	// swap from/to to match EVE client?
	tmp = sFromID; sFromID = sToID; sToID = tmp;
	
	// Dijkstra's to find best route given options provided
	currentID = sFromID;
	this.routeGraph[sFromID].td = 0;	
	while (!this.routeGraph[sToID].visited) {
		if (currentID != sFromID) {
			// find next node to try
			test_td = -1;
			testidx = -1;
			for (i = 0; i < testset.length; i++) {
				systemID = testset[i];
				if (this.routeGraph[systemID].visited) continue;
				if (avoids[systemID]) continue;
				sys_td = this.routeGraph[systemID].td;
				if (sys_td > 0 && (test_td == -1 || sys_td < test_td)) {
					currentID = systemID;
					test_td = sys_td;
					testidx = i;
				}
			}
			if (test_td == -1) return route; // no connection
			testset.splice(testidx, 1); // remove the node we just picked from the testset
		}
		for (i = 0; i < this.routeGraph[currentID].jumps.length; i++) {
			nID = this.routeGraph[currentID].jumps[i];
			dist = 1;
			//if (avoidLow && this.routeGraph[nID].sec < 0.5 && this.routeGraph[currentID].sec >= 0.5) dist = 1000;
			if (avoidLow && this.routeGraph[nID].sec < 0.5) dist = 1000;
			//if (avoidHi && this.routeGraph[nID].sec >= 0.5 && this.routeGraph[currentID].sec < 0.5) dist = 1000;
			if (avoidHi && this.routeGraph[nID].sec >= 0.5) dist = 1000;
			td = this.routeGraph[currentID].td + dist;
			if (this.routeGraph[nID].td < 0 || this.routeGraph[nID].td > td) {
				this.routeGraph[nID].td = td;
				this.routeGraph[nID].prevID = currentID;
				testset.push(nID);
			}	
		}
		this.routeGraph[currentID].visited = true;
		currentID = 0;
	}
	
	// get the actual route found
	prevID = this.routeGraph[sToID].prevID;
	while (prevID != sFromID) {
		route.push(parseInt(prevID, 10));
		prevID = this.routeGraph[prevID].prevID;
	}
	route.push(parseInt(sFromID, 10));
	// route.reverse();
	// route.unshift(toSystemID);
	return route;
};	

},{"./Const.js":4,"./Utils.js":12,"./map.System.js":13,"./map.SystemIter.js":14,"node.extend":1}]},{},[5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxwcm9qZWN0c1xceHlqYXhcXEVWRW9qXFxub2RlX21vZHVsZXNcXGdydW50LWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovbm9kZV9tb2R1bGVzL25vZGUuZXh0ZW5kL2luZGV4LmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovbm9kZV9tb2R1bGVzL25vZGUuZXh0ZW5kL2xpYi9leHRlbmQuanMiLCJkOi9wcm9qZWN0cy94eWpheC9FVkVvai9ub2RlX21vZHVsZXMvbm9kZS5leHRlbmQvbm9kZV9tb2R1bGVzL2lzL2luZGV4LmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL0NvbnN0LmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL0VWRW9qLmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL0lHQi5qcyIsImQ6L3Byb2plY3RzL3h5amF4L0VWRW9qL3NyYy9TREQuU291cmNlLmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL1NERC5Tb3VyY2UuanNvbi5qcyIsImQ6L3Byb2plY3RzL3h5amF4L0VWRW9qL3NyYy9TREQuU291cmNlLmpzb25fYnJvd3Nlci5qcyIsImQ6L3Byb2plY3RzL3h5amF4L0VWRW9qL3NyYy9TREQuVGFibGUuanMiLCJkOi9wcm9qZWN0cy94eWpheC9FVkVvai9zcmMvU0RELmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL1V0aWxzLmpzIiwiZDovcHJvamVjdHMveHlqYXgvRVZFb2ovc3JjL21hcC5TeXN0ZW0uanMiLCJkOi9wcm9qZWN0cy94eWpheC9FVkVvai9zcmMvbWFwLlN5c3RlbUl0ZXIuanMiLCJkOi9wcm9qZWN0cy94eWpheC9FVkVvai9zcmMvbWFwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2V4dGVuZCcpO1xuXG4iLCIvKiFcbiAqIG5vZGUuZXh0ZW5kXG4gKiBDb3B5cmlnaHQgMjAxMSwgSm9obiBSZXNpZ1xuICogRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIG9yIEdQTCBWZXJzaW9uIDIgbGljZW5zZXMuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogQGZpbGVvdmVydmlld1xuICogUG9ydCBvZiBqUXVlcnkuZXh0ZW5kIHRoYXQgYWN0dWFsbHkgd29ya3Mgb24gbm9kZS5qc1xuICovXG52YXIgaXMgPSByZXF1aXJlKCdpcycpO1xuXG5mdW5jdGlvbiBleHRlbmQoKSB7XG4gIHZhciB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge307XG4gIHZhciBpID0gMTtcbiAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBkZWVwID0gZmFsc2U7XG4gIHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlfaXNfYXJyYXksIGNsb25lO1xuXG4gIC8vIEhhbmRsZSBhIGRlZXAgY29weSBzaXR1YXRpb25cbiAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuICAgIGRlZXAgPSB0YXJnZXQ7XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzWzFdIHx8IHt9O1xuICAgIC8vIHNraXAgdGhlIGJvb2xlYW4gYW5kIHRoZSB0YXJnZXRcbiAgICBpID0gMjtcbiAgfVxuXG4gIC8vIEhhbmRsZSBjYXNlIHdoZW4gdGFyZ2V0IGlzIGEgc3RyaW5nIG9yIHNvbWV0aGluZyAocG9zc2libGUgaW4gZGVlcCBjb3B5KVxuICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgIWlzLmZuKHRhcmdldCkpIHtcbiAgICB0YXJnZXQgPSB7fTtcbiAgfVxuXG4gIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAvLyBPbmx5IGRlYWwgd2l0aCBub24tbnVsbC91bmRlZmluZWQgdmFsdWVzXG4gICAgb3B0aW9ucyA9IGFyZ3VtZW50c1tpXVxuICAgIGlmIChvcHRpb25zICE9IG51bGwpIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBvcHRpb25zID0gb3B0aW9ucy5zcGxpdCgnJyk7XG4gICAgICB9XG4gICAgICAvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG4gICAgICBmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICBzcmMgPSB0YXJnZXRbbmFtZV07XG4gICAgICAgIGNvcHkgPSBvcHRpb25zW25hbWVdO1xuXG4gICAgICAgIC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3BcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVjdXJzZSBpZiB3ZSdyZSBtZXJnaW5nIHBsYWluIG9iamVjdHMgb3IgYXJyYXlzXG4gICAgICAgIGlmIChkZWVwICYmIGNvcHkgJiYgKGlzLmhhc2goY29weSkgfHwgKGNvcHlfaXNfYXJyYXkgPSBpcy5hcnJheShjb3B5KSkpKSB7XG4gICAgICAgICAgaWYgKGNvcHlfaXNfYXJyYXkpIHtcbiAgICAgICAgICAgIGNvcHlfaXNfYXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgIGNsb25lID0gc3JjICYmIGlzLmFycmF5KHNyYykgPyBzcmMgOiBbXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgaXMuaGFzaChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTmV2ZXIgbW92ZSBvcmlnaW5hbCBvYmplY3RzLCBjbG9uZSB0aGVtXG4gICAgICAgICAgdGFyZ2V0W25hbWVdID0gZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcblxuICAgICAgICAvLyBEb24ndCBicmluZyBpbiB1bmRlZmluZWQgdmFsdWVzXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvcHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGFyZ2V0W25hbWVdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqL1xuZXh0ZW5kLnZlcnNpb24gPSAnMS4wLjgnO1xuXG4vKipcbiAqIEV4cG9ydHMgbW9kdWxlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcblxuIiwiXG4vKiohXG4gKiBpc1xuICogdGhlIGRlZmluaXRpdmUgSmF2YVNjcmlwdCB0eXBlIHRlc3RpbmcgbGlicmFyeVxuICogXG4gKiBAY29weXJpZ2h0IDIwMTMgRW5yaWNvIE1hcmlub1xuICogQGxpY2Vuc2UgTUlUXG4gKi9cblxudmFyIG9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBvd25zID0gb2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG52YXIgdG9TdHJpbmcgPSBvYmpQcm90by50b1N0cmluZztcbnZhciBpc0FjdHVhbE5hTiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufTtcbnZhciBOT05fSE9TVF9UWVBFUyA9IHtcbiAgXCJib29sZWFuXCI6IDEsXG4gIFwibnVtYmVyXCI6IDEsXG4gIFwic3RyaW5nXCI6IDEsXG4gIFwidW5kZWZpbmVkXCI6IDFcbn07XG5cbi8qKlxuICogRXhwb3NlIGBpc2BcbiAqL1xuXG52YXIgaXMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vKipcbiAqIFRlc3QgZ2VuZXJhbC5cbiAqL1xuXG4vKipcbiAqIGlzLnR5cGVcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhIHR5cGUgb2YgYHR5cGVgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIHR5cGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhIHR5cGUgb2YgYHR5cGVgLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuYSA9XG5pcy50eXBlID0gZnVuY3Rpb24gKHZhbHVlLCB0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IHR5cGU7XG59O1xuXG4vKipcbiAqIGlzLmRlZmluZWRcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBkZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgJ3ZhbHVlJyBpcyBkZWZpbmVkLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuZGVmaW5lZCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZDtcbn07XG5cbi8qKlxuICogaXMuZW1wdHlcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBlbXB0eS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pcy5lbXB0eSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB2YXIga2V5O1xuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSB0eXBlIHx8ICdbb2JqZWN0IEFyZ3VtZW50c10nID09PSB0eXBlKSB7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGlmICgnW29iamVjdCBPYmplY3RdJyA9PT0gdHlwZSkge1xuICAgIGZvciAoa2V5IGluIHZhbHVlKSBpZiAob3ducy5jYWxsKHZhbHVlLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoJ1tvYmplY3QgU3RyaW5nXScgPT09IHR5cGUpIHtcbiAgICByZXR1cm4gJycgPT09IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBpcy5lcXVhbFxuICogVGVzdCBpZiBgdmFsdWVgIGlzIGVxdWFsIHRvIGBvdGhlcmAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHBhcmFtIHtNaXhlZH0gb3RoZXIgdmFsdWUgdG8gY29tcGFyZSB3aXRoXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgZXF1YWwgdG8gYG90aGVyYCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cblxuaXMuZXF1YWwgPSBmdW5jdGlvbiAodmFsdWUsIG90aGVyKSB7XG4gIHZhciBzdHJpY3RseUVxdWFsID0gdmFsdWUgPT09IG90aGVyO1xuICBpZiAoc3RyaWN0bHlFcXVhbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIHR5cGUgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgdmFyIGtleTtcblxuICBpZiAodHlwZSAhPT0gdG9TdHJpbmcuY2FsbChvdGhlcikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJ1tvYmplY3QgT2JqZWN0XScgPT09IHR5cGUpIHtcbiAgICBmb3IgKGtleSBpbiB2YWx1ZSkge1xuICAgICAgaWYgKCFpcy5lcXVhbCh2YWx1ZVtrZXldLCBvdGhlcltrZXldKSB8fCAhKGtleSBpbiBvdGhlcikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBvdGhlcikge1xuICAgICAgaWYgKCFpcy5lcXVhbCh2YWx1ZVtrZXldLCBvdGhlcltrZXldKSB8fCAhKGtleSBpbiB2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSB0eXBlKSB7XG4gICAga2V5ID0gdmFsdWUubGVuZ3RoO1xuICAgIGlmIChrZXkgIT09IG90aGVyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3aGlsZSAoLS1rZXkpIHtcbiAgICAgIGlmICghaXMuZXF1YWwodmFsdWVba2V5XSwgb3RoZXJba2V5XSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICgnW29iamVjdCBGdW5jdGlvbl0nID09PSB0eXBlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnByb3RvdHlwZSA9PT0gb3RoZXIucHJvdG90eXBlO1xuICB9XG5cbiAgaWYgKCdbb2JqZWN0IERhdGVdJyA9PT0gdHlwZSkge1xuICAgIHJldHVybiB2YWx1ZS5nZXRUaW1lKCkgPT09IG90aGVyLmdldFRpbWUoKTtcbiAgfVxuXG4gIHJldHVybiBzdHJpY3RseUVxdWFsO1xufTtcblxuLyoqXG4gKiBpcy5ob3N0ZWRcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBob3N0ZWQgYnkgYGhvc3RgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7TWl4ZWR9IGhvc3QgaG9zdCB0byB0ZXN0IHdpdGhcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBob3N0ZWQgYnkgYGhvc3RgLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuaG9zdGVkID0gZnVuY3Rpb24gKHZhbHVlLCBob3N0KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGhvc3RbdmFsdWVdO1xuICByZXR1cm4gdHlwZSA9PT0gJ29iamVjdCcgPyAhIWhvc3RbdmFsdWVdIDogIU5PTl9IT1NUX1RZUEVTW3R5cGVdO1xufTtcblxuLyoqXG4gKiBpcy5pbnN0YW5jZVxuICogVGVzdCBpZiBgdmFsdWVgIGlzIGFuIGluc3RhbmNlIG9mIGBjb25zdHJ1Y3RvcmAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIGluc3RhbmNlIG9mIGBjb25zdHJ1Y3RvcmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuaW5zdGFuY2UgPSBpc1snaW5zdGFuY2VvZiddID0gZnVuY3Rpb24gKHZhbHVlLCBjb25zdHJ1Y3Rvcikge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcjtcbn07XG5cbi8qKlxuICogaXMubnVsbFxuICogVGVzdCBpZiBgdmFsdWVgIGlzIG51bGwuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIG51bGwsIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pc1snbnVsbCddID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gbnVsbDtcbn07XG5cbi8qKlxuICogaXMudW5kZWZcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyB1bmRlZmluZWQuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIHVuZGVmaW5lZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLnVuZGVmID0gaXNbJ3VuZGVmaW5lZCddID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBUZXN0IGFyZ3VtZW50cy5cbiAqL1xuXG4vKipcbiAqIGlzLmFyZ3NcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBhcmd1bWVudHMgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhbiBhcmd1bWVudHMgb2JqZWN0LCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuYXJncyA9IGlzWydhcmd1bWVudHMnXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgaXNTdGFuZGFyZEFyZ3VtZW50cyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nID09PSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgdmFyIGlzT2xkQXJndW1lbnRzID0gIWlzLmFycmF5KHZhbHVlKSAmJiBpcy5hcnJheWxpa2UodmFsdWUpICYmIGlzLm9iamVjdCh2YWx1ZSkgJiYgaXMuZm4odmFsdWUuY2FsbGVlKTtcbiAgcmV0dXJuIGlzU3RhbmRhcmRBcmd1bWVudHMgfHwgaXNPbGRBcmd1bWVudHM7XG59O1xuXG4vKipcbiAqIFRlc3QgYXJyYXkuXG4gKi9cblxuLyoqXG4gKiBpcy5hcnJheVxuICogVGVzdCBpZiAndmFsdWUnIGlzIGFuIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmFycmF5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAnW29iamVjdCBBcnJheV0nID09PSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbi8qKlxuICogaXMuYXJndW1lbnRzLmVtcHR5XG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgYXJndW1lbnRzIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgYXJndW1lbnRzIG9iamVjdCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5pcy5hcmdzLmVtcHR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBpcy5hcmdzKHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDA7XG59O1xuXG4vKipcbiAqIGlzLmFycmF5LmVtcHR5XG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIGVtcHR5IGFycmF5LCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cbmlzLmFycmF5LmVtcHR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBpcy5hcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBpcy5hcnJheWxpa2VcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBhcnJheWxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhbiBhcmd1bWVudHMgb2JqZWN0LCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuYXJyYXlsaWtlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmICFpcy5ib29sZWFuKHZhbHVlKVxuICAgICYmIG93bnMuY2FsbCh2YWx1ZSwgJ2xlbmd0aCcpXG4gICAgJiYgaXNGaW5pdGUodmFsdWUubGVuZ3RoKVxuICAgICYmIGlzLm51bWJlcih2YWx1ZS5sZW5ndGgpXG4gICAgJiYgdmFsdWUubGVuZ3RoID49IDA7XG59O1xuXG4vKipcbiAqIFRlc3QgYm9vbGVhbi5cbiAqL1xuXG4vKipcbiAqIGlzLmJvb2xlYW5cbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhIGJvb2xlYW4uXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGEgYm9vbGVhbiwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmJvb2xlYW4gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICdbb2JqZWN0IEJvb2xlYW5dJyA9PT0gdG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59O1xuXG4vKipcbiAqIGlzLmZhbHNlXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgZmFsc2UuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGZhbHNlLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXNbJ2ZhbHNlJ10gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIGlzLmJvb2xlYW4odmFsdWUpICYmICh2YWx1ZSA9PT0gZmFsc2UgfHwgdmFsdWUudmFsdWVPZigpID09PSBmYWxzZSk7XG59O1xuXG4vKipcbiAqIGlzLnRydWVcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyB0cnVlLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyB0cnVlLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXNbJ3RydWUnXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gaXMuYm9vbGVhbih2YWx1ZSkgJiYgKHZhbHVlID09PSB0cnVlIHx8IHZhbHVlLnZhbHVlT2YoKSA9PT0gdHJ1ZSk7XG59O1xuXG4vKipcbiAqIFRlc3QgZGF0ZS5cbiAqL1xuXG4vKipcbiAqIGlzLmRhdGVcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhIGRhdGUuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGEgZGF0ZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmRhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICdbb2JqZWN0IERhdGVdJyA9PT0gdG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59O1xuXG4vKipcbiAqIFRlc3QgZWxlbWVudC5cbiAqL1xuXG4vKipcbiAqIGlzLmVsZW1lbnRcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBodG1sIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIEhUTUwgRWxlbWVudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmVsZW1lbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWRcbiAgICAmJiB0eXBlb2YgSFRNTEVsZW1lbnQgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAgICYmIHZhbHVlLm5vZGVUeXBlID09PSAxO1xufTtcblxuLyoqXG4gKiBUZXN0IGVycm9yLlxuICovXG5cbi8qKlxuICogaXMuZXJyb3JcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBlcnJvciBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIGVycm9yIG9iamVjdCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmVycm9yID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAnW29iamVjdCBFcnJvcl0nID09PSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbi8qKlxuICogVGVzdCBmdW5jdGlvbi5cbiAqL1xuXG4vKipcbiAqIGlzLmZuIC8gaXMuZnVuY3Rpb24gKGRlcHJlY2F0ZWQpXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmZuID0gaXNbJ2Z1bmN0aW9uJ10gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIGlzQWxlcnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSA9PT0gd2luZG93LmFsZXJ0O1xuICByZXR1cm4gaXNBbGVydCB8fCAnW29iamVjdCBGdW5jdGlvbl0nID09PSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbi8qKlxuICogVGVzdCBudW1iZXIuXG4gKi9cblxuLyoqXG4gKiBpcy5udW1iZXJcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYSBudW1iZXIsIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pcy5udW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICdbb2JqZWN0IE51bWJlcl0nID09PSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbn07XG5cbi8qKlxuICogaXMuaW5maW5pdGVcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBpbmZpbml0eS5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgcG9zaXRpdmUgb3IgbmVnYXRpdmUgSW5maW5pdHksIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuaXMuaW5maW5pdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBJbmZpbml0eSB8fCB2YWx1ZSA9PT0gLUluZmluaXR5O1xufTtcblxuLyoqXG4gKiBpcy5kZWNpbWFsXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYSBkZWNpbWFsIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYSBkZWNpbWFsIG51bWJlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmRlY2ltYWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIGlzLm51bWJlcih2YWx1ZSkgJiYgIWlzQWN0dWFsTmFOKHZhbHVlKSAmJiAhaXMuaW5maW5pdGUodmFsdWUpICYmIHZhbHVlICUgMSAhPT0gMDtcbn07XG5cbi8qKlxuICogaXMuZGl2aXNpYmxlQnlcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBkaXZpc2libGUgYnkgYG5gLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcGFyYW0ge051bWJlcn0gbiBkaXZpZGVuZFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGRpdmlzaWJsZSBieSBgbmAsIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pcy5kaXZpc2libGVCeSA9IGZ1bmN0aW9uICh2YWx1ZSwgbikge1xuICB2YXIgaXNEaXZpZGVuZEluZmluaXRlID0gaXMuaW5maW5pdGUodmFsdWUpO1xuICB2YXIgaXNEaXZpc29ySW5maW5pdGUgPSBpcy5pbmZpbml0ZShuKTtcbiAgdmFyIGlzTm9uWmVyb051bWJlciA9IGlzLm51bWJlcih2YWx1ZSkgJiYgIWlzQWN0dWFsTmFOKHZhbHVlKSAmJiBpcy5udW1iZXIobikgJiYgIWlzQWN0dWFsTmFOKG4pICYmIG4gIT09IDA7XG4gIHJldHVybiBpc0RpdmlkZW5kSW5maW5pdGUgfHwgaXNEaXZpc29ySW5maW5pdGUgfHwgKGlzTm9uWmVyb051bWJlciAmJiB2YWx1ZSAlIG4gPT09IDApO1xufTtcblxuLyoqXG4gKiBpcy5pbnRcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBpbnRlZ2VyLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYW4gaW50ZWdlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gaXMubnVtYmVyKHZhbHVlKSAmJiAhaXNBY3R1YWxOYU4odmFsdWUpICYmIHZhbHVlICUgMSA9PT0gMDtcbn07XG5cbi8qKlxuICogaXMubWF4aW11bVxuICogVGVzdCBpZiBgdmFsdWVgIGlzIGdyZWF0ZXIgdGhhbiAnb3RoZXJzJyB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVycyB2YWx1ZXMgdG8gY29tcGFyZSB3aXRoXG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgZ3JlYXRlciB0aGFuIGBvdGhlcnNgIHZhbHVlc1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pcy5tYXhpbXVtID0gZnVuY3Rpb24gKHZhbHVlLCBvdGhlcnMpIHtcbiAgaWYgKGlzQWN0dWFsTmFOKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05hTiBpcyBub3QgYSB2YWxpZCB2YWx1ZScpO1xuICB9IGVsc2UgaWYgKCFpcy5hcnJheWxpa2Uob3RoZXJzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3NlY29uZCBhcmd1bWVudCBtdXN0IGJlIGFycmF5LWxpa2UnKTtcbiAgfVxuICB2YXIgbGVuID0gb3RoZXJzLmxlbmd0aDtcblxuICB3aGlsZSAoLS1sZW4gPj0gMCkge1xuICAgIGlmICh2YWx1ZSA8IG90aGVyc1tsZW5dKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIGlzLm1pbmltdW1cbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBsZXNzIHRoYW4gYG90aGVyc2AgdmFsdWVzLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlcnMgdmFsdWVzIHRvIGNvbXBhcmUgd2l0aFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBgb3RoZXJzYCB2YWx1ZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMubWluaW11bSA9IGZ1bmN0aW9uICh2YWx1ZSwgb3RoZXJzKSB7XG4gIGlmIChpc0FjdHVhbE5hTih2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdOYU4gaXMgbm90IGEgdmFsaWQgdmFsdWUnKTtcbiAgfSBlbHNlIGlmICghaXMuYXJyYXlsaWtlKG90aGVycykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhcnJheS1saWtlJyk7XG4gIH1cbiAgdmFyIGxlbiA9IG90aGVycy5sZW5ndGg7XG5cbiAgd2hpbGUgKC0tbGVuID49IDApIHtcbiAgICBpZiAodmFsdWUgPiBvdGhlcnNbbGVuXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBpcy5uYW5cbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBub3QgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIG5vdCBhIG51bWJlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLm5hbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gIWlzLm51bWJlcih2YWx1ZSkgfHwgdmFsdWUgIT09IHZhbHVlO1xufTtcblxuLyoqXG4gKiBpcy5ldmVuXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYW4gZXZlbiBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYHZhbHVlYCBpcyBhbiBldmVuIG51bWJlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmV2ZW4gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIGlzLmluZmluaXRlKHZhbHVlKSB8fCAoaXMubnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA9PT0gdmFsdWUgJiYgdmFsdWUgJSAyID09PSAwKTtcbn07XG5cbi8qKlxuICogaXMub2RkXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYW4gb2RkIG51bWJlci5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIG9kZCBudW1iZXIsIGZhbHNlIG90aGVyd2lzZVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5pcy5vZGQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIGlzLmluZmluaXRlKHZhbHVlKSB8fCAoaXMubnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA9PT0gdmFsdWUgJiYgdmFsdWUgJSAyICE9PSAwKTtcbn07XG5cbi8qKlxuICogaXMuZ2VcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYG90aGVyYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHBhcmFtIHtOdW1iZXJ9IG90aGVyIHZhbHVlIHRvIGNvbXBhcmUgd2l0aFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuZ2UgPSBmdW5jdGlvbiAodmFsdWUsIG90aGVyKSB7XG4gIGlmIChpc0FjdHVhbE5hTih2YWx1ZSkgfHwgaXNBY3R1YWxOYU4ob3RoZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTmFOIGlzIG5vdCBhIHZhbGlkIHZhbHVlJyk7XG4gIH1cbiAgcmV0dXJuICFpcy5pbmZpbml0ZSh2YWx1ZSkgJiYgIWlzLmluZmluaXRlKG90aGVyKSAmJiB2YWx1ZSA+PSBvdGhlcjtcbn07XG5cbi8qKlxuICogaXMuZ3RcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBncmVhdGVyIHRoYW4gYG90aGVyYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHBhcmFtIHtOdW1iZXJ9IG90aGVyIHZhbHVlIHRvIGNvbXBhcmUgd2l0aFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuZ3QgPSBmdW5jdGlvbiAodmFsdWUsIG90aGVyKSB7XG4gIGlmIChpc0FjdHVhbE5hTih2YWx1ZSkgfHwgaXNBY3R1YWxOYU4ob3RoZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTmFOIGlzIG5vdCBhIHZhbGlkIHZhbHVlJyk7XG4gIH1cbiAgcmV0dXJuICFpcy5pbmZpbml0ZSh2YWx1ZSkgJiYgIWlzLmluZmluaXRlKG90aGVyKSAmJiB2YWx1ZSA+IG90aGVyO1xufTtcblxuLyoqXG4gKiBpcy5sZVxuICogVGVzdCBpZiBgdmFsdWVgIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgb3RoZXJgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcGFyYW0ge051bWJlcn0gb3RoZXIgdmFsdWUgdG8gY29tcGFyZSB3aXRoXG4gKiBAcmV0dXJuIHtCb29sZWFufSBpZiAndmFsdWUnIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byAnb3RoZXInXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLmxlID0gZnVuY3Rpb24gKHZhbHVlLCBvdGhlcikge1xuICBpZiAoaXNBY3R1YWxOYU4odmFsdWUpIHx8IGlzQWN0dWFsTmFOKG90aGVyKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05hTiBpcyBub3QgYSB2YWxpZCB2YWx1ZScpO1xuICB9XG4gIHJldHVybiAhaXMuaW5maW5pdGUodmFsdWUpICYmICFpcy5pbmZpbml0ZShvdGhlcikgJiYgdmFsdWUgPD0gb3RoZXI7XG59O1xuXG4vKipcbiAqIGlzLmx0XG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgbGVzcyB0aGFuIGBvdGhlcmAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBvdGhlciB2YWx1ZSB0byBjb21wYXJlIHdpdGhcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGlmIGB2YWx1ZWAgaXMgbGVzcyB0aGFuIGBvdGhlcmBcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMubHQgPSBmdW5jdGlvbiAodmFsdWUsIG90aGVyKSB7XG4gIGlmIChpc0FjdHVhbE5hTih2YWx1ZSkgfHwgaXNBY3R1YWxOYU4ob3RoZXIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTmFOIGlzIG5vdCBhIHZhbGlkIHZhbHVlJyk7XG4gIH1cbiAgcmV0dXJuICFpcy5pbmZpbml0ZSh2YWx1ZSkgJiYgIWlzLmluZmluaXRlKG90aGVyKSAmJiB2YWx1ZSA8IG90aGVyO1xufTtcblxuLyoqXG4gKiBpcy53aXRoaW5cbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyB3aXRoaW4gYHN0YXJ0YCBhbmQgYGZpbmlzaGAuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHZhbHVlIHZhbHVlIHRvIHRlc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCBsb3dlciBib3VuZFxuICogQHBhcmFtIHtOdW1iZXJ9IGZpbmlzaCB1cHBlciBib3VuZFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiAndmFsdWUnIGlzIGlzIHdpdGhpbiAnc3RhcnQnIGFuZCAnZmluaXNoJ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuaXMud2l0aGluID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZmluaXNoKSB7XG4gIGlmIChpc0FjdHVhbE5hTih2YWx1ZSkgfHwgaXNBY3R1YWxOYU4oc3RhcnQpIHx8IGlzQWN0dWFsTmFOKGZpbmlzaCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdOYU4gaXMgbm90IGEgdmFsaWQgdmFsdWUnKTtcbiAgfSBlbHNlIGlmICghaXMubnVtYmVyKHZhbHVlKSB8fCAhaXMubnVtYmVyKHN0YXJ0KSB8fCAhaXMubnVtYmVyKGZpbmlzaCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhbGwgYXJndW1lbnRzIG11c3QgYmUgbnVtYmVycycpO1xuICB9XG4gIHZhciBpc0FueUluZmluaXRlID0gaXMuaW5maW5pdGUodmFsdWUpIHx8IGlzLmluZmluaXRlKHN0YXJ0KSB8fCBpcy5pbmZpbml0ZShmaW5pc2gpO1xuICByZXR1cm4gaXNBbnlJbmZpbml0ZSB8fCAodmFsdWUgPj0gc3RhcnQgJiYgdmFsdWUgPD0gZmluaXNoKTtcbn07XG5cbi8qKlxuICogVGVzdCBvYmplY3QuXG4gKi9cblxuLyoqXG4gKiBpcy5vYmplY3RcbiAqIFRlc3QgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmlzLm9iamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgJ1tvYmplY3QgT2JqZWN0XScgPT09IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xufTtcblxuLyoqXG4gKiBpcy5oYXNoXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYSBoYXNoIC0gYSBwbGFpbiBvYmplY3QgbGl0ZXJhbC5cbiAqXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGB2YWx1ZWAgaXMgYSBoYXNoLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuaGFzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gaXMub2JqZWN0KHZhbHVlKSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICYmICF2YWx1ZS5ub2RlVHlwZSAmJiAhdmFsdWUuc2V0SW50ZXJ2YWw7XG59O1xuXG4vKipcbiAqIFRlc3QgcmVnZXhwLlxuICovXG5cbi8qKlxuICogaXMucmVnZXhwXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBgdmFsdWVgIGlzIGEgcmVnZXhwLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMucmVnZXhwID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAnW29iamVjdCBSZWdFeHBdJyA9PT0gdG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59O1xuXG4vKipcbiAqIFRlc3Qgc3RyaW5nLlxuICovXG5cbi8qKlxuICogaXMuc3RyaW5nXG4gKiBUZXN0IGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiAndmFsdWUnIGlzIGEgc3RyaW5nLCBmYWxzZSBvdGhlcndpc2VcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuaXMuc3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAnW29iamVjdCBTdHJpbmddJyA9PT0gdG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59O1xuXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5NX3Blcl9MWSA9IDkuNDYwNTI4NGUrMTU7IC8vIG1ldGVycyBwZXIgbGlnaHR5ZWFyXG5leHBvcnRzLk1fcGVyX0FVID0gMTQ5NTk3ODcwNzAwOyAvLyBtZXRlcnMgcGVyIEFVXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5Db25zdCA9IHJlcXVpcmUoXCIuL0NvbnN0LmpzXCIpO1xuZXhwb3J0cy5VdGlscyA9IHJlcXVpcmUoXCIuL1V0aWxzLmpzXCIpO1xuZXhwb3J0cy5TREQgPSByZXF1aXJlKFwiLi9TREQuanNcIik7XG5leHBvcnRzLm1hcCA9IHJlcXVpcmUoXCIuL21hcC5qc1wiKTtcbmlmIChleHBvcnRzLlV0aWxzLmlzQnJvd3Nlcikge1xuXHRleHBvcnRzLklHQiA9IHJlcXVpcmUoXCIuL0lHQi5qc1wiKTtcbn1cblxuZXhwb3J0cy5WX01BSk9SID0gMDtcbmV4cG9ydHMuVl9NSU5PUiA9IDI7XG5leHBvcnRzLlZfUEFUQ0ggPSAwO1xuZXhwb3J0cy5WRVJTSU9OID0gZXhwb3J0cy5WX01BSk9SICsgXCIuXCIgKyBleHBvcnRzLlZfTUlOT1IgKyBcIi5cIiArIGV4cG9ydHMuVl9QQVRDSDtcbiIsIi8qIGdsb2JhbCBqUXVlcnk6IGZhbHNlICovXG4vKiBnbG9iYWwgQ0NQRVZFOiBmYWxzZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciAkID0galF1ZXJ5O1xuXG5mdW5jdGlvbiBJR0JDbGljayhldikge1xuXHR2YXIgY29ycF9pZCxcblx0XHRjaGFuLFxuXHRcdGNjdHlwZSxcblx0XHR0cnVzdG1lLFxuXHRcdHRydXN0X3JlcSA9IGZhbHNlLFxuXHRcdGhyZWZcblx0XHQ7XG5cdFxuXHRocmVmID0gJCh0aGlzKS5hdHRyKFwiaHJlZlwiKTtcblx0aWYgKCFocmVmLm1hdGNoKC9eZXZlOi9pKSkgcmV0dXJuOyAvLyBodWguLiB0aGF0J3Mgb2RkXG5cdGV2LnByZXZlbnREZWZhdWx0KCk7XHRcdFxuXG5cdGlmIChocmVmLm1hdGNoKC9eZXZlOnRydXN0Oi9pKSkgdHJ1c3RfcmVxID0gdHJ1ZTtcblx0aHJlZiA9IGhyZWYucmVwbGFjZSgvXmV2ZTpcXHMqL2ksIFwiXCIpLnJlcGxhY2UoL150cnVzdDpcXHMqL2ksIFwiXCIpO1xuXHRcblx0Lypcblx0aWYgKHR5cGVvZihuYXZpZ2F0b3IpICE9ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci5oYXNPd25Qcm9wZXJ0eSgndXNlckFnZW50JykgJiYgIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0VWRVxcLUlHQi8pKSB7XG5cdFx0Ly8gc3RyYWlnaHQgYnJvd3NlciBkZXRlY3Rpb24gZm9yIElHQlxuXHRcdHJldHVybjtcblx0fVxuXHQqL1xuXHRpZiAodHlwZW9mKENDUEVWRSkgPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdC8vIGltcGwgYmFzZWQgZGV0ZWN0aW9uIGZvciBJR0Jcblx0XHRyZXR1cm47XG5cdH1cblx0XG5cdGNvcnBfaWQgPSAkKHRoaXMpLmRhdGEoXCJpZ2ItY29ycGlkXCIpO1xuXHRjaGFuID0gJCh0aGlzKS5kYXRhKFwiaWdiLWNoYW5cIik7XG5cdGNjdHlwZSA9ICQodGhpcykuZGF0YShcImlnYi1jY3R5cGVcIik7XG5cdHRydXN0bWUgPSAkKHRoaXMpLmRhdGEoXCJpZ2ItdHJ1c3RtZVwiKTtcblxuXHRpZiAoY29ycF9pZCAmJiBjb3JwX2lkID4gMCkgQ0NQRVZFLnNob3dJbmZvKDIsIGNvcnBfaWQpO1xuXHRpZiAoY2hhbikgQ0NQRVZFLmpvaW5DaGFubmVsKGNoYW4pO1xuXHRpZiAoY2N0eXBlKSBDQ1BFVkUuY3JlYXRlQ29udHJhY3QoY2N0eXBlKTtcblx0aWYgKHRydXN0bWUpIENDUEVWRS5yZXF1ZXN0VHJ1c3QodHJ1c3RtZSk7XHRcbn1cblxuJChmdW5jdGlvbiAoKSB7XG5cdCQoXCJhW2hyZWZePSdldmU6J11cIikuY2xpY2soSUdCQ2xpY2spO1xufSk7XHRcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vLyB2YXIgVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG52YXIgUCA9IGV4cG9ydHMuUCA9IHt9OyAvLyBwdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLkQgPSB7XG5cdC8vIGRlZmF1bHQgb2JqZWN0IHByb3BlcnRpZXNcblx0dGFibGVzOiB7fSxcblx0dmVyc2lvbjogbnVsbCxcblx0dmVyZGVzYzogbnVsbCxcblx0c2NoZW1hOiBudWxsXG59O1xuXG4vLyByZXR1cm4gcHJvbWlzZTpcbi8vXHRcdHJlamVjdCh7Y29udGV4dDogY3R4LCBzb3VyY2U6IHRoaXMsIHN0YXRzOiBzdGF0dXMsIGVycm9yOiBlcnJtc2d9KTtcbi8vXHRcdHJlc29sdmUoe2NvbnRleHQ6IGN0eCwgc291cmNlOiB0aGlzfSk7XG5QLkxvYWRNZXRhID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBudWxsO1xufTtcblxuUC5IYXNUYWJsZSA9IGZ1bmN0aW9uICh0YmwpIHtcblx0cmV0dXJuIHRoaXMudGFibGVzLmhhc093blByb3BlcnR5KHRibCk7XG59O1xuXG5QLkdldFRhYmxlcyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHRibF9saXN0ID0gW10sXG5cdFx0dGJsXG5cdFx0O1xuXHRmb3IgKHRibCBpbiB0aGlzLnRhYmxlcykge1xuXHRcdGlmICghdGhpcy50YWJsZXMuaGFzT3duUHJvcGVydHkodGJsKSkgY29udGludWU7XG5cdFx0dGJsX2xpc3QucHVzaCh0YmwpO1xuXHR9XG5cdFxuXHRyZXR1cm4gdGJsX2xpc3Q7XG59O1xuXG5QLkdldFRhYmxlID0gZnVuY3Rpb24gKHRibCkge1xuXHRpZiAoIXRibCB8fCAhdGhpcy50YWJsZXMuaGFzT3duUHJvcGVydHkodGJsKSkgcmV0dXJuIG51bGw7XG5cdHJldHVybiB0aGlzLnRhYmxlc1t0YmxdO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9VdGlsc1wiKTtcbnZhciByZXFfYnJvd3Nlcl9pZ25vcmUgPSByZXF1aXJlO1xuXHRcdFxuaWYgKFV0aWxzLmlzQnJvd3Nlcikge1xuXHQvLyBBSkFYLWJhc2VkIEpTT04gbG9hZGVyOyBvbmx5IGZvciBicm93c2VyaWZ5L3N0YW5kYWxvbmUgdmVyc2lvblxuXHRtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL1NERC5Tb3VyY2UuanNvbl9icm93c2VyLmpzXCIpO1xufVxuZWxzZSB7XG5cdC8vIG5vZGVGUyBiYXNlZCBKU09OIGxvYWRlcjsgcmVxdWlyZWQgaW4gYSB3YXkgdGhhdCBicm93c2VyaWZ5IHdpbGwgaWdub3JlXG5cdG1vZHVsZS5leHBvcnRzID0gcmVxX2Jyb3dzZXJfaWdub3JlKFwiLi9TREQuU291cmNlLmpzb25fbm9kZS5qc1wiKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcIm5vZGUuZXh0ZW5kXCIpO1xudmFyIFNvdXJjZSA9IHJlcXVpcmUoXCIuL1NERC5Tb3VyY2UuanNcIik7XG52YXIgVGFibGUgPSByZXF1aXJlKFwiLi9TREQuVGFibGUuanNcIik7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9VdGlscy5qc1wiKTtcblx0XHRcbnZhciBQID0gZXhwb3J0cy5QID0gVXRpbHMuY3JlYXRlKFNvdXJjZS5QKTsgLy8gcHVibGljIG1ldGhvZHMsIGluaGVyaXQgZnJvbSBiYXNlIFNvdXJjZSBjbGFzc1xuXG5leHBvcnRzLkQgPSBleHRlbmQodHJ1ZSwge30sIFNvdXJjZS5ELCB7XG5cdC8vIGRlZmF1bHQgb2JqZWN0IHByb3BlcnRpZXNcblx0Y2ZnOiB7XG5cdFx0Y2FjaGU6IHRydWUsXG5cdFx0ZGF0YXR5cGU6IFwianNvblwiLFxuXHRcdHRpbWVvdXQ6IDBcblx0fSxcblx0anNvbmZpbGVzOiB7fVxufSk7XG5cbmV4cG9ydHMuQ3JlYXRlID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdHZhciBvYmogPSBVdGlscy5jcmVhdGUoUCk7XG5cdGV4dGVuZCh0cnVlLCBvYmosIGV4cG9ydHMuRCk7XG5cdG9iai5Db25maWcoY29uZmlnKTtcblx0cmV0dXJuIG9iajtcbn07XG5cblAuQ29uZmlnID0gZnVuY3Rpb24oY29uZmlnKSB7XG5cdGV4dGVuZCh0aGlzLmNmZywgY29uZmlnKTtcbn07XG5cbmZ1bmN0aW9uIE1ldGFpbmZEb25lKGRhdGEsIHN0YXR1cywganF4aHIsIHAsIGN0eCkge1xuXHR2YXIgdGJsLFxuXHRcdG5ld3QsXG5cdFx0aTtcblxuXHRpZiAoIWRhdGEpIHJldHVybiBwLnJlamVjdCh7Y29udGV4dDogY3R4LCBzb3VyY2U6IHRoaXMsIHN0YXR1czogXCJlcnJvclwiLCBlcnJvcjogXCJpbnZhbGlkIGRhdGEgb2JqZWN0XCJ9KTtcblx0aWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwiZm9ybWF0SURcIikgfHwgZGF0YS5mb3JtYXRJRCAhPSBcIjFcIikgcmV0dXJuIHAucmVqZWN0KHtjb250ZXh0OiBjdHgsIHNvdXJjZTogdGhpcywgc3RhdHVzOiBcImVycm9yXCIsIGVycm9yOiBcInVua25vd24gZGF0YSBmb3JtYXRcIn0pO1xuXHRpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJzY2hlbWFcIikgfHwgIWRhdGEuaGFzT3duUHJvcGVydHkoXCJ2ZXJzaW9uXCIpKSByZXR1cm4gcC5yZWplY3Qoe2NvbnRleHQ6IGN0eCwgc291cmNlOiB0aGlzLCBzdGF0dXM6XCJlcnJvclwiLCBlcnJvcjogXCJkYXRhIGhhcyBubyB2ZXJzaW9uIGluZm9ybWF0aW9uXCJ9KTtcblx0aWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwidGFibGVzXCIpIHx8ICFkYXRhLmhhc093blByb3BlcnR5KFwidGFibGVzXCIpKSByZXR1cm4gcC5yZWplY3Qoe2NvbnRleHQ6IGN0eCwgc291cmNlOiB0aGlzLCBzdGF0dXM6IFwiZXJyb3JcIiwgZXJyb3I6IFwiZGF0YSBoYXMgbm8gdGFibGUgaW5mb3JtYXRpb25cIn0pO1xuXHR0aGlzLnZlcnNpb24gPSBkYXRhLnZlcnNpb247XG5cdHRoaXMuc2NoZW1hID0gZGF0YS5zY2hlbWE7XG5cdGlmIChkYXRhLmhhc093blByb3BlcnR5KFwidmVyZGVzY1wiKSkgdGhpcy52ZXJkZXNjID0gZGF0YS52ZXJkZXNjO1xuXG5cdC8vIHJlc2V0IHN0dWZmXG5cdHRoaXMudGFibGVzID0ge307XG5cdHRoaXMuanNvbmZpbGVzID0ge307XG5cdFxuXHRmb3IgKHRibCBpbiBkYXRhLnRhYmxlcykge1xuXHRcdGlmICghZGF0YS50YWJsZXMuaGFzT3duUHJvcGVydHkodGJsKSkgY29udGludWU7XG5cdFx0XG5cdFx0Ly8gY3JlYXRlIGEgbmV3IHRhYmxlIGZyb20gb3VyIG1ldGFkYXRhXG5cdFx0bmV3dCA9IFRhYmxlLkNyZWF0ZSh0YmwsIHRoaXMsIGRhdGEudGFibGVzW3RibF0pO1xuXHRcdHRoaXMudGFibGVzW25ld3QubmFtZV0gPSBuZXd0O1xuXHRcdFxuXHRcdC8vIGNvbGxlY3QgYSBsaXN0IG9mIGpzb24gc291cmNlc1xuXHRcdGZvciAoaSA9IDA7IGkgPCBuZXd0LnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodGhpcy5qc29uZmlsZXMuaGFzT3duUHJvcGVydHkobmV3dC5zZWdtZW50c1tpXS50YWcpKSBjb250aW51ZTtcblx0XHRcdHRoaXMuanNvbmZpbGVzW25ld3Quc2VnbWVudHNbaV0udGFnXSA9IHtsb2FkZWQ6IGZhbHNlLCBwOiBudWxsfTtcblx0XHR9XG5cdH1cblx0XG5cdHAucmVzb2x2ZSh7Y29udGV4dDogY3R4LCBzb3VyY2U6IHRoaXN9KTtcbn1cblxuZnVuY3Rpb24gTWV0YWluZkZhaWwoanF4aHIsIHN0YXR1cywgZXJyb3IsIHAsIGN0eCkge1xuXHRwLnJlamVjdCh7Y29udGV4dDogY3R4LCBzb3VyY2U6IHRoaXMsIHN0YXR1czogc3RhdHVzLCBlcnJvcjogZXJyb3J9KTtcbn1cblxuUC5Mb2FkTWV0YSA9IGZ1bmN0aW9uKGN0eCkge1xuXHR2YXIgc2VsZiA9IHRoaXMsXG5cdFx0cCA9IFV0aWxzLmRlZmVycmVkKClcblx0XHQ7XG5cdFx0XG5cdGlmICghdGhpcy5jZmcuaGFzT3duUHJvcGVydHkoXCJwYXRoXCIpIHx8IHR5cGVvZiB0aGlzLmNmZy5wYXRoICE9IFwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gcC5yZWplY3Qoe2NvbnRleHQ6IGN0eCwgc291cmNlOiB0aGlzLCBzdGF0dXM6IFwiZXJyb3JcIiwgZXJyb3I6IFwicGF0aCBpcyByZXF1aXJlZFwifSkucHJvbWlzZTtcblx0fVxuXHRpZiAodGhpcy5jZmcuZGF0YXR5cGUgIT0gXCJqc29uXCIgJiYgdGhpcy5jZmcuZGF0YXR5cGUgIT0gXCJqc29ucFwiKSB7XG5cdFx0cmV0dXJuIHAucmVqZWN0KHtjb250ZXh0OiBjdHgsIHNvdXJjZTogdGhpcywgc3RhdHVzOiBcImVycm9yXCIsIGVycm9yOiBcImludmFsaWQgZGF0YXR5cGU6IFwiICsgdGhpcy5jZmcuZGF0YXR5cGV9KS5wcm9taXNlO1xuXHR9XG5cblx0VXRpbHMuYWpheCh7XG5cdFx0ZGF0YVR5cGU6IHRoaXMuY2ZnLmRhdGF0eXBlLFxuXHRcdGNhY2hlOiB0aGlzLmNmZy5jYWNoZSxcblx0XHRqc29ucDogZmFsc2UsXG5cdFx0dGltZW91dDogdGhpcy5jZmcudGltZW91dCxcblx0XHRqc29ucENhbGxiYWNrOiBcIkVWRW9qX21ldGFpbmZfY2FsbGJhY2tcIixcblx0XHR1cmw6IHRoaXMuY2ZnLnBhdGggKyBcIi9tZXRhaW5mLlwiICsgdGhpcy5jZmcuZGF0YXR5cGVcblx0fSkudGhlbihcblx0XHRmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBqcXhocikgeyBNZXRhaW5mRG9uZS5hcHBseShzZWxmLCBbZGF0YSwgc3RhdHVzLCBqcXhociwgcCwgY3R4XSkgfSxcblx0XHRmdW5jdGlvbiAoanF4aHIsIHN0YXR1cywgZXJyb3IpIHsgTWV0YWluZkZhaWwuYXBwbHkoc2VsZiwgW2pxeGhyLCBzdGF0dXMsIGVycm9yLCBwLCBjdHhdKSB9XG5cdCk7XG5cdFxuXHRyZXR1cm4gcC5wcm9taXNlO1xufTtcblxuZnVuY3Rpb24gTG9hZEZpbGVEb25lKGN0eCwganNmLCBkYXRhKSB7XG5cdGlmICghZGF0YSB8fCAhZGF0YS5oYXNPd25Qcm9wZXJ0eShcInRhYmxlc1wiKSkge1xuXHRcdHRoaXMuanNvbmZpbGVzW2pzZl0ucC5yZWplY3Qoe2NvbnRleHQ6IGN0eCwgdGFnOiBqc2YsIHN0YXR1czogXCJlcnJvclwiLCBlcnJvcjogXCJpbnZhbGlkIGRhdGEgb2JqZWN0XCJ9KTtcblx0fVxuXHRlbHNlIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcImZvcm1hdElEXCIpIHx8IGRhdGEuZm9ybWF0SUQgIT0gXCIxXCIpIHtcblx0XHR0aGlzLmpzb25maWxlc1tqc2ZdLnAucmVqZWN0KHtjb250ZXh0OiBjdHgsIHRhZzoganNmLCBzdGF0dXM6IFwiZXJyb3JcIiwgZXJyb3I6IFwidW5rbm93biBkYXRhIGZvcm1hdFwifSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0dGhpcy5qc29uZmlsZXNbanNmXS5sb2FkZWQgPSB0cnVlO1xuXHRcdHRoaXMuanNvbmZpbGVzW2pzZl0uZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5qc29uZmlsZXNbanNmXS5wLnJlc29sdmUoe2NvbnRleHQ6IGN0eCwgdGFnOiBqc2YsIGRhdGE6IGRhdGF9KTtcblx0fVxufVxuZnVuY3Rpb24gTG9hZEZpbGVGYWlsKGN0eCwganNmLCBzdGF0dXMsIGVycm9yKSB7XG5cdHRoaXMuanNvbmZpbGVzW2pzZl0ucC5yZWplY3Qoe2NvbnRleHQ6IGN0eCwgdGFnOiBqc2YsIHN0YXR1czogc3RhdHVzLCBlcnJvcjogZXJyb3J9KTtcbn1cblAuTG9hZFRhZyA9IGZ1bmN0aW9uKGpzZiwgY3R4KSB7XG5cdHZhciBzZWxmID0gdGhpcztcblx0aWYgKHRoaXMuanNvbmZpbGVzW2pzZl0ubG9hZGVkKSB7XG5cdFx0cmV0dXJuIFV0aWxzLmRlZmVycmVkKCkucmVzb2x2ZSh7dGFnOiBqc2YsIGRhdGE6IHRoaXMuanNvbmZpbGVzW2pzZl0uZGF0YX0pLnByb21pc2U7XG5cdH1cblx0ZWxzZSBpZiAodGhpcy5qc29uZmlsZXNbanNmXS5wICE9PSBudWxsKSB7XG5cdFx0cmV0dXJuIHRoaXMuanNvbmZpbGVzW2pzZl0ucC5wcm9taXNlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHRoaXMuanNvbmZpbGVzW2pzZl0ucCA9IFV0aWxzLmRlZmVycmVkKCk7XG5cdFx0VXRpbHMuYWpheCh7XG5cdFx0XHRkYXRhVHlwZTogdGhpcy5jZmcuZGF0YXR5cGUsXG5cdFx0XHRjYWNoZTogdGhpcy5jZmcuY2FjaGUsXG5cdFx0XHRqc29ucDogZmFsc2UsXG5cdFx0XHR0aW1lb3V0OiB0aGlzLmNmZy50aW1lb3V0LFxuXHRcdFx0anNvbnBDYWxsYmFjazogXCJFVkVval9cIiArIGpzZiArIFwiX2NhbGxiYWNrXCIsXG5cdFx0XHR1cmw6IHRoaXMuY2ZnLnBhdGggKyBcIi9cIiArIGpzZiArIFwiLlwiICsgdGhpcy5jZmcuZGF0YXR5cGVcblx0XHR9KS50aGVuKFxuXHRcdFx0ZnVuY3Rpb24gKGRhdGEpIHsgTG9hZEZpbGVEb25lLmFwcGx5KHNlbGYsIFtjdHgsIGpzZiwgZGF0YV0pIH0sXG5cdFx0XHRmdW5jdGlvbiAoanF4aHIsIHN0YXR1cywgZXJyb3IpIHsgTG9hZEZpbGVGYWlsLmFwcGx5KHNlbGYsIFtjdHgsIGpzZiwgc3RhdHVzLCBlcnJvcl0pIH1cblx0XHQpO1xuXHRcdHJldHVybiB0aGlzLmpzb25maWxlc1tqc2ZdLnAucHJvbWlzZTtcdFx0XG5cdH1cdFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcIm5vZGUuZXh0ZW5kXCIpO1xudmFyIFV0aWxzID0gcmVxdWlyZShcIi4vVXRpbHMuanNcIik7XG5cbnZhciBQID0gZXhwb3J0cy5QID0ge307IC8vIHB1YmxpYyBtZXRob2RzXG5cdFx0XHRcbi8vIGRlZmF1bHQgb2JqZWN0IHByb3BlcnRpZXNcbmV4cG9ydHMuRCA9IHtcblx0c3JjOiBudWxsLCAvLyB0aGUgRVZFb2ouU0RELlNvdXJjZSB0aGF0IG93bnMgdGhpcyB0YWJsZVxuXHRuYW1lOiBudWxsLCAvLyB0aGUgbmFtZSBvZiB0aGlzIHRhYmxlXG5cdGtleW5hbWU6IG51bGwsIC8vIHRoZSBwcmltYXJ5IGtleSBuYW1lXG5cdGNvbHVtbnM6IFtdLCAvLyB0aGUgbGlzdCBvZiBjb2x1bW5zXG5cdGNvbG1hcDoge30sIC8vIGEgcmV2ZXJzZSBsb29rdXAgbWFwIGZvciBjb2x1bW4gaW5kZXhlc1xuXHRjOiBudWxsLCAvLyBzaG9ydGN1dCB0byBjb2xtYXBcblx0Y29sbWV0YToge30sIC8vIGEgbWFwIG9mIG1ldGFpbmZvIGFib3V0IGVhY2ggY29tcGxleCBjb2x1bW5cblx0c3Via2V5czogW10sIC8vIGFueSBzdWJrZXlzICh0aGlzIGltcGxpZXMgYSBuZXN0ZWQgZW50cnkgc3RydWN0dXJlKVxuXHRkYXRhOiB7fSwgLy8gdGhlIGRhdGEgZm9yIHRoaXMgdGFibGUgKHNoYWxsb3cgcmVmZXJlbmNlcyBpbnRvIHJhdyBkYXRhIGZyb20gc291cmNlKVxuXHRzZWdtZW50czogW10sIC8vIHRoZSBzZWdtZW50IGluZm9ybWF0aW9uIGZvciB0aGlzIHRhYmxlXG5cdGxlbmd0aDogMCwgLy8gdGhlIHRvdGFsIG51bWJlciBvZiBlbnRyaWVzIGluIHRoaXMgdGFibGVcblx0bG9hZGVkOiAwIC8vIHRoZSB0b3RhbCBudW1iZXIgb2YgY3VycmVudGx5IGxvYWRlZCBlbnRyaWVzXG59O1xuZXhwb3J0cy5DcmVhdGUgPSBmdW5jdGlvbiAobmFtZSwgc3JjLCBtZXRhKSB7XG5cdHZhciBvYmosXG5cdFx0aSxcblx0XHRrZXlhcnJcblx0XHQ7XG5cdFx0XHRcdFx0XHRcdFxuXHRvYmogPSBVdGlscy5jcmVhdGUoUCk7XG5cdGV4dGVuZCh0cnVlLCBvYmosIGV4cG9ydHMuRCk7XG5cdFxuXHQvLyBzb3J0IG91dCByZWxldmFudCBtZXRhZGF0YSBkZXRhaWxzXG5cdG9iai5zcmMgPSBzcmM7XG5cdG9iai5uYW1lID0gbmFtZTtcblx0XG5cdC8vIGRldGVybWluZSB0aGUgc291cmNlKHMpIG9mIHRoaXMgdGFibGUncyBkYXRhXG5cdGlmIChtZXRhLmhhc093blByb3BlcnR5KFwialwiKSkge1xuXHRcdC8vIG9ubHkgb25lIHNlZ21lbnQgYW5kIGl0IGlzIHN0b3JlZCB3aXRoIG90aGVyIHN0dWZmXG5cdFx0b2JqLnNlZ21lbnRzLnB1c2goe21pbjogMCwgbWF4OiAtMSwgdGFnOiBtZXRhLmosIGxvYWRlZDogZmFsc2UsIHA6IG51bGwgfSk7XG5cdH1cblx0ZWxzZSBpZiAobWV0YS5oYXNPd25Qcm9wZXJ0eShcInNcIikpIHtcblx0XHQvLyAgYXQgbGVhc3Qgb25lIHNlZ21lbnQgdGhhdCBpcyBzdG9yZWQgaW5kZXBlbmRlbnRseVxuXHRcdGZvciAoaSA9IDA7IGkgPCBtZXRhLnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG9iai5zZWdtZW50cy5wdXNoKHttaW46IG1ldGEuc1tpXVsxXSwgbWF4OiBtZXRhLnNbaV1bMl0sIHRhZzogbmFtZSArIFwiX1wiICsgbWV0YS5zW2ldWzBdLCBsb2FkZWQ6IGZhbHNlLCBwOiBudWxsIH0pO1xuXHRcdH1cblx0fVxuXHRcdFxuXHQvLyBmaW5kIG91dCB0aGUga2V5IGluZm8gZm9yIHRoaXMgdGFibGVcblx0aWYgKG1ldGEuaGFzT3duUHJvcGVydHkoXCJrXCIpKSB7XG5cdFx0a2V5YXJyID0gbWV0YS5rLnNwbGl0KFwiOlwiKTtcblx0XHRvYmoua2V5bmFtZSA9IGtleWFyci5zaGlmdCgpO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBrZXlhcnIubGVuZ3RoOyBpKyspIG9iai5zdWJrZXlzLnB1c2goa2V5YXJyW2ldKTtcblx0fVxuXHRcblx0Ly8gYWRkIGtleXMgdG8gdGhlIGNvbHVtbiBkZWZpbml0aW9uXG5cdGlmIChvYmoua2V5bmFtZSkgb2JqLmNvbHVtbnMucHVzaChvYmoua2V5bmFtZSk7XG5cdGVsc2Ugb2JqLmNvbHVtbnMucHVzaChcImluZGV4XCIpO1xuXHRmb3IgKGkgPSAwOyBpIDwgb2JqLnN1YmtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRvYmouY29sdW1ucy5wdXNoKG9iai5zdWJrZXlzW2ldKTtcblx0fVxuXG5cdC8vIGFkZCBtZXRhIGNvbHVtbnMgdG8gY29sdW1uIGRlZmluaXRpb25cblx0aWYgKG1ldGEuaGFzT3duUHJvcGVydHkoXCJjXCIpKSB7XG5cdFx0Zm9yIChpID0gMDsgaSA8IG1ldGEuYy5sZW5ndGg7IGkrKykgb2JqLmNvbHVtbnMucHVzaChtZXRhLmNbaV0pO1xuXHR9XG5cdFxuXHQvLyBjcmVhdGUgYSByZXZlcnNlIGxvb2t1cCBtYXAgZm9yIGNvbHVtbnNcblx0Zm9yIChpID0gMDsgaSA8IG9iai5jb2x1bW5zLmxlbmd0aDsgaSsrKSBvYmouY29sbWFwW29iai5jb2x1bW5zW2ldXSA9IGk7XG5cdG9iai5jb2xtYXAuaW5kZXggPSAwO1xuXHRvYmouYyA9IG9iai5jb2xtYXA7XG5cdFxuXHQvLyBncmFiIHRoZSBjb2xtZXRhIGV4dHJhIGluZm9cblx0aWYgKG1ldGEuaGFzT3duUHJvcGVydHkoXCJtXCIpKSB7XHRcdFxuXHRcdGV4dGVuZCh0cnVlLCBvYmouY29sbWV0YSwgbWV0YS5tKTtcblx0fVxuXG5cdC8vIGdyYWIgdGhlIGxlbmd0aFxuXHRpZiAobWV0YS5oYXNPd25Qcm9wZXJ0eShcImxcIikpIHtcblx0XHRvYmoubGVuZ3RoID0gbWV0YS5sO1xuXHR9XG5cdFxuXHRyZXR1cm4gb2JqO1xufTtcblxuLy8gZ2V0IHRoZSBlbnRyeSBmb3IgdGhlIGtleSBwcm92aWRlZDsgYWxsIGtleXMgbXVzdCBiZSBudW1lcmljIHZhbHVlcyBmb3Igc2VnbWVudGF0aW9uXG5QLkdldEVudHJ5ID0gZnVuY3Rpb24gKGtleSkge1xuXHR2YXIgaSxcblx0XHRua2V5LFxuXHRcdHNrZXk7XG5cdFxuXHQvLyBnZXQgYSBndWFyYW50ZWVkIG51bWVyaWMgYW5kIGd1YXJhbnRlZWQgc3RyaW5nIHZlcnNpb24gb2YgdGhlIGtleTsgbnVtZXJpY1xuXHQvLyBpcyBmb3Igc2VnbWVudCBjb21wYXJpc29uLCBzdHJpbmcgaXMgZm9yIG9iamVjdCBwcm9wZXJ0eSBsb29rdXBcblx0bmtleSA9IHBhcnNlSW50KGtleSwgMTApO1xuXHRpZiAoaXNOYU4obmtleSkpIHJldHVybiBudWxsO1xuXHRza2V5ID0gbmtleS50b1N0cmluZygxMCk7XG5cdGlmICh0aGlzLmRhdGEuaGFzT3duUHJvcGVydHkoc2tleSkpIHJldHVybiB0aGlzLmRhdGFbc2tleV07XG5cdFxuXHQvLyBpZiB3ZSBkb24ndCBoYXZlIHRoaXMga2V5LCBkZXRlcm1pbmUgaWYgd2Ugb3VnaHQgdG8gYnkgbm93XG5cdGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKG5rZXkgPj0gdGhpcy5zZWdtZW50c1tpXS5taW4gJiYgKG5rZXkgPD0gdGhpcy5zZWdtZW50c1tpXS5tYXggfHwgdGhpcy5zZWdtZW50c1tpXS5tYXggPT0gLTEpKSB7XG5cdFx0XHRpZiAodGhpcy5zZWdtZW50c1tpXS5sb2FkZWQpIHJldHVybiBudWxsOyAvLyB0aGUga2V5IHNob3VsZCBiZSBpbiB0aGlzIHNlZ21lbnRcblx0XHRcdGVsc2UgcmV0dXJuIGZhbHNlOyAvLyB0aGUgc2VnbWVudCBpc24ndCBsb2FkZWQgeWV0XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gbnVsbDtcdFx0XG59O1x0XHRcblxuLy8gZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGtleSAob3IgZW50cnkgYXJyYXkpIGFuZCBjb2x1bW4gcHJvdmlkZWRcblAuR2V0VmFsdWUgPSBmdW5jdGlvbiAoa2V5LCBjb2wpIHtcblx0dmFyIGVudHJ5O1xuXHRpZiAoa2V5IGluc3RhbmNlb2YgQXJyYXkpIGVudHJ5ID0ga2V5O1xuXHRlbHNlIGVudHJ5ID0gdGhpcy5HZXRFbnRyeShrZXkpO1xuXHRpZiAoZW50cnkgPT09IG51bGwgfHwgZW50cnkgPT09IGZhbHNlKSByZXR1cm4gZW50cnk7XG5cdGlmIChpc05hTihjb2wpKSB7XG5cdFx0aWYgKCF0aGlzLmNvbG1hcC5oYXNPd25Qcm9wZXJ0eShjb2wpKSByZXR1cm4gbnVsbDtcblx0XHRjb2wgPSB0aGlzLmNvbG1hcFtjb2xdO1xuXHR9XG5cdHJldHVybiBlbnRyeVtjb2xdO1xufTtcblxuZnVuY3Rpb24gVW5zaGlmdEluZGV4ZXMoZGF0YSwgaW5kZXhlcykge1xuXHR2YXIga2V5LCBpO1xuXHRmb3IgKGtleSBpbiBkYXRhKSB7XG5cdFx0aWYgKCFkYXRhLmhhc093blByb3BlcnR5KGtleSkpIHJldHVybjtcblx0XHRpZiAoIWRhdGFba2V5XSkgcmV0dXJuO1xuXHRcdGluZGV4ZXMucHVzaChwYXJzZUludChrZXksIDEwKSk7XG5cdFx0aWYgKGRhdGFba2V5XSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRmb3IgKGkgPSBpbmRleGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdGRhdGFba2V5XS51bnNoaWZ0KGluZGV4ZXNbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIFVuc2hpZnRJbmRleGVzKGRhdGFba2V5XSwgaW5kZXhlcyk7XG5cdFx0aW5kZXhlcy5wb3AoKTtcblx0fVxufVxuZnVuY3Rpb24gU2VnTG9hZERvbmUodGFnLCBkYXRhLCBkb25lLCBwLCBjdHgsIHByb2dyZXNzKSB7XG5cdHZhciBpO1xuXHRkb25lLmhhcysrO1xuXHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5zZWdtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGlmICh0aGlzLnNlZ21lbnRzW2ldLnRhZyAhPSB0YWcpIGNvbnRpbnVlO1xuXHRcdGlmIChkYXRhLnRhYmxlcy5oYXNPd25Qcm9wZXJ0eSh0aGlzLm5hbWUpICYmIGRhdGEudGFibGVzW3RoaXMubmFtZV0uaGFzT3duUHJvcGVydHkoXCJkXCIpKSB7XHRcdFxuXHRcdFx0aWYgKCFkYXRhLnRhYmxlc1t0aGlzLm5hbWVdLmhhc093blByb3BlcnR5KFwiVVwiKSkge1xuXHRcdFx0XHQvLyBwdXQgdGhlIGluZGV4ZXMgaW50byB0aGUgZmlyc3QgY29sdW1ucyBvZiBldmVyeSByb3dcblx0XHRcdFx0VW5zaGlmdEluZGV4ZXMoZGF0YS50YWJsZXNbdGhpcy5uYW1lXS5kLCBbXSk7XG5cdFx0XHRcdGRhdGEudGFibGVzW3RoaXMubmFtZV0uVSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRleHRlbmQodGhpcy5kYXRhLCBkYXRhLnRhYmxlc1t0aGlzLm5hbWVdLmQpO1xuXHRcdFx0aWYgKGRhdGEudGFibGVzW3RoaXMubmFtZV0uaGFzT3duUHJvcGVydHkoXCJMXCIpKSB7XG5cdFx0XHRcdHRoaXMubG9hZGVkICs9IGRhdGEudGFibGVzW3RoaXMubmFtZV0uTDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGRvbmUubmVlZHMgPT0gMSkge1xuXHRcdFx0XHR0aGlzLmxvYWRlZCA9IHRoaXMubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zZWdtZW50c1tpXS5sb2FkZWQgPSB0cnVlO1xuXHRcdH1cblx0XHRicmVhaztcblx0fVx0XG5cdGlmIChwcm9ncmVzcyAhPT0gbnVsbCkgcHJvZ3Jlc3Moe2NvbnRleHQ6IGN0eCwgdGFibGU6IHRoaXMsIGhhczogZG9uZS5oYXMsIG5lZWRzOiBkb25lLm5lZWRzfSk7XG5cdGlmIChkb25lLmhhcyA+PSBkb25lLm5lZWRzKSBwLnJlc29sdmUoe2NvbnRleHQ6IGN0eCwgdGFibGU6IHRoaXN9KTtcbn1cbmZ1bmN0aW9uIFNlZ0xvYWRGYWlsKHRhZywgc3RhdHVzLCBlcnJvciwgcCwgY3R4KSB7XG5cdHAucmVqZWN0KHtjb250ZXh0OiBjdHgsIHRhYmxlOiB0aGlzLCBzdGF0dXM6IHN0YXR1cywgZXJyb3I6IGVycm9yfSk7XG59XG5cbi8vIGxvYWQgZGF0YSBmb3IgdGhpcyB0YWJsZTsgcmV0dXJucyBhIGRlZmVycmVkIHByb21pc2Ugb2JqZWN0IGFzIHRoaXMgaXMgYW4gYXN5bmMgdGhpbmdcbi8vIGlmIGtleSBpcyBwcm92aWRlZCwgbG9hZHMgT05MWSB0aGUgc2VnbWVudCBjb250YWluaW5nIHRoYXQga2V5XG5QLkxvYWQgPSBmdW5jdGlvbihvcHRzKSB7XG5cdHZhciBwID0gVXRpbHMuZGVmZXJyZWQoKSxcblx0XHRzZWxmID0gdGhpcyxcblx0XHRhbGxfbmVlZHMsXG5cdFx0ZG9uZSxcblx0XHRua2V5LFxuXHRcdHNrZXksXG5cdFx0aSxcblx0XHRzZWdtZW50LFxuXHRcdG8gPSB7XG5cdFx0XHRjb250ZXh0OiBudWxsLFxuXHRcdFx0a2V5OiBudWxsLFxuXHRcdFx0cHJvZ3Jlc3M6IG51bGxcblx0XHR9LFxuXHRcdHRoZW5Eb25lLFxuXHRcdHRoZW5GYWlsXG5cdFx0O1xuXHRleHRlbmQobywgb3B0cyk7XG5cdFxuXHRpZiAoby5rZXkgPT09IG51bGwpIHtcblx0XHQvLyBsb2FkIGFsbCBzZWdtZW50c1xuXHRcdGFsbF9uZWVkcyA9IFtdO1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoIXRoaXMuc2VnbWVudHNbaV0ubG9hZGVkKSB7XG5cdFx0XHRcdC8vIHRoaXMgc2VnbWVudCBub3QgeWV0IGxvYWRlZFxuXHRcdFx0XHRhbGxfbmVlZHMucHVzaChpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZG9uZSA9IHtuZWVkczogYWxsX25lZWRzLmxlbmd0aCwgaGFzOiAwfTtcblx0XHRpZiAoYWxsX25lZWRzLmxlbmd0aCA+IDApIHtcblx0XHRcdHRoZW5Eb25lID0gZnVuY3Rpb24gKGFyZykgeyBTZWdMb2FkRG9uZS5hcHBseShzZWxmLCBbYXJnLnRhZywgYXJnLmRhdGEsIGRvbmUsIHAsIG8uY29udGV4dCwgby5wcm9ncmVzc10pIH07XG5cdFx0XHR0aGVuRmFpbCA9IGZ1bmN0aW9uIChhcmcpIHsgU2VnTG9hZEZhaWwuYXBwbHkoc2VsZiwgW2FyZy50YWcsIGFyZy5zdGF0dXMsIGFyZy5lcnJvciwgcCwgby5jb250ZXh0XSkgfTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhbGxfbmVlZHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0c2VnbWVudCA9IHRoaXMuc2VnbWVudHNbYWxsX25lZWRzW2ldXTtcblx0XHRcdFx0aWYgKCFzZWdtZW50LnApIHtcblx0XHRcdFx0XHQvLyB0aGlzIHNlZ21lbnQgbm90IHBlbmRpbmcgbG9hZFxuXHRcdFx0XHRcdHNlZ21lbnQucCA9IHRoaXMuc3JjLkxvYWRUYWcoc2VnbWVudC50YWcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlZ21lbnQucC50aGVuKHRoZW5Eb25lLCB0aGVuRmFpbCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcC5wcm9taXNlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHAucmVzb2x2ZSh7Y29udGV4dDogby5jb250ZXh0LCB0YWJsZTogdGhpc30pO1xuXHRcdFx0cmV0dXJuIHAucHJvbWlzZTtcblx0XHR9XHRcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBkZXRlcm1pbmUgd2hpY2ggc2VnbWVudCB0aGUga2V5IGlzIGluXG5cdFx0bmtleSA9IHBhcnNlSW50KG8ua2V5LCAxMCk7XG5cdFx0aWYgKGlzTmFOKG5rZXkpKSB7XG5cdFx0XHRwLnJlamVjdCh7Y29udGV4dDogby5jb250ZXh0LCB0YWJsZTogdGhpcywgc3RhdHVzOiBcImJhZGtleVwiLCBlcnJvcjogXCJpbnZhbGlkIGtleTsgbm90IG51bWVyaWNcIn0pO1xuXHRcdFx0cmV0dXJuIHRoaXMucC5wcm9taXNlO1xuXHRcdH1cblx0XHRza2V5ID0gbmtleS50b1N0cmluZygxMCk7XG5cdFx0c2VnbWVudCA9IC0xO1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAobmtleSA+PSB0aGlzLnNlZ21lbnRzW2ldLm1pbiAmJiAobmtleSA8PSB0aGlzLnNlZ21lbnRzW2ldLm1heCB8fCB0aGlzLnNlZ21lbnRzW2ldLm1heCA9PSAtMSkpIHtcblx0XHRcdFx0Ly8gdGhlIGtleSBzaG91bGQgYmUgaW4gdGhpcyBzZWdtZW50XG5cdFx0XHRcdHNlZ21lbnQgPSB0aGlzLnNlZ21lbnRzW2ldO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0aWYgKHNlZ21lbnQgPT09IC0xKSByZXR1cm4gcC5yZWplY3Qoe2NvbnRleHQ6IG8uY29udGV4dCwgdGFibGU6IHRoaXMsIHN0YXR1czogXCJiYWRrZXlcIiwgZXJyb3I6IFwiaW52YWxpZCBrZXk7IG5vIHNlZ21lbnQgY29udGFpbnMgaXRcIn0pLnByb21pc2U7XG5cdFx0aWYgKHNlZ21lbnQubG9hZGVkKSByZXR1cm4gcC5yZXNvbHZlKHtjb250ZXh0OiBvLmNvbnRleHQsIHRhYmxlOiB0aGlzfSkucHJvbWlzZTtcblx0XHRcblx0XHRpZiAoc2VnbWVudC5wID09PSBudWxsKSBzZWdtZW50LnAgPSB0aGlzLnNyYy5Mb2FkVGFnKHNlZ21lbnQudGFnKTtcblx0XHRkb25lID0ge25lZWRzOiAxLCBoYXM6IDB9O1xuXHRcdHNlZ21lbnQucC50aGVuKFxuXHRcdFx0ZnVuY3Rpb24gKGFyZykgeyBTZWdMb2FkRG9uZS5hcHBseShzZWxmLCBbYXJnLnRhZywgYXJnLmRhdGEsIGRvbmUsIHAsIG8uY29udGV4dCwgby5wcm9ncmVzc10pIH0sXG5cdFx0XHRmdW5jdGlvbiAoYXJnKSB7IFNlZ0xvYWRGYWlsLmFwcGx5KHNlbGYsIFthcmcudGFnLCBhcmcuc3RhdHVzLCBhcmcuZXJyb3IsIHAsIG8uY29udGV4dF0pIH1cblx0XHQpO1xuXHRcdFxuXHRcdHJldHVybiBwLnByb21pc2U7XG5cdH1cbn07XG5cblAuQ29sSXRlciA9IGZ1bmN0aW9uIChjb2xuYW1lKSB7XG5cdHZhciBjb2xudW07XG5cdGlmICh0aGlzLmNvbG1hcC5oYXNPd25Qcm9wZXJ0eShjb2xuYW1lKSkge1xuXHRcdGNvbG51bSA9IHRoaXMuY29sbWFwW2NvbG5hbWVdO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZVtjb2xudW1dIH07XG5cdH1cblx0ZWxzZSByZXR1cm4gZnVuY3Rpb24gKCkgeyByZXR1cm4gdW5kZWZpbmVkIH07XG59O1xuXG5QLkNvbFByZWQgPSBmdW5jdGlvbiAoY29sbmFtZSwgY29tcGFyZSwgdmFsdWUpIHtcblx0dmFyIGNvbG51bTtcblx0aWYgKHRoaXMuY29sbWFwLmhhc093blByb3BlcnR5KGNvbG5hbWUpKSB7XG5cdFx0Y29sbnVtID0gdGhpcy5jb2xtYXBbY29sbmFtZV07XG5cdFx0aWYgKGNvbXBhcmUgPT0gXCI9PVwiIHx8IGNvbXBhcmUgPT0gXCJlcVwiKSByZXR1cm4gZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGVbY29sbnVtXSA9PSB2YWx1ZSB9O1xuXHRcdGlmIChjb21wYXJlID09IFwiIT1cIiB8fCBjb21wYXJlID09IFwibmVcIikgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlW2NvbG51bV0gIT0gdmFsdWUgfTtcblx0XHRpZiAoY29tcGFyZSA9PSBcIj09PVwiIHx8IGNvbXBhcmUgPT0gXCJzZXFcIikgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlW2NvbG51bV0gPT09IHZhbHVlIH07XG5cdFx0aWYgKGNvbXBhcmUgPT0gXCIhPT1cIiB8fCBjb21wYXJlID09IFwic25lXCIpIHJldHVybiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZVtjb2xudW1dICE9PSB2YWx1ZSB9O1xuXHRcdGVsc2UgaWYgKGNvbXBhcmUgPT0gXCI+XCIgfHwgY29tcGFyZSA9PSBcImd0XCIpIHJldHVybiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZVtjb2xudW1dID4gdmFsdWUgfTtcblx0XHRlbHNlIGlmIChjb21wYXJlID09IFwiPj1cIiB8fCBjb21wYXJlID09IFwiZ3RlXCIpIHJldHVybiBmdW5jdGlvbiAoZSkgeyByZXR1cm4gZVtjb2xudW1dID49IHZhbHVlIH07XG5cdFx0ZWxzZSBpZiAoY29tcGFyZSA9PSBcIjxcIiB8fCBjb21wYXJlID09IFwibHRcIikgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlW2NvbG51bV0gPCB2YWx1ZSB9O1xuXHRcdGVsc2UgaWYgKGNvbXBhcmUgPT0gXCI8PVwiIHx8IGNvbXBhcmUgPT0gXCJsdGVcIikgcmV0dXJuIGZ1bmN0aW9uIChlKSB7IHJldHVybiBlW2NvbG51bV0gPCB2YWx1ZSB9O1xuXHR9XG5cdGVsc2UgcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlIH07XHRcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gdmFyIFV0aWxzID0gcmVxdWlyZSgnLi9VdGlscycpO1xuXG5leHBvcnRzLlNvdXJjZSA9IHJlcXVpcmUoXCIuL1NERC5Tb3VyY2UuanNcIik7XG5leHBvcnRzLlNvdXJjZS5qc29uID0gcmVxdWlyZShcIi4vU0RELlNvdXJjZS5qc29uLmpzXCIpO1xuZXhwb3J0cy5UYWJsZSA9IHJlcXVpcmUoXCIuL1NERC5UYWJsZS5qc1wiKTtcblxuLy8gY3JlYXRlIGEgbmV3IGRhdGEgc291cmNlIG9mIHRoZSB0eXBlIHNwZWNpZmllZCB3aXRoIHRoZSBjb25maWcgcHJvdmlkZWQ7XG4vLyBFVkVvai5kYXRhLlNvdXJjZS48dHlwZT4gaGFuZGxlcyB0aGUgaW1wbGVtZW50YXRpb24gZGV0YWlsc1xuZXhwb3J0cy5DcmVhdGUgPSBmdW5jdGlvbih0eXBlLCBjb25maWcpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzLlNvdXJjZVt0eXBlXSA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgZXhwb3J0cy5Tb3VyY2VbdHlwZV0uQ3JlYXRlICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBudWxsO1xuXHRyZXR1cm4gZXhwb3J0cy5Tb3VyY2VbdHlwZV0uQ3JlYXRlKGNvbmZpZyk7XG59O1xuIiwiLyogZ2xvYmFsIGpRdWVyeTogZmFsc2UgKi9cbi8qIGdsb2JhbCBQcm9taXNlOiBmYWxzZSAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuaXNCcm93c2VyID0gdHlwZW9mKHdpbmRvdykgIT09IFwidW5kZWZpbmVkXCI7XG5cbnZhciByZXFfYnJvd3Nlcl9pZ25vcmUgPSByZXF1aXJlO1xudmFyIEJCO1xuXG52YXIgRiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vLyBpbXBsZW1lbnRhdGlvbnMgZnJvbSBleHRlcm5hbCBzdHVmZiAobW9zdGx5IGpRdWVyeSkgdGhhdCBtaWdodCB0aGVvcmV0aWNhbGx5IGNoYW5nZSBsYXRlclxuZXhwb3J0cy5jcmVhdGUgPSAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09IFwiZnVuY3Rpb25cIikgP1xuXHRPYmplY3QuY3JlYXRlIDpcblx0ZnVuY3Rpb24gKG8pIHtcblx0XHQvLyBvYmplY3QgY3JlYXRlIHBvbHlmaWxsIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvY3JlYXRlKVxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkgdGhyb3cgRXJyb3IoXCJTZWNvbmQgYXJndW1lbnQgbm90IHN1cHBvcnRlZFwiKTtcblx0XHRpZiAobyA9PT0gbnVsbCkgdGhyb3cgRXJyb3IoXCJDYW5ub3Qgc2V0IGEgbnVsbCBbW1Byb3RvdHlwZV1dXCIpO1xuXHRcdGlmICh0eXBlb2YobykgIT09IFwib2JqZWN0XCIpIHRocm93IFR5cGVFcnJvcihcIkFyZ3VtZW50IG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuXHRcdEYucHJvdG90eXBlID0gbztcblx0XHRyZXR1cm4gbmV3IEYoKTtcblx0fTtcblxuaWYgKGV4cG9ydHMuaXNCcm93c2VyKSB7XG5cdC8vIGdyYWIgZGVmZXJyZWQgZnJvbSBnbG9iYWwsIGN1c3RvbS1idWlsdCBibHVlYmlyZCAoaW5zZXJ0ZWQgYnkgdWdsaWZ5KVxuXHRleHBvcnRzLmRlZmVycmVkID0gUHJvbWlzZS5kZWZlcjtcblxuXHQvLyBncmFiIGFqYXggZnJvbSBqUXVlcnkgKGltcGxpZWQgZGVwZW5kZW5jeSlcblx0ZXhwb3J0cy5hamF4ID0galF1ZXJ5LmFqYXg7XG59XG5lbHNlIHtcblx0Ly8gYmx1ZWJpcmQgcmVxdWlyZWQgaW4gYSB3YXkgdGhhdCBicm93c2VyaWZ5IHdpbGwgaWdub3JlIChzaW5jZSB1c2luZyBjdXN0b20gYnVpbHQgZm9yIHN0YW5kYWxvbmUpXG5cdEJCID0gcmVxX2Jyb3dzZXJfaWdub3JlKFwiYmx1ZWJpcmRcIik7XG5cdGV4cG9ydHMuZGVmZXJyZWQgPSBCQi5kZWZlcjtcbn1cblxuZXhwb3J0cy5Gb3JtYXROdW0gPSBmdW5jdGlvbiAodmFsLCBmaXhlZCkge1xuXHR2YXIgc3RyaW5neSA9IFtdLFxuXHRcdGJhc2UgPSBTdHJpbmcoTWF0aC5mbG9vcih2YWwpKSxcblx0XHRrID0gLTEsXG5cdFx0aSA9IDAsXG5cdFx0ZGVjaW1hbHNcblx0XHQ7XG5cdFxuXHRmaXhlZCA9IGZpeGVkIHx8IDA7XG5cdFxuXHRmb3IgKGkgPSBiYXNlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0aWYgKGsgJSAzID09PSAwKSB7XG5cdFx0XHRrID0gMTtcblx0XHRcdHN0cmluZ3kucHVzaChcIixcIik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGsgPT0gLTEpIHtcblx0XHRcdGsgPSAxO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGsrKztcblx0XHR9XG5cdFx0c3RyaW5neS5wdXNoKGJhc2UuY2hhckF0KGkpKTtcblx0fVxuXHRiYXNlID0gXCJcIjtcblx0Zm9yIChpID0gc3RyaW5neS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdGJhc2UgPSBiYXNlLmNvbmNhdChzdHJpbmd5W2ldKTtcblx0fVx0XHRcblx0XG5cdGlmIChmaXhlZCA+IDApIHtcblx0XHRkZWNpbWFscyA9IHZhbC50b0ZpeGVkKGZpeGVkKTtcblx0XHRiYXNlICs9IGRlY2ltYWxzLnN1YnN0cmluZyhkZWNpbWFscy5sZW5ndGggLSBmaXhlZCAtIDEpO1xuXHR9XG5cdFxuXHRyZXR1cm4gYmFzZTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBleHRlbmQgPSByZXF1aXJlKFwibm9kZS5leHRlbmRcIik7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9VdGlscy5qc1wiKTtcblxudmFyIFAgPSBleHBvcnRzLlAgPSB7fTsgLy8gcHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5EID0ge1xuXHRJRDogbnVsbCxcblx0bmFtZTogbnVsbCxcblx0cmVnaW9uSUQ6IG51bGwsXG5cdGNvbnN0ZWxsYXRpb25JRDogbnVsbCxcblx0cG9zOiB7eDogbnVsbCwgeTogbnVsbCwgejogbnVsbH0sXG5cdHBvc01heDoge3g6IG51bGwsIHk6IG51bGwsIHo6IG51bGx9LFxuXHRwb3NNaW46IHt4OiBudWxsLCB5OiBudWxsLCB6OiBudWxsfSxcblx0bHVtaW5vc2l0eTogbnVsbCxcblx0Ym9yZGVyOiBudWxsLFxuXHRmcmluZ2U6IG51bGwsXG5cdGNvcnJpZG9yOiBudWxsLFxuXHRodWI6IG51bGwsXG5cdGludGVybmF0aW9uYWw6IG51bGwsXG5cdHJlZ2lvbmFsOiBudWxsLFxuXHRjb25zdGVsbGF0aW9uOiBudWxsLFxuXHRjb250aWd1b3VzOiBudWxsLFxuXHRzZWN1cml0eTogbnVsbCxcblx0c2VjOiBudWxsLFxuXHRmYWN0aW9uSUQ6IG51bGwsXG5cdHJhZGl1czogbnVsbCxcblx0c3VuVHlwZUlEOiBudWxsLFxuXHRzZWN1cml0eUNsYXNzOiBudWxsLFxuXHR3b3JtaG9sZUNsYXNzSUQ6IG51bGwsXG5cdHN0YXRpb25Db3VudDogbnVsbFx0XHRcbn07XG5leHBvcnRzLkNyZWF0ZSA9IGZ1bmN0aW9uICh0YmwsIElEKSB7XHRcblx0dmFyIG9iaixcblx0XHRzeXMsXG5cdFx0Y29sLFxuXHRcdG5JRFxuXHRcdDtcblx0XHRcblx0bklEID0gcGFyc2VJbnQoSUQsIDEwKTtcblx0XHRcblx0c3lzID0gdGJsLkdldEVudHJ5KG5JRCk7XG5cdGlmICghc3lzKSByZXR1cm4gbnVsbDtcblx0b2JqID0gVXRpbHMuY3JlYXRlKFApO1xuXHRleHRlbmQodHJ1ZSwgb2JqLCBleHBvcnRzLkQpO1xuXHRjb2wgPSB0YmwuY29sbWFwO1xuXHRcblx0b2JqLklEID0gbklEO1xuXHRvYmoubmFtZSA9IHN5c1tjb2wuc29sYXJTeXN0ZW1OYW1lXTtcblx0b2JqLnJlZ2lvbklEID0gc3lzW2NvbC5yZWdpb25JZF07XG5cdG9iai5jb25zdGVsbGF0aW9uSUQgPSBzeXNbY29sLmNvbnN0ZWxsYXRpb25JRF07XG5cdG9iai5wb3MgPSB7eDogc3lzW2NvbC54XSwgeTogc3lzW2NvbC55XSwgejogc3lzW2NvbC56XX07XG5cdG9iai5wb3NNaW4gPSB7eDogc3lzW2NvbC54TWluXSwgeTogc3lzW2NvbC55TWluXSwgejogc3lzW2NvbC56TWluXX07XG5cdG9iai5wb3NNYXggPSB7eDogc3lzW2NvbC54TWF4XSwgeTogc3lzW2NvbC55TWF4XSwgejogc3lzW2NvbC56TWF4XX07XG5cdG9iai5sdW1pbm9zaXR5ID0gc3lzW2NvbC5sdW1pbm9zaXR5XTtcblx0b2JqLmJvcmRlciA9IHN5c1tjb2wuYm9yZGVyXTtcblx0b2JqLmZyaW5nZSA9IHN5c1tjb2wuZnJpbmdlXTtcblx0b2JqLmNvcnJpZG9yID0gc3lzW2NvbC5jb3JyaWRvcl07XG5cdG9iai5odWIgPSBzeXNbY29sLmh1Yl07XG5cdG9iai5pbnRlcm5hdGlvbmFsID0gc3lzW2NvbC5pbnRlcm5hdGlvbmFsXTtcblx0b2JqLnJlZ2lvbmFsID0gc3lzW2NvbC5yZWdpb25hbF07XG5cdG9iai5jb25zdGVsbGF0aW9uID0gc3lzW2NvbC5jb25zdGVsbGF0aW9uXTtcblx0b2JqLmNvbnRpZ3VvdXMgPSBzeXNbY29sLmNvbnRpZ3VvdXNdO1xuXHRvYmouc2VjdXJpdHkgPSBzeXNbY29sLnNlY3VyaXR5XTtcblx0b2JqLnNlYyA9IChvYmouc2VjdXJpdHkgPiAwKSA/IG9iai5zZWN1cml0eS50b0ZpeGVkKDEpIDogXCIwLjBcIjtcblx0b2JqLmZhY3Rpb25JRCA9IChzeXNbY29sLmZhY3Rpb25JRF0gIT09IDApID8gc3lzW2NvbC5mYWN0aW9uSURdIDogbnVsbDtcblx0b2JqLnJhZGl1cyA9IHN5c1tjb2wucmFkaXVzXTtcblx0b2JqLnN1blR5cGVJRCA9IHN5c1tjb2wuc3VuVHlwZUlEXTtcblx0b2JqLnNlY3VyaXR5Q2xhc3MgPSBzeXNbY29sLnNlY3VyaXR5Q2xhc3NdO1xuXHRvYmoud29ybWhvbGVDbGFzc0lEID0gc3lzW2NvbC53b3JtaG9sZUNsYXNzSURdO1xuXHRvYmouc3RhdGlvbkNvdW50ID0gKHN5c1tjb2wuc3RhdGlvbkNvdW50XSkgPyBzeXNbY29sLnN0YXRpb25Db3VudF0gOiAwO1xuXG5cdHJldHVybiBvYmo7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKFwibm9kZS5leHRlbmRcIik7XG52YXIgVXRpbHMgPSByZXF1aXJlKFwiLi9VdGlscy5qc1wiKTtcblxudmFyIFAgPSBleHBvcnRzLlAgPSB7fTsgLy8gcHVibGljIG1ldGhvZHNcbmV4cG9ydHMuRCA9IHtcblx0Ly8gZGVmYXVsdCBvYmplY3QgcHJvcGVydGllc1xuXHRjdXJpZHg6IDAsXG5cdG1hcDogbnVsbCxcblx0a2V5c2V0OiBbXVxufTtcbmV4cG9ydHMuQ3JlYXRlID0gZnVuY3Rpb24gKG1hcCkge1xuXHR2YXIgb2JqLFxuXHRcdGtleSxcblx0XHR0Ymxcblx0XHQ7XG5cblx0b2JqID0gVXRpbHMuY3JlYXRlKFApO1xuXHRleHRlbmQodHJ1ZSwgb2JqLCBleHBvcnRzLkQpO1xuXHRvYmoubWFwID0gbWFwO1xuXHR0YmwgPSBtYXAudGFibGVzW1wibWFwXCIgKyBtYXAuc3BhY2UgKyBcIlNvbGFyU3lzdGVtc1wiXS50Ymw7XG5cdFxuXHRmb3IgKGtleSBpbiB0YmwuZGF0YSkge1xuXHRcdGlmICghdGJsLmRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cdFx0b2JqLmtleXNldC5wdXNoKGtleSk7XG5cdH1cblx0XG5cdHJldHVybiBvYmo7XHRcbn07XG5cblAuSGFzTmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKHRoaXMuY3VyaWR4IDwgdGhpcy5rZXlzZXQubGVuZ3RoKSByZXR1cm4gdHJ1ZTtcbn07XG5cblAuTmV4dCA9IGZ1bmN0aW9uICgpIHtcblx0cmV0dXJuIHRoaXMubWFwLkdldFN5c3RlbSh7aWQ6IHRoaXMua2V5c2V0W3RoaXMuY3VyaWR4KytdfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKFwibm9kZS5leHRlbmRcIik7XG52YXIgQ29uc3QgPSByZXF1aXJlKFwiLi9Db25zdC5qc1wiKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoXCIuL1V0aWxzLmpzXCIpO1xudmFyIFN5c3RlbSA9IHJlcXVpcmUoXCIuL21hcC5TeXN0ZW0uanNcIik7XG52YXIgU3lzdGVtSXRlciA9IHJlcXVpcmUoXCIuL21hcC5TeXN0ZW1JdGVyLmpzXCIpO1xuXG52YXIgUCA9IGV4cG9ydHMuUCA9IHt9OyAvLyBwdWJsaWMgbWV0aG9kcyBmb3IgdGhpcyBjbGFzc1xuXHRcbmV4cG9ydHMuRCA9IHtcblx0Ly8gZGVmYXVsdCBwcm9wZXJ0aWVzIGZvciBuZXcgaW5zdGFuY2VzXG5cdHNyYzogbnVsbCxcblx0dGFibGVzOiB7fSxcblx0c3lzTmFtZU1hcDoge30sXG5cdHN5c05hbWVzOiBbXSxcblx0cm91dGVHcmFwaDoge30sXG5cdHNwYWNlOiBudWxsLFxuXHRsb2FkZWQ6IGZhbHNlLFxuXHRsb2FkaW5nUDogbnVsbCxcblx0Yzoge1xuXHRcdGp1bXBzOiBmYWxzZSxcblx0XHRwbGFuZXRzOiBmYWxzZSxcblx0XHRtb29uczogZmFsc2UsXG5cdFx0YmVsdHM6IGZhbHNlLFxuXHRcdGdhdGVzOiBmYWxzZSxcblx0XHRjZWxlc3RpYWxzOiBmYWxzZSxcblx0XHRzdGF0aXN0aWNzOiBmYWxzZSxcblx0XHRsYW5kbWFya3M6IGZhbHNlXG5cdH1cbn07XG5cbnZhciBzeXNfY2FjaGUgPSBudWxsOyAvLyBhIHBsYWNlIHRvIHB1dCBnZW5lcmF0ZWQgc3lzdGVtcyBzbyB3ZSBkb24ndCBrZWVwIHJlLWNyZWF0aW5nIHRoZW1cblx0XG5leHBvcnRzLkNyZWF0ZSA9IGZ1bmN0aW9uKHNyYywgdHlwZSwgY29uZmlnKSB7XG5cdGlmICghc3JjIHx8IHR5cGVvZiBzcmMuSGFzVGFibGUgIT0gXCJmdW5jdGlvblwiKSByZXR1cm4gbnVsbDtcblx0aWYgKHR5cGUgIT0gXCJKXCIgJiYgdHlwZSAhPSBcIktcIiAmJiB0eXBlICE9IFwiV1wiKSByZXR1cm4gbnVsbDtcblx0dmFyIG9iaiA9IFV0aWxzLmNyZWF0ZShQKTtcblx0ZXh0ZW5kKHRydWUsIG9iaiwgZXhwb3J0cy5EKTtcblx0aWYgKGNvbmZpZykgZXh0ZW5kKHRydWUsIG9iai5jLCBjb25maWcpO1xuXHRvYmouc3JjID0gc3JjO1xuXHRvYmouc3BhY2UgPSB0eXBlO1xuXHRcblx0cmV0dXJuIG9iajtcbn07XG5cbmZ1bmN0aW9uIExvYWREb25lKHRibCwgY3R4KSB7XG5cdHZhciBoYXMgPSAwLFxuXHRcdG5lZWRzID0gMCxcblx0XHRrZXlcblx0XHQ7XG5cblx0Zm9yIChrZXkgaW4gdGhpcy50YWJsZXMpIHtcblx0XHRpZiAoIXRoaXMudGFibGVzLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlO1xuXHRcdG5lZWRzICs9IHRoaXMudGFibGVzW2tleV0udGJsLnNlZ21lbnRzLmxlbmd0aDtcblx0XHRpZiAoa2V5ID09IHRibC5uYW1lKSB0aGlzLnRhYmxlc1trZXldLmRvbmUgPSB0cnVlO1xuXHRcdGlmICh0aGlzLnRhYmxlc1trZXldLmRvbmUpIHtcblx0XHRcdGhhcyArPSB0aGlzLnRhYmxlc1trZXldLnRibC5zZWdtZW50cy5sZW5ndGg7XG5cdFx0fVxuXHR9XG5cdFxuXHRpZiAoaGFzID49IG5lZWRzKSB7XG5cdFx0TG9hZEluaXQuYXBwbHkodGhpcyk7XG5cdFx0dGhpcy5sb2FkaW5nUC5yZXNvbHZlKHtjb250ZXh0OiBjdHgsIG1hcDogdGhpc30pO1xuXHR9XG59XG5mdW5jdGlvbiBMb2FkRmFpbCh0YmwsIGN0eCwgc3RhdHVzLCBlcnJvcikge1xuXHR0aGlzLmxvYWRpbmdQLnJlamVjdCh7Y29udGV4dDogY3R4LCBtYXA6IHRoaXMsIHN0YXR1czogc3RhdHVzLCBlcnJvcjogZXJyb3J9KTtcbn1cbmZ1bmN0aW9uIExvYWRQcm9ncmVzcyhhcmcsIHByb2dyZXNzKSB7XG5cdHZhciBoYXMgPSAwLFxuXHRcdG5lZWRzID0gMCxcblx0XHRrZXksXG5cdFx0aVxuXHRcdDtcblxuXHRpZiAocHJvZ3Jlc3MgPT09IG51bGwpIHJldHVybjtcblx0XG5cdC8vIGFyZzoge2NvbnRleHQ6IGN0eCwgdGFibGU6IHRoaXMsIGhhczogZG9uZS5oYXMsIG5lZWRzOiBkb25lLm5lZWRzfVxuXHQvLyBpZ25vcmluZyBpbnB1dCBwcm9ncmVzcyBpbmZvIGFuZCBjb3VudGluZyBmaW5pc2hlZCBzZWdtZW50cyBvdXJzZWxmXG5cdGZvciAoa2V5IGluIHRoaXMudGFibGVzKSB7XG5cdFx0aWYgKCF0aGlzLnRhYmxlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZTtcblx0XHRuZWVkcyArPSB0aGlzLnRhYmxlc1trZXldLnRibC5zZWdtZW50cy5sZW5ndGg7XG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMudGFibGVzW2tleV0udGJsLnNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodGhpcy50YWJsZXNba2V5XS50Ymwuc2VnbWVudHNbaV0ubG9hZGVkKSBoYXMrKztcblx0XHR9XG5cdH1cblx0XG5cdHByb2dyZXNzKHtjb250ZXh0OiBhcmcuY29udGV4dCwgbWFwOiB0aGlzLCBoYXM6IGhhcywgbmVlZHM6IG5lZWRzfSk7XG59XG5QLkxvYWQgPSBmdW5jdGlvbihvcHRzKSB7XG5cdHZhciBzZWxmID0gdGhpcyxcblx0XHR0ID0gdGhpcy50YWJsZXMsXG5cdFx0a2V5LFxuXHRcdHRoZW5Eb25lLFxuXHRcdHRoZW5GYWlsLFxuXHRcdHByb2dyZXNzRnVuYyA9IG51bGwsXG5cdFx0byA9IHtcblx0XHRcdGNvbnRleHQ6IG51bGwsXG5cdFx0XHRwcm9ncmVzczogbnVsbFxuXHRcdH1cdFx0XG5cdFx0O1xuXHRleHRlbmQobywgb3B0cyk7XG5cblx0aWYgKHRoaXMubG9hZGVkKSByZXR1cm4gVXRpbHMuZGVmZXJyZWQoKS5yZXNvbHZlKHtjb250ZXh0OiBvLmNvbnRleHQsIG1hcDogdGhpc30pLnByb21pc2U7XG5cdGlmICh0aGlzLmxvYWRpbmdQKSByZXR1cm4gdGhpcy5sb2FkaW5nUC5wcm9taXNlO1xuXHR0aGlzLmxvYWRpbmdQID0gVXRpbHMuZGVmZXJyZWQoKTtcblx0XG5cdC8vIHNldHVwIHJlcXVpcmVkIGFuZCBvcHRpb25hbCB0YWJsZXNcblx0dFtcIm1hcFwiICsgdGhpcy5zcGFjZSArIFwiUmVnaW9uc1wiXSA9IGZhbHNlO1xuXHR0W1wibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJDb25zdGVsbGF0aW9uc1wiXSA9IGZhbHNlO1xuXHR0W1wibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJTb2xhclN5c3RlbXNcIl0gPSBmYWxzZTtcblx0aWYgKHRoaXMuc3BhY2UgPT0gXCJLXCIgfHwgdGhpcy5zcGFjZSA9PSBcIkpcIikge1xuXHRcdHRbXCJtYXBcIiArIHRoaXMuc3BhY2UgKyBcIlNvbGFyU3lzdGVtSnVtcHNcIl0gPSBmYWxzZTtcblx0XHRpZiAodGhpcy5jLmp1bXBzKSB7XG5cdFx0XHR0Lm1hcFJlZ2lvbkp1bXBzID0gZmFsc2U7XG5cdFx0XHR0Lm1hcENvbnN0ZWxsYXRpb25KdW1wcyA9IGZhbHNlO1xuXHRcdFx0dC5tYXBKdW1wcyA9IGZhbHNlO1xuXHRcdH1cblx0XHRpZiAodGhpcy5jLmJlbHRzKSB0W1wibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJCZWx0c1wiXSA9IGZhbHNlO1xuXHRcdGlmICh0aGlzLmMuZ2F0ZXMpIHRbXCJtYXBcIiArIHRoaXMuc3BhY2UgKyBcIkdhdGVzXCJdID0gZmFsc2U7XHRcdFxuXHRcdGlmICh0aGlzLmMubGFuZG1hcmtzKSB0Lm1hcExhbmRtYXJrcyA9IGZhbHNlO1xuXHR9XG5cdGlmICh0aGlzLmMucGxhbmV0cykgdFtcIm1hcFwiICsgdGhpcy5zcGFjZSArIFwiUGxhbmV0c1wiXSA9IGZhbHNlO1xuXHRpZiAodGhpcy5jLm1vb25zKSB0W1wibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJNb29uc1wiXSA9IGZhbHNlO1xuXHRpZiAodGhpcy5jLmNlbGVzdGlhbHMpIHRbXCJtYXBcIiArIHRoaXMuc3BhY2UgKyBcIkNlbGVzdGlhbHNcIl0gPSBmYWxzZTtcblx0aWYgKHRoaXMuYy5zdGF0aXN0aWNzKSB0W1wibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJDZWxlc3RpYWxTdGF0aXN0aWNzXCJdID0gZmFsc2U7XG5cblx0dGhlbkRvbmUgPSBmdW5jdGlvbiAoYXJnKSB7IExvYWREb25lLmFwcGx5KHNlbGYsIFthcmcudGFibGUsIGFyZy5jb250ZXh0XSkgfTtcblx0dGhlbkZhaWwgPSBmdW5jdGlvbiAoYXJnKSB7IExvYWRGYWlsLmFwcGx5KHNlbGYsIFthcmcudGFibGUsIGFyZy5jb250ZXh0LCBhcmcuc3RhdHVzLCBhcmcuZXJyb3JdKSB9O1xuXHRpZiAoby5wcm9ncmVzcyAhPT0gbnVsbCkge1xuXHRcdHByb2dyZXNzRnVuYyA9IGZ1bmN0aW9uIChhcmcpIHsgTG9hZFByb2dyZXNzLmFwcGx5KHNlbGYsIFthcmcsIG8ucHJvZ3Jlc3NdKSB9O1xuXHR9XG5cdGZvciAoa2V5IGluIHQpIHtcblx0XHRpZiAoIXQuaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWU7XG5cdFx0dFtrZXldID0ge3RibDogdGhpcy5zcmMuR2V0VGFibGUoa2V5KSwgZG9uZTogZmFsc2UgfTtcblx0XHRpZiAoIXRba2V5XS50YmwpIHJldHVybiB0aGlzLmxvYWRpbmdQLnJlamVjdCh7Y29udGV4dDogby5jb250ZXh0LCBtYXA6IHNlbGYsIHN0YXR1czogXCJlcnJvclwiLCBlcnJvcjogXCJzb3VyY2UgZG9lcyBub3QgY29udGFpbiByZXF1ZXN0ZWQgdGFibGU6IFwiICsga2V5fSkucHJvbWlzZTtcblx0XHR0W2tleV0udGJsLkxvYWQoe2NvbnRleHQ6IG8uY29udGV4dCwgcHJvZ3Jlc3M6IHByb2dyZXNzRnVuY30pLnRoZW4odGhlbkRvbmUsIHRoZW5GYWlsKTtcblx0fVx0XG5cdFxuXHRyZXR1cm4gdGhpcy5sb2FkaW5nUC5wcm9taXNlO1xufTtcblxuZnVuY3Rpb24gTG9hZEluaXQoKSB7XG5cdHZhciBzeXN0YmwgPSB0aGlzLnRhYmxlc1tcIm1hcFwiICsgdGhpcy5zcGFjZSArIFwiU29sYXJTeXN0ZW1zXCJdLnRibCxcblx0XHRjb2xtYXAgPSBzeXN0YmwuY29sbWFwLFxuXHRcdHNvbGFyU3lzdGVtSUQsXG5cdFx0dG9Tb2xhclN5c3RlbUlELFxuXHRcdHN5c3RlbSxcblx0XHRqdW1wdGJsbm0sXG5cdFx0anVtcHRibCxcblx0XHRzeXNcblx0XHQ7XG5cdFxuXHRzeXNfY2FjaGUgPSB7fTtcblx0Zm9yIChzb2xhclN5c3RlbUlEIGluIHN5c3RibC5kYXRhKSB7XG5cdFx0aWYgKCFzeXN0YmwuZGF0YS5oYXNPd25Qcm9wZXJ0eShzb2xhclN5c3RlbUlEKSkgY29udGludWU7XG5cdFx0c3lzdGVtID0gc3lzdGJsLmRhdGFbc29sYXJTeXN0ZW1JRF07XG5cdFx0dGhpcy5zeXNOYW1lTWFwW3N5c3RlbVtjb2xtYXAuc29sYXJTeXN0ZW1OYW1lXV0gPSBwYXJzZUludChzb2xhclN5c3RlbUlELCAxMCk7XG5cdFx0dGhpcy5zeXNOYW1lcy5wdXNoKHN5c3RlbVtjb2xtYXAuc29sYXJTeXN0ZW1OYW1lXSk7XG5cdFx0anVtcHRibG5tID0gZmFsc2U7XG5cdFx0aWYgKHRoaXMuc3BhY2UgIT0gXCJXXCIpIGp1bXB0YmxubSA9IFwibWFwXCIgKyB0aGlzLnNwYWNlICsgXCJTb2xhclN5c3RlbUp1bXBzXCI7XG5cdFx0aWYgKGp1bXB0YmxubSAmJiB0aGlzLnRhYmxlcy5oYXNPd25Qcm9wZXJ0eShqdW1wdGJsbm0pKSB7XG5cdFx0XHQvLyBjcmVhdGUgdGhlIHJvdXRpbmcgZ3JhcGggdXNlZCBmb3IgcGF0aCBmaW5kaW5nXG5cdFx0XHRzeXMgPSB7XG5cdFx0XHRcdGp1bXBzOiBbXSxcblx0XHRcdFx0Y29udDogc3lzdGVtW2NvbG1hcC5jb250aWd1b3VzXSxcblx0XHRcdFx0c2VjOiBzeXN0ZW1bY29sbWFwLnNlY3VyaXR5XS50b0ZpeGVkKDEpLFxuXHRcdFx0XHRuYW1lOiBzeXN0ZW1bY29sbWFwLnNvbGFyU3lzdGVtTmFtZV1cblx0XHRcdH07XG5cdFx0XHRqdW1wdGJsID0gdGhpcy50YWJsZXNbanVtcHRibG5tXS50YmwuZGF0YVtzb2xhclN5c3RlbUlEXTtcblx0XHRcdGZvciAodG9Tb2xhclN5c3RlbUlEIGluIGp1bXB0YmwpIHtcblx0XHRcdFx0aWYgKCFqdW1wdGJsLmhhc093blByb3BlcnR5KHRvU29sYXJTeXN0ZW1JRCkpIGNvbnRpbnVlO1xuXHRcdFx0XHRzeXMuanVtcHMucHVzaCh0b1NvbGFyU3lzdGVtSUQpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5yb3V0ZUdyYXBoW3NvbGFyU3lzdGVtSURdID0gc3lzO1xuXHRcdH1cblx0fVxuXHR0aGlzLnN5c05hbWVzLnNvcnQoKTtcbn1cblxuUC5HZXRTeXN0ZW0gPSBmdW5jdGlvbiAoaW5wdXQpIHtcblx0dmFyIG5TeXN0ZW1JRCxcblx0XHRzU3lzdGVtSURcblx0XHQ7XG5cdFx0XG5cdGlmICghaW5wdXQpIHJldHVybiBudWxsO1xuXHRpZiAoaW5wdXQuaGFzT3duUHJvcGVydHkoXCJuYW1lXCIpICYmIHRoaXMuc3lzTmFtZU1hcC5oYXNPd25Qcm9wZXJ0eShpbnB1dC5uYW1lKSkgblN5c3RlbUlEID0gdGhpcy5zeXNOYW1lTWFwW2lucHV0Lm5hbWVdO1xuXHRlbHNlIGlmIChpbnB1dC5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSBuU3lzdGVtSUQgPSBwYXJzZUludChpbnB1dC5pZCwgMTApO1xuXHRlbHNlIHJldHVybiBudWxsO1xuXHRzU3lzdGVtSUQgPSBuU3lzdGVtSUQudG9TdHJpbmcoMTApO1xuXHRcblx0aWYgKCFzeXNfY2FjaGUuaGFzT3duUHJvcGVydHkoc1N5c3RlbUlEKSkge1xuXHRcdHN5c19jYWNoZVtzU3lzdGVtSURdID0gU3lzdGVtLkNyZWF0ZSh0aGlzLnRhYmxlc1tcIm1hcFwiICsgdGhpcy5zcGFjZSArIFwiU29sYXJTeXN0ZW1zXCJdLnRibCwgblN5c3RlbUlEKTtcblx0fVxuXHRyZXR1cm4gc3lzX2NhY2hlW3NTeXN0ZW1JRF07XG59O1xuXG5QLkdldFN5c3RlbXMgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiBTeXN0ZW1JdGVyLkNyZWF0ZSh0aGlzKTtcblx0Ly8gdGhpcy50YWJsZXNbXCJtYXBcIiArIHRoaXMuc3BhY2UgKyBcIlNvbGFyU3lzdGVtc1wiXS50YmwpO1xufTtcdFxuXG5QLkp1bXBEaXN0ID0gZnVuY3Rpb24gKGZyb21JRCwgdG9JRCkge1xuXHR2YXIgc3lzdGJsID0gdGhpcy50YWJsZXNbXCJtYXBcIiArIHRoaXMuc3BhY2UgKyBcIlNvbGFyU3lzdGVtc1wiXS50YmwsXG5cdFx0Y29sbWFwID0gc3lzdGJsLmNvbG1hcCxcblx0XHR4MSA9IHN5c3RibC5kYXRhW2Zyb21JRF1bY29sbWFwLnhdLFxuXHRcdHgyID0gc3lzdGJsLmRhdGFbdG9JRF1bY29sbWFwLnhdLFx0XHRcdFxuXHRcdHkxID0gc3lzdGJsLmRhdGFbZnJvbUlEXVtjb2xtYXAueV0sXG5cdFx0eTIgPSBzeXN0YmwuZGF0YVt0b0lEXVtjb2xtYXAueV0sXG5cdFx0ejEgPSBzeXN0YmwuZGF0YVtmcm9tSURdW2NvbG1hcC56XSxcblx0XHR6MiA9IHN5c3RibC5kYXRhW3RvSURdW2NvbG1hcC56XSxcblx0XHRkaXN0XG5cdFx0O1xuXHRcdFx0XG5cdGRpc3QgPSBNYXRoLnNxcnQoTWF0aC5wb3coeDEgLSB4MiwgMikgKyBNYXRoLnBvdyh5MSAtIHkyLCAyKSArIE1hdGgucG93KHoxIC0gejIsIDIpKTtcblx0cmV0dXJuIGRpc3QvQ29uc3QuTV9wZXJfTFk7XG59O1xuXG5QLlJvdXRlID0gZnVuY3Rpb24gKGZyb21TeXN0ZW1JRCwgdG9TeXN0ZW1JRCwgYXZvaWRMaXN0LCBhdm9pZExvdywgYXZvaWRIaSkge1xuXHR2YXIgcm91dGUgPSBbXSxcblx0XHRhdm9pZHMgPSB7fSxcblx0XHRzRnJvbUlELFxuXHRcdHNUb0lELFxuXHRcdHNvbGFyU3lzdGVtSUQsXG5cdFx0Y3VycmVudElELFxuXHRcdHN5c3RlbUlELFxuXHRcdG5JRCxcblx0XHRwcmV2SUQsXG5cdFx0c3lzX3RkLFxuXHRcdHRkLFxuXHRcdGksXG5cdFx0dG1wLFxuXHRcdHRlc3RzZXQgPSBbXSxcblx0XHR0ZXN0X3RkLFxuXHRcdHRlc3RpZHgsXG5cdFx0ZGlzdFxuXHRcdDtcblx0XHRcblx0c0Zyb21JRCA9IHBhcnNlSW50KGZyb21TeXN0ZW1JRCwgMTApLnRvU3RyaW5nKDEwKTtcblx0c1RvSUQgPSBwYXJzZUludCh0b1N5c3RlbUlELCAxMCkudG9TdHJpbmcoMTApO1xuXHRpZiAoIXRoaXMucm91dGVHcmFwaC5oYXNPd25Qcm9wZXJ0eShzRnJvbUlEKSB8fCAhdGhpcy5yb3V0ZUdyYXBoLmhhc093blByb3BlcnR5KHNUb0lEKSkgcmV0dXJuIHJvdXRlO1xuXG5cdC8vIHJlc2V0IHRoZSByb3V0ZSBncmFwaFxuXHRmb3IgKHNvbGFyU3lzdGVtSUQgaW4gdGhpcy5yb3V0ZUdyYXBoKSB7XG5cdFx0aWYgKCF0aGlzLnJvdXRlR3JhcGguaGFzT3duUHJvcGVydHkoc29sYXJTeXN0ZW1JRCkpIGNvbnRpbnVlO1xuXHRcdHRoaXMucm91dGVHcmFwaFtzb2xhclN5c3RlbUlEXS50ZCA9IC0xO1xuXHRcdHRoaXMucm91dGVHcmFwaFtzb2xhclN5c3RlbUlEXS5wcmV2SUQgPSAtMTtcblx0XHR0aGlzLnJvdXRlR3JhcGhbc29sYXJTeXN0ZW1JRF0udmlzaXRlZCA9IGZhbHNlO1xuXHR9XG5cdFxuXHQvLyBwb3B1bGF0ZSBhdm9pZCBsaXN0IGxvb2t1cCB0YWJsZVxuXHRpZiAoYXZvaWRMaXN0ICYmIGF2b2lkTGlzdC5sZW5ndGggPiAwKSB7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGF2b2lkTGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdFx0YXZvaWRzW2F2b2lkTGlzdFtpXV0gPSB0cnVlO1xuXHRcdH1cblx0fVxuXHRcblx0aWYgKHNGcm9tSUQgPT09IHNUb0lEKSByZXR1cm4gcm91dGU7XG5cdFxuXHQvLyBzd2FwIGZyb20vdG8gdG8gbWF0Y2ggRVZFIGNsaWVudD9cblx0dG1wID0gc0Zyb21JRDsgc0Zyb21JRCA9IHNUb0lEOyBzVG9JRCA9IHRtcDtcblx0XG5cdC8vIERpamtzdHJhJ3MgdG8gZmluZCBiZXN0IHJvdXRlIGdpdmVuIG9wdGlvbnMgcHJvdmlkZWRcblx0Y3VycmVudElEID0gc0Zyb21JRDtcblx0dGhpcy5yb3V0ZUdyYXBoW3NGcm9tSURdLnRkID0gMDtcdFxuXHR3aGlsZSAoIXRoaXMucm91dGVHcmFwaFtzVG9JRF0udmlzaXRlZCkge1xuXHRcdGlmIChjdXJyZW50SUQgIT0gc0Zyb21JRCkge1xuXHRcdFx0Ly8gZmluZCBuZXh0IG5vZGUgdG8gdHJ5XG5cdFx0XHR0ZXN0X3RkID0gLTE7XG5cdFx0XHR0ZXN0aWR4ID0gLTE7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGVzdHNldC5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRzeXN0ZW1JRCA9IHRlc3RzZXRbaV07XG5cdFx0XHRcdGlmICh0aGlzLnJvdXRlR3JhcGhbc3lzdGVtSURdLnZpc2l0ZWQpIGNvbnRpbnVlO1xuXHRcdFx0XHRpZiAoYXZvaWRzW3N5c3RlbUlEXSkgY29udGludWU7XG5cdFx0XHRcdHN5c190ZCA9IHRoaXMucm91dGVHcmFwaFtzeXN0ZW1JRF0udGQ7XG5cdFx0XHRcdGlmIChzeXNfdGQgPiAwICYmICh0ZXN0X3RkID09IC0xIHx8IHN5c190ZCA8IHRlc3RfdGQpKSB7XG5cdFx0XHRcdFx0Y3VycmVudElEID0gc3lzdGVtSUQ7XG5cdFx0XHRcdFx0dGVzdF90ZCA9IHN5c190ZDtcblx0XHRcdFx0XHR0ZXN0aWR4ID0gaTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRlc3RfdGQgPT0gLTEpIHJldHVybiByb3V0ZTsgLy8gbm8gY29ubmVjdGlvblxuXHRcdFx0dGVzdHNldC5zcGxpY2UodGVzdGlkeCwgMSk7IC8vIHJlbW92ZSB0aGUgbm9kZSB3ZSBqdXN0IHBpY2tlZCBmcm9tIHRoZSB0ZXN0c2V0XG5cdFx0fVxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLnJvdXRlR3JhcGhbY3VycmVudElEXS5qdW1wcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bklEID0gdGhpcy5yb3V0ZUdyYXBoW2N1cnJlbnRJRF0uanVtcHNbaV07XG5cdFx0XHRkaXN0ID0gMTtcblx0XHRcdC8vaWYgKGF2b2lkTG93ICYmIHRoaXMucm91dGVHcmFwaFtuSURdLnNlYyA8IDAuNSAmJiB0aGlzLnJvdXRlR3JhcGhbY3VycmVudElEXS5zZWMgPj0gMC41KSBkaXN0ID0gMTAwMDtcblx0XHRcdGlmIChhdm9pZExvdyAmJiB0aGlzLnJvdXRlR3JhcGhbbklEXS5zZWMgPCAwLjUpIGRpc3QgPSAxMDAwO1xuXHRcdFx0Ly9pZiAoYXZvaWRIaSAmJiB0aGlzLnJvdXRlR3JhcGhbbklEXS5zZWMgPj0gMC41ICYmIHRoaXMucm91dGVHcmFwaFtjdXJyZW50SURdLnNlYyA8IDAuNSkgZGlzdCA9IDEwMDA7XG5cdFx0XHRpZiAoYXZvaWRIaSAmJiB0aGlzLnJvdXRlR3JhcGhbbklEXS5zZWMgPj0gMC41KSBkaXN0ID0gMTAwMDtcblx0XHRcdHRkID0gdGhpcy5yb3V0ZUdyYXBoW2N1cnJlbnRJRF0udGQgKyBkaXN0O1xuXHRcdFx0aWYgKHRoaXMucm91dGVHcmFwaFtuSURdLnRkIDwgMCB8fCB0aGlzLnJvdXRlR3JhcGhbbklEXS50ZCA+IHRkKSB7XG5cdFx0XHRcdHRoaXMucm91dGVHcmFwaFtuSURdLnRkID0gdGQ7XG5cdFx0XHRcdHRoaXMucm91dGVHcmFwaFtuSURdLnByZXZJRCA9IGN1cnJlbnRJRDtcblx0XHRcdFx0dGVzdHNldC5wdXNoKG5JRCk7XG5cdFx0XHR9XHRcblx0XHR9XG5cdFx0dGhpcy5yb3V0ZUdyYXBoW2N1cnJlbnRJRF0udmlzaXRlZCA9IHRydWU7XG5cdFx0Y3VycmVudElEID0gMDtcblx0fVxuXHRcblx0Ly8gZ2V0IHRoZSBhY3R1YWwgcm91dGUgZm91bmRcblx0cHJldklEID0gdGhpcy5yb3V0ZUdyYXBoW3NUb0lEXS5wcmV2SUQ7XG5cdHdoaWxlIChwcmV2SUQgIT0gc0Zyb21JRCkge1xuXHRcdHJvdXRlLnB1c2gocGFyc2VJbnQocHJldklELCAxMCkpO1xuXHRcdHByZXZJRCA9IHRoaXMucm91dGVHcmFwaFtwcmV2SURdLnByZXZJRDtcblx0fVxuXHRyb3V0ZS5wdXNoKHBhcnNlSW50KHNGcm9tSUQsIDEwKSk7XG5cdC8vIHJvdXRlLnJldmVyc2UoKTtcblx0Ly8gcm91dGUudW5zaGlmdCh0b1N5c3RlbUlEKTtcblx0cmV0dXJuIHJvdXRlO1xufTtcdFxuIl19
(5)
});
