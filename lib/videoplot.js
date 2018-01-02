const ChartJs = require('chartjs-node');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');

const bezier = require('bezier-curve');

const middle = require('./middle-point');
const buildBezierValues = require('./build-bezier-values');
const buildAffinePiecewiseValues = require('./build-affine-piecewise-values')
const getOpts = require('./get-chartjs-opts')

class Videoplot {
	constructor({w, h}){
		this.w = w;
		this.h = h;
	}
	
	/**
	* @param {number} duration
	* @param {number} fps- fps of final video = number of points in the graph drawing
	* @param {boolean|Array<boolean>} [smoothing=true] if true, bezier smoothing done, else, no smoothing is done
	* @param {Array.<Array<number>>} data - values to draw chart
	* @param {number} wScale - values to draw chart
	* @returns {Promise}
	*/
	
	drawVideoChart(opts){
		const duration = opts.duration;
		const fps = opts.fps;
		const data = opts.data.datasets.map(ds => ds.data);
		console.log(data, opts);
		const frames = duration*fps;
		let smoothing;
		if(typeof(opts.smoothing) === 'boolean'){
			smoothing = data.map( d => opts.smoothing)
		} else if(Array.isArray(opts.smoothing)){
			smoothing = opts.smoothing
		} else {
			smoothing = data.map((d) => {return true})
		}

		const points = [];
		
		let len = null;
		
		for(var i = 0; i < data.length; i++){
			
			if(smoothing[i]){
				const bezier = buildBezierValues({
					data: data[i],
					size: frames
				});
				points.push(bezier);
			} else {
				points.push(buildAffinePiecewiseValues({
					data: data[i],
					size: frames
				}));
			}
			
			if(typeof(len) !== "number"){
				len = data[i].length
			} else if(data[i].length !== len){
				throw(new Error("lenght should be the same for all data in data.datasets[i].data"));
			}
		}
		
		
		const values = points.map(vi => vi.map(vij => vij[1]));
		const labels = points.map(vi => vi.map(vij => vij[0]))[0];
		
		const wScale = opts.wScale || 1;
		let index;

		const w = this.w;
		const h = this.h;

		this.charts = [];
		const promises = [];
		for(var i = 0; i< frames-1; i++){
			const chart = new ChartJs(w,h);
			const optsI = getOpts({
				wScale,
				frames,
				n: len,
				values: values,
				datasets: opts.data.datasets,
				labels : labels
			});

			promises.push(chart.drawChart(optsI).catch(function(optsI,err){
				console.log("error on opts", err, optsI.data)
			}.bind(this, optsI)));
			this.charts.push(chart);
		}
		return Promise.all(promises);
	}
	
	/**
	* @param {string} filename
	* @returns {Promise}
	*/
	
	writeVideoToFile({filename}){
		const tmpDir = tmp.dirSync();

		return Promise.all(this.charts.map((ch, index) => {
			return ch.writeImageToFile('image/png', tmpDir.name + '/img'+("0000" + index).slice(-5)+'.png')
		})).then(() => {
			return new Promise((resolve, reject) => {
				ffmpeg(tmpDir.name+'/img%05d.png')
					.inputOption('-r '+this.fps)
					.outputOption('-r '+this.fps)
					.output(filename)
					.on('error', (err)=>{
						console.log("err videoplot", err);
						reject(err)
					})
					.on('end', resolve)
					.run();
			})
		})
	}
}

module.exports = Videoplot;