'use strict';

/**
 * enums
 */
const enums = {
  // buffer usage
  USAGE_STATIC: 35044,  // gl.STATIC_DRAW
  USAGE_DYNAMIC: 35048, // gl.DYNAMIC_DRAW
  USAGE_STREAM: 35040,  // gl.STREAM_DRAW

  // index buffer format
  INDEX_FMT_UINT8: 5121,  // gl.UNSIGNED_BYTE
  INDEX_FMT_UINT16: 5123, // gl.UNSIGNED_SHORT
  INDEX_FMT_UINT32: 5125, // gl.UNSIGNED_INT (OES_element_index_uint)

  // vertex attribute semantic
  ATTR_POSITION: 'a_position',
  ATTR_NORMAL: 'a_normal',
  ATTR_TANGENT: 'a_tangent',
  ATTR_BITANGENT: 'a_bitangent',
  ATTR_WEIGHTS: 'a_weights',
  ATTR_JOINTS: 'a_joints',
  ATTR_COLOR: 'a_color',
  ATTR_COLOR0: 'a_color0',
  ATTR_COLOR1: 'a_color1',
  ATTR_UV: 'a_uv',
  ATTR_UV0: 'a_uv0',
  ATTR_UV1: 'a_uv1',
  ATTR_UV2: 'a_uv2',
  ATTR_UV3: 'a_uv3',
  ATTR_UV4: 'a_uv4',
  ATTR_UV5: 'a_uv5',
  ATTR_UV6: 'a_uv6',
  ATTR_UV7: 'a_uv7',

  // vertex attribute type
  ATTR_TYPE_INT8: 5120,    // gl.BYTE
  ATTR_TYPE_UINT8: 5121,   // gl.UNSIGNED_BYTE
  ATTR_TYPE_INT16: 5122,   // gl.SHORT
  ATTR_TYPE_UINT16: 5123,  // gl.UNSIGNED_SHORT
  ATTR_TYPE_INT32: 5124,   // gl.INT
  ATTR_TYPE_UINT32: 5125,  // gl.UNSIGNED_INT
  ATTR_TYPE_FLOAT32: 5126, // gl.FLOAT

  // texture filter
  FILTER_NEAREST: 0,
  FILTER_LINEAR: 1,

  // texture wrap mode
  WRAP_REPEAT: 10497, // gl.REPEAT
  WRAP_CLAMP: 33071,  // gl.CLAMP_TO_EDGE
  WRAP_MIRROR: 33648, // gl.MIRRORED_REPEAT

  // texture format
  // compress formats
  TEXTURE_FMT_RGB_DXT1: 0,
  TEXTURE_FMT_RGBA_DXT1: 1,
  TEXTURE_FMT_RGBA_DXT3: 2,
  TEXTURE_FMT_RGBA_DXT5: 3,
  TEXTURE_FMT_RGB_ETC1: 4,
  TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5,
  TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6,
  TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7,
  TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8,

  // normal formats
  TEXTURE_FMT_A8: 9,
  TEXTURE_FMT_L8: 10,
  TEXTURE_FMT_L8_A8: 11,
  TEXTURE_FMT_R5_G6_B5: 12,
  TEXTURE_FMT_R5_G5_B5_A1: 13,
  TEXTURE_FMT_R4_G4_B4_A4: 14,
  TEXTURE_FMT_RGB8: 15,
  TEXTURE_FMT_RGBA8: 16,
  TEXTURE_FMT_RGB16F: 17,
  TEXTURE_FMT_RGBA16F: 18,
  TEXTURE_FMT_RGB32F: 19,
  TEXTURE_FMT_RGBA32F: 20,
  TEXTURE_FMT_R32F: 21,
  TEXTURE_FMT_111110F: 22,
  TEXTURE_FMT_SRGB: 23,
  TEXTURE_FMT_SRGBA: 24,

  // depth formats
  TEXTURE_FMT_D16: 25,
  TEXTURE_FMT_D32: 26,
  TEXTURE_FMT_D24S8: 27,

  // etc2 format
  TEXTURE_FMT_RGB_ETC2: 28,
  TEXTURE_FMT_RGBA_ETC2: 29,

  // depth and stencil function
  DS_FUNC_NEVER: 512,    // gl.NEVER
  DS_FUNC_LESS: 513,     // gl.LESS
  DS_FUNC_EQUAL: 514,    // gl.EQUAL
  DS_FUNC_LEQUAL: 515,   // gl.LEQUAL
  DS_FUNC_GREATER: 516,  // gl.GREATER
  DS_FUNC_NOTEQUAL: 517, // gl.NOTEQUAL
  DS_FUNC_GEQUAL: 518,   // gl.GEQUAL
  DS_FUNC_ALWAYS: 519,   // gl.ALWAYS

  // render-buffer format
  RB_FMT_RGBA4: 32854,    // gl.RGBA4
  RB_FMT_RGB5_A1: 32855,  // gl.RGB5_A1
  RB_FMT_RGB565: 36194,   // gl.RGB565
  RB_FMT_D16: 33189,      // gl.DEPTH_COMPONENT16
  RB_FMT_S8: 36168,       // gl.STENCIL_INDEX8
  RB_FMT_D24S8: 34041,    // gl.DEPTH_STENCIL

  // blend-equation
  BLEND_FUNC_ADD: 32774,              // gl.FUNC_ADD
  BLEND_FUNC_SUBTRACT: 32778,         // gl.FUNC_SUBTRACT
  BLEND_FUNC_REVERSE_SUBTRACT: 32779, // gl.FUNC_REVERSE_SUBTRACT

  // blend
  BLEND_ZERO: 0,                          // gl.ZERO
  BLEND_ONE: 1,                           // gl.ONE
  BLEND_SRC_COLOR: 768,                   // gl.SRC_COLOR
  BLEND_ONE_MINUS_SRC_COLOR: 769,         // gl.ONE_MINUS_SRC_COLOR
  BLEND_DST_COLOR: 774,                   // gl.DST_COLOR
  BLEND_ONE_MINUS_DST_COLOR: 775,         // gl.ONE_MINUS_DST_COLOR
  BLEND_SRC_ALPHA: 770,                   // gl.SRC_ALPHA
  BLEND_ONE_MINUS_SRC_ALPHA: 771,         // gl.ONE_MINUS_SRC_ALPHA
  BLEND_DST_ALPHA: 772,                   // gl.DST_ALPHA
  BLEND_ONE_MINUS_DST_ALPHA: 773,         // gl.ONE_MINUS_DST_ALPHA
  BLEND_CONSTANT_COLOR: 32769,            // gl.CONSTANT_COLOR
  BLEND_ONE_MINUS_CONSTANT_COLOR: 32770,  // gl.ONE_MINUS_CONSTANT_COLOR
  BLEND_CONSTANT_ALPHA: 32771,            // gl.CONSTANT_ALPHA
  BLEND_ONE_MINUS_CONSTANT_ALPHA: 32772,  // gl.ONE_MINUS_CONSTANT_ALPHA
  BLEND_SRC_ALPHA_SATURATE: 776,          // gl.SRC_ALPHA_SATURATE

  // stencil operation
  STENCIL_DISABLE: 0,             // disable stencil
  STENCIL_ENABLE: 1,              // enable stencil
  STENCIL_INHERIT: 2,             // inherit stencil states

  STENCIL_OP_KEEP: 7680,          // gl.KEEP
  STENCIL_OP_ZERO: 0,             // gl.ZERO
  STENCIL_OP_REPLACE: 7681,       // gl.REPLACE
  STENCIL_OP_INCR: 7682,          // gl.INCR
  STENCIL_OP_INCR_WRAP: 34055,    // gl.INCR_WRAP
  STENCIL_OP_DECR: 7683,          // gl.DECR
  STENCIL_OP_DECR_WRAP: 34056,    // gl.DECR_WRAP
  STENCIL_OP_INVERT: 5386,        // gl.INVERT

  // cull
  CULL_NONE: 0,
  CULL_FRONT: 1028,
  CULL_BACK: 1029,
  CULL_FRONT_AND_BACK: 1032,

  // primitive type
  PT_POINTS: 0,         // gl.POINTS
  PT_LINES: 1,          // gl.LINES
  PT_LINE_LOOP: 2,      // gl.LINE_LOOP
  PT_LINE_STRIP: 3,     // gl.LINE_STRIP
  PT_TRIANGLES: 4,      // gl.TRIANGLES
  PT_TRIANGLE_STRIP: 5, // gl.TRIANGLE_STRIP
  PT_TRIANGLE_FAN: 6,   // gl.TRIANGLE_FAN
};

let RenderQueue = {
    OPAQUE: 0,
    TRANSPARENT: 1,
    OVERLAY: 2
};

/**
 * JS Implementation of MurmurHash2
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

function murmurhash2_32_gc(str, seed) {
  var
    l = str.length,
    h = seed ^ l,
    i = 0,
    k;
  
  while (l >= 4) {
  	k = 
  	  ((str.charCodeAt(i) & 0xff)) |
  	  ((str.charCodeAt(++i) & 0xff) << 8) |
  	  ((str.charCodeAt(++i) & 0xff) << 16) |
  	  ((str.charCodeAt(++i) & 0xff) << 24);
    
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

	h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

    l -= 4;
    ++i;
  }
  
  switch (l) {
  case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
  case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
  case 1: h ^= (str.charCodeAt(i) & 0xff);
          h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }

  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;

  return h >>> 0;
}

// Extensions
var WebGLEXT;
(function (WebGLEXT) {
    WebGLEXT[WebGLEXT["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_SRGB_S3TC_DXT1_EXT"] = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"] = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"] = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"] = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
    WebGLEXT[WebGLEXT["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
    WebGLEXT[WebGLEXT["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
    WebGLEXT[WebGLEXT["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
    WebGLEXT[WebGLEXT["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
    WebGLEXT[WebGLEXT["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
})(WebGLEXT || (WebGLEXT = {}));
var GFXObjectType;
(function (GFXObjectType) {
    GFXObjectType[GFXObjectType["UNKNOWN"] = 0] = "UNKNOWN";
    GFXObjectType[GFXObjectType["BUFFER"] = 1] = "BUFFER";
    GFXObjectType[GFXObjectType["TEXTURE"] = 2] = "TEXTURE";
    GFXObjectType[GFXObjectType["TEXTURE_VIEW"] = 3] = "TEXTURE_VIEW";
    GFXObjectType[GFXObjectType["RENDER_PASS"] = 4] = "RENDER_PASS";
    GFXObjectType[GFXObjectType["FRAMEBUFFER"] = 5] = "FRAMEBUFFER";
    GFXObjectType[GFXObjectType["SAMPLER"] = 6] = "SAMPLER";
    GFXObjectType[GFXObjectType["SHADER"] = 7] = "SHADER";
    GFXObjectType[GFXObjectType["PIPELINE_LAYOUT"] = 8] = "PIPELINE_LAYOUT";
    GFXObjectType[GFXObjectType["PIPELINE_STATE"] = 9] = "PIPELINE_STATE";
    GFXObjectType[GFXObjectType["BINDING_LAYOUT"] = 10] = "BINDING_LAYOUT";
    GFXObjectType[GFXObjectType["INPUT_ASSEMBLER"] = 11] = "INPUT_ASSEMBLER";
    GFXObjectType[GFXObjectType["COMMAND_ALLOCATOR"] = 12] = "COMMAND_ALLOCATOR";
    GFXObjectType[GFXObjectType["COMMAND_BUFFER"] = 13] = "COMMAND_BUFFER";
    GFXObjectType[GFXObjectType["QUEUE"] = 14] = "QUEUE";
    GFXObjectType[GFXObjectType["WINDOW"] = 15] = "WINDOW";
})(GFXObjectType || (GFXObjectType = {}));
var GFXStatus;
(function (GFXStatus) {
    GFXStatus[GFXStatus["UNREADY"] = 0] = "UNREADY";
    GFXStatus[GFXStatus["FAILED"] = 1] = "FAILED";
    GFXStatus[GFXStatus["SUCCESS"] = 2] = "SUCCESS";
})(GFXStatus || (GFXStatus = {}));
var GFXObject = /** @class */ (function () {
    function GFXObject(gfxType) {
        this._gfxType = GFXObjectType.UNKNOWN;
        this._status = GFXStatus.UNREADY;
        this._gfxType = gfxType;
    }
    Object.defineProperty(GFXObject.prototype, "gfxType", {
        get: function () {
            return this._gfxType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GFXObject.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    return GFXObject;
}());
var GFXAttributeName;
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
})(GFXAttributeName || (GFXAttributeName = {}));
var GFXType;
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
    GFXType[GFXType["COLOR4"] = 17] = "COLOR4";
    GFXType[GFXType["MAT2"] = 18] = "MAT2";
    GFXType[GFXType["MAT2X3"] = 19] = "MAT2X3";
    GFXType[GFXType["MAT2X4"] = 20] = "MAT2X4";
    GFXType[GFXType["MAT3X2"] = 21] = "MAT3X2";
    GFXType[GFXType["MAT3"] = 22] = "MAT3";
    GFXType[GFXType["MAT3X4"] = 23] = "MAT3X4";
    GFXType[GFXType["MAT4X2"] = 24] = "MAT4X2";
    GFXType[GFXType["MAT4X3"] = 25] = "MAT4X3";
    GFXType[GFXType["MAT4"] = 26] = "MAT4";
    GFXType[GFXType["SAMPLER1D"] = 27] = "SAMPLER1D";
    GFXType[GFXType["SAMPLER1D_ARRAY"] = 28] = "SAMPLER1D_ARRAY";
    GFXType[GFXType["SAMPLER2D"] = 29] = "SAMPLER2D";
    GFXType[GFXType["SAMPLER2D_ARRAY"] = 30] = "SAMPLER2D_ARRAY";
    GFXType[GFXType["SAMPLER3D"] = 31] = "SAMPLER3D";
    GFXType[GFXType["SAMPLER_CUBE"] = 32] = "SAMPLER_CUBE";
    GFXType[GFXType["COUNT"] = 33] = "COUNT";
})(GFXType || (GFXType = {}));
var GFXFormat;
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
    GFXFormat[GFXFormat["SRGB8_A8"] = 36] = "SRGB8_A8";
    GFXFormat[GFXFormat["RGBA8SN"] = 37] = "RGBA8SN";
    GFXFormat[GFXFormat["RGBA8UI"] = 38] = "RGBA8UI";
    GFXFormat[GFXFormat["RGBA8I"] = 39] = "RGBA8I";
    GFXFormat[GFXFormat["RGBA16F"] = 40] = "RGBA16F";
    GFXFormat[GFXFormat["RGBA16UI"] = 41] = "RGBA16UI";
    GFXFormat[GFXFormat["RGBA16I"] = 42] = "RGBA16I";
    GFXFormat[GFXFormat["RGBA32F"] = 43] = "RGBA32F";
    GFXFormat[GFXFormat["RGBA32UI"] = 44] = "RGBA32UI";
    GFXFormat[GFXFormat["RGBA32I"] = 45] = "RGBA32I";
    // Special Format
    GFXFormat[GFXFormat["R5G6B5"] = 46] = "R5G6B5";
    GFXFormat[GFXFormat["R11G11B10F"] = 47] = "R11G11B10F";
    GFXFormat[GFXFormat["RGB5A1"] = 48] = "RGB5A1";
    GFXFormat[GFXFormat["RGBA4"] = 49] = "RGBA4";
    GFXFormat[GFXFormat["RGB10A2"] = 50] = "RGB10A2";
    GFXFormat[GFXFormat["RGB10A2UI"] = 51] = "RGB10A2UI";
    GFXFormat[GFXFormat["RGB9E5"] = 52] = "RGB9E5";
    // Depth-Stencil Format
    GFXFormat[GFXFormat["D16"] = 53] = "D16";
    GFXFormat[GFXFormat["D16S8"] = 54] = "D16S8";
    GFXFormat[GFXFormat["D24"] = 55] = "D24";
    GFXFormat[GFXFormat["D24S8"] = 56] = "D24S8";
    GFXFormat[GFXFormat["D32F"] = 57] = "D32F";
    GFXFormat[GFXFormat["D32F_S8"] = 58] = "D32F_S8";
    // Compressed Format
    // Block Compression Format, DDS (DirectDraw Surface)
    // DXT1: 3 channels (5:6:5), 1/8 origianl size, with 0 or 1 bit of alpha
    GFXFormat[GFXFormat["BC1"] = 59] = "BC1";
    GFXFormat[GFXFormat["BC1_ALPHA"] = 60] = "BC1_ALPHA";
    GFXFormat[GFXFormat["BC1_SRGB"] = 61] = "BC1_SRGB";
    GFXFormat[GFXFormat["BC1_SRGB_ALPHA"] = 62] = "BC1_SRGB_ALPHA";
    // DXT3: 4 channels (5:6:5), 1/4 origianl size, with 4 bits of alpha
    GFXFormat[GFXFormat["BC2"] = 63] = "BC2";
    GFXFormat[GFXFormat["BC2_SRGB"] = 64] = "BC2_SRGB";
    // DXT5: 4 channels (5:6:5), 1/4 origianl size, with 8 bits of alpha
    GFXFormat[GFXFormat["BC3"] = 65] = "BC3";
    GFXFormat[GFXFormat["BC3_SRGB"] = 66] = "BC3_SRGB";
    // 1 channel (8), 1/4 origianl size
    GFXFormat[GFXFormat["BC4"] = 67] = "BC4";
    GFXFormat[GFXFormat["BC4_SNORM"] = 68] = "BC4_SNORM";
    // 2 channels (8:8), 1/2 origianl size
    GFXFormat[GFXFormat["BC5"] = 69] = "BC5";
    GFXFormat[GFXFormat["BC5_SNORM"] = 70] = "BC5_SNORM";
    // 3 channels (16:16:16), half-floating point, 1/6 origianl size
    // UF16: unsigned float, 5 exponent bits + 11 mantissa bits
    // SF16: signed float, 1 signed bit + 5 exponent bits + 10 mantissa bits
    GFXFormat[GFXFormat["BC6H_UF16"] = 71] = "BC6H_UF16";
    GFXFormat[GFXFormat["BC6H_SF16"] = 72] = "BC6H_SF16";
    // 4 channels (4~7 bits per channel) with 0 to 8 bits of alpha, 1/3 original size
    GFXFormat[GFXFormat["BC7"] = 73] = "BC7";
    GFXFormat[GFXFormat["BC7_SRGB"] = 74] = "BC7_SRGB";
    // Ericsson Texture Compression Format
    GFXFormat[GFXFormat["ETC_RGB8"] = 75] = "ETC_RGB8";
    GFXFormat[GFXFormat["ETC2_RGB8"] = 76] = "ETC2_RGB8";
    GFXFormat[GFXFormat["ETC2_SRGB8"] = 77] = "ETC2_SRGB8";
    GFXFormat[GFXFormat["ETC2_RGB8_A1"] = 78] = "ETC2_RGB8_A1";
    GFXFormat[GFXFormat["ETC2_SRGB8_A1"] = 79] = "ETC2_SRGB8_A1";
    GFXFormat[GFXFormat["ETC2_RGBA8"] = 80] = "ETC2_RGBA8";
    GFXFormat[GFXFormat["ETC2_SRGB8_A8"] = 81] = "ETC2_SRGB8_A8";
    GFXFormat[GFXFormat["EAC_R11"] = 82] = "EAC_R11";
    GFXFormat[GFXFormat["EAC_R11SN"] = 83] = "EAC_R11SN";
    GFXFormat[GFXFormat["EAC_RG11"] = 84] = "EAC_RG11";
    GFXFormat[GFXFormat["EAC_RG11SN"] = 85] = "EAC_RG11SN";
    // PVRTC (PowerVR)
    GFXFormat[GFXFormat["PVRTC_RGB2"] = 86] = "PVRTC_RGB2";
    GFXFormat[GFXFormat["PVRTC_RGBA2"] = 87] = "PVRTC_RGBA2";
    GFXFormat[GFXFormat["PVRTC_RGB4"] = 88] = "PVRTC_RGB4";
    GFXFormat[GFXFormat["PVRTC_RGBA4"] = 89] = "PVRTC_RGBA4";
    GFXFormat[GFXFormat["PVRTC2_2BPP"] = 90] = "PVRTC2_2BPP";
    GFXFormat[GFXFormat["PVRTC2_4BPP"] = 91] = "PVRTC2_4BPP";
})(GFXFormat || (GFXFormat = {}));
var GFXBufferUsageBit;
(function (GFXBufferUsageBit) {
    GFXBufferUsageBit[GFXBufferUsageBit["NONE"] = 0] = "NONE";
    GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_SRC"] = 1] = "TRANSFER_SRC";
    GFXBufferUsageBit[GFXBufferUsageBit["TRANSFER_DST"] = 2] = "TRANSFER_DST";
    GFXBufferUsageBit[GFXBufferUsageBit["INDEX"] = 4] = "INDEX";
    GFXBufferUsageBit[GFXBufferUsageBit["VERTEX"] = 8] = "VERTEX";
    GFXBufferUsageBit[GFXBufferUsageBit["UNIFORM"] = 16] = "UNIFORM";
    GFXBufferUsageBit[GFXBufferUsageBit["STORAGE"] = 32] = "STORAGE";
    GFXBufferUsageBit[GFXBufferUsageBit["INDIRECT"] = 64] = "INDIRECT";
})(GFXBufferUsageBit || (GFXBufferUsageBit = {}));
var GFXMemoryUsageBit;
(function (GFXMemoryUsageBit) {
    GFXMemoryUsageBit[GFXMemoryUsageBit["NONE"] = 0] = "NONE";
    GFXMemoryUsageBit[GFXMemoryUsageBit["DEVICE"] = 1] = "DEVICE";
    GFXMemoryUsageBit[GFXMemoryUsageBit["HOST"] = 2] = "HOST";
})(GFXMemoryUsageBit || (GFXMemoryUsageBit = {}));
var GFXBufferAccessBit;
(function (GFXBufferAccessBit) {
    GFXBufferAccessBit[GFXBufferAccessBit["NONE"] = 0] = "NONE";
    GFXBufferAccessBit[GFXBufferAccessBit["READ"] = 1] = "READ";
    GFXBufferAccessBit[GFXBufferAccessBit["WRITE"] = 2] = "WRITE";
})(GFXBufferAccessBit || (GFXBufferAccessBit = {}));
var GFXPrimitiveMode;
(function (GFXPrimitiveMode) {
    GFXPrimitiveMode[GFXPrimitiveMode["POINT_LIST"] = 0] = "POINT_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST"] = 1] = "LINE_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP"] = 2] = "LINE_STRIP";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LOOP"] = 3] = "LINE_LOOP";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_LIST_ADJACENCY"] = 4] = "LINE_LIST_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["LINE_STRIP_ADJACENCY"] = 5] = "LINE_STRIP_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["ISO_LINE_LIST"] = 6] = "ISO_LINE_LIST";
    // raycast detectable:
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST"] = 7] = "TRIANGLE_LIST";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP"] = 8] = "TRIANGLE_STRIP";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_FAN"] = 9] = "TRIANGLE_FAN";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_LIST_ADJACENCY"] = 10] = "TRIANGLE_LIST_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_STRIP_ADJACENCY"] = 11] = "TRIANGLE_STRIP_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["TRIANGLE_PATCH_ADJACENCY"] = 12] = "TRIANGLE_PATCH_ADJACENCY";
    GFXPrimitiveMode[GFXPrimitiveMode["QUAD_PATCH_LIST"] = 13] = "QUAD_PATCH_LIST";
})(GFXPrimitiveMode || (GFXPrimitiveMode = {}));
var GFXPolygonMode;
(function (GFXPolygonMode) {
    GFXPolygonMode[GFXPolygonMode["FILL"] = 0] = "FILL";
    GFXPolygonMode[GFXPolygonMode["POINT"] = 1] = "POINT";
    GFXPolygonMode[GFXPolygonMode["LINE"] = 2] = "LINE";
})(GFXPolygonMode || (GFXPolygonMode = {}));
var GFXShadeModel;
(function (GFXShadeModel) {
    GFXShadeModel[GFXShadeModel["GOURAND"] = 0] = "GOURAND";
    GFXShadeModel[GFXShadeModel["FLAT"] = 1] = "FLAT";
})(GFXShadeModel || (GFXShadeModel = {}));
var GFXCullMode;
(function (GFXCullMode) {
    GFXCullMode[GFXCullMode["NONE"] = 0] = "NONE";
    GFXCullMode[GFXCullMode["FRONT"] = 1] = "FRONT";
    GFXCullMode[GFXCullMode["BACK"] = 2] = "BACK";
})(GFXCullMode || (GFXCullMode = {}));
var GFXComparisonFunc;
(function (GFXComparisonFunc) {
    GFXComparisonFunc[GFXComparisonFunc["NEVER"] = 0] = "NEVER";
    GFXComparisonFunc[GFXComparisonFunc["LESS"] = 1] = "LESS";
    GFXComparisonFunc[GFXComparisonFunc["EQUAL"] = 2] = "EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["LESS_EQUAL"] = 3] = "LESS_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["GREATER"] = 4] = "GREATER";
    GFXComparisonFunc[GFXComparisonFunc["NOT_EQUAL"] = 5] = "NOT_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["GREATER_EQUAL"] = 6] = "GREATER_EQUAL";
    GFXComparisonFunc[GFXComparisonFunc["ALWAYS"] = 7] = "ALWAYS";
})(GFXComparisonFunc || (GFXComparisonFunc = {}));
var GFXStencilOp;
(function (GFXStencilOp) {
    GFXStencilOp[GFXStencilOp["ZERO"] = 0] = "ZERO";
    GFXStencilOp[GFXStencilOp["KEEP"] = 1] = "KEEP";
    GFXStencilOp[GFXStencilOp["REPLACE"] = 2] = "REPLACE";
    GFXStencilOp[GFXStencilOp["INCR"] = 3] = "INCR";
    GFXStencilOp[GFXStencilOp["DECR"] = 4] = "DECR";
    GFXStencilOp[GFXStencilOp["INVERT"] = 5] = "INVERT";
    GFXStencilOp[GFXStencilOp["INCR_WRAP"] = 6] = "INCR_WRAP";
    GFXStencilOp[GFXStencilOp["DECR_WRAP"] = 7] = "DECR_WRAP";
})(GFXStencilOp || (GFXStencilOp = {}));
var GFXBlendOp;
(function (GFXBlendOp) {
    GFXBlendOp[GFXBlendOp["ADD"] = 0] = "ADD";
    GFXBlendOp[GFXBlendOp["SUB"] = 1] = "SUB";
    GFXBlendOp[GFXBlendOp["REV_SUB"] = 2] = "REV_SUB";
    GFXBlendOp[GFXBlendOp["MIN"] = 3] = "MIN";
    GFXBlendOp[GFXBlendOp["MAX"] = 4] = "MAX";
})(GFXBlendOp || (GFXBlendOp = {}));
var GFXBlendFactor;
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
})(GFXBlendFactor || (GFXBlendFactor = {}));
var GFXColorMask;
(function (GFXColorMask) {
    GFXColorMask[GFXColorMask["NONE"] = 0] = "NONE";
    GFXColorMask[GFXColorMask["R"] = 1] = "R";
    GFXColorMask[GFXColorMask["G"] = 2] = "G";
    GFXColorMask[GFXColorMask["B"] = 4] = "B";
    GFXColorMask[GFXColorMask["A"] = 8] = "A";
    GFXColorMask[GFXColorMask["ALL"] = 15] = "ALL";
})(GFXColorMask || (GFXColorMask = {}));
var GFXFilter;
(function (GFXFilter) {
    GFXFilter[GFXFilter["NONE"] = 0] = "NONE";
    GFXFilter[GFXFilter["POINT"] = 1] = "POINT";
    GFXFilter[GFXFilter["LINEAR"] = 2] = "LINEAR";
    GFXFilter[GFXFilter["ANISOTROPIC"] = 3] = "ANISOTROPIC";
})(GFXFilter || (GFXFilter = {}));
var GFXAddress;
(function (GFXAddress) {
    GFXAddress[GFXAddress["WRAP"] = 0] = "WRAP";
    GFXAddress[GFXAddress["MIRROR"] = 1] = "MIRROR";
    GFXAddress[GFXAddress["CLAMP"] = 2] = "CLAMP";
    GFXAddress[GFXAddress["BORDER"] = 3] = "BORDER";
})(GFXAddress || (GFXAddress = {}));
var GFXTextureType;
(function (GFXTextureType) {
    GFXTextureType[GFXTextureType["TEX1D"] = 0] = "TEX1D";
    GFXTextureType[GFXTextureType["TEX2D"] = 1] = "TEX2D";
    GFXTextureType[GFXTextureType["TEX3D"] = 2] = "TEX3D";
})(GFXTextureType || (GFXTextureType = {}));
var GFXTextureUsageBit;
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
})(GFXTextureUsageBit || (GFXTextureUsageBit = {}));
var GFXSampleCount;
(function (GFXSampleCount) {
    GFXSampleCount[GFXSampleCount["X1"] = 0] = "X1";
    GFXSampleCount[GFXSampleCount["X2"] = 1] = "X2";
    GFXSampleCount[GFXSampleCount["X4"] = 2] = "X4";
    GFXSampleCount[GFXSampleCount["X8"] = 3] = "X8";
    GFXSampleCount[GFXSampleCount["X16"] = 4] = "X16";
    GFXSampleCount[GFXSampleCount["X32"] = 5] = "X32";
    GFXSampleCount[GFXSampleCount["X64"] = 6] = "X64";
})(GFXSampleCount || (GFXSampleCount = {}));
var GFXTextureFlagBit;
(function (GFXTextureFlagBit) {
    GFXTextureFlagBit[GFXTextureFlagBit["NONE"] = 0] = "NONE";
    GFXTextureFlagBit[GFXTextureFlagBit["GEN_MIPMAP"] = 1] = "GEN_MIPMAP";
    GFXTextureFlagBit[GFXTextureFlagBit["CUBEMAP"] = 2] = "CUBEMAP";
    GFXTextureFlagBit[GFXTextureFlagBit["BAKUP_BUFFER"] = 4] = "BAKUP_BUFFER";
})(GFXTextureFlagBit || (GFXTextureFlagBit = {}));
var GFXTextureViewType;
(function (GFXTextureViewType) {
    GFXTextureViewType[GFXTextureViewType["TV1D"] = 0] = "TV1D";
    GFXTextureViewType[GFXTextureViewType["TV2D"] = 1] = "TV2D";
    GFXTextureViewType[GFXTextureViewType["TV3D"] = 2] = "TV3D";
    GFXTextureViewType[GFXTextureViewType["CUBE"] = 3] = "CUBE";
    GFXTextureViewType[GFXTextureViewType["TV1D_ARRAY"] = 4] = "TV1D_ARRAY";
    GFXTextureViewType[GFXTextureViewType["TV2D_ARRAY"] = 5] = "TV2D_ARRAY";
})(GFXTextureViewType || (GFXTextureViewType = {}));
var GFXShaderType;
(function (GFXShaderType) {
    GFXShaderType[GFXShaderType["VERTEX"] = 0] = "VERTEX";
    GFXShaderType[GFXShaderType["HULL"] = 1] = "HULL";
    GFXShaderType[GFXShaderType["DOMAIN"] = 2] = "DOMAIN";
    GFXShaderType[GFXShaderType["GEOMETRY"] = 3] = "GEOMETRY";
    GFXShaderType[GFXShaderType["FRAGMENT"] = 4] = "FRAGMENT";
    GFXShaderType[GFXShaderType["COMPUTE"] = 5] = "COMPUTE";
    GFXShaderType[GFXShaderType["COUNT"] = 6] = "COUNT";
})(GFXShaderType || (GFXShaderType = {}));
var GFXBindingType;
(function (GFXBindingType) {
    GFXBindingType[GFXBindingType["UNKNOWN"] = 0] = "UNKNOWN";
    GFXBindingType[GFXBindingType["UNIFORM_BUFFER"] = 1] = "UNIFORM_BUFFER";
    GFXBindingType[GFXBindingType["SAMPLER"] = 2] = "SAMPLER";
    GFXBindingType[GFXBindingType["STORAGE_BUFFER"] = 3] = "STORAGE_BUFFER";
})(GFXBindingType || (GFXBindingType = {}));
var GFXCommandBufferType;
(function (GFXCommandBufferType) {
    GFXCommandBufferType[GFXCommandBufferType["PRIMARY"] = 0] = "PRIMARY";
    GFXCommandBufferType[GFXCommandBufferType["SECONDARY"] = 1] = "SECONDARY";
})(GFXCommandBufferType || (GFXCommandBufferType = {}));
// Enumeration all possible values of operations to be performed on initially Loading a Framebuffer Object.
var GFXLoadOp;
(function (GFXLoadOp) {
    GFXLoadOp[GFXLoadOp["LOAD"] = 0] = "LOAD";
    GFXLoadOp[GFXLoadOp["CLEAR"] = 1] = "CLEAR";
    GFXLoadOp[GFXLoadOp["DISCARD"] = 2] = "DISCARD";
})(GFXLoadOp || (GFXLoadOp = {}));
// Enumerates all possible values of operations to be performed when Storing to a Framebuffer Object.
var GFXStoreOp;
(function (GFXStoreOp) {
    GFXStoreOp[GFXStoreOp["STORE"] = 0] = "STORE";
    GFXStoreOp[GFXStoreOp["DISCARD"] = 1] = "DISCARD";
})(GFXStoreOp || (GFXStoreOp = {}));
var GFXTextureLayout;
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
})(GFXTextureLayout || (GFXTextureLayout = {}));
var GFXPipelineBindPoint;
(function (GFXPipelineBindPoint) {
    GFXPipelineBindPoint[GFXPipelineBindPoint["GRAPHICS"] = 0] = "GRAPHICS";
    GFXPipelineBindPoint[GFXPipelineBindPoint["COMPUTE"] = 1] = "COMPUTE";
    GFXPipelineBindPoint[GFXPipelineBindPoint["RAY_TRACING"] = 2] = "RAY_TRACING";
})(GFXPipelineBindPoint || (GFXPipelineBindPoint = {}));
var GFXDynamicState;
(function (GFXDynamicState) {
    GFXDynamicState[GFXDynamicState["VIEWPORT"] = 0] = "VIEWPORT";
    GFXDynamicState[GFXDynamicState["SCISSOR"] = 1] = "SCISSOR";
    GFXDynamicState[GFXDynamicState["LINE_WIDTH"] = 2] = "LINE_WIDTH";
    GFXDynamicState[GFXDynamicState["DEPTH_BIAS"] = 3] = "DEPTH_BIAS";
    GFXDynamicState[GFXDynamicState["BLEND_CONSTANTS"] = 4] = "BLEND_CONSTANTS";
    GFXDynamicState[GFXDynamicState["DEPTH_BOUNDS"] = 5] = "DEPTH_BOUNDS";
    GFXDynamicState[GFXDynamicState["STENCIL_WRITE_MASK"] = 6] = "STENCIL_WRITE_MASK";
    GFXDynamicState[GFXDynamicState["STENCIL_COMPARE_MASK"] = 7] = "STENCIL_COMPARE_MASK";
})(GFXDynamicState || (GFXDynamicState = {}));
var GFXStencilFace;
(function (GFXStencilFace) {
    GFXStencilFace[GFXStencilFace["FRONT"] = 0] = "FRONT";
    GFXStencilFace[GFXStencilFace["BACK"] = 1] = "BACK";
    GFXStencilFace[GFXStencilFace["ALL"] = 2] = "ALL";
})(GFXStencilFace || (GFXStencilFace = {}));
var GFXQueueType;
(function (GFXQueueType) {
    GFXQueueType[GFXQueueType["GRAPHICS"] = 0] = "GRAPHICS";
    GFXQueueType[GFXQueueType["COMPUTE"] = 1] = "COMPUTE";
    GFXQueueType[GFXQueueType["TRANSFER"] = 2] = "TRANSFER";
})(GFXQueueType || (GFXQueueType = {}));
var GFXClearFlag;
(function (GFXClearFlag) {
    GFXClearFlag[GFXClearFlag["NONE"] = 0] = "NONE";
    GFXClearFlag[GFXClearFlag["COLOR"] = 1] = "COLOR";
    GFXClearFlag[GFXClearFlag["DEPTH"] = 2] = "DEPTH";
    GFXClearFlag[GFXClearFlag["STENCIL"] = 4] = "STENCIL";
    GFXClearFlag[GFXClearFlag["DEPTH_STENCIL"] = 6] = "DEPTH_STENCIL";
    GFXClearFlag[GFXClearFlag["ALL"] = 7] = "ALL";
})(GFXClearFlag || (GFXClearFlag = {}));
function GFXGetTypeSize(type) {
    switch (type) {
        case GFXType.BOOL:
        case GFXType.INT:
        case GFXType.UINT:
        case GFXType.FLOAT: return 4;
        case GFXType.BOOL2:
        case GFXType.INT2:
        case GFXType.UINT2:
        case GFXType.FLOAT2: return 8;
        case GFXType.BOOL3:
        case GFXType.INT3:
        case GFXType.UINT3:
        case GFXType.FLOAT3: return 12;
        case GFXType.BOOL4:
        case GFXType.INT4:
        case GFXType.UINT4:
        case GFXType.FLOAT4:
        case GFXType.MAT2: return 16;
        case GFXType.MAT2X3: return 24;
        case GFXType.MAT2X4: return 32;
        case GFXType.MAT3X2: return 24;
        case GFXType.MAT3: return 36;
        case GFXType.MAT3X4: return 48;
        case GFXType.MAT4X2: return 32;
        case GFXType.MAT4X2: return 32;
        case GFXType.MAT4: return 64;
        case GFXType.SAMPLER1D:
        case GFXType.SAMPLER1D_ARRAY:
        case GFXType.SAMPLER2D:
        case GFXType.SAMPLER2D_ARRAY:
        case GFXType.SAMPLER3D:
        case GFXType.SAMPLER_CUBE: return 4;
        default: {
            return 0;
        }
    }
}

// import { GFXBuffer } from '../gfx/buffer';
var RenderPassStage;
(function (RenderPassStage) {
    RenderPassStage[RenderPassStage["DEFAULT"] = 100] = "DEFAULT";
})(RenderPassStage || (RenderPassStage = {}));
var RenderPriority;
(function (RenderPriority) {
    RenderPriority[RenderPriority["MIN"] = 0] = "MIN";
    RenderPriority[RenderPriority["MAX"] = 255] = "MAX";
    RenderPriority[RenderPriority["DEFAULT"] = 128] = "DEFAULT";
})(RenderPriority || (RenderPriority = {}));
var MAX_BINDING_SUPPORTED = 24; // from WebGL 2 spec
var UniformBinding;
(function (UniformBinding) {
    // UBOs
    UniformBinding[UniformBinding["UBO_GLOBAL"] = MAX_BINDING_SUPPORTED - 1] = "UBO_GLOBAL";
    UniformBinding[UniformBinding["UBO_SHADOW"] = MAX_BINDING_SUPPORTED - 2] = "UBO_SHADOW";
    UniformBinding[UniformBinding["UBO_LOCAL"] = MAX_BINDING_SUPPORTED - 3] = "UBO_LOCAL";
    UniformBinding[UniformBinding["UBO_FORWARD_LIGHTS"] = MAX_BINDING_SUPPORTED - 4] = "UBO_FORWARD_LIGHTS";
    UniformBinding[UniformBinding["UBO_SKINNING"] = MAX_BINDING_SUPPORTED - 5] = "UBO_SKINNING";
    UniformBinding[UniformBinding["UBO_SKINNING_TEXTURE"] = MAX_BINDING_SUPPORTED - 6] = "UBO_SKINNING_TEXTURE";
    UniformBinding[UniformBinding["UBO_UI"] = MAX_BINDING_SUPPORTED - 7] = "UBO_UI";
    // samplers
    UniformBinding[UniformBinding["SAMPLER_JOINTS"] = MAX_BINDING_SUPPORTED + 1] = "SAMPLER_JOINTS";
    UniformBinding[UniformBinding["SAMPLER_ENVIRONMENT"] = MAX_BINDING_SUPPORTED + 2] = "SAMPLER_ENVIRONMENT";
    // rooms left for custom bindings
    // effect importer prepares bindings according to this
    UniformBinding[UniformBinding["CUSTUM_UBO_BINDING_END_POINT"] = MAX_BINDING_SUPPORTED - 7] = "CUSTUM_UBO_BINDING_END_POINT";
    UniformBinding[UniformBinding["CUSTOM_SAMPLER_BINDING_START_POINT"] = MAX_BINDING_SUPPORTED + 6] = "CUSTOM_SAMPLER_BINDING_START_POINT";
})(UniformBinding || (UniformBinding = {}));
// export class UBOGlobal {
//     public static TIME_OFFSET: number = 0;
//     public static SCREEN_SIZE_OFFSET: number = UBOGlobal.TIME_OFFSET + 4;
//     public static SCREEN_SCALE_OFFSET: number = UBOGlobal.SCREEN_SIZE_OFFSET + 4;
//     public static NATIVE_SIZE_OFFSET: number = UBOGlobal.SCREEN_SCALE_OFFSET + 4;
//     public static MAT_VIEW_OFFSET: number = UBOGlobal.NATIVE_SIZE_OFFSET + 4;
//     public static MAT_VIEW_INV_OFFSET: number = UBOGlobal.MAT_VIEW_OFFSET + 16;
//     public static MAT_PROJ_OFFSET: number = UBOGlobal.MAT_VIEW_INV_OFFSET + 16;
//     public static MAT_PROJ_INV_OFFSET: number = UBOGlobal.MAT_PROJ_OFFSET + 16;
//     public static MAT_VIEW_PROJ_OFFSET: number = UBOGlobal.MAT_PROJ_INV_OFFSET + 16;
//     public static MAT_VIEW_PROJ_INV_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_OFFSET + 16;
//     public static CAMERA_POS_OFFSET: number = UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET + 16;
//     public static EXPOSURE_OFFSET: number = UBOGlobal.CAMERA_POS_OFFSET + 4;
//     public static MAIN_LIT_DIR_OFFSET: number = UBOGlobal.EXPOSURE_OFFSET + 4;
//     public static MAIN_LIT_COLOR_OFFSET: number = UBOGlobal.MAIN_LIT_DIR_OFFSET + 4;
//     public static AMBIENT_SKY_OFFSET: number = UBOGlobal.MAIN_LIT_COLOR_OFFSET + 4;
//     public static AMBIENT_GROUND_OFFSET: number = UBOGlobal.AMBIENT_SKY_OFFSET + 4;
//     public static COUNT: number = UBOGlobal.AMBIENT_GROUND_OFFSET + 4;
//     public static SIZE: number = UBOGlobal.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_GLOBAL, name: 'CCGlobal', members: [
//             { name: 'cc_time', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_screenSize', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_screenScale', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_nativeSize', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_matView', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matProjInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matViewProjInv', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_cameraPos', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_exposure', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_mainLitDir', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_mainLitColor', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_ambientSky', type: GFXType.FLOAT4, count: 1 },
//             { name: 'cc_ambientGround', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOGlobal.COUNT);
// }
// export class UBOShadow {
//     public static MAT_LIGHT_PLANE_PROJ_OFFSET: number = 0;
//     public static SHADOW_COLOR_OFFSET: number = UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET + 16;
//     public static COUNT: number = UBOShadow.SHADOW_COLOR_OFFSET + 4;
//     public static SIZE: number = UBOShadow.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_SHADOW, name: 'CCShadow', members: [
//             { name: 'cc_matLightPlaneProj', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_shadowColor', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOShadow.COUNT);
// }
// export const localBindingsDesc: Map<string, IInternalBindingDesc> = new Map<string, IInternalBindingDesc>();
// export class UBOLocal {
//     public static MAT_WORLD_OFFSET: number = 0;
//     public static MAT_WORLD_IT_OFFSET: number = UBOLocal.MAT_WORLD_OFFSET + 16;
//     public static COUNT: number = UBOLocal.MAT_WORLD_IT_OFFSET + 16;
//     public static SIZE: number = UBOLocal.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_LOCAL, name: 'CCLocal', members: [
//             { name: 'cc_matWorld', type: GFXType.MAT4, count: 1 },
//             { name: 'cc_matWorldIT', type: GFXType.MAT4, count: 1 },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOLocal.COUNT);
// }
// localBindingsDesc.set(UBOLocal.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOLocal.BLOCK,
// });
// export class UBOForwardLight {
//     public static MAX_SPHERE_LIGHTS = 2;
//     public static MAX_SPOT_LIGHTS = 2;
//     public static SPHERE_LIGHT_POS_OFFSET: number = 0;
//     public static SPHERE_LIGHT_SIZE_RANGE_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
//     public static SPHERE_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_SIZE_RANGE_OFFSET + UBOForwardLight.MAX_SPHERE_LIGHTS * 4;
//     public static SPOT_LIGHT_POS_OFFSET: number = UBOForwardLight.SPHERE_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET: number = UBOForwardLight.SPOT_LIGHT_POS_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_DIR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_SIZE_RANGE_ANGLE_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SPOT_LIGHT_COLOR_OFFSET: number = UBOForwardLight.SPOT_LIGHT_DIR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static COUNT: number = UBOForwardLight.SPOT_LIGHT_COLOR_OFFSET + UBOForwardLight.MAX_SPOT_LIGHTS * 4;
//     public static SIZE: number = UBOForwardLight.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_FORWARD_LIGHTS, name: 'CCForwardLight', members: [
//             { name: 'cc_sphereLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_sphereLitSizeRange', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_sphereLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPHERE_LIGHTS },
//             { name: 'cc_spotLitPos', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitSizeRangeAngle', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitDir', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//             { name: 'cc_spotLitColor', type: GFXType.FLOAT4, count: UBOForwardLight.MAX_SPOT_LIGHTS },
//         ],
//     };
//     public view: Float32Array = new Float32Array(UBOForwardLight.COUNT);
// }
// localBindingsDesc.set(UBOForwardLight.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOForwardLight.BLOCK,
// });
// export class UBOSkinning {
//     public static MAT_JOINT_OFFSET: number = 0;
//     public static JOINTS_TEXTURE_SIZE_OFFSET: number = UBOSkinning.MAT_JOINT_OFFSET + 128 * 16;
//     public static COUNT: number = UBOSkinning.JOINTS_TEXTURE_SIZE_OFFSET + 4;
//     public static SIZE: number = UBOSkinning.COUNT * 4;
//     public static BLOCK: GFXUniformBlock = {
//         binding: UniformBinding.UBO_SKINNING, name: 'CCSkinning', members: [
//             { name: 'cc_matJoint', type: GFXType.MAT4, count: 128 },
//             { name: 'cc_jointsTextureSize', type: GFXType.FLOAT4, count: 1 },
//         ],
//     };
// }
// localBindingsDesc.set(UBOSkinning.BLOCK.name, {
//     type: GFXBindingType.UNIFORM_BUFFER,
//     blockInfo: UBOSkinning.BLOCK,
// });
// export const UNIFORM_JOINTS_TEXTURE: GFXUniformSampler = {
//     binding: UniformBinding.SAMPLER_JOINTS, name: 'cc_jointsTexture', type: GFXType.SAMPLER2D, count: 1,
// };
// localBindingsDesc.set(UNIFORM_JOINTS_TEXTURE.name, {
//     type: GFXBindingType.SAMPLER,
//     samplerInfo: UNIFORM_JOINTS_TEXTURE,
// });
// export interface IInternalBindingDesc {
//     type: GFXBindingType;
//     blockInfo?: GFXUniformBlock;
//     samplerInfo?: GFXUniformSampler;
// }
// export interface IInternalBindingInst extends IInternalBindingDesc {
//     buffer?: GFXBuffer;
//     sampler?: GFXSampler;
//     textureView?: GFXTextureView;
// }

// this file is used for offline effect building.
var _a, _b;
var SamplerInfoIndex;
(function (SamplerInfoIndex) {
    SamplerInfoIndex[SamplerInfoIndex["minFilter"] = 0] = "minFilter";
    SamplerInfoIndex[SamplerInfoIndex["magFilter"] = 1] = "magFilter";
    SamplerInfoIndex[SamplerInfoIndex["mipFilter"] = 2] = "mipFilter";
    SamplerInfoIndex[SamplerInfoIndex["addressU"] = 3] = "addressU";
    SamplerInfoIndex[SamplerInfoIndex["addressV"] = 4] = "addressV";
    SamplerInfoIndex[SamplerInfoIndex["addressW"] = 5] = "addressW";
    SamplerInfoIndex[SamplerInfoIndex["maxAnisotropy"] = 6] = "maxAnisotropy";
    SamplerInfoIndex[SamplerInfoIndex["cmpFunc"] = 7] = "cmpFunc";
    SamplerInfoIndex[SamplerInfoIndex["minLOD"] = 8] = "minLOD";
    SamplerInfoIndex[SamplerInfoIndex["maxLOD"] = 9] = "maxLOD";
    SamplerInfoIndex[SamplerInfoIndex["mipLODBias"] = 10] = "mipLODBias";
    SamplerInfoIndex[SamplerInfoIndex["borderColor"] = 11] = "borderColor";
    SamplerInfoIndex[SamplerInfoIndex["total"] = 15] = "total";
})(SamplerInfoIndex || (SamplerInfoIndex = {}));
var typeMap = {};
typeMap[typeMap['bool'] = GFXType.BOOL] = 'bool';
typeMap[typeMap['int'] = GFXType.INT] = 'int';
typeMap[typeMap['ivec2'] = GFXType.INT2] = 'ivec2invTypeParams';
typeMap[typeMap['ivec3'] = GFXType.INT3] = 'ivec3';
typeMap[typeMap['ivec4'] = GFXType.INT4] = 'ivec4';
typeMap[typeMap['float'] = GFXType.FLOAT] = 'float';
typeMap[typeMap['vec2'] = GFXType.FLOAT2] = 'vec2';
typeMap[typeMap['vec3'] = GFXType.FLOAT3] = 'vec3';
typeMap[typeMap['vec4'] = GFXType.FLOAT4] = 'vec4';
typeMap[typeMap['mat2'] = GFXType.MAT2] = 'mat2';
typeMap[typeMap['mat3'] = GFXType.MAT3] = 'mat3';
typeMap[typeMap['mat4'] = GFXType.MAT4] = 'mat4';
typeMap[typeMap['sampler2D'] = GFXType.SAMPLER2D] = 'sampler2D';
typeMap[typeMap['samplerCube'] = GFXType.SAMPLER_CUBE] = 'samplerCube';
var sizeMap = (_a = {},
    _a[GFXType.BOOL] = 4,
    _a[GFXType.INT] = 4,
    _a[GFXType.INT2] = 8,
    _a[GFXType.INT3] = 12,
    _a[GFXType.INT4] = 16,
    _a[GFXType.FLOAT] = 4,
    _a[GFXType.FLOAT2] = 8,
    _a[GFXType.FLOAT3] = 12,
    _a[GFXType.FLOAT4] = 16,
    _a[GFXType.MAT2] = 16,
    _a[GFXType.MAT3] = 36,
    _a[GFXType.MAT4] = 64,
    _a[GFXType.SAMPLER2D] = 4,
    _a[GFXType.SAMPLER_CUBE] = 4,
    _a);
var formatMap = (_b = {},
    _b[GFXType.BOOL] = GFXFormat.R32I,
    _b[GFXType.INT] = GFXFormat.R32I,
    _b[GFXType.INT2] = GFXFormat.RG32I,
    _b[GFXType.INT3] = GFXFormat.RGB32I,
    _b[GFXType.INT4] = GFXFormat.RGBA32I,
    _b[GFXType.FLOAT] = GFXFormat.R32F,
    _b[GFXType.FLOAT2] = GFXFormat.RG32F,
    _b[GFXType.FLOAT3] = GFXFormat.RGB32F,
    _b[GFXType.FLOAT4] = GFXFormat.RGBA32F,
    _b);
// const passParams = {
//   // color mask
//   NONE: gfx.GFXColorMask.NONE,
//   R: gfx.GFXColorMask.R,
//   G: gfx.GFXColorMask.G,
//   B: gfx.GFXColorMask.B,
//   A: gfx.GFXColorMask.A,
//   RG: gfx.GFXColorMask.R | gfx.GFXColorMask.G,
//   RB: gfx.GFXColorMask.R | gfx.GFXColorMask.B,
//   RA: gfx.GFXColorMask.R | gfx.GFXColorMask.A,
//   GB: gfx.GFXColorMask.G | gfx.GFXColorMask.B,
//   GA: gfx.GFXColorMask.G | gfx.GFXColorMask.A,
//   BA: gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   RGB: gfx.GFXColorMask.R | gfx.GFXColorMask.G | gfx.GFXColorMask.B,
//   RGA: gfx.GFXColorMask.R | gfx.GFXColorMask.G | gfx.GFXColorMask.A,
//   RBA: gfx.GFXColorMask.R | gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   GBA: gfx.GFXColorMask.G | gfx.GFXColorMask.B | gfx.GFXColorMask.A,
//   ALL: gfx.GFXColorMask.ALL,
//   // blend operation
//   ADD: gfx.GFXBlendOp.ADD,
//   SUB: gfx.GFXBlendOp.SUB,
//   REV_SUB: gfx.GFXBlendOp.REV_SUB,
//   MIN: gfx.GFXBlendOp.MIN,
//   MAX: gfx.GFXBlendOp.MAX,
//   // blend factor
//   ZERO: gfx.GFXBlendFactor.ZERO,
//   ONE: gfx.GFXBlendFactor.ONE,
//   SRC_ALPHA: gfx.GFXBlendFactor.SRC_ALPHA,
//   DST_ALPHA: gfx.GFXBlendFactor.DST_ALPHA,
//   ONE_MINUS_SRC_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
//   ONE_MINUS_DST_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_DST_ALPHA,
//   SRC_COLOR: gfx.GFXBlendFactor.SRC_COLOR,
//   DST_COLOR: gfx.GFXBlendFactor.DST_COLOR,
//   ONE_MINUS_SRC_COLOR: gfx.GFXBlendFactor.ONE_MINUS_SRC_COLOR,
//   ONE_MINUS_DST_COLOR: gfx.GFXBlendFactor.ONE_MINUS_DST_COLOR,
//   SRC_ALPHA_SATURATE: gfx.GFXBlendFactor.SRC_ALPHA_SATURATE,
//   CONSTANT_COLOR: gfx.GFXBlendFactor.CONSTANT_COLOR,
//   ONE_MINUS_CONSTANT_COLOR: gfx.GFXBlendFactor.ONE_MINUS_CONSTANT_COLOR,
//   CONSTANT_ALPHA: gfx.GFXBlendFactor.CONSTANT_ALPHA,
//   ONE_MINUS_CONSTANT_ALPHA: gfx.GFXBlendFactor.ONE_MINUS_CONSTANT_ALPHA,
//   // stencil operation
//   // ZERO: GFXStencilOp.ZERO, // duplicate, safely removed because enum value is(and always will be) the same
//   KEEP: gfx.GFXStencilOp.KEEP,
//   REPLACE: gfx.GFXStencilOp.REPLACE,
//   INCR: gfx.GFXStencilOp.INCR,
//   DECR: gfx.GFXStencilOp.DECR,
//   INVERT: gfx.GFXStencilOp.INVERT,
//   INCR_WRAP: gfx.GFXStencilOp.INCR_WRAP,
//   DECR_WRAP: gfx.GFXStencilOp.DECR_WRAP,
//     // comparison function
//   NEVER: gfx.GFXComparisonFunc.NEVER,
//   LESS: gfx.GFXComparisonFunc.LESS,
//   EQUAL: gfx.GFXComparisonFunc.EQUAL,
//   LESS_EQUAL: gfx.GFXComparisonFunc.LESS_EQUAL,
//   GREATER: gfx.GFXComparisonFunc.GREATER,
//   NOT_EQUAL: gfx.GFXComparisonFunc.NOT_EQUAL,
//   GREATER_EQUAL: gfx.GFXComparisonFunc.GREATER_EQUAL,
//   ALWAYS: gfx.GFXComparisonFunc.ALWAYS,
//   // cull mode
//   // NONE: GFXCullMode.NONE, // duplicate, safely removed because enum value is(and always will be) the same
//   FRONT: gfx.GFXCullMode.FRONT,
//   BACK: gfx.GFXCullMode.BACK,
//   // shade mode
//   GOURAND: gfx.GFXShadeModel.GOURAND,
//   FLAT: gfx.GFXShadeModel.FLAT,
//   // polygon mode
//   FILL: gfx.GFXPolygonMode.FILL,
//   LINE: gfx.GFXPolygonMode.LINE,
//   POINT: gfx.GFXPolygonMode.POINT,
//   // primitive mode
//   POINT_LIST: gfx.GFXPrimitiveMode.POINT_LIST,
//   LINE_LIST: gfx.GFXPrimitiveMode.LINE_LIST,
//   LINE_STRIP: gfx.GFXPrimitiveMode.LINE_STRIP,
//   LINE_LOOP: gfx.GFXPrimitiveMode.LINE_LOOP,
//   TRIANGLE_LIST: gfx.GFXPrimitiveMode.TRIANGLE_LIST,
//   TRIANGLE_STRIP: gfx.GFXPrimitiveMode.TRIANGLE_STRIP,
//   TRIANGLE_FAN: gfx.GFXPrimitiveMode.TRIANGLE_FAN,
//   LINE_LIST_ADJACENCY: gfx.GFXPrimitiveMode.LINE_LIST_ADJACENCY,
//   LINE_STRIP_ADJACENCY: gfx.GFXPrimitiveMode.LINE_STRIP_ADJACENCY,
//   TRIANGLE_LIST_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_LIST_ADJACENCY,
//   TRIANGLE_STRIP_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_STRIP_ADJACENCY,
//   TRIANGLE_PATCH_ADJACENCY: gfx.GFXPrimitiveMode.TRIANGLE_PATCH_ADJACENCY,
//   QUAD_PATCH_LIST: gfx.GFXPrimitiveMode.QUAD_PATCH_LIST,
//   ISO_LINE_LIST: gfx.GFXPrimitiveMode.ISO_LINE_LIST,
//   // POINT: gfx.GFXFilter.POINT, // duplicate, safely removed because enum value is(and always will be) the same
//   LINEAR: gfx.GFXFilter.LINEAR,
//   ANISOTROPIC: gfx.GFXFilter.ANISOTROPIC,
//   WRAP: gfx.GFXAddress.WRAP,
//   MIRROR: gfx.GFXAddress.MIRROR,
//   CLAMP: gfx.GFXAddress.CLAMP,
//   BORDER: gfx.GFXAddress.BORDER,
//   VIEWPORT: gfx.GFXDynamicState.VIEWPORT,
//   SCISSOR: gfx.GFXDynamicState.SCISSOR,
//   LINE_WIDTH: gfx.GFXDynamicState.LINE_WIDTH,
//   DEPTH_BIAS: gfx.GFXDynamicState.DEPTH_BIAS,
//   BLEND_CONSTANTS: gfx.GFXDynamicState.BLEND_CONSTANTS,
//   DEPTH_BOUNDS: gfx.GFXDynamicState.DEPTH_BOUNDS,
//   STENCIL_WRITE_MASK: gfx.GFXDynamicState.STENCIL_WRITE_MASK,
//   STENCIL_COMPARE_MASK: gfx.GFXDynamicState.STENCIL_COMPARE_MASK,
//   TRUE: true,
//   FALSE: false
// };
var passParams = {
    BACK: enums.CULL_BACK,
    FRONT: enums.CULL_FRONT,
    NONE: enums.CULL_NONE,
    ADD: enums.BLEND_FUNC_ADD,
    SUB: enums.BLEND_FUNC_SUBTRACT,
    REV_SUB: enums.BLEND_FUNC_REVERSE_SUBTRACT,
    ZERO: enums.BLEND_ZERO,
    ONE: enums.BLEND_ONE,
    SRC_COLOR: enums.BLEND_SRC_COLOR,
    ONE_MINUS_SRC_COLOR: enums.BLEND_ONE_MINUS_SRC_COLOR,
    DST_COLOR: enums.BLEND_DST_COLOR,
    ONE_MINUS_DST_COLOR: enums.BLEND_ONE_MINUS_DST_COLOR,
    SRC_ALPHA: enums.BLEND_SRC_ALPHA,
    ONE_MINUS_SRC_ALPHA: enums.BLEND_ONE_MINUS_SRC_ALPHA,
    DST_ALPHA: enums.BLEND_DST_ALPHA,
    ONE_MINUS_DST_ALPHA: enums.BLEND_ONE_MINUS_DST_ALPHA,
    CONSTANT_COLOR: enums.BLEND_CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR: enums.BLEND_ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA: enums.BLEND_CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA: enums.BLEND_ONE_MINUS_CONSTANT_ALPHA,
    SRC_ALPHA_SATURATE: enums.BLEND_SRC_ALPHA_SATURATE,
    NEVER: enums.DS_FUNC_NEVER,
    LESS: enums.DS_FUNC_LESS,
    EQUAL: enums.DS_FUNC_EQUAL,
    LEQUAL: enums.DS_FUNC_LEQUAL,
    GREATER: enums.DS_FUNC_GREATER,
    NOTEQUAL: enums.DS_FUNC_NOTEQUAL,
    GEQUAL: enums.DS_FUNC_GEQUAL,
    ALWAYS: enums.DS_FUNC_ALWAYS,
    KEEP: enums.STENCIL_OP_KEEP,
    REPLACE: enums.STENCIL_OP_REPLACE,
    INCR: enums.STENCIL_OP_INCR,
    INCR_WRAP: enums.STENCIL_OP_INCR_WRAP,
    DECR: enums.STENCIL_OP_DECR,
    DECR_WRAP: enums.STENCIL_OP_DECR_WRAP,
    INVERT: enums.STENCIL_OP_INVERT
};
Object.assign(passParams, RenderPassStage);
// for structural type checking
// an 'any' key will check against all elements defined in that object
// a key start with '$' means its essential, and can't be undefined
var effectStructure = {
    $techniques: [
        {
            $passes: [
                {
                    depthStencilState: {},
                    rasterizerState: {},
                    blendState: { targets: [{}] },
                    properties: { any: { sampler: {}, inspector: {} } }
                }
            ]
        }
    ]
};
var mappings = {
    murmurhash2_32_gc: murmurhash2_32_gc,
    SamplerInfoIndex: SamplerInfoIndex,
    effectStructure: effectStructure,
    typeMap: typeMap,
    sizeMap: sizeMap,
    formatMap: formatMap,
    passParams: passParams,
    RenderQueue: RenderQueue,
    RenderPriority: RenderPriority,
    GFXGetTypeSize: GFXGetTypeSize,
    UniformBinding: UniformBinding
};

module.exports = mappings;
