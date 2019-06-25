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
import { mat4 as xmat4 } from '../vmath';
import Quat from './quat';
import { ValueType } from './value-type';
import Vec3 from './vec3';

/**
 * 表示四维（4x4）矩阵。
 */
export default class Mat4 extends ValueType {
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
     * @param other 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Mat4) {
        return xmat4.exactEquals(this, other);
    }

    /**
     * 判断当前矩阵是否与指定矩阵相等。
     * @param other 相比较的矩阵。
     * @returns 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
     */
    public fuzzyEquals (other: Mat4) {
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
     * 将当前矩阵的转置矩阵赋值给出口矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public transpose (out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.transpose(out, this);
    }

    /**
     * 将当前矩阵的逆矩阵赋值给出口矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public invert (out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.invert(out, this);
    }

    /**
     * 将当前矩阵的伴随矩阵赋值给出口矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public adjoint (out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.adjoint(out, this);
    }

    /**
     * 计算当前矩阵的行列式。
     * @returns 当前矩阵的行列式。
     */
    public determinant () {
        return xmat4.determinant(this);
    }

    /**
     * 矩阵加法。将当前矩阵与指定矩阵的相加结果赋值给出口矩阵。
     * @param other 指定的矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public add (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.add(out, this, other);
    }

    /**
     * 矩阵减法。将当前矩阵减去指定矩阵的结果赋值给出口矩阵。
     * @param other 减数矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public sub (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.subtract(out, this, other);
    }

    /**
     * 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给出口矩阵。
     * @param other 指定的矩阵。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public mul (other: Mat4, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.multiply(out, this, other);
    }

    /**
     * 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给出口矩阵。
     * @param scalar 指定的标量。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public mulScalar (scalar: number, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.scale(out, this, scalar);
    }

    /**
     * 将当前矩阵左乘位移矩阵的结果赋值给出口矩阵，位移矩阵由各个轴的位移给出。
     * @param v 各个轴的位移。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public translate (v: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.translate(out, this, v);
    }

    /**
     * 将当前矩阵左乘缩放矩阵的结果赋值给出口矩阵，缩放矩阵由各个轴的缩放给出。
     * @param v 各个轴的缩放。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public scale (v: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.scale(out, this, v);
    }

    /**
     * 将当前矩阵左乘旋转矩阵的结果赋值给出口矩阵，旋转矩阵由旋转轴和旋转角度给出。
     * @param 旋转角度（弧度制）。
     * @param 旋转轴。
     * @param [out] 出口矩阵，当未指定时将创建为新的矩阵。
     * @returns `out`
     */
    public rotate (rad: number, axis: Vec3, out?: Mat4) {
        out = out || new cc.Mat4();
        return xmat4.rotate(out, this, rad, axis);
    }

    /**
     * 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
     * @param [out] 出口向量，当未指定时将创建为新的向量。
     */
    public getTranslation (out?: Mat4) {
        out = out || new cc.Vec3();
        return xmat4.getTranslation(out, this);
    }

    /**
     * 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
     * @param [out] 出口向量，当未指定时将创建为新的向量。
     */
    public getScale (out: Vec3) {
        out = out || new cc.Vec3();
        return xmat4.getScaling(out, this);
    }

    /**
     * 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
     * @param [out] 出口四元数，当未指定时将创建为新的四元数。
     */
    public getRotation (out: Quat) {
        out = out || new Quat();
        return xmat4.getRotation(out, this);
    }

    /**
     * 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
     * @param q 四元数表示的旋转变换。
     * @param v 位移变换，表示为各个轴的位移。
     * @param s 缩放变换，表示为各个轴的缩放。
     * @returns `this`
     */
    public fromRTS (q: Quat, v: Vec3, s: Vec3) {
        return xmat4.fromRTS(this, q, v, s);
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
