(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.define = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GFXFormatSize = GFXFormatSize;
  _exports.GFXFormatSurfaceSize = GFXFormatSurfaceSize;
  _exports.GFXGetTypeSize = GFXGetTypeSize;
  _exports.getTypedArrayConstructor = getTypedArrayConstructor;
  _exports.GFXFormatInfos = _exports.GFXMemoryStatus = _exports.GFXFormatInfo = _exports.GFXFormatType = _exports.GFXBufferTextureCopy = _exports.GFXTextureCopy = _exports.GFXTextureSubres = _exports.GFXExtent = _exports.GFXOffset = _exports.GFXClearFlag = _exports.GFXColor = _exports.GFXViewport = _exports.GFXRect = _exports.GFXQueueType = _exports.GFXStencilFace = _exports.GFXDynamicStateFlagBit = _exports.GFXPipelineBindPoint = _exports.GFXTextureLayout = _exports.GFXStoreOp = _exports.GFXLoadOp = _exports.GFXCommandBufferType = _exports.GFXDescriptorType = _exports.GFXShaderStageFlagBit = _exports.GFXTextureFlagBit = _exports.GFXSampleCount = _exports.GFXTextureUsageBit = _exports.GFXTextureType = _exports.GFXAddress = _exports.GFXFilter = _exports.GFXColorMask = _exports.GFXBlendFactor = _exports.GFXBlendOp = _exports.GFXStencilOp = _exports.GFXComparisonFunc = _exports.GFXCullMode = _exports.GFXShadeModel = _exports.GFXPolygonMode = _exports.GFXPrimitiveMode = _exports.GFXBufferAccessBit = _exports.GFXBufferFlagBit = _exports.GFXMemoryUsageBit = _exports.GFXBufferUsageBit = _exports.GFXFormat = _exports.GFXType = _exports.GFXAttributeName = _exports.GFXObject = _exports.GFXObjectType = _exports.GFX_MAX_ATTACHMENTS = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @category gfx
   */
  var GFX_MAX_ATTACHMENTS = 4;
  _exports.GFX_MAX_ATTACHMENTS = GFX_MAX_ATTACHMENTS;
  var GFXObjectType;
  /**
   * @en GFX base object.
   * @zh GFX 基类对象。
   */

  _exports.GFXObjectType = GFXObjectType;

  (function (GFXObjectType) {
    GFXObjectType[GFXObjectType["UNKNOWN"] = 0] = "UNKNOWN";
    GFXObjectType[GFXObjectType["BUFFER"] = 1] = "BUFFER";
    GFXObjectType[GFXObjectType["TEXTURE"] = 2] = "TEXTURE";
    GFXObjectType[GFXObjectType["RENDER_PASS"] = 3] = "RENDER_PASS";
    GFXObjectType[GFXObjectType["FRAMEBUFFER"] = 4] = "FRAMEBUFFER";
    GFXObjectType[GFXObjectType["SAMPLER"] = 5] = "SAMPLER";
    GFXObjectType[GFXObjectType["SHADER"] = 6] = "SHADER";
    GFXObjectType[GFXObjectType["DESCRIPTOR_SET_LAYOUT"] = 7] = "DESCRIPTOR_SET_LAYOUT";
    GFXObjectType[GFXObjectType["PIPELINE_LAYOUT"] = 8] = "PIPELINE_LAYOUT";
    GFXObjectType[GFXObjectType["PIPELINE_STATE"] = 9] = "PIPELINE_STATE";
    GFXObjectType[GFXObjectType["DESCRIPTOR_SET"] = 10] = "DESCRIPTOR_SET";
    GFXObjectType[GFXObjectType["INPUT_ASSEMBLER"] = 11] = "INPUT_ASSEMBLER";
    GFXObjectType[GFXObjectType["COMMAND_BUFFER"] = 12] = "COMMAND_BUFFER";
    GFXObjectType[GFXObjectType["FENCE"] = 13] = "FENCE";
    GFXObjectType[GFXObjectType["QUEUE"] = 14] = "QUEUE";
    GFXObjectType[GFXObjectType["WINDOW"] = 15] = "WINDOW";
  })(GFXObjectType || (_exports.GFXObjectType = GFXObjectType = {}));

  var GFXObject = /*#__PURE__*/function () {
    _createClass(GFXObject, [{
      key: "gfxType",
      get: function get() {
        return this._gfxType;
      }
    }]);

    function GFXObject(gfxType) {
      _classCallCheck(this, GFXObject);

      this._gfxType = GFXObjectType.UNKNOWN;
      this._gfxType = gfxType;
    }

    return GFXObject;
  }();

  _exports.GFXObject = GFXObject;
  var GFXAttributeName;
  _exports.GFXAttributeName = GFXAttributeName;

  (function (GFXAttributeName) {
    GFXAttributeName["ATTR_POSITION"] = "a_position";
    GFXAttributeName["ATTR_NORMAL"] = "a_normal";
    GFXAttributeName["ATTR_TANGENT"] = "a_tangent";
    GFXAttributeName["ATTR_BITANGENT"] = "a_bitangent";
    GFXAttributeName["ATTR_WEIGHTS"] = "a_weights";
    GFXAttributeName["ATTR_JOINTS"] = "a_joints";
    GFXAttributeName["ATTR_COLOR"] = "a_color";
    GFXAttributeName["ATTR_COLOR1"] = "a_color1";
    GFXAttributeName["ATTR_COLOR2"] = "a_color2";
    GFXAttributeName["ATTR_TEX_COORD"] = "a_texCoord";
    GFXAttributeName["ATTR_TEX_COORD1"] = "a_texCoord1";
    GFXAttributeName["ATTR_TEX_COORD2"] = "a_texCoord2";
    GFXAttributeName["ATTR_TEX_COORD3"] = "a_texCoord3";
    GFXAttributeName["ATTR_TEX_COORD4"] = "a_texCoord4";
    GFXAttributeName["ATTR_TEX_COORD5"] = "a_texCoord5";
    GFXAttributeName["ATTR_TEX_COORD6"] = "a_texCoord6";
    GFXAttributeName["ATTR_TEX_COORD7"] = "a_texCoord7";
    GFXAttributeName["ATTR_TEX_COORD8"] = "a_texCoord8";
    GFXAttributeName["ATTR_BATCH_ID"] = "a_batch_id";
    GFXAttributeName["ATTR_BATCH_UV"] = "a_batch_uv";
  })(GFXAttributeName || (_exports.GFXAttributeName = GFXAttributeName = {}));

  var GFXType;
  _exports.GFXType = GFXType;

  (function (GFXType) {
    GFXType[GFXType["UNKNOWN"] = 0] = "UNKNOWN";
    GFXType[GFXType["BOOL"] = 1] = "BOOL";
    GFXType[GFXType["BOOL2"] = 2] = "BOOL2";
    GFXType[GFXType["BOOL3"] = 3] = "BOOL3";
    GFXType[GFXType["BOOL4"] = 4] = "BOOL4";
    GFXType[GFXType["INT"] = 5] = "INT";
    GFXType[GFXType["INT2"] = 6] = "INT2";
    GFXType[GFXType["INT3"] = 7] = "INT3";
    GFXType[GFXType["INT4"] = 8] = "INT4";
    GFXType[GFXType["UINT"] = 9] = "UINT";
    GFXType[GFXType["UINT2"] = 10] = "UINT2";
    GFXType[GFXType["UINT3"] = 11] = "UINT3";
    GFXType[GFXType["UINT4"] = 12] = "UINT4";
    GFXType[GFXType["FLOAT"] = 13] = "FLOAT";
    GFXType[GFXType["FLOAT2"] = 14] = "FLOAT2";
    GFXType[GFXType["FLOAT3"] = 15] = "FLOAT3";
    GFXType[GFXType["FLOAT4"] = 16] = "FLOAT4";
    GFXType[GFXType["MAT2"] = 17] = "MAT2";
    GFXType[GFXType["MAT2X3"] = 18] = "MAT2X3";
    GFXType[GFXType["MAT2X4"] = 19] = "MAT2X4";
    GFXType[GFXType["MAT3X2"] = 20] = "MAT3X2";
    GFXType[GFXType["MAT3"] = 21] = "MAT3";
    GFXType[GFXType["MAT3X4"] = 22] = "MAT3X4";
    GFXType[GFXType["MAT4X2"] = 23] = "MAT4X2";
    GFXType[GFXType["MAT4X3"] = 24] = "MAT4X3";
    GFXType[GFXType["MAT4"] = 25] = "MAT4";
    GFXType[GFXType["SAMPLER1D"] = 26] = "SAMPLER1D";
    GFXType[GFXType["SAMPLER1D_ARRAY"] = 27] = "SAMPLER1D_ARRAY";
    GFXType[GFXType["SAMPLER2D"] = 28] = "SAMPLER2D";
    GFXType[GFXType["SAMPLER2D_ARRAY"] = 29] = "SAMPLER2D_ARRAY";
    GFXType[GFXType["SAMPLER3D"] = 30] = "SAMPLER3D";
    GFXType[GFXType["SAMPLER_CUBE"] = 31] = "SAMPLER_CUBE";
    GFXType[GFXType["COUNT"] = 32] = "COUNT";
  })(GFXType || (_exports.GFXType = GFXType = {}));

  var GFXFormat;
  _exports.GFXFormat = GFXFormat;

  (function (GFXFormat) {
    GFXFormat[GFXFormat["UNKNOWN"] = 0] = "UNKNOWN";
    GFXFormat[GFXFormat["A8"] = 1] = "A8";
    GFXFormat[GFXFormat["L8"] = 2] = "L8";
    GFXFormat[GFXFormat["LA8"] = 3] = "LA8";
    GFXFormat[GFXFormat["R8"] = 4] = "R8";
    GFXFormat[GFXFormat["R8SN"] = 5] = "R8SN";
    GFXFormat[GFXFormat["R8UI"] = 6] = "R8UI";
    GFXFormat[GFXFormat["R8I"] = 7] = "R8I";
    GFXFormat[GFXFormat["R16F"] = 8] = "R16F";
    GFXFormat[GFXFormat["R16UI"] = 9] = "R16UI";
    GFXFormat[GFXFormat["R16I"] = 10] = "R16I";
    GFXFormat[GFXFormat["R32F"] = 11] = "R32F";
    GFXFormat[GFXFormat["R32UI"] = 12] = "R32UI";
    GFXFormat[GFXFormat["R32I"] = 13] = "R32I";
    GFXFormat[GFXFormat["RG8"] = 14] = "RG8";
    GFXFormat[GFXFormat["RG8SN"] = 15] = "RG8SN";
    GFXFormat[GFXFormat["RG8UI"] = 16] = "RG8UI";
    GFXFormat[GFXFormat["RG8I"] = 17] = "RG8I";
    GFXFormat[GFXFormat["RG16F"] = 18] = "RG16F";
    GFXFormat[GFXFormat["RG16UI"] = 19] = "RG16UI";
    GFXFormat[GFXFormat["RG16I"] = 20] = "RG16I";
    GFXFormat[GFXFormat["RG32F"] = 21] = "RG32F";
    GFXFormat[GFXFormat["RG32UI"] = 22] = "RG32UI";
    GFXFormat[GFXFormat["RG32I"] = 23] = "RG32I";
    GFXFormat[GFXFormat["RGB8"] = 24] = "RGB8";
    GFXFormat[GFXFormat["SRGB8"] = 25] = "SRGB8";
    GFXFormat[GFXFormat["RGB8SN"] = 26] = "RGB8SN";
    GFXFormat[GFXFormat["RGB8UI"] = 27] = "RGB8UI";
    GFXFormat[GFXFormat["RGB8I"] = 28] = "RGB8I";
    GFXFormat[GFXFormat["RGB16F"] = 29] = "RGB16F";
    GFXFormat[GFXFormat["RGB16UI"] = 30] = "RGB16UI";
    GFXFormat[GFXFormat["RGB16I"] = 31] = "RGB16I";
    GFXFormat[GFXFormat["RGB32F"] = 32] = "RGB32F";
    GFXFormat[GFXFormat["RGB32UI"] = 33] = "RGB32UI";
    GFXFormat[GFXFormat["RGB32I"] = 34] = "RGB32I";
    GFXFormat[GFXFormat["RGBA8"] = 35] = "RGBA8";
    GFXFormat[GFXFormat["BGRA8"] = 36] = "BGRA8";
    GFXFormat[GFXFormat["SRGB8_A8"] = 37] = "SRGB8_A8";
    GFXFormat[GFXFormat["RGBA8SN"] = 38] = "RGBA8SN";
    GFXFormat[GFXFormat["RGBA8UI"] = 39] = "RGBA8UI";
    GFXFormat[GFXFormat["RGBA8I"] = 40] = "RGBA8I";
    GFXFormat[GFXFormat["RGBA16F"] = 41] = "RGBA16F";
    GFXFormat[GFXFormat["RGBA16UI"] = 42] = "RGBA16UI";
    GFXFormat[GFXFormat["RGBA16I"] = 43] = "RGBA16I";
    GFXFormat[GFXFormat["RGBA32F"] = 44] = "RGBA32F";
    GFXFormat[GFXFormat["RGBA32UI"] = 45] = "RGBA32UI";
    GFXFormat[GFXFormat["RGBA32I"] = 46] = "RGBA32I";
    GFXFormat[GFXFormat["R5G6B5"] = 47] = "R5G6B5";
    GFXFormat[GFXFormat["R11G11B10F"] = 48] = "R11G11B10F";
    GFXFormat[GFXFormat["RGB5A1"] = 49] = "RGB5A1";
    GFXFormat[GFXFormat["RGBA4"] = 50] = "RGBA4";
    GFXFormat[GFXFormat["RGB10A2"] = 51] = "RGB10A2";
    GFXFormat[GFXFormat["RGB10A2UI"] = 52] = "RGB10A2UI";
    GFXFormat[GFXFormat["RGB9E5"] = 53] = "RGB9E5";
    GFXFormat[GFXFormat["D16"] = 54] = "D16";
    GFXFormat[GFXFormat["D16S8"] = 55] = "D16S8";
    GFXFormat[GFXFormat["D24"] = 56] = "D24";
    GFXFormat[GFXFormat["D24S8"] = 57] = "D24S8";
    GFXFormat[GFXFormat["D32F"] = 58] = "D32F";
    GFXFormat[GFXFormat["D32F_S8"] = 59] = "D32F_S8";
    GFXFormat[GFXFormat["BC1"] = 60] = "BC1";
    GFXFormat[GFXFormat["BC1_ALPHA"] = 61] = "BC1_ALPHA";
    GFXFormat[GFXFormat["BC1_SRGB"] = 62] = "BC1_SRGB";
    GFXFormat[GFXFormat["BC1_SRGB_ALPHA"] = 63] = "BC1_SRGB_ALPHA";
    GFXFormat[GFXFormat["BC2"] = 64] = "BC2";
    GFXFormat[GFXFormat["BC2_SRGB"] = 65] = "BC2_SRGB";
    GFXFormat[GFXFormat["BC3"] = 66] = "BC3";
    GFXFormat[GFXFormat["BC3_SRGB"] = 67] = "BC3_SRGB";
    GFXFormat[GFXFormat["BC4"] = 68] = "BC4";
    GFXFormat[GFXFormat["BC4_SNORM"] = 69] = "BC4_SNORM";
    GFXFormat[GFXFormat["BC5"] = 70] = "BC5";
    GFXFormat[GFXFormat["BC5_SNORM"] = 71] = "BC5_SNORM";
    GFXFormat[GFXFormat["BC6H_UF16"] = 72] = "BC6H_UF16";
    GFXFormat[GFXFormat["BC6H_SF16"] = 73] = "BC6H_SF16";
    GFXFormat[GFXFormat["BC7"] = 74] = "BC7";
    GFXFormat[GFXFormat["BC7_SRGB"] = 75] = "BC7_SRGB";
    GFXFormat[GFXFormat["ETC_RGB8"] = 76] = "ETC_RGB8";
    GFXFormat[GFXFormat["ETC2_RGB8"] = 77] = "ETC2_RGB8";
    GFXFormat[GFXFormat["ETC2_SRGB8"] = 78] = "ETC2_SRGB8";
    GFXFormat[GFXFormat["ETC2_RGB8_A1"] = 79] = "ETC2_RGB8_A1";
    GFXFormat[GFXFormat["ETC2_SRGB8_A1"] = 80] = "ETC2_SRGB8_A1";
    GFXFormat[GFXFormat["ETC2_RGBA8"] = 81] = "ETC2_RGBA8";
    GFXFormat[GFXFormat["ETC2_SRGB8_A8"] = 82] = "ETC2_SRGB8_A8";
    GFXFormat[GFXFormat["EAC_R11"] = 83] = "EAC_R11";
    GFXFormat[GFXFormat["EAC_R11SN"] = 84] = "EAC_R11SN";
    GFXFormat[GFXFormat["EAC_RG11"] = 85] = "EAC_RG11";
    GFXFormat[GFXFormat["EAC_RG11SN"] = 86] = "EAC_RG11SN";
    GFXFormat[GFXFormat["PVRTC_RGB2"] = 87] = "PVRTC_RGB2";
    GFXFormat[GFXFormat["PVRTC_RGBA2"] = 88] = "PVRTC_RGBA2";
    GFXFormat[GFXFormat["PVRTC_RGB4"] = 89] = "PVRTC_RGB4";
    GFXFormat[GFXFormat["PVRTC_RGBA4"] = 90] = "PVRTC_RGBA4";
    GFXFormat[GFXFormat["PVRTC2_2BPP"] = 91] = "PVRTC2_2BPP";
    GFXFormat[GFXFormat["PVRTC2_4BPP"] = 92] = "PVRTC2_4BPP";
    GFXFormat[GFXFormat["ASTC_RGBA_4x4"] = 93] = "ASTC_RGBA_4x4";
    GFXFormat[GFXFormat["ASTC_RGBA_5x4"] = 94] = "ASTC_RGBA_5x4";
    GFXFormat[GFXFormat["ASTC_RGBA_5x5"] = 95] = "ASTC_RGBA_5x5";
    GFXFormat[GFXFormat["ASTC_RGBA_6x5"] = 96] = "ASTC_RGBA_6x5";
    GFXFormat[GFXFormat["ASTC_RGBA_6x6"] = 97] = "ASTC_RGBA_6x6";
    GFXFormat[GFXFormat["ASTC_RGBA_8x5"] = 98] = "ASTC_RGBA_8x5";
    GFXFormat[GFXFormat["ASTC_RGBA_8x6"] = 99] = "ASTC_RGBA_8x6";
    GFXFormat[GFXFormat["ASTC_RGBA_8x8"] = 100] = "ASTC_RGBA_8x8";
    GFXFormat[GFXFormat["ASTC_RGBA_10x5"] = 101] = "ASTC_RGBA_10x5";
    GFXFormat[GFXFormat["ASTC_RGBA_10x6"] = 102] = "ASTC_RGBA_10x6";
    GFXFormat[GFXFormat["ASTC_RGBA_10x8"] = 103] = "ASTC_RGBA_10x8";
    GFXFormat[GFXFormat["ASTC_RGBA_10x10"] = 104] = "ASTC_RGBA_10x10";
    GFXFormat[GFXFormat["ASTC_RGBA_12x10"] = 105] = "ASTC_RGBA_12x10";
    GFXFormat[GFXFormat["ASTC_RGBA_12x12"] = 106] = "ASTC_RGBA_12x12";
    GFXFormat[GFXFormat["ASTC_SRGBA_4x4"] = 107] = "ASTC_SRGBA_4x4";
    GFXFormat[GFXFormat["ASTC_SRGBA_5x4"] = 108] = "ASTC_SRGBA_5x4";
    GFXFormat[GFXFormat["ASTC_SRGBA_5x5"] = 109] = "ASTC_SRGBA_5x5";
    GFXFormat[GFXFormat["ASTC_SRGBA_6x5"] = 110] = "ASTC_SRGBA_6x5";
    GFXFormat[GFXFormat["ASTC_SRGBA_6x6"] = 111] = "ASTC_SRGBA_6x6";
    GFXFormat[GFXFormat["ASTC_SRGBA_8x5"] = 112] = "ASTC_SRGBA_8x5";
    GFXFormat[GFXFormat["ASTC_SRGBA_8x6"] = 113] = "ASTC_SRGBA_8x6";
    GFXFormat[GFXFormat["ASTC_SRGBA_8x8"] = 114] = "ASTC_SRGBA_8x8";
    GFXFormat[GFXFormat["ASTC_SRGBA_10x5"] = 115] = "ASTC_SRGBA_10x5";
    GFXFormat[GFXFormat["ASTC_SRGBA_10x6"] = 116] = "ASTC_SRGBA_10x6";
    GFXFormat[GFXFormat["ASTC_SRGBA_10x8"] = 117] = "ASTC_SRGBA_10x8";
    GFXFormat[GFXFormat["ASTC_SRGBA_10x10"] = 118] = "ASTC_SRGBA_10x10";
    GFXFormat[GFXFormat["ASTC_SRGBA_12x10"] = 119] = "ASTC_SRGBA_12x10";
    GFXFormat[GFXFormat["ASTC_SRGBA_12x12"] = 120] = "ASTC_SRGBA_12x12";
  })(GFXFormat || (_exports.GFXFormat = GFXFormat = {}));

  var GFXBufferUsageBit;
  _exports.GFXBufferUsageBit = GFXBufferUsageBit;

  (function (GFXBufferUsageBit) {
    GFXBufferUsageBit[GFXBufferUsageBit["NONE"] = 0] = "NONE";
    GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_SRC"] = 1] = "TRANSFER_SRC";
    GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_DST"] = 2] = "TRANSFER_DST";
    GFXBufferUsageBit[GFXBufferUsageBit["INDEX"] = 4] = "INDEX";
    GFXBufferUsageBit[GFXBufferUsageBit["VERTEX"] = 8] = "VERTEX";
    GFXBufferUsageBit[GFXBufferUsageBit["UNIFORM"] = 16] = "UNIFORM";
    GFXBufferUsageBit[GFXBufferUsageBit["STORAGE"] = 32] = "STORAGE";
    GFXBufferUsageBit[GFXBufferUsageBit["INDIRECT"] = 64] = "INDIRECT";
  })(GFXBufferUsageBit || (_exports.GFXBufferUsageBit = GFXBufferUsageBit = {}));

  var GFXMemoryUsageBit;
  _exports.GFXMemoryUsageBit = GFXMemoryUsageBit;

  (function (GFXMemoryUsageBit) {
    GFXMemoryUsageBit[GFXMemoryUsageBit["NONE"] = 0] = "NONE";
    GFXMemoryUsageBit[GFXMemoryUsageBit["DEVICE"] = 1] = "DEVICE";
    GFXMemoryUsageBit[GFXMemoryUsageBit["HOST"] = 2] = "HOST";
  })(GFXMemoryUsageBit || (_exports.GFXMemoryUsageBit = GFXMemoryUsageBit = {}));

  var GFXBufferFlagBit;
  _exports.GFXBufferFlagBit = GFXBufferFlagBit;

  (function (GFXBufferFlagBit) {
    GFXBufferFlagBit[GFXBufferFlagBit["NONE"] = 0] = "NONE";
    GFXBufferFlagBit[GFXBufferFlagBit["BAKUP_BUFFER"] = 4] = "BAKUP_BUFFER";
  })(GFXBufferFlagBit || (_exports.GFXBufferFlagBit = GFXBufferFlagBit = {}));

  var GFXBufferAccessBit;
  _exports.GFXBufferAccessBit = GFXBufferAccessBit;

  (function (GFXBufferAccessBit) {
    GFXBufferAccessBit[GFXBufferAccessBit["NONE"] = 0] = "NONE";
    GFXBufferAccessBit[GFXBufferAccessBit["READ"] = 1] = "READ";
    GFXBufferAccessBit[GFXBufferAccessBit["WRITE"] = 2] = "WRITE";
  })(GFXBufferAccessBit || (_exports.GFXBufferAccessBit = GFXBufferAccessBit = {}));

  var GFXPrimitiveMode;
  _exports.GFXPrimitiveMode = GFXPrimitiveMode;

  (function (GFXPrimitiveMode) {
    GFXPrimitiveMode[GFXPrimitiveMode["POINT_LIST"] = 0] = "POINT_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST"] = 1] = "LINE_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP"] = 2] = "LINE_STRIP";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LOOP"] = 3] = "LINE_LOOP";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST_ADJACENCY"] = 4] = "LINE_LIST_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP_ADJACENCY"] = 5] = "LINE_STRIP_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["ISO_LINE_LIST"] = 6] = "ISO_LINE_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST"] = 7] = "TRIANGLE_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP"] = 8] = "TRIANGLE_STRIP";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_FAN"] = 9] = "TRIANGLE_FAN";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST_ADJACENCY"] = 10] = "TRIANGLE_LIST_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP_ADJACENCY"] = 11] = "TRIANGLE_STRIP_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_PATCH_ADJACENCY"] = 12] = "TRIANGLE_PATCH_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["QUAD_PATCH_LIST"] = 13] = "QUAD_PATCH_LIST";
  })(GFXPrimitiveMode || (_exports.GFXPrimitiveMode = GFXPrimitiveMode = {}));

  var GFXPolygonMode;
  _exports.GFXPolygonMode = GFXPolygonMode;

  (function (GFXPolygonMode) {
    GFXPolygonMode[GFXPolygonMode["FILL"] = 0] = "FILL";
    GFXPolygonMode[GFXPolygonMode["POINT"] = 1] = "POINT";
    GFXPolygonMode[GFXPolygonMode["LINE"] = 2] = "LINE";
  })(GFXPolygonMode || (_exports.GFXPolygonMode = GFXPolygonMode = {}));

  var GFXShadeModel;
  _exports.GFXShadeModel = GFXShadeModel;

  (function (GFXShadeModel) {
    GFXShadeModel[GFXShadeModel["GOURAND"] = 0] = "GOURAND";
    GFXShadeModel[GFXShadeModel["FLAT"] = 1] = "FLAT";
  })(GFXShadeModel || (_exports.GFXShadeModel = GFXShadeModel = {}));

  var GFXCullMode;
  _exports.GFXCullMode = GFXCullMode;

  (function (GFXCullMode) {
    GFXCullMode[GFXCullMode["NONE"] = 0] = "NONE";
    GFXCullMode[GFXCullMode["FRONT"] = 1] = "FRONT";
    GFXCullMode[GFXCullMode["BACK"] = 2] = "BACK";
  })(GFXCullMode || (_exports.GFXCullMode = GFXCullMode = {}));

  var GFXComparisonFunc;
  _exports.GFXComparisonFunc = GFXComparisonFunc;

  (function (GFXComparisonFunc) {
    GFXComparisonFunc[GFXComparisonFunc["NEVER"] = 0] = "NEVER";
    GFXComparisonFunc[GFXComparisonFunc["LESS"] = 1] = "LESS";
    GFXComparisonFunc[GFXComparisonFunc["EQUAL"] = 2] = "EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["LESS_EQUAL"] = 3] = "LESS_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["GREATER"] = 4] = "GREATER";
    GFXComparisonFunc[GFXComparisonFunc["NOT_EQUAL"] = 5] = "NOT_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["ALWAYS"] = 7] = "ALWAYS";
  })(GFXComparisonFunc || (_exports.GFXComparisonFunc = GFXComparisonFunc = {}));

  var GFXStencilOp;
  _exports.GFXStencilOp = GFXStencilOp;

  (function (GFXStencilOp) {
    GFXStencilOp[GFXStencilOp["ZERO"] = 0] = "ZERO";
    GFXStencilOp[GFXStencilOp["KEEP"] = 1] = "KEEP";
    GFXStencilOp[GFXStencilOp["REPLACE"] = 2] = "REPLACE";
    GFXStencilOp[GFXStencilOp["INCR"] = 3] = "INCR";
    GFXStencilOp[GFXStencilOp["DECR"] = 4] = "DECR";
    GFXStencilOp[GFXStencilOp["INVERT"] = 5] = "INVERT";
    GFXStencilOp[GFXStencilOp["INCR_WRAP"] = 6] = "INCR_WRAP";
    GFXStencilOp[GFXStencilOp["DECR_WRAP"] = 7] = "DECR_WRAP";
  })(GFXStencilOp || (_exports.GFXStencilOp = GFXStencilOp = {}));

  var GFXBlendOp;
  _exports.GFXBlendOp = GFXBlendOp;

  (function (GFXBlendOp) {
    GFXBlendOp[GFXBlendOp["ADD"] = 0] = "ADD";
    GFXBlendOp[GFXBlendOp["SUB"] = 1] = "SUB";
    GFXBlendOp[GFXBlendOp["REV_SUB"] = 2] = "REV_SUB";
    GFXBlendOp[GFXBlendOp["MIN"] = 3] = "MIN";
    GFXBlendOp[GFXBlendOp["MAX"] = 4] = "MAX";
  })(GFXBlendOp || (_exports.GFXBlendOp = GFXBlendOp = {}));

  var GFXBlendFactor;
  _exports.GFXBlendFactor = GFXBlendFactor;

  (function (GFXBlendFactor) {
    GFXBlendFactor[GFXBlendFactor["ZERO"] = 0] = "ZERO";
    GFXBlendFactor[GFXBlendFactor["ONE"] = 1] = "ONE";
    GFXBlendFactor[GFXBlendFactor["SRC_ALPHA"] = 2] = "SRC_ALPHA";
    GFXBlendFactor[GFXBlendFactor["DST_ALPHA"] = 3] = "DST_ALPHA";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_SRC_ALPHA"] = 4] = "ONE_MINUS_SRC_ALPHA";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_DST_ALPHA"] = 5] = "ONE_MINUS_DST_ALPHA";
    GFXBlendFactor[GFXBlendFactor["SRC_COLOR"] = 6] = "SRC_COLOR";
    GFXBlendFactor[GFXBlendFactor["DST_COLOR"] = 7] = "DST_COLOR";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_SRC_COLOR"] = 8] = "ONE_MINUS_SRC_COLOR";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_DST_COLOR"] = 9] = "ONE_MINUS_DST_COLOR";
    GFXBlendFactor[GFXBlendFactor["SRC_ALPHA_SATURATE"] = 10] = "SRC_ALPHA_SATURATE";
    GFXBlendFactor[GFXBlendFactor["CONSTANT_COLOR"] = 11] = "CONSTANT_COLOR";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_CONSTANT_COLOR"] = 12] = "ONE_MINUS_CONSTANT_COLOR";
    GFXBlendFactor[GFXBlendFactor["CONSTANT_ALPHA"] = 13] = "CONSTANT_ALPHA";
    GFXBlendFactor[GFXBlendFactor["ONE_MINUS_CONSTANT_ALPHA"] = 14] = "ONE_MINUS_CONSTANT_ALPHA";
  })(GFXBlendFactor || (_exports.GFXBlendFactor = GFXBlendFactor = {}));

  var GFXColorMask;
  _exports.GFXColorMask = GFXColorMask;

  (function (GFXColorMask) {
    GFXColorMask[GFXColorMask["NONE"] = 0] = "NONE";
    GFXColorMask[GFXColorMask["R"] = 1] = "R";
    GFXColorMask[GFXColorMask["G"] = 2] = "G";
    GFXColorMask[GFXColorMask["B"] = 4] = "B";
    GFXColorMask[GFXColorMask["A"] = 8] = "A";
    GFXColorMask[GFXColorMask["ALL"] = 15] = "ALL";
  })(GFXColorMask || (_exports.GFXColorMask = GFXColorMask = {}));

  var GFXFilter;
  _exports.GFXFilter = GFXFilter;

  (function (GFXFilter) {
    GFXFilter[GFXFilter["NONE"] = 0] = "NONE";
    GFXFilter[GFXFilter["POINT"] = 1] = "POINT";
    GFXFilter[GFXFilter["LINEAR"] = 2] = "LINEAR";
    GFXFilter[GFXFilter["ANISOTROPIC"] = 3] = "ANISOTROPIC";
  })(GFXFilter || (_exports.GFXFilter = GFXFilter = {}));

  var GFXAddress;
  _exports.GFXAddress = GFXAddress;

  (function (GFXAddress) {
    GFXAddress[GFXAddress["WRAP"] = 0] = "WRAP";
    GFXAddress[GFXAddress["MIRROR"] = 1] = "MIRROR";
    GFXAddress[GFXAddress["CLAMP"] = 2] = "CLAMP";
    GFXAddress[GFXAddress["BORDER"] = 3] = "BORDER";
  })(GFXAddress || (_exports.GFXAddress = GFXAddress = {}));

  var GFXTextureType;
  _exports.GFXTextureType = GFXTextureType;

  (function (GFXTextureType) {
    GFXTextureType[GFXTextureType["TEX1D"] = 0] = "TEX1D";
    GFXTextureType[GFXTextureType["TEX2D"] = 1] = "TEX2D";
    GFXTextureType[GFXTextureType["TEX3D"] = 2] = "TEX3D";
    GFXTextureType[GFXTextureType["CUBE"] = 3] = "CUBE";
    GFXTextureType[GFXTextureType["TEX1D_ARRAY"] = 4] = "TEX1D_ARRAY";
    GFXTextureType[GFXTextureType["TEX2D_ARRAY"] = 5] = "TEX2D_ARRAY";
  })(GFXTextureType || (_exports.GFXTextureType = GFXTextureType = {}));

  var GFXTextureUsageBit;
  _exports.GFXTextureUsageBit = GFXTextureUsageBit;

  (function (GFXTextureUsageBit) {
    GFXTextureUsageBit[GFXTextureUsageBit["NONE"] = 0] = "NONE";
    GFXTextureUsageBit[GFXTextureUsageBit["TRANSFER_SRC"] = 1] = "TRANSFER_SRC";
    GFXTextureUsageBit[GFXTextureUsageBit["TRANSFER_DST"] = 2] = "TRANSFER_DST";
    GFXTextureUsageBit[GFXTextureUsageBit["SAMPLED"] = 4] = "SAMPLED";
    GFXTextureUsageBit[GFXTextureUsageBit["STORAGE"] = 8] = "STORAGE";
    GFXTextureUsageBit[GFXTextureUsageBit["COLOR_ATTACHMENT"] = 16] = "COLOR_ATTACHMENT";
    GFXTextureUsageBit[GFXTextureUsageBit["DEPTH_STENCIL_ATTACHMENT"] = 32] = "DEPTH_STENCIL_ATTACHMENT";
    GFXTextureUsageBit[GFXTextureUsageBit["TRANSIENT_ATTACHMENT"] = 64] = "TRANSIENT_ATTACHMENT";
    GFXTextureUsageBit[GFXTextureUsageBit["INPUT_ATTACHMENT"] = 128] = "INPUT_ATTACHMENT";
  })(GFXTextureUsageBit || (_exports.GFXTextureUsageBit = GFXTextureUsageBit = {}));

  var GFXSampleCount;
  _exports.GFXSampleCount = GFXSampleCount;

  (function (GFXSampleCount) {
    GFXSampleCount[GFXSampleCount["X1"] = 0] = "X1";
    GFXSampleCount[GFXSampleCount["X2"] = 1] = "X2";
    GFXSampleCount[GFXSampleCount["X4"] = 2] = "X4";
    GFXSampleCount[GFXSampleCount["X8"] = 3] = "X8";
    GFXSampleCount[GFXSampleCount["X16"] = 4] = "X16";
    GFXSampleCount[GFXSampleCount["X32"] = 5] = "X32";
    GFXSampleCount[GFXSampleCount["X64"] = 6] = "X64";
  })(GFXSampleCount || (_exports.GFXSampleCount = GFXSampleCount = {}));

  var GFXTextureFlagBit;
  _exports.GFXTextureFlagBit = GFXTextureFlagBit;

  (function (GFXTextureFlagBit) {
    GFXTextureFlagBit[GFXTextureFlagBit["NONE"] = 0] = "NONE";
    GFXTextureFlagBit[GFXTextureFlagBit["GEN_MIPMAP"] = 1] = "GEN_MIPMAP";
    GFXTextureFlagBit[GFXTextureFlagBit["CUBEMAP"] = 2] = "CUBEMAP";
    GFXTextureFlagBit[GFXTextureFlagBit["BAKUP_BUFFER"] = 4] = "BAKUP_BUFFER";
  })(GFXTextureFlagBit || (_exports.GFXTextureFlagBit = GFXTextureFlagBit = {}));

  var GFXShaderStageFlagBit;
  _exports.GFXShaderStageFlagBit = GFXShaderStageFlagBit;

  (function (GFXShaderStageFlagBit) {
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["NONE"] = 0] = "NONE";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["VERTEX"] = 1] = "VERTEX";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["CONTROL"] = 2] = "CONTROL";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["EVALUATION"] = 4] = "EVALUATION";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["GEOMETRY"] = 8] = "GEOMETRY";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["FRAGMENT"] = 16] = "FRAGMENT";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["COMPUTE"] = 32] = "COMPUTE";
    GFXShaderStageFlagBit[GFXShaderStageFlagBit["ALL"] = 63] = "ALL";
  })(GFXShaderStageFlagBit || (_exports.GFXShaderStageFlagBit = GFXShaderStageFlagBit = {}));

  var GFXDescriptorType;
  _exports.GFXDescriptorType = GFXDescriptorType;

  (function (GFXDescriptorType) {
    GFXDescriptorType[GFXDescriptorType["UNKNOWN"] = 0] = "UNKNOWN";
    GFXDescriptorType[GFXDescriptorType["UNIFORM_BUFFER"] = 1] = "UNIFORM_BUFFER";
    GFXDescriptorType[GFXDescriptorType["DYNAMIC_UNIFORM_BUFFER"] = 2] = "DYNAMIC_UNIFORM_BUFFER";
    GFXDescriptorType[GFXDescriptorType["STORAGE_BUFFER"] = 4] = "STORAGE_BUFFER";
    GFXDescriptorType[GFXDescriptorType["DYNAMIC_STORAGE_BUFFER"] = 8] = "DYNAMIC_STORAGE_BUFFER";
    GFXDescriptorType[GFXDescriptorType["SAMPLER"] = 16] = "SAMPLER";
  })(GFXDescriptorType || (_exports.GFXDescriptorType = GFXDescriptorType = {}));

  var GFXCommandBufferType;
  _exports.GFXCommandBufferType = GFXCommandBufferType;

  (function (GFXCommandBufferType) {
    GFXCommandBufferType[GFXCommandBufferType["PRIMARY"] = 0] = "PRIMARY";
    GFXCommandBufferType[GFXCommandBufferType["SECONDARY"] = 1] = "SECONDARY";
  })(GFXCommandBufferType || (_exports.GFXCommandBufferType = GFXCommandBufferType = {}));

  var GFXLoadOp;
  _exports.GFXLoadOp = GFXLoadOp;

  (function (GFXLoadOp) {
    GFXLoadOp[GFXLoadOp["LOAD"] = 0] = "LOAD";
    GFXLoadOp[GFXLoadOp["CLEAR"] = 1] = "CLEAR";
    GFXLoadOp[GFXLoadOp["DISCARD"] = 2] = "DISCARD";
  })(GFXLoadOp || (_exports.GFXLoadOp = GFXLoadOp = {}));

  var GFXStoreOp;
  _exports.GFXStoreOp = GFXStoreOp;

  (function (GFXStoreOp) {
    GFXStoreOp[GFXStoreOp["STORE"] = 0] = "STORE";
    GFXStoreOp[GFXStoreOp["DISCARD"] = 1] = "DISCARD";
  })(GFXStoreOp || (_exports.GFXStoreOp = GFXStoreOp = {}));

  var GFXTextureLayout;
  _exports.GFXTextureLayout = GFXTextureLayout;

  (function (GFXTextureLayout) {
    GFXTextureLayout[GFXTextureLayout["UNDEFINED"] = 0] = "UNDEFINED";
    GFXTextureLayout[GFXTextureLayout["GENERAL"] = 1] = "GENERAL";
    GFXTextureLayout[GFXTextureLayout["COLOR_ATTACHMENT_OPTIMAL"] = 2] = "COLOR_ATTACHMENT_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["DEPTH_STENCIL_ATTACHMENT_OPTIMAL"] = 3] = "DEPTH_STENCIL_ATTACHMENT_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["DEPTH_STENCIL_READONLY_OPTIMAL"] = 4] = "DEPTH_STENCIL_READONLY_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["SHADER_READONLY_OPTIMAL"] = 5] = "SHADER_READONLY_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["TRANSFER_SRC_OPTIMAL"] = 6] = "TRANSFER_SRC_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["TRANSFER_DST_OPTIMAL"] = 7] = "TRANSFER_DST_OPTIMAL";
    GFXTextureLayout[GFXTextureLayout["PREINITIALIZED"] = 8] = "PREINITIALIZED";
    GFXTextureLayout[GFXTextureLayout["PRESENT_SRC"] = 9] = "PRESENT_SRC";
  })(GFXTextureLayout || (_exports.GFXTextureLayout = GFXTextureLayout = {}));

  var GFXPipelineBindPoint;
  _exports.GFXPipelineBindPoint = GFXPipelineBindPoint;

  (function (GFXPipelineBindPoint) {
    GFXPipelineBindPoint[GFXPipelineBindPoint["GRAPHICS"] = 0] = "GRAPHICS";
    GFXPipelineBindPoint[GFXPipelineBindPoint["COMPUTE"] = 1] = "COMPUTE";
    GFXPipelineBindPoint[GFXPipelineBindPoint["RAY_TRACING"] = 2] = "RAY_TRACING";
  })(GFXPipelineBindPoint || (_exports.GFXPipelineBindPoint = GFXPipelineBindPoint = {}));

  var GFXDynamicStateFlagBit;
  _exports.GFXDynamicStateFlagBit = GFXDynamicStateFlagBit;

  (function (GFXDynamicStateFlagBit) {
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["NONE"] = 0] = "NONE";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["VIEWPORT"] = 1] = "VIEWPORT";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["SCISSOR"] = 2] = "SCISSOR";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["LINE_WIDTH"] = 4] = "LINE_WIDTH";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["DEPTH_BIAS"] = 8] = "DEPTH_BIAS";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["BLEND_CONSTANTS"] = 16] = "BLEND_CONSTANTS";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["DEPTH_BOUNDS"] = 32] = "DEPTH_BOUNDS";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["STENCIL_WRITE_MASK"] = 64] = "STENCIL_WRITE_MASK";
    GFXDynamicStateFlagBit[GFXDynamicStateFlagBit["STENCIL_COMPARE_MASK"] = 128] = "STENCIL_COMPARE_MASK";
  })(GFXDynamicStateFlagBit || (_exports.GFXDynamicStateFlagBit = GFXDynamicStateFlagBit = {}));

  var GFXStencilFace;
  _exports.GFXStencilFace = GFXStencilFace;

  (function (GFXStencilFace) {
    GFXStencilFace[GFXStencilFace["FRONT"] = 0] = "FRONT";
    GFXStencilFace[GFXStencilFace["BACK"] = 1] = "BACK";
    GFXStencilFace[GFXStencilFace["ALL"] = 2] = "ALL";
  })(GFXStencilFace || (_exports.GFXStencilFace = GFXStencilFace = {}));

  var GFXQueueType;
  _exports.GFXQueueType = GFXQueueType;

  (function (GFXQueueType) {
    GFXQueueType[GFXQueueType["GRAPHICS"] = 0] = "GRAPHICS";
    GFXQueueType[GFXQueueType["COMPUTE"] = 1] = "COMPUTE";
    GFXQueueType[GFXQueueType["TRANSFER"] = 2] = "TRANSFER";
  })(GFXQueueType || (_exports.GFXQueueType = GFXQueueType = {}));

  var GFXRect = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXRect() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, GFXRect);

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  };

  _exports.GFXRect = GFXRect;

  var GFXViewport = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXViewport() {
    var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var top = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var minDepth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var maxDepth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

    _classCallCheck(this, GFXViewport);

    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.minDepth = minDepth;
    this.maxDepth = maxDepth;
  };

  _exports.GFXViewport = GFXViewport;

  var GFXColor = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXColor() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    _classCallCheck(this, GFXColor);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  };

  _exports.GFXColor = GFXColor;
  var GFXClearFlag;
  _exports.GFXClearFlag = GFXClearFlag;

  (function (GFXClearFlag) {
    GFXClearFlag[GFXClearFlag["NONE"] = 0] = "NONE";
    GFXClearFlag[GFXClearFlag["COLOR"] = 1] = "COLOR";
    GFXClearFlag[GFXClearFlag["DEPTH"] = 2] = "DEPTH";
    GFXClearFlag[GFXClearFlag["STENCIL"] = 4] = "STENCIL";
    GFXClearFlag[GFXClearFlag["DEPTH_STENCIL"] = 6] = "DEPTH_STENCIL";
    GFXClearFlag[GFXClearFlag["ALL"] = 7] = "ALL";
  })(GFXClearFlag || (_exports.GFXClearFlag = GFXClearFlag = {}));

  var GFXOffset = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXOffset() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GFXOffset);

    this.x = x;
    this.y = y;
    this.z = z;
  };

  _exports.GFXOffset = GFXOffset;

  var GFXExtent = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXExtent() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, GFXExtent);

    this.width = width;
    this.height = height;
    this.depth = depth;
  };

  _exports.GFXExtent = GFXExtent;

  var GFXTextureSubres = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXTextureSubres() {
    var mipLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var baseArrayLayer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var layerCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    _classCallCheck(this, GFXTextureSubres);

    this.mipLevel = mipLevel;
    this.baseArrayLayer = baseArrayLayer;
    this.layerCount = layerCount;
  };

  _exports.GFXTextureSubres = GFXTextureSubres;

  var GFXTextureCopy = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXTextureCopy() {
    var srcSubres = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new GFXTextureSubres();
    var srcOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new GFXOffset();
    var dstSubres = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new GFXTextureSubres();
    var dstOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new GFXOffset();
    var extent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new GFXExtent();

    _classCallCheck(this, GFXTextureCopy);

    this.srcSubres = srcSubres;
    this.srcOffset = srcOffset;
    this.dstSubres = dstSubres;
    this.dstOffset = dstOffset;
    this.extent = extent;
  };

  _exports.GFXTextureCopy = GFXTextureCopy;

  var GFXBufferTextureCopy = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXBufferTextureCopy() {
    var buffStride = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var buffTexHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var texOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new GFXOffset();
    var texExtent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new GFXExtent();
    var texSubres = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new GFXTextureSubres();

    _classCallCheck(this, GFXBufferTextureCopy);

    this.buffStride = buffStride;
    this.buffTexHeight = buffTexHeight;
    this.texOffset = texOffset;
    this.texExtent = texExtent;
    this.texSubres = texSubres;
  };

  _exports.GFXBufferTextureCopy = GFXBufferTextureCopy;
  var GFXFormatType;
  _exports.GFXFormatType = GFXFormatType;

  (function (GFXFormatType) {
    GFXFormatType[GFXFormatType["NONE"] = 0] = "NONE";
    GFXFormatType[GFXFormatType["UNORM"] = 1] = "UNORM";
    GFXFormatType[GFXFormatType["SNORM"] = 2] = "SNORM";
    GFXFormatType[GFXFormatType["UINT"] = 3] = "UINT";
    GFXFormatType[GFXFormatType["INT"] = 4] = "INT";
    GFXFormatType[GFXFormatType["UFLOAT"] = 5] = "UFLOAT";
    GFXFormatType[GFXFormatType["FLOAT"] = 6] = "FLOAT";
  })(GFXFormatType || (_exports.GFXFormatType = GFXFormatType = {}));

  var GFXFormatInfo = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXFormatInfo(name, size, count, type, hasAlpha, hasDepth, hasStencil, isCompressed) {
    _classCallCheck(this, GFXFormatInfo);

    this.name = name;
    this.size = size;
    this.count = count;
    this.type = type;
    this.hasAlpha = hasAlpha;
    this.hasDepth = hasDepth;
    this.hasStencil = hasStencil;
    this.isCompressed = isCompressed;
  };

  _exports.GFXFormatInfo = GFXFormatInfo;

  var GFXMemoryStatus = // to make sure all usages must be an instance of this exact class, not assembled from plain object
  function GFXMemoryStatus() {
    var bufferSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var textureSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, GFXMemoryStatus);

    this.bufferSize = bufferSize;
    this.textureSize = textureSize;
  };

  _exports.GFXMemoryStatus = GFXMemoryStatus;
  var GFXFormatInfos = Object.freeze([new GFXFormatInfo('UNKNOWN', 0, 0, GFXFormatType.NONE, false, false, false, false), new GFXFormatInfo('A8', 1, 1, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('L8', 1, 1, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('LA8', 1, 2, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('R8', 1, 1, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('R8SN', 1, 1, GFXFormatType.SNORM, false, false, false, false), new GFXFormatInfo('R8UI', 1, 1, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('R8I', 1, 1, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('R16F', 2, 1, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('R16UI', 2, 1, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('R16I', 2, 1, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('R32F', 4, 1, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('R32UI', 4, 1, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('R32I', 4, 1, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RG8', 2, 2, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('RG8SN', 2, 2, GFXFormatType.SNORM, false, false, false, false), new GFXFormatInfo('RG8UI', 2, 2, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RG8I', 2, 2, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RG16F', 4, 2, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('RG16UI', 4, 2, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RG16I', 4, 2, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RG32F', 8, 2, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('RG32UI', 8, 2, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RG32I', 8, 2, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RGB8', 3, 3, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('SRGB8', 3, 3, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('RGB8SN', 3, 3, GFXFormatType.SNORM, false, false, false, false), new GFXFormatInfo('RGB8UI', 3, 3, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RGB8I', 3, 3, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RGB16F', 6, 3, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('RGB16UI', 6, 3, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RGB16I', 6, 3, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RGB32F', 12, 3, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('RGB32UI', 12, 3, GFXFormatType.UINT, false, false, false, false), new GFXFormatInfo('RGB32I', 12, 3, GFXFormatType.INT, false, false, false, false), new GFXFormatInfo('RGBA8', 4, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('BGRA8', 4, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('SRGB8_A8', 4, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('RGBA8SN', 4, 4, GFXFormatType.SNORM, true, false, false, false), new GFXFormatInfo('RGBA8UI', 4, 4, GFXFormatType.UINT, true, false, false, false), new GFXFormatInfo('RGBA8I', 4, 4, GFXFormatType.INT, true, false, false, false), new GFXFormatInfo('RGBA16F', 8, 4, GFXFormatType.FLOAT, true, false, false, false), new GFXFormatInfo('RGBA16UI', 8, 4, GFXFormatType.UINT, true, false, false, false), new GFXFormatInfo('RGBA16I', 8, 4, GFXFormatType.INT, true, false, false, false), new GFXFormatInfo('RGBA32F', 16, 4, GFXFormatType.FLOAT, true, false, false, false), new GFXFormatInfo('RGBA32UI', 16, 4, GFXFormatType.UINT, true, false, false, false), new GFXFormatInfo('RGBA32I', 16, 4, GFXFormatType.INT, true, false, false, false), new GFXFormatInfo('R5G6B5', 2, 3, GFXFormatType.UNORM, false, false, false, false), new GFXFormatInfo('R11G11B10F', 4, 3, GFXFormatType.FLOAT, false, false, false, false), new GFXFormatInfo('RGB5A1', 2, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('RGBA4', 2, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('RGB10A2', 2, 4, GFXFormatType.UNORM, true, false, false, false), new GFXFormatInfo('RGB10A2UI', 2, 4, GFXFormatType.UINT, true, false, false, false), new GFXFormatInfo('RGB9E5', 2, 4, GFXFormatType.FLOAT, true, false, false, false), new GFXFormatInfo('D16', 2, 1, GFXFormatType.UINT, false, true, false, false), new GFXFormatInfo('D16S8', 3, 2, GFXFormatType.UINT, false, true, true, false), new GFXFormatInfo('D24', 3, 1, GFXFormatType.UINT, false, true, false, false), new GFXFormatInfo('D24S8', 4, 2, GFXFormatType.UINT, false, true, true, false), new GFXFormatInfo('D32F', 4, 1, GFXFormatType.FLOAT, false, true, false, false), new GFXFormatInfo('D32FS8', 5, 2, GFXFormatType.FLOAT, false, true, true, false), new GFXFormatInfo('BC1', 1, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('BC1_ALPHA', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC1_SRGB', 1, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('BC1_SRGB_ALPHA', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC2', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC2_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC3', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC3_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC4', 1, 1, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('BC4_SNORM', 1, 1, GFXFormatType.SNORM, false, false, false, true), new GFXFormatInfo('BC5', 1, 2, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('BC5_SNORM', 1, 2, GFXFormatType.SNORM, false, false, false, true), new GFXFormatInfo('BC6H_UF16', 1, 3, GFXFormatType.UFLOAT, false, false, false, true), new GFXFormatInfo('BC6H_SF16', 1, 3, GFXFormatType.FLOAT, false, false, false, true), new GFXFormatInfo('BC7', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('BC7_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ETC_RGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('ETC2_RGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('ETC2_SRGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('ETC2_RGB8_A1', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ETC2_SRGB8_A1', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ETC2_RGBA8', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ETC2_SRGB8_A8', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('EAC_R11', 1, 1, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('EAC_R11SN', 1, 1, GFXFormatType.SNORM, false, false, false, true), new GFXFormatInfo('EAC_RG11', 2, 2, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('EAC_RG11SN', 2, 2, GFXFormatType.SNORM, false, false, false, true), new GFXFormatInfo('PVRTC_RGB2', 2, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('PVRTC_RGBA2', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('PVRTC_RGB4', 2, 3, GFXFormatType.UNORM, false, false, false, true), new GFXFormatInfo('PVRTC_RGBA4', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('PVRTC2_2BPP', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('PVRTC2_4BPP', 2, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_4x4', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_5x4', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_5x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_6x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_6x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_8x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_8x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_8x8', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_10x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_10x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_10x8', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_10x10', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_12x10', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_RGBA_12x12', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_4x4', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_5x4', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_5x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_6x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_6x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_8x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_8x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_8x8', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_10x5', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_10x6', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_10x8', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_10x10', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_12x10', 1, 4, GFXFormatType.UNORM, true, false, false, true), new GFXFormatInfo('ASTC_SRGBA_12x12', 1, 4, GFXFormatType.UNORM, true, false, false, true)]);
  /**
   * @en Get memory size of the specified fomat.
   * @zh 获取指定格式对应的内存大小。
   * @param format The target format.
   * @param width The target width.
   * @param height The target height.
   * @param depth The target depth.
   */

  _exports.GFXFormatInfos = GFXFormatInfos;

  function GFXFormatSize(format, width, height, depth) {
    if (!GFXFormatInfos[format].isCompressed) {
      return width * height * depth * GFXFormatInfos[format].size;
    } else {
      switch (format) {
        case GFXFormat.BC1:
        case GFXFormat.BC1_ALPHA:
        case GFXFormat.BC1_SRGB:
        case GFXFormat.BC1_SRGB_ALPHA:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;

        case GFXFormat.BC2:
        case GFXFormat.BC2_SRGB:
        case GFXFormat.BC3:
        case GFXFormat.BC3_SRGB:
        case GFXFormat.BC4:
        case GFXFormat.BC4_SNORM:
        case GFXFormat.BC6H_SF16:
        case GFXFormat.BC6H_UF16:
        case GFXFormat.BC7:
        case GFXFormat.BC7_SRGB:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

        case GFXFormat.BC5:
        case GFXFormat.BC5_SNORM:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 32 * depth;

        case GFXFormat.ETC_RGB8:
        case GFXFormat.ETC2_RGB8:
        case GFXFormat.ETC2_SRGB8:
        case GFXFormat.ETC2_RGB8_A1:
        case GFXFormat.EAC_R11:
        case GFXFormat.EAC_R11SN:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;

        case GFXFormat.ETC2_RGBA8:
        case GFXFormat.ETC2_SRGB8_A1:
        case GFXFormat.EAC_RG11:
        case GFXFormat.EAC_RG11SN:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

        case GFXFormat.PVRTC_RGB2:
        case GFXFormat.PVRTC_RGBA2:
        case GFXFormat.PVRTC2_2BPP:
          return Math.ceil(Math.max(width, 16) * Math.max(height, 8) / 4) * depth;

        case GFXFormat.PVRTC_RGB4:
        case GFXFormat.PVRTC_RGBA4:
        case GFXFormat.PVRTC2_4BPP:
          return Math.ceil(Math.max(width, 8) * Math.max(height, 8) / 2) * depth;

        case GFXFormat.ASTC_RGBA_4x4:
        case GFXFormat.ASTC_SRGBA_4x4:
          return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

        case GFXFormat.ASTC_RGBA_5x4:
        case GFXFormat.ASTC_SRGBA_5x4:
          return Math.ceil(width / 5) * Math.ceil(height / 4) * 16 * depth;

        case GFXFormat.ASTC_RGBA_5x5:
        case GFXFormat.ASTC_SRGBA_5x5:
          return Math.ceil(width / 5) * Math.ceil(height / 5) * 16 * depth;

        case GFXFormat.ASTC_RGBA_6x5:
        case GFXFormat.ASTC_SRGBA_6x5:
          return Math.ceil(width / 6) * Math.ceil(height / 5) * 16 * depth;

        case GFXFormat.ASTC_RGBA_6x6:
        case GFXFormat.ASTC_SRGBA_6x6:
          return Math.ceil(width / 6) * Math.ceil(height / 6) * 16 * depth;

        case GFXFormat.ASTC_RGBA_8x5:
        case GFXFormat.ASTC_SRGBA_8x5:
          return Math.ceil(width / 8) * Math.ceil(height / 5) * 16 * depth;

        case GFXFormat.ASTC_RGBA_8x6:
        case GFXFormat.ASTC_SRGBA_8x6:
          return Math.ceil(width / 8) * Math.ceil(height / 6) * 16 * depth;

        case GFXFormat.ASTC_RGBA_8x8:
        case GFXFormat.ASTC_SRGBA_8x8:
          return Math.ceil(width / 8) * Math.ceil(height / 8) * 16 * depth;

        case GFXFormat.ASTC_RGBA_10x5:
        case GFXFormat.ASTC_SRGBA_10x5:
          return Math.ceil(width / 10) * Math.ceil(height / 5) * 16 * depth;

        case GFXFormat.ASTC_RGBA_10x6:
        case GFXFormat.ASTC_SRGBA_10x6:
          return Math.ceil(width / 10) * Math.ceil(height / 6) * 16 * depth;

        case GFXFormat.ASTC_RGBA_10x8:
        case GFXFormat.ASTC_SRGBA_10x8:
          return Math.ceil(width / 10) * Math.ceil(height / 8) * 16 * depth;

        case GFXFormat.ASTC_RGBA_10x10:
        case GFXFormat.ASTC_SRGBA_10x10:
          return Math.ceil(width / 10) * Math.ceil(height / 10) * 16 * depth;

        case GFXFormat.ASTC_RGBA_12x10:
        case GFXFormat.ASTC_SRGBA_12x10:
          return Math.ceil(width / 12) * Math.ceil(height / 10) * 16 * depth;

        case GFXFormat.ASTC_RGBA_12x12:
        case GFXFormat.ASTC_SRGBA_12x12:
          return Math.ceil(width / 12) * Math.ceil(height / 12) * 16 * depth;

        default:
          {
            return 0;
          }
      }
    }
  }
  /**
   * @en Get memory size of the specified surface.
   * @zh GFX 格式表面内存大小。
   * @param format The target format.
   * @param width The target width.
   * @param height The target height.
   * @param depth The target depth.
   * @param mips The target mip levels.
   */


  function GFXFormatSurfaceSize(format, width, height, depth, mips) {
    var size = 0;

    for (var i = 0; i < mips; ++i) {
      size += GFXFormatSize(format, width, height, depth);
      width = Math.max(width >> 1, 1);
      height = Math.max(height >> 1, 1);
    }

    return size;
  }

  var _type2size = [0, // UNKNOWN
  4, // BOOL
  8, // BOOL2
  12, // BOOL3
  16, // BOOL4
  4, // INT
  8, // INT2
  12, // INT3
  16, // INT4
  4, // UINT
  8, // UINT2
  12, // UINT3
  16, // UINT4
  4, // FLOAT
  8, // FLOAT2
  12, // FLOAT3
  16, // FLOAT4
  16, // MAT2
  24, // MAT2X3
  32, // MAT2X4
  24, // MAT3X2
  36, // MAT3
  48, // MAT3X4
  32, // MAT4X2
  48, // MAT4X3
  64, // MAT4
  4, // SAMPLER1D
  4, // SAMPLER1D_ARRAY
  4, // SAMPLER2D
  4, // SAMPLER2D_ARRAY
  4, // SAMPLER3D
  4 // SAMPLER_CUBE
  ];
  /**
   * @en Get the memory size of the specified type.
   * @zh 得到 GFX 数据类型的大小。
   * @param type The target type.
   */

  function GFXGetTypeSize(type) {
    return _type2size[type] || 0;
  }

  function getTypedArrayConstructor(info) {
    var stride = info.size / info.count;

    switch (info.type) {
      case GFXFormatType.UNORM:
      case GFXFormatType.UINT:
        {
          switch (stride) {
            case 1:
              return Uint8Array;

            case 2:
              return Uint16Array;

            case 4:
              return Uint32Array;
          }

          break;
        }

      case GFXFormatType.SNORM:
      case GFXFormatType.INT:
        {
          switch (stride) {
            case 1:
              return Int8Array;

            case 2:
              return Int16Array;

            case 4:
              return Int32Array;
          }

          break;
        }

      case GFXFormatType.FLOAT:
        {
          return Float32Array;
        }
    }

    return Float32Array;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L2RlZmluZS50cyJdLCJuYW1lcyI6WyJHRlhfTUFYX0FUVEFDSE1FTlRTIiwiR0ZYT2JqZWN0VHlwZSIsIkdGWE9iamVjdCIsIl9nZnhUeXBlIiwiZ2Z4VHlwZSIsIlVOS05PV04iLCJHRlhBdHRyaWJ1dGVOYW1lIiwiR0ZYVHlwZSIsIkdGWEZvcm1hdCIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJHRlhCdWZmZXJGbGFnQml0IiwiR0ZYQnVmZmVyQWNjZXNzQml0IiwiR0ZYUHJpbWl0aXZlTW9kZSIsIkdGWFBvbHlnb25Nb2RlIiwiR0ZYU2hhZGVNb2RlbCIsIkdGWEN1bGxNb2RlIiwiR0ZYQ29tcGFyaXNvbkZ1bmMiLCJHRlhTdGVuY2lsT3AiLCJHRlhCbGVuZE9wIiwiR0ZYQmxlbmRGYWN0b3IiLCJHRlhDb2xvck1hc2siLCJHRlhGaWx0ZXIiLCJHRlhBZGRyZXNzIiwiR0ZYVGV4dHVyZVR5cGUiLCJHRlhUZXh0dXJlVXNhZ2VCaXQiLCJHRlhTYW1wbGVDb3VudCIsIkdGWFRleHR1cmVGbGFnQml0IiwiR0ZYU2hhZGVyU3RhZ2VGbGFnQml0IiwiR0ZYRGVzY3JpcHRvclR5cGUiLCJHRlhDb21tYW5kQnVmZmVyVHlwZSIsIkdGWExvYWRPcCIsIkdGWFN0b3JlT3AiLCJHRlhUZXh0dXJlTGF5b3V0IiwiR0ZYUGlwZWxpbmVCaW5kUG9pbnQiLCJHRlhEeW5hbWljU3RhdGVGbGFnQml0IiwiR0ZYU3RlbmNpbEZhY2UiLCJHRlhRdWV1ZVR5cGUiLCJHRlhSZWN0IiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsIkdGWFZpZXdwb3J0IiwibGVmdCIsInRvcCIsIm1pbkRlcHRoIiwibWF4RGVwdGgiLCJHRlhDb2xvciIsInoiLCJ3IiwiR0ZYQ2xlYXJGbGFnIiwiR0ZYT2Zmc2V0IiwiR0ZYRXh0ZW50IiwiZGVwdGgiLCJHRlhUZXh0dXJlU3VicmVzIiwibWlwTGV2ZWwiLCJiYXNlQXJyYXlMYXllciIsImxheWVyQ291bnQiLCJHRlhUZXh0dXJlQ29weSIsInNyY1N1YnJlcyIsInNyY09mZnNldCIsImRzdFN1YnJlcyIsImRzdE9mZnNldCIsImV4dGVudCIsIkdGWEJ1ZmZlclRleHR1cmVDb3B5IiwiYnVmZlN0cmlkZSIsImJ1ZmZUZXhIZWlnaHQiLCJ0ZXhPZmZzZXQiLCJ0ZXhFeHRlbnQiLCJ0ZXhTdWJyZXMiLCJHRlhGb3JtYXRUeXBlIiwiR0ZYRm9ybWF0SW5mbyIsIm5hbWUiLCJzaXplIiwiY291bnQiLCJ0eXBlIiwiaGFzQWxwaGEiLCJoYXNEZXB0aCIsImhhc1N0ZW5jaWwiLCJpc0NvbXByZXNzZWQiLCJHRlhNZW1vcnlTdGF0dXMiLCJidWZmZXJTaXplIiwidGV4dHVyZVNpemUiLCJHRlhGb3JtYXRJbmZvcyIsIk9iamVjdCIsImZyZWV6ZSIsIk5PTkUiLCJVTk9STSIsIlNOT1JNIiwiVUlOVCIsIklOVCIsIkZMT0FUIiwiVUZMT0FUIiwiR0ZYRm9ybWF0U2l6ZSIsImZvcm1hdCIsIkJDMSIsIkJDMV9BTFBIQSIsIkJDMV9TUkdCIiwiQkMxX1NSR0JfQUxQSEEiLCJNYXRoIiwiY2VpbCIsIkJDMiIsIkJDMl9TUkdCIiwiQkMzIiwiQkMzX1NSR0IiLCJCQzQiLCJCQzRfU05PUk0iLCJCQzZIX1NGMTYiLCJCQzZIX1VGMTYiLCJCQzciLCJCQzdfU1JHQiIsIkJDNSIsIkJDNV9TTk9STSIsIkVUQ19SR0I4IiwiRVRDMl9SR0I4IiwiRVRDMl9TUkdCOCIsIkVUQzJfUkdCOF9BMSIsIkVBQ19SMTEiLCJFQUNfUjExU04iLCJFVEMyX1JHQkE4IiwiRVRDMl9TUkdCOF9BMSIsIkVBQ19SRzExIiwiRUFDX1JHMTFTTiIsIlBWUlRDX1JHQjIiLCJQVlJUQ19SR0JBMiIsIlBWUlRDMl8yQlBQIiwibWF4IiwiUFZSVENfUkdCNCIsIlBWUlRDX1JHQkE0IiwiUFZSVEMyXzRCUFAiLCJBU1RDX1JHQkFfNHg0IiwiQVNUQ19TUkdCQV80eDQiLCJBU1RDX1JHQkFfNXg0IiwiQVNUQ19TUkdCQV81eDQiLCJBU1RDX1JHQkFfNXg1IiwiQVNUQ19TUkdCQV81eDUiLCJBU1RDX1JHQkFfNng1IiwiQVNUQ19TUkdCQV82eDUiLCJBU1RDX1JHQkFfNng2IiwiQVNUQ19TUkdCQV82eDYiLCJBU1RDX1JHQkFfOHg1IiwiQVNUQ19TUkdCQV84eDUiLCJBU1RDX1JHQkFfOHg2IiwiQVNUQ19TUkdCQV84eDYiLCJBU1RDX1JHQkFfOHg4IiwiQVNUQ19TUkdCQV84eDgiLCJBU1RDX1JHQkFfMTB4NSIsIkFTVENfU1JHQkFfMTB4NSIsIkFTVENfUkdCQV8xMHg2IiwiQVNUQ19TUkdCQV8xMHg2IiwiQVNUQ19SR0JBXzEweDgiLCJBU1RDX1NSR0JBXzEweDgiLCJBU1RDX1JHQkFfMTB4MTAiLCJBU1RDX1NSR0JBXzEweDEwIiwiQVNUQ19SR0JBXzEyeDEwIiwiQVNUQ19TUkdCQV8xMngxMCIsIkFTVENfUkdCQV8xMngxMiIsIkFTVENfU1JHQkFfMTJ4MTIiLCJHRlhGb3JtYXRTdXJmYWNlU2l6ZSIsIm1pcHMiLCJpIiwiX3R5cGUyc2l6ZSIsIkdGWEdldFR5cGVTaXplIiwiZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yIiwiaW5mbyIsInN0cmlkZSIsIlVpbnQ4QXJyYXkiLCJVaW50MTZBcnJheSIsIlVpbnQzMkFycmF5IiwiSW50OEFycmF5IiwiSW50MTZBcnJheSIsIkludDMyQXJyYXkiLCJGbG9hdDMyQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFJTyxNQUFNQSxtQkFBMkIsR0FBRyxDQUFwQzs7TUFFS0MsYTtBQW1CWjs7Ozs7OzthQW5CWUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7S0FBQUEsYSw4QkFBQUEsYTs7TUF1QkNDLFM7OzswQkFFNEI7QUFDakMsZUFBTyxLQUFLQyxRQUFaO0FBQ0g7OztBQUlELHVCQUFhQyxPQUFiLEVBQXFDO0FBQUE7O0FBQUEsV0FGM0JELFFBRTJCLEdBRmhCRixhQUFhLENBQUNJLE9BRUU7QUFDakMsV0FBS0YsUUFBTCxHQUFnQkMsT0FBaEI7QUFDSDs7Ozs7O01BR09FLGdCOzs7YUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0I7S0FBQUEsZ0IsaUNBQUFBLGdCOztNQXVCQUMsTzs7O2FBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87QUFBQUEsSUFBQUEsTyxDQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTztBQUFBQSxJQUFBQSxPLENBQUFBLE87S0FBQUEsTyx3QkFBQUEsTzs7TUE4Q0FDLFM7OzthQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztLQUFBQSxTLDBCQUFBQSxTOztNQTJKQUMsaUI7OzthQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtLQUFBQSxpQixrQ0FBQUEsaUI7O01BYUFDLGlCOzs7YUFBQUEsaUI7QUFBQUEsSUFBQUEsaUIsQ0FBQUEsaUI7QUFBQUEsSUFBQUEsaUIsQ0FBQUEsaUI7QUFBQUEsSUFBQUEsaUIsQ0FBQUEsaUI7S0FBQUEsaUIsa0NBQUFBLGlCOztNQVFBQyxnQjs7O2FBQUFBLGdCO0FBQUFBLElBQUFBLGdCLENBQUFBLGdCO0FBQUFBLElBQUFBLGdCLENBQUFBLGdCO0tBQUFBLGdCLGlDQUFBQSxnQjs7TUFPQUMsa0I7OzthQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtBQUFBQSxJQUFBQSxrQixDQUFBQSxrQjtLQUFBQSxrQixtQ0FBQUEsa0I7O01BUUFDLGdCOzs7YUFBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7QUFBQUEsSUFBQUEsZ0IsQ0FBQUEsZ0I7S0FBQUEsZ0IsaUNBQUFBLGdCOztNQWtCQUMsYzs7O2FBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7S0FBQUEsYywrQkFBQUEsYzs7TUFNQUMsYTs7O2FBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtLQUFBQSxhLDhCQUFBQSxhOztNQUtBQyxXOzs7YUFBQUEsVztBQUFBQSxJQUFBQSxXLENBQUFBLFc7QUFBQUEsSUFBQUEsVyxDQUFBQSxXO0FBQUFBLElBQUFBLFcsQ0FBQUEsVztLQUFBQSxXLDRCQUFBQSxXOztNQU1BQyxpQjs7O2FBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0tBQUFBLGlCLGtDQUFBQSxpQjs7TUFXQUMsWTs7O2FBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtLQUFBQSxZLDZCQUFBQSxZOztNQVdBQyxVOzs7YUFBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0tBQUFBLFUsMkJBQUFBLFU7O01BUUFDLGM7OzthQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0tBQUFBLGMsK0JBQUFBLGM7O01Ba0JBQyxZOzs7YUFBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtLQUFBQSxZLDZCQUFBQSxZOztNQVNBQyxTOzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7S0FBQUEsUywwQkFBQUEsUzs7TUFPQUMsVTs7O2FBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7QUFBQUEsSUFBQUEsVSxDQUFBQSxVO0tBQUFBLFUsMkJBQUFBLFU7O01BT0FDLGM7OzthQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0tBQUFBLGMsK0JBQUFBLGM7O01BU0FDLGtCOzs7YUFBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7QUFBQUEsSUFBQUEsa0IsQ0FBQUEsa0I7S0FBQUEsa0IsbUNBQUFBLGtCOztNQWNBQyxjOzs7YUFBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7S0FBQUEsYywrQkFBQUEsYzs7TUFVQUMsaUI7OzthQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtBQUFBQSxJQUFBQSxpQixDQUFBQSxpQjtLQUFBQSxpQixrQ0FBQUEsaUI7O01BUUFDLHFCOzs7YUFBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7QUFBQUEsSUFBQUEscUIsQ0FBQUEscUI7S0FBQUEscUIsc0NBQUFBLHFCOztNQVlBQyxpQjs7O2FBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0FBQUFBLElBQUFBLGlCLENBQUFBLGlCO0tBQUFBLGlCLGtDQUFBQSxpQjs7TUFTQUMsb0I7OzthQUFBQSxvQjtBQUFBQSxJQUFBQSxvQixDQUFBQSxvQjtBQUFBQSxJQUFBQSxvQixDQUFBQSxvQjtLQUFBQSxvQixxQ0FBQUEsb0I7O01BS0FDLFM7OzthQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsMEJBQUFBLFM7O01BTUFDLFU7OzthQUFBQSxVO0FBQUFBLElBQUFBLFUsQ0FBQUEsVTtBQUFBQSxJQUFBQSxVLENBQUFBLFU7S0FBQUEsVSwyQkFBQUEsVTs7TUFLQUMsZ0I7OzthQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtBQUFBQSxJQUFBQSxnQixDQUFBQSxnQjtLQUFBQSxnQixpQ0FBQUEsZ0I7O01BYUFDLG9COzs7YUFBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7QUFBQUEsSUFBQUEsb0IsQ0FBQUEsb0I7S0FBQUEsb0IscUNBQUFBLG9COztNQU1BQyxzQjs7O2FBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0FBQUFBLElBQUFBLHNCLENBQUFBLHNCO0tBQUFBLHNCLHVDQUFBQSxzQjs7TUFjQUMsYzs7O2FBQUFBLGM7QUFBQUEsSUFBQUEsYyxDQUFBQSxjO0FBQUFBLElBQUFBLGMsQ0FBQUEsYztBQUFBQSxJQUFBQSxjLENBQUFBLGM7S0FBQUEsYywrQkFBQUEsYzs7TUFNQUMsWTs7O2FBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7S0FBQUEsWSw2QkFBQUEsWTs7TUFNQ0MsTyxHQUNxQjtBQUU5QixxQkFLRTtBQUFBLFFBSlNDLENBSVQsdUVBSnFCLENBSXJCO0FBQUEsUUFIU0MsQ0FHVCx1RUFIcUIsQ0FHckI7QUFBQSxRQUZTQyxLQUVULHVFQUZ5QixDQUV6QjtBQUFBLFFBRFNDLE1BQ1QsdUVBRDBCLENBQzFCOztBQUFBOztBQUFBLFNBSlNILENBSVQsR0FKU0EsQ0FJVDtBQUFBLFNBSFNDLENBR1QsR0FIU0EsQ0FHVDtBQUFBLFNBRlNDLEtBRVQsR0FGU0EsS0FFVDtBQUFBLFNBRFNDLE1BQ1QsR0FEU0EsTUFDVDtBQUFFLEc7Ozs7TUFHS0MsVyxHQUNxQjtBQUU5Qix5QkFPRTtBQUFBLFFBTlNDLElBTVQsdUVBTndCLENBTXhCO0FBQUEsUUFMU0MsR0FLVCx1RUFMdUIsQ0FLdkI7QUFBQSxRQUpTSixLQUlULHVFQUp5QixDQUl6QjtBQUFBLFFBSFNDLE1BR1QsdUVBSDBCLENBRzFCO0FBQUEsUUFGU0ksUUFFVCx1RUFGNEIsQ0FFNUI7QUFBQSxRQURTQyxRQUNULHVFQUQ0QixDQUM1Qjs7QUFBQTs7QUFBQSxTQU5TSCxJQU1ULEdBTlNBLElBTVQ7QUFBQSxTQUxTQyxHQUtULEdBTFNBLEdBS1Q7QUFBQSxTQUpTSixLQUlULEdBSlNBLEtBSVQ7QUFBQSxTQUhTQyxNQUdULEdBSFNBLE1BR1Q7QUFBQSxTQUZTSSxRQUVULEdBRlNBLFFBRVQ7QUFBQSxTQURTQyxRQUNULEdBRFNBLFFBQ1Q7QUFBRSxHOzs7O01BR0tDLFEsR0FDcUI7QUFFOUIsc0JBS0U7QUFBQSxRQUpTVCxDQUlULHVFQUpxQixDQUlyQjtBQUFBLFFBSFNDLENBR1QsdUVBSHFCLENBR3JCO0FBQUEsUUFGU1MsQ0FFVCx1RUFGcUIsQ0FFckI7QUFBQSxRQURTQyxDQUNULHVFQURxQixDQUNyQjs7QUFBQTs7QUFBQSxTQUpTWCxDQUlULEdBSlNBLENBSVQ7QUFBQSxTQUhTQyxDQUdULEdBSFNBLENBR1Q7QUFBQSxTQUZTUyxDQUVULEdBRlNBLENBRVQ7QUFBQSxTQURTQyxDQUNULEdBRFNBLENBQ1Q7QUFBRSxHOzs7TUFHSUMsWTs7O2FBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7QUFBQUEsSUFBQUEsWSxDQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtBQUFBQSxJQUFBQSxZLENBQUFBLFk7S0FBQUEsWSw2QkFBQUEsWTs7TUFTQ0MsUyxHQUNxQjtBQUU5Qix1QkFJRTtBQUFBLFFBSFNiLENBR1QsdUVBSHFCLENBR3JCO0FBQUEsUUFGU0MsQ0FFVCx1RUFGcUIsQ0FFckI7QUFBQSxRQURTUyxDQUNULHVFQURxQixDQUNyQjs7QUFBQTs7QUFBQSxTQUhTVixDQUdULEdBSFNBLENBR1Q7QUFBQSxTQUZTQyxDQUVULEdBRlNBLENBRVQ7QUFBQSxTQURTUyxDQUNULEdBRFNBLENBQ1Q7QUFBRSxHOzs7O01BR0tJLFMsR0FDcUI7QUFFOUIsdUJBSUU7QUFBQSxRQUhTWixLQUdULHVFQUh5QixDQUd6QjtBQUFBLFFBRlNDLE1BRVQsdUVBRjBCLENBRTFCO0FBQUEsUUFEU1ksS0FDVCx1RUFEeUIsQ0FDekI7O0FBQUE7O0FBQUEsU0FIU2IsS0FHVCxHQUhTQSxLQUdUO0FBQUEsU0FGU0MsTUFFVCxHQUZTQSxNQUVUO0FBQUEsU0FEU1ksS0FDVCxHQURTQSxLQUNUO0FBQUUsRzs7OztNQUdLQyxnQixHQUNxQjtBQUU5Qiw4QkFJRTtBQUFBLFFBSFNDLFFBR1QsdUVBSDRCLENBRzVCO0FBQUEsUUFGU0MsY0FFVCx1RUFGa0MsQ0FFbEM7QUFBQSxRQURTQyxVQUNULHVFQUQ4QixDQUM5Qjs7QUFBQTs7QUFBQSxTQUhTRixRQUdULEdBSFNBLFFBR1Q7QUFBQSxTQUZTQyxjQUVULEdBRlNBLGNBRVQ7QUFBQSxTQURTQyxVQUNULEdBRFNBLFVBQ1Q7QUFBRSxHOzs7O01BR0tDLGMsR0FDcUI7QUFFOUIsNEJBTUU7QUFBQSxRQUxTQyxTQUtULHVFQUxxQixJQUFJTCxnQkFBSixFQUtyQjtBQUFBLFFBSlNNLFNBSVQsdUVBSnFCLElBQUlULFNBQUosRUFJckI7QUFBQSxRQUhTVSxTQUdULHVFQUhxQixJQUFJUCxnQkFBSixFQUdyQjtBQUFBLFFBRlNRLFNBRVQsdUVBRnFCLElBQUlYLFNBQUosRUFFckI7QUFBQSxRQURTWSxNQUNULHVFQURrQixJQUFJWCxTQUFKLEVBQ2xCOztBQUFBOztBQUFBLFNBTFNPLFNBS1QsR0FMU0EsU0FLVDtBQUFBLFNBSlNDLFNBSVQsR0FKU0EsU0FJVDtBQUFBLFNBSFNDLFNBR1QsR0FIU0EsU0FHVDtBQUFBLFNBRlNDLFNBRVQsR0FGU0EsU0FFVDtBQUFBLFNBRFNDLE1BQ1QsR0FEU0EsTUFDVDtBQUFFLEc7Ozs7TUFHS0Msb0IsR0FDcUI7QUFFOUIsa0NBTUU7QUFBQSxRQUxTQyxVQUtULHVFQUw4QixDQUs5QjtBQUFBLFFBSlNDLGFBSVQsdUVBSmlDLENBSWpDO0FBQUEsUUFIU0MsU0FHVCx1RUFIcUIsSUFBSWhCLFNBQUosRUFHckI7QUFBQSxRQUZTaUIsU0FFVCx1RUFGcUIsSUFBSWhCLFNBQUosRUFFckI7QUFBQSxRQURTaUIsU0FDVCx1RUFEcUIsSUFBSWYsZ0JBQUosRUFDckI7O0FBQUE7O0FBQUEsU0FMU1csVUFLVCxHQUxTQSxVQUtUO0FBQUEsU0FKU0MsYUFJVCxHQUpTQSxhQUlUO0FBQUEsU0FIU0MsU0FHVCxHQUhTQSxTQUdUO0FBQUEsU0FGU0MsU0FFVCxHQUZTQSxTQUVUO0FBQUEsU0FEU0MsU0FDVCxHQURTQSxTQUNUO0FBQUUsRzs7O01BR0lDLGE7OzthQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtBQUFBQSxJQUFBQSxhLENBQUFBLGE7QUFBQUEsSUFBQUEsYSxDQUFBQSxhO0FBQUFBLElBQUFBLGEsQ0FBQUEsYTtLQUFBQSxhLDhCQUFBQSxhOztNQVVDQyxhLEdBQ3FCO0FBRTlCLHlCQUNvQkMsSUFEcEIsRUFFb0JDLElBRnBCLEVBR29CQyxLQUhwQixFQUlvQkMsSUFKcEIsRUFLb0JDLFFBTHBCLEVBTW9CQyxRQU5wQixFQU9vQkMsVUFQcEIsRUFRb0JDLFlBUnBCLEVBU0U7QUFBQTs7QUFBQSxTQVJrQlAsSUFRbEIsR0FSa0JBLElBUWxCO0FBQUEsU0FQa0JDLElBT2xCLEdBUGtCQSxJQU9sQjtBQUFBLFNBTmtCQyxLQU1sQixHQU5rQkEsS0FNbEI7QUFBQSxTQUxrQkMsSUFLbEIsR0FMa0JBLElBS2xCO0FBQUEsU0FKa0JDLFFBSWxCLEdBSmtCQSxRQUlsQjtBQUFBLFNBSGtCQyxRQUdsQixHQUhrQkEsUUFHbEI7QUFBQSxTQUZrQkMsVUFFbEIsR0FGa0JBLFVBRWxCO0FBQUEsU0FEa0JDLFlBQ2xCLEdBRGtCQSxZQUNsQjtBQUFFLEc7Ozs7TUFHS0MsZSxHQUNxQjtBQUU5Qiw2QkFHRTtBQUFBLFFBRlNDLFVBRVQsdUVBRjhCLENBRTlCO0FBQUEsUUFEU0MsV0FDVCx1RUFEK0IsQ0FDL0I7O0FBQUE7O0FBQUEsU0FGU0QsVUFFVCxHQUZTQSxVQUVUO0FBQUEsU0FEU0MsV0FDVCxHQURTQSxXQUNUO0FBQUUsRzs7O0FBR0QsTUFBTUMsY0FBYyxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxDQUV4QyxJQUFJZCxhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNnQixJQUFqRCxFQUF1RCxLQUF2RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQUZ3QyxFQUl4QyxJQUFJZixhQUFKLENBQWtCLElBQWxCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCRCxhQUFhLENBQUNpQixLQUE1QyxFQUFtRCxJQUFuRCxFQUF5RCxLQUF6RCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxDQUp3QyxFQUt4QyxJQUFJaEIsYUFBSixDQUFrQixJQUFsQixFQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QkQsYUFBYSxDQUFDaUIsS0FBNUMsRUFBbUQsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsQ0FMd0MsRUFNeEMsSUFBSWhCLGFBQUosQ0FBa0IsS0FBbEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsRUFBK0JELGFBQWEsQ0FBQ2lCLEtBQTdDLEVBQW9ELElBQXBELEVBQTBELEtBQTFELEVBQWlFLEtBQWpFLEVBQXdFLEtBQXhFLENBTndDLEVBUXhDLElBQUloQixhQUFKLENBQWtCLElBQWxCLEVBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCRCxhQUFhLENBQUNpQixLQUE1QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxFQUF3RSxLQUF4RSxDQVJ3QyxFQVN4QyxJQUFJaEIsYUFBSixDQUFrQixNQUFsQixFQUEwQixDQUExQixFQUE2QixDQUE3QixFQUFnQ0QsYUFBYSxDQUFDa0IsS0FBOUMsRUFBcUQsS0FBckQsRUFBNEQsS0FBNUQsRUFBbUUsS0FBbkUsRUFBMEUsS0FBMUUsQ0FUd0MsRUFVeEMsSUFBSWpCLGFBQUosQ0FBa0IsTUFBbEIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsRUFBZ0NELGFBQWEsQ0FBQ21CLElBQTlDLEVBQW9ELEtBQXBELEVBQTJELEtBQTNELEVBQWtFLEtBQWxFLEVBQXlFLEtBQXpFLENBVndDLEVBV3hDLElBQUlsQixhQUFKLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCRCxhQUFhLENBQUNvQixHQUE3QyxFQUFrRCxLQUFsRCxFQUF5RCxLQUF6RCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxDQVh3QyxFQVl4QyxJQUFJbkIsYUFBSixDQUFrQixNQUFsQixFQUEwQixDQUExQixFQUE2QixDQUE3QixFQUFnQ0QsYUFBYSxDQUFDcUIsS0FBOUMsRUFBcUQsS0FBckQsRUFBNEQsS0FBNUQsRUFBbUUsS0FBbkUsRUFBMEUsS0FBMUUsQ0Fad0MsRUFheEMsSUFBSXBCLGFBQUosQ0FBa0IsT0FBbEIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsRUFBaUNELGFBQWEsQ0FBQ21CLElBQS9DLEVBQXFELEtBQXJELEVBQTRELEtBQTVELEVBQW1FLEtBQW5FLEVBQTBFLEtBQTFFLENBYndDLEVBY3hDLElBQUlsQixhQUFKLENBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDRCxhQUFhLENBQUNvQixHQUE5QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxFQUF3RSxLQUF4RSxDQWR3QyxFQWV4QyxJQUFJbkIsYUFBSixDQUFrQixNQUFsQixFQUEwQixDQUExQixFQUE2QixDQUE3QixFQUFnQ0QsYUFBYSxDQUFDcUIsS0FBOUMsRUFBcUQsS0FBckQsRUFBNEQsS0FBNUQsRUFBbUUsS0FBbkUsRUFBMEUsS0FBMUUsQ0Fmd0MsRUFnQnhDLElBQUlwQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNtQixJQUEvQyxFQUFxRCxLQUFyRCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQWhCd0MsRUFpQnhDLElBQUlsQixhQUFKLENBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDRCxhQUFhLENBQUNvQixHQUE5QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxFQUF3RSxLQUF4RSxDQWpCd0MsRUFtQnhDLElBQUluQixhQUFKLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCRCxhQUFhLENBQUNpQixLQUE3QyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQW5Cd0MsRUFvQnhDLElBQUloQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNrQixLQUEvQyxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXBCd0MsRUFxQnhDLElBQUlqQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNtQixJQUEvQyxFQUFxRCxLQUFyRCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQXJCd0MsRUFzQnhDLElBQUlsQixhQUFKLENBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDRCxhQUFhLENBQUNvQixHQUE5QyxFQUFtRCxLQUFuRCxFQUEwRCxLQUExRCxFQUFpRSxLQUFqRSxFQUF3RSxLQUF4RSxDQXRCd0MsRUF1QnhDLElBQUluQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNxQixLQUEvQyxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXZCd0MsRUF3QnhDLElBQUlwQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNtQixJQUFoRCxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXhCd0MsRUF5QnhDLElBQUlsQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNvQixHQUEvQyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQXpCd0MsRUEwQnhDLElBQUluQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNxQixLQUEvQyxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQTFCd0MsRUEyQnhDLElBQUlwQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNtQixJQUFoRCxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQTNCd0MsRUE0QnhDLElBQUlsQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNvQixHQUEvQyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQTVCd0MsRUE4QnhDLElBQUluQixhQUFKLENBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDRCxhQUFhLENBQUNpQixLQUE5QyxFQUFxRCxLQUFyRCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQTlCd0MsRUErQnhDLElBQUloQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNpQixLQUEvQyxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQS9Cd0MsRUFnQ3hDLElBQUloQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNrQixLQUFoRCxFQUF1RCxLQUF2RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQWhDd0MsRUFpQ3hDLElBQUlqQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNtQixJQUFoRCxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQWpDd0MsRUFrQ3hDLElBQUlsQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNvQixHQUEvQyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQWxDd0MsRUFtQ3hDLElBQUluQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNxQixLQUFoRCxFQUF1RCxLQUF2RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQW5Dd0MsRUFvQ3hDLElBQUlwQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNtQixJQUFqRCxFQUF1RCxLQUF2RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQXBDd0MsRUFxQ3hDLElBQUlsQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNvQixHQUFoRCxFQUFxRCxLQUFyRCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQXJDd0MsRUFzQ3hDLElBQUluQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLEVBQTVCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNxQixLQUFqRCxFQUF3RCxLQUF4RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQXRDd0MsRUF1Q3hDLElBQUlwQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLEVBQTdCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNtQixJQUFsRCxFQUF3RCxLQUF4RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQXZDd0MsRUF3Q3hDLElBQUlsQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLEVBQTVCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNvQixHQUFqRCxFQUFzRCxLQUF0RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXhDd0MsRUEwQ3hDLElBQUluQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNpQixLQUEvQyxFQUFzRCxJQUF0RCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQTFDd0MsRUEyQ3hDLElBQUloQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNpQixLQUEvQyxFQUFzRCxJQUF0RCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQTNDd0MsRUE0Q3hDLElBQUloQixhQUFKLENBQWtCLFVBQWxCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNpQixLQUFsRCxFQUF5RCxJQUF6RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQTVDd0MsRUE2Q3hDLElBQUloQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNrQixLQUFqRCxFQUF3RCxJQUF4RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQTdDd0MsRUE4Q3hDLElBQUlqQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNtQixJQUFqRCxFQUF1RCxJQUF2RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQTlDd0MsRUErQ3hDLElBQUlsQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNvQixHQUFoRCxFQUFxRCxJQUFyRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQS9Dd0MsRUFnRHhDLElBQUluQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNxQixLQUFqRCxFQUF3RCxJQUF4RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQWhEd0MsRUFpRHhDLElBQUlwQixhQUFKLENBQWtCLFVBQWxCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNtQixJQUFsRCxFQUF3RCxJQUF4RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQWpEd0MsRUFrRHhDLElBQUlsQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNvQixHQUFqRCxFQUFzRCxJQUF0RCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQWxEd0MsRUFtRHhDLElBQUluQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLEVBQTdCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNxQixLQUFsRCxFQUF5RCxJQUF6RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQW5Ed0MsRUFvRHhDLElBQUlwQixhQUFKLENBQWtCLFVBQWxCLEVBQThCLEVBQTlCLEVBQWtDLENBQWxDLEVBQXFDRCxhQUFhLENBQUNtQixJQUFuRCxFQUF5RCxJQUF6RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQXBEd0MsRUFxRHhDLElBQUlsQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLEVBQTdCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNvQixHQUFsRCxFQUF1RCxJQUF2RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXJEd0MsRUF1RHhDLElBQUluQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNpQixLQUFoRCxFQUF1RCxLQUF2RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQXZEd0MsRUF3RHhDLElBQUloQixhQUFKLENBQWtCLFlBQWxCLEVBQWdDLENBQWhDLEVBQW1DLENBQW5DLEVBQXNDRCxhQUFhLENBQUNxQixLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxFQUFnRixLQUFoRixDQXhEd0MsRUF5RHhDLElBQUlwQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNpQixLQUFoRCxFQUF1RCxJQUF2RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQXpEd0MsRUEwRHhDLElBQUloQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNpQixLQUEvQyxFQUFzRCxJQUF0RCxFQUE0RCxLQUE1RCxFQUFtRSxLQUFuRSxFQUEwRSxLQUExRSxDQTFEd0MsRUEyRHhDLElBQUloQixhQUFKLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLEVBQWdDLENBQWhDLEVBQW1DRCxhQUFhLENBQUNpQixLQUFqRCxFQUF3RCxJQUF4RCxFQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxDQTNEd0MsRUE0RHhDLElBQUloQixhQUFKLENBQWtCLFdBQWxCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDRCxhQUFhLENBQUNtQixJQUFuRCxFQUF5RCxJQUF6RCxFQUErRCxLQUEvRCxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxDQTVEd0MsRUE2RHhDLElBQUlsQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNxQixLQUFoRCxFQUF1RCxJQUF2RCxFQUE2RCxLQUE3RCxFQUFvRSxLQUFwRSxFQUEyRSxLQUEzRSxDQTdEd0MsRUErRHhDLElBQUlwQixhQUFKLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCRCxhQUFhLENBQUNtQixJQUE3QyxFQUFtRCxLQUFuRCxFQUEwRCxJQUExRCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxDQS9Ed0MsRUFnRXhDLElBQUlsQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNtQixJQUEvQyxFQUFxRCxLQUFyRCxFQUE0RCxJQUE1RCxFQUFrRSxJQUFsRSxFQUF3RSxLQUF4RSxDQWhFd0MsRUFpRXhDLElBQUlsQixhQUFKLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCRCxhQUFhLENBQUNtQixJQUE3QyxFQUFtRCxLQUFuRCxFQUEwRCxJQUExRCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxDQWpFd0MsRUFrRXhDLElBQUlsQixhQUFKLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDRCxhQUFhLENBQUNtQixJQUEvQyxFQUFxRCxLQUFyRCxFQUE0RCxJQUE1RCxFQUFrRSxJQUFsRSxFQUF3RSxLQUF4RSxDQWxFd0MsRUFtRXhDLElBQUlsQixhQUFKLENBQWtCLE1BQWxCLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLEVBQWdDRCxhQUFhLENBQUNxQixLQUE5QyxFQUFxRCxLQUFyRCxFQUE0RCxJQUE1RCxFQUFrRSxLQUFsRSxFQUF5RSxLQUF6RSxDQW5Fd0MsRUFvRXhDLElBQUlwQixhQUFKLENBQWtCLFFBQWxCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDRCxhQUFhLENBQUNxQixLQUFoRCxFQUF1RCxLQUF2RCxFQUE4RCxJQUE5RCxFQUFvRSxJQUFwRSxFQUEwRSxLQUExRSxDQXBFd0MsRUFzRXhDLElBQUlwQixhQUFKLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCRCxhQUFhLENBQUNpQixLQUE3QyxFQUFvRCxLQUFwRCxFQUEyRCxLQUEzRCxFQUFrRSxLQUFsRSxFQUF5RSxJQUF6RSxDQXRFd0MsRUF1RXhDLElBQUloQixhQUFKLENBQWtCLFdBQWxCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDRCxhQUFhLENBQUNpQixLQUFuRCxFQUEwRCxJQUExRCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxFQUE4RSxJQUE5RSxDQXZFd0MsRUF3RXhDLElBQUloQixhQUFKLENBQWtCLFVBQWxCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DRCxhQUFhLENBQUNpQixLQUFsRCxFQUF5RCxLQUF6RCxFQUFnRSxLQUFoRSxFQUF1RSxLQUF2RSxFQUE4RSxJQUE5RSxDQXhFd0MsRUF5RXhDLElBQUloQixhQUFKLENBQWtCLGdCQUFsQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQ0QsYUFBYSxDQUFDaUIsS0FBeEQsRUFBK0QsSUFBL0QsRUFBcUUsS0FBckUsRUFBNEUsS0FBNUUsRUFBbUYsSUFBbkYsQ0F6RXdDLEVBMEV4QyxJQUFJaEIsYUFBSixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQkQsYUFBYSxDQUFDaUIsS0FBN0MsRUFBb0QsSUFBcEQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsSUFBeEUsQ0ExRXdDLEVBMkV4QyxJQUFJaEIsYUFBSixDQUFrQixVQUFsQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQ0QsYUFBYSxDQUFDaUIsS0FBbEQsRUFBeUQsSUFBekQsRUFBK0QsS0FBL0QsRUFBc0UsS0FBdEUsRUFBNkUsSUFBN0UsQ0EzRXdDLEVBNEV4QyxJQUFJaEIsYUFBSixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQkQsYUFBYSxDQUFDaUIsS0FBN0MsRUFBb0QsSUFBcEQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsSUFBeEUsQ0E1RXdDLEVBNkV4QyxJQUFJaEIsYUFBSixDQUFrQixVQUFsQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQ0QsYUFBYSxDQUFDaUIsS0FBbEQsRUFBeUQsSUFBekQsRUFBK0QsS0FBL0QsRUFBc0UsS0FBdEUsRUFBNkUsSUFBN0UsQ0E3RXdDLEVBOEV4QyxJQUFJaEIsYUFBSixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQkQsYUFBYSxDQUFDaUIsS0FBN0MsRUFBb0QsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsSUFBekUsQ0E5RXdDLEVBK0V4QyxJQUFJaEIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDa0IsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0EvRXdDLEVBZ0Z4QyxJQUFJakIsYUFBSixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQkQsYUFBYSxDQUFDaUIsS0FBN0MsRUFBb0QsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsSUFBekUsQ0FoRndDLEVBaUZ4QyxJQUFJaEIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDa0IsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0FqRndDLEVBa0Z4QyxJQUFJakIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDc0IsTUFBbkQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0FsRndDLEVBbUZ4QyxJQUFJckIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDcUIsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0FuRndDLEVBb0Z4QyxJQUFJcEIsYUFBSixDQUFrQixLQUFsQixFQUF5QixDQUF6QixFQUE0QixDQUE1QixFQUErQkQsYUFBYSxDQUFDaUIsS0FBN0MsRUFBb0QsSUFBcEQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsSUFBeEUsQ0FwRndDLEVBcUZ4QyxJQUFJaEIsYUFBSixDQUFrQixVQUFsQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQ0QsYUFBYSxDQUFDaUIsS0FBbEQsRUFBeUQsSUFBekQsRUFBK0QsS0FBL0QsRUFBc0UsS0FBdEUsRUFBNkUsSUFBN0UsQ0FyRndDLEVBdUZ4QyxJQUFJaEIsYUFBSixDQUFrQixVQUFsQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQ0QsYUFBYSxDQUFDaUIsS0FBbEQsRUFBeUQsS0FBekQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsSUFBOUUsQ0F2RndDLEVBd0Z4QyxJQUFJaEIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDaUIsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0F4RndDLEVBeUZ4QyxJQUFJaEIsYUFBSixDQUFrQixZQUFsQixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQ0QsYUFBYSxDQUFDaUIsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0F6RndDLEVBMEZ4QyxJQUFJaEIsYUFBSixDQUFrQixjQUFsQixFQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxFQUF3Q0QsYUFBYSxDQUFDaUIsS0FBdEQsRUFBNkQsSUFBN0QsRUFBbUUsS0FBbkUsRUFBMEUsS0FBMUUsRUFBaUYsSUFBakYsQ0ExRndDLEVBMkZ4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0EzRndDLEVBNEZ4QyxJQUFJaEIsYUFBSixDQUFrQixZQUFsQixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQ0QsYUFBYSxDQUFDaUIsS0FBcEQsRUFBMkQsSUFBM0QsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0E1RndDLEVBNkZ4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0E3RndDLEVBOEZ4QyxJQUFJaEIsYUFBSixDQUFrQixTQUFsQixFQUE2QixDQUE3QixFQUFnQyxDQUFoQyxFQUFtQ0QsYUFBYSxDQUFDaUIsS0FBakQsRUFBd0QsS0FBeEQsRUFBK0QsS0FBL0QsRUFBc0UsS0FBdEUsRUFBNkUsSUFBN0UsQ0E5RndDLEVBK0Z4QyxJQUFJaEIsYUFBSixDQUFrQixXQUFsQixFQUErQixDQUEvQixFQUFrQyxDQUFsQyxFQUFxQ0QsYUFBYSxDQUFDa0IsS0FBbkQsRUFBMEQsS0FBMUQsRUFBaUUsS0FBakUsRUFBd0UsS0FBeEUsRUFBK0UsSUFBL0UsQ0EvRndDLEVBZ0d4QyxJQUFJakIsYUFBSixDQUFrQixVQUFsQixFQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQ0QsYUFBYSxDQUFDaUIsS0FBbEQsRUFBeUQsS0FBekQsRUFBZ0UsS0FBaEUsRUFBdUUsS0FBdkUsRUFBOEUsSUFBOUUsQ0FoR3dDLEVBaUd4QyxJQUFJaEIsYUFBSixDQUFrQixZQUFsQixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQ0QsYUFBYSxDQUFDa0IsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0FqR3dDLEVBbUd4QyxJQUFJakIsYUFBSixDQUFrQixZQUFsQixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQ0QsYUFBYSxDQUFDaUIsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0FuR3dDLEVBb0d4QyxJQUFJaEIsYUFBSixDQUFrQixhQUFsQixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1Q0QsYUFBYSxDQUFDaUIsS0FBckQsRUFBNEQsSUFBNUQsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0FwR3dDLEVBcUd4QyxJQUFJaEIsYUFBSixDQUFrQixZQUFsQixFQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQ0QsYUFBYSxDQUFDaUIsS0FBcEQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0FyR3dDLEVBc0d4QyxJQUFJaEIsYUFBSixDQUFrQixhQUFsQixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1Q0QsYUFBYSxDQUFDaUIsS0FBckQsRUFBNEQsSUFBNUQsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0F0R3dDLEVBdUd4QyxJQUFJaEIsYUFBSixDQUFrQixhQUFsQixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1Q0QsYUFBYSxDQUFDaUIsS0FBckQsRUFBNEQsSUFBNUQsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0F2R3dDLEVBd0d4QyxJQUFJaEIsYUFBSixDQUFrQixhQUFsQixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1Q0QsYUFBYSxDQUFDaUIsS0FBckQsRUFBNEQsSUFBNUQsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsRUFBZ0YsSUFBaEYsQ0F4R3dDLEVBMEd4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0ExR3dDLEVBMkd4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0EzR3dDLEVBNEd4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0E1R3dDLEVBNkd4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0E3R3dDLEVBOEd4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0E5R3dDLEVBK0d4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0EvR3dDLEVBZ0h4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0FoSHdDLEVBaUh4QyxJQUFJaEIsYUFBSixDQUFrQixlQUFsQixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QyxFQUF5Q0QsYUFBYSxDQUFDaUIsS0FBdkQsRUFBOEQsSUFBOUQsRUFBb0UsS0FBcEUsRUFBMkUsS0FBM0UsRUFBa0YsSUFBbEYsQ0FqSHdDLEVBa0h4QyxJQUFJaEIsYUFBSixDQUFrQixnQkFBbEIsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMENELGFBQWEsQ0FBQ2lCLEtBQXhELEVBQStELElBQS9ELEVBQXFFLEtBQXJFLEVBQTRFLEtBQTVFLEVBQW1GLElBQW5GLENBbEh3QyxFQW1IeEMsSUFBSWhCLGFBQUosQ0FBa0IsZ0JBQWxCLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDRCxhQUFhLENBQUNpQixLQUF4RCxFQUErRCxJQUEvRCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxFQUFtRixJQUFuRixDQW5Id0MsRUFvSHhDLElBQUloQixhQUFKLENBQWtCLGdCQUFsQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQ0QsYUFBYSxDQUFDaUIsS0FBeEQsRUFBK0QsSUFBL0QsRUFBcUUsS0FBckUsRUFBNEUsS0FBNUUsRUFBbUYsSUFBbkYsQ0FwSHdDLEVBcUh4QyxJQUFJaEIsYUFBSixDQUFrQixpQkFBbEIsRUFBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkNELGFBQWEsQ0FBQ2lCLEtBQXpELEVBQWdFLElBQWhFLEVBQXNFLEtBQXRFLEVBQTZFLEtBQTdFLEVBQW9GLElBQXBGLENBckh3QyxFQXNIeEMsSUFBSWhCLGFBQUosQ0FBa0IsaUJBQWxCLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLEVBQTJDRCxhQUFhLENBQUNpQixLQUF6RCxFQUFnRSxJQUFoRSxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxFQUFvRixJQUFwRixDQXRId0MsRUF1SHhDLElBQUloQixhQUFKLENBQWtCLGlCQUFsQixFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxFQUEyQ0QsYUFBYSxDQUFDaUIsS0FBekQsRUFBZ0UsSUFBaEUsRUFBc0UsS0FBdEUsRUFBNkUsS0FBN0UsRUFBb0YsSUFBcEYsQ0F2SHdDLEVBeUh4QyxJQUFJaEIsYUFBSixDQUFrQixnQkFBbEIsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMENELGFBQWEsQ0FBQ2lCLEtBQXhELEVBQStELElBQS9ELEVBQXFFLEtBQXJFLEVBQTRFLEtBQTVFLEVBQW1GLElBQW5GLENBekh3QyxFQTBIeEMsSUFBSWhCLGFBQUosQ0FBa0IsZ0JBQWxCLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDRCxhQUFhLENBQUNpQixLQUF4RCxFQUErRCxJQUEvRCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxFQUFtRixJQUFuRixDQTFId0MsRUEySHhDLElBQUloQixhQUFKLENBQWtCLGdCQUFsQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQ0QsYUFBYSxDQUFDaUIsS0FBeEQsRUFBK0QsSUFBL0QsRUFBcUUsS0FBckUsRUFBNEUsS0FBNUUsRUFBbUYsSUFBbkYsQ0EzSHdDLEVBNEh4QyxJQUFJaEIsYUFBSixDQUFrQixnQkFBbEIsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMENELGFBQWEsQ0FBQ2lCLEtBQXhELEVBQStELElBQS9ELEVBQXFFLEtBQXJFLEVBQTRFLEtBQTVFLEVBQW1GLElBQW5GLENBNUh3QyxFQTZIeEMsSUFBSWhCLGFBQUosQ0FBa0IsZ0JBQWxCLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDRCxhQUFhLENBQUNpQixLQUF4RCxFQUErRCxJQUEvRCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxFQUFtRixJQUFuRixDQTdId0MsRUE4SHhDLElBQUloQixhQUFKLENBQWtCLGdCQUFsQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQ0QsYUFBYSxDQUFDaUIsS0FBeEQsRUFBK0QsSUFBL0QsRUFBcUUsS0FBckUsRUFBNEUsS0FBNUUsRUFBbUYsSUFBbkYsQ0E5SHdDLEVBK0h4QyxJQUFJaEIsYUFBSixDQUFrQixnQkFBbEIsRUFBb0MsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMENELGFBQWEsQ0FBQ2lCLEtBQXhELEVBQStELElBQS9ELEVBQXFFLEtBQXJFLEVBQTRFLEtBQTVFLEVBQW1GLElBQW5GLENBL0h3QyxFQWdJeEMsSUFBSWhCLGFBQUosQ0FBa0IsZ0JBQWxCLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDRCxhQUFhLENBQUNpQixLQUF4RCxFQUErRCxJQUEvRCxFQUFxRSxLQUFyRSxFQUE0RSxLQUE1RSxFQUFtRixJQUFuRixDQWhJd0MsRUFpSXhDLElBQUloQixhQUFKLENBQWtCLGlCQUFsQixFQUFxQyxDQUFyQyxFQUF3QyxDQUF4QyxFQUEyQ0QsYUFBYSxDQUFDaUIsS0FBekQsRUFBZ0UsSUFBaEUsRUFBc0UsS0FBdEUsRUFBNkUsS0FBN0UsRUFBb0YsSUFBcEYsQ0FqSXdDLEVBa0l4QyxJQUFJaEIsYUFBSixDQUFrQixpQkFBbEIsRUFBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsRUFBMkNELGFBQWEsQ0FBQ2lCLEtBQXpELEVBQWdFLElBQWhFLEVBQXNFLEtBQXRFLEVBQTZFLEtBQTdFLEVBQW9GLElBQXBGLENBbEl3QyxFQW1JeEMsSUFBSWhCLGFBQUosQ0FBa0IsaUJBQWxCLEVBQXFDLENBQXJDLEVBQXdDLENBQXhDLEVBQTJDRCxhQUFhLENBQUNpQixLQUF6RCxFQUFnRSxJQUFoRSxFQUFzRSxLQUF0RSxFQUE2RSxLQUE3RSxFQUFvRixJQUFwRixDQW5Jd0MsRUFvSXhDLElBQUloQixhQUFKLENBQWtCLGtCQUFsQixFQUFzQyxDQUF0QyxFQUF5QyxDQUF6QyxFQUE0Q0QsYUFBYSxDQUFDaUIsS0FBMUQsRUFBaUUsSUFBakUsRUFBdUUsS0FBdkUsRUFBOEUsS0FBOUUsRUFBcUYsSUFBckYsQ0FwSXdDLEVBcUl4QyxJQUFJaEIsYUFBSixDQUFrQixrQkFBbEIsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBekMsRUFBNENELGFBQWEsQ0FBQ2lCLEtBQTFELEVBQWlFLElBQWpFLEVBQXVFLEtBQXZFLEVBQThFLEtBQTlFLEVBQXFGLElBQXJGLENBckl3QyxFQXNJeEMsSUFBSWhCLGFBQUosQ0FBa0Isa0JBQWxCLEVBQXNDLENBQXRDLEVBQXlDLENBQXpDLEVBQTRDRCxhQUFhLENBQUNpQixLQUExRCxFQUFpRSxJQUFqRSxFQUF1RSxLQUF2RSxFQUE4RSxLQUE5RSxFQUFxRixJQUFyRixDQXRJd0MsQ0FBZCxDQUF2QjtBQXlJUDs7Ozs7Ozs7Ozs7QUFRTyxXQUFTTSxhQUFULENBQXdCQyxNQUF4QixFQUEyQ3RELEtBQTNDLEVBQTBEQyxNQUExRCxFQUEwRVksS0FBMUUsRUFBaUc7QUFFcEcsUUFBSSxDQUFDOEIsY0FBYyxDQUFDVyxNQUFELENBQWQsQ0FBdUJmLFlBQTVCLEVBQTBDO0FBQ3RDLGFBQVF2QyxLQUFLLEdBQUdDLE1BQVIsR0FBaUJZLEtBQWpCLEdBQXlCOEIsY0FBYyxDQUFDVyxNQUFELENBQWQsQ0FBdUJyQixJQUF4RDtBQUNILEtBRkQsTUFFTztBQUNILGNBQVFxQixNQUFSO0FBQ0ksYUFBS3ZGLFNBQVMsQ0FBQ3dGLEdBQWY7QUFDQSxhQUFLeEYsU0FBUyxDQUFDeUYsU0FBZjtBQUNBLGFBQUt6RixTQUFTLENBQUMwRixRQUFmO0FBQ0EsYUFBSzFGLFNBQVMsQ0FBQzJGLGNBQWY7QUFDSSxpQkFBT0MsSUFBSSxDQUFDQyxJQUFMLENBQVU1RCxLQUFLLEdBQUcsQ0FBbEIsSUFBdUIyRCxJQUFJLENBQUNDLElBQUwsQ0FBVTNELE1BQU0sR0FBRyxDQUFuQixDQUF2QixHQUErQyxDQUEvQyxHQUFtRFksS0FBMUQ7O0FBQ0osYUFBSzlDLFNBQVMsQ0FBQzhGLEdBQWY7QUFDQSxhQUFLOUYsU0FBUyxDQUFDK0YsUUFBZjtBQUNBLGFBQUsvRixTQUFTLENBQUNnRyxHQUFmO0FBQ0EsYUFBS2hHLFNBQVMsQ0FBQ2lHLFFBQWY7QUFDQSxhQUFLakcsU0FBUyxDQUFDa0csR0FBZjtBQUNBLGFBQUtsRyxTQUFTLENBQUNtRyxTQUFmO0FBQ0EsYUFBS25HLFNBQVMsQ0FBQ29HLFNBQWY7QUFDQSxhQUFLcEcsU0FBUyxDQUFDcUcsU0FBZjtBQUNBLGFBQUtyRyxTQUFTLENBQUNzRyxHQUFmO0FBQ0EsYUFBS3RHLFNBQVMsQ0FBQ3VHLFFBQWY7QUFDSSxpQkFBT1gsSUFBSSxDQUFDQyxJQUFMLENBQVU1RCxLQUFLLEdBQUcsQ0FBbEIsSUFBdUIyRCxJQUFJLENBQUNDLElBQUwsQ0FBVTNELE1BQU0sR0FBRyxDQUFuQixDQUF2QixHQUErQyxFQUEvQyxHQUFvRFksS0FBM0Q7O0FBQ0osYUFBSzlDLFNBQVMsQ0FBQ3dHLEdBQWY7QUFDQSxhQUFLeEcsU0FBUyxDQUFDeUcsU0FBZjtBQUNJLGlCQUFPYixJQUFJLENBQUNDLElBQUwsQ0FBVTVELEtBQUssR0FBRyxDQUFsQixJQUF1QjJELElBQUksQ0FBQ0MsSUFBTCxDQUFVM0QsTUFBTSxHQUFHLENBQW5CLENBQXZCLEdBQStDLEVBQS9DLEdBQW9EWSxLQUEzRDs7QUFFSixhQUFLOUMsU0FBUyxDQUFDMEcsUUFBZjtBQUNBLGFBQUsxRyxTQUFTLENBQUMyRyxTQUFmO0FBQ0EsYUFBSzNHLFNBQVMsQ0FBQzRHLFVBQWY7QUFDQSxhQUFLNUcsU0FBUyxDQUFDNkcsWUFBZjtBQUNBLGFBQUs3RyxTQUFTLENBQUM4RyxPQUFmO0FBQ0EsYUFBSzlHLFNBQVMsQ0FBQytHLFNBQWY7QUFDSSxpQkFBT25CLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsQ0FBL0MsR0FBbURZLEtBQTFEOztBQUNKLGFBQUs5QyxTQUFTLENBQUNnSCxVQUFmO0FBQ0EsYUFBS2hILFNBQVMsQ0FBQ2lILGFBQWY7QUFDQSxhQUFLakgsU0FBUyxDQUFDa0gsUUFBZjtBQUNBLGFBQUtsSCxTQUFTLENBQUNtSCxVQUFmO0FBQ0ksaUJBQU92QixJQUFJLENBQUNDLElBQUwsQ0FBVTVELEtBQUssR0FBRyxDQUFsQixJQUF1QjJELElBQUksQ0FBQ0MsSUFBTCxDQUFVM0QsTUFBTSxHQUFHLENBQW5CLENBQXZCLEdBQStDLEVBQS9DLEdBQW9EWSxLQUEzRDs7QUFFSixhQUFLOUMsU0FBUyxDQUFDb0gsVUFBZjtBQUNBLGFBQUtwSCxTQUFTLENBQUNxSCxXQUFmO0FBQ0EsYUFBS3JILFNBQVMsQ0FBQ3NILFdBQWY7QUFDSSxpQkFBTzFCLElBQUksQ0FBQ0MsSUFBTCxDQUFVRCxJQUFJLENBQUMyQixHQUFMLENBQVN0RixLQUFULEVBQWdCLEVBQWhCLElBQXNCMkQsSUFBSSxDQUFDMkIsR0FBTCxDQUFTckYsTUFBVCxFQUFpQixDQUFqQixDQUF0QixHQUE0QyxDQUF0RCxJQUEyRFksS0FBbEU7O0FBQ0osYUFBSzlDLFNBQVMsQ0FBQ3dILFVBQWY7QUFDQSxhQUFLeEgsU0FBUyxDQUFDeUgsV0FBZjtBQUNBLGFBQUt6SCxTQUFTLENBQUMwSCxXQUFmO0FBQ0ksaUJBQU85QixJQUFJLENBQUNDLElBQUwsQ0FBVUQsSUFBSSxDQUFDMkIsR0FBTCxDQUFTdEYsS0FBVCxFQUFnQixDQUFoQixJQUFxQjJELElBQUksQ0FBQzJCLEdBQUwsQ0FBU3JGLE1BQVQsRUFBaUIsQ0FBakIsQ0FBckIsR0FBMkMsQ0FBckQsSUFBMERZLEtBQWpFOztBQUVKLGFBQUs5QyxTQUFTLENBQUMySCxhQUFmO0FBQ0EsYUFBSzNILFNBQVMsQ0FBQzRILGNBQWY7QUFDSSxpQkFBT2hDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUM2SCxhQUFmO0FBQ0EsYUFBSzdILFNBQVMsQ0FBQzhILGNBQWY7QUFDSSxpQkFBT2xDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUMrSCxhQUFmO0FBQ0EsYUFBSy9ILFNBQVMsQ0FBQ2dJLGNBQWY7QUFDSSxpQkFBT3BDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUNpSSxhQUFmO0FBQ0EsYUFBS2pJLFNBQVMsQ0FBQ2tJLGNBQWY7QUFDSSxpQkFBT3RDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUNtSSxhQUFmO0FBQ0EsYUFBS25JLFNBQVMsQ0FBQ29JLGNBQWY7QUFDSSxpQkFBT3hDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUNxSSxhQUFmO0FBQ0EsYUFBS3JJLFNBQVMsQ0FBQ3NJLGNBQWY7QUFDSSxpQkFBTzFDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUN1SSxhQUFmO0FBQ0EsYUFBS3ZJLFNBQVMsQ0FBQ3dJLGNBQWY7QUFDSSxpQkFBTzVDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUN5SSxhQUFmO0FBQ0EsYUFBS3pJLFNBQVMsQ0FBQzBJLGNBQWY7QUFDSSxpQkFBTzlDLElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLENBQWxCLElBQXVCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBdkIsR0FBK0MsRUFBL0MsR0FBb0RZLEtBQTNEOztBQUNKLGFBQUs5QyxTQUFTLENBQUMySSxjQUFmO0FBQ0EsYUFBSzNJLFNBQVMsQ0FBQzRJLGVBQWY7QUFDSSxpQkFBT2hELElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLEVBQWxCLElBQXdCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBeEIsR0FBZ0QsRUFBaEQsR0FBcURZLEtBQTVEOztBQUNKLGFBQUs5QyxTQUFTLENBQUM2SSxjQUFmO0FBQ0EsYUFBSzdJLFNBQVMsQ0FBQzhJLGVBQWY7QUFDSSxpQkFBT2xELElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLEVBQWxCLElBQXdCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBeEIsR0FBZ0QsRUFBaEQsR0FBcURZLEtBQTVEOztBQUNKLGFBQUs5QyxTQUFTLENBQUMrSSxjQUFmO0FBQ0EsYUFBSy9JLFNBQVMsQ0FBQ2dKLGVBQWY7QUFDSSxpQkFBT3BELElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLEVBQWxCLElBQXdCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsQ0FBbkIsQ0FBeEIsR0FBZ0QsRUFBaEQsR0FBcURZLEtBQTVEOztBQUNKLGFBQUs5QyxTQUFTLENBQUNpSixlQUFmO0FBQ0EsYUFBS2pKLFNBQVMsQ0FBQ2tKLGdCQUFmO0FBQ0ksaUJBQU90RCxJQUFJLENBQUNDLElBQUwsQ0FBVTVELEtBQUssR0FBRyxFQUFsQixJQUF3QjJELElBQUksQ0FBQ0MsSUFBTCxDQUFVM0QsTUFBTSxHQUFHLEVBQW5CLENBQXhCLEdBQWlELEVBQWpELEdBQXNEWSxLQUE3RDs7QUFDSixhQUFLOUMsU0FBUyxDQUFDbUosZUFBZjtBQUNBLGFBQUtuSixTQUFTLENBQUNvSixnQkFBZjtBQUNJLGlCQUFPeEQsSUFBSSxDQUFDQyxJQUFMLENBQVU1RCxLQUFLLEdBQUcsRUFBbEIsSUFBd0IyRCxJQUFJLENBQUNDLElBQUwsQ0FBVTNELE1BQU0sR0FBRyxFQUFuQixDQUF4QixHQUFpRCxFQUFqRCxHQUFzRFksS0FBN0Q7O0FBQ0osYUFBSzlDLFNBQVMsQ0FBQ3FKLGVBQWY7QUFDQSxhQUFLckosU0FBUyxDQUFDc0osZ0JBQWY7QUFDSSxpQkFBTzFELElBQUksQ0FBQ0MsSUFBTCxDQUFVNUQsS0FBSyxHQUFHLEVBQWxCLElBQXdCMkQsSUFBSSxDQUFDQyxJQUFMLENBQVUzRCxNQUFNLEdBQUcsRUFBbkIsQ0FBeEIsR0FBaUQsRUFBakQsR0FBc0RZLEtBQTdEOztBQUVKO0FBQVM7QUFDTCxtQkFBTyxDQUFQO0FBQ0g7QUF4Rkw7QUEwRkg7QUFDSjtBQUVEOzs7Ozs7Ozs7OztBQVNPLFdBQVN5RyxvQkFBVCxDQUNIaEUsTUFERyxFQUNnQnRELEtBRGhCLEVBQytCQyxNQUQvQixFQUVIWSxLQUZHLEVBRVkwRyxJQUZaLEVBRWtDO0FBRXJDLFFBQUl0RixJQUFJLEdBQUcsQ0FBWDs7QUFFQSxTQUFLLElBQUl1RixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxJQUFwQixFQUEwQixFQUFFQyxDQUE1QixFQUErQjtBQUMzQnZGLE1BQUFBLElBQUksSUFBSW9CLGFBQWEsQ0FBQ0MsTUFBRCxFQUFTdEQsS0FBVCxFQUFnQkMsTUFBaEIsRUFBd0JZLEtBQXhCLENBQXJCO0FBQ0FiLE1BQUFBLEtBQUssR0FBRzJELElBQUksQ0FBQzJCLEdBQUwsQ0FBU3RGLEtBQUssSUFBSSxDQUFsQixFQUFxQixDQUFyQixDQUFSO0FBQ0FDLE1BQUFBLE1BQU0sR0FBRzBELElBQUksQ0FBQzJCLEdBQUwsQ0FBU3JGLE1BQU0sSUFBSSxDQUFuQixFQUFzQixDQUF0QixDQUFUO0FBQ0g7O0FBRUQsV0FBT2dDLElBQVA7QUFDSDs7QUFFRCxNQUFNd0YsVUFBVSxHQUFHLENBQ2YsQ0FEZSxFQUNYO0FBQ0osR0FGZSxFQUVYO0FBQ0osR0FIZSxFQUdYO0FBQ0osSUFKZSxFQUlYO0FBQ0osSUFMZSxFQUtYO0FBQ0osR0FOZSxFQU1YO0FBQ0osR0FQZSxFQU9YO0FBQ0osSUFSZSxFQVFYO0FBQ0osSUFUZSxFQVNYO0FBQ0osR0FWZSxFQVVYO0FBQ0osR0FYZSxFQVdYO0FBQ0osSUFaZSxFQVlYO0FBQ0osSUFiZSxFQWFYO0FBQ0osR0FkZSxFQWNYO0FBQ0osR0FmZSxFQWVYO0FBQ0osSUFoQmUsRUFnQlg7QUFDSixJQWpCZSxFQWlCWDtBQUNKLElBbEJlLEVBa0JYO0FBQ0osSUFuQmUsRUFtQlg7QUFDSixJQXBCZSxFQW9CWDtBQUNKLElBckJlLEVBcUJYO0FBQ0osSUF0QmUsRUFzQlg7QUFDSixJQXZCZSxFQXVCWDtBQUNKLElBeEJlLEVBd0JYO0FBQ0osSUF6QmUsRUF5Qlg7QUFDSixJQTFCZSxFQTBCWDtBQUNKLEdBM0JlLEVBMkJYO0FBQ0osR0E1QmUsRUE0Qlg7QUFDSixHQTdCZSxFQTZCWDtBQUNKLEdBOUJlLEVBOEJYO0FBQ0osR0EvQmUsRUErQlg7QUFDSixHQWhDZSxDQWdDWDtBQWhDVyxHQUFuQjtBQW1DQTs7Ozs7O0FBS08sV0FBU0MsY0FBVCxDQUF5QnZGLElBQXpCLEVBQWdEO0FBQ25ELFdBQU9zRixVQUFVLENBQUN0RixJQUFELENBQVYsSUFBb0IsQ0FBM0I7QUFDSDs7QUFFTSxXQUFTd0Ysd0JBQVQsQ0FBbUNDLElBQW5DLEVBQStFO0FBQ2xGLFFBQU1DLE1BQU0sR0FBR0QsSUFBSSxDQUFDM0YsSUFBTCxHQUFZMkYsSUFBSSxDQUFDMUYsS0FBaEM7O0FBQ0EsWUFBUTBGLElBQUksQ0FBQ3pGLElBQWI7QUFDSSxXQUFLTCxhQUFhLENBQUNpQixLQUFuQjtBQUNBLFdBQUtqQixhQUFhLENBQUNtQixJQUFuQjtBQUF5QjtBQUNyQixrQkFBUTRFLE1BQVI7QUFDSSxpQkFBSyxDQUFMO0FBQVEscUJBQU9DLFVBQVA7O0FBQ1IsaUJBQUssQ0FBTDtBQUFRLHFCQUFPQyxXQUFQOztBQUNSLGlCQUFLLENBQUw7QUFBUSxxQkFBT0MsV0FBUDtBQUhaOztBQUtBO0FBQ0g7O0FBQ0QsV0FBS2xHLGFBQWEsQ0FBQ2tCLEtBQW5CO0FBQ0EsV0FBS2xCLGFBQWEsQ0FBQ29CLEdBQW5CO0FBQXdCO0FBQ3BCLGtCQUFRMkUsTUFBUjtBQUNJLGlCQUFLLENBQUw7QUFBUSxxQkFBT0ksU0FBUDs7QUFDUixpQkFBSyxDQUFMO0FBQVEscUJBQU9DLFVBQVA7O0FBQ1IsaUJBQUssQ0FBTDtBQUFRLHFCQUFPQyxVQUFQO0FBSFo7O0FBS0E7QUFDSDs7QUFDRCxXQUFLckcsYUFBYSxDQUFDcUIsS0FBbkI7QUFBMEI7QUFDdEIsaUJBQU9pRixZQUFQO0FBQ0g7QUFyQkw7O0FBdUJBLFdBQU9BLFlBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2Z4XHJcbiAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IEdGWF9NQVhfQVRUQUNITUVOVFM6IG51bWJlciA9IDQ7XHJcblxyXG5leHBvcnQgZW51bSBHRlhPYmplY3RUeXBlIHtcclxuICAgIFVOS05PV04sXHJcbiAgICBCVUZGRVIsXHJcbiAgICBURVhUVVJFLFxyXG4gICAgUkVOREVSX1BBU1MsXHJcbiAgICBGUkFNRUJVRkZFUixcclxuICAgIFNBTVBMRVIsXHJcbiAgICBTSEFERVIsXHJcbiAgICBERVNDUklQVE9SX1NFVF9MQVlPVVQsXHJcbiAgICBQSVBFTElORV9MQVlPVVQsXHJcbiAgICBQSVBFTElORV9TVEFURSxcclxuICAgIERFU0NSSVBUT1JfU0VULFxyXG4gICAgSU5QVVRfQVNTRU1CTEVSLFxyXG4gICAgQ09NTUFORF9CVUZGRVIsXHJcbiAgICBGRU5DRSxcclxuICAgIFFVRVVFLFxyXG4gICAgV0lORE9XLFxyXG59XHJcblxyXG4vKipcclxuICogQGVuIEdGWCBiYXNlIG9iamVjdC5cclxuICogQHpoIEdGWCDln7rnsbvlr7nosaHjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHRlhPYmplY3Qge1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2Z4VHlwZSAoKTogR0ZYT2JqZWN0VHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dmeFR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZnhUeXBlID0gR0ZYT2JqZWN0VHlwZS5VTktOT1dOO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChnZnhUeXBlOiBHRlhPYmplY3RUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5fZ2Z4VHlwZSA9IGdmeFR5cGU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWEF0dHJpYnV0ZU5hbWUge1xyXG4gICAgQVRUUl9QT1NJVElPTiA9ICdhX3Bvc2l0aW9uJyxcclxuICAgIEFUVFJfTk9STUFMID0gJ2Ffbm9ybWFsJyxcclxuICAgIEFUVFJfVEFOR0VOVCA9ICdhX3RhbmdlbnQnLFxyXG4gICAgQVRUUl9CSVRBTkdFTlQgPSAnYV9iaXRhbmdlbnQnLFxyXG4gICAgQVRUUl9XRUlHSFRTID0gJ2Ffd2VpZ2h0cycsXHJcbiAgICBBVFRSX0pPSU5UUyA9ICdhX2pvaW50cycsXHJcbiAgICBBVFRSX0NPTE9SID0gJ2FfY29sb3InLFxyXG4gICAgQVRUUl9DT0xPUjEgPSAnYV9jb2xvcjEnLFxyXG4gICAgQVRUUl9DT0xPUjIgPSAnYV9jb2xvcjInLFxyXG4gICAgQVRUUl9URVhfQ09PUkQgPSAnYV90ZXhDb29yZCcsXHJcbiAgICBBVFRSX1RFWF9DT09SRDEgPSAnYV90ZXhDb29yZDEnLFxyXG4gICAgQVRUUl9URVhfQ09PUkQyID0gJ2FfdGV4Q29vcmQyJyxcclxuICAgIEFUVFJfVEVYX0NPT1JEMyA9ICdhX3RleENvb3JkMycsXHJcbiAgICBBVFRSX1RFWF9DT09SRDQgPSAnYV90ZXhDb29yZDQnLFxyXG4gICAgQVRUUl9URVhfQ09PUkQ1ID0gJ2FfdGV4Q29vcmQ1JyxcclxuICAgIEFUVFJfVEVYX0NPT1JENiA9ICdhX3RleENvb3JkNicsXHJcbiAgICBBVFRSX1RFWF9DT09SRDcgPSAnYV90ZXhDb29yZDcnLFxyXG4gICAgQVRUUl9URVhfQ09PUkQ4ID0gJ2FfdGV4Q29vcmQ4JyxcclxuICAgIEFUVFJfQkFUQ0hfSUQgPSAnYV9iYXRjaF9pZCcsXHJcbiAgICBBVFRSX0JBVENIX1VWID0gJ2FfYmF0Y2hfdXYnLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhUeXBlIHtcclxuICAgIC8vIGFzc3VtcHRpb25zIGFib3V0IHRoZSBvcmRlciBvZiB0aGlzIGVudW06IChleHBsb2l0ZWQgYnkgb3RoZXIgcGFydHMgb2YgdGhlIGVuZ2luZSlcclxuICAgIC8vICogdmVjdG9ycyBhbHdheXMgY29tZSBiZWZvcmUgc2FtcGxlcnNcclxuICAgIC8vICogdmVjdG9ycyB3aXRoIHRoZSBzYW1lIGRhdGEgdHlwZSBhcmUgYWx3YXlzIGNvbnNlY3V0aXZlLCBpbiBhbiBjb21wb25lbnQtd2lzZSBhc2NlbmRpbmcgb3JkZXJcclxuICAgIC8vICogdW5rbm93biBpcyBhbHdheXMgemVyb1xyXG4gICAgVU5LTk9XTixcclxuICAgIC8vIHZlY3RvcnNcclxuICAgIEJPT0wsXHJcbiAgICBCT09MMixcclxuICAgIEJPT0wzLFxyXG4gICAgQk9PTDQsXHJcblxyXG4gICAgSU5ULFxyXG4gICAgSU5UMixcclxuICAgIElOVDMsXHJcbiAgICBJTlQ0LFxyXG5cclxuICAgIFVJTlQsXHJcbiAgICBVSU5UMixcclxuICAgIFVJTlQzLFxyXG4gICAgVUlOVDQsXHJcblxyXG4gICAgRkxPQVQsXHJcbiAgICBGTE9BVDIsXHJcbiAgICBGTE9BVDMsXHJcbiAgICBGTE9BVDQsXHJcblxyXG4gICAgTUFUMixcclxuICAgIE1BVDJYMyxcclxuICAgIE1BVDJYNCxcclxuICAgIE1BVDNYMixcclxuICAgIE1BVDMsXHJcbiAgICBNQVQzWDQsXHJcbiAgICBNQVQ0WDIsXHJcbiAgICBNQVQ0WDMsXHJcbiAgICBNQVQ0LFxyXG4gICAgLy8gc2FtcGxlcnNcclxuICAgIFNBTVBMRVIxRCxcclxuICAgIFNBTVBMRVIxRF9BUlJBWSxcclxuICAgIFNBTVBMRVIyRCxcclxuICAgIFNBTVBMRVIyRF9BUlJBWSxcclxuICAgIFNBTVBMRVIzRCxcclxuICAgIFNBTVBMRVJfQ1VCRSxcclxuICAgIENPVU5ULFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhGb3JtYXQge1xyXG5cclxuICAgIFVOS05PV04sXHJcblxyXG4gICAgQTgsXHJcbiAgICBMOCxcclxuICAgIExBOCxcclxuXHJcbiAgICBSOCxcclxuICAgIFI4U04sXHJcbiAgICBSOFVJLFxyXG4gICAgUjhJLFxyXG4gICAgUjE2RixcclxuICAgIFIxNlVJLFxyXG4gICAgUjE2SSxcclxuICAgIFIzMkYsXHJcbiAgICBSMzJVSSxcclxuICAgIFIzMkksXHJcblxyXG4gICAgUkc4LFxyXG4gICAgUkc4U04sXHJcbiAgICBSRzhVSSxcclxuICAgIFJHOEksXHJcbiAgICBSRzE2RixcclxuICAgIFJHMTZVSSxcclxuICAgIFJHMTZJLFxyXG4gICAgUkczMkYsXHJcbiAgICBSRzMyVUksXHJcbiAgICBSRzMySSxcclxuXHJcbiAgICBSR0I4LFxyXG4gICAgU1JHQjgsXHJcbiAgICBSR0I4U04sXHJcbiAgICBSR0I4VUksXHJcbiAgICBSR0I4SSxcclxuICAgIFJHQjE2RixcclxuICAgIFJHQjE2VUksXHJcbiAgICBSR0IxNkksXHJcbiAgICBSR0IzMkYsXHJcbiAgICBSR0IzMlVJLFxyXG4gICAgUkdCMzJJLFxyXG5cclxuICAgIFJHQkE4LFxyXG4gICAgQkdSQTgsXHJcbiAgICBTUkdCOF9BOCxcclxuICAgIFJHQkE4U04sXHJcbiAgICBSR0JBOFVJLFxyXG4gICAgUkdCQThJLFxyXG4gICAgUkdCQTE2RixcclxuICAgIFJHQkExNlVJLFxyXG4gICAgUkdCQTE2SSxcclxuICAgIFJHQkEzMkYsXHJcbiAgICBSR0JBMzJVSSxcclxuICAgIFJHQkEzMkksXHJcblxyXG4gICAgLy8gU3BlY2lhbCBGb3JtYXRcclxuICAgIFI1RzZCNSxcclxuICAgIFIxMUcxMUIxMEYsXHJcbiAgICBSR0I1QTEsXHJcbiAgICBSR0JBNCxcclxuICAgIFJHQjEwQTIsXHJcbiAgICBSR0IxMEEyVUksXHJcbiAgICBSR0I5RTUsXHJcblxyXG4gICAgLy8gRGVwdGgtU3RlbmNpbCBGb3JtYXRcclxuICAgIEQxNixcclxuICAgIEQxNlM4LFxyXG4gICAgRDI0LFxyXG4gICAgRDI0UzgsXHJcbiAgICBEMzJGLFxyXG4gICAgRDMyRl9TOCxcclxuXHJcbiAgICAvLyBDb21wcmVzc2VkIEZvcm1hdFxyXG5cclxuICAgIC8vIEJsb2NrIENvbXByZXNzaW9uIEZvcm1hdCwgRERTIChEaXJlY3REcmF3IFN1cmZhY2UpXHJcbiAgICAvLyBEWFQxOiAzIGNoYW5uZWxzICg1OjY6NSksIDEvOCBvcmlnaWFubCBzaXplLCB3aXRoIDAgb3IgMSBiaXQgb2YgYWxwaGFcclxuICAgIEJDMSxcclxuICAgIEJDMV9BTFBIQSxcclxuICAgIEJDMV9TUkdCLFxyXG4gICAgQkMxX1NSR0JfQUxQSEEsXHJcbiAgICAvLyBEWFQzOiA0IGNoYW5uZWxzICg1OjY6NSksIDEvNCBvcmlnaWFubCBzaXplLCB3aXRoIDQgYml0cyBvZiBhbHBoYVxyXG4gICAgQkMyLFxyXG4gICAgQkMyX1NSR0IsXHJcbiAgICAvLyBEWFQ1OiA0IGNoYW5uZWxzICg1OjY6NSksIDEvNCBvcmlnaWFubCBzaXplLCB3aXRoIDggYml0cyBvZiBhbHBoYVxyXG4gICAgQkMzLFxyXG4gICAgQkMzX1NSR0IsXHJcbiAgICAvLyAxIGNoYW5uZWwgKDgpLCAxLzQgb3JpZ2lhbmwgc2l6ZVxyXG4gICAgQkM0LFxyXG4gICAgQkM0X1NOT1JNLFxyXG4gICAgLy8gMiBjaGFubmVscyAoODo4KSwgMS8yIG9yaWdpYW5sIHNpemVcclxuICAgIEJDNSxcclxuICAgIEJDNV9TTk9STSxcclxuICAgIC8vIDMgY2hhbm5lbHMgKDE2OjE2OjE2KSwgaGFsZi1mbG9hdGluZyBwb2ludCwgMS82IG9yaWdpYW5sIHNpemVcclxuICAgIC8vIFVGMTY6IHVuc2lnbmVkIGZsb2F0LCA1IGV4cG9uZW50IGJpdHMgKyAxMSBtYW50aXNzYSBiaXRzXHJcbiAgICAvLyBTRjE2OiBzaWduZWQgZmxvYXQsIDEgc2lnbmVkIGJpdCArIDUgZXhwb25lbnQgYml0cyArIDEwIG1hbnRpc3NhIGJpdHNcclxuICAgIEJDNkhfVUYxNixcclxuICAgIEJDNkhfU0YxNixcclxuICAgIC8vIDQgY2hhbm5lbHMgKDR+NyBiaXRzIHBlciBjaGFubmVsKSB3aXRoIDAgdG8gOCBiaXRzIG9mIGFscGhhLCAxLzMgb3JpZ2luYWwgc2l6ZVxyXG4gICAgQkM3LFxyXG4gICAgQkM3X1NSR0IsXHJcblxyXG4gICAgLy8gRXJpY3Nzb24gVGV4dHVyZSBDb21wcmVzc2lvbiBGb3JtYXRcclxuICAgIEVUQ19SR0I4LFxyXG4gICAgRVRDMl9SR0I4LFxyXG4gICAgRVRDMl9TUkdCOCxcclxuICAgIEVUQzJfUkdCOF9BMSxcclxuICAgIEVUQzJfU1JHQjhfQTEsXHJcbiAgICBFVEMyX1JHQkE4LFxyXG4gICAgRVRDMl9TUkdCOF9BOCxcclxuICAgIEVBQ19SMTEsXHJcbiAgICBFQUNfUjExU04sXHJcbiAgICBFQUNfUkcxMSxcclxuICAgIEVBQ19SRzExU04sXHJcblxyXG4gICAgLy8gUFZSVEMgKFBvd2VyVlIpXHJcbiAgICBQVlJUQ19SR0IyLFxyXG4gICAgUFZSVENfUkdCQTIsXHJcbiAgICBQVlJUQ19SR0I0LFxyXG4gICAgUFZSVENfUkdCQTQsXHJcbiAgICBQVlJUQzJfMkJQUCxcclxuICAgIFBWUlRDMl80QlBQLFxyXG5cclxuICAgIC8vIEFTVEMgKEFkYXB0aXZlIFNjYWxhYmxlIFRleHR1cmUgQ29tcHJlc3Npb24pXHJcbiAgICBBU1RDX1JHQkFfNHg0LFxyXG4gICAgQVNUQ19SR0JBXzV4NCxcclxuICAgIEFTVENfUkdCQV81eDUsXHJcbiAgICBBU1RDX1JHQkFfNng1LFxyXG4gICAgQVNUQ19SR0JBXzZ4NixcclxuICAgIEFTVENfUkdCQV84eDUsXHJcbiAgICBBU1RDX1JHQkFfOHg2LFxyXG4gICAgQVNUQ19SR0JBXzh4OCxcclxuICAgIEFTVENfUkdCQV8xMHg1LFxyXG4gICAgQVNUQ19SR0JBXzEweDYsXHJcbiAgICBBU1RDX1JHQkFfMTB4OCxcclxuICAgIEFTVENfUkdCQV8xMHgxMCxcclxuICAgIEFTVENfUkdCQV8xMngxMCxcclxuICAgIEFTVENfUkdCQV8xMngxMixcclxuXHJcbiAgICAvLyBBU1RDIChBZGFwdGl2ZSBTY2FsYWJsZSBUZXh0dXJlIENvbXByZXNzaW9uKSBTUkdCXHJcbiAgICBBU1RDX1NSR0JBXzR4NCxcclxuICAgIEFTVENfU1JHQkFfNXg0LFxyXG4gICAgQVNUQ19TUkdCQV81eDUsXHJcbiAgICBBU1RDX1NSR0JBXzZ4NSxcclxuICAgIEFTVENfU1JHQkFfNng2LFxyXG4gICAgQVNUQ19TUkdCQV84eDUsXHJcbiAgICBBU1RDX1NSR0JBXzh4NixcclxuICAgIEFTVENfU1JHQkFfOHg4LFxyXG4gICAgQVNUQ19TUkdCQV8xMHg1LFxyXG4gICAgQVNUQ19TUkdCQV8xMHg2LFxyXG4gICAgQVNUQ19TUkdCQV8xMHg4LFxyXG4gICAgQVNUQ19TUkdCQV8xMHgxMCxcclxuICAgIEFTVENfU1JHQkFfMTJ4MTAsXHJcbiAgICBBU1RDX1NSR0JBXzEyeDEyLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhCdWZmZXJVc2FnZUJpdCB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIFRSQU5TRkVSX1NSQyA9IDB4MSxcclxuICAgIFRSQU5TRkVSX0RTVCA9IDB4MixcclxuICAgIElOREVYID0gMHg0LFxyXG4gICAgVkVSVEVYID0gMHg4LFxyXG4gICAgVU5JRk9STSA9IDB4MTAsXHJcbiAgICBTVE9SQUdFID0gMHgyMCxcclxuICAgIElORElSRUNUID0gMHg0MCxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgR0ZYQnVmZmVyVXNhZ2UgPSBHRlhCdWZmZXJVc2FnZUJpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWE1lbW9yeVVzYWdlQml0IHtcclxuICAgIE5PTkUgPSAwLFxyXG4gICAgREVWSUNFID0gMHgxLFxyXG4gICAgSE9TVCA9IDB4MixcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgR0ZYTWVtb3J5VXNhZ2UgPSBHRlhNZW1vcnlVc2FnZUJpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWEJ1ZmZlckZsYWdCaXQge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBCQUtVUF9CVUZGRVIgPSAweDQsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEdGWEJ1ZmZlckZsYWdzID0gR0ZYQnVmZmVyRmxhZ0JpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWEJ1ZmZlckFjY2Vzc0JpdCB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIFJFQUQgPSAweDEsXHJcbiAgICBXUklURSA9IDB4MixcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgR0ZYQnVmZmVyQWNjZXNzID0gR0ZYQnVmZmVyQWNjZXNzQml0O1xyXG5cclxuZXhwb3J0IGVudW0gR0ZYUHJpbWl0aXZlTW9kZSB7XHJcbiAgICBQT0lOVF9MSVNULFxyXG4gICAgTElORV9MSVNULFxyXG4gICAgTElORV9TVFJJUCxcclxuICAgIExJTkVfTE9PUCxcclxuICAgIExJTkVfTElTVF9BREpBQ0VOQ1ksXHJcbiAgICBMSU5FX1NUUklQX0FESkFDRU5DWSxcclxuICAgIElTT19MSU5FX0xJU1QsXHJcbiAgICAvLyByYXljYXN0IGRldGVjdGFibGU6XHJcbiAgICBUUklBTkdMRV9MSVNULFxyXG4gICAgVFJJQU5HTEVfU1RSSVAsXHJcbiAgICBUUklBTkdMRV9GQU4sXHJcbiAgICBUUklBTkdMRV9MSVNUX0FESkFDRU5DWSxcclxuICAgIFRSSUFOR0xFX1NUUklQX0FESkFDRU5DWSxcclxuICAgIFRSSUFOR0xFX1BBVENIX0FESkFDRU5DWSxcclxuICAgIFFVQURfUEFUQ0hfTElTVCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYUG9seWdvbk1vZGUge1xyXG4gICAgRklMTCxcclxuICAgIFBPSU5ULFxyXG4gICAgTElORSxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYU2hhZGVNb2RlbCB7XHJcbiAgICBHT1VSQU5ELFxyXG4gICAgRkxBVCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYQ3VsbE1vZGUge1xyXG4gICAgTk9ORSxcclxuICAgIEZST05ULFxyXG4gICAgQkFDSyxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYQ29tcGFyaXNvbkZ1bmMge1xyXG4gICAgTkVWRVIsXHJcbiAgICBMRVNTLFxyXG4gICAgRVFVQUwsXHJcbiAgICBMRVNTX0VRVUFMLFxyXG4gICAgR1JFQVRFUixcclxuICAgIE5PVF9FUVVBTCxcclxuICAgIEdSRUFURVJfRVFVQUwsXHJcbiAgICBBTFdBWVMsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWFN0ZW5jaWxPcCB7XHJcbiAgICBaRVJPLFxyXG4gICAgS0VFUCxcclxuICAgIFJFUExBQ0UsXHJcbiAgICBJTkNSLFxyXG4gICAgREVDUixcclxuICAgIElOVkVSVCxcclxuICAgIElOQ1JfV1JBUCxcclxuICAgIERFQ1JfV1JBUCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYQmxlbmRPcCB7XHJcbiAgICBBREQsXHJcbiAgICBTVUIsXHJcbiAgICBSRVZfU1VCLFxyXG4gICAgTUlOLFxyXG4gICAgTUFYLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhCbGVuZEZhY3RvciB7XHJcbiAgICBaRVJPLFxyXG4gICAgT05FLFxyXG4gICAgU1JDX0FMUEhBLFxyXG4gICAgRFNUX0FMUEhBLFxyXG4gICAgT05FX01JTlVTX1NSQ19BTFBIQSxcclxuICAgIE9ORV9NSU5VU19EU1RfQUxQSEEsXHJcbiAgICBTUkNfQ09MT1IsXHJcbiAgICBEU1RfQ09MT1IsXHJcbiAgICBPTkVfTUlOVVNfU1JDX0NPTE9SLFxyXG4gICAgT05FX01JTlVTX0RTVF9DT0xPUixcclxuICAgIFNSQ19BTFBIQV9TQVRVUkFURSxcclxuICAgIENPTlNUQU5UX0NPTE9SLFxyXG4gICAgT05FX01JTlVTX0NPTlNUQU5UX0NPTE9SLFxyXG4gICAgQ09OU1RBTlRfQUxQSEEsXHJcbiAgICBPTkVfTUlOVVNfQ09OU1RBTlRfQUxQSEEsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWENvbG9yTWFzayB7XHJcbiAgICBOT05FID0gMHgwLFxyXG4gICAgUiA9IDB4MSxcclxuICAgIEcgPSAweDIsXHJcbiAgICBCID0gMHg0LFxyXG4gICAgQSA9IDB4OCxcclxuICAgIEFMTCA9IFIgfCBHIHwgQiB8IEEsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWEZpbHRlciB7XHJcbiAgICBOT05FLFxyXG4gICAgUE9JTlQsXHJcbiAgICBMSU5FQVIsXHJcbiAgICBBTklTT1RST1BJQyxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYQWRkcmVzcyB7XHJcbiAgICBXUkFQLFxyXG4gICAgTUlSUk9SLFxyXG4gICAgQ0xBTVAsXHJcbiAgICBCT1JERVIsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWFRleHR1cmVUeXBlIHtcclxuICAgIFRFWDFELFxyXG4gICAgVEVYMkQsXHJcbiAgICBURVgzRCxcclxuICAgIENVQkUsXHJcbiAgICBURVgxRF9BUlJBWSxcclxuICAgIFRFWDJEX0FSUkFZLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhUZXh0dXJlVXNhZ2VCaXQge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBUUkFOU0ZFUl9TUkMgPSAweDEsXHJcbiAgICBUUkFOU0ZFUl9EU1QgPSAweDIsXHJcbiAgICBTQU1QTEVEID0gMHg0LFxyXG4gICAgU1RPUkFHRSA9IDB4OCxcclxuICAgIENPTE9SX0FUVEFDSE1FTlQgPSAweDEwLFxyXG4gICAgREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UID0gMHgyMCxcclxuICAgIFRSQU5TSUVOVF9BVFRBQ0hNRU5UID0gMHg0MCxcclxuICAgIElOUFVUX0FUVEFDSE1FTlQgPSAweDgwLFxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBHRlhUZXh0dXJlVXNhZ2UgPSBHRlhUZXh0dXJlVXNhZ2VCaXQ7XHJcblxyXG5leHBvcnQgZW51bSBHRlhTYW1wbGVDb3VudCB7XHJcbiAgICBYMSxcclxuICAgIFgyLFxyXG4gICAgWDQsXHJcbiAgICBYOCxcclxuICAgIFgxNixcclxuICAgIFgzMixcclxuICAgIFg2NCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYVGV4dHVyZUZsYWdCaXQge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBHRU5fTUlQTUFQID0gMHgxLFxyXG4gICAgQ1VCRU1BUCA9IDB4MixcclxuICAgIEJBS1VQX0JVRkZFUiA9IDB4NCxcclxufVxyXG5leHBvcnQgdHlwZSBHRlhUZXh0dXJlRmxhZ3MgPSBHRlhUZXh0dXJlRmxhZ0JpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWFNoYWRlclN0YWdlRmxhZ0JpdCB7XHJcbiAgICBOT05FID0gMCxcclxuICAgIFZFUlRFWCA9IDB4MSxcclxuICAgIENPTlRST0wgPSAweDIsXHJcbiAgICBFVkFMVUFUSU9OID0gMHg0LFxyXG4gICAgR0VPTUVUUlkgPSAweDgsXHJcbiAgICBGUkFHTUVOVCA9IDB4MTAsXHJcbiAgICBDT01QVVRFID0gMHgyMCxcclxuICAgIEFMTCA9IDB4M2YsXHJcbn1cclxuZXhwb3J0IHR5cGUgR0ZYU2hhZGVyU3RhZ2VGbGFncyA9IEdGWFNoYWRlclN0YWdlRmxhZ0JpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWERlc2NyaXB0b3JUeXBlIHtcclxuICAgIFVOS05PV04gPSAwLFxyXG4gICAgVU5JRk9STV9CVUZGRVIgPSAweDEsXHJcbiAgICBEWU5BTUlDX1VOSUZPUk1fQlVGRkVSID0gMHgyLFxyXG4gICAgU1RPUkFHRV9CVUZGRVIgPSAweDQsXHJcbiAgICBEWU5BTUlDX1NUT1JBR0VfQlVGRkVSID0gMHg4LFxyXG4gICAgU0FNUExFUiA9IDB4MTAsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWENvbW1hbmRCdWZmZXJUeXBlIHtcclxuICAgIFBSSU1BUlksXHJcbiAgICBTRUNPTkRBUlksXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEdGWExvYWRPcCB7XHJcbiAgICBMT0FELCAgICAvLyBMb2FkIHRoZSBwcmV2aW91cyBkYXRhXHJcbiAgICBDTEVBUiwgICAvLyBDbGVhciB0aGUgZmJvXHJcbiAgICBESVNDQVJELCAvLyBJZ25vcmUgdGhlIHByZXZpb3VzIGRhdGFcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYU3RvcmVPcCB7XHJcbiAgICBTVE9SRSwgICAvLyBXcml0ZSB0aGUgc291cmNlIHRvIHRoZSBkZXN0aW5hdGlvblxyXG4gICAgRElTQ0FSRCwgLy8gRG9uJ3Qgd3JpdGUgdGhlIHNvdXJjZSB0byB0aGUgZGVzdGluYXRpb25cclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYVGV4dHVyZUxheW91dCB7XHJcbiAgICBVTkRFRklORUQsXHJcbiAgICBHRU5FUkFMLFxyXG4gICAgQ09MT1JfQVRUQUNITUVOVF9PUFRJTUFMLFxyXG4gICAgREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwsXHJcbiAgICBERVBUSF9TVEVOQ0lMX1JFQURPTkxZX09QVElNQUwsXHJcbiAgICBTSEFERVJfUkVBRE9OTFlfT1BUSU1BTCxcclxuICAgIFRSQU5TRkVSX1NSQ19PUFRJTUFMLFxyXG4gICAgVFJBTlNGRVJfRFNUX09QVElNQUwsXHJcbiAgICBQUkVJTklUSUFMSVpFRCxcclxuICAgIFBSRVNFTlRfU1JDLFxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhQaXBlbGluZUJpbmRQb2ludCB7XHJcbiAgICBHUkFQSElDUyxcclxuICAgIENPTVBVVEUsXHJcbiAgICBSQVlfVFJBQ0lORyxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdCB7XHJcbiAgICBOT05FID0gMHgwLFxyXG4gICAgVklFV1BPUlQgPSAweDEsXHJcbiAgICBTQ0lTU09SID0gMHgyLFxyXG4gICAgTElORV9XSURUSCA9IDB4NCxcclxuICAgIERFUFRIX0JJQVMgPSAweDgsXHJcbiAgICBCTEVORF9DT05TVEFOVFMgPSAweDEwLFxyXG4gICAgREVQVEhfQk9VTkRTID0gMHgyMCxcclxuICAgIFNURU5DSUxfV1JJVEVfTUFTSyA9IDB4NDAsXHJcbiAgICBTVEVOQ0lMX0NPTVBBUkVfTUFTSyA9IDB4ODAsXHJcbn1cclxuXHJcbmV4cG9ydCB0eXBlIEdGWER5bmFtaWNTdGF0ZUZsYWdzID0gR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdDtcclxuXHJcbmV4cG9ydCBlbnVtIEdGWFN0ZW5jaWxGYWNlIHtcclxuICAgIEZST05ULFxyXG4gICAgQkFDSyxcclxuICAgIEFMTCxcclxufVxyXG5cclxuZXhwb3J0IGVudW0gR0ZYUXVldWVUeXBlIHtcclxuICAgIEdSQVBISUNTLFxyXG4gICAgQ09NUFVURSxcclxuICAgIFRSQU5TRkVSLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYUmVjdCB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIHg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHk6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHdpZHRoOiBudW1iZXIgPSAxLFxyXG4gICAgICAgIHB1YmxpYyBoZWlnaHQ6IG51bWJlciA9IDEsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhWaWV3cG9ydCB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGxlZnQ6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHRvcDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgd2lkdGg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGhlaWdodDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgbWluRGVwdGg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIG1heERlcHRoOiBudW1iZXIgPSAxLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYQ29sb3Ige1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB4OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB5OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB6OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyB3OiBudW1iZXIgPSAwLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhDbGVhckZsYWcge1xyXG4gICAgTk9ORSA9IDAsXHJcbiAgICBDT0xPUiA9IDEsXHJcbiAgICBERVBUSCA9IDIsXHJcbiAgICBTVEVOQ0lMID0gNCxcclxuICAgIERFUFRIX1NURU5DSUwgPSBERVBUSCB8IFNURU5DSUwsXHJcbiAgICBBTEwgPSBDT0xPUiB8IERFUFRIIHwgU1RFTkNJTCxcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdGWE9mZnNldCB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIHg6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHk6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHo6IG51bWJlciA9IDAsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhFeHRlbnQge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyB3aWR0aDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgaGVpZ2h0OiBudW1iZXIgPSAwLFxyXG4gICAgICAgIHB1YmxpYyBkZXB0aDogbnVtYmVyID0gMSxcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdGWFRleHR1cmVTdWJyZXMge1xyXG4gICAgZGVjbGFyZSBwcml2YXRlIHRva2VuOiBuZXZlcjsgLy8gdG8gbWFrZSBzdXJlIGFsbCB1c2FnZXMgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiB0aGlzIGV4YWN0IGNsYXNzLCBub3QgYXNzZW1ibGVkIGZyb20gcGxhaW4gb2JqZWN0XHJcblxyXG4gICAgY29uc3RydWN0b3IgKFxyXG4gICAgICAgIHB1YmxpYyBtaXBMZXZlbDogbnVtYmVyID0gMCxcclxuICAgICAgICBwdWJsaWMgYmFzZUFycmF5TGF5ZXI6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGxheWVyQ291bnQ6IG51bWJlciA9IDEsXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhUZXh0dXJlQ29weSB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIHNyY1N1YnJlcyA9IG5ldyBHRlhUZXh0dXJlU3VicmVzKCksXHJcbiAgICAgICAgcHVibGljIHNyY09mZnNldCA9IG5ldyBHRlhPZmZzZXQoKSxcclxuICAgICAgICBwdWJsaWMgZHN0U3VicmVzID0gbmV3IEdGWFRleHR1cmVTdWJyZXMoKSxcclxuICAgICAgICBwdWJsaWMgZHN0T2Zmc2V0ID0gbmV3IEdGWE9mZnNldCgpLFxyXG4gICAgICAgIHB1YmxpYyBleHRlbnQgPSBuZXcgR0ZYRXh0ZW50KCksXHJcbiAgICApIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHRlhCdWZmZXJUZXh0dXJlQ29weSB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGJ1ZmZTdHJpZGU6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIGJ1ZmZUZXhIZWlnaHQ6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHRleE9mZnNldCA9IG5ldyBHRlhPZmZzZXQoKSxcclxuICAgICAgICBwdWJsaWMgdGV4RXh0ZW50ID0gbmV3IEdGWEV4dGVudCgpLFxyXG4gICAgICAgIHB1YmxpYyB0ZXhTdWJyZXMgPSBuZXcgR0ZYVGV4dHVyZVN1YnJlcygpLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHRlhGb3JtYXRUeXBlIHtcclxuICAgIE5PTkUsXHJcbiAgICBVTk9STSxcclxuICAgIFNOT1JNLFxyXG4gICAgVUlOVCxcclxuICAgIElOVCxcclxuICAgIFVGTE9BVCxcclxuICAgIEZMT0FULFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR0ZYRm9ybWF0SW5mbyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgc2l6ZTogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBjb3VudDogbnVtYmVyLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSB0eXBlOiBHRlhGb3JtYXRUeXBlLFxyXG4gICAgICAgIHB1YmxpYyByZWFkb25seSBoYXNBbHBoYTogYm9vbGVhbixcclxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaGFzRGVwdGg6IGJvb2xlYW4sXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGhhc1N0ZW5jaWw6IGJvb2xlYW4sXHJcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGlzQ29tcHJlc3NlZDogYm9vbGVhbixcclxuICAgICkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdGWE1lbW9yeVN0YXR1cyB7XHJcbiAgICBkZWNsYXJlIHByaXZhdGUgdG9rZW46IG5ldmVyOyAvLyB0byBtYWtlIHN1cmUgYWxsIHVzYWdlcyBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIHRoaXMgZXhhY3QgY2xhc3MsIG5vdCBhc3NlbWJsZWQgZnJvbSBwbGFpbiBvYmplY3RcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoXHJcbiAgICAgICAgcHVibGljIGJ1ZmZlclNpemU6IG51bWJlciA9IDAsXHJcbiAgICAgICAgcHVibGljIHRleHR1cmVTaXplOiBudW1iZXIgPSAwLFxyXG4gICAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgR0ZYRm9ybWF0SW5mb3MgPSBPYmplY3QuZnJlZXplKFtcclxuXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnVU5LTk9XTicsIDAsIDAsIEdGWEZvcm1hdFR5cGUuTk9ORSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG5cclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBOCcsIDEsIDEsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0w4JywgMSwgMSwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0xBOCcsIDEsIDIsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG5cclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSOCcsIDEsIDEsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSOFNOJywgMSwgMSwgR0ZYRm9ybWF0VHlwZS5TTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1I4VUknLCAxLCAxLCBHRlhGb3JtYXRUeXBlLlVJTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSOEknLCAxLCAxLCBHRlhGb3JtYXRUeXBlLklOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1IxNkYnLCAyLCAxLCBHRlhGb3JtYXRUeXBlLkZMT0FULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUjE2VUknLCAyLCAxLCBHRlhGb3JtYXRUeXBlLlVJTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSMTZJJywgMiwgMSwgR0ZYRm9ybWF0VHlwZS5JTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSMzJGJywgNCwgMSwgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1IzMlVJJywgNCwgMSwgR0ZYRm9ybWF0VHlwZS5VSU5ULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUjMySScsIDQsIDEsIEdGWEZvcm1hdFR5cGUuSU5ULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHOCcsIDIsIDIsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSRzhTTicsIDIsIDIsIEdGWEZvcm1hdFR5cGUuU05PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSRzhVSScsIDIsIDIsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHOEknLCAyLCAyLCBHRlhGb3JtYXRUeXBlLklOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHMTZGJywgNCwgMiwgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHMTZVSScsIDQsIDIsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHMTZJJywgNCwgMiwgR0ZYRm9ybWF0VHlwZS5JTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSRzMyRicsIDgsIDIsIEdGWEZvcm1hdFR5cGUuRkxPQVQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSRzMyVUknLCA4LCAyLCBHRlhGb3JtYXRUeXBlLlVJTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSRzMySScsIDgsIDIsIEdGWEZvcm1hdFR5cGUuSU5ULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjgnLCAzLCAzLCBHRlhGb3JtYXRUeXBlLlVOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnU1JHQjgnLCAzLCAzLCBHRlhGb3JtYXRUeXBlLlVOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCOFNOJywgMywgMywgR0ZYRm9ybWF0VHlwZS5TTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjhVSScsIDMsIDMsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjhJJywgMywgMywgR0ZYRm9ybWF0VHlwZS5JTlQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0IxNkYnLCA2LCAzLCBHRlhGb3JtYXRUeXBlLkZMT0FULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCMTZVSScsIDYsIDMsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjE2SScsIDYsIDMsIEdGWEZvcm1hdFR5cGUuSU5ULCBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCMzJGJywgMTIsIDMsIEdGWEZvcm1hdFR5cGUuRkxPQVQsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0IzMlVJJywgMTIsIDMsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjMySScsIDEyLCAzLCBHRlhGb3JtYXRUeXBlLklOVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG5cclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0JBOCcsIDQsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0JHUkE4JywgNCwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnU1JHQjhfQTgnLCA0LCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0JBOFNOJywgNCwgNCwgR0ZYRm9ybWF0VHlwZS5TTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCQThVSScsIDQsIDQsIEdGWEZvcm1hdFR5cGUuVUlOVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCQThJJywgNCwgNCwgR0ZYRm9ybWF0VHlwZS5JTlQsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQkExNkYnLCA4LCA0LCBHRlhGb3JtYXRUeXBlLkZMT0FULCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0JBMTZVSScsIDgsIDQsIEdGWEZvcm1hdFR5cGUuVUlOVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCQTE2SScsIDgsIDQsIEdGWEZvcm1hdFR5cGUuSU5ULCB0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSR0JBMzJGJywgMTYsIDQsIEdGWEZvcm1hdFR5cGUuRkxPQVQsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQkEzMlVJJywgMTYsIDQsIEdGWEZvcm1hdFR5cGUuVUlOVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCQTMySScsIDE2LCA0LCBHRlhGb3JtYXRUeXBlLklOVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1I1RzZCNScsIDIsIDMsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdSMTFHMTFCMTBGJywgNCwgMywgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjVBMScsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQkE0JywgMiwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCMTBBMicsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1JHQjEwQTJVSScsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVUlOVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUkdCOUU1JywgMiwgNCwgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0QxNicsIDIsIDEsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRDE2UzgnLCAzLCAyLCBHRlhGb3JtYXRUeXBlLlVJTlQsIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRDI0JywgMywgMSwgR0ZYRm9ybWF0VHlwZS5VSU5ULCBmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdEMjRTOCcsIDQsIDIsIEdGWEZvcm1hdFR5cGUuVUlOVCwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdEMzJGJywgNCwgMSwgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIHRydWUsIGZhbHNlLCBmYWxzZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRDMyRlM4JywgNSwgMiwgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIHRydWUsIHRydWUsIGZhbHNlKSxcclxuXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQkMxJywgMSwgMywgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQkMxX0FMUEhBJywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzFfU1JHQicsIDEsIDMsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0JDMV9TUkdCX0FMUEhBJywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzInLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0JDMl9TUkdCJywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzMnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0JDM19TUkdCJywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzQnLCAxLCAxLCBHRlhGb3JtYXRUeXBlLlVOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzRfU05PUk0nLCAxLCAxLCBHRlhGb3JtYXRUeXBlLlNOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzUnLCAxLCAyLCBHRlhGb3JtYXRUeXBlLlVOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzVfU05PUk0nLCAxLCAyLCBHRlhGb3JtYXRUeXBlLlNOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzZIX1VGMTYnLCAxLCAzLCBHRlhGb3JtYXRUeXBlLlVGTE9BVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQkM2SF9TRjE2JywgMSwgMywgR0ZYRm9ybWF0VHlwZS5GTE9BVCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQkM3JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdCQzdfU1JHQicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0VUQ19SR0I4JywgMSwgMywgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRVRDMl9SR0I4JywgMSwgMywgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRVRDMl9TUkdCOCcsIDEsIDMsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0VUQzJfUkdCOF9BMScsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRVRDMl9TUkdCOF9BMScsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRVRDMl9SR0JBOCcsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRVRDMl9TUkdCOF9BOCcsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRUFDX1IxMScsIDEsIDEsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0VBQ19SMTFTTicsIDEsIDEsIEdGWEZvcm1hdFR5cGUuU05PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0VBQ19SRzExJywgMiwgMiwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnRUFDX1JHMTFTTicsIDIsIDIsIEdGWEZvcm1hdFR5cGUuU05PUk0sIGZhbHNlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG5cclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdQVlJUQ19SR0IyJywgMiwgMywgR0ZYRm9ybWF0VHlwZS5VTk9STSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUFZSVENfUkdCQTInLCAyLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1BWUlRDX1JHQjQnLCAyLCAzLCBHRlhGb3JtYXRUeXBlLlVOT1JNLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdQVlJUQ19SR0JBNCcsIDIsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnUFZSVEMyXzJCUFAnLCAyLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ1BWUlRDMl80QlBQJywgMiwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzR4NCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzV4NCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzV4NScsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzZ4NScsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzZ4NicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzh4NScsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzh4NicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzh4OCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzEweDUnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfUkdCQV8xMHg2JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1JHQkFfMTB4OCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19SR0JBXzEweDEwJywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1JHQkFfMTJ4MTAnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfUkdCQV8xMngxMicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcblxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfU1JHQkFfNHg0JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1NSR0JBXzV4NCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV81eDUnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfU1JHQkFfNng1JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1NSR0JBXzZ4NicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV84eDUnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfU1JHQkFfOHg2JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1NSR0JBXzh4OCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV8xMHg1JywgMSwgNCwgR0ZYRm9ybWF0VHlwZS5VTk9STSwgdHJ1ZSwgZmFsc2UsIGZhbHNlLCB0cnVlKSxcclxuICAgIG5ldyBHRlhGb3JtYXRJbmZvKCdBU1RDX1NSR0JBXzEweDYnLCAxLCA0LCBHRlhGb3JtYXRUeXBlLlVOT1JNLCB0cnVlLCBmYWxzZSwgZmFsc2UsIHRydWUpLFxyXG4gICAgbmV3IEdGWEZvcm1hdEluZm8oJ0FTVENfU1JHQkFfMTB4OCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV8xMHgxMCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV8xMngxMCcsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbiAgICBuZXcgR0ZYRm9ybWF0SW5mbygnQVNUQ19TUkdCQV8xMngxMicsIDEsIDQsIEdGWEZvcm1hdFR5cGUuVU5PUk0sIHRydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSksXHJcbl0pO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBHZXQgbWVtb3J5IHNpemUgb2YgdGhlIHNwZWNpZmllZCBmb21hdC5cclxuICogQHpoIOiOt+WPluaMh+WumuagvOW8j+WvueW6lOeahOWGheWtmOWkp+Wwj+OAglxyXG4gKiBAcGFyYW0gZm9ybWF0IFRoZSB0YXJnZXQgZm9ybWF0LlxyXG4gKiBAcGFyYW0gd2lkdGggVGhlIHRhcmdldCB3aWR0aC5cclxuICogQHBhcmFtIGhlaWdodCBUaGUgdGFyZ2V0IGhlaWdodC5cclxuICogQHBhcmFtIGRlcHRoIFRoZSB0YXJnZXQgZGVwdGguXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gR0ZYRm9ybWF0U2l6ZSAoZm9ybWF0OiBHRlhGb3JtYXQsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBkZXB0aDogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICBpZiAoIUdGWEZvcm1hdEluZm9zW2Zvcm1hdF0uaXNDb21wcmVzc2VkKSB7XHJcbiAgICAgICAgcmV0dXJuICh3aWR0aCAqIGhlaWdodCAqIGRlcHRoICogR0ZYRm9ybWF0SW5mb3NbZm9ybWF0XS5zaXplKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMxOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfQUxQSEE6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDMV9TUkdCOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzFfU1JHQl9BTFBIQTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyA0KSAqIE1hdGguY2VpbChoZWlnaHQgLyA0KSAqIDggKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMyOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzJfU1JHQjpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkMzOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzNfU1JHQjpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM0OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzRfU05PUk06XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDNkhfU0YxNjpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM2SF9VRjE2OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzc6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkJDN19TUkdCOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDQpICogTWF0aC5jZWlsKGhlaWdodCAvIDQpICogMTYgKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQkM1OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5CQzVfU05PUk06XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gNCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNCkgKiAzMiAqIGRlcHRoO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDX1JHQjg6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCODpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9TUkdCODpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuRVRDMl9SR0I4X0ExOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUjExOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUjExU046XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gNCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNCkgKiA4ICogZGVwdGg7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfUkdCQTg6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVUQzJfU1JHQjhfQTE6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkVBQ19SRzExOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5FQUNfUkcxMVNOOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDQpICogTWF0aC5jZWlsKGhlaWdodCAvIDQpICogMTYgKiBkZXB0aDtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQjI6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LlBWUlRDX1JHQkEyOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQzJfMkJQUDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwoTWF0aC5tYXgod2lkdGgsIDE2KSAqIE1hdGgubWF4KGhlaWdodCwgOCkgLyA0KSAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0I0OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5QVlJUQ19SR0JBNDpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuUFZSVEMyXzRCUFA6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKE1hdGgubWF4KHdpZHRoLCA4KSAqIE1hdGgubWF4KGhlaWdodCwgOCkgLyAyKSAqIGRlcHRoO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzR4NDpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV80eDQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gNCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNCkgKiAxNiAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfNXg0OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzV4NDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyA1KSAqIE1hdGguY2VpbChoZWlnaHQgLyA0KSAqIDE2ICogZGVwdGg7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV81eDU6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfNXg1OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDUpICogTWF0aC5jZWlsKGhlaWdodCAvIDUpICogMTYgKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzZ4NTpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV82eDU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gNikgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNSkgKiAxNiAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfNng2OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzZ4NjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyA2KSAqIE1hdGguY2VpbChoZWlnaHQgLyA2KSAqIDE2ICogZGVwdGg7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV84eDU6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfOHg1OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDgpICogTWF0aC5jZWlsKGhlaWdodCAvIDUpICogMTYgKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzh4NjpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV84eDY6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gOCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNikgKiAxNiAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfOHg4OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzh4ODpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyA4KSAqIE1hdGguY2VpbChoZWlnaHQgLyA4KSAqIDE2ICogZGVwdGg7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHg1OlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEweDU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gMTApICogTWF0aC5jZWlsKGhlaWdodCAvIDUpICogMTYgKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEweDY6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTB4NjpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyAxMCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gNikgKiAxNiAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTB4ODpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHg4OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDEwKSAqIE1hdGguY2VpbChoZWlnaHQgLyA4KSAqIDE2ICogZGVwdGg7XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfUkdCQV8xMHgxMDpcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19TUkdCQV8xMHgxMDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwod2lkdGggLyAxMCkgKiBNYXRoLmNlaWwoaGVpZ2h0IC8gMTApICogMTYgKiBkZXB0aDtcclxuICAgICAgICAgICAgY2FzZSBHRlhGb3JtYXQuQVNUQ19SR0JBXzEyeDEwOlxyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1NSR0JBXzEyeDEwOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCh3aWR0aCAvIDEyKSAqIE1hdGguY2VpbChoZWlnaHQgLyAxMCkgKiAxNiAqIGRlcHRoO1xyXG4gICAgICAgICAgICBjYXNlIEdGWEZvcm1hdC5BU1RDX1JHQkFfMTJ4MTI6XHJcbiAgICAgICAgICAgIGNhc2UgR0ZYRm9ybWF0LkFTVENfU1JHQkFfMTJ4MTI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKHdpZHRoIC8gMTIpICogTWF0aC5jZWlsKGhlaWdodCAvIDEyKSAqIDE2ICogZGVwdGg7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBHZXQgbWVtb3J5IHNpemUgb2YgdGhlIHNwZWNpZmllZCBzdXJmYWNlLlxyXG4gKiBAemggR0ZYIOagvOW8j+ihqOmdouWGheWtmOWkp+Wwj+OAglxyXG4gKiBAcGFyYW0gZm9ybWF0IFRoZSB0YXJnZXQgZm9ybWF0LlxyXG4gKiBAcGFyYW0gd2lkdGggVGhlIHRhcmdldCB3aWR0aC5cclxuICogQHBhcmFtIGhlaWdodCBUaGUgdGFyZ2V0IGhlaWdodC5cclxuICogQHBhcmFtIGRlcHRoIFRoZSB0YXJnZXQgZGVwdGguXHJcbiAqIEBwYXJhbSBtaXBzIFRoZSB0YXJnZXQgbWlwIGxldmVscy5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBHRlhGb3JtYXRTdXJmYWNlU2l6ZSAoXHJcbiAgICBmb3JtYXQ6IEdGWEZvcm1hdCwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBkZXB0aDogbnVtYmVyLCBtaXBzOiBudW1iZXIpOiBudW1iZXIge1xyXG5cclxuICAgIGxldCBzaXplID0gMDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pcHM7ICsraSkge1xyXG4gICAgICAgIHNpemUgKz0gR0ZYRm9ybWF0U2l6ZShmb3JtYXQsIHdpZHRoLCBoZWlnaHQsIGRlcHRoKTtcclxuICAgICAgICB3aWR0aCA9IE1hdGgubWF4KHdpZHRoID4+IDEsIDEpO1xyXG4gICAgICAgIGhlaWdodCA9IE1hdGgubWF4KGhlaWdodCA+PiAxLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2l6ZTtcclxufVxyXG5cclxuY29uc3QgX3R5cGUyc2l6ZSA9IFtcclxuICAgIDAsICAvLyBVTktOT1dOXHJcbiAgICA0LCAgLy8gQk9PTFxyXG4gICAgOCwgIC8vIEJPT0wyXHJcbiAgICAxMiwgLy8gQk9PTDNcclxuICAgIDE2LCAvLyBCT09MNFxyXG4gICAgNCwgIC8vIElOVFxyXG4gICAgOCwgIC8vIElOVDJcclxuICAgIDEyLCAvLyBJTlQzXHJcbiAgICAxNiwgLy8gSU5UNFxyXG4gICAgNCwgIC8vIFVJTlRcclxuICAgIDgsICAvLyBVSU5UMlxyXG4gICAgMTIsIC8vIFVJTlQzXHJcbiAgICAxNiwgLy8gVUlOVDRcclxuICAgIDQsICAvLyBGTE9BVFxyXG4gICAgOCwgIC8vIEZMT0FUMlxyXG4gICAgMTIsIC8vIEZMT0FUM1xyXG4gICAgMTYsIC8vIEZMT0FUNFxyXG4gICAgMTYsIC8vIE1BVDJcclxuICAgIDI0LCAvLyBNQVQyWDNcclxuICAgIDMyLCAvLyBNQVQyWDRcclxuICAgIDI0LCAvLyBNQVQzWDJcclxuICAgIDM2LCAvLyBNQVQzXHJcbiAgICA0OCwgLy8gTUFUM1g0XHJcbiAgICAzMiwgLy8gTUFUNFgyXHJcbiAgICA0OCwgLy8gTUFUNFgzXHJcbiAgICA2NCwgLy8gTUFUNFxyXG4gICAgNCwgIC8vIFNBTVBMRVIxRFxyXG4gICAgNCwgIC8vIFNBTVBMRVIxRF9BUlJBWVxyXG4gICAgNCwgIC8vIFNBTVBMRVIyRFxyXG4gICAgNCwgIC8vIFNBTVBMRVIyRF9BUlJBWVxyXG4gICAgNCwgIC8vIFNBTVBMRVIzRFxyXG4gICAgNCwgIC8vIFNBTVBMRVJfQ1VCRVxyXG5dO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBHZXQgdGhlIG1lbW9yeSBzaXplIG9mIHRoZSBzcGVjaWZpZWQgdHlwZS5cclxuICogQHpoIOW+l+WIsCBHRlgg5pWw5o2u57G75Z6L55qE5aSn5bCP44CCXHJcbiAqIEBwYXJhbSB0eXBlIFRoZSB0YXJnZXQgdHlwZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBHRlhHZXRUeXBlU2l6ZSAodHlwZTogR0ZYVHlwZSk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gX3R5cGUyc2l6ZVt0eXBlXSB8fCAwO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yIChpbmZvOiBHRlhGb3JtYXRJbmZvKTogVHlwZWRBcnJheUNvbnN0cnVjdG9yIHtcclxuICAgIGNvbnN0IHN0cmlkZSA9IGluZm8uc2l6ZSAvIGluZm8uY291bnQ7XHJcbiAgICBzd2l0Y2ggKGluZm8udHlwZSkge1xyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5VTk9STTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdFR5cGUuVUlOVDoge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHN0cmlkZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gVWludDhBcnJheTtcclxuICAgICAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIFVpbnQxNkFycmF5O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gVWludDMyQXJyYXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhc2UgR0ZYRm9ybWF0VHlwZS5TTk9STTpcclxuICAgICAgICBjYXNlIEdGWEZvcm1hdFR5cGUuSU5UOiB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoc3RyaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6IHJldHVybiBJbnQ4QXJyYXk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6IHJldHVybiBJbnQxNkFycmF5O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gSW50MzJBcnJheTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBHRlhGb3JtYXRUeXBlLkZMT0FUOiB7XHJcbiAgICAgICAgICAgIHJldHVybiBGbG9hdDMyQXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIEZsb2F0MzJBcnJheTtcclxufVxyXG4iXX0=