const Videoplot = require('../index.js');

var plot = new Videoplot({ w:600, h:600 });

const y = [];
for(var i = 0; i< 10; i++){
	y.push(Math.random());
}
const datasets = [];
datasets.push({
	label : "graph",
	borderColor: "#FFFFFF",
	backgroundColor: "#888888",
	fill: false,
	data : y
});
return plot.drawVideoChart({
		type: 'line',
		fps: 8,
		wScale: 4,
		duration: 30,
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
}).catch(e => {
	console.log("error", e)
})
.then(() => {
    // chart is created
		return plot.writeVideoToFile('video/mp4', './examples/example.gif');
    //return plot.getVideoStream('image/gif');
})
