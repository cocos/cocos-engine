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
import { Mat4 } from './mat4';
import { Quat } from './quat';
import { EPSILON } from './utils';
import { ValueType } from './value-type';
import { Vec3 } from './vec3';

/**
 * 表示三维（4x4）矩阵。
 */
// tslint:disable:one-variable-per-declaration
export class Mat3 extends ValueType {

    /**
     * 构造与指定矩阵相等的矩阵。
     * @param other 相比较的矩阵。
     */
    public static create (other: Mat3): Mat3;

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
    public static create (
        m00?: number, m01?: number, m02?: number,
        m03?: number, m04?: number, m05?: number,
        m06?: number, m07?: number, m08?: number): Mat3;

    /**
     * @zh 创建新的实例
     */
    public static create (
        m00?: number | Mat3, m01?: number, m02?: number,
        m03?: number, m04?: number, m05?: number,
        m06?: number, m07?: number, m08?: number) {
        if (typeof m00 === 'object') {
            return new Mat3(m00.m00, m00.m01, m00.m02, m00.m03, m00.m04, m00.m05, m00.m06, m00.m07, m00.m08);
        } else {
            return new Mat3( m01, m02, m03, m04, m05, m06, m07, m08);
        }
    }

    /**
     * @zh 获得指定矩阵的拷贝
     */
    public static clone (a: Mat3) {
        return new Mat3(
            a.m00, a.m01, a.m02,
            a.m03, a.m04, a.m05,
            a.m06, a.m07, a.m08,
        );
    }

    /**
     * @zh 复制目标矩阵
     */
    public static copy (out: Mat3, a: Mat3) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m03;
        out.m04 = a.m04;
        out.m05 = a.m05;
        out.m06 = a.m06;
        out.m07 = a.m07;
        out.m08 = a.m08;
        return out;
    }

    /**
     * @zh 设置矩阵值
     */
    public static set (
        out: Mat3,
        m00: number, m01: number, m02: number,
        m10: number, m11: number, m12: number,
        m20: number, m21: number, m22: number,
    ) {
        out.m00 = m00; out.m01 = m01; out.m02 = m02;
        out.m03 = m10; out.m04 = m11; out.m05 = m12;
        out.m06 = m20; out.m07 = m21; out.m08 = m22;
        return out;
    }

    /**
     * @zh 将目标赋值为单位矩阵
     */
    public static identity (out: Mat3) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 1;
        out.m05 = 0;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
    }

    /**
     * @zh 转置矩阵
     */
    public static transpose (out: Mat3, a: Mat3) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            const a01 = a.m01, a02 = a.m02, a12 = a.m05;
            out.m01 = a.m03;
            out.m02 = a.m06;
            out.m03 = a01;
            out.m05 = a.m07;
            out.m06 = a02;
            out.m07 = a12;
        } else {
            out.m00 = a.m00;
            out.m01 = a.m03;
            out.m02 = a.m06;
            out.m03 = a.m01;
            out.m04 = a.m04;
            out.m05 = a.m07;
            out.m06 = a.m02;
            out.m07 = a.m05;
            out.m08 = a.m08;
        }

        return out;
    }

    /**
     * @zh 矩阵求逆
     */
    public static invert (out: Mat3, a: Mat3) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02,
            a10 = a.m03, a11 = a.m04, a12 = a.m05,
            a20 = a.m06, a21 = a.m07, a22 = a.m08;

        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;

        // Calculate the determinant
        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out.m00 = b01 * det;
        out.m01 = (-a22 * a01 + a02 * a21) * det;
        out.m02 = (a12 * a01 - a02 * a11) * det;
        out.m03 = b11 * det;
        out.m04 = (a22 * a00 - a02 * a20) * det;
        out.m05 = (-a12 * a00 + a02 * a10) * det;
        out.m06 = b21 * det;
        out.m07 = (-a21 * a00 + a01 * a20) * det;
        out.m08 = (a11 * a00 - a01 * a10) * det;
        return out;
    }

    /**
     * @zh 矩阵行列式
     */
    public static determinant (a: Mat3) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02,
            a10 = a.m03, a11 = a.m04, a12 = a.m05,
            a20 = a.m06, a21 = a.m07, a22 = a.m08;

        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
    }

    /**
     * @zh 矩阵乘法
     */
    public static multiply (out: Mat3, a: Mat3, b: Mat3) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02,
            a10 = a.m03, a11 = a.m04, a12 = a.m05,
            a20 = a.m06, a21 = a.m07, a22 = a.m08;

        const b00 = b.m00, b01 = b.m01, b02 = b.m02;
        const b10 = b.m03, b11 = b.m04, b12 = b.m05;
        const b20 = b.m06, b21 = b.m07, b22 = b.m08;

        out.m00 = b00 * a00 + b01 * a10 + b02 * a20;
        out.m01 = b00 * a01 + b01 * a11 + b02 * a21;
        out.m02 = b00 * a02 + b01 * a12 + b02 * a22;

        out.m03 = b10 * a00 + b11 * a10 + b12 * a20;
        out.m04 = b10 * a01 + b11 * a11 + b12 * a21;
        out.m05 = b10 * a02 + b11 * a12 + b12 * a22;

        out.m06 = b20 * a00 + b21 * a10 + b22 * a20;
        out.m07 = b20 * a01 + b21 * a11 + b22 * a21;
        out.m08 = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
    }

    /**
     * @zh 矩阵乘法
     */
    public static mul (out, a, b) {
        return Mat3.multiply(out, a, b);
    }

    /**
     * @zh 在给定矩阵变换基础上加入新位移变换
     */
    public static translate (out: Mat3, a: Mat3, v: Vec3) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02,
            a10 = a.m03, a11 = a.m04, a12 = a.m05,
            a20 = a.m06, a21 = a.m07, a22 = a.m08;
        const x = v.x, y = v.y;

        out.m00 = a00;
        out.m01 = a01;
        out.m02 = a02;

        out.m03 = a10;
        out.m04 = a11;
        out.m05 = a12;

        out.m06 = x * a00 + y * a10 + a20;
        out.m07 = x * a01 + y * a11 + a21;
        out.m08 = x * a02 + y * a12 + a22;
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入新缩放变换
     */
    public static scale (out: Mat3, a: Mat3, v: Vec3) {
        const x = v.x, y = v.y;

        out.m00 = x * a.m00;
        out.m01 = x * a.m01;
        out.m02 = x * a.m02;

        out.m03 = y * a.m03;
        out.m04 = y * a.m04;
        out.m05 = y * a.m05;

        out.m06 = a.m06;
        out.m07 = a.m07;
        out.m08 = a.m08;
        return out;
    }

    /**
     * @zh 在给定矩阵变换基础上加入新旋转变换
     * @param rad 旋转弧度
     */
    public static rotate (out: Mat3, a: Mat3, rad: number) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02,
            a10 = a.m03, a11 = a.m04, a12 = a.m05,
            a20 = a.m06, a21 = a.m07, a22 = a.m08;

        const s = Math.sin(rad);
        const c = Math.cos(rad);

        out.m00 = c * a00 + s * a10;
        out.m01 = c * a01 + s * a11;
        out.m02 = c * a02 + s * a12;

        out.m03 = c * a10 - s * a00;
        out.m04 = c * a11 - s * a01;
        out.m05 = c * a12 - s * a02;

        out.m06 = a20;
        out.m07 = a21;
        out.m08 = a22;
        return out;
    }

    /**
     * @zh 根据指定四维矩阵计算三维矩阵
     */
    public static fromMat4 (out: Mat3, a: Mat4) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m04;
        out.m04 = a.m05;
        out.m05 = a.m06;
        out.m06 = a.m08;
        out.m07 = a.m09;
        out.m08 = a.m10;
        return out;
    }

    /**
     * @zh 根据视口前方向和上方向计算矩阵
     * @param view 视口面向的前方向，必须归一化
     * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
     */
    public static fromViewUp (out: Mat3, view: Vec3, up?: Vec3) {
        if (Vec3.sqrMag(view) < EPSILON * EPSILON) {
            Mat3.identity(out);
            return out;
        }

        up = up || Vec3.UNIT_Y;
        Vec3.normalize(v3_1, Vec3.cross(v3_1, up, view));

        if (Vec3.sqrMag(v3_1) < EPSILON * EPSILON) {
            Mat3.identity(out);
            return out;
        }

        Vec3.cross(v3_2, view, v3_1);
        Mat3.set(
            out,
            v3_1.x, v3_1.y, v3_1.z,
            v3_2.x, v3_2.y, v3_2.z,
            view.x, view.y, view.z,
        );

        return out;
    }

    /**
     * @zh 计算位移矩阵
     */
    public static fromTranslation (out: Mat3, v: Vec3) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 1;
        out.m05 = 0;
        out.m06 = v.x;
        out.m07 = v.y;
        out.m08 = 1;
        return out;
    }

    /**
     * @zh 计算缩放矩阵
     */
    public static fromScaling (out: Mat3, v: Vec3) {
        out.m00 = v.x;
        out.m01 = 0;
        out.m02 = 0;

        out.m03 = 0;
        out.m04 = v.y;
        out.m05 = 0;

        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
    }

    /**
     * @zh 计算旋转矩阵
     */
    public static fromRotation (out: Mat3, rad: number) {
        const s = Math.sin(rad), c = Math.cos(rad);

        out.m00 = c;
        out.m01 = s;
        out.m02 = 0;

        out.m03 = -s;
        out.m04 = c;
        out.m05 = 0;

        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
    }

    /**
     * @zh 根据四元数旋转信息计算矩阵
     */
    public static fromQuat (out: Mat3, q: Quat) {
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
        out.m03 = yx - wz;
        out.m06 = zx + wy;

        out.m01 = yx + wz;
        out.m04 = 1 - xx - zz;
        out.m07 = zy - wx;

        out.m02 = zx - wy;
        out.m05 = zy + wx;
        out.m08 = 1 - xx - yy;

        return out;
    }

    /**
     * @zh 计算指定四维矩阵的逆转置三维矩阵
     */
    public static inverseTransposeMat4 (out: Mat3, a: Mat4) {
        const a00 = a.m00, a01 = a.m01, a02 = a.m02, a03 = a.m03,
            a10 = a.m04, a11 = a.m05, a12 = a.m06, a13 = a.m07,
            a20 = a.m08, a21 = a.m09, a22 = a.m10, a23 = a.m11,
            a30 = a.m12, a31 = a.m13, a32 = a.m14, a33 = a.m15;

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

        out.m03 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m04 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m05 = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out.m06 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m07 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m08 = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return out;
    }

    /**
     * @zh 矩阵转数组
     * @param ofs 数组内的起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, m: Mat4, ofs = 0) {
        out[ofs + 0] = m.m00;
        out[ofs + 1] = m.m01;
        out[ofs + 2] = m.m02;
        out[ofs + 3] = m.m03;
        out[ofs + 4] = m.m04;
        out[ofs + 5] = m.m05;
        out[ofs + 6] = m.m06;
        out[ofs + 7] = m.m07;
        out[ofs + 8] = m.m08;

        return out;
    }

    /**
     * @zh 逐元素矩阵加法
     */
    public static add (out: Mat3, a: Mat3, b: Mat3) {
        out.m00 = a.m00 + b.m00;
        out.m01 = a.m01 + b.m01;
        out.m02 = a.m02 + b.m02;
        out.m03 = a.m03 + b.m03;
        out.m04 = a.m04 + b.m04;
        out.m05 = a.m05 + b.m05;
        out.m06 = a.m06 + b.m06;
        out.m07 = a.m07 + b.m07;
        out.m08 = a.m08 + b.m08;
        return out;
    }

    /**
     * @zh 逐元素矩阵减法
     */
    public static subtract (out: Mat3, a: Mat3, b: Mat3) {
        out.m00 = a.m00 - b.m00;
        out.m01 = a.m01 - b.m01;
        out.m02 = a.m02 - b.m02;
        out.m03 = a.m03 - b.m03;
        out.m04 = a.m04 - b.m04;
        out.m05 = a.m05 - b.m05;
        out.m06 = a.m06 - b.m06;
        out.m07 = a.m07 - b.m07;
        out.m08 = a.m08 - b.m08;
        return out;
    }

    /**
     * @zh 逐元素矩阵减法
     */
    public static sub (out: Mat3, a: Mat3, b: Mat3) {
        return Mat3.subtract(out, a, b);
    }

    /**
     * @zh 矩阵标量乘法
     */
    public static multiplyScalar (out: Mat3, a: Mat3, b: number) {
        out.m00 = a.m00 * b;
        out.m01 = a.m01 * b;
        out.m02 = a.m02 * b;
        out.m03 = a.m03 * b;
        out.m04 = a.m04 * b;
        out.m05 = a.m05 * b;
        out.m06 = a.m06 * b;
        out.m07 = a.m07 * b;
        out.m08 = a.m08 * b;
        return out;
    }

    /**
     * @zh 逐元素矩阵标量乘加: A + B * scale
     */
    public static multiplyScalarAndAdd (out: Mat3, a: Mat3, b: Mat3, scale: number) {
        out.m00 = a.m00 + (b.m00 * scale);
        out.m01 = a.m01 + (b.m01 * scale);
        out.m02 = a.m02 + (b.m02 * scale);
        out.m03 = a.m03 + (b.m03 * scale);
        out.m04 = a.m04 + (b.m04 * scale);
        out.m05 = a.m05 + (b.m05 * scale);
        out.m06 = a.m06 + (b.m06 * scale);
        out.m07 = a.m07 + (b.m07 * scale);
        out.m08 = a.m08 + (b.m08 * scale);
        return out;
    }

    /**
     * @zh 矩阵等价判断
     */
    public static exactEquals (a: Mat3, b: Mat3) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 &&
            a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 &&
            a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08;
    }

    /**
     * @zh 排除浮点数误差的矩阵近似等价判断
     */
    public static equals (a: Mat3, b: Mat3, epsilon = EPSILON) {
        const a0 = a.m00, a1 = a.m01, a2 = a.m02, a3 = a.m03, a4 = a.m04, a5 = a.m05, a6 = a.m06, a7 = a.m07, a8 = a.m08;
        const b0 = b.m00, b1 = b.m01, b2 = b.m02, b3 = b.m03, b4 = b.m04, b5 = b.m05, b6 = b.m06, b7 = b.m07, b8 = b.m08;
        return (
            Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= epsilon * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
            Math.abs(a4 - b4) <= epsilon * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
            Math.abs(a5 - b5) <= epsilon * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
            Math.abs(a6 - b6) <= epsilon * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
            Math.abs(a7 - b7) <= epsilon * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
            Math.abs(a8 - b8) <= epsilon * Math.max(1.0, Math.abs(a8), Math.abs(b8))
        );
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
     * 矩阵第 1 列第 0 行的元素。
     */
    public m03: number;

    /**
     * 矩阵第 1 列第 1 行的元素。
     */
    public m04: number;

    /**
     * 矩阵第 1 列第 2 行的元素。
     */
    public m05: number;

    /**
     * 矩阵第 2 列第 0 行的元素。
     */
    public m06: number;

    /**
     * 矩阵第 2 列第 1 行的元素。
     */
    public m07: number;

    /**
     * 矩阵第 2 列第 2 行的元素。
     */
    public m08: number;

    constructor (
        m00 = 1, m01 = 0, m02 = 0,
        m03 = 0, m04 = 1, m05 = 0,
        m06 = 0, m07 = 0, m08 = 1) {
        super();
        this.m00 = m00; this.m01 = m01; this.m02 = m02;
        this.m03 = m03; this.m04 = m04; this.m05 = m05;
        this.m06 = m06; this.m07 = m07; this.m08 = m08;
    }

    /**
     * 克隆当前矩阵。
     */
    public clone () {
        const t = this;
        return new Mat3(
            t.m00, t.m01, t.m02,
            t.m03, t.m04, t.m05,
            t.m06, t.m07, t.m08);
    }

    /**
     * 设置当前矩阵使其与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns `this`
     */
    public set (other: Mat3) {
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
        return this;
    }

    /**
     * 判断当前矩阵是否在误差范围内与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Mat3, epsilon?: number): boolean {
        return Mat3.equals(this, other, epsilon);
    }

    /**
     * 判断当前矩阵是否与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public exactEquals (other: Mat3): boolean {
        return Mat3.exactEquals(this, other);
    }

    /**
     * 返回当前矩阵的字符串表示。
     * @returns 当前矩阵的字符串表示。
     */
    public toString () {
        const t = this;
        return '[\n' +
            t.m00 + ', ' + t.m01 + ', ' + t.m02 + ',\n' +
            t.m03 + ',\n' + t.m04 + ', ' + t.m05 + ',\n' +
            t.m06 + ', ' + t.m07 + ',\n' + t.m08 + '\n' +
            ']';
    }

    /**
     * 将当前矩阵设为单位矩阵。
     * @returns `this`
     */
    public identity () {
        return Mat3.identity(this);
    }

    /**
     * 计算当前矩阵的转置矩阵。
     */
    public transpose () {
        Mat3.transpose(this, this);
    }

    /**
     * 计算当前矩阵的逆矩阵。
     */
    public invert () {
        Mat3.invert(this, this);
    }

    /**
     * 计算当前矩阵的行列式。
     * @returns 当前矩阵的行列式。
     */
    public determinant (): number {
        return Mat3.determinant(this);
    }

    /**
     * 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
     * @param mat 相加的矩阵
     */
    public add (mat: Mat3) {
        Mat3.add(this, this, mat);
    }

    /**
     * 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
     * @param mat 减数矩阵。
     */
    public sub (mat: Mat3) {
        Mat3.subtract(this, this, mat);
    }

    /**
     * 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
     * @param mat 指定的矩阵。
     */
    public mul (mat: Mat3) {
        Mat3.multiply(this, this, mat);
    }

    /**
     * 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
     * @param scalar 指定的标量。
     */
    public mulScalar (scalar: number) {
        Mat3.multiplyScalar(this, this, scalar);
    }

    /**
     * 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
     * @param vec 位移向量。
     */
    public translate (vec: Vec3) {
        Mat3.translate(this, this, vec);
    }

    /**
     * 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
     * @param vec 各个轴的缩放。
     */
    public scale (vec: Vec3) {
        Mat3.scale(this, this, vec);
    }

    /**
     * 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param mat 矩阵
     * @param rad 旋转角度（弧度制）
     */
    public rotate (rad: number) {
        Mat3.rotate(this, this, rad);
    }

    /**
     * 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
     * @param q 四元数表示的旋转变换。
     * @returns `this`
     */
    public fromQuat (q: Quat) {
        return Mat3.fromQuat(this, q);
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();

CCClass.fastDefine('cc.Mat3', Mat3, {
    m00: 1, m01: 0, m02: 0,
    m03: 0, m04: 1, m05: 0,
    m06: 0, m07: 0, m08: 1,
});
cc.Mat3 = Mat3;
cc.mat3 = Mat3.create;
