/*
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
*/

/**
 * @category core/value-types
 */

import CCClass from '../data/class';
import {clamp, vec3, vec4} from '../vmath';
import Mat4 from './mat4';
import { ValueType } from './value-type';

/**
 * 四维向量。
 */
export default class Vec4 extends ValueType {

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param out 本方法将插值结果赋值给此参数
     * @param from 起始向量。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public static lerp (out: Vec4, from: Vec4, to: Vec4, ratio: number) {
        vec4.lerp(out, from, to, ratio);
    }

    /**
     * x 分量。
     */
    public x: number;

    /**
     * y 分量。
     */
    public y: number;

    /**
     * z 分量。
     */
    public z: number;

    /**
     * w 分量。
     */
    public w: number;

    /**
     * 构造与指定向量相等的向量。
     * @param other 相比较的向量。
     */
    constructor (other: Vec4);

    /**
     * 构造具有指定分量的向量。
     * @param [x=0] 指定的 x 分量。
     * @param [y=0] 指定的 y 分量。
     * @param [z=0] 指定的 z 分量。
     * @param [w=0] 指定的 w 分量。
     */
    constructor (x?: number, y?: number, z?: number, w?: number);

    constructor (x?: number | Vec4, y?: number, z?: number, w?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 0;
        }
    }

    /**
     * 克隆当前向量。
     */
    public clone () {
        return new Vec4(this.x, this.y, this.z, this.w);
    }

    /**
     * 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @returns `this`
     */
    public set (other: Vec4) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    }

    /**
     * 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec4) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    /**
     * 判断当前向量是否在误差范围 [-variance, variance] 内与指定向量相等。
     * @param other 相比较的向量。
     * @param variance 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public fuzzyEquals (other: Vec4, variance: number) {
        if (this.x - variance <= other.x && other.x <= this.x + variance) {
            if (this.y - variance <= other.y && other.y <= this.y + variance) {
                if (this.z - variance <= other.z && other.z <= this.z + variance) {
                    if (this.w - variance <= other.w && other.w <= this.w + variance) {
                    return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec4, ratio: number) {
        vec4.lerp(this, this, to, ratio);
    }

    /**
     * 返回当前向量的字符串表示。
     * @returns 当前向量的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)})`;
    }

    /**
     * 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive 每个分量都代表了对应分量允许的最小值。
     * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
     * @returns `this`
     */
    public clampf (minInclusive: Vec4, maxInclusive: Vec4) {
        this.x = clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = clamp(this.y, minInclusive.y, maxInclusive.y);
        this.z = clamp(this.z, minInclusive.z, maxInclusive.z);
        this.w = clamp(this.w, minInclusive.w, maxInclusive.w);
    }

    /**
     * 向量加法。将当前向量与指定向量的相加
     * @param other 指定的向量。
     */
    public add (other: Vec4) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        this.z = this.z + other.z;
        this.w = this.w + other.w;
    }

    /**
     * 向量减法。将当前向量减去指定向量
     * @param other 减数向量。
     */
    public subtract (other: Vec4) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        this.z = this.z - other.z;
        this.w = this.w - other.w;
    }

    /**
     * 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public multiply (scalar: number) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
        this.w = this.w * scalar;
    }

    /**
     * 向量乘法。将当前向量乘以与指定向量
     * @param other 指定的向量。
     */
    public scale (other: Vec4) {
        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
        this.w = this.w * other.w;
    }

    /**
     * 将当前向量的各个分量除以指定标量。相当于 `this.mul(1 / scalar, out)`。
     * @param scalar 标量除数。
     */
    public divide (scalar: number) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
        this.z = this.z / scalar;
        this.w = this.w / scalar;
    }

    /**
     * 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
    }

    /**
     * 向量点乘。
     * @param other 指定的向量。
     * @returns 当前向量与指定向量点乘的结果。
     */
    public dot (vector: Vec4) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    /**
     * 向量叉乘。视当前向量和指定向量为三维向量（舍弃 w 分量），将当前向量左叉乘指定向量
     * @param other 指定的向量。
     */
    public cross (vector: Vec4) {
        vec3.cross(this, this, vector);
    }

    /**
     * 计算向量的长度（模）。
     * @returns 向量的长度（模）。
     */
    public mag () {
        const { x, y, z, w } = this;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * 计算向量长度（模）的平方。
     * @returns 向量长度（模）的平方。
     */
    public magSqr () {
        const { x, y, z, w } = this;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * 将当前向量归一化
     */
    public normalize () {
        vec4.normalize(this, this);
    }

    /**
     * 应用四维矩阵变换到当前矩阵
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        vec4.transformMat4(this, this, matrix);
    }
}

CCClass.fastDefine('cc.Vec4', Vec4, { x: 0, y: 0, z: 0, w: 0 });
cc.Vec4 = Vec4;

/**
 * 构造与指定向量相等的向量。等价于 `new Vec4(other)`。
 * @param other 相比较的向量。
 * @returns `new Vec4(other)`
 * @deprecated
 */
export function v4 (other: Vec4): Vec4;

/**
 * 构造具有指定分量的向量。等价于 `new Vec4(x, y, z, w)`。
 * @param [x=0] 指定的 x 分量。
 * @param [y=0] 指定的 y 分量。
 * @param [z=0] 指定的 z 分量。
 * @param [w=0] 指定的 w 分量。
 * @returns `new Vec4(x, y, z)`
 * @deprecated
 */
export function v4 (x?: number, y?: number, z?: number, w?: number): Vec4;

export function v4 (x?: number | Vec4, y?: number, z?: number, w?: number) {
    return new Vec4(x as any, y, z, w);
}

cc.v4 = v4;
