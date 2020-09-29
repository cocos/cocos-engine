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
 * @category core/math
 */

import CCClass from '../data/class';
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { IMat3Like, IMat4Like, IVec2Like } from './type-define';
import { clamp } from './utils';
import { EPSILON, random } from './utils';
import { Vec3 } from './vec3';
import { legacyCC } from '../global-exports';

/**
 * 二维向量。
 */
export class Vec2 extends ValueType {

    public static ZERO = Object.freeze(new Vec2(0, 0));
    public static ONE = Object.freeze(new Vec2(1, 1));
    public static NEG_ONE = Object.freeze(new Vec2(-1, -1));
    public static UNIT_X = Object.freeze(new Vec2(1, 0));
    public static UNIT_Y = Object.freeze(new Vec2(0, 1));

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone <Out extends IVec2Like> (a: Out) {
        return new Vec2(a.x, a.y);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = a.x;
        out.y = a.y;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set <Out extends IVec2Like> (out: Out, x: number, y: number) {
        out.x = x;
        out.y = y;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max <Out extends IVec2Like> (out: Out, a: Out, b: Out) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static multiplyScalar <Out extends IVec2Like> (out: Out, a: Out, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd <Out extends IVec2Like> (out: Out, a: Out, b: Out, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance <Out extends IVec2Like> (a: Out, b: Out) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance <Out extends IVec2Like> (a: Out, b: Out) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return x * x + y * y;
    }

    /**
     * @zh 求向量长度
     */
    public static len <Out extends IVec2Like> (a: Out) {
        const x = a.x;
        const y = a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @zh 求向量长度平方
     */
    public static lengthSqr <Out extends IVec2Like> (a: Out) {
        const x = a.x;
        const y = a.y;
        return x * x + y * y;
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static inverse <Out extends IVec2Like> (out: Out, a: Out) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static inverseSafe <Out extends IVec2Like> (out: Out, a: Out) {
        const x = a.x;
        const y = a.y;

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

        return out;
    }

    /**
     * @zh 归一化向量
     */
    public static normalize <Out extends IVec2Like, Vec2Like extends IVec2Like> (out: Out, a: Vec2Like) {
        const x = a.x;
        const y = a.y;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
        }
        return out;
    }

    /**
     * @zh 向量点积（数量积）
     */
    public static dot <Out extends IVec2Like> (a: Out, b: Out) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
     */
    public static cross <Out extends IVec2Like> (out: Vec3, a: Out, b: Out) {
        out.x = out.y = 0;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp <Out extends IVec2Like> (out: Out, a: Out, b: Out, t: number) {
        const x = a.x;
        const y = a.y;
        out.x = x + t * (b.x - x);
        out.y = y + t * (b.y - y);
        return out;
    }

    /**
     * @zh 生成一个在单位圆上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random <Out extends IVec2Like> (out: Out, scale?: number) {
        scale = scale || 1.0;
        const r = random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    /**
     * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
     */
    public static transformMat3 <Out extends IVec2Like, MatLike extends IMat3Like> (out: Out, a: Out, m: IMat3Like) {
        const x = a.x;
        const y = a.y;
        out.x = m.m00 * x + m.m03 * y + m.m06;
        out.y = m.m01 * x + m.m04 * y + m.m07;
        return out;
    }

    /**
     * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
     */
    public static transformMat4 <Out extends IVec2Like, MatLike extends IMat4Like> (out: Out, a: Out, m: IMat4Like) {
        const x = a.x;
        const y = a.y;
        out.x = m.m00 * x + m.m04 * y + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m13;
        return out;
    }

    /**
     * @zh 返回向量的字符串表示
     */
    public static str <Out extends IVec2Like> (a: Out) {
        return `Vec2(${a.x}, ${a.y})`;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec2Like, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        return out;
    }

    /**
     * @zh 数组转向量
     * @param ofs 数组起始偏移量
     */
    public static fromArray <Out extends IVec2Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static strictEquals <Out extends IVec2Like> (a: Out, b: Out) {
        return a.x === b.x && a.y === b.y;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals <Out extends IVec2Like> (a: Out, b: Out,  epsilon = EPSILON) {
        return (
            Math.abs(a.x - b.x) <=
            epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) &&
            Math.abs(a.y - b.y) <=
            epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y))
        );
    }

    /**
     * @zh 求两向量夹角弧度
     */
    public static angle <Out extends IVec2Like> (a: Out, b: Out) {
        Vec2.normalize(v2_1, a);
        Vec2.normalize(v2_2, b);
        const cosine = Vec2.dot(v2_1, v2_2);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    /**
     * x 分量。
     */
    public declare x: number;

    /**
     * y 分量。
     */
    public declare y: number;

    constructor (other: Vec2);

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
     * @zh 克隆当前向量。
     */
    public clone () {
        return new Vec2(this.x, this.y);
    }

    /**
     * @zh 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @return `this`
     */
    public set (other: Vec2);

    /**
     * @zh 设置当前向量的具体分量值。
     * @param x 要设置的 x 分量的值
     * @param y 要设置的 y 分量的值
     * @return `this`
     */
    public set (x?: number, y?: number);

    public set (x?: number | Vec2, y?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
        return this;
    }

    /**
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other 相比较的向量。
     * @param epsilon 允许的误差，应为非负数。
     * @return 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec2, epsilon = EPSILON) {
        return (
            Math.abs(this.x - other.x) <=
            epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) &&
            Math.abs(this.y - other.y) <=
            epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y))
        );
    }

    /**
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x 相比较的向量的 x 分量。
     * @param y 相比较的向量的 y 分量。
     * @param epsilon 允许的误差，应为非负数。
     * @return 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals2f (x: number, y: number, epsilon = EPSILON) {
        return (
            Math.abs(this.x - x) <=
            epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) &&
            Math.abs(this.y - y) <=
            epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y))
        );
    }

    /**
     * @zh 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @return 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals (other: Vec2) {
        return other && this.x === other.x && this.y === other.y;
    }

    /**
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x 指定向量的 x 分量。
     * @param y 指定向量的 y 分量。
     * @return 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals2f (x: number, y: number) {
        return this.x === x && this.y === y;
    }

    /**
     * @zh 返回当前向量的字符串表示。
     * @returns 当前向量的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    /**
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec2, ratio: number) {
        const x = this.x;
        const y = this.y;
        this.x = x + ratio * (to.x - x);
        this.y = y + ratio * (to.y - y);
        return this;
    }

    /**
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive 每个分量都代表了对应分量允许的最小值。
     * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
     * @return `this`
     */
    public clampf (minInclusive: Vec2, maxInclusive: Vec2) {
        this.x = clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = clamp(this.y, minInclusive.y, maxInclusive.y);
        return this;
    }

    /**
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other 指定的向量。
     */
    public add (other: Vec2) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        return this;
    }

    /**
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     */
    public add2f (x: number, y: number) {
        this.x = this.x + x;
        this.y = this.y + y;
        return this;
    }

    /**
     * @zh 向量减法。将当前向量减去指定向量
     * @param other 减数向量。
     */
    public subtract (other: Vec2) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        return this;
    }

    /**
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     */
    public subtract2f (x: number, y: number) {
        this.x = this.x - x;
        this.y = this.y - y;
        return this;
    }

    /**
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public multiplyScalar (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec2.multiply for vector * vector operation'); }
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
    }

    /**
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other 指定的向量。
     */
    public multiply (other: Vec2) {
        if (typeof other !== 'object') { console.warn('should use Vec2.scale for vector * scalar operation'); }
        this.x = this.x * other.x;
        this.y = this.y * other.y;
        return this;
    }

    /**
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     */
    public multiply2f (x: number, y: number) {
        this.x = this.x * x;
        this.y = this.y * y;
        return this;
    }

    /**
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other 指定的向量
     */
    public divide (other: Vec2) {
        this.x = this.x / other.x;
        this.y = this.y / other.y;
        return this;
    }

    /**
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     */
    public divide2f (x: number, y: number) {
        this.x = this.x / x;
        this.y = this.y / y;
        return this;
    }

    /**
     * @zh 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * @zh 向量点乘。
     * @param other 指定的向量。
     * @return 当前向量与指定向量点乘的结果。
     */
    public dot (other: Vec2) {
        return this.x * other.x + this.y * other.y;
    }

    /**
     * @zh 向量叉乘。
     * @param other 指定的向量。
     * @return `out`
     */
    public cross (other: Vec2) {
        return this.x * other.y - this.y * other.x;
    }

    /**
     * 计算向量的长度（模）。
     * @return 向量的长度（模）。
     */
    public length () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 计算向量长度（模）的平方。
     * @return 向量长度（模）的平方。
     */
    public lengthSqr () {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * @zh 将当前向量归一化。
     */
    public normalize () {
        const x = this.x;
        const y = this.y;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = this.x * len;
            this.y = this.y * len;
        }
        return this;
    }

    /**
     * @zh 获取当前向量和指定向量之间的角度。
     * @param other 指定的向量。
     * @return 当前向量和指定向量之间的角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
     */
    public angle (other: Vec2) {
        const magSqr1 = this.lengthSqr();
        const magSqr2 = other.lengthSqr();

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
     * @zh 获取当前向量和指定向量之间的有符号角度。<br/>
     * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
     * @param other 指定的向量。
     * @return 当前向量和指定向量之间的有符号角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
     */
    public signAngle (other: Vec2) {
        const angle = this.angle(other);
        return this.cross(other) < 0 ? -angle : angle;
    }

    /**
     * @zh 将当前向量的旋转
     * @param radians 旋转角度（弧度制）。
     */
    public rotate (radians: number) {
        const x = this.x;
        const y = this.y;

        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
    }

    /**
     * @zh 计算当前向量在指定向量上的投影向量。
     * @param other 指定的向量。
     */
    public project (other: Vec2) {
        const scalar = this.dot(other) / other.dot(other);
        this.x = other.x * scalar;
        this.y = other.y * scalar;
        return this;
    }

    /**
     * @zh 将当前向量视为 z 分量为 0、w 分量为 1 的四维向量，<br/>
     * 应用四维矩阵变换到当前矩阵<br/>
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        const x = this.x;
        const y = this.y;
        this.x = matrix.m00 * x + matrix.m04 * y + matrix.m12;
        this.y = matrix.m01 * x + matrix.m05 * y + matrix.m13;
        return this;
    }
}

const v2_1 = new Vec2();
const v2_2 = new Vec2();

CCClass.fastDefine('cc.Vec2', Vec2, { x: 0, y: 0 });
legacyCC.Vec2 = Vec2;

export function v2 (other: Vec2): Vec2;
export function v2 (x?: number, y?: number): Vec2;

export function v2 (x?: number | Vec2, y?: number) {
    return new Vec2(x as any, y);
}

legacyCC.v2 = v2;
