const HTMLElement = require('./HTMLElement');
const MediaError = require('./MediaError');

const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

class HTMLMediaElement extends HTMLElement {
    constructor(type) {
        super(type)
        this._volume = 1.0;
        this._duration = 0;
        this._isEnded = false;
        this._isMute = false;
        this._readyState = HAVE_NOTHING;
        this._error = new MediaError();
    }

    addTextTrack() {}

    captureStream() {}

    fastSeek() {}

    load() {}

    pause() {}

    play() {}

    canPlayType(mediaType) {
        return '';
    }

    set volume(volume) {
        this._volume = volume;
    }

    get volume() {
        return this._volume;
    }

    get duration() {
        return this._duration;
    }

    get ended() {
        return this._isEnded;
    }

    get muted() {
        return this._isMute;
    }

    get readyState() {
        return this._readyState;
    }

    get error() {
        return this._error;
    }

    get currentTime() {
        return 0;
    }
}

module.exports = HTMLMediaElement;
