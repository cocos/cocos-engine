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
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { IMat3Like, IMat4Like, IQuatLike, IVec3Like } from './type-define';
import { clamp, EPSILON, random } from './utils';
import { legacyCC } from '../global-exports';

/**
 * 三维向量。
 */
export class Vec3 extends ValueType {

    public static UNIT_X = Object.freeze(new Vec3(1, 0, 0));
    public static UNIT_Y = Object.freeze(new Vec3(0, 1, 0));
    public static UNIT_Z = Object.freeze(new Vec3(0, 0, 1));
    public static RIGHT = Object.freeze(new Vec3(1, 0, 0));
    public static UP = Object.freeze(new Vec3(0, 1, 0));
    public static FORWARD = Object.freeze(new Vec3(0, 0, -1)); // we use -z for view-dir
    public static ZERO = Object.freeze(new Vec3(0, 0, 0));
    public static ONE = Object.freeze(new Vec3(1, 1, 1));
    public static NEG_ONE = Object.freeze(new Vec3(-1, -1, -1));

    /**
     * @zh 将目标赋值为零向量
     */
    public static zero<Out extends IVec3Like> (out: Out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        return out;
    }

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone <Out extends IVec3Like> (a: Out) {
        return new Vec3(a.x, a.y, a.z);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy<Out extends IVec3Like, Vec3Like extends IVec3Like> (out: Out, a: Vec3Like) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set<Out extends IVec3Like> (out: Out, x: number, y: number, z: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    /**
     * @zh 逐元素向量乘法 (分量积)
     */
    public static multiply<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static multiplyScalar<Out extends IVec3Like, Vec3Like extends IVec3Like > (out: Out, a: Vec3Like, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: IVec3Like, b: IVec3Like) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: IVec3Like, b: IVec3Like) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 求向量长度
     */
    public static len (a: IVec3Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求向量长度平方
     */
    public static lengthSqr (a: IVec3Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static invert<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static invertSafe<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;

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
    public static normalize<Out extends IVec3Like> (out: Out, a: IVec3Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;

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
    public static dot <Out extends IVec3Like> (a: Out, b: IVec3Like) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * @zh 向量叉积（向量积）
     */
    public static cross<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
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
    public static lerp<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        return out;
    }

    /**
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random<Out extends IVec3Like> (out: Out, scale?: number) {
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
    public static transformMat4 <Out extends IVec3Like> (out: Out, a: IVec3Like, m: IMat4Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
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
    public static transformMat4Normal<Out extends IVec3Like> (out: Out, a: IVec3Like, m: IMat4Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
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
    public static transformMat3<Out extends IVec3Like> (out: Out, a: IVec3Like, m: IMat3Like) {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        out.x = x * m.m00 + y * m.m03 + z * m.m06;
        out.y = x * m.m01 + y * m.m04 + z * m.m07;
        out.z = x * m.m02 + y * m.m05 + z * m.m08;
        return out;
    }

    /**
     * @zh 向量仿射变换
     */
    public static transformAffine<Out extends IVec3Like> (out: Out, v: IVec3Like, m: IMat4Like) {
        const x = v.x;
        const y = v.y;
        const z = v.z;
        out.x = m.m00 * x + m.m01 * y + m.m02 * z + m.m03;
        out.y = m.m04 * x + m.m05 * y + m.m06 * z + m.m07;
        out.x = m.m08 * x + m.m09 * y + m.m10 * z + m.m11;
        return out;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat<Out extends IVec3Like> (out: Out, a: IVec3Like, q: IQuatLike) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations

        // calculate quat * vec
        const ix = q.w * a.x + q.y * a.z - q.z * a.y;
        const iy = q.w * a.y + q.z * a.x - q.x * a.z;
        const iz = q.w * a.z + q.x * a.y - q.y * a.x;
        const iw = -q.x * a.x - q.y * a.y - q.z * a.z;

        // calculate result * inverse quat
        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
    }

    /**
     * @zh 以缩放 -> 旋转 -> 平移顺序变换向量
     */
    public static transformRTS<Out extends IVec3Like> (out: Out, a: IVec3Like, r: IQuatLike, t: IVec3Like, s: IVec3Like) {
        const x = a.x * s.x;
        const y = a.y * s.y;
        const z = a.z * s.z;
        const ix = r.w * x + r.y * z - r.z * y;
        const iy = r.w * y + r.z * x - r.x * z;
        const iz = r.w * z + r.x * y - r.y * x;
        const iw = -r.x * x - r.y * y - r.z * z;
        out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
        out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
        out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
        return out;
    }

    /**
     * @zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
     */
    public static transformInverseRTS<Out extends IVec3Like> (out: Out, a: IVec3Like, r: IQuatLike, t: IVec3Like, s: IVec3Like) {
        const x = a.x - t.x;
        const y = a.y - t.y;
        const z = a.z - t.z;
        const ix = r.w * x - r.y * z + r.z * y;
        const iy = r.w * y - r.z * x + r.x * z;
        const iz = r.w * z - r.x * y + r.y * x;
        const iw = r.x * x + r.y * y + r.z * z;
        out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
        out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
        out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
        return out;
    }

    /**
     * @zh 绕 X 轴旋转向量指定弧度
     * @param v 待旋转向量
     * @param o 旋转中心
     * @param a 旋转弧度
     */
    public static rotateX<Out extends IVec3Like> (out: Out, v: IVec3Like, o: IVec3Like, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = x;
        const ry = y * cos - z * sin;
        const rz = y * sin + z * cos;

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
    public static rotateY<Out extends IVec3Like> (out: Out, v: IVec3Like, o: IVec3Like, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = z * sin + x * cos;
        const ry = y;
        const rz = z * cos - x * sin;

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
    public static rotateZ<Out extends IVec3Like> (out: Out, v: IVec3Like, o: IVec3Like, a: number) {
        // Translate point to the origin
        const x = v.x - o.x;
        const y = v.y - o.y;
        const z = v.z - o.z;

        // perform rotation
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        const rz = z;

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
    public static toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec3Like, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;

        return out;
    }

    /**
     * @zh 数组转向量
     * @param ofs 数组起始偏移量
     */
    public static fromArray <Out extends IVec3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0) {
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        out.z = arr[ofs + 2];
        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static strictEquals (a: IVec3Like, b: IVec3Like) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: IVec3Like, b: IVec3Like, epsilon = EPSILON) {
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
    public static angle (a: IVec3Like, b: IVec3Like) {
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
    public static projectOnPlane<Out extends IVec3Like> (out: Out, a: IVec3Like, n: IVec3Like) {
        return Vec3.subtract(out, a, Vec3.project(out, a, n));
    }

    /**
     * @zh 计算向量在指定向量上的投影
     * @param a 待投影向量
     * @param n 目标向量
     */
    public static project<Out extends IVec3Like> (out: Out, a: IVec3Like, b: IVec3Like) {
        const sqrLen = Vec3.lengthSqr(b);
        if (sqrLen < 0.000001) {
            return Vec3.set(out, 0, 0, 0);
        } else {
            return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
        }
    }

    /**
     * x 分量。
     */
    public declare x: number;

    /**
     * y 分量。
     */
    public declare y: number;

    /**
     * z 分量。
     */
    public declare z: number;

    constructor (v: Vec3);

    constructor (x?: number, y?: number, z?: number);

    constructor (x?: number | Vec3, y?: number, z?: number) {
        super();
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    }

    /**
     * @zh 克隆当前向量。
     */
    public clone () {
        return new Vec3(this.x, this.y, this.z);
    }

    /**
     * @zh 设置当前向量使其与指定向量相等。
     * @param other 相比较的向量。
     * @returns `this`
     */
    public set (other: Vec3);

    /**
     * @zh 设置当前向量的具体分量值。
     * @param x 要设置的 x 分量的值
     * @param y 要设置的 y 分量的值
     * @param z 要设置的 z 分量的值
     * @returns `this`
     */
    public set (x?: number, y?: number, z?: number);

    public set (x?: number | Vec3, y?: number, z?: number) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        return this;
    }

    /**
     * @zh 判断当前向量是否在误差范围内与指定向量相等。
     * @param other 相比较的向量。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals (other: Vec3, epsilon = EPSILON) {
        return (
            Math.abs(this.x - other.x) <=
            epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) &&
            Math.abs(this.y - other.y) <=
            epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) &&
            Math.abs(this.z - other.z) <=
            epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z))
        );
    }

    /**
     * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
     * @param x 相比较的向量的 x 分量。
     * @param y 相比较的向量的 y 分量。
     * @param z 相比较的向量的 z 分量。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals3f (x: number, y: number, z: number, epsilon = EPSILON) {
        return (
            Math.abs(this.x - x) <=
            epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) &&
            Math.abs(this.y - y) <=
            epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) &&
            Math.abs(this.z - z) <=
            epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z))
        );
    }

    /**
     * @zh 判断当前向量是否与指定向量相等。
     * @param other 相比较的向量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals (other: Vec3) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    /**
     * @zh 判断当前向量是否与指定分量的向量相等。
     * @param x 指定向量的 x 分量。
     * @param y 指定向量的 y 分量。
     * @param z 指定向量的 z 分量。
     * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
     */
    public strictEquals3f (x: number, y: number, z: number) {
        return this.x === x && this.y === y && this.z === z;
    }

    /**
     * @zh 返回当前向量的字符串表示。
     * @returns 当前向量的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }

    /**
     * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
     * @param to 目标向量。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Vec3, ratio: number) {
        this.x = this.x + ratio * (to.x - this.x);
        this.y = this.y + ratio * (to.y - this.y);
        this.z = this.z + ratio * (to.z - this.z);
        return this;
    }

    /**
     * @zh 向量加法。将当前向量与指定向量的相加
     * @param other 指定的向量。
     */
    public add (other: Vec3) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        this.z = this.z + other.z;
        return this;
    }

    /**
     * @zh 向量加法。将当前向量与指定分量的向量相加
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     * @param z 指定的向量的 z 分量。
     */
    public add3f (x: number, y: number, z: number) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.z = this.z + z;
        return this;
    }

    /**
     * @zh 向量减法。将当前向量减去指定向量的结果。
     * @param other 减数向量。
     */
    public subtract (other: Vec3) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        this.z = this.z - other.z;
        return this;
    }

    /**
     * @zh 向量减法。将当前向量减去指定分量的向量
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     * @param z 指定的向量的 z 分量。
     */
    public subtract3f (x: number, y: number, z: number) {
        this.x = this.x - x;
        this.y = this.y - y;
        this.z = this.z - z;
        return this;
    }

    /**
     * @zh 向量数乘。将当前向量数乘指定标量
     * @param scalar 标量乘数。
     */
    public multiplyScalar (scalar: number) {
        if (typeof scalar === 'object') { console.warn('should use Vec3.multiply for vector * vector operation'); }
        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
        return this;
    }

    /**
     * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
     * @param other 指定的向量。
     */
    public multiply (other: Vec3) {
        if (typeof other !== 'object') { console.warn('should use Vec3.scale for vector * scalar operation'); }
        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
        return this;
    }

    /**
     * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     * @param z 指定的向量的 z 分量。
     */
    public multiply3f (x: number, y: number, z: number) {
        this.x = this.x * x;
        this.y = this.y * y;
        this.z = this.z * z;
        return this;
    }

    /**
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param other 指定的向量
     */
    public divide (other: Vec3) {
        this.x = this.x / other.x;
        this.y = this.y / other.y;
        this.z = this.z / other.z;
        return this;
    }

    /**
     * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
     * @param x 指定的向量的 x 分量。
     * @param y 指定的向量的 y 分量。
     * @param z 指定的向量的 z 分量。
     */
    public divide3f (x: number, y: number, z: number) {
        this.x = this.x / x;
        this.y = this.y / y;
        this.z = this.z / z;
        return this;
    }

    /**
     * @zh 将当前向量的各个分量取反
     */
    public negative () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    /**
     * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
     * @param minInclusive 每个分量都代表了对应分量允许的最小值。
     * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
     * @returns `this`
     */
    public clampf (minInclusive: Vec3, maxInclusive: Vec3) {
        this.x = clamp(this.x, minInclusive.x, maxInclusive.x);
        this.y = clamp(this.y, minInclusive.y, maxInclusive.y);
        this.z = clamp(this.z, minInclusive.z, maxInclusive.z);
        return this;
    }

    /**
     * @zh 向量点乘。
     * @param other 指定的向量。
     * @returns 当前向量与指定向量点乘的结果。
     */
    public dot (other: Vec3) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    /**
     * @zh 向量叉乘。将当前向量左叉乘指定向量
     * @param other 指定的向量。
     */
    public cross (other: Vec3) {
        const { x: ax, y: ay, z: az } = this;
        const { x: bx, y: by, z: bz } = other;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    }

    /**
     * @zh 计算向量的长度（模）。
     * @returns 向量的长度（模）。
     */
    public length () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * @zh 计算向量长度（模）的平方。
     * @returns 向量长度（模）的平方。
     */
    public lengthSqr () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * @zh 将当前向量归一化
     */
    public normalize () {
        const x = this.x;
        const y = this.y;
        const z = this.z;

        let len = x * x + y * y + z * z;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            this.x = x * len;
            this.y = y * len;
            this.z = z * len;
        }
        return this;
    }

    /**
     * @zh 将当前向量视为 w 分量为 1 的四维向量，应用四维矩阵变换到当前矩阵
     * @param matrix 变换矩阵。
     */
    public transformMat4 (matrix: Mat4) {
        const x = this.x;
        const y = this.y;
        const z = this.z;
        let rhw = matrix.m03 * x + matrix.m07 * y + matrix.m11 * z + matrix.m15;
        rhw = rhw ? 1 / rhw : 1;
        this.x = (matrix.m00 * x + matrix.m04 * y + matrix.m08 * z + matrix.m12) * rhw;
        this.y = (matrix.m01 * x + matrix.m05 * y + matrix.m09 * z + matrix.m13) * rhw;
        this.z = (matrix.m02 * x + matrix.m06 * y + matrix.m10 * z + matrix.m14) * rhw;
        return this;
    }
}

const v3_1 = new Vec3();
const v3_2 = new Vec3();

CCClass.fastDefine('cc.Vec3', Vec3, { x: 0, y: 0, z: 0 });
legacyCC.Vec3 = Vec3;

export function v3 (other: Vec3): Vec3;
export function v3 (x?: number, y?: number, z?: number): Vec3;

export function v3 (x?: number | Vec3, y?: number, z?: number) {
    return new Vec3(x as any, y, z);
}

legacyCC.v3 = v3;
