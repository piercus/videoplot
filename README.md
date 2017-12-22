## Videoplot

```bash
npm install videoplot
```

## Example

![Example video](./examples/example.gif)

## Usage

```
const Videoplot = require('videoplot');

var plot = new Videoplot({ w:600, h:600 });
const duration = 10;
const fps = 10;
const xLabels = [];
const data = [];
const y = [];
for(var i = 0; i< duration; i++){
	xLabels.push(i/fps);
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
		wScale: 4,
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
						display: false,
						beginAtZero: true,
						suggestedMax: 1
					}
				}],
			}
		}
})
.then(() => {
    // chart is created
		return plot.writeVideoToFile('video/mp4', './examples/example.gif');
    //return plot.getVideoStream('image/gif');
})
```

## Thanks

thanks to fluent-ffmpeg and
