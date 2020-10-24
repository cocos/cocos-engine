(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../../renderer/index.js", "./light-component.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../../renderer/index.js"), require("./light-component.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.lightComponent);
    global.directionalLightComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _lightComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.DirectionalLight = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var DirectionalLight = (_dec = (0, _index.ccclass)('cc.DirectionalLight'), _dec2 = (0, _index.help)('i18n:cc.DirectionalLight'), _dec3 = (0, _index.menu)('Light/DirectionalLight'), _dec4 = (0, _index.unit)('lx'), _dec5 = (0, _index.tooltip)('i18n:lights.illuminance'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Light) {
    _inherits(DirectionalLight, _Light);

    _createClass(DirectionalLight, [{
      key: "illuminance",

      /**
       * @en
       * The light source intensity.
       * @zh
       * 光源强度。
       */
      get: function get() {
        return this._illuminance;
      },
      set: function set(val) {
        this._illuminance = val;

        if (this._light) {
          this._light.illuminance = this._illuminance;
        }
      }
    }]);

    function DirectionalLight() {
      var _this;

      _classCallCheck(this, DirectionalLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DirectionalLight).call(this));

      _initializerDefineProperty(_this, "_illuminance", _descriptor, _assertThisInitialized(_this));

      _this._type = _index2.scene.LightType.DIRECTIONAL;
      _this._light = null;
      _this._lightType = _index2.scene.DirectionalLight;
      return _this;
    }

    _createClass(DirectionalLight, [{
      key: "_createLight",
      value: function _createLight() {
        _get(_getPrototypeOf(DirectionalLight.prototype), "_createLight", this).call(this);

        if (!this._light) {
          return;
        }

        this.illuminance = this._illuminance;
      }
    }]);

    return DirectionalLight;
  }(_lightComponent.Light), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_illuminance", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 65000;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "illuminance", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "illuminance"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.DirectionalLight = DirectionalLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL2RpcmVjdGlvbmFsLWxpZ2h0LWNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJEaXJlY3Rpb25hbExpZ2h0IiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfaWxsdW1pbmFuY2UiLCJ2YWwiLCJfbGlnaHQiLCJpbGx1bWluYW5jZSIsIl90eXBlIiwic2NlbmUiLCJMaWdodFR5cGUiLCJESVJFQ1RJT05BTCIsIl9saWdodFR5cGUiLCJMaWdodCIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFxQ2FBLGdCLFdBSlosb0JBQVEscUJBQVIsQyxVQUNBLGlCQUFLLDBCQUFMLEMsVUFDQSxpQkFBSyx3QkFBTCxDLFVBZ0JJLGlCQUFLLElBQUwsQyxVQUNBLG9CQUFRLHlCQUFSLEMsa0RBaEJKQyx3Qjs7Ozs7O0FBU0c7Ozs7OzswQkFRbUI7QUFDZixlQUFPLEtBQUtDLFlBQVo7QUFDSCxPO3dCQUNnQkMsRyxFQUFLO0FBQ2xCLGFBQUtELFlBQUwsR0FBb0JDLEdBQXBCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWUMsV0FBWixHQUEwQixLQUFLSCxZQUEvQjtBQUE4QztBQUNwRTs7O0FBRUQsZ0NBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQSxZQW5CTEksS0FtQkssR0FuQkdDLGNBQU1DLFNBQU4sQ0FBZ0JDLFdBbUJuQjtBQUFBLFlBbEJMTCxNQWtCSyxHQWxCbUMsSUFrQm5DO0FBRVgsWUFBS00sVUFBTCxHQUFrQkgsY0FBTVAsZ0JBQXhCO0FBRlc7QUFHZDs7OztxQ0FFeUI7QUFDdEI7O0FBQ0EsWUFBSSxDQUFDLEtBQUtJLE1BQVYsRUFBa0I7QUFBRTtBQUFTOztBQUM3QixhQUFLQyxXQUFMLEdBQW1CLEtBQUtILFlBQXhCO0FBQ0g7Ozs7SUFqQ2lDUyxxQix3RkFFakNDLG1COzs7OzthQUN3QixLIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC9saWdodFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGVJbkVkaXRNb2RlLCBtZW51LCB0b29sdGlwLCB1bml0LCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgTGlnaHQgfSBmcm9tICcuL2xpZ2h0LWNvbXBvbmVudCc7XHJcblxyXG5AY2NjbGFzcygnY2MuRGlyZWN0aW9uYWxMaWdodCcpXHJcbkBoZWxwKCdpMThuOmNjLkRpcmVjdGlvbmFsTGlnaHQnKVxyXG5AbWVudSgnTGlnaHQvRGlyZWN0aW9uYWxMaWdodCcpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgRGlyZWN0aW9uYWxMaWdodCBleHRlbmRzIExpZ2h0IHtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2lsbHVtaW5hbmNlID0gNjUwMDA7XHJcblxyXG4gICAgcHJvdGVjdGVkIF90eXBlID0gc2NlbmUuTGlnaHRUeXBlLkRJUkVDVElPTkFMO1xyXG4gICAgcHJvdGVjdGVkIF9saWdodDogc2NlbmUuRGlyZWN0aW9uYWxMaWdodCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGlnaHQgc291cmNlIGludGVuc2l0eS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWJ5rqQ5by65bqm44CCXHJcbiAgICAgKi9cclxuICAgIEB1bml0KCdseCcpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpsaWdodHMuaWxsdW1pbmFuY2UnKVxyXG4gICAgZ2V0IGlsbHVtaW5hbmNlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWxsdW1pbmFuY2U7XHJcbiAgICB9XHJcbiAgICBzZXQgaWxsdW1pbmFuY2UgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2lsbHVtaW5hbmNlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5pbGx1bWluYW5jZSA9IHRoaXMuX2lsbHVtaW5hbmNlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRUeXBlID0gc2NlbmUuRGlyZWN0aW9uYWxMaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZUxpZ2h0ICgpIHtcclxuICAgICAgICBzdXBlci5fY3JlYXRlTGlnaHQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0KSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuaWxsdW1pbmFuY2UgPSB0aGlzLl9pbGx1bWluYW5jZTtcclxuICAgIH1cclxufVxyXG4iXX0=