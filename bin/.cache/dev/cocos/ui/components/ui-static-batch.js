(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/ui-base/ui-renderable.js", "../../core/renderer/ui/mesh-buffer.js", "../../core/data/decorators/index.js", "../../core/renderer/ui/ui-draw-batch.js", "../../core/index.js", "../../core/renderer/ui/ui-vertex-format.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/ui-base/ui-renderable.js"), require("../../core/renderer/ui/mesh-buffer.js"), require("../../core/data/decorators/index.js"), require("../../core/renderer/ui/ui-draw-batch.js"), require("../../core/index.js"), require("../../core/renderer/ui/ui-vertex-format.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.uiRenderable, global.meshBuffer, global.index, global.uiDrawBatch, global.index, global.uiVertexFormat);
    global.uiStaticBatch = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _uiRenderable, _meshBuffer, _index, _uiDrawBatch, _index2, _uiVertexFormat) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UIStaticBatch = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

  function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Static batch component of UI.
   * This component is placed on the root node of all node objects that need to be batch.
   * Only sprites and label participate in the batch.
   * Static batch must be enabled manually, otherwise dynamic batch is still used.
   * Note: Do not place mask, Graphics, and objects such as UI models or particles under child nodes,
   * otherwise rendering will be skipped after static batching is enabled.
   *
   * @zh
   * UI 静态合批组件。
   * 该组件放在所有需要被静态合批的节点对象的根节点上，子节点放置对象必须是精灵和文本，其余对象不参与静态合批。
   * 用户必须通过手动方式启用收集静态合批数据[[markAsDirty]]，否则合批方式仍然采用动态合批（采集数据的流程相同）。此后渲染的内容是采用收集到的合批渲染数据，子节点的任何修改将不再有效。
   * 注意：子节点下不要放置 Mask，Graphics，以及 UI 模型或者粒子之类对象，否则会在启用完静态合批后跳过渲染。
   */
  var UIStaticBatch = (_dec = (0, _index.ccclass)('cc.UIStaticBatch'), _dec2 = (0, _index.help)('i18n:cc.UIStaticBatch'), _dec3 = (0, _index.menu)('UI/Render/UIStaticBatch'), _dec4 = (0, _index.executionOrder)(110), _dec5 = (0, _index.visible)(false), _dec6 = (0, _index.visible)(false), _dec7 = (0, _index.visible)(false), _dec8 = (0, _index.type)(_index2.Material), _dec9 = (0, _index.displayName)('Materials'), _dec10 = (0, _index.visible)(false), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = /*#__PURE__*/function (_UIRenderable) {
    _inherits(UIStaticBatch, _UIRenderable);

    function UIStaticBatch() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, UIStaticBatch);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIStaticBatch)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._init = false;
      _this._meshBuffer = null;
      _this._dirty = true;
      _this._lastMeshBuffer = null;
      _this._uiDrawBatchList = [];
      return _this;
    }

    _createClass(UIStaticBatch, [{
      key: "onLoad",
      value: function onLoad() {
        var ui = this._getUI();

        if (!ui) {
          return;
        }

        var attr = _uiVertexFormat.vfmtPosUvColor;
        var buffer = new _meshBuffer.MeshBuffer(ui);
        buffer.initialize(attr, this._arrivalMaxBuffer);
        this._meshBuffer = buffer;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(UIStaticBatch.prototype), "onDestroy", this).call(this);

        this._clearData();

        if (this._meshBuffer) {
          this._meshBuffer.destroy();

          this._meshBuffer = null;
        }
      }
    }, {
      key: "updateAssembler",
      value: function updateAssembler(render) {
        if (this._dirty) {
          render.finishMergeBatches();
          this._lastMeshBuffer = render.currBufferBatch;
          render.currBufferBatch = this._meshBuffer;
          render.currStaticRoot = this;
        }

        if (this._init) {
          render.finishMergeBatches();
          render.commitStaticBatch(this);
        }
      }
    }, {
      key: "postUpdateAssembler",
      value: function postUpdateAssembler(render) {
        if (this._dirty) {
          render.finishMergeBatches();
          render.currBufferBatch = this._lastMeshBuffer;
          render.currStaticRoot = null;
          this._dirty = false;
          this._init = true;
          this.node._static = true;

          this._meshBuffer.uploadData();
        }
      }
      /**
       * @en
       * Recollect data tags.
       * The render data will be recollected during the render phase of the current frame, and the next frame will be rendered using fixed data.
       * Note: 尽量不要频繁调用此接口, 会有一定内存损耗.
       *
       * @zh
       * 重新采集数据标记，会在当前帧的渲染阶段重新采集渲染数据，下一帧开始将会使用固定数据进行渲染。
       * 注意：尽量不要频繁调用此接口，因为会清空原先存储的 ia 数据重新采集，会有一定内存损耗。
       */

    }, {
      key: "markAsDirty",
      value: function markAsDirty() {
        if (!this._getUI()) {
          return;
        }

        this.node._static = false;
        this._dirty = true;
        this._init = false;

        this._clearData();
      }
    }, {
      key: "_requireDrawBatch",
      value: function _requireDrawBatch() {
        var batch = new _uiDrawBatch.UIDrawBatch();
        batch.isStatic = true;

        this._uiDrawBatchList.push(batch);

        return batch;
      }
    }, {
      key: "_clearData",
      value: function _clearData() {
        if (this._meshBuffer) {
          this._meshBuffer.reset();

          var ui = this._getUI();

          for (var i = 0; i < this._uiDrawBatchList.length; i++) {
            var element = this._uiDrawBatchList[i];
            element.destroy(ui);
          }
        }

        this._uiDrawBatchList.length = 0;
        this._init = false;
      }
    }, {
      key: "_getUI",
      value: function _getUI() {
        if (_index2.director.root && _index2.director.root.ui) {
          return _index2.director.root.ui;
        }

        (0, _index2.warnID)(9301);
        return null;
      }
    }, {
      key: "_arrivalMaxBuffer",
      value: function _arrivalMaxBuffer() {
        (0, _index2.warnID)(9300);
      }
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
    }, {
      key: "srcBlendFactor",
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
      }
    }, {
      key: "sharedMaterials",
      get: function get() {
        return _get(_getPrototypeOf(UIStaticBatch.prototype), "sharedMaterials", this);
      },
      set: function set(val) {
        _set(_getPrototypeOf(UIStaticBatch.prototype), "sharedMaterials", val, this, true);
      }
    }, {
      key: "drawBatchList",
      get: function get() {
        return this._uiDrawBatchList;
      }
    }]);

    return UIStaticBatch;
  }(_uiRenderable.UIRenderable), _temp), (_applyDecoratedDescriptor(_class2.prototype, "dstBlendFactor", [_index.override, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "dstBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "srcBlendFactor", [_index.override, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "srcBlendFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "color", [_index.override, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "color"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterials", [_index.override, _dec8, _dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterials"), _class2.prototype)), _class2)) || _class) || _class) || _class) || _class);
  _exports.UIStaticBatch = UIStaticBatch;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvdWktc3RhdGljLWJhdGNoLnRzIl0sIm5hbWVzIjpbIlVJU3RhdGljQmF0Y2giLCJNYXRlcmlhbCIsIl9pbml0IiwiX21lc2hCdWZmZXIiLCJfZGlydHkiLCJfbGFzdE1lc2hCdWZmZXIiLCJfdWlEcmF3QmF0Y2hMaXN0IiwidWkiLCJfZ2V0VUkiLCJhdHRyIiwidmZtdFBvc1V2Q29sb3IiLCJidWZmZXIiLCJNZXNoQnVmZmVyIiwiaW5pdGlhbGl6ZSIsIl9hcnJpdmFsTWF4QnVmZmVyIiwiX2NsZWFyRGF0YSIsImRlc3Ryb3kiLCJyZW5kZXIiLCJmaW5pc2hNZXJnZUJhdGNoZXMiLCJjdXJyQnVmZmVyQmF0Y2giLCJjdXJyU3RhdGljUm9vdCIsImNvbW1pdFN0YXRpY0JhdGNoIiwibm9kZSIsIl9zdGF0aWMiLCJ1cGxvYWREYXRhIiwiYmF0Y2giLCJVSURyYXdCYXRjaCIsImlzU3RhdGljIiwicHVzaCIsInJlc2V0IiwiaSIsImxlbmd0aCIsImVsZW1lbnQiLCJkaXJlY3RvciIsInJvb3QiLCJfZHN0QmxlbmRGYWN0b3IiLCJ2YWx1ZSIsIl91cGRhdGVCbGVuZEZ1bmMiLCJfc3JjQmxlbmRGYWN0b3IiLCJfY29sb3IiLCJzZXQiLCJfdXBkYXRlQ29sb3IiLCJtYXJrRm9yVXBkYXRlUmVuZGVyRGF0YSIsInZhbCIsIlVJUmVuZGVyYWJsZSIsIm92ZXJyaWRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNBOzs7Ozs7Ozs7Ozs7Ozs7TUFtQmFBLGEsV0FKWixvQkFBUSxrQkFBUixDLFVBQ0EsaUJBQUssdUJBQUwsQyxVQUNBLGlCQUFLLHlCQUFMLEMsVUFDQSwyQkFBZSxHQUFmLEMsVUFHSSxvQkFBUSxLQUFSLEMsVUFlQSxvQkFBUSxLQUFSLEMsVUFlQSxvQkFBUSxLQUFSLEMsVUFnQkEsaUJB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SkFlQUEsZSw0SkFnQkFBLGUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZS91aS1yZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgVUkgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpJztcclxuaW1wb3J0IHsgTWVzaEJ1ZmZlciB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvdWkvbWVzaC1idWZmZXInO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBoZWxwLCBtZW51LCBleGVjdXRpb25PcmRlciwgdmlzaWJsZSwgdHlwZSwgZGlzcGxheU5hbWUsIG92ZXJyaWRlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgVUlEcmF3QmF0Y2ggfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpLWRyYXctYmF0Y2gnO1xyXG5pbXBvcnQgeyBkaXJlY3RvciwgQ29sb3IsIE1hdGVyaWFsLCB3YXJuSUQgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgdmZtdFBvc1V2Q29sb3IgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL3VpL3VpLXZlcnRleC1mb3JtYXQnO1xyXG5pbXBvcnQgeyBHRlhCbGVuZEZhY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZ2Z4JztcclxuXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFN0YXRpYyBiYXRjaCBjb21wb25lbnQgb2YgVUkuXHJcbiAqIFRoaXMgY29tcG9uZW50IGlzIHBsYWNlZCBvbiB0aGUgcm9vdCBub2RlIG9mIGFsbCBub2RlIG9iamVjdHMgdGhhdCBuZWVkIHRvIGJlIGJhdGNoLlxyXG4gKiBPbmx5IHNwcml0ZXMgYW5kIGxhYmVsIHBhcnRpY2lwYXRlIGluIHRoZSBiYXRjaC5cclxuICogU3RhdGljIGJhdGNoIG11c3QgYmUgZW5hYmxlZCBtYW51YWxseSwgb3RoZXJ3aXNlIGR5bmFtaWMgYmF0Y2ggaXMgc3RpbGwgdXNlZC5cclxuICogTm90ZTogRG8gbm90IHBsYWNlIG1hc2ssIEdyYXBoaWNzLCBhbmQgb2JqZWN0cyBzdWNoIGFzIFVJIG1vZGVscyBvciBwYXJ0aWNsZXMgdW5kZXIgY2hpbGQgbm9kZXMsXHJcbiAqIG90aGVyd2lzZSByZW5kZXJpbmcgd2lsbCBiZSBza2lwcGVkIGFmdGVyIHN0YXRpYyBiYXRjaGluZyBpcyBlbmFibGVkLlxyXG4gKlxyXG4gKiBAemhcclxuICogVUkg6Z2Z5oCB5ZCI5om557uE5Lu244CCXHJcbiAqIOivpee7hOS7tuaUvuWcqOaJgOaciemcgOimgeiiq+mdmeaAgeWQiOaJueeahOiKgueCueWvueixoeeahOagueiKgueCueS4iu+8jOWtkOiKgueCueaUvue9ruWvueixoeW/hemhu+aYr+eyvueBteWSjOaWh+acrO+8jOWFtuS9meWvueixoeS4jeWPguS4jumdmeaAgeWQiOaJueOAglxyXG4gKiDnlKjmiLflv4XpobvpgJrov4fmiYvliqjmlrnlvI/lkK/nlKjmlLbpm4bpnZnmgIHlkIjmibnmlbDmja5bW21hcmtBc0RpcnR5XV3vvIzlkKbliJnlkIjmibnmlrnlvI/ku43nhLbph4fnlKjliqjmgIHlkIjmibnvvIjph4fpm4bmlbDmja7nmoTmtYHnqIvnm7jlkIzvvInjgILmraTlkI7muLLmn5PnmoTlhoXlrrnmmK/ph4fnlKjmlLbpm4bliLDnmoTlkIjmibnmuLLmn5PmlbDmja7vvIzlrZDoioLngrnnmoTku7vkvZXkv67mlLnlsIbkuI3lho3mnInmlYjjgIJcclxuICog5rOo5oSP77ya5a2Q6IqC54K55LiL5LiN6KaB5pS+572uIE1hc2vvvIxHcmFwaGljc++8jOS7peWPiiBVSSDmqKHlnovmiJbogIXnspLlrZDkuYvnsbvlr7nosaHvvIzlkKbliJnkvJrlnKjlkK/nlKjlrozpnZnmgIHlkIjmibnlkI7ot7Pov4fmuLLmn5PjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5VSVN0YXRpY0JhdGNoJylcclxuQGhlbHAoJ2kxOG46Y2MuVUlTdGF0aWNCYXRjaCcpXHJcbkBtZW51KCdVSS9SZW5kZXIvVUlTdGF0aWNCYXRjaCcpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbmV4cG9ydCBjbGFzcyBVSVN0YXRpY0JhdGNoIGV4dGVuZHMgVUlSZW5kZXJhYmxlIHtcclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBnZXQgZHN0QmxlbmRGYWN0b3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kc3RCbGVuZEZhY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZHN0QmxlbmRGYWN0b3IgKHZhbHVlOiBHRlhCbGVuZEZhY3Rvcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kc3RCbGVuZEZhY3RvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZHN0QmxlbmRGYWN0b3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl91cGRhdGVCbGVuZEZ1bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEB2aXNpYmxlKGZhbHNlKVxyXG4gICAgZ2V0IHNyY0JsZW5kRmFjdG9yICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3JjQmxlbmRGYWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNyY0JsZW5kRmFjdG9yICh2YWx1ZTogR0ZYQmxlbmRGYWN0b3IpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3JjQmxlbmRGYWN0b3IgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NyY0JsZW5kRmFjdG9yID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgQG92ZXJyaWRlXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIGdldCBjb2xvciAoKTogUmVhZG9ubHk8Q29sb3I+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbG9yICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2xvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3Iuc2V0KHZhbHVlKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVDb2xvcigpO1xyXG4gICAgICAgIHRoaXMubWFya0ZvclVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEB0eXBlKE1hdGVyaWFsKVxyXG4gICAgQGRpc3BsYXlOYW1lKCdNYXRlcmlhbHMnKVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBnZXQgc2hhcmVkTWF0ZXJpYWxzICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuc2hhcmVkTWF0ZXJpYWxzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzaGFyZWRNYXRlcmlhbHMgKHZhbCkge1xyXG4gICAgICAgIHN1cGVyLnNoYXJlZE1hdGVyaWFscyA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZHJhd0JhdGNoTGlzdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VpRHJhd0JhdGNoTGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2luaXQgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfbWVzaEJ1ZmZlcjogTWVzaEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9kaXJ0eSA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9sYXN0TWVzaEJ1ZmZlcjogTWVzaEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdWlEcmF3QmF0Y2hMaXN0OiBVSURyYXdCYXRjaFtdID0gW107XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgY29uc3QgdWkgPSB0aGlzLl9nZXRVSSgpO1xyXG4gICAgICAgIGlmICghdWkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXR0ciA9IHZmbXRQb3NVdkNvbG9yO1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBNZXNoQnVmZmVyKHVpKTtcclxuICAgICAgICBidWZmZXIuaW5pdGlhbGl6ZShhdHRyLCB0aGlzLl9hcnJpdmFsTWF4QnVmZmVyKTtcclxuICAgICAgICB0aGlzLl9tZXNoQnVmZmVyID0gYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG5cclxuICAgICAgICB0aGlzLl9jbGVhckRhdGEoKTtcclxuICAgICAgICBpZih0aGlzLl9tZXNoQnVmZmVyKXtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc2hCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUFzc2VtYmxlciAocmVuZGVyOiBVSSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJ0eSkge1xyXG4gICAgICAgICAgICByZW5kZXIuZmluaXNoTWVyZ2VCYXRjaGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RNZXNoQnVmZmVyID0gcmVuZGVyLmN1cnJCdWZmZXJCYXRjaDtcclxuICAgICAgICAgICAgcmVuZGVyLmN1cnJCdWZmZXJCYXRjaCA9IHRoaXMuX21lc2hCdWZmZXI7XHJcbiAgICAgICAgICAgIHJlbmRlci5jdXJyU3RhdGljUm9vdCA9IHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5pdCkge1xyXG4gICAgICAgICAgICByZW5kZXIuZmluaXNoTWVyZ2VCYXRjaGVzKCk7XHJcbiAgICAgICAgICAgIHJlbmRlci5jb21taXRTdGF0aWNCYXRjaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHBvc3RVcGRhdGVBc3NlbWJsZXIgKHJlbmRlcjogVUkpIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlydHkpIHtcclxuICAgICAgICAgICAgcmVuZGVyLmZpbmlzaE1lcmdlQmF0Y2hlcygpO1xyXG4gICAgICAgICAgICByZW5kZXIuY3VyckJ1ZmZlckJhdGNoID0gdGhpcy5fbGFzdE1lc2hCdWZmZXI7XHJcbiAgICAgICAgICAgIHJlbmRlci5jdXJyU3RhdGljUm9vdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuX3N0YXRpYyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tZXNoQnVmZmVyIS51cGxvYWREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZWNvbGxlY3QgZGF0YSB0YWdzLlxyXG4gICAgICogVGhlIHJlbmRlciBkYXRhIHdpbGwgYmUgcmVjb2xsZWN0ZWQgZHVyaW5nIHRoZSByZW5kZXIgcGhhc2Ugb2YgdGhlIGN1cnJlbnQgZnJhbWUsIGFuZCB0aGUgbmV4dCBmcmFtZSB3aWxsIGJlIHJlbmRlcmVkIHVzaW5nIGZpeGVkIGRhdGEuXHJcbiAgICAgKiBOb3RlOiDlsL3ph4/kuI3opoHpopHnuYHosIPnlKjmraTmjqXlj6MsIOS8muacieS4gOWumuWGheWtmOaNn+iAly5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmHjeaWsOmHh+mbhuaVsOaNruagh+iusO+8jOS8muWcqOW9k+WJjeW4p+eahOa4suafk+mYtuautemHjeaWsOmHh+mbhua4suafk+aVsOaNru+8jOS4i+S4gOW4p+W8gOWni+WwhuS8muS9v+eUqOWbuuWumuaVsOaNrui/m+ihjOa4suafk+OAglxyXG4gICAgICog5rOo5oSP77ya5bC96YeP5LiN6KaB6aKR57mB6LCD55So5q2k5o6l5Y+j77yM5Zug5Li65Lya5riF56m65Y6f5YWI5a2Y5YKo55qEIGlhIOaVsOaNrumHjeaWsOmHh+mbhu+8jOS8muacieS4gOWumuWGheWtmOaNn+iAl+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbWFya0FzRGlydHkgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZ2V0VUkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vZGUuX3N0YXRpYyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9pbml0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuX2NsZWFyRGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfcmVxdWlyZURyYXdCYXRjaCAoKSB7XHJcbiAgICAgICAgY29uc3QgYmF0Y2ggPSBuZXcgVUlEcmF3QmF0Y2goKTtcclxuICAgICAgICBiYXRjaC5pc1N0YXRpYyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fdWlEcmF3QmF0Y2hMaXN0LnB1c2goYmF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBiYXRjaDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NsZWFyRGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21lc2hCdWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWVzaEJ1ZmZlciEucmVzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVpID0gdGhpcy5fZ2V0VUkoKSE7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdWlEcmF3QmF0Y2hMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fdWlEcmF3QmF0Y2hMaXN0W2ldO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5kZXN0cm95KHVpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdWlEcmF3QmF0Y2hMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5faW5pdCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0VUkgKCl7XHJcbiAgICAgICAgaWYoZGlyZWN0b3Iucm9vdCAmJiBkaXJlY3Rvci5yb290LnVpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkaXJlY3Rvci5yb290LnVpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2FybklEKDkzMDEpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXJyaXZhbE1heEJ1ZmZlciAoKXtcclxuICAgICAgICB3YXJuSUQoOTMwMCk7XHJcbiAgICB9XHJcbn1cclxuIl19