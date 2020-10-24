(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../gfx/index.js", "../global-exports.js", "./asset.js", "../renderer/core/sampler-lib.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../gfx/index.js"), require("../global-exports.js"), require("./asset.js"), require("../renderer/core/sampler-lib.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports, global.asset, global.samplerLib);
    global.renderTexture = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports, _asset, _samplerLib) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderTexture = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var _colorAttachment = new _index2.GFXColorAttachment();

  _colorAttachment.endLayout = _index2.GFXTextureLayout.SHADER_READONLY_OPTIMAL;

  var _depthStencilAttachment = new _index2.GFXDepthStencilAttachment();

  var passInfo = new _index2.GFXRenderPassInfo([_colorAttachment], _depthStencilAttachment);
  var _windowInfo = {
    width: 1,
    height: 1,
    renderPassInfo: passInfo
  };
  var RenderTexture = (_dec = (0, _index.ccclass)('cc.RenderTexture'), _dec2 = (0, _index.rangeMin)(1), _dec3 = (0, _index.rangeMax)(2048), _dec4 = (0, _index.rangeMin)(1), _dec5 = (0, _index.rangeMax)(2048), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(RenderTexture, _Asset);

    function RenderTexture() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RenderTexture);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RenderTexture)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_width", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_height", _descriptor2, _assertThisInitialized(_this));

      _this._window = null;
      return _this;
    }

    _createClass(RenderTexture, [{
      key: "initialize",
      value: function initialize(info) {
        this._name = info.name || '';
        this._width = info.width;
        this._height = info.height;

        this._initWindow(info);
      }
    }, {
      key: "reset",
      value: function reset(info) {
        // to be consistent with other assets
        this.initialize(info);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._window) {
          var root = _globalExports.legacyCC.director.root;
          root.destroyWindow(this._window);
          this._window = null;
        }

        return _get(_getPrototypeOf(RenderTexture.prototype), "destroy", this).call(this);
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        this._width = width;
        this._height = height;

        if (this._window) {
          this._window.resize(width, height);
        }

        this.emit('resize', this._window);
      } // To be compatible with material property interface

    }, {
      key: "getGFXTexture",
      value: function getGFXTexture() {
        return this._window && this._window.framebuffer.colorTextures[0];
      }
    }, {
      key: "getGFXSampler",
      value: function getGFXSampler() {
        var root = _globalExports.legacyCC.director.root;
        return _samplerLib.samplerLib.getSampler(root.device, _samplerLib.defaultSamplerHash);
      }
    }, {
      key: "onLoaded",
      value: function onLoaded() {
        this._initWindow();

        this.loaded = true;
        this.emit('load');
      }
    }, {
      key: "_initWindow",
      value: function _initWindow(info) {
        var root = _globalExports.legacyCC.director.root;
        _windowInfo.title = this._name;
        _windowInfo.width = this._width;
        _windowInfo.height = this._height;
        _windowInfo.renderPassInfo = info && info.passInfo ? info.passInfo : passInfo;

        if (this._window) {
          this._window.destroy();

          this._window.initialize(root.device, _windowInfo);
        } else {
          this._window = root.createWindow(_windowInfo);
        }
      }
    }, {
      key: "width",
      get: function get() {
        return this._width;
      }
    }, {
      key: "height",
      get: function get() {
        return this._height;
      }
    }, {
      key: "window",
      get: function get() {
        return this._window;
      }
    }]);

    return RenderTexture;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_width", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_height", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "width", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "width"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "height", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "height"), _class2.prototype)), _class2)) || _class);
  _exports.RenderTexture = RenderTexture;
  _globalExports.legacyCC.RenderTexture = RenderTexture;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3JlbmRlci10ZXh0dXJlLnRzIl0sIm5hbWVzIjpbIl9jb2xvckF0dGFjaG1lbnQiLCJHRlhDb2xvckF0dGFjaG1lbnQiLCJlbmRMYXlvdXQiLCJHRlhUZXh0dXJlTGF5b3V0IiwiU0hBREVSX1JFQURPTkxZX09QVElNQUwiLCJfZGVwdGhTdGVuY2lsQXR0YWNobWVudCIsIkdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQiLCJwYXNzSW5mbyIsIkdGWFJlbmRlclBhc3NJbmZvIiwiX3dpbmRvd0luZm8iLCJ3aWR0aCIsImhlaWdodCIsInJlbmRlclBhc3NJbmZvIiwiUmVuZGVyVGV4dHVyZSIsIl93aW5kb3ciLCJpbmZvIiwiX25hbWUiLCJuYW1lIiwiX3dpZHRoIiwiX2hlaWdodCIsIl9pbml0V2luZG93IiwiaW5pdGlhbGl6ZSIsInJvb3QiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwiZGVzdHJveVdpbmRvdyIsInJlc2l6ZSIsImVtaXQiLCJmcmFtZWJ1ZmZlciIsImNvbG9yVGV4dHVyZXMiLCJzYW1wbGVyTGliIiwiZ2V0U2FtcGxlciIsImRldmljZSIsImRlZmF1bHRTYW1wbGVySGFzaCIsImxvYWRlZCIsInRpdGxlIiwiZGVzdHJveSIsImNyZWF0ZVdpbmRvdyIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDQSxNQUFNQSxnQkFBZ0IsR0FBRyxJQUFJQywwQkFBSixFQUF6Qjs7QUFDQUQsRUFBQUEsZ0JBQWdCLENBQUNFLFNBQWpCLEdBQTZCQyx5QkFBaUJDLHVCQUE5Qzs7QUFDQSxNQUFNQyx1QkFBdUIsR0FBRyxJQUFJQyxpQ0FBSixFQUFoQzs7QUFDQSxNQUFNQyxRQUFRLEdBQUcsSUFBSUMseUJBQUosQ0FBc0IsQ0FBQ1IsZ0JBQUQsQ0FBdEIsRUFBMENL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LGVBQU8sS0FBS0wsT0FBWjtBQUNIOzs7O0lBeEI4QndCLFksa0ZBRTlCQyxtQjs7Ozs7YUFDZ0IsQzs7OEVBRWhCQSxtQjs7Ozs7YUFDaUIsQzs7OztBQWlGdEJoQiwwQkFBU1YsYUFBVCxHQUF5QkEsYUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGFzc2V0XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgcmFuZ2VNaW4sIHJhbmdlTWF4LCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBHRlhUZXh0dXJlLCBHRlhTYW1wbGVyLCBHRlhDb2xvckF0dGFjaG1lbnQsIEdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQsIEdGWFRleHR1cmVMYXlvdXQsIEdGWFJlbmRlclBhc3NJbmZvIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFJlbmRlcldpbmRvdyB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvcmVuZGVyLXdpbmRvdyc7XHJcbmltcG9ydCB7IElSZW5kZXJXaW5kb3dJbmZvIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9yZW5kZXItd2luZG93JztcclxuaW1wb3J0IHsgUm9vdCB9IGZyb20gJy4uL3Jvb3QnO1xyXG5pbXBvcnQgeyBBc3NldCB9IGZyb20gJy4vYXNzZXQnO1xyXG5pbXBvcnQgeyBzYW1wbGVyTGliLCBkZWZhdWx0U2FtcGxlckhhc2ggfSBmcm9tICcuLi9yZW5kZXJlci9jb3JlL3NhbXBsZXItbGliJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlclRleHR1cmVDcmVhdGVJbmZvIHtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwYXNzSW5mbz86IEdGWFJlbmRlclBhc3NJbmZvO1xyXG59XHJcblxyXG5jb25zdCBfY29sb3JBdHRhY2htZW50ID0gbmV3IEdGWENvbG9yQXR0YWNobWVudCgpO1xyXG5fY29sb3JBdHRhY2htZW50LmVuZExheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuU0hBREVSX1JFQURPTkxZX09QVElNQUw7XHJcbmNvbnN0IF9kZXB0aFN0ZW5jaWxBdHRhY2htZW50ID0gbmV3IEdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQoKTtcclxuY29uc3QgcGFzc0luZm8gPSBuZXcgR0ZYUmVuZGVyUGFzc0luZm8oW19jb2xvckF0dGFjaG1lbnRdLCBfZGVwdGhTdGVuY2lsQXR0YWNobWVudCk7XHJcblxyXG5jb25zdCBfd2luZG93SW5mbzogSVJlbmRlcldpbmRvd0luZm8gPSB7XHJcbiAgICB3aWR0aDogMSxcclxuICAgIGhlaWdodDogMSxcclxuICAgIHJlbmRlclBhc3NJbmZvOiBwYXNzSW5mbyxcclxufTtcclxuXHJcbkBjY2NsYXNzKCdjYy5SZW5kZXJUZXh0dXJlJylcclxuZXhwb3J0IGNsYXNzIFJlbmRlclRleHR1cmUgZXh0ZW5kcyBBc3NldCB7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfd2lkdGggPSAxO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2hlaWdodCA9IDE7XHJcblxyXG4gICAgcHJpdmF0ZSBfd2luZG93OiBSZW5kZXJXaW5kb3cgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBAcmFuZ2VNaW4oMSlcclxuICAgIEByYW5nZU1heCgyMDQ4KVxyXG4gICAgZ2V0IHdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgQHJhbmdlTWluKDEpXHJcbiAgICBAcmFuZ2VNYXgoMjA0OClcclxuICAgIGdldCBoZWlnaHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdpbmRvdyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclRleHR1cmVDcmVhdGVJbmZvKSB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGluZm8ubmFtZSB8fCAnJztcclxuICAgICAgICB0aGlzLl93aWR0aCA9IGluZm8ud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaW5mby5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5faW5pdFdpbmRvdyhpbmZvKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZXNldCAoaW5mbzogSVJlbmRlclRleHR1cmVDcmVhdGVJbmZvKSB7IC8vIHRvIGJlIGNvbnNpc3RlbnQgd2l0aCBvdGhlciBhc3NldHNcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl93aW5kb3cpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm9vdCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QgYXMgUm9vdDtcclxuICAgICAgICAgICAgcm9vdC5kZXN0cm95V2luZG93KHRoaXMuX3dpbmRvdyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZXNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX3dpbmRvdykge1xyXG4gICAgICAgICAgICB0aGlzLl93aW5kb3cucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXQoJ3Jlc2l6ZScsIHRoaXMuX3dpbmRvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVG8gYmUgY29tcGF0aWJsZSB3aXRoIG1hdGVyaWFsIHByb3BlcnR5IGludGVyZmFjZVxyXG4gICAgcHVibGljIGdldEdGWFRleHR1cmUgKCk6IEdGWFRleHR1cmUgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2luZG93ICYmIHRoaXMuX3dpbmRvdy5mcmFtZWJ1ZmZlci5jb2xvclRleHR1cmVzWzBdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEdGWFNhbXBsZXIgKCk6IEdGWFNhbXBsZXIge1xyXG4gICAgICAgIGNvbnN0IHJvb3QgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290IGFzIFJvb3Q7XHJcbiAgICAgICAgcmV0dXJuIHNhbXBsZXJMaWIuZ2V0U2FtcGxlcihyb290LmRldmljZSwgZGVmYXVsdFNhbXBsZXJIYXNoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkZWQgKCkge1xyXG4gICAgICAgIHRoaXMuX2luaXRXaW5kb3coKTtcclxuICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbml0V2luZG93IChpbmZvPzogSVJlbmRlclRleHR1cmVDcmVhdGVJbmZvKSB7XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QgYXMgUm9vdDtcclxuXHJcbiAgICAgICAgX3dpbmRvd0luZm8udGl0bGUgPSB0aGlzLl9uYW1lO1xyXG4gICAgICAgIF93aW5kb3dJbmZvLndpZHRoID0gdGhpcy5fd2lkdGg7XHJcbiAgICAgICAgX3dpbmRvd0luZm8uaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIF93aW5kb3dJbmZvLnJlbmRlclBhc3NJbmZvID0gaW5mbyAmJiBpbmZvLnBhc3NJbmZvID8gaW5mby5wYXNzSW5mbyA6IHBhc3NJbmZvO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fd2luZG93KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdy5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpbmRvdy5pbml0aWFsaXplKHJvb3QuZGV2aWNlLCBfd2luZG93SW5mbyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fd2luZG93ID0gcm9vdC5jcmVhdGVXaW5kb3coX3dpbmRvd0luZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuUmVuZGVyVGV4dHVyZSA9IFJlbmRlclRleHR1cmU7XHJcbiJdfQ==