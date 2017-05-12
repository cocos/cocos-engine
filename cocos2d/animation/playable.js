var JS = cc.js;

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
JS.get(prototype, 'isPlaying', function () {
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
JS.get(prototype, 'isPaused', function () {
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
            this.onError('already-playing');
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
    if (this._isPlaying) {
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
