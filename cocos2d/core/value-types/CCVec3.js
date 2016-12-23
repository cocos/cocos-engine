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

var ValueType = require('./CCValueType');
var JS = require('../platform/js');
var CCClass = require('../platform/CCClass');

function Vec3 (x, y, z) {
    if (x && typeof x === 'object') {
        z = x.z;
        y = x.y;
        x = x.x;
    }

    this.data = new Float32Array(3);
    this.data[0] = x || 0;
    this.data[1] = y || 0;
    this.data[2] = z || 0;

}
JS.extend(Vec3, ValueType);
CCClass.fastDefine('cc.Vec3', Vec3, { x: 0, y: 0, z: 0, });

JS.mixin(Vec3.prototype, {

    add: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] += b[0];
        a[1] += b[1];
        a[2] += b[2];

        return this;
    },

    add2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];

        return this;
    },

    clone: function () {
        return new Vec3().copy(this);
    },

    copy: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] = b[0];
        a[1] = b[1];
        a[2] = b[2];

        return this;
    },


    cross: function (lhs, rhs) {
        var a, b, r, ax, ay, az, bx, by, bz;

        a = lhs.data;
        b = rhs.data;
        r = this.data;

        ax = a[0];
        ay = a[1];
        az = a[2];
        bx = b[0];
        by = b[1];
        bz = b[2];

        r[0] = ay * bz - by * az;
        r[1] = az * bx - bz * ax;
        r[2] = ax * by - bx * ay;

        return this;
    },

    dot: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    },

    equals: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    },

    length: function () {
        var v = this.data;

        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    },

    lengthSq: function () {
        var v = this.data;

        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    },

    lerp: function (lhs, rhs, alpha) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + alpha * (b[0] - a[0]);
        r[1] = a[1] + alpha * (b[1] - a[1]);
        r[2] = a[2] + alpha * (b[2] - a[2]);

        return this;
    },

    mul: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] *= b[0];
        a[1] *= b[1];
        a[2] *= b[2];

        return this;
    },

    mul2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] * b[0];
        r[1] = a[1] * b[1];
        r[2] = a[2] * b[2];

        return this;
    },

    normalize: function () {
        return this.scale(1 / this.length());
    },

    project: function (rhs) {
        var a = this.data;
        var b = rhs.data;
        var a_dot_b = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        var b_dot_b = b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
        var s = a_dot_b / b_dot_b;
        a[0] = b[0] * s;
        a[1] = b[1] * s;
        a[2] = b[2] * s;
        return this;
    },

    scale: function (scalar) {
        var v = this.data;

        v[0] *= scalar;
        v[1] *= scalar;
        v[2] *= scalar;

        return this;
    },

    set: function (x, y, z) {
        var v = this.data;

        v[0] = x;
        v[1] = y;
        v[2] = z;

        return this;
    },

    sub: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] -= b[0];
        a[1] -= b[1];
        a[2] -= b[2];

        return this;
    },

    sub2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];

        return this;
    },

    toString: function () {
        return "(" + this.data[0] + ", " + this.data[1] + ", " + this.data[2] + ")";
    },

});

Object.defineProperty(Vec3, 'BACK', {
    get: function () {
        return new Vec3(0, 0, 1);
    }
});

Object.defineProperty(Vec3, 'DOWN', {
    get: function () {
        return new Vec3(0, -1, 0);
    }
});

Object.defineProperty(Vec3, 'FORWARD', {
    get: function () {
        return new Vec3(0, 0, -1);
    }
});

Object.defineProperty(Vec3, 'LEFT', {
    get: function () {
        return new Vec3(-1, 0, 0);
    }
});

Object.defineProperty(Vec3, 'ONE', {
    get: function () {
        return new Vec3(1, 1, 1);
    }
});

Object.defineProperty(Vec3, 'RIGHT', {
    get: function () {
        return new Vec3(1, 0, 0);
    }
});

Object.defineProperty(Vec3, 'UP', {
    get: function () {
        return new Vec3(0, 1, 0);
    }
});

Object.defineProperty(Vec3, 'ZERO', {
    get: function () {
        return new Vec3(0, 0, 0);
    }
});

cc.v3 = function v3 (x, y, z) {
    return new Vec3(x, y, z);
};

Object.defineProperty(Vec3.prototype, 'x', {
    get: function () {
        return this.data[0];
    },
    set: function (value) {
        this.data[0] = value;
    },
});

Object.defineProperty(Vec3.prototype, 'y', {
    get: function () {
        return this.data[1];
    },
    set: function (value) {
        this.data[1] = value;
    },
});

Object.defineProperty(Vec3.prototype, 'z', {
    get: function () {
        return this.data[2];
    },
    set: function (value) {
        this.data[2] = value;
    },
});

cc.Vec3 = module.exports = Vec3;
