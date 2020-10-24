(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.util = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setWrap = setWrap;
  _exports.getWrap = getWrap;
  _exports.maxComponent = maxComponent;

  /**
   * @hidden
   */
  function setWrap(object, wrapper) {
    object.__cc_wrapper__ = wrapper;
  }

  function getWrap(object) {
    return object.__cc_wrapper__;
  }

  function maxComponent(v) {
    return Math.max(v.x, Math.max(v.y, v.z));
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL3V0aWwudHMiXSwibmFtZXMiOlsic2V0V3JhcCIsIm9iamVjdCIsIndyYXBwZXIiLCJfX2NjX3dyYXBwZXJfXyIsImdldFdyYXAiLCJtYXhDb21wb25lbnQiLCJ2IiwiTWF0aCIsIm1heCIsIngiLCJ5IiwieiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFVTyxXQUFTQSxPQUFULENBQTJCQyxNQUEzQixFQUF3Q0MsT0FBeEMsRUFBMEQ7QUFDNURELElBQUFBLE1BQUQsQ0FBOEJFLGNBQTlCLEdBQStDRCxPQUEvQztBQUNIOztBQUVNLFdBQVNFLE9BQVQsQ0FBMkJILE1BQTNCLEVBQXdDO0FBQzNDLFdBQVFBLE1BQUQsQ0FBOEJFLGNBQXJDO0FBQ0g7O0FBRU0sV0FBU0UsWUFBVCxDQUF1QkMsQ0FBdkIsRUFBcUM7QUFDeEMsV0FBT0MsSUFBSSxDQUFDQyxHQUFMLENBQVNGLENBQUMsQ0FBQ0csQ0FBWCxFQUFjRixJQUFJLENBQUNDLEdBQUwsQ0FBU0YsQ0FBQyxDQUFDSSxDQUFYLEVBQWNKLENBQUMsQ0FBQ0ssQ0FBaEIsQ0FBZCxDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElWZWMzTGlrZSwgSVF1YXRMaWtlIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuXHJcbmludGVyZmFjZSBJV3JhcHBlZDxUPiB7XHJcbiAgICBfX2NjX3dyYXBwZXJfXzogVDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFdyYXA8V3JhcHBlcj4gKG9iamVjdDogYW55LCB3cmFwcGVyOiBXcmFwcGVyKSB7XHJcbiAgICAob2JqZWN0IGFzIElXcmFwcGVkPFdyYXBwZXI+KS5fX2NjX3dyYXBwZXJfXyA9IHdyYXBwZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRXcmFwPFdyYXBwZXI+IChvYmplY3Q6IGFueSkge1xyXG4gICAgcmV0dXJuIChvYmplY3QgYXMgSVdyYXBwZWQ8V3JhcHBlcj4pLl9fY2Nfd3JhcHBlcl9fO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWF4Q29tcG9uZW50ICh2OiBJVmVjM0xpa2UpIHtcclxuICAgIHJldHVybiBNYXRoLm1heCh2LngsIE1hdGgubWF4KHYueSwgdi56KSk7XHJcbn1cclxuXHJcbiJdfQ==