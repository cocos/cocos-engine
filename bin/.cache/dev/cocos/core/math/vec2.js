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
    global.vec2 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _utils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.v2 = v2;
  _exports.Vec2 = void 0;

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
   * 二维向量。
   */
  var Vec2 = /*#__PURE__*/function (_ValueType) {
    _inherits(Vec2, _ValueType);

    _createClass(Vec2, null, [{
      key: "clone",

      /**
       * @zh 获得指定向量的拷贝
       */
      value: function clone(a) {
        return new Vec2(a.x, a.y);
      }
      /**
       * @zh 复制目标向量
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        out.x = a.x;
        out.y = a.y;
        return out;
      }
      /**
       * @zh 设置向量值
       */

    }, {
      key: "set",
      value: function set(out, x, y) {
        out.x = x;
        out.y = y;
        return out;
      }
      /**
       * @zh 逐元素向量加法
       */

    }, {
      key: "add",
      value: function add(out, a, b) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
      }
      /**
       * @zh 逐元素向量减法
       */

    }, {
      key: "subtract",
      value: function subtract(out, a, b) {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
      }
      /**
       * @zh 逐元素向量乘法
       */

    }, {
      key: "multiply",
      value: function multiply(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
      }
      /**
       * @zh 逐元素向量除法
       */

    }, {
      key: "divide",
      value: function divide(out, a, b) {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
      }
      /**
       * @zh 逐元素向量向上取整
       */

    }, {
      key: "ceil",
      value: function ceil(out, a) {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
      }
      /**
       * @zh 逐元素向量向下取整
       */

    }, {
      key: "floor",
      value: function floor(out, a) {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
      }
      /**
       * @zh 逐元素向量最小值
       */

    }, {
      key: "min",
      value: function min(out, a, b) {
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
      }
      /**
       * @zh 逐元素向量最大值
       */

    }, {
      key: "max",
      value: function max(out, a, b) {
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
      }
      /**
       * @zh 逐元素向量四舍五入取整
       */

    }, {
      key: "round",
      value: function round(out, a) {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
      }
      /**
       * @zh 向量标量乘法
       */

    }, {
      key: "multiplyScalar",
      value: function multiplyScalar(out, a, b) {
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
      }
      /**
       * @zh 逐元素向量乘加: A + B * scale
       */

    }, {
      key: "scaleAndAdd",
      value: function scaleAndAdd(out, a, b, scale) {
        out.x = a.x + b.x * scale;
        out.y = a.y + b.y * scale;
        return out;
      }
      /**
       * @zh 求两向量的欧氏距离
       */

    }, {
      key: "distance",
      value: function distance(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
      }
      /**
       * @zh 求两向量的欧氏距离平方
       */

    }, {
      key: "squaredDistance",
      value: function squaredDistance(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        return x * x + y * y;
      }
      /**
       * @zh 求向量长度
       */

    }, {
      key: "len",
      value: function len(a) {
        var x = a.x;
        var y = a.y;
        return Math.sqrt(x * x + y * y);
      }
      /**
       * @zh 求向量长度平方
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr(a) {
        var x = a.x;
        var y = a.y;
        return x * x + y * y;
      }
      /**
       * @zh 逐元素向量取负
       */

    }, {
      key: "negate",
      value: function negate(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        return out;
      }
      /**
       * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
       */

    }, {
      key: "inverse",
      value: function inverse(out, a) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        return out;
      }
      /**
       * @zh 逐元素向量取倒数，接近 0 时返回 0
       */

    }, {
      key: "inverseSafe",
      value: function inverseSafe(out, a) {
        var x = a.x;
        var y = a.y;

        if (Math.abs(x) < _utils.EPSILON) {
          out.x = 0;
        } else {
          out.x = 1.0 / x;
        }

        if (Math.abs(y) < _utils.EPSILON) {
          out.y = 0;
        } else {
          out.y = 1.0 / y;
        }

        return out;
      }
      /**
       * @zh 归一化向量
       */

    }, {
      key: "normalize",
      value: function normalize(out, a) {
        var x = a.x;
        var y = a.y;
        var len = x * x + y * y;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          out.x = x * len;
          out.y = y * len;
        }

        return out;
      }
      /**
       * @zh 向量点积（数量积）
       */

    }, {
      key: "dot",
      value: function dot(a, b) {
        return a.x * b.x + a.y * b.y;
      }
      /**
       * @zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
       */

    }, {
      key: "cross",
      value: function cross(out, a, b) {
        out.x = out.y = 0;
        out.z = a.x * b.y - a.y * b.x;
        return out;
      }
      /**
       * @zh 逐元素向量线性插值： A + t * (B - A)
       */

    }, {
      key: "lerp",
      value: function lerp(out, a, b, t) {
        var x = a.x;
        var y = a.y;
        out.x = x + t * (b.x - x);
        out.y = y + t * (b.y - y);
        return out;
      }
      /**
       * @zh 生成一个在单位圆上均匀分布的随机向量
       * @param scale 生成的向量长度
       */

    }, {
      key: "random",
      value: function random(out, scale) {
        scale = scale || 1.0;
        var r = (0, _utils.random)() * 2.0 * Math.PI;
        out.x = Math.cos(r) * scale;
        out.y = Math.sin(r) * scale;
        return out;
      }
      /**
       * @zh 向量与三维矩阵乘法，默认向量第三位为 1。
       */

    }, {
      key: "transformMat3",
      value: function transformMat3(out, a, m) {
        var x = a.x;
        var y = a.y;
        out.x = m.m00 * x + m.m03 * y + m.m06;
        out.y = m.m01 * x + m.m04 * y + m.m07;
        return out;
      }
      /**
       * @zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(out, a, m) {
        var x = a.x;
        var y = a.y;
        out.x = m.m00 * x + m.m04 * y + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m13;
        return out;
      }
      /**
       * @zh 返回向量的字符串表示
       */

    }, {
      key: "str",
      value: function str(a) {
        return "Vec2(".concat(a.x, ", ").concat(a.y, ")");
      }
      /**
       * @zh 向量转数组
       * @param ofs 数组起始偏移量
       */

    }, {
      key: "toArray",
      value: function toArray(out, v) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out[ofs + 0] = v.x;
        out[ofs + 1] = v.y;
        return out;
      }
      /**
       * @zh 数组转向量
       * @param ofs 数组起始偏移量
       */

    }, {
      key: "fromArray",
      value: function fromArray(out, arr) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out.x = arr[ofs + 0];
        out.y = arr[ofs + 1];
        return out;
      }
      /**
       * @zh 向量等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.x === b.x && a.y === b.y;
      }
      /**
       * @zh 排除浮点数误差的向量近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y));
      }
      /**
       * @zh 求两向量夹角弧度
       */

    }, {
      key: "angle",
      value: function angle(a, b) {
        Vec2.normalize(v2_1, a);
        Vec2.normalize(v2_2, b);
        var cosine = Vec2.dot(v2_1, v2_2);

        if (cosine > 1.0) {
          return 0;
        }

        if (cosine < -1.0) {
          return Math.PI;
        }

        return Math.acos(cosine);
      }
      /**
       * x 分量。
       */

    }]);

    function Vec2(x, y) {
      var _this;

      _classCallCheck(this, Vec2);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Vec2).call(this));

      if (x && _typeof(x) === 'object') {
        _this.x = x.x;
        _this.y = x.y;
      } else {
        _this.x = x || 0;
        _this.y = y || 0;
      }

      return _this;
    }
    /**
     * @zh 克隆当前向量。
     */


    _createClass(Vec2, [{
      key: "clone",
      value: function clone() {
        return new Vec2(this.x, this.y);
      }
      /**
       * @zh 设置当前向量使其与指定向量相等。
       * @param other 相比较的向量。
       * @return `this`
       */

    }, {
      key: "set",
      value: function set(x, y) {
        if (x && _typeof(x) === 'object') {
          this.x = x.x;
          this.y = x.y;
        } else {
          this.x = x || 0;
          this.y = y || 0;
        }

        return this;
      }
      /**
       * @zh 判断当前向量是否在误差范围内与指定向量相等。
       * @param other 相比较的向量。
       * @param epsilon 允许的误差，应为非负数。
       * @return 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.EPSILON;
        return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y));
      }
      /**
       * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
       * @param x 相比较的向量的 x 分量。
       * @param y 相比较的向量的 y 分量。
       * @param epsilon 允许的误差，应为非负数。
       * @return 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals2f",
      value: function equals2f(x, y) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y));
      }
      /**
       * @zh 判断当前向量是否与指定向量相等。
       * @param other 相比较的向量。
       * @return 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return other && this.x === other.x && this.y === other.y;
      }
      /**
       * @zh 判断当前向量是否与指定分量的向量相等。
       * @param x 指定向量的 x 分量。
       * @param y 指定向量的 y 分量。
       * @return 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals2f",
      value: function strictEquals2f(x, y) {
        return this.x === x && this.y === y;
      }
      /**
       * @zh 返回当前向量的字符串表示。
       * @returns 当前向量的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return "(".concat(this.x.toFixed(2), ", ").concat(this.y.toFixed(2), ")");
      }
      /**
       * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
       * @param to 目标向量。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        var x = this.x;
        var y = this.y;
        this.x = x + ratio * (to.x - x);
        this.y = y + ratio * (to.y - y);
        return this;
      }
      /**
       * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
       * @param minInclusive 每个分量都代表了对应分量允许的最小值。
       * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
       * @return `this`
       */

    }, {
      key: "clampf",
      value: function clampf(minInclusive, maxInclusive) {
        this.x = (0, _utils.clamp)(this.x, minInclusive.x, maxInclusive.x);
        this.y = (0, _utils.clamp)(this.y, minInclusive.y, maxInclusive.y);
        return this;
      }
      /**
       * @zh 向量加法。将当前向量与指定向量的相加
       * @param other 指定的向量。
       */

    }, {
      key: "add",
      value: function add(other) {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
        return this;
      }
      /**
       * @zh 向量加法。将当前向量与指定分量的向量相加
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       */

    }, {
      key: "add2f",
      value: function add2f(x, y) {
        this.x = this.x + x;
        this.y = this.y + y;
        return this;
      }
      /**
       * @zh 向量减法。将当前向量减去指定向量
       * @param other 减数向量。
       */

    }, {
      key: "subtract",
      value: function subtract(other) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        return this;
      }
      /**
       * @zh 向量减法。将当前向量减去指定分量的向量
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       */

    }, {
      key: "subtract2f",
      value: function subtract2f(x, y) {
        this.x = this.x - x;
        this.y = this.y - y;
        return this;
      }
      /**
       * @zh 向量数乘。将当前向量数乘指定标量
       * @param scalar 标量乘数。
       */

    }, {
      key: "multiplyScalar",
      value: function multiplyScalar(scalar) {
        if (_typeof(scalar) === 'object') {
          console.warn('should use Vec2.multiply for vector * vector operation');
        }

        this.x = this.x * scalar;
        this.y = this.y * scalar;
        return this;
      }
      /**
       * @zh 向量乘法。将当前向量乘以与指定向量的结果赋值给当前向量。
       * @param other 指定的向量。
       */

    }, {
      key: "multiply",
      value: function multiply(other) {
        if (_typeof(other) !== 'object') {
          console.warn('should use Vec2.scale for vector * scalar operation');
        }

        this.x = this.x * other.x;
        this.y = this.y * other.y;
        return this;
      }
      /**
       * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       */

    }, {
      key: "multiply2f",
      value: function multiply2f(x, y) {
        this.x = this.x * x;
        this.y = this.y * y;
        return this;
      }
      /**
       * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
       * @param other 指定的向量
       */

    }, {
      key: "divide",
      value: function divide(other) {
        this.x = this.x / other.x;
        this.y = this.y / other.y;
        return this;
      }
      /**
       * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       */

    }, {
      key: "divide2f",
      value: function divide2f(x, y) {
        this.x = this.x / x;
        this.y = this.y / y;
        return this;
      }
      /**
       * @zh 将当前向量的各个分量取反
       */

    }, {
      key: "negative",
      value: function negative() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
      }
      /**
       * @zh 向量点乘。
       * @param other 指定的向量。
       * @return 当前向量与指定向量点乘的结果。
       */

    }, {
      key: "dot",
      value: function dot(other) {
        return this.x * other.x + this.y * other.y;
      }
      /**
       * @zh 向量叉乘。
       * @param other 指定的向量。
       * @return `out`
       */

    }, {
      key: "cross",
      value: function cross(other) {
        return this.x * other.y - this.y * other.x;
      }
      /**
       * 计算向量的长度（模）。
       * @return 向量的长度（模）。
       */

    }, {
      key: "length",
      value: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }
      /**
       * 计算向量长度（模）的平方。
       * @return 向量长度（模）的平方。
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr() {
        return this.x * this.x + this.y * this.y;
      }
      /**
       * @zh 将当前向量归一化。
       */

    }, {
      key: "normalize",
      value: function normalize() {
        var x = this.x;
        var y = this.y;
        var len = x * x + y * y;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          this.x = this.x * len;
          this.y = this.y * len;
        }

        return this;
      }
      /**
       * @zh 获取当前向量和指定向量之间的角度。
       * @param other 指定的向量。
       * @return 当前向量和指定向量之间的角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
       */

    }, {
      key: "angle",
      value: function angle(other) {
        var magSqr1 = this.lengthSqr();
        var magSqr2 = other.lengthSqr();

        if (magSqr1 === 0 || magSqr2 === 0) {
          console.warn('Can\'t get angle between zero vector');
          return 0.0;
        }

        var dot = this.dot(other);
        var theta = dot / Math.sqrt(magSqr1 * magSqr2);
        theta = (0, _utils.clamp)(theta, -1.0, 1.0);
        return Math.acos(theta);
      }
      /**
       * @zh 获取当前向量和指定向量之间的有符号角度。<br/>
       * 有符号角度的取值范围为 (-180, 180]，当前向量可以通过逆时针旋转有符号角度与指定向量同向。<br/>
       * @param other 指定的向量。
       * @return 当前向量和指定向量之间的有符号角度（弧度制）；若当前向量和指定向量中存在零向量，将返回 0。
       */

    }, {
      key: "signAngle",
      value: function signAngle(other) {
        var angle = this.angle(other);
        return this.cross(other) < 0 ? -angle : angle;
      }
      /**
       * @zh 将当前向量的旋转
       * @param radians 旋转角度（弧度制）。
       */

    }, {
      key: "rotate",
      value: function rotate(radians) {
        var x = this.x;
        var y = this.y;
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        this.x = cos * x - sin * y;
        this.y = sin * x + cos * y;
        return this;
      }
      /**
       * @zh 计算当前向量在指定向量上的投影向量。
       * @param other 指定的向量。
       */

    }, {
      key: "project",
      value: function project(other) {
        var scalar = this.dot(other) / other.dot(other);
        this.x = other.x * scalar;
        this.y = other.y * scalar;
        return this;
      }
      /**
       * @zh 将当前向量视为 z 分量为 0、w 分量为 1 的四维向量，<br/>
       * 应用四维矩阵变换到当前矩阵<br/>
       * @param matrix 变换矩阵。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(matrix) {
        var x = this.x;
        var y = this.y;
        this.x = matrix.m00 * x + matrix.m04 * y + matrix.m12;
        this.y = matrix.m01 * x + matrix.m05 * y + matrix.m13;
        return this;
      }
    }]);

    return Vec2;
  }(_valueType.ValueType);

  _exports.Vec2 = Vec2;
  Vec2.ZERO = Object.freeze(new Vec2(0, 0));
  Vec2.ONE = Object.freeze(new Vec2(1, 1));
  Vec2.NEG_ONE = Object.freeze(new Vec2(-1, -1));
  Vec2.UNIT_X = Object.freeze(new Vec2(1, 0));
  Vec2.UNIT_Y = Object.freeze(new Vec2(0, 1));
  var v2_1 = new Vec2();
  var v2_2 = new Vec2();

  _class.CCClass.fastDefine('cc.Vec2', Vec2, {
    x: 0,
    y: 0
  });

  _globalExports.legacyCC.Vec2 = Vec2;

  function v2(x, y) {
    return new Vec2(x, y);
  }

  _globalExports.legacyCC.v2 = v2;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC92ZWMyLnRzIl0sIm5hbWVzIjpbIlZlYzIiLCJhIiwieCIsInkiLCJvdXQiLCJiIiwiTWF0aCIsImNlaWwiLCJmbG9vciIsIm1pbiIsIm1heCIsInJvdW5kIiwic2NhbGUiLCJzcXJ0IiwiYWJzIiwiRVBTSUxPTiIsImxlbiIsInoiLCJ0IiwiciIsIlBJIiwiY29zIiwic2luIiwibSIsIm0wMCIsIm0wMyIsIm0wNiIsIm0wMSIsIm0wNCIsIm0wNyIsIm0xMiIsIm0wNSIsIm0xMyIsInYiLCJvZnMiLCJhcnIiLCJlcHNpbG9uIiwibm9ybWFsaXplIiwidjJfMSIsInYyXzIiLCJjb3NpbmUiLCJkb3QiLCJhY29zIiwib3RoZXIiLCJ0b0ZpeGVkIiwidG8iLCJyYXRpbyIsIm1pbkluY2x1c2l2ZSIsIm1heEluY2x1c2l2ZSIsInNjYWxhciIsImNvbnNvbGUiLCJ3YXJuIiwibWFnU3FyMSIsImxlbmd0aFNxciIsIm1hZ1NxcjIiLCJ0aGV0YSIsImFuZ2xlIiwiY3Jvc3MiLCJyYWRpYW5zIiwibWF0cml4IiwiVmFsdWVUeXBlIiwiWkVSTyIsIk9iamVjdCIsImZyZWV6ZSIsIk9ORSIsIk5FR19PTkUiLCJVTklUX1giLCJVTklUX1kiLCJDQ0NsYXNzIiwiZmFzdERlZmluZSIsImxlZ2FjeUNDIiwidjIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQTs7O01BR2FBLEk7Ozs7OztBQVFUOzs7NEJBRzZDQyxDLEVBQVE7QUFDakQsZUFBTyxJQUFJRCxJQUFKLENBQVNDLENBQUMsQ0FBQ0MsQ0FBWCxFQUFjRCxDQUFDLENBQUNFLENBQWhCLENBQVA7QUFDSDtBQUVEOzs7Ozs7MkJBRzRDQyxHLEVBQVVILEMsRUFBUTtBQUMxREcsUUFBQUEsR0FBRyxDQUFDRixDQUFKLEdBQVFELENBQUMsQ0FBQ0MsQ0FBVjtBQUNBRSxRQUFBQSxHQUFH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IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL21hdGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBDQ0NsYXNzIH0gZnJvbSAnLi4vZGF0YS9jbGFzcyc7XHJcbmltcG9ydCB7IFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZhbHVlLXR5cGUnO1xyXG5pbXBvcnQgeyBNYXQ0IH0gZnJvbSAnLi9tYXQ0JztcclxuaW1wb3J0IHsgSU1hdDNMaWtlLCBJTWF0NExpa2UsIElWZWMyTGlrZSB9IGZyb20gJy4vdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4vdmVjMyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIOS6jOe7tOWQkemHj+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZlYzIgZXh0ZW5kcyBWYWx1ZVR5cGUge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgWkVSTyA9IE9iamVjdC5mcmVlemUobmV3IFZlYzIoMCwgMCkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBPTkUgPSBPYmplY3QuZnJlZXplKG5ldyBWZWMyKDEsIDEpKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgTkVHX09ORSA9IE9iamVjdC5mcmVlemUobmV3IFZlYzIoLTEsIC0xKSk7XHJcbiAgICBwdWJsaWMgc3RhdGljIFVOSVRfWCA9IE9iamVjdC5mcmVlemUobmV3IFZlYzIoMSwgMCkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBVTklUX1kgPSBPYmplY3QuZnJlZXplKG5ldyBWZWMyKDAsIDEpKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflvpfmjIflrprlkJHph4/nmoTmi7fotJ1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKGEueCwgYS55KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlpI3liLbnm67moIflkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSBhLng7XHJcbiAgICAgICAgb3V0LnkgPSBhLnk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lkJHph4/lgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIG91dC54ID0geDtcclxuICAgICAgICBvdXQueSA9IHk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/liqDms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhZGQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54ICsgYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgYi55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5YeP5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc3VidHJhY3QgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54IC0gYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55IC0gYi55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54ICogYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55ICogYi55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP6Zmk5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGl2aWRlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcclxuICAgICAgICBvdXQueSA9IGEueSAvIGIueTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IE1hdGguY2VpbChhLngpO1xyXG4gICAgICAgIG91dC55ID0gTWF0aC5jZWlsKGEueSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lkJHkuIvlj5bmlbRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gTWF0aC5mbG9vcihhLngpO1xyXG4gICAgICAgIG91dC55ID0gTWF0aC5mbG9vcihhLnkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5pyA5bCP5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbWluIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IE1hdGgubWluKGEueCwgYi54KTtcclxuICAgICAgICBvdXQueSA9IE1hdGgubWluKGEueSwgYi55KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+acgOWkp+WAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1heCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1heChhLnksIGIueSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lm5voiI3kupTlhaXlj5bmlbRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3VuZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gTWF0aC5yb3VuZChhLngpO1xyXG4gICAgICAgIG91dC55ID0gTWF0aC5yb3VuZChhLnkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5qCH6YeP5LmY5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHlTY2FsYXIgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xyXG4gICAgICAgIG91dC54ID0gYS54ICogYjtcclxuICAgICAgICBvdXQueSA9IGEueSAqIGI7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyAoYi54ICogc2NhbGUpO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgKGIueSAqIHNjYWxlKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBiLnggLSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGIueSAtIGEueTtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu+W5s+aWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNxdWFyZWREaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gYi54IC0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBiLnkgLSBhLnk7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rGC5ZCR6YeP6ZW/5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVuIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnk7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLlkJHph4/plb/luqblubPmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW5ndGhTcXIgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lj5botJ9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBuZWdhdGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IC1hLng7XHJcbiAgICAgICAgb3V0LnkgPSAtYS55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIEluZmluaXR5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gMS4wIC8gYS54O1xyXG4gICAgICAgIG91dC55ID0gMS4wIC8gYS55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIDBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlU2FmZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHgpIDwgRVBTSUxPTikge1xyXG4gICAgICAgICAgICBvdXQueCA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0LnggPSAxLjAgLyB4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHkpIDwgRVBTSUxPTikge1xyXG4gICAgICAgICAgICBvdXQueSA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb3V0LnkgPSAxLjAgLyB5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlvZLkuIDljJblkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBub3JtYWxpemUgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgVmVjMkxpa2UgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogVmVjMkxpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnk7XHJcbiAgICAgICAgbGV0IGxlbiA9IHggKiB4ICsgeSAqIHk7XHJcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcclxuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xyXG4gICAgICAgICAgICBvdXQueCA9IHggKiBsZW47XHJcbiAgICAgICAgICAgIG91dC55ID0geSAqIGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkb3QgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/lj4nnp6/vvIjlkJHph4/np6/vvInvvIzms6jmhI/kuoznu7TlkJHph4/nmoTlj4nnp6/kuLrkuI4gWiDovbTlubPooYznmoTkuInnu7TlkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcm9zcyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBWZWMzLCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gb3V0LnkgPSAwO1xyXG4gICAgICAgIG91dC56ID0gYS54ICogYi55IC0gYS55ICogYi54O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP57q/5oCn5o+S5YC877yaIEEgKyB0ICogKEIgLSBBKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIG91dC54ID0geCArIHQgKiAoYi54IC0geCk7XHJcbiAgICAgICAgb3V0LnkgPSB5ICsgdCAqIChiLnkgLSB5KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeUn+aIkOS4gOS4quWcqOWNleS9jeWchuS4iuWdh+WMgOWIhuW4g+eahOmaj+acuuWQkemHj1xyXG4gICAgICogQHBhcmFtIHNjYWxlIOeUn+aIkOeahOWQkemHj+mVv+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJhbmRvbSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKSB7XHJcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XHJcbiAgICAgICAgY29uc3QgciA9IHJhbmRvbSgpICogMi4wICogTWF0aC5QSTtcclxuICAgICAgICBvdXQueCA9IE1hdGguY29zKHIpICogc2NhbGU7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLnNpbihyKSAqIHNjYWxlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5LiO5LiJ57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5LiJ5L2N5Li6IDHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1NYXQzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtOiBJTWF0M0xpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnk7XHJcbiAgICAgICAgb3V0LnggPSBtLm0wMCAqIHggKyBtLm0wMyAqIHkgKyBtLm0wNjtcclxuICAgICAgICBvdXQueSA9IG0ubTAxICogeCArIG0ubTA0ICogeSArIG0ubTA3O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5LiO5Zub57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5LiJ5L2N5Li6IDDvvIznrKzlm5vkvY3kuLogMeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybU1hdDQgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG06IElNYXQ0TGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICBvdXQueCA9IG0ubTAwICogeCArIG0ubTA0ICogeSArIG0ubTEyO1xyXG4gICAgICAgIG91dC55ID0gbS5tMDEgKiB4ICsgbS5tMDUgKiB5ICsgbS5tMTM7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDov5Tlm57lkJHph4/nmoTlrZfnrKbkuLLooajnpLpcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzdHIgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBgVmVjMigke2EueH0sICR7YS55fSlgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+i9rOaVsOe7hFxyXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCB2OiBJVmVjMkxpa2UsIG9mcyA9IDApIHtcclxuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XHJcbiAgICAgICAgb3V0W29mcyArIDFdID0gdi55O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pWw57uE6L2s5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcclxuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcclxuICAgICAgICBvdXQueSA9IGFycltvZnMgKyAxXTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+etieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5ZCR6YeP6L+R5Ly8562J5Lu35Yik5patXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dCwgIGVwc2lsb24gPSBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS54IC0gYi54KSA8PVxyXG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLngpLCBNYXRoLmFicyhiLngpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLnkgLSBiLnkpIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueSksIE1hdGguYWJzKGIueSkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLkuKTlkJHph4/lpLnop5LlvKfluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhbmdsZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBWZWMyLm5vcm1hbGl6ZSh2Ml8xLCBhKTtcclxuICAgICAgICBWZWMyLm5vcm1hbGl6ZSh2Ml8yLCBiKTtcclxuICAgICAgICBjb25zdCBjb3NpbmUgPSBWZWMyLmRvdCh2Ml8xLCB2Ml8yKTtcclxuICAgICAgICBpZiAoY29zaW5lID4gMS4wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29zaW5lIDwgLTEuMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5QSTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyhjb3NpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogeCDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogeSDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChvdGhlcjogVmVjMik7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4PzogbnVtYmVyIHwgVmVjMiwgeT86IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhYvpmoblvZPliY3lkJHph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb25lICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WJjeWQkemHj+S9v+WFtuS4juaMh+WumuWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOWQkemHj+OAglxyXG4gICAgICogQHJldHVybiBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAob3RoZXI6IFZlYzIpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WJjeWQkemHj+eahOWFt+S9k+WIhumHj+WAvOOAglxyXG4gICAgICogQHBhcmFtIHgg6KaB6K6+572u55qEIHgg5YiG6YeP55qE5YC8XHJcbiAgICAgKiBAcGFyYW0geSDopoHorr7nva7nmoQgeSDliIbph4/nmoTlgLxcclxuICAgICAqIEByZXR1cm4gYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIgfCBWZWMyLCB5PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKblnKjor6/lt67ojIPlm7TlhoXkuI7mjIflrprlkJHph4/nm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTlkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSBlcHNpbG9uIOWFgeiuuOeahOivr+W3ru+8jOW6lOS4uumdnui0n+aVsOOAglxyXG4gICAgICogQHJldHVybiDlvZPkuKTlkJHph4/nmoTlkITliIbph4/pg73lnKjmjIflrprnmoTor6/lt67ojIPlm7TlhoXliIbliKvnm7jnrYnml7bvvIzov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyAob3RoZXI6IFZlYzIsIGVwc2lsb24gPSBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy54IC0gb3RoZXIueCkgPD1cclxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy54KSwgTWF0aC5hYnMob3RoZXIueCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueSAtIG90aGVyLnkpIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueSksIE1hdGguYWJzKG90aGVyLnkpKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5Zyo6K+v5beu6IyD5Zu05YaF5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0geCDnm7jmr5TovoPnmoTlkJHph4/nmoQgeCDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB5IOebuOavlOi+g+eahOWQkemHj+eahCB5IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIGVwc2lsb24g5YWB6K6455qE6K+v5beu77yM5bqU5Li66Z2e6LSf5pWw44CCXHJcbiAgICAgKiBAcmV0dXJuIOW9k+S4pOWQkemHj+eahOWQhOWIhumHj+mDveWcqOaMh+WumueahOivr+W3ruiMg+WbtOWGheWIhuWIq+ebuOetieaXtu+8jOi/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzMmYgKHg6IG51bWJlciwgeTogbnVtYmVyLCBlcHNpbG9uID0gRVBTSUxPTikge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueCAtIHgpIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKHgpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSB5KSA8PVxyXG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyh5KSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuS4juaMh+WumuWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOWQkemHj+OAglxyXG4gICAgICogQHJldHVybiDkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IFZlYzIpIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKbkuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumuWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcmV0dXJuIOS4pOWQkemHj+eahOWQhOWIhumHj+mDveWIhuWIq+ebuOetieaXtui/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RyaWN0RXF1YWxzMmYgKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6L+U5Zue5b2T5YmN5ZCR6YeP55qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3lkJHph4/nmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gYCgke3RoaXMueC50b0ZpeGVkKDIpfSwgJHt0aGlzLnkudG9GaXhlZCgyKX0pYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7mjIflrprnmoTmj5LlgLzmr5TnjofvvIzku47lvZPliY3lkJHph4/liLDnm67moIflkJHph4/kuYvpl7TlgZrmj5LlgLzjgIJcclxuICAgICAqIEBwYXJhbSB0byDnm67moIflkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSByYXRpbyDmj5LlgLzmr5TnjofvvIzojIPlm7TkuLogWzAsMV3jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxlcnAgKHRvOiBWZWMyLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMueDtcclxuICAgICAgICBjb25zdCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueCA9IHggKyByYXRpbyAqICh0by54IC0geCk7XHJcbiAgICAgICAgdGhpcy55ID0geSArIHJhdGlvICogKHRvLnkgLSB5KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3lkJHph4/nmoTlgLzvvIzkvb/lhbblkITkuKrliIbph4/pg73lpITkuo7mjIflrprnmoTojIPlm7TlhoXjgIJcclxuICAgICAqIEBwYXJhbSBtaW5JbmNsdXNpdmUg5q+P5Liq5YiG6YeP6YO95Luj6KGo5LqG5a+55bqU5YiG6YeP5YWB6K6455qE5pyA5bCP5YC844CCXHJcbiAgICAgKiBAcGFyYW0gbWF4SW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWkp+WAvOOAglxyXG4gICAgICogQHJldHVybiBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsYW1wZiAobWluSW5jbHVzaXZlOiBWZWMyLCBtYXhJbmNsdXNpdmU6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLnggPSBjbGFtcCh0aGlzLngsIG1pbkluY2x1c2l2ZS54LCBtYXhJbmNsdXNpdmUueCk7XHJcbiAgICAgICAgdGhpcy55ID0gY2xhbXAodGhpcy55LCBtaW5JbmNsdXNpdmUueSwgbWF4SW5jbHVzaXZlLnkpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+WKoOazleOAguWwhuW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+eahOebuOWKoFxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkIChvdGhlcjogVmVjMikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCArIG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICsgb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/liqDms5XjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jliqBcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQyZiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggKyB4O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSArIHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5YeP5rOV44CC5bCG5b2T5YmN5ZCR6YeP5YeP5Y675oyH5a6a5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5YeP5pWw5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCAob3RoZXI6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5YeP5rOV44CC5bCG5b2T5YmN5ZCR6YeP5YeP5Y675oyH5a6a5YiG6YeP55qE5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0geCDmjIflrprnmoTlkJHph4/nmoQgeCDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB5IOaMh+WumueahOWQkemHj+eahCB5IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3VidHJhY3QyZiAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIHk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5pWw5LmY44CC5bCG5b2T5YmN5ZCR6YeP5pWw5LmY5oyH5a6a5qCH6YePXHJcbiAgICAgKiBAcGFyYW0gc2NhbGFyIOagh+mHj+S5mOaVsOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHlTY2FsYXIgKHNjYWxhcjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzY2FsYXIgPT09ICdvYmplY3QnKSB7IGNvbnNvbGUud2Fybignc2hvdWxkIHVzZSBWZWMyLm11bHRpcGx5IGZvciB2ZWN0b3IgKiB2ZWN0b3Igb3BlcmF0aW9uJyk7IH1cclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S5mOazleOAguWwhuW9k+WJjeWQkemHj+S5mOS7peS4juaMh+WumuWQkemHj+eahOe7k+aenOi1i+WAvOe7meW9k+WJjeWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkgKG90aGVyOiBWZWMyKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvdGhlciAhPT0gJ29iamVjdCcpIHsgY29uc29sZS53YXJuKCdzaG91bGQgdXNlIFZlYzIuc2NhbGUgZm9yIHZlY3RvciAqIHNjYWxhciBvcGVyYXRpb24nKTsgfVxyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogb3RoZXIueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/kuZjms5XjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jkuZjnmoTnu5PmnpzotYvlgLznu5nlvZPliY3lkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseTJmICh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHg7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogeTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/pgJDlhYPntKDnm7jpmaTjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jpmaTnmoTnu5PmnpzotYvlgLznu5nlvZPliY3lkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIGRpdmlkZSAob3RoZXI6IFZlYzIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLyBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAvIG90aGVyLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP6YCQ5YWD57Sg55u46Zmk44CC5bCG5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u46Zmk55qE57uT5p6c6LWL5YC857uZ5b2T5YmN5ZCR6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geCDmjIflrprnmoTlkJHph4/nmoQgeCDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB5IOaMh+WumueahOWQkemHj+eahCB5IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGl2aWRlMmYgKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54IC8geDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLyB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeWQkemHj+eahOWQhOS4quWIhumHj+WPluWPjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbmVnYXRpdmUgKCkge1xyXG4gICAgICAgIHRoaXMueCA9IC10aGlzLng7XHJcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/ngrnkuZjjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph4/jgIJcclxuICAgICAqIEByZXR1cm4g5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP54K55LmY55qE57uT5p6c44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkb3QgKG90aGVyOiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIG90aGVyLnggKyB0aGlzLnkgKiBvdGhlci55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+WPieS5mOOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICogQHJldHVybiBgb3V0YFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3Jvc3MgKG90aGVyOiBWZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIG90aGVyLnkgLSB0aGlzLnkgKiBvdGhlci54O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X5ZCR6YeP55qE6ZW/5bqm77yI5qih77yJ44CCXHJcbiAgICAgKiBAcmV0dXJuIOWQkemHj+eahOmVv+W6pu+8iOaooe+8ieOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorqHnrpflkJHph4/plb/luqbvvIjmqKHvvInnmoTlubPmlrnjgIJcclxuICAgICAqIEByZXR1cm4g5ZCR6YeP6ZW/5bqm77yI5qih77yJ55qE5bmz5pa544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZW5ndGhTcXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5b2T5YmN5ZCR6YeP5b2S5LiA5YyW44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBub3JtYWxpemUgKCkge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueTtcclxuICAgICAgICBsZXQgbGVuID0geCAqIHggKyB5ICogeTtcclxuICAgICAgICBpZiAobGVuID4gMCkge1xyXG4gICAgICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHRoaXMueCAqIGxlbjtcclxuICAgICAgICAgICAgdGhpcy55ID0gdGhpcy55ICogbGVuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5blvZPliY3lkJHph4/lkozmjIflrprlkJHph4/kuYvpl7TnmoTop5LluqbjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph4/jgIJcclxuICAgICAqIEByZXR1cm4g5b2T5YmN5ZCR6YeP5ZKM5oyH5a6a5ZCR6YeP5LmL6Ze055qE6KeS5bqm77yI5byn5bqm5Yi277yJ77yb6Iul5b2T5YmN5ZCR6YeP5ZKM5oyH5a6a5ZCR6YeP5Lit5a2Y5Zyo6Zu25ZCR6YeP77yM5bCG6L+U5ZueIDDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFuZ2xlIChvdGhlcjogVmVjMikge1xyXG4gICAgICAgIGNvbnN0IG1hZ1NxcjEgPSB0aGlzLmxlbmd0aFNxcigpO1xyXG4gICAgICAgIGNvbnN0IG1hZ1NxcjIgPSBvdGhlci5sZW5ndGhTcXIoKTtcclxuXHJcbiAgICAgICAgaWYgKG1hZ1NxcjEgPT09IDAgfHwgbWFnU3FyMiA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZ2V0IGFuZ2xlIGJldHdlZW4gemVybyB2ZWN0b3InKTtcclxuICAgICAgICAgICAgcmV0dXJuIDAuMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRvdCA9IHRoaXMuZG90KG90aGVyKTtcclxuICAgICAgICBsZXQgdGhldGEgPSBkb3QgLyAoTWF0aC5zcXJ0KG1hZ1NxcjEgKiBtYWdTcXIyKSk7XHJcbiAgICAgICAgdGhldGEgPSBjbGFtcCh0aGV0YSwgLTEuMCwgMS4wKTtcclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKHRoZXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5blvZPliY3lkJHph4/lkozmjIflrprlkJHph4/kuYvpl7TnmoTmnInnrKblj7fop5LluqbjgII8YnIvPlxyXG4gICAgICog5pyJ56ym5Y+36KeS5bqm55qE5Y+W5YC86IyD5Zu05Li6ICgtMTgwLCAxODBd77yM5b2T5YmN5ZCR6YeP5Y+v5Lul6YCa6L+H6YCG5pe26ZKI5peL6L2s5pyJ56ym5Y+36KeS5bqm5LiO5oyH5a6a5ZCR6YeP5ZCM5ZCR44CCPGJyLz5cclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph4/jgIJcclxuICAgICAqIEByZXR1cm4g5b2T5YmN5ZCR6YeP5ZKM5oyH5a6a5ZCR6YeP5LmL6Ze055qE5pyJ56ym5Y+36KeS5bqm77yI5byn5bqm5Yi277yJ77yb6Iul5b2T5YmN5ZCR6YeP5ZKM5oyH5a6a5ZCR6YeP5Lit5a2Y5Zyo6Zu25ZCR6YeP77yM5bCG6L+U5ZueIDDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNpZ25BbmdsZSAob3RoZXI6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuYW5nbGUob3RoZXIpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyb3NzKG90aGVyKSA8IDAgPyAtYW5nbGUgOiBhbmdsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIblvZPliY3lkJHph4/nmoTml4vovaxcclxuICAgICAqIEBwYXJhbSByYWRpYW5zIOaXi+i9rOinkuW6pu+8iOW8p+W6puWItu+8ieOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcm90YXRlIChyYWRpYW5zOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZGlhbnMpO1xyXG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xyXG4gICAgICAgIHRoaXMueCA9IGNvcyAqIHggLSBzaW4gKiB5O1xyXG4gICAgICAgIHRoaXMueSA9IHNpbiAqIHggKyBjb3MgKiB5O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+W9k+WJjeWQkemHj+WcqOaMh+WumuWQkemHj+S4iueahOaKleW9seWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJvamVjdCAob3RoZXI6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCBzY2FsYXIgPSB0aGlzLmRvdChvdGhlcikgLyBvdGhlci5kb3Qob3RoZXIpO1xyXG4gICAgICAgIHRoaXMueCA9IG90aGVyLnggKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy55ID0gb3RoZXIueSAqIHNjYWxhcjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIblvZPliY3lkJHph4/op4bkuLogeiDliIbph4/kuLogMOOAgXcg5YiG6YeP5Li6IDEg55qE5Zub57u05ZCR6YeP77yMPGJyLz5cclxuICAgICAqIOW6lOeUqOWbm+e7tOefqemYteWPmOaNouWIsOW9k+WJjeefqemYtTxici8+XHJcbiAgICAgKiBAcGFyYW0gbWF0cml4IOWPmOaNouefqemYteOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtTWF0NCAobWF0cml4OiBNYXQ0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHRoaXMueDtcclxuICAgICAgICBjb25zdCB5ID0gdGhpcy55O1xyXG4gICAgICAgIHRoaXMueCA9IG1hdHJpeC5tMDAgKiB4ICsgbWF0cml4Lm0wNCAqIHkgKyBtYXRyaXgubTEyO1xyXG4gICAgICAgIHRoaXMueSA9IG1hdHJpeC5tMDEgKiB4ICsgbWF0cml4Lm0wNSAqIHkgKyBtYXRyaXgubTEzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB2Ml8xID0gbmV3IFZlYzIoKTtcclxuY29uc3QgdjJfMiA9IG5ldyBWZWMyKCk7XHJcblxyXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlZlYzInLCBWZWMyLCB7IHg6IDAsIHk6IDAgfSk7XHJcbmxlZ2FjeUNDLlZlYzIgPSBWZWMyO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHYyIChvdGhlcjogVmVjMik6IFZlYzI7XHJcbmV4cG9ydCBmdW5jdGlvbiB2MiAoeD86IG51bWJlciwgeT86IG51bWJlcik6IFZlYzI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdjIgKHg/OiBudW1iZXIgfCBWZWMyLCB5PzogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFZlYzIoeCBhcyBhbnksIHkpO1xyXG59XHJcblxyXG5sZWdhY3lDQy52MiA9IHYyO1xyXG4iXX0=