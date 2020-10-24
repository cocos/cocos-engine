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
    global.vec3 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _utils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.v3 = v3;
  _exports.Vec3 = void 0;

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
   * 三维向量。
   */
  var Vec3 = /*#__PURE__*/function (_ValueType) {
    _inherits(Vec3, _ValueType);

    _createClass(Vec3, null, [{
      key: "zero",
      // we use -z for view-dir

      /**
       * @zh 将目标赋值为零向量
       */
      value: function zero(out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        return out;
      }
      /**
       * @zh 获得指定向量的拷贝
       */

    }, {
      key: "clone",
      value: function clone(a) {
        return new Vec3(a.x, a.y, a.z);
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
        return out;
      }
      /**
       * @zh 设置向量值
       */

    }, {
      key: "set",
      value: function set(out, x, y, z) {
        out.x = x;
        out.y = y;
        out.z = z;
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
        return out;
      }
      /**
       * @zh 逐元素向量乘法 (分量积)
       */

    }, {
      key: "multiply",
      value: function multiply(out, a, b) {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
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
        return Math.sqrt(x * x + y * y + z * z);
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
        return x * x + y * y + z * z;
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
        return Math.sqrt(x * x + y * y + z * z);
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
        return x * x + y * y + z * z;
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
        return out;
      }
      /**
       * @zh 逐元素向量取倒数，接近 0 时返回 Infinity
       */

    }, {
      key: "invert",
      value: function invert(out, a) {
        out.x = 1.0 / a.x;
        out.y = 1.0 / a.y;
        out.z = 1.0 / a.z;
        return out;
      }
      /**
       * @zh 逐元素向量取倒数，接近 0 时返回 0
       */

    }, {
      key: "invertSafe",
      value: function invertSafe(out, a) {
        var x = a.x;
        var y = a.y;
        var z = a.z;

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
        var len = x * x + y * y + z * z;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          out.x = x * len;
          out.y = y * len;
          out.z = z * len;
        }

        return out;
      }
      /**
       * @zh 向量点积（数量积）
       */

    }, {
      key: "dot",
      value: function dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
      }
      /**
       * @zh 向量叉积（向量积）
       */

    }, {
      key: "cross",
      value: function cross(out, a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        out.x = ay * bz - az * by;
        out.y = az * bx - ax * bz;
        out.z = ax * by - ay * bx;
        return out;
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
        return out;
      }
      /**
       * @zh 向量与四维矩阵乘法，默认向量第四位为 1。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(out, a, m) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        var rhw = m.m03 * x + m.m07 * y + m.m11 * z + m.m15;
        rhw = rhw ? Math.abs(1 / rhw) : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z + m.m12) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z + m.m13) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z + m.m14) * rhw;
        return out;
      }
      /**
       * @zh 向量与四维矩阵乘法，默认向量第四位为 0。
       */

    }, {
      key: "transformMat4Normal",
      value: function transformMat4Normal(out, a, m) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        var rhw = m.m03 * x + m.m07 * y + m.m11 * z;
        rhw = rhw ? Math.abs(1 / rhw) : 1;
        out.x = (m.m00 * x + m.m04 * y + m.m08 * z) * rhw;
        out.y = (m.m01 * x + m.m05 * y + m.m09 * z) * rhw;
        out.z = (m.m02 * x + m.m06 * y + m.m10 * z) * rhw;
        return out;
      }
      /**
       * @zh 向量与三维矩阵乘法
       */

    }, {
      key: "transformMat3",
      value: function transformMat3(out, a, m) {
        var x = a.x;
        var y = a.y;
        var z = a.z;
        out.x = x * m.m00 + y * m.m03 + z * m.m06;
        out.y = x * m.m01 + y * m.m04 + z * m.m07;
        out.z = x * m.m02 + y * m.m05 + z * m.m08;
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
        out.x = m.m00 * x + m.m04 * y + m.m08 * z + m.m12;
        out.y = m.m01 * x + m.m05 * y + m.m09 * z + m.m13;
        out.x = m.m02 * x + m.m06 * y + m.m10 * z + m.m14;
        return out;
      }
      /**
       * @zh 向量四元数乘法
       */

    }, {
      key: "transformQuat",
      value: function transformQuat(out, a, q) {
        // benchmarks: http://jsperf.com/quaternion-transform-Vec3-implementations
        // calculate quat * vec
        var ix = q.w * a.x + q.y * a.z - q.z * a.y;
        var iy = q.w * a.y + q.z * a.x - q.x * a.z;
        var iz = q.w * a.z + q.x * a.y - q.y * a.x;
        var iw = -q.x * a.x - q.y * a.y - q.z * a.z; // calculate result * inverse quat

        out.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        out.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        out.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
        return out;
      }
      /**
       * @zh 以缩放 -> 旋转 -> 平移顺序变换向量
       */

    }, {
      key: "transformRTS",
      value: function transformRTS(out, a, r, t, s) {
        var x = a.x * s.x;
        var y = a.y * s.y;
        var z = a.z * s.z;
        var ix = r.w * x + r.y * z - r.z * y;
        var iy = r.w * y + r.z * x - r.x * z;
        var iz = r.w * z + r.x * y - r.y * x;
        var iw = -r.x * x - r.y * y - r.z * z;
        out.x = ix * r.w + iw * -r.x + iy * -r.z - iz * -r.y + t.x;
        out.y = iy * r.w + iw * -r.y + iz * -r.x - ix * -r.z + t.y;
        out.z = iz * r.w + iw * -r.z + ix * -r.y - iy * -r.x + t.z;
        return out;
      }
      /**
       * @zh 以平移 -> 旋转 -> 缩放顺序逆变换向量
       */

    }, {
      key: "transformInverseRTS",
      value: function transformInverseRTS(out, a, r, t, s) {
        var x = a.x - t.x;
        var y = a.y - t.y;
        var z = a.z - t.z;
        var ix = r.w * x - r.y * z + r.z * y;
        var iy = r.w * y - r.z * x + r.x * z;
        var iz = r.w * z - r.x * y + r.y * x;
        var iw = r.x * x + r.y * y + r.z * z;
        out.x = (ix * r.w + iw * r.x + iy * r.z - iz * r.y) / s.x;
        out.y = (iy * r.w + iw * r.y + iz * r.x - ix * r.z) / s.y;
        out.z = (iz * r.w + iw * r.z + ix * r.y - iy * r.x) / s.z;
        return out;
      }
      /**
       * @zh 绕 X 轴旋转向量指定弧度
       * @param v 待旋转向量
       * @param o 旋转中心
       * @param a 旋转弧度
       */

    }, {
      key: "rotateX",
      value: function rotateX(out, v, o, a) {
        // Translate point to the origin
        var x = v.x - o.x;
        var y = v.y - o.y;
        var z = v.z - o.z; // perform rotation

        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var rx = x;
        var ry = y * cos - z * sin;
        var rz = y * sin + z * cos; // translate to correct position

        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;
        return out;
      }
      /**
       * @zh 绕 Y 轴旋转向量指定弧度
       * @param v 待旋转向量
       * @param o 旋转中心
       * @param a 旋转弧度
       */

    }, {
      key: "rotateY",
      value: function rotateY(out, v, o, a) {
        // Translate point to the origin
        var x = v.x - o.x;
        var y = v.y - o.y;
        var z = v.z - o.z; // perform rotation

        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var rx = z * sin + x * cos;
        var ry = y;
        var rz = z * cos - x * sin; // translate to correct position

        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;
        return out;
      }
      /**
       * @zh 绕 Z 轴旋转向量指定弧度
       * @param v 待旋转向量
       * @param o 旋转中心
       * @param a 旋转弧度
       */

    }, {
      key: "rotateZ",
      value: function rotateZ(out, v, o, a) {
        // Translate point to the origin
        var x = v.x - o.x;
        var y = v.y - o.y;
        var z = v.z - o.z; // perform rotation

        var cos = Math.cos(a);
        var sin = Math.sin(a);
        var rx = x * cos - y * sin;
        var ry = x * sin + y * cos;
        var rz = z; // translate to correct position

        out.x = rx + o.x;
        out.y = ry + o.y;
        out.z = rz + o.z;
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
        return out;
      }
      /**
       * @zh 向量等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z;
      }
      /**
       * @zh 排除浮点数误差的向量近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        var a0 = a.x,
            a1 = a.y,
            a2 = a.z;
        var b0 = b.x,
            b1 = b.y,
            b2 = b.z;
        return Math.abs(a0 - b0) <= epsilon * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= epsilon * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= epsilon * Math.max(1.0, Math.abs(a2), Math.abs(b2));
      }
      /**
       * @zh 求两向量夹角弧度
       */

    }, {
      key: "angle",
      value: function angle(a, b) {
        Vec3.normalize(v3_1, a);
        Vec3.normalize(v3_2, b);
        var cosine = Vec3.dot(v3_1, v3_2);

        if (cosine > 1.0) {
          return 0;
        }

        if (cosine < -1.0) {
          return Math.PI;
        }

        return Math.acos(cosine);
      }
      /**
       * @zh 计算向量在指定平面上的投影
       * @param a 待投影向量
       * @param n 指定平面的法线
       */

    }, {
      key: "projectOnPlane",
      value: function projectOnPlane(out, a, n) {
        return Vec3.subtract(out, a, Vec3.project(out, a, n));
      }
      /**
       * @zh 计算向量在指定向量上的投影
       * @param a 待投影向量
       * @param n 目标向量
       */

    }, {
      key: "project",
      value: function project(out, a, b) {
        var sqrLen = Vec3.lengthSqr(b);

        if (sqrLen < 0.000001) {
          return Vec3.set(out, 0, 0, 0);
        } else {
          return Vec3.multiplyScalar(out, b, Vec3.dot(a, b) / sqrLen);
        }
      }
      /**
       * x 分量。
       */

    }]);

    function Vec3(x, y, z) {
      var _this;

      _classCallCheck(this, Vec3);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Vec3).call(this));

      if (x && _typeof(x) === 'object') {
        _this.x = x.x;
        _this.y = x.y;
        _this.z = x.z;
      } else {
        _this.x = x || 0;
        _this.y = y || 0;
        _this.z = z || 0;
      }

      return _this;
    }
    /**
     * @zh 克隆当前向量。
     */


    _createClass(Vec3, [{
      key: "clone",
      value: function clone() {
        return new Vec3(this.x, this.y, this.z);
      }
      /**
       * @zh 设置当前向量使其与指定向量相等。
       * @param other 相比较的向量。
       * @returns `this`
       */

    }, {
      key: "set",
      value: function set(x, y, z) {
        if (x && _typeof(x) === 'object') {
          this.x = x.x;
          this.y = x.y;
          this.z = x.z;
        } else {
          this.x = x || 0;
          this.y = y || 0;
          this.z = z || 0;
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
        return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) && Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z));
      }
      /**
       * @zh 判断当前向量是否在误差范围内与指定分量的向量相等。
       * @param x 相比较的向量的 x 分量。
       * @param y 相比较的向量的 y 分量。
       * @param z 相比较的向量的 z 分量。
       * @param epsilon 允许的误差，应为非负数。
       * @returns 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals3f",
      value: function equals3f(x, y, z) {
        var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _utils.EPSILON;
        return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) && Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z));
      }
      /**
       * @zh 判断当前向量是否与指定向量相等。
       * @param other 相比较的向量。
       * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
      }
      /**
       * @zh 判断当前向量是否与指定分量的向量相等。
       * @param x 指定向量的 x 分量。
       * @param y 指定向量的 y 分量。
       * @param z 指定向量的 z 分量。
       * @returns 两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals3f",
      value: function strictEquals3f(x, y, z) {
        return this.x === x && this.y === y && this.z === z;
      }
      /**
       * @zh 返回当前向量的字符串表示。
       * @returns 当前向量的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return "(".concat(this.x.toFixed(2), ", ").concat(this.y.toFixed(2), ", ").concat(this.z.toFixed(2), ")");
      }
      /**
       * @zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
       * @param to 目标向量。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        this.x = this.x + ratio * (to.x - this.x);
        this.y = this.y + ratio * (to.y - this.y);
        this.z = this.z + ratio * (to.z - this.z);
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
        return this;
      }
      /**
       * @zh 向量加法。将当前向量与指定分量的向量相加
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       */

    }, {
      key: "add3f",
      value: function add3f(x, y, z) {
        this.x = this.x + x;
        this.y = this.y + y;
        this.z = this.z + z;
        return this;
      }
      /**
       * @zh 向量减法。将当前向量减去指定向量的结果。
       * @param other 减数向量。
       */

    }, {
      key: "subtract",
      value: function subtract(other) {
        this.x = this.x - other.x;
        this.y = this.y - other.y;
        this.z = this.z - other.z;
        return this;
      }
      /**
       * @zh 向量减法。将当前向量减去指定分量的向量
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       */

    }, {
      key: "subtract3f",
      value: function subtract3f(x, y, z) {
        this.x = this.x - x;
        this.y = this.y - y;
        this.z = this.z - z;
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
          console.warn('should use Vec3.multiply for vector * vector operation');
        }

        this.x = this.x * scalar;
        this.y = this.y * scalar;
        this.z = this.z * scalar;
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
          console.warn('should use Vec3.scale for vector * scalar operation');
        }

        this.x = this.x * other.x;
        this.y = this.y * other.y;
        this.z = this.z * other.z;
        return this;
      }
      /**
       * @zh 向量乘法。将当前向量与指定分量的向量相乘的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       */

    }, {
      key: "multiply3f",
      value: function multiply3f(x, y, z) {
        this.x = this.x * x;
        this.y = this.y * y;
        this.z = this.z * z;
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
        return this;
      }
      /**
       * @zh 向量逐元素相除。将当前向量与指定分量的向量相除的结果赋值给当前向量。
       * @param x 指定的向量的 x 分量。
       * @param y 指定的向量的 y 分量。
       * @param z 指定的向量的 z 分量。
       */

    }, {
      key: "divide3f",
      value: function divide3f(x, y, z) {
        this.x = this.x / x;
        this.y = this.y / y;
        this.z = this.z / z;
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
        return this;
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
        return this;
      }
      /**
       * @zh 向量点乘。
       * @param other 指定的向量。
       * @returns 当前向量与指定向量点乘的结果。
       */

    }, {
      key: "dot",
      value: function dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
      }
      /**
       * @zh 向量叉乘。将当前向量左叉乘指定向量
       * @param other 指定的向量。
       */

    }, {
      key: "cross",
      value: function cross(other) {
        var ax = this.x,
            ay = this.y,
            az = this.z;
        var bx = other.x,
            by = other.y,
            bz = other.z;
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
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }
      /**
       * @zh 计算向量长度（模）的平方。
       * @returns 向量长度（模）的平方。
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
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
        var len = x * x + y * y + z * z;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          this.x = x * len;
          this.y = y * len;
          this.z = z * len;
        }

        return this;
      }
      /**
       * @zh 将当前向量视为 w 分量为 1 的四维向量，应用四维矩阵变换到当前矩阵
       * @param matrix 变换矩阵。
       */

    }, {
      key: "transformMat4",
      value: function transformMat4(matrix) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var rhw = matrix.m03 * x + matrix.m07 * y + matrix.m11 * z + matrix.m15;
        rhw = rhw ? 1 / rhw : 1;
        this.x = (matrix.m00 * x + matrix.m04 * y + matrix.m08 * z + matrix.m12) * rhw;
        this.y = (matrix.m01 * x + matrix.m05 * y + matrix.m09 * z + matrix.m13) * rhw;
        this.z = (matrix.m02 * x + matrix.m06 * y + matrix.m10 * z + matrix.m14) * rhw;
        return this;
      }
    }]);

    return Vec3;
  }(_valueType.ValueType);

  _exports.Vec3 = Vec3;
  Vec3.UNIT_X = Object.freeze(new Vec3(1, 0, 0));
  Vec3.UNIT_Y = Object.freeze(new Vec3(0, 1, 0));
  Vec3.UNIT_Z = Object.freeze(new Vec3(0, 0, 1));
  Vec3.RIGHT = Object.freeze(new Vec3(1, 0, 0));
  Vec3.UP = Object.freeze(new Vec3(0, 1, 0));
  Vec3.FORWARD = Object.freeze(new Vec3(0, 0, -1));
  Vec3.ZERO = Object.freeze(new Vec3(0, 0, 0));
  Vec3.ONE = Object.freeze(new Vec3(1, 1, 1));
  Vec3.NEG_ONE = Object.freeze(new Vec3(-1, -1, -1));
  var v3_1 = new Vec3();
  var v3_2 = new Vec3();

  _class.CCClass.fastDefine('cc.Vec3', Vec3, {
    x: 0,
    y: 0,
    z: 0
  });

  _globalExports.legacyCC.Vec3 = Vec3;

  function v3(x, y, z) {
    return new Vec3(x, y, z);
  }

  _globalExports.legacyCC.v3 = v3;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC92ZWMzLnRzIl0sIm5hbWVzIjpbIlZlYzMiLCJvdXQiLCJ4IiwieSIsInoiLCJhIiwiYiIsIk1hdGgiLCJjZWlsIiwiZmxvb3IiLCJtaW4iLCJtYXgiLCJyb3VuZCIsInNjYWxlIiwic3FydCIsImFicyIsIkVQU0lMT04iLCJsZW4iLCJheCIsImF5IiwiYXoiLCJieCIsImJ5IiwiYnoiLCJ0IiwicGhpIiwiUEkiLCJjb3NUaGV0YSIsInNpblRoZXRhIiwiY29zIiwic2luIiwibSIsInJodyIsIm0wMyIsIm0wNyIsIm0xMSIsIm0xNSIsIm0wMCIsIm0wNCIsIm0wOCIsIm0xMiIsIm0wMSIsIm0wNSIsIm0wOSIsIm0xMyIsIm0wMiIsIm0wNiIsIm0xMCIsIm0xNCIsInYiLCJxIiwiaXgiLCJ3IiwiaXkiLCJpeiIsIml3IiwiciIsInMiLCJvIiwicngiLCJyeSIsInJ6Iiwib2ZzIiwiYXJyIiwiZXBzaWxvbiIsImEwIiwiYTEiLCJhMiIsImIwIiwiYjEiLCJiMiIsIm5vcm1hbGl6ZSIsInYzXzEiLCJ2M18yIiwiY29zaW5lIiwiZG90IiwiYWNvcyIsIm4iLCJzdWJ0cmFjdCIsInByb2plY3QiLCJzcXJMZW4iLCJsZW5ndGhTcXIiLCJzZXQiLCJtdWx0aXBseVNjYWxhciIsIm90aGVyIiwidG9GaXhlZCIsInRvIiwicmF0aW8iLCJzY2FsYXIiLCJjb25zb2xlIiwid2FybiIsIm1pbkluY2x1c2l2ZSIsIm1heEluY2x1c2l2ZSIsIm1hdHJpeCIsIlZhbHVlVHlwZSIsIlVOSVRfWCIsIk9iamVjdCIsImZyZWV6ZSIsIlVOSVRfWSIsIlVOSVRfWiIsIlJJR0hUIiwiVVAiLCJGT1JXQVJEIiwiWkVSTyIsIk9ORSIsIk5FR19PTkUiLCJDQ0NsYXNzIiwiZmFzdERlZmluZSIsImxlZ2FjeUNDIiwidjMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QU1SLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUlqRyxJQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBQWQsQztBQVRYQSxFQUFBQSxJLENBVUt5RyxPLEdBQVVULE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUlqRyxJQUFKLENBQVMsQ0FBQyxDQUFWLEVBQWEsQ0FBQyxDQUFkLEVBQWlCLENBQUMsQ0FBbEIsQ0FBZCxDO0FBKzVCNUIsTUFBTXdFLElBQUksR0FBRyxJQUFJeEUsSUFBSixFQUFiO0FBQ0EsTUFBTXlFLElBQUksR0FBRyxJQUFJekUsSUFBSixFQUFiOztBQUVBMEcsaUJBQVFDLFVBQVIsQ0FBbUIsU0FBbkIsRUFBOEIzRyxJQUE5QixFQUFvQztBQUFFRSxJQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxJQUFBQSxDQUFDLEVBQUUsQ0FBWDtBQUFjQyxJQUFBQSxDQUFDLEVBQUU7QUFBakIsR0FBcEM7O0FBQ0F3RywwQkFBUzVHLElBQVQsR0FBZ0JBLElBQWhCOztBQUtPLFdBQVM2RyxFQUFULENBQWEzRyxDQUFiLEVBQWdDQyxDQUFoQyxFQUE0Q0MsQ0FBNUMsRUFBd0Q7QUFDM0QsV0FBTyxJQUFJSixJQUFKLENBQVNFLENBQVQsRUFBbUJDLENBQW5CLEVBQXNCQyxDQUF0QixDQUFQO0FBQ0g7O0FBRUR3RywwQkFBU0MsRUFBVCxHQUFjQSxFQUFkIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL21hdGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBDQ0NsYXNzIH0gZnJvbSAnLi4vZGF0YS9jbGFzcyc7XHJcbmltcG9ydCB7IFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZhbHVlLXR5cGUnO1xyXG5pbXBvcnQgeyBNYXQ0IH0gZnJvbSAnLi9tYXQ0JztcclxuaW1wb3J0IHsgSU1hdDNMaWtlLCBJTWF0NExpa2UsIElRdWF0TGlrZSwgSVZlYzNMaWtlIH0gZnJvbSAnLi90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IGNsYW1wLCBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICog5LiJ57u05ZCR6YeP44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVmVjMyBleHRlbmRzIFZhbHVlVHlwZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBVTklUX1ggPSBPYmplY3QuZnJlZXplKG5ldyBWZWMzKDEsIDAsIDApKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgVU5JVF9ZID0gT2JqZWN0LmZyZWV6ZShuZXcgVmVjMygwLCAxLCAwKSk7XHJcbiAgICBwdWJsaWMgc3RhdGljIFVOSVRfWiA9IE9iamVjdC5mcmVlemUobmV3IFZlYzMoMCwgMCwgMSkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBSSUdIVCA9IE9iamVjdC5mcmVlemUobmV3IFZlYzMoMSwgMCwgMCkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBVUCA9IE9iamVjdC5mcmVlemUobmV3IFZlYzMoMCwgMSwgMCkpO1xyXG4gICAgcHVibGljIHN0YXRpYyBGT1JXQVJEID0gT2JqZWN0LmZyZWV6ZShuZXcgVmVjMygwLCAwLCAtMSkpOyAvLyB3ZSB1c2UgLXogZm9yIHZpZXctZGlyXHJcbiAgICBwdWJsaWMgc3RhdGljIFpFUk8gPSBPYmplY3QuZnJlZXplKG5ldyBWZWMzKDAsIDAsIDApKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgT05FID0gT2JqZWN0LmZyZWV6ZShuZXcgVmVjMygxLCAxLCAxKSk7XHJcbiAgICBwdWJsaWMgc3RhdGljIE5FR19PTkUgPSBPYmplY3QuZnJlZXplKG5ldyBWZWMzKC0xLCAtMSwgLTEpKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIbnm67moIfotYvlgLzkuLrpm7blkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB6ZXJvPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSAwO1xyXG4gICAgICAgIG91dC55ID0gMDtcclxuICAgICAgICBvdXQueiA9IDA7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflvpfmjIflrprlkJHph4/nmoTmi7fotJ1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKGEueCwgYS55LCBhLnopO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWkjeWItuebruagh+WQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSVZlYzNMaWtlLCBWZWMzTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSkge1xyXG4gICAgICAgIG91dC54ID0gYS54O1xyXG4gICAgICAgIG91dC55ID0gYS55O1xyXG4gICAgICAgIG91dC56ID0gYS56O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5ZCR6YeP5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnggPSB4O1xyXG4gICAgICAgIG91dC55ID0geTtcclxuICAgICAgICBvdXQueiA9IHo7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/liqDms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBhZGQ8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSwgYjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKyBiLng7XHJcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XHJcbiAgICAgICAgb3V0LnogPSBhLnogKyBiLno7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lh4/ms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzdWJ0cmFjdDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlLCBiOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBvdXQueCA9IGEueCAtIGIueDtcclxuICAgICAgICBvdXQueSA9IGEueSAtIGIueTtcclxuICAgICAgICBvdXQueiA9IGEueiAtIGIuejtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+S5mOazlSAo5YiG6YeP56evKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIG91dC54ID0gYS54ICogYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55ICogYi55O1xyXG4gICAgICAgIG91dC56ID0gYS56ICogYi56O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP6Zmk5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGl2aWRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIG91dC54ID0gYS54IC8gYi54O1xyXG4gICAgICAgIG91dC55ID0gYS55IC8gYi55O1xyXG4gICAgICAgIG91dC56ID0gYS56IC8gYi56O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5ZCR5LiK5Y+W5pW0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2VpbDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLmNlaWwoYS54KTtcclxuICAgICAgICBvdXQueSA9IE1hdGguY2VpbChhLnkpO1xyXG4gICAgICAgIG91dC56ID0gTWF0aC5jZWlsKGEueik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lkJHkuIvlj5bmlbRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmbG9vcjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLmZsb29yKGEueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLmZsb29yKGEueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLmZsb29yKGEueik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/mnIDlsI/lgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtaW48T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSwgYjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihhLngsIGIueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1pbihhLnksIGIueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLm1pbihhLnosIGIueik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtYXg8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSwgYjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLm1heChhLnksIGIueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLm1heChhLnosIGIueik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lm5voiI3kupTlhaXlj5bmlbRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3VuZDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLnJvdW5kKGEueCk7XHJcbiAgICAgICAgb3V0LnkgPSBNYXRoLnJvdW5kKGEueSk7XHJcbiAgICAgICAgb3V0LnogPSBNYXRoLnJvdW5kKGEueik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/moIfph4/kuZjms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtdWx0aXBseVNjYWxhcjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2UsIFZlYzNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlID4gKG91dDogT3V0LCBhOiBWZWMzTGlrZSwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0LnggPSBhLnggKiBiO1xyXG4gICAgICAgIG91dC55ID0gYS55ICogYjtcclxuICAgICAgICBvdXQueiA9IGEueiAqIGI7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/kuZjliqA6IEEgKyBCICogc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlLCBiOiBJVmVjM0xpa2UsIHNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQueCA9IGEueCArIGIueCAqIHNjYWxlO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgYi55ICogc2NhbGU7XHJcbiAgICAgICAgb3V0LnogPSBhLnogKyBiLnogKiBzY2FsZTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlIChhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBiLnggLSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGIueSAtIGEueTtcclxuICAgICAgICBjb25zdCB6ID0gYi56IC0gYS56O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLkuKTlkJHph4/nmoTmrKfmsI/ot53nprvlubPmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzcXVhcmVkRGlzdGFuY2UgKGE6IElWZWMzTGlrZSwgYjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBiLnogLSBhLno7XHJcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgKyB6ICogejtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLlkJHph4/plb/luqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW4gKGE6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICBjb25zdCB6ID0gYS56O1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLlkJHph4/plb/luqblubPmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW5ndGhTcXIgKGE6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICBjb25zdCB6ID0gYS56O1xyXG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHo7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W6LSfXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbmVnYXRlPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBvdXQueCA9IC1hLng7XHJcbiAgICAgICAgb3V0LnkgPSAtYS55O1xyXG4gICAgICAgIG91dC56ID0gLWEuejtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOWQkemHj+WPluWAkuaVsO+8jOaOpei/kSAwIOaXtui/lOWbniBJbmZpbml0eVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGludmVydDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgb3V0LnggPSAxLjAgLyBhLng7XHJcbiAgICAgICAgb3V0LnkgPSAxLjAgLyBhLnk7XHJcbiAgICAgICAgb3V0LnogPSAxLjAgLyBhLno7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGludmVydFNhZmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBhLng7XHJcbiAgICAgICAgY29uc3QgeSA9IGEueTtcclxuICAgICAgICBjb25zdCB6ID0gYS56O1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMoeCkgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIG91dC54ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQueCA9IDEuMCAvIHg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMoeSkgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIG91dC55ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQueSA9IDEuMCAvIHk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMoeikgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIG91dC56ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQueiA9IDEuMCAvIHo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9kuS4gOWMluWQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG5vcm1hbGl6ZTxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcblxyXG4gICAgICAgIGxldCBsZW4gPSB4ICogeCArIHkgKiB5ICsgeiAqIHo7XHJcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcclxuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xyXG4gICAgICAgICAgICBvdXQueCA9IHggKiBsZW47XHJcbiAgICAgICAgICAgIG91dC55ID0geSAqIGxlbjtcclxuICAgICAgICAgICAgb3V0LnogPSB6ICogbGVuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+eCueenr++8iOaVsOmHj+enr++8iVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAoYTogT3V0LCBiOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+WPieenr++8iOWQkemHj+enr++8iVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyb3NzPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHsgeDogYXgsIHk6IGF5LCB6OiBheiB9ID0gYTtcclxuICAgICAgICBjb25zdCB7IHg6IGJ4LCB5OiBieSwgejogYnogfSA9IGI7XHJcbiAgICAgICAgb3V0LnggPSBheSAqIGJ6IC0gYXogKiBieTtcclxuICAgICAgICBvdXQueSA9IGF6ICogYnggLSBheCAqIGJ6O1xyXG4gICAgICAgIG91dC56ID0gYXggKiBieSAtIGF5ICogYng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDlkJHph4/nur/mgKfmj5LlgLzvvJogQSArIHQgKiAoQiAtIEEpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlLCBiOiBJVmVjM0xpa2UsIHQ6IG51bWJlcikge1xyXG4gICAgICAgIG91dC54ID0gYS54ICsgdCAqIChiLnggLSBhLngpO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xyXG4gICAgICAgIG91dC56ID0gYS56ICsgdCAqIChiLnogLSBhLnopO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg55Sf5oiQ5LiA5Liq5Zyo5Y2V5L2N55CD5L2T5LiK5Z2H5YyA5YiG5biD55qE6ZqP5py65ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gc2NhbGUg55Sf5oiQ55qE5ZCR6YeP6ZW/5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmFuZG9tPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcikge1xyXG4gICAgICAgIHNjYWxlID0gc2NhbGUgfHwgMS4wO1xyXG5cclxuICAgICAgICBjb25zdCBwaGkgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XHJcbiAgICAgICAgY29uc3QgY29zVGhldGEgPSByYW5kb20oKSAqIDIgLSAxO1xyXG4gICAgICAgIGNvbnN0IHNpblRoZXRhID0gTWF0aC5zcXJ0KDEgLSBjb3NUaGV0YSAqIGNvc1RoZXRhKTtcclxuXHJcbiAgICAgICAgb3V0LnggPSBzaW5UaGV0YSAqIE1hdGguY29zKHBoaSkgKiBzY2FsZTtcclxuICAgICAgICBvdXQueSA9IHNpblRoZXRhICogTWF0aC5zaW4ocGhpKSAqIHNjYWxlO1xyXG4gICAgICAgIG91dC56ID0gY29zVGhldGEgKiBzY2FsZTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S4juWbm+e7tOefqemYteS5mOazle+8jOm7mOiupOWQkemHj+esrOWbm+S9jeS4uiAx44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtTWF0NCA8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSwgbTogSU1hdDRMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcbiAgICAgICAgbGV0IHJodyA9IG0ubTAzICogeCArIG0ubTA3ICogeSArIG0ubTExICogeiArIG0ubTE1O1xyXG4gICAgICAgIHJodyA9IHJodyA/IE1hdGguYWJzKDEgLyByaHcpIDogMTtcclxuICAgICAgICBvdXQueCA9IChtLm0wMCAqIHggKyBtLm0wNCAqIHkgKyBtLm0wOCAqIHogKyBtLm0xMikgKiByaHc7XHJcbiAgICAgICAgb3V0LnkgPSAobS5tMDEgKiB4ICsgbS5tMDUgKiB5ICsgbS5tMDkgKiB6ICsgbS5tMTMpICogcmh3O1xyXG4gICAgICAgIG91dC56ID0gKG0ubTAyICogeCArIG0ubTA2ICogeSArIG0ubTEwICogeiArIG0ubTE0KSAqIHJodztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S4juWbm+e7tOefqemYteS5mOazle+8jOm7mOiupOWQkemHj+esrOWbm+S9jeS4uiAw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtTWF0NE5vcm1hbDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlLCBtOiBJTWF0NExpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IGEuejtcclxuICAgICAgICBsZXQgcmh3ID0gbS5tMDMgKiB4ICsgbS5tMDcgKiB5ICsgbS5tMTEgKiB6O1xyXG4gICAgICAgIHJodyA9IHJodyA/IE1hdGguYWJzKDEgLyByaHcpIDogMTtcclxuICAgICAgICBvdXQueCA9IChtLm0wMCAqIHggKyBtLm0wNCAqIHkgKyBtLm0wOCAqIHopICogcmh3O1xyXG4gICAgICAgIG91dC55ID0gKG0ubTAxICogeCArIG0ubTA1ICogeSArIG0ubTA5ICogeikgKiByaHc7XHJcbiAgICAgICAgb3V0LnogPSAobS5tMDIgKiB4ICsgbS5tMDYgKiB5ICsgbS5tMTAgKiB6KSAqIHJodztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S4juS4iee7tOefqemYteS5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybU1hdDM8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IElWZWMzTGlrZSwgbTogSU1hdDNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLno7XHJcbiAgICAgICAgb3V0LnggPSB4ICogbS5tMDAgKyB5ICogbS5tMDMgKyB6ICogbS5tMDY7XHJcbiAgICAgICAgb3V0LnkgPSB4ICogbS5tMDEgKyB5ICogbS5tMDQgKyB6ICogbS5tMDc7XHJcbiAgICAgICAgb3V0LnogPSB4ICogbS5tMDIgKyB5ICogbS5tMDUgKyB6ICogbS5tMDg7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/ku7/lsITlj5jmjaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1BZmZpbmU8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IElWZWMzTGlrZSwgbTogSU1hdDRMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHYueDtcclxuICAgICAgICBjb25zdCB5ID0gdi55O1xyXG4gICAgICAgIGNvbnN0IHogPSB2Lno7XHJcbiAgICAgICAgb3V0LnggPSBtLm0wMCAqIHggKyBtLm0wNCAqIHkgKyBtLm0wOCAqIHogKyBtLm0xMjtcclxuICAgICAgICBvdXQueSA9IG0ubTAxICogeCArIG0ubTA1ICogeSArIG0ubTA5ICogeiArIG0ubTEzO1xyXG4gICAgICAgIG91dC54ID0gbS5tMDIgKiB4ICsgbS5tMDYgKiB5ICsgbS5tMTAgKiB6ICsgbS5tMTQ7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/lm5vlhYPmlbDkuZjms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1RdWF0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIHE6IElRdWF0TGlrZSkge1xyXG4gICAgICAgIC8vIGJlbmNobWFya3M6IGh0dHA6Ly9qc3BlcmYuY29tL3F1YXRlcm5pb24tdHJhbnNmb3JtLVZlYzMtaW1wbGVtZW50YXRpb25zXHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBxdWF0ICogdmVjXHJcbiAgICAgICAgY29uc3QgaXggPSBxLncgKiBhLnggKyBxLnkgKiBhLnogLSBxLnogKiBhLnk7XHJcbiAgICAgICAgY29uc3QgaXkgPSBxLncgKiBhLnkgKyBxLnogKiBhLnggLSBxLnggKiBhLno7XHJcbiAgICAgICAgY29uc3QgaXogPSBxLncgKiBhLnogKyBxLnggKiBhLnkgLSBxLnkgKiBhLng7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtcS54ICogYS54IC0gcS55ICogYS55IC0gcS56ICogYS56O1xyXG5cclxuICAgICAgICAvLyBjYWxjdWxhdGUgcmVzdWx0ICogaW52ZXJzZSBxdWF0XHJcbiAgICAgICAgb3V0LnggPSBpeCAqIHEudyArIGl3ICogLXEueCArIGl5ICogLXEueiAtIGl6ICogLXEueTtcclxuICAgICAgICBvdXQueSA9IGl5ICogcS53ICsgaXcgKiAtcS55ICsgaXogKiAtcS54IC0gaXggKiAtcS56O1xyXG4gICAgICAgIG91dC56ID0gaXogKiBxLncgKyBpdyAqIC1xLnogKyBpeCAqIC1xLnkgLSBpeSAqIC1xLng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDku6XnvKnmlL4gLT4g5peL6L2sIC0+IOW5s+enu+mhuuW6j+WPmOaNouWQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybVJUUzxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogSVZlYzNMaWtlLCByOiBJUXVhdExpa2UsIHQ6IElWZWMzTGlrZSwgczogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IGEueCAqIHMueDtcclxuICAgICAgICBjb25zdCB5ID0gYS55ICogcy55O1xyXG4gICAgICAgIGNvbnN0IHogPSBhLnogKiBzLno7XHJcbiAgICAgICAgY29uc3QgaXggPSByLncgKiB4ICsgci55ICogeiAtIHIueiAqIHk7XHJcbiAgICAgICAgY29uc3QgaXkgPSByLncgKiB5ICsgci56ICogeCAtIHIueCAqIHo7XHJcbiAgICAgICAgY29uc3QgaXogPSByLncgKiB6ICsgci54ICogeSAtIHIueSAqIHg7XHJcbiAgICAgICAgY29uc3QgaXcgPSAtci54ICogeCAtIHIueSAqIHkgLSByLnogKiB6O1xyXG4gICAgICAgIG91dC54ID0gaXggKiByLncgKyBpdyAqIC1yLnggKyBpeSAqIC1yLnogLSBpeiAqIC1yLnkgKyB0Lng7XHJcbiAgICAgICAgb3V0LnkgPSBpeSAqIHIudyArIGl3ICogLXIueSArIGl6ICogLXIueCAtIGl4ICogLXIueiArIHQueTtcclxuICAgICAgICBvdXQueiA9IGl6ICogci53ICsgaXcgKiAtci56ICsgaXggKiAtci55IC0gaXkgKiAtci54ICsgdC56O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Lul5bmz56e7IC0+IOaXi+i9rCAtPiDnvKnmlL7pobrluo/pgIblj5jmjaLlkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm1JbnZlcnNlUlRTPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIHI6IElRdWF0TGlrZSwgdDogSVZlYzNMaWtlLCBzOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54IC0gdC54O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnkgLSB0Lnk7XHJcbiAgICAgICAgY29uc3QgeiA9IGEueiAtIHQuejtcclxuICAgICAgICBjb25zdCBpeCA9IHIudyAqIHggLSByLnkgKiB6ICsgci56ICogeTtcclxuICAgICAgICBjb25zdCBpeSA9IHIudyAqIHkgLSByLnogKiB4ICsgci54ICogejtcclxuICAgICAgICBjb25zdCBpeiA9IHIudyAqIHogLSByLnggKiB5ICsgci55ICogeDtcclxuICAgICAgICBjb25zdCBpdyA9IHIueCAqIHggKyByLnkgKiB5ICsgci56ICogejtcclxuICAgICAgICBvdXQueCA9IChpeCAqIHIudyArIGl3ICogci54ICsgaXkgKiByLnogLSBpeiAqIHIueSkgLyBzLng7XHJcbiAgICAgICAgb3V0LnkgPSAoaXkgKiByLncgKyBpdyAqIHIueSArIGl6ICogci54IC0gaXggKiByLnopIC8gcy55O1xyXG4gICAgICAgIG91dC56ID0gKGl6ICogci53ICsgaXcgKiByLnogKyBpeCAqIHIueSAtIGl5ICogci54KSAvIHMuejtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOe7lSBYIOi9tOaXi+i9rOWQkemHj+aMh+WumuW8p+W6plxyXG4gICAgICogQHBhcmFtIHYg5b6F5peL6L2s5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gbyDml4vovazkuK3lv4NcclxuICAgICAqIEBwYXJhbSBhIOaXi+i9rOW8p+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IElWZWMzTGlrZSwgbzogSVZlYzNMaWtlLCBhOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBUcmFuc2xhdGUgcG9pbnQgdG8gdGhlIG9yaWdpblxyXG4gICAgICAgIGNvbnN0IHggPSB2LnggLSBvLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHYueSAtIG8ueTtcclxuICAgICAgICBjb25zdCB6ID0gdi56IC0gby56O1xyXG5cclxuICAgICAgICAvLyBwZXJmb3JtIHJvdGF0aW9uXHJcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYSk7XHJcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYSk7XHJcbiAgICAgICAgY29uc3QgcnggPSB4O1xyXG4gICAgICAgIGNvbnN0IHJ5ID0geSAqIGNvcyAtIHogKiBzaW47XHJcbiAgICAgICAgY29uc3QgcnogPSB5ICogc2luICsgeiAqIGNvcztcclxuXHJcbiAgICAgICAgLy8gdHJhbnNsYXRlIHRvIGNvcnJlY3QgcG9zaXRpb25cclxuICAgICAgICBvdXQueCA9IHJ4ICsgby54O1xyXG4gICAgICAgIG91dC55ID0gcnkgKyBvLnk7XHJcbiAgICAgICAgb3V0LnogPSByeiArIG8uejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnu5UgWSDovbTml4vovazlkJHph4/mjIflrprlvKfluqZcclxuICAgICAqIEBwYXJhbSB2IOW+heaXi+i9rOWQkemHj1xyXG4gICAgICogQHBhcmFtIG8g5peL6L2s5Lit5b+DXHJcbiAgICAgKiBAcGFyYW0gYSDml4vovazlvKfluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVZPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBJVmVjM0xpa2UsIG86IElWZWMzTGlrZSwgYTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gVHJhbnNsYXRlIHBvaW50IHRvIHRoZSBvcmlnaW5cclxuICAgICAgICBjb25zdCB4ID0gdi54IC0gby54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB2LnkgLSBvLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IHYueiAtIG8uejtcclxuXHJcbiAgICAgICAgLy8gcGVyZm9ybSByb3RhdGlvblxyXG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGEpO1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGEpO1xyXG4gICAgICAgIGNvbnN0IHJ4ID0geiAqIHNpbiArIHggKiBjb3M7XHJcbiAgICAgICAgY29uc3QgcnkgPSB5O1xyXG4gICAgICAgIGNvbnN0IHJ6ID0geiAqIGNvcyAtIHggKiBzaW47XHJcblxyXG4gICAgICAgIC8vIHRyYW5zbGF0ZSB0byBjb3JyZWN0IHBvc2l0aW9uXHJcbiAgICAgICAgb3V0LnggPSByeCArIG8ueDtcclxuICAgICAgICBvdXQueSA9IHJ5ICsgby55O1xyXG4gICAgICAgIG91dC56ID0gcnogKyBvLno7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57uVIFog6L205peL6L2s5ZCR6YeP5oyH5a6a5byn5bqmXHJcbiAgICAgKiBAcGFyYW0gdiDlvoXml4vovazlkJHph49cclxuICAgICAqIEBwYXJhbSBvIOaXi+i9rOS4reW/g1xyXG4gICAgICogQHBhcmFtIGEg5peL6L2s5byn5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlWjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogSVZlYzNMaWtlLCBvOiBJVmVjM0xpa2UsIGE6IG51bWJlcikge1xyXG4gICAgICAgIC8vIFRyYW5zbGF0ZSBwb2ludCB0byB0aGUgb3JpZ2luXHJcbiAgICAgICAgY29uc3QgeCA9IHYueCAtIG8ueDtcclxuICAgICAgICBjb25zdCB5ID0gdi55IC0gby55O1xyXG4gICAgICAgIGNvbnN0IHogPSB2LnogLSBvLno7XHJcblxyXG4gICAgICAgIC8vIHBlcmZvcm0gcm90YXRpb25cclxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhKTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhKTtcclxuICAgICAgICBjb25zdCByeCA9IHggKiBjb3MgLSB5ICogc2luO1xyXG4gICAgICAgIGNvbnN0IHJ5ID0geCAqIHNpbiArIHkgKiBjb3M7XHJcbiAgICAgICAgY29uc3QgcnogPSB6O1xyXG5cclxuICAgICAgICAvLyB0cmFuc2xhdGUgdG8gY29ycmVjdCBwb3NpdGlvblxyXG4gICAgICAgIG91dC54ID0gcnggKyBvLng7XHJcbiAgICAgICAgb3V0LnkgPSByeSArIG8ueTtcclxuICAgICAgICBvdXQueiA9IHJ6ICsgby56O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+i9rOaVsOe7hFxyXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4Totbflp4vlgY/np7vph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCB2OiBJVmVjM0xpa2UsIG9mcyA9IDApIHtcclxuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XHJcbiAgICAgICAgb3V0W29mcyArIDFdID0gdi55O1xyXG4gICAgICAgIG91dFtvZnMgKyAyXSA9IHYuejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmlbDnu4TovazlkJHph49cclxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xyXG4gICAgICAgIG91dC54ID0gYXJyW29mcyArIDBdO1xyXG4gICAgICAgIG91dC55ID0gYXJyW29mcyArIDFdO1xyXG4gICAgICAgIG91dC56ID0gYXJyW29mcyArIDJdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP562J5Lu35Yik5patXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc3RyaWN0RXF1YWxzIChhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueSAmJiBhLnogPT09IGIuejtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmjpLpmaTmta7ngrnmlbDor6/lt67nmoTlkJHph4/ov5HkvLznrYnku7fliKTmlq1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBlcXVhbHMgKGE6IElWZWMzTGlrZSwgYjogSVZlYzNMaWtlLCBlcHNpbG9uID0gRVBTSUxPTikge1xyXG4gICAgICAgIGNvbnN0IHsgeDogYTAsIHk6IGExLCB6OiBhMiB9ID0gYTtcclxuICAgICAgICBjb25zdCB7IHg6IGIwLCB5OiBiMSwgejogYjIgfSA9IGI7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgTWF0aC5hYnMoYTAgLSBiMCkgPD1cclxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTApLCBNYXRoLmFicyhiMCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGExIC0gYjEpIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhMiAtIGIyKSA8PVxyXG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMiksIE1hdGguYWJzKGIyKSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguS4pOWQkemHj+WkueinkuW8p+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFuZ2xlIChhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzXzEsIGEpO1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzXzIsIGIpO1xyXG4gICAgICAgIGNvbnN0IGNvc2luZSA9IFZlYzMuZG90KHYzXzEsIHYzXzIpO1xyXG4gICAgICAgIGlmIChjb3NpbmUgPiAxLjApIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb3NpbmUgPCAtMS4wKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLlBJO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKGNvc2luZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5ZCR6YeP5Zyo5oyH5a6a5bmz6Z2i5LiK55qE5oqV5b2xXHJcbiAgICAgKiBAcGFyYW0gYSDlvoXmipXlvbHlkJHph49cclxuICAgICAqIEBwYXJhbSBuIOaMh+WumuW5s+mdoueahOazlee6v1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHByb2plY3RPblBsYW5lPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIG46IElWZWMzTGlrZSkge1xyXG4gICAgICAgIHJldHVybiBWZWMzLnN1YnRyYWN0KG91dCwgYSwgVmVjMy5wcm9qZWN0KG91dCwgYSwgbikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+WQkemHj+WcqOaMh+WumuWQkemHj+S4iueahOaKleW9sVxyXG4gICAgICogQHBhcmFtIGEg5b6F5oqV5b2x5ZCR6YePXHJcbiAgICAgKiBAcGFyYW0gbiDnm67moIflkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBwcm9qZWN0PE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBJVmVjM0xpa2UsIGI6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHNxckxlbiA9IFZlYzMubGVuZ3RoU3FyKGIpO1xyXG4gICAgICAgIGlmIChzcXJMZW4gPCAwLjAwMDAwMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gVmVjMy5zZXQob3V0LCAwLCAwLCAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gVmVjMy5tdWx0aXBseVNjYWxhcihvdXQsIGIsIFZlYzMuZG90KGEsIGIpIC8gc3FyTGVuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB4IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSB4OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB5IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSB5OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiB6IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSB6OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHY6IFZlYzMpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4PzogbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoeD86IG51bWJlciB8IFZlYzMsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHgueTtcclxuICAgICAgICAgICAgdGhpcy56ID0geC56O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLnogPSB6IHx8IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWFi+mahuW9k+WJjeWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3lkJHph4/kvb/lhbbkuI7mjIflrprlkJHph4/nm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTlkJHph4/jgIJcclxuICAgICAqIEByZXR1cm5zIGB0aGlzYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChvdGhlcjogVmVjMyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN5ZCR6YeP55qE5YW35L2T5YiG6YeP5YC844CCXHJcbiAgICAgKiBAcGFyYW0geCDopoHorr7nva7nmoQgeCDliIbph4/nmoTlgLxcclxuICAgICAqIEBwYXJhbSB5IOimgeiuvue9rueahCB5IOWIhumHj+eahOWAvFxyXG4gICAgICogQHBhcmFtIHog6KaB6K6+572u55qEIHog5YiG6YeP55qE5YC8XHJcbiAgICAgKiBAcmV0dXJucyBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlcik7XHJcblxyXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciB8IFZlYzMsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy56ID0geiB8fCAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKblnKjor6/lt67ojIPlm7TlhoXkuI7mjIflrprlkJHph4/nm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTlkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSBlcHNpbG9uIOWFgeiuuOeahOivr+W3ru+8jOW6lOS4uumdnui0n+aVsOOAglxyXG4gICAgICogQHJldHVybnMg5b2T5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95Zyo5oyH5a6a55qE6K+v5beu6IyD5Zu05YaF5YiG5Yir55u4562J5pe277yM6L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMgKG90aGVyOiBWZWMzLCBlcHNpbG9uID0gRVBTSUxPTikge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueCAtIG90aGVyLngpIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKG90aGVyLngpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSBvdGhlci55KSA8PVxyXG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyhvdGhlci55KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy56IC0gb3RoZXIueikgPD1cclxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy56KSwgTWF0aC5hYnMob3RoZXIueikpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3lkJHph4/mmK/lkKblnKjor6/lt67ojIPlm7TlhoXkuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSB4IOebuOavlOi+g+eahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg55u45q+U6L6D55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geiDnm7jmr5TovoPnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSBlcHNpbG9uIOWFgeiuuOeahOivr+W3ru+8jOW6lOS4uumdnui0n+aVsOOAglxyXG4gICAgICogQHJldHVybnMg5b2T5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95Zyo5oyH5a6a55qE6K+v5beu6IyD5Zu05YaF5YiG5Yir55u4562J5pe277yM6L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMzZiAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgZXBzaWxvbiA9IEVQU0lMT04pIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnggLSB4KSA8PVxyXG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLngpLCBNYXRoLmFicyh4KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy55IC0geSkgPD1cclxuICAgICAgICAgICAgZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy55KSwgTWF0aC5hYnMoeSkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueiAtIHopIDw9XHJcbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueiksIE1hdGguYWJzKHopKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5LiO5oyH5a6a5ZCR6YeP55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5ZCR6YeP44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IFZlYzMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLno7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0geCDmjIflrprlkJHph4/nmoQgeCDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB5IOaMh+WumuWQkemHj+eahCB5IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHog5oyH5a6a5ZCR6YeP55qEIHog5YiG6YeP44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTlkJHph4/nmoTlkITliIbph4/pg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFsczNmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHkgJiYgdGhpcy56ID09PSB6O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOi/lOWbnuW9k+WJjeWQkemHj+eahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICogQHJldHVybnMg5b2T5YmN5ZCR6YeP55qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0b1N0cmluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAoJHt0aGlzLngudG9GaXhlZCgyKX0sICR7dGhpcy55LnRvRml4ZWQoMil9LCAke3RoaXMuei50b0ZpeGVkKDIpfSlgO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruaMh+WumueahOaPkuWAvOavlOeOh++8jOS7juW9k+WJjeWQkemHj+WIsOebruagh+WQkemHj+S5i+mXtOWBmuaPkuWAvOOAglxyXG4gICAgICogQHBhcmFtIHRvIOebruagh+WQkemHj+OAglxyXG4gICAgICogQHBhcmFtIHJhdGlvIOaPkuWAvOavlOeOh++8jOiMg+WbtOS4uiBbMCwxXeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVycCAodG86IFZlYzMsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggKyByYXRpbyAqICh0by54IC0gdGhpcy54KTtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKyByYXRpbyAqICh0by55IC0gdGhpcy55KTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKyByYXRpbyAqICh0by56IC0gdGhpcy56KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/liqDms5XjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/nmoTnm7jliqBcclxuICAgICAqIEBwYXJhbSBvdGhlciDmjIflrprnmoTlkJHph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZCAob3RoZXI6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggKyBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSArIG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56ICsgb3RoZXIuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/liqDms5XjgILlsIblvZPliY3lkJHph4/kuI7mjIflrprliIbph4/nmoTlkJHph4/nm7jliqBcclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geiDmjIflrprnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZDNmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICsgeDtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKyB5O1xyXG4gICAgICAgIHRoaXMueiA9IHRoaXMueiArIHo7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP5YeP5rOV44CC5bCG5b2T5YmN5ZCR6YeP5YeP5Y675oyH5a6a5ZCR6YeP55qE57uT5p6c44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5YeP5pWw5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdWJ0cmFjdCAob3RoZXI6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSBvdGhlci54O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIG90aGVyLnk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56IC0gb3RoZXIuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/lh4/ms5XjgILlsIblvZPliY3lkJHph4/lh4/ljrvmjIflrprliIbph4/nmoTlkJHph49cclxuICAgICAqIEBwYXJhbSB4IOaMh+WumueahOWQkemHj+eahCB4IOWIhumHj+OAglxyXG4gICAgICogQHBhcmFtIHkg5oyH5a6a55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geiDmjIflrprnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN1YnRyYWN0M2YgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAtIHk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56IC0gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlkJHph4/mlbDkuZjjgILlsIblvZPliY3lkJHph4/mlbDkuZjmjIflrprmoIfph49cclxuICAgICAqIEBwYXJhbSBzY2FsYXIg5qCH6YeP5LmY5pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseVNjYWxhciAoc2NhbGFyOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHNjYWxhciA9PT0gJ29iamVjdCcpIHsgY29uc29sZS53YXJuKCdzaG91bGQgdXNlIFZlYzMubXVsdGlwbHkgZm9yIHZlY3RvciAqIHZlY3RvciBvcGVyYXRpb24nKTsgfVxyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLnkgPSB0aGlzLnkgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56ICogc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S5mOazleOAguWwhuW9k+WJjeWQkemHj+S5mOS7peS4juaMh+WumuWQkemHj+eahOe7k+aenOi1i+WAvOe7meW9k+WJjeWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkgKG90aGVyOiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvdGhlciAhPT0gJ29iamVjdCcpIHsgY29uc29sZS53YXJuKCdzaG91bGQgdXNlIFZlYzMuc2NhbGUgZm9yIHZlY3RvciAqIHNjYWxhciBvcGVyYXRpb24nKTsgfVxyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKiBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+S5mOazleOAguWwhuW9k+WJjeWQkemHj+S4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOS5mOeahOe7k+aenOi1i+WAvOe7meW9k+WJjeWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIHgg5oyH5a6a55qE5ZCR6YeP55qEIHgg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geSDmjIflrprnmoTlkJHph4/nmoQgeSDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB6IOaMh+WumueahOWQkemHj+eahCB6IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbXVsdGlwbHkzZiAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAqIHg7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICogeTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogKiB6O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+mAkOWFg+e0oOebuOmZpOOAguWwhuW9k+WJjeWQkemHj+S4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOmZpOeahOe7k+aenOi1i+WAvOe7meW9k+WJjeWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGl2aWRlIChvdGhlcjogVmVjMykge1xyXG4gICAgICAgIHRoaXMueCA9IHRoaXMueCAvIG90aGVyLng7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55IC8gb3RoZXIueTtcclxuICAgICAgICB0aGlzLnogPSB0aGlzLnogLyBvdGhlci56O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+mAkOWFg+e0oOebuOmZpOOAguWwhuW9k+WJjeWQkemHj+S4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOmZpOeahOe7k+aenOi1i+WAvOe7meW9k+WJjeWQkemHj+OAglxyXG4gICAgICogQHBhcmFtIHgg5oyH5a6a55qE5ZCR6YeP55qEIHgg5YiG6YeP44CCXHJcbiAgICAgKiBAcGFyYW0geSDmjIflrprnmoTlkJHph4/nmoQgeSDliIbph4/jgIJcclxuICAgICAqIEBwYXJhbSB6IOaMh+WumueahOWQkemHj+eahCB6IOWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGl2aWRlM2YgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB0aGlzLnggLyB4O1xyXG4gICAgICAgIHRoaXMueSA9IHRoaXMueSAvIHk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56IC8gejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIblvZPliY3lkJHph4/nmoTlkITkuKrliIbph4/lj5blj41cclxuICAgICAqL1xyXG4gICAgcHVibGljIG5lZ2F0aXZlICgpIHtcclxuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xyXG4gICAgICAgIHRoaXMueSA9IC10aGlzLnk7XHJcbiAgICAgICAgdGhpcy56ID0gLXRoaXMuejtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3lkJHph4/nmoTlgLzvvIzkvb/lhbblkITkuKrliIbph4/pg73lpITkuo7mjIflrprnmoTojIPlm7TlhoXjgIJcclxuICAgICAqIEBwYXJhbSBtaW5JbmNsdXNpdmUg5q+P5Liq5YiG6YeP6YO95Luj6KGo5LqG5a+55bqU5YiG6YeP5YWB6K6455qE5pyA5bCP5YC844CCXHJcbiAgICAgKiBAcGFyYW0gbWF4SW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWkp+WAvOOAglxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGFtcGYgKG1pbkluY2x1c2l2ZTogVmVjMywgbWF4SW5jbHVzaXZlOiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy54ID0gY2xhbXAodGhpcy54LCBtaW5JbmNsdXNpdmUueCwgbWF4SW5jbHVzaXZlLngpO1xyXG4gICAgICAgIHRoaXMueSA9IGNsYW1wKHRoaXMueSwgbWluSW5jbHVzaXZlLnksIG1heEluY2x1c2l2ZS55KTtcclxuICAgICAgICB0aGlzLnogPSBjbGFtcCh0aGlzLnosIG1pbkluY2x1c2l2ZS56LCBtYXhJbmNsdXNpdmUueik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZCR6YeP54K55LmY44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg5oyH5a6a55qE5ZCR6YeP44CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ngrnkuZjnmoTnu5PmnpzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRvdCAob3RoZXI6IFZlYzMpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogb3RoZXIueCArIHRoaXMueSAqIG90aGVyLnkgKyB0aGlzLnogKiBvdGhlci56O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWQkemHj+WPieS5mOOAguWwhuW9k+WJjeWQkemHj+W3puWPieS5mOaMh+WumuWQkemHj1xyXG4gICAgICogQHBhcmFtIG90aGVyIOaMh+WumueahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3Jvc3MgKG90aGVyOiBWZWMzKSB7XHJcbiAgICAgICAgY29uc3QgeyB4OiBheCwgeTogYXksIHo6IGF6IH0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IHsgeDogYngsIHk6IGJ5LCB6OiBieiB9ID0gb3RoZXI7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IGF5ICogYnogLSBheiAqIGJ5O1xyXG4gICAgICAgIHRoaXMueSA9IGF6ICogYnggLSBheCAqIGJ6O1xyXG4gICAgICAgIHRoaXMueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+WQkemHj+eahOmVv+W6pu+8iOaooe+8ieOAglxyXG4gICAgICogQHJldHVybnMg5ZCR6YeP55qE6ZW/5bqm77yI5qih77yJ44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZW5ndGggKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorqHnrpflkJHph4/plb/luqbvvIjmqKHvvInnmoTlubPmlrnjgIJcclxuICAgICAqIEByZXR1cm5zIOWQkemHj+mVv+W6pu+8iOaooe+8ieeahOW5s+aWueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoU3FyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55ICsgdGhpcy56ICogdGhpcy56O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeWQkemHj+W9kuS4gOWMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbm9ybWFsaXplICgpIHtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy54O1xyXG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnk7XHJcbiAgICAgICAgY29uc3QgeiA9IHRoaXMuejtcclxuXHJcbiAgICAgICAgbGV0IGxlbiA9IHggKiB4ICsgeSAqIHkgKyB6ICogejtcclxuICAgICAgICBpZiAobGVuID4gMCkge1xyXG4gICAgICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggKiBsZW47XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHkgKiBsZW47XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHogKiBsZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeWQkemHj+inhuS4uiB3IOWIhumHj+S4uiAxIOeahOWbm+e7tOWQkemHj++8jOW6lOeUqOWbm+e7tOefqemYteWPmOaNouWIsOW9k+WJjeefqemYtVxyXG4gICAgICogQHBhcmFtIG1hdHJpeCDlj5jmjaLnn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybU1hdDQgKG1hdHJpeDogTWF0NCkge1xyXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLng7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueTtcclxuICAgICAgICBjb25zdCB6ID0gdGhpcy56O1xyXG4gICAgICAgIGxldCByaHcgPSBtYXRyaXgubTAzICogeCArIG1hdHJpeC5tMDcgKiB5ICsgbWF0cml4Lm0xMSAqIHogKyBtYXRyaXgubTE1O1xyXG4gICAgICAgIHJodyA9IHJodyA/IDEgLyByaHcgOiAxO1xyXG4gICAgICAgIHRoaXMueCA9IChtYXRyaXgubTAwICogeCArIG1hdHJpeC5tMDQgKiB5ICsgbWF0cml4Lm0wOCAqIHogKyBtYXRyaXgubTEyKSAqIHJodztcclxuICAgICAgICB0aGlzLnkgPSAobWF0cml4Lm0wMSAqIHggKyBtYXRyaXgubTA1ICogeSArIG1hdHJpeC5tMDkgKiB6ICsgbWF0cml4Lm0xMykgKiByaHc7XHJcbiAgICAgICAgdGhpcy56ID0gKG1hdHJpeC5tMDIgKiB4ICsgbWF0cml4Lm0wNiAqIHkgKyBtYXRyaXgubTEwICogeiArIG1hdHJpeC5tMTQpICogcmh3O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB2M18xID0gbmV3IFZlYzMoKTtcclxuY29uc3QgdjNfMiA9IG5ldyBWZWMzKCk7XHJcblxyXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlZlYzMnLCBWZWMzLCB7IHg6IDAsIHk6IDAsIHo6IDAgfSk7XHJcbmxlZ2FjeUNDLlZlYzMgPSBWZWMzO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHYzIChvdGhlcjogVmVjMyk6IFZlYzM7XHJcbmV4cG9ydCBmdW5jdGlvbiB2MyAoeD86IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlcik6IFZlYzM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdjMgKHg/OiBudW1iZXIgfCBWZWMzLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IFZlYzMoeCBhcyBhbnksIHksIHopO1xyXG59XHJcblxyXG5sZWdhY3lDQy52MyA9IHYzO1xyXG4iXX0=