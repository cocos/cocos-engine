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

const { loadInnerAudioContext } = require('./download-audio');

const AudioPlayer = cc.internal.AudioPlayer;
if (AudioPlayer) {
    const { PlayingState, AudioType } = cc.AudioClip;
    const AudioManager = cc.internal.AudioManager;
    AudioManager.maxAudioChannel = 10;

    class AudioManagerMiniGame extends AudioManager {
        discardOnePlayingIfNeeded() {
            if (this._playingAudios.length < AudioManager.maxAudioChannel) {
                return;
            }

            // a played audio has a higher priority than a played shot
            let audioToDiscard;
            let oldestOneShotIndex = this._playingAudios.findIndex(audio => !(audio instanceof AudioPlayerRuntime));
            if (oldestOneShotIndex > -1) {
                audioToDiscard = this._playingAudios[oldestOneShotIndex];
                this._playingAudios.splice(oldestOneShotIndex, 1);
            }
            else {
                audioToDiscard = this._playingAudios.shift();
            }
            if (audioToDiscard) {
                audioToDiscard.stop();
            }
        }
    }

    cc.AudioClip.prototype._getPlayer = function (clip) {
        this._loadMode = AudioType.JSB_AUDIO;
        return AudioPlayerRuntime;
    };

    class AudioPlayerRuntime extends AudioPlayer {
        static _manager = new AudioManagerMiniGame();
        _startTime = 0;
        _offset = 0;
        _volume = 1;
        _loop = false;

        constructor (info) {
            super(info);
            this._nativeAudio = info.nativeAudio;

            this._nativeAudio.onPlay(() => {
                if (this._state === PlayingState.PLAYING) { return; }
                this._state = PlayingState.PLAYING;
                this._startTime = performance.now();
                this._clip.emit('started');
            });
            this._nativeAudio.onPause(() => {
                if (this._state === PlayingState.STOPPED) { return; }
                this._state = PlayingState.STOPPED;
                this._offset += performance.now() - this._startTime;
            });
            this._nativeAudio.onStop(() => {
                if (this._state === PlayingState.STOPPED) { return; }
                this._state = PlayingState.STOPPED;
                this._offset = 0;
            });
            this._nativeAudio.onEnded(() => {
                if (this._state === PlayingState.STOPPED) { return; }
                this._state = PlayingState.STOPPED;
                this._offset = 0;
                this._clip.emit('ended');
                AudioPlayerRuntime._manager.removePlaying(this);
            });
            this._nativeAudio.onError(function (res) { return console.error(res.errMsg);});
        }

        play () {
            if (!this._nativeAudio) { return; }
            if (this._blocking) { this._interrupted = true; return; }
            if (this._state === PlayingState.PLAYING) {
                /* sometimes there is no way to update the playing state
                especially when player unplug earphones and the audio automatically stops
                so we need to force updating the playing state by pausing audio */
                this.pause();
                // restart if already playing
                this.setCurrentTime(0);
            }
            AudioPlayerRuntime._manager.discardOnePlayingIfNeeded();
            this._nativeAudio.play();
            AudioPlayerRuntime._manager.addPlaying(this);
        }

        pause () {
            if (!this._nativeAudio || this._state !== PlayingState.PLAYING) { return; }
            this._nativeAudio.pause();
            AudioPlayerRuntime._manager.removePlaying(this._clip);
        }

        stop () {
            if (!this._nativeAudio) { return; }
            this._nativeAudio.stop();
            AudioPlayerRuntime._manager.removePlaying(this._clip);
        }

        playOneShot (volume) {
            loadInnerAudioContext(this._nativeAudio.src).then(innerAudioContext => {
                AudioPlayerRuntime._manager.discardOnePlayingIfNeeded();
                innerAudioContext.volume = volume;
                innerAudioContext.play();
                AudioPlayerRuntime._manager.addPlaying(innerAudioContext);
                innerAudioContext.onEnded(() => {
                    AudioPlayerRuntime._manager.removePlaying(innerAudioContext);
                });
            });
        }

        getCurrentTime () {
            if (this._state !== PlayingState.PLAYING) { return this._offset / 1000; }
            let current = (performance.now() - this._startTime + this._offset) / 1000;
            if (current > this._duration) {
                if (!this._loop) return 0;
                current -= this._duration; this._startTime += this._duration * 1000;
            }
            return current;
        }

        setCurrentTime (val) {
            if (!this._nativeAudio) { return; }
            this._offset = cc.math.clamp(val, 0, this._duration) * 1000;
            this._startTime = performance.now();
            this._nativeAudio.seek(val);
        }

        getVolume () {
            return this._volume;
        }

        setVolume (val, immediate) {
            this._volume = val;
            if (this._nativeAudio) { this._nativeAudio.volume = val; }
        }

        getLoop () {
            return this._loop;
        }

        setLoop (val) {
            this._loop = val;
            if (this._nativeAudio) { this._nativeAudio.loop = val; }
        }

        destroy () {
            if (this._nativeAudio) { this._nativeAudio.destroy(); }
            super.destroy();
        }
    }
}
