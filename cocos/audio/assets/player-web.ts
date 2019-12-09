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
import sys from '../../core/platform/sys';
import { AudioPlayer, IAudioInfo, PlayingState } from './player';

const audioSupport = sys.__audioSupport;

export class AudioPlayerWeb extends AudioPlayer {
    protected _startTime = 0;
    protected _offset = 0;
    protected _volume = 1;
    protected _loop = false;
    protected _currentTimer = 0;
    protected _audio: AudioBuffer;

    private _context: AudioContext;
    private _sourceNode: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _on_ended: () => void;
    private _do_play: () => void;
    private _on_gesture: () => void;

    constructor (info: IAudioInfo) {
        super(info);
        this._audio = info.clip;

        this._context = audioSupport.context;
        this._sourceNode = this._context.createBufferSource();
        this._gainNode = this._context.createGain();
        this._gainNode.connect(this._context.destination);

        this._on_ended = () => {
            this._offset = 0;
            this._startTime = this._context.currentTime;
            if (this._sourceNode.loop) { return; }
            this._eventTarget.emit('ended');
            this._state = PlayingState.STOPPED;
        };

        this._do_play = () => {
            this._state = PlayingState.PLAYING;
            this._sourceNode = this._context.createBufferSource();
            this._sourceNode.buffer = this._audio;
            this._sourceNode.loop = this._loop;
            this._sourceNode.connect(this._gainNode);
            this._startTime = this._context.currentTime;
            // delay eval here to yield uniform behavior with other platforms
            cc.director.once(cc.Director.EVENT_AFTER_UPDATE, () => {
                this._sourceNode.start(0, this._offset);
                this._eventTarget.emit('started');
            });
            /* still not supported by all platforms *
            this._sourceNode.onended = this._on_ended;
            /* doing it manually for now */
            clearInterval(this._currentTimer);
            this._currentTimer = window.setInterval(() => {
                this._on_ended();
                clearInterval(this._currentTimer);
                if (this._sourceNode.loop) {
                    this._currentTimer = window.setInterval(this._on_ended, this._audio.duration * 1000);
                }
            }, (this._audio.duration - this._offset) * 1000);
        };

        this._on_gesture = () => {
            this._context.resume().then(() => {
                if (this._interrupted) { this._do_play(); this._interrupted = false; }
                cc.game.canvas.removeEventListener('touchend', this._on_gesture);
                cc.game.canvas.removeEventListener('mouseup', this._on_gesture);
            });
        };
        // Chrome41/Firefox40 below don't have resume
        if (this._context.state !== 'running' && this._context.resume) {
            cc.game.canvas.addEventListener('touchend', this._on_gesture);
            cc.game.canvas.addEventListener('mouseup', this._on_gesture);
        }
    }

    public play () {
        if (!this._audio || this._state === PlayingState.PLAYING) { return; }
        if (this._blocking || this._context.state !== 'running') { this._interrupted = true; return; }
        this._do_play();
    }

    public pause () {
        if (this._state !== PlayingState.PLAYING) { return; }
        this._sourceNode.stop();
        this._offset += this._context.currentTime - this._startTime;
        this._state = PlayingState.STOPPED;
        clearInterval(this._currentTimer);
    }

    public stop () {
        this._offset = 0;
        if (this._state !== PlayingState.PLAYING) { return; }
        this._sourceNode.stop();
        this._state = PlayingState.STOPPED;
        clearInterval(this._currentTimer);
    }

    public playOneShot (volume = 1) {
        if (!this._audio) { return; }
        const gainNode = this._context.createGain();
        gainNode.connect(this._context.destination);
        gainNode.gain.value = volume;
        const sourceNode = this._context.createBufferSource();
        sourceNode.buffer = this._audio;
        sourceNode.loop = false;
        sourceNode.connect(gainNode);
        sourceNode.start();
    }

    public setCurrentTime (val: number) {
        // throws InvalidState Error on some device if we don't do the clamp here
        // the serialized duration is not accurate, use the actual duration first
        this._offset = clamp(val, 0, this._audio && this._audio.duration || this._duration);
        if (this._state !== PlayingState.PLAYING) { return; }
        this._sourceNode.stop(); this._do_play();
    }

    public getCurrentTime () {
        if (this._state !== PlayingState.PLAYING) { return this._offset; }
        return this._context.currentTime - this._startTime + this._offset;
    }

    public setVolume (val: number, immediate: boolean) {
        this._volume = val;
        if (!immediate && this._gainNode.gain.setTargetAtTime) {
            this._gainNode.gain.setTargetAtTime(val, this._context.currentTime, 0.01);
        } else {
            this._gainNode.gain.value = val;
        }
    }

    public getVolume () {
        return this._volume;
    }

    public setLoop (val: boolean) {
        this._loop = val;
        this._sourceNode.loop = val;
    }

    public getLoop () {
        return this._loop;
    }

    public destroy () { super.destroy(); }
}
