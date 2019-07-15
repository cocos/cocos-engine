/**
 * @category core/math
 */

import { mat3 } from './mat3';
import { mat4 } from './mat4';
import { quat } from './quat';
import { EPSILON, random } from './utils';

/**
 * @zh 三维向量
 */
// tslint:disable-next-line:class-name
export class vec3 {
    public static UNIT_X = Object.freeze(new vec3(1, 0, 0));
    public static UNIT_Y = Object.freeze(new vec3(0, 1, 0));
    public static UNIT_Z = Object.freeze(new vec3(0, 0, 1));
    public static ZERO = Object.freeze(new vec3(0, 0, 0));
    public static ONE = Object.freeze(new vec3(1, 1, 1));
    public static NEG_ONE = Object.freeze(new vec3(-1, -1, -1));

    /**
     * @zh 创建新的实例
     */
    public static create (x = 0, y = 0, z = 0) {
        console.warn('Obsolete Vmath API');
        return new vec3(x, y, z);
    }

    /**
     * @zh 将目标赋值为零向量
     */
    public static zero<Out extends vec3> (out: Out) {
        console.warn('Obsolete Vmath API');
        out.x = 0;
        out.y = 0;
        out.z = 0;
        return out;
    }

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone (a: vec3) {
        console.warn('Obsolete Vmath API');
        return new vec3(a.x, a.y, a.z);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set<Out extends vec3> (out: Out, x: number, y: number, z: number) {
        console.warn('Obsolete Vmath API');
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static sub<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.subtract(out, a, b);
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static mul<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.multiply(out, a, b);
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static div<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.divide(out, a, b);
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static scale<Out extends vec3> (out: Out, a: vec3, b: number) {
        console.warn('Obsolete Vmath API');
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd<Out extends vec3> (out: Out, a: vec3, b: vec3, scale: number) {
        console.warn('Obsolete Vmath API');
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        out.z = a.z + b.z * scale;
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static dist (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.distance(a, b);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static sqrDist (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.squaredDistance(a, b);
    }

    /**
     * @zh 求向量长度
     */
    public static magnitude (a: vec3) {
        console.warn('Obsolete Vmath API');
        const { x, y, z } = a;
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * @zh 求向量长度
     */
    public static mag (a: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.magnitude(a);
    }

    /**
     * @zh 求向量长度平方
     */
    public static squaredMagnitude (a: vec3) {
        console.warn('Obsolete Vmath API');
        const { x, y, z } = a;
        return x * x + y * y + z * z;
    }

    /**
     * @zh 求向量长度平方
     */
    public static sqrMag (a: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.squaredMagnitude(a);
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static invert<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static invertSafe<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
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
    public static normalize<Out extends vec3> (out: Out, a: vec3) {
        console.warn('Obsolete Vmath API');
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
    public static dot (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /**
     * @zh 向量叉积（向量积）
     */
    public static cross<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
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
    public static lerp<Out extends vec3> (out: Out, a: vec3, b: vec3, t: number) {
        console.warn('Obsolete Vmath API');
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        return out;
    }

    /**
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random<Out extends vec3> (out: Out, scale?: number) {
        console.warn('Obsolete Vmath API');
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
    public static transformMat4<Out extends vec3> (out: Out, a: vec3, m: mat4) {
        console.warn('Obsolete Vmath API');
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
    public static transformMat4Normal<Out extends vec3> (out: Out, a: vec3, m: mat4) {
        console.warn('Obsolete Vmath API');
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
    public static transformMat3<Out extends vec3> (out: Out, a: vec3, m: mat3) {
        console.warn('Obsolete Vmath API');
        const { x, y, z } = a;
        out.x = x * m.m00 + y * m.m03 + z * m.m06;
        out.y = x * m.m01 + y * m.m04 + z * m.m07;
        out.z = x * m.m02 + y * m.m05 + z * m.m08;
        return out;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat<Out extends vec3> (out: Out, a: vec3, q: quat) {
        console.warn('Obsolete Vmath API');
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

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
     * @zh 绕 X 轴旋转向量指定弧度
     * @param v 待旋转向量
     * @param o 旋转中心
     * @param a 旋转弧度
     */
    public static rotateX<Out extends vec3> (out: Out, v: vec3, o: vec3, a: number) {
        console.warn('Obsolete Vmath API');
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
    public static rotateY<Out extends vec3> (out: Out, v: vec3, o: vec3, a: number) {
        console.warn('Obsolete Vmath API');
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
    public static rotateZ<Out extends vec3> (out: Out, v: vec3, o: vec3, a: number) {
        console.warn('Obsolete Vmath API');
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
     * @zh 返回向量的字符串表示
     */
    public static str (a: vec3) {
        console.warn('Obsolete Vmath API');
        return `vec3(${a.x}, ${a.y}, ${a.z})`;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, v: vec3, ofs = 0) {
        console.warn('Obsolete Vmath API');
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;

        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static exactEquals (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: vec3, b: vec3, epsilon = EPSILON) {
        console.warn('Obsolete Vmath API');
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
    public static angle (a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        vec3.normalize(v3_1, a);
        vec3.normalize(v3_2, b);
        const cosine = vec3.dot(v3_1, v3_2);
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
    public static projectOnPlane<Out extends vec3> (out: Out, a: vec3, n: vec3) {
        console.warn('Obsolete Vmath API');
        return vec3.subtract(out, a, vec3.project(out, a, n));
    }

    /**
     * @zh 计算向量在指定向量上的投影
     * @param a 待投影向量
     * @param n 目标向量
     */
    public static project<Out extends vec3> (out: Out, a: vec3, b: vec3) {
        console.warn('Obsolete Vmath API');
        const sqrLen = vec3.squaredMagnitude(b);
        if (sqrLen < 0.000001) {
            return vec3.set(out, 0, 0, 0);
        } else {
            return vec3.scale(out, b, vec3.dot(a, b) / sqrLen);
        }
    }

    public x: number;
    public y: number;
    public z: number;

    constructor (x = 0, y = 0, z = 0) {
        console.warn('Obsolete Vmath API');
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const v3_1 = vec3.create();
const v3_2 = vec3.create();
