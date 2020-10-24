(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/index.js", "./actions/action-manager.js", "../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/index.js"), require("./actions/action-manager.js"), require("../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.actionManager, global.defaultConstants);
    global.tweenSystem = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _actionManager, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TweenSystem = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  /**
   * @en 
   * Tween system.
   * @zh
   * 缓动系统。
   */
  var TweenSystem = /*#__PURE__*/function (_System) {
    _inherits(TweenSystem, _System);

    function TweenSystem() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, TweenSystem);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TweenSystem)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.actionMgr = new _actionManager.ActionManager();
      return _this;
    }

    _createClass(TweenSystem, [{
      key: "postUpdate",

      /**
       * @en
       * The postUpdate will auto execute after all compnents update and lateUpdate.
       * @zh
       * 此方法会在组件 lateUpdate 之后自动执行。
       * @param dt 间隔时间
       */
      value: function postUpdate(dt) {
        if (!_defaultConstants.EDITOR || this._executeInEditMode) {
          this.actionMgr.update(dt);
        }
      }
    }, {
      key: "ActionManager",

      /**
       * @en
       * Gets the action manager.
       * @zh
       * 获取动作管理器。
       */
      get: function get() {
        return this.actionMgr;
      }
    }]);

    return TweenSystem;
  }(_index.System);

  _exports.TweenSystem = TweenSystem;
  TweenSystem.ID = 'TWEEN';
  TweenSystem.instance = void 0;

  _index.director.on(_index.Director.EVENT_INIT, function () {
    var sys = new TweenSystem();
    TweenSystem.instance = sys;

    _index.director.registerSystem(TweenSystem.ID, sys, 100);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3R3ZWVuL3R3ZWVuLXN5c3RlbS50cyJdLCJuYW1lcyI6WyJUd2VlblN5c3RlbSIsImFjdGlvbk1nciIsIkFjdGlvbk1hbmFnZXIiLCJkdCIsIkVESVRPUiIsIl9leGVjdXRlSW5FZGl0TW9kZSIsInVwZGF0ZSIsIlN5c3RlbSIsIklEIiwiaW5zdGFuY2UiLCJkaXJlY3RvciIsIm9uIiwiRGlyZWN0b3IiLCJFVkVOVF9JTklUIiwic3lzIiwicmVnaXN0ZXJTeXN0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUE7Ozs7OztNQU1hQSxXOzs7Ozs7Ozs7Ozs7Ozs7WUE0QlFDLFMsR0FBWSxJQUFJQyw0QkFBSixFOzs7Ozs7O0FBRTdCOzs7Ozs7O2lDQU9ZQyxFLEVBQVk7QUFDcEIsWUFBSSxDQUFDQyx3QkFBRCxJQUFXLEtBQUtDLGtCQUFwQixFQUF3QztBQUNwQyxlQUFLSixTQUFMLENBQWVLLE1BQWYsQ0FBc0JILEVBQXRCO0FBQ0g7QUFDSjs7OztBQXZCRDs7Ozs7OzBCQU1xQjtBQUNqQixlQUFPLEtBQUtGLFNBQVo7QUFDSDs7OztJQTFCNEJNLGE7OztBQUFwQlAsRUFBQUEsVyxDQVFPUSxFLEdBQUssTztBQVJaUixFQUFBQSxXLENBZ0JPUyxROztBQTRCcEJDLGtCQUFTQyxFQUFULENBQVlDLGdCQUFTQyxVQUFyQixFQUFpQyxZQUFZO0FBQ3pDLFFBQUlDLEdBQUcsR0FBRyxJQUFJZCxXQUFKLEVBQVY7QUFDQ0EsSUFBQUEsV0FBVyxDQUFDUyxRQUFiLEdBQWdDSyxHQUFoQzs7QUFDQUosb0JBQVNLLGNBQVQsQ0FBd0JmLFdBQVcsQ0FBQ1EsRUFBcEMsRUFBd0NNLEdBQXhDLEVBQTZDLEdBQTdDO0FBQ0gsR0FKRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgdHdlZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBTeXN0ZW0sIERpcmVjdG9yLCBkaXJlY3RvciB9IGZyb20gXCIuLi9jb3JlXCI7XHJcbmltcG9ydCB7IEFjdGlvbk1hbmFnZXIgfSBmcm9tIFwiLi9hY3Rpb25zL2FjdGlvbi1tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG4vKipcclxuICogQGVuIFxyXG4gKiBUd2VlbiBzeXN0ZW0uXHJcbiAqIEB6aFxyXG4gKiDnvJPliqjns7vnu5/jgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUd2VlblN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgSUQgZmxhZyBvZiB0aGUgc3lzdGVtLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmraTns7vnu5/nmoQgSUQg5qCH6K6w44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWFkb25seSBJRCA9ICdUV0VFTic7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIGluc3RhbmNlIG9mIHRoZSB0d2VlbiBzeXN0ZW0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPlue8k+WKqOezu+e7n+eahOWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVhZG9ubHkgaW5zdGFuY2U6IFR3ZWVuU3lzdGVtO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBhY3Rpb24gbWFuYWdlci5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5Yqo5L2c566h55CG5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBBY3Rpb25NYW5hZ2VyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hY3Rpb25NZ3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBhY3Rpb25NZ3IgPSBuZXcgQWN0aW9uTWFuYWdlcigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgcG9zdFVwZGF0ZSB3aWxsIGF1dG8gZXhlY3V0ZSBhZnRlciBhbGwgY29tcG5lbnRzIHVwZGF0ZSBhbmQgbGF0ZVVwZGF0ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5q2k5pa55rOV5Lya5Zyo57uE5Lu2IGxhdGVVcGRhdGUg5LmL5ZCO6Ieq5Yqo5omn6KGM44CCXHJcbiAgICAgKiBAcGFyYW0gZHQg6Ze06ZqU5pe26Ze0XHJcbiAgICAgKi9cclxuICAgIHBvc3RVcGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIUVESVRPUiB8fCB0aGlzLl9leGVjdXRlSW5FZGl0TW9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbk1nci51cGRhdGUoZHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZGlyZWN0b3Iub24oRGlyZWN0b3IuRVZFTlRfSU5JVCwgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHN5cyA9IG5ldyBUd2VlblN5c3RlbSgpO1xyXG4gICAgKFR3ZWVuU3lzdGVtLmluc3RhbmNlIGFzIGFueSkgPSBzeXM7XHJcbiAgICBkaXJlY3Rvci5yZWdpc3RlclN5c3RlbShUd2VlblN5c3RlbS5JRCwgc3lzLCAxMDApO1xyXG59KTsiXX0=