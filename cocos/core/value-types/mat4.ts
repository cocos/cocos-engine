/*
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
*/

/**
 * @category core/value-types
 */

import CCClass from '../data/class';
import { mat4 as xmat4, EPSILON } from '../vmath';
import Quat from './quat';
import { ValueType } from './value-type';
import Vec3 from './vec3';

/**
 * 表示四维（4x4）矩阵。
 */
// tslint:disable:one-variable-per-declaration
export default class Mat4 extends ValueType {

    /**
     * 计算当前矩阵的转置矩阵。
     * @param out 返回值，返回转置矩阵。
     */
    public static transpose (out: Mat4, mat: Mat4) {
        out.m00 = mat.m00;
        out.m01 = mat.m04;
        out.m02 = mat.m08;
        out.m03 = mat.m12;
        out.m04 = mat.m01;
        out.m05 = mat.m05;
        out.m06 = mat.m09;
        out.m07 = mat.m13;
        out.m08 = mat.m02;
        out.m09 = mat.m06;
        out.m10 = mat.m10;
        out.m11 = mat.m14;
        out.m12 = mat.m03;
        out.m13 = mat.m07;
        out.m14 = mat.m11;
        out.m15 = mat.m15;
    }

    /**
     * 矩阵加法。将当前矩阵与指定矩阵的相加结果赋值给返回值。
     * @param out 返回值
     * @param a 矩阵a
     * @param b 矩阵b
     */
    public static add (out: Mat4, a: Mat4, b: Mat4) {
        out.m00 = a.m00 + b.m00;
        out.m01 = a.m01 + b.m01;
        out.m02 = a.m02 + b.m02;
        out.m03 = a.m03 + b.m03;
        out.m04 = a.m04 + b.m04;
        out.m05 = a.m05 + b.m05;
        out.m06 = a.m06 + b.m06;
        out.m07 = a.m07 + b.m07;
        out.m08 = a.m08 + b.m08;
        out.m09 = a.m09 + b.m09;
        out.m10 = a.m10 + b.m10;
        out.m11 = a.m11 + b.m11;
        out.m12 = a.m12 + b.m12;
        out.m13 = a.m13 + b.m13;
        out.m14 = a.m14 + b.m14;
        out.m15 = a.m15 + b.m15;
    }

    /**
     * 矩阵减法。将当前矩阵减去指定矩阵的结果赋值给返回值。
     * @param out 返回值。
     * @param a 矩阵a
     * @param b 矩阵b
     */
    public static sub (out: Mat4, a: Mat4, b: Mat4) {
        out.m00 = a.m00 - b.m00;
        out.m01 = a.m01 - b.m01;
        out.m02 = a.m02 - b.m02;
        out.m03 = a.m03 - b.m03;
        out.m04 = a.m04 - b.m04;
        out.m05 = a.m05 - b.m05;
        out.m06 = a.m06 - b.m06;
        out.m07 = a.m07 - b.m07;
        out.m08 = a.m08 - b.m08;
        out.m09 = a.m09 - b.m09;
        out.m10 = a.m10 - b.m10;
        out.m11 = a.m11 - b.m11;
        out.m12 = a.m12 - b.m12;
        out.m13 = a.m13 - b.m13;
        out.m14 = a.m14 - b.m14;
        out.m15 = a.m15 - b.m15;
    }

    /**
     * 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给出返回值。
     * @param out 返回值。
     * @param a 矩阵a
     * @param b 矩阵b
     */
    public static mul (out: Mat4, a: Mat4, b: Mat4) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
            a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
            a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
            a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

        // Cache only the current line of the second matrix
        let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
        out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.m04; b1 = b.m05; b2 = b.m06; b3 = b.m07;
        out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.m08; b1 = b.m09; b2 = b.m10; b3 = b.m11;
        out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.m12; b1 = b.m13; b2 = b.m14; b3 = b.m15;
        out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }

    /**
     * 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给返回值。
     * @param out 返回值。
     * @param mat 矩阵
     * @param scalar 标量
     */
    public static mulScalar (out: Mat4, mat: Mat4, scalar: number) {
        out.m00 = mat.m00 * scalar;
        out.m01 = mat.m01 * scalar;
        out.m02 = mat.m02 * scalar;
        out.m03 = mat.m03 * scalar;
        out.m04 = mat.m04 * scalar;
        out.m05 = mat.m05 * scalar;
        out.m06 = mat.m06 * scalar;
        out.m07 = mat.m07 * scalar;
        out.m08 = mat.m08 * scalar;
        out.m09 = mat.m09 * scalar;
        out.m10 = mat.m10 * scalar;
        out.m11 = mat.m11 * scalar;
        out.m12 = mat.m12 * scalar;
        out.m13 = mat.m13 * scalar;
        out.m14 = mat.m14 * scalar;
        out.m15 = mat.m15 * scalar;
    }

    /**
     * 将当前矩阵左乘位移矩阵的结果赋值给返回值，位移矩阵由各个轴的位移给出。
     * @param out 返回值
     * @param mat 矩阵
     * @param vec 向量
     */
    public static translate (out: Mat4, mat: Mat4, vec: Vec3) {
        out.m00 = mat.m00; out.m01 = mat.m01; out.m02 = mat.m02; out.m03 = mat.m03;
        out.m04 = mat.m04; out.m05 = mat.m05; out.m06 = mat.m06; out.m07 = mat.m07;
        out.m08 = mat.m08; out.m09 = mat.m09; out.m10 = mat.m10; out.m11 = mat.m11;

        out.m12 = mat.m00 * vec.x + mat.m04 * vec.y + mat.m08 * vec.z + mat.m12;
        out.m13 = mat.m01 * vec.x + mat.m05 * vec.y + mat.m09 * vec.z + mat.m13;
        out.m14 = mat.m02 * vec.x + mat.m06 * vec.y + mat.m10 * vec.z + mat.m14;
        out.m15 = mat.m03 * vec.x + mat.m07 * vec.y + mat.m11 * vec.z + mat.m15;
    }

    /**
     * 将当前矩阵左乘缩放矩阵的结果赋值给返回值，缩放矩阵由各个轴的缩放给出。
     * @param out 返回值
     * @param mat 矩阵
     * @param vec 向量
     */
    public static scale (out: Mat4, mat: Mat4, vec: Vec3) {
        out.m00 = mat.m00 * vec.x;
        out.m01 = mat.m01 * vec.x;
        out.m02 = mat.m02 * vec.x;
        out.m03 = mat.m03 * vec.x;
        out.m04 = mat.m04 * vec.y;
        out.m05 = mat.m05 * vec.y;
        out.m06 = mat.m06 * vec.y;
        out.m07 = mat.m07 * vec.y;
        out.m08 = mat.m08 * vec.z;
        out.m09 = mat.m09 * vec.z;
        out.m10 = mat.m10 * vec.z;
        out.m11 = mat.m11 * vec.z;
        out.m12 = mat.m12;
        out.m13 = mat.m13;
        out.m14 = mat.m14;
        out.m15 = mat.m15;
    }

    /**
     * 将当前矩阵左乘旋转矩阵的结果赋值给返回值，旋转矩阵由旋转轴和旋转角度给出。
     * @param out 返回值
     * @param mat 矩阵
     * @param rad 旋转角度（弧度制）
     * @param axis 旋转轴
     */
    public static rotate (out: Mat4, mat: Mat4, rad: number, axis: Vec3) {
        let x = axis.x, y = axis.y, z = axis.z;

        let len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < EPSILON) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const t = 1 - c;

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out.m00 = mat.m00 * b00 + mat.m04 * b01 + mat.m08 * b02;
        out.m01 = mat.m01 * b00 + mat.m05 * b01 + mat.m09 * b02;
        out.m02 = mat.m02 * b00 + mat.m06 * b01 + mat.m10 * b02;
        out.m03 = mat.m03 * b00 + mat.m07 * b01 + mat.m11 * b02;
        out.m04 = mat.m00 * b10 + mat.m04 * b11 + mat.m08 * b12;
        out.m05 = mat.m01 * b10 + mat.m05 * b11 + mat.m09 * b12;
        out.m06 = mat.m02 * b10 + mat.m06 * b11 + mat.m10 * b12;
        out.m07 = mat.m03 * b10 + mat.m07 * b11 + mat.m11 * b12;
        out.m08 = mat.m00 * b20 + mat.m04 * b21 + mat.m08 * b22;
        out.m09 = mat.m01 * b20 + mat.m05 * b21 + mat.m09 * b22;
        out.m10 = mat.m02 * b20 + mat.m06 * b21 + mat.m10 * b22;
        out.m11 = mat.m03 * b20 + mat.m07 * b21 + mat.m11 * b22;
        out.m12 = mat.m12;
        out.m13 = mat.m13;
        out.m14 = mat.m14;
        out.m15 = mat.m15;
    }

    /**
     * 矩阵第 0 列第 0 行的元素。
     */
    public m00: number;

    /**
     * 矩阵第 0 列第 1 行的元素。
     */
    public m01: number;

    /**
     * 矩阵第 0 列第 2 行的元素。
     */
    public m02: number;

    /**
     * 矩阵第 0 列第 3 行的元素。
     */
    public m03: number;

    /**
     * 矩阵第 1 列第 0 行的元素。
     */
    public m04: number;

    /**
     * 矩阵第 1 列第 1 行的元素。
     */
    public m05: number;

    /**
     * 矩阵第 1 列第 2 行的元素。
     */
    public m06: number;

    /**
     * 矩阵第 1 列第 3 行的元素。
     */
    public m07: number;

    /**
     * 矩阵第 2 列第 0 行的元素。
     */
    public m08: number;

    /**
     * 矩阵第 2 列第 1 行的元素。
     */
    public m09: number;

    /**
     * 矩阵第 2 列第 2 行的元素。
     */
    public m10: number;

    /**
     * 矩阵第 2 列第 3 行的元素。
     */
    public m11: number;

    /**
     * 矩阵第 3 列第 0 行的元素。
     */
    public m12: number;

    /**
     * 矩阵第 3 列第 1 行的元素。
     */
    public m13: number;

    /**
     * 矩阵第 3 列第 2 行的元素。
     */
    public m14: number;

    /**
     * 矩阵第 3 列第 3 行的元素。
     */
    public m15: number;

    /**
     * 构造与指定矩阵相等的矩阵。
     * @param other 相比较的矩阵。
     */
    constructor (other: Mat4);

    /**
     * 构造具有指定元素的矩阵。
     * @param m00 矩阵第 0 列第 0 行的元素。
     * @param m01 矩阵第 0 列第 1 行的元素。
     * @param m02 矩阵第 0 列第 2 行的元素。
     * @param m03 矩阵第 0 列第 3 行的元素。
     * @param m04 矩阵第 1 列第 0 行的元素。
     * @param m05 矩阵第 1 列第 1 行的元素。
     * @param m06 矩阵第 1 列第 2 行的元素。
     * @param m07 矩阵第 1 列第 3 行的元素。
     * @param m08 矩阵第 2 列第 0 行的元素。
     * @param m09 矩阵第 2 列第 1 行的元素。
     * @param m10 矩阵第 2 列第 2 行的元素。
     * @param m11 矩阵第 2 列第 3 行的元素。
     * @param m12 矩阵第 3 列第 0 行的元素。
     * @param m13 矩阵第 3 列第 1 行的元素。
     * @param m14 矩阵第 3 列第 2 行的元素。
     * @param m15 矩阵第 3 列第 3 行的元素。
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
     * 克隆当前矩阵。
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
     * 设置当前矩阵使其与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns `this`
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
     * 判断当前矩阵是否与指定矩阵相等。
     * @param mat 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (mat: Mat4): boolean {
        return this.m00 === mat.m00 && this.m01 === mat.m01 && this.m02 === mat.m02 && this.m03 === mat.m03 &&
            this.m04 === mat.m04 && this.m05 === mat.m05 && this.m06 === mat.m06 && this.m07 === mat.m07 &&
            this.m08 === mat.m08 && this.m09 === mat.m09 && this.m10 === mat.m10 && this.m11 === mat.m11 &&
            this.m12 === mat.m12 && this.m13 === mat.m13 && this.m14 === mat.m14 && this.m15 === mat.m15;
    }

    /**
     * 判断当前矩阵是否与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public fuzzyEquals (other: Mat4): boolean {
        return xmat4.equals(this, other);
    }

    /**
     * 返回当前矩阵的字符串表示。
     * @returns 当前矩阵的字符串表示。
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
     * 将当前矩阵设为单位矩阵。
     * @returns `this`
     */
    public identity () {
        return xmat4.identity(this);
    }

    /**
     * 计算当前矩阵的转置矩阵。
     */
    public transposeSelf () {
        this.m01 = this.m04;
        this.m02 = this.m08;
        this.m03 = this.m12;
        this.m04 = this.m01;
        this.m06 = this.m09;
        this.m07 = this.m13;
        this.m08 = this.m02;
        this.m09 = this.m06;
        this.m11 = this.m14;
        this.m12 = this.m03;
        this.m13 = this.m07;
        this.m14 = this.m11;
    }

    /**
     * 计算当前矩阵的逆矩阵。
     */
    public invert () {
        const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
        const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
        const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;
        const a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        console.assert(det !== 0);
        det = 1.0 / det;

        this.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    }

    /**
     * 计算当前矩阵的伴随矩。
     */
    public adjointSelf () {
        const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03,
        a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07,
        a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11,
        a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

        this.m00 = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        this.m01 = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        this.m02 = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        this.m03 = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        this.m04 = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        this.m05 = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        this.m06 = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        this.m07 = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        this.m08 = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        this.m09 = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        this.m10 = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        this.m11 = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        this.m12 = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        this.m13 = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        this.m14 = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        this.m15 = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    }

    /**
     * 计算当前矩阵的行列式。
     * @returns 当前矩阵的行列式。
     */
    public determinantSelf (): number {
        const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03,
            a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07,
            a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11,
            a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
     * 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
     * @param mat 相加的矩阵
     */
    public addSelf (mat: Mat4) {
        this.m00 = this.m00 + mat.m00;
        this.m01 = this.m01 + mat.m01;
        this.m02 = this.m02 + mat.m02;
        this.m03 = this.m03 + mat.m03;
        this.m04 = this.m04 + mat.m04;
        this.m05 = this.m05 + mat.m05;
        this.m06 = this.m06 + mat.m06;
        this.m07 = this.m07 + mat.m07;
        this.m08 = this.m08 + mat.m08;
        this.m09 = this.m09 + mat.m09;
        this.m10 = this.m10 + mat.m10;
        this.m11 = this.m11 + mat.m11;
        this.m12 = this.m12 + mat.m12;
        this.m13 = this.m13 + mat.m13;
        this.m14 = this.m14 + mat.m14;
        this.m15 = this.m15 + mat.m15;
    }

    /**
     * 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat 减数矩阵。
     */
    public subSelf (mat: Mat4) {
        this.m00 = this.m00 - mat.m00;
        this.m01 = this.m01 - mat.m01;
        this.m02 = this.m02 - mat.m02;
        this.m03 = this.m03 - mat.m03;
        this.m04 = this.m04 - mat.m04;
        this.m05 = this.m05 - mat.m05;
        this.m06 = this.m06 - mat.m06;
        this.m07 = this.m07 - mat.m07;
        this.m08 = this.m08 - mat.m08;
        this.m09 = this.m09 - mat.m09;
        this.m10 = this.m10 - mat.m10;
        this.m11 = this.m11 - mat.m11;
        this.m12 = this.m12 - mat.m12;
        this.m13 = this.m13 - mat.m13;
        this.m14 = this.m14 - mat.m14;
        this.m15 = this.m15 - mat.m15;
    }

    /**
     * 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat 指定的矩阵。
     */
    public mulSelf (mat: Mat4) {
        const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03,
            a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07,
            a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11,
            a30 = this.m12, a31 = this.m13, a32 = this.m14, a33 = this.m15;

        // Cache only the current line of the second matrix
        this.m00 = mat.m00 * a00 + mat.m01 * a10 + mat.m02 * a20 + mat.m03 * a30;
        this.m01 = mat.m00 * a01 + mat.m01 * a11 + mat.m02 * a21 + mat.m03 * a31;
        this.m02 = mat.m00 * a02 + mat.m01 * a12 + mat.m02 * a22 + mat.m03 * a32;
        this.m03 = mat.m00 * a03 + mat.m01 * a13 + mat.m02 * a23 + mat.m03 * a33;
        this.m04 = mat.m04 * a00 + mat.m05 * a10 + mat.m06 * a20 + mat.m07 * a30;
        this.m05 = mat.m04 * a01 + mat.m05 * a11 + mat.m06 * a21 + mat.m07 * a31;
        this.m06 = mat.m04 * a02 + mat.m05 * a12 + mat.m06 * a22 + mat.m07 * a32;
        this.m07 = mat.m04 * a03 + mat.m05 * a13 + mat.m06 * a23 + mat.m07 * a33;
        this.m08 = mat.m08 * a00 + mat.m09 * a10 + mat.m10 * a20 + mat.m11 * a30;
        this.m09 = mat.m08 * a01 + mat.m09 * a11 + mat.m10 * a21 + mat.m11 * a31;
        this.m10 = mat.m08 * a02 + mat.m09 * a12 + mat.m10 * a22 + mat.m11 * a32;
        this.m11 = mat.m08 * a03 + mat.m09 * a13 + mat.m10 * a23 + mat.m11 * a33;
        this.m12 = mat.m12 * a00 + mat.m13 * a10 + mat.m14 * a20 + mat.m15 * a30;
        this.m13 = mat.m12 * a01 + mat.m13 * a11 + mat.m14 * a21 + mat.m15 * a31;
        this.m14 = mat.m12 * a02 + mat.m13 * a12 + mat.m14 * a22 + mat.m15 * a32;
        this.m15 = mat.m12 * a03 + mat.m13 * a13 + mat.m14 * a23 + mat.m15 * a33;
    }

    /**
     * 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar 指定的标量。
     */
    public mulScalarSelf (scalar: number) {
        this.m00 *= scalar;
        this.m01 *= scalar;
        this.m02 *= scalar;
        this.m03 *= scalar;
        this.m04 *= scalar;
        this.m05 *= scalar;
        this.m06 *= scalar;
        this.m07 *= scalar;
        this.m08 *= scalar;
        this.m09 *= scalar;
        this.m10 *= scalar;
        this.m11 *= scalar;
        this.m12 *= scalar;
        this.m13 *= scalar;
        this.m14 *= scalar;
        this.m15 *= scalar;
    }

    /**
     * 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec 位移向量。
     */
    public translateSelf (vec: Vec3) {
        this.m12 = this.m00 * vec.x + this.m04 * vec.y + this.m08 * vec.z + this.m12;
        this.m13 = this.m01 * vec.x + this.m05 * vec.y + this.m09 * vec.z + this.m13;
        this.m14 = this.m02 * vec.x + this.m06 * vec.y + this.m10 * vec.z + this.m14;
        this.m15 = this.m03 * vec.x + this.m07 * vec.y + this.m11 * vec.z + this.m15;
    }

    /**
     * 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
     * @param vec 各个轴的缩放。
     */
    public scaleSelf (vec: Vec3) {
        this.m00 *= vec.x;
        this.m01 *= vec.x;
        this.m02 *= vec.x;
        this.m03 *= vec.x;
        this.m04 *= vec.y;
        this.m05 *= vec.y;
        this.m06 *= vec.y;
        this.m07 *= vec.y;
        this.m08 *= vec.z;
        this.m09 *= vec.z;
        this.m10 *= vec.z;
        this.m11 *= vec.z;
    }

    /**
     * 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param mat 矩阵
     * @param rad 旋转角度（弧度制）
     * @param axis 旋转轴
     */
    public rotateSelf (rad: number, axis: Vec3) {
        let x = axis.x, y = axis.y, z = axis.z;

        let len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < EPSILON) {
            return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const t = 1 - c;

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        const a00 = this.m00, a01 = this.m01, a02 = this.m02, a03 = this.m03;
        const a10 = this.m04, a11 = this.m05, a12 = this.m06, a13 = this.m07;
        const a20 = this.m08, a21 = this.m09, a22 = this.m10, a23 = this.m11;

        // Perform rotation-specific matrix multiplication
        this.m00 = a00 * b00 + a10 * b01 + a20 * b02;
        this.m01 = a01 * b00 + a11 * b01 + a21 * b02;
        this.m02 = a02 * b00 + a12 * b01 + a22 * b02;
        this.m03 = a03 * b00 + a13 * b01 + a23 * b02;
        this.m04 = a00 * b10 + a10 * b11 + a20 * b12;
        this.m05 = a01 * b10 + a11 * b11 + a21 * b12;
        this.m06 = a02 * b10 + a12 * b11 + a22 * b12;
        this.m07 = a03 * b10 + a13 * b11 + a23 * b12;
        this.m08 = a00 * b20 + a10 * b21 + a20 * b22;
        this.m09 = a01 * b20 + a11 * b21 + a21 * b22;
        this.m10 = a02 * b20 + a12 * b21 + a22 * b22;
        this.m11 = a03 * b20 + a13 * b21 + a23 * b22;
    }

    /**
     * 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
     * @param out 返回向量，当未指定时将创建为新的向量。
     */
    public getTranslation (out: Vec3) {
        out.x = this.m12;
        out.y = this.m13;
        out.z = this.m14;
    }

    /**
     * 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
     * @param out 返回值，当未指定时将创建为新的向量。
     */
    public getScale (out: Vec3) {
        xmat4.getScaling(out, this);
    }

    /**
     * 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
     * @param out 返回值，当未指定时将创建为新的四元数。
     */
    public getRotation (out: Quat) {
        out = out || new Quat();
        xmat4.getRotation(out, this);
    }

    /**
     * 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q 四元数表示的旋转变换。
     * @param v 位移变换，表示为各个轴的位移。
     * @param s 缩放变换，表示为各个轴的缩放。
     * @returns `this`
     */
    public fromRTS (q: Quat, v: Vec3, s: Vec3) {
        xmat4.fromRTS(this, q, v, s);
    }

    /**
     * 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q 四元数表示的旋转变换。
     * @param v 位移变换，表示为各个轴的位移。
     * @param s 缩放变换，表示为各个轴的缩放。
     * @returns `this`
     */
    public fromQuat (quat: Quat) {
        return xmat4.fromQuat(this, quat);
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
 * 构造与指定矩阵相等的矩阵。等价于 `new Mat4(other)`。
 * @param other 相比较的矩阵。
 * @returns `new Mat4(other)`
 */
export function mat4 (other: Mat4): Mat4;

/**
 * 构造具有指定元素的矩阵。等价于 `new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)`
 * @param m00 矩阵第 0 列第 0 行的元素。
 * @param m01 矩阵第 0 列第 1 行的元素。
 * @param m02 矩阵第 0 列第 2 行的元素。
 * @param m03 矩阵第 0 列第 3 行的元素。
 * @param m04 矩阵第 1 列第 0 行的元素。
 * @param m05 矩阵第 1 列第 1 行的元素。
 * @param m06 矩阵第 1 列第 2 行的元素。
 * @param m07 矩阵第 1 列第 3 行的元素。
 * @param m08 矩阵第 2 列第 0 行的元素。
 * @param m09 矩阵第 2 列第 1 行的元素。
 * @param m10 矩阵第 2 列第 2 行的元素。
 * @param m11 矩阵第 2 列第 3 行的元素。
 * @param m12 矩阵第 3 列第 0 行的元素。
 * @param m13 矩阵第 3 列第 1 行的元素。
 * @param m14 矩阵第 3 列第 2 行的元素。
 * @param m15 矩阵第 3 列第 3 行的元素。
 * @returns `new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33)`
 */
export function mat4 (
    m00?: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): Mat4;

export function mat4 (
    m00: Mat4 | number = 1, m01 = 0, m02 = 0, m03 = 0,
    m10 = 0, m11 = 1, m12 = 0, m13 = 0,
    m20 = 0, m21 = 0, m22 = 1, m23 = 0,
    m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    return new Mat4(m00 as any, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
}

cc.mat4 = mat4;
