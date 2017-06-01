
var bezierByTime = require('./bezier').bezierByTime;

var binarySearch = require('../core/utils/binary-search').binarySearchEpsilon;
var WrapModeMask = require('./types').WrapModeMask;
var WrappedInfo = require('./types').WrappedInfo;

/**
 * Compute a new ratio by curve type
 * @param {Number} ratio - The origin ratio
 * @param {Array|String} type - If it's Array, then ratio will be computed with bezierByTime. If it's string, then ratio will be computed with cc.Easing function
 */
function computeRatioByType (ratio, type) {
    if (typeof type === 'string') {
        var func = cc.Easing[type];
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
    // @param {AnimationNode} animationNode
    //
    sample: function (time, ratio, animationNode) {},

    onTimeChangedManually: function () {}
});


//
// 区别于 SampledAnimCurve。
//
// @class DynamicAnimCurve
//
// @extends AnimCurve
//
var DynamicAnimCurve = cc.Class({
    name: 'cc.DynamicAnimCurve',
    extends: AnimCurve,

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

        // @property {string[]} subProps - The path of sub property being animated.
        subProps: null
    },

    _calcValue: function (frameIndex, ratio) {
        var values = this.values;
        var fromVal = values[frameIndex - 1];
        var toVal = values[frameIndex];

        var value;
        // lerp
        if (typeof fromVal === 'number') {
            value = fromVal + (toVal - fromVal) * ratio;
        }
        else {
            if (fromVal && fromVal.lerp) {
                value = fromVal.lerp(toVal, ratio);
            }
            else {
                // no linear lerp function, just return last frame
                value = fromVal;
            }
        }

        return value;
    },

    _applyValue: function (target, prop, value) {
        target[prop] = value;
    },

    _findFrameIndex: binarySearch,

    sample: function (time, ratio, animationNode) {
        var values = this.values;
        var ratios = this.ratios;
        var frameCount = ratios.length;

        if (frameCount === 0) {
            return;
        }

        // evaluate value
        var value;
        var index = this._findFrameIndex(ratios, ratio);

        if (index < 0) {
            index = ~index;

            if (index <= 0) {
                value = values[0];
            }
            else if (index >= frameCount) {
                value = values[frameCount - 1];
            }
            else {
                var fromRatio = ratios[index - 1];
                var toRatio = ratios[index];
                var type = this.types[index - 1];
                var ratioBetweenFrames = (ratio - fromRatio) / (toRatio - fromRatio);

                ratioBetweenFrames = computeRatioByType(ratioBetweenFrames, type);

                value = this._calcValue(index, ratioBetweenFrames);
            }
        }
        else {
            value = values[index];
        }

        var subProps = this.subProps;
        if (subProps) {
            // create batched value dynamically
            var mainProp = this.target[this.prop];
            var subProp = mainProp;

            for (var i = 0; i < subProps.length - 1; i++) {
                var subPropName = subProps[i];
                if (subProp) {
                    subProp = subProp[subPropName];
                }
                else {
                    return;
                }
            }

            var propName = subProps[subProps.length - 1];

            if (subProp) {
                this._applyValue(subProp, propName, value);
            }
            else {
                return;
            }

            value = mainProp;
        }

        // apply value
        this._applyValue(this.target, this.prop, value);
    }
});

DynamicAnimCurve.Linear = null;
DynamicAnimCurve.Bezier = function (controlPoints) {
    return controlPoints;
};



/**
 * SampledAnimCurve, 这里面的数值需要是已经都预先sample好了的,
 * 所以 SampledAnimCurve 中查找 frame index 的速度会非常快
 *
 * @class SampledAnimCurve
 * @private
 *
 * @extends DynamicAnimCurve
 */
var SampledAnimCurve = cc.Class({
    name: 'cc.SampledAnimCurve',
    extends: DynamicAnimCurve,

    _findFrameIndex: function (ratios, ratio) {
        var length = ratios.length - 1;

        if (length === 0) return 0;

        var start = ratios[0];
        if (ratio < start) return 0;

        var end = ratios[length];
        if (ratio > end) return length;

        ratio = (ratio - start) / (end - start);

        var eachLength = 1 / length;
        var index = ratio / eachLength;
        var floorIndex = index | 0;
        var EPSILON = 1e-6;

        if ((index - floorIndex) < EPSILON) {
            return floorIndex;
        }

        return ~(floorIndex + 1);
    }
});



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

    sample: function (time, ratio, animationNode) {
        var length = this.ratios.length;

        var currentWrappedInfo = animationNode.getWrappedInfo(animationNode.time, this._wrappedInfo);
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

        var wrapMode = animationNode.wrapMode;
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

    onTimeChangedManually: function (time, animationNode) {
        this._lastWrappedInfo = null;
        this._ignoreIndex = NaN;

        var info = animationNode.getWrappedInfo(time, this._wrappedInfo);
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
    cc._Test.SampledAnimCurve = SampledAnimCurve;
    cc._Test.EventAnimCurve = EventAnimCurve;
}

module.exports = {
    AnimCurve: AnimCurve,
    DynamicAnimCurve: DynamicAnimCurve,
    SampledAnimCurve: SampledAnimCurve,
    EventAnimCurve: EventAnimCurve,
    EventInfo: EventInfo,
    computeRatioByType: computeRatioByType
};
