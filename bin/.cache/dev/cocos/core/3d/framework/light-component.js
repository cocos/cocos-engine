(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../components/component.js", "../../data/decorators/index.js", "../../math/index.js", "../../value-types/index.js", "../../renderer/index.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../components/component.js"), require("../../data/decorators/index.js"), require("../../math/index.js"), require("../../value-types/index.js"), require("../../renderer/index.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.component, global.index, global.index, global.index, global.index, global.globalExports);
    global.lightComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _component, _index, _index2, _index3, _index4, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Light = _exports.PhotometricTerm = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class6, _temp2;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var PhotometricTerm = (0, _index3.Enum)({
    LUMINOUS_POWER: 0,
    LUMINANCE: 1
  });
  /**
   * @en static light settings.
   * @zh 静态灯光设置
   */

  _exports.PhotometricTerm = PhotometricTerm;
  var StaticLightSettings = (_dec = (0, _index.ccclass)('cc.StaticLightSettings'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function StaticLightSettings() {
      _classCallCheck(this, StaticLightSettings);

      _initializerDefineProperty(this, "_editorOnly", _descriptor, this);

      _initializerDefineProperty(this, "_bakeable", _descriptor2, this);

      _initializerDefineProperty(this, "_castShadow", _descriptor3, this);
    }

    _createClass(StaticLightSettings, [{
      key: "editorOnly",

      /**
       * @en editor only.
       * @zh 是否只在编辑器里生效。
       */
      get: function get() {
        return this._editorOnly;
      },
      set: function set(val) {
        this._editorOnly = val;
      }
      /**
       * @en bakeable.
       * @zh 是否可烘培。
       */

    }, {
      key: "bakeable",
      get: function get() {
        return this._bakeable;
      },
      set: function set(val) {
        this._bakeable = val;
      }
      /**
       * @en cast shadow.
       * @zh 是否投射阴影。
       */

    }, {
      key: "castShadow",
      get: function get() {
        return this._castShadow;
      },
      set: function set(val) {
        this._castShadow = val;
      }
    }]);

    return StaticLightSettings;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_editorOnly", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_bakeable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_castShadow", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "editorOnly", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "editorOnly"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "bakeable", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "bakeable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "castShadow", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "castShadow"), _class2.prototype)), _class2)) || _class); // tslint:disable: no-shadowed-variable

  // tslint:enable: no-shadowed-variable
  var Light = (_dec2 = (0, _index.ccclass)('cc.Light'), _dec3 = (0, _index.tooltip)('i18n:lights.color'), _dec4 = (0, _index.tooltip)('i18n:lights.use_color_temperature'), _dec5 = (0, _index.range)([1000, 15000, 1]), _dec6 = (0, _index.tooltip)('i18n:lights.color_temperature'), _dec7 = (0, _index.type)(StaticLightSettings), _dec2(_class4 = (_class5 = (_temp2 = _class6 = /*#__PURE__*/function (_Component) {
    _inherits(Light, _Component);

    _createClass(Light, [{
      key: "color",

      /**
       * @en
       * Color of the light.
       * @zh
       * 光源颜色。
       */
      get: function get() {
        return this._color;
      },
      set: function set(val) {
        this._color = val;

        if (this._light) {
          this._light.color.x = val.r / 255.0;
          this._light.color.y = val.g / 255.0;
          this._light.color.z = val.b / 255.0;
        }
      }
      /**
       * @en
       * Whether to enable light color temperature.
       * @zh
       * 是否启用光源色温。
       */

    }, {
      key: "useColorTemperature",
      get: function get() {
        return this._useColorTemperature;
      },
      set: function set(enable) {
        this._useColorTemperature = enable;

        if (this._light) {
          this._light.useColorTemperature = enable;
        }
      }
      /**
       * @en
       * The light color temperature.
       * @zh
       * 光源色温。
       */

    }, {
      key: "colorTemperature",
      get: function get() {
        return this._colorTemperature;
      },
      set: function set(val) {
        this._colorTemperature = val;

        if (this._light) {
          this._light.colorTemperature = val;
        }
      }
      /**
       * @en
       * static light settings.
       * @zh
       * 静态灯光设置。
       */

    }, {
      key: "staticSettings",
      get: function get() {
        return this._staticSettings;
      },
      set: function set(val) {
        this._staticSettings = val;
      }
      /**
       * @en
       * The light type.
       * @zh
       * 光源类型。
       */

    }, {
      key: "type",
      get: function get() {
        return this._type;
      }
    }]);

    function Light() {
      var _this;

      _classCallCheck(this, Light);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Light).call(this));

      _initializerDefineProperty(_this, "_color", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_useColorTemperature", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_colorTemperature", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_staticSettings", _descriptor7, _assertThisInitialized(_this));

      _this._type = _index4.scene.LightType.UNKNOWN;
      _this._lightType = void 0;
      _this._light = null;
      _this._lightType = _index4.scene.Light;
      return _this;
    }

    _createClass(Light, [{
      key: "onLoad",
      value: function onLoad() {
        this._createLight();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._attachToScene();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._detachFromScene();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._destroyLight();
      }
    }, {
      key: "_createLight",
      value: function _createLight() {
        if (!this._light) {
          this._light = _globalExports.legacyCC.director.root.createLight(this._lightType);
        }

        this.color = this._color;
        this.useColorTemperature = this._useColorTemperature;
        this.colorTemperature = this._colorTemperature;
        this._light.node = this.node;
      }
    }, {
      key: "_destroyLight",
      value: function _destroyLight() {
        if (this._light) {
          _globalExports.legacyCC.director.root.destroyLight(this);

          this._light = null;
        }
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        this._detachFromScene();

        if (this._light && !this._light.scene && this.node.scene) {
          var renderScene = this._getRenderScene();

          switch (this._type) {
            case _index4.scene.LightType.DIRECTIONAL:
              renderScene.addDirectionalLight(this._light);
              renderScene.setMainLight(this._light);
              break;

            case _index4.scene.LightType.SPHERE:
              renderScene.addSphereLight(this._light);
              break;

            case _index4.scene.LightType.SPOT:
              renderScene.addSpotLight(this._light);
              break;
          }
        }
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        if (this._light && this._light.scene) {
          var renderScene = this._light.scene;

          switch (this._type) {
            case _index4.scene.LightType.DIRECTIONAL:
              renderScene.removeDirectionalLight(this._light);
              renderScene.unsetMainLight(this._light);
              break;

            case _index4.scene.LightType.SPHERE:
              renderScene.removeSphereLight(this._light);
              break;

            case _index4.scene.LightType.SPOT:
              renderScene.removeSpotLight(this._light);
              break;
          }
        }
      }
    }]);

    return Light;
  }(_component.Component), _class6.Type = _index4.scene.LightType, _class6.PhotometricTerm = PhotometricTerm, _temp2), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "_color", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "_useColorTemperature", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "_colorTemperature", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 6550;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "_staticSettings", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new StaticLightSettings();
    }
  }), _applyDecoratedDescriptor(_class5.prototype, "color", [_dec3], Object.getOwnPropertyDescriptor(_class5.prototype, "color"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "useColorTemperature", [_dec4], Object.getOwnPropertyDescriptor(_class5.prototype, "useColorTemperature"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "colorTemperature", [_index.slide, _dec5, _dec6], Object.getOwnPropertyDescriptor(_class5.prototype, "colorTemperature"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "staticSettings", [_dec7], Object.getOwnPropertyDescriptor(_class5.prototype, "staticSettings"), _class5.prototype)), _class5)) || _class4);
  _exports.Light = Light;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL2xpZ2h0LWNvbXBvbmVudC50cyJdLCJuYW1lcyI6WyJQaG90b21ldHJpY1Rlcm0iLCJMVU1JTk9VU19QT1dFUiIsIkxVTUlOQU5DRSIsIlN0YXRpY0xpZ2h0U2V0dGluZ3MiLCJfZWRpdG9yT25seSIsInZhbCIsIl9iYWtlYWJsZSIsIl9jYXN0U2hhZG93Iiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJMaWdodCIsIl9jb2xvciIsIl9saWdodCIsImNvbG9yIiwieCIsInIiLCJ5IiwiZyIsInoiLCJiIiwiX3VzZUNvbG9yVGVtcGVyYXR1cmUiLCJlbmFibGUiLCJ1c2VDb2xvclRlbXBlcmF0dXJlIiwiX2NvbG9yVGVtcGVyYXR1cmUiLCJjb2xvclRlbXBlcmF0dXJlIiwiX3N0YXRpY1NldHRpbmdzIiwiX3R5cGUiLCJzY2VuZSIsIkxpZ2h0VHlwZSIsIlVOS05PV04iLCJfbGlnaHRUeXBlIiwiX2NyZWF0ZUxpZ2h0IiwiX2F0dGFjaFRvU2NlbmUiLCJfZGV0YWNoRnJvbVNjZW5lIiwiX2Rlc3Ryb3lMaWdodCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwiY3JlYXRlTGlnaHQiLCJub2RlIiwiZGVzdHJveUxpZ2h0IiwicmVuZGVyU2NlbmUiLCJfZ2V0UmVuZGVyU2NlbmUiLCJESVJFQ1RJT05BTCIsImFkZERpcmVjdGlvbmFsTGlnaHQiLCJzZXRNYWluTGlnaHQiLCJTUEhFUkUiLCJhZGRTcGhlcmVMaWdodCIsIlNQT1QiLCJhZGRTcG90TGlnaHQiLCJyZW1vdmVEaXJlY3Rpb25hbExpZ2h0IiwidW5zZXRNYWluTGlnaHQiLCJyZW1vdmVTcGhlcmVMaWdodCIsInJlbW92ZVNwb3RMaWdodCIsIkNvbXBvbmVudCIsIlR5cGUiLCJDb2xvciIsIldISVRFIiwiY2xvbmUiLCJzbGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QVcsQ0FBQ00sY0FBWixDQUEyQixLQUFLbkMsTUFBaEM7QUFDQTs7QUFDSixpQkFBS2UsY0FBTUMsU0FBTixDQUFnQm9CLElBQXJCO0FBQ0lQLGNBQUFBLFdBQVcsQ0FBQ1EsWUFBWixDQUF5QixLQUFLckMsTUFBOUI7QUFDQTtBQVZSO0FBWUg7QUFDSjs7O3lDQUU2QjtBQUMxQixZQUFJLEtBQUtBLE1BQUwsSUFBZSxLQUFLQSxNQUFMLENBQVllLEtBQS9CLEVBQXNDO0FBQ2xDLGNBQU1jLFdBQVcsR0FBRyxLQUFLN0IsTUFBTCxDQUFZZSxLQUFoQzs7QUFDQSxrQkFBUSxLQUFLRCxLQUFiO0FBQ0ksaUJBQUtDLGNBQU1DLFNBQU4sQ0FBZ0JlLFdBQXJCO0FBQ0lGLGNBQUFBLFdBQVcsQ0FBQ1Msc0JBQVosQ0FBbUMsS0FBS3RDLE1BQXhDO0FBQ0E2QixjQUFBQSxXQUFXLENBQUNVLGNBQVosQ0FBMkIsS0FBS3ZDLE1BQWhDO0FBQ0E7O0FBQ0osaUJBQUtlLGNBQU1DLFNBQU4sQ0FBZ0JrQixNQUFyQjtBQUNJTCxjQUFBQSxXQUFXLENBQUNXLGlCQUFaLENBQThCLEtBQUt4QyxNQUFuQztBQUNBOztBQUNKLGlCQUFLZSxjQUFNQyxTQUFOLENBQWdCb0IsSUFBckI7QUFDSVAsY0FBQUEsV0FBVyxDQUFDWSxlQUFaLENBQTRCLEtBQUt6QyxNQUFqQztBQUNBO0FBVlI7QUFZSDtBQUNKOzs7O0lBdktzQjBDLG9CLFdBQ1RDLEksR0FBTzVCLGNBQU1DLFMsVUFDYjVCLGUsR0FBa0JBLGUsbUZBRS9CUSxtQjs7Ozs7YUFDa0JnRCxjQUFNQyxLQUFOLENBQVlDLEtBQVosRTs7MkZBQ2xCbEQsbUI7Ozs7O2FBQ2dDLEs7O3dGQUNoQ0EsbUI7Ozs7O2FBQzZCLEk7O3NGQUM3QkEsbUI7Ozs7O2FBQ2dELElBQUlMLG1CQUFKLEU7O29ZQThDaER3RCxZIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuXHJcbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC9saWdodFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgdG9vbHRpcCwgcmFuZ2UsIHNsaWRlLCB0eXBlLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzJztcclxuXHJcbmltcG9ydCB7IHNjZW5lIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBSb290IH0gZnJvbSAnLi4vLi4vcm9vdCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IFBob3RvbWV0cmljVGVybSA9IEVudW0oe1xyXG4gICAgTFVNSU5PVVNfUE9XRVI6IDAsXHJcbiAgICBMVU1JTkFOQ0U6IDEsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBzdGF0aWMgbGlnaHQgc2V0dGluZ3MuXHJcbiAqIEB6aCDpnZnmgIHnga/lhYnorr7nva5cclxuICovXHJcbkBjY2NsYXNzKCdjYy5TdGF0aWNMaWdodFNldHRpbmdzJylcclxuY2xhc3MgU3RhdGljTGlnaHRTZXR0aW5ncyB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2VkaXRvck9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfYmFrZWFibGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY2FzdFNoYWRvdzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGVkaXRvciBvbmx5LlxyXG4gICAgICogQHpoIOaYr+WQpuWPquWcqOe8lui+keWZqOmHjOeUn+aViOOAglxyXG4gICAgICovXHJcbiAgICBAZWRpdGFibGVcclxuICAgIGdldCBlZGl0b3JPbmx5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWRpdG9yT25seTtcclxuICAgIH1cclxuICAgIHNldCBlZGl0b3JPbmx5ICh2YWwpIHtcclxuICAgICAgIHRoaXMuX2VkaXRvck9ubHkgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYmFrZWFibGUuXHJcbiAgICAgKiBAemgg5piv5ZCm5Y+v54OY5Z+544CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGJha2VhYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmFrZWFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGJha2VhYmxlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9iYWtlYWJsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBjYXN0IHNoYWRvdy5cclxuICAgICAqIEB6aCDmmK/lkKbmipXlsITpmLTlvbHjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgY2FzdFNoYWRvdyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc3RTaGFkb3c7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNhc3RTaGFkb3cgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2Nhc3RTaGFkb3cgPSB2YWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5leHBvcnQgZGVjbGFyZSBuYW1lc3BhY2UgTGlnaHQge1xyXG4gICAgZXhwb3J0IHR5cGUgVHlwZSA9IEVudW1BbGlhczx0eXBlb2Ygc2NlbmUuTGlnaHRUeXBlPjtcclxuICAgIGV4cG9ydCB0eXBlIFBob3RvbWV0cmljVGVybSA9IEVudW1BbGlhczx0eXBlb2YgUGhvdG9tZXRyaWNUZXJtPjtcclxufVxyXG4vLyB0c2xpbnQ6ZW5hYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG5cclxuQGNjY2xhc3MoJ2NjLkxpZ2h0JylcclxuZXhwb3J0IGNsYXNzIExpZ2h0IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgVHlwZSA9IHNjZW5lLkxpZ2h0VHlwZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgUGhvdG9tZXRyaWNUZXJtID0gUGhvdG9tZXRyaWNUZXJtO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF91c2VDb2xvclRlbXBlcmF0dXJlID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2NvbG9yVGVtcGVyYXR1cmUgPSA2NTUwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zdGF0aWNTZXR0aW5nczogU3RhdGljTGlnaHRTZXR0aW5ncyA9IG5ldyBTdGF0aWNMaWdodFNldHRpbmdzKCk7XHJcblxyXG4gICAgcHJvdGVjdGVkIF90eXBlID0gc2NlbmUuTGlnaHRUeXBlLlVOS05PV047XHJcbiAgICBwcm90ZWN0ZWQgX2xpZ2h0VHlwZTogdHlwZW9mIHNjZW5lLkxpZ2h0O1xyXG4gICAgcHJvdGVjdGVkIF9saWdodDogc2NlbmUuTGlnaHQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29sb3Igb2YgdGhlIGxpZ2h0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlhYnmupDpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLmNvbG9yJylcclxuICAgIGdldCBjb2xvciAoKTogUmVhZG9ubHk8Q29sb3I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcbiAgICBzZXQgY29sb3IgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2NvbG9yID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodC5jb2xvci54ID0gdmFsLnIgLyAyNTUuMDtcclxuICAgICAgICAgICAgdGhpcy5fbGlnaHQuY29sb3IueSA9IHZhbC5nIC8gMjU1LjA7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpZ2h0LmNvbG9yLnogPSB2YWwuYiAvIDI1NS4wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogV2hldGhlciB0byBlbmFibGUgbGlnaHQgY29sb3IgdGVtcGVyYXR1cmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuWQr+eUqOWFiea6kOiJsua4qeOAglxyXG4gICAgICovXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpsaWdodHMudXNlX2NvbG9yX3RlbXBlcmF0dXJlJylcclxuICAgIGdldCB1c2VDb2xvclRlbXBlcmF0dXJlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlQ29sb3JUZW1wZXJhdHVyZTtcclxuICAgIH1cclxuICAgIHNldCB1c2VDb2xvclRlbXBlcmF0dXJlIChlbmFibGUpIHtcclxuICAgICAgICB0aGlzLl91c2VDb2xvclRlbXBlcmF0dXJlID0gZW5hYmxlO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC51c2VDb2xvclRlbXBlcmF0dXJlID0gZW5hYmxlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBsaWdodCBjb2xvciB0ZW1wZXJhdHVyZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWJ5rqQ6Imy5rip44CCXHJcbiAgICAgKi9cclxuICAgIEBzbGlkZVxyXG4gICAgQHJhbmdlKFsxMDAwLCAxNTAwMCwgMV0pXHJcbiAgICBAdG9vbHRpcCgnaTE4bjpsaWdodHMuY29sb3JfdGVtcGVyYXR1cmUnKVxyXG4gICAgZ2V0IGNvbG9yVGVtcGVyYXR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvclRlbXBlcmF0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb2xvclRlbXBlcmF0dXJlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9jb2xvclRlbXBlcmF0dXJlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5jb2xvclRlbXBlcmF0dXJlID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIHN0YXRpYyBsaWdodCBzZXR0aW5ncy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6Z2Z5oCB54Gv5YWJ6K6+572u44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFN0YXRpY0xpZ2h0U2V0dGluZ3MpXHJcbiAgICBnZXQgc3RhdGljU2V0dGluZ3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0aWNTZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc3RhdGljU2V0dGluZ3MgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3N0YXRpY1NldHRpbmdzID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGlnaHQgdHlwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWJ5rqQ57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9saWdodFR5cGUgPSBzY2VuZS5MaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpe1xyXG4gICAgICAgIHRoaXMuX2NyZWF0ZUxpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9hdHRhY2hUb1NjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZGVzdHJveUxpZ2h0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVMaWdodCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9saWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodCA9IChsZWdhY3lDQy5kaXJlY3Rvci5yb290IGFzIFJvb3QpLmNyZWF0ZUxpZ2h0KHRoaXMuX2xpZ2h0VHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLl9jb2xvcjtcclxuICAgICAgICB0aGlzLnVzZUNvbG9yVGVtcGVyYXR1cmUgPSB0aGlzLl91c2VDb2xvclRlbXBlcmF0dXJlO1xyXG4gICAgICAgIHRoaXMuY29sb3JUZW1wZXJhdHVyZSA9IHRoaXMuX2NvbG9yVGVtcGVyYXR1cmU7XHJcbiAgICAgICAgdGhpcy5fbGlnaHQubm9kZSA9IHRoaXMubm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Rlc3Ryb3lMaWdodCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpZ2h0KSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGVzdHJveUxpZ2h0KHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXR0YWNoVG9TY2VuZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpZ2h0ICYmICF0aGlzLl9saWdodC5zY2VuZSAmJiB0aGlzLm5vZGUuc2NlbmUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVuZGVyU2NlbmUgPSB0aGlzLl9nZXRSZW5kZXJTY2VuZSgpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3R5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2Ugc2NlbmUuTGlnaHRUeXBlLkRJUkVDVElPTkFMOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlclNjZW5lLmFkZERpcmVjdGlvbmFsTGlnaHQodGhpcy5fbGlnaHQgYXMgc2NlbmUuRGlyZWN0aW9uYWxMaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyU2NlbmUuc2V0TWFpbkxpZ2h0KHRoaXMuX2xpZ2h0IGFzIHNjZW5lLkRpcmVjdGlvbmFsTGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBzY2VuZS5MaWdodFR5cGUuU1BIRVJFOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlclNjZW5lLmFkZFNwaGVyZUxpZ2h0KHRoaXMuX2xpZ2h0IGFzIHNjZW5lLlNwaGVyZUxpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2Ugc2NlbmUuTGlnaHRUeXBlLlNQT1Q6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyU2NlbmUuYWRkU3BvdExpZ2h0KHRoaXMuX2xpZ2h0IGFzIHNjZW5lLlNwb3RMaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXRhY2hGcm9tU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCAmJiB0aGlzLl9saWdodC5zY2VuZSkge1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJTY2VuZSA9IHRoaXMuX2xpZ2h0LnNjZW5lO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3R5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2Ugc2NlbmUuTGlnaHRUeXBlLkRJUkVDVElPTkFMOlxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlclNjZW5lLnJlbW92ZURpcmVjdGlvbmFsTGlnaHQodGhpcy5fbGlnaHQgYXMgc2NlbmUuRGlyZWN0aW9uYWxMaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyU2NlbmUudW5zZXRNYWluTGlnaHQodGhpcy5fbGlnaHQgYXMgc2NlbmUuRGlyZWN0aW9uYWxMaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIHNjZW5lLkxpZ2h0VHlwZS5TUEhFUkU6XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyU2NlbmUucmVtb3ZlU3BoZXJlTGlnaHQodGhpcy5fbGlnaHQgYXMgc2NlbmUuU3BoZXJlTGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBzY2VuZS5MaWdodFR5cGUuU1BPVDpcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJTY2VuZS5yZW1vdmVTcG90TGlnaHQodGhpcy5fbGlnaHQgYXMgc2NlbmUuU3BvdExpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=