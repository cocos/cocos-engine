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
    global.descriptorSetLayout = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXDescriptorSetLayout = _exports.DESCRIPTOR_DYNAMIC_TYPE = _exports.GFXDescriptorSetLayoutInfo = _exports.GFXDescriptorSetLayoutBinding = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXDescriptorSetLayoutBinding = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDescriptorSetLayoutBinding() {
    var descriptorType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXDescriptorType.UNKNOWN;
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var stageFlags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXShaderStageFlagBit.NONE;
    var immutableSamplers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, GFXDescriptorSetLayoutBinding);

    this.descriptorType = descriptorType;
    this.count = count;
    this.stageFlags = stageFlags;
    this.immutableSamplers = immutableSamplers;
  };

  _exports.GFXDescriptorSetLayoutBinding = GFXDescriptorSetLayoutBinding;

  var GFXDescriptorSetLayoutInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDescriptorSetLayoutInfo() {
    var bindings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, GFXDescriptorSetLayoutInfo);

    this.bindings = bindings;
  };

  _exports.GFXDescriptorSetLayoutInfo = GFXDescriptorSetLayoutInfo;
  var DESCRIPTOR_DYNAMIC_TYPE = _define.GFXDescriptorType.DYNAMIC_STORAGE_BUFFER | _define.GFXDescriptorType.DYNAMIC_UNIFORM_BUFFER;
  /**
   * @en GFX descriptor sets layout.
   * @zh GFX 描述符集布局。
   */

  _exports.DESCRIPTOR_DYNAMIC_TYPE = DESCRIPTOR_DYNAMIC_TYPE;

  var GFXDescriptorSetLayout = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXDescriptorSetLayout, _GFXObject);

    _createClass(GFXDescriptorSetLayout, [{
      key: "bindings",
      get: function get() {
        return this._bindings;
      }
    }, {
      key: "descriptorIndices",
      get: function get() {
        return this._descriptorIndices;
      }
    }]);

    function GFXDescriptorSetLayout(device) {
      var _this;

      _classCallCheck(this, GFXDescriptorSetLayout);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXDescriptorSetLayout).call(this, _define.GFXObjectType.DESCRIPTOR_SET_LAYOUT));
      _this._device = void 0;
      _this._bindings = [];
      _this._descriptorIndices = [];
      _this._device = device;
      return _this;
    }

    return GFXDescriptorSetLayout;
  }(_define.GFXObject);

  _exports.GFXDescriptorSetLayout = GFXDescriptorSetLayout;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2Rlc2NyaXB0b3Itc2V0LWxheW91dC50cyJdLCJuYW1lcyI6WyJHRlhEZXNjcmlwdG9yU2V0TGF5b3V0QmluZGluZyIsImRlc2NyaXB0b3JUeXBlIiwiR0ZYRGVzY3JpcHRvclR5cGUiLCJVTktOT1dOIiwiY291bnQiLCJzdGFnZUZsYWdzIiwiR0ZYU2hhZGVyU3RhZ2VGbGFnQml0IiwiTk9ORSIsImltbXV0YWJsZVNhbXBsZXJzIiwiR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8iLCJiaW5kaW5ncyIsIkRFU0NSSVBUT1JfRFlOQU1JQ19UWVBFIiwiRFlOQU1JQ19TVE9SQUdFX0JVRkZFUiIsIkRZTkFNSUNfVU5JRk9STV9CVUZGRVIiLCJHRlhEZXNjcmlwdG9yU2V0TGF5b3V0IiwiX2JpbmRpbmdzIiwiX2Rlc2NyaXB0b3JJbmRpY2VzIiwiZGV2aWNlIiwiR0ZYT2JqZWN0VHlwZSIsIkRFU0NSSVBUT1JfU0VUX0xBWU9VVCIsIl9kZXZpY2UiLCJHRlhPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUWFBLDZCLEdBQ3FCO0FBRTlCLDJDQUtFO0FBQUEsUUFKU0MsY0FJVCx1RUFKNkNDLDBCQUFrQkMsT0FJL0Q7QUFBQSxRQUhTQyxLQUdULHVFQUh5QixDQUd6QjtBQUFBLFFBRlNDLFVBRVQsdUVBRjJDQyw4QkFBc0JDLElBRWpFO0FBQUEsUUFEU0MsaUJBQ1QsdUVBRDJDLEVBQzNDOztBQUFBOztBQUFBLFNBSlNQLGNBSVQsR0FKU0EsY0FJVDtBQUFBLFNBSFNHLEtBR1QsR0FIU0EsS0FHVDtBQUFBLFNBRlNDLFVBRVQsR0FGU0EsVUFFVDtBQUFBLFNBRFNHLGlCQUNULEdBRFNBLGlCQUNUO0FBQUUsRzs7OztNQUdLQywwQixHQUNxQjtBQUU5Qix3Q0FJRTtBQUFBLFFBRFNDLFFBQ1QsdUVBRHFELEVBQ3JEOztBQUFBOztBQUFBLFNBRFNBLFFBQ1QsR0FEU0EsUUFDVDtBQUFFLEc7OztBQUdELE1BQU1DLHVCQUF1QixHQUFHVCwwQkFBa0JVLHNCQUFsQixHQUEyQ1YsMEJBQWtCVyxzQkFBN0Y7QUFFUDs7Ozs7OztNQUlzQkMsc0I7Ozs7OzBCQUVGO0FBQ1osZUFBTyxLQUFLQyxTQUFaO0FBQ0g7OzswQkFFd0I7QUFDckIsZUFBTyxLQUFLQyxrQkFBWjtBQUNIOzs7QUFRRCxvQ0FBYUMsTUFBYixFQUFnQztBQUFBOztBQUFBOztBQUM1QixrR0FBTUMsc0JBQWNDLHFCQUFwQjtBQUQ0QixZQU50QkMsT0FNc0I7QUFBQSxZQUp0QkwsU0FJc0IsR0FKdUIsRUFJdkI7QUFBQSxZQUZ0QkMsa0JBRXNCLEdBRlMsRUFFVDtBQUU1QixZQUFLSSxPQUFMLEdBQWVILE1BQWY7QUFGNEI7QUFHL0I7OztJQW5CZ0RJLGlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZnhcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yVHlwZSwgR0ZYT2JqZWN0LCBHRlhPYmplY3RUeXBlLCBHRlhTaGFkZXJTdGFnZUZsYWdCaXQsIEdGWFNoYWRlclN0YWdlRmxhZ3MgfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYU2FtcGxlciB9IGZyb20gJy4vc2FtcGxlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYRGVzY3JpcHRvclNldExheW91dEJpbmRpbmcge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBkZXNjcmlwdG9yVHlwZTogR0ZYRGVzY3JpcHRvclR5cGUgPSBHRlhEZXNjcmlwdG9yVHlwZS5VTktOT1dOLFxyXG4gICAgICAgIHB1YmxpYyBjb3VudDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgc3RhZ2VGbGFnczogR0ZYU2hhZGVyU3RhZ2VGbGFncyA9IEdGWFNoYWRlclN0YWdlRmxhZ0JpdC5OT05FLFxyXG4gICAgICAgIHB1YmxpYyBpbW11dGFibGVTYW1wbGVyczogR0ZYU2FtcGxlcltdID0gW10sXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0SW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgLy8gYXJyYXkgaW5kZXggaXMgdXNlZCBhcyB0aGUgYmluZGluZyBudW1iZXJzLFxyXG4gICAgICAgIC8vIGkuZS4gdGhleSBzaG91bGQgYmUgc3RyaWN0bHkgY29uc2VjdXRpdmUgYW5kIHN0YXJ0IGZyb20gMFxyXG4gICAgICAgIHB1YmxpYyBiaW5kaW5nczogR0ZYRGVzY3JpcHRvclNldExheW91dEJpbmRpbmdbXSA9IFtdXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBERVNDUklQVE9SX0RZTkFNSUNfVFlQRSA9IEdGWERlc2NyaXB0b3JUeXBlLkRZTkFNSUNfU1RPUkFHRV9CVUZGRVIgfCBHRlhEZXNjcmlwdG9yVHlwZS5EWU5BTUlDX1VOSUZPUk1fQlVGRkVSO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggZGVzY3JpcHRvciBzZXRzIGxheW91dC5cclxuICogQHpoIEdGWCDmj4/ov7DnrKbpm4bluIPlsYDjgIJcclxuICovXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0IGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuXHJcbiAgICBnZXQgYmluZGluZ3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVzY3JpcHRvckluZGljZXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9ySW5kaWNlcztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYmluZGluZ3M6IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRCaW5kaW5nW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Rlc2NyaXB0b3JJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuREVTQ1JJUFRPUl9TRVRfTEFZT1VUKTtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGluaXRpYWxpemUgKGluZm86IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvKTogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTogdm9pZDtcclxufVxyXG4iXX0=