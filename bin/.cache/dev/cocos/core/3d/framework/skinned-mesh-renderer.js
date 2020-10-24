(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/skeleton.js", "../../data/decorators/index.js", "../../renderer/index.js", "../../scene-graph/node.js", "./mesh-renderer.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/skeleton.js"), require("../../data/decorators/index.js"), require("../../renderer/index.js"), require("../../scene-graph/node.js"), require("./mesh-renderer.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skeleton, global.index, global.index, global.node, global.meshRenderer, global.globalExports);
    global.skinnedMeshRenderer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skeleton, _index, _index2, _node, _meshRenderer, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.SkinnedMeshRenderer = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _temp;

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

  /**
   * @en The skinned mesh renderer component.
   * @zh 蒙皮网格渲染器组件。
   */
  var SkinnedMeshRenderer = (_dec = (0, _index.ccclass)('cc.SkinnedMeshRenderer'), _dec2 = (0, _index.help)('i18n:cc.SkinnedMeshRenderer'), _dec3 = (0, _index.executionOrder)(100), _dec4 = (0, _index.menu)('Components/SkinnedMeshRenderer'), _dec5 = (0, _index.type)(_skeleton.Skeleton), _dec6 = (0, _index.type)(_node.Node), _dec7 = (0, _index.type)(_skeleton.Skeleton), _dec8 = (0, _index.type)(_node.Node), _dec9 = (0, _index.tooltip)('i18n:model.skinning_root'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = _dec4(_class = (_class2 = (_temp = /*#__PURE__*/function (_MeshRenderer) {
    _inherits(SkinnedMeshRenderer, _MeshRenderer);

    _createClass(SkinnedMeshRenderer, [{
      key: "skeleton",

      /**
       * @en The skeleton asset.
       * @zh 骨骼资源。
       */
      get: function get() {
        return this._skeleton;
      },
      set: function set(val) {
        if (val === this._skeleton) {
          return;
        }

        this._skeleton = val;

        this._update();
      }
      /**
       * @en The skinning root. (The node where the controlling Animation is located)
       * 骨骼根节点的引用，对应控制此模型的动画组件所在节点。
       */

    }, {
      key: "skinningRoot",
      get: function get() {
        return this._skinningRoot;
      },
      set: function set(value) {
        if (value === this._skinningRoot) {
          return;
        }

        this._skinningRoot = value;

        this._updateModelType();

        this._update();
      }
    }, {
      key: "model",
      get: function get() {
        return this._model;
      }
    }]);

    function SkinnedMeshRenderer() {
      var _this;

      _classCallCheck(this, SkinnedMeshRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SkinnedMeshRenderer).call(this));

      _initializerDefineProperty(_this, "_skeleton", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_skinningRoot", _descriptor2, _assertThisInitialized(_this));

      _this._clip = null;
      _this._modelType = _index2.models.BakedSkinningModel;
      return _this;
    }

    _createClass(SkinnedMeshRenderer, [{
      key: "__preload",
      value: function __preload() {
        this._updateModelType();
      }
    }, {
      key: "uploadAnimation",
      value: function uploadAnimation(clip) {
        this._clip = clip;

        if (this.model && this.model.uploadAnimation) {
          this.model.uploadAnimation(clip);
        }
      }
    }, {
      key: "setUseBakedAnimation",
      value: function setUseBakedAnimation() {
        var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var modelType = val ? _index2.models.BakedSkinningModel : _index2.models.SkinningModel;

        if (this._modelType === modelType) {
          return;
        }

        this._modelType = modelType;

        if (this._model) {
          _globalExports.legacyCC.director.root.destroyModel(this._model);

          this._model = null;
          this._models.length = 0;

          this._updateModels();

          this._updateCastShadow();

          if (this.enabledInHierarchy) {
            this._attachToScene();
          }
        }
      }
    }, {
      key: "setMaterial",
      value: function setMaterial(material, index) {
        _get(_getPrototypeOf(SkinnedMeshRenderer.prototype), "setMaterial", this).call(this, material, index);

        if (this._modelType === _index2.models.SkinningModel) {
          this.getMaterialInstance(index);
        }
      }
    }, {
      key: "_updateModelParams",
      value: function _updateModelParams() {
        this._update(); // should bind skeleton before super create pso


        _get(_getPrototypeOf(SkinnedMeshRenderer.prototype), "_updateModelParams", this).call(this);
      }
    }, {
      key: "_updateModelType",
      value: function _updateModelType() {
        if (!this._skinningRoot) {
          return;
        }

        var comp = this._skinningRoot.getComponent('cc.SkeletalAnimation');

        if (comp) {
          this.setUseBakedAnimation(comp.useBakedAnimation);
        }
      }
    }, {
      key: "_update",
      value: function _update() {
        if (this.model) {
          this.model.bindSkeleton(this._skeleton, this._skinningRoot, this._mesh);

          if (this.model.uploadAnimation) {
            this.model.uploadAnimation(this._clip);
          }
        }
      }
    }]);

    return SkinnedMeshRenderer;
  }(_meshRenderer.MeshRenderer), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_skeleton", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_skinningRoot", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "skeleton", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "skeleton"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "skinningRoot", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "skinningRoot"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.SkinnedMeshRenderer = SkinnedMeshRenderer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL3NraW5uZWQtbWVzaC1yZW5kZXJlci50cyJdLCJuYW1lcyI6WyJTa2lubmVkTWVzaFJlbmRlcmVyIiwiU2tlbGV0b24iLCJOb2RlIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfc2tlbGV0b24iLCJ2YWwiLCJfdXBkYXRlIiwiX3NraW5uaW5nUm9vdCIsInZhbHVlIiwiX3VwZGF0ZU1vZGVsVHlwZSIsIl9tb2RlbCIsIl9jbGlwIiwiX21vZGVsVHlwZSIsIm1vZGVscyIsIkJha2VkU2tpbm5pbmdNb2RlbCIsImNsaXAiLCJtb2RlbCIsInVwbG9hZEFuaW1hdGlvbiIsIm1vZGVsVHlwZSIsIlNraW5uaW5nTW9kZWwiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImRlc3Ryb3lNb2RlbCIsIl9tb2RlbHMiLCJsZW5ndGgiLCJfdXBkYXRlTW9kZWxzIiwiX3VwZGF0ZUNhc3RTaGFkb3ciLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfYXR0YWNoVG9TY2VuZSIsIm1hdGVyaWFsIiwiaW5kZXgiLCJnZXRNYXRlcmlhbEluc3RhbmNlIiwiY29tcCIsImdldENvbXBvbmVudCIsInNldFVzZUJha2VkQW5pbWF0aW9uIiwidXNlQmFrZWRBbmltYXRpb24iLCJiaW5kU2tlbGV0b24iLCJfbWVzaCIsIk1lc2hSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7Ozs7TUFTYUEsbUIsV0FMWixvQkFBUSx3QkFBUixDLFVBQ0EsaUJBQUssNkJBQUwsQyxVQUNBLDJCQUFlLEdBQWYsQyxVQUVBLGlCQUFLLGdDQUFMLEMsVUFHSSxpQkFBS0Msa0JBQUwsQyxVQUdBLGlCQUFLQyxVQUFMLEMsVUFTQSxpQkFBS0Qsa0JBQUwsQyxVQWVBLGlCQUFLQyxVQUFMLEMsVUFDQSxvQkFBUSwwQkFBUixDLGtE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Q29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbW9kZWxcclxuICovXHJcblxyXG5pbXBvcnQgeyBBbmltYXRpb25DbGlwIH0gZnJvbSAnLi4vLi4vYW5pbWF0aW9uL2FuaW1hdGlvbi1jbGlwJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMnO1xyXG5pbXBvcnQgeyBTa2VsZXRvbiB9IGZyb20gJy4uLy4uL2Fzc2V0cy9za2VsZXRvbic7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGV4ZWN1dGVJbkVkaXRNb2RlLCBleGVjdXRpb25PcmRlciwgaGVscCwgbWVudSwgdG9vbHRpcCwgdHlwZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IG1vZGVscyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL25vZGUnO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tICcuL21lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBTa2VsZXRhbEFuaW1hdGlvbiB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi9za2VsZXRhbC1hbmltYXRpb24nO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIHNraW5uZWQgbWVzaCByZW5kZXJlciBjb21wb25lbnQuXHJcbiAqIEB6aCDokpnnmq7nvZHmoLzmuLLmn5Plmajnu4Tku7bjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5Ta2lubmVkTWVzaFJlbmRlcmVyJylcclxuQGhlbHAoJ2kxOG46Y2MuU2tpbm5lZE1lc2hSZW5kZXJlcicpXHJcbkBleGVjdXRpb25PcmRlcigxMDApXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5AbWVudSgnQ29tcG9uZW50cy9Ta2lubmVkTWVzaFJlbmRlcmVyJylcclxuZXhwb3J0IGNsYXNzIFNraW5uZWRNZXNoUmVuZGVyZXIgZXh0ZW5kcyBNZXNoUmVuZGVyZXIge1xyXG5cclxuICAgIEB0eXBlKFNrZWxldG9uKVxyXG4gICAgcHJvdGVjdGVkIF9za2VsZXRvbjogU2tlbGV0b24gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBAdHlwZShOb2RlKVxyXG4gICAgcHJvdGVjdGVkIF9za2lubmluZ1Jvb3Q6IE5vZGUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NsaXA6IEFuaW1hdGlvbkNsaXAgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc2tlbGV0b24gYXNzZXQuXHJcbiAgICAgKiBAemgg6aqo6aq86LWE5rqQ44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNrZWxldG9uKVxyXG4gICAgZ2V0IHNrZWxldG9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2tlbGV0b247XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNrZWxldG9uICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsID09PSB0aGlzLl9za2VsZXRvbikgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9za2VsZXRvbiA9IHZhbDtcclxuICAgICAgICB0aGlzLl91cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc2tpbm5pbmcgcm9vdC4gKFRoZSBub2RlIHdoZXJlIHRoZSBjb250cm9sbGluZyBBbmltYXRpb24gaXMgbG9jYXRlZClcclxuICAgICAqIOmqqOmqvOagueiKgueCueeahOW8leeUqO+8jOWvueW6lOaOp+WItuatpOaooeWei+eahOWKqOeUu+e7hOS7tuaJgOWcqOiKgueCueOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShOb2RlKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46bW9kZWwuc2tpbm5pbmdfcm9vdCcpXHJcbiAgICBnZXQgc2tpbm5pbmdSb290ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2tpbm5pbmdSb290O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBza2lubmluZ1Jvb3QgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl9za2lubmluZ1Jvb3QpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fc2tpbm5pbmdSb290ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9kZWxUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1vZGVsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwgYXMgbW9kZWxzLlNraW5uaW5nTW9kZWwgfCBtb2RlbHMuQmFrZWRTa2lubmluZ01vZGVsIHwgbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9tb2RlbFR5cGUgPSBtb2RlbHMuQmFrZWRTa2lubmluZ01vZGVsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfX3ByZWxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVsVHlwZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGxvYWRBbmltYXRpb24gKGNsaXA6IEFuaW1hdGlvbkNsaXAgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fY2xpcCA9IGNsaXA7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwgJiYgdGhpcy5tb2RlbC51cGxvYWRBbmltYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGxvYWRBbmltYXRpb24oY2xpcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRVc2VCYWtlZEFuaW1hdGlvbiAodmFsID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG1vZGVsVHlwZSA9IHZhbCA/IG1vZGVscy5CYWtlZFNraW5uaW5nTW9kZWwgOiBtb2RlbHMuU2tpbm5pbmdNb2RlbDtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWxUeXBlID09PSBtb2RlbFR5cGUpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fbW9kZWxUeXBlID0gbW9kZWxUeXBlO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRlc3Ryb3lNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVscygpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYXN0U2hhZG93KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRNYXRlcmlhbCAobWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnNldE1hdGVyaWFsKG1hdGVyaWFsLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsVHlwZSA9PT0gbW9kZWxzLlNraW5uaW5nTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXRNYXRlcmlhbEluc3RhbmNlKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVNb2RlbFBhcmFtcyAoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlKCk7IC8vIHNob3VsZCBiaW5kIHNrZWxldG9uIGJlZm9yZSBzdXBlciBjcmVhdGUgcHNvXHJcbiAgICAgICAgc3VwZXIuX3VwZGF0ZU1vZGVsUGFyYW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlTW9kZWxUeXBlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NraW5uaW5nUm9vdCkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBjb21wID0gdGhpcy5fc2tpbm5pbmdSb290LmdldENvbXBvbmVudCgnY2MuU2tlbGV0YWxBbmltYXRpb24nKSBhcyBTa2VsZXRhbEFuaW1hdGlvbjtcclxuICAgICAgICBpZiAoY29tcCkgeyB0aGlzLnNldFVzZUJha2VkQW5pbWF0aW9uKGNvbXAudXNlQmFrZWRBbmltYXRpb24pOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLmJpbmRTa2VsZXRvbih0aGlzLl9za2VsZXRvbiwgdGhpcy5fc2tpbm5pbmdSb290LCB0aGlzLl9tZXNoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubW9kZWwudXBsb2FkQW5pbWF0aW9uKSB7IHRoaXMubW9kZWwudXBsb2FkQW5pbWF0aW9uKHRoaXMuX2NsaXApOyB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==