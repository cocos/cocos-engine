/****************************************************************************
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
 ****************************************************************************/

import CCClass from '../data/class';
import { color4 } from '../vmath';
import { ValueType } from './value-type';

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
    private _val: number;

    /**
     * @param other
     */
    constructor (other: Color);

    /**
     * @param [r=0] - red component of the color, default value is 0.
     * @param [g=0] - green component of the color, defualt value is 0.
     * @param [b=0] - blue component of the color, default value is 0.
     * @param [a=255] - alpha component of the color, default value is 255.
     */
    constructor (r?: number, g?: number, b?: number, a?: number);

    constructor (r?: number | Color, g?: number, b?: number, a?: number) {
        super();
        if (typeof r === 'object') {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }
        r = r || 0;
        g = g || 0;
        b = b || 0;
        a = typeof a === 'number' ? a : 255;
        this._val = ((a << 24) >>> 0) + (b << 16) + (g << 8) + r;
    }

    // color: [r, g, b, a]
    /**
     * !#en Solid white, RGBA is [255, 255, 255, 255].
     * !#zh 纯白色，RGBA 是 [255, 255, 255, 255]。
     */
    static get WHITE () {
        return new Color(255, 255, 255, 255);
    }

    /**
     * !#en Solid black, RGBA is [0, 0, 0, 255].
     * !#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。
     */
    static get BLACK () {
        return new Color(0, 0, 0, 255);
    }

    /**
     * !#en Transparent, RGBA is [0, 0, 0, 0].
     * !#zh 透明，RGBA 是 [0, 0, 0, 0]。
     */
    static get TRANSPARENT () {
         return new Color(0, 0, 0, 0);
    }

    /**
     * !#en Grey, RGBA is [127.5, 127.5, 127.5].
     * !#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。
     */
    static get GRAY () {
        return new Color(127.5, 127.5, 127.5, 255);
    }

    /**
     * !#en Solid red, RGBA is [255, 0, 0].
     * !#zh 纯红色，RGBA 是 [255, 0, 0]。
     */
    static get RED () {
        return new Color(255, 0, 0, 255);
    }

    /**
     * !#en Solid green, RGBA is [0, 255, 0].
     * !#zh 纯绿色，RGBA 是 [0, 255, 0]。
     */
    static get GREEN () {
        return new Color(0, 255, 0, 255);
    }

    /**
     * !#en Solid blue, RGBA is [0, 0, 255].
     * !#zh 纯蓝色，RGBA 是 [0, 0, 255]。
     */
    static get BLUE () {
        return new Color(0, 0, 255, 255);
    }

    /**
     * !#en Yellow, RGBA is [255, 235, 4].
     * !#zh 黄色，RGBA 是 [255, 235, 4]。
     */
    static get YELLOW () {
        return new Color(255, 235, 4, 255);
    }

    /**
     * !#en Orange, RGBA is [255, 127, 0].
     * !#zh 橙色，RGBA 是 [255, 127, 0]。
     */
    static get ORANGE () {
        return new Color(255, 127, 0, 255);
    }

    /**
     * !#en Cyan, RGBA is [0, 255, 255].
     * !#zh 青色，RGBA 是 [0, 255, 255]。
     */
    static get CYAN () {
        return new Color(0, 255, 255, 255);
    }

    /**
     * !#en Magenta, RGBA is [255, 0, 255].
     * !#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。
     */
    static get MAGENTA () {
        return new Color(255, 0, 255, 255);
    }

    /**
     * !#en red channel value
     * !#zh 红色通道值
     */
    get r () {
        return this._val & 0x000000ff;
    }
    set r (red) {
        red = ~~cc.misc.clampf(red, 0, 255);
        this._val = ((this._val & 0xffffff00) | red) >>> 0;
    }

    /**
     * !#en green channel value
     * !#zh 绿色通道值
     */
    get g () {
        return (this._val & 0x0000ff00) >> 8;
    }
    set g (green) {
        green = ~~cc.misc.clampf(green, 0, 255);
        this._val = ((this._val & 0xffff00ff) | (green << 8)) >>> 0;
    }

    /**
     * !#en blue channel value
     * !#zh 蓝色通道值
     */
    get b () {
        return (this._val & 0x00ff0000) >> 16;
    }
    set b (blue) {
        blue = ~~cc.misc.clampf(blue, 0, 255);
        this._val = ((this._val & 0xff00ffff) | (blue << 16)) >>> 0;
    }

    /**
     * !#en alpha channel value
     * !#zh 透明度通道值
     */
    get a () {
        return (this._val & 0xff000000) >>> 24;
    }
    set a (alpha) {
        alpha = ~~cc.misc.clampf(alpha, 0, 255);
        this._val = ((this._val & 0x00ffffff) | ((alpha << 24) >>> 0)) >>> 0;
    }

    /**
     * !#en Clone a new color from the current color.
     * !#zh 克隆当前颜色。
     *
     * @return Newly created color.
     * @example
     * var color = new cc.Color();
     * var newColor = color.clone();// Color {r: 0, g: 0, b: 0, a: 255}
     */
    public clone () {
        const ret = new Color();
        ret._val = this._val;
        return ret;
    }

    /**
     * !#en TODO
     * !#zh 判断两个颜色是否相等。
     *
     * @param other
     * @return
     * @example
     * var color1 = cc.Color.WHITE;
     * var color2 = new cc.Color(255, 255, 255);
     * cc.log(color1.equals(color2)); // true;
     * color2 = cc.Color.RED;
     * cc.log(color2.equals(color1)); // false;
     */
    public equals (other: Color) {
        return other && this._val === other._val;
    }

    /**
     * !#en TODO
     * !#zh 线性插值
     *
     * @param to
     * @param ratio - the interpolation coefficient.
     * @param [out] - optional, the receiving vector.
     * @return
     * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/lerp.js}
     */
    public lerp (to: Color, ratio: number, out?: Color) {
        out = out || new Color();
        const r = this.r;
        const g = this.g;
        const b = this.b;
        const a = this.a;
        out.r = r + (to.r - r) * ratio;
        out.g = g + (to.g - g) * ratio;
        out.b = b + (to.b - b) * ratio;
        out.a = a + (to.a - a) * ratio;
        return out;
    }

    /**
     * !#en TODO
     * !#zh 转换为方便阅读的字符串。
     *
     * @return
     * @example
     * var color = cc.Color.WHITE;
     * color.toString(); // "rgba(255, 255, 255, 255)"
     */
    public toString () {
        return 'rgba(' +
            this.r.toFixed() + ', ' +
            this.g.toFixed() + ', ' +
            this.b.toFixed() + ', ' +
            this.a.toFixed() + ')';
    }

    /**
     * !#en Convert color to css format.
     * !#zh 转换为 CSS 格式。
     *
     * @param opt - "rgba", "rgb", "#rgb" or "#rrggbb".
     * @return
     * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/toCSS.js}
     */
    public toCSS (opt: 'rgba' | 'rgb' | '#rgb' | '#rrggbb') {
        if ( opt === 'rgba' ) {
            return 'rgba(' +
                (this.r | 0 ) + ',' +
                (this.g | 0 ) + ',' +
                (this.b | 0 ) + ',' +
                (this.a / 255).toFixed(2) + ')'
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
     * !#en Read hex string and store color data into the current color object,
     * the hex string must be formated as rgba or rgb.
     * !#zh 读取 16 进制颜色。
     *
     * @param hexString
     * @return
     * @chainable
     * @example
     * var color = cc.Color.BLACK;
     * color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
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
     * !#en convert Color to HEX color string.
     * e.g.  cc.color(255,6,255)  to : "#ff06ff"
     * !#zh 转换为 16 进制。
     *
     * @param fmt - "#rgb", "#rrggbb" or "#rrggbbaa".
     * @return
     * @example
     * var color = cc.Color.BLACK;
     * color.toHEX("#rgb");     // "000";
     * color.toHEX("#rrggbb");  // "000000";
     */
    public toHEX (fmt: '#rgb' | '#rrggbb' | '#rrggbbaa') {
        const hex = [
            (this.r | 0 ).toString(16),
            (this.g | 0 ).toString(16),
            (this.b | 0 ).toString(16),
        ];
        let i = -1;
        if ( fmt === '#rgb' ) {
            for ( i = 0; i < hex.length; ++i ) {
                if ( hex[i].length > 1 ) {
                    hex[i] = hex[i][0];
                }
            }
        } else if ( fmt === '#rrggbb' ) {
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
     * !#en Convert to 24bit rgb value.
     * !#zh 转换为 24bit 的 RGB 值。
     *
     * @return
     * @example
     * var color = cc.Color.YELLOW;
     * color.toRGBValue(); // 16771844;
     */
    public toRGBValue () {
        return this._val & 0x00ffffff;
    }

    /**
     * !#en Read HSV model color and convert to RGB color
     * !#zh 读取 HSV（色彩模型）格式。
     *
     * @param h
     * @param s
     * @param v
     * @return
     * @chainable
     * @example
     * var color = cc.Color.YELLOW;
     * color.fromHSV(0, 0, 1); // Color {r: 255, g: 255, b: 255, a: 255};
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
     * !#en Transform to HSV model color
     * !#zh 转换为 HSV（色彩模型）格式。
     *
     * @return - {h: number, s: number, v: number}.
     * @example
     * var color = cc.Color.YELLOW;
     * color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
     */
    public toHSV () {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
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

    public set (color: Color) {
        if (color._val) {
            this._val = color._val;
        } else {
            this.r = color.r;
            this.g = color.g;
            this.b = color.b;
            this.a = color.a;
        }
    }

    public to01 (out?: color4) {
      out = out || color4.create();
      out.r = this.r / 255;
      out.g = this.g / 255;
      out.b = this.b / 255;
      out.a = this.a / 255;
      return out;
    }
}

CCClass.fastDefine('cc.Color', Color, {r: 0, g: 0, b: 0, a: 255});

/**
 * !#en
 * The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
 * Alpha channel is optional. Default value is 255.
 *
 * !#zh
 * 通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
 * Alpha 通道是可选的。默认值是 255。
 *
 *
 * @param other
 * @return
 * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/color.js}
 */
function color (other: Color | string): Color;

/**
 * !#en
 * The convenience method to create a new {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}}
 * Alpha channel is optional. Default value is 255.
 *
 * !#zh
 * 通过该方法来创建一个新的 {{#crossLink "Color/Color:method"}}cc.Color{{/crossLink}} 对象。
 * Alpha 通道是可选的。默认值是 255。
 *
 *
 * @param [r=0]
 * @param [g=0]
 * @param [b=0]
 * @param [a=255]
 * @return
 * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/color.js}
 */
function color (r?: number, g?: number, b?: number, a?: number): Color;

function color (r?: number | Color | string, g?: number, b?: number, a?: number) {
    if (typeof r === 'string') {
        const result = new Color();
        return result.fromHEX(r);
    }
    if (typeof r === 'object') {
        return new Color(r.r, r.g, r.b, r.a);
    }
    return  new Color(r, g, b, a);
}

export { color };

cc.color = color;

cc.Color = Color;
