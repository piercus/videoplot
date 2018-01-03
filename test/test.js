const fs = require('fs');
const assert = require('assert');
const vows = require('vows');

const gifFilename1 = './examples/example.gif';
const gifFilename2 = './examples/example2.gif';

vows.describe('videoplot').addBatch({
	'first example': {
		topic() {
			fs.unlink(gifFilename1, () => {
				require('../examples/example.js').then(this.callback, this.callback);
			});
		},
		'file exists'() {
			assert(fs.existsSync(gifFilename1));
		}
	},
	'second example': {
		topic() {
			fs.unlink(gifFilename2, () => {
				require('../examples/example2.js').then(this.callback, this.callback);
			});
		},
		'file exists'() {
			assert(fs.existsSync(gifFilename2));
		}
	}
}).export(module);
