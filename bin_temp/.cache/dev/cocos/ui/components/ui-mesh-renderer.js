(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/ui-base/ui-component.js", "../../core/data/decorators/index.js", "../../core/director.js", "../../core/pipeline/define.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/ui-base/ui-component.js"), require("../../core/data/decorators/index.js"), require("../../core/director.js"), require("../../core/pipeline/define.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.uiComponent, global.index, global.director, global.define, global.globalExports);
    global.uiMeshRenderer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _uiComponent, _index, _director, _define, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIMeshRenderer = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  /**
   * @en
   * The component of model.
   * When you place particles or models in the UI, you must add this component to render.
   * The component must be placed on a node with the [[MeshRenderer]] or the [[Particle]].
   *
   * @zh
   * UI 模型基础组件。
   * 当你在 UI 中放置模型或者粒子的时候，必须添加该组件才能渲染。该组件必须放置在带有 [[MeshRenderer]] 或者 [[Particle]] 组件的节点上。
   */
  var UIMeshRenderer = (_dec = (0, _index.ccclass)('cc.UIMeshRenderer'), _dec2 = (0, _index.help)('i18n:cc.UIMeshRenderer'), _dec3 = (0, _index.executionOrder)(110), _dec4 = (0, _index.menu)('UI/UIMeshRenderer'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_temp = /*#__PURE__*/function (_UIComponent) {
    _inherits(UIMeshRenderer, _UIComponent);

    function UIMeshRenderer() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIMeshRenderer);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIMeshRenderer)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._models = null;
      _this._modelComponent = null;
      return _this;
    }

    _createClass(UIMeshRenderer, [{
      key: "onLoad",
      value: function onLoad() {
        if (!this.node._uiProps.uiTransformComp) {
          this.node.addComponent('cc.UITransform');
        }

        this._modelComponent = this.getComponent('cc.RenderableComponent');

        if (!this._modelComponent) {
          console.warn("node '".concat(this.node && this.node.name, "' doesn't have any renderable component"));
          return;
        }

        this._modelComponent._sceneGetter = _director.director.root.ui.getRenderSceneGetter();
        this._models = this._modelComponent._collectModels();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(UIMeshRenderer.prototype), "onEnable", this).call(this);

        if (this._modelComponent) {
          this._modelComponent._attachToScene();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _get(_getPrototypeOf(UIMeshRenderer.prototype), "onDisable", this).call(this);

        if (this._modelComponent) {
          this._modelComponent._detachFromScene();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(UIMeshRenderer.prototype), "onDestroy", this).call(this);

        this._modelComponent = this.getComponent('cc.RenderableComponent');

        if (!this._modelComponent) {
          return;
        }

        this._modelComponent._sceneGetter = null;

        if (_globalExports.legacyCC.isValid(this._modelComponent, true)) {
          this._modelComponent._attachToScene();
        }

        this._models = null;
      }
    }, {
      key: "updateAssembler",
      value: function updateAssembler(render) {
        if (this._models) {
          var _iterator = _createForOfIteratorHelper(this._models),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var m = _step.value;
              render.commitModel.call(render, this, m, this._modelComponent.material);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return true;
        }

        return false;
      }
    }, {
      key: "update",
      value: function update() {
        this._fitUIRenderQueue();
      }
    }, {
      key: "_fitUIRenderQueue",
      value: function _fitUIRenderQueue() {
        if (!this._modelComponent) {
          return;
        }

        var matNum = this._modelComponent.sharedMaterials.length;

        for (var i = 0; i < matNum; i++) {
          var material = this._modelComponent.getMaterialInstance(i);

          if (material == null) {
            continue;
          }

          var passes = material.passes;
          var passNum = passes.length;

          for (var j = 0; j < passNum; j++) {
            var pass = passes[j]; // @ts-ignore

            pass._priority = _define.RenderPriority.MAX - 11;

            if (!pass.blendState.targets[0].blend) {
              material.overridePipelineStates({
                blendState: {
                  targets: [{
                    blend: true
                  }]
                }
              }, j);
            }
          }
        }
      }
    }, {
      key: "modelComponent",
      get: function get() {
        return this._modelComponent;
      }
    }]);

    return UIMeshRenderer;
  }(_uiComponent.UIComponent), _temp)) || _class) || _class) || _class) || _class);
  _exports.UIMeshRenderer = UIMeshRenderer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdWktbWVzaC1yZW5kZXJlci50cyJdLCJuYW1lcyI6WyJVSU1lc2hSZW5kZXJlciIsIl9tb2RlbHMiLCJfbW9kZWxDb21wb25lbnQiLCJub2RlIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJhZGRDb21wb25lbnQiLCJnZXRDb21wb25lbnQiLCJjb25zb2xlIiwid2FybiIsIm5hbWUiLCJfc2NlbmVHZXR0ZXIiLCJkaXJlY3RvciIsInJvb3QiLCJ1aSIsImdldFJlbmRlclNjZW5lR2V0dGVyIiwiX2NvbGxlY3RNb2RlbHMiLCJfYXR0YWNoVG9TY2VuZSIsIl9kZXRhY2hGcm9tU2NlbmUiLCJsZWdhY3lDQyIsImlzVmFsaWQiLCJyZW5kZXIiLCJtIiwiY29tbWl0TW9kZWwiLCJjYWxsIiwibWF0ZXJpYWwiLCJfZml0VUlSZW5kZXJRdWV1ZSIsIm1hdE51bSIsInNoYXJlZE1hdGVyaWFscyIsImxlbmd0aCIsImkiLCJnZXRNYXRlcmlhbEluc3RhbmNlIiwicGFzc2VzIiwicGFzc051bSIsImoiLCJwYXNzIiwiX3ByaW9yaXR5IiwiUmVuZGVyUHJpb3JpdHkiLCJNQVgiLCJibGVuZFN0YXRlIiwidGFyZ2V0cyIsImJsZW5kIiwib3ZlcnJpZGVQaXBlbGluZVN0YXRlcyIsIlVJQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVDQTs7Ozs7Ozs7OztNQWNhQSxjLFdBSlosb0JBQVEsbUJBQVIsQyxVQUNBLGlCQUFLLHdCQUFMLEMsVUFDQSwyQkFBZSxHQUFmLEMsVUFDQSxpQkFBSyxtQkFBTCxDOzs7Ozs7Ozs7Ozs7Ozs7WUFHV0MsTyxHQUFnQyxJO1lBTWhDQyxlLEdBQThDLEk7Ozs7OzsrQkFFckM7QUFDYixZQUFHLENBQUMsS0FBS0MsSUFBTCxDQUFVQyxRQUFWLENBQW1CQyxl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QUFoQyxFQUF1QztBQUNuQ2hCLGNBQUFBLFFBQVEsQ0FBQ2lCLHNCQUFULENBQWdDO0FBQUVILGdCQUFBQSxVQUFVLEVBQUU7QUFBRUMsa0JBQUFBLE9BQU8sRUFBRSxDQUFFO0FBQUVDLG9CQUFBQSxLQUFLLEVBQUU7QUFBVCxtQkFBRjtBQUFYO0FBQWQsZUFBaEMsRUFBa0ZQLENBQWxGO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7OzswQkFyRjRCO0FBQ3pCLGVBQU8sS0FBS2hDLGVBQVo7QUFDSDs7OztJQU4rQnlDLHdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSB1aVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFJlbmRlcmFibGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlLzNkL2ZyYW1ld29yay9yZW5kZXJhYmxlLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFVJQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL3VpLWJhc2UvdWktY29tcG9uZW50JztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBkaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBSZW5kZXJQcmlvcml0eSB9IGZyb20gJy4uLy4uL2NvcmUvcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIGNvbXBvbmVudCBvZiBtb2RlbC5cclxuICogV2hlbiB5b3UgcGxhY2UgcGFydGljbGVzIG9yIG1vZGVscyBpbiB0aGUgVUksIHlvdSBtdXN0IGFkZCB0aGlzIGNvbXBvbmVudCB0byByZW5kZXIuXHJcbiAqIFRoZSBjb21wb25lbnQgbXVzdCBiZSBwbGFjZWQgb24gYSBub2RlIHdpdGggdGhlIFtbTWVzaFJlbmRlcmVyXV0gb3IgdGhlIFtbUGFydGljbGVdXS5cclxuICpcclxuICogQHpoXHJcbiAqIFVJIOaooeWei+WfuuehgOe7hOS7tuOAglxyXG4gKiDlvZPkvaDlnKggVUkg5Lit5pS+572u5qih5Z6L5oiW6ICF57KS5a2Q55qE5pe25YCZ77yM5b+F6aG75re75Yqg6K+l57uE5Lu25omN6IO95riy5p+T44CC6K+l57uE5Lu25b+F6aG75pS+572u5Zyo5bim5pyJIFtbTWVzaFJlbmRlcmVyXV0g5oiW6ICFIFtbUGFydGljbGVdXSDnu4Tku7bnmoToioLngrnkuIrjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5VSU1lc2hSZW5kZXJlcicpXHJcbkBoZWxwKCdpMThuOmNjLlVJTWVzaFJlbmRlcmVyJylcclxuQGV4ZWN1dGlvbk9yZGVyKDExMClcclxuQG1lbnUoJ1VJL1VJTWVzaFJlbmRlcmVyJylcclxuZXhwb3J0IGNsYXNzIFVJTWVzaFJlbmRlcmVyIGV4dGVuZHMgVUlDb21wb25lbnQge1xyXG5cclxuICAgIHByaXZhdGUgX21vZGVsczogc2NlbmUuTW9kZWxbXSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBnZXQgbW9kZWxDb21wb25lbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbENvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9tb2RlbENvbXBvbmVudDogUmVuZGVyYWJsZUNvbXBvbmVudCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQgKCkge1xyXG4gICAgICAgIGlmKCF0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wKXtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmFkZENvbXBvbmVudCgnY2MuVUlUcmFuc2Zvcm0nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21vZGVsQ29tcG9uZW50ID0gdGhpcy5nZXRDb21wb25lbnQoJ2NjLlJlbmRlcmFibGVDb21wb25lbnQnKSBhcyBSZW5kZXJhYmxlQ29tcG9uZW50O1xyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWxDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBub2RlICcke3RoaXMubm9kZSAmJiB0aGlzLm5vZGUubmFtZX0nIGRvZXNuJ3QgaGF2ZSBhbnkgcmVuZGVyYWJsZSBjb21wb25lbnRgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbW9kZWxDb21wb25lbnQuX3NjZW5lR2V0dGVyID0gZGlyZWN0b3Iucm9vdCEudWkuZ2V0UmVuZGVyU2NlbmVHZXR0ZXIoKTtcclxuICAgICAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbENvbXBvbmVudC5fY29sbGVjdE1vZGVscygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25FbmFibGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWxDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgKHRoaXMuX21vZGVsQ29tcG9uZW50IGFzIGFueSkuX2F0dGFjaFRvU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25EaXNhYmxlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICh0aGlzLl9tb2RlbENvbXBvbmVudCBhcyBhbnkpLl9kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25EZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxDb21wb25lbnQgPSB0aGlzLmdldENvbXBvbmVudCgnY2MuUmVuZGVyYWJsZUNvbXBvbmVudCcpIGFzIFJlbmRlcmFibGVDb21wb25lbnQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbENvbXBvbmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbENvbXBvbmVudC5fc2NlbmVHZXR0ZXIgPSBudWxsO1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5pc1ZhbGlkKHRoaXMuX21vZGVsQ29tcG9uZW50LCB0cnVlKSkge1xyXG4gICAgICAgICAgICAodGhpcy5fbW9kZWxDb21wb25lbnQgYXMgYW55KS5fYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tb2RlbHMgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBc3NlbWJsZXIgKHJlbmRlcjogVUkpIHtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWxzKSB7XHJcbiAgICAgICAgICAgIGZvcihjb25zdCBtIG9mIHRoaXMuX21vZGVscyl7XHJcbiAgICAgICAgICAgICAgICByZW5kZXIuY29tbWl0TW9kZWwuY2FsbChyZW5kZXIsIHRoaXMsIG0sIHRoaXMuX21vZGVsQ29tcG9uZW50IS5tYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fZml0VUlSZW5kZXJRdWV1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZpdFVJUmVuZGVyUXVldWUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWxDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtYXROdW0gPSB0aGlzLl9tb2RlbENvbXBvbmVudC5zaGFyZWRNYXRlcmlhbHMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0TnVtOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSB0aGlzLl9tb2RlbENvbXBvbmVudC5nZXRNYXRlcmlhbEluc3RhbmNlKGkpO1xyXG4gICAgICAgICAgICBpZiAobWF0ZXJpYWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcGFzc2VzID0gbWF0ZXJpYWwucGFzc2VzO1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzTnVtID0gcGFzc2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwYXNzTnVtOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3MgPSBwYXNzZXNbal07XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBwYXNzLl9wcmlvcml0eSA9IFJlbmRlclByaW9yaXR5Lk1BWCAtIDExO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwYXNzLmJsZW5kU3RhdGUudGFyZ2V0c1swXS5ibGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLm92ZXJyaWRlUGlwZWxpbmVTdGF0ZXMoeyBibGVuZFN0YXRlOiB7IHRhcmdldHM6IFsgeyBibGVuZDogdHJ1ZSB9IF0gfSB9LCBqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=