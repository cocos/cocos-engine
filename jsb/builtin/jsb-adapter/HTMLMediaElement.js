/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
 
const HTMLElement = require('./HTMLElement');
const MediaError = require('./MediaError');

const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

class HTMLMediaElement extends HTMLElement {
    constructor(type) {
        super(type)
        this._volume = 1.0;
        this._duration = 0;
        this._isEnded = false;
        this._isMute = false;
        this._readyState = HAVE_NOTHING;
        this._error = new MediaError();
    }

    addTextTrack() {}

    captureStream() {}

    fastSeek() {}

    load() {}

    pause() {}

    play() {}

    canPlayType(mediaType) {
        return '';
    }

    set volume(volume) {
        this._volume = volume;
    }

    get volume() {
        return this._volume;
    }

    get duration() {
        return this._duration;
    }

    get ended() {
        return this._isEnded;
    }

    get muted() {
        return this._isMute;
    }

    get readyState() {
        return this._readyState;
    }

    get error() {
        return this._error;
    }

    get currentTime() {
        return 0;
    }
}

module.exports = HTMLMediaElement;
