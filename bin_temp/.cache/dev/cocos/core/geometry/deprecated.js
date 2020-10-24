(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["../utils/deprecated.js", "./line.js", "./intersect.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("../utils/deprecated.js"), require("./line.js"), require("./intersect.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.deprecated, global.line, global.intersect);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_deprecated, _line, _intersect) {
  "use strict";

  _line = _interopRequireDefault(_line);
  _intersect = _interopRequireDefault(_intersect);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @hidden
   */
  (0, _deprecated.replaceProperty)(_line.default.prototype, 'line', [{
    name: 'mag',
    newName: 'len'
  }, {
    name: 'magnitude',
    newName: 'len'
  }]);
  (0, _deprecated.removeProperty)(_intersect.default, 'intersect', [{
    name: 'line_quad'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvZGVwcmVjYXRlZC50cyJdLCJuYW1lcyI6WyJsaW5lIiwicHJvdG90eXBlIiwibmFtZSIsIm5ld05hbWUiLCJpbnRlcnNlY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQVFBLG1DQUFnQkEsY0FBS0MsU0FBckIsRUFBZ0MsTUFBaEMsRUFBd0MsQ0FDcEM7QUFDSUMsSUFBQUEsSUFBSSxFQUFFLEtBRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FEb0MsRUFLcEM7QUFDSUQsSUFBQUEsSUFBSSxFQUFFLFdBRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FMb0MsQ0FBeEM7QUFXQSxrQ0FBZUMsa0JBQWYsRUFBMEIsV0FBMUIsRUFBdUMsQ0FDbkM7QUFDSUYsSUFBQUEsSUFBSSxFQUFFO0FBRFYsR0FEbUMsQ0FBdkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSwgcmVtb3ZlUHJvcGVydHkgfSBmcm9tICcuLi91dGlscy9kZXByZWNhdGVkJztcclxuaW1wb3J0IGxpbmUgZnJvbSAnLi9saW5lJztcclxuaW1wb3J0IGludGVyc2VjdCBmcm9tICcuL2ludGVyc2VjdCc7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkobGluZS5wcm90b3R5cGUsICdsaW5lJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdtYWcnLFxyXG4gICAgICAgIG5ld05hbWU6ICdsZW4nLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnbWFnbml0dWRlJyxcclxuICAgICAgICBuZXdOYW1lOiAnbGVuJyxcclxuICAgIH0sXHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoaW50ZXJzZWN0LCAnaW50ZXJzZWN0JywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdsaW5lX3F1YWQnXHJcbiAgICB9XHJcbl0pIl19