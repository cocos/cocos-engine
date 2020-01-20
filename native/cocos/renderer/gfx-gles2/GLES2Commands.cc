#include "GLES2Std.h"
#include "GLES2Commands.h"
#include "GLES2Device.h"
#include "GLES2StateCache.h"

#define BUFFER_OFFSET(idx) (static_cast<char*>(0) + (idx))

NS_CC_BEGIN

GLenum MapGLInternalFormat(GFXFormat format) {
  switch (format) {
    case GFXFormat::A8: return GL_ALPHA;
    case GFXFormat::L8: return GL_LUMINANCE;
    case GFXFormat::LA8: return GL_LUMINANCE_ALPHA;
    case GFXFormat::R8: return GL_LUMINANCE;
    case GFXFormat::R8SN: return GL_LUMINANCE;
    case GFXFormat::R8UI: return GL_LUMINANCE;
    case GFXFormat::R8I: return GL_LUMINANCE;
    case GFXFormat::RG8: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG8SN: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG8UI: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG8I: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RGB8: return GL_RGB;
    case GFXFormat::RGB8SN: return GL_RGB;
    case GFXFormat::RGB8UI: return GL_RGB;
    case GFXFormat::RGB8I: return GL_RGB;
    case GFXFormat::RGBA8: return GL_RGBA;
    case GFXFormat::RGBA8SN: return GL_RGBA;
    case GFXFormat::RGBA8UI: return GL_RGBA;
    case GFXFormat::RGBA8I: return GL_RGBA;
    case GFXFormat::R16I: return GL_LUMINANCE;
    case GFXFormat::R16UI: return GL_LUMINANCE;
    case GFXFormat::R16F: return GL_LUMINANCE;
    case GFXFormat::RG16I: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG16UI: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG16F: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RGB16I: return GL_RGB;
    case GFXFormat::RGB16UI: return GL_RGB;
    case GFXFormat::RGB16F: return GL_RGB;
    case GFXFormat::RGBA16I: return GL_RGBA;
    case GFXFormat::RGBA16UI: return GL_RGBA;
    case GFXFormat::RGBA16F: return GL_RGBA;
    case GFXFormat::R32I: return GL_LUMINANCE;
    case GFXFormat::R32UI: return GL_LUMINANCE;
    case GFXFormat::R32F: return GL_LUMINANCE;
    case GFXFormat::RG32I: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG32UI: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RG32F: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RGB32I: return GL_RGB;
    case GFXFormat::RGB32UI: return GL_RGB;
    case GFXFormat::RGB32F: return GL_RGB;
    case GFXFormat::RGBA32I: return GL_RGBA;
    case GFXFormat::RGBA32UI: return GL_RGBA;
    case GFXFormat::RGBA32F: return GL_RGBA;
    case GFXFormat::R5G6B5: return GL_RGB565;
    case GFXFormat::RGB5A1: return GL_RGB5_A1;
    case GFXFormat::RGBA4: return GL_RGBA4;
    case GFXFormat::RGB10A2: return GL_RGB;
    case GFXFormat::RGB10A2UI: return GL_RGB;
    case GFXFormat::R11G11B10F: return GL_RGB;
    case GFXFormat::D16: return GL_DEPTH_COMPONENT;
    case GFXFormat::D16S8: return GL_DEPTH_STENCIL_OES;
    case GFXFormat::D24: return GL_DEPTH_COMPONENT;
    case GFXFormat::D24S8: return GL_DEPTH_STENCIL_OES;
    case GFXFormat::D32F: return GL_DEPTH_COMPONENT;
    case GFXFormat::D32F_S8: return GL_DEPTH_STENCIL_OES;
      
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
    case GFXFormat::R8I: return GL_LUMINANCE;
    case GFXFormat::RG8:
    case GFXFormat::RG8SN:
    case GFXFormat::RG8UI:
    case GFXFormat::RG8I: return GL_LUMINANCE_ALPHA;
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
    case GFXFormat::R16F: return GL_LUMINANCE;
    case GFXFormat::RG16UI:
    case GFXFormat::RG16I:
    case GFXFormat::RG16F: return GL_LUMINANCE_ALPHA;
    case GFXFormat::RGB16UI:
    case GFXFormat::RGB16I:
    case GFXFormat::RGB16F: return GL_RGB;
    case GFXFormat::RGBA16UI:
    case GFXFormat::RGBA16I:
    case GFXFormat::RGBA16F: return GL_RGBA;
    case GFXFormat::R32UI:
    case GFXFormat::R32I:
    case GFXFormat::R32F: return GL_LUMINANCE;
    case GFXFormat::RG32UI:
    case GFXFormat::RG32I:
    case GFXFormat::RG32F: return GL_LUMINANCE_ALPHA;
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
    case GFXFormat::D16S8: return GL_DEPTH_STENCIL_OES;
    case GFXFormat::D24: return GL_DEPTH_COMPONENT;
    case GFXFormat::D24S8: return GL_DEPTH_STENCIL_OES;
    case GFXFormat::D32F: return GL_DEPTH_COMPONENT;
    case GFXFormat::D32F_S8: return GL_DEPTH_STENCIL_OES;
      
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
    case GFXType::MAT3: return GL_FLOAT_MAT3;
    case GFXType::MAT4: return GL_FLOAT_MAT4;
    case GFXType::SAMPLER2D: return GL_SAMPLER_2D;
    case GFXType::SAMPLER3D: return GL_SAMPLER_3D_OES;
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
    case GL_FLOAT: return GFXType::FLOAT;
    case GL_FLOAT_VEC2: return GFXType::FLOAT2;
    case GL_FLOAT_VEC3: return GFXType::FLOAT3;
    case GL_FLOAT_VEC4: return GFXType::FLOAT4;
    case GL_FLOAT_MAT2: return GFXType::MAT2;
    case GL_FLOAT_MAT3: return GFXType::MAT3;
    case GL_FLOAT_MAT4: return GFXType::MAT4;
    case GL_SAMPLER_2D: return GFXType::SAMPLER2D;
    case GL_SAMPLER_3D_OES: return GFXType::SAMPLER3D;
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
    case GFXFormat::R16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::R16I: return GL_SHORT;
    case GFXFormat::R32F: return GL_FLOAT;
    case GFXFormat::R32UI: return GL_UNSIGNED_INT;
    case GFXFormat::R32I: return GL_INT;
      
    case GFXFormat::RG8: return GL_UNSIGNED_BYTE;
    case GFXFormat::RG8SN: return GL_BYTE;
    case GFXFormat::RG8UI: return GL_UNSIGNED_BYTE;
    case GFXFormat::RG8I: return GL_BYTE;
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
    case GFXFormat::RGB16F: return GL_HALF_FLOAT_OES;
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
    case GFXFormat::RGBA16F: return GL_HALF_FLOAT_OES;
    case GFXFormat::RGBA16UI: return GL_UNSIGNED_SHORT;
    case GFXFormat::RGBA16I: return GL_SHORT;
    case GFXFormat::RGBA32F: return GL_FLOAT;
    case GFXFormat::RGBA32UI: return GL_UNSIGNED_INT;
    case GFXFormat::RGBA32I: return GL_INT;
      
    case GFXFormat::R5G6B5: return GL_UNSIGNED_SHORT_5_6_5;
    case GFXFormat::R11G11B10F: return GL_FLOAT;
    case GFXFormat::RGB5A1: return GL_UNSIGNED_SHORT_5_5_5_1;
    case GFXFormat::RGBA4: return GL_UNSIGNED_SHORT_4_4_4_4;
    case GFXFormat::RGB10A2: return GL_UNSIGNED_BYTE;
    case GFXFormat::RGB10A2UI: return GL_UNSIGNED_INT;
    case GFXFormat::RGB9E5: return GL_FLOAT;
      
    case GFXFormat::D16: return GL_UNSIGNED_SHORT;
    case GFXFormat::D16S8: return GL_UNSIGNED_SHORT;
    case GFXFormat::D24: return GL_UNSIGNED_INT;
    case GFXFormat::D24S8: return GL_UNSIGNED_INT_24_8_OES;
    case GFXFormat::D32F: return GL_FLOAT;
      
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
    case GL_FLOAT: return 4;
    case GL_FLOAT_VEC2: return 8;
    case GL_FLOAT_VEC3: return 12;
    case GL_FLOAT_VEC4: return 16;
    case GL_FLOAT_MAT2: return 16;
    case GL_FLOAT_MAT3: return 36;
    case GL_FLOAT_MAT4: return 64;
    case GL_SAMPLER_2D: return 4;
    case GL_SAMPLER_3D_OES: return 4;
    case GL_SAMPLER_CUBE: return 4;
    case GL_SAMPLER_CUBE_MAP_ARRAY_OES: return 4;
    case GL_SAMPLER_CUBE_MAP_ARRAY_SHADOW_OES: return 4;
    case GL_INT_SAMPLER_CUBE_MAP_ARRAY_OES: return 4;
    case GL_UNSIGNED_INT_SAMPLER_CUBE_MAP_ARRAY_OES: return 4;
    default: {
      CCASSERT(false, "Unsupported GLType, get type failed.");
      return 0;
    }
  }
}

uint GLComponentCount (GLenum gl_type) {
  switch (gl_type) {
    case GL_FLOAT_MAT2: return 2;
    case GL_FLOAT_MAT3: return 3;
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

const GLenum GLES2_CMP_FUNCS[] = {
  GL_NEVER,
  GL_LESS,
  GL_EQUAL,
  GL_LEQUAL,
  GL_GREATER,
  GL_NOTEQUAL,
  GL_GEQUAL,
  GL_ALWAYS,
};

const GLenum GLES2_STENCIL_OPS[] = {
  GL_ZERO,
  GL_KEEP,
  GL_REPLACE,
  GL_INCR,
  GL_DECR,
  GL_INVERT,
  GL_INCR_WRAP,
  GL_DECR_WRAP,
};

const GLenum GLES2_BLEND_OPS[] = {
  GL_FUNC_ADD,
  GL_FUNC_SUBTRACT,
  GL_FUNC_REVERSE_SUBTRACT,
  GL_FUNC_ADD,
  GL_FUNC_ADD,
};

const GLenum GLES2_BLEND_FACTORS[] = {
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

void GLES2CmdFuncCreateBuffer(GLES2Device* device, GLES2GPUBuffer* gpu_buffer) {
  GLenum gl_usage = (gpu_buffer->mem_usage & GFXMemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);
  
  if (gpu_buffer->usage & GFXBufferUsageBit::VERTEX) {
    gpu_buffer->gl_target = GL_ARRAY_BUFFER;
    glGenBuffers(1, &gpu_buffer->gl_buffer);
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArrayOES(0);
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
          glBindVertexArrayOES(0);
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
    gpu_buffer->buffer = (uint8_t*)CC_MALLOC(gpu_buffer->size);
    gpu_buffer->gl_target = GL_NONE;
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

void GLES2CmdFuncDestroyBuffer(GLES2Device* device, GLES2GPUBuffer* gpu_buffer)
{
    if (gpu_buffer->gl_buffer)
    {
        glDeleteBuffers(1, &gpu_buffer->gl_buffer);
        gpu_buffer->gl_buffer = 0;
        if(gpu_buffer->gl_target == GL_ARRAY_BUFFER)
            device->state_cache->gl_array_buffer = 0;
        else if (gpu_buffer->gl_target == GL_ELEMENT_ARRAY_BUFFER)
            device->state_cache->gl_element_array_buffer = 0;

    }

    CC_SAFE_FREE(gpu_buffer->buffer);
}

void GLES2CmdFuncResizeBuffer(GLES2Device* device, GLES2GPUBuffer* gpu_buffer) {
  GLenum gl_usage = (gpu_buffer->mem_usage & GFXMemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);
  
  if (gpu_buffer->usage & GFXBufferUsageBit::VERTEX) {
    gpu_buffer->gl_target = GL_ARRAY_BUFFER;
    if (gpu_buffer->size) {
      if (device->use_vao()) {
        if (device->state_cache->gl_vao) {
          glBindVertexArrayOES(0);
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
          glBindVertexArrayOES(0);
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
    if (gpu_buffer->buffer) {
      CC_FREE(gpu_buffer->buffer);
    }
    gpu_buffer->buffer = (uint8_t*)CC_MALLOC(gpu_buffer->size);
    gpu_buffer->gl_target = GL_NONE;
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDIRECT) {
    gpu_buffer->indirect_buff.draws.resize(gpu_buffer->count);
    gpu_buffer->gl_target = GL_NONE;
  } else if ((gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_DST) ||
             (gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_SRC)) {
      if (gpu_buffer->buffer) {
          CC_FREE(gpu_buffer->buffer);
      }
      gpu_buffer->buffer = (uint8_t*)CC_MALLOC(gpu_buffer->size);
    gpu_buffer->gl_target = GL_NONE;
  } else {
      CCASSERT(false, "Unsupported GFXBufferType, resize buffer failed.");
    gpu_buffer->gl_target = GL_NONE;
  }
}

void GLES2CmdFuncUpdateBuffer(GLES2Device* device, GLES2GPUBuffer* gpu_buffer, void* buffer, uint offset, uint size) {
  if (gpu_buffer->usage & GFXBufferUsageBit::UNIFORM) {
    memcpy(gpu_buffer->buffer + offset, buffer, size);
  } else if (gpu_buffer->usage & GFXBufferUsageBit::INDIRECT) {
    memcpy((uint8_t*)gpu_buffer->indirect_buff.draws.data() + offset, buffer, size);
  } else if (gpu_buffer->usage & GFXBufferUsageBit::TRANSFER_SRC) {
      memcpy(gpu_buffer->buffer + offset, buffer, size);
  } else {
    switch (gpu_buffer->gl_target) {
      case GL_ARRAY_BUFFER: {
        if (device->state_cache->gl_vao) {
          glBindVertexArrayOES(0);
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
          glBindVertexArrayOES(0);
          device->state_cache->gl_vao = 0;
        }
        if (device->state_cache->gl_element_array_buffer != gpu_buffer->gl_buffer) {
          glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_buffer->gl_buffer);
          device->state_cache->gl_element_array_buffer = gpu_buffer->gl_buffer;
        }
        glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, offset, size, buffer);
        break;
      }
      default:
            CCASSERT(false, "Unsupported GFXBufferType, update buffer failed.");
        break;
    }
  }
}

void GLES2CmdFuncCreateTexture(GLES2Device* device, GLES2GPUTexture* gpu_texture) {
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

void GLES2CmdFuncDestroyTexture(GLES2Device* device, GLES2GPUTexture* gpu_texture) {
  if (gpu_texture->gl_texture) {
    glDeleteTextures(1, &gpu_texture->gl_texture);
    gpu_texture->gl_texture = 0;
      device->state_cache->gl_textures[device->state_cache->tex_uint] = 0;
  }
}

void GLES2CmdFuncResizeTexture(GLES2Device* device, GLES2GPUTexture* gpu_texture) {
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
            h = std::max(1U, h >> 1);
          }
        } else {
          for (uint i = 0; i < gpu_texture->mip_level; ++i) {
            uint img_size = GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexImage2D(GL_TEXTURE_2D, i, gpu_texture->gl_internal_fmt, w, h, 0, img_size, nullptr);
            w = std::max(1U, w >> 1);
            h = std::max(1U, h >> 1);
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
              h = std::max(1U, h >> 1);
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
              h = std::max(1U, h >> 1);
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

void GLES2CmdFuncCreateSampler(GLES2Device* device, GLES2GPUSampler* gpu_sampler) {
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
}

void GLES2CmdFuncDestroySampler(GLES2Device* device, GLES2GPUSampler* gpu_sampler) {
}

void GLES2CmdFuncCreateShader(GLES2Device* device, GLES2GPUShader* gpu_shader) {
  GLenum gl_shader_type = 0;
  String shader_type_str;
  GLint status;
  
  for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
    GLES2GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    
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
      CC_LOG_ERROR("Shader source:%s", gpu_stage.source.c_str());
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
    GLES2GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    glAttachShader(gpu_shader->gl_program, gpu_stage.gl_shader);
  }
  
  glLinkProgram(gpu_shader->gl_program);
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
      for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
        GLES2GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
        glDeleteShader(gpu_stage.gl_shader);
        gpu_stage.gl_shader = 0;
      }
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
    GLES2GPUInput& gpu_input = gpu_shader->gpu_inputs[i];
    
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
  if (gpu_shader->blocks.size()) {

    gpu_shader->gpu_blocks.resize(gpu_shader->blocks.size());

    for (size_t i = 0; i < gpu_shader->gpu_blocks.size(); ++i) {
      GLES2GPUUniformBlock& gpu_block = gpu_shader->gpu_blocks[i];
      GFXUniformBlock& block = gpu_shader->blocks[i];

      gpu_block.name = block.name;
      gpu_block.binding = block.binding;
      gpu_block.uniforms.resize(block.uniforms.size());

      for (size_t j = 0; j < gpu_block.uniforms.size(); ++j) {
        GLES2GPUUniform& gpu_uniform = gpu_block.uniforms[j];
        GFXUniform& uniform = block.uniforms[j];

        gpu_uniform.binding = GFX_INVALID_BINDING;
        gpu_uniform.name = uniform.name;
        gpu_uniform.type = uniform.type;
        gpu_uniform.stride = GFX_TYPE_SIZES[(int)uniform.type];
        gpu_uniform.count = uniform.count;
        gpu_uniform.size = gpu_uniform.stride * gpu_uniform.count;
        gpu_uniform.offset = gpu_block.size;
        gpu_uniform.gl_type = MapGLType(gpu_uniform.type);
        gpu_uniform.gl_loc = -1;
        gpu_uniform.buff = nullptr;

        gpu_block.size += gpu_uniform.size;
      }
    }
  } // if

  // create uniform samplers
  if (gpu_shader->samplers.size()) {
    gpu_shader->gpu_samplers.resize(gpu_shader->samplers.size());

    for (size_t i = 0; i < gpu_shader->gpu_samplers.size(); ++i) {
      GFXUniformSampler& sampler = gpu_shader->samplers[i];
      GLES2GPUUniformSampler& gpu_sampler = gpu_shader->gpu_samplers[i];
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

  GLES2GPUUniformSamplerList active_gpu_samplers;

  for (GLint i = 0; i < active_uniforms; ++i) {
    memset(gl_name, 0, sizeof(gl_name));
    glGetActiveUniform(gpu_shader->gl_program, i, 255, &gl_length, &gl_size, &gl_type, gl_name);
    char* u_offset = strchr(gl_name, '[');
    if (u_offset) {
      gl_name[u_offset - gl_name] = '\0';
    }
    String u_name = gl_name;

    bool is_sampler = (gl_type == GL_SAMPLER_2D) ||
      (gl_type == GL_SAMPLER_3D_OES) ||
      (gl_type == GL_SAMPLER_CUBE) ||
      (gl_type == GL_SAMPLER_CUBE_MAP_ARRAY_OES) ||
      (gl_type == GL_SAMPLER_CUBE_MAP_ARRAY_SHADOW_OES) ||
      (gl_type == GL_INT_SAMPLER_CUBE_MAP_ARRAY_OES) ||
      (gl_type == GL_UNSIGNED_INT_SAMPLER_CUBE_MAP_ARRAY_OES);
    if (is_sampler) {
      for (size_t s = 0; s < gpu_shader->gpu_samplers.size(); ++s) {
        GLES2GPUUniformSampler& gpu_sampler = gpu_shader->gpu_samplers[s];
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
    } else {
      for (size_t b = 0; b < gpu_shader->gpu_blocks.size(); ++b) {
        GLES2GPUUniformBlock& gpu_block = gpu_shader->gpu_blocks[b];
        for (size_t u = 0; u < gpu_block.uniforms.size(); ++u) {
          if (gpu_block.uniforms[u].name == u_name) {
            GLES2GPUUniform& gpu_uniform = gpu_block.uniforms[u];
            gpu_uniform.gl_loc = glGetUniformLocation(gpu_shader->gl_program, gl_name);
            gpu_uniform.buff = (uint8_t*)CC_MALLOC(gpu_uniform.size);

            gpu_block.active_uniforms.emplace_back(gpu_uniform);
            break;
          }
        }
      }
    }
  } // for

  if (active_gpu_samplers.size()) {
    if (device->state_cache->gl_program != gpu_shader->gl_program) {
      glUseProgram(gpu_shader->gl_program);
      device->state_cache->gl_program = gpu_shader->gl_program;
    }

    for (size_t i = 0; i < active_gpu_samplers.size(); ++i) {
      GLES2GPUUniformSampler& gpu_sampler = active_gpu_samplers[i];
      glUniform1iv(gpu_sampler.gl_loc, (GLsizei)gpu_sampler.units.size(), gpu_sampler.units.data());
    }
  }
}

void GLES2CmdFuncDestroyShader(GLES2Device* device, GLES2GPUShader* gpu_shader) {
  for (size_t i = 0; i < gpu_shader->gpu_stages.size(); ++i) {
    GLES2GPUShaderStage& gpu_stage = gpu_shader->gpu_stages[i];
    if (gpu_stage.gl_shader) {
      glDeleteShader(gpu_stage.gl_shader);
      gpu_stage.gl_shader = 0;
    }
  }
  if (gpu_shader->gl_program) {
    glDeleteProgram(gpu_shader->gl_program);
    gpu_shader->gl_program = 0;
  }
}

void GLES2CmdFuncCreateInputAssembler(GLES2Device* device, GLES2GPUInputAssembler* gpu_ia) {
  
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
    GLES2GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[i];
    const GFXAttribute& attrib = gpu_ia->attribs[i];
    
    GLES2GPUBuffer* gpu_vb = (GLES2GPUBuffer*)gpu_ia->gpu_vertex_buffers[attrib.stream];
    
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

void GLES2CmdFuncDestroyInputAssembler(GLES2Device* device, GLES2GPUInputAssembler* gpu_ia) {
  for (auto it = gpu_ia->gl_vaos.begin(); it != gpu_ia->gl_vaos.end(); ++it) {
    glDeleteVertexArraysOES(1, &it->second);
  }
  gpu_ia->gl_vaos.clear();
    device->state_cache->gl_vao = 0;
}

void GLES2CmdFuncCreateFramebuffer(GLES2Device* device, GLES2GPUFramebuffer* gpu_fbo) {
  if (gpu_fbo->is_offscreen) {
    glGenFramebuffers(1, &gpu_fbo->gl_fbo);
    if (device->state_cache->gl_fbo != gpu_fbo->gl_fbo) {
      glBindFramebuffer(GL_FRAMEBUFFER, gpu_fbo->gl_fbo);
      device->state_cache->gl_fbo = gpu_fbo->gl_fbo;
    }

    GLenum attachments[GFX_MAX_ATTACHMENTS] = {0};
    uint attachment_count = 0;
    
    for (size_t i = 0; i < gpu_fbo->gpu_color_views.size(); ++i) {
      GLES2GPUTextureView* gpu_color_view = gpu_fbo->gpu_color_views[i];
      if (gpu_color_view && gpu_color_view->gpu_texture) {
        glFramebufferTexture2D(GL_FRAMEBUFFER, (GLenum)(GL_COLOR_ATTACHMENT0 + i), gpu_color_view->gpu_texture->gl_target, gpu_color_view->gpu_texture->gl_texture, gpu_color_view->base_level);
        
        attachments[attachment_count++] = (GLenum)(GL_COLOR_ATTACHMENT0 + i);
      }
    }
    
    if (gpu_fbo->gpu_depth_stencil_view) {
      GLES2GPUTextureView* gpu_dsv = gpu_fbo->gpu_depth_stencil_view;
      glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, gpu_dsv->gpu_texture->gl_target, gpu_dsv->gpu_texture->gl_texture, gpu_dsv->base_level);
      
      if (GFX_FORMAT_INFOS[(int)gpu_dsv->format].has_stencil) {
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, gpu_dsv->gpu_texture->gl_target, gpu_dsv->gpu_texture->gl_texture, gpu_dsv->base_level);
      }
    }
    
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

void GLES2CmdFuncDestroyFramebuffer(GLES2Device* device, GLES2GPUFramebuffer* gpu_fbo) {
  if (gpu_fbo->gl_fbo) {
    glDeleteFramebuffers(1, &gpu_fbo->gl_fbo);
    gpu_fbo->gl_fbo = 0;
      device->state_cache->gl_fbo = 0;
  }
}

void GLES2CmdFuncExecuteCmds(GLES2Device* device, GLES2CmdPackage* cmd_package) {
  static uint cmd_indices[(int)GFXCmdType::COUNT] = {0};
  static GLenum gl_attachments[GFX_MAX_ATTACHMENTS] = {0};
  
  memset(cmd_indices, 0, sizeof(cmd_indices));
  
  GLES2StateCache* cache = device->state_cache;
  GLES2GPURenderPass* gpu_render_pass = nullptr;
  bool is_shader_changed = false;
  GLES2GPUPipelineState* gpu_pso = nullptr;
  GLenum gl_primitive = 0;
  GLES2GPUInputAssembler* gpu_ia = nullptr;
  GLES2CmdBeginRenderPass* cmd_begin_render_pass = nullptr;
  GLenum gl_wrap_s;
  GLenum gl_wrap_t;
  GLenum gl_min_filter;
  
  for (uint i = 0; i < cmd_package->cmd_types.size(); ++i) {
    GFXCmdType cmd_type = cmd_package->cmd_types[i];
    uint& cmd_idx = cmd_indices[(int)cmd_type];
    
    switch (cmd_type) {
      case GFXCmdType::BEGIN_RENDER_PASS: {
        GLES2CmdBeginRenderPass* cmd = cmd_package->begin_render_pass_cmds[cmd_idx];
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
                    
                    if (!cmd->gpu_fbo->is_offscreen) {
                      const GFXColor& color = cmd->clear_colors[j];
                      glClearColor(color.r, color.g, color.b, color.a);
                      gl_clears |= GL_COLOR_BUFFER_BIT;
                    }
                  }
                  break;
                }
                case GFXLoadOp::DISCARD: {
                  // invalidate fbo
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR_EXT);
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
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH_EXT);
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
                  gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL_EXT);
                  break;
                }
                default:;
              }
            } // if (has_stencils)
          } // if
          
          if (num_attachments && device->use_discard_framebuffer()) {
            glDiscardFramebufferEXT(GL_FRAMEBUFFER, num_attachments, gl_attachments);
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
        GLES2CmdBeginRenderPass* cmd = cmd_begin_render_pass;
        uint num_attachments = 0;
        for (uint j = 0; j < cmd->num_clear_colors; ++j) {
          const GFXColorAttachment& color_attachment = gpu_render_pass->color_attachments[j];
          if (color_attachment.format != GFXFormat::UNKNOWN) {
            switch (color_attachment.load_op) {
              case GFXLoadOp::LOAD: break; // GL default behaviour
              case GFXLoadOp::CLEAR: break;
              case GFXLoadOp::DISCARD: {
                // invalidate fbo
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR_EXT);
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
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH_EXT);
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
                gl_attachments[num_attachments++] = (cmd->gpu_fbo->is_offscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL_EXT);
                break;
              }
              default:;
            }
          } // if (has_stencils)
        } // if
        
        if (num_attachments && device->use_discard_framebuffer()) {
          glDiscardFramebufferEXT(GL_FRAMEBUFFER, num_attachments, gl_attachments);
        }
        break;
      }
      case GFXCmdType::BIND_STATES: {
        GLES2CmdBindStates* cmd = cmd_package->bind_states_cmds[cmd_idx];
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
          glDepthFunc(GLES2_CMP_FUNCS[(int)gpu_pso->dss.depth_func]);
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
                                GLES2_CMP_FUNCS[(int)gpu_pso->dss.stencil_func_front],
                                gpu_pso->dss.stencil_ref_front,
                                gpu_pso->dss.stencil_read_mask_front);
        }
        if (cache->dss.stencil_fail_op_front != gpu_pso->dss.stencil_fail_op_front ||
            cache->dss.stencil_z_fail_op_front != gpu_pso->dss.stencil_z_fail_op_front ||
            cache->dss.stencil_pass_op_front != gpu_pso->dss.stencil_pass_op_front) {
          glStencilOpSeparate(GL_FRONT,
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_fail_op_front],
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_z_fail_op_front],
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_pass_op_front]);
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
                                GLES2_CMP_FUNCS[(int)gpu_pso->dss.stencil_func_back],
                                gpu_pso->dss.stencil_ref_back,
                                gpu_pso->dss.stencil_read_mask_back);
        }
        if (cache->dss.stencil_fail_op_back != gpu_pso->dss.stencil_fail_op_back ||
            cache->dss.stencil_z_fail_op_back != gpu_pso->dss.stencil_z_fail_op_back ||
            cache->dss.stencil_pass_op_back != gpu_pso->dss.stencil_pass_op_back) {
          glStencilOpSeparate(GL_BACK,
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_fail_op_back],
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_z_fail_op_back],
                              GLES2_STENCIL_OPS[(int)gpu_pso->dss.stencil_pass_op_back]);
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
          glBlendEquationSeparate(GLES2_BLEND_OPS[(int)target.blend_eq],
                                  GLES2_BLEND_OPS[(int)target.blend_alpha_eq]);
          cache_target.blend_eq = target.blend_eq;
          cache_target.blend_alpha_eq = target.blend_alpha_eq;
        }
        if (cache_target.blend_src != target.blend_src ||
            cache_target.blend_dst != target.blend_dst ||
            cache_target.blend_src_alpha != target.blend_src_alpha ||
            cache_target.blend_dst_alpha != target.blend_dst_alpha) {
          glBlendFuncSeparate(GLES2_BLEND_FACTORS[(int)target.blend_src],
                              GLES2_BLEND_FACTORS[(int)target.blend_dst],
                              GLES2_BLEND_FACTORS[(int)target.blend_src_alpha],
                              GLES2_BLEND_FACTORS[(int)target.blend_dst_alpha]);
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
          uint8_t* uniform_buff;

          for(size_t j = 0; j < cmd->gpu_binding_layout->gpu_bindings.size(); ++j) {
            const GLES2GPUBinding& gpu_binding = cmd->gpu_binding_layout->gpu_bindings[j];
            switch (gpu_binding.type) {
              case GFXBindingType::UNIFORM_BUFFER: {
                if (gpu_binding.gpu_buffer) {
                  for (size_t k = 0; k < gpu_pso->gpu_shader->gpu_blocks.size(); ++k) {
                    const GLES2GPUUniformBlock& gpu_block = gpu_pso->gpu_shader->gpu_blocks[k];

                    if (gpu_binding.binding == gpu_block.binding &&
                        gpu_binding.gpu_buffer &&
                        gpu_binding.gpu_buffer->buffer) {
                      for (size_t u = 0; u < gpu_block.active_uniforms.size(); ++u) {
                        const GLES2GPUUniform& gpu_uniform = gpu_block.active_uniforms[u];
                        uniform_buff = (gpu_binding.gpu_buffer->buffer + gpu_uniform.offset);
                        switch (gpu_uniform.gl_type)
                        {
                        case GL_BOOL:
                        case GL_INT: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform1iv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLint*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_BOOL_VEC2:
                        case GL_INT_VEC2: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform2iv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLint*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_BOOL_VEC3:
                        case GL_INT_VEC3: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform3iv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLint*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_BOOL_VEC4:
                        case GL_INT_VEC4: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform4iv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLint*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform1fv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_VEC2: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform2fv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_VEC3: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform3fv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_VEC4: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniform4fv(gpu_uniform.gl_loc, gpu_uniform.count, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_MAT2: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniformMatrix2fv(gpu_uniform.gl_loc, gpu_uniform.count, GL_FALSE, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_MAT3: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniformMatrix3fv(gpu_uniform.gl_loc, gpu_uniform.count, GL_FALSE, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        case GL_FLOAT_MAT4: {
                          if (memcmp(gpu_uniform.buff, uniform_buff, gpu_uniform.size) != 0) {
                            glUniformMatrix4fv(gpu_uniform.gl_loc, gpu_uniform.count, GL_FALSE, (const GLfloat*)uniform_buff);
                            memcpy(gpu_uniform.buff, uniform_buff, gpu_uniform.size);
                          }
                          break;
                        }
                        default:
                          break;
                        }
                      } // for
                      break;
                    }
                  }
                }
                break;
              }
              case GFXBindingType::SAMPLER: {
                if (gpu_binding.gpu_sampler) {
                  for (size_t k = 0; k < gpu_pso->gpu_shader->gpu_samplers.size(); ++k) {
                    const GLES2GPUUniformSampler& gpu_sampler = gpu_pso->gpu_shader->gpu_samplers[k];
                    if (gpu_sampler.binding == gpu_binding.binding) {
                      for (size_t u = 0; u < gpu_sampler.units.size(); ++u) {
                        uint unit = (uint)gpu_sampler.units[u];
                        if (gpu_binding.gpu_tex_view && (gpu_binding.gpu_tex_view->gpu_texture->size > 0)) {
                          GLES2GPUTexture* gpu_texture = gpu_binding.gpu_tex_view->gpu_texture;
                          GLuint gl_texture = gpu_texture->gl_texture;
                          if (cache->gl_textures[unit] != gl_texture) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glBindTexture(gpu_texture->gl_target, gl_texture);
                            cache->gl_textures[unit] = gl_texture;
                          }

                          if (gpu_binding.gpu_tex_view->gpu_texture->is_pot) {
                            gl_wrap_s = gpu_binding.gpu_sampler->gl_wrap_s;
                            gl_wrap_t = gpu_binding.gpu_sampler->gl_wrap_t;

                            if (gpu_binding.gpu_tex_view->gpu_texture->mip_level <= 1 &&
                                !(gpu_binding.gpu_tex_view->gpu_texture->flags & GFXTextureFlagBit::GEN_MIPMAP) &&
                                (gpu_binding.gpu_sampler->gl_min_filter == GL_LINEAR_MIPMAP_NEAREST ||
                                 gpu_binding.gpu_sampler->gl_min_filter == GL_LINEAR_MIPMAP_LINEAR)) {
                              gl_min_filter = GL_LINEAR;
                            } else {
                              gl_min_filter = gpu_binding.gpu_sampler->gl_min_filter;
                            }
                          } else {
                            gl_wrap_s = GL_CLAMP_TO_EDGE;
                            gl_wrap_t = GL_CLAMP_TO_EDGE;

                            if (gpu_binding.gpu_sampler->gl_min_filter == GL_LINEAR || 
                                gpu_binding.gpu_sampler->gl_min_filter == GL_LINEAR_MIPMAP_NEAREST ||
                                gpu_binding.gpu_sampler->gl_min_filter == GL_LINEAR_MIPMAP_LINEAR) {
                              gl_min_filter = GL_LINEAR;
                            } else {
                              gl_min_filter = GL_NEAREST;
                            }
                          }

                          if (gpu_texture->gl_wrap_s != gl_wrap_s) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glTexParameteri(gpu_texture->gl_target, GL_TEXTURE_WRAP_S, gl_wrap_s);
                            gpu_texture->gl_wrap_s = gl_wrap_s;
                          }

                          if (gpu_texture->gl_wrap_t != gl_wrap_t) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glTexParameteri(gpu_texture->gl_target, GL_TEXTURE_WRAP_T, gl_wrap_t);
                            gpu_texture->gl_wrap_t = gl_wrap_t;
                          }

                          if (gpu_texture->gl_min_filter != gl_min_filter) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glTexParameteri(gpu_texture->gl_target, GL_TEXTURE_MIN_FILTER, gl_min_filter);
                            gpu_texture->gl_min_filter = gl_min_filter;
                          }

                          if (gpu_texture->gl_mag_filter != gpu_binding.gpu_sampler->gl_mag_filter) {
                            if (cache->tex_uint != unit) {
                              glActiveTexture(GL_TEXTURE0 + unit);
                              cache->tex_uint = unit;
                            }
                            glTexParameteri(gpu_texture->gl_target, GL_TEXTURE_MAG_FILTER, gpu_binding.gpu_sampler->gl_mag_filter);
                            gpu_texture->gl_mag_filter = gpu_binding.gpu_sampler->gl_mag_filter;
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
                glGenVertexArraysOES(1, &gl_vao);
                gpu_ia->gl_vaos.insert(std::make_pair(gpu_pso->gpu_shader->gl_program, gl_vao));
                glBindVertexArrayOES(gl_vao);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                
                for (size_t j = 0; j < gpu_pso->gpu_shader->gpu_inputs.size(); ++j) {
                  const GLES2GPUInput& gpu_input = gpu_pso->gpu_shader->gpu_inputs[j];
                  for (size_t a = 0; a < gpu_ia->attribs.size(); ++a) {
                    const GLES2GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[a];
                    if (gpu_attrib.name == gpu_input.name) {
                      glBindBuffer(GL_ARRAY_BUFFER, gpu_attrib.gl_buffer);
                      
                      for (uint c = 0; c < gpu_attrib.component_count; ++c) {
                        GLint gl_loc = gpu_input.gl_loc + c;
                        uint attrib_offset = gpu_attrib.offset + gpu_attrib.size * c;
                        glEnableVertexAttribArray(gl_loc);
                        
                        cache->gl_enabled_attrib_locs[gl_loc] = true;
                        glVertexAttribPointer(gl_loc, gpu_attrib.count, gpu_attrib.gl_type, gpu_attrib.is_normalized, gpu_attrib.stride, BUFFER_OFFSET(attrib_offset));

                        if (device->use_instanced_arrays()) {
                          glVertexAttribDivisorEXT(gl_loc, gpu_attrib.is_instanced ? 1 : 0);
                        }
                      }
                      break;
                    }
                  } // for
                } // for
                
                if (gpu_ia->gpu_index_buffer) {
                  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpu_ia->gpu_index_buffer->gl_buffer);
                }
                
                glBindVertexArrayOES(0);
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                cache->gl_vao = 0;
                cache->gl_array_buffer = 0;
                cache->gl_element_array_buffer = 0;
              }
              
              if (cache->gl_vao != gl_vao) {
                glBindVertexArrayOES(gl_vao);
                cache->gl_vao = gl_vao;
              }
            } else {
              for (uint a = 0; a < GFX_MAX_VERTEX_ATTRIBUTES; ++a) {
                cache->gl_current_attrib_locs[a] = false;
              }

              for (size_t j = 0; j < gpu_pso->gpu_shader->gpu_inputs.size(); ++j) {
                const GLES2GPUInput& gpu_input = gpu_pso->gpu_shader->gpu_inputs[j];
                for (size_t a = 0; a < gpu_ia->attribs.size(); ++a) {
                  const GLES2GPUAttribute& gpu_attrib = gpu_ia->gpu_attribs[a];
                  if (gpu_attrib.name == gpu_input.name) {
                    glBindBuffer(GL_ARRAY_BUFFER, gpu_attrib.gl_buffer);

                    for (uint c = 0; c < gpu_attrib.component_count; ++c) {
                      GLint gl_loc = gpu_input.gl_loc + c;
                      uint attrib_offset = gpu_attrib.offset + gpu_attrib.size * c;
                      glEnableVertexAttribArray(gl_loc);
                      cache->gl_enabled_attrib_locs[gl_loc] = true;
                      cache->gl_current_attrib_locs[gl_loc] = true;
                      glVertexAttribPointer(gl_loc, gpu_attrib.count, gpu_attrib.gl_type, gpu_attrib.is_normalized, gpu_attrib.stride, BUFFER_OFFSET(attrib_offset));

                      if (device->use_instanced_arrays()) {
                        glVertexAttribDivisorEXT(gl_loc, gpu_attrib.is_instanced ? 1 : 0);
                      }
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
        GLES2CmdDraw* cmd = cmd_package->draw_cmds[cmd_idx];
        if (gpu_ia && gpu_pso) {
          if (!gpu_ia->gpu_indirect_buffer) {

            if (gpu_ia->gpu_index_buffer && cmd->draw_info.index_count >= 0) {
              uint8_t* offset = 0;
              offset += cmd->draw_info.first_index * gpu_ia->gpu_index_buffer->stride;
              if (cmd->draw_info.instance_count == 0) {
                glDrawElements(gl_primitive, cmd->draw_info.index_count, gpu_ia->gl_index_type, offset);
              } else {
                if (device->use_draw_instanced()) {
                  glDrawElementsInstancedEXT(gl_primitive, cmd->draw_info.index_count, gpu_ia->gl_index_type, offset, cmd->draw_info.instance_count);
                }
              }
            } else {
              if (cmd->draw_info.instance_count == 0) {
                glDrawArrays(gl_primitive, cmd->draw_info.first_index, cmd->draw_info.vertex_count);
              } else {
                if (device->use_draw_instanced()) {
                  glDrawArraysInstancedEXT(gl_primitive, cmd->draw_info.first_index, cmd->draw_info.vertex_count, cmd->draw_info.instance_count);
                }
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
                  if (device->use_draw_instanced()) {
                    glDrawElementsInstancedEXT(gl_primitive, draw.index_count, gpu_ia->gl_index_type, offset, cmd->draw_info.instance_count);
                  }
                }
              } else {
                if (cmd->draw_info.instance_count == 0) {
                  glDrawArrays(gl_primitive, draw.first_index, draw.vertex_count);
                } else {
                  if (device->use_draw_instanced()) {
                    glDrawArraysInstancedEXT(gl_primitive, draw.first_index, draw.vertex_count, cmd->draw_info.instance_count);
                  }
                }
              }
            }
          }
        }
        break;
      }
      case GFXCmdType::UPDATE_BUFFER: {
        GLES2CmdUpdateBuffer* cmd = cmd_package->update_buffer_cmds[cmd_idx];
        GLES2CmdFuncUpdateBuffer(device, cmd->gpu_buffer, cmd->buffer, cmd->offset, cmd->size);
        break;
      }
      case GFXCmdType::COPY_BUFFER_TO_TEXTURE: {
        GLES2CmdCopyBufferToTexture* cmd = cmd_package->copy_buffer_to_texture_cmds[cmd_idx];
        GLES2CmdFuncCopyBuffersToTexture(device, &(cmd->gpu_buffer->buffer), 1, cmd->gpu_texture, cmd->regions);
        break;
      }
      default:
        break;
    }
      cmd_idx++;
  }
}

void GLES2CmdFuncCopyBuffersToTexture(GLES2Device* device, uint8_t** buffers, uint count, GLES2GPUTexture* gpu_texture, const GFXBufferTextureCopyList& regions) {
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
            glTexSubImage3DOES(GL_TEXTURE_2D_ARRAY, m, region.tex_offset.x, region.tex_offset.y, z, 
              w, h, d, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
          }
          else {
            GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, h, 1);
            glCompressedTexSubImage3DOES(GL_TEXTURE_2D_ARRAY, m, region.tex_offset.x, region.tex_offset.y, z,
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
          glTexSubImage3DOES(GL_TEXTURE_3D, m, region.tex_offset.x, region.tex_offset.y, region.tex_offset.z, 
            w, h, d, gpu_texture->gl_format, gpu_texture->gl_type, (GLvoid*)buff);
        }
        else {
          GLsizei memSize = (GLsizei)GFXFormatSize(gpu_texture->format, w, d + 1, 1);
          glCompressedTexSubImage3DOES(GL_TEXTURE_3D, m, region.tex_offset.x, region.tex_offset.y, region.tex_offset.z, 
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
