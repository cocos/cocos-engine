(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "./mat3.js", "./utils.js", "./vec3.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("./mat3.js"), require("./utils.js"), require("./vec3.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.mat3, global.utils, global.vec3, global.globalExports);
    global.quat = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _mat, _utils, _vec, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.quat = quat;
  _exports.Quat = void 0;

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
   * 四元数。
   */
  var Quat = /*#__PURE__*/function (_ValueType) {
    _inherits(Quat, _ValueType);

    _createClass(Quat, null, [{
      key: "clone",

      /**
       * @zh 获得指定四元数的拷贝
       */
      value: function clone(a) {
        return new Quat(a.x, a.y, a.z, a.w);
      }
      /**
       * @zh 复制目标四元数
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
       * @zh 设置四元数值
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
       * @zh 将目标赋值为单位四元数
       */

    }, {
      key: "identity",
      value: function identity(out) {
        out.x = 0;
        out.y = 0;
        out.z = 0;
        out.w = 1;
        return out;
      }
      /**
       * @zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
       */

    }, {
      key: "rotationTo",
      value: function rotationTo(out, a, b) {
        var dot = _vec.Vec3.dot(a, b);

        if (dot < -0.999999) {
          _vec.Vec3.cross(v3_1, _vec.Vec3.UNIT_X, a);

          if (v3_1.length() < 0.000001) {
            _vec.Vec3.cross(v3_1, _vec.Vec3.UNIT_Y, a);
          }

          _vec.Vec3.normalize(v3_1, v3_1);

          Quat.fromAxisAngle(out, v3_1, Math.PI);
          return out;
        } else if (dot > 0.999999) {
          out.x = 0;
          out.y = 0;
          out.z = 0;
          out.w = 1;
          return out;
        } else {
          _vec.Vec3.cross(v3_1, a, b);

          out.x = v3_1.x;
          out.y = v3_1.y;
          out.z = v3_1.z;
          out.w = 1 + dot;
          return Quat.normalize(out, out);
        }
      }
      /**
       * @zh 获取四元数的旋转轴和旋转弧度
       * @param outAxis 旋转轴输出
       * @param q 源四元数
       * @return 旋转弧度
       */

    }, {
      key: "getAxisAngle",
      value: function getAxisAngle(outAxis, q) {
        var rad = Math.acos(q.w) * 2.0;
        var s = Math.sin(rad / 2.0);

        if (s !== 0.0) {
          outAxis.x = q.x / s;
          outAxis.y = q.y / s;
          outAxis.z = q.z / s;
        } else {
          // If s is zero, return any axis (no rotation - axis does not matter)
          outAxis.x = 1;
          outAxis.y = 0;
          outAxis.z = 0;
        }

        return rad;
      }
      /**
       * @zh 四元数乘法
       */

    }, {
      key: "multiply",
      value: function multiply(out, a, b) {
        var x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
        var y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
        var z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
        var w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
      }
      /**
       * @zh 四元数标量乘法
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
       * @zh 四元数乘加：A + B * scale
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
       * @zh 绕 X 轴旋转指定四元数
       * @param rad 旋转弧度
       */

    }, {
      key: "rotateX",
      value: function rotateX(out, a, rad) {
        rad *= 0.5;
        var bx = Math.sin(rad);
        var bw = Math.cos(rad);
        var x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
        out.x = x * bw + w * bx;
        out.y = y * bw + z * bx;
        out.z = z * bw - y * bx;
        out.w = w * bw - x * bx;
        return out;
      }
      /**
       * @zh 绕 Y 轴旋转指定四元数
       * @param rad 旋转弧度
       */

    }, {
      key: "rotateY",
      value: function rotateY(out, a, rad) {
        rad *= 0.5;
        var by = Math.sin(rad);
        var bw = Math.cos(rad);
        var x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
        out.x = x * bw - z * by;
        out.y = y * bw + w * by;
        out.z = z * bw + x * by;
        out.w = w * bw - y * by;
        return out;
      }
      /**
       * @zh 绕 Z 轴旋转指定四元数
       * @param rad 旋转弧度
       */

    }, {
      key: "rotateZ",
      value: function rotateZ(out, a, rad) {
        rad *= 0.5;
        var bz = Math.sin(rad);
        var bw = Math.cos(rad);
        var x = a.x,
            y = a.y,
            z = a.z,
            w = a.w;
        out.x = x * bw + y * bz;
        out.y = y * bw - x * bz;
        out.z = z * bw + w * bz;
        out.w = w * bw - z * bz;
        return out;
      }
      /**
       * @zh 绕世界空间下指定轴旋转四元数
       * @param axis 旋转轴，默认已归一化
       * @param rad 旋转弧度
       */

    }, {
      key: "rotateAround",
      value: function rotateAround(out, rot, axis, rad) {
        // get inv-axis (local to rot)
        Quat.invert(qt_1, rot);

        _vec.Vec3.transformQuat(v3_1, axis, qt_1); // rotate by inv-axis


        Quat.fromAxisAngle(qt_1, v3_1, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
      }
      /**
       * @zh 绕本地空间下指定轴旋转四元数
       * @param axis 旋转轴
       * @param rad 旋转弧度
       */

    }, {
      key: "rotateAroundLocal",
      value: function rotateAroundLocal(out, rot, axis, rad) {
        Quat.fromAxisAngle(qt_1, axis, rad);
        Quat.multiply(out, rot, qt_1);
        return out;
      }
      /**
       * @zh 根据 xyz 分量计算 w 分量，默认已归一化
       */

    }, {
      key: "calculateW",
      value: function calculateW(out, a) {
        out.x = a.x;
        out.y = a.y;
        out.z = a.z;
        out.w = Math.sqrt(Math.abs(1.0 - a.x * a.x - a.y * a.y - a.z * a.z));
        return out;
      }
      /**
       * @zh 四元数点积（数量积）
       */

    }, {
      key: "dot",
      value: function dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
      }
      /**
       * @zh 逐元素线性插值： A + t * (B - A)
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
       * @zh 四元数球面插值
       */

    }, {
      key: "slerp",
      value: function slerp(out, a, b, t) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations
        var scale0 = 0;
        var scale1 = 0;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var bw = b.w; // calc cosine

        var cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w; // adjust signs (if necessary)

        if (cosom < 0.0) {
          cosom = -cosom;
          bx = -bx;
          by = -by;
          bz = -bz;
          bw = -bw;
        } // calculate coefficients


        if (1.0 - cosom > 0.000001) {
          // standard case (slerp)
          var omega = Math.acos(cosom);
          var sinom = Math.sin(omega);
          scale0 = Math.sin((1.0 - t) * omega) / sinom;
          scale1 = Math.sin(t * omega) / sinom;
        } else {
          // "from" and "to" quaternions are very close
          //  ... so we can do a linear interpolation
          scale0 = 1.0 - t;
          scale1 = t;
        } // calculate final values


        out.x = scale0 * a.x + scale1 * bx;
        out.y = scale0 * a.y + scale1 * by;
        out.z = scale0 * a.z + scale1 * bz;
        out.w = scale0 * a.w + scale1 * bw;
        return out;
      }
      /**
       * @zh 带两个控制点的四元数球面插值
       */

    }, {
      key: "sqlerp",
      value: function sqlerp(out, a, b, c, d, t) {
        Quat.slerp(qt_1, a, d, t);
        Quat.slerp(qt_2, b, c, t);
        Quat.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
        return out;
      }
      /**
       * @zh 四元数求逆
       */

    }, {
      key: "invert",
      value: function invert(out, a) {
        var dot = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
        var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out.x = -a.x * invDot;
        out.y = -a.y * invDot;
        out.z = -a.z * invDot;
        out.w = a.w * invDot;
        return out;
      }
      /**
       * @zh 求共轭四元数，对单位四元数与求逆等价，但更高效
       */

    }, {
      key: "conjugate",
      value: function conjugate(out, a) {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        out.w = a.w;
        return out;
      }
      /**
       * @zh 求四元数长度
       */

    }, {
      key: "len",
      value: function len(a) {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w);
      }
      /**
       * @zh 求四元数长度平方
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr(a) {
        return a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
      }
      /**
       * @zh 归一化四元数
       */

    }, {
      key: "normalize",
      value: function normalize(out, a) {
        var len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          out.x = a.x * len;
          out.y = a.y * len;
          out.z = a.z * len;
          out.w = a.w * len;
        }

        return out;
      }
      /**
       * @zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
       */

    }, {
      key: "fromAxes",
      value: function fromAxes(out, xAxis, yAxis, zAxis) {
        _mat.Mat3.set(m3_1, xAxis.x, xAxis.y, xAxis.z, yAxis.x, yAxis.y, yAxis.z, zAxis.x, zAxis.y, zAxis.z);

        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
      }
      /**
       * @zh 根据视口的前方向和上方向计算四元数
       * @param view 视口面向的前方向，必须归一化
       * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
       */

    }, {
      key: "fromViewUp",
      value: function fromViewUp(out, view, up) {
        _mat.Mat3.fromViewUp(m3_1, view, up);

        return Quat.normalize(out, Quat.fromMat3(out, m3_1));
      }
      /**
       * @zh 根据旋转轴和旋转弧度计算四元数
       */

    }, {
      key: "fromAxisAngle",
      value: function fromAxisAngle(out, axis, rad) {
        rad = rad * 0.5;
        var s = Math.sin(rad);
        out.x = s * axis.x;
        out.y = s * axis.y;
        out.z = s * axis.z;
        out.w = Math.cos(rad);
        return out;
      }
      /**
       * @zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
       */

    }, {
      key: "fromMat3",
      value: function fromMat3(out, m) {
        var m00 = m.m00,
            m01 = m.m03,
            m02 = m.m06,
            m10 = m.m01,
            m11 = m.m04,
            m12 = m.m07,
            m20 = m.m02,
            m21 = m.m05,
            m22 = m.m08;
        var trace = m00 + m11 + m22;

        if (trace > 0) {
          var s = 0.5 / Math.sqrt(trace + 1.0);
          out.w = 0.25 / s;
          out.x = (m21 - m12) * s;
          out.y = (m02 - m20) * s;
          out.z = (m10 - m01) * s;
        } else if (m00 > m11 && m00 > m22) {
          var _s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

          out.w = (m21 - m12) / _s;
          out.x = 0.25 * _s;
          out.y = (m01 + m10) / _s;
          out.z = (m02 + m20) / _s;
        } else if (m11 > m22) {
          var _s2 = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

          out.w = (m02 - m20) / _s2;
          out.x = (m01 + m10) / _s2;
          out.y = 0.25 * _s2;
          out.z = (m12 + m21) / _s2;
        } else {
          var _s3 = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

          out.w = (m10 - m01) / _s3;
          out.x = (m02 + m20) / _s3;
          out.y = (m12 + m21) / _s3;
          out.z = 0.25 * _s3;
        }

        return out;
      }
      /**
       * @zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
       */

    }, {
      key: "fromEuler",
      value: function fromEuler(out, x, y, z) {
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        var sx = Math.sin(x);
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);
        var sz = Math.sin(z);
        var cz = Math.cos(z);
        out.x = sx * cy * cz + cx * sy * sz;
        out.y = cx * sy * cz + sx * cy * sz;
        out.z = cx * cy * sz - sx * sy * cz;
        out.w = cx * cy * cz - sx * sy * sz;
        return out;
      }
      /**
       * @zh 返回定义此四元数的坐标系 X 轴向量
       */

    }, {
      key: "toAxisX",
      value: function toAxisX(out, q) {
        var fy = 2.0 * q.y;
        var fz = 2.0 * q.z;
        out.x = 1.0 - fy * q.y - fz * q.z;
        out.y = fy * q.x + fz * q.w;
        out.z = fz * q.x + fy * q.w;
        return out;
      }
      /**
       * @zh 返回定义此四元数的坐标系 Y 轴向量
       */

    }, {
      key: "toAxisY",
      value: function toAxisY(out, q) {
        var fx = 2.0 * q.x;
        var fy = 2.0 * q.y;
        var fz = 2.0 * q.z;
        out.x = fy * q.x - fz * q.w;
        out.y = 1.0 - fx * q.x - fz * q.z;
        out.z = fz * q.y + fx * q.w;
        return out;
      }
      /**
       * @zh 返回定义此四元数的坐标系 Z 轴向量
       */

    }, {
      key: "toAxisZ",
      value: function toAxisZ(out, q) {
        var fx = 2.0 * q.x;
        var fy = 2.0 * q.y;
        var fz = 2.0 * q.z;
        out.x = fz * q.x - fy * q.w;
        out.y = fz * q.y - fx * q.w;
        out.z = 1.0 - fx * q.x - fy * q.y;
        return out;
      }
      /**
       * @zh 根据四元数计算欧拉角，返回角度 x, y 在 [-180, 180] 区间内, z 默认在 [-90, 90] 区间内，旋转顺序为 YZX
       * @param outerZ z 取值范围区间改为 [-180, -90] U [90, 180]
       */

    }, {
      key: "toEuler",
      value: function toEuler(out, q, outerZ) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var bank = 0;
        var heading = 0;
        var attitude = 0;
        var test = x * y + z * w;

        if (test > 0.499999) {
          bank = 0; // default to zero

          heading = (0, _utils.toDegree)(2 * Math.atan2(x, w));
          attitude = 90;
        } else if (test < -0.499999) {
          bank = 0; // default to zero

          heading = -(0, _utils.toDegree)(2 * Math.atan2(x, w));
          attitude = -90;
        } else {
          var sqx = x * x;
          var sqy = y * y;
          var sqz = z * z;
          bank = (0, _utils.toDegree)(Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz));
          heading = (0, _utils.toDegree)(Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz));
          attitude = (0, _utils.toDegree)(Math.asin(2 * test));

          if (outerZ) {
            bank = -180 * Math.sign(bank + 1e-6) + bank;
            heading = -180 * Math.sign(heading + 1e-6) + heading;
            attitude = 180 * Math.sign(attitude + 1e-6) - attitude;
          }
        }

        out.x = bank;
        out.y = heading;
        out.z = attitude;
        return out;
      }
      /**
       * @zh 四元数转数组
       * @param ofs 数组内的起始偏移量
       */

    }, {
      key: "toArray",
      value: function toArray(out, q) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out[ofs + 0] = q.x;
        out[ofs + 1] = q.y;
        out[ofs + 2] = q.z;
        out[ofs + 3] = q.w;
        return out;
      }
      /**
       * @zh 数组转四元数
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
       * @zh 四元数等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
      }
      /**
       * @zh 排除浮点数误差的四元数近似等价判断
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

    function Quat(x, y, z, w) {
      var _this;

      _classCallCheck(this, Quat);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Quat).call(this));

      if (x && _typeof(x) === 'object') {
        _this.x = x.x;
        _this.y = x.y;
        _this.z = x.z;
        _this.w = x.w;
      } else {
        _this.x = x || 0;
        _this.y = y || 0;
        _this.z = z || 0;
        _this.w = w !== null && w !== void 0 ? w : 1;
      }

      return _this;
    }
    /**
     * @zh 克隆当前四元数。
     */


    _createClass(Quat, [{
      key: "clone",
      value: function clone() {
        return new Quat(this.x, this.y, this.z, this.w);
      }
      /**
       * @zh 设置当前四元数使其与指定四元数相等。
       * @param other 相比较的四元数。
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
          this.w = w !== null && w !== void 0 ? w : 1;
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
       * @zh 判断当前四元数是否与指定四元数相等。
       * @param other 相比较的四元数。
       * @returns 两四元数的各分量都相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
      }
      /**
       * @zh 将当前四元数转化为欧拉角（x-y-z）并赋值给出口向量。
       * @param out 出口向量。
       */

    }, {
      key: "getEulerAngles",
      value: function getEulerAngles(out) {
        return Quat.toEuler(out, this);
      }
      /**
       * @zh 根据指定的插值比率，从当前四元数到目标四元数之间做线性插值。
       * @param to 目标四元数。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        this.x = this.x + ratio * (to.x - this.x);
        this.y = this.y + ratio * (to.y - this.y);
        this.z = this.z + ratio * (to.z - this.z);
        this.w = this.w + ratio * (to.w - this.w);
        return this;
      }
      /**
       * @zh 根据指定的插值比率，从当前四元数到目标四元数之间做球面插值。
       * @param to 目标四元数。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "slerp",
      value: function slerp(to, ratio) {
        return Quat.slerp(this, this, to, ratio);
      }
      /**
       * @zh 求四元数长度
       */

    }, {
      key: "length",
      value: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
      }
      /**
       * @zh 求四元数长度平方
       */

    }, {
      key: "lengthSqr",
      value: function lengthSqr() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      }
    }]);

    return Quat;
  }(_valueType.ValueType);

  _exports.Quat = Quat;
  Quat.IDENTITY = Object.freeze(new Quat());
  var qt_1 = new Quat();
  var qt_2 = new Quat();
  var v3_1 = new _vec.Vec3();
  var m3_1 = new _mat.Mat3();
  var halfToRad = 0.5 * Math.PI / 180.0;

  _class.CCClass.fastDefine('cc.Quat', Quat, {
    x: 0,
    y: 0,
    z: 0,
    w: 1
  });

  _globalExports.legacyCC.Quat = Quat;

  function quat() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    return new Quat(x, y, z, w);
  }

  _globalExports.legacyCC.quat = quat;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9xdWF0LnRzIl0sIm5hbWVzIjpbIlF1YXQiLCJhIiwieCIsInkiLCJ6IiwidyIsIm91dCIsImIiLCJkb3QiLCJWZWMzIiwiY3Jvc3MiLCJ2M18xIiwiVU5JVF9YIiwibGVuZ3RoIiwiVU5JVF9ZIiwibm9ybWFsaXplIiwiZnJvbUF4aXNBbmdsZSIsIk1hdGgiLCJQSSIsIm91dEF4aXMiLCJxIiwicmFkIiwiYWNvcyIsInMiLCJzaW4iLCJzY2FsZSIsImJ4IiwiYnciLCJjb3MiLCJieSIsImJ6Iiwicm90IiwiYXhpcyIsImludmVydCIsInF0XzEiLCJ0cmFuc2Zvcm1RdWF0IiwibXVsdGlwbHkiLCJzcXJ0IiwiYWJzIiwidCIsInNjYWxlMCIsInNjYWxlMSIsImNvc29tIiwib21lZ2EiLCJzaW5vbSIsImMiLCJkIiwic2xlcnAiLCJxdF8yIiwiaW52RG90IiwibGVuIiwieEF4aXMiLCJ5QXhpcyIsInpBeGlzIiwiTWF0MyIsInNldCIsIm0zXzEiLCJmcm9tTWF0MyIsInZpZXciLCJ1cCIsImZyb21WaWV3VXAiLCJtIiwibTAwIiwibTAxIiwibTAzIiwibTAyIiwibTA2IiwibTEwIiwibTExIiwibTA0IiwibTEyIiwibTA3IiwibTIwIiwibTIxIiwibTA1IiwibTIyIiwibTA4IiwidHJhY2UiLCJoYWxmVG9SYWQiLCJzeCIsImN4Iiwic3kiLCJjeSIsInN6IiwiY3oiLCJmeSIsImZ6IiwiZngiLCJvdXRlcloiLCJiYW5rIiwiaGVhZGluZyIsImF0dGl0dWRlIiwidGVzdCIsImF0YW4yIiwic3F4Iiwic3F5Iiwic3F6IiwiYXNpbiIsInNpZ24iLCJvZnMiLCJhcnIiLCJlcHNpbG9uIiwiRVBTSUxPTiIsIm1heCIsIm90aGVyIiwidG9FdWxlciIsInRvIiwicmF0aW8iLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwi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QUFNZ0QsSUFBSSxHQUFHLElBQUloRCxJQUFKLEVBQWI7QUFDQSxNQUFNVyxJQUFJLEdBQUcsSUFBSUYsU0FBSixFQUFiO0FBQ0EsTUFBTStDLElBQUksR0FBRyxJQUFJRixTQUFKLEVBQWI7QUFDQSxNQUFNd0IsU0FBUyxHQUFHLE1BQU03RCxJQUFJLENBQUNDLEVBQVgsR0FBZ0IsS0FBbEM7O0FBRUE4RixpQkFBUUMsVUFBUixDQUFtQixTQUFuQixFQUE4QmpILElBQTlCLEVBQW9DO0FBQUVFLElBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFDLElBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNDLElBQUFBLENBQUMsRUFBRSxDQUFqQjtBQUFvQkMsSUFBQUEsQ0FBQyxFQUFFO0FBQXZCLEdBQXBDOztBQUNBNkcsMEJBQVNsSCxJQUFULEdBQWdCQSxJQUFoQjs7QUFLTyxXQUFTbUgsSUFBVCxHQUFrRjtBQUFBLFFBQW5FakgsQ0FBbUUsdUVBQWhELENBQWdEO0FBQUEsUUFBN0NDLENBQTZDLHVFQUFqQyxDQUFpQztBQUFBLFFBQTlCQyxDQUE4Qix1RUFBbEIsQ0FBa0I7QUFBQSxRQUFmQyxDQUFlLHVFQUFILENBQUc7QUFDckYsV0FBTyxJQUFJTCxJQUFKLENBQVNFLENBQVQsRUFBbUJDLENBQW5CLEVBQXNCQyxDQUF0QixFQUF5QkMsQ0FBekIsQ0FBUDtBQUNIOztBQUVENkcsMEJBQVNDLElBQVQsR0FBZ0JBLElBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL21hdGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBDQ0NsYXNzIH0gZnJvbSAnLi4vZGF0YS9jbGFzcyc7XHJcbmltcG9ydCB7IFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZhbHVlLXR5cGUnO1xyXG5pbXBvcnQgeyBNYXQzIH0gZnJvbSAnLi9tYXQzJztcclxuaW1wb3J0IHsgSVF1YXRMaWtlLCBJVmVjM0xpa2UgfSBmcm9tICcuL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgRVBTSUxPTiwgdG9EZWdyZWUgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4vdmVjMyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIOWbm+WFg+aVsOOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1YXQgZXh0ZW5kcyBWYWx1ZVR5cGUge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgSURFTlRJVFkgPSBPYmplY3QuZnJlZXplKG5ldyBRdWF0KCkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiOt+W+l+aMh+WumuWbm+WFg+aVsOeahOaLt+i0nVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsb25lPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUXVhdChhLngsIGEueSwgYS56LCBhLncpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWkjeWItuebruagh+Wbm+WFg+aVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBRdWF0TGlrZSkge1xyXG4gICAgICAgIG91dC54ID0gYS54O1xyXG4gICAgICAgIG91dC55ID0gYS55O1xyXG4gICAgICAgIG91dC56ID0gYS56O1xyXG4gICAgICAgIG91dC53ID0gYS53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5Zub5YWD5pWw5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0PE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcclxuICAgICAgICBvdXQueCA9IHg7XHJcbiAgICAgICAgb3V0LnkgPSB5O1xyXG4gICAgICAgIG91dC56ID0gejtcclxuICAgICAgICBvdXQudyA9IHc7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIbnm67moIfotYvlgLzkuLrljZXkvY3lm5vlhYPmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpZGVudGl0eTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gMDtcclxuICAgICAgICBvdXQueSA9IDA7XHJcbiAgICAgICAgb3V0LnogPSAwO1xyXG4gICAgICAgIG91dC53ID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruWbm+WFg+aVsOS4uuS4pOWQkemHj+mXtOeahOacgOefrei3r+W+hOaXi+i9rO+8jOm7mOiupOS4pOWQkemHj+mDveW3suW9kuS4gOWMllxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0aW9uVG88T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IFZlY0xpa2UsIGI6IFZlY0xpa2UpIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChhLCBiKTtcclxuICAgICAgICBpZiAoZG90IDwgLTAuOTk5OTk5KSB7XHJcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModjNfMSwgVmVjMy5VTklUX1gsIGEpO1xyXG4gICAgICAgICAgICBpZiAodjNfMS5sZW5ndGgoKSA8IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLmNyb3NzKHYzXzEsIFZlYzMuVU5JVF9ZLCBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZSh2M18xLCB2M18xKTtcclxuICAgICAgICAgICAgUXVhdC5mcm9tQXhpc0FuZ2xlKG91dCwgdjNfMSwgTWF0aC5QSSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkb3QgPiAwLjk5OTk5OSkge1xyXG4gICAgICAgICAgICBvdXQueCA9IDA7XHJcbiAgICAgICAgICAgIG91dC55ID0gMDtcclxuICAgICAgICAgICAgb3V0LnogPSAwO1xyXG4gICAgICAgICAgICBvdXQudyA9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVmVjMy5jcm9zcyh2M18xLCBhLCBiKTtcclxuICAgICAgICAgICAgb3V0LnggPSB2M18xLng7XHJcbiAgICAgICAgICAgIG91dC55ID0gdjNfMS55O1xyXG4gICAgICAgICAgICBvdXQueiA9IHYzXzEuejtcclxuICAgICAgICAgICAgb3V0LncgPSAxICsgZG90O1xyXG4gICAgICAgICAgICByZXR1cm4gUXVhdC5ub3JtYWxpemUob3V0LCBvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5blm5vlhYPmlbDnmoTml4vovazovbTlkozml4vovazlvKfluqZcclxuICAgICAqIEBwYXJhbSBvdXRBeGlzIOaXi+i9rOi9tOi+k+WHulxyXG4gICAgICogQHBhcmFtIHEg5rqQ5Zub5YWD5pWwXHJcbiAgICAgKiBAcmV0dXJuIOaXi+i9rOW8p+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEF4aXNBbmdsZTxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXRBeGlzOiBWZWNMaWtlLCBxOiBPdXQpIHtcclxuICAgICAgICBjb25zdCByYWQgPSBNYXRoLmFjb3MocS53KSAqIDIuMDtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkIC8gMi4wKTtcclxuICAgICAgICBpZiAocyAhPT0gMC4wKSB7XHJcbiAgICAgICAgICAgIG91dEF4aXMueCA9IHEueCAvIHM7XHJcbiAgICAgICAgICAgIG91dEF4aXMueSA9IHEueSAvIHM7XHJcbiAgICAgICAgICAgIG91dEF4aXMueiA9IHEueiAvIHM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSWYgcyBpcyB6ZXJvLCByZXR1cm4gYW55IGF4aXMgKG5vIHJvdGF0aW9uIC0gYXhpcyBkb2VzIG5vdCBtYXR0ZXIpXHJcbiAgICAgICAgICAgIG91dEF4aXMueCA9IDE7XHJcbiAgICAgICAgICAgIG91dEF4aXMueSA9IDA7XHJcbiAgICAgICAgICAgIG91dEF4aXMueiA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByYWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw5LmY5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHk8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZV8xIGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZV8yIGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IFF1YXRMaWtlXzEsIGI6IFF1YXRMaWtlXzIpIHtcclxuICAgICAgICBjb25zdCB4ID0gYS54ICogYi53ICsgYS53ICogYi54ICsgYS55ICogYi56IC0gYS56ICogYi55O1xyXG4gICAgICAgIGNvbnN0IHkgPSBhLnkgKiBiLncgKyBhLncgKiBiLnkgKyBhLnogKiBiLnggLSBhLnggKiBiLno7XHJcbiAgICAgICAgY29uc3QgeiA9IGEueiAqIGIudyArIGEudyAqIGIueiArIGEueCAqIGIueSAtIGEueSAqIGIueDtcclxuICAgICAgICBjb25zdCB3ID0gYS53ICogYi53IC0gYS54ICogYi54IC0gYS55ICogYi55IC0gYS56ICogYi56O1xyXG4gICAgICAgIG91dC54ID0geDtcclxuICAgICAgICBvdXQueSA9IHk7XHJcbiAgICAgICAgb3V0LnogPSB6O1xyXG4gICAgICAgIG91dC53ID0gdztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOagh+mHj+S5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xyXG4gICAgICAgIG91dC54ID0gYS54ICogYjtcclxuICAgICAgICBvdXQueSA9IGEueSAqIGI7XHJcbiAgICAgICAgb3V0LnogPSBhLnogKiBiO1xyXG4gICAgICAgIG91dC53ID0gYS53ICogYjtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOS5mOWKoO+8mkEgKyBCICogc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzY2FsZUFuZEFkZDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQueCA9IGEueCArIGIueCAqIHNjYWxlO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgYi55ICogc2NhbGU7XHJcbiAgICAgICAgb3V0LnogPSBhLnogKyBiLnogKiBzY2FsZTtcclxuICAgICAgICBvdXQudyA9IGEudyArIGIudyAqIHNjYWxlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57uVIFgg6L205peL6L2s5oyH5a6a5Zub5YWD5pWwXHJcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOW8p+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcclxuICAgICAgICByYWQgKj0gMC41O1xyXG5cclxuICAgICAgICBjb25zdCBieCA9IE1hdGguc2luKHJhZCk7XHJcbiAgICAgICAgY29uc3QgYncgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiwgdyB9ID0gYTtcclxuXHJcbiAgICAgICAgb3V0LnggPSB4ICogYncgKyB3ICogYng7XHJcbiAgICAgICAgb3V0LnkgPSB5ICogYncgKyB6ICogYng7XHJcbiAgICAgICAgb3V0LnogPSB6ICogYncgLSB5ICogYng7XHJcbiAgICAgICAgb3V0LncgPSB3ICogYncgLSB4ICogYng7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnu5UgWSDovbTml4vovazmjIflrprlm5vlhYPmlbBcclxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s5byn5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlWTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJhZCAqPSAwLjU7XHJcblxyXG4gICAgICAgIGNvbnN0IGJ5ID0gTWF0aC5zaW4ocmFkKTtcclxuICAgICAgICBjb25zdCBidyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgY29uc3QgeyB4LCB5LCB6LCB3IH0gPSBhO1xyXG5cclxuICAgICAgICBvdXQueCA9IHggKiBidyAtIHogKiBieTtcclxuICAgICAgICBvdXQueSA9IHkgKiBidyArIHcgKiBieTtcclxuICAgICAgICBvdXQueiA9IHogKiBidyArIHggKiBieTtcclxuICAgICAgICBvdXQudyA9IHcgKiBidyAtIHkgKiBieTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOe7lSBaIOi9tOaXi+i9rOaMh+WumuWbm+WFg+aVsFxyXG4gICAgICogQHBhcmFtIHJhZCDml4vovazlvKfluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVaPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmFkICo9IDAuNTtcclxuXHJcbiAgICAgICAgY29uc3QgYnogPSBNYXRoLnNpbihyYWQpO1xyXG4gICAgICAgIGNvbnN0IGJ3ID0gTWF0aC5jb3MocmFkKTtcclxuICAgICAgICBjb25zdCB7IHgsIHksIHosIHcgfSA9IGE7XHJcblxyXG4gICAgICAgIG91dC54ID0geCAqIGJ3ICsgeSAqIGJ6O1xyXG4gICAgICAgIG91dC55ID0geSAqIGJ3IC0geCAqIGJ6O1xyXG4gICAgICAgIG91dC56ID0geiAqIGJ3ICsgdyAqIGJ6O1xyXG4gICAgICAgIG91dC53ID0gdyAqIGJ3IC0geiAqIGJ6O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57uV5LiW55WM56m66Ze05LiL5oyH5a6a6L205peL6L2s5Zub5YWD5pWwXHJcbiAgICAgKiBAcGFyYW0gYXhpcyDml4vovazovbTvvIzpu5jorqTlt7LlvZLkuIDljJZcclxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s5byn5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlQXJvdW5kPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByb3Q6IE91dCwgYXhpczogVmVjTGlrZSwgcmFkOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBnZXQgaW52LWF4aXMgKGxvY2FsIHRvIHJvdClcclxuICAgICAgICBRdWF0LmludmVydChxdF8xLCByb3QpO1xyXG4gICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdCh2M18xLCBheGlzLCBxdF8xKTtcclxuICAgICAgICAvLyByb3RhdGUgYnkgaW52LWF4aXNcclxuICAgICAgICBRdWF0LmZyb21BeGlzQW5nbGUocXRfMSwgdjNfMSwgcmFkKTtcclxuICAgICAgICBRdWF0Lm11bHRpcGx5KG91dCwgcm90LCBxdF8xKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOe7leacrOWcsOepuumXtOS4i+aMh+Wumui9tOaXi+i9rOWbm+WFg+aVsFxyXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L20XHJcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOW8p+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZUFyb3VuZExvY2FsPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByb3Q6IE91dCwgYXhpczogVmVjTGlrZSwgcmFkOiBudW1iZXIpIHtcclxuICAgICAgICBRdWF0LmZyb21BeGlzQW5nbGUocXRfMSwgYXhpcywgcmFkKTtcclxuICAgICAgICBRdWF0Lm11bHRpcGx5KG91dCwgcm90LCBxdF8xKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNriB4eXog5YiG6YeP6K6h566XIHcg5YiG6YeP77yM6buY6K6k5bey5b2S5LiA5YyWXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlVzxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcblxyXG4gICAgICAgIG91dC54ID0gYS54O1xyXG4gICAgICAgIG91dC55ID0gYS55O1xyXG4gICAgICAgIG91dC56ID0gYS56O1xyXG4gICAgICAgIG91dC53ID0gTWF0aC5zcXJ0KE1hdGguYWJzKDEuMCAtIGEueCAqIGEueCAtIGEueSAqIGEueSAtIGEueiAqIGEueikpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw54K556ev77yI5pWw6YeP56ev77yJXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZG90PE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueSArIGEueiAqIGIueiArIGEudyAqIGIudztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDnur/mgKfmj5LlgLzvvJogQSArIHQgKiAoQiAtIEEpXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVycDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcikge1xyXG4gICAgICAgIG91dC54ID0gYS54ICsgdCAqIChiLnggLSBhLngpO1xyXG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xyXG4gICAgICAgIG91dC56ID0gYS56ICsgdCAqIChiLnogLSBhLnopO1xyXG4gICAgICAgIG91dC53ID0gYS53ICsgdCAqIChiLncgLSBhLncpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw55CD6Z2i5o+S5YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2xlcnA8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZV8xIGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZV8yIGV4dGVuZHMgSVF1YXRMaWtlPlxyXG4gICAgICAgIChvdXQ6IE91dCwgYTogUXVhdExpa2VfMSwgYjogUXVhdExpa2VfMiwgdDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gYmVuY2htYXJrczpcclxuICAgICAgICAvLyAgICBodHRwOi8vanNwZXJmLmNvbS9xdWF0ZXJuaW9uLXNsZXJwLWltcGxlbWVudGF0aW9uc1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUwID0gMDtcclxuICAgICAgICBsZXQgc2NhbGUxID0gMDtcclxuICAgICAgICBsZXQgYnggPSBiLng7XHJcbiAgICAgICAgbGV0IGJ5ID0gYi55O1xyXG4gICAgICAgIGxldCBieiA9IGIuejtcclxuICAgICAgICBsZXQgYncgPSBiLnc7XHJcblxyXG4gICAgICAgIC8vIGNhbGMgY29zaW5lXHJcbiAgICAgICAgbGV0IGNvc29tID0gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xyXG4gICAgICAgIC8vIGFkanVzdCBzaWducyAoaWYgbmVjZXNzYXJ5KVxyXG4gICAgICAgIGlmIChjb3NvbSA8IDAuMCkge1xyXG4gICAgICAgICAgICBjb3NvbSA9IC1jb3NvbTtcclxuICAgICAgICAgICAgYnggPSAtYng7XHJcbiAgICAgICAgICAgIGJ5ID0gLWJ5O1xyXG4gICAgICAgICAgICBieiA9IC1iejtcclxuICAgICAgICAgICAgYncgPSAtYnc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjb2VmZmljaWVudHNcclxuICAgICAgICBpZiAoKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxKSB7XHJcbiAgICAgICAgICAgIC8vIHN0YW5kYXJkIGNhc2UgKHNsZXJwKVxyXG4gICAgICAgICAgICBjb25zdCBvbWVnYSA9IE1hdGguYWNvcyhjb3NvbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbm9tID0gTWF0aC5zaW4ob21lZ2EpO1xyXG4gICAgICAgICAgICBzY2FsZTAgPSBNYXRoLnNpbigoMS4wIC0gdCkgKiBvbWVnYSkgLyBzaW5vbTtcclxuICAgICAgICAgICAgc2NhbGUxID0gTWF0aC5zaW4odCAqIG9tZWdhKSAvIHNpbm9tO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFwiZnJvbVwiIGFuZCBcInRvXCIgcXVhdGVybmlvbnMgYXJlIHZlcnkgY2xvc2VcclxuICAgICAgICAgICAgLy8gIC4uLiBzbyB3ZSBjYW4gZG8gYSBsaW5lYXIgaW50ZXJwb2xhdGlvblxyXG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xyXG4gICAgICAgICAgICBzY2FsZTEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXHJcbiAgICAgICAgb3V0LnggPSBzY2FsZTAgKiBhLnggKyBzY2FsZTEgKiBieDtcclxuICAgICAgICBvdXQueSA9IHNjYWxlMCAqIGEueSArIHNjYWxlMSAqIGJ5O1xyXG4gICAgICAgIG91dC56ID0gc2NhbGUwICogYS56ICsgc2NhbGUxICogYno7XHJcbiAgICAgICAgb3V0LncgPSBzY2FsZTAgKiBhLncgKyBzY2FsZTEgKiBidztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDluKbkuKTkuKrmjqfliLbngrnnmoTlm5vlhYPmlbDnkIPpnaLmj5LlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzcWxlcnA8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBjOiBPdXQsIGQ6IE91dCwgdDogbnVtYmVyKSB7XHJcbiAgICAgICAgUXVhdC5zbGVycChxdF8xLCBhLCBkLCB0KTtcclxuICAgICAgICBRdWF0LnNsZXJwKHF0XzIsIGIsIGMsIHQpO1xyXG4gICAgICAgIFF1YXQuc2xlcnAob3V0LCBxdF8xLCBxdF8yLCAyICogdCAqICgxIC0gdCkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw5rGC6YCGXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJ0PE91dCBleHRlbmRzIElRdWF0TGlrZSwgUXVhdExpa2UgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogUXVhdExpa2UpIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBhLnggKiBhLnggKyBhLnkgKiBhLnkgKyBhLnogKiBhLnogKyBhLncgKiBhLnc7XHJcbiAgICAgICAgY29uc3QgaW52RG90ID0gZG90ID8gMS4wIC8gZG90IDogMDtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogV291bGQgYmUgZmFzdGVyIHRvIHJldHVybiBbMCwwLDAsMF0gaW1tZWRpYXRlbHkgaWYgZG90ID09IDBcclxuXHJcbiAgICAgICAgb3V0LnggPSAtYS54ICogaW52RG90O1xyXG4gICAgICAgIG91dC55ID0gLWEueSAqIGludkRvdDtcclxuICAgICAgICBvdXQueiA9IC1hLnogKiBpbnZEb3Q7XHJcbiAgICAgICAgb3V0LncgPSBhLncgKiBpbnZEb3Q7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLlhbHova3lm5vlhYPmlbDvvIzlr7nljZXkvY3lm5vlhYPmlbDkuI7msYLpgIbnrYnku7fvvIzkvYbmm7Tpq5jmlYhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb25qdWdhdGU8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIG91dC54ID0gLWEueDtcclxuICAgICAgICBvdXQueSA9IC1hLnk7XHJcbiAgICAgICAgb3V0LnogPSAtYS56O1xyXG4gICAgICAgIG91dC53ID0gYS53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rGC5Zub5YWD5pWw6ZW/5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbGVuPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoYS54ICogYS54ICsgYS55ICogYS55ICsgYS56ICogYS56ICsgYS53ICogYS53KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmsYLlm5vlhYPmlbDplb/luqblubPmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW5ndGhTcXI8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAoYTogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGEueCAqIGEueCArIGEueSAqIGEueSArIGEueiAqIGEueiArIGEudyAqIGEudztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlvZLkuIDljJblm5vlhYPmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBub3JtYWxpemU8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIGxldCBsZW4gPSBhLnggKiBhLnggKyBhLnkgKiBhLnkgKyBhLnogKiBhLnogKyBhLncgKiBhLnc7XHJcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcclxuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xyXG4gICAgICAgICAgICBvdXQueCA9IGEueCAqIGxlbjtcclxuICAgICAgICAgICAgb3V0LnkgPSBhLnkgKiBsZW47XHJcbiAgICAgICAgICAgIG91dC56ID0gYS56ICogbGVuO1xyXG4gICAgICAgICAgICBvdXQudyA9IGEudyAqIGxlbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7mnKzlnLDlnZDmoIfovbTmnJ3lkJHorqHnrpflm5vlhYPmlbDvvIzpu5jorqTkuInlkJHph4/pg73lt7LlvZLkuIDljJbkuJTnm7jkupLlnoLnm7RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tQXhlczxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgeEF4aXM6IFZlY0xpa2UsIHlBeGlzOiBWZWNMaWtlLCB6QXhpczogVmVjTGlrZSkge1xyXG4gICAgICAgIE1hdDMuc2V0KG0zXzEsXHJcbiAgICAgICAgICAgIHhBeGlzLngsIHhBeGlzLnksIHhBeGlzLnosXHJcbiAgICAgICAgICAgIHlBeGlzLngsIHlBeGlzLnksIHlBeGlzLnosXHJcbiAgICAgICAgICAgIHpBeGlzLngsIHpBeGlzLnksIHpBeGlzLnosXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gUXVhdC5ub3JtYWxpemUob3V0LCBRdWF0LmZyb21NYXQzKG91dCwgbTNfMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruinhuWPo+eahOWJjeaWueWQkeWSjOS4iuaWueWQkeiuoeeul+Wbm+WFg+aVsFxyXG4gICAgICogQHBhcmFtIHZpZXcg6KeG5Y+j6Z2i5ZCR55qE5YmN5pa55ZCR77yM5b+F6aG75b2S5LiA5YyWXHJcbiAgICAgKiBAcGFyYW0gdXAg6KeG5Y+j55qE5LiK5pa55ZCR77yM5b+F6aG75b2S5LiA5YyW77yM6buY6K6k5Li6ICgwLCAxLCAwKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21WaWV3VXA8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHZpZXc6IFZlY0xpa2UsIHVwPzogVmVjMykge1xyXG4gICAgICAgIE1hdDMuZnJvbVZpZXdVcChtM18xLCB2aWV3LCB1cCk7XHJcbiAgICAgICAgcmV0dXJuIFF1YXQubm9ybWFsaXplKG91dCwgUXVhdC5mcm9tTWF0MyhvdXQsIG0zXzEpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7ml4vovazovbTlkozml4vovazlvKfluqborqHnrpflm5vlhYPmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tQXhpc0FuZ2xlPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBheGlzOiBWZWNMaWtlLCByYWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJhZCA9IHJhZCAqIDAuNTtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcclxuICAgICAgICBvdXQueCA9IHMgKiBheGlzLng7XHJcbiAgICAgICAgb3V0LnkgPSBzICogYXhpcy55O1xyXG4gICAgICAgIG91dC56ID0gcyAqIGF4aXMuejtcclxuICAgICAgICBvdXQudyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7kuInnu7Tnn6npmLXkv6Hmga/orqHnrpflm5vlhYPmlbDvvIzpu5jorqTovpPlhaXnn6npmLXkuI3lkKvmnInnvKnmlL7kv6Hmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tTWF0MzxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgbTogTWF0Mykge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgbTAwOiBtMDAsIG0wMzogbTAxLCBtMDY6IG0wMixcclxuICAgICAgICAgICAgbTAxOiBtMTAsIG0wNDogbTExLCBtMDc6IG0xMixcclxuICAgICAgICAgICAgbTAyOiBtMjAsIG0wNTogbTIxLCBtMDg6IG0yMixcclxuICAgICAgICB9ID0gbTtcclxuXHJcbiAgICAgICAgY29uc3QgdHJhY2UgPSBtMDAgKyBtMTEgKyBtMjI7XHJcblxyXG4gICAgICAgIGlmICh0cmFjZSA+IDApIHtcclxuICAgICAgICAgICAgY29uc3QgcyA9IDAuNSAvIE1hdGguc3FydCh0cmFjZSArIDEuMCk7XHJcblxyXG4gICAgICAgICAgICBvdXQudyA9IDAuMjUgLyBzO1xyXG4gICAgICAgICAgICBvdXQueCA9IChtMjEgLSBtMTIpICogcztcclxuICAgICAgICAgICAgb3V0LnkgPSAobTAyIC0gbTIwKSAqIHM7XHJcbiAgICAgICAgICAgIG91dC56ID0gKG0xMCAtIG0wMSkgKiBzO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKChtMDAgPiBtMTEpICYmIChtMDAgPiBtMjIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbTAwIC0gbTExIC0gbTIyKTtcclxuXHJcbiAgICAgICAgICAgIG91dC53ID0gKG0yMSAtIG0xMikgLyBzO1xyXG4gICAgICAgICAgICBvdXQueCA9IDAuMjUgKiBzO1xyXG4gICAgICAgICAgICBvdXQueSA9IChtMDEgKyBtMTApIC8gcztcclxuICAgICAgICAgICAgb3V0LnogPSAobTAyICsgbTIwKSAvIHM7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobTExID4gbTIyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbTExIC0gbTAwIC0gbTIyKTtcclxuXHJcbiAgICAgICAgICAgIG91dC53ID0gKG0wMiAtIG0yMCkgLyBzO1xyXG4gICAgICAgICAgICBvdXQueCA9IChtMDEgKyBtMTApIC8gcztcclxuICAgICAgICAgICAgb3V0LnkgPSAwLjI1ICogcztcclxuICAgICAgICAgICAgb3V0LnogPSAobTEyICsgbTIxKSAvIHM7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbTIyIC0gbTAwIC0gbTExKTtcclxuXHJcbiAgICAgICAgICAgIG91dC53ID0gKG0xMCAtIG0wMSkgLyBzO1xyXG4gICAgICAgICAgICBvdXQueCA9IChtMDIgKyBtMjApIC8gcztcclxuICAgICAgICAgICAgb3V0LnkgPSAobTEyICsgbTIxKSAvIHM7XHJcbiAgICAgICAgICAgIG91dC56ID0gMC4yNSAqIHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruasp+aLieinkuS/oeaBr+iuoeeul+Wbm+WFg+aVsO+8jOaXi+i9rOmhuuW6j+S4uiBZWlhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tRXVsZXI8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpIHtcclxuICAgICAgICB4ICo9IGhhbGZUb1JhZDtcclxuICAgICAgICB5ICo9IGhhbGZUb1JhZDtcclxuICAgICAgICB6ICo9IGhhbGZUb1JhZDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3ggPSBNYXRoLnNpbih4KTtcclxuICAgICAgICBjb25zdCBjeCA9IE1hdGguY29zKHgpO1xyXG4gICAgICAgIGNvbnN0IHN5ID0gTWF0aC5zaW4oeSk7XHJcbiAgICAgICAgY29uc3QgY3kgPSBNYXRoLmNvcyh5KTtcclxuICAgICAgICBjb25zdCBzeiA9IE1hdGguc2luKHopO1xyXG4gICAgICAgIGNvbnN0IGN6ID0gTWF0aC5jb3Moeik7XHJcblxyXG4gICAgICAgIG91dC54ID0gc3ggKiBjeSAqIGN6ICsgY3ggKiBzeSAqIHN6O1xyXG4gICAgICAgIG91dC55ID0gY3ggKiBzeSAqIGN6ICsgc3ggKiBjeSAqIHN6O1xyXG4gICAgICAgIG91dC56ID0gY3ggKiBjeSAqIHN6IC0gc3ggKiBzeSAqIGN6O1xyXG4gICAgICAgIG91dC53ID0gY3ggKiBjeSAqIGN6IC0gc3ggKiBzeSAqIHN6O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOi/lOWbnuWumuS5ieatpOWbm+WFg+aVsOeahOWdkOagh+ezuyBYIOi9tOWQkemHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQXhpc1ggKG91dDogSVZlYzNMaWtlLCBxOiBJUXVhdExpa2UpIHtcclxuICAgICAgICBjb25zdCBmeSA9IDIuMCAqIHEueTtcclxuICAgICAgICBjb25zdCBmeiA9IDIuMCAqIHEuejtcclxuICAgICAgICBvdXQueCA9IDEuMCAtIGZ5ICogcS55IC0gZnogKiBxLno7XHJcbiAgICAgICAgb3V0LnkgPSBmeSAqIHEueCArIGZ6ICogcS53O1xyXG4gICAgICAgIG91dC56ID0gZnogKiBxLnggKyBmeSAqIHEudztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDov5Tlm57lrprkuYnmraTlm5vlhYPmlbDnmoTlnZDmoIfns7sgWSDovbTlkJHph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0b0F4aXNZIChvdXQ6IElWZWMzTGlrZSwgcTogSVF1YXRMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgZnggPSAyLjAgKiBxLng7XHJcbiAgICAgICAgY29uc3QgZnkgPSAyLjAgKiBxLnk7XHJcbiAgICAgICAgY29uc3QgZnogPSAyLjAgKiBxLno7XHJcbiAgICAgICAgb3V0LnggPSBmeSAqIHEueCAtIGZ6ICogcS53O1xyXG4gICAgICAgIG91dC55ID0gMS4wIC0gZnggKiBxLnggLSBmeiAqIHEuejtcclxuICAgICAgICBvdXQueiA9IGZ6ICogcS55ICsgZnggKiBxLnc7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6L+U5Zue5a6a5LmJ5q2k5Zub5YWD5pWw55qE5Z2Q5qCH57O7IFog6L205ZCR6YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9BeGlzWiAob3V0OiBJVmVjM0xpa2UsIHE6IElRdWF0TGlrZSkge1xyXG4gICAgICAgIGNvbnN0IGZ4ID0gMi4wICogcS54O1xyXG4gICAgICAgIGNvbnN0IGZ5ID0gMi4wICogcS55O1xyXG4gICAgICAgIGNvbnN0IGZ6ID0gMi4wICogcS56O1xyXG4gICAgICAgIG91dC54ID0gZnogKiBxLnggLSBmeSAqIHEudztcclxuICAgICAgICBvdXQueSA9IGZ6ICogcS55IC0gZnggKiBxLnc7XHJcbiAgICAgICAgb3V0LnogPSAxLjAgLSBmeCAqIHEueCAtIGZ5ICogcS55O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruWbm+WFg+aVsOiuoeeul+asp+aLieinku+8jOi/lOWbnuinkuW6piB4LCB5IOWcqCBbLTE4MCwgMTgwXSDljLrpl7TlhoUsIHog6buY6K6k5ZyoIFstOTAsIDkwXSDljLrpl7TlhoXvvIzml4vovazpobrluo/kuLogWVpYXHJcbiAgICAgKiBAcGFyYW0gb3V0ZXJaIHog5Y+W5YC86IyD5Zu05Yy66Ze05pS55Li6IFstMTgwLCAtOTBdIFUgWzkwLCAxODBdXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdG9FdWxlciAob3V0OiBJVmVjM0xpa2UsIHE6IElRdWF0TGlrZSwgb3V0ZXJaPzogYm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiwgdyB9ID0gcTtcclxuICAgICAgICBsZXQgYmFuayA9IDA7XHJcbiAgICAgICAgbGV0IGhlYWRpbmcgPSAwO1xyXG4gICAgICAgIGxldCBhdHRpdHVkZSA9IDA7XHJcbiAgICAgICAgY29uc3QgdGVzdCA9IHggKiB5ICsgeiAqIHc7XHJcbiAgICAgICAgaWYgKHRlc3QgPiAwLjQ5OTk5OSkge1xyXG4gICAgICAgICAgICBiYW5rID0gMDsgLy8gZGVmYXVsdCB0byB6ZXJvXHJcbiAgICAgICAgICAgIGhlYWRpbmcgPSB0b0RlZ3JlZSgyICogTWF0aC5hdGFuMih4LCB3KSk7XHJcbiAgICAgICAgICAgIGF0dGl0dWRlID0gOTA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0ZXN0IDwgLTAuNDk5OTk5KSB7XHJcbiAgICAgICAgICAgIGJhbmsgPSAwOyAvLyBkZWZhdWx0IHRvIHplcm9cclxuICAgICAgICAgICAgaGVhZGluZyA9IC10b0RlZ3JlZSgyICogTWF0aC5hdGFuMih4LCB3KSk7XHJcbiAgICAgICAgICAgIGF0dGl0dWRlID0gLTkwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxeCA9IHggKiB4O1xyXG4gICAgICAgICAgICBjb25zdCBzcXkgPSB5ICogeTtcclxuICAgICAgICAgICAgY29uc3Qgc3F6ID0geiAqIHo7XHJcbiAgICAgICAgICAgIGJhbmsgPSB0b0RlZ3JlZShNYXRoLmF0YW4yKDIgKiB4ICogdyAtIDIgKiB5ICogeiwgMSAtIDIgKiBzcXggLSAyICogc3F6KSk7XHJcbiAgICAgICAgICAgIGhlYWRpbmcgPSB0b0RlZ3JlZShNYXRoLmF0YW4yKDIgKiB5ICogdyAtIDIgKiB4ICogeiwgMSAtIDIgKiBzcXkgLSAyICogc3F6KSk7XHJcbiAgICAgICAgICAgIGF0dGl0dWRlID0gdG9EZWdyZWUoTWF0aC5hc2luKDIgKiB0ZXN0KSk7XHJcbiAgICAgICAgICAgIGlmIChvdXRlclopIHtcclxuICAgICAgICAgICAgICAgIGJhbmsgPSAtMTgwICogTWF0aC5zaWduKGJhbmsgKyAxZS02KSArIGJhbms7XHJcbiAgICAgICAgICAgICAgICBoZWFkaW5nID0gLTE4MCAqIE1hdGguc2lnbihoZWFkaW5nICsgMWUtNikgKyBoZWFkaW5nO1xyXG4gICAgICAgICAgICAgICAgYXR0aXR1ZGUgPSAxODAgKiBNYXRoLnNpZ24oYXR0aXR1ZGUgKyAxZS02KSAtIGF0dGl0dWRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dC54ID0gYmFuazsgb3V0LnkgPSBoZWFkaW5nOyBvdXQueiA9IGF0dGl0dWRlO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zub5YWD5pWw6L2s5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOWGheeahOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXk8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgcTogSVF1YXRMaWtlLCBvZnMgPSAwKSB7XHJcbiAgICAgICAgb3V0W29mcyArIDBdID0gcS54O1xyXG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHEueTtcclxuICAgICAgICBvdXRbb2ZzICsgMl0gPSBxLno7XHJcbiAgICAgICAgb3V0W29mcyArIDNdID0gcS53O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pWw57uE6L2s5Zub5YWD5pWwXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSAob3V0OiBJUXVhdExpa2UsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcclxuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcclxuICAgICAgICBvdXQueSA9IGFycltvZnMgKyAxXTtcclxuICAgICAgICBvdXQueiA9IGFycltvZnMgKyAyXTtcclxuICAgICAgICBvdXQudyA9IGFycltvZnMgKyAzXTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWbm+WFg+aVsOetieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyAoYTogSVF1YXRMaWtlLCBiOiBJUXVhdExpa2UpIHtcclxuICAgICAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnkgJiYgYS56ID09PSBiLnogJiYgYS53ID09PSBiLnc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5Zub5YWD5pWw6L+R5Ly8562J5Lu35Yik5patXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZXF1YWxzIChhOiBJUXVhdExpa2UsIGI6IElRdWF0TGlrZSwgZXBzaWxvbiA9IEVQU0lMT04pIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGEueCAtIGIueCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS54KSwgTWF0aC5hYnMoYi54KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS55IC0gYi55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnkpLCBNYXRoLmFicyhiLnkpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLnogLSBiLnopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueiksIE1hdGguYWJzKGIueikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEudyAtIGIudykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS53KSwgTWF0aC5hYnMoYi53KSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogeCDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogeSDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgeTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogeiDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgejogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogdyDliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlY2xhcmUgdzogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChvdGhlcjogUXVhdCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh4PzogbnVtYmVyIHwgSVF1YXRMaWtlLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcclxuICAgICAgICAgICAgdGhpcy53ID0geC53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLnogPSB6IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHcgPz8gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5YWL6ZqG5b2T5YmN5Zub5YWD5pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN5Zub5YWD5pWw5L2/5YW25LiO5oyH5a6a5Zub5YWD5pWw55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5Zub5YWD5pWw44CCXHJcbiAgICAgKiBAcmV0dXJucyBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAob3RoZXI6IFF1YXQpOiBRdWF0O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WJjeWbm+WFg+aVsOaMh+WumuWFg+e0oOWAvOOAglxyXG4gICAgICogQHBhcmFtIHgg5Zub5YWD5pWwIHgg5YWD57Sg5YC8XHJcbiAgICAgKiBAcGFyYW0geSDlm5vlhYPmlbAgeSDlhYPntKDlgLxcclxuICAgICAqIEBwYXJhbSB6IOWbm+WFg+aVsCB6IOWFg+e0oOWAvFxyXG4gICAgICogQHBhcmFtIHcg5Zub5YWD5pWwIHcg5YWD57Sg5YC8XHJcbiAgICAgKiBAcmV0dXJucyBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcik6IFF1YXQ7XHJcblxyXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciB8IFF1YXQsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoeCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy54ID0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XHJcbiAgICAgICAgICAgIHRoaXMueiA9IHguejtcclxuICAgICAgICAgICAgdGhpcy53ID0geC53O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLnogPSB6IHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHcgPz8gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5Zyo6K+v5beu6IyD5Zu05YaF5LiO5oyH5a6a5ZCR6YeP55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5ZCR6YeP44CCXHJcbiAgICAgKiBAcGFyYW0gZXBzaWxvbiDlhYHorrjnmoTor6/lt67vvIzlupTkuLrpnZ7otJ/mlbDjgIJcclxuICAgICAqIEByZXR1cm5zIOW9k+S4pOWQkemHj+eahOWQhOWIhumHj+mDveWcqOaMh+WumueahOivr+W3ruiMg+WbtOWGheWIhuWIq+ebuOetieaXtu+8jOi/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzIChvdGhlcjogUXVhdCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcclxuICAgICAgICByZXR1cm4gKE1hdGguYWJzKHRoaXMueCAtIG90aGVyLngpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueCksIE1hdGguYWJzKG90aGVyLngpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSBvdGhlci55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyhvdGhlci55KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy56IC0gb3RoZXIueikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy56KSwgTWF0aC5hYnMob3RoZXIueikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMudyAtIG90aGVyLncpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMudyksIE1hdGguYWJzKG90aGVyLncpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN5Zub5YWD5pWw5piv5ZCm5LiO5oyH5a6a5Zub5YWD5pWw55u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5Zub5YWD5pWw44CCXHJcbiAgICAgKiBAcmV0dXJucyDkuKTlm5vlhYPmlbDnmoTlkITliIbph4/pg73nm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IFF1YXQpIHtcclxuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLnogJiYgdGhpcy53ID09PSBvdGhlci53O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeWbm+WFg+aVsOi9rOWMluS4uuasp+aLieinku+8iHgteS1677yJ5bm26LWL5YC857uZ5Ye65Y+j5ZCR6YeP44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOWHuuWPo+WQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RXVsZXJBbmdsZXMgKG91dDogVmVjMykge1xyXG4gICAgICAgIHJldHVybiBRdWF0LnRvRXVsZXIob3V0LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7mjIflrprnmoTmj5LlgLzmr5TnjofvvIzku47lvZPliY3lm5vlhYPmlbDliLDnm67moIflm5vlhYPmlbDkuYvpl7TlgZrnur/mgKfmj5LlgLzjgIJcclxuICAgICAqIEBwYXJhbSB0byDnm67moIflm5vlhYPmlbDjgIJcclxuICAgICAqIEBwYXJhbSByYXRpbyDmj5LlgLzmr5TnjofvvIzojIPlm7TkuLogWzAsMV3jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGxlcnAgKHRvOiBRdWF0LCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0gdGhpcy54ICsgcmF0aW8gKiAodG8ueCAtIHRoaXMueCk7XHJcbiAgICAgICAgdGhpcy55ID0gdGhpcy55ICsgcmF0aW8gKiAodG8ueSAtIHRoaXMueSk7XHJcbiAgICAgICAgdGhpcy56ID0gdGhpcy56ICsgcmF0aW8gKiAodG8ueiAtIHRoaXMueik7XHJcbiAgICAgICAgdGhpcy53ID0gdGhpcy53ICsgcmF0aW8gKiAodG8udyAtIHRoaXMudyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5qC55o2u5oyH5a6a55qE5o+S5YC85q+U546H77yM5LuO5b2T5YmN5Zub5YWD5pWw5Yiw55uu5qCH5Zub5YWD5pWw5LmL6Ze05YGa55CD6Z2i5o+S5YC844CCXHJcbiAgICAgKiBAcGFyYW0gdG8g55uu5qCH5Zub5YWD5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gcmF0aW8g5o+S5YC85q+U546H77yM6IyD5Zu05Li6IFswLDFd44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzbGVycCAodG86IFF1YXQsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gUXVhdC5zbGVycCh0aGlzLCB0aGlzLCB0bywgcmF0aW8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaxguWbm+WFg+aVsOmVv+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMueiArIHRoaXMudyAqIHRoaXMudyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5rGC5Zub5YWD5pWw6ZW/5bqm5bmz5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZW5ndGhTcXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkgKyB0aGlzLnogKiB0aGlzLnogKyB0aGlzLncgKiB0aGlzLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHF0XzEgPSBuZXcgUXVhdCgpO1xyXG5jb25zdCBxdF8yID0gbmV3IFF1YXQoKTtcclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IG0zXzEgPSBuZXcgTWF0MygpO1xyXG5jb25zdCBoYWxmVG9SYWQgPSAwLjUgKiBNYXRoLlBJIC8gMTgwLjA7XHJcblxyXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlF1YXQnLCBRdWF0LCB7IHg6IDAsIHk6IDAsIHo6IDAsIHc6IDEgfSk7XHJcbmxlZ2FjeUNDLlF1YXQgPSBRdWF0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHF1YXQgKG90aGVyOiBRdWF0KTogUXVhdDtcclxuZXhwb3J0IGZ1bmN0aW9uIHF1YXQgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpOiBRdWF0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHF1YXQgKHg6IG51bWJlciB8IFF1YXQgPSAwLCB5OiBudW1iZXIgPSAwLCB6OiBudW1iZXIgPSAwLCB3OiBudW1iZXIgPSAxKSB7XHJcbiAgICByZXR1cm4gbmV3IFF1YXQoeCBhcyBhbnksIHksIHosIHcpO1xyXG59XHJcblxyXG5sZWdhY3lDQy5xdWF0ID0gcXVhdDtcclxuIl19