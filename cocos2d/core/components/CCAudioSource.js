/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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
 * @class AudioScource
 * @extends Component
 */

var audioEngine = cc.audioEngine;

var AudioSource = cc.Class({
    name: 'cc.AudioSource',
    extends: require('./CCComponent'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/AudioSource'
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
                return (this.audio && this.audio.getPlaying());
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
            tooltip: 'i18n.COMPONENT.audio.clip',
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
                if (this.audio) this.audio.setVolume(value);
            },
            tooltip: 'i18n.COMPONENT.audio.volume'
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
                        this.audio.setVolume(0);
                    }
                    else {
                        this.audio.setVolume(this._volume);
                    }
                }
            },
            tooltip: 'i18n.COMPONENT.audio.mute'
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
            tooltip: 'i18n.COMPONENT.audio.loop'
        },

        /**
         * If set to true, the audio source will automatically start playing on onLoad.
         * @property playOnLoad
         * @type {Boolean}
         * @default true
         */
        playOnLoad: {
            default: false,
            tooltip: 'i18n.COMPONENT.audio.play_on_load'
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
            this.audio.play()
        }
    },

    /**
     * Stops the clip
     * @method stop
     */
    stop: function () {
        if ( this.audio ) this.audio.stop();
    },

    /**
     * Pause the clip.
     * @method pause
     */
    pause: function () {
        if ( this.audio ) this.audio.pause();
    },

    /**
     * Resume the clip.
     * @method resume
     */
    resume: function () {
        if ( this.audio ) this.audio.resume();
    },

    /**
     * Rewind playing music.
     * @method rewind
     */
    rewind: function(){
        if ( this.audio ) {
            this.audio.stop();
            this.audio.play();
        }
    },

});

cc.AudioSource = module.exports = AudioSource;
