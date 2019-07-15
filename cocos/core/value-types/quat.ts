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
import { Mat3 } from './Mat3';
import { EPSILON, toDegree } from './utils';
import { ValueType } from './value-type';
import { Vec3 } from './vec3';

/**
 * 四元数。
 */
export class Quat extends ValueType {

    public static IDENTITY = Object.freeze(new Quat());

    /**
     * 构造与指定四元数相等的四元数。
     * @param other 相比较的四元数。
     */
    public static create (other: Quat): Quat;

    /**
     * 构造具有指定分量的四元数。
     * @param x 指定的 x 分量。
     * @param y 指定的 y 分量。
     * @param z 指定的 z 分量。
     * @param w 指定的 w 分量。
     */
    public static create (x?: number, y?: number, z?: number, w?: number): Quat;

    /**
     * @zh 创建新的实例
     */
    public static create (x?: number | Quat, y?: number, z?: number, w?: number) {
        if (typeof x === 'object') {
            return new Quat(x.x, x.y, x.z, x.w);
        } else {
            return new Quat(x, y, z, w);
        }
    }

    /**
     * @zh 获得指定四元数的拷贝
     */
    public static clone (a: Quat) {
        return new Quat(a.x, a.y, a.z, a.w);
    }

    /**
     * @zh 复制目标四元数
     */
    public static copy (out: Quat, a: Quat) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 设置四元数值
     */
    public static set (out: Quat, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 将目标赋值为单位四元数
     */
    public static identity (out: Quat) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return out;
    }

    /**
     * @zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
     */
    public static rotationTo (out: Quat, a: Vec3, b: Vec3) {
        const dot = Vec3.dot(a, b);
        if (dot < -0.999999) {
            Vec3.cross(v3_1, Vec3.UNIT_X, a);
            if (Vec3.magnitude(v3_1) < 0.000001) {
                Vec3.cross(v3_1, Vec3.UNIT_Y, a);
            }
            Vec3.normalize(v3_1, v3_1);
            Quat.fromAxisAngle(out, v3_1, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;
            return out;
        } else {
            Vec3.cross(v3_1, a, b);
            out.x = v3_1.x;
            out.y = v3_1.y;
            out.z = v3_1.z;
            out.w = 1 + dot;
            return Quat.normalize(out, out);
        }
    }

    /**
     * @zh 获取四元数的旋转轴和旋转弧度
     * @param outAxis 旋转轴输出
     * @param q 源四元数
     * @return 旋转弧度
     */
    public static getAxisAngle (outAxis: Vec3, q: Quat) {
        const rad = Math.acos(q.w) * 2.0;
        const s = Math.sin(rad / 2.0);
        if (s !== 0.0) {
            outAxis.x = q.x / s;
            outAxis.y = q.y / s;
            outAxis.z = q.z / s;
        } else {
            // If s is zero, return any axis (no rotation - axis does not matter)
            outAxis.x = 1;
            outAxis.y = 0;
            outAxis.z = 0;
        }
        return rad;
    }

    /**
     * @zh 四元数乘法
     */
    public static multiply (out: Quat, a: Quat, b: Quat) {
        const { x: ax, y: ay, z: az, w: aw } = a;
        const { x: bx, y: by, z: bz, w: bw } = b;

        out.x = ax * bw + aw * bx + ay * bz - az * by;
        out.y = ay * bw + aw * by + az * bx - ax * bz;
        out.z = az * bw + aw * bz + ax * by - ay * bx;
        out.w = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /**
     * @zh 四元数乘法
     */
    public static mul (out: Quat, a: Quat, b: Quat) {
        return Quat.multiply(out, a, b);
    }

    /**
     * @zh 四元数标量乘法
     */
    public static scale (out: Quat, a: Quat, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * @zh 四元数乘加：A + B * scale
     */
    public static scaleAndAdd (out: Quat, a: Quat, b: Quat, scale: number) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        out.w = a.w + b.w * scale;
        return out;
    }

    /**
     * @zh 绕 X 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateX (out: Quat, a: Quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const bx = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw + aw * bx;
        out.y = ay * bw + az * bx;
        out.z = az * bw - ay * bx;
        out.w = aw * bw - ax * bx;
        return out;
    }

    /**
     * @zh 绕 Y 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateY (out: Quat, a: Quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const by = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw - az * by;
        out.y = ay * bw + aw * by;
        out.z = az * bw + ax * by;
        out.w = aw * bw - ay * by;
        return out;
    }

    /**
     * @zh 绕 Z 轴旋转指定四元数
     * @param rad 旋转弧度
     */
    public static rotateZ (out: Quat, a: Quat, rad: number) {
        rad *= 0.5;

        const { x: ax, y: ay, z: az, w: aw } = a;
        const bz = Math.sin(rad);
        const bw = Math.cos(rad);

        out.x = ax * bw + ay * bz;
        out.y = ay * bw - ax * bz;
        out.z = az * bw + aw * bz;
        out.w = aw * bw - az * bz;
        return out;
    }

    /**
     * @zh 绕世界空间下指定轴旋转四元数
     * @param axis 旋转轴
     * @param rad 旋转弧度
     */
    public static rotateAround (out: Quat, rot: Quat, axis: Vec3, rad: number) {
        // get inv-axis (local to rot)
        Quat.invert(qt_1, rot);
        Vec3.transformQuat(v3_1, axis, qt_1);
        // rotate by inv-axis
        Quat.fromAxisAngle(qt_1, v3_1, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * @zh 绕本地空间下指定轴旋转四元数
     * @param axis 旋转轴
     * @param rad 旋转弧度
     */
    public static rotateAroundLocal (out: Quat, rot: Quat, axis: Vec3, rad: number) {
        Quat.fromAxisAngle(qt_1, axis, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * @zh 根据 xyz 分量计算 w 分量，默认已归一化
     */
    public static calculateW (out: Quat, a: Quat) {
        const { x, y, z } = a;

        out.x = x;
        out.y = y;
        out.z = z;
        out.w = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
        return out;
    }

    /**
     * @zh 四元数点积（数量积）
     */
    public static dot (a: Quat, b: Quat) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * @zh 逐元素线性插值： A + t * (B - A)
     */
    public static lerp (out: Quat, a: Quat, b: Quat, t: number) {
        const { x: ax, y: ay, z: az, w: aw } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        out.w = aw + t * (b.w - aw);
        return out;
    }

    /**
     * @zh 四元数球面插值
     */
    public static slerp (out: Quat, a: Quat, b: Quat, t: number) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        const { x: ax, y: ay, z: az, w: aw } = a;
        let { x: bx, y: by, z: bz, w: bw } = b;

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        // calculate coefficients
        if ((1.0 - cosom) > 0.000001) {
            // standard case (slerp)
            const omega = Math.acos(cosom);
            const sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out.x = scale0 * ax + scale1 * bx;
        out.y = scale0 * ay + scale1 * by;
        out.z = scale0 * az + scale1 * bz;
        out.w = scale0 * aw + scale1 * bw;

        return out;
    }

    /**
     * @zh 带两个控制点的四元数球面插值
     */
    public static sqlerp (out: Quat, a: Quat, b: Quat, c: Quat, d: Quat, t: number) {
        Quat.slerp(qt_1, a, d, t);
        Quat.slerp(qt_2, b, c, t);
        Quat.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
        return out;
    }

    /**
     * @zh 四元数求逆
     */
    public static invert (out: Quat, a: Quat) {
        const { x: a0, y: a1, z: a2, w: a3 } = a;
        const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        const invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out.x = -a0 * invDot;
        out.y = -a1 * invDot;
        out.z = -a2 * invDot;
        out.w = a3 * invDot;
        return out;
    }

    /**
     * @zh 求共轭四元数，对单位四元数与求逆等价，但更高效
     */
    public static conjugate (out: Quat, a: Quat) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 求四元数长度
     */
    public static magnitude (a: Quat) {
        const { x, y, z, w } = a;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * @zh 求四元数长度
     */
    public static mag (a: Quat) {
        return Quat.magnitude(a);
    }

    /**
     * @zh 求四元数长度平方
     */
    public static squaredMagnitude (a: Quat) {
        const { x, y, z, w } = a;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * @zh 求四元数长度平方
     */
    public static sqrMag (a: Quat) {
        return Quat.squaredMagnitude(a);
    }

    /**
     * @zh 归一化四元数
     */
    public static normalize (out: Quat, a: Quat) {
        const { x, y, z, w } = a;
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = x * len;
            out.y = y * len;
            out.z = z * len;
            out.w = w * len;
        }
        return out;
    }

    /**
     * @zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
     */
    public static fromAxes (out: Quat, xAxis: Vec3, yAxis: Vec3, zAxis: Vec3) {
        Mat3.set(m3_1,
            xAxis.x, xAxis.y, xAxis.z,
            yAxis.x, yAxis.y, yAxis.z,
            zAxis.x, zAxis.y, zAxis.z,
        );
        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
    }

    /**
     * @zh 根据视口的前方向和上方向计算四元数
     * @param view 视口面向的前方向，必须归一化
     * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
     */
    public static fromViewUp (out: Quat, view: Vec3, up?: Vec3) {
        Mat3.fromViewUp(m3_1, view, up);
        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
    }

    /**
     * @zh 根据旋转轴和旋转弧度计算四元数
     */
    public static fromAxisAngle (out: Quat, axis: Vec3, rad: number) {
        rad = rad * 0.5;
        const s = Math.sin(rad);
        out.x = s * axis.x;
        out.y = s * axis.y;
        out.z = s * axis.z;
        out.w = Math.cos(rad);
        return out;
    }

    /**
     * @zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
     */
    public static fromMat3 (out: Quat, m: Mat3) {
        const {
            m00: m00, m03: m01, m06: m02,
            m01: m10, m04: m11, m07: m12,
            m02: m20, m05: m21, m08: m22,
        } = m;

        const trace = m00 + m11 + m22;

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);

            out.w = 0.25 / s;
            out.x = (m21 - m12) * s;
            out.y = (m02 - m20) * s;
            out.z = (m10 - m01) * s;

        } else if ((m00 > m11) && (m00 > m22)) {
            const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

            out.w = (m21 - m12) / s;
            out.x = 0.25 * s;
            out.y = (m01 + m10) / s;
            out.z = (m02 + m20) / s;

        } else if (m11 > m22) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

            out.w = (m02 - m20) / s;
            out.x = (m01 + m10) / s;
            out.y = 0.25 * s;
            out.z = (m12 + m21) / s;

        } else {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

            out.w = (m10 - m01) / s;
            out.x = (m02 + m20) / s;
            out.y = (m12 + m21) / s;
            out.z = 0.25 * s;
        }

        return out;
    }

    /**
     * @zh 根据欧拉角信息计算四元数
     */
    public static fromEuler (out: Quat, x: number, y: number, z: number) {
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;

        const sx = Math.sin(x);
        const cx = Math.cos(x);
        const sy = Math.sin(y);
        const cy = Math.cos(y);
        const sz = Math.sin(z);
        const cz = Math.cos(z);

        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz - sx * sy * sz;

        return out;
    }

    /**
     * @zh 返回定义此四元数的坐标系 X 轴向量
     */
    public static toAxisX (out: Vec3, q: Quat) {
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = 1.0 - fy * q.y - fz * q.z;
        out.y = fy * q.x + fz * q.w;
        out.z = fz * q.x + fy * q.w;
    }

    /**
     * @zh 返回定义此四元数的坐标系 Y 轴向量
     */
    public static toAxisY (out: Vec3, q: Quat) {
        const fx = 2.0 * q.x;
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = fy * q.x - fz * q.w;
        out.y = 1.0 - fx * q.x - fz * q.z;
        out.z = fz * q.y + fx * q.w;
    }

    /**
     * @zh 返回定义此四元数的坐标系 Z 轴向量
     */
    public static toAxisZ (out: Vec3, q: Quat) {
        const fx = 2.0 * q.x;
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = fz * q.x - fy * q.w;
        out.y = fz * q.y - fx * q.w;
        out.z = 1.0 - fx * q.x - fy * q.y;
    }

    /**
     * @zh 根据四元数计算欧拉角，返回角度在 [-180, 180] 区间内
     */
    public static toEuler (out: Vec3, q: Quat) {
        const { x, y, z, w } = q;
        let heading: number = NaN;
        let attitude: number = NaN;
        let bank: number = NaN;
        const test = x * y + z * w;
        if (test > 0.499999) { // singularity at north pole
            heading = 2 * Math.atan2(x, w);
            attitude = Math.PI / 2;
            bank = 0;
        }
        if (test < -0.499999) { // singularity at south pole
            heading = -2 * Math.atan2(x, w);
            attitude = - Math.PI / 2;
            bank = 0;
        }
        if (isNaN(heading)) {
            const sqx = x * x;
            const sqy = y * y;
            const sqz = z * z;
            heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz); // heading
            attitude = Math.asin(2 * test); // attitude
            bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz); // bank
        }

        // ranged [-180, 180]
        out.y = toDegree(heading);
        out.z = toDegree(attitude);
        out.x = toDegree(bank);

        return out;
    }

    /**
     * @zh 四元数转数组
     * @param ofs 数组内的起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, q: Quat, ofs = 0) {
        out[ofs + 0] = q.x;
        out[ofs + 1] = q.y;
        out[ofs + 2] = q.z;
        out[ofs + 3] = q.w;

        return out;
    }

    /**
     * @zh 四元数等价判断
     */
    public static exactEquals (a: Quat, b: Quat) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * @zh 排除浮点数误差的四元数近似等价判断
     */
    public static equals (a: Quat, b: Quat, epsilon = EPSILON) {
        const { x: a0, y: a1, z: a2, w: a3 } = a;
        const { x: b0, y: b1, z: b2, w: b3 } = b;
        return (Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= epsilon * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
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

    constructor (x = 0, y = 0, z = 0, w = 1) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * 克隆当前四元数。
     */
    public clone () {
        return new Quat(this.x, this.y, this.z, this.w);
    }

    /**
     * 设置当前四元数使其与指定四元数相等。
     * @param other 相比较的四元数。
     * @returns `this`
     */
    public set (other: Quat) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    }

    /**
     * 判断当前向量是否在误差范围内与指定向量相等。
     * @param other 相比较的向量。
     * @param epsilon 允许的误差，应为非负数。
     * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
     */
    public equals (other: Quat, epsilon?: number) {
        return Quat.equals(this, other, epsilon);
    }

    /**
     * 判断当前四元数是否与指定四元数相等。
     * @param other 相比较的四元数。
     * @returns 两四元数的各分量都相等时返回 `true`；否则返回 `false`。
     */
    public exactEquals (other: Quat) {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    }

    /**
     * 将当前四元数转化为欧拉角（x-y-z）并赋值给出口向量。
     * @param out 出口向量，当未指定时将创建为新的向量。
     */
    public getEulerAngles (out: Vec3) {
        Quat.toEuler(out, this);
    }

    /**
     * 根据指定的插值比率，从当前四元数到目标四元数之间做插值。
     * @param to 目标四元数。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Quat, ratio: number) {
        Quat.slerp(this, this, to, ratio);
    }
}

const qt_1 = Quat.create();
const qt_2 = Quat.create();
const v3_1 = Vec3.create();
const m3_1 = Mat3.create();
const halfToRad = 0.5 * Math.PI / 180.0;

CCClass.fastDefine('cc.Quat', Quat, { x: 0, y: 0, z: 0, w: 1 });
cc.Quat = Quat;
cc.quat = Quat.create;
