const EventTarget = require('./EventTarget');
const Event = require('./Event');
const jsbWindow = require('../../jsbWindow');

class FileReader extends EventTarget {
	construct () {
		this.result = null;
	}

	// Aborts the read operation. Upon return, the readyState will be DONE.
	abort () {}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
	readAsArrayBuffer () {

	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
	readAsDataURL (blob) {
		this.result = `data:image/png;base64,${jsbWindow.btoa(blob)}`;
		const event = new Event('load');
		this.dispatchEvent(event);
	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string.
	readAsText () {

	}
}

module.exports = FileReader;
