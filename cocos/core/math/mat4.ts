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
 * @category core/math
 */

import CCClass from '../data/class';
import { Mat3 } from './mat3';
import { Quat } from './quat';
import { IMat4Like, IVec3Like } from './type-define';
import { EPSILON } from './utils';
import { ValueType } from '../value-types/value-type';
import { Vec3 } from './vec3';

let _a00: number = 0; let _a01: number = 0; let _a02: number = 0; let _a03: number = 0;
let _a10: number = 0; let _a11: number = 0; let _a12: number = 0; let _a13: number = 0;
let _a20: number = 0; let _a21: number = 0; let _a22: number = 0; let _a23: number = 0;
let _a30: number = 0; let _a31: number = 0; let _a32: number = 0; let _a33: number = 0;

/**
 * 表示四维（4x4）矩阵。
 */
// tslint:disable:one-variable-per-declaration
export class Mat4 extends ValueType {

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

    constructor (other: Mat4);

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
     * @zh 获得指定矩阵的拷贝
     */
    public static clone <Out extends IMat4Like> (a: Out) {
        return new Mat4(
            a.m00, a.m01, a.m02, a.m03,
            a.m04, a.m05, a.m06, a.m07,
            a.m08, a.m09, a.m10, a.m11,
            a.m12, a.m13, a.m14, a.m15,
        );
    }

    /**
     * @zh 复制目标矩阵
     */
    public static copy <Out extends IMat4Like> (out: Out, a: Out) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m03;
        out.m04 = a.m04;
        out.m05 = a.m05;
        out.m06 = a.m06;
        out.m07 = a.m07;
        out.m08 = a.m08;
        out.m09 = a.m09;
        out.m10 = a.m10;
        out.m11 = a.m11;
        out.m12 = a.m12;
        out.m13 = a.m13;
        out.m14 = a.m14;
        out.m15 = a.m15;
        return out;
    }

    /**
     * @zh 设置矩阵值
     */
    public static set <Out extends IMat4Like>  (
        out: Out,
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number,
    ) {
        out.m00 = m00; out.m01 = m01; out.m02 = m02; out.m03 = m03;
        out.m04 = m10; out.m05 = m11; out.m06 = m12; out.m07 = m13;
        out.m08 = m20; out.m09 = m21; out.m10 = m22; out.m11 = m23;
        out.m12 = m30; out.m13 = m31; out.m14 = m32; out.m15 = m33;
        return out;
    }

    /**
     * @zh 将目标赋值为单位矩阵
     */
    public static identity <Out extends IMat4Like> (out: Out) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 转置矩阵
     */
    public static transpose <Out extends IMat4Like> (out: Out, a: Out) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            const a01 = a.m01, a02 = a.m02, a03 = a.m03, a12 = a.m06, a13 = a.m07, a23 = a.m11;
            out.m01 = a.m04;
            out.m02 = a.m08;
            out.m03 = a.m12;
            out.m04 = a01;
            out.m06 = a.m09;
            out.m07 = a.m13;
            out.m08 = a02;
            out.m09 = a12;
            out.m11 = a.m14;
            out.m12 = a03;
            out.m13 = a13;
            out.m14 = a23;
        } else {
            out.m00 = a.m00;
            out.m01 = a.m04;
            out.m02 = a.m08;
            out.m03 = a.m12;
            out.m04 = a.m01;
            out.m05 = a.m05;
            out.m06 = a.m09;
            out.m07 = a.m13;
            out.m08 = a.m02;
            out.m09 = a.m06;
            out.m10 = a.m10;
            out.m11 = a.m14;
            out.m12 = a.m03;
            out.m13 = a.m07;
            out.m14 = a.m11;
            out.m15 = a.m15;
        }
        return out;
    }

    /**
     * @zh 矩阵求逆
     */
    public static invert <Out extends IMat4Like> (out: Out, a: Out) {

        _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
        _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
        _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;
        _a30 = a.m12; _a31 = a.m13; _a32 = a.m14; _a33 = a.m15;

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (det === 0) { return null; }
        det = 1.0 / det;

        out.m00 = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        out.m01 = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        out.m02 = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        out.m03 = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
        out.m04 = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        out.m05 = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        out.m06 = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        out.m07 = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
        out.m08 = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        out.m09 = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        out.m10 = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        out.m11 = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
        out.m12 = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
        out.m13 = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
        out.m14 = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
        out.m15 = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;

        return out;
    }

    /**
     * @zh 矩阵行列式
     */
    public static determinant <Out extends IMat4Like> (a: Out): number {
        _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
        _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
        _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;
        _a30 = a.m12; _a31 = a.m13; _a32 = a.m14; _a33 = a.m15;

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
     * @zh 矩阵乘法
     */
    public static multiply <Out extends IMat4Like> (out: Out, a: Out, b: Out) {
        _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
        _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
        _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;
        _a30 = a.m12; _a31 = a.m13; _a32 = a.m14; _a33 = a.m15;

        // Cache only the current line of the second matrix
        let b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03;
        out.m00 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        out.m01 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        out.m02 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        out.m03 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = b.m04; b1 = b.m05; b2 = b.m06; b3 = b.m07;
        out.m04 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        out.m05 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        out.m06 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        out.m07 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = b.m08; b1 = b.m09; b2 = b.m10; b3 = b.m11;
        out.m08 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        out.m09 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        out.m10 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        out.m11 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = b.m12; b1 = b.m13; b2 = b.m14; b3 = b.m15;
        out.m12 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        out.m13 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        out.m14 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        out.m15 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入变换
     */
    public static transform <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        const x = v.x, y = v.y, z = v.z;
        if (a === out) {
            out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
            out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
            out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
            out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
        } else {
            _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
            _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
            _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;
            _a30 = a.m12; _a31 = a.m13; _a32 = a.m14; _a33 = a.m15;

            out.m00 = _a00; out.m01 = _a01; out.m02 = _a02; out.m03 = _a03;
            out.m04 = _a10; out.m05 = _a11; out.m06 = _a12; out.m07 = _a13;
            out.m08 = _a20; out.m09 = _a21; out.m10 = _a22; out.m11 = _a23;

            out.m12 = _a00 * x + _a10 * y + _a20 * z + a.m12;
            out.m13 = _a01 * x + _a11 * y + _a21 * z + a.m13;
            out.m14 = _a02 * x + _a12 * y + _a22 * z + a.m14;
            out.m15 = _a03 * x + _a13 * y + _a23 * z + a.m15;
        }
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入新位移变换
     */
    public static translate <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        console.warn('function changed');
        if (a === out) {
            out.m12 += v.x;
            out.m13 += v.y;
            out.m14 += v.y;
        } else {
            out.m00 = a.m00; out.m01 = a.m01; out.m02 = a.m02; out.m03 = a.m03;
            out.m04 = a.m04; out.m05 = a.m05; out.m06 = a.m06; out.m07 = a.m07;
            out.m08 = a.m08; out.m09 = a.m09; out.m10 = a.m10; out.m11 = a.m11;
            out.m12 += v.x;
            out.m13 += v.y;
            out.m14 += v.z;
            out.m15 = a.m15;
        }
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入新缩放变换
     */
    public static scale <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        const x = v.x, y = v.y, z = v.z;
        out.m00 = a.m00 * x;
        out.m01 = a.m01 * x;
        out.m02 = a.m02 * x;
        out.m03 = a.m03 * x;
        out.m04 = a.m04 * y;
        out.m05 = a.m05 * y;
        out.m06 = a.m06 * y;
        out.m07 = a.m07 * y;
        out.m08 = a.m08 * z;
        out.m09 = a.m09 * z;
        out.m10 = a.m10 * z;
        out.m11 = a.m11 * z;
        out.m12 = a.m12;
        out.m13 = a.m13;
        out.m14 = a.m14;
        out.m15 = a.m15;
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入新旋转变换
     * @param rad 旋转角度
     * @param axis 旋转轴
     */
    public static rotate <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike) {
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

        _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
        _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
        _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out.m00 = _a00 * b00 + _a10 * b01 + _a20 * b02;
        out.m01 = _a01 * b00 + _a11 * b01 + _a21 * b02;
        out.m02 = _a02 * b00 + _a12 * b01 + _a22 * b02;
        out.m03 = _a03 * b00 + _a13 * b01 + _a23 * b02;
        out.m04 = _a00 * b10 + _a10 * b11 + _a20 * b12;
        out.m05 = _a01 * b10 + _a11 * b11 + _a21 * b12;
        out.m06 = _a02 * b10 + _a12 * b11 + _a22 * b12;
        out.m07 = _a03 * b10 + _a13 * b11 + _a23 * b12;
        out.m08 = _a00 * b20 + _a10 * b21 + _a20 * b22;
        out.m09 = _a01 * b20 + _a11 * b21 + _a21 * b22;
        out.m10 = _a02 * b20 + _a12 * b21 + _a22 * b22;
        out.m11 = _a03 * b20 + _a13 * b21 + _a23 * b22;

        // If the source and destination differ, copy the unchanged last row
        if (a !== out) {
            out.m12 = a.m12;
            out.m13 = a.m13;
            out.m14 = a.m14;
            out.m15 = a.m15;
        }

        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
     * @param rad 旋转角度
     */
    public static rotateX <Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = a.m04,
            a11 = a.m05,
            a12 = a.m06,
            a13 = a.m07,
            a20 = a.m08,
            a21 = a.m09,
            a22 = a.m10,
            a23 = a.m11;

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out.m00 = a.m00;
            out.m01 = a.m01;
            out.m02 = a.m02;
            out.m03 = a.m03;
            out.m12 = a.m12;
            out.m13 = a.m13;
            out.m14 = a.m14;
            out.m15 = a.m15;
        }

        // Perform axis-specific matrix multiplication
        out.m04 = a10 * c + a20 * s;
        out.m05 = a11 * c + a21 * s;
        out.m06 = a12 * c + a22 * s;
        out.m07 = a13 * c + a23 * s;
        out.m08 = a20 * c - a10 * s;
        out.m09 = a21 * c - a11 * s;
        out.m10 = a22 * c - a12 * s;
        out.m11 = a23 * c - a13 * s;

        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
     * @param rad 旋转角度
     */
    public static rotateY <Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a.m00,
            a01 = a.m01,
            a02 = a.m02,
            a03 = a.m03,
            a20 = a.m08,
            a21 = a.m09,
            a22 = a.m10,
            a23 = a.m11;

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out.m04 = a.m04;
            out.m05 = a.m05;
            out.m06 = a.m06;
            out.m07 = a.m07;
            out.m12 = a.m12;
            out.m13 = a.m13;
            out.m14 = a.m14;
            out.m15 = a.m15;
        }

        // Perform axis-specific matrix multiplication
        out.m00 = a00 * c - a20 * s;
        out.m01 = a01 * c - a21 * s;
        out.m02 = a02 * c - a22 * s;
        out.m03 = a03 * c - a23 * s;
        out.m08 = a00 * s + a20 * c;
        out.m09 = a01 * s + a21 * c;
        out.m10 = a02 * s + a22 * c;
        out.m11 = a03 * s + a23 * c;

        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
     * @param rad 旋转角度
     */
    public static rotateZ <Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a.m00,
            a01 = a.m01,
            a02 = a.m02,
            a03 = a.m03,
            a10 = a.m04,
            a11 = a.m05,
            a12 = a.m06,
            a13 = a.m07;

        // If the source and destination differ, copy the unchanged last row
        if (a !== out) {
            out.m08 = a.m08;
            out.m09 = a.m09;
            out.m10 = a.m10;
            out.m11 = a.m11;
            out.m12 = a.m12;
            out.m13 = a.m13;
            out.m14 = a.m14;
            out.m15 = a.m15;
        }

        // Perform axis-specific matrix multiplication
        out.m00 = a00 * c + a10 * s;
        out.m01 = a01 * c + a11 * s;
        out.m02 = a02 * c + a12 * s;
        out.m03 = a03 * c + a13 * s;
        out.m04 = a10 * c - a00 * s;
        out.m05 = a11 * c - a01 * s;
        out.m06 = a12 * c - a02 * s;
        out.m07 = a13 * c - a03 * s;

        return out;
    }

    /**
     * @zh 计算位移矩阵
     */
    public static fromTranslation <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 计算缩放矩阵
     */
    public static fromScaling <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike) {
        out.m00 = v.x;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = v.y;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = v.z;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 计算旋转矩阵
     */
    public static fromRotation <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike) {
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

        // Perform rotation-specific matrix multiplication
        out.m00 = x * x * t + c;
        out.m01 = y * x * t + z * s;
        out.m02 = z * x * t - y * s;
        out.m03 = 0;
        out.m04 = x * y * t - z * s;
        out.m05 = y * y * t + c;
        out.m06 = z * y * t + x * s;
        out.m07 = 0;
        out.m08 = x * z * t + y * s;
        out.m09 = y * z * t - x * s;
        out.m10 = z * z * t + c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 计算绕 X 轴的旋转矩阵
     */
    public static fromXRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = c;
        out.m06 = s;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = -s;
        out.m10 = c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 计算绕 Y 轴的旋转矩阵
     */
    public static fromYRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        out.m00 = c;
        out.m01 = 0;
        out.m02 = -s;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = s;
        out.m09 = 0;
        out.m10 = c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 计算绕 Z 轴的旋转矩阵
     */
    public static fromZRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        out.m00 = c;
        out.m01 = s;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = -s;
        out.m05 = c;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 根据旋转和位移信息计算矩阵
     */
    public static fromRT <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        out.m00 = 1 - (yy + zz);
        out.m01 = xy + wz;
        out.m02 = xz - wy;
        out.m03 = 0;
        out.m04 = xy - wz;
        out.m05 = 1 - (xx + zz);
        out.m06 = yz + wx;
        out.m07 = 0;
        out.m08 = xz + wy;
        out.m09 = yz - wx;
        out.m10 = 1 - (xx + yy);
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static getTranslation <Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out) {
        out.x = mat.m12;
        out.y = mat.m13;
        out.z = mat.m14;

        return out;
    }

    /**
     * @zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static getScaling <Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out) {
        const m00 = m3_1.m00 = mat.m00;
        const m01 = m3_1.m01 = mat.m01;
        const m02 = m3_1.m02 = mat.m02;
        const m04 = m3_1.m03 = mat.m04;
        const m05 = m3_1.m04 = mat.m05;
        const m06 = m3_1.m05 = mat.m06;
        const m08 = m3_1.m06 = mat.m08;
        const m09 = m3_1.m07 = mat.m09;
        const m10 = m3_1.m08 = mat.m10;
        out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
        // account for refections
        if (Mat3.determinant(m3_1) < 0) { out.x *= -1; }
        return out;
    }

    /**
     * @zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
     */
    public static getRotation <Out extends IMat4Like> (out: Quat, mat: Out) {
        const trace = mat.m00 + mat.m05 + mat.m10;
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out.w = 0.25 * S;
            out.x = (mat.m06 - mat.m09) / S;
            out.y = (mat.m08 - mat.m02) / S;
            out.z = (mat.m01 - mat.m04) / S;
        } else if ((mat.m00 > mat.m05) && (mat.m00 > mat.m10)) {
            S = Math.sqrt(1.0 + mat.m00 - mat.m05 - mat.m10) * 2;
            out.w = (mat.m06 - mat.m09) / S;
            out.x = 0.25 * S;
            out.y = (mat.m01 + mat.m04) / S;
            out.z = (mat.m08 + mat.m02) / S;
        } else if (mat.m05 > mat.m10) {
            S = Math.sqrt(1.0 + mat.m05 - mat.m00 - mat.m10) * 2;
            out.w = (mat.m08 - mat.m02) / S;
            out.x = (mat.m01 + mat.m04) / S;
            out.y = 0.25 * S;
            out.z = (mat.m06 + mat.m09) / S;
        } else {
            S = Math.sqrt(1.0 + mat.m10 - mat.m00 - mat.m05) * 2;
            out.w = (mat.m01 - mat.m04) / S;
            out.x = (mat.m08 + mat.m02) / S;
            out.y = (mat.m06 + mat.m09) / S;
            out.z = 0.25 * S;
        }

        return out;
    }

    /**
     * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static toRTS <Out extends IMat4Like, VecLike extends IVec3Like> (m: Out, q: Quat, v: VecLike, s: VecLike) {
        s.x = Vec3.set(v3_1, m.m00, m.m01, m.m02).length();
        m3_1.m00 = m.m00 / s.x;
        m3_1.m01 = m.m01 / s.x;
        m3_1.m02 = m.m02 / s.x;
        s.y = Vec3.set(v3_1, m.m04, m.m05, m.m06).length();
        m3_1.m03 = m.m04 / s.y;
        m3_1.m04 = m.m05 / s.y;
        m3_1.m05 = m.m06 / s.y;
        s.z = Vec3.set(v3_1, m.m08, m.m09, m.m10).length();
        m3_1.m06 = m.m08 / s.z;
        m3_1.m07 = m.m09 / s.z;
        m3_1.m08 = m.m10 / s.z;
        const det = Mat3.determinant(m3_1);
        if (det < 0) { s.x *= -1; m3_1.m00 *= -1; m3_1.m01 *= -1; m3_1.m02 *= -1; }
        Quat.fromMat3(q, m3_1); // already normalized
        Vec3.set(v, m.m12, m.m13, m.m14);
    }

    /**
     * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     */
    public static fromRTS <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const sx = s.x;
        const sy = s.y;
        const sz = s.z;

        out.m00 = (1 - (yy + zz)) * sx;
        out.m01 = (xy + wz) * sx;
        out.m02 = (xz - wy) * sx;
        out.m03 = 0;
        out.m04 = (xy - wz) * sy;
        out.m05 = (1 - (xx + zz)) * sy;
        out.m06 = (yz + wx) * sy;
        out.m07 = 0;
        out.m08 = (xz + wy) * sz;
        out.m09 = (yz - wx) * sz;
        out.m10 = (1 - (xx + yy)) * sz;
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
     * @param q 旋转值
     * @param v 位移值
     * @param s 缩放值
     * @param o 指定变换中心
     */
    public static fromRTSOrigin <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        const sx = s.x;
        const sy = s.y;
        const sz = s.z;

        const ox = o.x;
        const oy = o.y;
        const oz = o.z;

        out.m00 = (1 - (yy + zz)) * sx;
        out.m01 = (xy + wz) * sx;
        out.m02 = (xz - wy) * sx;
        out.m03 = 0;
        out.m04 = (xy - wz) * sy;
        out.m05 = (1 - (xx + zz)) * sy;
        out.m06 = (yz + wx) * sy;
        out.m07 = 0;
        out.m08 = (xz + wy) * sz;
        out.m09 = (yz - wx) * sz;
        out.m10 = (1 - (xx + yy)) * sz;
        out.m11 = 0;
        out.m12 = v.x + ox - (out.m00 * ox + out.m04 * oy + out.m08 * oz);
        out.m13 = v.y + oy - (out.m01 * ox + out.m05 * oy + out.m09 * oz);
        out.m14 = v.z + oz - (out.m02 * ox + out.m06 * oy + out.m10 * oz);
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 根据指定的旋转信息计算矩阵
     */
    public static fromQuat <Out extends IMat4Like> (out: Out, q: Quat) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        out.m00 = 1 - yy - zz;
        out.m01 = yx + wz;
        out.m02 = zx - wy;
        out.m03 = 0;

        out.m04 = yx - wz;
        out.m05 = 1 - xx - zz;
        out.m06 = zy + wx;
        out.m07 = 0;

        out.m08 = zx + wy;
        out.m09 = zy - wx;
        out.m10 = 1 - xx - yy;
        out.m11 = 0;

        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 根据指定的视锥体信息计算矩阵
     * @param left 左平面距离
     * @param right 右平面距离
     * @param bottom 下平面距离
     * @param top 上平面距离
     * @param near 近平面距离
     * @param far 远平面距离
     */
    public static frustum <Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const nf = 1 / (near - far);

        out.m00 = (near * 2) * rl;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = (near * 2) * tb;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = (right + left) * rl;
        out.m09 = (top + bottom) * tb;
        out.m10 = (far + near) * nf;
        out.m11 = -1;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = (far * near * 2) * nf;
        out.m15 = 0;
        return out;
    }

    /**
     * @zh 计算透视投影矩阵
     * @param fovy 纵向视角高度
     * @param aspect 长宽比
     * @param near 近平面距离
     * @param far 远平面距离
     */
    public static perspective <Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number) {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);

        out.m00 = f / aspect;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = f;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = (far + near) * nf;
        out.m11 = -1;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = (2 * far * near) * nf;
        out.m15 = 0;
        return out;
    }

    /**
     * @zh 计算正交投影矩阵
     * @param left 左平面距离
     * @param right 右平面距离
     * @param bottom 下平面距离
     * @param top 上平面距离
     * @param near 近平面距离
     * @param far 远平面距离
     */
    public static ortho <Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        out.m00 = -2 * lr;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = -2 * bt;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 2 * nf;
        out.m11 = 0;
        out.m12 = (left + right) * lr;
        out.m13 = (top + bottom) * bt;
        out.m14 = (far + near) * nf;
        out.m15 = 1;
        return out;
    }

    /**
     * @zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
     * @param eye 当前位置
     * @param center 目标视点
     * @param up 视口上方向
     */
    public static lookAt <Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike) {
        const eyex = eye.x;
        const eyey = eye.y;
        const eyez = eye.z;
        const upx = up.x;
        const upy = up.y;
        const upz = up.z;
        const centerx = center.x;
        const centery = center.y;
        const centerz = center.z;

        let z0 = eyex - centerx;
        let z1 = eyey - centery;
        let z2 = eyez - centerz;

        let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;
        len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        x0 *= len;
        x1 *= len;
        x2 *= len;

        const y0 = z1 * x2 - z2 * x1;
        const y1 = z2 * x0 - z0 * x2;
        const y2 = z0 * x1 - z1 * x0;

        out.m00 = x0;
        out.m01 = y0;
        out.m02 = z0;
        out.m03 = 0;
        out.m04 = x1;
        out.m05 = y1;
        out.m06 = z1;
        out.m07 = 0;
        out.m08 = x2;
        out.m09 = y2;
        out.m10 = z2;
        out.m11 = 0;
        out.m12 = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out.m13 = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out.m14 = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 计算逆转置矩阵
     */
    public static inverseTranspose <Out extends IMat4Like> (out: Out, a: Out) {

        _a00 = a.m00; _a01 = a.m01; _a02 = a.m02; _a03 = a.m03;
        _a10 = a.m04; _a11 = a.m05; _a12 = a.m06; _a13 = a.m07;
        _a20 = a.m08; _a21 = a.m09; _a22 = a.m10; _a23 = a.m11;
        _a30 = a.m12; _a31 = a.m13; _a32 = a.m14; _a33 = a.m15;

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out.m00 = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        out.m01 = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        out.m02 = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        out.m03 = 0;

        out.m04 = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        out.m05 = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        out.m06 = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        out.m07 = 0;

        out.m08 = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        out.m09 = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        out.m10 = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        out.m11 = 0;

        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;

        return out;
    }

    /**
     * @zh 矩阵转数组
     * @param ofs 数组内的起始偏移量
     */
    public static array <Out extends IMat4Like> (out: IWritableArrayLike<number>, m: Out, ofs = 0) {
        out[ofs + 0] = m.m00;
        out[ofs + 1] = m.m01;
        out[ofs + 2] = m.m02;
        out[ofs + 3] = m.m03;
        out[ofs + 4] = m.m04;
        out[ofs + 5] = m.m05;
        out[ofs + 6] = m.m06;
        out[ofs + 7] = m.m07;
        out[ofs + 8] = m.m08;
        out[ofs + 9] = m.m09;
        out[ofs + 10] = m.m10;
        out[ofs + 11] = m.m11;
        out[ofs + 12] = m.m12;
        out[ofs + 13] = m.m13;
        out[ofs + 14] = m.m14;
        out[ofs + 15] = m.m15;

        return out;
    }

    /**
     * @zh 逐元素矩阵加法
     */
    public static add <Out extends IMat4Like> (out: Out, a: Out, b: Out) {
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
        return out;
    }

    /**
     * @zh 逐元素矩阵减法
     */
    public static subtract <Out extends IMat4Like> (out: Out, a: Out, b: Out) {
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
        return out;
    }

    /**
     * @zh 矩阵标量乘法
     */
    public static multiplyScalar <Out extends IMat4Like> (out: Out, a: Out, b: number) {
        out.m00 = a.m00 * b;
        out.m01 = a.m01 * b;
        out.m02 = a.m02 * b;
        out.m03 = a.m03 * b;
        out.m04 = a.m04 * b;
        out.m05 = a.m05 * b;
        out.m06 = a.m06 * b;
        out.m07 = a.m07 * b;
        out.m08 = a.m08 * b;
        out.m09 = a.m09 * b;
        out.m10 = a.m10 * b;
        out.m11 = a.m11 * b;
        out.m12 = a.m12 * b;
        out.m13 = a.m13 * b;
        out.m14 = a.m14 * b;
        out.m15 = a.m15 * b;
        return out;
    }

    /**
     * @zh 逐元素矩阵标量乘加: A + B * scale
     */
    public static multiplyScalarAndAdd <Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number) {
        out.m00 = a.m00 + (b.m00 * scale);
        out.m01 = a.m01 + (b.m01 * scale);
        out.m02 = a.m02 + (b.m02 * scale);
        out.m03 = a.m03 + (b.m03 * scale);
        out.m04 = a.m04 + (b.m04 * scale);
        out.m05 = a.m05 + (b.m05 * scale);
        out.m06 = a.m06 + (b.m06 * scale);
        out.m07 = a.m07 + (b.m07 * scale);
        out.m08 = a.m08 + (b.m08 * scale);
        out.m09 = a.m09 + (b.m09 * scale);
        out.m10 = a.m10 + (b.m10 * scale);
        out.m11 = a.m11 + (b.m11 * scale);
        out.m12 = a.m12 + (b.m12 * scale);
        out.m13 = a.m13 + (b.m13 * scale);
        out.m14 = a.m14 + (b.m14 * scale);
        out.m15 = a.m15 + (b.m15 * scale);
        return out;
    }

    /**
     * @zh 矩阵等价判断
     */
    public static strictEquals <Out extends IMat4Like> (a: Out, b: Out) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 &&
            a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 &&
            a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 &&
            a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
    }

    /**
     * @zh 排除浮点数误差的矩阵近似等价判断
     */
    public static equals <Out extends IMat4Like> (a: Out, b: Out, epsilon = EPSILON) {

        return (
            Math.abs(a.m00 - b.m00) <= epsilon * Math.max(1.0, Math.abs(a.m00), Math.abs(b.m00)) &&
            Math.abs(a.m01 - b.m01) <= epsilon * Math.max(1.0, Math.abs(a.m01), Math.abs(b.m01)) &&
            Math.abs(a.m02 - b.m02) <= epsilon * Math.max(1.0, Math.abs(a.m02), Math.abs(b.m02)) &&
            Math.abs(a.m03 - b.m03) <= epsilon * Math.max(1.0, Math.abs(a.m03), Math.abs(b.m03)) &&
            Math.abs(a.m04 - b.m04) <= epsilon * Math.max(1.0, Math.abs(a.m04), Math.abs(b.m04)) &&
            Math.abs(a.m05 - b.m05) <= epsilon * Math.max(1.0, Math.abs(a.m05), Math.abs(b.m05)) &&
            Math.abs(a.m06 - b.m06) <= epsilon * Math.max(1.0, Math.abs(a.m06), Math.abs(b.m06)) &&
            Math.abs(a.m07 - b.m07) <= epsilon * Math.max(1.0, Math.abs(a.m07), Math.abs(b.m07)) &&
            Math.abs(a.m08 - b.m08) <= epsilon * Math.max(1.0, Math.abs(a.m08), Math.abs(b.m08)) &&
            Math.abs(a.m09 - b.m09) <= epsilon * Math.max(1.0, Math.abs(a.m09), Math.abs(b.m09)) &&
            Math.abs(a.m10 - b.m10) <= epsilon * Math.max(1.0, Math.abs(a.m10), Math.abs(b.m10)) &&
            Math.abs(a.m11 - b.m11) <= epsilon * Math.max(1.0, Math.abs(a.m11), Math.abs(b.m11)) &&
            Math.abs(a.m12 - b.m12) <= epsilon * Math.max(1.0, Math.abs(a.m12), Math.abs(b.m12)) &&
            Math.abs(a.m13 - b.m13) <= epsilon * Math.max(1.0, Math.abs(a.m13), Math.abs(b.m13)) &&
            Math.abs(a.m14 - b.m14) <= epsilon * Math.max(1.0, Math.abs(a.m14), Math.abs(b.m14)) &&
            Math.abs(a.m15 - b.m15) <= epsilon * Math.max(1.0, Math.abs(a.m15), Math.abs(b.m15))
        );
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

    public set (other: Mat4);
    public set (
        m00?: number, m01?: number, m02?: number, m03?: number,
        m04?: number, m05?: number, m06?: number, m07?: number,
        m08?: number, m09?: number, m10?: number, m11?: number,
        m12?: number, m13?: number, m14?: number, m15?: number);

    /**
     * 设置当前矩阵使其与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns `this`
     */
    public set (m00: Mat4 | number = 1, m01 = 0, m02 = 0, m03 = 0,
                m04 = 0, m05 = 1, m06 = 0, m07 = 0,
                m08 = 0, m09 = 0, m10 = 1, m11 = 0,
                m12 = 0, m13 = 0, m14 = 0, m15 = 1) {
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
        return this;
    }

    /**
     * 判断当前矩阵是否在误差范围内与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Mat4, epsilon = EPSILON): boolean {
        return (
            Math.abs(this.m00 - other.m00) <= epsilon * Math.max(1.0, Math.abs(this.m00), Math.abs(other.m00)) &&
            Math.abs(this.m01 - other.m01) <= epsilon * Math.max(1.0, Math.abs(this.m01), Math.abs(other.m01)) &&
            Math.abs(this.m02 - other.m02) <= epsilon * Math.max(1.0, Math.abs(this.m02), Math.abs(other.m02)) &&
            Math.abs(this.m03 - other.m03) <= epsilon * Math.max(1.0, Math.abs(this.m03), Math.abs(other.m03)) &&
            Math.abs(this.m04 - other.m04) <= epsilon * Math.max(1.0, Math.abs(this.m04), Math.abs(other.m04)) &&
            Math.abs(this.m05 - other.m05) <= epsilon * Math.max(1.0, Math.abs(this.m05), Math.abs(other.m05)) &&
            Math.abs(this.m06 - other.m06) <= epsilon * Math.max(1.0, Math.abs(this.m06), Math.abs(other.m06)) &&
            Math.abs(this.m07 - other.m07) <= epsilon * Math.max(1.0, Math.abs(this.m07), Math.abs(other.m07)) &&
            Math.abs(this.m08 - other.m08) <= epsilon * Math.max(1.0, Math.abs(this.m08), Math.abs(other.m08)) &&
            Math.abs(this.m09 - other.m09) <= epsilon * Math.max(1.0, Math.abs(this.m09), Math.abs(other.m09)) &&
            Math.abs(this.m10 - other.m10) <= epsilon * Math.max(1.0, Math.abs(this.m10), Math.abs(other.m10)) &&
            Math.abs(this.m11 - other.m11) <= epsilon * Math.max(1.0, Math.abs(this.m11), Math.abs(other.m11)) &&
            Math.abs(this.m12 - other.m12) <= epsilon * Math.max(1.0, Math.abs(this.m12), Math.abs(other.m12)) &&
            Math.abs(this.m13 - other.m13) <= epsilon * Math.max(1.0, Math.abs(this.m13), Math.abs(other.m13)) &&
            Math.abs(this.m14 - other.m14) <= epsilon * Math.max(1.0, Math.abs(this.m14), Math.abs(other.m14)) &&
            Math.abs(this.m15 - other.m15) <= epsilon * Math.max(1.0, Math.abs(this.m15), Math.abs(other.m15))
        );
    }

    /**
     * 判断当前矩阵是否与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals (other: Mat4): boolean {
        return this.m00 === other.m00 && this.m01 === other.m01 && this.m02 === other.m02 && this.m03 === other.m03 &&
            this.m04 === other.m04 && this.m05 === other.m05 && this.m06 === other.m06 && this.m07 === other.m07 &&
            this.m08 === other.m08 && this.m09 === other.m09 && this.m10 === other.m10 && this.m11 === other.m11 &&
            this.m12 === other.m12 && this.m13 === other.m13 && this.m14 === other.m14 && this.m15 === other.m15;
    }

    /**
     * 返回当前矩阵的字符串表示。
     * @returns 当前矩阵的字符串表示。
     */
    public toString () {
        return '[\n' +
            this.m00 + ', ' + this.m01 + ', ' + this.m02 + ', ' + this.m03 + ',\n' +
            this.m04 + ', ' + this.m05 + ', ' + this.m06 + ', ' + this.m07 + ',\n' +
            this.m08 + ', ' + this.m09 + ', ' + this.m10 + ', ' + this.m11 + ',\n' +
            this.m12 + ', ' + this.m13 + ', ' + this.m14 + ', ' + this.m15 + '\n' +
            ']';
    }

    /**
     * 将当前矩阵设为单位矩阵。
     * @returns `this`
     */
    public identity () {
        this.m00 = 1;
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m04 = 0;
        this.m05 = 1;
        this.m06 = 0;
        this.m07 = 0;
        this.m08 = 0;
        this.m09 = 0;
        this.m10 = 1;
        this.m11 = 0;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m15 = 1;
        return this;
    }

    /**
     * 计算当前矩阵的转置矩阵。
     */
    public transpose () {
        const a01 = this.m01, a02 = this.m02, a03 = this.m03, a12 = this.m06, a13 = this.m07, a23 = this.m11;
        this.m01 = this.m04;
        this.m02 = this.m08;
        this.m03 = this.m12;
        this.m04 = a01;
        this.m06 = this.m09;
        this.m07 = this.m13;
        this.m08 = a02;
        this.m09 = a12;
        this.m11 = this.m14;
        this.m12 = a03;
        this.m13 = a13;
        this.m14 = a23;
        return this;
    }

    /**
     * 计算当前矩阵的逆矩阵。
     */
    public invert () {
        _a00 = this.m00; _a01 = this.m01; _a02 = this.m02; _a03 = this.m03;
        _a10 = this.m04; _a11 = this.m05; _a12 = this.m06; _a13 = this.m07;
        _a20 = this.m08; _a21 = this.m09; _a22 = this.m10; _a23 = this.m11;
        _a30 = this.m12; _a31 = this.m13; _a32 = this.m14; _a33 = this.m15;

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (det === 0) { return null; }
        det = 1.0 / det;

        this.m00 = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        this.m01 = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        this.m02 = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        this.m03 = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
        this.m04 = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        this.m05 = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        this.m06 = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        this.m07 = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
        this.m08 = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        this.m09 = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        this.m10 = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        this.m11 = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
        this.m12 = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
        this.m13 = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
        this.m14 = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
        this.m15 = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;

        return this;
    }

    /**
     * 计算当前矩阵的行列式。
     * @returns 当前矩阵的行列式。
     */
    public determinant (): number {
        _a00 = this.m00; _a01 = this.m01; _a02 = this.m02; _a03 = this.m03;
        _a10 = this.m04; _a11 = this.m05; _a12 = this.m06; _a13 = this.m07;
        _a20 = this.m08; _a21 = this.m09; _a22 = this.m10; _a23 = this.m11;
        _a30 = this.m12; _a31 = this.m13; _a32 = this.m14; _a33 = this.m15;

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
     * 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
     * @param mat 相加的矩阵
     */
    public add (mat: Mat4) {
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
        return this;
    }

    /**
     * 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat 减数矩阵。
     */
    public subtract (mat: Mat4) {
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
        return this;
    }

    /**
     * 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat 指定的矩阵。
     */
    public multiply (mat: Mat4) {
        _a00 = this.m00; _a01 = this.m01; _a02 = this.m02; _a03 = this.m03;
        _a10 = this.m04; _a11 = this.m05; _a12 = this.m06; _a13 = this.m07;
        _a20 = this.m08; _a21 = this.m09; _a22 = this.m10; _a23 = this.m11;
        _a30 = this.m12; _a31 = this.m13; _a32 = this.m14; _a33 = this.m15;

        // Cache only the current line of the second matrix
        let b0 = mat.m00, b1 = mat.m01, b2 = mat.m02, b3 = mat.m03;
        this.m00 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        this.m01 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        this.m02 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        this.m03 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = mat.m04; b1 = mat.m05; b2 = mat.m06; b3 = mat.m07;
        this.m04 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        this.m05 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        this.m06 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        this.m07 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = mat.m08; b1 = mat.m09; b2 = mat.m10; b3 = mat.m11;
        this.m08 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        this.m09 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        this.m10 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        this.m11 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = mat.m12; b1 = mat.m13; b2 = mat.m14; b3 = mat.m15;
        this.m12 = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        this.m13 = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        this.m14 = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        this.m15 = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
        return this;
    }

    /**
     * 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar 指定的标量。
     */
    public multiplyScalar (scalar: number) {
        this.m00 = this.m00 * scalar;
        this.m01 = this.m01 * scalar;
        this.m02 = this.m02 * scalar;
        this.m03 = this.m03 * scalar;
        this.m04 = this.m04 * scalar;
        this.m05 = this.m05 * scalar;
        this.m06 = this.m06 * scalar;
        this.m07 = this.m07 * scalar;
        this.m08 = this.m08 * scalar;
        this.m09 = this.m09 * scalar;
        this.m10 = this.m10 * scalar;
        this.m11 = this.m11 * scalar;
        this.m12 = this.m12 * scalar;
        this.m13 = this.m13 * scalar;
        this.m14 = this.m14 * scalar;
        this.m15 = this.m15 * scalar;
        return this;
    }

    /**
     * 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec 位移向量。
     */
    public translate (vec: Vec3) {
        console.warn('function changed');
        this.m12 += vec.x;
        this.m13 += vec.y;
        this.m14 += vec.y;
        return this;
    }

    /**
     * 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
     * @param vec 各个轴的缩放。
     */
    public scale (vec: Vec3) {
        const x = vec.x, y = vec.y, z = vec.z;
        this.m00 = this.m00 * x;
        this.m01 = this.m01 * x;
        this.m02 = this.m02 * x;
        this.m03 = this.m03 * x;
        this.m04 = this.m04 * y;
        this.m05 = this.m05 * y;
        this.m06 = this.m06 * y;
        this.m07 = this.m07 * y;
        this.m08 = this.m08 * z;
        this.m09 = this.m09 * z;
        this.m10 = this.m10 * z;
        this.m11 = this.m11 * z;
        this.m12 = this.m12;
        this.m13 = this.m13;
        this.m14 = this.m14;
        this.m15 = this.m15;
        return this;
    }

    /**
     * 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param mat 矩阵
     * @param rad 旋转角度（弧度制）
     * @param axis 旋转轴
     */
    public rotate (rad: number, axis: Vec3) {
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

        _a00 = this.m00; _a01 = this.m01; _a02 = this.m02; _a03 = this.m03;
        _a10 = this.m04; _a11 = this.m05; _a12 = this.m06; _a13 = this.m07;
        _a20 = this.m08; _a21 = this.m09; _a22 = this.m10; _a23 = this.m11;

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this.m00 = _a00 * b00 + _a10 * b01 + _a20 * b02;
        this.m01 = _a01 * b00 + _a11 * b01 + _a21 * b02;
        this.m02 = _a02 * b00 + _a12 * b01 + _a22 * b02;
        this.m03 = _a03 * b00 + _a13 * b01 + _a23 * b02;
        this.m04 = _a00 * b10 + _a10 * b11 + _a20 * b12;
        this.m05 = _a01 * b10 + _a11 * b11 + _a21 * b12;
        this.m06 = _a02 * b10 + _a12 * b11 + _a22 * b12;
        this.m07 = _a03 * b10 + _a13 * b11 + _a23 * b12;
        this.m08 = _a00 * b20 + _a10 * b21 + _a20 * b22;
        this.m09 = _a01 * b20 + _a11 * b21 + _a21 * b22;
        this.m10 = _a02 * b20 + _a12 * b21 + _a22 * b22;
        this.m11 = _a03 * b20 + _a13 * b21 + _a23 * b22;

        return this;
    }

    /**
     * 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
     * @param out 返回向量，当未指定时将创建为新的向量。
     */
    public getTranslation (out: Vec3) {
        out.x = this.m12;
        out.y = this.m13;
        out.z = this.m14;

        return out;
    }

    /**
     * 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
     * @param out 返回值，当未指定时将创建为新的向量。
     */
    public getScale (out: Vec3) {
        const m00 = m3_1.m00 = this.m00;
        const m01 = m3_1.m01 = this.m01;
        const m02 = m3_1.m02 = this.m02;
        const m04 = m3_1.m03 = this.m04;
        const m05 = m3_1.m04 = this.m05;
        const m06 = m3_1.m05 = this.m06;
        const m08 = m3_1.m06 = this.m08;
        const m09 = m3_1.m07 = this.m09;
        const m10 = m3_1.m08 = this.m10;
        out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
        // account for refections
        if (Mat3.determinant(m3_1) < 0) { out.x *= -1; }
        return out;
    }

    /**
     * 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
     * @param out 返回值，当未指定时将创建为新的四元数。
     */
    public getRotation (out: Quat) {
        const trace = this.m00 + this.m05 + this.m10;
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out.w = 0.25 * S;
            out.x = (this.m06 - this.m09) / S;
            out.y = (this.m08 - this.m02) / S;
            out.z = (this.m01 - this.m04) / S;
        } else if ((this.m00 > this.m05) && (this.m00 > this.m10)) {
            S = Math.sqrt(1.0 + this.m00 - this.m05 - this.m10) * 2;
            out.w = (this.m06 - this.m09) / S;
            out.x = 0.25 * S;
            out.y = (this.m01 + this.m04) / S;
            out.z = (this.m08 + this.m02) / S;
        } else if (this.m05 > this.m10) {
            S = Math.sqrt(1.0 + this.m05 - this.m00 - this.m10) * 2;
            out.w = (this.m08 - this.m02) / S;
            out.x = (this.m01 + this.m04) / S;
            out.y = 0.25 * S;
            out.z = (this.m06 + this.m09) / S;
        } else {
            S = Math.sqrt(1.0 + this.m10 - this.m00 - this.m05) * 2;
            out.w = (this.m01 - this.m04) / S;
            out.x = (this.m08 + this.m02) / S;
            out.y = (this.m06 + this.m09) / S;
            out.z = 0.25 * S;
        }

        return out;
    }

    /**
     * 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q 四元数表示的旋转变换。
     * @param v 位移变换，表示为各个轴的位移。
     * @param s 缩放变换，表示为各个轴的缩放。
     * @returns `this`
     */
    public fromRTS (q: Quat, v: Vec3, s: Vec3) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const xy = x * y2;
        const xz = x * z2;
        const yy = y * y2;
        const yz = y * z2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        const sx = s.x;
        const sy = s.y;
        const sz = s.z;

        this.m00 = (1 - (yy + zz)) * sx;
        this.m01 = (xy + wz) * sx;
        this.m02 = (xz - wy) * sx;
        this.m03 = 0;
        this.m04 = (xy - wz) * sy;
        this.m05 = (1 - (xx + zz)) * sy;
        this.m06 = (yz + wx) * sy;
        this.m07 = 0;
        this.m08 = (xz + wy) * sz;
        this.m09 = (yz - wx) * sz;
        this.m10 = (1 - (xx + yy)) * sz;
        this.m11 = 0;
        this.m12 = v.x;
        this.m13 = v.y;
        this.m14 = v.z;
        this.m15 = 1;

        return this;
    }

    /**
     * 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q 四元数表示的旋转变换。
     * @returns `this`
     */
    public fromQuat (q: Quat) {
        const x = q.x, y = q.y, z = q.z, w = q.w;
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;

        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;

        this.m00 = 1 - yy - zz;
        this.m01 = yx + wz;
        this.m02 = zx - wy;
        this.m03 = 0;

        this.m04 = yx - wz;
        this.m05 = 1 - xx - zz;
        this.m06 = zy + wx;
        this.m07 = 0;

        this.m08 = zx + wy;
        this.m09 = zy - wx;
        this.m10 = 1 - xx - yy;
        this.m11 = 0;

        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m15 = 1;

        return this;
    }
}

const v3_1 = new Vec3();
const m3_1 = new Mat3();

CCClass.fastDefine('cc.Mat4', Mat4, {
    m00: 1, m01: 0, m02: 0, m03: 0,
    m04: 0, m05: 1, m06: 0, m07: 0,
    m08: 0, m09: 0, m10: 1, m11: 0,
    m12: 0, m13: 0, m14: 0, m15: 1,
});
cc.Mat4 = Mat4;

export function mat4 (other: Mat4): Mat4;
export function mat4 (
    m00?: number, m01?: number, m02?: number, m03?: number,
    m10?: number, m11?: number, m12?: number, m13?: number,
    m20?: number, m21?: number, m22?: number, m23?: number,
    m30?: number, m31?: number, m32?: number, m33?: number): Mat4;

export function mat4 (
    m00?: Mat4 | number, m01?, m02?, m03?,
    m10?, m11?, m12?, m13?,
    m20?, m21?, m22?, m23?,
    m30?, m31?, m32?, m33?) {
    return new Mat4(m00 as any, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
}

cc.mat4 = mat4;
