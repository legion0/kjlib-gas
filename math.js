'use strict';

let Math_ = Math;

var Math = class {  // jshint ignore:line
  /**
 * Returns the new Exponential Moving Average value.
 *
 * @param {number} sample the new sample to add to the ema
 * @param {number} ema the current value of the ema
 * @param {number} window number of sample to consider for the ema,
 * this is a shorthand for alpha = 2 / (window + 1)
 * @param {number} alpha alpha value to use for the ema calculation,
 * if not undefined takes presedense over window value.
 * @return {number} the result of the exponential calculation
 */
	static calcNewEma(sample, ema, window, alpha) {
		if (alpha === undefined) {
			alpha = 2 / (window + 1);
		}
		return alpha * sample + (1 - alpha) * ema;
	}
};
