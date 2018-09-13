/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass } = _decorator;
import { AudioClip, AudioSourceType, PlayingState } from "./audio-clip";

@ccclass
export default class WebAudioClip extends AudioClip {
    /**
     * @type {number}
     */
    _startTime;

    /**
     * @type {number}
     */
    _offset;

    /**
     * @type {number}
     */
    _volume;

    /**
     * @type {boolean}
     */
    _loop;

    /**
     * @type {number}
     */
    _currentTimer;
    
    constructor(context, app) {
        super();

        this.loadMode = AudioSourceType.WEB_AUDIO;
        this._currentTimer = 0;
        this._startTime = 0;
        this._offset = 0;
        this._loop = false;
        this._volume = 1;

        this._app = app;
        this._context = context;
        this._sourceNode = this._context.createBufferSource();
        this._gainNode = this._context.createGain();
        this._gainNode.connect(this._context.destination);

        this._on_ended = () => {
            this._offset = 0;
            this._startTime = this._context.currentTime;
            if (this._sourceNode.loop) return;
            // @ts-ignore
            this.emit('ended');
            this._state = PlayingState.STOPPED;
        };

        this._do_play = () => {
            this._sourceNode = this._context.createBufferSource();
            this._sourceNode.buffer = this._audio;
            this._sourceNode.loop = this._loop;
            this._sourceNode.connect(this._gainNode);
            this._sourceNode.start(0, this._offset);
            this._state = PlayingState.PLAYING;
            this._startTime = this._context.currentTime;
            // delay eval here to yield uniform behavior with other platforms
            // @ts-ignore
            this._app.once('tick', () => { this.emit('started'); });
            /* still not supported by all platforms *
            this._sourceNode.onended = this._on_ended;
            /* doing it manually for now */
            clearInterval(this._currentTimer);
            this._currentTimer = setInterval(() => {
                this._on_ended();
                clearInterval(this._currentTimer);
                if (this._sourceNode.loop) {
                    this._currentTimer = setInterval(this._on_ended, this._audio.duration * 1000);
                }
            }, (this._audio.duration - this._offset) * 1000);
        };

        this._on_gesture = () => {
            this._context.resume().then(() => {
                if (this._alreadyDelayed) this._do_play();
                window.removeEventListener('touchend', this._on_gesture);
                document.removeEventListener('mouseup', this._on_gesture);
            });
        };
    }

    setNativeAsset(clip, info) {
        super.setNativeAsset(clip, info);
        if (this._context.state === 'running') return;
        window.addEventListener('touchend', this._on_gesture);
        document.addEventListener('mouseup', this._on_gesture);
    }

    play() {
        if (!this._audio || this._state === PlayingState.PLAYING) return;
        if (this._context.state === 'running') {
            this._do_play();
        } else this._alreadyDelayed = true;
    }

    pause() {
        if (this._state !== PlayingState.PLAYING) return;
        this._sourceNode.stop();
        this._offset += this._context.currentTime - this._startTime;
        this._state = PlayingState.STOPPED;
        clearInterval(this._currentTimer);
    }

    stop() {
        this._offset = 0;
        if (this._state !== PlayingState.PLAYING) return;
        this._sourceNode.stop();
        this._state = PlayingState.STOPPED;
        clearInterval(this._currentTimer);
    }

    playOneShot(volume = 1) {
        if (!this._audio) return;
        let gainNode = this._context.createGain();
        gainNode.connect(this._context.destination);
        gainNode.gain.value = volume;
        let sourceNode = this._context.createBufferSource();
        sourceNode.buffer = this._audio;
        sourceNode.loop = false;
        sourceNode.connect(gainNode);
        sourceNode.start();
    }

    setCurrentTime(val) {
        this._offset = val;
        if (this._state !== PlayingState.PLAYING) return;
        this._sourceNode.stop(); this._do_play();
    }

    getCurrentTime() {
        if (this._state !== PlayingState.PLAYING) return this._offset;
        return this._context.currentTime - this._startTime + this._offset;
    }

    getDuration() {
        return this._audio ? this._audio.duration : 0;
    }

    setVolume(val) {
        this._volume = val;
        if (this._gainNode.gain.setTargetAtTime) {
            this._gainNode.gain.setTargetAtTime(val, this._context.currentTime, 0.01);
        } else {
            this._gainNode.gain.value = val;
        }
    }

    getVolume() {
        return this._volume;
    }

    setLoop(val) {
        this._loop = val;
        this._sourceNode.loop = val;
    }

    getLoop() {
        return this._loop;
    }
}