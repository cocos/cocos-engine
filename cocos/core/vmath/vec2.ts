/**
 * @category core/math
 */

import { mat3 } from './mat3';
import { mat4 } from './mat4';
import { EPSILON, random } from './utils';
import { vec3 } from './vec3';

/**
 * @zh 二维向量
 */
// tslint:disable-next-line:class-name
export class vec2 {
    public static ZERO = Object.freeze(new vec2(0, 0));
    public static ONE = Object.freeze(new vec2(1, 1));
    public static NEG_ONE = Object.freeze(new vec2(-1, -1));

    /**
     * @zh 创建新的实例
     */
    public static create (x = 0, y = 0) {
        return new vec2(x, y);
    }

    /**
     * @zh 将目标赋值为零向量
     */
    public static zero<Out extends vec2> (out: Out) {
        out.x = 0;
        out.y = 0;
        return out;
    }

    /**
     * @zh 获得指定向量的拷贝
     */
    public static clone (a: vec2) {
        return new vec2(a.x, a.y);
    }

    /**
     * @zh 复制目标向量
     */
    public static copy<Out extends vec2> (out: Out, a: vec2) {
        out.x = a.x;
        out.y = a.y;
        return out;
    }

    /**
     * @zh 设置向量值
     */
    public static set<Out extends vec2> (out: Out, x: number, y: number) {
        out.x = x;
        out.y = y;
        return out;
    }

    /**
     * @zh 逐元素向量加法
     */
    public static add<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static subtract<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }

    /**
     * @zh 逐元素向量减法
     */
    public static sub<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        return vec2.subtract(out, a, b);
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static multiply<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }

    /**
     * @zh 逐元素向量乘法
     */
    public static mul<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        return vec2.multiply(out, a, b);
    }

    /**
     * @zh 逐元素向量除法
     */
    public static divide<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }

    /**
     * @zh 逐元素向量除法
     */
    public static div<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        return vec2.divide(out, a, b);
    }

    /**
     * @zh 逐元素向量向上取整
     */
    public static ceil<Out extends vec2> (out: Out, a: vec2) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }

    /**
     * @zh 逐元素向量向下取整
     */
    public static floor<Out extends vec2> (out: Out, a: vec2) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }

    /**
     * @zh 逐元素向量最小值
     */
    public static min<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }

    /**
     * @zh 逐元素向量最大值
     */
    public static max<Out extends vec2> (out: Out, a: vec2, b: vec2) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }

    /**
     * @zh 逐元素向量四舍五入取整
     */
    public static round<Out extends vec2> (out: Out, a: vec2) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }

    /**
     * @zh 向量标量乘法
     */
    public static scale<Out extends vec2> (out: Out, a: vec2, b: number) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }

    /**
     * @zh 逐元素向量乘加: A + B * scale
     */
    public static scaleAndAdd<Out extends vec2> (out: Out, a: vec2, b: vec2, scale: number) {
        out.x = a.x + (b.x * scale);
        out.y = a.y + (b.y * scale);
        return out;
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static distance (a: vec2, b: vec2) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @zh 求两向量的欧氏距离
     */
    public static dist (a: vec2, b: vec2) {
        return vec2.distance(a, b);
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static squaredDistance (a: vec2, b: vec2) {
        const x = b.x - a.x;
        const y = b.y - a.y;
        return x * x + y * y;
    }

    /**
     * @zh 求两向量的欧氏距离平方
     */
    public static sqrDist (a: vec2, b: vec2) {
        return vec2.squaredDistance(a, b);
    }

    /**
     * @zh 求向量长度
     */
    public static magnitude (a: vec2) {
        const { x, y } = a;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * @zh 求向量长度
     */
    public static mag (a: vec2) {
        return vec2.magnitude(a);
    }

    /**
     * @zh 求向量长度平方
     */
    public static squaredMagnitude (a: vec2) {
        const { x, y } = a;
        return x * x + y * y;
    }

    /**
     * @zh 求向量长度平方
     */
    public static sqrMag (a: vec2) {
        return vec2.squaredMagnitude(a);
    }

    /**
     * @zh 逐元素向量取负
     */
    public static negate<Out extends vec2> (out: Out, a: vec2) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
     */
    public static inverse<Out extends vec2> (out: Out, a: vec2) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
    }

    /**
     * @zh 逐元素向量取倒数，接近 0 时返回 0
     */
    public static inverseSafe<Out extends vec2> (out: Out, a: vec2) {
        const { x, y } = a;

        if (Math.abs(x) < EPSILON) {
            out.x = 0;
        } else {
            out.x = 1.0 / x;
        }

        if (Math.abs(y) < EPSILON) {
            out.y = 0;
        } else {
            out.y = 1.0 / a.y;
        }

        return out;
    }

    /**
     * @zh 归一化向量
     */
    public static normalize<Out extends vec2> (out: Out, a: vec2) {
        const { x, y } = a;
        let len = x * x + y * y;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out.x = a.x * len;
            out.y = a.y * len;
        }
        return out;
    }

    /**
     * @zh 向量点积（数量积）
     */
    public static dot (a: vec2, b: vec2) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
     */
    public static cross<Out extends vec3> (out: Out, a: vec2, b: vec2) {
        out.x = out.y = 0;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    /**
     * @zh 逐元素向量线性插值： A + t * (B - A)
     */
    public static lerp<Out extends vec2> (out: Out, a: vec2, b: vec2, t: number) {
        const { x: ax, y: ay } = a;
        out.x = ax + t * (b.x - ax);
        out.y = ay + t * (b.y - ay);
        return out;
    }

    /**
     * @zh 生成一个在单位圆上均匀分布的随机向量
     * @param scale 生成的向量长度
     */
    public static random<Out extends vec2> (out: Out, scale?: number) {
        scale = scale || 1.0;
        const r = random() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
    }

    /**
     * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
     */
    public static transformMat3<Out extends vec2> (out: Out, a: vec2, m: mat3) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m03 * y + m.m06;
        out.y = m.m01 * x + m.m04 * y + m.m07;
        return out;
    }

    /**
     * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
     */
    public static transformMat4<Out extends vec2> (out: Out, a: vec2, m: mat4) {
        const { x, y } = a;
        out.x = m.m00 * x + m.m04 * y + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m13;
        return out;
    }

    /**
     * @zh 返回向量的字符串表示
     */
    public static str (a: vec2) {
        return `vec2(${a.x}, ${a.y})`;
    }

    /**
     * @zh 向量转数组
     * @param ofs 数组起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, v: vec2, ofs = 0) {
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        return out;
    }

    /**
     * @zh 向量等价判断
     */
    public static exactEquals (a: vec2, b: vec2) {
        return a.x === b.x && a.y === b.y;
    }

    /**
     * @zh 排除浮点数误差的向量近似等价判断
     */
    public static equals (a: vec2, b: vec2) {
        const { x: a0, y: a1 } = a;
        const { x: b0, y: b1 } = b;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)));
    }

    /**
     * @zh 求两向量夹角弧度
     */
    public static angle (a: vec2, b: vec2) {
        vec2.normalize(v2_1, a);
        vec2.normalize(v2_2, b);
        const cosine = vec2.dot(v2_1, v2_2);
        if (cosine > 1.0) {
            return 0;
        }
        if (cosine < -1.0) {
            return Math.PI;
        }
        return Math.acos(cosine);
    }

    public x: number;
    public y: number;

    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

const v2_1 = vec2.create();
const v2_2 = vec2.create();
