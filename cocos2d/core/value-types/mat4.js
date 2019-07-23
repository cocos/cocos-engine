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

import { mat4 } from '../vmath';

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
    this.m = new Float32Array(16);
    let tm = this.m;
    tm[0] = m00;
    tm[1] = m01;
    tm[2] = m02;
    tm[3] = m03;
    tm[4] = m10;
    tm[5] = m11;
    tm[6] = m12;
    tm[7] = m13;
    tm[8] = m20;
    tm[9] = m21;
    tm[10] = m22;
    tm[11] = m23;
    tm[12] = m30;
    tm[13] = m31;
    tm[14] = m32;
    tm[15] = m33;
}
js.extend(Mat4, ValueType);
CCClass.fastDefine('cc.Mat4', Mat4, { 
    m00: 1, m01: 0, m02: 0, m03: 0,
    m04: 0, m05: 1, m06: 0, m07: 0,
    m08: 0, m09: 0, m10: 1, m11: 0,
    m12: 0, m13: 0, m14: 0, m15: 1 });

for (let i = 0; i < 16; i++) {
    Object.defineProperty(Mat4.prototype, 'm' + i, {
        get () {
            return this.m[i];
        },
        set (value) {
            this.m[i] = value;
        },
    });
}

js.mixin(Mat4.prototype, {

    /**
     * !#en clone a Mat4 object
     * !#zh 克隆一个 Mat4 对象
     * @method clone
     * @return {Mat4}
     */
    clone () {
        let t = this;
        let tm = t.m;
        return new Mat4(
            tm[0], tm[1], tm[2], tm[3],
            tm[4], tm[5], tm[6], tm[7],
            tm[8], tm[9], tm[10], tm[11],
            tm[12], tm[13], tm[14], tm[15]);
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
        let tm = t.m, sm = s.m;
        tm[0] = sm[0];
        tm[1] = sm[1];
        tm[2] = sm[2];
        tm[3] = sm[3];
        tm[4] = sm[4];
        tm[5] = sm[5];
        tm[6] = sm[6];
        tm[7] = sm[7];
        tm[8] = sm[8];
        tm[9] = sm[9];
        tm[10] = sm[10];
        tm[11] = sm[11];
        tm[12] = sm[12];
        tm[13] = sm[13];
        tm[14] = sm[14];
        tm[15] = sm[15];
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
        let tm = this.m;
        if (tm) {
            return "[\n" +
            tm[0] + ", " + tm[1] + ", " + tm[2] + ", " + tm[3] + ",\n" +
            tm[4] + ", " + tm[5] + ", " + tm[6] + ", " + tm[7] + ",\n" +
            tm[8] + ", " + tm[9] + ", " + tm[10] + ", " + tm[11] + ",\n" +
            tm[12] + ", " + tm[13] + ", " + tm[14] + ", " + tm[15] + "\n" +
            "]";
        } else {
            return "[\n" +
            "1, 0, 0, 0\n"+
            "0, 1, 0, 0\n" +
            "0, 0, 1, 0\n" +
            "0, 0, 0, 1\n" +
            "]";
        }
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
    },

    array (out) {
        return mat4.array(out, this);
    }
});

/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 * @method mat4
 * @param {Number} [m00] Component in column 0, row 0 position (index 0)
 * @param {Number} [m01] Component in column 0, row 1 position (index 1)
 * @param {Number} [m02] Component in column 0, row 2 position (index 2)
 * @param {Number} [m03] Component in column 0, row 3 position (index 3)
 * @param {Number} [m10] Component in column 1, row 0 position (index 4)
 * @param {Number} [m11] Component in column 1, row 1 position (index 5)
 * @param {Number} [m12] Component in column 1, row 2 position (index 6)
 * @param {Number} [m13] Component in column 1, row 3 position (index 7)
 * @param {Number} [m20] Component in column 2, row 0 position (index 8)
 * @param {Number} [m21] Component in column 2, row 1 position (index 9)
 * @param {Number} [m22] Component in column 2, row 2 position (index 10)
 * @param {Number} [m23] Component in column 2, row 3 position (index 11)
 * @param {Number} [m30] Component in column 3, row 0 position (index 12)
 * @param {Number} [m31] Component in column 3, row 1 position (index 13)
 * @param {Number} [m32] Component in column 3, row 2 position (index 14)
 * @param {Number} [m33] Component in column 3, row 3 position (index 15)
 * @return {Mat4}
 */
cc.mat4 = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    let mat = new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    if (m00 === undefined) {
        mat4.identity(mat);
    }
    return mat;
};

module.exports = cc.Mat4 = Mat4;
