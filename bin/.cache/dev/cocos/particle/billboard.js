(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/3d/builtin/index.js", "../core/3d/misc/utils.js", "../core/assets/index.js", "../core/components/component.js", "../core/data/decorators/index.js", "../core/gfx/index.js", "../core/math/index.js", "../core/renderer/index.js", "../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/3d/builtin/index.js"), require("../core/3d/misc/utils.js"), require("../core/assets/index.js"), require("../core/components/component.js"), require("../core/data/decorators/index.js"), require("../core/gfx/index.js"), require("../core/math/index.js"), require("../core/renderer/index.js"), require("../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.utils, global.index, global.component, global.index, global.index, global.index, global.index, global.globalExports);
    global.billboard = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _utils, _index2, _component, _index3, _index4, _index5, _index6, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Billboard = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

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

  var Billboard = (_dec = (0, _index3.ccclass)('cc.Billboard'), _dec2 = (0, _index3.help)('i18n:cc.Billboard'), _dec3 = (0, _index3.menu)('Components/Billboard'), _dec4 = (0, _index3.type)(_index2.Texture2D), _dec5 = (0, _index3.type)(_index2.Texture2D), _dec6 = (0, _index3.tooltip)('billboard显示的贴图'), _dec7 = (0, _index3.tooltip)('billboard的高度'), _dec8 = (0, _index3.tooltip)('billboard的宽度'), _dec9 = (0, _index3.tooltip)('billboard绕中心点旋转的角度'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index3.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_Component) {
    _inherits(Billboard, _Component);

    _createClass(Billboard, [{
      key: "texture",

      /**
       * @zh Billboard纹理。
       */
      get: function get() {
        return this._texture;
      },
      set: function set(val) {
        this._texture = val;

        if (this._material) {
          this._material.setProperty('mainTexture', val);
        }
      }
    }, {
      key: "height",

      /**
       * @zh 高度。
       */
      get: function get() {
        return this._height;
      },
      set: function set(val) {
        this._height = val;

        if (this._material) {
          this._uniform.y = val;

          this._material.setProperty('cc_size_rotation', this._uniform);
        }
      }
    }, {
      key: "width",

      /**
       * @zh 宽度。
       */
      get: function get() {
        return this._width;
      },
      set: function set(val) {
        this._width = val;

        if (this._material) {
          this._uniform.x = val;

          this._material.setProperty('cc_size_rotation', this._uniform);
        }
      }
    }, {
      key: "rotation",

      /**
       * @zh 角度。
       */
      get: function get() {
        return Math.round((0, _index5.toDegree)(this._rotation) * 100) / 100;
      },
      set: function set(val) {
        this._rotation = (0, _index5.toRadian)(val);

        if (this._material) {
          this._uniform.z = this._rotation;

          this._material.setProperty('cc_size_rotation', this._uniform);
        }
      }
    }]);

    function Billboard() {
      var _this;

      _classCallCheck(this, Billboard);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Billboard).call(this));

      _initializerDefineProperty(_this, "_texture", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_height", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_width", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_rotation", _descriptor4, _assertThisInitialized(_this));

      _this._model = null;
      _this._mesh = null;
      _this._material = null;
      _this._uniform = new _index5.Vec4(1, 1, 0, 0);
      return _this;
    }

    _createClass(Billboard, [{
      key: "onLoad",
      value: function onLoad() {
        this.createModel();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this.attachToScene();
        this._model.enabled = true;
        this.width = this._width;
        this.height = this._height;
        this.rotation = this.rotation;
        this.texture = this.texture;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.detachFromScene();
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
    }, {
      key: "createModel",
      value: function createModel() {
        this._mesh = (0, _utils.createMesh)({
          primitiveMode: _index4.GFXPrimitiveMode.TRIANGLE_LIST,
          positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          uvs: [0, 0, 1, 0, 0, 1, 1, 1],
          colors: [_index5.Color.WHITE.r, _index5.Color.WHITE.g, _index5.Color.WHITE.b, _index5.Color.WHITE.a, _index5.Color.WHITE.r, _index5.Color.WHITE.g, _index5.Color.WHITE.b, _index5.Color.WHITE.a, _index5.Color.WHITE.r, _index5.Color.WHITE.g, _index5.Color.WHITE.b, _index5.Color.WHITE.a, _index5.Color.WHITE.r, _index5.Color.WHITE.g, _index5.Color.WHITE.b, _index5.Color.WHITE.a],
          attributes: [new _index4.GFXAttribute(_index4.GFXAttributeName.ATTR_POSITION, _index4.GFXFormat.RGB32F), new _index4.GFXAttribute(_index4.GFXAttributeName.ATTR_TEX_COORD, _index4.GFXFormat.RG32F), new _index4.GFXAttribute(_index4.GFXAttributeName.ATTR_COLOR, _index4.GFXFormat.RGBA8UI, true)],
          indices: [0, 1, 2, 1, 2, 3]
        }, undefined, {
          calculateBounds: false
        });

        var model = this._model = _globalExports.legacyCC.director.root.createModel(_index6.scene.Model, this.node);

        model.node = model.transform = this.node;

        if (this._material == null) {
          this._material = new _index2.Material();

          this._material.copy(_index.builtinResMgr.get('default-billboard-material'));
        }

        model.initSubModel(0, this._mesh.renderingSubMeshes[0], this._material);
      }
    }]);

    return Billboard;
  }(_component.Component), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_texture", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "texture", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "texture"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_height", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "height", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "height"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_width", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "width", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "width"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_rotation", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "rotation", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "rotation"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.Billboard = Billboard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2JpbGxib2FyZC50cyJdLCJuYW1lcyI6WyJCaWxsYm9hcmQiLCJUZXh0dXJlMkQiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl90ZXh0dXJlIiwidmFsIiwiX21hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJfaGVpZ2h0IiwiX3VuaWZvcm0iLCJ5IiwiX3dpZHRoIiwieCIsIk1hdGgiLCJyb3VuZCIsIl9yb3RhdGlvbiIsInoiLCJfbW9kZWwiLCJfbWVzaCIsIlZlYzQiLCJjcmVhdGVNb2RlbCIsImF0dGFjaFRvU2NlbmUiLCJlbmFibGVkIiwid2lkdGgiLCJoZWlnaHQiLCJyb3RhdGlvbiIsInRleHR1cmUiLCJkZXRhY2hGcm9tU2NlbmUiLCJub2RlIiwic2NlbmUiLCJfZ2V0UmVuZGVyU2NlbmUiLCJhZGRNb2RlbCIsInJlbW92ZU1vZGVsIiwicHJpbWl0aXZlTW9kZSIsIkdGWFByaW1pdGl2ZU1vZGUiLCJUUklBTkdMRV9MSVNUIiwicG9zaXRpb25zIiwidXZzIiwiY29sb3JzIiwiQ29sb3IiLCJXSElURSIsInIiLCJnIiwiYiIsImEiLCJhdHRyaWJ1dGVzIiwiR0ZYQXR0cmlidXRlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJHRlhGb3JtYXQiLCJSR0IzMkYiLCJBVFRSX1RFWF9DT09SRCIsIlJHMzJGIiwiQVRUUl9DT0xPUiIsIlJHQkE4VUkiLCJpbmRpY2VzIiwidW5kZWZpbmVkIiwiY2FsY3VsYXRlQm91bmRzIiwibW9kZWwiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsIk1vZGVsIiwidHJhbnNmb3JtIiwiTWF0ZXJpYWwiLCJjb3B5IiwiYnVpbHRpblJlc01nciIsImdldCIsImluaXRTdWJNb2RlbCIsInJlbmRlcmluZ1N1Yk1lc2hlcyIsIkNvbXBvbmVudCIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0FBV21ELGtCQUFYLENBQThCLENBQTlCLENBQXRCLEVBQXdELEtBQUsvRCxTQUE3RDtBQUNIOzs7O0lBeEowQmdFLG9COzs7OzthQUdSLEk7O3lPQWtCbEJDLG9COzs7OzthQUNpQixDOzsrTkFrQmpCQSxvQjs7Ozs7YUFDZ0IsQzs7Z09Ba0JoQkEsb0I7Ozs7O2FBQ21CLEMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBwYXJ0aWNsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGJ1aWx0aW5SZXNNZ3IgfSBmcm9tICcuLi9jb3JlLzNkL2J1aWx0aW4nO1xyXG5pbXBvcnQgeyBjcmVhdGVNZXNoIH0gZnJvbSAnLi4vY29yZS8zZC9taXNjL3V0aWxzJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwsIE1lc2gsIFRleHR1cmUyRCB9IGZyb20gJy4uL2NvcmUvYXNzZXRzJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnRzL2NvbXBvbmVudCc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGVJbkVkaXRNb2RlLCBtZW51LCB0b29sdGlwLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUsIEdGWEF0dHJpYnV0ZU5hbWUsIEdGWEZvcm1hdCwgR0ZYUHJpbWl0aXZlTW9kZSB9IGZyb20gJy4uL2NvcmUvZ2Z4JztcclxuaW1wb3J0IHsgQ29sb3IsIHRvRGVncmVlLCB0b1JhZGlhbiwgVmVjNCB9IGZyb20gJy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IHNjZW5lIH0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5AY2NjbGFzcygnY2MuQmlsbGJvYXJkJylcclxuQGhlbHAoJ2kxOG46Y2MuQmlsbGJvYXJkJylcclxuQG1lbnUoJ0NvbXBvbmVudHMvQmlsbGJvYXJkJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBCaWxsYm9hcmQgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIEB0eXBlKFRleHR1cmUyRClcclxuICAgIHByaXZhdGUgX3RleHR1cmUgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIEJpbGxib2FyZOe6ueeQhuOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShUZXh0dXJlMkQpXHJcbiAgICBAdG9vbHRpcCgnYmlsbGJvYXJk5pi+56S655qE6LS05Zu+JylcclxuICAgIGdldCB0ZXh0dXJlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdGV4dHVyZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0ID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpq5jluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2JpbGxib2FyZOeahOmrmOW6picpXHJcbiAgICBnZXQgaGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBoZWlnaHQgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5pZm9ybS55ID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5zZXRQcm9wZXJ0eSgnY2Nfc2l6ZV9yb3RhdGlvbicsIHRoaXMuX3VuaWZvcm0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF93aWR0aCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5a695bqm44CCXHJcbiAgICAgKi9cclxuICAgIEB0b29sdGlwKCdiaWxsYm9hcmTnmoTlrr3luqYnKVxyXG4gICAgcHVibGljIGdldCB3aWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgd2lkdGggKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91bmlmb3JtLnggPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCdjY19zaXplX3JvdGF0aW9uJywgdGhpcy5fdW5pZm9ybSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3JvdGF0aW9uID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDop5LluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2JpbGxib2FyZOe7leS4reW/g+eCueaXi+i9rOeahOinkuW6picpXHJcbiAgICBwdWJsaWMgZ2V0IHJvdGF0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0b0RlZ3JlZSh0aGlzLl9yb3RhdGlvbikgKiAxMDApIC8gMTAwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3JvdGF0aW9uID0gdG9SYWRpYW4odmFsKTtcclxuICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5pZm9ybS56ID0gdGhpcy5fcm90YXRpb247XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLnNldFByb3BlcnR5KCdjY19zaXplX3JvdGF0aW9uJywgdGhpcy5fdW5pZm9ybSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX21vZGVsOiBzY2VuZS5Nb2RlbCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX21lc2g6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9tYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF91bmlmb3JtID0gbmV3IFZlYzQoMSwgMSwgMCwgMCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVNb2RlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5hdHRhY2hUb1NjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwhLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLl93aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuX2hlaWdodDtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbjtcclxuICAgICAgICB0aGlzLnRleHR1cmUgPSB0aGlzLnRleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGF0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiB0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLnNjZW5lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5zY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9nZXRSZW5kZXJTY2VuZSgpLmFkZE1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXRhY2hGcm9tU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiB0aGlzLl9tb2RlbC5zY2VuZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zY2VuZS5yZW1vdmVNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlTW9kZWwgKCkge1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSBjcmVhdGVNZXNoKHtcclxuICAgICAgICAgICAgcHJpbWl0aXZlTW9kZTogR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9MSVNULFxyXG4gICAgICAgICAgICBwb3NpdGlvbnM6IFswLCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwXSxcclxuICAgICAgICAgICAgdXZzOiBbMCwgMCxcclxuICAgICAgICAgICAgICAgIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAxLFxyXG4gICAgICAgICAgICAgICAgMSwgMV0sXHJcbiAgICAgICAgICAgIGNvbG9yczogW1xyXG4gICAgICAgICAgICAgICAgQ29sb3IuV0hJVEUuciwgQ29sb3IuV0hJVEUuZywgQ29sb3IuV0hJVEUuYiwgQ29sb3IuV0hJVEUuYSxcclxuICAgICAgICAgICAgICAgIENvbG9yLldISVRFLnIsIENvbG9yLldISVRFLmcsIENvbG9yLldISVRFLmIsIENvbG9yLldISVRFLmEsXHJcbiAgICAgICAgICAgICAgICBDb2xvci5XSElURS5yLCBDb2xvci5XSElURS5nLCBDb2xvci5XSElURS5iLCBDb2xvci5XSElURS5hLFxyXG4gICAgICAgICAgICAgICAgQ29sb3IuV0hJVEUuciwgQ29sb3IuV0hJVEUuZywgQ29sb3IuV0hJVEUuYiwgQ29sb3IuV0hJVEUuYV0sXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IFtcclxuICAgICAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OLCBHRlhGb3JtYXQuUkdCMzJGKSxcclxuICAgICAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRCwgR0ZYRm9ybWF0LlJHMzJGKSxcclxuICAgICAgICAgICAgICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX0NPTE9SLCBHRlhGb3JtYXQuUkdCQThVSSwgdHJ1ZSksXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGluZGljZXM6IFswLCAxLCAyLCAxLCAyLCAzXSxcclxuICAgICAgICB9LCB1bmRlZmluZWQsIHsgY2FsY3VsYXRlQm91bmRzOiBmYWxzZSB9KTtcclxuICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMuX21vZGVsID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5jcmVhdGVNb2RlbChzY2VuZS5Nb2RlbCwgdGhpcy5ub2RlKTtcclxuICAgICAgICBtb2RlbC5ub2RlID0gbW9kZWwudHJhbnNmb3JtID0gdGhpcy5ub2RlO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLmNvcHkoYnVpbHRpblJlc01nci5nZXQ8TWF0ZXJpYWw+KCdkZWZhdWx0LWJpbGxib2FyZC1tYXRlcmlhbCcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbW9kZWwuaW5pdFN1Yk1vZGVsKDAsIHRoaXMuX21lc2gucmVuZGVyaW5nU3ViTWVzaGVzWzBdLCB0aGlzLl9tYXRlcmlhbCEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==