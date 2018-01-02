const middle = require('./middle-point');
var bezier = require('bezier-curve');

const middleBez = function(p1,p2){
	return [p1,middle(p1,p2),p2];
}
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

	const middlePoints = [];

	for(var i = 0; i< n-1; i++){
		const p1 = [i*size/n,y[i]]
		const p2 = [(i+1)*size/n,y[i+1]]
		middlePoints.push(middle(p1,p2))
	}

	for (var t = 0; t < size; t ++) {
		const yIndex = Math.floor(t/size*n);

		let points;
		if(t >= middlePoints[middlePoints.length-1][0]){
			const lastIndex = y.length-1;
			const lastY = y[lastIndex];
			const lastX = lastY*size/n;
			const endVideo = size;
			points = [
				middlePoints[middlePoints.length-1],
				[lastX,lastY],
				[endVideo,lastY]
			]
		} else if(yIndex === 0){
			if(t<middlePoints[yIndex][0]){
				points = middleBez([0, y[0]],middlePoints[yIndex]);
			} else {
				points = [
					middlePoints[yIndex],
					[(yIndex+1)*size/n, y[yIndex+1]],
					middlePoints[yIndex+1]
				];
			}
		} else if(yIndex >= 0){
			if(t<middlePoints[yIndex][0]){
				points = [
					middlePoints[yIndex - 1],
					[yIndex*size/n, y[yIndex]],
					middlePoints[yIndex]
				];
			} else {
				points = [
					middlePoints[yIndex],
					[(yIndex+1)*size/n, y[yIndex+1]],
					middlePoints[yIndex + 1]
				];
			}
		} else {
			//console.log(middlePoints[middlePoints.length-1][0], t)
			throw(new Error("index error : " +  yIndex));
		}

		if(t > points[points.length-1][0]){
			throw(new Error("t should not be in the range"));
		}
		const v = bezier((t-points[0][0])/(points[2][0]-points[0][0]), points)[1];
		if(v < 0){
			//console.log(v, t, points);
			throw(new Error("should not be negative"));
		}
		if(isNaN(v)){
			throw(new Error("NaN value "+v));
		}
		values.push(v);
	}
	
	return values;

}
