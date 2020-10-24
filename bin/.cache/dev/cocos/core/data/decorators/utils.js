(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../class.js", "../../default-constants.js", "../../platform/debug.js", "../../utils/js.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../class.js"), require("../../default-constants.js"), require("../../platform/debug.js"), require("../../utils/js.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.defaultConstants, global.debug, global.js);
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _defaultConstants, _debug, _js) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.makeSmartClassDecorator = makeSmartClassDecorator;
  _exports.makeEditorClassDecoratorFn = makeEditorClassDecoratorFn;
  _exports.makeSmartEditorClassDecorator = makeSmartEditorClassDecorator;
  _exports.getClassCache = getClassCache;
  _exports.getSubDict = getSubDict;
  _exports.CACHE_KEY = _exports.emptySmartClassDecorator = _exports.emptyDecoratorFn = _exports.emptyDecorator = void 0;

  /**
   * @category decorator
   */

  /**
   * @en
   * A class(or property) decorator which does nothing.
   * @zh
   * 一个什么也不做的类（或属性）装饰器。
   */
  var emptyDecorator = function emptyDecorator() {};
  /**
   * @en
   * A function which ignore all arguments and return the `emptyDecorator`.
   * @zh
   * 一个忽略所有参数并且返回 `emptyDecorator` 的函数。
   */


  _exports.emptyDecorator = emptyDecorator;

  var emptyDecoratorFn = function emptyDecoratorFn() {
    return emptyDecorator;
  };
  /**
   * @en
   * Acts like `emptyDecorator` if called in form of `@x`;
   * acts like `emptyDecoratorFn` if called in form of `@x(...args)`.
   * @zh
   * 当以 `@x` 形式调用时表现如同 `emptyDecorator`，当以 `@x(...args)` 形式调用时表现如同 `emptyDecoratorFn`。
   */


  _exports.emptyDecoratorFn = emptyDecoratorFn;
  var emptySmartClassDecorator = makeSmartClassDecorator(function () {});
  /**
   * @en
   * Make a smart class decorator which can properly handle the following form decorator syntax:
   * - `@x`
   * - `@x(arg0)`
   * 
   * and forward both the decorated class and the `arg0` (in first form, `arg0` is forward as `undefined`) to
   * `decorate`.
   * @zh
   * 创建一个智能类装饰器，它能正确地处理以下形式的装饰器语法：
   * - `@x`
   * - `@x(arg0)`
   * 
   * 并且，将被装饰的类和 `arg0`（若是第一种形式，`arg0` 就是 `undefined`）一起转发给 `decorate`。
   * @param decorate 
   */

  _exports.emptySmartClassDecorator = emptySmartClassDecorator;

  function makeSmartClassDecorator(decorate) {
    return proxyFn;

    function proxyFn(target) {
      if (typeof target === 'function') {
        // If no parameter specified
        return decorate(target);
      } else {
        return function (constructor) {
          return decorate(constructor, target);
        };
      }
    }
  }

  function writeEditorClassProperty(constructor, propertyName, value) {
    var cache = getClassCache(constructor, propertyName);

    if (cache) {
      var proto = getSubDict(cache, 'proto');
      getSubDict(proto, 'editor')[propertyName] = value;
    }
  }
  /**
   * @en
   * Make a function which accept an argument value and return a class decorator.
   * The decorator sets the editor property `propertyName`, on the decorated class, into that argument value.
   * @zh
   * 创建一个函数，该函数接受一个参数值并返回一个类装饰器。
   * 该装饰器将被装饰类的编辑器属性 `propertyName` 设置为该参数的值。
   * @param propertyName The editor property.
   */


  function makeEditorClassDecoratorFn(propertyName) {
    return function (value) {
      return function (constructor) {
        writeEditorClassProperty(constructor, propertyName, value);
      };
    };
  }
  /**
   * Make a smart class decorator.
   * The smart decorator sets the editor property `propertyName`, on the decorated class, into:
   * - `defaultValue` if the decorator is called with `@x` form, or
   * - the argument if the decorator is called with an argument, eg, the `@x(arg0)` form.
   * @zh
   * 创建一个智能类装饰器。
   * 该智能类装饰器将根据以下情况来设置被装饰类的编辑器属性 `propertyName`：
   * - 如果该装饰器是以 `@x` 形式调用的，该属性将被设置为 `defaultValue`。
   * - 如果该装饰器是以一个参数的形式，即 `@x(arg0)` 的形式调用的，该属性将被设置为传入的参数值。
   * @param propertyName The editor property.
   */


  function makeSmartEditorClassDecorator(propertyName, defaultValue) {
    return makeSmartClassDecorator(function (constructor, decoratedValue) {
      writeEditorClassProperty(constructor, propertyName, defaultValue !== undefined ? defaultValue : decoratedValue);
    });
  } // caches for class construction


  var CACHE_KEY = '__ccclassCache__';
  _exports.CACHE_KEY = CACHE_KEY;

  function getClassCache(ctor, decoratorName) {
    if (_defaultConstants.DEV && _class.CCClass._isCCClass(ctor)) {
      (0, _debug.error)('`@%s` should be used after @ccclass for class "%s"', decoratorName, _js.js.getClassName(ctor));
      return null;
    }

    return getSubDict(ctor, CACHE_KEY);
  }

  function getSubDict(obj, key) {
    return obj[key] || (obj[key] = {});
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9kZWNvcmF0b3JzL3V0aWxzLnRzIl0sIm5hbWVzIjpbImVtcHR5RGVjb3JhdG9yIiwiZW1wdHlEZWNvcmF0b3JGbiIsImVtcHR5U21hcnRDbGFzc0RlY29yYXRvciIsIm1ha2VTbWFydENsYXNzRGVjb3JhdG9yIiwiZGVjb3JhdGUiLCJwcm94eUZuIiwidGFyZ2V0IiwiY29uc3RydWN0b3IiLCJ3cml0ZUVkaXRvckNsYXNzUHJvcGVydHkiLCJwcm9wZXJ0eU5hbWUiLCJ2YWx1ZSIsImNhY2hlIiwiZ2V0Q2xhc3NDYWNoZSIsInByb3RvIiwiZ2V0U3ViRGljdCIsIm1ha2VFZGl0b3JDbGFzc0RlY29yYXRvckZuIiwibWFrZVNtYXJ0RWRpdG9yQ2xhc3NEZWNvcmF0b3IiLCJkZWZhdWx0VmFsdWUiLCJkZWNvcmF0ZWRWYWx1ZSIsInVuZGVmaW5lZCIsIkNBQ0hFX0tFWSIsImN0b3IiLCJkZWNvcmF0b3JOYW1lIiwiREVWIiwiQ0NDbGFzcyIsIl9pc0NDQ2xhc3MiLCJqcyIsImdldENsYXNzTmFtZSIsIm9iaiIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBcUJBOzs7Ozs7QUFNTyxNQUFNQSxjQUF3RCxHQUFHLFNBQTNEQSxjQUEyRCxHQUFNLENBQUUsQ0FBekU7QUFFUDs7Ozs7Ozs7OztBQU1PLE1BQU1DLGdCQUFnQixHQUFHLFNBQW5CQSxnQkFBbUI7QUFBQSxXQUFNRCxjQUFOO0FBQUEsR0FBekI7QUFFUDs7Ozs7Ozs7OztBQU9PLE1BQU1FLHdCQUF3QixHQUFHQyx1QkFBdUIsQ0FBQyxZQUFNLENBQUUsQ0FBVCxDQUF4RDtBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JPLFdBQVNBLHVCQUFULENBQ0hDLFFBREcsRUFFOEM7QUFDakQsV0FBT0MsT0FBUDs7QUFHQSxhQUFTQSxPQUFULENBQWtCQyxNQUFsQixFQUE2RjtBQUN6RixVQUFJLE9BQU9BLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDOUI7QUFDQSxlQUFPRixRQUFRLENBQUNFLE1BQUQsQ0FBZjtBQUNILE9BSEQsTUFHTztBQUNILGVBQU8sVUFBdUNDLFdBQXZDLEVBQStEO0FBQ2xFLGlCQUFPSCxRQUFRLENBQUNHLFdBQUQsRUFBY0QsTUFBZCxDQUFmO0FBQ0gsU0FGRDtBQUdIO0FBQ0o7QUFDSjs7QUFFRCxXQUFTRSx3QkFBVCxDQUEyQ0QsV0FBM0MsRUFBa0VFLFlBQWxFLEVBQXdGQyxLQUF4RixFQUF1RztBQUNuRyxRQUFNQyxLQUFLLEdBQUdDLGFBQWEsQ0FBQ0wsV0FBRCxFQUFjRSxZQUFkLENBQTNCOztBQUNBLFFBQUlFLEtBQUosRUFBVztBQUNQLFVBQU1FLEtBQUssR0FBR0MsVUFBVSxDQUFDSCxLQUFELEVBQVEsT0FBUixDQUF4QjtBQUNBRyxNQUFBQSxVQUFVLENBQUNELEtBQUQsRUFBUSxRQUFSLENBQVYsQ0FBNEJKLFlBQTVCLElBQTRDQyxLQUE1QztBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7Ozs7QUFTTyxXQUFTSywwQkFBVCxDQUE2Q04sWUFBN0MsRUFBc0c7QUFDekcsV0FBTyxVQUFDQyxLQUFELEVBQW1CO0FBQ3RCLGFBQU8sVUFBNkJILFdBQTdCLEVBQXdEO0FBQzNEQyxRQUFBQSx3QkFBd0IsQ0FBQ0QsV0FBRCxFQUFjRSxZQUFkLEVBQTRCQyxLQUE1QixDQUF4QjtBQUNILE9BRkQ7QUFHSCxLQUpEO0FBS0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFZTyxXQUFTTSw2QkFBVCxDQUFnRFAsWUFBaEQsRUFBc0VRLFlBQXRFLEVBQTZGO0FBQ2hHLFdBQU9kLHVCQUF1QixDQUFTLFVBQUNJLFdBQUQsRUFBY1csY0FBZCxFQUEwQztBQUM3RVYsTUFBQUEsd0JBQXdCLENBQUNELFdBQUQsRUFBY0UsWUFBZCxFQUE2QlEsWUFBWSxLQUFLRSxTQUFsQixHQUErQkYsWUFBL0IsR0FBOENDLGNBQTFFLENBQXhCO0FBQ0gsS0FGNkIsQ0FBOUI7QUFHSCxHLENBRUQ7OztBQUNPLE1BQU1FLFNBQVMsR0FBRyxrQkFBbEI7OztBQUVBLFdBQVNSLGFBQVQsQ0FBd0JTLElBQXhCLEVBQThCQyxhQUE5QixFQUE4QztBQUNqRCxRQUFJQyx5QkFBT0MsZUFBUUMsVUFBUixDQUFtQkosSUFBbkIsQ0FBWCxFQUFxQztBQUNqQyx3QkFBTSxvREFBTixFQUE0REMsYUFBNUQsRUFBMkVJLE9BQUdDLFlBQUgsQ0FBZ0JOLElBQWhCLENBQTNFO0FBQ0EsYUFBTyxJQUFQO0FBQ0g7O0FBQ0QsV0FBT1AsVUFBVSxDQUFDTyxJQUFELEVBQU9ELFNBQVAsQ0FBakI7QUFDSDs7QUFFTSxXQUFTTixVQUFULENBQXFCYyxHQUFyQixFQUEwQkMsR0FBMUIsRUFBK0I7QUFDbEMsV0FBT0QsR0FBRyxDQUFDQyxHQUFELENBQUgsS0FBYUQsR0FBRyxDQUFDQyxHQUFELENBQUgsR0FBVyxFQUF4QixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGRlY29yYXRvclxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuLi9jbGFzcyc7XHJcbmltcG9ydCB7IERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGVycm9yIH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uLy4uL3V0aWxzL2pzJztcclxuXHJcbmV4cG9ydCB0eXBlIEJhYmVsUHJvcGVydHlEZWNvcmF0b3JEZXNjcmlwdG9yID0gUHJvcGVydHlEZXNjcmlwdG9yICYgeyBpbml0aWFsaXplcj86IGFueSB9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgc2lnbmF0dXJlIGNvbXBhdGlibGUgd2l0aCBib3RoIFR5cGVTY3JpcHQgbGVnYWN5IGRlY29yYXRvciBhbmQgQmFiZWwgbGVnYWN5IGRlY29yYXRvci5cclxuICogVGhlIGBkZXNjcmlwdG9yYCBhcmd1bWVudCB3aWxsIG9ubHkgYXBwZWFyIGluIEJhYmVsIGNhc2UuXHJcbiAqIEB6aFxyXG4gKiDor6Xnrb7lkI3lkIzml7blhbzlrrkgVHlwZVNjcmlwdCBsZWdhY3kg6KOF6aWw5Zmo5Lul5Y+KIEJhYmVsIGxlZ2FjeSDoo4XppbDlmajjgIJcclxuICogYGRlc2NyaXB0b3JgIOWPguaVsOWPquS8muWcqCBCYWJlbCDmg4XlhrXkuIvlh7rnjrDjgIJcclxuICovXHJcbmV4cG9ydCB0eXBlIExlZ2FjeVByb3BlcnR5RGVjb3JhdG9yID0gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBkZXNjcmlwdG9yPzogQmFiZWxQcm9wZXJ0eURlY29yYXRvckRlc2NyaXB0b3IpID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEgY2xhc3Mob3IgcHJvcGVydHkpIGRlY29yYXRvciB3aGljaCBkb2VzIG5vdGhpbmcuXHJcbiAqIEB6aFxyXG4gKiDkuIDkuKrku4DkuYjkuZ/kuI3lgZrnmoTnsbvvvIjmiJblsZ7mgKfvvInoo4XppbDlmajjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBlbXB0eURlY29yYXRvcjogQ2xhc3NEZWNvcmF0b3IgJiBMZWdhY3lQcm9wZXJ0eURlY29yYXRvciA9ICgpID0+IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBBIGZ1bmN0aW9uIHdoaWNoIGlnbm9yZSBhbGwgYXJndW1lbnRzIGFuZCByZXR1cm4gdGhlIGBlbXB0eURlY29yYXRvcmAuXHJcbiAqIEB6aFxyXG4gKiDkuIDkuKrlv73nlaXmiYDmnInlj4LmlbDlubbkuJTov5Tlm54gYGVtcHR5RGVjb3JhdG9yYCDnmoTlh73mlbDjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBlbXB0eURlY29yYXRvckZuID0gKCkgPT4gZW1wdHlEZWNvcmF0b3I7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEFjdHMgbGlrZSBgZW1wdHlEZWNvcmF0b3JgIGlmIGNhbGxlZCBpbiBmb3JtIG9mIGBAeGA7XHJcbiAqIGFjdHMgbGlrZSBgZW1wdHlEZWNvcmF0b3JGbmAgaWYgY2FsbGVkIGluIGZvcm0gb2YgYEB4KC4uLmFyZ3MpYC5cclxuICogQHpoXHJcbiAqIOW9k+S7pSBgQHhgIOW9ouW8j+iwg+eUqOaXtuihqOeOsOWmguWQjCBgZW1wdHlEZWNvcmF0b3Jg77yM5b2T5LulIGBAeCguLi5hcmdzKWAg5b2i5byP6LCD55So5pe26KGo546w5aaC5ZCMIGBlbXB0eURlY29yYXRvckZuYOOAglxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGVtcHR5U21hcnRDbGFzc0RlY29yYXRvciA9IG1ha2VTbWFydENsYXNzRGVjb3JhdG9yKCgpID0+IHt9KTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTWFrZSBhIHNtYXJ0IGNsYXNzIGRlY29yYXRvciB3aGljaCBjYW4gcHJvcGVybHkgaGFuZGxlIHRoZSBmb2xsb3dpbmcgZm9ybSBkZWNvcmF0b3Igc3ludGF4OlxyXG4gKiAtIGBAeGBcclxuICogLSBgQHgoYXJnMClgXHJcbiAqIFxyXG4gKiBhbmQgZm9yd2FyZCBib3RoIHRoZSBkZWNvcmF0ZWQgY2xhc3MgYW5kIHRoZSBgYXJnMGAgKGluIGZpcnN0IGZvcm0sIGBhcmcwYCBpcyBmb3J3YXJkIGFzIGB1bmRlZmluZWRgKSB0b1xyXG4gKiBgZGVjb3JhdGVgLlxyXG4gKiBAemhcclxuICog5Yib5bu65LiA5Liq5pm66IO957G76KOF6aWw5Zmo77yM5a6D6IO95q2j56Gu5Zyw5aSE55CG5Lul5LiL5b2i5byP55qE6KOF6aWw5Zmo6K+t5rOV77yaXHJcbiAqIC0gYEB4YFxyXG4gKiAtIGBAeChhcmcwKWBcclxuICogXHJcbiAqIOW5tuS4lO+8jOWwhuiiq+ijhemlsOeahOexu+WSjCBgYXJnMGDvvIjoi6XmmK/nrKzkuIDnp43lvaLlvI/vvIxgYXJnMGAg5bCx5pivIGB1bmRlZmluZWRg77yJ5LiA6LW36L2s5Y+R57uZIGBkZWNvcmF0ZWDjgIJcclxuICogQHBhcmFtIGRlY29yYXRlIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VTbWFydENsYXNzRGVjb3JhdG9yPFRBcmc+IChcclxuICAgIGRlY29yYXRlOiA8VEZ1bmN0aW9uIGV4dGVuZHMgRnVuY3Rpb24+KGNvbnN0cnVjdG9yOiBURnVuY3Rpb24sIGFyZz86IFRBcmcpID0+IFJldHVyblR5cGU8Q2xhc3NEZWNvcmF0b3I+LFxyXG4pOiBDbGFzc0RlY29yYXRvciAmICgoYXJnPzogVEFyZykgPT4gQ2xhc3NEZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBwcm94eUZuO1xyXG4gICAgZnVuY3Rpb24gcHJveHlGbiguLi5hcmdzOiBQYXJhbWV0ZXJzPENsYXNzRGVjb3JhdG9yPik6IFJldHVyblR5cGU8Q2xhc3NEZWNvcmF0b3I+O1xyXG4gICAgZnVuY3Rpb24gcHJveHlGbihhcmc/OiBUQXJnKTogQ2xhc3NEZWNvcmF0b3I7XHJcbiAgICBmdW5jdGlvbiBwcm94eUZuICh0YXJnZXQ/OiBQYXJhbWV0ZXJzPENsYXNzRGVjb3JhdG9yPlswXSB8IFRBcmcpOiBSZXR1cm5UeXBlPENsYXNzRGVjb3JhdG9yPiB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgLy8gSWYgbm8gcGFyYW1ldGVyIHNwZWNpZmllZFxyXG4gICAgICAgICAgICByZXR1cm4gZGVjb3JhdGUodGFyZ2V0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gPFRGdW5jdGlvbiBleHRlbmRzIEZ1bmN0aW9uPiAoY29uc3RydWN0b3I6IFRGdW5jdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlKGNvbnN0cnVjdG9yLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVFZGl0b3JDbGFzc1Byb3BlcnR5PFRWYWx1ZT4gKGNvbnN0cnVjdG9yOiBGdW5jdGlvbiwgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHZhbHVlOiBUVmFsdWUpIHtcclxuICAgIGNvbnN0IGNhY2hlID0gZ2V0Q2xhc3NDYWNoZShjb25zdHJ1Y3RvciwgcHJvcGVydHlOYW1lKTtcclxuICAgIGlmIChjYWNoZSkge1xyXG4gICAgICAgIGNvbnN0IHByb3RvID0gZ2V0U3ViRGljdChjYWNoZSwgJ3Byb3RvJyk7XHJcbiAgICAgICAgZ2V0U3ViRGljdChwcm90bywgJ2VkaXRvcicpW3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBNYWtlIGEgZnVuY3Rpb24gd2hpY2ggYWNjZXB0IGFuIGFyZ3VtZW50IHZhbHVlIGFuZCByZXR1cm4gYSBjbGFzcyBkZWNvcmF0b3IuXHJcbiAqIFRoZSBkZWNvcmF0b3Igc2V0cyB0aGUgZWRpdG9yIHByb3BlcnR5IGBwcm9wZXJ0eU5hbWVgLCBvbiB0aGUgZGVjb3JhdGVkIGNsYXNzLCBpbnRvIHRoYXQgYXJndW1lbnQgdmFsdWUuXHJcbiAqIEB6aFxyXG4gKiDliJvlu7rkuIDkuKrlh73mlbDvvIzor6Xlh73mlbDmjqXlj5fkuIDkuKrlj4LmlbDlgLzlubbov5Tlm57kuIDkuKrnsbvoo4XppbDlmajjgIJcclxuICog6K+l6KOF6aWw5Zmo5bCG6KKr6KOF6aWw57G755qE57yW6L6R5Zmo5bGe5oCnIGBwcm9wZXJ0eU5hbWVgIOiuvue9ruS4uuivpeWPguaVsOeahOWAvOOAglxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lIFRoZSBlZGl0b3IgcHJvcGVydHkuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWFrZUVkaXRvckNsYXNzRGVjb3JhdG9yRm48VFZhbHVlPiAocHJvcGVydHlOYW1lOiBzdHJpbmcpOiAodmFsdWU6IFRWYWx1ZSkgPT4gQ2xhc3NEZWNvcmF0b3Ige1xyXG4gICAgcmV0dXJuICh2YWx1ZTogVFZhbHVlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIDxURnVuY3Rpb24gZXh0ZW5kcyBGdW5jdGlvbj4oY29uc3RydWN0b3I6IFRGdW5jdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB3cml0ZUVkaXRvckNsYXNzUHJvcGVydHkoY29uc3RydWN0b3IsIHByb3BlcnR5TmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG59XHJcblxyXG4vKipcclxuICogTWFrZSBhIHNtYXJ0IGNsYXNzIGRlY29yYXRvci5cclxuICogVGhlIHNtYXJ0IGRlY29yYXRvciBzZXRzIHRoZSBlZGl0b3IgcHJvcGVydHkgYHByb3BlcnR5TmFtZWAsIG9uIHRoZSBkZWNvcmF0ZWQgY2xhc3MsIGludG86XHJcbiAqIC0gYGRlZmF1bHRWYWx1ZWAgaWYgdGhlIGRlY29yYXRvciBpcyBjYWxsZWQgd2l0aCBgQHhgIGZvcm0sIG9yXHJcbiAqIC0gdGhlIGFyZ3VtZW50IGlmIHRoZSBkZWNvcmF0b3IgaXMgY2FsbGVkIHdpdGggYW4gYXJndW1lbnQsIGVnLCB0aGUgYEB4KGFyZzApYCBmb3JtLlxyXG4gKiBAemhcclxuICog5Yib5bu65LiA5Liq5pm66IO957G76KOF6aWw5Zmo44CCXHJcbiAqIOivpeaZuuiDveexu+ijhemlsOWZqOWwhuagueaNruS7peS4i+aDheWGteadpeiuvue9ruiiq+ijhemlsOexu+eahOe8lui+keWZqOWxnuaApyBgcHJvcGVydHlOYW1lYO+8mlxyXG4gKiAtIOWmguaenOivpeijhemlsOWZqOaYr+S7pSBgQHhgIOW9ouW8j+iwg+eUqOeahO+8jOivpeWxnuaAp+Wwhuiiq+iuvue9ruS4uiBgZGVmYXVsdFZhbHVlYOOAglxyXG4gKiAtIOWmguaenOivpeijhemlsOWZqOaYr+S7peS4gOS4quWPguaVsOeahOW9ouW8j++8jOWNsyBgQHgoYXJnMClgIOeahOW9ouW8j+iwg+eUqOeahO+8jOivpeWxnuaAp+Wwhuiiq+iuvue9ruS4uuS8oOWFpeeahOWPguaVsOWAvOOAglxyXG4gKiBAcGFyYW0gcHJvcGVydHlOYW1lIFRoZSBlZGl0b3IgcHJvcGVydHkuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbWFrZVNtYXJ0RWRpdG9yQ2xhc3NEZWNvcmF0b3I8VFZhbHVlPiAocHJvcGVydHlOYW1lOiBzdHJpbmcsIGRlZmF1bHRWYWx1ZT86IFRWYWx1ZSkge1xyXG4gICAgcmV0dXJuIG1ha2VTbWFydENsYXNzRGVjb3JhdG9yPFRWYWx1ZT4oKGNvbnN0cnVjdG9yLCBkZWNvcmF0ZWRWYWx1ZT86IFRWYWx1ZSkgPT4ge1xyXG4gICAgICAgIHdyaXRlRWRpdG9yQ2xhc3NQcm9wZXJ0eShjb25zdHJ1Y3RvciwgcHJvcGVydHlOYW1lLCAoZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpID8gZGVmYXVsdFZhbHVlIDogZGVjb3JhdGVkVmFsdWUpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8vIGNhY2hlcyBmb3IgY2xhc3MgY29uc3RydWN0aW9uXHJcbmV4cG9ydCBjb25zdCBDQUNIRV9LRVkgPSAnX19jY2NsYXNzQ2FjaGVfXyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3NDYWNoZSAoY3RvciwgZGVjb3JhdG9yTmFtZT8pIHtcclxuICAgIGlmIChERVYgJiYgQ0NDbGFzcy5faXNDQ0NsYXNzKGN0b3IpKSB7XHJcbiAgICAgICAgZXJyb3IoJ2BAJXNgIHNob3VsZCBiZSB1c2VkIGFmdGVyIEBjY2NsYXNzIGZvciBjbGFzcyBcIiVzXCInLCBkZWNvcmF0b3JOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGdldFN1YkRpY3QoY3RvciwgQ0FDSEVfS0VZKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN1YkRpY3QgKG9iaiwga2V5KSB7XHJcbiAgICByZXR1cm4gb2JqW2tleV0gfHwgKG9ialtrZXldID0ge30pO1xyXG59XHJcbiJdfQ==