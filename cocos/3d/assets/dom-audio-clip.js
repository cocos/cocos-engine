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

@ccclass('cc.DOMAudioClip')
export class DOMAudioClip extends AudioClip {
    /**
     * @type {number}
     */
    _volume = 1;

    /**
     * @type {boolean}
     */
    _loop = false;

    /**
     * @type {number}
     */
    _currentTimer = 0;

    /**
     * @type {boolean}
     */
    _oneShoting = false;

    constructor() {
        super();

        this.loadMode = AudioSourceType.DOM_AUDIO;

        this._post_play = () => {
            this._state = AudioSourceType.PLAYING;
            // @ts-ignore
            this.emit('started');
        };

        this._on_gesture = () => {
            let promise = this._audio.play();
            if (!promise) {
                console.warn('no promise returned from HTMLMediaElement.play()');
                return;
            }
            promise.then(() => {
                if (this._alreadyDelayed) this._post_play();
                else { this._audio.pause(); this._audio.currentTime = 0; }
                window.removeEventListener('touchend', this._on_gesture);
                document.removeEventListener('mouseup', this._on_gesture);
            });
        };
    }

    setNativeAsset(clip, info) {
        super.setNativeAsset(clip, info);
        clip.volume = this._volume;
        clip.loop = this._loop;
        // callback on audio ended
        clip.addEventListener('ended', () => {
            if (this._oneShoting) return;
            this._state = PlayingState.STOPPED;
            this._audio.currentTime = 0;
            // @ts-ignore
            this.emit('ended');
        });
        /* play & stop immediately after receiving a gesture so that
           we can freely invoke play() outside event listeners later */
        window.addEventListener('touchend', this._on_gesture);
        document.addEventListener('mouseup', this._on_gesture);
    }

    play() {
        if (!this._audio || this._state === PlayingState.PLAYING) return;
        let promise = this._audio.play();
        if (!promise) {
            console.warn('no promise returned from HTMLMediaElement.play()');
            return;
        }
        promise.then(this._post_play).catch(() => { this._alreadyDelayed = true; });
    }

    pause() {
        if (this._state !== PlayingState.PLAYING) return;
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShoting = false;
    }

    stop() {
        this._audio.currentTime = 0;
        if (this._state !== PlayingState.PLAYING) return;
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShoting = false;
    }

    playOneShot(volume = 1) {
        /* HTMLMediaElement doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        if (!this._audio) return;
        this._audio.currentTime = 0;
        this._audio.volume = volume;
        if (this._oneShoting) return;
        this._audio.loop = false;
        this._oneShoting = true;
        this._audio.play().then(() => {
            this._audio.addEventListener('ended', () => {
                this._audio.currentTime = 0;
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }, { once: true });
        }).catch(() => { this._oneShoting = false; });
    }

    setCurrentTime(val) {
        if (!this._audio) return;
        this._audio.currentTime = val;
    }

    getCurrentTime() {
        return this._audio ? this._audio.currentTime : 0;
    }

    getDuration() {
        if (!this._audio) return this._duration;
        // ios wechat browser doesn't have duration
        return isNaN(this._audio.duration) ? this._duration : this._audio.duration;
    }

    setVolume(val) {
        this._volume = val;
        /* note this won't work for ios devices, for there
           is just no way to set HTMLMediaElement's volume */
        if (this._audio) this._audio.volume = val;
    }

    getVolume() {
        if (this._audio) return this._audio.volume;
        return this._volume;
    }

    setLoop(val) {
        this._loop = val;
        if (this._audio) this._audio.loop = val;
    }

    getLoop() {
        return this._loop;
    }
}

cc.DOMAudioClip = DOMAudioClip;