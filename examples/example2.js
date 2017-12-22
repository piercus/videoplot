const Videoplot = require('../index.js');

var plot = new Videoplot({ w:600, h:600 });

const xLabels = [];
const y = [];
for(var i = 0; i< 30; i++){
	xLabels.push(i);
	y.push(Math.random());
}
const datasets = [];
datasets.push({
	label : "graph",
	borderColor: "#FFFFFF",
	backgroundColor: "#888888",
	fill: false
});
return plot.drawVideoChart({
		type: 'line',
		fps: 8,
		wScale: 2,
		y: y,
		duration: 30,
		data: {
			labels : xLabels,
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
						display: true,
						beginAtZero: true,
						suggestedMax: 1
					}
				}],
			}
		}
})
.then(() => {
    // chart is created
		return plot.writeVideoToFile('video/mp4', './examples/example2.gif');
    //return plot.getVideoStream('image/gif');
})
