/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { CCClass } from '../data/class';
import { ValueType } from '../value-types/value-type';
import { IColorLike } from './type-define';
import { clamp, EPSILON } from './utils';
import { legacyCC } from '../global-exports';
import { assertIsTrue } from '../data/utils/asserts';
import { Vec4 } from './vec4';
import { Vec3 } from './vec3';

const toFloat = 1 / 255;

/**
 * @en Representation of RGBA colors.<br/>
 * Each color component is an integer value with a range from 0 to 255.<br/>
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
     * @en Copy content of a color into another and save the results to out color.
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
     * @en Clone a color and save the results to out color.
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
     * @en Set the components of a color to the given values and save the results to out color.
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
     * @en Convert linear color from rgb8 0~255 to Vec4 0~1
     * @zh 将当前颜色转换为到 Vec4
     * @returns Vec4 as float color value
     * @example
     * ```
     * const color = Color.YELLOW;
     * color.toVec4();
     * ```
     */
    public static toVec4 (color:Color, out?: Vec4): Vec4 {
        out = out !== undefined ?  out : new Vec4();
        out.x = color.r * toFloat;
        out.y = color.g * toFloat;
        out.z = color.b * toFloat;
        out.w = color.a * toFloat;
        return out;
    }
    /**
     * @en Convert 8bit linear color from Vec4
     * @zh 使用 Vec4 设置 8 bit 颜色
     * @returns 8 Bit srgb value
     * @example
     * ```
     * color.fromVec4(new Vec4(1,1,1,1));
     * ```
     */
    public static fromVec4 (value: Vec4, out?: Color): Color {
        out = out === undefined ? new Color() : out;
        out.r = Math.floor(value.x / toFloat);
        out.g = Math.floor(value.y / toFloat);
        out.b = Math.floor(value.z / toFloat);
        out.a = Math.floor(value.w / toFloat);
        return out;
    }
    /**
     * @en Converts the hexadecimal formal color into rgb formal and save the results to out color.
     * @zh 从十六进制颜色字符串中读入颜色到 out 中
     */
    public static fromHEX<Out extends IColorLike> (out: Out, hexString: string) {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        out.r = parseInt(hexString.substr(0, 2), 16) || 0;
        out.g = parseInt(hexString.substr(2, 2), 16) || 0;
        out.b = parseInt(hexString.substr(4, 2), 16) || 0;
        const a = parseInt(hexString.substr(6, 2), 16);
        out.a = !Number.isNaN(a) ? a : 255;
        out._val = ((out.a << 24) >>> 0) + (out.b << 16) + (out.g << 8) + out.r;
        return out;
    }

    /**
     * @en Add two colors by components. And save the results to out color.
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
     * @en Subtract each components of color b from each components of color a. And save the results to out color.
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
     * @en Multiply each components of two colors. And save the results to out color.
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
     * @en Divide each components of color a by each components of color b. And save the results to out color.
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
     * @en Multiply all channels in a color with the given scale factor, and save the results to out color.
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
     * @en Performs a linear interpolation between two colors.
     * @zh 逐通道颜色线性插值：A + t * (B - A)
     */
    public static lerp<Out extends IColorLike> (out: Out, from: Out, to: Out, ratio: number) {
        let r = from.r;
        let g = from.g;
        let b = from.b;
        let a = from.a;
        r += (to.r - r) * ratio;
        g += (to.g - g) * ratio;
        b += (to.b - b) * ratio;
        a += (to.a - a) * ratio;
        out._val = Math.floor(((a << 24) >>> 0) + (b << 16) + (g << 8) + r);
        return out;
    }

    /**
     * @en Convert a color object to a RGBA array, and save the results to out color.
     * @zh 颜色转数组
     * @param ofs Array Start Offset
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
     * @en Sets the given color with RGBA values in an array, and save the results to out color.
     * @zh 数组转颜色
     * @param ofs Array Start Offset
     */
    public static fromArray<Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs = 0) {
        out.r = arr[ofs + 0] * 255;
        out.g = arr[ofs + 1] * 255;
        out.b = arr[ofs + 2] * 255;
        out.a = arr[ofs + 3] * 255;
        return out;
    }

    /**
     * @en Check whether the two given colors are identical
     * @zh 颜色等价判断
     */
    public static strictEquals<Out extends IColorLike> (a: Out, b: Out) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    }

    /**
     * @en Check whether the two given colors are approximately equivalent. Difference of each channel is smaller that the epsilon.
     * @zh 排除浮点数误差的颜色近似等价判断
     */
    public static equals<Out extends IColorLike> (a: Out, b: Out, epsilon = EPSILON) {
        return (Math.abs(a.r - b.r) <= epsilon * Math.max(1.0, Math.abs(a.r), Math.abs(b.r))
            && Math.abs(a.g - b.g) <= epsilon * Math.max(1.0, Math.abs(a.g), Math.abs(b.g))
            && Math.abs(a.b - b.b) <= epsilon * Math.max(1.0, Math.abs(a.b), Math.abs(b.b))
            && Math.abs(a.a - b.a) <= epsilon * Math.max(1.0, Math.abs(a.a), Math.abs(b.a)));
    }

    /**
     * @en Convert the given color to a hex color value. And save the results to out color.
     * @zh 获取指定颜色的整型数据表示
     */
    public static hex<Out extends IColorLike> (a: Out) {
        return ((a.r * 255) << 24 | (a.g * 255) << 16 | (a.b * 255) << 8 | a.a * 255) >>> 0;
    }

    /**
     * @en Get or set red channel value.
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
     * @en Get or set green channel value.
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
     * @en Get or set blue channel value.
     * @zh 获取或设置当前颜色的 Blue 通道。
     */
    get b () {
        return (this._val & 0x00ff0000) >> 16;
    }

    set b (blue) {
        blue = ~~clamp(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }

    /** @en Get or set alpha channel value.
     * @zh 获取或设置当前颜色的透明度通道。
     */
    get a () {
        return (this._val & 0xff000000) >>> 24;
    }

    set a (alpha) {
        alpha = ~~clamp(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0;
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

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _val = 0;

    /**
     * @en Construct a same color from the given color
     * @zh 构造与指定颜色相等的颜色。
     * @param other Specified color
     */
    constructor (other: Color);

    /**
     * @en Construct a color form the hex color string
     * @zh 用十六进制颜色字符串中构造颜色。
     * @param hexString Hexadecimal color string.
     */

    constructor (hexString: string);

    /**
     * @en Construct a color
     * @zh 构造具有指定通道的颜色。
     * @param r red component of the color, default value is 0.
     * @param g green component of the color, default value is 0.
     * @param b blue component of the color, default value is 0.
     * @param a alpha component of the color, default value is 255.
     */
    constructor (r?: number, g?: number, b?: number, a?: number);

    constructor (r?: number | Color | string, g?: number, b?: number, a?: number) {
        super();
        if (typeof r === 'string') {
            this.fromHEX(r);
        } else if (g !== undefined) {
            this.set(r as number, g, b, a);
        } else {
            this.set(r as Color);
        }
    }

    /**
     * @en Clone a new color from the current color.
     * @zh 克隆当前颜色。
     */
    public clone () {
        const ret = new Color();
        ret._val = this._val;
        return ret;
    }

    /**
     * @en Check whether the current color is identical with the given color
     * @zh 判断当前颜色是否与指定颜色相等。
     * @param other Specified color
     * @returns Returns `true` when all channels of both colours are equal; otherwise returns `false`.
     */
    public equals (other: Color) {
        return other && this._val === other._val;
    }

    /**
     * @en Calculate linear interpolation result between this color and another one with given ratio。
     * @zh 根据指定的插值比率，从当前颜色到目标颜色之间做插值。
     * @param to Target color
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public lerp (to: Color, ratio: number) {
        let r = this.r;
        let g = this.g;
        let b = this.b;
        let a = this.a;
        r += (to.r - r) * ratio;
        g += (to.g - g) * ratio;
        b += (to.b - b) * ratio;
        a += (to.a - a) * ratio;
        this._val = Math.floor(((a << 24) >>> 0) + (b << 16) + (g << 8) + r);
        return this;
    }

    /**
     * @en Convert to string with color informations
     * @zh 返回当前颜色的字符串表示。
     * @returns A string representation of the current color.
     */
    public toString () {
        return `rgba(${this.r.toFixed()}, ${this.g.toFixed()}, ${this.b.toFixed()}, ${this.a.toFixed()})`;
    }

    /**
     * @en Convert color to css format.
     * @zh 将当前颜色转换为 CSS 格式。
     * @param opt "rgba", "rgb", "#rgb" or "#rrggbb".
     * @returns CSS format for the current color.
     * @example
     * ```ts
     * let color = cc.Color.BLACK;
     * color.toCSS();          // "rgba(0,0,0,1.00)";
     * color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
     * color.toCSS("rgb");     // "rgba(0,0,0)";
     * color.toCSS("#rgb");    // "#000";
     * color.toCSS("#rrggbb"); // "#000000";
     * ```
     */
    public toCSS (opt: ('rgba' | 'rgb' | '#rrggbb' | '#rrggbbaa') = 'rgba') {
        if (opt === 'rgba') {
            return `rgba(${this.r},${this.g},${this.b},${(this.a * toFloat).toFixed(2)})`;
        } else if (opt === 'rgb') {
            return `rgb(${this.r},${this.g},${this.b})`;
        } else {
            return `#${this.toHEX(opt)}`;
        }
    }

    /**
     * @en Read hex string and store color data into the current color object, the hex string must be formatted as rgba or rgb.
     * @zh 从十六进制颜色字符串中读入当前颜色。<br/>
     * 十六进制颜色字符串应该以可选的 "#" 开头，紧跟最多 8 个代表十六进制数字的字符；<br/>
     * 每两个连续字符代表的数值依次作为 Red、Green、Blue 和 Alpha 通道；<br/>
     * 缺省的颜色通道将视为 0；缺省的透明通道将视为 255。<br/>
     * @param hexString the hex string
     * @returns `this`
     */
    public fromHEX (hexString: string) {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        const r = parseInt(hexString.substr(0, 2), 16) || 0;
        const g = parseInt(hexString.substr(2, 2), 16) || 0;
        const b = parseInt(hexString.substr(4, 2), 16) || 0;
        let a = parseInt(hexString.substr(6, 2), 16);
        a = !Number.isNaN(a) ? a : 255;
        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + (r | 0);
        return this;
    }

    /**
     * @en convert Color to HEX color string.
     * @zh 转换当前颜色为十六进制颜色字符串。
     * @param fmt "#rrggbb" or "#rrggbbaa".
     * - `'#rrggbbaa'` obtains the hexadecimal value of the Red, Green, Blue, Alpha channels (**two**, high complement 0) and connects them sequentially.
     * - `'#rrggbb'` is similar to `'#rrggbbaa'` but does not include the Alpha channel.
     * @returns the Hex color string
     * @example
     * ```
     * const color = new Color(255, 14, 0, 255);
     * color.toHEX("#rgb");      // "f00";
     * color.toHEX("#rrggbbaa"); // "ff0e00ff"
     * color.toHEX("#rrggbb");   // "ff0e00"
     * ```
     */
    public toHEX (fmt: '#rgb' | '#rrggbb' | '#rrggbbaa' = '#rrggbb') {
        const prefix = '0';
        // #rrggbb
        const hex = [
            (this.r < 16 ? prefix : '') + (this.r).toString(16),
            (this.g < 16 ? prefix : '') + (this.g).toString(16),
            (this.b < 16 ? prefix : '') + (this.b).toString(16),
        ];
        const i = -1;
        if (fmt === '#rgb') {
            hex[0] = hex[0][0];
            hex[1] = hex[1][0];
            hex[2] = hex[2][0];
        } else if (fmt === '#rrggbbaa') {
            hex.push((this.a < 16 ? prefix : '') + (this.a).toString(16));
        }
        return hex.join('');
    }

    /**
     * @en Convert to rgb value.
     * @zh 将当前颜色转换为 RGB 整数值。
     * @returns RGB integer value. Starting from the lowest valid bit, each 8 bits is the value of the Red, Green, and Blue channels respectively.
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
     * @en Read HSV model color and convert to RGB color.
     * @zh 从 HSV 颜色中读入当前颜色。
     * @param h H value。
     * @param s S value。
     * @param v V value。
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
        } else if (v === 0) {
            r = g = b = 0;
        } else {
            if (h === 1) { h = 0; }
            h *= 6;
            const i = Math.floor(h);
            const f = h - i;
            const p = v * (1 - s);
            const q = v * (1 - (s * f));
            const t = v * (1 - (s * (1 - f)));
            switch (i) {
            default:
                assertIsTrue(false);
                // eslint-disable-next-line no-fallthrough
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
        r *= 255;
        g *= 255;
        b *= 255;
        this._val = ((this.a << 24) >>> 0) + (b << 16) + (g << 8) + (r | 0);
        return this;
    }

    /**
     * @en Transform to HSV model color.
     * @zh 转换当前颜色为 HSV 颜色。
     * @returns HSV format color
     * @example
     * ```
     * import { Color } from 'cc';
     * const color = Color.YELLOW;
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
     * @en Set the color.
     * @zh 设置当前颜色使其与指定颜色相等。
     * @param other The specified color.
     * @overload
     * @param [r=0] red component of the color, the range is [0-255]
     * @param [g=0] green component of the color
     * @param [b=0] blue component of the color
     * @param [a=255] alpha component of the color
     * @returns Current color.
     */
    public set(other: Color): Color;
    public set(r?: number, g?: number, b?: number, a?: number): Color;
    public set (r?: number | Color, g?: number, b?: number, a?: number): Color {
        if (typeof r === 'object') {
            if (r._val != null) {
                this._val = r._val;
            } else {
                g = r.g || 0;
                b = r.b || 0;
                a = typeof r.a === 'number' ? r.a : 255;
                r = r.r || 0;
                this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + (r | 0);
            }
        } else {
            r = r || 0;
            g = g || 0;
            b = b || 0;
            a = typeof a === 'number' ? a : 255;
            this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + (r | 0);
        }
        return this;
    }

    /**
     * @en Multiplies the current color by the specified color.
     * @zh 将当前颜色乘以与指定颜色
     * @param other The specified color.
     */
    public multiply (other: Color) {
        const r = ((this._val & 0x000000ff) * other.r) >> 8;
        const g = ((this._val & 0x0000ff00) * other.g) >> 8;
        const b = ((this._val & 0x00ff0000) * other.b) >> 8;
        const a = ((this._val & 0xff000000) >>> 8) * other.a;
        this._val = (a & 0xff000000) | (b & 0x00ff0000) | (g & 0x0000ff00) | (r & 0x000000ff);
        return this;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _set_r_unsafe (red) {
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
        return this;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _set_g_unsafe (green) {
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
        return this;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _set_b_unsafe (blue) {
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
        return this;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _set_a_unsafe (alpha) {
        this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0;
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

export function srgbToLinear (x: number): number {
    if (x <= 0) return 0;
    else if (x >= 1) return 1;
    else if (x < 0.04045) return x / 12.92;
    else return ((x + 0.055) / 1.055) ** 2.4;
}

export function srgb8BitToLinear (x: number): number {
    if ((x | 0) !== x || (x >>> 8) !== 0) { throw new RangeError('Value out of 8-bit range'); }
    return SRGB_8BIT_TO_LINEAR[x];
}

export function linearToSrgb (x: number): number {
    if (x <= 0) return 0;
    else if (x >= 1) return 1;
    else if (x < 0.0031308) return x * 12.92;
    else return x ** (1 / 2.4) * 1.055 - 0.055;
}

export function linearToSrgb8Bit (x: number): number {
    if (x <= 0) { return 0; }
    const TABLE: Array<number> = SRGB_8BIT_TO_LINEAR;
    if (x >= 1) { return TABLE.length - 1; }
    let y = 0;
    for (let i = TABLE.length >>> 1; i !== 0; i >>>= 1) {
        if (TABLE[y | i] <= x) { y |= i; }
    }
    if (x - TABLE[y] <= TABLE[y + 1] - x) { return y; } else { return y + 1; }
}

// use table for more consistent conversion between uint8 and float, offline processes only.
let SRGB_8BIT_TO_LINEAR: Array<number> = [];
for (let i = 0; i < 256; i++) { SRGB_8BIT_TO_LINEAR.push(srgbToLinear(i / 255.0)); }

export function clampVec3 (val: Vec3, min: Vec3, max: Vec3) {
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }
    return val < min ? min : val > max ? max : val;
}

export function floorVec3 (val: Vec3) {
    const temp = val.clone();
    temp.x = Math.floor(val.x);
    temp.y = Math.floor(val.y);
    temp.z = Math.floor(val.z);
    return temp;
}

export function stepVec3 (a: Vec3, b: Vec3) {
    if (a < b) {
        return b;
    } else {
        return a;
    }
}

/**
 * @en Three channel rgb color pack into four channel rbge format.
 * @zh 三通道rgb颜色pack成四通道rbge格式
 * @param rgb Vec3
 */
export function packRGBE (rgb: Vec3) {
    const maxComp = Math.max(Math.max(rgb.x, rgb.y), rgb.z);
    let e = 128.0;
    if (maxComp > 0.0001) {
        e = Math.log(maxComp) / Math.log(1.1);
        e = Math.ceil(e);
        e = clamp(e + 128.0, 0.0, 255.0);
    }
    // eslint-disable-next-line no-restricted-properties
    const sc = 1.0 / Math.pow(1.1, e - 128.0);
    const encode = clampVec3(rgb.multiplyScalar(sc), new Vec3(0.0, 0.0, 0.0), new Vec3(1.0, 1.0, 1.0));
    encode.multiplyScalar(255.0);
    const encode_rounded = floorVec3(encode).add(stepVec3(encode.subtract(floorVec3(encode)), new Vec3(0.5, 0.5, 0.5)));
    return new Vec4(encode_rounded.x / 255.0, encode_rounded.y / 255.0, encode_rounded.z / 255.0, e / 255.0);
}
