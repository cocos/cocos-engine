(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "./size.js", "./vec2.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("./size.js"), require("./vec2.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.size, global.vec2, global.globalExports);
    global.rect = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _size, _vec, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rect = rect;
  _exports.Rect = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * 轴对齐矩形。
   * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
   * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
   */
  var Rect = /*#__PURE__*/function (_ValueType) {
    _inherits(Rect, _ValueType);

    _createClass(Rect, [{
      key: "xMin",

      /**
       * 获取或设置矩形在 x 轴上的最小值。
       */
      get: function get() {
        return this.x;
      },
      set: function set(value) {
        this.width += this.x - value;
        this.x = value;
      }
      /**
       * 获取或设置矩形在 y 轴上的最小值。
       */

    }, {
      key: "yMin",
      get: function get() {
        return this.y;
      },
      set: function set(value) {
        this.height += this.y - value;
        this.y = value;
      }
      /**
       * 获取或设置矩形在 x 轴上的最大值。
       */

    }, {
      key: "xMax",
      get: function get() {
        return this.x + this.width;
      },
      set: function set(value) {
        this.width = value - this.x;
      }
      /**
       * 获取或设置矩形在 y 轴上的最大值。
       */

    }, {
      key: "yMax",
      get: function get() {
        return this.y + this.height;
      },
      set: function set(value) {
        this.height = value - this.y;
      }
      /**
       * 获取或设置矩形中心点的坐标。
       */

    }, {
      key: "center",
      get: function get() {
        return new _vec.Vec2(this.x + this.width * 0.5, this.y + this.height * 0.5);
      },
      set: function set(value) {
        this.x = value.x - this.width * 0.5;
        this.y = value.y - this.height * 0.5;
      }
      /**
       * 获取或设置矩形最小点的坐标。
       */

    }, {
      key: "origin",
      get: function get() {
        return new _globalExports.legacyCC.Vec2(this.x, this.y);
      },
      set: function set(value) {
        this.x = value.x;
        this.y = value.y;
      }
      /**
       * 获取或设置矩形的尺寸。
       */

    }, {
      key: "size",
      get: function get() {
        return new _size.Size(this.width, this.height);
      },
      set: function set(value) {
        this.width = value.width;
        this.height = value.height;
      } // compatibility with vector interfaces

    }, {
      key: "z",
      set: function set(val) {
        this.width = val;
      },
      get: function get() {
        return this.width;
      }
    }, {
      key: "w",
      set: function set(val) {
        this.height = val;
      },
      get: function get() {
        return this.height;
      }
      /**
       * 获取或设置矩形最小点的 x 坐标。
       */

    }], [{
      key: "fromMinMax",

      /**
       * 由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形。
       * @param v1 指定的点。
       * @param v2 指定的点。
       * @returns 目标矩形。
       */
      value: function fromMinMax(out, v1, v2) {
        var minX = Math.min(v1.x, v2.x);
        var minY = Math.min(v1.y, v2.y);
        var maxX = Math.max(v1.x, v2.x);
        var maxY = Math.max(v1.y, v2.y);
        out.x = minX;
        out.y = minY;
        out.width = maxX - minX;
        out.height = maxY - minY;
        return out;
      }
      /**
       * 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
       * @param out 本方法将插值结果赋值给此参数
       * @param from 起始矩形。
       * @param to 目标矩形。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(out, from, to, ratio) {
        var x = from.x;
        var y = from.y;
        var w = from.width;
        var h = from.height;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        out.width = w + (to.width - w) * ratio;
        out.height = h + (to.height - h) * ratio;
        return out;
      }
      /**
       * 计算当前矩形与指定矩形重叠部分的矩形，将其赋值给出口矩形。
       * @param out 出口矩形。
       * @param one 指定的一个矩形。
       * @param other 指定的另一个矩形。
       */

    }, {
      key: "intersection",
      value: function intersection(out, one, other) {
        var axMin = one.x;
        var ayMin = one.y;
        var axMax = one.x + one.width;
        var ayMax = one.y + one.height;
        var bxMin = other.x;
        var byMin = other.y;
        var bxMax = other.x + other.width;
        var byMax = other.y + other.height;
        out.x = Math.max(axMin, bxMin);
        out.y = Math.max(ayMin, byMin);
        out.width = Math.min(axMax, bxMax) - out.x;
        out.height = Math.min(ayMax, byMax) - out.y;
        return out;
      }
      /**
       * 创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给出口矩形。
       * @param out 出口矩形。
       * @param one 指定的一个矩形。
       * @param other 指定的另一个矩形。
       */

    }, {
      key: "union",
      value: function union(out, one, other) {
        var x = one.x;
        var y = one.y;
        var w = one.width;
        var h = one.height;
        var bx = other.x;
        var by = other.y;
        var bw = other.width;
        var bh = other.height;
        out.x = Math.min(x, bx);
        out.y = Math.min(y, by);
        out.width = Math.max(x + w, bx + bw) - out.x;
        out.height = Math.max(y + h, by + bh) - out.y;
        return out;
      }
    }]);

    function Rect(x, y, width, height) {
      var _this;

      _classCallCheck(this, Rect);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this));

      if (x && _typeof(x) === 'object') {
        _this.y = x.y;
        _this.width = x.width;
        _this.height = x.height;
        _this.x = x.x;
      } else {
        _this.x = x || 0;
        _this.y = y || 0;
        _this.width = width || 0;
        _this.height = height || 0;
      }

      return _this;
    }
    /**
     * 克隆当前矩形。
     */


    _createClass(Rect, [{
      key: "clone",
      value: function clone() {
        return new Rect(this.x, this.y, this.width, this.height);
      }
      /**
       * 设置当前矩形使其与指定矩形相等。
       * @param other 相比较的矩形。
       * @returns `this`
       */

    }, {
      key: "set",
      value: function set(x, y, width, height) {
        if (x && _typeof(x) === 'object') {
          this.y = x.y;
          this.width = x.width;
          this.height = x.height;
          this.x = x.x;
        } else {
          this.x = x || 0;
          this.y = y || 0;
          this.width = width || 0;
          this.height = height || 0;
        }

        return this;
      }
      /**
       * 判断当前矩形是否与指定矩形相等。
       * @param other 相比较的矩形。
       * @returns 两矩阵的最小值和最大值都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        return this.x === other.x && this.y === other.y && this.width === other.width && this.height === other.height;
      }
      /**
       * 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
       * @param to 目标矩形。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        var x = this.x;
        var y = this.y;
        var w = this.width;
        var h = this.height;
        this.x = x + (to.x - x) * ratio;
        this.y = y + (to.y - y) * ratio;
        this.width = w + (to.width - w) * ratio;
        this.height = h + (to.height - h) * ratio;
        return this;
      }
      /**
       * 返回当前矩形的字符串表示。
       * @returns 当前矩形的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return "(".concat(this.x.toFixed(2), ", ").concat(this.y.toFixed(2), ", ").concat(this.width.toFixed(2), ", ").concat(this.height.toFixed(2), ")");
      }
      /**
       * 判断当前矩形是否与指定矩形相交。
       * @param other 相比较的矩形。
       * @returns 相交则返回 `true`，否则返回 `false`。
       */

    }, {
      key: "intersects",
      value: function intersects(other) {
        var maxax = this.x + this.width;
        var maxay = this.y + this.height;
        var maxbx = other.x + other.width;
        var maxby = other.y + other.height;
        return !(maxax < other.x || maxbx < this.x || maxay < other.y || maxby < this.y);
      }
      /**
       * 判断当前矩形是否包含指定的点。
       * @param point 指定的点。
       * @returns 指定的点包含在矩形内则返回 `true`，否则返回 `false`。
       */

    }, {
      key: "contains",
      value: function contains(point) {
        return this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y;
      }
      /**
       * 判断当前矩形是否包含指定矩形。
       * @param other 指定的矩形。
       * @returns 指定矩形所有的点都包含在当前矩形内则返回 `true`，否则返回 `false`。
       */

    }, {
      key: "containsRect",
      value: function containsRect(other) {
        return this.x <= other.x && this.x + this.width >= other.x + other.width && this.y <= other.y && this.y + this.height >= other.y + other.height;
      }
      /**
       * 应用矩阵变换到当前矩形：
       * 应用矩阵变换到当前矩形的最小点得到新的最小点，
       * 将当前矩形的尺寸视为二维向量应用矩阵变换得到新的尺寸；
       * 并将如此构成的新矩形。
       * @param matrix 变换矩阵。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(mat) {
        var ol = this.x;
        var ob = this.y;
        var or = ol + this.width;
        var ot = ob + this.height;
        var lbx = mat.m00 * ol + mat.m04 * ob + mat.m12;
        var lby = mat.m01 * ol + mat.m05 * ob + mat.m13;
        var rbx = mat.m00 * or + mat.m04 * ob + mat.m12;
        var rby = mat.m01 * or + mat.m05 * ob + mat.m13;
        var ltx = mat.m00 * ol + mat.m04 * ot + mat.m12;
        var lty = mat.m01 * ol + mat.m05 * ot + mat.m13;
        var rtx = mat.m00 * or + mat.m04 * ot + mat.m12;
        var rty = mat.m01 * or + mat.m05 * ot + mat.m13;
        var minX = Math.min(lbx, rbx, ltx, rtx);
        var maxX = Math.max(lbx, rbx, ltx, rtx);
        var minY = Math.min(lby, rby, lty, rty);
        var maxY = Math.max(lby, rby, lty, rty);
        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
        return this;
      }
    }]);

    return Rect;
  }(_valueType.ValueType);

  _exports.Rect = Rect;

  _class.CCClass.fastDefine('cc.Rect', Rect, {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  _globalExports.legacyCC.Rect = Rect;
  /**
   * 构造与指定矩形相等的矩形。等价于 `new Rect(rect)`。
   * @param rect 相比较的矩形。
   * @returns `new Rect(rect)`
   */

  function rect() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return new Rect(x, y, width, height);
  }

  _globalExports.legacyCC.rect = rect;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9yZWN0LnRzIl0sIm5hbWVzIjpbIlJlY3QiLCJ4IiwidmFsdWUiLCJ3aWR0aCIsInkiLCJoZWlnaHQiLCJWZWMyIiwibGVnYWN5Q0MiLCJTaXplIiwidmFsIiwib3V0IiwidjEiLCJ2MiIsIm1pblgiLCJNYXRoIiwibWluIiwibWluWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwiZnJvbSIsInRvIiwicmF0aW8iLCJ3IiwiaCIsIm9uZSIsIm90aGVyIiwiYXhNaW4iLCJheU1pbiIsImF4TWF4IiwiYXlNYXgiLCJieE1pbiIsImJ5TWluIiwiYnhNYXgiLCJieU1heCIsImJ4IiwiYnkiLCJidyIsImJoIiwidG9GaXhlZCIsIm1heGF4IiwibWF4YXkiLCJtYXhieCIsIm1heGJ5IiwicG9pbnQiLCJtYXQiLCJvbCIsIm9iIiwib3IiLCJvdCIsImxieCIsIm0wMCIsIm0wNCIsIm0xMiIsImxieSIsIm0wMSIsIm0wNSIsIm0xMyIsInJieCIsInJieSIsImx0eCIsImx0eSIsInJ0eCIsInJ0eSIsIlZhbHVlVHlwZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwicmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBOzs7OztNQUthQSxJOzs7Ozs7QUFzRlQ7OzswQkFHWTtBQUNSLGVBQU8sS0FBS0MsQ0FBWjtBQUNILE87d0JBRVNDLEssRUFBTztBQUNiLGFBQUtDLEtBQUwsSUFBYyxLQUFLRixDQUFMLEdBQVNDLEtBQXZCO0FBQ0EsYUFBS0QsQ0FBTCxHQUFTQyxLQUFUO0FBQ0g7QUFFRDs7Ozs7OzBCQUdZO0FBQ1IsZUFBTyxLQUFLRSxDQUFaO0FBQ0gsTzt3QkFFU0YsSyxFQUFPO0FBQ2IsYUFBS0csTUFBTCxJQUFlLEtBQUtELENBQUwsR0FBU0YsS0FBeEI7QUFDQSxhQUFLRSxDQUFMLEdBQVNGLEtBQVQ7QUFDSDtBQUVEOzs7Ozs7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QUNDLEdBQUwsQ0FBU3VDLEdBQVQsRUFBY0ssR0FBZCxFQUFtQkUsR0FBbkIsRUFBd0JFLEdBQXhCLENBQWI7QUFDQSxZQUFNNUMsSUFBSSxHQUFHTCxJQUFJLENBQUNJLEdBQUwsQ0FBU29DLEdBQVQsRUFBY0ssR0FBZCxFQUFtQkUsR0FBbkIsRUFBd0JFLEdBQXhCLENBQWI7QUFFQSxhQUFLOUQsQ0FBTCxHQUFTWSxJQUFUO0FBQ0EsYUFBS1QsQ0FBTCxHQUFTWSxJQUFUO0FBQ0EsYUFBS2IsS0FBTCxHQUFhYyxJQUFJLEdBQUdKLElBQXBCO0FBQ0EsYUFBS1IsTUFBTCxHQUFjYyxJQUFJLEdBQUdILElBQXJCO0FBRUEsZUFBTyxJQUFQO0FBQ0g7Ozs7SUFuWHFCZ0Qsb0I7Ozs7QUFzWDFCQyxpQkFBUUMsVUFBUixDQUFtQixTQUFuQixFQUE4QmxFLElBQTlCLEVBQW9DO0FBQUVDLElBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFHLElBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNELElBQUFBLEtBQUssRUFBRSxDQUFyQjtBQUF3QkUsSUFBQUEsTUFBTSxFQUFFO0FBQWhDLEdBQXBDOztBQUVBRSwwQkFBU1AsSUFBVCxHQUFnQkEsSUFBaEI7QUFFQTs7Ozs7O0FBaUJPLFdBQVNtRSxJQUFULEdBQWlHO0FBQUEsUUFBbEZsRSxDQUFrRix1RUFBL0QsQ0FBK0Q7QUFBQSxRQUE1REcsQ0FBNEQsdUVBQWhELENBQWdEO0FBQUEsUUFBN0NELEtBQTZDLHVFQUE3QixDQUE2QjtBQUFBLFFBQTFCRSxNQUEwQix1RUFBVCxDQUFTO0FBQ3BHLFdBQU8sSUFBSUwsSUFBSixDQUFTQyxDQUFULEVBQW1CRyxDQUFuQixFQUFzQkQsS0FBdEIsRUFBNkJFLE1BQTdCLENBQVA7QUFDSDs7QUFFREUsMEJBQVM0RCxJQUFULEdBQWdCQSxJQUFoQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29yZS9tYXRoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ0NDbGFzcyB9IGZyb20gJy4uL2RhdGEvY2xhc3MnO1xyXG5pbXBvcnQgeyBWYWx1ZVR5cGUgfSBmcm9tICcuLi92YWx1ZS10eXBlcy92YWx1ZS10eXBlJztcclxuaW1wb3J0IHsgTWF0NCB9IGZyb20gJy4vbWF0NCc7XHJcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuL3NpemUnO1xyXG5pbXBvcnQgeyBJUmVjdExpa2UsIElWZWMyTGlrZSB9IGZyb20gJy4vdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBWZWMyIH0gZnJvbSAnLi92ZWMyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICog6L205a+56b2Q55+p5b2i44CCXHJcbiAqIOefqeW9ouWGheeahOaJgOacieeCuemDveWkp+S6juetieS6juefqeW9oueahOacgOWwj+eCuSAoeE1pbiwgeU1pbikg5bm25LiU5bCP5LqO562J5LqO55+p5b2i55qE5pyA5aSn54K5ICh4TWF4LCB5TWF4KeOAglxyXG4gKiDnn6nlvaLnmoTlrr3luqblrprkuYnkuLogeE1heCAtIHhNaW7vvJvpq5jluqblrprkuYnkuLogeU1heCAtIHlNaW7jgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWN0IGV4dGVuZHMgVmFsdWVUeXBlIHtcclxuICAgIC8qKlxyXG4gICAgICog55Sx5Lu75oSP5Lik5Liq54K55Yib5bu65LiA5Liq55+p5b2i77yM55uu5qCH55+p5b2i5Y2z5piv6L+Z5Lik5Liq54K55ZCE5ZCRIHjjgIF5IOi9tOS9nOe6v+aJgOW+l+WIsOeahOefqeW9ouOAglxyXG4gICAgICogQHBhcmFtIHYxIOaMh+WumueahOeCueOAglxyXG4gICAgICogQHBhcmFtIHYyIOaMh+WumueahOeCueOAglxyXG4gICAgICogQHJldHVybnMg55uu5qCH55+p5b2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbU1pbk1heCA8T3V0IGV4dGVuZHMgSVJlY3RMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIHYxOiBWZWNMaWtlLCB2MjogVmVjTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbih2MS54LCB2Mi54KTtcclxuICAgICAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4odjEueSwgdjIueSk7XHJcbiAgICAgICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KHYxLngsIHYyLngpO1xyXG4gICAgICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heCh2MS55LCB2Mi55KTtcclxuICAgICAgICBvdXQueCA9IG1pblg7XHJcbiAgICAgICAgb3V0LnkgPSBtaW5ZO1xyXG4gICAgICAgIG91dC53aWR0aCA9IG1heFggLSBtaW5YO1xyXG4gICAgICAgIG91dC5oZWlnaHQgPSBtYXhZIC0gbWluWTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruaMh+WumueahOaPkuWAvOavlOeOh++8jOS7juW9k+WJjeefqeW9ouWIsOebruagh+efqeW9ouS5i+mXtOWBmuaPkuWAvOOAglxyXG4gICAgICogQHBhcmFtIG91dCDmnKzmlrnms5XlsIbmj5LlgLznu5PmnpzotYvlgLznu5nmraTlj4LmlbBcclxuICAgICAqIEBwYXJhbSBmcm9tIOi1t+Wni+efqeW9ouOAglxyXG4gICAgICogQHBhcmFtIHRvIOebruagh+efqeW9ouOAglxyXG4gICAgICogQHBhcmFtIHJhdGlvIOaPkuWAvOavlOeOh++8jOiMg+WbtOS4uiBbMCwxXeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAgPE91dCBleHRlbmRzIElSZWN0TGlrZT4gKG91dDogT3V0LCBmcm9tOiBPdXQsIHRvOiBPdXQsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4ID0gZnJvbS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBmcm9tLnk7XHJcbiAgICAgICAgY29uc3QgdyA9IGZyb20ud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaCA9IGZyb20uaGVpZ2h0O1xyXG4gICAgICAgIG91dC54ID0geCArICh0by54IC0geCkgKiByYXRpbztcclxuICAgICAgICBvdXQueSA9IHkgKyAodG8ueSAtIHkpICogcmF0aW87XHJcbiAgICAgICAgb3V0LndpZHRoID0gdyArICh0by53aWR0aCAtIHcpICogcmF0aW87XHJcbiAgICAgICAgb3V0LmhlaWdodCA9IGggKyAodG8uaGVpZ2h0IC0gaCkgKiByYXRpbztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuoeeul+W9k+WJjeefqeW9ouS4juaMh+WumuefqeW9oumHjeWPoOmDqOWIhueahOefqeW9ou+8jOWwhuWFtui1i+WAvOe7meWHuuWPo+efqeW9ouOAglxyXG4gICAgICogQHBhcmFtIG91dCDlh7rlj6Pnn6nlvaLjgIJcclxuICAgICAqIEBwYXJhbSBvbmUg5oyH5a6a55qE5LiA5Liq55+p5b2i44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE5Y+m5LiA5Liq55+p5b2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW50ZXJzZWN0aW9uIDxPdXQgZXh0ZW5kcyBJUmVjdExpa2U+IChvdXQ6IE91dCwgb25lOiBPdXQsIG90aGVyOiBPdXQpIHtcclxuICAgICAgICBjb25zdCBheE1pbiA9IG9uZS54O1xyXG4gICAgICAgIGNvbnN0IGF5TWluID0gb25lLnk7XHJcbiAgICAgICAgY29uc3QgYXhNYXggPSBvbmUueCArIG9uZS53aWR0aDtcclxuICAgICAgICBjb25zdCBheU1heCA9IG9uZS55ICsgb25lLmhlaWdodDtcclxuICAgICAgICBjb25zdCBieE1pbiA9IG90aGVyLng7XHJcbiAgICAgICAgY29uc3QgYnlNaW4gPSBvdGhlci55O1xyXG4gICAgICAgIGNvbnN0IGJ4TWF4ID0gb3RoZXIueCArIG90aGVyLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGJ5TWF4ID0gb3RoZXIueSArIG90aGVyLmhlaWdodDtcclxuICAgICAgICBvdXQueCA9IE1hdGgubWF4KGF4TWluLCBieE1pbik7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1heChheU1pbiwgYnlNaW4pO1xyXG4gICAgICAgIG91dC53aWR0aCA9IE1hdGgubWluKGF4TWF4LCBieE1heCkgLSBvdXQueDtcclxuICAgICAgICBvdXQuaGVpZ2h0ID0gTWF0aC5taW4oYXlNYXgsIGJ5TWF4KSAtIG91dC55O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu65ZCM5pe25YyF5ZCr5b2T5YmN55+p5b2i5ZKM5oyH5a6a55+p5b2i55qE5pyA5bCP55+p5b2i77yM5bCG5YW26LWL5YC857uZ5Ye65Y+j55+p5b2i44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOWHuuWPo+efqeW9ouOAglxyXG4gICAgICogQHBhcmFtIG9uZSDmjIflrprnmoTkuIDkuKrnn6nlvaLjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlj6bkuIDkuKrnn6nlvaLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB1bmlvbiA8T3V0IGV4dGVuZHMgSVJlY3RMaWtlPiAob3V0OiBPdXQsIG9uZTogT3V0LCBvdGhlcjogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IG9uZS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBvbmUueTtcclxuICAgICAgICBjb25zdCB3ID0gb25lLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBvbmUuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGJ4ID0gb3RoZXIueDtcclxuICAgICAgICBjb25zdCBieSA9IG90aGVyLnk7XHJcbiAgICAgICAgY29uc3QgYncgPSBvdGhlci53aWR0aDtcclxuICAgICAgICBjb25zdCBiaCA9IG90aGVyLmhlaWdodDtcclxuICAgICAgICBvdXQueCA9IE1hdGgubWluKHgsIGJ4KTtcclxuICAgICAgICBvdXQueSA9IE1hdGgubWluKHksIGJ5KTtcclxuICAgICAgICBvdXQud2lkdGggPSBNYXRoLm1heCh4ICsgdywgYnggKyBidykgLSBvdXQueDtcclxuICAgICAgICBvdXQuaGVpZ2h0ID0gTWF0aC5tYXgoeSArIGgsIGJ5ICsgYmgpIC0gb3V0Lnk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmiJborr7nva7nn6nlvaLlnKggeCDovbTkuIrnmoTmnIDlsI/lgLzjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHhNaW4gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLng7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHhNaW4gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCArPSB0aGlzLnggLSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaIluiuvue9ruefqeW9ouWcqCB5IOi9tOS4iueahOacgOWwj+WAvOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgeU1pbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeU1pbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmhlaWdodCArPSB0aGlzLnkgLSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnkgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaIluiuvue9ruefqeW9ouWcqCB4IOi9tOS4iueahOacgOWkp+WAvOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgeE1heCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCArIHRoaXMud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHhNYXggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHZhbHVlIC0gdGhpcy54O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oiW6K6+572u55+p5b2i5ZyoIHkg6L205LiK55qE5pyA5aSn5YC844CCXHJcbiAgICAgKi9cclxuICAgIGdldCB5TWF4ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy55ICsgdGhpcy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHlNYXggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB2YWx1ZSAtIHRoaXMueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaIluiuvue9ruefqeW9ouS4reW/g+eCueeahOWdkOagh+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgY2VudGVyICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54ICsgdGhpcy53aWR0aCAqIDAuNSxcclxuICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5oZWlnaHQgKiAwLjUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjZW50ZXIgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdmFsdWUueCAtIHRoaXMud2lkdGggKiAwLjU7XHJcbiAgICAgICAgdGhpcy55ID0gdmFsdWUueSAtIHRoaXMuaGVpZ2h0ICogMC41O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oiW6K6+572u55+p5b2i5pyA5bCP54K555qE5Z2Q5qCH44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBvcmlnaW4gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbGVnYWN5Q0MuVmVjMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG9yaWdpbiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLnggPSB2YWx1ZS54O1xyXG4gICAgICAgIHRoaXMueSA9IHZhbHVlLnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmiJborr7nva7nn6nlvaLnmoTlsLrlr7jjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2l6ZSh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNpemUgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHZhbHVlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdmFsdWUuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2ZWN0b3IgaW50ZXJmYWNlc1xyXG4gICAgc2V0IHogKHZhbCkgeyB0aGlzLndpZHRoID0gdmFsOyB9XHJcbiAgICBnZXQgeiAoKSB7IHJldHVybiB0aGlzLndpZHRoOyB9XHJcbiAgICBzZXQgdyAodmFsKSB7IHRoaXMuaGVpZ2h0ID0gdmFsOyB9XHJcbiAgICBnZXQgdyAoKSB7IHJldHVybiB0aGlzLmhlaWdodDsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oiW6K6+572u55+p5b2i5pyA5bCP54K555qEIHgg5Z2Q5qCH44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIHg6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaIluiuvue9ruefqeW9ouacgOWwj+eCueeahCB5IOWdkOagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSB5OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmiJborr7nva7nn6nlvaLnmoTlrr3luqbjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaIluiuvue9ruefqeW9oueahOmrmOW6puOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOaehOmAoOS4juaMh+WumuefqeW9ouebuOetieeahOefqeW9ouOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOefqeW9ouOAglxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAob3RoZXI6IFJlY3QpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p6E6YCg5YW35pyJ5oyH5a6a55qE5pyA5bCP5YC85ZKM5bC65a+455qE55+p5b2i44CCXHJcbiAgICAgKiBAcGFyYW0geCDnn6nlvaLlnKggeCDovbTkuIrnmoTmnIDlsI/lgLzjgIJcclxuICAgICAqIEBwYXJhbSB5IOefqeW9ouWcqCB5IOi9tOS4iueahOacgOWwj+WAvOOAglxyXG4gICAgICogQHBhcmFtIHdpZHRoIOefqeW9oueahOWuveW6puOAglxyXG4gICAgICogQHBhcmFtIGhlaWdodCDnn6nlvaLnmoTpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4PzogUmVjdCB8IG51bWJlciwgeT86IG51bWJlciwgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHgud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0geC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YWL6ZqG5b2T5YmN55+p5b2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lvZPliY3nn6nlvaLkvb/lhbbkuI7mjIflrprnn6nlvaLnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6nlvaLjgIJcclxuICAgICAqIEByZXR1cm5zIGB0aGlzYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChvdGhlcjogUmVjdCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lvZPliY3nn6nlvaLkvb/lhbbkuI7mjIflrprlj4LmlbDnmoTnn6nlvaLnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumuefqeW9oueahCB4IOWPguaVsFxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55+p5b2i55qEIHkg5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0gd2lkdGgg5oyH5a6a55+p5b2i55qEIHdpZHRoIOWPguaVsFxyXG4gICAgICogQHBhcmFtIGhlaWdodCDmjIflrprnn6nlvaLnmoQgaGVpZ2h0IOWPguaVsFxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBSZWN0IHwgbnVtYmVyLCB5PzogbnVtYmVyLCB3aWR0aD86IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHgud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0geC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5b2T5YmN55+p5b2i5piv5ZCm5LiO5oyH5a6a55+p5b2i55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE55+p5b2i44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTnn6npmLXnmoTmnIDlsI/lgLzlkozmnIDlpKflgLzpg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyAob3RoZXI6IFJlY3QpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09PSBvdGhlci54ICYmXHJcbiAgICAgICAgICAgIHRoaXMueSA9PT0gb3RoZXIueSAmJlxyXG4gICAgICAgICAgICB0aGlzLndpZHRoID09PSBvdGhlci53aWR0aCAmJlxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gb3RoZXIuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5oyH5a6a55qE5o+S5YC85q+U546H77yM5LuO5b2T5YmN55+p5b2i5Yiw55uu5qCH55+p5b2i5LmL6Ze05YGa5o+S5YC844CCXHJcbiAgICAgKiBAcGFyYW0gdG8g55uu5qCH55+p5b2i44CCXHJcbiAgICAgKiBAcGFyYW0gcmF0aW8g5o+S5YC85q+U546H77yM6IyD5Zu05Li6IFswLDFd44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZXJwICh0bzogUmVjdCwgcmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueTtcclxuICAgICAgICBjb25zdCB3ID0gdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCBoID0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy54ID0geCArICh0by54IC0geCkgKiByYXRpbztcclxuICAgICAgICB0aGlzLnkgPSB5ICsgKHRvLnkgLSB5KSAqIHJhdGlvO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3ICsgKHRvLndpZHRoIC0gdykgKiByYXRpbztcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGggKyAodG8uaGVpZ2h0IC0gaCkgKiByYXRpbztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57lvZPliY3nn6nlvaLnmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqIEByZXR1cm5zIOW9k+WJjeefqeW9oueahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiBgKCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfSwgJHt0aGlzLndpZHRoLnRvRml4ZWQoMil9LCAke3RoaXMuaGVpZ2h0LnRvRml4ZWQoMil9KWA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lvZPliY3nn6nlvaLmmK/lkKbkuI7mjIflrprnn6nlvaLnm7jkuqTjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6nlvaLjgIJcclxuICAgICAqIEByZXR1cm5zIOebuOS6pOWImei/lOWbniBgdHJ1ZWDvvIzlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW50ZXJzZWN0cyAob3RoZXI6IFJlY3QpIHtcclxuICAgICAgICBjb25zdCBtYXhheCA9IHRoaXMueCArIHRoaXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgbWF4YXkgPSB0aGlzLnkgKyB0aGlzLmhlaWdodDtcclxuICAgICAgICBjb25zdCBtYXhieCA9IG90aGVyLnggKyBvdGhlci53aWR0aDtcclxuICAgICAgICBjb25zdCBtYXhieSA9IG90aGVyLnkgKyBvdGhlci5oZWlnaHQ7XHJcbiAgICAgICAgcmV0dXJuICEobWF4YXggPCBvdGhlci54IHx8IG1heGJ4IDwgdGhpcy54IHx8IG1heGF5IDwgb3RoZXIueSB8fCBtYXhieSA8IHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lvZPliY3nn6nlvaLmmK/lkKbljIXlkKvmjIflrprnmoTngrnjgIJcclxuICAgICAqIEBwYXJhbSBwb2ludCDmjIflrprnmoTngrnjgIJcclxuICAgICAqIEByZXR1cm5zIOaMh+WumueahOeCueWMheWQq+WcqOefqeW9ouWGheWImei/lOWbniBgdHJ1ZWDvvIzlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnMgKHBvaW50OiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnggPD0gcG9pbnQueCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy54ICsgdGhpcy53aWR0aCA+PSBwb2ludC54ICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPD0gcG9pbnQueSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5oZWlnaHQgPj0gcG9pbnQueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lvZPliY3nn6nlvaLmmK/lkKbljIXlkKvmjIflrprnn6nlvaLjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTnn6nlvaLjgIJcclxuICAgICAqIEByZXR1cm5zIOaMh+WumuefqeW9ouaJgOacieeahOeCuemDveWMheWQq+WcqOW9k+WJjeefqeW9ouWGheWImei/lOWbniBgdHJ1ZWDvvIzlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udGFpbnNSZWN0IChvdGhlcjogUmVjdCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy54IDw9IG90aGVyLnggJiZcclxuICAgICAgICAgICAgICAgIHRoaXMueCArIHRoaXMud2lkdGggPj0gb3RoZXIueCArIG90aGVyLndpZHRoICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPD0gb3RoZXIueSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy55ICsgdGhpcy5oZWlnaHQgPj0gb3RoZXIueSArIG90aGVyLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlupTnlKjnn6npmLXlj5jmjaLliLDlvZPliY3nn6nlvaLvvJpcclxuICAgICAqIOW6lOeUqOefqemYteWPmOaNouWIsOW9k+WJjeefqeW9oueahOacgOWwj+eCueW+l+WIsOaWsOeahOacgOWwj+eCue+8jFxyXG4gICAgICog5bCG5b2T5YmN55+p5b2i55qE5bC65a+46KeG5Li65LqM57u05ZCR6YeP5bqU55So55+p6Zi15Y+Y5o2i5b6X5Yiw5paw55qE5bC65a+477ybXHJcbiAgICAgKiDlubblsIblpoLmraTmnoTmiJDnmoTmlrDnn6nlvaLjgIJcclxuICAgICAqIEBwYXJhbSBtYXRyaXgg5Y+Y5o2i55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm1NYXQ0IChtYXQ6IE1hdDQpIHtcclxuICAgICAgICBjb25zdCBvbCA9IHRoaXMueDtcclxuICAgICAgICBjb25zdCBvYiA9IHRoaXMueTtcclxuICAgICAgICBjb25zdCBvciA9IG9sICsgdGhpcy53aWR0aDtcclxuICAgICAgICBjb25zdCBvdCA9IG9iICsgdGhpcy5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgbGJ4ID0gbWF0Lm0wMCAqIG9sICsgbWF0Lm0wNCAqIG9iICsgbWF0Lm0xMjtcclxuICAgICAgICBjb25zdCBsYnkgPSBtYXQubTAxICogb2wgKyBtYXQubTA1ICogb2IgKyBtYXQubTEzO1xyXG4gICAgICAgIGNvbnN0IHJieCA9IG1hdC5tMDAgKiBvciArIG1hdC5tMDQgKiBvYiArIG1hdC5tMTI7XHJcbiAgICAgICAgY29uc3QgcmJ5ID0gbWF0Lm0wMSAqIG9yICsgbWF0Lm0wNSAqIG9iICsgbWF0Lm0xMztcclxuICAgICAgICBjb25zdCBsdHggPSBtYXQubTAwICogb2wgKyBtYXQubTA0ICogb3QgKyBtYXQubTEyO1xyXG4gICAgICAgIGNvbnN0IGx0eSA9IG1hdC5tMDEgKiBvbCArIG1hdC5tMDUgKiBvdCArIG1hdC5tMTM7XHJcbiAgICAgICAgY29uc3QgcnR4ID0gbWF0Lm0wMCAqIG9yICsgbWF0Lm0wNCAqIG90ICsgbWF0Lm0xMjtcclxuICAgICAgICBjb25zdCBydHkgPSBtYXQubTAxICogb3IgKyBtYXQubTA1ICogb3QgKyBtYXQubTEzO1xyXG5cclxuICAgICAgICBjb25zdCBtaW5YID0gTWF0aC5taW4obGJ4LCByYngsIGx0eCwgcnR4KTtcclxuICAgICAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgobGJ4LCByYngsIGx0eCwgcnR4KTtcclxuICAgICAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4obGJ5LCByYnksIGx0eSwgcnR5KTtcclxuICAgICAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgobGJ5LCByYnksIGx0eSwgcnR5KTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gbWluWDtcclxuICAgICAgICB0aGlzLnkgPSBtaW5ZO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBtYXhYIC0gbWluWDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IG1heFkgLSBtaW5ZO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5SZWN0JywgUmVjdCwgeyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH0pO1xyXG5cclxubGVnYWN5Q0MuUmVjdCA9IFJlY3Q7XHJcblxyXG4vKipcclxuICog5p6E6YCg5LiO5oyH5a6a55+p5b2i55u4562J55qE55+p5b2i44CC562J5Lu35LqOIGBuZXcgUmVjdChyZWN0KWDjgIJcclxuICogQHBhcmFtIHJlY3Qg55u45q+U6L6D55qE55+p5b2i44CCXHJcbiAqIEByZXR1cm5zIGBuZXcgUmVjdChyZWN0KWBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZWN0IChyZWN0OiBSZWN0KTogUmVjdDtcclxuXHJcbi8qKlxyXG4gKiDmnoTpgKDlhbfmnInmjIflrprnmoTmnIDlsI/lgLzlkozlsLrlr7jnmoTnn6nlvaLvvIznrYnku7fkuo5gbmV3IFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClg44CCXHJcbiAqIEBwYXJhbSB4IOefqeW9ouWcqCB4IOi9tOS4iueahOacgOWwj+WAvOOAglxyXG4gKiBAcGFyYW0geSDnn6nlvaLlnKggeSDovbTkuIrnmoTmnIDlsI/lgLzjgIJcclxuICogQHBhcmFtIHdpZHRoIOefqeW9oueahOWuveW6puOAglxyXG4gKiBAcGFyYW0gaGVpZ2h0IOefqeW9oueahOmrmOW6puOAglxyXG4gKiBAcmV0dXJucyBgbmV3IFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodClgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVjdCAoeD86IG51bWJlciwgeT86IG51bWJlciwgd2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcik6IFJlY3Q7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjdCAoeDogUmVjdCB8IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDAsIHdpZHRoOiBudW1iZXIgPSAwLCBoZWlnaHQ6IG51bWJlciA9IDApOiBSZWN0IHtcclxuICAgIHJldHVybiBuZXcgUmVjdCh4IGFzIGFueSwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbn1cclxuXHJcbmxlZ2FjeUNDLnJlY3QgPSByZWN0O1xyXG4iXX0=