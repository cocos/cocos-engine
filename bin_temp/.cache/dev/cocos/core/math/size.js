(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../value-types/value-type.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../value-types/value-type.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.valueType, global.globalExports);
    global.size = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _valueType, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.size = size;
  _exports.Size = void 0;

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
   * 二维尺寸。
   */
  var Size = /*#__PURE__*/function (_ValueType) {
    _inherits(Size, _ValueType);

    _createClass(Size, [{
      key: "x",
      // compatibility with vector interfaces
      set: function set(val) {
        this.width = val;
      },
      get: function get() {
        return this.width;
      }
    }, {
      key: "y",
      set: function set(val) {
        this.height = val;
      },
      get: function get() {
        return this.height;
      }
      /**
       * 宽度。
       */

    }], [{
      key: "lerp",

      /**
       * 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
       * @param out 本方法将插值结果赋值给此参数
       * @param from 起始尺寸。
       * @param to 目标尺寸。
       * @param ratio 插值比率，范围为 [0,1]。
       * @returns 当前尺寸的宽和高到目标尺寸的宽和高分别按指定插值比率进行线性插值构成的向量。
       */
      value: function lerp(out, from, to, ratio) {
        out.width = from.width + (to.width - from.width) * ratio;
        out.height = from.height + (to.height - from.height) * ratio;
        return out;
      }
    }]);

    function Size(width, height) {
      var _this;

      _classCallCheck(this, Size);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Size).call(this));

      if (width && _typeof(width) === 'object') {
        _this.height = width.height;
        _this.width = width.width;
      } else {
        _this.width = width || 0;
        _this.height = height || 0;
      }

      return _this;
    }
    /**
     * 克隆当前尺寸。
     */


    _createClass(Size, [{
      key: "clone",
      value: function clone() {
        return new Size(this.width, this.height);
      }
      /**
       * 设置当前尺寸使其与指定的尺寸相等。
       * @param other 相比较的尺寸。
       * @returns `this`
       */

    }, {
      key: "set",
      value: function set(width, height) {
        if (width && _typeof(width) === 'object') {
          this.height = width.height;
          this.width = width.width;
        } else {
          this.width = width || 0;
          this.height = height || 0;
        }

        return this;
      }
      /**
       * 判断当前尺寸是否与指定尺寸的相等。
       * @param other 相比较的尺寸。
       * @returns 两尺寸的宽和高都分别相等时返回 `true`；否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        return this.width === other.width && this.height === other.height;
      }
      /**
       * 根据指定的插值比率，从当前尺寸到目标尺寸之间做插值。
       * @param to 目标尺寸。
       * @param ratio 插值比率，范围为 [0,1]。
       */

    }, {
      key: "lerp",
      value: function lerp(to, ratio) {
        this.width = this.width + (to.width - this.width) * ratio;
        this.height = this.height + (to.height - this.height) * ratio;
        return this;
      }
      /**
       * 返回当前尺寸的字符串表示。
       * @returns 当前尺寸的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return "(".concat(this.width.toFixed(2), ", ").concat(this.height.toFixed(2), ")");
      }
    }]);

    return Size;
  }(_valueType.ValueType);

  _exports.Size = Size;
  Size.ZERO = Object.freeze(new Size(0, 0));
  Size.ONE = Object.freeze(new Size(1, 1));

  _class.CCClass.fastDefine('cc.Size', Size, {
    width: 0,
    height: 0
  });
  /**
   * 等价于 `new Size(other)`。
   * @param other 相比较的尺寸。
   * @returns `new Size(other)`
   */


  function size() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return new Size(width, height);
  }

  _globalExports.legacyCC.size = size;
  _globalExports.legacyCC.Size = Size;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9zaXplLnRzIl0sIm5hbWVzIjpbIlNpemUiLCJ2YWwiLCJ3aWR0aCIsImhlaWdodCIsIm91dCIsImZyb20iLCJ0byIsInJhdGlvIiwib3RoZXIiLCJ0b0ZpeGVkIiwiVmFsdWVUeXBlIiwiWkVSTyIsIk9iamVjdCIsImZyZWV6ZSIsIk9ORSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwic2l6ZSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQ0E7OztNQUdhQSxJOzs7OztBQW1CVDt3QkFDT0MsRyxFQUFLO0FBQUUsYUFBS0MsS0FBTCxHQUFhRCxHQUFiO0FBQW1CLE87MEJBQ3hCO0FBQUUsZUFBTyxLQUFLQyxLQUFaO0FBQW9COzs7d0JBQ3hCRCxHLEVBQUs7QUFBRSxhQUFLRSxNQUFMLEdBQWNGLEdBQWQ7QUFBb0IsTzswQkFDekI7QUFBRSxlQUFPLEtBQUtFLE1BQVo7QUFBcUI7QUFFaEM7Ozs7Ozs7QUFwQkE7Ozs7Ozs7OzJCQVE0Q0MsRyxFQUFVQyxJLEVBQVdDLEUsRUFBU0MsSyxFQUFlO0FBQ3JGSCxRQUFBQSxHQUFHLENBQUNGLEtBQUosR0FBWUcsSUFBSSxDQUFDSCxLQUFMLEdBQWEsQ0FBQ0ksRUFBRSxDQUFDSixLQUFILEdBQVdHLElBQUksQ0FBQ0gsS0FBakIsSUFBMEJLLEtBQW5EO0FBQ0FILFFBQUFBLEdBQUcsQ0FBQ0QsTUFBSixHQUFhRSxJQUFJLENBQUNGLE1BQUwsR0FBYyxDQUFDRyxFQUFFLENBQUNILE1BQUgsR0FBWUUsSUFBSSxDQUFDRixNQUFsQixJQUE0QkksS0FBdkQ7QUFDQSxlQUFPSCxHQUFQO0FBQ0g7OztBQStCRCxrQkFBYUYsS0FBYixFQUFvQ0MsTUFBcEMsRUFBcUQ7QUFBQTs7QUFBQTs7QUFDakQ7O0FBQ0EsVUFBSUQsS0FBSyxJQUFJLFFBQU9BLEtBQVAsTUFBaUIsUUFBOUIsRUFBd0M7QUFDcEMsY0FBS0MsTUFBTCxHQUFjRCxLQUFLLENBQUNDLE1BQXBCO0FBQ0EsY0FBS0QsS0FBTCxHQUFhQSxLQUFLLENBQUNBLEtBQW5CO0FBQ0gsT0FIRCxNQUdPO0FBQ0gsY0FBS0EsS0FBTCxHQUFhQSxLQUFLLElBQUksQ0FBdEI7QUFDQSxjQUFLQyxNQUFMLEdBQWNBLE1BQU0sSUFBSSxDQUF4QjtBQUNIOztBQVJnRDtBQVNwRDtBQUVEOzs7Ozs7OzhCQUdnQjtBQUNaLGVBQU8sSUFBSUgsSUFBSixDQUFTLEtBQUtFLEtBQWQsRUFBcUIsS0FBS0MsTUFBMUIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OzBCQWVZRCxLLEVBQXVCQyxNLEVBQWlCO0FBQ2hELFlBQUlELEtBQUssSUFBSSxRQUFPQSxLQUFQLE1BQWlCLFFBQTlCLEVBQXdDO0FBQ3BDLGVBQUtDLE1BQUwsR0FBY0QsS0FBSyxDQUFDQyxNQUFwQjtBQUNBLGVBQUtELEtBQUwsR0FBYUEsS0FBSyxDQUFDQSxLQUFuQjtBQUNILFNBSEQsTUFHTztBQUNILGVBQUtBLEtBQUwsR0FBYUEsS0FBSyxJQUFJLENBQXRCO0FBQ0EsZUFBS0MsTUFBTCxHQUFjQSxNQUFNLElBQUksQ0FBeEI7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs2QkFLZUssSyxFQUFhO0FBQ3hCLGVBQU8sS0FBS04sS0FBTCxLQUFlTSxLQUFLLENBQUNOLEtBQXJCLElBQ0gsS0FBS0MsTUFBTCxLQUFnQkssS0FBSyxDQUFDTCxNQUQxQjtBQUVIO0FBRUQ7Ozs7Ozs7OzJCQUthRyxFLEVBQVVDLEssRUFBZTtBQUNsQyxhQUFLTCxLQUFMLEdBQWEsS0FBS0EsS0FBTCxHQUFhLENBQUNJLEVBQUUsQ0FBQ0osS0FBSCxHQUFXLEtBQUtBLEtBQWpCLElBQTBCSyxLQUFwRDtBQUNBLGFBQUtKLE1BQUwsR0FBYyxLQUFLQSxNQUFMLEdBQWMsQ0FBQ0csRUFBRSxDQUFDSCxNQUFILEdBQVksS0FBS0EsTUFBbEIsSUFBNEJJLEtBQXhEO0FBQ0EsZUFBTyxJQUFQO0FBQ0g7QUFFRDs7Ozs7OztpQ0FJbUI7QUFDZiwwQkFBVyxLQUFLTCxLQUFMLENBQVdPLE9BQVgsQ0FBbUIsQ0FBbkIsQ0FBWCxlQUFxQyxLQUFLTixNQUFMLENBQVlNLE9BQVosQ0FBb0IsQ0FBcEIsQ0FBckM7QUFDSDs7OztJQXZIcUJDLG9COzs7QUFBYlYsRUFBQUEsSSxDQUVLVyxJLEdBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUliLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFkLEM7QUFGWkEsRUFBQUEsSSxDQUdLYyxHLEdBQU1GLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLElBQUliLElBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFkLEM7O0FBdUh4QmUsaUJBQVFDLFVBQVIsQ0FBbUIsU0FBbkIsRUFBOEJoQixJQUE5QixFQUFvQztBQUFFRSxJQUFBQSxLQUFLLEVBQUUsQ0FBVDtBQUFZQyxJQUFBQSxNQUFNLEVBQUU7QUFBcEIsR0FBcEM7QUFFQTs7Ozs7OztBQWVPLFdBQVNjLElBQVQsR0FBNkQ7QUFBQSxRQUE5Q2YsS0FBOEMsdUVBQXZCLENBQXVCO0FBQUEsUUFBcEJDLE1BQW9CLHVFQUFILENBQUc7QUFDaEUsV0FBTyxJQUFJSCxJQUFKLENBQVNFLEtBQVQsRUFBdUJDLE1BQXZCLENBQVA7QUFDSDs7QUFFRGUsMEJBQVNELElBQVQsR0FBZ0JBLElBQWhCO0FBRUFDLDBCQUFTbEIsSUFBVCxHQUFnQkEsSUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvbWF0aFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9kYXRhL2NsYXNzJztcclxuaW1wb3J0IHsgVmFsdWVUeXBlIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmFsdWUtdHlwZSc7XHJcbmltcG9ydCB7IElTaXplTGlrZSB9IGZyb20gJy4vdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiDkuoznu7TlsLrlr7jjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBTaXplIGV4dGVuZHMgVmFsdWVUeXBlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFpFUk8gPSBPYmplY3QuZnJlZXplKG5ldyBTaXplKDAsIDApKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgT05FID0gT2JqZWN0LmZyZWV6ZShuZXcgU2l6ZSgxLCAxKSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7mjIflrprnmoTmj5LlgLzmr5TnjofvvIzku47lvZPliY3lsLrlr7jliLDnm67moIflsLrlr7jkuYvpl7TlgZrmj5LlgLzjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5pys5pa55rOV5bCG5o+S5YC857uT5p6c6LWL5YC857uZ5q2k5Y+C5pWwXHJcbiAgICAgKiBAcGFyYW0gZnJvbSDotbflp4vlsLrlr7jjgIJcclxuICAgICAqIEBwYXJhbSB0byDnm67moIflsLrlr7jjgIJcclxuICAgICAqIEBwYXJhbSByYXRpbyDmj5LlgLzmr5TnjofvvIzojIPlm7TkuLogWzAsMV3jgIJcclxuICAgICAqIEByZXR1cm5zIOW9k+WJjeWwuuWvuOeahOWuveWSjOmrmOWIsOebruagh+WwuuWvuOeahOWuveWSjOmrmOWIhuWIq+aMieaMh+WumuaPkuWAvOavlOeOh+i/m+ihjOe6v+aAp+aPkuWAvOaehOaIkOeahOWQkemHj+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGxlcnAgPE91dCBleHRlbmRzIElTaXplTGlrZT4gKG91dDogT3V0LCBmcm9tOiBPdXQsIHRvOiBPdXQsIHJhdGlvOiBudW1iZXIpIHtcclxuICAgICAgICBvdXQud2lkdGggPSBmcm9tLndpZHRoICsgKHRvLndpZHRoIC0gZnJvbS53aWR0aCkgKiByYXRpbztcclxuICAgICAgICBvdXQuaGVpZ2h0ID0gZnJvbS5oZWlnaHQgKyAodG8uaGVpZ2h0IC0gZnJvbS5oZWlnaHQpICogcmF0aW87XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjb21wYXRpYmlsaXR5IHdpdGggdmVjdG9yIGludGVyZmFjZXNcclxuICAgIHNldCB4ICh2YWwpIHsgdGhpcy53aWR0aCA9IHZhbDsgfVxyXG4gICAgZ2V0IHggKCkgeyByZXR1cm4gdGhpcy53aWR0aDsgfVxyXG4gICAgc2V0IHkgKHZhbCkgeyB0aGlzLmhlaWdodCA9IHZhbDsgfVxyXG4gICAgZ2V0IHkgKCkgeyByZXR1cm4gdGhpcy5oZWlnaHQ7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWuveW6puOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVjbGFyZSB3aWR0aDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZWNsYXJlIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p6E6YCg5LiO5oyH5a6a5bC65a+455u4562J55qE5bC65a+444CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChvdGhlcjogU2l6ZSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDlhbfmnInmjIflrprlrr3luqblkozpq5jluqbnmoTlsLrlr7jjgIJcclxuICAgICAqIEBwYXJhbSBbd2lkdGg9MF0g5oyH5a6a55qE5a695bqm44CCXHJcbiAgICAgKiBAcGFyYW0gW2hlaWdodD0wXSDmjIflrprnmoTpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh3aWR0aD86IFNpemUgfCBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgaWYgKHdpZHRoICYmIHR5cGVvZiB3aWR0aCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB3aWR0aC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aC53aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlhYvpmoblvZPliY3lsLrlr7jjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsb25lICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNpemUodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5b2T5YmN5bC65a+45L2/5YW25LiO5oyH5a6a55qE5bC65a+455u4562J44CCXHJcbiAgICAgKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5bC65a+444CCXHJcbiAgICAgKiBAcmV0dXJucyBgdGhpc2BcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAob3RoZXI6IFNpemUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5b2T5YmN5bC65a+455qE5YW35L2T5Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gd2lkdGgg6KaB6K6+572u55qEIHdpZHRoIOWAvFxyXG4gICAgICogQHBhcmFtIGhlaWdodCDopoHorr7nva7nmoQgaGVpZ2h0IOWAvFxyXG4gICAgICogQHJldHVybnMgYHRoaXNgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgKHdpZHRoPzogbnVtYmVyLCBoZWlnaHQ/OiBudW1iZXIpO1xyXG5cclxuICAgIHB1YmxpYyBzZXQgKHdpZHRoPzogU2l6ZSB8IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHdpZHRoICYmIHR5cGVvZiB3aWR0aCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB3aWR0aC5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aC53aWR0aDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgMDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQgfHwgMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lvZPliY3lsLrlr7jmmK/lkKbkuI7mjIflrprlsLrlr7jnmoTnm7jnrYnjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTlsLrlr7jjgIJcclxuICAgICAqIEByZXR1cm5zIOS4pOWwuuWvuOeahOWuveWSjOmrmOmDveWIhuWIq+ebuOetieaXtui/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZXF1YWxzIChvdGhlcjogU2l6ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoID09PSBvdGhlci53aWR0aCAmJlxyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9PT0gb3RoZXIuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5oyH5a6a55qE5o+S5YC85q+U546H77yM5LuO5b2T5YmN5bC65a+45Yiw55uu5qCH5bC65a+45LmL6Ze05YGa5o+S5YC844CCXHJcbiAgICAgKiBAcGFyYW0gdG8g55uu5qCH5bC65a+444CCXHJcbiAgICAgKiBAcGFyYW0gcmF0aW8g5o+S5YC85q+U546H77yM6IyD5Zu05Li6IFswLDFd44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsZXJwICh0bzogU2l6ZSwgcmF0aW86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLndpZHRoICsgKHRvLndpZHRoIC0gdGhpcy53aWR0aCkgKiByYXRpbztcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgKHRvLmhlaWdodCAtIHRoaXMuaGVpZ2h0KSAqIHJhdGlvO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6L+U5Zue5b2T5YmN5bC65a+455qE5a2X56ym5Liy6KGo56S644CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3lsLrlr7jnmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gYCgke3RoaXMud2lkdGgudG9GaXhlZCgyKX0sICR7dGhpcy5oZWlnaHQudG9GaXhlZCgyKX0pYDtcclxuICAgIH1cclxufVxyXG5cclxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5TaXplJywgU2l6ZSwgeyB3aWR0aDogMCwgaGVpZ2h0OiAwIH0pO1xyXG5cclxuLyoqXHJcbiAqIOetieS7t+S6jiBgbmV3IFNpemUob3RoZXIpYOOAglxyXG4gKiBAcGFyYW0gb3RoZXIg55u45q+U6L6D55qE5bC65a+444CCXHJcbiAqIEByZXR1cm5zIGBuZXcgU2l6ZShvdGhlcilgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2l6ZSAob3RoZXI6IFNpemUpOiBTaXplO1xyXG5cclxuLyoqXHJcbiAqIOetieS7t+S6jiBgbmV3IFNpemUoeCwgeSlg44CCXHJcbiAqIEBwYXJhbSBbeD0wXSDmjIflrprnmoTlrr3luqbjgIJcclxuICogQHBhcmFtIFt5PTBdIOaMh+WumueahOmrmOW6puOAglxyXG4gKiBAcmV0dXJucyBgbmV3IFNpemUoeCwgeSlgXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2l6ZSAod2lkdGg/OiBudW1iZXIsIGhlaWdodD86IG51bWJlcik6IFNpemU7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2l6ZSAod2lkdGg6IFNpemUgfCBudW1iZXIgPSAwLCBoZWlnaHQ6IG51bWJlciA9IDApIHtcclxuICAgIHJldHVybiBuZXcgU2l6ZSh3aWR0aCBhcyBhbnksIGhlaWdodCk7XHJcbn1cclxuXHJcbmxlZ2FjeUNDLnNpemUgPSBzaXplO1xyXG5cclxubGVnYWN5Q0MuU2l6ZSA9IFNpemU7XHJcbiJdfQ==