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
  _exports.DeferredFlowPriority = _exports.DeferredStagePriority = void 0;

  /**
   * @category pipeline
   */

  /**
   * @zh 前向阶段优先级。
   * @en The priority of stage in forward rendering
   */
  var DeferredStagePriority;
  /**
   * @zh 前向渲染流程优先级。
   * @en The priority of flows in forward rendering
   */

  _exports.DeferredStagePriority = DeferredStagePriority;

  (function (DeferredStagePriority) {
    DeferredStagePriority[DeferredStagePriority["GBUFFER"] = 10] = "GBUFFER";
    DeferredStagePriority[DeferredStagePriority["LIGHTING"] = 15] = "LIGHTING";
    DeferredStagePriority[DeferredStagePriority["TRANSPARENT"] = 18] = "TRANSPARENT";
    DeferredStagePriority[DeferredStagePriority["UI"] = 20] = "UI";
  })(DeferredStagePriority || (_exports.DeferredStagePriority = DeferredStagePriority = {}));

  var DeferredFlowPriority;
  _exports.DeferredFlowPriority = DeferredFlowPriority;

  (function (DeferredFlowPriority) {
    DeferredFlowPriority[DeferredFlowPriority["SHADOW"] = 0] = "SHADOW";
    DeferredFlowPriority[DeferredFlowPriority["GBUFFER"] = 1] = "GBUFFER";
    DeferredFlowPriority[DeferredFlowPriority["LIGHTING"] = 5] = "LIGHTING";
    DeferredFlowPriority[DeferredFlowPriority["UI"] = 10] = "UI";
  })(DeferredFlowPriority || (_exports.DeferredFlowPriority = DeferredFlowPriority = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvZW51bS50cyJdLCJuYW1lcyI6WyJEZWZlcnJlZFN0YWdlUHJpb3JpdHkiLCJEZWZlcnJlZEZsb3dQcmlvcml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUlBOzs7O01BSVlBLHFCO0FBT1o7Ozs7Ozs7YUFQWUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7S0FBQUEscUIsc0NBQUFBLHFCOztNQVdBQyxvQjs7O2FBQUFBLG9CO0FBQUFBLElBQUFBLG9CLENBQUFBLG9CO0FBQUFBLElBQUFBLG9CLENBQUFBLG9CO0FBQUFBLElBQUFBLG9CLENBQUFBLG9CO0FBQUFBLElBQUFBLG9CLENBQUFBLG9CO0tBQUFBLG9CLHFDQUFBQSxvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG4vKipcclxuICogQHpoIOWJjeWQkemYtuauteS8mOWFiOe6p+OAglxyXG4gKiBAZW4gVGhlIHByaW9yaXR5IG9mIHN0YWdlIGluIGZvcndhcmQgcmVuZGVyaW5nXHJcbiAqL1xyXG5leHBvcnQgZW51bSBEZWZlcnJlZFN0YWdlUHJpb3JpdHkge1xyXG4gICAgR0JVRkZFUiA9IDEwLFxyXG4gICAgTElHSFRJTkcgPSAxNSxcclxuICAgIFRSQU5TUEFSRU5UID0gMTgsXHJcbiAgICBVSSA9IDIwXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemgg5YmN5ZCR5riy5p+T5rWB56iL5LyY5YWI57qn44CCXHJcbiAqIEBlbiBUaGUgcHJpb3JpdHkgb2YgZmxvd3MgaW4gZm9yd2FyZCByZW5kZXJpbmdcclxuICovXHJcbmV4cG9ydCBlbnVtIERlZmVycmVkRmxvd1ByaW9yaXR5IHtcclxuICAgIFNIQURPVyA9IDAsXHJcbiAgICBHQlVGRkVSID0gMSxcclxuICAgIExJR0hUSU5HID0gNSxcclxuICAgIFVJID0gMTAsXHJcbn1cclxuIl19