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

import { _decorator } from '../../../core/data/index';
const { ccclass } = _decorator;
import { AudioPlayer, IAudioInfo, PlayingState } from './player';

@ccclass('cc.AudioPlayerWX')
export class AudioPlayerWX extends AudioPlayer {
    protected _volume = 1;
    protected _loop = false;
    protected _oneShoting = false;
    protected _audio: InnerAudioContext;

    constructor (info: IAudioInfo) {
        super(info);
        this._audio = info.clip;
        this._audio.obeyMuteSwitch = false;
        this._audio.onPlay(() => {
            this._state = PlayingState.PLAYING;
            this._eventTarget.emit('started');
        });
        this._audio.onPause(() => {
            this._state = PlayingState.STOPPED;
            this._oneShoting = false;
        });
        this._audio.onStop(() => {
            this._state = PlayingState.STOPPED;
            this._oneShoting = false;
        });
        this._audio.onEnded(() => {
            this._state = PlayingState.STOPPED;
            this._eventTarget.emit('ended');
            if (this._oneShoting) {
                this._audio.volume = this._volume;
                this._audio.loop = this._loop;
                this._oneShoting = false;
            }
        });
        wx.onShow(() => this._audio.play());
        wx.onAudioInterruptionEnd(() => this._audio.play());
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
        this._audio.volume = volume;
        if (this._oneShoting) { return; }
        this._audio.loop = false;
        this._oneShoting = true;
        this._audio.play();
    }

    public getCurrentTime () {
        return this._audio ? this._audio.currentTime : 0;
    }

    public setCurrentTime (val: number) {
        if (!this._audio) { return; }
        this._audio.seek(val);
    }

    public getDuration () {
        return this._audio ? this._audio.duration : 0;
    }

    public getVolume () {
        return this._audio ? this._audio.volume : this._volume;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        if (this._audio && this._audio.volume !== undefined) { this._audio.volume = val; }
    }

    public getLoop () {
        return this._loop;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        if (this._audio) { this._audio.loop = val; }
    }

    public destroy () {
        if (this._audio) { this._audio.destroy(); return true; }
        return false;
    }
}

cc.AudioPlayerWX = AudioPlayerWX;
