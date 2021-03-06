const Videoplot = require('../index.js');

const plot = new Videoplot({w: 600, h: 600, duration: 30, fps: 8});

const y1 = [];
const y2 = [];
const y3 = [];
let y2current = 0.5;
let y3current = 0.5;
for (let i = 0; i < 30; i++) {
	y1.push(Math.random());
	y2current += (Math.random() - 0.5) / 10;
	y3current += (Math.random() - 0.5) / 5;
	y2.push(y2current);
	y3.push(y3current);
}
const datasets = [];
datasets.push({
	label: 'fast',
	borderColor: '#FF0000',
	backgroundColor: '#888888',
	fill: false,
	data: y1
});

datasets.push({
	label: 'slow',
	borderColor: '#00FF00',
	backgroundColor: '#888888',
	fill: false,
	data: y2
});

datasets.push({
	label: 'slow',
	borderColor: '#0000FF',
	backgroundColor: '#888888',
	fill: false,
	data: y3
});

module.exports = plot.drawVideoChart({
	type: 'line',
	wScale: 2,
	smoothing: [true, false, true],
	data: {
		datasets
	},
	options: {
		elements: {
			point: {
				pointStyle: 'line'
			}
		},
		scales: {
			xAxes: [{
				ticks: {
					display: false
				}
			}],
			yAxes: [{
				ticks: {
					display: true
				}
			}]
		}
	}
})
.then(() => {
    // Chart is created
	return plot.writeVideoToFile({filename: './examples/example2.gif'});
    // Return plot.getVideoStream('image/gif');
});
