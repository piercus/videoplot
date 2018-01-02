const Videoplot = require('../index.js');

var plot = new Videoplot({ w:600, h:600, duration: 30, fps: 8 });

const y = [];
for(var i = 0; i< 30; i++){
	y.push(Math.random());
}
const datasets = [];
datasets.push({
	label : "graph",
	borderColor: "#FFFFFF",
	backgroundColor: "#888888",
	fill: false,
	data: y
});
return plot.drawVideoChart({
		type: 'line',
		wScale: 2,
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
		return plot.writeVideoToFile({ filename : './examples/example2.gif'});
    //return plot.getVideoStream('image/gif');
})
