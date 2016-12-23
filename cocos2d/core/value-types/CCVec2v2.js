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

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Vec2
 * @extends ValueType
 *
 */

/**
 * !#en
 * Constructor
 * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
 * !#zh
 * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
 * @method Vec2
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {Vec2}
 */
function Vec2 (x, y) {
    if (x && typeof x === 'object') {
        y = x.y;
        x = x.x;
    }

    this.data = new Float32Array(2);
    this.data[0] = x || 0;
    this.data[1] = y || 0;
}
JS.extend(Vec2, ValueType);
CCClass.fastDefine('cc.Vec2v2', Vec2, { x: 0, y: 0});

JS.mixin(Vec2.prototype, {

    clone: function () {
        return new Vec2().copy(this);
    },

    copy: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] = b[0];
        a[1] = b[1];

        return this;
    },

    add: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] += b[0];
        a[1] += b[1];

        return this;
    },

    add2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];

        return this;
    },

    sub: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] -= b[0];
        a[1] -= b[1];

        return this;
    },

    sub2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] - b[0];
        r[1] = a[1] - b[1];

        return this;
    },

    dot: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] * b[0] + a[1] * b[1];
    },

    equals: function (rhs) {
        var a = this.data,
            b = rhs.data;

        return a[0] === b[0] && a[1] === b[1];
    },

    length: function () {
        var v = this.data;

        return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    },

    lengthSq: function () {
        var v = this.data;

        return v[0] * v[0] + v[1] * v[1];
    },

    lerp: function (lhs, rhs, alpha) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] + alpha * (b[0] - a[0]);
        r[1] = a[1] + alpha * (b[1] - a[1]);

        return this;
    },

    mul: function (rhs) {
        var a = this.data,
            b = rhs.data;

        a[0] *= b[0];
        a[1] *= b[1];

        return this;
    },

    mul2: function (lhs, rhs) {
        var a = lhs.data,
            b = rhs.data,
            r = this.data;

        r[0] = a[0] * b[0];
        r[1] = a[1] * b[1];

        return this;
    },

    normalize: function () {
        return this.scale(1 / this.length());
    },

    scale: function (scalar) {
        var v = this.data;

        v[0] *= scalar;
        v[1] *= scalar;

        return this;
    },

    set: function (x, y) {
        var v = this.data;

        v[0] = x;
        v[1] = y;

        return this;
    },


    toString: function () {
        return "(" + this.data[0] + ", " + this.data[1] + ")";
    }
});

Object.defineProperty(Vec2, 'ONE', {
    get: function() {
        return new Vec2(1, 1);
    }
});

Object.defineProperty(Vec2, 'RIGHT', {
    get: function() {
        return new Vec2(1, 0);
    }
});

Object.defineProperty(Vec2, 'UP', {
    get: function() {
        return new Vec2(0, 1);
    }
});

Object.defineProperty(Vec2, 'ZERO', {
    get: function() {
        return new Vec2(0, 0);
    }
});

Object.defineProperty(Vec2.prototype, 'x', {
    get: function () {
        return this.data[0];
    },
    set: function (value) {
        this.data[0] = value;
    },
});

Object.defineProperty(Vec2.prototype, 'y', {
    get: function () {
        return this.data[1];
    },
    set: function (value) {
        this.data[1] = value;
    },
});

cc.Vec2v2 = module.exports = Vec2;
