#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3Context.h"
#include "GLES3Device.h"
#include "GLES3StateCache.h"

#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

constexpr uint USE_VAO = true;

namespace cc {
namespace gfx {

namespace {
GLenum MapGLInternalFormat(Format format) {
    switch (format) {
        case Format::A8: return GL_ALPHA;
        case Format::L8: return GL_LUMINANCE;
        case Format::LA8: return GL_LUMINANCE_ALPHA;
        case Format::R8: return GL_R8;
        case Format::R8SN: return GL_R8_SNORM;
        case Format::R8UI: return GL_R8UI;
        case Format::R8I: return GL_R8I;
        case Format::RG8: return GL_RG8;
        case Format::RG8SN: return GL_RG8_SNORM;
        case Format::RG8UI: return GL_RG8UI;
        case Format::RG8I: return GL_RG8I;
        case Format::RGB8: return GL_RGB8;
        case Format::RGB8SN: return GL_RGB8_SNORM;
        case Format::RGB8UI: return GL_RGB8UI;
        case Format::RGB8I: return GL_RGB8I;
        case Format::RGBA8: return GL_RGBA8;
        case Format::RGBA8SN: return GL_RGBA8_SNORM;
        case Format::RGBA8UI: return GL_RGBA8UI;
        case Format::RGBA8I: return GL_RGBA8I;
        case Format::R16I: return GL_R16I;
        case Format::R16UI: return GL_R16UI;
        case Format::R16F: return GL_R16F;
        case Format::RG16I: return GL_RG16I;
        case Format::RG16UI: return GL_RG16UI;
        case Format::RG16F: return GL_RG16F;
        case Format::RGB16I: return GL_RGB16I;
        case Format::RGB16UI: return GL_RGB16UI;
        case Format::RGB16F: return GL_RGB16F;
        case Format::RGBA16I: return GL_RGBA16I;
        case Format::RGBA16UI: return GL_RGBA16UI;
        case Format::RGBA16F: return GL_RGBA16F;
        case Format::R32I: return GL_R32I;
        case Format::R32UI: return GL_R32UI;
        case Format::R32F: return GL_R32F;
        case Format::RG32I: return GL_RG32I;
        case Format::RG32UI: return GL_RG32UI;
        case Format::RG32F: return GL_RG32F;
        case Format::RGB32I: return GL_RGB32I;
        case Format::RGB32UI: return GL_RGB32UI;
        case Format::RGB32F: return GL_RGB32F;
        case Format::RGBA32I: return GL_RGBA32I;
        case Format::RGBA32UI: return GL_RGBA32UI;
        case Format::RGBA32F: return GL_RGBA32F;
        case Format::R5G6B5: return GL_RGB565;
        case Format::RGB5A1: return GL_RGB5_A1;
        case Format::RGBA4: return GL_RGBA4;
        case Format::RGB10A2: return GL_RGB10_A2;
        case Format::RGB10A2UI: return GL_RGB10_A2UI;
        case Format::R11G11B10F: return GL_R11F_G11F_B10F;
        case Format::D16: return GL_DEPTH_COMPONENT16;
        case Format::D16S8: return GL_DEPTH_STENCIL;
        case Format::D24: return GL_DEPTH_COMPONENT24;
        case Format::D24S8: return GL_DEPTH24_STENCIL8;
        case Format::D32F: return GL_DEPTH_COMPONENT32F;
        case Format::D32F_S8: return GL_DEPTH32F_STENCIL8;

        case Format::BC1: return GL_COMPRESSED_RGB_S3TC_DXT1_EXT;
        case Format::BC1_ALPHA: return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case Format::BC1_SRGB: return GL_COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case Format::BC1_SRGB_ALPHA: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case Format::BC2: return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case Format::BC2_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case Format::BC3: return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case Format::BC3_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case Format::ETC_RGB8: return GL_ETC1_RGB8_OES;
        case Format::ETC2_RGB8: return GL_COMPRESSED_RGB8_ETC2;
        case Format::ETC2_SRGB8: return GL_COMPRESSED_SRGB8_ETC2;
        case Format::ETC2_RGB8_A1: return GL_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
        case Format::ETC2_SRGB8_A1: return GL_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
        case Format::ETC2_RGBA8: return GL_COMPRESSED_RGBA8_ETC2_EAC;
        case Format::ETC2_SRGB8_A8: return GL_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
        case Format::EAC_R11: return GL_COMPRESSED_R11_EAC;
        case Format::EAC_R11SN: return GL_COMPRESSED_SIGNED_R11_EAC;
        case Format::EAC_RG11: return GL_COMPRESSED_RG11_EAC;
        case Format::EAC_RG11SN: return GL_COMPRESSED_SIGNED_RG11_EAC;

        case Format::PVRTC_RGB2: return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGBA2: return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGB4: return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case Format::PVRTC_RGBA4: return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            CCASSERT(false, "Unsupported Format, convert to GL internal format failed.");
            return GL_RGBA;
        }
    }
}

GLenum MapGLFormat(Format format) {
    switch (format) {
        case Format::A8: return GL_ALPHA;
        case Format::L8: return GL_LUMINANCE;
        case Format::LA8: return GL_LUMINANCE_ALPHA;
        case Format::R8:
        case Format::R8SN:
        case Format::R8UI:
        case Format::R8I: return GL_RED;
        case Format::RG8:
        case Format::RG8SN:
        case Format::RG8UI:
        case Format::RG8I: return GL_RG;
        case Format::RGB8:
        case Format::RGB8SN:
        case Format::RGB8UI:
        case Format::RGB8I: return GL_RGB;
        case Format::RGBA8:
        case Format::RGBA8SN:
        case Format::RGBA8UI:
        case Format::RGBA8I: return GL_RGBA;
        case Format::R16UI:
        case Format::R16I:
        case Format::R16F: return GL_RED;
        case Format::RG16UI:
        case Format::RG16I:
        case Format::RG16F: return GL_RG;
        case Format::RGB16UI:
        case Format::RGB16I:
        case Format::RGB16F: return GL_RGB;
        case Format::RGBA16UI:
        case Format::RGBA16I:
        case Format::RGBA16F: return GL_RGBA;
        case Format::R32UI:
        case Format::R32I:
        case Format::R32F: return GL_RED;
        case Format::RG32UI:
        case Format::RG32I:
        case Format::RG32F: return GL_RG;
        case Format::RGB32UI:
        case Format::RGB32I:
        case Format::RGB32F: return GL_RGB;
        case Format::RGBA32UI:
        case Format::RGBA32I:
        case Format::RGBA32F: return GL_RGBA;
        case Format::RGB10A2: return GL_RGBA;
        case Format::R11G11B10F: return GL_RGB;
        case Format::R5G6B5: return GL_RGB;
        case Format::RGB5A1: return GL_RGBA;
        case Format::RGBA4: return GL_RGBA;
        case Format::D16: return GL_DEPTH_COMPONENT;
        case Format::D16S8: return GL_DEPTH_STENCIL;
        case Format::D24: return GL_DEPTH_COMPONENT;
        case Format::D24S8: return GL_DEPTH_STENCIL;
        case Format::D32F: return GL_DEPTH_COMPONENT;
        case Format::D32F_S8: return GL_DEPTH_STENCIL;

        case Format::BC1: return GL_COMPRESSED_RGB_S3TC_DXT1_EXT;
        case Format::BC1_ALPHA: return GL_COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case Format::BC1_SRGB: return GL_COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case Format::BC1_SRGB_ALPHA: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case Format::BC2: return GL_COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case Format::BC2_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case Format::BC3: return GL_COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case Format::BC3_SRGB: return GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case Format::ETC_RGB8: return GL_ETC1_RGB8_OES;

        case Format::PVRTC_RGB2: return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGBA2: return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGB4: return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case Format::PVRTC_RGBA4: return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            CCASSERT(false, "Unsupported Format, convert to WebGL format failed.");
            return GL_RGBA;
        }
    }
}

GLenum MapGLType(Type type) {
    switch (type) {
        case Type::BOOL: return GL_BOOL;
        case Type::BOOL2: return GL_BOOL_VEC2;
        case Type::BOOL3: return GL_BOOL_VEC3;
        case Type::BOOL4: return GL_BOOL_VEC4;
        case Type::INT: return GL_INT;
        case Type::INT2: return GL_INT_VEC2;
        case Type::INT3: return GL_INT_VEC3;
        case Type::INT4: return GL_INT_VEC4;
        case Type::UINT: return GL_UNSIGNED_INT;
        case Type::FLOAT: return GL_FLOAT;
        case Type::FLOAT2: return GL_FLOAT_VEC2;
        case Type::FLOAT3: return GL_FLOAT_VEC3;
        case Type::FLOAT4: return GL_FLOAT_VEC4;
        case Type::MAT2: return GL_FLOAT_MAT2;
        case Type::MAT2X3: return GL_FLOAT_MAT2x3;
        case Type::MAT2X4: return GL_FLOAT_MAT2x4;
        case Type::MAT3X2: return GL_FLOAT_MAT3x2;
        case Type::MAT3: return GL_FLOAT_MAT3;
        case Type::MAT3X4: return GL_FLOAT_MAT3x4;
        case Type::MAT4X2: return GL_FLOAT_MAT4x2;
        case Type::MAT4X3: return GL_FLOAT_MAT4x3;
        case Type::MAT4: return GL_FLOAT_MAT4;
        case Type::SAMPLER2D: return GL_SAMPLER_2D;
        case Type::SAMPLER2D_ARRAY: return GL_SAMPLER_2D_ARRAY;
        case Type::SAMPLER3D: return GL_SAMPLER_3D;
        case Type::SAMPLER_CUBE: return GL_SAMPLER_CUBE;
        default: {
            CCASSERT(false, "Unsupported GLType, convert to GL type failed.");
            return GL_NONE;
        }
    }
}

Type MapType(GLenum glType) {
    switch (glType) {
        case GL_BOOL: return Type::BOOL;
        case GL_BOOL_VEC2: return Type::BOOL2;
        case GL_BOOL_VEC3: return Type::BOOL3;
        case GL_BOOL_VEC4: return Type::BOOL4;
        case GL_INT: return Type::INT;
        case GL_INT_VEC2: return Type::INT2;
        case GL_INT_VEC3: return Type::INT3;
        case GL_INT_VEC4: return Type::INT4;
        case GL_UNSIGNED_INT: return Type::UINT;
        case GL_UNSIGNED_INT_VEC2: return Type::UINT2;
        case GL_UNSIGNED_INT_VEC3: return Type::UINT3;
        case GL_UNSIGNED_INT_VEC4: return Type::UINT4;
        case GL_FLOAT: return Type::FLOAT;
        case GL_FLOAT_VEC2: return Type::FLOAT2;
        case GL_FLOAT_VEC3: return Type::FLOAT3;
        case GL_FLOAT_VEC4: return Type::FLOAT4;
        case GL_FLOAT_MAT2: return Type::MAT2;
        case GL_FLOAT_MAT2x3: return Type::MAT2X3;
        case GL_FLOAT_MAT2x4: return Type::MAT2X4;
        case GL_FLOAT_MAT3x2: return Type::MAT3X2;
        case GL_FLOAT_MAT3: return Type::MAT3;
        case GL_FLOAT_MAT3x4: return Type::MAT3X4;
        case GL_FLOAT_MAT4x2: return Type::MAT4X2;
        case GL_FLOAT_MAT4x3: return Type::MAT4X3;
        case GL_FLOAT_MAT4: return Type::MAT4;
        case GL_SAMPLER_2D: return Type::SAMPLER2D;
        case GL_SAMPLER_2D_ARRAY: return Type::SAMPLER2D_ARRAY;
        case GL_SAMPLER_3D: return Type::SAMPLER3D;
        case GL_SAMPLER_CUBE: return Type::SAMPLER_CUBE;
        default: {
            CCASSERT(false, "Unsupported GLType, convert to Type failed.");
            return Type::UNKNOWN;
        }
    }
}

GLenum FormatToGLType(Format format) {
    switch (format) {
        case Format::R8: return GL_UNSIGNED_BYTE;
        case Format::R8SN: return GL_BYTE;
        case Format::R8UI: return GL_UNSIGNED_BYTE;
        case Format::R8I: return GL_BYTE;
        case Format::R16F: return GL_HALF_FLOAT;
        case Format::R16UI: return GL_UNSIGNED_SHORT;
        case Format::R16I: return GL_SHORT;
        case Format::R32F: return GL_FLOAT;
        case Format::R32UI: return GL_UNSIGNED_INT;
        case Format::R32I: return GL_INT;

        case Format::RG8: return GL_UNSIGNED_BYTE;
        case Format::RG8SN: return GL_BYTE;
        case Format::RG8UI: return GL_UNSIGNED_BYTE;
        case Format::RG8I: return GL_BYTE;
        case Format::RG16F: return GL_HALF_FLOAT;
        case Format::RG16UI: return GL_UNSIGNED_SHORT;
        case Format::RG16I: return GL_SHORT;
        case Format::RG32F: return GL_FLOAT;
        case Format::RG32UI: return GL_UNSIGNED_INT;
        case Format::RG32I: return GL_INT;

        case Format::RGB8: return GL_UNSIGNED_BYTE;
        case Format::SRGB8: return GL_UNSIGNED_BYTE;
        case Format::RGB8SN: return GL_BYTE;
        case Format::RGB8UI: return GL_UNSIGNED_BYTE;
        case Format::RGB8I: return GL_BYTE;
        case Format::RGB16F: return GL_HALF_FLOAT;
        case Format::RGB16UI: return GL_UNSIGNED_SHORT;
        case Format::RGB16I: return GL_SHORT;
        case Format::RGB32F: return GL_FLOAT;
        case Format::RGB32UI: return GL_UNSIGNED_INT;
        case Format::RGB32I: return GL_INT;

        case Format::RGBA8: return GL_UNSIGNED_BYTE;
        case Format::SRGB8_A8: return GL_UNSIGNED_BYTE;
        case Format::RGBA8SN: return GL_BYTE;
        case Format::RGBA8UI: return GL_UNSIGNED_BYTE;
        case Format::RGBA8I: return GL_BYTE;
        case Format::RGBA16F: return GL_HALF_FLOAT;
        case Format::RGBA16UI: return GL_UNSIGNED_SHORT;
        case Format::RGBA16I: return GL_SHORT;
        case Format::RGBA32F: return GL_FLOAT;
        case Format::RGBA32UI: return GL_UNSIGNED_INT;
        case Format::RGBA32I: return GL_INT;

        case Format::R5G6B5: return GL_UNSIGNED_SHORT_5_6_5;
        case Format::R11G11B10F: return GL_UNSIGNED_INT_10F_11F_11F_REV;
        case Format::RGB5A1: return GL_UNSIGNED_SHORT_5_5_5_1;
        case Format::RGBA4: return GL_UNSIGNED_SHORT_4_4_4_4;
        case Format::RGB10A2: return GL_UNSIGNED_INT_2_10_10_10_REV;
        case Format::RGB10A2UI: return GL_UNSIGNED_INT_2_10_10_10_REV;
        case Format::RGB9E5: return GL_FLOAT;

        case Format::D16: return GL_UNSIGNED_SHORT;
        case Format::D16S8: return GL_UNSIGNED_INT_24_8; // no D16S8 support
        case Format::D24: return GL_UNSIGNED_INT;
        case Format::D24S8: return GL_UNSIGNED_INT_24_8;
        case Format::D32F: return GL_FLOAT;
        case Format::D32F_S8: return GL_FLOAT_32_UNSIGNED_INT_24_8_REV;

        case Format::BC1: return GL_UNSIGNED_BYTE;
        case Format::BC1_SRGB: return GL_UNSIGNED_BYTE;
        case Format::BC2: return GL_UNSIGNED_BYTE;
        case Format::BC2_SRGB: return GL_UNSIGNED_BYTE;
        case Format::BC3: return GL_UNSIGNED_BYTE;
        case Format::BC3_SRGB: return GL_UNSIGNED_BYTE;
        case Format::BC4: return GL_UNSIGNED_BYTE;
        case Format::BC4_SNORM: return GL_BYTE;
        case Format::BC5: return GL_UNSIGNED_BYTE;
        case Format::BC5_SNORM: return GL_BYTE;
        case Format::BC6H_SF16: return GL_FLOAT;
        case Format::BC6H_UF16: return GL_FLOAT;
        case Format::BC7: return GL_UNSIGNED_BYTE;
        case Format::BC7_SRGB: return GL_UNSIGNED_BYTE;

        case Format::ETC_RGB8: return GL_UNSIGNED_BYTE;
        case Format::ETC2_RGB8: return GL_UNSIGNED_BYTE;
        case Format::ETC2_SRGB8: return GL_UNSIGNED_BYTE;
        case Format::ETC2_RGB8_A1: return GL_UNSIGNED_BYTE;
        case Format::ETC2_SRGB8_A1: return GL_UNSIGNED_BYTE;
        case Format::EAC_R11: return GL_UNSIGNED_BYTE;
        case Format::EAC_R11SN: return GL_BYTE;
        case Format::EAC_RG11: return GL_UNSIGNED_BYTE;
        case Format::EAC_RG11SN: return GL_BYTE;

        case Format::PVRTC_RGB2: return GL_UNSIGNED_BYTE;
        case Format::PVRTC_RGBA2: return GL_UNSIGNED_BYTE;
        case Format::PVRTC_RGB4: return GL_UNSIGNED_BYTE;
        case Format::PVRTC_RGBA4: return GL_UNSIGNED_BYTE;
        case Format::PVRTC2_2BPP: return GL_UNSIGNED_BYTE;
        case Format::PVRTC2_4BPP: return GL_UNSIGNED_BYTE;

        default: {
            return GL_UNSIGNED_BYTE;
        }
    }
}

uint GLTypeSize(GLenum glType) {
    switch (glType) {
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

uint GLComponentCount(GLenum glType) {
    switch (glType) {
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
} // namespace

void GLES3CmdFuncCreateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer) {
    GLenum glUsage = (gpuBuffer->memUsage & MemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);

    if (gpuBuffer->usage & BufferUsageBit::VERTEX) {
        gpuBuffer->glTarget = GL_ARRAY_BUFFER;
        glGenBuffers(1, &gpuBuffer->glBuffer);
        if (gpuBuffer->size) {
            if (USE_VAO) {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
            }

            if (device->stateCache->glArrayBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_ARRAY_BUFFER, 0);
            device->stateCache->glArrayBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::INDEX) {
        gpuBuffer->glTarget = GL_ELEMENT_ARRAY_BUFFER;
        glGenBuffers(1, &gpuBuffer->glBuffer);
        if (gpuBuffer->size) {
            if (USE_VAO) {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
            }

            if (device->stateCache->glElementArrayBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
            device->stateCache->glElementArrayBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::UNIFORM) {
        gpuBuffer->glTarget = GL_UNIFORM_BUFFER;
        glGenBuffers(1, &gpuBuffer->glBuffer);
        if (gpuBuffer->size) {
            if (device->stateCache->glUniformBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_UNIFORM_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_UNIFORM_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_UNIFORM_BUFFER, 0);
            device->stateCache->glUniformBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::INDIRECT) {
        gpuBuffer->glTarget = GL_NONE;
    } else if ((gpuBuffer->usage & BufferUsageBit::TRANSFER_DST) ||
               (gpuBuffer->usage & BufferUsageBit::TRANSFER_SRC)) {
        gpuBuffer->buffer = (uint8_t *)CC_MALLOC(gpuBuffer->size);
        gpuBuffer->glTarget = GL_NONE;
    } else {
        CCASSERT(false, "Unsupported BufferType, create buffer failed.");
        gpuBuffer->glTarget = GL_NONE;
    }
}

void GLES3CmdFuncDestroyBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer) {
    if (gpuBuffer->glBuffer) {
        if (gpuBuffer->usage & BufferUsageBit::VERTEX) {
            if (device->stateCache->glArrayBuffer == gpuBuffer->glBuffer) {
                glBindBuffer(GL_ARRAY_BUFFER, 0);
                device->stateCache->glArrayBuffer = 0;
            }
        } else if (gpuBuffer->usage & BufferUsageBit::INDEX) {
            if (device->stateCache->glElementArrayBuffer == gpuBuffer->glBuffer) {
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                device->stateCache->glElementArrayBuffer = 0;
            }
        } else if (gpuBuffer->usage & BufferUsageBit::UNIFORM) {
            auto *ubo = device->stateCache->glBindUBOs;
            for (auto i = 0; i < GFX_MAX_BUFFER_BINDINGS; i++) {
                if (ubo[i] == gpuBuffer->glBuffer) {
                    glBindBufferBase(GL_UNIFORM_BUFFER, i, 0);
                    device->stateCache->glUniformBuffer = 0;
                    ubo[i] = 0;
                }
            }
            if (device->stateCache->glUniformBuffer == gpuBuffer->glBuffer) {
                glBindBuffer(GL_UNIFORM_BUFFER, 0);
                device->stateCache->glUniformBuffer = 0;
            }
        }
        glDeleteBuffers(1, &gpuBuffer->glBuffer);
        gpuBuffer->glBuffer = 0;
    }
    CC_SAFE_FREE(gpuBuffer->buffer);
}

void GLES3CmdFuncResizeBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer) {
    GLenum glUsage = (gpuBuffer->memUsage & MemoryUsageBit::HOST ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);

    if (gpuBuffer->usage & BufferUsageBit::VERTEX) {
        gpuBuffer->glTarget = GL_ARRAY_BUFFER;
        if (gpuBuffer->size) {
            if (USE_VAO) {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
            }

            if (device->stateCache->glArrayBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_ARRAY_BUFFER, 0);
            device->stateCache->glArrayBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::INDEX) {
        gpuBuffer->glTarget = GL_ELEMENT_ARRAY_BUFFER;
        if (gpuBuffer->size) {
            if (USE_VAO) {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
            }

            if (device->stateCache->glElementArrayBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
            device->stateCache->glElementArrayBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::UNIFORM) {
        gpuBuffer->glTarget = GL_UNIFORM_BUFFER;
        if (gpuBuffer->size) {
            if (device->stateCache->glUniformBuffer != gpuBuffer->glBuffer) {
                glBindBuffer(GL_UNIFORM_BUFFER, gpuBuffer->glBuffer);
            }

            glBufferData(GL_UNIFORM_BUFFER, gpuBuffer->size, nullptr, glUsage);
            glBindBuffer(GL_UNIFORM_BUFFER, 0);
            device->stateCache->glUniformBuffer = 0;
        }
    } else if (gpuBuffer->usage & BufferUsageBit::INDIRECT) {
        gpuBuffer->indirects.resize(gpuBuffer->count);
        gpuBuffer->glTarget = GL_NONE;
    } else if ((gpuBuffer->usage & BufferUsageBit::TRANSFER_DST) ||
               (gpuBuffer->usage & BufferUsageBit::TRANSFER_SRC)) {
        if (gpuBuffer->buffer) {
            CC_FREE(gpuBuffer->buffer);
        }
        gpuBuffer->buffer = (uint8_t *)CC_MALLOC(gpuBuffer->size);
        gpuBuffer->glTarget = GL_NONE;
    } else {
        CCASSERT(false, "Unsupported BufferType, resize buffer failed.");
        gpuBuffer->glTarget = GL_NONE;
    }
}

void GLES3CmdFuncUpdateBuffer(GLES3Device *device, GLES3GPUBuffer *gpuBuffer, void *buffer, uint offset, uint size) {
    if (gpuBuffer->usage & BufferUsageBit::INDIRECT) {
        memcpy((uint8_t *)gpuBuffer->indirects.data() + offset, buffer, size);
    } else if (gpuBuffer->usage & BufferUsageBit::TRANSFER_SRC) {
        memcpy((uint8_t *)gpuBuffer->buffer + offset, buffer, size);
    } else {
        switch (gpuBuffer->glTarget) {
            case GL_ARRAY_BUFFER: {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
                if (device->stateCache->glArrayBuffer != gpuBuffer->glBuffer) {
                    glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer);
                    device->stateCache->glArrayBuffer = gpuBuffer->glBuffer;
                }
                glBufferSubData(GL_ARRAY_BUFFER, offset, size, buffer);
                break;
            }
            case GL_ELEMENT_ARRAY_BUFFER: {
                if (device->stateCache->glVAO) {
                    glBindVertexArray(0);
                    device->stateCache->glVAO = 0;
                }
                if (device->stateCache->glElementArrayBuffer != gpuBuffer->glBuffer) {
                    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer);
                    device->stateCache->glElementArrayBuffer = gpuBuffer->glBuffer;
                }
                glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, offset, size, buffer);
                break;
            }
            case GL_UNIFORM_BUFFER: {
                if (device->stateCache->glUniformBuffer != gpuBuffer->glBuffer) {
                    glBindBuffer(GL_UNIFORM_BUFFER, gpuBuffer->glBuffer);
                    device->stateCache->glUniformBuffer = gpuBuffer->glBuffer;
                }
                glBufferSubData(GL_UNIFORM_BUFFER, offset, size, buffer);
                break;
            }
            default:
                CCASSERT(false, "Unsupported BufferType, update buffer failed.");
                break;
        }
    }
}

void GLES3CmdFuncCreateTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture) {
    gpuTexture->glInternelFmt = MapGLInternalFormat(gpuTexture->format);
    gpuTexture->glFormat = MapGLFormat(gpuTexture->format);
    gpuTexture->glType = FormatToGLType(gpuTexture->format);

    switch (gpuTexture->type) {
        case TextureType::TEX2D: {
            gpuTexture->glTarget = GL_TEXTURE_2D;
            glGenTextures(1, &gpuTexture->glTexture);
            if (gpuTexture->size > 0) {
                GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
                if (gpuTexture->glTexture != glTexture) {
                    glBindTexture(GL_TEXTURE_2D, gpuTexture->glTexture);
                    glTexture = gpuTexture->glTexture;
                }
                uint w = gpuTexture->width;
                uint h = gpuTexture->height;
                if (!GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed) {
                    for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                        glTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternelFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr);
                        w = std::max(1U, w >> 1);
                        h = std::max(1U, h >> 1);
                    }
                } else {
                    for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                        uint img_size = FormatSize(gpuTexture->format, w, h, 1);
                        glCompressedTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternelFmt, w, h, 0, img_size, nullptr);
                        w = std::max(1U, w >> 1);
                        h = std::max(1U, h >> 1);
                    }
                }
            }
            break;
        }
        case TextureType::CUBE: {
            gpuTexture->glTarget = GL_TEXTURE_CUBE_MAP;
            glGenTextures(1, &gpuTexture->glTexture);
            if (gpuTexture->size > 0) {
                GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
                if (gpuTexture->glTexture != glTexture) {
                    glBindTexture(GL_TEXTURE_CUBE_MAP, gpuTexture->glTexture);
                    glTexture = gpuTexture->glTexture;
                }
                if (!GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed) {
                    for (uint f = 0; f < 6; ++f) {
                        uint w = gpuTexture->width;
                        uint h = gpuTexture->height;
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternelFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr);
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    }
                } else {
                    for (uint f = 0; f < 6; ++f) {
                        uint w = gpuTexture->width;
                        uint h = gpuTexture->height;
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            uint img_size = FormatSize(gpuTexture->format, w, h, 1);
                            glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternelFmt, w, h, 0, img_size, nullptr);
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    }
                }
            }
            break;
        }
        default:
            CCASSERT(false, "Unsupported TextureType, create texture failed.");
            break;
    }
}

void GLES3CmdFuncDestroyTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture) {
    if (gpuTexture->glTexture) {
        GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
        if (glTexture == gpuTexture->glTexture) {
            switch (gpuTexture->type) {
                case TextureType::TEX2D: {
                    glBindTexture(GL_TEXTURE_2D, 0);
                    break;
                }
                case TextureType::CUBE: {
                    glBindTexture(GL_TEXTURE_CUBE_MAP, 0);
                    break;
                }
            }
            glTexture = 0;
        }
        glDeleteTextures(1, &gpuTexture->glTexture);
        gpuTexture->glTexture = 0;
    }
}

void GLES3CmdFuncResizeTexture(GLES3Device *device, GLES3GPUTexture *gpuTexture) {
    gpuTexture->glInternelFmt = MapGLInternalFormat(gpuTexture->format);
    gpuTexture->glFormat = MapGLFormat(gpuTexture->format);
    gpuTexture->glType = FormatToGLType(gpuTexture->format);

    switch (gpuTexture->type) {
        case TextureType::TEX2D: {
            gpuTexture->glTarget = GL_TEXTURE_2D;
            if (gpuTexture->size > 0) {
                GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
                if (gpuTexture->glTexture != glTexture) {
                    glBindTexture(GL_TEXTURE_2D, gpuTexture->glTexture);
                    glTexture = gpuTexture->glTexture;
                }
                uint w = gpuTexture->width;
                uint h = gpuTexture->height;
                if (!GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed) {
                    for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                        glTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternelFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr);
                        w = std::max(1U, w >> 1);
                        h = std::max(1U, h >> 1);
                    }
                } else {
                    for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                        uint img_size = FormatSize(gpuTexture->format, w, h, 1);
                        glCompressedTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternelFmt, w, h, 0, img_size, nullptr);
                        w = std::max(1U, w >> 1);
                        h = std::max(1U, h >> 1);
                    }
                }
            }
            break;
        }
        case TextureType::CUBE: {
            gpuTexture->glTarget = GL_TEXTURE_CUBE_MAP;
            if (gpuTexture->size > 0) {
                GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
                if (gpuTexture->glTexture != glTexture) {
                    glBindTexture(GL_TEXTURE_CUBE_MAP, gpuTexture->glTexture);
                    glTexture = gpuTexture->glTexture;
                }
                if (!GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed) {
                    for (uint f = 0; f < 6; ++f) {
                        uint w = gpuTexture->width;
                        uint h = gpuTexture->height;
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternelFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr);
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    }
                } else {
                    for (uint f = 0; f < 6; ++f) {
                        uint w = gpuTexture->width;
                        uint h = gpuTexture->height;
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            uint img_size = FormatSize(gpuTexture->format, w, h, 1);
                            glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternelFmt, w, h, 0, img_size, nullptr);
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    }
                }
            }
            break;
        }
        default:
            CCASSERT(false, "Unsupported TextureType, resize texture failed.");
            break;
    }
}

void GLES3CmdFuncCreateSampler(GLES3Device *device, GLES3GPUSampler *gpuSampler) {
    glGenSamplers(1, &gpuSampler->gl_sampler);
    if (gpuSampler->minFilter == Filter::LINEAR || gpuSampler->minFilter == Filter::ANISOTROPIC) {
        if (gpuSampler->mipFilter == Filter::LINEAR || gpuSampler->mipFilter == Filter::ANISOTROPIC) {
            gpuSampler->glMinFilter = GL_LINEAR_MIPMAP_LINEAR;
        } else if (gpuSampler->mipFilter == Filter::POINT) {
            gpuSampler->glMinFilter = GL_LINEAR_MIPMAP_NEAREST;
        } else {
            gpuSampler->glMinFilter = GL_LINEAR;
        }
    } else {
        if (gpuSampler->mipFilter == Filter::LINEAR || gpuSampler->mipFilter == Filter::ANISOTROPIC) {
            gpuSampler->glMinFilter = GL_NEAREST_MIPMAP_LINEAR;
        } else if (gpuSampler->mipFilter == Filter::POINT) {
            gpuSampler->glMinFilter = GL_NEAREST_MIPMAP_NEAREST;
        } else {
            gpuSampler->glMinFilter = GL_NEAREST;
        }
    }

    if (gpuSampler->magFilter == Filter::LINEAR || gpuSampler->magFilter == Filter::ANISOTROPIC) {
        gpuSampler->glMagFilter = GL_LINEAR;
    } else {
        gpuSampler->glMagFilter = GL_NEAREST;
    }

    gpuSampler->glWrapS = GLES3_WRAPS[(int)gpuSampler->addressU];
    gpuSampler->glWrapT = GLES3_WRAPS[(int)gpuSampler->addressV];
    gpuSampler->glWrapR = GLES3_WRAPS[(int)gpuSampler->addressW];
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_MIN_FILTER, gpuSampler->glMinFilter);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_MAG_FILTER, gpuSampler->glMagFilter);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_WRAP_S, gpuSampler->glWrapS);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_WRAP_T, gpuSampler->glWrapT);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_WRAP_R, gpuSampler->glWrapR);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_MIN_LOD, gpuSampler->minLOD);
    glSamplerParameteri(gpuSampler->gl_sampler, GL_TEXTURE_MAX_LOD, gpuSampler->maxLOD);
}

void GLES3CmdFuncDestroySampler(GLES3Device *device, GLES3GPUSampler *gpuSampler) {
    if (gpuSampler->gl_sampler) {
        uint unit = device->stateCache->texUint;
        GLuint &glSampler = device->stateCache->glSamplers[unit];
        if (glSampler == gpuSampler->gl_sampler) {
            glBindSampler(unit, 0);
            glSampler = 0;
        }
        glDeleteSamplers(1, &gpuSampler->gl_sampler);
        gpuSampler->gl_sampler = 0;
    }
}

void GLES3CmdFuncCreateShader(GLES3Device *device, GLES3GPUShader *gpuShader) {
    GLenum gl_shader_type = 0;
    String shader_type_str;
    GLint status;

    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES3GPUShaderStage &gpu_stage = gpuShader->gpuStages[i];

        switch (gpu_stage.type) {
            case ShaderType::VERTEX: {
                gl_shader_type = GL_VERTEX_SHADER;
                shader_type_str = "Vertex Shader";
                break;
            }
            case ShaderType::FRAGMENT: {
                gl_shader_type = GL_FRAGMENT_SHADER;
                shader_type_str = "Fragment Shader";
                break;
            }
            default: {
                CCASSERT(false, "Unsupported ShaderType");
                return;
            }
        }

        gpu_stage.glShader = glCreateShader(gl_shader_type);
        String shaderSource = "#version 300 es\n" + gpu_stage.source;
        const char *source = shaderSource.c_str();
        glShaderSource(gpu_stage.glShader, 1, (const GLchar **)&source, nullptr);
        glCompileShader(gpu_stage.glShader);

        glGetShaderiv(gpu_stage.glShader, GL_COMPILE_STATUS, &status);
        if (status != 1) {
            GLint log_size = 0;
            glGetShaderiv(gpu_stage.glShader, GL_INFO_LOG_LENGTH, &log_size);

            ++log_size;
            GLchar *logs = (GLchar *)CC_MALLOC(log_size);
            glGetShaderInfoLog(gpu_stage.glShader, log_size, nullptr, logs);

            CC_LOG_ERROR("%s in %s compilation failed.", shader_type_str.c_str(), gpuShader->name.c_str());
            CC_LOG_ERROR("Shader source: %s", gpu_stage.source.c_str());
            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            glDeleteShader(gpu_stage.glShader);
            gpu_stage.glShader = 0;
            return;
        }
    }

    gpuShader->glProgram = glCreateProgram();

    // link program
    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES3GPUShaderStage &gpu_stage = gpuShader->gpuStages[i];
        glAttachShader(gpuShader->glProgram, gpu_stage.glShader);
    }

    glLinkProgram(gpuShader->glProgram);

    // detach & delete immediately
    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES3GPUShaderStage &gpu_stage = gpuShader->gpuStages[i];
        if (gpu_stage.glShader) {
            glDetachShader(gpuShader->glProgram, gpu_stage.glShader);
            glDeleteShader(gpu_stage.glShader);
            gpu_stage.glShader = 0;
        }
    }

    glGetProgramiv(gpuShader->glProgram, GL_LINK_STATUS, &status);
    if (status != 1) {
        CC_LOG_ERROR("Failed to link Shader [%s].", gpuShader->name.c_str());
        GLint log_size = 0;
        glGetProgramiv(gpuShader->glProgram, GL_INFO_LOG_LENGTH, &log_size);
        if (log_size) {
            ++log_size;
            GLchar *logs = (GLchar *)CC_MALLOC(log_size);
            glGetProgramInfoLog(gpuShader->glProgram, log_size, nullptr, logs);

            CC_LOG_ERROR("Failed to link shader '%s'.", gpuShader->name.c_str());
            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            return;
        }
    }

    CC_LOG_INFO("Shader '%s' compilation succeeded.", gpuShader->name.c_str());

    GLint attr_max_length = 0;
    GLint attr_count = 0;
    glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &attr_max_length);
    glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_ATTRIBUTES, &attr_count);

    GLchar gl_name[256];
    GLsizei gl_length;
    GLsizei gl_size;
    GLenum glType;

    gpuShader->glInputs.resize(attr_count);
    for (GLint i = 0; i < attr_count; ++i) {
        GLES3GPUInput &gpuInput = gpuShader->glInputs[i];

        memset(gl_name, 0, sizeof(gl_name));
        glGetActiveAttrib(gpuShader->glProgram, i, attr_max_length, &gl_length, &gl_size, &glType, gl_name);
        char *offset = strchr(gl_name, '[');
        if (offset) {
            gl_name[offset - gl_name] = '\0';
        }

        gpuInput.glLoc = glGetAttribLocation(gpuShader->glProgram, gl_name);
        gpuInput.binding = gpuInput.glLoc;
        gpuInput.name = gl_name;
        gpuInput.type = MapType(glType);
        gpuInput.stride = GLTypeSize(glType);
        gpuInput.count = gl_size;
        gpuInput.size = gpuInput.stride * gpuInput.count;
        gpuInput.glType = glType;
    }

    // create uniform blocks
    GLint block_count;
    glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_UNIFORM_BLOCKS, &block_count);
    if (block_count) {
        GLint gl_block_size = 0;
        GLint gl_block_uniforms = 0;
        uint32_t block_idx = 0;

        gpuShader->glBlocks.resize(block_count);
        for (GLint i = 0; i < block_count; ++i) {
            GLES3GPUUniformBlock &gpuBlock = gpuShader->glBlocks[i];
            memset(gl_name, 0, sizeof(gl_name));
            glGetActiveUniformBlockName(gpuShader->glProgram, i, 255, &gl_length, gl_name);

            char *offset = strchr(gl_name, '[');
            if (offset) {
                gl_name[offset - gl_name] = '\0';
            }

            gpuBlock.name = gl_name;
            gpuBlock.binding = GFX_INVALID_BINDING;
            for (size_t b = 0; b < gpuShader->blocks.size(); ++b) {
                UniformBlock &block = gpuShader->blocks[b];
                if (block.name == gpuBlock.name) {
                    gpuBlock.binding = block.binding;
                    break;
                }
            }

            if (gpuBlock.binding != GFX_INVALID_BINDING) {
                block_idx = i;

                glUniformBlockBinding(gpuShader->glProgram, block_idx, gpuBlock.binding);

                glGetActiveUniformBlockiv(gpuShader->glProgram, i, GL_UNIFORM_BLOCK_DATA_SIZE, &gl_block_size);
                glGetActiveUniformBlockiv(gpuShader->glProgram, i, GL_UNIFORM_BLOCK_ACTIVE_UNIFORMS, &gl_block_uniforms);
                glUniformBlockBinding(gpuShader->glProgram, block_idx, gpuBlock.binding);

                gpuBlock.size = gl_block_size;
                gpuBlock.glUniforms.resize(gl_block_uniforms);

                vector<GLint> u_indices(gl_block_uniforms);
                glGetActiveUniformBlockiv(gpuShader->glProgram, i, GL_UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES, &u_indices[0]);
                // vector<GLint> u_sizes(gl_block_uniforms);
                // glGetActiveUniformsiv(gpuShader->glProgram, gl_block_uniforms, (const GLuint*)u_indices.data(), GL_UNIFORM_SIZE, &u_sizes[0]);
                vector<GLint> u_offsets(gl_block_uniforms);
                glGetActiveUniformsiv(gpuShader->glProgram, gl_block_uniforms, (const GLuint *)u_indices.data(), GL_UNIFORM_OFFSET, &u_offsets[0]);

                for (GLint u = 0; u < gl_block_uniforms; ++u) {
                    GLES3GPUUniform &uniform = gpuBlock.glUniforms[u];

                    GLint idx = u_indices[u];
                    memset(gl_name, 0, sizeof(gl_name));
                    glGetActiveUniform(gpuShader->glProgram, idx, 255, &gl_length, &gl_size, &glType, gl_name);
                    offset = strchr(gl_name, '[');
                    if (offset) {
                        gl_name[offset - gl_name] = '\0';
                    }

                    uniform.binding = GFX_INVALID_BINDING;
                    uniform.name = gl_name;
                    uniform.type = MapType(glType);
                    uniform.stride = GFX_TYPE_SIZES[(int)uniform.type];
                    uniform.count = gl_size;
                    uniform.size = uniform.stride * uniform.count;
                    uniform.offset = u_offsets[u];
                    uniform.glType = glType;
                    uniform.glLoc = -1;
                }
            } // if
        }
    } // if

    // create uniform samplers
    if (gpuShader->samplers.size()) {
        gpuShader->glSamplers.resize(gpuShader->samplers.size());

        for (size_t i = 0; i < gpuShader->glSamplers.size(); ++i) {
            UniformSampler &sampler = gpuShader->samplers[i];
            GLES3GPUUniformSampler &gpuSampler = gpuShader->glSamplers[i];
            gpuSampler.binding = sampler.binding;
            gpuSampler.name = sampler.name;
            gpuSampler.type = sampler.type;
            gpuSampler.glType = MapGLType(gpuSampler.type);
            gpuSampler.glLoc = -1;
        }
    }

    // parse glUniforms
    GLint glActiveUniforms;
    glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_UNIFORMS, &glActiveUniforms);

    GLint unit_idx = 0;

    GLES3GPUUniformSamplerList active_gpu_samplers;

    for (GLint i = 0; i < glActiveUniforms; ++i) {
        memset(gl_name, 0, sizeof(gl_name));
        glGetActiveUniform(gpuShader->glProgram, i, 255, &gl_length, &gl_size, &glType, gl_name);
        char *u_offset = strchr(gl_name, '[');
        if (u_offset) {
            gl_name[u_offset - gl_name] = '\0';
        }

        bool is_sampler = (glType == GL_SAMPLER_2D) ||
                          (glType == GL_SAMPLER_3D) ||
                          (glType == GL_SAMPLER_CUBE) ||
                          (glType == GL_SAMPLER_CUBE_SHADOW) ||
                          (glType == GL_SAMPLER_2D_ARRAY) ||
                          (glType == GL_SAMPLER_2D_ARRAY_SHADOW);
        if (is_sampler) {
            String u_name = gl_name;
            for (size_t s = 0; s < gpuShader->glSamplers.size(); ++s) {
                GLES3GPUUniformSampler &gpuSampler = gpuShader->glSamplers[s];
                if (gpuSampler.name == u_name) {
                    gpuSampler.units.resize(gl_size);
                    for (GLsizei u = 0; u < gl_size; ++u) {
                        gpuSampler.units[u] = unit_idx + u;
                    }

                    gpuSampler.glLoc = glGetUniformLocation(gpuShader->glProgram, gl_name);
                    unit_idx += gl_size;

                    active_gpu_samplers.push_back(gpuSampler);
                    break;
                }
            }
        } // if
    }     // for

    if (active_gpu_samplers.size()) {
        if (device->stateCache->glProgram != gpuShader->glProgram) {
            glUseProgram(gpuShader->glProgram);
            device->stateCache->glProgram = gpuShader->glProgram;
        }

        for (size_t i = 0; i < active_gpu_samplers.size(); ++i) {
            GLES3GPUUniformSampler &gpuSampler = active_gpu_samplers[i];
            glUniform1iv(gpuSampler.glLoc, (GLsizei)gpuSampler.units.size(), gpuSampler.units.data());
        }
    }
}

void GLES3CmdFuncDestroyShader(GLES3Device *device, GLES3GPUShader *gpuShader) {
    if (gpuShader->glProgram) {
        if (device->stateCache->glProgram == gpuShader->glProgram) {
            glUseProgram(0);
            device->stateCache->glProgram = 0;
        }
        glDeleteProgram(gpuShader->glProgram);
        gpuShader->glProgram = 0;
    }
}

void GLES3CmdFuncCreateInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler) {

    if (gpuInputAssembler->gpuIndexBuffer) {
        switch (gpuInputAssembler->gpuIndexBuffer->stride) {
            case 1: gpuInputAssembler->glIndexType = GL_UNSIGNED_BYTE; break;
            case 2: gpuInputAssembler->glIndexType = GL_UNSIGNED_SHORT; break;
            case 4: gpuInputAssembler->glIndexType = GL_UNSIGNED_INT; break;
            default: {
                CC_LOG_ERROR("Illegal index buffer stride.");
            }
        }
    }

    uint stream_offsets[GFX_MAX_VERTEX_ATTRIBUTES] = {0};

    gpuInputAssembler->glAttribs.resize(gpuInputAssembler->attributes.size());
    for (size_t i = 0; i < gpuInputAssembler->glAttribs.size(); ++i) {
        GLES3GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[i];
        const Attribute &attrib = gpuInputAssembler->attributes[i];

        GLES3GPUBuffer *gpu_vb = (GLES3GPUBuffer *)gpuInputAssembler->gpuVertexBuffers[attrib.stream];

        gpuAttribute.name = attrib.name;
        gpuAttribute.glType = FormatToGLType(attrib.format);
        gpuAttribute.size = GFX_FORMAT_INFOS[(int)attrib.format].size;
        gpuAttribute.count = GFX_FORMAT_INFOS[(int)attrib.format].count;
        gpuAttribute.componentCount = GLComponentCount(gpuAttribute.glType);
        gpuAttribute.isNormalized = attrib.isNormalized;
        gpuAttribute.isInstanced = attrib.isInstanced;
        gpuAttribute.offset = stream_offsets[attrib.stream];

        if (gpu_vb) {
            gpuAttribute.glBuffer = gpu_vb->glBuffer;
            gpuAttribute.stride = gpu_vb->stride;
        }
        stream_offsets[attrib.stream] += gpuAttribute.size;
    }
}

void GLES3CmdFuncDestroyInputAssembler(GLES3Device *device, GLES3GPUInputAssembler *gpuInputAssembler) {
    for (auto it = gpuInputAssembler->glVAOs.begin(); it != gpuInputAssembler->glVAOs.end(); ++it) {
        if (device->stateCache->glVAO == it->second) {
            glBindVertexArray(0);
            device->stateCache->glVAO = 0;
        }
        glDeleteVertexArrays(1, &it->second);
    }
    gpuInputAssembler->glVAOs.clear();
}

void GLES3CmdFuncCreateFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO) {
    uint colorViewCount = gpuFBO->gpuColorTextures.size();
    uint swapchainImageIndices = 0;
    for (size_t i = 0; i < colorViewCount; ++i) {
        if (!gpuFBO->gpuColorTextures[i]) {
            swapchainImageIndices |= (1 << i);
        }
    }
    bool hasDepth = gpuFBO->gpuRenderPass->depthStencilAttachment.format == device->getDepthStencilFormat();
    if (hasDepth && !gpuFBO->gpuDepthStencilTexture) {
        swapchainImageIndices |= (1 << colorViewCount);
    }
    gpuFBO->isOffscreen = !swapchainImageIndices;

    if (gpuFBO->isOffscreen) {
        glGenFramebuffers(1, &gpuFBO->glFramebuffer);
        if (device->stateCache->glFramebuffer != gpuFBO->glFramebuffer) {
            glBindFramebuffer(GL_FRAMEBUFFER, gpuFBO->glFramebuffer);
            device->stateCache->glFramebuffer = gpuFBO->glFramebuffer;
        }

        GLenum attachments[GFX_MAX_ATTACHMENTS] = {0};
        uint attachment_count = 0;

        size_t colorMipmapLevelCount = gpuFBO->colorMipmapLevels.size();
        for (size_t i = 0; i < gpuFBO->gpuColorTextures.size(); ++i) {
            GLES3GPUTexture *gpuColorTexture = gpuFBO->gpuColorTextures[i];
            if (gpuColorTexture) {
                GLint mipmapLevel = 0;
                if (i < colorMipmapLevelCount) {
                    mipmapLevel = gpuFBO->colorMipmapLevels[i];
                }
                glFramebufferTexture2D(GL_FRAMEBUFFER, (GLenum)(GL_COLOR_ATTACHMENT0 + i), gpuColorTexture->glTarget, gpuColorTexture->glTexture, mipmapLevel);

                attachments[attachment_count++] = (GLenum)(GL_COLOR_ATTACHMENT0 + i);
            }
        }

        if (gpuFBO->gpuDepthStencilTexture) {
            GLES3GPUTexture *gpuDepthStencilTexture = gpuFBO->gpuDepthStencilTexture;
            const GLenum gl_attachment = GFX_FORMAT_INFOS[(int)gpuDepthStencilTexture->format].hasStencil ? GL_DEPTH_STENCIL_ATTACHMENT : GL_DEPTH_ATTACHMENT;
            glFramebufferTexture2D(GL_FRAMEBUFFER, gl_attachment, gpuDepthStencilTexture->glTarget, gpuDepthStencilTexture->glTexture, gpuFBO->depthStencilMipmapLevel);
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
    } else {
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
        gpuFBO->glFramebuffer = static_cast<GLES3Context *>(device->getContext())->getDefaultFramebuffer();
#endif
    }
}

void GLES3CmdFuncDestroyFramebuffer(GLES3Device *device, GLES3GPUFramebuffer *gpuFBO) {
    if (gpuFBO->isOffscreen) {
        if (gpuFBO->glFramebuffer) {
            if (device->stateCache->glFramebuffer == gpuFBO->glFramebuffer) {
                glBindFramebuffer(GL_FRAMEBUFFER, 0);
                device->stateCache->glFramebuffer = 0;
            }
            glDeleteFramebuffers(1, &gpuFBO->glFramebuffer);
            gpuFBO->glFramebuffer = 0;
        }
    }
}

void GLES3CmdFuncExecuteCmds(GLES3Device *device, GLES3CmdPackage *cmdPackage) {
    static uint cmdIndices[(int)GFXCmdType::COUNT] = {0};
    static GLenum glAttachments[GFX_MAX_ATTACHMENTS] = {0};

    memset(cmdIndices, 0, sizeof(cmdIndices));

    GLES3StateCache *cache = device->stateCache;
    GLES3GPURenderPass *gpuRenderPass = nullptr;
    bool isShaderChanged = false;
    GLES3GPUPipelineState *gpuPipelineState = nullptr;
    GLenum glPrimitive = 0;
    GLES3GPUInputAssembler *gpuInputAssembler = nullptr;
    GLES3CmdBeginRenderPass *cmdBeginRenderPass = nullptr;
    bool reverseCW = false;

    for (uint i = 0; i < cmdPackage->cmds.size(); ++i) {
        GFXCmdType cmdType = cmdPackage->cmds[i];
        uint &cmdIdx = cmdIndices[(int)cmdType];

        switch (cmdType) {
            case GFXCmdType::BEGIN_RENDER_PASS: {
                GLES3CmdBeginRenderPass *cmd = cmdPackage->beginRenderPassCmds[cmdIdx];
                cmdBeginRenderPass = cmd;
                if (cmd->gpuFBO && cmd->gpuRenderPass) {
                    if (cache->glFramebuffer != cmd->gpuFBO->glFramebuffer) {
                        glBindFramebuffer(GL_FRAMEBUFFER, cmd->gpuFBO->glFramebuffer);
                        cache->glFramebuffer = cmd->gpuFBO->glFramebuffer;
                        // render targets are drawn with flipped-Y
                        reverseCW = !!cmd->gpuFBO->glFramebuffer;
                    }

                    if (cache->viewport.left != cmd->renderArea.x ||
                        cache->viewport.top != cmd->renderArea.y ||
                        cache->viewport.width != cmd->renderArea.width ||
                        cache->viewport.height != cmd->renderArea.height) {
                        glViewport(cmd->renderArea.x, cmd->renderArea.y, cmd->renderArea.width, cmd->renderArea.height);
                        cache->viewport.left = cmd->renderArea.x;
                        cache->viewport.top = cmd->renderArea.y;
                        cache->viewport.width = cmd->renderArea.width;
                        cache->viewport.height = cmd->renderArea.height;
                    }

                    if (cache->scissor.x != cmd->renderArea.x ||
                        cache->scissor.y != cmd->renderArea.y ||
                        cache->scissor.width != cmd->renderArea.width ||
                        cache->scissor.height != cmd->renderArea.height) {
                        glScissor(cmd->renderArea.x, cmd->renderArea.y, cmd->renderArea.width, cmd->renderArea.height);
                        cache->scissor.x = cmd->renderArea.x;
                        cache->scissor.y = cmd->renderArea.y;
                        cache->scissor.width = cmd->renderArea.width;
                        cache->scissor.height = cmd->renderArea.height;
                    }

                    GLbitfield gl_clears = 0;
                    uint num_attachments = 0;

                    gpuRenderPass = cmd->gpuRenderPass;
                    for (uint j = 0; j < cmd->numClearColors; ++j) {
                        const ColorAttachment &colorAttachment = gpuRenderPass->colorAttachments[j];
                        if (colorAttachment.format != Format::UNKNOWN) {
                            switch (colorAttachment.loadOp) {
                                case LoadOp::LOAD: break; // GL default behaviour
                                case LoadOp::CLEAR: {
                                    if (cache->bs.targets[0].blendColorMask != ColorMask::ALL) {
                                        glColorMask(true, true, true, true);
                                    }

                                    if (cmd->gpuFBO->isOffscreen) {
                                        static float f_colors[4];
                                        f_colors[0] = cmd->clearColors[j].r;
                                        f_colors[1] = cmd->clearColors[j].g;
                                        f_colors[2] = cmd->clearColors[j].b;
                                        f_colors[3] = cmd->clearColors[j].a;
                                        glClearBufferfv(GL_COLOR, j, f_colors);
                                    } else {
                                        const Color &color = cmd->clearColors[j];
                                        glClearColor(color.r, color.g, color.b, color.a);
                                        gl_clears |= GL_COLOR_BUFFER_BIT;
                                    }
                                    break;
                                }
                                case LoadOp::DISCARD: {
                                    // invalidate fbo
                                    glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR);
                                    break;
                                }
                                default:;
                            }
                        }
                    } // for

                    if (gpuRenderPass->depthStencilAttachment.format != Format::UNKNOWN) {
                        bool hasDepth = GFX_FORMAT_INFOS[(int)gpuRenderPass->depthStencilAttachment.format].hasDepth;
                        if (hasDepth) {
                            switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                                case LoadOp::LOAD: break; // GL default behaviour
                                case LoadOp::CLEAR: {
                                    glDepthMask(true);
                                    cache->dss.depthWrite = true;
                                    glClearDepthf(cmd->clearDepth);
                                    gl_clears |= GL_DEPTH_BUFFER_BIT;
                                    break;
                                }
                                case LoadOp::DISCARD: {
                                    // invalidate fbo
                                    glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH);
                                    break;
                                }
                                default:;
                            }
                        } // if (hasDepth)
                        bool has_stencils = GFX_FORMAT_INFOS[(int)gpuRenderPass->depthStencilAttachment.format].hasStencil;
                        if (has_stencils) {
                            switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                                case LoadOp::LOAD: break; // GL default behaviour
                                case LoadOp::CLEAR: {
                                    if (!cache->dss.stencilWriteMaskFront) {
                                        glStencilMaskSeparate(GL_FRONT, 0xffffffff);
                                    }
                                    if (!cache->dss.stencilWriteMaskBack) {
                                        glStencilMaskSeparate(GL_BACK, 0xffffffff);
                                    }
                                    glClearStencil(cmd->clearStencil);
                                    gl_clears |= GL_STENCIL_BUFFER_BIT;
                                    break;
                                }
                                case LoadOp::DISCARD: {
                                    // invalidate fbo
                                    glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL);
                                    break;
                                }
                                default:;
                            }
                        } // if (has_stencils)
                    }     // if

                    if (num_attachments) {
                        glInvalidateFramebuffer(GL_FRAMEBUFFER, num_attachments, glAttachments);
                    }

                    if (gl_clears) {
                        glClear(gl_clears);
                    }

                    // restore states
                    if (gl_clears & GL_COLOR_BUFFER_BIT) {
                        ColorMask color_mask = cache->bs.targets[0].blendColorMask;
                        if (color_mask != ColorMask::ALL) {
                            glColorMask((GLboolean)(color_mask & ColorMask::R),
                                        (GLboolean)(color_mask & ColorMask::G),
                                        (GLboolean)(color_mask & ColorMask::B),
                                        (GLboolean)(color_mask & ColorMask::A));
                        }
                    }

                    if ((gl_clears & GL_COLOR_BUFFER_BIT) && !cache->dss.depthWrite) {
                        glDepthMask(false);
                    }

                    if (gl_clears & GL_STENCIL_BUFFER_BIT) {
                        if (!cache->dss.stencilWriteMaskFront) {
                            glStencilMaskSeparate(GL_FRONT, 0);
                        }
                        if (!cache->dss.stencilWriteMaskBack) {
                            glStencilMaskSeparate(GL_BACK, 0);
                        }
                    }
                }
                break;
            }
            case GFXCmdType::END_RENDER_PASS: {
                GLES3CmdBeginRenderPass *cmd = cmdBeginRenderPass;
                uint num_attachments = 0;
                for (uint j = 0; j < cmd->numClearColors; ++j) {
                    const ColorAttachment &colorAttachment = gpuRenderPass->colorAttachments[j];
                    if (colorAttachment.format != Format::UNKNOWN) {
                        switch (colorAttachment.loadOp) {
                            case LoadOp::LOAD: break; // GL default behaviour
                            case LoadOp::CLEAR: break;
                            case LoadOp::DISCARD: {
                                // invalidate fbo
                                glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_COLOR_ATTACHMENT0 + j : GL_COLOR);
                                break;
                            }
                            default:;
                        }
                    }
                } // for

                if (gpuRenderPass->depthStencilAttachment.format != Format::UNKNOWN) {
                    bool hasDepth = GFX_FORMAT_INFOS[(int)gpuRenderPass->depthStencilAttachment.format].hasDepth;
                    if (hasDepth) {
                        switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                            case LoadOp::LOAD: break; // GL default behaviour
                            case LoadOp::CLEAR: break;
                            case LoadOp::DISCARD: {
                                // invalidate fbo
                                glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_DEPTH_ATTACHMENT : GL_DEPTH);
                                break;
                            }
                            default:;
                        }
                    } // if (hasDepth)
                    bool has_stencils = GFX_FORMAT_INFOS[(int)gpuRenderPass->depthStencilAttachment.format].hasStencil;
                    if (has_stencils) {
                        switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                            case LoadOp::LOAD: break; // GL default behaviour
                            case LoadOp::CLEAR: break;
                            case LoadOp::DISCARD: {
                                // invalidate fbo
                                glAttachments[num_attachments++] = (cmd->gpuFBO->isOffscreen ? GL_STENCIL_ATTACHMENT : GL_STENCIL);
                                break;
                            }
                            default:;
                        }
                    } // if (has_stencils)
                }     // if

                if (num_attachments) {
                    glInvalidateFramebuffer(GL_FRAMEBUFFER, num_attachments, glAttachments);
                }
                break;
            }
            case GFXCmdType::BIND_STATES: {
                GLES3CmdBindStates *cmd = cmdPackage->bindStatesCmds[cmdIdx];
                isShaderChanged = false;

                if (cmd->gpuPipelineState) {
                    gpuPipelineState = cmd->gpuPipelineState;
                    glPrimitive = gpuPipelineState->glPrimitive;

                    if (gpuPipelineState->gpuShader) {
                        if (cache->glProgram != gpuPipelineState->gpuShader->glProgram) {
                            glUseProgram(gpuPipelineState->gpuShader->glProgram);
                            cache->glProgram = gpuPipelineState->gpuShader->glProgram;
                            isShaderChanged = true;
                        }
                    }

                    // bind rasterizer state
                    if (cache->rs.cullMode != gpuPipelineState->rs.cullMode) {
                        switch (gpuPipelineState->rs.cullMode) {
                            case CullMode::NONE: {
                                if (cache->isCullFaceEnabled) {
                                    glDisable(GL_CULL_FACE);
                                    cache->isCullFaceEnabled = false;
                                }
                            } break;
                            case CullMode::FRONT: {
                                if (!cache->isCullFaceEnabled) {
                                    glEnable(GL_CULL_FACE);
                                    cache->isCullFaceEnabled = true;
                                }
                                glCullFace(GL_FRONT);
                            } break;
                            case CullMode::BACK: {
                                if (!cache->isCullFaceEnabled) {
                                    glEnable(GL_CULL_FACE);
                                    cache->isCullFaceEnabled = true;
                                }
                                glCullFace(GL_BACK);
                            } break;
                            default:
                                break;
                        }
                        cache->rs.cullMode = gpuPipelineState->rs.cullMode;
                    }
                }
                bool isFrontFaceCCW = gpuPipelineState->rs.isFrontFaceCCW;
                if (reverseCW) isFrontFaceCCW = !isFrontFaceCCW;
                if (cache->rs.isFrontFaceCCW != isFrontFaceCCW) {
                    glFrontFace(isFrontFaceCCW ? GL_CCW : GL_CW);
                    cache->rs.isFrontFaceCCW = isFrontFaceCCW;
                }
                if ((cache->rs.depthBias != gpuPipelineState->rs.depthBias) ||
                    (cache->rs.depthBiasSlop != gpuPipelineState->rs.depthBiasSlop)) {
                    glPolygonOffset(cache->rs.depthBias, cache->rs.depthBiasSlop);
                    cache->rs.depthBiasSlop = gpuPipelineState->rs.depthBiasSlop;
                }
                if (cache->rs.lineWidth != gpuPipelineState->rs.lineWidth) {
                    glLineWidth(gpuPipelineState->rs.lineWidth);
                    cache->rs.lineWidth = gpuPipelineState->rs.lineWidth;
                }

                // bind depth-stencil state
                if (cache->dss.depthTest != gpuPipelineState->dss.depthTest) {
                    if (gpuPipelineState->dss.depthTest) {
                        glEnable(GL_DEPTH_TEST);
                    } else {
                        glDisable(GL_DEPTH_TEST);
                    }
                    cache->dss.depthTest = gpuPipelineState->dss.depthTest;
                }
                if (cache->dss.depthWrite != gpuPipelineState->dss.depthWrite) {
                    glDepthMask(gpuPipelineState->dss.depthWrite);
                    cache->dss.depthWrite = gpuPipelineState->dss.depthWrite;
                }
                if (cache->dss.depthFunc != gpuPipelineState->dss.depthFunc) {
                    glDepthFunc(GLES3_CMP_FUNCS[(int)gpuPipelineState->dss.depthFunc]);
                    cache->dss.depthFunc = gpuPipelineState->dss.depthFunc;
                }

                // bind depth-stencil state - front
                if (gpuPipelineState->dss.stencilTestFront || gpuPipelineState->dss.stencilTestBack) {
                    if (!cache->isStencilTestEnabled) {
                        glEnable(GL_STENCIL_TEST);
                        cache->isStencilTestEnabled = true;
                    }
                } else {
                    if (cache->isStencilTestEnabled) {
                        glDisable(GL_STENCIL_TEST);
                        cache->isStencilTestEnabled = false;
                    }
                }
                if (cache->dss.stencilFuncFront != gpuPipelineState->dss.stencilFuncFront ||
                    cache->dss.stencilRefFront != gpuPipelineState->dss.stencilRefFront ||
                    cache->dss.stencilReadMaskFront != gpuPipelineState->dss.stencilReadMaskFront) {
                    glStencilFuncSeparate(GL_FRONT,
                                          GLES3_CMP_FUNCS[(int)gpuPipelineState->dss.stencilFuncFront],
                                          gpuPipelineState->dss.stencilRefFront,
                                          gpuPipelineState->dss.stencilReadMaskFront);
                    cache->dss.stencilFuncFront = gpuPipelineState->dss.stencilFuncFront;
                    cache->dss.stencilRefFront = gpuPipelineState->dss.stencilRefFront;
                    cache->dss.stencilReadMaskFront = gpuPipelineState->dss.stencilReadMaskFront;
                }
                if (cache->dss.stencilFailOpFront != gpuPipelineState->dss.stencilFailOpFront ||
                    cache->dss.stencilZFailOpFront != gpuPipelineState->dss.stencilZFailOpFront ||
                    cache->dss.stencilPassOpFront != gpuPipelineState->dss.stencilPassOpFront) {
                    glStencilOpSeparate(GL_FRONT,
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilFailOpFront],
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilZFailOpFront],
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilPassOpFront]);
                    cache->dss.stencilFailOpFront = gpuPipelineState->dss.stencilFailOpFront;
                    cache->dss.stencilZFailOpFront = gpuPipelineState->dss.stencilZFailOpFront;
                    cache->dss.stencilPassOpFront = gpuPipelineState->dss.stencilPassOpFront;
                }
                if (cache->dss.stencilWriteMaskFront != gpuPipelineState->dss.stencilWriteMaskFront) {
                    glStencilMaskSeparate(GL_FRONT, gpuPipelineState->dss.stencilWriteMaskFront);
                    cache->dss.stencilWriteMaskFront = gpuPipelineState->dss.stencilWriteMaskFront;
                }

                // bind depth-stencil state - back
                if (cache->dss.stencilFuncBack != gpuPipelineState->dss.stencilFuncBack ||
                    cache->dss.stencilRefBack != gpuPipelineState->dss.stencilRefBack ||
                    cache->dss.stencilReadMaskBack != gpuPipelineState->dss.stencilReadMaskBack) {
                    glStencilFuncSeparate(GL_BACK,
                                          GLES3_CMP_FUNCS[(int)gpuPipelineState->dss.stencilFuncBack],
                                          gpuPipelineState->dss.stencilRefBack,
                                          gpuPipelineState->dss.stencilReadMaskBack);
                    cache->dss.stencilFuncBack = gpuPipelineState->dss.stencilFuncBack;
                    cache->dss.stencilRefBack = gpuPipelineState->dss.stencilRefBack;
                    cache->dss.stencilReadMaskBack = gpuPipelineState->dss.stencilReadMaskBack;
                }
                if (cache->dss.stencilFailOpBack != gpuPipelineState->dss.stencilFailOpBack ||
                    cache->dss.stencilZFailOpBack != gpuPipelineState->dss.stencilZFailOpBack ||
                    cache->dss.stencilPassOpBack != gpuPipelineState->dss.stencilPassOpBack) {
                    glStencilOpSeparate(GL_BACK,
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilFailOpBack],
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilZFailOpBack],
                                        GLES3_STENCIL_OPS[(int)gpuPipelineState->dss.stencilPassOpBack]);
                    cache->dss.stencilFailOpBack = gpuPipelineState->dss.stencilFailOpBack;
                    cache->dss.stencilZFailOpBack = gpuPipelineState->dss.stencilZFailOpBack;
                    cache->dss.stencilPassOpBack = gpuPipelineState->dss.stencilPassOpBack;
                }
                if (cache->dss.stencilWriteMaskBack != gpuPipelineState->dss.stencilWriteMaskBack) {
                    glStencilMaskSeparate(GL_BACK, gpuPipelineState->dss.stencilWriteMaskBack);
                    cache->dss.stencilWriteMaskBack = gpuPipelineState->dss.stencilWriteMaskBack;
                }

                // bind blend state
                if (cache->bs.isA2C != gpuPipelineState->bs.isA2C) {
                    if (cache->bs.isA2C) {
                        glEnable(GL_SAMPLE_ALPHA_TO_COVERAGE);
                    } else {
                        glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE);
                    }
                    cache->bs.isA2C = gpuPipelineState->bs.isA2C;
                }
                if (cache->bs.blendColor.r != gpuPipelineState->bs.blendColor.r ||
                    cache->bs.blendColor.g != gpuPipelineState->bs.blendColor.g ||
                    cache->bs.blendColor.b != gpuPipelineState->bs.blendColor.b ||
                    cache->bs.blendColor.a != gpuPipelineState->bs.blendColor.a) {

                    glBlendColor(gpuPipelineState->bs.blendColor.r,
                                 gpuPipelineState->bs.blendColor.g,
                                 gpuPipelineState->bs.blendColor.b,
                                 gpuPipelineState->bs.blendColor.a);
                    cache->bs.blendColor = gpuPipelineState->bs.blendColor;
                }

                BlendTarget &cache_target = cache->bs.targets[0];
                const BlendTarget &target = gpuPipelineState->bs.targets[0];
                if (cache_target.blend != target.blend) {
                    if (!cache_target.blend) {
                        glEnable(GL_BLEND);
                    } else {
                        glDisable(GL_BLEND);
                    }
                    cache_target.blend = target.blend;
                }
                if (cache_target.blendEq != target.blendEq ||
                    cache_target.blendAlphaEq != target.blendAlphaEq) {
                    glBlendEquationSeparate(GLES3_BLEND_OPS[(int)target.blendEq],
                                            GLES3_BLEND_OPS[(int)target.blendAlphaEq]);
                    cache_target.blendEq = target.blendEq;
                    cache_target.blendAlphaEq = target.blendAlphaEq;
                }
                if (cache_target.blendSrc != target.blendSrc ||
                    cache_target.blendDst != target.blendDst ||
                    cache_target.blendSrcAlpha != target.blendSrcAlpha ||
                    cache_target.blendDstAlpha != target.blendDstAlpha) {
                    glBlendFuncSeparate(GLES3_BLEND_FACTORS[(int)target.blendSrc],
                                        GLES3_BLEND_FACTORS[(int)target.blendDst],
                                        GLES3_BLEND_FACTORS[(int)target.blendSrcAlpha],
                                        GLES3_BLEND_FACTORS[(int)target.blendDstAlpha]);
                    cache_target.blendSrc = target.blendSrc;
                    cache_target.blendDst = target.blendDst;
                    cache_target.blendSrcAlpha = target.blendSrcAlpha;
                    cache_target.blendDstAlpha = target.blendDstAlpha;
                }
                if (cache_target.blendColorMask != target.blendColorMask) {
                    glColorMask((GLboolean)(target.blendColorMask & ColorMask::R),
                                (GLboolean)(target.blendColorMask & ColorMask::G),
                                (GLboolean)(target.blendColorMask & ColorMask::B),
                                (GLboolean)(target.blendColorMask & ColorMask::A));
                    cache_target.blendColorMask = target.blendColorMask;
                }

                // bind shader resources
                if (cmd->gpuBindingLayout && gpuPipelineState->gpuShader) {
                    for (size_t j = 0; j < cmd->gpuBindingLayout->gpuBindings.size(); ++j) {
                        const GLES3GPUBinding &gpuBinding = cmd->gpuBindingLayout->gpuBindings[j];
                        switch (gpuBinding.type) {
                            case BindingType::UNIFORM_BUFFER: {
                                if (gpuBinding.gpuBuffer) {
                                    for (size_t k = 0; k < gpuPipelineState->gpuShader->glBlocks.size(); ++k) {
                                        const GLES3GPUUniformBlock &gpuBlock = gpuPipelineState->gpuShader->glBlocks[k];
                                        if ((gpuBlock.binding == gpuBinding.binding) && cache->glBindUBOs[gpuBlock.binding] != gpuBinding.gpuBuffer->glBuffer) {
                                            glBindBufferBase(GL_UNIFORM_BUFFER, gpuBlock.binding, gpuBinding.gpuBuffer->glBuffer);
                                            cache->glBindUBOs[gpuBlock.binding] = gpuBinding.gpuBuffer->glBuffer;
                                            cache->glUniformBuffer = gpuBinding.gpuBuffer->glBuffer;
                                        }
                                    }
                                }
                                break;
                            }
                            case BindingType::SAMPLER: {
                                if (gpuBinding.gpuSampler) {
                                    for (size_t k = 0; k < gpuPipelineState->gpuShader->glSamplers.size(); ++k) {
                                        const GLES3GPUUniformSampler &gpuSampler = gpuPipelineState->gpuShader->glSamplers[k];
                                        if (gpuSampler.binding == gpuBinding.binding) {
                                            for (size_t u = 0; u < gpuSampler.units.size(); ++u) {
                                                uint unit = (uint)gpuSampler.units[u];

                                                if (gpuBinding.gpuTexture && (gpuBinding.gpuTexture->size > 0)) {
                                                    GLuint glTexture = gpuBinding.gpuTexture->glTexture;
                                                    if (cache->glTextures[unit] != glTexture) {
                                                        if (cache->texUint != unit) {
                                                            glActiveTexture(GL_TEXTURE0 + unit);
                                                            cache->texUint = unit;
                                                        }
                                                        glBindTexture(gpuBinding.gpuTexture->glTarget, glTexture);
                                                        cache->glTextures[unit] = glTexture;
                                                    }

                                                    if (cache->glSamplers[unit] != gpuBinding.gpuSampler->gl_sampler) {
                                                        glBindSampler(unit, gpuBinding.gpuSampler->gl_sampler);
                                                        cache->glSamplers[unit] = gpuBinding.gpuSampler->gl_sampler;
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
                if (cmd->gpuInputAssembler && gpuPipelineState->gpuShader &&
                    (isShaderChanged || gpuInputAssembler != cmd->gpuInputAssembler)) {
                    gpuInputAssembler = cmd->gpuInputAssembler;
                    if (USE_VAO) {
                        GLuint glVAO = gpuInputAssembler->glVAOs[gpuPipelineState->gpuShader->glProgram];
                        if (!glVAO) {
                            glGenVertexArrays(1, &glVAO);
                            gpuInputAssembler->glVAOs[gpuPipelineState->gpuShader->glProgram] = glVAO;
                            glBindVertexArray(glVAO);
                            glBindBuffer(GL_ARRAY_BUFFER, 0);
                            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);

                            for (size_t j = 0; j < gpuPipelineState->gpuShader->glInputs.size(); ++j) {
                                const GLES3GPUInput &gpuInput = gpuPipelineState->gpuShader->glInputs[j];
                                for (size_t a = 0; a < gpuInputAssembler->attributes.size(); ++a) {
                                    const GLES3GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[a];
                                    if (gpuAttribute.name == gpuInput.name) {
                                        glBindBuffer(GL_ARRAY_BUFFER, gpuAttribute.glBuffer);

                                        for (uint c = 0; c < gpuAttribute.componentCount; ++c) {
                                            GLint glLoc = gpuInput.glLoc + c;
                                            uint attrib_offset = gpuAttribute.offset + gpuAttribute.size * c;
                                            glEnableVertexAttribArray(glLoc);

                                            cache->glEnabledAttribLocs[glLoc] = true;
                                            glVertexAttribPointer(glLoc, gpuAttribute.count, gpuAttribute.glType, gpuAttribute.isNormalized, gpuAttribute.stride, BUFFER_OFFSET(attrib_offset));
                                            glVertexAttribDivisor(glLoc, gpuAttribute.isInstanced ? 1 : 0);
                                        }
                                        break;
                                    }
                                } // for
                            }     // for

                            if (gpuInputAssembler->gpuIndexBuffer) {
                                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuInputAssembler->gpuIndexBuffer->glBuffer);
                            }

                            glBindVertexArray(0);
                            glBindBuffer(GL_ARRAY_BUFFER, 0);
                            glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
                            cache->glVAO = 0;
                            cache->glArrayBuffer = 0;
                            cache->glElementArrayBuffer = 0;
                        }

                        if (cache->glVAO != glVAO) {
                            glBindVertexArray(glVAO);
                            cache->glVAO = glVAO;
                        }
                    } else {
                        for (uint a = 0; a < GFX_MAX_VERTEX_ATTRIBUTES; ++a) {
                            cache->glCurrentAttribLocs[a] = false;
                        }

                        for (size_t j = 0; j < gpuPipelineState->gpuShader->glInputs.size(); ++j) {
                            const GLES3GPUInput &gpuInput = gpuPipelineState->gpuShader->glInputs[j];
                            for (size_t a = 0; a < gpuInputAssembler->attributes.size(); ++a) {
                                const GLES3GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[a];
                                if (gpuAttribute.name == gpuInput.name) {
                                    if (cache->glArrayBuffer != gpuAttribute.glBuffer) {
                                        glBindBuffer(GL_ARRAY_BUFFER, gpuAttribute.glBuffer);
                                        cache->glArrayBuffer = gpuAttribute.glBuffer;
                                    }

                                    for (uint c = 0; c < gpuAttribute.componentCount; ++c) {
                                        GLint glLoc = gpuInput.glLoc + c;
                                        uint attrib_offset = gpuAttribute.offset + gpuAttribute.size * c;
                                        glEnableVertexAttribArray(glLoc);
                                        cache->glCurrentAttribLocs[glLoc] = true;
                                        cache->glEnabledAttribLocs[glLoc] = true;
                                        glVertexAttribPointer(glLoc, gpuAttribute.count, gpuAttribute.glType, gpuAttribute.isNormalized, gpuAttribute.stride, BUFFER_OFFSET(attrib_offset));
                                        glVertexAttribDivisor(glLoc, gpuAttribute.isInstanced ? 1 : 0);
                                    }
                                    break;
                                }
                            } // for
                        }     // for

                        if (gpuInputAssembler->gpuIndexBuffer) {
                            if (cache->glElementArrayBuffer != gpuInputAssembler->gpuIndexBuffer->glBuffer) {
                                glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuInputAssembler->gpuIndexBuffer->glBuffer);
                                cache->glElementArrayBuffer = gpuInputAssembler->gpuIndexBuffer->glBuffer;
                            }
                        }

                        for (uint a = 0; a < GFX_MAX_VERTEX_ATTRIBUTES; ++a) {
                            if (cache->glEnabledAttribLocs[a] != cache->glCurrentAttribLocs[a]) {
                                glDisableVertexAttribArray(a);
                                cache->glEnabledAttribLocs[a] = false;
                            }
                        }
                    } // if
                }

                if (gpuPipelineState) {
                    for (DynamicStateFlagBit dynamicState : gpuPipelineState->dynamicStates) {
                        switch (dynamicState) {
                            case DynamicStateFlagBit::VIEWPORT:
                                if (cache->viewport != cmd->viewport) {
                                    glViewport(cmd->viewport.left, cmd->viewport.top, cmd->viewport.width, cmd->viewport.height);
                                    cache->viewport = cmd->viewport;
                                }
                                break;
                            case DynamicStateFlagBit::SCISSOR:
                                if (cache->scissor != cmd->scissor) {
                                    glScissor(cmd->scissor.x, cmd->scissor.y, cmd->scissor.width, cmd->scissor.height);
                                    cache->scissor = cmd->scissor;
                                }
                                break;
                            case DynamicStateFlagBit::LINE_WIDTH:
                                if (cache->rs.lineWidth != cmd->lineWidth) {
                                    glLineWidth(cmd->lineWidth);
                                    cache->rs.lineWidth = cmd->lineWidth;
                                }
                                break;
                            case DynamicStateFlagBit::DEPTH_BIAS:
                                if (cache->rs.depthBiasEnabled != cmd->depthBiasEnabled) {
                                    if (cmd->depthBiasEnabled)
                                        glEnable(GL_POLYGON_OFFSET_FILL);
                                    else
                                        glDisable(GL_POLYGON_OFFSET_FILL);

                                    cache->rs.depthBiasEnabled = cmd->depthBiasEnabled;
                                }
                                if ((cache->rs.depthBias != cmd->depthBias.constant) ||
                                    (cache->rs.depthBiasSlop != cmd->depthBias.slope)) {
                                    glPolygonOffset(cmd->depthBias.constant, cmd->depthBias.slope);
                                    cache->rs.depthBias = cmd->depthBias.constant;
                                    cache->rs.depthBiasSlop = cmd->depthBias.slope;
                                }
                                break;
                            case DynamicStateFlagBit::BLEND_CONSTANTS:
                                if ((cache->bs.blendColor.r != gpuPipelineState->bs.blendColor.r) ||
                                    (cache->bs.blendColor.g != gpuPipelineState->bs.blendColor.g) ||
                                    (cache->bs.blendColor.b != gpuPipelineState->bs.blendColor.b) ||
                                    (cache->bs.blendColor.a != gpuPipelineState->bs.blendColor.a)) {
                                    glBlendColor(gpuPipelineState->bs.blendColor.r,
                                                 gpuPipelineState->bs.blendColor.g,
                                                 gpuPipelineState->bs.blendColor.b,
                                                 gpuPipelineState->bs.blendColor.a);
                                    cache->bs.blendColor = gpuPipelineState->bs.blendColor;
                                }
                                break;
                            case DynamicStateFlagBit::STENCIL_WRITE_MASK:
                                switch (cmd->stencilWriteMask.face) {
                                    case StencilFace::FRONT:
                                        if (cache->dss.stencilWriteMaskFront != cmd->stencilWriteMask.write_mask) {
                                            glStencilMaskSeparate(GL_FRONT, cmd->stencilWriteMask.write_mask);
                                            cache->dss.stencilWriteMaskFront = cmd->stencilWriteMask.write_mask;
                                        }
                                        break;
                                    case StencilFace::BACK:
                                        if (cache->dss.stencilWriteMaskBack != cmd->stencilWriteMask.write_mask) {
                                            glStencilMaskSeparate(GL_BACK, cmd->stencilWriteMask.write_mask);
                                            cache->dss.stencilWriteMaskBack = cmd->stencilWriteMask.write_mask;
                                        }
                                        break;
                                    case StencilFace::ALL:
                                        if ((cache->dss.stencilWriteMaskFront != cmd->stencilWriteMask.write_mask) ||
                                            (cache->dss.stencilWriteMaskBack != cmd->stencilWriteMask.write_mask)) {
                                            glStencilMask(cmd->stencilWriteMask.write_mask);
                                            cache->dss.stencilWriteMaskFront = cmd->stencilWriteMask.write_mask;
                                            cache->dss.stencilWriteMaskBack = cmd->stencilWriteMask.write_mask;
                                        }
                                        break;
                                }
                                break;
                            case DynamicStateFlagBit::STENCIL_COMPARE_MASK:
                                switch (cmd->stencilCompareMask.face) {
                                    case StencilFace::FRONT:
                                        if ((cache->dss.stencilRefFront != (uint)cmd->stencilCompareMask.refrence) ||
                                            (cache->dss.stencilReadMaskFront != cmd->stencilCompareMask.compareMask)) {
                                            glStencilFuncSeparate(GL_FRONT,
                                                                  GLES3_CMP_FUNCS[(int)cache->dss.stencilFuncFront],
                                                                  cmd->stencilCompareMask.refrence,
                                                                  cmd->stencilCompareMask.compareMask);
                                            cache->dss.stencilRefFront = cmd->stencilCompareMask.refrence;
                                            cache->dss.stencilReadMaskFront = cmd->stencilCompareMask.compareMask;
                                        }
                                        break;
                                    case StencilFace::BACK:
                                        if ((cache->dss.stencilRefBack != (uint)cmd->stencilCompareMask.refrence) ||
                                            (cache->dss.stencilReadMaskBack != cmd->stencilCompareMask.compareMask)) {
                                            glStencilFuncSeparate(GL_BACK,
                                                                  GLES3_CMP_FUNCS[(int)cache->dss.stencilFuncBack],
                                                                  cmd->stencilCompareMask.refrence,
                                                                  cmd->stencilCompareMask.compareMask);
                                            cache->dss.stencilRefBack = cmd->stencilCompareMask.refrence;
                                            cache->dss.stencilReadMaskBack = cmd->stencilCompareMask.compareMask;
                                        }
                                        break;
                                    case StencilFace::ALL:
                                        if ((cache->dss.stencilRefFront != (uint)cmd->stencilCompareMask.refrence) ||
                                            (cache->dss.stencilReadMaskFront != cmd->stencilCompareMask.compareMask) ||
                                            (cache->dss.stencilRefBack != (uint)cmd->stencilCompareMask.refrence) ||
                                            (cache->dss.stencilReadMaskBack != cmd->stencilCompareMask.compareMask)) {
                                            glStencilFuncSeparate(GL_FRONT,
                                                                  GLES3_CMP_FUNCS[(int)cache->dss.stencilFuncFront],
                                                                  cmd->stencilCompareMask.refrence,
                                                                  cmd->stencilCompareMask.compareMask);
                                            glStencilFuncSeparate(GL_BACK,
                                                                  GLES3_CMP_FUNCS[(int)cache->dss.stencilFuncBack],
                                                                  cmd->stencilCompareMask.refrence,
                                                                  cmd->stencilCompareMask.compareMask);
                                            cache->dss.stencilRefFront = cmd->stencilCompareMask.refrence;
                                            cache->dss.stencilReadMaskFront = cmd->stencilCompareMask.compareMask;
                                            cache->dss.stencilRefBack = cmd->stencilCompareMask.refrence;
                                            cache->dss.stencilReadMaskBack = cmd->stencilCompareMask.compareMask;
                                        }
                                        break;
                                }
                                break;
                            default:
                                CC_LOG_ERROR("Invalid dynamic states.");
                                break;
                        } // switch dynamicState
                    }     // for each dynamicState
                }         // if gpuPipelineState
                break;
            } // case BIND_STATES
            case GFXCmdType::DRAW: {
                GLES3CmdDraw *cmd = cmdPackage->drawCmds[cmdIdx];
                if (gpuInputAssembler && gpuPipelineState) {
                    if (!gpuInputAssembler->gpuIndirectBuffer) {
                        if (gpuInputAssembler->gpuIndexBuffer && cmd->drawInfo.indexCount >= 0) {
                            uint8_t *offset = 0;
                            offset += cmd->drawInfo.firstIndex * gpuInputAssembler->gpuIndexBuffer->stride;
                            if (cmd->drawInfo.instanceCount == 0) {
                                glDrawElements(glPrimitive, cmd->drawInfo.indexCount, gpuInputAssembler->glIndexType, offset);
                            } else {
                                glDrawElementsInstanced(glPrimitive, cmd->drawInfo.indexCount, gpuInputAssembler->glIndexType, offset, cmd->drawInfo.instanceCount);
                            }
                        } else {
                            if (cmd->drawInfo.instanceCount == 0) {
                                glDrawArrays(glPrimitive, cmd->drawInfo.firstIndex, cmd->drawInfo.vertexCount);
                            } else {
                                glDrawArraysInstanced(glPrimitive, cmd->drawInfo.firstIndex, cmd->drawInfo.vertexCount, cmd->drawInfo.instanceCount);
                            }
                        }
                    } else {
                        for (size_t j = 0; j < gpuInputAssembler->gpuIndirectBuffer->indirects.size(); ++j) {
                            const DrawInfo &draw = gpuInputAssembler->gpuIndirectBuffer->indirects[j];
                            if (gpuInputAssembler->gpuIndexBuffer && draw.indexCount >= 0) {
                                uint8_t *offset = 0;
                                offset += draw.firstIndex * gpuInputAssembler->gpuIndexBuffer->stride;
                                if (draw.instanceCount == 0) {
                                    glDrawElements(glPrimitive, draw.indexCount, gpuInputAssembler->glIndexType, offset);
                                } else {
                                    glDrawElementsInstanced(glPrimitive, draw.indexCount, gpuInputAssembler->glIndexType, offset, draw.instanceCount);
                                }
                            } else {
                                if (draw.instanceCount == 0) {
                                    glDrawArrays(glPrimitive, draw.firstIndex, draw.vertexCount);
                                } else {
                                    glDrawArraysInstanced(glPrimitive, draw.firstIndex, draw.vertexCount, draw.instanceCount);
                                }
                            }
                        }
                    }
                }
                break;
            }
            case GFXCmdType::UPDATE_BUFFER: {
                GLES3CmdUpdateBuffer *cmd = cmdPackage->updateBufferCmds[cmdIdx];
                GLES3CmdFuncUpdateBuffer(device, cmd->gpuBuffer, cmd->buffer, cmd->offset, cmd->size);
                break;
            }
            case GFXCmdType::COPY_BUFFER_TO_TEXTURE: {
                GLES3CmdCopyBufferToTexture *cmd = cmdPackage->copyBufferToTextureCmds[cmdIdx];
                GLES3CmdFuncCopyBuffersToTexture(device, cmd->buffers, cmd->gpuTexture, cmd->regions);
                break;
            }
            default:
                break;
        }
        cmdIdx++;
    }
}

void GLES3CmdFuncCopyBuffersToTexture(GLES3Device *device, const BufferDataList &buffers, GLES3GPUTexture *gpuTexture, const BufferTextureCopyList &regions) {
    GLuint &glTexture = device->stateCache->glTextures[device->stateCache->texUint];
    if (glTexture != gpuTexture->glTexture) {
        glBindTexture(gpuTexture->glTarget, gpuTexture->glTexture);
        glTexture = gpuTexture->glTexture;
    }

    bool isCompressed = GFX_FORMAT_INFOS[(int)gpuTexture->format].isCompressed;
    uint n = 0;

    switch (gpuTexture->glTarget) {
        case GL_TEXTURE_2D: {
            uint w;
            uint h;
            for (size_t i = 0; i < regions.size(); ++i) {
                const BufferTextureCopy &region = regions[i];
                w = region.texExtent.width;
                h = region.texExtent.height;
                const uint8_t *buff = buffers[n++];
                if (isCompressed) {
                    GLsizei memSize = (GLsizei)FormatSize(gpuTexture->format, w, h, 1);
                    glCompressedTexSubImage2D(GL_TEXTURE_2D,
                                              region.texSubres.mipLevel,
                                              region.texOffset.x,
                                              region.texOffset.y,
                                              w, h,
                                              gpuTexture->glFormat,
                                              memSize,
                                              (GLvoid *)buff);
                } else {
                    glTexSubImage2D(GL_TEXTURE_2D,
                                    region.texSubres.mipLevel,
                                    region.texOffset.x,
                                    region.texOffset.y,
                                    w, h,
                                    gpuTexture->glFormat,
                                    gpuTexture->glType,
                                    (GLvoid *)buff);
                }
            }
            break;
        }
        case GL_TEXTURE_2D_ARRAY: {
            uint w;
            uint h;
            for (size_t i = 0; i < regions.size(); ++i) {
                const BufferTextureCopy &region = regions[i];
                uint d = region.texSubres.layerCount;
                uint layerCount = d + region.texSubres.baseArrayLayer;

                for (uint z = region.texSubres.baseArrayLayer; z < layerCount; ++z) {
                    w = region.texExtent.width;
                    h = region.texExtent.height;
                    const uint8_t *buff = buffers[n++];
                    if (isCompressed) {
                        GLsizei memSize = (GLsizei)FormatSize(gpuTexture->format, w, h, 1);
                        glCompressedTexSubImage3D(GL_TEXTURE_2D_ARRAY,
                                                  region.texSubres.mipLevel,
                                                  region.texOffset.x,
                                                  region.texOffset.y,
                                                  z,
                                                  w, h, d,
                                                  gpuTexture->glFormat,
                                                  memSize,
                                                  (GLvoid *)buff);
                    } else {
                        glTexSubImage3D(GL_TEXTURE_2D_ARRAY,
                                        region.texSubres.mipLevel,
                                        region.texOffset.x,
                                        region.texOffset.y,
                                        z,
                                        w, h, d,
                                        gpuTexture->glFormat,
                                        gpuTexture->glType,
                                        (GLvoid *)buff);
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
                const BufferTextureCopy &region = regions[i];
                w = region.texExtent.width;
                h = region.texExtent.height;
                d = region.texExtent.depth;
                const uint8_t *buff = buffers[n++];
                if (isCompressed) {
                    GLsizei memSize = (GLsizei)FormatSize(gpuTexture->format, w, h, 1);
                    glCompressedTexSubImage3D(GL_TEXTURE_3D,
                                              region.texSubres.mipLevel,
                                              region.texOffset.x,
                                              region.texOffset.y,
                                              region.texOffset.z,
                                              w, h, d,
                                              gpuTexture->glFormat,
                                              memSize,
                                              (GLvoid *)buff);
                } else {
                    glTexSubImage3D(GL_TEXTURE_3D,
                                    region.texSubres.mipLevel,
                                    region.texOffset.x,
                                    region.texOffset.y,
                                    region.texOffset.z,
                                    w, h, d,
                                    gpuTexture->glFormat,
                                    gpuTexture->glType,
                                    (GLvoid *)buff);
                }
            }
            break;
        }
        case GL_TEXTURE_CUBE_MAP: {
            uint w;
            uint h;
            uint f;
            for (size_t i = 0; i < regions.size(); ++i) {
                const BufferTextureCopy &region = regions[i];
                uint face_count = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < face_count; ++f) {
                    w = region.texExtent.width;
                    h = region.texExtent.height;
                    const uint8_t *buff = buffers[n++];
                    if (isCompressed) {
                        GLsizei memSize = (GLsizei)FormatSize(gpuTexture->format, w, h, 1);
                        glCompressedTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f,
                                                  region.texSubres.mipLevel,
                                                  region.texOffset.x,
                                                  region.texOffset.y,
                                                  w, h,
                                                  gpuTexture->glFormat,
                                                  memSize,
                                                  (GLvoid *)buff);
                    } else {
                        glTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f,
                                        region.texSubres.mipLevel,
                                        region.texOffset.x,
                                        region.texOffset.y,
                                        w, h,
                                        gpuTexture->glFormat,
                                        gpuTexture->glType,
                                        (GLvoid *)buff);
                    }
                }
            }

            break;
        }
        default:
            CCASSERT(false, "Unsupported TextureType, copy buffers to texture failed.");
            break;
    }

    if (!isCompressed && gpuTexture->flags & TextureFlagBit::GEN_MIPMAP) {
        glBindTexture(gpuTexture->glTarget, gpuTexture->glTexture);
        glGenerateMipmap(gpuTexture->glTarget);
    }
}

} // namespace gfx
} // namespace cc
