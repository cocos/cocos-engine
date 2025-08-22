import HTMLAudioElement from './HTMLAudioElement'

const _innerAudioContextMap = new WeakMap();

const HAVE_NOTHING = 0
const HAVE_METADATA = 1
const HAVE_CURRENT_DATA = 2
const HAVE_FUTURE_DATA = 3
const HAVE_ENOUGH_DATA = 4

export default class Audio extends HTMLAudioElement {

    constructor(url) {
        super()

        this.readyState = HAVE_NOTHING;

        const innerAudioContext = my.createInnerAudioContext()
        _innerAudioContextMap.set(this, innerAudioContext);

        this._canplayEvents = [
            'load',
            'loadend',
            'canplay',
            'canplaythrough',
            'loadedmetadata'
        ];

        innerAudioContext.onCanPlay(() => {
            this._loaded = true
            this.readyState = HAVE_CURRENT_DATA

            this._canplayEvents.forEach((type) => {
                this.dispatchEvent({ type: type })
            })

            if(typeof this.oncanplay === "function") {
                this.oncanplay();
            }
        });

        innerAudioContext.onPlay(() => {
            // this._paused = _innerAudioContextMap.get(this).paused
            this._paused = false;
            this.dispatchEvent({ type: 'play' })
            if(typeof this.onplay === "function") {
                this.onplay();
            }
        });

        innerAudioContext.onPause(() => {
            this._paused = true;
            this.dispatchEvent({ type: 'pause' })
            if(typeof this.onpause === "function") {
                this.onpause();
            }
        });

        innerAudioContext.onEnded(() => {
            // this._paused = _innerAudioContextMap.get(this).paused
            this._paused = false;
            this.dispatchEvent({ type: 'ended' })
            this.readyState = HAVE_ENOUGH_DATA
            
            if(typeof this.onended === "function") {
                this.onended();
                
            }
        });

        innerAudioContext.onError(() => {
            // this._paused = _innerAudioContextMap.get(this).paused
            this._paused = true;
            this.dispatchEvent({ type: 'error' });
            if(typeof this.onerror === "function") {
                this.onerror();
            }
        });

        if (url) {
            this.src = url
        } else {
            this._src = ''
        }

        this._loop = innerAudioContext.loop
        this._autoplay = innerAudioContext.autoplay
        this._paused = innerAudioContext.paused
        this._volume = innerAudioContext.volume
        this._muted = false
    }

    addEventListener(type, listener, options = {}) {
        type = String(type).toLowerCase()

        super.addEventListener(type, listener, options)

        if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
            this.dispatchEvent({ type: type })
        }
    }

    load() {
        // console.warn('HTMLAudioElement.load() is not implemented.')
        // weixin doesn't need call load() manually
    }

    play() {
        _innerAudioContextMap.get(this).play()
    }

    resume() {
        _innerAudioContextMap.get(this).play()
    }

    pause() {
        _innerAudioContextMap.get(this).pause()
    }

    destroy() {
        console.log("destory: " + typeof _innerAudioContextMap.get(this).destroy);
        _innerAudioContextMap.get(this).destroy()
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
        return _innerAudioContextMap.get(this).currentTime
    }

    set currentTime(value) {
        _innerAudioContextMap.get(this).seek(value)
    }

    get duration() {
        return _innerAudioContextMap.get(this).duration
    }

    get src() {
        return this._src
    }

    set src(value) {
        this._src = value
        this._loaded = false
        this.readyState = HAVE_NOTHING

        const innerAudioContext = _innerAudioContextMap.get(this)

        innerAudioContext.src = value
    }

    get loop() {
        return this._loop
    }

    set loop(value) {
        this._loop = value
        _innerAudioContextMap.get(this).loop = value
    }

    get autoplay() {
        return this._autoplay
    }

    set autoplay(value) {
        this._autoplay = value
        _innerAudioContextMap.get(this).autoplay = value
    }

    get paused() {
        return this._paused
    }

    get volume() {
        return this._volume
    }

    set volume(value) {
        this._volume = value
        if (!this._muted) {
            _innerAudioContextMap.get(this).volume = value
        }
    }

    get muted() {
        return this._muted
    }

    set muted(value) {
        this._muted = value
        if (value) {
            _innerAudioContextMap.get(this).volume = 0
        } else {
            _innerAudioContextMap.get(this).volume = this._volume
        }
    }

    cloneNode() {
        const newAudio = new Audio()
        newAudio.loop = this.loop
        newAudio.autoplay = this.autoplay
        newAudio.src = this.src
        return newAudio
    }
}