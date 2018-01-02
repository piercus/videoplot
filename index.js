const ChartJs = require('chartjs-node');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');

var bezier = require('bezier-curve');

class Videoplot {
	constructor({w, h, wScale}){
		this.w =w;
		this.h = h;
	}
	/**
	*
	*/
	drawVideoChart(opts){
		const duration = opts.duration;
		const fps = opts.fps;
		this.fps = fps;
		const wScale = opts.wScale || 1;
		var y = opts.y;
		const n = y.length;
		const step = 1/fps;
		const values = [];
		const values2 = [];
		const labels = [];
		const middlePoints = [];
		const middle = function(p1,p2){
			return [
					(p1[0]+p2[0])/2,
					(p1[1]+p2[1])/2
			];
		}
		const middleBez = function(p1,p2){
			return [p1,middle(p1,p2),p2];
		}
		for(var i = 0; i< n-1; i++){
			const p1 = [i*duration/n,y[i]]
			const p2 = [(i+1)*duration/n,y[i+1]]
			middlePoints.push(middle(p1,p2))
		}
		let index;

		for (var t = 0; t < duration; t += step) {
			index = Math.floor(t/duration*n);

			let points;
			if(t >= middlePoints[middlePoints.length-1][0]){
				const lastIndex = y.length-1;
				const lastY = y[lastIndex];
				const lastX = lastY*duration/n;
				const endVideo = duration;
				points = [
					middlePoints[middlePoints.length-1],
					[lastX,lastY],
					[endVideo,lastY]
				]
			} else if(index === 0){
				if(t<middlePoints[index][0]){
					points = middleBez([0, y[0]],middlePoints[index]);
				} else {
					points = [
						middlePoints[index],
						[(index+1)*duration/n, y[index+1]],
						middlePoints[index+1]
					];
				}
			} else if(index >= 0){
				if(t<middlePoints[index][0]){
					points = [
						middlePoints[index - 1],
						[index*duration/n, y[index]],
						middlePoints[index]
					];
				} else {
					points = [
						middlePoints[index],
						[(index+1)*duration/n, y[index+1]],
						middlePoints[index + 1]
					];
				}
			} else {
				//console.log(middlePoints[middlePoints.length-1][0], t)
				throw(new Error("index error : " +  index));
			}

			var b = Math.abs(t/duration*n-(index+1))*2;
			var a = Math.abs(t/duration*n-index)*2;
			let v2;
			if(y[index+1]){
				v2 = (b*y[index]+a*y[index+1])/(a+b);
			} else {
				v2 = y[index];
			}

			if(t > points[points.length-1][0]){
				throw(new Error("t should not be in the range"));
			}
			const v = bezier((t-points[0][0])/(points[2][0]-points[0][0]), points)[1];
			if(v < 0){
				//console.log(v, t, points);
				throw(new Error("should not be negative"));
			}
			if(isNaN(v) || isNaN(v2)){
				throw(new Error("NaN value "+v+" "+v2));
			}
		  values.push(v);
			values2.push(v2);
			labels.push(t);
		}

		const frames = duration*fps;

		const w = this.w;
		const h = this.h;

		const getOpts = function(n){
			const windowSize = Math.floor(frames/wScale);
			const start = Math.min(Math.max(0, n-windowSize/2),frames-windowSize);
			const end = start+windowSize;
			const range = [start, end];

			// set debug to true to display non-bezier curve
			var debug = false;

			const data = {
				datasets : [Object.assign({},opts.data.datasets[0],{
					data : values.filter((a,i) => i <= end && i >= start && i <= n),
				})]
			}
			if(debug && opts.data.datasets){
				data.datasets.push(Object.assign({},opts.data.datasets[1],{
					data : values2.filter((a,i) => i <= end && i >= start && i <= n),
				}));
			}
			if(opts.data.labels){
				data.labels = labels.slice().filter((a,i) => {
					return i <= end && i >= start
				});//.slice(0,Math.floor(n/frames*numberOfData));
			}
			const opts2 = Object.assign({},opts,{
				data :data
			})
			//console.log(opts2.options.scales)
			return opts2;
		}
		this.charts = [];
		const promises = [];
		for(var i = 0; i< frames-1; i++){
			const chart = new ChartJs(w,h);
			const optsI = getOpts(i);

			promises.push(chart.drawChart(optsI).catch(function(optsI,err){
				console.log("error on opts", err, optsI)
			}.bind(this, optsI)));
			this.charts.push(chart);
		}
		return Promise.all(promises);
	}
	writeVideoToFile(contentType, filename){
		const tmpDir = tmp.dirSync();

		return Promise.all(this.charts.map((ch, index) => {
			return ch.writeImageToFile('image/png', tmpDir.name + '/img'+("0000" + index).slice(-5)+'.png')
		})).then(() => {
			return new Promise((resolve, reject) => {
				ffmpeg(tmpDir.name+'/img%05d.png')
					.inputOption('-r '+this.fps)
					.outputOption('-r '+this.fps)
					.output(filename)
					.on('error', (err)=>{
						console.log("err videoplot", err);
						reject(err)
					})
					.on('end', resolve)
					.run();
			})
		})
	}
}
module.exports = Videoplot;
