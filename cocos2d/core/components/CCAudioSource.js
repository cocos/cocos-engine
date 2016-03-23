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
 * Audio Source.
 * @class AudioSource
 * @extends Component
 */

var audioEngine = cc.audioEngine;

var AudioSource = cc.Class({
    name: 'cc.AudioSource',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/AudioSource',
        help: 'app://docs/html/components/audiosource.html',
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
         * Is the audio source playing (Read Only)
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
         * The clip of the audio source.
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
         * The volume of the audio source.
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
         * Is the audio source mute?
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
                        if (cc.sys.isNative) {
                            cc.audioEngine.setEffectsVolume(0);
                        }
                        else {
                            this.audio.setVolume(0);
                        }
                    }
                    else {
                        if (cc.sys.isNative) {
                            cc.audioEngine.setEffectsVolume(this._volume);
                        }
                        else {
                            this.audio.setVolume(this._volume);
                        }
                    }
                }
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.audio.mute',
        },

        /**
         * Is the audio source looping?
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
         * If set to true, the audio source will automatically start playing on onLoad.
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

    onLoad: function () {
        if ( this.isPlaying ) {
            this.stop();
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
     * Plays the clip.
     * @method play
     */
    play: function () {
        if ( this._clip ) {
            this.audio = audioEngine.playEffect(this._clip, this._loop);
            // this.audio.play();
        }
    },

    /**
     * Stops the clip
     * @method stop
     */
    stop: function () {
        if ( this.audio ) cc.audioEngine.stopEffect(this.audio);
    },

    /**
     * Pause the clip.
     * @method pause
     */
    pause: function () {
        if ( this.audio ) cc.audioEngine.pauseEffect(this.audio);
    },

    /**
     * Resume the clip.
     * @method resume
     */
    resume: function () {
        if ( this.audio ) cc.audioEngine.resumeEffect(this.audio);
    },

    /**
     * Rewind playing music.
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
