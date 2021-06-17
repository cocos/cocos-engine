/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 ****************************************************************************/

import ValueType from './value-type';
import CCClass from '../platform/CCClass';
import misc from '../utils/misc';

/**
 * !#en
 * Representation of RGBA colors.
 *
 * Each color component is a floating point value with a range from 0 to 255.
 *
 * You can also use the convenience method {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} to create a new Color.
 *
 * !#zh
 * cc.Color 用于表示颜色。
 *
 * 它包含 RGBA 四个以浮点数保存的颜色分量，每个的值都在 0 到 255 之间。
 *
 * 您也可以通过使用 {{#crossLink "cc/color:method"}}cc.color{{/crossLink}} 的便捷方法来创建一个新的 Color。
 *
 * @class Color
 * @extends ValueType
 */
export default class Color extends ValueType {
    static div = Color.divide;
    static sub = Color.subtract;
    static mul = Color.multiply;

    /**
     * !#en Solid white, RGBA is [255, 255, 255, 255].
     * !#zh 纯白色，RGBA 是 [255, 255, 255, 255]。
     * @property WHITE
     * @type {Color}
     * @static
     */
    static get WHITE () { return new Color(255, 255, 255, 255); }
    static readonly WHITE_R: Color = Color.WHITE;

    /**
     * !#en Solid black, RGBA is [0, 0, 0, 255].
     * !#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。
     * @property BLACK
     * @type {Color}
     * @static
     */
    static get BLACK () { return new Color(0, 0, 0, 255); }
    static readonly BLACK_R: Color = Color.BLACK;

    /**
     * !#en Transparent, RGBA is [0, 0, 0, 0].
     * !#zh 透明，RGBA 是 [0, 0, 0, 0]。
     * @property TRANSPARENT
     * @type {Color}
     * @static
     */
    static get TRANSPARENT () { return new Color(0, 0, 0, 0); }
    static readonly TRANSPARENT_R: Color = Color.TRANSPARENT;

    /**
     * !#en Grey, RGBA is [127.5, 127.5, 127.5].
     * !#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。
     * @property GRAY
     * @type {Color}
     * @static
     */
    static get GRAY () { return new Color(127.5, 127.5, 127.5); }
    static readonly GRAY_R: Color = Color.GRAY;

    /**
     * !#en Solid red, RGBA is [255, 0, 0].
     * !#zh 纯红色，RGBA 是 [255, 0, 0]。
     * @property RED
     * @type {Color}
     * @static
     */
    static get RED () { return new Color(255, 0, 0); }
    static readonly RED_R: Color = Color.RED;
    /**
     * !#en Solid green, RGBA is [0, 255, 0].
     * !#zh 纯绿色，RGBA 是 [0, 255, 0]。
     * @property GREEN
     * @type {Color}
     * @static
     */
    static get GREEN () { return new Color(0, 255, 0); }
    static readonly GREEN_R: Color = Color.GREEN;
    /**
     * !#en Solid blue, RGBA is [0, 0, 255].
     * !#zh 纯蓝色，RGBA 是 [0, 0, 255]。
     * @property BLUE
     * @type {Color}
     * @static
     */
    static get BLUE () { return new Color(0, 0, 255); }
    static readonly BLUE_R: Color = Color.BLUE;
    /**
     * !#en Yellow, RGBA is [255, 235, 4].
     * !#zh 黄色，RGBA 是 [255, 235, 4]。
     * @property YELLOW
     * @type {Color}
     * @static
     */
    static get YELLOW () { return new Color(255, 235, 4); }
    static readonly YELLOW_R: Color = Color.YELLOW;
    /**
     * !#en Orange, RGBA is [255, 127, 0].
     * !#zh 橙色，RGBA 是 [255, 127, 0]。
     * @property ORANGE
     * @type {Color}
     * @static
     */
    static get ORANGE () { return new Color(255, 127, 0); }
    static readonly ORANGE_R: Color = Color.ORANGE;
    /**
     * !#en Cyan, RGBA is [0, 255, 255].
     * !#zh 青色，RGBA 是 [0, 255, 255]。
     * @property CYAN
     * @type {Color}
     * @static
     */
    static get CYAN () { return new Color(0, 255, 255); }
    static readonly CYAN_R: Color = Color.CYAN;
    /**
     * !#en Magenta, RGBA is [255, 0, 255].
     * !#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。
     * @property MAGENTA
     * @type {Color}
     * @static
     */
    static get MAGENTA () { return new Color(255, 0, 255); }
    static readonly MAGENTA_R: Color = Color.MAGENTA;

    /**
     * Copy content of a color into another.
     * @method copy
     * @typescript
     * copy (out: Color, a: Color): Color
     * @static
     */
    static copy (out: Color, a: Color): Color {
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
    }

    /**
     * Clone a new color.
     * @method clone
     * @typescript
     * clone (a: Color): Color
     * @static
     */
    static clone (a: Color): Color {
        return new Color(a.r, a.g, a.b, a.a);
    }

    /**
     * Set the components of a color to the given values.
     * @method set
     * @typescript
     * set (out: Color, r?: number, g?: number, b?: number, a?: number): Color
     * @static
     */
    static set (out: Color, r = 255, g = 255, b = 255, a = 255): Color {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * Converts the hexadecimal formal color into rgb formal.
     * @method fromHex
     * @typescript
     * fromHex (out: Color, hex: number): Color
     * @static
     * @deprecated
     */
    static fromHex (out: Color, hex: number): Color {
        let r = ((hex >> 24) & 0xff);
        let g = ((hex >> 16) & 0xff);
        let b = ((hex >> 8) & 0xff);
        let a = ((hex) & 0xff);

        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
    }

    /**
     * Converts the hexadecimal formal color into rgb formal.
     * @method fromHEX
     * @typescript
     * fromHEX (out: Color, hex: string): Color
     * @static
     */
    static fromHEX (out: Color, hexString: string): Color {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        out.r = parseInt(hexString.substr(0, 2), 16) || 0;
        out.g = parseInt(hexString.substr(2, 2), 16) || 0;
        out.b = parseInt(hexString.substr(4, 2), 16) || 0;
        out.a = parseInt(hexString.substr(6, 2), 16) || 255;
        out._val = ((out.a << 24) >>> 0) + (out.b << 16) + (out.g << 8) + out.r;
        return out;
    }

    /**
     * Add components of two colors, respectively.
     * @method add
     * @typescript
     * add (out: Color, a: Color, b: Color): Color
     * @static
     */
    static add (out: Color, a: Color, b: Color): Color {
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
    }

    /**
     * Subtract components of color b from components of color a, respectively.
     * @method subtract
     * @typescript
     * subtract (out: Color, a: Color, b: Color): Color
     * @static
     */
    static subtract (out: Color, a: Color, b: Color): Color {
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
    }

    /**
     * Multiply components of two colors, respectively.
     * @method multiply
     * @typescript
     * multiply (out: Color, a: Color, b: Color): Color
     * @static
     */
    static multiply (out: Color, a: Color, b: Color): Color {
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
    }

    /**
     * Divide components of color a by components of color b, respectively.
     * @method divide
     * @typescript
     * divide (out: Color, a: Color, b: Color): Color
     * @static
     */
    static divide (out: Color, a: Color, b: Color): Color {
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
    }

    /**
     * Scales a color by a number.
     * @method scale
     * @typescript
     * scale (out: Color, a: Color, b: number): Color
     * @static
     */
    static scale (out: Color, a: Color, b: number): Color {
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
    }

    /**
     * Performs a linear interpolation between two colors.
     * @method lerp
     * @typescript
     * lerp (out: Color, a: Color, b: Color, t: number): Color
     * @static
     */
    static lerp (out: Color, a: Color, b: Color, t: number): Color {
        let ar = a.r,
            ag = a.g,
            ab = a.b,
            aa = a.a;
        out.r = ar + t * (b.r - ar);
        out.g = ag + t * (b.g - ag);
        out.b = ab + t * (b.b - ab);
        out.a = aa + t * (b.a - aa);
        return out;
    }

    /**
     * !#zh 颜色转数组
     * !#en Turn an array of colors
     * @method toArray
     * @typescript
     * toArray <Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs?: number): Out
     * @param ofs 数组起始偏移量
     * @static
     */
    static toArray<Out extends IWritableArrayLike<number>> (out: Out, a: IColorLike, ofs = 0) {
        const scale = (a instanceof Color || a.a > 1) ? 1 / 255 : 1;
        out[ofs + 0] = a.r * scale;
        out[ofs + 1] = a.g * scale;
        out[ofs + 2] = a.b * scale;
        out[ofs + 3] = a.a * scale;
        return out;
    }

    /**
     * !#zh 数组转颜色
     * !#en An array of colors turn
     * @method fromArray
     * @typescript
     * fromArray <Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs?: number): Out
     * @param ofs 数组起始偏移量
     * @static
     */
    static fromArray<Out extends IColorLike> (arr: IWritableArrayLike<number>, out: Out, ofs = 0) {
        out.r = arr[ofs + 0] * 255;
        out.g = arr[ofs + 1] * 255;
        out.b = arr[ofs + 2] * 255;
        out.a = arr[ofs + 3] * 255;
        return out;
    }

    /**
     * !#zh 颜色 RGB 预乘 Alpha 通道
     * !#en RGB premultiply alpha channel
     * @method premultiplyAlpha
     * @typescript
     * premultiplyAlpha <Out extends IColorLike> (out: Out, a: IColorLike)
     * @param out 返回颜色
     * @param color 预乘处理的目标颜色
     * @static
     */
    static premultiplyAlpha (out, color) {
        let alpha = color.a / 255.0;
        out.r = color.r * alpha;
        out.g = color.g * alpha;
        out.b = color.b * alpha;

        out._fastSetA(color.a);

        return out;
    }

    _val: number = 0;

    /**
     * @method constructor
     * @param {Number} [r=0] - red component of the color, default value is 0.
     * @param {Number} [g=0] - green component of the color, defualt value is 0.
     * @param {Number} [b=0] - blue component of the color, default value is 0.
     * @param {Number} [a=255] - alpha component of the color, default value is 255.
     */
    constructor (r: Color | number = 0, g: number = 0, b: number = 0, a: number = 255) {
        super();
        if (typeof r === 'object') {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }

        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + (r|0);
    }

    /**
     * !#en Clone a new color from the current color.
     * !#zh 克隆当前颜色。
     * @method clone
     * @return {Color} Newly created color.
     * @example
     * var color = new cc.Color();
     * var newColor = color.clone();// Color {r: 0, g: 0, b: 0, a: 255}
     */
    clone (): Color {
        var ret = new Color();
        ret._val = this._val;
        return ret;
    }

    /**
     * !#en TODO
     * !#zh 判断两个颜色是否相等。
     * @method equals
     * @param {Color} other
     * @return {Boolean}
     * @example
     * var color1 = cc.Color.WHITE;
     * var color2 = new cc.Color(255, 255, 255);
     * cc.log(color1.equals(color2)); // true;
     * color2 = cc.Color.RED;
     * cc.log(color2.equals(color1)); // false;
     */
    equals (other: Color): boolean {
        return other && this._val === other._val;
    }

    /**
     * !#en TODO
     * !#zh 线性插值
     * @method lerp
     * @param {Color} to
     * @param {number} ratio - the interpolation coefficient.
     * @param {Color} [out] - optional, the receiving vector.
     * @return {Color}
     * @example {@link cocos2d/core/value-types/CCColor/lerp.js}
     */
    lerp (to: Color, ratio: number, out?: Color): Color {
        out = out || new Color();
        var r = this.r;
        var g = this.g;
        var b = this.b;
        var a = this.a;
        out.r = r + (to.r - r) * ratio;
        out.g = g + (to.g - g) * ratio;
        out.b = b + (to.b - b) * ratio;
        out.a = a + (to.a - a) * ratio;
        return out;
    };

    /**
     * !#en TODO
     * !#zh 转换为方便阅读的字符串。
     * @method toString
     * @return {String}
     * @example
     * var color = cc.Color.WHITE;
     * color.toString(); // "rgba(255, 255, 255, 255)"
     */
    toString (): string {
        return "rgba(" +
            this.r.toFixed() + ", " +
            this.g.toFixed() + ", " +
            this.b.toFixed() + ", " +
            this.a.toFixed() + ")";
    };

    /**
     * !#en Get or set red channel value
     * !#zh 获取或者设置红色通道
     * @property {number} r
     */
    get r (): number {
        return this.getR();
    }
    set r (v: number) {
        this.setR(v);
    }

    /**
     * !#en Get or set green channel value
     * !#zh 获取或者设置绿色通道
     * @property {number} g
     */
    get g (): number {
        return this.getG();
    }
    set g (v: number) {
        this.setG(v);
    }

    /**
     * !#en Get or set blue channel value
     * !#zh 获取或者设置蓝色通道
     * @property {number} b
     */
    get b (): number {
        return this.getB();
    }
    set b (v: number) {
        this.setB(v);
    }

    /**
     * !#en Get or set alpha channel value
     * !#zh 获取或者设置透明通道
     * @property {number} a
     */
    get a (): number {
        return this.getA();
    }
    set a (v: number) {
        this.setA(v);
    }

    /**
     * !#en Gets red channel value
     * !#zh 获取当前颜色的红色值。
     * @method getR
     * @return {Number} red value.
     */
    getR (): number {
        return this._val & 0x000000ff;
    }
    /**
     * !#en Sets red value and return the current color object
     * !#zh 设置当前的红色值，并返回当前对象。
     * @method setR
     * @param {Number} red - the new Red component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setR(255); // Color {r: 255, g: 0, b: 0, a: 255}
     */
    setR (red): this {
        red = ~~misc.clampf(red, 0, 255);
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
        return this;
    }
    /**
     * !#en Gets green channel value
     * !#zh 获取当前颜色的绿色值。
     * @method getG
     * @return {Number} green value.
     */
    getG (): number {
        return (this._val & 0x0000ff00) >> 8;
    }
    /**
     * !#en Sets green value and return the current color object
     * !#zh 设置当前的绿色值，并返回当前对象。
     * @method setG
     * @param {Number} green - the new Green component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setG(255); // Color {r: 0, g: 255, b: 0, a: 255}
     */
    setG (green): this {
        green = ~~misc.clampf(green, 0, 255);
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
        return this;
    }
    /**
     * !#en Gets blue channel value
     * !#zh 获取当前颜色的蓝色值。
     * @method getB
     * @return {Number} blue value.
     */
    getB (): number {
        return (this._val & 0x00ff0000) >> 16;
    }
    /**
     * !#en Sets blue value and return the current color object
     * !#zh 设置当前的蓝色值，并返回当前对象。
     * @method setB
     * @param {Number} blue - the new Blue component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setB(255); // Color {r: 0, g: 0, b: 255, a: 255}
     */
    setB (blue): this {
        blue = ~~misc.clampf(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
        return this;
    }
    /**
     * !#en Gets alpha channel value
     * !#zh 获取当前颜色的透明度值。
     * @method getA
     * @return {Number} alpha value.
     */
    getA (): number {
        return (this._val & 0xff000000) >>> 24;
    }
    /**
     * !#en Sets alpha value and return the current color object
     * !#zh 设置当前的透明度，并返回当前对象。
     * @method setA
     * @param {Number} alpha - the new Alpha component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setA(0); // Color {r: 0, g: 0, b: 0, a: 0}
     */
    setA (alpha): this {
        alpha = ~~misc.clampf(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0;
        return this;
    }

    /**
     * !#en Convert color to css format.
     * !#zh 转换为 CSS 格式。
     * @method toCSS
     * @param {String} [opt="rgba"] - "rgba", "rgb", "#rgb" or "#rrggbb".
     * @return {String}
     * @example
     * var color = cc.Color.BLACK;
     * color.toCSS();          // "rgba(0,0,0,1.00)";
     * color.toCSS("rgba");    // "rgba(0,0,0,1.00)";
     * color.toCSS("rgb");     // "rgba(0,0,0)";
     * color.toCSS("#rgb");    // "#000";
     * color.toCSS("#rrggbb"); // "#000000";
     */
    toCSS (opt: string): string {
        if (!opt || opt === 'rgba') {
            return "rgba(" +
                this.r + "," +
                this.g + "," +
                this.b + "," +
                (this.a / 255).toFixed(2) + ")"
                ;
        }
        else if (opt === 'rgb') {
            return "rgb(" +
                this.r + "," +
                this.g + "," +
                this.b + ")"
                ;
        }
        else {
            return '#' + this.toHEX(opt);
        }
    }

    /**
     * !#en Read hex string and store color data into the current color object, the hex string must be formated as rgba or rgb.
     * !#zh 读取 16 进制颜色。
     * @method fromHEX
     * @param {String} hexString
     * @return {Color}
     * @chainable
     * @example
     * var color = cc.Color.BLACK;
     * color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
     */
    fromHEX (hexString: string): this {
        hexString = (hexString.indexOf('#') === 0) ? hexString.substring(1) : hexString;
        let r = parseInt(hexString.substr(0, 2), 16) || 0;
        let g = parseInt(hexString.substr(2, 2), 16) || 0;
        let b = parseInt(hexString.substr(4, 2), 16) || 0;
        let a = parseInt(hexString.substr(6, 2), 16) || 255;
        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
        return this;
    }

    /**
     * !#en convert Color to HEX color string.
     * !#zh 转换为 16 进制。
     * @method toHEX
     * @param {String} [fmt="#rrggbb"] - "#rgb", "#rrggbb" or "#rrggbbaa".
     * @return {String}
     * @example
     * var color = cc.Color.BLACK;
     * color.toHEX("#rgb");     // "000";
     * color.toHEX("#rrggbb");  // "000000";
     */
    toHEX (fmt): string {
        const prefix = '0';
        // #rrggbb
        let hex = [
            (this.r < 16 ? prefix : '') + (this.r).toString(16),
            (this.g < 16 ? prefix : '') + (this.g).toString(16),
            (this.b < 16 ? prefix : '') + (this.b).toString(16),
        ];
        if (fmt === '#rgb') {
            hex[0] = hex[0][0];
            hex[1] = hex[1][0];
            hex[2] = hex[2][0];
        }
        else if (fmt === '#rrggbbaa') {
            hex.push((this.a < 16 ? prefix : '') + (this.a).toString(16));
        }
        return hex.join('');
    };

    /**
     * !#en Convert to 24bit rgb value.
     * !#zh 转换为 24bit 的 RGB 值。
     * @method toRGBValue
     * @return {Number}
     * @example
     * var color = cc.Color.YELLOW;
     * color.toRGBValue(); // 16771844;
     */
    toRGBValue (): number {
        return this._val & 0x00ffffff;
    }

    /**
     * !#en Read HSV model color and convert to RGB color
     * !#zh 读取 HSV（色彩模型）格式。
     * @method fromHSV
     * @param {Number} h
     * @param {Number} s
     * @param {Number} v
     * @return {Color}
     * @chainable
     * @example
     * var color = cc.Color.YELLOW;
     * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
     */
    fromHSV (h, s, v): this {
        var r, g, b;
        if (s === 0) {
            r = g = b = v;
        }
        else {
            if (v === 0) {
                r = g = b = 0;
            }
            else {
                if (h === 1) h = 0;
                h *= 6;
                var i = Math.floor(h);
                var f = h - i;
                var p = v * (1 - s);
                var q = v * (1 - (s * f));
                var t = v * (1 - (s * (1 - f)));
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
        this._val = ((this.a << 24) >>> 0) + (b << 16) + (g << 8) + (r|0);
        return this;
    }

    /**
     * !#en Transform to HSV model color
     * !#zh 转换为 HSV（色彩模型）格式。
     * @method toHSV
     * @return {Object} - {h: number, s: number, v: number}.
     * @example
     * var color = cc.Color.YELLOW;
     * color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
     */
    toHSV () {
        var r = this.r / 255;
        var g = this.g / 255;
        var b = this.b / 255;
        var hsv = { h: 0, s: 0, v: 0 };
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var delta = 0;
        hsv.v = max;
        hsv.s = max ? (max - min) / max : 0;
        if (!hsv.s) hsv.h = 0;
        else {
            delta = max - min;
            if (r === max) hsv.h = (g - b) / delta;
            else if (g === max) hsv.h = 2 + (b - r) / delta;
            else hsv.h = 4 + (r - g) / delta;
            hsv.h /= 6;
            if (hsv.h < 0) hsv.h += 1.0;
        }
        return hsv;
    }

    /**
     * !#en Set the color
     * !#zh 设置颜色
     * @method set
     * @typescript
     * set (color: Color): Color
     * @param {Color} color
     */
    set (color: Color): this {
        if (color._val) {
            this._val = color._val;
        }
        else {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            this.a = color.a;
        }
        return this;
    }

    _fastSetA (alpha) {
        this._val = ((this._val & 0x00ffffff) | (alpha << 24)) >>> 0;
    }

    /**
     * !#en Multiplies the current color by the specified color
     * !#zh 将当前颜色乘以与指定颜色
     * @method multiply
     * @return {Color}
     * @param {Color} other
     */
    multiply (other: Color) {
        let r = ((this._val & 0x000000ff) * other.r) >> 8;
        let g = ((this._val & 0x0000ff00) * other.g) >> 8;
        let b = ((this._val & 0x00ff0000) * other.b) >> 8;
        let a = ((this._val & 0xff000000) >>> 8) * other.a;
        this._val = (a & 0xff000000) | (b & 0x00ff0000) | (g & 0x0000ff00) | (r & 0x000000ff);
        return this;
    }
}

CCClass.fastDefine('cc.Color', Color, { r: 0, g: 0, b: 0, a: 255 });


cc.Color = Color;

/**
 * @module cc
 */

/**
 * !#en
 * The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
 * Alpha channel is optional. Default value is 255.
 *
 * !#zh
 * 通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
 * Alpha 通道是可选的。默认值是 255。
 *
 * @method color
 * @param {Number} [r=0]
 * @param {Number} [g=0]
 * @param {Number} [b=0]
 * @param {Number} [a=255]
 * @return {Color}
 * @example {@link cocos2d/core/value-types/CCColor/color.js}
 */
cc.color = function color (r, g, b, a) {
    if (typeof r === 'string') {
        var result = new Color();
        return result.fromHEX(r);
    }
    if (typeof r === 'object') {
        return new Color(r.r, r.g, r.b, r.a);
    }
    return new Color(r, g, b, a);
};
