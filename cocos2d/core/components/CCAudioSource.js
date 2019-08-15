/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const misc = require('../utils/misc');
const Component = require('./CCComponent');
const AudioClip = require('../assets/CCAudioClip');

/**
 * !#en Audio Source.
 * !#zh 音频源组件，能对音频剪辑。
 * @class AudioSource
 * @extends Component
 */
var AudioSource = cc.Class({
    name: 'cc.AudioSource',
    extends: Component,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/AudioSource',
        help: 'i18n:COMPONENT.help_url.audiosource',
    },

    ctor: function () {
        // We can't require Audio here because jsb Audio is implemented outside the engine,
        // it can only take effect rely on overwriting cc.Audio
        this.audio = new cc.Audio();
    },

    properties: {
        _clip: {
            default: null,
            type: AudioClip
        },
        _volume: 1,
        _mute: false,
        _loop: false,
        _pausedFlag: {
            default: false,
            serializable: false
        },

        /**
         * !#en
         * Is the audio source playing (Read Only). <br/>
         * Note: isPlaying is not supported for Native platforms.
         * !#zh
         * 该音频剪辑是否正播放（只读）。<br/>
         * 注意：Native 平台暂时不支持 isPlaying。
         * @property isPlaying
         * @type {Boolean}
         * @readOnly
         * @default false
         */
        isPlaying: {
            get: function () {
                var state = this.audio.getState();
                return state === cc.Audio.State.PLAYING;
            },
            visible: false
        },

        /**
         * !#en The clip of the audio source to play.
         * !#zh 要播放的音频剪辑。
         * @property clip
         * @type {AudioClip}
         * @default 1
         */
        clip: {
            get: function () {
                return this._clip;
            },
            set: function (value) {
                if (typeof value === 'string') {
                    // backward compatibility since 1.10
                    cc.warnID(8401, 'cc.AudioSource', 'cc.AudioClip', 'AudioClip', 'cc.AudioClip', 'audio');
                    let self = this;
                    AudioClip._loadByUrl(value, {isNative: true}, null, function (err, clip) {
                        if (clip) {
                            self.clip = clip;
                        }
                    });
                    return;
                }

                if (value === this._clip) {
                    return;
                }
                this._clip = value;
                this.audio.stop();
                if (this.preload) {
                    this.audio.src = this._clip;
                }
            },
            type: AudioClip,
            tooltip: CC_DEV && 'i18n:COMPONENT.audio.clip',
            animatable: false
        },

        /**
         * !#en The volume of the audio source.
         * !#zh 音频源的音量（0.0 ~ 1.0）。
         * @property volume
         * @type {Number}
         * @default 1
         */
        volume: {
            get: function () {
                return this._volume;
            },
            set: function (value) {
                value = misc.clamp01(value);
                this._volume = value;
                if (!this._mute) {
                    this.audio.setVolume(value);
                }
                return value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.audio.volume'
        },

        /**
         * !#en Is the audio source mute?
         * !#zh 是否静音音频源。Mute 是设置音量为 0，取消静音是恢复原来的音量。
         * @property mute
         * @type {Boolean}
         * @default false
         */
        mute: {
            get: function () {
                return this._mute;
            },
            set: function (value) {
                this._mute = value;
                this.audio.setVolume(value ? 0 : this._volume);
                return value;
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.audio.mute',
        },

        /**
         * !#en Is the audio source looping?
         * !#zh 音频源是否循环播放？
         * @property loop
         * @type {Boolean}
         * @default false
         */
        loop: {
            get: function () {
                return this._loop;
            },
            set: function (value) {
                this._loop = value;
                this.audio.setLoop(value);
                return value;
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.audio.loop'
        },

        /**
         * !#en If set to true, the audio source will automatically start playing on onEnable.
         * !#zh 如果设置为 true，音频源将在 onEnable 时自动播放。
         * @property playOnLoad
         * @type {Boolean}
         * @default true
         */
        playOnLoad: {
            default: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.audio.play_on_load',
            animatable: false
        },

        preload: {
            default: false,
            animatable: false
        }
    },

    _ensureDataLoaded () {
        if (this.audio.src !== this._clip) {
            this.audio.src = this._clip;
        }
    },

    _pausedCallback: function () {
        var state = this.audio.getState();
        if (state === cc.Audio.State.PLAYING) {
            this.audio.pause();
            this._pausedFlag = true;
        }
    },

    _restoreCallback: function () {
        if (this._pausedFlag) {
            this.audio.resume();
        }
        this._pausedFlag = false;
    },

    onLoad: function () {
        this.audio.setVolume(this._mute ? 0 : this._volume);
        this.audio.setLoop(this._loop);
    },

    onEnable: function () {
        if (this.preload) {
            this.audio.src = this._clip;
        }
        if (this.playOnLoad) {
            this.play();
        }
        cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);
    },

    onDisable: function () {
        this.stop();
        cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);
    },

    onDestroy: function () {
        this.stop();
        this.audio.destroy();
        cc.audioEngine.uncache(this._clip);
    },

    /**
     * !#en Plays the clip.
     * !#zh 播放音频剪辑。
     * @method play
     */
    play: function () {
        if ( !this._clip ) return;

        var audio = this.audio;
        if (this._clip.loaded) {
            audio.stop();
        }
        this._ensureDataLoaded();
        audio.setCurrentTime(0);
        audio.play();
    },

    /**
     * !#en Stops the clip.
     * !#zh 停止当前音频剪辑。
     * @method stop
     */
    stop: function () {
        this.audio.stop();
    },

    /**
     * !#en Pause the clip.
     * !#zh 暂停当前音频剪辑。
     * @method pause
     */
    pause: function () {
        this.audio.pause();
    },

    /**
     * !#en Resume the clip.
     * !#zh 恢复播放。
     * @method resume
     */
    resume: function () {
        this._ensureDataLoaded();
        this.audio.resume();
    },

    /**
     * !#en Rewind playing music.
     * !#zh 从头开始播放。
     * @method rewind
     */
    rewind: function(){
        this.audio.setCurrentTime(0);
    },

    /**
     * !#en Get current time
     * !#zh 获取当前的播放时间
     * @method getCurrentTime
     * @return {Number}
     */
    getCurrentTime: function () {
        return this.audio.getCurrentTime();
    },

    /**
     * !#en Set current time
     * !#zh 设置当前的播放时间
     * @method setCurrentTime
     * @param {Number} time
     * @return {Number}
     */
    setCurrentTime: function (time) {
        this.audio.setCurrentTime(time);
        return time;
    },

    /**
     * !#en Get audio duration
     * !#zh 获取当前音频的长度
     * @method getDuration
     * @return {Number}
     */
    getDuration: function () {
        return this.audio.getDuration();
    }

});

cc.AudioSource = module.exports = AudioSource;
