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
    global.shader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXShader = _exports.GFXShaderInfo = _exports.GFXUniformSampler = _exports.GFXUniformBlock = _exports.GFXUniform = _exports.GFXShaderStage = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var GFXShaderStage = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXShaderStage() {
    var stage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXShaderStageFlagBit.NONE;
    var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, GFXShaderStage);

    this.stage = stage;
    this.source = source;
  };

  _exports.GFXShaderStage = GFXShaderStage;

  /**
   * @en GFX uniform.
   * @zh GFX uniform。
   */
  var GFXUniform = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXUniform() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXType.UNKNOWN;
    var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, GFXUniform);

    this.name = name;
    this.type = type;
    this.count = count;
  };
  /**
   * @en GFX uniform block.
   * @zh GFX uniform 块。
   */


  _exports.GFXUniform = GFXUniform;

  var GFXUniformBlock = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXUniformBlock() {
    var set = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var binding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var members = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    _classCallCheck(this, GFXUniformBlock);

    this.set = set;
    this.binding = binding;
    this.name = name;
    this.members = members;
    this.count = count;
  };
  /**
   * @en GFX uniform sampler.
   * @zh GFX Uniform 采样器。
   */


  _exports.GFXUniformBlock = GFXUniformBlock;

  var GFXUniformSampler = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXUniformSampler() {
    var set = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var binding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXType.UNKNOWN;
    var count = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    _classCallCheck(this, GFXUniformSampler);

    this.set = set;
    this.binding = binding;
    this.name = name;
    this.type = type;
    this.count = count;
  };

  _exports.GFXUniformSampler = GFXUniformSampler;

  var GFXShaderInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXShaderInfo() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var stages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var attributes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var blocks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var samplers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

    _classCallCheck(this, GFXShaderInfo);

    this.name = name;
    this.stages = stages;
    this.attributes = attributes;
    this.blocks = blocks;
    this.samplers = samplers;
  };
  /**
   * @en GFX shader.
   * @zh GFX 着色器。
   */


  _exports.GFXShaderInfo = GFXShaderInfo;

  var GFXShader = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXShader, _GFXObject);

    _createClass(GFXShader, [{
      key: "id",

      /**
       * @en Get current shader id.
       * @zh 着色器 id。
       */
      get: function get() {
        return this._id;
      }
      /**
       * @en Get current shader name.
       * @zh 着色器名称。
       */

    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }, {
      key: "attributes",
      get: function get() {
        return this._attributes;
      }
    }, {
      key: "blocks",
      get: function get() {
        return this._blocks;
      }
    }, {
      key: "samplers",
      get: function get() {
        return this._samplers;
      }
    }]);

    function GFXShader(device) {
      var _this;

      _classCallCheck(this, GFXShader);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXShader).call(this, _define.GFXObjectType.SHADER));
      _this._device = void 0;
      _this._id = void 0;
      _this._name = '';
      _this._stages = [];
      _this._attributes = [];
      _this._blocks = [];
      _this._samplers = [];
      _this._device = device;
      _this._id = GFXShader._shaderIdGen++;
      return _this;
    }

    return GFXShader;
  }(_define.GFXObject);

  _exports.GFXShader = GFXShader;
  GFXShader._shaderIdGen = 0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3NoYWRlci50cyJdLCJuYW1lcyI6WyJHRlhTaGFkZXJTdGFnZSIsInN0YWdlIiwiR0ZYU2hhZGVyU3RhZ2VGbGFnQml0IiwiTk9ORSIsInNvdXJjZSIsIkdGWFVuaWZvcm0iLCJuYW1lIiwidHlwZSIsIkdGWFR5cGUiLCJVTktOT1dOIiwiY291bnQiLCJHRlhVbmlmb3JtQmxvY2siLCJzZXQiLCJiaW5kaW5nIiwibWVtYmVycyIsIkdGWFVuaWZvcm1TYW1wbGVyIiwiR0ZYU2hhZGVySW5mbyIsInN0YWdlcyIsImF0dHJpYnV0ZXMiLCJibG9ja3MiLCJzYW1wbGVycyIsIkdGWFNoYWRlciIsIl9pZCIsIl9uYW1lIiwiX2F0dHJpYnV0ZXMiLCJfYmxvY2tzIiwiX3NhbXBsZXJzIiwiZGV2aWNlIiwiR0ZYT2JqZWN0VHlwZSIsIlNIQURFUiIsIl9kZXZpY2UiLCJfc3RhZ2VzIiwiX3NoYWRlcklkR2VuIiwiR0ZYT2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWFhQSxjLEdBQ3FCO0FBRTlCLDRCQUdFO0FBQUEsUUFGU0MsS0FFVCx1RUFGd0NDLDhCQUFzQkMsSUFFOUQ7QUFBQSxRQURTQyxNQUNULHVFQUQwQixFQUMxQjs7QUFBQTs7QUFBQSxTQUZTSCxLQUVULEdBRlNBLEtBRVQ7QUFBQSxTQURTRyxNQUNULEdBRFNBLE1BQ1Q7QUFBRSxHOzs7O0FBU1I7Ozs7TUFJYUMsVSxHQUNxQjtBQUU5Qix3QkFJRTtBQUFBLFFBSFNDLElBR1QsdUVBSHdCLEVBR3hCO0FBQUEsUUFGU0MsSUFFVCx1RUFGeUJDLGdCQUFRQyxPQUVqQztBQUFBLFFBRFNDLEtBQ1QsdUVBRHlCLENBQ3pCOztBQUFBOztBQUFBLFNBSFNKLElBR1QsR0FIU0EsSUFHVDtBQUFBLFNBRlNDLElBRVQsR0FGU0EsSUFFVDtBQUFBLFNBRFNHLEtBQ1QsR0FEU0EsS0FDVDtBQUFFLEc7QUFHUjs7Ozs7Ozs7TUFJYUMsZSxHQUNxQjtBQUU5Qiw2QkFNRTtBQUFBLFFBTFNDLEdBS1QsdUVBTHVCLENBQUMsQ0FLeEI7QUFBQSxRQUpTQyxPQUlULHVFQUoyQixDQUFDLENBSTVCO0FBQUEsUUFIU1AsSUFHVCx1RUFId0IsRUFHeEI7QUFBQSxRQUZTUSxPQUVULHVFQUZpQyxFQUVqQztBQUFBLFFBRFNKLEtBQ1QsdUVBRHlCLENBQ3pCOztBQUFBOztBQUFBLFNBTFNFLEdBS1QsR0FMU0EsR0FLVDtBQUFBLFNBSlNDLE9BSVQsR0FKU0EsT0FJVDtBQUFBLFNBSFNQLElBR1QsR0FIU0EsSUFHVDtBQUFBLFNBRlNRLE9BRVQsR0FGU0EsT0FFVDtBQUFBLFNBRFNKLEtBQ1QsR0FEU0EsS0FDVDtBQUFFLEc7QUFHUjs7Ozs7Ozs7TUFJYUssaUIsR0FDcUI7QUFFOUIsK0JBTUU7QUFBQSxRQUxTSCxHQUtULHVFQUx1QixDQUFDLENBS3hCO0FBQUEsUUFKU0MsT0FJVCx1RUFKMkIsQ0FBQyxDQUk1QjtBQUFBLFFBSFNQLElBR1QsdUVBSHdCLEVBR3hCO0FBQUEsUUFGU0MsSUFFVCx1RUFGeUJDLGdCQUFRQyxPQUVqQztBQUFBLFFBRFNDLEtBQ1QsdUVBRHlCLENBQ3pCOztBQUFBOztBQUFBLFNBTFNFLEdBS1QsR0FMU0EsR0FLVDtBQUFBLFNBSlNDLE9BSVQsR0FKU0EsT0FJVDtBQUFBLFNBSFNQLElBR1QsR0FIU0EsSUFHVDtBQUFBLFNBRlNDLElBRVQsR0FGU0EsSUFFVDtBQUFBLFNBRFNHLEtBQ1QsR0FEU0EsS0FDVDtBQUFFLEc7Ozs7TUFHS00sYSxHQUNxQjtBQUU5QiwyQkFNRTtBQUFBLFFBTFNWLElBS1QsdUVBTHdCLEVBS3hCO0FBQUEsUUFKU1csTUFJVCx1RUFKb0MsRUFJcEM7QUFBQSxRQUhTQyxVQUdULHVFQUhzQyxFQUd0QztBQUFBLFFBRlNDLE1BRVQsdUVBRnFDLEVBRXJDO0FBQUEsUUFEU0MsUUFDVCx1RUFEeUMsRUFDekM7O0FBQUE7O0FBQUEsU0FMU2QsSUFLVCxHQUxTQSxJQUtUO0FBQUEsU0FKU1csTUFJVCxHQUpTQSxNQUlUO0FBQUEsU0FIU0MsVUFHVCxHQUhTQSxVQUdUO0FBQUEsU0FGU0MsTUFFVCxHQUZTQSxNQUVUO0FBQUEsU0FEU0MsUUFDVCxHQURTQSxRQUNUO0FBQUUsRztBQUdSOzs7Ozs7OztNQUlzQkMsUzs7Ozs7O0FBR2xCOzs7OzBCQUl5QjtBQUNyQixlQUFPLEtBQUtDLEdBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUkyQjtBQUN2QixlQUFPLEtBQUtDLEtBQVo7QUFDSDs7OzBCQUV3QjtBQUNyQixlQUFPLEtBQUtDLFdBQVo7QUFDSDs7OzBCQUVvQjtBQUNqQixlQUFPLEtBQUtDLE9BQVo7QUFDSDs7OzBCQUVzQjtBQUNuQixlQUFPLEtBQUtDLFNBQVo7QUFDSDs7O0FBZ0JELHVCQUFhQyxNQUFiLEVBQWdDO0FBQUE7O0FBQUE7O0FBQzVCLHFGQUFNQyxzQkFBY0MsTUFBcEI7QUFENEIsWUFkdEJDLE9BY3NCO0FBQUEsWUFadEJSLEdBWXNCO0FBQUEsWUFWdEJDLEtBVXNCLEdBVk4sRUFVTTtBQUFBLFlBUnRCUSxPQVFzQixHQVJNLEVBUU47QUFBQSxZQU50QlAsV0FNc0IsR0FOUSxFQU1SO0FBQUEsWUFKdEJDLE9BSXNCLEdBSk8sRUFJUDtBQUFBLFlBRnRCQyxTQUVzQixHQUZXLEVBRVg7QUFFNUIsWUFBS0ksT0FBTCxHQUFlSCxNQUFmO0FBQ0EsWUFBS0wsR0FBTCxHQUFXRCxTQUFTLENBQUNXLFlBQVYsRUFBWDtBQUg0QjtBQUkvQjs7O0lBakRtQ0MsaUI7OztBQUFsQlosRUFBQUEsUyxDQUNIVyxZLEdBQXVCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWE9iamVjdCwgR0ZYT2JqZWN0VHlwZSwgR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LCBHRlhUeXBlIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZSB9IGZyb20gJy4vaW5wdXQtYXNzZW1ibGVyJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUdGWFNoYWRlclN0YWdlIHtcclxuICAgIHN0YWdlOiBHRlhTaGFkZXJTdGFnZUZsYWdCaXQ7XHJcbiAgICBzb3VyY2U6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdGWFNoYWRlclN0YWdlIGltcGxlbWVudHMgSUdGWFNoYWRlclN0YWdlIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgc3RhZ2U6IEdGWFNoYWRlclN0YWdlRmxhZ0JpdCA9IEdGWFNoYWRlclN0YWdlRmxhZ0JpdC5OT05FLFxyXG4gICAgICAgIHB1YmxpYyBzb3VyY2U6IHN0cmluZyA9ICcnLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElHRlhVbmlmb3JtIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHR5cGU6IEdGWFR5cGU7XHJcbiAgICBjb3VudDogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCB1bmlmb3JtLlxyXG4gKiBAemggR0ZYIHVuaWZvcm3jgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHRlhVbmlmb3JtIGltcGxlbWVudHMgSUdGWFVuaWZvcm0ge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnJyxcclxuICAgICAgICBwdWJsaWMgdHlwZTogR0ZYVHlwZSA9IEdGWFR5cGUuVU5LTk9XTixcclxuICAgICAgICBwdWJsaWMgY291bnQ6IG51bWJlciA9IDEsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIHVuaWZvcm0gYmxvY2suXHJcbiAqIEB6aCBHRlggdW5pZm9ybSDlnZfjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHRlhVbmlmb3JtQmxvY2sge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBzZXQ6IG51bWJlciA9IC0xLFxyXG4gICAgICAgIHB1YmxpYyBiaW5kaW5nOiBudW1iZXIgPSAtMSxcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gJycsXHJcbiAgICAgICAgcHVibGljIG1lbWJlcnM6IEdGWFVuaWZvcm1bXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBjb3VudDogbnVtYmVyID0gMSxcclxuICAgICkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggdW5pZm9ybSBzYW1wbGVyLlxyXG4gKiBAemggR0ZYIFVuaWZvcm0g6YeH5qC35Zmo44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR0ZYVW5pZm9ybVNhbXBsZXIge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBzZXQ6IG51bWJlciA9IC0xLFxyXG4gICAgICAgIHB1YmxpYyBiaW5kaW5nOiBudW1iZXIgPSAtMSxcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gJycsXHJcbiAgICAgICAgcHVibGljIHR5cGU6IEdGWFR5cGUgPSBHRlhUeXBlLlVOS05PV04sXHJcbiAgICAgICAgcHVibGljIGNvdW50OiBudW1iZXIgPSAxLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYU2hhZGVySW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZyA9ICcnLFxyXG4gICAgICAgIHB1YmxpYyBzdGFnZXM6IEdGWFNoYWRlclN0YWdlW10gPSBbXSxcclxuICAgICAgICBwdWJsaWMgYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXSxcclxuICAgICAgICBwdWJsaWMgYmxvY2tzOiBHRlhVbmlmb3JtQmxvY2tbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBzYW1wbGVyczogR0ZYVW5pZm9ybVNhbXBsZXJbXSA9IFtdLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBzaGFkZXIuXHJcbiAqIEB6aCBHRlgg552A6Imy5Zmo44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYU2hhZGVyIGV4dGVuZHMgR0ZYT2JqZWN0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9zaGFkZXJJZEdlbjogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBzaGFkZXIgaWQuXHJcbiAgICAgKiBAemgg552A6Imy5ZmoIGlk44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaWQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHNoYWRlciBuYW1lLlxyXG4gICAgICogQHpoIOedgOiJsuWZqOWQjeensOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUgKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBhdHRyaWJ1dGVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGJsb2NrcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jsb2NrcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNhbXBsZXJzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2FtcGxlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2U6IEdGWERldmljZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2lkOiBudW1iZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9uYW1lOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N0YWdlczogR0ZYU2hhZGVyU3RhZ2VbXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Jsb2NrczogR0ZYVW5pZm9ybUJsb2NrW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NhbXBsZXJzOiBHRlhVbmlmb3JtU2FtcGxlcltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoR0ZYT2JqZWN0VHlwZS5TSEFERVIpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgICAgICB0aGlzLl9pZCA9IEdGWFNoYWRlci5fc2hhZGVySWRHZW4rKztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYU2hhZGVySW5mbyk6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGRlc3Ryb3kgKCk6IHZvaWQ7XHJcbn1cclxuIl19