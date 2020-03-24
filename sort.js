'use strict';

var Sort = class {
	static compareLess(a, b) {
		return a - b;
	}

	static compareGreater(a, b) {
		return b - a;
	}

	static orderByKeyFunc(keyFunc, compareFunc) {
		if (compareFunc === undefined) {
			compareFunc = Sort.compareLess;
		}
		return function (a, b) {
			return compareFunc(keyFunc(a), keyFunc(b));
		};
	}

	static propGetter(propName) {
		return function (obj) {
			return obj[propName];
		};
	}

	static orderByProperty(propName, compareFunc) {
		return Sort.orderByKeyFunc(Sort.propGetter(propName), compareFunc);
	}

	static chainComparators() {
		let comparators = arguments;
		return function (a, b) {
			for (let i = 0; i < comparators.length; i++) {
				let val = comparators[i](a, b);
				if (val != 0) {
					return val;
				}
			}
			return 0;
		};
	}
};