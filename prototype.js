'use strict';

/* 
* Useful native object prototypes and polyfill.
*/
var Prototype = class {
	/*
	* Set up all prototypes and polyfill
	*/
	static setUp(Array, Object, String) {
		if (Array.prototype.unique === undefined) {
			Array.prototype.unique = function () {
				return this.filter(function (value, index, self) {
					return self.indexOf(value) === index;
				});
			};
		}

		if (Array.prototype.toObject === undefined) {
			Array.prototype.toObject = function (keyFunc, valFunc) {
				if (keyFunc === undefined) {
					keyFunc = (val, idx) => idx;
				}
				if (valFunc === undefined) {
					valFunc = (val, idx) => val;
				}
				var obj = {};
				var arr = this;
				for (var idx = 0; idx < arr.length; idx++) {
					var item = arr[idx];
					obj[keyFunc(item, idx)] = valFunc(item, idx);
				}
				return obj;
			};
		}

		if (Array.prototype.extend === undefined) {
			Array.prototype.extend = function () {
				var otherArrays = arguments;

				for (var i = 0; i < otherArrays.length; i++) {
					Array.prototype.push.apply(this, otherArrays[i]);
				}
				return this;
			};
		}

		if (Object.toArray === undefined) {
			Object.toArray = function (obj, valFunc) {
				var keys = Object.keys(obj);
				var arr = [];
				for (var i = 0; i < keys.length; i++) {
					var key = keys[i];
					var val = obj[key];
					arr.push(valFunc(key, val));
				}
				return arr;
			};
		}

		if (Object.values === undefined) {
			Object.values = function (obj) {
				return Object.toArray(obj, function (key, val) {
					return val;
				});
			};
		}

		if (Object.deepClone === undefined) {
			Object.deepClone = function (obj) {
				if (obj == null || typeof obj != "object") {
					return obj;
				}

				if (obj instanceof Date) {
					let copy = new Date();
					copy.setTime(obj.getTime());
					return copy;
				} else if (obj instanceof Array) {
					let copy = obj.constructor();
					for (let key in obj) {
						copy[key] = Object.deepClone(obj[key]);
					}
					return copy;
				} else if (obj instanceof Object) {
					let copy = obj.constructor();
					for (let key in obj) {
						if (Object.prototype.hasOwnProperty.call(obj, key)) {
							copy[key] = Object.deepClone(obj[key]);
						}
					}
					return copy;
				}

				return obj;
			};
		}

		if (Array.create === undefined) {
			Array.create = function (size, value) {
				return Array.apply(null, Array(size)).map(function () {
					return value;
				});
			};
		}

		if (String.compare === undefined) {
			String.compare = function (str1, str2) {
				if (str1 == str2) {
					return 0;
				} else if (str1 > str2) {
					return 1;
				} else {
					return -1;
				}
			};
		}
	}
};
