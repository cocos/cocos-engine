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


const bezierByTime = require('./bezier').bezierByTime;

const binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;
const WrapModeMask = require('./types').WrapModeMask;
const WrappedInfo = require('./types').WrappedInfo;

/**
 * Compute a new ratio by curve type
 * @param {Number} ratio - The origin ratio
 * @param {Array|String} type - If it's Array, then ratio will be computed with bezierByTime. If it's string, then ratio will be computed with cc.easing function
 */
function computeRatioByType (ratio, type) {
    if (typeof type === 'string') {
        var func = cc.easing[type];
        if (func) {
            ratio = func(ratio);
        }
        else {
            cc.errorID(3906, type);
        }
    }
    else if (Array.isArray(type)) {
        // bezier curve
        ratio = bezierByTime(type, ratio);
    }

    return ratio;
}

//
// 动画数据类，相当于 AnimationClip。
// 虽然叫做 AnimCurve，但除了曲线，可以保存任何类型的值。
//
// @class AnimCurve
//
//
var AnimCurve = cc.Class({
    name: 'cc.AnimCurve',

    //
    // @method sample
    // @param {number} time
    // @param {number} ratio - The normalized time specified as a number between 0.0 and 1.0 inclusive.
    // @param {AnimationState} state
    //
    sample: function (time, ratio, state) {},

    onTimeChangedManually: undefined
});

/**
 * 当每两帧之前的间隔都一样的时候可以使用此函数快速查找 index
 */
function quickFindIndex (ratios, ratio) {
    var length = ratios.length - 1;

    if (length === 0) return 0;

    var start = ratios[0];
    if (ratio < start) return 0;

    var end = ratios[length];
    if (ratio > end) return ~ratios.length;

    ratio = (ratio - start) / (end - start);

    var eachLength = 1 / length;
    var index = ratio / eachLength;
    var floorIndex = index | 0;
    var EPSILON = 1e-6;

    if ((index - floorIndex) < EPSILON) {
        return floorIndex;
    }
    else if ((floorIndex + 1 - index) < EPSILON) {
        return floorIndex + 1;
    }

    return ~(floorIndex + 1);
}

//
//
// @class DynamicAnimCurve
//
// @extends AnimCurve
//
var DynamicAnimCurve = cc.Class({
    name: 'cc.DynamicAnimCurve',
    extends: AnimCurve,

    ctor () {
        // cache last frame index
        this._cachedIndex = 0;
    },

    properties: {

        // The object being animated.
        // @property target
        // @type {object}
        target: null,

        // The name of the property being animated.
        // @property prop
        // @type {string}
        prop: '',

        // The values of the keyframes. (y)
        // @property values
        // @type {any[]}
        values: [],

        // The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
        // @property ratios
        // @type {number[]}
        ratios: [],

        // @property types
        // @param {object[]}
        // Each array item maybe type:
        // - [x, x, x, x]: Four control points for bezier
        // - null: linear
        types: [],
    },

    _findFrameIndex: binarySearch,
    _lerp: undefined,

    _lerpNumber (from, to, t) {
        return from + (to - from) * t;
    },

    _lerpObject (from, to, t) {
        return from.lerp(to, t);
    },

    _lerpQuat: (function () {
        let out = cc.quat();
        return function (from, to, t) {
            return from.lerp(to, t, out);
        };
    })(),

    _lerpVector: (function () {
        let out = cc.v3();
        return function (from, to, t) {
            return from.lerp(to, t, out);
        };
    })(),

    sample (time, ratio, state) {
        let values = this.values;
        let ratios = this.ratios;
        let frameCount = ratios.length;

        if (frameCount === 0) {
            return;
        }

        // only need to refind frame index when ratio is out of range of last from ratio and to ratio.
        let shoudRefind = true;
        let cachedIndex = this._cachedIndex;
        if (cachedIndex < 0) {
            cachedIndex = ~cachedIndex;
            if (cachedIndex > 0 && cachedIndex < ratios.length) {
                let fromRatio = ratios[cachedIndex - 1];
                let toRatio = ratios[cachedIndex];
                if (ratio > fromRatio && ratio < toRatio) {
                    shoudRefind = false;
                }
            }
        }

        if (shoudRefind) {
            this._cachedIndex = this._findFrameIndex(ratios, ratio);
        }

        // evaluate value
        let value;
        let index = this._cachedIndex;
        if (index < 0) {
            index = ~index;

            if (index <= 0) {
                value = values[0];
            }
            else if (index >= frameCount) {
                value = values[frameCount - 1];
            }
            else {
                var fromVal = values[index - 1];

                if (!this._lerp) {
                    value = fromVal;
                }
                else {
                    var fromRatio = ratios[index - 1];
                    var toRatio = ratios[index];
                    var type = this.types[index - 1];
                    var ratioBetweenFrames = (ratio - fromRatio) / (toRatio - fromRatio);

                    if (type) {
                        ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);
                    }

                    // calculate value
                    var toVal = values[index];

                    value = this._lerp(fromVal, toVal, ratioBetweenFrames);
                }
            }
        }
        else {
            value = values[index];
        }

        this.target[this.prop] = value;
    }
});

DynamicAnimCurve.Linear = null;
DynamicAnimCurve.Bezier = function (controlPoints) {
    return controlPoints;
};


/**
 * Event information,
 * @class EventInfo
 *
 */
var EventInfo = function () {
    this.events = [];
};

/**
 * @param {Function} [func] event function
 * @param {Object[]} [params] event params
 */
EventInfo.prototype.add = function (func, params) {
    this.events.push({
        func: func || '',
        params: params || []
    });
};


/**
 *
 * @class EventAnimCurve
 *
 * @extends AnimCurve
 */
var EventAnimCurve = cc.Class({
    name: 'cc.EventAnimCurve',
    extends: AnimCurve,

    properties: {
        /**
         * The object being animated.
         * @property target
         * @type {object}
         */
        target: null,

        /** The keyframe ratio of the keyframe specified as a number between 0.0 and 1.0 inclusive. (x)
         * @property ratios
         * @type {number[]}
         */
        ratios: [],

        /**
         * @property events
         * @type {EventInfo[]}
         */
        events: [],

        _wrappedInfo: {
            default: function () {
                return new WrappedInfo();
            }
        },

        _lastWrappedInfo: null,

        _ignoreIndex: NaN
    },

    _wrapIterations: function (iterations) {
        if (iterations - (iterations | 0) === 0) iterations -= 1;
        return iterations | 0;
    },

    sample: function (time, ratio, state) {
        var length = this.ratios.length;

        var currentWrappedInfo = state.getWrappedInfo(state.time, this._wrappedInfo);
        var direction = currentWrappedInfo.direction;
        var currentIndex = binarySearch(this.ratios, currentWrappedInfo.ratio);
        if (currentIndex < 0) {
            currentIndex = ~currentIndex - 1;

            // if direction is inverse, then increase index
            if (direction < 0) currentIndex += 1;
        }

        if (this._ignoreIndex !== currentIndex) {
            this._ignoreIndex = NaN;
        }

        currentWrappedInfo.frameIndex = currentIndex;

        if (!this._lastWrappedInfo) {
            this._fireEvent(currentIndex);
            this._lastWrappedInfo = new WrappedInfo(currentWrappedInfo);
            return;
        }

        var wrapMode = state.wrapMode;
        var currentIterations = this._wrapIterations(currentWrappedInfo.iterations);

        var lastWrappedInfo = this._lastWrappedInfo;
        var lastIterations = this._wrapIterations(lastWrappedInfo.iterations);
        var lastIndex = lastWrappedInfo.frameIndex;
        var lastDirection = lastWrappedInfo.direction;

        var interationsChanged = lastIterations !== -1 && currentIterations !== lastIterations;

        if (lastIndex === currentIndex && interationsChanged && length === 1) {
            this._fireEvent(0);
        }
        else if (lastIndex !== currentIndex || interationsChanged) {
            direction = lastDirection;

            do {
                if (lastIndex !== currentIndex) {
                    if (direction === -1 && lastIndex === 0 && currentIndex > 0) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        }
                        else {
                            lastIndex = length;
                        }

                        lastIterations ++;
                    }
                    else if (direction === 1 && lastIndex === length - 1 && currentIndex < length - 1) {
                        if ((wrapMode & WrapModeMask.PingPong) === WrapModeMask.PingPong) {
                            direction *= -1;
                        }
                        else {
                            lastIndex = -1;
                        }

                        lastIterations ++;
                    }

                    if (lastIndex === currentIndex) break;
                    if (lastIterations > currentIterations) break;
                }

                lastIndex += direction;

                cc.director.getAnimationManager().pushDelayEvent(this, '_fireEvent', [lastIndex]);
            } while (lastIndex !== currentIndex && lastIndex > -1 && lastIndex < length);
        }

        this._lastWrappedInfo.set(currentWrappedInfo);
    },

    _fireEvent: function (index) {
        if (index < 0 || index >= this.events.length || this._ignoreIndex === index) return;

        var eventInfo = this.events[index];
        var events = eventInfo.events;
        
        if ( !this.target.isValid ) { 
            return; 
        }
        
        var components = this.target._components;

        for (var i = 0;  i < events.length; i++) {
            var event = events[i];
            var funcName = event.func;

            for (var j = 0; j < components.length; j++) {
                var component = components[j];
                var func = component[funcName];

                if (func) func.apply(component, event.params);
            }
        }
    },

    onTimeChangedManually: function (time, state) {
        this._lastWrappedInfo = null;
        this._ignoreIndex = NaN;

        var info = state.getWrappedInfo(time, this._wrappedInfo);
        var direction = info.direction;
        var frameIndex = binarySearch(this.ratios, info.ratio);

        // only ignore when time not on a frame index
        if (frameIndex < 0) {
            frameIndex = ~frameIndex - 1;

            // if direction is inverse, then increase index
            if (direction < 0) frameIndex += 1;

            this._ignoreIndex = frameIndex;
        }
    }
});


if (CC_TEST) {
    cc._Test.DynamicAnimCurve = DynamicAnimCurve;
    cc._Test.EventAnimCurve = EventAnimCurve;
    cc._Test.quickFindIndex = quickFindIndex;
}

module.exports = {
    AnimCurve: AnimCurve,
    DynamicAnimCurve: DynamicAnimCurve,
    EventAnimCurve: EventAnimCurve,
    EventInfo: EventInfo,
    computeRatioByType: computeRatioByType,
    quickFindIndex: quickFindIndex
};
