#include "GLES3Std.h"
#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "GLES3StateCache.h"

#define BUFFER_OFFSET(idx) (static_cast<char*>(0) + (idx))

NS_CC_BEGIN

GLenum MapGLInternalFormat(GFXFormat format) {
  switch (format) {
    case GFXFormat::A8: return GL_ALPHA;
    case GFXFormat::L8: return GL_LUMINANCE;
    case GFXFormat::LA8: return GL_LUMINANCE_ALPHA;
    case GFXFormat::R8: return GL_R8;
    case GFXFormat::R8SN: return GL_R8_SNORM;
    case GFXFormat::R8UI: return GL_R8UI;
    case GFXFormat::R8I: return GL_R8I;
    case GFXFormat::RG8: return GL_RG8;
    case GFXFormat::RG8SN: return GL_RG8_SNORM;
    case GFXFormat::RG8UI: return GL_RG8UI;
    case GFXFormat::RG8I: return GL_RG8I;
    case GFXFormat::RGB8: return GL_RGB8;
    case GFXFormat::RGB8SN: return GL_RGB8_SNORM;
    case GFXFormat::RGB8UI: return GL_RGB8UI;
    case GFXFormat::RGB8I: return GL_RGB8I;
    case GFXFormat::RGBA8: return GL_RGBA8;
    case GFXFormat::RGBA8SN: return GL_RGBA8_SNORM;
    case GFXFormat::RGBA8UI: return GL_RGBA8UI;
    case GFXFormat::RGBA8I: return GL_RGBA8I;
    case GFXFormat::R16I: return GL_R16I;
    case GFXFormat::R16UI: return GL_R16UI;
    case GFXFormat::R16F: return GL_R16F;
    case GFXFormat::RG16I: return GL_RG16I;
    case GFXFormat::RG16UI: return GL_RG16UI;
    case GFXFormat::RG16F: return GL_RG16F;
    case GFXFormat::RGB16I: return GL_RGB16I;
    case GFXFormat::RGB16UI: return GL_RGB16UI;
    case GFXFormat::RGB16F: return GL_RGB16F;
    case GFXFormat::RGBA16I: return GL_RGBA16I;
    case GFXFormat::RGBA16UI: return GL_RGBA16UI;
    case GFXFormat::RGBA16F: return GL_RGBA16F;
    case GFXFormat::R32I: return GL_R32I;
    case GFXFormat::R32UI: return GL_R32UI;
    case GFXFormat::R32F: return GL_R32F;
    case GFXFormat::RG32I: return GL_RG32I;
    case GFXFormat::RG32UI: return GL_RG32UI;
    case GFXFormat::RG32F: return GL_RG32F;
    case GFXFormat::RGB32I: return GL_RGB32I;
    case GFXFormat::RGB32UI: return GL_RGB32UI;
    case GFXFormat::RGB32F: return GL_RGB32F;
    case GFXFormat::RGBA32I: return GL_RGBA32I;
    case GFXFormat::RGBA32UI: return GL_RGBA32UI;
    case GFXFormat::RGBA32F: return GL_RGBA32F;
    case GFXFormat::R5G6B5: return GL_RGB565;
    case GFXFormat::RGB5A1: return GL_RGB5_A1;
    case GFXFormat::RGBA4: return GL_RGBA4;
    case GFXFormat::RGB10A2: return GL_RGB10_A2;
    case GFXFormat::RGB10A2UI: return GL_RGB10_A2UI;
    case GFXFormat::R11G11B10F: return GL_R11F_G11F_B10F;
    case GFXFormat::D16: return GL_DEPTH_COMPONENT16;
    case GFXFormat::D16S8: return GL_DEPTH_STENCIL;
    case GFXFormat::D24: return GL_DEPTH_COMPONENT24;
    case GFXFormat::D24S8: return GL_DEPTH24_STENCIL8;
    case GFXFormat::D32F: return GL_DEPTH_COMPONENT32F;
    case GFXFormat::D32F_S8: return GL_DEPTH32F_STENCIL8;
      
    case GFXFormat::BC1: return GL_COMPRESSED_RGB_S3TC_DXT1_EXT;
    case GFXFormat::BC1_ALPHA: return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;
    case GFXFormat::BC1_SRGB: return GL_COMPRESSED_SRGB_S3TC_DXT1_EXT;
    case GFXFormat::BC1_SRGB_ALPHA: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
    case GFXFormat::BC2: return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;
    case GFXFormat::BC2_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
    case GFXFormat::BC3: return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
    case GFXFormat::BC3_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
      
    case GFXFormat::ETC_RGB8: return GL_ETC1_RGB8_OES;
    case GFXFormat::ETC2_RGB8: return GL_COMPRESSED_RGB8_ETC2;
    case GFXFormat::ETC2_SRGB8: return GL_COMPRESSED_SRGB8_ETC2;
    case GFXFormat::ETC2_RGB8_A1: return GL_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case GFXFormat::ETC2_SRGB8_A1: return GL_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case GFXFormat::ETC2_RGBA8: return GL_COMPRESSED_RGBA8_ETC2_EAC;
    case GFXFormat::ETC2_SRGB8_A8: return GL_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
    case GFXFormat::EAC_R11: return GL_COMPRESSED_R11_EAC;
    case GFXFormat::EAC_R11SN: return GL_COMPRESSED_SIGNED_R11_EAC;
    case GFXFormat::EAC_RG11: return GL_COMPRESSED_RG11_EAC;
    case GFXFormat::EAC_RG11SN: return GL_COMPRESSED_SIGNED_RG11_EAC;
      
    case GFXFormat::PVRTC_RGB2: return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    case GFXFormat::PVRTC_RGBA2: return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    case GFXFormat::PVRTC_RGB4: return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    case GFXFormat::PVRTC_RGBA4: return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
      
    default: {
      CCASSERT(false, "Unsupported GFXFormat, convert to GL internal format failed.");
      return GL_RGBA;
    }
  }
}

GLenum MapGLFormat(GFXFormat format) {
  switch (format) {
    case GFXFormat::A8: return GL_ALPHA;
    case GFXFormat::L8: return GL_LUMINANCE;
    case GFXFormat::LA8: return GL_LUMINANCE_ALPHA;
    case GFXFormat::R8:
    case GFXFormat::R8SN:
    case GFXFormat::R8UI:
    case GFXFormat::R8I: return GL_RED;
    case GFXFormat::RG8:
    case GFXFormat::RG8SN:
    case GFXFormat::RG8UI:
    case GFXFormat::RG8I: return GL_RG;
    case GFXFormat::RGB8:
    case GFXFormat::RGB8SN:
    case GFXFormat::RGB8UI:
    case GFXFormat::RGB8I: return GL_RGB;
    case GFXFormat::RGBA8:
    case GFXFormat::RGBA8SN:
    case GFXFormat::RGBA8UI:
    case GFXFormat::RGBA8I: return GL_RGBA;
    case GFXFormat::R16UI:
    case GFXFormat::R16I:
    case GFXFormat::R16F: return GL_RED;
    case GFXFormat::RG16UI:
    case GFXFormat::RG16I:
    case GFXFormat::RG16F: return GL_RG;
    case GFXFormat::RGB16UI:
    case GFXFormat::RGB16I:
    case GFXFormat::RGB16F: return GL_RGB;
    case GFXFormat::RGBA16UI:
    case GFXFormat::RGBA16I:
    case GFXFormat::RGBA16F: return GL_RGBA;
    case GFXFormat::R32UI:
    case GFXFormat::R32I:
    case GFXFormat::R32F: return GL_RED;
    case GFXFormat::RG32UI:
    case GFXFormat::RG32I:
    case GFXFormat::RG32F: return GL_RG;
    case GFXFormat::RGB32UI:
    case GFXFormat::RGB32I:
    case GFXFormat::RGB32F: return GL_RGB;
    case GFXFormat::RGBA32UI:
    case GFXFormat::RGBA32I:
    case GFXFormat::RGBA32F: return GL_RGBA;
    case GFXFormat::RGB10A2: return GL_RGBA;
    case GFXFormat::R11G11B10F: return GL_RGB;
    case GFXFormat::R5G6B5: return GL_RGB;
    case GFXFormat::RGB5A1: return GL_RGBA;
    case GFXFormat::RGBA4: return GL_RGBA;
    case GFXFormat::D16: return GL_DEPTH_COMPONENT;
    case GFXFormat::D16S8: return GL_DEPTH_STENCIL;
    case GFXFormat::D24: return GL_DEPTH_COMPONENT;
    case GFXFormat::D24S8: return GL_DEPTH_STENCIL;
    case GFXFormat::D32F: return GL_DEPTH_COMPONENT;
    case GFXFormat::D32F_S8: return GL_DEPTH_STENCIL;
      
    case GFXFormat::BC1: return GL_COMPRESSED_RGB_S3TC_DXT1_EXT;
    case GFXFormat::BC1_ALPHA: return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;
    case GFXFormat::BC1_SRGB: return GL_COMPRESSED_SRGB_S3TC_DXT1_EXT;
    case GFXFormat::BC1_SRGB_ALPHA: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
    case GFXFormat::BC2: return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;
    case GFXFormat::BC2_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
    case GFXFormat::BC3: return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
    case GFXFormat::BC3_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

    case GFXFormat::ETC_RGB8: return GL_ETC1_RGB8_OES;
      
    case GFXFormat::PVRTC_RGB2: return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    case GFXFormat::PVRTC_RGBA2: return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    case GFXFormat::PVRTC_RGB4: return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    case GFXFormat::PVRTC_RGBA4: return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
      
    default: {
      CCASSERT(false, "Unsupported GFXFormat, convert to WebGL format failed.");
      return GL_RGBA;
    }
  }
}

GLenum MapGLType(GFXType type) {
  switch (type) {
    case GFXType::BOOL: return GL_BOOL;
    case GFXType::BOOL2: return GL_BOOL_VEC2;
    case GFXType::BOOL3: return GL_BOOL_VEC3;
    case GFXType::BOOL4: return GL_BOOL_VEC4;
    case GFXType::INT: return GL_INT;
    case GFXType::INT2: return GL_INT_VEC2;
    case GFXType::INT3: return GL_INT_VEC3;
    case GFXType::INT4: return GL_INT_VEC4;
    case GFXType::UINT: return GL_UNSIGNED_INT;
    case GFXType::FLOAT: return GL_FLOAT;
    case GFXType::FLOAT2: return GL_FLOAT_VEC2;
    case GFXType::FLOAT3: return GL_FLOAT_VEC3;
    case GFXType::FLOAT4: return GL_FLOAT_VEC4;
    case GFXType::MAT2: return GL_FLOAT_MAT2;
    case GFXType::MAT2X3: return GL_FLOAT_MAT2x3;
    case GFXType::MAT2X4: return GL_FLOAT_MAT2x4;
    case GFXType::MAT3X2: return GL_FLOAT_MAT3x2;
    case GFXType::MAT3: return GL_FLOAT_MAT3;
    case GFXType::MAT3X4: return GL_FLOAT_MAT3x4;
    case GFXType::MAT4X2: return GL_FLOAT_MAT4x2;
    case GFXType::MAT4X3: return GL_FLOAT_MAT4x3;
    case GFXType::MAT4: return GL_FLOAT_MAT4;
    case GFXType::SAMPLER2D: return GL_SAMPLER_2D;
    case GFXType::SAMPLER2D_ARRAY: return GL_SAMPLER_2D_ARRAY;
    case GFXType::SAMPLER3D: return GL_SAMPLER_3D;
    case GFXType::SAMPLER_CUBE: return GL_SAMPLER_CUBE;
    default: {
      CCASSERT(false, "Unsupported GLType, convert to GL type failed.");
      return GL_NONE;
    }
  }
}

GFXType MapGFXType(GLenum gl_type) {
  switch (gl_type) {
    case GL_BOOL: return GFXType::BOOL;
    case GL_BOOL_VEC2: return GFXType::BOOL2;
    case GL_BOOL_VEC3: return GFXType::BOOL3;
    case GL_BOOL_VEC4: return GFXType::BOOL4;
    case GL_INT: return GFXType::INT;
    case GL_INT_VEC2: return GFXType::INT2;
    case GL_INT_VEC3: return GFXType::INT3;
    case GL_INT_VEC4: return GFXType::INT4;
    case GL_UNSIGNED_INT: return GFXType::UINT;
    case GL_UNSIGNED_INT_VEC2: return GFXType::UINT2;
    case GL_UNSIGNED_INT_VEC3: return GFXType::UINT3;
    case GL_UNSIGNED_INT_VEC4: return GFXType::UINT4;
    case GL_FLOAT: return GFXType::FLOAT;
    case GL_FLOAT_VEC2: return GFXType::FLOAT2;
    case GL_FLOAT_VEC3: return GFXType::FLOAT3;
    case GL_FLOAT_VEC4: return GFXType::FLOAT4;
    case GL_FLOAT_MAT2: return GFXType::MAT2;
    case GL_FLOAT_MAT2x3: return GFXType::MAT2X3;
    case GL_FLOAT_MAT2x4: return GFXType::MAT2X4;
    case GL_FLOAT_MAT3x2: return GFXType::MAT3X2;
    case GL_FLOAT_MAT3: return GFXType::MAT3;
    case GL_FLOAT_MAT3x4: return GFXType::MAT3X4;
    case GL_FLOAT_MAT4x2: return GFXType::MAT4X2;
    case GL_FLOAT_MAT4x3: return GFXType::MAT4X3;
    case GL_FLOAT_MAT4: return GFXType::MAT4;
    case GL_SAMPLER_2D: return GFXType::SAMPLER2D;
    case GL_SAMPLER_2D_ARRAY: return GFXType::SAMPLER2D_ARRAY;
    case GL_SAMPLER_3D: return GFXType::SAMPLER3D;
    case GL_SAMPLER_CUBE: return GFXType::SAMPLER_CUBE;
    default: {
      CCASSERT(false, "Unsupported GLType, convert to GFXType failed.");
      return GFXType::UNKNOWN;
    }
  }
}

GLenum GFXFormatToGLType(GFXFormat format) {
  switch (format) {
    case GFXFormat::R8: return GL_UNSIGNED_BYTE;
    case GFXFormat::R8SN: return GL_BYTE;
    case GFXFormat::R8UI: return GL_UNSIGNED_BYTE;
    case GFXFormat::R8I: return GL_BYTE;
    case GFXFormat::R16F: return GL_HALF_FLOAT;
    case GFXFormat::R16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::R16I: return GL_SHORT;
    case GFXFormat::R32F: return GL_FLOAT;
    case GFXFormat::R32UI: return GL_UNSIGNED_INT;
    case GFXFormat::R32I: return GL_INT;
      
    case GFXFormat::RG8: return GL_UNSIGNED_BYTE;
    case GFXFormat::RG8SN: return GL_BYTE;
    case GFXFormat::RG8UI: return GL_UNSIGNED_BYTE;
    case GFXFormat::RG8I: return GL_BYTE;
    case GFXFormat::RG16F: return GL_HALF_FLOAT;
    case GFXFormat::RG16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::RG16I: return GL_SHORT;
    case GFXFormat::RG32F: return GL_FLOAT;
    case GFXFormat::RG32UI: return GL_UNSIGNED_INT;
    case GFXFormat::RG32I: return GL_INT;
      
    case GFXFormat::RGB8: return GL_UNSIGNED_BYTE;
    case GFXFormat::SRGB8: return GL_UNSIGNED_BYTE;
    case GFXFormat::RGB8SN: return GL_BYTE;
    case GFXFormat::RGB8UI: return GL_UNSIGNED_BYTE;
    case GFXFormat::RGB8I: return GL_BYTE;
    case GFXFormat::RGB16F: return GL_HALF_FLOAT;
    case GFXFormat::RGB16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::RGB16I: return GL_SHORT;
    case GFXFormat::RGB32F: return GL_FLOAT;
    case GFXFormat::RGB32UI: return GL_UNSIGNED_INT;
    case GFXFormat::RGB32I: return GL_INT;
      
    case GFXFormat::RGBA8: return GL_UNSIGNED_BYTE;
    case GFXFormat::SRGB8_A8: return GL_UNSIGNED_BYTE;
    case GFXFormat::RGBA8SN: return GL_BYTE;
    case GFXFormat::RGBA8UI: return GL_UNSIGNED_BYTE;
    case GFXFormat::RGBA8I: return GL_BYTE;
    case GFXFormat::RGBA16F: return GL_HALF_FLOAT;
    case GFXFormat::RGBA16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::RGBA16I: return GL_SHORT;
    case GFXFormat::RGBA32F: return GL_FLOAT;
    case GFXFormat::RGBA32UI: return GL_UNSIGNED_INT;
    case GFXFormat::RGBA32I: return GL_INT;
      
    case GFXFormat::R5G6B5: return GL_UNSIGNED_SHORT_5_6_5;
    case GFXFormat::R11G11B10F: return GL_UNSIGNED_INT_10F_11F_11F_REV;
    case GFXFormat::RGB5A1: return GL_UNSIGNED_SHORT_5_5_5_1;
    case GFXFormat::RGBA4: return GL_UNSIGNED_SHORT_4_4_4_4;
    case GFXFormat::RGB10A2: return GL_UNSIGNED_INT_2_10_10_10_REV;
    case GFXFormat::RGB10A2UI: return GL_UNSIGNED_INT_2_10_10_10_REV;
    case GFXFormat::RGB9E5: return GL_FLOAT;
      
    case GFXFormat::D16: return GL_UNSIGNED_SHORT;
    case GFXFormat::D16S8: return GL_UNSIGNED_SHORT;
    case GFXFormat::D24: return GL_UNSIGNED_INT;
    case GFXFormat::D24S8: return GL_UNSIGNED_INT_24_8;
    case GFXFormat::D32F: return GL_FLOAT;
    case GFXFormat::D32F_S8: return GL_FLOAT_32_UNSIGNED_INT_24_8_REV;
      
    case GFXFormat::BC1: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC1_SRGB: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC2: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC2_SRGB: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC3: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC3_SRGB: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC4: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC4_SNORM: return GL_BYTE;
    case GFXFormat::BC5: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC5_SNORM: return GL_BYTE;
    case GFXFormat::BC6H_SF16: return GL_FLOAT;
    case GFXFormat::BC6H_UF16: return GL_FLOAT;
    case GFXFormat::BC7: return GL_UNSIGNED_BYTE;
    case GFXFormat::BC7_SRGB: return GL_UNSIGNED_BYTE;
      
    case GFXFormat::ETC_RGB8: return GL_UNSIGNED_BYTE;
    case GFXFormat::ETC2_RGB8: return GL_UNSIGNED_BYTE;
    case GFXFormat::ETC2_SRGB8: return GL_UNSIGNED_BYTE;
    case GFXFormat::ETC2_RGB8_A1: return GL_UNSIGNED_BYTE;
    case GFXFormat::ETC2_SRGB8_A1: return GL_UNSIGNED_BYTE;
    case GFXFormat::EAC_R11: return GL_UNSIGNED_BYTE;
    case GFXFormat::EAC_R11SN: return GL_BYTE;
    case GFXFormat::EAC_RG11: return GL_UNSIGNED_BYTE;
    case GFXFormat::EAC_RG11SN: return GL_BYTE;
      
    case GFXFormat::PVRTC_RGB2: return GL_UNSIGNED_BYTE;
    case GFXFormat::PVRTC_RGBA2: return GL_UNSIGNED_BYTE;
    case GFXFormat::PVRTC_RGB4: return GL_UNSIGNED_BYTE;
    case GFXFormat::PVRTC_RGBA4: return GL_UNSIGNED_BYTE;
    case GFXFormat::PVRTC2_2BPP: return GL_UNSIGNED_BYTE;
    case GFXFormat::PVRTC2_4BPP: return GL_UNSIGNED_BYTE;
      
    default: {
      return GL_UNSIGNED_BYTE;
    }
  }
}

uint GLTypeSize(GLenum gl_type) {
  switch (gl_type) {
    case GL_BOOL: return 4;
    case GL_BOOL_VEC2: return 8;
    case GL_BOOL_VEC3: return 12;
    case GL_BOOL_VEC4: return 16;
    case GL_INT: return 4;
    case GL_INT_VEC2: return 8;
    case GL_INT_VEC3: return 12;
    case GL_INT_VEC4: return 16;
    case GL_UNSIGNED_INT: return 4;
    case GL_UNSIGNED_INT_VEC2: return 8;
    case GL_UNSIGNED_INT_VEC3: return 12;
    case GL_UNSIGNED_INT_VEC4: return 16;
    case GL_FLOAT: return 4;
    case GL_FLOAT_VEC2: return 8;
    case GL_FLOAT_VEC3: return 12;
    case GL_FLOAT_VEC4: return 16;
    case GL_FLOAT_MAT2: return 16;
    case GL_FLOAT_MAT2x3: return 24;
    case GL_FLOAT_MAT2x4: return 32;
    case GL_FLOAT_MAT3x2: return 24;
    case GL_FLOAT_MAT3: return 36;
    case GL_FLOAT_MAT3x4: return 48;
    case GL_FLOAT_MAT4x2: return 32;
    case GL_FLOAT_MAT4x3: return 48;
    case GL_FLOAT_MAT4: return 64;
    case GL_SAMPLER_2D: return 4;
    case GL_SAMPLER_2D_ARRAY: return 4;
    case GL_SAMPLER_2D_ARRAY_SHADOW: return 4;
    case GL_SAMPLER_3D: return 4;
    case GL_SAMPLER_CUBE: return 4;
    case GL_INT_SAMPLER_2D: return 4;
    case GL_INT_SAMPLER_2D_ARRAY: return 4;
    case GL_INT_SAMPLER_3D: return 4;
    case GL_INT_SAMPLER_CUBE: return 4;
    case GL_UNSIGNED_INT_SAMPLER_2D: return 4;
    case GL_UNSIGNED_INT_SAMPLER_2D_ARRAY: return 4;
    case GL_UNSIGNED_INT_SAMPLER_3D: return 4;
    case GL_UNSIGNED_INT_SAMPLER_CUBE: return 4;
    default: {
      CCASSERT(false, "Unsupported GLType, get type failed.");
      return 0;
    }
  }
}

uint GLComponentCount (GLenum gl_type) {
  switch (gl_type) {
    case GL_FLOAT_MAT2: return 2;
    case GL_FLOAT_MAT2x3: return 2;
    case GL_FLOAT_MAT2x4: return 2;
    case GL_FLOAT_MAT3x2: return 3;
    case GL_FLOAT_MAT3: return 3;
    case GL_FLOAT_MAT3x4: return 3;
    case GL_FLOAT_MAT4x2: return 4;
    case GL_FLOAT_MAT4x3: return 4;
    case GL_FLOAT_MAT4: return 4;
    default: {
      return 1;
    }
  }
}

const GLenum GLES3_WRAPS[] = {
  GL_REPEAT,
  GL_MIRRORED_REPEAT,
  GL_CLAMP_TO_EDGE,
  GL_CLAMP_TO_EDGE,
};

const GLenum GLES3_CMP_FUNCS[] = {
  GL_NEVER,
  GL_LESS,
  GL_EQUAL,
  GL_LEQUAL,
  GL_GREATER,
  GL_NOTEQUAL,
  GL_GEQUAL,
  GL_ALWAYS,
};

const GLenum GLES3_STENCIL_OPS[] = {
  GL_ZERO,
  GL_KEEP,
  GL_REPLACE,
  GL_INCR,
  GL_DECR,
  GL_INVERT,
  GL_INCR_WRAP,
  GL_DECR_WRAP,
};

const GLenum GLES3_BLEND_OPS[] = {
  GL_FUNC_ADD,
  GL_FUNC_SUBTRACT,
  GL_FUNC_REVERSE_SUBTRACT,
  GL_FUNC_ADD,
  GL_FUNC_ADD,
};

const GLenum GLES3_BLEND_FACTORS[] = {
  GL_ZERO,
  GL_ONE,
  GL_SRC_ALPHA,
  GL_DST_ALPHA,
  GL_ONE_MINUS_SRC_ALPHA,
  GL_ONE_MINUS_DST_ALPHA,
  GL_SRC_COLOR,
  GL_DST_COLOR,
  GL_ONE_MINUS_SRC_COLOR,
  GL_ONE_MINUS_DST_COLOR,
  GL_SRC_ALPHA_SATURATE,
  GL_CONSTANT_COLOR,
  GL_ONE_MINUS_CONSTANT_COLOR,
  GL_CONSTANT_ALPHA,
  GL_ONE_MINUS_CONSTANT_ALPHA,
};

void GLES3CmdFuncCreateBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer) {
  GLenum gl_usage = (gpu_buffer->mem_usage & GFXMemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);
  
  if (gpu_buffer->usage & GFXBufferUsageBit::VERTEX) {
    gpu_buffer->gl_target = GL_ARRAY_BUFFER;
    glGenBuffers(1, &gpu_buffer->gl_buffer);
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
      }
      
      if (device->state_cache->gl_array_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_ARRAY_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_ARRAY_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_ARRAY_BUFFER, 0);
      device->state_cache->gl_array_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDEX) {
    gpu_buffer->gl_target = GL_ELEMENT_ARRAY_BUFFER;
    glGenBuffers(1, &gpu_buffer->gl_buffer);
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
      }
      
      if (device->state_cache->gl_element_array_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
      device->state_cache->gl_element_array_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::UNIFORM) {
    gpu_buffer->gl_target = GL_UNIFORM_BUFFER;
    glGenBuffers(1, &gpu_buffer->gl_buffer);
    if (gpu_buffer->size) {
      if (device->state_cache->gl_uniform_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_UNIFORM_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_UNIFORM_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_UNIFORM_BUFFER, 0);
      device->state_cache->gl_uniform_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDIRECT){
    gpu_buffer->indirect_buff.draws.resize(gpu_buffer->count);
    gpu_buffer->gl_target = GL_NONE;
  } else if ((gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_DST) ||
             (gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_SRC)) {
      gpu_buffer->buffer = (uint8_t*)CC_MALLOC(gpu_buffer->size);
    gpu_buffer->gl_target = GL_NONE;
  } else {
      CCASSERT(false, "Unsupported GFXBufferType, create buffer failed.");
    gpu_buffer->gl_target = GL_NONE;
  }
}

void GLES3CmdFuncDestroyBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer)
{
    if (gpu_buffer->gl_buffer)
    {
        auto* ubo = device->state_cache->gl_bind_ubos;
        for(auto i =0; i < GFX_MAX_BUFFER_BINDINGS; i++)
        {
            if(ubo[i] == gpu_buffer->gl_buffer && gpu_buffer->gl_target == GL_UNIFORM_BUFFER)
            {
                ubo[i] = 0;
                device->state_cache->gl_uniform_buffer = 0;
                break;
            }
        }
        if(gpu_buffer->gl_target == GL_ARRAY_BUFFER)
            device->state_cache->gl_array_buffer = 0;
        else if (gpu_buffer->gl_target == GL_ELEMENT_ARRAY_BUFFER)
            device->state_cache->gl_element_array_buffer = 0;
        
        glDeleteBuffers(1, &gpu_buffer->gl_buffer);
        gpu_buffer->gl_buffer = 0;
        
    }
    
    CC_SAFE_FREE(gpu_buffer->buffer);
}

void GLES3CmdFuncResizeBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer) {
  GLenum gl_usage = (gpu_buffer->mem_usage & GFXMemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);
  
  if (gpu_buffer->usage & GFXBufferUsageBit::VERTEX) {
    gpu_buffer->gl_target = GL_ARRAY_BUFFER;
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
      }
      
      if (device->state_cache->gl_array_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_ARRAY_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_ARRAY_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_ARRAY_BUFFER, 0);
      device->state_cache->gl_array_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDEX) {
    gpu_buffer->gl_target = GL_ELEMENT_ARRAY_BUFFER;
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
      }
      
      if (device->state_cache->gl_element_array_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
      device->state_cache->gl_element_array_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::UNIFORM) {
    gpu_buffer->gl_target = GL_UNIFORM_BUFFER;
    if (gpu_buffer->size) {
      if (device->state_cache->gl_uniform_buffer != gpu_buffer->gl_buffer) {
        glBindBuffer(GL_UNIFORM_BUFFER, gpu_buffer->gl_buffer);
      }
      
      glBufferData(GL_UNIFORM_BUFFER, gpu_buffer->size, nullptr, gl_usage);
      glBindBuffer(GL_UNIFORM_BUFFER, 0);
      device->state_cache->gl_uniform_buffer = 0;
    }
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDIRECT) {
    gpu_buffer->indirect_buff.draws.resize(gpu_buffer->count);
    gpu_buffer->gl_target = GL_NONE;
  } else if ((gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_DST) ||
             (gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_SRC)) {
      if(gpu_buffer->buffer)
      {
          CC_FREE(gpu_buffer->buffer);
      }
      gpu_buffer->buffer = (uint8_t*)CC_MALLOC(gpu_buffer->size);
    gpu_buffer->gl_target = GL_NONE;
  } else {
      CCASSERT(false, "Unsupported GFXBufferType, resize buffer failed.");
    gpu_buffer->gl_target = GL_NONE;
  }
}

void GLES3CmdFuncUpdateBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer, void* buffer, uint offset, uint size) {
  if (gpu_buffer->usage & GFXBufferUsageBit::INDIRECT) {
    memcpy((uint8_t*)gpu_buffer->indirect_buff.draws.data() + offset, buffer, size);
  }
  else if (gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_SRC ||
           gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_DST)
  {
      memcpy((uint8_t*)gpu_buffer->buffer + offset, buffer, size);
  }
  else {
    switch (gpu_buffer->gl_target) {
      case GL_ARRAY_BUFFER: {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
        if (device->state_cache->gl_array_buffer != gpu_buffer->gl_buffer) {
          glBindBuffer(GL_ARRAY_BUFFER, gpu_buffer->gl_buffer);
          device->state_cache->gl_array_buffer = gpu_buffer->gl_buffer;
        }
        glBufferSubData(GL_ARRAY_BUFFER, offset, size, buffer);
        break;
      }
      case GL_ELEMENT_ARRAY_BUFFER: {
        if (device->state_cache->gl_vao) {
          glBindVertexArray(0);
          device->state_cache->gl_vao = 0;
        }
        if (device->state_cache->gl_element_array_buffer != gpu_buffer->gl_buffer) {
          glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->gl_buffer);
          device->state_cache->gl_element_array_buffer = gpu_buffer->gl_buffer;
        }
        glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, offset, size, buffer);
        break;
      }
      case GL_UNIFORM_BUFFER: {
        if (device->state_cache->gl_uniform_buffer != gpu_buffer->gl_buffer) {
          glBindBuffer(GL_UNIFORM_BUFFER, gpu_buffer->gl_buffer);
          device->state_cache->gl_uniform_buffer = gpu_buffer->gl_buffer;
        }
        glBufferSubData(GL_UNIFORM_BUFFER, offset, size, buffer);
        break;
      }
      default:
            CCASSERT(false, "Unsupported GFXBufferType, update buffer failed.");
        break;
    }
  }
}

void GLES3CmdFuncCreateTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture) {
  gpu_texture->gl_internal_fmt = MapGLInternalFormat(gpu_texture->format);
  gpu_texture->gl_format = MapGLFormat(gpu_texture->format);
  gpu_texture->gl_type = GFXFormatToGLType(gpu_texture->format);
  
  switch (gpu_texture->view_type) {
    case GFXTextureViewType::TV2D: {
      gpu_texture->view_type = GFXTextureViewType::TV2D;
      gpu_texture->gl_target = GL_TEXTURE_2D;
      glGenTextures(1, &gpu_texture->gl_texture);
      if (gpu_texture->size > 0) {
        GLuint& gl_texture = device->state_cache->gl_textures[device->state_cache->tex_uint];
        if (gpu_texture->gl_texture != gl_texture) {
          glBindTexture(GL_TEXTURE_2D, gpu_texture->gl_texture);
          gl_texture = gpu_texture->gl_texture;
        }
        uint w = gpu_texture->width;
        uint h = gpu_texture->height;
        if (!GFX_FORMAT_INFOS[(int)gpu_texture->format].is_compressed) {
          for (uint i = 0; i < gpu_texture->mip_level; ++i) {
            glTexImage2D(GL_TEXTURE_2D, i, gpu_texture->gl_internal_fmt, w, h, 0, gpu_texture->gl_format, gpu_texture->gl_type, nullptr);
            w = std::max(1U, w >> 1);
            h = std::max(1U, w >> 1);
          }
        } else {
          for (uint i = 0; i < gpu_texture->mip_level; ++i) {
            uint img_size = GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexImage2D(GL_TEXTURE_2D, i, gpu_texture->gl_internal_fmt, w, h, 0, img_size, nullptr);
            w = std::max(1U, w >> 1);
            h = std::max(1U, w >> 1);
          }
        }
      }
      break;
    }
    case GFXTextureViewType::CUBE: {
      gpu_texture->view_type = GFXTextureViewType::CUBE;
      gpu_texture->gl_target = GL_TEXTURE_CUBE_MAP;
      glGenTextures(1, &gpu_texture->gl_texture);
      if (gpu_texture->size > 0) {
        GLuint& gl_texture = device->state_cache->gl_textures[device->state_cache->tex_uint];
        if (gpu_texture->gl_texture != gl_texture) {
          glBindTexture(GL_TEXTURE_CUBE_MAP, gpu_texture->gl_texture);
          gl_texture = gpu_texture->gl_texture;
        }
        if (!GFX_FORMAT_INFOS[(int)gpu_texture->format].is_compressed) {
          for (uint f = 0; f < 6; ++f) {
            uint w = gpu_texture->width;
            uint h = gpu_texture->height;
            for (uint i = 0; i < gpu_texture->mip_level; ++i) {
              glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpu_texture->gl_internal_fmt, w, h, 0, gpu_texture->gl_format, gpu_texture->gl_type, nullptr);
              w = std::max(1U, w >> 1);
              h = std::max(1U, w >> 1);
            }
          }
        } else {
          for (uint f = 0; f < 6; ++f) {
            uint w = gpu_texture->width;
            uint h = gpu_texture->height;
            for (uint i = 0; i < gpu_texture->mip_level; ++i) {
              uint img_size = GFXFormatSize(gpu_texture->format, w, h, 1);
              glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpu_texture->gl_internal_fmt, w, h, 0, img_size, nullptr);
              w = std::max(1U, w >> 1);
              h = std::max(1U, w >> 1);
            }
          }
        }
      }
      break;
    }
    default:
      CCASSERT(false, "Unsupported GFXTextureType, create texture failed.");
      break;
  }
}

void GLES3CmdFuncDestroyTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture) {
  if (gpu_texture->gl_texture) {
    glDeleteTextures(1, &gpu_texture->gl_texture);
    gpu_texture->gl_texture = 0;
      device->state_cache->gl_textures[device->state_cache->tex_uint] = 0;
  }
}

void GLES3CmdFuncResizeTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture) {
  gpu_texture->gl_internal_fmt = MapGLInternalFormat(gpu_texture->format);
  gpu_texture->gl_format = MapGLFormat(gpu_texture->format);
  gpu_texture->gl_type = GFXFormatToGLType(gpu_texture->format);
  
  switch (gpu_texture->view_type) {
    case GFXTextureViewType::TV2D: {
      gpu_texture->view_type = GFXTextureViewType::TV2D;
      gpu_texture->gl_target = GL_TEXTURE_2D;
      if (gpu_texture->size > 0) {
        GLuint gl_texture = device->state_cache->gl_textures[device->state_cache->tex_uint];
        if (gpu_texture->gl_texture != gl_texture) {
          glBindTexture(GL_TEXTURE_2D, gl_texture);
          gpu_texture->gl_texture = gl_texture;
        }
        uint w = gpu_texture->width;
        uint h = gpu_texture->height;
        if (!GFX_FORMAT_INFOS[(int)gpu_texture->format].is_compressed) {
          for (uint i = 0; i < gpu_texture->mip_level; ++i) {
            glTexImage2D(GL_TEXTURE_2D, i, gpu_texture->gl_internal_fmt, w, h, 0, gpu_texture->gl_format, gpu_texture->gl_type, nullptr);
            w = std::max(1U, w >> 1);
            h = std::max(1U, w >> 1);
          }
        } else {
          for (uint i = 0; i < gpu_texture->mip_level; ++i) {
            uint img_size = GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexImage2D(GL_TEXTURE_2D, i, gpu_texture->gl_internal_fmt, w, h, 0, img_size, nullptr);
            w = std::max(1U, w >> 1);
            h = std::max(1U, w >> 1);
          }
        }
      }
      break;
    }
    case GFXTextureViewType::CUBE: {
      gpu_texture->view_type = GFXTextureViewType::CUBE;
      gpu_texture->gl_target = GL_TEXTURE_CUBE_MAP;
      if (gpu_texture->size > 0) {
        GLuint gl_texture = device->state_cache->gl_textures[device->state_cache->tex_uint];
        if (gpu_texture->gl_texture != gl_texture) {
          glBindTexture(GL_TEXTURE_CUBE_MAP, gl_texture);
          gpu_texture->gl_texture = gl_texture;
        }
        if (!GFX_FORMAT_INFOS[(int)gpu_texture->format].is_compressed) {
          for (uint f = 0; f < 6; ++f) {
            uint w = gpu_texture->width;
            uint h = gpu_texture->height;
            for (uint i = 0; i < gpu_texture->mip_level; ++i) {
              glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpu_texture->gl_internal_fmt, w, h, 0, gpu_texture->gl_format, gpu_texture->gl_type, nullptr);
              w = std::max(1U, w >> 1);
              h = std::max(1U, w >> 1);
            }
          }
        } else {
          for (uint f = 0; f < 6; ++f) {
            uint w = gpu_texture->width;
            uint h = gpu_texture->height;
            for (uint i = 0; i < gpu_texture->mip_level; ++i) {
              uint img_size = GFXFormatSize(gpu_texture->format, w, h, 1);
              glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpu_texture->gl_internal_fmt, w, h, 0, img_size, nullptr);
              w = std::max(1U, w >> 1);
              h = std::max(1U, w >> 1);
            }
          }
        }
      }
      break;
    }
    default:
      CCASSERT(false, "Unsupported GFXTextureType, resize texture failed.");
      break;
  }
}

void GLES3CmdFuncCreateSampler(GLES3Device* device, GLES3GPUSampler* gpu_sampler) {
  glGenSamplers(1, &gpu_sampler->gl_sampler);
  if (gpu_sampler->min_filter == GFXFilter::LINEAR || gpu_sampler->min_filter == GFXFilter::ANISOTROPIC) {
    if (gpu_sampler->mip_filter == GFXFilter::LINEAR || gpu_sampler->mip_filter == GFXFilter::ANISOTROPIC) {
      gpu_sampler->gl_min_filter = GL_LINEAR_MIPMAP_LINEAR;
    } else if (gpu_sampler->mip_filter == GFXFilter::POINT) {
      gpu_sampler->gl_min_filter = GL_LINEAR_MIPMAP_NEAREST;
    } else {
      gpu_sampler->gl_min_filter = GL_LINEAR;
    }
  } else {
    if (gpu_sampler->mip_filter == GFXFilter::LINEAR || gpu_sampler->mip_filter == GFXFilter::ANISOTROPIC) {
      gpu_sampler->gl_min_filter = GL_NEAREST_MIPMAP_LINEAR;
    } else if (gpu_sampler->mip_filter == GFXFilter::POINT) {
      gpu_sampler->gl_min_filter = GL_NEAREST_MIPMAP_NEAREST;
    } else {
      gpu_sampler->gl_min_filter = GL_NEAREST;
    }
  }
  
  if (gpu_sampler->mag_filter == GFXFilter::LINEAR || gpu_sampler->mag_filter == GFXFilter::ANISOTROPIC) {
    gpu_sampler->gl_mag_filter = GL_LINEAR;
  } else {
    gpu_sampler->gl_mag_filter = GL_NEAREST;
  }
  
  gpu_sampler->gl_wrap_s = GLES3_WRAPS[(int)gpu_sampler->address_u];
  gpu_sampler->gl_wrap_t = GLES3_WRAPS[(int)gpu_sampler->address_v];
  gpu_sampler->gl_wrap_r = GLES3_WRAPS[(int)gpu_sampler->address_w];
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_MIN_FILTER, gpu_sampler->gl_min_filter);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_MAG_FILTER, gpu_sampler->gl_mag_filter);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_WRAP_S, gpu_sampler->gl_wrap_s);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_WRAP_T, gpu_sampler->gl_wrap_t);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_WRAP_R, gpu_sampler->gl_wrap_r);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_MIN_LOD, gpu_sampler->min_lod);
  glSamplerParameteri(gpu_sampler->gl_sampler, GL_TEXTURE_MAX_LOD, gpu_sampler->max_lod);
}

void GLES3CmdFuncDestroySampler(GLES3Device* device, GLES3GPUSampler* gpu_sampler) {
  if (gpu_sampler->gl_sampler) {
    glDeleteSamplers(1, &gpu_sampler->gl_sampler);
    gpu_sampler->gl_sampler = 0;
      device->state_cache->gl_samplers[device->state_cache->tex_uint] = 0;
  }
}

void GLES3CmdFuncCreateShader(GLES3Device* device, GLES3GPUShader* gpu_shader) {
  GLenum gl_shader_type = 0;
  String shader_type_str;
  GLint status;
  
  for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
    GLES3GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    
    switch (gpu_stage.type) {
      case GFXShaderType::VERTEX: {
        gl_shader_type = GL_VERTEX_SHADER;
        shader_type_str = "Vertex Shader";
        break;
      }
      case GFXShaderType::FRAGMENT: {
        gl_shader_type = GL_FRAGMENT_SHADER;
        shader_type_str = "Fragment Shader";
        break;
      }
      default: {
        CCASSERT(false, "Unsupported GFXShaderType");
        return;
      }
    }
    
    gpu_stage.gl_shader = glCreateShader(gl_shader_type);
    const char* shader_src = gpu_stage.source.c_str();
    glShaderSource(gpu_stage.gl_shader, 1, (const GLchar**)&shader_src, nullptr);
    glCompileShader(gpu_stage.gl_shader);
    
    glGetShaderiv(gpu_stage.gl_shader, GL_COMPILE_STATUS, &status);
    if (status != 1) {
      GLint log_size = 0;
      glGetShaderiv(gpu_stage.gl_shader, GL_INFO_LOG_LENGTH, &log_size);
      
      ++log_size;
      GLchar* logs = (GLchar*)CC_MALLOC(log_size);
      glGetShaderInfoLog(gpu_stage.gl_shader, log_size, nullptr, logs);
      
      CC_LOG_ERROR("%s in %s compilation failed.", shader_type_str.c_str(), gpu_shader->name.c_str());
      CC_LOG_ERROR("Shader source: %s", gpu_stage.source.c_str());
      CC_LOG_ERROR(logs);
      CC_FREE(logs);
      glDeleteShader(gpu_stage.gl_shader);
      gpu_stage.gl_shader = 0;
      return;
    }
  }
  
  gpu_shader->gl_program = glCreateProgram();
  
  // link program
  for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
    GLES3GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    glAttachShader(gpu_shader->gl_program, gpu_stage.gl_shader);
  }
  
  glLinkProgram(gpu_shader->gl_program);

  // detach & delete immediately
  for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
    GLES3GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    if (gpu_stage.gl_shader) {
      glDetachShader(gpu_shader->gl_program, gpu_stage.gl_shader);
      glDeleteShader(gpu_stage.gl_shader);
      gpu_stage.gl_shader = 0;
    }
  }

  glGetProgramiv(gpu_shader->gl_program, GL_LINK_STATUS, &status);
  if (status != 1) {
    CC_LOG_ERROR("Failed to link Shader [%s].", gpu_shader->name.c_str());
    GLint log_size = 0;
    glGetProgramiv(gpu_shader->gl_program, GL_INFO_LOG_LENGTH, &log_size);
    if (log_size) {
      ++log_size;
      GLchar* logs = (GLchar*)CC_MALLOC(log_size);
      glGetProgramInfoLog(gpu_shader->gl_program, log_size, nullptr, logs);
      
      CC_LOG_ERROR("Failed to link shader '%s'.", gpu_shader->name.c_str());
      CC_LOG_ERROR(logs);
      CC_FREE(logs);
      return;
    }
  }
  
  CC_LOG_INFO("Shader '%s' compilation successed.", gpu_shader->name.c_str());
  
  GLint attr_max_length = 0;
  GLint attr_count = 0;
  glGetProgramiv(gpu_shader->gl_program, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &attr_max_length);
  glGetProgramiv(gpu_shader->gl_program, GL_ACTIVE_ATTRIBUTES, &attr_count);
  
  GLchar gl_name[256];
  GLsizei gl_length;
  GLsizei gl_size;
  GLenum gl_type;
  
  gpu_shader->gpu_inputs.resize(attr_count);
  for (GLint i = 0; i < attr_count; ++i) {
    GLES3GPUInput& gpu_input = gpu_shader->gpu_inputs[i];
    
    memset(gl_name, 0, sizeof(gl_name));
    glGetActiveAttrib(gpu_shader->gl_program, i, attr_max_length, &gl_length, &gl_size, &gl_type, gl_name);
    char* offset = strchr(gl_name, '[');
    if (offset) {
      gl_name[offset - gl_name] = '\0';
    }
    
    gpu_input.gl_loc = glGetAttribLocation(gpu_shader->gl_program, gl_name);
    gpu_input.binding = gpu_input.gl_loc;
    gpu_input.name = gl_name;
    gpu_input.type = MapGFXType(gl_type);
    gpu_input.stride = GLTypeSize(gl_type);
    gpu_input.count = gl_size;
    gpu_input.size = gpu_input.stride * gpu_input.count;
    gpu_input.gl_type = gl_type;
  }
  
  // create uniform blocks
  GLint block_count;
  glGetProgramiv(gpu_shader->gl_program, GL_ACTIVE_UNIFORM_BLOCKS, &block_count);
  if (block_count) {
    GLint gl_block_size = 0;
    GLint gl_block_uniforms = 0;
    uint32_t block_idx = 0;
    
    gpu_shader->gpu_blocks.resize(block_count);
    for (GLint i = 0; i < block_count; ++i) {
      GLES3GPUUniformBlock& gpu_block = gpu_shader->gpu_blocks[i];
      memset(gl_name, 0, sizeof(gl_name));
      glGetActiveUniformBlockName(gpu_shader->gl_program, i, 255, &gl_length, gl_name);
      
      char* offset = strchr(gl_name, '[');
      if (offset) {
        gl_name[offset - gl_name] = '\0';
      }
      
      gpu_block.name = gl_name;
      gpu_block.binding = GFX_INVALID_BINDING;
      for (size_t b = 0; b < gpu_shader->blocks.size(); ++b) {
        GFXUniformBlock& block = gpu_shader->blocks[b];
        if (block.name == gpu_block.name) {
          gpu_block.binding = block.binding;
          break;
        }
      }
      
      if (gpu_block.binding != GFX_INVALID_BINDING) {
        block_idx = i;
        
        glUniformBlockBinding(gpu_shader->gl_program, block_idx, gpu_block.binding);
        
        glGetActiveUniformBlockiv(gpu_shader->gl_program, i, GL_UNIFORM_BLOCK_DATA_SIZE, &gl_block_size);
        glGetActiveUniformBlockiv(gpu_shader->gl_program, i, GL_UNIFORM_BLOCK_ACTIVE_UNIFORMS, &gl_block_uniforms);
        glUniformBlockBinding(gpu_shader->gl_program, block_idx, gpu_block.binding);
        
        gpu_block.size = gl_block_size;
        gpu_block.uniforms.resize(gl_block_uniforms);
        
        vector<GLint>::type u_indices(gl_block_uniforms);
        glGetActiveUniformBlockiv(gpu_shader->gl_program, i, GL_UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES, &u_indices[0]);
        // vector<GLint>::type u_sizes(gl_block_uniforms);
        // glGetActiveUniformsiv(gpu_shader->gl_program, gl_block_uniforms, (const GLuint*)u_indices.data(), GL_UNIFORM_SIZE, &u_sizes[0]);
        vector<GLint>::type u_offsets(gl_block_uniforms);
        glGetActiveUniformsiv(gpu_shader->gl_program, gl_block_uniforms, (const GLuint*)u_indices.data(), GL_UNIFORM_OFFSET, &u_offsets[0]);
        
        for (GLint u = 0; u < gl_block_uniforms; ++u) {
          GLES3GPUUniform& uniform = gpu_block.uniforms[u];
          
          GLint idx = u_indices[u];
          memset(gl_name, 0, sizeof(gl_name));
          glGetActiveUniform(gpu_shader->gl_program, idx, 255, &gl_length, &gl_size, &gl_type, gl_name);
          offset = strchr(gl_name, '[');
          if (offset) {
            gl_name[offset - gl_name] = '\0';
          }
          
          uniform.binding = GFX_INVALID_BINDING;
          uniform.name = gl_name;
          uniform.type = MapGFXType(gl_type);
          uniform.stride = GFX_TYPE_SIZES[(int)uniform.type];
          uniform.count = gl_size;
          uniform.size = uniform.stride * uniform.count;
          uniform.offset = u_offsets[u];
          uniform.gl_type = gl_type;
          uniform.gl_loc = -1;
        }
      } // if
    }
  } // if
  
  // create uniform samplers
  if (gpu_shader->samplers.size()) {
    gpu_shader->gpu_samplers.resize(gpu_shader->samplers.size());
    
    for (size_t i = 0; i < gpu_shader->gpu_samplers.size(); ++i) {
      GFXUniformSampler& sampler = gpu_shader->samplers[i];
      GLES3GPUUniformSampler& gpu_sampler = gpu_shader->gpu_samplers[i];
      gpu_sampler.binding = sampler.binding;
      gpu_sampler.name = sampler.name;
      gpu_sampler.type = sampler.type;
      gpu_sampler.gl_type = MapGLType(gpu_sampler.type);
      gpu_sampler.gl_loc = -1;
    }
  }
  
  // parse uniforms
  GLint active_uniforms;
  glGetProgramiv(gpu_shader->gl_program, GL_ACTIVE_UNIFORMS, &active_uniforms);
  
  GLint unit_idx = 0;
  
  GLES3GPUUniformSamplerList active_gpu_samplers;
  
  for (GLint i = 0; i < active_uniforms; ++i) {
    memset(gl_name, 0, sizeof(gl_name));
    glGetActiveUniform(gpu_shader->gl_program, i, 255, &gl_length, &gl_size, &gl_type, gl_name);
    char* u_offset = strchr(gl_name, '[');
    if (u_offset) {
      gl_name[u_offset - gl_name] = '\0';
    }

    bool is_sampler = (gl_type == GL_SAMPLER_2D) ||
                      (gl_type == GL_SAMPLER_3D) ||
                      (gl_type == GL_SAMPLER_CUBE) ||
                      (gl_type == GL_SAMPLER_CUBE_SHADOW) ||
                      (gl_type == GL_SAMPLER_2D_ARRAY) ||
                      (gl_type == GL_SAMPLER_2D_ARRAY_SHADOW);
    if (is_sampler) {
      String u_name = gl_name;
      for (size_t s = 0; s < gpu_shader->gpu_samplers.size(); ++s) {
        GLES3GPUUniformSampler& gpu_sampler = gpu_shader->gpu_samplers[s];
        if (gpu_sampler.name == u_name) {
          gpu_sampler.units.resize(gl_size);
          for (GLsizei u = 0; u < gl_size; ++u) {
            gpu_sampler.units[u] = unit_idx + u;
          }
          
          gpu_sampler.gl_loc = glGetUniformLocation(gpu_shader->gl_program, gl_name);
          unit_idx += gl_size;
          
          active_gpu_samplers.push_back(gpu_sampler);
          break;
        }
      }
    } // if
  } // for
  
  if (active_gpu_samplers.size()) {
    if (device->state_cache->gl_program != gpu_shader->gl_program) {
      glUseProgram(gpu_shader->gl_program);
      device->state_cache->gl_program = gpu_shader->gl_program;
    }
    
    for (size_t i = 0; i < active_gpu_samplers.size(); ++i) {
      GLES3GPUUniformSampler& gpu_sampler = active_gpu_samplers[i];
      glUniform1iv(gpu_sampler.gl_loc, (GLsizei)gpu_sampler.units.size(), gpu_sampler.units.data());
    }
  }
}

void GLES3CmdFuncDestroyShader(GLES3Device* device, GLES3GPUShader* gpu_shader) {
  if (gpu_shader->gl_program) {
    glDeleteProgram(gpu_shader->gl_program);
    gpu_shader->gl_program = 0;
  }
}

void GLES3CmdFuncCreateInputAssembler(GLES3Device* device, GLES3GPUInputAssembler* gpu_ia) {
  
  if (gpu_ia->gpu_index_buffer) {
    switch (gpu_ia->gpu_index_buffer->stride) {
      case 1: gpu_ia->gl_index_type = GL_UNSIGNED_BYTE; break;
      case 2: gpu_ia->gl_index_type = GL_UNSIGNED_SHORT; break;
      case 4: gpu_ia->gl_index_type = GL_UNSIGNED_INT; break;
      default: {
        CC_LOG_ERROR("Illegal index buffer stride.");
      }
    }
  }
  
  uint stream_offsets[GFX_MAX_VERTEX_ATTRIBUTES] = {0};
  
  gpu_ia->gpu_attribs.resize(gpu_ia->attribs.size());
  for (size_t i = 0; i < gpu_ia->gpu_attribs.size(); ++i) {
    GLES3GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[i];
    const GFXAttribute& attrib = gpu_ia->attribs[i];
    
    GLES3GPUBuffer* gpu_vb = (GLES3GPUBuffer*)gpu_ia->gpu_vertex_buffers[attrib.stream];
    
    gpu_attrib.name = attrib.name;
    gpu_attrib.gl_type = GFXFormatToGLType(attrib.format);
    gpu_attrib.size = GFX_FORMAT_INFOS[(int)attrib.format].size;
    gpu_attrib.count = GFX_FORMAT_INFOS[(int)attrib.format].count;
    gpu_attrib.component_count = GLComponentCount(gpu_attrib.gl_type);
    gpu_attrib.is_normalized = attrib.is_normalized;
    gpu_attrib.is_instanced = attrib.is_instanced;
    gpu_attrib.offset = stream_offsets[attrib.stream];
    
    if (gpu_vb) {
      gpu_attrib.gl_buffer = gpu_vb->gl_buffer;
      gpu_attrib.stride = gpu_vb->stride;
    }
      stream_offsets[attrib.stream] += gpu_attrib.size;
  }
}

void GLES3CmdFuncDestroyInputAssembler(GLES3Device* device, GLES3GPUInputAssembler* gpu_ia) {
  for (auto it = gpu_ia->gl_vaos.begin(); it != gpu_ia->gl_vaos.end(); ++it) {
    glDeleteVertexArrays(1, &it->second);
  }
  gpu_ia->gl_vaos.clear();
    device->state_cache->gl_vao = 0;
}

void GLES3CmdFuncCreateFramebuffer(GLES3Device* device, GLES3GPUFramebuffer* gpu_fbo) {
  if (gpu_fbo->is_offscreen) {
    glGenFramebuffers(1, &gpu_fbo->gl_fbo);
    if (device->state_cache->gl_fbo != gpu_fbo->gl_fbo) {
      glBindFramebuffer(GL_FRAMEBUFFER, gpu_fbo->gl_fbo);
      device->state_cache->gl_fbo = gpu_fbo->gl_fbo;
    }

    GLenum attachments[GFX_MAX_ATTACHMENTS] = {0};
    uint attachment_count = 0;
    
    for (size_t i = 0; i < gpu_fbo->gpu_color_views.size(); ++i) {
      GLES3GPUTextureView* gpu_color_view = gpu_fbo->gpu_color_views[i];
      if (gpu_color_view && gpu_color_view->gpu_texture) {
        glFramebufferTexture2D(GL_FRAMEBUFFER, (GLenum)(GL_COLOR_ATTACHMENT0 + i), gpu_color_view->gpu_texture->gl_target, gpu_color_view->gpu_texture->gl_texture, gpu_color_view->base_level);
        
        attachments[attachment_count++] = (GLenum)(GL_COLOR_ATTACHMENT0 + i);
      }
    }
    
    if (gpu_fbo->gpu_depth_stencil_view) {
      GLES3GPUTextureView* gpu_dsv = gpu_fbo->gpu_depth_stencil_view;
      const GLenum gl_attachment = GFX_FORMAT_INFOS[(int)gpu_dsv->format].has_stencil ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT;
      glFramebufferTexture2D(GL_FRAMEBUFFER, gl_attachment, gpu_dsv->gpu_texture->gl_target, gpu_dsv->gpu_texture->gl_texture, gpu_dsv->base_level);
    }
    
    glDrawBuffers(attachment_count, attachments);
    
    GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
    if (status != GL_FRAMEBUFFER_COMPLETE) {
      switch (status) {
        case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT: {
          CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
          break;
        }
        case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: {
          CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
          break;
        }
        case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS: {
          CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
          break;
        }
        case GL_FRAMEBUFFER_UNSUPPORTED: {
          CC_LOG_ERROR("glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
          break;
        }
        default:;
      }
    }
  }
}

void GLES3CmdFuncDestroyFramebuffer(GLES3Device* device, GLES3GPUFramebuffer* gpu_fbo) {
  if (gpu_fbo->gl_fbo) {
    glDeleteFramebuffers(1, &gpu_fbo->gl_fbo);
    gpu_fbo->gl_fbo = 0;
      device->state_cache->gl_fbo = 0;
  }
}

void GLES3CmdFuncExecuteCmds(GLES3Device* device, GLES3CmdPackage* cmd_package) {
  static uint cmd_indices[(int)GFXCmdType::COUNT] = {0};
  static GLenum gl_attachments[GFX_MAX_ATTACHMENTS] = {0};
  
  memset(cmd_indices, 0, sizeof(cmd_indices));
  
  GLES3StateCache* cache = device->state_cache;
  GLES3GPURenderPass* gpu_render_pass = nullptr;
  bool is_shader_changed = false;
  GLES3GPUPipelineState* gpu_pso = nullptr;
  GLenum gl_primitive = 0;
  GLES3GPUInputAssembler* gpu_ia = nullptr;
  GLES3CmdBeginRenderPass* cmd_begin_render_pass = nullptr;
  
  for (uint i = 0; i < cmd_package->cmd_types.size(); ++i) {
    GFXCmdType cmd_type = cmd_package->cmd_types[i];
    uint& cmd_idx = cmd_indices[(int)cmd_type];
    
    switch (cmd_type) {
      case GFXCmdType::BEGIN_RENDER_PASS: {
        GLES3CmdBeginRenderPass* cmd = cmd_package->begin_render_pass_cmds[cmd_idx];
        cmd_begin_render_pass = cmd;
        if (cmd->gpu_fbo) {
          if (cache->gl_fbo != cmd->gpu_fbo->gl_fbo) {
            glBindFramebuffer(GL_FRAMEBUFFER, cmd->gpu_fbo->gl_fbo);
            cache->gl_fbo = cmd->gpu_fbo->gl_fbo;
          }
          
          if (cache->viewport.left != cmd->render_area.x ||
              cache->viewport.top != cmd->render_area.y ||
              cache->viewport.width != cmd->render_area.width ||
              cache->viewport.height != cmd->render_area.height) {
            glViewport(cmd->render_area.x, cmd->render_area.y, cmd->render_area.width, cmd->render_area.height);
            cache->viewport.left = cmd->render_area.x;
            cache->viewport.top = cmd->render_area.y;
            cache->viewport.width = cmd->render_area.width;
            cache->viewport.height = cmd->render_area.height;
          }
          
          if (cache->scissor.x != cmd->render_area.x ||
              cache->scissor.y != cmd->render_area.y ||
              cache->scissor.width != cmd->render_area.width ||
              cache->scissor.height != cmd->render_area.height) {
            glScissor(cmd->render_area.x, cmd->render_area.y, cmd->render_area.width, cmd->render_area.height);
            cache->scissor.x = cmd->render_area.x;
            cache->scissor.y = cmd->render_area.y;
            cache->scissor.width = cmd->render_area.width;
            cache->scissor.height = cmd->render_area.height;
          }
          
          GLbitfield gl_clears = 0;
          uint num_attachments = 0;
          
          gpu_render_pass = cmd->gpu_fbo->gpu_render_pass;
          for (uint j = 0; j < cmd->num_clear_colors; ++j) {
            const GFXColorAttachment& color_attachment = gpu_render_pass->color_attachments[j];
            if (color_attachment.format != GFXFormat::UNKNOWN) {
              switch (color_attachment.load_op) {
                case GFXLoadOp::LOAD: break; // GL default behaviour
                case GFXLoadOp::CLEAR: {
                  if (cmd->clear_flags & GFXClearFlagBit::COLOR) {
                    if (cache->bs.targets[0].blend_color_mask != GFXColorMask::ALL) {
                      glColorMask(true, true, true, true);
                    }
                    
                    if (cmd->gpu_fbo->is_offscreen) {
                      static float f_colors[4];
                      f_colors[0] = cmd->clear_colors[j].r;
                      f_colors[1] = cmd->clear_colors[j].g;
                      f_colors[2] = cmd->clear_colors[j].b;
                      f_colors[3] = cmd->clear_colors[j].a;
                      glClearBufferfv(GL_COLOR, j, f_colors);
                    } else {
                      const GFXColor& color = cmd->clear_colors[j];
                      glClearColor(color.r, color.g, color.b, color.a);
                      gl_clears |= GL_COLOR_BUFFER_BIT;
                    }
                  }
                  break;
                }
                case GFXLoadOp::DISCARD: {
                  // invalidate fbo
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR);
                  break;
                }
                default:;
              }
            }
          } // for
          
          if (gpu_render_pass->depth_stencil_attachment.format != GFXFormat::UNKNOWN) {
            bool has_depth = GFX_FORMAT_INFOS[(int)gpu_render_pass->depth_stencil_attachment.format].has_depth;
            if (has_depth) {
              switch (gpu_render_pass->depth_stencil_attachment.depth_load_op) {
                case GFXLoadOp::LOAD: break; // GL default behaviour
                case GFXLoadOp::CLEAR: {
                    glDepthMask(true);
                    cache->dss.depth_write = true;
                  glClearDepthf(cmd->clear_depth);
                  gl_clears |= GL_DEPTH_BUFFER_BIT;
                  break;
                }
                case GFXLoadOp::DISCARD: {
                  // invalidate fbo
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH);
                  break;
                }
                default:;
              }
            } // if (has_depth)
            bool has_stencils = GFX_FORMAT_INFOS[(int)gpu_render_pass->depth_stencil_attachment.format].has_stencil;
            if (has_stencils) {
              switch (gpu_render_pass->depth_stencil_attachment.depth_load_op) {
                case GFXLoadOp::LOAD: break; // GL default behaviour
                case GFXLoadOp::CLEAR: {
                  if (!cache->dss.stencil_write_mask_front) {
                    glStencilMaskSeparate(GL_FRONT, 0xffffffff);
                  }
                  if (!cache->dss.stencil_write_mask_back) {
                    glStencilMaskSeparate(GL_BACK, 0xffffffff);
                  }
                  glClearStencil(cmd->clear_stencil);
                  gl_clears |= GL_STENCIL_BUFFER_BIT;
                  break;
                }
                case GFXLoadOp::DISCARD: {
                  // invalidate fbo
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL);
                  break;
                }
                default:;
              }
            } // if (has_stencils)
          } // if
          
          if (num_attachments) {
            glInvalidateFramebuffer(GL_FRAMEBUFFER, num_attachments, gl_attachments);
          }
          
          if (gl_clears) {
            glClear(gl_clears);
          }
          
          // restore states
          if (gl_clears & GL_COLOR_BUFFER_BIT) {
            GFXColorMask color_mask = cache->bs.targets[0].blend_color_mask;
            if (color_mask != GFXColorMask::ALL) {
              glColorMask((GLboolean)(color_mask & GFXColorMask::R),
                (GLboolean)(color_mask & GFXColorMask::G),
                (GLboolean)(color_mask & GFXColorMask::B),
                (GLboolean)(color_mask & GFXColorMask::A));
            }
          }
          
          if ((gl_clears & GL_COLOR_BUFFER_BIT) && !cache->dss.depth_write) {
            glDepthMask(false);
          }
          
          if (gl_clears & GL_STENCIL_BUFFER_BIT) {
            if (!cache->dss.stencil_write_mask_front) {
              glStencilMaskSeparate(GL_FRONT, 0);
            }
            if (!cache->dss.stencil_write_mask_back) {
              glStencilMaskSeparate(GL_BACK, 0);
            }
          }
        }
        break;
      }
      case GFXCmdType::END_RENDER_PASS: {
        GLES3CmdBeginRenderPass* cmd = cmd_begin_render_pass;
        uint num_attachments = 0;
        for (uint j = 0; j < cmd->num_clear_colors; ++j) {
          const GFXColorAttachment& color_attachment = gpu_render_pass->color_attachments[j];
          if (color_attachment.format != GFXFormat::UNKNOWN) {
            switch (color_attachment.load_op) {
              case GFXLoadOp::LOAD: break; // GL default behaviour
              case GFXLoadOp::CLEAR: break;
              case GFXLoadOp::DISCARD: {
                // invalidate fbo
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR);
                break;
              }
              default:;
            }
          }
        } // for
        
        if (gpu_render_pass->depth_stencil_attachment.format != GFXFormat::UNKNOWN) {
          bool has_depth = GFX_FORMAT_INFOS[(int)gpu_render_pass->depth_stencil_attachment.format].has_depth;
          if (has_depth) {
            switch (gpu_render_pass->depth_stencil_attachment.depth_load_op) {
              case GFXLoadOp::LOAD: break; // GL default behaviour
              case GFXLoadOp::CLEAR: break;
              case GFXLoadOp::DISCARD: {
                // invalidate fbo
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH);
                break;
              }
              default:;
            }
          } // if (has_depth)
          bool has_stencils = GFX_FORMAT_INFOS[(int)gpu_render_pass->depth_stencil_attachment.format].has_stencil;
          if (has_stencils) {
            switch (gpu_render_pass->depth_stencil_attachment.depth_load_op) {
              case GFXLoadOp::LOAD: break; // GL default behaviour
              case GFXLoadOp::CLEAR: break;
              case GFXLoadOp::DISCARD: {
                // invalidate fbo
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL);
                break;
              }
              default:;
            }
          } // if (has_stencils)
        } // if
        
        if (num_attachments) {
          glInvalidateFramebuffer(GL_FRAMEBUFFER, num_attachments, gl_attachments);
        }
        break;
      }
      case GFXCmdType::BIND_STATES: {
        GLES3CmdBindStates* cmd = cmd_package->bind_states_cmds[cmd_idx];
        is_shader_changed = false;
          if (cache->viewport.left != cmd->viewport.left ||
              cache->viewport.top != cmd->viewport.top ||
              cache->viewport.width != cmd->viewport.width ||
              cache->viewport.height != cmd->viewport.height) {
              glViewport(cmd->viewport.left, cmd->viewport.top, cmd->viewport.width, cmd->viewport.height);
              cache->viewport.left = cmd->viewport.left;
              cache->viewport.top = cmd->viewport.top;
              cache->viewport.width = cmd->viewport.width;
              cache->viewport.height = cmd->viewport.height;
          }
        if (cmd->gpu_pso) {
          gpu_pso = cmd->gpu_pso;
          gl_primitive = gpu_pso->gl_primitive;
          
          if (gpu_pso->gpu_shader) {
            if (cache->gl_program != gpu_pso->gpu_shader->gl_program) {
              glUseProgram(gpu_pso->gpu_shader->gl_program);
              cache->gl_program = gpu_pso->gpu_shader->gl_program;
              is_shader_changed = true;
            }
          }
          
          // bind rasterizer state
          if (cache->rs.cull_mode != gpu_pso->rs.cull_mode) {
            switch (gpu_pso->rs.cull_mode) {
              case GFXCullMode::NONE: {
                if (cache->is_cull_face_enabled) {
                  glDisable(GL_CULL_FACE);
                  cache->is_cull_face_enabled = false;
                }
              } break;
              case GFXCullMode::FRONT: {
                if (!cache->is_cull_face_enabled) {
                  glEnable(GL_CULL_FACE);
                  cache->is_cull_face_enabled = true;
                }
                glCullFace(GL_FRONT);
              } break;
              case GFXCullMode::BACK: {
                if (!cache->is_cull_face_enabled) {
                  glEnable(GL_CULL_FACE);
                  cache->is_cull_face_enabled = true;
                }
                glCullFace(GL_BACK);
              } break;
              default:
                break;
            }
            cache->rs.cull_mode = gpu_pso->rs.cull_mode;
          }
        }
        if (cache->rs.is_front_face_ccw != gpu_pso->rs.is_front_face_ccw) {
          glFrontFace(gpu_pso->rs.is_front_face_ccw? GL_CCW : GL_CW);
          cache->rs.is_front_face_ccw = gpu_pso->rs.is_front_face_ccw;
        }
        if ((cache->rs.depth_bias != gpu_pso->rs.depth_bias) ||
            (cache->rs.depth_bias_slope != gpu_pso->rs.depth_bias_slope)){
          glPolygonOffset(cache->rs.depth_bias, cache->rs.depth_bias_slope);
          cache->rs.depth_bias_slope = gpu_pso->rs.depth_bias_slope;
        }
        if (cache->rs.line_width != gpu_pso->rs.line_width) {
          glLineWidth(gpu_pso->rs.line_width);
          cache->rs.line_width = gpu_pso->rs.line_width;
        }
        
        // bind depth-stencil state
        if (cache->dss.depth_test != gpu_pso->dss.depth_test) {
          if (gpu_pso->dss.depth_test) {
              glEnable(GL_DEPTH_TEST);
          } else {
              glDisable(GL_DEPTH_TEST);
          }
          cache->dss.depth_test = gpu_pso->dss.depth_test;
        }
        if (cache->dss.depth_write != gpu_pso->dss.depth_write) {
          glDepthMask(gpu_pso->dss.depth_write);
          cache->dss.depth_write = gpu_pso->dss.depth_write;
        }
        if (cache->dss.depth_func != gpu_pso->dss.depth_func) {
          glDepthFunc(GLES3_CMP_FUNCS[(int)gpu_pso->dss.depth_func]);
          cache->dss.depth_func = gpu_pso->dss.depth_func;
        }
        
        // bind depth-stencil state - front
          if (gpu_pso->dss.stencil_test_front || gpu_pso->dss.stencil_test_back) {
            if (!cache->is_stencil_test_enabled) {
              glEnable(GL_STENCIL_TEST);
              cache->is_stencil_test_enabled = true;
            }
          } else {
            if (cache->is_stencil_test_enabled) {
              glDisable(GL_STENCIL_TEST);
              cache->is_stencil_test_enabled = false;
            }
          }
        if (cache->dss.stencil_func_front != gpu_pso->dss.stencil_func_front ||
            cache->dss.stencil_ref_front != gpu_pso->dss.stencil_ref_front ||
            cache->dss.stencil_read_mask_front != gpu_pso->dss.stencil_read_mask_front) {
          glStencilFuncSeparate(GL_FRONT,
                                GLES3_CMP_FUNCS[(int)gpu_pso->dss.stencil_func_front],
                                gpu_pso->dss.stencil_ref_front,
                                gpu_pso->dss.stencil_read_mask_front);
        }
        if (cache->dss.stencil_fail_op_front != gpu_pso->dss.stencil_fail_op_front ||
            cache->dss.stencil_z_fail_op_front != gpu_pso->dss.stencil_z_fail_op_front ||
            cache->dss.stencil_pass_op_front != gpu_pso->dss.stencil_pass_op_front) {
          glStencilOpSeparate(GL_FRONT,
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_fail_op_front],
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_z_fail_op_front],
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_pass_op_front]);
        }
        if (cache->dss.stencil_write_mask_front != gpu_pso->dss.stencil_write_mask_front) {
          glStencilMaskSeparate(GL_FRONT, gpu_pso->dss.stencil_write_mask_front);
          cache->dss.stencil_write_mask_front = gpu_pso->dss.stencil_write_mask_front;
        }
        
        // bind depth-stencil state - back
        if (cache->dss.stencil_func_back != gpu_pso->dss.stencil_func_back ||
            cache->dss.stencil_ref_back != gpu_pso->dss.stencil_ref_back ||
            cache->dss.stencil_read_mask_back != gpu_pso->dss.stencil_read_mask_back) {
          glStencilFuncSeparate(GL_BACK,
                                GLES3_CMP_FUNCS[(int)gpu_pso->dss.stencil_func_back],
                                gpu_pso->dss.stencil_ref_back,
                                gpu_pso->dss.stencil_read_mask_back);
        }
        if (cache->dss.stencil_fail_op_back != gpu_pso->dss.stencil_fail_op_back ||
            cache->dss.stencil_z_fail_op_back != gpu_pso->dss.stencil_z_fail_op_back ||
            cache->dss.stencil_pass_op_back != gpu_pso->dss.stencil_pass_op_back) {
          glStencilOpSeparate(GL_BACK,
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_fail_op_back],
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_z_fail_op_back],
                              GLES3_STENCIL_OPS[(int)gpu_pso->dss.stencil_pass_op_back]);
        }
        if (cache->dss.stencil_write_mask_back != gpu_pso->dss.stencil_write_mask_back) {
          glStencilMaskSeparate(GL_BACK, gpu_pso->dss.stencil_write_mask_back);
          cache->dss.stencil_write_mask_back = gpu_pso->dss.stencil_write_mask_back;
        }
        
        // bind blend state
        if (cache->bs.is_a2c != gpu_pso->bs.is_a2c) {
          if (cache->bs.is_a2c) {
            glEnable(GL_SAMPLE_ALPHA_TO_COVERAGE);
          } else {
            glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE);
          }
        }
        if (cache->bs.blend_color.r != gpu_pso->bs.blend_color.r ||
            cache->bs.blend_color.g != gpu_pso->bs.blend_color.g ||
            cache->bs.blend_color.b != gpu_pso->bs.blend_color.b ||
            cache->bs.blend_color.a != gpu_pso->bs.blend_color.a) {
          
          glBlendColor(gpu_pso->bs.blend_color.r,
                       gpu_pso->bs.blend_color.g,
                       gpu_pso->bs.blend_color.b,
                       gpu_pso->bs.blend_color.a);
          cache->bs.blend_color = gpu_pso->bs.blend_color;
        }
        
        GFXBlendTarget& cache_target = cache->bs.targets[0];
        const GFXBlendTarget& target = gpu_pso->bs.targets[0];
        if (cache_target.is_blend != target.is_blend) {
          if (!cache_target.is_blend) {
            glEnable(GL_BLEND);
          } else {
            glDisable(GL_BLEND);
          }
          cache_target.is_blend = target.is_blend;
        }
        if (cache_target.blend_eq != target.blend_eq ||
            cache_target.blend_alpha_eq != target.blend_alpha_eq) {
          glBlendEquationSeparate(GLES3_BLEND_OPS[(int)target.blend_eq],
                                  GLES3_BLEND_OPS[(int)target.blend_alpha_eq]);
          cache_target.blend_eq = target.blend_eq;
          cache_target.blend_alpha_eq = target.blend_alpha_eq;
        }
        if (cache_target.blend_src != target.blend_src ||
            cache_target.blend_dst != target.blend_dst ||
            cache_target.blend_src_alpha != target.blend_src_alpha ||
            cache_target.blend_dst_alpha != target.blend_dst_alpha) {
          glBlendFuncSeparate(GLES3_BLEND_FACTORS[(int)target.blend_src],
                              GLES3_BLEND_FACTORS[(int)target.blend_dst],
                              GLES3_BLEND_FACTORS[(int)target.blend_src_alpha],
                              GLES3_BLEND_FACTORS[(int)target.blend_dst_alpha]);
          cache_target.blend_src = target.blend_src;
          cache_target.blend_dst = target.blend_dst;
          cache_target.blend_src_alpha = target.blend_src_alpha;
          cache_target.blend_dst_alpha = target.blend_dst_alpha;
        }
        if (cache_target.blend_color_mask != target.blend_color_mask) {
          glColorMask((GLboolean)(target.blend_color_mask & GFXColorMask::R),
            (GLboolean)(target.blend_color_mask & GFXColorMask::G),
            (GLboolean)(target.blend_color_mask & GFXColorMask::B),
            (GLboolean)(target.blend_color_mask & GFXColorMask::A));
          cache_target.blend_color_mask = target.blend_color_mask;
        }
        
        // bind shader resources
        if (cmd->gpu_binding_layout && gpu_pso->gpu_shader) {
          for(size_t j = 0; j < cmd->gpu_binding_layout->gpu_bindings.size(); ++j) {
            const GLES3GPUBinding& gpu_binding = cmd->gpu_binding_layout->gpu_bindings[j];
            switch (gpu_binding.type) {
              case GFXBindingType::UNIFORM_BUFFER: {
                if (gpu_binding.gpu_buffer) {
                  for (size_t k = 0; k < gpu_pso->gpu_shader->gpu_blocks.size(); ++k) {
                    const GLES3GPUUniformBlock& gpu_block = gpu_pso->gpu_shader->gpu_blocks[k];
                    if ((gpu_block.binding == gpu_binding.binding) && cache->gl_bind_ubos[gpu_block.binding] != gpu_binding.gpu_buffer->gl_buffer)
                    {
                      glBindBufferBase(GL_UNIFORM_BUFFER, gpu_block.binding, gpu_binding.gpu_buffer->gl_buffer);
                      cache->gl_bind_ubos[gpu_block.binding] = gpu_binding.gpu_buffer->gl_buffer;
                      cache->gl_uniform_buffer = gpu_binding.gpu_buffer->gl_buffer;
                    }
                  }
                }
                break;
              }
              case GFXBindingType::SAMPLER: {
                if (gpu_binding.gpu_sampler) {
                  for (size_t k = 0; k < gpu_pso->gpu_shader->gpu_samplers.size(); ++k) {
                    const GLES3GPUUniformSampler& gpu_sampler = gpu_pso->gpu_shader->gpu_samplers[k];
                    if (gpu_sampler.binding == gpu_binding.binding) {
                      for (size_t u = 0; u < gpu_sampler.units.size(); ++u) {
                        uint unit = (uint)gpu_sampler.units[u];
                        
                        if (gpu_binding.gpu_tex_view && (gpu_binding.gpu_tex_view->gpu_texture->size > 0)) {
                          GLuint gl_texture = gpu_binding.gpu_tex_view->gpu_texture->gl_texture;
                          if (cache->gl_textures[unit] != gl_texture) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glBindTexture(gpu_binding.gpu_tex_view->gpu_texture->gl_target, gl_texture);
                            cache->gl_textures[unit] = gl_texture;
                          }
                          
                          if (cache->gl_samplers[unit] != gpu_binding.gpu_sampler->gl_sampler) {
                            glBindSampler(unit, gpu_binding.gpu_sampler->gl_sampler);
                            cache->gl_samplers[unit] = gpu_binding.gpu_sampler->gl_sampler;
                          }
                        }
                      }
                      break;
                    }
                  }
                }
                break;
              }
              default:
                break;
            }
          }
        } // if
        
        // bind vao
        if (cmd->gpu_ia && gpu_pso->gpu_shader &&
            (is_shader_changed || gpu_ia != cmd->gpu_ia)) {
          gpu_ia = cmd->gpu_ia;
          if (device->use_vao()) {
            const auto it = gpu_ia->gl_vaos.find(gpu_pso->gpu_shader->gl_program);
            if (it != gpu_ia->gl_vaos.end()) {
              GLuint gl_vao = it->second;
              if (!gl_vao) {
                glGenVertexArrays(1, &gl_vao);
                gpu_ia->gl_vaos.insert(std::make_pair(gpu_pso->gpu_shader->gl_program, gl_vao));
                glBindVertexArray(gl_vao);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                
                for (size_t j = 0; j < gpu_pso->gpu_shader->gpu_inputs.size(); ++j) {
                  const GLES3GPUInput& gpu_input = gpu_pso->gpu_shader->gpu_inputs[j];
                  for (size_t a = 0; a < gpu_ia->attribs.size(); ++a) {
                    const GLES3GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[a];
                    if (gpu_attrib.name == gpu_input.name) {
                      glBindBuffer(GL_ARRAY_BUFFER, gpu_attrib.gl_buffer);
                      
                      for (uint c = 0; c < gpu_attrib.component_count; ++c) {
                        GLint gl_loc = gpu_input.gl_loc + c;
                        uint attrib_offset = gpu_attrib.offset + gpu_attrib.size * c;
                        glEnableVertexAttribArray(gl_loc);
                        
                        cache->gl_enabled_attrib_locs[gl_loc] = true;
                        glVertexAttribPointer(gl_loc, gpu_attrib.count, gpu_attrib.gl_type, gpu_attrib.is_normalized, gpu_attrib.stride, BUFFER_OFFSET(attrib_offset));
                        glVertexAttribDivisor(gl_loc, gpu_attrib.is_instanced ? 1 : 0);
                      }
                      break;
                    }
                  } // for
                } // for
                
                if (gpu_ia->gpu_index_buffer) {
                  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_ia->gpu_index_buffer->gl_buffer);
                }
                
                glBindVertexArray(0);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                cache->gl_vao = 0;
                cache->gl_array_buffer = 0;
                cache->gl_element_array_buffer = 0;
              }
              
              if (cache->gl_vao != gl_vao) {
                glBindVertexArray(gl_vao);
                cache->gl_vao = gl_vao;
              }
            } else {
              for (uint a = 0; a < GFX_MAX_VERTEX_ATTRIBUTES; ++a) {
                cache->gl_current_attrib_locs[a] = false;
              }

              for (size_t j = 0; j < gpu_pso->gpu_shader->gpu_inputs.size(); ++j) {
                const GLES3GPUInput& gpu_input = gpu_pso->gpu_shader->gpu_inputs[j];
                for (size_t a = 0; a < gpu_ia->attribs.size(); ++a) {
                  const GLES3GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[a];
                  if (gpu_attrib.name == gpu_input.name) {
                    glBindBuffer(GL_ARRAY_BUFFER, gpu_attrib.gl_buffer);

                    for (uint c = 0; c < gpu_attrib.component_count; ++c) {
                      GLint gl_loc = gpu_input.gl_loc + c;
                      uint attrib_offset = gpu_attrib.offset + gpu_attrib.size * c;
                      glEnableVertexAttribArray(gl_loc);
                      cache->gl_current_attrib_locs[gl_loc] = true;
                      cache->gl_enabled_attrib_locs[gl_loc] = true;
                      glVertexAttribPointer(gl_loc, gpu_attrib.count, gpu_attrib.gl_type, gpu_attrib.is_normalized, gpu_attrib.stride, BUFFER_OFFSET(attrib_offset));
                      glVertexAttribDivisor(gl_loc, gpu_attrib.is_instanced ? 1 : 0);
                    }
                    break;
                  }
                } // for
              } // for

              if (gpu_ia->gpu_index_buffer) {
                if (cache->gl_element_array_buffer != gpu_ia->gpu_index_buffer->gl_buffer) {
                  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_ia->gpu_index_buffer->gl_buffer);
                  cache->gl_element_array_buffer = gpu_ia->gpu_index_buffer->gl_buffer;
                }
              }

              for (uint a = 0; a < GFX_MAX_VERTEX_ATTRIBUTES; ++a) {
                if (cache->gl_enabled_attrib_locs[a] != cache->gl_current_attrib_locs[a]) {
                  glDisableVertexAttribArray(a);
                  cache->gl_enabled_attrib_locs[a] = false;
                }
              }
            }
          } // if
        }
        
        break;
      }
      case GFXCmdType::DRAW: {
        GLES3CmdDraw* cmd = cmd_package->draw_cmds[cmd_idx];
        if (gpu_ia && gpu_pso) {
          if (!gpu_ia->gpu_indirect_buffer) {
            if (gpu_ia->gpu_index_buffer && cmd->draw_info.index_count >= 0) {
              uint8_t* offset = 0;
              offset += cmd->draw_info.first_index * gpu_ia->gpu_index_buffer->stride;
              if (cmd->draw_info.instance_count == 0) {
                glDrawElements(gl_primitive, cmd->draw_info.index_count, gpu_ia->gl_index_type, offset);
              } else {
                glDrawElementsInstanced(gl_primitive, cmd->draw_info.index_count, gpu_ia->gl_index_type, offset, cmd->draw_info.instance_count);
              }
            } else {
              if (cmd->draw_info.instance_count == 0) {
                glDrawArrays(gl_primitive, cmd->draw_info.first_index, cmd->draw_info.vertex_count);
              } else {
                glDrawArraysInstanced(gl_primitive, cmd->draw_info.first_index, cmd->draw_info.vertex_count, cmd->draw_info.instance_count);
              }
            }
          } else {
            for (size_t j = 0; j < gpu_ia->gpu_indirect_buffer->indirect_buff.draws.size(); ++j) {
              GFXDrawInfo& draw = gpu_ia->gpu_indirect_buffer->indirect_buff.draws[j];
              if (gpu_ia->gpu_index_buffer && draw.index_count >= 0) {
                uint8_t* offset = 0;
                offset += draw.first_index * gpu_ia->gpu_index_buffer->stride;
                if (cmd->draw_info.instance_count == 0) {
                  glDrawElements(gl_primitive, draw.index_count, gpu_ia->gl_index_type, offset);
                } else {
                  glDrawElementsInstanced(gl_primitive, draw.index_count, gpu_ia->gl_index_type, offset, cmd->draw_info.instance_count);
                }
              } else {
                if (cmd->draw_info.instance_count == 0) {
                  glDrawArrays(gl_primitive, draw.first_index, draw.vertex_count);
                } else {
                  glDrawArraysInstanced(gl_primitive, draw.first_index, draw.vertex_count, cmd->draw_info.instance_count);
                }
              }
            }
          }
        }
        break;
      }
      case GFXCmdType::UPDATE_BUFFER: {
        GLES3CmdUpdateBuffer* cmd = cmd_package->update_buffer_cmds[cmd_idx];
        GLES3CmdFuncUpdateBuffer(device, cmd->gpu_buffer, cmd->buffer, cmd->offset, cmd->size);
        break;
      }
      case GFXCmdType::COPY_BUFFER_TO_TEXTURE: {
        GLES3CmdCopyBufferToTexture* cmd = cmd_package->copy_buffer_to_texture_cmds[cmd_idx];
        GLES3CmdFuncCopyBuffersToTexture(device, &(cmd->gpu_buffer->buffer), 1, cmd->gpu_texture, cmd->regions);
        break;
      }
      default:
        break;
    }
      cmd_idx++;
  }
}

void GLES3CmdFuncCopyBuffersToTexture(GLES3Device* device, uint8_t** buffers, uint count, GLES3GPUTexture* gpu_texture, const GFXBufferTextureCopyList& regions) {
  GLuint gl_texture = device->state_cache->gl_textures[device->state_cache->tex_uint];
  if (gl_texture != gpu_texture->gl_texture) {
    glBindTexture(gpu_texture->gl_target, gpu_texture->gl_texture);
    device->state_cache->gl_textures[device->state_cache->tex_uint] = gl_texture;
  }

  bool is_compressed = GFX_FORMAT_INFOS[(int)gpu_texture->format].is_compressed;
  uint n = 0;

  switch (gpu_texture->gl_target) {
  case GL_TEXTURE_2D: {
    uint w;
    uint h;
    for (size_t i = 0; i < regions.size(); ++i) {
      const GFXBufferTextureCopy& region = regions[i];
      n = 0;
      w = region.tex_extent.width;
      h = region.tex_extent.height;
      for (uint m = region.tex_subres.base_mip_level; m < region.tex_subres.base_mip_level + region.tex_subres.level_count; ++m) {
        uint8_t* buff = region.buff_offset + region.buff_tex_height * region.buff_stride + buffers[n++];
        if (!is_compressed) {
          glTexSubImage2D(GL_TEXTURE_2D, m, region.tex_offset.x, region.tex_offset.y, w, h, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
        } else {
          GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, h, 1);
          glCompressedTexSubImage2D(GL_TEXTURE_2D, m, region.tex_offset.x, region.tex_offset.y, w, h, gpu_texture->gl_format, memSize, (GLvoid*)buff);
        }

        w = std::max(w >> 1, 1U);
        h = std::max(h >> 1, 1U);
      }
    }
    break;
  }
  case GL_TEXTURE_2D_ARRAY: {
    uint w;
    uint h;
    for (size_t i = 0; i < regions.size(); ++i) {
      const GFXBufferTextureCopy& region = regions[i];
      n = 0;
      uint d = region.tex_subres.layer_count;
      uint layer_count = d + region.tex_subres.base_array_layer;

      for (uint z = region.tex_subres.base_array_layer; z < layer_count; ++z) {
        w = region.tex_extent.width;
        h = region.tex_extent.height;
        for (uint m = region.tex_subres.base_mip_level; m < region.tex_subres.base_mip_level + region.tex_subres.level_count; ++m) {
          uint8_t* buff = region.buff_offset + region.buff_tex_height * region.buff_stride + buffers[n++];
          if (!is_compressed) {
            glTexSubImage3D(GL_TEXTURE_2D_ARRAY, m, region.tex_offset.x, region.tex_offset.y, z, 
              w, h, d, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
          }
          else {
            GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexSubImage3D(GL_TEXTURE_2D_ARRAY, m, region.tex_offset.x, region.tex_offset.y, z,
              w, h, d, gpu_texture->gl_format, memSize, (GLvoid*)buff);
          }

          w = std::max(w >> 1, 1U);
          h = std::max(h >> 1, 1U);
        }
      }
    }
    break;
  }
  case GL_TEXTURE_3D: {
    uint w;
    uint h;
    uint d;
    for (size_t i = 0; i < regions.size(); ++i) {
      const GFXBufferTextureCopy& region = regions[i];
      n = 0;
      w = region.tex_extent.width;
      h = region.tex_extent.height;
      d = region.tex_extent.depth;
      for (uint m = region.tex_subres.base_mip_level; m < region.tex_subres.base_mip_level + region.tex_subres.level_count; ++m) {
        uint8_t* buff = region.buff_offset + region.buff_tex_height * region.buff_stride + buffers[n++];
        if (!is_compressed) {
          glTexSubImage3D(GL_TEXTURE_3D, m, region.tex_offset.x, region.tex_offset.y, region.tex_offset.z, 
            w, h, d, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
        }
        else {
          GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, d + 1, 1);
          glCompressedTexSubImage3D(GL_TEXTURE_3D, m, region.tex_offset.x, region.tex_offset.y, region.tex_offset.z, 
            w, h, d, gpu_texture->gl_format, memSize, (GLvoid*)buff);
        }

        w = std::max(w >> 1, 1U);
        h = std::max(h >> 1, 1U);
        d = std::max(d >> 1, 1U);
      }
    }
    break;
  }
  case GL_TEXTURE_CUBE_MAP: {
    uint w;
    uint h;
    uint f;
    for (size_t i = 0; i < regions.size(); ++i) {
      const GFXBufferTextureCopy& region = regions[i];
      n = 0;
      
      uint face_count = region.tex_subres.base_array_layer + region.tex_subres.layer_count;
      for (f = region.tex_subres.base_array_layer; f < face_count; ++f) {
        w = region.tex_extent.width;
        h = region.tex_extent.height;

        for (uint m = region.tex_subres.base_mip_level; m < region.tex_subres.base_mip_level + region.tex_subres.level_count; ++m) {
          uint8_t* buff = region.buff_offset + region.buff_tex_height * region.buff_stride + buffers[n++];
          if (!is_compressed) {
            glTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, m, region.tex_offset.x, region.tex_offset.y, w, h, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
          }
          else {
            GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, m, region.tex_offset.x, region.tex_offset.y, w, h, gpu_texture->gl_format, memSize, (GLvoid*)buff);
          }

          w = std::max(w >> 1, 1U);
          h = std::max(h >> 1, 1U);
        }
      }
    }
    break;
  }
  default:
    CCASSERT(false, "Unsupported GFXTextureType, copy buffers to texture failed.");
    break;
  }
    
    if(gpu_texture->flags & GFXTextureFlagBit::GEN_MIPMAP)
    {
        glBindTexture(gpu_texture->gl_target, gpu_texture->gl_texture);
        glGenerateMipmap(gpu_texture->gl_target);
    }
}


NS_CC_END
