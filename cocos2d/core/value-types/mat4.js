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
const math = require('../renderer/render-engine').math;
const mat4 = math.mat4;

/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 *
 * @class Mat4
 * @extends ValueType
 */

/**
 * !#en
 * Constructor
 * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
 * !#zh
 * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
 * @method constructor
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 */
function Mat4 (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    let t = this;
    t.m00 = m00;
    t.m01 = m01;
    t.m02 = m02;
    t.m03 = m03;
    t.m04 = m10;
    t.m05 = m11;
    t.m06 = m12;
    t.m07 = m13;
    t.m08 = m20;
    t.m09 = m21;
    t.m10 = m22;
    t.m11 = m23;
    t.m12 = m30;
    t.m13 = m31;
    t.m14 = m32;
    t.m15 = m33;
}
js.extend(Mat4, ValueType);
CCClass.fastDefine('cc.Mat4', Mat4, { 
    m00: 1, m01: 0, m02: 0, m03: 0,
    m04: 0, m05: 1, m06: 0, m07: 0,
    m08: 0, m09: 0, m10: 1, m11: 0,
    m12: 0, m13: 0, m14: 0, m15: 1 });

js.mixin(Mat4.prototype, {

    /**
     * !#en clone a Mat4 object
     * !#zh 克隆一个 Mat4 对象
     * @method clone
     * @return {Mat4}
     */
    clone () {
        let t = this;
        return new Mat4(
            t.m00, t.m01, t.m02, t.m03,
            t.m04, t.m05, t.m06, t.m07,
            t.m08, t.m09, t.m10, t.m11,
            t.m12, t.m13, t.m14, t.m15);
    },

    /**
     * !#en Sets the matrix with another one's value
     * !#zh 用另一个矩阵设置这个矩阵的值。
     * @method set
     * @param {Mat4} srcObj
     * @return {Mat4} returns this
     * @chainable
     */
    set (s) {
        let t = this;
        t.m00 = s.m00;
        t.m01 = s.m01;
        t.m02 = s.m02;
        t.m03 = s.m03;
        t.m04 = s.m04;
        t.m05 = s.m05;
        t.m06 = s.m06;
        t.m07 = s.m07;
        t.m08 = s.m08;
        t.m09 = s.m09;
        t.m10 = s.m10;
        t.m11 = s.m11;
        t.m12 = s.m12;
        t.m13 = s.m13;
        t.m14 = s.m14;
        t.m15 = s.m15;
        return this;
    },

    /**
     * !#en Check whether two matrix equal
     * !#zh 当前的矩阵是否与指定的矩阵相等。
     * @method equals
     * @param {Mat4} other
     * @return {Boolean}
     */
    equals (other) {
        return mat4.exactEquals(this, other);
    },

    /**
     * !#en Check whether two matrix equal with default degree of variance.
     * !#zh
     * 近似判断两个矩阵是否相等。<br/>
     * 判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
     * @method fuzzyEquals
     * @param {Mat4} other
     * @return {Boolean}
     */
    fuzzyEquals (other) {
        return mat4.equals(this, other);
    },

    /**
     * !#en Transform to string with matrix informations
     * !#zh 转换为方便阅读的字符串。
     * @method toString
     * @return {string}
     */
    toString () {
        let t = this;
        return "[\n" +
            t.m00 + ", " + t.m01 + ", " + t.m02 + ", " + t.m03 + ",\n" +
            t.m04 + ", " + t.m05 + ", " + t.m06 + ", " + t.m07 + ",\n" +
            t.m08 + ", " + t.m09 + ", " + t.m10 + ", " + t.m11 + ",\n" +
            t.m12 + ", " + t.m13 + ", " + t.m14 + ", " + t.m15 + "\n" +
            "]"
            ;
    },

    /**
     * Set the matrix to the identity matrix
     * @method identity
     * @returns {Mat4} self
     * @chainable
     */
    identity () {
        return mat4.identity(this);
    },

    /**
     * Transpose the values of a mat4
     * @method transpose
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    transpose (out) {
        out = out || new cc.Mat4();
        return mat4.transpose(out, this);
    },

    /**
     * Inverts a mat4
     * @method invert
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    invert (out) {
        out = out || new cc.Mat4();
        return mat4.invert(out, this);
    },

    /**
     * Calculates the adjugate of a mat4
     * @method adjoint
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    adjoint (out) {
        out = out || new cc.Mat4();
        return mat4.adjoint(out, this);
    },

    /**
     * Calculates the determinant of a mat4
     * @method determinant
     * @returns {Number} determinant of a
     */
    determinant () {
        return mat4.determinant(this);
    },

    /**
     * Adds two Mat4
     * @method add
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    add (other, out) {
        out = out || new cc.Mat4();
        return mat4.add(out, this, other);
    },

    /**
     * Subtracts the current matrix with another one
     * @method sub
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    sub (other, out) {
        out = out || new cc.Mat4();
        return mat4.subtract(out, this, other);
    },

    /**
     * Subtracts the current matrix with another one
     * @method mul
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    mul (other, out) {
        out = out || new cc.Mat4();
        return mat4.multiply(out, this, other)
    },

    /**
     * Multiply each element of the matrix by a scalar.
     * @method mulScalar
     * @param {Number} number amount to scale the matrix's elements by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    mulScalar (number, out) {
        out = out || new cc.Mat4();
        return mat4.mulScalar(out, this, number);
    },

    /**
     * Translate a mat4 by the given vector
     * @method translate
     * @param {Vec3} v vector to translate by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    translate (v, out) {
        out = out || new cc.Mat4();
        return mat4.translate(out, this, v);
    },

    /**
     * Scales the mat4 by the dimensions in the given vec3
     * @method scale
     * @param {Vec3} v vector to scale by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    scale (v, out) {
        out = out || new cc.Mat4();
        return mat4.scale(out, this, v);
    },

    /**
     * Rotates a mat4 by the given angle around the given axis
     * @method rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vec3} axis the axis to rotate around
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    rotate (rad, axis, out) {
        out = out || new cc.Mat4();
        return mat4.rotate(out, this, rad, axis);
    },

    /**
     * Returns the translation vector component of a transformation matrix.
     * @method getTranslation
     * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
     * @return {Vec3} out
     */
    getTranslation (out) {
        out = out || new cc.Vec3();
        return mat4.getTranslation(out, this);
    },

    /**
     * Returns the scale factor component of a transformation matrix
     * @method getScale
     * @param  {Vec3} out Vector to receive scale component, if not provided, a new vec3 will be created
     * @return {Vec3} out
     */
    getScale (out) {
        out = out || new cc.Vec3();
        return mat4.getScaling(out, this);
    },

    /**
     * Returns the rotation factor component of a transformation matrix
     * @method getRotation
     * @param  {Quat} out Vector to receive rotation component, if not provided, a new quaternion object will be created
     * @return {Quat} out
     */
    getRotation (out) {
        out = out || new cc.Quat();
        return mat4.getRotation(out, this);
    },

    /**
     * Restore the matrix values from a quaternion rotation, vector translation and vector scale
     * @method fromRTS
     * @param {Quat} q Rotation quaternion
     * @param {Vec3} v Translation vector
     * @param {Vec3} s Scaling vector
     * @returns {Mat4} the current mat4 object
     * @chainable
     */
    fromRTS (q, v, s) {
        return mat4.fromRTS(this, q, v, s);
    },

    /**
     * Restore the matrix values from a quaternion rotation
     * @method fromQuat
     * @param {Quat} q Rotation quaternion
     * @returns {Mat4} the current mat4 object
     * @chainable
     */
    fromQuat (quat) {
        return mat4.fromQuat(this, quat);
    }
});

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 * @method mat4
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @return {Mat4}
 */
cc.mat4 = function mat4 (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    return new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
};

module.exports = cc.Mat4 = Mat4;
