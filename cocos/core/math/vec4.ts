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
 * @category core/math
 */

import CCClass from '../data/class';
import { Mat4 } from './mat4';
import { IMat4Like, IQuatLike, IVec4Like } from './type-define';
import { clamp, EPSILON, random } from './utils';
import { ValueType } from '../value-types/value-type';

let _x: number = 0.0;
let _y: number = 0.0;
let _z: number = 0.0;
let _w: number = 0.0;

/**
 * 四维向量。
 */
export class Vec4 extends ValueType {

    public static ZERO = Object.freeze(new Vec4(0, 0, 0, 0));
    public static ONE = Object.freeze(new Vec4(1, 1, 1, 1));
    public static NEG_ONE = Object.freeze(new Vec4(-1, -1, -1, -1));

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone <Out extends IVec4Like> (a: Out) {
        return new Vec4(a.x, a.y, a.z, a.w);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set <Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add <Out extends IVec4Like> (out: Out, a: Out, b: Out) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        out.w = a.w + b.w;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract <Out extends IVec4Like> (out: Out, a: Out, b: Out) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        out.w = a.w - b.w;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply <Out extends IVec4Like> (out: Out, a: Out, b: Out) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        out.w = a.w * b.w;
        return out;
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        out.w = Math.ceil(a.w);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        out.w = Math.floor(a.w);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min <Out extends IVec4Like> (out: Out, a: Out, b: Out) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        out.w = Math.min(a.w, b.w);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max <Out extends IVec4Like> (out: Out, a: Out, b: Out) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        out.w = Math.max(a.w, b.w);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        out.w = Math.round(a.w);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static multiplyScalar <Out extends IVec4Like> (out: Out, a: Out, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd <Out extends IVec4Like> (out: Out, a: Out, b: Out, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        out.z = a.z + (b.z * scale);
        out.w = a.w + (b.w * scale);
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance <Out extends IVec4Like> (a: Out, b: Out) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance <Out extends IVec4Like> (a: Out, b: Out) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * @zh 求向量长度
     */
    public static len <Out extends IVec4Like> (a: Out) {
        _x = a.x;
        _y = a.y;
        _z = a.z;
        _w = a.w;
        return Math.sqrt(_x * _x + _y * _y + _z * _z + _w * _w);
    }

    /**
     * @zh 求向量长度平方
     */
    public static lengthSqr <Out extends IVec4Like> (a: Out) {
        _x = a.x;
        _y = a.y;
        _z = a.z;
        _w = a.w;
        return _x * _x + _y * _y + _z * _z + _w * _w;
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = -a.w;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static inverse <Out extends IVec4Like> (out: Out, a: Out) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        out.w = 1.0 / a.w;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static inverseSafe <Out extends IVec4Like> (out: Out, a: Out) {
        _x = a.x;
        _y = a.y;
        _z = a.z;
        _w = a.w;

        if (Math.abs(_x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / _x;
        }

        if (Math.abs(_y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / _y;
        }

        if (Math.abs(_z) < EPSILON) {
            out.z = 0;
        } else {
            out.z = 1.0 / _z;
        }

        if (Math.abs(_w) < EPSILON) {
            out.w = 0;
        } else {
            out.w = 1.0 / _w;
        }

        return out;
    }

    /**
     * @zh 归一化向量
     */
    public static normalize <Out extends IVec4Like> (out: Out, a: Out) {
        _x = a.x;
        _y = a.y;
        _z = a.z;
        _w = a.w;
        let len = _x * _x + _y * _y + _z * _z + _w * _w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = _x * len;
            out.y = _y * len;
            out.z = _z * len;
            out.w = _w * len;
        }
        return out;
    }

    /**
     * @zh 向量点积（数量积）
     */
    public static dot <Out extends IVec4Like> (a: Out, b: Out) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp <Out extends IVec4Like> (out: Out, a: Out, b: Out, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        out.w = a.w + t * (b.w - a.w);
        return out;
    }

    /**
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random <Out extends IVec4Like> (out: Out, scale?: number) {
        scale = scale || 1.0;

        const phi = random() * 2.0 * Math.PI;
        const cosTheta = random() * 2 - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        out.x = sinTheta * Math.cos(phi) * scale;
        out.y = sinTheta * Math.sin(phi) * scale;
        out.z = cosTheta * scale;
        out.w = 0;
        return out;
    }

    /**
     * @zh 向量矩阵乘法
     */
    public static transformMat4 <Out extends IVec4Like, MatLike extends IMat4Like> (out: Out, a: Out, m: MatLike) {
        _x = a.x;
        _y = a.y;
        _z = a.z;
        _w = a.w;
        out.x = m.m00 * _x + m.m04 * _y + m.m08 * _z + m.m12 * _w;
        out.y = m.m01 * _x + m.m05 * _y + m.m09 * _z + m.m13 * _w;
        out.z = m.m02 * _x + m.m06 * _y + m.m10 * _z + m.m14 * _w;
        out.w = m.m03 * _x + m.m07 * _y + m.m11 * _z + m.m15 * _w;
        return out;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike) {
        const { x, y, z } = a;

        _x = q.x;
        _y = q.y;
        _z = q.z;
        _w = q.w;

        // calculate quat * vec
        const ix = _w * x + _y * z - _z * y;
        const iy = _w * y + _z * x - _x * z;
        const iz = _w * z + _x * y - _y * x;
        const iw = -_x * x - _y * y - _z * z;

        // calculate result * inverse quat
        out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
        out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
        out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static array <Out extends IVec4Like> (out: IWritableArrayLike<number>, v: Out, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;
        out[ofs + 3] = v.w;
        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static strictEquals <Out extends IVec4Like> (a: Out, b: Out) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals <Out extends IVec4Like> (a: Out, b: Out, epsilon = EPSILON) {
        return (Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) &&
            Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) &&
            Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) &&
            Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w)));
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

    constructor (other: Vec4);

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

    public set (other: Vec4);
    public set (x?: number, y?: number, z?: number, w?: number);
    /**
     * 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @returns `this`
     */
    public set (x?: number | Vec4, y?: number, z?: number, w?: number) {
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
        return this;
    }

    /**
     * 判断当前向量是否在误差范围内与指定向量相等。
     * @param other 相比较的向量。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec4, epsilon = EPSILON) {
        return (Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) &&
            Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) &&
            Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z)) &&
            Math.abs(this.w - other.w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(other.w)));
    }

    public equals4f (x: number, y: number, z: number, w:number, epsilon = EPSILON) {
        return (Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) &&
            Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) &&
            Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z)) &&
            Math.abs(this.w - w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(w)));
    }

    /**
     * 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals (other: Vec4) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    public strictEquals4f (x: number, y: number, z: number, w:number) {
        return this.x === x && this.y === y && this.z === z && this.w === w;
    }

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec4, ratio: number) {
        _x = this.x;
        _y = this.y;
        _z = this.z;
        _w = this.w;
        this.x = _x + ratio * (to.x - _x);
        this.y = _y + ratio * (to.y - _y);
        this.z = _z + ratio * (to.z - _z);
        this.w = _w + ratio * (to.w - _w);
        return this;
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
        return this;
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
        return this;
    }

    public add4f (x:number, y:number, z:number, w:number) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.z = this.z + z;
        this.w = this.w + w;
        return this;
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
        return this;
    }

    public subtract4f (x:number, y:number, z:number, w:number) {
        this.x = this.x - x;
        this.y = this.y - y;
        this.z = this.z - z;
        this.w = this.w - w;
        return this;
    }

    /**
     * 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public multiplyScalar (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec4.multiply for vector * vector operation'); }
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
        this.w = this.w * scalar;
        return this;
    }

    /**
     * 向量乘法。将当前向量乘以指定向量
     * @param other 指定的向量。
     */
    public multiply (other: Vec4) {
        if (typeof other !== 'object') { console.warn('should use Vec4.scale for vector * scalar operation'); }
        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
        this.w = this.w * other.w;
        return this;
    }

    public multiply4f (x:number, y:number, z:number, w:number) {
        this.x = this.x * x;
        this.y = this.y * y;
        this.z = this.z * z;
        this.w = this.w * w;
        return this;
    }

    public divide (other: Vec4) {
        this.x = this.x / other.x;
        this.y = this.y / other.y;
        this.z = this.z / other.z;
        this.w = this.w / other.w;
        return this;
    }

    public divide4f (x:number, y:number, z:number, w:number) {
        this.x = this.x / x;
        this.y = this.y / y;
        this.z = this.z / z;
        this.w = this.w / w;
        return this;
    }

    /**
     * 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
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
        const { x: ax, y: ay, z: az } = this;
        const { x: bx, y: by, z: bz } = vector;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }

    /**
     * 计算向量的长度（模）。
     * @returns 向量的长度（模）。
     */
    public length () {
        _x = this.x;
        _y = this.y;
        _z = this.z;
        _w = this.w;
        return Math.sqrt(_x * _x + _y * _y + _z * _z + _w * _w);
    }

    /**
     * 计算向量长度（模）的平方。
     * @returns 向量长度（模）的平方。
     */
    public lengthSqr () {
        _x = this.x;
        _y = this.y;
        _z = this.z;
        _w = this.w;
        return _x * _x + _y * _y + _z * _z + _w * _w;
    }

    /**
     * 将当前向量归一化
     */
    public normalize () {
        _x = this.x;
        _y = this.y;
        _z = this.z;
        _w = this.w;
        let len = _x * _x + _y * _y + _z * _z + _w * _w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = _x * len;
            this.y = _y * len;
            this.z = _z * len;
            this.w = _w * len;
        }
        return this;
    }

    /**
     * 应用四维矩阵变换到当前矩阵
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        _x = this.x;
        _y = this.y;
        _z = this.z;
        _w = this.w;
        this.x = matrix.m00 * _x + matrix.m04 * _y + matrix.m08 * _z + matrix.m12 * _w;
        this.y = matrix.m01 * _x + matrix.m05 * _y + matrix.m09 * _z + matrix.m13 * _w;
        this.z = matrix.m02 * _x + matrix.m06 * _y + matrix.m10 * _z + matrix.m14 * _w;
        this.w = matrix.m03 * _x + matrix.m07 * _y + matrix.m11 * _z + matrix.m15 * _w;
        return this;
    }
}

CCClass.fastDefine('cc.Vec4', Vec4, { x: 0, y: 0, z: 0, w: 0 });
cc.Vec4 = Vec4;

export function v4 (other: Vec4): Vec4;
export function v4 (x?: number, y?: number, z?: number, w?: number): Vec4;

export function v4 (x?: number | Vec4, y?: number, z?: number, w?: number) {
    return new Vec4(x as any, y, z, w);
}

cc.v4 = v4;
