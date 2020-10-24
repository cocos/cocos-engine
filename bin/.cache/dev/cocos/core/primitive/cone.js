(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./cylinder.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./cylinder.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cylinder);
    global.cone = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cylinder) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = cone;
  _cylinder = _interopRequireDefault(_cylinder);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @category 3d/primitive
   */

  /**
   * @en
   * Generate a cone with radius 0.5, height 1, centered at origin,
   * but may be repositioned through the `center` option.
   * @zh
   * 生成一个圆锥。
   * @param radius 圆锥半径。
   * @param height 圆锥高度。
   * @param opts 圆锥参数选项。
   */
  function cone()
  /* TODO: Explicit since ISSUE https://github.com/microsoft/TypeScript/issues/31280 , changes required once the issue is fixed. */
  {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return (0, _cylinder.default)(0, radius, height, opts);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL2NvbmUudHMiXSwibmFtZXMiOlsiY29uZSIsInJhZGl1cyIsImhlaWdodCIsIm9wdHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFTQTs7Ozs7Ozs7OztBQVVlLFdBQVNBLElBQVQ7QUFJRjtBQUFrSTtBQUFBLFFBSDNJQyxNQUcySSx1RUFIbEksR0FHa0k7QUFBQSxRQUYzSUMsTUFFMkksdUVBRmxJLENBRWtJO0FBQUEsUUFEM0lDLElBQzJJLHVFQURwRyxFQUNvRztBQUMzSSxXQUFPLHVCQUFTLENBQVQsRUFBWUYsTUFBWixFQUFvQkMsTUFBcEIsRUFBNEJDLElBQTVCLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgM2QvcHJpbWl0aXZlXHJcbiAqL1xyXG5cclxuaW1wb3J0IGN5bGluZGVyLCB7IElDeWxpbmRlck9wdGlvbnMgfSBmcm9tICcuL2N5bGluZGVyJztcclxuaW1wb3J0IHsgSUdlb21ldHJ5IH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5cclxudHlwZSBJQ29uZU9wdGlvbnMgPSBJQ3lsaW5kZXJPcHRpb25zO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBHZW5lcmF0ZSBhIGNvbmUgd2l0aCByYWRpdXMgMC41LCBoZWlnaHQgMSwgY2VudGVyZWQgYXQgb3JpZ2luLFxyXG4gKiBidXQgbWF5IGJlIHJlcG9zaXRpb25lZCB0aHJvdWdoIHRoZSBgY2VudGVyYCBvcHRpb24uXHJcbiAqIEB6aFxyXG4gKiDnlJ/miJDkuIDkuKrlnIbplKXjgIJcclxuICogQHBhcmFtIHJhZGl1cyDlnIbplKXljYrlvoTjgIJcclxuICogQHBhcmFtIGhlaWdodCDlnIbplKXpq5jluqbjgIJcclxuICogQHBhcmFtIG9wdHMg5ZyG6ZSl5Y+C5pWw6YCJ6aG544CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25lIChcclxuICAgIHJhZGl1cyA9IDAuNSxcclxuICAgIGhlaWdodCA9IDEsXHJcbiAgICBvcHRzOiBSZWN1cnNpdmVQYXJ0aWFsPElDb25lT3B0aW9ucz4gPSB7fSxcclxuKTogSUdlb21ldHJ5IC8qIFRPRE86IEV4cGxpY2l0IHNpbmNlIElTU1VFIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMzEyODAgLCBjaGFuZ2VzIHJlcXVpcmVkIG9uY2UgdGhlIGlzc3VlIGlzIGZpeGVkLiAqLyB7XHJcbiAgICByZXR1cm4gY3lsaW5kZXIoMCwgcmFkaXVzLCBoZWlnaHQsIG9wdHMpO1xyXG59XHJcbiJdfQ==