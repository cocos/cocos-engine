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
import { IColorLike } from './type-define';
import { clamp, EPSILON } from './utils';
import { legacyCC } from '../global-exports';

const toFloat = 1 / 255;

/**
 * @zh 通过 Red、Green、Blue 颜色通道表示颜色，并通过 Alpha 通道表示不透明度。<br/>
 * 每个通道都为取值范围 [0, 255] 的整数。<br/>
 */
export class Color extends ValueType {

    public static WHITE = Object.freeze(new Color(255, 255, 255, 255));
    public static GRAY = Object.freeze(new Color(127, 127, 127, 255));
    public static BLACK = Object.freeze(new Color(0, 0, 0, 255));
    public static TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));
    public static RED = Object.freeze(new Color(255, 0, 0, 255));
    public static GREEN = Object.freeze(new Color(0, 255, 0, 255));
    public static BLUE = Object.freeze(new Color(0, 0, 255, 255));
    public static CYAN = Object.freeze(new Color(0, 255, 255, 255));
    public static MAGENTA = Object.freeze(new Color(255, 0, 255, 255));
    public static YELLOW = Object.freeze(new Color(255, 255, 0, 255));

    /**
     * @zh 获得指定颜色的拷贝
     */
    public static clone<Out extends IColorLike> (a: Out) {
        const out = new Color();
        if (a._val) {
            out._val = a._val;
        } else {
            out._val = ((a.a << 24) >>> 0) + (a.b << 16) + (a.g << 8) + a.r;
        }
        return out;
    }

    /**
     * @zh 复制目标颜色
     */
    public static copy<Out extends IColorLike> (out: Out, a: Out) {
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
    }

    /**
     * @zh 设置颜色值
     */
    public static set<Out extends IColorLike> (out: Out, r: number, g: number, b: number, a: number) {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * @zh 从十六进制颜色字符串中读入颜色到 out 中
     */
    public static fromHEX<Out extends IColorLike> (out: Out, hexString: string) {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        out.r = parseInt(hexString.substr(0, 2), 16) || 0;
        out.g = parseInt(hexString.substr(2, 2), 16) || 0;
        out.b = parseInt(hexString.substr(4, 2), 16) || 0;
        out.a = parseInt(hexString.substr(6, 2), 16) || 255;
        out._val = ((out.a << 24) >>> 0) + (out.b << 16) + (out.g << 8) + out.r;
        return out;
    }

    /**
     * @zh 逐通道颜色加法
     */
    public static add<Out extends IColorLike> (out: Out, a: Out, b: Out) {
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色减法
     */
    public static subtract<Out extends IColorLike> (out: Out, a: Out, b: Out) {
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色乘法
     */
    public static multiply<Out extends IColorLike> (out: Out, a: Out, b: Out) {
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
    }

    /**
     * @zh 逐通道颜色除法
     */
    public static divide<Out extends IColorLike> (out: Out, a: Out, b: Out) {
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
    }

    /**
     * @zh 全通道统一缩放颜色
     */
    public static scale<Out extends IColorLike> (out: Out, a: Out, b: number) {
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
    }

    /**
     * @zh 逐通道颜色线性插值：A + t * (B - A)
     */
    public static lerp<Out extends IColorLike> (out: Out, from: Out, to: Out, ratio: number) {
        let r = from.r;
        let g = from.g;
        let b = from.b;
        let a = from.a;
        r = r + (to.r - r) * ratio;
        g = g + (to.g - g) * ratio;
        b = b + (to.b - b) * ratio;
        a = a + (to.a - a) * ratio;
        out._val = Math.floor(((a << 24) >>> 0) + (b << 16) + (g << 8) + r);
        return out;
    }

    /**
     * @zh 颜色转数组
     * @param ofs 数组起始偏移量
     */
    public static toArray<Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs = 0) {
        const scale = (a instanceof Color || a.a > 1) ? 1 / 255 : 1;
        out[ofs + 0] = a.r * scale;
        out[ofs + 1] = a.g * scale;
        out[ofs + 2] = a.b * scale;
        out[ofs + 3] = a.a * scale;
        return out;
    }

    /**
     * @zh 数组转颜色
     * @param ofs 数组起始偏移量
     */
    public static fromArray<Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs = 0) {
        out.r = arr[ofs + 0] * 255;
        out.g = arr[ofs + 1] * 255;
        out.b = arr[ofs + 2] * 255;
        out.a = arr[ofs + 3] * 255;
        return out;
    }

    /**
     * @zh 颜色等价判断
     */
    public static strictEquals<Out extends IColorLike> (a: Out, b: Out) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    /**
     * @zh 排除浮点数误差的颜色近似等价判断
     */
    public static equals<Out extends IColorLike> (a: Out, b: Out, epsilon = EPSILON) {
        return (Math.abs(a.r - b.r) <= epsilon * Math.max(1.0, Math.abs(a.r), Math.abs(b.r)) &&
            Math.abs(a.g - b.g) <= epsilon * Math.max(1.0, Math.abs(a.g), Math.abs(b.g)) &&
            Math.abs(a.b - b.b) <= epsilon * Math.max(1.0, Math.abs(a.b), Math.abs(b.b)) &&
            Math.abs(a.a - b.a) <= epsilon * Math.max(1.0, Math.abs(a.a), Math.abs(b.a)));
    }

    /**
     * @zh 获取指定颜色的整型数据表示
     */
    public static hex<Out extends IColorLike> (a: Out) {
        return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
    }

    /**
     * @zh 获取或设置当前颜色的 Red 通道。
     */
    get r () {
        return this._val & 0x000000ff;
    }

    set r (red) {
        red = ~~clamp(red, 0, 255);
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
    }

    /**
     * @zh 获取或设置当前颜色的 Green 通道。
     */
    get g () {
        return (this._val & 0x0000ff00) >> 8;
    }

    set g (green) {
        green = ~~clamp(green, 0, 255);
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
    }

    /**
     * @zh 获取或设置当前颜色的 Blue 通道。
     */
    get b () {
        return (this._val & 0x00ff0000) >> 16;
    }

    set b (blue) {
        blue = ~~clamp(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }

    /**
     * @zh 获取或设置当前颜色的 Alpha 通道。
     */
    get a () {
        return (this._val & 0xff000000) >>> 24;
    }

    set a (alpha) {
        alpha = ~~clamp(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | ((alpha << 24) >>> 0)) >>> 0;
    }

    // compatibility with vector interfaces
    get x () { return this.r * toFloat; }
    set x (value) { this.r = value * 255; }
    get y () { return this.g * toFloat; }
    set y (value) { this.g = value * 255; }
    get z () { return this.b * toFloat; }
    set z (value) { this.b = value * 255; }
    get w () { return this.a * toFloat; }
    set w (value) { this.a = value * 255; }

    public _val = 0;

    /**
     * 构造与指定颜色相等的颜色。
     * @param other 指定的颜色。
     */
    constructor (other: Color);

    /**
     * @zh 用十六进制颜色字符串中构造颜色。
     * @param hexString 十六进制颜色字符串。
     */
    // tslint:disable-next-line: unified-signatures
    constructor (hexString: string);

    /**
     * @zh 构造具有指定通道的颜色。
     * @param [r=0] 指定的 Red 通道。
     * @param [g=0] 指定的 Green 通道。
     * @param [b=0] 指定的 Blue 通道。
     * @param [a=255] 指定的 Alpha 通道。
     */
    constructor (r?: number, g?: number, b?: number, a?: number);

    constructor (r?: number | Color | string, g?: number, b?: number, a?: number) {
        super();
        if (typeof r === 'string') {
            this.fromHEX(r);
        } else {
            this.set(r as Color, g, b, a);
        }
    }

    /**
     * @zh 克隆当前颜色。
     */
    public clone () {
        const ret = new Color();
        ret._val = this._val;
        return ret;
    }

    /**
     * @zh 判断当前颜色是否与指定颜色相等。
     * @param other 相比较的颜色。
     * @returns 两颜色的各通道都相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Color) {
        return other && this._val === other._val;
    }

    /**
     * @zh 根据指定的插值比率，从当前颜色到目标颜色之间做插值。
     * @param to 目标颜色。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Color, ratio: number) {
        let r = this.r;
        let g = this.g;
        let b = this.b;
        let a = this.a;
        r = r + (to.r - r) * ratio;
        g = g + (to.g - g) * ratio;
        b = b + (to.b - b) * ratio;
        a = a + (to.a - a) * ratio;
        this._val = Math.floor(((a << 24) >>> 0) + (b << 16) + (g << 8) + r);
        return this;
    }

    /**
     * @zh 返回当前颜色的字符串表示。
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
     * @zh 将当前颜色转换为 CSS 格式。
     * @param opt 格式选项。
     * @returns 当前颜色的 CSS 格式。
     */
    public toCSS (opt: 'rgba' | 'rgb' | '#rrggbb' | '#rrggbbaa') {
        if (opt === 'rgba') {
            return 'rgba(' +
                (this.r | 0) + ',' +
                (this.g | 0) + ',' +
                (this.b | 0) + ',' +
                (this.a * toFloat).toFixed(2) + ')'
                ;
        } else if (opt === 'rgb') {
            return 'rgb(' +
                (this.r | 0) + ',' +
                (this.g | 0) + ',' +
                (this.b | 0) + ')'
                ;
        } else {
            return '#' + this.toHEX(opt);
        }
    }

    /**
     * @zh 从十六进制颜色字符串中读入当前颜色。<br/>
     * 十六进制颜色字符串应该以可选的 "#" 开头，紧跟最多 8 个代表十六进制数字的字符；<br/>
     * 每两个连续字符代表的数值依次作为 Red、Green、Blue 和 Alpha 通道；<br/>
     * 缺省的颜色通道将视为 0；缺省的透明通道将视为 255。<br/>
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
     * @zh 转换当前颜色为十六进制颜色字符串。
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
            (this.r | 0).toString(16),
            (this.g | 0).toString(16),
            (this.b | 0).toString(16),
        ];
        let i = -1;
        if (fmt === '#rrggbb') {
            for (i = 0; i < hex.length; ++i) {
                if (hex[i].length === 1) {
                    hex[i] = '0' + hex[i];
                }
            }
        } else if (fmt === '#rrggbbaa') {
            hex.push((this.a | 0).toString(16));
            for (i = 0; i < hex.length; ++i) {
                if (hex[i].length === 1) {
                    hex[i] = '0' + hex[i];
                }
            }
        }
        return hex.join('');
    }

    /**
     * @zh 将当前颜色转换为 RGB 整数值。
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
     * @zh 从 HSV 颜色中读入当前颜色。
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
        let r = 0;
        let g = 0;
        let b = 0;
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
     * @zh 转换当前颜色为 HSV 颜色。
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
     * @zh 设置当前颜色使其与指定颜色相等。
     * @param other 相比较的颜色。
     * @overload 重载
     * @param [r=0] 指定的 Red 通道，[0-255]。
     * @param [g=0] 指定的 Green 通道。
     * @param [b=0] 指定的 Blue 通道。
     * @param [a=255] 指定的 Alpha 通道。
     * @returns 当前颜色。
     */
    public set (other: Color, g?: number, b?: number, a?: number): Color;
    public set (r?: number | Color, g?: number, b?: number, a?: number) {
        if (typeof r === 'object') {
            if (r._val != null) {
                this._val = r._val;
            } else {
                g = r.g || 0;
                b = r.b || 0;
                a = typeof r.a === 'number' ? r.a : 255;
                r = r.r || 0;
                this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
            }
        } else {
            r = r || 0;
            g = g || 0;
            b = b || 0;
            a = typeof a === 'number' ? a : 255;
            this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
        }
        return this;
    }

    /**
     * @zh 将当前颜色乘以与指定颜色
     * @param other 指定的颜色。
     */
    public multiply (other: Color) {
        const r = ((this._val & 0x000000ff) * other.r) >> 8;
        const g = ((this._val & 0x0000ff00) * other.g) >> 8;
        const b = ((this._val & 0x00ff0000) * other.b) >> 8;
        const a = ((this._val & 0xff000000) >>> 8) * other.a;
        this._val = (a & 0xff000000) | (b & 0x00ff0000) | (g & 0x0000ff00) | (r & 0x000000ff);
        return this;
    }

    public _set_r_unsafe (red) {
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
        return this;
    }

    public _set_g_unsafe (green) {
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
        return this;
    }

    public _set_b_unsafe (blue) {
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
        return this;
    }

    public _set_a_unsafe (alpha) {
        this._val = ((this._val & 0x00ffffff) | ((alpha << 24) >>> 0)) >>> 0;
        return this;
    }
}

CCClass.fastDefine('cc.Color', Color, { r: 0, g: 0, b: 0, a: 255 });
legacyCC.Color = Color;

export function color (other: Color | string): Color;
export function color (r?: number, g?: number, b?: number, a?: number): Color;

export function color (r?: number | Color | string, g?: number, b?: number, a?: number) {
    return new Color(r as any, g, b, a);
}

legacyCC.color = color;
