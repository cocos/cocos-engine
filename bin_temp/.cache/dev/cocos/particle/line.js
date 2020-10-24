(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/assets/index.js", "../core/components/index.js", "../core/data/decorators/index.js", "../core/math/index.js", "./models/line-model.js", "../core/3d/builtin/index.js", "./animator/curve-range.js", "./animator/gradient-range.js", "../core/global-exports.js", "../core/renderer/core/material-instance.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/assets/index.js"), require("../core/components/index.js"), require("../core/data/decorators/index.js"), require("../core/math/index.js"), require("./models/line-model.js"), require("../core/3d/builtin/index.js"), require("./animator/curve-range.js"), require("./animator/gradient-range.js"), require("../core/global-exports.js"), require("../core/renderer/core/material-instance.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.lineModel, global.index, global.curveRange, global.gradientRange, global.globalExports, global.materialInstance);
    global.line = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _lineModel, _index5, _curveRange, _gradientRange, _globalExports, _materialInstance) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Line = void 0;
  _curveRange = _interopRequireDefault(_curveRange);
  _gradientRange = _interopRequireDefault(_gradientRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };
  var CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
  var define = {
    CC_USE_WORLD_SPACE: false
  };
  var Line = (_dec = (0, _index3.ccclass)('cc.Line'), _dec2 = (0, _index3.help)('i18n:cc.Line'), _dec3 = (0, _index3.menu)('Components/Line'), _dec4 = (0, _index3.type)(_index.Texture2D), _dec5 = (0, _index3.type)(_index.Texture2D), _dec6 = (0, _index3.displayOrder)(0), _dec7 = (0, _index3.tooltip)('线段中显示的贴图'), _dec8 = (0, _index3.displayOrder)(1), _dec9 = (0, _index3.tooltip)('线段中各个点的坐标采用哪个坐标系，勾选使用世界坐标系，不选使用本地坐标系'), _dec10 = (0, _index3.type)([_index4.Vec3]), _dec11 = (0, _index3.type)([_index4.Vec3]), _dec12 = (0, _index3.displayOrder)(2), _dec13 = (0, _index3.tooltip)('每个线段端点的坐标'), _dec14 = (0, _index3.type)(_curveRange.default), _dec15 = (0, _index3.type)(_curveRange.default), _dec16 = (0, _index3.displayOrder)(3), _dec17 = (0, _index3.tooltip)('线段宽度，如果采用曲线，则表示沿着线段方向上的曲线变化'), _dec18 = (0, _index3.type)(_index4.Vec2), _dec19 = (0, _index3.displayOrder)(4), _dec20 = (0, _index3.tooltip)('贴图平铺次数'), _dec21 = (0, _index3.type)(_index4.Vec2), _dec22 = (0, _index3.displayOrder)(5), _dec23 = (0, _index3.tooltip)('贴图坐标的偏移'), _dec24 = (0, _index3.type)(_gradientRange.default), _dec25 = (0, _index3.type)(_gradientRange.default), _dec26 = (0, _index3.displayOrder)(6), _dec27 = (0, _index3.tooltip)('线段颜色，如果采用渐变色，则表示沿着线段方向上的颜色渐变'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index3.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(Line, _Component);

    _createClass(Line, [{
      key: "texture",

      /**
       * @zh 显示的纹理。
       */
      get: function get() {
        return this._texture;
      },
      set: function set(val) {
        this._texture = val;

        if (this._materialInstance) {
          this._materialInstance.setProperty('mainTexture', val);
        }
      }
    }, {
      key: "worldSpace",

      /**
       * @zh positions是否为世界空间坐标。
       */
      get: function get() {
        return this._worldSpace;
      },
      set: function set(val) {
        this._worldSpace = val;

        if (this._materialInstance) {
          define[CC_USE_WORLD_SPACE] = this.worldSpace;

          this._materialInstance.recompileShaders(define);

          if (this._model) {
            this._model.setSubModelMaterial(0, this._materialInstance);
          }
        }
      }
    }, {
      key: "positions",

      /**
       * 每段折线的拐点坐标。
       */
      get: function get() {
        return this._positions;
      },
      set: function set(val) {
        this._positions = val;

        if (this._model) {
          this._model.addLineVertexData(this._positions, this._width, this._color);
        }
      }
    }, {
      key: "width",

      /**
       * @zh 线段的宽度。
       */
      get: function get() {
        return this._width;
      },
      set: function set(val) {
        this._width = val;

        if (this._model) {
          this._model.addLineVertexData(this._positions, this._width, this._color);
        }
      }
    }, {
      key: "tile",

      /**
       * @zh 图块数。
       */
      get: function get() {
        return this._tile;
      },
      set: function set(val) {
        this._tile.set(val);

        if (this._materialInstance) {
          this._tile_offset.x = this._tile.x;
          this._tile_offset.y = this._tile.y;

          this._materialInstance.setProperty('mainTiling_Offset', this._tile_offset);
        }
      }
    }, {
      key: "offset",
      get: function get() {
        return this._offset;
      },
      set: function set(val) {
        this._offset.set(val);

        if (this._materialInstance) {
          this._tile_offset.z = this._offset.x;
          this._tile_offset.w = this._offset.y;

          this._materialInstance.setProperty('mainTiling_Offset', this._tile_offset);
        }
      }
    }, {
      key: "color",

      /**
       * @zh 线段颜色。
       */
      get: function get() {
        return this._color;
      },
      set: function set(val) {
        this._color = val;

        if (this._model) {
          this._model.addLineVertexData(this._positions, this._width, this._color);
        }
      }
      /**
       * @ignore
       */

    }]);

    function Line() {
      var _this;

      _classCallCheck(this, Line);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this));

      _initializerDefineProperty(_this, "_texture", _descriptor, _assertThisInitialized(_this));

      _this._material = null;
      _this._materialInstance = null;

      _initializerDefineProperty(_this, "_worldSpace", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_positions", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_width", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_tile", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_offset", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_color", _descriptor7, _assertThisInitialized(_this));

      _this._model = null;
      _this._tile_offset = new _index4.Vec4();
      return _this;
    }

    _createClass(Line, [{
      key: "onLoad",
      value: function onLoad() {
        var model = this._model = _globalExports.legacyCC.director.root.createModel(_lineModel.LineModel);

        model.node = model.transform = this.node;

        if (this._material == null) {
          this._material = new _index.Material();

          this._material.copy(_index5.builtinResMgr.get('default-trail-material'));

          define[CC_USE_WORLD_SPACE] = this.worldSpace;
          _matInsInfo.parent = this._material;
          _matInsInfo.subModelIdx = 0;
          this._materialInstance = new _materialInstance.MaterialInstance(_matInsInfo);

          this._materialInstance.recompileShaders(define);
        }

        model.updateMaterial(this._materialInstance);
        model.setCapacity(100);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (!this._model) {
          return;
        }

        this.attachToScene();
        this.texture = this.texture;
        this.tile = this._tile;
        this.offset = this._offset;

        this._model.addLineVertexData(this._positions, this._width, this._color);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._model) {
          this.detachFromScene();
        }
      }
    }, {
      key: "attachToScene",
      value: function attachToScene() {
        if (this._model && this.node && this.node.scene) {
          if (this._model.scene) {
            this.detachFromScene();
          }

          this._getRenderScene().addModel(this._model);
        }
      }
    }, {
      key: "detachFromScene",
      value: function detachFromScene() {
        if (this._model && this._model.scene) {
          this._model.scene.removeModel(this._model);
        }
      }
    }]);

    return Line;
  }(_index2.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_texture", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "texture"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_worldSpace", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "worldSpace", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "worldSpace"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_positions", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "positions", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "positions"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_width", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "width", [_dec15, _dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "width"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_tile", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.Vec2(1, 1);
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "tile", [_dec18, _dec19, _dec20], Object.getOwnPropertyDescriptor(_class2.prototype, "tile"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_offset", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.Vec2(0, 0);
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "offset", [_dec21, _dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "offset"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradientRange.default();
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "color", [_dec25, _dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.Line = Line;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2xpbmUudHMiXSwibmFtZXMiOlsiX21hdEluc0luZm8iLCJwYXJlbnQiLCJvd25lciIsInN1Yk1vZGVsSWR4IiwiQ0NfVVNFX1dPUkxEX1NQQUNFIiwiZGVmaW5lIiwiTGluZSIsIlRleHR1cmUyRCIsIlZlYzMiLCJDdXJ2ZVJhbmdlIiwiVmVjMiIsIkdyYWRpZW50UmFuZ2UiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl90ZXh0dXJlIiwidmFsIiwiX21hdGVyaWFsSW5zdGFuY2UiLCJzZXRQcm9wZXJ0eSIsIl93b3JsZFNwYWNlIiwid29ybGRTcGFjZSIsInJlY29tcGlsZVNoYWRlcnMiLCJfbW9kZWwiLCJzZXRTdWJNb2RlbE1hdGVyaWFsIiwiX3Bvc2l0aW9ucyIsImFkZExpbmVWZXJ0ZXhEYXRhIiwiX3dpZHRoIiwiX2NvbG9yIiwiX3RpbGUiLCJzZXQiLCJfdGlsZV9vZmZzZXQiLCJ4IiwieSIsIl9vZmZzZXQiLCJ6IiwidyIsIl9tYXRlcmlhbCIsIlZlYzQiLCJtb2RlbCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwiY3JlYXRlTW9kZWwiLCJMaW5lTW9kZWwiLCJub2RlIiwidHJhbnNmb3JtIiwiTWF0ZXJpYWwiLCJjb3B5IiwiYnVpbHRpblJlc01nciIsImdldCIsIk1hdGVyaWFsSW5zdGFuY2UiLCJ1cGRhdGVNYXRlcmlhbCIsInNldENhcGFjaXR5IiwiYXR0YWNoVG9TY2VuZSIsInRleHR1cmUiLCJ0aWxlIiwib2Zmc2V0IiwiZGV0YWNoRnJvbVNjZW5lIiwic2NlbmUiLCJfZ2V0UmVuZGVyU2NlbmUiLCJhZGRNb2RlbCIsInJlbW92ZU1vZGVsIiwiQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxNQUFNQSxXQUFrQyxHQUFHO0FBQ3ZDQyxJ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S0FBS0MsTUFBakU7QUFDSDs7O2tDQUVtQjtBQUNoQixZQUFJLEtBQUtMLE1BQVQsRUFBaUI7QUFDYixlQUFLbUMsZUFBTDtBQUNIO0FBQ0o7OztzQ0FFd0I7QUFDckIsWUFBSSxLQUFLbkMsTUFBTCxJQUFlLEtBQUtzQixJQUFwQixJQUE0QixLQUFLQSxJQUFMLENBQVVjLEtBQTFDLEVBQWlEO0FBQzdDLGNBQUksS0FBS3BDLE1BQUwsQ0FBWW9DLEtBQWhCLEVBQXVCO0FBQ25CLGlCQUFLRCxlQUFMO0FBQ0g7O0FBQ0QsZUFBS0UsZUFBTCxHQUF1QkMsUUFBdkIsQ0FBZ0MsS0FBS3RDLE1BQXJDO0FBQ0g7QUFDSjs7O3dDQUUwQjtBQUN2QixZQUFJLEtBQUtBLE1BQUwsSUFBZSxLQUFLQSxNQUFMLENBQVlvQyxLQUEvQixFQUFzQztBQUNsQyxlQUFLcEMsTUFBTCxDQUFZb0MsS0FBWixDQUFrQkcsV0FBbEIsQ0FBOEIsS0FBS3ZDLE1BQW5DO0FBQ0g7QUFDSjs7OztJQTVNcUJ3QyxpQjs7Ozs7YUFFSCxJOztvUEFzQmxCQyxvQjs7Ozs7YUFDcUIsSzs7Ozs7OzthQXVCRCxFOzs7Ozs7O2FBb0JKLElBQUlwRCxtQkFBSixFOzs2T0FtQmhCb0Qsb0I7Ozs7O2FBQ2UsSUFBSW5ELFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDOzs2T0FxQmZtRCxvQjs7Ozs7YUFDaUIsSUFBSW5ELFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDOzs7Ozs7O2FBbUJELElBQUlDLHNCQUFKLEUiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIOeykuWtkOezu+e7n+aooeWdl1xyXG4gKiBAY2F0ZWdvcnkgcGFydGljbGVcclxuICovXHJcblxyXG5cclxuaW1wb3J0IHsgTWF0ZXJpYWwsIFRleHR1cmUyRCB9IGZyb20gJy4uL2NvcmUvYXNzZXRzJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIG1lbnUsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgVmVjMywgVmVjMiwgVmVjNCB9IGZyb20gJy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IExpbmVNb2RlbCB9IGZyb20gJy4vbW9kZWxzL2xpbmUtbW9kZWwnO1xyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vY29yZS8zZC9idWlsdGluJztcclxuaW1wb3J0IEN1cnZlUmFuZ2UgZnJvbSAnLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCBHcmFkaWVudFJhbmdlIGZyb20gJy4vYW5pbWF0b3IvZ3JhZGllbnQtcmFuZ2UnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBJTWF0ZXJpYWxJbnN0YW5jZUluZm8sIE1hdGVyaWFsSW5zdGFuY2UgfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5cclxuY29uc3QgX21hdEluc0luZm86IElNYXRlcmlhbEluc3RhbmNlSW5mbyA9IHtcclxuICAgIHBhcmVudDogbnVsbCEsXHJcbiAgICBvd25lcjogbnVsbCEsXHJcbiAgICBzdWJNb2RlbElkeDogMCxcclxufTtcclxuXHJcbmNvbnN0IENDX1VTRV9XT1JMRF9TUEFDRSA9ICdDQ19VU0VfV09STERfU1BBQ0UnO1xyXG5jb25zdCBkZWZpbmUgPSB7IENDX1VTRV9XT1JMRF9TUEFDRTogZmFsc2UgfTtcclxuXHJcbkBjY2NsYXNzKCdjYy5MaW5lJylcclxuQGhlbHAoJ2kxOG46Y2MuTGluZScpXHJcbkBtZW51KCdDb21wb25lbnRzL0xpbmUnKVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gICAgQHR5cGUoVGV4dHVyZTJEKVxyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZSA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5pi+56S655qE57q555CG44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFRleHR1cmUyRClcclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIEB0b29sdGlwKCfnur/mrrXkuK3mmL7npLrnmoTotLTlm74nKVxyXG4gICAgZ2V0IHRleHR1cmUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0ZXh0dXJlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl90ZXh0dXJlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsSW5zdGFuY2Uuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfbWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbEluc3RhbmNlOiBNYXRlcmlhbEluc3RhbmNlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfd29ybGRTcGFjZSA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIHBvc2l0aW9uc+aYr+WQpuS4uuS4lueVjOepuumXtOWdkOagh+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdG9vbHRpcCgn57q/5q615Lit5ZCE5Liq54K555qE5Z2Q5qCH6YeH55So5ZOq5Liq5Z2Q5qCH57O777yM5Yu+6YCJ5L2/55So5LiW55WM5Z2Q5qCH57O777yM5LiN6YCJ5L2/55So5pys5Zyw5Z2Q5qCH57O7JylcclxuICAgIGdldCB3b3JsZFNwYWNlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd29ybGRTcGFjZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd29ybGRTcGFjZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fd29ybGRTcGFjZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICBkZWZpbmVbQ0NfVVNFX1dPUkxEX1NQQUNFXSA9IHRoaXMud29ybGRTcGFjZTtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZS5yZWNvbXBpbGVTaGFkZXJzKGRlZmluZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0U3ViTW9kZWxNYXRlcmlhbCgwLCB0aGlzLl9tYXRlcmlhbEluc3RhbmNlISk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQHR5cGUoW1ZlYzNdKVxyXG4gICAgcHJpdmF0ZSBfcG9zaXRpb25zID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/mrrXmipjnur/nmoTmi5DngrnlnZDmoIfjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW1ZlYzNdKVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+avj+S4que6v+auteerr+eCueeahOWdkOaghycpXHJcbiAgICBnZXQgcG9zaXRpb25zICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwb3NpdGlvbnMgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9ucyA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuYWRkTGluZVZlcnRleERhdGEodGhpcy5fcG9zaXRpb25zLCB0aGlzLl93aWR0aCwgdGhpcy5fY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgcHJpdmF0ZSBfd2lkdGggPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOe6v+auteeahOWuveW6puOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgQHRvb2x0aXAoJ+e6v+auteWuveW6pu+8jOWmguaenOmHh+eUqOabsue6v++8jOWImeihqOekuuayv+edgOe6v+auteaWueWQkeS4iueahOabsue6v+WPmOWMlicpXHJcbiAgICBnZXQgd2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgd2lkdGggKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5hZGRMaW5lVmVydGV4RGF0YSh0aGlzLl9wb3NpdGlvbnMsIHRoaXMuX3dpZHRoLCB0aGlzLl9jb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3RpbGUgPSBuZXcgVmVjMigxLCAxKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlm77lnZfmlbDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmVjMilcclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCfotLTlm77lubPpk7rmrKHmlbAnKVxyXG4gICAgZ2V0IHRpbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0aWxlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl90aWxlLnNldCh2YWwpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbGVfb2Zmc2V0LnggPSB0aGlzLl90aWxlLng7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbGVfb2Zmc2V0LnkgPSB0aGlzLl90aWxlLnk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsSW5zdGFuY2Uuc2V0UHJvcGVydHkoJ21haW5UaWxpbmdfT2Zmc2V0JywgdGhpcy5fdGlsZV9vZmZzZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9vZmZzZXQgPSBuZXcgVmVjMigwLCAwKTtcclxuXHJcbiAgICBAdHlwZShWZWMyKVxyXG4gICAgQGRpc3BsYXlPcmRlcig1KVxyXG4gICAgQHRvb2x0aXAoJ+i0tOWbvuWdkOagh+eahOWBj+enuycpXHJcbiAgICBnZXQgb2Zmc2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBvZmZzZXQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX29mZnNldC5zZXQodmFsKTtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWxJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLl90aWxlX29mZnNldC56ID0gdGhpcy5fb2Zmc2V0Lng7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbGVfb2Zmc2V0LncgPSB0aGlzLl9vZmZzZXQueTtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZS5zZXRQcm9wZXJ0eSgnbWFpblRpbGluZ19PZmZzZXQnLCB0aGlzLl90aWxlX29mZnNldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBwcml2YXRlIF9jb2xvciA9IG5ldyBHcmFkaWVudFJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57q/5q616aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdG9vbHRpcCgn57q/5q616aKc6Imy77yM5aaC5p6c6YeH55So5riQ5Y+Y6Imy77yM5YiZ6KGo56S65rK/552A57q/5q615pa55ZCR5LiK55qE6aKc6Imy5riQ5Y+YJylcclxuICAgIGdldCBjb2xvciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb2xvciAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fY29sb3IgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmFkZExpbmVWZXJ0ZXhEYXRhKHRoaXMuX3Bvc2l0aW9ucywgdGhpcy5fd2lkdGgsIHRoaXMuX2NvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX21vZGVsOiBMaW5lTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RpbGVfb2Zmc2V0OiBWZWM0ID0gbmV3IFZlYzQoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMuX21vZGVsID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5jcmVhdGVNb2RlbChMaW5lTW9kZWwpO1xyXG4gICAgICAgIG1vZGVsLm5vZGUgPSBtb2RlbC50cmFuc2Zvcm0gPSB0aGlzLm5vZGU7XHJcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuY29weShidWlsdGluUmVzTWdyLmdldDxNYXRlcmlhbD4oJ2RlZmF1bHQtdHJhaWwtbWF0ZXJpYWwnKSk7XHJcbiAgICAgICAgICAgIGRlZmluZVtDQ19VU0VfV09STERfU1BBQ0VdID0gdGhpcy53b3JsZFNwYWNlO1xyXG4gICAgICAgICAgICBfbWF0SW5zSW5mby5wYXJlbnQgPSB0aGlzLl9tYXRlcmlhbDtcclxuICAgICAgICAgICAgX21hdEluc0luZm8uc3ViTW9kZWxJZHggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbEluc3RhbmNlID0gbmV3IE1hdGVyaWFsSW5zdGFuY2UoX21hdEluc0luZm8pO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbEluc3RhbmNlLnJlY29tcGlsZVNoYWRlcnMoZGVmaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW9kZWwudXBkYXRlTWF0ZXJpYWwodGhpcy5fbWF0ZXJpYWxJbnN0YW5jZSEpO1xyXG4gICAgICAgIG1vZGVsLnNldENhcGFjaXR5KDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hdHRhY2hUb1NjZW5lKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gdGhpcy50ZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGlsZSA9IHRoaXMuX3RpbGU7XHJcbiAgICAgICAgdGhpcy5vZmZzZXQgPSB0aGlzLl9vZmZzZXQ7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwuYWRkTGluZVZlcnRleERhdGEodGhpcy5fcG9zaXRpb25zLCB0aGlzLl93aWR0aCwgdGhpcy5fY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiB0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLnNjZW5lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5zY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9nZXRSZW5kZXJTY2VuZSgpLmFkZE1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRhY2hGcm9tU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiB0aGlzLl9tb2RlbC5zY2VuZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zY2VuZS5yZW1vdmVNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==