(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/utils/attribute.js", "../data/decorators/index.js", "../gfx/define.js", "../value-types/enum.js", "../assets/render-texture.js", "../assets/material.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/utils/attribute.js"), require("../data/decorators/index.js"), require("../gfx/define.js"), require("../value-types/enum.js"), require("../assets/render-texture.js"), require("../assets/material.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.attribute, global.index, global.define, global._enum, global.renderTexture, global.material);
    global.pipelineSerialization = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _attribute, _index, _define, _enum, _renderTexture, _material) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderQueueDesc = _exports.RenderQueueSortMode = _exports.RenderPassDesc = _exports.DepthStencilDesc = _exports.ColorDesc = _exports.FrameBufferDesc = _exports.MaterialConfig = _exports.RenderTextureConfig = _exports.RenderTextureDesc = _exports.RenderFlowTag = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _dec5, _dec6, _class4, _class5, _descriptor7, _descriptor8, _temp2, _dec7, _dec8, _class7, _class8, _descriptor9, _descriptor10, _temp3, _dec9, _dec10, _dec11, _class10, _class11, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _temp4, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class13, _class14, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _temp5, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class16, _class17, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _temp6, _dec26, _dec27, _dec28, _class19, _class20, _descriptor30, _descriptor31, _descriptor32, _temp7, _dec29, _dec30, _dec31, _class22, _class23, _descriptor33, _descriptor34, _descriptor35, _temp8;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  (0, _enum.ccenum)(_define.GFXTextureType);
  (0, _enum.ccenum)(_define.GFXTextureUsageBit);
  (0, _enum.ccenum)(_define.GFXStoreOp);
  (0, _enum.ccenum)(_define.GFXLoadOp);
  (0, _enum.ccenum)(_define.GFXTextureLayout);
  /**
   * @en The tag of the render flow, including SCENE, POSTPROCESS and UI.
   * @zh 渲染流程的标签，包含：常规场景（SCENE），后处理（POSTPROCESS），UI 界面（UI）
   */

  var RenderFlowTag;
  _exports.RenderFlowTag = RenderFlowTag;

  (function (RenderFlowTag) {
    RenderFlowTag[RenderFlowTag["SCENE"] = 0] = "SCENE";
    RenderFlowTag[RenderFlowTag["POSTPROCESS"] = 1] = "POSTPROCESS";
    RenderFlowTag[RenderFlowTag["UI"] = 2] = "UI";
  })(RenderFlowTag || (_exports.RenderFlowTag = RenderFlowTag = {}));

  (0, _enum.ccenum)(RenderFlowTag);
  var RenderTextureDesc = (_dec = (0, _index.ccclass)('RenderTextureDesc'), _dec2 = (0, _index.type)(_define.GFXTextureType), _dec3 = (0, _index.type)(_define.GFXTextureUsageBit), _dec4 = (0, _index.type)(_define.GFXFormat), _dec(_class = (_class2 = (_temp = function RenderTextureDesc() {
    _classCallCheck(this, RenderTextureDesc);

    _initializerDefineProperty(this, "name", _descriptor, this);

    _initializerDefineProperty(this, "type", _descriptor2, this);

    _initializerDefineProperty(this, "usage", _descriptor3, this);

    _initializerDefineProperty(this, "format", _descriptor4, this);

    _initializerDefineProperty(this, "width", _descriptor5, this);

    _initializerDefineProperty(this, "height", _descriptor6, this);
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureType.TEX2D;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "usage", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureUsageBit.COLOR_ATTACHMENT;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "format", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXFormat.UNKNOWN;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "width", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return -1;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "height", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return -1;
    }
  })), _class2)) || _class);
  _exports.RenderTextureDesc = RenderTextureDesc;
  var RenderTextureConfig = (_dec5 = (0, _index.ccclass)('RenderTextureConfig'), _dec6 = (0, _index.type)(_renderTexture.RenderTexture), _dec5(_class4 = (_class5 = (_temp2 = function RenderTextureConfig() {
    _classCallCheck(this, RenderTextureConfig);

    _initializerDefineProperty(this, "name", _descriptor7, this);

    _initializerDefineProperty(this, "texture", _descriptor8, this);
  }, _temp2), (_descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "name", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "texture", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class5)) || _class4);
  _exports.RenderTextureConfig = RenderTextureConfig;
  var MaterialConfig = (_dec7 = (0, _index.ccclass)('MaterialConfig'), _dec8 = (0, _index.type)(_material.Material), _dec7(_class7 = (_class8 = (_temp3 = function MaterialConfig() {
    _classCallCheck(this, MaterialConfig);

    _initializerDefineProperty(this, "name", _descriptor9, this);

    _initializerDefineProperty(this, "material", _descriptor10, this);
  }, _temp3), (_descriptor9 = _applyDecoratedDescriptor(_class8.prototype, "name", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class8.prototype, "material", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class8)) || _class7);
  _exports.MaterialConfig = MaterialConfig;
  var FrameBufferDesc = (_dec9 = (0, _index.ccclass)('FrameBufferDesc'), _dec10 = (0, _index.type)([_attribute.CCString]), _dec11 = (0, _index.type)(_renderTexture.RenderTexture), _dec9(_class10 = (_class11 = (_temp4 = function FrameBufferDesc() {
    _classCallCheck(this, FrameBufferDesc);

    _initializerDefineProperty(this, "name", _descriptor11, this);

    _initializerDefineProperty(this, "renderPass", _descriptor12, this);

    _initializerDefineProperty(this, "colorTextures", _descriptor13, this);

    _initializerDefineProperty(this, "depthStencilTexture", _descriptor14, this);

    _initializerDefineProperty(this, "texture", _descriptor15, this);
  }, _temp4), (_descriptor11 = _applyDecoratedDescriptor(_class11.prototype, "name", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class11.prototype, "renderPass", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class11.prototype, "colorTextures", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class11.prototype, "depthStencilTexture", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class11.prototype, "texture", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class11)) || _class10);
  _exports.FrameBufferDesc = FrameBufferDesc;
  var ColorDesc = (_dec12 = (0, _index.ccclass)('ColorDesc'), _dec13 = (0, _index.type)(_define.GFXFormat), _dec14 = (0, _index.type)(_define.GFXLoadOp), _dec15 = (0, _index.type)(_define.GFXStoreOp), _dec16 = (0, _index.type)(_define.GFXTextureLayout), _dec17 = (0, _index.type)(_define.GFXTextureLayout), _dec12(_class13 = (_class14 = (_temp5 = function ColorDesc() {
    _classCallCheck(this, ColorDesc);

    _initializerDefineProperty(this, "format", _descriptor16, this);

    _initializerDefineProperty(this, "loadOp", _descriptor17, this);

    _initializerDefineProperty(this, "storeOp", _descriptor18, this);

    _initializerDefineProperty(this, "sampleCount", _descriptor19, this);

    _initializerDefineProperty(this, "beginLayout", _descriptor20, this);

    _initializerDefineProperty(this, "endLayout", _descriptor21, this);
  }, _temp5), (_descriptor16 = _applyDecoratedDescriptor(_class14.prototype, "format", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXFormat.UNKNOWN;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class14.prototype, "loadOp", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXLoadOp.CLEAR;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class14.prototype, "storeOp", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXStoreOp.STORE;
    }
  }), _descriptor19 = _applyDecoratedDescriptor(_class14.prototype, "sampleCount", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor20 = _applyDecoratedDescriptor(_class14.prototype, "beginLayout", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureLayout.UNDEFINED;
    }
  }), _descriptor21 = _applyDecoratedDescriptor(_class14.prototype, "endLayout", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureLayout.PRESENT_SRC;
    }
  })), _class14)) || _class13);
  _exports.ColorDesc = ColorDesc;
  var DepthStencilDesc = (_dec18 = (0, _index.ccclass)('DepthStencilDesc'), _dec19 = (0, _index.type)(_define.GFXFormat), _dec20 = (0, _index.type)(_define.GFXLoadOp), _dec21 = (0, _index.type)(_define.GFXStoreOp), _dec22 = (0, _index.type)(_define.GFXLoadOp), _dec23 = (0, _index.type)(_define.GFXStoreOp), _dec24 = (0, _index.type)(_define.GFXTextureLayout), _dec25 = (0, _index.type)(_define.GFXTextureLayout), _dec18(_class16 = (_class17 = (_temp6 = function DepthStencilDesc() {
    _classCallCheck(this, DepthStencilDesc);

    _initializerDefineProperty(this, "format", _descriptor22, this);

    _initializerDefineProperty(this, "depthLoadOp", _descriptor23, this);

    _initializerDefineProperty(this, "depthStoreOp", _descriptor24, this);

    _initializerDefineProperty(this, "stencilLoadOp", _descriptor25, this);

    _initializerDefineProperty(this, "stencilStoreOp", _descriptor26, this);

    _initializerDefineProperty(this, "sampleCount", _descriptor27, this);

    _initializerDefineProperty(this, "beginLayout", _descriptor28, this);

    _initializerDefineProperty(this, "endLayout", _descriptor29, this);
  }, _temp6), (_descriptor22 = _applyDecoratedDescriptor(_class17.prototype, "format", [_dec19], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXFormat.UNKNOWN;
    }
  }), _descriptor23 = _applyDecoratedDescriptor(_class17.prototype, "depthLoadOp", [_dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXLoadOp.CLEAR;
    }
  }), _descriptor24 = _applyDecoratedDescriptor(_class17.prototype, "depthStoreOp", [_dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXStoreOp.STORE;
    }
  }), _descriptor25 = _applyDecoratedDescriptor(_class17.prototype, "stencilLoadOp", [_dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXLoadOp.CLEAR;
    }
  }), _descriptor26 = _applyDecoratedDescriptor(_class17.prototype, "stencilStoreOp", [_dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXStoreOp.STORE;
    }
  }), _descriptor27 = _applyDecoratedDescriptor(_class17.prototype, "sampleCount", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor28 = _applyDecoratedDescriptor(_class17.prototype, "beginLayout", [_dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureLayout.UNDEFINED;
    }
  }), _descriptor29 = _applyDecoratedDescriptor(_class17.prototype, "endLayout", [_dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _define.GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    }
  })), _class17)) || _class16);
  _exports.DepthStencilDesc = DepthStencilDesc;
  var RenderPassDesc = (_dec26 = (0, _index.ccclass)('RenderPassDesc'), _dec27 = (0, _index.type)([ColorDesc]), _dec28 = (0, _index.type)(DepthStencilDesc), _dec26(_class19 = (_class20 = (_temp7 = function RenderPassDesc() {
    _classCallCheck(this, RenderPassDesc);

    _initializerDefineProperty(this, "index", _descriptor30, this);

    _initializerDefineProperty(this, "colorAttachments", _descriptor31, this);

    _initializerDefineProperty(this, "depthStencilAttachment", _descriptor32, this);
  }, _temp7), (_descriptor30 = _applyDecoratedDescriptor(_class20.prototype, "index", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return -1;
    }
  }), _descriptor31 = _applyDecoratedDescriptor(_class20.prototype, "colorAttachments", [_dec27], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor32 = _applyDecoratedDescriptor(_class20.prototype, "depthStencilAttachment", [_dec28], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new DepthStencilDesc();
    }
  })), _class20)) || _class19);
  _exports.RenderPassDesc = RenderPassDesc;
  var RenderQueueSortMode;
  _exports.RenderQueueSortMode = RenderQueueSortMode;

  (function (RenderQueueSortMode) {
    RenderQueueSortMode[RenderQueueSortMode["FRONT_TO_BACK"] = 0] = "FRONT_TO_BACK";
    RenderQueueSortMode[RenderQueueSortMode["BACK_TO_FRONT"] = 1] = "BACK_TO_FRONT";
  })(RenderQueueSortMode || (_exports.RenderQueueSortMode = RenderQueueSortMode = {}));

  (0, _enum.ccenum)(RenderQueueSortMode);
  /**
   * @en The render queue descriptor
   * @zh 渲染队列描述信息
   */

  var RenderQueueDesc = (_dec29 = (0, _index.ccclass)('RenderQueueDesc'), _dec30 = (0, _index.type)(RenderQueueSortMode), _dec31 = (0, _index.type)([_attribute.CCString]), _dec29(_class22 = (_class23 = (_temp8 = function RenderQueueDesc() {
    _classCallCheck(this, RenderQueueDesc);

    _initializerDefineProperty(this, "isTransparent", _descriptor33, this);

    _initializerDefineProperty(this, "sortMode", _descriptor34, this);

    _initializerDefineProperty(this, "stages", _descriptor35, this);
  }, _temp8), (_descriptor33 = _applyDecoratedDescriptor(_class23.prototype, "isTransparent", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor34 = _applyDecoratedDescriptor(_class23.prototype, "sortMode", [_dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return RenderQueueSortMode.FRONT_TO_BACK;
    }
  }), _descriptor35 = _applyDecoratedDescriptor(_class23.prototype, "stages", [_dec31], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class23)) || _class22);
  _exports.RenderQueueDesc = RenderQueueDesc;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcGlwZWxpbmUtc2VyaWFsaXphdGlvbi50cyJdLCJuYW1lcyI6WyJHRlhUZXh0dXJlVHlwZSIsIkdGWFRleHR1cmVVc2FnZUJpdCIsIkdGWFN0b3JlT3AiLCJHRlhMb2FkT3AiLCJHRlhUZXh0dXJlTGF5b3V0IiwiUmVuZGVyRmxvd1RhZyIsIlJlbmRlclRleHR1cmVEZXNjIiwiR0ZYRm9ybWF0Iiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJURVgyRCIsIkNPTE9SX0FUVEFDSE1FTlQiLCJVTktOT1dOIiwiUmVuZGVyVGV4dHVyZUNvbmZpZyIsIlJlbmRlclRleHR1cmUiLCJNYXRlcmlhbENvbmZpZyIsIk1hdGVyaWFsIiwiRnJhbWVCdWZmZXJEZXNjIiwiQ0NTdHJpbmciLCJDb2xvckRlc2MiLCJDTEVBUiIsIlNUT1JFIiwiVU5ERUZJTkVEIiwiUFJFU0VOVF9TUkMiLCJEZXB0aFN0ZW5jaWxEZXNjIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwiLCJSZW5kZXJQYXNzRGVzYyIsIlJlbmRlclF1ZXVlU29ydE1vZGUiLCJSZW5kZXJRdWV1ZURlc2MiLCJGUk9OVF9UT19CQUNLIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQSxvQkFBT0Esc0JBQVA7QUFDQSxvQkFBT0MsMEJBQVA7QUFDQSxvQkFBT0Msa0JBQVA7QUFDQSxvQkFBT0MsaUJBQVA7QUFDQSxvQkFBT0Msd0JBQVA7QUFFQTs7Ozs7TUFJWUMsYTs7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7S0FBQUEsYSw4QkFBQUEsYTs7QUFNWixvQkFBT0EsYUFBUDtNQUdhQyxpQixXQURaLG9CQUFRLG1CQUFSLEMsVUFLSSxpQkFBS04sc0JBQUwsQyxVQUVBLGlCQUFLQywwQkFBTCxDLFVBRUEsaUJBQUtNLGlCQUFMLEM7Ozs7Ozs7Ozs7Ozs7O2tGQVBBQyxtQixFQUNBQyxlOzs7OzthQUNxQixFOzs7Ozs7O2FBRVFULHVCQUFlVSxLOzs7Ozs7O2FBRVZULDJCQUFtQlUsZ0I7Ozs7Ozs7YUFFM0JKLGtCQUFVSyxPOzs0RUFDcENKLG1CLEVBQ0FDLGU7Ozs7O2FBQ3NCLENBQUMsQzs7NkVBQ3ZCRCxtQixFQUNBQyxlOzs7OzthQUN1QixDQUFDLEM7Ozs7TUFJaEJJLG1CLFlBRFosb0JBQVEscUJBQVIsQyxVQUtJLGlCQUFLQyw0QkFBTCxDOzs7Ozs7b0ZBSEFOLG1CLEVBQ0FDLGU7Ozs7O2FBQ3FCLEU7Ozs7Ozs7YUFFaUIsSTs7OztNQUk5Qk0sYyxZQURaLG9CQUFRLGdCQUFSLEMsVUFLSSxpQkFBS0Msa0JBQUwsQzs7Ozs7O29GQUhBUixtQixFQUNBQyxlOzs7OzthQUNxQixFOzs7Ozs7O2FBRWEsSTs7OztNQUkxQlEsZSxZQURaLG9CQUFRLGlCQUFSLEMsV0FRSSxpQkFBSyxDQUFDQyxtQkFBRCxDQUFMLEMsV0FLQSxpQkFBS0osNEJBQUwsQzs7Ozs7Ozs7Ozs7O3NGQVhBTixtQixFQUNBQyxlOzs7OzthQUNxQixFOzttRkFDckJELG1CLEVBQ0FDLGU7Ozs7O2FBQzJCLEM7Ozs7Ozs7YUFFSyxFOzs0RkFDaENELG1CLEVBQ0FDLGU7Ozs7O2FBQ29DLEU7Ozs7Ozs7YUFFRSxJOzs7O01BSTlCVSxTLGFBRFosb0JBQVEsV0FBUixDLFdBRUksaUJBQUtaLGlCQUFMLEMsV0FFQSxpQkFBS0osaUJBQUwsQyxXQUVBLGlCQUFLRCxrQkFBTCxDLFdBS0EsaUJBQUtFLHdCQUFMLEMsV0FFQSxpQkFBS0Esd0JBQUwsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzthQVYwQkcsa0JBQVVLLE87Ozs7Ozs7YUFFVlQsa0JBQVVpQixLOzs7Ozs7O2FBRVJsQixtQkFBV21CLEs7O29GQUN2Q2IsbUIsRUFDQUMsZTs7Ozs7YUFDNEIsQzs7Ozs7OzthQUVVTCx5QkFBaUJrQixTOzs7Ozs7O2FBRW5CbEIseUJBQWlCbUIsVzs7OztNQUk3Q0MsZ0IsYUFEWixvQkFBUSxrQkFBUixDLFdBRUksaUJBQUtqQixpQkFBTCxDLFdBRUEsaUJBQUtKLGlCQUFMLEMsV0FFQSxpQkFBS0Qsa0JBQUwsQyxXQUVBLGlCQUFLQyxpQkFBTCxDLFdBRUEsaUJBQUtELGtCQUFMLEMsV0FLQSxpQkFBS0Usd0JBQUwsQyxXQUVBLGlCQUFLQSx3QkFBTCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzthQWQwQkcsa0JBQVVLLE87Ozs7Ozs7YUFFTFQsa0JBQVVpQixLOzs7Ozs7O2FBRVJsQixtQkFBV21CLEs7Ozs7Ozs7YUFFWGxCLGtCQUFVaUIsSzs7Ozs7OzthQUVSbEIsbUJBQVdtQixLOztvRkFDOUNiLG1CLEVBQ0FDLGU7Ozs7O2FBQzRCLEM7Ozs7Ozs7YUFFVUwseUJBQWlCa0IsUzs7Ozs7OzthQUVuQmxCLHlCQUFpQnFCLGdDOzs7O01BSTdDQyxjLGFBRFosb0JBQVEsZ0JBQVIsQyxXQUtJLGlCQUFLLENBQUNQLFNBQUQsQ0FBTCxDLFdBRUEsaUJBQUtLLGdCQUFMLEM7Ozs7Ozs7O3VGQUxBaEIsbUIsRUFDQUMsZTs7Ozs7YUFDc0IsQ0FBQyxDOzs7Ozs7O2FBRUUsRTs7Ozs7OzthQUV3QixJQUFJZSxnQkFBSixFOzs7O01BRzFDRyxtQjs7O2FBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0FBQUFBLElBQUFBLG1CLENBQUFBLG1CO0tBQUFBLG1CLG9DQUFBQSxtQjs7QUFLWixvQkFBT0EsbUJBQVA7QUFFQTs7Ozs7TUFLYUMsZSxhQURaLG9CQUFRLGlCQUFSLEMsV0FlSSxpQkFBS0QsbUJBQUwsQyxXQU9BLGlCQUFLLENBQUNULG1CQUFELENBQUwsQzs7Ozs7Ozs7K0ZBZkFWLG1CLEVBQ0FDLGU7Ozs7O2FBQytCLEs7Ozs7Ozs7YUFPT2tCLG1CQUFtQixDQUFDRSxhOzs7Ozs7O2FBT2pDLEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQ0NTdHJpbmcgfSBmcm9tICcuLi9kYXRhL3V0aWxzL2F0dHJpYnV0ZSc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBHRlhGb3JtYXQsIEdGWExvYWRPcCwgR0ZYU3RvcmVPcCwgR0ZYVGV4dHVyZUxheW91dCwgR0ZYVGV4dHVyZVR5cGUsIEdGWFRleHR1cmVVc2FnZUJpdH0gZnJvbSAnLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uL3ZhbHVlLXR5cGVzL2VudW0nO1xyXG5pbXBvcnQgeyBSZW5kZXJUZXh0dXJlIH0gZnJvbSAnLi8uLi9hc3NldHMvcmVuZGVyLXRleHR1cmUnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uL2Fzc2V0cy9tYXRlcmlhbCc7XHJcblxyXG5jY2VudW0oR0ZYVGV4dHVyZVR5cGUpO1xyXG5jY2VudW0oR0ZYVGV4dHVyZVVzYWdlQml0KTtcclxuY2NlbnVtKEdGWFN0b3JlT3ApO1xyXG5jY2VudW0oR0ZYTG9hZE9wKTtcclxuY2NlbnVtKEdGWFRleHR1cmVMYXlvdXQpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgdGFnIG9mIHRoZSByZW5kZXIgZmxvdywgaW5jbHVkaW5nIFNDRU5FLCBQT1NUUFJPQ0VTUyBhbmQgVUkuXHJcbiAqIEB6aCDmuLLmn5PmtYHnqIvnmoTmoIfnrb7vvIzljIXlkKvvvJrluLjop4TlnLrmma/vvIhTQ0VORe+8ie+8jOWQjuWkhOeQhu+8iFBPU1RQUk9DRVNT77yJ77yMVUkg55WM6Z2i77yIVUnvvIlcclxuICovXHJcbmV4cG9ydCBlbnVtIFJlbmRlckZsb3dUYWcge1xyXG4gICAgU0NFTkUsXHJcbiAgICBQT1NUUFJPQ0VTUyxcclxuICAgIFVJLFxyXG59XHJcblxyXG5jY2VudW0oUmVuZGVyRmxvd1RhZyk7XHJcblxyXG5AY2NjbGFzcygnUmVuZGVyVGV4dHVyZURlc2MnKVxyXG5leHBvcnQgY2xhc3MgUmVuZGVyVGV4dHVyZURlc2Mge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gJyc7XHJcbiAgICBAdHlwZShHRlhUZXh0dXJlVHlwZSlcclxuICAgIHB1YmxpYyB0eXBlOiBHRlhUZXh0dXJlVHlwZSA9IEdGWFRleHR1cmVUeXBlLlRFWDJEO1xyXG4gICAgQHR5cGUoR0ZYVGV4dHVyZVVzYWdlQml0KVxyXG4gICAgcHVibGljIHVzYWdlOiBHRlhUZXh0dXJlVXNhZ2VCaXQgPSBHRlhUZXh0dXJlVXNhZ2VCaXQuQ09MT1JfQVRUQUNITUVOVDtcclxuICAgIEB0eXBlKEdGWEZvcm1hdClcclxuICAgIHB1YmxpYyBmb3JtYXQ6IEdGWEZvcm1hdCA9IEdGWEZvcm1hdC5VTktOT1dOO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgd2lkdGg6IG51bWJlciA9IC0xO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIgPSAtMTtcclxufVxyXG5cclxuQGNjY2xhc3MoJ1JlbmRlclRleHR1cmVDb25maWcnKVxyXG5leHBvcnQgY2xhc3MgUmVuZGVyVGV4dHVyZUNvbmZpZyB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnJztcclxuICAgIEB0eXBlKFJlbmRlclRleHR1cmUpXHJcbiAgICBwdWJsaWMgdGV4dHVyZTogUmVuZGVyVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG59XHJcblxyXG5AY2NjbGFzcygnTWF0ZXJpYWxDb25maWcnKVxyXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxDb25maWcge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gJyc7XHJcbiAgICBAdHlwZShNYXRlcmlhbClcclxuICAgIHB1YmxpYyBtYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxufVxyXG5cclxuQGNjY2xhc3MoJ0ZyYW1lQnVmZmVyRGVzYycpXHJcbmV4cG9ydCBjbGFzcyBGcmFtZUJ1ZmZlckRlc2Mge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nID0gJyc7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyByZW5kZXJQYXNzOiBudW1iZXIgPSAwO1xyXG4gICAgQHR5cGUoW0NDU3RyaW5nXSlcclxuICAgIHB1YmxpYyBjb2xvclRleHR1cmVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgZGVwdGhTdGVuY2lsVGV4dHVyZTogc3RyaW5nID0gJyc7XHJcbiAgICBAdHlwZShSZW5kZXJUZXh0dXJlKVxyXG4gICAgcHVibGljIHRleHR1cmU6IFJlbmRlclRleHR1cmUgfCBudWxsID0gbnVsbDtcclxufVxyXG5cclxuQGNjY2xhc3MoJ0NvbG9yRGVzYycpXHJcbmV4cG9ydCBjbGFzcyBDb2xvckRlc2Mge1xyXG4gICAgQHR5cGUoR0ZYRm9ybWF0KVxyXG4gICAgcHVibGljIGZvcm1hdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICBAdHlwZShHRlhMb2FkT3ApXHJcbiAgICBwdWJsaWMgbG9hZE9wOiBHRlhMb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7XHJcbiAgICBAdHlwZShHRlhTdG9yZU9wKVxyXG4gICAgcHVibGljIHN0b3JlT3A6IEdGWFN0b3JlT3AgPSBHRlhTdG9yZU9wLlNUT1JFO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgc2FtcGxlQ291bnQ6IG51bWJlciA9IDE7XHJcbiAgICBAdHlwZShHRlhUZXh0dXJlTGF5b3V0KVxyXG4gICAgcHVibGljIGJlZ2luTGF5b3V0OiBHRlhUZXh0dXJlTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5VTkRFRklORUQ7XHJcbiAgICBAdHlwZShHRlhUZXh0dXJlTGF5b3V0KVxyXG4gICAgcHVibGljIGVuZExheW91dDogR0ZYVGV4dHVyZUxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuUFJFU0VOVF9TUkM7XHJcbn1cclxuXHJcbkBjY2NsYXNzKCdEZXB0aFN0ZW5jaWxEZXNjJylcclxuZXhwb3J0IGNsYXNzIERlcHRoU3RlbmNpbERlc2Mge1xyXG4gICAgQHR5cGUoR0ZYRm9ybWF0KVxyXG4gICAgcHVibGljIGZvcm1hdDogR0ZYRm9ybWF0ID0gR0ZYRm9ybWF0LlVOS05PV047XHJcbiAgICBAdHlwZShHRlhMb2FkT3ApXHJcbiAgICBwdWJsaWMgZGVwdGhMb2FkT3A6IEdGWExvYWRPcCA9IEdGWExvYWRPcC5DTEVBUjtcclxuICAgIEB0eXBlKEdGWFN0b3JlT3ApXHJcbiAgICBwdWJsaWMgZGVwdGhTdG9yZU9wOiBHRlhTdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgIEB0eXBlKEdGWExvYWRPcClcclxuICAgIHB1YmxpYyBzdGVuY2lsTG9hZE9wOiBHRlhMb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7XHJcbiAgICBAdHlwZShHRlhTdG9yZU9wKVxyXG4gICAgcHVibGljIHN0ZW5jaWxTdG9yZU9wOiBHRlhTdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIHNhbXBsZUNvdW50OiBudW1iZXIgPSAxO1xyXG4gICAgQHR5cGUoR0ZYVGV4dHVyZUxheW91dClcclxuICAgIHB1YmxpYyBiZWdpbkxheW91dDogR0ZYVGV4dHVyZUxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuVU5ERUZJTkVEO1xyXG4gICAgQHR5cGUoR0ZYVGV4dHVyZUxheW91dClcclxuICAgIHB1YmxpYyBlbmRMYXlvdXQ6IEdGWFRleHR1cmVMYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVF9PUFRJTUFMO1xyXG59XHJcblxyXG5AY2NjbGFzcygnUmVuZGVyUGFzc0Rlc2MnKVxyXG5leHBvcnQgY2xhc3MgUmVuZGVyUGFzc0Rlc2Mge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgaW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgQHR5cGUoW0NvbG9yRGVzY10pXHJcbiAgICBwdWJsaWMgY29sb3JBdHRhY2htZW50cyA9IFtdO1xyXG4gICAgQHR5cGUoRGVwdGhTdGVuY2lsRGVzYylcclxuICAgIHB1YmxpYyBkZXB0aFN0ZW5jaWxBdHRhY2htZW50OiBEZXB0aFN0ZW5jaWxEZXNjID0gbmV3IERlcHRoU3RlbmNpbERlc2MoKTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gUmVuZGVyUXVldWVTb3J0TW9kZSB7XHJcbiAgICBGUk9OVF9UT19CQUNLLFxyXG4gICAgQkFDS19UT19GUk9OVCxcclxufVxyXG5cclxuY2NlbnVtKFJlbmRlclF1ZXVlU29ydE1vZGUpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgcmVuZGVyIHF1ZXVlIGRlc2NyaXB0b3JcclxuICogQHpoIOa4suafk+mYn+WIl+aPj+i/sOS/oeaBr1xyXG4gKi9cclxuQGNjY2xhc3MoJ1JlbmRlclF1ZXVlRGVzYycpXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJRdWV1ZURlc2Mge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgdGhlIHJlbmRlciBxdWV1ZSBpcyBhIHRyYW5zcGFyZW50IHF1ZXVlXHJcbiAgICAgKiBAemgg5b2T5YmN6Zif5YiX5piv5ZCm5piv5Y2K6YCP5piO6Zif5YiXXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIGlzVHJhbnNwYXJlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc29ydCBtb2RlIG9mIHRoZSByZW5kZXIgcXVldWVcclxuICAgICAqIEB6aCDmuLLmn5PpmJ/liJfnmoTmjpLluo/mqKHlvI9cclxuICAgICAqL1xyXG4gICAgQHR5cGUoUmVuZGVyUXVldWVTb3J0TW9kZSlcclxuICAgIHB1YmxpYyBzb3J0TW9kZTogUmVuZGVyUXVldWVTb3J0TW9kZSA9IFJlbmRlclF1ZXVlU29ydE1vZGUuRlJPTlRfVE9fQkFDSztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgc3RhZ2VzIHVzaW5nIHRoaXMgcXVldWVcclxuICAgICAqIEB6aCDkvb/nlKjlvZPliY3muLLmn5PpmJ/liJfnmoTpmLbmrrXliJfooahcclxuICAgICAqL1xyXG4gICAgQHR5cGUoW0NDU3RyaW5nXSlcclxuICAgIHB1YmxpYyBzdGFnZXM6IHN0cmluZ1tdID0gW107XHJcbn1cclxuIl19