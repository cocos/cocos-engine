/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
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
'use strict';

const AudioPlayer = cc.internal.AudioPlayer;
if (AudioPlayer) {
    const { PlayingState, AudioType } = cc.AudioClip;

    cc.AudioClip.prototype._getPlayer = function (clip) {
        this._loadMode = AudioType.JSB_AUDIO;
        return AudioPlayerJSB;
    };

    let rt = loadRuntime();
    class AudioPlayerJSB extends AudioPlayer {
        constructor (info) {
            super(info);
            this._startTime = 0;
            this._offset = 0;
            this._volume = 1;
            this._loop = false;
            this._url = info.nativeAudio;
            this._audio = -1;
            this._onEnded = this._onEnded.bind(this);
        }

        play () {
            if (this._state === PlayingState.PLAYING) { return; }
            if (this._blocking) { this._interrupted = true; return; }
            this._doPlay();
            // delay eval here to yield uniform behavior with other platforms
            cc.director.once(cc.Director.EVENT_AFTER_UPDATE, this._onPlay, this);
        }

        pause () {
            if (this._audio < 0) { return; }
            this._interrupted = false;
            if (this._state !== PlayingState.PLAYING) { return; }
            jsb.AudioEngine.pause(this._audio);
            this._onPause();
        }

        stop () {
            if (this._audio < 0) { return; }
            this._interrupted = false;
            jsb.AudioEngine.stop(this._audio);
            this._audio = -1;
            this._onStop();
        }

        playOneShot (volume) {
            if (volume === undefined) { volume = 1; }
            jsb.AudioEngine.play(this._url, false, volume);
        }

        getCurrentTime () {
            if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
            let current = (performance.now() - this._startTime + this._offset) / 1000;
            while (current > this._duration) {
                if (this._loop) { current -= this._duration; this._startTime += this._duration * 1000; }
                else current = 0; // onEnded callback may lag behind a few frames
            }
            return current;
        }

        setCurrentTime (val) {
            if (this._audio < 0) { return; }
            val = cc.math.clamp(val, 0, this._duration);
            jsb.AudioEngine.setCurrentTime(this._audio, val);
            this._offset = val * 1000;
            this._startTime = performance.now();
        }

        getVolume () {
            return this._volume;
        }

        setVolume (val, immediate) {
            this._volume = val;
            if (this._audio >= 0) { jsb.AudioEngine.setVolume(this._audio, val); }
        }

        getLoop () {
            return this._loop;
        }

        setLoop (val) {
            this._loop = val;
            if (this._audio >= 0) { jsb.AudioEngine.setLoop(this._audio, val); }
        }

        destroy () {
            if (this._audio >= 0) { jsb.AudioEngine.uncache(this._url); this._audio = -1; }
            super.destroy();
        }

        _doPlay () {
            if (this._audio >= 0) jsb.AudioEngine.resume(this._audio);
            else {
                this._audio = jsb.AudioEngine.play(this._url, this._loop, this._volume);
                jsb.AudioEngine.setErrorCallback(this._audio, console.error);
                jsb.AudioEngine.setFinishCallback(this._audio, this._onEnded);
            }
        }

        _onPlay () {
            if (this._state === PlayingState.PLAYING) { return; }
            this._state = PlayingState.PLAYING;
            this._startTime = performance.now();
            this._clip.emit('started');
        }

        _onPause () {
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._offset += performance.now() - this._startTime;
        }

        _onStop () {
            this._offset = 0;
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
        }

        _onEnded () {
            this._offset = 0;
            this._audio = -1;
            if (this._state === PlayingState.STOPPED) { return; }
            this._state = PlayingState.STOPPED;
            this._clip.emit('ended');
        }
    }
}
