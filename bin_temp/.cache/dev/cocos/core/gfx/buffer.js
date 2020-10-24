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
    global.buffer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXBuffer = _exports.GFXBufferViewInfo = _exports.GFXBufferInfo = _exports.GFXIndirectBuffer = _exports.GFX_DRAW_INFO_SIZE = _exports.GFXDrawInfo = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXDrawInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDrawInfo() {
    var vertexCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var firstVertex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var indexCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var firstIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var vertexOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var instanceCount = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var firstInstance = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;

    _classCallCheck(this, GFXDrawInfo);

    this.vertexCount = vertexCount;
    this.firstVertex = firstVertex;
    this.indexCount = indexCount;
    this.firstIndex = firstIndex;
    this.vertexOffset = vertexOffset;
    this.instanceCount = instanceCount;
    this.firstInstance = firstInstance;
  };

  _exports.GFXDrawInfo = GFXDrawInfo;
  var GFX_DRAW_INFO_SIZE = 28;
  _exports.GFX_DRAW_INFO_SIZE = GFX_DRAW_INFO_SIZE;

  var GFXIndirectBuffer = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXIndirectBuffer() {
    var drawInfos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, GFXIndirectBuffer);

    this.drawInfos = drawInfos;
  };

  _exports.GFXIndirectBuffer = GFXIndirectBuffer;

  var GFXBufferInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXBufferInfo(usage, memUsage) {
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var stride = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var flags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXBufferFlagBit.NONE;

    _classCallCheck(this, GFXBufferInfo);

    this.usage = usage;
    this.memUsage = memUsage;
    this.size = size;
    this.stride = stride;
    this.flags = flags;
  };

  _exports.GFXBufferInfo = GFXBufferInfo;

  var GFXBufferViewInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXBufferViewInfo(buffer) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GFXBufferViewInfo);

    this.buffer = buffer;
    this.offset = offset;
    this.range = range;
  };
  /**
   * @en GFX buffer.
   * @zh GFX 缓冲。
   */


  _exports.GFXBufferViewInfo = GFXBufferViewInfo;

  var GFXBuffer = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXBuffer, _GFXObject);

    _createClass(GFXBuffer, [{
      key: "usage",

      /**
       * @en Usage type of the buffer.
       * @zh 缓冲使用方式。
       */
      get: function get() {
        return this._usage;
      }
      /**
       * @en Memory usage of the buffer.
       * @zh 缓冲的内存使用方式。
       */

    }, {
      key: "memUsage",
      get: function get() {
        return this._memUsage;
      }
      /**
       * @en Size of the buffer.
       * @zh 缓冲大小。
       */

    }, {
      key: "size",
      get: function get() {
        return this._size;
      }
      /**
       * @en Stride of the buffer.
       * @zh 缓冲步长。
       */

    }, {
      key: "stride",
      get: function get() {
        return this._stride;
      }
      /**
       * @en Count of the buffer wrt. stride.
       * @zh 缓冲条目数量。
       */

    }, {
      key: "count",
      get: function get() {
        return this._count;
      }
    }, {
      key: "flags",
      get: function get() {
        return this._flags;
      }
      /**
       * @en View of the back-up buffer, if specified.
       * @zh 备份缓冲视图。
       */

    }, {
      key: "backupBuffer",
      get: function get() {
        return this._bakcupBuffer;
      }
    }]);

    function GFXBuffer(device) {
      var _this;

      _classCallCheck(this, GFXBuffer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXBuffer).call(this, _define.GFXObjectType.BUFFER));
      _this._device = void 0;
      _this._usage = _define.GFXBufferUsageBit.NONE;
      _this._memUsage = _define.GFXMemoryUsageBit.NONE;
      _this._size = 0;
      _this._stride = 1;
      _this._count = 0;
      _this._flags = _define.GFXBufferFlagBit.NONE;
      _this._bakcupBuffer = null;
      _this._indirectBuffer = null;
      _this._isBufferView = false;
      _this._device = device;
      return _this;
    }

    return GFXBuffer;
  }(_define.GFXObject);

  _exports.GFXBuffer = GFXBuffer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2J1ZmZlci50cyJdLCJuYW1lcyI6WyJHRlhEcmF3SW5mbyIsInZlcnRleENvdW50IiwiZmlyc3RWZXJ0ZXgiLCJpbmRleENvdW50IiwiZmlyc3RJbmRleCIsInZlcnRleE9mZnNldCIsImluc3RhbmNlQ291bnQiLCJmaXJzdEluc3RhbmNlIiwiR0ZYX0RSQVdfSU5GT19TSVpFIiwiR0ZYSW5kaXJlY3RCdWZmZXIiLCJkcmF3SW5mb3MiLCJHRlhCdWZmZXJJbmZvIiwidXNhZ2UiLCJtZW1Vc2FnZSIsInNpemUiLCJzdHJpZGUiLCJmbGFncyIsIkdGWEJ1ZmZlckZsYWdCaXQiLCJOT05FIiwiR0ZYQnVmZmVyVmlld0luZm8iLCJidWZmZXIiLCJvZmZzZXQiLCJyYW5nZSIsIkdGWEJ1ZmZlciIsIl91c2FnZSIsIl9tZW1Vc2FnZSIsIl9zaXplIiwiX3N0cmlkZSIsIl9jb3VudCIsIl9mbGFncyIsIl9iYWtjdXBCdWZmZXIiLCJkZXZpY2UiLCJHRlhPYmplY3RUeXBlIiwiQlVGRkVSIiwiX2RldmljZSIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJfaW5kaXJlY3RCdWZmZXIiLCJfaXNCdWZmZXJWaWV3IiwiR0ZYT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWdCYUEsVyxHQUNxQjtBQUU5Qix5QkFRRTtBQUFBLFFBUFNDLFdBT1QsdUVBUCtCLENBTy9CO0FBQUEsUUFOU0MsV0FNVCx1RUFOK0IsQ0FNL0I7QUFBQSxRQUxTQyxVQUtULHVFQUw4QixDQUs5QjtBQUFBLFFBSlNDLFVBSVQsdUVBSjhCLENBSTlCO0FBQUEsUUFIU0MsWUFHVCx1RUFIZ0MsQ0FHaEM7QUFBQSxRQUZTQyxhQUVULHVFQUZpQyxDQUVqQztBQUFBLFFBRFNDLGFBQ1QsdUVBRGlDLENBQ2pDOztBQUFBOztBQUFBLFNBUFNOLFdBT1QsR0FQU0EsV0FPVDtBQUFBLFNBTlNDLFdBTVQsR0FOU0EsV0FNVDtBQUFBLFNBTFNDLFVBS1QsR0FMU0EsVUFLVDtBQUFBLFNBSlNDLFVBSVQsR0FKU0EsVUFJVDtBQUFBLFNBSFNDLFlBR1QsR0FIU0EsWUFHVDtBQUFBLFNBRlNDLGFBRVQsR0FGU0EsYUFFVDtBQUFBLFNBRFNDLGFBQ1QsR0FEU0EsYUFDVDtBQUFFLEc7OztBQUdELE1BQU1DLGtCQUEwQixHQUFHLEVBQW5DOzs7TUFFTUMsaUIsR0FDcUI7QUFFOUIsK0JBRUU7QUFBQSxRQURTQyxTQUNULHVFQURvQyxFQUNwQzs7QUFBQTs7QUFBQSxTQURTQSxTQUNULEdBRFNBLFNBQ1Q7QUFBRSxHOzs7O01BS0tDLGEsR0FDcUI7QUFFOUIseUJBQ1dDLEtBRFgsRUFFV0MsUUFGWCxFQU1FO0FBQUEsUUFIU0MsSUFHVCx1RUFId0IsQ0FHeEI7QUFBQSxRQUZTQyxNQUVULHVFQUYwQixDQUUxQjtBQUFBLFFBRFNDLEtBQ1QsdUVBRGlDQyx5QkFBaUJDLElBQ2xEOztBQUFBOztBQUFBLFNBTFNOLEtBS1QsR0FMU0EsS0FLVDtBQUFBLFNBSlNDLFFBSVQsR0FKU0EsUUFJVDtBQUFBLFNBSFNDLElBR1QsR0FIU0EsSUFHVDtBQUFBLFNBRlNDLE1BRVQsR0FGU0EsTUFFVDtBQUFBLFNBRFNDLEtBQ1QsR0FEU0EsS0FDVDtBQUFFLEc7Ozs7TUFHS0csaUIsR0FDcUI7QUFFOUIsNkJBQ1dDLE1BRFgsRUFJRTtBQUFBLFFBRlNDLE1BRVQsdUVBRjBCLENBRTFCO0FBQUEsUUFEU0MsS0FDVCx1RUFEeUIsQ0FDekI7O0FBQUE7O0FBQUEsU0FIU0YsTUFHVCxHQUhTQSxNQUdUO0FBQUEsU0FGU0MsTUFFVCxHQUZTQSxNQUVUO0FBQUEsU0FEU0MsS0FDVCxHQURTQSxLQUNUO0FBQUUsRztBQUdSOzs7Ozs7OztNQUlzQkMsUzs7Ozs7O0FBRWxCOzs7OzBCQUk2QjtBQUN6QixlQUFPLEtBQUtDLE1BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlnQztBQUM1QixlQUFPLEtBQUtDLFNBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlvQjtBQUNoQixlQUFPLEtBQUtDLEtBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlzQjtBQUNsQixlQUFPLEtBQUtDLE9BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUlxQjtBQUNqQixlQUFPLEtBQUtDLE1BQVo7QUFDSDs7OzBCQUU0QjtBQUN6QixlQUFPLEtBQUtDLE1BQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUl1QztBQUNuQyxlQUFPLEtBQUtDLGFBQVo7QUFDSDs7O0FBYUQsdUJBQWFDLE1BQWIsRUFBZ0M7QUFBQTs7QUFBQTs7QUFDNUIscUZBQU1DLHNCQUFjQyxNQUFwQjtBQUQ0QixZQVh0QkMsT0FXc0I7QUFBQSxZQVZ0QlYsTUFVc0IsR0FWR1csMEJBQWtCakIsSUFVckI7QUFBQSxZQVR0Qk8sU0FTc0IsR0FUTVcsMEJBQWtCbEIsSUFTeEI7QUFBQSxZQVJ0QlEsS0FRc0IsR0FSTixDQVFNO0FBQUEsWUFQdEJDLE9BT3NCLEdBUEosQ0FPSTtBQUFBLFlBTnRCQyxNQU1zQixHQU5MLENBTUs7QUFBQSxZQUx0QkMsTUFLc0IsR0FMR1oseUJBQWlCQyxJQUtwQjtBQUFBLFlBSnRCWSxhQUlzQixHQUphLElBSWI7QUFBQSxZQUh0Qk8sZUFHc0IsR0FIc0IsSUFHdEI7QUFBQSxZQUZ0QkMsYUFFc0IsR0FGTixLQUVNO0FBRTVCLFlBQUtKLE9BQUwsR0FBZUgsTUFBZjtBQUY0QjtBQUcvQjs7O0lBcEVtQ1EsaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgICBHRlhCdWZmZXJGbGFnQml0LFxyXG4gICAgR0ZYQnVmZmVyRmxhZ3MsXHJcbiAgICBHRlhCdWZmZXJVc2FnZSxcclxuICAgIEdGWEJ1ZmZlclVzYWdlQml0LFxyXG4gICAgR0ZYTWVtb3J5VXNhZ2UsXHJcbiAgICBHRlhNZW1vcnlVc2FnZUJpdCxcclxuICAgIEdGWE9iamVjdCxcclxuICAgIEdGWE9iamVjdFR5cGUsXHJcbn0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYRHJhd0luZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB2ZXJ0ZXhDb3VudDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgZmlyc3RWZXJ0ZXg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGluZGV4Q291bnQ6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGZpcnN0SW5kZXg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHZlcnRleE9mZnNldDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgaW5zdGFuY2VDb3VudDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgZmlyc3RJbnN0YW5jZTogbnVtYmVyID0gMCxcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IEdGWF9EUkFXX0lORk9fU0laRTogbnVtYmVyID0gMjg7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYSW5kaXJlY3RCdWZmZXIge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBkcmF3SW5mb3M6IEdGWERyYXdJbmZvW10gPSBbXSxcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IHR5cGUgR0ZYQnVmZmVyU291cmNlID0gQXJyYXlCdWZmZXIgfCBHRlhJbmRpcmVjdEJ1ZmZlcjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhCdWZmZXJJbmZvIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgdXNhZ2U6IEdGWEJ1ZmZlclVzYWdlLFxyXG4gICAgICAgIHB1YmxpYyBtZW1Vc2FnZTogR0ZYTWVtb3J5VXNhZ2UsXHJcbiAgICAgICAgcHVibGljIHNpemU6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHN0cmlkZTogbnVtYmVyID0gMCwgLy8gaW4gYnl0ZXNcclxuICAgICAgICBwdWJsaWMgZmxhZ3M6IEdGWEJ1ZmZlckZsYWdzID0gR0ZYQnVmZmVyRmxhZ0JpdC5OT05FLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYQnVmZmVyVmlld0luZm8ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBidWZmZXI6IEdGWEJ1ZmZlcixcclxuICAgICAgICBwdWJsaWMgb2Zmc2V0OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyByYW5nZTogbnVtYmVyID0gMCxcclxuICAgICkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggYnVmZmVyLlxyXG4gKiBAemggR0ZYIOe8k+WGsuOAglxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWEJ1ZmZlciBleHRlbmRzIEdGWE9iamVjdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVXNhZ2UgdHlwZSBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICogQHpoIOe8k+WGsuS9v+eUqOaWueW8j+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdXNhZ2UgKCk6IEdGWEJ1ZmZlclVzYWdlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWVtb3J5IHVzYWdlIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAemgg57yT5Yay55qE5YaF5a2Y5L2/55So5pa55byP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBtZW1Vc2FnZSAoKTogR0ZYTWVtb3J5VXNhZ2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZW1Vc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTaXplIG9mIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAemgg57yT5Yay5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzaXplICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFN0cmlkZSBvZiB0aGUgYnVmZmVyLlxyXG4gICAgICogQHpoIOe8k+WGsuatpemVv+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc3RyaWRlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJpZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ291bnQgb2YgdGhlIGJ1ZmZlciB3cnQuIHN0cmlkZS5cclxuICAgICAqIEB6aCDnvJPlhrLmnaHnm67mlbDph4/jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGNvdW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZmxhZ3MgKCk6IEdGWEJ1ZmZlckZsYWdzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmxhZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVmlldyBvZiB0aGUgYmFjay11cCBidWZmZXIsIGlmIHNwZWNpZmllZC5cclxuICAgICAqIEB6aCDlpIfku73nvJPlhrLop4blm77jgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGJhY2t1cEJ1ZmZlciAoKTogVWludDhBcnJheSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iYWtjdXBCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2U6IEdGWERldmljZTtcclxuICAgIHByb3RlY3RlZCBfdXNhZ2U6IEdGWEJ1ZmZlclVzYWdlID0gR0ZYQnVmZmVyVXNhZ2VCaXQuTk9ORTtcclxuICAgIHByb3RlY3RlZCBfbWVtVXNhZ2U6IEdGWE1lbW9yeVVzYWdlID0gR0ZYTWVtb3J5VXNhZ2VCaXQuTk9ORTtcclxuICAgIHByb3RlY3RlZCBfc2l6ZTogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfc3RyaWRlOiBudW1iZXIgPSAxO1xyXG4gICAgcHJvdGVjdGVkIF9jb3VudDogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBfZmxhZ3M6IEdGWEJ1ZmZlckZsYWdzID0gR0ZYQnVmZmVyRmxhZ0JpdC5OT05FO1xyXG4gICAgcHJvdGVjdGVkIF9iYWtjdXBCdWZmZXI6IFVpbnQ4QXJyYXkgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfaW5kaXJlY3RCdWZmZXI6IEdGWEluZGlyZWN0QnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2lzQnVmZmVyVmlldyA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuQlVGRkVSKTtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGluaXRpYWxpemUgKGluZm86IEdGWEJ1ZmZlckluZm8gfCBHRlhCdWZmZXJWaWV3SW5mbyk6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGRlc3Ryb3kgKCk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzaXplIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAemgg6YeN572u57yT5Yay5aSn5bCP44CCXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBUaGUgbmV3IGJ1ZmZlciBzaXplLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgcmVzaXplIChzaXplOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFVwZGF0ZSB0aGUgYnVmZmVyIGRhdGEuXHJcbiAgICAgKiBAemgg5pu05paw57yT5Yay5YaF5a6544CCXHJcbiAgICAgKiBAcGFyYW0gYnVmZmVyIFRoZSBuZXcgYnVmZmVyIGRhdGEuXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IE9mZnNldCBpbnRvIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBTaXplIG9mIHRoZSBkYXRhIHRvIGJlIHVwZGF0ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhYnN0cmFjdCB1cGRhdGUgKGJ1ZmZlcjogR0ZYQnVmZmVyU291cmNlLCBvZmZzZXQ/OiBudW1iZXIsIHNpemU/OiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiJdfQ==