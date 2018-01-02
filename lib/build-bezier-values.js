const middle = function(p1,p2){
	return [
			(p1[0]+p2[0])/2,
			(p1[1]+p2[1])/2
	];
}
const middleBez = function(p1,p2){
	return [p1,middle(p1,p2),p2];
}
/**
* @param {object} opts
* @param {Array.<number>} opts.y
* @param {number} opts.size - output size
* @param {number} opts.xStep - x thick, x step ....
* @returns {Array<Array.<number>>} points
*/
module.exports = function(opts){
	const values = [];
	const labels = [];

	const size = opts.size;
	const y = opts.y;
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
			const endVideo = duration;
			points = [
				middlePoints[middlePoints.length-1],
				[lastX,lastY],
				[endVideo,lastY]
			]
		} else if(index === 0){
			if(t<middlePoints[index][0]){
				points = middleBez([0, y[0]],middlePoints[index]);
			} else {
				points = [
					middlePoints[index],
					[(index+1)*duration/n, y[index+1]],
					middlePoints[index+1]
				];
			}
		} else if(index >= 0){
			if(t<middlePoints[index][0]){
				points = [
					middlePoints[index - 1],
					[index*duration/n, y[index]],
					middlePoints[index]
				];
			} else {
				points = [
					middlePoints[index],
					[(index+1)*duration/n, y[index+1]],
					middlePoints[index + 1]
				];
			}
		} else {
			//console.log(middlePoints[middlePoints.length-1][0], t)
			throw(new Error("index error : " +  index));
		}

		var b = Math.abs(t/duration*n-(index+1))*2;
		var a = Math.abs(t/duration*n-index)*2;
		let v2;
		if(y[index+1]){
			v2 = (b*y[index]+a*y[index+1])/(a+b);
		} else {
			v2 = y[index];
		}

		if(t > points[points.length-1][0]){
			throw(new Error("t should not be in the range"));
		}
		const v = bezier((t-points[0][0])/(points[2][0]-points[0][0]), points)[1];
		if(v < 0){
			//console.log(v, t, points);
			throw(new Error("should not be negative"));
		}
		if(isNaN(v) || isNaN(v2)){
			throw(new Error("NaN value "+v+" "+v2));
		}
		values.push(v);
		values2.push(v2);
		labels.push(t);
	}

}
