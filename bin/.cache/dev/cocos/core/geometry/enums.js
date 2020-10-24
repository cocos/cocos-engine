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
    global.enums = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  /**
   * 几何工具模块
   * @category geometry
   */

  /**
   * @en
   * The enum type of basic geometry.
   * @zh
   * 形状的类型值。
   */
  var _default = {
    SHAPE_RAY: 1 << 0,
    SHAPE_LINE: 1 << 1,
    SHAPE_SPHERE: 1 << 2,
    SHAPE_AABB: 1 << 3,
    SHAPE_OBB: 1 << 4,
    SHAPE_PLANE: 1 << 5,
    SHAPE_TRIANGLE: 1 << 6,
    SHAPE_FRUSTUM: 1 << 7,
    SHAPE_FRUSTUM_ACCURATE: 1 << 8,
    SHAPE_CAPSULE: 1 << 9
  };
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvZW51bXMudHMiXSwibmFtZXMiOlsiU0hBUEVfUkFZIiwiU0hBUEVfTElORSIsIlNIQVBFX1NQSEVSRSIsIlNIQVBFX0FBQkIiLCJTSEFQRV9PQkIiLCJTSEFQRV9QTEFORSIsIlNIQVBFX1RSSUFOR0xFIiwiU0hBUEVfRlJVU1RVTSIsIlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEUiLCJTSEFQRV9DQVBTVUxFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7OztBQUtBOzs7Ozs7aUJBTWU7QUFDYkEsSUFBQUEsU0FBUyxFQUFHLEtBQUssQ0FESjtBQUViQyxJQUFBQSxVQUFVLEVBQUcsS0FBSyxDQUZMO0FBR2JDLElBQUFBLFlBQVksRUFBRyxLQUFLLENBSFA7QUFJYkMsSUFBQUEsVUFBVSxFQUFHLEtBQUssQ0FKTDtBQUtiQyxJQUFBQSxTQUFTLEVBQUcsS0FBSyxDQUxKO0FBTWJDLElBQUFBLFdBQVcsRUFBRyxLQUFLLENBTk47QUFPYkMsSUFBQUEsY0FBYyxFQUFHLEtBQUssQ0FQVDtBQVFiQyxJQUFBQSxhQUFhLEVBQUcsS0FBSyxDQVJSO0FBU2JDLElBQUFBLHNCQUFzQixFQUFHLEtBQUssQ0FUakI7QUFVYkMsSUFBQUEsYUFBYSxFQUFHLEtBQUs7QUFWUixHIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOWHoOS9leW3peWFt+aooeWdl1xyXG4gKiBAY2F0ZWdvcnkgZ2VvbWV0cnlcclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBlbnVtIHR5cGUgb2YgYmFzaWMgZ2VvbWV0cnkuXHJcbiAqIEB6aFxyXG4gKiDlvaLnirbnmoTnsbvlnovlgLzjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBTSEFQRV9SQVk6ICgxIDw8IDApLFxyXG4gIFNIQVBFX0xJTkU6ICgxIDw8IDEpLFxyXG4gIFNIQVBFX1NQSEVSRTogKDEgPDwgMiksXHJcbiAgU0hBUEVfQUFCQjogKDEgPDwgMyksXHJcbiAgU0hBUEVfT0JCOiAoMSA8PCA0KSxcclxuICBTSEFQRV9QTEFORTogKDEgPDwgNSksXHJcbiAgU0hBUEVfVFJJQU5HTEU6ICgxIDw8IDYpLFxyXG4gIFNIQVBFX0ZSVVNUVU06ICgxIDw8IDcpLFxyXG4gIFNIQVBFX0ZSVVNUVU1fQUNDVVJBVEU6ICgxIDw8IDgpLFxyXG4gIFNIQVBFX0NBUFNVTEU6ICgxIDw8IDkpLFxyXG59O1xyXG4iXX0=