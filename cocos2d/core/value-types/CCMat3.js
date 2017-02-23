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

var Mat3 = function () {
    this.data = new Float32Array(9);

    if (arguments.length === 9) {
        this.data.set(arguments);
    } else {
        this.setIdentity();
    }
};

JS.extend(Mat3, ValueType);
//todo add something here
CCClass.fastDefine('cc.Mat3', Mat3, {m:[1,0,0,0,1,0,0,0,1]});

JS.mixin(Mat3.prototype,{

    clone: function () {
        return new Mat3().copy(this);
    },

    copy: function (rhs) {
        var src = rhs.data;
        var dst = this.data;

        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];

        return this;
    },

    equals: function (rhs) {
        var l = this.data;
        var r = rhs.data;

        return ((l[0] === r[0]) &&
        (l[1] === r[1]) &&
        (l[2] === r[2]) &&
        (l[3] === r[3]) &&
        (l[4] === r[4]) &&
        (l[5] === r[5]) &&
        (l[6] === r[6]) &&
        (l[7] === r[7]) &&
        (l[8] === r[8]));
    },

    isIdentity: function () {
        var m = this.data;
        return ((m[0] === 1) &&
        (m[1] === 0) &&
        (m[2] === 0) &&
        (m[3] === 0) &&
        (m[4] === 1) &&
        (m[5] === 0) &&
        (m[6] === 0) &&
        (m[7] === 0) &&
        (m[8] === 1));
    },

    setIdentity: function () {
        var m = this.data;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;

        m[3] = 0;
        m[4] = 1;
        m[5] = 0;

        m[6] = 0;
        m[7] = 0;
        m[8] = 1;

        return this;
    },

    transpose: function () {
        var m = this.data;

        var tmp;
        tmp = m[1]; m[1] = m[3]; m[3] = tmp;
        tmp = m[2]; m[2] = m[6]; m[6] = tmp;
        tmp = m[5]; m[5] = m[7]; m[7] = tmp;

        return this;
    },

    toString: function () {
        var t = "(";
        for (var i = 0; i < 9; i++) {
            t += this.data[i];
            t += (i !== 9) ? ", " : "";
        }
        t += ")";
        return t;
    },

});

JS.mixin(Mat3.prototype, {
    _serialize: CC_EDITOR && function () {
        return Array.prototype.slice.call(this.data);
    },
    _deserialize: function (data, handle) {
        this.data.set(data);
    }
});

Object.defineProperty(Mat3, 'IDENTITY', {
    get: function () {
        return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
});

Object.defineProperty(Mat3, 'ZERO', {
    get: function () {
        return new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
});

cc.Mat3 = module.exports = Mat3;
