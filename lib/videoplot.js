const ChartJs = require('chartjs-node');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');

const buildBezierValues = require('./build-bezier-values');
const buildAffinePiecewiseValues = require('./build-affine-piecewise-values');
const getOpts = require('./get-chartjs-opts');

class Videoplot {
	constructor({w, h, fps, duration}) {
		this.w = w;
		this.h = h;
		this.fps = fps;
		this.duration = duration;
	}

	/**
	* @param {number} duration
	* @param {number} fps- fps of final video = number of points in the graph drawing
	* @param {boolean|Array<boolean>} [smoothing=true] if true, bezier smoothing done, else, no smoothing is done
	* @param {Array.<Array<number>>} data - values to draw chart
	* @param {number} wScale - values to draw chart
	* @returns {Promise}
	*/

	drawVideoChart(opts) {
		const data = opts.data.datasets.map(ds => ds.data);
		const options = opts.options;
		const type = opts.type;
		const frames = this.duration * this.fps;
		let smoothing;
		if (typeof (opts.smoothing) === 'boolean') {
			smoothing = data.map(() => opts.smoothing);
		} else if (Array.isArray(opts.smoothing)) {
			smoothing = opts.smoothing;
		} else {
			smoothing = data.map(() => true);
		}

		const points = [];

		let len;

		for (let i = 0; i < data.length; i++) {
			if (smoothing[i]) {
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

			if (typeof (len) !== 'number') {
				len = data[i].length;
			} else if (data[i].length !== len) {
				throw (new Error('lenght should be the same for all data in data.datasets[i].data'));
			}
		}

		const values = points.map(vi => vi.map(vij => vij[1]));
		const labels = points.map(vi => vi.map(vij => vij[0]))[0];

		const wScale = opts.wScale || 1;

		const w = this.w;
		const h = this.h;

		this.charts = [];
		const promises = [];
		for (let i = 0; i < frames - 1; i++) {
			const chart = new ChartJs(w, h);
			const optsI = getOpts({
				wScale,
				frames,
				n: i,
				values,
				datasets: opts.data.datasets,
				labels,
				type,
				options
			});

			promises.push(chart.drawChart(optsI).catch(((optsI, err) => {
				console.log('error on opts', err, optsI.data);
			}).bind(this, optsI)));

			this.charts.push(chart);
		}
		return Promise.all(promises);
	}

	/**
	* @param {string} filename
	* @returns {Promise}
	*/

	writeVideoToFile({filename}) {
		
		return this.getPngStream().then(pngPattern => {
			return new Promise((resolve, reject) => {
				ffmpeg(pngPattern)
					.inputOption('-r ' + this.fps)
					.outputOption('-r ' + this.fps)
					.output(filename)
					.on('error', err => {
						console.log('err videoplot', err);
						reject(err);
					})
					.on('end', resolve)
					.run();
			});
		});
	}
	
	/**
	* Generate thumbnail and resolve the promise with thumbnail pattern
	* @param {string} filename
	* @returns {Promise.<filename>} thumbnail pattern ('<tmpDir>/img%05d.png')
	*/

	getPngStream() {
		const tmpDir = tmp.dirSync();
		
		return Promise.all(this.charts.map((ch, index) => {
			return ch.writeImageToFile('image/png', tmpDir.name + '/img' + ('0000' + index).slice(-5) + '.png');
		})).then(() => {
			return tmpDir.name + '/img%05d.png'
		})
	}
}

module.exports = Videoplot;
