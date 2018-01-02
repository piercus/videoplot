/**
*
*  @param {number} wScale -  if 2 the video zoom by x2 on the graph
*  @param {number} frames - total number of frames in the output video = number of charts
*  @param {number} n - the index of chart, must be inferior than frames
*  @param {Array<Array.<number>>} values - list of y-values of the chart
*  @param {Array<dataset>} datasets - chart js dataset (without datas), should be same length than values
*  @param {Array.<string|number>} labels - x-values labels of the chart
*/
module.exports = function(opts){
	const frames = opts.frames;
	const n = opts.n;
	const values = opts.values;
	const labels = opts.labels;
	const wScale = opts.wScale;
	const datasets = opts.datasets;
	
	const windowSize = Math.floor(frames/wScale);
	const start = Math.min(Math.max(0, n-windowSize/2),frames-windowSize);
	const end = start+windowSize;
	const range = [start, end];
	const data = {
		datasets : []
	}
	
	if(values.length !== datasets.length){
		throw(new Error("values and datasets should be same length"))
	}
	if(!labels){
		throw(new Error("labels are mandatory"))
	}
	for(var i = 0; i < values.length; i++){
		data.datasets.push(Object.assign({},datasets[i],{
			data : values[i].filter((a,j) => j <= end && j >= start && j <= n),
		}));
	}

	data.labels = labels.filter((a,i) => {
		return i <= end && i >= start
	});
	
	const opts2 = Object.assign({},opts,{
		data :data
	})

	return opts2;
}
