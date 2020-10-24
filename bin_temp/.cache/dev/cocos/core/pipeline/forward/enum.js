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
    global._enum = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ForwardFlowPriority = _exports.ForwardStagePriority = void 0;

  /**
   * @category pipeline
   */

  /**
   * @zh 前向阶段优先级。
   * @en The priority of stage in forward rendering
   */
  var ForwardStagePriority;
  /**
   * @zh 前向渲染流程优先级。
   * @en The priority of flows in forward rendering
   */

  _exports.ForwardStagePriority = ForwardStagePriority;

  (function (ForwardStagePriority) {
    ForwardStagePriority[ForwardStagePriority["FORWARD"] = 10] = "FORWARD";
    ForwardStagePriority[ForwardStagePriority["UI"] = 20] = "UI";
  })(ForwardStagePriority || (_exports.ForwardStagePriority = ForwardStagePriority = {}));

  var ForwardFlowPriority;
  _exports.ForwardFlowPriority = ForwardFlowPriority;

  (function (ForwardFlowPriority) {
    ForwardFlowPriority[ForwardFlowPriority["SHADOW"] = 0] = "SHADOW";
    ForwardFlowPriority[ForwardFlowPriority["FORWARD"] = 1] = "FORWARD";
    ForwardFlowPriority[ForwardFlowPriority["UI"] = 10] = "UI";
  })(ForwardFlowPriority || (_exports.ForwardFlowPriority = ForwardFlowPriority = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZm9yd2FyZC9lbnVtLnRzIl0sIm5hbWVzIjpbIkZvcndhcmRTdGFnZVByaW9yaXR5IiwiRm9yd2FyZEZsb3dQcmlvcml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBOzs7O01BSVlBLG9CO0FBS1o7Ozs7Ozs7YUFMWUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7S0FBQUEsb0IscUNBQUFBLG9COztNQVNBQyxtQjs7O2FBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0tBQUFBLG1CLG9DQUFBQSxtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG4vKipcclxuICogQHpoIOWJjeWQkemYtuauteS8mOWFiOe6p+OAglxyXG4gKiBAZW4gVGhlIHByaW9yaXR5IG9mIHN0YWdlIGluIGZvcndhcmQgcmVuZGVyaW5nXHJcbiAqL1xyXG5leHBvcnQgZW51bSBGb3J3YXJkU3RhZ2VQcmlvcml0eSB7XHJcbiAgICBGT1JXQVJEID0gMTAsXHJcbiAgICBVSSA9IDIwXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemgg5YmN5ZCR5riy5p+T5rWB56iL5LyY5YWI57qn44CCXHJcbiAqIEBlbiBUaGUgcHJpb3JpdHkgb2YgZmxvd3MgaW4gZm9yd2FyZCByZW5kZXJpbmdcclxuICovXHJcbmV4cG9ydCBlbnVtIEZvcndhcmRGbG93UHJpb3JpdHkge1xyXG4gICAgU0hBRE9XID0gMCxcclxuICAgIEZPUldBUkQgPSAxLFxyXG4gICAgVUkgPSAxMCxcclxufVxyXG4iXX0=