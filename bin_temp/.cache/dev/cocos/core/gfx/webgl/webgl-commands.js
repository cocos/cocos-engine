(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../memop/cached-array.js", "../../platform/debug.js", "../buffer.js", "./webgl-define.js", "../define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../memop/cached-array.js"), require("../../platform/debug.js"), require("../buffer.js"), require("./webgl-define.js"), require("../define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cachedArray, global.debug, global.buffer, global.webglDefine, global.define);
    global.webglCommands = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cachedArray, _debug, _buffer, _webglDefine, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXFormatToWebGLType = GFXFormatToWebGLType;
  _exports.GFXFormatToWebGLInternalFormat = GFXFormatToWebGLInternalFormat;
  _exports.GFXFormatToWebGLFormat = GFXFormatToWebGLFormat;
  _exports.WebGLCmdFuncCreateBuffer = WebGLCmdFuncCreateBuffer;
  _exports.WebGLCmdFuncDestroyBuffer = WebGLCmdFuncDestroyBuffer;
  _exports.WebGLCmdFuncResizeBuffer = WebGLCmdFuncResizeBuffer;
  _exports.WebGLCmdFuncUpdateBuffer = WebGLCmdFuncUpdateBuffer;
  _exports.WebGLCmdFuncCreateTexture = WebGLCmdFuncCreateTexture;
  _exports.WebGLCmdFuncDestroyTexture = WebGLCmdFuncDestroyTexture;
  _exports.WebGLCmdFuncResizeTexture = WebGLCmdFuncResizeTexture;
  _exports.WebGLCmdFuncCreateFramebuffer = WebGLCmdFuncCreateFramebuffer;
  _exports.WebGLCmdFuncDestroyFramebuffer = WebGLCmdFuncDestroyFramebuffer;
  _exports.WebGLCmdFuncCreateShader = WebGLCmdFuncCreateShader;
  _exports.WebGLCmdFuncDestroyShader = WebGLCmdFuncDestroyShader;
  _exports.WebGLCmdFuncCreateInputAssember = WebGLCmdFuncCreateInputAssember;
  _exports.WebGLCmdFuncDestroyInputAssembler = WebGLCmdFuncDestroyInputAssembler;
  _exports.WebGLCmdFuncBeginRenderPass = WebGLCmdFuncBeginRenderPass;
  _exports.WebGLCmdFuncBindStates = WebGLCmdFuncBindStates;
  _exports.WebGLCmdFuncDraw = WebGLCmdFuncDraw;
  _exports.WebGLCmdFuncExecuteCmds = WebGLCmdFuncExecuteCmds;
  _exports.WebGLCmdFuncCopyTexImagesToTexture = WebGLCmdFuncCopyTexImagesToTexture;
  _exports.WebGLCmdFuncCopyBuffersToTexture = WebGLCmdFuncCopyBuffersToTexture;
  _exports.WebGLCmdPackage = _exports.WebGLCmdCopyBufferToTexture = _exports.WebGLCmdUpdateBuffer = _exports.WebGLCmdDraw = _exports.WebGLCmdBindStates = _exports.WebGLCmdBeginRenderPass = _exports.WebGLCmdObject = _exports.WebGLCmd = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        return _webglDefine.WebGLEXT.HALF_FLOAT_OES;

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
        return _webglDefine.WebGLEXT.HALF_FLOAT_OES;

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
        return _webglDefine.WebGLEXT.HALF_FLOAT_OES;

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
        return _webglDefine.WebGLEXT.HALF_FLOAT_OES;

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
        return gl.FLOAT;

      case _define.GFXFormat.RGB5A1:
        return gl.UNSIGNED_SHORT_5_5_5_1;

      case _define.GFXFormat.RGBA4:
        return gl.UNSIGNED_SHORT_4_4_4_4;

      case _define.GFXFormat.RGB10A2:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.RGB10A2UI:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.RGB9E5:
        return gl.UNSIGNED_BYTE;

      case _define.GFXFormat.D16:
        return gl.UNSIGNED_SHORT;

      case _define.GFXFormat.D16S8:
        return _webglDefine.WebGLEXT.UNSIGNED_INT_24_8_WEBGL;
      // not supported, fallback

      case _define.GFXFormat.D24:
        return gl.UNSIGNED_INT;

      case _define.GFXFormat.D24S8:
        return _webglDefine.WebGLEXT.UNSIGNED_INT_24_8_WEBGL;

      case _define.GFXFormat.D32F:
        return gl.UNSIGNED_INT;
      // not supported, fallback

      case _define.GFXFormat.D32F_S8:
        return _webglDefine.WebGLEXT.UNSIGNED_INT_24_8_WEBGL;
      // not supported, fallback

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

      case _define.GFXFormat.RGB8:
        return gl.RGB;

      case _define.GFXFormat.RGB16F:
        return gl.RGB;

      case _define.GFXFormat.RGB32F:
        return gl.RGB;

      case _define.GFXFormat.BGRA8:
        return gl.RGBA;

      case _define.GFXFormat.RGBA8:
        return gl.RGBA;

      case _define.GFXFormat.RGBA16F:
        return gl.RGBA;

      case _define.GFXFormat.RGBA32F:
        return gl.RGBA;

      case _define.GFXFormat.R5G6B5:
        return gl.RGB565;

      case _define.GFXFormat.RGB5A1:
        return gl.RGB5_A1;

      case _define.GFXFormat.RGBA4:
        return gl.RGBA4;

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

      case _define.GFXFormat.RGB8:
        return gl.RGB;

      case _define.GFXFormat.RGB16F:
        return gl.RGB;

      case _define.GFXFormat.RGB32F:
        return gl.RGB;

      case _define.GFXFormat.BGRA8:
        return gl.RGBA;

      case _define.GFXFormat.RGBA8:
        return gl.RGBA;

      case _define.GFXFormat.RGBA16F:
        return gl.RGBA;

      case _define.GFXFormat.RGBA32F:
        return gl.RGBA;

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

      case _define.GFXType.MAT3:
        return gl.FLOAT_MAT3;

      case _define.GFXType.MAT4:
        return gl.FLOAT_MAT4;

      case _define.GFXType.SAMPLER2D:
        return gl.SAMPLER_2D;

      case _define.GFXType.SAMPLER_CUBE:
        return gl.SAMPLER_CUBE;

      default:
        {
          console.error('Unsupported GLType, convert to GL type failed.');
          return _define.GFXType.UNKNOWN;
        }
    }
  }

  function GFXTypeToTypedArrayCtor(type) {
    switch (type) {
      case _define.GFXType.BOOL:
      case _define.GFXType.BOOL2:
      case _define.GFXType.BOOL3:
      case _define.GFXType.BOOL4:
      case _define.GFXType.INT:
      case _define.GFXType.INT2:
      case _define.GFXType.INT3:
      case _define.GFXType.INT4:
      case _define.GFXType.UINT:
        return Int32Array;

      case _define.GFXType.FLOAT:
      case _define.GFXType.FLOAT2:
      case _define.GFXType.FLOAT3:
      case _define.GFXType.FLOAT4:
      case _define.GFXType.MAT2:
      case _define.GFXType.MAT3:
      case _define.GFXType.MAT4:
        return Float32Array;

      default:
        {
          console.error('Unsupported GLType, convert to TypedArrayConstructor failed.');
          return Float32Array;
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

      case gl.FLOAT_MAT3:
        return _define.GFXType.MAT3;

      case gl.FLOAT_MAT4:
        return _define.GFXType.MAT4;

      case gl.SAMPLER_2D:
        return _define.GFXType.SAMPLER2D;

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

      case gl.FLOAT_MAT3:
        return 36;

      case gl.FLOAT_MAT4:
        return 64;

      case gl.SAMPLER_2D:
        return 4;

      case gl.SAMPLER_CUBE:
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

      case gl.FLOAT_MAT3:
        return 3;

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
  var WebGLCmd;
  _exports.WebGLCmd = WebGLCmd;

  (function (WebGLCmd) {
    WebGLCmd[WebGLCmd["BEGIN_RENDER_PASS"] = 0] = "BEGIN_RENDER_PASS";
    WebGLCmd[WebGLCmd["END_RENDER_PASS"] = 1] = "END_RENDER_PASS";
    WebGLCmd[WebGLCmd["BIND_STATES"] = 2] = "BIND_STATES";
    WebGLCmd[WebGLCmd["DRAW"] = 3] = "DRAW";
    WebGLCmd[WebGLCmd["UPDATE_BUFFER"] = 4] = "UPDATE_BUFFER";
    WebGLCmd[WebGLCmd["COPY_BUFFER_TO_TEXTURE"] = 5] = "COPY_BUFFER_TO_TEXTURE";
    WebGLCmd[WebGLCmd["COUNT"] = 6] = "COUNT";
  })(WebGLCmd || (_exports.WebGLCmd = WebGLCmd = {}));

  var WebGLCmdObject = function WebGLCmdObject(type) {
    _classCallCheck(this, WebGLCmdObject);

    this.cmdType = void 0;
    this.refCount = 0;
    this.cmdType = type;
  };

  _exports.WebGLCmdObject = WebGLCmdObject;

  var WebGLCmdBeginRenderPass = /*#__PURE__*/function (_WebGLCmdObject) {
    _inherits(WebGLCmdBeginRenderPass, _WebGLCmdObject);

    function WebGLCmdBeginRenderPass() {
      var _this;

      _classCallCheck(this, WebGLCmdBeginRenderPass);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WebGLCmdBeginRenderPass).call(this, WebGLCmd.BEGIN_RENDER_PASS));
      _this.gpuRenderPass = null;
      _this.gpuFramebuffer = null;
      _this.renderArea = new _define.GFXRect();
      _this.clearFlag = _define.GFXClearFlag.NONE;
      _this.clearColors = [];
      _this.clearDepth = 1.0;
      _this.clearStencil = 0;
      return _this;
    }

    _createClass(WebGLCmdBeginRenderPass, [{
      key: "clear",
      value: function clear() {
        this.gpuFramebuffer = null;
        this.clearColors.length = 0;
      }
    }]);

    return WebGLCmdBeginRenderPass;
  }(WebGLCmdObject);

  _exports.WebGLCmdBeginRenderPass = WebGLCmdBeginRenderPass;

  var WebGLCmdBindStates = /*#__PURE__*/function (_WebGLCmdObject2) {
    _inherits(WebGLCmdBindStates, _WebGLCmdObject2);

    function WebGLCmdBindStates() {
      var _this2;

      _classCallCheck(this, WebGLCmdBindStates);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(WebGLCmdBindStates).call(this, WebGLCmd.BIND_STATES));
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

    _createClass(WebGLCmdBindStates, [{
      key: "clear",
      value: function clear() {
        this.gpuPipelineState = null;
        this.gpuDescriptorSets.length = 0;
        this.gpuInputAssembler = null;
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

    return WebGLCmdBindStates;
  }(WebGLCmdObject);

  _exports.WebGLCmdBindStates = WebGLCmdBindStates;

  var WebGLCmdDraw = /*#__PURE__*/function (_WebGLCmdObject3) {
    _inherits(WebGLCmdDraw, _WebGLCmdObject3);

    function WebGLCmdDraw() {
      var _this3;

      _classCallCheck(this, WebGLCmdDraw);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(WebGLCmdDraw).call(this, WebGLCmd.DRAW));
      _this3.drawInfo = new _buffer.GFXDrawInfo();
      return _this3;
    }

    _createClass(WebGLCmdDraw, [{
      key: "clear",
      value: function clear() {}
    }]);

    return WebGLCmdDraw;
  }(WebGLCmdObject);

  _exports.WebGLCmdDraw = WebGLCmdDraw;

  var WebGLCmdUpdateBuffer = /*#__PURE__*/function (_WebGLCmdObject4) {
    _inherits(WebGLCmdUpdateBuffer, _WebGLCmdObject4);

    function WebGLCmdUpdateBuffer() {
      var _this4;

      _classCallCheck(this, WebGLCmdUpdateBuffer);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(WebGLCmdUpdateBuffer).call(this, WebGLCmd.UPDATE_BUFFER));
      _this4.gpuBuffer = null;
      _this4.buffer = null;
      _this4.offset = 0;
      _this4.size = 0;
      return _this4;
    }

    _createClass(WebGLCmdUpdateBuffer, [{
      key: "clear",
      value: function clear() {
        this.gpuBuffer = null;
        this.buffer = null;
      }
    }]);

    return WebGLCmdUpdateBuffer;
  }(WebGLCmdObject);

  _exports.WebGLCmdUpdateBuffer = WebGLCmdUpdateBuffer;

  var WebGLCmdCopyBufferToTexture = /*#__PURE__*/function (_WebGLCmdObject5) {
    _inherits(WebGLCmdCopyBufferToTexture, _WebGLCmdObject5);

    function WebGLCmdCopyBufferToTexture() {
      var _this5;

      _classCallCheck(this, WebGLCmdCopyBufferToTexture);

      _this5 = _possibleConstructorReturn(this, _getPrototypeOf(WebGLCmdCopyBufferToTexture).call(this, WebGLCmd.COPY_BUFFER_TO_TEXTURE));
      _this5.gpuTexture = null;
      _this5.buffers = [];
      _this5.regions = [];
      return _this5;
    }

    _createClass(WebGLCmdCopyBufferToTexture, [{
      key: "clear",
      value: function clear() {
        this.gpuTexture = null;
        this.buffers.length = 0;
        this.regions.length = 0;
      }
    }]);

    return WebGLCmdCopyBufferToTexture;
  }(WebGLCmdObject);

  _exports.WebGLCmdCopyBufferToTexture = WebGLCmdCopyBufferToTexture;

  var WebGLCmdPackage = /*#__PURE__*/function () {
    function WebGLCmdPackage() {
      _classCallCheck(this, WebGLCmdPackage);

      this.cmds = new _cachedArray.CachedArray(1);
      this.beginRenderPassCmds = new _cachedArray.CachedArray(1);
      this.bindStatesCmds = new _cachedArray.CachedArray(1);
      this.drawCmds = new _cachedArray.CachedArray(1);
      this.updateBufferCmds = new _cachedArray.CachedArray(1);
      this.copyBufferToTextureCmds = new _cachedArray.CachedArray(1);
    }

    _createClass(WebGLCmdPackage, [{
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

    return WebGLCmdPackage;
  }();

  _exports.WebGLCmdPackage = WebGLCmdPackage;

  function WebGLCmdFuncCreateBuffer(device, gpuBuffer) {
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
              device.OES_vertex_array_object.bindVertexArrayOES(null);
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
              device.OES_vertex_array_object.bindVertexArrayOES(null);
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
      // console.error("WebGL 1.0 doesn't support uniform buffer.");
      gpuBuffer.glTarget = gl.NONE;

      if (gpuBuffer.buffer) {
        gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer.buffer);
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

  function WebGLCmdFuncDestroyBuffer(device, gpuBuffer) {
    if (gpuBuffer.glBuffer) {
      device.gl.deleteBuffer(gpuBuffer.glBuffer);
      gpuBuffer.glBuffer = null;
    }
  }

  function WebGLCmdFuncResizeBuffer(device, gpuBuffer) {
    var gl = device.gl;
    var cache = device.stateCache;
    var glUsage = gpuBuffer.memUsage & _define.GFXMemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & _define.GFXBufferUsageBit.VERTEX) {
      if (device.useVAO) {
        if (cache.glVAO) {
          device.OES_vertex_array_object.bindVertexArrayOES(null);
          cache.glVAO = gfxStateCache.gpuInputAssembler = null;
        }
      }

      if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
      }

      if (gpuBuffer.buffer) {
        gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      device.stateCache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDEX) {
      if (device.useVAO) {
        if (cache.glVAO) {
          device.OES_vertex_array_object.bindVertexArrayOES(null);
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
      // console.error("WebGL 1.0 doesn't support uniform buffer.");
      if (gpuBuffer.buffer) {
        gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer.buffer);
      }
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDIRECT || gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_DST || gpuBuffer.usage & _define.GFXBufferUsageBit.TRANSFER_SRC) {
      gpuBuffer.glTarget = gl.NONE;
    } else {
      console.error('Unsupported GFXBufferType, create buffer failed.');
      gpuBuffer.glTarget = gl.NONE;
    }
  }

  function WebGLCmdFuncUpdateBuffer(device, gpuBuffer, buffer, offset, size) {
    if (gpuBuffer.usage & _define.GFXBufferUsageBit.UNIFORM) {
      if (ArrayBuffer.isView(buffer)) {
        gpuBuffer.vf32.set(buffer, offset / Float32Array.BYTES_PER_ELEMENT);
      } else {
        gpuBuffer.vf32.set(new Float32Array(buffer), offset / Float32Array.BYTES_PER_ELEMENT);
      }
    } else if (gpuBuffer.usage & _define.GFXBufferUsageBit.INDIRECT) {
      gpuBuffer.indirects.length = offset;
      Array.prototype.push.apply(gpuBuffer.indirects, buffer.drawInfos);
    } else {
      var buff = buffer;
      var gl = device.gl;
      var cache = device.stateCache;

      switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER:
          {
            if (device.useVAO) {
              if (cache.glVAO) {
                device.OES_vertex_array_object.bindVertexArrayOES(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
              }
            }

            if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
              gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
              device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
            }

            break;
          }

        case gl.ELEMENT_ARRAY_BUFFER:
          {
            if (device.useVAO) {
              if (cache.glVAO) {
                device.OES_vertex_array_object.bindVertexArrayOES(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
              }
            }

            if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
              device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }

            break;
          }

        default:
          {
            console.error('Unsupported GFXBufferType, update buffer failed.');
            return;
          }
      }

      if (size === buff.byteLength) {
        gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
      } else {
        gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
      }
    }
  }

  function WebGLCmdFuncCreateTexture(device, gpuTexture) {
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
            (0, _debug.errorID)(9100, maxSize, device.maxTextureSize);
          }

          if (!device.WEBGL_depth_texture && _define.GFXFormatInfos[gpuTexture.format].hasDepth) {
            var glRenderbuffer = gl.createRenderbuffer();

            if (glRenderbuffer && gpuTexture.size > 0) {
              gpuTexture.glRenderbuffer = glRenderbuffer;

              if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
              } // The internal format here differs from texImage2D convension


              if (gpuTexture.glInternalFmt === gl.DEPTH_COMPONENT) {
                gpuTexture.glInternalFmt = gl.DEPTH_COMPONENT16;
              }

              gl.renderbufferStorage(gl.RENDERBUFFER, gpuTexture.glInternalFmt, w, h);
            }
          } else if (gpuTexture.samples === _define.GFXSampleCount.X1) {
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
            } else {
              gl.deleteTexture(glTexture);
            }
          }

          break;
        }

      case _define.GFXTextureType.CUBE:
        {
          gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

          var _maxSize = Math.max(w, h);

          if (_maxSize > device.maxCubeMapTextureSize) {
            (0, _debug.errorID)(9100, _maxSize, device.maxTextureSize);
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

  function WebGLCmdFuncDestroyTexture(device, gpuTexture) {
    if (gpuTexture.glTexture) {
      device.gl.deleteTexture(gpuTexture.glTexture);
      gpuTexture.glTexture = null;
    }

    if (gpuTexture.glRenderbuffer) {
      device.gl.deleteRenderbuffer(gpuTexture.glRenderbuffer);
      gpuTexture.glRenderbuffer = null;
    }
  }

  function WebGLCmdFuncResizeTexture(device, gpuTexture) {
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
            (0, _debug.errorID)(9100, maxSize, device.maxTextureSize);
          }

          if (gpuTexture.glRenderbuffer) {
            if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
              gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
              device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
            }

            gl.renderbufferStorage(gl.RENDERBUFFER, gpuTexture.glInternalFmt, w, h);
          } else if (gpuTexture.glTexture) {
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
          }

          break;
        }

      case _define.GFXTextureType.CUBE:
        {
          gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

          var _maxSize2 = Math.max(w, h);

          if (_maxSize2 > device.maxCubeMapTextureSize) {
            (0, _debug.errorID)(9100, _maxSize2, device.maxTextureSize);
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

  function WebGLCmdFuncCreateFramebuffer(device, gpuFramebuffer) {
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
        var gpuTexture = gpuFramebuffer.gpuColorTextures[i];

        if (gpuTexture) {
          if (gpuTexture.glTexture) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gpuTexture.glTarget, gpuTexture.glTexture, 0); // level must be 0
          } else {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
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

      if (device.WEBGL_draw_buffers) {
        device.WEBGL_draw_buffers.drawBuffersWEBGL(attachments);
      }

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

  function WebGLCmdFuncDestroyFramebuffer(device, gpuFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
      device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
      gpuFramebuffer.glFramebuffer = null;
    }
  }

  function WebGLCmdFuncCreateShader(device, gpuShader) {
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
        gl.shaderSource(gpuStage.glShader, gpuStage.source);
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

    if (device.destroyShadersImmediately) {
      for (var _k2 = 0; _k2 < gpuShader.gpuStages.length; _k2++) {
        var _gpuStage = gpuShader.gpuStages[_k2];

        if (_gpuStage.glShader) {
          gl.detachShader(gpuShader.glProgram, _gpuStage.glShader);
          gl.deleteShader(_gpuStage.glShader);
          _gpuStage.glShader = null;
        }
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
          binding: glLoc,
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


    if (gpuShader.blocks.length > 0) {
      gpuShader.glBlocks = new Array(gpuShader.blocks.length);

      for (var _i7 = 0; _i7 < gpuShader.blocks.length; ++_i7) {
        var block = gpuShader.blocks[_i7];
        var glBlock = {
          set: block.set,
          binding: block.binding,
          name: block.name,
          size: 0,
          glUniforms: new Array(block.members.length),
          glActiveUniforms: []
        };
        gpuShader.glBlocks[_i7] = glBlock;

        for (var u = 0; u < block.members.length; ++u) {
          var uniform = block.members[u];
          var glType = GFXTypeToWebGLType(uniform.type, gl);
          var ctor = GFXTypeToTypedArrayCtor(uniform.type);

          var _stride = WebGLGetTypeSize(glType, gl);

          var size = _stride * uniform.count;
          var begin = glBlock.size / 4;
          var count = size / 4;
          var array = new ctor(count);
          glBlock.glUniforms[u] = {
            binding: -1,
            name: uniform.name,
            type: uniform.type,
            stride: _stride,
            count: uniform.count,
            size: size,
            offset: glBlock.size,
            glType: glType,
            glLoc: -1,
            array: array,
            begin: begin
          };
          glBlock.size += size;
        }
        /*
        glBlock.buffer = new ArrayBuffer(glBlock.size);
          for (let k = 0; k < glBlock.glUniforms.length; k++) {
            const glUniform = glBlock.glUniforms[k];
            switch (glUniform.glType) {
                case gl.BOOL:
                case gl.BOOL_VEC2:
                case gl.BOOL_VEC3:
                case gl.BOOL_VEC4:
                case gl.INT:
                case gl.INT_VEC2:
                case gl.INT_VEC3:
                case gl.INT_VEC4:
                case gl.SAMPLER_2D:
                case gl.SAMPLER_CUBE: {
                    glUniform.vi32 = new Int32Array(glBlock.buffer);
                    break;
                }
                default: {
                    glUniform.vf32 = new Float32Array(glBlock.buffer);
                }
            }
        }
        */

      }
    } // create uniform samplers


    if (gpuShader.samplers.length > 0) {
      gpuShader.glSamplers = new Array(gpuShader.samplers.length);

      for (var _i8 = 0; _i8 < gpuShader.samplers.length; ++_i8) {
        var sampler = gpuShader.samplers[_i8];
        gpuShader.glSamplers[_i8] = {
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
    } // parse uniforms


    var activeUniformCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORMS);

    for (var _i9 = 0; _i9 < activeUniformCount; ++_i9) {
      var uniformInfo = gl.getActiveUniform(gpuShader.glProgram, _i9);

      if (uniformInfo) {
        var isSampler = uniformInfo.type === gl.SAMPLER_2D || uniformInfo.type === gl.SAMPLER_CUBE;

        if (!isSampler) {
          var _glLoc = gl.getUniformLocation(gpuShader.glProgram, uniformInfo.name);

          if (_glLoc !== null) {
            var _varName = void 0;

            var _nameOffset = uniformInfo.name.indexOf('[');

            if (_nameOffset !== -1) {
              _varName = uniformInfo.name.substr(0, _nameOffset);
            } else {
              _varName = uniformInfo.name;
            } // let stride = WebGLGetTypeSize(info.type);
            // build uniform block mapping


            for (var j = 0; j < gpuShader.glBlocks.length; j++) {
              var _glBlock = gpuShader.glBlocks[j];

              for (var _k3 = 0; _k3 < _glBlock.glUniforms.length; _k3++) {
                var glUniform = _glBlock.glUniforms[_k3];

                if (glUniform.name === _varName) {
                  // let varSize = stride * info.size;
                  glUniform.glLoc = _glLoc;

                  _glBlock.glActiveUniforms.push(glUniform);

                  break;
                }
              }
            } // for

          }
        }
      }
    } // for
    // texture unit index mapping optimization


    var glActiveSamplers = [];
    var glActiveSamplerLocations = [];
    var bindingMappingInfo = device.bindingMappingInfo;
    var texUnitCacheMap = device.stateCache.texUnitCacheMap;
    var flexibleSetBaseOffset = 0;

    for (var _i10 = 0; _i10 < gpuShader.blocks.length; ++_i10) {
      if (gpuShader.blocks[_i10].set === bindingMappingInfo.flexibleSet) {
        flexibleSetBaseOffset++;
      }
    }

    var arrayOffset = 0;

    for (var _i11 = 0; _i11 < gpuShader.samplers.length; ++_i11) {
      var _sampler = gpuShader.samplers[_i11];

      var _glLoc2 = gl.getUniformLocation(gpuShader.glProgram, _sampler.name);

      if (_glLoc2) {
        glActiveSamplers.push(gpuShader.glSamplers[_i11]);
        glActiveSamplerLocations.push(_glLoc2);
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

      for (var _i12 = 0; _i12 < glActiveSamplers.length; ++_i12) {
        var glSampler = glActiveSamplers[_i12];
        var cachedUnit = texUnitCacheMap[glSampler.name];

        if (cachedUnit !== undefined) {
          glSampler.glLoc = glActiveSamplerLocations[_i12];

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

      for (var _i13 = 0; _i13 < glActiveSamplers.length; ++_i13) {
        var _glSampler = glActiveSamplers[_i13];

        if (!_glSampler.glLoc) {
          _glSampler.glLoc = glActiveSamplerLocations[_i13];

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

      for (var _i14 = 0; _i14 < glActiveSamplers.length; _i14++) {
        var _glSampler2 = glActiveSamplers[_i14];
        _glSampler2.glUnits = new Int32Array(_glSampler2.units);
        gl.uniform1iv(_glSampler2.glLoc, _glSampler2.glUnits);
      }

      if (device.stateCache.glProgram !== gpuShader.glProgram) {
        gl.useProgram(device.stateCache.glProgram);
      }
    } // strip out the inactive ones


    for (var _i15 = 0; _i15 < gpuShader.glBlocks.length;) {
      if (gpuShader.glBlocks[_i15].glActiveUniforms.length) {
        _i15++;
      } else {
        gpuShader.glBlocks[_i15] = gpuShader.glBlocks[gpuShader.glBlocks.length - 1];
        gpuShader.glBlocks.length--;
      }
    }

    gpuShader.glSamplers = glActiveSamplers;
  }

  function WebGLCmdFuncDestroyShader(device, gpuShader) {
    if (gpuShader.glProgram) {
      var gl = device.gl;

      if (!device.destroyShadersImmediately) {
        for (var k = 0; k < gpuShader.gpuStages.length; k++) {
          var gpuStage = gpuShader.gpuStages[k];

          if (gpuStage.glShader) {
            gl.detachShader(gpuShader.glProgram, gpuStage.glShader);
            gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = null;
          }
        }
      }

      gl.deleteProgram(gpuShader.glProgram);
      gpuShader.glProgram = null;
    }
  }

  function WebGLCmdFuncCreateInputAssember(device, gpuInputAssembler) {
    var gl = device.gl;
    gpuInputAssembler.glAttribs = new Array(gpuInputAssembler.attributes.length);
    var offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var i = 0; i < gpuInputAssembler.attributes.length; ++i) {
      var attrib = gpuInputAssembler.attributes[i];
      var stream = attrib.stream !== undefined ? attrib.stream : 0;
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

  function WebGLCmdFuncDestroyInputAssembler(device, gpuInputAssembler) {
    var it = gpuInputAssembler.glVAOs.values();
    var res = it.next();

    while (!res.done) {
      device.OES_vertex_array_object.deleteVertexArrayOES(res.value);
      res = it.next();
    }

    gpuInputAssembler.glVAOs.clear();
  }

  var gfxStateCache = {
    gpuPipelineState: null,
    gpuInputAssembler: null,
    reverseCW: false,
    glPrimitive: 0
  };

  function WebGLCmdFuncBeginRenderPass(device, gpuRenderPass, gpuFramebuffer, renderArea, clearColors, clearDepth, clearStencil) {
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
      } // const invalidateAttachments: GLenum[] = [];


      var clearCount = clearColors.length;

      if (!device.WEBGL_draw_buffers) {
        clearCount = 1;
      }

      for (var j = 0; j < clearCount; ++j) {
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

                var clearColor = clearColors[0];
                gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
                clears |= gl.COLOR_BUFFER_BIT;
                break;
              }

            case _define.GFXLoadOp.DISCARD:
              {
                // invalidate the framebuffer
                // invalidateAttachments.push(gl.COLOR_ATTACHMENT0 + j);
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
                // invalidateAttachments.push(gl.DEPTH_ATTACHMENT);
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
                  // invalidateAttachments.push(gl.STENCIL_ATTACHMENT);
                  break;
                }

              default:
            }
          }
        }
      } // if (gpuRenderPass.depthStencilAttachment)

      /*
      if (invalidateAttachments.length) {
          gl.invalidateFramebuffer(gl.FRAMEBUFFER, invalidateAttachments);
      }
      */


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

  function WebGLCmdFuncBindStates(device, gpuPipelineState, gpuInputAssembler, gpuDescriptorSets, dynamicOffsets, viewport, scissor, lineWidth, depthBias, blendConstants, depthBounds, stencilWriteMask, stencilCompareMask) {
    var gl = device.gl;
    var cache = device.stateCache;
    var gpuShader = gpuPipelineState && gpuPipelineState.gpuShader;
    var isShaderChanged = false;
    var glWrapS;
    var glWrapT;
    var glMinFilter; // bind pipeline

    if (gpuPipelineState && gfxStateCache.gpuPipelineState !== gpuPipelineState) {
      gfxStateCache.gpuPipelineState = gpuPipelineState;
      gfxStateCache.glPrimitive = gpuPipelineState.glPrimitive;

      if (gpuPipelineState.gpuShader) {
        var glProgram = gpuPipelineState.gpuShader.glProgram;

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

          cache.rs.cullMode = rs.cullMode;
        }

        var isFrontFaceCCW = gfxStateCache.reverseCW ? !rs.isFrontFaceCCW : rs.isFrontFaceCCW;

        if (cache.rs.isFrontFaceCCW !== isFrontFaceCCW) {
          gl.frontFace(isFrontFaceCCW ? gl.CCW : gl.CW);
          cache.rs.isFrontFaceCCW = isFrontFaceCCW;
        }

        if (cache.rs.depthBias !== rs.depthBias || cache.rs.depthBiasSlop !== rs.depthBiasSlop) {
          gl.polygonOffset(rs.depthBias, rs.depthBiasSlop);
          cache.rs.depthBias = rs.depthBias;
          cache.rs.depthBiasSlop = rs.depthBiasSlop;
        }

        if (cache.rs.lineWidth !== rs.lineWidth) {
          gl.lineWidth(rs.lineWidth);
          cache.rs.lineWidth = rs.lineWidth;
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
        var vf32 = null;
        var offset = 0;

        if (gpuDescriptor && gpuDescriptor.gpuBuffer) {
          var gpuBuffer = gpuDescriptor.gpuBuffer;
          var dynamicOffsetIndexSet = dynamicOffsetIndices[glBlock.set];
          var dynamicOffsetIndex = dynamicOffsetIndexSet && dynamicOffsetIndexSet[glBlock.binding];
          if (dynamicOffsetIndex >= 0) offset = dynamicOffsets[dynamicOffsetIndex];

          if ('vf32' in gpuBuffer) {
            vf32 = gpuBuffer.vf32;
          } else {
            offset += gpuBuffer.offset;
            vf32 = gpuBuffer.gpuBuffer.vf32;
          }

          offset >>= 2;
        }

        if (!vf32) {
          (0, _debug.error)("Buffer binding '".concat(glBlock.name, "' at set ").concat(glBlock.set, " binding ").concat(glBlock.binding, " is not bounded"));
          continue;
        }

        var uniformLen = glBlock.glActiveUniforms.length;

        for (var l = 0; l < uniformLen; l++) {
          var glUniform = glBlock.glActiveUniforms[l];

          switch (glUniform.glType) {
            case gl.BOOL:
            case gl.INT:
              {
                for (var u = 0; u < glUniform.array.length; ++u) {
                  var idx = glUniform.begin + offset + u;

                  if (vf32[idx] !== glUniform.array[u]) {
                    for (var n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                      glUniform.array[n] = vf32[m];
                    }

                    gl.uniform1iv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.BOOL_VEC2:
            case gl.INT_VEC2:
              {
                for (var _u = 0; _u < glUniform.array.length; ++_u) {
                  var _idx = glUniform.begin + offset + _u;

                  if (vf32[_idx] !== glUniform.array[_u]) {
                    for (var _n = _u, _m = _idx; _n < glUniform.array.length; ++_n, ++_m) {
                      glUniform.array[_n] = vf32[_m];
                    }

                    gl.uniform2iv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.BOOL_VEC3:
            case gl.INT_VEC3:
              {
                for (var _u2 = 0; _u2 < glUniform.array.length; ++_u2) {
                  var _idx2 = glUniform.begin + offset + _u2;

                  if (vf32[_idx2] !== glUniform.array[_u2]) {
                    for (var _n2 = _u2, _m2 = _idx2; _n2 < glUniform.array.length; ++_n2, ++_m2) {
                      glUniform.array[_n2] = vf32[_m2];
                    }

                    gl.uniform3iv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.BOOL_VEC4:
            case gl.INT_VEC4:
              {
                for (var _u3 = 0; _u3 < glUniform.array.length; ++_u3) {
                  var _idx3 = glUniform.begin + offset + _u3;

                  if (vf32[_idx3] !== glUniform.array[_u3]) {
                    for (var _n3 = _u3, _m3 = _idx3; _n3 < glUniform.array.length; ++_n3, ++_m3) {
                      glUniform.array[_n3] = vf32[_m3];
                    }

                    gl.uniform4iv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT:
              {
                for (var _u4 = 0; _u4 < glUniform.array.length; ++_u4) {
                  var _idx4 = glUniform.begin + offset + _u4;

                  if (vf32[_idx4] !== glUniform.array[_u4]) {
                    for (var _n4 = _u4, _m4 = _idx4; _n4 < glUniform.array.length; ++_n4, ++_m4) {
                      glUniform.array[_n4] = vf32[_m4];
                    }

                    gl.uniform1fv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_VEC2:
              {
                for (var _u5 = 0; _u5 < glUniform.array.length; ++_u5) {
                  var _idx5 = glUniform.begin + offset + _u5;

                  if (vf32[_idx5] !== glUniform.array[_u5]) {
                    for (var _n5 = _u5, _m5 = _idx5; _n5 < glUniform.array.length; ++_n5, ++_m5) {
                      glUniform.array[_n5] = vf32[_m5];
                    }

                    gl.uniform2fv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_VEC3:
              {
                for (var _u6 = 0; _u6 < glUniform.array.length; ++_u6) {
                  var _idx6 = glUniform.begin + offset + _u6;

                  if (vf32[_idx6] !== glUniform.array[_u6]) {
                    for (var _n6 = _u6, _m6 = _idx6; _n6 < glUniform.array.length; ++_n6, ++_m6) {
                      glUniform.array[_n6] = vf32[_m6];
                    }

                    gl.uniform3fv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_VEC4:
              {
                for (var _u7 = 0; _u7 < glUniform.array.length; ++_u7) {
                  var _idx7 = glUniform.begin + offset + _u7;

                  if (vf32[_idx7] !== glUniform.array[_u7]) {
                    for (var _n7 = _u7, _m7 = _idx7; _n7 < glUniform.array.length; ++_n7, ++_m7) {
                      glUniform.array[_n7] = vf32[_m7];
                    }

                    gl.uniform4fv(glUniform.glLoc, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_MAT2:
              {
                for (var _u8 = 0; _u8 < glUniform.array.length; ++_u8) {
                  var _idx8 = glUniform.begin + offset + _u8;

                  if (vf32[_idx8] !== glUniform.array[_u8]) {
                    for (var _n8 = _u8, _m8 = _idx8; _n8 < glUniform.array.length; ++_n8, ++_m8) {
                      glUniform.array[_n8] = vf32[_m8];
                    }

                    gl.uniformMatrix2fv(glUniform.glLoc, false, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_MAT3:
              {
                for (var _u9 = 0; _u9 < glUniform.array.length; ++_u9) {
                  var _idx9 = glUniform.begin + offset + _u9;

                  if (vf32[_idx9] !== glUniform.array[_u9]) {
                    for (var _n9 = _u9, _m9 = _idx9; _n9 < glUniform.array.length; ++_n9, ++_m9) {
                      glUniform.array[_n9] = vf32[_m9];
                    }

                    gl.uniformMatrix3fv(glUniform.glLoc, false, glUniform.array);
                    break;
                  }
                }

                break;
              }

            case gl.FLOAT_MAT4:
              {
                for (var _u10 = 0; _u10 < glUniform.array.length; ++_u10) {
                  var _idx10 = glUniform.begin + offset + _u10;

                  if (vf32[_idx10] !== glUniform.array[_u10]) {
                    for (var _n10 = _u10, _m10 = _idx10; _n10 < glUniform.array.length; ++_n10, ++_m10) {
                      glUniform.array[_n10] = vf32[_m10];
                    }

                    gl.uniformMatrix4fv(glUniform.glLoc, false, glUniform.array);
                    break;
                  }
                }

                break;
              }

            default:
          }
        }

        continue;
      }

      var samplerLen = gpuShader.glSamplers.length;

      for (var i = 0; i < samplerLen; i++) {
        var glSampler = gpuShader.glSamplers[i];
        var _gpuDescriptorSet = gpuDescriptorSets[glSampler.set];
        var descriptorIndex = _gpuDescriptorSet && _gpuDescriptorSet.descriptorIndices[glSampler.binding];

        var _gpuDescriptor = _gpuDescriptorSet && _gpuDescriptorSet.gpuDescriptors[descriptorIndex];

        var texUnitLen = glSampler.units.length;

        for (var _l = 0; _l < texUnitLen; _l++) {
          var texUnit = glSampler.units[_l];

          if (!_gpuDescriptor || !_gpuDescriptor.gpuSampler) {
            (0, _debug.error)("Sampler binding '".concat(glSampler.name, "' at set ").concat(glSampler.set, " binding ").concat(glSampler.binding, " index ").concat(_l, " is not bounded"));
            continue;
          }

          if (_gpuDescriptor.gpuTexture && _gpuDescriptor.gpuTexture.size > 0) {
            var gpuTexture = _gpuDescriptor.gpuTexture;
            var glTexUnit = cache.glTexUnits[texUnit];

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

            if (gpuTexture.isPowerOf2) {
              glWrapS = gpuSampler.glWrapS;
              glWrapT = gpuSampler.glWrapT;
            } else {
              glWrapS = gl.CLAMP_TO_EDGE;
              glWrapT = gl.CLAMP_TO_EDGE;
            }

            if (gpuTexture.isPowerOf2) {
              if (gpuTexture.mipLevel <= 1 && (gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_NEAREST || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_LINEAR)) {
                glMinFilter = gl.LINEAR;
              } else {
                glMinFilter = gpuSampler.glMinFilter;
              }
            } else {
              if (gpuSampler.glMinFilter === gl.LINEAR || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_NEAREST || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_LINEAR) {
                glMinFilter = gl.LINEAR;
              } else {
                glMinFilter = gl.NEAREST;
              }
            }

            if (gpuTexture.glWrapS !== glWrapS) {
              if (cache.texUnit !== texUnit) {
                gl.activeTexture(gl.TEXTURE0 + texUnit);
                cache.texUnit = texUnit;
              }

              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, glWrapS);
              gpuTexture.glWrapS = glWrapS;
            }

            if (gpuTexture.glWrapT !== glWrapT) {
              if (cache.texUnit !== texUnit) {
                gl.activeTexture(gl.TEXTURE0 + texUnit);
                cache.texUnit = texUnit;
              }

              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, glWrapT);
              gpuTexture.glWrapT = glWrapT;
            }

            if (gpuTexture.glMinFilter !== glMinFilter) {
              if (cache.texUnit !== texUnit) {
                gl.activeTexture(gl.TEXTURE0 + texUnit);
                cache.texUnit = texUnit;
              }

              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, glMinFilter);
              gpuTexture.glMinFilter = glMinFilter;
            }

            if (gpuTexture.glMagFilter !== gpuSampler.glMagFilter) {
              if (cache.texUnit !== texUnit) {
                gl.activeTexture(gl.TEXTURE0 + texUnit);
                cache.texUnit = texUnit;
              }

              gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
              gpuTexture.glMagFilter = gpuSampler.glMagFilter;
            }
          }

          _gpuDescriptor = _gpuDescriptorSet.gpuDescriptors[++descriptorIndex];
        }
      }
    } // bind descriptor sets
    // bind vertex/index buffer


    if (gpuInputAssembler && gpuShader && (isShaderChanged || gfxStateCache.gpuInputAssembler !== gpuInputAssembler)) {
      gfxStateCache.gpuInputAssembler = gpuInputAssembler;
      var ia = device.ANGLE_instanced_arrays;

      if (device.useVAO) {
        var vao = device.OES_vertex_array_object; // check vao

        var glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram);

        if (!glVAO) {
          glVAO = vao.createVertexArrayOES();
          gpuInputAssembler.glVAOs.set(gpuShader.glProgram, glVAO);
          vao.bindVertexArrayOES(glVAO);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          cache.glArrayBuffer = null;
          cache.glElementArrayBuffer = null;
          var glAttrib;
          var inputLen = gpuShader.glInputs.length;

          for (var _j = 0; _j < inputLen; _j++) {
            var glInput = gpuShader.glInputs[_j];
            glAttrib = null;
            var attribLen = gpuInputAssembler.glAttribs.length;

            for (var k = 0; k < attribLen; k++) {
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

                if (ia) {
                  ia.vertexAttribDivisorANGLE(glLoc, glAttrib.isInstanced ? 1 : 0);
                }
              }
            }
          }

          var _gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

          if (_gpuBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _gpuBuffer.glBuffer);
          }

          vao.bindVertexArrayOES(null);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
          cache.glArrayBuffer = null;
          cache.glElementArrayBuffer = null;
        }

        if (cache.glVAO !== glVAO) {
          vao.bindVertexArrayOES(glVAO);
          cache.glVAO = glVAO;
        }
      } else {
        for (var a = 0; a < device.maxVertexAttributes; ++a) {
          cache.glCurrentAttribLocs[a] = false;
        }

        var _inputLen = gpuShader.glInputs.length;

        for (var _j2 = 0; _j2 < _inputLen; _j2++) {
          var _glInput = gpuShader.glInputs[_j2];
          var _glAttrib = null;
          var _attribLen = gpuInputAssembler.glAttribs.length;

          for (var _k4 = 0; _k4 < _attribLen; _k4++) {
            var _attrib = gpuInputAssembler.glAttribs[_k4];

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
              var _glLoc3 = _glInput.glLoc + _c;

              var _attribOffset = _glAttrib.offset + _glAttrib.size * _c;

              if (!cache.glEnabledAttribLocs[_glLoc3] && _glLoc3 >= 0) {
                gl.enableVertexAttribArray(_glLoc3);
                cache.glEnabledAttribLocs[_glLoc3] = true;
              }

              cache.glCurrentAttribLocs[_glLoc3] = true;
              gl.vertexAttribPointer(_glLoc3, _glAttrib.count, _glAttrib.glType, _glAttrib.isNormalized, _glAttrib.stride, _attribOffset);

              if (ia) {
                ia.vertexAttribDivisorANGLE(_glLoc3, _glAttrib.isInstanced ? 1 : 0);
              }
            }
          }
        } // for


        var _gpuBuffer2 = gpuInputAssembler.gpuIndexBuffer;

        if (_gpuBuffer2) {
          if (cache.glElementArrayBuffer !== _gpuBuffer2.glBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _gpuBuffer2.glBuffer);
            cache.glElementArrayBuffer = _gpuBuffer2.glBuffer;
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

      for (var _j3 = 0; _j3 < dsLen; _j3++) {
        var dynamicState = gpuPipelineState.dynamicStates[_j3];

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

  function WebGLCmdFuncDraw(device, drawInfo) {
    var gl = device.gl;
    var ia = device.ANGLE_instanced_arrays;
    var gpuInputAssembler = gfxStateCache.gpuInputAssembler,
        glPrimitive = gfxStateCache.glPrimitive;

    if (gpuInputAssembler) {
      if (gpuInputAssembler.gpuIndirectBuffer) {
        var diLen = gpuInputAssembler.gpuIndirectBuffer.indirects.length;

        for (var j = 0; j < diLen; j++) {
          var subDrawInfo = gpuInputAssembler.gpuIndirectBuffer.indirects[j];
          var gpuBuffer = gpuInputAssembler.gpuIndexBuffer;

          if (subDrawInfo.instanceCount && ia) {
            if (gpuBuffer) {
              if (subDrawInfo.indexCount > 0) {
                var offset = subDrawInfo.firstIndex * gpuBuffer.stride;
                ia.drawElementsInstancedANGLE(glPrimitive, subDrawInfo.indexCount, gpuInputAssembler.glIndexType, offset, subDrawInfo.instanceCount);
              }
            } else if (subDrawInfo.vertexCount > 0) {
              ia.drawArraysInstancedANGLE(glPrimitive, subDrawInfo.firstVertex, subDrawInfo.vertexCount, subDrawInfo.instanceCount);
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
        var _gpuBuffer3 = gpuInputAssembler.gpuIndexBuffer;

        if (drawInfo.instanceCount && ia) {
          if (_gpuBuffer3) {
            if (drawInfo.indexCount > 0) {
              var _offset2 = drawInfo.firstIndex * _gpuBuffer3.stride;

              ia.drawElementsInstancedANGLE(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, _offset2, drawInfo.instanceCount);
            }
          } else if (drawInfo.vertexCount > 0) {
            ia.drawArraysInstancedANGLE(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount);
          }
        } else {
          if (_gpuBuffer3) {
            if (drawInfo.indexCount > 0) {
              var _offset3 = drawInfo.firstIndex * _gpuBuffer3.stride;

              gl.drawElements(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, _offset3);
            }
          } else if (drawInfo.vertexCount > 0) {
            gl.drawArrays(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount);
          }
        }
      }
    }
  }

  var cmdIds = new Array(WebGLCmd.COUNT);

  function WebGLCmdFuncExecuteCmds(device, cmdPackage) {
    cmdIds.fill(0);

    for (var i = 0; i < cmdPackage.cmds.length; ++i) {
      var cmd = cmdPackage.cmds.array[i];
      var cmdId = cmdIds[cmd]++;

      switch (cmd) {
        case WebGLCmd.BEGIN_RENDER_PASS:
          {
            var cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];
            WebGLCmdFuncBeginRenderPass(device, cmd0.gpuRenderPass, cmd0.gpuFramebuffer, cmd0.renderArea, cmd0.clearColors, cmd0.clearDepth, cmd0.clearStencil);
            break;
          }

        /*
        case WebGLCmd.END_RENDER_PASS: {
            // WebGL 1.0 doesn't support store operation of attachments.
            // GFXStoreOp.Store is the default GL behavior.
            break;
        }
        */

        case WebGLCmd.BIND_STATES:
          {
            var cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
            WebGLCmdFuncBindStates(device, cmd2.gpuPipelineState, cmd2.gpuInputAssembler, cmd2.gpuDescriptorSets, cmd2.dynamicOffsets, cmd2.viewport, cmd2.scissor, cmd2.lineWidth, cmd2.depthBias, cmd2.blendConstants, cmd2.depthBounds, cmd2.stencilWriteMask, cmd2.stencilCompareMask);
            break;
          }

        case WebGLCmd.DRAW:
          {
            var cmd3 = cmdPackage.drawCmds.array[cmdId];
            WebGLCmdFuncDraw(device, cmd3.drawInfo);
            break;
          }

        case WebGLCmd.UPDATE_BUFFER:
          {
            var cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
            WebGLCmdFuncUpdateBuffer(device, cmd4.gpuBuffer, cmd4.buffer, cmd4.offset, cmd4.size);
            break;
          }

        case WebGLCmd.COPY_BUFFER_TO_TEXTURE:
          {
            var cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
            WebGLCmdFuncCopyBuffersToTexture(device, cmd5.buffers, cmd5.gpuTexture, cmd5.regions);
            break;
          }
      } // switch

    } // for

  }

  function WebGLCmdFuncCopyTexImagesToTexture(device, texImages, gpuTexture, regions) {
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
          for (var i = 0; i < regions.length; i++) {
            var region = regions[i]; // console.debug('Copying image to texture 2D: ' + region.texExtent.width + ' x ' + region.texExtent.height);

            gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
          }

          break;
        }

      case gl.TEXTURE_CUBE_MAP:
        {
          for (var _i16 = 0; _i16 < regions.length; _i16++) {
            var _region = regions[_i16]; // console.debug('Copying image to texture cube: ' + region.texExtent.width + ' x ' + region.texExtent.height);

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

    if (gpuTexture.flags & _define.GFXTextureFlagBit.GEN_MIPMAP && gpuTexture.isPowerOf2) {
      gl.generateMipmap(gpuTexture.glTarget);
    }
  }

  function WebGLCmdFuncCopyBuffersToTexture(device, buffers, gpuTexture, regions) {
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
          for (var i = 0; i < regions.length; i++) {
            var region = regions[i];
            w = region.texExtent.width;
            h = region.texExtent.height; // console.debug('Copying buffer to texture 2D: ' + w + ' x ' + h);

            var pixels = buffers[n++];

            if (!isCompressed) {
              gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, w, h, gpuTexture.glFormat, gpuTexture.glType, pixels);
            } else {
              if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                gl.compressedTexSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, w, h, gpuTexture.glFormat, pixels);
              } else {
                if (gpuTexture.glInternalFmt === _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL || device.noCompressedTexSubImage2D) {
                  gl.compressedTexImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, gpuTexture.glInternalFmt, w, h, 0, pixels);
                } else {
                  gl.compressedTexSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel, region.texOffset.x, region.texOffset.y, w, h, gpuTexture.glFormat, pixels);
                }
              }
            }
          }

          break;
        }

      case gl.TEXTURE_CUBE_MAP:
        {
          for (var _i17 = 0; _i17 < regions.length; _i17++) {
            var _region2 = regions[_i17];
            var fcount = _region2.texSubres.baseArrayLayer + _region2.texSubres.layerCount;

            for (f = _region2.texSubres.baseArrayLayer; f < fcount; ++f) {
              w = _region2.texExtent.width;
              h = _region2.texExtent.height; // console.debug('Copying buffer to texture cube: ' + w + ' x ' + h);

              var _pixels = buffers[n++];

              if (!isCompressed) {
                gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, _region2.texOffset.x, _region2.texOffset.y, w, h, gpuTexture.glFormat, gpuTexture.glType, _pixels);
              } else {
                if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                  gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, _region2.texOffset.x, _region2.texOffset.y, w, h, gpuTexture.glFormat, _pixels);
                } else {
                  if (gpuTexture.glInternalFmt !== _webglDefine.WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                    gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, _region2.texOffset.x, _region2.texOffset.y, w, h, gpuTexture.glFormat, _pixels);
                  } else {
                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, _region2.texSubres.mipLevel, gpuTexture.glInternalFmt, w, h, 0, _pixels);
                  }
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
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWNvbW1hbmRzLnRzIl0sIm5hbWVzIjpbIkdGWEZvcm1hdFRvV2ViR0xUeXBlIiwiZm9ybWF0IiwiZ2wiLCJHRlhGb3JtYXQiLCJSOCIsIlVOU0lHTkVEX0JZVEUiLCJSOFNOIiwiQllURSIsIlI4VUkiLCJSOEkiLCJSMTZGIiwiV2ViR0xFWFQiLCJIQUxGX0ZMT0FUX09FUyIsIlIxNlVJIiwiVU5TSUdORURfU0hPUlQiLCJSMTZJIiwiU0hPUlQiLCJSMzJGIiwiRkxPQVQiLCJSMzJVSSIsIlVOU0lHTkVEX0lOVCIsIlIzMkkiLCJJTlQiLCJSRzgiLCJSRzhTTiIsIlJHOFVJIiwiUkc4SSIsIlJHMTZGIiwiUkcxNlVJIiwiUkcxNkkiLCJSRzMyRiIsIlJHMzJVSSIsIlJHMzJJIiwiUkdCOCIsIlNSR0I4IiwiUkdCOFNOIiwiUkdCOFVJIiwiUkdCOEkiLCJSR0IxNkYiLCJSR0IxNlVJIiwiUkdCMTZJIiwiUkdCMzJGIiwiUkdCMzJVSSIsIlJHQjMySSIsIkJHUkE4IiwiUkdCQTgiLCJTUkdCOF9BOCIsIlJHQkE4U04iLCJSR0JBOFVJIiwiUkdCQThJIiwiUkdCQTE2RiIsIlJHQkExNlVJIiwiUkdCQTE2SSIsIlJHQkEzMkYiLCJSR0JBMzJVSSIsIlJHQkEzMkkiLCJSNUc2QjUiLCJVTlNJR05FRF9TSE9SVF81XzZfNSIsIlIxMUcxMUIxMEYiLCJSR0I1QTEiLCJVTlNJR05FRF9TSE9SVF81XzVfNV8xIiwiUkdCQTQiLCJVTlNJR05FRF9TSE9SVF80XzRfNF80IiwiUkdCMTBBMiIsIlJHQjEwQTJVSSIsIlJHQjlFNSIsIkQxNiIsIkQxNlM4IiwiVU5TSUdORURfSU5UXzI0XzhfV0VCR0wiLCJEMjQiLCJEMjRTOCIsIkQzMkYiLCJEMzJGX1M4IiwiQkMxIiwiQkMxX1NSR0IiLCJCQzIiLCJCQzJfU1JHQiIsIkJDMyIsIkJDM19TUkdCIiwiQkM0IiwiQkM0X1NOT1JNIiwiQkM1IiwiQkM1X1NOT1JNIiwiQkM2SF9TRjE2IiwiQkM2SF9VRjE2IiwiQkM3IiwiQkM3X1NSR0IiLCJFVENfUkdCOCIsIkVUQzJfUkdCOCIsIkVUQzJfU1JHQjgiLCJFVEMyX1JHQjhfQTEiLCJFVEMyX1NSR0I4X0ExIiwiRUFDX1IxMSIsIkVBQ19SMTFTTiIsIkVBQ19SRzExIiwiRUFDX1JHMTFTTiIsIlBWUlRDX1JHQjIiLCJQVlJUQ19SR0JBMiIsIlBWUlRDX1JHQjQiLCJQVlJUQ19SR0JBNCIsIlBWUlRDMl8yQlBQIiwiUFZSVEMyXzRCUFAiLCJBU1RDX1JHQkFfNHg0IiwiQVNUQ19SR0JBXzV4NCIsIkFTVENfUkdCQV81eDUiLCJBU1RDX1JHQkFfNng1IiwiQVNUQ19SR0JBXzZ4NiIsIkFTVENfUkdCQV84eDUiLCJBU1RDX1JHQkFfOHg2IiwiQVNUQ19SR0JBXzh4OCIsIkFTVENfUkdCQV8xMHg1IiwiQVNUQ19SR0JBXzEweDYiLCJBU1RDX1JHQkFfMTB4OCIsIkFTVENfUkdCQV8xMHgxMCIsIkFTVENfUkdCQV8xMngxMCIsIkFTVENfUkdCQV8xMngxMiIsIkFTVENfU1JHQkFfNHg0IiwiQVNUQ19TUkdCQV81eDQiLCJBU1RDX1NSR0JBXzV4NSIsIkFTVENfU1JHQkFfNng1IiwiQVNUQ19TUkdCQV82eDYiLCJBU1RDX1NSR0JBXzh4NSIsIkFTVENfU1JHQkFfOHg2IiwiQVNUQ19TUkdCQV84eDgiLCJBU1RDX1NSR0JBXzEweDUiLCJBU1RDX1NSR0JBXzEweDYiLCJBU1RDX1NSR0JBXzEweDgiLCJBU1RDX1NSR0JBXzEweDEwIiwiQVNUQ19TUkdCQV8xMngxMCIsIkFTVENfU1JHQkFfMTJ4MTIiLCJHRlhGb3JtYXRUb1dlYkdMSW50ZXJuYWxGb3JtYXQiLCJBOCIsIkFMUEhBIiwiTDgiLCJMVU1JTkFOQ0UiLCJMQTgiLCJMVU1JTkFOQ0VfQUxQSEEiLCJSR0IiLCJSR0JBIiwiUkdCNTY1IiwiUkdCNV9BMSIsIkRFUFRIX0NPTVBPTkVOVCIsIkRFUFRIX1NURU5DSUwiLCJDT01QUkVTU0VEX1JHQl9TM1RDX0RYVDFfRVhUIiwiQkMxX0FMUEhBIiwiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQiLCJDT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVCIsIkJDMV9TUkdCX0FMUEhBIiwiQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUMV9FWFQiLCJDT01QUkVTU0VEX1JHQkFfUzNUQ19EWFQzX0VYVCIsIkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDNfRVhUIiwiQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQiLCJDT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVCIsIkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wiLCJDT01QUkVTU0VEX1JHQjhfRVRDMiIsIkNPTVBSRVNTRURfU1JHQjhfRVRDMiIsIkNPTVBSRVNTRURfUkdCOF9QVU5DSFRIUk9VR0hfQUxQSEExX0VUQzIiLCJDT01QUkVTU0VEX1NSR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMiIsIkVUQzJfUkdCQTgiLCJDT01QUkVTU0VEX1JHQkE4X0VUQzJfRUFDIiwiRVRDMl9TUkdCOF9BOCIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0VUQzJfRUFDIiwiQ09NUFJFU1NFRF9SMTFfRUFDIiwiQ09NUFJFU1NFRF9TSUdORURfUjExX0VBQyIsIkNPTVBSRVNTRURfUkcxMV9FQUMiLCJDT01QUkVTU0VEX1NJR05FRF9SRzExX0VBQyIsIkNPTVBSRVNTRURfUkdCX1BWUlRDXzJCUFBWMV9JTUciLCJDT01QUkVTU0VEX1JHQkFfUFZSVENfMkJQUFYxX0lNRyIsIkNPTVBSRVNTRURfUkdCX1BWUlRDXzRCUFBWMV9JTUciLCJDT01QUkVTU0VEX1JHQkFfUFZSVENfNEJQUFYxX0lNRyIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzR4NF9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ181eDRfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfNXg1X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzZ4NV9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ182eDZfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfOHg1X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzh4Nl9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ184eDhfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4NV9LSFIiLCJDT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg2X0tIUiIsIkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDhfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4MTBfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTBfS0hSIiwiQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTJfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ180eDRfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDRfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ181eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ182eDZfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDVfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDZfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ184eDhfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg1X0tIUiIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4Nl9LSFIiLCJDT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDhfS0hSIiwiQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHgxMF9LSFIiLCJDT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEyeDEwX0tIUiIsIkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTJfS0hSIiwiY29uc29sZSIsImVycm9yIiwiR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdCIsIkdGWFR5cGVUb1dlYkdMVHlwZSIsInR5cGUiLCJHRlhUeXBlIiwiQk9PTCIsIkJPT0wyIiwiQk9PTF9WRUMyIiwiQk9PTDMiLCJCT09MX1ZFQzMiLCJCT09MNCIsIkJPT0xfVkVDNCIsIklOVDIiLCJJTlRfVkVDMiIsIklOVDMiLCJJTlRfVkVDMyIsIklOVDQiLCJJTlRfVkVDNCIsIlVJTlQiLCJGTE9BVDIiLCJGTE9BVF9WRUMyIiwiRkxPQVQzIiwiRkxPQVRfVkVDMyIsIkZMT0FUNCIsIkZMT0FUX1ZFQzQiLCJNQVQyIiwiRkxPQVRfTUFUMiIsIk1BVDMiLCJGTE9BVF9NQVQzIiwiTUFUNCIsIkZMT0FUX01BVDQiLCJTQU1QTEVSMkQiLCJTQU1QTEVSXzJEIiwiU0FNUExFUl9DVUJFIiwiVU5LTk9XTiIsIkdGWFR5cGVUb1R5cGVkQXJyYXlDdG9yIiwiSW50MzJBcnJheSIsIkZsb2F0MzJBcnJheSIsIldlYkdMVHlwZVRvR0ZYVHlwZSIsImdsVHlwZSIsIldlYkdMR2V0VHlwZVNpemUiLCJXZWJHTEdldENvbXBvbmVudENvdW50IiwiV2ViR0xDbXBGdW5jcyIsIldlYkdMU3RlbmNpbE9wcyIsIldlYkdMQmxlbmRPcHMiLCJXZWJHTEJsZW5kRmFjdG9ycyIsIldlYkdMQ21kIiwiV2ViR0xDbWRPYmplY3QiLCJjbWRUeXBlIiwicmVmQ291bnQiLCJXZWJHTENtZEJlZ2luUmVuZGVyUGFzcyIsIkJFR0lOX1JFTkRFUl9QQVNTIiwiZ3B1UmVuZGVyUGFzcyIsImdwdUZyYW1lYnVmZmVyIiwicmVuZGVyQXJlYSIsIkdGWFJlY3QiLCJjbGVhckZsYWciLCJHRlhDbGVhckZsYWciLCJOT05FIiwiY2xlYXJDb2xvcnMiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwibGVuZ3RoIiwiV2ViR0xDbWRCaW5kU3RhdGVzIiwiQklORF9TVEFURVMiLCJncHVQaXBlbGluZVN0YXRlIiwiZ3B1SW5wdXRBc3NlbWJsZXIiLCJncHVEZXNjcmlwdG9yU2V0cyIsImR5bmFtaWNPZmZzZXRzIiwidmlld3BvcnQiLCJzY2lzc29yIiwibGluZVdpZHRoIiwiZGVwdGhCaWFzIiwiYmxlbmRDb25zdGFudHMiLCJkZXB0aEJvdW5kcyIsInN0ZW5jaWxXcml0ZU1hc2siLCJzdGVuY2lsQ29tcGFyZU1hc2siLCJXZWJHTENtZERyYXciLCJEUkFXIiwiZHJhd0luZm8iLCJHRlhEcmF3SW5mbyIsIldlYkdMQ21kVXBkYXRlQnVmZmVyIiwiVVBEQVRFX0JVRkZFUiIsImdwdUJ1ZmZlciIsImJ1ZmZlciIsIm9mZnNldCIsInNpemUiLCJXZWJHTENtZENvcHlCdWZmZXJUb1RleHR1cmUiLCJDT1BZX0JVRkZFUl9UT19URVhUVVJFIiwiZ3B1VGV4dHVyZSIsImJ1ZmZlcnMiLCJyZWdpb25zIiwiV2ViR0xDbWRQYWNrYWdlIiwiY21kcyIsIkNhY2hlZEFycmF5IiwiYmVnaW5SZW5kZXJQYXNzQ21kcyIsImJpbmRTdGF0ZXNDbWRzIiwiZHJhd0NtZHMiLCJ1cGRhdGVCdWZmZXJDbWRzIiwiY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMiLCJhbGxvY2F0b3IiLCJiZWdpblJlbmRlclBhc3NDbWRQb29sIiwiZnJlZUNtZHMiLCJjbGVhciIsImJpbmRTdGF0ZXNDbWRQb29sIiwiZHJhd0NtZFBvb2wiLCJ1cGRhdGVCdWZmZXJDbWRQb29sIiwiY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wiLCJXZWJHTENtZEZ1bmNDcmVhdGVCdWZmZXIiLCJkZXZpY2UiLCJjYWNoZSIsInN0YXRlQ2FjaGUiLCJnbFVzYWdlIiwibWVtVXNhZ2UiLCJHRlhNZW1vcnlVc2FnZUJpdCIsIkhPU1QiLCJEWU5BTUlDX0RSQVciLCJTVEFUSUNfRFJBVyIsInVzYWdlIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJWRVJURVgiLCJnbFRhcmdldCIsIkFSUkFZX0JVRkZFUiIsImdsQnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwidXNlVkFPIiwiZ2xWQU8iLCJPRVNfdmVydGV4X2FycmF5X29iamVjdCIsImJpbmRWZXJ0ZXhBcnJheU9FUyIsImdmeFN0YXRlQ2FjaGUiLCJnbEFycmF5QnVmZmVyIiwiYmluZEJ1ZmZlciIsImJ1ZmZlckRhdGEiLCJJTkRFWCIsIkVMRU1FTlRfQVJSQVlfQlVGRkVSIiwiZ2xFbGVtZW50QXJyYXlCdWZmZXIiLCJVTklGT1JNIiwidmYzMiIsIklORElSRUNUIiwiVFJBTlNGRVJfRFNUIiwiVFJBTlNGRVJfU1JDIiwiV2ViR0xDbWRGdW5jRGVzdHJveUJ1ZmZlciIsImRlbGV0ZUJ1ZmZlciIsIldlYkdMQ21kRnVuY1Jlc2l6ZUJ1ZmZlciIsIldlYkdMQ21kRnVuY1VwZGF0ZUJ1ZmZlciIsIkFycmF5QnVmZmVyIiwiaXNWaWV3Iiwic2V0IiwiQllURVNfUEVSX0VMRU1FTlQiLCJpbmRpcmVjdHMiLCJBcnJheSIsInByb3RvdHlwZSIsInB1c2giLCJhcHBseSIsImRyYXdJbmZvcyIsImJ1ZmYiLCJieXRlTGVuZ3RoIiwiYnVmZmVyU3ViRGF0YSIsInNsaWNlIiwiV2ViR0xDbWRGdW5jQ3JlYXRlVGV4dHVyZSIsImdsSW50ZXJuYWxGbXQiLCJnbEZvcm1hdCIsInciLCJ3aWR0aCIsImgiLCJoZWlnaHQiLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiVEVYVFVSRV8yRCIsIm1heFNpemUiLCJNYXRoIiwibWF4IiwibWF4VGV4dHVyZVNpemUiLCJXRUJHTF9kZXB0aF90ZXh0dXJlIiwiR0ZYRm9ybWF0SW5mb3MiLCJoYXNEZXB0aCIsImdsUmVuZGVyYnVmZmVyIiwiY3JlYXRlUmVuZGVyYnVmZmVyIiwiYmluZFJlbmRlcmJ1ZmZlciIsIlJFTkRFUkJVRkZFUiIsIkRFUFRIX0NPTVBPTkVOVDE2IiwicmVuZGVyYnVmZmVyU3RvcmFnZSIsInNhbXBsZXMiLCJHRlhTYW1wbGVDb3VudCIsIlgxIiwiZ2xUZXh0dXJlIiwiY3JlYXRlVGV4dHVyZSIsImdsVGV4VW5pdCIsImdsVGV4VW5pdHMiLCJ0ZXhVbml0IiwiYmluZFRleHR1cmUiLCJpc0NvbXByZXNzZWQiLCJpIiwibWlwTGV2ZWwiLCJ0ZXhJbWFnZTJEIiwiaW1nU2l6ZSIsInZpZXciLCJVaW50OEFycmF5IiwiY29tcHJlc3NlZFRleEltYWdlMkQiLCJpc1Bvd2VyT2YyIiwiZ2xXcmFwUyIsIlJFUEVBVCIsImdsV3JhcFQiLCJDTEFNUF9UT19FREdFIiwiZ2xNaW5GaWx0ZXIiLCJMSU5FQVIiLCJnbE1hZ0ZpbHRlciIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX1dSQVBfUyIsIlRFWFRVUkVfV1JBUF9UIiwiVEVYVFVSRV9NSU5fRklMVEVSIiwiVEVYVFVSRV9NQUdfRklMVEVSIiwiZGVsZXRlVGV4dHVyZSIsIkNVQkUiLCJURVhUVVJFX0NVQkVfTUFQIiwibWF4Q3ViZU1hcFRleHR1cmVTaXplIiwiZiIsIlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCIsIldlYkdMQ21kRnVuY0Rlc3Ryb3lUZXh0dXJlIiwiZGVsZXRlUmVuZGVyYnVmZmVyIiwiV2ViR0xDbWRGdW5jUmVzaXplVGV4dHVyZSIsIldlYkdMQ21kRnVuY0NyZWF0ZUZyYW1lYnVmZmVyIiwiZ3B1Q29sb3JUZXh0dXJlcyIsImdwdURlcHRoU3RlbmNpbFRleHR1cmUiLCJhdHRhY2htZW50cyIsImdsRnJhbWVidWZmZXIiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsImJpbmRGcmFtZWJ1ZmZlciIsIkZSQU1FQlVGRkVSIiwiZnJhbWVidWZmZXJUZXh0dXJlMkQiLCJDT0xPUl9BVFRBQ0hNRU5UMCIsImZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyIiwiZHN0IiwiZ2xBdHRhY2htZW50IiwiaGFzU3RlbmNpbCIsIkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVCIsIkRFUFRIX0FUVEFDSE1FTlQiLCJXRUJHTF9kcmF3X2J1ZmZlcnMiLCJkcmF3QnVmZmVyc1dFQkdMIiwic3RhdHVzIiwiY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyIsIkZSQU1FQlVGRkVSX0NPTVBMRVRFIiwiRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UIiwiRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQiLCJGUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0RJTUVOU0lPTlMiLCJGUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCIsIldlYkdMQ21kRnVuY0Rlc3Ryb3lGcmFtZWJ1ZmZlciIsImRlbGV0ZUZyYW1lYnVmZmVyIiwiV2ViR0xDbWRGdW5jQ3JlYXRlU2hhZGVyIiwiZ3B1U2hhZGVyIiwiayIsImdwdVN0YWdlIiwiZ3B1U3RhZ2VzIiwiZ2xTaGFkZXJUeXBlIiwic2hhZGVyVHlwZVN0ciIsImxpbmVOdW1iZXIiLCJHRlhTaGFkZXJTdGFnZUZsYWdCaXQiLCJWRVJURVhfU0hBREVSIiwiRlJBR01FTlQiLCJGUkFHTUVOVF9TSEFERVIiLCJnbFNoYWRlciIsImNyZWF0ZVNoYWRlciIsInNoYWRlclNvdXJjZSIsInNvdXJjZSIsImNvbXBpbGVTaGFkZXIiLCJnZXRTaGFkZXJQYXJhbWV0ZXIiLCJDT01QSUxFX1NUQVRVUyIsIm5hbWUiLCJyZXBsYWNlIiwiZ2V0U2hhZGVySW5mb0xvZyIsImwiLCJzdGFnZSIsImRlbGV0ZVNoYWRlciIsImdsUHJvZ3JhbSIsImNyZWF0ZVByb2dyYW0iLCJhdHRhY2hTaGFkZXIiLCJsaW5rUHJvZ3JhbSIsImRlc3Ryb3lTaGFkZXJzSW1tZWRpYXRlbHkiLCJkZXRhY2hTaGFkZXIiLCJnZXRQcm9ncmFtUGFyYW1ldGVyIiwiTElOS19TVEFUVVMiLCJpbmZvIiwiZ2V0UHJvZ3JhbUluZm9Mb2ciLCJhY3RpdmVBdHRyaWJDb3VudCIsIkFDVElWRV9BVFRSSUJVVEVTIiwiZ2xJbnB1dHMiLCJhdHRyaWJJbmZvIiwiZ2V0QWN0aXZlQXR0cmliIiwidmFyTmFtZSIsIm5hbWVPZmZzZXQiLCJpbmRleE9mIiwic3Vic3RyIiwiZ2xMb2MiLCJnZXRBdHRyaWJMb2NhdGlvbiIsInN0cmlkZSIsImJpbmRpbmciLCJjb3VudCIsImJsb2NrcyIsImdsQmxvY2tzIiwiYmxvY2siLCJnbEJsb2NrIiwiZ2xVbmlmb3JtcyIsIm1lbWJlcnMiLCJnbEFjdGl2ZVVuaWZvcm1zIiwidSIsInVuaWZvcm0iLCJjdG9yIiwiYmVnaW4iLCJhcnJheSIsInNhbXBsZXJzIiwiZ2xTYW1wbGVycyIsInNhbXBsZXIiLCJ1bml0cyIsImdsVW5pdHMiLCJhY3RpdmVVbmlmb3JtQ291bnQiLCJBQ1RJVkVfVU5JRk9STVMiLCJ1bmlmb3JtSW5mbyIsImdldEFjdGl2ZVVuaWZvcm0iLCJpc1NhbXBsZXIiLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJqIiwiZ2xVbmlmb3JtIiwiZ2xBY3RpdmVTYW1wbGVycyIsImdsQWN0aXZlU2FtcGxlckxvY2F0aW9ucyIsImJpbmRpbmdNYXBwaW5nSW5mbyIsInRleFVuaXRDYWNoZU1hcCIsImZsZXhpYmxlU2V0QmFzZU9mZnNldCIsImZsZXhpYmxlU2V0IiwiYXJyYXlPZmZzZXQiLCJ1bmRlZmluZWQiLCJzYW1wbGVyT2Zmc2V0cyIsIm1heFRleHR1cmVVbml0cyIsInVzZWRUZXhVbml0cyIsImdsU2FtcGxlciIsImNhY2hlZFVuaXQiLCJ0IiwidW5pdElkeCIsInVzZVByb2dyYW0iLCJ1bmlmb3JtMWl2IiwiV2ViR0xDbWRGdW5jRGVzdHJveVNoYWRlciIsImRlbGV0ZVByb2dyYW0iLCJXZWJHTENtZEZ1bmNDcmVhdGVJbnB1dEFzc2VtYmVyIiwiZ2xBdHRyaWJzIiwiYXR0cmlidXRlcyIsIm9mZnNldHMiLCJhdHRyaWIiLCJzdHJlYW0iLCJncHVWZXJ0ZXhCdWZmZXJzIiwiY29tcG9uZW50Q291bnQiLCJpc05vcm1hbGl6ZWQiLCJpc0luc3RhbmNlZCIsIldlYkdMQ21kRnVuY0Rlc3Ryb3lJbnB1dEFzc2VtYmxlciIsIml0IiwiZ2xWQU9zIiwidmFsdWVzIiwicmVzIiwibmV4dCIsImRvbmUiLCJkZWxldGVWZXJ0ZXhBcnJheU9FUyIsInZhbHVlIiwicmV2ZXJzZUNXIiwiZ2xQcmltaXRpdmUiLCJXZWJHTENtZEZ1bmNCZWdpblJlbmRlclBhc3MiLCJjbGVhcnMiLCJpc0NDVyIsInJzIiwiaXNGcm9udEZhY2VDQ1ciLCJmcm9udEZhY2UiLCJDQ1ciLCJDVyIsImxlZnQiLCJ4IiwidG9wIiwieSIsInNjaXNzb3JSZWN0IiwiY2xlYXJDb3VudCIsImNvbG9yQXR0YWNobWVudCIsImNvbG9yQXR0YWNobWVudHMiLCJsb2FkT3AiLCJHRlhMb2FkT3AiLCJMT0FEIiwiQ0xFQVIiLCJicyIsInRhcmdldHMiLCJibGVuZENvbG9yTWFzayIsIkdGWENvbG9yTWFzayIsIkFMTCIsImNvbG9yTWFzayIsImNsZWFyQ29sb3IiLCJ6IiwiQ09MT1JfQlVGRkVSX0JJVCIsIkRJU0NBUkQiLCJkZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiZGVwdGhMb2FkT3AiLCJkc3MiLCJkZXB0aFdyaXRlIiwiZGVwdGhNYXNrIiwiREVQVEhfQlVGRkVSX0JJVCIsInN0ZW5jaWxMb2FkT3AiLCJzdGVuY2lsV3JpdGVNYXNrRnJvbnQiLCJzdGVuY2lsTWFza1NlcGFyYXRlIiwiRlJPTlQiLCJzdGVuY2lsV3JpdGVNYXNrQmFjayIsIkJBQ0siLCJTVEVOQ0lMX0JVRkZFUl9CSVQiLCJyIiwiUiIsImciLCJHIiwiYiIsIkIiLCJhIiwiQSIsIldlYkdMQ21kRnVuY0JpbmRTdGF0ZXMiLCJpc1NoYWRlckNoYW5nZWQiLCJjdWxsTW9kZSIsIkdGWEN1bGxNb2RlIiwiZGlzYWJsZSIsIkNVTExfRkFDRSIsImVuYWJsZSIsImN1bGxGYWNlIiwiZGVwdGhCaWFzU2xvcCIsInBvbHlnb25PZmZzZXQiLCJkZXB0aFRlc3QiLCJERVBUSF9URVNUIiwiZGVwdGhGdW5jIiwic3RlbmNpbFRlc3RGcm9udCIsInN0ZW5jaWxUZXN0QmFjayIsIlNURU5DSUxfVEVTVCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJzdGVuY2lsUmVmRnJvbnQiLCJzdGVuY2lsUmVhZE1hc2tGcm9udCIsInN0ZW5jaWxGdW5jU2VwYXJhdGUiLCJzdGVuY2lsRmFpbE9wRnJvbnQiLCJzdGVuY2lsWkZhaWxPcEZyb250Iiwic3RlbmNpbFBhc3NPcEZyb250Iiwic3RlbmNpbE9wU2VwYXJhdGUiLCJzdGVuY2lsRnVuY0JhY2siLCJzdGVuY2lsUmVmQmFjayIsInN0ZW5jaWxSZWFkTWFza0JhY2siLCJzdGVuY2lsRmFpbE9wQmFjayIsInN0ZW5jaWxaRmFpbE9wQmFjayIsInN0ZW5jaWxQYXNzT3BCYWNrIiwiaXNBMkMiLCJTQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UiLCJibGVuZENvbG9yIiwidGFyZ2V0MCIsInRhcmdldDBDYWNoZSIsImJsZW5kIiwiQkxFTkQiLCJibGVuZEVxIiwiYmxlbmRBbHBoYUVxIiwiYmxlbmRFcXVhdGlvblNlcGFyYXRlIiwiYmxlbmRTcmMiLCJibGVuZERzdCIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwiYmxlbmRGdW5jU2VwYXJhdGUiLCJncHVQaXBlbGluZUxheW91dCIsImJsb2NrTGVuIiwiZHluYW1pY09mZnNldEluZGljZXMiLCJncHVEZXNjcmlwdG9yU2V0IiwiZ3B1RGVzY3JpcHRvciIsImdwdURlc2NyaXB0b3JzIiwiZHluYW1pY09mZnNldEluZGV4U2V0IiwiZHluYW1pY09mZnNldEluZGV4IiwidW5pZm9ybUxlbiIsImlkeCIsIm4iLCJtIiwidW5pZm9ybTJpdiIsInVuaWZvcm0zaXYiLCJ1bmlmb3JtNGl2IiwidW5pZm9ybTFmdiIsInVuaWZvcm0yZnYiLCJ1bmlmb3JtM2Z2IiwidW5pZm9ybTRmdiIsInVuaWZvcm1NYXRyaXgyZnYiLCJ1bmlmb3JtTWF0cml4M2Z2IiwidW5pZm9ybU1hdHJpeDRmdiIsInNhbXBsZXJMZW4iLCJkZXNjcmlwdG9ySW5kZXgiLCJkZXNjcmlwdG9ySW5kaWNlcyIsInRleFVuaXRMZW4iLCJncHVTYW1wbGVyIiwiYWN0aXZlVGV4dHVyZSIsIlRFWFRVUkUwIiwibnVsbFRleDJEIiwiTElORUFSX01JUE1BUF9ORUFSRVNUIiwiTElORUFSX01JUE1BUF9MSU5FQVIiLCJORUFSRVNUIiwiaWEiLCJBTkdMRV9pbnN0YW5jZWRfYXJyYXlzIiwidmFvIiwiZ2V0IiwiY3JlYXRlVmVydGV4QXJyYXlPRVMiLCJnbEF0dHJpYiIsImlucHV0TGVuIiwiZ2xJbnB1dCIsImF0dHJpYkxlbiIsImMiLCJhdHRyaWJPZmZzZXQiLCJlbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImdsQ3VycmVudEF0dHJpYkxvY3MiLCJ2ZXJ0ZXhBdHRyaWJQb2ludGVyIiwidmVydGV4QXR0cmliRGl2aXNvckFOR0xFIiwiZ3B1SW5kZXhCdWZmZXIiLCJtYXhWZXJ0ZXhBdHRyaWJ1dGVzIiwiZ2xFbmFibGVkQXR0cmliTG9jcyIsImRpc2FibGVWZXJ0ZXhBdHRyaWJBcnJheSIsImR5bmFtaWNTdGF0ZXMiLCJkc0xlbiIsImR5bmFtaWNTdGF0ZSIsIkdGWER5bmFtaWNTdGF0ZUZsYWdCaXQiLCJWSUVXUE9SVCIsIlNDSVNTT1IiLCJMSU5FX1dJRFRIIiwiREVQVEhfQklBUyIsImNvbnN0YW50RmFjdG9yIiwic2xvcGVGYWN0b3IiLCJCTEVORF9DT05TVEFOVFMiLCJTVEVOQ0lMX1dSSVRFX01BU0siLCJmYWNlIiwiR0ZYU3RlbmNpbEZhY2UiLCJ3cml0ZU1hc2siLCJzdGVuY2lsTWFzayIsIlNURU5DSUxfQ09NUEFSRV9NQVNLIiwicmVmZXJlbmNlIiwiY29tcGFyZU1hc2siLCJzdGVuY2lsRnVuYyIsIldlYkdMQ21kRnVuY0RyYXciLCJncHVJbmRpcmVjdEJ1ZmZlciIsImRpTGVuIiwic3ViRHJhd0luZm8iLCJpbnN0YW5jZUNvdW50IiwiaW5kZXhDb3VudCIsImZpcnN0SW5kZXgiLCJkcmF3RWxlbWVudHNJbnN0YW5jZWRBTkdMRSIsImdsSW5kZXhUeXBlIiwidmVydGV4Q291bnQiLCJkcmF3QXJyYXlzSW5zdGFuY2VkQU5HTEUiLCJmaXJzdFZlcnRleCIsImRyYXdFbGVtZW50cyIsImRyYXdBcnJheXMiLCJjbWRJZHMiLCJDT1VOVCIsIldlYkdMQ21kRnVuY0V4ZWN1dGVDbWRzIiwiY21kUGFja2FnZSIsImZpbGwiLCJjbWQiLCJjbWRJZCIsImNtZDAiLCJjbWQyIiwiY21kMyIsImNtZDQiLCJjbWQ1IiwiV2ViR0xDbWRGdW5jQ29weUJ1ZmZlcnNUb1RleHR1cmUiLCJXZWJHTENtZEZ1bmNDb3B5VGV4SW1hZ2VzVG9UZXh0dXJlIiwidGV4SW1hZ2VzIiwicmVnaW9uIiwidGV4U3ViSW1hZ2UyRCIsInRleFN1YnJlcyIsInRleE9mZnNldCIsImZjb3VudCIsImJhc2VBcnJheUxheWVyIiwibGF5ZXJDb3VudCIsImZsYWdzIiwiR0ZYVGV4dHVyZUZsYWdCaXQiLCJHRU5fTUlQTUFQIiwiZ2VuZXJhdGVNaXBtYXAiLCJmbXRJbmZvIiwidGV4RXh0ZW50IiwicGl4ZWxzIiwiY29tcHJlc3NlZFRleFN1YkltYWdlMkQiLCJub0NvbXByZXNzZWRUZXhTdWJJbWFnZTJEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjTyxXQUFTQSxvQkFBVCxDQUErQkMsTUFBL0IsRUFBa0RDLEVBQWxELEVBQXFGO0FBQ3hGLFlBQVFELE1BQVI7QUFDSSxXQUFLRSxrQkFBVUMsRUFBZjtBQUFtQixlQUFPRixFQUFFLENBQUNHLGFBQVY7O0FBQ25CLFdBQUtGLGtCQUFVRyxJQUFmO0FBQXFCLGVBQU9KLEVBQUUsQ0FBQ0ssSUFBVjs7QUFDckIsV0FBS0osa0JBQVVLLElBQWY7QUFBcUIsZUFBT04sRUFBRSxDQUFDRyxhQUFWOztBQUNyQixXQUFLRixrQkFBVU0sR0FBZjtBQUFvQixlQUFPUCxFQUFFLENBQUNLLElBQVY7O0FBQ3BCLFdBQUtKLGtCQUFVTyxJQUFmO0FBQXFCLGVBQU9DLHNCQUFTQyxjQUFoQjs7QUFDckIsV0FBS1Qsa0JBQVVVLEtBQWY7QUFBc0IsZUFBT1gsRUFBRSxDQUFDWSxjQUFWOztBQUN0QixXQUFLWCxrQkFBVVksSUFBZjtBQUFxQixlQUFPYixFQUFFLENBQUNjLEtBQVY7O0FBQ3JCLFdBQUtiLGtCQUFVYyxJQUFmO0FBQXFCLGVBQU9mLEVBQUUsQ0FBQ2dCLEtBQVY7O0FBQ3JCLFdBQUtmLGtCQUFVZ0IsS0FBZjtBQUFzQixlQUFPakIsRUFBRSxDQUFDa0IsWUFBVjs7QUFDdEIsV0FBS2pCLGtCQUFVa0IsSUFBZjtBQUFxQixlQUFPbkIsRUFBRSxDQUFDb0IsR0FBVjs7QUFFckIsV0FBS25CLGtCQUFVb0IsR0FBZjtBQUFvQixlQUFPckIsRUFBRSxDQUFDRyxhQUFWOztBQUNwQixXQUFLRixrQkFBVXFCLEtBQWY7QUFBc0IsZUFBT3RCLEVBQUUsQ0FBQ0ssSUFBVjs7QUFDdEIsV0FBS0osa0JBQVVzQixLQUFmO0FBQXNCLGVBQU92QixFQUFFLENBQUNHLGFBQVY7O0FBQ3RCLFdBQUtGLGtCQUFVdUIsSUFBZjtBQUFxQixlQUFPeEIsRUFBRSxDQUFDSyxJQUFWOztBQUNyQixXQUFLSixrQkFBVXdCLEtBQWY7QUFBc0IsZUFBT2hCLHNCQUFTQyxjQUFoQjs7QUFDdEIsV0FBS1Qsa0JBQVV5QixNQUFmO0FBQXVCLGVBQU8xQixFQUFFLENBQUNZLGNBQVY7O0FBQ3ZCLFdBQUtYLGtCQUFVMEIsS0FBZjtBQUFzQixlQUFPM0IsRUFBRSxDQUFDYyxLQUFWOztBQUN0QixXQUFLYixrQkFBVTJCLEtBQWY7QUFBc0IsZUFBTzVCLEVBQUUsQ0FBQ2dCLEtBQVY7O0FBQ3RCLFdBQUtmLGtCQUFVNEIsTUFBZjtBQUF1QixlQUFPN0IsRUFBRSxDQUFDa0IsWUFBVjs7QUFDdkIsV0FBS2pCLGtCQUFVNkIsS0FBZjtBQUFzQixlQUFPOUIsRUFBRSxDQUFDb0IsR0FBVjs7QUFFdEIsV0FBS25CLGtCQUFVOEIsSUFBZjtBQUFxQixlQUFPL0IsRUFBRSxDQUFDRyxhQUFWOztBQUNyQixXQUFLRixrQkFBVStCLEtBQWY7QUFBc0IsZUFBT2hDLEVBQUUsQ0FBQ0csYUFBVjs7QUFDdEIsV0FBS0Ysa0JBQVVnQyxNQUFmO0FBQXVCLGVBQU9qQyxFQUFFLENBQUNLLElBQVY7O0FBQ3ZCLFdBQUtKLGtCQUFVaUMsTUFBZjtBQUF1QixlQUFPbEMsRUFBRSxDQUFDRyxhQUFWOztBQUN2QixXQUFLRixrQkFBVWtDLEtBQWY7QUFBc0IsZUFBT25DLEVBQUUsQ0FBQ0ssSUFBVjs7QUFDdEIsV0FBS0osa0JBQVVtQyxNQUFmO0FBQXVCLGVBQU8zQixzQkFBU0MsY0FBaEI7O0FBQ3ZCLFdBQUtULGtCQUFVb0MsT0FBZjtBQUF3QixlQUFPckMsRUFBRSxDQUFDWSxjQUFWOztBQUN4QixXQUFLWCxrQkFBVXFDLE1BQWY7QUFBdUIsZUFBT3RDLEVBQUUsQ0FBQ2MsS0FBVjs7QUFDdkIsV0FBS2Isa0JBQVVzQyxNQUFmO0FBQXVCLGVBQU92QyxFQUFFLENBQUNnQixLQUFWOztBQUN2QixXQUFLZixrQkFBVXVDLE9BQWY7QUFBd0IsZUFBT3hDLEVBQUUsQ0FBQ2tCLFlBQVY7O0FBQ3hCLFdBQUtqQixrQkFBVXdDLE1BQWY7QUFBdUIsZUFBT3pDLEVBQUUsQ0FBQ29CLEdBQVY7O0FBRXZCLFdBQUtuQixrQkFBVXlDLEtBQWY7QUFBc0IsZUFBTzFDLEVBQUUsQ0FBQ0csYUFBVjs7QUFDdEIsV0FBS0Ysa0JBQVUwQyxLQUFmO0FBQXNCLGVBQU8zQyxFQUFFLENBQUNHLGFBQVY7O0FBQ3RCLFdBQUtGLGtCQUFVMkMsUUFBZjtBQUF5QixlQUFPNUMsRUFBRSxDQUFDRyxhQUFWOztBQUN6QixXQUFLRixrQkFBVTRDLE9BQWY7QUFBd0IsZUFBTzdDLEVBQUUsQ0FBQ0ssSUFBVjs7QUFDeEIsV0FBS0osa0JBQVU2QyxPQUFmO0FBQXdCLGVBQU85QyxFQUFFLENBQUNHLGFBQVY7O0FBQ3hCLFdBQUtGLGtCQUFVOEMsTUFBZjtBQUF1QixlQUFPL0MsRUFBRSxDQUFDSyxJQUFWOztBQUN2QixXQUFLSixrQkFBVStDLE9BQWY7QUFBd0IsZUFBT3ZDLHNCQUFTQyxjQUFoQjs7QUFDeEIsV0FBS1Qsa0JBQVVnRCxRQUFmO0FBQXlCLGVBQU9qRCxFQUFFLENBQUNZLGNBQVY7O0FBQ3pCLFdBQUtYLGtCQUFVaUQsT0FBZjtBQUF3QixlQUFPbEQsRUFBRSxDQUFDYyxLQUFWOztBQUN4QixXQUFLYixrQkFBVWtELE9BQWY7QUFBd0IsZUFBT25ELEVBQUUsQ0FBQ2dCLEtBQVY7O0FBQ3hCLFdBQUtmLGtCQUFVbUQsUUFBZjtBQUF5QixlQUFPcEQsRUFBRSxDQUFDa0IsWUFBVjs7QUFDekIsV0FBS2pCLGtCQUFVb0QsT0FBZjtBQUF3QixlQUFPckQsRUFBRSxDQUFDb0IsR0FBVjs7QUFFeEIsV0FBS25CLGtCQUFVcUQsTUFBZjtBQUF1QixlQUFPdEQsRUFBRSxDQUFDdUQsb0JBQVY7O0FBQ3ZCLFdBQUt0RCxrQkFBVXVELFVBQWY7QUFBMkIsZUFBT3hELEVBQUUsQ0FBQ2dCLEtBQVY7O0FBQzNCLFdBQUtmLGtCQUFVd0QsTUFBZjtBQUF1QixlQUFPekQsRUFBRSxDQUFDMEQsc0JBQVY7O0FBQ3ZCLFdBQUt6RCxrQkFBVTBELEtBQWY7QUFBc0IsZUFBTzNELEVBQUUsQ0FBQzRELHNCQUFWOztBQUN0QixXQUFLM0Qsa0JBQVU0RCxPQUFmO0FBQXdCLGVBQU83RCxFQUFFLENBQUNHLGFBQVY7O0FBQ3hCLFdBQUtGLGtCQUFVNkQsU0FBZjtBQUEwQixlQUFPOUQsRUFBRSxDQUFDa0IsWUFBVjs7QUFDMUIsV0FBS2pCLGtCQUFVOEQsTUFBZjtBQUF1QixlQUFPL0QsRUFBRSxDQUFDRyxhQUFWOztBQUV2QixXQUFLRixrQkFBVStELEdBQWY7QUFBb0IsZUFBT2hFLEVBQUUsQ0FBQ1ksY0FBVjs7QUFDcEIsV0FBS1gsa0JBQVVnRSxLQUFmO0FBQXNCLGVBQU94RCxzQkFBU3lELHVCQUFoQjtBQUF5Qzs7QUFDL0QsV0FBS2pFLGtCQUFVa0UsR0FBZjtBQUFvQixlQUFPbkUsRUFBRSxDQUFDa0IsWUFBVjs7QUFDcEIsV0FBS2pCLGtCQUFVbUUsS0FBZjtBQUFzQixlQUFPM0Qsc0JBQVN5RCx1QkFBaEI7O0FBQ3RCLFdBQUtqRSxrQkFBVW9FLElBQWY7QUFBcUIsZUFBT3JFLEVBQUUsQ0FBQ2tCLFlBQVY7QUFBd0I7O0FBQzdDLFdBQUtqQixrQkFBVXFFLE9BQWY7QUFBd0IsZUFBTzdELHNCQUFTeUQsdUJBQWhCO0FBQXlDOztBQUVqRSxXQUFLakUsa0JBQVVzRSxHQUFmO0FBQW9CLGVBQU92RSxFQUFFLENBQUNHLGFBQVY7O0FBQ3BCLFdBQUtGLGtCQUFVdUUsUUFBZjtBQUF5QixlQUFPeEUsRUFBRSxDQUFDRyxhQUFWOztBQUN6QixXQUFLRixrQkFBVXdFLEdBQWY7QUFBb0IsZUFBT3pFLEVBQUUsQ0FBQ0csYUFBVjs7QUFDcEIsV0FBS0Ysa0JBQVV5RSxRQUFmO0FBQXlCLGVBQU8xRSxFQUFFLENBQUNHLGFBQVY7O0FBQ3pCLFdBQUtGLGtCQUFVMEUsR0FBZjtBQUFvQixlQUFPM0UsRUFBRSxDQUFDRyxhQUFWOztBQUNwQixXQUFLRixrQkFBVTJFLFFBQWY7QUFBeUIsZUFBTzVFLEVBQUUsQ0FBQ0csYUFBVjs7QUFDekIsV0FBS0Ysa0JBQVU0RSxHQUFmO0FBQW9CLGVBQU83RSxFQUFFLENBQUNHLGFBQVY7O0FBQ3BCLFdBQUtGLGtCQUFVNkUsU0FBZjtBQUEwQixlQUFPOUUsRUFBRSxDQUFDSyxJQUFWOztBQUMxQixXQUFLSixrQkFBVThFLEdBQWY7QUFBb0IsZUFBTy9FLEVBQUUsQ0FBQ0csYUFBVjs7QUFDcEIsV0FBS0Ysa0JBQVUrRSxTQUFmO0FBQTBCLGVBQU9oRixFQUFFLENBQUNLLElBQVY7O0FBQzFCLFdBQUtKLGtCQUFVZ0YsU0FBZjtBQUEwQixlQUFPakYsRUFBRSxDQUFDZ0IsS0FBVjs7QUFDMUIsV0FBS2Ysa0JBQVVpRixTQUFmO0FBQTBCLGVBQU9sRixFQUFFLENBQUNnQixLQUFWOztBQUMxQixXQUFLZixrQkFBVWtGLEdBQWY7QUFBb0IsZUFBT25GLEVBQUUsQ0FBQ0csYUFBVjs7QUFDcEIsV0FBS0Ysa0JBQVVtRixRQUFmO0FBQXlCLGVBQU9wRixFQUFFLENBQUNHLGFBQVY7O0FBRXpCLFdBQUtGLGtCQUFVb0YsUUFBZjtBQUF5QixlQUFPckYsRUFBRSxDQUFDRyxhQUFWOztBQUN6QixXQUFLRixrQkFBVXFGLFNBQWY7QUFBMEIsZUFBT3RGLEVBQUUsQ0FBQ0csYUFBVjs7QUFDMUIsV0FBS0Ysa0JBQVVzRixVQUFmO0FBQTJCLGVBQU92RixFQUFFLENBQUNHLGFBQVY7O0FBQzNCLFdBQUtGLGtCQUFVdUYsWUFBZjtBQUE2QixlQUFPeEYsRUFBRSxDQUFDRyxhQUFWOztBQUM3QixXQUFLRixrQkFBVXdGLGFBQWY7QUFBOEIsZUFBT3pGLEVBQUUsQ0FBQ0csYUFBVjs7QUFDOUIsV0FBS0Ysa0JBQVVxRixTQUFmO0FBQTBCLGVBQU90RixFQUFFLENBQUNHLGFBQVY7O0FBQzFCLFdBQUtGLGtCQUFVc0YsVUFBZjtBQUEyQixlQUFPdkYsRUFBRSxDQUFDRyxhQUFWOztBQUMzQixXQUFLRixrQkFBVXlGLE9BQWY7QUFBd0IsZUFBTzFGLEVBQUUsQ0FBQ0csYUFBVjs7QUFDeEIsV0FBS0Ysa0JBQVUwRixTQUFmO0FBQTBCLGVBQU8zRixFQUFFLENBQUNLLElBQVY7O0FBQzFCLFdBQUtKLGtCQUFVMkYsUUFBZjtBQUF5QixlQUFPNUYsRUFBRSxDQUFDRyxhQUFWOztBQUN6QixXQUFLRixrQkFBVTRGLFVBQWY7QUFBMkIsZUFBTzdGLEVBQUUsQ0FBQ0ssSUFBVjs7QUFFM0IsV0FBS0osa0JBQVU2RixVQUFmO0FBQTJCLGVBQU85RixFQUFFLENBQUNHLGFBQVY7O0FBQzNCLFdBQUtGLGtCQUFVOEYsV0FBZjtBQUE0QixlQUFPL0YsRUFBRSxDQUFDRyxhQUFWOztBQUM1QixXQUFLRixrQkFBVStGLFVBQWY7QUFBMkIsZUFBT2hHLEVBQUUsQ0FBQ0csYUFBVjs7QUFDM0IsV0FBS0Ysa0JBQVVnRyxXQUFmO0FBQTRCLGVBQU9qRyxFQUFFLENBQUNHLGFBQVY7O0FBQzVCLFdBQUtGLGtCQUFVaUcsV0FBZjtBQUE0QixlQUFPbEcsRUFBRSxDQUFDRyxhQUFWOztBQUM1QixXQUFLRixrQkFBVWtHLFdBQWY7QUFBNEIsZUFBT25HLEVBQUUsQ0FBQ0csYUFBVjs7QUFFNUIsV0FBS0Ysa0JBQVVtRyxhQUFmO0FBQ0EsV0FBS25HLGtCQUFVb0csYUFBZjtBQUNBLFdBQUtwRyxrQkFBVXFHLGFBQWY7QUFDQSxXQUFLckcsa0JBQVVzRyxhQUFmO0FBQ0EsV0FBS3RHLGtCQUFVdUcsYUFBZjtBQUNBLFdBQUt2RyxrQkFBVXdHLGFBQWY7QUFDQSxXQUFLeEcsa0JBQVV5RyxhQUFmO0FBQ0EsV0FBS3pHLGtCQUFVMEcsYUFBZjtBQUNBLFdBQUsxRyxrQkFBVTJHLGNBQWY7QUFDQSxXQUFLM0csa0JBQVU0RyxjQUFmO0FBQ0EsV0FBSzVHLGtCQUFVNkcsY0FBZjtBQUNBLFdBQUs3RyxrQkFBVThHLGVBQWY7QUFDQSxXQUFLOUcsa0JBQVUrRyxlQUFmO0FBQ0EsV0FBSy9HLGtCQUFVZ0gsZUFBZjtBQUNBLFdBQUtoSCxrQkFBVWlILGNBQWY7QUFDQSxXQUFLakgsa0JBQVVrSCxjQUFmO0FBQ0EsV0FBS2xILGtCQUFVbUgsY0FBZjtBQUNBLFdBQUtuSCxrQkFBVW9ILGNBQWY7QUFDQSxXQUFLcEgsa0JBQVVxSCxjQUFmO0FBQ0EsV0FBS3JILGtCQUFVc0gsY0FBZjtBQUNBLFdBQUt0SCxrQkFBVXVILGNBQWY7QUFDQSxXQUFLdkgsa0JBQVV3SCxjQUFmO0FBQ0EsV0FBS3hILGtCQUFVeUgsZUFBZjtBQUNBLFdBQUt6SCxrQkFBVTBILGVBQWY7QUFDQSxXQUFLMUgsa0JBQVUySCxlQUFmO0FBQ0EsV0FBSzNILGtCQUFVNEgsZ0JBQWY7QUFDQSxXQUFLNUgsa0JBQVU2SCxnQkFBZjtBQUNBLFdBQUs3SCxrQkFBVThILGdCQUFmO0FBQ0ksZUFBTy9ILEVBQUUsQ0FBQ0csYUFBVjs7QUFFSjtBQUFTO0FBQ0wsaUJBQU9ILEVBQUUsQ0FBQ0csYUFBVjtBQUNIO0FBaklMO0FBbUlIOztBQUVNLFdBQVM2SCw4QkFBVCxDQUF5Q2pJLE1BQXpDLEVBQTREQyxFQUE1RCxFQUErRjtBQUNsRyxZQUFRRCxNQUFSO0FBQ0ksV0FBS0Usa0JBQVVnSSxFQUFmO0FBQW1CLGVBQU9qSSxFQUFFLENBQUNrSSxLQUFWOztBQUNuQixXQUFLakksa0JBQVVrSSxFQUFmO0FBQW1CLGVBQU9uSSxFQUFFLENBQUNvSSxTQUFWOztBQUNuQixXQUFLbkksa0JBQVVvSSxHQUFmO0FBQW9CLGVBQU9ySSxFQUFFLENBQUNzSSxlQUFWOztBQUNwQixXQUFLckksa0JBQVU4QixJQUFmO0FBQXFCLGVBQU8vQixFQUFFLENBQUN1SSxHQUFWOztBQUNyQixXQUFLdEksa0JBQVVtQyxNQUFmO0FBQXVCLGVBQU9wQyxFQUFFLENBQUN1SSxHQUFWOztBQUN2QixXQUFLdEksa0JBQVVzQyxNQUFmO0FBQXVCLGVBQU92QyxFQUFFLENBQUN1SSxHQUFWOztBQUN2QixXQUFLdEksa0JBQVV5QyxLQUFmO0FBQXNCLGVBQU8xQyxFQUFFLENBQUN3SSxJQUFWOztBQUN0QixXQUFLdkksa0JBQVUwQyxLQUFmO0FBQXNCLGVBQU8zQyxFQUFFLENBQUN3SSxJQUFWOztBQUN0QixXQUFLdkksa0JBQVUrQyxPQUFmO0FBQXdCLGVBQU9oRCxFQUFFLENBQUN3SSxJQUFWOztBQUN4QixXQUFLdkksa0JBQVVrRCxPQUFmO0FBQXdCLGVBQU9uRCxFQUFFLENBQUN3SSxJQUFWOztBQUN4QixXQUFLdkksa0JBQVVxRCxNQUFmO0FBQXVCLGVBQU90RCxFQUFFLENBQUN5SSxNQUFWOztBQUN2QixXQUFLeEksa0JBQVV3RCxNQUFmO0FBQXVCLGVBQU96RCxFQUFFLENBQUMwSSxPQUFWOztBQUN2QixXQUFLekksa0JBQVUwRCxLQUFmO0FBQXNCLGVBQU8zRCxFQUFFLENBQUMyRCxLQUFWOztBQUN0QixXQUFLMUQsa0JBQVUrRCxHQUFmO0FBQW9CLGVBQU9oRSxFQUFFLENBQUMySSxlQUFWOztBQUNwQixXQUFLMUksa0JBQVVnRSxLQUFmO0FBQXNCLGVBQU9qRSxFQUFFLENBQUM0SSxhQUFWOztBQUN0QixXQUFLM0ksa0JBQVVrRSxHQUFmO0FBQW9CLGVBQU9uRSxFQUFFLENBQUMySSxlQUFWOztBQUNwQixXQUFLMUksa0JBQVVtRSxLQUFmO0FBQXNCLGVBQU9wRSxFQUFFLENBQUM0SSxhQUFWOztBQUN0QixXQUFLM0ksa0JBQVVvRSxJQUFmO0FBQXFCLGVBQU9yRSxFQUFFLENBQUMySSxlQUFWOztBQUNyQixXQUFLMUksa0JBQVVxRSxPQUFmO0FBQXdCLGVBQU90RSxFQUFFLENBQUM0SSxhQUFWOztBQUV4QixXQUFLM0ksa0JBQVVzRSxHQUFmO0FBQW9CLGVBQU85RCxzQkFBU29JLDRCQUFoQjs7QUFDcEIsV0FBSzVJLGtCQUFVNkksU0FBZjtBQUEwQixlQUFPckksc0JBQVNzSSw2QkFBaEI7O0FBQzFCLFdBQUs5SSxrQkFBVXVFLFFBQWY7QUFBeUIsZUFBTy9ELHNCQUFTdUksNkJBQWhCOztBQUN6QixXQUFLL0ksa0JBQVVnSixjQUFmO0FBQStCLGVBQU94SSxzQkFBU3lJLG1DQUFoQjs7QUFDL0IsV0FBS2pKLGtCQUFVd0UsR0FBZjtBQUFvQixlQUFPaEUsc0JBQVMwSSw2QkFBaEI7O0FBQ3BCLFdBQUtsSixrQkFBVXlFLFFBQWY7QUFBeUIsZUFBT2pFLHNCQUFTMkksbUNBQWhCOztBQUN6QixXQUFLbkosa0JBQVUwRSxHQUFmO0FBQW9CLGVBQU9sRSxzQkFBUzRJLDZCQUFoQjs7QUFDcEIsV0FBS3BKLGtCQUFVMkUsUUFBZjtBQUF5QixlQUFPbkUsc0JBQVM2SSxtQ0FBaEI7O0FBRXpCLFdBQUtySixrQkFBVW9GLFFBQWY7QUFBeUIsZUFBTzVFLHNCQUFTOEkseUJBQWhCOztBQUN6QixXQUFLdEosa0JBQVVxRixTQUFmO0FBQTBCLGVBQU83RSxzQkFBUytJLG9CQUFoQjs7QUFDMUIsV0FBS3ZKLGtCQUFVc0YsVUFBZjtBQUEyQixlQUFPOUUsc0JBQVNnSixxQkFBaEI7O0FBQzNCLFdBQUt4SixrQkFBVXVGLFlBQWY7QUFBNkIsZUFBTy9FLHNCQUFTaUosd0NBQWhCOztBQUM3QixXQUFLekosa0JBQVV3RixhQUFmO0FBQThCLGVBQU9oRixzQkFBU2tKLHlDQUFoQjs7QUFDOUIsV0FBSzFKLGtCQUFVMkosVUFBZjtBQUEyQixlQUFPbkosc0JBQVNvSix5QkFBaEI7O0FBQzNCLFdBQUs1SixrQkFBVTZKLGFBQWY7QUFBOEIsZUFBT3JKLHNCQUFTc0osZ0NBQWhCOztBQUM5QixXQUFLOUosa0JBQVV5RixPQUFmO0FBQXdCLGVBQU9qRixzQkFBU3VKLGtCQUFoQjs7QUFDeEIsV0FBSy9KLGtCQUFVMEYsU0FBZjtBQUEwQixlQUFPbEYsc0JBQVN3Six5QkFBaEI7O0FBQzFCLFdBQUtoSyxrQkFBVTJGLFFBQWY7QUFBeUIsZUFBT25GLHNCQUFTeUosbUJBQWhCOztBQUN6QixXQUFLakssa0JBQVU0RixVQUFmO0FBQTJCLGVBQU9wRixzQkFBUzBKLDBCQUFoQjs7QUFFM0IsV0FBS2xLLGtCQUFVNkYsVUFBZjtBQUEyQixlQUFPckYsc0JBQVMySiwrQkFBaEI7O0FBQzNCLFdBQUtuSyxrQkFBVThGLFdBQWY7QUFBNEIsZUFBT3RGLHNCQUFTNEosZ0NBQWhCOztBQUM1QixXQUFLcEssa0JBQVUrRixVQUFmO0FBQTJCLGVBQU92RixzQkFBUzZKLCtCQUFoQjs7QUFDM0IsV0FBS3JLLGtCQUFVZ0csV0FBZjtBQUE0QixlQUFPeEYsc0JBQVM4SixnQ0FBaEI7O0FBRTVCLFdBQUt0SyxrQkFBVW1HLGFBQWY7QUFBOEIsZUFBTzNGLHNCQUFTK0osNEJBQWhCOztBQUM5QixXQUFLdkssa0JBQVVvRyxhQUFmO0FBQThCLGVBQU81RixzQkFBU2dLLDRCQUFoQjs7QUFDOUIsV0FBS3hLLGtCQUFVcUcsYUFBZjtBQUE4QixlQUFPN0Ysc0JBQVNpSyw0QkFBaEI7O0FBQzlCLFdBQUt6SyxrQkFBVXNHLGFBQWY7QUFBOEIsZUFBTzlGLHNCQUFTa0ssNEJBQWhCOztBQUM5QixXQUFLMUssa0JBQVV1RyxhQUFmO0FBQThCLGVBQU8vRixzQkFBU21LLDRCQUFoQjs7QUFDOUIsV0FBSzNLLGtCQUFVd0csYUFBZjtBQUE4QixlQUFPaEcsc0JBQVNvSyw0QkFBaEI7O0FBQzlCLFdBQUs1SyxrQkFBVXlHLGFBQWY7QUFBOEIsZUFBT2pHLHNCQUFTcUssNEJBQWhCOztBQUM5QixXQUFLN0ssa0JBQVUwRyxhQUFmO0FBQThCLGVBQU9sRyxzQkFBU3NLLDRCQUFoQjs7QUFDOUIsV0FBSzlLLGtCQUFVMkcsY0FBZjtBQUErQixlQUFPbkcsc0JBQVN1Syw2QkFBaEI7O0FBQy9CLFdBQUsvSyxrQkFBVTRHLGNBQWY7QUFBK0IsZUFBT3BHLHNCQUFTd0ssNkJBQWhCOztBQUMvQixXQUFLaEwsa0JBQVU2RyxjQUFmO0FBQStCLGVBQU9yRyxzQkFBU3lLLDZCQUFoQjs7QUFDL0IsV0FBS2pMLGtCQUFVOEcsZUFBZjtBQUFnQyxlQUFPdEcsc0JBQVMwSyw4QkFBaEI7O0FBQ2hDLFdBQUtsTCxrQkFBVStHLGVBQWY7QUFBZ0MsZUFBT3ZHLHNCQUFTMkssOEJBQWhCOztBQUNoQyxXQUFLbkwsa0JBQVVnSCxlQUFmO0FBQWdDLGVBQU94RyxzQkFBUzRLLDhCQUFoQjs7QUFFaEMsV0FBS3BMLGtCQUFVaUgsY0FBZjtBQUErQixlQUFPekcsc0JBQVM2SyxvQ0FBaEI7O0FBQy9CLFdBQUtyTCxrQkFBVWtILGNBQWY7QUFBK0IsZUFBTzFHLHNCQUFTOEssb0NBQWhCOztBQUMvQixXQUFLdEwsa0JBQVVtSCxjQUFmO0FBQStCLGVBQU8zRyxzQkFBUytLLG9DQUFoQjs7QUFDL0IsV0FBS3ZMLGtCQUFVb0gsY0FBZjtBQUErQixlQUFPNUcsc0JBQVNnTCxvQ0FBaEI7O0FBQy9CLFdBQUt4TCxrQkFBVXFILGNBQWY7QUFBK0IsZUFBTzdHLHNCQUFTaUwsb0NBQWhCOztBQUMvQixXQUFLekwsa0JBQVVzSCxjQUFmO0FBQStCLGVBQU85RyxzQkFBU2tMLG9DQUFoQjs7QUFDL0IsV0FBSzFMLGtCQUFVdUgsY0FBZjtBQUErQixlQUFPL0csc0JBQVNtTCxvQ0FBaEI7O0FBQy9CLFdBQUszTCxrQkFBVXdILGNBQWY7QUFBK0IsZUFBT2hILHNCQUFTb0wsb0NBQWhCOztBQUMvQixXQUFLNUwsa0JBQVV5SCxlQUFmO0FBQWdDLGVBQU9qSCxzQkFBU3FMLHFDQUFoQjs7QUFDaEMsV0FBSzdMLGtCQUFVMEgsZUFBZjtBQUFnQyxlQUFPbEgsc0JBQVNzTCxxQ0FBaEI7O0FBQ2hDLFdBQUs5TCxrQkFBVTJILGVBQWY7QUFBZ0MsZUFBT25ILHNCQUFTdUwscUNBQWhCOztBQUNoQyxXQUFLL0wsa0JBQVU0SCxnQkFBZjtBQUFpQyxlQUFPcEgsc0JBQVN3TCxzQ0FBaEI7O0FBQ2pDLFdBQUtoTSxrQkFBVTZILGdCQUFmO0FBQWlDLGVBQU9ySCxzQkFBU3lMLHNDQUFoQjs7QUFDakMsV0FBS2pNLGtCQUFVOEgsZ0JBQWY7QUFBaUMsZUFBT3RILHNCQUFTMEwsc0NBQWhCOztBQUVqQztBQUFTO0FBQ0xDLFVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLGlFQUFkO0FBQ0EsaUJBQU9yTSxFQUFFLENBQUN3SSxJQUFWO0FBQ0g7QUFoRkw7QUFrRkg7O0FBRU0sV0FBUzhELHNCQUFULENBQWlDdk0sTUFBakMsRUFBb0RDLEVBQXBELEVBQXVGO0FBQzFGLFlBQVFELE1BQVI7QUFDSSxXQUFLRSxrQkFBVWdJLEVBQWY7QUFBbUIsZUFBT2pJLEVBQUUsQ0FBQ2tJLEtBQVY7O0FBQ25CLFdBQUtqSSxrQkFBVWtJLEVBQWY7QUFBbUIsZUFBT25JLEVBQUUsQ0FBQ29JLFNBQVY7O0FBQ25CLFdBQUtuSSxrQkFBVW9JLEdBQWY7QUFBb0IsZUFBT3JJLEVBQUUsQ0FBQ3NJLGVBQVY7O0FBQ3BCLFdBQUtySSxrQkFBVThCLElBQWY7QUFBcUIsZUFBTy9CLEVBQUUsQ0FBQ3VJLEdBQVY7O0FBQ3JCLFdBQUt0SSxrQkFBVW1DLE1BQWY7QUFBdUIsZUFBT3BDLEVBQUUsQ0FBQ3VJLEdBQVY7O0FBQ3ZCLFdBQUt0SSxrQkFBVXNDLE1BQWY7QUFBdUIsZUFBT3ZDLEVBQUUsQ0FBQ3VJLEdBQVY7O0FBQ3ZCLFdBQUt0SSxrQkFBVXlDLEtBQWY7QUFBc0IsZUFBTzFDLEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3RCLFdBQUt2SSxrQkFBVTBDLEtBQWY7QUFBc0IsZUFBTzNDLEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3RCLFdBQUt2SSxrQkFBVStDLE9BQWY7QUFBd0IsZUFBT2hELEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3hCLFdBQUt2SSxrQkFBVWtELE9BQWY7QUFBd0IsZUFBT25ELEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3hCLFdBQUt2SSxrQkFBVXFELE1BQWY7QUFBdUIsZUFBT3RELEVBQUUsQ0FBQ3VJLEdBQVY7O0FBQ3ZCLFdBQUt0SSxrQkFBVXdELE1BQWY7QUFBdUIsZUFBT3pELEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3ZCLFdBQUt2SSxrQkFBVTBELEtBQWY7QUFBc0IsZUFBTzNELEVBQUUsQ0FBQ3dJLElBQVY7O0FBQ3RCLFdBQUt2SSxrQkFBVStELEdBQWY7QUFBb0IsZUFBT2hFLEVBQUUsQ0FBQzJJLGVBQVY7O0FBQ3BCLFdBQUsxSSxrQkFBVWdFLEtBQWY7QUFBc0IsZUFBT2pFLEVBQUUsQ0FBQzRJLGFBQVY7O0FBQ3RCLFdBQUszSSxrQkFBVWtFLEdBQWY7QUFBb0IsZUFBT25FLEVBQUUsQ0FBQzJJLGVBQVY7O0FBQ3BCLFdBQUsxSSxrQkFBVW1FLEtBQWY7QUFBc0IsZUFBT3BFLEVBQUUsQ0FBQzRJLGFBQVY7O0FBQ3RCLFdBQUszSSxrQkFBVW9FLElBQWY7QUFBcUIsZUFBT3JFLEVBQUUsQ0FBQzJJLGVBQVY7O0FBQ3JCLFdBQUsxSSxrQkFBVXFFLE9BQWY7QUFBd0IsZUFBT3RFLEVBQUUsQ0FBQzRJLGFBQVY7O0FBRXhCLFdBQUszSSxrQkFBVXNFLEdBQWY7QUFBb0IsZUFBTzlELHNCQUFTb0ksNEJBQWhCOztBQUNwQixXQUFLNUksa0JBQVU2SSxTQUFmO0FBQTBCLGVBQU9ySSxzQkFBU3NJLDZCQUFoQjs7QUFDMUIsV0FBSzlJLGtCQUFVdUUsUUFBZjtBQUF5QixlQUFPL0Qsc0JBQVN1SSw2QkFBaEI7O0FBQ3pCLFdBQUsvSSxrQkFBVWdKLGNBQWY7QUFBK0IsZUFBT3hJLHNCQUFTeUksbUNBQWhCOztBQUMvQixXQUFLakosa0JBQVV3RSxHQUFmO0FBQW9CLGVBQU9oRSxzQkFBUzBJLDZCQUFoQjs7QUFDcEIsV0FBS2xKLGtCQUFVeUUsUUFBZjtBQUF5QixlQUFPakUsc0JBQVMySSxtQ0FBaEI7O0FBQ3pCLFdBQUtuSixrQkFBVTBFLEdBQWY7QUFBb0IsZUFBT2xFLHNCQUFTNEksNkJBQWhCOztBQUNwQixXQUFLcEosa0JBQVUyRSxRQUFmO0FBQXlCLGVBQU9uRSxzQkFBUzZJLG1DQUFoQjs7QUFFekIsV0FBS3JKLGtCQUFVb0YsUUFBZjtBQUF5QixlQUFPNUUsc0JBQVM4SSx5QkFBaEI7O0FBQ3pCLFdBQUt0SixrQkFBVXFGLFNBQWY7QUFBMEIsZUFBTzdFLHNCQUFTK0ksb0JBQWhCOztBQUMxQixXQUFLdkosa0JBQVVzRixVQUFmO0FBQTJCLGVBQU85RSxzQkFBU2dKLHFCQUFoQjs7QUFDM0IsV0FBS3hKLGtCQUFVdUYsWUFBZjtBQUE2QixlQUFPL0Usc0JBQVNpSix3Q0FBaEI7O0FBQzdCLFdBQUt6SixrQkFBVXdGLGFBQWY7QUFBOEIsZUFBT2hGLHNCQUFTa0oseUNBQWhCOztBQUM5QixXQUFLMUosa0JBQVUySixVQUFmO0FBQTJCLGVBQU9uSixzQkFBU29KLHlCQUFoQjs7QUFDM0IsV0FBSzVKLGtCQUFVNkosYUFBZjtBQUE4QixlQUFPckosc0JBQVNzSixnQ0FBaEI7O0FBQzlCLFdBQUs5SixrQkFBVXlGLE9BQWY7QUFBd0IsZUFBT2pGLHNCQUFTdUosa0JBQWhCOztBQUN4QixXQUFLL0osa0JBQVUwRixTQUFmO0FBQTBCLGVBQU9sRixzQkFBU3dKLHlCQUFoQjs7QUFDMUIsV0FBS2hLLGtCQUFVMkYsUUFBZjtBQUF5QixlQUFPbkYsc0JBQVN5SixtQkFBaEI7O0FBQ3pCLFdBQUtqSyxrQkFBVTRGLFVBQWY7QUFBMkIsZUFBT3BGLHNCQUFTMEosMEJBQWhCOztBQUUzQixXQUFLbEssa0JBQVU2RixVQUFmO0FBQTJCLGVBQU9yRixzQkFBUzJKLCtCQUFoQjs7QUFDM0IsV0FBS25LLGtCQUFVOEYsV0FBZjtBQUE0QixlQUFPdEYsc0JBQVM0SixnQ0FBaEI7O0FBQzVCLFdBQUtwSyxrQkFBVStGLFVBQWY7QUFBMkIsZUFBT3ZGLHNCQUFTNkosK0JBQWhCOztBQUMzQixXQUFLckssa0JBQVVnRyxXQUFmO0FBQTRCLGVBQU94RixzQkFBUzhKLGdDQUFoQjs7QUFFNUIsV0FBS3RLLGtCQUFVbUcsYUFBZjtBQUE4QixlQUFPM0Ysc0JBQVMrSiw0QkFBaEI7O0FBQzlCLFdBQUt2SyxrQkFBVW9HLGFBQWY7QUFBOEIsZUFBTzVGLHNCQUFTZ0ssNEJBQWhCOztBQUM5QixXQUFLeEssa0JBQVVxRyxhQUFmO0FBQThCLGVBQU83RixzQkFBU2lLLDRCQUFoQjs7QUFDOUIsV0FBS3pLLGtCQUFVc0csYUFBZjtBQUE4QixlQUFPOUYsc0JBQVNrSyw0QkFBaEI7O0FBQzlCLFdBQUsxSyxrQkFBVXVHLGFBQWY7QUFBOEIsZUFBTy9GLHNCQUFTbUssNEJBQWhCOztBQUM5QixXQUFLM0ssa0JBQVV3RyxhQUFmO0FBQThCLGVBQU9oRyxzQkFBU29LLDRCQUFoQjs7QUFDOUIsV0FBSzVLLGtCQUFVeUcsYUFBZjtBQUE4QixlQUFPakcsc0JBQVNxSyw0QkFBaEI7O0FBQzlCLFdBQUs3SyxrQkFBVTBHLGFBQWY7QUFBOEIsZUFBT2xHLHNCQUFTc0ssNEJBQWhCOztBQUM5QixXQUFLOUssa0JBQVUyRyxjQUFmO0FBQStCLGVBQU9uRyxzQkFBU3VLLDZCQUFoQjs7QUFDL0IsV0FBSy9LLGtCQUFVNEcsY0FBZjtBQUErQixlQUFPcEcsc0JBQVN3Syw2QkFBaEI7O0FBQy9CLFdBQUtoTCxrQkFBVTZHLGNBQWY7QUFBK0IsZUFBT3JHLHNCQUFTeUssNkJBQWhCOztBQUMvQixXQUFLakwsa0JBQVU4RyxlQUFmO0FBQWdDLGVBQU90RyxzQkFBUzBLLDhCQUFoQjs7QUFDaEMsV0FBS2xMLGtCQUFVK0csZUFBZjtBQUFnQyxlQUFPdkcsc0JBQVMySyw4QkFBaEI7O0FBQ2hDLFdBQUtuTCxrQkFBVWdILGVBQWY7QUFBZ0MsZUFBT3hHLHNCQUFTNEssOEJBQWhCOztBQUVoQyxXQUFLcEwsa0JBQVVpSCxjQUFmO0FBQStCLGVBQU96RyxzQkFBUzZLLG9DQUFoQjs7QUFDL0IsV0FBS3JMLGtCQUFVa0gsY0FBZjtBQUErQixlQUFPMUcsc0JBQVM4SyxvQ0FBaEI7O0FBQy9CLFdBQUt0TCxrQkFBVW1ILGNBQWY7QUFBK0IsZUFBTzNHLHNCQUFTK0ssb0NBQWhCOztBQUMvQixXQUFLdkwsa0JBQVVvSCxjQUFmO0FBQStCLGVBQU81RyxzQkFBU2dMLG9DQUFoQjs7QUFDL0IsV0FBS3hMLGtCQUFVcUgsY0FBZjtBQUErQixlQUFPN0csc0JBQVNpTCxvQ0FBaEI7O0FBQy9CLFdBQUt6TCxrQkFBVXNILGNBQWY7QUFBK0IsZUFBTzlHLHNCQUFTa0wsb0NBQWhCOztBQUMvQixXQUFLMUwsa0JBQVV1SCxjQUFmO0FBQStCLGVBQU8vRyxzQkFBU21MLG9DQUFoQjs7QUFDL0IsV0FBSzNMLGtCQUFVd0gsY0FBZjtBQUErQixlQUFPaEgsc0JBQVNvTCxvQ0FBaEI7O0FBQy9CLFdBQUs1TCxrQkFBVXlILGVBQWY7QUFBZ0MsZUFBT2pILHNCQUFTcUwscUNBQWhCOztBQUNoQyxXQUFLN0wsa0JBQVUwSCxlQUFmO0FBQWdDLGVBQU9sSCxzQkFBU3NMLHFDQUFoQjs7QUFDaEMsV0FBSzlMLGtCQUFVMkgsZUFBZjtBQUFnQyxlQUFPbkgsc0JBQVN1TCxxQ0FBaEI7O0FBQ2hDLFdBQUsvTCxrQkFBVTRILGdCQUFmO0FBQWlDLGVBQU9wSCxzQkFBU3dMLHNDQUFoQjs7QUFDakMsV0FBS2hNLGtCQUFVNkgsZ0JBQWY7QUFBaUMsZUFBT3JILHNCQUFTeUwsc0NBQWhCOztBQUNqQyxXQUFLak0sa0JBQVU4SCxnQkFBZjtBQUFpQyxlQUFPdEgsc0JBQVMwTCxzQ0FBaEI7O0FBRWpDO0FBQVM7QUFDTEMsVUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsd0RBQWQ7QUFDQSxpQkFBT3JNLEVBQUUsQ0FBQ3dJLElBQVY7QUFDSDtBQWhGTDtBQWtGSDs7QUFFRCxXQUFTK0Qsa0JBQVQsQ0FBNkJDLElBQTdCLEVBQTRDeE0sRUFBNUMsRUFBK0U7QUFDM0UsWUFBUXdNLElBQVI7QUFDSSxXQUFLQyxnQkFBUUMsSUFBYjtBQUFtQixlQUFPMU0sRUFBRSxDQUFDME0sSUFBVjs7QUFDbkIsV0FBS0QsZ0JBQVFFLEtBQWI7QUFBb0IsZUFBTzNNLEVBQUUsQ0FBQzRNLFNBQVY7O0FBQ3BCLFdBQUtILGdCQUFRSSxLQUFiO0FBQW9CLGVBQU83TSxFQUFFLENBQUM4TSxTQUFWOztBQUNwQixXQUFLTCxnQkFBUU0sS0FBYjtBQUFvQixlQUFPL00sRUFBRSxDQUFDZ04sU0FBVjs7QUFDcEIsV0FBS1AsZ0JBQVFyTCxHQUFiO0FBQWtCLGVBQU9wQixFQUFFLENBQUNvQixHQUFWOztBQUNsQixXQUFLcUwsZ0JBQVFRLElBQWI7QUFBbUIsZUFBT2pOLEVBQUUsQ0FBQ2tOLFFBQVY7O0FBQ25CLFdBQUtULGdCQUFRVSxJQUFiO0FBQW1CLGVBQU9uTixFQUFFLENBQUNvTixRQUFWOztBQUNuQixXQUFLWCxnQkFBUVksSUFBYjtBQUFtQixlQUFPck4sRUFBRSxDQUFDc04sUUFBVjs7QUFDbkIsV0FBS2IsZ0JBQVFjLElBQWI7QUFBbUIsZUFBT3ZOLEVBQUUsQ0FBQ2tCLFlBQVY7O0FBQ25CLFdBQUt1TCxnQkFBUXpMLEtBQWI7QUFBb0IsZUFBT2hCLEVBQUUsQ0FBQ2dCLEtBQVY7O0FBQ3BCLFdBQUt5TCxnQkFBUWUsTUFBYjtBQUFxQixlQUFPeE4sRUFBRSxDQUFDeU4sVUFBVjs7QUFDckIsV0FBS2hCLGdCQUFRaUIsTUFBYjtBQUFxQixlQUFPMU4sRUFBRSxDQUFDMk4sVUFBVjs7QUFDckIsV0FBS2xCLGdCQUFRbUIsTUFBYjtBQUFxQixlQUFPNU4sRUFBRSxDQUFDNk4sVUFBVjs7QUFDckIsV0FBS3BCLGdCQUFRcUIsSUFBYjtBQUFtQixlQUFPOU4sRUFBRSxDQUFDK04sVUFBVjs7QUFDbkIsV0FBS3RCLGdCQUFRdUIsSUFBYjtBQUFtQixlQUFPaE8sRUFBRSxDQUFDaU8sVUFBVjs7QUFDbkIsV0FBS3hCLGdCQUFReUIsSUFBYjtBQUFtQixlQUFPbE8sRUFBRSxDQUFDbU8sVUFBVjs7QUFDbkIsV0FBSzFCLGdCQUFRMkIsU0FBYjtBQUF3QixlQUFPcE8sRUFBRSxDQUFDcU8sVUFBVjs7QUFDeEIsV0FBSzVCLGdCQUFRNkIsWUFBYjtBQUEyQixlQUFPdE8sRUFBRSxDQUFDc08sWUFBVjs7QUFDM0I7QUFBUztBQUNMbEMsVUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsZ0RBQWQ7QUFDQSxpQkFBT0ksZ0JBQVE4QixPQUFmO0FBQ0g7QUF0Qkw7QUF3Qkg7O0FBRUQsV0FBU0MsdUJBQVQsQ0FBa0NoQyxJQUFsQyxFQUFpRDtBQUM3QyxZQUFRQSxJQUFSO0FBQ0ksV0FBS0MsZ0JBQVFDLElBQWI7QUFDQSxXQUFLRCxnQkFBUUUsS0FBYjtBQUNBLFdBQUtGLGdCQUFRSSxLQUFiO0FBQ0EsV0FBS0osZ0JBQVFNLEtBQWI7QUFDQSxXQUFLTixnQkFBUXJMLEdBQWI7QUFDQSxXQUFLcUwsZ0JBQVFRLElBQWI7QUFDQSxXQUFLUixnQkFBUVUsSUFBYjtBQUNBLFdBQUtWLGdCQUFRWSxJQUFiO0FBQ0EsV0FBS1osZ0JBQVFjLElBQWI7QUFDSSxlQUFPa0IsVUFBUDs7QUFDSixXQUFLaEMsZ0JBQVF6TCxLQUFiO0FBQ0EsV0FBS3lMLGdCQUFRZSxNQUFiO0FBQ0EsV0FBS2YsZ0JBQVFpQixNQUFiO0FBQ0EsV0FBS2pCLGdCQUFRbUIsTUFBYjtBQUNBLFdBQUtuQixnQkFBUXFCLElBQWI7QUFDQSxXQUFLckIsZ0JBQVF1QixJQUFiO0FBQ0EsV0FBS3ZCLGdCQUFReUIsSUFBYjtBQUNJLGVBQU9RLFlBQVA7O0FBQ0o7QUFBUztBQUNMdEMsVUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsOERBQWQ7QUFDQSxpQkFBT3FDLFlBQVA7QUFDSDtBQXRCTDtBQXdCSDs7QUFFRCxXQUFTQyxrQkFBVCxDQUE2QkMsTUFBN0IsRUFBNkM1TyxFQUE3QyxFQUFpRjtBQUM3RSxZQUFRNE8sTUFBUjtBQUNJLFdBQUs1TyxFQUFFLENBQUMwTSxJQUFSO0FBQWMsZUFBT0QsZ0JBQVFDLElBQWY7O0FBQ2QsV0FBSzFNLEVBQUUsQ0FBQzRNLFNBQVI7QUFBbUIsZUFBT0gsZ0JBQVFFLEtBQWY7O0FBQ25CLFdBQUszTSxFQUFFLENBQUM4TSxTQUFSO0FBQW1CLGVBQU9MLGdCQUFRSSxLQUFmOztBQUNuQixXQUFLN00sRUFBRSxDQUFDZ04sU0FBUjtBQUFtQixlQUFPUCxnQkFBUU0sS0FBZjs7QUFDbkIsV0FBSy9NLEVBQUUsQ0FBQ29CLEdBQVI7QUFBYSxlQUFPcUwsZ0JBQVFyTCxHQUFmOztBQUNiLFdBQUtwQixFQUFFLENBQUNrTixRQUFSO0FBQWtCLGVBQU9ULGdCQUFRUSxJQUFmOztBQUNsQixXQUFLak4sRUFBRSxDQUFDb04sUUFBUjtBQUFrQixlQUFPWCxnQkFBUVUsSUFBZjs7QUFDbEIsV0FBS25OLEVBQUUsQ0FBQ3NOLFFBQVI7QUFBa0IsZUFBT2IsZ0JBQVFZLElBQWY7O0FBQ2xCLFdBQUtyTixFQUFFLENBQUNrQixZQUFSO0FBQXNCLGVBQU91TCxnQkFBUWMsSUFBZjs7QUFDdEIsV0FBS3ZOLEVBQUUsQ0FBQ2dCLEtBQVI7QUFBZSxlQUFPeUwsZ0JBQVF6TCxLQUFmOztBQUNmLFdBQUtoQixFQUFFLENBQUN5TixVQUFSO0FBQW9CLGVBQU9oQixnQkFBUWUsTUFBZjs7QUFDcEIsV0FBS3hOLEVBQUUsQ0FBQzJOLFVBQVI7QUFBb0IsZUFBT2xCLGdCQUFRaUIsTUFBZjs7QUFDcEIsV0FBSzFOLEVBQUUsQ0FBQzZOLFVBQVI7QUFBb0IsZUFBT3BCLGdCQUFRbUIsTUFBZjs7QUFDcEIsV0FBSzVOLEVBQUUsQ0FBQytOLFVBQVI7QUFBb0IsZUFBT3RCLGdCQUFRcUIsSUFBZjs7QUFDcEIsV0FBSzlOLEVBQUUsQ0FBQ2lPLFVBQVI7QUFBb0IsZUFBT3hCLGdCQUFRdUIsSUFBZjs7QUFDcEIsV0FBS2hPLEVBQUUsQ0FBQ21PLFVBQVI7QUFBb0IsZUFBTzFCLGdCQUFReUIsSUFBZjs7QUFDcEIsV0FBS2xPLEVBQUUsQ0FBQ3FPLFVBQVI7QUFBb0IsZUFBTzVCLGdCQUFRMkIsU0FBZjs7QUFDcEIsV0FBS3BPLEVBQUUsQ0FBQ3NPLFlBQVI7QUFBc0IsZUFBTzdCLGdCQUFRNkIsWUFBZjs7QUFDdEI7QUFBUztBQUNMbEMsVUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsZ0RBQWQ7QUFDQSxpQkFBT0ksZ0JBQVE4QixPQUFmO0FBQ0g7QUF0Qkw7QUF3Qkg7O0FBRUQsV0FBU00sZ0JBQVQsQ0FBMkJELE1BQTNCLEVBQTJDNU8sRUFBM0MsRUFBK0U7QUFDM0UsWUFBUTRPLE1BQVI7QUFDSSxXQUFLNU8sRUFBRSxDQUFDME0sSUFBUjtBQUFjLGVBQU8sQ0FBUDs7QUFDZCxXQUFLMU0sRUFBRSxDQUFDNE0sU0FBUjtBQUFtQixlQUFPLENBQVA7O0FBQ25CLFdBQUs1TSxFQUFFLENBQUM4TSxTQUFSO0FBQW1CLGVBQU8sRUFBUDs7QUFDbkIsV0FBSzlNLEVBQUUsQ0FBQ2dOLFNBQVI7QUFBbUIsZUFBTyxFQUFQOztBQUNuQixXQUFLaE4sRUFBRSxDQUFDb0IsR0FBUjtBQUFhLGVBQU8sQ0FBUDs7QUFDYixXQUFLcEIsRUFBRSxDQUFDa04sUUFBUjtBQUFrQixlQUFPLENBQVA7O0FBQ2xCLFdBQUtsTixFQUFFLENBQUNvTixRQUFSO0FBQWtCLGVBQU8sRUFBUDs7QUFDbEIsV0FBS3BOLEVBQUUsQ0FBQ3NOLFFBQVI7QUFBa0IsZUFBTyxFQUFQOztBQUNsQixXQUFLdE4sRUFBRSxDQUFDa0IsWUFBUjtBQUFzQixlQUFPLENBQVA7O0FBQ3RCLFdBQUtsQixFQUFFLENBQUNnQixLQUFSO0FBQWUsZUFBTyxDQUFQOztBQUNmLFdBQUtoQixFQUFFLENBQUN5TixVQUFSO0FBQW9CLGVBQU8sQ0FBUDs7QUFDcEIsV0FBS3pOLEVBQUUsQ0FBQzJOLFVBQVI7QUFBb0IsZUFBTyxFQUFQOztBQUNwQixXQUFLM04sRUFBRSxDQUFDNk4sVUFBUjtBQUFvQixlQUFPLEVBQVA7O0FBQ3BCLFdBQUs3TixFQUFFLENBQUMrTixVQUFSO0FBQW9CLGVBQU8sRUFBUDs7QUFDcEIsV0FBSy9OLEVBQUUsQ0FBQ2lPLFVBQVI7QUFBb0IsZUFBTyxFQUFQOztBQUNwQixXQUFLak8sRUFBRSxDQUFDbU8sVUFBUjtBQUFvQixlQUFPLEVBQVA7O0FBQ3BCLFdBQUtuTyxFQUFFLENBQUNxTyxVQUFSO0FBQW9CLGVBQU8sQ0FBUDs7QUFDcEIsV0FBS3JPLEVBQUUsQ0FBQ3NPLFlBQVI7QUFBc0IsZUFBTyxDQUFQOztBQUN0QjtBQUFTO0FBQ0xsQyxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxzQ0FBZDtBQUNBLGlCQUFPLENBQVA7QUFDSDtBQXRCTDtBQXdCSDs7QUFFRCxXQUFTeUMsc0JBQVQsQ0FBaUNGLE1BQWpDLEVBQWlENU8sRUFBakQsRUFBcUY7QUFDakYsWUFBUTRPLE1BQVI7QUFDSSxXQUFLNU8sRUFBRSxDQUFDK04sVUFBUjtBQUFvQixlQUFPLENBQVA7O0FBQ3BCLFdBQUsvTixFQUFFLENBQUNpTyxVQUFSO0FBQW9CLGVBQU8sQ0FBUDs7QUFDcEIsV0FBS2pPLEVBQUUsQ0FBQ21PLFVBQVI7QUFBb0IsZUFBTyxDQUFQOztBQUNwQjtBQUFTO0FBQ0wsaUJBQU8sQ0FBUDtBQUNIO0FBTkw7QUFRSDs7QUFFRCxNQUFNWSxhQUF1QixHQUFHLENBQzVCLE1BRDRCLEVBQ3BCO0FBQ1IsUUFGNEIsRUFFcEI7QUFDUixRQUg0QixFQUdwQjtBQUNSLFFBSjRCLEVBSXBCO0FBQ1IsUUFMNEIsRUFLcEI7QUFDUixRQU40QixFQU1wQjtBQUNSLFFBUDRCLEVBT3BCO0FBQ1IsUUFSNEIsQ0FRcEI7QUFSb0IsR0FBaEM7QUFXQSxNQUFNQyxlQUF5QixHQUFHLENBQzlCLE1BRDhCLEVBQ3RCO0FBQ1IsUUFGOEIsRUFFdEI7QUFDUixRQUg4QixFQUd0QjtBQUNSLFFBSjhCLEVBSXRCO0FBQ1IsUUFMOEIsRUFLdEI7QUFDUixRQU44QixFQU10QjtBQUNSLFFBUDhCLEVBT3RCO0FBQ1IsUUFSOEIsQ0FRdEI7QUFSc0IsR0FBbEM7QUFXQSxNQUFNQyxhQUF1QixHQUFHLENBQzVCLE1BRDRCLEVBQ3BCO0FBQ1IsUUFGNEIsRUFFcEI7QUFDUixRQUg0QixFQUdwQjtBQUNSLFFBSjRCLEVBSXBCO0FBQ1IsUUFMNEIsQ0FLcEI7QUFMb0IsR0FBaEM7QUFRQSxNQUFNQyxpQkFBMkIsR0FBRyxDQUNoQyxNQURnQyxFQUN4QjtBQUNSLFFBRmdDLEVBRXhCO0FBQ1IsUUFIZ0MsRUFHeEI7QUFDUixRQUpnQyxFQUl4QjtBQUNSLFFBTGdDLEVBS3hCO0FBQ1IsUUFOZ0MsRUFNeEI7QUFDUixRQVBnQyxFQU94QjtBQUNSLFFBUmdDLEVBUXhCO0FBQ1IsUUFUZ0MsRUFTeEI7QUFDUixRQVZnQyxFQVV4QjtBQUNSLFFBWGdDLEVBV3hCO0FBQ1IsUUFaZ0MsRUFZeEI7QUFDUixRQWJnQyxFQWF4QjtBQUNSLFFBZGdDLEVBY3hCO0FBQ1IsUUFmZ0MsQ0FleEI7QUFmd0IsR0FBcEM7TUFrQllDLFE7OzthQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7QUFBQUEsSUFBQUEsUSxDQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtLQUFBQSxRLHlCQUFBQSxROztNQVVVQyxjLEdBSWxCLHdCQUFhNUMsSUFBYixFQUE2QjtBQUFBOztBQUFBLFNBSHRCNkMsT0FHc0I7QUFBQSxTQUZ0QkMsUUFFc0IsR0FGSCxDQUVHO0FBQ3pCLFNBQUtELE9BQUwsR0FBZTdDLElBQWY7QUFDSCxHOzs7O01BS1ErQyx1Qjs7O0FBVVQsdUNBQWU7QUFBQTs7QUFBQTs7QUFDWCxtR0FBTUosUUFBUSxDQUFDSyxpQkFBZjtBQURXLFlBUlJDLGFBUVEsR0FSb0MsSUFRcEM7QUFBQSxZQVBSQyxjQU9RLEdBUHNDLElBT3RDO0FBQUEsWUFOUkMsVUFNUSxHQU5LLElBQUlDLGVBQUosRUFNTDtBQUFBLFlBTFJDLFNBS1EsR0FMa0JDLHFCQUFhQyxJQUsvQjtBQUFBLFlBSlJDLFdBSVEsR0FKa0IsRUFJbEI7QUFBQSxZQUhSQyxVQUdRLEdBSGEsR0FHYjtBQUFBLFlBRlJDLFlBRVEsR0FGZSxDQUVmO0FBQUE7QUFFZDs7Ozs4QkFFZTtBQUNaLGFBQUtSLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxhQUFLTSxXQUFMLENBQWlCRyxNQUFqQixHQUEwQixDQUExQjtBQUNIOzs7O0lBakJ3Q2YsYzs7OztNQW9CaENnQixrQjs7O0FBZVQsa0NBQWU7QUFBQTs7QUFBQTs7QUFDWCwrRkFBTWpCLFFBQVEsQ0FBQ2tCLFdBQWY7QUFEVyxhQWJSQyxnQkFhUSxHQWIwQyxJQWExQztBQUFBLGFBWlJDLGlCQVlRLEdBWjRDLElBWTVDO0FBQUEsYUFYUkMsaUJBV1EsR0FYc0MsRUFXdEM7QUFBQSxhQVZSQyxjQVVRLEdBVm1CLEVBVW5CO0FBQUEsYUFUUkMsUUFTUSxHQVR1QixJQVN2QjtBQUFBLGFBUlJDLE9BUVEsR0FSa0IsSUFRbEI7QUFBQSxhQVBSQyxTQU9RLEdBUG1CLElBT25CO0FBQUEsYUFOUkMsU0FNUSxHQU40QixJQU01QjtBQUFBLGFBTFJDLGNBS1EsR0FMbUIsRUFLbkI7QUFBQSxhQUpSQyxXQUlRLEdBSmdDLElBSWhDO0FBQUEsYUFIUkMsZ0JBR1EsR0FIMEMsSUFHMUM7QUFBQSxhQUZSQyxrQkFFUSxHQUY4QyxJQUU5QztBQUFBO0FBRWQ7Ozs7OEJBRWU7QUFDWixhQUFLWCxnQkFBTCxHQUF3QixJQUF4QjtBQUNBLGFBQUtFLGlCQUFMLENBQXVCTCxNQUF2QixHQUFnQyxDQUFoQztBQUNBLGFBQUtJLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsYUFBS0UsY0FBTCxDQUFvQk4sTUFBcEIsR0FBNkIsQ0FBN0I7QUFDQSxhQUFLTyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBS0MsT0FBTCxHQUFlLElBQWY7QUFDQSxhQUFLQyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsYUFBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGFBQUtDLGNBQUwsQ0FBb0JYLE1BQXBCLEdBQTZCLENBQTdCO0FBQ0EsYUFBS1ksV0FBTCxHQUFtQixJQUFuQjtBQUNBLGFBQUtDLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsYUFBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDSDs7OztJQWhDbUM3QixjOzs7O01BbUMzQjhCLFk7OztBQUlULDRCQUFlO0FBQUE7O0FBQUE7O0FBQ1gseUZBQU0vQixRQUFRLENBQUNnQyxJQUFmO0FBRFcsYUFGUkMsUUFFUSxHQUZHLElBQUlDLG1CQUFKLEVBRUg7QUFBQTtBQUVkOzs7OzhCQUVlLENBQ2Y7Ozs7SUFUNkJqQyxjOzs7O01BWXJCa0Msb0I7OztBQU9ULG9DQUFlO0FBQUE7O0FBQUE7O0FBQ1gsaUdBQU1uQyxRQUFRLENBQUNvQyxhQUFmO0FBRFcsYUFMUkMsU0FLUSxHQUw0QixJQUs1QjtBQUFBLGFBSlJDLE1BSVEsR0FKeUIsSUFJekI7QUFBQSxhQUhSQyxNQUdRLEdBSFMsQ0FHVDtBQUFBLGFBRlJDLElBRVEsR0FGTyxDQUVQO0FBQUE7QUFFZDs7Ozs4QkFFZTtBQUNaLGFBQUtILFNBQUwsR0FBaUIsSUFBakI7QUFDQSxhQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNIOzs7O0lBZHFDckMsYzs7OztNQWlCN0J3QywyQjs7O0FBTVQsMkNBQWU7QUFBQTs7QUFBQTs7QUFDWCx3R0FBTXpDLFFBQVEsQ0FBQzBDLHNCQUFmO0FBRFcsYUFKUkMsVUFJUSxHQUo4QixJQUk5QjtBQUFBLGFBSFJDLE9BR1EsR0FIcUIsRUFHckI7QUFBQSxhQUZSQyxPQUVRLEdBRjBCLEVBRTFCO0FBQUE7QUFFZDs7Ozs4QkFFZTtBQUNaLGFBQUtGLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxhQUFLQyxPQUFMLENBQWE1QixNQUFiLEdBQXNCLENBQXRCO0FBQ0EsYUFBSzZCLE9BQUwsQ0FBYTdCLE1BQWIsR0FBc0IsQ0FBdEI7QUFDSDs7OztJQWQ0Q2YsYzs7OztNQWlCcEM2QyxlOzs7O1dBQ0ZDLEksR0FBOEIsSUFBSUMsd0JBQUosQ0FBZ0IsQ0FBaEIsQztXQUM5QkMsbUIsR0FBNEQsSUFBSUQsd0JBQUosQ0FBZ0IsQ0FBaEIsQztXQUM1REUsYyxHQUFrRCxJQUFJRix3QkFBSixDQUFnQixDQUFoQixDO1dBQ2xERyxRLEdBQXNDLElBQUlILHdCQUFKLENBQWdCLENBQWhCLEM7V0FDdENJLGdCLEdBQXNELElBQUlKLHdCQUFKLENBQWdCLENBQWhCLEM7V0FDdERLLHVCLEdBQW9FLElBQUlMLHdCQUFKLENBQWdCLENBQWhCLEM7Ozs7O2dDQUV6RE0sUyxFQUFrQztBQUVoRCxZQUFJLEtBQUtMLG1CQUFMLENBQXlCakMsTUFBN0IsRUFBcUM7QUFDakNzQyxVQUFBQSxTQUFTLENBQUNDLHNCQUFWLENBQWlDQyxRQUFqQyxDQUEwQyxLQUFLUCxtQkFBL0M7QUFDQSxlQUFLQSxtQkFBTCxDQUF5QlEsS0FBekI7QUFDSDs7QUFFRCxZQUFJLEtBQUtQLGNBQUwsQ0FBb0JsQyxNQUF4QixFQUFnQztBQUM1QnNDLFVBQUFBLFNBQVMsQ0FBQ0ksaUJBQVYsQ0FBNEJGLFFBQTVCLENBQXFDLEtBQUtOLGNBQTFDO0FBQ0EsZUFBS0EsY0FBTCxDQUFvQk8sS0FBcEI7QUFDSDs7QUFFRCxZQUFJLEtBQUtOLFFBQUwsQ0FBY25DLE1BQWxCLEVBQTBCO0FBQ3RCc0MsVUFBQUEsU0FBUyxDQUFDSyxXQUFWLENBQXNCSCxRQUF0QixDQUErQixLQUFLTCxRQUFwQztBQUNBLGVBQUtBLFFBQUwsQ0FBY00sS0FBZDtBQUNIOztBQUVELFlBQUksS0FBS0wsZ0JBQUwsQ0FBc0JwQyxNQUExQixFQUFrQztBQUM5QnNDLFVBQUFBLFNBQVMsQ0FBQ00sbUJBQVYsQ0FBOEJKLFFBQTlCLENBQXVDLEtBQUtKLGdCQUE1QztBQUNBLGVBQUtBLGdCQUFMLENBQXNCSyxLQUF0QjtBQUNIOztBQUVELFlBQUksS0FBS0osdUJBQUwsQ0FBNkJyQyxNQUFqQyxFQUF5QztBQUNyQ3NDLFVBQUFBLFNBQVMsQ0FBQ08sMEJBQVYsQ0FBcUNMLFFBQXJDLENBQThDLEtBQUtILHVCQUFuRDtBQUNBLGVBQUtBLHVCQUFMLENBQTZCSSxLQUE3QjtBQUNIOztBQUVELGFBQUtWLElBQUwsQ0FBVVUsS0FBVjtBQUNIOzs7Ozs7OztBQUdFLFdBQVNLLHdCQUFULENBQW1DQyxNQUFuQyxFQUF3RDFCLFNBQXhELEVBQW9GO0FBRXZGLFFBQU14UixFQUFFLEdBQUdrVCxNQUFNLENBQUNsVCxFQUFsQjtBQUNBLFFBQU1tVCxLQUFLLEdBQUdELE1BQU0sQ0FBQ0UsVUFBckI7QUFDQSxRQUFNQyxPQUFlLEdBQUc3QixTQUFTLENBQUM4QixRQUFWLEdBQXFCQywwQkFBa0JDLElBQXZDLEdBQThDeFQsRUFBRSxDQUFDeVQsWUFBakQsR0FBZ0V6VCxFQUFFLENBQUMwVCxXQUEzRjs7QUFFQSxRQUFJbEMsU0FBUyxDQUFDbUMsS0FBVixHQUFrQkMsMEJBQWtCQyxNQUF4QyxFQUFnRDtBQUU1Q3JDLE1BQUFBLFNBQVMsQ0FBQ3NDLFFBQVYsR0FBcUI5VCxFQUFFLENBQUMrVCxZQUF4QjtBQUNBLFVBQU1DLFFBQVEsR0FBR2hVLEVBQUUsQ0FBQ2lVLFlBQUgsRUFBakI7O0FBQ0EsVUFBSUQsUUFBSixFQUFjO0FBQ1Z4QyxRQUFBQSxTQUFTLENBQUN3QyxRQUFWLEdBQXFCQSxRQUFyQjs7QUFDQSxZQUFJeEMsU0FBUyxDQUFDRyxJQUFWLEdBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLGNBQUl1QixNQUFNLENBQUNnQixNQUFYLEVBQW1CO0FBQ2YsZ0JBQUlmLEtBQUssQ0FBQ2dCLEtBQVYsRUFBaUI7QUFDYmpCLGNBQUFBLE1BQU0sQ0FBQ2tCLHVCQUFQLENBQWdDQyxrQkFBaEMsQ0FBbUQsSUFBbkQ7QUFDQWxCLGNBQUFBLEtBQUssQ0FBQ2dCLEtBQU4sR0FBY0csYUFBYSxDQUFDL0QsaUJBQWQsR0FBa0MsSUFBaEQ7QUFDSDtBQUNKOztBQUVELGNBQUkyQyxNQUFNLENBQUNFLFVBQVAsQ0FBa0JtQixhQUFsQixLQUFvQy9DLFNBQVMsQ0FBQ3dDLFFBQWxELEVBQTREO0FBQ3hEaFUsWUFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0J2QyxTQUFTLENBQUN3QyxRQUF6QztBQUNBZCxZQUFBQSxNQUFNLENBQUNFLFVBQVAsQ0FBa0JtQixhQUFsQixHQUFrQy9DLFNBQVMsQ0FBQ3dDLFFBQTVDO0FBQ0g7O0FBRURoVSxVQUFBQSxFQUFFLENBQUN5VSxVQUFILENBQWN6VSxFQUFFLENBQUMrVCxZQUFqQixFQUErQnZDLFNBQVMsQ0FBQ0csSUFBekMsRUFBK0MwQixPQUEvQztBQUNBclQsVUFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0IsSUFBL0I7QUFDQWIsVUFBQUEsTUFBTSxDQUFDRSxVQUFQLENBQWtCbUIsYUFBbEIsR0FBa0MsSUFBbEM7QUFDSDtBQUNKO0FBQ0osS0F4QkQsTUF3Qk8sSUFBSS9DLFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQmMsS0FBeEMsRUFBK0M7QUFFbERsRCxNQUFBQSxTQUFTLENBQUNzQyxRQUFWLEdBQXFCOVQsRUFBRSxDQUFDMlUsb0JBQXhCOztBQUNBLFVBQU1YLFNBQVEsR0FBR2hVLEVBQUUsQ0FBQ2lVLFlBQUgsRUFBakI7O0FBRUEsVUFBSUQsU0FBSixFQUFjO0FBQ1Z4QyxRQUFBQSxTQUFTLENBQUN3QyxRQUFWLEdBQXFCQSxTQUFyQjs7QUFDQSxZQUFJeEMsU0FBUyxDQUFDRyxJQUFWLEdBQWlCLENBQXJCLEVBQXdCO0FBQ3BCLGNBQUl1QixNQUFNLENBQUNnQixNQUFYLEVBQW1CO0FBQ2YsZ0JBQUlmLEtBQUssQ0FBQ2dCLEtBQVYsRUFBaUI7QUFDYmpCLGNBQUFBLE1BQU0sQ0FBQ2tCLHVCQUFQLENBQWdDQyxrQkFBaEMsQ0FBbUQsSUFBbkQ7QUFDQWxCLGNBQUFBLEtBQUssQ0FBQ2dCLEtBQU4sR0FBY0csYUFBYSxDQUFDL0QsaUJBQWQsR0FBa0MsSUFBaEQ7QUFDSDtBQUNKOztBQUVELGNBQUkyQyxNQUFNLENBQUNFLFVBQVAsQ0FBa0J3QixvQkFBbEIsS0FBMkNwRCxTQUFTLENBQUN3QyxRQUF6RCxFQUFtRTtBQUMvRGhVLFlBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1Q25ELFNBQVMsQ0FBQ3dDLFFBQWpEO0FBQ0FkLFlBQUFBLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQndCLG9CQUFsQixHQUF5Q3BELFNBQVMsQ0FBQ3dDLFFBQW5EO0FBQ0g7O0FBRURoVSxVQUFBQSxFQUFFLENBQUN5VSxVQUFILENBQWN6VSxFQUFFLENBQUMyVSxvQkFBakIsRUFBdUNuRCxTQUFTLENBQUNHLElBQWpELEVBQXVEMEIsT0FBdkQ7QUFDQXJULFVBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1QyxJQUF2QztBQUNBekIsVUFBQUEsTUFBTSxDQUFDRSxVQUFQLENBQWtCd0Isb0JBQWxCLEdBQXlDLElBQXpDO0FBQ0g7QUFDSjtBQUNKLEtBekJNLE1BeUJBLElBQUlwRCxTQUFTLENBQUNtQyxLQUFWLEdBQWtCQywwQkFBa0JpQixPQUF4QyxFQUFpRDtBQUNwRDtBQUNBckQsTUFBQUEsU0FBUyxDQUFDc0MsUUFBVixHQUFxQjlULEVBQUUsQ0FBQytQLElBQXhCOztBQUVBLFVBQUl5QixTQUFTLENBQUNDLE1BQWQsRUFBc0I7QUFDbEJELFFBQUFBLFNBQVMsQ0FBQ3NELElBQVYsR0FBaUIsSUFBSXBHLFlBQUosQ0FBaUI4QyxTQUFTLENBQUNDLE1BQVYsQ0FBaUJBLE1BQWxDLENBQWpCO0FBQ0g7QUFDSixLQVBNLE1BT0EsSUFBSUQsU0FBUyxDQUFDbUMsS0FBVixHQUFrQkMsMEJBQWtCbUIsUUFBeEMsRUFBa0Q7QUFDckR2RCxNQUFBQSxTQUFTLENBQUNzQyxRQUFWLEdBQXFCOVQsRUFBRSxDQUFDK1AsSUFBeEI7QUFDSCxLQUZNLE1BRUEsSUFBSXlCLFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQm9CLFlBQXhDLEVBQXNEO0FBQ3pEeEQsTUFBQUEsU0FBUyxDQUFDc0MsUUFBVixHQUFxQjlULEVBQUUsQ0FBQytQLElBQXhCO0FBQ0gsS0FGTSxNQUVBLElBQUl5QixTQUFTLENBQUNtQyxLQUFWLEdBQWtCQywwQkFBa0JxQixZQUF4QyxFQUFzRDtBQUN6RHpELE1BQUFBLFNBQVMsQ0FBQ3NDLFFBQVYsR0FBcUI5VCxFQUFFLENBQUMrUCxJQUF4QjtBQUNILEtBRk0sTUFFQTtBQUNIM0QsTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsa0RBQWQ7QUFDQW1GLE1BQUFBLFNBQVMsQ0FBQ3NDLFFBQVYsR0FBcUI5VCxFQUFFLENBQUMrUCxJQUF4QjtBQUNIO0FBQ0o7O0FBRU0sV0FBU21GLHlCQUFULENBQW9DaEMsTUFBcEMsRUFBeUQxQixTQUF6RCxFQUFxRjtBQUN4RixRQUFJQSxTQUFTLENBQUN3QyxRQUFkLEVBQXdCO0FBQ3BCZCxNQUFBQSxNQUFNLENBQUNsVCxFQUFQLENBQVVtVixZQUFWLENBQXVCM0QsU0FBUyxDQUFDd0MsUUFBakM7QUFDQXhDLE1BQUFBLFNBQVMsQ0FBQ3dDLFFBQVYsR0FBcUIsSUFBckI7QUFDSDtBQUNKOztBQUVNLFdBQVNvQix3QkFBVCxDQUFtQ2xDLE1BQW5DLEVBQXdEMUIsU0FBeEQsRUFBb0Y7QUFFdkYsUUFBTXhSLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCO0FBQ0EsUUFBTW1ULEtBQUssR0FBR0QsTUFBTSxDQUFDRSxVQUFyQjtBQUNBLFFBQU1DLE9BQWUsR0FBRzdCLFNBQVMsQ0FBQzhCLFFBQVYsR0FBcUJDLDBCQUFrQkMsSUFBdkMsR0FBOEN4VCxFQUFFLENBQUN5VCxZQUFqRCxHQUFnRXpULEVBQUUsQ0FBQzBULFdBQTNGOztBQUVBLFFBQUlsQyxTQUFTLENBQUNtQyxLQUFWLEdBQWtCQywwQkFBa0JDLE1BQXhDLEVBQWdEO0FBQzVDLFVBQUlYLE1BQU0sQ0FBQ2dCLE1BQVgsRUFBbUI7QUFDZixZQUFJZixLQUFLLENBQUNnQixLQUFWLEVBQWlCO0FBQ2JqQixVQUFBQSxNQUFNLENBQUNrQix1QkFBUCxDQUFnQ0Msa0JBQWhDLENBQW1ELElBQW5EO0FBQ0FsQixVQUFBQSxLQUFLLENBQUNnQixLQUFOLEdBQWNHLGFBQWEsQ0FBQy9ELGlCQUFkLEdBQWtDLElBQWhEO0FBQ0g7QUFDSjs7QUFFRCxVQUFJMkMsTUFBTSxDQUFDRSxVQUFQLENBQWtCbUIsYUFBbEIsS0FBb0MvQyxTQUFTLENBQUN3QyxRQUFsRCxFQUE0RDtBQUN4RGhVLFFBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQytULFlBQWpCLEVBQStCdkMsU0FBUyxDQUFDd0MsUUFBekM7QUFDSDs7QUFFRCxVQUFJeEMsU0FBUyxDQUFDQyxNQUFkLEVBQXNCO0FBQ2xCelIsUUFBQUEsRUFBRSxDQUFDeVUsVUFBSCxDQUFjelUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0J2QyxTQUFTLENBQUNDLE1BQXpDLEVBQWlENEIsT0FBakQ7QUFDSCxPQUZELE1BRU87QUFDSHJULFFBQUFBLEVBQUUsQ0FBQ3lVLFVBQUgsQ0FBY3pVLEVBQUUsQ0FBQytULFlBQWpCLEVBQStCdkMsU0FBUyxDQUFDRyxJQUF6QyxFQUErQzBCLE9BQS9DO0FBQ0g7O0FBQ0RyVCxNQUFBQSxFQUFFLENBQUN3VSxVQUFILENBQWN4VSxFQUFFLENBQUMrVCxZQUFqQixFQUErQixJQUEvQjtBQUNBYixNQUFBQSxNQUFNLENBQUNFLFVBQVAsQ0FBa0JtQixhQUFsQixHQUFrQyxJQUFsQztBQUNILEtBbkJELE1BbUJPLElBQUkvQyxTQUFTLENBQUNtQyxLQUFWLEdBQWtCQywwQkFBa0JjLEtBQXhDLEVBQStDO0FBQ2xELFVBQUl4QixNQUFNLENBQUNnQixNQUFYLEVBQW1CO0FBQ2YsWUFBSWYsS0FBSyxDQUFDZ0IsS0FBVixFQUFpQjtBQUNiakIsVUFBQUEsTUFBTSxDQUFDa0IsdUJBQVAsQ0FBZ0NDLGtCQUFoQyxDQUFtRCxJQUFuRDtBQUNBbEIsVUFBQUEsS0FBSyxDQUFDZ0IsS0FBTixHQUFjRyxhQUFhLENBQUMvRCxpQkFBZCxHQUFrQyxJQUFoRDtBQUNIO0FBQ0o7O0FBRUQsVUFBSTJDLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQndCLG9CQUFsQixLQUEyQ3BELFNBQVMsQ0FBQ3dDLFFBQXpELEVBQW1FO0FBQy9EaFUsUUFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDMlUsb0JBQWpCLEVBQXVDbkQsU0FBUyxDQUFDd0MsUUFBakQ7QUFDSDs7QUFFRCxVQUFJeEMsU0FBUyxDQUFDQyxNQUFkLEVBQXNCO0FBQ2xCelIsUUFBQUEsRUFBRSxDQUFDeVUsVUFBSCxDQUFjelUsRUFBRSxDQUFDMlUsb0JBQWpCLEVBQXVDbkQsU0FBUyxDQUFDQyxNQUFqRCxFQUF5RDRCLE9BQXpEO0FBQ0gsT0FGRCxNQUVPO0FBQ0hyVCxRQUFBQSxFQUFFLENBQUN5VSxVQUFILENBQWN6VSxFQUFFLENBQUMyVSxvQkFBakIsRUFBdUNuRCxTQUFTLENBQUNHLElBQWpELEVBQXVEMEIsT0FBdkQ7QUFDSDs7QUFDRHJULE1BQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1QyxJQUF2QztBQUNBekIsTUFBQUEsTUFBTSxDQUFDRSxVQUFQLENBQWtCd0Isb0JBQWxCLEdBQXlDLElBQXpDO0FBQ0gsS0FuQk0sTUFtQkEsSUFBSXBELFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQmlCLE9BQXhDLEVBQWlEO0FBQ3BEO0FBQ0EsVUFBSXJELFNBQVMsQ0FBQ0MsTUFBZCxFQUFzQjtBQUNsQkQsUUFBQUEsU0FBUyxDQUFDc0QsSUFBVixHQUFpQixJQUFJcEcsWUFBSixDQUFpQjhDLFNBQVMsQ0FBQ0MsTUFBVixDQUFpQkEsTUFBbEMsQ0FBakI7QUFDSDtBQUNKLEtBTE0sTUFLQSxJQUFLRCxTQUFTLENBQUNtQyxLQUFWLEdBQWtCQywwQkFBa0JtQixRQUFyQyxJQUNGdkQsU0FBUyxDQUFDbUMsS0FBVixHQUFrQkMsMEJBQWtCb0IsWUFEbEMsSUFFRnhELFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQnFCLFlBRnRDLEVBRXFEO0FBQ3hEekQsTUFBQUEsU0FBUyxDQUFDc0MsUUFBVixHQUFxQjlULEVBQUUsQ0FBQytQLElBQXhCO0FBQ0gsS0FKTSxNQUlBO0FBQ0gzRCxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxrREFBZDtBQUNBbUYsTUFBQUEsU0FBUyxDQUFDc0MsUUFBVixHQUFxQjlULEVBQUUsQ0FBQytQLElBQXhCO0FBQ0g7QUFDSjs7QUFFTSxXQUFTc0Ysd0JBQVQsQ0FBbUNuQyxNQUFuQyxFQUF3RDFCLFNBQXhELEVBQW9GQyxNQUFwRixFQUE2R0MsTUFBN0csRUFBNkhDLElBQTdILEVBQTJJO0FBRTlJLFFBQUlILFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQmlCLE9BQXhDLEVBQWlEO0FBQzdDLFVBQUlTLFdBQVcsQ0FBQ0MsTUFBWixDQUFtQjlELE1BQW5CLENBQUosRUFBZ0M7QUFDNUJELFFBQUFBLFNBQVMsQ0FBQ3NELElBQVYsQ0FBZ0JVLEdBQWhCLENBQW9CL0QsTUFBcEIsRUFBNENDLE1BQU0sR0FBR2hELFlBQVksQ0FBQytHLGlCQUFsRTtBQUNILE9BRkQsTUFFTztBQUNIakUsUUFBQUEsU0FBUyxDQUFDc0QsSUFBVixDQUFnQlUsR0FBaEIsQ0FBb0IsSUFBSTlHLFlBQUosQ0FBaUIrQyxNQUFqQixDQUFwQixFQUE2REMsTUFBTSxHQUFHaEQsWUFBWSxDQUFDK0csaUJBQW5GO0FBQ0g7QUFDSixLQU5ELE1BTU8sSUFBSWpFLFNBQVMsQ0FBQ21DLEtBQVYsR0FBa0JDLDBCQUFrQm1CLFFBQXhDLEVBQWtEO0FBQ3JEdkQsTUFBQUEsU0FBUyxDQUFDa0UsU0FBVixDQUFvQnZGLE1BQXBCLEdBQTZCdUIsTUFBN0I7QUFDQWlFLE1BQUFBLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLEtBQXJCLENBQTJCdEUsU0FBUyxDQUFDa0UsU0FBckMsRUFBaURqRSxNQUFELENBQThCc0UsU0FBOUU7QUFDSCxLQUhNLE1BR0E7QUFDSCxVQUFNQyxJQUFJLEdBQUd2RSxNQUFiO0FBQ0EsVUFBTXpSLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCO0FBQ0EsVUFBTW1ULEtBQUssR0FBR0QsTUFBTSxDQUFDRSxVQUFyQjs7QUFFQSxjQUFRNUIsU0FBUyxDQUFDc0MsUUFBbEI7QUFDSSxhQUFLOVQsRUFBRSxDQUFDK1QsWUFBUjtBQUFzQjtBQUNsQixnQkFBSWIsTUFBTSxDQUFDZ0IsTUFBWCxFQUFtQjtBQUNmLGtCQUFJZixLQUFLLENBQUNnQixLQUFWLEVBQWlCO0FBQ2JqQixnQkFBQUEsTUFBTSxDQUFDa0IsdUJBQVAsQ0FBZ0NDLGtCQUFoQyxDQUFtRCxJQUFuRDtBQUNBbEIsZ0JBQUFBLEtBQUssQ0FBQ2dCLEtBQU4sR0FBY0csYUFBYSxDQUFDL0QsaUJBQWQsR0FBa0MsSUFBaEQ7QUFDSDtBQUNKOztBQUVELGdCQUFJMkMsTUFBTSxDQUFDRSxVQUFQLENBQWtCbUIsYUFBbEIsS0FBb0MvQyxTQUFTLENBQUN3QyxRQUFsRCxFQUE0RDtBQUN4RGhVLGNBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQytULFlBQWpCLEVBQStCdkMsU0FBUyxDQUFDd0MsUUFBekM7QUFDQWQsY0FBQUEsTUFBTSxDQUFDRSxVQUFQLENBQWtCbUIsYUFBbEIsR0FBa0MvQyxTQUFTLENBQUN3QyxRQUE1QztBQUNIOztBQUNEO0FBQ0g7O0FBQ0QsYUFBS2hVLEVBQUUsQ0FBQzJVLG9CQUFSO0FBQThCO0FBQzFCLGdCQUFJekIsTUFBTSxDQUFDZ0IsTUFBWCxFQUFtQjtBQUNmLGtCQUFJZixLQUFLLENBQUNnQixLQUFWLEVBQWlCO0FBQ2JqQixnQkFBQUEsTUFBTSxDQUFDa0IsdUJBQVAsQ0FBZ0NDLGtCQUFoQyxDQUFtRCxJQUFuRDtBQUNBbEIsZ0JBQUFBLEtBQUssQ0FBQ2dCLEtBQU4sR0FBY0csYUFBYSxDQUFDL0QsaUJBQWQsR0FBa0MsSUFBaEQ7QUFDSDtBQUNKOztBQUVELGdCQUFJMkMsTUFBTSxDQUFDRSxVQUFQLENBQWtCd0Isb0JBQWxCLEtBQTJDcEQsU0FBUyxDQUFDd0MsUUFBekQsRUFBbUU7QUFDL0RoVSxjQUFBQSxFQUFFLENBQUN3VSxVQUFILENBQWN4VSxFQUFFLENBQUMyVSxvQkFBakIsRUFBdUNuRCxTQUFTLENBQUN3QyxRQUFqRDtBQUNBZCxjQUFBQSxNQUFNLENBQUNFLFVBQVAsQ0FBa0J3QixvQkFBbEIsR0FBeUNwRCxTQUFTLENBQUN3QyxRQUFuRDtBQUNIOztBQUNEO0FBQ0g7O0FBQ0Q7QUFBUztBQUNMNUgsWUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsa0RBQWQ7QUFDQTtBQUNIO0FBaENMOztBQW1DQSxVQUFJc0YsSUFBSSxLQUFLcUUsSUFBSSxDQUFDQyxVQUFsQixFQUE4QjtBQUMxQmpXLFFBQUFBLEVBQUUsQ0FBQ2tXLGFBQUgsQ0FBaUIxRSxTQUFTLENBQUNzQyxRQUEzQixFQUFxQ3BDLE1BQXJDLEVBQTZDc0UsSUFBN0M7QUFDSCxPQUZELE1BRU87QUFDSGhXLFFBQUFBLEVBQUUsQ0FBQ2tXLGFBQUgsQ0FBaUIxRSxTQUFTLENBQUNzQyxRQUEzQixFQUFxQ3BDLE1BQXJDLEVBQTZDc0UsSUFBSSxDQUFDRyxLQUFMLENBQVcsQ0FBWCxFQUFjeEUsSUFBZCxDQUE3QztBQUNIO0FBQ0o7QUFDSjs7QUFFTSxXQUFTeUUseUJBQVQsQ0FBb0NsRCxNQUFwQyxFQUF5RHBCLFVBQXpELEVBQXVGO0FBRTFGLFFBQU05UixFQUFFLEdBQUdrVCxNQUFNLENBQUNsVCxFQUFsQjtBQUVBOFIsSUFBQUEsVUFBVSxDQUFDdUUsYUFBWCxHQUEyQnJPLDhCQUE4QixDQUFDOEosVUFBVSxDQUFDL1IsTUFBWixFQUFvQkMsRUFBcEIsQ0FBekQ7QUFDQThSLElBQUFBLFVBQVUsQ0FBQ3dFLFFBQVgsR0FBc0JoSyxzQkFBc0IsQ0FBQ3dGLFVBQVUsQ0FBQy9SLE1BQVosRUFBb0JDLEVBQXBCLENBQTVDO0FBQ0E4UixJQUFBQSxVQUFVLENBQUNsRCxNQUFYLEdBQW9COU8sb0JBQW9CLENBQUNnUyxVQUFVLENBQUMvUixNQUFaLEVBQW9CQyxFQUFwQixDQUF4QztBQUVBLFFBQUl1VyxDQUFDLEdBQUd6RSxVQUFVLENBQUMwRSxLQUFuQjtBQUNBLFFBQUlDLENBQUMsR0FBRzNFLFVBQVUsQ0FBQzRFLE1BQW5COztBQUVBLFlBQVE1RSxVQUFVLENBQUN0RixJQUFuQjtBQUNJLFdBQUttSyx1QkFBZUMsS0FBcEI7QUFBMkI7QUFDdkI5RSxVQUFBQSxVQUFVLENBQUNnQyxRQUFYLEdBQXNCOVQsRUFBRSxDQUFDNlcsVUFBekI7QUFFQSxjQUFNQyxPQUFPLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTVCxDQUFULEVBQVlFLENBQVosQ0FBaEI7O0FBQ0EsY0FBSUssT0FBTyxHQUFHNUQsTUFBTSxDQUFDK0QsY0FBckIsRUFBcUM7QUFDakMsZ0NBQVEsSUFBUixFQUFjSCxPQUFkLEVBQXVCNUQsTUFBTSxDQUFDK0QsY0FBOUI7QUFDSDs7QUFFRCxjQUFJLENBQUMvRCxNQUFNLENBQUNnRSxtQkFBUixJQUErQkMsdUJBQWVyRixVQUFVLENBQUMvUixNQUExQixFQUFrQ3FYLFFBQXJFLEVBQStFO0FBQzNFLGdCQUFNQyxjQUFjLEdBQUdyWCxFQUFFLENBQUNzWCxrQkFBSCxFQUF2Qjs7QUFDQSxnQkFBSUQsY0FBYyxJQUFJdkYsVUFBVSxDQUFDSCxJQUFYLEdBQWtCLENBQXhDLEVBQTJDO0FBQ3ZDRyxjQUFBQSxVQUFVLENBQUN1RixjQUFYLEdBQTRCQSxjQUE1Qjs7QUFFQSxrQkFBSW5FLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQmlFLGNBQWxCLEtBQXFDdkYsVUFBVSxDQUFDdUYsY0FBcEQsRUFBb0U7QUFDaEVyWCxnQkFBQUEsRUFBRSxDQUFDdVgsZ0JBQUgsQ0FBb0J2WCxFQUFFLENBQUN3WCxZQUF2QixFQUFxQzFGLFVBQVUsQ0FBQ3VGLGNBQWhEO0FBQ0FuRSxnQkFBQUEsTUFBTSxDQUFDRSxVQUFQLENBQWtCaUUsY0FBbEIsR0FBbUN2RixVQUFVLENBQUN1RixjQUE5QztBQUNILGVBTnNDLENBT3ZDOzs7QUFDQSxrQkFBSXZGLFVBQVUsQ0FBQ3VFLGFBQVgsS0FBNkJyVyxFQUFFLENBQUMySSxlQUFwQyxFQUFxRDtBQUNqRG1KLGdCQUFBQSxVQUFVLENBQUN1RSxhQUFYLEdBQTJCclcsRUFBRSxDQUFDeVgsaUJBQTlCO0FBQ0g7O0FBQ0R6WCxjQUFBQSxFQUFFLENBQUMwWCxtQkFBSCxDQUF1QjFYLEVBQUUsQ0FBQ3dYLFlBQTFCLEVBQXdDMUYsVUFBVSxDQUFDdUUsYUFBbkQsRUFBa0VFLENBQWxFLEVBQXFFRSxDQUFyRTtBQUNIO0FBQ0osV0FmRCxNQWVPLElBQUkzRSxVQUFVLENBQUM2RixPQUFYLEtBQXVCQyx1QkFBZUMsRUFBMUMsRUFBOEM7QUFDakQsZ0JBQU1DLFNBQVMsR0FBRzlYLEVBQUUsQ0FBQytYLGFBQUgsRUFBbEI7O0FBQ0EsZ0JBQUlELFNBQVMsSUFBSWhHLFVBQVUsQ0FBQ0gsSUFBWCxHQUFrQixDQUFuQyxFQUFzQztBQUNsQ0csY0FBQUEsVUFBVSxDQUFDZ0csU0FBWCxHQUF1QkEsU0FBdkI7QUFDQSxrQkFBTUUsU0FBUyxHQUFHOUUsTUFBTSxDQUFDRSxVQUFQLENBQWtCNkUsVUFBbEIsQ0FBNkIvRSxNQUFNLENBQUNFLFVBQVAsQ0FBa0I4RSxPQUEvQyxDQUFsQjs7QUFFQSxrQkFBSUYsU0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUM5WCxnQkFBQUEsRUFBRSxDQUFDbVksV0FBSCxDQUFlblksRUFBRSxDQUFDNlcsVUFBbEIsRUFBOEIvRSxVQUFVLENBQUNnRyxTQUF6QztBQUNBRSxnQkFBQUEsU0FBUyxDQUFDRixTQUFWLEdBQXNCaEcsVUFBVSxDQUFDZ0csU0FBakM7QUFDSDs7QUFFRCxrQkFBSSxDQUFDWCx1QkFBZXJGLFVBQVUsQ0FBQy9SLE1BQTFCLEVBQWtDcVksWUFBdkMsRUFBcUQ7QUFDakQscUJBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3ZHLFVBQVUsQ0FBQ3dHLFFBQS9CLEVBQXlDLEVBQUVELENBQTNDLEVBQThDO0FBQzFDclksa0JBQUFBLEVBQUUsQ0FBQ3VZLFVBQUgsQ0FBY3ZZLEVBQUUsQ0FBQzZXLFVBQWpCLEVBQTZCd0IsQ0FBN0IsRUFBZ0N2RyxVQUFVLENBQUN1RSxhQUEzQyxFQUEwREUsQ0FBMUQsRUFBNkRFLENBQTdELEVBQWdFLENBQWhFLEVBQW1FM0UsVUFBVSxDQUFDd0UsUUFBOUUsRUFBd0Z4RSxVQUFVLENBQUNsRCxNQUFuRyxFQUEyRyxJQUEzRztBQUNBMkgsa0JBQUFBLENBQUMsR0FBR1EsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZVCxDQUFDLElBQUksQ0FBakIsQ0FBSjtBQUNBRSxrQkFBQUEsQ0FBQyxHQUFHTSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlQLENBQUMsSUFBSSxDQUFqQixDQUFKO0FBQ0g7QUFDSixlQU5ELE1BTU87QUFDSCxvQkFBSTNFLFVBQVUsQ0FBQ3VFLGFBQVgsS0FBNkI1VixzQkFBUzhJLHlCQUExQyxFQUFxRTtBQUNqRSx1QkFBSyxJQUFJOE8sRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR3ZHLFVBQVUsQ0FBQ3dHLFFBQS9CLEVBQXlDLEVBQUVELEVBQTNDLEVBQThDO0FBQzFDLHdCQUFNRyxPQUFPLEdBQUcsMkJBQWMxRyxVQUFVLENBQUMvUixNQUF6QixFQUFpQ3dXLENBQWpDLEVBQW9DRSxDQUFwQyxFQUF1QyxDQUF2QyxDQUFoQjtBQUNBLHdCQUFNZ0MsSUFBZ0IsR0FBRyxJQUFJQyxVQUFKLENBQWVGLE9BQWYsQ0FBekI7QUFDQXhZLG9CQUFBQSxFQUFFLENBQUMyWSxvQkFBSCxDQUF3QjNZLEVBQUUsQ0FBQzZXLFVBQTNCLEVBQXVDd0IsRUFBdkMsRUFBMEN2RyxVQUFVLENBQUN1RSxhQUFyRCxFQUFvRUUsQ0FBcEUsRUFBdUVFLENBQXZFLEVBQTBFLENBQTFFLEVBQTZFZ0MsSUFBN0U7QUFDQWxDLG9CQUFBQSxDQUFDLEdBQUdRLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVQsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDQUUsb0JBQUFBLENBQUMsR0FBR00sSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxDQUFDLElBQUksQ0FBakIsQ0FBSjtBQUNIO0FBQ0osaUJBUkQsTUFTSztBQUNEO0FBQ0Esc0JBQU0rQixRQUFPLEdBQUcsMkJBQWMxRyxVQUFVLENBQUMvUixNQUF6QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxDQUFoQjs7QUFDQSxzQkFBTTBZLEtBQWdCLEdBQUcsSUFBSUMsVUFBSixDQUFlRixRQUFmLENBQXpCOztBQUNBeFksa0JBQUFBLEVBQUUsQ0FBQzJZLG9CQUFILENBQXdCM1ksRUFBRSxDQUFDNlcsVUFBM0IsRUFBdUMsQ0FBdkMsRUFBMEMvRSxVQUFVLENBQUN1RSxhQUFyRCxFQUFvRSxDQUFwRSxFQUF1RSxDQUF2RSxFQUEwRSxDQUExRSxFQUE2RW9DLEtBQTdFO0FBQ0g7QUFDSjs7QUFFRCxrQkFBSTNHLFVBQVUsQ0FBQzhHLFVBQWYsRUFBMkI7QUFDdkI5RyxnQkFBQUEsVUFBVSxDQUFDK0csT0FBWCxHQUFxQjdZLEVBQUUsQ0FBQzhZLE1BQXhCO0FBQ0FoSCxnQkFBQUEsVUFBVSxDQUFDaUgsT0FBWCxHQUFxQi9ZLEVBQUUsQ0FBQzhZLE1BQXhCO0FBQ0gsZUFIRCxNQUdPO0FBQ0hoSCxnQkFBQUEsVUFBVSxDQUFDK0csT0FBWCxHQUFxQjdZLEVBQUUsQ0FBQ2daLGFBQXhCO0FBQ0FsSCxnQkFBQUEsVUFBVSxDQUFDaUgsT0FBWCxHQUFxQi9ZLEVBQUUsQ0FBQ2daLGFBQXhCO0FBQ0g7O0FBQ0RsSCxjQUFBQSxVQUFVLENBQUNtSCxXQUFYLEdBQXlCalosRUFBRSxDQUFDa1osTUFBNUI7QUFDQXBILGNBQUFBLFVBQVUsQ0FBQ3FILFdBQVgsR0FBeUJuWixFQUFFLENBQUNrWixNQUE1QjtBQUVBbFosY0FBQUEsRUFBRSxDQUFDb1osYUFBSCxDQUFpQnRILFVBQVUsQ0FBQ2dDLFFBQTVCLEVBQXNDOVQsRUFBRSxDQUFDcVosY0FBekMsRUFBeUR2SCxVQUFVLENBQUMrRyxPQUFwRTtBQUNBN1ksY0FBQUEsRUFBRSxDQUFDb1osYUFBSCxDQUFpQnRILFVBQVUsQ0FBQ2dDLFFBQTVCLEVBQXNDOVQsRUFBRSxDQUFDc1osY0FBekMsRUFBeUR4SCxVQUFVLENBQUNpSCxPQUFwRTtBQUNBL1ksY0FBQUEsRUFBRSxDQUFDb1osYUFBSCxDQUFpQnRILFVBQVUsQ0FBQ2dDLFFBQTVCLEVBQXNDOVQsRUFBRSxDQUFDdVosa0JBQXpDLEVBQTZEekgsVUFBVSxDQUFDbUgsV0FBeEU7QUFDQWpaLGNBQUFBLEVBQUUsQ0FBQ29aLGFBQUgsQ0FBaUJ0SCxVQUFVLENBQUNnQyxRQUE1QixFQUFzQzlULEVBQUUsQ0FBQ3daLGtCQUF6QyxFQUE2RDFILFVBQVUsQ0FBQ3FILFdBQXhFO0FBQ0gsYUEvQ0QsTUFnREs7QUFDRG5aLGNBQUFBLEVBQUUsQ0FBQ3laLGFBQUgsQ0FBaUIzQixTQUFqQjtBQUNIO0FBQ0o7O0FBRUQ7QUFDSDs7QUFDRCxXQUFLbkIsdUJBQWUrQyxJQUFwQjtBQUEwQjtBQUN0QjVILFVBQUFBLFVBQVUsQ0FBQ2dDLFFBQVgsR0FBc0I5VCxFQUFFLENBQUMyWixnQkFBekI7O0FBRUEsY0FBTTdDLFFBQU8sR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVNULENBQVQsRUFBWUUsQ0FBWixDQUFoQjs7QUFDQSxjQUFJSyxRQUFPLEdBQUc1RCxNQUFNLENBQUMwRyxxQkFBckIsRUFBNEM7QUFDeEMsZ0NBQVEsSUFBUixFQUFjOUMsUUFBZCxFQUF1QjVELE1BQU0sQ0FBQytELGNBQTlCO0FBQ0g7O0FBRUQsY0FBTWEsVUFBUyxHQUFHOVgsRUFBRSxDQUFDK1gsYUFBSCxFQUFsQjs7QUFDQSxjQUFJRCxVQUFTLElBQUloRyxVQUFVLENBQUNILElBQVgsR0FBa0IsQ0FBbkMsRUFBc0M7QUFDbENHLFlBQUFBLFVBQVUsQ0FBQ2dHLFNBQVgsR0FBdUJBLFVBQXZCO0FBQ0EsZ0JBQU1FLFVBQVMsR0FBRzlFLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQjZFLFVBQWxCLENBQTZCL0UsTUFBTSxDQUFDRSxVQUFQLENBQWtCOEUsT0FBL0MsQ0FBbEI7O0FBRUEsZ0JBQUlGLFVBQVMsQ0FBQ0YsU0FBVixLQUF3QmhHLFVBQVUsQ0FBQ2dHLFNBQXZDLEVBQWtEO0FBQzlDOVgsY0FBQUEsRUFBRSxDQUFDbVksV0FBSCxDQUFlblksRUFBRSxDQUFDMlosZ0JBQWxCLEVBQW9DN0gsVUFBVSxDQUFDZ0csU0FBL0M7QUFDQUUsY0FBQUEsVUFBUyxDQUFDRixTQUFWLEdBQXNCaEcsVUFBVSxDQUFDZ0csU0FBakM7QUFDSDs7QUFFRCxnQkFBSSxDQUFDWCx1QkFBZXJGLFVBQVUsQ0FBQy9SLE1BQTFCLEVBQWtDcVksWUFBdkMsRUFBcUQ7QUFDakQsbUJBQUssSUFBSXlCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUIsRUFBRUEsQ0FBekIsRUFBNEI7QUFDeEJ0RCxnQkFBQUEsQ0FBQyxHQUFHekUsVUFBVSxDQUFDMEUsS0FBZjtBQUNBQyxnQkFBQUEsQ0FBQyxHQUFHM0UsVUFBVSxDQUFDNEUsTUFBZjs7QUFDQSxxQkFBSyxJQUFJMkIsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR3ZHLFVBQVUsQ0FBQ3dHLFFBQS9CLEVBQXlDLEVBQUVELEdBQTNDLEVBQThDO0FBQzFDclksa0JBQUFBLEVBQUUsQ0FBQ3VZLFVBQUgsQ0FBY3ZZLEVBQUUsQ0FBQzhaLDJCQUFILEdBQWlDRCxDQUEvQyxFQUFrRHhCLEdBQWxELEVBQXFEdkcsVUFBVSxDQUFDdUUsYUFBaEUsRUFBK0VFLENBQS9FLEVBQWtGRSxDQUFsRixFQUFxRixDQUFyRixFQUNJM0UsVUFBVSxDQUFDd0UsUUFEZixFQUN5QnhFLFVBQVUsQ0FBQ2xELE1BRHBDLEVBQzRDLElBRDVDO0FBRUEySCxrQkFBQUEsQ0FBQyxHQUFHUSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlULENBQUMsSUFBSSxDQUFqQixDQUFKO0FBQ0FFLGtCQUFBQSxDQUFDLEdBQUdNLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDSDtBQUNKO0FBQ0osYUFYRCxNQVdPO0FBQ0gsa0JBQUkzRSxVQUFVLENBQUN1RSxhQUFYLEtBQTZCNVYsc0JBQVM4SSx5QkFBMUMsRUFBcUU7QUFDakUscUJBQUssSUFBSXNRLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUcsQ0FBcEIsRUFBdUIsRUFBRUEsRUFBekIsRUFBNEI7QUFDeEJ0RCxrQkFBQUEsQ0FBQyxHQUFHekUsVUFBVSxDQUFDMEUsS0FBZjtBQUNBQyxrQkFBQUEsQ0FBQyxHQUFHM0UsVUFBVSxDQUFDNEUsTUFBZjs7QUFDQSx1QkFBSyxJQUFJMkIsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR3ZHLFVBQVUsQ0FBQ3dHLFFBQS9CLEVBQXlDLEVBQUVELEdBQTNDLEVBQThDO0FBQzFDLHdCQUFNRyxTQUFPLEdBQUcsMkJBQWMxRyxVQUFVLENBQUMvUixNQUF6QixFQUFpQ3dXLENBQWpDLEVBQW9DRSxDQUFwQyxFQUF1QyxDQUF2QyxDQUFoQjs7QUFDQSx3QkFBTWdDLE1BQWdCLEdBQUcsSUFBSUMsVUFBSixDQUFlRixTQUFmLENBQXpCOztBQUNBeFksb0JBQUFBLEVBQUUsQ0FBQzJZLG9CQUFILENBQXdCM1ksRUFBRSxDQUFDOFosMkJBQUgsR0FBaUNELEVBQXpELEVBQTREeEIsR0FBNUQsRUFBK0R2RyxVQUFVLENBQUN1RSxhQUExRSxFQUF5RkUsQ0FBekYsRUFBNEZFLENBQTVGLEVBQStGLENBQS9GLEVBQWtHZ0MsTUFBbEc7QUFDQWxDLG9CQUFBQSxDQUFDLEdBQUdRLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVQsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDQUUsb0JBQUFBLENBQUMsR0FBR00sSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxDQUFDLElBQUksQ0FBakIsQ0FBSjtBQUNIO0FBQ0o7QUFDSixlQVpELE1BYUs7QUFDRCxxQkFBSyxJQUFJb0QsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBRyxDQUFwQixFQUF1QixFQUFFQSxHQUF6QixFQUE0QjtBQUN4QixzQkFBTXJCLFNBQU8sR0FBRywyQkFBYzFHLFVBQVUsQ0FBQy9SLE1BQXpCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLENBQWhCOztBQUNBLHNCQUFNMFksTUFBZ0IsR0FBRyxJQUFJQyxVQUFKLENBQWVGLFNBQWYsQ0FBekI7O0FBQ0F4WSxrQkFBQUEsRUFBRSxDQUFDMlksb0JBQUgsQ0FBd0IzWSxFQUFFLENBQUM4WiwyQkFBSCxHQUFpQ0QsR0FBekQsRUFBNEQsQ0FBNUQsRUFBK0QvSCxVQUFVLENBQUN1RSxhQUExRSxFQUF5RixDQUF6RixFQUE0RixDQUE1RixFQUErRixDQUEvRixFQUFrR29DLE1BQWxHO0FBQ0g7QUFDSjtBQUNKOztBQUVELGdCQUFJM0csVUFBVSxDQUFDOEcsVUFBZixFQUEyQjtBQUN2QjlHLGNBQUFBLFVBQVUsQ0FBQytHLE9BQVgsR0FBcUI3WSxFQUFFLENBQUM4WSxNQUF4QjtBQUNBaEgsY0FBQUEsVUFBVSxDQUFDaUgsT0FBWCxHQUFxQi9ZLEVBQUUsQ0FBQzhZLE1BQXhCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hoSCxjQUFBQSxVQUFVLENBQUMrRyxPQUFYLEdBQXFCN1ksRUFBRSxDQUFDZ1osYUFBeEI7QUFDQWxILGNBQUFBLFVBQVUsQ0FBQ2lILE9BQVgsR0FBcUIvWSxFQUFFLENBQUNnWixhQUF4QjtBQUNIOztBQUNEbEgsWUFBQUEsVUFBVSxDQUFDbUgsV0FBWCxHQUF5QmpaLEVBQUUsQ0FBQ2taLE1BQTVCO0FBQ0FwSCxZQUFBQSxVQUFVLENBQUNxSCxXQUFYLEdBQXlCblosRUFBRSxDQUFDa1osTUFBNUI7QUFFQWxaLFlBQUFBLEVBQUUsQ0FBQ29aLGFBQUgsQ0FBaUJ0SCxVQUFVLENBQUNnQyxRQUE1QixFQUFzQzlULEVBQUUsQ0FBQ3FaLGNBQXpDLEVBQXlEdkgsVUFBVSxDQUFDK0csT0FBcEU7QUFDQTdZLFlBQUFBLEVBQUUsQ0FBQ29aLGFBQUgsQ0FBaUJ0SCxVQUFVLENBQUNnQyxRQUE1QixFQUFzQzlULEVBQUUsQ0FBQ3NaLGNBQXpDLEVBQXlEeEgsVUFBVSxDQUFDaUgsT0FBcEU7QUFDQS9ZLFlBQUFBLEVBQUUsQ0FBQ29aLGFBQUgsQ0FBaUJ0SCxVQUFVLENBQUNnQyxRQUE1QixFQUFzQzlULEVBQUUsQ0FBQ3VaLGtCQUF6QyxFQUE2RHpILFVBQVUsQ0FBQ21ILFdBQXhFO0FBQ0FqWixZQUFBQSxFQUFFLENBQUNvWixhQUFILENBQWlCdEgsVUFBVSxDQUFDZ0MsUUFBNUIsRUFBc0M5VCxFQUFFLENBQUN3WixrQkFBekMsRUFBNkQxSCxVQUFVLENBQUNxSCxXQUF4RTtBQUNIOztBQUVEO0FBQ0g7O0FBQ0Q7QUFBUztBQUNML00sVUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsb0RBQWQ7QUFDQXlGLFVBQUFBLFVBQVUsQ0FBQ3RGLElBQVgsR0FBa0JtSyx1QkFBZUMsS0FBakM7QUFDQTlFLFVBQUFBLFVBQVUsQ0FBQ2dDLFFBQVgsR0FBc0I5VCxFQUFFLENBQUM2VyxVQUF6QjtBQUNIO0FBM0pMO0FBNkpIOztBQUVNLFdBQVNrRCwwQkFBVCxDQUFxQzdHLE1BQXJDLEVBQTBEcEIsVUFBMUQsRUFBd0Y7QUFDM0YsUUFBSUEsVUFBVSxDQUFDZ0csU0FBZixFQUEwQjtBQUN0QjVFLE1BQUFBLE1BQU0sQ0FBQ2xULEVBQVAsQ0FBVXlaLGFBQVYsQ0FBd0IzSCxVQUFVLENBQUNnRyxTQUFuQztBQUNBaEcsTUFBQUEsVUFBVSxDQUFDZ0csU0FBWCxHQUF1QixJQUF2QjtBQUNIOztBQUVELFFBQUloRyxVQUFVLENBQUN1RixjQUFmLEVBQStCO0FBQzNCbkUsTUFBQUEsTUFBTSxDQUFDbFQsRUFBUCxDQUFVZ2Esa0JBQVYsQ0FBNkJsSSxVQUFVLENBQUN1RixjQUF4QztBQUNBdkYsTUFBQUEsVUFBVSxDQUFDdUYsY0FBWCxHQUE0QixJQUE1QjtBQUNIO0FBQ0o7O0FBRU0sV0FBUzRDLHlCQUFULENBQW9DL0csTUFBcEMsRUFBeURwQixVQUF6RCxFQUF1RjtBQUUxRixRQUFNOVIsRUFBRSxHQUFHa1QsTUFBTSxDQUFDbFQsRUFBbEI7QUFFQThSLElBQUFBLFVBQVUsQ0FBQ3VFLGFBQVgsR0FBMkJyTyw4QkFBOEIsQ0FBQzhKLFVBQVUsQ0FBQy9SLE1BQVosRUFBb0JDLEVBQXBCLENBQXpEO0FBQ0E4UixJQUFBQSxVQUFVLENBQUN3RSxRQUFYLEdBQXNCaEssc0JBQXNCLENBQUN3RixVQUFVLENBQUMvUixNQUFaLEVBQW9CQyxFQUFwQixDQUE1QztBQUNBOFIsSUFBQUEsVUFBVSxDQUFDbEQsTUFBWCxHQUFvQjlPLG9CQUFvQixDQUFDZ1MsVUFBVSxDQUFDL1IsTUFBWixFQUFvQkMsRUFBcEIsQ0FBeEM7QUFFQSxRQUFJdVcsQ0FBQyxHQUFHekUsVUFBVSxDQUFDMEUsS0FBbkI7QUFDQSxRQUFJQyxDQUFDLEdBQUczRSxVQUFVLENBQUM0RSxNQUFuQjs7QUFFQSxZQUFRNUUsVUFBVSxDQUFDdEYsSUFBbkI7QUFDSSxXQUFLbUssdUJBQWVDLEtBQXBCO0FBQTJCO0FBQ3ZCOUUsVUFBQUEsVUFBVSxDQUFDZ0MsUUFBWCxHQUFzQjlULEVBQUUsQ0FBQzZXLFVBQXpCO0FBRUEsY0FBTUMsT0FBTyxHQUFHQyxJQUFJLENBQUNDLEdBQUwsQ0FBU1QsQ0FBVCxFQUFZRSxDQUFaLENBQWhCOztBQUNBLGNBQUlLLE9BQU8sR0FBRzVELE1BQU0sQ0FBQytELGNBQXJCLEVBQXFDO0FBQ2pDLGdDQUFRLElBQVIsRUFBY0gsT0FBZCxFQUF1QjVELE1BQU0sQ0FBQytELGNBQTlCO0FBQ0g7O0FBRUQsY0FBSW5GLFVBQVUsQ0FBQ3VGLGNBQWYsRUFBK0I7QUFDM0IsZ0JBQUluRSxNQUFNLENBQUNFLFVBQVAsQ0FBa0JpRSxjQUFsQixLQUFxQ3ZGLFVBQVUsQ0FBQ3VGLGNBQXBELEVBQW9FO0FBQ2hFclgsY0FBQUEsRUFBRSxDQUFDdVgsZ0JBQUgsQ0FBb0J2WCxFQUFFLENBQUN3WCxZQUF2QixFQUFxQzFGLFVBQVUsQ0FBQ3VGLGNBQWhEO0FBQ0FuRSxjQUFBQSxNQUFNLENBQUNFLFVBQVAsQ0FBa0JpRSxjQUFsQixHQUFtQ3ZGLFVBQVUsQ0FBQ3VGLGNBQTlDO0FBQ0g7O0FBQ0RyWCxZQUFBQSxFQUFFLENBQUMwWCxtQkFBSCxDQUF1QjFYLEVBQUUsQ0FBQ3dYLFlBQTFCLEVBQXdDMUYsVUFBVSxDQUFDdUUsYUFBbkQsRUFBa0VFLENBQWxFLEVBQXFFRSxDQUFyRTtBQUNILFdBTkQsTUFNTyxJQUFJM0UsVUFBVSxDQUFDZ0csU0FBZixFQUEwQjtBQUM3QixnQkFBTUUsU0FBUyxHQUFHOUUsTUFBTSxDQUFDRSxVQUFQLENBQWtCNkUsVUFBbEIsQ0FBNkIvRSxNQUFNLENBQUNFLFVBQVAsQ0FBa0I4RSxPQUEvQyxDQUFsQjs7QUFFQSxnQkFBSUYsU0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUM5WCxjQUFBQSxFQUFFLENBQUNtWSxXQUFILENBQWVuWSxFQUFFLENBQUM2VyxVQUFsQixFQUE4Qi9FLFVBQVUsQ0FBQ2dHLFNBQXpDO0FBQ0FFLGNBQUFBLFNBQVMsQ0FBQ0YsU0FBVixHQUFzQmhHLFVBQVUsQ0FBQ2dHLFNBQWpDO0FBQ0g7O0FBRUQsZ0JBQUksQ0FBQ1gsdUJBQWVyRixVQUFVLENBQUMvUixNQUExQixFQUFrQ3FZLFlBQXZDLEVBQXFEO0FBQ2pELG1CQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd2RyxVQUFVLENBQUN3RyxRQUEvQixFQUF5QyxFQUFFRCxDQUEzQyxFQUE4QztBQUMxQ3JZLGdCQUFBQSxFQUFFLENBQUN1WSxVQUFILENBQWN2WSxFQUFFLENBQUM2VyxVQUFqQixFQUE2QndCLENBQTdCLEVBQWdDdkcsVUFBVSxDQUFDdUUsYUFBM0MsRUFBMERFLENBQTFELEVBQTZERSxDQUE3RCxFQUFnRSxDQUFoRSxFQUFtRTNFLFVBQVUsQ0FBQ3dFLFFBQTlFLEVBQXdGeEUsVUFBVSxDQUFDbEQsTUFBbkcsRUFBMkcsSUFBM0c7QUFDQTJILGdCQUFBQSxDQUFDLEdBQUdRLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVQsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDQUUsZ0JBQUFBLENBQUMsR0FBR00sSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZUCxDQUFDLElBQUksQ0FBakIsQ0FBSjtBQUNIO0FBQ0osYUFORCxNQU1PO0FBQ0gsa0JBQUkzRSxVQUFVLENBQUN1RSxhQUFYLEtBQTZCNVYsc0JBQVM4SSx5QkFBMUMsRUFBcUU7QUFDakUscUJBQUssSUFBSThPLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUd2RyxVQUFVLENBQUN3RyxRQUEvQixFQUF5QyxFQUFFRCxHQUEzQyxFQUE4QztBQUMxQyxzQkFBTUcsT0FBTyxHQUFHLDJCQUFjMUcsVUFBVSxDQUFDL1IsTUFBekIsRUFBaUN3VyxDQUFqQyxFQUFvQ0UsQ0FBcEMsRUFBdUMsQ0FBdkMsQ0FBaEI7QUFDQSxzQkFBTWdDLElBQWdCLEdBQUcsSUFBSUMsVUFBSixDQUFlRixPQUFmLENBQXpCO0FBQ0F4WSxrQkFBQUEsRUFBRSxDQUFDMlksb0JBQUgsQ0FBd0IzWSxFQUFFLENBQUM2VyxVQUEzQixFQUF1Q3dCLEdBQXZDLEVBQTBDdkcsVUFBVSxDQUFDdUUsYUFBckQsRUFBb0VFLENBQXBFLEVBQXVFRSxDQUF2RSxFQUEwRSxDQUExRSxFQUE2RWdDLElBQTdFO0FBQ0FsQyxrQkFBQUEsQ0FBQyxHQUFHUSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlULENBQUMsSUFBSSxDQUFqQixDQUFKO0FBQ0FFLGtCQUFBQSxDQUFDLEdBQUdNLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFDRDtBQUNIOztBQUNELFdBQUtFLHVCQUFlK0MsSUFBcEI7QUFBMEI7QUFDdEI1SCxVQUFBQSxVQUFVLENBQUNnQyxRQUFYLEdBQXNCOVQsRUFBRSxDQUFDMlosZ0JBQXpCOztBQUVBLGNBQU03QyxTQUFPLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTVCxDQUFULEVBQVlFLENBQVosQ0FBaEI7O0FBQ0EsY0FBSUssU0FBTyxHQUFHNUQsTUFBTSxDQUFDMEcscUJBQXJCLEVBQTRDO0FBQ3hDLGdDQUFRLElBQVIsRUFBYzlDLFNBQWQsRUFBdUI1RCxNQUFNLENBQUMrRCxjQUE5QjtBQUNIOztBQUVELGNBQU1lLFdBQVMsR0FBRzlFLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQjZFLFVBQWxCLENBQTZCL0UsTUFBTSxDQUFDRSxVQUFQLENBQWtCOEUsT0FBL0MsQ0FBbEI7O0FBRUEsY0FBSUYsV0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUM5WCxZQUFBQSxFQUFFLENBQUNtWSxXQUFILENBQWVuWSxFQUFFLENBQUMyWixnQkFBbEIsRUFBb0M3SCxVQUFVLENBQUNnRyxTQUEvQztBQUNBRSxZQUFBQSxXQUFTLENBQUNGLFNBQVYsR0FBc0JoRyxVQUFVLENBQUNnRyxTQUFqQztBQUNIOztBQUVELGNBQUksQ0FBQ1gsdUJBQWVyRixVQUFVLENBQUMvUixNQUExQixFQUFrQ3FZLFlBQXZDLEVBQXFEO0FBQ2pELGlCQUFLLElBQUl5QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLENBQXBCLEVBQXVCLEVBQUVBLENBQXpCLEVBQTRCO0FBQ3hCdEQsY0FBQUEsQ0FBQyxHQUFHekUsVUFBVSxDQUFDMEUsS0FBZjtBQUNBQyxjQUFBQSxDQUFDLEdBQUczRSxVQUFVLENBQUM0RSxNQUFmOztBQUNBLG1CQUFLLElBQUkyQixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHdkcsVUFBVSxDQUFDd0csUUFBL0IsRUFBeUMsRUFBRUQsR0FBM0MsRUFBOEM7QUFDMUNyWSxnQkFBQUEsRUFBRSxDQUFDdVksVUFBSCxDQUFjdlksRUFBRSxDQUFDOFosMkJBQUgsR0FBaUNELENBQS9DLEVBQWtEeEIsR0FBbEQsRUFBcUR2RyxVQUFVLENBQUN1RSxhQUFoRSxFQUErRUUsQ0FBL0UsRUFBa0ZFLENBQWxGLEVBQXFGLENBQXJGLEVBQXdGM0UsVUFBVSxDQUFDd0UsUUFBbkcsRUFBNkd4RSxVQUFVLENBQUNsRCxNQUF4SCxFQUFnSSxJQUFoSTtBQUNBMkgsZ0JBQUFBLENBQUMsR0FBR1EsSUFBSSxDQUFDQyxHQUFMLENBQVMsQ0FBVCxFQUFZVCxDQUFDLElBQUksQ0FBakIsQ0FBSjtBQUNBRSxnQkFBQUEsQ0FBQyxHQUFHTSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlQLENBQUMsSUFBSSxDQUFqQixDQUFKO0FBQ0g7QUFDSjtBQUNKLFdBVkQsTUFVTztBQUNILGdCQUFJM0UsVUFBVSxDQUFDdUUsYUFBWCxLQUE2QjVWLHNCQUFTOEkseUJBQTFDLEVBQXFFO0FBQ2pFLG1CQUFLLElBQUlzUSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHLENBQXBCLEVBQXVCLEVBQUVBLEdBQXpCLEVBQTRCO0FBQ3hCdEQsZ0JBQUFBLENBQUMsR0FBR3pFLFVBQVUsQ0FBQzBFLEtBQWY7QUFDQUMsZ0JBQUFBLENBQUMsR0FBRzNFLFVBQVUsQ0FBQzRFLE1BQWY7O0FBQ0EscUJBQUssSUFBSTJCLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUd2RyxVQUFVLENBQUN3RyxRQUEvQixFQUF5QyxFQUFFRCxHQUEzQyxFQUE4QztBQUMxQyxzQkFBTUcsU0FBTyxHQUFHLDJCQUFjMUcsVUFBVSxDQUFDL1IsTUFBekIsRUFBaUN3VyxDQUFqQyxFQUFvQ0UsQ0FBcEMsRUFBdUMsQ0FBdkMsQ0FBaEI7O0FBQ0Esc0JBQU1nQyxNQUFnQixHQUFHLElBQUlDLFVBQUosQ0FBZUYsU0FBZixDQUF6Qjs7QUFDQXhZLGtCQUFBQSxFQUFFLENBQUMyWSxvQkFBSCxDQUF3QjNZLEVBQUUsQ0FBQzhaLDJCQUFILEdBQWlDRCxHQUF6RCxFQUE0RHhCLEdBQTVELEVBQStEdkcsVUFBVSxDQUFDdUUsYUFBMUUsRUFBeUZFLENBQXpGLEVBQTRGRSxDQUE1RixFQUErRixDQUEvRixFQUFrR2dDLE1BQWxHO0FBQ0FsQyxrQkFBQUEsQ0FBQyxHQUFHUSxJQUFJLENBQUNDLEdBQUwsQ0FBUyxDQUFULEVBQVlULENBQUMsSUFBSSxDQUFqQixDQUFKO0FBQ0FFLGtCQUFBQSxDQUFDLEdBQUdNLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWVAsQ0FBQyxJQUFJLENBQWpCLENBQUo7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFDRDtBQUNIOztBQUNEO0FBQVM7QUFDTHJLLFVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLG9EQUFkO0FBQ0F5RixVQUFBQSxVQUFVLENBQUN0RixJQUFYLEdBQWtCbUssdUJBQWVDLEtBQWpDO0FBQ0E5RSxVQUFBQSxVQUFVLENBQUNnQyxRQUFYLEdBQXNCOVQsRUFBRSxDQUFDNlcsVUFBekI7QUFDSDtBQXpGTDtBQTJGSDs7QUFFTSxXQUFTcUQsNkJBQVQsQ0FBd0NoSCxNQUF4QyxFQUE2RHhELGNBQTdELEVBQW1HO0FBQ3RHLFFBQUksQ0FBQ0EsY0FBYyxDQUFDeUssZ0JBQWYsQ0FBZ0NoSyxNQUFqQyxJQUEyQyxDQUFDVCxjQUFjLENBQUMwSyxzQkFBL0QsRUFBdUY7QUFBRTtBQUFTLEtBREksQ0FDSDs7O0FBRW5HLFFBQU1wYSxFQUFFLEdBQUdrVCxNQUFNLENBQUNsVCxFQUFsQjtBQUNBLFFBQU1xYSxXQUFxQixHQUFHLEVBQTlCO0FBRUEsUUFBTUMsYUFBYSxHQUFHdGEsRUFBRSxDQUFDdWEsaUJBQUgsRUFBdEI7O0FBQ0EsUUFBSUQsYUFBSixFQUFtQjtBQUNmNUssTUFBQUEsY0FBYyxDQUFDNEssYUFBZixHQUErQkEsYUFBL0I7O0FBRUEsVUFBSXBILE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQmtILGFBQWxCLEtBQW9DNUssY0FBYyxDQUFDNEssYUFBdkQsRUFBc0U7QUFDbEV0YSxRQUFBQSxFQUFFLENBQUN3YSxlQUFILENBQW1CeGEsRUFBRSxDQUFDeWEsV0FBdEIsRUFBbUMvSyxjQUFjLENBQUM0SyxhQUFsRDtBQUNIOztBQUVELFdBQUssSUFBSWpDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUczSSxjQUFjLENBQUN5SyxnQkFBZixDQUFnQ2hLLE1BQXBELEVBQTRELEVBQUVrSSxDQUE5RCxFQUFpRTtBQUU3RCxZQUFNdkcsVUFBVSxHQUFHcEMsY0FBYyxDQUFDeUssZ0JBQWYsQ0FBZ0M5QixDQUFoQyxDQUFuQjs7QUFDQSxZQUFJdkcsVUFBSixFQUFnQjtBQUNaLGNBQUlBLFVBQVUsQ0FBQ2dHLFNBQWYsRUFBMEI7QUFDdEI5WCxZQUFBQSxFQUFFLENBQUMwYSxvQkFBSCxDQUNJMWEsRUFBRSxDQUFDeWEsV0FEUCxFQUVJemEsRUFBRSxDQUFDMmEsaUJBQUgsR0FBdUJ0QyxDQUYzQixFQUdJdkcsVUFBVSxDQUFDZ0MsUUFIZixFQUlJaEMsVUFBVSxDQUFDZ0csU0FKZixFQUtJLENBTEosRUFEc0IsQ0FNZDtBQUNYLFdBUEQsTUFPTztBQUNIOVgsWUFBQUEsRUFBRSxDQUFDNGEsdUJBQUgsQ0FDSTVhLEVBQUUsQ0FBQ3lhLFdBRFAsRUFFSXphLEVBQUUsQ0FBQzJhLGlCQUFILEdBQXVCdEMsQ0FGM0IsRUFHSXJZLEVBQUUsQ0FBQ3dYLFlBSFAsRUFJSTFGLFVBQVUsQ0FBQ3VGLGNBSmY7QUFNSDs7QUFFRGdELFVBQUFBLFdBQVcsQ0FBQ3hFLElBQVosQ0FBaUI3VixFQUFFLENBQUMyYSxpQkFBSCxHQUF1QnRDLENBQXhDO0FBQ0g7QUFDSjs7QUFFRCxVQUFNd0MsR0FBRyxHQUFHbkwsY0FBYyxDQUFDMEssc0JBQTNCOztBQUNBLFVBQUlTLEdBQUosRUFBUztBQUNMLFlBQU1DLFlBQVksR0FBRzNELHVCQUFlMEQsR0FBRyxDQUFDOWEsTUFBbkIsRUFBMkJnYixVQUEzQixHQUF3Qy9hLEVBQUUsQ0FBQ2diLHdCQUEzQyxHQUFzRWhiLEVBQUUsQ0FBQ2liLGdCQUE5Rjs7QUFDQSxZQUFJSixHQUFHLENBQUMvQyxTQUFSLEVBQW1CO0FBQ2Y5WCxVQUFBQSxFQUFFLENBQUMwYSxvQkFBSCxDQUNJMWEsRUFBRSxDQUFDeWEsV0FEUCxFQUVJSyxZQUZKLEVBR0lELEdBQUcsQ0FBQy9HLFFBSFIsRUFJSStHLEdBQUcsQ0FBQy9DLFNBSlIsRUFLSSxDQUxKLEVBRGUsQ0FNUDtBQUNYLFNBUEQsTUFPTztBQUNIOVgsVUFBQUEsRUFBRSxDQUFDNGEsdUJBQUgsQ0FDSTVhLEVBQUUsQ0FBQ3lhLFdBRFAsRUFFSUssWUFGSixFQUdJOWEsRUFBRSxDQUFDd1gsWUFIUCxFQUlJcUQsR0FBRyxDQUFDeEQsY0FKUjtBQU1IO0FBQ0o7O0FBRUQsVUFBSW5FLE1BQU0sQ0FBQ2dJLGtCQUFYLEVBQStCO0FBQzNCaEksUUFBQUEsTUFBTSxDQUFDZ0ksa0JBQVAsQ0FBMEJDLGdCQUExQixDQUEyQ2QsV0FBM0M7QUFDSDs7QUFFRCxVQUFNZSxNQUFNLEdBQUdwYixFQUFFLENBQUNxYixzQkFBSCxDQUEwQnJiLEVBQUUsQ0FBQ3lhLFdBQTdCLENBQWY7O0FBQ0EsVUFBSVcsTUFBTSxLQUFLcGIsRUFBRSxDQUFDc2Isb0JBQWxCLEVBQXdDO0FBQ3BDLGdCQUFRRixNQUFSO0FBQ0ksZUFBS3BiLEVBQUUsQ0FBQ3ViLGlDQUFSO0FBQTJDO0FBQ3ZDblAsY0FBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsZ0VBQWQ7QUFDQTtBQUNIOztBQUNELGVBQUtyTSxFQUFFLENBQUN3Yix5Q0FBUjtBQUFtRDtBQUMvQ3BQLGNBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLHdFQUFkO0FBQ0E7QUFDSDs7QUFDRCxlQUFLck0sRUFBRSxDQUFDeWIsaUNBQVI7QUFBMkM7QUFDdkNyUCxjQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxnRUFBZDtBQUNBO0FBQ0g7O0FBQ0QsZUFBS3JNLEVBQUUsQ0FBQzBiLHVCQUFSO0FBQWlDO0FBQzdCdFAsY0FBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsc0RBQWQ7QUFDQTtBQUNIOztBQUNEO0FBakJKO0FBbUJIOztBQUVELFVBQUk2RyxNQUFNLENBQUNFLFVBQVAsQ0FBa0JrSCxhQUFsQixLQUFvQzVLLGNBQWMsQ0FBQzRLLGFBQXZELEVBQXNFO0FBQ2xFdGEsUUFBQUEsRUFBRSxDQUFDd2EsZUFBSCxDQUFtQnhhLEVBQUUsQ0FBQ3lhLFdBQXRCLEVBQW1DdkgsTUFBTSxDQUFDRSxVQUFQLENBQWtCa0gsYUFBckQ7QUFDSDtBQUNKO0FBQ0o7O0FBRU0sV0FBU3FCLDhCQUFULENBQXlDekksTUFBekMsRUFBOER4RCxjQUE5RCxFQUFvRztBQUN2RyxRQUFJQSxjQUFjLENBQUM0SyxhQUFuQixFQUFrQztBQUM5QnBILE1BQUFBLE1BQU0sQ0FBQ2xULEVBQVAsQ0FBVTRiLGlCQUFWLENBQTRCbE0sY0FBYyxDQUFDNEssYUFBM0M7QUFDQTVLLE1BQUFBLGNBQWMsQ0FBQzRLLGFBQWYsR0FBK0IsSUFBL0I7QUFDSDtBQUNKOztBQUVNLFdBQVN1Qix3QkFBVCxDQUFtQzNJLE1BQW5DLEVBQXdENEksU0FBeEQsRUFBb0Y7QUFDdkYsUUFBTTliLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCOztBQUR1RiwrQkFHOUUrYixDQUg4RTtBQUluRixVQUFNQyxRQUFRLEdBQUdGLFNBQVMsQ0FBQ0csU0FBVixDQUFvQkYsQ0FBcEIsQ0FBakI7QUFFQSxVQUFJRyxZQUFvQixHQUFHLENBQTNCO0FBQ0EsVUFBSUMsYUFBYSxHQUFHLEVBQXBCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHLENBQWpCOztBQUVBLGNBQVFKLFFBQVEsQ0FBQ3hQLElBQWpCO0FBQ0ksYUFBSzZQLDhCQUFzQnhJLE1BQTNCO0FBQW1DO0FBQy9Cc0ksWUFBQUEsYUFBYSxHQUFHLGNBQWhCO0FBQ0FELFlBQUFBLFlBQVksR0FBR2xjLEVBQUUsQ0FBQ3NjLGFBQWxCO0FBQ0E7QUFDSDs7QUFDRCxhQUFLRCw4QkFBc0JFLFFBQTNCO0FBQXFDO0FBQ2pDSixZQUFBQSxhQUFhLEdBQUcsZ0JBQWhCO0FBQ0FELFlBQUFBLFlBQVksR0FBR2xjLEVBQUUsQ0FBQ3djLGVBQWxCO0FBQ0E7QUFDSDs7QUFDRDtBQUFTO0FBQ0xwUSxZQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw0QkFBZDtBQUNBO0FBQUE7QUFBQTtBQUNIO0FBZEw7O0FBaUJBLFVBQU1vUSxRQUFRLEdBQUd6YyxFQUFFLENBQUMwYyxZQUFILENBQWdCUixZQUFoQixDQUFqQjs7QUFDQSxVQUFJTyxRQUFKLEVBQWM7QUFDVlQsUUFBQUEsUUFBUSxDQUFDUyxRQUFULEdBQW9CQSxRQUFwQjtBQUNBemMsUUFBQUEsRUFBRSxDQUFDMmMsWUFBSCxDQUFnQlgsUUFBUSxDQUFDUyxRQUF6QixFQUFtQ1QsUUFBUSxDQUFDWSxNQUE1QztBQUNBNWMsUUFBQUEsRUFBRSxDQUFDNmMsYUFBSCxDQUFpQmIsUUFBUSxDQUFDUyxRQUExQjs7QUFFQSxZQUFJLENBQUN6YyxFQUFFLENBQUM4YyxrQkFBSCxDQUFzQmQsUUFBUSxDQUFDUyxRQUEvQixFQUF5Q3pjLEVBQUUsQ0FBQytjLGNBQTVDLENBQUwsRUFBa0U7QUFDOUQzUSxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYzhQLGFBQWEsR0FBRyxRQUFoQixHQUEyQkwsU0FBUyxDQUFDa0IsSUFBckMsR0FBNEMsd0JBQTFEO0FBQ0E1USxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyxxQkFBZCxFQUFxQzJQLFFBQVEsQ0FBQ1ksTUFBVCxDQUFnQkssT0FBaEIsQ0FBd0IsT0FBeEIsRUFBaUM7QUFBQSwrQkFBV2IsVUFBVSxFQUFyQjtBQUFBLFdBQWpDLENBQXJDO0FBQ0FoUSxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBY3JNLEVBQUUsQ0FBQ2tkLGdCQUFILENBQW9CbEIsUUFBUSxDQUFDUyxRQUE3QixDQUFkOztBQUVBLGVBQUssSUFBSVUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3JCLFNBQVMsQ0FBQ0csU0FBVixDQUFvQjlMLE1BQXhDLEVBQWdEZ04sQ0FBQyxFQUFqRCxFQUFxRDtBQUNqRCxnQkFBTUMsS0FBSyxHQUFHdEIsU0FBUyxDQUFDRyxTQUFWLENBQW9CRixDQUFwQixDQUFkOztBQUNBLGdCQUFJcUIsS0FBSyxDQUFDWCxRQUFWLEVBQW9CO0FBQ2hCemMsY0FBQUEsRUFBRSxDQUFDcWQsWUFBSCxDQUFnQkQsS0FBSyxDQUFDWCxRQUF0QjtBQUNBVyxjQUFBQSxLQUFLLENBQUNYLFFBQU4sR0FBaUIsSUFBakI7QUFDSDtBQUNKOztBQUNEO0FBQUE7QUFBQTtBQUNIO0FBQ0o7QUEvQ2tGOztBQUd2RixTQUFLLElBQUlWLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFNBQVMsQ0FBQ0csU0FBVixDQUFvQjlMLE1BQXhDLEVBQWdENEwsQ0FBQyxFQUFqRCxFQUFxRDtBQUFBLHVCQUE1Q0EsQ0FBNEM7O0FBQUE7QUE2Q3BEOztBQUVELFFBQU11QixTQUFTLEdBQUd0ZCxFQUFFLENBQUN1ZCxhQUFILEVBQWxCOztBQUNBLFFBQUksQ0FBQ0QsU0FBTCxFQUFnQjtBQUNaO0FBQ0g7O0FBRUR4QixJQUFBQSxTQUFTLENBQUN3QixTQUFWLEdBQXNCQSxTQUF0QixDQXZEdUYsQ0F5RHZGOztBQUNBLFNBQUssSUFBSXZCLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdELFNBQVMsQ0FBQ0csU0FBVixDQUFvQjlMLE1BQXhDLEVBQWdENEwsRUFBQyxFQUFqRCxFQUFxRDtBQUNqRCxVQUFNQyxRQUFRLEdBQUdGLFNBQVMsQ0FBQ0csU0FBVixDQUFvQkYsRUFBcEIsQ0FBakI7QUFDQS9iLE1BQUFBLEVBQUUsQ0FBQ3dkLFlBQUgsQ0FBZ0IxQixTQUFTLENBQUN3QixTQUExQixFQUFxQ3RCLFFBQVEsQ0FBQ1MsUUFBOUM7QUFDSDs7QUFFRHpjLElBQUFBLEVBQUUsQ0FBQ3lkLFdBQUgsQ0FBZTNCLFNBQVMsQ0FBQ3dCLFNBQXpCLEVBL0R1RixDQWlFdkY7O0FBQ0EsUUFBSXBLLE1BQU0sQ0FBQ3dLLHlCQUFYLEVBQXNDO0FBQ2xDLFdBQUssSUFBSTNCLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdELFNBQVMsQ0FBQ0csU0FBVixDQUFvQjlMLE1BQXhDLEVBQWdENEwsR0FBQyxFQUFqRCxFQUFxRDtBQUNqRCxZQUFNQyxTQUFRLEdBQUdGLFNBQVMsQ0FBQ0csU0FBVixDQUFvQkYsR0FBcEIsQ0FBakI7O0FBQ0EsWUFBSUMsU0FBUSxDQUFDUyxRQUFiLEVBQXVCO0FBQ25CemMsVUFBQUEsRUFBRSxDQUFDMmQsWUFBSCxDQUFnQjdCLFNBQVMsQ0FBQ3dCLFNBQTFCLEVBQXFDdEIsU0FBUSxDQUFDUyxRQUE5QztBQUNBemMsVUFBQUEsRUFBRSxDQUFDcWQsWUFBSCxDQUFnQnJCLFNBQVEsQ0FBQ1MsUUFBekI7QUFDQVQsVUFBQUEsU0FBUSxDQUFDUyxRQUFULEdBQW9CLElBQXBCO0FBQ0g7QUFDSjtBQUNKOztBQUVELFFBQUl6YyxFQUFFLENBQUM0ZCxtQkFBSCxDQUF1QjlCLFNBQVMsQ0FBQ3dCLFNBQWpDLEVBQTRDdGQsRUFBRSxDQUFDNmQsV0FBL0MsQ0FBSixFQUFpRTtBQUM3RHpSLE1BQUFBLE9BQU8sQ0FBQzBSLElBQVIsQ0FBYSxjQUFjaEMsU0FBUyxDQUFDa0IsSUFBeEIsR0FBK0IsMkJBQTVDO0FBQ0gsS0FGRCxNQUVPO0FBQ0g1USxNQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw2QkFBNkJ5UCxTQUFTLENBQUNrQixJQUF2QyxHQUE4QyxLQUE1RDtBQUNBNVEsTUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNyTSxFQUFFLENBQUMrZCxpQkFBSCxDQUFxQmpDLFNBQVMsQ0FBQ3dCLFNBQS9CLENBQWQ7QUFDQTtBQUNILEtBbkZzRixDQXFGdkY7OztBQUNBLFFBQU1VLGlCQUFpQixHQUFHaGUsRUFBRSxDQUFDNGQsbUJBQUgsQ0FBdUI5QixTQUFTLENBQUN3QixTQUFqQyxFQUE0Q3RkLEVBQUUsQ0FBQ2llLGlCQUEvQyxDQUExQjtBQUNBbkMsSUFBQUEsU0FBUyxDQUFDb0MsUUFBVixHQUFxQixJQUFJdkksS0FBSixDQUEwQnFJLGlCQUExQixDQUFyQjs7QUFFQSxTQUFLLElBQUkzRixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMkYsaUJBQXBCLEVBQXVDLEVBQUUzRixDQUF6QyxFQUE0QztBQUN4QyxVQUFNOEYsVUFBVSxHQUFHbmUsRUFBRSxDQUFDb2UsZUFBSCxDQUFtQnRDLFNBQVMsQ0FBQ3dCLFNBQTdCLEVBQXdDakYsQ0FBeEMsQ0FBbkI7O0FBQ0EsVUFBSThGLFVBQUosRUFBZ0I7QUFDWixZQUFJRSxPQUFlLFNBQW5CO0FBQ0EsWUFBTUMsVUFBVSxHQUFHSCxVQUFVLENBQUNuQixJQUFYLENBQWdCdUIsT0FBaEIsQ0FBd0IsR0FBeEIsQ0FBbkI7O0FBQ0EsWUFBSUQsVUFBVSxLQUFLLENBQUMsQ0FBcEIsRUFBdUI7QUFDbkJELFVBQUFBLE9BQU8sR0FBR0YsVUFBVSxDQUFDbkIsSUFBWCxDQUFnQndCLE1BQWhCLENBQXVCLENBQXZCLEVBQTBCRixVQUExQixDQUFWO0FBQ0gsU0FGRCxNQUVPO0FBQ0hELFVBQUFBLE9BQU8sR0FBR0YsVUFBVSxDQUFDbkIsSUFBckI7QUFDSDs7QUFFRCxZQUFNeUIsS0FBSyxHQUFHemUsRUFBRSxDQUFDMGUsaUJBQUgsQ0FBcUI1QyxTQUFTLENBQUN3QixTQUEvQixFQUEwQ2UsT0FBMUMsQ0FBZDtBQUNBLFlBQU03UixJQUFJLEdBQUdtQyxrQkFBa0IsQ0FBQ3dQLFVBQVUsQ0FBQzNSLElBQVosRUFBa0J4TSxFQUFsQixDQUEvQjtBQUNBLFlBQU0yZSxNQUFNLEdBQUc5UCxnQkFBZ0IsQ0FBQ3NQLFVBQVUsQ0FBQzNSLElBQVosRUFBa0J4TSxFQUFsQixDQUEvQjtBQUVBOGIsUUFBQUEsU0FBUyxDQUFDb0MsUUFBVixDQUFtQjdGLENBQW5CLElBQXdCO0FBQ3BCdUcsVUFBQUEsT0FBTyxFQUFFSCxLQURXO0FBRXBCekIsVUFBQUEsSUFBSSxFQUFFcUIsT0FGYztBQUdwQjdSLFVBQUFBLElBQUksRUFBSkEsSUFIb0I7QUFJcEJtUyxVQUFBQSxNQUFNLEVBQU5BLE1BSm9CO0FBS3BCRSxVQUFBQSxLQUFLLEVBQUVWLFVBQVUsQ0FBQ3hNLElBTEU7QUFNcEJBLFVBQUFBLElBQUksRUFBRWdOLE1BQU0sR0FBR1IsVUFBVSxDQUFDeE0sSUFOTjtBQVFwQi9DLFVBQUFBLE1BQU0sRUFBRXVQLFVBQVUsQ0FBQzNSLElBUkM7QUFTcEJpUyxVQUFBQSxLQUFLLEVBQUxBO0FBVG9CLFNBQXhCO0FBV0g7QUFDSixLQXBIc0YsQ0FzSHZGOzs7QUFDQSxRQUFJM0MsU0FBUyxDQUFDZ0QsTUFBVixDQUFpQjNPLE1BQWpCLEdBQTBCLENBQTlCLEVBQWlDO0FBQzdCMkwsTUFBQUEsU0FBUyxDQUFDaUQsUUFBVixHQUFxQixJQUFJcEosS0FBSixDQUFpQ21HLFNBQVMsQ0FBQ2dELE1BQVYsQ0FBaUIzTyxNQUFsRCxDQUFyQjs7QUFDQSxXQUFLLElBQUlrSSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHeUQsU0FBUyxDQUFDZ0QsTUFBVixDQUFpQjNPLE1BQXJDLEVBQTZDLEVBQUVrSSxHQUEvQyxFQUFrRDtBQUM5QyxZQUFNMkcsS0FBSyxHQUFHbEQsU0FBUyxDQUFDZ0QsTUFBVixDQUFpQnpHLEdBQWpCLENBQWQ7QUFFQSxZQUFNNEcsT0FBOEIsR0FBRztBQUNuQ3pKLFVBQUFBLEdBQUcsRUFBRXdKLEtBQUssQ0FBQ3hKLEdBRHdCO0FBRW5Db0osVUFBQUEsT0FBTyxFQUFFSSxLQUFLLENBQUNKLE9BRm9CO0FBR25DNUIsVUFBQUEsSUFBSSxFQUFFZ0MsS0FBSyxDQUFDaEMsSUFIdUI7QUFJbkNyTCxVQUFBQSxJQUFJLEVBQUUsQ0FKNkI7QUFLbkN1TixVQUFBQSxVQUFVLEVBQUUsSUFBSXZKLEtBQUosQ0FBNEJxSixLQUFLLENBQUNHLE9BQU4sQ0FBY2hQLE1BQTFDLENBTHVCO0FBTW5DaVAsVUFBQUEsZ0JBQWdCLEVBQUU7QUFOaUIsU0FBdkM7QUFTQXRELFFBQUFBLFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUIxRyxHQUFuQixJQUF3QjRHLE9BQXhCOztBQUVBLGFBQUssSUFBSUksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsS0FBSyxDQUFDRyxPQUFOLENBQWNoUCxNQUFsQyxFQUEwQyxFQUFFa1AsQ0FBNUMsRUFBK0M7QUFDM0MsY0FBTUMsT0FBTyxHQUFHTixLQUFLLENBQUNHLE9BQU4sQ0FBY0UsQ0FBZCxDQUFoQjtBQUNBLGNBQU16USxNQUFNLEdBQUdyQyxrQkFBa0IsQ0FBQytTLE9BQU8sQ0FBQzlTLElBQVQsRUFBZXhNLEVBQWYsQ0FBakM7QUFDQSxjQUFNdWYsSUFBSSxHQUFHL1EsdUJBQXVCLENBQUM4USxPQUFPLENBQUM5UyxJQUFULENBQXBDOztBQUNBLGNBQU1tUyxPQUFNLEdBQUc5UCxnQkFBZ0IsQ0FBQ0QsTUFBRCxFQUFTNU8sRUFBVCxDQUEvQjs7QUFDQSxjQUFNMlIsSUFBSSxHQUFHZ04sT0FBTSxHQUFHVyxPQUFPLENBQUNULEtBQTlCO0FBQ0EsY0FBTVcsS0FBSyxHQUFHUCxPQUFPLENBQUN0TixJQUFSLEdBQWUsQ0FBN0I7QUFDQSxjQUFNa04sS0FBSyxHQUFHbE4sSUFBSSxHQUFHLENBQXJCO0FBQ0EsY0FBTThOLEtBQUssR0FBRyxJQUFJRixJQUFKLENBQVNWLEtBQVQsQ0FBZDtBQUVBSSxVQUFBQSxPQUFPLENBQUNDLFVBQVIsQ0FBbUJHLENBQW5CLElBQXdCO0FBQ3BCVCxZQUFBQSxPQUFPLEVBQUUsQ0FBQyxDQURVO0FBRXBCNUIsWUFBQUEsSUFBSSxFQUFFc0MsT0FBTyxDQUFDdEMsSUFGTTtBQUdwQnhRLFlBQUFBLElBQUksRUFBRThTLE9BQU8sQ0FBQzlTLElBSE07QUFJcEJtUyxZQUFBQSxNQUFNLEVBQU5BLE9BSm9CO0FBS3BCRSxZQUFBQSxLQUFLLEVBQUVTLE9BQU8sQ0FBQ1QsS0FMSztBQU1wQmxOLFlBQUFBLElBQUksRUFBSkEsSUFOb0I7QUFPcEJELFlBQUFBLE1BQU0sRUFBRXVOLE9BQU8sQ0FBQ3ROLElBUEk7QUFTcEIvQyxZQUFBQSxNQUFNLEVBQU5BLE1BVG9CO0FBVXBCNlAsWUFBQUEsS0FBSyxFQUFFLENBQUMsQ0FWWTtBQVdwQmdCLFlBQUFBLEtBQUssRUFBTEEsS0FYb0I7QUFZcEJELFlBQUFBLEtBQUssRUFBTEE7QUFab0IsV0FBeEI7QUFlQVAsVUFBQUEsT0FBTyxDQUFDdE4sSUFBUixJQUFnQkEsSUFBaEI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJIO0FBQ0osS0E3THNGLENBK0x2Rjs7O0FBQ0EsUUFBSW1LLFNBQVMsQ0FBQzRELFFBQVYsQ0FBbUJ2UCxNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUMvQjJMLE1BQUFBLFNBQVMsQ0FBQzZELFVBQVYsR0FBdUIsSUFBSWhLLEtBQUosQ0FBbUNtRyxTQUFTLENBQUM0RCxRQUFWLENBQW1CdlAsTUFBdEQsQ0FBdkI7O0FBRUEsV0FBSyxJQUFJa0ksR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR3lELFNBQVMsQ0FBQzRELFFBQVYsQ0FBbUJ2UCxNQUF2QyxFQUErQyxFQUFFa0ksR0FBakQsRUFBb0Q7QUFDaEQsWUFBTXVILE9BQU8sR0FBRzlELFNBQVMsQ0FBQzRELFFBQVYsQ0FBbUJySCxHQUFuQixDQUFoQjtBQUNBeUQsUUFBQUEsU0FBUyxDQUFDNkQsVUFBVixDQUFxQnRILEdBQXJCLElBQTBCO0FBQ3RCN0MsVUFBQUEsR0FBRyxFQUFFb0ssT0FBTyxDQUFDcEssR0FEUztBQUV0Qm9KLFVBQUFBLE9BQU8sRUFBRWdCLE9BQU8sQ0FBQ2hCLE9BRks7QUFHdEI1QixVQUFBQSxJQUFJLEVBQUU0QyxPQUFPLENBQUM1QyxJQUhRO0FBSXRCeFEsVUFBQUEsSUFBSSxFQUFFb1QsT0FBTyxDQUFDcFQsSUFKUTtBQUt0QnFTLFVBQUFBLEtBQUssRUFBRWUsT0FBTyxDQUFDZixLQUxPO0FBTXRCZ0IsVUFBQUEsS0FBSyxFQUFFLEVBTmU7QUFPdEJDLFVBQUFBLE9BQU8sRUFBRSxJQVBhO0FBUXRCbFIsVUFBQUEsTUFBTSxFQUFFckMsa0JBQWtCLENBQUNxVCxPQUFPLENBQUNwVCxJQUFULEVBQWV4TSxFQUFmLENBUko7QUFTdEJ5ZSxVQUFBQSxLQUFLLEVBQUU7QUFUZSxTQUExQjtBQVdIO0FBQ0osS0FqTnNGLENBbU52Rjs7O0FBQ0EsUUFBTXNCLGtCQUFrQixHQUFHL2YsRUFBRSxDQUFDNGQsbUJBQUgsQ0FBdUI5QixTQUFTLENBQUN3QixTQUFqQyxFQUE0Q3RkLEVBQUUsQ0FBQ2dnQixlQUEvQyxDQUEzQjs7QUFFQSxTQUFLLElBQUkzSCxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHMEgsa0JBQXBCLEVBQXdDLEVBQUUxSCxHQUExQyxFQUE2QztBQUN6QyxVQUFNNEgsV0FBVyxHQUFHamdCLEVBQUUsQ0FBQ2tnQixnQkFBSCxDQUFvQnBFLFNBQVMsQ0FBQ3dCLFNBQTlCLEVBQXlDakYsR0FBekMsQ0FBcEI7O0FBQ0EsVUFBSTRILFdBQUosRUFBaUI7QUFDYixZQUFNRSxTQUFTLEdBQUlGLFdBQVcsQ0FBQ3pULElBQVosS0FBcUJ4TSxFQUFFLENBQUNxTyxVQUF6QixJQUNiNFIsV0FBVyxDQUFDelQsSUFBWixLQUFxQnhNLEVBQUUsQ0FBQ3NPLFlBRDdCOztBQUdBLFlBQUksQ0FBQzZSLFNBQUwsRUFBZ0I7QUFFWixjQUFNMUIsTUFBSyxHQUFHemUsRUFBRSxDQUFDb2dCLGtCQUFILENBQXNCdEUsU0FBUyxDQUFDd0IsU0FBaEMsRUFBMkMyQyxXQUFXLENBQUNqRCxJQUF2RCxDQUFkOztBQUNBLGNBQUl5QixNQUFLLEtBQUssSUFBZCxFQUFvQjtBQUNoQixnQkFBSUosUUFBZSxTQUFuQjs7QUFDQSxnQkFBTUMsV0FBVSxHQUFHMkIsV0FBVyxDQUFDakQsSUFBWixDQUFpQnVCLE9BQWpCLENBQXlCLEdBQXpCLENBQW5COztBQUNBLGdCQUFJRCxXQUFVLEtBQUssQ0FBQyxDQUFwQixFQUF1QjtBQUNuQkQsY0FBQUEsUUFBTyxHQUFHNEIsV0FBVyxDQUFDakQsSUFBWixDQUFpQndCLE1BQWpCLENBQXdCLENBQXhCLEVBQTJCRixXQUEzQixDQUFWO0FBQ0gsYUFGRCxNQUVPO0FBQ0hELGNBQUFBLFFBQU8sR0FBRzRCLFdBQVcsQ0FBQ2pELElBQXRCO0FBQ0gsYUFQZSxDQVNoQjtBQUVBOzs7QUFDQSxpQkFBSyxJQUFJcUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3ZFLFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUI1TyxNQUF2QyxFQUErQ2tRLENBQUMsRUFBaEQsRUFBb0Q7QUFDaEQsa0JBQU1wQixRQUFPLEdBQUduRCxTQUFTLENBQUNpRCxRQUFWLENBQW1Cc0IsQ0FBbkIsQ0FBaEI7O0FBRUEsbUJBQUssSUFBSXRFLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdrRCxRQUFPLENBQUNDLFVBQVIsQ0FBbUIvTyxNQUF2QyxFQUErQzRMLEdBQUMsRUFBaEQsRUFBb0Q7QUFDaEQsb0JBQU11RSxTQUFTLEdBQUdyQixRQUFPLENBQUNDLFVBQVIsQ0FBbUJuRCxHQUFuQixDQUFsQjs7QUFDQSxvQkFBSXVFLFNBQVMsQ0FBQ3RELElBQVYsS0FBbUJxQixRQUF2QixFQUFnQztBQUM1QjtBQUVBaUMsa0JBQUFBLFNBQVMsQ0FBQzdCLEtBQVYsR0FBa0JBLE1BQWxCOztBQUNBUSxrQkFBQUEsUUFBTyxDQUFDRyxnQkFBUixDQUF5QnZKLElBQXpCLENBQThCeUssU0FBOUI7O0FBRUE7QUFDSDtBQUNKO0FBQ0osYUExQmUsQ0EwQmQ7O0FBQ0w7QUFDSjtBQUNKO0FBQ0osS0E3UHNGLENBNlByRjtBQUVGOzs7QUFDQSxRQUFNQyxnQkFBMkMsR0FBRyxFQUFwRDtBQUNBLFFBQU1DLHdCQUFnRCxHQUFHLEVBQXpEO0FBQ0EsUUFBTUMsa0JBQWtCLEdBQUd2TixNQUFNLENBQUN1TixrQkFBbEM7QUFDQSxRQUFNQyxlQUFlLEdBQUd4TixNQUFNLENBQUNFLFVBQVAsQ0FBa0JzTixlQUExQztBQUVBLFFBQUlDLHFCQUFxQixHQUFHLENBQTVCOztBQUNBLFNBQUssSUFBSXRJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd5RCxTQUFTLENBQUNnRCxNQUFWLENBQWlCM08sTUFBckMsRUFBNkMsRUFBRWtJLElBQS9DLEVBQWtEO0FBQzlDLFVBQUl5RCxTQUFTLENBQUNnRCxNQUFWLENBQWlCekcsSUFBakIsRUFBb0I3QyxHQUFwQixLQUE0QmlMLGtCQUFrQixDQUFDRyxXQUFuRCxFQUFnRTtBQUM1REQsUUFBQUEscUJBQXFCO0FBQ3hCO0FBQ0o7O0FBRUQsUUFBSUUsV0FBVyxHQUFHLENBQWxCOztBQUNBLFNBQUssSUFBSXhJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd5RCxTQUFTLENBQUM0RCxRQUFWLENBQW1CdlAsTUFBdkMsRUFBK0MsRUFBRWtJLElBQWpELEVBQW9EO0FBQ2hELFVBQU11SCxRQUFPLEdBQUc5RCxTQUFTLENBQUM0RCxRQUFWLENBQW1CckgsSUFBbkIsQ0FBaEI7O0FBQ0EsVUFBTW9HLE9BQUssR0FBR3plLEVBQUUsQ0FBQ29nQixrQkFBSCxDQUFzQnRFLFNBQVMsQ0FBQ3dCLFNBQWhDLEVBQTJDc0MsUUFBTyxDQUFDNUMsSUFBbkQsQ0FBZDs7QUFDQSxVQUFJeUIsT0FBSixFQUFXO0FBQ1A4QixRQUFBQSxnQkFBZ0IsQ0FBQzFLLElBQWpCLENBQXNCaUcsU0FBUyxDQUFDNkQsVUFBVixDQUFxQnRILElBQXJCLENBQXRCO0FBQ0FtSSxRQUFBQSx3QkFBd0IsQ0FBQzNLLElBQXpCLENBQThCNEksT0FBOUI7QUFDSDs7QUFDRCxVQUFJaUMsZUFBZSxDQUFDZCxRQUFPLENBQUM1QyxJQUFULENBQWYsS0FBa0M4RCxTQUF0QyxFQUFpRDtBQUM3QyxZQUFJbEMsT0FBTyxHQUFHZ0IsUUFBTyxDQUFDaEIsT0FBUixHQUFrQjZCLGtCQUFrQixDQUFDTSxjQUFuQixDQUFrQ25CLFFBQU8sQ0FBQ3BLLEdBQTFDLENBQWxCLEdBQW1FcUwsV0FBakY7QUFDQSxZQUFJakIsUUFBTyxDQUFDcEssR0FBUixLQUFnQmlMLGtCQUFrQixDQUFDRyxXQUF2QyxFQUFvRGhDLE9BQU8sSUFBSStCLHFCQUFYO0FBQ3BERCxRQUFBQSxlQUFlLENBQUNkLFFBQU8sQ0FBQzVDLElBQVQsQ0FBZixHQUFnQzRCLE9BQU8sR0FBRzFMLE1BQU0sQ0FBQzhOLGVBQWpEO0FBQ0FILFFBQUFBLFdBQVcsSUFBSWpCLFFBQU8sQ0FBQ2YsS0FBUixHQUFnQixDQUEvQjtBQUNIO0FBQ0o7O0FBRUQsUUFBSTBCLGdCQUFnQixDQUFDcFEsTUFBckIsRUFBNkI7QUFDekIsVUFBTThRLFlBQXVCLEdBQUcsRUFBaEMsQ0FEeUIsQ0FFekI7O0FBQ0EsV0FBSyxJQUFJNUksSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR2tJLGdCQUFnQixDQUFDcFEsTUFBckMsRUFBNkMsRUFBRWtJLElBQS9DLEVBQWtEO0FBQzlDLFlBQU02SSxTQUFTLEdBQUdYLGdCQUFnQixDQUFDbEksSUFBRCxDQUFsQztBQUVBLFlBQUk4SSxVQUFVLEdBQUdULGVBQWUsQ0FBQ1EsU0FBUyxDQUFDbEUsSUFBWCxDQUFoQzs7QUFDQSxZQUFJbUUsVUFBVSxLQUFLTCxTQUFuQixFQUE4QjtBQUMxQkksVUFBQUEsU0FBUyxDQUFDekMsS0FBVixHQUFrQitCLHdCQUF3QixDQUFDbkksSUFBRCxDQUExQzs7QUFDQSxlQUFLLElBQUkrSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixTQUFTLENBQUNyQyxLQUE5QixFQUFxQyxFQUFFdUMsQ0FBdkMsRUFBMEM7QUFDdEMsbUJBQU9ILFlBQVksQ0FBQ0UsVUFBRCxDQUFuQixFQUFpQztBQUM3QkEsY0FBQUEsVUFBVSxHQUFHLENBQUNBLFVBQVUsR0FBRyxDQUFkLElBQW1Cak8sTUFBTSxDQUFDOE4sZUFBdkM7QUFDSDs7QUFDREUsWUFBQUEsU0FBUyxDQUFDckIsS0FBVixDQUFnQmhLLElBQWhCLENBQXFCc0wsVUFBckI7QUFDQUYsWUFBQUEsWUFBWSxDQUFDRSxVQUFELENBQVosR0FBMkIsSUFBM0I7QUFDSDtBQUNKO0FBQ0osT0FqQndCLENBa0J6Qjs7O0FBQ0EsVUFBSUUsT0FBTyxHQUFHLENBQWQ7O0FBQ0EsV0FBSyxJQUFJaEosSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR2tJLGdCQUFnQixDQUFDcFEsTUFBckMsRUFBNkMsRUFBRWtJLElBQS9DLEVBQWtEO0FBQzlDLFlBQU02SSxVQUFTLEdBQUdYLGdCQUFnQixDQUFDbEksSUFBRCxDQUFsQzs7QUFFQSxZQUFJLENBQUM2SSxVQUFTLENBQUN6QyxLQUFmLEVBQXNCO0FBQ2xCeUMsVUFBQUEsVUFBUyxDQUFDekMsS0FBVixHQUFrQitCLHdCQUF3QixDQUFDbkksSUFBRCxDQUExQzs7QUFDQSxlQUFLLElBQUkrSSxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHRixVQUFTLENBQUNyQyxLQUE5QixFQUFxQyxFQUFFdUMsRUFBdkMsRUFBMEM7QUFDdEMsbUJBQU9ILFlBQVksQ0FBQ0ksT0FBRCxDQUFuQixFQUE4QjtBQUMxQkEsY0FBQUEsT0FBTyxHQUFHLENBQUNBLE9BQU8sR0FBRyxDQUFYLElBQWdCbk8sTUFBTSxDQUFDOE4sZUFBakM7QUFDSDs7QUFDRCxnQkFBSU4sZUFBZSxDQUFDUSxVQUFTLENBQUNsRSxJQUFYLENBQWYsS0FBb0M4RCxTQUF4QyxFQUFtRDtBQUMvQ0osY0FBQUEsZUFBZSxDQUFDUSxVQUFTLENBQUNsRSxJQUFYLENBQWYsR0FBa0NxRSxPQUFsQztBQUNIOztBQUNESCxZQUFBQSxVQUFTLENBQUNyQixLQUFWLENBQWdCaEssSUFBaEIsQ0FBcUJ3TCxPQUFyQjs7QUFDQUosWUFBQUEsWUFBWSxDQUFDSSxPQUFELENBQVosR0FBd0IsSUFBeEI7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsVUFBSW5PLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQmtLLFNBQWxCLEtBQWdDeEIsU0FBUyxDQUFDd0IsU0FBOUMsRUFBeUQ7QUFDckR0ZCxRQUFBQSxFQUFFLENBQUNzaEIsVUFBSCxDQUFjeEYsU0FBUyxDQUFDd0IsU0FBeEI7QUFDSDs7QUFFRCxXQUFLLElBQUlqRixJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHa0ksZ0JBQWdCLENBQUNwUSxNQUFyQyxFQUE2Q2tJLElBQUMsRUFBOUMsRUFBa0Q7QUFDOUMsWUFBTTZJLFdBQVMsR0FBR1gsZ0JBQWdCLENBQUNsSSxJQUFELENBQWxDO0FBQ0E2SSxRQUFBQSxXQUFTLENBQUNwQixPQUFWLEdBQW9CLElBQUlyUixVQUFKLENBQWV5UyxXQUFTLENBQUNyQixLQUF6QixDQUFwQjtBQUNBN2YsUUFBQUEsRUFBRSxDQUFDdWhCLFVBQUgsQ0FBY0wsV0FBUyxDQUFDekMsS0FBeEIsRUFBK0J5QyxXQUFTLENBQUNwQixPQUF6QztBQUNIOztBQUVELFVBQUk1TSxNQUFNLENBQUNFLFVBQVAsQ0FBa0JrSyxTQUFsQixLQUFnQ3hCLFNBQVMsQ0FBQ3dCLFNBQTlDLEVBQXlEO0FBQ3JEdGQsUUFBQUEsRUFBRSxDQUFDc2hCLFVBQUgsQ0FBY3BPLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQmtLLFNBQWhDO0FBQ0g7QUFDSixLQS9Vc0YsQ0FpVnZGOzs7QUFDQSxTQUFLLElBQUlqRixJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHeUQsU0FBUyxDQUFDaUQsUUFBVixDQUFtQjVPLE1BQXZDLEdBQWdEO0FBQzVDLFVBQUkyTCxTQUFTLENBQUNpRCxRQUFWLENBQW1CMUcsSUFBbkIsRUFBc0IrRyxnQkFBdEIsQ0FBdUNqUCxNQUEzQyxFQUFtRDtBQUMvQ2tJLFFBQUFBLElBQUM7QUFDSixPQUZELE1BRU87QUFDSHlELFFBQUFBLFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUIxRyxJQUFuQixJQUF3QnlELFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUJqRCxTQUFTLENBQUNpRCxRQUFWLENBQW1CNU8sTUFBbkIsR0FBNEIsQ0FBL0MsQ0FBeEI7QUFDQTJMLFFBQUFBLFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUI1TyxNQUFuQjtBQUNIO0FBQ0o7O0FBRUQyTCxJQUFBQSxTQUFTLENBQUM2RCxVQUFWLEdBQXVCWSxnQkFBdkI7QUFDSDs7QUFFTSxXQUFTaUIseUJBQVQsQ0FBb0N0TyxNQUFwQyxFQUF5RDRJLFNBQXpELEVBQXFGO0FBQ3hGLFFBQUlBLFNBQVMsQ0FBQ3dCLFNBQWQsRUFBeUI7QUFDckIsVUFBTXRkLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCOztBQUNBLFVBQUksQ0FBQ2tULE1BQU0sQ0FBQ3dLLHlCQUFaLEVBQXVDO0FBQ25DLGFBQUssSUFBSTNCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFNBQVMsQ0FBQ0csU0FBVixDQUFvQjlMLE1BQXhDLEVBQWdENEwsQ0FBQyxFQUFqRCxFQUFxRDtBQUNqRCxjQUFNQyxRQUFRLEdBQUdGLFNBQVMsQ0FBQ0csU0FBVixDQUFvQkYsQ0FBcEIsQ0FBakI7O0FBQ0EsY0FBSUMsUUFBUSxDQUFDUyxRQUFiLEVBQXVCO0FBQ25CemMsWUFBQUEsRUFBRSxDQUFDMmQsWUFBSCxDQUFnQjdCLFNBQVMsQ0FBQ3dCLFNBQTFCLEVBQXFDdEIsUUFBUSxDQUFDUyxRQUE5QztBQUNBemMsWUFBQUEsRUFBRSxDQUFDcWQsWUFBSCxDQUFnQnJCLFFBQVEsQ0FBQ1MsUUFBekI7QUFDQVQsWUFBQUEsUUFBUSxDQUFDUyxRQUFULEdBQW9CLElBQXBCO0FBQ0g7QUFDSjtBQUNKOztBQUNEemMsTUFBQUEsRUFBRSxDQUFDeWhCLGFBQUgsQ0FBaUIzRixTQUFTLENBQUN3QixTQUEzQjtBQUNBeEIsTUFBQUEsU0FBUyxDQUFDd0IsU0FBVixHQUFzQixJQUF0QjtBQUNIO0FBQ0o7O0FBRU0sV0FBU29FLCtCQUFULENBQTBDeE8sTUFBMUMsRUFBK0QzQyxpQkFBL0QsRUFBMkc7QUFFOUcsUUFBTXZRLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCO0FBRUF1USxJQUFBQSxpQkFBaUIsQ0FBQ29SLFNBQWxCLEdBQThCLElBQUloTSxLQUFKLENBQXdCcEYsaUJBQWlCLENBQUNxUixVQUFsQixDQUE2QnpSLE1BQXJELENBQTlCO0FBRUEsUUFBTTBSLE9BQU8sR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQWhCOztBQUVBLFNBQUssSUFBSXhKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUc5SCxpQkFBaUIsQ0FBQ3FSLFVBQWxCLENBQTZCelIsTUFBakQsRUFBeUQsRUFBRWtJLENBQTNELEVBQThEO0FBQzFELFVBQU15SixNQUFNLEdBQUd2UixpQkFBaUIsQ0FBQ3FSLFVBQWxCLENBQTZCdkosQ0FBN0IsQ0FBZjtBQUVBLFVBQU0wSixNQUFNLEdBQUdELE1BQU0sQ0FBQ0MsTUFBUCxLQUFrQmpCLFNBQWxCLEdBQThCZ0IsTUFBTSxDQUFDQyxNQUFyQyxHQUE4QyxDQUE3RDtBQUVBLFVBQU12USxTQUFTLEdBQUdqQixpQkFBaUIsQ0FBQ3lSLGdCQUFsQixDQUFtQ0QsTUFBbkMsQ0FBbEI7QUFFQSxVQUFNblQsTUFBTSxHQUFHOU8sb0JBQW9CLENBQUNnaUIsTUFBTSxDQUFDL2hCLE1BQVIsRUFBZ0JDLEVBQWhCLENBQW5DO0FBQ0EsVUFBTTJSLElBQUksR0FBR3dGLHVCQUFlMkssTUFBTSxDQUFDL2hCLE1BQXRCLEVBQThCNFIsSUFBM0M7QUFFQXBCLE1BQUFBLGlCQUFpQixDQUFDb1IsU0FBbEIsQ0FBNEJ0SixDQUE1QixJQUFpQztBQUM3QjJFLFFBQUFBLElBQUksRUFBRThFLE1BQU0sQ0FBQzlFLElBRGdCO0FBRTdCaEosUUFBQUEsUUFBUSxFQUFFeEMsU0FBUyxDQUFDd0MsUUFGUztBQUc3QnBGLFFBQUFBLE1BQU0sRUFBTkEsTUFINkI7QUFJN0IrQyxRQUFBQSxJQUFJLEVBQUpBLElBSjZCO0FBSzdCa04sUUFBQUEsS0FBSyxFQUFFMUgsdUJBQWUySyxNQUFNLENBQUMvaEIsTUFBdEIsRUFBOEI4ZSxLQUxSO0FBTTdCRixRQUFBQSxNQUFNLEVBQUVuTixTQUFTLENBQUNtTixNQU5XO0FBTzdCc0QsUUFBQUEsY0FBYyxFQUFFblQsc0JBQXNCLENBQUNGLE1BQUQsRUFBUzVPLEVBQVQsQ0FQVDtBQVE3QmtpQixRQUFBQSxZQUFZLEVBQUdKLE1BQU0sQ0FBQ0ksWUFBUCxLQUF3QnBCLFNBQXhCLEdBQW9DZ0IsTUFBTSxDQUFDSSxZQUEzQyxHQUEwRCxLQVI1QztBQVM3QkMsUUFBQUEsV0FBVyxFQUFHTCxNQUFNLENBQUNLLFdBQVAsS0FBdUJyQixTQUF2QixHQUFtQ2dCLE1BQU0sQ0FBQ0ssV0FBMUMsR0FBd0QsS0FUekM7QUFVN0J6USxRQUFBQSxNQUFNLEVBQUVtUSxPQUFPLENBQUNFLE1BQUQ7QUFWYyxPQUFqQztBQWFBRixNQUFBQSxPQUFPLENBQUNFLE1BQUQsQ0FBUCxJQUFtQnBRLElBQW5CO0FBQ0g7QUFDSjs7QUFFTSxXQUFTeVEsaUNBQVQsQ0FBNENsUCxNQUE1QyxFQUFpRTNDLGlCQUFqRSxFQUE2RztBQUNoSCxRQUFNOFIsRUFBRSxHQUFHOVIsaUJBQWlCLENBQUMrUixNQUFsQixDQUF5QkMsTUFBekIsRUFBWDtBQUNBLFFBQUlDLEdBQUcsR0FBR0gsRUFBRSxDQUFDSSxJQUFILEVBQVY7O0FBQ0EsV0FBTyxDQUFDRCxHQUFHLENBQUNFLElBQVosRUFBa0I7QUFDZHhQLE1BQUFBLE1BQU0sQ0FBQ2tCLHVCQUFQLENBQWdDdU8sb0JBQWhDLENBQXFESCxHQUFHLENBQUNJLEtBQXpEO0FBQ0FKLE1BQUFBLEdBQUcsR0FBR0gsRUFBRSxDQUFDSSxJQUFILEVBQU47QUFDSDs7QUFDRGxTLElBQUFBLGlCQUFpQixDQUFDK1IsTUFBbEIsQ0FBeUIxUCxLQUF6QjtBQUNIOztBQVFELE1BQU0wQixhQUErQixHQUFHO0FBQ3BDaEUsSUFBQUEsZ0JBQWdCLEVBQUUsSUFEa0I7QUFFcENDLElBQUFBLGlCQUFpQixFQUFFLElBRmlCO0FBR3BDc1MsSUFBQUEsU0FBUyxFQUFFLEtBSHlCO0FBSXBDQyxJQUFBQSxXQUFXLEVBQUU7QUFKdUIsR0FBeEM7O0FBT08sV0FBU0MsMkJBQVQsQ0FDSDdQLE1BREcsRUFFSHpELGFBRkcsRUFHSEMsY0FIRyxFQUlIQyxVQUpHLEVBS0hLLFdBTEcsRUFNSEMsVUFORyxFQU9IQyxZQVBHLEVBT21CO0FBRXRCLFFBQU1sUSxFQUFFLEdBQUdrVCxNQUFNLENBQUNsVCxFQUFsQjtBQUNBLFFBQU1tVCxLQUFLLEdBQUdELE1BQU0sQ0FBQ0UsVUFBckI7QUFDQSxRQUFJNFAsTUFBa0IsR0FBRyxDQUF6Qjs7QUFFQSxRQUFJdFQsY0FBYyxJQUFJRCxhQUF0QixFQUFxQztBQUNqQyxVQUFJMEQsS0FBSyxDQUFDbUgsYUFBTixLQUF3QjVLLGNBQWMsQ0FBQzRLLGFBQTNDLEVBQTBEO0FBQ3REdGEsUUFBQUEsRUFBRSxDQUFDd2EsZUFBSCxDQUFtQnhhLEVBQUUsQ0FBQ3lhLFdBQXRCLEVBQW1DL0ssY0FBYyxDQUFDNEssYUFBbEQ7QUFDQW5ILFFBQUFBLEtBQUssQ0FBQ21ILGFBQU4sR0FBc0I1SyxjQUFjLENBQUM0SyxhQUFyQyxDQUZzRCxDQUd0RDs7QUFDQSxZQUFNdUksU0FBUyxHQUFHLENBQUMsQ0FBQ25ULGNBQWMsQ0FBQzRLLGFBQW5DOztBQUNBLFlBQUl1SSxTQUFTLEtBQUt2TyxhQUFhLENBQUN1TyxTQUFoQyxFQUEyQztBQUN2Q3ZPLFVBQUFBLGFBQWEsQ0FBQ3VPLFNBQWQsR0FBMEJBLFNBQTFCO0FBQ0EsY0FBTUksS0FBSyxHQUFHLENBQUMvUCxNQUFNLENBQUNFLFVBQVAsQ0FBa0I4UCxFQUFsQixDQUFxQkMsY0FBcEM7QUFDQW5qQixVQUFBQSxFQUFFLENBQUNvakIsU0FBSCxDQUFhSCxLQUFLLEdBQUdqakIsRUFBRSxDQUFDcWpCLEdBQU4sR0FBWXJqQixFQUFFLENBQUNzakIsRUFBakM7QUFDQXBRLFVBQUFBLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQjhQLEVBQWxCLENBQXFCQyxjQUFyQixHQUFzQ0YsS0FBdEM7QUFDSDtBQUNKOztBQUVELFVBQUk5UCxLQUFLLENBQUN6QyxRQUFOLENBQWU2UyxJQUFmLEtBQXdCNVQsVUFBVSxDQUFDNlQsQ0FBbkMsSUFDQXJRLEtBQUssQ0FBQ3pDLFFBQU4sQ0FBZStTLEdBQWYsS0FBdUI5VCxVQUFVLENBQUMrVCxDQURsQyxJQUVBdlEsS0FBSyxDQUFDekMsUUFBTixDQUFlOEYsS0FBZixLQUF5QjdHLFVBQVUsQ0FBQzZHLEtBRnBDLElBR0FyRCxLQUFLLENBQUN6QyxRQUFOLENBQWVnRyxNQUFmLEtBQTBCL0csVUFBVSxDQUFDK0csTUFIekMsRUFHaUQ7QUFFN0MxVyxRQUFBQSxFQUFFLENBQUMwUSxRQUFILENBQVlmLFVBQVUsQ0FBQzZULENBQXZCLEVBQTBCN1QsVUFBVSxDQUFDK1QsQ0FBckMsRUFBd0MvVCxVQUFVLENBQUM2RyxLQUFuRCxFQUEwRDdHLFVBQVUsQ0FBQytHLE1BQXJFO0FBRUF2RCxRQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWU2UyxJQUFmLEdBQXNCNVQsVUFBVSxDQUFDNlQsQ0FBakM7QUFDQXJRLFFBQUFBLEtBQUssQ0FBQ3pDLFFBQU4sQ0FBZStTLEdBQWYsR0FBcUI5VCxVQUFVLENBQUMrVCxDQUFoQztBQUNBdlEsUUFBQUEsS0FBSyxDQUFDekMsUUFBTixDQUFlOEYsS0FBZixHQUF1QjdHLFVBQVUsQ0FBQzZHLEtBQWxDO0FBQ0FyRCxRQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWVnRyxNQUFmLEdBQXdCL0csVUFBVSxDQUFDK0csTUFBbkM7QUFDSDs7QUFFRCxVQUFJdkQsS0FBSyxDQUFDd1EsV0FBTixDQUFrQkgsQ0FBbEIsS0FBd0I3VCxVQUFVLENBQUM2VCxDQUFuQyxJQUNBclEsS0FBSyxDQUFDd1EsV0FBTixDQUFrQkQsQ0FBbEIsS0FBd0IvVCxVQUFVLENBQUMrVCxDQURuQyxJQUVBdlEsS0FBSyxDQUFDd1EsV0FBTixDQUFrQm5OLEtBQWxCLEtBQTRCN0csVUFBVSxDQUFDNkcsS0FGdkMsSUFHQXJELEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JqTixNQUFsQixLQUE2Qi9HLFVBQVUsQ0FBQytHLE1BSDVDLEVBR29EO0FBRWhEMVcsUUFBQUEsRUFBRSxDQUFDMlEsT0FBSCxDQUFXaEIsVUFBVSxDQUFDNlQsQ0FBdEIsRUFBeUI3VCxVQUFVLENBQUMrVCxDQUFwQyxFQUF1Qy9ULFVBQVUsQ0FBQzZHLEtBQWxELEVBQXlEN0csVUFBVSxDQUFDK0csTUFBcEU7QUFFQXZELFFBQUFBLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JILENBQWxCLEdBQXNCN1QsVUFBVSxDQUFDNlQsQ0FBakM7QUFDQXJRLFFBQUFBLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JELENBQWxCLEdBQXNCL1QsVUFBVSxDQUFDK1QsQ0FBakM7QUFDQXZRLFFBQUFBLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JuTixLQUFsQixHQUEwQjdHLFVBQVUsQ0FBQzZHLEtBQXJDO0FBQ0FyRCxRQUFBQSxLQUFLLENBQUN3USxXQUFOLENBQWtCak4sTUFBbEIsR0FBMkIvRyxVQUFVLENBQUMrRyxNQUF0QztBQUNILE9BdENnQyxDQXdDakM7OztBQUNBLFVBQUlrTixVQUFVLEdBQUc1VCxXQUFXLENBQUNHLE1BQTdCOztBQUVBLFVBQUksQ0FBQytDLE1BQU0sQ0FBQ2dJLGtCQUFaLEVBQWdDO0FBQzVCMEksUUFBQUEsVUFBVSxHQUFHLENBQWI7QUFDSDs7QUFFRCxXQUFLLElBQUl2RCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHdUQsVUFBcEIsRUFBZ0MsRUFBRXZELENBQWxDLEVBQXFDO0FBQ2pDLFlBQU13RCxlQUFlLEdBQUdwVSxhQUFhLENBQUNxVSxnQkFBZCxDQUErQnpELENBQS9CLENBQXhCOztBQUVBLFlBQUl3RCxlQUFlLENBQUM5akIsTUFBaEIsS0FBMkJFLGtCQUFVc08sT0FBekMsRUFBa0Q7QUFDOUMsa0JBQVFzVixlQUFlLENBQUNFLE1BQXhCO0FBQ0ksaUJBQUtDLGtCQUFVQyxJQUFmO0FBQXFCO0FBQU87O0FBQzVCLGlCQUFLRCxrQkFBVUUsS0FBZjtBQUFzQjtBQUNsQixvQkFBSS9RLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBU0MsT0FBVCxDQUFpQixDQUFqQixFQUFvQkMsY0FBcEIsS0FBdUNDLHFCQUFhQyxHQUF4RCxFQUE2RDtBQUN6RHZrQixrQkFBQUEsRUFBRSxDQUFDd2tCLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLElBQS9CO0FBQ0g7O0FBRUQsb0JBQU1DLFVBQVUsR0FBR3pVLFdBQVcsQ0FBQyxDQUFELENBQTlCO0FBQ0FoUSxnQkFBQUEsRUFBRSxDQUFDeWtCLFVBQUgsQ0FBY0EsVUFBVSxDQUFDakIsQ0FBekIsRUFBNEJpQixVQUFVLENBQUNmLENBQXZDLEVBQTBDZSxVQUFVLENBQUNDLENBQXJELEVBQXdERCxVQUFVLENBQUNsTyxDQUFuRTtBQUNBeU0sZ0JBQUFBLE1BQU0sSUFBSWhqQixFQUFFLENBQUMya0IsZ0JBQWI7QUFDQTtBQUNIOztBQUNELGlCQUFLWCxrQkFBVVksT0FBZjtBQUF3QjtBQUNwQjtBQUNBO0FBQ0E7QUFDSDs7QUFDRDtBQWpCSjtBQW1CSDtBQUNKLE9BdkVnQyxDQXVFL0I7OztBQUVGLFVBQUluVixhQUFhLENBQUNvVixzQkFBbEIsRUFBMEM7QUFFdEMsWUFBSXBWLGFBQWEsQ0FBQ29WLHNCQUFkLENBQXFDOWtCLE1BQXJDLEtBQWdERSxrQkFBVXNPLE9BQTlELEVBQXVFO0FBQ25FLGtCQUFRa0IsYUFBYSxDQUFDb1Ysc0JBQWQsQ0FBcUNDLFdBQTdDO0FBQ0ksaUJBQUtkLGtCQUFVQyxJQUFmO0FBQXFCO0FBQU87O0FBQzVCLGlCQUFLRCxrQkFBVUUsS0FBZjtBQUFzQjtBQUNsQixvQkFBSSxDQUFDL1EsS0FBSyxDQUFDNFIsR0FBTixDQUFVQyxVQUFmLEVBQTJCO0FBQ3ZCaGxCLGtCQUFBQSxFQUFFLENBQUNpbEIsU0FBSCxDQUFhLElBQWI7QUFDSDs7QUFFRGpsQixnQkFBQUEsRUFBRSxDQUFDaVEsVUFBSCxDQUFjQSxVQUFkO0FBRUErUyxnQkFBQUEsTUFBTSxJQUFJaGpCLEVBQUUsQ0FBQ2tsQixnQkFBYjtBQUNBO0FBQ0g7O0FBQ0QsaUJBQUtsQixrQkFBVVksT0FBZjtBQUF3QjtBQUNwQjtBQUNBO0FBQ0E7QUFDSDs7QUFDRDtBQWpCSjs7QUFvQkEsY0FBSXpOLHVCQUFlMUgsYUFBYSxDQUFDb1Ysc0JBQWQsQ0FBcUM5a0IsTUFBcEQsRUFBNERnYixVQUFoRSxFQUE0RTtBQUN4RSxvQkFBUXRMLGFBQWEsQ0FBQ29WLHNCQUFkLENBQXFDTSxhQUE3QztBQUNJLG1CQUFLbkIsa0JBQVVDLElBQWY7QUFBcUI7QUFBTzs7QUFDNUIsbUJBQUtELGtCQUFVRSxLQUFmO0FBQXNCO0FBQ2xCLHNCQUFJLENBQUMvUSxLQUFLLENBQUM0UixHQUFOLENBQVVLLHFCQUFmLEVBQXNDO0FBQ2xDcGxCLG9CQUFBQSxFQUFFLENBQUNxbEIsbUJBQUgsQ0FBdUJybEIsRUFBRSxDQUFDc2xCLEtBQTFCLEVBQWlDLE1BQWpDO0FBQ0g7O0FBRUQsc0JBQUksQ0FBQ25TLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVVEsb0JBQWYsRUFBcUM7QUFDakN2bEIsb0JBQUFBLEVBQUUsQ0FBQ3FsQixtQkFBSCxDQUF1QnJsQixFQUFFLENBQUN3bEIsSUFBMUIsRUFBZ0MsTUFBaEM7QUFDSDs7QUFFRHhsQixrQkFBQUEsRUFBRSxDQUFDa1EsWUFBSCxDQUFnQkEsWUFBaEI7QUFDQThTLGtCQUFBQSxNQUFNLElBQUloakIsRUFBRSxDQUFDeWxCLGtCQUFiO0FBQ0E7QUFDSDs7QUFDRCxtQkFBS3pCLGtCQUFVWSxPQUFmO0FBQXdCO0FBQ3BCO0FBQ0E7QUFDQTtBQUNIOztBQUNEO0FBcEJKO0FBc0JIO0FBQ0o7QUFDSixPQXpIZ0MsQ0F5SC9COztBQUVGOzs7Ozs7O0FBTUEsVUFBSTVCLE1BQUosRUFBWTtBQUNSaGpCLFFBQUFBLEVBQUUsQ0FBQzRTLEtBQUgsQ0FBU29RLE1BQVQ7QUFDSCxPQW5JZ0MsQ0FxSWpDOzs7QUFDQSxVQUFJQSxNQUFNLEdBQUdoakIsRUFBRSxDQUFDMmtCLGdCQUFoQixFQUFrQztBQUU5QixZQUFNSCxTQUFTLEdBQUdyUixLQUFLLENBQUNnUixFQUFOLENBQVNDLE9BQVQsQ0FBaUIsQ0FBakIsRUFBb0JDLGNBQXRDOztBQUNBLFlBQUlHLFNBQVMsS0FBS0YscUJBQWFDLEdBQS9CLEVBQW9DO0FBQ2hDLGNBQU1tQixDQUFDLEdBQUcsQ0FBQ2xCLFNBQVMsR0FBR0YscUJBQWFxQixDQUExQixNQUFpQ3JCLHFCQUFhdlUsSUFBeEQ7QUFDQSxjQUFNNlYsQ0FBQyxHQUFHLENBQUNwQixTQUFTLEdBQUdGLHFCQUFhdUIsQ0FBMUIsTUFBaUN2QixxQkFBYXZVLElBQXhEO0FBQ0EsY0FBTStWLENBQUMsR0FBRyxDQUFDdEIsU0FBUyxHQUFHRixxQkFBYXlCLENBQTFCLE1BQWlDekIscUJBQWF2VSxJQUF4RDtBQUNBLGNBQU1pVyxDQUFDLEdBQUcsQ0FBQ3hCLFNBQVMsR0FBR0YscUJBQWEyQixDQUExQixNQUFpQzNCLHFCQUFhdlUsSUFBeEQ7QUFDQS9QLFVBQUFBLEVBQUUsQ0FBQ3drQixTQUFILENBQWFrQixDQUFiLEVBQWdCRSxDQUFoQixFQUFtQkUsQ0FBbkIsRUFBc0JFLENBQXRCO0FBQ0g7QUFDSjs7QUFFRCxVQUFLaEQsTUFBTSxHQUFHaGpCLEVBQUUsQ0FBQ2tsQixnQkFBYixJQUNBLENBQUMvUixLQUFLLENBQUM0UixHQUFOLENBQVVDLFVBRGYsRUFDMkI7QUFDdkJobEIsUUFBQUEsRUFBRSxDQUFDaWxCLFNBQUgsQ0FBYSxLQUFiO0FBQ0g7O0FBRUQsVUFBSWpDLE1BQU0sR0FBR2hqQixFQUFFLENBQUN5bEIsa0JBQWhCLEVBQW9DO0FBQ2hDLFlBQUksQ0FBQ3RTLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVUsscUJBQWYsRUFBc0M7QUFDbENwbEIsVUFBQUEsRUFBRSxDQUFDcWxCLG1CQUFILENBQXVCcmxCLEVBQUUsQ0FBQ3NsQixLQUExQixFQUFpQyxDQUFqQztBQUNIOztBQUVELFlBQUksQ0FBQ25TLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVVEsb0JBQWYsRUFBcUM7QUFDakN2bEIsVUFBQUEsRUFBRSxDQUFDcWxCLG1CQUFILENBQXVCcmxCLEVBQUUsQ0FBQ3dsQixJQUExQixFQUFnQyxDQUFoQztBQUNIO0FBQ0o7QUFDSixLQXRLcUIsQ0FzS3BCOztBQUNMOztBQUVNLFdBQVNVLHNCQUFULENBQ0hoVCxNQURHLEVBRUg1QyxnQkFGRyxFQUdIQyxpQkFIRyxFQUlIQyxpQkFKRyxFQUtIQyxjQUxHLEVBTUhDLFFBTkcsRUFPSEMsT0FQRyxFQVFIQyxTQVJHLEVBU0hDLFNBVEcsRUFVSEMsY0FWRyxFQVdIQyxXQVhHLEVBWUhDLGdCQVpHLEVBYUhDLGtCQWJHLEVBYWtEO0FBRXJELFFBQU1qUixFQUFFLEdBQUdrVCxNQUFNLENBQUNsVCxFQUFsQjtBQUNBLFFBQU1tVCxLQUFLLEdBQUdELE1BQU0sQ0FBQ0UsVUFBckI7QUFDQSxRQUFNMEksU0FBUyxHQUFHeEwsZ0JBQWdCLElBQUlBLGdCQUFnQixDQUFDd0wsU0FBdkQ7QUFFQSxRQUFJcUssZUFBZSxHQUFHLEtBQXRCO0FBQ0EsUUFBSXROLE9BQUo7QUFDQSxRQUFJRSxPQUFKO0FBQ0EsUUFBSUUsV0FBSixDQVRxRCxDQVdyRDs7QUFDQSxRQUFJM0ksZ0JBQWdCLElBQUlnRSxhQUFhLENBQUNoRSxnQkFBZCxLQUFtQ0EsZ0JBQTNELEVBQTZFO0FBQ3pFZ0UsTUFBQUEsYUFBYSxDQUFDaEUsZ0JBQWQsR0FBaUNBLGdCQUFqQztBQUNBZ0UsTUFBQUEsYUFBYSxDQUFDd08sV0FBZCxHQUE0QnhTLGdCQUFnQixDQUFDd1MsV0FBN0M7O0FBRUEsVUFBSXhTLGdCQUFnQixDQUFDd0wsU0FBckIsRUFBZ0M7QUFFNUIsWUFBTXdCLFNBQVMsR0FBR2hOLGdCQUFnQixDQUFDd0wsU0FBakIsQ0FBMkJ3QixTQUE3Qzs7QUFDQSxZQUFJbkssS0FBSyxDQUFDbUssU0FBTixLQUFvQkEsU0FBeEIsRUFBbUM7QUFDL0J0ZCxVQUFBQSxFQUFFLENBQUNzaEIsVUFBSCxDQUFjaEUsU0FBZDtBQUNBbkssVUFBQUEsS0FBSyxDQUFDbUssU0FBTixHQUFrQkEsU0FBbEI7QUFDQTZJLFVBQUFBLGVBQWUsR0FBRyxJQUFsQjtBQUNIO0FBQ0osT0Fad0UsQ0FjekU7OztBQUNBLFVBQU1qRCxFQUFFLEdBQUc1UyxnQkFBZ0IsQ0FBQzRTLEVBQTVCOztBQUNBLFVBQUlBLEVBQUosRUFBUTtBQUVKLFlBQUkvUCxLQUFLLENBQUMrUCxFQUFOLENBQVNrRCxRQUFULEtBQXNCbEQsRUFBRSxDQUFDa0QsUUFBN0IsRUFBdUM7QUFDbkMsa0JBQVFsRCxFQUFFLENBQUNrRCxRQUFYO0FBQ0ksaUJBQUtDLG9CQUFZdFcsSUFBakI7QUFBdUI7QUFDbkIvUCxnQkFBQUEsRUFBRSxDQUFDc21CLE9BQUgsQ0FBV3RtQixFQUFFLENBQUN1bUIsU0FBZDtBQUNBO0FBQ0g7O0FBQ0QsaUJBQUtGLG9CQUFZZixLQUFqQjtBQUF3QjtBQUNwQnRsQixnQkFBQUEsRUFBRSxDQUFDd21CLE1BQUgsQ0FBVXhtQixFQUFFLENBQUN1bUIsU0FBYjtBQUNBdm1CLGdCQUFBQSxFQUFFLENBQUN5bUIsUUFBSCxDQUFZem1CLEVBQUUsQ0FBQ3NsQixLQUFmO0FBQ0E7QUFDSDs7QUFDRCxpQkFBS2Usb0JBQVliLElBQWpCO0FBQXVCO0FBQ25CeGxCLGdCQUFBQSxFQUFFLENBQUN3bUIsTUFBSCxDQUFVeG1CLEVBQUUsQ0FBQ3VtQixTQUFiO0FBQ0F2bUIsZ0JBQUFBLEVBQUUsQ0FBQ3ltQixRQUFILENBQVl6bUIsRUFBRSxDQUFDd2xCLElBQWY7QUFDQTtBQUNIOztBQUNEO0FBZko7O0FBa0JBclMsVUFBQUEsS0FBSyxDQUFDK1AsRUFBTixDQUFTa0QsUUFBVCxHQUFvQmxELEVBQUUsQ0FBQ2tELFFBQXZCO0FBQ0g7O0FBRUQsWUFBTWpELGNBQWMsR0FBRzdPLGFBQWEsQ0FBQ3VPLFNBQWQsR0FBMEIsQ0FBQ0ssRUFBRSxDQUFDQyxjQUE5QixHQUErQ0QsRUFBRSxDQUFDQyxjQUF6RTs7QUFDQSxZQUFJaFEsS0FBSyxDQUFDK1AsRUFBTixDQUFTQyxjQUFULEtBQTRCQSxjQUFoQyxFQUFnRDtBQUM1Q25qQixVQUFBQSxFQUFFLENBQUNvakIsU0FBSCxDQUFhRCxjQUFjLEdBQUduakIsRUFBRSxDQUFDcWpCLEdBQU4sR0FBWXJqQixFQUFFLENBQUNzakIsRUFBMUM7QUFDQW5RLFVBQUFBLEtBQUssQ0FBQytQLEVBQU4sQ0FBU0MsY0FBVCxHQUEwQkEsY0FBMUI7QUFDSDs7QUFFRCxZQUFLaFEsS0FBSyxDQUFDK1AsRUFBTixDQUFTclMsU0FBVCxLQUF1QnFTLEVBQUUsQ0FBQ3JTLFNBQTNCLElBQ0NzQyxLQUFLLENBQUMrUCxFQUFOLENBQVN3RCxhQUFULEtBQTJCeEQsRUFBRSxDQUFDd0QsYUFEbkMsRUFDbUQ7QUFDL0MxbUIsVUFBQUEsRUFBRSxDQUFDMm1CLGFBQUgsQ0FBaUJ6RCxFQUFFLENBQUNyUyxTQUFwQixFQUErQnFTLEVBQUUsQ0FBQ3dELGFBQWxDO0FBQ0F2VCxVQUFBQSxLQUFLLENBQUMrUCxFQUFOLENBQVNyUyxTQUFULEdBQXFCcVMsRUFBRSxDQUFDclMsU0FBeEI7QUFDQXNDLFVBQUFBLEtBQUssQ0FBQytQLEVBQU4sQ0FBU3dELGFBQVQsR0FBeUJ4RCxFQUFFLENBQUN3RCxhQUE1QjtBQUNIOztBQUVELFlBQUl2VCxLQUFLLENBQUMrUCxFQUFOLENBQVN0UyxTQUFULEtBQXVCc1MsRUFBRSxDQUFDdFMsU0FBOUIsRUFBeUM7QUFDckM1USxVQUFBQSxFQUFFLENBQUM0USxTQUFILENBQWFzUyxFQUFFLENBQUN0UyxTQUFoQjtBQUNBdUMsVUFBQUEsS0FBSyxDQUFDK1AsRUFBTixDQUFTdFMsU0FBVCxHQUFxQnNTLEVBQUUsQ0FBQ3RTLFNBQXhCO0FBQ0g7QUFFSixPQTFEd0UsQ0EwRHZFO0FBRUY7OztBQUNBLFVBQU1tVSxHQUFHLEdBQUd6VSxnQkFBZ0IsQ0FBQ3lVLEdBQTdCOztBQUNBLFVBQUlBLEdBQUosRUFBUztBQUVMLFlBQUk1UixLQUFLLENBQUM0UixHQUFOLENBQVU2QixTQUFWLEtBQXdCN0IsR0FBRyxDQUFDNkIsU0FBaEMsRUFBMkM7QUFDdkMsY0FBSTdCLEdBQUcsQ0FBQzZCLFNBQVIsRUFBbUI7QUFDZjVtQixZQUFBQSxFQUFFLENBQUN3bUIsTUFBSCxDQUFVeG1CLEVBQUUsQ0FBQzZtQixVQUFiO0FBQ0gsV0FGRCxNQUVPO0FBQ0g3bUIsWUFBQUEsRUFBRSxDQUFDc21CLE9BQUgsQ0FBV3RtQixFQUFFLENBQUM2bUIsVUFBZDtBQUNIOztBQUNEMVQsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVNkIsU0FBVixHQUFzQjdCLEdBQUcsQ0FBQzZCLFNBQTFCO0FBQ0g7O0FBRUQsWUFBSXpULEtBQUssQ0FBQzRSLEdBQU4sQ0FBVUMsVUFBVixLQUF5QkQsR0FBRyxDQUFDQyxVQUFqQyxFQUE2QztBQUN6Q2hsQixVQUFBQSxFQUFFLENBQUNpbEIsU0FBSCxDQUFhRixHQUFHLENBQUNDLFVBQWpCO0FBQ0E3UixVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVVDLFVBQVYsR0FBdUJELEdBQUcsQ0FBQ0MsVUFBM0I7QUFDSDs7QUFFRCxZQUFJN1IsS0FBSyxDQUFDNFIsR0FBTixDQUFVK0IsU0FBVixLQUF3Qi9CLEdBQUcsQ0FBQytCLFNBQWhDLEVBQTJDO0FBQ3ZDOW1CLFVBQUFBLEVBQUUsQ0FBQzhtQixTQUFILENBQWEvWCxhQUFhLENBQUNnVyxHQUFHLENBQUMrQixTQUFMLENBQTFCO0FBQ0EzVCxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVUrQixTQUFWLEdBQXNCL0IsR0FBRyxDQUFDK0IsU0FBMUI7QUFDSCxTQW5CSSxDQXFCTDs7O0FBQ0EsWUFBSzNULEtBQUssQ0FBQzRSLEdBQU4sQ0FBVWdDLGdCQUFWLEtBQStCaEMsR0FBRyxDQUFDZ0MsZ0JBQXBDLElBQ0M1VCxLQUFLLENBQUM0UixHQUFOLENBQVVpQyxlQUFWLEtBQThCakMsR0FBRyxDQUFDaUMsZUFEdkMsRUFDeUQ7QUFDckQsY0FBSWpDLEdBQUcsQ0FBQ2dDLGdCQUFKLElBQXdCaEMsR0FBRyxDQUFDaUMsZUFBaEMsRUFBaUQ7QUFDN0NobkIsWUFBQUEsRUFBRSxDQUFDd21CLE1BQUgsQ0FBVXhtQixFQUFFLENBQUNpbkIsWUFBYjtBQUNILFdBRkQsTUFFTztBQUNIam5CLFlBQUFBLEVBQUUsQ0FBQ3NtQixPQUFILENBQVd0bUIsRUFBRSxDQUFDaW5CLFlBQWQ7QUFDSDs7QUFDRDlULFVBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVWdDLGdCQUFWLEdBQTZCaEMsR0FBRyxDQUFDZ0MsZ0JBQWpDO0FBQ0E1VCxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVVpQyxlQUFWLEdBQTRCakMsR0FBRyxDQUFDaUMsZUFBaEM7QUFDSDs7QUFFRCxZQUFLN1QsS0FBSyxDQUFDNFIsR0FBTixDQUFVbUMsZ0JBQVYsS0FBK0JuQyxHQUFHLENBQUNtQyxnQkFBcEMsSUFDQy9ULEtBQUssQ0FBQzRSLEdBQU4sQ0FBVW9DLGVBQVYsS0FBOEJwQyxHQUFHLENBQUNvQyxlQURuQyxJQUVDaFUsS0FBSyxDQUFDNFIsR0FBTixDQUFVcUMsb0JBQVYsS0FBbUNyQyxHQUFHLENBQUNxQyxvQkFGNUMsRUFFbUU7QUFFL0RwbkIsVUFBQUEsRUFBRSxDQUFDcW5CLG1CQUFILENBQ0lybkIsRUFBRSxDQUFDc2xCLEtBRFAsRUFFSXZXLGFBQWEsQ0FBQ2dXLEdBQUcsQ0FBQ21DLGdCQUFMLENBRmpCLEVBR0luQyxHQUFHLENBQUNvQyxlQUhSLEVBSUlwQyxHQUFHLENBQUNxQyxvQkFKUjtBQU1BalUsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVbUMsZ0JBQVYsR0FBNkJuQyxHQUFHLENBQUNtQyxnQkFBakM7QUFDQS9ULFVBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVW9DLGVBQVYsR0FBNEJwQyxHQUFHLENBQUNvQyxlQUFoQztBQUNBaFUsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVcUMsb0JBQVYsR0FBaUNyQyxHQUFHLENBQUNxQyxvQkFBckM7QUFDSDs7QUFFRCxZQUFLalUsS0FBSyxDQUFDNFIsR0FBTixDQUFVdUMsa0JBQVYsS0FBaUN2QyxHQUFHLENBQUN1QyxrQkFBdEMsSUFDQ25VLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVXdDLG1CQUFWLEtBQWtDeEMsR0FBRyxDQUFDd0MsbUJBRHZDLElBRUNwVSxLQUFLLENBQUM0UixHQUFOLENBQVV5QyxrQkFBVixLQUFpQ3pDLEdBQUcsQ0FBQ3lDLGtCQUYxQyxFQUUrRDtBQUUzRHhuQixVQUFBQSxFQUFFLENBQUN5bkIsaUJBQUgsQ0FDSXpuQixFQUFFLENBQUNzbEIsS0FEUCxFQUVJdFcsZUFBZSxDQUFDK1YsR0FBRyxDQUFDdUMsa0JBQUwsQ0FGbkIsRUFHSXRZLGVBQWUsQ0FBQytWLEdBQUcsQ0FBQ3dDLG1CQUFMLENBSG5CLEVBSUl2WSxlQUFlLENBQUMrVixHQUFHLENBQUN5QyxrQkFBTCxDQUpuQjtBQU1BclUsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVdUMsa0JBQVYsR0FBK0J2QyxHQUFHLENBQUN1QyxrQkFBbkM7QUFDQW5VLFVBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVXdDLG1CQUFWLEdBQWdDeEMsR0FBRyxDQUFDd0MsbUJBQXBDO0FBQ0FwVSxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVV5QyxrQkFBVixHQUErQnpDLEdBQUcsQ0FBQ3lDLGtCQUFuQztBQUNIOztBQUVELFlBQUlyVSxLQUFLLENBQUM0UixHQUFOLENBQVVLLHFCQUFWLEtBQW9DTCxHQUFHLENBQUNLLHFCQUE1QyxFQUFtRTtBQUMvRHBsQixVQUFBQSxFQUFFLENBQUNxbEIsbUJBQUgsQ0FBdUJybEIsRUFBRSxDQUFDc2xCLEtBQTFCLEVBQWlDUCxHQUFHLENBQUNLLHFCQUFyQztBQUNBalMsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVSyxxQkFBVixHQUFrQ0wsR0FBRyxDQUFDSyxxQkFBdEM7QUFDSCxTQWxFSSxDQW9FTDs7O0FBQ0EsWUFBS2pTLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVTJDLGVBQVYsS0FBOEIzQyxHQUFHLENBQUMyQyxlQUFuQyxJQUNDdlUsS0FBSyxDQUFDNFIsR0FBTixDQUFVNEMsY0FBVixLQUE2QjVDLEdBQUcsQ0FBQzRDLGNBRGxDLElBRUN4VSxLQUFLLENBQUM0UixHQUFOLENBQVU2QyxtQkFBVixLQUFrQzdDLEdBQUcsQ0FBQzZDLG1CQUYzQyxFQUVpRTtBQUU3RDVuQixVQUFBQSxFQUFFLENBQUNxbkIsbUJBQUgsQ0FDSXJuQixFQUFFLENBQUN3bEIsSUFEUCxFQUVJelcsYUFBYSxDQUFDZ1csR0FBRyxDQUFDMkMsZUFBTCxDQUZqQixFQUdJM0MsR0FBRyxDQUFDNEMsY0FIUixFQUlJNUMsR0FBRyxDQUFDNkMsbUJBSlI7QUFNQXpVLFVBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVTJDLGVBQVYsR0FBNEIzQyxHQUFHLENBQUMyQyxlQUFoQztBQUNBdlUsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVNEMsY0FBVixHQUEyQjVDLEdBQUcsQ0FBQzRDLGNBQS9CO0FBQ0F4VSxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVU2QyxtQkFBVixHQUFnQzdDLEdBQUcsQ0FBQzZDLG1CQUFwQztBQUNIOztBQUVELFlBQUt6VSxLQUFLLENBQUM0UixHQUFOLENBQVU4QyxpQkFBVixLQUFnQzlDLEdBQUcsQ0FBQzhDLGlCQUFyQyxJQUNDMVUsS0FBSyxDQUFDNFIsR0FBTixDQUFVK0Msa0JBQVYsS0FBaUMvQyxHQUFHLENBQUMrQyxrQkFEdEMsSUFFQzNVLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVWdELGlCQUFWLEtBQWdDaEQsR0FBRyxDQUFDZ0QsaUJBRnpDLEVBRTZEO0FBRXpEL25CLFVBQUFBLEVBQUUsQ0FBQ3luQixpQkFBSCxDQUNJem5CLEVBQUUsQ0FBQ3dsQixJQURQLEVBRUl4VyxlQUFlLENBQUMrVixHQUFHLENBQUM4QyxpQkFBTCxDQUZuQixFQUdJN1ksZUFBZSxDQUFDK1YsR0FBRyxDQUFDK0Msa0JBQUwsQ0FIbkIsRUFJSTlZLGVBQWUsQ0FBQytWLEdBQUcsQ0FBQ2dELGlCQUFMLENBSm5CO0FBTUE1VSxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVU4QyxpQkFBVixHQUE4QjlDLEdBQUcsQ0FBQzhDLGlCQUFsQztBQUNBMVUsVUFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVK0Msa0JBQVYsR0FBK0IvQyxHQUFHLENBQUMrQyxrQkFBbkM7QUFDQTNVLFVBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVWdELGlCQUFWLEdBQThCaEQsR0FBRyxDQUFDZ0QsaUJBQWxDO0FBQ0g7O0FBRUQsWUFBSTVVLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVVEsb0JBQVYsS0FBbUNSLEdBQUcsQ0FBQ1Esb0JBQTNDLEVBQWlFO0FBQzdEdmxCLFVBQUFBLEVBQUUsQ0FBQ3FsQixtQkFBSCxDQUF1QnJsQixFQUFFLENBQUN3bEIsSUFBMUIsRUFBZ0NULEdBQUcsQ0FBQ1Esb0JBQXBDO0FBQ0FwUyxVQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVVRLG9CQUFWLEdBQWlDUixHQUFHLENBQUNRLG9CQUFyQztBQUNIO0FBQ0osT0FyS3dFLENBcUt2RTtBQUVGOzs7QUFDQSxVQUFNcEIsRUFBRSxHQUFHN1QsZ0JBQWdCLENBQUM2VCxFQUE1Qjs7QUFDQSxVQUFJQSxFQUFKLEVBQVE7QUFFSixZQUFJaFIsS0FBSyxDQUFDZ1IsRUFBTixDQUFTNkQsS0FBVCxLQUFtQjdELEVBQUUsQ0FBQzZELEtBQTFCLEVBQWlDO0FBQzdCLGNBQUk3RCxFQUFFLENBQUM2RCxLQUFQLEVBQWM7QUFDVmhvQixZQUFBQSxFQUFFLENBQUN3bUIsTUFBSCxDQUFVeG1CLEVBQUUsQ0FBQ2lvQix3QkFBYjtBQUNILFdBRkQsTUFFTztBQUNIam9CLFlBQUFBLEVBQUUsQ0FBQ3NtQixPQUFILENBQVd0bUIsRUFBRSxDQUFDaW9CLHdCQUFkO0FBQ0g7O0FBQ0Q5VSxVQUFBQSxLQUFLLENBQUNnUixFQUFOLENBQVM2RCxLQUFULEdBQWlCN0QsRUFBRSxDQUFDNkQsS0FBcEI7QUFDSDs7QUFFRCxZQUFLN1UsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQjFFLENBQXBCLEtBQTBCVyxFQUFFLENBQUMrRCxVQUFILENBQWMxRSxDQUF6QyxJQUNDclEsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQnhFLENBQXBCLEtBQTBCUyxFQUFFLENBQUMrRCxVQUFILENBQWN4RSxDQUR6QyxJQUVDdlEsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQnhELENBQXBCLEtBQTBCUCxFQUFFLENBQUMrRCxVQUFILENBQWN4RCxDQUZ6QyxJQUdDdlIsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQjNSLENBQXBCLEtBQTBCNE4sRUFBRSxDQUFDK0QsVUFBSCxDQUFjM1IsQ0FIN0MsRUFHaUQ7QUFFN0N2VyxVQUFBQSxFQUFFLENBQUNrb0IsVUFBSCxDQUFjL0QsRUFBRSxDQUFDK0QsVUFBSCxDQUFjMUUsQ0FBNUIsRUFBK0JXLEVBQUUsQ0FBQytELFVBQUgsQ0FBY3hFLENBQTdDLEVBQWdEUyxFQUFFLENBQUMrRCxVQUFILENBQWN4RCxDQUE5RCxFQUFpRVAsRUFBRSxDQUFDK0QsVUFBSCxDQUFjM1IsQ0FBL0U7QUFFQXBELFVBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IxRSxDQUFwQixHQUF3QlcsRUFBRSxDQUFDK0QsVUFBSCxDQUFjMUUsQ0FBdEM7QUFDQXJRLFVBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0J4RSxDQUFwQixHQUF3QlMsRUFBRSxDQUFDK0QsVUFBSCxDQUFjeEUsQ0FBdEM7QUFDQXZRLFVBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0J4RCxDQUFwQixHQUF3QlAsRUFBRSxDQUFDK0QsVUFBSCxDQUFjeEQsQ0FBdEM7QUFDQXZSLFVBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IzUixDQUFwQixHQUF3QjROLEVBQUUsQ0FBQytELFVBQUgsQ0FBYzNSLENBQXRDO0FBQ0g7O0FBRUQsWUFBTTRSLE9BQU8sR0FBR2hFLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLENBQVgsQ0FBaEI7QUFDQSxZQUFNZ0UsWUFBWSxHQUFHalYsS0FBSyxDQUFDZ1IsRUFBTixDQUFTQyxPQUFULENBQWlCLENBQWpCLENBQXJCOztBQUVBLFlBQUlnRSxZQUFZLENBQUNDLEtBQWIsS0FBdUJGLE9BQU8sQ0FBQ0UsS0FBbkMsRUFBMEM7QUFDdEMsY0FBSUYsT0FBTyxDQUFDRSxLQUFaLEVBQW1CO0FBQ2Zyb0IsWUFBQUEsRUFBRSxDQUFDd21CLE1BQUgsQ0FBVXhtQixFQUFFLENBQUNzb0IsS0FBYjtBQUNILFdBRkQsTUFFTztBQUNIdG9CLFlBQUFBLEVBQUUsQ0FBQ3NtQixPQUFILENBQVd0bUIsRUFBRSxDQUFDc29CLEtBQWQ7QUFDSDs7QUFDREYsVUFBQUEsWUFBWSxDQUFDQyxLQUFiLEdBQXFCRixPQUFPLENBQUNFLEtBQTdCO0FBQ0g7O0FBRUQsWUFBS0QsWUFBWSxDQUFDRyxPQUFiLEtBQXlCSixPQUFPLENBQUNJLE9BQWxDLElBQ0NILFlBQVksQ0FBQ0ksWUFBYixLQUE4QkwsT0FBTyxDQUFDSyxZQUQzQyxFQUMwRDtBQUN0RHhvQixVQUFBQSxFQUFFLENBQUN5b0IscUJBQUgsQ0FBeUJ4WixhQUFhLENBQUNrWixPQUFPLENBQUNJLE9BQVQsQ0FBdEMsRUFBeUR0WixhQUFhLENBQUNrWixPQUFPLENBQUNLLFlBQVQsQ0FBdEU7QUFDQUosVUFBQUEsWUFBWSxDQUFDRyxPQUFiLEdBQXVCSixPQUFPLENBQUNJLE9BQS9CO0FBQ0FILFVBQUFBLFlBQVksQ0FBQ0ksWUFBYixHQUE0QkwsT0FBTyxDQUFDSyxZQUFwQztBQUNIOztBQUVELFlBQUtKLFlBQVksQ0FBQ00sUUFBYixLQUEwQlAsT0FBTyxDQUFDTyxRQUFuQyxJQUNDTixZQUFZLENBQUNPLFFBQWIsS0FBMEJSLE9BQU8sQ0FBQ1EsUUFEbkMsSUFFQ1AsWUFBWSxDQUFDUSxhQUFiLEtBQStCVCxPQUFPLENBQUNTLGFBRnhDLElBR0NSLFlBQVksQ0FBQ1MsYUFBYixLQUErQlYsT0FBTyxDQUFDVSxhQUg1QyxFQUc0RDtBQUV4RDdvQixVQUFBQSxFQUFFLENBQUM4b0IsaUJBQUgsQ0FDSTVaLGlCQUFpQixDQUFDaVosT0FBTyxDQUFDTyxRQUFULENBRHJCLEVBRUl4WixpQkFBaUIsQ0FBQ2laLE9BQU8sQ0FBQ1EsUUFBVCxDQUZyQixFQUdJelosaUJBQWlCLENBQUNpWixPQUFPLENBQUNTLGFBQVQsQ0FIckIsRUFJSTFaLGlCQUFpQixDQUFDaVosT0FBTyxDQUFDVSxhQUFULENBSnJCO0FBTUFULFVBQUFBLFlBQVksQ0FBQ00sUUFBYixHQUF3QlAsT0FBTyxDQUFDTyxRQUFoQztBQUNBTixVQUFBQSxZQUFZLENBQUNPLFFBQWIsR0FBd0JSLE9BQU8sQ0FBQ1EsUUFBaEM7QUFDQVAsVUFBQUEsWUFBWSxDQUFDUSxhQUFiLEdBQTZCVCxPQUFPLENBQUNTLGFBQXJDO0FBQ0FSLFVBQUFBLFlBQVksQ0FBQ1MsYUFBYixHQUE2QlYsT0FBTyxDQUFDVSxhQUFyQztBQUNIOztBQUVELFlBQUlULFlBQVksQ0FBQy9ELGNBQWIsS0FBZ0M4RCxPQUFPLENBQUM5RCxjQUE1QyxFQUE0RDtBQUV4RHJrQixVQUFBQSxFQUFFLENBQUN3a0IsU0FBSCxDQUNJLENBQUMyRCxPQUFPLENBQUM5RCxjQUFSLEdBQXlCQyxxQkFBYXFCLENBQXZDLE1BQThDckIscUJBQWF2VSxJQUQvRCxFQUVJLENBQUNvWSxPQUFPLENBQUM5RCxjQUFSLEdBQXlCQyxxQkFBYXVCLENBQXZDLE1BQThDdkIscUJBQWF2VSxJQUYvRCxFQUdJLENBQUNvWSxPQUFPLENBQUM5RCxjQUFSLEdBQXlCQyxxQkFBYXlCLENBQXZDLE1BQThDekIscUJBQWF2VSxJQUgvRCxFQUlJLENBQUNvWSxPQUFPLENBQUM5RCxjQUFSLEdBQXlCQyxxQkFBYTJCLENBQXZDLE1BQThDM0IscUJBQWF2VSxJQUovRDtBQU1BcVksVUFBQUEsWUFBWSxDQUFDL0QsY0FBYixHQUE4QjhELE9BQU8sQ0FBQzlELGNBQXRDO0FBQ0g7QUFDSixPQS9Pd0UsQ0ErT3ZFOztBQUNMLEtBNVBvRCxDQTRQbkQ7QUFFRjs7O0FBQ0EsUUFBSS9ULGdCQUFnQixJQUFJQSxnQkFBZ0IsQ0FBQ3lZLGlCQUFyQyxJQUEwRGpOLFNBQTlELEVBQXlFO0FBRXJFLFVBQU1rTixRQUFRLEdBQUdsTixTQUFTLENBQUNpRCxRQUFWLENBQW1CNU8sTUFBcEM7QUFDQSxVQUFNOFksb0JBQW9CLEdBQUczWSxnQkFBZ0IsQ0FBQ3lZLGlCQUFqQixDQUFtQ0Usb0JBQWhFOztBQUVBLFdBQUssSUFBSTVJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcySSxRQUFwQixFQUE4QjNJLENBQUMsRUFBL0IsRUFBbUM7QUFDL0IsWUFBTXBCLE9BQU8sR0FBR25ELFNBQVMsQ0FBQ2lELFFBQVYsQ0FBbUJzQixDQUFuQixDQUFoQjtBQUNBLFlBQU02SSxnQkFBZ0IsR0FBRzFZLGlCQUFpQixDQUFDeU8sT0FBTyxDQUFDekosR0FBVCxDQUExQztBQUNBLFlBQU0yVCxhQUFhLEdBQUdELGdCQUFnQixJQUFJQSxnQkFBZ0IsQ0FBQ0UsY0FBakIsQ0FBZ0NuSyxPQUFPLENBQUNMLE9BQXhDLENBQTFDO0FBQ0EsWUFBSTlKLElBQXlCLEdBQUcsSUFBaEM7QUFBc0MsWUFBSXBELE1BQU0sR0FBRyxDQUFiOztBQUV0QyxZQUFJeVgsYUFBYSxJQUFJQSxhQUFhLENBQUMzWCxTQUFuQyxFQUE4QztBQUMxQyxjQUFNQSxTQUFTLEdBQUcyWCxhQUFhLENBQUMzWCxTQUFoQztBQUNBLGNBQU02WCxxQkFBcUIsR0FBR0osb0JBQW9CLENBQUNoSyxPQUFPLENBQUN6SixHQUFULENBQWxEO0FBQ0EsY0FBTThULGtCQUFrQixHQUFHRCxxQkFBcUIsSUFBSUEscUJBQXFCLENBQUNwSyxPQUFPLENBQUNMLE9BQVQsQ0FBekU7QUFDQSxjQUFJMEssa0JBQWtCLElBQUksQ0FBMUIsRUFBNkI1WCxNQUFNLEdBQUdqQixjQUFjLENBQUM2WSxrQkFBRCxDQUF2Qjs7QUFFN0IsY0FBSSxVQUFVOVgsU0FBZCxFQUF5QjtBQUNyQnNELFlBQUFBLElBQUksR0FBR3RELFNBQVMsQ0FBQ3NELElBQWpCO0FBQ0gsV0FGRCxNQUVPO0FBQ0hwRCxZQUFBQSxNQUFNLElBQUlGLFNBQVMsQ0FBQ0UsTUFBcEI7QUFDQW9ELFlBQUFBLElBQUksR0FBR3RELFNBQVMsQ0FBQ0EsU0FBVixDQUFvQnNELElBQTNCO0FBQ0g7O0FBQ0RwRCxVQUFBQSxNQUFNLEtBQUssQ0FBWDtBQUNIOztBQUVELFlBQUksQ0FBQ29ELElBQUwsRUFBVztBQUNQLHNEQUF5Qm1LLE9BQU8sQ0FBQ2pDLElBQWpDLHNCQUFpRGlDLE9BQU8sQ0FBQ3pKLEdBQXpELHNCQUF3RXlKLE9BQU8sQ0FBQ0wsT0FBaEY7QUFDQTtBQUNIOztBQUVELFlBQU0ySyxVQUFVLEdBQUd0SyxPQUFPLENBQUNHLGdCQUFSLENBQXlCalAsTUFBNUM7O0FBQ0EsYUFBSyxJQUFJZ04sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR29NLFVBQXBCLEVBQWdDcE0sQ0FBQyxFQUFqQyxFQUFxQztBQUNqQyxjQUFNbUQsU0FBUyxHQUFHckIsT0FBTyxDQUFDRyxnQkFBUixDQUF5QmpDLENBQXpCLENBQWxCOztBQUNBLGtCQUFRbUQsU0FBUyxDQUFDMVIsTUFBbEI7QUFDSSxpQkFBSzVPLEVBQUUsQ0FBQzBNLElBQVI7QUFDQSxpQkFBSzFNLEVBQUUsQ0FBQ29CLEdBQVI7QUFBYTtBQUNULHFCQUFLLElBQUlpZSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLENBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssR0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixDQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEdBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixDQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssQ0FBQyxHQUFHcEssQ0FBUixFQUFXcUssQ0FBQyxHQUFHRixHQUFwQixFQUF5QkMsQ0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLENBQUYsRUFBSyxFQUFFQyxDQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxDQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLENBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDdWhCLFVBQUgsQ0FBY2pCLFNBQVMsQ0FBQzdCLEtBQXhCLEVBQStCNkIsU0FBUyxDQUFDYixLQUF6QztBQUNBO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGlCQUFLemYsRUFBRSxDQUFDNE0sU0FBUjtBQUNBLGlCQUFLNU0sRUFBRSxDQUFDa04sUUFBUjtBQUFrQjtBQUNkLHFCQUFLLElBQUltUyxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEVBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssSUFBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixFQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLElBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixFQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssRUFBQyxHQUFHcEssRUFBUixFQUFXcUssRUFBQyxHQUFHRixJQUFwQixFQUF5QkMsRUFBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEVBQUYsRUFBSyxFQUFFQyxFQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxFQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEVBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDMnBCLFVBQUgsQ0FBY3JKLFNBQVMsQ0FBQzdCLEtBQXhCLEVBQStCNkIsU0FBUyxDQUFDYixLQUF6QztBQUNBO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGlCQUFLemYsRUFBRSxDQUFDOE0sU0FBUjtBQUNBLGlCQUFLOU0sRUFBRSxDQUFDb04sUUFBUjtBQUFrQjtBQUNkLHFCQUFLLElBQUlpUyxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEdBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssS0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixHQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEtBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixHQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssR0FBQyxHQUFHcEssR0FBUixFQUFXcUssR0FBQyxHQUFHRixLQUFwQixFQUF5QkMsR0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEdBQUYsRUFBSyxFQUFFQyxHQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxHQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEdBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDNHBCLFVBQUgsQ0FBY3RKLFNBQVMsQ0FBQzdCLEtBQXhCLEVBQStCNkIsU0FBUyxDQUFDYixLQUF6QztBQUNBO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGlCQUFLemYsRUFBRSxDQUFDZ04sU0FBUjtBQUNBLGlCQUFLaE4sRUFBRSxDQUFDc04sUUFBUjtBQUFrQjtBQUNkLHFCQUFLLElBQUkrUixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEdBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssS0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixHQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEtBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixHQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssR0FBQyxHQUFHcEssR0FBUixFQUFXcUssR0FBQyxHQUFHRixLQUFwQixFQUF5QkMsR0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEdBQUYsRUFBSyxFQUFFQyxHQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxHQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEdBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDNnBCLFVBQUgsQ0FBY3ZKLFNBQVMsQ0FBQzdCLEtBQXhCLEVBQStCNkIsU0FBUyxDQUFDYixLQUF6QztBQUNBO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGlCQUFLemYsRUFBRSxDQUFDZ0IsS0FBUjtBQUFlO0FBQ1gscUJBQUssSUFBSXFlLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdpQixTQUFTLENBQUNiLEtBQVYsQ0FBZ0J0UCxNQUFwQyxFQUE0QyxFQUFFa1AsR0FBOUMsRUFBaUQ7QUFDN0Msc0JBQU1tSyxLQUFHLEdBQUdsSixTQUFTLENBQUNkLEtBQVYsR0FBa0I5TixNQUFsQixHQUEyQjJOLEdBQXZDOztBQUNBLHNCQUFJdkssSUFBSSxDQUFDMFUsS0FBRCxDQUFKLEtBQWNsSixTQUFTLENBQUNiLEtBQVYsQ0FBZ0JKLEdBQWhCLENBQWxCLEVBQXNDO0FBQ2xDLHlCQUFLLElBQUlvSyxHQUFDLEdBQUdwSyxHQUFSLEVBQVdxSyxHQUFDLEdBQUdGLEtBQXBCLEVBQXlCQyxHQUFDLEdBQUduSixTQUFTLENBQUNiLEtBQVYsQ0FBZ0J0UCxNQUE3QyxFQUFxRCxFQUFFc1osR0FBRixFQUFLLEVBQUVDLEdBQTVELEVBQStEO0FBQzNEcEosc0JBQUFBLFNBQVMsQ0FBQ2IsS0FBVixDQUFnQmdLLEdBQWhCLElBQXFCM1UsSUFBSSxDQUFDNFUsR0FBRCxDQUF6QjtBQUNIOztBQUNEMXBCLG9CQUFBQSxFQUFFLENBQUM4cEIsVUFBSCxDQUFjeEosU0FBUyxDQUFDN0IsS0FBeEIsRUFBK0I2QixTQUFTLENBQUNiLEtBQXpDO0FBQ0E7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsaUJBQUt6ZixFQUFFLENBQUN5TixVQUFSO0FBQW9CO0FBQ2hCLHFCQUFLLElBQUk0UixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEdBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssS0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixHQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEtBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixHQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssR0FBQyxHQUFHcEssR0FBUixFQUFXcUssR0FBQyxHQUFHRixLQUFwQixFQUF5QkMsR0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEdBQUYsRUFBSyxFQUFFQyxHQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxHQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEdBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDK3BCLFVBQUgsQ0FBY3pKLFNBQVMsQ0FBQzdCLEtBQXhCLEVBQStCNkIsU0FBUyxDQUFDYixLQUF6QztBQUNBO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGlCQUFLemYsRUFBRSxDQUFDMk4sVUFBUjtBQUFvQjtBQUNoQixxQkFBSyxJQUFJMFIsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR2lCLFNBQVMsQ0FBQ2IsS0FBVixDQUFnQnRQLE1BQXBDLEVBQTRDLEVBQUVrUCxHQUE5QyxFQUFpRDtBQUM3QyxzQkFBTW1LLEtBQUcsR0FBR2xKLFNBQVMsQ0FBQ2QsS0FBVixHQUFrQjlOLE1BQWxCLEdBQTJCMk4sR0FBdkM7O0FBQ0Esc0JBQUl2SyxJQUFJLENBQUMwVSxLQUFELENBQUosS0FBY2xKLFNBQVMsQ0FBQ2IsS0FBVixDQUFnQkosR0FBaEIsQ0FBbEIsRUFBc0M7QUFDbEMseUJBQUssSUFBSW9LLEdBQUMsR0FBR3BLLEdBQVIsRUFBV3FLLEdBQUMsR0FBR0YsS0FBcEIsRUFBeUJDLEdBQUMsR0FBR25KLFNBQVMsQ0FBQ2IsS0FBVixDQUFnQnRQLE1BQTdDLEVBQXFELEVBQUVzWixHQUFGLEVBQUssRUFBRUMsR0FBNUQsRUFBK0Q7QUFDM0RwSixzQkFBQUEsU0FBUyxDQUFDYixLQUFWLENBQWdCZ0ssR0FBaEIsSUFBcUIzVSxJQUFJLENBQUM0VSxHQUFELENBQXpCO0FBQ0g7O0FBQ0QxcEIsb0JBQUFBLEVBQUUsQ0FBQ2dxQixVQUFILENBQWMxSixTQUFTLENBQUM3QixLQUF4QixFQUErQjZCLFNBQVMsQ0FBQ2IsS0FBekM7QUFDQTtBQUNIO0FBQ0o7O0FBQ0Q7QUFDSDs7QUFDRCxpQkFBS3pmLEVBQUUsQ0FBQzZOLFVBQVI7QUFBb0I7QUFDaEIscUJBQUssSUFBSXdSLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdpQixTQUFTLENBQUNiLEtBQVYsQ0FBZ0J0UCxNQUFwQyxFQUE0QyxFQUFFa1AsR0FBOUMsRUFBaUQ7QUFDN0Msc0JBQU1tSyxLQUFHLEdBQUdsSixTQUFTLENBQUNkLEtBQVYsR0FBa0I5TixNQUFsQixHQUEyQjJOLEdBQXZDOztBQUNBLHNCQUFJdkssSUFBSSxDQUFDMFUsS0FBRCxDQUFKLEtBQWNsSixTQUFTLENBQUNiLEtBQVYsQ0FBZ0JKLEdBQWhCLENBQWxCLEVBQXNDO0FBQ2xDLHlCQUFLLElBQUlvSyxHQUFDLEdBQUdwSyxHQUFSLEVBQVdxSyxHQUFDLEdBQUdGLEtBQXBCLEVBQXlCQyxHQUFDLEdBQUduSixTQUFTLENBQUNiLEtBQVYsQ0FBZ0J0UCxNQUE3QyxFQUFxRCxFQUFFc1osR0FBRixFQUFLLEVBQUVDLEdBQTVELEVBQStEO0FBQzNEcEosc0JBQUFBLFNBQVMsQ0FBQ2IsS0FBVixDQUFnQmdLLEdBQWhCLElBQXFCM1UsSUFBSSxDQUFDNFUsR0FBRCxDQUF6QjtBQUNIOztBQUNEMXBCLG9CQUFBQSxFQUFFLENBQUNpcUIsVUFBSCxDQUFjM0osU0FBUyxDQUFDN0IsS0FBeEIsRUFBK0I2QixTQUFTLENBQUNiLEtBQXpDO0FBQ0E7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsaUJBQUt6ZixFQUFFLENBQUMrTixVQUFSO0FBQW9CO0FBQ2hCLHFCQUFLLElBQUlzUixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEdBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssS0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixHQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEtBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixHQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssR0FBQyxHQUFHcEssR0FBUixFQUFXcUssR0FBQyxHQUFHRixLQUFwQixFQUF5QkMsR0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEdBQUYsRUFBSyxFQUFFQyxHQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxHQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEdBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDa3FCLGdCQUFILENBQW9CNUosU0FBUyxDQUFDN0IsS0FBOUIsRUFBcUMsS0FBckMsRUFBNEM2QixTQUFTLENBQUNiLEtBQXREO0FBQ0E7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsaUJBQUt6ZixFQUFFLENBQUNpTyxVQUFSO0FBQW9CO0FBQ2hCLHFCQUFLLElBQUlvUixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLEdBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssS0FBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixHQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLEtBQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixHQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssR0FBQyxHQUFHcEssR0FBUixFQUFXcUssR0FBQyxHQUFHRixLQUFwQixFQUF5QkMsR0FBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLEdBQUYsRUFBSyxFQUFFQyxHQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxHQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLEdBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDbXFCLGdCQUFILENBQW9CN0osU0FBUyxDQUFDN0IsS0FBOUIsRUFBcUMsS0FBckMsRUFBNEM2QixTQUFTLENBQUNiLEtBQXREO0FBQ0E7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsaUJBQUt6ZixFQUFFLENBQUNtTyxVQUFSO0FBQW9CO0FBQ2hCLHFCQUFLLElBQUlrUixJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHaUIsU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBcEMsRUFBNEMsRUFBRWtQLElBQTlDLEVBQWlEO0FBQzdDLHNCQUFNbUssTUFBRyxHQUFHbEosU0FBUyxDQUFDZCxLQUFWLEdBQWtCOU4sTUFBbEIsR0FBMkIyTixJQUF2Qzs7QUFDQSxzQkFBSXZLLElBQUksQ0FBQzBVLE1BQUQsQ0FBSixLQUFjbEosU0FBUyxDQUFDYixLQUFWLENBQWdCSixJQUFoQixDQUFsQixFQUFzQztBQUNsQyx5QkFBSyxJQUFJb0ssSUFBQyxHQUFHcEssSUFBUixFQUFXcUssSUFBQyxHQUFHRixNQUFwQixFQUF5QkMsSUFBQyxHQUFHbkosU0FBUyxDQUFDYixLQUFWLENBQWdCdFAsTUFBN0MsRUFBcUQsRUFBRXNaLElBQUYsRUFBSyxFQUFFQyxJQUE1RCxFQUErRDtBQUMzRHBKLHNCQUFBQSxTQUFTLENBQUNiLEtBQVYsQ0FBZ0JnSyxJQUFoQixJQUFxQjNVLElBQUksQ0FBQzRVLElBQUQsQ0FBekI7QUFDSDs7QUFDRDFwQixvQkFBQUEsRUFBRSxDQUFDb3FCLGdCQUFILENBQW9COUosU0FBUyxDQUFDN0IsS0FBOUIsRUFBcUMsS0FBckMsRUFBNEM2QixTQUFTLENBQUNiLEtBQXREO0FBQ0E7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0Q7QUFwSko7QUFzSkg7O0FBQ0Q7QUFDSDs7QUFFRCxVQUFNNEssVUFBVSxHQUFHdk8sU0FBUyxDQUFDNkQsVUFBVixDQUFxQnhQLE1BQXhDOztBQUNBLFdBQUssSUFBSWtJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdnUyxVQUFwQixFQUFnQ2hTLENBQUMsRUFBakMsRUFBcUM7QUFDakMsWUFBTTZJLFNBQVMsR0FBR3BGLFNBQVMsQ0FBQzZELFVBQVYsQ0FBcUJ0SCxDQUFyQixDQUFsQjtBQUNBLFlBQU02USxpQkFBZ0IsR0FBRzFZLGlCQUFpQixDQUFDMFEsU0FBUyxDQUFDMUwsR0FBWCxDQUExQztBQUNBLFlBQUk4VSxlQUFlLEdBQUdwQixpQkFBZ0IsSUFBSUEsaUJBQWdCLENBQUNxQixpQkFBakIsQ0FBbUNySixTQUFTLENBQUN0QyxPQUE3QyxDQUExQzs7QUFDQSxZQUFJdUssY0FBYSxHQUFHRCxpQkFBZ0IsSUFBSUEsaUJBQWdCLENBQUNFLGNBQWpCLENBQWdDa0IsZUFBaEMsQ0FBeEM7O0FBRUEsWUFBTUUsVUFBVSxHQUFHdEosU0FBUyxDQUFDckIsS0FBVixDQUFnQjFQLE1BQW5DOztBQUNBLGFBQUssSUFBSWdOLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdxTixVQUFwQixFQUFnQ3JOLEVBQUMsRUFBakMsRUFBcUM7QUFDakMsY0FBTWpGLE9BQU8sR0FBR2dKLFNBQVMsQ0FBQ3JCLEtBQVYsQ0FBZ0IxQyxFQUFoQixDQUFoQjs7QUFFQSxjQUFJLENBQUNnTSxjQUFELElBQWtCLENBQUNBLGNBQWEsQ0FBQ3NCLFVBQXJDLEVBQWlEO0FBQzdDLHlEQUEwQnZKLFNBQVMsQ0FBQ2xFLElBQXBDLHNCQUFvRGtFLFNBQVMsQ0FBQzFMLEdBQTlELHNCQUE2RTBMLFNBQVMsQ0FBQ3RDLE9BQXZGLG9CQUF3R3pCLEVBQXhHO0FBQ0E7QUFDSDs7QUFFRCxjQUFJZ00sY0FBYSxDQUFDclgsVUFBZCxJQUNBcVgsY0FBYSxDQUFDclgsVUFBZCxDQUF5QkgsSUFBekIsR0FBZ0MsQ0FEcEMsRUFDdUM7QUFFbkMsZ0JBQU1HLFVBQVUsR0FBR3FYLGNBQWEsQ0FBQ3JYLFVBQWpDO0FBQ0EsZ0JBQU1rRyxTQUFTLEdBQUc3RSxLQUFLLENBQUM4RSxVQUFOLENBQWlCQyxPQUFqQixDQUFsQjs7QUFFQSxnQkFBSUYsU0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUMsa0JBQUkzRSxLQUFLLENBQUMrRSxPQUFOLEtBQWtCQSxPQUF0QixFQUErQjtBQUMzQmxZLGdCQUFBQSxFQUFFLENBQUMwcUIsYUFBSCxDQUFpQjFxQixFQUFFLENBQUMycUIsUUFBSCxHQUFjelMsT0FBL0I7QUFDQS9FLGdCQUFBQSxLQUFLLENBQUMrRSxPQUFOLEdBQWdCQSxPQUFoQjtBQUNIOztBQUNELGtCQUFJcEcsVUFBVSxDQUFDZ0csU0FBZixFQUEwQjtBQUN0QjlYLGdCQUFBQSxFQUFFLENBQUNtWSxXQUFILENBQWVyRyxVQUFVLENBQUNnQyxRQUExQixFQUFvQ2hDLFVBQVUsQ0FBQ2dHLFNBQS9DO0FBQ0gsZUFGRCxNQUVPO0FBQ0g5WCxnQkFBQUEsRUFBRSxDQUFDbVksV0FBSCxDQUFlckcsVUFBVSxDQUFDZ0MsUUFBMUIsRUFBb0NaLE1BQU0sQ0FBQzBYLFNBQVAsQ0FBa0I5WSxVQUFsQixDQUE2QmdHLFNBQWpFO0FBQ0g7O0FBQ0RFLGNBQUFBLFNBQVMsQ0FBQ0YsU0FBVixHQUFzQmhHLFVBQVUsQ0FBQ2dHLFNBQWpDO0FBQ0g7O0FBRUQsZ0JBQU0yUyxVQUFVLEdBQUd0QixjQUFhLENBQUNzQixVQUFqQzs7QUFDQSxnQkFBSTNZLFVBQVUsQ0FBQzhHLFVBQWYsRUFBMkI7QUFDdkJDLGNBQUFBLE9BQU8sR0FBRzRSLFVBQVUsQ0FBQzVSLE9BQXJCO0FBQ0FFLGNBQUFBLE9BQU8sR0FBRzBSLFVBQVUsQ0FBQzFSLE9BQXJCO0FBQ0gsYUFIRCxNQUdPO0FBQ0hGLGNBQUFBLE9BQU8sR0FBRzdZLEVBQUUsQ0FBQ2daLGFBQWI7QUFDQUQsY0FBQUEsT0FBTyxHQUFHL1ksRUFBRSxDQUFDZ1osYUFBYjtBQUNIOztBQUVELGdCQUFJbEgsVUFBVSxDQUFDOEcsVUFBZixFQUEyQjtBQUN2QixrQkFBSTlHLFVBQVUsQ0FBQ3dHLFFBQVgsSUFBdUIsQ0FBdkIsS0FDQ21TLFVBQVUsQ0FBQ3hSLFdBQVgsS0FBMkJqWixFQUFFLENBQUM2cUIscUJBQTlCLElBQ0RKLFVBQVUsQ0FBQ3hSLFdBQVgsS0FBMkJqWixFQUFFLENBQUM4cUIsb0JBRjlCLENBQUosRUFFeUQ7QUFDckQ3UixnQkFBQUEsV0FBVyxHQUFHalosRUFBRSxDQUFDa1osTUFBakI7QUFDSCxlQUpELE1BSU87QUFDSEQsZ0JBQUFBLFdBQVcsR0FBR3dSLFVBQVUsQ0FBQ3hSLFdBQXpCO0FBQ0g7QUFDSixhQVJELE1BUU87QUFDSCxrQkFBSXdSLFVBQVUsQ0FBQ3hSLFdBQVgsS0FBMkJqWixFQUFFLENBQUNrWixNQUE5QixJQUNBdVIsVUFBVSxDQUFDeFIsV0FBWCxLQUEyQmpaLEVBQUUsQ0FBQzZxQixxQkFEOUIsSUFFQUosVUFBVSxDQUFDeFIsV0FBWCxLQUEyQmpaLEVBQUUsQ0FBQzhxQixvQkFGbEMsRUFFd0Q7QUFDcEQ3UixnQkFBQUEsV0FBVyxHQUFHalosRUFBRSxDQUFDa1osTUFBakI7QUFDSCxlQUpELE1BSU87QUFDSEQsZ0JBQUFBLFdBQVcsR0FBR2paLEVBQUUsQ0FBQytxQixPQUFqQjtBQUNIO0FBQ0o7O0FBRUQsZ0JBQUlqWixVQUFVLENBQUMrRyxPQUFYLEtBQXVCQSxPQUEzQixFQUFvQztBQUNoQyxrQkFBSTFGLEtBQUssQ0FBQytFLE9BQU4sS0FBa0JBLE9BQXRCLEVBQStCO0FBQzNCbFksZ0JBQUFBLEVBQUUsQ0FBQzBxQixhQUFILENBQWlCMXFCLEVBQUUsQ0FBQzJxQixRQUFILEdBQWN6UyxPQUEvQjtBQUNBL0UsZ0JBQUFBLEtBQUssQ0FBQytFLE9BQU4sR0FBZ0JBLE9BQWhCO0FBQ0g7O0FBQ0RsWSxjQUFBQSxFQUFFLENBQUNvWixhQUFILENBQWlCdEgsVUFBVSxDQUFDZ0MsUUFBNUIsRUFBc0M5VCxFQUFFLENBQUNxWixjQUF6QyxFQUF5RFIsT0FBekQ7QUFDQS9HLGNBQUFBLFVBQVUsQ0FBQytHLE9BQVgsR0FBcUJBLE9BQXJCO0FBQ0g7O0FBRUQsZ0JBQUkvRyxVQUFVLENBQUNpSCxPQUFYLEtBQXVCQSxPQUEzQixFQUFvQztBQUNoQyxrQkFBSTVGLEtBQUssQ0FBQytFLE9BQU4sS0FBa0JBLE9BQXRCLEVBQStCO0FBQzNCbFksZ0JBQUFBLEVBQUUsQ0FBQzBxQixhQUFILENBQWlCMXFCLEVBQUUsQ0FBQzJxQixRQUFILEdBQWN6UyxPQUEvQjtBQUNBL0UsZ0JBQUFBLEtBQUssQ0FBQytFLE9BQU4sR0FBZ0JBLE9BQWhCO0FBQ0g7O0FBQ0RsWSxjQUFBQSxFQUFFLENBQUNvWixhQUFILENBQWlCdEgsVUFBVSxDQUFDZ0MsUUFBNUIsRUFBc0M5VCxFQUFFLENBQUNzWixjQUF6QyxFQUF5RFAsT0FBekQ7QUFDQWpILGNBQUFBLFVBQVUsQ0FBQ2lILE9BQVgsR0FBcUJBLE9BQXJCO0FBQ0g7O0FBRUQsZ0JBQUlqSCxVQUFVLENBQUNtSCxXQUFYLEtBQTJCQSxXQUEvQixFQUE0QztBQUN4QyxrQkFBSTlGLEtBQUssQ0FBQytFLE9BQU4sS0FBa0JBLE9BQXRCLEVBQStCO0FBQzNCbFksZ0JBQUFBLEVBQUUsQ0FBQzBxQixhQUFILENBQWlCMXFCLEVBQUUsQ0FBQzJxQixRQUFILEdBQWN6UyxPQUEvQjtBQUNBL0UsZ0JBQUFBLEtBQUssQ0FBQytFLE9BQU4sR0FBZ0JBLE9BQWhCO0FBQ0g7O0FBQ0RsWSxjQUFBQSxFQUFFLENBQUNvWixhQUFILENBQWlCdEgsVUFBVSxDQUFDZ0MsUUFBNUIsRUFBc0M5VCxFQUFFLENBQUN1WixrQkFBekMsRUFBNkROLFdBQTdEO0FBQ0FuSCxjQUFBQSxVQUFVLENBQUNtSCxXQUFYLEdBQXlCQSxXQUF6QjtBQUNIOztBQUVELGdCQUFJbkgsVUFBVSxDQUFDcUgsV0FBWCxLQUEyQnNSLFVBQVUsQ0FBQ3RSLFdBQTFDLEVBQXVEO0FBQ25ELGtCQUFJaEcsS0FBSyxDQUFDK0UsT0FBTixLQUFrQkEsT0FBdEIsRUFBK0I7QUFDM0JsWSxnQkFBQUEsRUFBRSxDQUFDMHFCLGFBQUgsQ0FBaUIxcUIsRUFBRSxDQUFDMnFCLFFBQUgsR0FBY3pTLE9BQS9CO0FBQ0EvRSxnQkFBQUEsS0FBSyxDQUFDK0UsT0FBTixHQUFnQkEsT0FBaEI7QUFDSDs7QUFDRGxZLGNBQUFBLEVBQUUsQ0FBQ29aLGFBQUgsQ0FBaUJ0SCxVQUFVLENBQUNnQyxRQUE1QixFQUFzQzlULEVBQUUsQ0FBQ3daLGtCQUF6QyxFQUE2RGlSLFVBQVUsQ0FBQ3RSLFdBQXhFO0FBQ0FySCxjQUFBQSxVQUFVLENBQUNxSCxXQUFYLEdBQXlCc1IsVUFBVSxDQUFDdFIsV0FBcEM7QUFDSDtBQUNKOztBQUVEZ1EsVUFBQUEsY0FBYSxHQUFHRCxpQkFBZ0IsQ0FBQ0UsY0FBakIsQ0FBZ0MsRUFBRWtCLGVBQWxDLENBQWhCO0FBQ0g7QUFDSjtBQUNKLEtBamlCb0QsQ0FpaUJuRDtBQUVGOzs7QUFDQSxRQUFJL1osaUJBQWlCLElBQUl1TCxTQUFyQixLQUNDcUssZUFBZSxJQUFJN1IsYUFBYSxDQUFDL0QsaUJBQWQsS0FBb0NBLGlCQUR4RCxDQUFKLEVBQ2dGO0FBQzVFK0QsTUFBQUEsYUFBYSxDQUFDL0QsaUJBQWQsR0FBa0NBLGlCQUFsQztBQUNBLFVBQU15YSxFQUFFLEdBQUc5WCxNQUFNLENBQUMrWCxzQkFBbEI7O0FBRUEsVUFBSS9YLE1BQU0sQ0FBQ2dCLE1BQVgsRUFBbUI7QUFDZixZQUFNZ1gsR0FBRyxHQUFHaFksTUFBTSxDQUFDa0IsdUJBQW5CLENBRGUsQ0FHZjs7QUFDQSxZQUFJRCxLQUFLLEdBQUc1RCxpQkFBaUIsQ0FBQytSLE1BQWxCLENBQXlCNkksR0FBekIsQ0FBNkJyUCxTQUFTLENBQUN3QixTQUF2QyxDQUFaOztBQUNBLFlBQUksQ0FBQ25KLEtBQUwsRUFBWTtBQUNSQSxVQUFBQSxLQUFLLEdBQUcrVyxHQUFHLENBQUNFLG9CQUFKLEVBQVI7QUFDQTdhLFVBQUFBLGlCQUFpQixDQUFDK1IsTUFBbEIsQ0FBeUI5TSxHQUF6QixDQUE2QnNHLFNBQVMsQ0FBQ3dCLFNBQXZDLEVBQW1EbkosS0FBbkQ7QUFFQStXLFVBQUFBLEdBQUcsQ0FBQzdXLGtCQUFKLENBQXVCRixLQUF2QjtBQUNBblUsVUFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0IsSUFBL0I7QUFDQS9ULFVBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1QyxJQUF2QztBQUNBeEIsVUFBQUEsS0FBSyxDQUFDb0IsYUFBTixHQUFzQixJQUF0QjtBQUNBcEIsVUFBQUEsS0FBSyxDQUFDeUIsb0JBQU4sR0FBNkIsSUFBN0I7QUFFQSxjQUFJeVcsUUFBSjtBQUNBLGNBQU1DLFFBQVEsR0FBR3hQLFNBQVMsQ0FBQ29DLFFBQVYsQ0FBbUIvTixNQUFwQzs7QUFDQSxlQUFLLElBQUlrUSxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHaUwsUUFBcEIsRUFBOEJqTCxFQUFDLEVBQS9CLEVBQW1DO0FBQy9CLGdCQUFNa0wsT0FBTyxHQUFHelAsU0FBUyxDQUFDb0MsUUFBVixDQUFtQm1DLEVBQW5CLENBQWhCO0FBQ0FnTCxZQUFBQSxRQUFRLEdBQUcsSUFBWDtBQUVBLGdCQUFNRyxTQUFTLEdBQUdqYixpQkFBaUIsQ0FBQ29SLFNBQWxCLENBQTRCeFIsTUFBOUM7O0FBQ0EsaUJBQUssSUFBSTRMLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd5UCxTQUFwQixFQUErQnpQLENBQUMsRUFBaEMsRUFBb0M7QUFDaEMsa0JBQU0rRixNQUFNLEdBQUd2UixpQkFBaUIsQ0FBQ29SLFNBQWxCLENBQTRCNUYsQ0FBNUIsQ0FBZjs7QUFDQSxrQkFBSStGLE1BQU0sQ0FBQzlFLElBQVAsS0FBZ0J1TyxPQUFPLENBQUN2TyxJQUE1QixFQUFrQztBQUM5QnFPLGdCQUFBQSxRQUFRLEdBQUd2SixNQUFYO0FBQ0E7QUFDSDtBQUNKOztBQUVELGdCQUFJdUosUUFBSixFQUFjO0FBQ1Ysa0JBQUlsWSxLQUFLLENBQUNvQixhQUFOLEtBQXdCOFcsUUFBUSxDQUFDclgsUUFBckMsRUFBK0M7QUFDM0NoVSxnQkFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0JzWCxRQUFRLENBQUNyWCxRQUF4QztBQUNBYixnQkFBQUEsS0FBSyxDQUFDb0IsYUFBTixHQUFzQjhXLFFBQVEsQ0FBQ3JYLFFBQS9CO0FBQ0g7O0FBRUQsbUJBQUssSUFBSXlYLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLFFBQVEsQ0FBQ3BKLGNBQTdCLEVBQTZDLEVBQUV3SixDQUEvQyxFQUFrRDtBQUM5QyxvQkFBTWhOLEtBQUssR0FBRzhNLE9BQU8sQ0FBQzlNLEtBQVIsR0FBZ0JnTixDQUE5QjtBQUNBLG9CQUFNQyxZQUFZLEdBQUdMLFFBQVEsQ0FBQzNaLE1BQVQsR0FBa0IyWixRQUFRLENBQUMxWixJQUFULEdBQWdCOFosQ0FBdkQ7QUFFQXpyQixnQkFBQUEsRUFBRSxDQUFDMnJCLHVCQUFILENBQTJCbE4sS0FBM0I7QUFDQXRMLGdCQUFBQSxLQUFLLENBQUN5WSxtQkFBTixDQUEwQm5OLEtBQTFCLElBQW1DLElBQW5DO0FBRUF6ZSxnQkFBQUEsRUFBRSxDQUFDNnJCLG1CQUFILENBQXVCcE4sS0FBdkIsRUFBOEI0TSxRQUFRLENBQUN4TSxLQUF2QyxFQUE4Q3dNLFFBQVEsQ0FBQ3pjLE1BQXZELEVBQStEeWMsUUFBUSxDQUFDbkosWUFBeEUsRUFBc0ZtSixRQUFRLENBQUMxTSxNQUEvRixFQUF1RytNLFlBQXZHOztBQUNBLG9CQUFJVixFQUFKLEVBQVE7QUFBRUEsa0JBQUFBLEVBQUUsQ0FBQ2Msd0JBQUgsQ0FBNEJyTixLQUE1QixFQUFtQzRNLFFBQVEsQ0FBQ2xKLFdBQVQsR0FBdUIsQ0FBdkIsR0FBMkIsQ0FBOUQ7QUFBbUU7QUFDaEY7QUFDSjtBQUNKOztBQUVELGNBQU0zUSxVQUFTLEdBQUdqQixpQkFBaUIsQ0FBQ3diLGNBQXBDOztBQUNBLGNBQUl2YSxVQUFKLEVBQWU7QUFDWHhSLFlBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1Q25ELFVBQVMsQ0FBQ3dDLFFBQWpEO0FBQ0g7O0FBRURrWCxVQUFBQSxHQUFHLENBQUM3VyxrQkFBSixDQUF1QixJQUF2QjtBQUNBclUsVUFBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0IsSUFBL0I7QUFDQS9ULFVBQUFBLEVBQUUsQ0FBQ3dVLFVBQUgsQ0FBY3hVLEVBQUUsQ0FBQzJVLG9CQUFqQixFQUF1QyxJQUF2QztBQUNBeEIsVUFBQUEsS0FBSyxDQUFDb0IsYUFBTixHQUFzQixJQUF0QjtBQUNBcEIsVUFBQUEsS0FBSyxDQUFDeUIsb0JBQU4sR0FBNkIsSUFBN0I7QUFDSDs7QUFFRCxZQUFJekIsS0FBSyxDQUFDZ0IsS0FBTixLQUFnQkEsS0FBcEIsRUFBMkI7QUFDdkIrVyxVQUFBQSxHQUFHLENBQUM3VyxrQkFBSixDQUF1QkYsS0FBdkI7QUFDQWhCLFVBQUFBLEtBQUssQ0FBQ2dCLEtBQU4sR0FBY0EsS0FBZDtBQUNIO0FBQ0osT0FqRUQsTUFpRU87QUFDSCxhQUFLLElBQUk2UixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHOVMsTUFBTSxDQUFDOFksbUJBQTNCLEVBQWdELEVBQUVoRyxDQUFsRCxFQUFxRDtBQUNqRDdTLFVBQUFBLEtBQUssQ0FBQ3lZLG1CQUFOLENBQTBCNUYsQ0FBMUIsSUFBK0IsS0FBL0I7QUFDSDs7QUFFRCxZQUFNc0YsU0FBUSxHQUFHeFAsU0FBUyxDQUFDb0MsUUFBVixDQUFtQi9OLE1BQXBDOztBQUNBLGFBQUssSUFBSWtRLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdpTCxTQUFwQixFQUE4QmpMLEdBQUMsRUFBL0IsRUFBbUM7QUFDL0IsY0FBTWtMLFFBQU8sR0FBR3pQLFNBQVMsQ0FBQ29DLFFBQVYsQ0FBbUJtQyxHQUFuQixDQUFoQjtBQUNBLGNBQUlnTCxTQUE2QixHQUFHLElBQXBDO0FBRUEsY0FBTUcsVUFBUyxHQUFHamIsaUJBQWlCLENBQUNvUixTQUFsQixDQUE0QnhSLE1BQTlDOztBQUNBLGVBQUssSUFBSTRMLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUd5UCxVQUFwQixFQUErQnpQLEdBQUMsRUFBaEMsRUFBb0M7QUFDaEMsZ0JBQU0rRixPQUFNLEdBQUd2UixpQkFBaUIsQ0FBQ29SLFNBQWxCLENBQTRCNUYsR0FBNUIsQ0FBZjs7QUFDQSxnQkFBSStGLE9BQU0sQ0FBQzlFLElBQVAsS0FBZ0J1TyxRQUFPLENBQUN2TyxJQUE1QixFQUFrQztBQUM5QnFPLGNBQUFBLFNBQVEsR0FBR3ZKLE9BQVg7QUFDQTtBQUNIO0FBQ0o7O0FBRUQsY0FBSXVKLFNBQUosRUFBYztBQUNWLGdCQUFJbFksS0FBSyxDQUFDb0IsYUFBTixLQUF3QjhXLFNBQVEsQ0FBQ3JYLFFBQXJDLEVBQStDO0FBQzNDaFUsY0FBQUEsRUFBRSxDQUFDd1UsVUFBSCxDQUFjeFUsRUFBRSxDQUFDK1QsWUFBakIsRUFBK0JzWCxTQUFRLENBQUNyWCxRQUF4QztBQUNBYixjQUFBQSxLQUFLLENBQUNvQixhQUFOLEdBQXNCOFcsU0FBUSxDQUFDclgsUUFBL0I7QUFDSDs7QUFFRCxpQkFBSyxJQUFJeVgsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR0osU0FBUSxDQUFDcEosY0FBN0IsRUFBNkMsRUFBRXdKLEVBQS9DLEVBQWtEO0FBQzlDLGtCQUFNaE4sT0FBSyxHQUFHOE0sUUFBTyxDQUFDOU0sS0FBUixHQUFnQmdOLEVBQTlCOztBQUNBLGtCQUFNQyxhQUFZLEdBQUdMLFNBQVEsQ0FBQzNaLE1BQVQsR0FBa0IyWixTQUFRLENBQUMxWixJQUFULEdBQWdCOFosRUFBdkQ7O0FBRUEsa0JBQUksQ0FBQ3RZLEtBQUssQ0FBQzhZLG1CQUFOLENBQTBCeE4sT0FBMUIsQ0FBRCxJQUFxQ0EsT0FBSyxJQUFJLENBQWxELEVBQXFEO0FBQ2pEemUsZ0JBQUFBLEVBQUUsQ0FBQzJyQix1QkFBSCxDQUEyQmxOLE9BQTNCO0FBQ0F0TCxnQkFBQUEsS0FBSyxDQUFDOFksbUJBQU4sQ0FBMEJ4TixPQUExQixJQUFtQyxJQUFuQztBQUNIOztBQUNEdEwsY0FBQUEsS0FBSyxDQUFDeVksbUJBQU4sQ0FBMEJuTixPQUExQixJQUFtQyxJQUFuQztBQUVBemUsY0FBQUEsRUFBRSxDQUFDNnJCLG1CQUFILENBQXVCcE4sT0FBdkIsRUFBOEI0TSxTQUFRLENBQUN4TSxLQUF2QyxFQUE4Q3dNLFNBQVEsQ0FBQ3pjLE1BQXZELEVBQStEeWMsU0FBUSxDQUFDbkosWUFBeEUsRUFBc0ZtSixTQUFRLENBQUMxTSxNQUEvRixFQUF1RytNLGFBQXZHOztBQUNBLGtCQUFJVixFQUFKLEVBQVE7QUFBRUEsZ0JBQUFBLEVBQUUsQ0FBQ2Msd0JBQUgsQ0FBNEJyTixPQUE1QixFQUFtQzRNLFNBQVEsQ0FBQ2xKLFdBQVQsR0FBdUIsQ0FBdkIsR0FBMkIsQ0FBOUQ7QUFBbUU7QUFDaEY7QUFDSjtBQUNKLFNBdkNFLENBdUNEOzs7QUFFRixZQUFNM1EsV0FBUyxHQUFHakIsaUJBQWlCLENBQUN3YixjQUFwQzs7QUFDQSxZQUFJdmEsV0FBSixFQUFlO0FBQ1gsY0FBSTJCLEtBQUssQ0FBQ3lCLG9CQUFOLEtBQStCcEQsV0FBUyxDQUFDd0MsUUFBN0MsRUFBdUQ7QUFDbkRoVSxZQUFBQSxFQUFFLENBQUN3VSxVQUFILENBQWN4VSxFQUFFLENBQUMyVSxvQkFBakIsRUFBdUNuRCxXQUFTLENBQUN3QyxRQUFqRDtBQUNBYixZQUFBQSxLQUFLLENBQUN5QixvQkFBTixHQUE2QnBELFdBQVMsQ0FBQ3dDLFFBQXZDO0FBQ0g7QUFDSjs7QUFFRCxhQUFLLElBQUlnUyxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHOVMsTUFBTSxDQUFDOFksbUJBQTNCLEVBQWdELEVBQUVoRyxFQUFsRCxFQUFxRDtBQUNqRCxjQUFJN1MsS0FBSyxDQUFDOFksbUJBQU4sQ0FBMEJqRyxFQUExQixNQUFpQzdTLEtBQUssQ0FBQ3lZLG1CQUFOLENBQTBCNUYsRUFBMUIsQ0FBckMsRUFBbUU7QUFDL0RobUIsWUFBQUEsRUFBRSxDQUFDa3NCLHdCQUFILENBQTRCbEcsRUFBNUI7QUFDQTdTLFlBQUFBLEtBQUssQ0FBQzhZLG1CQUFOLENBQTBCakcsRUFBMUIsSUFBK0IsS0FBL0I7QUFDSDtBQUNKO0FBQ0o7QUFDSixLQWxxQm9ELENBa3FCbkQ7QUFFRjs7O0FBQ0EsUUFBSTFWLGdCQUFnQixJQUFJQSxnQkFBZ0IsQ0FBQzZiLGFBQWpCLENBQStCaGMsTUFBdkQsRUFBK0Q7QUFDM0QsVUFBTWljLEtBQUssR0FBRzliLGdCQUFnQixDQUFDNmIsYUFBakIsQ0FBK0JoYyxNQUE3Qzs7QUFDQSxXQUFLLElBQUlrUSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHK0wsS0FBcEIsRUFBMkIvTCxHQUFDLEVBQTVCLEVBQWdDO0FBQzVCLFlBQU1nTSxZQUFZLEdBQUcvYixnQkFBZ0IsQ0FBQzZiLGFBQWpCLENBQStCOUwsR0FBL0IsQ0FBckI7O0FBQ0EsZ0JBQVFnTSxZQUFSO0FBQ0ksZUFBS0MsK0JBQXVCQyxRQUE1QjtBQUFzQztBQUNsQyxrQkFBSTdiLFFBQUosRUFBYztBQUNWLG9CQUFJeUMsS0FBSyxDQUFDekMsUUFBTixDQUFlNlMsSUFBZixLQUF3QjdTLFFBQVEsQ0FBQzZTLElBQWpDLElBQ0FwUSxLQUFLLENBQUN6QyxRQUFOLENBQWUrUyxHQUFmLEtBQXVCL1MsUUFBUSxDQUFDK1MsR0FEaEMsSUFFQXRRLEtBQUssQ0FBQ3pDLFFBQU4sQ0FBZThGLEtBQWYsS0FBeUI5RixRQUFRLENBQUM4RixLQUZsQyxJQUdBckQsS0FBSyxDQUFDekMsUUFBTixDQUFlZ0csTUFBZixLQUEwQmhHLFFBQVEsQ0FBQ2dHLE1BSHZDLEVBRytDO0FBRTNDMVcsa0JBQUFBLEVBQUUsQ0FBQzBRLFFBQUgsQ0FBWUEsUUFBUSxDQUFDNlMsSUFBckIsRUFBMkI3UyxRQUFRLENBQUMrUyxHQUFwQyxFQUF5Qy9TLFFBQVEsQ0FBQzhGLEtBQWxELEVBQXlEOUYsUUFBUSxDQUFDZ0csTUFBbEU7QUFFQXZELGtCQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWU2UyxJQUFmLEdBQXNCN1MsUUFBUSxDQUFDNlMsSUFBL0I7QUFDQXBRLGtCQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWUrUyxHQUFmLEdBQXFCL1MsUUFBUSxDQUFDK1MsR0FBOUI7QUFDQXRRLGtCQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWU4RixLQUFmLEdBQXVCOUYsUUFBUSxDQUFDOEYsS0FBaEM7QUFDQXJELGtCQUFBQSxLQUFLLENBQUN6QyxRQUFOLENBQWVnRyxNQUFmLEdBQXdCaEcsUUFBUSxDQUFDZ0csTUFBakM7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsZUFBSzRWLCtCQUF1QkUsT0FBNUI7QUFBcUM7QUFDakMsa0JBQUk3YixPQUFKLEVBQWE7QUFDVCxvQkFBSXdDLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JILENBQWxCLEtBQXdCN1MsT0FBTyxDQUFDNlMsQ0FBaEMsSUFDQXJRLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JELENBQWxCLEtBQXdCL1MsT0FBTyxDQUFDK1MsQ0FEaEMsSUFFQXZRLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JuTixLQUFsQixLQUE0QjdGLE9BQU8sQ0FBQzZGLEtBRnBDLElBR0FyRCxLQUFLLENBQUN3USxXQUFOLENBQWtCak4sTUFBbEIsS0FBNkIvRixPQUFPLENBQUMrRixNQUh6QyxFQUdpRDtBQUU3QzFXLGtCQUFBQSxFQUFFLENBQUMyUSxPQUFILENBQVdBLE9BQU8sQ0FBQzZTLENBQW5CLEVBQXNCN1MsT0FBTyxDQUFDK1MsQ0FBOUIsRUFBaUMvUyxPQUFPLENBQUM2RixLQUF6QyxFQUFnRDdGLE9BQU8sQ0FBQytGLE1BQXhEO0FBRUF2RCxrQkFBQUEsS0FBSyxDQUFDd1EsV0FBTixDQUFrQkgsQ0FBbEIsR0FBc0I3UyxPQUFPLENBQUM2UyxDQUE5QjtBQUNBclEsa0JBQUFBLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JELENBQWxCLEdBQXNCL1MsT0FBTyxDQUFDK1MsQ0FBOUI7QUFDQXZRLGtCQUFBQSxLQUFLLENBQUN3USxXQUFOLENBQWtCbk4sS0FBbEIsR0FBMEI3RixPQUFPLENBQUM2RixLQUFsQztBQUNBckQsa0JBQUFBLEtBQUssQ0FBQ3dRLFdBQU4sQ0FBa0JqTixNQUFsQixHQUEyQi9GLE9BQU8sQ0FBQytGLE1BQW5DO0FBQ0g7QUFDSjs7QUFDRDtBQUNIOztBQUNELGVBQUs0ViwrQkFBdUJHLFVBQTVCO0FBQXdDO0FBQ3BDLGtCQUFJN2IsU0FBSixFQUFlO0FBQ1gsb0JBQUl1QyxLQUFLLENBQUMrUCxFQUFOLENBQVN0UyxTQUFULEtBQXVCQSxTQUEzQixFQUFzQztBQUNsQzVRLGtCQUFBQSxFQUFFLENBQUM0USxTQUFILENBQWFBLFNBQWI7QUFDQXVDLGtCQUFBQSxLQUFLLENBQUMrUCxFQUFOLENBQVN0UyxTQUFULEdBQXFCQSxTQUFyQjtBQUNIO0FBQ0o7O0FBQ0Q7QUFDSDs7QUFDRCxlQUFLMGIsK0JBQXVCSSxVQUE1QjtBQUF3QztBQUNwQyxrQkFBSTdiLFNBQUosRUFBZTtBQUVYLG9CQUFLc0MsS0FBSyxDQUFDK1AsRUFBTixDQUFTclMsU0FBVCxLQUF1QkEsU0FBUyxDQUFDOGIsY0FBbEMsSUFDQ3haLEtBQUssQ0FBQytQLEVBQU4sQ0FBU3dELGFBQVQsS0FBMkI3VixTQUFTLENBQUMrYixXQUQxQyxFQUN3RDtBQUNwRDVzQixrQkFBQUEsRUFBRSxDQUFDMm1CLGFBQUgsQ0FBaUI5VixTQUFTLENBQUM4YixjQUEzQixFQUEyQzliLFNBQVMsQ0FBQytiLFdBQXJEO0FBQ0F6WixrQkFBQUEsS0FBSyxDQUFDK1AsRUFBTixDQUFTclMsU0FBVCxHQUFxQkEsU0FBUyxDQUFDOGIsY0FBL0I7QUFDQXhaLGtCQUFBQSxLQUFLLENBQUMrUCxFQUFOLENBQVN3RCxhQUFULEdBQXlCN1YsU0FBUyxDQUFDK2IsV0FBbkM7QUFDSDtBQUNKOztBQUNEO0FBQ0g7O0FBQ0QsZUFBS04sK0JBQXVCTyxlQUE1QjtBQUE2QztBQUN6QyxrQkFBSzFaLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IxRSxDQUFwQixLQUEwQjFTLGNBQWMsQ0FBQyxDQUFELENBQXpDLElBQ0NxQyxLQUFLLENBQUNnUixFQUFOLENBQVMrRCxVQUFULENBQW9CeEUsQ0FBcEIsS0FBMEI1UyxjQUFjLENBQUMsQ0FBRCxDQUR6QyxJQUVDcUMsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQnhELENBQXBCLEtBQTBCNVQsY0FBYyxDQUFDLENBQUQsQ0FGekMsSUFHQ3FDLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IzUixDQUFwQixLQUEwQnpGLGNBQWMsQ0FBQyxDQUFELENBSDdDLEVBR21EO0FBRS9DOVEsZ0JBQUFBLEVBQUUsQ0FBQ2tvQixVQUFILENBQWNwWCxjQUFjLENBQUMsQ0FBRCxDQUE1QixFQUFpQ0EsY0FBYyxDQUFDLENBQUQsQ0FBL0MsRUFBb0RBLGNBQWMsQ0FBQyxDQUFELENBQWxFLEVBQXVFQSxjQUFjLENBQUMsQ0FBRCxDQUFyRjtBQUVBcUMsZ0JBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IxRSxDQUFwQixHQUF3QjFTLGNBQWMsQ0FBQyxDQUFELENBQXRDO0FBQ0FxQyxnQkFBQUEsS0FBSyxDQUFDZ1IsRUFBTixDQUFTK0QsVUFBVCxDQUFvQnhFLENBQXBCLEdBQXdCNVMsY0FBYyxDQUFDLENBQUQsQ0FBdEM7QUFDQXFDLGdCQUFBQSxLQUFLLENBQUNnUixFQUFOLENBQVMrRCxVQUFULENBQW9CeEQsQ0FBcEIsR0FBd0I1VCxjQUFjLENBQUMsQ0FBRCxDQUF0QztBQUNBcUMsZ0JBQUFBLEtBQUssQ0FBQ2dSLEVBQU4sQ0FBUytELFVBQVQsQ0FBb0IzUixDQUFwQixHQUF3QnpGLGNBQWMsQ0FBQyxDQUFELENBQXRDO0FBQ0g7O0FBQ0Q7QUFDSDs7QUFDRCxlQUFLd2IsK0JBQXVCUSxrQkFBNUI7QUFBZ0Q7QUFDNUMsa0JBQUk5YixnQkFBSixFQUFzQjtBQUNsQix3QkFBUUEsZ0JBQWdCLENBQUMrYixJQUF6QjtBQUNJLHVCQUFLQyx1QkFBZTFILEtBQXBCO0FBQTJCO0FBQ3ZCLDBCQUFJblMsS0FBSyxDQUFDNFIsR0FBTixDQUFVSyxxQkFBVixLQUFvQ3BVLGdCQUFnQixDQUFDaWMsU0FBekQsRUFBb0U7QUFDaEVqdEIsd0JBQUFBLEVBQUUsQ0FBQ3FsQixtQkFBSCxDQUF1QnJsQixFQUFFLENBQUNzbEIsS0FBMUIsRUFBaUN0VSxnQkFBZ0IsQ0FBQ2ljLFNBQWxEO0FBQ0E5Wix3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVSyxxQkFBVixHQUFrQ3BVLGdCQUFnQixDQUFDaWMsU0FBbkQ7QUFDSDs7QUFDRDtBQUNIOztBQUNELHVCQUFLRCx1QkFBZXhILElBQXBCO0FBQTBCO0FBQ3RCLDBCQUFJclMsS0FBSyxDQUFDNFIsR0FBTixDQUFVUSxvQkFBVixLQUFtQ3ZVLGdCQUFnQixDQUFDaWMsU0FBeEQsRUFBbUU7QUFDL0RqdEIsd0JBQUFBLEVBQUUsQ0FBQ3FsQixtQkFBSCxDQUF1QnJsQixFQUFFLENBQUN3bEIsSUFBMUIsRUFBZ0N4VSxnQkFBZ0IsQ0FBQ2ljLFNBQWpEO0FBQ0E5Wix3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVUSxvQkFBVixHQUFpQ3ZVLGdCQUFnQixDQUFDaWMsU0FBbEQ7QUFDSDs7QUFDRDtBQUNIOztBQUNELHVCQUFLRCx1QkFBZXpJLEdBQXBCO0FBQXlCO0FBQ3JCLDBCQUFJcFIsS0FBSyxDQUFDNFIsR0FBTixDQUFVSyxxQkFBVixLQUFvQ3BVLGdCQUFnQixDQUFDaWMsU0FBckQsSUFDQTlaLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVVEsb0JBQVYsS0FBbUN2VSxnQkFBZ0IsQ0FBQ2ljLFNBRHhELEVBQ21FO0FBQy9EanRCLHdCQUFBQSxFQUFFLENBQUNrdEIsV0FBSCxDQUFlbGMsZ0JBQWdCLENBQUNpYyxTQUFoQztBQUNBOVosd0JBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVUsscUJBQVYsR0FBa0NwVSxnQkFBZ0IsQ0FBQ2ljLFNBQW5EO0FBQ0E5Wix3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVUSxvQkFBVixHQUFpQ3ZVLGdCQUFnQixDQUFDaWMsU0FBbEQ7QUFDSDs7QUFDRDtBQUNIO0FBdkJMO0FBeUJIOztBQUNEO0FBQ0g7O0FBQ0QsZUFBS1gsK0JBQXVCYSxvQkFBNUI7QUFBa0Q7QUFDOUMsa0JBQUlsYyxrQkFBSixFQUF3QjtBQUNwQix3QkFBUUEsa0JBQWtCLENBQUM4YixJQUEzQjtBQUNJLHVCQUFLQyx1QkFBZTFILEtBQXBCO0FBQTJCO0FBQ3ZCLDBCQUFJblMsS0FBSyxDQUFDNFIsR0FBTixDQUFVb0MsZUFBVixLQUE4QmxXLGtCQUFrQixDQUFDbWMsU0FBakQsSUFDQWphLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVXFDLG9CQUFWLEtBQW1Dblcsa0JBQWtCLENBQUNvYyxXQUQxRCxFQUN1RTtBQUNuRXJ0Qix3QkFBQUEsRUFBRSxDQUFDcW5CLG1CQUFILENBQ0lybkIsRUFBRSxDQUFDc2xCLEtBRFAsRUFFSXZXLGFBQWEsQ0FBQ29FLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVW1DLGdCQUFYLENBRmpCLEVBR0lqVyxrQkFBa0IsQ0FBQ21jLFNBSHZCLEVBSUluYyxrQkFBa0IsQ0FBQ29jLFdBSnZCO0FBS0FsYSx3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVb0MsZUFBVixHQUE0QmxXLGtCQUFrQixDQUFDbWMsU0FBL0M7QUFDQWphLHdCQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVVxQyxvQkFBVixHQUFpQ25XLGtCQUFrQixDQUFDb2MsV0FBcEQ7QUFDSDs7QUFDRDtBQUNIOztBQUNELHVCQUFLTCx1QkFBZXhILElBQXBCO0FBQTBCO0FBQ3RCLDBCQUFJclMsS0FBSyxDQUFDNFIsR0FBTixDQUFVNEMsY0FBVixLQUE2QjFXLGtCQUFrQixDQUFDbWMsU0FBaEQsSUFDQWphLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVTZDLG1CQUFWLEtBQWtDM1csa0JBQWtCLENBQUNvYyxXQUR6RCxFQUNzRTtBQUNsRXJ0Qix3QkFBQUEsRUFBRSxDQUFDcW5CLG1CQUFILENBQ0lybkIsRUFBRSxDQUFDd2xCLElBRFAsRUFFSXpXLGFBQWEsQ0FBQ29FLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVTJDLGVBQVgsQ0FGakIsRUFHSXpXLGtCQUFrQixDQUFDbWMsU0FIdkIsRUFJSW5jLGtCQUFrQixDQUFDb2MsV0FKdkI7QUFLQWxhLHdCQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVU0QyxjQUFWLEdBQTJCMVcsa0JBQWtCLENBQUNtYyxTQUE5QztBQUNBamEsd0JBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVTZDLG1CQUFWLEdBQWdDM1csa0JBQWtCLENBQUNvYyxXQUFuRDtBQUNIOztBQUNEO0FBQ0g7O0FBQ0QsdUJBQUtMLHVCQUFlekksR0FBcEI7QUFBeUI7QUFDckIsMEJBQUlwUixLQUFLLENBQUM0UixHQUFOLENBQVVvQyxlQUFWLEtBQThCbFcsa0JBQWtCLENBQUNtYyxTQUFqRCxJQUNBamEsS0FBSyxDQUFDNFIsR0FBTixDQUFVcUMsb0JBQVYsS0FBbUNuVyxrQkFBa0IsQ0FBQ29jLFdBRHRELElBRUFsYSxLQUFLLENBQUM0UixHQUFOLENBQVU0QyxjQUFWLEtBQTZCMVcsa0JBQWtCLENBQUNtYyxTQUZoRCxJQUdBamEsS0FBSyxDQUFDNFIsR0FBTixDQUFVNkMsbUJBQVYsS0FBa0MzVyxrQkFBa0IsQ0FBQ29jLFdBSHpELEVBR3NFO0FBQ2xFcnRCLHdCQUFBQSxFQUFFLENBQUNzdEIsV0FBSCxDQUNJdmUsYUFBYSxDQUFDb0UsS0FBSyxDQUFDNFIsR0FBTixDQUFVMkMsZUFBWCxDQURqQixFQUVJelcsa0JBQWtCLENBQUNtYyxTQUZ2QixFQUdJbmMsa0JBQWtCLENBQUNvYyxXQUh2QjtBQUlBbGEsd0JBQUFBLEtBQUssQ0FBQzRSLEdBQU4sQ0FBVW9DLGVBQVYsR0FBNEJsVyxrQkFBa0IsQ0FBQ21jLFNBQS9DO0FBQ0FqYSx3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVcUMsb0JBQVYsR0FBaUNuVyxrQkFBa0IsQ0FBQ29jLFdBQXBEO0FBQ0FsYSx3QkFBQUEsS0FBSyxDQUFDNFIsR0FBTixDQUFVNEMsY0FBVixHQUEyQjFXLGtCQUFrQixDQUFDbWMsU0FBOUM7QUFDQWphLHdCQUFBQSxLQUFLLENBQUM0UixHQUFOLENBQVU2QyxtQkFBVixHQUFnQzNXLGtCQUFrQixDQUFDb2MsV0FBbkQ7QUFDSDs7QUFDRDtBQUNIO0FBMUNMO0FBNENIOztBQUNEO0FBQ0g7QUFySkwsU0FGNEIsQ0F3SjFCOztBQUNMLE9BM0owRCxDQTJKekQ7O0FBQ0wsS0FqMEJvRCxDQWkwQm5EOztBQUNMOztBQUVNLFdBQVNFLGdCQUFULENBQTJCcmEsTUFBM0IsRUFBZ0Q5QixRQUFoRCxFQUF1RTtBQUMxRSxRQUFNcFIsRUFBRSxHQUFHa1QsTUFBTSxDQUFDbFQsRUFBbEI7QUFDQSxRQUFNZ3JCLEVBQUUsR0FBRzlYLE1BQU0sQ0FBQytYLHNCQUFsQjtBQUYwRSxRQUdsRTFhLGlCQUhrRSxHQUcvQitELGFBSCtCLENBR2xFL0QsaUJBSGtFO0FBQUEsUUFHL0N1UyxXQUgrQyxHQUcvQnhPLGFBSCtCLENBRy9Dd08sV0FIK0M7O0FBSzFFLFFBQUl2UyxpQkFBSixFQUF1QjtBQUNuQixVQUFJQSxpQkFBaUIsQ0FBQ2lkLGlCQUF0QixFQUF5QztBQUNyQyxZQUFNQyxLQUFLLEdBQUdsZCxpQkFBaUIsQ0FBQ2lkLGlCQUFsQixDQUFvQzlYLFNBQXBDLENBQThDdkYsTUFBNUQ7O0FBQ0EsYUFBSyxJQUFJa1EsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR29OLEtBQXBCLEVBQTJCcE4sQ0FBQyxFQUE1QixFQUFnQztBQUM1QixjQUFNcU4sV0FBVyxHQUFHbmQsaUJBQWlCLENBQUNpZCxpQkFBbEIsQ0FBb0M5WCxTQUFwQyxDQUE4QzJLLENBQTlDLENBQXBCO0FBQ0EsY0FBTTdPLFNBQVMsR0FBR2pCLGlCQUFpQixDQUFDd2IsY0FBcEM7O0FBQ0EsY0FBSTJCLFdBQVcsQ0FBQ0MsYUFBWixJQUE2QjNDLEVBQWpDLEVBQXFDO0FBQ2pDLGdCQUFJeFosU0FBSixFQUFlO0FBQ1gsa0JBQUlrYyxXQUFXLENBQUNFLFVBQVosR0FBeUIsQ0FBN0IsRUFBZ0M7QUFDNUIsb0JBQU1sYyxNQUFNLEdBQUdnYyxXQUFXLENBQUNHLFVBQVosR0FBeUJyYyxTQUFTLENBQUNtTixNQUFsRDtBQUNBcU0sZ0JBQUFBLEVBQUUsQ0FBQzhDLDBCQUFILENBQThCaEwsV0FBOUIsRUFBMkM0SyxXQUFXLENBQUNFLFVBQXZELEVBQ0lyZCxpQkFBaUIsQ0FBQ3dkLFdBRHRCLEVBQ21DcmMsTUFEbkMsRUFDMkNnYyxXQUFXLENBQUNDLGFBRHZEO0FBRUg7QUFDSixhQU5ELE1BTU8sSUFBSUQsV0FBVyxDQUFDTSxXQUFaLEdBQTBCLENBQTlCLEVBQWlDO0FBQ3BDaEQsY0FBQUEsRUFBRSxDQUFDaUQsd0JBQUgsQ0FBNEJuTCxXQUE1QixFQUF5QzRLLFdBQVcsQ0FBQ1EsV0FBckQsRUFBa0VSLFdBQVcsQ0FBQ00sV0FBOUUsRUFBMkZOLFdBQVcsQ0FBQ0MsYUFBdkc7QUFDSDtBQUNKLFdBVkQsTUFVTztBQUNILGdCQUFJbmMsU0FBSixFQUFlO0FBQ1gsa0JBQUlrYyxXQUFXLENBQUNFLFVBQVosR0FBeUIsQ0FBN0IsRUFBZ0M7QUFDNUIsb0JBQU1sYyxPQUFNLEdBQUdnYyxXQUFXLENBQUNHLFVBQVosR0FBeUJyYyxTQUFTLENBQUNtTixNQUFsRDs7QUFDQTNlLGdCQUFBQSxFQUFFLENBQUNtdUIsWUFBSCxDQUFnQnJMLFdBQWhCLEVBQTZCNEssV0FBVyxDQUFDRSxVQUF6QyxFQUFxRHJkLGlCQUFpQixDQUFDd2QsV0FBdkUsRUFBb0ZyYyxPQUFwRjtBQUNIO0FBQ0osYUFMRCxNQUtPLElBQUlnYyxXQUFXLENBQUNNLFdBQVosR0FBMEIsQ0FBOUIsRUFBaUM7QUFDcENodUIsY0FBQUEsRUFBRSxDQUFDb3VCLFVBQUgsQ0FBY3RMLFdBQWQsRUFBMkI0SyxXQUFXLENBQUNRLFdBQXZDLEVBQW9EUixXQUFXLENBQUNNLFdBQWhFO0FBQ0g7QUFDSjtBQUNKO0FBQ0osT0ExQkQsTUEwQk87QUFDSCxZQUFNeGMsV0FBUyxHQUFHakIsaUJBQWlCLENBQUN3YixjQUFwQzs7QUFDQSxZQUFJM2EsUUFBUSxDQUFDdWMsYUFBVCxJQUEwQjNDLEVBQTlCLEVBQWtDO0FBQzlCLGNBQUl4WixXQUFKLEVBQWU7QUFDWCxnQkFBSUosUUFBUSxDQUFDd2MsVUFBVCxHQUFzQixDQUExQixFQUE2QjtBQUN6QixrQkFBTWxjLFFBQU0sR0FBR04sUUFBUSxDQUFDeWMsVUFBVCxHQUFzQnJjLFdBQVMsQ0FBQ21OLE1BQS9DOztBQUNBcU0sY0FBQUEsRUFBRSxDQUFDOEMsMEJBQUgsQ0FBOEJoTCxXQUE5QixFQUEyQzFSLFFBQVEsQ0FBQ3djLFVBQXBELEVBQ0lyZCxpQkFBaUIsQ0FBQ3dkLFdBRHRCLEVBQ21DcmMsUUFEbkMsRUFDMkNOLFFBQVEsQ0FBQ3VjLGFBRHBEO0FBRUg7QUFDSixXQU5ELE1BTU8sSUFBSXZjLFFBQVEsQ0FBQzRjLFdBQVQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDakNoRCxZQUFBQSxFQUFFLENBQUNpRCx3QkFBSCxDQUE0Qm5MLFdBQTVCLEVBQXlDMVIsUUFBUSxDQUFDOGMsV0FBbEQsRUFBK0Q5YyxRQUFRLENBQUM0YyxXQUF4RSxFQUFxRjVjLFFBQVEsQ0FBQ3VjLGFBQTlGO0FBQ0g7QUFDSixTQVZELE1BVU87QUFDSCxjQUFJbmMsV0FBSixFQUFlO0FBQ1gsZ0JBQUlKLFFBQVEsQ0FBQ3djLFVBQVQsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDekIsa0JBQU1sYyxRQUFNLEdBQUdOLFFBQVEsQ0FBQ3ljLFVBQVQsR0FBc0JyYyxXQUFTLENBQUNtTixNQUEvQzs7QUFDQTNlLGNBQUFBLEVBQUUsQ0FBQ211QixZQUFILENBQWdCckwsV0FBaEIsRUFBNkIxUixRQUFRLENBQUN3YyxVQUF0QyxFQUFrRHJkLGlCQUFpQixDQUFDd2QsV0FBcEUsRUFBaUZyYyxRQUFqRjtBQUNIO0FBQ0osV0FMRCxNQUtPLElBQUlOLFFBQVEsQ0FBQzRjLFdBQVQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDakNodUIsWUFBQUEsRUFBRSxDQUFDb3VCLFVBQUgsQ0FBY3RMLFdBQWQsRUFBMkIxUixRQUFRLENBQUM4YyxXQUFwQyxFQUFpRDljLFFBQVEsQ0FBQzRjLFdBQTFEO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxNQUFNSyxNQUFNLEdBQUcsSUFBSTFZLEtBQUosQ0FBa0J4RyxRQUFRLENBQUNtZixLQUEzQixDQUFmOztBQUNPLFdBQVNDLHVCQUFULENBQWtDcmIsTUFBbEMsRUFBdURzYixVQUF2RCxFQUFvRjtBQUN2RkgsSUFBQUEsTUFBTSxDQUFDSSxJQUFQLENBQVksQ0FBWjs7QUFFQSxTQUFLLElBQUlwVyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbVcsVUFBVSxDQUFDdGMsSUFBWCxDQUFnQi9CLE1BQXBDLEVBQTRDLEVBQUVrSSxDQUE5QyxFQUFpRDtBQUM3QyxVQUFNcVcsR0FBRyxHQUFHRixVQUFVLENBQUN0YyxJQUFYLENBQWdCdU4sS0FBaEIsQ0FBc0JwSCxDQUF0QixDQUFaO0FBQ0EsVUFBTXNXLEtBQUssR0FBR04sTUFBTSxDQUFDSyxHQUFELENBQU4sRUFBZDs7QUFFQSxjQUFRQSxHQUFSO0FBQ0ksYUFBS3ZmLFFBQVEsQ0FBQ0ssaUJBQWQ7QUFBaUM7QUFDN0IsZ0JBQU1vZixJQUFJLEdBQUdKLFVBQVUsQ0FBQ3BjLG1CQUFYLENBQStCcU4sS0FBL0IsQ0FBcUNrUCxLQUFyQyxDQUFiO0FBQ0E1TCxZQUFBQSwyQkFBMkIsQ0FBQzdQLE1BQUQsRUFBUzBiLElBQUksQ0FBQ25mLGFBQWQsRUFBNkJtZixJQUFJLENBQUNsZixjQUFsQyxFQUFrRGtmLElBQUksQ0FBQ2pmLFVBQXZELEVBQ3ZCaWYsSUFBSSxDQUFDNWUsV0FEa0IsRUFDTDRlLElBQUksQ0FBQzNlLFVBREEsRUFDWTJlLElBQUksQ0FBQzFlLFlBRGpCLENBQTNCO0FBRUE7QUFDSDs7QUFDRDs7Ozs7Ozs7QUFPQSxhQUFLZixRQUFRLENBQUNrQixXQUFkO0FBQTJCO0FBQ3ZCLGdCQUFNd2UsSUFBSSxHQUFHTCxVQUFVLENBQUNuYyxjQUFYLENBQTBCb04sS0FBMUIsQ0FBZ0NrUCxLQUFoQyxDQUFiO0FBQ0F6SSxZQUFBQSxzQkFBc0IsQ0FBQ2hULE1BQUQsRUFBUzJiLElBQUksQ0FBQ3ZlLGdCQUFkLEVBQWdDdWUsSUFBSSxDQUFDdGUsaUJBQXJDLEVBQXdEc2UsSUFBSSxDQUFDcmUsaUJBQTdELEVBQWdGcWUsSUFBSSxDQUFDcGUsY0FBckYsRUFDbEJvZSxJQUFJLENBQUNuZSxRQURhLEVBQ0htZSxJQUFJLENBQUNsZSxPQURGLEVBQ1drZSxJQUFJLENBQUNqZSxTQURoQixFQUMyQmllLElBQUksQ0FBQ2hlLFNBRGhDLEVBQzJDZ2UsSUFBSSxDQUFDL2QsY0FEaEQsRUFFbEIrZCxJQUFJLENBQUM5ZCxXQUZhLEVBRUE4ZCxJQUFJLENBQUM3ZCxnQkFGTCxFQUV1QjZkLElBQUksQ0FBQzVkLGtCQUY1QixDQUF0QjtBQUdBO0FBQ0g7O0FBQ0QsYUFBSzlCLFFBQVEsQ0FBQ2dDLElBQWQ7QUFBb0I7QUFDaEIsZ0JBQU0yZCxJQUFJLEdBQUdOLFVBQVUsQ0FBQ2xjLFFBQVgsQ0FBb0JtTixLQUFwQixDQUEwQmtQLEtBQTFCLENBQWI7QUFDQXBCLFlBQUFBLGdCQUFnQixDQUFDcmEsTUFBRCxFQUFTNGIsSUFBSSxDQUFDMWQsUUFBZCxDQUFoQjtBQUNBO0FBQ0g7O0FBQ0QsYUFBS2pDLFFBQVEsQ0FBQ29DLGFBQWQ7QUFBNkI7QUFDekIsZ0JBQU13ZCxJQUFJLEdBQUdQLFVBQVUsQ0FBQ2pjLGdCQUFYLENBQTRCa04sS0FBNUIsQ0FBa0NrUCxLQUFsQyxDQUFiO0FBQ0F0WixZQUFBQSx3QkFBd0IsQ0FBQ25DLE1BQUQsRUFBUzZiLElBQUksQ0FBQ3ZkLFNBQWQsRUFBNEN1ZCxJQUFJLENBQUN0ZCxNQUFqRCxFQUE0RXNkLElBQUksQ0FBQ3JkLE1BQWpGLEVBQXlGcWQsSUFBSSxDQUFDcGQsSUFBOUYsQ0FBeEI7QUFDQTtBQUNIOztBQUNELGFBQUt4QyxRQUFRLENBQUMwQyxzQkFBZDtBQUFzQztBQUNsQyxnQkFBTW1kLElBQUksR0FBR1IsVUFBVSxDQUFDaGMsdUJBQVgsQ0FBbUNpTixLQUFuQyxDQUF5Q2tQLEtBQXpDLENBQWI7QUFDQU0sWUFBQUEsZ0NBQWdDLENBQUMvYixNQUFELEVBQVM4YixJQUFJLENBQUNqZCxPQUFkLEVBQXVCaWQsSUFBSSxDQUFDbGQsVUFBNUIsRUFBNERrZCxJQUFJLENBQUNoZCxPQUFqRSxDQUFoQztBQUNBO0FBQ0g7QUFuQ0wsT0FKNkMsQ0F3QzNDOztBQUNMLEtBNUNzRixDQTRDckY7O0FBQ0w7O0FBRU0sV0FBU2tkLGtDQUFULENBQ0hoYyxNQURHLEVBRUhpYyxTQUZHLEVBR0hyZCxVQUhHLEVBSUhFLE9BSkcsRUFJOEI7QUFFakMsUUFBTWhTLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCO0FBQ0EsUUFBTWdZLFNBQVMsR0FBRzlFLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQjZFLFVBQWxCLENBQTZCL0UsTUFBTSxDQUFDRSxVQUFQLENBQWtCOEUsT0FBL0MsQ0FBbEI7O0FBQ0EsUUFBSUYsU0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUM5WCxNQUFBQSxFQUFFLENBQUNtWSxXQUFILENBQWVyRyxVQUFVLENBQUNnQyxRQUExQixFQUFvQ2hDLFVBQVUsQ0FBQ2dHLFNBQS9DO0FBQ0FFLE1BQUFBLFNBQVMsQ0FBQ0YsU0FBVixHQUFzQmhHLFVBQVUsQ0FBQ2dHLFNBQWpDO0FBQ0g7O0FBRUQsUUFBSTJSLENBQUMsR0FBRyxDQUFSO0FBQ0EsUUFBSTVQLENBQUMsR0FBRyxDQUFSOztBQUVBLFlBQVEvSCxVQUFVLENBQUNnQyxRQUFuQjtBQUNJLFdBQUs5VCxFQUFFLENBQUM2VyxVQUFSO0FBQW9CO0FBQ2hCLGVBQUssSUFBSXdCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdyRyxPQUFPLENBQUM3QixNQUE1QixFQUFvQ2tJLENBQUMsRUFBckMsRUFBeUM7QUFDckMsZ0JBQU0rVyxNQUFNLEdBQUdwZCxPQUFPLENBQUNxRyxDQUFELENBQXRCLENBRHFDLENBRXJDOztBQUNBclksWUFBQUEsRUFBRSxDQUFDcXZCLGFBQUgsQ0FBaUJydkIsRUFBRSxDQUFDNlcsVUFBcEIsRUFBZ0N1WSxNQUFNLENBQUNFLFNBQVAsQ0FBaUJoWCxRQUFqRCxFQUNJOFcsTUFBTSxDQUFDRyxTQUFQLENBQWlCL0wsQ0FEckIsRUFDd0I0TCxNQUFNLENBQUNHLFNBQVAsQ0FBaUI3TCxDQUR6QyxFQUVJNVIsVUFBVSxDQUFDd0UsUUFGZixFQUV5QnhFLFVBQVUsQ0FBQ2xELE1BRnBDLEVBRTRDdWdCLFNBQVMsQ0FBQzFGLENBQUMsRUFBRixDQUZyRDtBQUdIOztBQUNEO0FBQ0g7O0FBQ0QsV0FBS3pwQixFQUFFLENBQUMyWixnQkFBUjtBQUEwQjtBQUN0QixlQUFLLElBQUl0QixJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHckcsT0FBTyxDQUFDN0IsTUFBNUIsRUFBb0NrSSxJQUFDLEVBQXJDLEVBQXlDO0FBQ3JDLGdCQUFNK1csT0FBTSxHQUFHcGQsT0FBTyxDQUFDcUcsSUFBRCxDQUF0QixDQURxQyxDQUVyQzs7QUFDQSxnQkFBTW1YLE1BQU0sR0FBR0osT0FBTSxDQUFDRSxTQUFQLENBQWlCRyxjQUFqQixHQUFrQ0wsT0FBTSxDQUFDRSxTQUFQLENBQWlCSSxVQUFsRTs7QUFDQSxpQkFBSzdWLENBQUMsR0FBR3VWLE9BQU0sQ0FBQ0UsU0FBUCxDQUFpQkcsY0FBMUIsRUFBMEM1VixDQUFDLEdBQUcyVixNQUE5QyxFQUFzRCxFQUFFM1YsQ0FBeEQsRUFBMkQ7QUFDdkQ3WixjQUFBQSxFQUFFLENBQUNxdkIsYUFBSCxDQUFpQnJ2QixFQUFFLENBQUM4WiwyQkFBSCxHQUFpQ0QsQ0FBbEQsRUFBcUR1VixPQUFNLENBQUNFLFNBQVAsQ0FBaUJoWCxRQUF0RSxFQUNJOFcsT0FBTSxDQUFDRyxTQUFQLENBQWlCL0wsQ0FEckIsRUFDd0I0TCxPQUFNLENBQUNHLFNBQVAsQ0FBaUI3TCxDQUR6QyxFQUVJNVIsVUFBVSxDQUFDd0UsUUFGZixFQUV5QnhFLFVBQVUsQ0FBQ2xELE1BRnBDLEVBRTRDdWdCLFNBQVMsQ0FBQzFGLENBQUMsRUFBRixDQUZyRDtBQUdIO0FBQ0o7O0FBQ0Q7QUFDSDs7QUFDRDtBQUFTO0FBQ0xyZCxVQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw2REFBZDtBQUNIO0FBMUJMOztBQTZCQSxRQUFLeUYsVUFBVSxDQUFDNmQsS0FBWCxHQUFtQkMsMEJBQWtCQyxVQUF0QyxJQUNBL2QsVUFBVSxDQUFDOEcsVUFEZixFQUMyQjtBQUN2QjVZLE1BQUFBLEVBQUUsQ0FBQzh2QixjQUFILENBQWtCaGUsVUFBVSxDQUFDZ0MsUUFBN0I7QUFDSDtBQUNKOztBQUVNLFdBQVNtYixnQ0FBVCxDQUNIL2IsTUFERyxFQUVIbkIsT0FGRyxFQUdIRCxVQUhHLEVBSUhFLE9BSkcsRUFJOEI7QUFFakMsUUFBTWhTLEVBQUUsR0FBR2tULE1BQU0sQ0FBQ2xULEVBQWxCO0FBQ0EsUUFBTWdZLFNBQVMsR0FBRzlFLE1BQU0sQ0FBQ0UsVUFBUCxDQUFrQjZFLFVBQWxCLENBQTZCL0UsTUFBTSxDQUFDRSxVQUFQLENBQWtCOEUsT0FBL0MsQ0FBbEI7O0FBQ0EsUUFBSUYsU0FBUyxDQUFDRixTQUFWLEtBQXdCaEcsVUFBVSxDQUFDZ0csU0FBdkMsRUFBa0Q7QUFDOUM5WCxNQUFBQSxFQUFFLENBQUNtWSxXQUFILENBQWVyRyxVQUFVLENBQUNnQyxRQUExQixFQUFvQ2hDLFVBQVUsQ0FBQ2dHLFNBQS9DO0FBQ0FFLE1BQUFBLFNBQVMsQ0FBQ0YsU0FBVixHQUFzQmhHLFVBQVUsQ0FBQ2dHLFNBQWpDO0FBQ0g7O0FBRUQsUUFBSTJSLENBQUMsR0FBRyxDQUFSO0FBQ0EsUUFBSWxULENBQUMsR0FBRyxDQUFSO0FBQ0EsUUFBSUUsQ0FBQyxHQUFHLENBQVI7QUFDQSxRQUFJb0QsQ0FBQyxHQUFHLENBQVI7QUFFQSxRQUFNa1csT0FBc0IsR0FBRzVZLHVCQUFlckYsVUFBVSxDQUFDL1IsTUFBMUIsQ0FBL0I7QUFDQSxRQUFNcVksWUFBWSxHQUFHMlgsT0FBTyxDQUFDM1gsWUFBN0I7O0FBQ0EsWUFBUXRHLFVBQVUsQ0FBQ2dDLFFBQW5CO0FBQ0ksV0FBSzlULEVBQUUsQ0FBQzZXLFVBQVI7QUFBb0I7QUFDaEIsZUFBSyxJQUFJd0IsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3JHLE9BQU8sQ0FBQzdCLE1BQTVCLEVBQW9Da0ksQ0FBQyxFQUFyQyxFQUF5QztBQUNyQyxnQkFBTStXLE1BQU0sR0FBR3BkLE9BQU8sQ0FBQ3FHLENBQUQsQ0FBdEI7QUFDQTlCLFlBQUFBLENBQUMsR0FBRzZZLE1BQU0sQ0FBQ1ksU0FBUCxDQUFpQnhaLEtBQXJCO0FBQ0FDLFlBQUFBLENBQUMsR0FBRzJZLE1BQU0sQ0FBQ1ksU0FBUCxDQUFpQnRaLE1BQXJCLENBSHFDLENBSXJDOztBQUVBLGdCQUFNdVosTUFBTSxHQUFHbGUsT0FBTyxDQUFDMFgsQ0FBQyxFQUFGLENBQXRCOztBQUNBLGdCQUFJLENBQUNyUixZQUFMLEVBQW1CO0FBQ2ZwWSxjQUFBQSxFQUFFLENBQUNxdkIsYUFBSCxDQUFpQnJ2QixFQUFFLENBQUM2VyxVQUFwQixFQUFnQ3VZLE1BQU0sQ0FBQ0UsU0FBUCxDQUFpQmhYLFFBQWpELEVBQ0k4VyxNQUFNLENBQUNHLFNBQVAsQ0FBaUIvTCxDQURyQixFQUN3QjRMLE1BQU0sQ0FBQ0csU0FBUCxDQUFpQjdMLENBRHpDLEVBQzRDbk4sQ0FENUMsRUFDK0NFLENBRC9DLEVBRUkzRSxVQUFVLENBQUN3RSxRQUZmLEVBRXlCeEUsVUFBVSxDQUFDbEQsTUFGcEMsRUFFNENxaEIsTUFGNUM7QUFHSCxhQUpELE1BSU87QUFDSCxrQkFBSW5lLFVBQVUsQ0FBQ3VFLGFBQVgsS0FBNkI1VixzQkFBUzhJLHlCQUExQyxFQUFxRTtBQUNqRXZKLGdCQUFBQSxFQUFFLENBQUNrd0IsdUJBQUgsQ0FBMkJsd0IsRUFBRSxDQUFDNlcsVUFBOUIsRUFBMEN1WSxNQUFNLENBQUNFLFNBQVAsQ0FBaUJoWCxRQUEzRCxFQUNJOFcsTUFBTSxDQUFDRyxTQUFQLENBQWlCL0wsQ0FEckIsRUFDd0I0TCxNQUFNLENBQUNHLFNBQVAsQ0FBaUI3TCxDQUR6QyxFQUM0Q25OLENBRDVDLEVBQytDRSxDQUQvQyxFQUVJM0UsVUFBVSxDQUFDd0UsUUFGZixFQUV5QjJaLE1BRnpCO0FBR0gsZUFKRCxNQUlPO0FBQ0gsb0JBQUluZSxVQUFVLENBQUN1RSxhQUFYLEtBQTZCNVYsc0JBQVM4SSx5QkFBdEMsSUFBbUUySixNQUFNLENBQUNpZCx5QkFBOUUsRUFBeUc7QUFDckdud0Isa0JBQUFBLEVBQUUsQ0FBQzJZLG9CQUFILENBQXdCM1ksRUFBRSxDQUFDNlcsVUFBM0IsRUFBdUN1WSxNQUFNLENBQUNFLFNBQVAsQ0FBaUJoWCxRQUF4RCxFQUNJeEcsVUFBVSxDQUFDdUUsYUFEZixFQUM4QkUsQ0FEOUIsRUFDaUNFLENBRGpDLEVBQ29DLENBRHBDLEVBQ3VDd1osTUFEdkM7QUFFSCxpQkFIRCxNQUdPO0FBQ0hqd0Isa0JBQUFBLEVBQUUsQ0FBQ2t3Qix1QkFBSCxDQUEyQmx3QixFQUFFLENBQUM2VyxVQUE5QixFQUEwQ3VZLE1BQU0sQ0FBQ0UsU0FBUCxDQUFpQmhYLFFBQTNELEVBQ0k4VyxNQUFNLENBQUNHLFNBQVAsQ0FBaUIvTCxDQURyQixFQUN3QjRMLE1BQU0sQ0FBQ0csU0FBUCxDQUFpQjdMLENBRHpDLEVBQzRDbk4sQ0FENUMsRUFDK0NFLENBRC9DLEVBRUkzRSxVQUFVLENBQUN3RSxRQUZmLEVBRXlCMlosTUFGekI7QUFHSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRDtBQUNIOztBQUNELFdBQUtqd0IsRUFBRSxDQUFDMlosZ0JBQVI7QUFBMEI7QUFDdEIsZUFBSyxJQUFJdEIsSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR3JHLE9BQU8sQ0FBQzdCLE1BQTVCLEVBQW9Da0ksSUFBQyxFQUFyQyxFQUF5QztBQUNyQyxnQkFBTStXLFFBQU0sR0FBR3BkLE9BQU8sQ0FBQ3FHLElBQUQsQ0FBdEI7QUFDQSxnQkFBTW1YLE1BQU0sR0FBR0osUUFBTSxDQUFDRSxTQUFQLENBQWlCRyxjQUFqQixHQUFrQ0wsUUFBTSxDQUFDRSxTQUFQLENBQWlCSSxVQUFsRTs7QUFDQSxpQkFBSzdWLENBQUMsR0FBR3VWLFFBQU0sQ0FBQ0UsU0FBUCxDQUFpQkcsY0FBMUIsRUFBMEM1VixDQUFDLEdBQUcyVixNQUE5QyxFQUFzRCxFQUFFM1YsQ0FBeEQsRUFBMkQ7QUFDdkR0RCxjQUFBQSxDQUFDLEdBQUc2WSxRQUFNLENBQUNZLFNBQVAsQ0FBaUJ4WixLQUFyQjtBQUNBQyxjQUFBQSxDQUFDLEdBQUcyWSxRQUFNLENBQUNZLFNBQVAsQ0FBaUJ0WixNQUFyQixDQUZ1RCxDQUd2RDs7QUFFQSxrQkFBTXVaLE9BQU0sR0FBR2xlLE9BQU8sQ0FBQzBYLENBQUMsRUFBRixDQUF0Qjs7QUFDQSxrQkFBSSxDQUFDclIsWUFBTCxFQUFtQjtBQUNmcFksZ0JBQUFBLEVBQUUsQ0FBQ3F2QixhQUFILENBQWlCcnZCLEVBQUUsQ0FBQzhaLDJCQUFILEdBQWlDRCxDQUFsRCxFQUFxRHVWLFFBQU0sQ0FBQ0UsU0FBUCxDQUFpQmhYLFFBQXRFLEVBQ0k4VyxRQUFNLENBQUNHLFNBQVAsQ0FBaUIvTCxDQURyQixFQUN3QjRMLFFBQU0sQ0FBQ0csU0FBUCxDQUFpQjdMLENBRHpDLEVBQzRDbk4sQ0FENUMsRUFDK0NFLENBRC9DLEVBRUkzRSxVQUFVLENBQUN3RSxRQUZmLEVBRXlCeEUsVUFBVSxDQUFDbEQsTUFGcEMsRUFFNENxaEIsT0FGNUM7QUFHSCxlQUpELE1BSU87QUFDSCxvQkFBSW5lLFVBQVUsQ0FBQ3VFLGFBQVgsS0FBNkI1VixzQkFBUzhJLHlCQUExQyxFQUFxRTtBQUNqRXZKLGtCQUFBQSxFQUFFLENBQUNrd0IsdUJBQUgsQ0FBMkJsd0IsRUFBRSxDQUFDOFosMkJBQUgsR0FBaUNELENBQTVELEVBQStEdVYsUUFBTSxDQUFDRSxTQUFQLENBQWlCaFgsUUFBaEYsRUFDSThXLFFBQU0sQ0FBQ0csU0FBUCxDQUFpQi9MLENBRHJCLEVBQ3dCNEwsUUFBTSxDQUFDRyxTQUFQLENBQWlCN0wsQ0FEekMsRUFDNENuTixDQUQ1QyxFQUMrQ0UsQ0FEL0MsRUFFSTNFLFVBQVUsQ0FBQ3dFLFFBRmYsRUFFeUIyWixPQUZ6QjtBQUdILGlCQUpELE1BSU87QUFDSCxzQkFBSW5lLFVBQVUsQ0FBQ3VFLGFBQVgsS0FBNkI1VixzQkFBUzhJLHlCQUExQyxFQUFxRTtBQUNqRXZKLG9CQUFBQSxFQUFFLENBQUNrd0IsdUJBQUgsQ0FBMkJsd0IsRUFBRSxDQUFDOFosMkJBQUgsR0FBaUNELENBQTVELEVBQStEdVYsUUFBTSxDQUFDRSxTQUFQLENBQWlCaFgsUUFBaEYsRUFDSThXLFFBQU0sQ0FBQ0csU0FBUCxDQUFpQi9MLENBRHJCLEVBQ3dCNEwsUUFBTSxDQUFDRyxTQUFQLENBQWlCN0wsQ0FEekMsRUFDNENuTixDQUQ1QyxFQUMrQ0UsQ0FEL0MsRUFFSTNFLFVBQVUsQ0FBQ3dFLFFBRmYsRUFFeUIyWixPQUZ6QjtBQUdILG1CQUpELE1BSU87QUFDSGp3QixvQkFBQUEsRUFBRSxDQUFDMlksb0JBQUgsQ0FBd0IzWSxFQUFFLENBQUM4WiwyQkFBSCxHQUFpQ0QsQ0FBekQsRUFBNER1VixRQUFNLENBQUNFLFNBQVAsQ0FBaUJoWCxRQUE3RSxFQUNJeEcsVUFBVSxDQUFDdUUsYUFEZixFQUM4QkUsQ0FEOUIsRUFDaUNFLENBRGpDLEVBQ29DLENBRHBDLEVBQ3VDd1osT0FEdkM7QUFFSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztBQUNEO0FBQ0g7O0FBQ0Q7QUFBUztBQUNMN2pCLFVBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjLDZEQUFkO0FBQ0g7QUFyRUw7O0FBd0VBLFFBQUl5RixVQUFVLENBQUM2ZCxLQUFYLEdBQW1CQywwQkFBa0JDLFVBQXpDLEVBQXFEO0FBQ2pEN3ZCLE1BQUFBLEVBQUUsQ0FBQzh2QixjQUFILENBQWtCaGUsVUFBVSxDQUFDZ0MsUUFBN0I7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgV0VDSEFUIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgQ2FjaGVkQXJyYXkgfSBmcm9tICcuLi8uLi9tZW1vcC9jYWNoZWQtYXJyYXknO1xyXG5pbXBvcnQgeyBlcnJvciwgZXJyb3JJRCB9IGZyb20gJy4uLy4uL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyU291cmNlLCBHRlhEcmF3SW5mbywgR0ZYSW5kaXJlY3RCdWZmZXIgfSBmcm9tICcuLi9idWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTENvbW1hbmRBbGxvY2F0b3IgfSBmcm9tICcuL3dlYmdsLWNvbW1hbmQtYWxsb2NhdG9yJztcclxuaW1wb3J0IHsgSVdlYkdMRGVwdGhCaWFzLCBJV2ViR0xEZXB0aEJvdW5kcywgSVdlYkdMU3RlbmNpbENvbXBhcmVNYXNrLCBJV2ViR0xTdGVuY2lsV3JpdGVNYXNrIH0gZnJvbSAnLi93ZWJnbC1jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMRVhUIH0gZnJvbSAnLi93ZWJnbC1kZWZpbmUnO1xyXG5pbXBvcnQgeyBXZWJHTERldmljZSB9IGZyb20gJy4vd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgSVdlYkdMR1BVSW5wdXRBc3NlbWJsZXIsIElXZWJHTEdQVVVuaWZvcm0sIElXZWJHTEF0dHJpYiwgSVdlYkdMR1BVRGVzY3JpcHRvclNldCwgSVdlYkdMR1BVQnVmZmVyLCBJV2ViR0xHUFVGcmFtZWJ1ZmZlciwgSVdlYkdMR1BVSW5wdXQsXHJcbiAgICBJV2ViR0xHUFVQaXBlbGluZVN0YXRlLCBJV2ViR0xHUFVTaGFkZXIsIElXZWJHTEdQVVRleHR1cmUsIElXZWJHTEdQVVVuaWZvcm1CbG9jaywgSVdlYkdMR1BVVW5pZm9ybVNhbXBsZXIsIElXZWJHTEdQVVJlbmRlclBhc3MgfSBmcm9tICcuL3dlYmdsLWdwdS1vYmplY3RzJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyVGV4dHVyZUNvcHksIEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhDbGVhckZsYWcsIEdGWENvbG9yTWFzaywgR0ZYQ3VsbE1vZGUsIEdGWEZvcm1hdCxcclxuICAgIEdGWEZvcm1hdEluZm9zLCBHRlhGb3JtYXRTaXplLCBHRlhMb2FkT3AsIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhTYW1wbGVDb3VudCwgR0ZYU2hhZGVyU3RhZ2VGbGFnQml0LCBHRlhTdGVuY2lsRmFjZSxcclxuICAgIEdGWFRleHR1cmVGbGFnQml0LCBHRlhUZXh0dXJlVHlwZSwgR0ZYVHlwZSwgR0ZYQ29sb3IsIEdGWEZvcm1hdEluZm8sIEdGWFJlY3QsIEdGWFZpZXdwb3J0LCBHRlhEeW5hbWljU3RhdGVGbGFnQml0IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBHRlhGb3JtYXRUb1dlYkdMVHlwZSAoZm9ybWF0OiBHRlhGb3JtYXQsIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBHTGVudW0ge1xyXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhTTjogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhVSTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjhJOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMTZGOiByZXR1cm4gV2ViR0xFWFQuSEFMRl9GTE9BVF9PRVM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjE2VUk6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUjMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIzMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkc4U046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHOFVJOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzhJOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzE2RjogcmV0dXJuIFdlYkdMRVhULkhBTEZfRkxPQVRfT0VTO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMTZVSTogcmV0dXJuIGdsLlVOU0lHTkVEX1NIT1JUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkczMkY6IHJldHVybiBnbC5GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SRzMyVUk6IHJldHVybiBnbC5VTlNJR05FRF9JTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkczMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlNSR0I4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I4U046IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjhVSTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCOEk6IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjE2RjogcmV0dXJuIFdlYkdMRVhULkhBTEZfRkxPQVRfT0VTO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjE2VUk6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxNkk6IHJldHVybiBnbC5TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IzMkY6IHJldHVybiBnbC5GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IzMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjMySTogcmV0dXJuIGdsLklOVDtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkdSQTg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5TUkdCOF9BODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQThTTjogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQThVSTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQThJOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZGOiByZXR1cm4gV2ViR0xFWFQuSEFMRl9GTE9BVF9PRVM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTE2VUk6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZJOiByZXR1cm4gZ2wuU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTMyRjogcmV0dXJuIGdsLkZMT0FUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMlVJOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMkk6IHJldHVybiBnbC5JTlQ7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI1RzZCNTogcmV0dXJuIGdsLlVOU0lHTkVEX1NIT1JUXzVfNl81O1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlIxMUcxMUIxMEY6IHJldHVybiBnbC5GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I1QTE6IHJldHVybiBnbC5VTlNJR05FRF9TSE9SVF81XzVfNV8xO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE0OiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlRfNF80XzRfNDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxMEEyOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IxMEEyVUk6IHJldHVybiBnbC5VTlNJR05FRF9JTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCOUU1OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDE2OiByZXR1cm4gZ2wuVU5TSUdORURfU0hPUlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDE2Uzg6IHJldHVybiBXZWJHTEVYVC5VTlNJR05FRF9JTlRfMjRfOF9XRUJHTDsgLy8gbm90IHN1cHBvcnRlZCwgZmFsbGJhY2tcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMjQ6IHJldHVybiBnbC5VTlNJR05FRF9JTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDI0Uzg6IHJldHVybiBXZWJHTEVYVC5VTlNJR05FRF9JTlRfMjRfOF9XRUJHTDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMzJGOiByZXR1cm4gZ2wuVU5TSUdORURfSU5UOyAvLyBub3Qgc3VwcG9ydGVkLCBmYWxsYmFja1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkZfUzg6IHJldHVybiBXZWJHTEVYVC5VTlNJR05FRF9JTlRfMjRfOF9XRUJHTDsgLy8gbm90IHN1cHBvcnRlZCwgZmFsbGJhY2tcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMyOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzJfU1JHQjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzNfU1JHQjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM0OiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzRfU05PUk06IHJldHVybiBnbC5CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDNTogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM1X1NOT1JNOiByZXR1cm4gZ2wuQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzZIX1NGMTY6IHJldHVybiBnbC5GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzZIX1VGMTY6IHJldHVybiBnbC5GTE9BVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzc6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDN19TUkdCOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDX1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCODogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4X0ExOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4X0ExOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjg6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SMTE6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SMTFTTjogcmV0dXJuIGdsLkJZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1JHMTE6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SRzExU046IHJldHVybiBnbC5CWVRFO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0IyOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0JBMjogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCNDogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVENfUkdCQTQ6IHJldHVybiBnbC5VTlNJR05FRF9CWVRFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDMl8yQlBQOiByZXR1cm4gZ2wuVU5TSUdORURfQllURTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQzJfNEJQUDogcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV80eDQ6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzV4NDpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfNXg1OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzZ4NjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfOHg1OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDY6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4ODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4NjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4ODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4MTA6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEyeDEwOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMngxMjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzR4NDpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NDpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NjpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4ODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDU6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg2OlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4ODpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDEwOlxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTA6XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMngxMjpcclxuICAgICAgICAgICAgcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsLlVOU0lHTkVEX0JZVEU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR0ZYRm9ybWF0VG9XZWJHTEludGVybmFsRm9ybWF0IChmb3JtYXQ6IEdGWEZvcm1hdCwgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCk6IEdMZW51bSB7XHJcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkE4OiByZXR1cm4gZ2wuQUxQSEE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuTDg6IHJldHVybiBnbC5MVU1JTkFOQ0U7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuTEE4OiByZXR1cm4gZ2wuTFVNSU5BTkNFX0FMUEhBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjg6IHJldHVybiBnbC5SR0I7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCMTZGOiByZXR1cm4gZ2wuUkdCO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjMyRjogcmV0dXJuIGdsLlJHQjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CR1JBODogcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCQTg6IHJldHVybiBnbC5SR0JBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkExNkY6IHJldHVybiBnbC5SR0JBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkEzMkY6IHJldHVybiBnbC5SR0JBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlI1RzZCNTogcmV0dXJuIGdsLlJHQjU2NTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I1QTE6IHJldHVybiBnbC5SR0I1X0ExO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE0OiByZXR1cm4gZ2wuUkdCQTQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDE2OiByZXR1cm4gZ2wuREVQVEhfQ09NUE9ORU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQxNlM4OiByZXR1cm4gZ2wuREVQVEhfU1RFTkNJTDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMjQ6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDI0Uzg6IHJldHVybiBnbC5ERVBUSF9TVEVOQ0lMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkY6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDMyRl9TODogcmV0dXJuIGdsLkRFUFRIX1NURU5DSUw7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX0FMUEhBOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQl9BTFBIQTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDFfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMl9TUkdCOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUM19FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVDtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDX1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCOF9FVEMyO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9QVU5DSFRIUk9VR0hfQUxQSEExX0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0JBODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQThfRVRDMl9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCOF9BODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0VUQzJfRUFDO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SMTE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1IxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1IxMVNOOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TSUdORURfUjExX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkcxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1JHMTFTTjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU0lHTkVEX1JHMTFfRUFDO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0IyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNRztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0JBMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9QVlJUQ18yQlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9QVlJUQ180QlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkE0OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzRCUFBWMV9JTUc7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV80eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ180eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHg1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHgxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDEwX0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTA6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMngxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEyeDEyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTJfS0hSO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzR4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNHg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4Nl9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDEwOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHgxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMngxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTBfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTI6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEyeDEyX0tIUjtcclxuXHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhGb3JtYXQsIGNvbnZlcnQgdG8gV2ViR0wgaW50ZXJuYWwgZm9ybWF0IGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdCAoZm9ybWF0OiBHRlhGb3JtYXQsIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBHTGVudW0ge1xyXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BODogcmV0dXJuIGdsLkFMUEhBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0Lkw4OiByZXR1cm4gZ2wuTFVNSU5BTkNFO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkxBODogcmV0dXJuIGdsLkxVTUlOQU5DRV9BTFBIQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0I4OiByZXR1cm4gZ2wuUkdCO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQjE2RjogcmV0dXJuIGdsLlJHQjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0IzMkY6IHJldHVybiBnbC5SR0I7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkdSQTg6IHJldHVybiBnbC5SR0JBO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlJHQkE4OiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMTZGOiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBMzJGOiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SNUc2QjU6IHJldHVybiBnbC5SR0I7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuUkdCNUExOiByZXR1cm4gZ2wuUkdCQTtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5SR0JBNDogcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDE2OiByZXR1cm4gZ2wuREVQVEhfQ09NUE9ORU5UO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQxNlM4OiByZXR1cm4gZ2wuREVQVEhfU1RFTkNJTDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5EMjQ6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDI0Uzg6IHJldHVybiBnbC5ERVBUSF9TVEVOQ0lMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkQzMkY6IHJldHVybiBnbC5ERVBUSF9DT01QT05FTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRDMyRl9TODogcmV0dXJuIGdsLkRFUFRIX1NURU5DSUw7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX0FMUEhBOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUMV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfUzNUQ19EWFQxX0VYVDtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQl9BTFBIQTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQl9BTFBIQV9TM1RDX0RYVDFfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9TM1RDX0RYVDNfRVhUO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMl9TUkdCOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCX0FMUEhBX1MzVENfRFhUM19FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1MzVENfRFhUNV9FWFQ7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzX1NSR0I6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0JfQUxQSEFfUzNUQ19EWFQ1X0VYVDtcclxuXHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDX1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCOF9FVEMyO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0I4X1BVTkNIVEhST1VHSF9BTFBIQTFfRVRDMjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FVEMyX1NSR0I4X0ExOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9QVU5DSFRIUk9VR0hfQUxQSEExX0VUQzI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0JBODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQThfRVRDMl9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCOF9BODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0VUQzJfRUFDO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SMTE6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1IxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1IxMVNOOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TSUdORURfUjExX0VBQztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkcxMV9FQUM7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuRUFDX1JHMTFTTjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU0lHTkVEX1JHMTFfRUFDO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0IyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfUFZSVENfMkJQUFYxX0lNRztcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0JBMjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9QVlJUQ18yQlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9QVlJUQ180QlBQVjFfSU1HO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkE0OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX1BWUlRDXzRCUFBWMV9JTUc7XHJcblxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV80eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ180eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDQ6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDRfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ181eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV82eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ182eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDZfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDg6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ184eDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHg1OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTB4NV9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDY6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDhfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHgxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfUkdCQV9BU1RDXzEweDEwX0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTA6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQkFfQVNUQ18xMngxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEyeDEyOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JBX0FTVENfMTJ4MTJfS0hSO1xyXG5cclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzR4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNHg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg0X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNXg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfNng2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NTogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg1X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg2X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4ODogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfOHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDU6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEweDVfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NjogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTB4Nl9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg4OiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHg4X0tIUjtcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDEwOiByZXR1cm4gV2ViR0xFWFQuQ09NUFJFU1NFRF9TUkdCOF9BTFBIQThfQVNUQ18xMHgxMF9LSFI7XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMngxMDogcmV0dXJuIFdlYkdMRVhULkNPTVBSRVNTRURfU1JHQjhfQUxQSEE4X0FTVENfMTJ4MTBfS0hSO1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTI6IHJldHVybiBXZWJHTEVYVC5DT01QUkVTU0VEX1NSR0I4X0FMUEhBOF9BU1RDXzEyeDEyX0tIUjtcclxuXHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhGb3JtYXQsIGNvbnZlcnQgdG8gV2ViR0wgZm9ybWF0IGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGdsLlJHQkE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBHRlhUeXBlVG9XZWJHTFR5cGUgKHR5cGU6IEdGWFR5cGUsIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBHTGVudW0ge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0w6IHJldHVybiBnbC5CT09MO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MMjogcmV0dXJuIGdsLkJPT0xfVkVDMjtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDM6IHJldHVybiBnbC5CT09MX1ZFQzM7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0w0OiByZXR1cm4gZ2wuQk9PTF9WRUM0O1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQ6IHJldHVybiBnbC5JTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLklOVDI6IHJldHVybiBnbC5JTlRfVkVDMjtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UMzogcmV0dXJuIGdsLklOVF9WRUMzO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQ0OiByZXR1cm4gZ2wuSU5UX1ZFQzQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLlVJTlQ6IHJldHVybiBnbC5VTlNJR05FRF9JTlQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUOiByZXR1cm4gZ2wuRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUMjogcmV0dXJuIGdsLkZMT0FUX1ZFQzI7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUMzogcmV0dXJuIGdsLkZMT0FUX1ZFQzM7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUNDogcmV0dXJuIGdsLkZMT0FUX1ZFQzQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDI6IHJldHVybiBnbC5GTE9BVF9NQVQyO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQzOiByZXR1cm4gZ2wuRkxPQVRfTUFUMztcclxuICAgICAgICBjYXNlIEdGWFR5cGUuTUFUNDogcmV0dXJuIGdsLkZMT0FUX01BVDQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVIyRDogcmV0dXJuIGdsLlNBTVBMRVJfMkQ7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVJfQ1VCRTogcmV0dXJuIGdsLlNBTVBMRVJfQ1VCRTtcclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdMVHlwZSwgY29udmVydCB0byBHTCB0eXBlIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIEdGWFR5cGUuVU5LTk9XTjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEdGWFR5cGVUb1R5cGVkQXJyYXlDdG9yICh0eXBlOiBHRlhUeXBlKSB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDpcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDI6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0wzOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5CT09MNDpcclxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQyOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQzOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQ0OlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5VSU5UOlxyXG4gICAgICAgICAgICByZXR1cm4gSW50MzJBcnJheTtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuRkxPQVQ6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkZMT0FUMjpcclxuICAgICAgICBjYXNlIEdGWFR5cGUuRkxPQVQzOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDQ6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDI6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDM6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLk1BVDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBGbG9hdDMyQXJyYXk7XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHTFR5cGUsIGNvbnZlcnQgdG8gVHlwZWRBcnJheUNvbnN0cnVjdG9yIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIEZsb2F0MzJBcnJheTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdlYkdMVHlwZVRvR0ZYVHlwZSAoZ2xUeXBlOiBHTGVudW0sIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpOiBHRlhUeXBlIHtcclxuICAgIHN3aXRjaCAoZ2xUeXBlKSB7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MOiByZXR1cm4gR0ZYVHlwZS5CT09MO1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMyOiByZXR1cm4gR0ZYVHlwZS5CT09MMjtcclxuICAgICAgICBjYXNlIGdsLkJPT0xfVkVDMzogcmV0dXJuIEdGWFR5cGUuQk9PTDM7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzQ6IHJldHVybiBHRlhUeXBlLkJPT0w0O1xyXG4gICAgICAgIGNhc2UgZ2wuSU5UOiByZXR1cm4gR0ZYVHlwZS5JTlQ7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDMjogcmV0dXJuIEdGWFR5cGUuSU5UMjtcclxuICAgICAgICBjYXNlIGdsLklOVF9WRUMzOiByZXR1cm4gR0ZYVHlwZS5JTlQzO1xyXG4gICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzQ6IHJldHVybiBHRlhUeXBlLklOVDQ7XHJcbiAgICAgICAgY2FzZSBnbC5VTlNJR05FRF9JTlQ6IHJldHVybiBHRlhUeXBlLlVJTlQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVDogcmV0dXJuIEdGWFR5cGUuRkxPQVQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9WRUMyOiByZXR1cm4gR0ZYVHlwZS5GTE9BVDI7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9WRUMzOiByZXR1cm4gR0ZYVHlwZS5GTE9BVDM7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9WRUM0OiByZXR1cm4gR0ZYVHlwZS5GTE9BVDQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyOiByZXR1cm4gR0ZYVHlwZS5NQVQyO1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUMzogcmV0dXJuIEdGWFR5cGUuTUFUMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDQ6IHJldHVybiBHRlhUeXBlLk1BVDQ7XHJcbiAgICAgICAgY2FzZSBnbC5TQU1QTEVSXzJEOiByZXR1cm4gR0ZYVHlwZS5TQU1QTEVSMkQ7XHJcbiAgICAgICAgY2FzZSBnbC5TQU1QTEVSX0NVQkU6IHJldHVybiBHRlhUeXBlLlNBTVBMRVJfQ1VCRTtcclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdMVHlwZSwgY29udmVydCB0byBHRlhUeXBlIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIEdGWFR5cGUuVU5LTk9XTjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdlYkdMR2V0VHlwZVNpemUgKGdsVHlwZTogR0xlbnVtLCBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogR0ZYVHlwZSB7XHJcbiAgICBzd2l0Y2ggKGdsVHlwZSkge1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzI6IHJldHVybiA4O1xyXG4gICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMzOiByZXR1cm4gMTI7XHJcbiAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLklOVDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDMjogcmV0dXJuIDg7XHJcbiAgICAgICAgY2FzZSBnbC5JTlRfVkVDMzogcmV0dXJuIDEyO1xyXG4gICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLlVOU0lHTkVEX0lOVDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVDogcmV0dXJuIDQ7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9WRUMyOiByZXR1cm4gODtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzM6IHJldHVybiAxMjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzQ6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDI6IHJldHVybiAxNjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDM6IHJldHVybiAzNjtcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDQ6IHJldHVybiA2NDtcclxuICAgICAgICBjYXNlIGdsLlNBTVBMRVJfMkQ6IHJldHVybiA0O1xyXG4gICAgICAgIGNhc2UgZ2wuU0FNUExFUl9DVUJFOiByZXR1cm4gNDtcclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdMVHlwZSwgZ2V0IHR5cGUgZmFpbGVkLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFdlYkdMR2V0Q29tcG9uZW50Q291bnQgKGdsVHlwZTogR0xlbnVtLCBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0KTogR0ZYVHlwZSB7XHJcbiAgICBzd2l0Y2ggKGdsVHlwZSkge1xyXG4gICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUMjogcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQzOiByZXR1cm4gMztcclxuICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDQ6IHJldHVybiA0O1xyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBXZWJHTENtcEZ1bmNzOiBHTGVudW1bXSA9IFtcclxuICAgIDB4MDIwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5FVkVSLFxyXG4gICAgMHgwMjAxLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTEVTUyxcclxuICAgIDB4MDIwMiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkVRVUFMLFxyXG4gICAgMHgwMjAzLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuTEVRVUFMLFxyXG4gICAgMHgwMjA0LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuR1JFQVRFUixcclxuICAgIDB4MDIwNSwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk5PVEVRVUFMLFxyXG4gICAgMHgwMjA2LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuR0VRVUFMLFxyXG4gICAgMHgwMjA3LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuQUxXQVlTLFxyXG5dO1xyXG5cclxuY29uc3QgV2ViR0xTdGVuY2lsT3BzOiBHTGVudW1bXSA9IFtcclxuICAgIDB4MDAwMCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlpFUk8sXHJcbiAgICAweDFFMDAsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5LRUVQLFxyXG4gICAgMHgxRTAxLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuUkVQTEFDRSxcclxuICAgIDB4MUUwMiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LklOQ1IsXHJcbiAgICAweDFFMDMsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5ERUNSLFxyXG4gICAgMHgxNTBBLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuSU5WRVJULFxyXG4gICAgMHg4NTA3LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuSU5DUl9XUkFQLFxyXG4gICAgMHg4NTA4LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuREVDUl9XUkFQLFxyXG5dO1xyXG5cclxuY29uc3QgV2ViR0xCbGVuZE9wczogR0xlbnVtW10gPSBbXHJcbiAgICAweDgwMDYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5GVU5DX0FERCxcclxuICAgIDB4ODAwQSwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZVTkNfU1VCVFJBQ1QsXHJcbiAgICAweDgwMEIsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5GVU5DX1JFVkVSU0VfU1VCVFJBQ1QsXHJcbiAgICAweDgwMDYsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5GVU5DX0FERCxcclxuICAgIDB4ODAwNiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkZVTkNfQURELFxyXG5dO1xyXG5cclxuY29uc3QgV2ViR0xCbGVuZEZhY3RvcnM6IEdMZW51bVtdID0gW1xyXG4gICAgMHgwMDAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuWkVSTyxcclxuICAgIDB4MDAwMSwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk9ORSxcclxuICAgIDB4MDMwMiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LlNSQ19BTFBIQSxcclxuICAgIDB4MDMwNCwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkRTVF9BTFBIQSxcclxuICAgIDB4MDMwMywgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk9ORV9NSU5VU19TUkNfQUxQSEEsXHJcbiAgICAweDAzMDUsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5PTkVfTUlOVVNfRFNUX0FMUEhBLFxyXG4gICAgMHgwMzAwLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuU1JDX0NPTE9SLFxyXG4gICAgMHgwMzA2LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuRFNUX0NPTE9SLFxyXG4gICAgMHgwMzAxLCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FX01JTlVTX1NSQ19DT0xPUixcclxuICAgIDB4MDMwNywgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk9ORV9NSU5VU19EU1RfQ09MT1IsXHJcbiAgICAweDAzMDgsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5TUkNfQUxQSEFfU0FUVVJBVEUsXHJcbiAgICAweDgwMDEsIC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5DT05TVEFOVF9DT0xPUixcclxuICAgIDB4ODAwMiwgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0Lk9ORV9NSU5VU19DT05TVEFOVF9DT0xPUixcclxuICAgIDB4ODAwMywgLy8gV2ViR0xSZW5kZXJpbmdDb250ZXh0LkNPTlNUQU5UX0FMUEhBLFxyXG4gICAgMHg4MDA0LCAvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuT05FX01JTlVTX0NPTlNUQU5UX0FMUEhBLFxyXG5dO1xyXG5cclxuZXhwb3J0IGVudW0gV2ViR0xDbWQge1xyXG4gICAgQkVHSU5fUkVOREVSX1BBU1MsXHJcbiAgICBFTkRfUkVOREVSX1BBU1MsXHJcbiAgICBCSU5EX1NUQVRFUyxcclxuICAgIERSQVcsXHJcbiAgICBVUERBVEVfQlVGRkVSLFxyXG4gICAgQ09QWV9CVUZGRVJfVE9fVEVYVFVSRSxcclxuICAgIENPVU5ULFxyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgV2ViR0xDbWRPYmplY3Qge1xyXG4gICAgcHVibGljIGNtZFR5cGU6IFdlYkdMQ21kO1xyXG4gICAgcHVibGljIHJlZkNvdW50OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh0eXBlOiBXZWJHTENtZCkge1xyXG4gICAgICAgIHRoaXMuY21kVHlwZSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFic3RyYWN0IGNsZWFyICgpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDbWRCZWdpblJlbmRlclBhc3MgZXh0ZW5kcyBXZWJHTENtZE9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGdwdVJlbmRlclBhc3M6IElXZWJHTEdQVVJlbmRlclBhc3MgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMR1BVRnJhbWVidWZmZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyByZW5kZXJBcmVhID0gbmV3IEdGWFJlY3QoKTtcclxuICAgIHB1YmxpYyBjbGVhckZsYWc6IEdGWENsZWFyRmxhZyA9IEdGWENsZWFyRmxhZy5OT05FO1xyXG4gICAgcHVibGljIGNsZWFyQ29sb3JzOiBHRlhDb2xvcltdID0gW107XHJcbiAgICBwdWJsaWMgY2xlYXJEZXB0aDogbnVtYmVyID0gMS4wO1xyXG4gICAgcHVibGljIGNsZWFyU3RlbmNpbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoV2ViR0xDbWQuQkVHSU5fUkVOREVSX1BBU1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5ncHVGcmFtZWJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbG9ycy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDbWRCaW5kU3RhdGVzIGV4dGVuZHMgV2ViR0xDbWRPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBncHVQaXBlbGluZVN0YXRlOiBJV2ViR0xHUFVQaXBlbGluZVN0YXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTEdQVUlucHV0QXNzZW1ibGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgZ3B1RGVzY3JpcHRvclNldHM6IElXZWJHTEdQVURlc2NyaXB0b3JTZXRbXSA9IFtdO1xyXG4gICAgcHVibGljIGR5bmFtaWNPZmZzZXRzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHVibGljIHZpZXdwb3J0OiBHRlhWaWV3cG9ydCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHNjaXNzb3I6IEdGWFJlY3QgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBsaW5lV2lkdGg6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGRlcHRoQmlhczogSVdlYkdMRGVwdGhCaWFzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgYmxlbmRDb25zdGFudHM6IG51bWJlcltdID0gW107XHJcbiAgICBwdWJsaWMgZGVwdGhCb3VuZHM6IElXZWJHTERlcHRoQm91bmRzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3RlbmNpbFdyaXRlTWFzazogSVdlYkdMU3RlbmNpbFdyaXRlTWFzayB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHN0ZW5jaWxDb21wYXJlTWFzazogSVdlYkdMU3RlbmNpbENvbXBhcmVNYXNrIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKFdlYkdMQ21kLkJJTkRfU1RBVEVTKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIHRoaXMuZ3B1UGlwZWxpbmVTdGF0ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5ncHVEZXNjcmlwdG9yU2V0cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZHluYW1pY09mZnNldHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNjaXNzb3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRlcHRoQmlhcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5ibGVuZENvbnN0YW50cy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuZGVwdGhCb3VuZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RlbmNpbFdyaXRlTWFzayA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGVuY2lsQ29tcGFyZU1hc2sgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDbWREcmF3IGV4dGVuZHMgV2ViR0xDbWRPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBkcmF3SW5mbyA9IG5ldyBHRlhEcmF3SW5mbygpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcihXZWJHTENtZC5EUkFXKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDbWRVcGRhdGVCdWZmZXIgZXh0ZW5kcyBXZWJHTENtZE9iamVjdCB7XHJcblxyXG4gICAgcHVibGljIGdwdUJ1ZmZlcjogSVdlYkdMR1BVQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgYnVmZmVyOiBHRlhCdWZmZXJTb3VyY2UgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBvZmZzZXQ6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoV2ViR0xDbWQuVVBEQVRFX0JVRkZFUik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLmdwdUJ1ZmZlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgV2ViR0xDbWRDb3B5QnVmZmVyVG9UZXh0dXJlIGV4dGVuZHMgV2ViR0xDbWRPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBncHVUZXh0dXJlOiBJV2ViR0xHUFVUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10gPSBbXTtcclxuICAgIHB1YmxpYyByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKFdlYkdMQ21kLkNPUFlfQlVGRkVSX1RPX1RFWFRVUkUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5ncHVUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmJ1ZmZlcnMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLnJlZ2lvbnMubGVuZ3RoID0gMDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMQ21kUGFja2FnZSB7XHJcbiAgICBwdWJsaWMgY21kczogQ2FjaGVkQXJyYXk8V2ViR0xDbWQ+ID0gbmV3IENhY2hlZEFycmF5KDEpO1xyXG4gICAgcHVibGljIGJlZ2luUmVuZGVyUGFzc0NtZHM6IENhY2hlZEFycmF5PFdlYkdMQ21kQmVnaW5SZW5kZXJQYXNzPiA9IG5ldyBDYWNoZWRBcnJheSgxKTtcclxuICAgIHB1YmxpYyBiaW5kU3RhdGVzQ21kczogQ2FjaGVkQXJyYXk8V2ViR0xDbWRCaW5kU3RhdGVzPiA9IG5ldyBDYWNoZWRBcnJheSgxKTtcclxuICAgIHB1YmxpYyBkcmF3Q21kczogQ2FjaGVkQXJyYXk8V2ViR0xDbWREcmF3PiA9IG5ldyBDYWNoZWRBcnJheSgxKTtcclxuICAgIHB1YmxpYyB1cGRhdGVCdWZmZXJDbWRzOiBDYWNoZWRBcnJheTxXZWJHTENtZFVwZGF0ZUJ1ZmZlcj4gPSBuZXcgQ2FjaGVkQXJyYXkoMSk7XHJcbiAgICBwdWJsaWMgY29weUJ1ZmZlclRvVGV4dHVyZUNtZHM6IENhY2hlZEFycmF5PFdlYkdMQ21kQ29weUJ1ZmZlclRvVGV4dHVyZT4gPSBuZXcgQ2FjaGVkQXJyYXkoMSk7XHJcblxyXG4gICAgcHVibGljIGNsZWFyQ21kcyAoYWxsb2NhdG9yOiBXZWJHTENvbW1hbmRBbGxvY2F0b3IpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYmVnaW5SZW5kZXJQYXNzQ21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxsb2NhdG9yLmJlZ2luUmVuZGVyUGFzc0NtZFBvb2wuZnJlZUNtZHModGhpcy5iZWdpblJlbmRlclBhc3NDbWRzKTtcclxuICAgICAgICAgICAgdGhpcy5iZWdpblJlbmRlclBhc3NDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5iaW5kU3RhdGVzQ21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxsb2NhdG9yLmJpbmRTdGF0ZXNDbWRQb29sLmZyZWVDbWRzKHRoaXMuYmluZFN0YXRlc0NtZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRTdGF0ZXNDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5kcmF3Q21kcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxsb2NhdG9yLmRyYXdDbWRQb29sLmZyZWVDbWRzKHRoaXMuZHJhd0NtZHMpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdDbWRzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy51cGRhdGVCdWZmZXJDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxvY2F0b3IudXBkYXRlQnVmZmVyQ21kUG9vbC5mcmVlQ21kcyh0aGlzLnVwZGF0ZUJ1ZmZlckNtZHMpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1ZmZlckNtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvcHlCdWZmZXJUb1RleHR1cmVDbWRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBhbGxvY2F0b3IuY29weUJ1ZmZlclRvVGV4dHVyZUNtZFBvb2wuZnJlZUNtZHModGhpcy5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUJ1ZmZlclRvVGV4dHVyZUNtZHMuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY21kcy5jbGVhcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jQ3JlYXRlQnVmZmVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTEdQVUJ1ZmZlcikge1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG4gICAgY29uc3QgY2FjaGUgPSBkZXZpY2Uuc3RhdGVDYWNoZTtcclxuICAgIGNvbnN0IGdsVXNhZ2U6IEdMZW51bSA9IGdwdUJ1ZmZlci5tZW1Vc2FnZSAmIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgPyBnbC5EWU5BTUlDX0RSQVcgOiBnbC5TVEFUSUNfRFJBVztcclxuXHJcbiAgICBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYKSB7XHJcblxyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLkFSUkFZX0JVRkZFUjtcclxuICAgICAgICBjb25zdCBnbEJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgIGlmIChnbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBncHVCdWZmZXIuZ2xCdWZmZXIgPSBnbEJ1ZmZlcjtcclxuICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlci5zaXplID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xWQU8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlLk9FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0IS5iaW5kVmVydGV4QXJyYXlPRVMobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsVkFPID0gZ2Z4U3RhdGVDYWNoZS5ncHVJbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbEFycmF5QnVmZmVyICE9PSBncHVCdWZmZXIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbEFycmF5QnVmZmVyID0gZ3B1QnVmZmVyLmdsQnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuc2l6ZSwgZ2xVc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbEFycmF5QnVmZmVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVgpIHtcclxuXHJcbiAgICAgICAgZ3B1QnVmZmVyLmdsVGFyZ2V0ID0gZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI7XHJcbiAgICAgICAgY29uc3QgZ2xCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuXHJcbiAgICAgICAgaWYgKGdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdwdUJ1ZmZlci5nbEJ1ZmZlciA9IGdsQnVmZmVyO1xyXG4gICAgICAgICAgICBpZiAoZ3B1QnVmZmVyLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnVzZVZBTykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbFZBTykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2UuT0VTX3ZlcnRleF9hcnJheV9vYmplY3QhLmJpbmRWZXJ0ZXhBcnJheU9FUyhudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xWQU8gPSBnZnhTdGF0ZUNhY2hlLmdwdUlucHV0QXNzZW1ibGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRldmljZS5zdGF0ZUNhY2hlLmdsRWxlbWVudEFycmF5QnVmZmVyICE9PSBncHVCdWZmZXIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsRWxlbWVudEFycmF5QnVmZmVyID0gZ3B1QnVmZmVyLmdsQnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5zaXplLCBnbFVzYWdlKTtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5lcnJvcihcIldlYkdMIDEuMCBkb2Vzbid0IHN1cHBvcnQgdW5pZm9ybSBidWZmZXIuXCIpO1xyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLk5PTkU7XHJcblxyXG4gICAgICAgIGlmIChncHVCdWZmZXIuYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdwdUJ1ZmZlci52ZjMyID0gbmV3IEZsb2F0MzJBcnJheShncHVCdWZmZXIuYnVmZmVyLmJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkge1xyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLk5PTkU7XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCkge1xyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLk5PTkU7XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX1NSQykge1xyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLk5PTkU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdGWEJ1ZmZlclR5cGUsIGNyZWF0ZSBidWZmZXIgZmFpbGVkLicpO1xyXG4gICAgICAgIGdwdUJ1ZmZlci5nbFRhcmdldCA9IGdsLk5PTkU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNEZXN0cm95QnVmZmVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTEdQVUJ1ZmZlcikge1xyXG4gICAgaWYgKGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVCdWZmZXIoZ3B1QnVmZmVyLmdsQnVmZmVyKTtcclxuICAgICAgICBncHVCdWZmZXIuZ2xCdWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jUmVzaXplQnVmZmVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTEdQVUJ1ZmZlcikge1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG4gICAgY29uc3QgY2FjaGUgPSBkZXZpY2Uuc3RhdGVDYWNoZTtcclxuICAgIGNvbnN0IGdsVXNhZ2U6IEdMZW51bSA9IGdwdUJ1ZmZlci5tZW1Vc2FnZSAmIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgPyBnbC5EWU5BTUlDX0RSQVcgOiBnbC5TVEFUSUNfRFJBVztcclxuXHJcbiAgICBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYKSB7XHJcbiAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICBkZXZpY2UuT0VTX3ZlcnRleF9hcnJheV9vYmplY3QhLmJpbmRWZXJ0ZXhBcnJheU9FUyhudWxsKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsVkFPID0gZ2Z4U3RhdGVDYWNoZS5ncHVJbnB1dEFzc2VtYmxlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbEFycmF5QnVmZmVyICE9PSBncHVCdWZmZXIuZ2xCdWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZ3B1QnVmZmVyLmJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmJ1ZmZlciwgZ2xVc2FnZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5zaXplLCBnbFVzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLmdsQXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRFWCkge1xyXG4gICAgICAgIGlmIChkZXZpY2UudXNlVkFPKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5nbFZBTykge1xyXG4gICAgICAgICAgICAgICAgZGV2aWNlLk9FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0IS5iaW5kVmVydGV4QXJyYXlPRVMobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGdwdUJ1ZmZlci5idWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLmJ1ZmZlciwgZ2xVc2FnZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgZ3B1QnVmZmVyLnNpemUsIGdsVXNhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbEVsZW1lbnRBcnJheUJ1ZmZlciA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlVOSUZPUk0pIHtcclxuICAgICAgICAvLyBjb25zb2xlLmVycm9yKFwiV2ViR0wgMS4wIGRvZXNuJ3Qgc3VwcG9ydCB1bmlmb3JtIGJ1ZmZlci5cIik7XHJcbiAgICAgICAgaWYgKGdwdUJ1ZmZlci5idWZmZXIpIHtcclxuICAgICAgICAgICAgZ3B1QnVmZmVyLnZmMzIgPSBuZXcgRmxvYXQzMkFycmF5KGdwdUJ1ZmZlci5idWZmZXIuYnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkgfHxcclxuICAgICAgICAgICAgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCkgfHxcclxuICAgICAgICAgICAgKGdwdUJ1ZmZlci51c2FnZSAmIEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX1NSQykpIHtcclxuICAgICAgICBncHVCdWZmZXIuZ2xUYXJnZXQgPSBnbC5OT05FO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhCdWZmZXJUeXBlLCBjcmVhdGUgYnVmZmVyIGZhaWxlZC4nKTtcclxuICAgICAgICBncHVCdWZmZXIuZ2xUYXJnZXQgPSBnbC5OT05FO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jVXBkYXRlQnVmZmVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVCdWZmZXI6IElXZWJHTEdQVUJ1ZmZlciwgYnVmZmVyOiBHRlhCdWZmZXJTb3VyY2UsIG9mZnNldDogbnVtYmVyLCBzaXplOiBudW1iZXIpIHtcclxuXHJcbiAgICBpZiAoZ3B1QnVmZmVyLnVzYWdlICYgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSkge1xyXG4gICAgICAgIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoYnVmZmVyKSkge1xyXG4gICAgICAgICAgICBncHVCdWZmZXIudmYzMiEuc2V0KGJ1ZmZlciBhcyBGbG9hdDMyQXJyYXksIG9mZnNldCAvIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3B1QnVmZmVyLnZmMzIhLnNldChuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlciBhcyBBcnJheUJ1ZmZlciksIG9mZnNldCAvIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChncHVCdWZmZXIudXNhZ2UgJiBHRlhCdWZmZXJVc2FnZUJpdC5JTkRJUkVDVCkge1xyXG4gICAgICAgIGdwdUJ1ZmZlci5pbmRpcmVjdHMubGVuZ3RoID0gb2Zmc2V0O1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGdwdUJ1ZmZlci5pbmRpcmVjdHMsIChidWZmZXIgYXMgR0ZYSW5kaXJlY3RCdWZmZXIpLmRyYXdJbmZvcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmYgPSBidWZmZXIgYXMgQXJyYXlCdWZmZXI7XHJcbiAgICAgICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcbiAgICAgICAgY29uc3QgY2FjaGUgPSBkZXZpY2Uuc3RhdGVDYWNoZTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChncHVCdWZmZXIuZ2xUYXJnZXQpIHtcclxuICAgICAgICAgICAgY2FzZSBnbC5BUlJBWV9CVUZGRVI6IHtcclxuICAgICAgICAgICAgICAgIGlmIChkZXZpY2UudXNlVkFPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS5PRVNfdmVydGV4X2FycmF5X29iamVjdCEuYmluZFZlcnRleEFycmF5T0VTKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xBcnJheUJ1ZmZlciAhPT0gZ3B1QnVmZmVyLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xBcnJheUJ1ZmZlciA9IGdwdUJ1ZmZlci5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVI6IHtcclxuICAgICAgICAgICAgICAgIGlmIChkZXZpY2UudXNlVkFPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZS5PRVNfdmVydGV4X2FycmF5X29iamVjdCEuYmluZFZlcnRleEFycmF5T0VTKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5nbFZBTyA9IGdmeFN0YXRlQ2FjaGUuZ3B1SW5wdXRBc3NlbWJsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZGV2aWNlLnN0YXRlQ2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBncHVCdWZmZXIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhCdWZmZXJUeXBlLCB1cGRhdGUgYnVmZmVyIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNpemUgPT09IGJ1ZmYuYnl0ZUxlbmd0aCkge1xyXG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdwdUJ1ZmZlci5nbFRhcmdldCwgb2Zmc2V0LCBidWZmKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBnbC5idWZmZXJTdWJEYXRhKGdwdUJ1ZmZlci5nbFRhcmdldCwgb2Zmc2V0LCBidWZmLnNsaWNlKDAsIHNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNDcmVhdGVUZXh0dXJlIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVUZXh0dXJlOiBJV2ViR0xHUFVUZXh0dXJlKSB7XHJcblxyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcblxyXG4gICAgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10ID0gR0ZYRm9ybWF0VG9XZWJHTEludGVybmFsRm9ybWF0KGdwdVRleHR1cmUuZm9ybWF0LCBnbCk7XHJcbiAgICBncHVUZXh0dXJlLmdsRm9ybWF0ID0gR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdChncHVUZXh0dXJlLmZvcm1hdCwgZ2wpO1xyXG4gICAgZ3B1VGV4dHVyZS5nbFR5cGUgPSBHRlhGb3JtYXRUb1dlYkdMVHlwZShncHVUZXh0dXJlLmZvcm1hdCwgZ2wpO1xyXG5cclxuICAgIGxldCB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgIGxldCBoID0gZ3B1VGV4dHVyZS5oZWlnaHQ7XHJcblxyXG4gICAgc3dpdGNoIChncHVUZXh0dXJlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWFRleHR1cmVUeXBlLlRFWDJEOiB7XHJcbiAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xUYXJnZXQgPSBnbC5URVhUVVJFXzJEO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWF4U2l6ZSA9IE1hdGgubWF4KHcsIGgpO1xyXG4gICAgICAgICAgICBpZiAobWF4U2l6ZSA+IGRldmljZS5tYXhUZXh0dXJlU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCg5MTAwLCBtYXhTaXplLCBkZXZpY2UubWF4VGV4dHVyZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRldmljZS5XRUJHTF9kZXB0aF90ZXh0dXJlICYmIEdGWEZvcm1hdEluZm9zW2dwdVRleHR1cmUuZm9ybWF0XS5oYXNEZXB0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xSZW5kZXJidWZmZXIgPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChnbFJlbmRlcmJ1ZmZlciAmJiBncHVUZXh0dXJlLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlciA9IGdsUmVuZGVyYnVmZmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xSZW5kZXJidWZmZXIgIT09IGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlbmRlcmJ1ZmZlciA9IGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBpbnRlcm5hbCBmb3JtYXQgaGVyZSBkaWZmZXJzIGZyb20gdGV4SW1hZ2UyRCBjb252ZW5zaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCA9PT0gZ2wuREVQVEhfQ09NUE9ORU5UKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCA9IGdsLkRFUFRIX0NPTVBPTkVOVDE2O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChncHVUZXh0dXJlLnNhbXBsZXMgPT09IEdGWFNhbXBsZUNvdW50LlgxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xUZXh0dXJlICYmIGdwdVRleHR1cmUuc2l6ZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSA9IGdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBnbFRleFVuaXQgPSBkZXZpY2Uuc3RhdGVDYWNoZS5nbFRleFVuaXRzW2RldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbFRleFVuaXQuZ2xUZXh0dXJlID0gZ3B1VGV4dHVyZS5nbFRleHR1cmU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIUdGWEZvcm1hdEluZm9zW2dwdVRleHR1cmUuZm9ybWF0XS5pc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSBNYXRoLm1heCgxLCBoID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdTaXplID0gR0ZYRm9ybWF0U2l6ZShncHVUZXh0dXJlLmZvcm1hdCwgdywgaCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlldzogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGltZ1NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbml0IDIgeCAyIHRleHR1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCAyLCAyLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXc6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShpbWdTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgMiwgMiwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmlzUG93ZXJPZjIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBTID0gZ2wuUkVQRUFUO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsV3JhcFQgPSBnbC5SRVBFQVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBTID0gZ2wuQ0xBTVBfVE9fRURHRTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBUID0gZ2wuQ0xBTVBfVE9fRURHRTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbE1pbkZpbHRlciA9IGdsLkxJTkVBUjtcclxuICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsTWFnRmlsdGVyID0gZ2wuTElORUFSO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfV1JBUF9TLCBncHVUZXh0dXJlLmdsV3JhcFMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdwdVRleHR1cmUuZ2xXcmFwVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBncHVUZXh0dXJlLmdsTWFnRmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRlbGV0ZVRleHR1cmUoZ2xUZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYVGV4dHVyZVR5cGUuQ1VCRToge1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0ID0gZ2wuVEVYVFVSRV9DVUJFX01BUDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1heCh3LCBoKTtcclxuICAgICAgICAgICAgaWYgKG1heFNpemUgPiBkZXZpY2UubWF4Q3ViZU1hcFRleHR1cmVTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcklEKDkxMDAsIG1heFNpemUsIGRldmljZS5tYXhUZXh0dXJlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdsVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgaWYgKGdsVGV4dHVyZSAmJiBncHVUZXh0dXJlLnNpemUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSA9IGdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsVGV4VW5pdCA9IGRldmljZS5zdGF0ZUNhY2hlLmdsVGV4VW5pdHNbZGV2aWNlLnN0YXRlQ2FjaGUudGV4VW5pdF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdsVGV4VW5pdC5nbFRleHR1cmUgIT09IGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ3B1VGV4dHVyZS5nbFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdsVGV4VW5pdC5nbFRleHR1cmUgPSBncHVUZXh0dXJlLmdsVGV4dHVyZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIUdGWEZvcm1hdEluZm9zW2dwdVRleHR1cmUuZm9ybWF0XS5pc0NvbXByZXNzZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IDY7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGdwdVRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVRleHR1cmUubWlwTGV2ZWw7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCBpLCBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbEZvcm1hdCwgZ3B1VGV4dHVyZS5nbFR5cGUsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gTWF0aC5tYXgoMSwgaCA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IDY7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdyA9IGdwdVRleHR1cmUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gZ3B1VGV4dHVyZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVRleHR1cmUubWlwTGV2ZWw7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCB3LCBoLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWV3OiBVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoaW1nU2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY29tcHJlc3NlZFRleEltYWdlMkQoZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgZiwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCB2aWV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoID0gTWF0aC5tYXgoMSwgaCA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgZiA9IDA7IGYgPCA2OyArK2YpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCAyLCAyLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXc6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShpbWdTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIDAsIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgMiwgMiwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuaXNQb3dlck9mMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwUyA9IGdsLlJFUEVBVDtcclxuICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsV3JhcFQgPSBnbC5SRVBFQVQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwUyA9IGdsLkNMQU1QX1RPX0VER0U7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFdyYXBUID0gZ2wuQ0xBTVBfVE9fRURHRTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIgPSBnbC5MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsTWFnRmlsdGVyID0gZ2wuTElORUFSO1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdwdVRleHR1cmUuZ2xXcmFwUyk7XHJcbiAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfV1JBUF9ULCBncHVUZXh0dXJlLmdsV3JhcFQpO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdwdVRleHR1cmUuZ2xNYWdGaWx0ZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhUZXh0dXJlVHlwZSwgY3JlYXRlIHRleHR1cmUgZmFpbGVkLicpO1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLnR5cGUgPSBHRlhUZXh0dXJlVHlwZS5URVgyRDtcclxuICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFRhcmdldCA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jRGVzdHJveVRleHR1cmUgKGRldmljZTogV2ViR0xEZXZpY2UsIGdwdVRleHR1cmU6IElXZWJHTEdQVVRleHR1cmUpIHtcclxuICAgIGlmIChncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgIGRldmljZS5nbC5kZWxldGVUZXh0dXJlKGdwdVRleHR1cmUuZ2xUZXh0dXJlKTtcclxuICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIpIHtcclxuICAgICAgICBkZXZpY2UuZ2wuZGVsZXRlUmVuZGVyYnVmZmVyKGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIpO1xyXG4gICAgICAgIGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jUmVzaXplVGV4dHVyZSAoZGV2aWNlOiBXZWJHTERldmljZSwgZ3B1VGV4dHVyZTogSVdlYkdMR1BVVGV4dHVyZSkge1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG5cclxuICAgIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCA9IEdGWEZvcm1hdFRvV2ViR0xJbnRlcm5hbEZvcm1hdChncHVUZXh0dXJlLmZvcm1hdCwgZ2wpO1xyXG4gICAgZ3B1VGV4dHVyZS5nbEZvcm1hdCA9IEdGWEZvcm1hdFRvV2ViR0xGb3JtYXQoZ3B1VGV4dHVyZS5mb3JtYXQsIGdsKTtcclxuICAgIGdwdVRleHR1cmUuZ2xUeXBlID0gR0ZYRm9ybWF0VG9XZWJHTFR5cGUoZ3B1VGV4dHVyZS5mb3JtYXQsIGdsKTtcclxuXHJcbiAgICBsZXQgdyA9IGdwdVRleHR1cmUud2lkdGg7XHJcbiAgICBsZXQgaCA9IGdwdVRleHR1cmUuaGVpZ2h0O1xyXG5cclxuICAgIHN3aXRjaCAoZ3B1VGV4dHVyZS50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBHRlhUZXh0dXJlVHlwZS5URVgyRDoge1xyXG4gICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0ID0gZ2wuVEVYVFVSRV8yRDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLm1heCh3LCBoKTtcclxuICAgICAgICAgICAgaWYgKG1heFNpemUgPiBkZXZpY2UubWF4VGV4dHVyZVNpemUpIHtcclxuICAgICAgICAgICAgICAgIGVycm9ySUQoOTEwMCwgbWF4U2l6ZSwgZGV2aWNlLm1heFRleHR1cmVTaXplKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlbmRlcmJ1ZmZlciAhPT0gZ3B1VGV4dHVyZS5nbFJlbmRlcmJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBncHVUZXh0dXJlLmdsUmVuZGVyYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICBkZXZpY2Uuc3RhdGVDYWNoZS5nbFJlbmRlcmJ1ZmZlciA9IGdwdVRleHR1cmUuZ2xSZW5kZXJidWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xUZXhVbml0ID0gZGV2aWNlLnN0YXRlQ2FjaGUuZ2xUZXhVbml0c1tkZXZpY2Uuc3RhdGVDYWNoZS50ZXhVbml0XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghR0ZYRm9ybWF0SW5mb3NbZ3B1VGV4dHVyZS5mb3JtYXRdLmlzQ29tcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1VGV4dHVyZS5taXBMZXZlbDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBNYXRoLm1heCgxLCB3ID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoID0gTWF0aC5tYXgoMSwgaCA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgIT09IFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGltZ1NpemUgPSBHRlhGb3JtYXRTaXplKGdwdVRleHR1cmUuZm9ybWF0LCB3LCBoLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXc6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShpbWdTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIGksIGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCwgdywgaCwgMCwgdmlldyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ID0gTWF0aC5tYXgoMSwgdyA+PiAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGggPSBNYXRoLm1heCgxLCBoID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIEdGWFRleHR1cmVUeXBlLkNVQkU6IHtcclxuICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbFRhcmdldCA9IGdsLlRFWFRVUkVfQ1VCRV9NQVA7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXhTaXplID0gTWF0aC5tYXgodywgaCk7XHJcbiAgICAgICAgICAgIGlmIChtYXhTaXplID4gZGV2aWNlLm1heEN1YmVNYXBUZXh0dXJlU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCg5MTAwLCBtYXhTaXplLCBkZXZpY2UubWF4VGV4dHVyZVNpemUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbFRleFVuaXQgPSBkZXZpY2Uuc3RhdGVDYWNoZS5nbFRleFVuaXRzW2RldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdsVGV4VW5pdC5nbFRleHR1cmUgIT09IGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFX0NVQkVfTUFQLCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICBnbFRleFVuaXQuZ2xUZXh0dXJlID0gZ3B1VGV4dHVyZS5nbFRleHR1cmU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghR0ZYRm9ybWF0SW5mb3NbZ3B1VGV4dHVyZS5mb3JtYXRdLmlzQ29tcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZiA9IDA7IGYgPCA2OyArK2YpIHtcclxuICAgICAgICAgICAgICAgICAgICB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICBoID0gZ3B1VGV4dHVyZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVUZXh0dXJlLm1pcExldmVsOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCBpLCBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCBudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdyA9IE1hdGgubWF4KDEsIHcgPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGggPSBNYXRoLm1heCgxLCBoID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQgIT09IFdlYkdMRVhULkNPTVBSRVNTRURfUkdCX0VUQzFfV0VCR0wpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IDY7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ID0gZ3B1VGV4dHVyZS53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaCA9IGdwdVRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVRleHR1cmUubWlwTGV2ZWw7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1nU2l6ZSA9IEdGWEZvcm1hdFNpemUoZ3B1VGV4dHVyZS5mb3JtYXQsIHcsIGgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlldzogVWludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGltZ1NpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY29tcHJlc3NlZFRleEltYWdlMkQoZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgZiwgaSwgZ3B1VGV4dHVyZS5nbEludGVybmFsRm10LCB3LCBoLCAwLCB2aWV3KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBNYXRoLm1heCgxLCB3ID4+IDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaCA9IE1hdGgubWF4KDEsIGggPj4gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgR0ZYVGV4dHVyZVR5cGUsIGNyZWF0ZSB0ZXh0dXJlIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgZ3B1VGV4dHVyZS50eXBlID0gR0ZYVGV4dHVyZVR5cGUuVEVYMkQ7XHJcbiAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xUYXJnZXQgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMQ21kRnVuY0NyZWF0ZUZyYW1lYnVmZmVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMR1BVRnJhbWVidWZmZXIpIHtcclxuICAgIGlmICghZ3B1RnJhbWVidWZmZXIuZ3B1Q29sb3JUZXh0dXJlcy5sZW5ndGggJiYgIWdwdUZyYW1lYnVmZmVyLmdwdURlcHRoU3RlbmNpbFRleHR1cmUpIHsgcmV0dXJuOyB9IC8vIG9uc2NyZWVuIGZib1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG4gICAgY29uc3QgYXR0YWNobWVudHM6IEdMZW51bVtdID0gW107XHJcblxyXG4gICAgY29uc3QgZ2xGcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICBpZiAoZ2xGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgIGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIgPSBnbEZyYW1lYnVmZmVyO1xyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xGcmFtZWJ1ZmZlciAhPT0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcikge1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVGcmFtZWJ1ZmZlci5ncHVDb2xvclRleHR1cmVzLmxlbmd0aDsgKytpKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBncHVUZXh0dXJlID0gZ3B1RnJhbWVidWZmZXIuZ3B1Q29sb3JUZXh0dXJlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuQ09MT1JfQVRUQUNITUVOVDAgKyBpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsVGV4dHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMCk7IC8vIGxldmVsIG11c3QgYmUgMFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLkNPTE9SX0FUVEFDSE1FTlQwICsgaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuUkVOREVSQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsUmVuZGVyYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYXR0YWNobWVudHMucHVzaChnbC5DT0xPUl9BVFRBQ0hNRU5UMCArIGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkc3QgPSBncHVGcmFtZWJ1ZmZlci5ncHVEZXB0aFN0ZW5jaWxUZXh0dXJlO1xyXG4gICAgICAgIGlmIChkc3QpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2xBdHRhY2htZW50ID0gR0ZYRm9ybWF0SW5mb3NbZHN0LmZvcm1hdF0uaGFzU3RlbmNpbCA/IGdsLkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVCA6IGdsLkRFUFRIX0FUVEFDSE1FTlQ7XHJcbiAgICAgICAgICAgIGlmIChkc3QuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRChcclxuICAgICAgICAgICAgICAgICAgICBnbC5GUkFNRUJVRkZFUixcclxuICAgICAgICAgICAgICAgICAgICBnbEF0dGFjaG1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgZHN0LmdsVGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGRzdC5nbFRleHR1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgMCk7IC8vIGxldmVsIG11c3QgYmUgMFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuRlJBTUVCVUZGRVIsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xBdHRhY2htZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLlJFTkRFUkJVRkZFUixcclxuICAgICAgICAgICAgICAgICAgICBkc3QuZ2xSZW5kZXJidWZmZXIsXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLldFQkdMX2RyYXdfYnVmZmVycykge1xyXG4gICAgICAgICAgICBkZXZpY2UuV0VCR0xfZHJhd19idWZmZXJzLmRyYXdCdWZmZXJzV0VCR0woYXR0YWNobWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyhnbC5GUkFNRUJVRkZFUik7XHJcbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEUpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9BVFRBQ0hNRU5UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ2xDaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgLSBGUkFNRUJVRkZFUl9JTkNPTVBMRVRFX0FUVEFDSE1FTlQnKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgZ2wuRlJBTUVCVUZGRVJfSU5DT01QTEVURV9NSVNTSU5HX0FUVEFDSE1FTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdnbENoZWNrRnJhbWVidWZmZXJTdGF0dXMoKSAtIEZSQU1FQlVGRkVSX0lOQ09NUExFVEVfTUlTU0lOR19BVFRBQ0hNRU5UJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIGdsLkZSQU1FQlVGRkVSX0lOQ09NUExFVEVfRElNRU5TSU9OUzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2dsQ2hlY2tGcmFtZWJ1ZmZlclN0YXR1cygpIC0gRlJBTUVCVUZGRVJfSU5DT01QTEVURV9ESU1FTlNJT05TJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIGdsLkZSQU1FQlVGRkVSX1VOU1VQUE9SVEVEOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignZ2xDaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCkgLSBGUkFNRUJVRkZFUl9VTlNVUFBPUlRFRCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRldmljZS5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIgIT09IGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIpIHtcclxuICAgICAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBkZXZpY2Uuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNEZXN0cm95RnJhbWVidWZmZXIgKGRldmljZTogV2ViR0xEZXZpY2UsIGdwdUZyYW1lYnVmZmVyOiBJV2ViR0xHUFVGcmFtZWJ1ZmZlcikge1xyXG4gICAgaWYgKGdwdUZyYW1lYnVmZmVyLmdsRnJhbWVidWZmZXIpIHtcclxuICAgICAgICBkZXZpY2UuZ2wuZGVsZXRlRnJhbWVidWZmZXIoZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcik7XHJcbiAgICAgICAgZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlciA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNDcmVhdGVTaGFkZXIgKGRldmljZTogV2ViR0xEZXZpY2UsIGdwdVNoYWRlcjogSVdlYkdMR1BVU2hhZGVyKSB7XHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuXHJcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IGdwdVNoYWRlci5ncHVTdGFnZXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICBjb25zdCBncHVTdGFnZSA9IGdwdVNoYWRlci5ncHVTdGFnZXNba107XHJcblxyXG4gICAgICAgIGxldCBnbFNoYWRlclR5cGU6IEdMZW51bSA9IDA7XHJcbiAgICAgICAgbGV0IHNoYWRlclR5cGVTdHIgPSAnJztcclxuICAgICAgICBsZXQgbGluZU51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoZ3B1U3RhZ2UudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIEdGWFNoYWRlclN0YWdlRmxhZ0JpdC5WRVJURVg6IHtcclxuICAgICAgICAgICAgICAgIHNoYWRlclR5cGVTdHIgPSAnVmVydGV4U2hhZGVyJztcclxuICAgICAgICAgICAgICAgIGdsU2hhZGVyVHlwZSA9IGdsLlZFUlRFWF9TSEFERVI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIEdGWFNoYWRlclN0YWdlRmxhZ0JpdC5GUkFHTUVOVDoge1xyXG4gICAgICAgICAgICAgICAgc2hhZGVyVHlwZVN0ciA9ICdGcmFnbWVudFNoYWRlcic7XHJcbiAgICAgICAgICAgICAgICBnbFNoYWRlclR5cGUgPSBnbC5GUkFHTUVOVF9TSEFERVI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbnN1cHBvcnRlZCBHRlhTaGFkZXJUeXBlLicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBnbFNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbFNoYWRlclR5cGUpO1xyXG4gICAgICAgIGlmIChnbFNoYWRlcikge1xyXG4gICAgICAgICAgICBncHVTdGFnZS5nbFNoYWRlciA9IGdsU2hhZGVyO1xyXG4gICAgICAgICAgICBnbC5zaGFkZXJTb3VyY2UoZ3B1U3RhZ2UuZ2xTaGFkZXIsIGdwdVN0YWdlLnNvdXJjZSk7XHJcbiAgICAgICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoZ3B1U3RhZ2UuZ2xTaGFkZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoZ3B1U3RhZ2UuZ2xTaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihzaGFkZXJUeXBlU3RyICsgJyBpbiBcXCcnICsgZ3B1U2hhZGVyLm5hbWUgKyAnXFwnIGNvbXBpbGF0aW9uIGZhaWxlZC4nKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYWRlciBzb3VyY2UgZHVtcDonLCBncHVTdGFnZS5zb3VyY2UucmVwbGFjZSgvXnxcXG4vZywgKCkgPT4gYFxcbiR7bGluZU51bWJlcisrfSBgKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coZ3B1U3RhZ2UuZ2xTaGFkZXIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBsID0gMDsgbCA8IGdwdVNoYWRlci5ncHVTdGFnZXMubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFnZSA9IGdwdVNoYWRlci5ncHVTdGFnZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YWdlLmdsU2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzdGFnZS5nbFNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWdlLmdsU2hhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ2xQcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgaWYgKCFnbFByb2dyYW0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZ3B1U2hhZGVyLmdsUHJvZ3JhbSA9IGdsUHJvZ3JhbTtcclxuXHJcbiAgICAvLyBsaW5rIHByb2dyYW1cclxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1U2hhZGVyLmdwdVN0YWdlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIGNvbnN0IGdwdVN0YWdlID0gZ3B1U2hhZGVyLmdwdVN0YWdlc1trXTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIoZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgZ3B1U3RhZ2UuZ2xTaGFkZXIhKTtcclxuICAgIH1cclxuXHJcbiAgICBnbC5saW5rUHJvZ3JhbShncHVTaGFkZXIuZ2xQcm9ncmFtKTtcclxuXHJcbiAgICAvLyBkZXRhY2ggJiBkZWxldGUgaW1tZWRpYXRlbHlcclxuICAgIGlmIChkZXZpY2UuZGVzdHJveVNoYWRlcnNJbW1lZGlhdGVseSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1U2hhZGVyLmdwdVN0YWdlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICBjb25zdCBncHVTdGFnZSA9IGdwdVNoYWRlci5ncHVTdGFnZXNba107XHJcbiAgICAgICAgICAgIGlmIChncHVTdGFnZS5nbFNoYWRlcikge1xyXG4gICAgICAgICAgICAgICAgZ2wuZGV0YWNoU2hhZGVyKGdwdVNoYWRlci5nbFByb2dyYW0sIGdwdVN0YWdlLmdsU2hhZGVyKTtcclxuICAgICAgICAgICAgICAgIGdsLmRlbGV0ZVNoYWRlcihncHVTdGFnZS5nbFNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICBncHVTdGFnZS5nbFNoYWRlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGdsLmdldFByb2dyYW1QYXJhbWV0ZXIoZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpKSB7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdTaGFkZXIgXFwnJyArIGdwdVNoYWRlci5uYW1lICsgJ1xcJyBjb21waWxhdGlvbiBzdWNjZWVkZWQuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsaW5rIHNoYWRlciBcXCcnICsgZ3B1U2hhZGVyLm5hbWUgKyAnXFwnLicpO1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coZ3B1U2hhZGVyLmdsUHJvZ3JhbSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwYXJzZSBpbnB1dHNcclxuICAgIGNvbnN0IGFjdGl2ZUF0dHJpYkNvdW50ID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihncHVTaGFkZXIuZ2xQcm9ncmFtLCBnbC5BQ1RJVkVfQVRUUklCVVRFUyk7XHJcbiAgICBncHVTaGFkZXIuZ2xJbnB1dHMgPSBuZXcgQXJyYXk8SVdlYkdMR1BVSW5wdXQ+KGFjdGl2ZUF0dHJpYkNvdW50KTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGl2ZUF0dHJpYkNvdW50OyArK2kpIHtcclxuICAgICAgICBjb25zdCBhdHRyaWJJbmZvID0gZ2wuZ2V0QWN0aXZlQXR0cmliKGdwdVNoYWRlci5nbFByb2dyYW0sIGkpO1xyXG4gICAgICAgIGlmIChhdHRyaWJJbmZvKSB7XHJcbiAgICAgICAgICAgIGxldCB2YXJOYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWVPZmZzZXQgPSBhdHRyaWJJbmZvLm5hbWUuaW5kZXhPZignWycpO1xyXG4gICAgICAgICAgICBpZiAobmFtZU9mZnNldCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhck5hbWUgPSBhdHRyaWJJbmZvLm5hbWUuc3Vic3RyKDAsIG5hbWVPZmZzZXQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyTmFtZSA9IGF0dHJpYkluZm8ubmFtZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xMb2MgPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihncHVTaGFkZXIuZ2xQcm9ncmFtLCB2YXJOYW1lKTtcclxuICAgICAgICAgICAgY29uc3QgdHlwZSA9IFdlYkdMVHlwZVRvR0ZYVHlwZShhdHRyaWJJbmZvLnR5cGUsIGdsKTtcclxuICAgICAgICAgICAgY29uc3Qgc3RyaWRlID0gV2ViR0xHZXRUeXBlU2l6ZShhdHRyaWJJbmZvLnR5cGUsIGdsKTtcclxuXHJcbiAgICAgICAgICAgIGdwdVNoYWRlci5nbElucHV0c1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIGJpbmRpbmc6IGdsTG9jLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogdmFyTmFtZSxcclxuICAgICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgICBzdHJpZGUsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogYXR0cmliSW5mby5zaXplLFxyXG4gICAgICAgICAgICAgICAgc2l6ZTogc3RyaWRlICogYXR0cmliSW5mby5zaXplLFxyXG5cclxuICAgICAgICAgICAgICAgIGdsVHlwZTogYXR0cmliSW5mby50eXBlLFxyXG4gICAgICAgICAgICAgICAgZ2xMb2MsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGNyZWF0ZSB1bmlmb3JtIGJsb2Nrc1xyXG4gICAgaWYgKGdwdVNoYWRlci5ibG9ja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGdwdVNoYWRlci5nbEJsb2NrcyA9IG5ldyBBcnJheTxJV2ViR0xHUFVVbmlmb3JtQmxvY2s+KGdwdVNoYWRlci5ibG9ja3MubGVuZ3RoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVNoYWRlci5ibG9ja3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSBncHVTaGFkZXIuYmxvY2tzW2ldO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2xCbG9jazogSVdlYkdMR1BVVW5pZm9ybUJsb2NrID0ge1xyXG4gICAgICAgICAgICAgICAgc2V0OiBibG9jay5zZXQsXHJcbiAgICAgICAgICAgICAgICBiaW5kaW5nOiBibG9jay5iaW5kaW5nLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogYmxvY2submFtZSxcclxuICAgICAgICAgICAgICAgIHNpemU6IDAsXHJcbiAgICAgICAgICAgICAgICBnbFVuaWZvcm1zOiBuZXcgQXJyYXk8SVdlYkdMR1BVVW5pZm9ybT4oYmxvY2subWVtYmVycy5sZW5ndGgpLFxyXG4gICAgICAgICAgICAgICAgZ2xBY3RpdmVVbmlmb3JtczogW10sXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBncHVTaGFkZXIuZ2xCbG9ja3NbaV0gPSBnbEJsb2NrO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBibG9jay5tZW1iZXJzLmxlbmd0aDsgKyt1KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1bmlmb3JtID0gYmxvY2subWVtYmVyc1t1XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsVHlwZSA9IEdGWFR5cGVUb1dlYkdMVHlwZSh1bmlmb3JtLnR5cGUsIGdsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN0b3IgPSBHRlhUeXBlVG9UeXBlZEFycmF5Q3Rvcih1bmlmb3JtLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyaWRlID0gV2ViR0xHZXRUeXBlU2l6ZShnbFR5cGUsIGdsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSBzdHJpZGUgKiB1bmlmb3JtLmNvdW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmVnaW4gPSBnbEJsb2NrLnNpemUgLyA0O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY291bnQgPSBzaXplIC8gNDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gbmV3IGN0b3IoY291bnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdsQmxvY2suZ2xVbmlmb3Jtc1t1XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBiaW5kaW5nOiAtMSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiB1bmlmb3JtLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdW5pZm9ybS50eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmlkZSxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogdW5pZm9ybS5jb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBzaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogZ2xCbG9jay5zaXplLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBnbFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xMb2M6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBnbEJsb2NrLnNpemUgKz0gc2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgZ2xCbG9jay5idWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoZ2xCbG9jay5zaXplKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ2xCbG9jay5nbFVuaWZvcm1zLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFVuaWZvcm0gPSBnbEJsb2NrLmdsVW5pZm9ybXNba107XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdsVW5pZm9ybS5nbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGdsLkJPT0w6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzI6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzM6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5CT09MX1ZFQzQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5JTlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5JTlRfVkVDMjpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGdsLklOVF9WRUMzOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5TQU1QTEVSXzJEOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuU0FNUExFUl9DVUJFOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS52aTMyID0gbmV3IEludDMyQXJyYXkoZ2xCbG9jay5idWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbFVuaWZvcm0udmYzMiA9IG5ldyBGbG9hdDMyQXJyYXkoZ2xCbG9jay5idWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBjcmVhdGUgdW5pZm9ybSBzYW1wbGVyc1xyXG4gICAgaWYgKGdwdVNoYWRlci5zYW1wbGVycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZ3B1U2hhZGVyLmdsU2FtcGxlcnMgPSBuZXcgQXJyYXk8SVdlYkdMR1BVVW5pZm9ybVNhbXBsZXI+KGdwdVNoYWRlci5zYW1wbGVycy5sZW5ndGgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVNoYWRlci5zYW1wbGVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzYW1wbGVyID0gZ3B1U2hhZGVyLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgICAgICBncHVTaGFkZXIuZ2xTYW1wbGVyc1tpXSA9IHtcclxuICAgICAgICAgICAgICAgIHNldDogc2FtcGxlci5zZXQsXHJcbiAgICAgICAgICAgICAgICBiaW5kaW5nOiBzYW1wbGVyLmJpbmRpbmcsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBzYW1wbGVyLm5hbWUsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBzYW1wbGVyLnR5cGUsXHJcbiAgICAgICAgICAgICAgICBjb3VudDogc2FtcGxlci5jb3VudCxcclxuICAgICAgICAgICAgICAgIHVuaXRzOiBbXSxcclxuICAgICAgICAgICAgICAgIGdsVW5pdHM6IG51bGwhLFxyXG4gICAgICAgICAgICAgICAgZ2xUeXBlOiBHRlhUeXBlVG9XZWJHTFR5cGUoc2FtcGxlci50eXBlLCBnbCksXHJcbiAgICAgICAgICAgICAgICBnbExvYzogbnVsbCEsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHBhcnNlIHVuaWZvcm1zXHJcbiAgICBjb25zdCBhY3RpdmVVbmlmb3JtQ291bnQgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKGdwdVNoYWRlci5nbFByb2dyYW0sIGdsLkFDVElWRV9VTklGT1JNUyk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3RpdmVVbmlmb3JtQ291bnQ7ICsraSkge1xyXG4gICAgICAgIGNvbnN0IHVuaWZvcm1JbmZvID0gZ2wuZ2V0QWN0aXZlVW5pZm9ybShncHVTaGFkZXIuZ2xQcm9ncmFtLCBpKTtcclxuICAgICAgICBpZiAodW5pZm9ybUluZm8pIHtcclxuICAgICAgICAgICAgY29uc3QgaXNTYW1wbGVyID0gKHVuaWZvcm1JbmZvLnR5cGUgPT09IGdsLlNBTVBMRVJfMkQpIHx8XHJcbiAgICAgICAgICAgICAgICAodW5pZm9ybUluZm8udHlwZSA9PT0gZ2wuU0FNUExFUl9DVUJFKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXNTYW1wbGVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2xMb2MgPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oZ3B1U2hhZGVyLmdsUHJvZ3JhbSwgdW5pZm9ybUluZm8ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2xMb2MgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFyTmFtZTogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVPZmZzZXQgPSB1bmlmb3JtSW5mby5uYW1lLmluZGV4T2YoJ1snKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZU9mZnNldCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyTmFtZSA9IHVuaWZvcm1JbmZvLm5hbWUuc3Vic3RyKDAsIG5hbWVPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhck5hbWUgPSB1bmlmb3JtSW5mby5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHN0cmlkZSA9IFdlYkdMR2V0VHlwZVNpemUoaW5mby50eXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYnVpbGQgdW5pZm9ybSBibG9jayBtYXBwaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncHVTaGFkZXIuZ2xCbG9ja3MubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2xCbG9jayA9IGdwdVNoYWRlci5nbEJsb2Nrc1tqXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ2xCbG9jay5nbFVuaWZvcm1zLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnbFVuaWZvcm0gPSBnbEJsb2NrLmdsVW5pZm9ybXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ2xVbmlmb3JtLm5hbWUgPT09IHZhck5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdmFyU2l6ZSA9IHN0cmlkZSAqIGluZm8uc2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xVbmlmb3JtLmdsTG9jID0gZ2xMb2M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xCbG9jay5nbEFjdGl2ZVVuaWZvcm1zLnB1c2goZ2xVbmlmb3JtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IC8vIGZvclxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSAvLyBmb3JcclxuXHJcbiAgICAvLyB0ZXh0dXJlIHVuaXQgaW5kZXggbWFwcGluZyBvcHRpbWl6YXRpb25cclxuICAgIGNvbnN0IGdsQWN0aXZlU2FtcGxlcnM6IElXZWJHTEdQVVVuaWZvcm1TYW1wbGVyW10gPSBbXTtcclxuICAgIGNvbnN0IGdsQWN0aXZlU2FtcGxlckxvY2F0aW9uczogV2ViR0xVbmlmb3JtTG9jYXRpb25bXSA9IFtdO1xyXG4gICAgY29uc3QgYmluZGluZ01hcHBpbmdJbmZvID0gZGV2aWNlLmJpbmRpbmdNYXBwaW5nSW5mbztcclxuICAgIGNvbnN0IHRleFVuaXRDYWNoZU1hcCA9IGRldmljZS5zdGF0ZUNhY2hlLnRleFVuaXRDYWNoZU1hcDtcclxuXHJcbiAgICBsZXQgZmxleGlibGVTZXRCYXNlT2Zmc2V0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3B1U2hhZGVyLmJsb2Nrcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGlmIChncHVTaGFkZXIuYmxvY2tzW2ldLnNldCA9PT0gYmluZGluZ01hcHBpbmdJbmZvLmZsZXhpYmxlU2V0KSB7XHJcbiAgICAgICAgICAgIGZsZXhpYmxlU2V0QmFzZU9mZnNldCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgYXJyYXlPZmZzZXQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVTaGFkZXIuc2FtcGxlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gZ3B1U2hhZGVyLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgIGNvbnN0IGdsTG9jID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKGdwdVNoYWRlci5nbFByb2dyYW0sIHNhbXBsZXIubmFtZSk7XHJcbiAgICAgICAgaWYgKGdsTG9jKSB7XHJcbiAgICAgICAgICAgIGdsQWN0aXZlU2FtcGxlcnMucHVzaChncHVTaGFkZXIuZ2xTYW1wbGVyc1tpXSk7XHJcbiAgICAgICAgICAgIGdsQWN0aXZlU2FtcGxlckxvY2F0aW9ucy5wdXNoKGdsTG9jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRleFVuaXRDYWNoZU1hcFtzYW1wbGVyLm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGJpbmRpbmcgPSBzYW1wbGVyLmJpbmRpbmcgKyBiaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHNbc2FtcGxlci5zZXRdICsgYXJyYXlPZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChzYW1wbGVyLnNldCA9PT0gYmluZGluZ01hcHBpbmdJbmZvLmZsZXhpYmxlU2V0KSBiaW5kaW5nIC09IGZsZXhpYmxlU2V0QmFzZU9mZnNldDtcclxuICAgICAgICAgICAgdGV4VW5pdENhY2hlTWFwW3NhbXBsZXIubmFtZV0gPSBiaW5kaW5nICUgZGV2aWNlLm1heFRleHR1cmVVbml0cztcclxuICAgICAgICAgICAgYXJyYXlPZmZzZXQgKz0gc2FtcGxlci5jb3VudCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChnbEFjdGl2ZVNhbXBsZXJzLmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IHVzZWRUZXhVbml0czogYm9vbGVhbltdID0gW107XHJcbiAgICAgICAgLy8gdHJ5IHRvIHJldXNlIGV4aXN0aW5nIG1hcHBpbmdzIGZpcnN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnbEFjdGl2ZVNhbXBsZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdsU2FtcGxlciA9IGdsQWN0aXZlU2FtcGxlcnNbaV07XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FjaGVkVW5pdCA9IHRleFVuaXRDYWNoZU1hcFtnbFNhbXBsZXIubmFtZV07XHJcbiAgICAgICAgICAgIGlmIChjYWNoZWRVbml0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGdsU2FtcGxlci5nbExvYyA9IGdsQWN0aXZlU2FtcGxlckxvY2F0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHQgPSAwOyB0IDwgZ2xTYW1wbGVyLmNvdW50OyArK3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodXNlZFRleFVuaXRzW2NhY2hlZFVuaXRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlZFVuaXQgPSAoY2FjaGVkVW5pdCArIDEpICUgZGV2aWNlLm1heFRleHR1cmVVbml0cztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xTYW1wbGVyLnVuaXRzLnB1c2goY2FjaGVkVW5pdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlZFRleFVuaXRzW2NhY2hlZFVuaXRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmaWxsIGluIHRoZSByZXN0IHNlcXVlbmNpYWxseVxyXG4gICAgICAgIGxldCB1bml0SWR4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdsQWN0aXZlU2FtcGxlcnMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2xTYW1wbGVyID0gZ2xBY3RpdmVTYW1wbGVyc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZ2xTYW1wbGVyLmdsTG9jKSB7XHJcbiAgICAgICAgICAgICAgICBnbFNhbXBsZXIuZ2xMb2MgPSBnbEFjdGl2ZVNhbXBsZXJMb2NhdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB0ID0gMDsgdCA8IGdsU2FtcGxlci5jb3VudDsgKyt0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHVzZWRUZXhVbml0c1t1bml0SWR4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0SWR4ID0gKHVuaXRJZHggKyAxKSAlIGRldmljZS5tYXhUZXh0dXJlVW5pdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXhVbml0Q2FjaGVNYXBbZ2xTYW1wbGVyLm5hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4VW5pdENhY2hlTWFwW2dsU2FtcGxlci5uYW1lXSA9IHVuaXRJZHg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGdsU2FtcGxlci51bml0cy5wdXNoKHVuaXRJZHgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZWRUZXhVbml0c1t1bml0SWR4XSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkZXZpY2Uuc3RhdGVDYWNoZS5nbFByb2dyYW0gIT09IGdwdVNoYWRlci5nbFByb2dyYW0pIHtcclxuICAgICAgICAgICAgZ2wudXNlUHJvZ3JhbShncHVTaGFkZXIuZ2xQcm9ncmFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2xBY3RpdmVTYW1wbGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBnbFNhbXBsZXIgPSBnbEFjdGl2ZVNhbXBsZXJzW2ldO1xyXG4gICAgICAgICAgICBnbFNhbXBsZXIuZ2xVbml0cyA9IG5ldyBJbnQzMkFycmF5KGdsU2FtcGxlci51bml0cyk7XHJcbiAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYoZ2xTYW1wbGVyLmdsTG9jLCBnbFNhbXBsZXIuZ2xVbml0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGV2aWNlLnN0YXRlQ2FjaGUuZ2xQcm9ncmFtICE9PSBncHVTaGFkZXIuZ2xQcm9ncmFtKSB7XHJcbiAgICAgICAgICAgIGdsLnVzZVByb2dyYW0oZGV2aWNlLnN0YXRlQ2FjaGUuZ2xQcm9ncmFtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RyaXAgb3V0IHRoZSBpbmFjdGl2ZSBvbmVzXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdwdVNoYWRlci5nbEJsb2Nrcy5sZW5ndGg7KSB7XHJcbiAgICAgICAgaWYgKGdwdVNoYWRlci5nbEJsb2Nrc1tpXS5nbEFjdGl2ZVVuaWZvcm1zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3B1U2hhZGVyLmdsQmxvY2tzW2ldID0gZ3B1U2hhZGVyLmdsQmxvY2tzW2dwdVNoYWRlci5nbEJsb2Nrcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgZ3B1U2hhZGVyLmdsQmxvY2tzLmxlbmd0aC0tO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBncHVTaGFkZXIuZ2xTYW1wbGVycyA9IGdsQWN0aXZlU2FtcGxlcnM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNEZXN0cm95U2hhZGVyIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBncHVTaGFkZXI6IElXZWJHTEdQVVNoYWRlcikge1xyXG4gICAgaWYgKGdwdVNoYWRlci5nbFByb2dyYW0pIHtcclxuICAgICAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgICAgICBpZiAoIWRldmljZS5kZXN0cm95U2hhZGVyc0ltbWVkaWF0ZWx5KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3B1U2hhZGVyLmdwdVN0YWdlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3B1U3RhZ2UgPSBncHVTaGFkZXIuZ3B1U3RhZ2VzW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdVN0YWdlLmdsU2hhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGV0YWNoU2hhZGVyKGdwdVNoYWRlci5nbFByb2dyYW0sIGdwdVN0YWdlLmdsU2hhZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kZWxldGVTaGFkZXIoZ3B1U3RhZ2UuZ2xTaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdwdVN0YWdlLmdsU2hhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnbC5kZWxldGVQcm9ncmFtKGdwdVNoYWRlci5nbFByb2dyYW0pO1xyXG4gICAgICAgIGdwdVNoYWRlci5nbFByb2dyYW0gPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jQ3JlYXRlSW5wdXRBc3NlbWJlciAoZGV2aWNlOiBXZWJHTERldmljZSwgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTEdQVUlucHV0QXNzZW1ibGVyKSB7XHJcblxyXG4gICAgY29uc3QgZ2wgPSBkZXZpY2UuZ2w7XHJcblxyXG4gICAgZ3B1SW5wdXRBc3NlbWJsZXIuZ2xBdHRyaWJzID0gbmV3IEFycmF5PElXZWJHTEF0dHJpYj4oZ3B1SW5wdXRBc3NlbWJsZXIuYXR0cmlidXRlcy5sZW5ndGgpO1xyXG5cclxuICAgIGNvbnN0IG9mZnNldHMgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncHVJbnB1dEFzc2VtYmxlci5hdHRyaWJ1dGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmliID0gZ3B1SW5wdXRBc3NlbWJsZXIuYXR0cmlidXRlc1tpXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RyZWFtID0gYXR0cmliLnN0cmVhbSAhPT0gdW5kZWZpbmVkID8gYXR0cmliLnN0cmVhbSA6IDA7XHJcblxyXG4gICAgICAgIGNvbnN0IGdwdUJ1ZmZlciA9IGdwdUlucHV0QXNzZW1ibGVyLmdwdVZlcnRleEJ1ZmZlcnNbc3RyZWFtXTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2xUeXBlID0gR0ZYRm9ybWF0VG9XZWJHTFR5cGUoYXR0cmliLmZvcm1hdCwgZ2wpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSBHRlhGb3JtYXRJbmZvc1thdHRyaWIuZm9ybWF0XS5zaXplO1xyXG5cclxuICAgICAgICBncHVJbnB1dEFzc2VtYmxlci5nbEF0dHJpYnNbaV0gPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IGF0dHJpYi5uYW1lLFxyXG4gICAgICAgICAgICBnbEJ1ZmZlcjogZ3B1QnVmZmVyLmdsQnVmZmVyLFxyXG4gICAgICAgICAgICBnbFR5cGUsXHJcbiAgICAgICAgICAgIHNpemUsXHJcbiAgICAgICAgICAgIGNvdW50OiBHRlhGb3JtYXRJbmZvc1thdHRyaWIuZm9ybWF0XS5jb3VudCxcclxuICAgICAgICAgICAgc3RyaWRlOiBncHVCdWZmZXIuc3RyaWRlLFxyXG4gICAgICAgICAgICBjb21wb25lbnRDb3VudDogV2ViR0xHZXRDb21wb25lbnRDb3VudChnbFR5cGUsIGdsKSxcclxuICAgICAgICAgICAgaXNOb3JtYWxpemVkOiAoYXR0cmliLmlzTm9ybWFsaXplZCAhPT0gdW5kZWZpbmVkID8gYXR0cmliLmlzTm9ybWFsaXplZCA6IGZhbHNlKSxcclxuICAgICAgICAgICAgaXNJbnN0YW5jZWQ6IChhdHRyaWIuaXNJbnN0YW5jZWQgIT09IHVuZGVmaW5lZCA/IGF0dHJpYi5pc0luc3RhbmNlZCA6IGZhbHNlKSxcclxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXRzW3N0cmVhbV0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgb2Zmc2V0c1tzdHJlYW1dICs9IHNpemU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNEZXN0cm95SW5wdXRBc3NlbWJsZXIgKGRldmljZTogV2ViR0xEZXZpY2UsIGdwdUlucHV0QXNzZW1ibGVyOiBJV2ViR0xHUFVJbnB1dEFzc2VtYmxlcikge1xyXG4gICAgY29uc3QgaXQgPSBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3MudmFsdWVzKCk7XHJcbiAgICBsZXQgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgd2hpbGUgKCFyZXMuZG9uZSkge1xyXG4gICAgICAgIGRldmljZS5PRVNfdmVydGV4X2FycmF5X29iamVjdCEuZGVsZXRlVmVydGV4QXJyYXlPRVMocmVzLnZhbHVlKTtcclxuICAgICAgICByZXMgPSBpdC5uZXh0KCk7XHJcbiAgICB9XHJcbiAgICBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3MuY2xlYXIoKTtcclxufVxyXG5cclxuaW50ZXJmYWNlIElXZWJHTFN0YXRlQ2FjaGUge1xyXG4gICAgZ3B1UGlwZWxpbmVTdGF0ZTogSVdlYkdMR1BVUGlwZWxpbmVTdGF0ZSB8IG51bGw7XHJcbiAgICBncHVJbnB1dEFzc2VtYmxlcjogSVdlYkdMR1BVSW5wdXRBc3NlbWJsZXIgfCBudWxsO1xyXG4gICAgcmV2ZXJzZUNXOiBib29sZWFuO1xyXG4gICAgZ2xQcmltaXRpdmU6IG51bWJlcjtcclxufVxyXG5jb25zdCBnZnhTdGF0ZUNhY2hlOiBJV2ViR0xTdGF0ZUNhY2hlID0ge1xyXG4gICAgZ3B1UGlwZWxpbmVTdGF0ZTogbnVsbCxcclxuICAgIGdwdUlucHV0QXNzZW1ibGVyOiBudWxsLFxyXG4gICAgcmV2ZXJzZUNXOiBmYWxzZSxcclxuICAgIGdsUHJpbWl0aXZlOiAwLFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMQ21kRnVuY0JlZ2luUmVuZGVyUGFzcyAoXHJcbiAgICBkZXZpY2U6IFdlYkdMRGV2aWNlLFxyXG4gICAgZ3B1UmVuZGVyUGFzczogSVdlYkdMR1BVUmVuZGVyUGFzcyB8IG51bGwsXHJcbiAgICBncHVGcmFtZWJ1ZmZlcjogSVdlYkdMR1BVRnJhbWVidWZmZXIgfCBudWxsLFxyXG4gICAgcmVuZGVyQXJlYTogR0ZYUmVjdCxcclxuICAgIGNsZWFyQ29sb3JzOiBHRlhDb2xvcltdLFxyXG4gICAgY2xlYXJEZXB0aDogbnVtYmVyLFxyXG4gICAgY2xlYXJTdGVuY2lsOiBudW1iZXIpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGNhY2hlID0gZGV2aWNlLnN0YXRlQ2FjaGU7XHJcbiAgICBsZXQgY2xlYXJzOiBHTGJpdGZpZWxkID0gMDtcclxuXHJcbiAgICBpZiAoZ3B1RnJhbWVidWZmZXIgJiYgZ3B1UmVuZGVyUGFzcykge1xyXG4gICAgICAgIGlmIChjYWNoZS5nbEZyYW1lYnVmZmVyICE9PSBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGNhY2hlLmdsRnJhbWVidWZmZXIgPSBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyO1xyXG4gICAgICAgICAgICAvLyByZW5kZXIgdGFyZ2V0cyBhcmUgZHJhd24gd2l0aCBmbGlwcGVkLVlcclxuICAgICAgICAgICAgY29uc3QgcmV2ZXJzZUNXID0gISFncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyO1xyXG4gICAgICAgICAgICBpZiAocmV2ZXJzZUNXICE9PSBnZnhTdGF0ZUNhY2hlLnJldmVyc2VDVykge1xyXG4gICAgICAgICAgICAgICAgZ2Z4U3RhdGVDYWNoZS5yZXZlcnNlQ1cgPSByZXZlcnNlQ1c7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0NDVyA9ICFkZXZpY2Uuc3RhdGVDYWNoZS5ycy5pc0Zyb250RmFjZUNDVztcclxuICAgICAgICAgICAgICAgIGdsLmZyb250RmFjZShpc0NDVyA/IGdsLkNDVyA6IGdsLkNXKTtcclxuICAgICAgICAgICAgICAgIGRldmljZS5zdGF0ZUNhY2hlLnJzLmlzRnJvbnRGYWNlQ0NXID0gaXNDQ1c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYWNoZS52aWV3cG9ydC5sZWZ0ICE9PSByZW5kZXJBcmVhLnggfHxcclxuICAgICAgICAgICAgY2FjaGUudmlld3BvcnQudG9wICE9PSByZW5kZXJBcmVhLnkgfHxcclxuICAgICAgICAgICAgY2FjaGUudmlld3BvcnQud2lkdGggIT09IHJlbmRlckFyZWEud2lkdGggfHxcclxuICAgICAgICAgICAgY2FjaGUudmlld3BvcnQuaGVpZ2h0ICE9PSByZW5kZXJBcmVhLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgZ2wudmlld3BvcnQocmVuZGVyQXJlYS54LCByZW5kZXJBcmVhLnksIHJlbmRlckFyZWEud2lkdGgsIHJlbmRlckFyZWEuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LmxlZnQgPSByZW5kZXJBcmVhLng7XHJcbiAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LnRvcCA9IHJlbmRlckFyZWEueTtcclxuICAgICAgICAgICAgY2FjaGUudmlld3BvcnQud2lkdGggPSByZW5kZXJBcmVhLndpZHRoO1xyXG4gICAgICAgICAgICBjYWNoZS52aWV3cG9ydC5oZWlnaHQgPSByZW5kZXJBcmVhLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYWNoZS5zY2lzc29yUmVjdC54ICE9PSByZW5kZXJBcmVhLnggfHxcclxuICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QueSAhPT0gcmVuZGVyQXJlYS55IHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LndpZHRoICE9PSByZW5kZXJBcmVhLndpZHRoIHx8XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LmhlaWdodCAhPT0gcmVuZGVyQXJlYS5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgIGdsLnNjaXNzb3IocmVuZGVyQXJlYS54LCByZW5kZXJBcmVhLnksIHJlbmRlckFyZWEud2lkdGgsIHJlbmRlckFyZWEuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LnggPSByZW5kZXJBcmVhLng7XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LnkgPSByZW5kZXJBcmVhLnk7XHJcbiAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LndpZHRoID0gcmVuZGVyQXJlYS53aWR0aDtcclxuICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QuaGVpZ2h0ID0gcmVuZGVyQXJlYS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb25zdCBpbnZhbGlkYXRlQXR0YWNobWVudHM6IEdMZW51bVtdID0gW107XHJcbiAgICAgICAgbGV0IGNsZWFyQ291bnQgPSBjbGVhckNvbG9ycy5sZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICghZGV2aWNlLldFQkdMX2RyYXdfYnVmZmVycykge1xyXG4gICAgICAgICAgICBjbGVhckNvdW50ID0gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY2xlYXJDb3VudDsgKytqKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yQXR0YWNobWVudCA9IGdwdVJlbmRlclBhc3MuY29sb3JBdHRhY2htZW50c1tqXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjb2xvckF0dGFjaG1lbnQuZm9ybWF0ICE9PSBHRlhGb3JtYXQuVU5LTk9XTikge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb2xvckF0dGFjaG1lbnQubG9hZE9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuTE9BRDogYnJlYWs7IC8vIEdMIGRlZmF1bHQgYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5DTEVBUjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuYnMudGFyZ2V0c1swXS5ibGVuZENvbG9yTWFzayAhPT0gR0ZYQ29sb3JNYXNrLkFMTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY29sb3JNYXNrKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGVhckNvbG9yID0gY2xlYXJDb2xvcnNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNsZWFyQ29sb3IoY2xlYXJDb2xvci54LCBjbGVhckNvbG9yLnksIGNsZWFyQ29sb3IueiwgY2xlYXJDb2xvci53KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJzIHw9IGdsLkNPTE9SX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5ESVNDQVJEOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGUgdGhlIGZyYW1lYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGVBdHRhY2htZW50cy5wdXNoKGdsLkNPTE9SX0FUVEFDSE1FTlQwICsgaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAvLyBpZiAoY3VyR1BVUmVuZGVyUGFzcylcclxuXHJcbiAgICAgICAgaWYgKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudC5mb3JtYXQgIT09IEdGWEZvcm1hdC5VTktOT1dOKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudC5kZXB0aExvYWRPcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYTG9hZE9wLkxPQUQ6IGJyZWFrOyAvLyBHTCBkZWZhdWx0IGJlaGF2aW9yXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuQ0xFQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3MuZGVwdGhXcml0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZGVwdGhNYXNrKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5jbGVhckRlcHRoKGNsZWFyRGVwdGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJzIHw9IGdsLkRFUFRIX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWExvYWRPcC5ESVNDQVJEOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGUgdGhlIGZyYW1lYnVmZmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGVBdHRhY2htZW50cy5wdXNoKGdsLkRFUFRIX0FUVEFDSE1FTlQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoR0ZYRm9ybWF0SW5mb3NbZ3B1UmVuZGVyUGFzcy5kZXB0aFN0ZW5jaWxBdHRhY2htZW50LmZvcm1hdF0uaGFzU3RlbmNpbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZ3B1UmVuZGVyUGFzcy5kZXB0aFN0ZW5jaWxBdHRhY2htZW50LnN0ZW5jaWxMb2FkT3ApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuTE9BRDogYnJlYWs7IC8vIEdMIGRlZmF1bHQgYmVoYXZpb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuQ0xFQVI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuRlJPTlQsIDB4ZmZmZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIDB4ZmZmZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY2xlYXJTdGVuY2lsKGNsZWFyU3RlbmNpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcnMgfD0gZ2wuU1RFTkNJTF9CVUZGRVJfQklUO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhMb2FkT3AuRElTQ0FSRDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW52YWxpZGF0ZSB0aGUgZnJhbWVidWZmZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWRhdGVBdHRhY2htZW50cy5wdXNoKGdsLlNURU5DSUxfQVRUQUNITUVOVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gaWYgKGdwdVJlbmRlclBhc3MuZGVwdGhTdGVuY2lsQXR0YWNobWVudClcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBpZiAoaW52YWxpZGF0ZUF0dGFjaG1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBnbC5pbnZhbGlkYXRlRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGludmFsaWRhdGVBdHRhY2htZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIGlmIChjbGVhcnMpIHtcclxuICAgICAgICAgICAgZ2wuY2xlYXIoY2xlYXJzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlc3RvcmUgc3RhdGVzXHJcbiAgICAgICAgaWYgKGNsZWFycyAmIGdsLkNPTE9SX0JVRkZFUl9CSVQpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yTWFzayA9IGNhY2hlLmJzLnRhcmdldHNbMF0uYmxlbmRDb2xvck1hc2s7XHJcbiAgICAgICAgICAgIGlmIChjb2xvck1hc2sgIT09IEdGWENvbG9yTWFzay5BTEwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLlIpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGcgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkcpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGIgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkIpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSAoY29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkEpICE9PSBHRlhDb2xvck1hc2suTk9ORTtcclxuICAgICAgICAgICAgICAgIGdsLmNvbG9yTWFzayhyLCBnLCBiLCBhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKChjbGVhcnMgJiBnbC5ERVBUSF9CVUZGRVJfQklUKSAmJlxyXG4gICAgICAgICAgICAhY2FjaGUuZHNzLmRlcHRoV3JpdGUpIHtcclxuICAgICAgICAgICAgZ2wuZGVwdGhNYXNrKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbGVhcnMgJiBnbC5TVEVOQ0lMX0JVRkZFUl9CSVQpIHtcclxuICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250KSB7XHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkZST05ULCAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2spIHtcclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuQkFDSywgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IC8vIGlmIChncHVGcmFtZWJ1ZmZlcilcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMQ21kRnVuY0JpbmRTdGF0ZXMgKFxyXG4gICAgZGV2aWNlOiBXZWJHTERldmljZSxcclxuICAgIGdwdVBpcGVsaW5lU3RhdGU6IElXZWJHTEdQVVBpcGVsaW5lU3RhdGUgfCBudWxsLFxyXG4gICAgZ3B1SW5wdXRBc3NlbWJsZXI6IElXZWJHTEdQVUlucHV0QXNzZW1ibGVyIHwgbnVsbCxcclxuICAgIGdwdURlc2NyaXB0b3JTZXRzOiBJV2ViR0xHUFVEZXNjcmlwdG9yU2V0W10sXHJcbiAgICBkeW5hbWljT2Zmc2V0czogbnVtYmVyW10sXHJcbiAgICB2aWV3cG9ydDogR0ZYVmlld3BvcnQgfCBudWxsLFxyXG4gICAgc2Npc3NvcjogR0ZYUmVjdCB8IG51bGwsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciB8IG51bGwsXHJcbiAgICBkZXB0aEJpYXM6IElXZWJHTERlcHRoQmlhcyB8IG51bGwsXHJcbiAgICBibGVuZENvbnN0YW50czogbnVtYmVyW10sXHJcbiAgICBkZXB0aEJvdW5kczogSVdlYkdMRGVwdGhCb3VuZHMgfCBudWxsLFxyXG4gICAgc3RlbmNpbFdyaXRlTWFzazogSVdlYkdMU3RlbmNpbFdyaXRlTWFzayB8IG51bGwsXHJcbiAgICBzdGVuY2lsQ29tcGFyZU1hc2s6IElXZWJHTFN0ZW5jaWxDb21wYXJlTWFzayB8IG51bGwpIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGNhY2hlID0gZGV2aWNlLnN0YXRlQ2FjaGU7XHJcbiAgICBjb25zdCBncHVTaGFkZXIgPSBncHVQaXBlbGluZVN0YXRlICYmIGdwdVBpcGVsaW5lU3RhdGUuZ3B1U2hhZGVyO1xyXG5cclxuICAgIGxldCBpc1NoYWRlckNoYW5nZWQgPSBmYWxzZTtcclxuICAgIGxldCBnbFdyYXBTOiBudW1iZXI7XHJcbiAgICBsZXQgZ2xXcmFwVDogbnVtYmVyO1xyXG4gICAgbGV0IGdsTWluRmlsdGVyOiBudW1iZXI7XHJcblxyXG4gICAgLy8gYmluZCBwaXBlbGluZVxyXG4gICAgaWYgKGdwdVBpcGVsaW5lU3RhdGUgJiYgZ2Z4U3RhdGVDYWNoZS5ncHVQaXBlbGluZVN0YXRlICE9PSBncHVQaXBlbGluZVN0YXRlKSB7XHJcbiAgICAgICAgZ2Z4U3RhdGVDYWNoZS5ncHVQaXBlbGluZVN0YXRlID0gZ3B1UGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICBnZnhTdGF0ZUNhY2hlLmdsUHJpbWl0aXZlID0gZ3B1UGlwZWxpbmVTdGF0ZS5nbFByaW1pdGl2ZTtcclxuXHJcbiAgICAgICAgaWYgKGdwdVBpcGVsaW5lU3RhdGUuZ3B1U2hhZGVyKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnbFByb2dyYW0gPSBncHVQaXBlbGluZVN0YXRlLmdwdVNoYWRlci5nbFByb2dyYW07XHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5nbFByb2dyYW0gIT09IGdsUHJvZ3JhbSkge1xyXG4gICAgICAgICAgICAgICAgZ2wudXNlUHJvZ3JhbShnbFByb2dyYW0pO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xQcm9ncmFtID0gZ2xQcm9ncmFtO1xyXG4gICAgICAgICAgICAgICAgaXNTaGFkZXJDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmFzdGVyaXplciBzdGF0ZVxyXG4gICAgICAgIGNvbnN0IHJzID0gZ3B1UGlwZWxpbmVTdGF0ZS5ycztcclxuICAgICAgICBpZiAocnMpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5ycy5jdWxsTW9kZSAhPT0gcnMuY3VsbE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAocnMuY3VsbE1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWEN1bGxNb2RlLk5PTkU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhDdWxsTW9kZS5GUk9OVDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY3VsbEZhY2UoZ2wuRlJPTlQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhDdWxsTW9kZS5CQUNLOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC5jdWxsRmFjZShnbC5CQUNLKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGUucnMuY3VsbE1vZGUgPSBycy5jdWxsTW9kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNGcm9udEZhY2VDQ1cgPSBnZnhTdGF0ZUNhY2hlLnJldmVyc2VDVyA/ICFycy5pc0Zyb250RmFjZUNDVyA6IHJzLmlzRnJvbnRGYWNlQ0NXO1xyXG4gICAgICAgICAgICBpZiAoY2FjaGUucnMuaXNGcm9udEZhY2VDQ1cgIT09IGlzRnJvbnRGYWNlQ0NXKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5mcm9udEZhY2UoaXNGcm9udEZhY2VDQ1cgPyBnbC5DQ1cgOiBnbC5DVyk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5ycy5pc0Zyb250RmFjZUNDVyA9IGlzRnJvbnRGYWNlQ0NXO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKGNhY2hlLnJzLmRlcHRoQmlhcyAhPT0gcnMuZGVwdGhCaWFzKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLnJzLmRlcHRoQmlhc1Nsb3AgIT09IHJzLmRlcHRoQmlhc1Nsb3ApKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5wb2x5Z29uT2Zmc2V0KHJzLmRlcHRoQmlhcywgcnMuZGVwdGhCaWFzU2xvcCk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5ycy5kZXB0aEJpYXMgPSBycy5kZXB0aEJpYXM7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5ycy5kZXB0aEJpYXNTbG9wID0gcnMuZGVwdGhCaWFzU2xvcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLnJzLmxpbmVXaWR0aCAhPT0gcnMubGluZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5saW5lV2lkdGgocnMubGluZVdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLnJzLmxpbmVXaWR0aCA9IHJzLmxpbmVXaWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IC8vIHJhc3Rlcml6YXRlciBzdGF0ZVxyXG5cclxuICAgICAgICAvLyBkZXB0aC1zdGVuY2lsIHN0YXRlXHJcbiAgICAgICAgY29uc3QgZHNzID0gZ3B1UGlwZWxpbmVTdGF0ZS5kc3M7XHJcbiAgICAgICAgaWYgKGRzcykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5kZXB0aFRlc3QgIT09IGRzcy5kZXB0aFRlc3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkc3MuZGVwdGhUZXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kaXNhYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLmRlcHRoVGVzdCA9IGRzcy5kZXB0aFRlc3Q7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYWNoZS5kc3MuZGVwdGhXcml0ZSAhPT0gZHNzLmRlcHRoV3JpdGUpIHtcclxuICAgICAgICAgICAgICAgIGdsLmRlcHRoTWFzayhkc3MuZGVwdGhXcml0ZSk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3MuZGVwdGhXcml0ZSA9IGRzcy5kZXB0aFdyaXRlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUuZHNzLmRlcHRoRnVuYyAhPT0gZHNzLmRlcHRoRnVuYykge1xyXG4gICAgICAgICAgICAgICAgZ2wuZGVwdGhGdW5jKFdlYkdMQ21wRnVuY3NbZHNzLmRlcHRoRnVuY10pO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLmRlcHRoRnVuYyA9IGRzcy5kZXB0aEZ1bmM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGZyb250XHJcbiAgICAgICAgICAgIGlmICgoY2FjaGUuZHNzLnN0ZW5jaWxUZXN0RnJvbnQgIT09IGRzcy5zdGVuY2lsVGVzdEZyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsVGVzdEJhY2sgIT09IGRzcy5zdGVuY2lsVGVzdEJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZHNzLnN0ZW5jaWxUZXN0RnJvbnQgfHwgZHNzLnN0ZW5jaWxUZXN0QmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmVuYWJsZShnbC5TVEVOQ0lMX1RFU1QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kaXNhYmxlKGdsLlNURU5DSUxfVEVTVCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFRlc3RGcm9udCA9IGRzcy5zdGVuY2lsVGVzdEZyb250O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxUZXN0QmFjayA9IGRzcy5zdGVuY2lsVGVzdEJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoY2FjaGUuZHNzLnN0ZW5jaWxGdW5jRnJvbnQgIT09IGRzcy5zdGVuY2lsRnVuY0Zyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVmRnJvbnQgIT09IGRzcy5zdGVuY2lsUmVmRnJvbnQpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ICE9PSBkc3Muc3RlbmNpbFJlYWRNYXNrRnJvbnQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuc3RlbmNpbEZ1bmNTZXBhcmF0ZShcclxuICAgICAgICAgICAgICAgICAgICBnbC5GUk9OVCxcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTENtcEZ1bmNzW2Rzcy5zdGVuY2lsRnVuY0Zyb250XSxcclxuICAgICAgICAgICAgICAgICAgICBkc3Muc3RlbmNpbFJlZkZyb250LFxyXG4gICAgICAgICAgICAgICAgICAgIGRzcy5zdGVuY2lsUmVhZE1hc2tGcm9udCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxGdW5jRnJvbnQgPSBkc3Muc3RlbmNpbEZ1bmNGcm9udDtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVmRnJvbnQgPSBkc3Muc3RlbmNpbFJlZkZyb250O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ID0gZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKGNhY2hlLmRzcy5zdGVuY2lsRmFpbE9wRnJvbnQgIT09IGRzcy5zdGVuY2lsRmFpbE9wRnJvbnQpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2FjaGUuZHNzLnN0ZW5jaWxaRmFpbE9wRnJvbnQgIT09IGRzcy5zdGVuY2lsWkZhaWxPcEZyb250KSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wRnJvbnQgIT09IGRzcy5zdGVuY2lsUGFzc09wRnJvbnQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZ2wuc3RlbmNpbE9wU2VwYXJhdGUoXHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuRlJPTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsRmFpbE9wRnJvbnRdLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYkdMU3RlbmNpbE9wc1tkc3Muc3RlbmNpbFpGYWlsT3BGcm9udF0sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsUGFzc09wRnJvbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEZyb250ID0gZHNzLnN0ZW5jaWxGYWlsT3BGcm9udDtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsWkZhaWxPcEZyb250ID0gZHNzLnN0ZW5jaWxaRmFpbE9wRnJvbnQ7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFBhc3NPcEZyb250ID0gZHNzLnN0ZW5jaWxQYXNzT3BGcm9udDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgIT09IGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpIHtcclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuRlJPTlQsIGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQpO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9IGRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGJhY2tcclxuICAgICAgICAgICAgaWYgKChjYWNoZS5kc3Muc3RlbmNpbEZ1bmNCYWNrICE9PSBkc3Muc3RlbmNpbEZ1bmNCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVmQmFjayAhPT0gZHNzLnN0ZW5jaWxSZWZCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUmVhZE1hc2tCYWNrICE9PSBkc3Muc3RlbmNpbFJlYWRNYXNrQmFjaykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLkJBQ0ssXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xDbXBGdW5jc1tkc3Muc3RlbmNpbEZ1bmNCYWNrXSxcclxuICAgICAgICAgICAgICAgICAgICBkc3Muc3RlbmNpbFJlZkJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2spO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsRnVuY0JhY2sgPSBkc3Muc3RlbmNpbEZ1bmNCYWNrO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWZCYWNrID0gZHNzLnN0ZW5jaWxSZWZCYWNrO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgPSBkc3Muc3RlbmNpbFJlYWRNYXNrQmFjaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEJhY2sgIT09IGRzcy5zdGVuY2lsRmFpbE9wQmFjaykgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5kc3Muc3RlbmNpbFpGYWlsT3BCYWNrICE9PSBkc3Muc3RlbmNpbFpGYWlsT3BCYWNrKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wQmFjayAhPT0gZHNzLnN0ZW5jaWxQYXNzT3BCYWNrKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxPcFNlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgIGdsLkJBQ0ssXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsRmFpbE9wQmFja10sXHJcbiAgICAgICAgICAgICAgICAgICAgV2ViR0xTdGVuY2lsT3BzW2Rzcy5zdGVuY2lsWkZhaWxPcEJhY2tdLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYkdMU3RlbmNpbE9wc1tkc3Muc3RlbmNpbFBhc3NPcEJhY2tdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbEZhaWxPcEJhY2sgPSBkc3Muc3RlbmNpbEZhaWxPcEJhY2s7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFpGYWlsT3BCYWNrID0gZHNzLnN0ZW5jaWxaRmFpbE9wQmFjaztcclxuICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUGFzc09wQmFjayA9IGRzcy5zdGVuY2lsUGFzc09wQmFjaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayAhPT0gZHNzLnN0ZW5jaWxXcml0ZU1hc2tCYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIGRzcy5zdGVuY2lsV3JpdGVNYXNrQmFjayk7XHJcbiAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgPSBkc3Muc3RlbmNpbFdyaXRlTWFza0JhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGRlcHRoLXN0ZW5jaWwgc3RhdGVcclxuXHJcbiAgICAgICAgLy8gYmxlbmQgc3RhdGVcclxuICAgICAgICBjb25zdCBicyA9IGdwdVBpcGVsaW5lU3RhdGUuYnM7XHJcbiAgICAgICAgaWYgKGJzKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUuYnMuaXNBMkMgIT09IGJzLmlzQTJDKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnMuaXNBMkMpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5lbmFibGUoZ2wuU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5TQU1QTEVfQUxQSEFfVE9fQ09WRVJBR0UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuaXNBMkMgPSBicy5pc0EyQztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKChjYWNoZS5icy5ibGVuZENvbG9yLnggIT09IGJzLmJsZW5kQ29sb3IueCkgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLnkgIT09IGJzLmJsZW5kQ29sb3IueSkgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLnogIT09IGJzLmJsZW5kQ29sb3IueikgfHxcclxuICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLncgIT09IGJzLmJsZW5kQ29sb3IudykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5ibGVuZENvbG9yKGJzLmJsZW5kQ29sb3IueCwgYnMuYmxlbmRDb2xvci55LCBicy5ibGVuZENvbG9yLnosIGJzLmJsZW5kQ29sb3Iudyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci54ID0gYnMuYmxlbmRDb2xvci54O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci55ID0gYnMuYmxlbmRDb2xvci55O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci56ID0gYnMuYmxlbmRDb2xvci56O1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci53ID0gYnMuYmxlbmRDb2xvci53O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQwID0gYnMudGFyZ2V0c1swXTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0MENhY2hlID0gY2FjaGUuYnMudGFyZ2V0c1swXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQwQ2FjaGUuYmxlbmQgIT09IHRhcmdldDAuYmxlbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQwLmJsZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlKGdsLkJMRU5EKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmQgPSB0YXJnZXQwLmJsZW5kO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKHRhcmdldDBDYWNoZS5ibGVuZEVxICE9PSB0YXJnZXQwLmJsZW5kRXEpIHx8XHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0MENhY2hlLmJsZW5kQWxwaGFFcSAhPT0gdGFyZ2V0MC5ibGVuZEFscGhhRXEpKSB7XHJcbiAgICAgICAgICAgICAgICBnbC5ibGVuZEVxdWF0aW9uU2VwYXJhdGUoV2ViR0xCbGVuZE9wc1t0YXJnZXQwLmJsZW5kRXFdLCBXZWJHTEJsZW5kT3BzW3RhcmdldDAuYmxlbmRBbHBoYUVxXSk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmRFcSA9IHRhcmdldDAuYmxlbmRFcTtcclxuICAgICAgICAgICAgICAgIHRhcmdldDBDYWNoZS5ibGVuZEFscGhhRXEgPSB0YXJnZXQwLmJsZW5kQWxwaGFFcTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCh0YXJnZXQwQ2FjaGUuYmxlbmRTcmMgIT09IHRhcmdldDAuYmxlbmRTcmMpIHx8XHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0MENhY2hlLmJsZW5kRHN0ICE9PSB0YXJnZXQwLmJsZW5kRHN0KSB8fFxyXG4gICAgICAgICAgICAgICAgKHRhcmdldDBDYWNoZS5ibGVuZFNyY0FscGhhICE9PSB0YXJnZXQwLmJsZW5kU3JjQWxwaGEpIHx8XHJcbiAgICAgICAgICAgICAgICAodGFyZ2V0MENhY2hlLmJsZW5kRHN0QWxwaGEgIT09IHRhcmdldDAuYmxlbmREc3RBbHBoYSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBnbC5ibGVuZEZ1bmNTZXBhcmF0ZShcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTEJsZW5kRmFjdG9yc1t0YXJnZXQwLmJsZW5kU3JjXSxcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTEJsZW5kRmFjdG9yc1t0YXJnZXQwLmJsZW5kRHN0XSxcclxuICAgICAgICAgICAgICAgICAgICBXZWJHTEJsZW5kRmFjdG9yc1t0YXJnZXQwLmJsZW5kU3JjQWxwaGFdLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYkdMQmxlbmRGYWN0b3JzW3RhcmdldDAuYmxlbmREc3RBbHBoYV0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhcmdldDBDYWNoZS5ibGVuZFNyYyA9IHRhcmdldDAuYmxlbmRTcmM7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmREc3QgPSB0YXJnZXQwLmJsZW5kRHN0O1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0MENhY2hlLmJsZW5kU3JjQWxwaGEgPSB0YXJnZXQwLmJsZW5kU3JjQWxwaGE7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQwQ2FjaGUuYmxlbmREc3RBbHBoYSA9IHRhcmdldDAuYmxlbmREc3RBbHBoYTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldDBDYWNoZS5ibGVuZENvbG9yTWFzayAhPT0gdGFyZ2V0MC5ibGVuZENvbG9yTWFzaykge1xyXG5cclxuICAgICAgICAgICAgICAgIGdsLmNvbG9yTWFzayhcclxuICAgICAgICAgICAgICAgICAgICAodGFyZ2V0MC5ibGVuZENvbG9yTWFzayAmIEdGWENvbG9yTWFzay5SKSAhPT0gR0ZYQ29sb3JNYXNrLk5PTkUsXHJcbiAgICAgICAgICAgICAgICAgICAgKHRhcmdldDAuYmxlbmRDb2xvck1hc2sgJiBHRlhDb2xvck1hc2suRykgIT09IEdGWENvbG9yTWFzay5OT05FLFxyXG4gICAgICAgICAgICAgICAgICAgICh0YXJnZXQwLmJsZW5kQ29sb3JNYXNrICYgR0ZYQ29sb3JNYXNrLkIpICE9PSBHRlhDb2xvck1hc2suTk9ORSxcclxuICAgICAgICAgICAgICAgICAgICAodGFyZ2V0MC5ibGVuZENvbG9yTWFzayAmIEdGWENvbG9yTWFzay5BKSAhPT0gR0ZYQ29sb3JNYXNrLk5PTkUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhcmdldDBDYWNoZS5ibGVuZENvbG9yTWFzayA9IHRhcmdldDAuYmxlbmRDb2xvck1hc2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IC8vIGJsZW5kIHN0YXRlXHJcbiAgICB9IC8vIGJpbmQgcGlwZWxpbmVcclxuXHJcbiAgICAvLyBiaW5kIGRlc2NyaXB0b3Igc2V0c1xyXG4gICAgaWYgKGdwdVBpcGVsaW5lU3RhdGUgJiYgZ3B1UGlwZWxpbmVTdGF0ZS5ncHVQaXBlbGluZUxheW91dCAmJiBncHVTaGFkZXIpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYmxvY2tMZW4gPSBncHVTaGFkZXIuZ2xCbG9ja3MubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IGR5bmFtaWNPZmZzZXRJbmRpY2VzID0gZ3B1UGlwZWxpbmVTdGF0ZS5ncHVQaXBlbGluZUxheW91dC5keW5hbWljT2Zmc2V0SW5kaWNlcztcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBibG9ja0xlbjsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdsQmxvY2sgPSBncHVTaGFkZXIuZ2xCbG9ja3Nbal07XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3JTZXQgPSBncHVEZXNjcmlwdG9yU2V0c1tnbEJsb2NrLnNldF07XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3IgPSBncHVEZXNjcmlwdG9yU2V0ICYmIGdwdURlc2NyaXB0b3JTZXQuZ3B1RGVzY3JpcHRvcnNbZ2xCbG9jay5iaW5kaW5nXTtcclxuICAgICAgICAgICAgbGV0IHZmMzI6IEZsb2F0MzJBcnJheSB8IG51bGwgPSBudWxsOyBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChncHVEZXNjcmlwdG9yICYmIGdwdURlc2NyaXB0b3IuZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSBncHVEZXNjcmlwdG9yLmdwdUJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNPZmZzZXRJbmRleFNldCA9IGR5bmFtaWNPZmZzZXRJbmRpY2VzW2dsQmxvY2suc2V0XTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNPZmZzZXRJbmRleCA9IGR5bmFtaWNPZmZzZXRJbmRleFNldCAmJiBkeW5hbWljT2Zmc2V0SW5kZXhTZXRbZ2xCbG9jay5iaW5kaW5nXTtcclxuICAgICAgICAgICAgICAgIGlmIChkeW5hbWljT2Zmc2V0SW5kZXggPj0gMCkgb2Zmc2V0ID0gZHluYW1pY09mZnNldHNbZHluYW1pY09mZnNldEluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJ3ZmMzInIGluIGdwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZmMzIgPSBncHVCdWZmZXIudmYzMjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ICs9IGdwdUJ1ZmZlci5vZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmYzMiA9IGdwdUJ1ZmZlci5ncHVCdWZmZXIudmYzMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9mZnNldCA+Pj0gMjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF2ZjMyKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihgQnVmZmVyIGJpbmRpbmcgJyR7Z2xCbG9jay5uYW1lfScgYXQgc2V0ICR7Z2xCbG9jay5zZXR9IGJpbmRpbmcgJHtnbEJsb2NrLmJpbmRpbmd9IGlzIG5vdCBib3VuZGVkYCk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdW5pZm9ybUxlbiA9IGdsQmxvY2suZ2xBY3RpdmVVbmlmb3Jtcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGwgPSAwOyBsIDwgdW5pZm9ybUxlbjsgbCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBnbFVuaWZvcm0gPSBnbEJsb2NrLmdsQWN0aXZlVW5pZm9ybXNbbF07XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGdsVW5pZm9ybS5nbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGdsLkJPT0w6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5JTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xaXYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgSW50MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMyOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0yaXYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgSW50MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuQk9PTF9WRUMzOlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0zaXYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgSW50MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuQk9PTF9WRUM0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuSU5UX1ZFQzQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00aXYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgSW50MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuRkxPQVQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm0xZnYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgRmxvYXQzMkFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5GTE9BVF9WRUMyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHUgPSAwOyB1IDwgZ2xVbmlmb3JtLmFycmF5Lmxlbmd0aDsgKyt1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBnbFVuaWZvcm0uYmVnaW4gKyBvZmZzZXQgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZmMzJbaWR4XSAhPT0gZ2xVbmlmb3JtLmFycmF5W3VdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IHUsIG0gPSBpZHg7IG4gPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK24sICsrbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFVuaWZvcm0uYXJyYXlbbl0gPSB2ZjMyW21dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtMmZ2KGdsVW5pZm9ybS5nbExvYywgZ2xVbmlmb3JtLmFycmF5IGFzIEZsb2F0MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuRkxPQVRfVkVDMzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrdSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gZ2xVbmlmb3JtLmJlZ2luICsgb2Zmc2V0ICsgdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZjMyW2lkeF0gIT09IGdsVW5pZm9ybS5hcnJheVt1XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSB1LCBtID0gaWR4OyBuIDwgZ2xVbmlmb3JtLmFycmF5Lmxlbmd0aDsgKytuLCArK20pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xVbmlmb3JtLmFycmF5W25dID0gdmYzMlttXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybTNmdihnbFVuaWZvcm0uZ2xMb2MsIGdsVW5pZm9ybS5hcnJheSBhcyBGbG9hdDMyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGdsLkZMT0FUX1ZFQzQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm00ZnYoZ2xVbmlmb3JtLmdsTG9jLCBnbFVuaWZvcm0uYXJyYXkgYXMgRmxvYXQzMkFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBnbC5GTE9BVF9NQVQyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHUgPSAwOyB1IDwgZ2xVbmlmb3JtLmFycmF5Lmxlbmd0aDsgKyt1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZHggPSBnbFVuaWZvcm0uYmVnaW4gKyBvZmZzZXQgKyB1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZmMzJbaWR4XSAhPT0gZ2xVbmlmb3JtLmFycmF5W3VdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IHUsIG0gPSBpZHg7IG4gPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK24sICsrbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbFVuaWZvcm0uYXJyYXlbbl0gPSB2ZjMyW21dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4MmZ2KGdsVW5pZm9ybS5nbExvYywgZmFsc2UsIGdsVW5pZm9ybS5hcnJheSBhcyBGbG9hdDMyQXJyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIGdsLkZMT0FUX01BVDM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCBnbFVuaWZvcm0uYXJyYXkubGVuZ3RoOyArK3UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkeCA9IGdsVW5pZm9ybS5iZWdpbiArIG9mZnNldCArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmYzMltpZHhdICE9PSBnbFVuaWZvcm0uYXJyYXlbdV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gdSwgbSA9IGlkeDsgbiA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrbiwgKyttKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsVW5pZm9ybS5hcnJheVtuXSA9IHZmMzJbbV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYoZ2xVbmlmb3JtLmdsTG9jLCBmYWxzZSwgZ2xVbmlmb3JtLmFycmF5IGFzIEZsb2F0MzJBcnJheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgZ2wuRkxPQVRfTUFUNDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IGdsVW5pZm9ybS5hcnJheS5sZW5ndGg7ICsrdSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaWR4ID0gZ2xVbmlmb3JtLmJlZ2luICsgb2Zmc2V0ICsgdTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZjMyW2lkeF0gIT09IGdsVW5pZm9ybS5hcnJheVt1XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSB1LCBtID0gaWR4OyBuIDwgZ2xVbmlmb3JtLmFycmF5Lmxlbmd0aDsgKytuLCArK20pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xVbmlmb3JtLmFycmF5W25dID0gdmYzMlttXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDRmdihnbFVuaWZvcm0uZ2xMb2MsIGZhbHNlLCBnbFVuaWZvcm0uYXJyYXkgYXMgRmxvYXQzMkFycmF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNhbXBsZXJMZW4gPSBncHVTaGFkZXIuZ2xTYW1wbGVycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1wbGVyTGVuOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZ2xTYW1wbGVyID0gZ3B1U2hhZGVyLmdsU2FtcGxlcnNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGdwdURlc2NyaXB0b3JTZXQgPSBncHVEZXNjcmlwdG9yU2V0c1tnbFNhbXBsZXIuc2V0XTtcclxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3JJbmRleCA9IGdwdURlc2NyaXB0b3JTZXQgJiYgZ3B1RGVzY3JpcHRvclNldC5kZXNjcmlwdG9ySW5kaWNlc1tnbFNhbXBsZXIuYmluZGluZ107XHJcbiAgICAgICAgICAgIGxldCBncHVEZXNjcmlwdG9yID0gZ3B1RGVzY3JpcHRvclNldCAmJiBncHVEZXNjcmlwdG9yU2V0LmdwdURlc2NyaXB0b3JzW2Rlc2NyaXB0b3JJbmRleF07XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXhVbml0TGVuID0gZ2xTYW1wbGVyLnVuaXRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCB0ZXhVbml0TGVuOyBsKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRleFVuaXQgPSBnbFNhbXBsZXIudW5pdHNbbF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFncHVEZXNjcmlwdG9yIHx8ICFncHVEZXNjcmlwdG9yLmdwdVNhbXBsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcihgU2FtcGxlciBiaW5kaW5nICcke2dsU2FtcGxlci5uYW1lfScgYXQgc2V0ICR7Z2xTYW1wbGVyLnNldH0gYmluZGluZyAke2dsU2FtcGxlci5iaW5kaW5nfSBpbmRleCAke2x9IGlzIG5vdCBib3VuZGVkYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdwdURlc2NyaXB0b3IuZ3B1VGV4dHVyZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGdwdURlc2NyaXB0b3IuZ3B1VGV4dHVyZS5zaXplID4gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBncHVUZXh0dXJlID0gZ3B1RGVzY3JpcHRvci5ncHVUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdsVGV4VW5pdCA9IGNhY2hlLmdsVGV4VW5pdHNbdGV4VW5pdF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnbFRleFVuaXQuZ2xUZXh0dXJlICE9PSBncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUudGV4VW5pdCAhPT0gdGV4VW5pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRleFVuaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudGV4VW5pdCA9IHRleFVuaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xUZXh0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBkZXZpY2UubnVsbFRleDJEIS5ncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3B1U2FtcGxlciA9IGdwdURlc2NyaXB0b3IuZ3B1U2FtcGxlcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5pc1Bvd2VyT2YyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsV3JhcFMgPSBncHVTYW1wbGVyLmdsV3JhcFM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsV3JhcFQgPSBncHVTYW1wbGVyLmdsV3JhcFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xXcmFwUyA9IGdsLkNMQU1QX1RPX0VER0U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsV3JhcFQgPSBnbC5DTEFNUF9UT19FREdFO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuaXNQb3dlck9mMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5taXBMZXZlbCA8PSAxICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZ3B1U2FtcGxlci5nbE1pbkZpbHRlciA9PT0gZ2wuTElORUFSX01JUE1BUF9ORUFSRVNUIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVTYW1wbGVyLmdsTWluRmlsdGVyID09PSBnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsTWluRmlsdGVyID0gZ2wuTElORUFSO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xNaW5GaWx0ZXIgPSBncHVTYW1wbGVyLmdsTWluRmlsdGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVNhbXBsZXIuZ2xNaW5GaWx0ZXIgPT09IGdsLkxJTkVBUiB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1U2FtcGxlci5nbE1pbkZpbHRlciA9PT0gZ2wuTElORUFSX01JUE1BUF9ORUFSRVNUIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVTYW1wbGVyLmdsTWluRmlsdGVyID09PSBnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xNaW5GaWx0ZXIgPSBnbC5MSU5FQVI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbE1pbkZpbHRlciA9IGdsLk5FQVJFU1Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsV3JhcFMgIT09IGdsV3JhcFMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLnRleFVuaXQgIT09IHRleFVuaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyB0ZXhVbml0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnRleFVuaXQgPSB0ZXhVbml0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsV3JhcFMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsV3JhcFMgPSBnbFdyYXBTO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xXcmFwVCAhPT0gZ2xXcmFwVCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUudGV4VW5pdCAhPT0gdGV4VW5pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIHRleFVuaXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudGV4VW5pdCA9IHRleFVuaXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShncHVUZXh0dXJlLmdsVGFyZ2V0LCBnbC5URVhUVVJFX1dSQVBfVCwgZ2xXcmFwVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xXcmFwVCA9IGdsV3JhcFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5nbE1pbkZpbHRlciAhPT0gZ2xNaW5GaWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLnRleFVuaXQgIT09IHRleFVuaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmFjdGl2ZVRleHR1cmUoZ2wuVEVYVFVSRTAgKyB0ZXhVbml0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnRleFVuaXQgPSB0ZXhVbml0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ3B1VGV4dHVyZS5nbFRhcmdldCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbE1pbkZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xNaW5GaWx0ZXIgPSBnbE1pbkZpbHRlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVUZXh0dXJlLmdsTWFnRmlsdGVyICE9PSBncHVTYW1wbGVyLmdsTWFnRmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS50ZXhVbml0ICE9PSB0ZXhVbml0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgdGV4VW5pdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS50ZXhVbml0ID0gdGV4VW5pdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ3B1U2FtcGxlci5nbE1hZ0ZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xNYWdGaWx0ZXIgPSBncHVTYW1wbGVyLmdsTWFnRmlsdGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBncHVEZXNjcmlwdG9yID0gZ3B1RGVzY3JpcHRvclNldC5ncHVEZXNjcmlwdG9yc1srK2Rlc2NyaXB0b3JJbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IC8vIGJpbmQgZGVzY3JpcHRvciBzZXRzXHJcblxyXG4gICAgLy8gYmluZCB2ZXJ0ZXgvaW5kZXggYnVmZmVyXHJcbiAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIgJiYgZ3B1U2hhZGVyICYmXHJcbiAgICAgICAgKGlzU2hhZGVyQ2hhbmdlZCB8fCBnZnhTdGF0ZUNhY2hlLmdwdUlucHV0QXNzZW1ibGVyICE9PSBncHVJbnB1dEFzc2VtYmxlcikpIHtcclxuICAgICAgICBnZnhTdGF0ZUNhY2hlLmdwdUlucHV0QXNzZW1ibGVyID0gZ3B1SW5wdXRBc3NlbWJsZXI7XHJcbiAgICAgICAgY29uc3QgaWEgPSBkZXZpY2UuQU5HTEVfaW5zdGFuY2VkX2FycmF5cztcclxuXHJcbiAgICAgICAgaWYgKGRldmljZS51c2VWQU8pIHtcclxuICAgICAgICAgICAgY29uc3QgdmFvID0gZGV2aWNlLk9FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0ITtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIHZhb1xyXG4gICAgICAgICAgICBsZXQgZ2xWQU8gPSBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3MuZ2V0KGdwdVNoYWRlci5nbFByb2dyYW0hKTtcclxuICAgICAgICAgICAgaWYgKCFnbFZBTykge1xyXG4gICAgICAgICAgICAgICAgZ2xWQU8gPSB2YW8uY3JlYXRlVmVydGV4QXJyYXlPRVMoKSE7XHJcbiAgICAgICAgICAgICAgICBncHVJbnB1dEFzc2VtYmxlci5nbFZBT3Muc2V0KGdwdVNoYWRlci5nbFByb2dyYW0hLCBnbFZBTyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFvLmJpbmRWZXJ0ZXhBcnJheU9FUyhnbFZBTyk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsQXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBnbEF0dHJpYjogSVdlYkdMQXR0cmliIHwgbnVsbDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0TGVuID0gZ3B1U2hhZGVyLmdsSW5wdXRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaW5wdXRMZW47IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdsSW5wdXQgPSBncHVTaGFkZXIuZ2xJbnB1dHNbal07XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xBdHRyaWIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJMZW4gPSBncHVJbnB1dEFzc2VtYmxlci5nbEF0dHJpYnMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYXR0cmliTGVuOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmliID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ2xBdHRyaWJzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0cmliLm5hbWUgPT09IGdsSW5wdXQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xBdHRyaWIgPSBhdHRyaWI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdsQXR0cmliKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5nbEFycmF5QnVmZmVyICE9PSBnbEF0dHJpYi5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGdsQXR0cmliLmdsQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsQXJyYXlCdWZmZXIgPSBnbEF0dHJpYi5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBnbEF0dHJpYi5jb21wb25lbnRDb3VudDsgKytjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnbExvYyA9IGdsSW5wdXQuZ2xMb2MgKyBjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmliT2Zmc2V0ID0gZ2xBdHRyaWIub2Zmc2V0ICsgZ2xBdHRyaWIuc2l6ZSAqIGM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoZ2xMb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xDdXJyZW50QXR0cmliTG9jc1tnbExvY10gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2xMb2MsIGdsQXR0cmliLmNvdW50LCBnbEF0dHJpYi5nbFR5cGUsIGdsQXR0cmliLmlzTm9ybWFsaXplZCwgZ2xBdHRyaWIuc3RyaWRlLCBhdHRyaWJPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlhKSB7IGlhLnZlcnRleEF0dHJpYkRpdmlzb3JBTkdMRShnbExvYywgZ2xBdHRyaWIuaXNJbnN0YW5jZWQgPyAxIDogMCk7IH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBncHVCdWZmZXIgPSBncHVJbnB1dEFzc2VtYmxlci5ncHVJbmRleEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBncHVCdWZmZXIuZ2xCdWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhby5iaW5kVmVydGV4QXJyYXlPRVMobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsQXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgY2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY2FjaGUuZ2xWQU8gIT09IGdsVkFPKSB7XHJcbiAgICAgICAgICAgICAgICB2YW8uYmluZFZlcnRleEFycmF5T0VTKGdsVkFPKTtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsVkFPID0gZ2xWQU87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGRldmljZS5tYXhWZXJ0ZXhBdHRyaWJ1dGVzOyArK2EpIHtcclxuICAgICAgICAgICAgICAgIGNhY2hlLmdsQ3VycmVudEF0dHJpYkxvY3NbYV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgaW5wdXRMZW4gPSBncHVTaGFkZXIuZ2xJbnB1dHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlucHV0TGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdsSW5wdXQgPSBncHVTaGFkZXIuZ2xJbnB1dHNbal07XHJcbiAgICAgICAgICAgICAgICBsZXQgZ2xBdHRyaWI6IElXZWJHTEF0dHJpYiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJpYkxlbiA9IGdwdUlucHV0QXNzZW1ibGVyLmdsQXR0cmlicy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGF0dHJpYkxlbjsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXR0cmliID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ2xBdHRyaWJzW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWIubmFtZSA9PT0gZ2xJbnB1dC5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsQXR0cmliID0gYXR0cmliO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGdsQXR0cmliKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsQXJyYXlCdWZmZXIgIT09IGdsQXR0cmliLmdsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBnbEF0dHJpYi5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsQXJyYXlCdWZmZXIgPSBnbEF0dHJpYi5nbEJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgZ2xBdHRyaWIuY29tcG9uZW50Q291bnQ7ICsrYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnbExvYyA9IGdsSW5wdXQuZ2xMb2MgKyBjO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhdHRyaWJPZmZzZXQgPSBnbEF0dHJpYi5vZmZzZXQgKyBnbEF0dHJpYi5zaXplICogYztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY2FjaGUuZ2xFbmFibGVkQXR0cmliTG9jc1tnbExvY10gJiYgZ2xMb2MgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoZ2xMb2MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xFbmFibGVkQXR0cmliTG9jc1tnbExvY10gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmdsQ3VycmVudEF0dHJpYkxvY3NbZ2xMb2NdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoZ2xMb2MsIGdsQXR0cmliLmNvdW50LCBnbEF0dHJpYi5nbFR5cGUsIGdsQXR0cmliLmlzTm9ybWFsaXplZCwgZ2xBdHRyaWIuc3RyaWRlLCBhdHRyaWJPZmZzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWEpIHsgaWEudmVydGV4QXR0cmliRGl2aXNvckFOR0xFKGdsTG9jLCBnbEF0dHJpYi5pc0luc3RhbmNlZCA/IDEgOiAwKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSAvLyBmb3JcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdwdUJ1ZmZlciA9IGdwdUlucHV0QXNzZW1ibGVyLmdwdUluZGV4QnVmZmVyO1xyXG4gICAgICAgICAgICBpZiAoZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgIT09IGdwdUJ1ZmZlci5nbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGdwdUJ1ZmZlci5nbEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xFbGVtZW50QXJyYXlCdWZmZXIgPSBncHVCdWZmZXIuZ2xCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGEgPSAwOyBhIDwgZGV2aWNlLm1heFZlcnRleEF0dHJpYnV0ZXM7ICsrYSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlLmdsRW5hYmxlZEF0dHJpYkxvY3NbYV0gIT09IGNhY2hlLmdsQ3VycmVudEF0dHJpYkxvY3NbYV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC5kaXNhYmxlVmVydGV4QXR0cmliQXJyYXkoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGUuZ2xFbmFibGVkQXR0cmliTG9jc1thXSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSAvLyBiaW5kIHZlcnRleC9pbmRleCBidWZmZXJcclxuXHJcbiAgICAvLyB1cGRhdGUgZHluYW1pYyBzdGF0ZXNcclxuICAgIGlmIChncHVQaXBlbGluZVN0YXRlICYmIGdwdVBpcGVsaW5lU3RhdGUuZHluYW1pY1N0YXRlcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBkc0xlbiA9IGdwdVBpcGVsaW5lU3RhdGUuZHluYW1pY1N0YXRlcy5sZW5ndGg7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkc0xlbjsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGR5bmFtaWNTdGF0ZSA9IGdwdVBpcGVsaW5lU3RhdGUuZHluYW1pY1N0YXRlc1tqXTtcclxuICAgICAgICAgICAgc3dpdGNoIChkeW5hbWljU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdC5WSUVXUE9SVDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUudmlld3BvcnQubGVmdCAhPT0gdmlld3BvcnQubGVmdCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQudG9wICE9PSB2aWV3cG9ydC50b3AgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LndpZHRoICE9PSB2aWV3cG9ydC53aWR0aCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQuaGVpZ2h0ICE9PSB2aWV3cG9ydC5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC52aWV3cG9ydCh2aWV3cG9ydC5sZWZ0LCB2aWV3cG9ydC50b3AsIHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LmxlZnQgPSB2aWV3cG9ydC5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQudG9wID0gdmlld3BvcnQudG9wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUudmlld3BvcnQud2lkdGggPSB2aWV3cG9ydC53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnZpZXdwb3J0LmhlaWdodCA9IHZpZXdwb3J0LmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhc2UgR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdC5TQ0lTU09SOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjaXNzb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLnNjaXNzb3JSZWN0LnggIT09IHNjaXNzb3IueCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QueSAhPT0gc2Npc3Nvci55IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC53aWR0aCAhPT0gc2Npc3Nvci53aWR0aCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QuaGVpZ2h0ICE9PSBzY2lzc29yLmhlaWdodCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnNjaXNzb3Ioc2Npc3Nvci54LCBzY2lzc29yLnksIHNjaXNzb3Iud2lkdGgsIHNjaXNzb3IuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5zY2lzc29yUmVjdC54ID0gc2Npc3Nvci54O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuc2Npc3NvclJlY3QueSA9IHNjaXNzb3IueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LndpZHRoID0gc2Npc3Nvci53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLnNjaXNzb3JSZWN0LmhlaWdodCA9IHNjaXNzb3IuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhEeW5hbWljU3RhdGVGbGFnQml0LkxJTkVfV0lEVEg6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGluZVdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5ycy5saW5lV2lkdGggIT09IGxpbmVXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wubGluZVdpZHRoKGxpbmVXaWR0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5ycy5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuREVQVEhfQklBUzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aEJpYXMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoY2FjaGUucnMuZGVwdGhCaWFzICE9PSBkZXB0aEJpYXMuY29uc3RhbnRGYWN0b3IpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2FjaGUucnMuZGVwdGhCaWFzU2xvcCAhPT0gZGVwdGhCaWFzLnNsb3BlRmFjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wucG9seWdvbk9mZnNldChkZXB0aEJpYXMuY29uc3RhbnRGYWN0b3IsIGRlcHRoQmlhcy5zbG9wZUZhY3Rvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5ycy5kZXB0aEJpYXMgPSBkZXB0aEJpYXMuY29uc3RhbnRGYWN0b3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5ycy5kZXB0aEJpYXNTbG9wID0gZGVwdGhCaWFzLnNsb3BlRmFjdG9yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhEeW5hbWljU3RhdGVGbGFnQml0LkJMRU5EX0NPTlNUQU5UUzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoY2FjaGUuYnMuYmxlbmRDb2xvci54ICE9PSBibGVuZENvbnN0YW50c1swXSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGNhY2hlLmJzLmJsZW5kQ29sb3IueSAhPT0gYmxlbmRDb25zdGFudHNbMV0pIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYWNoZS5icy5ibGVuZENvbG9yLnogIT09IGJsZW5kQ29uc3RhbnRzWzJdKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2FjaGUuYnMuYmxlbmRDb2xvci53ICE9PSBibGVuZENvbnN0YW50c1szXSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJsZW5kQ29sb3IoYmxlbmRDb25zdGFudHNbMF0sIGJsZW5kQ29uc3RhbnRzWzFdLCBibGVuZENvbnN0YW50c1syXSwgYmxlbmRDb25zdGFudHNbM10pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci54ID0gYmxlbmRDb25zdGFudHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmJzLmJsZW5kQ29sb3IueSA9IGJsZW5kQ29uc3RhbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5icy5ibGVuZENvbG9yLnogPSBibGVuZENvbnN0YW50c1syXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuYnMuYmxlbmRDb2xvci53ID0gYmxlbmRDb25zdGFudHNbM107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBHRlhEeW5hbWljU3RhdGVGbGFnQml0LlNURU5DSUxfV1JJVEVfTUFTSzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGVuY2lsV3JpdGVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RlbmNpbFdyaXRlTWFzay5mYWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWFN0ZW5jaWxGYWNlLkZST05UOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlLmRzcy5zdGVuY2lsV3JpdGVNYXNrRnJvbnQgIT09IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuRlJPTlQsIHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYU3RlbmNpbEZhY2UuQkFDSzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgIT09IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrU2VwYXJhdGUoZ2wuQkFDSywgc3RlbmNpbFdyaXRlTWFzay53cml0ZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgPSBzdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEdGWFN0ZW5jaWxGYWNlLkFMTDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0Zyb250ICE9PSBzdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzayB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgIT09IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLnN0ZW5jaWxNYXNrKHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udCA9IHN0ZW5jaWxXcml0ZU1hc2sud3JpdGVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFdyaXRlTWFza0JhY2sgPSBzdGVuY2lsV3JpdGVNYXNrLndyaXRlTWFzaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQuU1RFTkNJTF9DT01QQVJFX01BU0s6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RlbmNpbENvbXBhcmVNYXNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3RlbmNpbENvbXBhcmVNYXNrLmZhY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYU3RlbmNpbEZhY2UuRlJPTlQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZHNzLnN0ZW5jaWxSZWZGcm9udCAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrRnJvbnQgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuRlJPTlQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBXZWJHTENtcEZ1bmNzW2NhY2hlLmRzcy5zdGVuY2lsRnVuY0Zyb250XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlZkZyb250ID0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0Zyb250ID0gc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR0ZYU3RlbmNpbEZhY2UuQkFDSzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZS5kc3Muc3RlbmNpbFJlZkJhY2sgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2UgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuQkFDSyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdlYkdMQ21wRnVuY3NbY2FjaGUuZHNzLnN0ZW5jaWxGdW5jQmFja10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWZCYWNrID0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgPSBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHRlhTdGVuY2lsRmFjZS5BTEw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGUuZHNzLnN0ZW5jaWxSZWZGcm9udCAhPT0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlYWRNYXNrRnJvbnQgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzayB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5kc3Muc3RlbmNpbFJlZkJhY2sgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2UgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgIT09IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5zdGVuY2lsRnVuYyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdlYkdMQ21wRnVuY3NbY2FjaGUuZHNzLnN0ZW5jaWxGdW5jQmFja10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsQ29tcGFyZU1hc2sucmVmZXJlbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbENvbXBhcmVNYXNrLmNvbXBhcmVNYXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWZGcm9udCA9IHN0ZW5jaWxDb21wYXJlTWFzay5yZWZlcmVuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhY2hlLmRzcy5zdGVuY2lsUmVhZE1hc2tGcm9udCA9IHN0ZW5jaWxDb21wYXJlTWFzay5jb21wYXJlTWFzaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWZCYWNrID0gc3RlbmNpbENvbXBhcmVNYXNrLnJlZmVyZW5jZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGUuZHNzLnN0ZW5jaWxSZWFkTWFza0JhY2sgPSBzdGVuY2lsQ29tcGFyZU1hc2suY29tcGFyZU1hc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IC8vIHN3aXRjaFxyXG4gICAgICAgIH0gLy8gZm9yXHJcbiAgICB9IC8vIHVwZGF0ZSBkeW5hbWljIHN0YXRlc1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jRHJhdyAoZGV2aWNlOiBXZWJHTERldmljZSwgZHJhd0luZm86IEdGWERyYXdJbmZvKSB7XHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGlhID0gZGV2aWNlLkFOR0xFX2luc3RhbmNlZF9hcnJheXM7XHJcbiAgICBjb25zdCB7IGdwdUlucHV0QXNzZW1ibGVyLCBnbFByaW1pdGl2ZSB9ID0gZ2Z4U3RhdGVDYWNoZTtcclxuXHJcbiAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIpIHtcclxuICAgICAgICBpZiAoZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kaXJlY3RCdWZmZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlMZW4gPSBncHVJbnB1dEFzc2VtYmxlci5ncHVJbmRpcmVjdEJ1ZmZlci5pbmRpcmVjdHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRpTGVuOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN1YkRyYXdJbmZvID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kaXJlY3RCdWZmZXIuaW5kaXJlY3RzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kZXhCdWZmZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3ViRHJhd0luZm8uaW5zdGFuY2VDb3VudCAmJiBpYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChncHVCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1YkRyYXdJbmZvLmluZGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBzdWJEcmF3SW5mby5maXJzdEluZGV4ICogZ3B1QnVmZmVyLnN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlhLmRyYXdFbGVtZW50c0luc3RhbmNlZEFOR0xFKGdsUHJpbWl0aXZlLCBzdWJEcmF3SW5mby5pbmRleENvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdUlucHV0QXNzZW1ibGVyLmdsSW5kZXhUeXBlLCBvZmZzZXQsIHN1YkRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdWJEcmF3SW5mby52ZXJ0ZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWEuZHJhd0FycmF5c0luc3RhbmNlZEFOR0xFKGdsUHJpbWl0aXZlLCBzdWJEcmF3SW5mby5maXJzdFZlcnRleCwgc3ViRHJhd0luZm8udmVydGV4Q291bnQsIHN1YkRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ViRHJhd0luZm8uaW5kZXhDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHN1YkRyYXdJbmZvLmZpcnN0SW5kZXggKiBncHVCdWZmZXIuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsUHJpbWl0aXZlLCBzdWJEcmF3SW5mby5pbmRleENvdW50LCBncHVJbnB1dEFzc2VtYmxlci5nbEluZGV4VHlwZSwgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3ViRHJhd0luZm8udmVydGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoZ2xQcmltaXRpdmUsIHN1YkRyYXdJbmZvLmZpcnN0VmVydGV4LCBzdWJEcmF3SW5mby52ZXJ0ZXhDb3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZ3B1QnVmZmVyID0gZ3B1SW5wdXRBc3NlbWJsZXIuZ3B1SW5kZXhCdWZmZXI7XHJcbiAgICAgICAgICAgIGlmIChkcmF3SW5mby5pbnN0YW5jZUNvdW50ICYmIGlhKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3B1QnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRyYXdJbmZvLmluZGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGRyYXdJbmZvLmZpcnN0SW5kZXggKiBncHVCdWZmZXIuc3RyaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpYS5kcmF3RWxlbWVudHNJbnN0YW5jZWRBTkdMRShnbFByaW1pdGl2ZSwgZHJhd0luZm8uaW5kZXhDb3VudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdUlucHV0QXNzZW1ibGVyLmdsSW5kZXhUeXBlLCBvZmZzZXQsIGRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZHJhd0luZm8udmVydGV4Q291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWEuZHJhd0FycmF5c0luc3RhbmNlZEFOR0xFKGdsUHJpbWl0aXZlLCBkcmF3SW5mby5maXJzdFZlcnRleCwgZHJhd0luZm8udmVydGV4Q291bnQsIGRyYXdJbmZvLmluc3RhbmNlQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdwdUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkcmF3SW5mby5pbmRleENvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBkcmF3SW5mby5maXJzdEluZGV4ICogZ3B1QnVmZmVyLnN0cmlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsUHJpbWl0aXZlLCBkcmF3SW5mby5pbmRleENvdW50LCBncHVJbnB1dEFzc2VtYmxlci5nbEluZGV4VHlwZSwgb2Zmc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRyYXdJbmZvLnZlcnRleENvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoZ2xQcmltaXRpdmUsIGRyYXdJbmZvLmZpcnN0VmVydGV4LCBkcmF3SW5mby52ZXJ0ZXhDb3VudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNtZElkcyA9IG5ldyBBcnJheTxudW1iZXI+KFdlYkdMQ21kLkNPVU5UKTtcclxuZXhwb3J0IGZ1bmN0aW9uIFdlYkdMQ21kRnVuY0V4ZWN1dGVDbWRzIChkZXZpY2U6IFdlYkdMRGV2aWNlLCBjbWRQYWNrYWdlOiBXZWJHTENtZFBhY2thZ2UpIHtcclxuICAgIGNtZElkcy5maWxsKDApO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY21kUGFja2FnZS5jbWRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgY29uc3QgY21kID0gY21kUGFja2FnZS5jbWRzLmFycmF5W2ldO1xyXG4gICAgICAgIGNvbnN0IGNtZElkID0gY21kSWRzW2NtZF0rKztcclxuXHJcbiAgICAgICAgc3dpdGNoIChjbWQpIHtcclxuICAgICAgICAgICAgY2FzZSBXZWJHTENtZC5CRUdJTl9SRU5ERVJfUEFTUzoge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY21kMCA9IGNtZFBhY2thZ2UuYmVnaW5SZW5kZXJQYXNzQ21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNCZWdpblJlbmRlclBhc3MoZGV2aWNlLCBjbWQwLmdwdVJlbmRlclBhc3MsIGNtZDAuZ3B1RnJhbWVidWZmZXIsIGNtZDAucmVuZGVyQXJlYSxcclxuICAgICAgICAgICAgICAgICAgICBjbWQwLmNsZWFyQ29sb3JzLCBjbWQwLmNsZWFyRGVwdGgsIGNtZDAuY2xlYXJTdGVuY2lsKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGNhc2UgV2ViR0xDbWQuRU5EX1JFTkRFUl9QQVNTOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBXZWJHTCAxLjAgZG9lc24ndCBzdXBwb3J0IHN0b3JlIG9wZXJhdGlvbiBvZiBhdHRhY2htZW50cy5cclxuICAgICAgICAgICAgICAgIC8vIEdGWFN0b3JlT3AuU3RvcmUgaXMgdGhlIGRlZmF1bHQgR0wgYmVoYXZpb3IuXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjYXNlIFdlYkdMQ21kLkJJTkRfU1RBVEVTOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQyID0gY21kUGFja2FnZS5iaW5kU3RhdGVzQ21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNCaW5kU3RhdGVzKGRldmljZSwgY21kMi5ncHVQaXBlbGluZVN0YXRlLCBjbWQyLmdwdUlucHV0QXNzZW1ibGVyLCBjbWQyLmdwdURlc2NyaXB0b3JTZXRzLCBjbWQyLmR5bmFtaWNPZmZzZXRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNtZDIudmlld3BvcnQsIGNtZDIuc2Npc3NvciwgY21kMi5saW5lV2lkdGgsIGNtZDIuZGVwdGhCaWFzLCBjbWQyLmJsZW5kQ29uc3RhbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgIGNtZDIuZGVwdGhCb3VuZHMsIGNtZDIuc3RlbmNpbFdyaXRlTWFzaywgY21kMi5zdGVuY2lsQ29tcGFyZU1hc2spO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBXZWJHTENtZC5EUkFXOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQzID0gY21kUGFja2FnZS5kcmF3Q21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNEcmF3KGRldmljZSwgY21kMy5kcmF3SW5mbyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIFdlYkdMQ21kLlVQREFURV9CVUZGRVI6IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNtZDQgPSBjbWRQYWNrYWdlLnVwZGF0ZUJ1ZmZlckNtZHMuYXJyYXlbY21kSWRdO1xyXG4gICAgICAgICAgICAgICAgV2ViR0xDbWRGdW5jVXBkYXRlQnVmZmVyKGRldmljZSwgY21kNC5ncHVCdWZmZXIgYXMgSVdlYkdMR1BVQnVmZmVyLCBjbWQ0LmJ1ZmZlciBhcyBHRlhCdWZmZXJTb3VyY2UsIGNtZDQub2Zmc2V0LCBjbWQ0LnNpemUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSBXZWJHTENtZC5DT1BZX0JVRkZFUl9UT19URVhUVVJFOiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjbWQ1ID0gY21kUGFja2FnZS5jb3B5QnVmZmVyVG9UZXh0dXJlQ21kcy5hcnJheVtjbWRJZF07XHJcbiAgICAgICAgICAgICAgICBXZWJHTENtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZShkZXZpY2UsIGNtZDUuYnVmZmVycywgY21kNS5ncHVUZXh0dXJlIGFzIElXZWJHTEdQVVRleHR1cmUsIGNtZDUucmVnaW9ucyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gLy8gc3dpdGNoXHJcbiAgICB9IC8vIGZvclxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gV2ViR0xDbWRGdW5jQ29weVRleEltYWdlc1RvVGV4dHVyZSAoXHJcbiAgICBkZXZpY2U6IFdlYkdMRGV2aWNlLFxyXG4gICAgdGV4SW1hZ2VzOiBUZXhJbWFnZVNvdXJjZVtdLFxyXG4gICAgZ3B1VGV4dHVyZTogSVdlYkdMR1BVVGV4dHVyZSxcclxuICAgIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuXHJcbiAgICBjb25zdCBnbCA9IGRldmljZS5nbDtcclxuICAgIGNvbnN0IGdsVGV4VW5pdCA9IGRldmljZS5zdGF0ZUNhY2hlLmdsVGV4VW5pdHNbZGV2aWNlLnN0YXRlQ2FjaGUudGV4VW5pdF07XHJcbiAgICBpZiAoZ2xUZXhVbml0LmdsVGV4dHVyZSAhPT0gZ3B1VGV4dHVyZS5nbFRleHR1cmUpIHtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShncHVUZXh0dXJlLmdsVGFyZ2V0LCBncHVUZXh0dXJlLmdsVGV4dHVyZSk7XHJcbiAgICAgICAgZ2xUZXhVbml0LmdsVGV4dHVyZSA9IGdwdVRleHR1cmUuZ2xUZXh0dXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuID0gMDtcclxuICAgIGxldCBmID0gMDtcclxuXHJcbiAgICBzd2l0Y2ggKGdwdVRleHR1cmUuZ2xUYXJnZXQpIHtcclxuICAgICAgICBjYXNlIGdsLlRFWFRVUkVfMkQ6IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSByZWdpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5kZWJ1ZygnQ29weWluZyBpbWFnZSB0byB0ZXh0dXJlIDJEOiAnICsgcmVnaW9uLnRleEV4dGVudC53aWR0aCArICcgeCAnICsgcmVnaW9uLnRleEV4dGVudC5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgZ2wudGV4U3ViSW1hZ2UyRChnbC5URVhUVVJFXzJELCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LFxyXG4gICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCB0ZXhJbWFnZXNbbisrXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgZ2wuVEVYVFVSRV9DVUJFX01BUDoge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHJlZ2lvbnNbaV07XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKCdDb3B5aW5nIGltYWdlIHRvIHRleHR1cmUgY3ViZTogJyArIHJlZ2lvbi50ZXhFeHRlbnQud2lkdGggKyAnIHggJyArIHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZjb3VudCA9IHJlZ2lvbi50ZXhTdWJyZXMuYmFzZUFycmF5TGF5ZXIgKyByZWdpb24udGV4U3VicmVzLmxheWVyQ291bnQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGYgPSByZWdpb24udGV4U3VicmVzLmJhc2VBcnJheUxheWVyOyBmIDwgZmNvdW50OyArK2YpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbC50ZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsRm9ybWF0LCBncHVUZXh0dXJlLmdsVHlwZSwgdGV4SW1hZ2VzW24rK10pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Vuc3VwcG9ydGVkIEdMIHRleHR1cmUgdHlwZSwgY29weSBidWZmZXIgdG8gdGV4dHVyZSBmYWlsZWQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgoZ3B1VGV4dHVyZS5mbGFncyAmIEdGWFRleHR1cmVGbGFnQml0LkdFTl9NSVBNQVApICYmXHJcbiAgICAgICAgZ3B1VGV4dHVyZS5pc1Bvd2VyT2YyKSB7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ3B1VGV4dHVyZS5nbFRhcmdldCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBXZWJHTENtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZSAoXHJcbiAgICBkZXZpY2U6IFdlYkdMRGV2aWNlLFxyXG4gICAgYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10sXHJcbiAgICBncHVUZXh0dXJlOiBJV2ViR0xHUFVUZXh0dXJlLFxyXG4gICAgcmVnaW9uczogR0ZYQnVmZmVyVGV4dHVyZUNvcHlbXSkge1xyXG5cclxuICAgIGNvbnN0IGdsID0gZGV2aWNlLmdsO1xyXG4gICAgY29uc3QgZ2xUZXhVbml0ID0gZGV2aWNlLnN0YXRlQ2FjaGUuZ2xUZXhVbml0c1tkZXZpY2Uuc3RhdGVDYWNoZS50ZXhVbml0XTtcclxuICAgIGlmIChnbFRleFVuaXQuZ2xUZXh0dXJlICE9PSBncHVUZXh0dXJlLmdsVGV4dHVyZSkge1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdwdVRleHR1cmUuZ2xUYXJnZXQsIGdwdVRleHR1cmUuZ2xUZXh0dXJlKTtcclxuICAgICAgICBnbFRleFVuaXQuZ2xUZXh0dXJlID0gZ3B1VGV4dHVyZS5nbFRleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG4gPSAwO1xyXG4gICAgbGV0IHcgPSAxO1xyXG4gICAgbGV0IGggPSAxO1xyXG4gICAgbGV0IGYgPSAwO1xyXG5cclxuICAgIGNvbnN0IGZtdEluZm86IEdGWEZvcm1hdEluZm8gPSBHRlhGb3JtYXRJbmZvc1tncHVUZXh0dXJlLmZvcm1hdF07XHJcbiAgICBjb25zdCBpc0NvbXByZXNzZWQgPSBmbXRJbmZvLmlzQ29tcHJlc3NlZDtcclxuICAgIHN3aXRjaCAoZ3B1VGV4dHVyZS5nbFRhcmdldCkge1xyXG4gICAgICAgIGNhc2UgZ2wuVEVYVFVSRV8yRDoge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2lvbiA9IHJlZ2lvbnNbaV07XHJcbiAgICAgICAgICAgICAgICB3ID0gcmVnaW9uLnRleEV4dGVudC53aWR0aDtcclxuICAgICAgICAgICAgICAgIGggPSByZWdpb24udGV4RXh0ZW50LmhlaWdodDtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ0NvcHlpbmcgYnVmZmVyIHRvIHRleHR1cmUgMkQ6ICcgKyB3ICsgJyB4ICcgKyBoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaXhlbHMgPSBidWZmZXJzW24rK107XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ29tcHJlc3NlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsLnRleFN1YkltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgcmVnaW9uLnRleFN1YnJlcy5taXBMZXZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uLnRleE9mZnNldC54LCByZWdpb24udGV4T2Zmc2V0LnksIHcsIGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIGdwdVRleHR1cmUuZ2xUeXBlLCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZ3B1VGV4dHVyZS5nbEludGVybmFsRm10ICE9PSBXZWJHTEVYVC5DT01QUkVTU0VEX1JHQl9FVEMxX1dFQkdMKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSwgdywgaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCA9PT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCB8fCBkZXZpY2Uubm9Db21wcmVzc2VkVGV4U3ViSW1hZ2UyRCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY29tcHJlc3NlZFRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgcmVnaW9uLnRleFN1YnJlcy5taXBMZXZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5jb21wcmVzc2VkVGV4U3ViSW1hZ2UyRChnbC5URVhUVVJFXzJELCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LCB3LCBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwdVRleHR1cmUuZ2xGb3JtYXQsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIGdsLlRFWFRVUkVfQ1VCRV9NQVA6IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWdpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdpb24gPSByZWdpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZmNvdW50ID0gcmVnaW9uLnRleFN1YnJlcy5iYXNlQXJyYXlMYXllciArIHJlZ2lvbi50ZXhTdWJyZXMubGF5ZXJDb3VudDtcclxuICAgICAgICAgICAgICAgIGZvciAoZiA9IHJlZ2lvbi50ZXhTdWJyZXMuYmFzZUFycmF5TGF5ZXI7IGYgPCBmY291bnQ7ICsrZikge1xyXG4gICAgICAgICAgICAgICAgICAgIHcgPSByZWdpb24udGV4RXh0ZW50LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIGggPSByZWdpb24udGV4RXh0ZW50LmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKCdDb3B5aW5nIGJ1ZmZlciB0byB0ZXh0dXJlIGN1YmU6ICcgKyB3ICsgJyB4ICcgKyBoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGl4ZWxzID0gYnVmZmVyc1tuKytdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNDb21wcmVzc2VkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFN1YkltYWdlMkQoZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgZiwgcmVnaW9uLnRleFN1YnJlcy5taXBMZXZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LCB3LCBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3B1VGV4dHVyZS5nbEZvcm1hdCwgZ3B1VGV4dHVyZS5nbFR5cGUsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wuY29tcHJlc3NlZFRleFN1YkltYWdlMkQoZ2wuVEVYVFVSRV9DVUJFX01BUF9QT1NJVElWRV9YICsgZiwgcmVnaW9uLnRleFN1YnJlcy5taXBMZXZlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSwgdywgaCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsRm9ybWF0LCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdwdVRleHR1cmUuZ2xJbnRlcm5hbEZtdCAhPT0gV2ViR0xFWFQuQ09NUFJFU1NFRF9SR0JfRVRDMV9XRUJHTCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsLmNvbXByZXNzZWRUZXhTdWJJbWFnZTJEKGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGYsIHJlZ2lvbi50ZXhTdWJyZXMubWlwTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbi50ZXhPZmZzZXQueCwgcmVnaW9uLnRleE9mZnNldC55LCB3LCBoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsRm9ybWF0LCBwaXhlbHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbC5jb21wcmVzc2VkVGV4SW1hZ2UyRChnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBmLCByZWdpb24udGV4U3VicmVzLm1pcExldmVsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncHVUZXh0dXJlLmdsSW50ZXJuYWxGbXQsIHcsIGgsIDAsIHBpeGVscyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignVW5zdXBwb3J0ZWQgR0wgdGV4dHVyZSB0eXBlLCBjb3B5IGJ1ZmZlciB0byB0ZXh0dXJlIGZhaWxlZC4nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGdwdVRleHR1cmUuZmxhZ3MgJiBHRlhUZXh0dXJlRmxhZ0JpdC5HRU5fTUlQTUFQKSB7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ3B1VGV4dHVyZS5nbFRhcmdldCk7XHJcbiAgICB9XHJcbn1cclxuIl19