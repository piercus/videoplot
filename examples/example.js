const Videoplot = require('../index.js');

var plot = new Videoplot({ w:600, h:600, duration: 30, fps: 8 });

// create random data
const y = [];
for(var i = 0; i< 10; i++){
	y.push(Math.random());
}

// chartjs dataset format

const datasets = [];
datasets.push({
	label : "graph",
	borderColor: "#FFFFFF",
	backgroundColor: "#888888",
	fill: false,
	data : y
});

// chartjs dataset format
return plot.drawVideoChart({
		type: 'line',
		wScale: 4,
		data: {
			datasets : datasets
		},
		options: {
			elements: {
				point : {
					pointStyle : 'line'
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
				}],
			}
		}
})
.then(() => {
	console.log("Chart is created");
	// chart is created
	return plot.writeVideoToFile({filename: './examples/example.gif'});
	//return plot.getVideoStream('image/gif');
})
.catch(e => {
	console.log("Error : ", e)
})
.then(() => {
	console.log("Chart is saved into ./examples/example.gif");
})
