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

function Vec4 (x, y, z, w) {
    if (x && typeof x === 'object') {
        z = x.z;
        y = x.y;
        x = x.x;
        w = x.w;
    }

    this.data = new Float32Array(4);
    this.data[0] = x || 0;
    this.data[1] = y || 0;
    this.data[2] = z || 0;
    this.data[3] = w || 0;
}
JS.extend(Vec4, ValueType);
CCClass.fastDefine('cc.Vec4', Vec4, { x: 0, y: 0, z: 0, w: 1});

JS.mixin(Vec4.prototype, {

    add: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] += b[0];
        a[1] += b[1];
        a[2] += b[2];
        a[3] += b[3];

        return this;
    },

    add2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];
        r[3] = a[3] + b[3];

        return this;
    },

    clone: function () {
        return new Vec4().copy(this);
    },

    copy: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] = b[0];
        a[1] = b[1];
        a[2] = b[2];
        a[3] = b[3];

        return this;
    },

    dot: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    },

    equals: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    },

    length: function () {
        var v = this.data;

        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
    },

    lengthSq: function () {
        var v = this.data;

        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3];
    },

    lerp: function (lhs, rhs, alpha) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + alpha * (b[0] - a[0]);
        r[1] = a[1] + alpha * (b[1] - a[1]);
        r[2] = a[2] + alpha * (b[2] - a[2]);
        r[3] = a[3] + alpha * (b[3] - a[3]);

        return this;
    },

    mul: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] *= b[0];
        a[1] *= b[1];
        a[2] *= b[2];
        a[3] *= b[3];

        return this;
    },

    mul2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] * b[0];
        r[1] = a[1] * b[1];
        r[2] = a[2] * b[2];
        r[3] = a[3] * b[3];

        return this;
    },

    normalize: function () {
        return this.scale(1 / this.length());
    },

    scale: function (scalar) {
        var v = this.data;

        v[0] *= scalar;
        v[1] *= scalar;
        v[2] *= scalar;
        v[3] *= scalar;

        return this;
    },

    set: function (x, y, z, w) {
        var v = this.data;

        v[0] = x;
        v[1] = y;
        v[2] = z;
        v[3] = w;

        return this;
    },

    sub: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] -= b[0];
        a[1] -= b[1];
        a[2] -= b[2];
        a[3] -= b[3];

        return this;
    },

    sub2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];
        r[2] = a[2] - b[2];
        r[3] = a[3] - b[3];

        return this;
    },

    toString: function () {
        return "(" + this.data[0] + ", " + this.data[1] + ", " + this.data[2] + ", " + this.data[3] + ")";
    }

});

Object.defineProperty(Vec4, 'ONE', {
    get: function () {
        return new Vec4(1, 1, 1, 1);
    }
});

Object.defineProperty(Vec4, 'ZERO', {
    get: function () {
        return new Vec4(0, 0, 0, 0);
    }
});

cc.v4 = function v4 (x, y, z, w) {
    return new Vec4(x, y, z, w);
};

Object.defineProperty(Vec4.prototype, 'x', {
    get: function () {
        return this.data[0];
    },
    set: function (value) {
        this.data[0] = value;
    },
});

Object.defineProperty(Vec4.prototype, 'y', {
    get: function () {
        return this.data[1];
    },
    set: function (value) {
        this.data[1] = value;
    },
});

Object.defineProperty(Vec4.prototype, 'z', {
    get: function () {
        return this.data[2];
    },
    set: function (value) {
        this.data[2] = value;
    },
});

Object.defineProperty(Vec4.prototype, 'w', {
    get: function () {
        return this.data[3];
    },
    set: function (value) {
        this.data[3] = value;
    },
});

cc.Vec4 = module.exports = Vec4;
