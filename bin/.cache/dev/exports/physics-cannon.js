(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["@cocos/cannon", "../cocos/physics/cannon/instantiate.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(require("@cocos/cannon"), require("../cocos/physics/cannon/instantiate.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.cannon, global.instantiate);
    global.physicsCannon = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_cannon, _instantiate) {
  "use strict";

  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @hidden
   */
  if (window) window.CANNON = _cannon.default; // polyfill config

  _cannon.default['CC_CONFIG'] = {
    'numSegmentsCone': 12,
    'numSegmentsCylinder': 12,
    'ignoreSelfBody': true
  }; // overwrite

  _cannon.default.ArrayCollisionMatrix.prototype.reset = function () {
    for (var key in this.matrix) {
      delete this.matrix[key];
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvcGh5c2ljcy1jYW5ub24udHMiXSwibmFtZXMiOlsid2luZG93IiwiQ0FOTk9OIiwiQXJyYXlDb2xsaXNpb25NYXRyaXgiLCJwcm90b3R5cGUiLCJyZXNldCIsImtleSIsIm1hdHJpeCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFLQSxNQUFJQSxNQUFKLEVBQVlBLE1BQU0sQ0FBQ0MsTUFBUCxHQUFnQkEsZUFBaEIsQyxDQUVaOztBQUNBQSxrQkFBTyxXQUFQLElBQXNCO0FBQ2xCLHVCQUFtQixFQUREO0FBRWxCLDJCQUF1QixFQUZMO0FBR2xCLHNCQUFrQjtBQUhBLEdBQXRCLEMsQ0FNQTs7QUFDQUEsa0JBQU9DLG9CQUFQLENBQTRCQyxTQUE1QixDQUFzQ0MsS0FBdEMsR0FBOEMsWUFBWTtBQUN0RCxTQUFLLElBQUlDLEdBQVQsSUFBZ0IsS0FBS0MsTUFBckIsRUFBNkI7QUFDekIsYUFBTyxLQUFLQSxNQUFMLENBQVlELEdBQVosQ0FBUDtBQUNIO0FBQ0osR0FKRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaWYgKHdpbmRvdykgd2luZG93LkNBTk5PTiA9IENBTk5PTjtcclxuXHJcbi8vIHBvbHlmaWxsIGNvbmZpZ1xyXG5DQU5OT05bJ0NDX0NPTkZJRyddID0ge1xyXG4gICAgJ251bVNlZ21lbnRzQ29uZSc6IDEyLFxyXG4gICAgJ251bVNlZ21lbnRzQ3lsaW5kZXInOiAxMixcclxuICAgICdpZ25vcmVTZWxmQm9keSc6IHRydWUsXHJcbn1cclxuXHJcbi8vIG92ZXJ3cml0ZVxyXG5DQU5OT04uQXJyYXlDb2xsaXNpb25NYXRyaXgucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMubWF0cml4KSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubWF0cml4W2tleV07XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5pbXBvcnQgJy4uL2NvY29zL3BoeXNpY3MvY2Fubm9uL2luc3RhbnRpYXRlJzsiXX0=