(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "../utils/murmurhash2_gc.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("../utils/murmurhash2_gc.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.murmurhash2_gc);
    global.renderPass = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _murmurhash2_gc) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXRenderPass = _exports.GFXRenderPassInfo = _exports.GFXSubPassInfo = _exports.GFXDepthStencilAttachment = _exports.GFXColorAttachment = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  /**
   * @en Color attachment.
   * @zh GFX 颜色附件。
   */
  var GFXColorAttachment = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXColorAttachment() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXFormat.UNKNOWN;
    var sampleCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var loadOp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXLoadOp.CLEAR;
    var storeOp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXStoreOp.STORE;
    var beginLayout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXTextureLayout.UNDEFINED;
    var endLayout = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _define.GFXTextureLayout.PRESENT_SRC;

    _classCallCheck(this, GFXColorAttachment);

    this.format = format;
    this.sampleCount = sampleCount;
    this.loadOp = loadOp;
    this.storeOp = storeOp;
    this.beginLayout = beginLayout;
    this.endLayout = endLayout;
  };
  /**
   * @en Depth stencil attachment.
   * @zh GFX 深度模板附件。
   */


  _exports.GFXColorAttachment = GFXColorAttachment;

  var GFXDepthStencilAttachment = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXDepthStencilAttachment() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXFormat.UNKNOWN;
    var sampleCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var depthLoadOp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXLoadOp.CLEAR;
    var depthStoreOp = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXStoreOp.STORE;
    var stencilLoadOp = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXLoadOp.CLEAR;
    var stencilStoreOp = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _define.GFXStoreOp.STORE;
    var beginLayout = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _define.GFXTextureLayout.UNDEFINED;
    var endLayout = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _define.GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

    _classCallCheck(this, GFXDepthStencilAttachment);

    this.format = format;
    this.sampleCount = sampleCount;
    this.depthLoadOp = depthLoadOp;
    this.depthStoreOp = depthStoreOp;
    this.stencilLoadOp = stencilLoadOp;
    this.stencilStoreOp = stencilStoreOp;
    this.beginLayout = beginLayout;
    this.endLayout = endLayout;
  };

  _exports.GFXDepthStencilAttachment = GFXDepthStencilAttachment;

  var GFXSubPassInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXSubPassInfo() {
    var bindPoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _define.GFXPipelineBindPoint.GRAPHICS;
    var inputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var colors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var resolves = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
    var depthStencil = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
    var preserves = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

    _classCallCheck(this, GFXSubPassInfo);

    this.bindPoint = bindPoint;
    this.inputs = inputs;
    this.colors = colors;
    this.resolves = resolves;
    this.depthStencil = depthStencil;
    this.preserves = preserves;
  };

  _exports.GFXSubPassInfo = GFXSubPassInfo;

  var GFXRenderPassInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXRenderPassInfo() {
    var colorAttachments = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var depthStencilAttachment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var subPasses = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, GFXRenderPassInfo);

    this.colorAttachments = colorAttachments;
    this.depthStencilAttachment = depthStencilAttachment;
    this.subPasses = subPasses;
  };
  /**
   * @en GFX render pass.
   * @zh GFX 渲染过程。
   */


  _exports.GFXRenderPassInfo = GFXRenderPassInfo;

  var GFXRenderPass = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXRenderPass, _GFXObject);

    _createClass(GFXRenderPass, [{
      key: "colorAttachments",
      get: function get() {
        return this._colorInfos;
      }
    }, {
      key: "depthStencilAttachment",
      get: function get() {
        return this._depthStencilInfo;
      }
    }, {
      key: "subPasses",
      get: function get() {
        return this._subPasses;
      }
    }, {
      key: "hash",
      get: function get() {
        return this._hash;
      }
    }]);

    function GFXRenderPass(device) {
      var _this;

      _classCallCheck(this, GFXRenderPass);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXRenderPass).call(this, _define.GFXObjectType.RENDER_PASS));
      _this._device = void 0;
      _this._colorInfos = [];
      _this._depthStencilInfo = null;
      _this._subPasses = [];
      _this._hash = 0;
      _this._device = device;
      return _this;
    }

    _createClass(GFXRenderPass, [{
      key: "computeHash",
      // Based on render pass compatibility
      value: function computeHash() {
        var res = '';

        if (this._subPasses.length) {
          for (var i = 0; i < this._subPasses.length; ++i) {
            var subpass = this._subPasses[i];

            if (subpass.inputs.length) {
              res += 'ia';

              for (var j = 0; j < subpass.inputs.length; ++j) {
                var ia = this._colorInfos[subpass.inputs[j]];
                res += ",".concat(ia.format, ",").concat(ia.sampleCount);
              }
            }

            if (subpass.colors.length) {
              res += 'ca';

              for (var _j = 0; _j < subpass.inputs.length; ++_j) {
                var ca = this._colorInfos[subpass.inputs[_j]];
                res += ",".concat(ca.format, ",").concat(ca.sampleCount);
              }
            }

            if (subpass.depthStencil >= 0) {
              var ds = this._colorInfos[subpass.depthStencil];
              res += "ds,".concat(ds.format, ",").concat(ds.sampleCount);
            }
          }
        } else {
          res += 'ca';

          for (var _i = 0; _i < this._colorInfos.length; ++_i) {
            var _ca = this._colorInfos[_i];
            res += ",".concat(_ca.format, ",").concat(_ca.sampleCount);
          }

          var _ds = this._depthStencilInfo;

          if (_ds) {
            res += "ds,".concat(_ds.format, ",").concat(_ds.sampleCount);
          }
        }

        return (0, _murmurhash2_gc.murmurhash2_32_gc)(res, 666);
      }
    }]);

    return GFXRenderPass;
  }(_define.GFXObject);

  _exports.GFXRenderPass = GFXRenderPass;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3JlbmRlci1wYXNzLnRzIl0sIm5hbWVzIjpbIkdGWENvbG9yQXR0YWNobWVudCIsImZvcm1hdCIsIkdGWEZvcm1hdCIsIlVOS05PV04iLCJzYW1wbGVDb3VudCIsImxvYWRPcCIsIkdGWExvYWRPcCIsIkNMRUFSIiwic3RvcmVPcCIsIkdGWFN0b3JlT3AiLCJTVE9SRSIsImJlZ2luTGF5b3V0IiwiR0ZYVGV4dHVyZUxheW91dCIsIlVOREVGSU5FRCIsImVuZExheW91dCIsIlBSRVNFTlRfU1JDIiwiR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCIsImRlcHRoTG9hZE9wIiwiZGVwdGhTdG9yZU9wIiwic3RlbmNpbExvYWRPcCIsInN0ZW5jaWxTdG9yZU9wIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwiLCJHRlhTdWJQYXNzSW5mbyIsImJpbmRQb2ludCIsIkdGWFBpcGVsaW5lQmluZFBvaW50IiwiR1JBUEhJQ1MiLCJpbnB1dHMiLCJjb2xvcnMiLCJyZXNvbHZlcyIsImRlcHRoU3RlbmNpbCIsInByZXNlcnZlcyIsIkdGWFJlbmRlclBhc3NJbmZvIiwiY29sb3JBdHRhY2htZW50cyIsImRlcHRoU3RlbmNpbEF0dGFjaG1lbnQiLCJzdWJQYXNzZXMiLCJHRlhSZW5kZXJQYXNzIiwiX2NvbG9ySW5mb3MiLCJfZGVwdGhTdGVuY2lsSW5mbyIsIl9zdWJQYXNzZXMiLCJfaGFzaCIsImRldmljZSIsIkdGWE9iamVjdFR5cGUiLCJSRU5ERVJfUEFTUyIsIl9kZXZpY2UiLCJyZXMiLCJsZW5ndGgiLCJpIiwic3VicGFzcyIsImoiLCJpYSIsImNhIiwiZHMiLCJHRlhPYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7O01BSWFBLGtCLEdBQ3FCO0FBRTlCLGdDQU9FO0FBQUEsUUFOU0MsTUFNVCx1RUFONkJD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cnQge1xyXG4gICAgR0ZYRm9ybWF0LFxyXG4gICAgR0ZYTG9hZE9wLFxyXG4gICAgR0ZYT2JqZWN0LFxyXG4gICAgR0ZYT2JqZWN0VHlwZSxcclxuICAgIEdGWFBpcGVsaW5lQmluZFBvaW50LFxyXG4gICAgR0ZYU3RvcmVPcCxcclxuICAgIEdGWFRleHR1cmVMYXlvdXQsXHJcbn0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuL2RldmljZSc7XHJcbmltcG9ydCB7IG11cm11cmhhc2gyXzMyX2djIH0gZnJvbSAnLi4vdXRpbHMvbXVybXVyaGFzaDJfZ2MnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBDb2xvciBhdHRhY2htZW50LlxyXG4gKiBAemggR0ZYIOminOiJsumZhOS7tuOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdGWENvbG9yQXR0YWNobWVudCB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGZvcm1hdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV04sXHJcbiAgICAgICAgcHVibGljIHNhbXBsZUNvdW50OiBudW1iZXIgPSAxLFxyXG4gICAgICAgIHB1YmxpYyBsb2FkT3A6IEdGWExvYWRPcCA9IEdGWExvYWRPcC5DTEVBUixcclxuICAgICAgICBwdWJsaWMgc3RvcmVPcDogR0ZYU3RvcmVPcCA9IEdGWFN0b3JlT3AuU1RPUkUsXHJcbiAgICAgICAgcHVibGljIGJlZ2luTGF5b3V0OiBHRlhUZXh0dXJlTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5VTkRFRklORUQsXHJcbiAgICAgICAgcHVibGljIGVuZExheW91dDogR0ZYVGV4dHVyZUxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuUFJFU0VOVF9TUkMsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gRGVwdGggc3RlbmNpbCBhdHRhY2htZW50LlxyXG4gKiBAemggR0ZYIOa3seW6puaooeadv+mZhOS7tuOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBmb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOLFxyXG4gICAgICAgIHB1YmxpYyBzYW1wbGVDb3VudDogbnVtYmVyID0gMSxcclxuICAgICAgICBwdWJsaWMgZGVwdGhMb2FkT3A6IEdGWExvYWRPcCA9IEdGWExvYWRPcC5DTEVBUixcclxuICAgICAgICBwdWJsaWMgZGVwdGhTdG9yZU9wOiBHRlhTdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRSxcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbExvYWRPcDogR0ZYTG9hZE9wID0gR0ZYTG9hZE9wLkNMRUFSLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsU3RvcmVPcDogR0ZYU3RvcmVPcCA9IEdGWFN0b3JlT3AuU1RPUkUsXHJcbiAgICAgICAgcHVibGljIGJlZ2luTGF5b3V0OiBHRlhUZXh0dXJlTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5VTkRFRklORUQsXHJcbiAgICAgICAgcHVibGljIGVuZExheW91dDogR0ZYVGV4dHVyZUxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhTdWJQYXNzSW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGJpbmRQb2ludDogR0ZYUGlwZWxpbmVCaW5kUG9pbnQgPSBHRlhQaXBlbGluZUJpbmRQb2ludC5HUkFQSElDUyxcclxuICAgICAgICBwdWJsaWMgaW5wdXRzOiBudW1iZXJbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBjb2xvcnM6IG51bWJlcltdID0gW10sXHJcbiAgICAgICAgcHVibGljIHJlc29sdmVzOiBudW1iZXJbXSA9IFtdLFxyXG4gICAgICAgIHB1YmxpYyBkZXB0aFN0ZW5jaWw6IG51bWJlciA9IC0xLFxyXG4gICAgICAgIHB1YmxpYyBwcmVzZXJ2ZXM6IG51bWJlcltdID0gW10sXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhSZW5kZXJQYXNzSW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGNvbG9yQXR0YWNobWVudHM6IEdGWENvbG9yQXR0YWNobWVudFtdID0gW10sXHJcbiAgICAgICAgcHVibGljIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQ6IEdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQgfCBudWxsID0gbnVsbCxcclxuICAgICAgICBwdWJsaWMgc3ViUGFzc2VzOiBHRlhTdWJQYXNzSW5mb1tdID0gW10sXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIHJlbmRlciBwYXNzLlxyXG4gKiBAemggR0ZYIOa4suafk+i/h+eoi+OAglxyXG4gKi9cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEdGWFJlbmRlclBhc3MgZXh0ZW5kcyBHRlhPYmplY3Qge1xyXG5cclxuICAgIHByb3RlY3RlZCBfZGV2aWNlOiBHRlhEZXZpY2U7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jb2xvckluZm9zOiBHRlhDb2xvckF0dGFjaG1lbnRbXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZGVwdGhTdGVuY2lsSW5mbzogR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfc3ViUGFzc2VzIDogR0ZYU3ViUGFzc0luZm9bXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaGFzaDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBnZXQgY29sb3JBdHRhY2htZW50cyAoKSB7IHJldHVybiB0aGlzLl9jb2xvckluZm9zOyB9XHJcbiAgICBnZXQgZGVwdGhTdGVuY2lsQXR0YWNobWVudCAoKSB7IHJldHVybiB0aGlzLl9kZXB0aFN0ZW5jaWxJbmZvOyB9XHJcbiAgICBnZXQgc3ViUGFzc2VzICgpIHsgcmV0dXJuIHRoaXMuX3N1YlBhc3NlczsgfVxyXG4gICAgZ2V0IGhhc2ggKCkgeyByZXR1cm4gdGhpcy5faGFzaDsgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChkZXZpY2U6IEdGWERldmljZSkge1xyXG4gICAgICAgIHN1cGVyKEdGWE9iamVjdFR5cGUuUkVOREVSX1BBU1MpO1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IGRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJzdHJhY3QgaW5pdGlhbGl6ZSAoaW5mbzogR0ZYUmVuZGVyUGFzc0luZm8pOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBkZXN0cm95ICgpOiB2b2lkO1xyXG5cclxuICAgIC8vIEJhc2VkIG9uIHJlbmRlciBwYXNzIGNvbXBhdGliaWxpdHlcclxuICAgIHByb3RlY3RlZCBjb21wdXRlSGFzaCAoKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmVzID0gJyc7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N1YlBhc3Nlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zdWJQYXNzZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnBhc3MgPSB0aGlzLl9zdWJQYXNzZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VicGFzcy5pbnB1dHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzICs9ICdpYSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdWJwYXNzLmlucHV0cy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpYSA9IHRoaXMuX2NvbG9ySW5mb3Nbc3VicGFzcy5pbnB1dHNbal1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gYCwke2lhLmZvcm1hdH0sJHtpYS5zYW1wbGVDb3VudH1gO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzdWJwYXNzLmNvbG9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXMgKz0gJ2NhJztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN1YnBhc3MuaW5wdXRzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhID0gdGhpcy5fY29sb3JJbmZvc1tzdWJwYXNzLmlucHV0c1tqXV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyArPSBgLCR7Y2EuZm9ybWF0fSwke2NhLnNhbXBsZUNvdW50fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHN1YnBhc3MuZGVwdGhTdGVuY2lsID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkcyA9IHRoaXMuX2NvbG9ySW5mb3Nbc3VicGFzcy5kZXB0aFN0ZW5jaWxdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcyArPSBgZHMsJHtkcy5mb3JtYXR9LCR7ZHMuc2FtcGxlQ291bnR9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlcyArPSAnY2EnO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NvbG9ySW5mb3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhID0gdGhpcy5fY29sb3JJbmZvc1tpXTtcclxuICAgICAgICAgICAgICAgIHJlcyArPSBgLCR7Y2EuZm9ybWF0fSwke2NhLnNhbXBsZUNvdW50fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgZHMgPSB0aGlzLl9kZXB0aFN0ZW5jaWxJbmZvO1xyXG4gICAgICAgICAgICBpZiAoZHMpIHtcclxuICAgICAgICAgICAgICAgIHJlcyArPSBgZHMsJHtkcy5mb3JtYXR9LCR7ZHMuc2FtcGxlQ291bnR9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG11cm11cmhhc2gyXzMyX2djKHJlcywgNjY2KTtcclxuICAgIH1cclxufVxyXG4iXX0=