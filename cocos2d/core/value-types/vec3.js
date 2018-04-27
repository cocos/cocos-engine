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

var ValueType = require('./value-type');
var js = require('../platform/js');
var CCClass = require('../platform/CCClass');
var math = require('../renderer/render-engine').math;

/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec3
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
/**
 * @property {Number} z
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
 * !#en Set the current vector value with the given vector.
 * !#zh 用另一个向量设置当前的向量对象值。
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
 * !#en Check whether the vector equals another one
 * !#zh 当前的向量是否与指定的向量相等。
 * @method equals
 * @param {Vec3} other
 * @return {Boolean}
 */
proto.equals = function (other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z;
};


/**
 * !#en Check whether two vector equal with some degree of variance.
 * !#zh
 * 近似判断两个点是否相等。<br/>
 * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
 * @method pFuzzyEqual
 * @param {Vec3} other
 * @param {Number} variance
 * @return {Boolean}
 */
proto.fuzzyEquals = function (other, variance) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
        if (this.y - variance <= other.y && other.y <= this.y + variance) {
            if (this.z - variance <= other.z && other.z <= this.z + variance)
                return true;
        }
    }
    return false;
};

/**
 * !#en Transform to string with vector informations
 * !#zh 转换为方便阅读的字符串。
 * @method toString
 * @return {string}
 */
proto.toString = function () {
    return "(" +
           this.x.toFixed(2) + ", " +
           this.y.toFixed(2) + ", " +
           this.z.toFixed(2) + ")"
        ;
};

/**
 * !#en Calculate linear interpolation result between this vector and another one with given ratio
 * !#zh 线性插值。
 * @method lerp
 * @param {Vec3} to
 * @param {number} ratio - the interpolation coefficient
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3}
 */
proto.lerp = function (to, ratio, out) {
    out = out || new Vec3();
    math.vec3.lerp(out, this, to, ratio);
    return out;
};

/**
 * !#en Clamp the vector between from float and to float.
 * !#zh
 * 返回指定限制区域后的向量。<br/>
 * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
 * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
 * 否则返回自身。
 * @method clampf
 * @param {Vec3} min_inclusive
 * @param {Vec3} max_inclusive
 * @return {Vec3}
 */
proto.clampf = function (min_inclusive, max_inclusive) {
    this.x = misc.clampf(this.x, min_inclusive.x, max_inclusive.x);
    this.y = misc.clampf(this.y, min_inclusive.y, max_inclusive.y);
    this.z = misc.clampf(this.z, min_inclusive.z, max_inclusive.z);
    return this;
};

/**
 * !#en Adds this vector. If you want to save result to another vector, use add() instead.
 * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
 * @method addSelf
 * @param {Vec3} vector
 * @return {Vec3} returns this
 * @chainable
 */
proto.addSelf = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
};

/**
 * !#en Adds two vectors, and returns the new result.
 * !#zh 向量加法，并返回新结果。
 * @method add
 * @param {Vec3} vector
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.add = function (vector, out) {
    out = out || new Vec3();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    return out;
};

/**
 * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
 * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
 * @method subSelf
 * @param {Vec3} vector
 * @return {Vec3} returns this
 * @chainable
 */
proto.subSelf = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    return this;
};

/**
 * !#en Subtracts one vector from this, and returns the new result.
 * !#zh 向量减法，并返回新结果。
 * @method sub
 * @param {Vec3} vector
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.sub = function (vector, out) {
    out = out || new Vec3();
    out.x = this.x - vector.x;
    out.y = this.y - vector.y;
    out.z = this.z - vector.z;
    return out;
};

/**
 * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
 * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
 * @method mulSelf
 * @param {number} num
 * @return {Vec3} returns this
 * @chainable
 */
proto.mulSelf = function (num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    return this;
};

/**
 * !#en Multiplies by a number, and returns the new result.
 * !#zh 缩放向量，并返回新结果。
 * @method mul
 * @param {number} num
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.mul = function (num, out) {
    out = out || new Vec3();
    out.x = this.x * num;
    out.y = this.y * num;
    out.z = this.z * num;
    return out;
};

/**
 * !#en Multiplies two vectors.
 * !#zh 分量相乘。
 * @method scaleSelf
 * @param {Vec3} vector
 * @return {Vec3} returns this
 * @chainable
 */
proto.scaleSelf = function (vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    return this;
};

/**
 * !#en Multiplies two vectors, and returns the new result.
 * !#zh 分量相乘，并返回新的结果。
 * @method scale
 * @param {Vec3} vector
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.scale = function (vector, out) {
    out = out || new Vec3();
    out.x = this.x * vector.x;
    out.y = this.y * vector.y;
    out.z = this.z * vector.z;
    return out;
};

/**
 * !#en Divides by a number. If you want to save result to another vector, use div() instead.
 * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
 * @method divSelf
 * @param {Vec3} vector
 * @return {Vec3} returns this
 * @chainable
 */
proto.divSelf = function (num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    return this;
};

/**
 * !#en Divides by a number, and returns the new result.
 * !#zh 向量除法，并返回新的结果。
 * @method div
 * @param {Vec3} vector
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.div = function (num, out) {
    out = out || new Vec3();
    out.x = this.x / num;
    out.y = this.y / num;
    out.z = this.z / num;
    return out;
};

/**
 * !#en Negates the components. If you want to save result to another vector, use neg() instead.
 * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
 * @method negSelf
 * @return {Vec3} returns this
 * @chainable
 */
proto.negSelf = function () {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * !#en Negates the components, and returns the new result.
 * !#zh 返回取反后的新向量。
 * @method neg
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} the result
 */
proto.neg = function (out) {
    out = out || new Vec3();
    out.x = -this.x;
    out.y = -this.y;
    out.z = -this.z;
    return out;
};

/**
 * !#en Dot product
 * !#zh 当前向量与指定向量进行点乘。
 * @method dot
 * @param {Vec3} [vector]
 * @return {number} the result
 */
proto.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
};

/**
 * !#en Cross product
 * !#zh 当前向量与指定向量进行叉乘。
 * @method cross
 * @param {Vec3} vector
 * @param {Vec3} [out]
 * @return {Vec3} the result
 */
proto.cross = function (vector, out) {
    out = out || new Vec3();
    math.vec3.cross(out, this, vector)
    return out;
};

/**
 * !#en Returns the length of this vector.
 * !#zh 返回该向量的长度。
 * @method mag
 * @return {number} the result
 * @example
 * var v = cc.v2(10, 10);
 * v.mag(); // return 14.142135623730951;
 */
proto.mag = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
 * !#en Returns the squared length of this vector.
 * !#zh 返回该向量的长度平方。
 * @method magSqr
 * @return {number} the result
 */
proto.magSqr = function () {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

/**
 * !#en Make the length of this vector to 1.
 * !#zh 向量归一化，让这个向量的长度为 1。
 * @method normalizeSelf
 * @return {Vec3} returns this
 * @chainable
 */
proto.normalizeSelf = function () {
    math.vec3.normalize(this, this);
    return this;
};

/**
 * !#en
 * Returns this vector with a magnitude of 1.<br/>
 * <br/>
 * Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
 * !#zh
 * 返回归一化后的向量。<br/>
 * <br/>
 * 注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
 * @method normalize
 * @param {Vec3} [out] - optional, the receiving vector
 * @return {Vec3} result
 */
proto.normalize = function (out) {
    out = out || new Vec3();
    math.vec3.normalize(out, this);
    return out;
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