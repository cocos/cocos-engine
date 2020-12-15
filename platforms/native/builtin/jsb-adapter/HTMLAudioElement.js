const HTMLMediaElement = require('./HTMLMediaElement');

const HAVE_NOTHING = 0
const HAVE_METADATA = 1
const HAVE_CURRENT_DATA = 2
const HAVE_FUTURE_DATA = 3
const HAVE_ENOUGH_DATA = 4

const _innerAudioContext = new WeakMap()
const _src = new WeakMap()
const _loop = new WeakMap()
const _autoplay = new WeakMap()

class HTMLAudioElement extends HTMLMediaElement {
    constructor(url) {
        super('audio')

        _src.set(this, '')

        //TODO:
    }

    load() {
        console.warn('HTMLAudioElement.load() is not implemented.')
    }

    play() {

    }

    pause() {

    }

    canPlayType(mediaType = '') {
        if (typeof mediaType !== 'string') {
            return ''
        }

        if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
            return 'probably'
        }
        return ''
    }

    get currentTime() {

    }

    set currentTime(value) {

    }

    get src() {

    }

    set src(value) {

    }

    get loop() {

    }

    set loop(value) {

    }

    get autoplay() {

    }

    set autoplay(value) {

    }

    get paused() {

    }

    cloneNode() {

    }
}

module.exports = HTMLAudioElement;
