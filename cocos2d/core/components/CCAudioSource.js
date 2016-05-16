/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en Audio Source.
 * !#zh 音频源组件，能对音频剪辑。
 * @class AudioSource
 * @extends Component
 */

// todo jsb 中无法针对单独的音效对象进行设置（如音量大小等）

var audioEngine = cc.audioEngine;

var AudioSource = cc.Class({
    name: 'cc.AudioSource',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/AudioSource',
        help: 'i18n:COMPONENT.help_url.audiosource',
    },

    ctor: function () {
        this.audio = null;
    },

    properties: {
        _clip: {
            default: '',
            url: cc.AudioClip
        },
        _volume: 1,
        _mute: false,
        _loop: false,

        /**
         * !#en Is the audio source playing (Read Only).
         * !#zh 该音频剪辑是否正播放（只读）。
         * @property isPlaying
         * @type {Boolean}
         * @readOnly
         * @default false
         */
        isPlaying: {
            get: function () {
                return (!cc.sys.isNative && this.audio && this.audio.getPlaying());
            },
            visible: false
        },

        /**
         * !#en The clip of the audio source.
         * !#zh 默认要播放的音频剪辑。
         * @property clip
         * @type {AudioClip}
         * @default 1
         */
        clip: {
            get: function () {
                return this._clip;
            },
            set: function (value) {
                this._clip = value;
            },
            url: cc.AudioClip,
            tooltip: 'i18n:COMPONENT.audio.clip',
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
                this._volume = value;
                if (this.audio) {
                    if (cc.sys.isNative) {
                        cc.audioEngine.setEffectsVolume(value);
                    }
                    else {
                        this.audio.setVolume(value);
                    }
                }
            },
            tooltip: 'i18n:COMPONENT.audio.volume'
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
                if (this.audio) {
                    if (this._mute) {
                        if (CC_JSB) {
                            cc.audioEngine.setEffectsVolume(0);
                        } else {
                            this.audio.setVolume(0);
                        }
                    } else {
                        if (CC_JSB) {
                            cc.audioEngine.setEffectsVolume(this._volume);
                        } else {
                            this.audio.setVolume(this._volume);
                        }
                    }
                }
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.audio.mute',
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
                if (this.audio) this.audio.loop = this._loop;
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.audio.loop'
        },

        /**
         * !#en If set to true, the audio source will automatically start playing on onLoad.
         * !#zh 如果设置为true，音频源将在 onLoad 时自动播放。
         * @property playOnLoad
         * @type {Boolean}
         * @default true
         */
        playOnLoad: {
            default: false,
            tooltip: 'i18n:COMPONENT.audio.play_on_load',
            animatable: false
        }
    },

    onEnable: function () {
        if ( this.playOnLoad ) {
            this.play();
        }
    },

    onDisable: function () {
        this.stop();
    },

    onDestroy: function () {
        this.stop();
    },

    /**
     * !#en Plays the clip.
     * !#zh 播放音频剪辑。
     * @method play
     */
    play: function () {
        if ( this._clip ) {
            var volume = this._mute ? 0 : this._volume;
            this.audio = audioEngine.playEffect(this._clip, this._loop, volume);

            if (CC_JSB) {
                cc.audioEngine.setEffectsVolume(volume);
            }
        }
    },

    /**
     * !#en Stops the clip.
     * !#zh 停止当前音频剪辑。
     * @method stop
     */
    stop: function () {
        if ( this.audio ) cc.audioEngine.stopEffect(this.audio);
    },

    /**
     * !#en Pause the clip.
     * !#zh 暂停当前音频剪辑。
     * @method pause
     */
    pause: function () {
        if ( this.audio ) cc.audioEngine.pauseEffect(this.audio);
    },

    /**
     * !#en Resume the clip.
     * !#zh 恢复播放。
     * @method resume
     */
    resume: function () {
        if ( this.audio ) cc.audioEngine.resumeEffect(this.audio);
    },

    /**
     * !#en Rewind playing music.
     * !#zh 从头开始播放。
     * @method rewind
     */
    rewind: function(){
        if ( this.audio ) {
            cc.audioEngine.stopEffect(this.audio);
            cc.audioEngine.playEffect(this.audio);
        }
    },

});

cc.AudioSource = module.exports = AudioSource;
