/**
 * @category core/math
 */

import { mat4 } from './mat4';
import { quat } from './quat';
import { EPSILON, random } from './utils';

/**
 * @zh 四维向量
 */
// tslint:disable-next-line:class-name
export class vec4 {
    public static ZERO = Object.freeze(new vec4(0, 0, 0, 0));
    public static ONE = Object.freeze(new vec4(1, 1, 1, 1));
    public static NEG_ONE = Object.freeze(new vec4(-1, -1, -1, -1));

    /**
     * @zh 创建新的实例
     */
    public static create (x = 0, y = 0, z = 0, w = 1) {
        console.warn('Obsolete Vmath API');
        return new vec4(x, y, z, w);
    }

    /**
     * @zh 将目标赋值为零向量
     */
    public static zero<Out extends vec4> (out: Out) {
        console.warn('Obsolete Vmath API');
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 0;
        return out;
    }

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone (a: vec4) {
        console.warn('Obsolete Vmath API');
        return new vec4(a.x, a.y, a.z, a.w);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set<Out extends vec4> (out: Out, x: number, y: number, z: number, w: number) {
        console.warn('Obsolete Vmath API');
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        out.w = a.w + b.w;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        out.w = a.w - b.w;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static sub<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.subtract(out, a, b);
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        out.w = a.w * b.w;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static mul<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.multiply(out, a, b);
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        out.w = a.w / b.w;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static div<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.divide(out, a, b);
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        out.w = Math.ceil(a.w);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        out.w = Math.floor(a.w);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        out.w = Math.min(a.w, b.w);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max<Out extends vec4> (out: Out, a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        out.w = Math.max(a.w, b.w);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        out.w = Math.round(a.w);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static scale<Out extends vec4> (out: Out, a: vec4, b: number) {
        console.warn('Obsolete Vmath API');
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        out.w = a.w * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd<Out extends vec4> (out: Out, a: vec4, b: vec4, scale: number) {
        console.warn('Obsolete Vmath API');
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        out.z = a.z + (b.z * scale);
        out.w = a.w + (b.w * scale);
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static dist (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.distance(a, b);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        const x = b.x - a.x;
        const y = b.y - a.y;
        const z = b.z - a.z;
        const w = b.w - a.w;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static sqrDist (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.squaredDistance(a, b);
    }

    /**
     * @zh 求向量长度
     */
    public static magnitude (a: vec4) {
        console.warn('Obsolete Vmath API');
        const { x, y, z, w } = a;
        return Math.sqrt(x * x + y * y + z * z + w * w);
    }

    /**
     * @zh 求向量长度
     */
    public static mag (a: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.magnitude(a);
    }

    /**
     * @zh 求向量长度平方
     */
    public static squaredMagnitude (a: vec4) {
        console.warn('Obsolete Vmath API');
        const { x, y, z, w } = a;
        return x * x + y * y + z * z + w * w;
    }

    /**
     * @zh 求向量长度平方
     */
    public static sqrMag (a: vec4) {
        console.warn('Obsolete Vmath API');
        return vec4.squaredMagnitude(a);
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = -a.w;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static inverse<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        out.w = 1.0 / a.w;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static inverseSafe<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
        const { x, y, z, w } = a;

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

        if (Math.abs(w) < EPSILON) {
            out.w = 0;
        } else {
            out.w = 1.0 / w;
        }

        return out;
    }

    /**
     * @zh 归一化向量
     */
    public static normalize<Out extends vec4> (out: Out, a: vec4) {
        console.warn('Obsolete Vmath API');
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
     * @zh 向量点积（数量积）
     */
    public static dot (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp<Out extends vec4> (out: Out, a: vec4, b: vec4, t: number) {
        console.warn('Obsolete Vmath API');
        const { x: ax, y: ay, z: az, w: aw } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        out.z = az + t * (b.z - az);
        out.w = aw + t * (b.w - aw);
        return out;
    }

    /**
     * @zh 生成一个在单位球体上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random<Out extends vec4> (out: Out, scale?: number) {
        console.warn('Obsolete Vmath API');
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
    public static transformMat4<Out extends vec4> (out: Out, a: vec4, m: mat4) {
        console.warn('Obsolete Vmath API');
        const { x, y, z, w } = a;
        out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12 * w;
        out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13 * w;
        out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14 * w;
        out.w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15 * w;
        return out;
    }

    /**
     * @zh 向量四元数乘法
     */
    public static transformQuat<Out extends vec4> (out: Out, a: vec4, q: quat) {
        console.warn('Obsolete Vmath API');
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
        out.w = a.w;
        return out;
    }

    /**
     * @zh 返回向量的字符串表示
     */
    public static str (a: vec4) {
        console.warn('Obsolete Vmath API');
        return `vec4(${a.x}, ${a.y}, ${a.z}, ${a.w})`;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, v: vec4, ofs = 0) {
        console.warn('Obsolete Vmath API');
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        out[ofs + 2] = v.z;
        out[ofs + 3] = v.w;
        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static exactEquals (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: vec4, b: vec4) {
        console.warn('Obsolete Vmath API');
        const { x: a0, y: a1, z: a2, w: a3 } = a;
        const { x: b0, y: b1, z: b2, w: b3 } = b;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
    }

    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor (x = 0, y = 0, z = 0, w = 1) {
        console.warn('Obsolete Vmath API');
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
