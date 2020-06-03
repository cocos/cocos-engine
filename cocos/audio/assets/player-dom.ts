/*
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
 */

/**
 * @category component/audio
 */

import { clamp } from '../../core/math/utils';
import { AudioPlayer, IAudioInfo, PlayingState } from './player';
import { legacyCC } from '../../core/global-exports';

export class AudioPlayerDOM extends AudioPlayer {
    protected _volume = 1;
    protected _loop = false;
    protected _oneShotOngoing = false;
    protected _audio: HTMLAudioElement;
    protected _cbRegistered = false;

    private _remove_cb: () => void;
    private _post_play: () => void;
    private _on_gesture: () => void;
    private _post_gesture: () => void;

    constructor (info: IAudioInfo) {
        super(info);
        this._audio = info.clip;

        this._remove_cb = () => {
            if (!this._cbRegistered) { return; }
            legacyCC.game.canvas.removeEventListener('touchend', this._on_gesture);
            legacyCC.game.canvas.removeEventListener('mouseup', this._on_gesture);
            this._cbRegistered = false;
        };

        this._post_play = () => {
            this._state = PlayingState.PLAYING;
            this._eventTarget.emit('started');
            this._remove_cb(); // should remove callbacks after any success play
        };

        this._post_gesture = () => {
            if (this._interrupted) { this._post_play(); this._interrupted = false; }
            else { this._audio!.pause(); this._audio!.currentTime = 0; }
        };

        this._on_gesture = () => {
            if (!this._audio) { return; }
            const promise = this._audio.play();
            if (!promise) { // Chrome50/Firefox53 below
                // delay eval here to yield uniform behavior with other platforms
                this._state = PlayingState.PLAYING;
                legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_gesture);
                return;
            }
            promise.then(this._post_gesture);
            this._remove_cb();
        };

        this._audio.volume = this._volume;
        this._audio.loop = this._loop;
        // callback on audio ended
        this._audio.addEventListener('ended', () => {
            if (this._oneShotOngoing) { return; }
            this._state = PlayingState.STOPPED;
            this._audio!.currentTime = 0;
            this._eventTarget.emit('ended');
        });
        /* play & stop immediately after receiving a gesture so that
           we can freely invoke play() outside event listeners later */
        legacyCC.game.canvas.addEventListener('touchend', this._on_gesture);
        legacyCC.game.canvas.addEventListener('mouseup', this._on_gesture);
        this._cbRegistered = true;
    }

    public play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        if (this._blocking) { this._interrupted = true; return; }
        const promise = this._audio.play();
        if (!promise) {
            // delay eval here to yield uniform behavior with other platforms
            this._state = PlayingState.PLAYING;
            legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_play);
            return;
        }
        promise.then(this._post_play).catch(() => { this._interrupted = true; });
    }

    public pause () {
        if (!this._audio || this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShotOngoing = false;
    }

    public stop () {
        if (!this._audio) { return; }
        this._audio.currentTime = 0;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShotOngoing = false;
    }

    public playOneShot (volume = 1) {
        /* HTMLMediaElement doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        const clip = this._audio;
        if (!clip) { return; }
        clip.currentTime = 0;
        clip.volume = volume;
        if (this._oneShotOngoing) { return; }
        clip.loop = false;
        this._oneShotOngoing = true;
        clip.play().then(() => {
            clip.addEventListener('ended', () => {
                clip.currentTime = 0;
                clip.volume = this._volume;
                clip.loop = this._loop;
                this._oneShotOngoing = false;
            }, { once: true });
        }).catch(() => { this._oneShotOngoing = false; });
    }

    public setCurrentTime (val: number) {
        if (!this._audio) { return; }
        this._audio.currentTime = clamp(val, 0, this._duration);
    }

    public getCurrentTime () {
        return this._audio ? this._audio.currentTime : 0;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        /* note this won't work for ios devices, for there
           is just no way to set HTMLMediaElement's volume */
        if (this._audio) { this._audio.volume = val; }
    }

    public getVolume () {
        if (this._audio) { return this._audio.volume; }
        return this._volume;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        if (this._audio) { this._audio.loop = val; }
    }

    public getLoop () {
        return this._loop;
    }

    public destroy () {
        if (this._audio) { this._audio.src = ''; }
        super.destroy();
    }
}
