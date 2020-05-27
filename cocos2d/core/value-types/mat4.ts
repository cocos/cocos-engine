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

import ValueType from './value-type';
import CCClass from '../platform/CCClass';
import Vec3 from './vec3';
import Quat from './quat';
import { EPSILON, FLOAT_ARRAY_TYPE } from './utils';
import Mat3 from './mat3';

let _a00: number = 0; let _a01: number = 0; let _a02: number = 0; let _a03: number = 0;
let _a10: number = 0; let _a11: number = 0; let _a12: number = 0; let _a13: number = 0;
let _a20: number = 0; let _a21: number = 0; let _a22: number = 0; let _a23: number = 0;
let _a30: number = 0; let _a31: number = 0; let _a32: number = 0; let _a33: number = 0;

/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 *
 * @class Mat4
 * @extends ValueType
 */
export default class Mat4 extends ValueType {
    static mul = Mat4.multiply;
    static sub = Mat4.subtract;

    /**
     * !#en Multiply the current matrix with another one
     * !#zh 将当前矩阵与指定矩阵相乘
     * @method mul
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    mul (m: Mat4, out: Mat4): Mat4 {
        return Mat4.multiply(out || new Mat4(), this, m);
    }
    /**
     * !#en Multiply each element of the matrix by a scalar.
     * !#zh 将矩阵的每一个元素都乘以指定的缩放值。
     * @method mulScalar
     * @param {Number} number amount to scale the matrix's elements by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    mulScalar (num: number, out: Mat4) {
        Mat4.multiplyScalar(out || new Mat4(), this, num);
    }
    /**
     * !#en Subtracts the current matrix with another one
     * !#zh 将当前矩阵与指定的矩阵相减
     * @method sub
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    sub (m: Mat4, out: Mat4) {
        Mat4.subtract(out || new Mat4(), this, m);
    }

    /**
     * Identity  of Mat4
     * @property {Mat4} IDENTITY
     * @static
     */
    static IDENTITY = Object.freeze(new Mat4());

    /**
     * !#zh 获得指定矩阵的拷贝
     * !#en Copy of the specified matrix to obtain
     * @method clone
     * @typescript
     * clone<Out extends IMat4Like> (a: Out): Mat4
     * @static
     */
    static clone<Out extends IMat4Like> (a: Out) {
        let m = a.m;
        return new Mat4(
            m[0], m[1], m[2], m[3],
            m[4], m[5], m[6], m[7],
            m[8], m[9], m[10], m[11],
            m[12], m[13], m[14], m[15],
        );
    }

    /**
     * !#zh 复制目标矩阵
     * !#en Copy the target matrix
     * @method copy
     * @typescript
     * copy<Out extends IMat4Like> (out: Out, a: Out): Out
     * @static
     */
    static copy<Out extends IMat4Like> (out: Out, a: Out) {
        let m = out.m, am = a.m;
        m[0] = am[0];
        m[1] = am[1];
        m[2] = am[2];
        m[3] = am[3];
        m[4] = am[4];
        m[5] = am[5];
        m[6] = am[6];
        m[7] = am[7];
        m[8] = am[8];
        m[9] = am[9];
        m[10] = am[10];
        m[11] = am[11];
        m[12] = am[12];
        m[13] = am[13];
        m[14] = am[14];
        m[15] = am[15];
        return out;
    }

    /**
     * !#zh 设置矩阵值
     * !#en Setting matrix values
     * @static
     */
    static set<Out extends IMat4Like> (
        out: Out,
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number,
    ) {
        let m = out.m;
        m[0] = m00; m[1] = m01; m[2] = m02; m[3] = m03;
        m[4] = m10; m[5] = m11; m[6] = m12; m[7] = m13;
        m[8] = m20; m[9] = m21; m[10] = m22; m[11] = m23;
        m[12] = m30; m[13] = m31; m[14] = m32; m[15] = m33;
        return out;
    }

    /**
     * !#zh 将目标赋值为单位矩阵
     * !#en The target of an assignment is the identity matrix
     * @method identity
     * @typescript
     * identity<Out extends IMat4Like> (out: Out): Out
     * @static
     */
    static identity<Out extends IMat4Like> (out: Out) {
        let m = out.m;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 转置矩阵
     * !#en Transposed matrix
     * @method transpose
     * @typescript
     * transpose<Out extends IMat4Like> (out: Out, a: Out): Out
     * @static
     */
    static transpose<Out extends IMat4Like> (out: Out, a: Out) {
        let m = out.m, am = a.m;
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            const a01 = am[1], a02 = am[2], a03 = am[3], a12 = am[6], a13 = am[7], a23 = am[11];
            m[1] = am[4];
            m[2] = am[8];
            m[3] = am[12];
            m[4] = a01;
            m[6] = am[9];
            m[7] = am[13];
            m[8] = a02;
            m[9] = a12;
            m[11] = am[14];
            m[12] = a03;
            m[13] = a13;
            m[14] = a23;
        } else {
            m[0] = am[0];
            m[1] = am[4];
            m[2] = am[8];
            m[3] = am[12];
            m[4] = am[1];
            m[5] = am[5];
            m[6] = am[9];
            m[7] = am[13];
            m[8] = am[2];
            m[9] = am[6];
            m[10] = am[10];
            m[11] = am[14];
            m[12] = am[3];
            m[13] = am[7];
            m[14] = am[11];
            m[15] = am[15];
        }
        return out;
    }

    /**
     * !#zh 矩阵求逆
     * !#en Matrix inversion
     * @method invert
     * @typescript
     * invert<Out extends IMat4Like> (out: Out, a: Out): Out
     * @static
     */
    static invert<Out extends IMat4Like> (out: Out, a: Out) {
        let am = a.m;
        _a00 = am[0]; _a01 = am[1]; _a02 = am[2]; _a03 = am[3];
        _a10 = am[4]; _a11 = am[5]; _a12 = am[6]; _a13 = am[7];
        _a20 = am[8]; _a21 = am[9]; _a22 = am[10]; _a23 = am[11];
        _a30 = am[12]; _a31 = am[13]; _a32 = am[14]; _a33 = am[15];

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

        let m = out.m;
        m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        m[1] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        m[2] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        m[3] = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
        m[4] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        m[6] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        m[7] = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
        m[8] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        m[9] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        m[11] = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
        m[12] = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
        m[13] = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
        m[14] = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
        m[15] = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;

        return out;
    }

    /**
     * !#zh 矩阵行列式
     * !#en Matrix determinant
     * @method determinant
     * @typescript
     * determinant<Out extends IMat4Like> (a: Out): number
     * @static
     */
    static determinant<Out extends IMat4Like> (a: Out): number {
        let m = a.m;
        _a00 = m[0]; _a01 = m[1]; _a02 = m[2]; _a03 = m[3];
        _a10 = m[4]; _a11 = m[5]; _a12 = m[6]; _a13 = m[7];
        _a20 = m[8]; _a21 = m[9]; _a22 = m[10]; _a23 = m[11];
        _a30 = m[12]; _a31 = m[13]; _a32 = m[14]; _a33 = m[15];

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
     * !#zh 矩阵乘法
     * !#en Matrix Multiplication
     * @method multiply
     * @typescript
     * multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
     * @static
     */
    static multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out) {
        let m = out.m, am = a.m, bm = b.m;
        _a00 = am[0]; _a01 = am[1]; _a02 = am[2]; _a03 = am[3];
        _a10 = am[4]; _a11 = am[5]; _a12 = am[6]; _a13 = am[7];
        _a20 = am[8]; _a21 = am[9]; _a22 = am[10]; _a23 = am[11];
        _a30 = am[12]; _a31 = am[13]; _a32 = am[14]; _a33 = am[15];

        // Cache only the current line of the second matrix
        let b0 = bm[0], b1 = bm[1], b2 = bm[2], b3 = bm[3];
        m[0] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        m[1] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        m[2] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        m[3] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = bm[4]; b1 = bm[5]; b2 = bm[6]; b3 = bm[7];
        m[4] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        m[5] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        m[6] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        m[7] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = bm[8]; b1 = bm[9]; b2 = bm[10]; b3 = bm[11];
        m[8] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        m[9] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        m[10] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        m[11] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;

        b0 = bm[12]; b1 = bm[13]; b2 = bm[14]; b3 = bm[15];
        m[12] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
        m[13] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
        m[14] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
        m[15] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入变换
     * !#en Was added in a given transformation matrix transformation on the basis of
     * @method transform
     * @typescript
     * transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
     * @static
     */
    static transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        const x = v.x, y = v.y, z = v.z;
        let m = out.m, am = a.m;
        if (a === out) {
            m[12] = am[0] * x + am[4] * y + am[8] * z + am[12];
            m[13] = am[1] * x + am[5] * y + am[9] * z + am[13];
            m[14] = am[2] * x + am[6] * y + am[10] * z + am[14];
            m[15] = am[3] * x + am[7] * y + am[11] * z + am[15];
        } else {
            _a00 = am[0]; _a01 = am[1]; _a02 = am[2]; _a03 = am[3];
            _a10 = am[4]; _a11 = am[5]; _a12 = am[6]; _a13 = am[7];
            _a20 = am[8]; _a21 = am[9]; _a22 = am[10]; _a23 = am[11];
            _a30 = am[12]; _a31 = am[13]; _a32 = am[14]; _a33 = am[15];

            m[0] = _a00; m[1] = _a01; m[2] = _a02; m[3] = _a03;
            m[4] = _a10; m[5] = _a11; m[6] = _a12; m[7] = _a13;
            m[8] = _a20; m[9] = _a21; m[10] = _a22; m[11] = _a23;

            m[12] = _a00 * x + _a10 * y + _a20 * z + am[12];
            m[13] = _a01 * x + _a11 * y + _a21 * z + am[13];
            m[14] = _a02 * x + _a12 * y + _a22 * z + am[14];
            m[15] = _a03 * x + _a13 * y + _a23 * z + am[15];
        }
        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入新位移变换
     * !#en Add new displacement transducer in a matrix transformation on the basis of a given
     * @method translate
     * @typescript
     * translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
     * @static
     */
    static translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        let m = out.m, am = a.m;
        if (a === out) {
            m[12] += v.x;
            m[13] += v.y;
            m[14] += v.z;
        } else {
            m[0] = am[0]; m[1] = am[1]; m[2] = am[2]; m[3] = am[3];
            m[4] = am[4]; m[5] = am[5]; m[6] = am[6]; m[7] = am[7];
            m[8] = am[8]; m[9] = am[9]; m[10] = am[10]; m[11] = am[11];
            m[12] += v.x;
            m[13] += v.y;
            m[14] += v.z;
            m[15] = am[15];
        }
        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入新缩放变换
     * !#en Add new scaling transformation in a given matrix transformation on the basis of
     * @method scale
     * @typescript
     * scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike): Out
     * @static
     */
    static scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike) {
        const x = v.x, y = v.y, z = v.z;
        let m = out.m, am = a.m;
        m[0] = am[0] * x;
        m[1] = am[1] * x;
        m[2] = am[2] * x;
        m[3] = am[3] * x;
        m[4] = am[4] * y;
        m[5] = am[5] * y;
        m[6] = am[6] * y;
        m[7] = am[7] * y;
        m[8] = am[8] * z;
        m[9] = am[9] * z;
        m[10] = am[10] * z;
        m[11] = am[11] * z;
        m[12] = am[12];
        m[13] = am[13];
        m[14] = am[14];
        m[15] = am[15];
        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入新旋转变换
     * !#en Add a new rotational transform matrix transformation on the basis of a given
     * @method rotate
     * @typescript
     * rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike): Out
     * @param rad 旋转角度
     * @param axis 旋转轴
     * @static
     */
    static rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike) {
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

        let am = a.m;
        _a00 = am[0]; _a01 = am[1]; _a02 = am[2]; _a03 = am[3];
        _a10 = am[4]; _a11 = am[5]; _a12 = am[6]; _a13 = am[7];
        _a20 = am[8]; _a21 = am[9]; _a22 = am[10]; _a23 = am[11];

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

        let m = out.m;
        // Perform rotation-specific matrix multiplication
        m[0] = _a00 * b00 + _a10 * b01 + _a20 * b02;
        m[1] = _a01 * b00 + _a11 * b01 + _a21 * b02;
        m[2] = _a02 * b00 + _a12 * b01 + _a22 * b02;
        m[3] = _a03 * b00 + _a13 * b01 + _a23 * b02;
        m[4] = _a00 * b10 + _a10 * b11 + _a20 * b12;
        m[5] = _a01 * b10 + _a11 * b11 + _a21 * b12;
        m[6] = _a02 * b10 + _a12 * b11 + _a22 * b12;
        m[7] = _a03 * b10 + _a13 * b11 + _a23 * b12;
        m[8] = _a00 * b20 + _a10 * b21 + _a20 * b22;
        m[9] = _a01 * b20 + _a11 * b21 + _a21 * b22;
        m[10] = _a02 * b20 + _a12 * b21 + _a22 * b22;
        m[11] = _a03 * b20 + _a13 * b21 + _a23 * b22;

        // If the source and destination differ, copy the unchanged last row
        if (a !== out) {
            m[12] = am[12];
            m[13] = am[13];
            m[14] = am[14];
            m[15] = am[15];
        }

        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
     * !#en Add rotational transformation around the X axis at a given matrix transformation on the basis of
     * @method rotateX
     * @typescript
     * rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转角度
     * @static
     */
    static rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        let m = out.m, am = a.m;
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = am[4],
            a11 = am[5],
            a12 = am[6],
            a13 = am[7],
            a20 = am[8],
            a21 = am[9],
            a22 = am[10],
            a23 = am[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            m[0] = am[0];
            m[1] = am[1];
            m[2] = am[2];
            m[3] = am[3];
            m[12] = am[12];
            m[13] = am[13];
            m[14] = am[14];
            m[15] = am[15];
        }

        // Perform axis-specific matrix multiplication
        m[4] = a10 * c + a20 * s;
        m[5] = a11 * c + a21 * s;
        m[6] = a12 * c + a22 * s;
        m[7] = a13 * c + a23 * s;
        m[8] = a20 * c - a10 * s;
        m[9] = a21 * c - a11 * s;
        m[10] = a22 * c - a12 * s;
        m[11] = a23 * c - a13 * s;

        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
     * !#en Add about the Y axis rotation transformation in a given matrix transformation on the basis of
     * @method rotateY
     * @typescript
     * rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转角度
     * @static
     */
    static rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        let m = out.m, am = a.m;
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = am[0],
            a01 = am[1],
            a02 = am[2],
            a03 = am[3],
            a20 = am[8],
            a21 = am[9],
            a22 = am[10],
            a23 = am[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            m[4] = am[4];
            m[5] = am[5];
            m[6] = am[6];
            m[7] = am[7];
            m[12] = am[12];
            m[13] = am[13];
            m[14] = am[14];
            m[15] = am[15];
        }

        // Perform axis-specific matrix multiplication
        m[0] = a00 * c - a20 * s;
        m[1] = a01 * c - a21 * s;
        m[2] = a02 * c - a22 * s;
        m[3] = a03 * c - a23 * s;
        m[8] = a00 * s + a20 * c;
        m[9] = a01 * s + a21 * c;
        m[10] = a02 * s + a22 * c;
        m[11] = a03 * s + a23 * c;

        return out;
    }

    /**
     * !#zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
     * !#en Added about the Z axis at a given rotational transformation matrix transformation on the basis of
     * @method rotateZ
     * @typescript
     * rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number): Out
     * @param rad 旋转角度
     * @static
     */
    static rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number) {
        const am = a.m;
        let m = out.m;
        const s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a.m[0],
            a01 = a.m[1],
            a02 = a.m[2],
            a03 = a.m[3],
            a10 = a.m[4],
            a11 = a.m[5],
            a12 = a.m[6],
            a13 = a.m[7];

        // If the source and destination differ, copy the unchanged last row
        if (a !== out) {
            m[8] = am[8];
            m[9] = am[9];
            m[10] = am[10];
            m[11] = am[11];
            m[12] = am[12];
            m[13] = am[13];
            m[14] = am[14];
            m[15] = am[15];
        }

        // Perform axis-specific matrix multiplication
        m[0] = a00 * c + a10 * s;
        m[1] = a01 * c + a11 * s;
        m[2] = a02 * c + a12 * s;
        m[3] = a03 * c + a13 * s;
        m[4] = a10 * c - a00 * s;
        m[5] = a11 * c - a01 * s;
        m[6] = a12 * c - a02 * s;
        m[7] = a13 * c - a03 * s;

        return out;
    }

    /**
     * !#zh 计算位移矩阵
     * !#en Displacement matrix calculation
     * @method fromTranslation
     * @typescript
     * fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike): Out
     * @static
     */
    static fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike) {
        let m = out.m;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = v.x;
        m[13] = v.y;
        m[14] = v.z;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 计算缩放矩阵
     * !#en Scaling matrix calculation
     * @method fromScaling
     * @typescript
     * fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike): Out
     * @static
     */
    static fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike) {
        let m = out.m;
        m[0] = v.x;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = v.y;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = v.z;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 计算旋转矩阵
     * !#en Calculates the rotation matrix
     * @method fromRotation
     * @typescript
     * fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike): Out
     * @static
     */
    static fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike) {
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
        let m = out.m;
        m[0] = x * x * t + c;
        m[1] = y * x * t + z * s;
        m[2] = z * x * t - y * s;
        m[3] = 0;
        m[4] = x * y * t - z * s;
        m[5] = y * y * t + c;
        m[6] = z * y * t + x * s;
        m[7] = 0;
        m[8] = x * z * t + y * s;
        m[9] = y * z * t - x * s;
        m[10] = z * z * t + c;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 计算绕 X 轴的旋转矩阵
     * !#en Calculating rotation matrix about the X axis
     * @method fromXRotation
     * @typescript
     * fromXRotation<Out extends IMat4Like> (out: Out, rad: number): Out
     * @static
     */
    static fromXRotation<Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        let m = out.m;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = c;
        m[6] = s;
        m[7] = 0;
        m[8] = 0;
        m[9] = -s;
        m[10] = c;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 计算绕 Y 轴的旋转矩阵
     * !#en Calculating rotation matrix about the Y axis
     * @method fromYRotation
     * @typescript
     * fromYRotation<Out extends IMat4Like> (out: Out, rad: number): Out
     * @static
     */
    static fromYRotation<Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        let m = out.m;
        m[0] = c;
        m[1] = 0;
        m[2] = -s;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = s;
        m[9] = 0;
        m[10] = c;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 计算绕 Z 轴的旋转矩阵
     * !#en Calculating rotation matrix about the Z axis
     * @method fromZRotation
     * @typescript
     * fromZRotation<Out extends IMat4Like> (out: Out, rad: number): Out
     * @static
     */
    static fromZRotation<Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        // Perform axis-specific matrix multiplication
        let m = out.m;
        m[0] = c;
        m[1] = s;
        m[2] = 0;
        m[3] = 0;
        m[4] = -s;
        m[5] = c;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 根据旋转和位移信息计算矩阵
     * !#en The rotation and displacement information calculating matrix
     * @method fromRT
     * @typescript
     * fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike): Out
     * @static
     */
    static fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike) {
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

        let m = out.m;
        m[0] = 1 - (yy + zz);
        m[1] = xy + wz;
        m[2] = xz - wy;
        m[3] = 0;
        m[4] = xy - wz;
        m[5] = 1 - (xx + zz);
        m[6] = yz + wx;
        m[7] = 0;
        m[8] = xz + wy;
        m[9] = yz - wx;
        m[10] = 1 - (xx + yy);
        m[11] = 0;
        m[12] = v.x;
        m[13] = v.y;
        m[14] = v.z;
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     * !#en Extracting displacement information of the matrix, the matrix transform to the default sequential application S-> R-> T is
     * @method getTranslation
     * @typescript
     * getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out): VecLike
     * @static
     */
    static getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out) {
        let m = mat.m;
        out.x = m[12];
        out.y = m[13];
        out.z = m[14];

        return out;
    }

    /**
     * !#zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     * !#en Scaling information extraction matrix, the matrix transform to the default sequential application S-> R-> T is
     * @method getScaling
     * @typescript
     * getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out): VecLike
     * @static
     */
    static getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out) {
        let m = mat.m;
        let m3 = m3_1.m;
        const m00 = m3[0] = m[0];
        const m01 = m3[1] = m[1];
        const m02 = m3[2] = m[2];
        const m04 = m3[3] = m[4];
        const m05 = m3[4] = m[5];
        const m06 = m3[5] = m[6];
        const m08 = m3[6] = m[8];
        const m09 = m3[7] = m[9];
        const m10 = m3[8] = m[10];
        out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
        // account for refections
        if (Mat3.determinant(m3_1) < 0) { out.x *= -1; }
        return out;
    }

    /**
     * !#zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
     * !#en Rotation information extraction matrix, the matrix containing no default input scaling information, such as the use of `toRTS` should consider the scaling function.
     * @method getRotation
     * @typescript
     * getRotation<Out extends IMat4Like> (out: Quat, mat: Out): Quat
     * @static
     */
    static getRotation<Out extends IMat4Like> (out: Quat, mat: Out) {
        let m = mat.m;
        const trace = m[0] + m[5] + m[10];
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out.w = 0.25 * S;
            out.x = (m[6] - m[9]) / S;
            out.y = (m[8] - m[2]) / S;
            out.z = (m[1] - m[4]) / S;
        } else if ((m[0] > m[5]) && (m[0] > m[10])) {
            S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
            out.w = (m[6] - m[9]) / S;
            out.x = 0.25 * S;
            out.y = (m[1] + m[4]) / S;
            out.z = (m[8] + m[2]) / S;
        } else if (m[5] > m[10]) {
            S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
            out.w = (m[8] - m[2]) / S;
            out.x = (m[1] + m[4]) / S;
            out.y = 0.25 * S;
            out.z = (m[6] + m[9]) / S;
        } else {
            S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
            out.w = (m[1] - m[4]) / S;
            out.x = (m[8] + m[2]) / S;
            out.y = (m[6] + m[9]) / S;
            out.z = 0.25 * S;
        }

        return out;
    }

    /**
     * !#zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
     * !#en Extracting rotational displacement, zoom information, the default matrix transformation in order S-> R-> T applications
     * @method toRTS
     * @typescript
     * toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike): void
     * @static
     */
    static toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike) {
        let m = mat.m;
        let m3 = m3_1.m;
        s.x = Vec3.set(v3_1, m[0], m[1], m[2]).mag();
        m3[0] = m[0] / s.x;
        m3[1] = m[1] / s.x;
        m3[2] = m[2] / s.x;
        s.y = Vec3.set(v3_1, m[4], m[5], m[6]).mag();
        m3[3] = m[4] / s.y;
        m3[4] = m[5] / s.y;
        m3[5] = m[6] / s.y;
        s.z = Vec3.set(v3_1, m[8], m[9], m[10]).mag();
        m3[6] = m[8] / s.z;
        m3[7] = m[9] / s.z;
        m3[8] = m[10] / s.z;
        const det = Mat3.determinant(m3_1);
        if (det < 0) { s.x *= -1; m3[0] *= -1; m3[1] *= -1; m3[2] *= -1; }
        Quat.fromMat3(q, m3_1); // already normalized
        Vec3.set(v, m[12], m[13], m[14]);
    }

    /**
     * !#zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     * !#en The rotary displacement, the scaling matrix calculation information, the order S-> R-> T applications
     * @method fromRTS
     * @typescript
     * fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike): Out
     * @static
     */
    static fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike) {
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

        let m = out.m;
        m[0] = (1 - (yy + zz)) * sx;
        m[1] = (xy + wz) * sx;
        m[2] = (xz - wy) * sx;
        m[3] = 0;
        m[4] = (xy - wz) * sy;
        m[5] = (1 - (xx + zz)) * sy;
        m[6] = (yz + wx) * sy;
        m[7] = 0;
        m[8] = (xz + wy) * sz;
        m[9] = (yz - wx) * sz;
        m[10] = (1 - (xx + yy)) * sz;
        m[11] = 0;
        m[12] = v.x;
        m[13] = v.y;
        m[14] = v.z;
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
     * !#en According to the specified rotation, displacement, and scale conversion matrix calculation information center, order S-> R-> T applications
     * @method fromRTSOrigin
     * @typescript
     * fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike): Out
     * @param q 旋转值
     * @param v 位移值
     * @param s 缩放值
     * @param o 指定变换中心
     * @static
     */
    static fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike) {
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

        let m = out.m;
        m[0] = (1 - (yy + zz)) * sx;
        m[1] = (xy + wz) * sx;
        m[2] = (xz - wy) * sx;
        m[3] = 0;
        m[4] = (xy - wz) * sy;
        m[5] = (1 - (xx + zz)) * sy;
        m[6] = (yz + wx) * sy;
        m[7] = 0;
        m[8] = (xz + wy) * sz;
        m[9] = (yz - wx) * sz;
        m[10] = (1 - (xx + yy)) * sz;
        m[11] = 0;
        m[12] = v.x + ox - (m[0] * ox + m[4] * oy + m[8] * oz);
        m[13] = v.y + oy - (m[1] * ox + m[5] * oy + m[9] * oz);
        m[14] = v.z + oz - (m[2] * ox + m[6] * oy + m[10] * oz);
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 根据指定的旋转信息计算矩阵
     * !#en The rotation matrix calculation information specified
     * @method fromQuat
     * @typescript
     * fromQuat<Out extends IMat4Like> (out: Out, q: Quat): Out
     * @static
     */
    static fromQuat<Out extends IMat4Like> (out: Out, q: Quat) {
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

        let m = out.m;
        m[0] = 1 - yy - zz;
        m[1] = yx + wz;
        m[2] = zx - wy;
        m[3] = 0;

        m[4] = yx - wz;
        m[5] = 1 - xx - zz;
        m[6] = zy + wx;
        m[7] = 0;

        m[8] = zx + wy;
        m[9] = zy - wx;
        m[10] = 1 - xx - yy;
        m[11] = 0;

        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 根据指定的视锥体信息计算矩阵
     * !#en The matrix calculation information specified frustum
     * @method frustum
     * @typescript
     * frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number): Out
     * @param left 左平面距离
     * @param right 右平面距离
     * @param bottom 下平面距离
     * @param top 上平面距离
     * @param near 近平面距离
     * @param far 远平面距离
     * @static
     */
    static frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const rl = 1 / (right - left);
        const tb = 1 / (top - bottom);
        const nf = 1 / (near - far);

        let m = out.m;
        m[0] = (near * 2) * rl;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = (near * 2) * tb;
        m[6] = 0;
        m[7] = 0;
        m[8] = (right + left) * rl;
        m[9] = (top + bottom) * tb;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (far * near * 2) * nf;
        m[15] = 0;
        return out;
    }

    /**
     * !#zh 计算透视投影矩阵
     * !#en Perspective projection matrix calculation
     * @method perspective
     * @typescript
     * perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number): Out
     * @param fovy 纵向视角高度
     * @param aspect 长宽比
     * @param near 近平面距离
     * @param far 远平面距离
     * @static
     */
    static perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number) {
        const f = 1.0 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);

        let m = out.m;
        m[0] = f / aspect;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = f;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = (far + near) * nf;
        m[11] = -1;
        m[12] = 0;
        m[13] = 0;
        m[14] = (2 * far * near) * nf;
        m[15] = 0;
        return out;
    }

    /**
     * !#zh 计算正交投影矩阵
     * !#en Computing orthogonal projection matrix
     * @method ortho
     * @typescript
     * ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number): Out
     * @param left 左平面距离
     * @param right 右平面距离
     * @param bottom 下平面距离
     * @param top 上平面距离
     * @param near 近平面距离
     * @param far 远平面距离
     * @static
     */
    static ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);
        let m = out.m;
        m[0] = -2 * lr;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = -2 * bt;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 2 * nf;
        m[11] = 0;
        m[12] = (left + right) * lr;
        m[13] = (top + bottom) * bt;
        m[14] = (far + near) * nf;
        m[15] = 1;
        return out;
    }

    /**
     * !#zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
     * !#en `Up` parallel vector or vector center` not be zero - the matrix calculation according to the viewpoint, note` eye
     * @method lookAt
     * @typescript
     * lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike): Out
     * @param eye 当前位置
     * @param center 目标视点
     * @param up 视口上方向
     * @static
     */
    static lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike) {
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

        let m = out.m;
        m[0] = x0;
        m[1] = y0;
        m[2] = z0;
        m[3] = 0;
        m[4] = x1;
        m[5] = y1;
        m[6] = z1;
        m[7] = 0;
        m[8] = x2;
        m[9] = y2;
        m[10] = z2;
        m[11] = 0;
        m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 计算逆转置矩阵
     * !#en Reversal matrix calculation
     * @method inverseTranspose
     * @typescript
     * inverseTranspose<Out extends IMat4Like> (out: Out, a: Out): Out
     * @static
     */
    static inverseTranspose<Out extends IMat4Like> (out: Out, a: Out) {

        let m = a.m;
        _a00 = m[0]; _a01 = m[1]; _a02 = m[2]; _a03 = m[3];
        _a10 = m[4]; _a11 = m[5]; _a12 = m[6]; _a13 = m[7];
        _a20 = m[8]; _a21 = m[9]; _a22 = m[10]; _a23 = m[11];
        _a30 = m[12]; _a31 = m[13]; _a32 = m[14]; _a33 = m[15];

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

        m = out.m;
        m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        m[1] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        m[2] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        m[3] = 0;

        m[4] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        m[6] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        m[7] = 0;

        m[8] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        m[9] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        m[11] = 0;

        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;

        return out;
    }

    /**
     * !#zh 逐元素矩阵加法
     * !#en Element by element matrix addition
     * @method add
     * @typescript
     * add<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
     * @static
     */
    static add<Out extends IMat4Like> (out: Out, a: Out, b: Out) {
        let m = out.m, am = a.m, bm = b.m;
        m[0] = am[0] + bm[0];
        m[1] = am[1] + bm[1];
        m[2] = am[2] + bm[2];
        m[3] = am[3] + bm[3];
        m[4] = am[4] + bm[4];
        m[5] = am[5] + bm[5];
        m[6] = am[6] + bm[6];
        m[7] = am[7] + bm[7];
        m[8] = am[8] + bm[8];
        m[9] = am[9] + bm[9];
        m[10] = am[10] + bm[10];
        m[11] = am[11] + bm[11];
        m[12] = am[12] + bm[12];
        m[13] = am[13] + bm[13];
        m[14] = am[14] + bm[14];
        m[15] = am[15] + bm[15];
        return out;
    }

    /**
     * !#zh 逐元素矩阵减法
     * !#en Matrix element by element subtraction
     * @method subtract
     * @typescript
     * subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out): Out
     * @static
     */
    static subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out) {
        let m = out.m, am = a.m, bm = b.m;
        m[0] = am[0] - bm[0];
        m[1] = am[1] - bm[1];
        m[2] = am[2] - bm[2];
        m[3] = am[3] - bm[3];
        m[4] = am[4] - bm[4];
        m[5] = am[5] - bm[5];
        m[6] = am[6] - bm[6];
        m[7] = am[7] - bm[7];
        m[8] = am[8] - bm[8];
        m[9] = am[9] - bm[9];
        m[10] = am[10] - bm[10];
        m[11] = am[11] - bm[11];
        m[12] = am[12] - bm[12];
        m[13] = am[13] - bm[13];
        m[14] = am[14] - bm[14];
        m[15] = am[15] - bm[15];
        return out;
    }

    /**
     * !#zh 矩阵标量乘法
     * !#en Matrix scalar multiplication
     * @method multiplyScalar
     * @typescript
     * multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number): Out
     * @static
     */
    static multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number) {
        let m = out.m, am = a.m;
        m[0] = am[0] * b;
        m[1] = am[1] * b;
        m[2] = am[2] * b;
        m[3] = am[3] * b;
        m[4] = am[4] * b;
        m[5] = am[5] * b;
        m[6] = am[6] * b;
        m[7] = am[7] * b;
        m[8] = am[8] * b;
        m[9] = am[9] * b;
        m[10] = am[10] * b;
        m[11] = am[11] * b;
        m[12] = am[12] * b;
        m[13] = am[13] * b;
        m[14] = am[14] * b;
        m[15] = am[15] * b;
        return out;
    }

    /**
     * !#zh 逐元素矩阵标量乘加: A + B * scale
     * !#en Elements of the matrix by the scalar multiplication and addition: A + B * scale
     * @method multiplyScalarAndAdd
     * @typescript
     * multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number): Out
     * @static
     */
    static multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number) {
        let m = out.m, am = a.m, bm = b.m;
        m[0] = am[0] + (bm[0] * scale);
        m[1] = am[1] + (bm[1] * scale);
        m[2] = am[2] + (bm[2] * scale);
        m[3] = am[3] + (bm[3] * scale);
        m[4] = am[4] + (bm[4] * scale);
        m[5] = am[5] + (bm[5] * scale);
        m[6] = am[6] + (bm[6] * scale);
        m[7] = am[7] + (bm[7] * scale);
        m[8] = am[8] + (bm[8] * scale);
        m[9] = am[9] + (bm[9] * scale);
        m[10] = am[10] + (bm[10] * scale);
        m[11] = am[11] + (bm[11] * scale);
        m[12] = am[12] + (bm[12] * scale);
        m[13] = am[13] + (bm[13] * scale);
        m[14] = am[14] + (bm[14] * scale);
        m[15] = am[15] + (bm[15] * scale);
        return out;
    }

    /**
     * !#zh 矩阵等价判断
     * !#en Analyzing the equivalent matrix
     * @method strictEquals
     * @return {bool}
     * @typescript
     * strictEquals<Out extends IMat4Like> (a: Out, b: Out): boolean
     * @static
     */
    static strictEquals<Out extends IMat4Like> (a: Out, b: Out) {
        let am = a.m, bm = b.m;
        return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] &&
            am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] &&
            am[8] === bm[8] && am[9] === bm[9] && am[10] === bm[10] && am[11] === bm[11] &&
            am[12] === bm[12] && am[13] === bm[13] && am[14] === bm[14] && am[15] === bm[15];
    }

    /**
     * !#zh 排除浮点数误差的矩阵近似等价判断
     * !#en Negative floating point error is approximately equivalent to determining a matrix
     * @method equals
     * @typescript
     * equals<Out extends IMat4Like> (a: Out, b: Out, epsilon?: number): boolean
     * @static
     */
    static equals<Out extends IMat4Like> (a: Out, b: Out, epsilon = EPSILON) {

        let am = a.m, bm = b.m;
        return (
            Math.abs(am[0] - bm[0]) <= epsilon * Math.max(1.0, Math.abs(am[0]), Math.abs(bm[0])) &&
            Math.abs(am[1] - bm[1]) <= epsilon * Math.max(1.0, Math.abs(am[1]), Math.abs(bm[1])) &&
            Math.abs(am[2] - bm[2]) <= epsilon * Math.max(1.0, Math.abs(am[2]), Math.abs(bm[2])) &&
            Math.abs(am[3] - bm[3]) <= epsilon * Math.max(1.0, Math.abs(am[3]), Math.abs(bm[3])) &&
            Math.abs(am[4] - bm[4]) <= epsilon * Math.max(1.0, Math.abs(am[4]), Math.abs(bm[4])) &&
            Math.abs(am[5] - bm[5]) <= epsilon * Math.max(1.0, Math.abs(am[5]), Math.abs(bm[5])) &&
            Math.abs(am[6] - bm[6]) <= epsilon * Math.max(1.0, Math.abs(am[6]), Math.abs(bm[6])) &&
            Math.abs(am[7] - bm[7]) <= epsilon * Math.max(1.0, Math.abs(am[7]), Math.abs(bm[7])) &&
            Math.abs(am[8] - bm[8]) <= epsilon * Math.max(1.0, Math.abs(am[8]), Math.abs(bm[8])) &&
            Math.abs(am[9] - bm[9]) <= epsilon * Math.max(1.0, Math.abs(am[9]), Math.abs(bm[9])) &&
            Math.abs(am[10] - bm[10]) <= epsilon * Math.max(1.0, Math.abs(am[10]), Math.abs(bm[10])) &&
            Math.abs(am[11] - bm[11]) <= epsilon * Math.max(1.0, Math.abs(am[11]), Math.abs(bm[11])) &&
            Math.abs(am[12] - bm[12]) <= epsilon * Math.max(1.0, Math.abs(am[12]), Math.abs(bm[12])) &&
            Math.abs(am[13] - bm[13]) <= epsilon * Math.max(1.0, Math.abs(am[13]), Math.abs(bm[13])) &&
            Math.abs(am[14] - bm[14]) <= epsilon * Math.max(1.0, Math.abs(am[14]), Math.abs(bm[14])) &&
            Math.abs(am[15] - bm[15]) <= epsilon * Math.max(1.0, Math.abs(am[15]), Math.abs(bm[15]))
        );
    }

    /**
     * Calculates the adjugate of a matrix.
     *
     * @param {Mat4} out - Matrix to store result.
     * @param {Mat4} a - Matrix to calculate.
     * @returns {Mat4} out.
     */
    static adjoint (out, a) {
        let am = a.m, outm = out.m;
        let a00 = am[0], a01 = am[1], a02 = am[2], a03 = am[3],
            a10 = am[4], a11 = am[5], a12 = am[6], a13 = am[7],
            a20 = am[8], a21 = am[9], a22 = am[10], a23 = am[11],
            a30 = am[12], a31 = am[13], a32 = am[14], a33 = am[15];

        outm[0] = (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
        outm[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        outm[2] = (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
        outm[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        outm[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        outm[5] = (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
        outm[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        outm[7] = (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
        outm[8] = (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
        outm[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        outm[10] = (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
        outm[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        outm[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        outm[13] = (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
        outm[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        outm[15] = (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
        return out;
    }

    /**
     * !#zh 矩阵转数组
     * !#en Matrix transpose array
     * @method toArray
     * @typescript
     * toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs?: number): Out
     * @param ofs 数组内的起始偏移量
     * @static
     */
    static toArray<Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs = 0) {
        let m = mat.m;
        for (let i = 0; i < 16; i++) {
            out[ofs + i] = m[i];
        }
        return out;
    }

    /**
     * !#zh 数组转矩阵
     * !#en Transfer matrix array
     * @method fromArray
     * @typescript
     * fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs?: number): Out
     * @param ofs 数组起始偏移量
     * @static
     */
    static fromArray<Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        let m = out.m;
        for (let i = 0; i < 16; i++) {
            m[i] = arr[ofs + i];
        }
        return out;
    }

    /**
     * !#en Matrix Data
     * !#zh 矩阵数据
     * @property {Float64Array | Float32Array} m
     */
    m: FloatArray;


    /**
     * !#en
     * Constructor
     * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     * !#zh
     * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
     * @method constructor
     * @typescript
     * constructor ( m00?: number, m01?: number, m02?: number, m03?: number, m10?: number, m11?: number, m12?: number, m13?: number, m20?: number, m21?: number, m22?: number, m23?: number, m30?: number, m31?: number, m32?: number, m33?: number)
     */
    constructor (
        m00: number | FloatArray = 1, m01: number = 0, m02: number = 0, m03: number = 0,
        m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0,
        m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0,
        m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1) {
        super();
        if (m00 instanceof FLOAT_ARRAY_TYPE) {
            this.m = m00;
        } else {
            this.m = new FLOAT_ARRAY_TYPE(16);
            let tm = this.m;
            tm[0] = m00 as number;
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
    }

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
    }

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
    }

    /**
     * !#en Check whether two matrix equal
     * !#zh 当前的矩阵是否与指定的矩阵相等。
     * @method equals
     * @param {Mat4} other
     * @return {Boolean}
     */
    equals (other) {
        return Mat4.strictEquals(this, other);
    }

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
        return Mat4.equals(this, other);
    }

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
                "1, 0, 0, 0\n" +
                "0, 1, 0, 0\n" +
                "0, 0, 1, 0\n" +
                "0, 0, 0, 1\n" +
                "]";
        }
    }

    /**
     * Set the matrix to the identity matrix
     * @method identity
     * @returns {Mat4} self
     * @chainable
     */
    identity (): this {
        return Mat4.identity(this);
    }

    /**
     * Transpose the values of a mat4
     * @method transpose
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    transpose (out) {
        out = out || new Mat4();
        return Mat4.transpose(out, this);
    }

    /**
     * Inverts a mat4
     * @method invert
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    invert (out) {
        out = out || new Mat4();
        return Mat4.invert(out, this);
    }

    /**
     * Calculates the adjugate of a mat4
     * @method adjoint
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    adjoint (out) {
        out = out || new Mat4();
        return Mat4.adjoint(out, this);
    }

    /**
     * Calculates the determinant of a mat4
     * @method determinant
     * @returns {Number} determinant of a
     */
    determinant () {
        return Mat4.determinant(this);
    }

    /**
     * Adds two Mat4
     * @method add
     * @param {Mat4} other the second operand
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
     * @returns {Mat4} out
     */
    add (other, out) {
        out = out || new Mat4();
        return Mat4.add(out, this, other);
    }

    /**
     * Subtracts the current matrix with another one
     * @method subtract
     * @param {Mat4} other the second operand
     * @returns {Mat4} this
     */
    subtract (other): this {
        return Mat4.subtract(this, this, other);
    }

    /**
     * Subtracts the current matrix with another one
     * @method multiply
     * @param {Mat4} other the second operand
     * @returns {Mat4} this
     */
    multiply (other): this {
        return Mat4.multiply(this, this, other);
    }

    /**
     * Multiply each element of the matrix by a scalar.
     * @method multiplyScalar
     * @param {Number} number amount to scale the matrix's elements by
     * @returns {Mat4} this
     */
    multiplyScalar (number): this {
        return Mat4.multiplyScalar(this, this, number);
    }

    /**
     * Translate a mat4 by the given vector
     * @method translate
     * @param {Vec3} v vector to translate by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    translate (v, out) {
        out = out || new Mat4();
        return Mat4.translate(out, this, v);
    }

    /**
     * Scales the mat4 by the dimensions in the given vec3
     * @method scale
     * @param {Vec3} v vector to scale by
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    scale (v, out) {
        out = out || new Mat4();
        return Mat4.scale(out, this, v);
    }

    /**
     * Rotates a mat4 by the given angle around the given axis
     * @method rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vec3} axis the axis to rotate around
     * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
     * @returns {Mat4} out
     */
    rotate (rad, axis, out) {
        out = out || new Mat4();
        return Mat4.rotate(out, this, rad, axis);
    }

    /**
     * Returns the translation vector component of a transformation matrix.
     * @method getTranslation
     * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
     * @return {Vec3} out
     */
    getTranslation (out) {
        out = out || new Vec3();
        return Mat4.getTranslation(out, this);
    }

    /**
     * Returns the scale factor component of a transformation matrix
     * @method getScale
     * @param  {Vec3} out Vector to receive scale component, if not provided, a new vec3 will be created
     * @return {Vec3} out
     */
    getScale (out) {
        out = out || new Vec3();
        return Mat4.getScaling(out, this);
    }

    /**
     * Returns the rotation factor component of a transformation matrix
     * @method getRotation
     * @param  {Quat} out Vector to receive rotation component, if not provided, a new quaternion object will be created
     * @return {Quat} out
     */
    getRotation (out) {
        out = out || new Quat();
        return Mat4.getRotation(out, this);
    }

    /**
     * Restore the matrix values from a quaternion rotation, vector translation and vector scale
     * @method fromRTS
     * @param {Quat} q Rotation quaternion
     * @param {Vec3} v Translation vector
     * @param {Vec3} s Scaling vector
     * @returns {Mat4} the current mat4 object
     * @chainable
     */
    fromRTS (q, v, s): this {
        return Mat4.fromRTS(this, q, v, s);
    }

    /**
     * Restore the matrix values from a quaternion rotation
     * @method fromQuat
     * @param {Quat} q Rotation quaternion
     * @returns {Mat4} the current mat4 object
     * @chainable
     */
    fromQuat (quat): this {
        return Mat4.fromQuat(this, quat);
    }
}

const v3_1: Vec3 = new Vec3();
const m3_1: Mat3 = new Mat3();

CCClass.fastDefine('cc.Mat4', Mat4, {
    m00: 1, m01: 0, m02: 0, m03: 0,
    m04: 0, m05: 1, m06: 0, m07: 0,
    m08: 0, m09: 0, m10: 1, m11: 0,
    m12: 0, m13: 0, m14: 0, m15: 1
});

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
        Mat4.identity(mat);
    }
    return mat;
};

cc.Mat4 = Mat4;
