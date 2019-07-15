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

/**
 * @module cc
 */

 /**
  * !#en
  * This class provide easing methods for {{#crossLink "tween"}}{{/crossLink}} class.<br>
  * Demonstratio: https://easings.net/
  * !#zh
  * 缓动函数类，为 {{#crossLink "Tween"}}{{/crossLink}} 提供缓动效果函数。<br>
  * 函数效果演示： https://easings.net/
  * @class Easing
  */

var easing = {
    constant: function () { return 0; },
    linear: function (k) { return k; },

    // quad
    //  easing equation function for a quadratic (t^2)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in with quadratic formula. From slow to fast.
     * !#zh 平方曲线缓入函数。运动由慢到快。
     * @method quadIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value
     */
    quadIn: function (k) { return k * k; },
    /**
     * !#en Easing out with quadratic formula. From fast to slow.
     * !#zh 平方曲线缓出函数。运动由快到慢。
     * @method quadOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value
     */
    quadOut: function (k) { return k * ( 2 - k ); },
    /**
     * !#en Easing in and out with quadratic formula. From slow to fast, then back to slow.
     * !#zh 平方曲线缓入缓出函数。运动由慢到快再到慢。
     * @method quadInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value
     */
    quadInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * ( --k * ( k - 2 ) - 1 );
    },

    // cubic
    //  easing equation function for a cubic (t^3)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in with cubic formula. From slow to fast.
     * !#zh 立方曲线缓入函数。运动由慢到快。
     * @method cubicIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    cubicIn: function (k) { return k * k * k; },
    /**
     * !#en Easing out with cubic formula. From slow to fast.
     * !#zh 立方曲线缓出函数。运动由快到慢。
     * @method cubicOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    cubicOut: function (k) { return --k * k * k + 1; },
    /**
     * !#en Easing in and out with cubic formula. From slow to fast, then back to slow.
     * !#zh 立方曲线缓入缓出函数。运动由慢到快再到慢。
     * @method cubicInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    cubicInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ( ( k -= 2 ) * k * k + 2 );
    },

    // quart
    //  easing equation function for a quartic (t^4)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in with quartic formula. From slow to fast.
     * !#zh 四次方曲线缓入函数。运动由慢到快。
     * @method quartIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quartIn: function (k) { return k * k * k * k; },
    /**
     * !#en Easing out with quartic formula. From fast to slow.
     * !#zh 四次方曲线缓出函数。运动由快到慢。
     * @method quartOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quartOut: function (k) { return 1 - ( --k * k * k * k ); },
    /**
     * !#en Easing in and out with quartic formula. From slow to fast, then back to slow.
     * !#zh 四次方曲线缓入缓出函数。运动由慢到快再到慢。
     * @method quartInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quartInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k * k;
        }
        return -0.5 * ( ( k -= 2 ) * k * k * k - 2 );
    },

    // quint
    //  easing equation function for a quintic (t^5)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in with quintic formula. From slow to fast.
     * !#zh 五次方曲线缓入函数。运动由慢到快。
     * @method quintIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quintIn: function (k) { return k * k * k * k * k; },
    /**
     * !#en Easing out with quintic formula. From fast to slow.
     * !#zh 五次方曲线缓出函数。运动由快到慢。
     * @method quintOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quintOut: function (k) { return --k * k * k * k * k + 1; },
    /**
     * !#en Easing in and out with quintic formula. From slow to fast, then back to slow.
     * !#zh 五次方曲线缓入缓出函数。运动由慢到快再到慢。
     * @method quintInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    quintInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
    },

    // sine
    //  easing equation function for a sinusoidal (sin(t))
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in and out with sine formula. From slow to fast.
     * !#zh 正弦曲线缓入函数。运动由慢到快。
     * @method sineIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    sineIn: function (k) { return 1 - Math.cos(k * Math.PI / 2); },
    /**
     * !#en Easing in and out with sine formula. From fast to slow.
     * !#zh 正弦曲线缓出函数。运动由快到慢。
     * @method sineOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    sineOut: function (k) { return Math.sin(k * Math.PI / 2); },
    /**
     * !#en Easing in and out with sine formula. From slow to fast, then back to slow.
     * !#zh 正弦曲线缓入缓出函数。运动由慢到快再到慢。
     * @method sineInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    sineInOut: function (k) { return 0.5 * ( 1 - Math.cos(Math.PI * k) ); },

    // expo
    //  easing equation function for an exponential (2^t)
    //  param t: Current time (in frames or seconds).
    //  return: The correct value.

    /**
     * !#en Easing in and out with exponential formula. From slow to fast.
     * !#zh 指数曲线缓入函数。运动由慢到快。
     * @method expoIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    expoIn: function (k) { return k === 0 ? 0 : Math.pow(1024, k - 1); },
    /**
     * !#en Easing in and out with exponential formula. From fast to slow.
     * !#zh 指数曲线缓出函数。运动由快到慢。
     * @method expoOu
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    expoOut: function (k) { return k === 1 ? 1 : 1 - Math.pow(2, -10 * k); },
    /**
     * !#en Easing in and out with exponential formula. From slow to fast.
     * !#zh 指数曲线缓入和缓出函数。运动由慢到很快再到慢。
     * @method expoInOut
     * @param {Number} t The current time as a percentage of the total time, then back to slow.
     * @return The correct value.
     */
    expoInOut: function (k) {
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (( k *= 2 ) < 1) {
            return 0.5 * Math.pow(1024, k - 1);
        }
        return 0.5 * ( -Math.pow(2, -10 * ( k - 1 )) + 2 );
    },

    // circ
    //  easing equation function for a circular (sqrt(1-t^2))
    //  @param t: Current time (in frames or seconds).
    //  @return:	The correct value.

    /**
     * !#en Easing in and out with circular formula. From slow to fast.
     * !#zh 循环公式缓入函数。运动由慢到快。
     * @method circIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    circIn: function (k) { return 1 - Math.sqrt(1 - k * k); },
    /**
     * !#en Easing in and out with circular formula. From fast to slow.
     * !#zh 循环公式缓出函数。运动由快到慢。
     * @method circOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    circOut: function (k) { return Math.sqrt(1 - ( --k * k )); },
    /**
     * !#en Easing in and out with circular formula. From slow to fast.
     * !#zh 指数曲线缓入缓出函数。运动由慢到很快再到慢。
     * @method circInOut
     * @param {Number} t The current time as a percentage of the total time, then back to slow.
     * @return The correct value.
     */
    circInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return -0.5 * ( Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * ( Math.sqrt(1 - ( k -= 2) * k) + 1);
    },

    // elastic
    //  easing equation function for an elastic (exponentially decaying sine wave)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.
    //  recommand value: elastic (t)

    /**
     * !#en Easing in action with a spring oscillating effect.
     * !#zh 弹簧回震效果的缓入函数。
     * @method elasticIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    elasticIn: function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / ( 2 * Math.PI );
        }
        return -( a * Math.pow(2, 10 * ( k -= 1 )) * Math.sin(( k - s ) * ( 2 * Math.PI ) / p) );
    },
    /**
     * !#en Easing out action with a spring oscillating effect.
     * !#zh 弹簧回震效果的缓出函数。
     * @method elasticOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    elasticOut: function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / ( 2 * Math.PI );
        }
        return ( a * Math.pow(2, -10 * k) * Math.sin(( k - s ) * ( 2 * Math.PI ) / p) + 1 );
    },
    /**
     * !#en Easing in and out action with a spring oscillating effect.
     * !#zh 弹簧回震效果的缓入缓出函数。
     * @method elasticInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    elasticInOut: function (k) {
        var s, a = 0.1, p = 0.4;
        if (k === 0) {
            return 0;
        }
        if (k === 1) {
            return 1;
        }
        if (!a || a < 1) {
            a = 1;
            s = p / 4;
        }
        else {
            s = p * Math.asin(1 / a) / ( 2 * Math.PI );
        }
        if (( k *= 2 ) < 1) {
            return -0.5 *
                   ( a * Math.pow(2, 10 * ( k -= 1 )) * Math.sin(( k - s ) * ( 2 * Math.PI ) / p) );
        }
        return a * Math.pow(2, -10 * ( k -= 1 )) * Math.sin(( k - s ) * ( 2 * Math.PI ) / p) * 0.5 + 1;
    },

    // back
    //  easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in action with "back up" behavior.
     * !#zh 回退效果的缓入函数。
     * @method backIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    backIn: function (k) {
        var s = 1.70158;
        return k * k * ( ( s + 1 ) * k - s );
    },
    /**
     * !#en Easing out action with "back up" behavior.
     * !#zh 回退效果的缓出函数。
     * @method backOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    backOut: function (k) {
        var s = 1.70158;
        return --k * k * ( ( s + 1 ) * k + s ) + 1;
    },
    /**
     * !#en Easing in and out action with "back up" behavior.
     * !#zh 回退效果的缓入缓出函数。
     * @method backInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    backInOut: function (k) {
        var s = 1.70158 * 1.525;
        if (( k *= 2 ) < 1) {
            return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
        }
        return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
    },

    // bounce
    //  easing equation function for a bounce (exponentially decaying parabolic bounce)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    /**
     * !#en Easing in action with bouncing effect.
     * !#zh 弹跳效果的缓入函数。
     * @method bounceIn
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    bounceIn: function (k) {
        return 1 - easing.bounceOut(1 - k);
    },
    /**
     * !#en Easing out action with bouncing effect.
     * !#zh 弹跳效果的缓出函数。
     * @method bounceOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    bounceOut: function (k) {
        if (k < ( 1 / 2.75 )) {
            return 7.5625 * k * k;
        }
        else if (k < ( 2 / 2.75 )) {
            return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
        }
        else if (k < ( 2.5 / 2.75 )) {
            return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
        }
        else {
            return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
        }
    },
    /**
     * !#en Easing in and out action with bouncing effect.
     * !#zh 弹跳效果的缓入缓出函数。
     * @method bounceInOut
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    bounceInOut: function (k) {
        if (k < 0.5) {
            return easing.bounceIn(k * 2) * 0.5;
        }
        return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
    },

    /**
     * !#en Target will run action with smooth effect.
     * !#zh 平滑效果函数。
     * @method smooth
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    // t<=0: 0 | 0<t<1: 3*t^2 - 2*t^3 | t>=1: 1
    smooth: function (t) {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        return t * t * (3 - 2 * t);
    },

    /**
     * !#en Target will run action with fade effect.
     * !#zh 渐褪效果函数。
     * @method fade
     * @param {Number} t The current time as a percentage of the total time.
     * @return The correct value.
     */
    // t<=0: 0 | 0<t<1: 6*t^5 - 15*t^4 + 10*t^3 | t>=1: 1
    fade: function (t) {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        return t * t * t * (t * (t * 6 - 15) + 10);
    },
};

function _makeOutIn (fnIn, fnOut) {
    return function (k) {
        if (k < 0.5) {
            return fnOut(k * 2) / 2;
        }
        return fnIn(2 * k - 1) / 2 + 0.5;
    };
}
easing.quadOutIn = _makeOutIn(easing.quadIn, easing.quadOut);
easing.cubicOutIn = _makeOutIn(easing.cubicIn, easing.cubicOut);
easing.quartOutIn = _makeOutIn(easing.quartIn, easing.quartOut);
easing.quintOutIn = _makeOutIn(easing.quintIn, easing.quintOut);
easing.sineOutIn = _makeOutIn(easing.sineIn, easing.sineOut);
easing.expoOutIn = _makeOutIn(easing.expoIn, easing.expoOut);
easing.circOutIn = _makeOutIn(easing.circIn, easing.circOut);
easing.backOutIn = _makeOutIn(easing.backIn, easing.backOut);
easing.bounceIn = function (k) { return 1 - easing.bounceOut(1 - k); };
easing.bounceInOut = function (k) {
    if (k < 0.5) {
        return easing.bounceIn(k * 2) * 0.5;
    }
    return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
};
easing.bounceOutIn = _makeOutIn(easing.bounceIn, easing.bounceOut);

/**
 * @module cc
 */

/**
 * !#en This is a Easing instance.
 * !#zh 这是一个 Easing 类实例。
 * @property easing
 * @type Easing
 */

cc.easing = module.exports = easing;
