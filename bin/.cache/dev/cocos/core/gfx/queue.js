(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.queue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXQueue = _exports.GFXQueueInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXQueueInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXQueueInfo() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXQueueType.GRAPHICS;

    _classCallCheck(this, GFXQueueInfo);

    this.type = type;
  };
  /**
   * @en GFX Queue.
   * @zh GFX 队列。
   */


  _exports.GFXQueueInfo = GFXQueueInfo;

  var GFXQueue = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXQueue, _GFXObject);

    _createClass(GFXQueue, [{
      key: "type",

      /**
       * @en Get current type.
       * @zh 队列类型。
       */
      get: function get() {
        return this._type;
      }
    }]);

    function GFXQueue(device) {
      var _this;

      _classCallCheck(this, GFXQueue);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXQueue).call(this, _define.GFXObjectType.QUEUE));
      _this._device = void 0;
      _this._type = _define.GFXQueueType.GRAPHICS;
      _this._isAsync = false;
      _this._device = device;
      return _this;
    }

    _createClass(GFXQueue, [{
      key: "isAsync",
      value: function isAsync() {
        return this._isAsync;
      }
      /**
       * @en Submit command buffers.
       * @zh 提交命令缓冲数组。
       * @param cmdBuffs The command buffers to be submitted.
       * @param fence The syncing fence.
       */

    }]);

    return GFXQueue;
  }(_define.GFXObject);

  _exports.GFXQueue = GFXQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3F1ZXVlLnRzIl0sIm5hbWVzIjpbIkdGWFF1ZXVlSW5mbyIsInR5cGUiLCJHRlhRdWV1ZVR5cGUiLCJHUkFQSElDUyIsIkdGWFF1ZXVlIiwiX3R5cGUiLCJkZXZpY2UiLCJHRlhPYmplY3RUeXBlIiwiUVVFVUUiLCJfZGV2aWNlIiwiX2lzQXN5bmMiLCJHRlhPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BU2FBLFksR0FDcUI7QUFFOUIsMEJBRUU7QUFBQSxRQURTQyxJQUNULHVFQUQ4QkMscUJBQWFDLFFBQzNDOztBQUFBOztBQUFBLFNBRFNGLElBQ1QsR0FEU0EsSUFDVDtBQUFFLEc7QUFHUjs7Ozs7Ozs7TUFJc0JHLFE7Ozs7OztBQUVsQjs7OzswQkFJb0I7QUFDaEIsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7OztBQVFELHNCQUFhQyxNQUFiLEVBQWdDO0FBQUE7O0FBQUE7O0FBQzVCLG9GQUFNQyxzQkFBY0MsS0FBcEI7QUFENEIsWUFOdEJDLE9BTXNCO0FBQUEsWUFKdEJKLEtBSXNCLEdBSkFILHFCQUFhQyxRQUliO0FBQUEsWUFGdEJPLFFBRXNCLEdBRlgsS0FFVztBQUU1QixZQUFLRCxPQUFMLEdBQWVILE1BQWY7QUFGNEI7QUFHL0I7Ozs7Z0NBTWlCO0FBQUUsZUFBTyxLQUFLSSxRQUFaO0FBQXVCO0FBRTNDOzs7Ozs7Ozs7O0lBM0JtQ0MsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIgfSBmcm9tICcuL2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYT2JqZWN0LCBHRlhPYmplY3RUeXBlLCBHRlhRdWV1ZVR5cGUgfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYRmVuY2UgfSBmcm9tICcuL2ZlbmNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhRdWV1ZUluZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB0eXBlOiBHRlhRdWV1ZVR5cGUgPSBHRlhRdWV1ZVR5cGUuR1JBUEhJQ1MsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIFF1ZXVlLlxyXG4gKiBAemggR0ZYIOmYn+WIl+OAglxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWFF1ZXVlIGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCB0eXBlLlxyXG4gICAgICogQHpoIOmYn+WIl+exu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdHlwZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdHlwZTogR0ZYUXVldWVUeXBlID0gR0ZYUXVldWVUeXBlLkdSQVBISUNTO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaXNBc3luYyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuUVVFVUUpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUXVldWVJbmZvKTogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgaXNBc3luYyAoKSB7IHJldHVybiB0aGlzLl9pc0FzeW5jOyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU3VibWl0IGNvbW1hbmQgYnVmZmVycy5cclxuICAgICAqIEB6aCDmj5DkuqTlkb3ku6TnvJPlhrLmlbDnu4TjgIJcclxuICAgICAqIEBwYXJhbSBjbWRCdWZmcyBUaGUgY29tbWFuZCBidWZmZXJzIHRvIGJlIHN1Ym1pdHRlZC5cclxuICAgICAqIEBwYXJhbSBmZW5jZSBUaGUgc3luY2luZyBmZW5jZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHN1Ym1pdCAoY21kQnVmZnM6IEdGWENvbW1hbmRCdWZmZXJbXSwgZmVuY2U/OiBHRlhGZW5jZSk6IHZvaWQ7XHJcbn1cclxuIl19