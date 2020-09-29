const EventTarget = require('./EventTarget')

class FileReader extends EventTarget {
	construct() {
		this.result = null

	}

	// Aborts the read operation. Upon return, the readyState will be DONE.
	abort() {}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
	readAsArrayBuffer() {

	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
	readAsDataURL(blob) {
		this.result = 'data:image/png;base64,' + window.btoa(blob);
		var event = new Event('load');
		this.dispatchEvent(event);
	}

	// Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string.
	readAsText() {

	}
}

module.exports = FileReader;
