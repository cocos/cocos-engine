/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var math = {

    DEG_TO_RAD: Math.PI / 180,

    RAD_TO_DEG: 180 / Math.PI,

    INV_LOG2: 1 / Math.log(2),

    clamp: function(value, min, max) {
        if(value >= max) return max;
        if(value <= min) return min;
        return value;
    },

    intToBytes24: function (i) {
        var r, g, b;

        r = (i >> 16) & 0xff;
        g = (i >> 8) & 0xff;
        b = (i) & 0xff;

        return [r, g, b];
    },

    intToBytes32: function (i) {
        var r, g, b, a;

        r = (i >> 24) & 0xff;
        g = (i >> 16) & 0xff;
        b = (i >> 8) & 0xff;
        a = (i) & 0xff;

        return [r, g, b, a];
    },

    bytesToInt24: function (r, g, b) {
        if (r.length) {
            b = r[2];
            g = r[1];
            r = r[0];
        }
        return ((r << 16) | (g << 8) | b);
    },

    bytesToInt32: function (r, g, b, a) {
        if (r.length) {
            a = r[3];
            b = r[2];
            g = r[1];
            r = r[0];
        }
        // Why ((r << 24)>>>32)?
        // << operator uses signed 32 bit numbers, so 128<<24 is negative.
        // >>> used unsigned so >>>32 converts back to an unsigned.
        // See http://stackoverflow.com/questions/1908492/unsigned-integer-in-javascript
        return ((r << 24) | (g << 16) | (b << 8) | a)>>>32;
    },

    lerp: function (a, b, alpha) {
        return a + (b - a) * math.clamp(alpha, 0, 1);
    },

    lerpAngle: function (a, b, alpha) {
        if (b - a > 180 ) {
            b -= 360;
        }
        if (b - a < -180 ) {
            b += 360;
        }
        return math.lerp(a, b, math.clamp(alpha, 0, 1));
    },

    powerOfTwo: function (x) {
        return ((x !== 0) && !(x & (x - 1)));
    },

    nextPowerOfTwo: function(val) {
        val--;
        val = (val >> 1) | val;
        val = (val >> 2) | val;
        val = (val >> 4) | val;
        val = (val >> 8) | val;
        val = (val >> 16) | val;
        val++;
        return val;
    },

    random: function (min, max) {
        var diff = max - min;
        return Math.random() * diff + min;
    },

    smoothstep: function (min, max, x) {
        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * (3 - 2 * x);
    },

    smootherstep: function (min, max, x) {
        if (x <= min) return 0;
        if (x >= max) return 1;

        x = (x - min) / (max - min);

        return x * x * x * (x * (x * 6 - 15) + 10);
    }
};

math.intToBytes = math.intToBytes32;
math.bytesToInt = math.bytesToInt32;

// IE doesn't have native log2
if (!Math.log2) {
    Math.log2 = function(x) {
        return Math.log(x) * math.INV_LOG2;
    };
}

cc.math = math;
