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
    global.sphereLightComponent = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _lightComponent) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SphereLight = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

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

  var SphereLight = (_dec = (0, _index.ccclass)('cc.SphereLight'), _dec2 = (0, _index.help)('i18n:cc.SphereLight'), _dec3 = (0, _index.menu)('Light/SphereLight'), _dec4 = (0, _index.unit)('lm'), _dec5 = (0, _index.tooltip)('i18n:lights.luminous_power'), _dec6 = (0, _index.unit)('cd/m²'), _dec7 = (0, _index.tooltip)('i18n:lights.luminance'), _dec8 = (0, _index.type)(_lightComponent.PhotometricTerm), _dec9 = (0, _index.tooltip)('i18n:lights.term'), _dec10 = (0, _index.tooltip)('i18n:lights.size'), _dec11 = (0, _index.tooltip)('i18n:lights.range'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Light) {
    _inherits(SphereLight, _Light);

    _createClass(SphereLight, [{
      key: "luminousPower",

      /**
       * @en Luminous power of the light.
       * @zh 光通量。
       */
      get: function get() {
        return this._luminance * _index2.scene.nt2lm(this._size);
      },
      set: function set(val) {
        this._luminance = val / _index2.scene.nt2lm(this._size);

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
    }]);

    function SphereLight() {
      var _this;

      _classCallCheck(this, SphereLight);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SphereLight).call(this));

      _initializerDefineProperty(_this, "_size", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_luminance", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_term", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_range", _descriptor4, _assertThisInitialized(_this));

      _this._type = _index2.scene.LightType.SPHERE;
      _this._light = null;
      _this._lightType = _index2.scene.SphereLight;
      return _this;
    }

    _createClass(SphereLight, [{
      key: "_createLight",
      value: function _createLight() {
        _get(_getPrototypeOf(SphereLight.prototype), "_createLight", this).call(this);

        if (!this._light) {
          return;
        }

        this.luminance = this._luminance;
        this.size = this._size;
        this.range = this._range;
      }
    }]);

    return SphereLight;
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
      return 1700 / _index2.scene.nt2lm(0.15);
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
  }), _applyDecoratedDescriptor(_class2.prototype, "luminousPower", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "luminousPower"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "luminance", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "luminance"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "term", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "term"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "size", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "size"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "range", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "range"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.SphereLight = SphereLight;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL3NwaGVyZS1saWdodC1jb21wb25lbnQudHMiXSwibmFtZXMiOlsiU3BoZXJlTGlnaHQiLCJQaG90b21ldHJpY1Rlcm0iLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9sdW1pbmFuY2UiLCJzY2VuZSIsIm50MmxtIiwiX3NpemUiLCJ2YWwiLCJfbGlnaHQiLCJsdW1pbmFuY2UiLCJfdGVybSIsInNpemUiLCJfcmFuZ2UiLCJyYW5nZSIsIl90eXBlIiwiTGlnaHRUeXBlIiwiU1BIRVJFIiwiX2xpZ2h0VHlwZSIsIkxpZ2h0Iiwic2VyaWFsaXphYmxlIiwiTFVNSU5PVVNfUE9XRVIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01Bb0NhQSxXLFdBSlosb0JBQVEsZ0JBQVIsQyxVQUNBLGlCQUFLLHFCQUFMLEMsVUFDQSxpQkFBSyxtQkFBTCxDLFVBb0JJLGlCQUFLLElBQUwsQyxVQUNBLG9CQUFRLDRCQUFSLEMsVUFhQSxpQkFBSyxPQUFMLEMsVUFDQSxvQkFBUSx1QkFBUixDLFVBYUEsaUJBQUtDLCtCQUFMLEMsVUFDQSxvQkFBUSxrQkFBUixDLFdBY0Esb0JBQVEsa0JBQVIsQyxXQWVBLG9CQUFRLG1CQUFSLEMsa0RBN0VKQyx3Qjs7Ozs7O0FBZUc7Ozs7MEJBTXFCO0FBQ2pCLGVBQU8sS0FBS0MsVUFBTCxHQUFrQkMsY0FBTUMsS0FBTixDQUFZLEtBQUtDLEtBQWpCLENBQXpCO0FBQ0gsTzt3QkFDa0JDLEcsRUFBSztBQUNwQixhQUFLSixVQUFMLEdBQWtCSSxHQUFHLEdBQUdILGNBQU1DLEtBQU4sQ0FBWSxLQUFLQyxLQUFqQixDQUF4Qjs7QUFDQSxZQUFJLEtBQUtFLE1BQVQsRUFBaUI7QUFBRSxlQUFLQSxNQUFMLENBQVlDLFNBQVosR0FBd0IsS0FBS04sVUFBN0I7QUFBMEM7QUFDaEU7QUFFRDs7Ozs7OzswQkFNaUI7QUFDYixlQUFPLEtBQUtBLFVBQVo7QUFDSCxPO3dCQUNjSSxHLEVBQUs7QUFDaEIsYUFBS0osVUFBTCxHQUFrQkksR0FBbEI7O0FBQ0EsWUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQUUsZUFBS0EsTUFBTCxDQUFZQyxTQUFaLEdBQXdCRixHQUF4QjtBQUE4QjtBQUNwRDtBQUVEOzs7Ozs7OzBCQU1ZO0FBQ1IsZUFBTyxLQUFLRyxLQUFaO0FBQ0gsTzt3QkFDU0gsRyxFQUFLO0FBQ1gsYUFBS0csS0FBTCxHQUFhSCxHQUFiO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU9ZO0FBQ1IsZUFBTyxLQUFLRCxLQUFaO0FBQ0gsTzt3QkFDU0MsRyxFQUFLO0FBQ1gsYUFBS0QsS0FBTCxHQUFhQyxHQUFiOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWUcsSUFBWixHQUFtQkosR0FBbkI7QUFBeUI7QUFDL0M7QUFFRDs7Ozs7Ozs7OzBCQU9hO0FBQ1QsZUFBTyxLQUFLSyxNQUFaO0FBQ0gsTzt3QkFDVUwsRyxFQUFLO0FBQ1osYUFBS0ssTUFBTCxHQUFjTCxHQUFkOztBQUNBLFlBQUksS0FBS0MsTUFBVCxFQUFpQjtBQUFFLGVBQUtBLE1BQUwsQ0FBWUssS0FBWixHQUFvQk4sR0FBcEI7QUFBMEI7QUFDaEQ7OztBQUVELDJCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7O0FBRFc7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsWUExRUxPLEtBMEVLLEdBMUVHVixjQUFNVyxTQUFOLENBQWdCQyxNQTBFbkI7QUFBQSxZQXpFTFIsTUF5RUssR0F6RThCLElBeUU5QjtBQUVYLFlBQUtTLFVBQUwsR0FBa0JiLGNBQU1KLFdBQXhCO0FBRlc7QUFHZDs7OztxQ0FFeUI7QUFDdEI7O0FBQ0EsWUFBSSxDQUFDLEtBQUtRLE1BQVYsRUFBa0I7QUFBRTtBQUFTOztBQUM3QixhQUFLQyxTQUFMLEdBQWlCLEtBQUtOLFVBQXRCO0FBQ0EsYUFBS1EsSUFBTCxHQUFZLEtBQUtMLEtBQWpCO0FBQ0EsYUFBS08sS0FBTCxHQUFhLEtBQUtELE1BQWxCO0FBQ0g7Ozs7SUFoRzRCTSxxQixpRkFFNUJDLG1COzs7OzthQUNpQixJOztpRkFDakJBLG1COzs7OzthQUNzQixPQUFPZixjQUFNQyxLQUFOLENBQVksSUFBWixDOzs0RUFDN0JjLG1COzs7OzthQUNpQmxCLGdDQUFnQm1CLGM7OzZFQUNqQ0QsbUI7Ozs7O2FBQ2tCLEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnQvbGlnaHRcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBleGVjdXRlSW5FZGl0TW9kZSwgbWVudSwgdG9vbHRpcCwgdHlwZSwgdW5pdCwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi8uLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IExpZ2h0LCBQaG90b21ldHJpY1Rlcm0gfSBmcm9tICcuL2xpZ2h0LWNvbXBvbmVudCc7XHJcblxyXG5AY2NjbGFzcygnY2MuU3BoZXJlTGlnaHQnKVxyXG5AaGVscCgnaTE4bjpjYy5TcGhlcmVMaWdodCcpXHJcbkBtZW51KCdMaWdodC9TcGhlcmVMaWdodCcpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgU3BoZXJlTGlnaHQgZXh0ZW5kcyBMaWdodCB7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zaXplID0gMC4xNTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbHVtaW5hbmNlID0gMTcwMCAvIHNjZW5lLm50MmxtKDAuMTUpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF90ZXJtID0gUGhvdG9tZXRyaWNUZXJtLkxVTUlOT1VTX1BPV0VSO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9yYW5nZSA9IDE7XHJcblxyXG4gICAgcHJvdGVjdGVkIF90eXBlID0gc2NlbmUuTGlnaHRUeXBlLlNQSEVSRTtcclxuICAgIHByb3RlY3RlZCBfbGlnaHQ6IHNjZW5lLlNwaGVyZUxpZ2h0IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTHVtaW5vdXMgcG93ZXIgb2YgdGhlIGxpZ2h0LlxyXG4gICAgICogQHpoIOWFiemAmumHj+OAglxyXG4gICAgICovXHJcbiAgICBAdW5pdCgnbG0nKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLmx1bWlub3VzX3Bvd2VyJylcclxuICAgIGdldCBsdW1pbm91c1Bvd2VyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbHVtaW5hbmNlICogc2NlbmUubnQybG0odGhpcy5fc2l6ZSk7XHJcbiAgICB9XHJcbiAgICBzZXQgbHVtaW5vdXNQb3dlciAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbHVtaW5hbmNlID0gdmFsIC8gc2NlbmUubnQybG0odGhpcy5fc2l6ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpZ2h0KSB7IHRoaXMuX2xpZ2h0Lmx1bWluYW5jZSA9IHRoaXMuX2x1bWluYW5jZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEx1bWluYW5jZSBvZiB0aGUgbGlnaHQuXHJcbiAgICAgKiBAemgg5YWJ5Lqu5bqm44CCXHJcbiAgICAgKi9cclxuICAgIEB1bml0KCdjZC9twrInKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLmx1bWluYW5jZScpXHJcbiAgICBnZXQgbHVtaW5hbmNlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbHVtaW5hbmNlO1xyXG4gICAgfVxyXG4gICAgc2V0IGx1bWluYW5jZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbHVtaW5hbmNlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodCkgeyB0aGlzLl9saWdodC5sdW1pbmFuY2UgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgcGhvdG9tZXRyaWMgdGVybSBjdXJyZW50bHkgYmVpbmcgdXNlZC5cclxuICAgICAqIEB6aCDlvZPliY3kvb/nlKjnmoTlhYnluqblraborqHph4/ljZXkvY3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoUGhvdG9tZXRyaWNUZXJtKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLnRlcm0nKVxyXG4gICAgZ2V0IHRlcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJtO1xyXG4gICAgfVxyXG4gICAgc2V0IHRlcm0gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3Rlcm0gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNpemUgb2YgdGhlIGxpZ2h0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlhYnmupDlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLnNpemUnKVxyXG4gICAgZ2V0IHNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xyXG4gICAgfVxyXG4gICAgc2V0IHNpemUgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3NpemUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpZ2h0KSB7IHRoaXMuX2xpZ2h0LnNpemUgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmFuZ2Ugb2YgdGhlIGxpZ2h0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlhYnmupDojIPlm7TjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46bGlnaHRzLnJhbmdlJylcclxuICAgIGdldCByYW5nZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JhbmdlO1xyXG4gICAgfVxyXG4gICAgc2V0IHJhbmdlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbGlnaHQpIHsgdGhpcy5fbGlnaHQucmFuZ2UgPSB2YWw7IH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9saWdodFR5cGUgPSBzY2VuZS5TcGhlcmVMaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZUxpZ2h0ICgpIHtcclxuICAgICAgICBzdXBlci5fY3JlYXRlTGlnaHQoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0KSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMubHVtaW5hbmNlID0gdGhpcy5fbHVtaW5hbmNlO1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX3NpemU7XHJcbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMuX3JhbmdlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==