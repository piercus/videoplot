/**
*
*  @param {number} wScale -  if 2 the video zoom by x2 on the graph
*  @param {number} frames - total number of frames in the output video = number of charts
*  @param {number} n - the index of chart, must be inferior than frames
*  @param {boolean} debug - set debug to true to display non-bezier curve
*  @param {Array.<number>} values - y-values of the chart
*  @param {Array.<string|number>} labels - x-values labels of the chart
*/
module.exports = function(opts){
	const frames = opts.frames;
	const n = opts.n;
	const debug = opts.debug;
	const values = opts.values;
	const labels = opts.labels;

	const windowSize = Math.floor(frames/wScale);
	const start = Math.min(Math.max(0, n-windowSize/2),frames-windowSize);
	const end = start+windowSize;
	const range = [start, end];

	const data = {
		datasets : [Object.assign({},opts.data.datasets[0],{
			data : values.filter((a,i) => i <= end && i >= start && i <= n),
		})]
	}
	if(debug && opts.data.datasets){
		data.datasets.push(Object.assign({},opts.data.datasets[1],{
			data : values2.filter((a,i) => i <= end && i >= start && i <= n),
		}));
	}
	if(labels){
		data.labels = labels.slice().filter((a,i) => {
			return i <= end && i >= start
		});//.slice(0,Math.floor(n/frames*numberOfData));
	}
	const opts2 = Object.assign({},opts,{
		data :data
	})
	//console.log(opts2.options.scales)
	return opts2;
}
