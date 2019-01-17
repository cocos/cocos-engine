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

import { Vec3 } from 'cannon';
import CCClass from '../data/class';
import { mat4 } from '../vmath';
import Quat from './quat';
import { ValueType } from './value-type';

/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 */
export default class Mat4 extends ValueType {
    public m00: number;
    public m01: number;
    public m02: number;
    public m03: number;
    public m04: number;
    public m05: number;
    public m06: number;
    public m07: number;
    public m08: number;
    public m09: number;
    public m10: number;
    public m11: number;
    public m12: number;
    public m13: number;
    public m14: number;
    public m15: number;

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     *
     * @param other
     */
    constructor (other: Mat4);

    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     *
     * @param m00 Component in column 0, row 0 position (index 0)
     * @param m01 Component in column 0, row 1 position (index 1)
     * @param m02 Component in column 0, row 2 position (index 2)
     * @param m03 Component in column 0, row 3 position (index 3)
     * @param m10 Component in column 1, row 0 position (index 4)
     * @param m11 Component in column 1, row 1 position (index 5)
     * @param m12 Component in column 1, row 2 position (index 6)
     * @param m13 Component in column 1, row 3 position (index 7)
     * @param m20 Component in column 2, row 0 position (index 8)
     * @param m21 Component in column 2, row 1 position (index 9)
     * @param m22 Component in column 2, row 2 position (index 10)
     * @param m23 Component in column 2, row 3 position (index 11)
     * @param m30 Component in column 3, row 0 position (index 12)
     * @param m31 Component in column 3, row 1 position (index 13)
     * @param m32 Component in column 3, row 2 position (index 14)
     * @param m33 Component in column 3, row 3 position (index 15)
     */
    constructor (
        m00?: number, m01?: number, m02?: number, m03?: number,
        m04?: number, m05?: number, m06?: number, m07?: number,
        m08?: number, m09?: number, m10?: number, m11?: number,
        m12?: number, m13?: number, m14?: number, m15?: number);

    constructor (
        m00: Mat4 | number = 1, m01 = 0, m02 = 0, m03 = 0,
        m04 = 0, m05 = 1, m06 = 0, m07 = 0,
        m08 = 0, m09 = 0, m10 = 1, m11 = 0,
        m12 = 0, m13 = 0, m14 = 0, m15 = 1) {
        super();
        if (typeof m00 === 'object') {
            this.m01 = m00.m01; this.m02 = m00.m02; this.m03 = m00.m03; this.m04 = m00.m04;
            this.m05 = m00.m05; this.m06 = m00.m06; this.m07 = m00.m07; this.m08 = m00.m08;
            this.m09 = m00.m09; this.m10 = m00.m10; this.m11 = m00.m11; this.m12 = m00.m12;
            this.m13 = m00.m13; this.m14 = m00.m14; this.m15 = m00.m15; this.m00 = m00.m00;
        } else {
            this.m01 = m01; this.m02 = m02; this.m03 = m03; this.m04 = m04;
            this.m05 = m05; this.m06 = m06; this.m07 = m07; this.m08 = m08;
            this.m09 = m09; this.m10 = m10; this.m11 = m11; this.m12 = m12;
            this.m13 = m13; this.m14 = m14; this.m15 = m15; this.m00 = m00;
        }
    }

    /**
     * !#en clone a Mat4 object
     * !#zh 克隆一个 Mat4 对象
     *
     * @return
     */
    public clone () {
        const t = this;
        return new Mat4(
            t.m00, t.m01, t.m02, t.m03,
            t.m04, t.m05, t.m06, t.m07,
            t.m08, t.m09, t.m10, t.m11,
            t.m12, t.m13, t.m14, t.m15);
    }

    /**
     * !#en Sets the matrix with another one's value
     * !#zh 用另一个矩阵设置这个矩阵的值。
     *
     * @param srcObj
     * @return returns this
     * @chainable
     */
    public set (other: Mat4) {
        const t = this;
        t.m00 = other.m00;
        t.m01 = other.m01;
        t.m02 = other.m02;
        t.m03 = other.m03;
        t.m04 = other.m04;
        t.m05 = other.m05;
        t.m06 = other.m06;
        t.m07 = other.m07;
        t.m08 = other.m08;
        t.m09 = other.m09;
        t.m10 = other.m10;
        t.m11 = other.m11;
        t.m12 = other.m12;
        t.m13 = other.m13;
        t.m14 = other.m14;
        t.m15 = other.m15;
        return this;
    }

    /**
     * !#en Check whether two matrix equal
     * !#zh 当前的矩阵是否与指定的矩阵相等。
     *
     * @param other
     * @return
     */
    public equals (other: Mat4) {
        return mat4.exactEquals(this, other);
    }

    /**
     * !#en Check whether two matrix equal with default degree of variance.
     * !#zh
     * 近似判断两个矩阵是否相等。<br/>
     * 判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
     *
     * @param other
     * @return
     */
    public fuzzyEquals (other: Mat4) {
        return mat4.equals(this, other);
    }

    /**
     * !#en Transform to string with matrix informations
     * !#zh 转换为方便阅读的字符串。
     *
     * @return
     */
    public toString () {
        const t = this;
        return '[\n' +
            t.m00 + ', ' + t.m01 + ', ' + t.m02 + ', ' + t.m03 + ',\n' +
            t.m04 + ', ' + t.m05 + ', ' + t.m06 + ', ' + t.m07 + ',\n' +
            t.m08 + ', ' + t.m09 + ', ' + t.m10 + ', ' + t.m11 + ',\n' +
            t.m12 + ', ' + t.m13 + ', ' + t.m14 + ', ' + t.m15 + '\n' +
            ']'
            ;
    }

    /**
     * Set the matrix to the identity matrix
     *
     * @return self
     * @chainable
     */
    public identity () {
        return mat4.identity(this);
    }

    /**
     * Transpose the values of a mat4
     *
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public transpose (out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.transpose(out, this);
    }

    /**
     * Inverts a mat4
     *
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public invert (out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.invert(out, this);
    }

    /**
     * Calculates the adjugate of a mat4
     *
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public adjoint (out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.adjoint(out, this);
    }

    /**
     * Calculates the determinant of a mat4
     *
     * @return determinant of a
     */
    public determinant () {
        return mat4.determinant(this);
    }

    /**
     * Adds two Mat4
     *
     * @param other the second operand
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public add (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.add(out, this, other);
    }

    /**
     * Subtracts the current matrix with another one
     *
     * @param other the second operand
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public sub (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.subtract(out, this, other);
    }

    /**
     * Subtracts the current matrix with another one
     *
     * @param other the second operand
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public mul (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.multiply(out, this, other);
    }

    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param number amount to scale the matrix's elements by
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public mulScalar (num: number, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.scale(out, this, num);
    }

    /**
     * Translate a mat4 by the given vector
     *
     * @param v vector to translate by
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public translate (v: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.translate(out, this, v);
    }

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param v vector to scale by
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public scale (v: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.scale(out, this, v);
    }

    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param rad the angle to rotate the matrix by
     * @param axis the axis to rotate around
     * @param [out] The receiving matrix, can be `this`; if absent, a new matrix would be created.
     * @return out
     */
    public rotate (rad: number, axis: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return mat4.rotate(out, this, rad, axis);
    }

    /**
     * Returns the translation vector component of a transformation matrix.
     *
     * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
     * @return out
     */
    public getTranslation (out?: Mat4) {
        out = out || new cc.Vec3();
        return mat4.getTranslation(out, this);
    }

    /**
     * Returns the scale factor component of a transformation matrix
     *
     * @param out Vector to receive scale component, if not provided, a new vec3 will be created
     * @return out
     */
    public getScale (out: Vec3) {
        out = out || new cc.Vec3();
        return mat4.getScaling(out, this);
    }

    /**
     * Returns the rotation factor component of a transformation matrix
     *
     * @param out Vector to receive rotation component, if not provided, a new quaternion object will be created
     * @return out
     */
    public getRotation (out: Quat) {
        out = out || new Quat();
        return mat4.getRotation(out, this);
    }

    /**
     * Restore the matrix values from a quaternion rotation, vector translation and vector scale
     *
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @return the current mat4 object
     * @chainable
     */
    public fromRTS (q: Quat, v: Vec3, s: Vec3) {
        return mat4.fromRTS(this, q, v, s);
    }

    /**
     * Restore the matrix values from a quaternion rotation
     *
     * @param q Rotation quaternion
     * @return the current mat4 object
     * @chainable
     */
    public fromQuat (quat: Quat) {
        return mat4.fromQuat(this, quat);
    }
}

CCClass.fastDefine('cc.Mat4', Mat4, {
    m00: 1, m01: 0, m02: 0, m03: 0,
    m04: 0, m05: 1, m06: 0, m07: 0,
    m08: 0, m09: 0, m10: 1, m11: 0,
    m12: 0, m13: 0, m14: 0, m15: 1,
});
cc.Mat4 = Mat4;

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 *
 * @param other
 * @return
 */
function m4 (other: Mat4): Mat4;

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 *
 * @param m00 Component in column 0, row 0 position (index 0)
 * @param m01 Component in column 0, row 1 position (index 1)
 * @param m02 Component in column 0, row 2 position (index 2)
 * @param m03 Component in column 0, row 3 position (index 3)
 * @param m10 Component in column 1, row 0 position (index 4)
 * @param m11 Component in column 1, row 1 position (index 5)
 * @param m12 Component in column 1, row 2 position (index 6)
 * @param m13 Component in column 1, row 3 position (index 7)
 * @param m20 Component in column 2, row 0 position (index 8)
 * @param m21 Component in column 2, row 1 position (index 9)
 * @param m22 Component in column 2, row 2 position (index 10)
 * @param m23 Component in column 2, row 3 position (index 11)
 * @param m30 Component in column 3, row 0 position (index 12)
 * @param m31 Component in column 3, row 1 position (index 13)
 * @param m32 Component in column 3, row 2 position (index 14)
 * @param m33 Component in column 3, row 3 position (index 15)
 * @return
 */
function m4 (
    m00?: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): Mat4;

function m4 (
    m00: Mat4 | number = 1, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 1, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 1, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    return new Mat4(m00 as any, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
}

export { m4 as mat4 };

cc.mat4 = m4;
