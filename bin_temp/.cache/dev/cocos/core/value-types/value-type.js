(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../utils/js.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../utils/js.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.js, global.globalExports);
    global.valueType = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ValueType = void 0;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * 所有值类型的基类。
   */
  var ValueType = /*#__PURE__*/function () {
    function ValueType() {
      _classCallCheck(this, ValueType);
    }

    _createClass(ValueType, [{
      key: "clone",

      /**
       * 克隆当前值。克隆的结果值应与当前值相等，即满足 `this.equals(this, value.clone())`。
       *
       * 本方法的基类版本简单地返回 `this`；
       * 派生类**必须**重写本方法，并且返回的对象不应当为 `this`，即满足 `this !== this.clone()`。
       * @returns 克隆结果值。
       */
      value: function clone() {
        (0, _debug.errorID)(100, js.getClassName(this) + '.clone');
        return this;
      }
      /**
       * 判断当前值是否与指定值相等。此判断应当具有交换性，即满足 `this.equals(other) === other.equals(this)`。
       * 本方法的基类版本简单地返回 `false`。
       * @param other 相比较的值。
       * @returns 相等则返回 `true`，否则返回 `false`。
       */

    }, {
      key: "equals",
      value: function equals(other) {
        // errorID(100, js.getClassName(this) + '.equals');
        return false;
      }
      /**
       * 赋值当前值使其与指定值相等，即在 `this.set(other)` 之后应有 `this.equals(other)`。
       * 本方法的基类版本简单地返回 `this`，派生类**必须**重写本方法。
       * @param other 相比较的值。
       */

    }, {
      key: "set",
      value: function set(other) {
        (0, _debug.errorID)(100, js.getClassName(this) + '.set');
      }
      /**
       * 返回当前值的字符串表示。
       * 本方法的基类版本返回空字符串。
       * @returns 当前值的字符串表示。
       */

    }, {
      key: "toString",
      value: function toString() {
        return '' + {};
      }
    }]);

    return ValueType;
  }();

  _exports.ValueType = ValueType;
  js.setClassName('cc.ValueType', ValueType);
  _globalExports.legacyCC.ValueType = ValueType;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdmFsdWUtdHlwZXMvdmFsdWUtdHlwZS50cyJdLCJuYW1lcyI6WyJWYWx1ZVR5cGUiLCJqcyIsImdldENsYXNzTmFtZSIsIm90aGVyIiwic2V0Q2xhc3NOYW1lIiwibGVnYWN5Q0MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0E7OztNQUdhQSxTOzs7Ozs7OztBQUNUOzs7Ozs7OzhCQU8yQjtBQUN2Qiw0QkFBUSxHQUFSLEVBQWFDLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQixJQUFoQixJQUF3QixRQUFyQztBQUNBLGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs2QkFNZUMsSyxFQUFhO0FBQ3hCO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7MEJBS1lBLEssRUFBYTtBQUNyQiw0QkFBUSxHQUFSLEVBQWFGLEVBQUUsQ0FBQ0MsWUFBSCxDQUFnQixJQUFoQixJQUF3QixNQUFyQztBQUNIO0FBRUQ7Ozs7Ozs7O2lDQUttQjtBQUNmLGVBQU8sS0FBSyxFQUFaO0FBQ0g7Ozs7Ozs7QUFFTEQsRUFBQUEsRUFBRSxDQUFDRyxZQUFILENBQWdCLGNBQWhCLEVBQWdDSixTQUFoQztBQUVBSywwQkFBU0wsU0FBVCxHQUFxQkEsU0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmUvdmFsdWUtdHlwZXNcclxuICovXHJcblxyXG5pbXBvcnQgeyBlcnJvcklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuLyoqXHJcbiAqIOaJgOacieWAvOexu+Wei+eahOWfuuexu+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZhbHVlVHlwZSB7XHJcbiAgICAvKipcclxuICAgICAqIOWFi+mahuW9k+WJjeWAvOOAguWFi+mahueahOe7k+aenOWAvOW6lOS4juW9k+WJjeWAvOebuOetie+8jOWNs+a7oei2syBgdGhpcy5lcXVhbHModGhpcywgdmFsdWUuY2xvbmUoKSlg44CCXHJcbiAgICAgKlxyXG4gICAgICog5pys5pa55rOV55qE5Z+657G754mI5pys566A5Y2V5Zyw6L+U5ZueIGB0aGlzYO+8m1xyXG4gICAgICog5rS+55Sf57G7Kirlv4XpobsqKumHjeWGmeacrOaWueazle+8jOW5tuS4lOi/lOWbnueahOWvueixoeS4jeW6lOW9k+S4uiBgdGhpc2DvvIzljbPmu6HotrMgYHRoaXMgIT09IHRoaXMuY2xvbmUoKWDjgIJcclxuICAgICAqIEByZXR1cm5zIOWFi+mahue7k+aenOWAvOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xvbmUgKCk6IFZhbHVlVHlwZSB7XHJcbiAgICAgICAgZXJyb3JJRCgxMDAsIGpzLmdldENsYXNzTmFtZSh0aGlzKSArICcuY2xvbmUnKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreW9k+WJjeWAvOaYr+WQpuS4juaMh+WumuWAvOebuOetieOAguatpOWIpOaWreW6lOW9k+WFt+acieS6pOaNouaAp++8jOWNs+a7oei2syBgdGhpcy5lcXVhbHMob3RoZXIpID09PSBvdGhlci5lcXVhbHModGhpcylg44CCXHJcbiAgICAgKiDmnKzmlrnms5XnmoTln7rnsbvniYjmnKznroDljZXlnLDov5Tlm54gYGZhbHNlYOOAglxyXG4gICAgICogQHBhcmFtIG90aGVyIOebuOavlOi+g+eahOWAvOOAglxyXG4gICAgICogQHJldHVybnMg55u4562J5YiZ6L+U5ZueIGB0cnVlYO+8jOWQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlcXVhbHMgKG90aGVyOiB0aGlzKSB7XHJcbiAgICAgICAgLy8gZXJyb3JJRCgxMDAsIGpzLmdldENsYXNzTmFtZSh0aGlzKSArICcuZXF1YWxzJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6LWL5YC85b2T5YmN5YC85L2/5YW25LiO5oyH5a6a5YC855u4562J77yM5Y2z5ZyoIGB0aGlzLnNldChvdGhlcilgIOS5i+WQjuW6lOaciSBgdGhpcy5lcXVhbHMob3RoZXIpYOOAglxyXG4gICAgICog5pys5pa55rOV55qE5Z+657G754mI5pys566A5Y2V5Zyw6L+U5ZueIGB0aGlzYO+8jOa0vueUn+exuyoq5b+F6aG7Kirph43lhpnmnKzmlrnms5XjgIJcclxuICAgICAqIEBwYXJhbSBvdGhlciDnm7jmr5TovoPnmoTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCAob3RoZXI6IHRoaXMpIHtcclxuICAgICAgICBlcnJvcklEKDEwMCwganMuZ2V0Q2xhc3NOYW1lKHRoaXMpICsgJy5zZXQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi/lOWbnuW9k+WJjeWAvOeahOWtl+espuS4suihqOekuuOAglxyXG4gICAgICog5pys5pa55rOV55qE5Z+657G754mI5pys6L+U5Zue56m65a2X56ym5Liy44CCXHJcbiAgICAgKiBAcmV0dXJucyDlvZPliY3lgLznmoTlrZfnrKbkuLLooajnpLrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRvU3RyaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gJycgKyB7fTtcclxuICAgIH1cclxufVxyXG5qcy5zZXRDbGFzc05hbWUoJ2NjLlZhbHVlVHlwZScsIFZhbHVlVHlwZSk7XHJcblxyXG5sZWdhY3lDQy5WYWx1ZVR5cGUgPSBWYWx1ZVR5cGU7XHJcbiJdfQ==