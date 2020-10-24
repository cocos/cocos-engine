(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "./mat3.js", "./quat.js", "./utils.js", "./vec3.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("./mat3.js"), require("./quat.js"), require("./utils.js"), require("./vec3.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.mat3, global.quat, global.utils, global.vec3, global.globalExports);
    global.mat4 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _mat, _quat, _utils, _vec, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.mat4 = mat4;
  _exports.Mat4 = void 0;

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
   * 表示四维（4x4）矩阵。
   */
  // tslint:disable:one-variable-per-declaration
  var Mat4 = /*#__PURE__*/function (_ValueType) {
    _inherits(Mat4, _ValueType);

    _createClass(Mat4, null, [{
      key: "clone",

      /**
       * @zh 获得指定矩阵的拷贝
       */
      value: function clone(a) {
        return new Mat4(a.m00, a.m01, a.m02, a.m03, a.m04, a.m05, a.m06, a.m07, a.m08, a.m09, a.m10, a.m11, a.m12, a.m13, a.m14, a.m15);
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
        out.m09 = a.m09;
        out.m10 = a.m10;
        out.m11 = a.m11;
        out.m12 = a.m12;
        out.m13 = a.m13;
        out.m14 = a.m14;
        out.m15 = a.m15;
        return out;
      }
      /**
       * @zh 设置矩阵值
       */

    }, {
      key: "set",
      value: function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        out.m00 = m00;
        out.m01 = m01;
        out.m02 = m02;
        out.m03 = m03;
        out.m04 = m10;
        out.m05 = m11;
        out.m06 = m12;
        out.m07 = m13;
        out.m08 = m20;
        out.m09 = m21;
        out.m10 = m22;
        out.m11 = m23;
        out.m12 = m30;
        out.m13 = m31;
        out.m14 = m32;
        out.m15 = m33;
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
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
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
          var a01 = a.m01,
              a02 = a.m02,
              a03 = a.m03,
              a12 = a.m06,
              a13 = a.m07,
              a23 = a.m11;
          out.m01 = a.m04;
          out.m02 = a.m08;
          out.m03 = a.m12;
          out.m04 = a01;
          out.m06 = a.m09;
          out.m07 = a.m13;
          out.m08 = a02;
          out.m09 = a12;
          out.m11 = a.m14;
          out.m12 = a03;
          out.m13 = a13;
          out.m14 = a23;
        } else {
          out.m00 = a.m00;
          out.m01 = a.m04;
          out.m02 = a.m08;
          out.m03 = a.m12;
          out.m04 = a.m01;
          out.m05 = a.m05;
          out.m06 = a.m09;
          out.m07 = a.m13;
          out.m08 = a.m02;
          out.m09 = a.m06;
          out.m10 = a.m10;
          out.m11 = a.m14;
          out.m12 = a.m03;
          out.m13 = a.m07;
          out.m14 = a.m11;
          out.m15 = a.m15;
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
        var a03 = a.m03;
        var a10 = a.m04;
        var a11 = a.m05;
        var a12 = a.m06;
        var a13 = a.m07;
        var a20 = a.m08;
        var a21 = a.m09;
        var a22 = a.m10;
        var a23 = a.m11;
        var a30 = a.m12;
        var a31 = a.m13;
        var a32 = a.m14;
        var a33 = a.m15;
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
          out.m09 = 0;
          out.m10 = 0;
          out.m11 = 0;
          out.m12 = 0;
          out.m13 = 0;
          out.m14 = 0;
          out.m15 = 0;
          return out;
        }

        det = 1.0 / det;
        out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
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
        var a03 = a.m03;
        var a10 = a.m04;
        var a11 = a.m05;
        var a12 = a.m06;
        var a13 = a.m07;
        var a20 = a.m08;
        var a21 = a.m09;
        var a22 = a.m10;
        var a23 = a.m11;
        var a30 = a.m12;
        var a31 = a.m13;
        var a32 = a.m14;
        var a33 = a.m15;
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

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
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
        var a03 = a.m03;
        var a10 = a.m04;
        var a11 = a.m05;
        var a12 = a.m06;
        var a13 = a.m07;
        var a20 = a.m08;
        var a21 = a.m09;
        var a22 = a.m10;
        var a23 = a.m11;
        var a30 = a.m12;
        var a31 = a.m13;
        var a32 = a.m14;
        var a33 = a.m15; // Cache only the current line of the second matrix

        var b0 = b.m00,
            b1 = b.m01,
            b2 = b.m02,
            b3 = b.m03;
        out.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b.m04;
        b1 = b.m05;
        b2 = b.m06;
        b3 = b.m07;
        out.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b.m08;
        b1 = b.m09;
        b2 = b.m10;
        b3 = b.m11;
        out.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b.m12;
        b1 = b.m13;
        b2 = b.m14;
        b3 = b.m15;
        out.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入变换
       */

    }, {
      key: "transform",
      value: function transform(out, a, v) {
        var x = v.x,
            y = v.y,
            z = v.z;

        if (a === out) {
          out.m12 = a.m00 * x + a.m04 * y + a.m08 * z + a.m12;
          out.m13 = a.m01 * x + a.m05 * y + a.m09 * z + a.m13;
          out.m14 = a.m02 * x + a.m06 * y + a.m10 * z + a.m14;
          out.m15 = a.m03 * x + a.m07 * y + a.m11 * z + a.m15;
        } else {
          var a00 = a.m00;
          var a01 = a.m01;
          var a02 = a.m02;
          var a03 = a.m03;
          var a10 = a.m04;
          var a11 = a.m05;
          var a12 = a.m06;
          var a13 = a.m07;
          var a20 = a.m08;
          var a21 = a.m09;
          var a22 = a.m10;
          var a23 = a.m11;
          var a30 = a.m12;
          var a31 = a.m13;
          var a32 = a.m14;
          var a33 = a.m15;
          out.m00 = a00;
          out.m01 = a01;
          out.m02 = a02;
          out.m03 = a03;
          out.m04 = a10;
          out.m05 = a11;
          out.m06 = a12;
          out.m07 = a13;
          out.m08 = a20;
          out.m09 = a21;
          out.m10 = a22;
          out.m11 = a23;
          out.m12 = a00 * x + a10 * y + a20 * z + a.m12;
          out.m13 = a01 * x + a11 * y + a21 * z + a.m13;
          out.m14 = a02 * x + a12 * y + a22 * z + a.m14;
          out.m15 = a03 * x + a13 * y + a23 * z + a.m15;
        }

        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入新位移变换
       */

    }, {
      key: "translate",
      value: function translate(out, a, v) {
        console.warn('function changed');

        if (a === out) {
          out.m12 += v.x;
          out.m13 += v.y;
          out.m14 += v.z;
        } else {
          out.m00 = a.m00;
          out.m01 = a.m01;
          out.m02 = a.m02;
          out.m03 = a.m03;
          out.m04 = a.m04;
          out.m05 = a.m05;
          out.m06 = a.m06;
          out.m07 = a.m07;
          out.m08 = a.m08;
          out.m09 = a.m09;
          out.m10 = a.m10;
          out.m11 = a.m11;
          out.m12 += v.x;
          out.m13 += v.y;
          out.m14 += v.z;
          out.m15 = a.m15;
        }

        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入新缩放变换
       */

    }, {
      key: "scale",
      value: function scale(out, a, v) {
        var x = v.x,
            y = v.y,
            z = v.z;
        out.m00 = a.m00 * x;
        out.m01 = a.m01 * x;
        out.m02 = a.m02 * x;
        out.m03 = a.m03 * x;
        out.m04 = a.m04 * y;
        out.m05 = a.m05 * y;
        out.m06 = a.m06 * y;
        out.m07 = a.m07 * y;
        out.m08 = a.m08 * z;
        out.m09 = a.m09 * z;
        out.m10 = a.m10 * z;
        out.m11 = a.m11 * z;
        out.m12 = a.m12;
        out.m13 = a.m13;
        out.m14 = a.m14;
        out.m15 = a.m15;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入新旋转变换
       * @param rad 旋转角度
       * @param axis 旋转轴
       */

    }, {
      key: "rotate",
      value: function rotate(out, a, rad, axis) {
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < _utils.EPSILON) {
          return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a03 = a.m03;
        var a10 = a.m04;
        var a11 = a.m05;
        var a12 = a.m06;
        var a13 = a.m07;
        var a20 = a.m08;
        var a21 = a.m09;
        var a22 = a.m10;
        var a23 = a.m11; // Construct the elements of the rotation matrix

        var b00 = x * x * t + c,
            b01 = y * x * t + z * s,
            b02 = z * x * t - y * s;
        var b10 = x * y * t - z * s,
            b11 = y * y * t + c,
            b12 = z * y * t + x * s;
        var b20 = x * z * t + y * s,
            b21 = y * z * t - x * s,
            b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

        out.m00 = a00 * b00 + a10 * b01 + a20 * b02;
        out.m01 = a01 * b00 + a11 * b01 + a21 * b02;
        out.m02 = a02 * b00 + a12 * b01 + a22 * b02;
        out.m03 = a03 * b00 + a13 * b01 + a23 * b02;
        out.m04 = a00 * b10 + a10 * b11 + a20 * b12;
        out.m05 = a01 * b10 + a11 * b11 + a21 * b12;
        out.m06 = a02 * b10 + a12 * b11 + a22 * b12;
        out.m07 = a03 * b10 + a13 * b11 + a23 * b12;
        out.m08 = a00 * b20 + a10 * b21 + a20 * b22;
        out.m09 = a01 * b20 + a11 * b21 + a21 * b22;
        out.m10 = a02 * b20 + a12 * b21 + a22 * b22;
        out.m11 = a03 * b20 + a13 * b21 + a23 * b22; // If the source and destination differ, copy the unchanged last row

        if (a !== out) {
          out.m12 = a.m12;
          out.m13 = a.m13;
          out.m14 = a.m14;
          out.m15 = a.m15;
        }

        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
       * @param rad 旋转角度
       */

    }, {
      key: "rotateX",
      value: function rotateX(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a10 = a.m04,
            a11 = a.m05,
            a12 = a.m06,
            a13 = a.m07,
            a20 = a.m08,
            a21 = a.m09,
            a22 = a.m10,
            a23 = a.m11;

        if (a !== out) {
          // If the source and destination differ, copy the unchanged rows
          out.m00 = a.m00;
          out.m01 = a.m01;
          out.m02 = a.m02;
          out.m03 = a.m03;
          out.m12 = a.m12;
          out.m13 = a.m13;
          out.m14 = a.m14;
          out.m15 = a.m15;
        } // Perform axis-specific matrix multiplication


        out.m04 = a10 * c + a20 * s;
        out.m05 = a11 * c + a21 * s;
        out.m06 = a12 * c + a22 * s;
        out.m07 = a13 * c + a23 * s;
        out.m08 = a20 * c - a10 * s;
        out.m09 = a21 * c - a11 * s;
        out.m10 = a22 * c - a12 * s;
        out.m11 = a23 * c - a13 * s;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
       * @param rad 旋转角度
       */

    }, {
      key: "rotateY",
      value: function rotateY(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a.m00,
            a01 = a.m01,
            a02 = a.m02,
            a03 = a.m03,
            a20 = a.m08,
            a21 = a.m09,
            a22 = a.m10,
            a23 = a.m11;

        if (a !== out) {
          // If the source and destination differ, copy the unchanged rows
          out.m04 = a.m04;
          out.m05 = a.m05;
          out.m06 = a.m06;
          out.m07 = a.m07;
          out.m12 = a.m12;
          out.m13 = a.m13;
          out.m14 = a.m14;
          out.m15 = a.m15;
        } // Perform axis-specific matrix multiplication


        out.m00 = a00 * c - a20 * s;
        out.m01 = a01 * c - a21 * s;
        out.m02 = a02 * c - a22 * s;
        out.m03 = a03 * c - a23 * s;
        out.m08 = a00 * s + a20 * c;
        out.m09 = a01 * s + a21 * c;
        out.m10 = a02 * s + a22 * c;
        out.m11 = a03 * s + a23 * c;
        return out;
      }
      /**
       * @zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
       * @param rad 旋转角度
       */

    }, {
      key: "rotateZ",
      value: function rotateZ(out, a, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            a00 = a.m00,
            a01 = a.m01,
            a02 = a.m02,
            a03 = a.m03,
            a10 = a.m04,
            a11 = a.m05,
            a12 = a.m06,
            a13 = a.m07; // If the source and destination differ, copy the unchanged last row

        if (a !== out) {
          out.m08 = a.m08;
          out.m09 = a.m09;
          out.m10 = a.m10;
          out.m11 = a.m11;
          out.m12 = a.m12;
          out.m13 = a.m13;
          out.m14 = a.m14;
          out.m15 = a.m15;
        } // Perform axis-specific matrix multiplication


        out.m00 = a00 * c + a10 * s;
        out.m01 = a01 * c + a11 * s;
        out.m02 = a02 * c + a12 * s;
        out.m03 = a03 * c + a13 * s;
        out.m04 = a10 * c - a00 * s;
        out.m05 = a11 * c - a01 * s;
        out.m06 = a12 * c - a02 * s;
        out.m07 = a13 * c - a03 * s;
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
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;
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
        out.m04 = 0;
        out.m05 = v.y;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = v.z;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 计算旋转矩阵
       */

    }, {
      key: "fromRotation",
      value: function fromRotation(out, rad, axis) {
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < _utils.EPSILON) {
          return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c; // Perform rotation-specific matrix multiplication

        out.m00 = x * x * t + c;
        out.m01 = y * x * t + z * s;
        out.m02 = z * x * t - y * s;
        out.m03 = 0;
        out.m04 = x * y * t - z * s;
        out.m05 = y * y * t + c;
        out.m06 = z * y * t + x * s;
        out.m07 = 0;
        out.m08 = x * z * t + y * s;
        out.m09 = y * z * t - x * s;
        out.m10 = z * z * t + c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 计算绕 X 轴的旋转矩阵
       */

    }, {
      key: "fromXRotation",
      value: function fromXRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out.m00 = 1;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = c;
        out.m06 = s;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = -s;
        out.m10 = c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 计算绕 Y 轴的旋转矩阵
       */

    }, {
      key: "fromYRotation",
      value: function fromYRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out.m00 = c;
        out.m01 = 0;
        out.m02 = -s;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = 1;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = s;
        out.m09 = 0;
        out.m10 = c;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 计算绕 Z 轴的旋转矩阵
       */

    }, {
      key: "fromZRotation",
      value: function fromZRotation(out, rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad); // Perform axis-specific matrix multiplication

        out.m00 = c;
        out.m01 = s;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = -s;
        out.m05 = c;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = 1;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 根据旋转和位移信息计算矩阵
       */

    }, {
      key: "fromRT",
      value: function fromRT(out, q, v) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        out.m00 = 1 - (yy + zz);
        out.m01 = xy + wz;
        out.m02 = xz - wy;
        out.m03 = 0;
        out.m04 = xy - wz;
        out.m05 = 1 - (xx + zz);
        out.m06 = yz + wx;
        out.m07 = 0;
        out.m08 = xz + wy;
        out.m09 = yz - wx;
        out.m10 = 1 - (xx + yy);
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
       */

    }, {
      key: "getTranslation",
      value: function getTranslation(out, mat) {
        out.x = mat.m12;
        out.y = mat.m13;
        out.z = mat.m14;
        return out;
      }
      /**
       * @zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
       */

    }, {
      key: "getScaling",
      value: function getScaling(out, mat) {
        var m00 = m3_1.m00 = mat.m00;
        var m01 = m3_1.m01 = mat.m01;
        var m02 = m3_1.m02 = mat.m02;
        var m04 = m3_1.m03 = mat.m04;
        var m05 = m3_1.m04 = mat.m05;
        var m06 = m3_1.m05 = mat.m06;
        var m08 = m3_1.m06 = mat.m08;
        var m09 = m3_1.m07 = mat.m09;
        var m10 = m3_1.m08 = mat.m10;
        out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10); // account for refections

        if (_mat.Mat3.determinant(m3_1) < 0) {
          out.x *= -1;
        }

        return out;
      }
      /**
       * @zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
       */

    }, {
      key: "getRotation",
      value: function getRotation(out, mat) {
        var trace = mat.m00 + mat.m05 + mat.m10;
        var S = 0;

        if (trace > 0) {
          S = Math.sqrt(trace + 1.0) * 2;
          out.w = 0.25 * S;
          out.x = (mat.m06 - mat.m09) / S;
          out.y = (mat.m08 - mat.m02) / S;
          out.z = (mat.m01 - mat.m04) / S;
        } else if (mat.m00 > mat.m05 && mat.m00 > mat.m10) {
          S = Math.sqrt(1.0 + mat.m00 - mat.m05 - mat.m10) * 2;
          out.w = (mat.m06 - mat.m09) / S;
          out.x = 0.25 * S;
          out.y = (mat.m01 + mat.m04) / S;
          out.z = (mat.m08 + mat.m02) / S;
        } else if (mat.m05 > mat.m10) {
          S = Math.sqrt(1.0 + mat.m05 - mat.m00 - mat.m10) * 2;
          out.w = (mat.m08 - mat.m02) / S;
          out.x = (mat.m01 + mat.m04) / S;
          out.y = 0.25 * S;
          out.z = (mat.m06 + mat.m09) / S;
        } else {
          S = Math.sqrt(1.0 + mat.m10 - mat.m00 - mat.m05) * 2;
          out.w = (mat.m01 - mat.m04) / S;
          out.x = (mat.m08 + mat.m02) / S;
          out.y = (mat.m06 + mat.m09) / S;
          out.z = 0.25 * S;
        }

        return out;
      }
      /**
       * @zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
       */

    }, {
      key: "toRTS",
      value: function toRTS(m, q, v, s) {
        s.x = _vec.Vec3.set(v3_1, m.m00, m.m01, m.m02).length();
        m3_1.m00 = m.m00 / s.x;
        m3_1.m01 = m.m01 / s.x;
        m3_1.m02 = m.m02 / s.x;
        s.y = _vec.Vec3.set(v3_1, m.m04, m.m05, m.m06).length();
        m3_1.m03 = m.m04 / s.y;
        m3_1.m04 = m.m05 / s.y;
        m3_1.m05 = m.m06 / s.y;
        s.z = _vec.Vec3.set(v3_1, m.m08, m.m09, m.m10).length();
        m3_1.m06 = m.m08 / s.z;
        m3_1.m07 = m.m09 / s.z;
        m3_1.m08 = m.m10 / s.z;

        var det = _mat.Mat3.determinant(m3_1);

        if (det < 0) {
          s.x *= -1;
          m3_1.m00 *= -1;
          m3_1.m01 *= -1;
          m3_1.m02 *= -1;
        }

        _quat.Quat.fromMat3(q, m3_1); // already normalized


        _vec.Vec3.set(v, m.m12, m.m13, m.m14);
      }
      /**
       * @zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
       */

    }, {
      key: "fromRTS",
      value: function fromRTS(out, q, v, s) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = s.x;
        var sy = s.y;
        var sz = s.z;
        out.m00 = (1 - (yy + zz)) * sx;
        out.m01 = (xy + wz) * sx;
        out.m02 = (xz - wy) * sx;
        out.m03 = 0;
        out.m04 = (xy - wz) * sy;
        out.m05 = (1 - (xx + zz)) * sy;
        out.m06 = (yz + wx) * sy;
        out.m07 = 0;
        out.m08 = (xz + wy) * sz;
        out.m09 = (yz - wx) * sz;
        out.m10 = (1 - (xx + yy)) * sz;
        out.m11 = 0;
        out.m12 = v.x;
        out.m13 = v.y;
        out.m14 = v.z;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
       * @param q 旋转值
       * @param v 位移值
       * @param s 缩放值
       * @param o 指定变换中心
       */

    }, {
      key: "fromRTSOrigin",
      value: function fromRTSOrigin(out, q, v, s, o) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = s.x;
        var sy = s.y;
        var sz = s.z;
        var ox = o.x;
        var oy = o.y;
        var oz = o.z;
        out.m00 = (1 - (yy + zz)) * sx;
        out.m01 = (xy + wz) * sx;
        out.m02 = (xz - wy) * sx;
        out.m03 = 0;
        out.m04 = (xy - wz) * sy;
        out.m05 = (1 - (xx + zz)) * sy;
        out.m06 = (yz + wx) * sy;
        out.m07 = 0;
        out.m08 = (xz + wy) * sz;
        out.m09 = (yz - wx) * sz;
        out.m10 = (1 - (xx + yy)) * sz;
        out.m11 = 0;
        out.m12 = v.x + ox - (out.m00 * ox + out.m04 * oy + out.m08 * oz);
        out.m13 = v.y + oy - (out.m01 * ox + out.m05 * oy + out.m09 * oz);
        out.m14 = v.z + oz - (out.m02 * ox + out.m06 * oy + out.m10 * oz);
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 根据指定的旋转信息计算矩阵
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
        out.m01 = yx + wz;
        out.m02 = zx - wy;
        out.m03 = 0;
        out.m04 = yx - wz;
        out.m05 = 1 - xx - zz;
        out.m06 = zy + wx;
        out.m07 = 0;
        out.m08 = zx + wy;
        out.m09 = zy - wx;
        out.m10 = 1 - xx - yy;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 根据指定的视锥体信息计算矩阵
       * @param left 左平面距离
       * @param right 右平面距离
       * @param bottom 下平面距离
       * @param top 上平面距离
       * @param near 近平面距离
       * @param far 远平面距离
       */

    }, {
      key: "frustum",
      value: function frustum(out, left, right, bottom, top, near, far) {
        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);
        out.m00 = near * 2 * rl;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = near * 2 * tb;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = (right + left) * rl;
        out.m09 = (top + bottom) * tb;
        out.m10 = (far + near) * nf;
        out.m11 = -1;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = far * near * 2 * nf;
        out.m15 = 0;
        return out;
      }
      /**
       * @zh 计算透视投影矩阵
       * @param fovy 纵向视角高度
       * @param aspect 长宽比
       * @param near 近平面距离
       * @param far 远平面距离
       */

    }, {
      key: "perspective",
      value: function perspective(out, fov, aspect, near, far) {
        var isFOVY = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
        var minClipZ = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : -1;
        var projectionSignY = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
        var f = 1.0 / Math.tan(fov / 2);
        var nf = 1 / (near - far);
        out.m00 = isFOVY ? f / aspect : f;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = (isFOVY ? f : f * aspect) * projectionSignY;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = (far - minClipZ * near) * nf;
        out.m11 = -1;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = far * near * nf * (1 - minClipZ);
        out.m15 = 0;
        return out;
      }
      /**
       * @zh 计算正交投影矩阵
       * @param left 左平面距离
       * @param right 右平面距离
       * @param bottom 下平面距离
       * @param top 上平面距离
       * @param near 近平面距离
       * @param far 远平面距离
       */

    }, {
      key: "ortho",
      value: function ortho(out, left, right, bottom, top, near, far) {
        var minClipZ = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : -1;
        var projectionSignY = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
        var lr = 1 / (left - right);
        var bt = 1 / (bottom - top);
        var nf = 1 / (near - far);
        out.m00 = -2 * lr;
        out.m01 = 0;
        out.m02 = 0;
        out.m03 = 0;
        out.m04 = 0;
        out.m05 = -2 * bt * projectionSignY;
        out.m06 = 0;
        out.m07 = 0;
        out.m08 = 0;
        out.m09 = 0;
        out.m10 = nf * (1 - minClipZ);
        out.m11 = 0;
        out.m12 = (left + right) * lr;
        out.m13 = (top + bottom) * bt;
        out.m14 = (near - minClipZ * far) * nf;
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
       * @param eye 当前位置
       * @param center 目标视点
       * @param up 视口上方向
       */

    }, {
      key: "lookAt",
      value: function lookAt(out, eye, center, up) {
        var eyex = eye.x;
        var eyey = eye.y;
        var eyez = eye.z;
        var upx = up.x;
        var upy = up.y;
        var upz = up.z;
        var centerx = center.x;
        var centery = center.y;
        var centerz = center.z;
        var z0 = eyex - centerx;
        var z1 = eyey - centery;
        var z2 = eyez - centerz;
        var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        var x0 = upy * z2 - upz * z1;
        var x1 = upz * z0 - upx * z2;
        var x2 = upx * z1 - upy * z0;
        len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        x0 *= len;
        x1 *= len;
        x2 *= len;
        var y0 = z1 * x2 - z2 * x1;
        var y1 = z2 * x0 - z0 * x2;
        var y2 = z0 * x1 - z1 * x0;
        out.m00 = x0;
        out.m01 = y0;
        out.m02 = z0;
        out.m03 = 0;
        out.m04 = x1;
        out.m05 = y1;
        out.m06 = z1;
        out.m07 = 0;
        out.m08 = x2;
        out.m09 = y2;
        out.m10 = z2;
        out.m11 = 0;
        out.m12 = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out.m13 = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out.m14 = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out.m15 = 1;
        return out;
      }
      /**
       * @zh 计算逆转置矩阵
       */

    }, {
      key: "inverseTranspose",
      value: function inverseTranspose(out, a) {
        var a00 = a.m00;
        var a01 = a.m01;
        var a02 = a.m02;
        var a03 = a.m03;
        var a10 = a.m04;
        var a11 = a.m05;
        var a12 = a.m06;
        var a13 = a.m07;
        var a20 = a.m08;
        var a21 = a.m09;
        var a22 = a.m10;
        var a23 = a.m11;
        var a30 = a.m12;
        var a31 = a.m13;
        var a32 = a.m14;
        var a33 = a.m15;
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
        out.m03 = 0;
        out.m04 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out.m06 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out.m07 = 0;
        out.m08 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out.m09 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out.m11 = 0;
        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        out.m15 = 1;
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
        out[ofs + 9] = m.m09;
        out[ofs + 10] = m.m10;
        out[ofs + 11] = m.m11;
        out[ofs + 12] = m.m12;
        out[ofs + 13] = m.m13;
        out[ofs + 14] = m.m14;
        out[ofs + 15] = m.m15;
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
        out.m09 = arr[ofs + 9];
        out.m10 = arr[ofs + 10];
        out.m11 = arr[ofs + 11];
        out.m12 = arr[ofs + 12];
        out.m13 = arr[ofs + 13];
        out.m14 = arr[ofs + 14];
        out.m15 = arr[ofs + 15];
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
        out.m09 = a.m09 + b.m09;
        out.m10 = a.m10 + b.m10;
        out.m11 = a.m11 + b.m11;
        out.m12 = a.m12 + b.m12;
        out.m13 = a.m13 + b.m13;
        out.m14 = a.m14 + b.m14;
        out.m15 = a.m15 + b.m15;
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
        out.m09 = a.m09 - b.m09;
        out.m10 = a.m10 - b.m10;
        out.m11 = a.m11 - b.m11;
        out.m12 = a.m12 - b.m12;
        out.m13 = a.m13 - b.m13;
        out.m14 = a.m14 - b.m14;
        out.m15 = a.m15 - b.m15;
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
        out.m09 = a.m09 * b;
        out.m10 = a.m10 * b;
        out.m11 = a.m11 * b;
        out.m12 = a.m12 * b;
        out.m13 = a.m13 * b;
        out.m14 = a.m14 * b;
        out.m15 = a.m15 * b;
        return out;
      }
      /**
       * @zh 逐元素矩阵标量乘加: A + B * scale
       */

    }, {
      key: "multiplyScalarAndAdd",
      value: function multiplyScalarAndAdd(out, a, b, scale) {
        out.m00 = a.m00 + b.m00 * scale;
        out.m01 = a.m01 + b.m01 * scale;
        out.m02 = a.m02 + b.m02 * scale;
        out.m03 = a.m03 + b.m03 * scale;
        out.m04 = a.m04 + b.m04 * scale;
        out.m05 = a.m05 + b.m05 * scale;
        out.m06 = a.m06 + b.m06 * scale;
        out.m07 = a.m07 + b.m07 * scale;
        out.m08 = a.m08 + b.m08 * scale;
        out.m09 = a.m09 + b.m09 * scale;
        out.m10 = a.m10 + b.m10 * scale;
        out.m11 = a.m11 + b.m11 * scale;
        out.m12 = a.m12 + b.m12 * scale;
        out.m13 = a.m13 + b.m13 * scale;
        out.m14 = a.m14 + b.m14 * scale;
        out.m15 = a.m15 + b.m15 * scale;
        return out;
      }
      /**
       * @zh 矩阵等价判断
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(a, b) {
        return a.m00 === b.m00 && a.m01 === b.m01 && a.m02 === b.m02 && a.m03 === b.m03 && a.m04 === b.m04 && a.m05 === b.m05 && a.m06 === b.m06 && a.m07 === b.m07 && a.m08 === b.m08 && a.m09 === b.m09 && a.m10 === b.m10 && a.m11 === b.m11 && a.m12 === b.m12 && a.m13 === b.m13 && a.m14 === b.m14 && a.m15 === b.m15;
      }
      /**
       * @zh 排除浮点数误差的矩阵近似等价判断
       */

    }, {
      key: "equals",
      value: function equals(a, b) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.EPSILON;
        // TAOCP vol.2, 3rd ed., s.4.2.4, p.213-225
        // defines a 'close enough' relationship between u and v that scales for magnitude
        return Math.abs(a.m00 - b.m00) <= epsilon * Math.max(1.0, Math.abs(a.m00), Math.abs(b.m00)) && Math.abs(a.m01 - b.m01) <= epsilon * Math.max(1.0, Math.abs(a.m01), Math.abs(b.m01)) && Math.abs(a.m02 - b.m02) <= epsilon * Math.max(1.0, Math.abs(a.m02), Math.abs(b.m02)) && Math.abs(a.m03 - b.m03) <= epsilon * Math.max(1.0, Math.abs(a.m03), Math.abs(b.m03)) && Math.abs(a.m04 - b.m04) <= epsilon * Math.max(1.0, Math.abs(a.m04), Math.abs(b.m04)) && Math.abs(a.m05 - b.m05) <= epsilon * Math.max(1.0, Math.abs(a.m05), Math.abs(b.m05)) && Math.abs(a.m06 - b.m06) <= epsilon * Math.max(1.0, Math.abs(a.m06), Math.abs(b.m06)) && Math.abs(a.m07 - b.m07) <= epsilon * Math.max(1.0, Math.abs(a.m07), Math.abs(b.m07)) && Math.abs(a.m08 - b.m08) <= epsilon * Math.max(1.0, Math.abs(a.m08), Math.abs(b.m08)) && Math.abs(a.m09 - b.m09) <= epsilon * Math.max(1.0, Math.abs(a.m09), Math.abs(b.m09)) && Math.abs(a.m10 - b.m10) <= epsilon * Math.max(1.0, Math.abs(a.m10), Math.abs(b.m10)) && Math.abs(a.m11 - b.m11) <= epsilon * Math.max(1.0, Math.abs(a.m11), Math.abs(b.m11)) && Math.abs(a.m12 - b.m12) <= epsilon * Math.max(1.0, Math.abs(a.m12), Math.abs(b.m12)) && Math.abs(a.m13 - b.m13) <= epsilon * Math.max(1.0, Math.abs(a.m13), Math.abs(b.m13)) && Math.abs(a.m14 - b.m14) <= epsilon * Math.max(1.0, Math.abs(a.m14), Math.abs(b.m14)) && Math.abs(a.m15 - b.m15) <= epsilon * Math.max(1.0, Math.abs(a.m15), Math.abs(b.m15));
      }
      /**
       * 矩阵第 0 列第 0 行的元素。
       */

    }]);

    function Mat4() {
      var _this;

      var m00 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var m01 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var m02 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var m03 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var m04 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var m05 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var m06 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var m07 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var m08 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
      var m09 = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
      var m10 = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1;
      var m11 = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
      var m12 = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
      var m13 = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
      var m14 = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
      var m15 = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 1;

      _classCallCheck(this, Mat4);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Mat4).call(this));
      _this.m00 = void 0;
      _this.m01 = void 0;
      _this.m02 = void 0;
      _this.m03 = void 0;
      _this.m04 = void 0;
      _this.m05 = void 0;
      _this.m06 = void 0;
      _this.m07 = void 0;
      _this.m08 = void 0;
      _this.m09 = void 0;
      _this.m10 = void 0;
      _this.m11 = void 0;
      _this.m12 = void 0;
      _this.m13 = void 0;
      _this.m14 = void 0;
      _this.m15 = void 0;

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
        _this.m09 = m00.m09;
        _this.m10 = m00.m10;
        _this.m11 = m00.m11;
        _this.m12 = m00.m12;
        _this.m13 = m00.m13;
        _this.m14 = m00.m14;
        _this.m15 = m00.m15;
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
        _this.m09 = m09;
        _this.m10 = m10;
        _this.m11 = m11;
        _this.m12 = m12;
        _this.m13 = m13;
        _this.m14 = m14;
        _this.m15 = m15;
      }

      return _this;
    }
    /**
     * @zh 克隆当前矩阵。
     */


    _createClass(Mat4, [{
      key: "clone",
      value: function clone() {
        var t = this;
        return new Mat4(t.m00, t.m01, t.m02, t.m03, t.m04, t.m05, t.m06, t.m07, t.m08, t.m09, t.m10, t.m11, t.m12, t.m13, t.m14, t.m15);
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
        var m04 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var m05 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
        var m06 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var m07 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var m08 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
        var m09 = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
        var m10 = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1;
        var m11 = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
        var m12 = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
        var m13 = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
        var m14 = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0;
        var m15 = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : 1;

        if (_typeof(m00) === 'object') {
          this.m01 = m00.m01;
          this.m02 = m00.m02;
          this.m03 = m00.m03;
          this.m04 = m00.m04;
          this.m05 = m00.m05;
          this.m06 = m00.m06;
          this.m07 = m00.m07;
          this.m08 = m00.m08;
          this.m09 = m00.m09;
          this.m10 = m00.m10;
          this.m11 = m00.m11;
          this.m12 = m00.m12;
          this.m13 = m00.m13;
          this.m14 = m00.m14;
          this.m15 = m00.m15;
          this.m00 = m00.m00;
        } else {
          this.m01 = m01;
          this.m02 = m02;
          this.m03 = m03;
          this.m04 = m04;
          this.m05 = m05;
          this.m06 = m06;
          this.m07 = m07;
          this.m08 = m08;
          this.m09 = m09;
          this.m10 = m10;
          this.m11 = m11;
          this.m12 = m12;
          this.m13 = m13;
          this.m14 = m14;
          this.m15 = m15;
          this.m00 = m00;
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
        return Math.abs(this.m00 - other.m00) <= epsilon * Math.max(1.0, Math.abs(this.m00), Math.abs(other.m00)) && Math.abs(this.m01 - other.m01) <= epsilon * Math.max(1.0, Math.abs(this.m01), Math.abs(other.m01)) && Math.abs(this.m02 - other.m02) <= epsilon * Math.max(1.0, Math.abs(this.m02), Math.abs(other.m02)) && Math.abs(this.m03 - other.m03) <= epsilon * Math.max(1.0, Math.abs(this.m03), Math.abs(other.m03)) && Math.abs(this.m04 - other.m04) <= epsilon * Math.max(1.0, Math.abs(this.m04), Math.abs(other.m04)) && Math.abs(this.m05 - other.m05) <= epsilon * Math.max(1.0, Math.abs(this.m05), Math.abs(other.m05)) && Math.abs(this.m06 - other.m06) <= epsilon * Math.max(1.0, Math.abs(this.m06), Math.abs(other.m06)) && Math.abs(this.m07 - other.m07) <= epsilon * Math.max(1.0, Math.abs(this.m07), Math.abs(other.m07)) && Math.abs(this.m08 - other.m08) <= epsilon * Math.max(1.0, Math.abs(this.m08), Math.abs(other.m08)) && Math.abs(this.m09 - other.m09) <= epsilon * Math.max(1.0, Math.abs(this.m09), Math.abs(other.m09)) && Math.abs(this.m10 - other.m10) <= epsilon * Math.max(1.0, Math.abs(this.m10), Math.abs(other.m10)) && Math.abs(this.m11 - other.m11) <= epsilon * Math.max(1.0, Math.abs(this.m11), Math.abs(other.m11)) && Math.abs(this.m12 - other.m12) <= epsilon * Math.max(1.0, Math.abs(this.m12), Math.abs(other.m12)) && Math.abs(this.m13 - other.m13) <= epsilon * Math.max(1.0, Math.abs(this.m13), Math.abs(other.m13)) && Math.abs(this.m14 - other.m14) <= epsilon * Math.max(1.0, Math.abs(this.m14), Math.abs(other.m14)) && Math.abs(this.m15 - other.m15) <= epsilon * Math.max(1.0, Math.abs(this.m15), Math.abs(other.m15));
      }
      /**
       * @zh 判断当前矩阵是否与指定矩阵相等。
       * @param other 相比较的矩阵。
       * @return 两矩阵的各元素都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "strictEquals",
      value: function strictEquals(other) {
        return this.m00 === other.m00 && this.m01 === other.m01 && this.m02 === other.m02 && this.m03 === other.m03 && this.m04 === other.m04 && this.m05 === other.m05 && this.m06 === other.m06 && this.m07 === other.m07 && this.m08 === other.m08 && this.m09 === other.m09 && this.m10 === other.m10 && this.m11 === other.m11 && this.m12 === other.m12 && this.m13 === other.m13 && this.m14 === other.m14 && this.m15 === other.m15;
      }
      /**
       * 返回当前矩阵的字符串表示。
       * @return 当前矩阵的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return '[\n' + this.m00 + ', ' + this.m01 + ', ' + this.m02 + ', ' + this.m03 + ',\n' + this.m04 + ', ' + this.m05 + ', ' + this.m06 + ', ' + this.m07 + ',\n' + this.m08 + ', ' + this.m09 + ', ' + this.m10 + ', ' + this.m11 + ',\n' + this.m12 + ', ' + this.m13 + ', ' + this.m14 + ', ' + this.m15 + '\n' + ']';
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
        this.m04 = 0;
        this.m05 = 1;
        this.m06 = 0;
        this.m07 = 0;
        this.m08 = 0;
        this.m09 = 0;
        this.m10 = 1;
        this.m11 = 0;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m15 = 1;
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
            a03 = this.m03,
            a12 = this.m06,
            a13 = this.m07,
            a23 = this.m11;
        this.m01 = this.m04;
        this.m02 = this.m08;
        this.m03 = this.m12;
        this.m04 = a01;
        this.m06 = this.m09;
        this.m07 = this.m13;
        this.m08 = a02;
        this.m09 = a12;
        this.m11 = this.m14;
        this.m12 = a03;
        this.m13 = a13;
        this.m14 = a23;
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
        var a03 = this.m03;
        var a10 = this.m04;
        var a11 = this.m05;
        var a12 = this.m06;
        var a13 = this.m07;
        var a20 = this.m08;
        var a21 = this.m09;
        var a22 = this.m10;
        var a23 = this.m11;
        var a30 = this.m12;
        var a31 = this.m13;
        var a32 = this.m14;
        var a33 = this.m15;
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

        if (det === 0) {
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
          return this;
        }

        det = 1.0 / det;
        this.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
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
        var a03 = this.m03;
        var a10 = this.m04;
        var a11 = this.m05;
        var a12 = this.m06;
        var a13 = this.m07;
        var a20 = this.m08;
        var a21 = this.m09;
        var a22 = this.m10;
        var a23 = this.m11;
        var a30 = this.m12;
        var a31 = this.m13;
        var a32 = this.m14;
        var a33 = this.m15;
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

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
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
        this.m09 = this.m09 + mat.m09;
        this.m10 = this.m10 + mat.m10;
        this.m11 = this.m11 + mat.m11;
        this.m12 = this.m12 + mat.m12;
        this.m13 = this.m13 + mat.m13;
        this.m14 = this.m14 + mat.m14;
        this.m15 = this.m15 + mat.m15;
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
        this.m09 = this.m09 - mat.m09;
        this.m10 = this.m10 - mat.m10;
        this.m11 = this.m11 - mat.m11;
        this.m12 = this.m12 - mat.m12;
        this.m13 = this.m13 - mat.m13;
        this.m14 = this.m14 - mat.m14;
        this.m15 = this.m15 - mat.m15;
        return this;
      }
      /**
       * @zh 矩阵乘法。将当前矩阵左乘指定矩阵的结果赋值给当前矩阵。
       * @param mat 指定的矩阵。
       */

    }, {
      key: "multiply",
      value: function multiply(mat) {
        var a00 = this.m00;
        var a01 = this.m01;
        var a02 = this.m02;
        var a03 = this.m03;
        var a10 = this.m04;
        var a11 = this.m05;
        var a12 = this.m06;
        var a13 = this.m07;
        var a20 = this.m08;
        var a21 = this.m09;
        var a22 = this.m10;
        var a23 = this.m11;
        var a30 = this.m12;
        var a31 = this.m13;
        var a32 = this.m14;
        var a33 = this.m15; // Cache only the current line of the second matrix

        var b0 = mat.m00,
            b1 = mat.m01,
            b2 = mat.m02,
            b3 = mat.m03;
        this.m00 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.m01 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.m02 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.m03 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = mat.m04;
        b1 = mat.m05;
        b2 = mat.m06;
        b3 = mat.m07;
        this.m04 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.m05 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.m06 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.m07 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = mat.m08;
        b1 = mat.m09;
        b2 = mat.m10;
        b3 = mat.m11;
        this.m08 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.m09 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.m10 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.m11 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = mat.m12;
        b1 = mat.m13;
        b2 = mat.m14;
        b3 = mat.m15;
        this.m12 = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this.m13 = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this.m14 = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this.m15 = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
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
        this.m09 = this.m09 * scalar;
        this.m10 = this.m10 * scalar;
        this.m11 = this.m11 * scalar;
        this.m12 = this.m12 * scalar;
        this.m13 = this.m13 * scalar;
        this.m14 = this.m14 * scalar;
        this.m15 = this.m15 * scalar;
        return this;
      }
      /**
       * @zh 将当前矩阵左乘位移矩阵的结果赋值给当前矩阵，位移矩阵由各个轴的位移给出。
       * @param vec 位移向量。
       */

    }, {
      key: "translate",
      value: function translate(vec) {
        console.warn('function changed');
        this.m12 += vec.x;
        this.m13 += vec.y;
        this.m14 += vec.z;
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
            y = vec.y,
            z = vec.z;
        this.m00 = this.m00 * x;
        this.m01 = this.m01 * x;
        this.m02 = this.m02 * x;
        this.m03 = this.m03 * x;
        this.m04 = this.m04 * y;
        this.m05 = this.m05 * y;
        this.m06 = this.m06 * y;
        this.m07 = this.m07 * y;
        this.m08 = this.m08 * z;
        this.m09 = this.m09 * z;
        this.m10 = this.m10 * z;
        this.m11 = this.m11 * z;
        this.m12 = this.m12;
        this.m13 = this.m13;
        this.m14 = this.m14;
        this.m15 = this.m15;
        return this;
      }
      /**
       * @zh 将当前矩阵左乘旋转矩阵的结果赋值给当前矩阵，旋转矩阵由旋转轴和旋转角度给出。
       * @param mat 矩阵
       * @param rad 旋转角度（弧度制）
       * @param axis 旋转轴
       */

    }, {
      key: "rotate",
      value: function rotate(rad, axis) {
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var len = Math.sqrt(x * x + y * y + z * z);

        if (Math.abs(len) < _utils.EPSILON) {
          return null;
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var t = 1 - c;
        var a00 = this.m00;
        var a01 = this.m01;
        var a02 = this.m02;
        var a03 = this.m03;
        var a10 = this.m04;
        var a11 = this.m05;
        var a12 = this.m06;
        var a13 = this.m07;
        var a20 = this.m08;
        var a21 = this.m09;
        var a22 = this.m10;
        var a23 = this.m11; // Construct the elements of the rotation matrix

        var b00 = x * x * t + c,
            b01 = y * x * t + z * s,
            b02 = z * x * t - y * s;
        var b10 = x * y * t - z * s,
            b11 = y * y * t + c,
            b12 = z * y * t + x * s;
        var b20 = x * z * t + y * s,
            b21 = y * z * t - x * s,
            b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

        this.m00 = a00 * b00 + a10 * b01 + a20 * b02;
        this.m01 = a01 * b00 + a11 * b01 + a21 * b02;
        this.m02 = a02 * b00 + a12 * b01 + a22 * b02;
        this.m03 = a03 * b00 + a13 * b01 + a23 * b02;
        this.m04 = a00 * b10 + a10 * b11 + a20 * b12;
        this.m05 = a01 * b10 + a11 * b11 + a21 * b12;
        this.m06 = a02 * b10 + a12 * b11 + a22 * b12;
        this.m07 = a03 * b10 + a13 * b11 + a23 * b12;
        this.m08 = a00 * b20 + a10 * b21 + a20 * b22;
        this.m09 = a01 * b20 + a11 * b21 + a21 * b22;
        this.m10 = a02 * b20 + a12 * b21 + a22 * b22;
        this.m11 = a03 * b20 + a13 * b21 + a23 * b22;
        return this;
      }
      /**
       * @zh 从当前矩阵中计算出位移变换的部分，并以各个轴上位移的形式赋值给出口向量。
       * @param out 返回向量，当未指定时将创建为新的向量。
       */

    }, {
      key: "getTranslation",
      value: function getTranslation(out) {
        out.x = this.m12;
        out.y = this.m13;
        out.z = this.m14;
        return out;
      }
      /**
       * @zh 从当前矩阵中计算出缩放变换的部分，并以各个轴上缩放的形式赋值给出口向量。
       * @param out 返回值，当未指定时将创建为新的向量。
       */

    }, {
      key: "getScale",
      value: function getScale(out) {
        var m00 = m3_1.m00 = this.m00;
        var m01 = m3_1.m01 = this.m01;
        var m02 = m3_1.m02 = this.m02;
        var m04 = m3_1.m03 = this.m04;
        var m05 = m3_1.m04 = this.m05;
        var m06 = m3_1.m05 = this.m06;
        var m08 = m3_1.m06 = this.m08;
        var m09 = m3_1.m07 = this.m09;
        var m10 = m3_1.m08 = this.m10;
        out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
        out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
        out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10); // account for refections

        if (_mat.Mat3.determinant(m3_1) < 0) {
          out.x *= -1;
        }

        return out;
      }
      /**
       * @zh 从当前矩阵中计算出旋转变换的部分，并以四元数的形式赋值给出口四元数。
       * @param out 返回值，当未指定时将创建为新的四元数。
       */

    }, {
      key: "getRotation",
      value: function getRotation(out) {
        var trace = this.m00 + this.m05 + this.m10;
        var S = 0;

        if (trace > 0) {
          S = Math.sqrt(trace + 1.0) * 2;
          out.w = 0.25 * S;
          out.x = (this.m06 - this.m09) / S;
          out.y = (this.m08 - this.m02) / S;
          out.z = (this.m01 - this.m04) / S;
        } else if (this.m00 > this.m05 && this.m00 > this.m10) {
          S = Math.sqrt(1.0 + this.m00 - this.m05 - this.m10) * 2;
          out.w = (this.m06 - this.m09) / S;
          out.x = 0.25 * S;
          out.y = (this.m01 + this.m04) / S;
          out.z = (this.m08 + this.m02) / S;
        } else if (this.m05 > this.m10) {
          S = Math.sqrt(1.0 + this.m05 - this.m00 - this.m10) * 2;
          out.w = (this.m08 - this.m02) / S;
          out.x = (this.m01 + this.m04) / S;
          out.y = 0.25 * S;
          out.z = (this.m06 + this.m09) / S;
        } else {
          S = Math.sqrt(1.0 + this.m10 - this.m00 - this.m05) * 2;
          out.w = (this.m01 - this.m04) / S;
          out.x = (this.m08 + this.m02) / S;
          out.y = (this.m06 + this.m09) / S;
          out.z = 0.25 * S;
        }

        return out;
      }
      /**
       * @zh 重置当前矩阵的值，使其表示指定的旋转、缩放、位移依次组合的变换。
       * @param q 四元数表示的旋转变换。
       * @param v 位移变换，表示为各个轴的位移。
       * @param s 缩放变换，表示为各个轴的缩放。
       * @return `this`
       */

    }, {
      key: "fromRTS",
      value: function fromRTS(q, v, s) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x;
        var y2 = y + y;
        var z2 = z + z;
        var xx = x * x2;
        var xy = x * y2;
        var xz = x * z2;
        var yy = y * y2;
        var yz = y * z2;
        var zz = z * z2;
        var wx = w * x2;
        var wy = w * y2;
        var wz = w * z2;
        var sx = s.x;
        var sy = s.y;
        var sz = s.z;
        this.m00 = (1 - (yy + zz)) * sx;
        this.m01 = (xy + wz) * sx;
        this.m02 = (xz - wy) * sx;
        this.m03 = 0;
        this.m04 = (xy - wz) * sy;
        this.m05 = (1 - (xx + zz)) * sy;
        this.m06 = (yz + wx) * sy;
        this.m07 = 0;
        this.m08 = (xz + wy) * sz;
        this.m09 = (yz - wx) * sz;
        this.m10 = (1 - (xx + yy)) * sz;
        this.m11 = 0;
        this.m12 = v.x;
        this.m13 = v.y;
        this.m14 = v.z;
        this.m15 = 1;
        return this;
      }
      /**
       * @zh 重置当前矩阵的值，使其表示指定四元数表示的旋转变换。
       * @param q 四元数表示的旋转变换。
       * @return `this`
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
        this.m01 = yx + wz;
        this.m02 = zx - wy;
        this.m03 = 0;
        this.m04 = yx - wz;
        this.m05 = 1 - xx - zz;
        this.m06 = zy + wx;
        this.m07 = 0;
        this.m08 = zx + wy;
        this.m09 = zy - wx;
        this.m10 = 1 - xx - yy;
        this.m11 = 0;
        this.m12 = 0;
        this.m13 = 0;
        this.m14 = 0;
        this.m15 = 1;
        return this;
      }
    }]);

    return Mat4;
  }(_valueType.ValueType);

  _exports.Mat4 = Mat4;
  Mat4.IDENTITY = Object.freeze(new Mat4());
  var v3_1 = new _vec.Vec3();
  var m3_1 = new _mat.Mat3();

  _class.CCClass.fastDefine('cc.Mat4', Mat4, {
    m00: 1,
    m01: 0,
    m02: 0,
    m03: 0,
    m04: 0,
    m05: 1,
    m06: 0,
    m07: 0,
    m08: 0,
    m09: 0,
    m10: 1,
    m11: 0,
    m12: 0,
    m13: 0,
    m14: 0,
    m15: 1
  });

  _globalExports.legacyCC.Mat4 = Mat4;

  function mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    return new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
  }

  _globalExports.legacyCC.mat4 = mat4;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9tYXQ0LnRzIl0sIm5hbWVzIjpbIk1hdDQiLCJhIiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTA0IiwibTA1IiwibTA2IiwibTA3IiwibTA4IiwibTA5IiwibTEwIiwibTExIiwibTEyIiwibTEzIiwibTE0IiwibTE1Iiwib3V0IiwibTIwIiwibTIxIiwibTIyIiwibTIzIiwibTMwIiwibTMxIiwibTMyIiwibTMzIiwiYTAxIiwiYTAyIiwiYTAzIiwiYTEyIiwiYTEzIiwiYTIzIiwiYTAwIiwiYTEwIiwiYTExIiwiYTIwIiwiYTIxIiwiYTIyIiwiYTMwIiwiYTMxIiwiYTMyIiwiYTMzIiwiYjAwIiwiYjAxIiwiYjAyIiwiYjAzIiwiYjA0IiwiYjA1IiwiYjA2IiwiYjA3IiwiYjA4IiwiYjA5IiwiYjEwIiwiYjExIiwiZGV0IiwiYiIsImIwIiwiYjEiLCJiMiIsImIzIiwidiIsIngiLCJ5IiwieiIsImNvbnNvbGUiLCJ3YXJuIiwicmFkIiwiYXhpcyIsImxlbiIsIk1hdGgiLCJzcXJ0IiwiYWJzIiwiRVBTSUxPTiIsInMiLCJzaW4iLCJjIiwiY29zIiwidCIsImIxMiIsImIyMCIsImIyMSIsImIyMiIsInEiLCJ3IiwieDIiLCJ5MiIsInoyIiwieHgiLCJ4eSIsInh6IiwieXkiLCJ5eiIsInp6Iiwid3giLCJ3eSIsInd6IiwibWF0IiwibTNfMSIsIk1hdDMiLCJkZXRlcm1pbmFudCIsInRyYWNlIiwiUyIsIm0iLCJWZWMzIiwic2V0IiwidjNfMSIsImxlbmd0aCIsIlF1YXQiLCJmcm9tTWF0MyIsInN4Iiwic3kiLCJzeiIsIm8iLCJveCIsIm95Iiwib3oiLCJ5eCIsInp4IiwienkiLCJsZWZ0IiwicmlnaHQiLCJib3R0b20iLCJ0b3AiLCJuZWFyIiwiZmFyIiwicmwiLCJ0YiIsIm5mIiwiZm92IiwiYXNwZWN0IiwiaXNGT1ZZIiwibWluQ2xpcFoiLCJwcm9qZWN0aW9uU2lnblkiLCJmIiwidGFuIiwibHIiLCJidCIsImV5ZSIsImNlbnRlciIsInVwIiwiZXlleCIsImV5ZXkiLCJleWV6IiwidXB4IiwidXB5IiwidXB6IiwiY2VudGVyeCIsImNlbnRlcnkiLCJjZW50ZXJ6IiwiejAiLCJ6MSIsIngwIiwieDEiLCJ5MCIsInkxIiwib2ZzIiwiYXJyIiwic2NhbGUiLCJlcHNpbG9uIiwibWF4Iiwib3RoZXIiLCJzY2FsYXIiLCJ2ZWMiLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwibGVnYWN5Q0MiLCJtYXQ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0E7OztBQUdBO01BQ2FBLEk7Ozs7OztBQUlUOzs7NEJBRzZDQyxDLEVBQVE7QUFDakQsZUFBTyxJQUFJRCxJQUFKLENBQ0hDLENBQUMsQ0FBQ0MsR0FEQyxFQUNJRCxDQUFDLENBQUNFLEdBRE4sRUFDV0YsQ0FBQyxDQUFDRyxHQURiLEVBQ2tCSCxDQUFDLENBQUNJLEdBRHBCLEVBRUhKLENBQUMsQ0FBQ0ssR0FGQyxFQUVJTCxDQUFDLENBQUNNLEdBRk4sRUFFV04sQ0FBQyxDQUFDTyxHQUZiLEVBRWtCUCxDQUFDLENBQUNRLEdBRnBCLEVBR0hSLENBQUMsQ0FBQ1MsR0FIQyxFQUdJVCxDQUFDLENBQUNVLEdBSE4sRUFHV1YsQ0FBQyxDQUFDVyxHQUhiLEVBR2tCWCxDQUFDLENBQUNZLEdBSHBCLEVBSUhaLENBQUMsQ0FBQ2EsR0FKQyxFQUlJYixDQUFDLENBQUNjLEdBSk4sRUFJV2QsQ0FBQyxDQUFDZSxHQUpiLEVBSWtCZixDQUFDLENBQUNnQixHQUpwQixDQUFQO0FBTUg7QUFFRDs7Ozs7OzJCQUc0Q0MsRyxFQUFVakIsQyxFQUFRO0FBQzFEaUIsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVRCxDQUFDLENBQUNDLEdBQVo7QUFDQWdCLFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVRixDQUFDLENBQUNFLEdBQVo7QUFDQWUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVILENBQUMsQ0FBQ0csR0FBWjtBQUNBYyxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVUosQ0FBQyxDQUFDSSxHQUFaO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVTCxDQUFDLENBQUNLLEdBQVo7QUFDQVksUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVVOLENBQUMsQ0FBQ00sR0FBWjtBQUNBVyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVVAsQ0FBQyxDQUFDTyxHQUFaO0FBQ0FVLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVUixDQUFDLENBQUNRLEdBQVo7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVULENBQUMsQ0FBQ1MsR0FBWjtBQUNBUSxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVVYsQ0FBQyxDQUFDVSxHQUFaO0FBQ0FPLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVWCxDQUFDLENBQUNXLEdBQVo7QUFDQU0sUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVaLENBQUMsQ0FBQ1ksR0FBWjtBQUNBSyxRQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVWIsQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNjLEdBQVo7QUFDQUcsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVmLENBQUMsQ0FBQ2UsR0FBWjtBQUNBRSxRQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVWhCLENBQUMsQ0FBQ2dCLEdBQVo7QUFDQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OzBCQUlJQSxHLEVBQ0FoQixHLEVBQWFDLEcsRUFBYUMsRyxFQUFhQyxHLEVBQ3ZDTyxHLEVBQWFDLEcsRUFBYUMsRyxFQUFhQyxHLEVBQ3ZDSSxHLEVBQWFDLEcsRUFBYUMsRyxFQUFhQyxHLEVBQ3ZDQyxHLEVBQWFDLEcsRUFBYUMsRyxFQUFhQyxHLEVBQ3pDO0FBQ0VSLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVUEsR0FBVjtBQUFlZ0IsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVVBLEdBQVY7QUFBZWUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVBLEdBQVY7QUFBZWMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVVBLEdBQVY7QUFDN0NhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVTSxHQUFWO0FBQWVNLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVTSxHQUFWO0FBQWVLLFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVTSxHQUFWO0FBQWVJLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVTSxHQUFWO0FBQzdDRyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVVMsR0FBVjtBQUFlRCxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVVMsR0FBVjtBQUFlRixRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVVMsR0FBVjtBQUFlSCxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVVMsR0FBVjtBQUM3Q0osUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVVTLEdBQVY7QUFBZUwsUUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVVTLEdBQVY7QUFBZU4sUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVTLEdBQVY7QUFBZVAsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVVTLEdBQVY7QUFDN0MsZUFBT1IsR0FBUDtBQUNIO0FBRUQ7Ozs7OzsrQkFHZ0RBLEcsRUFBVTtBQUN0REEsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVLENBQVY7QUFDQWdCLFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVLENBQVY7QUFDQWUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBVjtBQUNBYyxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVSxDQUFWO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVLENBQVY7QUFDQVksUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVUsQ0FBVjtBQUNBVyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFWO0FBQ0FVLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVUsQ0FBVjtBQUNBUSxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVSxDQUFWO0FBQ0FPLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQVY7QUFDQU0sUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVUsQ0FBVjtBQUNBSyxRQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVSxDQUFWO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVLENBQVY7QUFDQUcsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVUsQ0FBVjtBQUNBRSxRQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVSxDQUFWO0FBQ0EsZUFBT0MsR0FBUDtBQUNIO0FBRUQ7Ozs7OztnQ0FHaURBLEcsRUFBVWpCLEMsRUFBUTtBQUMvRDtBQUNBLFlBQUlpQixHQUFHLEtBQUtqQixDQUFaLEVBQWU7QUFDWCxjQUFNMEIsR0FBRyxHQUFHMUIsQ0FBQyxDQUFDRSxHQUFkO0FBQUEsY0FBbUJ5QixHQUFHLEdBQUczQixDQUFDLENBQUNHLEdBQTNCO0FBQUEsY0FBZ0N5QixHQUFHLEdBQUc1QixDQUFDLENBQUNJLEdBQXhDO0FBQUEsY0FBNkN5QixHQUFHLEdBQUc3QixDQUFDLENBQUNPLEdBQXJEO0FBQUEsY0FBMER1QixHQUFHLEdBQUc5QixDQUFDLENBQUNRLEdBQWxFO0FBQUEsY0FBdUV1QixHQUFHLEdBQUcvQixDQUFDLENBQUNZLEdBQS9FO0FBQ0FLLFVBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVRixDQUFDLENBQUNLLEdBQVo7QUFDQVksVUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVILENBQUMsQ0FBQ1MsR0FBWjtBQUNBUSxVQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVUosQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVcUIsR0FBVjtBQUNBVCxVQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVVAsQ0FBQyxDQUFDVSxHQUFaO0FBQ0FPLFVBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVUixDQUFDLENBQUNjLEdBQVo7QUFDQUcsVUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVrQixHQUFWO0FBQ0FWLFVBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVbUIsR0FBVjtBQUNBWixVQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVVosQ0FBQyxDQUFDZSxHQUFaO0FBQ0FFLFVBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVZSxHQUFWO0FBQ0FYLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZ0IsR0FBVjtBQUNBYixVQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVWdCLEdBQVY7QUFDSCxTQWRELE1BY087QUFDSGQsVUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVRCxDQUFDLENBQUNDLEdBQVo7QUFDQWdCLFVBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVRixDQUFDLENBQUNLLEdBQVo7QUFDQVksVUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVILENBQUMsQ0FBQ1MsR0FBWjtBQUNBUSxVQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVUosQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVTCxDQUFDLENBQUNFLEdBQVo7QUFDQWUsVUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVVOLENBQUMsQ0FBQ00sR0FBWjtBQUNBVyxVQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVVAsQ0FBQyxDQUFDVSxHQUFaO0FBQ0FPLFVBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVUixDQUFDLENBQUNjLEdBQVo7QUFDQUcsVUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVULENBQUMsQ0FBQ0csR0FBWjtBQUNBYyxVQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVVYsQ0FBQyxDQUFDTyxHQUFaO0FBQ0FVLFVBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVWCxDQUFDLENBQUNXLEdBQVo7QUFDQU0sVUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVaLENBQUMsQ0FBQ2UsR0FBWjtBQUNBRSxVQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVWIsQ0FBQyxDQUFDSSxHQUFaO0FBQ0FhLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNRLEdBQVo7QUFDQVMsVUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVmLENBQUMsQ0FBQ1ksR0FBWjtBQUNBSyxVQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVWhCLENBQUMsQ0FBQ2dCLEdBQVo7QUFDSDs7QUFDRCxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OzZCQUc4Q0EsRyxFQUFVakIsQyxFQUFRO0FBRTVELFlBQU1nQyxHQUFHLEdBQUdoQyxDQUFDLENBQUNDLEdBQWQ7QUFBbUIsWUFBTXlCLEdBQUcsR0FBRzFCLENBQUMsQ0FBQ0UsR0FBZDtBQUFtQixZQUFNeUIsR0FBRyxHQUFHM0IsQ0FBQyxDQUFDRyxHQUFkO0FBQW1CLFlBQU15QixHQUFHLEdBQUc1QixDQUFDLENBQUNJLEdBQWQ7QUFDekQsWUFBTTZCLEdBQUcsR0FBR2pDLENBQUMsQ0FBQ0ssR0FBZDtBQUFtQixZQUFNNkIsR0FBRyxHQUFHbEMsQ0FBQyxDQUFDTSxHQUFkO0FBQW1CLFlBQU11QixHQUFHLEdBQUc3QixDQUFDLENBQUNPLEdBQWQ7QUFBbUIsWUFBTXVCLEdBQUcsR0FBRzlCLENBQUMsQ0FBQ1EsR0FBZDtBQUN6RCxZQUFNMkIsR0FBRyxHQUFHbkMsQ0FBQyxDQUFDUyxHQUFkO0FBQW1CLFlBQU0yQixHQUFHLEdBQUdwQyxDQUFDLENBQUNVLEdBQWQ7QUFBbUIsWUFBTTJCLEdBQUcsR0FBR3JDLENBQUMsQ0FBQ1csR0FBZDtBQUFtQixZQUFNb0IsR0FBRyxHQUFHL0IsQ0FBQyxDQUFDWSxHQUFkO0FBQ3pELFlBQU0wQixHQUFHLEdBQUd0QyxDQUFDLENBQUNhLEdBQWQ7QUFBbUIsWUFBTTBCLEdBQUcsR0FBR3ZDLENBQUMsQ0FBQ2MsR0FBZDtBQUFtQixZQUFNMEIsR0FBRyxHQUFHeEMsQ0FBQyxDQUFDZSxHQUFkO0FBQW1CLFlBQU0wQixHQUFHLEdBQUd6QyxDQUFDLENBQUNnQixHQUFkO0FBRXpELFlBQU0wQixHQUFHLEdBQUdWLEdBQUcsR0FBR0UsR0FBTixHQUFZUixHQUFHLEdBQUdPLEdBQTlCO0FBQ0EsWUFBTVUsR0FBRyxHQUFHWCxHQUFHLEdBQUdILEdBQU4sR0FBWUYsR0FBRyxHQUFHTSxHQUE5QjtBQUNBLFlBQU1XLEdBQUcsR0FBR1osR0FBRyxHQUFHRixHQUFOLEdBQVlGLEdBQUcsR0FBR0ssR0FBOUI7QUFDQSxZQUFNWSxHQUFHLEdBQUduQixHQUFHLEdBQUdHLEdBQU4sR0FBWUYsR0FBRyxHQUFHTyxHQUE5QjtBQUNBLFlBQU1ZLEdBQUcsR0FBR3BCLEdBQUcsR0FBR0ksR0FBTixHQUFZRixHQUFHLEdBQUdNLEdBQTlCO0FBQ0EsWUFBTWEsR0FBRyxHQUFHcEIsR0FBRyxHQUFHRyxHQUFOLEdBQVlGLEdBQUcsR0FBR0MsR0FBOUI7QUFDQSxZQUFNbUIsR0FBRyxHQUFHYixHQUFHLEdBQUdJLEdBQU4sR0FBWUgsR0FBRyxHQUFHRSxHQUE5QjtBQUNBLFlBQU1XLEdBQUcsR0FBR2QsR0FBRyxHQUFHSyxHQUFOLEdBQVlILEdBQUcsR0FBR0MsR0FBOUI7QUFDQSxZQUFNWSxHQUFHLEdBQUdmLEdBQUcsR0FBR00sR0FBTixHQUFZVixHQUFHLEdBQUdPLEdBQTlCO0FBQ0EsWUFBTWEsR0FBRyxHQUFHZixHQUFHLEdBQUdJLEdBQU4sR0FBWUgsR0FBRyxHQUFHRSxHQUE5QjtBQUNBLFlBQU1hLEdBQUcsR0FBR2hCLEdBQUcsR0FBR0ssR0FBTixHQUFZVixHQUFHLEdBQUdRLEdBQTlCO0FBQ0EsWUFBTWMsR0FBRyxHQUFHaEIsR0FBRyxHQUFHSSxHQUFOLEdBQVlWLEdBQUcsR0FBR1MsR0FBOUIsQ0FsQjRELENBb0I1RDs7QUFDQSxZQUFJYyxHQUFHLEdBQUdaLEdBQUcsR0FBR1csR0FBTixHQUFZVixHQUFHLEdBQUdTLEdBQWxCLEdBQXdCUixHQUFHLEdBQUdPLEdBQTlCLEdBQW9DTixHQUFHLEdBQUdLLEdBQTFDLEdBQWdESixHQUFHLEdBQUdHLEdBQXRELEdBQTRERixHQUFHLEdBQUdDLEdBQTVFOztBQUVBLFlBQUlNLEdBQUcsS0FBSyxDQUFaLEVBQWU7QUFDWHJDLFVBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVSxDQUFWO0FBQWFnQixVQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVSxDQUFWO0FBQWFlLFVBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVLENBQVY7QUFBYWMsVUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUN2Q2EsVUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVUsQ0FBVjtBQUFhWSxVQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVSxDQUFWO0FBQWFXLFVBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVLENBQVY7QUFBYVUsVUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUN2Q1MsVUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVUsQ0FBVjtBQUFhUSxVQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVSxDQUFWO0FBQWFPLFVBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQVY7QUFBYU0sVUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVUsQ0FBVjtBQUN2Q0ssVUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUFhSSxVQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQWFHLFVBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVLENBQVY7QUFBYUUsVUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUN2QyxpQkFBT0MsR0FBUDtBQUNIOztBQUNEcUMsUUFBQUEsR0FBRyxHQUFHLE1BQU1BLEdBQVo7QUFFQXJDLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVSxDQUFDaUMsR0FBRyxHQUFHbUIsR0FBTixHQUFZeEIsR0FBRyxHQUFHdUIsR0FBbEIsR0FBd0J0QixHQUFHLEdBQUdxQixHQUEvQixJQUFzQ0csR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVLENBQUN5QixHQUFHLEdBQUd5QixHQUFOLEdBQVkxQixHQUFHLEdBQUcyQixHQUFsQixHQUF3QnpCLEdBQUcsR0FBR3VCLEdBQS9CLElBQXNDRyxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBQ29DLEdBQUcsR0FBR1EsR0FBTixHQUFZUCxHQUFHLEdBQUdNLEdBQWxCLEdBQXdCTCxHQUFHLEdBQUdJLEdBQS9CLElBQXNDUyxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBQ2lDLEdBQUcsR0FBR1MsR0FBTixHQUFZVixHQUFHLEdBQUdXLEdBQWxCLEdBQXdCaEIsR0FBRyxHQUFHYyxHQUEvQixJQUFzQ1MsR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVLENBQUN3QixHQUFHLEdBQUdxQixHQUFOLEdBQVlqQixHQUFHLEdBQUdvQixHQUFsQixHQUF3QnZCLEdBQUcsR0FBR21CLEdBQS9CLElBQXNDSyxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVUsQ0FBQzBCLEdBQUcsR0FBR3FCLEdBQU4sR0FBWTFCLEdBQUcsR0FBR3VCLEdBQWxCLEdBQXdCdEIsR0FBRyxHQUFHcUIsR0FBL0IsSUFBc0NLLEdBQWhEO0FBQ0FyQyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFDaUMsR0FBRyxHQUFHSSxHQUFOLEdBQVlOLEdBQUcsR0FBR1MsR0FBbEIsR0FBd0JOLEdBQUcsR0FBR0UsR0FBL0IsSUFBc0NXLEdBQWhEO0FBQ0FyQyxRQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVSxDQUFDMkIsR0FBRyxHQUFHWSxHQUFOLEdBQVlWLEdBQUcsR0FBR08sR0FBbEIsR0FBd0JiLEdBQUcsR0FBR1ksR0FBL0IsSUFBc0NXLEdBQWhEO0FBQ0FyQyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFDd0IsR0FBRyxHQUFHbUIsR0FBTixHQUFZbEIsR0FBRyxHQUFHZ0IsR0FBbEIsR0FBd0JwQixHQUFHLEdBQUdrQixHQUEvQixJQUFzQ00sR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQUNnQixHQUFHLEdBQUd3QixHQUFOLEdBQVlsQixHQUFHLEdBQUdvQixHQUFsQixHQUF3QnhCLEdBQUcsR0FBR29CLEdBQS9CLElBQXNDTSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVUsQ0FBQzJCLEdBQUcsR0FBR1EsR0FBTixHQUFZUCxHQUFHLEdBQUdLLEdBQWxCLEdBQXdCSCxHQUFHLEdBQUdDLEdBQS9CLElBQXNDWSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVUsQ0FBQ3dCLEdBQUcsR0FBR1EsR0FBTixHQUFZVCxHQUFHLEdBQUdXLEdBQWxCLEdBQXdCZixHQUFHLEdBQUdXLEdBQS9CLElBQXNDWSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBQ3FCLEdBQUcsR0FBR2UsR0FBTixHQUFZaEIsR0FBRyxHQUFHa0IsR0FBbEIsR0FBd0J0QixHQUFHLEdBQUdtQixHQUEvQixJQUFzQ00sR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVLENBQUNrQixHQUFHLEdBQUdtQixHQUFOLEdBQVl6QixHQUFHLEdBQUd1QixHQUFsQixHQUF3QnRCLEdBQUcsR0FBR3FCLEdBQS9CLElBQXNDTSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVUsQ0FBQ3dCLEdBQUcsR0FBR0ksR0FBTixHQUFZTCxHQUFHLEdBQUdPLEdBQWxCLEdBQXdCTCxHQUFHLEdBQUdFLEdBQS9CLElBQXNDWSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBQ21CLEdBQUcsR0FBR1UsR0FBTixHQUFZVCxHQUFHLEdBQUdPLEdBQWxCLEdBQXdCTixHQUFHLEdBQUdLLEdBQS9CLElBQXNDWSxHQUFoRDtBQUVBLGVBQU9yQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7O2tDQUdtRGpCLEMsRUFBZ0I7QUFDL0QsWUFBTWdDLEdBQUcsR0FBR2hDLENBQUMsQ0FBQ0MsR0FBZDtBQUFtQixZQUFNeUIsR0FBRyxHQUFHMUIsQ0FBQyxDQUFDRSxHQUFkO0FBQW1CLFlBQU15QixHQUFHLEdBQUczQixDQUFDLENBQUNHLEdBQWQ7QUFBbUIsWUFBTXlCLEdBQUcsR0FBRzVCLENBQUMsQ0FBQ0ksR0FBZDtBQUN6RCxZQUFNNkIsR0FBRyxHQUFHakMsQ0FBQyxDQUFDSyxHQUFkO0FBQW1CLFlBQU02QixHQUFHLEdBQUdsQyxDQUFDLENBQUNNLEdBQWQ7QUFBbUIsWUFBTXVCLEdBQUcsR0FBRzdCLENBQUMsQ0FBQ08sR0FBZDtBQUFtQixZQUFNdUIsR0FBRyxHQUFHOUIsQ0FBQyxDQUFDUSxHQUFkO0FBQ3pELFlBQU0yQixHQUFHLEdBQUduQyxDQUFDLENBQUNTLEdBQWQ7QUFBbUIsWUFBTTJCLEdBQUcsR0FBR3BDLENBQUMsQ0FBQ1UsR0FBZDtBQUFtQixZQUFNMkIsR0FBRyxHQUFHckMsQ0FBQyxDQUFDVyxHQUFkO0FBQW1CLFlBQU1vQixHQUFHLEdBQUcvQixDQUFDLENBQUNZLEdBQWQ7QUFDekQsWUFBTTBCLEdBQUcsR0FBR3RDLENBQUMsQ0FBQ2EsR0FBZDtBQUFtQixZQUFNMEIsR0FBRyxHQUFHdkMsQ0FBQyxDQUFDYyxHQUFkO0FBQW1CLFlBQU0wQixHQUFHLEdBQUd4QyxDQUFDLENBQUNlLEdBQWQ7QUFBbUIsWUFBTTBCLEdBQUcsR0FBR3pDLENBQUMsQ0FBQ2dCLEdBQWQ7QUFFekQsWUFBTTBCLEdBQUcsR0FBR1YsR0FBRyxHQUFHRSxHQUFOLEdBQVlSLEdBQUcsR0FBR08sR0FBOUI7QUFDQSxZQUFNVSxHQUFHLEdBQUdYLEdBQUcsR0FBR0gsR0FBTixHQUFZRixHQUFHLEdBQUdNLEdBQTlCO0FBQ0EsWUFBTVcsR0FBRyxHQUFHWixHQUFHLEdBQUdGLEdBQU4sR0FBWUYsR0FBRyxHQUFHSyxHQUE5QjtBQUNBLFlBQU1ZLEdBQUcsR0FBR25CLEdBQUcsR0FBR0csR0FBTixHQUFZRixHQUFHLEdBQUdPLEdBQTlCO0FBQ0EsWUFBTVksR0FBRyxHQUFHcEIsR0FBRyxHQUFHSSxHQUFOLEdBQVlGLEdBQUcsR0FBR00sR0FBOUI7QUFDQSxZQUFNYSxHQUFHLEdBQUdwQixHQUFHLEdBQUdHLEdBQU4sR0FBWUYsR0FBRyxHQUFHQyxHQUE5QjtBQUNBLFlBQU1tQixHQUFHLEdBQUdiLEdBQUcsR0FBR0ksR0FBTixHQUFZSCxHQUFHLEdBQUdFLEdBQTlCO0FBQ0EsWUFBTVcsR0FBRyxHQUFHZCxHQUFHLEdBQUdLLEdBQU4sR0FBWUgsR0FBRyxHQUFHQyxHQUE5QjtBQUNBLFlBQU1ZLEdBQUcsR0FBR2YsR0FBRyxHQUFHTSxHQUFOLEdBQVlWLEdBQUcsR0FBR08sR0FBOUI7QUFDQSxZQUFNYSxHQUFHLEdBQUdmLEdBQUcsR0FBR0ksR0FBTixHQUFZSCxHQUFHLEdBQUdFLEdBQTlCO0FBQ0EsWUFBTWEsR0FBRyxHQUFHaEIsR0FBRyxHQUFHSyxHQUFOLEdBQVlWLEdBQUcsR0FBR1EsR0FBOUI7QUFDQSxZQUFNYyxHQUFHLEdBQUdoQixHQUFHLEdBQUdJLEdBQU4sR0FBWVYsR0FBRyxHQUFHUyxHQUE5QixDQWpCK0QsQ0FtQi9EOztBQUNBLGVBQU9FLEdBQUcsR0FBR1csR0FBTixHQUFZVixHQUFHLEdBQUdTLEdBQWxCLEdBQXdCUixHQUFHLEdBQUdPLEdBQTlCLEdBQW9DTixHQUFHLEdBQUdLLEdBQTFDLEdBQWdESixHQUFHLEdBQUdHLEdBQXRELEdBQTRERixHQUFHLEdBQUdDLEdBQXpFO0FBQ0g7QUFFRDs7Ozs7OytCQUdnRC9CLEcsRUFBVWpCLEMsRUFBUXVELEMsRUFBUTtBQUN0RSxZQUFNdkIsR0FBRyxHQUFHaEMsQ0FBQyxDQUFDQyxHQUFkO0FBQW1CLFlBQU15QixHQUFHLEdBQUcxQixDQUFDLENBQUNFLEdBQWQ7QUFBbUIsWUFBTXlCLEdBQUcsR0FBRzNCLENBQUMsQ0FBQ0csR0FBZDtBQUFtQixZQUFNeUIsR0FBRyxHQUFHNUIsQ0FBQyxDQUFDSSxHQUFkO0FBQ3pELFlBQU02QixHQUFHLEdBQUdqQyxDQUFDLENBQUNLLEdBQWQ7QUFBbUIsWUFBTTZCLEdBQUcsR0FBR2xDLENBQUMsQ0FBQ00sR0FBZDtBQUFtQixZQUFNdUIsR0FBRyxHQUFHN0IsQ0FBQyxDQUFDTyxHQUFkO0FBQW1CLFlBQU11QixHQUFHLEdBQUc5QixDQUFDLENBQUNRLEdBQWQ7QUFDekQsWUFBTTJCLEdBQUcsR0FBR25DLENBQUMsQ0FBQ1MsR0FBZDtBQUFtQixZQUFNMkIsR0FBRyxHQUFHcEMsQ0FBQyxDQUFDVSxHQUFkO0FBQW1CLFlBQU0yQixHQUFHLEdBQUdyQyxDQUFDLENBQUNXLEdBQWQ7QUFBbUIsWUFBTW9CLEdBQUcsR0FBRy9CLENBQUMsQ0FBQ1ksR0FBZDtBQUN6RCxZQUFNMEIsR0FBRyxHQUFHdEMsQ0FBQyxDQUFDYSxHQUFkO0FBQW1CLFlBQU0wQixHQUFHLEdBQUd2QyxDQUFDLENBQUNjLEdBQWQ7QUFBbUIsWUFBTTBCLEdBQUcsR0FBR3hDLENBQUMsQ0FBQ2UsR0FBZDtBQUFtQixZQUFNMEIsR0FBRyxHQUFHekMsQ0FBQyxDQUFDZ0IsR0FBZCxDQUphLENBTXRFOztBQUNBLFlBQUl3QyxFQUFFLEdBQUdELENBQUMsQ0FBQ3RELEdBQVg7QUFBQSxZQUFnQndELEVBQUUsR0FBR0YsQ0FBQyxDQUFDckQsR0FBdkI7QUFBQSxZQUE0QndELEVBQUUsR0FBR0gsQ0FBQyxDQUFDcEQsR0FBbkM7QUFBQSxZQUF3Q3dELEVBQUUsR0FBR0osQ0FBQyxDQUFDbkQsR0FBL0M7QUFDQWEsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVdUQsRUFBRSxHQUFHeEIsR0FBTCxHQUFXeUIsRUFBRSxHQUFHeEIsR0FBaEIsR0FBc0J5QixFQUFFLEdBQUd2QixHQUEzQixHQUFpQ3dCLEVBQUUsR0FBR3JCLEdBQWhEO0FBQ0FyQixRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVXNELEVBQUUsR0FBRzlCLEdBQUwsR0FBVytCLEVBQUUsR0FBR3ZCLEdBQWhCLEdBQXNCd0IsRUFBRSxHQUFHdEIsR0FBM0IsR0FBaUN1QixFQUFFLEdBQUdwQixHQUFoRDtBQUNBdEIsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVxRCxFQUFFLEdBQUc3QixHQUFMLEdBQVc4QixFQUFFLEdBQUc1QixHQUFoQixHQUFzQjZCLEVBQUUsR0FBR3JCLEdBQTNCLEdBQWlDc0IsRUFBRSxHQUFHbkIsR0FBaEQ7QUFDQXZCLFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVb0QsRUFBRSxHQUFHNUIsR0FBTCxHQUFXNkIsRUFBRSxHQUFHM0IsR0FBaEIsR0FBc0I0QixFQUFFLEdBQUczQixHQUEzQixHQUFpQzRCLEVBQUUsR0FBR2xCLEdBQWhEO0FBRUFlLFFBQUFBLEVBQUUsR0FBR0QsQ0FBQyxDQUFDbEQsR0FBUDtBQUFZb0QsUUFBQUEsRUFBRSxHQUFHRixDQUFDLENBQUNqRCxHQUFQO0FBQVlvRCxRQUFBQSxFQUFFLEdBQUdILENBQUMsQ0FBQ2hELEdBQVA7QUFBWW9ELFFBQUFBLEVBQUUsR0FBR0osQ0FBQyxDQUFDL0MsR0FBUDtBQUNwQ1MsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVVtRCxFQUFFLEdBQUd4QixHQUFMLEdBQVd5QixFQUFFLEdBQUd4QixHQUFoQixHQUFzQnlCLEVBQUUsR0FBR3ZCLEdBQTNCLEdBQWlDd0IsRUFBRSxHQUFHckIsR0FBaEQ7QUFDQXJCLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVa0QsRUFBRSxHQUFHOUIsR0FBTCxHQUFXK0IsRUFBRSxHQUFHdkIsR0FBaEIsR0FBc0J3QixFQUFFLEdBQUd0QixHQUEzQixHQUFpQ3VCLEVBQUUsR0FBR3BCLEdBQWhEO0FBQ0F0QixRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVWlELEVBQUUsR0FBRzdCLEdBQUwsR0FBVzhCLEVBQUUsR0FBRzVCLEdBQWhCLEdBQXNCNkIsRUFBRSxHQUFHckIsR0FBM0IsR0FBaUNzQixFQUFFLEdBQUduQixHQUFoRDtBQUNBdkIsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVnRCxFQUFFLEdBQUc1QixHQUFMLEdBQVc2QixFQUFFLEdBQUczQixHQUFoQixHQUFzQjRCLEVBQUUsR0FBRzNCLEdBQTNCLEdBQWlDNEIsRUFBRSxHQUFHbEIsR0FBaEQ7QUFFQWUsUUFBQUEsRUFBRSxHQUFHRCxDQUFDLENBQUM5QyxHQUFQO0FBQVlnRCxRQUFBQSxFQUFFLEdBQUdGLENBQUMsQ0FBQzdDLEdBQVA7QUFBWWdELFFBQUFBLEVBQUUsR0FBR0gsQ0FBQyxDQUFDNUMsR0FBUDtBQUFZZ0QsUUFBQUEsRUFBRSxHQUFHSixDQUFDLENBQUMzQyxHQUFQO0FBQ3BDSyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVStDLEVBQUUsR0FBR3hCLEdBQUwsR0FBV3lCLEVBQUUsR0FBR3hCLEdBQWhCLEdBQXNCeUIsRUFBRSxHQUFHdkIsR0FBM0IsR0FBaUN3QixFQUFFLEdBQUdyQixHQUFoRDtBQUNBckIsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVU4QyxFQUFFLEdBQUc5QixHQUFMLEdBQVcrQixFQUFFLEdBQUd2QixHQUFoQixHQUFzQndCLEVBQUUsR0FBR3RCLEdBQTNCLEdBQWlDdUIsRUFBRSxHQUFHcEIsR0FBaEQ7QUFDQXRCLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVNkMsRUFBRSxHQUFHN0IsR0FBTCxHQUFXOEIsRUFBRSxHQUFHNUIsR0FBaEIsR0FBc0I2QixFQUFFLEdBQUdyQixHQUEzQixHQUFpQ3NCLEVBQUUsR0FBR25CLEdBQWhEO0FBQ0F2QixRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVTRDLEVBQUUsR0FBRzVCLEdBQUwsR0FBVzZCLEVBQUUsR0FBRzNCLEdBQWhCLEdBQXNCNEIsRUFBRSxHQUFHM0IsR0FBM0IsR0FBaUM0QixFQUFFLEdBQUdsQixHQUFoRDtBQUVBZSxRQUFBQSxFQUFFLEdBQUdELENBQUMsQ0FBQzFDLEdBQVA7QUFBWTRDLFFBQUFBLEVBQUUsR0FBR0YsQ0FBQyxDQUFDekMsR0FBUDtBQUFZNEMsUUFBQUEsRUFBRSxHQUFHSCxDQUFDLENBQUN4QyxHQUFQO0FBQVk0QyxRQUFBQSxFQUFFLEdBQUdKLENBQUMsQ0FBQ3ZDLEdBQVA7QUFDcENDLFFBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVMkMsRUFBRSxHQUFHeEIsR0FBTCxHQUFXeUIsRUFBRSxHQUFHeEIsR0FBaEIsR0FBc0J5QixFQUFFLEdBQUd2QixHQUEzQixHQUFpQ3dCLEVBQUUsR0FBR3JCLEdBQWhEO0FBQ0FyQixRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVTBDLEVBQUUsR0FBRzlCLEdBQUwsR0FBVytCLEVBQUUsR0FBR3ZCLEdBQWhCLEdBQXNCd0IsRUFBRSxHQUFHdEIsR0FBM0IsR0FBaUN1QixFQUFFLEdBQUdwQixHQUFoRDtBQUNBdEIsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVV5QyxFQUFFLEdBQUc3QixHQUFMLEdBQVc4QixFQUFFLEdBQUc1QixHQUFoQixHQUFzQjZCLEVBQUUsR0FBR3JCLEdBQTNCLEdBQWlDc0IsRUFBRSxHQUFHbkIsR0FBaEQ7QUFDQXZCLFFBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVd0MsRUFBRSxHQUFHNUIsR0FBTCxHQUFXNkIsRUFBRSxHQUFHM0IsR0FBaEIsR0FBc0I0QixFQUFFLEdBQUczQixHQUEzQixHQUFpQzRCLEVBQUUsR0FBR2xCLEdBQWhEO0FBQ0EsZUFBT3hCLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Z0NBRzRFQSxHLEVBQVVqQixDLEVBQVE0RCxDLEVBQVk7QUFDdEcsWUFBTUMsQ0FBQyxHQUFHRCxDQUFDLENBQUNDLENBQVo7QUFBQSxZQUFlQyxDQUFDLEdBQUdGLENBQUMsQ0FBQ0UsQ0FBckI7QUFBQSxZQUF3QkMsQ0FBQyxHQUFHSCxDQUFDLENBQUNHLENBQTlCOztBQUNBLFlBQUkvRCxDQUFDLEtBQUtpQixHQUFWLEVBQWU7QUFDWEEsVUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVViLENBQUMsQ0FBQ0MsR0FBRixHQUFRNEQsQ0FBUixHQUFZN0QsQ0FBQyxDQUFDSyxHQUFGLEdBQVF5RCxDQUFwQixHQUF3QjlELENBQUMsQ0FBQ1MsR0FBRixHQUFRc0QsQ0FBaEMsR0FBb0MvRCxDQUFDLENBQUNhLEdBQWhEO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNFLEdBQUYsR0FBUTJELENBQVIsR0FBWTdELENBQUMsQ0FBQ00sR0FBRixHQUFRd0QsQ0FBcEIsR0FBd0I5RCxDQUFDLENBQUNVLEdBQUYsR0FBUXFELENBQWhDLEdBQW9DL0QsQ0FBQyxDQUFDYyxHQUFoRDtBQUNBRyxVQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVWYsQ0FBQyxDQUFDRyxHQUFGLEdBQVEwRCxDQUFSLEdBQVk3RCxDQUFDLENBQUNPLEdBQUYsR0FBUXVELENBQXBCLEdBQXdCOUQsQ0FBQyxDQUFDVyxHQUFGLEdBQVFvRCxDQUFoQyxHQUFvQy9ELENBQUMsQ0FBQ2UsR0FBaEQ7QUFDQUUsVUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVVoQixDQUFDLENBQUNJLEdBQUYsR0FBUXlELENBQVIsR0FBWTdELENBQUMsQ0FBQ1EsR0FBRixHQUFRc0QsQ0FBcEIsR0FBd0I5RCxDQUFDLENBQUNZLEdBQUYsR0FBUW1ELENBQWhDLEdBQW9DL0QsQ0FBQyxDQUFDZ0IsR0FBaEQ7QUFDSCxTQUxELE1BS087QUFDSCxjQUFNZ0IsR0FBRyxHQUFHaEMsQ0FBQyxDQUFDQyxHQUFkO0FBQW1CLGNBQU15QixHQUFHLEdBQUcxQixDQUFDLENBQUNFLEdBQWQ7QUFBbUIsY0FBTXlCLEdBQUcsR0FBRzNCLENBQUMsQ0FBQ0csR0FBZDtBQUFtQixjQUFNeUIsR0FBRyxHQUFHNUIsQ0FBQyxDQUFDSSxHQUFkO0FBQ3pELGNBQU02QixHQUFHLEdBQUdqQyxDQUFDLENBQUNLLEdBQWQ7QUFBbUIsY0FBTTZCLEdBQUcsR0FBR2xDLENBQUMsQ0FBQ00sR0FBZDtBQUFtQixjQUFNdUIsR0FBRyxHQUFHN0IsQ0FBQyxDQUFDTyxHQUFkO0FBQW1CLGNBQU11QixHQUFHLEdBQUc5QixDQUFDLENBQUNRLEdBQWQ7QUFDekQsY0FBTTJCLEdBQUcsR0FBR25DLENBQUMsQ0FBQ1MsR0FBZDtBQUFtQixjQUFNMkIsR0FBRyxHQUFHcEMsQ0FBQyxDQUFDVSxHQUFkO0FBQW1CLGNBQU0yQixHQUFHLEdBQUdyQyxDQUFDLENBQUNXLEdBQWQ7QUFBbUIsY0FBTW9CLEdBQUcsR0FBRy9CLENBQUMsQ0FBQ1ksR0FBZDtBQUN6RCxjQUFNMEIsR0FBRyxHQUFHdEMsQ0FBQyxDQUFDYSxHQUFkO0FBQW1CLGNBQU0wQixHQUFHLEdBQUd2QyxDQUFDLENBQUNjLEdBQWQ7QUFBbUIsY0FBTTBCLEdBQUcsR0FBR3hDLENBQUMsQ0FBQ2UsR0FBZDtBQUFtQixjQUFNMEIsR0FBRyxHQUFHekMsQ0FBQyxDQUFDZ0IsR0FBZDtBQUV6REMsVUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVK0IsR0FBVjtBQUFlZixVQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVXdCLEdBQVY7QUFBZVQsVUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVV3QixHQUFWO0FBQWVWLFVBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVd0IsR0FBVjtBQUM3Q1gsVUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVU0QixHQUFWO0FBQWVoQixVQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVTRCLEdBQVY7QUFBZWpCLFVBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVc0IsR0FBVjtBQUFlWixVQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVXNCLEdBQVY7QUFDN0NiLFVBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVMEIsR0FBVjtBQUFlbEIsVUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUwQixHQUFWO0FBQWVuQixVQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVTBCLEdBQVY7QUFBZXBCLFVBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVbUIsR0FBVjtBQUU3Q2QsVUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVVtQixHQUFHLEdBQUc2QixDQUFOLEdBQVU1QixHQUFHLEdBQUc2QixDQUFoQixHQUFvQjNCLEdBQUcsR0FBRzRCLENBQTFCLEdBQThCL0QsQ0FBQyxDQUFDYSxHQUExQztBQUNBSSxVQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVVksR0FBRyxHQUFHbUMsQ0FBTixHQUFVM0IsR0FBRyxHQUFHNEIsQ0FBaEIsR0FBb0IxQixHQUFHLEdBQUcyQixDQUExQixHQUE4Qi9ELENBQUMsQ0FBQ2MsR0FBMUM7QUFDQUcsVUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVZLEdBQUcsR0FBR2tDLENBQU4sR0FBVWhDLEdBQUcsR0FBR2lDLENBQWhCLEdBQW9CekIsR0FBRyxHQUFHMEIsQ0FBMUIsR0FBOEIvRCxDQUFDLENBQUNlLEdBQTFDO0FBQ0FFLFVBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVWSxHQUFHLEdBQUdpQyxDQUFOLEdBQVUvQixHQUFHLEdBQUdnQyxDQUFoQixHQUFvQi9CLEdBQUcsR0FBR2dDLENBQTFCLEdBQThCL0QsQ0FBQyxDQUFDZ0IsR0FBMUM7QUFDSDs7QUFDRCxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7O2dDQUc0RUEsRyxFQUFVakIsQyxFQUFRNEQsQyxFQUFZO0FBQ3RHSSxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxrQkFBYjs7QUFDQSxZQUFJakUsQ0FBQyxLQUFLaUIsR0FBVixFQUFlO0FBQ1hBLFVBQUFBLEdBQUcsQ0FBQ0osR0FBSixJQUFXK0MsQ0FBQyxDQUFDQyxDQUFiO0FBQ0E1QyxVQUFBQSxHQUFHLENBQUNILEdBQUosSUFBVzhDLENBQUMsQ0FBQ0UsQ0FBYjtBQUNBN0MsVUFBQUEsR0FBRyxDQUFDRixHQUFKLElBQVc2QyxDQUFDLENBQUNHLENBQWI7QUFDSCxTQUpELE1BSU87QUFDSDlDLFVBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVUQsQ0FBQyxDQUFDQyxHQUFaO0FBQWlCZ0IsVUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVVGLENBQUMsQ0FBQ0UsR0FBWjtBQUFpQmUsVUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVILENBQUMsQ0FBQ0csR0FBWjtBQUFpQmMsVUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVVKLENBQUMsQ0FBQ0ksR0FBWjtBQUNuRGEsVUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVVMLENBQUMsQ0FBQ0ssR0FBWjtBQUFpQlksVUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVVOLENBQUMsQ0FBQ00sR0FBWjtBQUFpQlcsVUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVQLENBQUMsQ0FBQ08sR0FBWjtBQUFpQlUsVUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVSLENBQUMsQ0FBQ1EsR0FBWjtBQUNuRFMsVUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVULENBQUMsQ0FBQ1MsR0FBWjtBQUFpQlEsVUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVVWLENBQUMsQ0FBQ1UsR0FBWjtBQUFpQk8sVUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVYLENBQUMsQ0FBQ1csR0FBWjtBQUFpQk0sVUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVaLENBQUMsQ0FBQ1ksR0FBWjtBQUNuREssVUFBQUEsR0FBRyxDQUFDSixHQUFKLElBQVcrQyxDQUFDLENBQUNDLENBQWI7QUFDQTVDLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixJQUFXOEMsQ0FBQyxDQUFDRSxDQUFiO0FBQ0E3QyxVQUFBQSxHQUFHLENBQUNGLEdBQUosSUFBVzZDLENBQUMsQ0FBQ0csQ0FBYjtBQUNBOUMsVUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVVoQixDQUFDLENBQUNnQixHQUFaO0FBQ0g7O0FBQ0QsZUFBT0MsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs0QkFHd0VBLEcsRUFBVWpCLEMsRUFBUTRELEMsRUFBWTtBQUNsRyxZQUFNQyxDQUFDLEdBQUdELENBQUMsQ0FBQ0MsQ0FBWjtBQUFBLFlBQWVDLENBQUMsR0FBR0YsQ0FBQyxDQUFDRSxDQUFyQjtBQUFBLFlBQXdCQyxDQUFDLEdBQUdILENBQUMsQ0FBQ0csQ0FBOUI7QUFDQTlDLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVUQsQ0FBQyxDQUFDQyxHQUFGLEdBQVE0RCxDQUFsQjtBQUNBNUMsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVVGLENBQUMsQ0FBQ0UsR0FBRixHQUFRMkQsQ0FBbEI7QUFDQTVDLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVSCxDQUFDLENBQUNHLEdBQUYsR0FBUTBELENBQWxCO0FBQ0E1QyxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVUosQ0FBQyxDQUFDSSxHQUFGLEdBQVF5RCxDQUFsQjtBQUNBNUMsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVVMLENBQUMsQ0FBQ0ssR0FBRixHQUFReUQsQ0FBbEI7QUFDQTdDLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVTixDQUFDLENBQUNNLEdBQUYsR0FBUXdELENBQWxCO0FBQ0E3QyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVVAsQ0FBQyxDQUFDTyxHQUFGLEdBQVF1RCxDQUFsQjtBQUNBN0MsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVSLENBQUMsQ0FBQ1EsR0FBRixHQUFRc0QsQ0FBbEI7QUFDQTdDLFFBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVVCxDQUFDLENBQUNTLEdBQUYsR0FBUXNELENBQWxCO0FBQ0E5QyxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVVYsQ0FBQyxDQUFDVSxHQUFGLEdBQVFxRCxDQUFsQjtBQUNBOUMsUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVYLENBQUMsQ0FBQ1csR0FBRixHQUFRb0QsQ0FBbEI7QUFDQTlDLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVWixDQUFDLENBQUNZLEdBQUYsR0FBUW1ELENBQWxCO0FBQ0E5QyxRQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVWIsQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNjLEdBQVo7QUFDQUcsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVmLENBQUMsQ0FBQ2UsR0FBWjtBQUNBRSxRQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVWhCLENBQUMsQ0FBQ2dCLEdBQVo7QUFDQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7NkJBS3lFQSxHLEVBQVVqQixDLEVBQVFrRSxHLEVBQWFDLEksRUFBZTtBQUNuSCxZQUFJTixDQUFDLEdBQUdNLElBQUksQ0FBQ04sQ0FBYjtBQUFBLFlBQWdCQyxDQUFDLEdBQUdLLElBQUksQ0FBQ0wsQ0FBekI7QUFBQSxZQUE0QkMsQ0FBQyxHQUFHSSxJQUFJLENBQUNKLENBQXJDO0FBRUEsWUFBSUssR0FBRyxHQUFHQyxJQUFJLENBQUNDLElBQUwsQ0FBVVQsQ0FBQyxHQUFHQSxDQUFKLEdBQVFDLENBQUMsR0FBR0EsQ0FBWixHQUFnQkMsQ0FBQyxHQUFHQSxDQUE5QixDQUFWOztBQUVBLFlBQUlNLElBQUksQ0FBQ0UsR0FBTCxDQUFTSCxHQUFULElBQWdCSSxjQUFwQixFQUE2QjtBQUN6QixpQkFBTyxJQUFQO0FBQ0g7O0FBRURKLFFBQUFBLEdBQUcsR0FBRyxJQUFJQSxHQUFWO0FBQ0FQLFFBQUFBLENBQUMsSUFBSU8sR0FBTDtBQUNBTixRQUFBQSxDQUFDLElBQUlNLEdBQUw7QUFDQUwsUUFBQUEsQ0FBQyxJQUFJSyxHQUFMO0FBRUEsWUFBTUssQ0FBQyxHQUFHSixJQUFJLENBQUNLLEdBQUwsQ0FBU1IsR0FBVCxDQUFWO0FBQ0EsWUFBTVMsQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBU1YsR0FBVCxDQUFWO0FBQ0EsWUFBTVcsQ0FBQyxHQUFHLElBQUlGLENBQWQ7QUFFQSxZQUFNM0MsR0FBRyxHQUFHaEMsQ0FBQyxDQUFDQyxHQUFkO0FBQW1CLFlBQU15QixHQUFHLEdBQUcxQixDQUFDLENBQUNFLEdBQWQ7QUFBbUIsWUFBTXlCLEdBQUcsR0FBRzNCLENBQUMsQ0FBQ0csR0FBZDtBQUFtQixZQUFNeUIsR0FBRyxHQUFHNUIsQ0FBQyxDQUFDSSxHQUFkO0FBQ3pELFlBQU02QixHQUFHLEdBQUdqQyxDQUFDLENBQUNLLEdBQWQ7QUFBbUIsWUFBTTZCLEdBQUcsR0FBR2xDLENBQUMsQ0FBQ00sR0FBZDtBQUFtQixZQUFNdUIsR0FBRyxHQUFHN0IsQ0FBQyxDQUFDTyxHQUFkO0FBQW1CLFlBQU11QixHQUFHLEdBQUc5QixDQUFDLENBQUNRLEdBQWQ7QUFDekQsWUFBTTJCLEdBQUcsR0FBR25DLENBQUMsQ0FBQ1MsR0FBZDtBQUFtQixZQUFNMkIsR0FBRyxHQUFHcEMsQ0FBQyxDQUFDVSxHQUFkO0FBQW1CLFlBQU0yQixHQUFHLEdBQUdyQyxDQUFDLENBQUNXLEdBQWQ7QUFBbUIsWUFBTW9CLEdBQUcsR0FBRy9CLENBQUMsQ0FBQ1ksR0FBZCxDQXBCMEQsQ0FzQm5IOztBQUNBLFlBQU04QixHQUFHLEdBQUdtQixDQUFDLEdBQUdBLENBQUosR0FBUWdCLENBQVIsR0FBWUYsQ0FBeEI7QUFBQSxZQUEyQmhDLEdBQUcsR0FBR21CLENBQUMsR0FBR0QsQ0FBSixHQUFRZ0IsQ0FBUixHQUFZZCxDQUFDLEdBQUdVLENBQWpEO0FBQUEsWUFBb0Q3QixHQUFHLEdBQUdtQixDQUFDLEdBQUdGLENBQUosR0FBUWdCLENBQVIsR0FBWWYsQ0FBQyxHQUFHVyxDQUExRTtBQUNBLFlBQU1yQixHQUFHLEdBQUdTLENBQUMsR0FBR0MsQ0FBSixHQUFRZSxDQUFSLEdBQVlkLENBQUMsR0FBR1UsQ0FBNUI7QUFBQSxZQUErQnBCLEdBQUcsR0FBR1MsQ0FBQyxHQUFHQSxDQUFKLEdBQVFlLENBQVIsR0FBWUYsQ0FBakQ7QUFBQSxZQUFvREcsR0FBRyxHQUFHZixDQUFDLEdBQUdELENBQUosR0FBUWUsQ0FBUixHQUFZaEIsQ0FBQyxHQUFHWSxDQUExRTtBQUNBLFlBQU1NLEdBQUcsR0FBR2xCLENBQUMsR0FBR0UsQ0FBSixHQUFRYyxDQUFSLEdBQVlmLENBQUMsR0FBR1csQ0FBNUI7QUFBQSxZQUErQk8sR0FBRyxHQUFHbEIsQ0FBQyxHQUFHQyxDQUFKLEdBQVFjLENBQVIsR0FBWWhCLENBQUMsR0FBR1ksQ0FBckQ7QUFBQSxZQUF3RFEsR0FBRyxHQUFHbEIsQ0FBQyxHQUFHQSxDQUFKLEdBQVFjLENBQVIsR0FBWUYsQ0FBMUUsQ0F6Qm1ILENBMkJuSDs7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVStCLEdBQUcsR0FBR1UsR0FBTixHQUFZVCxHQUFHLEdBQUdVLEdBQWxCLEdBQXdCUixHQUFHLEdBQUdTLEdBQXhDO0FBQ0EzQixRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVXdCLEdBQUcsR0FBR2dCLEdBQU4sR0FBWVIsR0FBRyxHQUFHUyxHQUFsQixHQUF3QlAsR0FBRyxHQUFHUSxHQUF4QztBQUNBM0IsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVV3QixHQUFHLEdBQUdlLEdBQU4sR0FBWWIsR0FBRyxHQUFHYyxHQUFsQixHQUF3Qk4sR0FBRyxHQUFHTyxHQUF4QztBQUNBM0IsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVV3QixHQUFHLEdBQUdjLEdBQU4sR0FBWVosR0FBRyxHQUFHYSxHQUFsQixHQUF3QlosR0FBRyxHQUFHYSxHQUF4QztBQUNBM0IsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVUyQixHQUFHLEdBQUdvQixHQUFOLEdBQVluQixHQUFHLEdBQUdvQixHQUFsQixHQUF3QmxCLEdBQUcsR0FBRzJDLEdBQXhDO0FBQ0E3RCxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVW9CLEdBQUcsR0FBRzBCLEdBQU4sR0FBWWxCLEdBQUcsR0FBR21CLEdBQWxCLEdBQXdCakIsR0FBRyxHQUFHMEMsR0FBeEM7QUFDQTdELFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVb0IsR0FBRyxHQUFHeUIsR0FBTixHQUFZdkIsR0FBRyxHQUFHd0IsR0FBbEIsR0FBd0JoQixHQUFHLEdBQUd5QyxHQUF4QztBQUNBN0QsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVvQixHQUFHLEdBQUd3QixHQUFOLEdBQVl0QixHQUFHLEdBQUd1QixHQUFsQixHQUF3QnRCLEdBQUcsR0FBRytDLEdBQXhDO0FBQ0E3RCxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVXVCLEdBQUcsR0FBRytDLEdBQU4sR0FBWTlDLEdBQUcsR0FBRytDLEdBQWxCLEdBQXdCN0MsR0FBRyxHQUFHOEMsR0FBeEM7QUFDQWhFLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVZ0IsR0FBRyxHQUFHcUQsR0FBTixHQUFZN0MsR0FBRyxHQUFHOEMsR0FBbEIsR0FBd0I1QyxHQUFHLEdBQUc2QyxHQUF4QztBQUNBaEUsUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVnQixHQUFHLEdBQUdvRCxHQUFOLEdBQVlsRCxHQUFHLEdBQUdtRCxHQUFsQixHQUF3QjNDLEdBQUcsR0FBRzRDLEdBQXhDO0FBQ0FoRSxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVWdCLEdBQUcsR0FBR21ELEdBQU4sR0FBWWpELEdBQUcsR0FBR2tELEdBQWxCLEdBQXdCakQsR0FBRyxHQUFHa0QsR0FBeEMsQ0F2Q21ILENBeUNuSDs7QUFDQSxZQUFJakYsQ0FBQyxLQUFLaUIsR0FBVixFQUFlO0FBQ1hBLFVBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVYixDQUFDLENBQUNhLEdBQVo7QUFDQUksVUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVVkLENBQUMsQ0FBQ2MsR0FBWjtBQUNBRyxVQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVWYsQ0FBQyxDQUFDZSxHQUFaO0FBQ0FFLFVBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVaEIsQ0FBQyxDQUFDZ0IsR0FBWjtBQUNIOztBQUVELGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7OzhCQUkrQ0EsRyxFQUFVakIsQyxFQUFRa0UsRyxFQUFhO0FBQzFFLFlBQU1PLENBQUMsR0FBR0osSUFBSSxDQUFDSyxHQUFMLENBQVNSLEdBQVQsQ0FBVjtBQUFBLFlBQ0lTLENBQUMsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNWLEdBQVQsQ0FEUjtBQUFBLFlBRUlqQyxHQUFHLEdBQUdqQyxDQUFDLENBQUNLLEdBRlo7QUFBQSxZQUdJNkIsR0FBRyxHQUFHbEMsQ0FBQyxDQUFDTSxHQUhaO0FBQUEsWUFJSXVCLEdBQUcsR0FBRzdCLENBQUMsQ0FBQ08sR0FKWjtBQUFBLFlBS0l1QixHQUFHLEdBQUc5QixDQUFDLENBQUNRLEdBTFo7QUFBQSxZQU1JMkIsR0FBRyxHQUFHbkMsQ0FBQyxDQUFDUyxHQU5aO0FBQUEsWUFPSTJCLEdBQUcsR0FBR3BDLENBQUMsQ0FBQ1UsR0FQWjtBQUFBLFlBUUkyQixHQUFHLEdBQUdyQyxDQUFDLENBQUNXLEdBUlo7QUFBQSxZQVNJb0IsR0FBRyxHQUFHL0IsQ0FBQyxDQUFDWSxHQVRaOztBQVdBLFlBQUlaLENBQUMsS0FBS2lCLEdBQVYsRUFBZTtBQUFFO0FBQ2JBLFVBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVUQsQ0FBQyxDQUFDQyxHQUFaO0FBQ0FnQixVQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVUYsQ0FBQyxDQUFDRSxHQUFaO0FBQ0FlLFVBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVSCxDQUFDLENBQUNHLEdBQVo7QUFDQWMsVUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVVKLENBQUMsQ0FBQ0ksR0FBWjtBQUNBYSxVQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVWIsQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNjLEdBQVo7QUFDQUcsVUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVmLENBQUMsQ0FBQ2UsR0FBWjtBQUNBRSxVQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVWhCLENBQUMsQ0FBQ2dCLEdBQVo7QUFDSCxTQXJCeUUsQ0F1QjFFOzs7QUFDQUMsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVU0QixHQUFHLEdBQUcwQyxDQUFOLEdBQVV4QyxHQUFHLEdBQUdzQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVU0QixHQUFHLEdBQUd5QyxDQUFOLEdBQVV2QyxHQUFHLEdBQUdxQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVzQixHQUFHLEdBQUc4QyxDQUFOLEdBQVV0QyxHQUFHLEdBQUdvQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVzQixHQUFHLEdBQUc2QyxDQUFOLEdBQVU1QyxHQUFHLEdBQUcwQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVUwQixHQUFHLEdBQUd3QyxDQUFOLEdBQVUxQyxHQUFHLEdBQUd3QyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUwQixHQUFHLEdBQUd1QyxDQUFOLEdBQVV6QyxHQUFHLEdBQUd1QyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVUwQixHQUFHLEdBQUdzQyxDQUFOLEdBQVU5QyxHQUFHLEdBQUc0QyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVtQixHQUFHLEdBQUc0QyxDQUFOLEdBQVU3QyxHQUFHLEdBQUcyQyxDQUExQjtBQUVBLGVBQU94RCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs4QkFJK0NBLEcsRUFBVWpCLEMsRUFBUWtFLEcsRUFBYTtBQUMxRSxZQUFNTyxDQUFDLEdBQUdKLElBQUksQ0FBQ0ssR0FBTCxDQUFTUixHQUFULENBQVY7QUFBQSxZQUNJUyxDQUFDLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTVixHQUFULENBRFI7QUFBQSxZQUVJbEMsR0FBRyxHQUFHaEMsQ0FBQyxDQUFDQyxHQUZaO0FBQUEsWUFHSXlCLEdBQUcsR0FBRzFCLENBQUMsQ0FBQ0UsR0FIWjtBQUFBLFlBSUl5QixHQUFHLEdBQUczQixDQUFDLENBQUNHLEdBSlo7QUFBQSxZQUtJeUIsR0FBRyxHQUFHNUIsQ0FBQyxDQUFDSSxHQUxaO0FBQUEsWUFNSStCLEdBQUcsR0FBR25DLENBQUMsQ0FBQ1MsR0FOWjtBQUFBLFlBT0kyQixHQUFHLEdBQUdwQyxDQUFDLENBQUNVLEdBUFo7QUFBQSxZQVFJMkIsR0FBRyxHQUFHckMsQ0FBQyxDQUFDVyxHQVJaO0FBQUEsWUFTSW9CLEdBQUcsR0FBRy9CLENBQUMsQ0FBQ1ksR0FUWjs7QUFXQSxZQUFJWixDQUFDLEtBQUtpQixHQUFWLEVBQWU7QUFBRTtBQUNiQSxVQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVUwsQ0FBQyxDQUFDSyxHQUFaO0FBQ0FZLFVBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVTixDQUFDLENBQUNNLEdBQVo7QUFDQVcsVUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVQLENBQUMsQ0FBQ08sR0FBWjtBQUNBVSxVQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVVIsQ0FBQyxDQUFDUSxHQUFaO0FBQ0FTLFVBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVYixDQUFDLENBQUNhLEdBQVo7QUFDQUksVUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVVkLENBQUMsQ0FBQ2MsR0FBWjtBQUNBRyxVQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVWYsQ0FBQyxDQUFDZSxHQUFaO0FBQ0FFLFVBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVaEIsQ0FBQyxDQUFDZ0IsR0FBWjtBQUNILFNBckJ5RSxDQXVCMUU7OztBQUNBQyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUrQixHQUFHLEdBQUcyQyxDQUFOLEdBQVV4QyxHQUFHLEdBQUdzQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVV3QixHQUFHLEdBQUdpRCxDQUFOLEdBQVV2QyxHQUFHLEdBQUdxQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVV3QixHQUFHLEdBQUdnRCxDQUFOLEdBQVV0QyxHQUFHLEdBQUdvQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVV3QixHQUFHLEdBQUcrQyxDQUFOLEdBQVU1QyxHQUFHLEdBQUcwQyxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVV1QixHQUFHLEdBQUd5QyxDQUFOLEdBQVV0QyxHQUFHLEdBQUd3QyxDQUExQjtBQUNBMUQsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVVnQixHQUFHLEdBQUcrQyxDQUFOLEdBQVVyQyxHQUFHLEdBQUd1QyxDQUExQjtBQUNBMUQsUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVnQixHQUFHLEdBQUc4QyxDQUFOLEdBQVVwQyxHQUFHLEdBQUdzQyxDQUExQjtBQUNBMUQsUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVnQixHQUFHLEdBQUc2QyxDQUFOLEdBQVUxQyxHQUFHLEdBQUc0QyxDQUExQjtBQUVBLGVBQU8xRCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs4QkFJK0NBLEcsRUFBVWpCLEMsRUFBUWtFLEcsRUFBYTtBQUMxRSxZQUFNTyxDQUFDLEdBQUdKLElBQUksQ0FBQ0ssR0FBTCxDQUFTUixHQUFULENBQVY7QUFBQSxZQUNJUyxDQUFDLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTVixHQUFULENBRFI7QUFBQSxZQUVJbEMsR0FBRyxHQUFHaEMsQ0FBQyxDQUFDQyxHQUZaO0FBQUEsWUFHSXlCLEdBQUcsR0FBRzFCLENBQUMsQ0FBQ0UsR0FIWjtBQUFBLFlBSUl5QixHQUFHLEdBQUczQixDQUFDLENBQUNHLEdBSlo7QUFBQSxZQUtJeUIsR0FBRyxHQUFHNUIsQ0FBQyxDQUFDSSxHQUxaO0FBQUEsWUFNSTZCLEdBQUcsR0FBR2pDLENBQUMsQ0FBQ0ssR0FOWjtBQUFBLFlBT0k2QixHQUFHLEdBQUdsQyxDQUFDLENBQUNNLEdBUFo7QUFBQSxZQVFJdUIsR0FBRyxHQUFHN0IsQ0FBQyxDQUFDTyxHQVJaO0FBQUEsWUFTSXVCLEdBQUcsR0FBRzlCLENBQUMsQ0FBQ1EsR0FUWixDQUQwRSxDQVkxRTs7QUFDQSxZQUFJUixDQUFDLEtBQUtpQixHQUFWLEVBQWU7QUFDWEEsVUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVULENBQUMsQ0FBQ1MsR0FBWjtBQUNBUSxVQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVVYsQ0FBQyxDQUFDVSxHQUFaO0FBQ0FPLFVBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVWCxDQUFDLENBQUNXLEdBQVo7QUFDQU0sVUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVaLENBQUMsQ0FBQ1ksR0FBWjtBQUNBSyxVQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVWIsQ0FBQyxDQUFDYSxHQUFaO0FBQ0FJLFVBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVZCxDQUFDLENBQUNjLEdBQVo7QUFDQUcsVUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVVmLENBQUMsQ0FBQ2UsR0FBWjtBQUNBRSxVQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVWhCLENBQUMsQ0FBQ2dCLEdBQVo7QUFDSCxTQXRCeUUsQ0F3QjFFOzs7QUFDQUMsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVK0IsR0FBRyxHQUFHMkMsQ0FBTixHQUFVMUMsR0FBRyxHQUFHd0MsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVd0IsR0FBRyxHQUFHaUQsQ0FBTixHQUFVekMsR0FBRyxHQUFHdUMsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVd0IsR0FBRyxHQUFHZ0QsQ0FBTixHQUFVOUMsR0FBRyxHQUFHNEMsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVd0IsR0FBRyxHQUFHK0MsQ0FBTixHQUFVN0MsR0FBRyxHQUFHMkMsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVNEIsR0FBRyxHQUFHMEMsQ0FBTixHQUFVM0MsR0FBRyxHQUFHeUMsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVNEIsR0FBRyxHQUFHeUMsQ0FBTixHQUFVakQsR0FBRyxHQUFHK0MsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVc0IsR0FBRyxHQUFHOEMsQ0FBTixHQUFVaEQsR0FBRyxHQUFHOEMsQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVc0IsR0FBRyxHQUFHNkMsQ0FBTixHQUFVL0MsR0FBRyxHQUFHNkMsQ0FBMUI7QUFFQSxlQUFPeEQsR0FBUDtBQUNIO0FBRUQ7Ozs7OztzQ0FHa0ZBLEcsRUFBVTJDLEMsRUFBWTtBQUNwRzNDLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVSxDQUFWO0FBQ0FnQixRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVSxDQUFWO0FBQ0FlLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVLENBQVY7QUFDQWMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUNBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVSxDQUFWO0FBQ0FZLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVLENBQVY7QUFDQVcsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVUsQ0FBVjtBQUNBVSxRQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVSxDQUFWO0FBQ0FTLFFBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVLENBQVY7QUFDQVEsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUsQ0FBVjtBQUNBTyxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVSxDQUFWO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUrQyxDQUFDLENBQUNDLENBQVo7QUFDQTVDLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVOEMsQ0FBQyxDQUFDRSxDQUFaO0FBQ0E3QyxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVTZDLENBQUMsQ0FBQ0csQ0FBWjtBQUNBOUMsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7a0NBRzhFQSxHLEVBQVUyQyxDLEVBQVk7QUFDaEczQyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUyRCxDQUFDLENBQUNDLENBQVo7QUFDQTVDLFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVLENBQVY7QUFDQWUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBVjtBQUNBYyxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVSxDQUFWO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVLENBQVY7QUFDQVksUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVVzRCxDQUFDLENBQUNFLENBQVo7QUFDQTdDLFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVLENBQVY7QUFDQVUsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFWO0FBQ0FRLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQVY7QUFDQU8sUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVpRCxDQUFDLENBQUNHLENBQVo7QUFDQTlDLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVLENBQVY7QUFDQUUsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7bUNBRytFQSxHLEVBQVVpRCxHLEVBQWFDLEksRUFBZTtBQUNqSCxZQUFJTixDQUFDLEdBQUdNLElBQUksQ0FBQ04sQ0FBYjtBQUFBLFlBQWdCQyxDQUFDLEdBQUdLLElBQUksQ0FBQ0wsQ0FBekI7QUFBQSxZQUE0QkMsQ0FBQyxHQUFHSSxJQUFJLENBQUNKLENBQXJDO0FBQ0EsWUFBSUssR0FBRyxHQUFHQyxJQUFJLENBQUNDLElBQUwsQ0FBVVQsQ0FBQyxHQUFHQSxDQUFKLEdBQVFDLENBQUMsR0FBR0EsQ0FBWixHQUFnQkMsQ0FBQyxHQUFHQSxDQUE5QixDQUFWOztBQUVBLFlBQUlNLElBQUksQ0FBQ0UsR0FBTCxDQUFTSCxHQUFULElBQWdCSSxjQUFwQixFQUE2QjtBQUN6QixpQkFBTyxJQUFQO0FBQ0g7O0FBRURKLFFBQUFBLEdBQUcsR0FBRyxJQUFJQSxHQUFWO0FBQ0FQLFFBQUFBLENBQUMsSUFBSU8sR0FBTDtBQUNBTixRQUFBQSxDQUFDLElBQUlNLEdBQUw7QUFDQUwsUUFBQUEsQ0FBQyxJQUFJSyxHQUFMO0FBRUEsWUFBTUssQ0FBQyxHQUFHSixJQUFJLENBQUNLLEdBQUwsQ0FBU1IsR0FBVCxDQUFWO0FBQ0EsWUFBTVMsQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBU1YsR0FBVCxDQUFWO0FBQ0EsWUFBTVcsQ0FBQyxHQUFHLElBQUlGLENBQWQsQ0FmaUgsQ0FpQmpIOztBQUNBMUQsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVNEQsQ0FBQyxHQUFHQSxDQUFKLEdBQVFnQixDQUFSLEdBQVlGLENBQXRCO0FBQ0ExRCxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVTRELENBQUMsR0FBR0QsQ0FBSixHQUFRZ0IsQ0FBUixHQUFZZCxDQUFDLEdBQUdVLENBQTFCO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNkLEdBQUosR0FBVTRELENBQUMsR0FBR0YsQ0FBSixHQUFRZ0IsQ0FBUixHQUFZZixDQUFDLEdBQUdXLENBQTFCO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVSxDQUFWO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVd0QsQ0FBQyxHQUFHQyxDQUFKLEdBQVFlLENBQVIsR0FBWWQsQ0FBQyxHQUFHVSxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVV3RCxDQUFDLEdBQUdBLENBQUosR0FBUWUsQ0FBUixHQUFZRixDQUF0QjtBQUNBMUQsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVV3RCxDQUFDLEdBQUdELENBQUosR0FBUWUsQ0FBUixHQUFZaEIsQ0FBQyxHQUFHWSxDQUExQjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVW9ELENBQUMsR0FBR0UsQ0FBSixHQUFRYyxDQUFSLEdBQVlmLENBQUMsR0FBR1csQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVb0QsQ0FBQyxHQUFHQyxDQUFKLEdBQVFjLENBQVIsR0FBWWhCLENBQUMsR0FBR1ksQ0FBMUI7QUFDQXhELFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVb0QsQ0FBQyxHQUFHQSxDQUFKLEdBQVFjLENBQVIsR0FBWUYsQ0FBdEI7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVLENBQVY7QUFDQUUsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7b0NBR3FEQSxHLEVBQVVpRCxHLEVBQWE7QUFDeEUsWUFBTU8sQ0FBQyxHQUFHSixJQUFJLENBQUNLLEdBQUwsQ0FBU1IsR0FBVCxDQUFWO0FBQUEsWUFBeUJTLENBQUMsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNWLEdBQVQsQ0FBN0IsQ0FEd0UsQ0FHeEU7O0FBQ0FqRCxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsQ0FBVjtBQUNBZ0IsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVUsQ0FBVjtBQUNBZSxRQUFBQSxHQUFHLENBQUNkLEdBQUosR0FBVSxDQUFWO0FBQ0FjLFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVLENBQVY7QUFDQWEsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVUsQ0FBVjtBQUNBWSxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVXFFLENBQVY7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVa0UsQ0FBVjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFWO0FBQ0FRLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQUMrRCxDQUFYO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVWdFLENBQVY7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVLENBQVY7QUFDQUUsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7b0NBR3FEQSxHLEVBQVVpRCxHLEVBQWE7QUFDeEUsWUFBTU8sQ0FBQyxHQUFHSixJQUFJLENBQUNLLEdBQUwsQ0FBU1IsR0FBVCxDQUFWO0FBQUEsWUFBeUJTLENBQUMsR0FBR04sSUFBSSxDQUFDTyxHQUFMLENBQVNWLEdBQVQsQ0FBN0IsQ0FEd0UsQ0FHeEU7O0FBQ0FqRCxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUwRSxDQUFWO0FBQ0ExRCxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVSxDQUFWO0FBQ0FlLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVLENBQUNzRSxDQUFYO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVSxDQUFWO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVLENBQVY7QUFDQVksUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVUsQ0FBVjtBQUNBVyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFWO0FBQ0FVLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVnRSxDQUFWO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVSxDQUFWO0FBQ0FPLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVZ0UsQ0FBVjtBQUNBMUQsUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVUsQ0FBVjtBQUNBSyxRQUFBQSxHQUFHLENBQUNKLEdBQUosR0FBVSxDQUFWO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVLENBQVY7QUFDQUcsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVUsQ0FBVjtBQUNBRSxRQUFBQSxHQUFHLENBQUNELEdBQUosR0FBVSxDQUFWO0FBQ0EsZUFBT0MsR0FBUDtBQUNIO0FBRUQ7Ozs7OztvQ0FHcURBLEcsRUFBVWlELEcsRUFBYTtBQUN4RSxZQUFNTyxDQUFDLEdBQUdKLElBQUksQ0FBQ0ssR0FBTCxDQUFTUixHQUFULENBQVY7QUFBQSxZQUF5QlMsQ0FBQyxHQUFHTixJQUFJLENBQUNPLEdBQUwsQ0FBU1YsR0FBVCxDQUE3QixDQUR3RSxDQUd4RTs7QUFDQWpELFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVTBFLENBQVY7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVdUUsQ0FBVjtBQUNBeEQsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBVjtBQUNBYyxRQUFBQSxHQUFHLENBQUNiLEdBQUosR0FBVSxDQUFWO0FBQ0FhLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVLENBQUNvRSxDQUFYO0FBQ0F4RCxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVXFFLENBQVY7QUFDQTFELFFBQUFBLEdBQUcsQ0FBQ1YsR0FBSixHQUFVLENBQVY7QUFDQVUsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFWO0FBQ0FRLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQVY7QUFDQU8sUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVUsQ0FBVjtBQUNBTSxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVSxDQUFWO0FBQ0FLLFFBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVLENBQVY7QUFDQUksUUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVUsQ0FBVjtBQUNBRyxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVSxDQUFWO0FBQ0FFLFFBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVLENBQVY7QUFDQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OzZCQUd5RUEsRyxFQUFVaUUsQyxFQUFTdEIsQyxFQUFZO0FBQ3BHLFlBQU1DLENBQUMsR0FBR3FCLENBQUMsQ0FBQ3JCLENBQVo7QUFBQSxZQUFlQyxDQUFDLEdBQUdvQixDQUFDLENBQUNwQixDQUFyQjtBQUFBLFlBQXdCQyxDQUFDLEdBQUdtQixDQUFDLENBQUNuQixDQUE5QjtBQUFBLFlBQWlDb0IsQ0FBQyxHQUFHRCxDQUFDLENBQUNDLENBQXZDO0FBQ0EsWUFBTUMsRUFBRSxHQUFHdkIsQ0FBQyxHQUFHQSxDQUFmO0FBQ0EsWUFBTXdCLEVBQUUsR0FBR3ZCLENBQUMsR0FBR0EsQ0FBZjtBQUNBLFlBQU13QixFQUFFLEdBQUd2QixDQUFDLEdBQUdBLENBQWY7QUFFQSxZQUFNd0IsRUFBRSxHQUFHMUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1JLEVBQUUsR0FBRzNCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNSSxFQUFFLEdBQUc1QixDQUFDLEdBQUd5QixFQUFmO0FBQ0EsWUFBTUksRUFBRSxHQUFHNUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1NLEVBQUUsR0FBRzdCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNTSxFQUFFLEdBQUc3QixDQUFDLEdBQUd1QixFQUFmO0FBQ0EsWUFBTU8sRUFBRSxHQUFHVixDQUFDLEdBQUdDLEVBQWY7QUFDQSxZQUFNVSxFQUFFLEdBQUdYLENBQUMsR0FBR0UsRUFBZjtBQUNBLFlBQU1VLEVBQUUsR0FBR1osQ0FBQyxHQUFHRyxFQUFmO0FBRUFyRSxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsS0FBS3lGLEVBQUUsR0FBR0UsRUFBVixDQUFWO0FBQ0EzRSxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVXNGLEVBQUUsR0FBR08sRUFBZjtBQUNBOUUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVzRixFQUFFLEdBQUdLLEVBQWY7QUFDQTdFLFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVLENBQVY7QUFDQWEsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVVtRixFQUFFLEdBQUdPLEVBQWY7QUFDQTlFLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVLEtBQUtpRixFQUFFLEdBQUdLLEVBQVYsQ0FBVjtBQUNBM0UsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVvRixFQUFFLEdBQUdFLEVBQWY7QUFDQTVFLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVnRixFQUFFLEdBQUdLLEVBQWY7QUFDQTdFLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVaUYsRUFBRSxHQUFHRSxFQUFmO0FBQ0E1RSxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVSxLQUFLNEUsRUFBRSxHQUFHRyxFQUFWLENBQVY7QUFDQXpFLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUrQyxDQUFDLENBQUNDLENBQVo7QUFDQTVDLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVOEMsQ0FBQyxDQUFDRSxDQUFaO0FBQ0E3QyxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVTZDLENBQUMsQ0FBQ0csQ0FBWjtBQUNBOUMsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUVBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7cUNBR2lGQSxHLEVBQWMrRSxHLEVBQVU7QUFDckcvRSxRQUFBQSxHQUFHLENBQUM0QyxDQUFKLEdBQVFtQyxHQUFHLENBQUNuRixHQUFaO0FBQ0FJLFFBQUFBLEdBQUcsQ0FBQzZDLENBQUosR0FBUWtDLEdBQUcsQ0FBQ2xGLEdBQVo7QUFDQUcsUUFBQUEsR0FBRyxDQUFDOEMsQ0FBSixHQUFRaUMsR0FBRyxDQUFDakYsR0FBWjtBQUVBLGVBQU9FLEdBQVA7QUFDSDtBQUVEOzs7Ozs7aUNBRzZFQSxHLEVBQWMrRSxHLEVBQVU7QUFDakcsWUFBTS9GLEdBQUcsR0FBR2dHLElBQUksQ0FBQ2hHLEdBQUwsR0FBVytGLEdBQUcsQ0FBQy9GLEdBQTNCO0FBQ0EsWUFBTUMsR0FBRyxHQUFHK0YsSUFBSSxDQUFDL0YsR0FBTCxHQUFXOEYsR0FBRyxDQUFDOUYsR0FBM0I7QUFDQSxZQUFNQyxHQUFHLEdBQUc4RixJQUFJLENBQUM5RixHQUFMLEdBQVc2RixHQUFHLENBQUM3RixHQUEzQjtBQUNBLFlBQU1FLEdBQUcsR0FBRzRGLElBQUksQ0FBQzdGLEdBQUwsR0FBVzRGLEdBQUcsQ0FBQzNGLEdBQTNCO0FBQ0EsWUFBTUMsR0FBRyxHQUFHMkYsSUFBSSxDQUFDNUYsR0FBTCxHQUFXMkYsR0FBRyxDQUFDMUYsR0FBM0I7QUFDQSxZQUFNQyxHQUFHLEdBQUcwRixJQUFJLENBQUMzRixHQUFMLEdBQVcwRixHQUFHLENBQUN6RixHQUEzQjtBQUNBLFlBQU1FLEdBQUcsR0FBR3dGLElBQUksQ0FBQzFGLEdBQUwsR0FBV3lGLEdBQUcsQ0FBQ3ZGLEdBQTNCO0FBQ0EsWUFBTUMsR0FBRyxHQUFHdUYsSUFBSSxDQUFDekYsR0FBTCxHQUFXd0YsR0FBRyxDQUFDdEYsR0FBM0I7QUFDQSxZQUFNQyxHQUFHLEdBQUdzRixJQUFJLENBQUN4RixHQUFMLEdBQVd1RixHQUFHLENBQUNyRixHQUEzQjtBQUNBTSxRQUFBQSxHQUFHLENBQUM0QyxDQUFKLEdBQVFRLElBQUksQ0FBQ0MsSUFBTCxDQUFVckUsR0FBRyxHQUFHQSxHQUFOLEdBQVlDLEdBQUcsR0FBR0EsR0FBbEIsR0FBd0JDLEdBQUcsR0FBR0EsR0FBeEMsQ0FBUjtBQUNBYyxRQUFBQSxHQUFHLENBQUM2QyxDQUFKLEdBQVFPLElBQUksQ0FBQ0MsSUFBTCxDQUFVakUsR0FBRyxHQUFHQSxHQUFOLEdBQVlDLEdBQUcsR0FBR0EsR0FBbEIsR0FBd0JDLEdBQUcsR0FBR0EsR0FBeEMsQ0FBUjtBQUNBVSxRQUFBQSxHQUFHLENBQUM4QyxDQUFKLEdBQVFNLElBQUksQ0FBQ0MsSUFBTCxDQUFVN0QsR0FBRyxHQUFHQSxHQUFOLEdBQVlDLEdBQUcsR0FBR0EsR0FBbEIsR0FBd0JDLEdBQUcsR0FBR0EsR0FBeEMsQ0FBUixDQVppRyxDQWFqRzs7QUFDQSxZQUFJdUYsVUFBS0MsV0FBTCxDQUFpQkYsSUFBakIsSUFBeUIsQ0FBN0IsRUFBZ0M7QUFBRWhGLFVBQUFBLEdBQUcsQ0FBQzRDLENBQUosSUFBUyxDQUFDLENBQVY7QUFBYzs7QUFDaEQsZUFBTzVDLEdBQVA7QUFDSDtBQUVEOzs7Ozs7a0NBR21EQSxHLEVBQVcrRSxHLEVBQVU7QUFDcEUsWUFBTUksS0FBSyxHQUFHSixHQUFHLENBQUMvRixHQUFKLEdBQVUrRixHQUFHLENBQUMxRixHQUFkLEdBQW9CMEYsR0FBRyxDQUFDckYsR0FBdEM7QUFDQSxZQUFJMEYsQ0FBQyxHQUFHLENBQVI7O0FBRUEsWUFBSUQsS0FBSyxHQUFHLENBQVosRUFBZTtBQUNYQyxVQUFBQSxDQUFDLEdBQUdoQyxJQUFJLENBQUNDLElBQUwsQ0FBVThCLEtBQUssR0FBRyxHQUFsQixJQUF5QixDQUE3QjtBQUNBbkYsVUFBQUEsR0FBRyxDQUFDa0UsQ0FBSixHQUFRLE9BQU9rQixDQUFmO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM0QyxDQUFKLEdBQVEsQ0FBQ21DLEdBQUcsQ0FBQ3pGLEdBQUosR0FBVXlGLEdBQUcsQ0FBQ3RGLEdBQWYsSUFBc0IyRixDQUE5QjtBQUNBcEYsVUFBQUEsR0FBRyxDQUFDNkMsQ0FBSixHQUFRLENBQUNrQyxHQUFHLENBQUN2RixHQUFKLEdBQVV1RixHQUFHLENBQUM3RixHQUFmLElBQXNCa0csQ0FBOUI7QUFDQXBGLFVBQUFBLEdBQUcsQ0FBQzhDLENBQUosR0FBUSxDQUFDaUMsR0FBRyxDQUFDOUYsR0FBSixHQUFVOEYsR0FBRyxDQUFDM0YsR0FBZixJQUFzQmdHLENBQTlCO0FBQ0gsU0FORCxNQU1PLElBQUtMLEdBQUcsQ0FBQy9GLEdBQUosR0FBVStGLEdBQUcsQ0FBQzFGLEdBQWYsSUFBd0IwRixHQUFHLENBQUMvRixHQUFKLEdBQVUrRixHQUFHLENBQUNyRixHQUExQyxFQUFnRDtBQUNuRDBGLFVBQUFBLENBQUMsR0FBR2hDLElBQUksQ0FBQ0MsSUFBTCxDQUFVLE1BQU0wQixHQUFHLENBQUMvRixHQUFWLEdBQWdCK0YsR0FBRyxDQUFDMUYsR0FBcEIsR0FBMEIwRixHQUFHLENBQUNyRixHQUF4QyxJQUErQyxDQUFuRDtBQUNBTSxVQUFBQSxHQUFHLENBQUNrRSxDQUFKLEdBQVEsQ0FBQ2EsR0FBRyxDQUFDekYsR0FBSixHQUFVeUYsR0FBRyxDQUFDdEYsR0FBZixJQUFzQjJGLENBQTlCO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM0QyxDQUFKLEdBQVEsT0FBT3dDLENBQWY7QUFDQXBGLFVBQUFBLEdBQUcsQ0FBQzZDLENBQUosR0FBUSxDQUFDa0MsR0FBRyxDQUFDOUYsR0FBSixHQUFVOEYsR0FBRyxDQUFDM0YsR0FBZixJQUFzQmdHLENBQTlCO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM4QyxDQUFKLEdBQVEsQ0FBQ2lDLEdBQUcsQ0FBQ3ZGLEdBQUosR0FBVXVGLEdBQUcsQ0FBQzdGLEdBQWYsSUFBc0JrRyxDQUE5QjtBQUNILFNBTk0sTUFNQSxJQUFJTCxHQUFHLENBQUMxRixHQUFKLEdBQVUwRixHQUFHLENBQUNyRixHQUFsQixFQUF1QjtBQUMxQjBGLFVBQUFBLENBQUMsR0FBR2hDLElBQUksQ0FBQ0MsSUFBTCxDQUFVLE1BQU0wQixHQUFHLENBQUMxRixHQUFWLEdBQWdCMEYsR0FBRyxDQUFDL0YsR0FBcEIsR0FBMEIrRixHQUFHLENBQUNyRixHQUF4QyxJQUErQyxDQUFuRDtBQUNBTSxVQUFBQSxHQUFHLENBQUNrRSxDQUFKLEdBQVEsQ0FBQ2EsR0FBRyxDQUFDdkYsR0FBSixHQUFVdUYsR0FBRyxDQUFDN0YsR0FBZixJQUFzQmtHLENBQTlCO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM0QyxDQUFKLEdBQVEsQ0FBQ21DLEdBQUcsQ0FBQzlGLEdBQUosR0FBVThGLEdBQUcsQ0FBQzNGLEdBQWYsSUFBc0JnRyxDQUE5QjtBQUNBcEYsVUFBQUEsR0FBRyxDQUFDNkMsQ0FBSixHQUFRLE9BQU91QyxDQUFmO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM4QyxDQUFKLEdBQVEsQ0FBQ2lDLEdBQUcsQ0FBQ3pGLEdBQUosR0FBVXlGLEdBQUcsQ0FBQ3RGLEdBQWYsSUFBc0IyRixDQUE5QjtBQUNILFNBTk0sTUFNQTtBQUNIQSxVQUFBQSxDQUFDLEdBQUdoQyxJQUFJLENBQUNDLElBQUwsQ0FBVSxNQUFNMEIsR0FBRyxDQUFDckYsR0FBVixHQUFnQnFGLEdBQUcsQ0FBQy9GLEdBQXBCLEdBQTBCK0YsR0FBRyxDQUFDMUYsR0FBeEMsSUFBK0MsQ0FBbkQ7QUFDQVcsVUFBQUEsR0FBRyxDQUFDa0UsQ0FBSixHQUFRLENBQUNhLEdBQUcsQ0FBQzlGLEdBQUosR0FBVThGLEdBQUcsQ0FBQzNGLEdBQWYsSUFBc0JnRyxDQUE5QjtBQUNBcEYsVUFBQUEsR0FBRyxDQUFDNEMsQ0FBSixHQUFRLENBQUNtQyxHQUFHLENBQUN2RixHQUFKLEdBQVV1RixHQUFHLENBQUM3RixHQUFmLElBQXNCa0csQ0FBOUI7QUFDQXBGLFVBQUFBLEdBQUcsQ0FBQzZDLENBQUosR0FBUSxDQUFDa0MsR0FBRyxDQUFDekYsR0FBSixHQUFVeUYsR0FBRyxDQUFDdEYsR0FBZixJQUFzQjJGLENBQTlCO0FBQ0FwRixVQUFBQSxHQUFHLENBQUM4QyxDQUFKLEdBQVEsT0FBT3NDLENBQWY7QUFDSDs7QUFFRCxlQUFPcEYsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs0QkFHd0VxRixDLEVBQVFwQixDLEVBQVN0QixDLEVBQVlhLEMsRUFBWTtBQUM3R0EsUUFBQUEsQ0FBQyxDQUFDWixDQUFGLEdBQU0wQyxVQUFLQyxHQUFMLENBQVNDLElBQVQsRUFBZUgsQ0FBQyxDQUFDckcsR0FBakIsRUFBc0JxRyxDQUFDLENBQUNwRyxHQUF4QixFQUE2Qm9HLENBQUMsQ0FBQ25HLEdBQS9CLEVBQW9DdUcsTUFBcEMsRUFBTjtBQUNBVCxRQUFBQSxJQUFJLENBQUNoRyxHQUFMLEdBQVdxRyxDQUFDLENBQUNyRyxHQUFGLEdBQVF3RSxDQUFDLENBQUNaLENBQXJCO0FBQ0FvQyxRQUFBQSxJQUFJLENBQUMvRixHQUFMLEdBQVdvRyxDQUFDLENBQUNwRyxHQUFGLEdBQVF1RSxDQUFDLENBQUNaLENBQXJCO0FBQ0FvQyxRQUFBQSxJQUFJLENBQUM5RixHQUFMLEdBQVdtRyxDQUFDLENBQUNuRyxHQUFGLEdBQVFzRSxDQUFDLENBQUNaLENBQXJCO0FBQ0FZLFFBQUFBLENBQUMsQ0FBQ1gsQ0FBRixHQUFNeUMsVUFBS0MsR0FBTCxDQUFTQyxJQUFULEVBQWVILENBQUMsQ0FBQ2pHLEdBQWpCLEVBQXNCaUcsQ0FBQyxDQUFDaEcsR0FBeEIsRUFBNkJnRyxDQUFDLENBQUMvRixHQUEvQixFQUFvQ21HLE1BQXBDLEVBQU47QUFDQVQsUUFBQUEsSUFBSSxDQUFDN0YsR0FBTCxHQUFXa0csQ0FBQyxDQUFDakcsR0FBRixHQUFRb0UsQ0FBQyxDQUFDWCxDQUFyQjtBQUNBbUMsUUFBQUEsSUFBSSxDQUFDNUYsR0FBTCxHQUFXaUcsQ0FBQyxDQUFDaEcsR0FBRixHQUFRbUUsQ0FBQyxDQUFDWCxDQUFyQjtBQUNBbUMsUUFBQUEsSUFBSSxDQUFDM0YsR0FBTCxHQUFXZ0csQ0FBQyxDQUFDL0YsR0FBRixHQUFRa0UsQ0FBQyxDQUFDWCxDQUFyQjtBQUNBVyxRQUFBQSxDQUFDLENBQUNWLENBQUYsR0FBTXdDLFVBQUtDLEdBQUwsQ0FBU0MsSUFBVCxFQUFlSCxDQUFDLENBQUM3RixHQUFqQixFQUFzQjZGLENBQUMsQ0FBQzVGLEdBQXhCLEVBQTZCNEYsQ0FBQyxDQUFDM0YsR0FBL0IsRUFBb0MrRixNQUFwQyxFQUFOO0FBQ0FULFFBQUFBLElBQUksQ0FBQzFGLEdBQUwsR0FBVytGLENBQUMsQ0FBQzdGLEdBQUYsR0FBUWdFLENBQUMsQ0FBQ1YsQ0FBckI7QUFDQWtDLFFBQUFBLElBQUksQ0FBQ3pGLEdBQUwsR0FBVzhGLENBQUMsQ0FBQzVGLEdBQUYsR0FBUStELENBQUMsQ0FBQ1YsQ0FBckI7QUFDQWtDLFFBQUFBLElBQUksQ0FBQ3hGLEdBQUwsR0FBVzZGLENBQUMsQ0FBQzNGLEdBQUYsR0FBUThELENBQUMsQ0FBQ1YsQ0FBckI7O0FBQ0EsWUFBTVQsR0FBRyxHQUFHNEMsVUFBS0MsV0FBTCxDQUFpQkYsSUFBakIsQ0FBWjs7QUFDQSxZQUFJM0MsR0FBRyxHQUFHLENBQVYsRUFBYTtBQUFFbUIsVUFBQUEsQ0FBQyxDQUFDWixDQUFGLElBQU8sQ0FBQyxDQUFSO0FBQVdvQyxVQUFBQSxJQUFJLENBQUNoRyxHQUFMLElBQVksQ0FBQyxDQUFiO0FBQWdCZ0csVUFBQUEsSUFBSSxDQUFDL0YsR0FBTCxJQUFZLENBQUMsQ0FBYjtBQUFnQitGLFVBQUFBLElBQUksQ0FBQzlGLEdBQUwsSUFBWSxDQUFDLENBQWI7QUFBaUI7O0FBQzNFd0csbUJBQUtDLFFBQUwsQ0FBYzFCLENBQWQsRUFBaUJlLElBQWpCLEVBZjZHLENBZXJGOzs7QUFDeEJNLGtCQUFLQyxHQUFMLENBQVM1QyxDQUFULEVBQVkwQyxDQUFDLENBQUN6RixHQUFkLEVBQW1CeUYsQ0FBQyxDQUFDeEYsR0FBckIsRUFBMEJ3RixDQUFDLENBQUN2RixHQUE1QjtBQUNIO0FBRUQ7Ozs7Ozs4QkFHMEVFLEcsRUFBVWlFLEMsRUFBU3RCLEMsRUFBWWEsQyxFQUFZO0FBQ2pILFlBQU1aLENBQUMsR0FBR3FCLENBQUMsQ0FBQ3JCLENBQVo7QUFBQSxZQUFlQyxDQUFDLEdBQUdvQixDQUFDLENBQUNwQixDQUFyQjtBQUFBLFlBQXdCQyxDQUFDLEdBQUdtQixDQUFDLENBQUNuQixDQUE5QjtBQUFBLFlBQWlDb0IsQ0FBQyxHQUFHRCxDQUFDLENBQUNDLENBQXZDO0FBQ0EsWUFBTUMsRUFBRSxHQUFHdkIsQ0FBQyxHQUFHQSxDQUFmO0FBQ0EsWUFBTXdCLEVBQUUsR0FBR3ZCLENBQUMsR0FBR0EsQ0FBZjtBQUNBLFlBQU13QixFQUFFLEdBQUd2QixDQUFDLEdBQUdBLENBQWY7QUFFQSxZQUFNd0IsRUFBRSxHQUFHMUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1JLEVBQUUsR0FBRzNCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNSSxFQUFFLEdBQUc1QixDQUFDLEdBQUd5QixFQUFmO0FBQ0EsWUFBTUksRUFBRSxHQUFHNUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1NLEVBQUUsR0FBRzdCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNTSxFQUFFLEdBQUc3QixDQUFDLEdBQUd1QixFQUFmO0FBQ0EsWUFBTU8sRUFBRSxHQUFHVixDQUFDLEdBQUdDLEVBQWY7QUFDQSxZQUFNVSxFQUFFLEdBQUdYLENBQUMsR0FBR0UsRUFBZjtBQUNBLFlBQU1VLEVBQUUsR0FBR1osQ0FBQyxHQUFHRyxFQUFmO0FBQ0EsWUFBTXVCLEVBQUUsR0FBR3BDLENBQUMsQ0FBQ1osQ0FBYjtBQUNBLFlBQU1pRCxFQUFFLEdBQUdyQyxDQUFDLENBQUNYLENBQWI7QUFDQSxZQUFNaUQsRUFBRSxHQUFHdEMsQ0FBQyxDQUFDVixDQUFiO0FBRUE5QyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsQ0FBQyxLQUFLeUYsRUFBRSxHQUFHRSxFQUFWLENBQUQsSUFBa0JpQixFQUE1QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVUsQ0FBQ3NGLEVBQUUsR0FBR08sRUFBTixJQUFZYyxFQUF0QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBQ3NGLEVBQUUsR0FBR0ssRUFBTixJQUFZZSxFQUF0QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUNBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVSxDQUFDbUYsRUFBRSxHQUFHTyxFQUFOLElBQVllLEVBQXRCO0FBQ0E3RixRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVSxDQUFDLEtBQUtpRixFQUFFLEdBQUdLLEVBQVYsQ0FBRCxJQUFrQmtCLEVBQTVCO0FBQ0E3RixRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFDb0YsRUFBRSxHQUFHRSxFQUFOLElBQVlpQixFQUF0QjtBQUNBN0YsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFDZ0YsRUFBRSxHQUFHSyxFQUFOLElBQVlpQixFQUF0QjtBQUNBOUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUsQ0FBQ2lGLEVBQUUsR0FBR0UsRUFBTixJQUFZa0IsRUFBdEI7QUFDQTlGLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQUMsS0FBSzRFLEVBQUUsR0FBR0csRUFBVixDQUFELElBQWtCcUIsRUFBNUI7QUFDQTlGLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUrQyxDQUFDLENBQUNDLENBQVo7QUFDQTVDLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVOEMsQ0FBQyxDQUFDRSxDQUFaO0FBQ0E3QyxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVTZDLENBQUMsQ0FBQ0csQ0FBWjtBQUNBOUMsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUVBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O29DQU9nRkEsRyxFQUFVaUUsQyxFQUFTdEIsQyxFQUFZYSxDLEVBQVl1QyxDLEVBQVk7QUFDbkksWUFBTW5ELENBQUMsR0FBR3FCLENBQUMsQ0FBQ3JCLENBQVo7QUFBQSxZQUFlQyxDQUFDLEdBQUdvQixDQUFDLENBQUNwQixDQUFyQjtBQUFBLFlBQXdCQyxDQUFDLEdBQUdtQixDQUFDLENBQUNuQixDQUE5QjtBQUFBLFlBQWlDb0IsQ0FBQyxHQUFHRCxDQUFDLENBQUNDLENBQXZDO0FBQ0EsWUFBTUMsRUFBRSxHQUFHdkIsQ0FBQyxHQUFHQSxDQUFmO0FBQ0EsWUFBTXdCLEVBQUUsR0FBR3ZCLENBQUMsR0FBR0EsQ0FBZjtBQUNBLFlBQU13QixFQUFFLEdBQUd2QixDQUFDLEdBQUdBLENBQWY7QUFFQSxZQUFNd0IsRUFBRSxHQUFHMUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1JLEVBQUUsR0FBRzNCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNSSxFQUFFLEdBQUc1QixDQUFDLEdBQUd5QixFQUFmO0FBQ0EsWUFBTUksRUFBRSxHQUFHNUIsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1NLEVBQUUsR0FBRzdCLENBQUMsR0FBR3dCLEVBQWY7QUFDQSxZQUFNTSxFQUFFLEdBQUc3QixDQUFDLEdBQUd1QixFQUFmO0FBQ0EsWUFBTU8sRUFBRSxHQUFHVixDQUFDLEdBQUdDLEVBQWY7QUFDQSxZQUFNVSxFQUFFLEdBQUdYLENBQUMsR0FBR0UsRUFBZjtBQUNBLFlBQU1VLEVBQUUsR0FBR1osQ0FBQyxHQUFHRyxFQUFmO0FBRUEsWUFBTXVCLEVBQUUsR0FBR3BDLENBQUMsQ0FBQ1osQ0FBYjtBQUNBLFlBQU1pRCxFQUFFLEdBQUdyQyxDQUFDLENBQUNYLENBQWI7QUFDQSxZQUFNaUQsRUFBRSxHQUFHdEMsQ0FBQyxDQUFDVixDQUFiO0FBRUEsWUFBTWtELEVBQUUsR0FBR0QsQ0FBQyxDQUFDbkQsQ0FBYjtBQUNBLFlBQU1xRCxFQUFFLEdBQUdGLENBQUMsQ0FBQ2xELENBQWI7QUFDQSxZQUFNcUQsRUFBRSxHQUFHSCxDQUFDLENBQUNqRCxDQUFiO0FBRUE5QyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsQ0FBQyxLQUFLeUYsRUFBRSxHQUFHRSxFQUFWLENBQUQsSUFBa0JpQixFQUE1QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVUsQ0FBQ3NGLEVBQUUsR0FBR08sRUFBTixJQUFZYyxFQUF0QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVUsQ0FBQ3NGLEVBQUUsR0FBR0ssRUFBTixJQUFZZSxFQUF0QjtBQUNBNUYsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUNBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVSxDQUFDbUYsRUFBRSxHQUFHTyxFQUFOLElBQVllLEVBQXRCO0FBQ0E3RixRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVSxDQUFDLEtBQUtpRixFQUFFLEdBQUdLLEVBQVYsQ0FBRCxJQUFrQmtCLEVBQTVCO0FBQ0E3RixRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFDb0YsRUFBRSxHQUFHRSxFQUFOLElBQVlpQixFQUF0QjtBQUNBN0YsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVUsQ0FBVjtBQUNBUyxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVSxDQUFDZ0YsRUFBRSxHQUFHSyxFQUFOLElBQVlpQixFQUF0QjtBQUNBOUYsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUsQ0FBQ2lGLEVBQUUsR0FBR0UsRUFBTixJQUFZa0IsRUFBdEI7QUFDQTlGLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQUMsS0FBSzRFLEVBQUUsR0FBR0csRUFBVixDQUFELElBQWtCcUIsRUFBNUI7QUFDQTlGLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUrQyxDQUFDLENBQUNDLENBQUYsR0FBTW9ELEVBQU4sSUFBWWhHLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVWdILEVBQVYsR0FBZWhHLEdBQUcsQ0FBQ1osR0FBSixHQUFVNkcsRUFBekIsR0FBOEJqRyxHQUFHLENBQUNSLEdBQUosR0FBVTBHLEVBQXBELENBQVY7QUFDQWxHLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVOEMsQ0FBQyxDQUFDRSxDQUFGLEdBQU1vRCxFQUFOLElBQVlqRyxHQUFHLENBQUNmLEdBQUosR0FBVStHLEVBQVYsR0FBZWhHLEdBQUcsQ0FBQ1gsR0FBSixHQUFVNEcsRUFBekIsR0FBOEJqRyxHQUFHLENBQUNQLEdBQUosR0FBVXlHLEVBQXBELENBQVY7QUFDQWxHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVNkMsQ0FBQyxDQUFDRyxDQUFGLEdBQU1vRCxFQUFOLElBQVlsRyxHQUFHLENBQUNkLEdBQUosR0FBVThHLEVBQVYsR0FBZWhHLEdBQUcsQ0FBQ1YsR0FBSixHQUFVMkcsRUFBekIsR0FBOEJqRyxHQUFHLENBQUNOLEdBQUosR0FBVXdHLEVBQXBELENBQVY7QUFDQWxHLFFBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVLENBQVY7QUFFQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OytCQUdnREEsRyxFQUFVaUUsQyxFQUFTO0FBQy9ELFlBQU1yQixDQUFDLEdBQUdxQixDQUFDLENBQUNyQixDQUFaO0FBQUEsWUFBZUMsQ0FBQyxHQUFHb0IsQ0FBQyxDQUFDcEIsQ0FBckI7QUFBQSxZQUF3QkMsQ0FBQyxHQUFHbUIsQ0FBQyxDQUFDbkIsQ0FBOUI7QUFBQSxZQUFpQ29CLENBQUMsR0FBR0QsQ0FBQyxDQUFDQyxDQUF2QztBQUNBLFlBQU1DLEVBQUUsR0FBR3ZCLENBQUMsR0FBR0EsQ0FBZjtBQUNBLFlBQU13QixFQUFFLEdBQUd2QixDQUFDLEdBQUdBLENBQWY7QUFDQSxZQUFNd0IsRUFBRSxHQUFHdkIsQ0FBQyxHQUFHQSxDQUFmO0FBRUEsWUFBTXdCLEVBQUUsR0FBRzFCLENBQUMsR0FBR3VCLEVBQWY7QUFDQSxZQUFNZ0MsRUFBRSxHQUFHdEQsQ0FBQyxHQUFHc0IsRUFBZjtBQUNBLFlBQU1NLEVBQUUsR0FBRzVCLENBQUMsR0FBR3VCLEVBQWY7QUFDQSxZQUFNZ0MsRUFBRSxHQUFHdEQsQ0FBQyxHQUFHcUIsRUFBZjtBQUNBLFlBQU1rQyxFQUFFLEdBQUd2RCxDQUFDLEdBQUdzQixFQUFmO0FBQ0EsWUFBTU8sRUFBRSxHQUFHN0IsQ0FBQyxHQUFHdUIsRUFBZjtBQUNBLFlBQU1PLEVBQUUsR0FBR1YsQ0FBQyxHQUFHQyxFQUFmO0FBQ0EsWUFBTVUsRUFBRSxHQUFHWCxDQUFDLEdBQUdFLEVBQWY7QUFDQSxZQUFNVSxFQUFFLEdBQUdaLENBQUMsR0FBR0csRUFBZjtBQUVBckUsUUFBQUEsR0FBRyxDQUFDaEIsR0FBSixHQUFVLElBQUl5RixFQUFKLEdBQVNFLEVBQW5CO0FBQ0EzRSxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVWtILEVBQUUsR0FBR3JCLEVBQWY7QUFDQTlFLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVa0gsRUFBRSxHQUFHdkIsRUFBZjtBQUNBN0UsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUVBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVStHLEVBQUUsR0FBR3JCLEVBQWY7QUFDQTlFLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVLElBQUlpRixFQUFKLEdBQVNLLEVBQW5CO0FBQ0EzRSxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVStHLEVBQUUsR0FBR3pCLEVBQWY7QUFDQTVFLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFFQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVU0RyxFQUFFLEdBQUd2QixFQUFmO0FBQ0E3RSxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVTRHLEVBQUUsR0FBR3pCLEVBQWY7QUFDQTVFLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLElBQUk0RSxFQUFKLEdBQVNHLEVBQW5CO0FBQ0F6RSxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVSxDQUFWO0FBRUFLLFFBQUFBLEdBQUcsQ0FBQ0osR0FBSixHQUFVLENBQVY7QUFDQUksUUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVUsQ0FBVjtBQUNBRyxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVSxDQUFWO0FBQ0FFLFFBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVLENBQVY7QUFFQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OzhCQVMrQ0EsRyxFQUFVc0csSSxFQUFjQyxLLEVBQWVDLE0sRUFBZ0JDLEcsRUFBYUMsSSxFQUFjQyxHLEVBQWE7QUFDMUksWUFBTUMsRUFBRSxHQUFHLEtBQUtMLEtBQUssR0FBR0QsSUFBYixDQUFYO0FBQ0EsWUFBTU8sRUFBRSxHQUFHLEtBQUtKLEdBQUcsR0FBR0QsTUFBWCxDQUFYO0FBQ0EsWUFBTU0sRUFBRSxHQUFHLEtBQUtKLElBQUksR0FBR0MsR0FBWixDQUFYO0FBRUEzRyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVcwSCxJQUFJLEdBQUcsQ0FBUixHQUFhRSxFQUF2QjtBQUNBNUcsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVUsQ0FBVjtBQUNBZSxRQUFBQSxHQUFHLENBQUNkLEdBQUosR0FBVSxDQUFWO0FBQ0FjLFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVLENBQVY7QUFDQWEsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVUsQ0FBVjtBQUNBWSxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBV3FILElBQUksR0FBRyxDQUFSLEdBQWFHLEVBQXZCO0FBQ0E3RyxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFWO0FBQ0FVLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVUsQ0FBQytHLEtBQUssR0FBR0QsSUFBVCxJQUFpQk0sRUFBM0I7QUFDQTVHLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQUNnSCxHQUFHLEdBQUdELE1BQVAsSUFBaUJLLEVBQTNCO0FBQ0E3RyxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVSxDQUFDaUgsR0FBRyxHQUFHRCxJQUFQLElBQWVJLEVBQXpCO0FBQ0E5RyxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVSxDQUFDLENBQVg7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFXNkcsR0FBRyxHQUFHRCxJQUFOLEdBQWEsQ0FBZCxHQUFtQkksRUFBN0I7QUFDQTlHLFFBQUFBLEdBQUcsQ0FBQ0QsR0FBSixHQUFVLENBQVY7QUFDQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztrQ0FRUUEsRyxFQUFVK0csRyxFQUFhQyxNLEVBQWdCTixJLEVBQWNDLEcsRUFDRjtBQUFBLFlBQW5ETSxNQUFtRCx1RUFBMUMsSUFBMEM7QUFBQSxZQUFwQ0MsUUFBb0MsdUVBQXpCLENBQUMsQ0FBd0I7QUFBQSxZQUFyQkMsZUFBcUIsdUVBQUgsQ0FBRztBQUV2RCxZQUFNQyxDQUFDLEdBQUcsTUFBTWhFLElBQUksQ0FBQ2lFLEdBQUwsQ0FBU04sR0FBRyxHQUFHLENBQWYsQ0FBaEI7QUFDQSxZQUFNRCxFQUFFLEdBQUcsS0FBS0osSUFBSSxHQUFHQyxHQUFaLENBQVg7QUFFQTNHLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVWlJLE1BQU0sR0FBR0csQ0FBQyxHQUFHSixNQUFQLEdBQWdCSSxDQUFoQztBQUNBcEgsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVUsQ0FBVjtBQUNBZSxRQUFBQSxHQUFHLENBQUNkLEdBQUosR0FBVSxDQUFWO0FBQ0FjLFFBQUFBLEdBQUcsQ0FBQ2IsR0FBSixHQUFVLENBQVY7QUFDQWEsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVUsQ0FBVjtBQUNBWSxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVSxDQUFDNEgsTUFBTSxHQUFHRyxDQUFILEdBQU9BLENBQUMsR0FBR0osTUFBbEIsSUFBNEJHLGVBQXRDO0FBQ0FuSCxRQUFBQSxHQUFHLENBQUNWLEdBQUosR0FBVSxDQUFWO0FBQ0FVLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVLENBQVY7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVUsQ0FBVjtBQUNBUSxRQUFBQSxHQUFHLENBQUNQLEdBQUosR0FBVSxDQUFWO0FBQ0FPLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQUNpSCxHQUFHLEdBQUdPLFFBQVEsR0FBR1IsSUFBbEIsSUFBMEJJLEVBQXBDO0FBQ0E5RyxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVSxDQUFDLENBQVg7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVNkcsR0FBRyxHQUFHRCxJQUFOLEdBQWFJLEVBQWIsSUFBbUIsSUFBSUksUUFBdkIsQ0FBVjtBQUNBbEgsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7NEJBVVFBLEcsRUFBVXNHLEksRUFBY0MsSyxFQUFlQyxNLEVBQWdCQyxHLEVBQWFDLEksRUFBY0MsRyxFQUM5QztBQUFBLFlBQXBDTyxRQUFvQyx1RUFBekIsQ0FBQyxDQUF3QjtBQUFBLFlBQXJCQyxlQUFxQix1RUFBSCxDQUFHO0FBRXhDLFlBQU1HLEVBQUUsR0FBRyxLQUFLaEIsSUFBSSxHQUFHQyxLQUFaLENBQVg7QUFDQSxZQUFNZ0IsRUFBRSxHQUFHLEtBQUtmLE1BQU0sR0FBR0MsR0FBZCxDQUFYO0FBQ0EsWUFBTUssRUFBRSxHQUFHLEtBQUtKLElBQUksR0FBR0MsR0FBWixDQUFYO0FBQ0EzRyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsQ0FBQyxDQUFELEdBQUtzSSxFQUFmO0FBQ0F0SCxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVSxDQUFWO0FBQ0FlLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVLENBQVY7QUFDQWMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUNBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVSxDQUFWO0FBQ0FZLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVLENBQUMsQ0FBRCxHQUFLa0ksRUFBTCxHQUFVSixlQUFwQjtBQUNBbkgsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVUsQ0FBVjtBQUNBVSxRQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVSxDQUFWO0FBQ0FTLFFBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVLENBQVY7QUFDQVEsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUsQ0FBVjtBQUNBTyxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVW9ILEVBQUUsSUFBSSxJQUFJSSxRQUFSLENBQVo7QUFDQWxILFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBQzBHLElBQUksR0FBR0MsS0FBUixJQUFpQmUsRUFBM0I7QUFDQXRILFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVLENBQUM0RyxHQUFHLEdBQUdELE1BQVAsSUFBaUJlLEVBQTNCO0FBQ0F2SCxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVSxDQUFDNEcsSUFBSSxHQUFHUSxRQUFRLEdBQUdQLEdBQW5CLElBQTBCRyxFQUFwQztBQUNBOUcsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUNBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7NkJBTXlFQSxHLEVBQVV3SCxHLEVBQWNDLE0sRUFBaUJDLEUsRUFBYTtBQUMzSCxZQUFNQyxJQUFJLEdBQUdILEdBQUcsQ0FBQzVFLENBQWpCO0FBQ0EsWUFBTWdGLElBQUksR0FBR0osR0FBRyxDQUFDM0UsQ0FBakI7QUFDQSxZQUFNZ0YsSUFBSSxHQUFHTCxHQUFHLENBQUMxRSxDQUFqQjtBQUNBLFlBQU1nRixHQUFHLEdBQUdKLEVBQUUsQ0FBQzlFLENBQWY7QUFDQSxZQUFNbUYsR0FBRyxHQUFHTCxFQUFFLENBQUM3RSxDQUFmO0FBQ0EsWUFBTW1GLEdBQUcsR0FBR04sRUFBRSxDQUFDNUUsQ0FBZjtBQUNBLFlBQU1tRixPQUFPLEdBQUdSLE1BQU0sQ0FBQzdFLENBQXZCO0FBQ0EsWUFBTXNGLE9BQU8sR0FBR1QsTUFBTSxDQUFDNUUsQ0FBdkI7QUFDQSxZQUFNc0YsT0FBTyxHQUFHVixNQUFNLENBQUMzRSxDQUF2QjtBQUVBLFlBQUlzRixFQUFFLEdBQUdULElBQUksR0FBR00sT0FBaEI7QUFDQSxZQUFJSSxFQUFFLEdBQUdULElBQUksR0FBR00sT0FBaEI7QUFDQSxZQUFJN0QsRUFBRSxHQUFHd0QsSUFBSSxHQUFHTSxPQUFoQjtBQUVBLFlBQUloRixHQUFHLEdBQUcsSUFBSUMsSUFBSSxDQUFDQyxJQUFMLENBQVUrRSxFQUFFLEdBQUdBLEVBQUwsR0FBVUMsRUFBRSxHQUFHQSxFQUFmLEdBQW9CaEUsRUFBRSxHQUFHQSxFQUFuQyxDQUFkO0FBQ0ErRCxRQUFBQSxFQUFFLElBQUlqRixHQUFOO0FBQ0FrRixRQUFBQSxFQUFFLElBQUlsRixHQUFOO0FBQ0FrQixRQUFBQSxFQUFFLElBQUlsQixHQUFOO0FBRUEsWUFBSW1GLEVBQUUsR0FBR1AsR0FBRyxHQUFHMUQsRUFBTixHQUFXMkQsR0FBRyxHQUFHSyxFQUExQjtBQUNBLFlBQUlFLEVBQUUsR0FBR1AsR0FBRyxHQUFHSSxFQUFOLEdBQVdOLEdBQUcsR0FBR3pELEVBQTFCO0FBQ0EsWUFBSUYsRUFBRSxHQUFHMkQsR0FBRyxHQUFHTyxFQUFOLEdBQVdOLEdBQUcsR0FBR0ssRUFBMUI7QUFDQWpGLFFBQUFBLEdBQUcsR0FBRyxJQUFJQyxJQUFJLENBQUNDLElBQUwsQ0FBVWlGLEVBQUUsR0FBR0EsRUFBTCxHQUFVQyxFQUFFLEdBQUdBLEVBQWYsR0FBb0JwRSxFQUFFLEdBQUdBLEVBQW5DLENBQVY7QUFDQW1FLFFBQUFBLEVBQUUsSUFBSW5GLEdBQU47QUFDQW9GLFFBQUFBLEVBQUUsSUFBSXBGLEdBQU47QUFDQWdCLFFBQUFBLEVBQUUsSUFBSWhCLEdBQU47QUFFQSxZQUFNcUYsRUFBRSxHQUFHSCxFQUFFLEdBQUdsRSxFQUFMLEdBQVVFLEVBQUUsR0FBR2tFLEVBQTFCO0FBQ0EsWUFBTUUsRUFBRSxHQUFHcEUsRUFBRSxHQUFHaUUsRUFBTCxHQUFVRixFQUFFLEdBQUdqRSxFQUExQjtBQUNBLFlBQU1DLEVBQUUsR0FBR2dFLEVBQUUsR0FBR0csRUFBTCxHQUFVRixFQUFFLEdBQUdDLEVBQTFCO0FBRUF0SSxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVVzSixFQUFWO0FBQ0F0SSxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVXVKLEVBQVY7QUFDQXhJLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVa0osRUFBVjtBQUNBcEksUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUNBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVW1KLEVBQVY7QUFDQXZJLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVb0osRUFBVjtBQUNBekksUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVUrSSxFQUFWO0FBQ0FySSxRQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVSxDQUFWO0FBQ0FTLFFBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVMkUsRUFBVjtBQUNBbkUsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVUyRSxFQUFWO0FBQ0FwRSxRQUFBQSxHQUFHLENBQUNOLEdBQUosR0FBVTJFLEVBQVY7QUFDQXJFLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsRUFBRTBJLEVBQUUsR0FBR1gsSUFBTCxHQUFZWSxFQUFFLEdBQUdYLElBQWpCLEdBQXdCekQsRUFBRSxHQUFHMEQsSUFBL0IsQ0FBVjtBQUNBN0gsUUFBQUEsR0FBRyxDQUFDSCxHQUFKLEdBQVUsRUFBRTJJLEVBQUUsR0FBR2IsSUFBTCxHQUFZYyxFQUFFLEdBQUdiLElBQWpCLEdBQXdCeEQsRUFBRSxHQUFHeUQsSUFBL0IsQ0FBVjtBQUNBN0gsUUFBQUEsR0FBRyxDQUFDRixHQUFKLEdBQVUsRUFBRXNJLEVBQUUsR0FBR1QsSUFBTCxHQUFZVSxFQUFFLEdBQUdULElBQWpCLEdBQXdCdkQsRUFBRSxHQUFHd0QsSUFBL0IsQ0FBVjtBQUNBN0gsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUVBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7dUNBR3dEQSxHLEVBQVVqQixDLEVBQVE7QUFFdEUsWUFBTWdDLEdBQUcsR0FBR2hDLENBQUMsQ0FBQ0MsR0FBZDtBQUFtQixZQUFNeUIsR0FBRyxHQUFHMUIsQ0FBQyxDQUFDRSxHQUFkO0FBQW1CLFlBQU15QixHQUFHLEdBQUczQixDQUFDLENBQUNHLEdBQWQ7QUFBbUIsWUFBTXlCLEdBQUcsR0FBRzVCLENBQUMsQ0FBQ0ksR0FBZDtBQUN6RCxZQUFNNkIsR0FBRyxHQUFHakMsQ0FBQyxDQUFDSyxHQUFkO0FBQW1CLFlBQU02QixHQUFHLEdBQUdsQyxDQUFDLENBQUNNLEdBQWQ7QUFBbUIsWUFBTXVCLEdBQUcsR0FBRzdCLENBQUMsQ0FBQ08sR0FBZDtBQUFtQixZQUFNdUIsR0FBRyxHQUFHOUIsQ0FBQyxDQUFDUSxHQUFkO0FBQ3pELFlBQU0yQixHQUFHLEdBQUduQyxDQUFDLENBQUNTLEdBQWQ7QUFBbUIsWUFBTTJCLEdBQUcsR0FBR3BDLENBQUMsQ0FBQ1UsR0FBZDtBQUFtQixZQUFNMkIsR0FBRyxHQUFHckMsQ0FBQyxDQUFDVyxHQUFkO0FBQW1CLFlBQU1vQixHQUFHLEdBQUcvQixDQUFDLENBQUNZLEdBQWQ7QUFDekQsWUFBTTBCLEdBQUcsR0FBR3RDLENBQUMsQ0FBQ2EsR0FBZDtBQUFtQixZQUFNMEIsR0FBRyxHQUFHdkMsQ0FBQyxDQUFDYyxHQUFkO0FBQW1CLFlBQU0wQixHQUFHLEdBQUd4QyxDQUFDLENBQUNlLEdBQWQ7QUFBbUIsWUFBTTBCLEdBQUcsR0FBR3pDLENBQUMsQ0FBQ2dCLEdBQWQ7QUFFekQsWUFBTTBCLEdBQUcsR0FBR1YsR0FBRyxHQUFHRSxHQUFOLEdBQVlSLEdBQUcsR0FBR08sR0FBOUI7QUFDQSxZQUFNVSxHQUFHLEdBQUdYLEdBQUcsR0FBR0gsR0FBTixHQUFZRixHQUFHLEdBQUdNLEdBQTlCO0FBQ0EsWUFBTVcsR0FBRyxHQUFHWixHQUFHLEdBQUdGLEdBQU4sR0FBWUYsR0FBRyxHQUFHSyxHQUE5QjtBQUNBLFlBQU1ZLEdBQUcsR0FBR25CLEdBQUcsR0FBR0csR0FBTixHQUFZRixHQUFHLEdBQUdPLEdBQTlCO0FBQ0EsWUFBTVksR0FBRyxHQUFHcEIsR0FBRyxHQUFHSSxHQUFOLEdBQVlGLEdBQUcsR0FBR00sR0FBOUI7QUFDQSxZQUFNYSxHQUFHLEdBQUdwQixHQUFHLEdBQUdHLEdBQU4sR0FBWUYsR0FBRyxHQUFHQyxHQUE5QjtBQUNBLFlBQU1tQixHQUFHLEdBQUdiLEdBQUcsR0FBR0ksR0FBTixHQUFZSCxHQUFHLEdBQUdFLEdBQTlCO0FBQ0EsWUFBTVcsR0FBRyxHQUFHZCxHQUFHLEdBQUdLLEdBQU4sR0FBWUgsR0FBRyxHQUFHQyxHQUE5QjtBQUNBLFlBQU1ZLEdBQUcsR0FBR2YsR0FBRyxHQUFHTSxHQUFOLEdBQVlWLEdBQUcsR0FBR08sR0FBOUI7QUFDQSxZQUFNYSxHQUFHLEdBQUdmLEdBQUcsR0FBR0ksR0FBTixHQUFZSCxHQUFHLEdBQUdFLEdBQTlCO0FBQ0EsWUFBTWEsR0FBRyxHQUFHaEIsR0FBRyxHQUFHSyxHQUFOLEdBQVlWLEdBQUcsR0FBR1EsR0FBOUI7QUFDQSxZQUFNYyxHQUFHLEdBQUdoQixHQUFHLEdBQUdJLEdBQU4sR0FBWVYsR0FBRyxHQUFHUyxHQUE5QixDQWxCc0UsQ0FvQnRFOztBQUNBLFlBQUljLEdBQUcsR0FBR1osR0FBRyxHQUFHVyxHQUFOLEdBQVlWLEdBQUcsR0FBR1MsR0FBbEIsR0FBd0JSLEdBQUcsR0FBR08sR0FBOUIsR0FBb0NOLEdBQUcsR0FBR0ssR0FBMUMsR0FBZ0RKLEdBQUcsR0FBR0csR0FBdEQsR0FBNERGLEdBQUcsR0FBR0MsR0FBNUU7O0FBRUEsWUFBSSxDQUFDTSxHQUFMLEVBQVU7QUFDTixpQkFBTyxJQUFQO0FBQ0g7O0FBQ0RBLFFBQUFBLEdBQUcsR0FBRyxNQUFNQSxHQUFaO0FBRUFyQyxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUsQ0FBQ2lDLEdBQUcsR0FBR21CLEdBQU4sR0FBWXhCLEdBQUcsR0FBR3VCLEdBQWxCLEdBQXdCdEIsR0FBRyxHQUFHcUIsR0FBL0IsSUFBc0NHLEdBQWhEO0FBQ0FyQyxRQUFBQSxHQUFHLENBQUNmLEdBQUosR0FBVSxDQUFDMkIsR0FBRyxHQUFHcUIsR0FBTixHQUFZakIsR0FBRyxHQUFHb0IsR0FBbEIsR0FBd0J2QixHQUFHLEdBQUdtQixHQUEvQixJQUFzQ0ssR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ2QsR0FBSixHQUFVLENBQUM4QixHQUFHLEdBQUdtQixHQUFOLEdBQVlsQixHQUFHLEdBQUdnQixHQUFsQixHQUF3QnBCLEdBQUcsR0FBR2tCLEdBQS9CLElBQXNDTSxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVUsQ0FBVjtBQUVBYSxRQUFBQSxHQUFHLENBQUNaLEdBQUosR0FBVSxDQUFDc0IsR0FBRyxHQUFHeUIsR0FBTixHQUFZMUIsR0FBRyxHQUFHMkIsR0FBbEIsR0FBd0J6QixHQUFHLEdBQUd1QixHQUEvQixJQUFzQ0csR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ1gsR0FBSixHQUFVLENBQUMwQixHQUFHLEdBQUdxQixHQUFOLEdBQVkxQixHQUFHLEdBQUd1QixHQUFsQixHQUF3QnRCLEdBQUcsR0FBR3FCLEdBQS9CLElBQXNDSyxHQUFoRDtBQUNBckMsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVUsQ0FBQ21CLEdBQUcsR0FBR3dCLEdBQU4sR0FBWWxCLEdBQUcsR0FBR29CLEdBQWxCLEdBQXdCeEIsR0FBRyxHQUFHb0IsR0FBL0IsSUFBc0NNLEdBQWhEO0FBQ0FyQyxRQUFBQSxHQUFHLENBQUNULEdBQUosR0FBVSxDQUFWO0FBRUFTLFFBQUFBLEdBQUcsQ0FBQ1IsR0FBSixHQUFVLENBQUM4QixHQUFHLEdBQUdRLEdBQU4sR0FBWVAsR0FBRyxHQUFHTSxHQUFsQixHQUF3QkwsR0FBRyxHQUFHSSxHQUEvQixJQUFzQ1MsR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ1AsR0FBSixHQUFVLENBQUM4QixHQUFHLEdBQUdJLEdBQU4sR0FBWU4sR0FBRyxHQUFHUyxHQUFsQixHQUF3Qk4sR0FBRyxHQUFHRSxHQUEvQixJQUFzQ1csR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVLENBQUMyQixHQUFHLEdBQUdRLEdBQU4sR0FBWVAsR0FBRyxHQUFHSyxHQUFsQixHQUF3QkgsR0FBRyxHQUFHQyxHQUEvQixJQUFzQ1ksR0FBaEQ7QUFDQXJDLFFBQUFBLEdBQUcsQ0FBQ0wsR0FBSixHQUFVLENBQVY7QUFFQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUsQ0FBVjtBQUNBSSxRQUFBQSxHQUFHLENBQUNILEdBQUosR0FBVSxDQUFWO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQ0YsR0FBSixHQUFVLENBQVY7QUFDQUUsUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVUsQ0FBVjtBQUVBLGVBQU9DLEdBQVA7QUFDSDtBQUVEOzs7Ozs7OzhCQUlnRUEsRyxFQUFVcUYsQyxFQUF1QjtBQUFBLFlBQVRxRCxHQUFTLHVFQUFILENBQUc7QUFDN0YxSSxRQUFBQSxHQUFHLENBQUMwSSxHQUFHLEdBQUcsQ0FBUCxDQUFILEdBQWVyRCxDQUFDLENBQUNyRyxHQUFqQjtBQUNBZ0IsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDcEcsR0FBakI7QUFDQWUsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDbkcsR0FBakI7QUFDQWMsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDbEcsR0FBakI7QUFDQWEsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDakcsR0FBakI7QUFDQVksUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDaEcsR0FBakI7QUFDQVcsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDL0YsR0FBakI7QUFDQVUsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDOUYsR0FBakI7QUFDQVMsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDN0YsR0FBakI7QUFDQVEsUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLENBQVAsQ0FBSCxHQUFlckQsQ0FBQyxDQUFDNUYsR0FBakI7QUFDQU8sUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLEVBQVAsQ0FBSCxHQUFnQnJELENBQUMsQ0FBQzNGLEdBQWxCO0FBQ0FNLFFBQUFBLEdBQUcsQ0FBQzBJLEdBQUcsR0FBRyxFQUFQLENBQUgsR0FBZ0JyRCxDQUFDLENBQUMxRixHQUFsQjtBQUNBSyxRQUFBQSxHQUFHLENBQUMwSSxHQUFHLEdBQUcsRUFBUCxDQUFILEdBQWdCckQsQ0FBQyxDQUFDekYsR0FBbEI7QUFDQUksUUFBQUEsR0FBRyxDQUFDMEksR0FBRyxHQUFHLEVBQVAsQ0FBSCxHQUFnQnJELENBQUMsQ0FBQ3hGLEdBQWxCO0FBQ0FHLFFBQUFBLEdBQUcsQ0FBQzBJLEdBQUcsR0FBRyxFQUFQLENBQUgsR0FBZ0JyRCxDQUFDLENBQUN2RixHQUFsQjtBQUNBRSxRQUFBQSxHQUFHLENBQUMwSSxHQUFHLEdBQUcsRUFBUCxDQUFILEdBQWdCckQsQ0FBQyxDQUFDdEYsR0FBbEI7QUFDQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7OztnQ0FJaURBLEcsRUFBVTJJLEcsRUFBMEM7QUFBQSxZQUFURCxHQUFTLHVFQUFILENBQUc7QUFDakcxSSxRQUFBQSxHQUFHLENBQUNoQixHQUFKLEdBQVUySixHQUFHLENBQUNELEdBQUcsR0FBRyxDQUFQLENBQWI7QUFDQTFJLFFBQUFBLEdBQUcsQ0FBQ2YsR0FBSixHQUFVMEosR0FBRyxDQUFDRCxHQUFHLEdBQUcsQ0FBUCxDQUFiO0FBQ0ExSSxRQUFBQSxHQUFHLENBQUNkLEdBQUosR0FBVXlKLEdBQUcsQ0FBQ0QsR0FBRyxHQUFHLENBQVAsQ0FBYjtBQUNBMUksUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVV3SixHQUFHLENBQUNELEdBQUcsR0FBRyxDQUFQLENBQWI7QUFDQTFJLFFBQUFBLEdBQUcsQ0FBQ1osR0FBSixHQUFVdUosR0FBRyxDQUFDRCxHQUFHLEdBQUcsQ0FBUCxDQUFiO0FBQ0ExSSxRQUFBQSxHQUFHLENBQUNYLEdBQUosR0FBVXNKLEdBQUcsQ0FBQ0QsR0FBRyxHQUFHLENBQVAsQ0FBYjtBQUNBMUksUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVxSixHQUFHLENBQUNELEdBQUcsR0FBRyxDQUFQLENBQWI7QUFDQTFJLFFBQUFBLEdBQUcsQ0FBQ1QsR0FBSixHQUFVb0osR0FBRyxDQUFDRCxHQUFHLEdBQUcsQ0FBUCxDQUFiO0FBQ0ExSSxRQUFBQSxHQUFHLENBQUNSLEdBQUosR0FBVW1KLEdBQUcsQ0FBQ0QsR0FBRyxHQUFHLENBQVAsQ0FBYjtBQUNBMUksUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVVrSixHQUFHLENBQUNELEdBQUcsR0FBRyxDQUFQLENBQWI7QUFDQTFJLFFBQUFBLEdBQUcsQ0FBQ04sR0FBSixHQUFVaUosR0FBRyxDQUFDRCxHQUFHLEdBQUcsRUFBUCxDQUFiO0FBQ0ExSSxRQUFBQSxHQUFHLENBQUNMLEdBQUosR0FBVWdKLEdBQUcsQ0FBQ0QsR0FBRyxHQUFHLEVBQVAsQ0FBYjtBQUNBMUksUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVUrSSxHQUFHLENBQUNELEdBQUcsR0FBRyxFQUFQLENBQWI7QUFDQTFJLFFBQUFBLEdBQUcsQ0FBQ0gsR0FBSixHQUFVOEksR0FBRyxDQUFDRCxHQUFHLEdBQUcsRUFBUCxDQUFiO0FBQ0ExSSxRQUFBQSxHQUFHLENBQUNGLEdBQUosR0FBVTZJLEdBQUcsQ0FBQ0QsR0FBRyxHQUFHLEVBQVAsQ0FBYjtBQUNBMUksUUFBQUEsR0FBRyxDQUFDRCxHQUFKLEdBQVU0SSxHQUFHLENBQUNELEdBQUcsR0FBRyxFQUFQLENBQWI7QUFDQSxlQUFPMUksR0FBUDtBQUNIO0FBRUQ7Ozs7OzswQkFHMkNBLEcsRUFBVWpCLEMsRUFBUXVELEMsRUFBUTtBQUNqRXRDLFFBQUFBLEdBQUcsQ0FBQ2hCLEdBQUosR0FBVUQsQ0FBQyxDQUFDQyxHQUFGLEdBQVFzRCxDQUFDLENBQUN0RCxHQUFwQjtBQUNBZ0IsUUFBQUEsR0FBRyxDQUFDZixHQUFKLEdBQVVGLENBQUMsQ0FBQ0UsR0FBRixHQUFRcUQsQ0FBQyxDQUFDckQsR0FBcEI7QUFDQWUsUUFBQUEsR0FBRyxDQUFDZCxHQUFKLEdBQVVILENBQUMsQ0FBQ0csR0FBRixHQUFRb0QsQ0FBQyxDQUFDcEQsR0FBcEI7QUFDQWMsUUFBQUEsR0FBRyxDQUFDYixHQUFKLEdBQVVKLENBQUMsQ0FBQ0ksR0FBRixHQUFRbUQsQ0FBQyxDQUFDbkQsR0FBcEI7QUFDQWEsUUFBQUEsR0FBRyxDQUFDWixHQUFKLEdBQVVMLENBQUMsQ0FBQ0ssR0FBRixHQUFRa0QsQ0FBQyxDQUFDbEQsR0FBcEI7QUFDQVksUUFBQUEsR0FBRyxDQUFDWCxHQUFKLEdBQVVOLENBQUMsQ0FBQ00sR0FBRixHQUFRaUQsQ0FBQyxDQUFDakQsR0FBcEI7QUFDQVcsUUFBQUEsR0FBRyxDQUFDVixHQUFKLEdBQVVQLENBQUMsQ0FBQ08sR0FBRixHQUFRZ0QsQ0FBQyxDQUFDaEQsR0FBcEI7QUFDQVUsUUFBQUEsR0FBRyxDQUFDVCxHQUFKLEdBQVVSLENBQUMsQ0FBQ1EsR0FBRixHQUFRK0MsQ0FBQyxDQUFDL0MsR0FBcEI7QUFDQVMsUUFBQUEsR0FBRyxDQUFDUixHQUFKLEdBQVVULENBQUMsQ0FBQ1MsR0FBRixHQUFROEMsQ0FBQyxDQUFDOUMsR0FBcEI7QUFDQVEsUUFBQUEsR0FBRyxDQUFDUCxHQUFKLEdBQVVWLENBQUMsQ0FBQ1UsR0FBRixHQUFRNkMsQ0FBQyxDQUFDN0MsR0FBcEI7QUFDQU8sUUFBQUEsR0FBRyxDQUFDTixHQUFKLEdBQVVYLENBQUMsQ0FBQ1csR0FBRixHQUFRNEMsQ0FBQyxDQUFDNUMsR0FBcEI7QUFDQU0sUUFBQUEsR0FBRyxDQUFDTCxHQUFKLEdBQVVaLENBQUMsQ0FBQ1ksR0FBRixHQUFRMkMsQ0FBQyxDQUFDM0MsR0FBcEI7QUFDQUssUUFBQUEsR0FBRyxDQUFDSixHQUFKLEdBQVViLENBQUMsQ0FBQ2EsR0FBRixHQUFRMEMsQ0FBQyxDQUFDMUMsR0FBcEI7QUFD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QWxFLEVBQXVFQyxHQUF2RSxFQUE0RUMsR0FBNUUsRUFBaUZDLEdBQWpGLEVBQXNGQyxHQUF0RixFQUEyRkMsR0FBM0YsQ0FBUDtBQUNIOztBQUVEZ0osMEJBQVNDLElBQVQsR0FBZ0JBLElBQWhCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL21hdGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBDQ0NsYXNzIH0gZnJvbSAnLi4vZGF0YS9jbGFzcyc7XHJcbmltcG9ydCB7IFZhbHVlVHlwZSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL3ZhbHVlLXR5cGUnO1xyXG5pbXBvcnQgeyBNYXQzIH0gZnJvbSAnLi9tYXQzJztcclxuaW1wb3J0IHsgUXVhdCB9IGZyb20gJy4vcXVhdCc7XHJcbmltcG9ydCB7IElNYXQ0TGlrZSwgSVZlYzNMaWtlIH0gZnJvbSAnLi90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IEVQU0lMT04gfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4vdmVjMyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIOihqOekuuWbm+e7tO+8iDR4NO+8ieefqemYteOAglxyXG4gKi9cclxuLy8gdHNsaW50OmRpc2FibGU6b25lLXZhcmlhYmxlLXBlci1kZWNsYXJhdGlvblxyXG5leHBvcnQgY2xhc3MgTWF0NCBleHRlbmRzIFZhbHVlVHlwZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBJREVOVElUWSA9IE9iamVjdC5mcmVlemUobmV3IE1hdDQoKSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6I635b6X5oyH5a6a55+p6Zi155qE5ou36LSdXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0NChcclxuICAgICAgICAgICAgYS5tMDAsIGEubTAxLCBhLm0wMiwgYS5tMDMsXHJcbiAgICAgICAgICAgIGEubTA0LCBhLm0wNSwgYS5tMDYsIGEubTA3LFxyXG4gICAgICAgICAgICBhLm0wOCwgYS5tMDksIGEubTEwLCBhLm0xMSxcclxuICAgICAgICAgICAgYS5tMTIsIGEubTEzLCBhLm0xNCwgYS5tMTUsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlpI3liLbnm67moIfnn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IGEubTAwO1xyXG4gICAgICAgIG91dC5tMDEgPSBhLm0wMTtcclxuICAgICAgICBvdXQubTAyID0gYS5tMDI7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEubTAzO1xyXG4gICAgICAgIG91dC5tMDQgPSBhLm0wNDtcclxuICAgICAgICBvdXQubTA1ID0gYS5tMDU7XHJcbiAgICAgICAgb3V0Lm0wNiA9IGEubTA2O1xyXG4gICAgICAgIG91dC5tMDcgPSBhLm0wNztcclxuICAgICAgICBvdXQubTA4ID0gYS5tMDg7XHJcbiAgICAgICAgb3V0Lm0wOSA9IGEubTA5O1xyXG4gICAgICAgIG91dC5tMTAgPSBhLm0xMDtcclxuICAgICAgICBvdXQubTExID0gYS5tMTE7XHJcbiAgICAgICAgb3V0Lm0xMiA9IGEubTEyO1xyXG4gICAgICAgIG91dC5tMTMgPSBhLm0xMztcclxuICAgICAgICBvdXQubTE0ID0gYS5tMTQ7XHJcbiAgICAgICAgb3V0Lm0xNSA9IGEubTE1O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u55+p6Zi15YC8XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+ICAoXHJcbiAgICAgICAgb3V0OiBPdXQsXHJcbiAgICAgICAgbTAwOiBudW1iZXIsIG0wMTogbnVtYmVyLCBtMDI6IG51bWJlciwgbTAzOiBudW1iZXIsXHJcbiAgICAgICAgbTEwOiBudW1iZXIsIG0xMTogbnVtYmVyLCBtMTI6IG51bWJlciwgbTEzOiBudW1iZXIsXHJcbiAgICAgICAgbTIwOiBudW1iZXIsIG0yMTogbnVtYmVyLCBtMjI6IG51bWJlciwgbTIzOiBudW1iZXIsXHJcbiAgICAgICAgbTMwOiBudW1iZXIsIG0zMTogbnVtYmVyLCBtMzI6IG51bWJlciwgbTMzOiBudW1iZXIsXHJcbiAgICApIHtcclxuICAgICAgICBvdXQubTAwID0gbTAwOyBvdXQubTAxID0gbTAxOyBvdXQubTAyID0gbTAyOyBvdXQubTAzID0gbTAzO1xyXG4gICAgICAgIG91dC5tMDQgPSBtMTA7IG91dC5tMDUgPSBtMTE7IG91dC5tMDYgPSBtMTI7IG91dC5tMDcgPSBtMTM7XHJcbiAgICAgICAgb3V0Lm0wOCA9IG0yMDsgb3V0Lm0wOSA9IG0yMTsgb3V0Lm0xMCA9IG0yMjsgb3V0Lm0xMSA9IG0yMztcclxuICAgICAgICBvdXQubTEyID0gbTMwOyBvdXQubTEzID0gbTMxOyBvdXQubTE0ID0gbTMyOyBvdXQubTE1ID0gbTMzO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG55uu5qCH6LWL5YC85Li65Y2V5L2N55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgaWRlbnRpdHkgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0KSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IDE7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNSA9IDE7XHJcbiAgICAgICAgb3V0Lm0wNiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMCA9IDE7XHJcbiAgICAgICAgb3V0Lm0xMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDovaznva7nn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc3Bvc2UgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuICAgICAgICAvLyBJZiB3ZSBhcmUgdHJhbnNwb3Npbmcgb3Vyc2VsdmVzIHdlIGNhbiBza2lwIGEgZmV3IHN0ZXBzIGJ1dCBoYXZlIHRvIGNhY2hlIHNvbWUgdmFsdWVzXHJcbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xyXG4gICAgICAgICAgICBjb25zdCBhMDEgPSBhLm0wMSwgYTAyID0gYS5tMDIsIGEwMyA9IGEubTAzLCBhMTIgPSBhLm0wNiwgYTEzID0gYS5tMDcsIGEyMyA9IGEubTExO1xyXG4gICAgICAgICAgICBvdXQubTAxID0gYS5tMDQ7XHJcbiAgICAgICAgICAgIG91dC5tMDIgPSBhLm0wODtcclxuICAgICAgICAgICAgb3V0Lm0wMyA9IGEubTEyO1xyXG4gICAgICAgICAgICBvdXQubTA0ID0gYTAxO1xyXG4gICAgICAgICAgICBvdXQubTA2ID0gYS5tMDk7XHJcbiAgICAgICAgICAgIG91dC5tMDcgPSBhLm0xMztcclxuICAgICAgICAgICAgb3V0Lm0wOCA9IGEwMjtcclxuICAgICAgICAgICAgb3V0Lm0wOSA9IGExMjtcclxuICAgICAgICAgICAgb3V0Lm0xMSA9IGEubTE0O1xyXG4gICAgICAgICAgICBvdXQubTEyID0gYTAzO1xyXG4gICAgICAgICAgICBvdXQubTEzID0gYTEzO1xyXG4gICAgICAgICAgICBvdXQubTE0ID0gYTIzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG91dC5tMDAgPSBhLm0wMDtcclxuICAgICAgICAgICAgb3V0Lm0wMSA9IGEubTA0O1xyXG4gICAgICAgICAgICBvdXQubTAyID0gYS5tMDg7XHJcbiAgICAgICAgICAgIG91dC5tMDMgPSBhLm0xMjtcclxuICAgICAgICAgICAgb3V0Lm0wNCA9IGEubTAxO1xyXG4gICAgICAgICAgICBvdXQubTA1ID0gYS5tMDU7XHJcbiAgICAgICAgICAgIG91dC5tMDYgPSBhLm0wOTtcclxuICAgICAgICAgICAgb3V0Lm0wNyA9IGEubTEzO1xyXG4gICAgICAgICAgICBvdXQubTA4ID0gYS5tMDI7XHJcbiAgICAgICAgICAgIG91dC5tMDkgPSBhLm0wNjtcclxuICAgICAgICAgICAgb3V0Lm0xMCA9IGEubTEwO1xyXG4gICAgICAgICAgICBvdXQubTExID0gYS5tMTQ7XHJcbiAgICAgICAgICAgIG91dC5tMTIgPSBhLm0wMztcclxuICAgICAgICAgICAgb3V0Lm0xMyA9IGEubTA3O1xyXG4gICAgICAgICAgICBvdXQubTE0ID0gYS5tMTE7XHJcbiAgICAgICAgICAgIG91dC5tMTUgPSBhLm0xNTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXmsYLpgIbvvIzms6jmhI/vvIzlnKjnn6npmLXkuI3lj6/pgIbml7bvvIzkvJrov5Tlm57kuIDkuKrlhajkuLogMCDnmoTnn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnZlcnQgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjsgY29uc3QgYTAzID0gYS5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDQ7IGNvbnN0IGExMSA9IGEubTA1OyBjb25zdCBhMTIgPSBhLm0wNjsgY29uc3QgYTEzID0gYS5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gYS5tMDg7IGNvbnN0IGEyMSA9IGEubTA5OyBjb25zdCBhMjIgPSBhLm0xMDsgY29uc3QgYTIzID0gYS5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gYS5tMTI7IGNvbnN0IGEzMSA9IGEubTEzOyBjb25zdCBhMzIgPSBhLm0xNDsgY29uc3QgYTMzID0gYS5tMTU7XHJcblxyXG4gICAgICAgIGNvbnN0IGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICAgICAgICBjb25zdCBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyO1xyXG4gICAgICAgIGNvbnN0IGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICAgICAgICBjb25zdCBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XHJcbiAgICAgICAgbGV0IGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcclxuXHJcbiAgICAgICAgaWYgKGRldCA9PT0gMCkge1xyXG4gICAgICAgICAgICBvdXQubTAwID0gMDsgb3V0Lm0wMSA9IDA7IG91dC5tMDIgPSAwOyBvdXQubTAzID0gMDtcclxuICAgICAgICAgICAgb3V0Lm0wNCA9IDA7IG91dC5tMDUgPSAwOyBvdXQubTA2ID0gMDsgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgICAgIG91dC5tMDggPSAwOyBvdXQubTA5ID0gMDsgb3V0Lm0xMCA9IDA7IG91dC5tMTEgPSAwO1xyXG4gICAgICAgICAgICBvdXQubTEyID0gMDsgb3V0Lm0xMyA9IDA7IG91dC5tMTQgPSAwOyBvdXQubTE1ID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuIG91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xyXG5cclxuICAgICAgICBvdXQubTAwID0gKGExMSAqIGIxMSAtIGExMiAqIGIxMCArIGExMyAqIGIwOSkgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wMSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDIgPSAoYTMxICogYjA1IC0gYTMyICogYjA0ICsgYTMzICogYjAzKSAqIGRldDtcclxuICAgICAgICBvdXQubTAzID0gKGEyMiAqIGIwNCAtIGEyMSAqIGIwNSAtIGEyMyAqIGIwMykgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wNCA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDUgPSAoYTAwICogYjExIC0gYTAyICogYjA4ICsgYTAzICogYjA3KSAqIGRldDtcclxuICAgICAgICBvdXQubTA2ID0gKGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSkgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wNyA9IChhMjAgKiBiMDUgLSBhMjIgKiBiMDIgKyBhMjMgKiBiMDEpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDggPSAoYTEwICogYjEwIC0gYTExICogYjA4ICsgYTEzICogYjA2KSAqIGRldDtcclxuICAgICAgICBvdXQubTA5ID0gKGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNikgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0xMCA9IChhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDApICogZGV0O1xyXG4gICAgICAgIG91dC5tMTEgPSAoYTIxICogYjAyIC0gYTIwICogYjA0IC0gYTIzICogYjAwKSAqIGRldDtcclxuICAgICAgICBvdXQubTEyID0gKGExMSAqIGIwNyAtIGExMCAqIGIwOSAtIGExMiAqIGIwNikgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0xMyA9IChhMDAgKiBiMDkgLSBhMDEgKiBiMDcgKyBhMDIgKiBiMDYpICogZGV0O1xyXG4gICAgICAgIG91dC5tMTQgPSAoYTMxICogYjAxIC0gYTMwICogYjAzIC0gYTMyICogYjAwKSAqIGRldDtcclxuICAgICAgICBvdXQubTE1ID0gKGEyMCAqIGIwMyAtIGEyMSAqIGIwMSArIGEyMiAqIGIwMCkgKiBkZXQ7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg55+p6Zi16KGM5YiX5byPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZGV0ZXJtaW5hbnQgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjsgY29uc3QgYTAzID0gYS5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDQ7IGNvbnN0IGExMSA9IGEubTA1OyBjb25zdCBhMTIgPSBhLm0wNjsgY29uc3QgYTEzID0gYS5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gYS5tMDg7IGNvbnN0IGEyMSA9IGEubTA5OyBjb25zdCBhMjIgPSBhLm0xMDsgY29uc3QgYTIzID0gYS5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gYS5tMTI7IGNvbnN0IGEzMSA9IGEubTEzOyBjb25zdCBhMzIgPSBhLm0xNDsgY29uc3QgYTMzID0gYS5tMTU7XHJcblxyXG4gICAgICAgIGNvbnN0IGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICAgICAgICBjb25zdCBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyO1xyXG4gICAgICAgIGNvbnN0IGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICAgICAgICBjb25zdCBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XHJcbiAgICAgICAgcmV0dXJuIGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXkuZjms5VcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtdWx0aXBseSA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjsgY29uc3QgYTAzID0gYS5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDQ7IGNvbnN0IGExMSA9IGEubTA1OyBjb25zdCBhMTIgPSBhLm0wNjsgY29uc3QgYTEzID0gYS5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gYS5tMDg7IGNvbnN0IGEyMSA9IGEubTA5OyBjb25zdCBhMjIgPSBhLm0xMDsgY29uc3QgYTIzID0gYS5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gYS5tMTI7IGNvbnN0IGEzMSA9IGEubTEzOyBjb25zdCBhMzIgPSBhLm0xNDsgY29uc3QgYTMzID0gYS5tMTU7XHJcblxyXG4gICAgICAgIC8vIENhY2hlIG9ubHkgdGhlIGN1cnJlbnQgbGluZSBvZiB0aGUgc2Vjb25kIG1hdHJpeFxyXG4gICAgICAgIGxldCBiMCA9IGIubTAwLCBiMSA9IGIubTAxLCBiMiA9IGIubTAyLCBiMyA9IGIubTAzO1xyXG4gICAgICAgIG91dC5tMDAgPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMDtcclxuICAgICAgICBvdXQubTAxID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzE7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyO1xyXG4gICAgICAgIG91dC5tMDMgPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzMztcclxuXHJcbiAgICAgICAgYjAgPSBiLm0wNDsgYjEgPSBiLm0wNTsgYjIgPSBiLm0wNjsgYjMgPSBiLm0wNztcclxuICAgICAgICBvdXQubTA0ID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gICAgICAgIG91dC5tMDYgPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcclxuICAgICAgICBvdXQubTA3ID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XHJcblxyXG4gICAgICAgIGIwID0gYi5tMDg7IGIxID0gYi5tMDk7IGIyID0gYi5tMTA7IGIzID0gYi5tMTE7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xyXG4gICAgICAgIG91dC5tMDkgPSBiMCAqIGEwMSArIGIxICogYTExICsgYjIgKiBhMjEgKyBiMyAqIGEzMTtcclxuICAgICAgICBvdXQubTEwID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzI7XHJcbiAgICAgICAgb3V0Lm0xMSA9IGIwICogYTAzICsgYjEgKiBhMTMgKyBiMiAqIGEyMyArIGIzICogYTMzO1xyXG5cclxuICAgICAgICBiMCA9IGIubTEyOyBiMSA9IGIubTEzOyBiMiA9IGIubTE0OyBiMyA9IGIubTE1O1xyXG4gICAgICAgIG91dC5tMTIgPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMDtcclxuICAgICAgICBvdXQubTEzID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzE7XHJcbiAgICAgICAgb3V0Lm0xNCA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyO1xyXG4gICAgICAgIG91dC5tMTUgPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzMztcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeWPmOaNolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybSA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSB2LngsIHkgPSB2LnksIHogPSB2Lno7XHJcbiAgICAgICAgaWYgKGEgPT09IG91dCkge1xyXG4gICAgICAgICAgICBvdXQubTEyID0gYS5tMDAgKiB4ICsgYS5tMDQgKiB5ICsgYS5tMDggKiB6ICsgYS5tMTI7XHJcbiAgICAgICAgICAgIG91dC5tMTMgPSBhLm0wMSAqIHggKyBhLm0wNSAqIHkgKyBhLm0wOSAqIHogKyBhLm0xMztcclxuICAgICAgICAgICAgb3V0Lm0xNCA9IGEubTAyICogeCArIGEubTA2ICogeSArIGEubTEwICogeiArIGEubTE0O1xyXG4gICAgICAgICAgICBvdXQubTE1ID0gYS5tMDMgKiB4ICsgYS5tMDcgKiB5ICsgYS5tMTEgKiB6ICsgYS5tMTU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjsgY29uc3QgYTAzID0gYS5tMDM7XHJcbiAgICAgICAgICAgIGNvbnN0IGExMCA9IGEubTA0OyBjb25zdCBhMTEgPSBhLm0wNTsgY29uc3QgYTEyID0gYS5tMDY7IGNvbnN0IGExMyA9IGEubTA3O1xyXG4gICAgICAgICAgICBjb25zdCBhMjAgPSBhLm0wODsgY29uc3QgYTIxID0gYS5tMDk7IGNvbnN0IGEyMiA9IGEubTEwOyBjb25zdCBhMjMgPSBhLm0xMTtcclxuICAgICAgICAgICAgY29uc3QgYTMwID0gYS5tMTI7IGNvbnN0IGEzMSA9IGEubTEzOyBjb25zdCBhMzIgPSBhLm0xNDsgY29uc3QgYTMzID0gYS5tMTU7XHJcblxyXG4gICAgICAgICAgICBvdXQubTAwID0gYTAwOyBvdXQubTAxID0gYTAxOyBvdXQubTAyID0gYTAyOyBvdXQubTAzID0gYTAzO1xyXG4gICAgICAgICAgICBvdXQubTA0ID0gYTEwOyBvdXQubTA1ID0gYTExOyBvdXQubTA2ID0gYTEyOyBvdXQubTA3ID0gYTEzO1xyXG4gICAgICAgICAgICBvdXQubTA4ID0gYTIwOyBvdXQubTA5ID0gYTIxOyBvdXQubTEwID0gYTIyOyBvdXQubTExID0gYTIzO1xyXG5cclxuICAgICAgICAgICAgb3V0Lm0xMiA9IGEwMCAqIHggKyBhMTAgKiB5ICsgYTIwICogeiArIGEubTEyO1xyXG4gICAgICAgICAgICBvdXQubTEzID0gYTAxICogeCArIGExMSAqIHkgKyBhMjEgKiB6ICsgYS5tMTM7XHJcbiAgICAgICAgICAgIG91dC5tMTQgPSBhMDIgKiB4ICsgYTEyICogeSArIGEyMiAqIHogKyBhLm0xNDtcclxuICAgICAgICAgICAgb3V0Lm0xNSA9IGEwMyAqIHggKyBhMTMgKiB5ICsgYTIzICogeiArIGEubTE1O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOS9jeenu+WPmOaNolxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zbGF0ZSA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignZnVuY3Rpb24gY2hhbmdlZCcpO1xyXG4gICAgICAgIGlmIChhID09PSBvdXQpIHtcclxuICAgICAgICAgICAgb3V0Lm0xMiArPSB2Lng7XHJcbiAgICAgICAgICAgIG91dC5tMTMgKz0gdi55O1xyXG4gICAgICAgICAgICBvdXQubTE0ICs9IHYuejtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQubTAwID0gYS5tMDA7IG91dC5tMDEgPSBhLm0wMTsgb3V0Lm0wMiA9IGEubTAyOyBvdXQubTAzID0gYS5tMDM7XHJcbiAgICAgICAgICAgIG91dC5tMDQgPSBhLm0wNDsgb3V0Lm0wNSA9IGEubTA1OyBvdXQubTA2ID0gYS5tMDY7IG91dC5tMDcgPSBhLm0wNztcclxuICAgICAgICAgICAgb3V0Lm0wOCA9IGEubTA4OyBvdXQubTA5ID0gYS5tMDk7IG91dC5tMTAgPSBhLm0xMDsgb3V0Lm0xMSA9IGEubTExO1xyXG4gICAgICAgICAgICBvdXQubTEyICs9IHYueDtcclxuICAgICAgICAgICAgb3V0Lm0xMyArPSB2Lnk7XHJcbiAgICAgICAgICAgIG91dC5tMTQgKz0gdi56O1xyXG4gICAgICAgICAgICBvdXQubTE1ID0gYS5tMTU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5paw57yp5pS+5Y+Y5o2iXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUgPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gdi54LCB5ID0gdi55LCB6ID0gdi56O1xyXG4gICAgICAgIG91dC5tMDAgPSBhLm0wMCAqIHg7XHJcbiAgICAgICAgb3V0Lm0wMSA9IGEubTAxICogeDtcclxuICAgICAgICBvdXQubTAyID0gYS5tMDIgKiB4O1xyXG4gICAgICAgIG91dC5tMDMgPSBhLm0wMyAqIHg7XHJcbiAgICAgICAgb3V0Lm0wNCA9IGEubTA0ICogeTtcclxuICAgICAgICBvdXQubTA1ID0gYS5tMDUgKiB5O1xyXG4gICAgICAgIG91dC5tMDYgPSBhLm0wNiAqIHk7XHJcbiAgICAgICAgb3V0Lm0wNyA9IGEubTA3ICogeTtcclxuICAgICAgICBvdXQubTA4ID0gYS5tMDggKiB6O1xyXG4gICAgICAgIG91dC5tMDkgPSBhLm0wOSAqIHo7XHJcbiAgICAgICAgb3V0Lm0xMCA9IGEubTEwICogejtcclxuICAgICAgICBvdXQubTExID0gYS5tMTEgKiB6O1xyXG4gICAgICAgIG91dC5tMTIgPSBhLm0xMjtcclxuICAgICAgICBvdXQubTEzID0gYS5tMTM7XHJcbiAgICAgICAgb3V0Lm0xNCA9IGEubTE0O1xyXG4gICAgICAgIG91dC5tMTUgPSBhLm0xNTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpeaWsOaXi+i9rOWPmOaNolxyXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcclxuICAgICAqIEBwYXJhbSBheGlzIOaXi+i9rOi9tFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZSA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpIHtcclxuICAgICAgICBsZXQgeCA9IGF4aXMueCwgeSA9IGF4aXMueSwgeiA9IGF4aXMuejtcclxuXHJcbiAgICAgICAgbGV0IGxlbiA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5ICsgeiAqIHopO1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5hYnMobGVuKSA8IEVQU0lMT04pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZW4gPSAxIC8gbGVuO1xyXG4gICAgICAgIHggKj0gbGVuO1xyXG4gICAgICAgIHkgKj0gbGVuO1xyXG4gICAgICAgIHogKj0gbGVuO1xyXG5cclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcclxuICAgICAgICBjb25zdCBjID0gTWF0aC5jb3MocmFkKTtcclxuICAgICAgICBjb25zdCB0ID0gMSAtIGM7XHJcblxyXG4gICAgICAgIGNvbnN0IGEwMCA9IGEubTAwOyBjb25zdCBhMDEgPSBhLm0wMTsgY29uc3QgYTAyID0gYS5tMDI7IGNvbnN0IGEwMyA9IGEubTAzO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IGEubTA0OyBjb25zdCBhMTEgPSBhLm0wNTsgY29uc3QgYTEyID0gYS5tMDY7IGNvbnN0IGExMyA9IGEubTA3O1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IGEubTA4OyBjb25zdCBhMjEgPSBhLm0wOTsgY29uc3QgYTIyID0gYS5tMTA7IGNvbnN0IGEyMyA9IGEubTExO1xyXG5cclxuICAgICAgICAvLyBDb25zdHJ1Y3QgdGhlIGVsZW1lbnRzIG9mIHRoZSByb3RhdGlvbiBtYXRyaXhcclxuICAgICAgICBjb25zdCBiMDAgPSB4ICogeCAqIHQgKyBjLCBiMDEgPSB5ICogeCAqIHQgKyB6ICogcywgYjAyID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgY29uc3QgYjEwID0geCAqIHkgKiB0IC0geiAqIHMsIGIxMSA9IHkgKiB5ICogdCArIGMsIGIxMiA9IHogKiB5ICogdCArIHggKiBzO1xyXG4gICAgICAgIGNvbnN0IGIyMCA9IHggKiB6ICogdCArIHkgKiBzLCBiMjEgPSB5ICogeiAqIHQgLSB4ICogcywgYjIyID0geiAqIHogKiB0ICsgYztcclxuXHJcbiAgICAgICAgLy8gUGVyZm9ybSByb3RhdGlvbi1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cclxuICAgICAgICBvdXQubTAwID0gYTAwICogYjAwICsgYTEwICogYjAxICsgYTIwICogYjAyO1xyXG4gICAgICAgIG91dC5tMDEgPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDI7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEwMiAqIGIwMCArIGExMiAqIGIwMSArIGEyMiAqIGIwMjtcclxuICAgICAgICBvdXQubTAzID0gYTAzICogYjAwICsgYTEzICogYjAxICsgYTIzICogYjAyO1xyXG4gICAgICAgIG91dC5tMDQgPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTI7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGEwMSAqIGIxMCArIGExMSAqIGIxMSArIGEyMSAqIGIxMjtcclxuICAgICAgICBvdXQubTA2ID0gYTAyICogYjEwICsgYTEyICogYjExICsgYTIyICogYjEyO1xyXG4gICAgICAgIG91dC5tMDcgPSBhMDMgKiBiMTAgKyBhMTMgKiBiMTEgKyBhMjMgKiBiMTI7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEwMCAqIGIyMCArIGExMCAqIGIyMSArIGEyMCAqIGIyMjtcclxuICAgICAgICBvdXQubTA5ID0gYTAxICogYjIwICsgYTExICogYjIxICsgYTIxICogYjIyO1xyXG4gICAgICAgIG91dC5tMTAgPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjI7XHJcbiAgICAgICAgb3V0Lm0xMSA9IGEwMyAqIGIyMCArIGExMyAqIGIyMSArIGEyMyAqIGIyMjtcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcclxuICAgICAgICBpZiAoYSAhPT0gb3V0KSB7XHJcbiAgICAgICAgICAgIG91dC5tMTIgPSBhLm0xMjtcclxuICAgICAgICAgICAgb3V0Lm0xMyA9IGEubTEzO1xyXG4gICAgICAgICAgICBvdXQubTE0ID0gYS5tMTQ7XHJcbiAgICAgICAgICAgIG91dC5tMTUgPSBhLm0xNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFgg6L2055qE5peL6L2s5Y+Y5o2iXHJcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOinkuW6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJvdGF0ZVggPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksXHJcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxyXG4gICAgICAgICAgICBhMTAgPSBhLm0wNCxcclxuICAgICAgICAgICAgYTExID0gYS5tMDUsXHJcbiAgICAgICAgICAgIGExMiA9IGEubTA2LFxyXG4gICAgICAgICAgICBhMTMgPSBhLm0wNyxcclxuICAgICAgICAgICAgYTIwID0gYS5tMDgsXHJcbiAgICAgICAgICAgIGEyMSA9IGEubTA5LFxyXG4gICAgICAgICAgICBhMjIgPSBhLm0xMCxcclxuICAgICAgICAgICAgYTIzID0gYS5tMTE7XHJcblxyXG4gICAgICAgIGlmIChhICE9PSBvdXQpIHsgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgcm93c1xyXG4gICAgICAgICAgICBvdXQubTAwID0gYS5tMDA7XHJcbiAgICAgICAgICAgIG91dC5tMDEgPSBhLm0wMTtcclxuICAgICAgICAgICAgb3V0Lm0wMiA9IGEubTAyO1xyXG4gICAgICAgICAgICBvdXQubTAzID0gYS5tMDM7XHJcbiAgICAgICAgICAgIG91dC5tMTIgPSBhLm0xMjtcclxuICAgICAgICAgICAgb3V0Lm0xMyA9IGEubTEzO1xyXG4gICAgICAgICAgICBvdXQubTE0ID0gYS5tMTQ7XHJcbiAgICAgICAgICAgIG91dC5tMTUgPSBhLm0xNTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cclxuICAgICAgICBvdXQubTA0ID0gYTEwICogYyArIGEyMCAqIHM7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGExMSAqIGMgKyBhMjEgKiBzO1xyXG4gICAgICAgIG91dC5tMDYgPSBhMTIgKiBjICsgYTIyICogcztcclxuICAgICAgICBvdXQubTA3ID0gYTEzICogYyArIGEyMyAqIHM7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEyMCAqIGMgLSBhMTAgKiBzO1xyXG4gICAgICAgIG91dC5tMDkgPSBhMjEgKiBjIC0gYTExICogcztcclxuICAgICAgICBvdXQubTEwID0gYTIyICogYyAtIGExMiAqIHM7XHJcbiAgICAgICAgb3V0Lm0xMSA9IGEyMyAqIGMgLSBhMTMgKiBzO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWcqOe7meWumuefqemYteWPmOaNouWfuuehgOS4iuWKoOWFpee7lSBZIOi9tOeahOaXi+i9rOWPmOaNolxyXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByb3RhdGVZIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxyXG4gICAgICAgICAgICBjID0gTWF0aC5jb3MocmFkKSxcclxuICAgICAgICAgICAgYTAwID0gYS5tMDAsXHJcbiAgICAgICAgICAgIGEwMSA9IGEubTAxLFxyXG4gICAgICAgICAgICBhMDIgPSBhLm0wMixcclxuICAgICAgICAgICAgYTAzID0gYS5tMDMsXHJcbiAgICAgICAgICAgIGEyMCA9IGEubTA4LFxyXG4gICAgICAgICAgICBhMjEgPSBhLm0wOSxcclxuICAgICAgICAgICAgYTIyID0gYS5tMTAsXHJcbiAgICAgICAgICAgIGEyMyA9IGEubTExO1xyXG5cclxuICAgICAgICBpZiAoYSAhPT0gb3V0KSB7IC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIHJvd3NcclxuICAgICAgICAgICAgb3V0Lm0wNCA9IGEubTA0O1xyXG4gICAgICAgICAgICBvdXQubTA1ID0gYS5tMDU7XHJcbiAgICAgICAgICAgIG91dC5tMDYgPSBhLm0wNjtcclxuICAgICAgICAgICAgb3V0Lm0wNyA9IGEubTA3O1xyXG4gICAgICAgICAgICBvdXQubTEyID0gYS5tMTI7XHJcbiAgICAgICAgICAgIG91dC5tMTMgPSBhLm0xMztcclxuICAgICAgICAgICAgb3V0Lm0xNCA9IGEubTE0O1xyXG4gICAgICAgICAgICBvdXQubTE1ID0gYS5tMTU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgb3V0Lm0wMCA9IGEwMCAqIGMgLSBhMjAgKiBzO1xyXG4gICAgICAgIG91dC5tMDEgPSBhMDEgKiBjIC0gYTIxICogcztcclxuICAgICAgICBvdXQubTAyID0gYTAyICogYyAtIGEyMiAqIHM7XHJcbiAgICAgICAgb3V0Lm0wMyA9IGEwMyAqIGMgLSBhMjMgKiBzO1xyXG4gICAgICAgIG91dC5tMDggPSBhMDAgKiBzICsgYTIwICogYztcclxuICAgICAgICBvdXQubTA5ID0gYTAxICogcyArIGEyMSAqIGM7XHJcbiAgICAgICAgb3V0Lm0xMCA9IGEwMiAqIHMgKyBhMjIgKiBjO1xyXG4gICAgICAgIG91dC5tMTEgPSBhMDMgKiBzICsgYTIzICogYztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXnu5UgWiDovbTnmoTml4vovazlj5jmjaJcclxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcm90YXRlWiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSxcclxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXHJcbiAgICAgICAgICAgIGEwMCA9IGEubTAwLFxyXG4gICAgICAgICAgICBhMDEgPSBhLm0wMSxcclxuICAgICAgICAgICAgYTAyID0gYS5tMDIsXHJcbiAgICAgICAgICAgIGEwMyA9IGEubTAzLFxyXG4gICAgICAgICAgICBhMTAgPSBhLm0wNCxcclxuICAgICAgICAgICAgYTExID0gYS5tMDUsXHJcbiAgICAgICAgICAgIGExMiA9IGEubTA2LFxyXG4gICAgICAgICAgICBhMTMgPSBhLm0wNztcclxuXHJcbiAgICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcclxuICAgICAgICBpZiAoYSAhPT0gb3V0KSB7XHJcbiAgICAgICAgICAgIG91dC5tMDggPSBhLm0wODtcclxuICAgICAgICAgICAgb3V0Lm0wOSA9IGEubTA5O1xyXG4gICAgICAgICAgICBvdXQubTEwID0gYS5tMTA7XHJcbiAgICAgICAgICAgIG91dC5tMTEgPSBhLm0xMTtcclxuICAgICAgICAgICAgb3V0Lm0xMiA9IGEubTEyO1xyXG4gICAgICAgICAgICBvdXQubTEzID0gYS5tMTM7XHJcbiAgICAgICAgICAgIG91dC5tMTQgPSBhLm0xNDtcclxuICAgICAgICAgICAgb3V0Lm0xNSA9IGEubTE1O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxyXG4gICAgICAgIG91dC5tMDAgPSBhMDAgKiBjICsgYTEwICogcztcclxuICAgICAgICBvdXQubTAxID0gYTAxICogYyArIGExMSAqIHM7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEwMiAqIGMgKyBhMTIgKiBzO1xyXG4gICAgICAgIG91dC5tMDMgPSBhMDMgKiBjICsgYTEzICogcztcclxuICAgICAgICBvdXQubTA0ID0gYTEwICogYyAtIGEwMCAqIHM7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGExMSAqIGMgLSBhMDEgKiBzO1xyXG4gICAgICAgIG91dC5tMDYgPSBhMTIgKiBjIC0gYTAyICogcztcclxuICAgICAgICBvdXQubTA3ID0gYTEzICogYyAtIGEwMyAqIHM7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5L2N56e755+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVRyYW5zbGF0aW9uIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIG91dC5tMDAgPSAxO1xyXG4gICAgICAgIG91dC5tMDEgPSAwO1xyXG4gICAgICAgIG91dC5tMDIgPSAwO1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSAwO1xyXG4gICAgICAgIG91dC5tMDUgPSAxO1xyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAwO1xyXG4gICAgICAgIG91dC5tMDkgPSAwO1xyXG4gICAgICAgIG91dC5tMTAgPSAxO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSB2Lng7XHJcbiAgICAgICAgb3V0Lm0xMyA9IHYueTtcclxuICAgICAgICBvdXQubTE0ID0gdi56O1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X57yp5pS+55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVNjYWxpbmcgPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB2OiBWZWNMaWtlKSB7XHJcbiAgICAgICAgb3V0Lm0wMCA9IHYueDtcclxuICAgICAgICBvdXQubTAxID0gMDtcclxuICAgICAgICBvdXQubTAyID0gMDtcclxuICAgICAgICBvdXQubTAzID0gMDtcclxuICAgICAgICBvdXQubTA0ID0gMDtcclxuICAgICAgICBvdXQubTA1ID0gdi55O1xyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAwO1xyXG4gICAgICAgIG91dC5tMDkgPSAwO1xyXG4gICAgICAgIG91dC5tMTAgPSB2Lno7XHJcbiAgICAgICAgb3V0Lm0xMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorqHnrpfml4vovaznn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUm90YXRpb24gPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlciwgYXhpczogVmVjTGlrZSkge1xyXG4gICAgICAgIGxldCB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGxlbikgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuXHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCk7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgY29uc3QgdCA9IDEgLSBjO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxyXG4gICAgICAgIG91dC5tMDAgPSB4ICogeCAqIHQgKyBjO1xyXG4gICAgICAgIG91dC5tMDEgPSB5ICogeCAqIHQgKyB6ICogcztcclxuICAgICAgICBvdXQubTAyID0geiAqIHggKiB0IC0geSAqIHM7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IHggKiB5ICogdCAtIHogKiBzO1xyXG4gICAgICAgIG91dC5tMDUgPSB5ICogeSAqIHQgKyBjO1xyXG4gICAgICAgIG91dC5tMDYgPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBvdXQubTA3ID0gMDtcclxuICAgICAgICBvdXQubTA4ID0geCAqIHogKiB0ICsgeSAqIHM7XHJcbiAgICAgICAgb3V0Lm0wOSA9IHkgKiB6ICogdCAtIHggKiBzO1xyXG4gICAgICAgIG91dC5tMTAgPSB6ICogeiAqIHQgKyBjO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSAwO1xyXG4gICAgICAgIG91dC5tMTMgPSAwO1xyXG4gICAgICAgIG91dC5tMTQgPSAwO1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X57uVIFgg6L2055qE5peL6L2s55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVhSb3RhdGlvbiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgb3V0Lm0wMCA9IDE7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGM7XHJcbiAgICAgICAgb3V0Lm0wNiA9IHM7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOSA9IC1zO1xyXG4gICAgICAgIG91dC5tMTAgPSBjO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSAwO1xyXG4gICAgICAgIG91dC5tMTMgPSAwO1xyXG4gICAgICAgIG91dC5tMTQgPSAwO1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X57uVIFkg6L2055qE5peL6L2s55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVlSb3RhdGlvbiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgb3V0Lm0wMCA9IGM7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IC1zO1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSAwO1xyXG4gICAgICAgIG91dC5tMDUgPSAxO1xyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSBzO1xyXG4gICAgICAgIG91dC5tMDkgPSAwO1xyXG4gICAgICAgIG91dC5tMTAgPSBjO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSAwO1xyXG4gICAgICAgIG91dC5tMTMgPSAwO1xyXG4gICAgICAgIG91dC5tMTQgPSAwO1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X57uVIFog6L2055qE5peL6L2s55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVpSb3RhdGlvbiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xyXG5cclxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgb3V0Lm0wMCA9IGM7XHJcbiAgICAgICAgb3V0Lm0wMSA9IHM7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IC1zO1xyXG4gICAgICAgIG91dC5tMDUgPSBjO1xyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAwO1xyXG4gICAgICAgIG91dC5tMDkgPSAwO1xyXG4gICAgICAgIG91dC5tMTAgPSAxO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSAwO1xyXG4gICAgICAgIG91dC5tMTMgPSAwO1xyXG4gICAgICAgIG91dC5tMTQgPSAwO1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5qC55o2u5peL6L2s5ZKM5L2N56e75L+h5oGv6K6h566X55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVJUIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSkge1xyXG4gICAgICAgIGNvbnN0IHggPSBxLngsIHkgPSBxLnksIHogPSBxLnosIHcgPSBxLnc7XHJcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcclxuICAgICAgICBjb25zdCB5MiA9IHkgKyB5O1xyXG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XHJcblxyXG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xyXG4gICAgICAgIGNvbnN0IHh5ID0geCAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHl6ID0geSAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xyXG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xyXG5cclxuICAgICAgICBvdXQubTAwID0gMSAtICh5eSArIHp6KTtcclxuICAgICAgICBvdXQubTAxID0geHkgKyB3ejtcclxuICAgICAgICBvdXQubTAyID0geHogLSB3eTtcclxuICAgICAgICBvdXQubTAzID0gMDtcclxuICAgICAgICBvdXQubTA0ID0geHkgLSB3ejtcclxuICAgICAgICBvdXQubTA1ID0gMSAtICh4eCArIHp6KTtcclxuICAgICAgICBvdXQubTA2ID0geXogKyB3eDtcclxuICAgICAgICBvdXQubTA3ID0gMDtcclxuICAgICAgICBvdXQubTA4ID0geHogKyB3eTtcclxuICAgICAgICBvdXQubTA5ID0geXogLSB3eDtcclxuICAgICAgICBvdXQubTEwID0gMSAtICh4eCArIHl5KTtcclxuICAgICAgICBvdXQubTExID0gMDtcclxuICAgICAgICBvdXQubTEyID0gdi54O1xyXG4gICAgICAgIG91dC5tMTMgPSB2Lnk7XHJcbiAgICAgICAgb3V0Lm0xNCA9IHYuejtcclxuICAgICAgICBvdXQubTE1ID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmj5Dlj5bnn6npmLXnmoTkvY3np7vkv6Hmga8sIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFRyYW5zbGF0aW9uIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIG1hdDogT3V0KSB7XHJcbiAgICAgICAgb3V0LnggPSBtYXQubTEyO1xyXG4gICAgICAgIG91dC55ID0gbWF0Lm0xMztcclxuICAgICAgICBvdXQueiA9IG1hdC5tMTQ7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o+Q5Y+W55+p6Zi155qE57yp5pS+5L+h5oGvLCDpu5jorqTnn6npmLXkuK3nmoTlj5jmjaLku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRTY2FsaW5nIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIG1hdDogT3V0KSB7XHJcbiAgICAgICAgY29uc3QgbTAwID0gbTNfMS5tMDAgPSBtYXQubTAwO1xyXG4gICAgICAgIGNvbnN0IG0wMSA9IG0zXzEubTAxID0gbWF0Lm0wMTtcclxuICAgICAgICBjb25zdCBtMDIgPSBtM18xLm0wMiA9IG1hdC5tMDI7XHJcbiAgICAgICAgY29uc3QgbTA0ID0gbTNfMS5tMDMgPSBtYXQubTA0O1xyXG4gICAgICAgIGNvbnN0IG0wNSA9IG0zXzEubTA0ID0gbWF0Lm0wNTtcclxuICAgICAgICBjb25zdCBtMDYgPSBtM18xLm0wNSA9IG1hdC5tMDY7XHJcbiAgICAgICAgY29uc3QgbTA4ID0gbTNfMS5tMDYgPSBtYXQubTA4O1xyXG4gICAgICAgIGNvbnN0IG0wOSA9IG0zXzEubTA3ID0gbWF0Lm0wOTtcclxuICAgICAgICBjb25zdCBtMTAgPSBtM18xLm0wOCA9IG1hdC5tMTA7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLnNxcnQobTAwICogbTAwICsgbTAxICogbTAxICsgbTAyICogbTAyKTtcclxuICAgICAgICBvdXQueSA9IE1hdGguc3FydChtMDQgKiBtMDQgKyBtMDUgKiBtMDUgKyBtMDYgKiBtMDYpO1xyXG4gICAgICAgIG91dC56ID0gTWF0aC5zcXJ0KG0wOCAqIG0wOCArIG0wOSAqIG0wOSArIG0xMCAqIG0xMCk7XHJcbiAgICAgICAgLy8gYWNjb3VudCBmb3IgcmVmZWN0aW9uc1xyXG4gICAgICAgIGlmIChNYXQzLmRldGVybWluYW50KG0zXzEpIDwgMCkgeyBvdXQueCAqPSAtMTsgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o+Q5Y+W55+p6Zi155qE5peL6L2s5L+h5oGvLCDpu5jorqTovpPlhaXnn6npmLXkuI3lkKvmnInnvKnmlL7kv6Hmga/vvIzlpoLogIPomZHnvKnmlL7lupTkvb/nlKggYHRvUlRTYCDlh73mlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRSb3RhdGlvbiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBRdWF0LCBtYXQ6IE91dCkge1xyXG4gICAgICAgIGNvbnN0IHRyYWNlID0gbWF0Lm0wMCArIG1hdC5tMDUgKyBtYXQubTEwO1xyXG4gICAgICAgIGxldCBTID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkge1xyXG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKSAqIDI7XHJcbiAgICAgICAgICAgIG91dC53ID0gMC4yNSAqIFM7XHJcbiAgICAgICAgICAgIG91dC54ID0gKG1hdC5tMDYgLSBtYXQubTA5KSAvIFM7XHJcbiAgICAgICAgICAgIG91dC55ID0gKG1hdC5tMDggLSBtYXQubTAyKSAvIFM7XHJcbiAgICAgICAgICAgIG91dC56ID0gKG1hdC5tMDEgLSBtYXQubTA0KSAvIFM7XHJcbiAgICAgICAgfSBlbHNlIGlmICgobWF0Lm0wMCA+IG1hdC5tMDUpICYmIChtYXQubTAwID4gbWF0Lm0xMCkpIHtcclxuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtYXQubTAwIC0gbWF0Lm0wNSAtIG1hdC5tMTApICogMjtcclxuICAgICAgICAgICAgb3V0LncgPSAobWF0Lm0wNiAtIG1hdC5tMDkpIC8gUztcclxuICAgICAgICAgICAgb3V0LnggPSAwLjI1ICogUztcclxuICAgICAgICAgICAgb3V0LnkgPSAobWF0Lm0wMSArIG1hdC5tMDQpIC8gUztcclxuICAgICAgICAgICAgb3V0LnogPSAobWF0Lm0wOCArIG1hdC5tMDIpIC8gUztcclxuICAgICAgICB9IGVsc2UgaWYgKG1hdC5tMDUgPiBtYXQubTEwKSB7XHJcbiAgICAgICAgICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgbWF0Lm0wNSAtIG1hdC5tMDAgLSBtYXQubTEwKSAqIDI7XHJcbiAgICAgICAgICAgIG91dC53ID0gKG1hdC5tMDggLSBtYXQubTAyKSAvIFM7XHJcbiAgICAgICAgICAgIG91dC54ID0gKG1hdC5tMDEgKyBtYXQubTA0KSAvIFM7XHJcbiAgICAgICAgICAgIG91dC55ID0gMC4yNSAqIFM7XHJcbiAgICAgICAgICAgIG91dC56ID0gKG1hdC5tMDYgKyBtYXQubTA5KSAvIFM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyBtYXQubTEwIC0gbWF0Lm0wMCAtIG1hdC5tMDUpICogMjtcclxuICAgICAgICAgICAgb3V0LncgPSAobWF0Lm0wMSAtIG1hdC5tMDQpIC8gUztcclxuICAgICAgICAgICAgb3V0LnggPSAobWF0Lm0wOCArIG1hdC5tMDIpIC8gUztcclxuICAgICAgICAgICAgb3V0LnkgPSAobWF0Lm0wNiArIG1hdC5tMDkpIC8gUztcclxuICAgICAgICAgICAgb3V0LnogPSAwLjI1ICogUztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o+Q5Y+W5peL6L2s44CB5L2N56e744CB57yp5pS+5L+h5oGv77yMIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvUlRTIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChtOiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpIHtcclxuICAgICAgICBzLnggPSBWZWMzLnNldCh2M18xLCBtLm0wMCwgbS5tMDEsIG0ubTAyKS5sZW5ndGgoKTtcclxuICAgICAgICBtM18xLm0wMCA9IG0ubTAwIC8gcy54O1xyXG4gICAgICAgIG0zXzEubTAxID0gbS5tMDEgLyBzLng7XHJcbiAgICAgICAgbTNfMS5tMDIgPSBtLm0wMiAvIHMueDtcclxuICAgICAgICBzLnkgPSBWZWMzLnNldCh2M18xLCBtLm0wNCwgbS5tMDUsIG0ubTA2KS5sZW5ndGgoKTtcclxuICAgICAgICBtM18xLm0wMyA9IG0ubTA0IC8gcy55O1xyXG4gICAgICAgIG0zXzEubTA0ID0gbS5tMDUgLyBzLnk7XHJcbiAgICAgICAgbTNfMS5tMDUgPSBtLm0wNiAvIHMueTtcclxuICAgICAgICBzLnogPSBWZWMzLnNldCh2M18xLCBtLm0wOCwgbS5tMDksIG0ubTEwKS5sZW5ndGgoKTtcclxuICAgICAgICBtM18xLm0wNiA9IG0ubTA4IC8gcy56O1xyXG4gICAgICAgIG0zXzEubTA3ID0gbS5tMDkgLyBzLno7XHJcbiAgICAgICAgbTNfMS5tMDggPSBtLm0xMCAvIHMuejtcclxuICAgICAgICBjb25zdCBkZXQgPSBNYXQzLmRldGVybWluYW50KG0zXzEpO1xyXG4gICAgICAgIGlmIChkZXQgPCAwKSB7IHMueCAqPSAtMTsgbTNfMS5tMDAgKj0gLTE7IG0zXzEubTAxICo9IC0xOyBtM18xLm0wMiAqPSAtMTsgfVxyXG4gICAgICAgIFF1YXQuZnJvbU1hdDMocSwgbTNfMSk7IC8vIGFscmVhZHkgbm9ybWFsaXplZFxyXG4gICAgICAgIFZlYzMuc2V0KHYsIG0ubTEyLCBtLm0xMywgbS5tMTQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuS/oeaBr+iuoeeul+efqemYte+8jOS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21SVFMgPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlLCBzOiBWZWNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcclxuICAgICAgICBjb25zdCB4MiA9IHggKyB4O1xyXG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XHJcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcclxuXHJcbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XHJcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XHJcbiAgICAgICAgY29uc3QgeHogPSB4ICogejI7XHJcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XHJcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XHJcbiAgICAgICAgY29uc3QgenogPSB6ICogejI7XHJcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XHJcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XHJcbiAgICAgICAgY29uc3Qgd3ogPSB3ICogejI7XHJcbiAgICAgICAgY29uc3Qgc3ggPSBzLng7XHJcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XHJcbiAgICAgICAgY29uc3Qgc3ogPSBzLno7XHJcblxyXG4gICAgICAgIG91dC5tMDAgPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcclxuICAgICAgICBvdXQubTAxID0gKHh5ICsgd3opICogc3g7XHJcbiAgICAgICAgb3V0Lm0wMiA9ICh4eiAtIHd5KSAqIHN4O1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSAoeHkgLSB3eikgKiBzeTtcclxuICAgICAgICBvdXQubTA1ID0gKDEgLSAoeHggKyB6eikpICogc3k7XHJcbiAgICAgICAgb3V0Lm0wNiA9ICh5eiArIHd4KSAqIHN5O1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAoeHogKyB3eSkgKiBzejtcclxuICAgICAgICBvdXQubTA5ID0gKHl6IC0gd3gpICogc3o7XHJcbiAgICAgICAgb3V0Lm0xMCA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSB2Lng7XHJcbiAgICAgICAgb3V0Lm0xMyA9IHYueTtcclxuICAgICAgICBvdXQubTE0ID0gdi56O1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNruaMh+WumueahOaXi+i9rOOAgeS9jeenu+OAgee8qeaUvuWPiuWPmOaNouS4reW/g+S/oeaBr+iuoeeul+efqemYte+8jOS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxyXG4gICAgICogQHBhcmFtIHEg5peL6L2s5YC8XHJcbiAgICAgKiBAcGFyYW0gdiDkvY3np7vlgLxcclxuICAgICAqIEBwYXJhbSBzIOe8qeaUvuWAvFxyXG4gICAgICogQHBhcmFtIG8g5oyH5a6a5Y+Y5o2i5Lit5b+DXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVJUU09yaWdpbiA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UsIG86IFZlY0xpa2UpIHtcclxuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xyXG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XHJcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcclxuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xyXG5cclxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcclxuICAgICAgICBjb25zdCB4eSA9IHggKiB5MjtcclxuICAgICAgICBjb25zdCB4eiA9IHggKiB6MjtcclxuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcclxuICAgICAgICBjb25zdCB5eiA9IHkgKiB6MjtcclxuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcclxuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcclxuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcclxuXHJcbiAgICAgICAgY29uc3Qgc3ggPSBzLng7XHJcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XHJcbiAgICAgICAgY29uc3Qgc3ogPSBzLno7XHJcblxyXG4gICAgICAgIGNvbnN0IG94ID0gby54O1xyXG4gICAgICAgIGNvbnN0IG95ID0gby55O1xyXG4gICAgICAgIGNvbnN0IG96ID0gby56O1xyXG5cclxuICAgICAgICBvdXQubTAwID0gKDEgLSAoeXkgKyB6eikpICogc3g7XHJcbiAgICAgICAgb3V0Lm0wMSA9ICh4eSArIHd6KSAqIHN4O1xyXG4gICAgICAgIG91dC5tMDIgPSAoeHogLSB3eSkgKiBzeDtcclxuICAgICAgICBvdXQubTAzID0gMDtcclxuICAgICAgICBvdXQubTA0ID0gKHh5IC0gd3opICogc3k7XHJcbiAgICAgICAgb3V0Lm0wNSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xyXG4gICAgICAgIG91dC5tMDYgPSAoeXogKyB3eCkgKiBzeTtcclxuICAgICAgICBvdXQubTA3ID0gMDtcclxuICAgICAgICBvdXQubTA4ID0gKHh6ICsgd3kpICogc3o7XHJcbiAgICAgICAgb3V0Lm0wOSA9ICh5eiAtIHd4KSAqIHN6O1xyXG4gICAgICAgIG91dC5tMTAgPSAoMSAtICh4eCArIHl5KSkgKiBzejtcclxuICAgICAgICBvdXQubTExID0gMDtcclxuICAgICAgICBvdXQubTEyID0gdi54ICsgb3ggLSAob3V0Lm0wMCAqIG94ICsgb3V0Lm0wNCAqIG95ICsgb3V0Lm0wOCAqIG96KTtcclxuICAgICAgICBvdXQubTEzID0gdi55ICsgb3kgLSAob3V0Lm0wMSAqIG94ICsgb3V0Lm0wNSAqIG95ICsgb3V0Lm0wOSAqIG96KTtcclxuICAgICAgICBvdXQubTE0ID0gdi56ICsgb3ogLSAob3V0Lm0wMiAqIG94ICsgb3V0Lm0wNiAqIG95ICsgb3V0Lm0xMCAqIG96KTtcclxuICAgICAgICBvdXQubTE1ID0gMTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7mjIflrprnmoTml4vovazkv6Hmga/orqHnrpfnn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUXVhdCA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xyXG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XHJcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcclxuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xyXG5cclxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcclxuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcclxuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcclxuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcclxuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcclxuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcclxuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcclxuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IDEgLSB5eSAtIHp6O1xyXG4gICAgICAgIG91dC5tMDEgPSB5eCArIHd6O1xyXG4gICAgICAgIG91dC5tMDIgPSB6eCAtIHd5O1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG5cclxuICAgICAgICBvdXQubTA0ID0geXggLSB3ejtcclxuICAgICAgICBvdXQubTA1ID0gMSAtIHh4IC0geno7XHJcbiAgICAgICAgb3V0Lm0wNiA9IHp5ICsgd3g7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcblxyXG4gICAgICAgIG91dC5tMDggPSB6eCArIHd5O1xyXG4gICAgICAgIG91dC5tMDkgPSB6eSAtIHd4O1xyXG4gICAgICAgIG91dC5tMTAgPSAxIC0geHggLSB5eTtcclxuICAgICAgICBvdXQubTExID0gMDtcclxuXHJcbiAgICAgICAgb3V0Lm0xMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5qC55o2u5oyH5a6a55qE6KeG6ZSl5L2T5L+h5oGv6K6h566X55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gbGVmdCDlt6blubPpnaLot53nprtcclxuICAgICAqIEBwYXJhbSByaWdodCDlj7PlubPpnaLot53nprtcclxuICAgICAqIEBwYXJhbSBib3R0b20g5LiL5bmz6Z2i6Led56a7XHJcbiAgICAgKiBAcGFyYW0gdG9wIOS4iuW5s+mdoui3neemu1xyXG4gICAgICogQHBhcmFtIG5lYXIg6L+R5bmz6Z2i6Led56a7XHJcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZydXN0dW0gPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHJsID0gMSAvIChyaWdodCAtIGxlZnQpO1xyXG4gICAgICAgIGNvbnN0IHRiID0gMSAvICh0b3AgLSBib3R0b20pO1xyXG4gICAgICAgIGNvbnN0IG5mID0gMSAvIChuZWFyIC0gZmFyKTtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IChuZWFyICogMikgKiBybDtcclxuICAgICAgICBvdXQubTAxID0gMDtcclxuICAgICAgICBvdXQubTAyID0gMDtcclxuICAgICAgICBvdXQubTAzID0gMDtcclxuICAgICAgICBvdXQubTA0ID0gMDtcclxuICAgICAgICBvdXQubTA1ID0gKG5lYXIgKiAyKSAqIHRiO1xyXG4gICAgICAgIG91dC5tMDYgPSAwO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSAocmlnaHQgKyBsZWZ0KSAqIHJsO1xyXG4gICAgICAgIG91dC5tMDkgPSAodG9wICsgYm90dG9tKSAqIHRiO1xyXG4gICAgICAgIG91dC5tMTAgPSAoZmFyICsgbmVhcikgKiBuZjtcclxuICAgICAgICBvdXQubTExID0gLTE7XHJcbiAgICAgICAgb3V0Lm0xMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNCA9IChmYXIgKiBuZWFyICogMikgKiBuZjtcclxuICAgICAgICBvdXQubTE1ID0gMDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+mAj+inhuaKleW9seefqemYtVxyXG4gICAgICogQHBhcmFtIGZvdnkg57q15ZCR6KeG6KeS6auY5bqmXHJcbiAgICAgKiBAcGFyYW0gYXNwZWN0IOmVv+WuveavlFxyXG4gICAgICogQHBhcmFtIG5lYXIg6L+R5bmz6Z2i6Led56a7XHJcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHBlcnNwZWN0aXZlIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChcclxuICAgICAgICAgICAgb3V0OiBPdXQsIGZvdjogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcixcclxuICAgICAgICAgICAgaXNGT1ZZID0gdHJ1ZSwgbWluQ2xpcFogPSAtMSwgcHJvamVjdGlvblNpZ25ZID0gMSkge1xyXG5cclxuICAgICAgICBjb25zdCBmID0gMS4wIC8gTWF0aC50YW4oZm92IC8gMik7XHJcbiAgICAgICAgY29uc3QgbmYgPSAxIC8gKG5lYXIgLSBmYXIpO1xyXG5cclxuICAgICAgICBvdXQubTAwID0gaXNGT1ZZID8gZiAvIGFzcGVjdCA6IGY7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNSA9IChpc0ZPVlkgPyBmIDogZiAqIGFzcGVjdCkgKiBwcm9qZWN0aW9uU2lnblk7XHJcbiAgICAgICAgb3V0Lm0wNiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMCA9IChmYXIgLSBtaW5DbGlwWiAqIG5lYXIpICogbmY7XHJcbiAgICAgICAgb3V0Lm0xMSA9IC0xO1xyXG4gICAgICAgIG91dC5tMTIgPSAwO1xyXG4gICAgICAgIG91dC5tMTMgPSAwO1xyXG4gICAgICAgIG91dC5tMTQgPSBmYXIgKiBuZWFyICogbmYgKiAoMSAtIG1pbkNsaXBaKTtcclxuICAgICAgICBvdXQubTE1ID0gMDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+ato+S6pOaKleW9seefqemYtVxyXG4gICAgICogQHBhcmFtIGxlZnQg5bem5bmz6Z2i6Led56a7XHJcbiAgICAgKiBAcGFyYW0gcmlnaHQg5Y+z5bmz6Z2i6Led56a7XHJcbiAgICAgKiBAcGFyYW0gYm90dG9tIOS4i+W5s+mdoui3neemu1xyXG4gICAgICogQHBhcmFtIHRvcCDkuIrlubPpnaLot53nprtcclxuICAgICAqIEBwYXJhbSBuZWFyIOi/keW5s+mdoui3neemu1xyXG4gICAgICogQHBhcmFtIGZhciDov5zlubPpnaLot53nprtcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBvcnRobyA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoXHJcbiAgICAgICAgICAgIG91dDogT3V0LCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcixcclxuICAgICAgICAgICAgbWluQ2xpcFogPSAtMSwgcHJvamVjdGlvblNpZ25ZID0gMSkge1xyXG5cclxuICAgICAgICBjb25zdCBsciA9IDEgLyAobGVmdCAtIHJpZ2h0KTtcclxuICAgICAgICBjb25zdCBidCA9IDEgLyAoYm90dG9tIC0gdG9wKTtcclxuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XHJcbiAgICAgICAgb3V0Lm0wMCA9IC0yICogbHI7XHJcbiAgICAgICAgb3V0Lm0wMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNSA9IC0yICogYnQgKiBwcm9qZWN0aW9uU2lnblk7XHJcbiAgICAgICAgb3V0Lm0wNiA9IDA7XHJcbiAgICAgICAgb3V0Lm0wNyA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOCA9IDA7XHJcbiAgICAgICAgb3V0Lm0wOSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMCA9IG5mICogKDEgLSBtaW5DbGlwWik7XHJcbiAgICAgICAgb3V0Lm0xMSA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMiA9IChsZWZ0ICsgcmlnaHQpICogbHI7XHJcbiAgICAgICAgb3V0Lm0xMyA9ICh0b3AgKyBib3R0b20pICogYnQ7XHJcbiAgICAgICAgb3V0Lm0xNCA9IChuZWFyIC0gbWluQ2xpcFogKiBmYXIpICogbmY7XHJcbiAgICAgICAgb3V0Lm0xNSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmoLnmja7op4bngrnorqHnrpfnn6npmLXvvIzms6jmhI8gYGV5ZSAtIGNlbnRlcmAg5LiN6IO95Li66Zu25ZCR6YeP5oiW5LiOIGB1cGAg5ZCR6YeP5bmz6KGMXHJcbiAgICAgKiBAcGFyYW0gZXllIOW9k+WJjeS9jee9rlxyXG4gICAgICogQHBhcmFtIGNlbnRlciDnm67moIfop4bngrlcclxuICAgICAqIEBwYXJhbSB1cCDop4blj6PkuIrmlrnlkJFcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsb29rQXQgPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBleWU6IFZlY0xpa2UsIGNlbnRlcjogVmVjTGlrZSwgdXA6IFZlY0xpa2UpIHtcclxuICAgICAgICBjb25zdCBleWV4ID0gZXllLng7XHJcbiAgICAgICAgY29uc3QgZXlleSA9IGV5ZS55O1xyXG4gICAgICAgIGNvbnN0IGV5ZXogPSBleWUuejtcclxuICAgICAgICBjb25zdCB1cHggPSB1cC54O1xyXG4gICAgICAgIGNvbnN0IHVweSA9IHVwLnk7XHJcbiAgICAgICAgY29uc3QgdXB6ID0gdXAuejtcclxuICAgICAgICBjb25zdCBjZW50ZXJ4ID0gY2VudGVyLng7XHJcbiAgICAgICAgY29uc3QgY2VudGVyeSA9IGNlbnRlci55O1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcnogPSBjZW50ZXIuejtcclxuXHJcbiAgICAgICAgbGV0IHowID0gZXlleCAtIGNlbnRlcng7XHJcbiAgICAgICAgbGV0IHoxID0gZXlleSAtIGNlbnRlcnk7XHJcbiAgICAgICAgbGV0IHoyID0gZXlleiAtIGNlbnRlcno7XHJcblxyXG4gICAgICAgIGxldCBsZW4gPSAxIC8gTWF0aC5zcXJ0KHowICogejAgKyB6MSAqIHoxICsgejIgKiB6Mik7XHJcbiAgICAgICAgejAgKj0gbGVuO1xyXG4gICAgICAgIHoxICo9IGxlbjtcclxuICAgICAgICB6MiAqPSBsZW47XHJcblxyXG4gICAgICAgIGxldCB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XHJcbiAgICAgICAgbGV0IHgxID0gdXB6ICogejAgLSB1cHggKiB6MjtcclxuICAgICAgICBsZXQgeDIgPSB1cHggKiB6MSAtIHVweSAqIHowO1xyXG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcclxuICAgICAgICB4MCAqPSBsZW47XHJcbiAgICAgICAgeDEgKj0gbGVuO1xyXG4gICAgICAgIHgyICo9IGxlbjtcclxuXHJcbiAgICAgICAgY29uc3QgeTAgPSB6MSAqIHgyIC0gejIgKiB4MTtcclxuICAgICAgICBjb25zdCB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xyXG4gICAgICAgIGNvbnN0IHkyID0gejAgKiB4MSAtIHoxICogeDA7XHJcblxyXG4gICAgICAgIG91dC5tMDAgPSB4MDtcclxuICAgICAgICBvdXQubTAxID0geTA7XHJcbiAgICAgICAgb3V0Lm0wMiA9IHowO1xyXG4gICAgICAgIG91dC5tMDMgPSAwO1xyXG4gICAgICAgIG91dC5tMDQgPSB4MTtcclxuICAgICAgICBvdXQubTA1ID0geTE7XHJcbiAgICAgICAgb3V0Lm0wNiA9IHoxO1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG4gICAgICAgIG91dC5tMDggPSB4MjtcclxuICAgICAgICBvdXQubTA5ID0geTI7XHJcbiAgICAgICAgb3V0Lm0xMCA9IHoyO1xyXG4gICAgICAgIG91dC5tMTEgPSAwO1xyXG4gICAgICAgIG91dC5tMTIgPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XHJcbiAgICAgICAgb3V0Lm0xMyA9IC0oeTAgKiBleWV4ICsgeTEgKiBleWV5ICsgeTIgKiBleWV6KTtcclxuICAgICAgICBvdXQubTE0ID0gLSh6MCAqIGV5ZXggKyB6MSAqIGV5ZXkgKyB6MiAqIGV5ZXopO1xyXG4gICAgICAgIG91dC5tMTUgPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+mAhui9rOe9ruefqemYtVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGludmVyc2VUcmFuc3Bvc2UgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYTAwID0gYS5tMDA7IGNvbnN0IGEwMSA9IGEubTAxOyBjb25zdCBhMDIgPSBhLm0wMjsgY29uc3QgYTAzID0gYS5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gYS5tMDQ7IGNvbnN0IGExMSA9IGEubTA1OyBjb25zdCBhMTIgPSBhLm0wNjsgY29uc3QgYTEzID0gYS5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gYS5tMDg7IGNvbnN0IGEyMSA9IGEubTA5OyBjb25zdCBhMjIgPSBhLm0xMDsgY29uc3QgYTIzID0gYS5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gYS5tMTI7IGNvbnN0IGEzMSA9IGEubTEzOyBjb25zdCBhMzIgPSBhLm0xNDsgY29uc3QgYTMzID0gYS5tMTU7XHJcblxyXG4gICAgICAgIGNvbnN0IGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICAgICAgICBjb25zdCBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyO1xyXG4gICAgICAgIGNvbnN0IGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICAgICAgICBjb25zdCBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XHJcbiAgICAgICAgbGV0IGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcclxuXHJcbiAgICAgICAgaWYgKCFkZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcclxuXHJcbiAgICAgICAgb3V0Lm0wMCA9IChhMTEgKiBiMTEgLSBhMTIgKiBiMTAgKyBhMTMgKiBiMDkpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDEgPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcclxuICAgICAgICBvdXQubTAyID0gKGExMCAqIGIxMCAtIGExMSAqIGIwOCArIGExMyAqIGIwNikgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wMyA9IDA7XHJcblxyXG4gICAgICAgIG91dC5tMDQgPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcclxuICAgICAgICBvdXQubTA1ID0gKGEwMCAqIGIxMSAtIGEwMiAqIGIwOCArIGEwMyAqIGIwNykgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wNiA9IChhMDEgKiBiMDggLSBhMDAgKiBiMTAgLSBhMDMgKiBiMDYpICogZGV0O1xyXG4gICAgICAgIG91dC5tMDcgPSAwO1xyXG5cclxuICAgICAgICBvdXQubTA4ID0gKGEzMSAqIGIwNSAtIGEzMiAqIGIwNCArIGEzMyAqIGIwMykgKiBkZXQ7XHJcbiAgICAgICAgb3V0Lm0wOSA9IChhMzIgKiBiMDIgLSBhMzAgKiBiMDUgLSBhMzMgKiBiMDEpICogZGV0O1xyXG4gICAgICAgIG91dC5tMTAgPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcclxuICAgICAgICBvdXQubTExID0gMDtcclxuXHJcbiAgICAgICAgb3V0Lm0xMiA9IDA7XHJcbiAgICAgICAgb3V0Lm0xMyA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNCA9IDA7XHJcbiAgICAgICAgb3V0Lm0xNSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg55+p6Zi16L2s5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOWGheeahOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIG06IElNYXQ0TGlrZSwgb2ZzID0gMCkge1xyXG4gICAgICAgIG91dFtvZnMgKyAwXSA9IG0ubTAwO1xyXG4gICAgICAgIG91dFtvZnMgKyAxXSA9IG0ubTAxO1xyXG4gICAgICAgIG91dFtvZnMgKyAyXSA9IG0ubTAyO1xyXG4gICAgICAgIG91dFtvZnMgKyAzXSA9IG0ubTAzO1xyXG4gICAgICAgIG91dFtvZnMgKyA0XSA9IG0ubTA0O1xyXG4gICAgICAgIG91dFtvZnMgKyA1XSA9IG0ubTA1O1xyXG4gICAgICAgIG91dFtvZnMgKyA2XSA9IG0ubTA2O1xyXG4gICAgICAgIG91dFtvZnMgKyA3XSA9IG0ubTA3O1xyXG4gICAgICAgIG91dFtvZnMgKyA4XSA9IG0ubTA4O1xyXG4gICAgICAgIG91dFtvZnMgKyA5XSA9IG0ubTA5O1xyXG4gICAgICAgIG91dFtvZnMgKyAxMF0gPSBtLm0xMDtcclxuICAgICAgICBvdXRbb2ZzICsgMTFdID0gbS5tMTE7XHJcbiAgICAgICAgb3V0W29mcyArIDEyXSA9IG0ubTEyO1xyXG4gICAgICAgIG91dFtvZnMgKyAxM10gPSBtLm0xMztcclxuICAgICAgICBvdXRbb2ZzICsgMTRdID0gbS5tMTQ7XHJcbiAgICAgICAgb3V0W29mcyArIDE1XSA9IG0ubTE1O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pWw57uE6L2s55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21BcnJheSA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcclxuICAgICAgICBvdXQubTAwID0gYXJyW29mcyArIDBdO1xyXG4gICAgICAgIG91dC5tMDEgPSBhcnJbb2ZzICsgMV07XHJcbiAgICAgICAgb3V0Lm0wMiA9IGFycltvZnMgKyAyXTtcclxuICAgICAgICBvdXQubTAzID0gYXJyW29mcyArIDNdO1xyXG4gICAgICAgIG91dC5tMDQgPSBhcnJbb2ZzICsgNF07XHJcbiAgICAgICAgb3V0Lm0wNSA9IGFycltvZnMgKyA1XTtcclxuICAgICAgICBvdXQubTA2ID0gYXJyW29mcyArIDZdO1xyXG4gICAgICAgIG91dC5tMDcgPSBhcnJbb2ZzICsgN107XHJcbiAgICAgICAgb3V0Lm0wOCA9IGFycltvZnMgKyA4XTtcclxuICAgICAgICBvdXQubTA5ID0gYXJyW29mcyArIDldO1xyXG4gICAgICAgIG91dC5tMTAgPSBhcnJbb2ZzICsgMTBdO1xyXG4gICAgICAgIG91dC5tMTEgPSBhcnJbb2ZzICsgMTFdO1xyXG4gICAgICAgIG91dC5tMTIgPSBhcnJbb2ZzICsgMTJdO1xyXG4gICAgICAgIG91dC5tMTMgPSBhcnJbb2ZzICsgMTNdO1xyXG4gICAgICAgIG91dC5tMTQgPSBhcnJbb2ZzICsgMTRdO1xyXG4gICAgICAgIG91dC5tMTUgPSBhcnJbb2ZzICsgMTVdO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg55+p6Zi15Yqg5rOVXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgYWRkIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQubTAwID0gYS5tMDAgKyBiLm0wMDtcclxuICAgICAgICBvdXQubTAxID0gYS5tMDEgKyBiLm0wMTtcclxuICAgICAgICBvdXQubTAyID0gYS5tMDIgKyBiLm0wMjtcclxuICAgICAgICBvdXQubTAzID0gYS5tMDMgKyBiLm0wMztcclxuICAgICAgICBvdXQubTA0ID0gYS5tMDQgKyBiLm0wNDtcclxuICAgICAgICBvdXQubTA1ID0gYS5tMDUgKyBiLm0wNTtcclxuICAgICAgICBvdXQubTA2ID0gYS5tMDYgKyBiLm0wNjtcclxuICAgICAgICBvdXQubTA3ID0gYS5tMDcgKyBiLm0wNztcclxuICAgICAgICBvdXQubTA4ID0gYS5tMDggKyBiLm0wODtcclxuICAgICAgICBvdXQubTA5ID0gYS5tMDkgKyBiLm0wOTtcclxuICAgICAgICBvdXQubTEwID0gYS5tMTAgKyBiLm0xMDtcclxuICAgICAgICBvdXQubTExID0gYS5tMTEgKyBiLm0xMTtcclxuICAgICAgICBvdXQubTEyID0gYS5tMTIgKyBiLm0xMjtcclxuICAgICAgICBvdXQubTEzID0gYS5tMTMgKyBiLm0xMztcclxuICAgICAgICBvdXQubTE0ID0gYS5tMTQgKyBiLm0xNDtcclxuICAgICAgICBvdXQubTE1ID0gYS5tMTUgKyBiLm0xNTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAkOWFg+e0oOefqemYteWHj+azlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN1YnRyYWN0IDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICBvdXQubTAwID0gYS5tMDAgLSBiLm0wMDtcclxuICAgICAgICBvdXQubTAxID0gYS5tMDEgLSBiLm0wMTtcclxuICAgICAgICBvdXQubTAyID0gYS5tMDIgLSBiLm0wMjtcclxuICAgICAgICBvdXQubTAzID0gYS5tMDMgLSBiLm0wMztcclxuICAgICAgICBvdXQubTA0ID0gYS5tMDQgLSBiLm0wNDtcclxuICAgICAgICBvdXQubTA1ID0gYS5tMDUgLSBiLm0wNTtcclxuICAgICAgICBvdXQubTA2ID0gYS5tMDYgLSBiLm0wNjtcclxuICAgICAgICBvdXQubTA3ID0gYS5tMDcgLSBiLm0wNztcclxuICAgICAgICBvdXQubTA4ID0gYS5tMDggLSBiLm0wODtcclxuICAgICAgICBvdXQubTA5ID0gYS5tMDkgLSBiLm0wOTtcclxuICAgICAgICBvdXQubTEwID0gYS5tMTAgLSBiLm0xMDtcclxuICAgICAgICBvdXQubTExID0gYS5tMTEgLSBiLm0xMTtcclxuICAgICAgICBvdXQubTEyID0gYS5tMTIgLSBiLm0xMjtcclxuICAgICAgICBvdXQubTEzID0gYS5tMTMgLSBiLm0xMztcclxuICAgICAgICBvdXQubTE0ID0gYS5tMTQgLSBiLm0xNDtcclxuICAgICAgICBvdXQubTE1ID0gYS5tMTUgLSBiLm0xNTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOefqemYteagh+mHj+S5mOazlVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQubTAwID0gYS5tMDAgKiBiO1xyXG4gICAgICAgIG91dC5tMDEgPSBhLm0wMSAqIGI7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEubTAyICogYjtcclxuICAgICAgICBvdXQubTAzID0gYS5tMDMgKiBiO1xyXG4gICAgICAgIG91dC5tMDQgPSBhLm0wNCAqIGI7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGEubTA1ICogYjtcclxuICAgICAgICBvdXQubTA2ID0gYS5tMDYgKiBiO1xyXG4gICAgICAgIG91dC5tMDcgPSBhLm0wNyAqIGI7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEubTA4ICogYjtcclxuICAgICAgICBvdXQubTA5ID0gYS5tMDkgKiBiO1xyXG4gICAgICAgIG91dC5tMTAgPSBhLm0xMCAqIGI7XHJcbiAgICAgICAgb3V0Lm0xMSA9IGEubTExICogYjtcclxuICAgICAgICBvdXQubTEyID0gYS5tMTIgKiBiO1xyXG4gICAgICAgIG91dC5tMTMgPSBhLm0xMyAqIGI7XHJcbiAgICAgICAgb3V0Lm0xNCA9IGEubTE0ICogYjtcclxuICAgICAgICBvdXQubTE1ID0gYS5tMTUgKiBiO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCQ5YWD57Sg55+p6Zi15qCH6YeP5LmY5YqgOiBBICsgQiAqIHNjYWxlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHlTY2FsYXJBbmRBZGQgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcikge1xyXG4gICAgICAgIG91dC5tMDAgPSBhLm0wMCArIChiLm0wMCAqIHNjYWxlKTtcclxuICAgICAgICBvdXQubTAxID0gYS5tMDEgKyAoYi5tMDEgKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0Lm0wMiA9IGEubTAyICsgKGIubTAyICogc2NhbGUpO1xyXG4gICAgICAgIG91dC5tMDMgPSBhLm0wMyArIChiLm0wMyAqIHNjYWxlKTtcclxuICAgICAgICBvdXQubTA0ID0gYS5tMDQgKyAoYi5tMDQgKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0Lm0wNSA9IGEubTA1ICsgKGIubTA1ICogc2NhbGUpO1xyXG4gICAgICAgIG91dC5tMDYgPSBhLm0wNiArIChiLm0wNiAqIHNjYWxlKTtcclxuICAgICAgICBvdXQubTA3ID0gYS5tMDcgKyAoYi5tMDcgKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0Lm0wOCA9IGEubTA4ICsgKGIubTA4ICogc2NhbGUpO1xyXG4gICAgICAgIG91dC5tMDkgPSBhLm0wOSArIChiLm0wOSAqIHNjYWxlKTtcclxuICAgICAgICBvdXQubTEwID0gYS5tMTAgKyAoYi5tMTAgKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0Lm0xMSA9IGEubTExICsgKGIubTExICogc2NhbGUpO1xyXG4gICAgICAgIG91dC5tMTIgPSBhLm0xMiArIChiLm0xMiAqIHNjYWxlKTtcclxuICAgICAgICBvdXQubTEzID0gYS5tMTMgKyAoYi5tMTMgKiBzY2FsZSk7XHJcbiAgICAgICAgb3V0Lm0xNCA9IGEubTE0ICsgKGIubTE0ICogc2NhbGUpO1xyXG4gICAgICAgIG91dC5tMTUgPSBhLm0xNSArIChiLm0xNSAqIHNjYWxlKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOefqemYteetieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcclxuICAgICAgICByZXR1cm4gYS5tMDAgPT09IGIubTAwICYmIGEubTAxID09PSBiLm0wMSAmJiBhLm0wMiA9PT0gYi5tMDIgJiYgYS5tMDMgPT09IGIubTAzICYmXHJcbiAgICAgICAgICAgIGEubTA0ID09PSBiLm0wNCAmJiBhLm0wNSA9PT0gYi5tMDUgJiYgYS5tMDYgPT09IGIubTA2ICYmIGEubTA3ID09PSBiLm0wNyAmJlxyXG4gICAgICAgICAgICBhLm0wOCA9PT0gYi5tMDggJiYgYS5tMDkgPT09IGIubTA5ICYmIGEubTEwID09PSBiLm0xMCAmJiBhLm0xMSA9PT0gYi5tMTEgJiZcclxuICAgICAgICAgICAgYS5tMTIgPT09IGIubTEyICYmIGEubTEzID09PSBiLm0xMyAmJiBhLm0xNCA9PT0gYi5tMTQgJiYgYS5tMTUgPT09IGIubTE1O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaOkumZpOa1rueCueaVsOivr+W3rueahOefqemYtei/keS8vOetieS7t+WIpOaWrVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGVxdWFscyA8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XHJcbiAgICAgICAgLy8gVEFPQ1Agdm9sLjIsIDNyZCBlZC4sIHMuNC4yLjQsIHAuMjEzLTIyNVxyXG4gICAgICAgIC8vIGRlZmluZXMgYSAnY2xvc2UgZW5vdWdoJyByZWxhdGlvbnNoaXAgYmV0d2VlbiB1IGFuZCB2IHRoYXQgc2NhbGVzIGZvciBtYWduaXR1ZGVcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wMCAtIGIubTAwKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wMCksIE1hdGguYWJzKGIubTAwKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDEgLSBiLm0wMSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDEpLCBNYXRoLmFicyhiLm0wMSkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTAyIC0gYi5tMDIpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTAyKSwgTWF0aC5hYnMoYi5tMDIpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wMyAtIGIubTAzKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wMyksIE1hdGguYWJzKGIubTAzKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDQgLSBiLm0wNCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDQpLCBNYXRoLmFicyhiLm0wNCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTA1IC0gYi5tMDUpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTA1KSwgTWF0aC5hYnMoYi5tMDUpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wNiAtIGIubTA2KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wNiksIE1hdGguYWJzKGIubTA2KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMDcgLSBiLm0wNykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMDcpLCBNYXRoLmFicyhiLm0wNykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTA4IC0gYi5tMDgpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTA4KSwgTWF0aC5hYnMoYi5tMDgpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0wOSAtIGIubTA5KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0wOSksIE1hdGguYWJzKGIubTA5KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMTAgLSBiLm0xMCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMTApLCBNYXRoLmFicyhiLm0xMCkpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTExIC0gYi5tMTEpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTExKSwgTWF0aC5hYnMoYi5tMTEpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0xMiAtIGIubTEyKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0xMiksIE1hdGguYWJzKGIubTEyKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoYS5tMTMgLSBiLm0xMykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS5tMTMpLCBNYXRoLmFicyhiLm0xMykpICYmXHJcbiAgICAgICAgICAgIE1hdGguYWJzKGEubTE0IC0gYi5tMTQpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEubTE0KSwgTWF0aC5hYnMoYi5tMTQpKSAmJlxyXG4gICAgICAgICAgICBNYXRoLmFicyhhLm0xNSAtIGIubTE1KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLm0xNSksIE1hdGguYWJzKGIubTE1KSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDAg5YiX56ysIDAg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMDA6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOefqemYteesrCAwIOWIl+esrCAxIOihjOeahOWFg+e0oOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbTAxOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnn6npmLXnrKwgMCDliJfnrKwgMiDooYznmoTlhYPntKDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG0wMjogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDAg5YiX56ysIDMg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMDM6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOefqemYteesrCAxIOWIl+esrCAwIOihjOeahOWFg+e0oOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbTA0OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnn6npmLXnrKwgMSDliJfnrKwgMSDooYznmoTlhYPntKDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG0wNTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDEg5YiX56ysIDIg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMDY6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOefqemYteesrCAxIOWIl+esrCAzIOihjOeahOWFg+e0oOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbTA3OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnn6npmLXnrKwgMiDliJfnrKwgMCDooYznmoTlhYPntKDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG0wODogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDIg5YiX56ysIDEg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMDk6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOefqemYteesrCAyIOWIl+esrCAyIOihjOeahOWFg+e0oOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbTEwOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnn6npmLXnrKwgMiDliJfnrKwgMyDooYznmoTlhYPntKDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG0xMTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDMg5YiX56ysIDAg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMTI6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOefqemYteesrCAzIOWIl+esrCAxIOihjOeahOWFg+e0oOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbTEzOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnn6npmLXnrKwgMyDliJfnrKwgMiDooYznmoTlhYPntKDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG0xNDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55+p6Zi156ysIDMg5YiX56ysIDMg6KGM55qE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtMTU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAob3RoZXI6IE1hdDQpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBtMDA/OiBudW1iZXIsIG0wMT86IG51bWJlciwgbTAyPzogbnVtYmVyLCBtMDM/OiBudW1iZXIsXHJcbiAgICAgICAgbTA0PzogbnVtYmVyLCBtMDU/OiBudW1iZXIsIG0wNj86IG51bWJlciwgbTA3PzogbnVtYmVyLFxyXG4gICAgICAgIG0wOD86IG51bWJlciwgbTA5PzogbnVtYmVyLCBtMTA/OiBudW1iZXIsIG0xMT86IG51bWJlcixcclxuICAgICAgICBtMTI/OiBudW1iZXIsIG0xMz86IG51bWJlciwgbTE0PzogbnVtYmVyLCBtMTU/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBtMDA6IE1hdDQgfCBudW1iZXIgPSAxLCBtMDEgPSAwLCBtMDIgPSAwLCBtMDMgPSAwLFxyXG4gICAgICAgIG0wNCA9IDAsIG0wNSA9IDEsIG0wNiA9IDAsIG0wNyA9IDAsXHJcbiAgICAgICAgbTA4ID0gMCwgbTA5ID0gMCwgbTEwID0gMSwgbTExID0gMCxcclxuICAgICAgICBtMTIgPSAwLCBtMTMgPSAwLCBtMTQgPSAwLCBtMTUgPSAxKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICBpZiAodHlwZW9mIG0wMCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5tMDAgPSBtMDAubTAwOyB0aGlzLm0wMSA9IG0wMC5tMDE7IHRoaXMubTAyID0gbTAwLm0wMjsgdGhpcy5tMDMgPSBtMDAubTAzO1xyXG4gICAgICAgICAgICB0aGlzLm0wNCA9IG0wMC5tMDQ7IHRoaXMubTA1ID0gbTAwLm0wNTsgdGhpcy5tMDYgPSBtMDAubTA2OyB0aGlzLm0wNyA9IG0wMC5tMDc7XHJcbiAgICAgICAgICAgIHRoaXMubTA4ID0gbTAwLm0wODsgdGhpcy5tMDkgPSBtMDAubTA5OyB0aGlzLm0xMCA9IG0wMC5tMTA7IHRoaXMubTExID0gbTAwLm0xMTtcclxuICAgICAgICAgICAgdGhpcy5tMTIgPSBtMDAubTEyOyB0aGlzLm0xMyA9IG0wMC5tMTM7IHRoaXMubTE0ID0gbTAwLm0xNDsgdGhpcy5tMTUgPSBtMDAubTE1O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubTAwID0gbTAwOyB0aGlzLm0wMSA9IG0wMTsgdGhpcy5tMDIgPSBtMDI7IHRoaXMubTAzID0gbTAzO1xyXG4gICAgICAgICAgICB0aGlzLm0wNCA9IG0wNDsgdGhpcy5tMDUgPSBtMDU7IHRoaXMubTA2ID0gbTA2OyB0aGlzLm0wNyA9IG0wNztcclxuICAgICAgICAgICAgdGhpcy5tMDggPSBtMDg7IHRoaXMubTA5ID0gbTA5OyB0aGlzLm0xMCA9IG0xMDsgdGhpcy5tMTEgPSBtMTE7XHJcbiAgICAgICAgICAgIHRoaXMubTEyID0gbTEyOyB0aGlzLm0xMyA9IG0xMzsgdGhpcy5tMTQgPSBtMTQ7IHRoaXMubTE1ID0gbTE1O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlhYvpmoblvZPliY3nn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb25lICgpIHtcclxuICAgICAgICBjb25zdCB0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IE1hdDQoXHJcbiAgICAgICAgICAgIHQubTAwLCB0Lm0wMSwgdC5tMDIsIHQubTAzLFxyXG4gICAgICAgICAgICB0Lm0wNCwgdC5tMDUsIHQubTA2LCB0Lm0wNyxcclxuICAgICAgICAgICAgdC5tMDgsIHQubTA5LCB0Lm0xMCwgdC5tMTEsXHJcbiAgICAgICAgICAgIHQubTEyLCB0Lm0xMywgdC5tMTQsIHQubTE1KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7nva7lvZPliY3nn6npmLXkvb/lhbbkuI7mjIflrprnn6npmLXnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6npmLXjgIJcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChvdGhlcjogTWF0NCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lvZPliY3nn6npmLXmjIflrprlhYPntKDlgLzjgIJcclxuICAgICAqIEByZXR1cm4gdGhpc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChcclxuICAgICAgICBtMDA/OiBudW1iZXIsIG0wMT86IG51bWJlciwgbTAyPzogbnVtYmVyLCBtMDM/OiBudW1iZXIsXHJcbiAgICAgICAgbTA0PzogbnVtYmVyLCBtMDU/OiBudW1iZXIsIG0wNj86IG51bWJlciwgbTA3PzogbnVtYmVyLFxyXG4gICAgICAgIG0wOD86IG51bWJlciwgbTA5PzogbnVtYmVyLCBtMTA/OiBudW1iZXIsIG0xMT86IG51bWJlcixcclxuICAgICAgICBtMTI/OiBudW1iZXIsIG0xMz86IG51bWJlciwgbTE0PzogbnVtYmVyLCBtMTU/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKG0wMDogTWF0NCB8IG51bWJlciA9IDEsIG0wMSA9IDAsIG0wMiA9IDAsIG0wMyA9IDAsXHJcbiAgICAgICAgICAgICAgICBtMDQgPSAwLCBtMDUgPSAxLCBtMDYgPSAwLCBtMDcgPSAwLFxyXG4gICAgICAgICAgICAgICAgbTA4ID0gMCwgbTA5ID0gMCwgbTEwID0gMSwgbTExID0gMCxcclxuICAgICAgICAgICAgICAgIG0xMiA9IDAsIG0xMyA9IDAsIG0xNCA9IDAsIG0xNSA9IDEpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG0wMCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5tMDEgPSBtMDAubTAxOyB0aGlzLm0wMiA9IG0wMC5tMDI7IHRoaXMubTAzID0gbTAwLm0wMzsgdGhpcy5tMDQgPSBtMDAubTA0O1xyXG4gICAgICAgICAgICB0aGlzLm0wNSA9IG0wMC5tMDU7IHRoaXMubTA2ID0gbTAwLm0wNjsgdGhpcy5tMDcgPSBtMDAubTA3OyB0aGlzLm0wOCA9IG0wMC5tMDg7XHJcbiAgICAgICAgICAgIHRoaXMubTA5ID0gbTAwLm0wOTsgdGhpcy5tMTAgPSBtMDAubTEwOyB0aGlzLm0xMSA9IG0wMC5tMTE7IHRoaXMubTEyID0gbTAwLm0xMjtcclxuICAgICAgICAgICAgdGhpcy5tMTMgPSBtMDAubTEzOyB0aGlzLm0xNCA9IG0wMC5tMTQ7IHRoaXMubTE1ID0gbTAwLm0xNTsgdGhpcy5tMDAgPSBtMDAubTAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubTAxID0gbTAxOyB0aGlzLm0wMiA9IG0wMjsgdGhpcy5tMDMgPSBtMDM7IHRoaXMubTA0ID0gbTA0O1xyXG4gICAgICAgICAgICB0aGlzLm0wNSA9IG0wNTsgdGhpcy5tMDYgPSBtMDY7IHRoaXMubTA3ID0gbTA3OyB0aGlzLm0wOCA9IG0wODtcclxuICAgICAgICAgICAgdGhpcy5tMDkgPSBtMDk7IHRoaXMubTEwID0gbTEwOyB0aGlzLm0xMSA9IG0xMTsgdGhpcy5tMTIgPSBtMTI7XHJcbiAgICAgICAgICAgIHRoaXMubTEzID0gbTEzOyB0aGlzLm0xNCA9IG0xNDsgdGhpcy5tMTUgPSBtMTU7IHRoaXMubTAwID0gbTAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDliKTmlq3lvZPliY3nn6npmLXmmK/lkKblnKjor6/lt67ojIPlm7TlhoXkuI7mjIflrprnn6npmLXnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTnn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBlcHNpbG9uIOWFgeiuuOeahOivr+W3ru+8jOW6lOS4uumdnui0n+aVsOOAglxyXG4gICAgICogQHJldHVybiDkuKTnn6npmLXnmoTlkITlhYPntKDpg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVxdWFscyAob3RoZXI6IE1hdDQsIGVwc2lsb24gPSBFUFNJTE9OKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDAgLSBvdGhlci5tMDApIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTAwKSwgTWF0aC5hYnMob3RoZXIubTAwKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDEgLSBvdGhlci5tMDEpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTAxKSwgTWF0aC5hYnMob3RoZXIubTAxKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDIgLSBvdGhlci5tMDIpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTAyKSwgTWF0aC5hYnMob3RoZXIubTAyKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDMgLSBvdGhlci5tMDMpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTAzKSwgTWF0aC5hYnMob3RoZXIubTAzKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDQgLSBvdGhlci5tMDQpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA0KSwgTWF0aC5hYnMob3RoZXIubTA0KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDUgLSBvdGhlci5tMDUpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA1KSwgTWF0aC5hYnMob3RoZXIubTA1KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDYgLSBvdGhlci5tMDYpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA2KSwgTWF0aC5hYnMob3RoZXIubTA2KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDcgLSBvdGhlci5tMDcpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA3KSwgTWF0aC5hYnMob3RoZXIubTA3KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDggLSBvdGhlci5tMDgpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA4KSwgTWF0aC5hYnMob3RoZXIubTA4KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMDkgLSBvdGhlci5tMDkpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTA5KSwgTWF0aC5hYnMob3RoZXIubTA5KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTAgLSBvdGhlci5tMTApIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTEwKSwgTWF0aC5hYnMob3RoZXIubTEwKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTEgLSBvdGhlci5tMTEpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTExKSwgTWF0aC5hYnMob3RoZXIubTExKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTIgLSBvdGhlci5tMTIpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTEyKSwgTWF0aC5hYnMob3RoZXIubTEyKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTMgLSBvdGhlci5tMTMpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTEzKSwgTWF0aC5hYnMob3RoZXIubTEzKSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTQgLSBvdGhlci5tMTQpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTE0KSwgTWF0aC5hYnMob3RoZXIubTE0KSkgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy5tMTUgLSBvdGhlci5tMTUpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMubTE1KSwgTWF0aC5hYnMob3RoZXIubTE1KSlcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIpOaWreW9k+WJjeefqemYteaYr+WQpuS4juaMh+WumuefqemYteebuOetieOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOefqemYteOAglxyXG4gICAgICogQHJldHVybiDkuKTnn6npmLXnmoTlkITlhYPntKDpg73liIbliKvnm7jnrYnml7bov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0cmljdEVxdWFscyAob3RoZXI6IE1hdDQpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tMDAgPT09IG90aGVyLm0wMCAmJiB0aGlzLm0wMSA9PT0gb3RoZXIubTAxICYmIHRoaXMubTAyID09PSBvdGhlci5tMDIgJiYgdGhpcy5tMDMgPT09IG90aGVyLm0wMyAmJlxyXG4gICAgICAgICAgICB0aGlzLm0wNCA9PT0gb3RoZXIubTA0ICYmIHRoaXMubTA1ID09PSBvdGhlci5tMDUgJiYgdGhpcy5tMDYgPT09IG90aGVyLm0wNiAmJiB0aGlzLm0wNyA9PT0gb3RoZXIubTA3ICYmXHJcbiAgICAgICAgICAgIHRoaXMubTA4ID09PSBvdGhlci5tMDggJiYgdGhpcy5tMDkgPT09IG90aGVyLm0wOSAmJiB0aGlzLm0xMCA9PT0gb3RoZXIubTEwICYmIHRoaXMubTExID09PSBvdGhlci5tMTEgJiZcclxuICAgICAgICAgICAgdGhpcy5tMTIgPT09IG90aGVyLm0xMiAmJiB0aGlzLm0xMyA9PT0gb3RoZXIubTEzICYmIHRoaXMubTE0ID09PSBvdGhlci5tMTQgJiYgdGhpcy5tMTUgPT09IG90aGVyLm0xNTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuW9k+WJjeefqemYteeahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICogQHJldHVybiDlvZPliY3nn6npmLXnmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gJ1tcXG4nICtcclxuICAgICAgICAgICAgdGhpcy5tMDAgKyAnLCAnICsgdGhpcy5tMDEgKyAnLCAnICsgdGhpcy5tMDIgKyAnLCAnICsgdGhpcy5tMDMgKyAnLFxcbicgK1xyXG4gICAgICAgICAgICB0aGlzLm0wNCArICcsICcgKyB0aGlzLm0wNSArICcsICcgKyB0aGlzLm0wNiArICcsICcgKyB0aGlzLm0wNyArICcsXFxuJyArXHJcbiAgICAgICAgICAgIHRoaXMubTA4ICsgJywgJyArIHRoaXMubTA5ICsgJywgJyArIHRoaXMubTEwICsgJywgJyArIHRoaXMubTExICsgJyxcXG4nICtcclxuICAgICAgICAgICAgdGhpcy5tMTIgKyAnLCAnICsgdGhpcy5tMTMgKyAnLCAnICsgdGhpcy5tMTQgKyAnLCAnICsgdGhpcy5tMTUgKyAnXFxuJyArXHJcbiAgICAgICAgICAgICddJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuW9k+WJjeefqemYteiuvuS4uuWNleS9jeefqemYteOAglxyXG4gICAgICogQHJldHVybiBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlkZW50aXR5ICgpIHtcclxuICAgICAgICB0aGlzLm0wMCA9IDE7XHJcbiAgICAgICAgdGhpcy5tMDEgPSAwO1xyXG4gICAgICAgIHRoaXMubTAyID0gMDtcclxuICAgICAgICB0aGlzLm0wMyA9IDA7XHJcbiAgICAgICAgdGhpcy5tMDQgPSAwO1xyXG4gICAgICAgIHRoaXMubTA1ID0gMTtcclxuICAgICAgICB0aGlzLm0wNiA9IDA7XHJcbiAgICAgICAgdGhpcy5tMDcgPSAwO1xyXG4gICAgICAgIHRoaXMubTA4ID0gMDtcclxuICAgICAgICB0aGlzLm0wOSA9IDA7XHJcbiAgICAgICAgdGhpcy5tMTAgPSAxO1xyXG4gICAgICAgIHRoaXMubTExID0gMDtcclxuICAgICAgICB0aGlzLm0xMiA9IDA7XHJcbiAgICAgICAgdGhpcy5tMTMgPSAwO1xyXG4gICAgICAgIHRoaXMubTE0ID0gMDtcclxuICAgICAgICB0aGlzLm0xNSA9IDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5b2T5YmN55+p6Zi155qE6L2s572u55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc3Bvc2UgKCkge1xyXG4gICAgICAgIGNvbnN0IGEwMSA9IHRoaXMubTAxLCBhMDIgPSB0aGlzLm0wMiwgYTAzID0gdGhpcy5tMDMsIGExMiA9IHRoaXMubTA2LCBhMTMgPSB0aGlzLm0wNywgYTIzID0gdGhpcy5tMTE7XHJcbiAgICAgICAgdGhpcy5tMDEgPSB0aGlzLm0wNDtcclxuICAgICAgICB0aGlzLm0wMiA9IHRoaXMubTA4O1xyXG4gICAgICAgIHRoaXMubTAzID0gdGhpcy5tMTI7XHJcbiAgICAgICAgdGhpcy5tMDQgPSBhMDE7XHJcbiAgICAgICAgdGhpcy5tMDYgPSB0aGlzLm0wOTtcclxuICAgICAgICB0aGlzLm0wNyA9IHRoaXMubTEzO1xyXG4gICAgICAgIHRoaXMubTA4ID0gYTAyO1xyXG4gICAgICAgIHRoaXMubTA5ID0gYTEyO1xyXG4gICAgICAgIHRoaXMubTExID0gdGhpcy5tMTQ7XHJcbiAgICAgICAgdGhpcy5tMTIgPSBhMDM7XHJcbiAgICAgICAgdGhpcy5tMTMgPSBhMTM7XHJcbiAgICAgICAgdGhpcy5tMTQgPSBhMjM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6h566X5b2T5YmN55+p6Zi155qE6YCG55+p6Zi144CC5rOo5oSP77yM5Zyo55+p6Zi15LiN5Y+v6YCG5pe277yM5Lya6L+U5Zue5LiA5Liq5YWo5Li6IDAg55qE55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbnZlcnQgKCkge1xyXG4gICAgICAgIGNvbnN0IGEwMCA9IHRoaXMubTAwOyBjb25zdCBhMDEgPSB0aGlzLm0wMTsgY29uc3QgYTAyID0gdGhpcy5tMDI7IGNvbnN0IGEwMyA9IHRoaXMubTAzO1xyXG4gICAgICAgIGNvbnN0IGExMCA9IHRoaXMubTA0OyBjb25zdCBhMTEgPSB0aGlzLm0wNTsgY29uc3QgYTEyID0gdGhpcy5tMDY7IGNvbnN0IGExMyA9IHRoaXMubTA3O1xyXG4gICAgICAgIGNvbnN0IGEyMCA9IHRoaXMubTA4OyBjb25zdCBhMjEgPSB0aGlzLm0wOTsgY29uc3QgYTIyID0gdGhpcy5tMTA7IGNvbnN0IGEyMyA9IHRoaXMubTExO1xyXG4gICAgICAgIGNvbnN0IGEzMCA9IHRoaXMubTEyOyBjb25zdCBhMzEgPSB0aGlzLm0xMzsgY29uc3QgYTMyID0gdGhpcy5tMTQ7IGNvbnN0IGEzMyA9IHRoaXMubTE1O1xyXG5cclxuICAgICAgICBjb25zdCBiMDAgPSBhMDAgKiBhMTEgLSBhMDEgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAxID0gYTAwICogYTEyIC0gYTAyICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDMgPSBhMDEgKiBhMTIgLSBhMDIgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA0ID0gYTAxICogYTEzIC0gYTAzICogYTExO1xyXG4gICAgICAgIGNvbnN0IGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMjtcclxuICAgICAgICBjb25zdCBiMDYgPSBhMjAgKiBhMzEgLSBhMjEgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA3ID0gYTIwICogYTMyIC0gYTIyICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDkgPSBhMjEgKiBhMzIgLSBhMjIgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjEwID0gYTIxICogYTMzIC0gYTIzICogYTMxO1xyXG4gICAgICAgIGNvbnN0IGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjtcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxyXG4gICAgICAgIGxldCBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XHJcblxyXG4gICAgICAgIGlmIChkZXQgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XHJcblxyXG4gICAgICAgIHRoaXMubTAwID0gKGExMSAqIGIxMSAtIGExMiAqIGIxMCArIGExMyAqIGIwOSkgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDEgPSAoYTAyICogYjEwIC0gYTAxICogYjExIC0gYTAzICogYjA5KSAqIGRldDtcclxuICAgICAgICB0aGlzLm0wMiA9IChhMzEgKiBiMDUgLSBhMzIgKiBiMDQgKyBhMzMgKiBiMDMpICogZGV0O1xyXG4gICAgICAgIHRoaXMubTAzID0gKGEyMiAqIGIwNCAtIGEyMSAqIGIwNSAtIGEyMyAqIGIwMykgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDQgPSAoYTEyICogYjA4IC0gYTEwICogYjExIC0gYTEzICogYjA3KSAqIGRldDtcclxuICAgICAgICB0aGlzLm0wNSA9IChhMDAgKiBiMTEgLSBhMDIgKiBiMDggKyBhMDMgKiBiMDcpICogZGV0O1xyXG4gICAgICAgIHRoaXMubTA2ID0gKGEzMiAqIGIwMiAtIGEzMCAqIGIwNSAtIGEzMyAqIGIwMSkgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMDcgPSAoYTIwICogYjA1IC0gYTIyICogYjAyICsgYTIzICogYjAxKSAqIGRldDtcclxuICAgICAgICB0aGlzLm0wOCA9IChhMTAgKiBiMTAgLSBhMTEgKiBiMDggKyBhMTMgKiBiMDYpICogZGV0O1xyXG4gICAgICAgIHRoaXMubTA5ID0gKGEwMSAqIGIwOCAtIGEwMCAqIGIxMCAtIGEwMyAqIGIwNikgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMTAgPSAoYTMwICogYjA0IC0gYTMxICogYjAyICsgYTMzICogYjAwKSAqIGRldDtcclxuICAgICAgICB0aGlzLm0xMSA9IChhMjEgKiBiMDIgLSBhMjAgKiBiMDQgLSBhMjMgKiBiMDApICogZGV0O1xyXG4gICAgICAgIHRoaXMubTEyID0gKGExMSAqIGIwNyAtIGExMCAqIGIwOSAtIGExMiAqIGIwNikgKiBkZXQ7XHJcbiAgICAgICAgdGhpcy5tMTMgPSAoYTAwICogYjA5IC0gYTAxICogYjA3ICsgYTAyICogYjA2KSAqIGRldDtcclxuICAgICAgICB0aGlzLm0xNCA9IChhMzEgKiBiMDEgLSBhMzAgKiBiMDMgLSBhMzIgKiBiMDApICogZGV0O1xyXG4gICAgICAgIHRoaXMubTE1ID0gKGEyMCAqIGIwMyAtIGEyMSAqIGIwMSArIGEyMiAqIGIwMCkgKiBkZXQ7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6h566X5b2T5YmN55+p6Zi155qE6KGM5YiX5byP44CCXHJcbiAgICAgKiBAcmV0dXJuIOW9k+WJjeefqemYteeahOihjOWIl+W8j+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGV0ZXJtaW5hbnQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gdGhpcy5tMDA7IGNvbnN0IGEwMSA9IHRoaXMubTAxOyBjb25zdCBhMDIgPSB0aGlzLm0wMjsgY29uc3QgYTAzID0gdGhpcy5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gdGhpcy5tMDQ7IGNvbnN0IGExMSA9IHRoaXMubTA1OyBjb25zdCBhMTIgPSB0aGlzLm0wNjsgY29uc3QgYTEzID0gdGhpcy5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gdGhpcy5tMDg7IGNvbnN0IGEyMSA9IHRoaXMubTA5OyBjb25zdCBhMjIgPSB0aGlzLm0xMDsgY29uc3QgYTIzID0gdGhpcy5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gdGhpcy5tMTI7IGNvbnN0IGEzMSA9IHRoaXMubTEzOyBjb25zdCBhMzIgPSB0aGlzLm0xNDsgY29uc3QgYTMzID0gdGhpcy5tMTU7XHJcblxyXG4gICAgICAgIGNvbnN0IGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcclxuICAgICAgICBjb25zdCBiMDEgPSBhMDAgKiBhMTIgLSBhMDIgKiBhMTA7XHJcbiAgICAgICAgY29uc3QgYjAyID0gYTAwICogYTEzIC0gYTAzICogYTEwO1xyXG4gICAgICAgIGNvbnN0IGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcclxuICAgICAgICBjb25zdCBiMDQgPSBhMDEgKiBhMTMgLSBhMDMgKiBhMTE7XHJcbiAgICAgICAgY29uc3QgYjA1ID0gYTAyICogYTEzIC0gYTAzICogYTEyO1xyXG4gICAgICAgIGNvbnN0IGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcclxuICAgICAgICBjb25zdCBiMDcgPSBhMjAgKiBhMzIgLSBhMjIgKiBhMzA7XHJcbiAgICAgICAgY29uc3QgYjA4ID0gYTIwICogYTMzIC0gYTIzICogYTMwO1xyXG4gICAgICAgIGNvbnN0IGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcclxuICAgICAgICBjb25zdCBiMTAgPSBhMjEgKiBhMzMgLSBhMjMgKiBhMzE7XHJcbiAgICAgICAgY29uc3QgYjExID0gYTIyICogYTMzIC0gYTIzICogYTMyO1xyXG5cclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XHJcbiAgICAgICAgcmV0dXJuIGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXliqDms5XjgILlsIblvZPliY3nn6npmLXkuI7mjIflrprnn6npmLXnmoTnm7jliqDvvIznu5Pmnpzov5Tlm57nu5nlvZPliY3nn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg55u45Yqg55qE55+p6Zi1XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGQgKG1hdDogTWF0NCkge1xyXG4gICAgICAgIHRoaXMubTAwID0gdGhpcy5tMDAgKyBtYXQubTAwO1xyXG4gICAgICAgIHRoaXMubTAxID0gdGhpcy5tMDEgKyBtYXQubTAxO1xyXG4gICAgICAgIHRoaXMubTAyID0gdGhpcy5tMDIgKyBtYXQubTAyO1xyXG4gICAgICAgIHRoaXMubTAzID0gdGhpcy5tMDMgKyBtYXQubTAzO1xyXG4gICAgICAgIHRoaXMubTA0ID0gdGhpcy5tMDQgKyBtYXQubTA0O1xyXG4gICAgICAgIHRoaXMubTA1ID0gdGhpcy5tMDUgKyBtYXQubTA1O1xyXG4gICAgICAgIHRoaXMubTA2ID0gdGhpcy5tMDYgKyBtYXQubTA2O1xyXG4gICAgICAgIHRoaXMubTA3ID0gdGhpcy5tMDcgKyBtYXQubTA3O1xyXG4gICAgICAgIHRoaXMubTA4ID0gdGhpcy5tMDggKyBtYXQubTA4O1xyXG4gICAgICAgIHRoaXMubTA5ID0gdGhpcy5tMDkgKyBtYXQubTA5O1xyXG4gICAgICAgIHRoaXMubTEwID0gdGhpcy5tMTAgKyBtYXQubTEwO1xyXG4gICAgICAgIHRoaXMubTExID0gdGhpcy5tMTEgKyBtYXQubTExO1xyXG4gICAgICAgIHRoaXMubTEyID0gdGhpcy5tMTIgKyBtYXQubTEyO1xyXG4gICAgICAgIHRoaXMubTEzID0gdGhpcy5tMTMgKyBtYXQubTEzO1xyXG4gICAgICAgIHRoaXMubTE0ID0gdGhpcy5tMTQgKyBtYXQubTE0O1xyXG4gICAgICAgIHRoaXMubTE1ID0gdGhpcy5tMTUgKyBtYXQubTE1O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+efqemYteWHj+azleOAguWwhuW9k+WJjeefqemYteWHj+WOu+aMh+WumuefqemYteeahOe7k+aenOi1i+WAvOe7meW9k+WJjeefqemYteOAglxyXG4gICAgICogQHBhcmFtIG1hdCDlh4/mlbDnn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN1YnRyYWN0IChtYXQ6IE1hdDQpIHtcclxuICAgICAgICB0aGlzLm0wMCA9IHRoaXMubTAwIC0gbWF0Lm0wMDtcclxuICAgICAgICB0aGlzLm0wMSA9IHRoaXMubTAxIC0gbWF0Lm0wMTtcclxuICAgICAgICB0aGlzLm0wMiA9IHRoaXMubTAyIC0gbWF0Lm0wMjtcclxuICAgICAgICB0aGlzLm0wMyA9IHRoaXMubTAzIC0gbWF0Lm0wMztcclxuICAgICAgICB0aGlzLm0wNCA9IHRoaXMubTA0IC0gbWF0Lm0wNDtcclxuICAgICAgICB0aGlzLm0wNSA9IHRoaXMubTA1IC0gbWF0Lm0wNTtcclxuICAgICAgICB0aGlzLm0wNiA9IHRoaXMubTA2IC0gbWF0Lm0wNjtcclxuICAgICAgICB0aGlzLm0wNyA9IHRoaXMubTA3IC0gbWF0Lm0wNztcclxuICAgICAgICB0aGlzLm0wOCA9IHRoaXMubTA4IC0gbWF0Lm0wODtcclxuICAgICAgICB0aGlzLm0wOSA9IHRoaXMubTA5IC0gbWF0Lm0wOTtcclxuICAgICAgICB0aGlzLm0xMCA9IHRoaXMubTEwIC0gbWF0Lm0xMDtcclxuICAgICAgICB0aGlzLm0xMSA9IHRoaXMubTExIC0gbWF0Lm0xMTtcclxuICAgICAgICB0aGlzLm0xMiA9IHRoaXMubTEyIC0gbWF0Lm0xMjtcclxuICAgICAgICB0aGlzLm0xMyA9IHRoaXMubTEzIC0gbWF0Lm0xMztcclxuICAgICAgICB0aGlzLm0xNCA9IHRoaXMubTE0IC0gbWF0Lm0xNDtcclxuICAgICAgICB0aGlzLm0xNSA9IHRoaXMubTE1IC0gbWF0Lm0xNTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXkuZjms5XjgILlsIblvZPliY3nn6npmLXlt6bkuZjmjIflrprnn6npmLXnmoTnu5PmnpzotYvlgLznu5nlvZPliY3nn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg5oyH5a6a55qE55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseSAobWF0OiBNYXQ0KSB7XHJcbiAgICAgICAgY29uc3QgYTAwID0gdGhpcy5tMDA7IGNvbnN0IGEwMSA9IHRoaXMubTAxOyBjb25zdCBhMDIgPSB0aGlzLm0wMjsgY29uc3QgYTAzID0gdGhpcy5tMDM7XHJcbiAgICAgICAgY29uc3QgYTEwID0gdGhpcy5tMDQ7IGNvbnN0IGExMSA9IHRoaXMubTA1OyBjb25zdCBhMTIgPSB0aGlzLm0wNjsgY29uc3QgYTEzID0gdGhpcy5tMDc7XHJcbiAgICAgICAgY29uc3QgYTIwID0gdGhpcy5tMDg7IGNvbnN0IGEyMSA9IHRoaXMubTA5OyBjb25zdCBhMjIgPSB0aGlzLm0xMDsgY29uc3QgYTIzID0gdGhpcy5tMTE7XHJcbiAgICAgICAgY29uc3QgYTMwID0gdGhpcy5tMTI7IGNvbnN0IGEzMSA9IHRoaXMubTEzOyBjb25zdCBhMzIgPSB0aGlzLm0xNDsgY29uc3QgYTMzID0gdGhpcy5tMTU7XHJcblxyXG4gICAgICAgIC8vIENhY2hlIG9ubHkgdGhlIGN1cnJlbnQgbGluZSBvZiB0aGUgc2Vjb25kIG1hdHJpeFxyXG4gICAgICAgIGxldCBiMCA9IG1hdC5tMDAsIGIxID0gbWF0Lm0wMSwgYjIgPSBtYXQubTAyLCBiMyA9IG1hdC5tMDM7XHJcbiAgICAgICAgdGhpcy5tMDAgPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMDtcclxuICAgICAgICB0aGlzLm0wMSA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gICAgICAgIHRoaXMubTAyID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzI7XHJcbiAgICAgICAgdGhpcy5tMDMgPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzMztcclxuXHJcbiAgICAgICAgYjAgPSBtYXQubTA0OyBiMSA9IG1hdC5tMDU7IGIyID0gbWF0Lm0wNjsgYjMgPSBtYXQubTA3O1xyXG4gICAgICAgIHRoaXMubTA0ID0gYjAgKiBhMDAgKyBiMSAqIGExMCArIGIyICogYTIwICsgYjMgKiBhMzA7XHJcbiAgICAgICAgdGhpcy5tMDUgPSBiMCAqIGEwMSArIGIxICogYTExICsgYjIgKiBhMjEgKyBiMyAqIGEzMTtcclxuICAgICAgICB0aGlzLm0wNiA9IGIwICogYTAyICsgYjEgKiBhMTIgKyBiMiAqIGEyMiArIGIzICogYTMyO1xyXG4gICAgICAgIHRoaXMubTA3ID0gYjAgKiBhMDMgKyBiMSAqIGExMyArIGIyICogYTIzICsgYjMgKiBhMzM7XHJcblxyXG4gICAgICAgIGIwID0gbWF0Lm0wODsgYjEgPSBtYXQubTA5OyBiMiA9IG1hdC5tMTA7IGIzID0gbWF0Lm0xMTtcclxuICAgICAgICB0aGlzLm0wOCA9IGIwICogYTAwICsgYjEgKiBhMTAgKyBiMiAqIGEyMCArIGIzICogYTMwO1xyXG4gICAgICAgIHRoaXMubTA5ID0gYjAgKiBhMDEgKyBiMSAqIGExMSArIGIyICogYTIxICsgYjMgKiBhMzE7XHJcbiAgICAgICAgdGhpcy5tMTAgPSBiMCAqIGEwMiArIGIxICogYTEyICsgYjIgKiBhMjIgKyBiMyAqIGEzMjtcclxuICAgICAgICB0aGlzLm0xMSA9IGIwICogYTAzICsgYjEgKiBhMTMgKyBiMiAqIGEyMyArIGIzICogYTMzO1xyXG5cclxuICAgICAgICBiMCA9IG1hdC5tMTI7IGIxID0gbWF0Lm0xMzsgYjIgPSBtYXQubTE0OyBiMyA9IG1hdC5tMTU7XHJcbiAgICAgICAgdGhpcy5tMTIgPSBiMCAqIGEwMCArIGIxICogYTEwICsgYjIgKiBhMjAgKyBiMyAqIGEzMDtcclxuICAgICAgICB0aGlzLm0xMyA9IGIwICogYTAxICsgYjEgKiBhMTEgKyBiMiAqIGEyMSArIGIzICogYTMxO1xyXG4gICAgICAgIHRoaXMubTE0ID0gYjAgKiBhMDIgKyBiMSAqIGExMiArIGIyICogYTIyICsgYjMgKiBhMzI7XHJcbiAgICAgICAgdGhpcy5tMTUgPSBiMCAqIGEwMyArIGIxICogYTEzICsgYjIgKiBhMjMgKyBiMyAqIGEzMztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnn6npmLXmlbDkuZjjgILlsIblvZPliY3nn6npmLXkuI7mjIflrprmoIfph4/nmoTmlbDkuZjnu5PmnpzotYvlgLznu5nlvZPliY3nn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBzY2FsYXIg5oyH5a6a55qE5qCH6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtdWx0aXBseVNjYWxhciAoc2NhbGFyOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm0wMCA9IHRoaXMubTAwICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTAxID0gdGhpcy5tMDEgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDIgPSB0aGlzLm0wMiAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wMyA9IHRoaXMubTAzICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTA0ID0gdGhpcy5tMDQgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDUgPSB0aGlzLm0wNSAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wNiA9IHRoaXMubTA2ICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTA3ID0gdGhpcy5tMDcgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMDggPSB0aGlzLm0wOCAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0wOSA9IHRoaXMubTA5ICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTEwID0gdGhpcy5tMTAgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMTEgPSB0aGlzLm0xMSAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0xMiA9IHRoaXMubTEyICogc2NhbGFyO1xyXG4gICAgICAgIHRoaXMubTEzID0gdGhpcy5tMTMgKiBzY2FsYXI7XHJcbiAgICAgICAgdGhpcy5tMTQgPSB0aGlzLm0xNCAqIHNjYWxhcjtcclxuICAgICAgICB0aGlzLm0xNSA9IHRoaXMubTE1ICogc2NhbGFyO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWwhuW9k+WJjeefqemYteW3puS5mOS9jeenu+efqemYteeahOe7k+aenOi1i+WAvOe7meW9k+WJjeefqemYte+8jOS9jeenu+efqemYteeUseWQhOS4qui9tOeahOS9jeenu+e7meWHuuOAglxyXG4gICAgICogQHBhcmFtIHZlYyDkvY3np7vlkJHph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zbGF0ZSAodmVjOiBWZWMzKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdmdW5jdGlvbiBjaGFuZ2VkJyk7XHJcbiAgICAgICAgdGhpcy5tMTIgKz0gdmVjLng7XHJcbiAgICAgICAgdGhpcy5tMTMgKz0gdmVjLnk7XHJcbiAgICAgICAgdGhpcy5tMTQgKz0gdmVjLno7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5b2T5YmN55+p6Zi15bem5LmY57yp5pS+55+p6Zi155qE57uT5p6c6LWL5YC857uZ5b2T5YmN55+p6Zi177yM57yp5pS+55+p6Zi155Sx5ZCE5Liq6L2055qE57yp5pS+57uZ5Ye644CCXHJcbiAgICAgKiBAcGFyYW0gdmVjIOWQhOS4qui9tOeahOe8qeaUvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2NhbGUgKHZlYzogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IHggPSB2ZWMueCwgeSA9IHZlYy55LCB6ID0gdmVjLno7XHJcbiAgICAgICAgdGhpcy5tMDAgPSB0aGlzLm0wMCAqIHg7XHJcbiAgICAgICAgdGhpcy5tMDEgPSB0aGlzLm0wMSAqIHg7XHJcbiAgICAgICAgdGhpcy5tMDIgPSB0aGlzLm0wMiAqIHg7XHJcbiAgICAgICAgdGhpcy5tMDMgPSB0aGlzLm0wMyAqIHg7XHJcbiAgICAgICAgdGhpcy5tMDQgPSB0aGlzLm0wNCAqIHk7XHJcbiAgICAgICAgdGhpcy5tMDUgPSB0aGlzLm0wNSAqIHk7XHJcbiAgICAgICAgdGhpcy5tMDYgPSB0aGlzLm0wNiAqIHk7XHJcbiAgICAgICAgdGhpcy5tMDcgPSB0aGlzLm0wNyAqIHk7XHJcbiAgICAgICAgdGhpcy5tMDggPSB0aGlzLm0wOCAqIHo7XHJcbiAgICAgICAgdGhpcy5tMDkgPSB0aGlzLm0wOSAqIHo7XHJcbiAgICAgICAgdGhpcy5tMTAgPSB0aGlzLm0xMCAqIHo7XHJcbiAgICAgICAgdGhpcy5tMTEgPSB0aGlzLm0xMSAqIHo7XHJcbiAgICAgICAgdGhpcy5tMTIgPSB0aGlzLm0xMjtcclxuICAgICAgICB0aGlzLm0xMyA9IHRoaXMubTEzO1xyXG4gICAgICAgIHRoaXMubTE0ID0gdGhpcy5tMTQ7XHJcbiAgICAgICAgdGhpcy5tMTUgPSB0aGlzLm0xNTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIblvZPliY3nn6npmLXlt6bkuZjml4vovaznn6npmLXnmoTnu5PmnpzotYvlgLznu5nlvZPliY3nn6npmLXvvIzml4vovaznn6npmLXnlLHml4vovazovbTlkozml4vovazop5Lluqbnu5nlh7rjgIJcclxuICAgICAqIEBwYXJhbSBtYXQg55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOinkuW6pu+8iOW8p+W6puWItu+8iVxyXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L20XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByb3RhdGUgKHJhZDogbnVtYmVyLCBheGlzOiBWZWMzKSB7XHJcbiAgICAgICAgbGV0IHggPSBheGlzLngsIHkgPSBheGlzLnksIHogPSBheGlzLno7XHJcblxyXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKGxlbikgPCBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGVuID0gMSAvIGxlbjtcclxuICAgICAgICB4ICo9IGxlbjtcclxuICAgICAgICB5ICo9IGxlbjtcclxuICAgICAgICB6ICo9IGxlbjtcclxuXHJcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCk7XHJcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgY29uc3QgdCA9IDEgLSBjO1xyXG5cclxuICAgICAgICBjb25zdCBhMDAgPSB0aGlzLm0wMDsgY29uc3QgYTAxID0gdGhpcy5tMDE7IGNvbnN0IGEwMiA9IHRoaXMubTAyOyBjb25zdCBhMDMgPSB0aGlzLm0wMztcclxuICAgICAgICBjb25zdCBhMTAgPSB0aGlzLm0wNDsgY29uc3QgYTExID0gdGhpcy5tMDU7IGNvbnN0IGExMiA9IHRoaXMubTA2OyBjb25zdCBhMTMgPSB0aGlzLm0wNztcclxuICAgICAgICBjb25zdCBhMjAgPSB0aGlzLm0wODsgY29uc3QgYTIxID0gdGhpcy5tMDk7IGNvbnN0IGEyMiA9IHRoaXMubTEwOyBjb25zdCBhMjMgPSB0aGlzLm0xMTtcclxuXHJcbiAgICAgICAgLy8gQ29uc3RydWN0IHRoZSBlbGVtZW50cyBvZiB0aGUgcm90YXRpb24gbWF0cml4XHJcbiAgICAgICAgY29uc3QgYjAwID0geCAqIHggKiB0ICsgYywgYjAxID0geSAqIHggKiB0ICsgeiAqIHMsIGIwMiA9IHogKiB4ICogdCAtIHkgKiBzO1xyXG4gICAgICAgIGNvbnN0IGIxMCA9IHggKiB5ICogdCAtIHogKiBzLCBiMTEgPSB5ICogeSAqIHQgKyBjLCBiMTIgPSB6ICogeSAqIHQgKyB4ICogcztcclxuICAgICAgICBjb25zdCBiMjAgPSB4ICogeiAqIHQgKyB5ICogcywgYjIxID0geSAqIHogKiB0IC0geCAqIHMsIGIyMiA9IHogKiB6ICogdCArIGM7XHJcblxyXG4gICAgICAgIC8vIFBlcmZvcm0gcm90YXRpb24tc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXHJcbiAgICAgICAgdGhpcy5tMDAgPSBhMDAgKiBiMDAgKyBhMTAgKiBiMDEgKyBhMjAgKiBiMDI7XHJcbiAgICAgICAgdGhpcy5tMDEgPSBhMDEgKiBiMDAgKyBhMTEgKiBiMDEgKyBhMjEgKiBiMDI7XHJcbiAgICAgICAgdGhpcy5tMDIgPSBhMDIgKiBiMDAgKyBhMTIgKiBiMDEgKyBhMjIgKiBiMDI7XHJcbiAgICAgICAgdGhpcy5tMDMgPSBhMDMgKiBiMDAgKyBhMTMgKiBiMDEgKyBhMjMgKiBiMDI7XHJcbiAgICAgICAgdGhpcy5tMDQgPSBhMDAgKiBiMTAgKyBhMTAgKiBiMTEgKyBhMjAgKiBiMTI7XHJcbiAgICAgICAgdGhpcy5tMDUgPSBhMDEgKiBiMTAgKyBhMTEgKiBiMTEgKyBhMjEgKiBiMTI7XHJcbiAgICAgICAgdGhpcy5tMDYgPSBhMDIgKiBiMTAgKyBhMTIgKiBiMTEgKyBhMjIgKiBiMTI7XHJcbiAgICAgICAgdGhpcy5tMDcgPSBhMDMgKiBiMTAgKyBhMTMgKiBiMTEgKyBhMjMgKiBiMTI7XHJcbiAgICAgICAgdGhpcy5tMDggPSBhMDAgKiBiMjAgKyBhMTAgKiBiMjEgKyBhMjAgKiBiMjI7XHJcbiAgICAgICAgdGhpcy5tMDkgPSBhMDEgKiBiMjAgKyBhMTEgKiBiMjEgKyBhMjEgKiBiMjI7XHJcbiAgICAgICAgdGhpcy5tMTAgPSBhMDIgKiBiMjAgKyBhMTIgKiBiMjEgKyBhMjIgKiBiMjI7XHJcbiAgICAgICAgdGhpcy5tMTEgPSBhMDMgKiBiMjAgKyBhMTMgKiBiMjEgKyBhMjMgKiBiMjI7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOS7juW9k+WJjeefqemYteS4reiuoeeul+WHuuS9jeenu+WPmOaNoueahOmDqOWIhu+8jOW5tuS7peWQhOS4qui9tOS4iuS9jeenu+eahOW9ouW8j+i1i+WAvOe7meWHuuWPo+WQkemHj+OAglxyXG4gICAgICogQHBhcmFtIG91dCDov5Tlm57lkJHph4/vvIzlvZPmnKrmjIflrprml7blsIbliJvlu7rkuLrmlrDnmoTlkJHph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFRyYW5zbGF0aW9uIChvdXQ6IFZlYzMpIHtcclxuICAgICAgICBvdXQueCA9IHRoaXMubTEyO1xyXG4gICAgICAgIG91dC55ID0gdGhpcy5tMTM7XHJcbiAgICAgICAgb3V0LnogPSB0aGlzLm0xNDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDku47lvZPliY3nn6npmLXkuK3orqHnrpflh7rnvKnmlL7lj5jmjaLnmoTpg6jliIbvvIzlubbku6XlkITkuKrovbTkuIrnvKnmlL7nmoTlvaLlvI/otYvlgLznu5nlh7rlj6PlkJHph4/jgIJcclxuICAgICAqIEBwYXJhbSBvdXQg6L+U5Zue5YC877yM5b2T5pyq5oyH5a6a5pe25bCG5Yib5bu65Li65paw55qE5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTY2FsZSAob3V0OiBWZWMzKSB7XHJcbiAgICAgICAgY29uc3QgbTAwID0gbTNfMS5tMDAgPSB0aGlzLm0wMDtcclxuICAgICAgICBjb25zdCBtMDEgPSBtM18xLm0wMSA9IHRoaXMubTAxO1xyXG4gICAgICAgIGNvbnN0IG0wMiA9IG0zXzEubTAyID0gdGhpcy5tMDI7XHJcbiAgICAgICAgY29uc3QgbTA0ID0gbTNfMS5tMDMgPSB0aGlzLm0wNDtcclxuICAgICAgICBjb25zdCBtMDUgPSBtM18xLm0wNCA9IHRoaXMubTA1O1xyXG4gICAgICAgIGNvbnN0IG0wNiA9IG0zXzEubTA1ID0gdGhpcy5tMDY7XHJcbiAgICAgICAgY29uc3QgbTA4ID0gbTNfMS5tMDYgPSB0aGlzLm0wODtcclxuICAgICAgICBjb25zdCBtMDkgPSBtM18xLm0wNyA9IHRoaXMubTA5O1xyXG4gICAgICAgIGNvbnN0IG0xMCA9IG0zXzEubTA4ID0gdGhpcy5tMTA7XHJcbiAgICAgICAgb3V0LnggPSBNYXRoLnNxcnQobTAwICogbTAwICsgbTAxICogbTAxICsgbTAyICogbTAyKTtcclxuICAgICAgICBvdXQueSA9IE1hdGguc3FydChtMDQgKiBtMDQgKyBtMDUgKiBtMDUgKyBtMDYgKiBtMDYpO1xyXG4gICAgICAgIG91dC56ID0gTWF0aC5zcXJ0KG0wOCAqIG0wOCArIG0wOSAqIG0wOSArIG0xMCAqIG0xMCk7XHJcbiAgICAgICAgLy8gYWNjb3VudCBmb3IgcmVmZWN0aW9uc1xyXG4gICAgICAgIGlmIChNYXQzLmRldGVybWluYW50KG0zXzEpIDwgMCkgeyBvdXQueCAqPSAtMTsgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LuO5b2T5YmN55+p6Zi15Lit6K6h566X5Ye65peL6L2s5Y+Y5o2i55qE6YOo5YiG77yM5bm25Lul5Zub5YWD5pWw55qE5b2i5byP6LWL5YC857uZ5Ye65Y+j5Zub5YWD5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOi/lOWbnuWAvO+8jOW9k+acquaMh+WumuaXtuWwhuWIm+W7uuS4uuaWsOeahOWbm+WFg+aVsOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Um90YXRpb24gKG91dDogUXVhdCkge1xyXG4gICAgICAgIGNvbnN0IHRyYWNlID0gdGhpcy5tMDAgKyB0aGlzLm0wNSArIHRoaXMubTEwO1xyXG4gICAgICAgIGxldCBTID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRyYWNlID4gMCkge1xyXG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KHRyYWNlICsgMS4wKSAqIDI7XHJcbiAgICAgICAgICAgIG91dC53ID0gMC4yNSAqIFM7XHJcbiAgICAgICAgICAgIG91dC54ID0gKHRoaXMubTA2IC0gdGhpcy5tMDkpIC8gUztcclxuICAgICAgICAgICAgb3V0LnkgPSAodGhpcy5tMDggLSB0aGlzLm0wMikgLyBTO1xyXG4gICAgICAgICAgICBvdXQueiA9ICh0aGlzLm0wMSAtIHRoaXMubTA0KSAvIFM7XHJcbiAgICAgICAgfSBlbHNlIGlmICgodGhpcy5tMDAgPiB0aGlzLm0wNSkgJiYgKHRoaXMubTAwID4gdGhpcy5tMTApKSB7XHJcbiAgICAgICAgICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgdGhpcy5tMDAgLSB0aGlzLm0wNSAtIHRoaXMubTEwKSAqIDI7XHJcbiAgICAgICAgICAgIG91dC53ID0gKHRoaXMubTA2IC0gdGhpcy5tMDkpIC8gUztcclxuICAgICAgICAgICAgb3V0LnggPSAwLjI1ICogUztcclxuICAgICAgICAgICAgb3V0LnkgPSAodGhpcy5tMDEgKyB0aGlzLm0wNCkgLyBTO1xyXG4gICAgICAgICAgICBvdXQueiA9ICh0aGlzLm0wOCArIHRoaXMubTAyKSAvIFM7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm0wNSA+IHRoaXMubTEwKSB7XHJcbiAgICAgICAgICAgIFMgPSBNYXRoLnNxcnQoMS4wICsgdGhpcy5tMDUgLSB0aGlzLm0wMCAtIHRoaXMubTEwKSAqIDI7XHJcbiAgICAgICAgICAgIG91dC53ID0gKHRoaXMubTA4IC0gdGhpcy5tMDIpIC8gUztcclxuICAgICAgICAgICAgb3V0LnggPSAodGhpcy5tMDEgKyB0aGlzLm0wNCkgLyBTO1xyXG4gICAgICAgICAgICBvdXQueSA9IDAuMjUgKiBTO1xyXG4gICAgICAgICAgICBvdXQueiA9ICh0aGlzLm0wNiArIHRoaXMubTA5KSAvIFM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgUyA9IE1hdGguc3FydCgxLjAgKyB0aGlzLm0xMCAtIHRoaXMubTAwIC0gdGhpcy5tMDUpICogMjtcclxuICAgICAgICAgICAgb3V0LncgPSAodGhpcy5tMDEgLSB0aGlzLm0wNCkgLyBTO1xyXG4gICAgICAgICAgICBvdXQueCA9ICh0aGlzLm0wOCArIHRoaXMubTAyKSAvIFM7XHJcbiAgICAgICAgICAgIG91dC55ID0gKHRoaXMubTA2ICsgdGhpcy5tMDkpIC8gUztcclxuICAgICAgICAgICAgb3V0LnogPSAwLjI1ICogUztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YeN572u5b2T5YmN55+p6Zi155qE5YC877yM5L2/5YW26KGo56S65oyH5a6a55qE5peL6L2s44CB57yp5pS+44CB5L2N56e75L6d5qyh57uE5ZCI55qE5Y+Y5o2i44CCXHJcbiAgICAgKiBAcGFyYW0gcSDlm5vlhYPmlbDooajnpLrnmoTml4vovazlj5jmjaLjgIJcclxuICAgICAqIEBwYXJhbSB2IOS9jeenu+WPmOaNou+8jOihqOekuuS4uuWQhOS4qui9tOeahOS9jeenu+OAglxyXG4gICAgICogQHBhcmFtIHMg57yp5pS+5Y+Y5o2i77yM6KGo56S65Li65ZCE5Liq6L2055qE57yp5pS+44CCXHJcbiAgICAgKiBAcmV0dXJuIGB0aGlzYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZnJvbVJUUyAocTogUXVhdCwgdjogVmVjMywgczogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IHggPSBxLngsIHkgPSBxLnksIHogPSBxLnosIHcgPSBxLnc7XHJcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcclxuICAgICAgICBjb25zdCB5MiA9IHkgKyB5O1xyXG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XHJcblxyXG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xyXG4gICAgICAgIGNvbnN0IHh5ID0geCAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHl5ID0geSAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHl6ID0geSAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xyXG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xyXG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xyXG4gICAgICAgIGNvbnN0IHN4ID0gcy54O1xyXG4gICAgICAgIGNvbnN0IHN5ID0gcy55O1xyXG4gICAgICAgIGNvbnN0IHN6ID0gcy56O1xyXG5cclxuICAgICAgICB0aGlzLm0wMCA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xyXG4gICAgICAgIHRoaXMubTAxID0gKHh5ICsgd3opICogc3g7XHJcbiAgICAgICAgdGhpcy5tMDIgPSAoeHogLSB3eSkgKiBzeDtcclxuICAgICAgICB0aGlzLm0wMyA9IDA7XHJcbiAgICAgICAgdGhpcy5tMDQgPSAoeHkgLSB3eikgKiBzeTtcclxuICAgICAgICB0aGlzLm0wNSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xyXG4gICAgICAgIHRoaXMubTA2ID0gKHl6ICsgd3gpICogc3k7XHJcbiAgICAgICAgdGhpcy5tMDcgPSAwO1xyXG4gICAgICAgIHRoaXMubTA4ID0gKHh6ICsgd3kpICogc3o7XHJcbiAgICAgICAgdGhpcy5tMDkgPSAoeXogLSB3eCkgKiBzejtcclxuICAgICAgICB0aGlzLm0xMCA9ICgxIC0gKHh4ICsgeXkpKSAqIHN6O1xyXG4gICAgICAgIHRoaXMubTExID0gMDtcclxuICAgICAgICB0aGlzLm0xMiA9IHYueDtcclxuICAgICAgICB0aGlzLm0xMyA9IHYueTtcclxuICAgICAgICB0aGlzLm0xNCA9IHYuejtcclxuICAgICAgICB0aGlzLm0xNSA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmHjee9ruW9k+WJjeefqemYteeahOWAvO+8jOS9v+WFtuihqOekuuaMh+WumuWbm+WFg+aVsOihqOekuueahOaXi+i9rOWPmOaNouOAglxyXG4gICAgICogQHBhcmFtIHEg5Zub5YWD5pWw6KGo56S655qE5peL6L2s5Y+Y5o2i44CCXHJcbiAgICAgKiBAcmV0dXJuIGB0aGlzYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZnJvbVF1YXQgKHE6IFF1YXQpIHtcclxuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xyXG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XHJcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcclxuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xyXG5cclxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcclxuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcclxuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcclxuICAgICAgICBjb25zdCB6eCA9IHogKiB4MjtcclxuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcclxuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcclxuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcclxuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcclxuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcclxuXHJcbiAgICAgICAgdGhpcy5tMDAgPSAxIC0geXkgLSB6ejtcclxuICAgICAgICB0aGlzLm0wMSA9IHl4ICsgd3o7XHJcbiAgICAgICAgdGhpcy5tMDIgPSB6eCAtIHd5O1xyXG4gICAgICAgIHRoaXMubTAzID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5tMDQgPSB5eCAtIHd6O1xyXG4gICAgICAgIHRoaXMubTA1ID0gMSAtIHh4IC0geno7XHJcbiAgICAgICAgdGhpcy5tMDYgPSB6eSArIHd4O1xyXG4gICAgICAgIHRoaXMubTA3ID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5tMDggPSB6eCArIHd5O1xyXG4gICAgICAgIHRoaXMubTA5ID0genkgLSB3eDtcclxuICAgICAgICB0aGlzLm0xMCA9IDEgLSB4eCAtIHl5O1xyXG4gICAgICAgIHRoaXMubTExID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5tMTIgPSAwO1xyXG4gICAgICAgIHRoaXMubTEzID0gMDtcclxuICAgICAgICB0aGlzLm0xNCA9IDA7XHJcbiAgICAgICAgdGhpcy5tMTUgPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IG0zXzEgPSBuZXcgTWF0MygpO1xyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5NYXQ0JywgTWF0NCwge1xyXG4gICAgbTAwOiAxLCBtMDE6IDAsIG0wMjogMCwgbTAzOiAwLFxyXG4gICAgbTA0OiAwLCBtMDU6IDEsIG0wNjogMCwgbTA3OiAwLFxyXG4gICAgbTA4OiAwLCBtMDk6IDAsIG0xMDogMSwgbTExOiAwLFxyXG4gICAgbTEyOiAwLCBtMTM6IDAsIG0xNDogMCwgbTE1OiAxLFxyXG59KTtcclxubGVnYWN5Q0MuTWF0NCA9IE1hdDQ7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF0NCAob3RoZXI6IE1hdDQpOiBNYXQ0O1xyXG5leHBvcnQgZnVuY3Rpb24gbWF0NCAoXHJcbiAgICBtMDA/OiBudW1iZXIsIG0wMT86IG51bWJlciwgbTAyPzogbnVtYmVyLCBtMDM/OiBudW1iZXIsXHJcbiAgICBtMTA/OiBudW1iZXIsIG0xMT86IG51bWJlciwgbTEyPzogbnVtYmVyLCBtMTM/OiBudW1iZXIsXHJcbiAgICBtMjA/OiBudW1iZXIsIG0yMT86IG51bWJlciwgbTIyPzogbnVtYmVyLCBtMjM/OiBudW1iZXIsXHJcbiAgICBtMzA/OiBudW1iZXIsIG0zMT86IG51bWJlciwgbTMyPzogbnVtYmVyLCBtMzM/OiBudW1iZXIpOiBNYXQ0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1hdDQgKFxyXG4gICAgbTAwPzogTWF0NCB8IG51bWJlciwgbTAxPywgbTAyPywgbTAzPyxcclxuICAgIG0xMD8sIG0xMT8sIG0xMj8sIG0xMz8sXHJcbiAgICBtMjA/LCBtMjE/LCBtMjI/LCBtMjM/LFxyXG4gICAgbTMwPywgbTMxPywgbTMyPywgbTMzPykge1xyXG4gICAgcmV0dXJuIG5ldyBNYXQ0KG0wMCBhcyBhbnksIG0wMSwgbTAyLCBtMDMsIG0xMCwgbTExLCBtMTIsIG0xMywgbTIwLCBtMjEsIG0yMiwgbTIzLCBtMzAsIG0zMSwgbTMyLCBtMzMpO1xyXG59XHJcblxyXG5sZWdhY3lDQy5tYXQ0ID0gbWF0NDtcclxuIl19