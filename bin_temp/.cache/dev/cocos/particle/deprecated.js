(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/utils/deprecated.js", "./burst.js", "./particle-system.js", "./billboard.js", "./line.js", "../core/utils/js.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/utils/deprecated.js"), require("./burst.js"), require("./particle-system.js"), require("./billboard.js"), require("./line.js"), require("../core/utils/js.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.deprecated, global.burst, global.particleSystem, global.billboard, global.line, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _deprecated, _burst, _particleSystem, _billboard, _line, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "ParticleSystemComponent", {
    enumerable: true,
    get: function () {
      return _particleSystem.ParticleSystem;
    }
  });
  Object.defineProperty(_exports, "BillboardComponent", {
    enumerable: true,
    get: function () {
      return _billboard.Billboard;
    }
  });
  Object.defineProperty(_exports, "LineComponent", {
    enumerable: true,
    get: function () {
      return _line.Line;
    }
  });
  _burst = _interopRequireDefault(_burst);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @category particle
   */
  (0, _deprecated.removeProperty)(_burst.default.prototype, 'Burst.prototype', [{
    'name': 'minCount'
  }, {
    'name': 'maxCount'
  }]);
  /**
   * Alias of [[ParticleSystem]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.ParticleSystemComponent = _particleSystem.ParticleSystem;

  _js.js.setClassAlias(_particleSystem.ParticleSystem, 'cc.ParticleSystemComponent');
  /**
   * Alias of [[Billboard]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.BillboardComponent = _billboard.Billboard;

  _js.js.setClassAlias(_billboard.Billboard, 'cc.BillboardComponent');
  /**
   * Alias of [[Line]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.LineComponent = _line.Line;

  _js.js.setClassAlias(_line.Line, 'cc.LineComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiQnVyc3QiLCJwcm90b3R5cGUiLCJsZWdhY3lDQyIsIlBhcnRpY2xlU3lzdGVtQ29tcG9uZW50IiwiUGFydGljbGVTeXN0ZW0iLCJqcyIsInNldENsYXNzQWxpYXMiLCJCaWxsYm9hcmRDb21wb25lbnQiLCJCaWxsYm9hcmQiLCJMaW5lQ29tcG9uZW50IiwiTGluZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFZQSxrQ0FBZUEsZUFBTUMsU0FBckIsRUFBZ0MsaUJBQWhDLEVBQW1ELENBQy9DO0FBQ0ksWUFBUTtBQURaLEdBRCtDLEVBSS9DO0FBQ0ksWUFBUTtBQURaLEdBSitDLENBQW5EO0FBU0E7Ozs7O0FBS0FDLDBCQUFTQyx1QkFBVCxHQUFtQ0MsOEJBQW5DOztBQUNBQyxTQUFHQyxhQUFILENBQWlCRiw4QkFBakIsRUFBaUMsNEJBQWpDO0FBQ0E7Ozs7OztBQUtBRiwwQkFBU0ssa0JBQVQsR0FBOEJDLG9CQUE5Qjs7QUFDQUgsU0FBR0MsYUFBSCxDQUFpQkUsb0JBQWpCLEVBQTRCLHVCQUE1QjtBQUNBOzs7Ozs7QUFLQU4sMEJBQVNPLGFBQVQsR0FBeUJDLFVBQXpCOztBQUNBTCxTQUFHQyxhQUFILENBQWlCSSxVQUFqQixFQUF1QixrQkFBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBhcnRpY2xlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgcmVtb3ZlUHJvcGVydHkgfSBmcm9tICcuLi9jb3JlL3V0aWxzL2RlcHJlY2F0ZWQnO1xyXG5pbXBvcnQgQnVyc3QgZnJvbSAnLi9idXJzdCc7XHJcbmltcG9ydCB7IFBhcnRpY2xlU3lzdGVtIH0gZnJvbSAnLi9wYXJ0aWNsZS1zeXN0ZW0nO1xyXG5pbXBvcnQgeyBCaWxsYm9hcmQgfSBmcm9tICcuL2JpbGxib2FyZCc7XHJcbmltcG9ydCB7IExpbmUgfSBmcm9tICcuL2xpbmUnO1xyXG5pbXBvcnQgeyBqcyB9IGZyb20gJy4uL2NvcmUvdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoQnVyc3QucHJvdG90eXBlLCAnQnVyc3QucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ21pbkNvdW50J1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdtYXhDb3VudCcsXHJcbiAgICB9XHJcbl0pO1xyXG5cclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbUGFydGljbGVTeXN0ZW1dXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBQYXJ0aWNsZVN5c3RlbSBhcyBQYXJ0aWNsZVN5c3RlbUNvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5QYXJ0aWNsZVN5c3RlbUNvbXBvbmVudCA9IFBhcnRpY2xlU3lzdGVtO1xyXG5qcy5zZXRDbGFzc0FsaWFzKFBhcnRpY2xlU3lzdGVtLCAnY2MuUGFydGljbGVTeXN0ZW1Db21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbQmlsbGJvYXJkXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgQmlsbGJvYXJkIGFzIEJpbGxib2FyZENvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5CaWxsYm9hcmRDb21wb25lbnQgPSBCaWxsYm9hcmQ7XHJcbmpzLnNldENsYXNzQWxpYXMoQmlsbGJvYXJkLCAnY2MuQmlsbGJvYXJkQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW0xpbmVdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBMaW5lIGFzIExpbmVDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuTGluZUNvbXBvbmVudCA9IExpbmU7XHJcbmpzLnNldENsYXNzQWxpYXMoTGluZSwgJ2NjLkxpbmVDb21wb25lbnQnKTtcclxuIl19