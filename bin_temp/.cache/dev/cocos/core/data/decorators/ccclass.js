(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/js.js", "../../default-constants.js", "../class.js", "../utils/preprocess-class.js", "./utils.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/js.js"), require("../../default-constants.js"), require("../class.js"), require("../utils/preprocess-class.js"), require("./utils.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.defaultConstants, global._class, global.preprocessClass, global.utils);
    global.ccclass = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _js, _defaultConstants, _class, _preprocessClass, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ccclass = void 0;

  /**
   * @category decorator
   */

  /**
   * @en Declare a standard ES6 or TS Class as a CCClass, please refer to the [document](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)
   * @zh 将标准写法的 ES6 或者 TS Class 声明为 CCClass，具体用法请参阅[类型定义](https://docs.cocos.com/creator3d/manual/zh/scripting/ccclass.html)。
   * @param name - The class name used for serialization.
   * @example
   * ```ts
   * import { _decorator, Component } from 'cc';
   * const {ccclass} = _decorator;
   *
   * // define a CCClass, omit the name
   *  @ccclass
   * class NewScript extends Component {
   *     // ...
   * }
   *
   * // define a CCClass with a name
   *  @ccclass('LoginData')
   * class LoginData {
   *     // ...
   * }
   * ```
   */
  var ccclass = (0, _utils.makeSmartClassDecorator)(function (constructor, name) {
    var base = _js.js.getSuper(constructor);

    if (base === Object) {
      base = null;
    }

    var proto = {
      name: name,
      "extends": base,
      ctor: constructor,
      __ES6__: true
    };
    var cache = constructor[_utils.CACHE_KEY];

    if (cache) {
      var decoratedProto = cache.proto;

      if (decoratedProto) {
        // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
        _js.js.mixin(proto, decoratedProto);
      }

      constructor[_utils.CACHE_KEY] = undefined;
    }

    var res = (0, _class.CCClass)(proto); // validate methods

    if (_defaultConstants.DEV) {
      var propNames = Object.getOwnPropertyNames(constructor.prototype);

      for (var i = 0; i < propNames.length; ++i) {
        var prop = propNames[i];

        if (prop !== 'constructor') {
          var desc = Object.getOwnPropertyDescriptor(constructor.prototype, prop);
          var func = desc && desc.value;

          if (typeof func === 'function') {
            (0, _preprocessClass.doValidateMethodWithProps_DEV)(func, prop, _js.js.getClassName(constructor), constructor, base);
          }
        }
      }
    }

    return res;
  });
  _exports.ccclass = ccclass;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL2NjY2xhc3MudHMiXSwibmFtZXMiOlsiY2NjbGFzcyIsImNvbnN0cnVjdG9yIiwibmFtZSIsImJhc2UiLCJqcyIsImdldFN1cGVyIiwiT2JqZWN0IiwicHJvdG8iLCJjdG9yIiwiX19FUzZfXyIsImNhY2hlIiwiQ0FDSEVfS0VZIiwiZGVjb3JhdGVkUHJvdG8iLCJtaXhpbiIsInVuZGVmaW5lZCIsInJlcyIsIkRFViIsInByb3BOYW1lcyIsImdldE93blByb3BlcnR5TmFtZXMiLCJwcm90b3R5cGUiLCJpIiwibGVuZ3RoIiwicHJvcCIsImRlc2MiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmdW5jIiwidmFsdWUiLCJnZXRDbGFzc05hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCTyxNQUFNQSxPQUE2RCxHQUFHLG9DQUFnQyxVQUFDQyxXQUFELEVBQWNDLElBQWQsRUFBdUI7QUFDaEksUUFBSUMsSUFBSSxHQUFHQyxPQUFHQyxRQUFILENBQVlKLFdBQVosQ0FBWDs7QUFDQSxRQUFJRSxJQUFJLEtBQUtHLE1BQWIsRUFBcUI7QUFDakJILE1BQUFBLElBQUksR0FBRyxJQUFQO0FBQ0g7O0FBRUQsUUFBTUksS0FBSyxHQUFHO0FBQ1ZMLE1BQUFBLElBQUksRUFBSkEsSUFEVTtBQUVWLGlCQUFTQyxJQUZDO0FBR1ZLLE1BQUFBLElBQUksRUFBRVAsV0FISTtBQUlWUSxNQUFBQSxPQUFPLEVBQUU7QUFKQyxLQUFkO0FBTUEsUUFBTUMsS0FBSyxHQUFHVCxXQUFXLENBQUNVLGdCQUFELENBQXpCOztBQUNBLFFBQUlELEtBQUosRUFBVztBQUNQLFVBQU1FLGNBQWMsR0FBR0YsS0FBSyxDQUFDSCxLQUE3Qjs7QUFDQSxVQUFJSyxjQUFKLEVBQW9CO0FBQ2hCO0FBQ0FSLGVBQUdTLEtBQUgsQ0FBU04sS0FBVCxFQUFnQkssY0FBaEI7QUFDSDs7QUFDRFgsTUFBQUEsV0FBVyxDQUFDVSxnQkFBRCxDQUFYLEdBQXlCRyxTQUF6QjtBQUNIOztBQUVELFFBQU1DLEdBQUcsR0FBRyxvQkFBUVIsS0FBUixDQUFaLENBdEJnSSxDQXdCaEk7O0FBQ0EsUUFBSVMscUJBQUosRUFBUztBQUNMLFVBQU1DLFNBQVMsR0FBR1gsTUFBTSxDQUFDWSxtQkFBUCxDQUEyQmpCLFdBQVcsQ0FBQ2tCLFNBQXZDLENBQWxCOztBQUNBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsU0FBUyxDQUFDSSxNQUE5QixFQUFzQyxFQUFFRCxDQUF4QyxFQUEyQztBQUN2QyxZQUFNRSxJQUFJLEdBQUdMLFNBQVMsQ0FBQ0csQ0FBRCxDQUF0Qjs7QUFDQSxZQUFJRSxJQUFJLEtBQUssYUFBYixFQUE0QjtBQUN4QixjQUFNQyxJQUFJLEdBQUdqQixNQUFNLENBQUNrQix3QkFBUCxDQUFnQ3ZCLFdBQVcsQ0FBQ2tCLFNBQTVDLEVBQXVERyxJQUF2RCxDQUFiO0FBQ0EsY0FBTUcsSUFBSSxHQUFHRixJQUFJLElBQUlBLElBQUksQ0FBQ0csS0FBMUI7O0FBQ0EsY0FBSSxPQUFPRCxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQzVCLGdFQUE4QkEsSUFBOUIsRUFBb0NILElBQXBDLEVBQTBDbEIsT0FBR3VCLFlBQUgsQ0FBZ0IxQixXQUFoQixDQUExQyxFQUF3RUEsV0FBeEUsRUFBcUZFLElBQXJGO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsV0FBT1ksR0FBUDtBQUNILEdBeEM0RSxDQUF0RSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZGVjb3JhdG9yXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsganMgfSBmcm9tICcuLi8uLi91dGlscy9qcyc7XHJcbmltcG9ydCB7IERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9jbGFzcyc7XHJcbmltcG9ydCB7IGRvVmFsaWRhdGVNZXRob2RXaXRoUHJvcHNfREVWIH0gZnJvbSAnLi4vdXRpbHMvcHJlcHJvY2Vzcy1jbGFzcyc7XHJcbmltcG9ydCB7IENBQ0hFX0tFWSwgbWFrZVNtYXJ0Q2xhc3NEZWNvcmF0b3IgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBAZW4gRGVjbGFyZSBhIHN0YW5kYXJkIEVTNiBvciBUUyBDbGFzcyBhcyBhIENDQ2xhc3MsIHBsZWFzZSByZWZlciB0byB0aGUgW2RvY3VtZW50XShodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IzZC9tYW51YWwvemgvc2NyaXB0aW5nL2NjY2xhc3MuaHRtbClcclxuICogQHpoIOWwhuagh+WHhuWGmeazleeahCBFUzYg5oiW6ICFIFRTIENsYXNzIOWjsOaYjuS4uiBDQ0NsYXNz77yM5YW35L2T55So5rOV6K+35Y+C6ZiFW+exu+Wei+WumuS5iV0oaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yM2QvbWFudWFsL3poL3NjcmlwdGluZy9jY2NsYXNzLmh0bWwp44CCXHJcbiAqIEBwYXJhbSBuYW1lIC0gVGhlIGNsYXNzIG5hbWUgdXNlZCBmb3Igc2VyaWFsaXphdGlvbi5cclxuICogQGV4YW1wbGVcclxuICogYGBgdHNcclxuICogaW1wb3J0IHsgX2RlY29yYXRvciwgQ29tcG9uZW50IH0gZnJvbSAnY2MnO1xyXG4gKiBjb25zdCB7Y2NjbGFzc30gPSBfZGVjb3JhdG9yO1xyXG4gKlxyXG4gKiAvLyBkZWZpbmUgYSBDQ0NsYXNzLCBvbWl0IHRoZSBuYW1lXHJcbiAqICBAY2NjbGFzc1xyXG4gKiBjbGFzcyBOZXdTY3JpcHQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gKiAgICAgLy8gLi4uXHJcbiAqIH1cclxuICpcclxuICogLy8gZGVmaW5lIGEgQ0NDbGFzcyB3aXRoIGEgbmFtZVxyXG4gKiAgQGNjY2xhc3MoJ0xvZ2luRGF0YScpXHJcbiAqIGNsYXNzIExvZ2luRGF0YSB7XHJcbiAqICAgICAvLyAuLi5cclxuICogfVxyXG4gKiBgYGBcclxuICovXHJcbmV4cG9ydCBjb25zdCBjY2NsYXNzOiAoKG5hbWU/OiBzdHJpbmcpID0+IENsYXNzRGVjb3JhdG9yKSAmIENsYXNzRGVjb3JhdG9yID0gbWFrZVNtYXJ0Q2xhc3NEZWNvcmF0b3I8c3RyaW5nPigoY29uc3RydWN0b3IsIG5hbWUpID0+IHtcclxuICAgIGxldCBiYXNlID0ganMuZ2V0U3VwZXIoY29uc3RydWN0b3IpO1xyXG4gICAgaWYgKGJhc2UgPT09IE9iamVjdCkge1xyXG4gICAgICAgIGJhc2UgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByb3RvID0ge1xyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgZXh0ZW5kczogYmFzZSxcclxuICAgICAgICBjdG9yOiBjb25zdHJ1Y3RvcixcclxuICAgICAgICBfX0VTNl9fOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGNhY2hlID0gY29uc3RydWN0b3JbQ0FDSEVfS0VZXTtcclxuICAgIGlmIChjYWNoZSkge1xyXG4gICAgICAgIGNvbnN0IGRlY29yYXRlZFByb3RvID0gY2FjaGUucHJvdG87XHJcbiAgICAgICAgaWYgKGRlY29yYXRlZFByb3RvKSB7XHJcbiAgICAgICAgICAgIC8vIGRlY29yYXRlZFByb3RvLnByb3BlcnRpZXMgPSBjcmVhdGVQcm9wZXJ0aWVzKGN0b3IsIGRlY29yYXRlZFByb3RvLnByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICBqcy5taXhpbihwcm90bywgZGVjb3JhdGVkUHJvdG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdHJ1Y3RvcltDQUNIRV9LRVldID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlcyA9IENDQ2xhc3MocHJvdG8pO1xyXG5cclxuICAgIC8vIHZhbGlkYXRlIG1ldGhvZHNcclxuICAgIGlmIChERVYpIHtcclxuICAgICAgICBjb25zdCBwcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjb25zdHJ1Y3Rvci5wcm90b3R5cGUpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcE5hbWVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb3AgPSBwcm9wTmFtZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChwcm9wICE9PSAnY29uc3RydWN0b3InKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3ApO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGRlc2MgJiYgZGVzYy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvVmFsaWRhdGVNZXRob2RXaXRoUHJvcHNfREVWKGZ1bmMsIHByb3AsIGpzLmdldENsYXNzTmFtZShjb25zdHJ1Y3RvciksIGNvbnN0cnVjdG9yLCBiYXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzO1xyXG59KTtcclxuXHJcbiJdfQ==