## Videoplot

```bash
npm install videoplot
```

## Example
| First example | Second example |
|---|---|
|![Example video](./examples/example.gif)| ![Example video](./examples/example2.gif)|


## Usage

```js
const Videoplot = require('videoplot');

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
plot.drawVideoChart({
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
.catch(err => {
	console.error("Error : ", err)
})
.then(() => {
	console.log("Chart is saved into ./examples/example.gif");
})

```

## TO DO

* better x scale management (labels ...)
* more chartjs options handling
* video output handling

## Thanks

thanks to [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) and [chartjs-node](https://www.npmjs.com/package/chartjs-node)
