(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.pipelineState = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXPipelineState = _exports.GFXPipelineStateInfo = _exports.GFXInputState = _exports.GFXBlendState = _exports.GFXBlendTarget = _exports.GFXDepthStencilState = _exports.GFXRasterizerState = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en GFX rasterizer state.
   * @zh GFX 光栅化状态。
   */
  var GFXRasterizerState = /*#__PURE__*/function () {
    // to make sure all usages must be an instance of this exact class, not assembled from plain object
    function GFXRasterizerState() {
      var isDiscard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var polygonMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXPolygonMode.FILL;
      var shadeModel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXShadeModel.GOURAND;
      var cullMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXCullMode.BACK;
      var isFrontFaceCCW = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var depthBias = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var depthBiasClamp = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0.0;
      var depthBiasSlop = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0.0;
      var isDepthClip = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
      var isMultisample = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : false;
      var lineWidth = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1.0;

      _classCallCheck(this, GFXRasterizerState);

      this.isDiscard = isDiscard;
      this.polygonMode = polygonMode;
      this.shadeModel = shadeModel;
      this.cullMode = cullMode;
      this.isFrontFaceCCW = isFrontFaceCCW;
      this.depthBias = depthBias;
      this.depthBiasClamp = depthBiasClamp;
      this.depthBiasSlop = depthBiasSlop;
      this.isDepthClip = isDepthClip;
      this.isMultisample = isMultisample;
      this.lineWidth = lineWidth;
    }

    _createClass(GFXRasterizerState, [{
      key: "compare",
      value: function compare(state) {
        return this.isDiscard === state.isDiscard && this.polygonMode === state.polygonMode && this.shadeModel === state.shadeModel && this.cullMode === state.cullMode && this.isFrontFaceCCW === state.isFrontFaceCCW && this.depthBias === state.depthBias && this.depthBiasClamp === state.depthBiasClamp && this.depthBiasSlop === state.depthBiasSlop && this.isDepthClip === state.isDepthClip && this.lineWidth === state.lineWidth && this.isMultisample === state.isMultisample;
      }
    }]);

    return GFXRasterizerState;
  }();
  /**
   * @en GFX depth stencil state.
   * @zh GFX 深度模板状态。
   */


  _exports.GFXRasterizerState = GFXRasterizerState;

  var GFXDepthStencilState = /*#__PURE__*/function () {
    // to make sure all usages must be an instance of this exact class, not assembled from plain object
    function GFXDepthStencilState() {
      var depthTest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var depthWrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var depthFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXComparisonFunc.LESS;
      var stencilTestFront = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var stencilFuncFront = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXComparisonFunc.ALWAYS;
      var stencilReadMaskFront = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0xffff;
      var stencilWriteMaskFront = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0xffff;
      var stencilFailOpFront = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _define.GFXStencilOp.KEEP;
      var stencilZFailOpFront = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : _define.GFXStencilOp.KEEP;
      var stencilPassOpFront = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : _define.GFXStencilOp.KEEP;
      var stencilRefFront = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1;
      var stencilTestBack = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;
      var stencilFuncBack = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : _define.GFXComparisonFunc.ALWAYS;
      var stencilReadMaskBack = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0xffff;
      var stencilWriteMaskBack = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 0xffff;
      var stencilFailOpBack = arguments.length > 15 && arguments[15] !== undefined ? arguments[15] : _define.GFXStencilOp.KEEP;
      var stencilZFailOpBack = arguments.length > 16 && arguments[16] !== undefined ? arguments[16] : _define.GFXStencilOp.KEEP;
      var stencilPassOpBack = arguments.length > 17 && arguments[17] !== undefined ? arguments[17] : _define.GFXStencilOp.KEEP;
      var stencilRefBack = arguments.length > 18 && arguments[18] !== undefined ? arguments[18] : 1;

      _classCallCheck(this, GFXDepthStencilState);

      this.depthTest = depthTest;
      this.depthWrite = depthWrite;
      this.depthFunc = depthFunc;
      this.stencilTestFront = stencilTestFront;
      this.stencilFuncFront = stencilFuncFront;
      this.stencilReadMaskFront = stencilReadMaskFront;
      this.stencilWriteMaskFront = stencilWriteMaskFront;
      this.stencilFailOpFront = stencilFailOpFront;
      this.stencilZFailOpFront = stencilZFailOpFront;
      this.stencilPassOpFront = stencilPassOpFront;
      this.stencilRefFront = stencilRefFront;
      this.stencilTestBack = stencilTestBack;
      this.stencilFuncBack = stencilFuncBack;
      this.stencilReadMaskBack = stencilReadMaskBack;
      this.stencilWriteMaskBack = stencilWriteMaskBack;
      this.stencilFailOpBack = stencilFailOpBack;
      this.stencilZFailOpBack = stencilZFailOpBack;
      this.stencilPassOpBack = stencilPassOpBack;
      this.stencilRefBack = stencilRefBack;
    }

    _createClass(GFXDepthStencilState, [{
      key: "compare",
      value: function compare(state) {
        return this.depthTest === state.depthTest && this.depthWrite === state.depthWrite && this.depthFunc === state.depthFunc && this.stencilTestFront === state.stencilTestFront && this.stencilFuncFront === state.stencilFuncFront && this.stencilReadMaskFront === state.stencilReadMaskFront && this.stencilWriteMaskFront === state.stencilWriteMaskFront && this.stencilFailOpFront === state.stencilFailOpFront && this.stencilZFailOpFront === state.stencilZFailOpFront && this.stencilPassOpFront === state.stencilPassOpFront && this.stencilRefFront === state.stencilRefFront && this.stencilTestBack === state.stencilTestBack && this.stencilFuncBack === state.stencilFuncBack && this.stencilReadMaskBack === state.stencilReadMaskBack && this.stencilWriteMaskBack === state.stencilWriteMaskBack && this.stencilFailOpBack === state.stencilFailOpBack && this.stencilZFailOpBack === state.stencilZFailOpBack && this.stencilPassOpBack === state.stencilPassOpBack && this.stencilRefBack === state.stencilRefBack;
      }
    }]);

    return GFXDepthStencilState;
  }();
  /**
   * @en GFX blend target.
   * @zh GFX 混合目标。
   */


  _exports.GFXDepthStencilState = GFXDepthStencilState;

  var GFXBlendTarget = /*#__PURE__*/function () {
    // to make sure all usages must be an instance of this exact class, not assembled from plain object
    function GFXBlendTarget() {
      var blend = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var blendSrc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _define.GFXBlendFactor.ONE;
      var blendDst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define.GFXBlendFactor.ZERO;
      var blendEq = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _define.GFXBlendOp.ADD;
      var blendSrcAlpha = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _define.GFXBlendFactor.ONE;
      var blendDstAlpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _define.GFXBlendFactor.ZERO;
      var blendAlphaEq = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _define.GFXBlendOp.ADD;
      var blendColorMask = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _define.GFXColorMask.ALL;

      _classCallCheck(this, GFXBlendTarget);

      this.blend = blend;
      this.blendSrc = blendSrc;
      this.blendDst = blendDst;
      this.blendEq = blendEq;
      this.blendSrcAlpha = blendSrcAlpha;
      this.blendDstAlpha = blendDstAlpha;
      this.blendAlphaEq = blendAlphaEq;
      this.blendColorMask = blendColorMask;
    }

    _createClass(GFXBlendTarget, [{
      key: "compare",
      value: function compare(target) {
        return this.blend === target.blend && this.blendSrc === target.blendSrc && this.blendDst === target.blendDst && this.blendEq === target.blendEq && this.blendSrcAlpha === target.blendSrcAlpha && this.blendDstAlpha === target.blendDstAlpha && this.blendAlphaEq === target.blendAlphaEq && this.blendColorMask === target.blendColorMask;
      }
    }]);

    return GFXBlendTarget;
  }();
  /**
   * @en GFX blend state.
   * @zh GFX混合状态。
   */


  _exports.GFXBlendTarget = GFXBlendTarget;

  var GFXBlendState = /*#__PURE__*/function () {
    // to make sure all usages must be an instance of this exact class, not assembled from plain object
    function GFXBlendState() {
      var isA2C = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var isIndepend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var blendColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new _define.GFXColor();
      var targets = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [new GFXBlendTarget()];

      _classCallCheck(this, GFXBlendState);

      this.isA2C = isA2C;
      this.isIndepend = isIndepend;
      this.blendColor = blendColor;
      this.targets = targets;
    }
    /**
     * @en Should use this function to set target, or it will not work
     * on native platforms, as native can not support this feature,
     * such as `blendState[i] = target;`.
     *
     * @param index The index to set target.
     * @param target The target to be set.
     */


    _createClass(GFXBlendState, [{
      key: "setTarget",
      value: function setTarget(index, target) {
        this.targets[index] = target;
      }
    }]);

    return GFXBlendState;
  }();
  /**
   * @en GFX input state.
   * @zh GFX 输入状态。
   */


  _exports.GFXBlendState = GFXBlendState;

  var GFXInputState = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXInputState() {
    var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, GFXInputState);

    this.attributes = attributes;
  };

  _exports.GFXInputState = GFXInputState;

  var GFXPipelineStateInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXPipelineStateInfo(shader, pipelineLayout, renderPass, inputState, rasterizerState, depthStencilState, blendState) {
    var primitive = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : _define.GFXPrimitiveMode.TRIANGLE_LIST;
    var dynamicStates = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : _define.GFXDynamicStateFlagBit.NONE;

    _classCallCheck(this, GFXPipelineStateInfo);

    this.shader = shader;
    this.pipelineLayout = pipelineLayout;
    this.renderPass = renderPass;
    this.inputState = inputState;
    this.rasterizerState = rasterizerState;
    this.depthStencilState = depthStencilState;
    this.blendState = blendState;
    this.primitive = primitive;
    this.dynamicStates = dynamicStates;
  };
  /**
   * @en GFX pipeline state.
   * @zh GFX 管线状态。
   */


  _exports.GFXPipelineStateInfo = GFXPipelineStateInfo;

  var GFXPipelineState = /*#__PURE__*/function (_GFXObject) {
    _inherits(GFXPipelineState, _GFXObject);

    _createClass(GFXPipelineState, [{
      key: "shader",

      /**
       * @en Get current shader.
       * @zh GFX 着色器。
       */
      get: function get() {
        return this._shader;
      }
      /**
       * @en Get current pipeline layout.
       * @zh GFX 管线布局。
       */

    }, {
      key: "pipelineLayout",
      get: function get() {
        return this._pipelineLayout;
      }
      /**
       * @en Get current primitve mode.
       * @zh GFX 图元模式。
       */

    }, {
      key: "primitive",
      get: function get() {
        return this._primitive;
      }
      /**
       * @en Get current rasterizer state.
       * @zh GFX 光栅化状态。
       */

    }, {
      key: "rasterizerState",
      get: function get() {
        return this._rs;
      }
      /**
       * @en Get current depth stencil state.
       * @zh GFX 深度模板状态。
       */

    }, {
      key: "depthStencilState",
      get: function get() {
        return this._dss;
      }
      /**
       * @en Get current blend state.
       * @zh GFX 混合状态。
       */

    }, {
      key: "blendState",
      get: function get() {
        return this._bs;
      }
      /**
       * @en Get current input state.
       * @zh GFX 输入状态。
       */

    }, {
      key: "inputState",
      get: function get() {
        return this._is;
      }
      /**
       * @en Get current dynamic states.
       * @zh GFX 动态状态数组。
       */

    }, {
      key: "dynamicStates",
      get: function get() {
        return this._dynamicStates;
      }
      /**
       * @en Get current render pass.
       * @zh GFX 渲染过程。
       */

    }, {
      key: "renderPass",
      get: function get() {
        return this._renderPass;
      }
    }]);

    function GFXPipelineState(device) {
      var _this;

      _classCallCheck(this, GFXPipelineState);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GFXPipelineState).call(this, _define.GFXObjectType.PIPELINE_STATE));
      _this._device = void 0;
      _this._shader = null;
      _this._pipelineLayout = null;
      _this._primitive = _define.GFXPrimitiveMode.TRIANGLE_LIST;
      _this._is = null;
      _this._rs = null;
      _this._dss = null;
      _this._bs = null;
      _this._dynamicStates = _define.GFXDynamicStateFlagBit.NONE;
      _this._renderPass = null;
      _this._device = device;
      return _this;
    }

    return GFXPipelineState;
  }(_define.GFXObject);

  _exports.GFXPipelineState = GFXPipelineState;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3BpcGVsaW5lLXN0YXRlLnRzIl0sIm5hbWVzIjpbIkdGWFJhc3Rlcml6ZXJTdGF0ZSIsImlzRGlzY2FyZCIsInBvbHlnb25Nb2RlIiwiR0ZYUG9seWdvbk1vZGUiLCJGSUxMIiwic2hhZGVNb2RlbCIsIkdGWFNoYWRlTW9kZWwiLCJHT1VSQU5EIiwiY3VsbE1vZGUiLCJHRlhDdWxsTW9kZSIsIkJBQ0siLCJpc0Zyb250RmFjZUNDVyIsImRlcHRoQmlhcyIsImRlcHRoQmlhc0NsYW1wIiwiZGVwdGhCaWFzU2xvcCIsImlzRGVwdGhDbGlwIiwiaXNNdWx0aXNhbXBsZSIsImxpbmVXaWR0aCIsInN0YXRlIiwiR0ZYRGVwdGhTdGVuY2lsU3RhdGUiLCJkZXB0aFRlc3QiLCJkZXB0aFdyaXRlIiwiZGVwdGhGdW5jIiwiR0ZYQ29tcGFyaXNvbkZ1bmMiLCJMRVNTIiwic3RlbmNpbFRlc3RGcm9udCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJBTFdBWVMiLCJzdGVuY2lsUmVhZE1hc2tGcm9udCIsInN0ZW5jaWxXcml0ZU1hc2tGcm9udCIsInN0ZW5jaWxGYWlsT3BGcm9udCIsIkdGWFN0ZW5jaWxPcCIsIktFRVAiLCJzdGVuY2lsWkZhaWxPcEZyb250Iiwic3RlbmNpbFBhc3NPcEZyb250Iiwic3RlbmNpbFJlZkZyb250Iiwic3RlbmNpbFRlc3RCYWNrIiwic3RlbmNpbEZ1bmNCYWNrIiwic3RlbmNpbFJlYWRNYXNrQmFjayIsInN0ZW5jaWxXcml0ZU1hc2tCYWNrIiwic3RlbmNpbEZhaWxPcEJhY2siLCJzdGVuY2lsWkZhaWxPcEJhY2siLCJzdGVuY2lsUGFzc09wQmFjayIsInN0ZW5jaWxSZWZCYWNrIiwiR0ZYQmxlbmRUYXJnZXQiLCJibGVuZCIsImJsZW5kU3JjIiwiR0ZYQmxlbmRGYWN0b3IiLCJPTkUiLCJibGVuZERzdCIsIlpFUk8iLCJibGVuZEVxIiwiR0ZYQmxlbmRPcCIsIkFERCIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRDb2xvck1hc2siLCJHRlhDb2xvck1hc2siLCJBTEwiLCJ0YXJnZXQiLCJHRlhCbGVuZFN0YXRlIiwiaXNBMkMiLCJpc0luZGVwZW5kIiwiYmxlbmRDb2xvciIsIkdGWENvbG9yIiwidGFyZ2V0cyIsImluZGV4IiwiR0ZYSW5wdXRTdGF0ZSIsImF0dHJpYnV0ZXMiLCJHRlhQaXBlbGluZVN0YXRlSW5mbyIsInNoYWRlciIsInBpcGVsaW5lTGF5b3V0IiwicmVuZGVyUGFzcyIsImlucHV0U3RhdGUiLCJyYXN0ZXJpemVyU3RhdGUiLCJkZXB0aFN0ZW5jaWxTdGF0ZSIsImJsZW5kU3RhdGUiLCJwcmltaXRpdmUiLCJHRlhQcmltaXRpdmVNb2RlIiwiVFJJQU5HTEVfTElTVCIsImR5bmFtaWNTdGF0ZXMiLCJHRlhEeW5hbWljU3RhdGVGbGFnQml0IiwiTk9ORSIsIkdGWFBpcGVsaW5lU3RhdGUiLCJfc2hhZGVyIiwiX3BpcGVsaW5lTGF5b3V0IiwiX3ByaW1pdGl2ZSIsIl9ycyIsIl9kc3MiLCJfYnMiLCJfaXMiLCJfZHluYW1pY1N0YXRlcyIsIl9yZW5kZXJQYXNzIiwiZGV2aWNlIiwiR0ZYT2JqZWN0VHlwZSIsIlBJUEVMSU5FX1NUQVRFIiwiX2RldmljZSIsIkdGWE9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7Ozs7TUFJYUEsa0I7QUFDcUI7QUFFOUIsa0NBWUU7QUFBQSxVQVhTQyxTQVdULHVFQVg4QixLQVc5QjtBQUFBLFVBVlNDLFdBVVQsdUVBVnVDQyx1QkFBZUMsSUFVdEQ7QUFBQSxVQVRTQyxVQVNULHVFQVRxQ0Msc0JBQWNDLE9BU25EO0FBQUEsVUFSU0MsUUFRVCx1RUFSaUNDLG9CQUFZQyxJQVE3QztBQUFBLFVBUFNDLGNBT1QsdUVBUG1DLElBT25DO0FBQUEsVUFOU0MsU0FNVCx1RUFONkIsQ0FNN0I7QUFBQSxVQUxTQyxj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QSxZQWxCdEJaLE9Ba0JzQixHQWxCTSxJQWtCTjtBQUFBLFlBaEJ0QkMsZUFnQnNCLEdBaEJzQixJQWdCdEI7QUFBQSxZQWR0QkMsVUFjc0IsR0FkU1IseUJBQWlCQyxhQWMxQjtBQUFBLFlBWnRCVyxHQVlzQixHQVpNLElBWU47QUFBQSxZQVZ0QkgsR0FVc0IsR0FWVyxJQVVYO0FBQUEsWUFSdEJDLElBUXNCLEdBUmMsSUFRZDtBQUFBLFlBTnRCQyxHQU1zQixHQU5NLElBTU47QUFBQSxZQUp0QkUsY0FJc0IsR0FKaUJWLCtCQUF1QkMsSUFJeEM7QUFBQSxZQUZ0QlUsV0FFc0IsR0FGYyxJQUVkO0FBRTVCLFlBQUtJLE9BQUwsR0FBZUgsTUFBZjtBQUY0QjtBQUcvQjs7O0lBakcwQ0ksaUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdmeFxyXG4gKi9cclxuXHJcbmltcG9ydCB7XHJcbiAgICBHRlhCbGVuZEZhY3RvcixcclxuICAgIEdGWEJsZW5kT3AsXHJcbiAgICBHRlhDb2xvck1hc2ssXHJcbiAgICBHRlhDb21wYXJpc29uRnVuYyxcclxuICAgIEdGWEN1bGxNb2RlLFxyXG4gICAgR0ZYRHluYW1pY1N0YXRlRmxhZ3MsXHJcbiAgICBHRlhPYmplY3QsXHJcbiAgICBHRlhPYmplY3RUeXBlLFxyXG4gICAgR0ZYUG9seWdvbk1vZGUsXHJcbiAgICBHRlhQcmltaXRpdmVNb2RlLFxyXG4gICAgR0ZYU2hhZGVNb2RlbCxcclxuICAgIEdGWFN0ZW5jaWxPcCxcclxuICAgIEdGWENvbG9yLFxyXG4gICAgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdCxcclxufSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4vZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi9yZW5kZXItcGFzcyc7XHJcbmltcG9ydCB7IEdGWFNoYWRlciB9IGZyb20gJy4vc2hhZGVyJztcclxuaW1wb3J0IHsgR0ZYUGlwZWxpbmVMYXlvdXQgfSBmcm9tICcuL3BpcGVsaW5lLWxheW91dCc7XHJcblxyXG4vKipcclxuICogQGVuIEdGWCByYXN0ZXJpemVyIHN0YXRlLlxyXG4gKiBAemggR0ZYIOWFieagheWMlueKtuaAgeOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdGWFJhc3Rlcml6ZXJTdGF0ZSB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGlzRGlzY2FyZDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgIHB1YmxpYyBwb2x5Z29uTW9kZTogR0ZYUG9seWdvbk1vZGUgPSBHRlhQb2x5Z29uTW9kZS5GSUxMLFxyXG4gICAgICAgIHB1YmxpYyBzaGFkZU1vZGVsOiBHRlhTaGFkZU1vZGVsID0gR0ZYU2hhZGVNb2RlbC5HT1VSQU5ELFxyXG4gICAgICAgIHB1YmxpYyBjdWxsTW9kZTogR0ZYQ3VsbE1vZGUgPSBHRlhDdWxsTW9kZS5CQUNLLFxyXG4gICAgICAgIHB1YmxpYyBpc0Zyb250RmFjZUNDVzogYm9vbGVhbiA9IHRydWUsXHJcbiAgICAgICAgcHVibGljIGRlcHRoQmlhczogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgZGVwdGhCaWFzQ2xhbXA6IG51bWJlciA9IDAuMCxcclxuICAgICAgICBwdWJsaWMgZGVwdGhCaWFzU2xvcDogbnVtYmVyID0gMC4wLFxyXG4gICAgICAgIHB1YmxpYyBpc0RlcHRoQ2xpcDogYm9vbGVhbiA9IHRydWUsXHJcbiAgICAgICAgcHVibGljIGlzTXVsdGlzYW1wbGU6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICBwdWJsaWMgbGluZVdpZHRoOiBudW1iZXIgPSAxLjAsXHJcbiAgICApIHt9XHJcblxyXG4gICAgcHVibGljIGNvbXBhcmUgKHN0YXRlOiBHRlhSYXN0ZXJpemVyU3RhdGUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuaXNEaXNjYXJkID09PSBzdGF0ZS5pc0Rpc2NhcmQpICYmXHJcbiAgICAgICAgICAgICh0aGlzLnBvbHlnb25Nb2RlID09PSBzdGF0ZS5wb2x5Z29uTW9kZSkgJiZcclxuICAgICAgICAgICAgKHRoaXMuc2hhZGVNb2RlbCA9PT0gc3RhdGUuc2hhZGVNb2RlbCkgJiZcclxuICAgICAgICAgICAgKHRoaXMuY3VsbE1vZGUgPT09IHN0YXRlLmN1bGxNb2RlKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5pc0Zyb250RmFjZUNDVyA9PT0gc3RhdGUuaXNGcm9udEZhY2VDQ1cpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmRlcHRoQmlhcyA9PT0gc3RhdGUuZGVwdGhCaWFzKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5kZXB0aEJpYXNDbGFtcCA9PT0gc3RhdGUuZGVwdGhCaWFzQ2xhbXApICYmXHJcbiAgICAgICAgICAgICh0aGlzLmRlcHRoQmlhc1Nsb3AgPT09IHN0YXRlLmRlcHRoQmlhc1Nsb3ApICYmXHJcbiAgICAgICAgICAgICh0aGlzLmlzRGVwdGhDbGlwID09PSBzdGF0ZS5pc0RlcHRoQ2xpcCkgJiZcclxuICAgICAgICAgICAgKHRoaXMubGluZVdpZHRoID09PSBzdGF0ZS5saW5lV2lkdGgpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmlzTXVsdGlzYW1wbGUgPT09IHN0YXRlLmlzTXVsdGlzYW1wbGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBkZXB0aCBzdGVuY2lsIHN0YXRlLlxyXG4gKiBAemggR0ZYIOa3seW6puaooeadv+eKtuaAgeOAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEdGWERlcHRoU3RlbmNpbFN0YXRlIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgZGVwdGhUZXN0OiBib29sZWFuID0gdHJ1ZSxcclxuICAgICAgICBwdWJsaWMgZGVwdGhXcml0ZTogYm9vbGVhbiA9IHRydWUsXHJcbiAgICAgICAgcHVibGljIGRlcHRoRnVuYzogR0ZYQ29tcGFyaXNvbkZ1bmMgPSBHRlhDb21wYXJpc29uRnVuYy5MRVNTLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsVGVzdEZyb250OiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxGdW5jRnJvbnQ6IEdGWENvbXBhcmlzb25GdW5jID0gR0ZYQ29tcGFyaXNvbkZ1bmMuQUxXQVlTLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsUmVhZE1hc2tGcm9udDogbnVtYmVyID0gMHhmZmZmLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsV3JpdGVNYXNrRnJvbnQ6IG51bWJlciA9IDB4ZmZmZixcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbEZhaWxPcEZyb250OiBHRlhTdGVuY2lsT3AgPSBHRlhTdGVuY2lsT3AuS0VFUCxcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbFpGYWlsT3BGcm9udDogR0ZYU3RlbmNpbE9wID0gR0ZYU3RlbmNpbE9wLktFRVAsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxQYXNzT3BGcm9udDogR0ZYU3RlbmNpbE9wID0gR0ZYU3RlbmNpbE9wLktFRVAsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxSZWZGcm9udDogbnVtYmVyID0gMSxcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbFRlc3RCYWNrOiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxGdW5jQmFjazogR0ZYQ29tcGFyaXNvbkZ1bmMgPSBHRlhDb21wYXJpc29uRnVuYy5BTFdBWVMsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxSZWFkTWFza0JhY2s6IG51bWJlciA9IDB4ZmZmZixcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbFdyaXRlTWFza0JhY2s6IG51bWJlciA9IDB4ZmZmZixcclxuICAgICAgICBwdWJsaWMgc3RlbmNpbEZhaWxPcEJhY2s6IEdGWFN0ZW5jaWxPcCA9IEdGWFN0ZW5jaWxPcC5LRUVQLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsWkZhaWxPcEJhY2s6IEdGWFN0ZW5jaWxPcCA9IEdGWFN0ZW5jaWxPcC5LRUVQLFxyXG4gICAgICAgIHB1YmxpYyBzdGVuY2lsUGFzc09wQmFjazogR0ZYU3RlbmNpbE9wID0gR0ZYU3RlbmNpbE9wLktFRVAsXHJcbiAgICAgICAgcHVibGljIHN0ZW5jaWxSZWZCYWNrOiBudW1iZXIgPSAxLFxyXG4gICAgKSB7fVxyXG5cclxuICAgIHB1YmxpYyBjb21wYXJlIChzdGF0ZTogR0ZYRGVwdGhTdGVuY2lsU3RhdGUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuZGVwdGhUZXN0ID09PSBzdGF0ZS5kZXB0aFRlc3QpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmRlcHRoV3JpdGUgPT09IHN0YXRlLmRlcHRoV3JpdGUpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmRlcHRoRnVuYyA9PT0gc3RhdGUuZGVwdGhGdW5jKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsVGVzdEZyb250ID09PSBzdGF0ZS5zdGVuY2lsVGVzdEZyb250KSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsRnVuY0Zyb250ID09PSBzdGF0ZS5zdGVuY2lsRnVuY0Zyb250KSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsUmVhZE1hc2tGcm9udCA9PT0gc3RhdGUuc3RlbmNpbFJlYWRNYXNrRnJvbnQpICYmXHJcbiAgICAgICAgICAgICh0aGlzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9PT0gc3RhdGUuc3RlbmNpbFdyaXRlTWFza0Zyb250KSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsRmFpbE9wRnJvbnQgPT09IHN0YXRlLnN0ZW5jaWxGYWlsT3BGcm9udCkgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RlbmNpbFpGYWlsT3BGcm9udCA9PT0gc3RhdGUuc3RlbmNpbFpGYWlsT3BGcm9udCkgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RlbmNpbFBhc3NPcEZyb250ID09PSBzdGF0ZS5zdGVuY2lsUGFzc09wRnJvbnQpICYmXHJcbiAgICAgICAgICAgICh0aGlzLnN0ZW5jaWxSZWZGcm9udCA9PT0gc3RhdGUuc3RlbmNpbFJlZkZyb250KSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsVGVzdEJhY2sgPT09IHN0YXRlLnN0ZW5jaWxUZXN0QmFjaykgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RlbmNpbEZ1bmNCYWNrID09PSBzdGF0ZS5zdGVuY2lsRnVuY0JhY2spICYmXHJcbiAgICAgICAgICAgICh0aGlzLnN0ZW5jaWxSZWFkTWFza0JhY2sgPT09IHN0YXRlLnN0ZW5jaWxSZWFkTWFza0JhY2spICYmXHJcbiAgICAgICAgICAgICh0aGlzLnN0ZW5jaWxXcml0ZU1hc2tCYWNrID09PSBzdGF0ZS5zdGVuY2lsV3JpdGVNYXNrQmFjaykgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RlbmNpbEZhaWxPcEJhY2sgPT09IHN0YXRlLnN0ZW5jaWxGYWlsT3BCYWNrKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsWkZhaWxPcEJhY2sgPT09IHN0YXRlLnN0ZW5jaWxaRmFpbE9wQmFjaykgJiZcclxuICAgICAgICAgICAgKHRoaXMuc3RlbmNpbFBhc3NPcEJhY2sgPT09IHN0YXRlLnN0ZW5jaWxQYXNzT3BCYWNrKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5zdGVuY2lsUmVmQmFjayA9PT0gc3RhdGUuc3RlbmNpbFJlZkJhY2spO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBibGVuZCB0YXJnZXQuXHJcbiAqIEB6aCBHRlgg5re35ZCI55uu5qCH44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR0ZYQmxlbmRUYXJnZXQge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBibGVuZDogYm9vbGVhbiA9IGZhbHNlLFxyXG4gICAgICAgIHB1YmxpYyBibGVuZFNyYzogR0ZYQmxlbmRGYWN0b3IgPSBHRlhCbGVuZEZhY3Rvci5PTkUsXHJcbiAgICAgICAgcHVibGljIGJsZW5kRHN0OiBHRlhCbGVuZEZhY3RvciA9IEdGWEJsZW5kRmFjdG9yLlpFUk8sXHJcbiAgICAgICAgcHVibGljIGJsZW5kRXE6IEdGWEJsZW5kT3AgPSBHRlhCbGVuZE9wLkFERCxcclxuICAgICAgICBwdWJsaWMgYmxlbmRTcmNBbHBoYTogR0ZYQmxlbmRGYWN0b3IgPSBHRlhCbGVuZEZhY3Rvci5PTkUsXHJcbiAgICAgICAgcHVibGljIGJsZW5kRHN0QWxwaGE6IEdGWEJsZW5kRmFjdG9yID0gR0ZYQmxlbmRGYWN0b3IuWkVSTyxcclxuICAgICAgICBwdWJsaWMgYmxlbmRBbHBoYUVxOiBHRlhCbGVuZE9wID0gR0ZYQmxlbmRPcC5BREQsXHJcbiAgICAgICAgcHVibGljIGJsZW5kQ29sb3JNYXNrOiBHRlhDb2xvck1hc2sgPSBHRlhDb2xvck1hc2suQUxMLFxyXG4gICAgKSB7fVxyXG5cclxuICAgIHB1YmxpYyBjb21wYXJlICh0YXJnZXQ6IEdGWEJsZW5kVGFyZ2V0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmJsZW5kID09PSB0YXJnZXQuYmxlbmQpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmJsZW5kU3JjID09PSB0YXJnZXQuYmxlbmRTcmMpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmJsZW5kRHN0ID09PSB0YXJnZXQuYmxlbmREc3QpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmJsZW5kRXEgPT09IHRhcmdldC5ibGVuZEVxKSAmJlxyXG4gICAgICAgICAgICAodGhpcy5ibGVuZFNyY0FscGhhID09PSB0YXJnZXQuYmxlbmRTcmNBbHBoYSkgJiZcclxuICAgICAgICAgICAgKHRoaXMuYmxlbmREc3RBbHBoYSA9PT0gdGFyZ2V0LmJsZW5kRHN0QWxwaGEpICYmXHJcbiAgICAgICAgICAgICh0aGlzLmJsZW5kQWxwaGFFcSA9PT0gdGFyZ2V0LmJsZW5kQWxwaGFFcSkgJiZcclxuICAgICAgICAgICAgKHRoaXMuYmxlbmRDb2xvck1hc2sgPT09IHRhcmdldC5ibGVuZENvbG9yTWFzayk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gR0ZYIGJsZW5kIHN0YXRlLlxyXG4gKiBAemggR0ZY5re35ZCI54q25oCB44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgR0ZYQmxlbmRTdGF0ZSB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGlzQTJDOiBib29sZWFuID0gZmFsc2UsXHJcbiAgICAgICAgcHVibGljIGlzSW5kZXBlbmQ6IGJvb2xlYW4gPSBmYWxzZSxcclxuICAgICAgICBwdWJsaWMgYmxlbmRDb2xvcjogR0ZYQ29sb3IgPSBuZXcgR0ZYQ29sb3IoKSxcclxuICAgICAgICBwdWJsaWMgdGFyZ2V0czogR0ZYQmxlbmRUYXJnZXRbXSA9IFtuZXcgR0ZYQmxlbmRUYXJnZXQoKV0sXHJcbiAgICApIHt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2hvdWxkIHVzZSB0aGlzIGZ1bmN0aW9uIHRvIHNldCB0YXJnZXQsIG9yIGl0IHdpbGwgbm90IHdvcmtcclxuICAgICAqIG9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGFzIG5hdGl2ZSBjYW4gbm90IHN1cHBvcnQgdGhpcyBmZWF0dXJlLFxyXG4gICAgICogc3VjaCBhcyBgYmxlbmRTdGF0ZVtpXSA9IHRhcmdldDtgLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggdG8gc2V0IHRhcmdldC5cclxuICAgICAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCB0byBiZSBzZXQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRUYXJnZXQgKGluZGV4OiBudW1iZXIsIHRhcmdldDogR0ZYQmxlbmRUYXJnZXQpIHtcclxuICAgICAgICB0aGlzLnRhcmdldHNbaW5kZXhdID0gdGFyZ2V0O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBpbnB1dCBzdGF0ZS5cclxuICogQHpoIEdGWCDovpPlhaXnirbmgIHjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHRlhJbnB1dFN0YXRlIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXSxcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdGWFBpcGVsaW5lU3RhdGVJbmZvIHtcclxuICAgIGRlY2xhcmUgcHJpdmF0ZSB0b2tlbjogbmV2ZXI7IC8vIHRvIG1ha2Ugc3VyZSBhbGwgdXNhZ2VzIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBleGFjdCBjbGFzcywgbm90IGFzc2VtYmxlZCBmcm9tIHBsYWluIG9iamVjdFxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChcclxuICAgICAgICBwdWJsaWMgc2hhZGVyOiBHRlhTaGFkZXIsXHJcbiAgICAgICAgcHVibGljIHBpcGVsaW5lTGF5b3V0OiBHRlhQaXBlbGluZUxheW91dCxcclxuICAgICAgICBwdWJsaWMgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcyxcclxuICAgICAgICBwdWJsaWMgaW5wdXRTdGF0ZTogR0ZYSW5wdXRTdGF0ZSxcclxuICAgICAgICBwdWJsaWMgcmFzdGVyaXplclN0YXRlOiBHRlhSYXN0ZXJpemVyU3RhdGUsXHJcbiAgICAgICAgcHVibGljIGRlcHRoU3RlbmNpbFN0YXRlOiBHRlhEZXB0aFN0ZW5jaWxTdGF0ZSxcclxuICAgICAgICBwdWJsaWMgYmxlbmRTdGF0ZTogR0ZYQmxlbmRTdGF0ZSxcclxuICAgICAgICBwdWJsaWMgcHJpbWl0aXZlOiBHRlhQcmltaXRpdmVNb2RlID0gR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9MSVNULFxyXG4gICAgICAgIHB1YmxpYyBkeW5hbWljU3RhdGVzOiBHRlhEeW5hbWljU3RhdGVGbGFncyA9IEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuTk9ORSxcclxuICAgICkge31cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHRlggcGlwZWxpbmUgc3RhdGUuXHJcbiAqIEB6aCBHRlgg566h57q/54q25oCB44CCXHJcbiAqL1xyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR0ZYUGlwZWxpbmVTdGF0ZSBleHRlbmRzIEdGWE9iamVjdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGN1cnJlbnQgc2hhZGVyLlxyXG4gICAgICogQHpoIEdGWCDnnYDoibLlmajjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHNoYWRlciAoKTogR0ZYU2hhZGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZGVyITtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBwaXBlbGluZSBsYXlvdXQuXHJcbiAgICAgKiBAemggR0ZYIOeuoee6v+W4g+WxgOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgcGlwZWxpbmVMYXlvdXQgKCk6IEdGWFBpcGVsaW5lTGF5b3V0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGlwZWxpbmVMYXlvdXQhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHByaW1pdHZlIG1vZGUuXHJcbiAgICAgKiBAemggR0ZYIOWbvuWFg+aooeW8j+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgcHJpbWl0aXZlICgpOiBHRlhQcmltaXRpdmVNb2RlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJpbWl0aXZlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHJhc3Rlcml6ZXIgc3RhdGUuXHJcbiAgICAgKiBAemggR0ZYIOWFieagheWMlueKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgcmFzdGVyaXplclN0YXRlICgpOiBHRlhSYXN0ZXJpemVyU3RhdGUge1xyXG4gICAgICAgIHJldHVybiAgdGhpcy5fcnMgYXMgR0ZYUmFzdGVyaXplclN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IGRlcHRoIHN0ZW5jaWwgc3RhdGUuXHJcbiAgICAgKiBAemggR0ZYIOa3seW6puaooeadv+eKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGVwdGhTdGVuY2lsU3RhdGUgKCk6IEdGWERlcHRoU3RlbmNpbFN0YXRlIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2RzcyBhcyBHRlhEZXB0aFN0ZW5jaWxTdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgY3VycmVudCBibGVuZCBzdGF0ZS5cclxuICAgICAqIEB6aCBHRlgg5re35ZCI54q25oCB44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBibGVuZFN0YXRlICgpOiBHRlhCbGVuZFN0YXRlIHtcclxuICAgICAgICByZXR1cm4gIHRoaXMuX2JzIGFzIEdGWEJsZW5kU3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGN1cnJlbnQgaW5wdXQgc3RhdGUuXHJcbiAgICAgKiBAemggR0ZYIOi+k+WFpeeKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgaW5wdXRTdGF0ZSAoKTogR0ZYSW5wdXRTdGF0ZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzIGFzIEdGWElucHV0U3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGN1cnJlbnQgZHluYW1pYyBzdGF0ZXMuXHJcbiAgICAgKiBAemggR0ZYIOWKqOaAgeeKtuaAgeaVsOe7hOOAglxyXG4gICAgICovXHJcbiAgICBnZXQgZHluYW1pY1N0YXRlcyAoKTogR0ZYRHluYW1pY1N0YXRlRmxhZ3Mge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9keW5hbWljU3RhdGVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBjdXJyZW50IHJlbmRlciBwYXNzLlxyXG4gICAgICogQHpoIEdGWCDmuLLmn5Pov4fnqIvjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHJlbmRlclBhc3MgKCk6IEdGWFJlbmRlclBhc3Mge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQYXNzIGFzIEdGWFJlbmRlclBhc3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kZXZpY2U6IEdGWERldmljZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRlcjogR0ZYU2hhZGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9waXBlbGluZUxheW91dDogR0ZYUGlwZWxpbmVMYXlvdXQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3ByaW1pdGl2ZTogR0ZYUHJpbWl0aXZlTW9kZSA9IEdGWFByaW1pdGl2ZU1vZGUuVFJJQU5HTEVfTElTVDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2lzOiBHRlhJbnB1dFN0YXRlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yczogR0ZYUmFzdGVyaXplclN0YXRlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kc3M6IEdGWERlcHRoU3RlbmNpbFN0YXRlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9iczogR0ZYQmxlbmRTdGF0ZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZHluYW1pY1N0YXRlczogR0ZYRHluYW1pY1N0YXRlRmxhZ3MgPSBHRlhEeW5hbWljU3RhdGVGbGFnQml0Lk5PTkU7XHJcblxyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGRldmljZTogR0ZYRGV2aWNlKSB7XHJcbiAgICAgICAgc3VwZXIoR0ZYT2JqZWN0VHlwZS5QSVBFTElORV9TVEFURSk7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gZGV2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhYnN0cmFjdCBpbml0aWFsaXplIChpbmZvOiBHRlhQaXBlbGluZVN0YXRlSW5mbyk6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGRlc3Ryb3kgKCk6IHZvaWQ7XHJcbn1cclxuIl19