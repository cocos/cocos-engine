/**
 * @category core/math
 */

import { EPSILON } from './utils';

/**
 * @zh RGBA 格式的颜色，每个通道取值范围 [0, 1]
 */
// tslint:disable:one-variable-per-declaration
// tslint:disable-next-line:class-name
export class color4 {

    /**
     * @zh 创建新的实例
     */
    public static create (r = 1, g = 1, b = 1, a = 1) {
        console.warn('Obsolete Vmath API');
        return new color4(r, g, b, a);
    }

    /**
     * @zh 获得指定颜色的拷贝
     */
    public static clone (a: color4) {
        console.warn('Obsolete Vmath API');
        return new color4(a.r, a.g, a.b, a.a);
    }

    /**
     * @zh 复制目标颜色
     */
    public static copy<Out extends color4> (out: Out, a: color4) {
        console.warn('Obsolete Vmath API');
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
    }

    /**
     * @zh 设置颜色值
     */
    public static set<Out extends color4> (out: Out, r: number, g: number, b: number, a: number) {
        console.warn('Obsolete Vmath API');
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * @zh 根据指定整型数据设置颜色
     */
    public static fromHex<Out extends color4> (out: Out, hex: number) {
        console.warn('Obsolete Vmath API');
        const r = ((hex >> 24)) / 255.0;
        const g = ((hex >> 16) & 0xff) / 255.0;
        const b = ((hex >> 8) & 0xff) / 255.0;
        const a = ((hex) & 0xff) / 255.0;

        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * @zh 逐通道颜色加法
     */
    public static add<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色减法
     */
    public static subtract<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色减法
     */
    public static sub<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        return color4.subtract(out, a, b);
    }

    /**
     * @zh 逐通道颜色乘法
     */
    public static multiply<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色乘法
     */
    public static mul<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        return color4.multiply(out, a, b);
    }

    /**
     * @zh 逐通道颜色除法
     */
    public static divide<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色除法
     */
    public static div<Out extends color4> (out: Out, a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        return color4.divide(out, a, b);
    }

    /**
     * @zh 全通道统一缩放颜色
     */
    public static scale<Out extends color4> (out: Out, a: color4, b: number) {
        console.warn('Obsolete Vmath API');
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
    }

    /**
     * @zh 逐通道颜色线性插值：A + t * (B - A)
     */
    public static lerp<Out extends color4> (out: Out, a: color4, b: color4, t: number) {
        console.warn('Obsolete Vmath API');
        const ar = a.r, ag = a.g, ab = a.b, aa = a.a;
        out.r = ar + t * (b.r - ar);
        out.g = ag + t * (b.g - ag);
        out.b = ab + t * (b.b - ab);
        out.a = aa + t * (b.a - aa);
        return out;
    }

    /**
     * @zh 返回颜色的字符串表示
     */
    public static str (a: color4) {
        console.warn('Obsolete Vmath API');
        return `color4(${a.r}, ${a.g}, ${a.b}, ${a.a})`;
    }

    /**
     * @zh 颜色转数组
     * @param ofs 数组起始偏移量
     */
    public static array<Out extends IWritableArrayLike<number>> (out: Out, a: color4, ofs = 0) {
        console.warn('Obsolete Vmath API');
        const scale = (a instanceof cc.Color || a.a > 1) ? 1 / 255 : 1;
        out[ofs + 0] = a.r * scale;
        out[ofs + 1] = a.g * scale;
        out[ofs + 2] = a.b * scale;
        out[ofs + 3] = a.a * scale;

        return out;
    }

    /**
     * @zh 颜色等价判断
     */
    public static exactEquals (a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    /**
     * @zh 排除浮点数误差的颜色近似等价判断
     */
    public static equals (a: color4, b: color4) {
        console.warn('Obsolete Vmath API');
        const a0 = a.r, a1 = a.g, a2 = a.b, a3 = a.a;
        const b0 = b.r, b1 = b.g, b2 = b.b, b3 = b.a;
        return (Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
    }

    /**
     * @zh 获取指定颜色的整型数据表示
     */
    public static hex (a: color4) {
        console.warn('Obsolete Vmath API');
        return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
    }

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor (r = 1, g = 1, b = 1, a = 1) {
        console.warn('Obsolete Vmath API');
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
