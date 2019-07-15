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
import { Mat3 } from './mat3';
import { Mat4 } from './mat4';
import { Quat } from './quat';
import { clamp, EPSILON, random } from './utils';
import { ValueType } from './value-type';

/**
 * 三维向量。
 */
export class Vec3 extends ValueType {

    public static UNIT_X = Object.freeze(new Vec3(1, 0, 0));
    public static UNIT_Y = Object.freeze(new Vec3(0, 1, 0));
    public static UNIT_Z = Object.freeze(new Vec3(0, 0, 1));
    public static ZERO = Object.freeze(new Vec3(0, 0, 0));
    public static ONE = Object.freeze(new Vec3(1, 1, 1));
    public static NEG_ONE = Object.freeze(new Vec3(-1, -1, -1));

    /**
     * 构造与指定向量相等的向量，或如果不指定的话，零向量。
     */
    public static create (v: Vec3): Vec3;

    /**
     * 构造具有指定分量的向量。
     */
    public static create (x?: number, y?: number, z?: number): Vec3;

    /**
     * @zh 创建新的实例
     */
    public static create (x?: number | Vec3, y?: number, z?: number) {
        if (typeof x === 'object') {
            return new Vec3(x.x, x.y, x.z);
        } else {
            return new Vec3(x, y, z);
        }
    }

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone (a: Vec3) {
        return new Vec3(a.x, a.y, a.z);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy (out: Vec3, a: Vec3) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set (out: Vec3, x: number, y: number, z: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add (out: Vec3, a: Vec3, b: Vec3) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract (out: Vec3, a: Vec3, b: Vec3) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static sub (out: Vec3, a: Vec3, b: Vec3) {
        return Vec3.subtract(out, a, b);
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply (out: Vec3, a: Vec3, b: Vec3) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static mul (out: Vec3, a: Vec3, b: Vec3) {
        return Vec3.multiply(out, a, b);
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide (out: Vec3, a: Vec3, b: Vec3) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static div (out: Vec3, a: Vec3, b: Vec3) {
        return Vec3.divide(out, a, b);
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil (out: Vec3, a: Vec3) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor (out: Vec3, a: Vec3) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min (out: Vec3, a: Vec3, b: Vec3) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max (out: Vec3, a: Vec3, b: Vec3) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round (out: Vec3, a: Vec3) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static scale (out: Vec3, a: Vec3, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd (out: Vec3, a: Vec3, b: Vec3, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: Vec3, b: Vec3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static dist (a: Vec3, b: Vec3) {
        return Vec3.distance(a, b);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: Vec3, b: Vec3) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static sqrDist (a: Vec3, b: Vec3) {
        return Vec3.squaredDistance(a, b);
    }

    /**
     * @zh 求向量长度
     */
    public static magnitude (a: Vec3) {
        const { x, y, z } = a;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求向量长度
     */
    public static mag (a: Vec3) {
        return Vec3.magnitude(a);
    }

    /**
     * @zh 求向量长度平方
     */
    public static squaredMagnitude (a: Vec3) {
        const { x, y, z } = a;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 求向量长度平方
     */
    public static sqrMag (a: Vec3) {
        return Vec3.squaredMagnitude(a);
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate (out: Vec3, a: Vec3) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static invert (out: Vec3, a: Vec3) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static invertSafe (out: Vec3, a: Vec3) {
        const { x, y, z } = a;

        if (Math.abs(x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / y;
        }

        if (Math.abs(z) < EPSILON) {
            out.z = 0;
        } else {
            out.z = 1.0 / z;
        }

        return out;
    }

    /**
     * @zh 归一化向量
     */
    public static normalize (out: Vec3, a: Vec3) {
        const { x, y, z } = a;

        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
            out.z = z * len;
        }
        return out;
    }

    /**
     * @zh 向量点积（数量积）
     */
    public static dot (a: Vec3, b: Vec3) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * @zh 向量叉积（向量积）
     */
    public static cross (out: Vec3, a: Vec3, b: Vec3) {
        const { x: ax, y: ay, z: az } = a;
        const { x: bx, y: by, z: bz } = b;

        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;
        return out;
    }

    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp (out: Vec3, a: Vec3, b: Vec3, t: number) {
        const { x: ax, y: ay, z: az } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        return out;
    }

    /**
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random (out: Vec3, scale?: number) {
        scale = scale || 1.0;

        const phi = random() * 2.0 * Math.PI;
        const cosTheta = random() * 2 - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);

        out.x = sinTheta * Math.cos(phi) * scale;
        out.y = sinTheta * Math.sin(phi) * scale;
        out.z = cosTheta * scale;
        return out;
    }

    /**
     * @zh 向量与四维矩阵乘法，默认向量第四位为 1。
     */
    public static transformMat4 (out: Vec3, a: Vec3, m: Mat4) {
        const { x, y, z } = a;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
        rhw = rhw ? 1 / rhw : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) * rhw;
        return out;
    }

    /**
     * @zh 向量与四维矩阵乘法，默认向量第四位为 0。
     */
    public static transformMat4Normal (out: Vec3, a: Vec3, m: Mat4) {
        const { x, y, z } = a;
        let rhw = m.m03 * x + m.m07 * y + m.m11 * z;
        rhw = rhw ? 1 / rhw : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z) * rhw;
        return out;
    }

    /**
     * @zh 向量与三维矩阵乘法
     */
    public static transformMat3 (out: Vec3, a: Vec3, m: Mat3) {
        const { x, y, z } = a;
        out.x = x * m.m00 + y * m.m03 + z * m.m06;
        out.y = x * m.m01 + y * m.m04 + z * m.m07;
        out.z = x * m.m02 + y * m.m05 + z * m.m08;
        return out;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat (out: Vec3, a: Vec3, q: Quat) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations

        const { x, y, z } = a;
        const { x: qx, y: qy, z: qz, w: qw } = q;

        // calculate quat * vec
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        out.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        out.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        out.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return out;
    }

    /**
     * @zh 绕 X 轴旋转向量指定弧度
     * @param v 待旋转向量
     * @param o 旋转中心
     * @param a 旋转弧度
     */
    public static rotateX (out: Vec3, v: Vec3, o: Vec3, a: number) {
        // Translate point to the origin
        const px = v.x - o.x;
        const py = v.y - o.y;
        const pz = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = px;
        const ry = py * cos - pz * sin;
        const rz = py * sin + pz * cos;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @zh 绕 Y 轴旋转向量指定弧度
     * @param v 待旋转向量
     * @param o 旋转中心
     * @param a 旋转弧度
     */
    public static rotateY (out: Vec3, v: Vec3, o: Vec3, a: number) {
        // Translate point to the origin
        const px = v.x - o.x;
        const py = v.y - o.y;
        const pz = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = pz * sin + px * cos;
        const ry = py;
        const rz = pz * cos - px * sin;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @zh 绕 Z 轴旋转向量指定弧度
     * @param v 待旋转向量
     * @param o 旋转中心
     * @param a 旋转弧度
     */
    public static rotateZ (out: Vec3, v: Vec3, o: Vec3, a: number) {
        // Translate point to the origin
        const px = v.x - o.x;
        const py = v.y - o.y;
        const pz = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = px * cos - py * sin;
        const ry = px * sin + py * cos;
        const rz = pz;

        // translate to correct position
        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;

        return out;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, v: Vec3, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;

        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static exactEquals (a: Vec3, b: Vec3) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: Vec3, b: Vec3, epsilon = EPSILON) {
        const { x: a0, y: a1, z: a2 } = a;
        const { x: b0, y: b1, z: b2 } = b;
        return (
            Math.abs(a0 - b0) <=
            epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <=
            epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <=
            epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2))
        );
    }

    /**
     * @zh 求两向量夹角弧度
     */
    public static angle (a: Vec3, b: Vec3) {
        Vec3.normalize(v3_1, a);
        Vec3.normalize(v3_2, b);
        const cosine = Vec3.dot(v3_1, v3_2);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    /**
     * @zh 计算向量在指定平面上的投影
     * @param a 待投影向量
     * @param n 指定平面的法线
     */
    public static projectOnPlane (out: Vec3, a: Vec3, n: Vec3) {
        return Vec3.subtract(out, a, Vec3.project(out, a, n));
    }

    /**
     * @zh 计算向量在指定向量上的投影
     * @param a 待投影向量
     * @param n 目标向量
     */
    public static project (out: Vec3, a: Vec3, b: Vec3) {
        const sqrLen = Vec3.squaredMagnitude(b);
        if (sqrLen < 0.000001) {
            return Vec3.set(out, 0, 0, 0);
        } else {
            return Vec3.scale(out, b, Vec3.dot(a, b) / sqrLen);
        }
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

    constructor (x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 克隆当前向量。
     */
    public clone () {
        return new Vec3(this.x, this.y, this.z);
    }

    /**
     * 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @returns `this`
     */
    public set (other: Vec3) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }

    /**
     * 判断当前向量是否在误差范围内与指定向量相等。
     * @param other 相比较的向量。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec3, epsilon?: number) {
        return Vec3.equals(this, other, epsilon);
    }

    /**
     * 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public exactEquals (other: Vec3) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    /**
     * 返回当前向量的字符串表示。
     * @returns 当前向量的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }

    /**
     * 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec3, ratio: number) {
        Vec3.lerp(this, this, to, ratio);
    }

    /**
     * 向量加法。将当前向量与指定向量的相加
     * @param other 指定的向量。
     */
    public add (other: Vec3) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        this.z = this.z + other.z;
    }

    /**
     * 向量减法。将当前向量减去指定向量的结果。
     * @param other 减数向量。
     */
    public subtract (other: Vec3) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        this.z = this.z - other.z;
    }

    /**
     * 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public scale (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec3.multiply for vector * vector operation'); }
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
    }

    /**
     * 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other 指定的向量。
     */
    public multiply (other: Vec3) {
        if (typeof other !== 'object') { console.warn('should use Vec3.scale for vector * scalar operation'); }
        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
    }

    /**
     * 将当前向量的各个分量除以指定标量。相当于 `this.scale(1 / scalar)`。
     * @param scalar 标量除数。
     */
    public divide (scalar: number) {
        this.x = this.x / scalar;
        this.y = this.y / scalar;
        this.z = this.z / scalar;
    }

    /**
     * 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }

    /**
     * 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive 每个分量都代表了对应分量允许的最小值。
     * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
     * @returns `this`
     */
    public clampf (minInclusive: Vec3, maxInclusive: Vec3) {
        this.x = clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = clamp(this.y, minInclusive.y, maxInclusive.y);
        this.z = clamp(this.z, minInclusive.z, maxInclusive.z);
    }

    /**
     * 向量点乘。
     * @param other 指定的向量。
     * @returns 当前向量与指定向量点乘的结果。
     */
    public dot (other: Vec3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * 向量叉乘。将当前向量左叉乘指定向量
     * @param other 指定的向量。
     */
    public cross (other: Vec3) {
        Vec3.cross(this, this, other);
    }

    /**
     * 计算向量的长度（模）。
     * @returns 向量的长度（模）。
     */
    public mag () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * 计算向量长度（模）的平方。
     * @returns 向量长度（模）的平方。
     */
    public magSqr () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * 将当前向量归一化
     */
    public normalize () {
        Vec3.normalize(this, this);
    }

    /**
     * 将当前向量视为 w 分量为 1 的四维向量，
     * 应用四维矩阵变换到当前矩阵
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        Vec3.transformMat4(this, this, matrix);
    }
}

const v3_1 = Vec3.create();
const v3_2 = Vec3.create();

CCClass.fastDefine('cc.Vec3', Vec3, { x: 0, y: 0, z: 0 });
cc.Vec3 = Vec3;
cc.v3 = Vec3.create;
