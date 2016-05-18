/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ValueType = require('./CCValueType');
var JS = require('../platform/js');

var Color = (function () {

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
    /**
     * @method Color
     * @param {Number} [r=0] - red component of the color, default value is 0.
     * @param {Number} [g=0] - green component of the color, defualt value is 0.
     * @param {Number} [b=0] - blue component of the color, default value is 0.
     * @param {Number} [a=255] - alpha component of the color, default value is 255.
     * @return {Color}
     */
    function Color( r, g, b, a ) {
        if (typeof r === 'object') {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = typeof a === 'number' ? a : 255;
    }
    JS.extend(Color, ValueType);
    require('../platform/CCClass').fastDefine('cc.Color', Color, { r: 0, g: 0, b: 0, a: 255 });

    var DefaultColors = {
        // color: [r, g, b, a]
        /**
         * !#en Solid white, RGBA is [255, 255, 255, 255].
         * !#zh 纯白色，RGBA 是 [255, 255, 255, 255]。
         * @property WHITE
         * @type {Color}
         * @static
         */
        WHITE:      [255, 255, 255, 255],
        /**
         * !#en Solid black, RGBA is [0, 0, 0, 255].
         * !#zh 纯黑色，RGBA 是 [0, 0, 0, 255]。
         * @property BLACK
         * @type {Color}
         * @static
         */
        BLACK:      [0, 0, 0, 255],
        /**
         * !#en Transparent, RGBA is [0, 0, 0, 0].
         * !#zh 透明，RGBA 是 [0, 0, 0, 0]。
         * @property TRANSPARENT
         * @type {Color}
         * @static
         */
        TRANSPARENT:[0, 0, 0, 0],
        /**
         * !#en Grey, RGBA is [127.5, 127.5, 127.5].
         * !#zh 灰色，RGBA 是 [127.5, 127.5, 127.5]。
         * @property GRAY
         * @type {Color}
         * @static
         */
        GRAY:       [127.5, 127.5, 127.5],
        /**
         * !#en Solid red, RGBA is [255, 0, 0].
         * !#zh 纯红色，RGBA 是 [255, 0, 0]。
         * @property RED
         * @type {Color}
         * @static
         */
        RED:        [255, 0, 0],
        /**
         * !#en Solid green, RGBA is [0, 255, 0].
         * !#zh 纯绿色，RGBA 是 [0, 255, 0]。
         * @property GREEN
         * @type {Color}
         * @static
         */
        GREEN:      [0, 255, 0],
        /**
         * !#en Solid blue, RGBA is [0, 0, 255].
         * !#zh 纯蓝色，RGBA 是 [0, 0, 255]。
         * @property BLUE
         * @type {Color}
         * @static
         */
        BLUE:       [0, 0, 255],
        /**
         * !#en Yellow, RGBA is [255, 235, 4].
         * !#zh 黄色，RGBA 是 [255, 235, 4]。
         * @property YELLOW
         * @type {Color}
         * @static
         */
        YELLOW:     [255, 235, 4],
        /**
         * !#en Orange, RGBA is [255, 127, 0].
         * !#zh 橙色，RGBA 是 [255, 127, 0]。
         * @property ORANGE
         * @type {Color}
         * @static
         */
        ORANGE:     [255, 127, 0],
        /**
         * !#en Cyan, RGBA is [0, 255, 255].
         * !#zh 青色，RGBA 是 [0, 255, 255]。
         * @property CYAN
         * @type {Color}
         * @static
         */
        CYAN:       [0, 255, 255],
        /**
         * !#en Magenta, RGBA is [255, 0, 255].
         * !#zh 洋红色（品红色），RGBA 是 [255, 0, 255]。
         * @property MAGENTA
         * @type {Color}
         * @static
         */
        MAGENTA:    [255, 0, 255]
    };
    for (var colorName in DefaultColors) {
        var colorGetter = (function (r, g, b, a) {
            return function () {
                return new Color(r, g, b, a);
            };
        }).apply(null, DefaultColors[colorName]);
        Object.defineProperty(Color, colorName, { get: colorGetter });
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
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };

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
    Color.prototype.equals = function (other) {
        return other &&
               this.r === other.r &&
               this.g === other.g &&
               this.b === other.b &&
               this.a === other.a;
    };

    /**
     * !#en TODO
     * !#zh 线性插值
     * @method lerp
     * @param {Color} to
     * @param {number} ratio - the interpolation coefficient.
     * @param {Color} [out] - optional, the receiving vector.
     * @return {Color}
     * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/lerp.js}
     */
    Color.prototype.lerp = function (to, ratio, out) {
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
    Color.prototype.toString = function () {
        return "rgba(" +
            this.r.toFixed() + ", " +
            this.g.toFixed() + ", " +
            this.b.toFixed() + ", " +
            this.a.toFixed() + ")"
        ;
    };

    /**
     * !#en TODO
     * !#zh 设置当前的红色值，并返回当前对象。
     * @method setR
     * @param {Number} red - the new Red component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setR(255); // Color {r: 255, g: 0, b: 0, a: 255}
     */
    Color.prototype.setR = function (red) {
        this.r = red;
        return this;
    };
    /**
     * !#en TODO
     * !#zh 设置当前的绿色值，并返回当前对象。
     * @method setG
     * @param {Number} green - the new Green component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setG(255); // Color {r: 0, g: 255, b: 0, a: 255}
     */
    Color.prototype.setG = function (green) {
        this.g = green;
        return this;
    };
    /**
     * !#en TODO
     * !#zh 设置当前的蓝色值，并返回当前对象。
     * @method setB
     * @param {Number} blue - the new Blue component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setB(255); // Color {r: 0, g: 0, b: 255, a: 255}
     */
    Color.prototype.setB = function (blue) {
        this.b = blue;
        return this;
    };
    /**
     * !#en TODO
     * !#zh 设置当前的透明度，并返回当前对象。
     * @method setA
     * @param {Number} alpha - the new Alpha component.
     * @return {Color} this color.
     * @example
     * var color = new cc.Color();
     * color.setA(0); // Color {r: 0, g: 0, b: 0, a: 0}
     */
    Color.prototype.setA = function (alpha) {
        this.a = alpha;
        return this;
    };

    /**
     * !#en TODO
     * !#zh 转换为 CSS 格式。
     * @method toCSS
     * @param {String} opt - "rgba", "rgb", "#rgb" or "#rrggbb".
     * @return {String}
     * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/toCSS.js}
     */
    Color.prototype.toCSS = function ( opt ) {
        if ( opt === 'rgba' ) {
            return "rgba(" +
                (this.r | 0 ) + "," +
                (this.g | 0 ) + "," +
                (this.b | 0 ) + "," +
                (this.a / 255).toFixed(2) + ")"
            ;
        }
        else if ( opt === 'rgb' ) {
            return "rgb(" +
                (this.r | 0 ) + "," +
                (this.g | 0 ) + "," +
                (this.b | 0 ) + ")"
            ;
        }
        else {
            return '#' + this.toHEX(opt);
        }
    };

    /**
     * !#en Clamp this color to make all components between 0 to 255。
     * !#zh 限制颜色数值，在 0 到 255 之间。
     * @method clamp
     * @example
     * var color = new cc.Color(1000, 0, 0, 255);
     * color.clamp();
     * cc.log(color); // (255, 0, 0, 255)
     */
    Color.prototype.clamp = function () {
        this.r = cc.clampf(this.r, 0, 255);
        this.g = cc.clampf(this.g, 0, 255);
        this.b = cc.clampf(this.b, 0, 255);
        this.a = cc.clampf(this.a, 0, 255);
    };

    /**
     * !#en TODO
     * !#zh 读取 16 进制。
     * @method fromHEX
     * @param {String} hexString
     * @return {Color}
     * @chainable
     * @example
     * var color = cc.Color.BLACK;
     * color.fromHEX("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
     */
    Color.prototype.fromHEX = function (hexString) {
        var hex = parseInt(((hexString.indexOf('#') > -1) ? hexString.substring(1) : hexString), 16);
        this.r = (hex >> 16);
        this.g = ((hex & 0x00FF00) >> 8);
        this.b = ((hex & 0x0000FF));
        return this;
    };

    /**
     * !#en TODO
     * !#zh 转换为 16 进制。
     * @method toHEX
     * @param {String} fmt - "#rgb" or "#rrggbb".
     * @return {String}
     * @example
     * var color = cc.Color.BLACK;
     * color.toHEX("#rgb");     // "000";
     * color.toHEX("#rrggbb");  // "000000";
     */
    Color.prototype.toHEX = function ( fmt ) {
        var hex = [
            (this.r | 0 ).toString(16),
            (this.g | 0 ).toString(16),
            (this.b | 0 ).toString(16),
        ];
        var i = -1;
        if ( fmt === '#rgb' ) {
            for ( i = 0; i < hex.length; ++i ) {
                if ( hex[i].length > 1 ) {
                    hex[i] = hex[i][0];
                }
            }
        }
        else if ( fmt === '#rrggbb' ) {
            for ( i = 0; i < hex.length; ++i ) {
                if ( hex[i].length === 1 ) {
                    hex[i] = '0' + hex[i];
                }
            }
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
    Color.prototype.toRGBValue = function () {
        return (cc.clampf(this.r, 0, 255) << 16) +
               (cc.clampf(this.g, 0, 255) << 8) +
               (cc.clampf(this.b, 0, 255));
    };

    /**
     * !#en TODO
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
    Color.prototype.fromHSV = function ( h, s, v ) {
        var rgb = Color.hsv2rgb( h, s, v );
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    };

    /**
     * !#en TODO
     * !#zh 转换为 HSV（色彩模型）格式。
     * @method toHSV
     * @return {Object} - {h: number, s: number, v: number}.
     * @example
     * var color = cc.Color.YELLOW;
     * color.toHSV(); // Object {h: 0.1533864541832669, s: 0.9843137254901961, v: 1};
     */
    Color.prototype.toHSV = function () {
        return Color.rgb2hsv( this.r, this.g, this.b );
    };

    return Color;
})();

/**
 * !#en TODO
 * !#zh RGB 转换为 HSV。
 * @method rgb2hsv
 * @param {Number} r - red, must be [0, 255].
 * @param {Number} g - red, must be [0, 255].
 * @param {Number} b - red, must be [0, 255].
 * @return {Object} - {h: number, s: number, v: number}.
 * @static
 * @example
 * cc.Color.rgb2hsv(255, 255, 255); // Object {h: 0, s: 0, v: 1};
 */
Color.rgb2hsv = function ( r, g, b ) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var hsv = { h: 0, s: 0, v: 0 };
    var max = Math.max(r,g,b);
    var min = Math.min(r,g,b);
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
};

/**
 * !#en TODO
 * !#zh HSV 转换为 RGB。
 * @method hsv2rgb
 * @param {Number} h
 * @param {Number} s
 * @param {Number} v
 * @return {Object} - {r: number, g: number, b: number}}, rgb will be in [0, 255].
 * @static
 * @example
 * cc.Color.hsv2rgb(0, 0, 1); // Object {r: 255, g: 255, b: 255};
 */
Color.hsv2rgb = function ( h, s, v ) {
    var rgb = { r: 0, g: 0, b: 0 };
    if (s === 0) {
        rgb.r = rgb.g = rgb.b = v;
    }
    else {
        if (v === 0) {
            rgb.r = rgb.g = rgb.b = 0;
        }
        else {
            if (h === 1) h = 0;
            h *= 6;
            s = s;
            v = v;
            var i = Math.floor(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - (s * f));
            var t = v * (1 - (s * (1 - f)));
            switch (i) {
                case 0:
                    rgb.r = v;
                    rgb.g = t;
                    rgb.b = p;
                    break;

                case 1:
                    rgb.r = q;
                    rgb.g = v;
                    rgb.b = p;
                    break;

                case 2:
                    rgb.r = p;
                    rgb.g = v;
                    rgb.b = t;
                    break;

                case 3:
                    rgb.r = p;
                    rgb.g = q;
                    rgb.b = v;
                    break;

                case 4:
                    rgb.r = t;
                    rgb.g = p;
                    rgb.b = v;
                    break;

                case 5:
                    rgb.r = v;
                    rgb.g = p;
                    rgb.b = q;
                    break;
            }
        }
    }
    rgb.r *= 255;
    rgb.g *= 255;
    rgb.b *= 255;
    return rgb;
};

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
 * @example {@link utils/api/engine/docs/cocos2d/core/value-types/CCColor/color.js}
 */
cc.color = function color (r, g, b, a) {
    if (typeof r === 'string') {
        var result = new cc.Color();
        return result.fromHEX(r);
    }
    if (typeof r === 'object') {
        return new cc.Color(r.r, r.g, r.b, r.a);
    }
    return  new cc.Color(r, g, b, a);
};


// Functional style API, for backward compatibility

/**
 * !#en returns true if both ccColor3B are equal. Otherwise it returns false.
 * !#zh 判断两个颜色对象的 RGB 部分是否相等，不比较透明度。
 * @method colorEqual
 * @param {Color} color1
 * @param {Color} color2
 * @return {Boolean} true if both ccColor3B are equal. Otherwise it returns false.
 * @example
 * cc.log(cc.colorEqual(cc.Color.RED, new cc.Color(255, 0, 0))); // true
 */
cc.colorEqual = function (color1, color2) {
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
};

/**
 * !#en
 * convert a string of color for style to Color.
 * e.g. "#ff06ff"  to : cc.color(255,6,255)。
 * !#zh 16 进制转换为 Color
 * @method hexToColor
 * @param {String} hex
 * @return {Color}
 * @example
 * cc.hexToColor("#FFFF33"); // Color {r: 255, g: 255, b: 51, a: 255};
 */
cc.hexToColor = function (hex) {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = (c >> 16);
    var g = ((c & 0x00FF00) >> 8);
    var b = ((c & 0x0000FF));
    return cc.color(r, g, b);
};

/**
 * !#en
 * convert Color to a string of color for style.
 * e.g.  cc.color(255,6,255)  to : "#ff06ff"
 * !#zh Color 转换为 16进制。
 * @method colorToHex
 * @param {Color} color
 * @return {String}
 * @example
 * var color = new cc.Color(255, 6, 255)
 * cc.colorToHex(color); // #ff06ff;
 */
cc.colorToHex = function (color) {
    var hR = color.r.toString(16), hG = color.g.toString(16), hB = color.b.toString(16);
    return "#" + (color.r < 16 ? ("0" + hR) : hR) + (color.g < 16 ? ("0" + hG) : hG) + (color.b < 16 ? ("0" + hB) : hB);
};

module.exports = cc.Color;