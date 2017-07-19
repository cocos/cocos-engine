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

var EventTarget = require('../core/event/event-target');

var touchBinded = false;
var touchPlayList = [
    //{ instance: Audio, offset: 0, audio: audio }
];

var Audio = function (src) {
    EventTarget.call(this);

    this._src = src;
    this._audioType = Audio.Type.UNKNOWN;
    this._element = null;

    this._eventList = {};
    this._state = Audio.State.INITIALZING;
    this._loaded = false;

    this._onended = function () {
        this.emit('ended');
    }.bind(this);
};

cc.js.extend(Audio, EventTarget);

Audio.Type = {
    DOM: 'AUDIO',
    WEBAUDIO: 'WEBAUDIO',
    NATIVE: 'NATIVE',
    UNKNOWN: 'UNKNOWN'
};

/**
 * !#en Audio state.
 * !#zh 声音播放状态
 * @enum audioEngine.AudioState
 * @memberof cc
 */

Audio.State = {
    /**
     * @property {Number} ERROR
     */
    ERROR : -1,
    /**
     * @property {Number} INITIALZING
     */
    INITIALZING: 0,
    /**
     * @property {Number} PLAYING
     */
    PLAYING: 1,
    /**
     * @property {Number} PAUSED
     */
    PAUSED: 2
};

(function (proto) {

    proto.preload = function () {
        var src = this._src, audio = this;

        if (!src) {
            this._src = '';
            this._audioType = Audio.Type.UNKNOWN;
            this._element = null;
            this._state = Audio.State.INITIALZING;
            this._loaded = false;
            return;
        }

        var item = cc.loader.getItem(src);

        if (!item) {
            item = cc.loader.getItem(src + '?useDom=1');
        }

        // If the resource does not exist
        if (!item) {
            return cc.loader.load(src, function (error) {
                if (!error) {
                    var item = cc.loader.getItem(src);
                    audio.mount(item.element || item.buffer);
                    audio.emit('load');
                }
            });
        } else if (item.complete) {
            audio.mount(item.element || item.buffer);
            audio.emit('load');
        }

        // current and  volume
    };

    proto._bindEnded = function (callback) {
        callback = callback || this._onended;
        if (this._audioType === Audio.Type.DOM) {
            this._element.addEventListener('ended', callback);
        } else {
            this._element.onended = callback;
        }
    };

    proto._unbindEnded = function () {
        if (this._audioType === Audio.Type.DOM) {
            this._element.removeEventListener('ended', this._onended);
        } else {
            this._element.onended = null;
        }
    };

    proto.mount = function (elem) {
        if (elem instanceof HTMLElement) {
            this._element = document.createElement('audio');
            this._element.src = elem.src;
            this._audioType = Audio.Type.DOM;
        } else {
            this._element = new WebAudioElement(elem, this);
            this._audioType = Audio.Type.WEBAUDIO;
        }
        this._bindEnded();
        this._state = Audio.State.INITIALZING;
        this._loaded = true;
    };

    proto.play = function () {
        if (!this._element) return;
        this._element.play();
        this.emit('play');
        this._state = Audio.State.PLAYING;

        if (this._audioType === Audio.Type.DOM && this._element.paused) {
            touchPlayList.push({ instance: this, offset: 0, audio: this._element });
        }

        if (touchBinded) return;
        touchBinded = true;

        // Listen to the touchstart body event and play the audio when necessary.
        cc.game.canvas.addEventListener('touchstart', function () {
            var item;
            while (item = touchPlayList.pop()) {
                item.audio.play(item.offset);
            }
        });
    };

    proto.pause = function () {
        if (!this._element) return;
        this._unbindEnded();
        this._element.pause();
        this.emit('pause');
        this._state = Audio.State.PAUSED;
    };

    proto.resume = function () {
        if (!this._element || this._element.currentTime === 0) return;
        this._bindEnded();
        this._element.play();
        this.emit('resume');
        this._state = Audio.State.PLAYING;
    };

    proto.stop = function () {
        if (!this._element) return;
        try {
            this._element.currentTime = 0;
        } catch (error) {}
        this._element.pause();
        // remove touchPlayList
        for (var i=0; i<touchPlayList; i++) {
            if (touchPlayList[i].instance === this) {
                touchPlayList.splice(i, 1);
                break;
            }
        }
        this.emit('ended');
        this.emit('stop');
        this._state = Audio.State.PAUSED;
    };

    proto.setLoop = function (loop) {
        if (!this._element) return;
        this._element.loop = loop;
    };
    proto.getLoop = function () {
        return this._element && this._element.loop;
    };

    proto.setVolume = function (num) {
        if (!this._element) return;
        this._element.volume = num;
    };
    proto.getVolume = function () {
        return this._element ? this._element.volume : 1;
    };

    proto.setCurrentTime = function (num) {
        if (!this._element) return;
        this._unbindEnded();
        this._bindEnded(function () {
            this._bindEnded();
        }.bind(this));
        try {
            this._element.currentTime = num;
        } catch (err) {
            var _element = this._element;
            if (_element.addEventListener) {
                var func = function () {
                    _element.removeEventListener('loadedmetadata', func);
                    _element.currentTime = num;
                };
                _element.addEventListener('loadedmetadata', func);
            }
        }
    };
    proto.getCurrentTime = function () {
        return this._element ? this._element.currentTime : 0;
    };

    proto.getDuration = function () {
        return this._element ? this._element.duration : 0;
    };

    proto.getState = function () {
        var elem = this._element;
        if (Audio.State.PLAYING === this._state && elem.paused) {
            this._state = Audio.State.PAUSED;
        }
        return this._state;
    };

    proto.__defineGetter__('src', function () {
        return this._src;
    });
    proto.__defineSetter__('src', function (string) {
        return this._src = string;
    });

    proto.__defineGetter__('paused', function () {
        return this._element ? this._element.paused : true;
    });

    // setFinishCallback

})(Audio.prototype);

// Encapsulated WebAudio interface
var WebAudioElement = function (buffer, audio) {
    this._audio = audio;
    this._context = cc.sys.__audioSupport.context;
    this._buffer = buffer;
    this._volume = this._context['createGain']();
    this._volume['gain'].value = 1;
    this._volume['connect'](this._context['destination']);
    this._loop = false;
    // The time stamp on the audio time axis when the recording begins to play.
    this._startTime = -1;
    // Record the currently playing 'Source'
    this._currentSource = null;
    // Record the time has been played
    this.playedLength = 0;

    this._currextTimer = null;

    this._endCallback = function () {
        if (this.onended) {
            this.onended(this);
        }
    }.bind(this);
};

(function (proto) {
    proto.play = function (offset) {
        // If repeat play, you need to stop before an audio
        if (this._currentSource && !this.paused) {
            this._currentSource.onended = null;
            this._currentSource.stop(0);
            this.playedLength = 0;
        }

        var audio = this._context["createBufferSource"]();
        audio.buffer = this._buffer;
        audio["connect"](this._volume);
        audio.loop = this._loop;

        this._startTime = this._context.currentTime;
        offset = offset || this.playedLength;
        if (offset) {
            this._startTime -= offset;
        }
        var duration = this._buffer.duration;

        var startTime = offset;
        var endTime;
        if (this._loop) {
            if (audio.start)
                audio.start(0, startTime);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0, startTime);
            else
                audio["noteOn"](0, startTime);
        } else {
            endTime = duration - offset;
            if (audio.start)
                audio.start(0, startTime, endTime);
            else if (audio["notoGrainOn"])
                audio["noteGrainOn"](0, startTime, endTime);
            else
                audio["noteOn"](0, startTime, endTime);
        }

        this._currentSource = audio;

        audio.onended = this._endCallback;

        // If the current audio context time stamp is 0
        // There may be a need to touch events before you can actually start playing audio
        if (this._context.currentTime === 0) {
            var self = this;
            clearTimeout(this._currextTimer);
            this._currextTimer = setTimeout(function () {
                if (self._context.currentTime === 0) {
                    touchPlayList.push({
                        instance: self._audio,
                        offset: offset,
                        audio: self
                    });
                }
            }, 10);
        }
    };

    proto.pause = function () {
        clearTimeout(this._currextTimer);
        if (this.paused) return;
        // Record the time the current has been played
        this.playedLength = this._context.currentTime - this._startTime;
        // If more than the duration of the audio, Need to take the remainder
        this.playedLength %= this._buffer.duration;
        var audio = this._currentSource;
        this._currentSource = null;
        this._startTime = -1;
        if (audio)
            audio.stop(0);
    };

    proto.__defineGetter__('paused', function () {
        // If the current audio is a loop, paused is false
        if (this._currentSource && this._currentSource.loop)
            return false;

        // startTime default is -1
        if (this._startTime === -1)
            return true;

        // Current time -  Start playing time > Audio duration
        return this._context.currentTime - this._startTime > this._buffer.duration;
    });

    proto.__defineGetter__('loop', function () { return this._loop; });
    proto.__defineSetter__('loop', function (bool) {
        if (this._currentSource)
            this._currentSource.loop = bool;

        return this._loop = bool;
    });

    proto.__defineGetter__('volume', function () { return this._volume['gain'].value; });
    proto.__defineSetter__('volume', function (num) {
        this._volume['gain'].value = num;
        if (cc.sys.os === cc.sys.OS_IOS && !this.paused && this._currentSource) {
            // IOS must be stop webAudio
            this._currentSource.onended = null;
            this.pause();
            this.play();
        }
        return num;
    });

    proto.__defineGetter__('currentTime', function () {
        if (this.paused) {
            return this.playedLength;
        }
        // Record the time the current has been played
        this.playedLength = this._context.currentTime - this._startTime;
        // If more than the duration of the audio, Need to take the remainder
        this.playedLength %= this._buffer.duration;
        return this.playedLength;
    });
    proto.__defineSetter__('currentTime', function (num) {
        if (!this.paused) {
            this.pause();
            this.playedLength = num;
            this.play();
        } else {
            this.playedLength = num;
        }
        return num;
    });

    proto.__defineGetter__('duration', function () {
        return this._buffer.duration;
    });

})(WebAudioElement.prototype);

module.exports = cc.Audio =  Audio;
