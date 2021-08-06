/*
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module core/math
 */

import { CCClass } from '../data/class';
import { Mat3 } from './mat3';
import { Quat } from './quat';
import { IMat4Like, IVec3Like, FloatArray, IMat4, IVec3 } from './type-define';
import { enumerableProps, EPSILON } from './utils';
import { Vec3 } from './vec3';
import { legacyCC } from '../global-exports';
import { MathBase } from './math-base';

export const preTransforms = Object.freeze([
    Object.freeze([1,  0,  0,  1]), // SurfaceTransform.IDENTITY
    Object.freeze([0,  1, -1,  0]), // SurfaceTransform.ROTATE_90
    Object.freeze([-1,  0,  0, -1]), // SurfaceTransform.ROTATE_180
    Object.freeze([0, -1,  1,  0]), // SurfaceTransform.ROTATE_270
]);

/**
 * @en Mathematical 4x4 matrix.
 * @zh 表示四维（4x4）矩阵。
 */

export class Mat4 extends MathBase {
    public static IDENTITY = Object.freeze(new Mat4());

    /**
     * @en Clone a matrix and save the results to out matrix
     * @zh 获得指定矩阵的拷贝
     */
    public static clone <Out extends IMat4Like> (a: IMat4) {
        return new Mat4(
            a.m00, a.m01, a.m02, a.m03,
            a.m04, a.m05, a.m06, a.m07,
            a.m08, a.m09, a.m10, a.m11,
            a.m12, a.m13, a.m14, a.m15,
        );
    }

    /**
     * @en Copy a matrix into the out matrix
     * @zh 复制目标矩阵
     */
    public static copy <Out extends IMat4Like> (out: Out, a: IMat4) {
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
     * @en Sets a matrix with the given values and save the results to out matrix
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
     * @en return an identity matrix.
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
     * @en Transposes a matrix and save the results to out matrix
     * @zh 转置矩阵
     */
    public static transpose <Out extends IMat4Like> (out: Out, a: IMat4) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            const a01 = a.m01; const a02 = a.m02; const a03 = a.m03; const a12 = a.m06; const a13 = a.m07; const a23 = a.m11;
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
     * @en Inverts a matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 矩阵求逆，注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    public static invert <Out extends IMat4Like> (out: Out, a: IMat4) {
        const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
        const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
        const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;
        const a30 = a.m12; const a31 = a.m13; const a32 = a.m14; const a33 = a.m15;

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

        if (det === 0) {
            out.m00 = 0; out.m01 = 0; out.m02 = 0; out.m03 = 0;
            out.m04 = 0; out.m05 = 0; out.m06 = 0; out.m07 = 0;
            out.m08 = 0; out.m09 = 0; out.m10 = 0; out.m11 = 0;
            out.m12 = 0; out.m13 = 0; out.m14 = 0; out.m15 = 0;
            return out;
        }
        det = 1.0 / det;

        out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    }

    /**
     * @en Calculates the determinant of a matrix
     * @zh 矩阵行列式
     */
    public static determinant <Out extends IMat4Like> (a: IMat4): number {
        const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
        const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
        const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;
        const a30 = a.m12; const a31 = a.m13; const a32 = a.m14; const a33 = a.m15;

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
     * @en Multiply two matrices and save the results to out matrix
     * @zh 矩阵乘法
     */
    public static multiply <Out extends IMat4Like> (out: Out, a: IMat4, b: IMat4) {
        const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
        const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
        const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;
        const a30 = a.m12; const a31 = a.m13; const a32 = a.m14; const a33 = a.m15;

        // Cache only the current line of the second matrix
        let b0 = b.m00; let b1 = b.m01; let b2 = b.m02; let b3 = b.m03;
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
        return out;
    }

    /**
     * @en Transform a matrix with the given vector and save results to the out matrix
     * @zh 在给定矩阵变换基础上加入变换
     */
    public static transform <Out extends IMat4Like> (out: Out, a: IMat4, v: IVec3) {
        const x = v.x; const y = v.y; const z = v.z;
        if (a === out) {
            out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
            out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
            out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
            out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
        } else {
            const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
            const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
            const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;
            const a30 = a.m12; const a31 = a.m13; const a32 = a.m14; const a33 = a.m15;

            out.m00 = a00; out.m01 = a01; out.m02 = a02; out.m03 = a03;
            out.m04 = a10; out.m05 = a11; out.m06 = a12; out.m07 = a13;
            out.m08 = a20; out.m09 = a21; out.m10 = a22; out.m11 = a23;

            out.m12 = a00 * x + a10 * y + a20 * z + a.m12;
            out.m13 = a01 * x + a11 * y + a21 * z + a.m13;
            out.m14 = a02 * x + a12 * y + a22 * z + a.m14;
            out.m15 = a03 * x + a13 * y + a23 * z + a.m15;
        }
        return out;
    }

    /**
     * @en Transform a matrix with the given translation vector and save results to the out matrix
     * @zh 在给定矩阵变换基础上加入新位移变换
     */
    public static translate <Out extends IMat4Like> (out: Out, a: IMat4, v: IVec3) {
        console.warn('function changed');
        if (a === out) {
            out.m12 += v.x;
            out.m13 += v.y;
            out.m14 += v.z;
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
     * @en Multiply a matrix with a scale matrix given by a scale vector and save the results into the out matrix
     * @zh 在给定矩阵变换基础上加入新缩放变换
     */
    public static scale <Out extends IMat4Like> (out: Out, a: IMat4, v: IVec3) {
        const x = v.x; const y = v.y; const z = v.z;
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
     * @en Rotates the transform by the given angle and save the results into the out matrix
     * @zh 在给定矩阵变换基础上加入新旋转变换
     * @param rad Angle of rotation (in radians)
     * @param axis axis of rotation
     */
    public static rotate <Out extends IMat4Like> (out: Out, a: IMat4, rad: number, axis: IVec3) {
        let x = axis.x; let y = axis.y; let z = axis.z;

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

        const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
        const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
        const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c; const b01 = y * x * t + z * s; const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s; const b11 = y * y * t + c; const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s; const b21 = y * z * t - x * s; const b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        out.m00 = a00 * b00 + a10 * b01 + a20 * b02;
        out.m01 = a01 * b00 + a11 * b01 + a21 * b02;
        out.m02 = a02 * b00 + a12 * b01 + a22 * b02;
        out.m03 = a03 * b00 + a13 * b01 + a23 * b02;
        out.m04 = a00 * b10 + a10 * b11 + a20 * b12;
        out.m05 = a01 * b10 + a11 * b11 + a21 * b12;
        out.m06 = a02 * b10 + a12 * b11 + a22 * b12;
        out.m07 = a03 * b10 + a13 * b11 + a23 * b12;
        out.m08 = a00 * b20 + a10 * b21 + a20 * b22;
        out.m09 = a01 * b20 + a11 * b21 + a21 * b22;
        out.m10 = a02 * b20 + a12 * b21 + a22 * b22;
        out.m11 = a03 * b20 + a13 * b21 + a23 * b22;

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
     * @en Transform a matrix with a given angle around X axis and save the results to the out matrix
     * @zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
     * @param rad Angle of rotation (in radians)
     */
    public static rotateX <Out extends IMat4Like> (out: Out, a: IMat4, rad: number) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a10 = a.m04;
        const a11 = a.m05;
        const a12 = a.m06;
        const a13 = a.m07;
        const a20 = a.m08;
        const a21 = a.m09;
        const a22 = a.m10;
        const a23 = a.m11;

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
     * @en Transform a matrix with a given angle around Y axis and save the results to the out matrix
     * @zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
     * @param rad Angle of rotation (in radians)
     */
    public static rotateY <Out extends IMat4Like> (out: Out, a: IMat4, rad: number) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = a.m00;
        const a01 = a.m01;
        const a02 = a.m02;
        const a03 = a.m03;
        const a20 = a.m08;
        const a21 = a.m09;
        const a22 = a.m10;
        const a23 = a.m11;

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
     * @en Transform a matrix with a given angle around Z axis and save the results to the out matrix
     * @zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
     * @param rad Angle of rotation (in radians)
     */
    public static rotateZ <Out extends IMat4Like> (out: Out, a: IMat4, rad: number) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        const a00 = a.m00;
        const a01 = a.m01;
        const a02 = a.m02;
        const a03 = a.m03;
        const a10 = a.m04;
        const a11 = a.m05;
        const a12 = a.m06;
        const a13 = a.m07;

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
     * @en Sets the out matrix with a translation vector
     * @zh 计算位移矩阵
     */
    public static fromTranslation <Out extends IMat4Like> (out: Out, v: IVec3) {
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
     * @en Sets the out matrix with a scale vector
     * @zh 计算缩放矩阵
     */
    public static fromScaling <Out extends IMat4Like> (out: Out, v: IVec3) {
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
     * @en Sets the out matrix with rotation angle
     * @zh 计算旋转矩阵
     */
    public static fromRotation <Out extends IMat4Like> (out: Out, rad: number, axis: IVec3) {
        let x = axis.x; let y = axis.y; let z = axis.z;
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
     * @en Calculates the matrix representing a rotation around the X axis
     * @zh 计算绕 X 轴的旋转矩阵
     */
    public static fromXRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad); const c = Math.cos(rad);

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
     * @en Calculates the matrix representing a rotation around the Y axis
     * @zh 计算绕 Y 轴的旋转矩阵
     */
    public static fromYRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad); const c = Math.cos(rad);

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
     * @en Calculates the matrix representing a rotation around the Z axis
     * @zh 计算绕 Z 轴的旋转矩阵
     */
    public static fromZRotation <Out extends IMat4Like> (out: Out, rad: number) {
        const s = Math.sin(rad); const c = Math.cos(rad);

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
     * @en Calculates the transform representing the combination of a rotation and a translation
     * @zh 根据旋转和位移信息计算矩阵
     */
    public static fromRT <Out extends IMat4Like> (out: Out, q: Quat, v: IVec3) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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
     * @en Extracts the translation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static getTranslation <Out extends IMat4Like> (out: IVec3Like, mat: Out) {
        out.x = mat.m12;
        out.y = mat.m13;
        out.z = mat.m14;

        return out;
    }

    /**
     * @en Extracts the scale vector from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static getScaling <Out extends IMat4Like> (out: IVec3Like, mat: Out) {
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
     * @en Extracts the rotation from the matrix, assuming it's composed in order of scale, rotation, translation
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
     * @en Extracts the scale, rotation and translation from the matrix, assuming it's composed in order of scale, rotation, translation
     * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
     */
    public static toRTS <Out extends IMat4Like> (m: Out, q: Quat, v: IVec3, s: IVec3Like) {
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
     * @en Compose a matrix from scale, rotation and translation, applied in order.
     * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
     */
    public static fromRTS <Out extends IMat4Like> (out: Out, q: Readonly<Quat>, v: IVec3, s: IVec3) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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
     * @en Compose a matrix from scale, rotation and translation, applied in order, from a given origin
     * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @param o transformation Center
     */
    public static fromRTSOrigin <Out extends IMat4Like> (out: Out, q: Quat, v: IVec3, s: IVec3, o: IVec3) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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
     * @en Sets the out matrix with the given quaternion
     * @zh 根据指定的旋转信息计算矩阵
     */
    public static fromQuat <Out extends IMat4Like> (out: Out, q: Quat) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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
     * @en Calculates the matrix representing the given frustum
     * @zh 根据指定的视锥体信息计算矩阵
     * @param left The X coordinate of the left side of the near projection plane in view space.
     * @param right The X coordinate of the right side of the near projection plane in view space.
     * @param bottom The Y coordinate of the bottom side of the near projection plane in view space.
     * @param top The Y coordinate of the top side of the near projection plane in view space.
     * @param near Z distance to the near plane from the origin in view space.
     * @param far Z distance to the far plane from the origin in view space.
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
     * @en Calculates perspective projection matrix
     * @zh 计算透视投影矩阵
     * @param fovy Vertical field-of-view in degrees.
     * @param aspect Aspect ratio
     * @param near Near depth clipping plane value.
     * @param far Far depth clipping plane value.
     */
    public static perspective <Out extends IMat4Like> (
        out: Out, fov: number, aspect: number, near: number, far: number,
        isFOVY = true, minClipZ = -1, projectionSignY = 1, orientation = 0,
    ) {
        const f = 1.0 / Math.tan(fov / 2);
        const nf = 1 / (near - far);

        const x = isFOVY ? f / aspect : f;
        const y = (isFOVY ? f : f * aspect) * projectionSignY;
        const preTransform = preTransforms[orientation];

        out.m00 = x * preTransform[0];
        out.m01 = x * preTransform[1];
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = y * preTransform[2];
        out.m05 = y * preTransform[3];
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = (far - minClipZ * near) * nf;
        out.m11 = -1;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = far * near * nf * (1 - minClipZ);
        out.m15 = 0;
        return out;
    }

    /**
     * @en Calculates orthogonal projection matrix
     * @zh 计算正交投影矩阵
     * @param left Left-side x-coordinate.
     * @param right Right-side x-coordinate.
     * @param bottom Bottom y-coordinate.
     * @param top Top y-coordinate.
     * @param near Near depth clipping plane value.
     * @param far Far depth clipping plane value.
     */
    public static ortho <Out extends IMat4Like> (
        out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number,
        minClipZ = -1, projectionSignY = 1, orientation = 0,
    ) {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top) * projectionSignY;
        const nf = 1 / (near - far);

        const x = -2 * lr;
        const y = -2 * bt;
        const dx = (left + right) * lr;
        const dy = (top + bottom) * bt;
        const preTransform = preTransforms[orientation];

        out.m00 = x * preTransform[0];
        out.m01 = x * preTransform[1];
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = y * preTransform[2];
        out.m05 = y * preTransform[3];
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = nf * (1 - minClipZ);
        out.m11 = 0;
        out.m12 = dx * preTransform[0] + dy * preTransform[2];
        out.m13 = dx * preTransform[1] + dy * preTransform[3];
        out.m14 = (near - minClipZ * far) * nf;
        out.m15 = 1;
        return out;
    }

    /**
     * @en
     * Calculates the matrix with the view point information, given by eye position, target center and the up vector.
     * Note that center to eye vector can't be zero or parallel to the up vector
     * @zh
     * 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
     * @param eye The source point.
     * @param center The target point.
     * @param up The vector describing the up direction.
     */
    public static lookAt <Out extends IMat4Like> (out: Out, eye: IVec3, center: IVec3, up: IVec3) {
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
     * @en Calculates the inverse transpose of a matrix and save the results to out matrix
     * @zh 计算逆转置矩阵
     */
    public static inverseTranspose <Out extends IMat4Like> (out: Out, a: IMat4) {
        const a00 = a.m00; const a01 = a.m01; const a02 = a.m02; const a03 = a.m03;
        const a10 = a.m04; const a11 = a.m05; const a12 = a.m06; const a13 = a.m07;
        const a20 = a.m08; const a21 = a.m09; const a22 = a.m10; const a23 = a.m11;
        const a30 = a.m12; const a31 = a.m13; const a32 = a.m14; const a33 = a.m15;

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

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out.m01 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out.m03 = 0;

        out.m04 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m06 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out.m07 = 0;

        out.m08 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m09 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out.m11 = 0;

        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;

        return out;
    }

    /**
     * @en Transform a matrix object to a flat array
     * @zh 矩阵转数组
     * @param ofs Array Start Offset
     */
    public static toArray <Out extends IWritableArrayLike<number>> (out: Out, m: IMat4Like, ofs = 0) {
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
     * @en Generates or sets a matrix with a flat array
     * @zh 数组转矩阵
     * @param ofs Array Start Offset
     */
    public static fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.m00 = arr[ofs + 0];
        out.m01 = arr[ofs + 1];
        out.m02 = arr[ofs + 2];
        out.m03 = arr[ofs + 3];
        out.m04 = arr[ofs + 4];
        out.m05 = arr[ofs + 5];
        out.m06 = arr[ofs + 6];
        out.m07 = arr[ofs + 7];
        out.m08 = arr[ofs + 8];
        out.m09 = arr[ofs + 9];
        out.m10 = arr[ofs + 10];
        out.m11 = arr[ofs + 11];
        out.m12 = arr[ofs + 12];
        out.m13 = arr[ofs + 13];
        out.m14 = arr[ofs + 14];
        out.m15 = arr[ofs + 15];
        return out;
    }

    /**
     * @en Adds two matrices and save the results to out matrix
     * @zh 逐元素矩阵加法
     */
    public static add <Out extends IMat4Like> (out: Out, a: IMat4, b: IMat4) {
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
     * @en Subtracts matrix b from matrix a and save the results to out matrix
     * @zh 逐元素矩阵减法
     */
    public static subtract <Out extends IMat4Like> (out: Out, a: IMat4, b: IMat4) {
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
     * @en Multiply each element of a matrix by a scalar number and save the results to out matrix
     * @zh 矩阵标量乘法
     */
    public static multiplyScalar <Out extends IMat4Like> (out: Out, a: IMat4, b: number) {
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
     * @en Adds two matrices after multiplying each element of the second operand by a scalar number. And save the results to out matrix.
     * @zh 逐元素矩阵标量乘加: A + B * scale
     */
    public static multiplyScalarAndAdd <Out extends IMat4Like> (out: Out, a: IMat4, b: IMat4, scale: number) {
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
     * @en Returns whether the specified matrices are equal.
     * @zh 矩阵等价判断
     */
    public static strictEquals <Out extends IMat4Like> (a: IMat4, b: IMat4) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03
            && a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07
            && a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11
            && a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
    }

    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 排除浮点数误差的矩阵近似等价判断
     */
    public static equals <Out extends IMat4Like> (a: IMat4, b: IMat4, epsilon = EPSILON) {
        // TAOCP vol.2, 3rd ed., s.4.2.4, p.213-225
        // defines a 'close enough' relationship between u and v that scales for magnitude
        return (
            Math.abs(a.m00 - b.m00) <= epsilon * Math.max(1.0, Math.abs(a.m00), Math.abs(b.m00))
            && Math.abs(a.m01 - b.m01) <= epsilon * Math.max(1.0, Math.abs(a.m01), Math.abs(b.m01))
            && Math.abs(a.m02 - b.m02) <= epsilon * Math.max(1.0, Math.abs(a.m02), Math.abs(b.m02))
            && Math.abs(a.m03 - b.m03) <= epsilon * Math.max(1.0, Math.abs(a.m03), Math.abs(b.m03))
            && Math.abs(a.m04 - b.m04) <= epsilon * Math.max(1.0, Math.abs(a.m04), Math.abs(b.m04))
            && Math.abs(a.m05 - b.m05) <= epsilon * Math.max(1.0, Math.abs(a.m05), Math.abs(b.m05))
            && Math.abs(a.m06 - b.m06) <= epsilon * Math.max(1.0, Math.abs(a.m06), Math.abs(b.m06))
            && Math.abs(a.m07 - b.m07) <= epsilon * Math.max(1.0, Math.abs(a.m07), Math.abs(b.m07))
            && Math.abs(a.m08 - b.m08) <= epsilon * Math.max(1.0, Math.abs(a.m08), Math.abs(b.m08))
            && Math.abs(a.m09 - b.m09) <= epsilon * Math.max(1.0, Math.abs(a.m09), Math.abs(b.m09))
            && Math.abs(a.m10 - b.m10) <= epsilon * Math.max(1.0, Math.abs(a.m10), Math.abs(b.m10))
            && Math.abs(a.m11 - b.m11) <= epsilon * Math.max(1.0, Math.abs(a.m11), Math.abs(b.m11))
            && Math.abs(a.m12 - b.m12) <= epsilon * Math.max(1.0, Math.abs(a.m12), Math.abs(b.m12))
            && Math.abs(a.m13 - b.m13) <= epsilon * Math.max(1.0, Math.abs(a.m13), Math.abs(b.m13))
            && Math.abs(a.m14 - b.m14) <= epsilon * Math.max(1.0, Math.abs(a.m14), Math.abs(b.m14))
            && Math.abs(a.m15 - b.m15) <= epsilon * Math.max(1.0, Math.abs(a.m15), Math.abs(b.m15))
        );
    }

    /**
     * @en Value at column 0 row 0 of the matrix.
     * @zh 矩阵第 0 列第 0 行的元素。
     */
    public get m00 (): number {
        return this._array[0];
    }
    public set m00 (m: number) {
        this._array[0] = m;
    }

    /**
     * @en Value at column 0 row 1 of the matrix.
     * @zh 矩阵第 0 列第 1 行的元素。
     */
    public get m01 (): number {
        return this._array[1];
    }
    public set m01 (m: number) {
        this._array[1] = m;
    }

    /**
     * @en Value at column 0 row 2 of the matrix.
     * @zh 矩阵第 0 列第 2 行的元素。
     */
    public get m02 (): number {
        return this._array[2];
    }
    public set m02 (m: number) {
        this._array[2] = m;
    }

    /**
     * @en Value at column 0 row 3 of the matrix.
     * @zh 矩阵第 0 列第 3 行的元素。
     */
    public get m03 (): number {
        return this._array[3];
    }
    public set m03 (m: number) {
        this._array[3] = m;
    }

    /**
     * @en Value at column 1 row 0 of the matrix.
     * @zh 矩阵第 1 列第 0 行的元素。
     */
    public get m04 (): number {
        return this._array[4];
    }
    public set m04 (m: number) {
        this._array[4] = m;
    }

    /**
     * @en Value at column 1 row 1 of the matrix.
     * @zh 矩阵第 1 列第 1 行的元素。
     */
    public get m05 (): number {
        return this._array[5];
    }
    public set m05 (m: number) {
        this._array[5] = m;
    }

    /**
     * @en Value at column 1 row 2 of the matrix.
     * @zh 矩阵第 1 列第 2 行的元素。
     */
    public get m06 (): number {
        return this._array[6];
    }
    public set m06 (m: number) {
        this._array[6] = m;
    }

    /**
     * @en Value at column 1 row 3 of the matrix.
     * @zh 矩阵第 1 列第 3 行的元素。
     */
    public get m07 (): number {
        return this._array[7];
    }
    public set m07 (m: number) {
        this._array[7] = m;
    }

    /**
     * @en Value at column 2 row 0 of the matrix.
     * @zh 矩阵第 2 列第 0 行的元素。
     */
    public get m08 (): number {
        return this._array[8];
    }
    public set m08 (m: number) {
        this._array[8] = m;
    }

    /**
     * @en Value at column 2 row 1 of the matrix.
     * @zh 矩阵第 2 列第 1 行的元素。
     */
    public get m09 (): number {
        return this._array[9];
    }
    public set m09 (m: number) {
        this._array[9] = m;
    }

    /**
     * @en Value at column 2 row 2 of the matrix.
     * @zh 矩阵第 2 列第 2 行的元素。
     */
    public get m10 (): number {
        return this._array[10];
    }
    public set m10 (m: number) {
        this._array[10] = m;
    }

    /**
     * @en Value at column 2 row 3 of the matrix.
     * @zh 矩阵第 2 列第 3 行的元素。
     */
    public get m11 (): number {
        return this._array[11];
    }
    public set m11 (m: number) {
        this._array[11] = m;
    }

    /**
     * @en Value at column 3 row 0 of the matrix.
     * @zh 矩阵第 3 列第 0 行的元素。
     */
    public get m12 (): number {
        return this._array[12];
    }
    public set m12 (m: number) {
        this._array[12] = m;
    }

    /**
     * @en Value at column 3 row 1 of the matrix.
     * @zh 矩阵第 3 列第 1 行的元素。
     */
    public get m13 (): number {
        return this._array[13];
    }
    public set m13 (m: number) {
        this._array[13] = m;
    }

    /**
     * @en Value at column 3 row 2 of the matrix.
     * @zh 矩阵第 3 列第 2 行的元素。
     */
    public get m14 (): number {
        return this._array[14];
    }
    public set m14 (m: number) {
        this._array[14] = m;
    }

    /**
     * @en Value at column 3 row 3 of the matrix.
     * @zh 矩阵第 3 列第 3 行的元素。
     */
    public get m15 (): number {
        return this._array[15];
    }
    public set m15 (m: number) {
        this._array[15] = m;
    }

    constructor (m00: Mat4 | FloatArray);

    constructor (
        m00?: number, m01?: number, m02?: number, m03?: number,
        m04?: number, m05?: number, m06?: number, m07?: number,
        m08?: number, m09?: number, m10?: number, m11?: number,
        m12?: number, m13?: number, m14?: number, m15?: number);

    constructor (
        m00: Mat4 | number | FloatArray = 1, m01 = 0, m02 = 0, m03 = 0,
        m04 = 0, m05 = 1, m06 = 0, m07 = 0,
        m08 = 0, m09 = 0, m10 = 1, m11 = 0,
        m12 = 0, m13 = 0, m14 = 0, m15 = 1,
    ) {
        super();
        if (m00 && typeof m00 === 'object') {
            if (ArrayBuffer.isView(m00)) {
                this._array = m00;
                this._array.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
            } else {
                const v = m00.array;
                this._array = MathBase.createFloatArray(16);
                this._array[0] = v[0]; this._array[1] = v[1]; this._array[2] = v[2]; this._array[3] = v[3];
                this._array[4] = v[4]; this._array[5] = v[5]; this._array[6] = v[6]; this._array[7] = v[7];
                this._array[8] = v[8]; this._array[9] = v[9]; this._array[10] = v[10]; this._array[11] = v[11];
                this._array[12] = v[12]; this._array[13] = v[13]; this._array[14] = v[14]; this._array[15] = v[15];
            }
        } else {
            this._array = MathBase.createFloatArray(16);
            this._array[0] = m00; this._array[1] = m01; this._array[2] = m02; this._array[3] = m03;
            this._array[4] = m04; this._array[5] = m05; this._array[6] = m06; this._array[7] = m07;
            this._array[8] = m08; this._array[9] = m09; this._array[10] = m10; this._array[11] = m11;
            this._array[12] = m12; this._array[13] = m13; this._array[14] = m14; this._array[15] = m15;
        }
    }

    /**
     * @en Clone a new matrix from the current matrix.
     * @zh 克隆当前矩阵。
     */
    public clone () {
        const v = this._array;
        return new Mat4(
            v[0], v[1], v[2], v[3],
            v[4], v[5], v[6], v[7],
            v[8], v[9], v[10], v[11],
            v[12], v[13], v[14], v[15],
        );
    }

    /**
     * @en Sets the matrix with another one's value.
     * @zh 设置当前矩阵使其与指定矩阵相等。
     * @param other Specified matrix.
     * @return this
     */
    public set (other: Readonly<Mat4>);

    /**
     * @en Set the matrix with values of all elements
     * @zh 设置当前矩阵指定元素值。
     * @return this
     */
    public set (
        m00?: number, m01?: number, m02?: number, m03?: number,
        m04?: number, m05?: number, m06?: number, m07?: number,
        m08?: number, m09?: number, m10?: number, m11?: number,
        m12?: number, m13?: number, m14?: number, m15?: number);

    public set (m00: Readonly<Mat4> | number = 1, m01 = 0, m02 = 0, m03 = 0,
        m04 = 0, m05 = 1, m06 = 0, m07 = 0,
        m08 = 0, m09 = 0, m10 = 1, m11 = 0,
        m12 = 0, m13 = 0, m14 = 0, m15 = 1) {
        if (m00 && typeof m00 === 'object') {
            const v = m00.array;
            this._array[1] = v[1]; this._array[2] = v[2]; this._array[3] = v[3]; this._array[4] = v[4];
            this._array[5] = v[5]; this._array[6] = v[6]; this._array[7] = v[7]; this._array[8] = v[8];
            this._array[9] = v[9]; this._array[10] = v[10]; this._array[11] = v[11]; this._array[12] = v[12];
            this._array[13] = v[13]; this._array[14] = v[14]; this._array[15] = v[15]; this._array[0] = v[0];
        } else {
            this._array[1] = m01; this._array[2] = m02; this._array[3] = m03; this._array[4] = m04;
            this._array[5] = m05; this._array[6] = m06; this._array[7] = m07; this._array[8] = m08;
            this._array[9] = m09; this._array[10] = m10; this._array[11] = m11; this._array[12] = m12;
            this._array[13] = m13; this._array[14] = m14; this._array[15] = m15; this._array[0] = m00;
        }
        return this;
    }

    /**
     * @en Returns whether the specified matrices are approximately equal.
     * @zh 判断当前矩阵是否在误差范围内与指定矩阵相等。
     * @param other Comparative matrix
     * @param epsilon The error allowed. It`s should be a non-negative number.
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    public equals (other: Readonly<Mat4>, epsilon = EPSILON): boolean {
        const v = other.array;
        return (
            Math.abs(this._array[0] - v[0]) <= epsilon * Math.max(1.0, Math.abs(this._array[0]), Math.abs(v[0]))
            && Math.abs(this._array[1] - v[1]) <= epsilon * Math.max(1.0, Math.abs(this._array[1]), Math.abs(v[1]))
            && Math.abs(this._array[2] - v[2]) <= epsilon * Math.max(1.0, Math.abs(this._array[2]), Math.abs(v[2]))
            && Math.abs(this._array[3] - v[3]) <= epsilon * Math.max(1.0, Math.abs(this._array[3]), Math.abs(v[3]))
            && Math.abs(this._array[4] - v[4]) <= epsilon * Math.max(1.0, Math.abs(this._array[4]), Math.abs(v[4]))
            && Math.abs(this._array[5] - v[5]) <= epsilon * Math.max(1.0, Math.abs(this._array[5]), Math.abs(v[5]))
            && Math.abs(this._array[6] - v[6]) <= epsilon * Math.max(1.0, Math.abs(this._array[6]), Math.abs(v[6]))
            && Math.abs(this._array[7] - v[7]) <= epsilon * Math.max(1.0, Math.abs(this._array[7]), Math.abs(v[7]))
            && Math.abs(this._array[8] - v[8]) <= epsilon * Math.max(1.0, Math.abs(this._array[8]), Math.abs(v[8]))
            && Math.abs(this._array[9] - v[9]) <= epsilon * Math.max(1.0, Math.abs(this._array[9]), Math.abs(v[9]))
            && Math.abs(this._array[10] - v[10]) <= epsilon * Math.max(1.0, Math.abs(this._array[10]), Math.abs(v[10]))
            && Math.abs(this._array[11] - v[11]) <= epsilon * Math.max(1.0, Math.abs(this._array[11]), Math.abs(v[11]))
            && Math.abs(this._array[12] - v[12]) <= epsilon * Math.max(1.0, Math.abs(this._array[12]), Math.abs(v[12]))
            && Math.abs(this._array[13] - v[13]) <= epsilon * Math.max(1.0, Math.abs(this._array[13]), Math.abs(v[13]))
            && Math.abs(this._array[14] - v[14]) <= epsilon * Math.max(1.0, Math.abs(this._array[14]), Math.abs(v[14]))
            && Math.abs(this._array[15] - v[15]) <= epsilon * Math.max(1.0, Math.abs(this._array[15]), Math.abs(v[15]))
        );
    }

    /**
     * @en Returns whether the specified matrices are equal.
     * @zh 判断当前矩阵是否与指定矩阵相等。
     * @param other Comparative matrix
     * @return Returns `true' when the elements of both matrices are equal; otherwise returns `false'.
     */
    public strictEquals (other: Readonly<Mat4>): boolean {
        const v = other.array;
        return this._array[0] === other.m00 && this._array[1] === v[1] && this._array[2] === v[2] && this._array[3] === v[3]
            && this._array[4] === v[4] && this._array[5] === v[5] && this._array[6] === v[6] && this._array[7] === v[7]
            && this._array[8] === v[8] && this._array[9] === v[9] && this._array[10] === v[10] && this._array[11] === v[11]
            && this._array[12] === v[12] && this._array[13] === v[13] && this._array[14] === v[14] && this._array[15] === v[15];
    }

    /**
     * @en Returns a string representation of a matrix.
     * @zh 返回当前矩阵的字符串表示。
     * @return 当前矩阵的字符串表示。
     */
    public toString () {
        return `[\n${
            this._array[0]}, ${this._array[1]}, ${this._array[2]}, ${this._array[3]},\n${
            this._array[4]}, ${this._array[5]}, ${this._array[6]}, ${this._array[7]},\n${
            this._array[8]}, ${this._array[9]}, ${this._array[10]}, ${this._array[11]},\n${
            this._array[12]}, ${this._array[13]}, ${this._array[14]}, ${this._array[15]}\n`
            + `]`;
    }

    /**
     * @en set the current matrix to an identity matrix.
     * @zh 将当前矩阵设为单位矩阵。
     * @return `this`
     */
    public identity () {
        this._array[0] = 1;
        this._array[1] = 0;
        this._array[2] = 0;
        this._array[3] = 0;
        this._array[4] = 0;
        this._array[5] = 1;
        this._array[6] = 0;
        this._array[7] = 0;
        this._array[8] = 0;
        this._array[9] = 0;
        this._array[10] = 1;
        this._array[11] = 0;
        this._array[12] = 0;
        this._array[13] = 0;
        this._array[14] = 0;
        this._array[15] = 1;
        return this;
    }

    /**
     * @en set the current matrix to an zero matrix.
     * @zh 将当前矩阵设为 0矩阵。
     * @return `this`
     */
    public zero () {
        this.m00 = 0;
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m04 = 0;
        this.m05 = 0;
        this.m06 = 0;
        this.m07 = 0;
        this.m08 = 0;
        this.m09 = 0;
        this.m10 = 0;
        this.m11 = 0;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m15 = 0;
        return this;
    }

    /**
     * @en Transposes the current matrix.
     * @zh 计算当前矩阵的转置矩阵。
     */
    public transpose () {
        const a01 = this._array[1]; const a02 = this._array[2]; const a03 = this._array[3]; const a12 = this._array[6]; const a13 = this._array[7]; const a23 = this._array[11];
        this._array[1] = this._array[4];
        this._array[2] = this._array[8];
        this._array[3] = this._array[12];
        this._array[4] = a01;
        this._array[6] = this._array[9];
        this._array[7] = this._array[13];
        this._array[8] = a02;
        this._array[9] = a12;
        this._array[11] = this._array[14];
        this._array[12] = a03;
        this._array[13] = a13;
        this._array[14] = a23;
        return this;
    }

    /**
     * @en Inverts the current matrix. When matrix is not invertible the matrix will be set to zeros.
     * @zh 计算当前矩阵的逆矩阵。注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
     */
    public invert () {
        const a00 = this._array[0]; const a01 = this._array[1]; const a02 = this._array[2]; const a03 = this._array[3];
        const a10 = this._array[4]; const a11 = this._array[5]; const a12 = this._array[6]; const a13 = this._array[7];
        const a20 = this._array[8]; const a21 = this._array[9]; const a22 = this._array[10]; const a23 = this._array[11];
        const a30 = this._array[12]; const a31 = this._array[13]; const a32 = this._array[14]; const a33 = this._array[15];

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

        if (det === 0) {
            this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            return this;
        }
        det = 1.0 / det;

        this._array[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this._array[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this._array[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this._array[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this._array[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this._array[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this._array[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this._array[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this._array[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this._array[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this._array[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this._array[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this._array[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this._array[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this._array[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this._array[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    }

    /**
     * @en Calculates the determinant of the current matrix.
     * @zh 计算当前矩阵的行列式。
     * @return 当前矩阵的行列式。
     */
    public determinant (): number {
        const a00 = this._array[0]; const a01 = this._array[1]; const a02 = this._array[2]; const a03 = this._array[3];
        const a10 = this._array[4]; const a11 = this._array[5]; const a12 = this._array[6]; const a13 = this._array[7];
        const a20 = this._array[8]; const a21 = this._array[9]; const a22 = this._array[10]; const a23 = this._array[11];
        const a30 = this._array[12]; const a31 = this._array[13]; const a32 = this._array[14]; const a33 = this._array[15];

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
     * @en Adds the current matrix and another matrix to the current matrix.
     * @zh 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
     * @param mat the second operand
     */
    public add (mat: Mat4) {
        const v = mat.array;
        this._array[0] += v[0];
        this._array[1] += v[1];
        this._array[2] += v[2];
        this._array[3] += v[3];
        this._array[4] += v[4];
        this._array[5] += v[5];
        this._array[6] += v[6];
        this._array[7] += v[7];
        this._array[8] += v[8];
        this._array[9] += v[9];
        this._array[10] += v[10];
        this._array[11] += v[11];
        this._array[12] += v[12];
        this._array[13] += v[13];
        this._array[14] += v[14];
        this._array[15] += v[15];
        return this;
    }

    /**
     * @en Subtracts another matrix from the current matrix.
     * @zh 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    public subtract (mat: Mat4) {
        const v = mat.array;
        this._array[0] -= v[0];
        this._array[1] -= v[1];
        this._array[2] -= v[2];
        this._array[3] -= v[3];
        this._array[4] -= v[4];
        this._array[5] -= v[5];
        this._array[6] -= v[6];
        this._array[7] -= v[7];
        this._array[8] -= v[8];
        this._array[9] -= v[9];
        this._array[10] -= v[10];
        this._array[11] -= v[11];
        this._array[12] -= v[12];
        this._array[13] -= v[13];
        this._array[14] -= v[14];
        this._array[15] -= v[15];
        return this;
    }

    /**
     * @en Multiply the current matrix with another matrix.
     * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat the second operand
     */
    public multiply (mat: Mat4) {
        const a00 = this._array[0]; const a01 = this._array[1]; const a02 = this._array[2]; const a03 = this._array[3];
        const a10 = this._array[4]; const a11 = this._array[5]; const a12 = this._array[6]; const a13 = this._array[7];
        const a20 = this._array[8]; const a21 = this._array[9]; const a22 = this._array[10]; const a23 = this._array[11];
        const a30 = this._array[12]; const a31 = this._array[13]; const a32 = this._array[14]; const a33 = this._array[15];
        const v = mat.array;
        // Cache only the current line of the second matrix
        let b0 = v[0]; let b1 = v[1]; let b2 = v[2]; let b3 = v[3];
        this._array[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._array[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._array[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._array[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = v[4]; b1 = v[5]; b2 = v[6]; b3 = v[7];
        this._array[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._array[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._array[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._array[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = v[8]; b1 = v[9]; b2 = v[10]; b3 = v[11];
        this._array[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._array[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._array[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._array[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = v[12]; b1 = v[13]; b2 = v[14]; b3 = v[15];
        this._array[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this._array[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this._array[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this._array[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return this;
    }

    /**
     * @en Multiply each element of the current matrix by a scalar number.
     * @zh 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar amount to scale the matrix's elements by
     */
    public multiplyScalar (scalar: number) {
        this._array[0] *= scalar;
        this._array[1] *= scalar;
        this._array[2] *= scalar;
        this._array[3] *= scalar;
        this._array[4] *= scalar;
        this._array[5] *= scalar;
        this._array[6] *= scalar;
        this._array[7] *= scalar;
        this._array[8] *= scalar;
        this._array[9] *= scalar;
        this._array[10] *= scalar;
        this._array[11] *= scalar;
        this._array[12] *= scalar;
        this._array[13] *= scalar;
        this._array[14] *= scalar;
        this._array[15] *= scalar;
        return this;
    }

    /**
     * @en Translate the current matrix by the given vector
     * @zh 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec vector to translate by
     */
    public translate (vec: Vec3) {
        console.warn('function changed');
        const v = vec.array;
        this._array[12] += v[0];
        this._array[13] += v[1];
        this._array[14] += v[2];
        return this;
    }

    /**
     * @en Multiply the current matrix with a scale vector.
     * @zh 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
     * @param vec vector to scale by
     */
    public scale (vec: Vec3) {
        const v = vec.array;
        const x = v[0]; const y = v[1]; const z = v[2];
        this._array[0] *= x;
        this._array[1] *= x;
        this._array[2] *= x;
        this._array[3] *= x;
        this._array[4] *= y;
        this._array[5] *= y;
        this._array[6] *= y;
        this._array[7] *= y;
        this._array[8] *= z;
        this._array[9] *= z;
        this._array[10] *= z;
        this._array[11] *= z;
        return this;
    }

    /**
     * @en Rotates the current matrix by the given angle around the given axis
     * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param rad Angle of rotation (in radians)
     * @param axis Axis of rotation
     */
    public rotate (rad: number, axis: Vec3) {
        let x = axis.x; let y = axis.y; let z = axis.z;

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

        const a00 = this._array[0]; const a01 = this._array[1]; const a02 = this._array[2]; const a03 = this._array[3];
        const a10 = this._array[4]; const a11 = this._array[5]; const a12 = this._array[6]; const a13 = this._array[7];
        const a20 = this._array[8]; const a21 = this._array[9]; const a22 = this._array[10]; const a23 = this._array[11];

        // Construct the elements of the rotation matrix
        const b00 = x * x * t + c; const b01 = y * x * t + z * s; const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s; const b11 = y * y * t + c; const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s; const b21 = y * z * t - x * s; const b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        this._array[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this._array[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this._array[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this._array[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this._array[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this._array[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this._array[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this._array[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this._array[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this._array[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this._array[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this._array[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    /**
     * @en Returns the translation vector component of a transformation matrix.
     * @zh 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
     * @param out Vector to receive translation component.
     */
    public getTranslation (out: Vec3) {
        out.x = this._array[12];
        out.y = this._array[13];
        out.z = this._array[14];

        return out;
    }

    /**
     * @en Returns the scale factor component of a transformation matrix
     * @zh 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
     * @param out Vector to receive scale component
     */
    public getScale (out: Vec3) {
        const o = out.array;
        const t = m3_1.array;
        const m00 = t[0] = this._array[0];
        const m01 = t[1] = this._array[1];
        const m02 = t[2] = this._array[2];
        const m04 = t[3] = this._array[4];
        const m05 = t[4] = this._array[5];
        const m06 = t[5] = this._array[6];
        const m08 = t[6] = this._array[8];
        const m09 = t[7] = this._array[9];
        const m10 = t[8] = this._array[10];
        o[0] = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        o[1] = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        o[2] = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
        // account for refections
        if (Mat3.determinant(m3_1) < 0) { out.x *= -1; }
        return out;
    }

    /**
     * @en Returns the rotation factor component of a transformation matrix
     * @zh 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
     * @param out Vector to receive rotation component
     */
    public getRotation (out: Quat) {
        const trace = this._array[0] + this._array[5] + this._array[10];
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out.w = 0.25 * S;
            out.x = (this._array[6] - this._array[9]) / S;
            out.y = (this._array[8] - this._array[2]) / S;
            out.z = (this._array[1] - this._array[4]) / S;
        } else if ((this._array[0] > this._array[5]) && (this._array[0] > this._array[10])) {
            S = Math.sqrt(1.0 + this._array[0] - this._array[5] - this._array[10]) * 2;
            out.w = (this._array[6] - this._array[9]) / S;
            out.x = 0.25 * S;
            out.y = (this._array[1] + this._array[4]) / S;
            out.z = (this._array[8] + this._array[2]) / S;
        } else if (this._array[5] > this._array[10]) {
            S = Math.sqrt(1.0 + this._array[5] - this._array[0] - this._array[10]) * 2;
            out.w = (this._array[8] - this._array[2]) / S;
            out.x = (this._array[1] + this._array[4]) / S;
            out.y = 0.25 * S;
            out.z = (this._array[6] + this._array[9]) / S;
        } else {
            S = Math.sqrt(1.0 + this._array[10] - this._array[0] - this._array[5]) * 2;
            out.w = (this._array[1] - this._array[4]) / S;
            out.x = (this._array[8] + this._array[2]) / S;
            out.y = (this._array[6] + this._array[9]) / S;
            out.z = 0.25 * S;
        }

        return out;
    }

    /**
     * @en Resets the matrix values by the given rotation quaternion, translation vector and scale vector
     * @zh 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q Rotation quaternion
     * @param v Translation vector
     * @param s Scaling vector
     * @return `this`
     */
    public fromRTS (q: Quat, v: Vec3, s: Vec3) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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

        this._array[0] = (1 - (yy + zz)) * sx;
        this._array[1] = (xy + wz) * sx;
        this._array[2] = (xz - wy) * sx;
        this._array[3] = 0;
        this._array[4] = (xy - wz) * sy;
        this._array[5] = (1 - (xx + zz)) * sy;
        this._array[6] = (yz + wx) * sy;
        this._array[7] = 0;
        this._array[8] = (xz + wy) * sz;
        this._array[9] = (yz - wx) * sz;
        this._array[10] = (1 - (xx + yy)) * sz;
        this._array[11] = 0;
        this._array[12] = v.x;
        this._array[13] = v.y;
        this._array[14] = v.z;
        this._array[15] = 1;

        return this;
    }

    /**
     * @en Resets the current matrix from the given quaternion.
     * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q Rotation quaternion
     * @return `this`
     */
    public fromQuat (q: Quat) {
        const x = q.x; const y = q.y; const z = q.z; const w = q.w;
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

        this._array[0] = 1 - yy - zz;
        this._array[1] = yx + wz;
        this._array[2] = zx - wy;
        this._array[3] = 0;

        this._array[4] = yx - wz;
        this._array[5] = 1 - xx - zz;
        this._array[6] = zy + wx;
        this._array[7] = 0;

        this._array[8] = zx + wy;
        this._array[9] = zy - wx;
        this._array[10] = 1 - xx - yy;
        this._array[11] = 0;

        this._array[12] = 0;
        this._array[13] = 0;
        this._array[14] = 0;
        this._array[15] = 1;

        return this;
    }
}

const v3_1 = new Vec3();
const m3_1 = new Mat3();
enumerableProps(Mat4.prototype, ['m00', 'm01', 'm02', 'm03',
    'm04', 'm05', 'm06', 'm07',
    'm08', 'm09', 'm10', 'm11',
    'm12', 'm13', 'm14', 'm15']);
CCClass.fastDefine('cc.Mat4', Mat4, {
    m00: 1,
    m01: 0,
    m02: 0,
    m03: 0,
    m04: 0,
    m05: 1,
    m06: 0,
    m07: 0,
    m08: 0,
    m09: 0,
    m10: 1,
    m11: 0,
    m12: 0,
    m13: 0,
    m14: 0,
    m15: 1,
});
legacyCC.Mat4 = Mat4;

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
    m30?, m31?, m32?, m33?,
) {
    return new Mat4(m00 as any, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
}

legacyCC.mat4 = mat4;
