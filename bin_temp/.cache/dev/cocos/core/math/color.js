(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "./utils.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("./utils.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.utils, global.globalExports);
    global.color = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _utils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.color = color;
  _exports.Color = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var toFloat = 1 / 255;
  /**
   * @zh 通过 Red、Green、Blue 颜色通道表示颜色，并通过 Alpha 通道表示不透明度。<br/>
   * 每个通道都为取值范围 [0, 255] 的整数。<br/>
   */

  var Color = /*#__PURE__*/function (_ValueType) {
    _inherits(Color, _ValueType);

    _createClass(Color, [{
      key: "r",

      /**
       * @zh 获取或设置当前颜色的 Red 通道。
       */
      get: function get() {
        return this._val & 0x000000ff;
      },
      set: function set(red) {
        red = ~~(0, _utils.clamp)(red, 0, 255);
        this._val = (this._val & 0xffffff00 | red) >>> 0;
      }
      /**
       * @zh 获取或设置当前颜色的 Green 通道。
       */

    }, {
      key: "g",
      get: function get() {
        return (this._val & 0x0000ff00) >> 8;
      },
      set: function set(green) {
        green = ~~(0, _utils.clamp)(green, 0, 255);
        this._val = (this._val & 0xffff00ff | green << 8) >>> 0;
      }
      /**
       * @zh 获取或设置当前颜色的 Blue 通道。
       */

    }, {
      key: "b",
      get: function get() {
        return (this._val & 0x00ff0000) >> 16;
      },
      set: function set(blue) {
        blue = ~~(0, _utils.clamp)(blue, 0, 255);
        this._val = (this._val & 0xff00ffff | blue << 16) >>> 0;
      }
      /**
       * @zh 获取或设置当前颜色的 Alpha 通道。
       */

    }, {
      key: "a",
      get: function get() {
        return (this._val & 0xff000000) >>> 24;
      },
      set: function set(alpha) {
        alpha = ~~(0, _utils.clamp)(alpha, 0, 255);
        this._val = (this._val & 0x00ffffff | alpha << 24 >>> 0) >>> 0;
      } // compatibility with vector interfaces

    }, {
      key: "x",
      get: function get() {
        return this.r * toFloat;
      },
      set: function set(value) {
        this.r = value * 255;
      }
    }, {
      key: "y",
      get: function get() {
        return this.g * toFloat;
      },
      set: function set(value) {
        this.g = value * 255;
      }
    }, {
      key: "z",
      get: function get() {
        return this.b * toFloat;
      },
      set: function set(value) {
        this.b = value * 255;
      }
    }, {
      key: "w",
      get: function get() {
        return this.a * toFloat;
      },
      set: function set(value) {
        this.a = value * 255;
      }
    }], [{
      key: "clone",

      /**
       * @zh 获得指定颜色的拷贝
       */
      value: function clone(a) {
        var out = new Color();

        if (a._val) {
          out._val = a._val;
        } else {
          out._val = (a.a << 24 >>> 0) + (a.b << 16) + (a.g << 8) + a.r;
        }

        return out;
      }
      /**
       * @zh 复制目标颜色
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        out.r = a.r;
        out.g = a.g;
        out.b = a.b;
        out.a = a.a;
        return out;
      }
      /**
       * @zh 设置颜色值
       */

    }, {
      key: "set",
      value: function set(out, r, g, b, a) {
        out.r = r;
        out.g = g;
        out.b = b;
        out.a = a;
        return out;
      }
      /**
       * @zh 从十六进制颜色字符串中读入颜色到 out 中
       */

    }, {
      key: "fromHEX",
      value: function fromHEX(out, hexString) {
        hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
        out.r = parseInt(hexString.substr(0, 2), 16) || 0;
        out.g = parseInt(hexString.substr(2, 2), 16) || 0;
        out.b = parseInt(hexString.substr(4, 2), 16) || 0;
        out.a = parseInt(hexString.substr(6, 2), 16) || 255;
        out._val = (out.a << 24 >>> 0) + (out.b << 16) + (out.g << 8) + out.r;
        return out;
      }
      /**
       * @zh 逐通道颜色加法
       */

    }, {
      key: "add",
      value: function add(out, a, b) {
        out.r = a.r + b.r;
        out.g = a.g + b.g;
        out.b = a.b + b.b;
        out.a = a.a + b.a;
        return out;
      }
      /**
       * @zh 逐通道颜色减法
       */

    }, {
      key: "subtract",
      value: function subtract(out, a, b) {
        out.r = a.r - b.r;
        out.g = a.g - b.g;
        out.b = a.b - b.b;
        out.a = a.a - b.a;
        return out;
      }
      /**
       * @zh 逐通道颜色乘法
       */

    }, {
      key: "multiply",
      value: function multiply(out, a, b) {
        out.r = a.r * b.r;
        out.g = a.g * b.g;
        out.b = a.b * b.b;
        out.a = a.a * b.a;
        return out;
      }
      /**
       * @zh 逐通道颜色除法
       */

    }, {
      key: "divide",
      value: function divide(out, a, b) {
        out.r = a.r / b.r;
        out.g = a.g / b.g;
        out.b = a.b / b.b;
        out.a = a.a / b.a;
        return out;
      }
      /**
       * @zh 全通道统一缩放颜色
       */

    }, {
      key: "scale",
      value: function scale(out, a, b) {
        out.r = a.r * b;
        out.g = a.g * b;
        out.b = a.b * b;
        out.a = a.a * b;
        return out;
      }
      /**
       * @zh 逐通道颜色线性插值：A + t * (B - A)
       */

    }, {
      key: "lerp",
      value: function lerp(out, from, to, ratio) {
        var r = from.r;
        var g = from.g;
        var b = from.b;
        var a = from.a;
        r = r + (to.r - r) * ratio;
        g = g + (to.g - g) * ratio;
        b = b + (to.b - b) * ratio;
        a = a + (to.a - a) * ratio;
        out._val = Math.floor((a << 24 >>> 0) + (b << 16) + (g << 8) + r);
        return out;
      }
      /**
       * @zh 颜色转数组
       * @param ofs 数组起始偏移量
       */

    }, {
      key: "toArray",
      value: function toArray(out, a) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var scale = a instanceof Color || a.a > 1 ? 1 / 255 : 1;
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

    }, {
      key: "fromArray",
      value: function fromArray(arr, out) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out.r = arr[ofs + 0] * 255;
        out.g = arr[ofs + 1] * 255;
        out.b = arr[ofs + 2] * 255;
        out.a = arr[ofs + 3] * 255;
        return out;
      }
      /**
       * @zh 颜色等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
      }
      /**
       * @zh 排除浮点数误差的颜色近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        return Math.abs(a.r - b.r) <= epsilon * Math.max(1.0, Math.abs(a.r), Math.abs(b.r)) && Math.abs(a.g - b.g) <= epsilon * Math.max(1.0, Math.abs(a.g), Math.abs(b.g)) && Math.abs(a.b - b.b) <= epsilon * Math.max(1.0, Math.abs(a.b), Math.abs(b.b)) && Math.abs(a.a - b.a) <= epsilon * Math.max(1.0, Math.abs(a.a), Math.abs(b.a));
      }
      /**
       * @zh 获取指定颜色的整型数据表示
       */

    }, {
      key: "hex",
      value: function hex(a) {
        return (a.r * 255 << 24 | a.g * 255 << 16 | a.b * 255 << 8 | a.a * 255) >>> 0;
      }
    }]);

    function Color(r, g, b, a) {
      var _this;

      _classCallCheck(this, Color);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Color).call(this));
      _this._val = 0;

      if (typeof r === 'string') {
        _this.fromHEX(r);
      } else if (g !== undefined) {
        _this.set(r, g, b, a);
      } else {
        _this.set(r);
      }

      return _this;
    }
    /**
     * @zh 克隆当前颜色。
     */


    _createClass(Color, [{
      key: "clone",
      value: function clone() {
        var ret = new Color();
        ret._val = this._val;
        return ret;
      }
      /**
       * @zh 判断当前颜色是否与指定颜色相等。
       * @param other 相比较的颜色。
       * @returns 两颜色的各通道都相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        return other && this._val === other._val;
      }
      /**
       * @zh 根据指定的插值比率，从当前颜色到目标颜色之间做插值。
       * @param to 目标颜色。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        var r = this.r;
        var g = this.g;
        var b = this.b;
        var a = this.a;
        r = r + (to.r - r) * ratio;
        g = g + (to.g - g) * ratio;
        b = b + (to.b - b) * ratio;
        a = a + (to.a - a) * ratio;
        this._val = Math.floor((a << 24 >>> 0) + (b << 16) + (g << 8) + r);
        return this;
      }
      /**
       * @zh 返回当前颜色的字符串表示。
       * @returns 当前颜色的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return 'rgba(' + this.r.toFixed() + ', ' + this.g.toFixed() + ', ' + this.b.toFixed() + ', ' + this.a.toFixed() + ')';
      }
      /**
       * @zh 将当前颜色转换为 CSS 格式。
       * @param opt 格式选项。
       * @returns 当前颜色的 CSS 格式。
       */

    }, {
      key: "toCSS",
      value: function toCSS(opt) {
        if (opt === 'rgba') {
          return 'rgba(' + (this.r | 0) + ',' + (this.g | 0) + ',' + (this.b | 0) + ',' + (this.a * toFloat).toFixed(2) + ')';
        } else if (opt === 'rgb') {
          return 'rgb(' + (this.r | 0) + ',' + (this.g | 0) + ',' + (this.b | 0) + ')';
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

    }, {
      key: "fromHEX",
      value: function fromHEX(hexString) {
        hexString = hexString.indexOf('#') === 0 ? hexString.substring(1) : hexString;
        var r = parseInt(hexString.substr(0, 2), 16) || 0;
        var g = parseInt(hexString.substr(2, 2), 16) || 0;
        var b = parseInt(hexString.substr(4, 2), 16) || 0;
        var a = parseInt(hexString.substr(6, 2), 16) || 255;
        this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
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
       * color.toHEX("#rgb");      // "f00";
       * color.toHEX("#rrggbbaa"); // "ff0e00"
       * color.toHEX("#rrggbb");   // "ff0e00ff"
       * ```
       */

    }, {
      key: "toHEX",
      value: function toHEX(fmt) {
        var prefix = '0';
        var hex = [(this.r < 16 ? prefix : '') + (this.r | 0).toString(16), (this.g < 16 ? prefix : '') + (this.g | 0).toString(16), (this.b < 16 ? prefix : '') + (this.b | 0).toString(16)];
        var i = -1;

        if (fmt === '#rgb') {
          for (i = 0; i < hex.length; ++i) {
            if (hex[i].length > 1) {
              hex[i] = hex[i][0];
            }
          }
        } else if (fmt === '#rrggbb') {
          for (i = 0; i < hex.length; ++i) {
            if (hex[i].length === 1) {
              hex[i] = '0' + hex[i];
            }
          }
        } else if (fmt === '#rrggbbaa') {
          hex.push((this.a < 16 ? prefix : '') + (this.a | 0).toString(16));
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

    }, {
      key: "toRGBValue",
      value: function toRGBValue() {
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

    }, {
      key: "fromHSV",
      value: function fromHSV(h, s, v) {
        var r = 0;
        var g = 0;
        var b = 0;

        if (s === 0) {
          r = g = b = v;
        } else {
          if (v === 0) {
            r = g = b = 0;
          } else {
            if (h === 1) {
              h = 0;
            }

            h *= 6;
            s = s;
            v = v;
            var i = Math.floor(h);
            var f = h - i;
            var p = v * (1 - s);
            var q = v * (1 - s * f);
            var t = v * (1 - s * (1 - f));

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
        this._val = (this.a << 24 >>> 0) + (b << 16) + (g << 8) + r;
        return this;
      }
      /**
       * @zh 转换当前颜色为 HSV 颜色。
       * @returns HSV 颜色。成员 `h`、`s`、`v` 分别代表 HSV 颜色的 H、S、V 通道。
       * @example
       * ```
       * import { Color } from 'cc';
       * const color = Color.YELLOW;
       * color.toHSV(); // {h: 0.1533864541832669, s: 0.9843137254901961, v: 1}
       * ```
       */

    }, {
      key: "toHSV",
      value: function toHSV() {
        var r = this.r * toFloat;
        var g = this.g * toFloat;
        var b = this.b * toFloat;
        var hsv = {
          h: 0,
          s: 0,
          v: 0
        };
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var delta = 0;
        hsv.v = max;
        hsv.s = max ? (max - min) / max : 0;

        if (!hsv.s) {
          hsv.h = 0;
        } else {
          delta = max - min;

          if (r === max) {
            hsv.h = (g - b) / delta;
          } else if (g === max) {
            hsv.h = 2 + (b - r) / delta;
          } else {
            hsv.h = 4 + (r - g) / delta;
          }

          hsv.h /= 6;

          if (hsv.h < 0) {
            hsv.h += 1.0;
          }
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

    }, {
      key: "set",
      value: function set(r, g, b, a) {
        if (_typeof(r) === 'object') {
          if (r._val != null) {
            this._val = r._val;
          } else {
            g = r.g || 0;
            b = r.b || 0;
            a = typeof r.a === 'number' ? r.a : 255;
            r = r.r || 0;
            this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
          }
        } else {
          r = r || 0;
          g = g || 0;
          b = b || 0;
          a = typeof a === 'number' ? a : 255;
          this._val = (a << 24 >>> 0) + (b << 16) + (g << 8) + r;
        }

        return this;
      }
      /**
       * @zh 将当前颜色乘以与指定颜色
       * @param other 指定的颜色。
       */

    }, {
      key: "multiply",
      value: function multiply(other) {
        var r = (this._val & 0x000000ff) * other.r >> 8;
        var g = (this._val & 0x0000ff00) * other.g >> 8;
        var b = (this._val & 0x00ff0000) * other.b >> 8;
        var a = ((this._val & 0xff000000) >>> 8) * other.a;
        this._val = a & 0xff000000 | b & 0x00ff0000 | g & 0x0000ff00 | r & 0x000000ff;
        return this;
      }
    }, {
      key: "_set_r_unsafe",
      value: function _set_r_unsafe(red) {
        this._val = (this._val & 0xffffff00 | red) >>> 0;
        return this;
      }
    }, {
      key: "_set_g_unsafe",
      value: function _set_g_unsafe(green) {
        this._val = (this._val & 0xffff00ff | green << 8) >>> 0;
        return this;
      }
    }, {
      key: "_set_b_unsafe",
      value: function _set_b_unsafe(blue) {
        this._val = (this._val & 0xff00ffff | blue << 16) >>> 0;
        return this;
      }
    }, {
      key: "_set_a_unsafe",
      value: function _set_a_unsafe(alpha) {
        this._val = (this._val & 0x00ffffff | alpha << 24 >>> 0) >>> 0;
        return this;
      }
    }]);

    return Color;
  }(_valueType.ValueType);

  _exports.Color = Color;
  Color.WHITE = Object.freeze(new Color(255, 255, 255, 255));
  Color.GRAY = Object.freeze(new Color(127, 127, 127, 255));
  Color.BLACK = Object.freeze(new Color(0, 0, 0, 255));
  Color.TRANSPARENT = Object.freeze(new Color(0, 0, 0, 0));
  Color.RED = Object.freeze(new Color(255, 0, 0, 255));
  Color.GREEN = Object.freeze(new Color(0, 255, 0, 255));
  Color.BLUE = Object.freeze(new Color(0, 0, 255, 255));
  Color.CYAN = Object.freeze(new Color(0, 255, 255, 255));
  Color.MAGENTA = Object.freeze(new Color(255, 0, 255, 255));
  Color.YELLOW = Object.freeze(new Color(255, 255, 0, 255));

  _class.CCClass.fastDefine('cc.Color', Color, {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  });

  _globalExports.legacyCC.Color = Color;

  function color(r, g, b, a) {
    return new Color(r, g, b, a);
  }

  _globalExports.legacyCC.color = color;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9jb2xvci50cyJdLCJuYW1lcyI6WyJ0b0Zsb2F0IiwiQ29sb3IiLCJfdmFsIiwicmVkIiwiZ3JlZW4iLCJibHVlIiwiYWxwaGEiLCJyIiwidmFsdWUiLCJnIiwiYiIsImEiLCJvdXQiLCJoZXhTdHJpbmciLCJpbmRleE9mIiwic3Vic3RyaW5nIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJmcm9tIiwidG8iLCJyYXRpbyIsIk1hdGgiLCJmbG9vciIsIm9mcyIsInNjYWxlIiwiYXJyIiwiZXBzaWxvbiIsIkVQU0lMT04iLCJhYnMiLCJtYXgiLCJmcm9tSEVYIiwidW5kZWZpbmVkIiwic2V0IiwicmV0Iiwib3RoZXIiLCJ0b0ZpeGVkIiwib3B0IiwidG9IRVgiLCJmbXQiLCJwcmVmaXgiLCJoZXgiLCJ0b1N0cmluZyIsImkiLCJsZW5ndGgiLCJwdXNoIiwiam9pbiIsImgiLCJzIiwidiIsImYiLCJwIiwicSIsInQiLCJoc3YiLCJtaW4iLCJkZWx0YSIsIlZhbHVlVHlwZSIsIldISVRFIiwiT2JqZWN0IiwiZnJlZXplIiwiR1JBWSIsIkJMQUNLIiwiVFJBTlNQQVJFTlQiLCJSRUQiLCJHUkVFTiIsIkJMVUUiLCJDWUFOIiwiTUFHRU5UQSIsIllFTExPVyIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwibGVnYWN5Q0MiLCJjb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0NBLE1BQU1BLE9BQU8sR0FBRyxJQUFJLEdBQXBCO0FBRUE7Ozs7O01BSWFDLEs7Ozs7OztBQXFMVDs7OzBCQUdTO0FBQ0wsZUFBTyxLQUFLQyxJQUFMLEdBQVksVUFBbkI7QUFDSCxPO3dCQUVNQyxHLEVBQUs7QUFDUkEsUUFBQUEsR0FBRyxHQUFHLENBQUMsQ0FBQyxrQkFBTUEsR0FBTixFQUFXLENBQVgsRUFBYyxHQUFkLENBQVI7QUFDQSxhQUFLRCxJQUFM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RUFBcUIsR0FBckIsQ0FBZCxDO0FBUlpBLEVBQUFBLEssQ0FTS2lFLEksR0FBT1IsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBSTFELEtBQUosQ0FBVSxDQUFWLEVBQWEsR0FBYixFQUFrQixHQUFsQixFQUF1QixHQUF2QixDQUFkLEM7QUFUWkEsRUFBQUEsSyxDQVVLa0UsTyxHQUFVVCxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFJMUQsS0FBSixDQUFVLEdBQVYsRUFBZSxDQUFmLEVBQWtCLEdBQWxCLEVBQXVCLEdBQXZCLENBQWQsQztBQVZmQSxFQUFBQSxLLENBV0ttRSxNLEdBQVNWLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUkxRCxLQUFKLENBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsQ0FBcEIsRUFBdUIsR0FBdkIsQ0FBZCxDOztBQTBrQjNCb0UsaUJBQVFDLFVBQVIsQ0FBbUIsVUFBbkIsRUFBK0JyRSxLQUEvQixFQUFzQztBQUFFTSxJQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRRSxJQUFBQSxDQUFDLEVBQUUsQ0FBWDtBQUFjQyxJQUFBQSxDQUFDLEVBQUUsQ0FBakI7QUFBb0JDLElBQUFBLENBQUMsRUFBRTtBQUF2QixHQUF0Qzs7QUFDQTRELDBCQUFTdEUsS0FBVCxHQUFpQkEsS0FBakI7O0FBS08sV0FBU3VFLEtBQVQsQ0FBZ0JqRSxDQUFoQixFQUE2Q0UsQ0FBN0MsRUFBeURDLENBQXpELEVBQXFFQyxDQUFyRSxFQUFpRjtBQUNwRixXQUFPLElBQUlWLEtBQUosQ0FBVU0sQ0FBVixFQUFvQkUsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTBCQyxDQUExQixDQUFQO0FBQ0g7O0FBRUQ0RCwwQkFBU0MsS0FBVCxHQUFpQkEsS0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvbWF0aFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9kYXRhL2NsYXNzJztcclxuaW1wb3J0IHsgVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmFsdWUtdHlwZSc7XHJcbmltcG9ydCB7IElDb2xvckxpa2UgfSBmcm9tICcuL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgY2xhbXAsIEVQU0lMT04gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCB0b0Zsb2F0ID0gMSAvIDI1NTtcclxuXHJcbi8qKlxyXG4gKiBAemgg6YCa6L+HIFJlZOOAgUdyZWVu44CBQmx1ZSDpopzoibLpgJrpgZPooajnpLrpopzoibLvvIzlubbpgJrov4cgQWxwaGEg6YCa6YGT6KGo56S65LiN6YCP5piO5bqm44CCPGJyLz5cclxuICog5q+P5Liq6YCa6YGT6YO95Li65Y+W5YC86IyD5Zu0IFswLCAyNTVdIOeahOaVtOaVsOOAgjxici8+XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ29sb3IgZXh0ZW5kcyBWYWx1ZVR5cGUge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgV0hJVEUgPSBPYmplY3QuZnJlZXplKG5ldyBDb2xvcigyNTUsIDI1NSwgMjU1LCAyNTUpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgR1JBWSA9IE9iamVjdC5mcmVlemUobmV3IENvbG9yKDEyNywgMTI3LCAxMjcsIDI1NSkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBCTEFDSyA9IE9iamVjdC5mcmVlemUobmV3IENvbG9yKDAsIDAsIDAsIDI1NSkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBUUkFOU1BBUkVOVCA9IE9iamVjdC5mcmVlemUobmV3IENvbG9yKDAsIDAsIDAsIDApKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgUkVEID0gT2JqZWN0LmZyZWV6ZShuZXcgQ29sb3IoMjU1LCAwLCAwLCAyNTUpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgR1JFRU4gPSBPYmplY3QuZnJlZXplKG5ldyBDb2xvcigwLCAyNTUsIDAsIDI1NSkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBCTFVFID0gT2JqZWN0LmZyZWV6ZShuZXcgQ29sb3IoMCwgMCwgMjU1LCAyNTUpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgQ1lBTiA9IE9iamVjdC5mcmVlemUobmV3IENvbG9yKDAsIDI1NSwgMjU1LCAyNTUpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgTUFHRU5UQSA9IE9iamVjdC5mcmVlemUobmV3IENvbG9yKDI1NSwgMCwgMjU1LCAyNTUpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgWUVMTE9XID0gT2JqZWN0LmZyZWV6ZShuZXcgQ29sb3IoMjU1LCAyNTUsIDAsIDI1NSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiOt+W+l+aMh+WumuminOiJsueahOaLt+i0nVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsb25lPE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICBjb25zdCBvdXQgPSBuZXcgQ29sb3IoKTtcclxuICAgICAgICBpZiAoYS5fdmFsKSB7XHJcbiAgICAgICAgICAgIG91dC5fdmFsID0gYS5fdmFsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC5fdmFsID0gKChhLmEgPDwgMjQpID4+PiAwKSArIChhLmIgPDwgMTYpICsgKGEuZyA8PCA4KSArIGEucjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlpI3liLbnm67moIfpopzoibJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0LnIgPSBhLnI7XHJcbiAgICAgICAgb3V0LmcgPSBhLmc7XHJcbiAgICAgICAgb3V0LmIgPSBhLmI7XHJcbiAgICAgICAgb3V0LmEgPSBhLmE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7popzoibLlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQ8T3V0IGV4dGVuZHMgSUNvbG9yTGlrZT4gKG91dDogT3V0LCByOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQuciA9IHI7XHJcbiAgICAgICAgb3V0LmcgPSBnO1xyXG4gICAgICAgIG91dC5iID0gYjtcclxuICAgICAgICBvdXQuYSA9IGE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDku47ljYHlha3ov5vliLbpopzoibLlrZfnrKbkuLLkuK3or7vlhaXpopzoibLliLAgb3V0IOS4rVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21IRVg8T3V0IGV4dGVuZHMgSUNvbG9yTGlrZT4gKG91dDogT3V0LCBoZXhTdHJpbmc6IHN0cmluZykge1xyXG4gICAgICAgIGhleFN0cmluZyA9IChoZXhTdHJpbmcuaW5kZXhPZignIycpID09PSAwKSA/IGhleFN0cmluZy5zdWJzdHJpbmcoMSkgOiBoZXhTdHJpbmc7XHJcbiAgICAgICAgb3V0LnIgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDAsIDIpLCAxNikgfHwgMDtcclxuICAgICAgICBvdXQuZyA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoMiwgMiksIDE2KSB8fCAwO1xyXG4gICAgICAgIG91dC5iID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cig0LCAyKSwgMTYpIHx8IDA7XHJcbiAgICAgICAgb3V0LmEgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDYsIDIpLCAxNikgfHwgMjU1O1xyXG4gICAgICAgIG91dC5fdmFsID0gKChvdXQuYSA8PCAyNCkgPj4+IDApICsgKG91dC5iIDw8IDE2KSArIChvdXQuZyA8PCA4KSArIG91dC5yO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ6YCa6YGT6aKc6Imy5Yqg5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYWRkPE91dCBleHRlbmRzIElDb2xvckxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQuciA9IGEuciArIGIucjtcclxuICAgICAgICBvdXQuZyA9IGEuZyArIGIuZztcclxuICAgICAgICBvdXQuYiA9IGEuYiArIGIuYjtcclxuICAgICAgICBvdXQuYSA9IGEuYSArIGIuYTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOmAmumBk+minOiJsuWHj+azlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN1YnRyYWN0PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQuciA9IGEuciAtIGIucjtcclxuICAgICAgICBvdXQuZyA9IGEuZyAtIGIuZztcclxuICAgICAgICBvdXQuYiA9IGEuYiAtIGIuYjtcclxuICAgICAgICBvdXQuYSA9IGEuYSAtIGIuYTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOmAmumBk+minOiJsuS5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQuciA9IGEuciAqIGIucjtcclxuICAgICAgICBvdXQuZyA9IGEuZyAqIGIuZztcclxuICAgICAgICBvdXQuYiA9IGEuYiAqIGIuYjtcclxuICAgICAgICBvdXQuYSA9IGEuYSAqIGIuYTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOmAmumBk+minOiJsumZpOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpdmlkZTxPdXQgZXh0ZW5kcyBJQ29sb3JMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgb3V0LnIgPSBhLnIgLyBiLnI7XHJcbiAgICAgICAgb3V0LmcgPSBhLmcgLyBiLmc7XHJcbiAgICAgICAgb3V0LmIgPSBhLmIgLyBiLmI7XHJcbiAgICAgICAgb3V0LmEgPSBhLmEgLyBiLmE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhajpgJrpgZPnu5/kuIDnvKnmlL7popzoibJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZTxPdXQgZXh0ZW5kcyBJQ29sb3JMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnIgPSBhLnIgKiBiO1xyXG4gICAgICAgIG91dC5nID0gYS5nICogYjtcclxuICAgICAgICBvdXQuYiA9IGEuYiAqIGI7XHJcbiAgICAgICAgb3V0LmEgPSBhLmEgKiBiO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ6YCa6YGT6aKc6Imy57q/5oCn5o+S5YC877yaQSArIHQgKiAoQiAtIEEpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycDxPdXQgZXh0ZW5kcyBJQ29sb3JMaWtlPiAob3V0OiBPdXQsIGZyb206IE91dCwgdG86IE91dCwgcmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIGxldCByID0gZnJvbS5yO1xyXG4gICAgICAgIGxldCBnID0gZnJvbS5nO1xyXG4gICAgICAgIGxldCBiID0gZnJvbS5iO1xyXG4gICAgICAgIGxldCBhID0gZnJvbS5hO1xyXG4gICAgICAgIHIgPSByICsgKHRvLnIgLSByKSAqIHJhdGlvO1xyXG4gICAgICAgIGcgPSBnICsgKHRvLmcgLSBnKSAqIHJhdGlvO1xyXG4gICAgICAgIGIgPSBiICsgKHRvLmIgLSBiKSAqIHJhdGlvO1xyXG4gICAgICAgIGEgPSBhICsgKHRvLmEgLSBhKSAqIHJhdGlvO1xyXG4gICAgICAgIG91dC5fdmFsID0gTWF0aC5mbG9vcigoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpopzoibLovazmlbDnu4RcclxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9BcnJheTxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCBhOiBJQ29sb3JMaWtlLCBvZnMgPSAwKSB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGUgPSAoYSBpbnN0YW5jZW9mIENvbG9yIHx8IGEuYSA+IDEpID8gMSAvIDI1NSA6IDE7XHJcbiAgICAgICAgb3V0W29mcyArIDBdID0gYS5yICogc2NhbGU7XHJcbiAgICAgICAgb3V0W29mcyArIDFdID0gYS5nICogc2NhbGU7XHJcbiAgICAgICAgb3V0W29mcyArIDJdID0gYS5iICogc2NhbGU7XHJcbiAgICAgICAgb3V0W29mcyArIDNdID0gYS5hICogc2NhbGU7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmlbDnu4TovazpopzoibJcclxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbUFycmF5PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvdXQ6IE91dCwgb2ZzID0gMCkge1xyXG4gICAgICAgIG91dC5yID0gYXJyW29mcyArIDBdICogMjU1O1xyXG4gICAgICAgIG91dC5nID0gYXJyW29mcyArIDFdICogMjU1O1xyXG4gICAgICAgIG91dC5iID0gYXJyW29mcyArIDJdICogMjU1O1xyXG4gICAgICAgIG91dC5hID0gYXJyW29mcyArIDNdICogMjU1O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6aKc6Imy562J5Lu35Yik5patXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RyaWN0RXF1YWxzPE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBhLnIgPT09IGIuciAmJiBhLmcgPT09IGIuZyAmJiBhLmIgPT09IGIuYiAmJiBhLmEgPT09IGIuYTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmjpLpmaTmta7ngrnmlbDor6/lt67nmoTpopzoibLov5HkvLznrYnku7fliKTmlq1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBlcXVhbHM8T3V0IGV4dGVuZHMgSUNvbG9yTGlrZT4gKGE6IE91dCwgYjogT3V0LCBlcHNpbG9uID0gRVBTSUxPTikge1xyXG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoYS5yIC0gYi5yKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnIpLCBNYXRoLmFicyhiLnIpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLmcgLSBiLmcpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEuZyksIE1hdGguYWJzKGIuZykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEuYiAtIGIuYikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5iKSwgTWF0aC5hYnMoYi5iKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5hIC0gYi5hKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLmEpLCBNYXRoLmFicyhiLmEpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6I635Y+W5oyH5a6a6aKc6Imy55qE5pW05Z6L5pWw5o2u6KGo56S6XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaGV4PE91dCBleHRlbmRzIElDb2xvckxpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gKChhLnIgKiAyNTUpIDw8IDI0IHwgKGEuZyAqIDI1NSkgPDwgMTYgfCAoYS5iICogMjU1KSA8PCA4IHwgYS5hICogMjU1KSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5bmiJborr7nva7lvZPliY3popzoibLnmoQgUmVkIOmAmumBk+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbCAmIDB4MDAwMDAwZmY7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHIgKHJlZCkge1xyXG4gICAgICAgIHJlZCA9IH5+Y2xhbXAocmVkLCAwLCAyNTUpO1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHhmZmZmZmYwMCkgfCByZWQpID4+PiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiOt+WPluaIluiuvue9ruW9k+WJjeminOiJsueahCBHcmVlbiDpgJrpgZPjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGcgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fdmFsICYgMHgwMDAwZmYwMCkgPj4gODtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZyAoZ3JlZW4pIHtcclxuICAgICAgICBncmVlbiA9IH5+Y2xhbXAoZ3JlZW4sIDAsIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gKCh0aGlzLl92YWwgJiAweGZmZmYwMGZmKSB8IChncmVlbiA8PCA4KSkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6I635Y+W5oiW6K6+572u5b2T5YmN6aKc6Imy55qEIEJsdWUg6YCa6YGT44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBiICgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3ZhbCAmIDB4MDBmZjAwMDApID4+IDE2O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBiIChibHVlKSB7XHJcbiAgICAgICAgYmx1ZSA9IH5+Y2xhbXAoYmx1ZSwgMCwgMjU1KTtcclxuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4ZmYwMGZmZmYpIHwgKGJsdWUgPDwgMTYpKSA+Pj4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5bmiJborr7nva7lvZPliY3popzoibLnmoQgQWxwaGEg6YCa6YGT44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBhICgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3ZhbCAmIDB4ZmYwMDAwMDApID4+PiAyNDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYSAoYWxwaGEpIHtcclxuICAgICAgICBhbHBoYSA9IH5+Y2xhbXAoYWxwaGEsIDAsIDI1NSk7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gKCh0aGlzLl92YWwgJiAweDAwZmZmZmZmKSB8ICgoYWxwaGEgPDwgMjQpID4+PiAwKSkgPj4+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29tcGF0aWJpbGl0eSB3aXRoIHZlY3RvciBpbnRlcmZhY2VzXHJcbiAgICBnZXQgeCAoKSB7IHJldHVybiB0aGlzLnIgKiB0b0Zsb2F0OyB9XHJcbiAgICBzZXQgeCAodmFsdWUpIHsgdGhpcy5yID0gdmFsdWUgKiAyNTU7IH1cclxuICAgIGdldCB5ICgpIHsgcmV0dXJuIHRoaXMuZyAqIHRvRmxvYXQ7IH1cclxuICAgIHNldCB5ICh2YWx1ZSkgeyB0aGlzLmcgPSB2YWx1ZSAqIDI1NTsgfVxyXG4gICAgZ2V0IHogKCkgeyByZXR1cm4gdGhpcy5iICogdG9GbG9hdDsgfVxyXG4gICAgc2V0IHogKHZhbHVlKSB7IHRoaXMuYiA9IHZhbHVlICogMjU1OyB9XHJcbiAgICBnZXQgdyAoKSB7IHJldHVybiB0aGlzLmEgKiB0b0Zsb2F0OyB9XHJcbiAgICBzZXQgdyAodmFsdWUpIHsgdGhpcy5hID0gdmFsdWUgKiAyNTU7IH1cclxuXHJcbiAgICBwdWJsaWMgX3ZhbCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDkuI7mjIflrprpopzoibLnm7jnrYnnmoTpopzoibLjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG90aGVyOiBDb2xvcik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg55So5Y2B5YWt6L+b5Yi26aKc6Imy5a2X56ym5Liy5Lit5p6E6YCg6aKc6Imy44CCXHJcbiAgICAgKiBAcGFyYW0gaGV4U3RyaW5nIOWNgeWFrei/m+WItuminOiJsuWtl+espuS4suOAglxyXG4gICAgICovXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHVuaWZpZWQtc2lnbmF0dXJlc1xyXG4gICAgY29uc3RydWN0b3IgKGhleFN0cmluZzogc3RyaW5nKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmnoTpgKDlhbfmnInmjIflrprpgJrpgZPnmoTpopzoibLjgIJcclxuICAgICAqIEBwYXJhbSBbcj0wXSDmjIflrprnmoQgUmVkIOmAmumBk+OAglxyXG4gICAgICogQHBhcmFtIFtnPTBdIOaMh+WumueahCBHcmVlbiDpgJrpgZPjgIJcclxuICAgICAqIEBwYXJhbSBbYj0wXSDmjIflrprnmoQgQmx1ZSDpgJrpgZPjgIJcclxuICAgICAqIEBwYXJhbSBbYT0yNTVdIOaMh+WumueahCBBbHBoYSDpgJrpgZPjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHI/OiBudW1iZXIsIGc/OiBudW1iZXIsIGI/OiBudW1iZXIsIGE/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyPzogbnVtYmVyIHwgQ29sb3IgfCBzdHJpbmcsIGc/OiBudW1iZXIsIGI/OiBudW1iZXIsIGE/OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgciA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5mcm9tSEVYKHIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KHIgYXMgbnVtYmVyLCBnLCBiLCBhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldChyIGFzIENvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5YWL6ZqG5b2T5YmN6aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENvbG9yKCk7XHJcbiAgICAgICAgcmV0Ll92YWwgPSB0aGlzLl92YWw7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3popzoibLmmK/lkKbkuI7mjIflrprpopzoibLnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTpopzoibLjgIJcclxuICAgICAqIEByZXR1cm5zIOS4pOminOiJsueahOWQhOmAmumBk+mDveebuOetieaXtui/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzIChvdGhlcjogQ29sb3IpIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy5fdmFsID09PSBvdGhlci5fdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruaMh+WumueahOaPkuWAvOavlOeOh++8jOS7juW9k+WJjeminOiJsuWIsOebruagh+minOiJsuS5i+mXtOWBmuaPkuWAvOOAglxyXG4gICAgICogQHBhcmFtIHRvIOebruagh+minOiJsuOAglxyXG4gICAgICogQHBhcmFtIHJhdGlvIOaPkuWAvOavlOeOh++8jOiMg+WbtOS4uiBbMCwxXeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVycCAodG86IENvbG9yLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHIgPSB0aGlzLnI7XHJcbiAgICAgICAgbGV0IGcgPSB0aGlzLmc7XHJcbiAgICAgICAgbGV0IGIgPSB0aGlzLmI7XHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmE7XHJcbiAgICAgICAgciA9IHIgKyAodG8uciAtIHIpICogcmF0aW87XHJcbiAgICAgICAgZyA9IGcgKyAodG8uZyAtIGcpICogcmF0aW87XHJcbiAgICAgICAgYiA9IGIgKyAodG8uYiAtIGIpICogcmF0aW87XHJcbiAgICAgICAgYSA9IGEgKyAodG8uYSAtIGEpICogcmF0aW87XHJcbiAgICAgICAgdGhpcy5fdmFsID0gTWF0aC5mbG9vcigoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6L+U5Zue5b2T5YmN6aKc6Imy55qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3popzoibLnmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gJ3JnYmEoJyArXHJcbiAgICAgICAgICAgIHRoaXMuci50b0ZpeGVkKCkgKyAnLCAnICtcclxuICAgICAgICAgICAgdGhpcy5nLnRvRml4ZWQoKSArICcsICcgK1xyXG4gICAgICAgICAgICB0aGlzLmIudG9GaXhlZCgpICsgJywgJyArXHJcbiAgICAgICAgICAgIHRoaXMuYS50b0ZpeGVkKCkgKyAnKSc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5b2T5YmN6aKc6Imy6L2s5o2i5Li6IENTUyDmoLzlvI/jgIJcclxuICAgICAqIEBwYXJhbSBvcHQg5qC85byP6YCJ6aG544CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3popzoibLnmoQgQ1NTIOagvOW8j+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9DU1MgKG9wdDogJ3JnYmEnIHwgJ3JnYicgfCAnI3JyZ2diYicgfCAnI3JyZ2diYmFhJykge1xyXG4gICAgICAgIGlmIChvcHQgPT09ICdyZ2JhJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JnYmEoJyArXHJcbiAgICAgICAgICAgICAgICAodGhpcy5yIHwgMCkgKyAnLCcgK1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuZyB8IDApICsgJywnICtcclxuICAgICAgICAgICAgICAgICh0aGlzLmIgfCAwKSArICcsJyArXHJcbiAgICAgICAgICAgICAgICAodGhpcy5hICogdG9GbG9hdCkudG9GaXhlZCgyKSArICcpJ1xyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0ID09PSAncmdiJykge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3JnYignICtcclxuICAgICAgICAgICAgICAgICh0aGlzLnIgfCAwKSArICcsJyArXHJcbiAgICAgICAgICAgICAgICAodGhpcy5nIHwgMCkgKyAnLCcgK1xyXG4gICAgICAgICAgICAgICAgKHRoaXMuYiB8IDApICsgJyknXHJcbiAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICcjJyArIHRoaXMudG9IRVgob3B0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LuO5Y2B5YWt6L+b5Yi26aKc6Imy5a2X56ym5Liy5Lit6K+75YWl5b2T5YmN6aKc6Imy44CCPGJyLz5cclxuICAgICAqIOWNgeWFrei/m+WItuminOiJsuWtl+espuS4suW6lOivpeS7peWPr+mAieeahCBcIiNcIiDlvIDlpLTvvIzntKfot5/mnIDlpJogOCDkuKrku6PooajljYHlha3ov5vliLbmlbDlrZfnmoTlrZfnrKbvvJs8YnIvPlxyXG4gICAgICog5q+P5Lik5Liq6L+e57ut5a2X56ym5Luj6KGo55qE5pWw5YC85L6d5qyh5L2c5Li6IFJlZOOAgUdyZWVu44CBQmx1ZSDlkowgQWxwaGEg6YCa6YGT77ybPGJyLz5cclxuICAgICAqIOe8uuecgeeahOminOiJsumAmumBk+WwhuinhuS4uiAw77yb57y655yB55qE6YCP5piO6YCa6YGT5bCG6KeG5Li6IDI1NeOAgjxici8+XHJcbiAgICAgKiBAcGFyYW0gaGV4U3RyaW5nIOWNgeWFrei/m+WItuminOiJsuWtl+espuS4suOAglxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmcm9tSEVYIChoZXhTdHJpbmc6IHN0cmluZykge1xyXG4gICAgICAgIGhleFN0cmluZyA9IChoZXhTdHJpbmcuaW5kZXhPZignIycpID09PSAwKSA/IGhleFN0cmluZy5zdWJzdHJpbmcoMSkgOiBoZXhTdHJpbmc7XHJcbiAgICAgICAgY29uc3QgciA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoMCwgMiksIDE2KSB8fCAwO1xyXG4gICAgICAgIGNvbnN0IGcgPSBwYXJzZUludChoZXhTdHJpbmcuc3Vic3RyKDIsIDIpLCAxNikgfHwgMDtcclxuICAgICAgICBjb25zdCBiID0gcGFyc2VJbnQoaGV4U3RyaW5nLnN1YnN0cig0LCAyKSwgMTYpIHx8IDA7XHJcbiAgICAgICAgY29uc3QgYSA9IHBhcnNlSW50KGhleFN0cmluZy5zdWJzdHIoNiwgMiksIDE2KSB8fCAyNTU7XHJcbiAgICAgICAgdGhpcy5fdmFsID0gKChhIDw8IDI0KSA+Pj4gMCkgKyAoYiA8PCAxNikgKyAoZyA8PCA4KSArIHI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6L2s5o2i5b2T5YmN6aKc6Imy5Li65Y2B5YWt6L+b5Yi26aKc6Imy5a2X56ym5Liy44CCXHJcbiAgICAgKiBAcGFyYW0gZm10IOagvOW8j+mAiemhueOAglxyXG4gICAgICogLSBgJyNycmdnYmJhYSdgIOiOt+WPllJlZOOAgUdyZWVu44CBQmx1ZeOAgUFscGhh6YCa6YGT55qE5Y2B5YWt6L+b5Yi25YC877yIKirkuKTkvY0qKu+8jOmrmOS9jeihpSAw77yJ5bm25L6d5qyh6L+e5o6l77ybXHJcbiAgICAgKiAtIGAnI3JyZ2diYmAg5LiOIGAnI3JyZ2diYmFhJ2Ag57G75Ly85L2G5LiN5YyF5ousIEFscGhhIOmAmumBk+OAglxyXG4gICAgICogQHJldHVybnMg5Y2B5YWt6L+b5Yi26aKc6Imy5a2X56ym5Liy44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBjb25zdCBjb2xvciA9IG5ldyBDb2xvcigyNTUsIDE0LCAwLCAyNTUpO1xyXG4gICAgICogY29sb3IudG9IRVgoXCIjcmdiXCIpOyAgICAgIC8vIFwiZjAwXCI7XHJcbiAgICAgKiBjb2xvci50b0hFWChcIiNycmdnYmJhYVwiKTsgLy8gXCJmZjBlMDBcIlxyXG4gICAgICogY29sb3IudG9IRVgoXCIjcnJnZ2JiXCIpOyAgIC8vIFwiZmYwZTAwZmZcIlxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b0hFWCAoZm10OiAnI3JnYicgfCAnI3JyZ2diYicgfCAnI3JyZ2diYmFhJykge1xyXG4gICAgICAgIGxldCBwcmVmaXggPSAnMCc7XHJcbiAgICAgICAgY29uc3QgaGV4ID0gW1xyXG4gICAgICAgICAgICAodGhpcy5yIDwgMTYgPyBwcmVmaXggOiAnJykgKyAodGhpcy5yIHwgMCkudG9TdHJpbmcoMTYpLFxyXG4gICAgICAgICAgICAodGhpcy5nIDwgMTYgPyBwcmVmaXggOiAnJykgKyAodGhpcy5nIHwgMCkudG9TdHJpbmcoMTYpLFxyXG4gICAgICAgICAgICAodGhpcy5iIDwgMTYgPyBwcmVmaXggOiAnJykgKyAodGhpcy5iIHwgMCkudG9TdHJpbmcoMTYpLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IGkgPSAtMTtcclxuICAgICAgICBpZiAoIGZtdCA9PT0gJyNyZ2InICkge1xyXG4gICAgICAgICAgICBmb3IgKCBpID0gMDsgaSA8IGhleC5sZW5ndGg7ICsraSApIHtcclxuICAgICAgICAgICAgICAgIGlmICggaGV4W2ldLmxlbmd0aCA+IDEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGV4W2ldID0gaGV4W2ldWzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGZtdCA9PT0gJyNycmdnYmInKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBoZXgubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGlmIChoZXhbaV0ubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGV4W2ldID0gJzAnICsgaGV4W2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChmbXQgPT09ICcjcnJnZ2JiYWEnKSB7XHJcbiAgICAgICAgICAgIGhleC5wdXNoKCh0aGlzLmEgPCAxNiA/IHByZWZpeCA6ICcnKSArICh0aGlzLmEgfCAwKS50b1N0cmluZygxNikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGV4LmpvaW4oJycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeminOiJsui9rOaNouS4uiBSR0Ig5pW05pWw5YC844CCXHJcbiAgICAgKiBAcmV0dXJucyBSR0Ig5pW05pWw5YC844CC5LuO5pyA5L2O5pyJ5pWI5L2N5byA5aeL77yM5q+POOS9jeWIhuWIq+aYryBSZWTjgIFHcmVlbuOAgUJsdWUg6YCa6YGT55qE5YC844CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBjb25zdCBjb2xvciA9IENvbG9yLllFTExPVztcclxuICAgICAqIGNvbG9yLnRvUkdCVmFsdWUoKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9SR0JWYWx1ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbCAmIDB4MDBmZmZmZmY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LuOIEhTViDpopzoibLkuK3or7vlhaXlvZPliY3popzoibLjgIJcclxuICAgICAqIEBwYXJhbSBoIEgg6YCa6YGT44CCXHJcbiAgICAgKiBAcGFyYW0gcyBTIOmAmumBk+OAglxyXG4gICAgICogQHBhcmFtIHYgViDpgJrpgZPjgIJcclxuICAgICAqIEByZXR1cm5zIGB0aGlzYFxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogY29uc3QgY29sb3IgPSBDb2xvci5ZRUxMT1c7XHJcbiAgICAgKiBjb2xvci5mcm9tSFNWKDAsIDAsIDEpOyAvLyBDb2xvciB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMjU1fTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZnJvbUhTViAoaDogbnVtYmVyLCBzOiBudW1iZXIsIHY6IG51bWJlcikge1xyXG4gICAgICAgIGxldCByID0gMDtcclxuICAgICAgICBsZXQgZyA9IDA7XHJcbiAgICAgICAgbGV0IGIgPSAwO1xyXG4gICAgICAgIGlmIChzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHIgPSBnID0gYiA9IHY7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHYgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHIgPSBnID0gYiA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaCA9PT0gMSkgeyBoID0gMDsgfVxyXG4gICAgICAgICAgICAgICAgaCAqPSA2O1xyXG4gICAgICAgICAgICAgICAgcyA9IHM7XHJcbiAgICAgICAgICAgICAgICB2ID0gdjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkgPSBNYXRoLmZsb29yKGgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZiA9IGggLSBpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IHYgKiAoMSAtIHMpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcSA9IHYgKiAoMSAtIChzICogZikpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IHYgKiAoMSAtIChzICogKDEgLSBmKSkpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gcTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA1OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZyA9IHA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGIgPSBxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByICo9IDI1NTtcclxuICAgICAgICBnICo9IDI1NTtcclxuICAgICAgICBiICo9IDI1NTtcclxuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuYSA8PCAyNCkgPj4+IDApICsgKGIgPDwgMTYpICsgKGcgPDwgOCkgKyByO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOi9rOaNouW9k+WJjeminOiJsuS4uiBIU1Yg6aKc6Imy44CCXHJcbiAgICAgKiBAcmV0dXJucyBIU1Yg6aKc6Imy44CC5oiQ5ZGYIGBoYOOAgWBzYOOAgWB2YCDliIbliKvku6PooaggSFNWIOminOiJsueahCBI44CBU+OAgVYg6YCa6YGT44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgXHJcbiAgICAgKiBpbXBvcnQgeyBDb2xvciB9IGZyb20gJ2NjJztcclxuICAgICAqIGNvbnN0IGNvbG9yID0gQ29sb3IuWUVMTE9XO1xyXG4gICAgICogY29sb3IudG9IU1YoKTsgLy8ge2g6IDAuMTUzMzg2NDU0MTgzMjY2OSwgczogMC45ODQzMTM3MjU0OTAxOTYxLCB2OiAxfVxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b0hTViAoKSB7XHJcbiAgICAgICAgY29uc3QgciA9IHRoaXMuciAqIHRvRmxvYXQ7XHJcbiAgICAgICAgY29uc3QgZyA9IHRoaXMuZyAqIHRvRmxvYXQ7XHJcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuYiAqIHRvRmxvYXQ7XHJcbiAgICAgICAgY29uc3QgaHN2ID0geyBoOiAwLCBzOiAwLCB2OiAwIH07XHJcbiAgICAgICAgY29uc3QgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XHJcbiAgICAgICAgY29uc3QgbWluID0gTWF0aC5taW4ociwgZywgYik7XHJcbiAgICAgICAgbGV0IGRlbHRhID0gMDtcclxuICAgICAgICBoc3YudiA9IG1heDtcclxuICAgICAgICBoc3YucyA9IG1heCA/IChtYXggLSBtaW4pIC8gbWF4IDogMDtcclxuICAgICAgICBpZiAoIWhzdi5zKSB7IGhzdi5oID0gMDsgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsdGEgPSBtYXggLSBtaW47XHJcbiAgICAgICAgICAgIGlmIChyID09PSBtYXgpIHtcclxuICAgICAgICAgICAgICAgIGhzdi5oID0gKGcgLSBiKSAvIGRlbHRhO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGcgPT09IG1heCkge1xyXG4gICAgICAgICAgICAgICAgaHN2LmggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaHN2LmggPSA0ICsgKHIgLSBnKSAvIGRlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGhzdi5oIC89IDY7XHJcbiAgICAgICAgICAgIGlmIChoc3YuaCA8IDApIHsgaHN2LmggKz0gMS4wOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBoc3Y7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN6aKc6Imy5L2/5YW25LiO5oyH5a6a6aKc6Imy55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE6aKc6Imy44CCXHJcbiAgICAgKiBAb3ZlcmxvYWQg6YeN6L29XHJcbiAgICAgKiBAcGFyYW0gW3I9MF0g5oyH5a6a55qEIFJlZCDpgJrpgZPvvIxbMC0yNTVd44CCXHJcbiAgICAgKiBAcGFyYW0gW2c9MF0g5oyH5a6a55qEIEdyZWVuIOmAmumBk+OAglxyXG4gICAgICogQHBhcmFtIFtiPTBdIOaMh+WumueahCBCbHVlIOmAmumBk+OAglxyXG4gICAgICogQHBhcmFtIFthPTI1NV0g5oyH5a6a55qEIEFscGhhIOmAmumBk+OAglxyXG4gICAgICogQHJldHVybnMg5b2T5YmN6aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQob3RoZXI6IENvbG9yKTogQ29sb3I7XHJcbiAgICBwdWJsaWMgc2V0KHI/OiBudW1iZXIsIGc/OiBudW1iZXIsIGI/OiBudW1iZXIsIGE/OiBudW1iZXIpOiBDb2xvcjtcclxuICAgIHB1YmxpYyBzZXQocj86IG51bWJlciB8IENvbG9yLCBnPzogbnVtYmVyLCBiPzogbnVtYmVyLCBhPzogbnVtYmVyKTogQ29sb3Ige1xyXG4gICAgICAgIGlmICh0eXBlb2YgciA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgaWYgKHIuX3ZhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWwgPSByLl92YWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBnID0gci5nIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBiID0gci5iIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBhID0gdHlwZW9mIHIuYSA9PT0gJ251bWJlcicgPyByLmEgOiAyNTU7XHJcbiAgICAgICAgICAgICAgICByID0gci5yIHx8IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92YWwgPSAoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHIgPSByIHx8IDA7XHJcbiAgICAgICAgICAgIGcgPSBnIHx8IDA7XHJcbiAgICAgICAgICAgIGIgPSBiIHx8IDA7XHJcbiAgICAgICAgICAgIGEgPSB0eXBlb2YgYSA9PT0gJ251bWJlcicgPyBhIDogMjU1O1xyXG4gICAgICAgICAgICB0aGlzLl92YWwgPSAoKGEgPDwgMjQpID4+PiAwKSArIChiIDw8IDE2KSArIChnIDw8IDgpICsgcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5b2T5YmN6aKc6Imy5LmY5Lul5LiO5oyH5a6a6aKc6ImyXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE6aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseSAob3RoZXI6IENvbG9yKSB7XHJcbiAgICAgICAgY29uc3QgciA9ICgodGhpcy5fdmFsICYgMHgwMDAwMDBmZikgKiBvdGhlci5yKSA+PiA4O1xyXG4gICAgICAgIGNvbnN0IGcgPSAoKHRoaXMuX3ZhbCAmIDB4MDAwMGZmMDApICogb3RoZXIuZykgPj4gODtcclxuICAgICAgICBjb25zdCBiID0gKCh0aGlzLl92YWwgJiAweDAwZmYwMDAwKSAqIG90aGVyLmIpID4+IDg7XHJcbiAgICAgICAgY29uc3QgYSA9ICgodGhpcy5fdmFsICYgMHhmZjAwMDAwMCkgPj4+IDgpICogb3RoZXIuYTtcclxuICAgICAgICB0aGlzLl92YWwgPSAoYSAmIDB4ZmYwMDAwMDApIHwgKGIgJiAweDAwZmYwMDAwKSB8IChnICYgMHgwMDAwZmYwMCkgfCAociAmIDB4MDAwMDAwZmYpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2V0X3JfdW5zYWZlIChyZWQpIHtcclxuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4ZmZmZmZmMDApIHwgcmVkKSA+Pj4gMDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3NldF9nX3Vuc2FmZSAoZ3JlZW4pIHtcclxuICAgICAgICB0aGlzLl92YWwgPSAoKHRoaXMuX3ZhbCAmIDB4ZmZmZjAwZmYpIHwgKGdyZWVuIDw8IDgpKSA+Pj4gMDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3NldF9iX3Vuc2FmZSAoYmx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHhmZjAwZmZmZikgfCAoYmx1ZSA8PCAxNikpID4+PiAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2V0X2FfdW5zYWZlIChhbHBoYSkge1xyXG4gICAgICAgIHRoaXMuX3ZhbCA9ICgodGhpcy5fdmFsICYgMHgwMGZmZmZmZikgfCAoKGFscGhhIDw8IDI0KSA+Pj4gMCkpID4+PiAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLkNvbG9yJywgQ29sb3IsIHsgcjogMCwgZzogMCwgYjogMCwgYTogMjU1IH0pO1xyXG5sZWdhY3lDQy5Db2xvciA9IENvbG9yO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yIChvdGhlcjogQ29sb3IgfCBzdHJpbmcpOiBDb2xvcjtcclxuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yIChyPzogbnVtYmVyLCBnPzogbnVtYmVyLCBiPzogbnVtYmVyLCBhPzogbnVtYmVyKTogQ29sb3I7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY29sb3IgKHI/OiBudW1iZXIgfCBDb2xvciB8IHN0cmluZywgZz86IG51bWJlciwgYj86IG51bWJlciwgYT86IG51bWJlcikge1xyXG4gICAgcmV0dXJuIG5ldyBDb2xvcihyIGFzIGFueSwgZywgYiwgYSk7XHJcbn1cclxuXHJcbmxlZ2FjeUNDLmNvbG9yID0gY29sb3I7XHJcbiJdfQ==