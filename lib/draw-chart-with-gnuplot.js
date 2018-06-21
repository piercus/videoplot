const gnuplot = require('gnuplot');
const getOpts = require('./get-chartjs-opts');
const fs = require('fs');

module.exports = function ({
	width,
	height,
	wScale,
	frames,
	n,
	values,
	datasets,
	labels,
	type,
	options,
	filename
}) {
	const opts = getOpts({
		frames,
		n,
		values,
		labels,
		wScale,
		datasets,
		options,
		type
	});
	//console.log(opts)
	const rangeLabels = [
		Math.min.apply(this, opts.data.labels.map(l => parseInt(l))),
		Math.max.apply(this, opts.data.labels.map(l => parseInt(l)))
	];
	
	const datFile = opts.data.datasets[0].data.map((v,i) => {
		return opts.data.labels[i]+' '+v;
	}).join('\n');
	
	return new Promise((resolve, reject) => {
		const out = fs.createWriteStream(filename);
		const plotter = gnuplot().set('term png');
		    		//plotter.set("style line 1 default")

		plotter.pipe(out);
		plotter.set('style data lines');
		
		plotter.unset('border')
		plotter.unset('xtics')
		plotter.unset('ytics')
		plotter.set('xrange ['+rangeLabels[0]+':'+rangeLabels[1]+']')
		//plotter.set("style line 2  lc rgb '#0025ad' lt 1 lw 1.5")

		plotter.plot("'-'\n"+datFile+"\ne with lines")
		plotter.end();
		
		out.on('finish', resolve)
		out.on('error', reject)
	})
	
	return Promise.resolve();
};
