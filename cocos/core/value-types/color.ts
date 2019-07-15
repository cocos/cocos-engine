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
 * @category core/value-types
 */

import CCClass from '../data/class';
import { EPSILON } from './utils';
import { ValueType } from './value-type';

const toFloat = 1 / 255;

/**
 * 通过 Red、Green、Blue 颜色通道表示颜色，并通过 Alpha 通道表示不透明度。
 * 每个通道都为取值范围 [0, 255] 的整数。
 */
export class Color extends ValueType {

    /**
     * 构造与指定颜色相等的颜色。
     */
    public static create (other: Color | string): Color;

    /**
     * 构造具有指定通道的颜色。
     */
    public static create (r?: number, g?: number, b?: number, a?: number): Color;

    public static create (r?: number | Color | string, g?: number, b?: number, a?: number) {
        if (typeof r === 'object') {
            return new Color(r.r, r.g, r.b, r.a);
        } else if (typeof r === 'string') {
            return new Color().fromHEX(r);
        } else {
            return new Color(r, g, b, a);
        }
    }

    /**
     * @zh 获得指定颜色的拷贝
     */
    public static clone (a: Color) {
        return new Color().set(a);
    }

    /**
     * @zh 复制目标颜色
     */
    public static copy (out: Color, a: Color) {
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
    }

    /**
     * @zh 设置颜色值
     */
    public static set (out: Color, r: number, g: number, b: number, a: number) {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * @zh 根据指定整型数据设置颜色
     */
    public static fromHex (out: Color, hex: number) {
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
    public static add (out: Color, a: Color, b: Color) {
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色减法
     */
    public static subtract (out: Color, a: Color, b: Color) {
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色减法
     */
    public static sub (out: Color, a: Color, b: Color) {
        return Color.subtract(out, a, b);
    }

    /**
     * @zh 逐通道颜色乘法
     */
    public static multiply (out: Color, a: Color, b: Color) {
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色乘法
     */
    public static mul (out: Color, a: Color, b: Color) {
        return Color.multiply(out, a, b);
    }

    /**
     * @zh 逐通道颜色除法
     */
    public static divide (out: Color, a: Color, b: Color) {
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色除法
     */
    public static div (out: Color, a: Color, b: Color) {
        return Color.divide(out, a, b);
    }

    /**
     * @zh 全通道统一缩放颜色
     */
    public static scale (out: Color, a: Color, b: number) {
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
    }

    /**
     * @zh 逐通道颜色线性插值：A + t * (B - A)
     */
    public static lerp (out: Color, from: Color, to: Color, ratio: number) {
        let r = from.r;
        let g = from.g;
        let b = from.b;
        let a = from.a;
        r = r + (to.r - r) * ratio;
        g = g + (to.g - g) * ratio;
        b = b + (to.b - b) * ratio;
        a = a + (to.a - a) * ratio;
        out._val = Math.floor(((a << 24) >>> 0) + (b << 16) + (g << 8) + r);
    }

    /**
     * @zh 颜色转数组
     * @param ofs 数组起始偏移量
     */
    public static array (out: IWritableArrayLike<number>, a: Color, ofs = 0) {
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
    public static exactEquals (a: Color, b: Color) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    /**
     * @zh 排除浮点数误差的颜色近似等价判断
     */
    public static equals (a: Color, b: Color, epsilon = EPSILON) {
        const { r: a0, g: a1, b: a2, a: a3 } = a;
        const { r: b0, g: b1, b: b2, a: b3 } = b;
        return (Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
            Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
            Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
            Math.abs(a3 - b3) <= epsilon * Math.max(1.0, Math.abs(a3), Math.abs(b3)));
    }

    /**
     * @zh 获取指定颜色的整型数据表示
     */
    public static hex (a: Color) {
        return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
    }

    /**
     * 创建并获取（不透明的）纯白色，各通道值依次为 (255, 255, 255, 255)。
     */
    static get WHITE () {
        return new Color(255, 255, 255, 255);
    }

    /**
     * 创建并获取（不透明的）纯黑色，各通道值依次为 (0, 0, 0, 255)。
     */
    static get BLACK () {
        return new Color(0, 0, 0, 255);
    }

    /**
     * 创建并获取全透明的纯黑色，各通道值依次为 (0, 0, 0, 0)。
     */
    static get TRANSPARENT () {
         return new Color(0, 0, 0, 0);
    }

    /**
     * 创建并获取（不透明的）灰色，各通道值依次为 (127.5, 127.5, 127.5, 255)。
     */
    static get GRAY () {
        return new Color(127.5, 127.5, 127.5, 255);
    }

    /**
     * 创建并获取（不透明的）纯红色，各通道值依次为 (255, 0, 0, 255)。
     */
    static get RED () {
        return new Color(255, 0, 0, 255);
    }

    /**
     * 创建并获取（不透明的）纯绿色，各通道值依次为 (0, 255, 0, 255)。
     */
    static get GREEN () {
        return new Color(0, 255, 0, 255);
    }

    /**
     * 创建并获取（不透明的）纯蓝色，各通道值依次为 (0, 0, 255, 255)。
     */
    static get BLUE () {
        return new Color(0, 0, 255, 255);
    }

    /**
     * 创建并获取（不透明的）黄色，各通道值依次为 (255, 235, 4, 255)。
     */
    static get YELLOW () {
        return new Color(255, 235, 4, 255);
    }

    /**
     * 创建并获取（不透明的）橙色，各通道值依次为 (255, 127, 0, 255)。
     */
    static get ORANGE () {
        return new Color(255, 127, 0, 255);
    }

    /**
     * 创建并获取（不透明的）青色，各通道值依次为 (0, 255, 255, 255)。
     */
    static get CYAN () {
        return new Color(0, 255, 255, 255);
    }

    /**
     * 创建并获取（不透明的）洋红色（品红色），各通道值依次为 (255, 0, 255, 255)。
     */
    static get MAGENTA () {
        return new Color(255, 0, 255, 255);
    }

    /**
     * 获取或设置当前颜色的 Red 通道。
     */
    get r () {
        return this._val & 0x000000ff;
    }

    set r (red) {
        red = ~~cc.misc.clampf(red, 0, 255);
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
    }

    /**
     * 获取或设置当前颜色的 Green 通道。
     */
    get g () {
        return (this._val & 0x0000ff00) >> 8;
    }

    set g (green) {
        green = ~~cc.misc.clampf(green, 0, 255);
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
    }

    /**
     * 获取或设置当前颜色的 Blue 通道。
     */
    get b () {
        return (this._val & 0x00ff0000) >> 16;
    }

    set b (blue) {
        blue = ~~cc.misc.clampf(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }

    /**
     * 获取或设置当前颜色的 Alpha 通道。
     */
    get a () {
        return (this._val & 0xff000000) >>> 24;
    }

    set a (alpha) {
        alpha = ~~cc.misc.clampf(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | ((alpha << 24) >>> 0)) >>> 0;
    }

    /**
     * 通过除以 255，将当前颜色的各个通道都视为范围 [0, 1] 内，设置 Red 通道的值。
     */
    get x () {
        return this.r * toFloat;
    }

    set x (value) {
        this.r = value * 255;
    }

    /**
     * 通过除以 255，将当前颜色的各个通道都视为范围 [0, 1] 内，设置 Green 通道的值。
     */
    get y () {
        return this.g * toFloat;
    }

    set y (value) {
        this.g = value * 255;
    }

    /**
     * 通过除以 255，将当前颜色的各个通道都视为范围 [0, 1] 内，设置 Blue 通道的值。
     */
    get z () {
        return this.b * toFloat;
    }

    set z (value) {
        this.b = value * 255;
    }

    /**
     * 通过除以 255，将当前颜色的各个通道都视为范围 [0, 1] 内，设置 Alpha 通道的值。
     */
    get w () {
        return this.a * toFloat;
    }

    set w (value) {
        this.a = value * 255;
    }

    public _val: number;

    constructor (r = 0, g = 0, b = 0, a = 255) {
        super();
        r = r;
        g = g;
        b = b;
        a = a;
        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
    }

    /**
     * 克隆当前颜色。
     */
    public clone () {
        const ret = new Color();
        ret._val = this._val;
        return ret;
    }

    /**
     * 判断当前颜色是否与指定颜色相等。
     * @param other 相比较的颜色。
     * @returns 两颜色的各通道都相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Color) {
        return other && this._val === other._val;
    }

    /**
     * 根据指定的插值比率，从当前颜色到目标颜色之间做插值。
     * @param to 目标颜色。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Color, ratio: number) {
        Color.lerp(this, this, to, ratio);
    }

    /**
     * 返回当前颜色的字符串表示。
     * @returns 当前颜色的字符串表示。
     */
    public toString () {
        return 'rgba(' +
            this.r.toFixed() + ', ' +
            this.g.toFixed() + ', ' +
            this.b.toFixed() + ', ' +
            this.a.toFixed() + ')';
    }

    /**
     * 将当前颜色转换为 CSS 格式。
     * @param opt 格式选项。
     * @returns 当前颜色的 CSS 格式。
     */
    public toCSS (opt: 'rgba' | 'rgb' | '#rrggbb') {
        if ( opt === 'rgba' ) {
            return 'rgba(' +
                (this.r | 0 ) + ',' +
                (this.g | 0 ) + ',' +
                (this.b | 0 ) + ',' +
                (this.a * toFloat).toFixed(2) + ')'
            ;
        } else if ( opt === 'rgb' ) {
            return 'rgb(' +
                (this.r | 0 ) + ',' +
                (this.g | 0 ) + ',' +
                (this.b | 0 ) + ')'
            ;
        } else {
            return '#' + this.toHEX(opt);
        }
    }

    /**
     * 从十六进制颜色字符串中读入当前颜色。
     * 十六进制颜色字符串应该以可选的 "#" 开头，紧跟最多 8 个代表十六进制数字的字符；
     * 每两个连续字符代表的数值依次作为 Red、Green、Blue 和 Alpha 通道；
     * 缺省的颜色通道将视为 0；缺省的透明通道将视为 255。
     * @param hexString 十六进制颜色字符串。
     * @returns `this`
     */
    public fromHEX (hexString: string) {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        const r = parseInt(hexString.substr(0, 2), 16) || 0;
        const g = parseInt(hexString.substr(2, 2), 16) || 0;
        const b = parseInt(hexString.substr(4, 2), 16) || 0;
        const a = parseInt(hexString.substr(6, 2), 16) || 255;
        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
        return this;
    }

    /**
     * 转换当前颜色为十六进制颜色字符串。
     * @param fmt 格式选项。
     * - `'#rrggbbaa'` 获取Red、Green、Blue、Alpha通道的十六进制值（**两位**，高位补 0）并依次连接；
     * - `'#rrggbb` 与 `'#rrggbbaa'` 类似但不包括 Alpha 通道。
     * @returns 十六进制颜色字符串。
     * @example
     * ```
     * const color = new Color(255, 14, 0, 255);
     * color.toHex("rrggbbaa"); // "FF0E00FF"
     * color.toHex("rrggbb"); // "FF0E00"
     * ```
     */
    public toHEX (fmt: '#rrggbb' | '#rrggbbaa') {
        const hex = [
            (this.r | 0 ).toString(16),
            (this.g | 0 ).toString(16),
            (this.b | 0 ).toString(16),
        ];
        let i = -1;
        if ( fmt === '#rrggbb' ) {
            for ( i = 0; i < hex.length; ++i ) {
                if ( hex[i].length === 1 ) {
                    hex[i] = '0' + hex[i];
                }
            }
        } else if ( fmt === '#rrggbbaa' ) {
            hex.push((this.a | 0 ).toString(16));
            for ( i = 0; i < hex.length; ++i ) {
                if ( hex[i].length === 1 ) {
                    hex[i] = '0' + hex[i];
                }
            }
        }
        return hex.join('');
    }

    /**
     * 将当前颜色转换为 RGB 整数值。
     * @returns RGB 整数值。从最低有效位开始，每8位分别是 Red、Green、Blue 通道的值。
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.toRGBValue();
     * ```
     */
    public toRGBValue () {
        return this._val & 0x00ffffff;
    }

    /**
     * 从 HSV 颜色中读入当前颜色。
     * @param h H 通道。
     * @param s S 通道。
     * @param v V 通道。
     * @returns `this`
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
     * ```
     */
    public fromHSV (h: number, s: number, v: number) {
        let r: number = 0;
        let g: number = 0;
        let b: number = 0;
        if (s === 0) {
            r = g = b = v;
        } else {
            if (v === 0) {
                r = g = b = 0;
            } else {
                if (h === 1) { h = 0; }
                h *= 6;
                s = s;
                v = v;
                const i = Math.floor(h);
                const f = h - i;
                const p = v * (1 - s);
                const q = v * (1 - (s * f));
                const t = v * (1 - (s * (1 - f)));
                switch (i) {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;

                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;

                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;

                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;

                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;

                    case 5:
                        r = v;
                        g = p;
                        b = q;
                        break;
                }
            }
        }
        r *= 255;
        g *= 255;
        b *= 255;
        this._val = ((this.a << 24) >>> 0) + (b << 16) + (g << 8) + r;
        return this;
    }

    /**
     * 转换当前颜色为 HSV 颜色。
     * @returns HSV 颜色。成员 `h`、`s`、`v` 分别代表 HSV 颜色的 H、S、V 通道。
     * @example
     * ```
     * const color = cc.Color.YELLOW;
     * color.toHSV(); // {h: 0.1533864541832669, s: 0.9843137254901961, v: 1}
     * ```
     */
    public toHSV () {
        const r = this.r * toFloat;
        const g = this.g * toFloat;
        const b = this.b * toFloat;
        const hsv = { h: 0, s: 0, v: 0 };
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let delta = 0;
        hsv.v = max;
        hsv.s = max ? (max - min) / max : 0;
        if (!hsv.s) { hsv.h = 0; } else {
            delta = max - min;
            if (r === max) {
                hsv.h = (g - b) / delta;
            } else if (g === max) {
                hsv.h = 2 + (b - r) / delta;
            } else {
                hsv.h = 4 + (r - g) / delta;
            }
            hsv.h /= 6;
            if (hsv.h < 0) { hsv.h += 1.0; }
        }
        return hsv;
    }

    /**
     * 设置当前颜色使其与指定颜色相等。
     * @param other 相比较的颜色。
     * @returns 当前颜色。
     */
    public set (other: Color) {
        if (other._val) {
            this._val = other._val;
        } else {
            this._val = ((other.a << 24) >>> 0) + (other.b << 16) + (other.g << 8) + other.r;
        }
    }

    /**
     * 将当前颜色乘以与指定颜色
     * @param other 指定的颜色。
     */
    public multiply (other: Color) {
        const r = ((this._val & 0x000000ff) * other.r) >> 8;
        const g = ((this._val & 0x0000ff00) * other.g) >> 8;
        const b = ((this._val & 0x00ff0000) * other.b) >> 8;
        const a = ((this._val & 0xff000000) >>> 8) * other.a;
        this._val = (a & 0xff000000) | (b & 0x00ff0000) | (g & 0x0000ff00) | (r & 0x000000ff);
    }

    public _set_r_unsafe (red) {
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
    }

    public _set_g_unsafe (green) {
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
    }

    public _set_b_unsafe (blue) {
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }

    public _set_a_unsafe (alpha) {
        this._val = ((this._val & 0x00ffffff) | ((alpha << 24) >>> 0)) >>> 0;
    }
}

CCClass.fastDefine('cc.Color', Color, {r: 0, g: 0, b: 0, a: 255});
cc.Color = Color;
cc.color = Color.create;
