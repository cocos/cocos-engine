/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var Easing = {
    constant: function () { return 0; },
    linear: function (k) { return k; },

    // quad
    //  Easing equation function for a quadratic (t^2)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    quadIn: function (k) { return k * k; },
    quadOut: function (k) { return k * ( 2 - k ); },
    quadInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k;
        }
        return -0.5 * ( --k * ( k - 2 ) - 1 );
    },

    // cubic
    //  Easing equation function for a cubic (t^3)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    cubicIn: function (k) { return k * k * k; },
    cubicOut: function (k) { return --k * k * k + 1; },
    cubicInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k;
        }
        return 0.5 * ( ( k -= 2 ) * k * k + 2 );
    },

    // quart
    //  Easing equation function for a quartic (t^4)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    quartIn: function (k) { return k * k * k * k; },
    quartOut: function (k) { return 1 - ( --k * k * k * k ); },
    quartInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k * k;
        }
        return -0.5 * ( ( k -= 2 ) * k * k * k - 2 );
    },

    // quint
    //  Easing equation function for a quintic (t^5)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    quintIn: function (k) { return k * k * k * k * k; },
    quintOut: function (k) { return --k * k * k * k * k + 1; },
    quintInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return 0.5 * k * k * k * k * k;
        }
        return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
    },

    // sine
    //  Easing equation function for a sinusoidal (sin(t))
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    sineIn: function (k) { return 1 - Math.cos(k * Math.PI / 2); },
    sineOut: function (k) { return Math.sin(k * Math.PI / 2); },
    sineInOut: function (k) { return 0.5 * ( 1 - Math.cos(Math.PI * k) ); },

    // expo
    //  Easing equation function for an exponential (2^t)
    //  param t: Current time (in frames or seconds).
    //  return: The correct value.

    expoIn: function (k) { return k === 0 ? 0 : Math.pow(1024, k - 1); },
    expoOut: function (k) { return k === 1 ? 1 : 1 - Math.pow(2, -10 * k); },
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
    //  Easing equation function for a circular (sqrt(1-t^2))
    //  @param t: Current time (in frames or seconds).
    //  @return:	The correct value.

    circIn: function (k) { return 1 - Math.sqrt(1 - k * k); },
    circOut: function (k) { return Math.sqrt(1 - ( --k * k )); },
    circInOut: function (k) {
        if (( k *= 2 ) < 1) {
            return -0.5 * ( Math.sqrt(1 - k * k) - 1);
        }
        return 0.5 * ( Math.sqrt(1 - ( k -= 2) * k) + 1);
    },

    // elastic
    //  Easing equation function for an elastic (exponentially decaying sine wave)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.
    //  recommand value: elastic (t)

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
    //  Easing equation function for a back (overshooting cubic easing: (s+1)*t^3 - s*t^2)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

    backIn: function (k) {
        var s = 1.70158;
        return k * k * ( ( s + 1 ) * k - s );
    },
    backOut: function (k) {
        var s = 1.70158;
        return --k * k * ( ( s + 1 ) * k + s ) + 1;
    },
    backInOut: function (k) {
        var s = 1.70158 * 1.525;
        if (( k *= 2 ) < 1) {
            return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
        }
        return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
    },

    // bounce
    //  Easing equation function for a bounce (exponentially decaying parabolic bounce)
    //  @param t: Current time (in frames or seconds).
    //  @return: The correct value.

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

    // smooth
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

    // fade
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
Easing.quadOutIn = _makeOutIn(Easing.quadIn, Easing.quadOut);
Easing.cubicOutIn = _makeOutIn(Easing.cubicIn, Easing.cubicOut);
Easing.quartOutIn = _makeOutIn(Easing.quartIn, Easing.quartOut);
Easing.quintOutIn = _makeOutIn(Easing.quintIn, Easing.quintOut);
Easing.sineOutIn = _makeOutIn(Easing.sineIn, Easing.sineOut);
Easing.expoOutIn = _makeOutIn(Easing.expoIn, Easing.expoOut);
Easing.circOutIn = _makeOutIn(Easing.circIn, Easing.circOut);
Easing.backOutIn = _makeOutIn(Easing.backIn, Easing.backOut);
Easing.backOutIn = _makeOutIn(Easing.backIn, Easing.backOut);
Easing.bounceIn = function (k) { return 1 - Easing.bounceOut(1 - k); };
Easing.bounceInOut = function (k) {
    if (k < 0.5) {
        return Easing.bounceIn(k * 2) * 0.5;
    }
    return Easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
};
Easing.bounceOutIn = _makeOutIn(Easing.bounceIn, Easing.bounceOut);

cc.Easing = module.exports = Easing;
