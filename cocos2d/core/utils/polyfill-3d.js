/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const POSITION_ON = 1 << 0;
const SCALE_ON = 1 << 1;
const ROTATION_ON = 1 << 2;

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


    
/**
 * !#en Returns a copy of the position (x, y, z) of the node in its parent's coordinates.
 * !#zh 获取节点在父节点坐标系中的位置（x, y, z）。
 * @method getPosition
 * @return {Vec3} The position (x, y, z) of the node in its parent's coordinates
 */
function getPosition () {
    return new cc.Vec3(this._position);
}

/**
 * !#en
 * Sets the position (x, y, z) of the node in its parent's coordinates.<br/>
 * Usually we use cc.v3(x, y, z) to compose cc.Vec3 object.<br/>
 * and Passing two numbers (x, y, z) is more efficient than passing cc.Vec3 object.
 * !#zh
 * 设置节点在父节点坐标系中的位置。<br/>
 * 可以通过两种方式设置坐标点：<br/>
 * 1. 传入 3 个数值 x, y, z。<br/>
 * 2. 传入 cc.v3(x, y, z) 类型为 cc.Vec3 的对象。
 * @method setPosition
 * @param {Vec3|Number} newPosOrX - X coordinate for position or the position (x, y, z) of the node in coordinates
 * @param {Number} [y] - Y coordinate for position
 * @param {Number} [z] - Z coordinate for position
 */
function setPosition (newPosOrX, y, z) {
    var x;
    if (y === undefined) {
        x = newPosOrX.x;
        y = newPosOrX.y;
        z = newPosOrX.z;
    }
    else {
        x = newPosOrX;
    }

    var pos = this._position;
    if (pos.x === x && pos.y === y && pos.z === z) {
        return;
    }

    if (CC_EDITOR) {
        var oldPosition = new cc.Vec3(pos);
    }

    pos.x = x;
    pos.y = y;
    pos.z = z || 0;
    this.setLocalDirty(POSITION_DIRTY_FLAG);

    // fast check event
    if (this._eventMask & POSITION_ON) {
        this.emit(cc.Node.EventType.POSITION_CHANGED);
    }
}

/**
 * !#en Get rotation of node (in quaternion).
 * !#zh 获取该节点的 quaternion 旋转角度。
 * @method getQuat
 * @return {cc.Quat} Quaternion object represents the rotation
 */
function getQuat () {
    return math.quat.clone(this._quat);
}

/**
 * !#en Set rotation of node (in quaternion).
 * !#zh 设置该节点的 quaternion 旋转角度。
 * @method setQuat
 * @param {cc.Quat} quat Quaternion object represents the rotation
 */
function setQuat (quat) {
    if (!this._quat.equals(value)) {
        math.quat.copy(this._quat, value);
        this.setLocalDirty(ROTATION_DIRTY_FLAG);

        if (this._eventMask & ROTATION_ON) {
            this.emit(cc.Node.EventType.ROTATION_CHANGED);
        }
    }
}

/**
 * !#en
 * Returns the scale of the node.
 * !#zh 获取节点的缩放。
 * @method getScale
 * @return {cc.Vec3} The scale factor
 */
function getScale () {
    return cc.v3(this._scale);
}

/**
 * !#en Sets the scale of three axis in local coordinates of the node.
 * !#zh 设置节点在本地坐标系中三个坐标轴上的缩放比例。
 * @method setScale
 * @param {Number|Vec3} x - scaleX or scale object
 * @param {Number} [y]
 * @param {Number} [z]
 * @example
 * node.setScale(cc.v2(2, 2, 2));
 * node.setScale(2);
 */
function setScale (x, y, z) {
    if (x && typeof x !== 'number') {
        y = x.y;
        z = x.z || 1;
        x = x.x;
    }
    else if (x !== undefined && y === undefined) {
        y = x;
        z = x;
    }
    else {
        return;
    }
    if (this._scale.x !== x || this._scale.y !== y) {
        this._scale.x = x;
        this._scale.y = y;
        this.setLocalDirty(SCALE_DIRTY_FLAG);

        var cache = this._hasListenerCache;
        if (this._eventMask & SCALE_ON) {
            this.emit(cc.Node.EventType.SCALE_CHANGED);
        }
    }
}

module.exports = {
    enabled: false,
    enable () {
        let proto = cc.Node.prototype;
        if (!_updateLocalMatrix2d) {
            _updateLocalMatrix2d = proto._updateLocalMatrix;
            _calculWorldMatrix2d = proto._calculWorldMatrix;
        }
        if (!this.enabled) {
            proto._updateLocalMatrix = _updateLocalMatrix3d;
            proto._calculWorldMatrix = _calculWorldMatrix3d;

            proto.getPosition = getPosition;
            proto.setPosition = setPosition;
            proto.getScale = getScale;
            proto.setScale = setScale;
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