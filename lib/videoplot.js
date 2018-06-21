const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const PromiseBlue = require('bluebird');

const buildBezierValues = require('./build-bezier-values');
const buildAffinePiecewiseValues = require('./build-affine-piecewise-values');
const drawChart = require('./draw-chart-with-gnuplot');

class Videoplot {
	/**
	* @param {number} opts.w - width of video
	* @param {number} opts.h - height of video
	* @param {number} opts.fps- fps of final video = number of points in the graph drawing
	* @param {number} opts.duration
	* @param {number} [opts.concurrency=20] - async loop concurrency
	* @param {number} [opts.logFreq=100] - async loop concurrency
	* @param {Winston} opts.logger - winston-like logger
	*/
	constructor({w, h, fps, duration, logger, concurrency = 4, logFreq = 100}) {
		this.w = w;
		this.h = h;
		this.fps = fps;
		this.duration = duration;
		this.logger = logger;
		this.concurrency = concurrency;
		this.logFreq = logFreq || 100;
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
		if (this.logger) {
			this.logger.debug('draw video Chart');
		}

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

		if (this.logger) {
			this.logger.debug('draw video Chart: prepare datas');
		}

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
		if (this.logger) {
			this.logger.debug('draw video Chart: data prepared');
		}

		const values = points.map(vi => vi.map(vij => vij[1]));
		const labels = points.map(vi => vi.map(vij => vij[0]))[0];

		const wScale = opts.wScale || 1;

		const w = this.w;
		const h = this.h;

		this.charts = [];
		const indexes = [];
		for (let i = 0; i < frames - 1; i++) {
			indexes.push(i);
		}

		if (!this.tmpDir) {
			this.tmpDir = tmp.dirSync({unsafeCleanup: true});
		}

		return PromiseBlue.map(indexes, i => {
			return drawChart({
				wScale,
				frames,
				n: i,
				values,
				datasets: opts.data.datasets,
				labels,
				type,
				width: w,
				height: h,
				options,
				filename: this.getPngPattern(i)
			});
		}, {concurrency: this.concurrency}).then(() => {
			return this.tmpDir.name + '/img%05d.png';
		});
	}
	
	getPngPattern(index = null){
		let num = '%05d'
		if(typeof(index) === 'number'){
			num = ('0000' + index).slice(-5)
		} 
		return this.tmpDir.name + '/img' + num + '.png'
	}

	/**
	* @param {string} filename
	* @returns {Promise}
	*/

	writeVideoToFile({filename}) {
		const pngPattern = this.getPngPattern();
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
	}
	/**
	* Generate thumbnail and resolve the promise with thumbnail pattern
	* @param {string} filename
	* @returns {Promise.<filename>} thumbnail pattern ('<tmpDir>/img%05d.png')
	*/

	getPngStream() {
		// Deprecated
		throw new Error('getPngStream is deprecated');
	}
	/**
	* Remove the tmp directory
	* @returns {Promise.<null>} thumbnail pattern ('<tmpDir>/img%05d.png')
	*/

	removeCallback() {
		if (this.tmpDir) {
			return new Promise((resolve, reject) => {
				this.tmpDir.removeCallback(err => {
					if (err) {
						return reject(err);
					}
					resolve();
				});

				this.tmpDir = null;
			});
		}
		return Promise.resolve();
	}
}

module.exports = Videoplot;
