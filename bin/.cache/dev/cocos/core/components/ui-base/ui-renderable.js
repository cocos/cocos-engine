(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../../math/index.js", "../../platform/event-manager/event-enum.js", "../../value-types/enum.js", "../../3d/builtin/init.js", "../../gfx/define.js", "../../renderer/index.js", "../../renderer/ui/render-data.js", "./ui-transform.js", "../../3d/framework/renderable-component.js", "../../default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../../math/index.js"), require("../../platform/event-manager/event-enum.js"), require("../../value-types/enum.js"), require("../../3d/builtin/init.js"), require("../../gfx/define.js"), require("../../renderer/index.js"), require("../../renderer/ui/render-data.js"), require("./ui-transform.js"), require("../../3d/framework/renderable-component.js"), require("../../default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.eventEnum, global._enum, global.init, global.define, global.index, global.renderData, global.uiTransform, global.renderableComponent, global.defaultConstants);
    global.uiRenderable = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _eventEnum, _enum, _init, _define, _index3, _renderData, _uiTransform, _renderableComponent, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIRenderable = _exports.InstanceMaterialType = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  // hack
  (0, _enum.ccenum)(_define.GFXBlendFactor);
  /**
   * @en
   * The shader property type of the material after instantiation.
   *
   * @zh
   * 实例后的材质的着色器属性类型。
   */

  var InstanceMaterialType;
  _exports.InstanceMaterialType = InstanceMaterialType;

  (function (InstanceMaterialType) {
    InstanceMaterialType[InstanceMaterialType["ADD_COLOR"] = 0] = "ADD_COLOR";
    InstanceMaterialType[InstanceMaterialType["ADD_COLOR_AND_TEXTURE"] = 1] = "ADD_COLOR_AND_TEXTURE";
    InstanceMaterialType[InstanceMaterialType["GRAYSCALE"] = 2] = "GRAYSCALE";
    InstanceMaterialType[InstanceMaterialType["USE_ALPHA_SEPARATED"] = 3] = "USE_ALPHA_SEPARATED";
    InstanceMaterialType[InstanceMaterialType["USE_ALPHA_SEPARATED_AND_GRAY"] = 4] = "USE_ALPHA_SEPARATED_AND_GRAY";
  })(InstanceMaterialType || (_exports.InstanceMaterialType = InstanceMaterialType = {}));

  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };
  /**
   * @en
   * Base class for components which supports rendering features.
   *
   * @zh
   * 所有支持渲染的 UI 组件的基类。
   */

  var UIRenderable = (_dec = (0, _index.ccclass)('cc.UIRenderable'), _dec2 = (0, _index.requireComponent)(_uiTransform.UITransform), _dec3 = (0, _index.type)(_define.GFXBlendFactor), _dec4 = (0, _index.displayOrder)(0), _dec5 = (0, _index.tooltip)('原图混合模式'), _dec6 = (0, _index.type)(_define.GFXBlendFactor), _dec7 = (0, _index.displayOrder)(1), _dec8 = (0, _index.tooltip)('目标混合模式'), _dec9 = (0, _index.displayOrder)(2), _dec10 = (0, _index.tooltip)('渲染颜色'), _dec(_class = _dec2(_class = (0, _index.disallowMultiple)(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderableComponent) {
    _inherits(UIRenderable, _RenderableComponent);

    function UIRenderable() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIRenderable);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIRenderable)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._uiMaterial = null;
      _this._uiMaterialIns = null;
      _this._uiMaterialDirty = false;
      _this._uiMatInsDirty = false;

      _initializerDefineProperty(_this, "_srcBlendFactor", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_dstBlendFactor", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_color", _descriptor3, _assertThisInitialized(_this));

      _this._assembler = null;
      _this._postAssembler = null;
      _this._renderData = null;
      _this._renderDataFlag = true;
      _this._renderFlag = true;
      _this._delegateSrc = null;
      _this._instanceMaterialType = InstanceMaterialType.ADD_COLOR_AND_TEXTURE;
      _this._blendTemplate = {
        blendState: {
          targets: [{
            blendSrc: _define.GFXBlendFactor.SRC_ALPHA,
            blendDst: _define.GFXBlendFactor.ONE_MINUS_SRC_ALPHA
          }]
        }
      };
      _this._lastParent = null;
      return _this;
    }

    _createClass(UIRenderable, [{
      key: "getUIRenderMaterial",
      value: function getUIRenderMaterial() {
        return this._uiMaterialIns || this._uiMaterial;
      }
    }, {
      key: "getUIMaterialInstance",
      value: function getUIMaterialInstance() {
        if (!this._uiMaterialIns || this._uiMatInsDirty) {
          _matInsInfo.owner = this;
          _matInsInfo.parent = this._uiMaterial;
          this._uiMaterialIns = new _index3.MaterialInstance(_matInsInfo);
          this._uiMatInsDirty = false;
        }

        return this._uiMaterialIns;
      }
    }, {
      key: "__preload",
      value: function __preload() {
        this.node._uiProps.uiComp = this;

        if (this._flushAssembler) {
          this._flushAssembler();
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this.node.on(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.on(_eventEnum.SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = this._canRender();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.node.off(_eventEnum.SystemEventType.ANCHOR_CHANGED, this._nodeStateChange, this);
        this.node.off(_eventEnum.SystemEventType.SIZE_CHANGED, this._nodeStateChange, this);
        this._renderFlag = false;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this.node._uiProps.uiComp === this) {
          this.node._uiProps.uiComp = null;
        }

        this.destroyRenderData();

        if (this._materialInstances) {
          for (var i = 0; i < this._materialInstances.length; i++) {
            this._materialInstances[i].destroy();
          }
        }

        if (this._uiMaterialIns) {
          this._uiMaterialIns.destroy();
        }

        this._renderData = null;
      }
      /**
       * @en
       * Marks the render data of the current component as modified so that the render data is recalculated.
       *
       * @zh
       * 标记当前组件的渲染数据为已修改状态，这样渲染数据才会重新计算。
       *
       * @param enable 是否标记为已修改。
       */

    }, {
      key: "markForUpdateRenderData",
      value: function markForUpdateRenderData() {
        var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this._renderFlag = this._canRender();

        if (enable && this._renderFlag) {
          var renderData = this._renderData;

          if (renderData) {
            renderData.vertDirty = true;
          }

          this._renderDataFlag = enable;
        } else if (!enable) {
          this._renderDataFlag = enable;
        }
      }
      /**
       * @en
       * Request a new render data.
       *
       * @zh
       * 请求渲染数据。
       *
       * @return 渲染数据 RenderData。
       */

    }, {
      key: "requestRenderData",
      value: function requestRenderData() {
        var data = _renderData.RenderData.add();

        this._renderData = data;
        return data;
      }
      /**
       * @en
       * Destroy render data.
       *
       * @zh
       * 渲染数据销毁。
       */

    }, {
      key: "destroyRenderData",
      value: function destroyRenderData() {
        if (!this._renderData) {
          return;
        }

        _renderData.RenderData.remove(this._renderData);

        this._renderData = null;
      } // Don't call it unless you know your purpose.

    }, {
      key: "updateAssembler",
      value: function updateAssembler(render) {
        if (this._renderFlag) {
          this._checkAndUpdateRenderData();

          this._render(render);
        }
      } // Don't call it unless you know your purpose.

    }, {
      key: "postUpdateAssembler",
      value: function postUpdateAssembler(render) {
        if (this._renderFlag) {
          this._postRender(render);
        }
      }
    }, {
      key: "_render",
      value: function _render(render) {}
    }, {
      key: "_postRender",
      value: function _postRender(render) {}
    }, {
      key: "_checkAndUpdateRenderData",
      value: function _checkAndUpdateRenderData() {
        if (this._renderDataFlag) {
          this._assembler.updateRenderData(this);

          this._renderDataFlag = false;
        }
      }
    }, {
      key: "_canRender",
      value: function _canRender() {
        // this.getMaterial(0) !== null still can render is hack for builtin Material
        return this.enabled && (this._delegateSrc ? this._delegateSrc.activeInHierarchy : this.enabledInHierarchy);
      }
    }, {
      key: "_postCanRender",
      value: function _postCanRender() {}
    }, {
      key: "_updateColor",
      value: function _updateColor() {
        if (this._assembler && this._assembler.updateColor) {
          this._assembler.updateColor(this);
        }
      }
    }, {
      key: "_updateBlendFunc",
      value: function _updateBlendFunc() {
        var mat = this.getMaterial(0);
        var target = this._blendTemplate.blendState.targets[0];

        if (mat) {
          if (target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor) {
            mat = this.material;
            target.blendDst = this._dstBlendFactor;
            target.blendSrc = this._srcBlendFactor;
            mat.overridePipelineStates(this._blendTemplate, 0);
          }

          return mat;
        }

        if (this._uiMaterialIns !== null && this._uiMatInsDirty || target.blendDst !== this._dstBlendFactor || target.blendSrc !== this._srcBlendFactor) {
          mat = this.getUIMaterialInstance();
          target.blendDst = this._dstBlendFactor;
          target.blendSrc = this._srcBlendFactor;
          mat.overridePipelineStates(this._blendTemplate, 0);
        }

        return mat || this.getUIRenderMaterial();
      } // pos, rot, scale changed

    }, {
      key: "_nodeStateChange",
      value: function _nodeStateChange(type) {
        if (this._renderData) {
          this.markForUpdateRenderData();
        }

        var _iterator = _createForOfIteratorHelper(this.node.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var child = _step.value;
            var renderComp = child.getComponent(UIRenderable);

            if (renderComp) {
              renderComp.markForUpdateRenderData();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "_updateBuiltinMaterial",
      value: function _updateBuiltinMaterial() {
        // not need _uiMaterialDirty at firstTime
        var init = false;

        if (!this._uiMaterial) {
          init = true;
        }

        if (this._uiMaterial && !this._uiMaterialDirty) {
          return this._uiMaterial;
        } else {
          switch (this._instanceMaterialType) {
            case InstanceMaterialType.ADD_COLOR:
              this._uiMaterial = _init.builtinResMgr.get('ui-base-material');
              break;

            case InstanceMaterialType.ADD_COLOR_AND_TEXTURE:
              this._uiMaterial = _init.builtinResMgr.get('ui-sprite-material');
              break;

            case InstanceMaterialType.GRAYSCALE:
              this._uiMaterial = _init.builtinResMgr.get('ui-sprite-gray-material');
              break;

            case InstanceMaterialType.USE_ALPHA_SEPARATED:
              this._uiMaterial = _init.builtinResMgr.get('ui-sprite-alpha-sep-material');
              break;

            case InstanceMaterialType.USE_ALPHA_SEPARATED_AND_GRAY:
              this._uiMaterial = _init.builtinResMgr.get('ui-sprite-gray-alpha-sep-material');
              break;

            default:
              this._uiMaterial = _init.builtinResMgr.get('ui-sprite-material');
              break;
          }

          this._uiMaterialDirty = false;

          if (!init) {
            this._uiMatInsDirty = true;
          }

          return this._uiMaterial;
        }
      }
    }, {
      key: "srcBlendFactor",

      /**
       * @en
       * Specifies the blend mode for the original image, it will clone a new material object.
       *
       * @zh
       * 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的。
       *
       * @param value 原图混合模式。
       * @example
       * ```ts
       * sprite.srcBlendFactor = GFXBlendFactor.ONE;
       * ```
       */
      get: function get() {
        return this._srcBlendFactor;
      },
      set: function set(value) {
        if (this._srcBlendFactor === value) {
          return;
        }

        this._srcBlendFactor = value;

        this._updateBlendFunc();
      }
      /**
       * @en
       * Specifies the blend mode for the target image.
       *
       * @zh
       * 指定目标的混合模式。
       *
       * @param value 目标混合模式。
       * @example
       * ```ts
       * sprite.dstBlendFactor = GFXBlendFactor.ONE;
       * ```
       */

    }, {
      key: "dstBlendFactor",
      get: function get() {
        return this._dstBlendFactor;
      },
      set: function set(value) {
        if (this._dstBlendFactor === value) {
          return;
        }

        this._dstBlendFactor = value;

        this._updateBlendFunc();
      }
      /**
       * @en
       * Render color.
       *
       * @zh
       * 渲染颜色。
       *
       * @param value 渲染颜色。
       */

    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        if (this._color === value) {
          return;
        }

        this._color.set(value);

        this._updateColor();

        this.markForUpdateRenderData();

        if (_defaultConstants.EDITOR) {
          var clone = value.clone();
          this.node.emit(_eventEnum.SystemEventType.COLOR_CHANGED, clone);
        }
      } // hack for builtinMaterial

    }, {
      key: "uiMaterial",
      get: function get() {
        return this._uiMaterial;
      },
      set: function set(val) {
        this._uiMaterial = val;
      }
    }, {
      key: "renderData",
      get: function get() {
        return this._renderData;
      } // Render data can be submitted even if it is not on the node tree

    }, {
      key: "delegateSrc",
      set: function set(value) {
        this._delegateSrc = value;
      }
    }]);

    return UIRenderable;
  }(_renderableComponent.RenderableComponent), _class3.BlendState = _define.GFXBlendFactor, _class3.Assembler = null, _class3.PostAssembler = null, _temp), (_applyDecoratedDescriptor(_class2.prototype, "srcBlendFactor", [_dec3, _dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "srcBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "dstBlendFactor", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "dstBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_srcBlendFactor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXBlendFactor.SRC_ALPHA;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_dstBlendFactor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXBlendFactor.ONE_MINUS_SRC_ALPHA;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_color", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.UIRenderable = UIRenderable;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy91aS1iYXNlL3VpLXJlbmRlcmFibGUudHMiXSwibmFtZXMiOlsiR0ZYQmxlbmRGYWN0b3IiLCJJbnN0YW5jZU1hdGVyaWFsVHlwZSIsIl9tYXRJbnNJbmZvIiwicGFyZW50Iiwib3duZXIiLCJzdWJNb2RlbElkeCIsIlVJUmVuZGVyYWJsZSIsIlVJVHJhbnNmb3JtIiwiZGlzYWxsb3dNdWx0aXBsZSIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiX3VpTWF0ZXJpYWwiLCJfdWlNYXRlcmlhbElucyIsIl91aU1hdGVyaWFsRGlydHkiLCJfdWlNYXRJbnNEaXJ0eSIsIl9hc3NlbWJsZXIiLCJfcG9zdEFzc2VtYmxlciIsIl9yZW5kZXJEYXRhIiwiX3JlbmRlckRhdGFGbGFnIiwiX3JlbmRlckZsYWciLCJfZGVsZWdhdGVTcmMiLCJfaW5zdGFuY2VNYXRlcmlhbFR5cGUiLCJBRERfQ09MT1JfQU5EX1RFWFRVUkUiLCJfYmxlbmRUZW1wbGF0ZSIsImJsZW5kU3RhdGUiLCJ0YXJnZXRzIiwiYmxlbmRTcmMiLCJTUkNfQUxQSEEiLCJibGVuZERzdCIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJfbGFzdFBhcmVudCIsIk1hdGVyaWFsSW5zdGFuY2UiLCJub2RlIiwiX3VpUHJvcHMiLCJ1aUNvbXAiLCJfZmx1c2hBc3NlbWJsZXIiLCJvbiIsIlN5c3RlbUV2ZW50VHlwZSIsIkFOQ0hPUl9DSEFOR0VEIiwiX25vZGVTdGF0ZUNoYW5nZSIsIlNJWkVfQ0hBTkdFRCIsIl9jYW5SZW5kZXIiLCJvZmYiLCJkZXN0cm95UmVuZGVyRGF0YSIsIl9tYXRlcmlhbEluc3RhbmNlcyIsImkiLCJsZW5ndGgiLCJkZXN0cm95IiwiZW5hYmxlIiwicmVuZGVyRGF0YSIsInZlcnREaXJ0eSIsImRhdGEiLCJSZW5kZXJEYXRhIiwiYWRkIiwicmVtb3ZlIiwicmVuZGVyIiwiX2NoZWNrQW5kVXBkYXRlUmVuZGVyRGF0YSIsIl9yZW5kZXIiLCJfcG9zdFJlbmRlciIsInVwZGF0ZVJlbmRlckRhdGEiLCJlbmFibGVkIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJ1cGRhdGVDb2xvciIsIm1hdCIsImdldE1hdGVyaWFsIiwidGFyZ2V0IiwiX2RzdEJsZW5kRmFjdG9yIiwiX3NyY0JsZW5kRmFjdG9yIiwibWF0ZXJpYWwiLCJvdmVycmlkZVBpcGVsaW5lU3RhdGVzIiwiZ2V0VUlNYXRlcmlhbEluc3RhbmNlIiwiZ2V0VUlSZW5kZXJNYXRlcmlhbCIsInR5cGUiLCJtYXJrRm9yVXBkYXRlUmVuZGVyRGF0YSIsImNoaWxkcmVuIiwiY2hpbGQiLCJyZW5kZXJDb21wIiwiZ2V0Q29tcG9uZW50IiwiaW5pdCIsIkFERF9DT0xPUiIsImJ1aWx0aW5SZXNNZ3IiLCJnZXQiLCJHUkFZU0NBTEUiLCJVU0VfQUxQSEFfU0VQQVJBVEVEIiwiVVNFX0FMUEhBX1NFUEFSQVRFRF9BTkRfR1JBWSIsInZhbHVlIiwiX3VwZGF0ZUJsZW5kRnVuYyIsIl9jb2xvciIsInNldCIsIl91cGRhdGVDb2xvciIsIkVESVRPUiIsImNsb25lIiwiZW1pdCIsIkNPTE9SX0NIQU5HRUQiLCJ2YWwiLCJSZW5kZXJhYmxlQ29tcG9uZW50IiwiQmxlbmRTdGF0ZSIsIkFzc2VtYmxlciIsIlBvc3RBc3NlbWJsZXIiLCJzZXJpYWxpemFibGUiLCJDb2xvciIsIldISVRFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0RBO0FBQ0Esb0JBQU9BLHNCQUFQO0FBRUE7Ozs7Ozs7O01BT1lDLG9COzs7YUFBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7S0FBQUEsb0IscUNBQUFB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QyxJLFVBQ3RDQyxhLEdBQTBDLEksa2xCQUV2REMsbUI7Ozs7O2FBQzJCbkcsdUJBQWUwQixTOztzRkFDMUN5RSxtQjs7Ozs7YUFDMkJuRyx1QkFBZTRCLG1COzs2RUFDMUN1RSxtQjs7Ozs7YUFDeUJDLGNBQU1DLEtBQU4sQ0FBWVYsS0FBWixFIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgZXhlY3V0ZUluRWRpdE1vZGUsIHJlcXVpcmVDb21wb25lbnQsIGRpc2FsbG93TXVsdGlwbGUsIHRvb2x0aXAsIHR5cGUsIGRpc3BsYXlPcmRlciwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgQ29sb3IgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgU3lzdGVtRXZlbnRUeXBlIH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudC1lbnVtJztcclxuaW1wb3J0IHsgY2NlbnVtIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IGJ1aWx0aW5SZXNNZ3IgfSBmcm9tICcuLi8uLi8zZC9idWlsdGluL2luaXQnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uLy4uL2Fzc2V0cyc7XHJcbmltcG9ydCB7IEdGWEJsZW5kRmFjdG9yIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsSW5zdGFuY2UgfSBmcm9tICcuLi8uLi9yZW5kZXJlcic7XHJcbmltcG9ydCB7IElNYXRlcmlhbEluc3RhbmNlSW5mbyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBJQXNzZW1ibGVyLCBJQXNzZW1ibGVyTWFuYWdlciB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3VpL2Jhc2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJEYXRhIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvdWkvcmVuZGVyLWRhdGEnO1xyXG5pbXBvcnQgeyBVSSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgVHJhbnNmb3JtQml0IH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgvbm9kZS1lbnVtJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFVJVHJhbnNmb3JtIH0gZnJvbSAnLi91aS10cmFuc2Zvcm0nO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vM2QvZnJhbWV3b3JrL3JlbmRlcmFibGUtY29tcG9uZW50JztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuXHJcbi8vIGhhY2tcclxuY2NlbnVtKEdGWEJsZW5kRmFjdG9yKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIHNoYWRlciBwcm9wZXJ0eSB0eXBlIG9mIHRoZSBtYXRlcmlhbCBhZnRlciBpbnN0YW50aWF0aW9uLlxyXG4gKlxyXG4gKiBAemhcclxuICog5a6e5L6L5ZCO55qE5p2Q6LSo55qE552A6Imy5Zmo5bGe5oCn57G75Z6L44CCXHJcbiAqL1xyXG5leHBvcnQgZW51bSBJbnN0YW5jZU1hdGVyaWFsVHlwZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHNoYWRlciBvbmx5IGhhcyBjb2xvciBwcm9wZXJ0aWVzLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog552A6Imy5Zmo5Y+q5bim6aKc6Imy5bGe5oCn44CCXHJcbiAgICAgKi9cclxuICAgIEFERF9DT0xPUiA9IDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzaGFkZXIgaGFzIGNvbG9yIGFuZCB0ZXh0dXJlIHByb3BlcnRpZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnnYDoibLlmajluKbpopzoibLlkozotLTlm77lsZ7mgKfjgIJcclxuICAgICAqL1xyXG4gICAgQUREX0NPTE9SX0FORF9URVhUVVJFID0gMSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHNoYWRlciBoYXMgY29sb3IgYW5kIHRleHR1cmUgcHJvcGVydGllcyBhbmQgdXNlcyBncmF5c2NhbGUgbW9kZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOedgOiJsuWZqOW4puminOiJsuWSjOi0tOWbvuWxnuaApyzlubbkvb/nlKjngbDluqbmqKHlvI/jgIJcclxuICAgICAqL1xyXG4gICAgR1JBWVNDQUxFID0gMixcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHNoYWRlciBoYXMgY29sb3IgYW5kIHRleHR1cmUgcHJvcGVydGllcyBhbmQgdXNlcyBlbWJlZGRlZCBhbHBoYSBtb2RlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog552A6Imy5Zmo5bim6aKc6Imy5ZKM6LS05Zu+5bGe5oCnLOW5tuS9v+eUqOmAj+aYjumAmumBk+WIhuemu+i0tOWbvuOAglxyXG4gICAgICovXHJcbiAgICBVU0VfQUxQSEFfU0VQQVJBVEVEID0gMyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHNoYWRlciBoYXMgY29sb3IgYW5kIHRleHR1cmUgcHJvcGVydGllcyBhbmQgdXNlcyBlbWJlZGRlZCBhbHBoYSBhbmQgZ3JheXNjYWxlIG1vZGUuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnnYDoibLlmajluKbpopzoibLlkozotLTlm77lsZ7mgKcs5bm25L2/55So54Gw5bqm5qih5byP44CCXHJcbiAgICAgKi9cclxuICAgIFVTRV9BTFBIQV9TRVBBUkFURURfQU5EX0dSQVkgPSA0LFxyXG59XHJcblxyXG5jb25zdCBfbWF0SW5zSW5mbzogSU1hdGVyaWFsSW5zdGFuY2VJbmZvID0ge1xyXG4gICAgcGFyZW50OiBudWxsISxcclxuICAgIG93bmVyOiBudWxsISxcclxuICAgIHN1Yk1vZGVsSWR4OiAwLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNlIGNsYXNzIGZvciBjb21wb25lbnRzIHdoaWNoIHN1cHBvcnRzIHJlbmRlcmluZyBmZWF0dXJlcy5cclxuICpcclxuICogQHpoXHJcbiAqIOaJgOacieaUr+aMgea4suafk+eahCBVSSDnu4Tku7bnmoTln7rnsbvjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5VSVJlbmRlcmFibGUnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuQGRpc2FsbG93TXVsdGlwbGVcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBVSVJlbmRlcmFibGUgZXh0ZW5kcyBSZW5kZXJhYmxlQ29tcG9uZW50IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3BlY2lmaWVzIHRoZSBibGVuZCBtb2RlIGZvciB0aGUgb3JpZ2luYWwgaW1hZ2UsIGl0IHdpbGwgY2xvbmUgYSBuZXcgbWF0ZXJpYWwgb2JqZWN0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oyH5a6a5Y6f5Zu+55qE5re35ZCI5qih5byP77yM6L+Z5Lya5YWL6ZqG5LiA5Liq5paw55qE5p2Q6LSo5a+56LGh77yM5rOo5oSP6L+Z5bim5p2l55qE44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHZhbHVlIOWOn+Wbvua3t+WQiOaooeW8j+OAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBzcHJpdGUuc3JjQmxlbmRGYWN0b3IgPSBHRlhCbGVuZEZhY3Rvci5PTkU7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgQHR5cGUoR0ZYQmxlbmRGYWN0b3IpXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn5Y6f5Zu+5re35ZCI5qih5byPJylcclxuICAgIGdldCBzcmNCbGVuZEZhY3RvciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NyY0JsZW5kRmFjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzcmNCbGVuZEZhY3RvciAodmFsdWU6IEdGWEJsZW5kRmFjdG9yKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zcmNCbGVuZEZhY3RvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUJsZW5kRnVuYygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTcGVjaWZpZXMgdGhlIGJsZW5kIG1vZGUgZm9yIHRoZSB0YXJnZXQgaW1hZ2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjIflrprnm67moIfnmoTmt7flkIjmqKHlvI/jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUg55uu5qCH5re35ZCI5qih5byP44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIHNwcml0ZS5kc3RCbGVuZEZhY3RvciA9IEdGWEJsZW5kRmFjdG9yLk9ORTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBAdHlwZShHRlhCbGVuZEZhY3RvcilcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCfnm67moIfmt7flkIjmqKHlvI8nKVxyXG4gICAgZ2V0IGRzdEJsZW5kRmFjdG9yICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZHN0QmxlbmRGYWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGRzdEJsZW5kRmFjdG9yICh2YWx1ZTogR0ZYQmxlbmRGYWN0b3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fZHN0QmxlbmRGYWN0b3IgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RzdEJsZW5kRmFjdG9yID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlbmRlciBjb2xvci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa4suafk+minOiJsuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2YWx1ZSDmuLLmn5PpopzoibLjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+a4suafk+minOiJsicpXHJcbiAgICBnZXQgY29sb3IgKCk6IFJlYWRvbmx5PENvbG9yPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjb2xvciAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY29sb3IgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbG9yLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlQ29sb3IoKTtcclxuICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBsZXQgY2xvbmUgPSB2YWx1ZS5jbG9uZSgpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZW1pdChTeXN0ZW1FdmVudFR5cGUuQ09MT1JfQ0hBTkdFRCwgY2xvbmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBoYWNrIGZvciBidWlsdGluTWF0ZXJpYWxcclxuICAgIHByb3RlY3RlZCBfdWlNYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfdWlNYXRlcmlhbEluczogTWF0ZXJpYWxJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXRVSVJlbmRlck1hdGVyaWFsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdWlNYXRlcmlhbElucyB8fCB0aGlzLl91aU1hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRVSU1hdGVyaWFsSW5zdGFuY2UgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fdWlNYXRlcmlhbElucyB8fCB0aGlzLl91aU1hdEluc0RpcnR5KSB7XHJcbiAgICAgICAgICAgIF9tYXRJbnNJbmZvLm93bmVyID0gdGhpcztcclxuICAgICAgICAgICAgX21hdEluc0luZm8ucGFyZW50ID0gdGhpcy5fdWlNYXRlcmlhbCE7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpTWF0ZXJpYWxJbnMgPSBuZXcgTWF0ZXJpYWxJbnN0YW5jZShfbWF0SW5zSW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpTWF0SW5zRGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VpTWF0ZXJpYWxJbnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91aU1hdGVyaWFsRGlydHkgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfdWlNYXRJbnNEaXJ0eSA9IGZhbHNlO1xyXG5cclxuICAgIGdldCB1aU1hdGVyaWFsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdWlNYXRlcmlhbDtcclxuICAgIH1cclxuICAgIHNldCB1aU1hdGVyaWFsICh2YWwpIHtcclxuICAgICAgICB0aGlzLl91aU1hdGVyaWFsID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByZW5kZXJEYXRhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyRGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZW5kZXIgZGF0YSBjYW4gYmUgc3VibWl0dGVkIGV2ZW4gaWYgaXQgaXMgbm90IG9uIHRoZSBub2RlIHRyZWVcclxuICAgIHNldCBkZWxlZ2F0ZVNyYyAodmFsdWU6IE5vZGUpIHtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZVNyYyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgQmxlbmRTdGF0ZSA9IEdGWEJsZW5kRmFjdG9yO1xyXG4gICAgcHVibGljIHN0YXRpYyBBc3NlbWJsZXI6IElBc3NlbWJsZXJNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3RhdGljIFBvc3RBc3NlbWJsZXI6IElBc3NlbWJsZXJNYW5hZ2VyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zcmNCbGVuZEZhY3RvciA9IEdGWEJsZW5kRmFjdG9yLlNSQ19BTFBIQTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZHN0QmxlbmRGYWN0b3IgPSBHRlhCbGVuZEZhY3Rvci5PTkVfTUlOVVNfU1JDX0FMUEhBO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9jb2xvcjogQ29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG5cclxuICAgIHByb3RlY3RlZCBfYXNzZW1ibGVyOiBJQXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3Bvc3RBc3NlbWJsZXI6IElBc3NlbWJsZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyRGF0YTogUmVuZGVyRGF0YSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJEYXRhRmxhZyA9IHRydWU7XHJcbiAgICBwcm90ZWN0ZWQgX3JlbmRlckZsYWcgPSB0cnVlO1xyXG4gICAgLy8g54m55q6K5riy5p+T6IqC54K577yM57uZ5LiA5Lqb5LiN5Zyo6IqC54K55qCR5LiK55qE57uE5Lu25YGa5L6d6LWW5riy5p+T77yI5L6L5aaCIG1hc2sg57uE5Lu25YaF572u5Lik5LiqIGdyYXBoaWNzIOadpea4suafk++8iVxyXG4gICAgcHJvdGVjdGVkIF9kZWxlZ2F0ZVNyYzogTm9kZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9pbnN0YW5jZU1hdGVyaWFsVHlwZSA9IEluc3RhbmNlTWF0ZXJpYWxUeXBlLkFERF9DT0xPUl9BTkRfVEVYVFVSRTtcclxuICAgIHByb3RlY3RlZCBfYmxlbmRUZW1wbGF0ZSA9IHtcclxuICAgICAgICBibGVuZFN0YXRlOiB7XHJcbiAgICAgICAgICAgIHRhcmdldHM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBibGVuZFNyYzogR0ZYQmxlbmRGYWN0b3IuU1JDX0FMUEhBLFxyXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kRHN0OiBHRlhCbGVuZEZhY3Rvci5PTkVfTUlOVVNfU1JDX0FMUEhBLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2xhc3RQYXJlbnQ6IE5vZGUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgX19wcmVsb2FkICgpe1xyXG4gICAgICAgIHRoaXMubm9kZS5fdWlQcm9wcy51aUNvbXAgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLl9mbHVzaEFzc2VtYmxlcil7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsdXNoQXNzZW1ibGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKFN5c3RlbUV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fbm9kZVN0YXRlQ2hhbmdlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fbm9kZVN0YXRlQ2hhbmdlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnID0gdGhpcy5fY2FuUmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX25vZGVTdGF0ZUNoYW5nZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihTeXN0ZW1FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl9ub2RlU3RhdGVDaGFuZ2UsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckZsYWcgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLl91aVByb3BzLnVpQ29tcCA9PT0gdGhpcykge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuX3VpUHJvcHMudWlDb21wID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kZXN0cm95UmVuZGVyRGF0YSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbEluc3RhbmNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9tYXRlcmlhbEluc3RhbmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWxJbnN0YW5jZXNbaV0hLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fdWlNYXRlcmlhbElucykge1xyXG4gICAgICAgICAgICB0aGlzLl91aU1hdGVyaWFsSW5zLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyRGF0YSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIE1hcmtzIHRoZSByZW5kZXIgZGF0YSBvZiB0aGUgY3VycmVudCBjb21wb25lbnQgYXMgbW9kaWZpZWQgc28gdGhhdCB0aGUgcmVuZGVyIGRhdGEgaXMgcmVjYWxjdWxhdGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5qCH6K6w5b2T5YmN57uE5Lu255qE5riy5p+T5pWw5o2u5Li65bey5L+u5pS554q25oCB77yM6L+Z5qC35riy5p+T5pWw5o2u5omN5Lya6YeN5paw6K6h566X44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVuYWJsZSDmmK/lkKbmoIforrDkuLrlt7Lkv67mlLnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhIChlbmFibGU6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyA9IHRoaXMuX2NhblJlbmRlcigpO1xyXG4gICAgICAgIGlmIChlbmFibGUgJiYgdGhpcy5fcmVuZGVyRmxhZykge1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJEYXRhID0gdGhpcy5fcmVuZGVyRGF0YTtcclxuICAgICAgICAgICAgaWYgKHJlbmRlckRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJlbmRlckRhdGEudmVydERpcnR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRGF0YUZsYWcgPSBlbmFibGU7XHJcbiAgICAgICAgfSBlbHNlIGlmICghZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckRhdGFGbGFnID0gZW5hYmxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVxdWVzdCBhIG5ldyByZW5kZXIgZGF0YS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOivt+axgua4suafk+aVsOaNruOAglxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4g5riy5p+T5pWw5o2uIFJlbmRlckRhdGHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlcXVlc3RSZW5kZXJEYXRhICgpIHtcclxuICAgICAgICBjb25zdCBkYXRhID0gUmVuZGVyRGF0YS5hZGQoKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gZGF0YTtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRGVzdHJveSByZW5kZXIgZGF0YS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa4suafk+aVsOaNrumUgOavgeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveVJlbmRlckRhdGEgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBSZW5kZXJEYXRhLnJlbW92ZSh0aGlzLl9yZW5kZXJEYXRhKTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJEYXRhID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBEb24ndCBjYWxsIGl0IHVubGVzcyB5b3Uga25vdyB5b3VyIHB1cnBvc2UuXHJcbiAgICBwdWJsaWMgdXBkYXRlQXNzZW1ibGVyIChyZW5kZXI6IFVJKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlckZsYWcpe1xyXG4gICAgICAgICAgICB0aGlzLl9jaGVja0FuZFVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIERvbid0IGNhbGwgaXQgdW5sZXNzIHlvdSBrbm93IHlvdXIgcHVycG9zZS5cclxuICAgIHB1YmxpYyBwb3N0VXBkYXRlQXNzZW1ibGVyIChyZW5kZXI6IFVJKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlckZsYWcpIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9zdFJlbmRlcihyZW5kZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlbmRlciAocmVuZGVyOiBVSSkge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Bvc3RSZW5kZXIgKHJlbmRlcjogVUkpIHt9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jaGVja0FuZFVwZGF0ZVJlbmRlckRhdGEgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJEYXRhRmxhZykge1xyXG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIhLnVwZGF0ZVJlbmRlckRhdGEhKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJEYXRhRmxhZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NhblJlbmRlciAoKSB7XHJcbiAgICAgICAgLy8gdGhpcy5nZXRNYXRlcmlhbCgwKSAhPT0gbnVsbCBzdGlsbCBjYW4gcmVuZGVyIGlzIGhhY2sgZm9yIGJ1aWx0aW4gTWF0ZXJpYWxcclxuICAgICAgICByZXR1cm4gdGhpcy5lbmFibGVkICYmICh0aGlzLl9kZWxlZ2F0ZVNyYyA/IHRoaXMuX2RlbGVnYXRlU3JjLmFjdGl2ZUluSGllcmFyY2h5IDogdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcG9zdENhblJlbmRlciAoKSB7fVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlQ29sb3IgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLnVwZGF0ZUNvbG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlciEudXBkYXRlQ29sb3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfdXBkYXRlQmxlbmRGdW5jICgpIHtcclxuICAgICAgICBsZXQgbWF0ID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl9ibGVuZFRlbXBsYXRlLmJsZW5kU3RhdGUudGFyZ2V0c1swXTtcclxuXHJcbiAgICAgICAgaWYobWF0KSB7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQuYmxlbmREc3QgIT09IHRoaXMuX2RzdEJsZW5kRmFjdG9yIHx8IHRhcmdldC5ibGVuZFNyYyAhPT0gdGhpcy5fc3JjQmxlbmRGYWN0b3IpIHtcclxuICAgICAgICAgICAgICAgIG1hdCA9IHRoaXMubWF0ZXJpYWwhO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmJsZW5kRHN0ID0gdGhpcy5fZHN0QmxlbmRGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuYmxlbmRTcmMgPSB0aGlzLl9zcmNCbGVuZEZhY3RvcjtcclxuICAgICAgICAgICAgICAgIG1hdC5vdmVycmlkZVBpcGVsaW5lU3RhdGVzKHRoaXMuX2JsZW5kVGVtcGxhdGUsIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKHRoaXMuX3VpTWF0ZXJpYWxJbnMgIT09IG51bGwgJiYgdGhpcy5fdWlNYXRJbnNEaXJ0eSkgfHxcclxuICAgICAgICAgICAgKHRhcmdldC5ibGVuZERzdCAhPT0gdGhpcy5fZHN0QmxlbmRGYWN0b3IgfHwgdGFyZ2V0LmJsZW5kU3JjICE9PSB0aGlzLl9zcmNCbGVuZEZhY3RvcikpIHtcclxuICAgICAgICAgICAgbWF0ID0gdGhpcy5nZXRVSU1hdGVyaWFsSW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgdGFyZ2V0LmJsZW5kRHN0ID0gdGhpcy5fZHN0QmxlbmRGYWN0b3I7XHJcbiAgICAgICAgICAgIHRhcmdldC5ibGVuZFNyYyA9IHRoaXMuX3NyY0JsZW5kRmFjdG9yO1xyXG4gICAgICAgICAgICBtYXQub3ZlcnJpZGVQaXBlbGluZVN0YXRlcyh0aGlzLl9ibGVuZFRlbXBsYXRlLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXQgfHwgdGhpcy5nZXRVSVJlbmRlck1hdGVyaWFsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcG9zLCByb3QsIHNjYWxlIGNoYW5nZWRcclxuICAgIHByb3RlY3RlZCBfbm9kZVN0YXRlQ2hhbmdlICh0eXBlOiBUcmFuc2Zvcm1CaXQpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmVuZGVyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMubm9kZS5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJDb21wID0gY2hpbGQuZ2V0Q29tcG9uZW50KFVJUmVuZGVyYWJsZSk7XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJDb21wKSB7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb21wLm1hcmtGb3JVcGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVCdWlsdGluTWF0ZXJpYWwgKCkgOiBNYXRlcmlhbCB7XHJcbiAgICAgICAgLy8gbm90IG5lZWQgX3VpTWF0ZXJpYWxEaXJ0eSBhdCBmaXJzdFRpbWVcclxuICAgICAgICBsZXQgaW5pdCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICghdGhpcy5fdWlNYXRlcmlhbCkgeyBpbml0ID0gdHJ1ZTsgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fdWlNYXRlcmlhbCAmJiAhdGhpcy5fdWlNYXRlcmlhbERpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl91aU1hdGVyaWFsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5faW5zdGFuY2VNYXRlcmlhbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgSW5zdGFuY2VNYXRlcmlhbFR5cGUuQUREX0NPTE9SOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpTWF0ZXJpYWwgPSBidWlsdGluUmVzTWdyLmdldCgndWktYmFzZS1tYXRlcmlhbCcpIGFzIE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBJbnN0YW5jZU1hdGVyaWFsVHlwZS5BRERfQ09MT1JfQU5EX1RFWFRVUkU6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdWlNYXRlcmlhbCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0KCd1aS1zcHJpdGUtbWF0ZXJpYWwnKSBhcyBNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgSW5zdGFuY2VNYXRlcmlhbFR5cGUuR1JBWVNDQUxFOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VpTWF0ZXJpYWwgPSBidWlsdGluUmVzTWdyLmdldCgndWktc3ByaXRlLWdyYXktbWF0ZXJpYWwnKSBhcyBNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgSW5zdGFuY2VNYXRlcmlhbFR5cGUuVVNFX0FMUEhBX1NFUEFSQVRFRDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aU1hdGVyaWFsID0gYnVpbHRpblJlc01nci5nZXQoJ3VpLXNwcml0ZS1hbHBoYS1zZXAtbWF0ZXJpYWwnKSBhcyBNYXRlcmlhbDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgSW5zdGFuY2VNYXRlcmlhbFR5cGUuVVNFX0FMUEhBX1NFUEFSQVRFRF9BTkRfR1JBWTpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aU1hdGVyaWFsID0gYnVpbHRpblJlc01nci5nZXQoJ3VpLXNwcml0ZS1ncmF5LWFscGhhLXNlcC1tYXRlcmlhbCcpIGFzIE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91aU1hdGVyaWFsID0gYnVpbHRpblJlc01nci5nZXQoJ3VpLXNwcml0ZS1tYXRlcmlhbCcpIGFzIE1hdGVyaWFsO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3VpTWF0ZXJpYWxEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZighaW5pdCkge3RoaXMuX3VpTWF0SW5zRGlydHkgPSB0cnVlO31cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3VpTWF0ZXJpYWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZmx1c2hBc3NlbWJsZXI/ICgpOiB2b2lkO1xyXG59XHJcbiJdfQ==