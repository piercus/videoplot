const Videoplot = require('../index.js');

const plot = new Videoplot({w: 600, h: 600, duration: 30, fps: 8});

// Create random data
const y = [];
for (let i = 0; i < 10; i++) {
	y.push(Math.random());
}

// Chartjs dataset format

const datasets = [];
datasets.push({
	label: 'graph',
	borderColor: '#FFFFFF',
	backgroundColor: '#888888',
	fill: false,
	data: y
});

// Chartjs dataset format
plot.drawVideoChart({
	type: 'line',
	wScale: 4,
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
					display: false,
					beginAtZero: true,
					suggestedMax: 1
				}
			}]
		}
	}
})
.then(() => {
	console.log('Chart is created');
	// Chart is created
	return plot.writeVideoToFile({filename: './examples/example.gif'});
	// Return plot.getVideoStream('image/gif');
})
.catch(err => {
	console.error('Error : ', err);
})
.then(() => {
	console.log('Chart is saved into ./examples/example.gif');
});
