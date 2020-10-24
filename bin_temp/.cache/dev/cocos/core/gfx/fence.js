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
    global.fence = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXFence = _exports.GFXFenceInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXFenceInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXFenceInfo() {
    _classCallCheck(this, GFXFenceInfo);
  };
  /**
   * @en GFX Fence.
   * @zh GFX 同步信号。
   */


  _exports.GFXFenceInfo = GFXFenceInfo;

  var GFXFence = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXFence, _GFXObject);

    function GFXFence(device) {
      var _this;

      _classCallCheck(this, GFXFence);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXFence).call(this, _define.GFXObjectType.FENCE));
      _this._device = void 0;
      _this._device = device;
      return _this;
    }

    return GFXFence;
  }(_define.GFXObject);

  _exports.GFXFence = GFXFence;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2ZlbmNlLnRzIl0sIm5hbWVzIjpbIkdGWEZlbmNlSW5mbyIsIkdGWEZlbmNlIiwiZGV2aWNlIiwiR0ZYT2JqZWN0VHlwZSIsIkZFTkNFIiwiX2RldmljZSIsIkdGWE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU9hQSxZLEdBQ3FCO0FBRTlCLDBCQUNDO0FBQUE7QUFBRSxHO0FBR1A7Ozs7Ozs7O01BSXNCQyxROzs7QUFJbEIsc0JBQWFDLE1BQWIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDNUIsb0ZBQU1DLHNCQUFjQyxLQUFwQjtBQUQ0QixZQUZ0QkMsT0FFc0I7QUFFNUIsWUFBS0EsT0FBTCxHQUFlSCxNQUFmO0FBRjRCO0FBRy9COzs7SUFQa0NJLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZnhcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhPYmplY3QsIEdGWE9iamVjdFR5cGUgfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhGZW5jZUluZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgKXt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIEZlbmNlLlxyXG4gKiBAemggR0ZYIOWQjOatpeS/oeWPt+OAglxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWEZlbmNlIGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuRkVOQ0UpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYRmVuY2VJbmZvKTogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTogdm9pZDtcclxufVxyXG4iXX0=