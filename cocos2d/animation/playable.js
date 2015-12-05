var JS = cc.js;

/**
 * @class Playable
 * @constructor
 */
function Playable () {
    this._isPlaying = false;
    this._isPaused = false;
    this._stepOnce = false;
}

var prototype = Playable.prototype;

/**
 * Is playing or paused in play mode?
 * @property isPlaying
 * @type {boolean}
 * @default false
 * @readOnly
 */
JS.get(prototype, 'isPlaying', function () {
    return this._isPlaying;
}, true);

/**
 * Is currently paused? This can be true even if in edit mode(isPlaying == false).
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
 * Play this animation
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
 * Stop this animation
 * @method stop
 */
prototype.stop = function () {
    if (this._isPlaying) {
        this._isPlaying = false;
        this._isPaused = false;
        this.onStop();
    }
};

/**
 * Pause this animation
 * @method pause
 */
prototype.pause = function () {
    this._isPaused = true;
    this.onPause();
};

/**
 * Resume this animation
 * @method resume
 */
prototype.resume = function () {
    this._isPaused = false;
    this.onResume();
};

/**
 * Perform a single frame step.
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
