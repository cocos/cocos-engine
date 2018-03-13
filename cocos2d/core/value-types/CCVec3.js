/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
 * see {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
 * !#zh
 * 构造函数，可查看 {{#crossLink "cc/vec3:method"}}cc.v3{{/crossLink}}
 * @method constructor
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 */
function Vec3 (x, y, z) {
    if (x && typeof x === 'object') {
        z = x.z;
        y = x.y;
        x = x.x;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}
js.extend(Vec3, ValueType);
CCClass.fastDefine('cc.Vec3', Vec3, { x: 0, y: 0, z: 0 });

/**
 * @property {Number} x
 */
/**
 * @property {Number} y
 */

var proto = Vec3.prototype;


/**
 * !#en clone a Vec3 value
 * !#zh 克隆一个 Vec3 值
 * @method clone
 * @return {Vec3}
 */
proto.clone = function () {
    return new Vec3(this.x, this.y, this.z);
};

/**
 * !#en TODO
 * !#zh 设置向量值。
 * @method set
 * @param {Vec3} newValue - !#en new value to set. !#zh 要设置的新值
 * @return {Vec3} returns this
 * @chainable
 */
proto.set = function (newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    this.z = newValue.z;
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
    return other && this.x === other.x && this.y === other.y && this.z === other.z;
};

/**
 * !#en The convenience method to create a new {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec3"}}cc.Vec3{{/crossLink}} 对象。
 * @method v3
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @return {Vec3}
 * @example
 * var v1 = cc.v3();
 * var v2 = cc.v3(0, 0, 0);
 * var v3 = cc.v3(v2);
 * var v4 = cc.v3({x: 100, y: 100, z: 0});
 */
cc.v3 = function v3 (x, y, z) {
    return new Vec3(x, y, z);
};

module.exports = cc.Vec3 = Vec3;