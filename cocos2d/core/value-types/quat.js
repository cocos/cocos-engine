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

var ValueType = require('./CCValueType');
var js = require('../platform/js');
var CCClass = require('../platform/CCClass');

/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Vec2
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
 */
function Quat (x, y, z, w) {
    if (x && typeof x === 'object') {
        z = x.z;
        y = x.y;
        x = x.x;
        w = x.w;
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
 * !#en TODO
 * !#zh 当前的向量是否与指定的向量相等。
 * @method equals
 * @param {Vec2} other
 * @return {Boolean}
 */
proto.equals = function (other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
};

proto.getRoll = function () {
    var sinr = 2.0 * (this.w * this.x + this.y * this.z);
    var cosr = 1.0 - 2.0 * (this.x * this.x + this.y * this.y);
    return 180 * Math.atan2(sinr, cosr) / Math.PI;
}

proto.getPitch = function () {
    var sinp = 2.0 * (this.w * this.y - this.z * this.x);
    var pitch = sinp > 1 ? 1 : sinp;
    pitch = sinp < -1 ? -1 : sinp;
    pitch = 180 * Math.asin(pitch) / Math.PI;
    return pitch;
}

proto.getYaw = function () {
    var siny = 2.0 * (this.w * this.z + this.x * this.y);
    var cosy = 1.0 - 2.0 * (this.y * this.y + this.z * this.z);  
    return 180 * Math.atan2(siny, cosy) / Math.PI;
}

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