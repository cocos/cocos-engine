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

import { AudioPlayer, IAudioInfo, PlayingState } from './player';

/**
 * The main lesson learnt during the porting is,
 * be very careful with the getter methods on InnerAudioContext,
 * serious performance issue have been encountered when accessed frequently.
 * For now this includes duration, current time and volume,
 * so those are all maintained manually here.
 */
export class AudioPlayerWX extends AudioPlayer {
    protected _startTime = 0;
    protected _offset = 0;
    protected _volume = 1;
    protected _loop = false;
    protected _oneShoting = false;
    protected _audio: InnerAudioContext;

    private _pauseFn: Function;
    private _playFn: Function;
    private _interrupted = false;

    constructor (info: IAudioInfo) {
        super(info);
        this._audio = info.clip;
        this._audio.onPlay(() => {
            if (this._state === PlayingState.PLAYING) { return; }
            this._state = PlayingState.PLAYING;
            this._startTime = performance.now();
            this._eventTarget.emit('started');
        });
        this._audio.onPause(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset += performance.now() - this._startTime;
        });
        this._audio.onStop(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            if (this._oneShoting) {
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }
        });
        this._audio.onEnded(() => {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset = 0;
            this._eventTarget.emit('ended');
            if (this._oneShoting) {
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }
        });
        this._audio.onError((res: any) => console.error(res.errMsg));
        this._pauseFn = () => {
            if (this._state !== PlayingState.PLAYING) { return; }
            this.pause(); this._interrupted = true;
        };
        this._playFn = () => {
            if (!this._interrupted) { return; }
            this.play(); this._interrupted = false;
        };
        wx.onHide(this._pauseFn);
        wx.onShow(this._playFn);
        wx.onAudioInterruptionBegin(this._pauseFn);
        wx.onAudioInterruptionEnd(this._playFn);
    }

    public play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        this._audio.play();
    }

    public pause () {
        if (!this._audio || this._state !== PlayingState.PLAYING) { return; }
        this._audio.pause();
    }

    public stop () {
        if (!this._audio) { return; }
        this._audio.stop();
    }

    public playOneShot (volume = 1) {
        /* InnerAudioContext doesn't support multiple playback at the
           same time so here we fall back to re-start style approach */
        if (!this._audio) { return; }
        this._offset = 0;
        this._audio.seek(0);
        this._audio.volume = volume;
        if (this._oneShoting) { return; }
        this._audio.loop = false;
        this._oneShoting = true;
        this._audio.play();
    }

    public getCurrentTime () {
        if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
        let current = (performance.now() - this._startTime + this._offset) / 1000;
        if (current > this._duration) { current -= this._duration; this._startTime += this._duration * 1000; }
        return current;
    }

    public setCurrentTime (val: number) {
        if (!this._audio) { return; }
        this._startTime = performance.now();
        this._offset = val * 1000;
        this._audio.seek(val);
    }

    public getVolume () {
        return this._volume;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        if (this._audio) { this._audio.volume = val; }
    }

    public getLoop () {
        return this._loop;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        if (this._audio) { this._audio.loop = val; }
    }

    public destroy () {
        if (this._audio) { this._audio.destroy(); }
        wx.offHide(this._pauseFn);
        wx.offShow(this._playFn);
        wx.offAudioInterruptionBegin(this._pauseFn);
        wx.offAudioInterruptionEnd(this._playFn);
    }
}
