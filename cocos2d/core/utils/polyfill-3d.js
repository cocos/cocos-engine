/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

const renderEngine = require('../renderer/render-engine');
const math = renderEngine.math;

// ====== Node transform polyfills ======
const ONE_DEGREE = Math.PI / 180;

let _updateLocalMatrix2d = null;
let _calculWorldMatrix2d = null;

function _updateLocalMatrix3d () {
    if (this._localMatDirty) {
        // Update transform
        let t = this._matrix;
        math.mat4.fromRTS(t, this._quat, this._position, this._scale);

        // skew
        if (this._skewX || this._skewY) {
            let a = t.m00, b = t.m01, c = t.m04, d = t.m05;
            let skx = Math.tan(this._skewX * ONE_DEGREE);
            let sky = Math.tan(this._skewY * ONE_DEGREE);
            if (skx === Infinity)
                skx = 99999999;
            if (sky === Infinity)
                sky = 99999999;
            t.m00 = a + c * sky;
            t.m01 = b + d * sky;
            t.m04 = c + a * skx;
            t.m05 = d + b * skx;
        }
        this._localMatDirty = 0;
        // Register dirty status of world matrix so that it can be recalculated
        this._worldMatDirty = true;
    }
}

function _calculWorldMatrix3d () {
    // Avoid as much function call as possible
    if (this._localMatDirty) {
        this._updateLocalMatrix();
    }

    if (this._parent) {
        let parentMat = this._parent._worldMatrix;
        math.mat4.mul(this._worldMatrix, parentMat, this._matrix);
    }
    else {
        math.mat4.copy(this._worldMatrix, this._matrix);
    }
    this._worldMatDirty = false;
}

module.exports = {
    enabled: false,
    enable () {
        if (!_updateLocalMatrix2d) {
            _updateLocalMatrix2d = cc.Node.prototype._updateLocalMatrix;
            _calculWorldMatrix2d = cc.Node.prototype._calculWorldMatrix;
        }
        if (!this.enabled) {
            cc.Node.prototype._updateLocalMatrix = _updateLocalMatrix3d;
            cc.Node.prototype._calculWorldMatrix = _calculWorldMatrix3d;
            this.enabled = true;
        }
    },
    disable () {
        if (this.enabled) {
            cc.Node.prototype._updateLocalMatrix = _updateLocalMatrix2d;
            cc.Node.prototype._calculWorldMatrix = _calculWorldMatrix2d;
            this.enabled = false;
        }
    }
}