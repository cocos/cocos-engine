(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../../math/index.js", "../../renderer/index.js", "./light-component.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../../math/index.js"), require("../../renderer/index.js"), require("./light-component.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.lightComponent);
    global.spotLightComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _lightComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SpotLight = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

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

  var SpotLight = (_dec = (0, _index.ccclass)('cc.SpotLight'), _dec2 = (0, _index.help)('i18n:cc.SpotLight'), _dec3 = (0, _index.menu)('Light/SpotLight'), _dec4 = (0, _index.unit)('lm'), _dec5 = (0, _index.tooltip)('i18n:lights.luminous_power'), _dec6 = (0, _index.unit)('cd/m²'), _dec7 = (0, _index.tooltip)('i18n:lights.luminance'), _dec8 = (0, _index.type)(_lightComponent.PhotometricTerm), _dec9 = (0, _index.tooltip)('i18n:lights.term'), _dec10 = (0, _index.tooltip)('i18n:lights.size'), _dec11 = (0, _index.tooltip)('i18n:lights.range'), _dec12 = (0, _index.range)([2, 180, 1]), _dec13 = (0, _index.tooltip)('The spot light cone angle'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Light) {
    _inherits(SpotLight, _Light);

    _createClass(SpotLight, [{
      key: "luminousPower",

      /**
       * @en Luminous power of the light.
       * @zh 光通量。
       */
      get: function get() {
        return this._luminance * _index3.scene.nt2lm(this._size);
      },
      set: function set(val) {
        this._luminance = val / _index3.scene.nt2lm(this._size);

        if (this._light) {
          this._light.luminance = this._luminance;
        }
      }
      /**
       * @en Luminance of the light.
       * @zh 光亮度。
       */

    }, {
      key: "luminance",
      get: function get() {
        return this._luminance;
      },
      set: function set(val) {
        this._luminance = val;

        if (this._light) {
          this._light.luminance = val;
        }
      }
      /**
       * @en The photometric term currently being used.
       * @zh 当前使用的光度学计量单位。
       */

    }, {
      key: "term",
      get: function get() {
        return this._term;
      },
      set: function set(val) {
        this._term = val;
      }
      /**
       * @en
       * Size of the light.
       * @zh
       * 光源大小。
       */

    }, {
      key: "size",
      get: function get() {
        return this._size;
      },
      set: function set(val) {
        this._size = val;

        if (this._light) {
          this._light.size = val;
        }
      }
      /**
       * @en
       * Range of the light.
       * @zh
       * 光源范围。
       */

    }, {
      key: "range",
      get: function get() {
        return this._range;
      },
      set: function set(val) {
        this._range = val;

        if (this._light) {
          this._light.range = val;
        }
      }
      /**
       * @en
       * The spot light cone angle.
       * @zh
       * 聚光灯锥角。
       */

    }, {
      key: "spotAngle",
      get: function get() {
        return this._spotAngle;
      },
      set: function set(val) {
        this._spotAngle = val;

        if (this._light) {
          this._light.spotAngle = (0, _index2.toRadian)(val);
        }
      }
    }]);

    function SpotLight() {
      var _this;

      _classCallCheck(this, SpotLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SpotLight).call(this));

      _initializerDefineProperty(_this, "_size", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_luminance", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_term", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_range", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_spotAngle", _descriptor5, _assertThisInitialized(_this));

      _this._type = _index3.scene.LightType.SPOT;
      _this._light = null;
      _this._lightType = _index3.scene.SpotLight;
      return _this;
    }

    _createClass(SpotLight, [{
      key: "_createLight",
      value: function _createLight() {
        _get(_getPrototypeOf(SpotLight.prototype), "_createLight", this).call(this);

        if (!this._light) {
          return;
        }

        this.luminance = this._luminance;
        this.size = this._size;
        this.range = this._range;
        this.spotAngle = this._spotAngle;
      }
    }]);

    return SpotLight;
  }(_lightComponent.Light), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_size", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.15;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_luminance", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1700 / _index3.scene.nt2lm(0.15);
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_term", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _lightComponent.PhotometricTerm.LUMINOUS_POWER;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_range", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_spotAngle", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 60;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "luminousPower", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "luminousPower"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "luminance", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "luminance"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "term", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "term"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "size", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "range", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "range"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "spotAngle", [_index.slide, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "spotAngle"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.SpotLight = SpotLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL3Nwb3QtbGlnaHQtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbIlNwb3RMaWdodCIsIlBob3RvbWV0cmljVGVybSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX2x1bWluYW5jZSIsInNjZW5lIiwibnQybG0iLCJfc2l6ZSIsInZhbCIsIl9saWdodCIsImx1bWluYW5jZSIsIl90ZXJtIiwic2l6ZSIsIl9yYW5nZSIsInJhbmdlIiwiX3Nwb3RBbmdsZSIsInNwb3RBbmdsZSIsIl90eXBlIiwiTGlnaHRUeXBlIiwiU1BPVCIsIl9saWdodFR5cGUiLCJMaWdodCIsInNlcmlhbGl6YWJsZSIsIkxVTUlOT1VTX1BPV0VSIiwic2xpZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bc0NhQSxTLFdBSlosb0JBQVEsY0FBUixDLFVBQ0EsaUJBQUssbUJBQUwsQyxVQUNBLGlCQUFLLGlCQUFMLEMsVUFzQkksaUJBQUssSUFBTCxDLFVBQ0Esb0JBQVEsNEJBQVIsQyxVQWFBLGlCQUFLLE9BQUwsQyxVQUNBLG9CQUFRLHVCQUFSLEMsVUFhQSxpQkFBS0MsK0JBQUwsQyxVQUNBLG9CQUFRLGtCQUFSLEMsV0FjQSxvQkFBUSxrQkFBUixDLFdBZUEsb0JBQVEsbUJBQVIsQyxXQWdCQSxrQkFBTSxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxDQUFOLEMsV0FDQSxvQkFBUSwyQkFBUixDLGtEQWhHSkMsd0I7Ozs7OztBQWlCRzs7OzswQkFNcUI7QUFDakIsZUFBTyxLQUFLQyxVQUFMLEdBQWtCQyxjQUFNQyxLQUFOLENBQVksS0FBS0MsS0FBakIsQ0FBekI7QUFDSCxPO3dCQUNrQkMsRyxFQUFLO0FBQ3BCLGFBQUtKLFVBQUwsR0FBa0JJLEdBQUcsR0FBR0gsY0FBTUMsS0FBTixDQUFZLEtBQUtDLEtBQWpCLENBQXhCOztBQUNBLFlBQUksS0FBS0UsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWUMsU0FBWixHQUF3QixLQUFLTixVQUE3QjtBQUEwQztBQUNoRTtBQUVEOzs7Ozs7OzBCQU1pQjtBQUNiLGVBQU8sS0FBS0EsVUFBWjtBQUNILE87d0JBQ2NJLEcsRUFBSztBQUNoQixhQUFLSixVQUFMLEdBQWtCSSxHQUFsQjs7QUFDQSxZQUFJLEtBQUtDLE1BQVQsRUFBaUI7QUFBRSxlQUFLQSxNQUFMLENBQVlDLFNBQVosR0FBd0JGLEdBQXhCO0FBQThCO0FBQ3BEO0FBRUQ7Ozs7Ozs7MEJBTVk7QUFDUixlQUFPLEtBQUtHLEtBQVo7QUFDSCxPO3dCQUNTSCxHLEVBQUs7QUFDWCxhQUFLRyxLQUFMLEdBQWFILEdBQWI7QUFDSDtBQUVEOzs7Ozs7Ozs7MEJBT1k7QUFDUixlQUFPLEtBQUtELEtBQVo7QUFDSCxPO3dCQUNTQyxHLEVBQUs7QUFDWCxhQUFLRCxLQUFMLEdBQWFDLEdBQWI7O0FBQ0EsWUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQUUsZUFBS0EsTUFBTCxDQUFZRyxJQUFaLEdBQW1CSixHQUFuQjtBQUF5QjtBQUMvQztBQUVEOzs7Ozs7Ozs7MEJBT2E7QUFDVCxlQUFPLEtBQUtLLE1BQVo7QUFDSCxPO3dCQUNVTCxHLEVBQUs7QUFDWixhQUFLSyxNQUFMLEdBQWNMLEdBQWQ7O0FBQ0EsWUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQUUsZUFBS0EsTUFBTCxDQUFZSyxLQUFaLEdBQW9CTixHQUFwQjtBQUEwQjtBQUNoRDtBQUVEOzs7Ozs7Ozs7MEJBU2lCO0FBQ2IsZUFBTyxLQUFLTyxVQUFaO0FBQ0gsTzt3QkFFY1AsRyxFQUFLO0FBQ2hCLGFBQUtPLFVBQUwsR0FBa0JQLEdBQWxCOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWU8sU0FBWixHQUF3QixzQkFBU1IsR0FBVCxDQUF4QjtBQUF3QztBQUM5RDs7O0FBRUQseUJBQWU7QUFBQTs7QUFBQTs7QUFDWDs7QUFEVzs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxZQTVGTFMsS0E0RkssR0E1RkdaLGNBQU1hLFNBQU4sQ0FBZ0JDLElBNEZuQjtBQUFBLFlBM0ZMVixNQTJGSyxHQTNGNEIsSUEyRjVCO0FBRVgsWUFBS1csVUFBTCxHQUFrQmYsY0FBTUosU0FBeEI7QUFGVztBQUdkOzs7O3FDQUV5QjtBQUN0Qjs7QUFDQSxZQUFJLENBQUMsS0FBS1EsTUFBVixFQUFrQjtBQUFFO0FBQVM7O0FBQzdCLGFBQUtDLFNBQUwsR0FBaUIsS0FBS04sVUFBdEI7QUFDQSxhQUFLUSxJQUFMLEdBQVksS0FBS0wsS0FBakI7QUFDQSxhQUFLTyxLQUFMLEdBQWEsS0FBS0QsTUFBbEI7QUFDQSxhQUFLRyxTQUFMLEdBQWlCLEtBQUtELFVBQXRCO0FBQ0g7Ozs7SUFySDBCTSxxQixpRkFFMUJDLG1COzs7OzthQUNpQixJOztpRkFDakJBLG1COzs7OzthQUNzQixPQUFPakIsY0FBTUMsS0FBTixDQUFZLElBQVosQzs7NEVBQzdCZ0IsbUI7Ozs7O2FBQ2lCcEIsZ0NBQWdCcUIsYzs7NkVBQ2pDRCxtQjs7Ozs7YUFDa0IsQzs7aUZBQ2xCQSxtQjs7Ozs7YUFDc0IsRTs7NHpCQWtGdEJFLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29tcG9uZW50L2xpZ2h0XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHNsaWRlLCByYW5nZSwgdW5pdCwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgdG9SYWRpYW4gfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi8uLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IExpZ2h0LCBQaG90b21ldHJpY1Rlcm0gfSBmcm9tICcuL2xpZ2h0LWNvbXBvbmVudCc7XHJcblxyXG5AY2NjbGFzcygnY2MuU3BvdExpZ2h0JylcclxuQGhlbHAoJ2kxOG46Y2MuU3BvdExpZ2h0JylcclxuQG1lbnUoJ0xpZ2h0L1Nwb3RMaWdodCcpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgU3BvdExpZ2h0IGV4dGVuZHMgTGlnaHQge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfc2l6ZSA9IDAuMTU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2x1bWluYW5jZSA9IDE3MDAgLyBzY2VuZS5udDJsbSgwLjE1KTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGVybSA9IFBob3RvbWV0cmljVGVybS5MVU1JTk9VU19QT1dFUjtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfcmFuZ2UgPSAxO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zcG90QW5nbGUgPSA2MDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3R5cGUgPSBzY2VuZS5MaWdodFR5cGUuU1BPVDtcclxuICAgIHByb3RlY3RlZCBfbGlnaHQ6IHNjZW5lLlNwb3RMaWdodCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEx1bWlub3VzIHBvd2VyIG9mIHRoZSBsaWdodC5cclxuICAgICAqIEB6aCDlhYnpgJrph4/jgIJcclxuICAgICAqL1xyXG4gICAgQHVuaXQoJ2xtJylcclxuICAgIEB0b29sdGlwKCdpMThuOmxpZ2h0cy5sdW1pbm91c19wb3dlcicpXHJcbiAgICBnZXQgbHVtaW5vdXNQb3dlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2x1bWluYW5jZSAqIHNjZW5lLm50MmxtKHRoaXMuX3NpemUpO1xyXG4gICAgfVxyXG4gICAgc2V0IGx1bWlub3VzUG93ZXIgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2x1bWluYW5jZSA9IHZhbCAvIHNjZW5lLm50MmxtKHRoaXMuX3NpemUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5sdW1pbmFuY2UgPSB0aGlzLl9sdW1pbmFuY2U7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBMdW1pbmFuY2Ugb2YgdGhlIGxpZ2h0LlxyXG4gICAgICogQHpoIOWFieS6ruW6puOAglxyXG4gICAgICovXHJcbiAgICBAdW5pdCgnY2QvbcKyJylcclxuICAgIEB0b29sdGlwKCdpMThuOmxpZ2h0cy5sdW1pbmFuY2UnKVxyXG4gICAgZ2V0IGx1bWluYW5jZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2x1bWluYW5jZTtcclxuICAgIH1cclxuICAgIHNldCBsdW1pbmFuY2UgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2x1bWluYW5jZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbGlnaHQpIHsgdGhpcy5fbGlnaHQubHVtaW5hbmNlID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHBob3RvbWV0cmljIHRlcm0gY3VycmVudGx5IGJlaW5nIHVzZWQuXHJcbiAgICAgKiBAemgg5b2T5YmN5L2/55So55qE5YWJ5bqm5a2m6K6h6YeP5Y2V5L2N44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFBob3RvbWV0cmljVGVybSlcclxuICAgIEB0b29sdGlwKCdpMThuOmxpZ2h0cy50ZXJtJylcclxuICAgIGdldCB0ZXJtICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGVybTtcclxuICAgIH1cclxuICAgIHNldCB0ZXJtICh2YWwpIHtcclxuICAgICAgICB0aGlzLl90ZXJtID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTaXplIG9mIHRoZSBsaWdodC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWJ5rqQ5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCdpMThuOmxpZ2h0cy5zaXplJylcclxuICAgIGdldCBzaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICAgIH1cclxuICAgIHNldCBzaXplICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5zaXplID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJhbmdlIG9mIHRoZSBsaWdodC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWJ5rqQ6IyD5Zu044CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCdpMThuOmxpZ2h0cy5yYW5nZScpXHJcbiAgICBnZXQgcmFuZ2UgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yYW5nZTtcclxuICAgIH1cclxuICAgIHNldCByYW5nZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpZ2h0KSB7IHRoaXMuX2xpZ2h0LnJhbmdlID0gdmFsOyB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzcG90IGxpZ2h0IGNvbmUgYW5nbGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiBmuWFieeBr+mUpeinkuOAglxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMiwgMTgwLCAxXSlcclxuICAgIEB0b29sdGlwKCdUaGUgc3BvdCBsaWdodCBjb25lIGFuZ2xlJylcclxuICAgIGdldCBzcG90QW5nbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcG90QW5nbGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNwb3RBbmdsZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc3BvdEFuZ2xlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5zcG90QW5nbGUgPSB0b1JhZGlhbih2YWwpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRUeXBlID0gc2NlbmUuU3BvdExpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY3JlYXRlTGlnaHQgKCkge1xyXG4gICAgICAgIHN1cGVyLl9jcmVhdGVMaWdodCgpO1xyXG4gICAgICAgIGlmICghdGhpcy5fbGlnaHQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5sdW1pbmFuY2UgPSB0aGlzLl9sdW1pbmFuY2U7XHJcbiAgICAgICAgdGhpcy5zaXplID0gdGhpcy5fc2l6ZTtcclxuICAgICAgICB0aGlzLnJhbmdlID0gdGhpcy5fcmFuZ2U7XHJcbiAgICAgICAgdGhpcy5zcG90QW5nbGUgPSB0aGlzLl9zcG90QW5nbGU7XHJcbiAgICB9XHJcbn1cclxuIl19