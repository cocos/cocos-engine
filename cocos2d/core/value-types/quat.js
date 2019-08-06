/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const ValueType = require('./value-type');
const js = require('../platform/js');
const CCClass = require('../platform/CCClass');
const quat = require('../vmath/quat');

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Quat
 * @extends ValueType
 */

/**
 * !#en
 * Constructor
 * see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
 * !#zh
 * 构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
 * @method constructor
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @param {number} [w=1]
 */
function Quat (x, y, z, w) {
    if (x && typeof x === 'object') {
        z = x.z;
        y = x.y;
        w = x.w;
        x = x.x;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
}
js.extend(Quat, ValueType);
CCClass.fastDefine('cc.Quat', Quat, { x: 0, y: 0, z: 0, w: 1 });

/**
 * @property {Number} x
 */
/**
 * @property {Number} y
 */
/**
 * @property {Number} z
 */
/**
 * @property {Number} w
 */

var proto = Quat.prototype;


/**
 * !#en clone a Quat object and return the new object
 * !#zh 克隆一个四元数并返回
 * @method clone
 * @return {Quat}
 */
proto.clone = function () {
    return new Quat(this.x, this.y, this.z, this.w);
};

/**
 * !#en Set values with another quaternion
 * !#zh 用另一个四元数的值设置到当前对象上。
 * @method set
 * @param {Quat} newValue - !#en new value to set. !#zh 要设置的新值
 * @return {Quat} returns this
 * @chainable
 */
proto.set = function (newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    this.z = newValue.z;
    this.w = newValue.w;
    return this;
};

/**
 * !#en Check whether current quaternion equals another
 * !#zh 当前的四元数是否与指定的四元数相等。
 * @method equals
 * @param {Quat} other
 * @return {Boolean}
 */
proto.equals = function (other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
};

/**
 * !#en Convert quaternion to euler
 * !#zh 转换四元数到欧拉角
 * @method toEuler
 * @param {Vec3} out
 * @return {Vec3}
 */
proto.toEuler = function (out) {
    quat.toEuler(out, this);
    return out;
};

/**
 * !#en Convert euler to quaternion
 * !#zh 转换欧拉角到四元数
 * @method fromEuler
 * @param {Vec3} euler
 * @return {Quat}
 */
proto.fromEuler = function (euler) {
    quat.fromEuler(this, euler.x, euler.y, euler.z);
    return this;
};

/**
 * !#en Calculate the interpolation result between this quaternion and another one with given ratio
 * !#zh 计算四元数的插值结果
 * @member lerp
 * @param {Quat} to
 * @param {Number} ratio
 * @param {Quat} [out]
 * @returns {Quat} out
 */
proto.lerp = function (to, ratio, out) {
    out = out || new cc.Quat();
    quat.slerp(out, this, to, ratio);
    return out;
};

/**
 * !#en Calculate the multiply result between this quaternion and another one
 * !#zh 计算四元数乘积的结果
 * @member lerp
 * @param {Quat} to
 * @param {Number} ratio
 * @param {Quat} [out]
 * @returns {Quat} out
 */
proto.mul = function (other, out) {
    out = out || new cc.Quat();
    quat.mul(out, this, other);
    return out;
};

proto.array = function (out) {
    quat.array(out, this);
};

/**
 * !#en Rotates a quaternion by the given angle (in radians) about a world space axis.
 * !#zh 围绕世界空间轴按给定弧度旋转四元数
 * @member rotateAround
 * @param {Quat} rot - Quaternion to rotate
 * @param {Vec3} axis - The axis around which to rotate in world space
 * @param {Number} rad - Angle (in radians) to rotate
 * @param {Quat} [out] - Quaternion to store result
 * @returns {Quat} out
 */
proto.rotateAround = function(rot, axis, rad, out) {
    out = out || new cc.Quat();
    return quat.rotateAround(out, rot, axis, rad);
};

/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
 * @method quat
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @param {Number} [w=1]
 * @return {Quat}
 */
cc.quat = function quat (x, y, z, w) {
    return new Quat(x, y, z, w);
};

module.exports = cc.Quat = Quat;
