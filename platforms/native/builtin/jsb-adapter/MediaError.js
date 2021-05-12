const MEDIA_ERR_ABORTED = 1;
const MEDIA_ERR_NETWORK = 2;
const MEDIA_ERR_DECODE = 3;
const MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

class MediaError {
	constructor() {

	}

	get code() {
		return MEDIA_ERR_ABORTED
	}

	get message() {
		return ""
	}
}

module.exports = MediaError;
