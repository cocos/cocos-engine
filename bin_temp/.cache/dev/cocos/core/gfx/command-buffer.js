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
    global.commandBuffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXCommandBuffer = _exports.GFXCommandBufferInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXCommandBufferInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXCommandBufferInfo(queue) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXCommandBufferType.PRIMARY;

    _classCallCheck(this, GFXCommandBufferInfo);

    this.queue = queue;
    this.type = type;
  };
  /**
   * @en GFX command buffer.
   * @zh GFX 命令缓冲。
   */
  // tslint:disable: max-line-length


  _exports.GFXCommandBufferInfo = GFXCommandBufferInfo;

  var GFXCommandBuffer = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXCommandBuffer, _GFXObject);

    _createClass(GFXCommandBuffer, [{
      key: "type",

      /**
       * @en Type of the command buffer.
       * @zh 命令缓冲类型。
       */
      get: function get() {
        return this._type;
      }
      /**
       * @en Type of the command buffer.
       * @zh 命令缓冲类型。
       */

    }, {
      key: "queue",
      get: function get() {
        return this._queue;
      }
      /**
       * @en Number of draw calls currently recorded.
       * @zh 绘制调用次数。
       */

    }, {
      key: "numDrawCalls",
      get: function get() {
        return this._numDrawCalls;
      }
      /**
       * @en Number of instances currently recorded.
       * @zh 绘制 Instance 数量。
       */

    }, {
      key: "numInstances",
      get: function get() {
        return this._numInstances;
      }
      /**
       * @en Number of triangles currently recorded.
       * @zh 绘制三角形数量。
       */

    }, {
      key: "numTris",
      get: function get() {
        return this._numTris;
      }
    }]);

    function GFXCommandBuffer(device) {
      var _this;

      _classCallCheck(this, GFXCommandBuffer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXCommandBuffer).call(this, _define.GFXObjectType.COMMAND_BUFFER));
      _this._device = void 0;
      _this._queue = null;
      _this._type = _define.GFXCommandBufferType.PRIMARY;
      _this._numDrawCalls = 0;
      _this._numInstances = 0;
      _this._numTris = 0;
      _this._device = device;
      return _this;
    }

    return GFXCommandBuffer;
  }(_define.GFXObject);

  _exports.GFXCommandBuffer = GFXCommandBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2NvbW1hbmQtYnVmZmVyLnRzIl0sIm5hbWVzIjpbIkdGWENvbW1hbmRCdWZmZXJJbmZvIiwicXVldWUiLCJ0eXBlIiwiR0ZYQ29tbWFuZEJ1ZmZlclR5cGUiLCJQUklNQVJZIiwiR0ZYQ29tbWFuZEJ1ZmZlciIsIl90eXBlIiwiX3F1ZXVlIiwiX251bURyYXdDYWxscyIsIl9udW1JbnN0YW5jZXMiLCJfbnVtVHJpcyIsImRldmljZSIsIkdGWE9iamVjdFR5cGUiLCJDT01NQU5EX0JVRkZFUiIsIl9kZXZpY2UiLCJHRlhPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bd0JhQSxvQixHQUNxQjtBQUU5QixnQ0FDV0MsS0FEWCxFQUdFO0FBQUEsUUFEU0MsSUFDVCx1RUFEc0NDLDZCQUFxQkMsT0FDM0Q7O0FBQUE7O0FBQUEsU0FGU0gsS0FFVCxHQUZTQSxLQUVUO0FBQUEsU0FEU0MsSUFDVCxHQURTQSxJQUNUO0FBQUUsRztBQUdSOzs7O0FBSUE7Ozs7O01BQ3NCRyxnQjs7Ozs7O0FBRWxCOzs7OzBCQUlrQztBQUM5QixlQUFPLEtBQUtDLEtBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUl1QjtBQUNuQixlQUFPLEtBQUtDLE1BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUk0QjtBQUN4QixlQUFPLEtBQUtDLGFBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUk0QjtBQUN4QixlQUFPLEtBQUtDLGFBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUl1QjtBQUNuQixlQUFPLEtBQUtDLFFBQVo7QUFDSDs7O0FBY0QsOEJBQWFDLE1BQWIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDNUIsNEZBQU1DLHNCQUFjQyxjQUFwQjtBQUQ0QixZQVp0QkMsT0FZc0I7QUFBQSxZQVZ0QlAsTUFVc0IsR0FWSSxJQVVKO0FBQUEsWUFSdEJELEtBUXNCLEdBUlFILDZCQUFxQkMsT0FRN0I7QUFBQSxZQU50QkksYUFNc0IsR0FORSxDQU1GO0FBQUEsWUFKdEJDLGFBSXNCLEdBSkUsQ0FJRjtBQUFBLFlBRnRCQyxRQUVzQixHQUZILENBRUc7QUFFNUIsWUFBS0ksT0FBTCxHQUFlSCxNQUFmO0FBRjRCO0FBRy9COzs7SUF6RDBDSSxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldCB9IGZyb20gJy4vZGVzY3JpcHRvci1zZXQnO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIgfSBmcm9tICcuL2J1ZmZlcic7XHJcbmltcG9ydCB7XHJcbiAgICBHRlhCdWZmZXJUZXh0dXJlQ29weSxcclxuICAgIEdGWENvbW1hbmRCdWZmZXJUeXBlLFxyXG4gICAgR0ZYT2JqZWN0LFxyXG4gICAgR0ZYT2JqZWN0VHlwZSxcclxuICAgIEdGWFN0ZW5jaWxGYWNlLFxyXG4gICAgR0ZYQ29sb3IsXHJcbiAgICBHRlhSZWN0LFxyXG4gICAgR0ZYVmlld3BvcnQsXHJcbn0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyIH0gZnJvbSAnLi9mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWElucHV0QXNzZW1ibGVyIH0gZnJvbSAnLi9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi9waXBlbGluZS1zdGF0ZSc7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuL3RleHR1cmUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi9yZW5kZXItcGFzcyc7XHJcbmltcG9ydCB7IEdGWFF1ZXVlIH0gZnJvbSAnLi9xdWV1ZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYQ29tbWFuZEJ1ZmZlckluZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBxdWV1ZTogR0ZYUXVldWUsXHJcbiAgICAgICAgcHVibGljIHR5cGU6IEdGWENvbW1hbmRCdWZmZXJUeXBlID0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuUFJJTUFSWVxyXG4gICAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBjb21tYW5kIGJ1ZmZlci5cclxuICogQHpoIEdGWCDlkb3ku6TnvJPlhrLjgIJcclxuICovXHJcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWENvbW1hbmRCdWZmZXIgZXh0ZW5kcyBHRlhPYmplY3Qge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFR5cGUgb2YgdGhlIGNvbW1hbmQgYnVmZmVyLlxyXG4gICAgICogQHpoIOWRveS7pOe8k+WGsuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdHlwZSAoKTogR0ZYQ29tbWFuZEJ1ZmZlclR5cGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFR5cGUgb2YgdGhlIGNvbW1hbmQgYnVmZmVyLlxyXG4gICAgICogQHpoIOWRveS7pOe8k+WGsuexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgcXVldWUgKCk6IEdGWFF1ZXVlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcXVldWUhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiBkcmF3IGNhbGxzIGN1cnJlbnRseSByZWNvcmRlZC5cclxuICAgICAqIEB6aCDnu5jliLbosIPnlKjmrKHmlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG51bURyYXdDYWxscyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtRHJhd0NhbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiBpbnN0YW5jZXMgY3VycmVudGx5IHJlY29yZGVkLlxyXG4gICAgICogQHpoIOe7mOWItiBJbnN0YW5jZSDmlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG51bUluc3RhbmNlcyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtSW5zdGFuY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE51bWJlciBvZiB0cmlhbmdsZXMgY3VycmVudGx5IHJlY29yZGVkLlxyXG4gICAgICogQHpoIOe7mOWItuS4ieinkuW9ouaVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgbnVtVHJpcyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVHJpcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfcXVldWU6IEdGWFF1ZXVlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF90eXBlOiBHRlhDb21tYW5kQnVmZmVyVHlwZSA9IEdGWENvbW1hbmRCdWZmZXJUeXBlLlBSSU1BUlk7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9udW1EcmF3Q2FsbHM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9udW1JbnN0YW5jZXM6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9udW1UcmlzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuQ09NTUFORF9CVUZGRVIpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYQ29tbWFuZEJ1ZmZlckluZm8pOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJlZ2luIHJlY29yZGluZyBjb21tYW5kcy5cclxuICAgICAqIEB6aCDlvIDlp4vorrDlvZXlkb3ku6TjgIJcclxuICAgICAqIEBwYXJhbSByZW5kZXJQYXNzIFtTZWNvbmRhcnkgQ29tbWFuZCBCdWZmZXIgT25seV0gVGhlIHJlbmRlciBwYXNzIHRoZSBzdWJzZXF1ZW50IGNvbW1hbmRzIHdpbGwgYmUgZXhlY3V0ZWQgaW5cclxuICAgICAqIEBwYXJhbSBzdWJwYXNzIFtTZWNvbmRhcnkgQ29tbWFuZCBCdWZmZXIgT25seV0gVGhlIHN1YnBhc3MgdGhlIHN1YnNlcXVlbnQgY29tbWFuZHMgd2lsbCBiZSBleGVjdXRlZCBpblxyXG4gICAgICogQHBhcmFtIGZyYW1lQnVmZmVyIFtTZWNvbmRhcnkgQ29tbWFuZCBCdWZmZXIgT25seSwgT3B0aW9uYWxdIFRoZSBmcmFtZWJ1ZmZlciB0byBiZSB1c2VkIGluIHRoZSBzdWJwYXNzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBiZWdpbiAocmVuZGVyUGFzcz86IEdGWFJlbmRlclBhc3MsIHN1YnBhc3M/OiBudW1iZXIsIGZyYW1lQnVmZmVyPzogR0ZYRnJhbWVidWZmZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEVuZCByZWNvcmRpbmcgY29tbWFuZHMuXHJcbiAgICAgKiBAemgg57uT5p2f6K6w5b2V5ZG95Luk44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBlbmQgKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQmVnaW4gcmVuZGVyIHBhc3MuXHJcbiAgICAgKiBAemgg5byA5aeLIFJlbmRlclBhc3PjgIJcclxuICAgICAqIEBwYXJhbSBmcmFtZWJ1ZmZlciBUaGUgZnJhbWUgYnVmZmVyIHVzZWQuXHJcbiAgICAgKiBAcGFyYW0gcmVuZGVyQXJlYSBUaGUgdGFyZ2V0IHJlbmRlciBhcmVhLlxyXG4gICAgICogQHBhcmFtIGNsZWFyRmxhZyBUaGUgY2xlYXIgZmxhZ3MuXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJDb2xvcnMgVGhlIGNsZWFyaW5nIGNvbG9ycy5cclxuICAgICAqIEBwYXJhbSBjbGVhckRlcHRoIFRoZSBjbGVhcmluZyBkZXB0aC5cclxuICAgICAqIEBwYXJhbSBjbGVhclN0ZW5jaWwgVGhlIGNsZWFyaW5nIHN0ZW5jaWwuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBiZWdpblJlbmRlclBhc3MgKHJlbmRlclBhc3M6IEdGWFJlbmRlclBhc3MsIGZyYW1lYnVmZmVyOiBHRlhGcmFtZWJ1ZmZlciwgcmVuZGVyQXJlYTogR0ZYUmVjdCwgY2xlYXJDb2xvcnM6IEdGWENvbG9yW10sIGNsZWFyRGVwdGg6IG51bWJlciwgY2xlYXJTdGVuY2lsOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEVuZCByZW5kZXIgcGFzcy5cclxuICAgICAqIEB6aCDnu5PmnZ8gUmVuZGVyUGFzc+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZW5kUmVuZGVyUGFzcyAoKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCaW5kIHBpcGVsaW5lIHN0YXRlLlxyXG4gICAgICogQHpoIOe7keWumiBHRlgg566h57q/54q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gcGlwZWxpbmVTdGF0ZSBUaGUgcGlwZWxpbmUgc3RhdGUgdG8gYmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBiaW5kUGlwZWxpbmVTdGF0ZSAocGlwZWxpbmVTdGF0ZTogR0ZYUGlwZWxpbmVTdGF0ZSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQmluZCBkZXNjcmlwdG9yIHNldC5cclxuICAgICAqIEB6aCDnu5HlrpogR0ZYIOaPj+i/sOespumbhuOAglxyXG4gICAgICogQHBhcmFtIGRlc2NyaXB0b3JTZXQgVGhlIGRlc2NyaXB0b3Igc2V0IHRvIGJlIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgYmluZERlc2NyaXB0b3JTZXQgKHNldDogbnVtYmVyLCBkZXNjcmlwdG9yU2V0czogR0ZYRGVzY3JpcHRvclNldCwgZHluYW1pY09mZnNldHM/OiBudW1iZXJbXSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQmluZCBpbnB1dCBhc3NlbWJsZXIuXHJcbiAgICAgKiBAemgg57uR5a6aR0ZY6L6T5YWl5rGH6ZuG5Zmo44CCXHJcbiAgICAgKiBAcGFyYW0gaW5wdXRBc3NlbWJsZXIgVGhlIGlucHV0IGFzc2VtYmxlciB0byBiZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGJpbmRJbnB1dEFzc2VtYmxlciAoaW5wdXRBc3NlbWJsZXI6IEdGWElucHV0QXNzZW1ibGVyKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgdmlld3BvcnQuXHJcbiAgICAgKiBAemgg6K6+572u6KeG5Y+j44CCXHJcbiAgICAgKiBAcGFyYW0gdmlld3BvcnQgVGhlIG5ldyB2aWV3cG9ydC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldFZpZXdwb3J0ICh2aWV3cG9ydDogR0ZYVmlld3BvcnQpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBzY2lzc29yIHJhbmdlLlxyXG4gICAgICogQHpoIOiuvue9ruWJquijgeWMuuWfn+OAglxyXG4gICAgICogQHBhcmFtIHNjaXNzb3IgVGhlIG5ldyBzY2lzc29yIHJhbmdlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0U2Npc3NvciAoc2Npc3NvcjogR0ZYUmVjdCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IGxpbmUgd2lkdGguXHJcbiAgICAgKiBAemgg6K6+572u57q/5a6944CCXHJcbiAgICAgKiBAcGFyYW0gbGluZVdpZHRoIFRoZSBuZXcgbGluZSB3aWR0aC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldExpbmVXaWR0aCAobGluZVdpZHRoOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBkZXB0aCBiaWFzLlxyXG4gICAgICogQHpoIOiuvue9rua3seW6puWBj+enu+OAglxyXG4gICAgICogQHBhcmFtIGRlcHRoQmlhc0NvbnN0YW50RmFjdG9yIFRoZSBuZXcgZGVwdGggYmlhcyBmYWN0b3IuXHJcbiAgICAgKiBAcGFyYW0gZGVwdGhCaWFzQ2xhbXAgVGhlIG5ldyBkZXB0aCBiaWFzIGNsYW1wIHRocmVzaG9sZC5cclxuICAgICAqIEBwYXJhbSBkZXB0aEJpYXNTbG9wZUZhY3RvciAgVGhlIG5ldyBkZXB0aCBiaWFzIHNsb3BlIGZhY3Rvci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldERlcHRoQmlhcyAoZGVwdGhCaWFzQ29uc3RhbnRGYWN0b3I6IG51bWJlciwgZGVwdGhCaWFzQ2xhbXA6IG51bWJlciwgZGVwdGhCaWFzU2xvcGVGYWN0b3I6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IGJsZW5kIGNvbnN0YW50cy5cclxuICAgICAqIEB6aCDorr7nva7mt7flkIjlm6DlrZDjgIJcclxuICAgICAqIEBwYXJhbSBibGVuZENvbnN0YW50cyBUaGUgbmV3IGJsZW5kIGNvbnN0YW50cy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IHNldEJsZW5kQ29uc3RhbnRzIChibGVuZENvbnN0YW50czogbnVtYmVyW10pOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBkZXB0aCBib3VuZC5cclxuICAgICAqIEB6aCDorr7nva7mt7HluqbovrnnlYzjgIJcclxuICAgICAqIEBwYXJhbSBtaW5EZXB0aEJvdW5kcyBUaGUgbmV3IG1pbmltdW0gZGVwdGggYm91bmQuXHJcbiAgICAgKiBAcGFyYW0gbWF4RGVwdGhCb3VuZHMgVGhlIG5ldyBtYXhpbXVtIGRlcHRoIGJvdW5kLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0RGVwdGhCb3VuZCAobWluRGVwdGhCb3VuZHM6IG51bWJlciwgbWF4RGVwdGhCb3VuZHM6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHN0ZW5jaWwgd3JpdGUgbWFzay5cclxuICAgICAqIEB6aCDorr7nva7mqKHmnb/lhpnmjqnnoIHjgIJcclxuICAgICAqIEBwYXJhbSBmYWNlIFRoZSBlZmZlY3RpdmUgdHJpYW5nbGUgZmFjZS5cclxuICAgICAqIEBwYXJhbSB3cml0ZU1hc2sgVGhlIG5ldyBzdGVuY2lsIHdyaXRlIG1hc2suXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBzZXRTdGVuY2lsV3JpdGVNYXNrIChmYWNlOiBHRlhTdGVuY2lsRmFjZSwgd3JpdGVNYXNrOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBzdGVuY2lsIGNvbXBhcmUgbWFzay5cclxuICAgICAqIEB6aCDorr7nva7mqKHmnb/mr5TovoPmjqnnoIHjgIJcclxuICAgICAqIEBwYXJhbSBmYWNlIFRoZSBlZmZlY3RpdmUgdHJpYW5nbGUgZmFjZS5cclxuICAgICAqIEBwYXJhbSByZWZlcmVuY2UgVGhlIG5ldyBzdGVuY2lsIHJlZmVyZW5jZSBjb25zdGFudC5cclxuICAgICAqIEBwYXJhbSBjb21wYXJlTWFzayBUaGUgbmV3IHN0ZW5jaWwgcmVhZCBtYXNrLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3Qgc2V0U3RlbmNpbENvbXBhcmVNYXNrIChmYWNlOiBHRlhTdGVuY2lsRmFjZSwgcmVmZXJlbmNlOiBudW1iZXIsIGNvbXBhcmVNYXNrOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIERyYXcgdGhlIHNwZWNpZmllZCBwcmltaXRpdmVzLlxyXG4gICAgICogQHpoIOe7mOWItuOAglxyXG4gICAgICogQHBhcmFtIGlucHV0QXNzZW1ibGVyIFRoZSB0YXJnZXQgaW5wdXQgYXNzZW1ibGVyLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZHJhdyAoaW5wdXRBc3NlbWJsZXI6IEdGWElucHV0QXNzZW1ibGVyKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVcGRhdGUgYnVmZmVyLlxyXG4gICAgICogQHpoIOabtOaWsOe8k+WGsuOAglxyXG4gICAgICogQHBhcmFtIGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGJlIHVwZGF0ZWQuXHJcbiAgICAgKiBAcGFyYW0gZGF0YSBUaGUgc291cmNlIGRhdGEuXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IE9mZnNldCBpbnRvIHRoZSBidWZmZXIuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCB1cGRhdGVCdWZmZXIgKGJ1ZmZlcjogR0ZYQnVmZmVyLCBkYXRhOiBBcnJheUJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb3B5IGJ1ZmZlciB0byB0ZXh0dXJlLlxyXG4gICAgICogQHpoIOaLt+i0nee8k+WGsuWIsOe6ueeQhuOAglxyXG4gICAgICogQHBhcmFtIHNyY0J1ZmYgVGhlIGJ1ZmZlciB0byBiZSBjb3BpZWQuXHJcbiAgICAgKiBAcGFyYW0gZHN0VGV4IFRoZSB0ZXh0dXJlIHRvIGNvcHkgdG8uXHJcbiAgICAgKiBAcGFyYW0gZHN0TGF5b3V0IFRoZSB0YXJnZXQgdGV4dHVyZSBsYXlvdXQuXHJcbiAgICAgKiBAcGFyYW0gcmVnaW9ucyBUaGUgcmVnaW9uIGRlc2NyaXB0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFic3RyYWN0IGNvcHlCdWZmZXJzVG9UZXh0dXJlIChidWZmZXJzOiBBcnJheUJ1ZmZlclZpZXdbXSwgdGV4dHVyZTogR0ZYVGV4dHVyZSwgcmVnaW9uczogR0ZYQnVmZmVyVGV4dHVyZUNvcHlbXSk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXhlY3V0ZSBzcGVjaWZpZWQgY29tbWFuZCBidWZmZXJzLlxyXG4gICAgICogQHpoIOaJp+ihjOS4gOe7hOWRveS7pOe8k+WGsuOAglxyXG4gICAgICogQHBhcmFtIGNtZEJ1ZmZzIFRoZSBjb21tYW5kIGJ1ZmZlcnMgdG8gYmUgZXhlY3V0ZWQuXHJcbiAgICAgKiBAcGFyYW0gY291bnQgVGhlIG51bWJlciBvZiBjb21tYW5kIGJ1ZmZlcnMgdG8gYmUgZXhlY3V0ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBleGVjdXRlIChjbWRCdWZmczogR0ZYQ29tbWFuZEJ1ZmZlcltdLCBjb3VudDogbnVtYmVyKTogdm9pZDtcclxufVxyXG4iXX0=