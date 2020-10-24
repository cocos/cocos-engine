(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "./utils.js", "./vec3.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("./utils.js"), require("./vec3.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.utils, global.vec3, global.globalExports);
    global.mat3 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _utils, _vec, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Mat3 = void 0;

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
   * 表示三维（3x3）矩阵。
   */
  // tslint:disable:one-variable-per-declaration
  var Mat3 = /*#__PURE__*/function (_ValueType) {
    _inherits(Mat3, _ValueType);

    _createClass(Mat3, null, [{
      key: "clone",

      /**
       * @zh 获得指定矩阵的拷贝
       */
      value: function clone(a) {
        return new Mat3(a.m00, a.m01, a.m02, a.m03, a.m04, a.m05, a.m06, a.m07, a.m08);
      }
      /**
       * @zh 复制目标矩阵
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m03;
        out.m04 = a.m04;
        out.m05 = a.m05;
        out.m06 = a.m06;
        out.m07 = a.m07;
        out.m08 = a.m08;
        return out;
      }
      /**
       * @zh 设置矩阵值
       */

    }, {
      key: "set",
      value: function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        out.m00 = m00;
        out.m01 = m01;
        out.m02 = m02;
        out.m03 = m10;
        out.m04 = m11;
        out.m05 = m12;
        out.m06 = m20;
        out.m07 = m21;
        out.m08 = m22;
        return out;
      }
      /**
       * @zh 将目标赋值为单位矩阵
       */

    }, {
      key: "identity",
      value: function identity(out) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 1;
        out.m05 = 0;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
      }
      /**
       * @zh 转置矩阵
       */

    }, {
      key: "transpose",
      value: function transpose(out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
          var a01 = a.m01;
          var a02 = a.m02;
          var a12 = a.m05;
          out.m01 = a.m03;
          out.m02 = a.m06;
          out.m03 = a01;
          out.m05 = a.m07;
          out.m06 = a02;
          out.m07 = a12;
        } else {
          out.m00 = a.m00;
          out.m01 = a.m03;
          out.m02 = a.m06;
          out.m03 = a.m01;
          out.m04 = a.m04;
          out.m05 = a.m07;
          out.m06 = a.m02;
          out.m07 = a.m05;
          out.m08 = a.m08;
        }

        return out;
      }
      /**
       * @zh 矩阵求逆，注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
       */

    }, {
      key: "invert",
      value: function invert(out, a) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

        var det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
          out.m00 = 0;
          out.m01 = 0;
          out.m02 = 0;
          out.m03 = 0;
          out.m04 = 0;
          out.m05 = 0;
          out.m06 = 0;
          out.m07 = 0;
          out.m08 = 0;
          return out;
        }

        det = 1.0 / det;
        out.m00 = b01 * det;
        out.m01 = (-a22 * a01 + a02 * a21) * det;
        out.m02 = (a12 * a01 - a02 * a11) * det;
        out.m03 = b11 * det;
        out.m04 = (a22 * a00 - a02 * a20) * det;
        out.m05 = (-a12 * a00 + a02 * a10) * det;
        out.m06 = b21 * det;
        out.m07 = (-a21 * a00 + a01 * a20) * det;
        out.m08 = (a11 * a00 - a01 * a10) * det;
        return out;
      }
      /**
       * @zh 矩阵行列式
       */

    }, {
      key: "determinant",
      value: function determinant(a) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
      }
      /**
       * @zh 矩阵乘法
       */

    }, {
      key: "multiply",
      value: function multiply(out, a, b) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        var b00 = b.m00,
            b01 = b.m01,
            b02 = b.m02;
        var b10 = b.m03,
            b11 = b.m04,
            b12 = b.m05;
        var b20 = b.m06,
            b21 = b.m07,
            b22 = b.m08;
        out.m00 = b00 * a00 + b01 * a10 + b02 * a20;
        out.m01 = b00 * a01 + b01 * a11 + b02 * a21;
        out.m02 = b00 * a02 + b01 * a12 + b02 * a22;
        out.m03 = b10 * a00 + b11 * a10 + b12 * a20;
        out.m04 = b10 * a01 + b11 * a11 + b12 * a21;
        out.m05 = b10 * a02 + b11 * a12 + b12 * a22;
        out.m06 = b20 * a00 + b21 * a10 + b22 * a20;
        out.m07 = b20 * a01 + b21 * a11 + b22 * a21;
        out.m08 = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
      }
      /**
       * @zh 取四阶矩阵的前三阶，与三阶矩阵相乘
       */

    }, {
      key: "multiplyMat4",
      value: function multiplyMat4(out, a, b) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        var b00 = b.m00,
            b01 = b.m01,
            b02 = b.m02;
        var b10 = b.m04,
            b11 = b.m05,
            b12 = b.m06;
        var b20 = b.m08,
            b21 = b.m09,
            b22 = b.m10;
        out.m00 = b00 * a00 + b01 * a10 + b02 * a20;
        out.m01 = b00 * a01 + b01 * a11 + b02 * a21;
        out.m02 = b00 * a02 + b01 * a12 + b02 * a22;
        out.m03 = b10 * a00 + b11 * a10 + b12 * a20;
        out.m04 = b10 * a01 + b11 * a11 + b12 * a21;
        out.m05 = b10 * a02 + b11 * a12 + b12 * a22;
        out.m06 = b20 * a00 + b21 * a10 + b22 * a20;
        out.m07 = b20 * a01 + b21 * a11 + b22 * a21;
        out.m08 = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入变换
       * @deprecated 将在 1.2 移除，请转用 `Mat3.transform` 方法。
       */

    }, {
      key: "transfrom",
      value: function transfrom(out, a, v) {
        Mat3.transform(out, a, v);
      }
      /**
       * @zh 在给定矩阵变换基础上加入变换
       */

    }, {
      key: "transform",
      value: function transform(out, a, v) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        var x = v.x,
            y = v.y;
        out.m00 = a00;
        out.m01 = a01;
        out.m02 = a02;
        out.m03 = a10;
        out.m04 = a11;
        out.m05 = a12;
        out.m06 = x * a00 + y * a10 + a20;
        out.m07 = x * a01 + y * a11 + a21;
        out.m08 = x * a02 + y * a12 + a22;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入新缩放变换
       */

    }, {
      key: "scale",
      value: function scale(out, a, v) {
        var x = v.x,
            y = v.y;
        out.m00 = x * a.m00;
        out.m01 = x * a.m01;
        out.m02 = x * a.m02;
        out.m03 = y * a.m03;
        out.m04 = y * a.m04;
        out.m05 = y * a.m05;
        out.m06 = a.m06;
        out.m07 = a.m07;
        out.m08 = a.m08;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入新旋转变换
       * @param rad 旋转弧度
       */

    }, {
      key: "rotate",
      value: function rotate(out, a, rad) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a10 = a.m03;
        var a11 = a.m04;
        var a12 = a.m05;
        var a20 = a.m06;
        var a21 = a.m07;
        var a22 = a.m08;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out.m00 = c * a00 + s * a10;
        out.m01 = c * a01 + s * a11;
        out.m02 = c * a02 + s * a12;
        out.m03 = c * a10 - s * a00;
        out.m04 = c * a11 - s * a01;
        out.m05 = c * a12 - s * a02;
        out.m06 = a20;
        out.m07 = a21;
        out.m08 = a22;
        return out;
      }
      /**
       * @zh 取四阶矩阵的前三阶
       */

    }, {
      key: "fromMat4",
      value: function fromMat4(out, a) {
        out.m00 = a.m00;
        out.m01 = a.m01;
        out.m02 = a.m02;
        out.m03 = a.m04;
        out.m04 = a.m05;
        out.m05 = a.m06;
        out.m06 = a.m08;
        out.m07 = a.m09;
        out.m08 = a.m10;
        return out;
      }
      /**
       * @zh 根据视口前方向和上方向计算矩阵
       * @param view 视口面向的前方向，必须归一化
       * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
       */

    }, {
      key: "fromViewUp",
      value: function fromViewUp(out, view, up) {
        if (_vec.Vec3.lengthSqr(view) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        up = up || _vec.Vec3.UNIT_Y;

        _vec.Vec3.normalize(v3_1, _vec.Vec3.cross(v3_1, up, view));

        if (_vec.Vec3.lengthSqr(v3_1) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        _vec.Vec3.cross(v3_2, view, v3_1);

        Mat3.set(out, v3_1.x, v3_1.y, v3_1.z, v3_2.x, v3_2.y, v3_2.z, view.x, view.y, view.z);
        return out;
      }
      /**
       * @zh 计算位移矩阵
       */

    }, {
      key: "fromTranslation",
      value: function fromTranslation(out, v) {
        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 1;
        out.m05 = 0;
        out.m06 = v.x;
        out.m07 = v.y;
        out.m08 = 1;
        return out;
      }
      /**
       * @zh 计算缩放矩阵
       */

    }, {
      key: "fromScaling",
      value: function fromScaling(out, v) {
        out.m00 = v.x;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = v.y;
        out.m05 = 0;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
      }
      /**
       * @zh 计算旋转矩阵
       */

    }, {
      key: "fromRotation",
      value: function fromRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad);
        out.m00 = c;
        out.m01 = s;
        out.m02 = 0;
        out.m03 = -s;
        out.m04 = c;
        out.m05 = 0;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 1;
        return out;
      }
      /**
       * @zh 根据四元数旋转信息计算矩阵
       */

    }, {
      key: "fromQuat",
      value: function fromQuat(out, q) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var yx = y * x2;
        var yy = y * y2;
        var zx = z * x2;
        var zy = z * y2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        out.m00 = 1 - yy - zz;
        out.m03 = yx - wz;
        out.m06 = zx + wy;
        out.m01 = yx + wz;
        out.m04 = 1 - xx - zz;
        out.m07 = zy - wx;
        out.m02 = zx - wy;
        out.m05 = zy + wx;
        out.m08 = 1 - xx - yy;
        return out;
      }
      /**
       * @zh 计算指定四维矩阵的逆转置三维矩阵
       */

    }, {
      key: "inverseTransposeMat4",
      value: function inverseTransposeMat4(out, a) {
        var a00 = a.m00,
            a01 = a.m01,
            a02 = a.m02,
            a03 = a.m03,
            a10 = a.m04,
            a11 = a.m05,
            a12 = a.m06,
            a13 = a.m07,
            a20 = a.m08,
            a21 = a.m09,
            a22 = a.m10,
            a23 = a.m11,
            a30 = a.m12,
            a31 = a.m13,
            a32 = a.m14,
            a33 = a.m15;
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
          return null;
        }

        det = 1.0 / det;
        out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out.m01 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out.m02 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out.m03 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m04 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m05 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out.m06 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m07 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m08 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
      }
      /**
       * @zh 矩阵转数组
       * @param ofs 数组内的起始偏移量
       */

    }, {
      key: "toArray",
      value: function toArray(out, m) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out[ofs + 0] = m.m00;
        out[ofs + 1] = m.m01;
        out[ofs + 2] = m.m02;
        out[ofs + 3] = m.m03;
        out[ofs + 4] = m.m04;
        out[ofs + 5] = m.m05;
        out[ofs + 6] = m.m06;
        out[ofs + 7] = m.m07;
        out[ofs + 8] = m.m08;
        return out;
      }
      /**
       * @zh 数组转矩阵
       * @param ofs 数组起始偏移量
       */

    }, {
      key: "fromArray",
      value: function fromArray(out, arr) {
        var ofs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        out.m00 = arr[ofs + 0];
        out.m01 = arr[ofs + 1];
        out.m02 = arr[ofs + 2];
        out.m03 = arr[ofs + 3];
        out.m04 = arr[ofs + 4];
        out.m05 = arr[ofs + 5];
        out.m06 = arr[ofs + 6];
        out.m07 = arr[ofs + 7];
        out.m08 = arr[ofs + 8];
        return out;
      }
      /**
       * @zh 逐元素矩阵加法
       */

    }, {
      key: "add",
      value: function add(out, a, b) {
        out.m00 = a.m00 + b.m00;
        out.m01 = a.m01 + b.m01;
        out.m02 = a.m02 + b.m02;
        out.m03 = a.m03 + b.m03;
        out.m04 = a.m04 + b.m04;
        out.m05 = a.m05 + b.m05;
        out.m06 = a.m06 + b.m06;
        out.m07 = a.m07 + b.m07;
        out.m08 = a.m08 + b.m08;
        return out;
      }
      /**
       * @zh 逐元素矩阵减法
       */

    }, {
      key: "subtract",
      value: function subtract(out, a, b) {
        out.m00 = a.m00 - b.m00;
        out.m01 = a.m01 - b.m01;
        out.m02 = a.m02 - b.m02;
        out.m03 = a.m03 - b.m03;
        out.m04 = a.m04 - b.m04;
        out.m05 = a.m05 - b.m05;
        out.m06 = a.m06 - b.m06;
        out.m07 = a.m07 - b.m07;
        out.m08 = a.m08 - b.m08;
        return out;
      }
      /**
       * @zh 矩阵标量乘法
       */

    }, {
      key: "multiplyScalar",
      value: function multiplyScalar(out, a, b) {
        out.m00 = a.m00 * b;
        out.m01 = a.m01 * b;
        out.m02 = a.m02 * b;
        out.m03 = a.m03 * b;
        out.m04 = a.m04 * b;
        out.m05 = a.m05 * b;
        out.m06 = a.m06 * b;
        out.m07 = a.m07 * b;
        out.m08 = a.m08 * b;
        return out;
      }
      /**
       * @zh 逐元素矩阵标量乘加: A + B * scale
       */

    }, {
      key: "multiplyScalarAndAdd",
      value: function multiplyScalarAndAdd(out, a, b, scale) {
        out.m00 = b.m00 * scale + a.m00;
        out.m01 = b.m01 * scale + a.m01;
        out.m02 = b.m02 * scale + a.m02;
        out.m03 = b.m03 * scale + a.m03;
        out.m04 = b.m04 * scale + a.m04;
        out.m05 = b.m05 * scale + a.m05;
        out.m06 = b.m06 * scale + a.m06;
        out.m07 = b.m07 * scale + a.m07;
        out.m08 = b.m08 * scale + a.m08;
        return out;
      }
      /**
       * @zh 矩阵等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08;
      }
      /**
       * @zh 排除浮点数误差的矩阵近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        return Math.abs(a.m00 - b.m00) <= epsilon * Math.max(1.0, Math.abs(a.m00), Math.abs(b.m00)) && Math.abs(a.m01 - b.m01) <= epsilon * Math.max(1.0, Math.abs(a.m01), Math.abs(b.m01)) && Math.abs(a.m02 - b.m02) <= epsilon * Math.max(1.0, Math.abs(a.m02), Math.abs(b.m02)) && Math.abs(a.m03 - b.m03) <= epsilon * Math.max(1.0, Math.abs(a.m03), Math.abs(b.m03)) && Math.abs(a.m04 - b.m04) <= epsilon * Math.max(1.0, Math.abs(a.m04), Math.abs(b.m04)) && Math.abs(a.m05 - b.m05) <= epsilon * Math.max(1.0, Math.abs(a.m05), Math.abs(b.m05)) && Math.abs(a.m06 - b.m06) <= epsilon * Math.max(1.0, Math.abs(a.m06), Math.abs(b.m06)) && Math.abs(a.m07 - b.m07) <= epsilon * Math.max(1.0, Math.abs(a.m07), Math.abs(b.m07)) && Math.abs(a.m08 - b.m08) <= epsilon * Math.max(1.0, Math.abs(a.m08), Math.abs(b.m08));
      }
      /**
       * 矩阵第 0 列第 0 行的元素。
       */

    }]);

    function Mat3() {
      var _this;

      var m00 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var m01 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m02 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var m03 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var m04 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var m05 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var m06 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var m07 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var m08 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;

      _classCallCheck(this, Mat3);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Mat3).call(this));

      if (_typeof(m00) === 'object') {
        _this.m00 = m00.m00;
        _this.m01 = m00.m01;
        _this.m02 = m00.m02;
        _this.m03 = m00.m03;
        _this.m04 = m00.m04;
        _this.m05 = m00.m05;
        _this.m06 = m00.m06;
        _this.m07 = m00.m07;
        _this.m08 = m00.m08;
      } else {
        _this.m00 = m00;
        _this.m01 = m01;
        _this.m02 = m02;
        _this.m03 = m03;
        _this.m04 = m04;
        _this.m05 = m05;
        _this.m06 = m06;
        _this.m07 = m07;
        _this.m08 = m08;
      }

      return _this;
    }
    /**
     * @zh 克隆当前矩阵。
     */


    _createClass(Mat3, [{
      key: "clone",
      value: function clone() {
        var t = this;
        return new Mat3(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05, t.m06, t.m07, t.m08);
      }
      /**
       * @zh 设置当前矩阵使其与指定矩阵相等。
       * @param other 相比较的矩阵。
       * @return this
       */

    }, {
      key: "set",
      value: function set() {
        var m00 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var m01 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var m02 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var m03 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var m04 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var m05 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var m06 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var m07 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var m08 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;

        if (_typeof(m00) === 'object') {
          this.m00 = m00.m00;
          this.m01 = m00.m01;
          this.m02 = m00.m02;
          this.m03 = m00.m03;
          this.m04 = m00.m04;
          this.m05 = m00.m05;
          this.m06 = m00.m06;
          this.m07 = m00.m07;
          this.m08 = m00.m08;
        } else {
          this.m00 = m00;
          this.m01 = m01;
          this.m02 = m02;
          this.m03 = m03;
          this.m04 = m04;
          this.m05 = m05;
          this.m06 = m06;
          this.m07 = m07;
          this.m08 = m08;
        }

        return this;
      }
      /**
       * @zh 判断当前矩阵是否在误差范围内与指定矩阵相等。
       * @param other 相比较的矩阵。
       * @param epsilon 允许的误差，应为非负数。
       * @return 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _utils.EPSILON;
        return Math.abs(this.m00 - other.m00) <= epsilon * Math.max(1.0, Math.abs(this.m00), Math.abs(other.m00)) && Math.abs(this.m01 - other.m01) <= epsilon * Math.max(1.0, Math.abs(this.m01), Math.abs(other.m01)) && Math.abs(this.m02 - other.m02) <= epsilon * Math.max(1.0, Math.abs(this.m02), Math.abs(other.m02)) && Math.abs(this.m03 - other.m03) <= epsilon * Math.max(1.0, Math.abs(this.m03), Math.abs(other.m03)) && Math.abs(this.m04 - other.m04) <= epsilon * Math.max(1.0, Math.abs(this.m04), Math.abs(other.m04)) && Math.abs(this.m05 - other.m05) <= epsilon * Math.max(1.0, Math.abs(this.m05), Math.abs(other.m05)) && Math.abs(this.m06 - other.m06) <= epsilon * Math.max(1.0, Math.abs(this.m06), Math.abs(other.m06)) && Math.abs(this.m07 - other.m07) <= epsilon * Math.max(1.0, Math.abs(this.m07), Math.abs(other.m07)) && Math.abs(this.m08 - other.m08) <= epsilon * Math.max(1.0, Math.abs(this.m08), Math.abs(other.m08));
      }
      /**
       * @zh 判断当前矩阵是否与指定矩阵相等。
       * @param other 相比较的矩阵。
       * @return 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return this.m00 === other.m00 && this.m01 === other.m01 && this.m02 === other.m02 && this.m03 === other.m03 && this.m04 === other.m04 && this.m05 === other.m05 && this.m06 === other.m06 && this.m07 === other.m07 && this.m08 === other.m08;
      }
      /**
       * 返回当前矩阵的字符串表示。
       * @return 当前矩阵的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        var t = this;
        return '[\n' + t.m00 + ', ' + t.m01 + ', ' + t.m02 + ',\n' + t.m03 + ',\n' + t.m04 + ', ' + t.m05 + ',\n' + t.m06 + ', ' + t.m07 + ',\n' + t.m08 + '\n' + ']';
      }
      /**
       * 将当前矩阵设为单位矩阵。
       * @return `this`
       */

    }, {
      key: "identity",
      value: function identity() {
        this.m00 = 1;
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m04 = 1;
        this.m05 = 0;
        this.m06 = 0;
        this.m07 = 0;
        this.m08 = 1;
        return this;
      }
      /**
       * @zh 计算当前矩阵的转置矩阵。
       */

    }, {
      key: "transpose",
      value: function transpose() {
        var a01 = this.m01,
            a02 = this.m02,
            a12 = this.m05;
        this.m01 = this.m03;
        this.m02 = this.m06;
        this.m03 = a01;
        this.m05 = this.m07;
        this.m06 = a02;
        this.m07 = a12;
        return this;
      }
      /**
       * @zh 计算当前矩阵的逆矩阵。注意，在矩阵不可逆时，会返回一个全为 0 的矩阵。
       */

    }, {
      key: "invert",
      value: function invert() {
        var a00 = this.m00;
        var a01 = this.m01;
        var a02 = this.m02;
        var a10 = this.m03;
        var a11 = this.m04;
        var a12 = this.m05;
        var a20 = this.m06;
        var a21 = this.m07;
        var a22 = this.m08;
        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

        var det = a00 * b01 + a01 * b11 + a02 * b21;

        if (det === 0) {
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
          return this;
        }

        det = 1.0 / det;
        this.m00 = b01 * det;
        this.m01 = (-a22 * a01 + a02 * a21) * det;
        this.m02 = (a12 * a01 - a02 * a11) * det;
        this.m03 = b11 * det;
        this.m04 = (a22 * a00 - a02 * a20) * det;
        this.m05 = (-a12 * a00 + a02 * a10) * det;
        this.m06 = b21 * det;
        this.m07 = (-a21 * a00 + a01 * a20) * det;
        this.m08 = (a11 * a00 - a01 * a10) * det;
        return this;
      }
      /**
       * 计算当前矩阵的行列式。
       * @return 当前矩阵的行列式。
       */

    }, {
      key: "determinant",
      value: function determinant() {
        var a00 = this.m00;
        var a01 = this.m01;
        var a02 = this.m02;
        var a10 = this.m03;
        var a11 = this.m04;
        var a12 = this.m05;
        var a20 = this.m06;
        var a21 = this.m07;
        var a22 = this.m08;
        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
      }
      /**
       * @zh 矩阵加法。将当前矩阵与指定矩阵的相加，结果返回给当前矩阵。
       * @param mat 相加的矩阵
       */

    }, {
      key: "add",
      value: function add(mat) {
        this.m00 = this.m00 + mat.m00;
        this.m01 = this.m01 + mat.m01;
        this.m02 = this.m02 + mat.m02;
        this.m03 = this.m03 + mat.m03;
        this.m04 = this.m04 + mat.m04;
        this.m05 = this.m05 + mat.m05;
        this.m06 = this.m06 + mat.m06;
        this.m07 = this.m07 + mat.m07;
        this.m08 = this.m08 + mat.m08;
        return this;
      }
      /**
       * @zh 计算矩阵减法。将当前矩阵减去指定矩阵的结果赋值给当前矩阵。
       * @param mat 减数矩阵。
       */

    }, {
      key: "subtract",
      value: function subtract(mat) {
        this.m00 = this.m00 - mat.m00;
        this.m01 = this.m01 - mat.m01;
        this.m02 = this.m02 - mat.m02;
        this.m03 = this.m03 - mat.m03;
        this.m04 = this.m04 - mat.m04;
        this.m05 = this.m05 - mat.m05;
        this.m06 = this.m06 - mat.m06;
        this.m07 = this.m07 - mat.m07;
        this.m08 = this.m08 - mat.m08;
        return this;
      }
      /**
       * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
       * @param mat 指定的矩阵。
       */

    }, {
      key: "multiply",
      value: function multiply(mat) {
        var a00 = this.m00,
            a01 = this.m01,
            a02 = this.m02,
            a10 = this.m03,
            a11 = this.m04,
            a12 = this.m05,
            a20 = this.m06,
            a21 = this.m07,
            a22 = this.m08;
        var b00 = mat.m00,
            b01 = mat.m01,
            b02 = mat.m02;
        var b10 = mat.m03,
            b11 = mat.m04,
            b12 = mat.m05;
        var b20 = mat.m06,
            b21 = mat.m07,
            b22 = mat.m08;
        this.m00 = b00 * a00 + b01 * a10 + b02 * a20;
        this.m01 = b00 * a01 + b01 * a11 + b02 * a21;
        this.m02 = b00 * a02 + b01 * a12 + b02 * a22;
        this.m03 = b10 * a00 + b11 * a10 + b12 * a20;
        this.m04 = b10 * a01 + b11 * a11 + b12 * a21;
        this.m05 = b10 * a02 + b11 * a12 + b12 * a22;
        this.m06 = b20 * a00 + b21 * a10 + b22 * a20;
        this.m07 = b20 * a01 + b21 * a11 + b22 * a21;
        this.m08 = b20 * a02 + b21 * a12 + b22 * a22;
        return this;
      }
      /**
       * @zh 矩阵数乘。将当前矩阵与指定标量的数乘结果赋值给当前矩阵。
       * @param scalar 指定的标量。
       */

    }, {
      key: "multiplyScalar",
      value: function multiplyScalar(scalar) {
        this.m00 = this.m00 * scalar;
        this.m01 = this.m01 * scalar;
        this.m02 = this.m02 * scalar;
        this.m03 = this.m03 * scalar;
        this.m04 = this.m04 * scalar;
        this.m05 = this.m05 * scalar;
        this.m06 = this.m06 * scalar;
        this.m07 = this.m07 * scalar;
        this.m08 = this.m08 * scalar;
        return this;
      }
      /**
       * @zh 将当前矩阵左乘缩放矩阵的结果赋值给当前矩阵，缩放矩阵由各个轴的缩放给出。
       * @param vec 各个轴的缩放。
       */

    }, {
      key: "scale",
      value: function scale(vec) {
        var x = vec.x,
            y = vec.y;
        this.m00 = x * this.m00;
        this.m01 = x * this.m01;
        this.m02 = x * this.m02;
        this.m03 = y * this.m03;
        this.m04 = y * this.m04;
        this.m05 = y * this.m05;
        this.m06 = this.m06;
        this.m07 = this.m07;
        this.m08 = this.m08;
        return this;
      }
      /**
       * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
       * @param mat 矩阵
       * @param rad 旋转角度（弧度制）
       */

    }, {
      key: "rotate",
      value: function rotate(rad) {
        var a00 = this.m00;
        var a01 = this.m01;
        var a02 = this.m02;
        var a10 = this.m03;
        var a11 = this.m04;
        var a12 = this.m05;
        var a20 = this.m06;
        var a21 = this.m07;
        var a22 = this.m08;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        this.m00 = c * a00 + s * a10;
        this.m01 = c * a01 + s * a11;
        this.m02 = c * a02 + s * a12;
        this.m03 = c * a10 - s * a00;
        this.m04 = c * a11 - s * a01;
        this.m05 = c * a12 - s * a02;
        this.m06 = a20;
        this.m07 = a21;
        this.m08 = a22;
        return this;
      }
      /**
       * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
       * @param q 四元数表示的旋转变换。
       * @returns this
       */

    }, {
      key: "fromQuat",
      value: function fromQuat(q) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var yx = y * x2;
        var yy = y * y2;
        var zx = z * x2;
        var zy = z * y2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        this.m00 = 1 - yy - zz;
        this.m03 = yx - wz;
        this.m06 = zx + wy;
        this.m01 = yx + wz;
        this.m04 = 1 - xx - zz;
        this.m07 = zy - wx;
        this.m02 = zx - wy;
        this.m05 = zy + wx;
        this.m08 = 1 - xx - yy;
        return this;
      }
    }]);

    return Mat3;
  }(_valueType.ValueType);

  _exports.Mat3 = Mat3;
  Mat3.IDENTITY = Object.freeze(new Mat3());
  var v3_1 = new _vec.Vec3();
  var v3_2 = new _vec.Vec3();

  _class.CCClass.fastDefine('cc.Mat3', Mat3, {
    m00: 1,
    m01: 0,
    m02: 0,
    m03: 0,
    m04: 1,
    m05: 0,
    m06: 0,
    m07: 0,
    m08: 1
  });

  _globalExports.legacyCC.Mat3 = Mat3;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9tYXQzLnRzIl0sIm5hbWVzIjpbIk1hdDMiLCJhIiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTA0IiwibTA1IiwibTA2IiwibTA3IiwibTA4Iiwib3V0IiwibTEwIiwibTExIiwibTEyIiwibTIwIiwibTIxIiwibTIyIiwiYTAxIiwiYTAyIiwiYTEyIiwiYTAwIiwiYTEwIiwiYTExIiwiYTIwIiwiYTIxIiwiYTIyIiwiYjAxIiwiYjExIiwiYjIxIiwiZGV0IiwiYiIsImIwMCIsImIwMiIsImIxMCIsImIxMiIsImIyMCIsImIyMiIsIm0wOSIsInYiLCJ0cmFuc2Zvcm0iLCJ4IiwieSIsInJhZCIsInMiLCJNYXRoIiwic2luIiwiYyIsImNvcyIsInZpZXciLCJ1cCIsIlZlYzMiLCJsZW5ndGhTcXIiLCJFUFNJTE9OIiwiaWRlbnRpdHkiLCJVTklUX1kiLCJub3JtYWxpemUiLCJ2M18xIiwiY3Jvc3MiLCJ2M18yIiwic2V0IiwieiIsInEiLCJ3IiwieDIiLCJ5MiIsInoyIiwieHgiLCJ5eCIsInl5IiwiengiLCJ6eSIsInp6Iiwid3giLCJ3eSIsInd6IiwiYTAzIiwiYTEzIiwiYTIzIiwiYTMwIiwiYTMxIiwibTEzIiwiYTMyIiwibTE0IiwiYTMzIiwibTE1IiwiYjAzIiwiYjA0IiwiYjA1IiwiYjA2IiwiYjA3IiwiYjA4IiwiYjA5IiwibSIsIm9mcyIsImFyciIsInNjYWxlIiwiZXBzaWxvbiIsImFicyIsIm1heCIsInQiLCJvdGhlciIsIm1hdCIsInNjYWxhciIsInZlYyIsIlZhbHVlVHlwZSIsIklERU5USVRZIiwiT2JqZWN0IiwiZnJlZXplIiwiQ0NDbGFzcyIsImZhc3REZWZpbmUiLCJsZWdhY3lDQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0E7OztBQUdBO01BQ2FBLEk7Ozs7OztBQUlUOzs7NEJBRzZDQyxDLEVB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QUZtQjtBQUVoQkMsSUFBQUEsR0FBRyxFQUFFLENBRlc7QUFHaENDLElBQUFBLEdBQUcsRUFBRSxDQUgyQjtBQUd4QkMsSUFBQUEsR0FBRyxFQUFFLENBSG1CO0FBR2hCQyxJQUFBQSxHQUFHLEVBQUU7QUFIVyxHQUFwQzs7QUFLQXFHLDBCQUFTL0csSUFBVCxHQUFnQkEsSUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvbWF0aFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9kYXRhL2NsYXNzJztcclxuaW1wb3J0IHsgVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmFsdWUtdHlwZSc7XHJcbmltcG9ydCB7IFF1YXQgfSBmcm9tICcuL3F1YXQnO1xyXG5pbXBvcnQgeyBJTWF0M0xpa2UsIElNYXQ0TGlrZSwgSVF1YXRMaWtlLCBJVmVjMkxpa2UsIElWZWMzTGlrZSB9IGZyb20gJy4vdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBFUFNJTE9OIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuL3ZlYzMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiDooajnpLrkuInnu7TvvIgzeDPvvInnn6npmLXjgIJcclxuICovXHJcbi8vIHRzbGludDpkaXNhYmxlOm9uZS12YXJpYWJsZS1wZXItZGVjbGFyYXRpb25cclxuZXhwb3J0IGNsYXNzIE1hdDMgZXh0ZW5kcyBWYWx1ZVR5cGUge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgSURFTlRJVFkgPSBPYmplY3QuZnJlZXplKG5ldyBNYXQzKCkpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiOt+W+l+aMh+WumuefqemYteeahOaLt+i0nVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChhOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDMoXHJcbiAgICAgICAgICAgIGEubTAwLCBhLm0wMSwgYS5tMDIsXHJcbiAgICAgICAgICAgIGEubTAzLCBhLm0wNCwgYS5tMDUsXHJcbiAgICAgICAgICAgIGEubTA2LCBhLm0wNywgYS5tMDgsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlpI3liLbnm67moIfnn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGEubTAwO1xyXG4gICAgICAgIG91dC5tMDEgPSBhLm0wMTtcclxuICAgICAgICBvdXQubTAyID0gYS5tMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEubTAzO1xyXG4gICAgICAgIG91dC5tMDQgPSBhLm0wNDtcclxuICAgICAgICBvdXQubTA1ID0gYS5tMDU7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGEubTA2O1xyXG4gICAgICAgIG91dC5tMDcgPSBhLm0wNztcclxuICAgICAgICBvdXQubTA4ID0gYS5tMDg7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7nn6npmLXlgLxcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gIChcclxuICAgICAgICBvdXQ6IE91dCxcclxuICAgICAgICBtMDA6IG51bWJlciwgbTAxOiBudW1iZXIsIG0wMjogbnVtYmVyLFxyXG4gICAgICAgIG0xMDogbnVtYmVyLCBtMTE6IG51bWJlciwgbTEyOiBudW1iZXIsXHJcbiAgICAgICAgbTIwOiBudW1iZXIsIG0yMTogbnVtYmVyLCBtMjI6IG51bWJlcixcclxuICAgICkge1xyXG4gICAgICAgIG91dC5tMDAgPSBtMDA7IG91dC5tMDEgPSBtMDE7IG91dC5tMDIgPSBtMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IG0xMDsgb3V0Lm0wNCA9IG0xMTsgb3V0Lm0wNSA9IG0xMjtcclxuICAgICAgICBvdXQubTA2ID0gbTIwOyBvdXQubTA3ID0gbTIxOyBvdXQubTA4ID0gbTIyO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG55uu5qCH6LWL5YC85Li65Y2V5L2N55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaWRlbnRpdHkgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IDE7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IDE7XHJcbiAgICAgICAgb3V0Lm0wNSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOCA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDovaznva7nn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc3Bvc2UgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXHJcbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xyXG4gICAgICAgICAgICBjb25zdCBhMDEgPSBhLm0wMTtcclxuICAgICAgICAgICAgY29uc3QgYTAyID0gYS5tMDI7XHJcbiAgICAgICAgICAgIGNvbnN0IGExMiA9IGEubTA1O1xyXG4gICAgICAgICAgICBvdXQubTAxID0gYS5tMDM7XHJcbiAgICAgICAgICAgIG91dC5tMDIgPSBhLm0wNjtcclxuICAgICAgICAgICAgb3V0Lm0wMyA9IGEwMTtcclxuICAgICAgICAgICAgb3V0Lm0wNSA9IGEubTA3O1xyXG4gICAgICAgICAgICBvdXQubTA2ID0gYTAyO1xyXG4gICAgICAgICAgICBvdXQubTA3ID0gYTEyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC5tMDAgPSBhLm0wMDtcclxuICAgICAgICAgICAgb3V0Lm0wMSA9IGEubTAzO1xyXG4gICAgICAgICAgICBvdXQubTAyID0gYS5tMDY7XHJcbiAgICAgICAgICAgIG91dC5tMDMgPSBhLm0wMTtcclxuICAgICAgICAgICAgb3V0Lm0wNCA9IGEubTA0O1xyXG4gICAgICAgICAgICBvdXQubTA1ID0gYS5tMDc7XHJcbiAgICAgICAgICAgIG91dC5tMDYgPSBhLm0wMjtcclxuICAgICAgICAgICAgb3V0Lm0wNyA9IGEubTA1O1xyXG4gICAgICAgICAgICBvdXQubTA4ID0gYS5tMDg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOefqemYteaxgumAhu+8jOazqOaEj++8jOWcqOefqemYteS4jeWPr+mAhuaXtu+8jOS8mui/lOWbnuS4gOS4quWFqOS4uiAwIOeahOefqemYteOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGludmVydCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IGEubTAwOyBjb25zdCBhMDEgPSBhLm0wMTsgY29uc3QgYTAyID0gYS5tMDI7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDM7IGNvbnN0IGExMSA9IGEubTA0OyBjb25zdCBhMTIgPSBhLm0wNTtcclxuICAgICAgICBjb25zdCBhMjAgPSBhLm0wNjsgY29uc3QgYTIxID0gYS5tMDc7IGNvbnN0IGEyMiA9IGEubTA4O1xyXG5cclxuICAgICAgICBjb25zdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XHJcbiAgICAgICAgY29uc3QgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcclxuICAgICAgICBjb25zdCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcclxuICAgICAgICBsZXQgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG5cclxuICAgICAgICBpZiAoZGV0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIG91dC5tMDAgPSAwOyBvdXQubTAxID0gMDsgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgICAgIG91dC5tMDMgPSAwOyBvdXQubTA0ID0gMDsgb3V0Lm0wNSA9IDA7XHJcbiAgICAgICAgICAgIG91dC5tMDYgPSAwOyBvdXQubTA3ID0gMDsgb3V0Lm0wOCA9IDA7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IGIwMSAqIGRldDtcclxuICAgICAgICBvdXQubTAxID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDIgPSAoYTEyICogYTAxIC0gYTAyICogYTExKSAqIGRldDtcclxuICAgICAgICBvdXQubTAzID0gYjExICogZGV0O1xyXG4gICAgICAgIG91dC5tMDQgPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcclxuICAgICAgICBvdXQubTA1ID0gKC1hMTIgKiBhMDAgKyBhMDIgKiBhMTApICogZGV0O1xyXG4gICAgICAgIG91dC5tMDYgPSBiMjEgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wNyA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcclxuICAgICAgICBvdXQubTA4ID0gKGExMSAqIGEwMCAtIGEwMSAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXooYzliJflvI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBkZXRlcm1pbmFudCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAoYTogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjtcclxuICAgICAgICBjb25zdCBhMTAgPSBhLm0wMzsgY29uc3QgYTExID0gYS5tMDQ7IGNvbnN0IGExMiA9IGEubTA1O1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IGEubTA2OyBjb25zdCBhMjEgPSBhLm0wNzsgY29uc3QgYTIyID0gYS5tMDg7XHJcblxyXG4gICAgICAgIHJldHVybiBhMDAgKiAoYTIyICogYTExIC0gYTEyICogYTIxKSArIGEwMSAqICgtYTIyICogYTEwICsgYTEyICogYTIwKSArIGEwMiAqIChhMjEgKiBhMTAgLSBhMTEgKiBhMjApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOefqemYteS5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBjb25zdCBhMDAgPSBhLm0wMDsgY29uc3QgYTAxID0gYS5tMDE7IGNvbnN0IGEwMiA9IGEubTAyO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IGEubTAzOyBjb25zdCBhMTEgPSBhLm0wNDsgY29uc3QgYTEyID0gYS5tMDU7XHJcbiAgICAgICAgY29uc3QgYTIwID0gYS5tMDY7IGNvbnN0IGEyMSA9IGEubTA3OyBjb25zdCBhMjIgPSBhLm0wODtcclxuXHJcbiAgICAgICAgY29uc3QgYjAwID0gYi5tMDAsIGIwMSA9IGIubTAxLCBiMDIgPSBiLm0wMjtcclxuICAgICAgICBjb25zdCBiMTAgPSBiLm0wMywgYjExID0gYi5tMDQsIGIxMiA9IGIubTA1O1xyXG4gICAgICAgIGNvbnN0IGIyMCA9IGIubTA2LCBiMjEgPSBiLm0wNywgYjIyID0gYi5tMDg7XHJcblxyXG4gICAgICAgIG91dC5tMDAgPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICBvdXQubTAyID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xyXG5cclxuICAgICAgICBvdXQubTAzID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xyXG4gICAgICAgIG91dC5tMDQgPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcclxuXHJcbiAgICAgICAgb3V0Lm0wNiA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcclxuICAgICAgICBvdXQubTA3ID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgIG91dC5tMDggPSBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjI7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlj5blm5vpmLbnn6npmLXnmoTliY3kuInpmLbvvIzkuI7kuInpmLbnn6npmLXnm7jkuZhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtdWx0aXBseU1hdDQgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IElNYXQ0TGlrZSkge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IGEubTAwOyBjb25zdCBhMDEgPSBhLm0wMTsgY29uc3QgYTAyID0gYS5tMDI7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDM7IGNvbnN0IGExMSA9IGEubTA0OyBjb25zdCBhMTIgPSBhLm0wNTtcclxuICAgICAgICBjb25zdCBhMjAgPSBhLm0wNjsgY29uc3QgYTIxID0gYS5tMDc7IGNvbnN0IGEyMiA9IGEubTA4O1xyXG5cclxuICAgICAgICBjb25zdCBiMDAgPSBiLm0wMCwgYjAxID0gYi5tMDEsIGIwMiA9IGIubTAyO1xyXG4gICAgICAgIGNvbnN0IGIxMCA9IGIubTA0LCBiMTEgPSBiLm0wNSwgYjEyID0gYi5tMDY7XHJcbiAgICAgICAgY29uc3QgYjIwID0gYi5tMDgsIGIyMSA9IGIubTA5LCBiMjIgPSBiLm0xMDtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICBvdXQubTAxID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xyXG4gICAgICAgIG91dC5tMDIgPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XHJcblxyXG4gICAgICAgIG91dC5tMDMgPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcclxuICAgICAgICBvdXQubTA1ID0gYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyO1xyXG5cclxuICAgICAgICBvdXQubTA2ID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgIG91dC5tMDcgPSBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjE7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMjtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeWPmOaNolxyXG4gICAgICogQGRlcHJlY2F0ZWQg5bCG5ZyoIDEuMiDnp7vpmaTvvIzor7fovaznlKggYE1hdDMudHJhbnNmb3JtYCDmlrnms5XjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zyb208T3V0IGV4dGVuZHMgSU1hdDNMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIE1hdDMudHJhbnNmb3JtKG91dCwgYSwgdik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5Y+Y5o2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCB2OiBWZWNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjtcclxuICAgICAgICBjb25zdCBhMTAgPSBhLm0wMzsgY29uc3QgYTExID0gYS5tMDQ7IGNvbnN0IGExMiA9IGEubTA1O1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IGEubTA2OyBjb25zdCBhMjEgPSBhLm0wNzsgY29uc3QgYTIyID0gYS5tMDg7XHJcbiAgICAgICAgY29uc3QgeCA9IHYueCwgeSA9IHYueTtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IGEwMDtcclxuICAgICAgICBvdXQubTAxID0gYTAxO1xyXG4gICAgICAgIG91dC5tMDIgPSBhMDI7XHJcblxyXG4gICAgICAgIG91dC5tMDMgPSBhMTA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGExMTtcclxuICAgICAgICBvdXQubTA1ID0gYTEyO1xyXG5cclxuICAgICAgICBvdXQubTA2ID0geCAqIGEwMCArIHkgKiBhMTAgKyBhMjA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IHggKiBhMDEgKyB5ICogYTExICsgYTIxO1xyXG4gICAgICAgIG91dC5tMDggPSB4ICogYTAyICsgeSAqIGExMiArIGEyMjtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOe8qeaUvuWPmOaNolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNjYWxlIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCB2OiBWZWNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHYueCwgeSA9IHYueTtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IHggKiBhLm0wMDtcclxuICAgICAgICBvdXQubTAxID0geCAqIGEubTAxO1xyXG4gICAgICAgIG91dC5tMDIgPSB4ICogYS5tMDI7XHJcblxyXG4gICAgICAgIG91dC5tMDMgPSB5ICogYS5tMDM7XHJcbiAgICAgICAgb3V0Lm0wNCA9IHkgKiBhLm0wNDtcclxuICAgICAgICBvdXQubTA1ID0geSAqIGEubTA1O1xyXG5cclxuICAgICAgICBvdXQubTA2ID0gYS5tMDY7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEubTA3O1xyXG4gICAgICAgIG91dC5tMDggPSBhLm0wODtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOaXi+i9rOWPmOaNolxyXG4gICAgICogQHBhcmFtIHJhZCDml4vovazlvKfluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGUgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjtcclxuICAgICAgICBjb25zdCBhMTAgPSBhLm0wMzsgY29uc3QgYTExID0gYS5tMDQ7IGNvbnN0IGExMiA9IGEubTA1O1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IGEubTA2OyBjb25zdCBhMjEgPSBhLm0wNzsgY29uc3QgYTIyID0gYS5tMDg7XHJcblxyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpO1xyXG5cclxuICAgICAgICBvdXQubTAwID0gYyAqIGEwMCArIHMgKiBhMTA7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGMgKiBhMDEgKyBzICogYTExO1xyXG4gICAgICAgIG91dC5tMDIgPSBjICogYTAyICsgcyAqIGExMjtcclxuXHJcbiAgICAgICAgb3V0Lm0wMyA9IGMgKiBhMTAgLSBzICogYTAwO1xyXG4gICAgICAgIG91dC5tMDQgPSBjICogYTExIC0gcyAqIGEwMTtcclxuICAgICAgICBvdXQubTA1ID0gYyAqIGExMiAtIHMgKiBhMDI7XHJcblxyXG4gICAgICAgIG91dC5tMDYgPSBhMjA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEyMTtcclxuICAgICAgICBvdXQubTA4ID0gYTIyO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Y+W5Zub6Zi255+p6Zi155qE5YmN5LiJ6Zi2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbU1hdDQgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBJTWF0NExpa2UpIHtcclxuICAgICAgICBvdXQubTAwID0gYS5tMDA7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGEubTAxO1xyXG4gICAgICAgIG91dC5tMDIgPSBhLm0wMjtcclxuICAgICAgICBvdXQubTAzID0gYS5tMDQ7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGEubTA1O1xyXG4gICAgICAgIG91dC5tMDUgPSBhLm0wNjtcclxuICAgICAgICBvdXQubTA2ID0gYS5tMDg7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEubTA5O1xyXG4gICAgICAgIG91dC5tMDggPSBhLm0xMDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruinhuWPo+WJjeaWueWQkeWSjOS4iuaWueWQkeiuoeeul+efqemYtVxyXG4gICAgICogQHBhcmFtIHZpZXcg6KeG5Y+j6Z2i5ZCR55qE5YmN5pa55ZCR77yM5b+F6aG75b2S5LiA5YyWXHJcbiAgICAgKiBAcGFyYW0gdXAg6KeG5Y+j55qE5LiK5pa55ZCR77yM5b+F6aG75b2S5LiA5YyW77yM6buY6K6k5Li6ICgwLCAxLCAwKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21WaWV3VXAgPE91dCBleHRlbmRzIElNYXQzTGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2aWV3OiBWZWNMaWtlLCB1cD86IFZlYzMpIHtcclxuICAgICAgICBpZiAoVmVjMy5sZW5ndGhTcXIodmlldykgPCBFUFNJTE9OICogRVBTSUxPTikge1xyXG4gICAgICAgICAgICBNYXQzLmlkZW50aXR5KG91dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cCA9IHVwIHx8IFZlYzMuVU5JVF9ZO1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzXzEsIFZlYzMuY3Jvc3ModjNfMSwgdXAsIHZpZXcpKTtcclxuXHJcbiAgICAgICAgaWYgKFZlYzMubGVuZ3RoU3FyKHYzXzEpIDwgRVBTSUxPTiAqIEVQU0lMT04pIHtcclxuICAgICAgICAgICAgTWF0My5pZGVudGl0eShvdXQpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVmVjMy5jcm9zcyh2M18yLCB2aWV3LCB2M18xKTtcclxuICAgICAgICBNYXQzLnNldChcclxuICAgICAgICAgICAgb3V0LFxyXG4gICAgICAgICAgICB2M18xLngsIHYzXzEueSwgdjNfMS56LFxyXG4gICAgICAgICAgICB2M18yLngsIHYzXzIueSwgdjNfMi56LFxyXG4gICAgICAgICAgICB2aWV3LngsIHZpZXcueSwgdmlldy56LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5L2N56e755+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVRyYW5zbGF0aW9uIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIG91dC5tMDAgPSAxO1xyXG4gICAgICAgIG91dC5tMDEgPSAwO1xyXG4gICAgICAgIG91dC5tMDIgPSAwO1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSAxO1xyXG4gICAgICAgIG91dC5tMDUgPSAwO1xyXG4gICAgICAgIG91dC5tMDYgPSB2Lng7XHJcbiAgICAgICAgb3V0Lm0wNyA9IHYueTtcclxuICAgICAgICBvdXQubTA4ID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+e8qeaUvuefqemYtVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21TY2FsaW5nIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIG91dC5tMDAgPSB2Lng7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcblxyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSB2Lnk7XHJcbiAgICAgICAgb3V0Lm0wNSA9IDA7XHJcblxyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5peL6L2s55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVJvdGF0aW9uIDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSwgYyA9IE1hdGguY29zKHJhZCk7XHJcblxyXG4gICAgICAgIG91dC5tMDAgPSBjO1xyXG4gICAgICAgIG91dC5tMDEgPSBzO1xyXG4gICAgICAgIG91dC5tMDIgPSAwO1xyXG5cclxuICAgICAgICBvdXQubTAzID0gLXM7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGM7XHJcbiAgICAgICAgb3V0Lm0wNSA9IDA7XHJcblxyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5qC55o2u5Zub5YWD5pWw5peL6L2s5L+h5oGv6K6h566X55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVF1YXQgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBxOiBJUXVhdExpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xyXG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XHJcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcclxuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xyXG5cclxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcclxuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcclxuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcclxuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcclxuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcclxuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcclxuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcclxuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IDEgLSB5eSAtIHp6O1xyXG4gICAgICAgIG91dC5tMDMgPSB5eCAtIHd6O1xyXG4gICAgICAgIG91dC5tMDYgPSB6eCArIHd5O1xyXG5cclxuICAgICAgICBvdXQubTAxID0geXggKyB3ejtcclxuICAgICAgICBvdXQubTA0ID0gMSAtIHh4IC0geno7XHJcbiAgICAgICAgb3V0Lm0wNyA9IHp5IC0gd3g7XHJcblxyXG4gICAgICAgIG91dC5tMDIgPSB6eCAtIHd5O1xyXG4gICAgICAgIG91dC5tMDUgPSB6eSArIHd4O1xyXG4gICAgICAgIG91dC5tMDggPSAxIC0geHggLSB5eTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorqHnrpfmjIflrprlm5vnu7Tnn6npmLXnmoTpgIbovaznva7kuInnu7Tnn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnNlVHJhbnNwb3NlTWF0NCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IElNYXQ0TGlrZSkge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IGEubTAwLCBhMDEgPSBhLm0wMSwgYTAyID0gYS5tMDIsIGEwMyA9IGEubTAzLFxyXG4gICAgICAgICAgICBhMTAgPSBhLm0wNCwgYTExID0gYS5tMDUsIGExMiA9IGEubTA2LCBhMTMgPSBhLm0wNyxcclxuICAgICAgICAgICAgYTIwID0gYS5tMDgsIGEyMSA9IGEubTA5LCBhMjIgPSBhLm0xMCwgYTIzID0gYS5tMTEsXHJcbiAgICAgICAgICAgIGEzMCA9IGEubTEyLCBhMzEgPSBhLm0xMywgYTMyID0gYS5tMTQsIGEzMyA9IGEubTE1O1xyXG5cclxuICAgICAgICBjb25zdCBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xyXG4gICAgICAgIGNvbnN0IGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMjtcclxuICAgICAgICBjb25zdCBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xyXG4gICAgICAgIGNvbnN0IGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjtcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxyXG4gICAgICAgIGxldCBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XHJcblxyXG4gICAgICAgIGlmICghZGV0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcblxyXG4gICAgICAgIG91dC5tMDAgPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcclxuICAgICAgICBvdXQubTAxID0gKGExMiAqIGIwOCAtIGExMCAqIGIxMSAtIGExMyAqIGIwNykgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wMiA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xyXG5cclxuICAgICAgICBvdXQubTAzID0gKGEwMiAqIGIxMCAtIGEwMSAqIGIxMSAtIGEwMyAqIGIwOSkgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wNCA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDUgPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcclxuXHJcbiAgICAgICAgb3V0Lm0wNiA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDcgPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcclxuICAgICAgICBvdXQubTA4ID0gKGEzMCAqIGIwNCAtIGEzMSAqIGIwMiArIGEzMyAqIGIwMCkgKiBkZXQ7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg55+p6Zi16L2s5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOWGheeahOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIG06IElNYXQzTGlrZSwgb2ZzID0gMCkge1xyXG4gICAgICAgIG91dFtvZnMgKyAwXSA9IG0ubTAwO1xyXG4gICAgICAgIG91dFtvZnMgKyAxXSA9IG0ubTAxO1xyXG4gICAgICAgIG91dFtvZnMgKyAyXSA9IG0ubTAyO1xyXG4gICAgICAgIG91dFtvZnMgKyAzXSA9IG0ubTAzO1xyXG4gICAgICAgIG91dFtvZnMgKyA0XSA9IG0ubTA0O1xyXG4gICAgICAgIG91dFtvZnMgKyA1XSA9IG0ubTA1O1xyXG4gICAgICAgIG91dFtvZnMgKyA2XSA9IG0ubTA2O1xyXG4gICAgICAgIG91dFtvZnMgKyA3XSA9IG0ubTA3O1xyXG4gICAgICAgIG91dFtvZnMgKyA4XSA9IG0ubTA4O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pWw57uE6L2s55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcclxuICAgICAgICBvdXQubTAwID0gYXJyW29mcyArIDBdO1xyXG4gICAgICAgIG91dC5tMDEgPSBhcnJbb2ZzICsgMV07XHJcbiAgICAgICAgb3V0Lm0wMiA9IGFycltvZnMgKyAyXTtcclxuICAgICAgICBvdXQubTAzID0gYXJyW29mcyArIDNdO1xyXG4gICAgICAgIG91dC5tMDQgPSBhcnJbb2ZzICsgNF07XHJcbiAgICAgICAgb3V0Lm0wNSA9IGFycltvZnMgKyA1XTtcclxuICAgICAgICBvdXQubTA2ID0gYXJyW29mcyArIDZdO1xyXG4gICAgICAgIG91dC5tMDcgPSBhcnJbb2ZzICsgN107XHJcbiAgICAgICAgb3V0Lm0wOCA9IGFycltvZnMgKyA4XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOefqemYteWKoOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGFkZCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGEubTAwICsgYi5tMDA7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGEubTAxICsgYi5tMDE7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEubTAyICsgYi5tMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEubTAzICsgYi5tMDM7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGEubTA0ICsgYi5tMDQ7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGEubTA1ICsgYi5tMDU7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGEubTA2ICsgYi5tMDY7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEubTA3ICsgYi5tMDc7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEubTA4ICsgYi5tMDg7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDnn6npmLXlh4/ms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzdWJ0cmFjdCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGEubTAwIC0gYi5tMDA7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGEubTAxIC0gYi5tMDE7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEubTAyIC0gYi5tMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEubTAzIC0gYi5tMDM7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGEubTA0IC0gYi5tMDQ7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGEubTA1IC0gYi5tMDU7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGEubTA2IC0gYi5tMDY7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEubTA3IC0gYi5tMDc7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEubTA4IC0gYi5tMDg7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXmoIfph4/kuZjms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtdWx0aXBseVNjYWxhciA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGEubTAwICogYjtcclxuICAgICAgICBvdXQubTAxID0gYS5tMDEgKiBiO1xyXG4gICAgICAgIG91dC5tMDIgPSBhLm0wMiAqIGI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEubTAzICogYjtcclxuICAgICAgICBvdXQubTA0ID0gYS5tMDQgKiBiO1xyXG4gICAgICAgIG91dC5tMDUgPSBhLm0wNSAqIGI7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGEubTA2ICogYjtcclxuICAgICAgICBvdXQubTA3ID0gYS5tMDcgKiBiO1xyXG4gICAgICAgIG91dC5tMDggPSBhLm0wOCAqIGI7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJDlhYPntKDnn6npmLXmoIfph4/kuZjliqA6IEEgKyBCICogc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtdWx0aXBseVNjYWxhckFuZEFkZCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGIubTAwICogc2NhbGUgKyBhLm0wMDtcclxuICAgICAgICBvdXQubTAxID0gYi5tMDEgKiBzY2FsZSArIGEubTAxO1xyXG4gICAgICAgIG91dC5tMDIgPSBiLm0wMiAqIHNjYWxlICsgYS5tMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGIubTAzICogc2NhbGUgKyBhLm0wMztcclxuICAgICAgICBvdXQubTA0ID0gYi5tMDQgKiBzY2FsZSArIGEubTA0O1xyXG4gICAgICAgIG91dC5tMDUgPSBiLm0wNSAqIHNjYWxlICsgYS5tMDU7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGIubTA2ICogc2NhbGUgKyBhLm0wNjtcclxuICAgICAgICBvdXQubTA3ID0gYi5tMDcgKiBzY2FsZSArIGEubTA3O1xyXG4gICAgICAgIG91dC5tMDggPSBiLm0wOCAqIHNjYWxlICsgYS5tMDg7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXnrYnku7fliKTmlq1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzdHJpY3RFcXVhbHMgPE91dCBleHRlbmRzIElNYXQzTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIGEubTAwID09PSBiLm0wMCAmJiBhLm0wMSA9PT0gYi5tMDEgJiYgYS5tMDIgPT09IGIubTAyICYmXHJcbiAgICAgICAgICAgIGEubTAzID09PSBiLm0wMyAmJiBhLm0wNCA9PT0gYi5tMDQgJiYgYS5tMDUgPT09IGIubTA1ICYmXHJcbiAgICAgICAgICAgIGEubTA2ID09PSBiLm0wNiAmJiBhLm0wNyA9PT0gYi5tMDcgJiYgYS5tMDggPT09IGIubTA4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaOkumZpOa1rueCueaVsOivr+W3rueahOefqemYtei/keS8vOetieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGVxdWFscyA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDAgLSBiLm0wMCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDApLCBNYXRoLmFicyhiLm0wMCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTAxIC0gYi5tMDEpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTAxKSwgTWF0aC5hYnMoYi5tMDEpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wMiAtIGIubTAyKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wMiksIE1hdGguYWJzKGIubTAyKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDMgLSBiLm0wMykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDMpLCBNYXRoLmFicyhiLm0wMykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTA0IC0gYi5tMDQpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTA0KSwgTWF0aC5hYnMoYi5tMDQpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wNSAtIGIubTA1KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wNSksIE1hdGguYWJzKGIubTA1KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDYgLSBiLm0wNikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDYpLCBNYXRoLmFicyhiLm0wNikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTA3IC0gYi5tMDcpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTA3KSwgTWF0aC5hYnMoYi5tMDcpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wOCAtIGIubTA4KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wOCksIE1hdGguYWJzKGIubTA4KSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDAg5YiX56ysIDAg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wMDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDAg5YiX56ysIDEg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wMTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDAg5YiX56ysIDIg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wMjogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDEg5YiX56ysIDAg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wMzogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDEg5YiX56ysIDEg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wNDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDEg5YiX56ysIDIg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wNTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDIg5YiX56ysIDAg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wNjogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDIg5YiX56ysIDEg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wNzogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDIg5YiX56ysIDIg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIG0wODogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChvdGhlcjogTWF0Myk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIG0wMD86IG51bWJlciwgbTAxPzogbnVtYmVyLCBtMDI/OiBudW1iZXIsXHJcbiAgICAgICAgbTAzPzogbnVtYmVyLCBtMDQ/OiBudW1iZXIsIG0wNT86IG51bWJlcixcclxuICAgICAgICBtMDY/OiBudW1iZXIsIG0wNz86IG51bWJlciwgbTA4PzogbnVtYmVyKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgbTAwOiBudW1iZXIgfCBNYXQzID0gMSwgbTAxOiBudW1iZXIgPSAwLCBtMDI6IG51bWJlciA9IDAsXHJcbiAgICAgICAgbTAzOiBudW1iZXIgPSAwLCBtMDQ6IG51bWJlciA9IDEsIG0wNTogbnVtYmVyID0gMCxcclxuICAgICAgICBtMDY6IG51bWJlciA9IDAsIG0wNzogbnVtYmVyID0gMCwgbTA4OiBudW1iZXIgPSAxICkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtMDAgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubTAwID0gbTAwLm0wMDsgdGhpcy5tMDEgPSBtMDAubTAxOyB0aGlzLm0wMiA9IG0wMC5tMDI7XHJcbiAgICAgICAgICAgIHRoaXMubTAzID0gbTAwLm0wMzsgdGhpcy5tMDQgPSBtMDAubTA0OyB0aGlzLm0wNSA9IG0wMC5tMDU7XHJcbiAgICAgICAgICAgIHRoaXMubTA2ID0gbTAwLm0wNjsgdGhpcy5tMDcgPSBtMDAubTA3OyB0aGlzLm0wOCA9IG0wMC5tMDg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tMDAgPSBtMDA7IHRoaXMubTAxID0gbTAxOyB0aGlzLm0wMiA9IG0wMjtcclxuICAgICAgICAgICAgdGhpcy5tMDMgPSBtMDM7IHRoaXMubTA0ID0gbTA0OyB0aGlzLm0wNSA9IG0wNTtcclxuICAgICAgICAgICAgdGhpcy5tMDYgPSBtMDY7IHRoaXMubTA3ID0gbTA3OyB0aGlzLm0wOCA9IG0wODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5YWL6ZqG5b2T5YmN55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgY29uc3QgdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQzKFxyXG4gICAgICAgICAgICB0Lm0wMCwgdC5tMDEsIHQubTAyLFxyXG4gICAgICAgICAgICB0Lm0wMywgdC5tMDQsIHQubTA1LFxyXG4gICAgICAgICAgICB0Lm0wNiwgdC5tMDcsIHQubTA4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3nn6npmLXkvb/lhbbkuI7mjIflrprnn6npmLXnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6npmLXjgIJcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChvdGhlcjogTWF0Myk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lvZPliY3nn6npmLXmjIflrprlhYPntKDlgLzjgIJcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChtMDA/OiBudW1iZXIsIG0wMT86IG51bWJlciwgbTAyPzogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgbTAzPzogbnVtYmVyLCBtMDQ/OiBudW1iZXIsIG0wNT86IG51bWJlcixcclxuICAgICAgICAgICAgICAgIG0wNj86IG51bWJlciwgbTA3PzogbnVtYmVyLCBtMDg/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKG0wMDogbnVtYmVyIHwgTWF0MyA9IDEsIG0wMTogbnVtYmVyID0gMCwgbTAyOiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICAgICAgbTAzOiBudW1iZXIgPSAwLCBtMDQ6IG51bWJlciA9IDEsIG0wNTogbnVtYmVyID0gMCxcclxuICAgICAgICAgICAgICAgIG0wNjogbnVtYmVyID0gMCwgbTA3OiBudW1iZXIgPSAwLCBtMDg6IG51bWJlciA9IDEgKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBtMDAgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubTAwID0gbTAwLm0wMDsgdGhpcy5tMDEgPSBtMDAubTAxOyB0aGlzLm0wMiA9IG0wMC5tMDI7XHJcbiAgICAgICAgICAgIHRoaXMubTAzID0gbTAwLm0wMzsgdGhpcy5tMDQgPSBtMDAubTA0OyB0aGlzLm0wNSA9IG0wMC5tMDU7XHJcbiAgICAgICAgICAgIHRoaXMubTA2ID0gbTAwLm0wNjsgdGhpcy5tMDcgPSBtMDAubTA3OyB0aGlzLm0wOCA9IG0wMC5tMDg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5tMDAgPSBtMDA7IHRoaXMubTAxID0gbTAxOyB0aGlzLm0wMiA9IG0wMjtcclxuICAgICAgICAgICAgdGhpcy5tMDMgPSBtMDM7IHRoaXMubTA0ID0gbTA0OyB0aGlzLm0wNSA9IG0wNTtcclxuICAgICAgICAgICAgdGhpcy5tMDYgPSBtMDY7IHRoaXMubTA3ID0gbTA3OyB0aGlzLm0wOCA9IG0wODtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yik5pat5b2T5YmN55+p6Zi15piv5ZCm5Zyo6K+v5beu6IyD5Zu05YaF5LiO5oyH5a6a55+p6Zi155u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE55+p6Zi144CCXHJcbiAgICAgKiBAcGFyYW0gZXBzaWxvbiDlhYHorrjnmoTor6/lt67vvIzlupTkuLrpnZ7otJ/mlbDjgIJcclxuICAgICAqIEByZXR1cm4g5Lik55+p6Zi155qE5ZCE5YWD57Sg6YO95YiG5Yir55u4562J5pe26L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMgKG90aGVyOiBNYXQzLCBlcHNpbG9uID0gRVBTSUxPTik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTAwIC0gb3RoZXIubTAwKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wMCksIE1hdGguYWJzKG90aGVyLm0wMCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTAxIC0gb3RoZXIubTAxKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wMSksIE1hdGguYWJzKG90aGVyLm0wMSkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTAyIC0gb3RoZXIubTAyKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wMiksIE1hdGguYWJzKG90aGVyLm0wMikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTAzIC0gb3RoZXIubTAzKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wMyksIE1hdGguYWJzKG90aGVyLm0wMykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTA0IC0gb3RoZXIubTA0KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wNCksIE1hdGguYWJzKG90aGVyLm0wNCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTA1IC0gb3RoZXIubTA1KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wNSksIE1hdGguYWJzKG90aGVyLm0wNSkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTA2IC0gb3RoZXIubTA2KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wNiksIE1hdGguYWJzKG90aGVyLm0wNikpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTA3IC0gb3RoZXIubTA3KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wNyksIE1hdGguYWJzKG90aGVyLm0wNykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMubTA4IC0gb3RoZXIubTA4KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLm0wOCksIE1hdGguYWJzKG90aGVyLm0wOCkpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3nn6npmLXmmK/lkKbkuI7mjIflrprnn6npmLXnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6npmLXjgIJcclxuICAgICAqIEByZXR1cm4g5Lik55+p6Zi155qE5ZCE5YWD57Sg6YO95YiG5Yir55u4562J5pe26L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdHJpY3RFcXVhbHMgKG90aGVyOiBNYXQzKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubTAwID09PSBvdGhlci5tMDAgJiYgdGhpcy5tMDEgPT09IG90aGVyLm0wMSAmJiB0aGlzLm0wMiA9PT0gb3RoZXIubTAyICYmXHJcbiAgICAgICAgICAgIHRoaXMubTAzID09PSBvdGhlci5tMDMgJiYgdGhpcy5tMDQgPT09IG90aGVyLm0wNCAmJiB0aGlzLm0wNSA9PT0gb3RoZXIubTA1ICYmXHJcbiAgICAgICAgICAgIHRoaXMubTA2ID09PSBvdGhlci5tMDYgJiYgdGhpcy5tMDcgPT09IG90aGVyLm0wNyAmJiB0aGlzLm0wOCA9PT0gb3RoZXIubTA4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5b2T5YmN55+p6Zi155qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKiBAcmV0dXJuIOW9k+WJjeefqemYteeahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcgKCkge1xyXG4gICAgICAgIGNvbnN0IHQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiAnW1xcbicgK1xyXG4gICAgICAgICAgICB0Lm0wMCArICcsICcgKyB0Lm0wMSArICcsICcgKyB0Lm0wMiArICcsXFxuJyArXHJcbiAgICAgICAgICAgIHQubTAzICsgJyxcXG4nICsgdC5tMDQgKyAnLCAnICsgdC5tMDUgKyAnLFxcbicgK1xyXG4gICAgICAgICAgICB0Lm0wNiArICcsICcgKyB0Lm0wNyArICcsXFxuJyArIHQubTA4ICsgJ1xcbicgK1xyXG4gICAgICAgICAgICAnXSc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIblvZPliY3nn6npmLXorr7kuLrljZXkvY3nn6npmLXjgIJcclxuICAgICAqIEByZXR1cm4gYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpZGVudGl0eSAoKSB7XHJcbiAgICAgICAgdGhpcy5tMDAgPSAxO1xyXG4gICAgICAgIHRoaXMubTAxID0gMDtcclxuICAgICAgICB0aGlzLm0wMiA9IDA7XHJcbiAgICAgICAgdGhpcy5tMDMgPSAwO1xyXG4gICAgICAgIHRoaXMubTA0ID0gMTtcclxuICAgICAgICB0aGlzLm0wNSA9IDA7XHJcbiAgICAgICAgdGhpcy5tMDYgPSAwO1xyXG4gICAgICAgIHRoaXMubTA3ID0gMDtcclxuICAgICAgICB0aGlzLm0wOCA9IDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5b2T5YmN55+p6Zi155qE6L2s572u55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc3Bvc2UgKCkge1xyXG4gICAgICAgIGNvbnN0IGEwMSA9IHRoaXMubTAxLCBhMDIgPSB0aGlzLm0wMiwgYTEyID0gdGhpcy5tMDU7XHJcbiAgICAgICAgdGhpcy5tMDEgPSB0aGlzLm0wMztcclxuICAgICAgICB0aGlzLm0wMiA9IHRoaXMubTA2O1xyXG4gICAgICAgIHRoaXMubTAzID0gYTAxO1xyXG4gICAgICAgIHRoaXMubTA1ID0gdGhpcy5tMDc7XHJcbiAgICAgICAgdGhpcy5tMDYgPSBhMDI7XHJcbiAgICAgICAgdGhpcy5tMDcgPSBhMTI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5b2T5YmN55+p6Zi155qE6YCG55+p6Zi144CC5rOo5oSP77yM5Zyo55+p6Zi15LiN5Y+v6YCG5pe277yM5Lya6L+U5Zue5LiA5Liq5YWo5Li6IDAg55qE55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbnZlcnQgKCkge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IHRoaXMubTAwOyBjb25zdCBhMDEgPSB0aGlzLm0wMTsgY29uc3QgYTAyID0gdGhpcy5tMDI7XHJcbiAgICAgICAgY29uc3QgYTEwID0gdGhpcy5tMDM7IGNvbnN0IGExMSA9IHRoaXMubTA0OyBjb25zdCBhMTIgPSB0aGlzLm0wNTtcclxuICAgICAgICBjb25zdCBhMjAgPSB0aGlzLm0wNjsgY29uc3QgYTIxID0gdGhpcy5tMDc7IGNvbnN0IGEyMiA9IHRoaXMubTA4O1xyXG5cclxuICAgICAgICBjb25zdCBiMDEgPSBhMjIgKiBhMTEgLSBhMTIgKiBhMjE7XHJcbiAgICAgICAgY29uc3QgYjExID0gLWEyMiAqIGExMCArIGExMiAqIGEyMDtcclxuICAgICAgICBjb25zdCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcclxuICAgICAgICBsZXQgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xyXG5cclxuICAgICAgICBpZiAoZGV0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDApO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICB0aGlzLm0wMCA9IGIwMSAqIGRldDtcclxuICAgICAgICB0aGlzLm0wMSA9ICgtYTIyICogYTAxICsgYTAyICogYTIxKSAqIGRldDtcclxuICAgICAgICB0aGlzLm0wMiA9IChhMTIgKiBhMDEgLSBhMDIgKiBhMTEpICogZGV0O1xyXG4gICAgICAgIHRoaXMubTAzID0gYjExICogZGV0O1xyXG4gICAgICAgIHRoaXMubTA0ID0gKGEyMiAqIGEwMCAtIGEwMiAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDUgPSAoLWExMiAqIGEwMCArIGEwMiAqIGExMCkgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDYgPSBiMjEgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDcgPSAoLWEyMSAqIGEwMCArIGEwMSAqIGEyMCkgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDggPSAoYTExICogYTAwIC0gYTAxICogYTEwKSAqIGRldDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuoeeul+W9k+WJjeefqemYteeahOihjOWIl+W8j+OAglxyXG4gICAgICogQHJldHVybiDlvZPliY3nn6npmLXnmoTooYzliJflvI/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRldGVybWluYW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IHRoaXMubTAwOyBjb25zdCBhMDEgPSB0aGlzLm0wMTsgY29uc3QgYTAyID0gdGhpcy5tMDI7XHJcbiAgICAgICAgY29uc3QgYTEwID0gdGhpcy5tMDM7IGNvbnN0IGExMSA9IHRoaXMubTA0OyBjb25zdCBhMTIgPSB0aGlzLm0wNTtcclxuICAgICAgICBjb25zdCBhMjAgPSB0aGlzLm0wNjsgY29uc3QgYTIxID0gdGhpcy5tMDc7IGNvbnN0IGEyMiA9IHRoaXMubTA4O1xyXG5cclxuICAgICAgICByZXR1cm4gYTAwICogKGEyMiAqIGExMSAtIGExMiAqIGEyMSkgKyBhMDEgKiAoLWEyMiAqIGExMCArIGExMiAqIGEyMCkgKyBhMDIgKiAoYTIxICogYTEwIC0gYTExICogYTIwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXliqDms5XjgILlsIblvZPliY3nn6npmLXkuI7mjIflrprnn6npmLXnmoTnm7jliqDvvIznu5Pmnpzov5Tlm57nu5nlvZPliY3nn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg55u45Yqg55qE55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQgKG1hdDogTWF0Mykge1xyXG4gICAgICAgIHRoaXMubTAwID0gdGhpcy5tMDAgKyBtYXQubTAwO1xyXG4gICAgICAgIHRoaXMubTAxID0gdGhpcy5tMDEgKyBtYXQubTAxO1xyXG4gICAgICAgIHRoaXMubTAyID0gdGhpcy5tMDIgKyBtYXQubTAyO1xyXG4gICAgICAgIHRoaXMubTAzID0gdGhpcy5tMDMgKyBtYXQubTAzO1xyXG4gICAgICAgIHRoaXMubTA0ID0gdGhpcy5tMDQgKyBtYXQubTA0O1xyXG4gICAgICAgIHRoaXMubTA1ID0gdGhpcy5tMDUgKyBtYXQubTA1O1xyXG4gICAgICAgIHRoaXMubTA2ID0gdGhpcy5tMDYgKyBtYXQubTA2O1xyXG4gICAgICAgIHRoaXMubTA3ID0gdGhpcy5tMDcgKyBtYXQubTA3O1xyXG4gICAgICAgIHRoaXMubTA4ID0gdGhpcy5tMDggKyBtYXQubTA4O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+efqemYteWHj+azleOAguWwhuW9k+WJjeefqemYteWHj+WOu+aMh+WumuefqemYteeahOe7k+aenOi1i+WAvOe7meW9k+WJjeefqemYteOAglxyXG4gICAgICogQHBhcmFtIG1hdCDlh4/mlbDnn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN1YnRyYWN0IChtYXQ6IE1hdDMpIHtcclxuICAgICAgICB0aGlzLm0wMCA9IHRoaXMubTAwIC0gbWF0Lm0wMDtcclxuICAgICAgICB0aGlzLm0wMSA9IHRoaXMubTAxIC0gbWF0Lm0wMTtcclxuICAgICAgICB0aGlzLm0wMiA9IHRoaXMubTAyIC0gbWF0Lm0wMjtcclxuICAgICAgICB0aGlzLm0wMyA9IHRoaXMubTAzIC0gbWF0Lm0wMztcclxuICAgICAgICB0aGlzLm0wNCA9IHRoaXMubTA0IC0gbWF0Lm0wNDtcclxuICAgICAgICB0aGlzLm0wNSA9IHRoaXMubTA1IC0gbWF0Lm0wNTtcclxuICAgICAgICB0aGlzLm0wNiA9IHRoaXMubTA2IC0gbWF0Lm0wNjtcclxuICAgICAgICB0aGlzLm0wNyA9IHRoaXMubTA3IC0gbWF0Lm0wNztcclxuICAgICAgICB0aGlzLm0wOCA9IHRoaXMubTA4IC0gbWF0Lm0wODtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXkuZjms5XjgILlsIblvZPliY3nn6npmLXlt6bkuZjmjIflrprnn6npmLXnmoTnu5PmnpzotYvlgLznu5nlvZPliY3nn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg5oyH5a6a55qE55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseSAobWF0OiBNYXQzKSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gdGhpcy5tMDAsIGEwMSA9IHRoaXMubTAxLCBhMDIgPSB0aGlzLm0wMixcclxuICAgICAgICBhMTAgPSB0aGlzLm0wMywgYTExID0gdGhpcy5tMDQsIGExMiA9IHRoaXMubTA1LFxyXG4gICAgICAgIGEyMCA9IHRoaXMubTA2LCBhMjEgPSB0aGlzLm0wNywgYTIyID0gdGhpcy5tMDg7XHJcblxyXG4gICAgICAgIGNvbnN0IGIwMCA9IG1hdC5tMDAsIGIwMSA9IG1hdC5tMDEsIGIwMiA9IG1hdC5tMDI7XHJcbiAgICAgICAgY29uc3QgYjEwID0gbWF0Lm0wMywgYjExID0gbWF0Lm0wNCwgYjEyID0gbWF0Lm0wNTtcclxuICAgICAgICBjb25zdCBiMjAgPSBtYXQubTA2LCBiMjEgPSBtYXQubTA3LCBiMjIgPSBtYXQubTA4O1xyXG5cclxuICAgICAgICB0aGlzLm0wMCA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcclxuICAgICAgICB0aGlzLm0wMSA9IGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMTtcclxuICAgICAgICB0aGlzLm0wMiA9IGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMjtcclxuXHJcbiAgICAgICAgdGhpcy5tMDMgPSBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjA7XHJcbiAgICAgICAgdGhpcy5tMDQgPSBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjE7XHJcbiAgICAgICAgdGhpcy5tMDUgPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XHJcblxyXG4gICAgICAgIHRoaXMubTA2ID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xyXG4gICAgICAgIHRoaXMubTA3ID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xyXG4gICAgICAgIHRoaXMubTA4ID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOefqemYteaVsOS5mOOAguWwhuW9k+WJjeefqemYteS4juaMh+Wumuagh+mHj+eahOaVsOS5mOe7k+aenOi1i+WAvOe7meW9k+WJjeefqemYteOAglxyXG4gICAgICogQHBhcmFtIHNjYWxhciDmjIflrprnmoTmoIfph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG11bHRpcGx5U2NhbGFyIChzY2FsYXI6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubTAwID0gdGhpcy5tMDAgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDEgPSB0aGlzLm0wMSAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wMiA9IHRoaXMubTAyICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTAzID0gdGhpcy5tMDMgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDQgPSB0aGlzLm0wNCAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wNSA9IHRoaXMubTA1ICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTA2ID0gdGhpcy5tMDYgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDcgPSB0aGlzLm0wNyAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wOCA9IHRoaXMubTA4ICogc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeefqemYteW3puS5mOe8qeaUvuefqemYteeahOe7k+aenOi1i+WAvOe7meW9k+WJjeefqemYte+8jOe8qeaUvuefqemYteeUseWQhOS4qui9tOeahOe8qeaUvue7meWHuuOAglxyXG4gICAgICogQHBhcmFtIHZlYyDlkITkuKrovbTnmoTnvKnmlL7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjYWxlICh2ZWM6IFZlYzMpIHtcclxuICAgICAgICBjb25zdCB4ID0gdmVjLngsIHkgPSB2ZWMueTtcclxuXHJcbiAgICAgICAgdGhpcy5tMDAgPSB4ICogdGhpcy5tMDA7XHJcbiAgICAgICAgdGhpcy5tMDEgPSB4ICogdGhpcy5tMDE7XHJcbiAgICAgICAgdGhpcy5tMDIgPSB4ICogdGhpcy5tMDI7XHJcblxyXG4gICAgICAgIHRoaXMubTAzID0geSAqIHRoaXMubTAzO1xyXG4gICAgICAgIHRoaXMubTA0ID0geSAqIHRoaXMubTA0O1xyXG4gICAgICAgIHRoaXMubTA1ID0geSAqIHRoaXMubTA1O1xyXG5cclxuICAgICAgICB0aGlzLm0wNiA9IHRoaXMubTA2O1xyXG4gICAgICAgIHRoaXMubTA3ID0gdGhpcy5tMDc7XHJcbiAgICAgICAgdGhpcy5tMDggPSB0aGlzLm0wODtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIblvZPliY3nn6npmLXlt6bkuZjml4vovaznn6npmLXnmoTnu5PmnpzotYvlgLznu5nlvZPliY3nn6npmLXvvIzml4vovaznn6npmLXnlLHml4vovazovbTlkozml4vovazop5Lluqbnu5nlh7rjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOinkuW6pu+8iOW8p+W6puWItu+8iVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcm90YXRlIChyYWQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IHRoaXMubTAwOyBjb25zdCBhMDEgPSB0aGlzLm0wMTsgY29uc3QgYTAyID0gdGhpcy5tMDI7XHJcbiAgICAgICAgY29uc3QgYTEwID0gdGhpcy5tMDM7IGNvbnN0IGExMSA9IHRoaXMubTA0OyBjb25zdCBhMTIgPSB0aGlzLm0wNTtcclxuICAgICAgICBjb25zdCBhMjAgPSB0aGlzLm0wNjsgY29uc3QgYTIxID0gdGhpcy5tMDc7IGNvbnN0IGEyMiA9IHRoaXMubTA4O1xyXG5cclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MocmFkKTtcclxuXHJcbiAgICAgICAgdGhpcy5tMDAgPSBjICogYTAwICsgcyAqIGExMDtcclxuICAgICAgICB0aGlzLm0wMSA9IGMgKiBhMDEgKyBzICogYTExO1xyXG4gICAgICAgIHRoaXMubTAyID0gYyAqIGEwMiArIHMgKiBhMTI7XHJcblxyXG4gICAgICAgIHRoaXMubTAzID0gYyAqIGExMCAtIHMgKiBhMDA7XHJcbiAgICAgICAgdGhpcy5tMDQgPSBjICogYTExIC0gcyAqIGEwMTtcclxuICAgICAgICB0aGlzLm0wNSA9IGMgKiBhMTIgLSBzICogYTAyO1xyXG5cclxuICAgICAgICB0aGlzLm0wNiA9IGEyMDtcclxuICAgICAgICB0aGlzLm0wNyA9IGEyMTtcclxuICAgICAgICB0aGlzLm0wOCA9IGEyMjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDph43nva7lvZPliY3nn6npmLXnmoTlgLzvvIzkvb/lhbbooajnpLrmjIflrprlm5vlhYPmlbDooajnpLrnmoTml4vovazlj5jmjaLjgIJcclxuICAgICAqIEBwYXJhbSBxIOWbm+WFg+aVsOihqOekuueahOaXi+i9rOWPmOaNouOAglxyXG4gICAgICogQHJldHVybnMgdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZnJvbVF1YXQgKHE6IFF1YXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xyXG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XHJcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcclxuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xyXG5cclxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcclxuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcclxuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcclxuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcclxuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcclxuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcclxuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcclxuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcclxuXHJcbiAgICAgICAgdGhpcy5tMDAgPSAxIC0geXkgLSB6ejtcclxuICAgICAgICB0aGlzLm0wMyA9IHl4IC0gd3o7XHJcbiAgICAgICAgdGhpcy5tMDYgPSB6eCArIHd5O1xyXG5cclxuICAgICAgICB0aGlzLm0wMSA9IHl4ICsgd3o7XHJcbiAgICAgICAgdGhpcy5tMDQgPSAxIC0geHggLSB6ejtcclxuICAgICAgICB0aGlzLm0wNyA9IHp5IC0gd3g7XHJcblxyXG4gICAgICAgIHRoaXMubTAyID0genggLSB3eTtcclxuICAgICAgICB0aGlzLm0wNSA9IHp5ICsgd3g7XHJcbiAgICAgICAgdGhpcy5tMDggPSAxIC0geHggLSB5eTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHYzXzIgPSBuZXcgVmVjMygpO1xyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5NYXQzJywgTWF0Mywge1xyXG4gICAgbTAwOiAxLCBtMDE6IDAsIG0wMjogMCxcclxuICAgIG0wMzogMCwgbTA0OiAxLCBtMDU6IDAsXHJcbiAgICBtMDY6IDAsIG0wNzogMCwgbTA4OiAxLFxyXG59KTtcclxubGVnYWN5Q0MuTWF0MyA9IE1hdDM7XHJcbiJdfQ==