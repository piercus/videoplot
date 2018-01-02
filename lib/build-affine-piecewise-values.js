const middle = require('./middle-point');

/**
* @param {object} opts
* @param {Array.<number>} opts.data
* @param {number} opts.size - output size
* @returns {Array<Array.<number>>} points
*/
module.exports = function(opts){
	const values = [];

	const size = opts.size;
	const y = opts.data;
	const n = y.length;
	
	// js floating number errors
	const tolerance = 0.0001;
	
	for (var t = 0; t < size; t ++) {
		const yIndexFloat = t/size*n;
		const yIndex = Math.floor(yIndexFloat);
		if(yIndex < n-1){
			const a = yIndexFloat - yIndex
			const b = 1 - a;
			
			values.push(y[yIndex]*b + y[yIndex + 1]*a);
		} else {
			values.push(y[yIndex]);
		}
	}
	return values;
}
