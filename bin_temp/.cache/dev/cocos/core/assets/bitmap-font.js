(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "./font.js", "./sprite-frame.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("./font.js"), require("./sprite-frame.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.font, global.spriteFrame, global.globalExports);
    global.bitmapFont = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _font, _spriteFrame, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BitmapFont = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en
   * Class for BitmapFont handling.
   *
   * @zh
   * 位图字体资源类。
   */
  var BitmapFont = (_dec = (0, _index.ccclass)('cc.BitmapFont'), _dec2 = (0, _index.type)(_spriteFrame.SpriteFrame), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Font) {
    _inherits(BitmapFont, _Font);

    function BitmapFont() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, BitmapFont);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BitmapFont)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "fntDataStr", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "spriteFrame", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "fontSize", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "fntConfig", _descriptor4, _assertThisInitialized(_this));

      return _this;
    }

    return BitmapFont;
  }(_font.Font), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "fntDataStr", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "fontSize", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return -1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "fntConfig", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  _exports.BitmapFont = BitmapFont;
  _globalExports.legacyCC.BitmapFont = BitmapFont;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2JpdG1hcC1mb250LnRzIl0sIm5hbWVzIjpbIkJpdG1hcEZvbnQiLCJTcHJpdGVGcmFtZSIsIkZvbnQiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSIsImxlZ2FjeUNDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7Ozs7Ozs7TUFRYUEsVSxXQURaLG9CQUFRLGVBQVIsQyxVQVVJLGlCQUFLQyx3QkFBTCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBVDJCQyxVLHNGQUMzQkMsbUIsRUFDQUMsZTs7Ozs7YUFDbUIsRTs7Ozs7OzthQU9xQixJOzsrRUFNeENELG1CLEVBQ0FDLGU7Ozs7O2FBQ2lCLENBQUMsQzs7Z0ZBTWxCRCxtQixFQUNBQyxlOzs7OzthQUNrQyxJOzs7O0FBR3ZDQywwQkFBU0wsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGFzc2V0XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdHlwZSwgc2VyaWFsaXphYmxlLCBlZGl0YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IEZvbnQgfSBmcm9tICcuL2ZvbnQnO1xyXG5pbXBvcnQgeyBTcHJpdGVGcmFtZSB9IGZyb20gJy4vc3ByaXRlLWZyYW1lJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDb25maWcge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIENsYXNzIGZvciBCaXRtYXBGb250IGhhbmRsaW5nLlxyXG4gKlxyXG4gKiBAemhcclxuICog5L2N5Zu+5a2X5L2T6LWE5rqQ57G744CCXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuQml0bWFwRm9udCcpXHJcbmV4cG9ydCBjbGFzcyBCaXRtYXBGb250IGV4dGVuZHMgRm9udCB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBmbnREYXRhU3RyID0gJyc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIGJpdG1hcCBmb250IOS+nei1lueyvueBteOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcHJpdGVGcmFtZSlcclxuICAgIHB1YmxpYyBzcHJpdGVGcmFtZTogU3ByaXRlRnJhbWUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5paH5a2X5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGZvbnRTaXplID0gLTE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaWh+Wtl+mFjee9ruOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBmbnRDb25maWc6IElDb25maWcgfCBudWxsID0gbnVsbDtcclxufVxyXG5cclxubGVnYWN5Q0MuQml0bWFwRm9udCA9IEJpdG1hcEZvbnQ7XHJcbiJdfQ==