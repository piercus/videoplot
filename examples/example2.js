const Videoplot = require('../index.js');

const plot = new Videoplot({w: 600, h: 600, duration: 30, fps: 8});

const y = [];
for (let i = 0; i < 30; i++) {
	y.push(Math.random());
}
const datasets = [];
datasets.push({
	label: 'graph',
	borderColor: '#FFFFFF',
	backgroundColor: '#888888',
	fill: false,
	data: y
});
plot.drawVideoChart({
	type: 'line',
	wScale: 2,
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
					display: true,
					beginAtZero: true,
					suggestedMax: 1
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
