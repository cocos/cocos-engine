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
 * @packageDocumentation
 * @module component/audio
 */

import { clamp } from '../../core/math/utils';
import { AudioPlayer, IAudioInfo, PlayingState } from './player';
import { legacyCC } from '../../core/global-exports';
import { AudioClip } from './clip';

export class AudioPlayerDOM extends AudioPlayer {
    protected _volume = 1;
    protected _loop = false;
    protected _nativeAudio: HTMLAudioElement;
    protected _cbRegistered = false;

    private _remove_cb: () => void;
    private _post_play: () => void;
    private _on_gesture: () => void;
    private _post_gesture: () => void;

    constructor (info: IAudioInfo) {
        super(info);
        this._nativeAudio = info.nativeAudio;

        this._remove_cb = () => {
            if (!this._cbRegistered) { return; }
            legacyCC.game.canvas.removeEventListener('touchend', this._on_gesture);
            legacyCC.game.canvas.removeEventListener('mouseup', this._on_gesture);
            this._cbRegistered = false;
        };

        this._post_play = () => {
            this._state = PlayingState.PLAYING;
            this._clip.emit('started');
            this._remove_cb(); // should remove callbacks after any success play
        };

        this._post_gesture = () => {
            if (this._interrupted) { this._post_play(); this._interrupted = false; }
            else { this._nativeAudio!.pause(); this._nativeAudio!.currentTime = 0; }
        };

        this._on_gesture = () => {
            if (!this._nativeAudio) { return; }
            const promise = this._nativeAudio.play();
            if (!promise) { // Chrome50/Firefox53 below
                // delay eval here to yield uniform behavior with other platforms
                this._state = PlayingState.PLAYING;
                legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_gesture);
                return;
            }
            promise.then(this._post_gesture);
            this._remove_cb();
        };

        this._nativeAudio.volume = this._volume;
        this._nativeAudio.loop = this._loop;
        // callback on audio ended
        this._nativeAudio.addEventListener('ended', () => {
            this._state = PlayingState.STOPPED;
            this._nativeAudio!.currentTime = 0;
            this._clip.emit('ended');
        });
        /* play & stop immediately after receiving a gesture so that
           we can freely invoke play() outside event listeners later */
        legacyCC.game.canvas.addEventListener('touchend', this._on_gesture);
        legacyCC.game.canvas.addEventListener('mouseup', this._on_gesture);
        this._cbRegistered = true;
    }

    public play () {
        if (!this._nativeAudio || this._state === PlayingState.PLAYING) { return; }
        if (this._blocking) { this._interrupted = true; return; }
        const promise = this._nativeAudio.play();
        if (!promise) {
            // delay eval here to yield uniform behavior with other platforms
            this._state = PlayingState.PLAYING;
            legacyCC.director.once(legacyCC.Director.EVENT_AFTER_UPDATE, this._post_play);
            return;
        }
        promise.then(this._post_play).catch(() => { this._interrupted = true; });
    }

    public pause () {
        if (!this._nativeAudio) { return; }
        this._interrupted = false;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._nativeAudio.pause();
        this._state = PlayingState.STOPPED;
    }

    public stop () {
        if (!this._nativeAudio) { return; }
        this._nativeAudio.currentTime = 0; this._interrupted = false;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._nativeAudio.pause();
        this._state = PlayingState.STOPPED;
    }

    public setCurrentTime (val: number) {
        if (!this._nativeAudio) { return; }
        this._nativeAudio.currentTime = clamp(val, 0, this._duration);
    }

    public getCurrentTime () {
        return this._nativeAudio ? this._nativeAudio.currentTime : 0;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        /* note this won't work for ios devices, for there
           is just no way to set HTMLMediaElement's volume */
        if (this._nativeAudio) { this._nativeAudio.volume = val; }
    }

    public getVolume () {
        if (this._nativeAudio) { return this._nativeAudio.volume; }
        return this._volume;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        if (this._nativeAudio) { this._nativeAudio.loop = val; }
    }

    public getLoop () {
        return this._loop;
    }

    public clone (): Promise<AudioClip> {
        return new Promise((resolve, reject) => {
            createDomAudio(this._nativeAudio.src).then(dom => {
                let clip = new AudioClip();
                clip._nativeAsset = dom;
                resolve(clip);
            }, errMsg => {
                log(errMsg);
            });
        });
    }

    public destroy () {
        if (this._nativeAudio) { this._nativeAudio.src = ''; }
        super.destroy();
    }
}
