const bezier = require('bezier-curve');
const middle = require('./middle-point');

const middleBez = function (p1, p2) {
	return [p1, middle(p1, p2), p2];
};
/**
* @param {object} opts
* @param {Array.<number>} opts.data
* @param {number} opts.size - output size
* @returns {Array<Array.<number>>} bezPoints
*/
module.exports = function (opts) {
	const points = [];

	const size = opts.size;
	const y = opts.data;
	const n = y.length;

	const middlebezPoints = [];

	for (let i = 0; i < n - 1; i++) {
		const p1 = [i * size / n, y[i]];
		const p2 = [(i + 1) * size / n, y[i + 1]];
		middlebezPoints.push(middle(p1, p2));
	}

	for (let t = 0; t < size; t++) {
		const yIndex = Math.floor(t / size * n);

		let bezPoints;
		if (t >= middlebezPoints[middlebezPoints.length - 1][0]) {
			const lastIndex = y.length - 1;
			const lastY = y[lastIndex];
			const lastX = lastY * size / n;
			const endVideo = size;
			bezPoints = [
				middlebezPoints[middlebezPoints.length - 1],
				[lastX, lastY],
				[endVideo, lastY]
			];
		} else if (yIndex === 0) {
			if (t < middlebezPoints[yIndex][0]) {
				bezPoints = middleBez([0, y[0]], middlebezPoints[yIndex]);
			} else {
				bezPoints = [
					middlebezPoints[yIndex],
					[(yIndex + 1) * size / n, y[yIndex + 1]],
					middlebezPoints[yIndex + 1]
				];
			}
		} else if (yIndex >= 0) {
			if (t < middlebezPoints[yIndex][0]) {
				bezPoints = [
					middlebezPoints[yIndex - 1],
					[yIndex * size / n, y[yIndex]],
					middlebezPoints[yIndex]
				];
			} else {
				bezPoints = [
					middlebezPoints[yIndex],
					[(yIndex + 1) * size / n, y[yIndex + 1]],
					middlebezPoints[yIndex + 1]
				];
			}
		} else {
			// Console.log(middlebezPoints[middlebezPoints.length-1][0], t)
			throw (new Error('index error : ' + yIndex));
		}

		if (t > bezPoints[bezPoints.length - 1][0]) {
			throw (new Error('t should not be in the range'));
		}
		const v = bezier((t - bezPoints[0][0]) / (bezPoints[2][0] - bezPoints[0][0]), bezPoints)[1];
		if (v < 0) {
			// Console.log(v, t, bezPoints);
			throw (new Error('should not be negative'));
		}
		if (isNaN(v)) {
			throw (new TypeError('NaN value ' + v));
		}
		points.push([t, v]);
	}

	return points;
};
