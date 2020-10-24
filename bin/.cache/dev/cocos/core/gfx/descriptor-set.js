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
    global.descriptorSet = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXDescriptorSet = _exports.GFXDescriptorSetInfo = _exports.DESCRIPTOR_SAMPLER_TYPE = _exports.DESCRIPTOR_BUFFER_TYPE = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var DESCRIPTOR_BUFFER_TYPE = _define.GFXDescriptorType.UNIFORM_BUFFER | _define.GFXDescriptorType.DYNAMIC_UNIFORM_BUFFER | _define.GFXDescriptorType.STORAGE_BUFFER | _define.GFXDescriptorType.DYNAMIC_STORAGE_BUFFER;
  _exports.DESCRIPTOR_BUFFER_TYPE = DESCRIPTOR_BUFFER_TYPE;
  var DESCRIPTOR_SAMPLER_TYPE = _define.GFXDescriptorType.SAMPLER;
  _exports.DESCRIPTOR_SAMPLER_TYPE = DESCRIPTOR_SAMPLER_TYPE;

  var GFXDescriptorSetInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDescriptorSetInfo(layout) {
    _classCallCheck(this, GFXDescriptorSetInfo);

    this.layout = layout;
  };
  /**
   * @en GFX descriptor sets.
   * @zh GFX 描述符集组。
   */


  _exports.GFXDescriptorSetInfo = GFXDescriptorSetInfo;

  var GFXDescriptorSet = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXDescriptorSet, _GFXObject);

    _createClass(GFXDescriptorSet, [{
      key: "layout",
      get: function get() {
        return this._layout;
      }
    }]);

    function GFXDescriptorSet(device) {
      var _this;

      _classCallCheck(this, GFXDescriptorSet);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXDescriptorSet).call(this, _define.GFXObjectType.DESCRIPTOR_SET));
      _this._device = void 0;
      _this._layout = null;
      _this._buffers = [];
      _this._textures = [];
      _this._samplers = [];
      _this._isDirty = false;
      _this._device = device;
      return _this;
    }

    _createClass(GFXDescriptorSet, [{
      key: "bindBuffer",

      /**
       * @en Bind buffer to the specified descriptor.
       * @zh 在指定的描述符位置上绑定缓冲。
       * @param binding The target binding.
       * @param buffer The buffer to be bound.
       */
      value: function bindBuffer(binding, buffer) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var info = this._layout.bindings[binding];
        var descriptorIndex = this._layout.descriptorIndices[binding];

        if (info && info.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
          if (this._buffers[descriptorIndex + index] !== buffer) {
            this._buffers[descriptorIndex + index] = buffer;
            this._isDirty = true;
          }
        } else {
          console.error('Setting binding is not GFXDescriptorType.UNIFORM_BUFFER.');
        }
      }
      /**
       * @en Bind sampler to the specified descriptor.
       * @zh 在指定的描述符位置上绑定采样器。
       * @param binding The target binding.
       * @param sampler The sampler to be bound.
       */

    }, {
      key: "bindSampler",
      value: function bindSampler(binding, sampler) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var info = this._layout.bindings[binding];
        var descriptorIndex = this._layout.descriptorIndices[binding];

        if (info && info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
          if (this._samplers[descriptorIndex + index] !== sampler) {
            this._samplers[descriptorIndex + index] = sampler;
            this._isDirty = true;
          }
        } else {
          console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
        }
      }
      /**
       * @en Bind texture to the specified descriptor.
       * @zh 在指定的描述符位置上绑定纹理。
       * @param binding The target binding.
       * @param texture The texture to be bound.
       */

    }, {
      key: "bindTexture",
      value: function bindTexture(binding, texture) {
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var info = this._layout.bindings[binding];
        var descriptorIndex = this._layout.descriptorIndices[binding];

        if (info && info.descriptorType & DESCRIPTOR_SAMPLER_TYPE) {
          if (this._textures[descriptorIndex + index] !== texture) {
            this._textures[descriptorIndex + index] = texture;
            this._isDirty = true;
          }
        } else {
          console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
        }
      }
      /**
       * @en Get buffer from the specified binding location.
       * @zh 获取当前指定绑定位置上的缓冲。
       * @param binding The target binding.
       */

    }, {
      key: "getBuffer",
      value: function getBuffer(binding) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var descriptorIndex = this._layout.descriptorIndices[binding];
        return this._buffers[descriptorIndex + index];
      }
      /**
       * @en Get sampler from the specified binding location.
       * @zh 获取当前指定绑定位置上的采样器。
       * @param binding The target binding.
       */

    }, {
      key: "getSampler",
      value: function getSampler(binding) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var descriptorIndex = this._layout.descriptorIndices[binding];
        return this._samplers[descriptorIndex + index];
      }
      /**
       * @en Get texture from the specified binding location.
       * @zh 获取当前指定绑定位置上的贴图。
       * @param binding The target binding.
       */

    }, {
      key: "getTexture",
      value: function getTexture(binding) {
        var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var descriptorIndex = this._layout.descriptorIndices[binding];
        return this._textures[descriptorIndex + index];
      }
    }]);

    return GFXDescriptorSet;
  }(_define.GFXObject);

  _exports.GFXDescriptorSet = GFXDescriptorSet;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2Rlc2NyaXB0b3Itc2V0LnRzIl0sIm5hbWVzIjpbIkRFU0NSSVBUT1JfQlVGRkVSX1RZUEUiLCJHRlhEZXNjcmlwdG9yVHlwZSIsIlVOSUZPUk1fQlVGRkVSIiwiRFlOQU1JQ19VTklGT1JNX0JVRkZFUiIsIlNUT1JBR0VfQlVGRkVSIiwiRFlOQU1JQ19TVE9SQUdFX0JVRkZFUiIsIkRFU0NSSVBUT1JfU0FNUExFUl9UWVBFIiwiU0FNUExFUiIsIkdGWERlc2NyaXB0b3JTZXRJbmZvIiwibGF5b3V0IiwiR0ZYRGVzY3JpcHRvclNldCIsIl9sYXlvdXQiLCJkZXZpY2UiLCJHRlhPYmplY3RUeXBlIiwiREVTQ1JJUFRPUl9TRVQiLCJfZGV2aWNlIiwiX2J1ZmZlcnMiLCJfdGV4dHVyZXMiLCJfc2FtcGxlcnMiLCJfaXNEaXJ0eSIsImJpbmRpbmciLCJidWZmZXIiLCJpbmRleCIsImluZm8iLCJiaW5kaW5ncyIsImRlc2NyaXB0b3JJbmRleCIsImRlc2NyaXB0b3JJbmRpY2VzIiwiZGVzY3JpcHRvclR5cGUiLCJjb25zb2xlIiwiZXJyb3IiLCJzYW1wbGVyIiwidGV4dHVyZSIsIkdGWE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXTyxNQUFNQSxzQkFBc0IsR0FDL0JDLDBCQUFrQkMsY0FBbEIsR0FBbUNELDBCQUFrQkUsc0JBQXJELEdBQ0FGLDBCQUFrQkcsY0FEbEIsR0FDbUNILDBCQUFrQkksc0JBRmxEOztBQUlBLE1BQU1DLHVCQUF1QixHQUFHTCwwQkFBa0JNLE9BQWxEOzs7TUFFTUMsb0IsR0FDcUI7QUFFOUIsZ0NBQ1dDLE1BRFgsRUFFRTtBQUFBOztBQUFBLFNBRFNBLE1BQ1QsR0FEU0EsTUFDVDtBQUFFLEc7QUFHUjs7Ozs7Ozs7TUFJc0JDLGdCOzs7OzswQkFFSjtBQUNWLGVBQU8sS0FBS0MsT0FBWjtBQUNI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UUFBTCxDQUFjUyxlQUFlLEdBQUdILEtBQWhDLENBQVA7QUFDSDtBQUVEOzs7Ozs7OztpQ0FLbUJGLE8sRUFBNEI7QUFBQSxZQUFYRSxLQUFXLHVFQUFILENBQUc7QUFDM0MsWUFBTUcsZUFBZSxHQUFHLEtBQUtkLE9BQUwsQ0FBY2UsaUJBQWQsQ0FBZ0NOLE9BQWhDLENBQXhCO0FBQ0EsZUFBTyxLQUFLRixTQUFMLENBQWVPLGVBQWUsR0FBR0gsS0FBakMsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7O2lDQUttQkYsTyxFQUE0QjtBQUFBLFlBQVhFLEtBQVcsdUVBQUgsQ0FBRztBQUMzQyxZQUFNRyxlQUFlLEdBQUcsS0FBS2QsT0FBTCxDQUFjZSxpQkFBZCxDQUFnQ04sT0FBaEMsQ0FBeEI7QUFDQSxlQUFPLEtBQUtILFNBQUwsQ0FBZVEsZUFBZSxHQUFHSCxLQUFqQyxDQUFQO0FBQ0g7Ozs7SUEvRzBDVSxpQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYQnVmZmVyIH0gZnJvbSAnLi9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yVHlwZSwgR0ZYT2JqZWN0LCBHRlhPYmplY3RUeXBlIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIgfSBmcm9tICcuL3NhbXBsZXInO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlIH0gZnJvbSAnLi90ZXh0dXJlJztcclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vZGVzY3JpcHRvci1zZXQtbGF5b3V0JztcclxuXHJcbmV4cG9ydCBjb25zdCBERVNDUklQVE9SX0JVRkZFUl9UWVBFID1cclxuICAgIEdGWERlc2NyaXB0b3JUeXBlLlVOSUZPUk1fQlVGRkVSIHwgR0ZYRGVzY3JpcHRvclR5cGUuRFlOQU1JQ19VTklGT1JNX0JVRkZFUiB8XHJcbiAgICBHRlhEZXNjcmlwdG9yVHlwZS5TVE9SQUdFX0JVRkZFUiB8IEdGWERlc2NyaXB0b3JUeXBlLkRZTkFNSUNfU1RPUkFHRV9CVUZGRVI7XHJcblxyXG5leHBvcnQgY29uc3QgREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUgPSBHRlhEZXNjcmlwdG9yVHlwZS5TQU1QTEVSO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdGWERlc2NyaXB0b3JTZXRJbmZvIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgbGF5b3V0OiBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0LFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBkZXNjcmlwdG9yIHNldHMuXHJcbiAqIEB6aCBHRlgg5o+P6L+w56ym6ZuG57uE44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYRGVzY3JpcHRvclNldCBleHRlbmRzIEdGWE9iamVjdCB7XHJcblxyXG4gICAgZ2V0IGxheW91dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheW91dCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2U6IEdGWERldmljZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2xheW91dDogR0ZYRGVzY3JpcHRvclNldExheW91dCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9idWZmZXJzOiBHRlhCdWZmZXJbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF90ZXh0dXJlczogR0ZYVGV4dHVyZVtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3NhbXBsZXJzOiBHRlhTYW1wbGVyW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2lzRGlydHkgPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZGV2aWNlOiBHRlhEZXZpY2UpIHtcclxuICAgICAgICBzdXBlcihHRlhPYmplY3RUeXBlLkRFU0NSSVBUT1JfU0VUKTtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGluaXRpYWxpemUgKGluZm86IEdGWERlc2NyaXB0b3JTZXRJbmZvKTogYm9vbGVhbjtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgZGVzdHJveSAoKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgdXBkYXRlICgpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJpbmQgYnVmZmVyIHRvIHRoZSBzcGVjaWZpZWQgZGVzY3JpcHRvci5cclxuICAgICAqIEB6aCDlnKjmjIflrprnmoTmj4/ov7DnrKbkvY3nva7kuIrnu5HlrprnvJPlhrLjgIJcclxuICAgICAqIEBwYXJhbSBiaW5kaW5nIFRoZSB0YXJnZXQgYmluZGluZy5cclxuICAgICAqIEBwYXJhbSBidWZmZXIgVGhlIGJ1ZmZlciB0byBiZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGJpbmRCdWZmZXIgKGJpbmRpbmc6IG51bWJlciwgYnVmZmVyOiBHRlhCdWZmZXIsIGluZGV4ID0gMCkge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9sYXlvdXQhLmJpbmRpbmdzW2JpbmRpbmddO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3JJbmRleCA9IHRoaXMuX2xheW91dCEuZGVzY3JpcHRvckluZGljZXNbYmluZGluZ107XHJcbiAgICAgICAgaWYgKGluZm8gJiYgKGluZm8uZGVzY3JpcHRvclR5cGUgJiBERVNDUklQVE9SX0JVRkZFUl9UWVBFKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYnVmZmVyc1tkZXNjcmlwdG9ySW5kZXggKyBpbmRleF0gIT09IGJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyc1tkZXNjcmlwdG9ySW5kZXggKyBpbmRleF0gPSBidWZmZXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NldHRpbmcgYmluZGluZyBpcyBub3QgR0ZYRGVzY3JpcHRvclR5cGUuVU5JRk9STV9CVUZGRVIuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJpbmQgc2FtcGxlciB0byB0aGUgc3BlY2lmaWVkIGRlc2NyaXB0b3IuXHJcbiAgICAgKiBAemgg5Zyo5oyH5a6a55qE5o+P6L+w56ym5L2N572u5LiK57uR5a6a6YeH5qC35Zmo44CCXHJcbiAgICAgKiBAcGFyYW0gYmluZGluZyBUaGUgdGFyZ2V0IGJpbmRpbmcuXHJcbiAgICAgKiBAcGFyYW0gc2FtcGxlciBUaGUgc2FtcGxlciB0byBiZSBib3VuZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGJpbmRTYW1wbGVyIChiaW5kaW5nOiBudW1iZXIsIHNhbXBsZXI6IEdGWFNhbXBsZXIsIGluZGV4ID0gMCkge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9sYXlvdXQhLmJpbmRpbmdzW2JpbmRpbmddO1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3JJbmRleCA9IHRoaXMuX2xheW91dCEuZGVzY3JpcHRvckluZGljZXNbYmluZGluZ107XHJcbiAgICAgICAgaWYgKGluZm8gJiYgKGluZm8uZGVzY3JpcHRvclR5cGUgJiBERVNDUklQVE9SX1NBTVBMRVJfVFlQRSkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NhbXBsZXJzW2Rlc2NyaXB0b3JJbmRleCArIGluZGV4XSAhPT0gc2FtcGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2FtcGxlcnNbZGVzY3JpcHRvckluZGV4ICsgaW5kZXhdID0gc2FtcGxlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzRGlydHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2V0dGluZyBiaW5kaW5nIGlzIG5vdCBHRlhEZXNjcmlwdG9yVHlwZS5TQU1QTEVSLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCaW5kIHRleHR1cmUgdG8gdGhlIHNwZWNpZmllZCBkZXNjcmlwdG9yLlxyXG4gICAgICogQHpoIOWcqOaMh+WumueahOaPj+i/sOespuS9jee9ruS4iue7keWumue6ueeQhuOAglxyXG4gICAgICogQHBhcmFtIGJpbmRpbmcgVGhlIHRhcmdldCBiaW5kaW5nLlxyXG4gICAgICogQHBhcmFtIHRleHR1cmUgVGhlIHRleHR1cmUgdG8gYmUgYm91bmQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBiaW5kVGV4dHVyZSAoYmluZGluZzogbnVtYmVyLCB0ZXh0dXJlOiBHRlhUZXh0dXJlLCBpbmRleCA9IDApIHtcclxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fbGF5b3V0IS5iaW5kaW5nc1tiaW5kaW5nXTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9ySW5kZXggPSB0aGlzLl9sYXlvdXQhLmRlc2NyaXB0b3JJbmRpY2VzW2JpbmRpbmddO1xyXG4gICAgICAgIGlmIChpbmZvICYmIChpbmZvLmRlc2NyaXB0b3JUeXBlICYgREVTQ1JJUFRPUl9TQU1QTEVSX1RZUEUpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlc1tkZXNjcmlwdG9ySW5kZXggKyBpbmRleF0gIT09IHRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmVzW2Rlc2NyaXB0b3JJbmRleCArIGluZGV4XSA9IHRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NldHRpbmcgYmluZGluZyBpcyBub3QgR0ZYRGVzY3JpcHRvclR5cGUuU0FNUExFUi4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGJ1ZmZlciBmcm9tIHRoZSBzcGVjaWZpZWQgYmluZGluZyBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3mjIflrprnu5HlrprkvY3nva7kuIrnmoTnvJPlhrLjgIJcclxuICAgICAqIEBwYXJhbSBiaW5kaW5nIFRoZSB0YXJnZXQgYmluZGluZy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJ1ZmZlciAoYmluZGluZzogbnVtYmVyLCBpbmRleCA9IDApIHtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9ySW5kZXggPSB0aGlzLl9sYXlvdXQhLmRlc2NyaXB0b3JJbmRpY2VzW2JpbmRpbmddO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9idWZmZXJzW2Rlc2NyaXB0b3JJbmRleCArIGluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgc2FtcGxlciBmcm9tIHRoZSBzcGVjaWZpZWQgYmluZGluZyBsb2NhdGlvbi5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3mjIflrprnu5HlrprkvY3nva7kuIrnmoTph4fmoLflmajjgIJcclxuICAgICAqIEBwYXJhbSBiaW5kaW5nIFRoZSB0YXJnZXQgYmluZGluZy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNhbXBsZXIgKGJpbmRpbmc6IG51bWJlciwgaW5kZXggPSAwKSB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvckluZGV4ID0gdGhpcy5fbGF5b3V0IS5kZXNjcmlwdG9ySW5kaWNlc1tiaW5kaW5nXTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2FtcGxlcnNbZGVzY3JpcHRvckluZGV4ICsgaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0ZXh0dXJlIGZyb20gdGhlIHNwZWNpZmllZCBiaW5kaW5nIGxvY2F0aW9uLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeaMh+Wumue7keWumuS9jee9ruS4iueahOi0tOWbvuOAglxyXG4gICAgICogQHBhcmFtIGJpbmRpbmcgVGhlIHRhcmdldCBiaW5kaW5nLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VGV4dHVyZSAoYmluZGluZzogbnVtYmVyLCBpbmRleCA9IDApIHtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdG9ySW5kZXggPSB0aGlzLl9sYXlvdXQhLmRlc2NyaXB0b3JJbmRpY2VzW2JpbmRpbmddO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlc1tkZXNjcmlwdG9ySW5kZXggKyBpbmRleF07XHJcbiAgICB9XHJcbn1cclxuIl19