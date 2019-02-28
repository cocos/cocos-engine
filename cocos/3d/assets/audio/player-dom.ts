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

import { AudioPlayer, IAudioInfo, PlayingState } from './player';

export class AudioPlayerDOM extends AudioPlayer {
    protected _volume = 1;
    protected _loop = false;
    protected _currentTimer = 0;
    protected _oneShoting = false;
    protected _audio: HTMLAudioElement;

    private _post_play: () => void;
    private _on_gesture: () => void;
    private _alreadyDelayed = false;

    constructor (info: IAudioInfo) {
        super(info);
        this._audio = info.clip;

        this._post_play = () => {
            this._state = PlayingState.PLAYING;
            this._eventTarget.emit('started');
        };

        this._on_gesture = () => {
            if (!this._audio) { return; }
            const promise = this._audio.play();
            if (!promise) {
                console.warn('no promise returned from HTMLMediaElement.play()');
                return;
            }
            promise.then(() => {
                if (this._alreadyDelayed) { this._post_play(); }
                else { this._audio!.pause(); this._audio!.currentTime = 0; }
                window.removeEventListener('touchend', this._on_gesture);
                document.removeEventListener('mouseup', this._on_gesture);
            });
        };

        this._audio.volume = this._volume;
        this._audio.loop = this._loop;
        // callback on audio ended
        this._audio.addEventListener('ended', () => {
            if (this._oneShoting) { return; }
            this._state = PlayingState.STOPPED;
            this._audio!.currentTime = 0;
            this._eventTarget.emit('ended');
        });
        /* play & stop immediately after receiving a gesture so that
           we can freely invoke play() outside event listeners later */
        window.addEventListener('touchend', this._on_gesture);
        document.addEventListener('mouseup', this._on_gesture);
    }

    public play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        const promise = this._audio.play();
        if (!promise) {
            console.warn('no promise returned from HTMLMediaElement.play()');
            return;
        }
        promise.then(this._post_play).catch(() => { this._alreadyDelayed = true; });
    }

    public pause () {
        if (!this._audio || this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShoting = false;
    }

    public stop () {
        if (!this._audio) { return; }
        this._audio.currentTime = 0;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
        this._state = PlayingState.STOPPED;
        this._oneShoting = false;
    }

    public playOneShot (volume = 1) {
        /* HTMLMediaElement doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        const clip = this._audio;
        if (!clip) { return; }
        clip.currentTime = 0;
        clip.volume = volume;
        if (this._oneShoting) { return; }
        clip.loop = false;
        this._oneShoting = true;
        clip.play().then(() => {
            clip.addEventListener('ended', () => {
                clip.currentTime = 0;
                clip.volume = this._volume;
                clip.loop = this._loop;
                this._oneShoting = false;
            }, { once: true });
        }).catch(() => { this._oneShoting = false; });
    }

    public setCurrentTime (val: number) {
        if (!this._audio) { return; }
        this._audio.currentTime = val;
    }

    public getCurrentTime () {
        return this._audio ? this._audio.currentTime : 0;
    }

    public getDuration () {
        if (!this._audio) { return this._duration; }
        // ios wechat browser doesn't have duration
        return isNaN(this._audio.duration) ? this._duration : this._audio.duration;
    }

    public setVolume (val: number) {
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
}
