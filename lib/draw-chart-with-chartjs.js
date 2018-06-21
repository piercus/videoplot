const ChartJs = require('chartjs-node');
const getOpts = require('./get-chartjs-opts');

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
	const chart = new ChartJs(width, height);

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

	return chart.drawChart(opts)
		.then(() => {
			return chart.writeImageToFile('image/png', filename);
		}).then(() => {
			return chart.destroy();
		});
};
