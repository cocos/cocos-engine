const GL_NEAREST = 9728;                // gl.NEAREST
const GL_LINEAR = 9729;                 // gl.LINEAR
const GL_NEAREST_MIPMAP_NEAREST = 9984; // gl.NEAREST_MIPMAP_NEAREST
const GL_LINEAR_MIPMAP_NEAREST = 9985;  // gl.LINEAR_MIPMAP_NEAREST
const GL_NEAREST_MIPMAP_LINEAR = 9986;  // gl.NEAREST_MIPMAP_LINEAR
const GL_LINEAR_MIPMAP_LINEAR = 9987;   // gl.LINEAR_MIPMAP_LINEAR

// const GL_BYTE = 5120;                  // gl.BYTE
const GL_UNSIGNED_BYTE = 5121;            // gl.UNSIGNED_BYTE
// const GL_SHORT = 5122;                 // gl.SHORT
const GL_UNSIGNED_SHORT = 5123;           // gl.UNSIGNED_SHORT
const GL_UNSIGNED_INT = 5125;             // gl.UNSIGNED_INT
const GL_FLOAT = 5126;                    // gl.FLOAT
const GL_UNSIGNED_SHORT_5_6_5 = 33635;    // gl.UNSIGNED_SHORT_5_6_5
const GL_UNSIGNED_SHORT_4_4_4_4 = 32819;  // gl.UNSIGNED_SHORT_4_4_4_4
const GL_UNSIGNED_SHORT_5_5_5_1 = 32820;  // gl.UNSIGNED_SHORT_5_5_5_1
const GL_HALF_FLOAT_OES = 36193;          // gl.HALF_FLOAT_OES

const GL_DEPTH_COMPONENT = 6402; // gl.DEPTH_COMPONENT

const GL_ALPHA = 6406;            // gl.ALPHA
const GL_RGB = 6407;              // gl.RGB
const GL_RGBA = 6408;             // gl.RGBA
const GL_LUMINANCE = 6409;        // gl.LUMINANCE
const GL_LUMINANCE_ALPHA = 6410;  // gl.LUMINANCE_ALPHA

const GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;   // ext.COMPRESSED_RGB_S3TC_DXT1_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;  // ext.COMPRESSED_RGBA_S3TC_DXT1_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;  // ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
const GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;  // ext.COMPRESSED_RGBA_S3TC_DXT5_EXT

const GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;  // ext.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
const GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;  // ext.COMPRESSED_RGB_PVRTC_2BPPV1_IMG
const GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02; // ext.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
const GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03; // ext.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG

const GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64; // ext.COMPRESSED_RGB_ETC1_WEBGL

const GL_COMPRESSED_RGB8_ETC2 = 0x9274;       // ext.COMPRESSED_RGB8_ETC2
const GL_COMPRESSED_RGBA8_ETC2_EAC = 0x9278;  // ext.COMPRESSED_RGBA8_ETC2_EAC

const _filterGL = [
  [ GL_NEAREST,  GL_NEAREST_MIPMAP_NEAREST, GL_NEAREST_MIPMAP_LINEAR ],
  [ GL_LINEAR,  GL_LINEAR_MIPMAP_NEAREST, GL_LINEAR_MIPMAP_LINEAR ],
];

const _textureFmtGL = [
  // TEXTURE_FMT_RGB_DXT1: 0
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_S3TC_DXT1_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT1: 1
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT1_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT3: 2
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT3_EXT, pixelType: null },

  // TEXTURE_FMT_RGBA_DXT5: 3
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_S3TC_DXT5_EXT, pixelType: null },

  // TEXTURE_FMT_RGB_ETC1: 4
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_ETC1_WEBGL, pixelType: null },

  // TEXTURE_FMT_RGB_PVRTC_2BPPV1: 5
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGBA_PVRTC_2BPPV1: 6
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGB_PVRTC_4BPPV1: 7
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_RGBA_PVRTC_4BPPV1: 8
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG, pixelType: null },

  // TEXTURE_FMT_A8: 9
  { format: GL_ALPHA, internalFormat: GL_ALPHA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_L8: 10
  { format: GL_LUMINANCE, internalFormat: GL_LUMINANCE, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_L8_A8: 11
  { format: GL_LUMINANCE_ALPHA, internalFormat: GL_LUMINANCE_ALPHA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_R5_G6_B5: 12
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_SHORT_5_6_5 },

  // TEXTURE_FMT_R5_G5_B5_A1: 13
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_5_5_5_1 },

  // TEXTURE_FMT_R4_G4_B4_A4: 14
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_SHORT_4_4_4_4 },

  // TEXTURE_FMT_RGB8: 15
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_RGBA8: 16
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_UNSIGNED_BYTE },

  // TEXTURE_FMT_RGB16F: 17
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_HALF_FLOAT_OES },

  // TEXTURE_FMT_RGBA16F: 18
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_HALF_FLOAT_OES },

  // TEXTURE_FMT_RGB32F: 19
  { format: GL_RGB, internalFormat: GL_RGB, pixelType: GL_FLOAT },

  // TEXTURE_FMT_RGBA32F: 20
  { format: GL_RGBA, internalFormat: GL_RGBA, pixelType: GL_FLOAT },

  // TEXTURE_FMT_R32F: 21
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_111110F: 22
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_SRGB: 23
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_SRGBA: 24
  { format: null, internalFormat: null, pixelType: null },

  // TEXTURE_FMT_D16: 25
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_SHORT },

  // TEXTURE_FMT_D32: 26
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

  // TEXTURE_FMT_D24S8: 27
  { format: GL_DEPTH_COMPONENT, internalFormat: GL_DEPTH_COMPONENT, pixelType: GL_UNSIGNED_INT },

  // TEXTURE_FMT_RGB_ETC2: 28
  { format: GL_RGB, internalFormat: GL_COMPRESSED_RGB8_ETC2, pixelType: null },

  // TEXTURE_FMT_RGBA_ETC2: 29
  { format: GL_RGBA, internalFormat: GL_COMPRESSED_RGBA8_ETC2_EAC, pixelType: null },
];

/**
 * enums
 */
export const enums = {
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

/**
 * @method attrTypeBytes
 * @param {ATTR_TYPE_*} attrType
 */
export function attrTypeBytes(attrType) {
  if (attrType === enums.ATTR_TYPE_INT8) {
    return 1;
  } else if (attrType === enums.ATTR_TYPE_UINT8) {
    return 1;
  } else if (attrType === enums.ATTR_TYPE_INT16) {
    return 2;
  } else if (attrType === enums.ATTR_TYPE_UINT16) {
    return 2;
  } else if (attrType === enums.ATTR_TYPE_INT32) {
    return 4;
  } else if (attrType === enums.ATTR_TYPE_UINT32) {
    return 4;
  } else if (attrType === enums.ATTR_TYPE_FLOAT32) {
    return 4;
  }

  console.warn(`Unknown ATTR_TYPE: ${attrType}`);
  return 0;
}

/**
 * @method glFilter
 * @param {WebGLContext} gl
 * @param {FILTER_*} filter
 * @param {FILTER_*} mipFilter
 */
export function glFilter(gl, filter, mipFilter = -1) {
  let result = _filterGL[filter][mipFilter+1];
  if (result === undefined) {
    console.warn(`Unknown FILTER: ${filter}`);
    return mipFilter === -1 ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR;
  }

  return result;
}

/**
 * @method glTextureFmt
 * @param {TEXTURE_FMT_*} fmt
 */
export function glTextureFmt(fmt) {
  let result = _textureFmtGL[fmt];
  if (result === undefined) {
    console.warn(`Unknown TEXTURE_FMT: ${fmt}`);
    return _textureFmtGL[enums.TEXTURE_FMT_RGBA8];
  }

  return result;
}