(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../memop/cached-array.js", "../../platform/index.js", "../buffer.js", "../define.js", "../webgl/webgl-define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../memop/cached-array.js"), require("../../platform/index.js"), require("../buffer.js"), require("../define.js"), require("../webgl/webgl-define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cachedArray, global.index, global.buffer, global.define, global.webglDefine);
    global.webgl2Commands = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cachedArray, _index, _buffer, _define, _webglDefine) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXFormatToWebGLType = GFXFormatToWebGLType;
  _exports.GFXFormatToWebGLInternalFormat = GFXFormatToWebGLInternalFormat;
  _exports.GFXFormatToWebGLFormat = GFXFormatToWebGLFormat;
  _exports.WebGL2CmdFuncCreateBuffer = WebGL2CmdFuncCreateBuffer;
  _exports.WebGL2CmdFuncDestroyBuffer = WebGL2CmdFuncDestroyBuffer;
  _exports.WebGL2CmdFuncResizeBuffer = WebGL2CmdFuncResizeBuffer;
  _exports.WebGL2CmdFuncUpdateBuffer = WebGL2CmdFuncUpdateBuffer;
  _exports.WebGL2CmdFuncCreateTexture = WebGL2CmdFuncCreateTexture;
  _exports.WebGL2CmdFuncDestroyTexture = WebGL2CmdFuncDestroyTexture;
  _exports.WebGL2CmdFuncResizeTexture = WebGL2CmdFuncResizeTexture;
  _exports.WebGL2CmdFuncCreateSampler = WebGL2CmdFuncCreateSampler;
  _exports.WebGL2CmdFuncDestroySampler = WebGL2CmdFuncDestroySampler;
  _exports.WebGL2CmdFuncCreateFramebuffer = WebGL2CmdFuncCreateFramebuffer;
  _exports.WebGL2CmdFuncDestroyFramebuffer = WebGL2CmdFuncDestroyFramebuffer;
  _exports.WebGL2CmdFuncCreateShader = WebGL2CmdFuncCreateShader;
  _exports.WebGL2CmdFuncDestroyShader = WebGL2CmdFuncDestroyShader;
  _exports.WebGL2CmdFuncCreateInputAssember = WebGL2CmdFuncCreateInputAssember;
  _exports.WebGL2CmdFuncDestroyInputAssembler = WebGL2CmdFuncDestroyInputAssembler;
  _exports.WebGL2CmdFuncBeginRenderPass = WebGL2CmdFuncBeginRenderPass;
  _exports.WebGL2CmdFuncBindStates = WebGL2CmdFuncBindStates;
  _exports.WebGL2CmdFuncDraw = WebGL2CmdFuncDraw;
  _exports.WebGL2CmdFuncExecuteCmds = WebGL2CmdFuncExecuteCmds;
  _exports.WebGL2CmdFuncCopyTexImagesToTexture = WebGL2CmdFuncCopyTexImagesToTexture;
  _exports.WebGL2CmdFuncCopyBuffersToTexture = WebGL2CmdFuncCopyBuffersToTexture;
  _exports.WebGL2CmdFuncBlitFramebuffer = WebGL2CmdFuncBlitFramebuffer;
  _exports.WebGL2CmdPackage = _exports.WebGL2CmdCopyBufferToTexture = _exports.WebGL2CmdUpdateBuffer = _exports.WebGL2CmdDraw = _exports.WebGL2CmdBindStates = _exports.WebGL2CmdBeginRenderPass = _exports.WebGL2CmdObject = _exports.WebGL2Cmd = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var WebGLWraps = [0x2901, // WebGLRenderingContext.REPEAT
  0x8370, // WebGLRenderingContext.MIRRORED_REPEAT
  0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE
  0x812F // WebGLRenderingContext.CLAMP_TO_EDGE
  ];
  var SAMPLES = [1, 2, 4, 8, 16, 32, 64];

  var _f32v4 = new Float32Array(4); // tslint:disable: max-line-length


  function CmpF32NotEuqal(a, b) {
    var c = a - b;
    return c > 0.000001 || c < -0.000001;
  }

  function GFXFormatToWebGLType(format, gl) {
    switch (format) {
      case _define.GFXFormat.R8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.R8SN:
        return gl.BYTE;

      case _define.GFXFormat.R8UI:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.R8I:
        return gl.BYTE;

      case _define.GFXFormat.R16F:
        return gl.HALF_FLOAT;

      case _define.GFXFormat.R16UI:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.R16I:
        return gl.SHORT;

      case _define.GFXFormat.R32F:
        return gl.FLOAT;

      case _define.GFXFormat.R32UI:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.R32I:
        return gl.INT;

      case _define.GFXFormat.RG8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RG8SN:
        return gl.BYTE;

      case _define.GFXFormat.RG8UI:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RG8I:
        return gl.BYTE;

      case _define.GFXFormat.RG16F:
        return gl.HALF_FLOAT;

      case _define.GFXFormat.RG16UI:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.RG16I:
        return gl.SHORT;

      case _define.GFXFormat.RG32F:
        return gl.FLOAT;

      case _define.GFXFormat.RG32UI:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.RG32I:
        return gl.INT;

      case _define.GFXFormat.RGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.SRGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGB8SN:
        return gl.BYTE;

      case _define.GFXFormat.RGB8UI:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGB8I:
        return gl.BYTE;

      case _define.GFXFormat.RGB16F:
        return gl.HALF_FLOAT;

      case _define.GFXFormat.RGB16UI:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.RGB16I:
        return gl.SHORT;

      case _define.GFXFormat.RGB32F:
        return gl.FLOAT;

      case _define.GFXFormat.RGB32UI:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.RGB32I:
        return gl.INT;

      case _define.GFXFormat.BGRA8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGBA8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.SRGB8_A8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGBA8SN:
        return gl.BYTE;

      case _define.GFXFormat.RGBA8UI:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGBA8I:
        return gl.BYTE;

      case _define.GFXFormat.RGBA16F:
        return gl.HALF_FLOAT;

      case _define.GFXFormat.RGBA16UI:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.RGBA16I:
        return gl.SHORT;

      case _define.GFXFormat.RGBA32F:
        return gl.FLOAT;

      case _define.GFXFormat.RGBA32UI:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.RGBA32I:
        return gl.INT;

      case _define.GFXFormat.R5G6B5:
        return gl.UNSIGNED_SHORT_5_6_5;

      case _define.GFXFormat.R11G11B10F:
        return gl.UNSIGNED_INT_10F_11F_11F_REV;

      case _define.GFXFormat.RGB5A1:
        return gl.UNSIGNED_SHORT_5_5_5_1;

      case _define.GFXFormat.RGBA4:
        return gl.UNSIGNED_SHORT_4_4_4_4;

      case _define.GFXFormat.RGB10A2:
        return gl.UNSIGNED_INT_2_10_10_10_REV;

      case _define.GFXFormat.RGB10A2UI:
        return gl.UNSIGNED_INT_2_10_10_10_REV;

      case _define.GFXFormat.RGB9E5:
        return gl.FLOAT;

      case _define.GFXFormat.D16:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.D16S8:
        return gl.UNSIGNED_INT_24_8;
      // no D16S8 support

      case _define.GFXFormat.D24:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.D24S8:
        return gl.UNSIGNED_INT_24_8;

      case _define.GFXFormat.D32F:
        return gl.FLOAT;

      case _define.GFXFormat.D32F_S8:
        return gl.FLOAT_32_UNSIGNED_INT_24_8_REV;

      case _define.GFXFormat.BC1:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC1_SRGB:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC2:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC2_SRGB:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC3:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC3_SRGB:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC4:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC4_SNORM:
        return gl.BYTE;

      case _define.GFXFormat.BC5:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC5_SNORM:
        return gl.BYTE;

      case _define.GFXFormat.BC6H_SF16:
        return gl.FLOAT;

      case _define.GFXFormat.BC6H_UF16:
        return gl.FLOAT;

      case _define.GFXFormat.BC7:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.BC7_SRGB:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC_RGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_RGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_SRGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_RGB8_A1:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_SRGB8_A1:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_RGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ETC2_SRGB8:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.EAC_R11:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.EAC_R11SN:
        return gl.BYTE;

      case _define.GFXFormat.EAC_RG11:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.EAC_RG11SN:
        return gl.BYTE;

      case _define.GFXFormat.PVRTC_RGB2:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.PVRTC_RGBA2:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.PVRTC_RGB4:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.PVRTC_RGBA4:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.PVRTC2_2BPP:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.PVRTC2_4BPP:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.ASTC_RGBA_4x4:
      case _define.GFXFormat.ASTC_RGBA_5x4:
      case _define.GFXFormat.ASTC_RGBA_5x5:
      case _define.GFXFormat.ASTC_RGBA_6x5:
      case _define.GFXFormat.ASTC_RGBA_6x6:
      case _define.GFXFormat.ASTC_RGBA_8x5:
      case _define.GFXFormat.ASTC_RGBA_8x6:
      case _define.GFXFormat.ASTC_RGBA_8x8:
      case _define.GFXFormat.ASTC_RGBA_10x5:
      case _define.GFXFormat.ASTC_RGBA_10x6:
      case _define.GFXFormat.ASTC_RGBA_10x8:
      case _define.GFXFormat.ASTC_RGBA_10x10:
      case _define.GFXFormat.ASTC_RGBA_12x10:
      case _define.GFXFormat.ASTC_RGBA_12x12:
      case _define.GFXFormat.ASTC_SRGBA_4x4:
      case _define.GFXFormat.ASTC_SRGBA_5x4:
      case _define.GFXFormat.ASTC_SRGBA_5x5:
      case _define.GFXFormat.ASTC_SRGBA_6x5:
      case _define.GFXFormat.ASTC_SRGBA_6x6:
      case _define.GFXFormat.ASTC_SRGBA_8x5:
      case _define.GFXFormat.ASTC_SRGBA_8x6:
      case _define.GFXFormat.ASTC_SRGBA_8x8:
      case _define.GFXFormat.ASTC_SRGBA_10x5:
      case _define.GFXFormat.ASTC_SRGBA_10x6:
      case _define.GFXFormat.ASTC_SRGBA_10x8:
      case _define.GFXFormat.ASTC_SRGBA_10x10:
      case _define.GFXFormat.ASTC_SRGBA_12x10:
      case _define.GFXFormat.ASTC_SRGBA_12x12:
        return gl.UNSIGNED_BYTE;

      default:
        {
          return gl.UNSIGNED_BYTE;
        }
    }
  }

  function GFXFormatToWebGLInternalFormat(format, gl) {
    switch (format) {
      case _define.GFXFormat.A8:
        return gl.ALPHA;

      case _define.GFXFormat.L8:
        return gl.LUMINANCE;

      case _define.GFXFormat.LA8:
        return gl.LUMINANCE_ALPHA;

      case _define.GFXFormat.R8:
        return gl.R8;

      case _define.GFXFormat.R8SN:
        return gl.R8_SNORM;

      case _define.GFXFormat.R8UI:
        return gl.R8UI;

      case _define.GFXFormat.R8I:
        return gl.R8I;

      case _define.GFXFormat.RG8:
        return gl.RG8;

      case _define.GFXFormat.RG8SN:
        return gl.RG8_SNORM;

      case _define.GFXFormat.RG8UI:
        return gl.RG8UI;

      case _define.GFXFormat.RG8I:
        return gl.RG8I;

      case _define.GFXFormat.RGB8:
        return gl.RGB8;

      case _define.GFXFormat.RGB8SN:
        return gl.RGB8_SNORM;

      case _define.GFXFormat.RGB8UI:
        return gl.RGB8UI;

      case _define.GFXFormat.RGB8I:
        return gl.RGB8I;

      case _define.GFXFormat.BGRA8:
        return gl.RGBA8;

      case _define.GFXFormat.RGBA8:
        return gl.RGBA8;

      case _define.GFXFormat.RGBA8SN:
        return gl.RGBA8_SNORM;

      case _define.GFXFormat.RGBA8UI:
        return gl.RGBA8UI;

      case _define.GFXFormat.RGBA8I:
        return gl.RGBA8I;

      case _define.GFXFormat.R16I:
        return gl.R16I;

      case _define.GFXFormat.R16UI:
        return gl.R16UI;

      case _define.GFXFormat.R16F:
        return gl.R16F;

      case _define.GFXFormat.RG16I:
        return gl.RG16I;

      case _define.GFXFormat.RG16UI:
        return gl.RG16UI;

      case _define.GFXFormat.RG16F:
        return gl.RG16F;

      case _define.GFXFormat.RGB16I:
        return gl.RGB16I;

      case _define.GFXFormat.RGB16UI:
        return gl.RGB16UI;

      case _define.GFXFormat.RGB16F:
        return gl.RGB16F;

      case _define.GFXFormat.RGBA16I:
        return gl.RGBA16I;

      case _define.GFXFormat.RGBA16UI:
        return gl.RGBA16UI;

      case _define.GFXFormat.RGBA16F:
        return gl.RGBA16F;

      case _define.GFXFormat.R32I:
        return gl.R32I;

      case _define.GFXFormat.R32UI:
        return gl.R32UI;

      case _define.GFXFormat.R32F:
        return gl.R32F;

      case _define.GFXFormat.RG32I:
        return gl.RG32I;

      case _define.GFXFormat.RG32UI:
        return gl.RG32UI;

      case _define.GFXFormat.RG32F:
        return gl.RG32F;

      case _define.GFXFormat.RGB32I:
        return gl.RGB32I;

      case _define.GFXFormat.RGB32UI:
        return gl.RGB32UI;

      case _define.GFXFormat.RGB32F:
        return gl.RGB32F;

      case _define.GFXFormat.RGBA32I:
        return gl.RGBA32I;

      case _define.GFXFormat.RGBA32UI:
        return gl.RGBA32UI;

      case _define.GFXFormat.RGBA32F:
        return gl.RGBA32F;

      case _define.GFXFormat.R5G6B5:
        return gl.RGB565;

      case _define.GFXFormat.RGB5A1:
        return gl.RGB5_A1;

      case _define.GFXFormat.RGBA4:
        return gl.RGBA4;

      case _define.GFXFormat.RGB10A2:
        return gl.RGB10_A2;

      case _define.GFXFormat.RGB10A2UI:
        return gl.RGB10_A2UI;

      case _define.GFXFormat.R11G11B10F:
        return gl.R11F_G11F_B10F;

      case _define.GFXFormat.D16:
        return gl.DEPTH_COMPONENT16;

      case _define.GFXFormat.D16S8:
        return gl.DEPTH24_STENCIL8;
      // no D16S8 support

      case _define.GFXFormat.D24:
        return gl.DEPTH_COMPONENT24;

      case _define.GFXFormat.D24S8:
        return gl.DEPTH24_STENCIL8;

      case _define.GFXFormat.D32F:
        return gl.DEPTH_COMPONENT32F;

      case _define.GFXFormat.D32F_S8:
        return gl.DEPTH32F_STENCIL8;

      case _define.GFXFormat.BC1:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_ALPHA:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_SRGB_ALPHA:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;

      case _define.GFXFormat.BC2_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;

      case _define.GFXFormat.BC3:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;

      case _define.GFXFormat.BC3_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

      case _define.GFXFormat.ETC_RGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

      case _define.GFXFormat.ETC2_RGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB8_ETC2;

      case _define.GFXFormat.ETC2_SRGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ETC2;

      case _define.GFXFormat.ETC2_RGB8_A1:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;

      case _define.GFXFormat.ETC2_SRGB8_A1:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;

      case _define.GFXFormat.ETC2_RGBA8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA8_ETC2_EAC;

      case _define.GFXFormat.ETC2_SRGB8_A8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;

      case _define.GFXFormat.EAC_R11:
        return _webglDefine.WebGLEXT.COMPRESSED_R11_EAC;

      case _define.GFXFormat.EAC_R11SN:
        return _webglDefine.WebGLEXT.COMPRESSED_SIGNED_R11_EAC;

      case _define.GFXFormat.EAC_RG11:
        return _webglDefine.WebGLEXT.COMPRESSED_RG11_EAC;

      case _define.GFXFormat.EAC_RG11SN:
        return _webglDefine.WebGLEXT.COMPRESSED_SIGNED_RG11_EAC;

      case _define.GFXFormat.PVRTC_RGB2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGBA2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGB4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGBA4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

      case _define.GFXFormat.ASTC_RGBA_4x4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_4x4_KHR;

      case _define.GFXFormat.ASTC_RGBA_5x4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_5x4_KHR;

      case _define.GFXFormat.ASTC_RGBA_5x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_5x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_6x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_6x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_6x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_6x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x8_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x8_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x10:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x10_KHR;

      case _define.GFXFormat.ASTC_RGBA_12x10:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_12x10_KHR;

      case _define.GFXFormat.ASTC_RGBA_12x12:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_12x12_KHR;

      case _define.GFXFormat.ASTC_SRGBA_4x4:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;

      case _define.GFXFormat.ASTC_SRGBA_5x4:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;

      case _define.GFXFormat.ASTC_SRGBA_5x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_6x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_6x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x10:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;

      case _define.GFXFormat.ASTC_SRGBA_12x10:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;

      case _define.GFXFormat.ASTC_SRGBA_12x12:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

      default:
        {
          console.error('Unsupported GFXFormat, convert to WebGL internal format failed.');
          return gl.RGBA;
        }
    }
  }

  function GFXFormatToWebGLFormat(format, gl) {
    switch (format) {
      case _define.GFXFormat.A8:
        return gl.ALPHA;

      case _define.GFXFormat.L8:
        return gl.LUMINANCE;

      case _define.GFXFormat.LA8:
        return gl.LUMINANCE_ALPHA;

      case _define.GFXFormat.R8:
      case _define.GFXFormat.R8SN:
        return gl.RED;

      case _define.GFXFormat.R8UI:
      case _define.GFXFormat.R8I:
        return gl.RED;

      case _define.GFXFormat.RG8:
      case _define.GFXFormat.RG8SN:
      case _define.GFXFormat.RG8UI:
      case _define.GFXFormat.RG8I:
        return gl.RG;

      case _define.GFXFormat.RGB8:
      case _define.GFXFormat.RGB8SN:
      case _define.GFXFormat.RGB8UI:
      case _define.GFXFormat.RGB8I:
        return gl.RGB;

      case _define.GFXFormat.BGRA8:
      case _define.GFXFormat.RGBA8:
      case _define.GFXFormat.RGBA8SN:
      case _define.GFXFormat.RGBA8UI:
      case _define.GFXFormat.RGBA8I:
        return gl.RGBA;

      case _define.GFXFormat.R16UI:
      case _define.GFXFormat.R16I:
      case _define.GFXFormat.R16F:
        return gl.RED;

      case _define.GFXFormat.RG16UI:
      case _define.GFXFormat.RG16I:
      case _define.GFXFormat.RG16F:
        return gl.RG;

      case _define.GFXFormat.RGB16UI:
      case _define.GFXFormat.RGB16I:
      case _define.GFXFormat.RGB16F:
        return gl.RGB;

      case _define.GFXFormat.RGBA16UI:
      case _define.GFXFormat.RGBA16I:
      case _define.GFXFormat.RGBA16F:
        return gl.RGBA;

      case _define.GFXFormat.R32UI:
      case _define.GFXFormat.R32I:
      case _define.GFXFormat.R32F:
        return gl.RED;

      case _define.GFXFormat.RG32UI:
      case _define.GFXFormat.RG32I:
      case _define.GFXFormat.RG32F:
        return gl.RG;

      case _define.GFXFormat.RGB32UI:
      case _define.GFXFormat.RGB32I:
      case _define.GFXFormat.RGB32F:
        return gl.RGB;

      case _define.GFXFormat.RGBA32UI:
      case _define.GFXFormat.RGBA32I:
      case _define.GFXFormat.RGBA32F:
        return gl.RGBA;

      case _define.GFXFormat.RGB10A2:
        return gl.RGBA;

      case _define.GFXFormat.R11G11B10F:
        return gl.RGB;

      case _define.GFXFormat.R5G6B5:
        return gl.RGB;

      case _define.GFXFormat.RGB5A1:
        return gl.RGBA;

      case _define.GFXFormat.RGBA4:
        return gl.RGBA;

      case _define.GFXFormat.D16:
        return gl.DEPTH_COMPONENT;

      case _define.GFXFormat.D16S8:
        return gl.DEPTH_STENCIL;

      case _define.GFXFormat.D24:
        return gl.DEPTH_COMPONENT;

      case _define.GFXFormat.D24S8:
        return gl.DEPTH_STENCIL;

      case _define.GFXFormat.D32F:
        return gl.DEPTH_COMPONENT;

      case _define.GFXFormat.D32F_S8:
        return gl.DEPTH_STENCIL;

      case _define.GFXFormat.BC1:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_ALPHA:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC1_SRGB_ALPHA:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;

      case _define.GFXFormat.BC2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;

      case _define.GFXFormat.BC2_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;

      case _define.GFXFormat.BC3:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;

      case _define.GFXFormat.BC3_SRGB:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

      case _define.GFXFormat.ETC_RGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

      case _define.GFXFormat.ETC2_RGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB8_ETC2;

      case _define.GFXFormat.ETC2_SRGB8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ETC2;

      case _define.GFXFormat.ETC2_RGB8_A1:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;

      case _define.GFXFormat.ETC2_SRGB8_A1:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;

      case _define.GFXFormat.ETC2_RGBA8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA8_ETC2_EAC;

      case _define.GFXFormat.ETC2_SRGB8_A8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;

      case _define.GFXFormat.EAC_R11:
        return _webglDefine.WebGLEXT.COMPRESSED_R11_EAC;

      case _define.GFXFormat.EAC_R11SN:
        return _webglDefine.WebGLEXT.COMPRESSED_SIGNED_R11_EAC;

      case _define.GFXFormat.EAC_RG11:
        return _webglDefine.WebGLEXT.COMPRESSED_RG11_EAC;

      case _define.GFXFormat.EAC_RG11SN:
        return _webglDefine.WebGLEXT.COMPRESSED_SIGNED_RG11_EAC;

      case _define.GFXFormat.PVRTC_RGB2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGBA2:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGB4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;

      case _define.GFXFormat.PVRTC_RGBA4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

      case _define.GFXFormat.ASTC_RGBA_4x4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_4x4_KHR;

      case _define.GFXFormat.ASTC_RGBA_5x4:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_5x4_KHR;

      case _define.GFXFormat.ASTC_RGBA_5x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_5x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_6x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_6x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_6x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_6x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_8x8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_8x8_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x5:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x5_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x6:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x6_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x8:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x8_KHR;

      case _define.GFXFormat.ASTC_RGBA_10x10:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_10x10_KHR;

      case _define.GFXFormat.ASTC_RGBA_12x10:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_12x10_KHR;

      case _define.GFXFormat.ASTC_RGBA_12x12:
        return _webglDefine.WebGLEXT.COMPRESSED_RGBA_ASTC_12x12_KHR;

      case _define.GFXFormat.ASTC_SRGBA_4x4:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;

      case _define.GFXFormat.ASTC_SRGBA_5x4:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;

      case _define.GFXFormat.ASTC_SRGBA_5x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_6x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_6x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_8x8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x5:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x6:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x8:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;

      case _define.GFXFormat.ASTC_SRGBA_10x10:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;

      case _define.GFXFormat.ASTC_SRGBA_12x10:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;

      case _define.GFXFormat.ASTC_SRGBA_12x12:
        return _webglDefine.WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

      default:
        {
          console.error('Unsupported GFXFormat, convert to WebGL format failed.');
          return gl.RGBA;
        }
    }
  }

  function GFXTypeToWebGLType(type, gl) {
    switch (type) {
      case _define.GFXType.BOOL:
        return gl.BOOL;

      case _define.GFXType.BOOL2:
        return gl.BOOL_VEC2;

      case _define.GFXType.BOOL3:
        return gl.BOOL_VEC3;

      case _define.GFXType.BOOL4:
        return gl.BOOL_VEC4;

      case _define.GFXType.INT:
        return gl.INT;

      case _define.GFXType.INT2:
        return gl.INT_VEC2;

      case _define.GFXType.INT3:
        return gl.INT_VEC3;

      case _define.GFXType.INT4:
        return gl.INT_VEC4;

      case _define.GFXType.UINT:
        return gl.UNSIGNED_INT;

      case _define.GFXType.FLOAT:
        return gl.FLOAT;

      case _define.GFXType.FLOAT2:
        return gl.FLOAT_VEC2;

      case _define.GFXType.FLOAT3:
        return gl.FLOAT_VEC3;

      case _define.GFXType.FLOAT4:
        return gl.FLOAT_VEC4;

      case _define.GFXType.MAT2:
        return gl.FLOAT_MAT2;

      case _define.GFXType.MAT2X3:
        return gl.FLOAT_MAT2x3;

      case _define.GFXType.MAT2X4:
        return gl.FLOAT_MAT2x4;

      case _define.GFXType.MAT3X2:
        return gl.FLOAT_MAT3x2;

      case _define.GFXType.MAT3:
        return gl.FLOAT_MAT3;

      case _define.GFXType.MAT3X4:
        return gl.FLOAT_MAT3x4;

      case _define.GFXType.MAT4X2:
        return gl.FLOAT_MAT4x2;

      case _define.GFXType.MAT4X3:
        return gl.FLOAT_MAT4x3;

      case _define.GFXType.MAT4:
        return gl.FLOAT_MAT4;

      case _define.GFXType.SAMPLER2D:
        return gl.SAMPLER_2D;

      case _define.GFXType.SAMPLER2D_ARRAY:
        return gl.SAMPLER_2D_ARRAY;

      case _define.GFXType.SAMPLER3D:
        return gl.SAMPLER_3D;

      case _define.GFXType.SAMPLER_CUBE:
        return gl.SAMPLER_CUBE;

      default:
        {
          console.error('Unsupported GLType, convert to GL type failed.');
          return _define.GFXType.UNKNOWN;
        }
    }
  }

  function WebGLTypeToGFXType(glType, gl) {
    switch (glType) {
      case gl.BOOL:
        return _define.GFXType.BOOL;

      case gl.BOOL_VEC2:
        return _define.GFXType.BOOL2;

      case gl.BOOL_VEC3:
        return _define.GFXType.BOOL3;

      case gl.BOOL_VEC4:
        return _define.GFXType.BOOL4;

      case gl.INT:
        return _define.GFXType.INT;

      case gl.INT_VEC2:
        return _define.GFXType.INT2;

      case gl.INT_VEC3:
        return _define.GFXType.INT3;

      case gl.INT_VEC4:
        return _define.GFXType.INT4;

      case gl.UNSIGNED_INT:
        return _define.GFXType.UINT;

      case gl.UNSIGNED_INT_VEC2:
        return _define.GFXType.UINT2;

      case gl.UNSIGNED_INT_VEC3:
        return _define.GFXType.UINT3;

      case gl.UNSIGNED_INT_VEC4:
        return _define.GFXType.UINT4;

      case gl.UNSIGNED_INT:
        return _define.GFXType.UINT;

      case gl.FLOAT:
        return _define.GFXType.FLOAT;

      case gl.FLOAT_VEC2:
        return _define.GFXType.FLOAT2;

      case gl.FLOAT_VEC3:
        return _define.GFXType.FLOAT3;

      case gl.FLOAT_VEC4:
        return _define.GFXType.FLOAT4;

      case gl.FLOAT_MAT2:
        return _define.GFXType.MAT2;

      case gl.FLOAT_MAT2x3:
        return _define.GFXType.MAT2X3;

      case gl.FLOAT_MAT2x4:
        return _define.GFXType.MAT2X4;

      case gl.FLOAT_MAT3x2:
        return _define.GFXType.MAT3X2;

      case gl.FLOAT_MAT3:
        return _define.GFXType.MAT3;

      case gl.FLOAT_MAT3x4:
        return _define.GFXType.MAT3X4;

      case gl.FLOAT_MAT4x2:
        return _define.GFXType.MAT4X2;

      case gl.FLOAT_MAT4x3:
        return _define.GFXType.MAT4X3;

      case gl.FLOAT_MAT4:
        return _define.GFXType.MAT4;

      case gl.SAMPLER_2D:
        return _define.GFXType.SAMPLER2D;

      case gl.SAMPLER_2D_ARRAY:
        return _define.GFXType.SAMPLER2D_ARRAY;

      case gl.SAMPLER_3D:
        return _define.GFXType.SAMPLER3D;

      case gl.SAMPLER_CUBE:
        return _define.GFXType.SAMPLER_CUBE;

      default:
        {
          console.error('Unsupported GLType, convert to GFXType failed.');
          return _define.GFXType.UNKNOWN;
        }
    }
  }

  function WebGLGetTypeSize(glType, gl) {
    switch (glType) {
      case gl.BOOL:
        return 4;

      case gl.BOOL_VEC2:
        return 8;

      case gl.BOOL_VEC3:
        return 12;

      case gl.BOOL_VEC4:
        return 16;

      case gl.INT:
        return 4;

      case gl.INT_VEC2:
        return 8;

      case gl.INT_VEC3:
        return 12;

      case gl.INT_VEC4:
        return 16;

      case gl.UNSIGNED_INT:
        return 4;

      case gl.UNSIGNED_INT_VEC2:
        return 8;

      case gl.UNSIGNED_INT_VEC3:
        return 12;

      case gl.UNSIGNED_INT_VEC4:
        return 16;

      case gl.FLOAT:
        return 4;

      case gl.FLOAT_VEC2:
        return 8;

      case gl.FLOAT_VEC3:
        return 12;

      case gl.FLOAT_VEC4:
        return 16;

      case gl.FLOAT_MAT2:
        return 16;

      case gl.FLOAT_MAT2x3:
        return 24;

      case gl.FLOAT_MAT2x4:
        return 32;

      case gl.FLOAT_MAT3x2:
        return 24;

      case gl.FLOAT_MAT3:
        return 36;

      case gl.FLOAT_MAT3x4:
        return 48;

      case gl.FLOAT_MAT4x2:
        return 32;

      case gl.FLOAT_MAT4x3:
        return 48;

      case gl.FLOAT_MAT4:
        return 64;

      case gl.SAMPLER_2D:
        return 4;

      case gl.SAMPLER_2D_ARRAY:
        return 4;

      case gl.SAMPLER_2D_ARRAY_SHADOW:
        return 4;

      case gl.SAMPLER_3D:
        return 4;

      case gl.SAMPLER_CUBE:
        return 4;

      case gl.INT_SAMPLER_2D:
        return 4;

      case gl.INT_SAMPLER_2D_ARRAY:
        return 4;

      case gl.INT_SAMPLER_3D:
        return 4;

      case gl.INT_SAMPLER_CUBE:
        return 4;

      case gl.UNSIGNED_INT_SAMPLER_2D:
        return 4;

      case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY:
        return 4;

      case gl.UNSIGNED_INT_SAMPLER_3D:
        return 4;

      case gl.UNSIGNED_INT_SAMPLER_CUBE:
        return 4;

      default:
        {
          console.error('Unsupported GLType, get type failed.');
          return 0;
        }
    }
  }

  function WebGLGetComponentCount(glType, gl) {
    switch (glType) {
      case gl.FLOAT_MAT2:
        return 2;

      case gl.FLOAT_MAT2x3:
        return 2;

      case gl.FLOAT_MAT2x4:
        return 2;

      case gl.FLOAT_MAT3x2:
        return 3;

      case gl.FLOAT_MAT3:
        return 3;

      case gl.FLOAT_MAT3x4:
        return 3;

      case gl.FLOAT_MAT4x2:
        return 4;

      case gl.FLOAT_MAT4x3:
        return 4;

      case gl.FLOAT_MAT4:
        return 4;

      default:
        {
          return 1;
        }
    }
  }

  var WebGLCmpFuncs = [0x0200, // WebGLRenderingContext.NEVER,
  0x0201, // WebGLRenderingContext.LESS,
  0x0202, // WebGLRenderingContext.EQUAL,
  0x0203, // WebGLRenderingContext.LEQUAL,
  0x0204, // WebGLRenderingContext.GREATER,
  0x0205, // WebGLRenderingContext.NOTEQUAL,
  0x0206, // WebGLRenderingContext.GEQUAL,
  0x0207 // WebGLRenderingContext.ALWAYS,
  ];
  var WebGLStencilOps = [0x0000, // WebGLRenderingContext.ZERO,
  0x1E00, // WebGLRenderingContext.KEEP,
  0x1E01, // WebGLRenderingContext.REPLACE,
  0x1E02, // WebGLRenderingContext.INCR,
  0x1E03, // WebGLRenderingContext.DECR,
  0x150A, // WebGLRenderingContext.INVERT,
  0x8507, // WebGLRenderingContext.INCR_WRAP,
  0x8508 // WebGLRenderingContext.DECR_WRAP,
  ];
  var WebGLBlendOps = [0x8006, // WebGLRenderingContext.FUNC_ADD,
  0x800A, // WebGLRenderingContext.FUNC_SUBTRACT,
  0x800B, // WebGLRenderingContext.FUNC_REVERSE_SUBTRACT,
  0x8006, // WebGLRenderingContext.FUNC_ADD,
  0x8006 // WebGLRenderingContext.FUNC_ADD,
  ];
  var WebGLBlendFactors = [0x0000, // WebGLRenderingContext.ZERO,
  0x0001, // WebGLRenderingContext.ONE,
  0x0302, // WebGLRenderingContext.SRC_ALPHA,
  0x0304, // WebGLRenderingContext.DST_ALPHA,
  0x0303, // WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
  0x0305, // WebGLRenderingContext.ONE_MINUS_DST_ALPHA,
  0x0300, // WebGLRenderingContext.SRC_COLOR,
  0x0306, // WebGLRenderingContext.DST_COLOR,
  0x0301, // WebGLRenderingContext.ONE_MINUS_SRC_COLOR,
  0x0307, // WebGLRenderingContext.ONE_MINUS_DST_COLOR,
  0x0308, // WebGLRenderingContext.SRC_ALPHA_SATURATE,
  0x8001, // WebGLRenderingContext.CONSTANT_COLOR,
  0x8002, // WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR,
  0x8003, // WebGLRenderingContext.CONSTANT_ALPHA,
  0x8004 // WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA,
  ];
  var WebGL2Cmd;
  _exports.WebGL2Cmd = WebGL2Cmd;

  (function (WebGL2Cmd) {
    WebGL2Cmd[WebGL2Cmd["BEGIN_RENDER_PASS"] = 0] = "BEGIN_RENDER_PASS";
    WebGL2Cmd[WebGL2Cmd["END_RENDER_PASS"] = 1] = "END_RENDER_PASS";
    WebGL2Cmd[WebGL2Cmd["BIND_STATES"] = 2] = "BIND_STATES";
    WebGL2Cmd[WebGL2Cmd["DRAW"] = 3] = "DRAW";
    WebGL2Cmd[WebGL2Cmd["UPDATE_BUFFER"] = 4] = "UPDATE_BUFFER";
    WebGL2Cmd[WebGL2Cmd["COPY_BUFFER_TO_TEXTURE"] = 5] = "COPY_BUFFER_TO_TEXTURE";
    WebGL2Cmd[WebGL2Cmd["COUNT"] = 6] = "COUNT";
  })(WebGL2Cmd || (_exports.WebGL2Cmd = WebGL2Cmd = {}));

  var WebGL2CmdObject = function WebGL2CmdObject(type) {
    _classCallCheck(this, WebGL2CmdObject);

    this.cmdType = void 0;
    this.refCount = 0;
    this.cmdType = type;
  };

  _exports.WebGL2CmdObject = WebGL2CmdObject;

  var WebGL2CmdBeginRenderPass = /*#__PURE__*/function (_WebGL2CmdObject) {
    _inherits(WebGL2CmdBeginRenderPass, _WebGL2CmdObject);

    function WebGL2CmdBeginRenderPass() {
      var _this;

      _classCallCheck(this, WebGL2CmdBeginRenderPass);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WebGL2CmdBeginRenderPass).call(this, WebGL2Cmd.BEGIN_RENDER_PASS));
      _this.gpuRenderPass = null;
      _this.gpuFramebuffer = null;
      _this.renderArea = new _define.GFXRect();
      _this.clearColors = [];
      _this.clearDepth = 1.0;
      _this.clearStencil = 0;
      return _this;
    }

    _createClass(WebGL2CmdBeginRenderPass, [{
      key: "clear",
      value: function clear() {
        this.gpuFramebuffer = null;
        this.clearColors.length = 0;
      }
    }]);

    return WebGL2CmdBeginRenderPass;
  }(WebGL2CmdObject);

  _exports.WebGL2CmdBeginRenderPass = WebGL2CmdBeginRenderPass;

  var WebGL2CmdBindStates = /*#__PURE__*/function (_WebGL2CmdObject2) {
    _inherits(WebGL2CmdBindStates, _WebGL2CmdObject2);

    function WebGL2CmdBindStates() {
      var _this2;

      _classCallCheck(this, WebGL2CmdBindStates);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(WebGL2CmdBindStates).call(this, WebGL2Cmd.BIND_STATES));
      _this2.gpuPipelineState = null;
      _this2.gpuInputAssembler = null;
      _this2.gpuDescriptorSets = [];
      _this2.dynamicOffsets = [];
      _this2.viewport = null;
      _this2.scissor = null;
      _this2.lineWidth = null;
      _this2.depthBias = null;
      _this2.blendConstants = [];
      _this2.depthBounds = null;
      _this2.stencilWriteMask = null;
      _this2.stencilCompareMask = null;
      return _this2;
    }

    _createClass(WebGL2CmdBindStates, [{
      key: "clear",
      value: function clear() {
        this.gpuPipelineState = null;
        this.gpuInputAssembler = null;
        this.gpuDescriptorSets.length = 0;
        this.dynamicOffsets.length = 0;
        this.viewport = null;
        this.scissor = null;
        this.lineWidth = null;
        this.depthBias = null;
        this.blendConstants.length = 0;
        this.depthBounds = null;
        this.stencilWriteMask = null;
        this.stencilCompareMask = null;
      }
    }]);

    return WebGL2CmdBindStates;
  }(WebGL2CmdObject);

  _exports.WebGL2CmdBindStates = WebGL2CmdBindStates;

  var WebGL2CmdDraw = /*#__PURE__*/function (_WebGL2CmdObject3) {
    _inherits(WebGL2CmdDraw, _WebGL2CmdObject3);

    function WebGL2CmdDraw() {
      var _this3;

      _classCallCheck(this, WebGL2CmdDraw);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(WebGL2CmdDraw).call(this, WebGL2Cmd.DRAW));
      _this3.drawInfo = new _buffer.GFXDrawInfo();
      return _this3;
    }

    _createClass(WebGL2CmdDraw, [{
      key: "clear",
      value: function clear() {}
    }]);

    return WebGL2CmdDraw;
  }(WebGL2CmdObject);

  _exports.WebGL2CmdDraw = WebGL2CmdDraw;

  var WebGL2CmdUpdateBuffer = /*#__PURE__*/function (_WebGL2CmdObject4) {
    _inherits(WebGL2CmdUpdateBuffer, _WebGL2CmdObject4);

    function WebGL2CmdUpdateBuffer() {
      var _this4;

      _classCallCheck(this, WebGL2CmdUpdateBuffer);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(WebGL2CmdUpdateBuffer).call(this, WebGL2Cmd.UPDATE_BUFFER));
      _this4.gpuBuffer = null;
      _this4.buffer = null;
      _this4.offset = 0;
      _this4.size = 0;
      return _this4;
    }

    _createClass(WebGL2CmdUpdateBuffer, [{
      key: "clear",
      value: function clear() {
        this.gpuBuffer = null;
        this.buffer = null;
      }
    }]);

    return WebGL2CmdUpdateBuffer;
  }(WebGL2CmdObject);

  _exports.WebGL2CmdUpdateBuffer = WebGL2CmdUpdateBuffer;

  var WebGL2CmdCopyBufferToTexture = /*#__PURE__*/function (_WebGL2CmdObject5) {
    _inherits(WebGL2CmdCopyBufferToTexture, _WebGL2CmdObject5);

    function WebGL2CmdCopyBufferToTexture() {
      var _this5;

      _classCallCheck(this, WebGL2CmdCopyBufferToTexture);

      _this5 = _possibleConstructorReturn(this, _getPrototypeOf(WebGL2CmdCopyBufferToTexture).call(this, WebGL2Cmd.COPY_BUFFER_TO_TEXTURE));
      _this5.gpuTexture = null;
      _this5.buffers = [];
      _this5.regions = [];
      return _this5;
    }

    _createClass(WebGL2CmdCopyBufferToTexture, [{
      key: "clear",
      value: function clear() {
        this.gpuTexture = null;
        this.buffers.length = 0;
        this.regions.length = 0;
      }
    }]);

    return WebGL2CmdCopyBufferToTexture;
  }(WebGL2CmdObject);

  _exports.WebGL2CmdCopyBufferToTexture = WebGL2CmdCopyBufferToTexture;

  var WebGL2CmdPackage = /*#__PURE__*/function () {
    function WebGL2CmdPackage() {
      _classCallCheck(this, WebGL2CmdPackage);

      this.cmds = new _cachedArray.CachedArray(1);
      this.beginRenderPassCmds = new _cachedArray.CachedArray(1);
      this.bindStatesCmds = new _cachedArray.CachedArray(1);
      this.drawCmds = new _cachedArray.CachedArray(1);
      this.updateBufferCmds = new _cachedArray.CachedArray(1);
      this.copyBufferToTextureCmds = new _cachedArray.CachedArray(1);
    }

    _createClass(WebGL2CmdPackage, [{
      key: "clearCmds",
      value: function clearCmds(allocator) {
        if (this.beginRenderPassCmds.length) {
          allocator.beginRenderPassCmdPool.freeCmds(this.beginRenderPassCmds);
          this.beginRenderPassCmds.clear();
        }

        if (this.bindStatesCmds.length) {
          allocator.bindStatesCmdPool.freeCmds(this.bindStatesCmds);
          this.bindStatesCmds.clear();
        }

        if (this.drawCmds.length) {
          allocator.drawCmdPool.freeCmds(this.drawCmds);
          this.drawCmds.clear();
        }

        if (this.updateBufferCmds.length) {
          allocator.updateBufferCmdPool.freeCmds(this.updateBufferCmds);
          this.updateBufferCmds.clear();
        }

        if (this.copyBufferToTextureCmds.length) {
          allocator.copyBufferToTextureCmdPool.freeCmds(this.copyBufferToTextureCmds);
          this.copyBufferToTextureCmds.clear();
        }

        this.cmds.clear();
      }
    }]);

    return WebGL2CmdPackage;
  }();

  _exports.WebGL2CmdPackage = WebGL2CmdPackage;

  function WebGL2CmdFuncCreateBuffer(device, gpuBuffer) {
    var gl = device.gl;
    var cache = device.stateCache;
    var glUsage = gpuBuffer.memUsage & _define.GFXMemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & _define.GFXBufferUsageBit.VERTEX) {
      gpuBuffer.glTarget = gl.ARRAY_BUFFER;
      var glBuffer = gl.createBuffer();

      if (glBuffer) {
        gpuBuffer.glBuffer = glBuffer;

        if (gpuBuffer.size > 0) {
          if (device.useVAO) {
            if (cache.glVAO) {
              gl.bindVertexArray(null);
              cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
          }

          if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
            device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
          }

          gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          device.stateCache.glArrayBuffer = null;
        }
      }
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDEX) {
      gpuBuffer.glTarget = gl.ELEMENT_ARRAY_BUFFER;

      var _glBuffer = gl.createBuffer();

      if (_glBuffer) {
        gpuBuffer.glBuffer = _glBuffer;

        if (gpuBuffer.size > 0) {
          if (device.useVAO) {
            if (cache.glVAO) {
              gl.bindVertexArray(null);
              cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
          }

          if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
            device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
          }

          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          device.stateCache.glElementArrayBuffer = null;
        }
      }
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.UNIFORM) {
      gpuBuffer.glTarget = gl.UNIFORM_BUFFER;

      var _glBuffer2 = gl.createBuffer();

      if (_glBuffer2 && gpuBuffer.size > 0) {
        gpuBuffer.glBuffer = _glBuffer2;

        if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
          gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
          device.stateCache.glUniformBuffer = gpuBuffer.glBuffer;
        }

        gl.bufferData(gl.UNIFORM_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        device.stateCache.glUniformBuffer = null;
      }
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDIRECT) {
      gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_DST) {
      gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_SRC) {
      gpuBuffer.glTarget = gl.NONE;
    } else {
      console.error('Unsupported GFXBufferType, create buffer failed.');
      gpuBuffer.glTarget = gl.NONE;
    }
  }

  function WebGL2CmdFuncDestroyBuffer(device, gpuBuffer) {
    var gl = device.gl;

    if (gpuBuffer.glBuffer) {
      // Firefox 75+ implicitly unbind whatever buffer there was on the slot sometimes
      // can be reproduced in the static batching scene at https://github.com/cocos-creator/test-cases-3d
      switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER:
          if (device.useVAO && device.stateCache.glVAO) {
            gl.bindVertexArray(null);
            device.stateCache.glVAO = gfxStateCache.gpuInputAssembler = null;
          }

          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          device.stateCache.glArrayBuffer = null;
          break;

        case gl.ELEMENT_ARRAY_BUFFER:
          if (device.useVAO && device.stateCache.glVAO) {
            gl.bindVertexArray(null);
            device.stateCache.glVAO = gfxStateCache.gpuInputAssembler = null;
          }

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          device.stateCache.glElementArrayBuffer = null;
          break;

        case gl.UNIFORM_BUFFER:
          gl.bindBuffer(gl.UNIFORM_BUFFER, null);
          device.stateCache.glUniformBuffer = null;
          break;
      }

      gl.deleteBuffer(gpuBuffer.glBuffer);
      gpuBuffer.glBuffer = null;
    }
  }

  function WebGL2CmdFuncResizeBuffer(device, gpuBuffer) {
    var gl = device.gl;
    var cache = device.stateCache;
    var glUsage = gpuBuffer.memUsage & _define.GFXMemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & _define.GFXBufferUsageBit.VERTEX) {
      if (device.useVAO) {
        if (cache.glVAO) {
          gl.bindVertexArray(null);
          cache.glVAO = gfxStateCache.gpuInputAssembler = null;
        }
      }

      if (cache.glArrayBuffer !== gpuBuffer.glBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
      }

      if (gpuBuffer.buffer) {
        gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      cache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDEX) {
      if (device.useVAO) {
        if (cache.glVAO) {
          gl.bindVertexArray(null);
          cache.glVAO = gfxStateCache.gpuInputAssembler = null;
        }
      }

      if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
      }

      if (gpuBuffer.buffer) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
      } else {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      device.stateCache.glElementArrayBuffer = null;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.UNIFORM) {
      if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
        gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
      }

      gl.bufferData(gl.UNIFORM_BUFFER, gpuBuffer.size, glUsage);
      gl.bindBuffer(gl.UNIFORM_BUFFER, null);
      device.stateCache.glUniformBuffer = null;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDIRECT || gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_DST || gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_SRC) {
      gpuBuffer.glTarget = gl.NONE;
    } else {
      console.error('Unsupported GFXBufferType, create buffer failed.');
      gpuBuffer.glTarget = gl.NONE;
    }
  }

  function WebGL2CmdFuncUpdateBuffer(device, gpuBuffer, buffer, offset, size) {
    if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDIRECT) {
      gpuBuffer.indirects.length = offset;
      Array.prototype.push.apply(gpuBuffer.indirects, buffer.drawInfos);
    } else {
      var buff = buffer;
      var gl = device.gl;
      var cache = device.stateCache;

      switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER:
          {
            if (cache.glVAO) {
              gl.bindVertexArray(null);
              cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }

            if (cache.glArrayBuffer !== gpuBuffer.glBuffer) {
              gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
              cache.glArrayBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
              gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
              gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
            }

            break;
          }

        case gl.ELEMENT_ARRAY_BUFFER:
          {
            if (cache.glVAO) {
              gl.bindVertexArray(null);
              cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }

            if (cache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
              cache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
              gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
              gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
            }

            break;
          }

        case gl.UNIFORM_BUFFER:
          {
            if (cache.glUniformBuffer !== gpuBuffer.glBuffer) {
              gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
              cache.glUniformBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
              gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
              gl.bufferSubData(gpuBuffer.glTarget, offset, new Float32Array(buff, 0, size / 4));
            }

            break;
          }

        default:
          {
            console.error('Unsupported GFXBufferType, update buffer failed.');
            return;
          }
      }
    }
  }

  function WebGL2CmdFuncCreateTexture(device, gpuTexture) {
    var gl = device.gl;
    gpuTexture.glInternalFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format, gl);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, gl);
    var w = gpuTexture.width;
    var h = gpuTexture.height;

    switch (gpuTexture.type) {
      case _define.GFXTextureType.TEX2D:
        {
          gpuTexture.glTarget = gl.TEXTURE_2D;
          var maxSize = Math.max(w, h);

          if (maxSize > device.maxTextureSize) {
            (0, _index.errorID)(9100, maxSize, device.maxTextureSize);
          }

          if (gpuTexture.samples === _define.GFXSampleCount.X1) {
            var glTexture = gl.createTexture();

            if (glTexture && gpuTexture.size > 0) {
              gpuTexture.glTexture = glTexture;
              var glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

              if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
              }

              if (!_define.GFXFormatInfos[gpuTexture.format].isCompressed) {
                for (var i = 0; i < gpuTexture.mipLevel; ++i) {
                  gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                  w = Math.max(1, w >> 1);
                  h = Math.max(1, h >> 1);
                }
              } else {
                if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                  for (var _i = 0; _i < gpuTexture.mipLevel; ++_i) {
                    var imgSize = (0, _define.GFXFormatSize)(gpuTexture.format, w, h, 1);
                    var view = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_2D, _i, gpuTexture.glInternalFmt, w, h, 0, view);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                  }
                } else {
                  // init 2 x 2 texture
                  var _imgSize = (0, _define.GFXFormatSize)(gpuTexture.format, 2, 2, 1);

                  var _view = new Uint8Array(_imgSize);

                  gl.compressedTexImage2D(gl.TEXTURE_2D, 0, gpuTexture.glInternalFmt, 2, 2, 0, _view);
                }
              }
              /*
              if (gpuTexture.isPowerOf2) {
                  gpuTexture.glWrapS = gl.REPEAT;
                  gpuTexture.glWrapT = gl.REPEAT;
              } else {
                  gpuTexture.glWrapS = gl.CLAMP_TO_EDGE;
                  gpuTexture.glWrapT = gl.CLAMP_TO_EDGE;
              }
              gpuTexture.glMinFilter = gl.LINEAR;
              gpuTexture.glMagFilter = gl.LINEAR;
              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, gpuTexture.glWrapS);
              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, gpuTexture.glWrapT);
              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
              */

            } else {
              gl.deleteTexture(glTexture);
            }
          } else {
            var glRenderbuffer = gl.createRenderbuffer();

            if (glRenderbuffer && gpuTexture.size > 0) {
              gpuTexture.glRenderbuffer = glRenderbuffer;

              if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
              }

              gl.renderbufferStorageMultisample(gl.RENDERBUFFER, SAMPLES[gpuTexture.samples], gpuTexture.glInternalFmt, gpuTexture.width, gpuTexture.height);
            }
          }

          break;
        }

      case _define.GFXTextureType.CUBE:
        {
          gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

          var _maxSize = Math.max(w, h);

          if (_maxSize > device.maxCubeMapTextureSize) {
            (0, _index.errorID)(9100, _maxSize, device.maxTextureSize);
          }

          var _glTexture = gl.createTexture();

          if (_glTexture && gpuTexture.size > 0) {
            gpuTexture.glTexture = _glTexture;
            var _glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (_glTexUnit.glTexture !== gpuTexture.glTexture) {
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
              _glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (!_define.GFXFormatInfos[gpuTexture.format].isCompressed) {
              for (var f = 0; f < 6; ++f) {
                w = gpuTexture.width;
                h = gpuTexture.height;

                for (var _i2 = 0; _i2 < gpuTexture.mipLevel; ++_i2) {
                  gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _i2, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                  w = Math.max(1, w >> 1);
                  h = Math.max(1, h >> 1);
                }
              }
            } else {
              if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                for (var _f = 0; _f < 6; ++_f) {
                  w = gpuTexture.width;
                  h = gpuTexture.height;

                  for (var _i3 = 0; _i3 < gpuTexture.mipLevel; ++_i3) {
                    var _imgSize2 = (0, _define.GFXFormatSize)(gpuTexture.format, w, h, 1);

                    var _view2 = new Uint8Array(_imgSize2);

                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + _f, _i3, gpuTexture.glInternalFmt, w, h, 0, _view2);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                  }
                }
              } else {
                for (var _f2 = 0; _f2 < 6; ++_f2) {
                  var _imgSize3 = (0, _define.GFXFormatSize)(gpuTexture.format, 2, 2, 1);

                  var _view3 = new Uint8Array(_imgSize3);

                  gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + _f2, 0, gpuTexture.glInternalFmt, 2, 2, 0, _view3);
                }
              }
            }
            /*
            if (gpuTexture.isPowerOf2) {
                gpuTexture.glWrapS = gl.REPEAT;
                gpuTexture.glWrapT = gl.REPEAT;
            } else {
                gpuTexture.glWrapS = gl.CLAMP_TO_EDGE;
                gpuTexture.glWrapT = gl.CLAMP_TO_EDGE;
            }
            gpuTexture.glMinFilter = gl.LINEAR;
            gpuTexture.glMagFilter = gl.LINEAR;
              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, gpuTexture.glWrapS);
            gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, gpuTexture.glWrapT);
            gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
            gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
            */

          }

          break;
        }

      default:
        {
          console.error('Unsupported GFXTextureType, create texture failed.');
          gpuTexture.type = _define.GFXTextureType.TEX2D;
          gpuTexture.glTarget = gl.TEXTURE_2D;
        }
    }
  }

  function WebGL2CmdFuncDestroyTexture(device, gpuTexture) {
    if (gpuTexture.glTexture) {
      device.gl.deleteTexture(gpuTexture.glTexture);
      gpuTexture.glTexture = null;
    }

    if (gpuTexture.glRenderbuffer) {
      device.gl.deleteRenderbuffer(gpuTexture.glRenderbuffer);
      gpuTexture.glRenderbuffer = null;
    }
  }

  function WebGL2CmdFuncResizeTexture(device, gpuTexture) {
    var gl = device.gl;
    gpuTexture.glInternalFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format, gl);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, gl);
    var w = gpuTexture.width;
    var h = gpuTexture.height;

    switch (gpuTexture.type) {
      case _define.GFXTextureType.TEX2D:
        {
          gpuTexture.glTarget = gl.TEXTURE_2D;
          var maxSize = Math.max(w, h);

          if (maxSize > device.maxTextureSize) {
            (0, _index.errorID)(9100, maxSize, device.maxTextureSize);
          }

          if (gpuTexture.samples === _define.GFXSampleCount.X1) {
            var glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
              gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
              glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (!_define.GFXFormatInfos[gpuTexture.format].isCompressed) {
              for (var i = 0; i < gpuTexture.mipLevel; ++i) {
                gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                w = Math.max(1, w >> 1);
                h = Math.max(1, h >> 1);
              }
            } else {
              if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                for (var _i4 = 0; _i4 < gpuTexture.mipLevel; ++_i4) {
                  var imgSize = (0, _define.GFXFormatSize)(gpuTexture.format, w, h, 1);
                  var view = new Uint8Array(imgSize);
                  gl.compressedTexImage2D(gl.TEXTURE_2D, _i4, gpuTexture.glInternalFmt, w, h, 0, view);
                  w = Math.max(1, w >> 1);
                  h = Math.max(1, h >> 1);
                }
              }
            }
          } else {
            var glRenderbuffer = gl.createRenderbuffer();

            if (glRenderbuffer && gpuTexture.size > 0) {
              gpuTexture.glRenderbuffer = glRenderbuffer;

              if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
              }

              gl.renderbufferStorageMultisample(gl.RENDERBUFFER, SAMPLES[gpuTexture.samples], gpuTexture.glInternalFmt, gpuTexture.width, gpuTexture.height);
            }
          }

          break;
        }

      case _define.GFXTextureType.CUBE:
        {
          gpuTexture.type = _define.GFXTextureType.CUBE;
          gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

          var _maxSize2 = Math.max(w, h);

          if (_maxSize2 > device.maxCubeMapTextureSize) {
            (0, _index.errorID)(9100, _maxSize2, device.maxTextureSize);
          }

          var _glTexUnit2 = device.stateCache.glTexUnits[device.stateCache.texUnit];

          if (_glTexUnit2.glTexture !== gpuTexture.glTexture) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
            _glTexUnit2.glTexture = gpuTexture.glTexture;
          }

          if (!_define.GFXFormatInfos[gpuTexture.format].isCompressed) {
            for (var f = 0; f < 6; ++f) {
              w = gpuTexture.width;
              h = gpuTexture.height;

              for (var _i5 = 0; _i5 < gpuTexture.mipLevel; ++_i5) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _i5, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                w = Math.max(1, w >> 1);
                h = Math.max(1, h >> 1);
              }
            }
          } else {
            if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
              for (var _f3 = 0; _f3 < 6; ++_f3) {
                w = gpuTexture.width;
                h = gpuTexture.height;

                for (var _i6 = 0; _i6 < gpuTexture.mipLevel; ++_i6) {
                  var _imgSize4 = (0, _define.GFXFormatSize)(gpuTexture.format, w, h, 1);

                  var _view4 = new Uint8Array(_imgSize4);

                  gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + _f3, _i6, gpuTexture.glInternalFmt, w, h, 0, _view4);
                  w = Math.max(1, w >> 1);
                  h = Math.max(1, h >> 1);
                }
              }
            }
          }

          break;
        }

      default:
        {
          console.error('Unsupported GFXTextureType, create texture failed.');
          gpuTexture.type = _define.GFXTextureType.TEX2D;
          gpuTexture.glTarget = gl.TEXTURE_2D;
        }
    }
  }

  function WebGL2CmdFuncCreateSampler(device, gpuSampler) {
    var gl = device.gl;
    var glSampler = gl.createSampler();

    if (glSampler) {
      if (gpuSampler.minFilter === _define.GFXFilter.LINEAR || gpuSampler.minFilter === _define.GFXFilter.ANISOTROPIC) {
        if (gpuSampler.mipFilter === _define.GFXFilter.LINEAR || gpuSampler.mipFilter === _define.GFXFilter.ANISOTROPIC) {
          gpuSampler.glMinFilter = gl.LINEAR_MIPMAP_LINEAR;
        } else if (gpuSampler.mipFilter === _define.GFXFilter.POINT) {
          gpuSampler.glMinFilter = gl.LINEAR_MIPMAP_NEAREST;
        } else {
          gpuSampler.glMinFilter = gl.LINEAR;
        }
      } else {
        if (gpuSampler.mipFilter === _define.GFXFilter.LINEAR || gpuSampler.mipFilter === _define.GFXFilter.ANISOTROPIC) {
          gpuSampler.glMinFilter = gl.NEAREST_MIPMAP_LINEAR;
        } else if (gpuSampler.mipFilter === _define.GFXFilter.POINT) {
          gpuSampler.glMinFilter = gl.NEAREST_MIPMAP_NEAREST;
        } else {
          gpuSampler.glMinFilter = gl.NEAREST;
        }
      }

      if (gpuSampler.magFilter === _define.GFXFilter.LINEAR || gpuSampler.magFilter === _define.GFXFilter.ANISOTROPIC) {
        gpuSampler.glMagFilter = gl.LINEAR;
      } else {
        gpuSampler.glMagFilter = gl.NEAREST;
      }

      gpuSampler.glWrapS = WebGLWraps[gpuSampler.addressU];
      gpuSampler.glWrapT = WebGLWraps[gpuSampler.addressV];
      gpuSampler.glWrapR = WebGLWraps[gpuSampler.addressW];
      gpuSampler.glSampler = glSampler;
      gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, gpuSampler.glMinFilter);
      gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
      gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, gpuSampler.glWrapS);
      gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, gpuSampler.glWrapT);
      gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, gpuSampler.glWrapR);
      gl.samplerParameterf(glSampler, gl.TEXTURE_MIN_LOD, gpuSampler.minLOD);
      gl.samplerParameterf(glSampler, gl.TEXTURE_MAX_LOD, gpuSampler.maxLOD);
    }
  }

  function WebGL2CmdFuncDestroySampler(device, gpuSampler) {
    if (gpuSampler.glSampler) {
      device.gl.deleteSampler(gpuSampler.glSampler);
      gpuSampler.glSampler = null;
    }
  }

  function WebGL2CmdFuncCreateFramebuffer(device, gpuFramebuffer) {
    if (!gpuFramebuffer.gpuColorTextures.length && !gpuFramebuffer.gpuDepthStencilTexture) {
      return;
    } // onscreen fbo


    var gl = device.gl;
    var attachments = [];
    var glFramebuffer = gl.createFramebuffer();

    if (glFramebuffer) {
      gpuFramebuffer.glFramebuffer = glFramebuffer;

      if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
      }

      for (var i = 0; i < gpuFramebuffer.gpuColorTextures.length; ++i) {
        var colorTexture = gpuFramebuffer.gpuColorTextures[i];

        if (colorTexture) {
          if (colorTexture.glTexture) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, colorTexture.glTarget, colorTexture.glTexture, 0); // level should be 0.
          } else {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.RENDERBUFFER, colorTexture.glRenderbuffer);
          }

          attachments.push(gl.COLOR_ATTACHMENT0 + i);
        }
      }

      var dst = gpuFramebuffer.gpuDepthStencilTexture;

      if (dst) {
        var glAttachment = _define.GFXFormatInfos[dst.format].hasStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;

        if (dst.glTexture) {
          gl.framebufferTexture2D(gl.FRAMEBUFFER, glAttachment, dst.glTarget, dst.glTexture, 0); // level must be 0
        } else {
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, glAttachment, gl.RENDERBUFFER, dst.glRenderbuffer);
        }
      }

      gl.drawBuffers(attachments);
      var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        switch (status) {
          case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            {
              console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
              break;
            }

          case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            {
              console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
              break;
            }

          case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            {
              console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
              break;
            }

          case gl.FRAMEBUFFER_UNSUPPORTED:
            {
              console.error('glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED');
              break;
            }

          default:
        }
      }

      if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, device.stateCache.glFramebuffer);
      }
    }
  }

  function WebGL2CmdFuncDestroyFramebuffer(device, gpuFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
      device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
      gpuFramebuffer.glFramebuffer = null;
    }
  }

  function WebGL2CmdFuncCreateShader(device, gpuShader) {
    var gl = device.gl;

    var _loop = function _loop(k) {
      var gpuStage = gpuShader.gpuStages[k];
      var glShaderType = 0;
      var shaderTypeStr = '';
      var lineNumber = 1;

      switch (gpuStage.type) {
        case _define.GFXShaderStageFlagBit.VERTEX:
          {
            shaderTypeStr = 'VertexShader';
            glShaderType = gl.VERTEX_SHADER;
            break;
          }

        case _define.GFXShaderStageFlagBit.FRAGMENT:
          {
            shaderTypeStr = 'FragmentShader';
            glShaderType = gl.FRAGMENT_SHADER;
            break;
          }

        default:
          {
            console.error('Unsupported GFXShaderType.');
            return {
              v: void 0
            };
          }
      }

      var glShader = gl.createShader(glShaderType);

      if (glShader) {
        gpuStage.glShader = glShader;
        gl.shaderSource(gpuStage.glShader, '#version 300 es\n' + gpuStage.source);
        gl.compileShader(gpuStage.glShader);

        if (!gl.getShaderParameter(gpuStage.glShader, gl.COMPILE_STATUS)) {
          console.error(shaderTypeStr + ' in \'' + gpuShader.name + '\' compilation failed.');
          console.error('Shader source dump:', gpuStage.source.replace(/^|\n/g, function () {
            return "\n".concat(lineNumber++, " ");
          }));
          console.error(gl.getShaderInfoLog(gpuStage.glShader));

          for (var l = 0; l < gpuShader.gpuStages.length; l++) {
            var stage = gpuShader.gpuStages[k];

            if (stage.glShader) {
              gl.deleteShader(stage.glShader);
              stage.glShader = null;
            }
          }

          return {
            v: void 0
          };
        }
      }
    };

    for (var k = 0; k < gpuShader.gpuStages.length; k++) {
      var _ret = _loop(k);

      if (_typeof(_ret) === "object") return _ret.v;
    }

    var glProgram = gl.createProgram();

    if (!glProgram) {
      return;
    }

    gpuShader.glProgram = glProgram; // link program

    for (var _k = 0; _k < gpuShader.gpuStages.length; _k++) {
      var gpuStage = gpuShader.gpuStages[_k];
      gl.attachShader(gpuShader.glProgram, gpuStage.glShader);
    }

    gl.linkProgram(gpuShader.glProgram); // detach & delete immediately

    for (var _k2 = 0; _k2 < gpuShader.gpuStages.length; _k2++) {
      var _gpuStage = gpuShader.gpuStages[_k2];

      if (_gpuStage.glShader) {
        gl.detachShader(gpuShader.glProgram, _gpuStage.glShader);
        gl.deleteShader(_gpuStage.glShader);
        _gpuStage.glShader = null;
      }
    }

    if (gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS)) {
      console.info('Shader \'' + gpuShader.name + '\' compilation succeeded.');
    } else {
      console.error('Failed to link shader \'' + gpuShader.name + '\'.');
      console.error(gl.getProgramInfoLog(gpuShader.glProgram));
      return;
    } // parse inputs


    var activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array(activeAttribCount);

    for (var i = 0; i < activeAttribCount; ++i) {
      var attribInfo = gl.getActiveAttrib(gpuShader.glProgram, i);

      if (attribInfo) {
        var varName = void 0;
        var nameOffset = attribInfo.name.indexOf('[');

        if (nameOffset !== -1) {
          varName = attribInfo.name.substr(0, nameOffset);
        } else {
          varName = attribInfo.name;
        }

        var glLoc = gl.getAttribLocation(gpuShader.glProgram, varName);
        var type = WebGLTypeToGFXType(attribInfo.type, gl);
        var stride = WebGLGetTypeSize(attribInfo.type, gl);
        gpuShader.glInputs[i] = {
          name: varName,
          type: type,
          stride: stride,
          count: attribInfo.size,
          size: stride * attribInfo.size,
          glType: attribInfo.type,
          glLoc: glLoc
        };
      }
    } // create uniform blocks


    var activeBlockCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORM_BLOCKS);
    var blockName;
    var blockIdx;
    var blockSize;
    var block;

    if (activeBlockCount) {
      gpuShader.glBlocks = new Array(activeBlockCount);

      for (var b = 0; b < activeBlockCount; ++b) {
        blockName = gl.getActiveUniformBlockName(gpuShader.glProgram, b);

        var _nameOffset = blockName.indexOf('[');

        if (_nameOffset !== -1) {
          blockName = blockName.substr(0, _nameOffset);
        } // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);


        block = null;

        for (var _k3 = 0; _k3 < gpuShader.blocks.length; _k3++) {
          if (gpuShader.blocks[_k3].name === blockName) {
            block = gpuShader.blocks[_k3];
            break;
          }
        }

        if (!block) {
          (0, _index.error)("Block '".concat(blockName, "' does not bound"));
        } else {
          // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);
          blockIdx = b;
          blockSize = gl.getActiveUniformBlockParameter(gpuShader.glProgram, blockIdx, gl.UNIFORM_BLOCK_DATA_SIZE);
          var glBinding = block.binding + (device.bindingMappingInfo.bufferOffsets[block.set] || 0);
          gl.uniformBlockBinding(gpuShader.glProgram, blockIdx, glBinding);
          gpuShader.glBlocks[b] = {
            set: block.set,
            binding: block.binding,
            idx: blockIdx,
            name: blockName,
            size: blockSize,
            glBinding: glBinding
          };
        }
      }
    } // create uniform samplers


    if (gpuShader.samplers.length > 0) {
      gpuShader.glSamplers = new Array(gpuShader.samplers.length);

      for (var _i7 = 0; _i7 < gpuShader.samplers.length; ++_i7) {
        var sampler = gpuShader.samplers[_i7];
        gpuShader.glSamplers[_i7] = {
          set: sampler.set,
          binding: sampler.binding,
          name: sampler.name,
          type: sampler.type,
          count: sampler.count,
          units: [],
          glUnits: null,
          glType: GFXTypeToWebGLType(sampler.type, gl),
          glLoc: null
        };
      }
    } // texture unit index mapping optimization


    var glActiveSamplers = [];
    var glActiveSamplerLocations = [];
    var bindingMappingInfo = device.bindingMappingInfo;
    var texUnitCacheMap = device.stateCache.texUnitCacheMap;
    var flexibleSetBaseOffset = 0;

    for (var _i8 = 0; _i8 < gpuShader.blocks.length; ++_i8) {
      if (gpuShader.blocks[_i8].set === bindingMappingInfo.flexibleSet) {
        flexibleSetBaseOffset++;
      }
    }

    var arrayOffset = 0;

    for (var _i9 = 0; _i9 < gpuShader.samplers.length; ++_i9) {
      var _sampler = gpuShader.samplers[_i9];

      var _glLoc = gl.getUniformLocation(gpuShader.glProgram, _sampler.name);

      if (_glLoc) {
        glActiveSamplers.push(gpuShader.glSamplers[_i9]);
        glActiveSamplerLocations.push(_glLoc);
      }

      if (texUnitCacheMap[_sampler.name] === undefined) {
        var binding = _sampler.binding + bindingMappingInfo.samplerOffsets[_sampler.set] + arrayOffset;
        if (_sampler.set === bindingMappingInfo.flexibleSet) binding -= flexibleSetBaseOffset;
        texUnitCacheMap[_sampler.name] = binding % device.maxTextureUnits;
        arrayOffset += _sampler.count - 1;
      }
    }

    if (glActiveSamplers.length) {
      var usedTexUnits = []; // try to reuse existing mappings first

      for (var _i10 = 0; _i10 < glActiveSamplers.length; ++_i10) {
        var glSampler = glActiveSamplers[_i10];
        var cachedUnit = texUnitCacheMap[glSampler.name];

        if (cachedUnit !== undefined) {
          glSampler.glLoc = glActiveSamplerLocations[_i10];

          for (var t = 0; t < glSampler.count; ++t) {
            while (usedTexUnits[cachedUnit]) {
              cachedUnit = (cachedUnit + 1) % device.maxTextureUnits;
            }

            glSampler.units.push(cachedUnit);
            usedTexUnits[cachedUnit] = true;
          }
        }
      } // fill in the rest sequencially


      var unitIdx = 0;

      for (var _i11 = 0; _i11 < glActiveSamplers.length; ++_i11) {
        var _glSampler = glActiveSamplers[_i11];

        if (!_glSampler.glLoc) {
          _glSampler.glLoc = glActiveSamplerLocations[_i11];

          while (usedTexUnits[unitIdx]) {
            unitIdx++;
          }

          for (var _t = 0; _t < _glSampler.count; ++_t) {
            while (usedTexUnits[unitIdx]) {
              unitIdx = (unitIdx + 1) % device.maxTextureUnits;
            }

            if (texUnitCacheMap[_glSampler.name] === undefined) {
              texUnitCacheMap[_glSampler.name] = unitIdx;
            }

            _glSampler.units.push(unitIdx);

            usedTexUnits[unitIdx] = true;
          }
        }
      }

      if (device.stateCache.glProgram !== gpuShader.glProgram) {
        gl.useProgram(gpuShader.glProgram);
      }

      for (var _k4 = 0; _k4 < glActiveSamplers.length; _k4++) {
        var _glSampler2 = glActiveSamplers[_k4];
        _glSampler2.glUnits = new Int32Array(_glSampler2.units);
        gl.uniform1iv(_glSampler2.glLoc, _glSampler2.glUnits);
      }

      if (device.stateCache.glProgram !== gpuShader.glProgram) {
        gl.useProgram(device.stateCache.glProgram);
      }
    }

    gpuShader.glSamplers = glActiveSamplers;
  }

  function WebGL2CmdFuncDestroyShader(device, gpuShader) {
    if (gpuShader.glProgram) {
      device.gl.deleteProgram(gpuShader.glProgram);
      gpuShader.glProgram = null;
    }
  }

  function WebGL2CmdFuncCreateInputAssember(device, gpuInputAssembler) {
    var gl = device.gl;
    gpuInputAssembler.glAttribs = new Array(gpuInputAssembler.attributes.length);
    var offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < gpuInputAssembler.attributes.length; ++i) {
      var attrib = gpuInputAssembler.attributes[i];
      var stream = attrib.stream !== undefined ? attrib.stream : 0; // if (stream < gpuInputAssembler.gpuVertexBuffers.length) {

      var gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];
      var glType = GFXFormatToWebGLType(attrib.format, gl);
      var size = _define.GFXFormatInfos[attrib.format].size;
      gpuInputAssembler.glAttribs[i] = {
        name: attrib.name,
        glBuffer: gpuBuffer.glBuffer,
        glType: glType,
        size: size,
        count: _define.GFXFormatInfos[attrib.format].count,
        stride: gpuBuffer.stride,
        componentCount: WebGLGetComponentCount(glType, gl),
        isNormalized: attrib.isNormalized !== undefined ? attrib.isNormalized : false,
        isInstanced: attrib.isInstanced !== undefined ? attrib.isInstanced : false,
        offset: offsets[stream]
      };
      offsets[stream] += size;
    }
  }

  function WebGL2CmdFuncDestroyInputAssembler(device, gpuInputAssembler) {
    var it = gpuInputAssembler.glVAOs.values();
    var res = it.next();

    while (!res.done) {
      device.gl.deleteVertexArray(res.value);
      res = it.next();
    }

    gpuInputAssembler.glVAOs.clear();
  }

  var gfxStateCache = {
    gpuPipelineState: null,
    gpuInputAssembler: null,
    reverseCW: false,
    glPrimitive: 0,
    invalidateAttachments: []
  };

  function WebGL2CmdFuncBeginRenderPass(device, gpuRenderPass, gpuFramebuffer, renderArea, clearColors, clearDepth, clearStencil) {
    var gl = device.gl;
    var cache = device.stateCache;
    var clears = 0;

    if (gpuFramebuffer && gpuRenderPass) {
      if (cache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
        cache.glFramebuffer = gpuFramebuffer.glFramebuffer; // render targets are drawn with flipped-Y

        var reverseCW = !!gpuFramebuffer.glFramebuffer;

        if (reverseCW !== gfxStateCache.reverseCW) {
          gfxStateCache.reverseCW = reverseCW;
          var isCCW = !device.stateCache.rs.isFrontFaceCCW;
          gl.frontFace(isCCW ? gl.CCW : gl.CW);
          device.stateCache.rs.isFrontFaceCCW = isCCW;
        }
      }

      if (cache.viewport.left !== renderArea.x || cache.viewport.top !== renderArea.y || cache.viewport.width !== renderArea.width || cache.viewport.height !== renderArea.height) {
        gl.viewport(renderArea.x, renderArea.y, renderArea.width, renderArea.height);
        cache.viewport.left = renderArea.x;
        cache.viewport.top = renderArea.y;
        cache.viewport.width = renderArea.width;
        cache.viewport.height = renderArea.height;
      }

      if (cache.scissorRect.x !== renderArea.x || cache.scissorRect.y !== renderArea.y || cache.scissorRect.width !== renderArea.width || cache.scissorRect.height !== renderArea.height) {
        gl.scissor(renderArea.x, renderArea.y, renderArea.width, renderArea.height);
        cache.scissorRect.x = renderArea.x;
        cache.scissorRect.y = renderArea.y;
        cache.scissorRect.width = renderArea.width;
        cache.scissorRect.height = renderArea.height;
      }

      gfxStateCache.invalidateAttachments.length = 0;

      for (var j = 0; j < clearColors.length; ++j) {
        var colorAttachment = gpuRenderPass.colorAttachments[j];

        if (colorAttachment.format !== _define.GFXFormat.UNKNOWN) {
          switch (colorAttachment.loadOp) {
            case _define.GFXLoadOp.LOAD:
              break;
            // GL default behavior

            case _define.GFXLoadOp.CLEAR:
              {
                if (cache.bs.targets[0].blendColorMask !== _define.GFXColorMask.ALL) {
                  gl.colorMask(true, true, true, true);
                }

                if (!gpuFramebuffer.isOffscreen) {
                  var clearColor = clearColors[0];
                  gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
                  clears |= gl.COLOR_BUFFER_BIT;
                } else {
                  _f32v4[0] = clearColors[j].x;
                  _f32v4[1] = clearColors[j].y;
                  _f32v4[2] = clearColors[j].z;
                  _f32v4[3] = clearColors[j].w;
                  gl.clearBufferfv(gl.COLOR, j, _f32v4);
                }

                break;
              }

            case _define.GFXLoadOp.DISCARD:
              {
                // invalidate the framebuffer
                gfxStateCache.invalidateAttachments.push(gl.COLOR_ATTACHMENT0 + j);
                break;
              }

            default:
          }
        }
      } // if (curGPURenderPass)


      if (gpuRenderPass.depthStencilAttachment) {
        if (gpuRenderPass.depthStencilAttachment.format !== _define.GFXFormat.UNKNOWN) {
          switch (gpuRenderPass.depthStencilAttachment.depthLoadOp) {
            case _define.GFXLoadOp.LOAD:
              break;
            // GL default behavior

            case _define.GFXLoadOp.CLEAR:
              {
                if (!cache.dss.depthWrite) {
                  gl.depthMask(true);
                }

                gl.clearDepth(clearDepth);
                clears |= gl.DEPTH_BUFFER_BIT;
                break;
              }

            case _define.GFXLoadOp.DISCARD:
              {
                // invalidate the framebuffer
                gfxStateCache.invalidateAttachments.push(gl.DEPTH_ATTACHMENT);
                break;
              }

            default:
          }

          if (_define.GFXFormatInfos[gpuRenderPass.depthStencilAttachment.format].hasStencil) {
            switch (gpuRenderPass.depthStencilAttachment.stencilLoadOp) {
              case _define.GFXLoadOp.LOAD:
                break;
              // GL default behavior

              case _define.GFXLoadOp.CLEAR:
                {
                  if (!cache.dss.stencilWriteMaskFront) {
                    gl.stencilMaskSeparate(gl.FRONT, 0xffff);
                  }

                  if (!cache.dss.stencilWriteMaskBack) {
                    gl.stencilMaskSeparate(gl.BACK, 0xffff);
                  }

                  gl.clearStencil(clearStencil);
                  clears |= gl.STENCIL_BUFFER_BIT;
                  break;
                }

              case _define.GFXLoadOp.DISCARD:
                {
                  // invalidate the framebuffer
                  gfxStateCache.invalidateAttachments.push(gl.STENCIL_ATTACHMENT);
                  break;
                }

              default:
            }
          }
        }
      } // if (curGPURenderPass.depthStencilAttachment)


      if (gpuFramebuffer.glFramebuffer && gfxStateCache.invalidateAttachments.length) {
        gl.invalidateFramebuffer(gl.FRAMEBUFFER, gfxStateCache.invalidateAttachments);
      }

      if (clears) {
        gl.clear(clears);
      } // restore states


      if (clears & gl.COLOR_BUFFER_BIT) {
        var colorMask = cache.bs.targets[0].blendColorMask;

        if (colorMask !== _define.GFXColorMask.ALL) {
          var r = (colorMask & _define.GFXColorMask.R) !== _define.GFXColorMask.NONE;
          var g = (colorMask & _define.GFXColorMask.G) !== _define.GFXColorMask.NONE;
          var b = (colorMask & _define.GFXColorMask.B) !== _define.GFXColorMask.NONE;
          var a = (colorMask & _define.GFXColorMask.A) !== _define.GFXColorMask.NONE;
          gl.colorMask(r, g, b, a);
        }
      }

      if (clears & gl.DEPTH_BUFFER_BIT && !cache.dss.depthWrite) {
        gl.depthMask(false);
      }

      if (clears & gl.STENCIL_BUFFER_BIT) {
        if (!cache.dss.stencilWriteMaskFront) {
          gl.stencilMaskSeparate(gl.FRONT, 0);
        }

        if (!cache.dss.stencilWriteMaskBack) {
          gl.stencilMaskSeparate(gl.BACK, 0);
        }
      }
    } // if (gpuFramebuffer)

  }

  function WebGL2CmdFuncBindStates(device, gpuPipelineState, gpuInputAssembler, gpuDescriptorSets, dynamicOffsets, viewport, scissor, lineWidth, depthBias, blendConstants, depthBounds, stencilWriteMask, stencilCompareMask) {
    var gl = device.gl;
    var cache = device.stateCache;
    var gpuShader = gpuPipelineState && gpuPipelineState.gpuShader;
    var isShaderChanged = false; // bind pipeline

    if (gpuPipelineState && gfxStateCache.gpuPipelineState !== gpuPipelineState) {
      gfxStateCache.gpuPipelineState = gpuPipelineState;
      gfxStateCache.glPrimitive = gpuPipelineState.glPrimitive;

      if (gpuShader) {
        var glProgram = gpuShader.glProgram;

        if (cache.glProgram !== glProgram) {
          gl.useProgram(glProgram);
          cache.glProgram = glProgram;
          isShaderChanged = true;
        }
      } // rasterizer state


      var rs = gpuPipelineState.rs;

      if (rs) {
        if (cache.rs.cullMode !== rs.cullMode) {
          switch (rs.cullMode) {
            case _define.GFXCullMode.NONE:
              {
                gl.disable(gl.CULL_FACE);
                break;
              }

            case _define.GFXCullMode.FRONT:
              {
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.FRONT);
                break;
              }

            case _define.GFXCullMode.BACK:
              {
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.BACK);
                break;
              }

            default:
          }

          device.stateCache.rs.cullMode = rs.cullMode;
        }

        var isFrontFaceCCW = rs.isFrontFaceCCW !== gfxStateCache.reverseCW; // boolean XOR

        if (device.stateCache.rs.isFrontFaceCCW !== isFrontFaceCCW) {
          gl.frontFace(isFrontFaceCCW ? gl.CCW : gl.CW);
          device.stateCache.rs.isFrontFaceCCW = isFrontFaceCCW;
        }

        if (device.stateCache.rs.depthBias !== rs.depthBias || device.stateCache.rs.depthBiasSlop !== rs.depthBiasSlop) {
          gl.polygonOffset(rs.depthBias, rs.depthBiasSlop);
          device.stateCache.rs.depthBias = rs.depthBias;
          device.stateCache.rs.depthBiasSlop = rs.depthBiasSlop;
        }

        if (device.stateCache.rs.lineWidth !== rs.lineWidth) {
          gl.lineWidth(rs.lineWidth);
          device.stateCache.rs.lineWidth = rs.lineWidth;
        }
      } // rasterizater state
      // depth-stencil state


      var dss = gpuPipelineState.dss;

      if (dss) {
        if (cache.dss.depthTest !== dss.depthTest) {
          if (dss.depthTest) {
            gl.enable(gl.DEPTH_TEST);
          } else {
            gl.disable(gl.DEPTH_TEST);
          }

          cache.dss.depthTest = dss.depthTest;
        }

        if (cache.dss.depthWrite !== dss.depthWrite) {
          gl.depthMask(dss.depthWrite);
          cache.dss.depthWrite = dss.depthWrite;
        }

        if (cache.dss.depthFunc !== dss.depthFunc) {
          gl.depthFunc(WebGLCmpFuncs[dss.depthFunc]);
          cache.dss.depthFunc = dss.depthFunc;
        } // front


        if (cache.dss.stencilTestFront !== dss.stencilTestFront || cache.dss.stencilTestBack !== dss.stencilTestBack) {
          if (dss.stencilTestFront || dss.stencilTestBack) {
            gl.enable(gl.STENCIL_TEST);
          } else {
            gl.disable(gl.STENCIL_TEST);
          }

          cache.dss.stencilTestFront = dss.stencilTestFront;
          cache.dss.stencilTestBack = dss.stencilTestBack;
        }

        if (cache.dss.stencilFuncFront !== dss.stencilFuncFront || cache.dss.stencilRefFront !== dss.stencilRefFront || cache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront) {
          gl.stencilFuncSeparate(gl.FRONT, WebGLCmpFuncs[dss.stencilFuncFront], dss.stencilRefFront, dss.stencilReadMaskFront);
          cache.dss.stencilFuncFront = dss.stencilFuncFront;
          cache.dss.stencilRefFront = dss.stencilRefFront;
          cache.dss.stencilReadMaskFront = dss.stencilReadMaskFront;
        }

        if (cache.dss.stencilFailOpFront !== dss.stencilFailOpFront || cache.dss.stencilZFailOpFront !== dss.stencilZFailOpFront || cache.dss.stencilPassOpFront !== dss.stencilPassOpFront) {
          gl.stencilOpSeparate(gl.FRONT, WebGLStencilOps[dss.stencilFailOpFront], WebGLStencilOps[dss.stencilZFailOpFront], WebGLStencilOps[dss.stencilPassOpFront]);
          cache.dss.stencilFailOpFront = dss.stencilFailOpFront;
          cache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
          cache.dss.stencilPassOpFront = dss.stencilPassOpFront;
        }

        if (cache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
          gl.stencilMaskSeparate(gl.FRONT, dss.stencilWriteMaskFront);
          cache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
        } // back


        if (cache.dss.stencilFuncBack !== dss.stencilFuncBack || cache.dss.stencilRefBack !== dss.stencilRefBack || cache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack) {
          gl.stencilFuncSeparate(gl.BACK, WebGLCmpFuncs[dss.stencilFuncBack], dss.stencilRefBack, dss.stencilReadMaskBack);
          cache.dss.stencilFuncBack = dss.stencilFuncBack;
          cache.dss.stencilRefBack = dss.stencilRefBack;
          cache.dss.stencilReadMaskBack = dss.stencilReadMaskBack;
        }

        if (cache.dss.stencilFailOpBack !== dss.stencilFailOpBack || cache.dss.stencilZFailOpBack !== dss.stencilZFailOpBack || cache.dss.stencilPassOpBack !== dss.stencilPassOpBack) {
          gl.stencilOpSeparate(gl.BACK, WebGLStencilOps[dss.stencilFailOpBack], WebGLStencilOps[dss.stencilZFailOpBack], WebGLStencilOps[dss.stencilPassOpBack]);
          cache.dss.stencilFailOpBack = dss.stencilFailOpBack;
          cache.dss.stencilZFailOpBack = dss.stencilZFailOpBack;
          cache.dss.stencilPassOpBack = dss.stencilPassOpBack;
        }

        if (cache.dss.stencilWriteMaskBack !== dss.stencilWriteMaskBack) {
          gl.stencilMaskSeparate(gl.BACK, dss.stencilWriteMaskBack);
          cache.dss.stencilWriteMaskBack = dss.stencilWriteMaskBack;
        }
      } // depth-stencil state
      // blend state


      var bs = gpuPipelineState.bs;

      if (bs) {
        if (cache.bs.isA2C !== bs.isA2C) {
          if (bs.isA2C) {
            gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
          } else {
            gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
          }

          cache.bs.isA2C = bs.isA2C;
        }

        if (cache.bs.blendColor.x !== bs.blendColor.x || cache.bs.blendColor.y !== bs.blendColor.y || cache.bs.blendColor.z !== bs.blendColor.z || cache.bs.blendColor.w !== bs.blendColor.w) {
          gl.blendColor(bs.blendColor.x, bs.blendColor.y, bs.blendColor.z, bs.blendColor.w);
          cache.bs.blendColor.x = bs.blendColor.x;
          cache.bs.blendColor.y = bs.blendColor.y;
          cache.bs.blendColor.z = bs.blendColor.z;
          cache.bs.blendColor.w = bs.blendColor.w;
        }

        var target0 = bs.targets[0];
        var target0Cache = cache.bs.targets[0];

        if (target0Cache.blend !== target0.blend) {
          if (target0.blend) {
            gl.enable(gl.BLEND);
          } else {
            gl.disable(gl.BLEND);
          }

          target0Cache.blend = target0.blend;
        }

        if (target0Cache.blendEq !== target0.blendEq || target0Cache.blendAlphaEq !== target0.blendAlphaEq) {
          gl.blendEquationSeparate(WebGLBlendOps[target0.blendEq], WebGLBlendOps[target0.blendAlphaEq]);
          target0Cache.blendEq = target0.blendEq;
          target0Cache.blendAlphaEq = target0.blendAlphaEq;
        }

        if (target0Cache.blendSrc !== target0.blendSrc || target0Cache.blendDst !== target0.blendDst || target0Cache.blendSrcAlpha !== target0.blendSrcAlpha || target0Cache.blendDstAlpha !== target0.blendDstAlpha) {
          gl.blendFuncSeparate(WebGLBlendFactors[target0.blendSrc], WebGLBlendFactors[target0.blendDst], WebGLBlendFactors[target0.blendSrcAlpha], WebGLBlendFactors[target0.blendDstAlpha]);
          target0Cache.blendSrc = target0.blendSrc;
          target0Cache.blendDst = target0.blendDst;
          target0Cache.blendSrcAlpha = target0.blendSrcAlpha;
          target0Cache.blendDstAlpha = target0.blendDstAlpha;
        }

        if (target0Cache.blendColorMask !== target0.blendColorMask) {
          gl.colorMask((target0.blendColorMask & _define.GFXColorMask.R) !== _define.GFXColorMask.NONE, (target0.blendColorMask & _define.GFXColorMask.G) !== _define.GFXColorMask.NONE, (target0.blendColorMask & _define.GFXColorMask.B) !== _define.GFXColorMask.NONE, (target0.blendColorMask & _define.GFXColorMask.A) !== _define.GFXColorMask.NONE);
          target0Cache.blendColorMask = target0.blendColorMask;
        }
      } // blend state

    } // bind pipeline
    // bind descriptor sets


    if (gpuPipelineState && gpuPipelineState.gpuPipelineLayout && gpuShader) {
      var blockLen = gpuShader.glBlocks.length;
      var dynamicOffsetIndices = gpuPipelineState.gpuPipelineLayout.dynamicOffsetIndices;

      for (var j = 0; j < blockLen; j++) {
        var glBlock = gpuShader.glBlocks[j];
        var gpuDescriptorSet = gpuDescriptorSets[glBlock.set];
        var gpuDescriptor = gpuDescriptorSet && gpuDescriptorSet.gpuDescriptors[glBlock.binding];

        if (!gpuDescriptor || !gpuDescriptor.gpuBuffer) {
          (0, _index.error)("Buffer binding '".concat(glBlock.name, "' at set ").concat(glBlock.set, " binding ").concat(glBlock.binding, " is not bounded"));
          continue;
        }

        var dynamicOffsetIndexSet = dynamicOffsetIndices[glBlock.set];
        var dynamicOffsetIndex = dynamicOffsetIndexSet && dynamicOffsetIndexSet[glBlock.binding];
        var offset = gpuDescriptor.gpuBuffer.glOffset;
        if (dynamicOffsetIndex >= 0) offset += dynamicOffsets[dynamicOffsetIndex];

        if (cache.glBindUBOs[glBlock.glBinding] !== gpuDescriptor.gpuBuffer.glBuffer || cache.glBindUBOOffsets[glBlock.glBinding] !== offset) {
          if (offset) {
            gl.bindBufferRange(gl.UNIFORM_BUFFER, glBlock.glBinding, gpuDescriptor.gpuBuffer.glBuffer, offset, gpuDescriptor.gpuBuffer.size);
          } else {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, glBlock.glBinding, gpuDescriptor.gpuBuffer.glBuffer);
          }

          cache.glUniformBuffer = cache.glBindUBOs[glBlock.glBinding] = gpuDescriptor.gpuBuffer.glBuffer;
          cache.glBindUBOOffsets[glBlock.glBinding] = offset;
        }
      }

      var samplerLen = gpuShader.glSamplers.length;

      for (var i = 0; i < samplerLen; i++) {
        var glSampler = gpuShader.glSamplers[i];
        var _gpuDescriptorSet = gpuDescriptorSets[glSampler.set];
        var descriptorIndex = _gpuDescriptorSet && _gpuDescriptorSet.descriptorIndices[glSampler.binding];

        var _gpuDescriptor = _gpuDescriptorSet && _gpuDescriptorSet.gpuDescriptors[descriptorIndex];

        for (var l = 0; l < glSampler.units.length; l++) {
          var texUnit = glSampler.units[l];
          var glTexUnit = cache.glTexUnits[texUnit];

          if (!_gpuDescriptor || !_gpuDescriptor.gpuTexture || !_gpuDescriptor.gpuSampler) {
            (0, _index.error)("Sampler binding '".concat(glSampler.name, "' at set ").concat(glSampler.set, " binding ").concat(glSampler.binding, " index ").concat(l, " is not bounded"));
            continue;
          }

          if (_gpuDescriptor.gpuTexture && _gpuDescriptor.gpuTexture.size > 0) {
            var gpuTexture = _gpuDescriptor.gpuTexture;

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
              if (cache.texUnit !== texUnit) {
                gl.activeTexture(gl.TEXTURE0 + texUnit);
                cache.texUnit = texUnit;
              }

              if (gpuTexture.glTexture) {
                gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
              } else {
                gl.bindTexture(gpuTexture.glTarget, device.nullTex2D.gpuTexture.glTexture);
              }

              glTexUnit.glTexture = gpuTexture.glTexture;
            }

            var gpuSampler = _gpuDescriptor.gpuSampler;

            if (cache.glSamplerUnits[texUnit] !== gpuSampler.glSampler) {
              gl.bindSampler(texUnit, gpuSampler.glSampler);
              cache.glSamplerUnits[texUnit] = gpuSampler.glSampler;
            }
          }

          _gpuDescriptor = _gpuDescriptorSet.gpuDescriptors[++descriptorIndex];
        }
      }
    } // bind descriptor sets
    // bind vertex/index buffer


    if (gpuInputAssembler && gpuShader && (isShaderChanged || gfxStateCache.gpuInputAssembler !== gpuInputAssembler)) {
      gfxStateCache.gpuInputAssembler = gpuInputAssembler;

      if (device.useVAO) {
        // check vao
        var glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram);

        if (!glVAO) {
          glVAO = gl.createVertexArray();
          gpuInputAssembler.glVAOs.set(gpuShader.glProgram, glVAO);
          gl.bindVertexArray(glVAO);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          cache.glArrayBuffer = null;
          cache.glElementArrayBuffer = null;
          var glAttrib;

          for (var _j = 0; _j < gpuShader.glInputs.length; _j++) {
            var glInput = gpuShader.glInputs[_j];
            glAttrib = null;

            for (var k = 0; k < gpuInputAssembler.glAttribs.length; k++) {
              var attrib = gpuInputAssembler.glAttribs[k];

              if (attrib.name === glInput.name) {
                glAttrib = attrib;
                break;
              }
            }

            if (glAttrib) {
              if (cache.glArrayBuffer !== glAttrib.glBuffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, glAttrib.glBuffer);
                cache.glArrayBuffer = glAttrib.glBuffer;
              }

              for (var c = 0; c < glAttrib.componentCount; ++c) {
                var glLoc = glInput.glLoc + c;
                var attribOffset = glAttrib.offset + glAttrib.size * c;
                gl.enableVertexAttribArray(glLoc);
                cache.glCurrentAttribLocs[glLoc] = true;
                gl.vertexAttribPointer(glLoc, glAttrib.count, glAttrib.glType, glAttrib.isNormalized, glAttrib.stride, attribOffset);
                gl.vertexAttribDivisor(glLoc, glAttrib.isInstanced ? 1 : 0);
              }
            }
          }

          var gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

          if (gpuBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
          }

          gl.bindVertexArray(null);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          cache.glArrayBuffer = null;
          cache.glElementArrayBuffer = null;
        }

        if (cache.glVAO !== glVAO) {
          gl.bindVertexArray(glVAO);
          cache.glVAO = glVAO;
        }
      } else {
        for (var a = 0; a < device.maxVertexAttributes; ++a) {
          cache.glCurrentAttribLocs[a] = false;
        }

        for (var _j2 = 0; _j2 < gpuShader.glInputs.length; _j2++) {
          var _glInput = gpuShader.glInputs[_j2];
          var _glAttrib = null;

          for (var _k5 = 0; _k5 < gpuInputAssembler.glAttribs.length; _k5++) {
            var _attrib = gpuInputAssembler.glAttribs[_k5];

            if (_attrib.name === _glInput.name) {
              _glAttrib = _attrib;
              break;
            }
          }

          if (_glAttrib) {
            if (cache.glArrayBuffer !== _glAttrib.glBuffer) {
              gl.bindBuffer(gl.ARRAY_BUFFER, _glAttrib.glBuffer);
              cache.glArrayBuffer = _glAttrib.glBuffer;
            }

            for (var _c = 0; _c < _glAttrib.componentCount; ++_c) {
              var _glLoc2 = _glInput.glLoc + _c;

              var _attribOffset = _glAttrib.offset + _glAttrib.size * _c;

              if (!cache.glEnabledAttribLocs[_glLoc2] && _glLoc2 >= 0) {
                gl.enableVertexAttribArray(_glLoc2);
                cache.glEnabledAttribLocs[_glLoc2] = true;
              }

              cache.glCurrentAttribLocs[_glLoc2] = true;
              gl.vertexAttribPointer(_glLoc2, _glAttrib.count, _glAttrib.glType, _glAttrib.isNormalized, _glAttrib.stride, _attribOffset);
              gl.vertexAttribDivisor(_glLoc2, _glAttrib.isInstanced ? 1 : 0);
            }
          }
        } // for


        var _gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

        if (_gpuBuffer) {
          if (cache.glElementArrayBuffer !== _gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _gpuBuffer.glBuffer);
            cache.glElementArrayBuffer = _gpuBuffer.glBuffer;
          }
        }

        for (var _a = 0; _a < device.maxVertexAttributes; ++_a) {
          if (cache.glEnabledAttribLocs[_a] !== cache.glCurrentAttribLocs[_a]) {
            gl.disableVertexAttribArray(_a);
            cache.glEnabledAttribLocs[_a] = false;
          }
        }
      }
    } // bind vertex/index buffer
    // update dynamic states


    if (gpuPipelineState && gpuPipelineState.dynamicStates.length) {
      var dsLen = gpuPipelineState.dynamicStates.length;

      for (var _k6 = 0; _k6 < dsLen; _k6++) {
        var dynamicState = gpuPipelineState.dynamicStates[_k6];

        switch (dynamicState) {
          case _define.GFXDynamicStateFlagBit.VIEWPORT:
            {
              if (viewport) {
                if (cache.viewport.left !== viewport.left || cache.viewport.top !== viewport.top || cache.viewport.width !== viewport.width || cache.viewport.height !== viewport.height) {
                  gl.viewport(viewport.left, viewport.top, viewport.width, viewport.height);
                  cache.viewport.left = viewport.left;
                  cache.viewport.top = viewport.top;
                  cache.viewport.width = viewport.width;
                  cache.viewport.height = viewport.height;
                }
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.SCISSOR:
            {
              if (scissor) {
                if (cache.scissorRect.x !== scissor.x || cache.scissorRect.y !== scissor.y || cache.scissorRect.width !== scissor.width || cache.scissorRect.height !== scissor.height) {
                  gl.scissor(scissor.x, scissor.y, scissor.width, scissor.height);
                  cache.scissorRect.x = scissor.x;
                  cache.scissorRect.y = scissor.y;
                  cache.scissorRect.width = scissor.width;
                  cache.scissorRect.height = scissor.height;
                }
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.LINE_WIDTH:
            {
              if (lineWidth) {
                if (cache.rs.lineWidth !== lineWidth) {
                  gl.lineWidth(lineWidth);
                  cache.rs.lineWidth = lineWidth;
                }
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.DEPTH_BIAS:
            {
              if (depthBias) {
                if (cache.rs.depthBias !== depthBias.constantFactor || cache.rs.depthBiasSlop !== depthBias.slopeFactor) {
                  gl.polygonOffset(depthBias.constantFactor, depthBias.slopeFactor);
                  cache.rs.depthBias = depthBias.constantFactor;
                  cache.rs.depthBiasSlop = depthBias.slopeFactor;
                }
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.BLEND_CONSTANTS:
            {
              if (cache.bs.blendColor.x !== blendConstants[0] || cache.bs.blendColor.y !== blendConstants[1] || cache.bs.blendColor.z !== blendConstants[2] || cache.bs.blendColor.w !== blendConstants[3]) {
                gl.blendColor(blendConstants[0], blendConstants[1], blendConstants[2], blendConstants[3]);
                cache.bs.blendColor.x = blendConstants[0];
                cache.bs.blendColor.y = blendConstants[1];
                cache.bs.blendColor.z = blendConstants[2];
                cache.bs.blendColor.w = blendConstants[3];
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.STENCIL_WRITE_MASK:
            {
              if (stencilWriteMask) {
                switch (stencilWriteMask.face) {
                  case _define.GFXStencilFace.FRONT:
                    {
                      if (cache.dss.stencilWriteMaskFront !== stencilWriteMask.writeMask) {
                        gl.stencilMaskSeparate(gl.FRONT, stencilWriteMask.writeMask);
                        cache.dss.stencilWriteMaskFront = stencilWriteMask.writeMask;
                      }

                      break;
                    }

                  case _define.GFXStencilFace.BACK:
                    {
                      if (cache.dss.stencilWriteMaskBack !== stencilWriteMask.writeMask) {
                        gl.stencilMaskSeparate(gl.BACK, stencilWriteMask.writeMask);
                        cache.dss.stencilWriteMaskBack = stencilWriteMask.writeMask;
                      }

                      break;
                    }

                  case _define.GFXStencilFace.ALL:
                    {
                      if (cache.dss.stencilWriteMaskFront !== stencilWriteMask.writeMask || cache.dss.stencilWriteMaskBack !== stencilWriteMask.writeMask) {
                        gl.stencilMask(stencilWriteMask.writeMask);
                        cache.dss.stencilWriteMaskFront = stencilWriteMask.writeMask;
                        cache.dss.stencilWriteMaskBack = stencilWriteMask.writeMask;
                      }

                      break;
                    }
                }
              }

              break;
            }

          case _define.GFXDynamicStateFlagBit.STENCIL_COMPARE_MASK:
            {
              if (stencilCompareMask) {
                switch (stencilCompareMask.face) {
                  case _define.GFXStencilFace.FRONT:
                    {
                      if (cache.dss.stencilRefFront !== stencilCompareMask.reference || cache.dss.stencilReadMaskFront !== stencilCompareMask.compareMask) {
                        gl.stencilFuncSeparate(gl.FRONT, WebGLCmpFuncs[cache.dss.stencilFuncFront], stencilCompareMask.reference, stencilCompareMask.compareMask);
                        cache.dss.stencilRefFront = stencilCompareMask.reference;
                        cache.dss.stencilReadMaskFront = stencilCompareMask.compareMask;
                      }

                      break;
                    }

                  case _define.GFXStencilFace.BACK:
                    {
                      if (cache.dss.stencilRefBack !== stencilCompareMask.reference || cache.dss.stencilReadMaskBack !== stencilCompareMask.compareMask) {
                        gl.stencilFuncSeparate(gl.BACK, WebGLCmpFuncs[cache.dss.stencilFuncBack], stencilCompareMask.reference, stencilCompareMask.compareMask);
                        cache.dss.stencilRefBack = stencilCompareMask.reference;
                        cache.dss.stencilReadMaskBack = stencilCompareMask.compareMask;
                      }

                      break;
                    }

                  case _define.GFXStencilFace.ALL:
                    {
                      if (cache.dss.stencilRefFront !== stencilCompareMask.reference || cache.dss.stencilReadMaskFront !== stencilCompareMask.compareMask || cache.dss.stencilRefBack !== stencilCompareMask.reference || cache.dss.stencilReadMaskBack !== stencilCompareMask.compareMask) {
                        gl.stencilFunc(WebGLCmpFuncs[cache.dss.stencilFuncBack], stencilCompareMask.reference, stencilCompareMask.compareMask);
                        cache.dss.stencilRefFront = stencilCompareMask.reference;
                        cache.dss.stencilReadMaskFront = stencilCompareMask.compareMask;
                        cache.dss.stencilRefBack = stencilCompareMask.reference;
                        cache.dss.stencilReadMaskBack = stencilCompareMask.compareMask;
                      }

                      break;
                    }
                }
              }

              break;
            }
        } // switch

      } // for

    } // update dynamic states

  }

  function WebGL2CmdFuncDraw(device, drawInfo) {
    var gl = device.gl;
    var gpuInputAssembler = gfxStateCache.gpuInputAssembler,
        glPrimitive = gfxStateCache.glPrimitive;

    if (gpuInputAssembler) {
      if (gpuInputAssembler.gpuIndirectBuffer) {
        var indirects = gpuInputAssembler.gpuIndirectBuffer.indirects;

        for (var k = 0; k < indirects.length; k++) {
          var subDrawInfo = indirects[k];
          var gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

          if (subDrawInfo.instanceCount) {
            if (gpuBuffer) {
              if (subDrawInfo.indexCount > 0) {
                var offset = subDrawInfo.firstIndex * gpuBuffer.stride;
                gl.drawElementsInstanced(glPrimitive, subDrawInfo.indexCount, gpuInputAssembler.glIndexType, offset, subDrawInfo.instanceCount);
              }
            } else if (subDrawInfo.vertexCount > 0) {
              gl.drawArraysInstanced(glPrimitive, subDrawInfo.firstVertex, subDrawInfo.vertexCount, subDrawInfo.instanceCount);
            }
          } else {
            if (gpuBuffer) {
              if (subDrawInfo.indexCount > 0) {
                var _offset = subDrawInfo.firstIndex * gpuBuffer.stride;

                gl.drawElements(glPrimitive, subDrawInfo.indexCount, gpuInputAssembler.glIndexType, _offset);
              }
            } else if (subDrawInfo.vertexCount > 0) {
              gl.drawArrays(glPrimitive, subDrawInfo.firstVertex, subDrawInfo.vertexCount);
            }
          }
        }
      } else {
        if (drawInfo.instanceCount) {
          if (gpuInputAssembler.gpuIndexBuffer) {
            if (drawInfo.indexCount > 0) {
              var _offset2 = drawInfo.firstIndex * gpuInputAssembler.gpuIndexBuffer.stride;

              gl.drawElementsInstanced(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, _offset2, drawInfo.instanceCount);
            }
          } else if (drawInfo.vertexCount > 0) {
            gl.drawArraysInstanced(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount);
          }
        } else {
          if (gpuInputAssembler.gpuIndexBuffer) {
            if (drawInfo.indexCount > 0) {
              var _offset3 = drawInfo.firstIndex * gpuInputAssembler.gpuIndexBuffer.stride;

              gl.drawElements(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, _offset3);
            }
          } else if (drawInfo.vertexCount > 0) {
            gl.drawArrays(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount);
          }
        }
      }
    }
  }

  var cmdIds = new Array(WebGL2Cmd.COUNT);

  function WebGL2CmdFuncExecuteCmds(device, cmdPackage) {
    cmdIds.fill(0);

    for (var i = 0; i < cmdPackage.cmds.length; ++i) {
      var cmd = cmdPackage.cmds.array[i];
      var cmdId = cmdIds[cmd]++;

      switch (cmd) {
        case WebGL2Cmd.BEGIN_RENDER_PASS:
          {
            var cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];
            WebGL2CmdFuncBeginRenderPass(device, cmd0.gpuRenderPass, cmd0.gpuFramebuffer, cmd0.renderArea, cmd0.clearColors, cmd0.clearDepth, cmd0.clearStencil);
            break;
          }

        /*
        case WebGL2Cmd.END_RENDER_PASS: {
            // WebGL 2.0 doesn't support store operation of attachments.
            // GFXStoreOp.Store is the default GL behavior.
            break;
        }
        */

        case WebGL2Cmd.BIND_STATES:
          {
            var cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
            WebGL2CmdFuncBindStates(device, cmd2.gpuPipelineState, cmd2.gpuInputAssembler, cmd2.gpuDescriptorSets, cmd2.dynamicOffsets, cmd2.viewport, cmd2.scissor, cmd2.lineWidth, cmd2.depthBias, cmd2.blendConstants, cmd2.depthBounds, cmd2.stencilWriteMask, cmd2.stencilCompareMask);
            break;
          }

        case WebGL2Cmd.DRAW:
          {
            var cmd3 = cmdPackage.drawCmds.array[cmdId];
            WebGL2CmdFuncDraw(device, cmd3.drawInfo);
            break;
          }

        case WebGL2Cmd.UPDATE_BUFFER:
          {
            var cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
            WebGL2CmdFuncUpdateBuffer(device, cmd4.gpuBuffer, cmd4.buffer, cmd4.offset, cmd4.size);
            break;
          }

        case WebGL2Cmd.COPY_BUFFER_TO_TEXTURE:
          {
            var cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
            WebGL2CmdFuncCopyBuffersToTexture(device, cmd5.buffers, cmd5.gpuTexture, cmd5.regions);
            break;
          }
      } // switch

    } // for

  }

  function WebGL2CmdFuncCopyTexImagesToTexture(device, texImages, gpuTexture, regions) {
    var gl = device.gl;
    var glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
      gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
      glTexUnit.glTexture = gpuTexture.glTexture;
    }

    var n = 0;
    var f = 0;

    switch (gpuTexture.glTarget) {
      case gl.TEXTURE_2D:
        {
          for (var k = 0; k < regions.length; k++) {
            var region = regions[k];
            gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
          }

          break;
        }

      case gl.TEXTURE_CUBE_MAP:
        {
          for (var _k7 = 0; _k7 < regions.length; _k7++) {
            var _region = regions[_k7];
            var fcount = _region.texSubres.baseArrayLayer + _region.texSubres.layerCount;

            for (f = _region.texSubres.baseArrayLayer; f < fcount; ++f) {
              gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region.texSubres.mipLevel, _region.texOffset.x, _region.texOffset.y, gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
            }
          }

          break;
        }

      default:
        {
          console.error('Unsupported GL texture type, copy buffer to texture failed.');
        }
    }

    if (gpuTexture.flags & _define.GFXTextureFlagBit.GEN_MIPMAP) {
      gl.generateMipmap(gpuTexture.glTarget);
    }
  }

  function WebGL2CmdFuncCopyBuffersToTexture(device, buffers, gpuTexture, regions) {
    var gl = device.gl;
    var glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
      gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
      glTexUnit.glTexture = gpuTexture.glTexture;
    }

    var n = 0;
    var w = 1;
    var h = 1;
    var f = 0;
    var fmtInfo = _define.GFXFormatInfos[gpuTexture.format];
    var isCompressed = fmtInfo.isCompressed;

    switch (gpuTexture.glTarget) {
      case gl.TEXTURE_2D:
        {
          for (var k = 0; k < regions.length; k++) {
            var region = regions[k];
            w = region.texExtent.width;
            h = region.texExtent.height;
            var pixels = buffers[n++];

            if (!isCompressed) {
              gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, w, h, gpuTexture.glFormat, gpuTexture.glType, pixels);
            } else {
              if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                gl.compressedTexSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, w, h, gpuTexture.glFormat, pixels);
              } else {
                gl.compressedTexImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, gpuTexture.glInternalFmt, w, h, 0, pixels);
              }
            }
          }

          break;
        }

      case gl.TEXTURE_CUBE_MAP:
        {
          for (var _k8 = 0; _k8 < regions.length; _k8++) {
            var _region2 = regions[_k8];
            var fcount = _region2.texSubres.baseArrayLayer + _region2.texSubres.layerCount;

            for (f = _region2.texSubres.baseArrayLayer; f < fcount; ++f) {
              w = _region2.texExtent.width;
              h = _region2.texExtent.height;
              var _pixels = buffers[n++];

              if (!isCompressed) {
                gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, _region2.texOffset.x, _region2.texOffset.y, w, h, gpuTexture.glFormat, gpuTexture.glType, _pixels);
              } else {
                if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                  gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, _region2.texOffset.x, _region2.texOffset.y, w, h, gpuTexture.glFormat, _pixels);
                } else {
                  gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, gpuTexture.glInternalFmt, w, h, 0, _pixels);
                }
              }
            }
          }

          break;
        }

      default:
        {
          console.error('Unsupported GL texture type, copy buffer to texture failed.');
        }
    }

    if (gpuTexture.flags & _define.GFXTextureFlagBit.GEN_MIPMAP) {
      gl.generateMipmap(gpuTexture.glTarget);
    }
  }

  function WebGL2CmdFuncBlitFramebuffer(device, src, dst, srcRect, dstRect, filter) {
    var gl = device.gl;

    if (device.stateCache.glReadFramebuffer !== src.glFramebuffer) {
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, src.glFramebuffer);
      device.stateCache.glReadFramebuffer = src.glFramebuffer;
    }

    var rebindFBO = dst.glFramebuffer !== device.stateCache.glFramebuffer;

    if (rebindFBO) {
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, dst.glFramebuffer);
    }

    var mask = 0;

    if (src.gpuColorTextures.length > 0) {
      mask |= gl.COLOR_BUFFER_BIT;
    }

    if (src.gpuDepthStencilTexture) {
      mask |= gl.DEPTH_BUFFER_BIT;

      if (_define.GFXFormatInfos[src.gpuDepthStencilTexture.format].hasStencil) {
        mask |= gl.STENCIL_BUFFER_BIT;
      }
    }

    var glFilter = filter === _define.GFXFilter.LINEAR || filter === _define.GFXFilter.ANISOTROPIC ? gl.LINEAR : gl.NEAREST;
    gl.blitFramebuffer(srcRect.x, srcRect.y, srcRect.x + srcRect.width, srcRect.y + srcRect.height, dstRect.x, dstRect.y, dstRect.x + dstRect.width, dstRect.y + dstRect.height, mask, glFilter);

    if (rebindFBO) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, device.stateCache.glFramebuffer);
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItY29tbWFuZHMudHMiXSwibmFtZXMiOlsiV2ViR0xXcmFwcyIsIlNBTVBMRVMiLCJfZjMydjQiLCJGbG9hdDMyQXJyYXkiLCJDbXBGMzJOb3RFdXFhbCIsImEiLCJiIiwiYyIsIkdGWEZvcm1hdFRvV2ViR0xUeXBlIiwiZm9ybWF0IiwiZ2wiLCJHRlhGb3JtYXQiLCJSOCIsIlVOU0lHTkVEX0JZVEUiLCJSOFNOIiwiQllURSIsIlI4VUkiLCJSOEkiLCJSMTZGIiwiSEFMRl9GTE9BVCIsIlIxNlVJIiwiVU5TSUdORURfU0hPUlQiLCJSMTZJIiwiU0hPUlQiLCJSMzJGIiwiRkxPQVQiLCJSMzJVSSIsIlVOU0lHTkVEX0lOVCIsIlIzMkkiLCJJTlQiLCJSRzgiLCJSRzhTTiIsIlJHOFVJIiwiUkc4SSIsIlJHMTZGIiwiUkcxNlVJIiwiUkcxNkkiLCJSRzMyRiIsIlJHMzJVSSIsIlJHMzJJIiwiUkdCOCIsIlNSR0I4IiwiUkdCOFNOIiwiUkdCOFVJIiwiUkdCOEkiLCJSR0IxNkYiLCJSR0IxNlVJIiwiUkdCMTZJIiwiUkdCMzJGIiwiUkdCMzJVSSIsIlJHQjMySSIsIkJHUkE4IiwiUkdCQTgiLCJTUkdCOF9BOCIsIlJHQkE4U04iLCJSR0JBOFVJIiwiUkdCQThJIiwiUkdCQTE2RiIsIlJHQkExNlVJIiwiUkdCQTE2SSIsIlJHQkEzMkYiLCJSR0JBMzJVSSIsIlJHQkEzMkkiLCJSNUc2QjUiLCJVTlNJR05FRF9TSE9SVF81XzZfNSIsIlIxMUcxMUIxMEYiLCJVTlNJR05FRF9JTlRfMTBGXzExRl8xMUZfUkVWIiwiUkdCNUExIiwiVU5TSUdORURfU0hPUlRfNV81XzVfMSIsIlJHQkE0IiwiVU5TSUdORURfU0hPUlRfNF80XzRfNCIsIlJHQjEwQTIiLCJVTlNJR05FRF9JTlRfMl8xMF8xMF8xMF9SRVYiLCJSR0IxMEEyVUkiLCJSR0I5RTUiLCJEMTYiLCJEMTZTOCIsIlVOU0lHTkVEX0lOVF8yNF84IiwiRDI0IiwiRDI0UzgiLCJEMzJGIiwiRDMyRl9TOCIsIkZMT0FUXzMyX1VOU0lHTkVEX0lOVF8yNF84X1JFViIsIkJDMSIsIkJDMV9TUkdCIiwiQkMyIiwiQkMyX1NSR0IiLCJCQzMiLCJCQzNfU1JHQiIsIkJDNCIsIkJDNF9TTk9STSIsIkJDNSIsIkJDNV9TTk9STSIsIkJDNkhfU0YxNiIsIkJDNkhfVUYxNiIsIkJDNyIsIkJDN19TUkdCIiwiRVRDX1JHQjgiLCJFVEMyX1JHQjgiLCJFVEMyX1NSR0I4IiwiRVRDMl9SR0I4X0ExIiwiRVRDMl9TUkdCOF9BMSIsIkVBQ19SMTEiLCJFQUNfUjExU04iLCJFQUNfUkcxMSIsIkVBQ19SRzExU04iLCJQVlJUQ19SR0IyIiwiUFZSVENfUkdCQTIiLCJQVlJUQ19SR0I0IiwiUFZSVENfUkdCQTQiLCJQVlJUQzJfMkJQUCIsIlBWUlRDMl80QlBQIiwiQVNUQ19SR0JBXzR4NCIsIkFTVENfUkdCQV81eDQiLCJBU1RDX1JHQkFfNXg1IiwiQVNUQ19SR0JBXzZ4NSIsIkFTVENfUkdCQV82eDYiLCJBU1RDX1JHQkFfOHg1IiwiQVNUQ19SR0JBXzh4NiIsIkFTVENfUkdCQV84eDgiLCJBU1RDX1JHQkFfMTB4NSIsIkFTVENfUkdCQV8xMHg2IiwiQVNUQ19SR0JBXzEweDgiLCJBU1RDX1JHQkFfMTB4MTAiLCJBU1RDX1JHQkFfMTJ4MTAiLCJBU1RDX1JHQkFfMTJ4MTIiLCJBU1RDX1NSR0JBXzR4NCIsIkFTVENfU1JHQkFfNXg0IiwiQVNUQ19TUkdCQV81eDUiLCJBU1RDX1NSR0JBXzZ4NSIsIkFTVENfU1JHQkFfNng2IiwiQVNUQ19TUkdCQV84eDUiLCJBU1RDX1NSR0JBXzh4NiIsIkFTVENfU1JHQkFfOHg4IiwiQVNUQ19TUkdCQV8xMHg1IiwiQVNUQ19TUkdCQV8xMHg2IiwiQVNUQ19TUkdCQV8xMHg4IiwiQVNUQ19TUkdCQV8xMHgxMCIsIkFTVENfU1JHQkFfMTJ4MTAiLCJBU1RDX1NSR0JBXzEyeDEyIiwiR0ZYRm9ybWF0VG9XZWJHTEludGVybmFsRm9ybWF0IiwiQTgiLCJBTFBIQSIsIkw4IiwiTFVNSU5BTkNFIiwiTEE4IiwiTFVNSU5BTkNFX0FMUEhBIiwiUjhfU05PUk0iLCJSRzhfU05PUk0iLCJSR0I4X1NOT1JNIiwiUkdCQThfU05PUk0iLCJSR0I1NjUiLCJSR0I1X0ExIiwiUkdCMTBfQTIiLCJSR0IxMF9BMlVJIiwiUjExRl9HMTFGX0IxMEYiLCJERVBUSF9DT01QT05FTlQxNiIsIkRFUFRIMjRfU1RFTkNJTDgiLCJERVBUSF9DT01QT05FTlQyNCIsIkRFUFRIX0NPTVBPTkVOVDMyRiIsIkRFUFRIMzJGX1NURU5DSUw4IiwiV2ViR0xFWFQiLCJDT01QUkVTU0VEX1JHQl9TM1RDX0RYVDFfRVhUIiwiQkMxX0FMUEhBIiwiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQiLCJDT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVCIsIkJDMV9TUkdCX0FMUEhBIiwiQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUMV9FWFQiLCJDT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQzX0VYVCIsIkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDNfRVhUIiwiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQiLCJDT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVCIsIkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wiLCJDT01QUkVTU0VEX1JHQjhfRVRDMiIsIkNPTVBSRVNTRURfU1JHQjhfRVRDMiIsIkNPTVBSRVNTRURfUkdCOF9QVU5DSFRIUk9VR0hfQUxQSEExX0VUQzIiLCJDT01QUkVTU0VEX1NSR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMiIsIkVUQzJfUkdCQTgiLCJDT01QUkVTU0VEX1JHQkE4X0VUQzJfRUFDIiwiRVRDMl9TUkdCOF9BOCIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0VUQzJfRUFDIiwiQ09NUFJFU1NFRF9SMTFfRUFDIiwiQ09NUFJFU1NFRF9TSUdORURfUjExX0VBQyIsIkNPTVBSRVNTRURfUkcxMV9FQUMiLCJDT01QUkVTU0VEX1NJR05FRF9SRzExX0VBQyIsIkNPTVBSRVNTRURfUkdCX1BWUlRDXzJCUFBWMV9JTUciLCJDT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNRyIsIkNPTVBSRVNTRURfUkdCX1BWUlRDXzRCUFBWMV9JTUciLCJDT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNRyIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzR4NF9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ181eDRfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfNXg1X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzZ4NV9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ182eDZfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfOHg1X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzh4Nl9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ184eDhfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4NV9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg2X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDhfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4MTBfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTBfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTJfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ180eDRfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDRfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDZfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDZfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDhfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg1X0tIUiIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4Nl9LSFIiLCJDT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDhfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHgxMF9LSFIiLCJDT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEyeDEwX0tIUiIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTJfS0hSIiwiY29uc29sZSIsImVycm9yIiwiUkdCQSIsIkdGWEZvcm1hdFRvV2ViR0xGb3JtYXQiLCJSRUQiLCJSRyIsIlJHQiIsIkRFUFRIX0NPTVBPTkVOVCIsIkRFUFRIX1NURU5DSUwiLCJHRlhUeXBlVG9XZWJHTFR5cGUiLCJ0eXBlIiwiR0ZYVHlwZSIsIkJPT0wiLCJCT09MMiIsIkJPT0xfVkVDMiIsIkJPT0wzIiwiQk9PTF9WRUMzIiwiQk9PTDQiLCJCT09MX1ZFQzQiLCJJTlQyIiwiSU5UX1ZFQzIiLCJJTlQzIiwiSU5UX1ZFQzMiLCJJTlQ0IiwiSU5UX1ZFQzQiLCJVSU5UIiwiRkxPQVQyIiwiRkxPQVRfVkVDMiIsIkZMT0FUMyIsIkZMT0FUX1ZFQzMiLCJGTE9BVDQiLCJGTE9BVF9WRUM0IiwiTUFUMiIsIkZMT0FUX01BVDIiLCJNQVQyWDMiLCJGTE9BVF9NQVQyeDMiLCJNQVQyWDQiLCJGTE9BVF9NQVQyeDQiLCJNQVQzWDIiLCJGTE9BVF9NQVQzeDIiLCJNQVQzIiwiRkxPQVRfTUFUMyIsIk1BVDNYNCIsIkZMT0FUX01BVDN4NCIsIk1BVDRYMiIsIkZMT0FUX01BVDR4MiIsIk1BVDRYMyIsIkZMT0FUX01BVDR4MyIsIk1BVDQiLCJGTE9BVF9NQVQ0IiwiU0FNUExFUjJEIiwiU0FNUExFUl8yRCIsIlNBTVBMRVIyRF9BUlJBWSIsIlNBTVBMRVJfMkRfQVJSQVkiLCJTQU1QTEVSM0QiLCJTQU1QTEVSXzNEIiwiU0FNUExFUl9DVUJFIiwiVU5LTk9XTiIsIldlYkdMVHlwZVRvR0ZYVHlwZSIsImdsVHlwZSIsIlVOU0lHTkVEX0lOVF9WRUMyIiwiVUlOVDIiLCJVTlNJR05FRF9JTlRfVkVDMyIsIlVJTlQzIiwiVU5TSUdORURfSU5UX1ZFQzQiLCJVSU5UNCIsIldlYkdMR2V0VHlwZVNpemUiLCJTQU1QTEVSXzJEX0FSUkFZX1NIQURPVyIsIklOVF9TQU1QTEVSXzJEIiwiSU5UX1NBTVBMRVJfMkRfQVJSQVkiLCJJTlRfU0FNUExFUl8zRCIsIklOVF9TQU1QTEVSX0NVQkUiLCJVTlNJR05FRF9JTlRfU0FNUExFUl8yRCIsIlVOU0lHTkVEX0lOVF9TQU1QTEVSXzJEX0FSUkFZIiwiVU5TSUdORURfSU5UX1NBTVBMRVJfM0QiLCJVTlNJR05FRF9JTlRfU0FNUExFUl9DVUJFIiwiV2ViR0xHZXRDb21wb25lbnRDb3VudCIsIldlYkdMQ21wRnVuY3MiLCJXZWJHTFN0ZW5jaWxPcHMiLCJXZWJHTEJsZW5kT3BzIiwiV2ViR0xCbGVuZEZhY3RvcnMiLCJXZWJHTDJDbWQiLCJXZWJHTDJDbWRPYmplY3QiLCJjbWRUeXBlIiwicmVmQ291bnQiLCJXZWJHTDJDbWRCZWdpblJlbmRlclBhc3MiLCJCRUdJTl9SRU5ERVJfUEFTUyIsImdwdVJlbmRlclBhc3MiLCJncHVGcmFtZWJ1ZmZlciIsInJlbmRlckFyZWEiLCJHRlhSZWN0IiwiY2xlYXJDb2xvcnMiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwibGVuZ3RoIiwiV2ViR0wyQ21kQmluZFN0YXRlcyIsIkJJTkRfU1RBVEVTIiwiZ3B1UGlwZWxpbmVTdGF0ZSIsImdwdUlucHV0QXNzZW1ibGVyIiwiZ3B1RGVzY3JpcHRvclNldHMiLCJkeW5hbWljT2Zmc2V0cyIsInZpZXdwb3J0Iiwic2Npc3NvciIsImxpbmVXaWR0aCIsImRlcHRoQmlhcyIsImJsZW5kQ29uc3RhbnRzIiwiZGVwdGhCb3VuZHMiLCJzdGVuY2lsV3JpdGVNYXNrIiwic3RlbmNpbENvbXBhcmVNYXNrIiwiV2ViR0wyQ21kRHJhdyIsIkRSQVciLCJkcmF3SW5mbyIsIkdGWERyYXdJbmZvIiwiV2ViR0wyQ21kVXBkYXRlQnVmZmVyIiwiVVBEQVRFX0JVRkZFUiIsImdwdUJ1ZmZlciIsImJ1ZmZlciIsIm9mZnNldCIsInNpemUiLCJXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlIiwiQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSIsImdwdVRleHR1cmUiLCJidWZmZXJzIiwicmVnaW9ucyIsIldlYkdMMkNtZFBhY2thZ2UiLCJjbWRzIiwiQ2FjaGVkQXJyYXkiLCJiZWdpblJlbmRlclBhc3NDbWRzIiwiYmluZFN0YXRlc0NtZHMiLCJkcmF3Q21kcyIsInVwZGF0ZUJ1ZmZlckNtZHMiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kcyIsImFsbG9jYXRvciIsImJlZ2luUmVuZGVyUGFzc0NtZFBvb2wiLCJmcmVlQ21kcyIsImNsZWFyIiwiYmluZFN0YXRlc0NtZFBvb2wiLCJkcmF3Q21kUG9vbCIsInVwZGF0ZUJ1ZmZlckNtZFBvb2wiLCJjb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbCIsIldlYkdMMkNtZEZ1bmNDcmVhdGVCdWZmZXIiLCJkZXZpY2UiLCJjYWNoZSIsInN0YXRlQ2FjaGUiLCJnbFVzYWdlIiwibWVtVXNhZ2UiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkhPU1QiLCJEWU5BTUlDX0RSQVciLCJTVEFUSUNfRFJBVyIsInVzYWdlIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJWRVJURVgiLCJnbFRhcmdldCIsIkFSUkFZX0JVRkZFUiIsImdsQnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwidXNlVkFPIiwiZ2xWQU8iLCJiaW5kVmVydGV4QXJyYXkiLCJnZnhTdGF0ZUNhY2hlIiwiZ2xBcnJheUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJidWZmZXJEYXRhIiwiSU5ERVgiLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsImdsRWxlbWVudEFycmF5QnVmZmVyIiwiVU5JRk9STSIsIlVOSUZPUk1fQlVGRkVSIiwiZ2xVbmlmb3JtQnVmZmVyIiwiSU5ESVJFQ1QiLCJOT05FIiwiVFJBTlNGRVJfRFNUIiwiVFJBTlNGRVJfU1JDIiwiV2ViR0wyQ21kRnVuY0Rlc3Ryb3lCdWZmZXIiLCJkZWxldGVCdWZmZXIiLCJXZWJHTDJDbWRGdW5jUmVzaXplQnVmZmVyIiwiV2ViR0wyQ21kRnVuY1VwZGF0ZUJ1ZmZlciIsImluZGlyZWN0cyIsIkFycmF5IiwicHJvdG90eXBlIiwicHVzaCIsImFwcGx5IiwiZHJhd0luZm9zIiwiYnVmZiIsImJ5dGVMZW5ndGgiLCJidWZmZXJTdWJEYXRhIiwic2xpY2UiLCJXZWJHTDJDbWRGdW5jQ3JlYXRlVGV4dHVyZSIsImdsSW50ZXJuYWxGbXQiLCJnbEZvcm1hdCIsInciLCJ3aWR0aCIsImgiLCJoZWlnaHQiLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiVEVYVFVSRV8yRCIsIm1heFNpemUiLCJNYXRoIiwibWF4IiwibWF4VGV4dHVyZVNpemUiLCJzYW1wbGVzIiwiR0ZYU2FtcGxlQ291bnQiLCJYMSIsImdsVGV4dHVyZSIsImNyZWF0ZVRleHR1cmUiLCJnbFRleFVuaXQiLCJnbFRleFVuaXRzIiwidGV4VW5pdCIsImJpbmRUZXh0dXJlIiwiR0ZYRm9ybWF0SW5mb3MiLCJpc0NvbXByZXNzZWQiLCJpIiwibWlwTGV2ZWwiLCJ0ZXhJbWFnZTJEIiwiaW1nU2l6ZSIsInZpZXciLCJVaW50OEFycmF5IiwiY29tcHJlc3NlZFRleEltYWdlMkQiLCJkZWxldGVUZXh0dXJlIiwiZ2xSZW5kZXJidWZmZXIiLCJjcmVhdGVSZW5kZXJidWZmZXIiLCJiaW5kUmVuZGVyYnVmZmVyIiwiUkVOREVSQlVGRkVSIiwicmVuZGVyYnVmZmVyU3RvcmFnZU11bHRpc2FtcGxlIiwiQ1VCRSIsIlRFWFRVUkVfQ1VCRV9NQVAiLCJtYXhDdWJlTWFwVGV4dHVyZVNpemUiLCJmIiwiVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YIiwiV2ViR0wyQ21kRnVuY0Rlc3Ryb3lUZXh0dXJlIiwiZGVsZXRlUmVuZGVyYnVmZmVyIiwiV2ViR0wyQ21kRnVuY1Jlc2l6ZVRleHR1cmUiLCJXZWJHTDJDbWRGdW5jQ3JlYXRlU2FtcGxlciIsImdwdVNhbXBsZXIiLCJnbFNhbXBsZXIiLCJjcmVhdGVTYW1wbGVyIiwibWluRmlsdGVyIiwiR0ZYRmlsdGVyIiwiTElORUFSIiwiQU5JU09UUk9QSUMiLCJtaXBGaWx0ZXIiLCJnbE1pbkZpbHRlciIsIkxJTkVBUl9NSVBNQVBfTElORUFSIiwiUE9JTlQiLCJMSU5FQVJfTUlQTUFQX05FQVJFU1QiLCJORUFSRVNUX01JUE1BUF9MSU5FQVIiLCJORUFSRVNUX01JUE1BUF9ORUFSRVNUIiwiTkVBUkVTVCIsIm1hZ0ZpbHRlciIsImdsTWFnRmlsdGVyIiwiZ2xXcmFwUyIsImFkZHJlc3NVIiwiZ2xXcmFwVCIsImFkZHJlc3NWIiwiZ2xXcmFwUiIsImFkZHJlc3NXIiwic2FtcGxlclBhcmFtZXRlcmkiLCJURVhUVVJFX01JTl9GSUxURVIiLCJURVhUVVJFX01BR19GSUxURVIiLCJURVhUVVJFX1dSQVBfUyIsIlRFWFRVUkVfV1JBUF9UIiwiVEVYVFVSRV9XUkFQX1IiLCJzYW1wbGVyUGFyYW1ldGVyZiIsIlRFWFRVUkVfTUlOX0xPRCIsIm1pbkxPRCIsIlRFWFRVUkVfTUFYX0xPRCIsIm1heExPRCIsIldlYkdMMkNtZEZ1bmNEZXN0cm95U2FtcGxlciIsImRlbGV0ZVNhbXBsZXIiLCJXZWJHTDJDbWRGdW5jQ3JlYXRlRnJhbWVidWZmZXIiLCJncHVDb2xvclRleHR1cmVzIiwiZ3B1RGVwdGhTdGVuY2lsVGV4dHVyZSIsImF0dGFjaG1lbnRzIiwiZ2xGcmFtZWJ1ZmZlciIsImNyZWF0ZUZyYW1lYnVmZmVyIiwiYmluZEZyYW1lYnVmZmVyIiwiRlJBTUVCVUZGRVIiLCJjb2xvclRleHR1cmUiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXJSZW5kZXJidWZmZXIiLCJkc3QiLCJnbEF0dGFjaG1lbnQiLCJoYXNTdGVuY2lsIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UIiwiREVQVEhfQVRUQUNITUVOVCIsImRyYXdCdWZmZXJzIiwic3RhdHVzIiwiY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyIsIkZSQU1FQlVGRkVSX0NPTVBMRVRFIiwiRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UIiwiRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQiLCJGUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlMiLCJGUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCIsIldlYkdMMkNtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIiLCJkZWxldGVGcmFtZWJ1ZmZlciIsIldlYkdMMkNtZEZ1bmNDcmVhdGVTaGFkZXIiLCJncHVTaGFkZXIiLCJrIiwiZ3B1U3RhZ2UiLCJncHVTdGFnZXMiLCJnbFNoYWRlclR5cGUiLCJzaGFkZXJUeXBlU3RyIiwibGluZU51bWJlciIsIkdGWFNoYWRlclN0YWdlRmxhZ0JpdCIsIlZFUlRFWF9TSEFERVIiLCJGUkFHTUVOVCIsIkZSQUdNRU5UX1NIQURFUiIsImdsU2hhZGVyIiwiY3JlYXRlU2hhZGVyIiwic2hhZGVyU291cmNlIiwic291cmNlIiwiY29tcGlsZVNoYWRlciIsImdldFNoYWRlclBhcmFtZXRlciIsIkNPTVBJTEVfU1RBVFVTIiwibmFtZSIsInJlcGxhY2UiLCJnZXRTaGFkZXJJbmZvTG9nIiwibCIsInN0YWdlIiwiZGVsZXRlU2hhZGVyIiwiZ2xQcm9ncmFtIiwiY3JlYXRlUHJvZ3JhbSIsImF0dGFjaFNoYWRlciIsImxpbmtQcm9ncmFtIiwiZGV0YWNoU2hhZGVyIiwiZ2V0UHJvZ3JhbVBhcmFtZXRlciIsIkxJTktfU1RBVFVTIiwiaW5mbyIsImdldFByb2dyYW1JbmZvTG9nIiwiYWN0aXZlQXR0cmliQ291bnQiLCJBQ1RJVkVfQVRUUklCVVRFUyIsImdsSW5wdXRzIiwiYXR0cmliSW5mbyIsImdldEFjdGl2ZUF0dHJpYiIsInZhck5hbWUiLCJuYW1lT2Zmc2V0IiwiaW5kZXhPZiIsInN1YnN0ciIsImdsTG9jIiwiZ2V0QXR0cmliTG9jYXRpb24iLCJzdHJpZGUiLCJjb3VudCIsImFjdGl2ZUJsb2NrQ291bnQiLCJBQ1RJVkVfVU5JRk9STV9CTE9DS1MiLCJibG9ja05hbWUiLCJibG9ja0lkeCIsImJsb2NrU2l6ZSIsImJsb2NrIiwiZ2xCbG9ja3MiLCJnZXRBY3RpdmVVbmlmb3JtQmxvY2tOYW1lIiwiYmxvY2tzIiwiZ2V0QWN0aXZlVW5pZm9ybUJsb2NrUGFyYW1ldGVyIiwiVU5JRk9STV9CTE9DS19EQVRBX1NJWkUiLCJnbEJpbmRpbmciLCJiaW5kaW5nIiwiYmluZGluZ01hcHBpbmdJbmZvIiwiYnVmZmVyT2Zmc2V0cyIsInNldCIsInVuaWZvcm1CbG9ja0JpbmRpbmciLCJpZHgiLCJzYW1wbGVycyIsImdsU2FtcGxlcnMiLCJzYW1wbGVyIiwidW5pdHMiLCJnbFVuaXRzIiwiZ2xBY3RpdmVTYW1wbGVycyIsImdsQWN0aXZlU2FtcGxlckxvY2F0aW9ucyIsInRleFVuaXRDYWNoZU1hcCIsImZsZXhpYmxlU2V0QmFzZU9mZnNldCIsImZsZXhpYmxlU2V0IiwiYXJyYXlPZmZzZXQiLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJ1bmRlZmluZWQiLCJzYW1wbGVyT2Zmc2V0cyIsIm1heFRleHR1cmVVbml0cyIsInVzZWRUZXhVbml0cyIsImNhY2hlZFVuaXQiLCJ0IiwidW5pdElkeCIsInVzZVByb2dyYW0iLCJJbnQzMkFycmF5IiwidW5pZm9ybTFpdiIsIldlYkdMMkNtZEZ1bmNEZXN0cm95U2hhZGVyIiwiZGVsZXRlUHJvZ3JhbSIsIldlYkdMMkNtZEZ1bmNDcmVhdGVJbnB1dEFzc2VtYmVyIiwiZ2xBdHRyaWJzIiwiYXR0cmlidXRlcyIsIm9mZnNldHMiLCJhdHRyaWIiLCJzdHJlYW0iLCJncHVWZXJ0ZXhCdWZmZXJzIiwiY29tcG9uZW50Q291bnQiLCJpc05vcm1hbGl6ZWQiLCJpc0luc3RhbmNlZCIsIldlYkdMMkNtZEZ1bmNEZXN0cm95SW5wdXRBc3NlbWJsZXIiLCJpdCIsImdsVkFPcyIsInZhbHVlcyIsInJlcyIsIm5leHQiLCJkb25lIiwiZGVsZXRlVmVydGV4QXJyYXkiLCJ2YWx1ZSIsInJldmVyc2VDVyIsImdsUHJpbWl0aXZlIiwiaW52YWxpZGF0ZUF0dGFjaG1lbnRzIiwiV2ViR0wyQ21kRnVuY0JlZ2luUmVuZGVyUGFzcyIsImNsZWFycyIsImlzQ0NXIiwicnMiLCJpc0Zyb250RmFjZUNDVyIsImZyb250RmFjZSIsIkNDVyIsIkNXIiwibGVmdCIsIngiLCJ0b3AiLCJ5Iiwic2Npc3NvclJlY3QiLCJqIiwiY29sb3JBdHRhY2htZW50IiwiY29sb3JBdHRhY2htZW50cyIsImxvYWRPcCIsIkdGWExvYWRPcCIsIkxPQUQiLCJDTEVBUiIsImJzIiwidGFyZ2V0cyIsImJsZW5kQ29sb3JNYXNrIiwiR0ZYQ29sb3JNYXNrIiwiQUxMIiwiY29sb3JNYXNrIiwiaXNPZmZzY3JlZW4iLCJjbGVhckNvbG9yIiwieiIsIkNPTE9SX0JVRkZFUl9CSVQiLCJjbGVhckJ1ZmZlcmZ2IiwiQ09MT1IiLCJESVNDQVJEIiwiZGVwdGhTdGVuY2lsQXR0YWNobWVudCIsImRlcHRoTG9hZE9wIiwiZHNzIiwiZGVwdGhXcml0ZSIsImRlcHRoTWFzayIsIkRFUFRIX0JVRkZFUl9CSVQiLCJzdGVuY2lsTG9hZE9wIiwic3RlbmNpbFdyaXRlTWFza0Zyb250Iiwic3RlbmNpbE1hc2tTZXBhcmF0ZSIsIkZST05UIiwic3RlbmNpbFdyaXRlTWFza0JhY2siLCJCQUNLIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiU1RFTkNJTF9BVFRBQ0hNRU5UIiwiaW52YWxpZGF0ZUZyYW1lYnVmZmVyIiwiciIsIlIiLCJnIiwiRyIsIkIiLCJBIiwiV2ViR0wyQ21kRnVuY0JpbmRTdGF0ZXMiLCJpc1NoYWRlckNoYW5nZWQiLCJjdWxsTW9kZSIsIkdGWEN1bGxNb2RlIiwiZGlzYWJsZSIsIkNVTExfRkFDRSIsImVuYWJsZSIsImN1bGxGYWNlIiwiZGVwdGhCaWFzU2xvcCIsInBvbHlnb25PZmZzZXQiLCJkZXB0aFRlc3QiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwic3RlbmNpbFRlc3RGcm9udCIsInN0ZW5jaWxUZXN0QmFjayIsIlNURU5DSUxfVEVTVCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJzdGVuY2lsUmVmRnJvbnQiLCJzdGVuY2lsUmVhZE1hc2tGcm9udCIsInN0ZW5jaWxGdW5jU2VwYXJhdGUiLCJzdGVuY2lsRmFpbE9wRnJvbnQiLCJzdGVuY2lsWkZhaWxPcEZyb250Iiwic3RlbmNpbFBhc3NPcEZyb250Iiwic3RlbmNpbE9wU2VwYXJhdGUiLCJzdGVuY2lsRnVuY0JhY2siLCJzdGVuY2lsUmVmQmFjayIsInN0ZW5jaWxSZWFkTWFza0JhY2siLCJzdGVuY2lsRmFpbE9wQmFjayIsInN0ZW5jaWxaRmFpbE9wQmFjayIsInN0ZW5jaWxQYXNzT3BCYWNrIiwiaXNBMkMiLCJTQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UiLCJibGVuZENvbG9yIiwidGFyZ2V0MCIsInRhcmdldDBDYWNoZSIsImJsZW5kIiwiQkxFTkQiLCJibGVuZEVxIiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRFcXVhdGlvblNlcGFyYXRlIiwiYmxlbmRTcmMiLCJibGVuZERzdCIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwiYmxlbmRGdW5jU2VwYXJhdGUiLCJncHVQaXBlbGluZUxheW91dCIsImJsb2NrTGVuIiwiZHluYW1pY09mZnNldEluZGljZXMiLCJnbEJsb2NrIiwiZ3B1RGVzY3JpcHRvclNldCIsImdwdURlc2NyaXB0b3IiLCJncHVEZXNjcmlwdG9ycyIsImR5bmFtaWNPZmZzZXRJbmRleFNldCIsImR5bmFtaWNPZmZzZXRJbmRleCIsImdsT2Zmc2V0IiwiZ2xCaW5kVUJPcyIsImdsQmluZFVCT09mZnNldHMiLCJiaW5kQnVmZmVyUmFuZ2UiLCJiaW5kQnVmZmVyQmFzZSIsInNhbXBsZXJMZW4iLCJkZXNjcmlwdG9ySW5kZXgiLCJkZXNjcmlwdG9ySW5kaWNlcyIsImFjdGl2ZVRleHR1cmUiLCJURVhUVVJFMCIsIm51bGxUZXgyRCIsImdsU2FtcGxlclVuaXRzIiwiYmluZFNhbXBsZXIiLCJnZXQiLCJjcmVhdGVWZXJ0ZXhBcnJheSIsImdsQXR0cmliIiwiZ2xJbnB1dCIsImF0dHJpYk9mZnNldCIsImVuYWJsZVZlcnRleEF0dHJpYkFycmF5IiwiZ2xDdXJyZW50QXR0cmliTG9jcyIsInZlcnRleEF0dHJpYlBvaW50ZXIiLCJ2ZXJ0ZXhBdHRyaWJEaXZpc29yIiwiZ3B1SW5kZXhCdWZmZXIiLCJtYXhWZXJ0ZXhBdHRyaWJ1dGVzIiwiZ2xFbmFibGVkQXR0cmliTG9jcyIsImRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImR5bmFtaWNTdGF0ZXMiLCJkc0xlbiIsImR5bmFtaWNTdGF0ZSIsIkdGWER5bmFtaWNTdGF0ZUZsYWdCaXQiLCJWSUVXUE9SVCIsIlNDSVNTT1IiLCJMSU5FX1dJRFRIIiwiREVQVEhfQklBUyIsImNvbnN0YW50RmFjdG9yIiwic2xvcGVGYWN0b3IiLCJCTEVORF9DT05TVEFOVFMiLCJTVEVOQ0lMX1dSSVRFX01BU0siLCJmYWNlIiwiR0ZYU3RlbmNpbEZhY2UiLCJ3cml0ZU1hc2siLCJzdGVuY2lsTWFzayIsIlNURU5DSUxfQ09NUEFSRV9NQVNLIiwicmVmZXJlbmNlIiwiY29tcGFyZU1hc2siLCJzdGVuY2lsRnVuYyIsIldlYkdMMkNtZEZ1bmNEcmF3IiwiZ3B1SW5kaXJlY3RCdWZmZXIiLCJzdWJEcmF3SW5mbyIsImluc3RhbmNlQ291bnQiLCJpbmRleENvdW50IiwiZmlyc3RJbmRleCIsImRyYXdFbGVtZW50c0luc3RhbmNlZCIsImdsSW5kZXhUeXBlIiwidmVydGV4Q291bnQiLCJkcmF3QXJyYXlzSW5zdGFuY2VkIiwiZmlyc3RWZXJ0ZXgiLCJkcmF3RWxlbWVudHMiLCJkcmF3QXJyYXlzIiwiY21kSWRzIiwiQ09VTlQiLCJXZWJHTDJDbWRGdW5jRXhlY3V0ZUNtZHMiLCJjbWRQYWNrYWdlIiwiZmlsbCIsImNtZCIsImFycmF5IiwiY21kSWQiLCJjbWQwIiwiY21kMiIsImNtZDMiLCJjbWQ0IiwiY21kNSIsIldlYkdMMkNtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZSIsIldlYkdMMkNtZEZ1bmNDb3B5VGV4SW1hZ2VzVG9UZXh0dXJlIiwidGV4SW1hZ2VzIiwibiIsInJlZ2lvbiIsInRleFN1YkltYWdlMkQiLCJ0ZXhTdWJyZXMiLCJ0ZXhPZmZzZXQiLCJmY291bnQiLCJiYXNlQXJyYXlMYXllciIsImxheWVyQ291bnQiLCJmbGFncyIsIkdGWFRleHR1cmVGbGFnQml0IiwiR0VOX01JUE1BUCIsImdlbmVyYXRlTWlwbWFwIiwiZm10SW5mbyIsInRleEV4dGVudCIsInBpeGVscyIsImNvbXByZXNzZWRUZXhTdWJJbWFnZTJEIiwiV2ViR0wyQ21kRnVuY0JsaXRGcmFtZWJ1ZmZlciIsInNyYyIsInNyY1JlY3QiLCJkc3RSZWN0IiwiZmlsdGVyIiwiZ2xSZWFkRnJhbWVidWZmZXIiLCJSRUFEX0ZSQU1FQlVGRkVSIiwicmViaW5kRkJPIiwiRFJBV19GUkFNRUJVRkZFUiIsIm1hc2siLCJnbEZpbHRlciIsImJsaXRGcmFtZWJ1ZmZlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcURBLE1BQU1BLFVBQW9CLEdBQUcsQ0FDekIsTUFEeUIsRUFDakI7QUFDUixRQUZ5QixFQUVqQjtBQUNSLFFBSHlCLEVBR2pCO0FBQ1IsUUFKeUIsQ0FJakI7QUFKaUIsR0FBN0I7QUFPQSxNQUFNQyxPQUFpQixHQUFHLENBQ3RCLENBRHNCLEVBRXRCLENBRnNCLEVBR3RCLENBSHNCLEVBSXRCLENBSnNCLEVBS3RCLEVBTHNCLEVBTXRCLEVBTnNCLEVBT3RCLEVBUHNCLENBQTFCOztBQVVBLE1BQU1DLE1BQU0sR0FBRyxJQUFJQyxZQUFKLENBQWlCLENBQWpCLENBQWYsQyxDQUVBOzs7QUFFQSxXQUFTQyxjQUFULENBQXlCQyxDQUF6QixFQUFvQ0MsQ0FBcEMsRUFBd0Q7QUFDcEQsUUFBTUMsQ0FBQyxHQUFHRixDQUFDLEdBQUdD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RUFFSWlhLE9BQU8sQ0FBQ2pNLENBRlosRUFFZWlNLE9BQU8sQ0FBQy9MLENBRnZCLEVBRTBCK0wsT0FBTyxDQUFDak0sQ0FBUixHQUFZaU0sT0FBTyxDQUFDbmEsS0FGOUMsRUFFcURtYSxPQUFPLENBQUMvTCxDQUFSLEdBQVkrTCxPQUFPLENBQUNqYSxNQUZ6RSxFQUdJdWEsSUFISixFQUdVQyxRQUhWOztBQUtBLFFBQUlILFNBQUosRUFBZTtBQUNYdHpCLE1BQUFBLEVBQUUsQ0FBQ29lLGVBQUgsQ0FBbUJwZSxFQUFFLENBQUNxZSxXQUF0QixFQUFtQ3pJLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQm9JLGFBQXJEO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhY2hlZEFycmF5IH0gZnJvbSAnLi4vLi4vbWVtb3AvY2FjaGVkLWFycmF5JztcclxuaW1wb3J0IHsgZXJyb3IsIGVycm9ySUQgfSBmcm9tICcuLi8uLi9wbGF0Zm9ybSc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclNvdXJjZSwgR0ZYRHJhd0luZm8sIEdGWEluZGlyZWN0QnVmZmVyIH0gZnJvbSAnLi4vYnVmZmVyJztcclxuaW1wb3J0IHtcclxuICAgIEdGWEJ1ZmZlclRleHR1cmVDb3B5LFxyXG4gICAgR0ZYQnVmZmVyVXNhZ2VCaXQsXHJcbiAgICBHRlhDb2xvck1hc2ssXHJcbiAgICBHRlhDdWxsTW9kZSxcclxuICAgIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQsXHJcbiAgICBHRlhGaWx0ZXIsXHJcbiAgICBHRlhGb3JtYXQsXHJcbiAgICBHRlhGb3JtYXRJbmZvcyxcclxuICAgIEdGWEZvcm1hdFNpemUsXHJcbiAgICBHRlhMb2FkT3AsXHJcbiAgICBHRlhNZW1vcnlVc2FnZUJpdCxcclxuICAgIEdGWFNhbXBsZUNvdW50LFxyXG4gICAgR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LFxyXG4gICAgR0ZYU3RlbmNpbEZhY2UsXHJcbiAgICBHRlhUZXh0dXJlRmxhZ0JpdCxcclxuICAgIEdGWFRleHR1cmVUeXBlLFxyXG4gICAgR0ZYVHlwZSxcclxuICAgIEdGWENvbG9yLFxyXG4gICAgR0ZYRm9ybWF0SW5mbyxcclxuICAgIEdGWFJlY3QsXHJcbiAgICBHRlhWaWV3cG9ydCxcclxufSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBXZWJHTEVYVCB9IGZyb20gJy4uL3dlYmdsL3dlYmdsLWRlZmluZSc7XHJcbmltcG9ydCB7IFdlYkdMMkNvbW1hbmRBbGxvY2F0b3IgfSBmcm9tICcuL3dlYmdsMi1jb21tYW5kLWFsbG9jYXRvcic7XHJcbmltcG9ydCB7XHJcbiAgICBJV2ViR0wyRGVwdGhCaWFzLFxyXG4gICAgSVdlYkdMMkRlcHRoQm91bmRzLFxyXG4gICAgSVdlYkdMMlN0ZW5jaWxDb21wYXJlTWFzayxcclxuICAgIElXZWJHTDJTdGVuY2lsV3JpdGVNYXNrLFxyXG59IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0wyRGV2aWNlIH0gZnJvbSAnLi93ZWJnbDItZGV2aWNlJztcclxuaW1wb3J0IHtcclxuICAgIElXZWJHTDJHUFVJbnB1dEFzc2VtYmxlcixcclxuICAgIElXZWJHTDJHUFVVbmlmb3JtLFxyXG4gICAgSVdlYkdMMkF0dHJpYixcclxuICAgIElXZWJHTDJHUFVEZXNjcmlwdG9yU2V0LFxyXG4gICAgSVdlYkdMMkdQVUJ1ZmZlcixcclxuICAgIElXZWJHTDJHUFVGcmFtZWJ1ZmZlcixcclxuICAgIElXZWJHTDJHUFVJbnB1dCxcclxuICAgIElXZWJHTDJHUFVQaXBlbGluZVN0YXRlLFxyXG4gICAgSVdlYkdMMkdQVVNhbXBsZXIsXHJcbiAgICBJV2ViR0wyR1BVU2hhZGVyLFxyXG4gICAgSVdlYkdMMkdQVVRleHR1cmUsXHJcbiAgICBJV2ViR0wyR1BVVW5pZm9ybUJsb2NrLFxyXG4gICAgSVdlYkdMMkdQVVVuaWZvcm1TYW1wbGVyLFxyXG4gICAgSVdlYkdMMkdQVVJlbmRlclBhc3MsXHJcbn0gZnJvbSAnLi93ZWJnbDItZ3B1LW9iamVjdHMnO1xyXG5pbXBvcnQgeyBHRlhVbmlmb3JtQmxvY2sgfSBmcm9tICcuLi9zaGFkZXInO1xyXG5cclxuY29uc3QgV2ViR0xXcmFwczogR0xlbnVtW10gPSBbXHJcbiAgICAweDI5MDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5SRVBFQVRcclxuICAgIDB4ODM3MCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk1JUlJPUkVEX1JFUEVBVFxyXG4gICAgMHg4MTJGLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQ0xBTVBfVE9fRURHRVxyXG4gICAgMHg4MTJGLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQ0xBTVBfVE9fRURHRVxyXG5dO1xyXG5cclxuY29uc3QgU0FNUExFUzogbnVtYmVyW10gPSBbXHJcbiAgICAxLFxyXG4gICAgMixcclxuICAgIDQsXHJcbiAgICA4LFxyXG4gICAgMTYsXHJcbiAgICAzMixcclxuICAgIDY0LFxyXG5dO1xyXG5cclxuY29uc3QgX2YzMnY0ID0gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuXHJcbmZ1bmN0aW9uIENtcEYzMk5vdEV1cWFsIChhOiBudW1iZXIsIGI6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgYyA9IGEgLSBiO1xyXG4gICAgcmV0dXJuIChjID4gMC4wMDAwMDEgfHwgYyA8IC0wLjAwMDAwMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHRlhGb3JtYXRUb1dlYkdMVHlwZSAoZm9ybWF0OiBHRlhGb3JtYXQsIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KTogR0xlbnVtIHtcclxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI4U046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI4VUk6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI4STogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2RjogcmV0dXJuIGdsLkhBTEZfRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2VUk6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkc4U046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHOFVJOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhJOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzE2RjogcmV0dXJuIGdsLkhBTEZfRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkcxNlVJOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkcxNkk6IHJldHVybiBnbC5TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMzJVSTogcmV0dXJuIGdsLlVOU0lHTkVEX0lOVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzMySTogcmV0dXJuIGdsLklOVDtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuU1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjhTTjogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCOFVJOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I4STogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTZGOiByZXR1cm4gZ2wuSEFMRl9GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNlVJOiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMzJGOiByZXR1cm4gZ2wuRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMzJVSTogcmV0dXJuIGdsLlVOU0lHTkVEX0lOVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IzMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJHUkE4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuU1JHQjhfQTg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4U046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4VUk6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4STogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2RjogcmV0dXJuIGdsLkhBTEZfRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2VUk6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI1RzZCNTogcmV0dXJuIGdsLlVOU0lHTkVEX1NIT1JUXzVfNl81O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIxMUcxMUIxMEY6IHJldHVybiBnbC5VTlNJR05FRF9JTlRfMTBGXzExRl8xMUZfUkVWO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjVBMTogcmV0dXJuIGdsLlVOU0lHTkVEX1NIT1JUXzVfNV81XzE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTQ6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVF80XzRfNF80O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjEwQTI6IHJldHVybiBnbC5VTlNJR05FRF9JTlRfMl8xMF8xMF8xMF9SRVY7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTBBMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UXzJfMTBfMTBfMTBfUkVWO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjlFNTogcmV0dXJuIGdsLkZMT0FUO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMTY6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMTZTODogcmV0dXJuIGdsLlVOU0lHTkVEX0lOVF8yNF84OyAvLyBubyBEMTZTOCBzdXBwb3J0XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDI0OiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQyNFM4OiByZXR1cm4gZ2wuVU5TSUdORURfSU5UXzI0Xzg7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkZfUzg6IHJldHVybiBnbC5GTE9BVF8zMl9VTlNJR05FRF9JTlRfMjRfOF9SRVY7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX1NSR0I6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMyX1NSR0I6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMzogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzX1NSR0I6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDNDogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM0X1NOT1JNOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzU6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDNV9TTk9STTogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM2SF9TRjE2OiByZXR1cm4gZ2wuRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM2SF9VRjE2OiByZXR1cm4gZ2wuRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM3OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzdfU1JHQjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQ19SR0I4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCOF9BMTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCOF9BMTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUjExOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUjExU046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SRzExOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMVNOOiByZXR1cm4gZ2wuQllURTtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCMjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCQTI6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjQ6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkE0OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQzJfMkJQUDogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVEMyXzRCUFA6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfNHg0OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDQ6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzV4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfNng1OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDY6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfOHg2OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDg6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDY6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDg6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDEwOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMngxMDpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTI6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV80eDQ6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV81eDQ6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV81eDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV82eDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV82eDY6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV84eDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV84eDY6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV84eDg6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg1OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDg6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHgxMDpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEyeDEwOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTI6XHJcbiAgICAgICAgICAgIHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG5cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEdGWEZvcm1hdFRvV2ViR0xJbnRlcm5hbEZvcm1hdCAoZm9ybWF0OiBHRlhGb3JtYXQsIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KTogR0xlbnVtIHtcclxuICAgIHN3aXRjaCAoZm9ybWF0KSB7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQTg6IHJldHVybiBnbC5BTFBIQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5MODogcmV0dXJuIGdsLkxVTUlOQU5DRTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5MQTg6IHJldHVybiBnbC5MVU1JTkFOQ0VfQUxQSEE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjg6IHJldHVybiBnbC5SODtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SOFNOOiByZXR1cm4gZ2wuUjhfU05PUk07XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhVSTogcmV0dXJuIGdsLlI4VUk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhJOiByZXR1cm4gZ2wuUjhJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHODogcmV0dXJuIGdsLlJHODtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhTTjogcmV0dXJuIGdsLlJHOF9TTk9STTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhVSTogcmV0dXJuIGdsLlJHOFVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHOEk6IHJldHVybiBnbC5SRzhJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjg6IHJldHVybiBnbC5SR0I4O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjhTTjogcmV0dXJuIGdsLlJHQjhfU05PUk07XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCOFVJOiByZXR1cm4gZ2wuUkdCOFVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjhJOiByZXR1cm4gZ2wuUkdCOEk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkdSQTg6IHJldHVybiBnbC5SR0JBODtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBODogcmV0dXJuIGdsLlJHQkE4O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4U046IHJldHVybiBnbC5SR0JBOF9TTk9STTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBOFVJOiByZXR1cm4gZ2wuUkdCQThVSTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBOEk6IHJldHVybiBnbC5SR0JBOEk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2STogcmV0dXJuIGdsLlIxNkk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2VUk6IHJldHVybiBnbC5SMTZVSTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMTZGOiByZXR1cm4gZ2wuUjE2RjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzE2STogcmV0dXJuIGdsLlJHMTZJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMTZVSTogcmV0dXJuIGdsLlJHMTZVSTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzE2RjogcmV0dXJuIGdsLlJHMTZGO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjE2STogcmV0dXJuIGdsLlJHQjE2STtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNlVJOiByZXR1cm4gZ2wuUkdCMTZVSTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNkY6IHJldHVybiBnbC5SR0IxNkY7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2STogcmV0dXJuIGdsLlJHQkExNkk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2VUk6IHJldHVybiBnbC5SR0JBMTZVSTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZGOiByZXR1cm4gZ2wuUkdCQTE2RjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMzJJOiByZXR1cm4gZ2wuUjMySTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMzJVSTogcmV0dXJuIGdsLlIzMlVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMkY6IHJldHVybiBnbC5SMzJGO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMzJJOiByZXR1cm4gZ2wuUkczMkk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkczMlVJOiByZXR1cm4gZ2wuUkczMlVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMzJGOiByZXR1cm4gZ2wuUkczMkY7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMzJJOiByZXR1cm4gZ2wuUkdCMzJJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjMyVUk6IHJldHVybiBnbC5SR0IzMlVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjMyRjogcmV0dXJuIGdsLlJHQjMyRjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMzJJOiByZXR1cm4gZ2wuUkdCQTMySTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMzJVSTogcmV0dXJuIGdsLlJHQkEzMlVJO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMkY6IHJldHVybiBnbC5SR0JBMzJGO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI1RzZCNTogcmV0dXJuIGdsLlJHQjU2NTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I1QTE6IHJldHVybiBnbC5SR0I1X0ExO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE0OiByZXR1cm4gZ2wuUkdCQTQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTBBMjogcmV0dXJuIGdsLlJHQjEwX0EyO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjEwQTJVSTogcmV0dXJuIGdsLlJHQjEwX0EyVUk7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjExRzExQjEwRjogcmV0dXJuIGdsLlIxMUZfRzExRl9CMTBGO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQxNjogcmV0dXJuIGdsLkRFUFRIX0NPTVBPTkVOVDE2O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQxNlM4OiByZXR1cm4gZ2wuREVQVEgyNF9TVEVOQ0lMODsgLy8gbm8gRDE2Uzggc3VwcG9ydFxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQyNDogcmV0dXJuIGdsLkRFUFRIX0NPTVBPTkVOVDI0O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQyNFM4OiByZXR1cm4gZ2wuREVQVEgyNF9TVEVOQ0lMODtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMzJGOiByZXR1cm4gZ2wuREVQVEhfQ09NUE9ORU5UMzJGO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkZfUzg6IHJldHVybiBnbC5ERVBUSDMyRl9TVEVOQ0lMODtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfUzNUQ19EWFQxX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfQUxQSEE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQxX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQl9TM1RDX0RYVDFfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMV9TUkdCX0FMUEhBOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUM19FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMyX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQzX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzM6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQ1X0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzNfU1JHQjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDVfRVhUO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVENfUkdCODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0w7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0I4X0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfRVRDMjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1JHQjhfQTE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQjhfUFVOQ0hUSFJPVUdIX0FMUEhBMV9FVEMyO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjhfQTE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1JHQkE4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBOF9FVEMyX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4X0E4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfRVRDMl9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1IxMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUjExX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUjExU046IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NJR05FRF9SMTFfRUFDO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SRzExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SRzExX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMVNOOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TSUdORURfUkcxMV9FQUM7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjI6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9QVlJUQ18yQlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkEyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzJCUFBWMV9JTUc7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCNDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX1BWUlRDXzRCUFBWMV9JTUc7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCQTQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNRztcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzR4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzR4NF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzV4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzV4NF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzV4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzV4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzZ4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzZ4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzZ4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzZ4Nl9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzh4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzh4Nl9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzh4OF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHg4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4OF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDEwOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4MTBfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMngxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEyeDEwX0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTI6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMngxMl9LSFI7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNHg0OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ180eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNXg0OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNXg1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNng1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNng2OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfOHg1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfOHg2OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfOHg4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg2OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4MTA6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDEwX0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEyeDEwOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMngxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMngxMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTJfS0hSO1xyXG5cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdGWEZvcm1hdCwgY29udmVydCB0byBXZWJHTCBpbnRlcm5hbCBmb3JtYXQgZmFpbGVkLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHRlhGb3JtYXRUb1dlYkdMRm9ybWF0IChmb3JtYXQ6IEdGWEZvcm1hdCwgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpOiBHTGVudW0ge1xyXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BODogcmV0dXJuIGdsLkFMUEhBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0Lkw4OiByZXR1cm4gZ2wuTFVNSU5BTkNFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkxBODogcmV0dXJuIGdsLkxVTUlOQU5DRV9BTFBIQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SOFNOOiByZXR1cm4gZ2wuUkVEO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI4VUk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhJOiByZXR1cm4gZ2wuUkVEO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhTTjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhVSTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhJOiByZXR1cm4gZ2wuUkc7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I4U046XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCOFVJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjhJOiByZXR1cm4gZ2wuUkdCO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJHUkE4OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4U046XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQThVSTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBOEk6IHJldHVybiBnbC5SR0JBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIxNlVJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIxNkk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2RjogcmV0dXJuIGdsLlJFRDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzE2VUk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkcxNkk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkcxNkY6IHJldHVybiBnbC5SRztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNlVJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjE2STpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNkY6IHJldHVybiBnbC5SR0I7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2VUk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2STpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZGOiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMzJVSTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMzJJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMkY6IHJldHVybiBnbC5SRUQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkczMlVJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMzJJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMzJGOiByZXR1cm4gZ2wuUkc7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMzJVSTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IzMkk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMzJGOiByZXR1cm4gZ2wuUkdCO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMlVJOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMkk6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTMyRjogcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTBBMjogcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjExRzExQjEwRjogcmV0dXJuIGdsLlJHQjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SNUc2QjU6IHJldHVybiBnbC5SR0I7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCNUExOiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBNDogcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDE2OiByZXR1cm4gZ2wuREVQVEhfQ09NUE9ORU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQxNlM4OiByZXR1cm4gZ2wuREVQVEhfU1RFTkNJTDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMjQ6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDI0Uzg6IHJldHVybiBnbC5ERVBUSF9TVEVOQ0lMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkY6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDMyRl9TODogcmV0dXJuIGdsLkRFUFRIX1NURU5DSUw7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX0FMUEhBOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQl9BTFBIQTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDFfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMl9TUkdCOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUM19FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVDtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDX1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCOF9FVEMyO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9QVU5DSFRIUk9VR0hfQUxQSEExX0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0JBODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQThfRVRDMl9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCOF9BODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0VUQzJfRUFDO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SMTE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1IxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1IxMVNOOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TSUdORURfUjExX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkcxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1JHMTFTTjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU0lHTkVEX1JHMTFfRUFDO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0IyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNRztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0JBMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9QVlJUQ18yQlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9QVlJUQ180QlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkE0OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzRCUFBWMV9JTUc7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV80eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ180eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHg1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHgxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDEwX0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTA6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMngxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEyeDEyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTJfS0hSO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzR4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNHg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4Nl9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDEwOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHgxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMngxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTBfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTI6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEyeDEyX0tIUjtcclxuXHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhGb3JtYXQsIGNvbnZlcnQgdG8gV2ViR0wgZm9ybWF0IGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBHRlhUeXBlVG9XZWJHTFR5cGUgKHR5cGU6IEdGWFR5cGUsIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KTogR0xlbnVtIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MOiByZXR1cm4gZ2wuQk9PTDtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDI6IHJldHVybiBnbC5CT09MX1ZFQzI7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0wzOiByZXR1cm4gZ2wuQk9PTF9WRUMzO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MNDogcmV0dXJuIGdsLkJPT0xfVkVDNDtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UOiByZXR1cm4gZ2wuSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQyOiByZXR1cm4gZ2wuSU5UX1ZFQzI7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLklOVDM6IHJldHVybiBnbC5JTlRfVkVDMztcclxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UNDogcmV0dXJuIGdsLklOVF9WRUM0O1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5VSU5UOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDI6IHJldHVybiBnbC5GTE9BVF9WRUMyO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDM6IHJldHVybiBnbC5GTE9BVF9WRUMzO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDQ6IHJldHVybiBnbC5GTE9BVF9WRUM0O1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQyOiByZXR1cm4gZ2wuRkxPQVRfTUFUMjtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUMlgzOiByZXR1cm4gZ2wuRkxPQVRfTUFUMngzO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQyWDQ6IHJldHVybiBnbC5GTE9BVF9NQVQyeDQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDNYMjogcmV0dXJuIGdsLkZMT0FUX01BVDN4MjtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUMzogcmV0dXJuIGdsLkZMT0FUX01BVDM7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDNYNDogcmV0dXJuIGdsLkZMT0FUX01BVDN4NDtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUNFgyOiByZXR1cm4gZ2wuRkxPQVRfTUFUNHgyO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQ0WDM6IHJldHVybiBnbC5GTE9BVF9NQVQ0eDM7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDQ6IHJldHVybiBnbC5GTE9BVF9NQVQ0O1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5TQU1QTEVSMkQ6IHJldHVybiBnbC5TQU1QTEVSXzJEO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5TQU1QTEVSMkRfQVJSQVk6IHJldHVybiBnbC5TQU1QTEVSXzJEX0FSUkFZO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5TQU1QTEVSM0Q6IHJldHVybiBnbC5TQU1QTEVSXzNEO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5TQU1QTEVSX0NVQkU6IHJldHVybiBnbC5TQU1QTEVSX0NVQkU7XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHTFR5cGUsIGNvbnZlcnQgdG8gR0wgdHlwZSBmYWlsZWQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBHRlhUeXBlLlVOS05PV047XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXZWJHTFR5cGVUb0dGWFR5cGUgKGdsVHlwZTogR0xlbnVtLCBnbDogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCk6IEdGWFR5cGUge1xyXG4gICAgc3dpdGNoIChnbFR5cGUpIHtcclxuICAgICAgICBjYXNlIGdsLkJPT0w6IHJldHVybiBHRlhUeXBlLkJPT0w7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzI6IHJldHVybiBHRlhUeXBlLkJPT0wyO1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMzOiByZXR1cm4gR0ZYVHlwZS5CT09MMztcclxuICAgICAgICBjYXNlIGdsLkJPT0xfVkVDNDogcmV0dXJuIEdGWFR5cGUuQk9PTDQ7XHJcbiAgICAgICAgY2FzZSBnbC5JTlQ6IHJldHVybiBHRlhUeXBlLklOVDtcclxuICAgICAgICBjYXNlIGdsLklOVF9WRUMyOiByZXR1cm4gR0ZYVHlwZS5JTlQyO1xyXG4gICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzM6IHJldHVybiBHRlhUeXBlLklOVDM7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDNDogcmV0dXJuIEdGWFR5cGUuSU5UNDtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDogcmV0dXJuIEdGWFR5cGUuVUlOVDtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVF9WRUMyOiByZXR1cm4gR0ZYVHlwZS5VSU5UMjtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVF9WRUMzOiByZXR1cm4gR0ZYVHlwZS5VSU5UMztcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVF9WRUM0OiByZXR1cm4gR0ZYVHlwZS5VSU5UNDtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDogcmV0dXJuIEdGWFR5cGUuVUlOVDtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUOiByZXR1cm4gR0ZYVHlwZS5GTE9BVDtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzI6IHJldHVybiBHRlhUeXBlLkZMT0FUMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzM6IHJldHVybiBHRlhUeXBlLkZMT0FUMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzQ6IHJldHVybiBHRlhUeXBlLkZMT0FUNDtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDI6IHJldHVybiBHRlhUeXBlLk1BVDI7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyeDM6IHJldHVybiBHRlhUeXBlLk1BVDJYMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDJ4NDogcmV0dXJuIEdGWFR5cGUuTUFUMlg0O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUM3gyOiByZXR1cm4gR0ZYVHlwZS5NQVQzWDI7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQzOiByZXR1cm4gR0ZYVHlwZS5NQVQzO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUM3g0OiByZXR1cm4gR0ZYVHlwZS5NQVQzWDQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQ0eDI6IHJldHVybiBHRlhUeXBlLk1BVDRYMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDR4MzogcmV0dXJuIEdGWFR5cGUuTUFUNFgzO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUNDogcmV0dXJuIEdGWFR5cGUuTUFUNDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfMkQ6IHJldHVybiBHRlhUeXBlLlNBTVBMRVIyRDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfMkRfQVJSQVk6IHJldHVybiBHRlhUeXBlLlNBTVBMRVIyRF9BUlJBWTtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfM0Q6IHJldHVybiBHRlhUeXBlLlNBTVBMRVIzRDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfQ1VCRTogcmV0dXJuIEdGWFR5cGUuU0FNUExFUl9DVUJFO1xyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgR0xUeXBlLCBjb252ZXJ0IHRvIEdGWFR5cGUgZmFpbGVkLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gR0ZYVHlwZS5VTktOT1dOO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gV2ViR0xHZXRUeXBlU2l6ZSAoZ2xUeXBlOiBHTGVudW0sIGdsOiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0KTogR0ZYVHlwZSB7XHJcbiAgICBzd2l0Y2ggKGdsVHlwZSkge1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzI6IHJldHVybiA4O1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMzOiByZXR1cm4gMTI7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLklOVDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDMjogcmV0dXJuIDg7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDMzogcmV0dXJuIDEyO1xyXG4gICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5VTlNJR05FRF9JTlRfVkVDMjogcmV0dXJuIDg7XHJcbiAgICAgICAgY2FzZSBnbC5VTlNJR05FRF9JTlRfVkVDMzogcmV0dXJuIDEyO1xyXG4gICAgICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzI6IHJldHVybiA4O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfVkVDMzogcmV0dXJuIDEyO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfVkVDNDogcmV0dXJuIDE2O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUMjogcmV0dXJuIDE2O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUMngzOiByZXR1cm4gMjQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyeDQ6IHJldHVybiAzMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDN4MjogcmV0dXJuIDI0O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUMzogcmV0dXJuIDM2O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUM3g0OiByZXR1cm4gNDg7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQ0eDI6IHJldHVybiAzMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDR4MzogcmV0dXJuIDQ4O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUNDogcmV0dXJuIDY0O1xyXG4gICAgICAgIGNhc2UgZ2wuU0FNUExFUl8yRDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5TQU1QTEVSXzJEX0FSUkFZOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfMkRfQVJSQVlfU0hBRE9XOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfM0Q6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuU0FNUExFUl9DVUJFOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLklOVF9TQU1QTEVSXzJEOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLklOVF9TQU1QTEVSXzJEX0FSUkFZOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLklOVF9TQU1QTEVSXzNEOiByZXR1cm4gNDtcclxuICAgICAgICBjYXNlIGdsLklOVF9TQU1QTEVSX0NVQkU6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UX1NBTVBMRVJfMkQ6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UX1NBTVBMRVJfMkRfQVJSQVk6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UX1NBTVBMRVJfM0Q6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuVU5TSUdORURfSU5UX1NBTVBMRVJfQ1VCRTogcmV0dXJuIDQ7XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHTFR5cGUsIGdldCB0eXBlIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBXZWJHTEdldENvbXBvbmVudENvdW50IChnbFR5cGU6IEdMZW51bSwgZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpOiBHRlhUeXBlIHtcclxuICAgIHN3aXRjaCAoZ2xUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyOiByZXR1cm4gMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDJ4MzogcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyeDQ6IHJldHVybiAyO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUM3gyOiByZXR1cm4gMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDM6IHJldHVybiAzO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUM3g0OiByZXR1cm4gMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDR4MjogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQ0eDM6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUNDogcmV0dXJuIDQ7XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFdlYkdMQ21wRnVuY3M6IEdMZW51bVtdID0gW1xyXG4gICAgMHgwMjAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTkVWRVIsXHJcbiAgICAweDAyMDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MRVNTLFxyXG4gICAgMHgwMjAyLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRVFVQUwsXHJcbiAgICAweDAyMDMsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5MRVFVQUwsXHJcbiAgICAweDAyMDQsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5HUkVBVEVSLFxyXG4gICAgMHgwMjA1LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTk9URVFVQUwsXHJcbiAgICAweDAyMDYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5HRVFVQUwsXHJcbiAgICAweDAyMDcsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5BTFdBWVMsXHJcbl07XHJcblxyXG5jb25zdCBXZWJHTFN0ZW5jaWxPcHM6IEdMZW51bVtdID0gW1xyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuWkVSTyxcclxuICAgIDB4MUUwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LktFRVAsXHJcbiAgICAweDFFMDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5SRVBMQUNFLFxyXG4gICAgMHgxRTAyLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuSU5DUixcclxuICAgIDB4MUUwMywgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkRFQ1IsXHJcbiAgICAweDE1MEEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5JTlZFUlQsXHJcbiAgICAweDg1MDcsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5JTkNSX1dSQVAsXHJcbiAgICAweDg1MDgsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5ERUNSX1dSQVAsXHJcbl07XHJcblxyXG5jb25zdCBXZWJHTEJsZW5kT3BzOiBHTGVudW1bXSA9IFtcclxuICAgIDB4ODAwNiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZVTkNfQURELFxyXG4gICAgMHg4MDBBLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRlVOQ19TVUJUUkFDVCxcclxuICAgIDB4ODAwQiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZVTkNfUkVWRVJTRV9TVUJUUkFDVCxcclxuICAgIDB4ODAwNiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZVTkNfQURELFxyXG4gICAgMHg4MDA2LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRlVOQ19BREQsXHJcbl07XHJcblxyXG5jb25zdCBXZWJHTEJsZW5kRmFjdG9yczogR0xlbnVtW10gPSBbXHJcbiAgICAweDAwMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5aRVJPLFxyXG4gICAgMHgwMDAxLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FLFxyXG4gICAgMHgwMzAyLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuU1JDX0FMUEhBLFxyXG4gICAgMHgwMzA0LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRFNUX0FMUEhBLFxyXG4gICAgMHgwMzAzLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FX01JTlVTX1NSQ19BTFBIQSxcclxuICAgIDB4MDMwNSwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk9ORV9NSU5VU19EU1RfQUxQSEEsXHJcbiAgICAweDAzMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5TUkNfQ09MT1IsXHJcbiAgICAweDAzMDYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5EU1RfQ09MT1IsXHJcbiAgICAweDAzMDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5PTkVfTUlOVVNfU1JDX0NPTE9SLFxyXG4gICAgMHgwMzA3LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FX01JTlVTX0RTVF9DT0xPUixcclxuICAgIDB4MDMwOCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlNSQ19BTFBIQV9TQVRVUkFURSxcclxuICAgIDB4ODAwMSwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkNPTlNUQU5UX0NPTE9SLFxyXG4gICAgMHg4MDAyLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SLFxyXG4gICAgMHg4MDAzLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQ09OU1RBTlRfQUxQSEEsXHJcbiAgICAweDgwMDQsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5PTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEEsXHJcbl07XHJcblxyXG5leHBvcnQgZW51bSBXZWJHTDJDbWQge1xyXG4gICAgQkVHSU5fUkVOREVSX1BBU1MsXHJcbiAgICBFTkRfUkVOREVSX1BBU1MsXHJcbiAgICBCSU5EX1NUQVRFUyxcclxuICAgIERSQVcsXHJcbiAgICBVUERBVEVfQlVGRkVSLFxyXG4gICAgQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSxcclxuICAgIENPVU5ULFxyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgV2ViR0wyQ21kT2JqZWN0IHtcclxuICAgIHB1YmxpYyBjbWRUeXBlOiBXZWJHTDJDbWQ7XHJcbiAgICBwdWJsaWMgcmVmQ291bnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGU6IFdlYkdMMkNtZCkge1xyXG4gICAgICAgIHRoaXMuY21kVHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGNsZWFyICgpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyQ21kQmVnaW5SZW5kZXJQYXNzIGV4dGVuZHMgV2ViR0wyQ21kT2JqZWN0IHtcclxuXHJcbiAgICBwdWJsaWMgZ3B1UmVuZGVyUGFzczogSVdlYkdMMkdQVVJlbmRlclBhc3MgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMMkdQVUZyYW1lYnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgcmVuZGVyQXJlYSA9IG5ldyBHRlhSZWN0KCk7XHJcbiAgICBwdWJsaWMgY2xlYXJDb2xvcnM6IEdGWENvbG9yW10gPSBbXTtcclxuICAgIHB1YmxpYyBjbGVhckRlcHRoOiBudW1iZXIgPSAxLjA7XHJcbiAgICBwdWJsaWMgY2xlYXJTdGVuY2lsOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihXZWJHTDJDbWQuQkVHSU5fUkVOREVSX1BBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5ncHVGcmFtZWJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbG9ycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0wyQ21kQmluZFN0YXRlcyBleHRlbmRzIFdlYkdMMkNtZE9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGdwdVBpcGVsaW5lU3RhdGU6IElXZWJHTDJHUFVQaXBlbGluZVN0YXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTDJHUFVJbnB1dEFzc2VtYmxlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGdwdURlc2NyaXB0b3JTZXRzOiBJV2ViR0wyR1BVRGVzY3JpcHRvclNldFtdID0gW107XHJcbiAgICBwdWJsaWMgZHluYW1pY09mZnNldHM6IG51bWJlcltdID0gW107XHJcbiAgICBwdWJsaWMgdmlld3BvcnQ6IEdGWFZpZXdwb3J0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2Npc3NvcjogR0ZYUmVjdCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGxpbmVXaWR0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZGVwdGhCaWFzOiBJV2ViR0wyRGVwdGhCaWFzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgYmxlbmRDb25zdGFudHM6IG51bWJlcltdID0gW107XHJcbiAgICBwdWJsaWMgZGVwdGhCb3VuZHM6IElXZWJHTDJEZXB0aEJvdW5kcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHN0ZW5jaWxXcml0ZU1hc2s6IElXZWJHTDJTdGVuY2lsV3JpdGVNYXNrIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3RlbmNpbENvbXBhcmVNYXNrOiBJV2ViR0wyU3RlbmNpbENvbXBhcmVNYXNrIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKFdlYkdMMkNtZC5CSU5EX1NUQVRFUyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLmdwdVBpcGVsaW5lU3RhdGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZ3B1RGVzY3JpcHRvclNldHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLmR5bmFtaWNPZmZzZXRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zY2lzc29yID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxpbmVXaWR0aCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5kZXB0aEJpYXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYmxlbmRDb25zdGFudHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLmRlcHRoQm91bmRzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0ZW5jaWxXcml0ZU1hc2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RlbmNpbENvbXBhcmVNYXNrID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMkNtZERyYXcgZXh0ZW5kcyBXZWJHTDJDbWRPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBkcmF3SW5mbyA9IG5ldyBHRlhEcmF3SW5mbygpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihXZWJHTDJDbWQuRFJBVyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMkNtZFVwZGF0ZUJ1ZmZlciBleHRlbmRzIFdlYkdMMkNtZE9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGdwdUJ1ZmZlcjogSVdlYkdMMkdQVUJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGJ1ZmZlcjogR0ZYQnVmZmVyU291cmNlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgb2Zmc2V0OiBudW1iZXIgPSAwO1xyXG4gICAgcHVibGljIHNpemU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKFdlYkdMMkNtZC5VUERBVEVfQlVGRkVSKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuZ3B1QnVmZmVyID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTDJDbWRDb3B5QnVmZmVyVG9UZXh0dXJlIGV4dGVuZHMgV2ViR0wyQ21kT2JqZWN0IHtcclxuXHJcbiAgICBwdWJsaWMgZ3B1VGV4dHVyZTogSVdlYkdMMkdQVVRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBidWZmZXJzOiBBcnJheUJ1ZmZlclZpZXdbXSA9IFtdO1xyXG4gICAgcHVibGljIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoV2ViR0wyQ21kLkNPUFlfQlVGRkVSX1RPX1RFWFRVUkUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5ncHVUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJ1ZmZlcnMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLnJlZ2lvbnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMkNtZFBhY2thZ2Uge1xyXG4gICAgcHVibGljIGNtZHM6IENhY2hlZEFycmF5PFdlYkdMMkNtZD4gPSBuZXcgQ2FjaGVkQXJyYXkoMSk7XHJcbiAgICBwdWJsaWMgYmVnaW5SZW5kZXJQYXNzQ21kczogQ2FjaGVkQXJyYXk8V2ViR0wyQ21kQmVnaW5SZW5kZXJQYXNzPiA9IG5ldyBDYWNoZWRBcnJheSgxKTtcclxuICAgIHB1YmxpYyBiaW5kU3RhdGVzQ21kczogQ2FjaGVkQXJyYXk8V2ViR0wyQ21kQmluZFN0YXRlcz4gPSBuZXcgQ2FjaGVkQXJyYXkoMSk7XHJcbiAgICBwdWJsaWMgZHJhd0NtZHM6IENhY2hlZEFycmF5PFdlYkdMMkNtZERyYXc+ID0gbmV3IENhY2hlZEFycmF5KDEpO1xyXG4gICAgcHVibGljIHVwZGF0ZUJ1ZmZlckNtZHM6IENhY2hlZEFycmF5PFdlYkdMMkNtZFVwZGF0ZUJ1ZmZlcj4gPSBuZXcgQ2FjaGVkQXJyYXkoMSk7XHJcbiAgICBwdWJsaWMgY29weUJ1ZmZlclRvVGV4dHVyZUNtZHM6IENhY2hlZEFycmF5PFdlYkdMMkNtZENvcHlCdWZmZXJUb1RleHR1cmU+ID0gbmV3IENhY2hlZEFycmF5KDEpO1xyXG5cclxuICAgIHB1YmxpYyBjbGVhckNtZHMgKGFsbG9jYXRvcjogV2ViR0wyQ29tbWFuZEFsbG9jYXRvcikge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5iZWdpblJlbmRlclBhc3NDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxvY2F0b3IuYmVnaW5SZW5kZXJQYXNzQ21kUG9vbC5mcmVlQ21kcyh0aGlzLmJlZ2luUmVuZGVyUGFzc0NtZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmJlZ2luUmVuZGVyUGFzc0NtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJpbmRTdGF0ZXNDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxvY2F0b3IuYmluZFN0YXRlc0NtZFBvb2wuZnJlZUNtZHModGhpcy5iaW5kU3RhdGVzQ21kcyk7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZFN0YXRlc0NtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRyYXdDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxvY2F0b3IuZHJhd0NtZFBvb2wuZnJlZUNtZHModGhpcy5kcmF3Q21kcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0NtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZUJ1ZmZlckNtZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbG9jYXRvci51cGRhdGVCdWZmZXJDbWRQb29sLmZyZWVDbWRzKHRoaXMudXBkYXRlQnVmZmVyQ21kcyk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnVmZmVyQ21kcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbG9jYXRvci5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kUG9vbC5mcmVlQ21kcyh0aGlzLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzKTtcclxuICAgICAgICAgICAgdGhpcy5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbWRzLmNsZWFyKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jQ3JlYXRlQnVmZmVyIChkZXZpY2U6IFdlYkdMMkRldmljZSwgZ3B1QnVmZmVyOiBJV2ViR0wyR1BVQnVmZmVyKSB7XHJcblxyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcbiAgICBjb25zdCBjYWNoZSA9IGRldmljZS5zdGF0ZUNhY2hlO1xyXG4gICAgY29uc3QgZ2xVc2FnZTogR0xlbnVtID0gZ3B1QnVmZmVyLm1lbVVzYWdlICYgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCA/IGdsLkRZTkFNSUNfRFJBVyA6IGdsLlNUQVRJQ19EUkFXO1xyXG5cclxuICAgIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVgpIHtcclxuXHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuQVJSQVlfQlVGRkVSO1xyXG4gICAgICAgIGNvbnN0IGdsQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcblxyXG4gICAgICAgIGlmIChnbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBncHVCdWZmZXIuZ2xCdWZmZXIgPSBnbEJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlci5zaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xBcnJheUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xBcnJheUJ1ZmZlciA9IGdwdUJ1ZmZlci5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLnNpemUsIGdsVXNhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsQXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRFWCkge1xyXG5cclxuICAgICAgICBncHVCdWZmZXIuZ2xUYXJnZXQgPSBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUjtcclxuICAgICAgICBjb25zdCBnbEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIGlmIChnbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBncHVCdWZmZXIuZ2xCdWZmZXIgPSBnbEJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlci5zaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBncHVCdWZmZXIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLnNpemUsIGdsVXNhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNKSB7XHJcblxyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLlVOSUZPUk1fQlVGRkVSO1xyXG4gICAgICAgIGNvbnN0IGdsQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgaWYgKGdsQnVmZmVyICYmIGdwdUJ1ZmZlci5zaXplID4gMCkge1xyXG4gICAgICAgICAgICBncHVCdWZmZXIuZ2xCdWZmZXIgPSBnbEJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKGRldmljZS5zdGF0ZUNhY2hlLmdsVW5pZm9ybUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLlVOSUZPUk1fQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xVbmlmb3JtQnVmZmVyID0gZ3B1QnVmZmVyLmdsQnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLlVOSUZPUk1fQlVGRkVSLCBncHVCdWZmZXIuc2l6ZSwgZ2xVc2FnZSk7XHJcblxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLlVOSUZPUk1fQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xVbmlmb3JtQnVmZmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNUKSB7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH0gZWxzZSBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNUKSB7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH0gZWxzZSBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfU1JDKSB7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgR0ZYQnVmZmVyVHlwZSwgY3JlYXRlIGJ1ZmZlciBmYWlsZWQuJyk7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNEZXN0cm95QnVmZmVyIChkZXZpY2U6IFdlYkdMMkRldmljZSwgZ3B1QnVmZmVyOiBJV2ViR0wyR1BVQnVmZmVyKSB7XHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGlmIChncHVCdWZmZXIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAvLyBGaXJlZm94IDc1KyBpbXBsaWNpdGx5IHVuYmluZCB3aGF0ZXZlciBidWZmZXIgdGhlcmUgd2FzIG9uIHRoZSBzbG90IHNvbWV0aW1lc1xyXG4gICAgICAgIC8vIGNhbiBiZSByZXByb2R1Y2VkIGluIHRoZSBzdGF0aWMgYmF0Y2hpbmcgc2NlbmUgYXQgaHR0cHM6Ly9naXRodWIuY29tL2NvY29zLWNyZWF0b3IvdGVzdC1jYXNlcy0zZFxyXG4gICAgICAgIHN3aXRjaCAoZ3B1QnVmZmVyLmdsVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGNhc2UgZ2wuQVJSQVlfQlVGRkVSOlxyXG4gICAgICAgICAgICAgICAgaWYgKGRldmljZS51c2VWQU8gJiYgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVmVydGV4QXJyYXkobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xWQU8gPSBnZnhTdGF0ZUNhY2hlLmdwdUlucHV0QXNzZW1ibGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsQXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI6XHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnVzZVZBTyAmJiBkZXZpY2Uuc3RhdGVDYWNoZS5nbFZBTykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRWZXJ0ZXhBcnJheShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBnbC5VTklGT1JNX0JVRkZFUjpcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuVU5JRk9STV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xVbmlmb3JtQnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2wuZGVsZXRlQnVmZmVyKGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsQnVmZmVyID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNSZXNpemVCdWZmZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTDJHUFVCdWZmZXIpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGNhY2hlID0gZGV2aWNlLnN0YXRlQ2FjaGU7XHJcbiAgICBjb25zdCBnbFVzYWdlOiBHTGVudW0gPSBncHVCdWZmZXIubWVtVXNhZ2UgJiBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUID8gZ2wuRFlOQU1JQ19EUkFXIDogZ2wuU1RBVElDX0RSQVc7XHJcblxyXG4gICAgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlZFUlRFWCkge1xyXG4gICAgICAgIGlmIChkZXZpY2UudXNlVkFPKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5nbFZBTykge1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xWQU8gPSBnZnhTdGF0ZUNhY2hlLmdwdUlucHV0QXNzZW1ibGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhY2hlLmdsQXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChncHVCdWZmZXIuYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuYnVmZmVyLCBnbFVzYWdlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLnNpemUsIGdsVXNhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgY2FjaGUuZ2xBcnJheUJ1ZmZlciA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LklOREVYKSB7XHJcbiAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kVmVydGV4QXJyYXkobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGdwdUJ1ZmZlci5idWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmJ1ZmZlciwgZ2xVc2FnZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLnNpemUsIGdsVXNhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlVOSUZPUk0pIHtcclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xVbmlmb3JtQnVmZmVyICE9PSBncHVCdWZmZXIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5VTklGT1JNX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuVU5JRk9STV9CVUZGRVIsIGdwdUJ1ZmZlci5zaXplLCBnbFVzYWdlKTtcclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLlVOSUZPUk1fQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbFVuaWZvcm1CdWZmZXIgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICgoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ESVJFQ1QpIHx8XHJcbiAgICAgICAgICAgIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QpIHx8XHJcbiAgICAgICAgICAgIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9TUkMpKSB7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgR0ZYQnVmZmVyVHlwZSwgY3JlYXRlIGJ1ZmZlciBmYWlsZWQuJyk7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuTk9ORTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNVcGRhdGVCdWZmZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTDJHUFVCdWZmZXIsIGJ1ZmZlcjogR0ZYQnVmZmVyU291cmNlLCBvZmZzZXQ6IG51bWJlciwgc2l6ZTogbnVtYmVyKSB7XHJcblxyXG4gICAgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LklORElSRUNUKSB7XHJcbiAgICAgICAgZ3B1QnVmZmVyLmluZGlyZWN0cy5sZW5ndGggPSBvZmZzZXQ7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZ3B1QnVmZmVyLmluZGlyZWN0cywgKGJ1ZmZlciBhcyBHRlhJbmRpcmVjdEJ1ZmZlcikuZHJhd0luZm9zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgYnVmZiA9IGJ1ZmZlciBhcyBBcnJheUJ1ZmZlcjtcclxuICAgICAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgICAgICBjb25zdCBjYWNoZSA9IGRldmljZS5zdGF0ZUNhY2hlO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGdwdUJ1ZmZlci5nbFRhcmdldCkge1xyXG4gICAgICAgICAgICBjYXNlIGdsLkFSUkFZX0JVRkZFUjoge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsVkFPID0gZ2Z4U3RhdGVDYWNoZS5ncHVJbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsQXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsQXJyYXlCdWZmZXIgPSBncHVCdWZmZXIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNpemUgPT09IGJ1ZmYuYnl0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ3B1QnVmZmVyLmdsVGFyZ2V0LCBvZmZzZXQsIGJ1ZmYpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdwdUJ1ZmZlci5nbFRhcmdldCwgb2Zmc2V0LCBidWZmLnNsaWNlKDAsIHNpemUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI6IHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbFZBTykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRWZXJ0ZXhBcnJheShudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IGdwdUJ1ZmZlci5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoc2l6ZSA9PT0gYnVmZi5ieXRlTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYnVmZmVyU3ViRGF0YShncHVCdWZmZXIuZ2xUYXJnZXQsIG9mZnNldCwgYnVmZik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ3B1QnVmZmVyLmdsVGFyZ2V0LCBvZmZzZXQsIGJ1ZmYuc2xpY2UoMCwgc2l6ZSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBnbC5VTklGT1JNX0JVRkZFUjoge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsVW5pZm9ybUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5VTklGT1JNX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFVuaWZvcm1CdWZmZXIgPSBncHVCdWZmZXIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNpemUgPT09IGJ1ZmYuYnl0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJ1ZmZlclN1YkRhdGEoZ3B1QnVmZmVyLmdsVGFyZ2V0LCBvZmZzZXQsIGJ1ZmYpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdwdUJ1ZmZlci5nbFRhcmdldCwgb2Zmc2V0LCBuZXcgRmxvYXQzMkFycmF5KGJ1ZmYsIDAsIHNpemUgLyA0KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhCdWZmZXJUeXBlLCB1cGRhdGUgYnVmZmVyIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNDcmVhdGVUZXh0dXJlIChkZXZpY2U6IFdlYkdMMkRldmljZSwgZ3B1VGV4dHVyZTogSVdlYkdMMkdQVVRleHR1cmUpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuXHJcbiAgICBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgPSBHRlhGb3JtYXRUb1dlYkdMSW50ZXJuYWxGb3JtYXQoZ3B1VGV4dHVyZS5mb3JtYXQsIGdsKTtcclxuICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQgPSBHRlhGb3JtYXRUb1dlYkdMRm9ybWF0KGdwdVRleHR1cmUuZm9ybWF0LCBnbCk7XHJcbiAgICBncHVUZXh0dXJlLmdsVHlwZSA9IEdGWEZvcm1hdFRvV2ViR0xUeXBlKGdwdVRleHR1cmUuZm9ybWF0LCBnbCk7XHJcblxyXG4gICAgbGV0IHcgPSBncHVUZXh0dXJlLndpZHRoO1xyXG4gICAgbGV0IGggPSBncHVUZXh0dXJlLmhlaWdodDtcclxuXHJcbiAgICBzd2l0Y2ggKGdwdVRleHR1cmUudHlwZSkge1xyXG4gICAgICAgIGNhc2UgR0ZYVGV4dHVyZVR5cGUuVEVYMkQ6IHtcclxuICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFRhcmdldCA9IGdsLlRFWFRVUkVfMkQ7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXhTaXplID0gTWF0aC5tYXgodywgaCk7XHJcbiAgICAgICAgICAgIGlmIChtYXhTaXplID4gZGV2aWNlLm1heFRleHR1cmVTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDkxMDAsIG1heFNpemUsIGRldmljZS5tYXhUZXh0dXJlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLnNhbXBsZXMgPT09IEdGWFNhbXBsZUNvdW50LlgxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xUZXh0dXJlICYmIGdwdVRleHR1cmUuc2l6ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSA9IGdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBnbFRleFVuaXQgPSBkZXZpY2Uuc3RhdGVDYWNoZS5nbFRleFVuaXRzW2RldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbFRleFVuaXQuZ2xUZXh0dXJlID0gZ3B1VGV4dHVyZS5nbFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUdGWEZvcm1hdEluZm9zW2dwdVRleHR1cmUuZm9ybWF0XS5pc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSBNYXRoLm1heCgxLCBoID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdTaXplID0gR0ZYRm9ybWF0U2l6ZShncHVUZXh0dXJlLmZvcm1hdCwgdywgaCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlldzogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGltZ1NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbml0IDIgeCAyIHRleHR1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCAyLCAyLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXc6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShpbWdTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgMiwgMiwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5pc1Bvd2VyT2YyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwUyA9IGdsLlJFUEVBVDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBUID0gZ2wuUkVQRUFUO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwUyA9IGdsLkNMQU1QX1RPX0VER0U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwVCA9IGdsLkNMQU1QX1RPX0VER0U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIgPSBnbC5MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbE1hZ0ZpbHRlciA9IGdsLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfV1JBUF9TLCBncHVUZXh0dXJlLmdsV3JhcFMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdwdVRleHR1cmUuZ2xXcmFwVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBncHVUZXh0dXJlLmdsTWFnRmlsdGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGVsZXRlVGV4dHVyZShnbFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xSZW5kZXJidWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChnbFJlbmRlcmJ1ZmZlciAmJiBncHVUZXh0dXJlLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlciA9IGdsUmVuZGVyYnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlbmRlcmJ1ZmZlciAhPT0gZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsUmVuZGVyYnVmZmVyID0gZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2VNdWx0aXNhbXBsZShnbC5SRU5ERVJCVUZGRVIsIFNBTVBMRVNbZ3B1VGV4dHVyZS5zYW1wbGVzXSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCBncHVUZXh0dXJlLndpZHRoLCBncHVUZXh0dXJlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYVGV4dHVyZVR5cGUuQ1VCRToge1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0ID0gZ2wuVEVYVFVSRV9DVUJFX01BUDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1heCh3LCBoKTtcclxuICAgICAgICAgICAgaWYgKG1heFNpemUgPiBkZXZpY2UubWF4Q3ViZU1hcFRleHR1cmVTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDkxMDAsIG1heFNpemUsIGRldmljZS5tYXhUZXh0dXJlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgaWYgKGdsVGV4dHVyZSAmJiBncHVUZXh0dXJlLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSA9IGdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsVGV4VW5pdCA9IGRldmljZS5zdGF0ZUNhY2hlLmdsVGV4VW5pdHNbZGV2aWNlLnN0YXRlQ2FjaGUudGV4VW5pdF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdsVGV4VW5pdC5nbFRleHR1cmUgIT09IGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsVGV4VW5pdC5nbFRleHR1cmUgPSBncHVUZXh0dXJlLmdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIUdGWEZvcm1hdEluZm9zW2dwdVRleHR1cmUuZm9ybWF0XS5pc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IDY7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGdwdVRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVRleHR1cmUubWlwTGV2ZWw7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCBpLCBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBNYXRoLm1heCgxLCB3ID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgIT09IFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiA9IDA7IGYgPCA2OyArK2YpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBncHVUZXh0dXJlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGdwdVRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdTaXplID0gR0ZYRm9ybWF0U2l6ZShncHVUZXh0dXJlLmZvcm1hdCwgdywgaCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlldzogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGltZ1NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgNjsgKytmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdTaXplID0gR0ZYRm9ybWF0U2l6ZShncHVUZXh0dXJlLmZvcm1hdCwgMiwgMiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWV3OiBVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaW1nU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5jb21wcmVzc2VkVGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCAwLCBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIDIsIDIsIDAsIHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5pc1Bvd2VyT2YyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBTID0gZ2wuUkVQRUFUO1xyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwVCA9IGdsLlJFUEVBVDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBTID0gZ2wuQ0xBTVBfVE9fRURHRTtcclxuICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsV3JhcFQgPSBnbC5DTEFNUF9UT19FREdFO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbE1pbkZpbHRlciA9IGdsLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xNYWdGaWx0ZXIgPSBnbC5MSU5FQVI7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX1dSQVBfUywgZ3B1VGV4dHVyZS5nbFdyYXBTKTtcclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdwdVRleHR1cmUuZ2xXcmFwVCk7XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ3B1VGV4dHVyZS5nbE1pbkZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ3B1VGV4dHVyZS5nbE1hZ0ZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdGWFRleHR1cmVUeXBlLCBjcmVhdGUgdGV4dHVyZSBmYWlsZWQuJyk7XHJcbiAgICAgICAgICAgIGdwdVRleHR1cmUudHlwZSA9IEdGWFRleHR1cmVUeXBlLlRFWDJEO1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0ID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jRGVzdHJveVRleHR1cmUgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVUZXh0dXJlOiBJV2ViR0wyR1BVVGV4dHVyZSkge1xyXG4gICAgaWYgKGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgZGV2aWNlLmdsLmRlbGV0ZVRleHR1cmUoZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgIGdwdVRleHR1cmUuZ2xUZXh0dXJlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcikge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVSZW5kZXJidWZmZXIoZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcik7XHJcbiAgICAgICAgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jUmVzaXplVGV4dHVyZSAoZGV2aWNlOiBXZWJHTDJEZXZpY2UsIGdwdVRleHR1cmU6IElXZWJHTDJHUFVUZXh0dXJlKSB7XHJcblxyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcblxyXG4gICAgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10ID0gR0ZYRm9ybWF0VG9XZWJHTEludGVybmFsRm9ybWF0KGdwdVRleHR1cmUuZm9ybWF0LCBnbCk7XHJcbiAgICBncHVUZXh0dXJlLmdsRm9ybWF0ID0gR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdChncHVUZXh0dXJlLmZvcm1hdCwgZ2wpO1xyXG4gICAgZ3B1VGV4dHVyZS5nbFR5cGUgPSBHRlhGb3JtYXRUb1dlYkdMVHlwZShncHVUZXh0dXJlLmZvcm1hdCwgZ2wpO1xyXG5cclxuICAgIGxldCB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgIGxldCBoID0gZ3B1VGV4dHVyZS5oZWlnaHQ7XHJcblxyXG4gICAgc3dpdGNoIChncHVUZXh0dXJlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWFRleHR1cmVUeXBlLlRFWDJEOiB7XHJcbiAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xUYXJnZXQgPSBnbC5URVhUVVJFXzJEO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWF4U2l6ZSA9IE1hdGgubWF4KHcsIGgpO1xyXG4gICAgICAgICAgICBpZiAobWF4U2l6ZSA+IGRldmljZS5tYXhUZXh0dXJlU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCg5MTAwLCBtYXhTaXplLCBkZXZpY2UubWF4VGV4dHVyZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5zYW1wbGVzID09PSBHRlhTYW1wbGVDb3VudC5YMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xUZXhVbml0ID0gZGV2aWNlLnN0YXRlQ2FjaGUuZ2xUZXhVbml0c1tkZXZpY2Uuc3RhdGVDYWNoZS50ZXhVbml0XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghR0ZYRm9ybWF0SW5mb3NbZ3B1VGV4dHVyZS5mb3JtYXRdLmlzQ29tcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1VGV4dHVyZS5taXBMZXZlbDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBNYXRoLm1heCgxLCB3ID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gTWF0aC5tYXgoMSwgaCA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgIT09IFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCB3LCBoLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXc6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShpbWdTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSBNYXRoLm1heCgxLCBoID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xSZW5kZXJidWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChnbFJlbmRlcmJ1ZmZlciAmJiBncHVUZXh0dXJlLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlciA9IGdsUmVuZGVyYnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlbmRlcmJ1ZmZlciAhPT0gZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kUmVuZGVyYnVmZmVyKGdsLlJFTkRFUkJVRkZFUiwgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsUmVuZGVyYnVmZmVyID0gZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2VNdWx0aXNhbXBsZShnbC5SRU5ERVJCVUZGRVIsIFNBTVBMRVNbZ3B1VGV4dHVyZS5zYW1wbGVzXSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCBncHVUZXh0dXJlLndpZHRoLCBncHVUZXh0dXJlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYVGV4dHVyZVR5cGUuQ1VCRToge1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLnR5cGUgPSBHRlhUZXh0dXJlVHlwZS5DVUJFO1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0ID0gZ2wuVEVYVFVSRV9DVUJFX01BUDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1heCh3LCBoKTtcclxuICAgICAgICAgICAgaWYgKG1heFNpemUgPiBkZXZpY2UubWF4Q3ViZU1hcFRleHR1cmVTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDkxMDAsIG1heFNpemUsIGRldmljZS5tYXhUZXh0dXJlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsVGV4VW5pdCA9IGRldmljZS5zdGF0ZUNhY2hlLmdsVGV4VW5pdHNbZGV2aWNlLnN0YXRlQ2FjaGUudGV4VW5pdF07XHJcblxyXG4gICAgICAgICAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdwdVRleHR1cmUuZ2xUZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIGdsVGV4VW5pdC5nbFRleHR1cmUgPSBncHVUZXh0dXJlLmdsVGV4dHVyZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFHRlhGb3JtYXRJbmZvc1tncHVUZXh0dXJlLmZvcm1hdF0uaXNDb21wcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IDY7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgIHcgPSBncHVUZXh0dXJlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSBncHVUZXh0dXJlLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVRleHR1cmUubWlwTGV2ZWw7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgZ3B1VGV4dHVyZS5nbEZvcm1hdCwgZ3B1VGV4dHVyZS5nbFR5cGUsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgNjsgKytmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBncHVUZXh0dXJlLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gZ3B1VGV4dHVyZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1VGV4dHVyZS5taXBMZXZlbDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdTaXplID0gR0ZYRm9ybWF0U2l6ZShncHVUZXh0dXJlLmZvcm1hdCwgdywgaCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWV3OiBVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaW1nU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5jb21wcmVzc2VkVGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCBpLCBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIHZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gTWF0aC5tYXgoMSwgaCA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhUZXh0dXJlVHlwZSwgY3JlYXRlIHRleHR1cmUgZmFpbGVkLicpO1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLnR5cGUgPSBHRlhUZXh0dXJlVHlwZS5URVgyRDtcclxuICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFRhcmdldCA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0NyZWF0ZVNhbXBsZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVTYW1wbGVyOiBJV2ViR0wyR1BVU2FtcGxlcikge1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG4gICAgY29uc3QgZ2xTYW1wbGVyID0gZ2wuY3JlYXRlU2FtcGxlcigpO1xyXG4gICAgaWYgKGdsU2FtcGxlcikge1xyXG4gICAgICAgIGlmIChncHVTYW1wbGVyLm1pbkZpbHRlciA9PT0gR0ZYRmlsdGVyLkxJTkVBUiB8fCBncHVTYW1wbGVyLm1pbkZpbHRlciA9PT0gR0ZYRmlsdGVyLkFOSVNPVFJPUElDKSB7XHJcbiAgICAgICAgICAgIGlmIChncHVTYW1wbGVyLm1pcEZpbHRlciA9PT0gR0ZYRmlsdGVyLkxJTkVBUiB8fCBncHVTYW1wbGVyLm1pcEZpbHRlciA9PT0gR0ZYRmlsdGVyLkFOSVNPVFJPUElDKSB7XHJcbiAgICAgICAgICAgICAgICBncHVTYW1wbGVyLmdsTWluRmlsdGVyID0gZ2wuTElORUFSX01JUE1BUF9MSU5FQVI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZ3B1U2FtcGxlci5taXBGaWx0ZXIgPT09IEdGWEZpbHRlci5QT0lOVCkge1xyXG4gICAgICAgICAgICAgICAgZ3B1U2FtcGxlci5nbE1pbkZpbHRlciA9IGdsLkxJTkVBUl9NSVBNQVBfTkVBUkVTVDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdwdVNhbXBsZXIuZ2xNaW5GaWx0ZXIgPSBnbC5MSU5FQVI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoZ3B1U2FtcGxlci5taXBGaWx0ZXIgPT09IEdGWEZpbHRlci5MSU5FQVIgfHwgZ3B1U2FtcGxlci5taXBGaWx0ZXIgPT09IEdGWEZpbHRlci5BTklTT1RST1BJQykge1xyXG4gICAgICAgICAgICAgICAgZ3B1U2FtcGxlci5nbE1pbkZpbHRlciA9IGdsLk5FQVJFU1RfTUlQTUFQX0xJTkVBUjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChncHVTYW1wbGVyLm1pcEZpbHRlciA9PT0gR0ZYRmlsdGVyLlBPSU5UKSB7XHJcbiAgICAgICAgICAgICAgICBncHVTYW1wbGVyLmdsTWluRmlsdGVyID0gZ2wuTkVBUkVTVF9NSVBNQVBfTkVBUkVTVDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdwdVNhbXBsZXIuZ2xNaW5GaWx0ZXIgPSBnbC5ORUFSRVNUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZ3B1U2FtcGxlci5tYWdGaWx0ZXIgPT09IEdGWEZpbHRlci5MSU5FQVIgfHwgZ3B1U2FtcGxlci5tYWdGaWx0ZXIgPT09IEdGWEZpbHRlci5BTklTT1RST1BJQykge1xyXG4gICAgICAgICAgICBncHVTYW1wbGVyLmdsTWFnRmlsdGVyID0gZ2wuTElORUFSO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGdwdVNhbXBsZXIuZ2xNYWdGaWx0ZXIgPSBnbC5ORUFSRVNUO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ3B1U2FtcGxlci5nbFdyYXBTID0gV2ViR0xXcmFwc1tncHVTYW1wbGVyLmFkZHJlc3NVXTtcclxuICAgICAgICBncHVTYW1wbGVyLmdsV3JhcFQgPSBXZWJHTFdyYXBzW2dwdVNhbXBsZXIuYWRkcmVzc1ZdO1xyXG4gICAgICAgIGdwdVNhbXBsZXIuZ2xXcmFwUiA9IFdlYkdMV3JhcHNbZ3B1U2FtcGxlci5hZGRyZXNzV107XHJcblxyXG4gICAgICAgIGdwdVNhbXBsZXIuZ2xTYW1wbGVyID0gZ2xTYW1wbGVyO1xyXG4gICAgICAgIGdsLnNhbXBsZXJQYXJhbWV0ZXJpKGdsU2FtcGxlciwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBncHVTYW1wbGVyLmdsTWluRmlsdGVyKTtcclxuICAgICAgICBnbC5zYW1wbGVyUGFyYW1ldGVyaShnbFNhbXBsZXIsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ3B1U2FtcGxlci5nbE1hZ0ZpbHRlcik7XHJcbiAgICAgICAgZ2wuc2FtcGxlclBhcmFtZXRlcmkoZ2xTYW1wbGVyLCBnbC5URVhUVVJFX1dSQVBfUywgZ3B1U2FtcGxlci5nbFdyYXBTKTtcclxuICAgICAgICBnbC5zYW1wbGVyUGFyYW1ldGVyaShnbFNhbXBsZXIsIGdsLlRFWFRVUkVfV1JBUF9ULCBncHVTYW1wbGVyLmdsV3JhcFQpO1xyXG4gICAgICAgIGdsLnNhbXBsZXJQYXJhbWV0ZXJpKGdsU2FtcGxlciwgZ2wuVEVYVFVSRV9XUkFQX1IsIGdwdVNhbXBsZXIuZ2xXcmFwUik7XHJcbiAgICAgICAgZ2wuc2FtcGxlclBhcmFtZXRlcmYoZ2xTYW1wbGVyLCBnbC5URVhUVVJFX01JTl9MT0QsIGdwdVNhbXBsZXIubWluTE9EKTtcclxuICAgICAgICBnbC5zYW1wbGVyUGFyYW1ldGVyZihnbFNhbXBsZXIsIGdsLlRFWFRVUkVfTUFYX0xPRCwgZ3B1U2FtcGxlci5tYXhMT0QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0Rlc3Ryb3lTYW1wbGVyIChkZXZpY2U6IFdlYkdMMkRldmljZSwgZ3B1U2FtcGxlcjogSVdlYkdMMkdQVVNhbXBsZXIpIHtcclxuICAgIGlmIChncHVTYW1wbGVyLmdsU2FtcGxlcikge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVTYW1wbGVyKGdwdVNhbXBsZXIuZ2xTYW1wbGVyKTtcclxuICAgICAgICBncHVTYW1wbGVyLmdsU2FtcGxlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jQ3JlYXRlRnJhbWVidWZmZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMMkdQVUZyYW1lYnVmZmVyKSB7XHJcbiAgICBpZiAoIWdwdUZyYW1lYnVmZmVyLmdwdUNvbG9yVGV4dHVyZXMubGVuZ3RoICYmICFncHVGcmFtZWJ1ZmZlci5ncHVEZXB0aFN0ZW5jaWxUZXh0dXJlKSB7IHJldHVybjsgfSAvLyBvbnNjcmVlbiBmYm9cclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGF0dGFjaG1lbnRzOiBHTGVudW1bXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGdsRnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgaWYgKGdsRnJhbWVidWZmZXIpIHtcclxuICAgICAgICBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyID0gZ2xGcmFtZWJ1ZmZlcjtcclxuXHJcbiAgICAgICAgaWYgKGRldmljZS5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIgIT09IGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1RnJhbWVidWZmZXIuZ3B1Q29sb3JUZXh0dXJlcy5sZW5ndGg7ICsraSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sb3JUZXh0dXJlID0gZ3B1RnJhbWVidWZmZXIuZ3B1Q29sb3JUZXh0dXJlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbG9yVGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLkNPTE9SX0FUVEFDSE1FTlQwICsgaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JUZXh0dXJlLmdsVGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvclRleHR1cmUuZ2xUZXh0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAwKTsgLy8gbGV2ZWwgc2hvdWxkIGJlIDAuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuQ09MT1JfQVRUQUNITUVOVDAgKyBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5SRU5ERVJCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yVGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnRzLnB1c2goZ2wuQ09MT1JfQVRUQUNITUVOVDAgKyBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZHN0ID0gZ3B1RnJhbWVidWZmZXIuZ3B1RGVwdGhTdGVuY2lsVGV4dHVyZTtcclxuICAgICAgICBpZiAoZHN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdsQXR0YWNobWVudCA9IEdGWEZvcm1hdEluZm9zW2RzdC5mb3JtYXRdLmhhc1N0ZW5jaWwgPyBnbC5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQgOiBnbC5ERVBUSF9BVFRBQ0hNRU5UO1xyXG4gICAgICAgICAgICBpZiAoZHN0LmdsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xBdHRhY2htZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGRzdC5nbFRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICBkc3QuZ2xUZXh0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIDApOyAvLyBsZXZlbCBtdXN0IGJlIDBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLkZSQU1FQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgICAgIGdsQXR0YWNobWVudCxcclxuICAgICAgICAgICAgICAgICAgICBnbC5SRU5ERVJCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgZHN0LmdsUmVuZGVyYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2wuZHJhd0J1ZmZlcnMoYXR0YWNobWVudHMpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKGdsLkZSQU1FQlVGRkVSKTtcclxuICAgICAgICBpZiAoc3RhdHVzICE9PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURSkge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBnbC5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0FUVEFDSE1FTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdnbENoZWNrRnJhbWVidWZmZXJTdGF0dXMoKSAtIEZSQU1FQlVGRkVSX0lOQ09NUExFVEVfQVRUQUNITUVOVCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBnbC5GUkFNRUJVRkZFUl9JTkNPTVBMRVRFX01JU1NJTkdfQVRUQUNITUVOVDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dsQ2hlY2tGcmFtZWJ1ZmZlclN0YXR1cygpIC0gRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9ESU1FTlNJT05TOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ2xDaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgLSBGUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlMnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfVU5TVVBQT1JURUQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdnbENoZWNrRnJhbWVidWZmZXJTdGF0dXMoKSAtIEZSQU1FQlVGRkVSX1VOU1VQUE9SVEVEJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xGcmFtZWJ1ZmZlciAhPT0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGRldmljZS5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMMkdQVUZyYW1lYnVmZmVyKSB7XHJcbiAgICBpZiAoZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVGcmFtZWJ1ZmZlcihncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyKTtcclxuICAgICAgICBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNDcmVhdGVTaGFkZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVTaGFkZXI6IElXZWJHTDJHUFVTaGFkZXIpIHtcclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG5cclxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1U2hhZGVyLmdwdVN0YWdlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIGNvbnN0IGdwdVN0YWdlID0gZ3B1U2hhZGVyLmdwdVN0YWdlc1trXTtcclxuXHJcbiAgICAgICAgbGV0IGdsU2hhZGVyVHlwZTogR0xlbnVtID0gMDtcclxuICAgICAgICBsZXQgc2hhZGVyVHlwZVN0ciA9ICcnO1xyXG4gICAgICAgIGxldCBsaW5lTnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChncHVTdGFnZS50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LlZFUlRFWDoge1xyXG4gICAgICAgICAgICAgICAgc2hhZGVyVHlwZVN0ciA9ICdWZXJ0ZXhTaGFkZXInO1xyXG4gICAgICAgICAgICAgICAgZ2xTaGFkZXJUeXBlID0gZ2wuVkVSVEVYX1NIQURFUjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LkZSQUdNRU5UOiB7XHJcbiAgICAgICAgICAgICAgICBzaGFkZXJUeXBlU3RyID0gJ0ZyYWdtZW50U2hhZGVyJztcclxuICAgICAgICAgICAgICAgIGdsU2hhZGVyVHlwZSA9IGdsLkZSQUdNRU5UX1NIQURFUjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdGWFNoYWRlclR5cGUuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGdsU2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsU2hhZGVyVHlwZSk7XHJcbiAgICAgICAgaWYgKGdsU2hhZGVyKSB7XHJcbiAgICAgICAgICAgIGdwdVN0YWdlLmdsU2hhZGVyID0gZ2xTaGFkZXI7XHJcbiAgICAgICAgICAgIGdsLnNoYWRlclNvdXJjZShncHVTdGFnZS5nbFNoYWRlciwgJyN2ZXJzaW9uIDMwMCBlc1xcbicgKyBncHVTdGFnZS5zb3VyY2UpO1xyXG4gICAgICAgICAgICBnbC5jb21waWxlU2hhZGVyKGdwdVN0YWdlLmdsU2hhZGVyKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKGdwdVN0YWdlLmdsU2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2hhZGVyVHlwZVN0ciArICcgaW4gXFwnJyArIGdwdVNoYWRlci5uYW1lICsgJ1xcJyBjb21waWxhdGlvbiBmYWlsZWQuJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFkZXIgc291cmNlIGR1bXA6JywgZ3B1U3RhZ2Uuc291cmNlLnJlcGxhY2UoL158XFxuL2csICgpID0+IGBcXG4ke2xpbmVOdW1iZXIrK30gYCkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKGdwdVN0YWdlLmdsU2hhZGVyKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBncHVTaGFkZXIuZ3B1U3RhZ2VzLmxlbmd0aDsgbCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhZ2UgPSBncHVTaGFkZXIuZ3B1U3RhZ2VzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFnZS5nbFNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIoc3RhZ2UuZ2xTaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFnZS5nbFNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdsUHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGlmICghZ2xQcm9ncmFtKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGdwdVNoYWRlci5nbFByb2dyYW0gPSBnbFByb2dyYW07XHJcblxyXG4gICAgLy8gbGluayBwcm9ncmFtXHJcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IGdwdVNoYWRlci5ncHVTdGFnZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICBjb25zdCBncHVTdGFnZSA9IGdwdVNoYWRlci5ncHVTdGFnZXNba107XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKGdwdVNoYWRlci5nbFByb2dyYW0sIGdwdVN0YWdlLmdsU2hhZGVyISk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2wubGlua1Byb2dyYW0oZ3B1U2hhZGVyLmdsUHJvZ3JhbSk7XHJcblxyXG4gICAgLy8gZGV0YWNoICYgZGVsZXRlIGltbWVkaWF0ZWx5XHJcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IGdwdVNoYWRlci5ncHVTdGFnZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICBjb25zdCBncHVTdGFnZSA9IGdwdVNoYWRlci5ncHVTdGFnZXNba107XHJcbiAgICAgICAgaWYgKGdwdVN0YWdlLmdsU2hhZGVyKSB7XHJcbiAgICAgICAgICAgIGdsLmRldGFjaFNoYWRlcihncHVTaGFkZXIuZ2xQcm9ncmFtLCBncHVTdGFnZS5nbFNoYWRlcik7XHJcbiAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcihncHVTdGFnZS5nbFNoYWRlcik7XHJcbiAgICAgICAgICAgIGdwdVN0YWdlLmdsU2hhZGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGdsLmdldFByb2dyYW1QYXJhbWV0ZXIoZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdTaGFkZXIgXFwnJyArIGdwdVNoYWRlci5uYW1lICsgJ1xcJyBjb21waWxhdGlvbiBzdWNjZWVkZWQuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsaW5rIHNoYWRlciBcXCcnICsgZ3B1U2hhZGVyLm5hbWUgKyAnXFwnLicpO1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coZ3B1U2hhZGVyLmdsUHJvZ3JhbSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwYXJzZSBpbnB1dHNcclxuICAgIGNvbnN0IGFjdGl2ZUF0dHJpYkNvdW50ID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihncHVTaGFkZXIuZ2xQcm9ncmFtLCBnbC5BQ1RJVkVfQVRUUklCVVRFUyk7XHJcbiAgICBncHVTaGFkZXIuZ2xJbnB1dHMgPSBuZXcgQXJyYXk8SVdlYkdMMkdQVUlucHV0PihhY3RpdmVBdHRyaWJDb3VudCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmVBdHRyaWJDb3VudDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmliSW5mbyA9IGdsLmdldEFjdGl2ZUF0dHJpYihncHVTaGFkZXIuZ2xQcm9ncmFtLCBpKTtcclxuICAgICAgICBpZiAoYXR0cmliSW5mbykge1xyXG4gICAgICAgICAgICBsZXQgdmFyTmFtZTogc3RyaW5nO1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lT2Zmc2V0ID0gYXR0cmliSW5mby5uYW1lLmluZGV4T2YoJ1snKTtcclxuICAgICAgICAgICAgaWYgKG5hbWVPZmZzZXQgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJOYW1lID0gYXR0cmliSW5mby5uYW1lLnN1YnN0cigwLCBuYW1lT2Zmc2V0KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhck5hbWUgPSBhdHRyaWJJbmZvLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsTG9jID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgdmFyTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBXZWJHTFR5cGVUb0dGWFR5cGUoYXR0cmliSW5mby50eXBlLCBnbCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmlkZSA9IFdlYkdMR2V0VHlwZVNpemUoYXR0cmliSW5mby50eXBlLCBnbCk7XHJcblxyXG4gICAgICAgICAgICBncHVTaGFkZXIuZ2xJbnB1dHNbaV0gPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB2YXJOYW1lLFxyXG4gICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgIHN0cmlkZSxcclxuICAgICAgICAgICAgICAgIGNvdW50OiBhdHRyaWJJbmZvLnNpemUsXHJcbiAgICAgICAgICAgICAgICBzaXplOiBzdHJpZGUgKiBhdHRyaWJJbmZvLnNpemUsXHJcblxyXG4gICAgICAgICAgICAgICAgZ2xUeXBlOiBhdHRyaWJJbmZvLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBnbExvYyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY3JlYXRlIHVuaWZvcm0gYmxvY2tzXHJcbiAgICBjb25zdCBhY3RpdmVCbG9ja0NvdW50ID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihncHVTaGFkZXIuZ2xQcm9ncmFtLCBnbC5BQ1RJVkVfVU5JRk9STV9CTE9DS1MpO1xyXG4gICAgbGV0IGJsb2NrTmFtZTogc3RyaW5nO1xyXG4gICAgbGV0IGJsb2NrSWR4OiBudW1iZXI7XHJcbiAgICBsZXQgYmxvY2tTaXplOiBudW1iZXI7XHJcbiAgICBsZXQgYmxvY2s6IEdGWFVuaWZvcm1CbG9jayB8IG51bGw7XHJcblxyXG4gICAgaWYgKGFjdGl2ZUJsb2NrQ291bnQpIHtcclxuICAgICAgICBncHVTaGFkZXIuZ2xCbG9ja3MgPSBuZXcgQXJyYXk8SVdlYkdMMkdQVVVuaWZvcm1CbG9jaz4oYWN0aXZlQmxvY2tDb3VudCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYWN0aXZlQmxvY2tDb3VudDsgKytiKSB7XHJcblxyXG4gICAgICAgICAgICBibG9ja05hbWUgPSBnbC5nZXRBY3RpdmVVbmlmb3JtQmxvY2tOYW1lKGdwdVNoYWRlci5nbFByb2dyYW0sIGIpITtcclxuICAgICAgICAgICAgY29uc3QgbmFtZU9mZnNldCA9IGJsb2NrTmFtZS5pbmRleE9mKCdbJyk7XHJcbiAgICAgICAgICAgIGlmIChuYW1lT2Zmc2V0ICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgYmxvY2tOYW1lID0gYmxvY2tOYW1lLnN1YnN0cigwLCBuYW1lT2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYmxvY2tJZHggPSBnbC5nZXRVbmlmb3JtQmxvY2tJbmRleChncHVTaGFkZXIuZ2xQcm9ncmFtLCBibG9ja05hbWUpO1xyXG4gICAgICAgICAgICBibG9jayA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1U2hhZGVyLmJsb2Nrcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdVNoYWRlci5ibG9ja3Nba10ubmFtZSA9PT0gYmxvY2tOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBncHVTaGFkZXIuYmxvY2tzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWJsb2NrKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihgQmxvY2sgJyR7YmxvY2tOYW1lfScgZG9lcyBub3QgYm91bmRgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGJsb2NrSWR4ID0gZ2wuZ2V0VW5pZm9ybUJsb2NrSW5kZXgoZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgYmxvY2tOYW1lKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrSWR4ID0gYjtcclxuICAgICAgICAgICAgICAgIGJsb2NrU2l6ZSA9IGdsLmdldEFjdGl2ZVVuaWZvcm1CbG9ja1BhcmFtZXRlcihncHVTaGFkZXIuZ2xQcm9ncmFtLCBibG9ja0lkeCwgZ2wuVU5JRk9STV9CTE9DS19EQVRBX1NJWkUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xCaW5kaW5nID0gYmxvY2suYmluZGluZyArIChkZXZpY2UuYmluZGluZ01hcHBpbmdJbmZvLmJ1ZmZlck9mZnNldHNbYmxvY2suc2V0XSB8fCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC51bmlmb3JtQmxvY2tCaW5kaW5nKGdwdVNoYWRlci5nbFByb2dyYW0sIGJsb2NrSWR4LCBnbEJpbmRpbmcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdwdVNoYWRlci5nbEJsb2Nrc1tiXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGJsb2NrLnNldCxcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiBibG9jay5iaW5kaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkeDogYmxvY2tJZHgsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYmxvY2tOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IGJsb2NrU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBnbEJpbmRpbmcsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNyZWF0ZSB1bmlmb3JtIHNhbXBsZXJzXHJcbiAgICBpZiAoZ3B1U2hhZGVyLnNhbXBsZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBncHVTaGFkZXIuZ2xTYW1wbGVycyA9IG5ldyBBcnJheTxJV2ViR0wyR1BVVW5pZm9ybVNhbXBsZXI+KGdwdVNoYWRlci5zYW1wbGVycy5sZW5ndGgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVNoYWRlci5zYW1wbGVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzYW1wbGVyID0gZ3B1U2hhZGVyLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgICAgICBncHVTaGFkZXIuZ2xTYW1wbGVyc1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIHNldDogc2FtcGxlci5zZXQsXHJcbiAgICAgICAgICAgICAgICBiaW5kaW5nOiBzYW1wbGVyLmJpbmRpbmcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzYW1wbGVyLm5hbWUsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBzYW1wbGVyLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogc2FtcGxlci5jb3VudCxcclxuICAgICAgICAgICAgICAgIHVuaXRzOiBbXSxcclxuICAgICAgICAgICAgICAgIGdsVW5pdHM6IG51bGwhLFxyXG4gICAgICAgICAgICAgICAgZ2xUeXBlOiBHRlhUeXBlVG9XZWJHTFR5cGUoc2FtcGxlci50eXBlLCBnbCksXHJcbiAgICAgICAgICAgICAgICBnbExvYzogbnVsbCEsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRleHR1cmUgdW5pdCBpbmRleCBtYXBwaW5nIG9wdGltaXphdGlvblxyXG4gICAgY29uc3QgZ2xBY3RpdmVTYW1wbGVyczogSVdlYkdMMkdQVVVuaWZvcm1TYW1wbGVyW10gPSBbXTtcclxuICAgIGNvbnN0IGdsQWN0aXZlU2FtcGxlckxvY2F0aW9uczogV2ViR0xVbmlmb3JtTG9jYXRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgYmluZGluZ01hcHBpbmdJbmZvID0gZGV2aWNlLmJpbmRpbmdNYXBwaW5nSW5mbztcclxuICAgIGNvbnN0IHRleFVuaXRDYWNoZU1hcCA9IGRldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRDYWNoZU1hcDtcclxuXHJcbiAgICBsZXQgZmxleGlibGVTZXRCYXNlT2Zmc2V0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1U2hhZGVyLmJsb2Nrcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGlmIChncHVTaGFkZXIuYmxvY2tzW2ldLnNldCA9PT0gYmluZGluZ01hcHBpbmdJbmZvLmZsZXhpYmxlU2V0KSB7XHJcbiAgICAgICAgICAgIGZsZXhpYmxlU2V0QmFzZU9mZnNldCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgYXJyYXlPZmZzZXQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVTaGFkZXIuc2FtcGxlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gZ3B1U2hhZGVyLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgIGNvbnN0IGdsTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGdwdVNoYWRlci5nbFByb2dyYW0sIHNhbXBsZXIubmFtZSk7XHJcbiAgICAgICAgaWYgKGdsTG9jKSB7XHJcbiAgICAgICAgICAgIGdsQWN0aXZlU2FtcGxlcnMucHVzaChncHVTaGFkZXIuZ2xTYW1wbGVyc1tpXSk7XHJcbiAgICAgICAgICAgIGdsQWN0aXZlU2FtcGxlckxvY2F0aW9ucy5wdXNoKGdsTG9jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleFVuaXRDYWNoZU1hcFtzYW1wbGVyLm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGJpbmRpbmcgPSBzYW1wbGVyLmJpbmRpbmcgKyBiaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHNbc2FtcGxlci5zZXRdICsgYXJyYXlPZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChzYW1wbGVyLnNldCA9PT0gYmluZGluZ01hcHBpbmdJbmZvLmZsZXhpYmxlU2V0KSBiaW5kaW5nIC09IGZsZXhpYmxlU2V0QmFzZU9mZnNldDtcclxuICAgICAgICAgICAgdGV4VW5pdENhY2hlTWFwW3NhbXBsZXIubmFtZV0gPSBiaW5kaW5nICUgZGV2aWNlLm1heFRleHR1cmVVbml0cztcclxuICAgICAgICAgICAgYXJyYXlPZmZzZXQgKz0gc2FtcGxlci5jb3VudCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChnbEFjdGl2ZVNhbXBsZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IHVzZWRUZXhVbml0czogYm9vbGVhbltdID0gW107XHJcbiAgICAgICAgLy8gdHJ5IHRvIHJldXNlIGV4aXN0aW5nIG1hcHBpbmdzIGZpcnN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnbEFjdGl2ZVNhbXBsZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdsU2FtcGxlciA9IGdsQWN0aXZlU2FtcGxlcnNbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FjaGVkVW5pdCA9IHRleFVuaXRDYWNoZU1hcFtnbFNhbXBsZXIubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWRVbml0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGdsU2FtcGxlci5nbExvYyA9IGdsQWN0aXZlU2FtcGxlckxvY2F0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgZ2xTYW1wbGVyLmNvdW50OyArK3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodXNlZFRleFVuaXRzW2NhY2hlZFVuaXRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlZFVuaXQgPSAoY2FjaGVkVW5pdCArIDEpICUgZGV2aWNlLm1heFRleHR1cmVVbml0cztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xTYW1wbGVyLnVuaXRzLnB1c2goY2FjaGVkVW5pdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlZFRleFVuaXRzW2NhY2hlZFVuaXRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmaWxsIGluIHRoZSByZXN0IHNlcXVlbmNpYWxseVxyXG4gICAgICAgIGxldCB1bml0SWR4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdsQWN0aXZlU2FtcGxlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2xTYW1wbGVyID0gZ2xBY3RpdmVTYW1wbGVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ2xTYW1wbGVyLmdsTG9jKSB7XHJcbiAgICAgICAgICAgICAgICBnbFNhbXBsZXIuZ2xMb2MgPSBnbEFjdGl2ZVNhbXBsZXJMb2NhdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodXNlZFRleFVuaXRzW3VuaXRJZHhdKSB1bml0SWR4Kys7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IGdsU2FtcGxlci5jb3VudDsgKyt0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHVzZWRUZXhVbml0c1t1bml0SWR4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0SWR4ID0gKHVuaXRJZHggKyAxKSAlIGRldmljZS5tYXhUZXh0dXJlVW5pdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXhVbml0Q2FjaGVNYXBbZ2xTYW1wbGVyLm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4VW5pdENhY2hlTWFwW2dsU2FtcGxlci5uYW1lXSA9IHVuaXRJZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdsU2FtcGxlci51bml0cy5wdXNoKHVuaXRJZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZWRUZXhVbml0c1t1bml0SWR4XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbFByb2dyYW0gIT09IGdwdVNoYWRlci5nbFByb2dyYW0pIHtcclxuICAgICAgICAgICAgZ2wudXNlUHJvZ3JhbShncHVTaGFkZXIuZ2xQcm9ncmFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ2xBY3RpdmVTYW1wbGVycy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICBjb25zdCBnbFNhbXBsZXIgPSBnbEFjdGl2ZVNhbXBsZXJzW2tdO1xyXG4gICAgICAgICAgICBnbFNhbXBsZXIuZ2xVbml0cyA9IG5ldyBJbnQzMkFycmF5KGdsU2FtcGxlci51bml0cyk7XHJcbiAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYoZ2xTYW1wbGVyLmdsTG9jLCBnbFNhbXBsZXIuZ2xVbml0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xQcm9ncmFtICE9PSBncHVTaGFkZXIuZ2xQcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIGdsLnVzZVByb2dyYW0oZGV2aWNlLnN0YXRlQ2FjaGUuZ2xQcm9ncmFtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ3B1U2hhZGVyLmdsU2FtcGxlcnMgPSBnbEFjdGl2ZVNhbXBsZXJzO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0Rlc3Ryb3lTaGFkZXIgKGRldmljZTogV2ViR0wyRGV2aWNlLCBncHVTaGFkZXI6IElXZWJHTDJHUFVTaGFkZXIpIHtcclxuICAgIGlmIChncHVTaGFkZXIuZ2xQcm9ncmFtKSB7XHJcbiAgICAgICAgZGV2aWNlLmdsLmRlbGV0ZVByb2dyYW0oZ3B1U2hhZGVyLmdsUHJvZ3JhbSk7XHJcbiAgICAgICAgZ3B1U2hhZGVyLmdsUHJvZ3JhbSA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jQ3JlYXRlSW5wdXRBc3NlbWJlciAoZGV2aWNlOiBXZWJHTDJEZXZpY2UsIGdwdUlucHV0QXNzZW1ibGVyOiBJV2ViR0wyR1BVSW5wdXRBc3NlbWJsZXIpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuXHJcbiAgICBncHVJbnB1dEFzc2VtYmxlci5nbEF0dHJpYnMgPSBuZXcgQXJyYXk8SVdlYkdMMkF0dHJpYj4oZ3B1SW5wdXRBc3NlbWJsZXIuYXR0cmlidXRlcy5sZW5ndGgpO1xyXG5cclxuICAgIGNvbnN0IG9mZnNldHMgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVJbnB1dEFzc2VtYmxlci5hdHRyaWJ1dGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmliID0gZ3B1SW5wdXRBc3NlbWJsZXIuYXR0cmlidXRlc1tpXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gYXR0cmliLnN0cmVhbSAhPT0gdW5kZWZpbmVkID8gYXR0cmliLnN0cmVhbSA6IDA7XHJcbiAgICAgICAgLy8gaWYgKHN0cmVhbSA8IGdwdUlucHV0QXNzZW1ibGVyLmdwdVZlcnRleEJ1ZmZlcnMubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdUJ1ZmZlciA9IGdwdUlucHV0QXNzZW1ibGVyLmdwdVZlcnRleEJ1ZmZlcnNbc3RyZWFtXTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2xUeXBlID0gR0ZYRm9ybWF0VG9XZWJHTFR5cGUoYXR0cmliLmZvcm1hdCwgZ2wpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSBHRlhGb3JtYXRJbmZvc1thdHRyaWIuZm9ybWF0XS5zaXplO1xyXG5cclxuICAgICAgICBncHVJbnB1dEFzc2VtYmxlci5nbEF0dHJpYnNbaV0gPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGF0dHJpYi5uYW1lLFxyXG4gICAgICAgICAgICBnbEJ1ZmZlcjogZ3B1QnVmZmVyLmdsQnVmZmVyLFxyXG4gICAgICAgICAgICBnbFR5cGUsXHJcbiAgICAgICAgICAgIHNpemUsXHJcbiAgICAgICAgICAgIGNvdW50OiBHRlhGb3JtYXRJbmZvc1thdHRyaWIuZm9ybWF0XS5jb3VudCxcclxuICAgICAgICAgICAgc3RyaWRlOiBncHVCdWZmZXIuc3RyaWRlLFxyXG4gICAgICAgICAgICBjb21wb25lbnRDb3VudDogV2ViR0xHZXRDb21wb25lbnRDb3VudChnbFR5cGUsIGdsKSxcclxuICAgICAgICAgICAgaXNOb3JtYWxpemVkOiAoYXR0cmliLmlzTm9ybWFsaXplZCAhPT0gdW5kZWZpbmVkID8gYXR0cmliLmlzTm9ybWFsaXplZCA6IGZhbHNlKSxcclxuICAgICAgICAgICAgaXNJbnN0YW5jZWQ6IChhdHRyaWIuaXNJbnN0YW5jZWQgIT09IHVuZGVmaW5lZCA/IGF0dHJpYi5pc0luc3RhbmNlZCA6IGZhbHNlKSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRzW3N0cmVhbV0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb2Zmc2V0c1tzdHJlYW1dICs9IHNpemU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jRGVzdHJveUlucHV0QXNzZW1ibGVyIChkZXZpY2U6IFdlYkdMMkRldmljZSwgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTDJHUFVJbnB1dEFzc2VtYmxlcikge1xyXG4gICAgY29uc3QgaXQgPSBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3MudmFsdWVzKCk7XHJcbiAgICBsZXQgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgd2hpbGUgKCFyZXMuZG9uZSkge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVWZXJ0ZXhBcnJheShyZXMudmFsdWUpO1xyXG4gICAgICAgIHJlcyA9IGl0Lm5leHQoKTtcclxuICAgIH1cclxuICAgIGdwdUlucHV0QXNzZW1ibGVyLmdsVkFPcy5jbGVhcigpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVdlYkdMMlN0YXRlQ2FjaGUge1xyXG4gICAgZ3B1UGlwZWxpbmVTdGF0ZTogSVdlYkdMMkdQVVBpcGVsaW5lU3RhdGUgfCBudWxsO1xyXG4gICAgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTDJHUFVJbnB1dEFzc2VtYmxlciB8IG51bGw7XHJcbiAgICByZXZlcnNlQ1c6IGJvb2xlYW47XHJcbiAgICBnbFByaW1pdGl2ZTogbnVtYmVyO1xyXG4gICAgaW52YWxpZGF0ZUF0dGFjaG1lbnRzOiBHTGVudW1bXTtcclxufVxyXG5jb25zdCBnZnhTdGF0ZUNhY2hlOiBJV2ViR0wyU3RhdGVDYWNoZSA9IHtcclxuICAgIGdwdVBpcGVsaW5lU3RhdGU6IG51bGwsXHJcbiAgICBncHVJbnB1dEFzc2VtYmxlcjogbnVsbCxcclxuICAgIHJldmVyc2VDVzogZmFsc2UsXHJcbiAgICBnbFByaW1pdGl2ZTogMCxcclxuICAgIGludmFsaWRhdGVBdHRhY2htZW50czogW10sXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0JlZ2luUmVuZGVyUGFzcyAoXHJcbiAgICBkZXZpY2U6IFdlYkdMMkRldmljZSxcclxuICAgIGdwdVJlbmRlclBhc3M6IElXZWJHTDJHUFVSZW5kZXJQYXNzIHwgbnVsbCxcclxuICAgIGdwdUZyYW1lYnVmZmVyOiBJV2ViR0wyR1BVRnJhbWVidWZmZXIgfCBudWxsLFxyXG4gICAgcmVuZGVyQXJlYTogR0ZYUmVjdCxcclxuICAgIGNsZWFyQ29sb3JzOiBHRlhDb2xvcltdLFxyXG4gICAgY2xlYXJEZXB0aDogbnVtYmVyLFxyXG4gICAgY2xlYXJTdGVuY2lsOiBudW1iZXIpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGNhY2hlID0gZGV2aWNlLnN0YXRlQ2FjaGU7XHJcblxyXG4gICAgbGV0IGNsZWFyczogR0xiaXRmaWVsZCA9IDA7XHJcblxyXG4gICAgaWYgKGdwdUZyYW1lYnVmZmVyICYmIGdwdVJlbmRlclBhc3MpIHtcclxuICAgICAgICBpZiAoY2FjaGUuZ2xGcmFtZWJ1ZmZlciAhPT0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIpO1xyXG4gICAgICAgICAgICBjYWNoZS5nbEZyYW1lYnVmZmVyID0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcjtcclxuICAgICAgICAgICAgLy8gcmVuZGVyIHRhcmdldHMgYXJlIGRyYXduIHdpdGggZmxpcHBlZC1ZXHJcbiAgICAgICAgICAgIGNvbnN0IHJldmVyc2VDVyA9ICEhZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKHJldmVyc2VDVyAhPT0gZ2Z4U3RhdGVDYWNoZS5yZXZlcnNlQ1cpIHtcclxuICAgICAgICAgICAgICAgIGdmeFN0YXRlQ2FjaGUucmV2ZXJzZUNXID0gcmV2ZXJzZUNXO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNDQ1cgPSAhZGV2aWNlLnN0YXRlQ2FjaGUucnMuaXNGcm9udEZhY2VDQ1c7XHJcbiAgICAgICAgICAgICAgICBnbC5mcm9udEZhY2UoaXNDQ1cgPyBnbC5DQ1cgOiBnbC5DVyk7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5ycy5pc0Zyb250RmFjZUNDVyA9IGlzQ0NXO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FjaGUudmlld3BvcnQubGVmdCAhPT0gcmVuZGVyQXJlYS54IHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LnRvcCAhPT0gcmVuZGVyQXJlYS55IHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LndpZHRoICE9PSByZW5kZXJBcmVhLndpZHRoIHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LmhlaWdodCAhPT0gcmVuZGVyQXJlYS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIGdsLnZpZXdwb3J0KHJlbmRlckFyZWEueCwgcmVuZGVyQXJlYS55LCByZW5kZXJBcmVhLndpZHRoLCByZW5kZXJBcmVhLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBjYWNoZS52aWV3cG9ydC5sZWZ0ID0gcmVuZGVyQXJlYS54O1xyXG4gICAgICAgICAgICBjYWNoZS52aWV3cG9ydC50b3AgPSByZW5kZXJBcmVhLnk7XHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LndpZHRoID0gcmVuZGVyQXJlYS53aWR0aDtcclxuICAgICAgICAgICAgY2FjaGUudmlld3BvcnQuaGVpZ2h0ID0gcmVuZGVyQXJlYS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FjaGUuc2Npc3NvclJlY3QueCAhPT0gcmVuZGVyQXJlYS54IHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LnkgIT09IHJlbmRlckFyZWEueSB8fFxyXG4gICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC53aWR0aCAhPT0gcmVuZGVyQXJlYS53aWR0aCB8fFxyXG4gICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC5oZWlnaHQgIT09IHJlbmRlckFyZWEuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICBnbC5zY2lzc29yKHJlbmRlckFyZWEueCwgcmVuZGVyQXJlYS55LCByZW5kZXJBcmVhLndpZHRoLCByZW5kZXJBcmVhLmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC54ID0gcmVuZGVyQXJlYS54O1xyXG4gICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC55ID0gcmVuZGVyQXJlYS55O1xyXG4gICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC53aWR0aCA9IHJlbmRlckFyZWEud2lkdGg7XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LmhlaWdodCA9IHJlbmRlckFyZWEuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZ2Z4U3RhdGVDYWNoZS5pbnZhbGlkYXRlQXR0YWNobWVudHMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjbGVhckNvbG9ycy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvckF0dGFjaG1lbnQgPSBncHVSZW5kZXJQYXNzLmNvbG9yQXR0YWNobWVudHNbal07XHJcblxyXG4gICAgICAgICAgICBpZiAoY29sb3JBdHRhY2htZW50LmZvcm1hdCAhPT0gR0ZYRm9ybWF0LlVOS05PV04pIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY29sb3JBdHRhY2htZW50LmxvYWRPcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYTG9hZE9wLkxPQUQ6IGJyZWFrOyAvLyBHTCBkZWZhdWx0IGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuQ0xFQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmJzLnRhcmdldHNbMF0uYmxlbmRDb2xvck1hc2sgIT09IEdGWENvbG9yTWFzay5BTEwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbG9yTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFncHVGcmFtZWJ1ZmZlci5pc09mZnNjcmVlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2xlYXJDb2xvciA9IGNsZWFyQ29sb3JzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY2xlYXJDb2xvcihjbGVhckNvbG9yLngsIGNsZWFyQ29sb3IueSwgY2xlYXJDb2xvci56LCBjbGVhckNvbG9yLncpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJzIHw9IGdsLkNPTE9SX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZjMydjRbMF0gPSBjbGVhckNvbG9yc1tqXS54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2YzMnY0WzFdID0gY2xlYXJDb2xvcnNbal0ueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9mMzJ2NFsyXSA9IGNsZWFyQ29sb3JzW2pdLno7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZjMydjRbM10gPSBjbGVhckNvbG9yc1tqXS53O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY2xlYXJCdWZmZXJmdihnbC5DT0xPUiwgaiwgX2YzMnY0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuRElTQ0FSRDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkYXRlIHRoZSBmcmFtZWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZnhTdGF0ZUNhY2hlLmludmFsaWRhdGVBdHRhY2htZW50cy5wdXNoKGdsLkNPTE9SX0FUVEFDSE1FTlQwICsgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBpZiAoY3VyR1BVUmVuZGVyUGFzcylcclxuXHJcbiAgICAgICAgaWYgKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudC5mb3JtYXQgIT09IEdGWEZvcm1hdC5VTktOT1dOKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudC5kZXB0aExvYWRPcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYTG9hZE9wLkxPQUQ6IGJyZWFrOyAvLyBHTCBkZWZhdWx0IGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuQ0xFQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3MuZGVwdGhXcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZGVwdGhNYXNrKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5jbGVhckRlcHRoKGNsZWFyRGVwdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJzIHw9IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5ESVNDQVJEOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGUgdGhlIGZyYW1lYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdmeFN0YXRlQ2FjaGUuaW52YWxpZGF0ZUF0dGFjaG1lbnRzLnB1c2goZ2wuREVQVEhfQVRUQUNITUVOVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChHRlhGb3JtYXRJbmZvc1tncHVSZW5kZXJQYXNzLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuZm9ybWF0XS5oYXNTdGVuY2lsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChncHVSZW5kZXJQYXNzLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuc3RlbmNpbExvYWRPcCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5MT0FEOiBicmVhazsgLy8gR0wgZGVmYXVsdCBiZWhhdmlvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5DTEVBUjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5GUk9OVCwgMHhmZmZmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuQkFDSywgMHhmZmZmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5jbGVhclN0ZW5jaWwoY2xlYXJTdGVuY2lsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFycyB8PSBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5ESVNDQVJEOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkYXRlIHRoZSBmcmFtZWJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2Z4U3RhdGVDYWNoZS5pbnZhbGlkYXRlQXR0YWNobWVudHMucHVzaChnbC5TVEVOQ0lMX0FUVEFDSE1FTlQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGlmIChjdXJHUFVSZW5kZXJQYXNzLmRlcHRoU3RlbmNpbEF0dGFjaG1lbnQpXHJcblxyXG4gICAgICAgIGlmIChncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyICYmIGdmeFN0YXRlQ2FjaGUuaW52YWxpZGF0ZUF0dGFjaG1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBnbC5pbnZhbGlkYXRlRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdmeFN0YXRlQ2FjaGUuaW52YWxpZGF0ZUF0dGFjaG1lbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbGVhcnMpIHtcclxuICAgICAgICAgICAgZ2wuY2xlYXIoY2xlYXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlc3RvcmUgc3RhdGVzXHJcbiAgICAgICAgaWYgKGNsZWFycyAmIGdsLkNPTE9SX0JVRkZFUl9CSVQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yTWFzayA9IGNhY2hlLmJzLnRhcmdldHNbMF0uYmxlbmRDb2xvck1hc2s7XHJcbiAgICAgICAgICAgIGlmIChjb2xvck1hc2sgIT09IEdGWENvbG9yTWFzay5BTEwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLlIpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGcgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkcpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkIpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkEpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGdsLmNvbG9yTWFzayhyLCBnLCBiLCBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKChjbGVhcnMgJiBnbC5ERVBUSF9CVUZGRVJfQklUKSAmJlxyXG4gICAgICAgICAgICAhY2FjaGUuZHNzLmRlcHRoV3JpdGUpIHtcclxuICAgICAgICAgICAgZ2wuZGVwdGhNYXNrKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbGVhcnMgJiBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQpIHtcclxuICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250KSB7XHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkZST05ULCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2spIHtcclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuQkFDSywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IC8vIGlmIChncHVGcmFtZWJ1ZmZlcilcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNCaW5kU3RhdGVzIChcclxuICAgIGRldmljZTogV2ViR0wyRGV2aWNlLFxyXG4gICAgZ3B1UGlwZWxpbmVTdGF0ZTogSVdlYkdMMkdQVVBpcGVsaW5lU3RhdGUgfCBudWxsLFxyXG4gICAgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTDJHUFVJbnB1dEFzc2VtYmxlciB8IG51bGwsXHJcbiAgICBncHVEZXNjcmlwdG9yU2V0czogSVdlYkdMMkdQVURlc2NyaXB0b3JTZXRbXSxcclxuICAgIGR5bmFtaWNPZmZzZXRzOiBudW1iZXJbXSxcclxuICAgIHZpZXdwb3J0OiBHRlhWaWV3cG9ydCB8IG51bGwsXHJcbiAgICBzY2lzc29yOiBHRlhSZWN0IHwgbnVsbCxcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyIHwgbnVsbCxcclxuICAgIGRlcHRoQmlhczogSVdlYkdMMkRlcHRoQmlhcyB8IG51bGwsXHJcbiAgICBibGVuZENvbnN0YW50czogbnVtYmVyW10sXHJcbiAgICBkZXB0aEJvdW5kczogSVdlYkdMMkRlcHRoQm91bmRzIHwgbnVsbCxcclxuICAgIHN0ZW5jaWxXcml0ZU1hc2s6IElXZWJHTDJTdGVuY2lsV3JpdGVNYXNrIHwgbnVsbCxcclxuICAgIHN0ZW5jaWxDb21wYXJlTWFzazogSVdlYkdMMlN0ZW5jaWxDb21wYXJlTWFzayB8IG51bGwpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGNhY2hlID0gZGV2aWNlLnN0YXRlQ2FjaGU7XHJcbiAgICBjb25zdCBncHVTaGFkZXIgPSBncHVQaXBlbGluZVN0YXRlICYmIGdwdVBpcGVsaW5lU3RhdGUuZ3B1U2hhZGVyO1xyXG5cclxuICAgIGxldCBpc1NoYWRlckNoYW5nZWQgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBiaW5kIHBpcGVsaW5lXHJcbiAgICBpZiAoZ3B1UGlwZWxpbmVTdGF0ZSAmJiBnZnhTdGF0ZUNhY2hlLmdwdVBpcGVsaW5lU3RhdGUgIT09IGdwdVBpcGVsaW5lU3RhdGUpIHtcclxuICAgICAgICBnZnhTdGF0ZUNhY2hlLmdwdVBpcGVsaW5lU3RhdGUgPSBncHVQaXBlbGluZVN0YXRlO1xyXG4gICAgICAgIGdmeFN0YXRlQ2FjaGUuZ2xQcmltaXRpdmUgPSBncHVQaXBlbGluZVN0YXRlLmdsUHJpbWl0aXZlO1xyXG5cclxuICAgICAgICBpZiAoZ3B1U2hhZGVyKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbFByb2dyYW0gPSBncHVTaGFkZXIuZ2xQcm9ncmFtO1xyXG4gICAgICAgICAgICBpZiAoY2FjaGUuZ2xQcm9ncmFtICE9PSBnbFByb2dyYW0pIHtcclxuICAgICAgICAgICAgICAgIGdsLnVzZVByb2dyYW0oZ2xQcm9ncmFtKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsUHJvZ3JhbSA9IGdsUHJvZ3JhbTtcclxuICAgICAgICAgICAgICAgIGlzU2hhZGVyQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJhc3Rlcml6ZXIgc3RhdGVcclxuICAgICAgICBjb25zdCBycyA9IGdwdVBpcGVsaW5lU3RhdGUucnM7XHJcbiAgICAgICAgaWYgKHJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUucnMuY3VsbE1vZGUgIT09IHJzLmN1bGxNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJzLmN1bGxNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhDdWxsTW9kZS5OT05FOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmRpc2FibGUoZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYQ3VsbE1vZGUuRlJPTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkNVTExfRkFDRSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmN1bGxGYWNlKGdsLkZST05UKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYQ3VsbE1vZGUuQkFDSzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY3VsbEZhY2UoZ2wuQkFDSyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLnJzLmN1bGxNb2RlID0gcnMuY3VsbE1vZGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlzRnJvbnRGYWNlQ0NXID0gcnMuaXNGcm9udEZhY2VDQ1cgIT09IGdmeFN0YXRlQ2FjaGUucmV2ZXJzZUNXOyAvLyBib29sZWFuIFhPUlxyXG4gICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUucnMuaXNGcm9udEZhY2VDQ1cgIT09IGlzRnJvbnRGYWNlQ0NXKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5mcm9udEZhY2UoaXNGcm9udEZhY2VDQ1cgPyBnbC5DQ1cgOiBnbC5DVyk7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5ycy5pc0Zyb250RmFjZUNDVyA9IGlzRnJvbnRGYWNlQ0NXO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKGRldmljZS5zdGF0ZUNhY2hlLnJzLmRlcHRoQmlhcyAhPT0gcnMuZGVwdGhCaWFzKSB8fFxyXG4gICAgICAgICAgICAgICAgKGRldmljZS5zdGF0ZUNhY2hlLnJzLmRlcHRoQmlhc1Nsb3AgIT09IHJzLmRlcHRoQmlhc1Nsb3ApKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5wb2x5Z29uT2Zmc2V0KHJzLmRlcHRoQmlhcywgcnMuZGVwdGhCaWFzU2xvcCk7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5ycy5kZXB0aEJpYXMgPSBycy5kZXB0aEJpYXM7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5ycy5kZXB0aEJpYXNTbG9wID0gcnMuZGVwdGhCaWFzU2xvcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRldmljZS5zdGF0ZUNhY2hlLnJzLmxpbmVXaWR0aCAhPT0gcnMubGluZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5saW5lV2lkdGgocnMubGluZVdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLnJzLmxpbmVXaWR0aCA9IHJzLmxpbmVXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IC8vIHJhc3Rlcml6YXRlciBzdGF0ZVxyXG5cclxuICAgICAgICAvLyBkZXB0aC1zdGVuY2lsIHN0YXRlXHJcbiAgICAgICAgY29uc3QgZHNzID0gZ3B1UGlwZWxpbmVTdGF0ZS5kc3M7XHJcbiAgICAgICAgaWYgKGRzcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5kZXB0aFRlc3QgIT09IGRzcy5kZXB0aFRlc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkc3MuZGVwdGhUZXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLmRlcHRoVGVzdCA9IGRzcy5kZXB0aFRlc3Q7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5kc3MuZGVwdGhXcml0ZSAhPT0gZHNzLmRlcHRoV3JpdGUpIHtcclxuICAgICAgICAgICAgICAgIGdsLmRlcHRoTWFzayhkc3MuZGVwdGhXcml0ZSk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3MuZGVwdGhXcml0ZSA9IGRzcy5kZXB0aFdyaXRlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUuZHNzLmRlcHRoRnVuYyAhPT0gZHNzLmRlcHRoRnVuYykge1xyXG4gICAgICAgICAgICAgICAgZ2wuZGVwdGhGdW5jKFdlYkdMQ21wRnVuY3NbZHNzLmRlcHRoRnVuY10pO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLmRlcHRoRnVuYyA9IGRzcy5kZXB0aEZ1bmM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGZyb250XHJcbiAgICAgICAgICAgIGlmICgoY2FjaGUuZHNzLnN0ZW5jaWxUZXN0RnJvbnQgIT09IGRzcy5zdGVuY2lsVGVzdEZyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsVGVzdEJhY2sgIT09IGRzcy5zdGVuY2lsVGVzdEJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZHNzLnN0ZW5jaWxUZXN0RnJvbnQgfHwgZHNzLnN0ZW5jaWxUZXN0QmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmVuYWJsZShnbC5TVEVOQ0lMX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kaXNhYmxlKGdsLlNURU5DSUxfVEVTVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFRlc3RGcm9udCA9IGRzcy5zdGVuY2lsVGVzdEZyb250O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxUZXN0QmFjayA9IGRzcy5zdGVuY2lsVGVzdEJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoY2FjaGUuZHNzLnN0ZW5jaWxGdW5jRnJvbnQgIT09IGRzcy5zdGVuY2lsRnVuY0Zyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVmRnJvbnQgIT09IGRzcy5zdGVuY2lsUmVmRnJvbnQpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ICE9PSBkc3Muc3RlbmNpbFJlYWRNYXNrRnJvbnQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuc3RlbmNpbEZ1bmNTZXBhcmF0ZShcclxuICAgICAgICAgICAgICAgICAgICBnbC5GUk9OVCxcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTENtcEZ1bmNzW2Rzcy5zdGVuY2lsRnVuY0Zyb250XSxcclxuICAgICAgICAgICAgICAgICAgICBkc3Muc3RlbmNpbFJlZkZyb250LFxyXG4gICAgICAgICAgICAgICAgICAgIGRzcy5zdGVuY2lsUmVhZE1hc2tGcm9udCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxGdW5jRnJvbnQgPSBkc3Muc3RlbmNpbEZ1bmNGcm9udDtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVmRnJvbnQgPSBkc3Muc3RlbmNpbFJlZkZyb250O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ID0gZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKGNhY2hlLmRzcy5zdGVuY2lsRmFpbE9wRnJvbnQgIT09IGRzcy5zdGVuY2lsRmFpbE9wRnJvbnQpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2FjaGUuZHNzLnN0ZW5jaWxaRmFpbE9wRnJvbnQgIT09IGRzcy5zdGVuY2lsWkZhaWxPcEZyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wRnJvbnQgIT09IGRzcy5zdGVuY2lsUGFzc09wRnJvbnQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuRlJPTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsRmFpbE9wRnJvbnRdLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYkdMU3RlbmNpbE9wc1tkc3Muc3RlbmNpbFpGYWlsT3BGcm9udF0sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsUGFzc09wRnJvbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEZyb250ID0gZHNzLnN0ZW5jaWxGYWlsT3BGcm9udDtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsWkZhaWxPcEZyb250ID0gZHNzLnN0ZW5jaWxaRmFpbE9wRnJvbnQ7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFBhc3NPcEZyb250ID0gZHNzLnN0ZW5jaWxQYXNzT3BGcm9udDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgIT09IGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpIHtcclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuRlJPTlQsIGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9IGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGJhY2tcclxuICAgICAgICAgICAgaWYgKChjYWNoZS5kc3Muc3RlbmNpbEZ1bmNCYWNrICE9PSBkc3Muc3RlbmNpbEZ1bmNCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVmQmFjayAhPT0gZHNzLnN0ZW5jaWxSZWZCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVhZE1hc2tCYWNrICE9PSBkc3Muc3RlbmNpbFJlYWRNYXNrQmFjaykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLkJBQ0ssXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xDbXBGdW5jc1tkc3Muc3RlbmNpbEZ1bmNCYWNrXSxcclxuICAgICAgICAgICAgICAgICAgICBkc3Muc3RlbmNpbFJlZkJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsRnVuY0JhY2sgPSBkc3Muc3RlbmNpbEZ1bmNCYWNrO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWZCYWNrID0gZHNzLnN0ZW5jaWxSZWZCYWNrO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgPSBkc3Muc3RlbmNpbFJlYWRNYXNrQmFjaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEJhY2sgIT09IGRzcy5zdGVuY2lsRmFpbE9wQmFjaykgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5kc3Muc3RlbmNpbFpGYWlsT3BCYWNrICE9PSBkc3Muc3RlbmNpbFpGYWlsT3BCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wQmFjayAhPT0gZHNzLnN0ZW5jaWxQYXNzT3BCYWNrKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxPcFNlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLkJBQ0ssXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsRmFpbE9wQmFja10sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsWkZhaWxPcEJhY2tdLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYkdMU3RlbmNpbE9wc1tkc3Muc3RlbmNpbFBhc3NPcEJhY2tdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEJhY2sgPSBkc3Muc3RlbmNpbEZhaWxPcEJhY2s7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFpGYWlsT3BCYWNrID0gZHNzLnN0ZW5jaWxaRmFpbE9wQmFjaztcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wQmFjayA9IGRzcy5zdGVuY2lsUGFzc09wQmFjaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayAhPT0gZHNzLnN0ZW5jaWxXcml0ZU1hc2tCYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIGRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgPSBkc3Muc3RlbmNpbFdyaXRlTWFza0JhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGRlcHRoLXN0ZW5jaWwgc3RhdGVcclxuXHJcbiAgICAgICAgLy8gYmxlbmQgc3RhdGVcclxuICAgICAgICBjb25zdCBicyA9IGdwdVBpcGVsaW5lU3RhdGUuYnM7XHJcbiAgICAgICAgaWYgKGJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUuYnMuaXNBMkMgIT09IGJzLmlzQTJDKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnMuaXNBMkMpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5lbmFibGUoZ2wuU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5TQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuaXNBMkMgPSBicy5pc0EyQztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChjYWNoZS5icy5ibGVuZENvbG9yLnggIT09IGJzLmJsZW5kQ29sb3IueCkgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLnkgIT09IGJzLmJsZW5kQ29sb3IueSkgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLnogIT09IGJzLmJsZW5kQ29sb3IueikgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLncgIT09IGJzLmJsZW5kQ29sb3IudykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5ibGVuZENvbG9yKGJzLmJsZW5kQ29sb3IueCwgYnMuYmxlbmRDb2xvci55LCBicy5ibGVuZENvbG9yLnosIGJzLmJsZW5kQ29sb3Iudyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci54ID0gYnMuYmxlbmRDb2xvci54O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci55ID0gYnMuYmxlbmRDb2xvci55O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci56ID0gYnMuYmxlbmRDb2xvci56O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci53ID0gYnMuYmxlbmRDb2xvci53O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQwID0gYnMudGFyZ2V0c1swXTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0MENhY2hlID0gY2FjaGUuYnMudGFyZ2V0c1swXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQwQ2FjaGUuYmxlbmQgIT09IHRhcmdldDAuYmxlbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQwLmJsZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmQgPSB0YXJnZXQwLmJsZW5kO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRhcmdldDBDYWNoZS5ibGVuZEVxICE9PSB0YXJnZXQwLmJsZW5kRXEpIHx8XHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0MENhY2hlLmJsZW5kQWxwaGFFcSAhPT0gdGFyZ2V0MC5ibGVuZEFscGhhRXEpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKFdlYkdMQmxlbmRPcHNbdGFyZ2V0MC5ibGVuZEVxXSwgV2ViR0xCbGVuZE9wc1t0YXJnZXQwLmJsZW5kQWxwaGFFcV0pO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0MENhY2hlLmJsZW5kRXEgPSB0YXJnZXQwLmJsZW5kRXE7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmRBbHBoYUVxID0gdGFyZ2V0MC5ibGVuZEFscGhhRXE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgodGFyZ2V0MENhY2hlLmJsZW5kU3JjICE9PSB0YXJnZXQwLmJsZW5kU3JjKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRhcmdldDBDYWNoZS5ibGVuZERzdCAhPT0gdGFyZ2V0MC5ibGVuZERzdCkgfHxcclxuICAgICAgICAgICAgICAgICh0YXJnZXQwQ2FjaGUuYmxlbmRTcmNBbHBoYSAhPT0gdGFyZ2V0MC5ibGVuZFNyY0FscGhhKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRhcmdldDBDYWNoZS5ibGVuZERzdEFscGhhICE9PSB0YXJnZXQwLmJsZW5kRHN0QWxwaGEpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuYmxlbmRGdW5jU2VwYXJhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xCbGVuZEZhY3RvcnNbdGFyZ2V0MC5ibGVuZFNyY10sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xCbGVuZEZhY3RvcnNbdGFyZ2V0MC5ibGVuZERzdF0sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xCbGVuZEZhY3RvcnNbdGFyZ2V0MC5ibGVuZFNyY0FscGhhXSxcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTEJsZW5kRmFjdG9yc1t0YXJnZXQwLmJsZW5kRHN0QWxwaGFdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmRTcmMgPSB0YXJnZXQwLmJsZW5kU3JjO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0MENhY2hlLmJsZW5kRHN0ID0gdGFyZ2V0MC5ibGVuZERzdDtcclxuICAgICAgICAgICAgICAgIHRhcmdldDBDYWNoZS5ibGVuZFNyY0FscGhhID0gdGFyZ2V0MC5ibGVuZFNyY0FscGhhO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0MENhY2hlLmJsZW5kRHN0QWxwaGEgPSB0YXJnZXQwLmJsZW5kRHN0QWxwaGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQwQ2FjaGUuYmxlbmRDb2xvck1hc2sgIT09IHRhcmdldDAuYmxlbmRDb2xvck1hc2spIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5jb2xvck1hc2soXHJcbiAgICAgICAgICAgICAgICAgICAgKHRhcmdldDAuYmxlbmRDb2xvck1hc2sgJiBHRlhDb2xvck1hc2suUikgIT09IEdGWENvbG9yTWFzay5OT05FLFxyXG4gICAgICAgICAgICAgICAgICAgICh0YXJnZXQwLmJsZW5kQ29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkcpICE9PSBHRlhDb2xvck1hc2suTk9ORSxcclxuICAgICAgICAgICAgICAgICAgICAodGFyZ2V0MC5ibGVuZENvbG9yTWFzayAmIEdGWENvbG9yTWFzay5CKSAhPT0gR0ZYQ29sb3JNYXNrLk5PTkUsXHJcbiAgICAgICAgICAgICAgICAgICAgKHRhcmdldDAuYmxlbmRDb2xvck1hc2sgJiBHRlhDb2xvck1hc2suQSkgIT09IEdGWENvbG9yTWFzay5OT05FKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmRDb2xvck1hc2sgPSB0YXJnZXQwLmJsZW5kQ29sb3JNYXNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBibGVuZCBzdGF0ZVxyXG4gICAgfSAvLyBiaW5kIHBpcGVsaW5lXHJcblxyXG4gICAgLy8gYmluZCBkZXNjcmlwdG9yIHNldHNcclxuICAgIGlmIChncHVQaXBlbGluZVN0YXRlICYmIGdwdVBpcGVsaW5lU3RhdGUuZ3B1UGlwZWxpbmVMYXlvdXQgJiYgZ3B1U2hhZGVyKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsb2NrTGVuID0gZ3B1U2hhZGVyLmdsQmxvY2tzLmxlbmd0aDtcclxuICAgICAgICBjb25zdCBkeW5hbWljT2Zmc2V0SW5kaWNlcyA9IGdwdVBpcGVsaW5lU3RhdGUuZ3B1UGlwZWxpbmVMYXlvdXQuZHluYW1pY09mZnNldEluZGljZXM7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYmxvY2tMZW47IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCBnbEJsb2NrID0gZ3B1U2hhZGVyLmdsQmxvY2tzW2pdO1xyXG4gICAgICAgICAgICBjb25zdCBncHVEZXNjcmlwdG9yU2V0ID0gZ3B1RGVzY3JpcHRvclNldHNbZ2xCbG9jay5zZXRdO1xyXG4gICAgICAgICAgICBjb25zdCBncHVEZXNjcmlwdG9yID0gZ3B1RGVzY3JpcHRvclNldCAmJiBncHVEZXNjcmlwdG9yU2V0LmdwdURlc2NyaXB0b3JzW2dsQmxvY2suYmluZGluZ107XHJcblxyXG4gICAgICAgICAgICBpZiAoIWdwdURlc2NyaXB0b3IgfHwgIWdwdURlc2NyaXB0b3IuZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihgQnVmZmVyIGJpbmRpbmcgJyR7Z2xCbG9jay5uYW1lfScgYXQgc2V0ICR7Z2xCbG9jay5zZXR9IGJpbmRpbmcgJHtnbEJsb2NrLmJpbmRpbmd9IGlzIG5vdCBib3VuZGVkYCk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY09mZnNldEluZGV4U2V0ID0gZHluYW1pY09mZnNldEluZGljZXNbZ2xCbG9jay5zZXRdO1xyXG4gICAgICAgICAgICBjb25zdCBkeW5hbWljT2Zmc2V0SW5kZXggPSBkeW5hbWljT2Zmc2V0SW5kZXhTZXQgJiYgZHluYW1pY09mZnNldEluZGV4U2V0W2dsQmxvY2suYmluZGluZ107XHJcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSBncHVEZXNjcmlwdG9yLmdwdUJ1ZmZlci5nbE9mZnNldDtcclxuICAgICAgICAgICAgaWYgKGR5bmFtaWNPZmZzZXRJbmRleCA+PSAwKSBvZmZzZXQgKz0gZHluYW1pY09mZnNldHNbZHluYW1pY09mZnNldEluZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5nbEJpbmRVQk9zW2dsQmxvY2suZ2xCaW5kaW5nXSAhPT0gZ3B1RGVzY3JpcHRvci5ncHVCdWZmZXIuZ2xCdWZmZXIgfHxcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsQmluZFVCT09mZnNldHNbZ2xCbG9jay5nbEJpbmRpbmddICE9PSBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyUmFuZ2UoZ2wuVU5JRk9STV9CVUZGRVIsIGdsQmxvY2suZ2xCaW5kaW5nLCBncHVEZXNjcmlwdG9yLmdwdUJ1ZmZlci5nbEJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0LCBncHVEZXNjcmlwdG9yLmdwdUJ1ZmZlci5zaXplKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlckJhc2UoZ2wuVU5JRk9STV9CVUZGRVIsIGdsQmxvY2suZ2xCaW5kaW5nLCBncHVEZXNjcmlwdG9yLmdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5nbFVuaWZvcm1CdWZmZXIgPSBjYWNoZS5nbEJpbmRVQk9zW2dsQmxvY2suZ2xCaW5kaW5nXSA9IGdwdURlc2NyaXB0b3IuZ3B1QnVmZmVyLmdsQnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xCaW5kVUJPT2Zmc2V0c1tnbEJsb2NrLmdsQmluZGluZ10gPSBvZmZzZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNhbXBsZXJMZW4gPSBncHVTaGFkZXIuZ2xTYW1wbGVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1wbGVyTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZ2xTYW1wbGVyID0gZ3B1U2hhZGVyLmdsU2FtcGxlcnNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3JTZXQgPSBncHVEZXNjcmlwdG9yU2V0c1tnbFNhbXBsZXIuc2V0XTtcclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3JJbmRleCA9IGdwdURlc2NyaXB0b3JTZXQgJiYgZ3B1RGVzY3JpcHRvclNldC5kZXNjcmlwdG9ySW5kaWNlc1tnbFNhbXBsZXIuYmluZGluZ107XHJcbiAgICAgICAgICAgIGxldCBncHVEZXNjcmlwdG9yID0gZ3B1RGVzY3JpcHRvclNldCAmJiBncHVEZXNjcmlwdG9yU2V0LmdwdURlc2NyaXB0b3JzW2Rlc2NyaXB0b3JJbmRleF07XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IGdsU2FtcGxlci51bml0cy5sZW5ndGg7IGwrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4VW5pdCA9IGdsU2FtcGxlci51bml0c1tsXTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFRleFVuaXQgPSBjYWNoZS5nbFRleFVuaXRzW3RleFVuaXRdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghZ3B1RGVzY3JpcHRvciB8fCAhZ3B1RGVzY3JpcHRvci5ncHVUZXh0dXJlIHx8ICFncHVEZXNjcmlwdG9yLmdwdVNhbXBsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcihgU2FtcGxlciBiaW5kaW5nICcke2dsU2FtcGxlci5uYW1lfScgYXQgc2V0ICR7Z2xTYW1wbGVyLnNldH0gYmluZGluZyAke2dsU2FtcGxlci5iaW5kaW5nfSBpbmRleCAke2x9IGlzIG5vdCBib3VuZGVkYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdwdURlc2NyaXB0b3IuZ3B1VGV4dHVyZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGdwdURlc2NyaXB0b3IuZ3B1VGV4dHVyZS5zaXplID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncHVUZXh0dXJlID0gZ3B1RGVzY3JpcHRvci5ncHVUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnbFRleFVuaXQuZ2xUZXh0dXJlICE9PSBncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUudGV4VW5pdCAhPT0gdGV4VW5pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRleFVuaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudGV4VW5pdCA9IHRleFVuaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBkZXZpY2UubnVsbFRleDJEIS5ncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3B1U2FtcGxlciA9IGdwdURlc2NyaXB0b3IuZ3B1U2FtcGxlcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xTYW1wbGVyVW5pdHNbdGV4VW5pdF0gIT09IGdwdVNhbXBsZXIuZ2xTYW1wbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRTYW1wbGVyKHRleFVuaXQsIGdwdVNhbXBsZXIuZ2xTYW1wbGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xTYW1wbGVyVW5pdHNbdGV4VW5pdF0gPSBncHVTYW1wbGVyLmdsU2FtcGxlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZ3B1RGVzY3JpcHRvciA9IGdwdURlc2NyaXB0b3JTZXQuZ3B1RGVzY3JpcHRvcnNbKytkZXNjcmlwdG9ySW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSAvLyBiaW5kIGRlc2NyaXB0b3Igc2V0c1xyXG5cclxuICAgIC8vIGJpbmQgdmVydGV4L2luZGV4IGJ1ZmZlclxyXG4gICAgaWYgKGdwdUlucHV0QXNzZW1ibGVyICYmIGdwdVNoYWRlciAmJlxyXG4gICAgICAgIChpc1NoYWRlckNoYW5nZWQgfHwgZ2Z4U3RhdGVDYWNoZS5ncHVJbnB1dEFzc2VtYmxlciAhPT0gZ3B1SW5wdXRBc3NlbWJsZXIpKSB7XHJcbiAgICAgICAgZ2Z4U3RhdGVDYWNoZS5ncHVJbnB1dEFzc2VtYmxlciA9IGdwdUlucHV0QXNzZW1ibGVyO1xyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnVzZVZBTykge1xyXG4gICAgICAgICAgICAvLyBjaGVjayB2YW9cclxuICAgICAgICAgICAgbGV0IGdsVkFPID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ2xWQU9zLmdldChncHVTaGFkZXIuZ2xQcm9ncmFtISk7XHJcbiAgICAgICAgICAgIGlmICghZ2xWQU8pIHtcclxuICAgICAgICAgICAgICAgIGdsVkFPID0gZ2wuY3JlYXRlVmVydGV4QXJyYXkoKSE7XHJcbiAgICAgICAgICAgICAgICBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3Muc2V0KGdwdVNoYWRlci5nbFByb2dyYW0hLCBnbFZBTyk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KGdsVkFPKTtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xBcnJheUJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGdsQXR0cmliOiBJV2ViR0wyQXR0cmliIHwgbnVsbDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3B1U2hhZGVyLmdsSW5wdXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2xJbnB1dCA9IGdwdVNoYWRlci5nbElucHV0c1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBnbEF0dHJpYiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1SW5wdXRBc3NlbWJsZXIuZ2xBdHRyaWJzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYiA9IGdwdUlucHV0QXNzZW1ibGVyLmdsQXR0cmlic1trXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJpYi5uYW1lID09PSBnbElucHV0Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsQXR0cmliID0gYXR0cmliO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnbEF0dHJpYikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xBcnJheUJ1ZmZlciAhPT0gZ2xBdHRyaWIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnbEF0dHJpYi5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEFycmF5QnVmZmVyID0gZ2xBdHRyaWIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgZ2xBdHRyaWIuY29tcG9uZW50Q291bnQ7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2xMb2MgPSBnbElucHV0LmdsTG9jICsgYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYk9mZnNldCA9IGdsQXR0cmliLm9mZnNldCArIGdsQXR0cmliLnNpemUgKiBjO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGdsTG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsQ3VycmVudEF0dHJpYkxvY3NbZ2xMb2NdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsTG9jLCBnbEF0dHJpYi5jb3VudCwgZ2xBdHRyaWIuZ2xUeXBlLCBnbEF0dHJpYi5pc05vcm1hbGl6ZWQsIGdsQXR0cmliLnN0cmlkZSwgYXR0cmliT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYkRpdmlzb3IoZ2xMb2MsIGdsQXR0cmliLmlzSW5zdGFuY2VkID8gMSA6IDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGdwdUJ1ZmZlciA9IGdwdUlucHV0QXNzZW1ibGVyLmdwdUluZGV4QnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5nbEFycmF5QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsRWxlbWVudEFycmF5QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPICE9PSBnbFZBTykge1xyXG4gICAgICAgICAgICAgICAgZ2wuYmluZFZlcnRleEFycmF5KGdsVkFPKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsVkFPID0gZ2xWQU87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGRldmljZS5tYXhWZXJ0ZXhBdHRyaWJ1dGVzOyArK2EpIHtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsQ3VycmVudEF0dHJpYkxvY3NbYV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncHVTaGFkZXIuZ2xJbnB1dHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsSW5wdXQgPSBncHVTaGFkZXIuZ2xJbnB1dHNbal07XHJcbiAgICAgICAgICAgICAgICBsZXQgZ2xBdHRyaWI6IElXZWJHTDJBdHRyaWIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdwdUlucHV0QXNzZW1ibGVyLmdsQXR0cmlicy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYiA9IGdwdUlucHV0QXNzZW1ibGVyLmdsQXR0cmlic1trXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmliLm5hbWUgPT09IGdsSW5wdXQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbEF0dHJpYiA9IGF0dHJpYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChnbEF0dHJpYikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbEFycmF5QnVmZmVyICE9PSBnbEF0dHJpYi5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ2xBdHRyaWIuZ2xCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEFycmF5QnVmZmVyID0gZ2xBdHRyaWIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBjID0gMDsgYyA8IGdsQXR0cmliLmNvbXBvbmVudENvdW50OyArK2MpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2xMb2MgPSBnbElucHV0LmdsTG9jICsgYztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmliT2Zmc2V0ID0gZ2xBdHRyaWIub2Zmc2V0ICsgZ2xBdHRyaWIuc2l6ZSAqIGM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNhY2hlLmdsRW5hYmxlZEF0dHJpYkxvY3NbZ2xMb2NdICYmIGdsTG9jID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGdsTG9jKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsRW5hYmxlZEF0dHJpYkxvY3NbZ2xMb2NdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEN1cnJlbnRBdHRyaWJMb2NzW2dsTG9jXSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGdsTG9jLCBnbEF0dHJpYi5jb3VudCwgZ2xBdHRyaWIuZ2xUeXBlLCBnbEF0dHJpYi5pc05vcm1hbGl6ZWQsIGdsQXR0cmliLnN0cmlkZSwgYXR0cmliT2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudmVydGV4QXR0cmliRGl2aXNvcihnbExvYywgZ2xBdHRyaWIuaXNJbnN0YW5jZWQgPyAxIDogMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IC8vIGZvclxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kZXhCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IGdwdUJ1ZmZlci5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBkZXZpY2UubWF4VmVydGV4QXR0cmlidXRlczsgKythKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xFbmFibGVkQXR0cmliTG9jc1thXSAhPT0gY2FjaGUuZ2xDdXJyZW50QXR0cmliTG9jc1thXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheShhKTtcclxuICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbEVuYWJsZWRBdHRyaWJMb2NzW2FdID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IC8vIGJpbmQgdmVydGV4L2luZGV4IGJ1ZmZlclxyXG5cclxuICAgIC8vIHVwZGF0ZSBkeW5hbWljIHN0YXRlc1xyXG4gICAgaWYgKGdwdVBpcGVsaW5lU3RhdGUgJiYgZ3B1UGlwZWxpbmVTdGF0ZS5keW5hbWljU3RhdGVzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGRzTGVuID0gZ3B1UGlwZWxpbmVTdGF0ZS5keW5hbWljU3RhdGVzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGRzTGVuOyBrKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY1N0YXRlID0gZ3B1UGlwZWxpbmVTdGF0ZS5keW5hbWljU3RhdGVzW2tdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGR5bmFtaWNTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhEeW5hbWljU3RhdGVGbGFnQml0LlZJRVdQT1JUOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS52aWV3cG9ydC5sZWZ0ICE9PSB2aWV3cG9ydC5sZWZ0IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS52aWV3cG9ydC50b3AgIT09IHZpZXdwb3J0LnRvcCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQud2lkdGggIT09IHZpZXdwb3J0LndpZHRoIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS52aWV3cG9ydC5oZWlnaHQgIT09IHZpZXdwb3J0LmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnZpZXdwb3J0KHZpZXdwb3J0LmxlZnQsIHZpZXdwb3J0LnRvcCwgdmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQubGVmdCA9IHZpZXdwb3J0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS52aWV3cG9ydC50b3AgPSB2aWV3cG9ydC50b3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS52aWV3cG9ydC53aWR0aCA9IHZpZXdwb3J0LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQuaGVpZ2h0ID0gdmlld3BvcnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhEeW5hbWljU3RhdGVGbGFnQml0LlNDSVNTT1I6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Npc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuc2Npc3NvclJlY3QueCAhPT0gc2Npc3Nvci54IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC55ICE9PSBzY2lzc29yLnkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LndpZHRoICE9PSBzY2lzc29yLndpZHRoIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC5oZWlnaHQgIT09IHNjaXNzb3IuaGVpZ2h0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuc2Npc3NvcihzY2lzc29yLngsIHNjaXNzb3IueSwgc2Npc3Nvci53aWR0aCwgc2Npc3Nvci5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LnggPSBzY2lzc29yLng7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC55ID0gc2Npc3Nvci55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3Qud2lkdGggPSBzY2lzc29yLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QuaGVpZ2h0ID0gc2Npc3Nvci5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuTElORV9XSURUSDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5lV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLnJzLmxpbmVXaWR0aCAhPT0gbGluZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5saW5lV2lkdGgobGluZVdpZHRoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnJzLmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdC5ERVBUSF9CSUFTOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlcHRoQmlhcykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChjYWNoZS5ycy5kZXB0aEJpYXMgIT09IGRlcHRoQmlhcy5jb25zdGFudEZhY3RvcikgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjYWNoZS5ycy5kZXB0aEJpYXNTbG9wICE9PSBkZXB0aEJpYXMuc2xvcGVGYWN0b3IpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5wb2x5Z29uT2Zmc2V0KGRlcHRoQmlhcy5jb25zdGFudEZhY3RvciwgZGVwdGhCaWFzLnNsb3BlRmFjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnJzLmRlcHRoQmlhcyA9IGRlcHRoQmlhcy5jb25zdGFudEZhY3RvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnJzLmRlcHRoQmlhc1Nsb3AgPSBkZXB0aEJpYXMuc2xvcGVGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuQkxFTkRfQ09OU1RBTlRTOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChjYWNoZS5icy5ibGVuZENvbG9yLnggIT09IGJsZW5kQ29uc3RhbnRzWzBdKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FjaGUuYnMuYmxlbmRDb2xvci55ICE9PSBibGVuZENvbnN0YW50c1sxXSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGNhY2hlLmJzLmJsZW5kQ29sb3IueiAhPT0gYmxlbmRDb25zdGFudHNbMl0pIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLncgIT09IGJsZW5kQ29uc3RhbnRzWzNdKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmxlbmRDb2xvcihibGVuZENvbnN0YW50c1swXSwgYmxlbmRDb25zdGFudHNbMV0sIGJsZW5kQ29uc3RhbnRzWzJdLCBibGVuZENvbnN0YW50c1szXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5icy5ibGVuZENvbG9yLnggPSBibGVuZENvbnN0YW50c1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci55ID0gYmxlbmRDb25zdGFudHNbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmJzLmJsZW5kQ29sb3IueiA9IGJsZW5kQ29uc3RhbnRzWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5icy5ibGVuZENvbG9yLncgPSBibGVuZENvbnN0YW50c1szXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuU1RFTkNJTF9XUklURV9NQVNLOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0ZW5jaWxXcml0ZU1hc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGVuY2lsV3JpdGVNYXNrLmZhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYU3RlbmNpbEZhY2UuRlJPTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCAhPT0gc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5GUk9OVCwgc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250ID0gc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhTdGVuY2lsRmFjZS5CQUNLOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayAhPT0gc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5CQUNLLCBzdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayA9IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYU3RlbmNpbEZhY2UuQUxMOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgIT09IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayAhPT0gc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE1hc2soc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250ID0gc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayA9IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdC5TVEVOQ0lMX0NPTVBBUkVfTUFTSzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGVuY2lsQ29tcGFyZU1hc2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGVuY2lsQ29tcGFyZU1hc2suZmFjZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhTdGVuY2lsRmFjZS5GUk9OVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kc3Muc3RlbmNpbFJlZkZyb250ICE9PSBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVhZE1hc2tGcm9udCAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5GUk9OVCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdlYkdMQ21wRnVuY3NbY2FjaGUuZHNzLnN0ZW5jaWxGdW5jRnJvbnRdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVmRnJvbnQgPSBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrRnJvbnQgPSBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhTdGVuY2lsRmFjZS5CQUNLOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsUmVmQmFjayAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrQmFjayAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5CQUNLLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2ViR0xDbXBGdW5jc1tjYWNoZS5kc3Muc3RlbmNpbEZ1bmNCYWNrXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlZkJhY2sgPSBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrQmFjayA9IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWFN0ZW5jaWxGYWNlLkFMTDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kc3Muc3RlbmNpbFJlZkZyb250ICE9PSBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVhZE1hc2tGcm9udCAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVmQmFjayAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrQmFjayAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxGdW5jKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV2ViR0xDbXBGdW5jc1tjYWNoZS5kc3Muc3RlbmNpbEZ1bmNCYWNrXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlZkZyb250ID0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ID0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlZkJhY2sgPSBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrQmFjayA9IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gLy8gc3dpdGNoXHJcbiAgICAgICAgfSAvLyBmb3JcclxuICAgIH0gLy8gdXBkYXRlIGR5bmFtaWMgc3RhdGVzXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTDJDbWRGdW5jRHJhdyAoZGV2aWNlOiBXZWJHTDJEZXZpY2UsIGRyYXdJbmZvOiBHRlhEcmF3SW5mbykge1xyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcbiAgICBjb25zdCB7IGdwdUlucHV0QXNzZW1ibGVyLCBnbFByaW1pdGl2ZSB9ID0gZ2Z4U3RhdGVDYWNoZTtcclxuXHJcbiAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIpIHtcclxuICAgICAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kaXJlY3RCdWZmZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kaXJlY3RzID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kaXJlY3RCdWZmZXIuaW5kaXJlY3RzO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGluZGlyZWN0cy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViRHJhd0luZm8gPSBpbmRpcmVjdHNba107XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSBncHVJbnB1dEFzc2VtYmxlci5ncHVJbmRleEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGlmIChzdWJEcmF3SW5mby5pbnN0YW5jZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViRHJhd0luZm8uaW5kZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHN1YkRyYXdJbmZvLmZpcnN0SW5kZXggKiBncHVCdWZmZXIuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzSW5zdGFuY2VkKGdsUHJpbWl0aXZlLCBzdWJEcmF3SW5mby5pbmRleENvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdUlucHV0QXNzZW1ibGVyLmdsSW5kZXhUeXBlLCBvZmZzZXQsIHN1YkRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJEcmF3SW5mby52ZXJ0ZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0FycmF5c0luc3RhbmNlZChnbFByaW1pdGl2ZSwgc3ViRHJhd0luZm8uZmlyc3RWZXJ0ZXgsIHN1YkRyYXdJbmZvLnZlcnRleENvdW50LCBzdWJEcmF3SW5mby5pbnN0YW5jZUNvdW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YkRyYXdJbmZvLmluZGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBzdWJEcmF3SW5mby5maXJzdEluZGV4ICogZ3B1QnVmZmVyLnN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbFByaW1pdGl2ZSwgc3ViRHJhd0luZm8uaW5kZXhDb3VudCwgZ3B1SW5wdXRBc3NlbWJsZXIuZ2xJbmRleFR5cGUsIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN1YkRyYXdJbmZvLnZlcnRleENvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5kcmF3QXJyYXlzKGdsUHJpbWl0aXZlLCBzdWJEcmF3SW5mby5maXJzdFZlcnRleCwgc3ViRHJhd0luZm8udmVydGV4Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChkcmF3SW5mby5pbnN0YW5jZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kZXhCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZHJhd0luZm8uaW5kZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gZHJhd0luZm8uZmlyc3RJbmRleCAqIGdwdUlucHV0QXNzZW1ibGVyLmdwdUluZGV4QnVmZmVyLnN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzSW5zdGFuY2VkKGdsUHJpbWl0aXZlLCBkcmF3SW5mby5pbmRleENvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1SW5wdXRBc3NlbWJsZXIuZ2xJbmRleFR5cGUsIG9mZnNldCwgZHJhd0luZm8uaW5zdGFuY2VDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkcmF3SW5mby52ZXJ0ZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kcmF3QXJyYXlzSW5zdGFuY2VkKGdsUHJpbWl0aXZlLCBkcmF3SW5mby5maXJzdFZlcnRleCwgZHJhd0luZm8udmVydGV4Q291bnQsIGRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdUlucHV0QXNzZW1ibGVyLmdwdUluZGV4QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyYXdJbmZvLmluZGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGRyYXdJbmZvLmZpcnN0SW5kZXggKiBncHVJbnB1dEFzc2VtYmxlci5ncHVJbmRleEJ1ZmZlci5zdHJpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbFByaW1pdGl2ZSwgZHJhd0luZm8uaW5kZXhDb3VudCwgZ3B1SW5wdXRBc3NlbWJsZXIuZ2xJbmRleFR5cGUsIG9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkcmF3SW5mby52ZXJ0ZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kcmF3QXJyYXlzKGdsUHJpbWl0aXZlLCBkcmF3SW5mby5maXJzdFZlcnRleCwgZHJhd0luZm8udmVydGV4Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjbWRJZHMgPSBuZXcgQXJyYXk8bnVtYmVyPihXZWJHTDJDbWQuQ09VTlQpO1xyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0V4ZWN1dGVDbWRzIChkZXZpY2U6IFdlYkdMMkRldmljZSwgY21kUGFja2FnZTogV2ViR0wyQ21kUGFja2FnZSkge1xyXG4gICAgY21kSWRzLmZpbGwoMCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbWRQYWNrYWdlLmNtZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBjbWQgPSBjbWRQYWNrYWdlLmNtZHMuYXJyYXlbaV07XHJcbiAgICAgICAgY29uc3QgY21kSWQgPSBjbWRJZHNbY21kXSsrO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGNtZCkge1xyXG4gICAgICAgICAgICBjYXNlIFdlYkdMMkNtZC5CRUdJTl9SRU5ERVJfUEFTUzoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kMCA9IGNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTDJDbWRGdW5jQmVnaW5SZW5kZXJQYXNzKGRldmljZSwgY21kMC5ncHVSZW5kZXJQYXNzLCBjbWQwLmdwdUZyYW1lYnVmZmVyLCBjbWQwLnJlbmRlckFyZWEsXHJcbiAgICAgICAgICAgICAgICAgICAgY21kMC5jbGVhckNvbG9ycywgY21kMC5jbGVhckRlcHRoLCBjbWQwLmNsZWFyU3RlbmNpbCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBjYXNlIFdlYkdMMkNtZC5FTkRfUkVOREVSX1BBU1M6IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlYkdMIDIuMCBkb2Vzbid0IHN1cHBvcnQgc3RvcmUgb3BlcmF0aW9uIG9mIGF0dGFjaG1lbnRzLlxyXG4gICAgICAgICAgICAgICAgLy8gR0ZYU3RvcmVPcC5TdG9yZSBpcyB0aGUgZGVmYXVsdCBHTCBiZWhhdmlvci5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhc2UgV2ViR0wyQ21kLkJJTkRfU1RBVEVTOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQyID0gY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTDJDbWRGdW5jQmluZFN0YXRlcyhkZXZpY2UsIGNtZDIuZ3B1UGlwZWxpbmVTdGF0ZSwgY21kMi5ncHVJbnB1dEFzc2VtYmxlciwgY21kMi5ncHVEZXNjcmlwdG9yU2V0cywgY21kMi5keW5hbWljT2Zmc2V0cyxcclxuICAgICAgICAgICAgICAgICAgICBjbWQyLnZpZXdwb3J0LCBjbWQyLnNjaXNzb3IsIGNtZDIubGluZVdpZHRoLCBjbWQyLmRlcHRoQmlhcywgY21kMi5ibGVuZENvbnN0YW50cyxcclxuICAgICAgICAgICAgICAgICAgICBjbWQyLmRlcHRoQm91bmRzLCBjbWQyLnN0ZW5jaWxXcml0ZU1hc2ssIGNtZDIuc3RlbmNpbENvbXBhcmVNYXNrKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgV2ViR0wyQ21kLkRSQVc6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZDMgPSBjbWRQYWNrYWdlLmRyYXdDbWRzLmFycmF5W2NtZElkXTtcclxuICAgICAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNEcmF3KGRldmljZSwgY21kMy5kcmF3SW5mbyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFdlYkdMMkNtZC5VUERBVEVfQlVGRkVSOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQ0ID0gY21kUGFja2FnZS51cGRhdGVCdWZmZXJDbWRzLmFycmF5W2NtZElkXTtcclxuICAgICAgICAgICAgICAgIFdlYkdMMkNtZEZ1bmNVcGRhdGVCdWZmZXIoZGV2aWNlLCBjbWQ0LmdwdUJ1ZmZlciBhcyBJV2ViR0wyR1BVQnVmZmVyLCBjbWQ0LmJ1ZmZlciBhcyBHRlhCdWZmZXJTb3VyY2UsIGNtZDQub2Zmc2V0LCBjbWQ0LnNpemUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBXZWJHTDJDbWQuQ09QWV9CVUZGRVJfVE9fVEVYVFVSRToge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kNSA9IGNtZFBhY2thZ2UuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMuYXJyYXlbY21kSWRdO1xyXG4gICAgICAgICAgICAgICAgV2ViR0wyQ21kRnVuY0NvcHlCdWZmZXJzVG9UZXh0dXJlKGRldmljZSwgY21kNS5idWZmZXJzLCBjbWQ1LmdwdVRleHR1cmUgYXMgSVdlYkdMMkdQVVRleHR1cmUsIGNtZDUucmVnaW9ucyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gc3dpdGNoXHJcbiAgICB9IC8vIGZvclxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0NvcHlUZXhJbWFnZXNUb1RleHR1cmUgKFxyXG4gICAgZGV2aWNlOiBXZWJHTDJEZXZpY2UsXHJcbiAgICB0ZXhJbWFnZXM6IFRleEltYWdlU291cmNlW10sXHJcbiAgICBncHVUZXh0dXJlOiBJV2ViR0wyR1BVVGV4dHVyZSxcclxuICAgIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGdsVGV4VW5pdCA9IGRldmljZS5zdGF0ZUNhY2hlLmdsVGV4VW5pdHNbZGV2aWNlLnN0YXRlQ2FjaGUudGV4VW5pdF07XHJcbiAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuID0gMDtcclxuICAgIGxldCBmID0gMDtcclxuXHJcbiAgICBzd2l0Y2ggKGdwdVRleHR1cmUuZ2xUYXJnZXQpIHtcclxuICAgICAgICBjYXNlIGdsLlRFWFRVUkVfMkQ6IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZWdpb25zLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSByZWdpb25zW2tdO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRChnbC5URVhUVVJFXzJELCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LFxyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCB0ZXhJbWFnZXNbbisrXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgZ2wuVEVYVFVSRV9DVUJFX01BUDoge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJlZ2lvbnMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHJlZ2lvbnNba107XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmY291bnQgPSByZWdpb24udGV4U3VicmVzLmJhc2VBcnJheUxheWVyICsgcmVnaW9uLnRleFN1YnJlcy5sYXllckNvdW50O1xyXG4gICAgICAgICAgICAgICAgZm9yIChmID0gcmVnaW9uLnRleFN1YnJlcy5iYXNlQXJyYXlMYXllcjsgZiA8IGZjb3VudDsgKytmKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbEZvcm1hdCwgZ3B1VGV4dHVyZS5nbFR5cGUsIHRleEltYWdlc1tuKytdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHTCB0ZXh0dXJlIHR5cGUsIGNvcHkgYnVmZmVyIHRvIHRleHR1cmUgZmFpbGVkLicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoZ3B1VGV4dHVyZS5mbGFncyAmIEdGWFRleHR1cmVGbGFnQml0LkdFTl9NSVBNQVApIHtcclxuICAgICAgICBnbC5nZW5lcmF0ZU1pcG1hcChncHVUZXh0dXJlLmdsVGFyZ2V0KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMMkNtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZSAoXHJcbiAgICBkZXZpY2U6IFdlYkdMMkRldmljZSxcclxuICAgIGJ1ZmZlcnM6IEFycmF5QnVmZmVyVmlld1tdLFxyXG4gICAgZ3B1VGV4dHVyZTogSVdlYkdMMkdQVVRleHR1cmUsXHJcbiAgICByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdKSB7XHJcblxyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcbiAgICBjb25zdCBnbFRleFVuaXQgPSBkZXZpY2Uuc3RhdGVDYWNoZS5nbFRleFVuaXRzW2RldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRdO1xyXG4gICAgaWYgKGdsVGV4VW5pdC5nbFRleHR1cmUgIT09IGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgIGdsVGV4VW5pdC5nbFRleHR1cmUgPSBncHVUZXh0dXJlLmdsVGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbiA9IDA7XHJcbiAgICBsZXQgdyA9IDE7XHJcbiAgICBsZXQgaCA9IDE7XHJcbiAgICBsZXQgZiA9IDA7XHJcbiAgICBjb25zdCBmbXRJbmZvOiBHRlhGb3JtYXRJbmZvID0gR0ZYRm9ybWF0SW5mb3NbZ3B1VGV4dHVyZS5mb3JtYXRdO1xyXG4gICAgY29uc3QgaXNDb21wcmVzc2VkID0gZm10SW5mby5pc0NvbXByZXNzZWQ7XHJcblxyXG4gICAgc3dpdGNoIChncHVUZXh0dXJlLmdsVGFyZ2V0KSB7XHJcbiAgICAgICAgY2FzZSBnbC5URVhUVVJFXzJEOiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcmVnaW9ucy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVnaW9uID0gcmVnaW9uc1trXTtcclxuICAgICAgICAgICAgICAgIHcgPSByZWdpb24udGV4RXh0ZW50LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgaCA9IHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGl4ZWxzID0gYnVmZmVyc1tuKytdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LCB3LCBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgcGl4ZWxzKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5jb21wcmVzc2VkVGV4U3ViSW1hZ2UyRChnbC5URVhUVVJFXzJELCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uLnRleE9mZnNldC54LCByZWdpb24udGV4T2Zmc2V0LnksIHcsIGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsRm9ybWF0LCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIGdsLlRFWFRVUkVfQ1VCRV9NQVA6IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZWdpb25zLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSByZWdpb25zW2tdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmNvdW50ID0gcmVnaW9uLnRleFN1YnJlcy5iYXNlQXJyYXlMYXllciArIHJlZ2lvbi50ZXhTdWJyZXMubGF5ZXJDb3VudDtcclxuICAgICAgICAgICAgICAgIGZvciAoZiA9IHJlZ2lvbi50ZXhTdWJyZXMuYmFzZUFycmF5TGF5ZXI7IGYgPCBmY291bnQ7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgIHcgPSByZWdpb24udGV4RXh0ZW50LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSByZWdpb24udGV4RXh0ZW50LmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGl4ZWxzID0gYnVmZmVyc1tuKytdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQ29tcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSwgdywgaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgIT09IFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uLnRleE9mZnNldC54LCByZWdpb24udGV4T2Zmc2V0LnksIHcsIGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbEZvcm1hdCwgcGl4ZWxzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdMIHRleHR1cmUgdHlwZSwgY29weSBidWZmZXIgdG8gdGV4dHVyZSBmYWlsZWQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChncHVUZXh0dXJlLmZsYWdzICYgR0ZYVGV4dHVyZUZsYWdCaXQuR0VOX01JUE1BUCkge1xyXG4gICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdwdVRleHR1cmUuZ2xUYXJnZXQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0wyQ21kRnVuY0JsaXRGcmFtZWJ1ZmZlciAoXHJcbiAgICBkZXZpY2U6IFdlYkdMMkRldmljZSxcclxuICAgIHNyYzogSVdlYkdMMkdQVUZyYW1lYnVmZmVyLFxyXG4gICAgZHN0OiBJV2ViR0wyR1BVRnJhbWVidWZmZXIsXHJcbiAgICBzcmNSZWN0OiBHRlhSZWN0LFxyXG4gICAgZHN0UmVjdDogR0ZYUmVjdCxcclxuICAgIGZpbHRlcjogR0ZYRmlsdGVyKSB7XHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuXHJcbiAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xSZWFkRnJhbWVidWZmZXIgIT09IHNyYy5nbEZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLlJFQURfRlJBTUVCVUZGRVIsIHNyYy5nbEZyYW1lYnVmZmVyKTtcclxuICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlYWRGcmFtZWJ1ZmZlciA9IHNyYy5nbEZyYW1lYnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlYmluZEZCTyA9IChkc3QuZ2xGcmFtZWJ1ZmZlciAhPT0gZGV2aWNlLnN0YXRlQ2FjaGUuZ2xGcmFtZWJ1ZmZlcik7XHJcbiAgICBpZiAocmViaW5kRkJPKSB7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkRSQVdfRlJBTUVCVUZGRVIsIGRzdC5nbEZyYW1lYnVmZmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgbWFzayA9IDA7XHJcbiAgICBpZiAoc3JjLmdwdUNvbG9yVGV4dHVyZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIG1hc2sgfD0gZ2wuQ09MT1JfQlVGRkVSX0JJVDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3JjLmdwdURlcHRoU3RlbmNpbFRleHR1cmUpIHtcclxuICAgICAgICBtYXNrIHw9IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgaWYgKEdGWEZvcm1hdEluZm9zW3NyYy5ncHVEZXB0aFN0ZW5jaWxUZXh0dXJlLmZvcm1hdF0uaGFzU3RlbmNpbCkge1xyXG4gICAgICAgICAgICBtYXNrIHw9IGdsLlNURU5DSUxfQlVGRkVSX0JJVDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2xGaWx0ZXIgPSAoZmlsdGVyID09PSBHRlhGaWx0ZXIuTElORUFSIHx8IGZpbHRlciA9PT0gR0ZYRmlsdGVyLkFOSVNPVFJPUElDKSA/IGdsLkxJTkVBUiA6IGdsLk5FQVJFU1Q7XHJcblxyXG4gICAgZ2wuYmxpdEZyYW1lYnVmZmVyKFxyXG4gICAgICAgIHNyY1JlY3QueCwgc3JjUmVjdC55LCBzcmNSZWN0LnggKyBzcmNSZWN0LndpZHRoLCBzcmNSZWN0LnkgKyBzcmNSZWN0LmhlaWdodCxcclxuICAgICAgICBkc3RSZWN0LngsIGRzdFJlY3QueSwgZHN0UmVjdC54ICsgZHN0UmVjdC53aWR0aCwgZHN0UmVjdC55ICsgZHN0UmVjdC5oZWlnaHQsXHJcbiAgICAgICAgbWFzaywgZ2xGaWx0ZXIpO1xyXG5cclxuICAgIGlmIChyZWJpbmRGQk8pIHtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGRldmljZS5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==