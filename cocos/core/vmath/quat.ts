/**
 * @category core/math
 */

import { mat3 } from './mat3';
import { toDegree } from './utils';
import { vec3 } from './vec3';
import { vec4 } from './vec4';

let _x: number = 0.0;
let _y: number = 0.0;
let _z: number = 0.0;
let _w: number = 0.0;

/**
 * @zh 四元数
 */
// tslint:disable-next-line:class-name
export class quat {
    public static IDENTITY = Object.freeze(new quat());

    /**
     * @zh 创建新的实例
     */
    public static create (x = 0, y = 0, z = 0, w = 1) {
        return new quat(x, y, z, w);
    }

    /**
     * @zh 获得指定四元数的拷贝
     */
    public static clone (a: quat) {
        return new quat(a.x, a.y, a.z, a.w);
    }

    /**
     * @zh 复制目标四元数
     */
    public static copy<Out extends quat> (out: Out, a: quat) {
        return vec4.copy(out, a);
    }

    /**
     * @zh 设置四元数值
     */
    public static set<Out extends quat> (out: Out, x: number, y: number, z: number, w: number) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 将目标赋值为单位四元数
     */
    public static identity<Out extends quat> (out: Out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return out;
    }

    /**
     * @zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
     */
    public static rotationTo<Out extends quat> (out: Out, a: vec3, b: vec3) {
        const dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(v3_1, vec3.UNIT_X, a);
            if (vec3.magnitude(v3_1) < 0.000001) {
                vec3.cross(v3_1, vec3.UNIT_Y, a);
            }
            vec3.normalize(v3_1, v3_1);
            quat.fromAxisAngle(out, v3_1, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            out.w = 1;
            return out;
        } else {
            vec3.cross(v3_1, a, b);
            out.x = v3_1.x;
            out.y = v3_1.y;
            out.z = v3_1.z;
            out.w = 1 + dot;
            return quat.normalize(out, out);
        }
    }

    /**
     * @zh 获取四元数的旋转轴和旋转弧度
     * @param outAxis 旋转轴输出
     * @param q 源四元数
     * @return 旋转弧度
     */
    public static getAxisAngle (outAxis: vec3, q: quat) {
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
    public static multiply<Out extends quat> (out: Out, a: quat, b: quat) {
        _x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
        _y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
        _z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
        _w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        out.x = _x;
        out.y = _y;
        out.z = _z;
        out.w = _w;
        return out;
    }

    /**
     * @zh 四元数乘法
     */
    public static mul<Out extends quat> (out: Out, a: quat, b: quat) {
        return quat.multiply(out, a, b);
    }

    /**
     * @zh 四元数标量乘法
     */
    public static scale<Out extends quat> (out: Out, a: quat, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * @zh 四元数乘加：A + B * scale
     */
    public static scaleAndAdd<Out extends quat> (out: Out, a: quat, b: quat, scale: number) {
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
    public static rotateX<Out extends quat> (out: Out, a: quat, rad: number) {
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
    public static rotateY<Out extends quat> (out: Out, a: quat, rad: number) {
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
    public static rotateZ<Out extends quat> (out: Out, a: quat, rad: number) {
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
    public static rotateAround<Out extends quat> (out: Out, rot: quat, axis: vec3, rad: number) {
        // get inv-axis (local to rot)
        quat.invert(qt_1, rot);
        vec3.transformQuat(v3_1, axis, qt_1);
        // rotate by inv-axis
        quat.fromAxisAngle(qt_1, v3_1, rad);
        quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * @zh 绕本地空间下指定轴旋转四元数
     * @param axis 旋转轴
     * @param rad 旋转弧度
     */
    public static rotateAroundLocal<Out extends quat> (out: Out, rot: quat, axis: vec3, rad: number) {
        quat.fromAxisAngle(qt_1, axis, rad);
        quat.multiply(out, rot, qt_1);
        return out;
    }

    /**
     * @zh 根据 xyz 分量计算 w 分量，默认已归一化
     */
    public static calculateW<Out extends quat> (out: Out, a: quat) {
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
    public static dot (a: quat, b: quat) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * @zh 逐元素线性插值： A + t * (B - A)
     */
    public static lerp<Out extends quat> (out: Out, a: quat, b: quat, t: number) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        out.w = a.w + t * (b.w - a.w);
        return out;
    }

    /**
     * @zh 四元数球面插值
     */
    public static slerp<Out extends quat> (out: Out, a: quat, b: quat, t: number) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations

        let scale0 = 0;
        let scale1 = 0;

        // calc cosine
        let cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            b.x = -b.x;
            b.y = -b.y;
            b.z = -b.z;
            b.w = -b.w;
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
        out.x = scale0 * a.x + scale1 * b.x;
        out.y = scale0 * a.y + scale1 * b.y;
        out.z = scale0 * a.z + scale1 * b.z;
        out.w = scale0 * a.w + scale1 * b.w;

        return out;
    }

    /**
     * @zh 带两个控制点的四元数球面插值
     */
    public static sqlerp<Out extends quat> (out: Out, a: quat, b: quat, c: quat, d: quat, t: number) {
        quat.slerp(qt_1, a, d, t);
        quat.slerp(qt_2, b, c, t);
        quat.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
        return out;
    }

    /**
     * @zh 四元数求逆
     */
    public static invert<Out extends quat> (out: Out, a: quat) {
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
    public static conjugate<Out extends quat> (out: Out, a: quat) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 求四元数长度
     */
    public static magnitude (a: quat) {
        const { x, y, z, w } = a;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * @zh 求四元数长度
     */
    public static mag (a: quat) {
        return quat.magnitude(a);
    }

    /**
     * @zh 求四元数长度平方
     */
    public static squaredMagnitude (a: quat) {
        const { x, y, z, w } = a;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * @zh 求四元数长度平方
     */
    public static sqrMag (a: quat) {
        return quat.squaredMagnitude(a);
    }

    /**
     * @zh 归一化四元数
     */
    public static normalize<Out extends quat> (out: Out, a: quat) {
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
    public static fromAxes<Out extends quat> (out: Out, xAxis: vec3, yAxis: vec3, zAxis: vec3) {
        mat3.set(m3_1,
            xAxis.x, xAxis.y, xAxis.z,
            yAxis.x, yAxis.y, yAxis.z,
            zAxis.x, zAxis.y, zAxis.z,
        );
        return quat.normalize(out, quat.fromMat3(out, m3_1));
    }

    /**
     * @zh 根据视口的前方向和上方向计算四元数
     * @param view 视口面向的前方向，必须归一化
     * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
     */
    public static fromViewUp<Out extends quat> (out: Out, view: vec3, up?: vec3) {
        mat3.fromViewUp(m3_1, view, up);
        return quat.normalize(out, quat.fromMat3(out, m3_1));
    }

    /**
     * @zh 根据旋转轴和旋转弧度计算四元数
     */
    public static fromAxisAngle<Out extends quat> (out: Out, axis: vec3, rad: number) {
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
    public static fromMat3<Out extends quat> (out: Out, m: mat3) {
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
    public static fromEuler<Out extends quat> (out: Out, x: number, y: number, z: number) {
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
    public static toAxisX<Out extends vec3> (out: Out, q: quat) {
        const fy = 2.0 * q.y;
        const fz = 2.0 * q.z;
        out.x = 1.0 - fy * q.y - fz * q.z;
        out.y = fy * q.x + fz * q.w;
        out.z = fz * q.x + fy * q.w;
    }

    /**
     * @zh 返回定义此四元数的坐标系 Y 轴向量
     */
    public static toAxisY<Out extends vec3> (out: Out, q: quat) {
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
    public static toAxisZ<Out extends vec3> (out: Out, q: quat) {
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
    public static toEuler<Out extends vec3> (out: Out, q: quat) {
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
     * @zh 返回四元数的字符串表示
     */
    public static str (a: quat) {
        return `quat(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
    }

    /**
     * @zh 四元数转数组
     * @param ofs 数组内的起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, q: quat, ofs = 0) {
        out[ofs + 0] = q.x;
        out[ofs + 1] = q.y;
        out[ofs + 2] = q.z;
        out[ofs + 3] = q.w;

        return out;
    }

    /**
     * @zh 四元数等价判断
     */
    public static exactEquals (a: quat, b: quat) {
        return vec4.exactEquals(a, b);
    }

    /**
     * @zh 排除浮点数误差的四元数近似等价判断
     */
    public static equals (a: quat, b: quat) {
        return vec4.equals(a, b);
    }

    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor (x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

const qt_1 = quat.create();
const qt_2 = quat.create();
const v3_1 = vec3.create();
const m3_1 = mat3.create();
const halfToRad = 0.5 * Math.PI / 180.0;
