/****************************************************************************
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

var js = cc.js;
const debug = require('../core/CCDebug');

/**
 * @class Playable
 *
 */
function Playable () {
    this._isPlaying = false;
    this._isPaused = false;
    this._stepOnce = false;
}

var prototype = Playable.prototype;

/**
 * !#en Is playing or paused in play mode?
 * !#zh 当前是否正在播放。
 * @property isPlaying
 * @type {boolean}
 * @default false
 * @readOnly
 */
js.get(prototype, 'isPlaying', function () {
    return this._isPlaying;
}, true);

/**
 * !#en Is currently paused? This can be true even if in edit mode(isPlaying == false).
 * !#zh 当前是否正在暂停
 * @property isPaused
 * @type {boolean}
 * @default false
 * @readOnly
 */
js.get(prototype, 'isPaused', function () {
    return this._isPaused;
}, true);

// virtual

var virtual = function () {};
/**
 * @method onPlay
 * @private
 */
prototype.onPlay = virtual;
/**
 * @method onPause
 * @private
 */
prototype.onPause = virtual;
/**
 * @method onResume
 * @private
 */
prototype.onResume = virtual;
/**
 * @method onStop
 * @private
 */
prototype.onStop = virtual;
/**
 * @method onError
 * @param {string} errorCode
 * @private
 */
prototype.onError = virtual;

// public

/**
 * !#en Play this animation.
 * !#zh 播放动画。
 * @method play
 */
prototype.play = function () {
    if (this._isPlaying) {
        if (this._isPaused) {
            this._isPaused = false;
            this.onResume();
        }
        else {
            this.onError(debug.getError(3912));
        }
    }
    else {
        this._isPlaying = true;
        this.onPlay();
    }
};

/**
 * !#en Stop this animation.
 * !#zh 停止动画播放。
 * @method stop
 */
prototype.stop = function () {
    if (this._isPlaying) {
        this._isPlaying = false;
        this.onStop();

        // need reset pause flag after onStop
        this._isPaused = false;
    }
};

/**
 * !#en Pause this animation.
 * !#zh 暂停动画。
 * @method pause
 */
prototype.pause = function () {
    if (this._isPlaying && !this._isPaused) {
        this._isPaused = true;
        this.onPause();
    }
};

/**
 * !#en Resume this animation.
 * !#zh 重新播放动画。
 * @method resume
 */
prototype.resume = function () {
    if (this._isPlaying && this._isPaused) {
        this._isPaused = false;
        this.onResume();
    }
};

/**
 * !#en Perform a single frame step.
 * !#zh 执行一帧动画。
 * @method step
 */
prototype.step = function () {
    this.pause();
    this._stepOnce = true;
    if (!this._isPlaying) {
        this.play();
    }
};

module.exports = Playable;
