/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
import { Mat4 } from './mat4';
import { clamp } from './utils';
import { ValueType } from './value-type';

/**
 * 二维向量。
 */
export class Vec2 extends ValueType {

    /**
     * 创建分量都为 1 的向量并返回。
     */
    static get ONE () {
        return new Vec2(1.0, 1.0);
    }

    /**
     * 创建零向量并返回。
     */
    static get ZERO () {
        return new Vec2(0.0, 0.0);
    }

    /**
     * 创建与 y 轴同向的单位向量并返回。
     */
    static get UP () {
        return new Vec2(0.0, 1.0);
    }

    /**
     * 创建与 x 轴同向的单位向量并返回。
     */
    static get RIGHT () {
        return new Vec2(1.0, 0.0);
    }

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param out 本方法将插值结果赋值给此参数
     * @param from 起始向量。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public static lerp (out: Vec2, from: Vec2, to: Vec2, ratio: number) {
        const x = from.x;
        const y = from.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
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
     * 构造与指定向量相等的向量。
     * @param other 相比较的向量。
     */
    constructor (other: Vec2);

    /**
     * 构造具有指定分量的向量。
     * @param [x=0] 指定的 x 分量。
     * @param [y=0] 指定的 y 分量。
     */
    constructor (x?: number, y?: number);

    constructor (x?: number | Vec2, y?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    /**
     * 克隆当前向量。
     */
    public clone () {
        return new Vec2(this.x, this.y);
    }

    /**
     * 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @returns `this`
     */
    public set (other: Vec2) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    /**
     * 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec2) {
        return other && this.x === other.x && this.y === other.y;
    }

    /**
     * 判断当前向量是否在误差范围 [-variance, variance] 内与指定向量相等。
     * @param other 相比较的向量。
     * @param variance 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public fuzzyEquals (other: Vec2, variance: number) {
        if (this.x - variance <= other.x && other.x <= this.x + variance) {
            if (this.y - variance <= other.y && other.y <= this.y + variance) {
                return true;
            }
        }
        return false;
    }

    /**
     * 返回当前向量的字符串表示。
     * @returns 当前向量的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec2, ratio: number) {
        this.x = this.x + (to.x - this.x) * ratio;
        this.y = this.y + (to.y - this.y) * ratio;
    }

    /**
     * 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive 每个分量都代表了对应分量允许的最小值。
     * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
     * @returns `this`
     */
    public clampf (minInclusive: Vec2, maxInclusive: Vec2) {
        this.x = clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = clamp(this.y, minInclusive.y, maxInclusive.y);
    }

    /**
     * 向量加法。将当前向量与指定向量的相加
     * @param other 指定的向量。
     */
    public add (rhs: Vec2) {
        this.x = this.x + rhs.x;
        this.y = this.y + rhs.y;
    }

    /**
     * 向量减法。将当前向量减去指定向量
     * @param other 减数向量。
     */
    public subtract (other: Vec2) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
    }

    /**
     * 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public multiply (scalar: number) {
        this.x = this.x * scalar;
        this.y = this.y * scalar;
    }

    /**
     * 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other 指定的向量。
     */
    public scale (other: Vec2) {
        this.x = this.x * other.x;
        this.y = this.y * other.y;
    }

    /**
     * 将当前向量的各个分量除以指定标量。相当于 `this.multiply(1 / scalar)`。
     * @param scalar 标量除数。
     */
    public divide (scalar: number) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
    }

    /**
     * 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
    }

    /**
     * 向量点乘。
     * @param other 指定的向量。
     * @returns 当前向量与指定向量点乘的结果。
     */
    public dot (other: Vec2) {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * 向量叉乘。
     * @param other 指定的向量。
     * @returns `out`
     */
    public cross (other: Vec2) {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * 计算向量的长度（模）。
     * @returns 向量的长度（模）。
     */
    public mag () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 计算向量长度（模）的平方。
     * @returns 向量长度（模）的平方。
     */
    public magSqr () {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * 将当前向量归一化。
     */
    public normalize () {
        vec2.normalize(this, this);
    }

    /**
     * 获取当前向量和指定向量之间的角度。
     * @param other 指定的向量。
     * @returns 当前向量和指定向量之间的角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
     */
    public angle (other: Vec2) {
        const magSqr1 = this.magSqr();
        const magSqr2 = other.magSqr();

        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn('Can\'t get angle between zero vector');
            return 0.0;
        }

        const dot = this.dot(other);
        let theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = clamp(theta, -1.0, 1.0);
        return Math.acos(theta);
    }

    /**
     * 获取当前向量和指定向量之间的有符号角度。
     * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。
     * @param other 指定的向量。
     * @returns 当前向量和指定向量之间的有符号角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
     */
    public signAngle (other: Vec2) {
        const angle = this.angle(other);
        return this.cross(other) < 0 ? -angle : angle;
    }


    /**
     * 将当前向量的旋转
     * @param radians 旋转角度（弧度制）。
     */
    public rotate (radians: number) {
        let x = this.x;
        let y = this.y;

        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
    }

    /**
     * 计算当前向量在指定向量上的投影向量。
     * @param other 指定的向量。
     */
    public project (other: Vec2) {
        let scalar = this.dot(other) / other.dot(other);
        this.x = other.x * scalar;
        this.y = other.y * scalar;
    }

    /**
     * 将当前向量视为 z 分量为 0、w 分量为 1 的四维向量，
     * 应用四维矩阵变换到当前矩阵
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        vec2.transformMat4(this, this, matrix);
    }
}

CCClass.fastDefine('cc.Vec2', Vec2, { x: 0, y: 0 });

cc.Vec2 = Vec2;

/**
 * 等价于 `new Vec2(other)`。
 * @param other 相比较的向量。
 * @returns `new Vec2(other)`
 * @deprecated
 */
export function v2 (other: Vec2): Vec2;

/**
 * 等价于 `new Vec2(x, y)`。
 * @param [x=0] 指定的 x 分量。
 * @param [y=0] 指定的 y 分量。
 * @returns `new Vec2(x, y)`
 * @deprecated
 */
export function v2 (x?: number, y?: number): Vec2;

export function v2 (x?: number | Vec2, y?: number) {
    return new Vec2(x as any, y);
}

cc.v2 = v2;
