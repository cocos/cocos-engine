const AudioPlayer = cc.internal.AudioPlayer;
if (AudioPlayer) {
    const { PlayingState, AudioType } = cc.AudioClip;
    const AudioManager = cc.internal.AudioManager;
    AudioManager.maxAudioChannel = 10;

    function loadInnerAudioContext (url) {
        return new Promise((resolve, reject) => {
            const nativeAudio = __globalAdapter.createInnerAudioContext();

            let timer = setTimeout(() => {
                clearEvent();
                resolve(nativeAudio);
            }, 8000);
            function clearEvent () {
                nativeAudio.offCanplay(success);
                nativeAudio.offError(fail);
            }
            function success () {
                clearEvent();
                clearTimeout(timer);
                resolve(nativeAudio);
            }
            function fail () {
                clearEvent();
                clearTimeout(timer);
                reject('failed to load innerAudioContext: ' + err);
            }
            nativeAudio.onCanplay(success);
            nativeAudio.onError(fail);
            nativeAudio.src = url;
        });
    }

    class AudioManagerMiniGame extends AudioManager {
        discardOnePlayingIfNeeded() {
            if (this._playingAudios.length < AudioManager.maxAudioChannel) {
                return;
            }

            // a played audio has a higher priority than a played shot
            let audioToDiscard;
            let oldestOneShotIndex = this._playingAudios.findIndex(audio => !(audio instanceof AudioPlayerMiniGame));
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
        return AudioPlayerMiniGame;
    };

    class AudioPlayerMiniGame extends AudioPlayer {
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
                AudioPlayerMiniGame._manager.removePlaying(this);
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
            AudioPlayerMiniGame._manager.discardOnePlayingIfNeeded();
            this._nativeAudio.play();
            AudioPlayerMiniGame._manager.addPlaying(this);
        }

        pause () {
            if (!this._nativeAudio || this._state !== PlayingState.PLAYING) { return; }
            this._nativeAudio.pause();
            AudioPlayerMiniGame._manager.removePlaying(this._clip);
        }

        stop () {
            if (!this._nativeAudio) { return; }
            this._nativeAudio.stop();
            AudioPlayerMiniGame._manager.removePlaying(this._clip);
        }

        playOneShot (volume) {
            loadInnerAudioContext(this._nativeAudio.src).then(innerAudioContext => {
                AudioPlayerMiniGame._manager.discardOnePlayingIfNeeded();
                innerAudioContext.volume = volume;
                innerAudioContext.play();
                AudioPlayerMiniGame._manager.addPlaying(innerAudioContext);
                innerAudioContext.onEnded(() => {
                    AudioPlayerMiniGame._manager.removePlaying(innerAudioContext);
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
