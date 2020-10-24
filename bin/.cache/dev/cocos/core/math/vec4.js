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
    global.vec4 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _utils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.v4 = v4;
  _exports.Vec4 = void 0;

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
   * 四维向量。
   */
  var Vec4 = /*#__PURE__*/function (_ValueType) {
    _inherits(Vec4, _ValueType);

    _createClass(Vec4, null, [{
      key: "clone",

      /**
       * @zh 获得指定向量的拷贝
       */
      value: function clone(a) {
        return new Vec4(a.x, a.y, a.z, a.w);
      }
      /**
       * @zh 复制目标向量
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = a.w;
        return out;
      }
      /**
       * @zh 设置向量值
       */

    }, {
      key: "set",
      value: function set(out, x, y, z, w) {
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
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
        out.z = a.z + b.z;
        out.w = a.w + b.w;
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
        out.z = a.z - b.z;
        out.w = a.w - b.w;
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
        out.z = a.z * b.z;
        out.w = a.w * b.w;
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
        out.z = a.z / b.z;
        out.w = a.w / b.w;
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
        out.z = Math.ceil(a.z);
        out.w = Math.ceil(a.w);
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
        out.z = Math.floor(a.z);
        out.w = Math.floor(a.w);
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
        out.z = Math.min(a.z, b.z);
        out.w = Math.min(a.w, b.w);
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
        out.z = Math.max(a.z, b.z);
        out.w = Math.max(a.w, b.w);
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
        out.z = Math.round(a.z);
        out.w = Math.round(a.w);
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
        out.z = a.z * b;
        out.w = a.w * b;
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
        out.z = a.z + b.z * scale;
        out.w = a.w + b.w * scale;
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
        var z = b.z - a.z;
        var w = b.w - a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
      }
      /**
       * @zh 求两向量的欧氏距离平方
       */

    }, {
      key: "squaredDistance",
      value: function squaredDistance(a, b) {
        var x = b.x - a.x;
        var y = b.y - a.y;
        var z = b.z - a.z;
        var w = b.w - a.w;
        return x * x + y * y + z * z + w * w;
      }
      /**
       * @zh 求向量长度
       */

    }, {
      key: "len",
      value: function len(a) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        var w = a.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
      }
      /**
       * @zh 求向量长度平方
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr(a) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        var w = a.w;
        return x * x + y * y + z * z + w * w;
      }
      /**
       * @zh 逐元素向量取负
       */

    }, {
      key: "negate",
      value: function negate(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = -a.w;
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
        out.z = 1.0 / a.z;
        out.w = 1.0 / a.w;
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
        var z = a.z;
        var w = a.w;

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

        if (Math.abs(z) < _utils.EPSILON) {
          out.z = 0;
        } else {
          out.z = 1.0 / z;
        }

        if (Math.abs(w) < _utils.EPSILON) {
          out.w = 0;
        } else {
          out.w = 1.0 / w;
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
        var z = a.z;
        var w = a.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          out.x = x * len;
          out.y = y * len;
          out.z = z * len;
          out.w = w * len;
        }

        return out;
      }
      /**
       * @zh 向量点积（数量积）
       */

    }, {
      key: "dot",
      value: function dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
      }
      /**
       * @zh 逐元素向量线性插值： A + t * (B - A)
       */

    }, {
      key: "lerp",
      value: function lerp(out, a, b, t) {
        out.x = a.x + t * (b.x - a.x);
        out.y = a.y + t * (b.y - a.y);
        out.z = a.z + t * (b.z - a.z);
        out.w = a.w + t * (b.w - a.w);
        return out;
      }
      /**
       * @zh 生成一个在单位球体上均匀分布的随机向量
       * @param scale 生成的向量长度
       */

    }, {
      key: "random",
      value: function random(out, scale) {
        scale = scale || 1.0;
        var phi = (0, _utils.random)() * 2.0 * Math.PI;
        var cosTheta = (0, _utils.random)() * 2 - 1;
        var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
        out.x = sinTheta * Math.cos(phi) * scale;
        out.y = sinTheta * Math.sin(phi) * scale;
        out.z = cosTheta * scale;
        out.w = 0;
        return out;
      }
      /**
       * @zh 向量矩阵乘法
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(out, a, m) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        var w = a.w;
        out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12 * w;
        out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13 * w;
        out.z = m.m02 * x + m.m06 * y + m.m10 * z + m.m14 * w;
        out.w = m.m03 * x + m.m07 * y + m.m11 * z + m.m15 * w;
        return out;
      }
      /**
       * @zh 向量仿射变换
       */

    }, {
      key: "transformAffine",
      value: function transformAffine(out, v, m) {
        var x = v.x;
        var y = v.y;
        var z = v.z;
        var w = v.w;
        out.x = m.m00 * x + m.m01 * y + m.m02 * z + m.m03 * w;
        out.y = m.m04 * x + m.m05 * y + m.m06 * z + m.m07 * w;
        out.x = m.m08 * x + m.m09 * y + m.m10 * z + m.m11 * w;
        out.w = v.w;
        return out;
      }
      /**
       * @zh 向量四元数乘法
       */

    }, {
      key: "transformQuat",
      value: function transformQuat(out, a, q) {
        var x = a.x,
            y = a.y,
            z = a.z;
        var _x = q.x;
        var _y = q.y;
        var _z = q.z;
        var _w = q.w; // calculate quat * vec

        var ix = _w * x + _y * z - _z * y;
        var iy = _w * y + _z * x - _x * z;
        var iz = _w * z + _x * y - _y * x;
        var iw = -_x * x - _y * y - _z * z; // calculate result * inverse quat

        out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
        out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
        out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
        out.w = a.w;
        return out;
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
        out[ofs + 2] = v.z;
        out[ofs + 3] = v.w;
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
        out.z = arr[ofs + 2];
        out.w = arr[ofs + 3];
        return out;
      }
      /**
       * @zh 向量等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
      }
      /**
       * @zh 排除浮点数误差的向量近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) && Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) && Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w));
      }
      /**
       * x 分量。
       */

    }]);

    function Vec4(x, y, z, w) {
      var _this;

      _classCallCheck(this, Vec4);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Vec4).call(this));

      if (x && _typeof(x) === 'object') {
        _this.x = x.x;
        _this.y = x.y;
        _this.z = x.z;
        _this.w = x.w;
      } else {
        _this.x = x || 0;
        _this.y = y || 0;
        _this.z = z || 0;
        _this.w = w || 0;
      }

      return _this;
    }
    /**
     * @zh 克隆当前向量。
     */


    _createClass(Vec4, [{
      key: "clone",
      value: function clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
      }
      /**
       * @zh 设置当前向量使其与指定向量相等。
       * @param other 相比较的向量。
       * @returns `this`
       */

    }, {
      key: "set",
      value: function set(x, y, z, w) {
        if (x && _typeof(x) === 'object') {
          this.x = x.x;
          this.y = x.y;
          this.z = x.z;
          this.w = x.w;
        } else {
          this.x = x || 0;
          this.y = y || 0;
          this.z = z || 0;
          this.w = w || 0;
        }

        return this;
      }
      /**
       * @zh 判断当前向量是否在误差范围内与指定向量相等。
       * @param other 相比较的向量。
       * @param epsilon 允许的误差，应为非负数。
       * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.EPSILON;
        return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) && Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z)) && Math.abs(this.w - other.w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(other.w));
      }
      /**
       * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
       * @param x 相比较的向量的 x 分量。
       * @param y 相比较的向量的 y 分量。
       * @param z 相比较的向量的 z 分量。
       * @param w 相比较的向量的 w 分量。
       * @param epsilon 允许的误差，应为非负数。
       * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals4f",
      value: function equals4f(x, y, z, w) {
        var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _utils.EPSILON;
        return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) && Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z)) && Math.abs(this.w - w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(w));
      }
      /**
       * @zh 判断当前向量是否与指定向量相等。
       * @param other 相比较的向量。
       * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
      }
      /**
       * @zh 判断当前向量是否与指定分量的向量相等。
       * @param x 指定向量的 x 分量。
       * @param y 指定向量的 y 分量。
       * @param z 指定向量的 z 分量。
       * @param w 指定向量的 w 分量。
       * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals4f",
      value: function strictEquals4f(x, y, z, w) {
        return this.x === x && this.y === y && this.z === z && this.w === w;
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
        var z = this.z;
        var w = this.w;
        this.x = x + ratio * (to.x - x);
        this.y = y + ratio * (to.y - y);
        this.z = z + ratio * (to.z - z);
        this.w = w + ratio * (to.w - w);
        return this;
      }
      /**
       * @zh 返回当前向量的字符串表示。
       * @returns 当前向量的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return "(".concat(this.x.toFixed(2), ", ").concat(this.y.toFixed(2), ", ").concat(this.z.toFixed(2), ", ").concat(this.w.toFixed(2), ")");
      }
      /**
       * @zh 设置当前向量的值，使其各个分量都处于指定的范围内。
       * @param minInclusive 每个分量都代表了对应分量允许的最小值。
       * @param maxInclusive 每个分量都代表了对应分量允许的最大值。
       * @returns `this`
       */

    }, {
      key: "clampf",
      value: function clampf(minInclusive, maxInclusive) {
        this.x = (0, _utils.clamp)(this.x, minInclusive.x, maxInclusive.x);
        this.y = (0, _utils.clamp)(this.y, minInclusive.y, maxInclusive.y);
        this.z = (0, _utils.clamp)(this.z, minInclusive.z, maxInclusive.z);
        this.w = (0, _utils.clamp)(this.w, minInclusive.w, maxInclusive.w);
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
        this.z = this.z + other.z;
        this.w = this.w + other.w;
        return this;
      }
      /**
       * @zh 向量加法。将当前向量与指定分量的向量相加
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       * @param w 指定的向量的 w 分量。
       */

    }, {
      key: "add4f",
      value: function add4f(x, y, z, w) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.z = this.z + z;
        this.w = this.w + w;
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
        this.z = this.z - other.z;
        this.w = this.w - other.w;
        return this;
      }
      /**
       * @zh 向量减法。将当前向量减去指定分量的向量
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       * @param w 指定的向量的 w 分量。
       */

    }, {
      key: "subtract4f",
      value: function subtract4f(x, y, z, w) {
        this.x = this.x - x;
        this.y = this.y - y;
        this.z = this.z - z;
        this.w = this.w - w;
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
          console.warn('should use Vec4.multiply for vector * vector operation');
        }

        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
        this.w = this.w * scalar;
        return this;
      }
      /**
       * @zh 向量乘法。将当前向量乘以指定向量
       * @param other 指定的向量。
       */

    }, {
      key: "multiply",
      value: function multiply(other) {
        if (_typeof(other) !== 'object') {
          console.warn('should use Vec4.scale for vector * scalar operation');
        }

        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
        this.w = this.w * other.w;
        return this;
      }
      /**
       * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       * @param w 指定的向量的 w 分量。
       */

    }, {
      key: "multiply4f",
      value: function multiply4f(x, y, z, w) {
        this.x = this.x * x;
        this.y = this.y * y;
        this.z = this.z * z;
        this.w = this.w * w;
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
        this.z = this.z / other.z;
        this.w = this.w / other.w;
        return this;
      }
      /**
       * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       * @param w 指定的向量的 w 分量。
       */

    }, {
      key: "divide4f",
      value: function divide4f(x, y, z, w) {
        this.x = this.x / x;
        this.y = this.y / y;
        this.z = this.z / z;
        this.w = this.w / w;
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
        this.z = -this.z;
        this.w = -this.w;
        return this;
      }
      /**
       * @zh 向量点乘。
       * @param other 指定的向量。
       * @returns 当前向量与指定向量点乘的结果。
       */

    }, {
      key: "dot",
      value: function dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
      }
      /**
       * @zh 向量叉乘。视当前向量和指定向量为三维向量（舍弃 w 分量），将当前向量左叉乘指定向量
       * @param other 指定的向量。
       */

    }, {
      key: "cross",
      value: function cross(vector) {
        var ax = this.x,
            ay = this.y,
            az = this.z;
        var bx = vector.x,
            by = vector.y,
            bz = vector.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
      }
      /**
       * @zh 计算向量的长度（模）。
       * @returns 向量的长度（模）。
       */

    }, {
      key: "length",
      value: function length() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        return Math.sqrt(x * x + y * y + z * z + w * w);
      }
      /**
       * @zh 计算向量长度（模）的平方。
       * @returns 向量长度（模）的平方。
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        return x * x + y * y + z * z + w * w;
      }
      /**
       * @zh 将当前向量归一化
       */

    }, {
      key: "normalize",
      value: function normalize() {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        var len = x * x + y * y + z * z + w * w;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          this.x = x * len;
          this.y = y * len;
          this.z = z * len;
          this.w = w * len;
        }

        return this;
      }
      /**
       * @zh 应用四维矩阵变换到当前矩阵
       * @param matrix 变换矩阵。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(matrix) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;
        this.x = matrix.m00 * x + matrix.m04 * y + matrix.m08 * z + matrix.m12 * w;
        this.y = matrix.m01 * x + matrix.m05 * y + matrix.m09 * z + matrix.m13 * w;
        this.z = matrix.m02 * x + matrix.m06 * y + matrix.m10 * z + matrix.m14 * w;
        this.w = matrix.m03 * x + matrix.m07 * y + matrix.m11 * z + matrix.m15 * w;
        return this;
      }
    }]);

    return Vec4;
  }(_valueType.ValueType);

  _exports.Vec4 = Vec4;
  Vec4.ZERO = Object.freeze(new Vec4(0, 0, 0, 0));
  Vec4.ONE = Object.freeze(new Vec4(1, 1, 1, 1));
  Vec4.NEG_ONE = Object.freeze(new Vec4(-1, -1, -1, -1));

  _class.CCClass.fastDefine('cc.Vec4', Vec4, {
    x: 0,
    y: 0,
    z: 0,
    w: 0
  });

  _globalExports.legacyCC.Vec4 = Vec4;

  function v4(x, y, z, w) {
    return new Vec4(x, y, z, w);
  }

  _globalExports.legacyCC.v4 = v4;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC92ZWM0LnRzIl0sIm5hbWVzIjpbIlZlYzQiLCJhIiwieCIsInkiLCJ6IiwidyIsIm91dCIsImIiLCJNYXRoIiwiY2VpbCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZSIsInNxcnQiLCJhYnMiLCJFUFNJTE9OIiwibGVuIiwidCIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsIm0iLCJtMDAiLCJtMDQiLCJtMDgiLCJtMTIiLCJtMDEiLCJtMDUiLCJtMDkiLCJtMTMiLCJtMDIiLCJtMDYiLCJtMTAiLCJtMTQiLCJtMDMiLCJtMDciLCJtMTEiLCJtMTUiLCJ2IiwicSIsIl94IiwiX3kiLCJfeiIsIl93IiwiaXgiLCJpeSIsIml6IiwiaXciLCJvZnMiLCJhcnIiLCJlcHNpbG9uIiwib3RoZXIiLCJ0byIsInJhdGlvIiwidG9GaXhlZCIsIm1pbkluY2x1c2l2ZSIsIm1heEluY2x1c2l2ZSIsInNjYWxhciIsImNvbnNvbGUiLCJ3YXJuIiwidmVjdG9yIiwiYXgiLCJheSIsImF6IiwiYngiLCJieSIsImJ6IiwibWF0cml4IiwiVmFsdWVUeXBlIiwiWkVSTyIsIk9iamVjdCIsImZyZWV6ZSIsIk9ORSIsIk5FR19PTkUiLCJDQ0NsYXNzIiwiZmFzdERlZmluZSIsImxlZ2FjeUNDIiwidjQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDQTs7O01BR2FBLEk7Ozs7OztBQU1UOzs7NEJBRzZDQyxDLEVBQVE7QUFDakQsZUFBTyxJQUFJRCxJQUFKLENBQVNDLENBQUMsQ0FBQ0MsQ0FBWCxFQUFjRCxDQUFDLENBQUNFLENBQWhCLEVBQW1CRixDQUFDLENBQUNHLENBQXJCLEVBQXdCSCxDQUFDLENBQUNJLENBQTFCLENBQVA7QUFDSDtBQUVEOzs7Ozs7MkJBRzRDQyxHLEVBQVVMLEMsRUFB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QyxFQUE0Q0MsQ0FBNUMsRUFBd0RDLENBQXhELEVBQW9FO0FBQ3ZFLFdBQU8sSUFBSUwsSUFBSixDQUFTRSxDQUFULEVBQW1CQyxDQUFuQixFQUFzQkMsQ0FBdEIsRUFBeUJDLENBQXpCLENBQVA7QUFDSDs7QUFFRDRFLDBCQUFTQyxFQUFULEdBQWNBLEVBQWQiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvbWF0aFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9kYXRhL2NsYXNzJztcclxuaW1wb3J0IHsgVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmFsdWUtdHlwZSc7XHJcbmltcG9ydCB7IE1hdDQgfSBmcm9tICcuL21hdDQnO1xyXG5pbXBvcnQgeyBJTWF0NExpa2UsIElRdWF0TGlrZSwgSVZlYzRMaWtlIH0gZnJvbSAnLi90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IGNsYW1wLCBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICog5Zub57u05ZCR6YeP44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVmVjNCBleHRlbmRzIFZhbHVlVHlwZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBaRVJPID0gT2JqZWN0LmZyZWV6ZShuZXcgVmVjNCgwLCAwLCAwLCAwKSk7XHJcbiAgICBwdWJsaWMgc3RhdGljIE9ORSA9IE9iamVjdC5mcmVlemUobmV3IFZlYzQoMSwgMSwgMSwgMSkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBORUdfT05FID0gT2JqZWN0LmZyZWV6ZShuZXcgVmVjNCgtMSwgLTEsIC0xLCAtMSkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzQoYS54LCBhLnksIGEueiwgYS53KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlpI3liLbnm67moIflkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSBhLng7XHJcbiAgICAgICAgb3V0LnkgPSBhLnk7XHJcbiAgICAgICAgb3V0LnogPSBhLno7XHJcbiAgICAgICAgb3V0LncgPSBhLnc7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lkJHph4/lgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcclxuICAgICAgICBvdXQueCA9IHg7XHJcbiAgICAgICAgb3V0LnkgPSB5O1xyXG4gICAgICAgIG91dC56ID0gejtcclxuICAgICAgICBvdXQudyA9IHc7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/liqDms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhZGQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54ICsgYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgYi55O1xyXG4gICAgICAgIG91dC56ID0gYS56ICsgYi56O1xyXG4gICAgICAgIG91dC53ID0gYS53ICsgYi53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5YeP5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc3VidHJhY3QgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54IC0gYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55IC0gYi55O1xyXG4gICAgICAgIG91dC56ID0gYS56IC0gYi56O1xyXG4gICAgICAgIG91dC53ID0gYS53IC0gYi53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gYS54ICogYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55ICogYi55O1xyXG4gICAgICAgIG91dC56ID0gYS56ICogYi56O1xyXG4gICAgICAgIG91dC53ID0gYS53ICogYi53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP6Zmk5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGl2aWRlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcclxuICAgICAgICBvdXQueSA9IGEueSAvIGIueTtcclxuICAgICAgICBvdXQueiA9IGEueiAvIGIuejtcclxuICAgICAgICBvdXQudyA9IGEudyAvIGIudztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IE1hdGguY2VpbChhLngpO1xyXG4gICAgICAgIG91dC55ID0gTWF0aC5jZWlsKGEueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLmNlaWwoYS56KTtcclxuICAgICAgICBvdXQudyA9IE1hdGguY2VpbChhLncpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiL5Y+W5pW0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZmxvb3IgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IE1hdGguZmxvb3IoYS54KTtcclxuICAgICAgICBvdXQueSA9IE1hdGguZmxvb3IoYS55KTtcclxuICAgICAgICBvdXQueiA9IE1hdGguZmxvb3IoYS56KTtcclxuICAgICAgICBvdXQudyA9IE1hdGguZmxvb3IoYS53KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+acgOWwj+WAvFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1pbiA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihhLngsIGIueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1pbihhLnksIGIueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLm1pbihhLnosIGIueik7XHJcbiAgICAgICAgb3V0LncgPSBNYXRoLm1pbihhLncsIGIudyk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtYXggPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gTWF0aC5tYXgoYS54LCBiLngpO1xyXG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYS55LCBiLnkpO1xyXG4gICAgICAgIG91dC56ID0gTWF0aC5tYXgoYS56LCBiLnopO1xyXG4gICAgICAgIG91dC53ID0gTWF0aC5tYXgoYS53LCBiLncpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Zub6IiN5LqU5YWl5Y+W5pW0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm91bmQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICBvdXQueCA9IE1hdGgucm91bmQoYS54KTtcclxuICAgICAgICBvdXQueSA9IE1hdGgucm91bmQoYS55KTtcclxuICAgICAgICBvdXQueiA9IE1hdGgucm91bmQoYS56KTtcclxuICAgICAgICBvdXQudyA9IE1hdGgucm91bmQoYS53KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+agh+mHj+S5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQueCA9IGEueCAqIGI7XHJcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiO1xyXG4gICAgICAgIG91dC56ID0gYS56ICogYjtcclxuICAgICAgICBvdXQudyA9IGEudyAqIGI7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyAoYi54ICogc2NhbGUpO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgKGIueSAqIHNjYWxlKTtcclxuICAgICAgICBvdXQueiA9IGEueiArIChiLnogKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0LncgPSBhLncgKyAoYi53ICogc2NhbGUpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBiLnogLSBhLno7XHJcbiAgICAgICAgY29uc3QgdyA9IGIudyAtIGEudztcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLkuKTlkJHph4/nmoTmrKfmsI/ot53nprvlubPmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzcXVhcmVkRGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBiLnogLSBhLno7XHJcbiAgICAgICAgY29uc3QgdyA9IGIudyAtIGEudztcclxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rGC5ZCR6YeP6ZW/5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVuIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IGEuejtcclxuICAgICAgICBjb25zdCB3ID0gYS53O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguWQkemHj+mVv+W6puW5s+aWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcbiAgICAgICAgY29uc3QgdyA9IGEudztcclxuICAgICAgICByZXR1cm4geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W6LSfXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbmVnYXRlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSAtYS54O1xyXG4gICAgICAgIG91dC55ID0gLWEueTtcclxuICAgICAgICBvdXQueiA9IC1hLno7XHJcbiAgICAgICAgb3V0LncgPSAtYS53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIEluZmluaXR5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gMS4wIC8gYS54O1xyXG4gICAgICAgIG91dC55ID0gMS4wIC8gYS55O1xyXG4gICAgICAgIG91dC56ID0gMS4wIC8gYS56O1xyXG4gICAgICAgIG91dC53ID0gMS4wIC8gYS53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIDBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlU2FmZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICBjb25zdCB6ID0gYS56O1xyXG4gICAgICAgIGNvbnN0IHcgPSBhLnc7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyh4KSA8IEVQU0lMT04pIHtcclxuICAgICAgICAgICAgb3V0LnggPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC54ID0gMS4wIC8geDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyh5KSA8IEVQU0lMT04pIHtcclxuICAgICAgICAgICAgb3V0LnkgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC55ID0gMS4wIC8geTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyh6KSA8IEVQU0lMT04pIHtcclxuICAgICAgICAgICAgb3V0LnogPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC56ID0gMS4wIC8gejtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmFicyh3KSA8IEVQU0lMT04pIHtcclxuICAgICAgICAgICAgb3V0LncgPSAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC53ID0gMS4wIC8gdztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2S5LiA5YyW5ZCR6YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbm9ybWFsaXplIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcbiAgICAgICAgY29uc3QgdyA9IGEudztcclxuICAgICAgICBsZXQgbGVuID0geCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHc7XHJcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcclxuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xyXG4gICAgICAgICAgICBvdXQueCA9IHggKiBsZW47XHJcbiAgICAgICAgICAgIG91dC55ID0geSAqIGxlbjtcclxuICAgICAgICAgICAgb3V0LnogPSB6ICogbGVuO1xyXG4gICAgICAgICAgICBvdXQudyA9IHcgKiBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP54K556ev77yI5pWw6YeP56ev77yJXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP57q/5oCn5o+S5YC877yaIEEgKyB0ICogKEIgLSBBKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgdDogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyB0ICogKGIueCAtIGEueCk7XHJcbiAgICAgICAgb3V0LnkgPSBhLnkgKyB0ICogKGIueSAtIGEueSk7XHJcbiAgICAgICAgb3V0LnogPSBhLnogKyB0ICogKGIueiAtIGEueik7XHJcbiAgICAgICAgb3V0LncgPSBhLncgKyB0ICogKGIudyAtIGEudyk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnlJ/miJDkuIDkuKrlnKjljZXkvY3nkIPkvZPkuIrlnYfljIDliIbluIPnmoTpmo/mnLrlkJHph49cclxuICAgICAqIEBwYXJhbSBzY2FsZSDnlJ/miJDnmoTlkJHph4/plb/luqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByYW5kb20gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcikge1xyXG4gICAgICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xyXG5cclxuICAgICAgICBjb25zdCBwaGkgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgY29zVGhldGEgPSByYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNpblRoZXRhID0gTWF0aC5zcXJ0KDEgLSBjb3NUaGV0YSAqIGNvc1RoZXRhKTtcclxuXHJcbiAgICAgICAgb3V0LnggPSBzaW5UaGV0YSAqIE1hdGguY29zKHBoaSkgKiBzY2FsZTtcclxuICAgICAgICBvdXQueSA9IHNpblRoZXRhICogTWF0aC5zaW4ocGhpKSAqIHNjYWxlO1xyXG4gICAgICAgIG91dC56ID0gY29zVGhldGEgKiBzY2FsZTtcclxuICAgICAgICBvdXQudyA9IDA7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/nn6npmLXkuZjms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1NYXQ0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtOiBNYXRMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcbiAgICAgICAgY29uc3QgdyA9IGEudztcclxuICAgICAgICBvdXQueCA9IG0ubTAwICogeCArIG0ubTA0ICogeSArIG0ubTA4ICogeiArIG0ubTEyICogdztcclxuICAgICAgICBvdXQueSA9IG0ubTAxICogeCArIG0ubTA1ICogeSArIG0ubTA5ICogeiArIG0ubTEzICogdztcclxuICAgICAgICBvdXQueiA9IG0ubTAyICogeCArIG0ubTA2ICogeSArIG0ubTEwICogeiArIG0ubTE0ICogdztcclxuICAgICAgICBvdXQudyA9IG0ubTAzICogeCArIG0ubTA3ICogeSArIG0ubTExICogeiArIG0ubTE1ICogdztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S7v+WwhOWPmOaNolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjNExpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+XHJcbiAgICAgICAgKG91dDogT3V0LCB2OiBWZWNMaWtlLCBtOiBNYXRMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHYueDtcclxuICAgICAgICBjb25zdCB5ID0gdi55O1xyXG4gICAgICAgIGNvbnN0IHogPSB2Lno7XHJcbiAgICAgICAgY29uc3QgdyA9IHYudztcclxuICAgICAgICBvdXQueCA9IG0ubTAwICogeCArIG0ubTAxICogeSArIG0ubTAyICogeiArIG0ubTAzICogdztcclxuICAgICAgICBvdXQueSA9IG0ubTA0ICogeCArIG0ubTA1ICogeSArIG0ubTA2ICogeiArIG0ubTA3ICogdztcclxuICAgICAgICBvdXQueCA9IG0ubTA4ICogeCArIG0ubTA5ICogeSArIG0ubTEwICogeiArIG0ubTExICogdztcclxuICAgICAgICBvdXQudyA9IHYudztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+Wbm+WFg+aVsOS5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVF1YXQgPE91dCBleHRlbmRzIElWZWM0TGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBxOiBRdWF0TGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiB9ID0gYTtcclxuXHJcbiAgICAgICAgY29uc3QgX3ggPSBxLng7XHJcbiAgICAgICAgY29uc3QgX3kgPSBxLnk7XHJcbiAgICAgICAgY29uc3QgX3ogPSBxLno7XHJcbiAgICAgICAgY29uc3QgX3cgPSBxLnc7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBfdyAqIHggKyBfeSAqIHogLSBfeiAqIHk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBfdyAqIHkgKyBfeiAqIHggLSBfeCAqIHo7XHJcbiAgICAgICAgY29uc3QgaXogPSBfdyAqIHogKyBfeCAqIHkgLSBfeSAqIHg7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtX3ggKiB4IC0gX3kgKiB5IC0gX3ogKiB6O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIF93ICsgaXcgKiAtX3ggKyBpeSAqIC1feiAtIGl6ICogLV95O1xyXG4gICAgICAgIG91dC55ID0gaXkgKiBfdyArIGl3ICogLV95ICsgaXogKiAtX3ggLSBpeCAqIC1fejtcclxuICAgICAgICBvdXQueiA9IGl6ICogX3cgKyBpdyAqIC1feiArIGl4ICogLV95IC0gaXkgKiAtX3g7XHJcbiAgICAgICAgb3V0LncgPSBhLnc7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/ovazmlbDnu4RcclxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgdjogSVZlYzRMaWtlLCBvZnMgPSAwKSB7XHJcbiAgICAgICAgb3V0W29mcyArIDBdID0gdi54O1xyXG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcclxuICAgICAgICBvdXRbb2ZzICsgMl0gPSB2Lno7XHJcbiAgICAgICAgb3V0W29mcyArIDNdID0gdi53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pWw57uE6L2s5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcclxuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcclxuICAgICAgICBvdXQueSA9IGFycltvZnMgKyAxXTtcclxuICAgICAgICBvdXQueiA9IGFycltvZnMgKyAyXTtcclxuICAgICAgICBvdXQudyA9IGFycltvZnMgKyAzXTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+etieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnkgJiYgYS56ID09PSBiLnogJiYgYS53ID09PSBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5ZCR6YeP6L+R5Ly8562J5Lu35Yik5patXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZXF1YWxzIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGEueCAtIGIueCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS54KSwgTWF0aC5hYnMoYi54KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS55IC0gYi55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnkpLCBNYXRoLmFicyhiLnkpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLnogLSBiLnopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueiksIE1hdGguYWJzKGIueikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEudyAtIGIudykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS53KSwgTWF0aC5hYnMoYi53KSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogeCDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogeSDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogeiDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgejogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogdyDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChvdGhlcjogVmVjNCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4PzogbnVtYmVyIHwgVmVjNCwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHgudztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy56ID0geiB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLncgPSB3IHx8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWFi+mahuW9k+WJjeWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjNCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WJjeWQkemHj+S9v+WFtuS4juaMh+WumuWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOWQkemHj+OAglxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgKG90aGVyOiBWZWM0KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3lkJHph4/nmoTlhbfkvZPliIbph4/lgLzjgIJcclxuICAgICAqIEBwYXJhbSB4IOimgeiuvue9rueahCB4IOWIhumHj+eahOWAvFxyXG4gICAgICogQHBhcmFtIHkg6KaB6K6+572u55qEIHkg5YiG6YeP55qE5YC8XHJcbiAgICAgKiBAcGFyYW0geiDopoHorr7nva7nmoQgeiDliIbph4/nmoTlgLxcclxuICAgICAqIEBwYXJhbSB3IOimgeiuvue9rueahCB3IOWIhumHj+eahOWAvFxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIgfCBWZWM0LCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ID0geC55O1xyXG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHgudztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy56ID0geiB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLncgPSB3IHx8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuWcqOivr+W3ruiMg+WbtOWGheS4juaMh+WumuWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIGVwc2lsb24g5YWB6K6455qE6K+v5beu77yM5bqU5Li66Z2e6LSf5pWw44CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPkuKTlkJHph4/nmoTlkITliIbph4/pg73lnKjmjIflrprnmoTor6/lt67ojIPlm7TlhoXliIbliKvnm7jnrYnml7bvvIzov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyAob3RoZXI6IFZlYzQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyh0aGlzLnggLSBvdGhlci54KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLngpLCBNYXRoLmFicyhvdGhlci54KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy55IC0gb3RoZXIueSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy55KSwgTWF0aC5hYnMob3RoZXIueSkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueiAtIG90aGVyLnopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueiksIE1hdGguYWJzKG90aGVyLnopKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLncgLSBvdGhlci53KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLncpLCBNYXRoLmFicyhvdGhlci53KSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuWcqOivr+W3ruiMg+WbtOWGheS4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIHgg55u45q+U6L6D55qE5ZCR6YeP55qEIHgg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geSDnm7jmr5TovoPnmoTlkJHph4/nmoQgeSDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB6IOebuOavlOi+g+eahOWQkemHj+eahCB6IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHcg55u45q+U6L6D55qE5ZCR6YeP55qEIHcg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0gZXBzaWxvbiDlhYHorrjnmoTor6/lt67vvIzlupTkuLrpnZ7otJ/mlbDjgIJcclxuICAgICAqIEByZXR1cm5zIOW9k+S4pOWQkemHj+eahOWQhOWIhumHj+mDveWcqOaMh+WumueahOivr+W3ruiMg+WbtOWGheWIhuWIq+ebuOetieaXtu+8jOi/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzNGYgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlciwgZXBzaWxvbiA9IEVQU0lMT04pIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKHRoaXMueCAtIHgpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKHgpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSB5KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyh5KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy56IC0geikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy56KSwgTWF0aC5hYnMoeikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudyAtIHcpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMudyksIE1hdGguYWJzKHcpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5LiO5oyH5a6a5ZCR6YeP55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5ZCR6YeP44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IFZlYzQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLnogJiYgdGhpcy53ID09PSBvdGhlci53O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuS4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOetieOAglxyXG4gICAgICogQHBhcmFtIHgg5oyH5a6a5ZCR6YeP55qEIHgg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geSDmjIflrprlkJHph4/nmoQgeSDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB6IOaMh+WumuWQkemHj+eahCB6IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHcg5oyH5a6a5ZCR6YeP55qEIHcg5YiG6YeP44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFsczRmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09PSB4ICYmIHRoaXMueSA9PT0geSAmJiB0aGlzLnogPT09IHogJiYgdGhpcy53ID09PSB3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruaMh+WumueahOaPkuWAvOavlOeOh++8jOS7juW9k+WJjeWQkemHj+WIsOebruagh+WQkemHj+S5i+mXtOWBmuaPkuWAvOOAglxyXG4gICAgICogQHBhcmFtIHRvIOebruagh+WQkemHj+OAglxyXG4gICAgICogQHBhcmFtIHJhdGlvIOaPkuWAvOavlOeOh++8jOiMg+WbtOS4uiBbMCwxXeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVycCAodG86IFZlYzQsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuejtcclxuICAgICAgICBjb25zdCB3ID0gdGhpcy53O1xyXG4gICAgICAgIHRoaXMueCA9IHggKyByYXRpbyAqICh0by54IC0geCk7XHJcbiAgICAgICAgdGhpcy55ID0geSArIHJhdGlvICogKHRvLnkgLSB5KTtcclxuICAgICAgICB0aGlzLnogPSB6ICsgcmF0aW8gKiAodG8ueiAtIHopO1xyXG4gICAgICAgIHRoaXMudyA9IHcgKyByYXRpbyAqICh0by53IC0gdyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6L+U5Zue5b2T5YmN5ZCR6YeP55qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3lkJHph4/nmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gYCgke3RoaXMueC50b0ZpeGVkKDIpfSwgJHt0aGlzLnkudG9GaXhlZCgyKX0sICR7dGhpcy56LnRvRml4ZWQoMil9LCAke3RoaXMudy50b0ZpeGVkKDIpfSlgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WJjeWQkemHj+eahOWAvO+8jOS9v+WFtuWQhOS4quWIhumHj+mDveWkhOS6juaMh+WumueahOiMg+WbtOWGheOAglxyXG4gICAgICogQHBhcmFtIG1pbkluY2x1c2l2ZSDmr4/kuKrliIbph4/pg73ku6Pooajkuoblr7nlupTliIbph4/lhYHorrjnmoTmnIDlsI/lgLzjgIJcclxuICAgICAqIEBwYXJhbSBtYXhJbmNsdXNpdmUg5q+P5Liq5YiG6YeP6YO95Luj6KGo5LqG5a+55bqU5YiG6YeP5YWB6K6455qE5pyA5aSn5YC844CCXHJcbiAgICAgKiBAcmV0dXJucyBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsYW1wZiAobWluSW5jbHVzaXZlOiBWZWM0LCBtYXhJbmNsdXNpdmU6IFZlYzQpIHtcclxuICAgICAgICB0aGlzLnggPSBjbGFtcCh0aGlzLngsIG1pbkluY2x1c2l2ZS54LCBtYXhJbmNsdXNpdmUueCk7XHJcbiAgICAgICAgdGhpcy55ID0gY2xhbXAodGhpcy55LCBtaW5JbmNsdXNpdmUueSwgbWF4SW5jbHVzaXZlLnkpO1xyXG4gICAgICAgIHRoaXMueiA9IGNsYW1wKHRoaXMueiwgbWluSW5jbHVzaXZlLnosIG1heEluY2x1c2l2ZS56KTtcclxuICAgICAgICB0aGlzLncgPSBjbGFtcCh0aGlzLncsIG1pbkluY2x1c2l2ZS53LCBtYXhJbmNsdXNpdmUudyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5Yqg5rOV44CC5bCG5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP55qE55u45YqgXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQgKG90aGVyOiBWZWM0KSB7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICsgb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKyBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiA9IHRoaXMueiArIG90aGVyLno7XHJcbiAgICAgICAgdGhpcy53ID0gdGhpcy53ICsgb3RoZXIudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/liqDms5XjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jliqBcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geiDmjIflrprnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB3IOaMh+WumueahOWQkemHj+eahCB3IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkNGYgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCArIHg7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICsgeTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKyB6O1xyXG4gICAgICAgIHRoaXMudyA9IHRoaXMudyArIHc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5YeP5rOV44CC5bCG5b2T5YmN5ZCR6YeP5YeP5Y675oyH5a6a5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5YeP5pWw5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCAob3RoZXI6IFZlYzQpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56IC0gb3RoZXIuejtcclxuICAgICAgICB0aGlzLncgPSB0aGlzLncgLSBvdGhlci53O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+WHj+azleOAguWwhuW9k+WJjeWQkemHj+WHj+WOu+aMh+WumuWIhumHj+eahOWQkemHj1xyXG4gICAgICogQHBhcmFtIHgg5oyH5a6a55qE5ZCR6YeP55qEIHgg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geSDmjIflrprnmoTlkJHph4/nmoQgeSDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB6IOaMh+WumueahOWQkemHj+eahCB6IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHcg5oyH5a6a55qE5ZCR6YeP55qEIHcg5YiG6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdWJ0cmFjdDRmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIHk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56IC0gejtcclxuICAgICAgICB0aGlzLncgPSB0aGlzLncgLSB3O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+aVsOS5mOOAguWwhuW9k+WJjeWQkemHj+aVsOS5mOaMh+Wumuagh+mHj1xyXG4gICAgICogQHBhcmFtIHNjYWxhciDmoIfph4/kuZjmlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG11bHRpcGx5U2NhbGFyIChzY2FsYXI6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygc2NhbGFyID09PSAnb2JqZWN0JykgeyBjb25zb2xlLndhcm4oJ3Nob3VsZCB1c2UgVmVjNC5tdWx0aXBseSBmb3IgdmVjdG9yICogdmVjdG9yIG9wZXJhdGlvbicpOyB9XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy53ID0gdGhpcy53ICogc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S5mOazleOAguWwhuW9k+WJjeWQkemHj+S5mOS7peaMh+WumuWQkemHj1xyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkgKG90aGVyOiBWZWM0KSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvdGhlciAhPT0gJ29iamVjdCcpIHsgY29uc29sZS53YXJuKCdzaG91bGQgdXNlIFZlYzQuc2NhbGUgZm9yIHZlY3RvciAqIHNjYWxhciBvcGVyYXRpb24nKTsgfVxyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKiBvdGhlci56O1xyXG4gICAgICAgIHRoaXMudyA9IHRoaXMudyAqIG90aGVyLnc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5LmY5rOV44CC5bCG5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u45LmY55qE57uT5p6c6LWL5YC857uZ5b2T5YmN5ZCR6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geCDmjIflrprnmoTlkJHph4/nmoQgeCDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB5IOaMh+WumueahOWQkemHj+eahCB5IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHog5oyH5a6a55qE5ZCR6YeP55qEIHog5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0gdyDmjIflrprnmoTlkJHph4/nmoQgdyDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG11bHRpcGx5NGYgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHg7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogeTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKiB6O1xyXG4gICAgICAgIHRoaXMudyA9IHRoaXMudyAqIHc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP6YCQ5YWD57Sg55u46Zmk44CC5bCG5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u46Zmk55qE57uT5p6c6LWL5YC857uZ5b2T5YmN5ZCR6YeP44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE5ZCR6YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkaXZpZGUgKG90aGVyOiBWZWM0KSB7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54IC8gb3RoZXIueDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgLyBvdGhlci55O1xyXG4gICAgICAgIHRoaXMueiA9IHRoaXMueiAvIG90aGVyLno7XHJcbiAgICAgICAgdGhpcy53ID0gdGhpcy53IC8gb3RoZXIudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/pgJDlhYPntKDnm7jpmaTjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jpmaTnmoTnu5PmnpzotYvlgLznu5nlvZPliY3lkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geiDmjIflrprnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB3IOaMh+WumueahOWQkemHj+eahCB3IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGl2aWRlNGYgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAvIHg7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55IC8geTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogLyB6O1xyXG4gICAgICAgIHRoaXMudyA9IHRoaXMudyAvIHc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5b2T5YmN5ZCR6YeP55qE5ZCE5Liq5YiG6YeP5Y+W5Y+NXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBuZWdhdGl2ZSAoKSB7XHJcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcclxuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xyXG4gICAgICAgIHRoaXMueiA9IC10aGlzLno7XHJcbiAgICAgICAgdGhpcy53ID0gLXRoaXMudztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/ngrnkuZjjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph4/jgIJcclxuICAgICAqIEByZXR1cm5zIOW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+eCueS5mOeahOe7k+aenOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZG90ICh2ZWN0b3I6IFZlYzQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdmVjdG9yLnggKyB0aGlzLnkgKiB2ZWN0b3IueSArIHRoaXMueiAqIHZlY3Rvci56ICsgdGhpcy53ICogdmVjdG9yLnc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5Y+J5LmY44CC6KeG5b2T5YmN5ZCR6YeP5ZKM5oyH5a6a5ZCR6YeP5Li65LiJ57u05ZCR6YeP77yI6IiN5byDIHcg5YiG6YeP77yJ77yM5bCG5b2T5YmN5ZCR6YeP5bem5Y+J5LmY5oyH5a6a5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcm9zcyAodmVjdG9yOiBWZWM0KSB7XHJcbiAgICAgICAgY29uc3QgeyB4OiBheCwgeTogYXksIHo6IGF6IH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHsgeDogYngsIHk6IGJ5LCB6OiBieiB9ID0gdmVjdG9yO1xyXG5cclxuICAgICAgICB0aGlzLnggPSBheSAqIGJ6IC0gYXogKiBieTtcclxuICAgICAgICB0aGlzLnkgPSBheiAqIGJ4IC0gYXggKiBiejtcclxuICAgICAgICB0aGlzLnogPSBheCAqIGJ5IC0gYXkgKiBieDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorqHnrpflkJHph4/nmoTplb/luqbvvIjmqKHvvInjgIJcclxuICAgICAqIEByZXR1cm5zIOWQkemHj+eahOmVv+W6pu+8iOaooe+8ieOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoICgpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuejtcclxuICAgICAgICBjb25zdCB3ID0gdGhpcy53O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+WQkemHj+mVv+W6pu+8iOaooe+8ieeahOW5s+aWueOAglxyXG4gICAgICogQHJldHVybnMg5ZCR6YeP6ZW/5bqm77yI5qih77yJ55qE5bmz5pa544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZW5ndGhTcXIgKCkge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy56O1xyXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLnc7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeWQkemHj+W9kuS4gOWMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplICgpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuejtcclxuICAgICAgICBjb25zdCB3ID0gdGhpcy53O1xyXG4gICAgICAgIGxldCBsZW4gPSB4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdztcclxuICAgICAgICBpZiAobGVuID4gMCkge1xyXG4gICAgICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggKiBsZW47XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgKiBsZW47XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHogKiBsZW47XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHcgKiBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW6lOeUqOWbm+e7tOefqemYteWPmOaNouWIsOW9k+WJjeefqemYtVxyXG4gICAgICogQHBhcmFtIG1hdHJpeCDlj5jmjaLnn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybU1hdDQgKG1hdHJpeDogTWF0NCkge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy56O1xyXG4gICAgICAgIGNvbnN0IHcgPSB0aGlzLnc7XHJcbiAgICAgICAgdGhpcy54ID0gbWF0cml4Lm0wMCAqIHggKyBtYXRyaXgubTA0ICogeSArIG1hdHJpeC5tMDggKiB6ICsgbWF0cml4Lm0xMiAqIHc7XHJcbiAgICAgICAgdGhpcy55ID0gbWF0cml4Lm0wMSAqIHggKyBtYXRyaXgubTA1ICogeSArIG1hdHJpeC5tMDkgKiB6ICsgbWF0cml4Lm0xMyAqIHc7XHJcbiAgICAgICAgdGhpcy56ID0gbWF0cml4Lm0wMiAqIHggKyBtYXRyaXgubTA2ICogeSArIG1hdHJpeC5tMTAgKiB6ICsgbWF0cml4Lm0xNCAqIHc7XHJcbiAgICAgICAgdGhpcy53ID0gbWF0cml4Lm0wMyAqIHggKyBtYXRyaXgubTA3ICogeSArIG1hdHJpeC5tMTEgKiB6ICsgbWF0cml4Lm0xNSAqIHc7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNDQ2xhc3MuZmFzdERlZmluZSgnY2MuVmVjNCcsIFZlYzQsIHsgeDogMCwgeTogMCwgejogMCwgdzogMCB9KTtcclxubGVnYWN5Q0MuVmVjNCA9IFZlYzQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdjQgKG90aGVyOiBWZWM0KTogVmVjNDtcclxuZXhwb3J0IGZ1bmN0aW9uIHY0ICh4PzogbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKTogVmVjNDtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2NCAoeD86IG51bWJlciB8IFZlYzQsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBuZXcgVmVjNCh4IGFzIGFueSwgeSwgeiwgdyk7XHJcbn1cclxuXHJcbmxlZ2FjeUNDLnY0ID0gdjQ7XHJcbiJdfQ==