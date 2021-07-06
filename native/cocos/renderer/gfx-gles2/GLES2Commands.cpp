/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2Device.h"
#include "gfx-gles-common/GLESCommandPool.h"

#define BUFFER_OFFSET(idx) (static_cast<char *>(0) + (idx))

namespace cc {
namespace gfx {

namespace {

GLenum mapGLFormat(Format format) {
    switch (format) {
        case Format::A8: return GL_ALPHA;
        case Format::L8: return GL_LUMINANCE;
        case Format::LA8: return GL_LUMINANCE_ALPHA;
        case Format::R8:
        case Format::R8SN:
        case Format::R8UI:
        case Format::R8I: return GL_LUMINANCE;
        case Format::RG8:
        case Format::RG8SN:
        case Format::RG8UI:
        case Format::RG8I: return GL_LUMINANCE_ALPHA;
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
        case Format::R16F: return GL_LUMINANCE;
        case Format::RG16UI:
        case Format::RG16I:
        case Format::RG16F: return GL_LUMINANCE_ALPHA;
        case Format::RGB16UI:
        case Format::RGB16I:
        case Format::RGB16F: return GL_RGB;
        case Format::RGBA16UI:
        case Format::RGBA16I:
        case Format::RGBA16F: return GL_RGBA;
        case Format::R32UI:
        case Format::R32I:
        case Format::R32F: return GL_LUMINANCE;
        case Format::RG32UI:
        case Format::RG32I:
        case Format::RG32F: return GL_LUMINANCE_ALPHA;
        case Format::RGB32UI:
        case Format::RGB32I:
        case Format::RGB32F: return GL_RGB;
        case Format::RGBA32UI:
        case Format::RGBA32I:
        case Format::RGBA32F:
        case Format::RGB10A2: return GL_RGBA;
        case Format::R11G11B10F:
        case Format::R5G6B5: return GL_RGB;
        case Format::RGB5A1:
        case Format::RGBA4: return GL_RGBA;
        case Format::SRGB8: return GL_SRGB_EXT;
        case Format::SRGB8_A8: return GL_SRGB_ALPHA_EXT;
        case Format::D16: return GL_DEPTH_COMPONENT;
        case Format::D16S8: return GL_DEPTH_STENCIL_OES;
        case Format::D24: return GL_DEPTH_COMPONENT;
        case Format::D24S8: return GL_DEPTH_STENCIL_OES;
        case Format::D32F: return GL_DEPTH_COMPONENT;
        case Format::D32F_S8: return GL_DEPTH_STENCIL_OES;

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
        case Format::ETC2_RGBA8: return GL_COMPRESSED_RGBA8_ETC2_EAC;

        case Format::PVRTC_RGB2: return GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGBA2: return GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case Format::PVRTC_RGB4: return GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case Format::PVRTC_RGBA4: return GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        case Format::ASTC_RGBA_4X4: return GL_COMPRESSED_RGBA_ASTC_4x4_KHR;
        case Format::ASTC_RGBA_5X4: return GL_COMPRESSED_RGBA_ASTC_5x4_KHR;
        case Format::ASTC_RGBA_5X5: return GL_COMPRESSED_RGBA_ASTC_5x5_KHR;
        case Format::ASTC_RGBA_6X5: return GL_COMPRESSED_RGBA_ASTC_6x5_KHR;
        case Format::ASTC_RGBA_6X6: return GL_COMPRESSED_RGBA_ASTC_6x6_KHR;
        case Format::ASTC_RGBA_8X5: return GL_COMPRESSED_RGBA_ASTC_8x5_KHR;
        case Format::ASTC_RGBA_8X6: return GL_COMPRESSED_RGBA_ASTC_8x6_KHR;
        case Format::ASTC_RGBA_8X8: return GL_COMPRESSED_RGBA_ASTC_8x8_KHR;
        case Format::ASTC_RGBA_10X5: return GL_COMPRESSED_RGBA_ASTC_10x5_KHR;
        case Format::ASTC_RGBA_10X6: return GL_COMPRESSED_RGBA_ASTC_10x6_KHR;
        case Format::ASTC_RGBA_10X8: return GL_COMPRESSED_RGBA_ASTC_10x8_KHR;
        case Format::ASTC_RGBA_10X10: return GL_COMPRESSED_RGBA_ASTC_10x10_KHR;
        case Format::ASTC_RGBA_12X10: return GL_COMPRESSED_RGBA_ASTC_12x10_KHR;
        case Format::ASTC_RGBA_12X12: return GL_COMPRESSED_RGBA_ASTC_12x12_KHR;

        case Format::ASTC_SRGBA_4X4: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
        case Format::ASTC_SRGBA_5X4: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;
        case Format::ASTC_SRGBA_5X5: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;
        case Format::ASTC_SRGBA_6X5: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;
        case Format::ASTC_SRGBA_6X6: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
        case Format::ASTC_SRGBA_8X5: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;
        case Format::ASTC_SRGBA_8X6: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;
        case Format::ASTC_SRGBA_8X8: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
        case Format::ASTC_SRGBA_10X5: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;
        case Format::ASTC_SRGBA_10X6: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;
        case Format::ASTC_SRGBA_10X8: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;
        case Format::ASTC_SRGBA_10X10: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
        case Format::ASTC_SRGBA_12X10: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;
        case Format::ASTC_SRGBA_12X12: return GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

        default: {
            CCASSERT(false, "Unsupported Format, convert to WebGL format failed.");
            return GL_RGBA;
        }
    }
}

GLenum mapGLInternalFormat(Format format) {
    switch (format) {
        case Format::R8: return GL_R8_EXT;
        case Format::R8SN: return GL_R8_SNORM;
        case Format::RG8SN: return GL_RG8_SNORM;
        case Format::SRGB8: return GL_SRGB_EXT;
        case Format::RGBA8SN: return GL_RGBA8_SNORM;
        case Format::SRGB8_A8: return GL_SRGB_ALPHA_EXT;
        case Format::R32F: return GL_R32F_EXT;
        case Format::RG32F: return GL_RG32F_EXT;
        case Format::RGB32F: return GL_RGB32F_EXT;
        case Format::RGBA32F: return GL_RGBA32F_EXT;
        case Format::R5G6B5: return GL_RGB565;
        case Format::RGB5A1: return GL_RGB5_A1;
        case Format::RGBA4: return GL_RGBA4;
        case Format::D16: return GL_DEPTH_COMPONENT16;
        case Format::D16S8: return GL_DEPTH24_STENCIL8_OES;
        case Format::D24S8: return GL_DEPTH24_STENCIL8_OES;
        case Format::D32F: return GL_DEPTH_COMPONENT32_OES;

        default: return mapGLFormat(format);
    }
}

GLenum mapGLType(Type type) {
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
        case Type::MAT3: return GL_FLOAT_MAT3;
        case Type::MAT4: return GL_FLOAT_MAT4;
        case Type::SAMPLER2D: return GL_SAMPLER_2D;
        case Type::SAMPLER3D: return GL_SAMPLER_3D_OES;
        case Type::SAMPLER_CUBE: return GL_SAMPLER_CUBE;
        default: {
            CCASSERT(false, "Unsupported GLType, convert to GL type failed.");
            return GL_NONE;
        }
    }
}

Type mapType(GLenum glType) {
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
        case GL_FLOAT: return Type::FLOAT;
        case GL_FLOAT_VEC2: return Type::FLOAT2;
        case GL_FLOAT_VEC3: return Type::FLOAT3;
        case GL_FLOAT_VEC4: return Type::FLOAT4;
        case GL_FLOAT_MAT2: return Type::MAT2;
        case GL_FLOAT_MAT3: return Type::MAT3;
        case GL_FLOAT_MAT4: return Type::MAT4;
        case GL_SAMPLER_2D: return Type::SAMPLER2D;
        case GL_SAMPLER_3D_OES: return Type::SAMPLER3D;
        case GL_SAMPLER_CUBE: return Type::SAMPLER_CUBE;
        default: {
            CCASSERT(false, "Unsupported GLType, convert to Type failed.");
            return Type::UNKNOWN;
        }
    }
}

GLenum formatToGLType(Format format) {
    switch (format) {
        case Format::R8: return GL_UNSIGNED_BYTE;
        case Format::R8SN: return GL_BYTE;
        case Format::R8UI: return GL_UNSIGNED_BYTE;
        case Format::R8I: return GL_BYTE;
        case Format::R16UI: return GL_UNSIGNED_SHORT;
        case Format::R16I: return GL_SHORT;
        case Format::R32F: return GL_FLOAT;
        case Format::R32UI: return GL_UNSIGNED_INT;
        case Format::R32I: return GL_INT;

        case Format::RG8: return GL_UNSIGNED_BYTE;
        case Format::RG8SN: return GL_BYTE;
        case Format::RG8UI: return GL_UNSIGNED_BYTE;
        case Format::RG8I: return GL_BYTE;
        case Format::RG16UI: return GL_UNSIGNED_SHORT;
        case Format::RG16I: return GL_SHORT;
        case Format::RG32F: return GL_FLOAT;
        case Format::RG32UI: return GL_UNSIGNED_INT;
        case Format::RG32I: return GL_INT;

        case Format::RGB8:
        case Format::SRGB8: return GL_UNSIGNED_BYTE;
        case Format::RGB8SN: return GL_BYTE;
        case Format::RGB8UI: return GL_UNSIGNED_BYTE;
        case Format::RGB8I: return GL_BYTE;
        case Format::RGB16F: return GL_HALF_FLOAT_OES;
        case Format::RGB16UI: return GL_UNSIGNED_SHORT;
        case Format::RGB16I: return GL_SHORT;
        case Format::RGB32F: return GL_FLOAT;
        case Format::RGB32UI: return GL_UNSIGNED_INT;
        case Format::RGB32I: return GL_INT;

        case Format::RGBA8:
        case Format::SRGB8_A8: return GL_UNSIGNED_BYTE;
        case Format::RGBA8SN: return GL_BYTE;
        case Format::RGBA8UI: return GL_UNSIGNED_BYTE;
        case Format::RGBA8I: return GL_BYTE;
        case Format::RGBA16F: return GL_HALF_FLOAT_OES;
        case Format::RGBA16UI: return GL_UNSIGNED_SHORT;
        case Format::RGBA16I: return GL_SHORT;
        case Format::RGBA32F: return GL_FLOAT;
        case Format::RGBA32UI: return GL_UNSIGNED_INT;
        case Format::RGBA32I: return GL_INT;

        case Format::R5G6B5: return GL_UNSIGNED_SHORT_5_6_5;
        case Format::R11G11B10F: return GL_FLOAT;
        case Format::RGB5A1: return GL_UNSIGNED_SHORT_5_5_5_1;
        case Format::RGBA4: return GL_UNSIGNED_SHORT_4_4_4_4;
        case Format::RGB10A2: return GL_UNSIGNED_BYTE;
        case Format::RGB10A2UI: return GL_UNSIGNED_INT;
        case Format::RGB9E5: return GL_FLOAT;

        case Format::D16: return GL_UNSIGNED_SHORT;
        case Format::D16S8: return GL_UNSIGNED_INT_24_8_OES;
        case Format::D24: return GL_UNSIGNED_INT;
        case Format::D24S8: return GL_UNSIGNED_INT_24_8_OES;
        case Format::D32F: return GL_UNSIGNED_INT;
        case Format::D32F_S8: return GL_UNSIGNED_INT_24_8_OES;

        case Format::BC1:
        case Format::BC1_SRGB:
        case Format::BC2:
        case Format::BC2_SRGB:
        case Format::BC3:
        case Format::BC3_SRGB:
        case Format::BC4: return GL_UNSIGNED_BYTE;
        case Format::BC4_SNORM: return GL_BYTE;
        case Format::BC5: return GL_UNSIGNED_BYTE;
        case Format::BC5_SNORM: return GL_BYTE;
        case Format::BC6H_SF16:
        case Format::BC6H_UF16: return GL_FLOAT;
        case Format::BC7:
        case Format::BC7_SRGB:

        case Format::ETC_RGB8:
        case Format::ETC2_RGB8:
        case Format::ETC2_SRGB8:
        case Format::ETC2_RGB8_A1:
        case Format::ETC2_SRGB8_A1:
        case Format::EAC_R11: return GL_UNSIGNED_BYTE;
        case Format::EAC_R11SN: return GL_BYTE;
        case Format::EAC_RG11: return GL_UNSIGNED_BYTE;
        case Format::EAC_RG11SN: return GL_BYTE;

        case Format::PVRTC_RGB2:
        case Format::PVRTC_RGBA2:
        case Format::PVRTC_RGB4:
        case Format::PVRTC_RGBA4:
        case Format::PVRTC2_2BPP:
        case Format::PVRTC2_4BPP:

        case Format::ASTC_RGBA_4X4:
        case Format::ASTC_RGBA_5X4:
        case Format::ASTC_RGBA_5X5:
        case Format::ASTC_RGBA_6X5:
        case Format::ASTC_RGBA_6X6:
        case Format::ASTC_RGBA_8X5:
        case Format::ASTC_RGBA_8X6:
        case Format::ASTC_RGBA_8X8:
        case Format::ASTC_RGBA_10X5:
        case Format::ASTC_RGBA_10X6:
        case Format::ASTC_RGBA_10X8:
        case Format::ASTC_RGBA_10X10:
        case Format::ASTC_RGBA_12X10:
        case Format::ASTC_RGBA_12X12:
        case Format::ASTC_SRGBA_4X4:
        case Format::ASTC_SRGBA_5X4:
        case Format::ASTC_SRGBA_5X5:
        case Format::ASTC_SRGBA_6X5:
        case Format::ASTC_SRGBA_6X6:
        case Format::ASTC_SRGBA_8X5:
        case Format::ASTC_SRGBA_8X6:
        case Format::ASTC_SRGBA_8X8:
        case Format::ASTC_SRGBA_10X5:
        case Format::ASTC_SRGBA_10X6:
        case Format::ASTC_SRGBA_10X8:
        case Format::ASTC_SRGBA_10X10:
        case Format::ASTC_SRGBA_12X10:
        case Format::ASTC_SRGBA_12X12:
            return GL_UNSIGNED_BYTE;

        default: {
            return GL_UNSIGNED_BYTE;
        }
    }
}

uint glTypeSize(GLenum glType) {
    switch (glType) {
        case GL_BOOL: return 4;
        case GL_BOOL_VEC2: return 8;
        case GL_BOOL_VEC3: return 12;
        case GL_BOOL_VEC4: return 16;
        case GL_INT: return 4;
        case GL_INT_VEC2: return 8;
        case GL_INT_VEC3: return 12;
        case GL_INT_VEC4: return 16;
        case GL_UNSIGNED_INT:
        case GL_FLOAT: return 4;
        case GL_FLOAT_VEC2: return 8;
        case GL_FLOAT_VEC3: return 12;
        case GL_FLOAT_VEC4:
        case GL_FLOAT_MAT2: return 16;
        case GL_FLOAT_MAT3: return 36;
        case GL_FLOAT_MAT4: return 64;
        case GL_SAMPLER_2D:
        case GL_SAMPLER_3D_OES:
        case GL_SAMPLER_CUBE:
        case GL_SAMPLER_CUBE_MAP_ARRAY_OES:
        case GL_SAMPLER_CUBE_MAP_ARRAY_SHADOW_OES:
        case GL_INT_SAMPLER_CUBE_MAP_ARRAY_OES:
        case GL_UNSIGNED_INT_SAMPLER_CUBE_MAP_ARRAY_OES: return 4;
        default: {
            CCASSERT(false, "Unsupported GLType, get type failed.");
            return 0;
        }
    }
}

uint glComponentCount(GLenum glType) {
    switch (glType) {
        case GL_FLOAT_MAT2: return 2;
        case GL_FLOAT_MAT3: return 3;
        case GL_FLOAT_MAT4: return 4;
        default: {
            return 1;
        }
    }
}

const GLenum GLES2_WRAPS[] = {
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
    GL_MIN_EXT,
    GL_MAX_EXT,
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
} // namespace

void cmdFuncGLES2CreateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    GLenum            glUsage       = (hasFlag(gpuBuffer->memUsage, MemoryUsageBit::HOST) ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);

    if (hasFlag(gpuBuffer->usage, BufferUsageBit::VERTEX)) {
        gpuBuffer->glTarget = GL_ARRAY_BUFFER;
        GL_CHECK(glGenBuffers(1, &gpuBuffer->glBuffer));
        if (gpuBuffer->size) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }

            if (device->stateCache()->glArrayBuffer != gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer));
            }

            GL_CHECK(glBufferData(GL_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage));
            GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
            device->stateCache()->glArrayBuffer = 0;
        }
    } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDEX)) {
        gpuBuffer->glTarget = GL_ELEMENT_ARRAY_BUFFER;
        GL_CHECK(glGenBuffers(1, &gpuBuffer->glBuffer));
        if (gpuBuffer->size) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }

            if (device->stateCache()->glElementArrayBuffer != gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer));
            }

            GL_CHECK(glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage));
            GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));
            device->stateCache()->glElementArrayBuffer = 0;
        }
    } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDIRECT)) {
        gpuBuffer->glTarget = GL_NONE;
    } else if ((hasFlag(gpuBuffer->usage, BufferUsageBit::UNIFORM)) ||
               (hasFlag(gpuBuffer->usage, BufferUsageBit::TRANSFER_DST)) ||
               (hasFlag(gpuBuffer->usage, BufferUsageBit::TRANSFER_SRC))) {
        gpuBuffer->buffer   = static_cast<uint8_t *>(CC_MALLOC(gpuBuffer->size));
        gpuBuffer->glTarget = GL_NONE;
    } else {
        CCASSERT(false, "Unsupported BufferType, create buffer failed.");
        gpuBuffer->glTarget = GL_NONE;
    }
}

void cmdFuncGLES2DestroyBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    if (gpuBuffer->glBuffer) {
        if (hasFlag(gpuBuffer->usage, BufferUsageBit::VERTEX)) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }
            if (device->stateCache()->glArrayBuffer == gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
                device->stateCache()->glArrayBuffer = 0;
            }
        } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDEX)) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }
            if (device->stateCache()->glElementArrayBuffer == gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));
                device->stateCache()->glElementArrayBuffer = 0;
            }
        }
        GL_CHECK(glDeleteBuffers(1, &gpuBuffer->glBuffer));
        gpuBuffer->glBuffer = 0;
    }
    CC_SAFE_FREE(gpuBuffer->buffer);
}

void cmdFuncGLES2ResizeBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    GLenum            glUsage       = (hasFlag(gpuBuffer->memUsage, MemoryUsageBit::HOST) ? GL_DYNAMIC_DRAW : GL_STATIC_DRAW);

    if (hasFlag(gpuBuffer->usage, BufferUsageBit::VERTEX)) {
        gpuBuffer->glTarget = GL_ARRAY_BUFFER;
        if (gpuBuffer->size) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }

            if (device->stateCache()->glArrayBuffer != gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer));
            }

            GL_CHECK(glBufferData(GL_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage));
            GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
            device->stateCache()->glArrayBuffer = 0;
        }
    } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDEX)) {
        gpuBuffer->glTarget = GL_ELEMENT_ARRAY_BUFFER;
        if (gpuBuffer->size) {
            if (device->constantRegistry()->useVAO) {
                if (device->stateCache()->glVAO) {
                    GL_CHECK(glBindVertexArrayOES(0));
                    device->stateCache()->glVAO     = 0;
                    gfxStateCache.gpuInputAssembler = nullptr;
                }
            }

            if (device->stateCache()->glElementArrayBuffer != gpuBuffer->glBuffer) {
                GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer));
            }

            GL_CHECK(glBufferData(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->size, nullptr, glUsage));
            GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));
            device->stateCache()->glElementArrayBuffer = 0;
        }
    } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDIRECT)) {
        gpuBuffer->indirects.resize(gpuBuffer->count);
        gpuBuffer->glTarget = GL_NONE;
    } else if ((hasFlag(gpuBuffer->usage, BufferUsageBit::UNIFORM)) ||
               (hasFlag(gpuBuffer->usage, BufferUsageBit::TRANSFER_DST)) ||
               (hasFlag(gpuBuffer->usage, BufferUsageBit::TRANSFER_SRC))) {
        if (gpuBuffer->buffer) {
            CC_FREE(gpuBuffer->buffer);
        }
        gpuBuffer->buffer   = static_cast<uint8_t *>(CC_MALLOC(gpuBuffer->size));
        gpuBuffer->glTarget = GL_NONE;
    } else {
        CCASSERT(false, "Unsupported BufferType, resize buffer failed.");
        gpuBuffer->glTarget = GL_NONE;
    }
}

void cmdFuncGLES2CreateTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture) {
    gpuTexture->glFormat      = mapGLFormat(gpuTexture->format);
    gpuTexture->glType        = formatToGLType(gpuTexture->format);
    gpuTexture->glInternalFmt = gpuTexture->glFormat;

    if (gpuTexture->samples > SampleCount::X1) {
        if (device->constantRegistry()->mMSRT != MSRTSupportLevel::NONE) {
            GLint maxSamples;
            glGetIntegerv(GL_MAX_SAMPLES_EXT, &maxSamples);

            auto requestedSampleCount = static_cast<GLint>(gpuTexture->samples);
            gpuTexture->glSamples     = std::min(maxSamples, requestedSampleCount);

            // skip multi-sampled attachment resources if we can use auto resolve
            if (gpuTexture->usage == TextureUsageBit::COLOR_ATTACHMENT) {
                gpuTexture->memoryless = true;
                return;
            }
        } else {
            gpuTexture->glSamples = 1; // fallback to single sample if the extensions is not available
        }
    }

    if (gpuTexture->glSamples <= 1) {
#if CC_PLATFORM == CC_PLATFORM_WINDOWS // PVRVFrame issue
        gpuTexture->glInternalFmt = mapGLInternalFormat(gpuTexture->format);
#endif
        switch (gpuTexture->type) {
            case TextureType::TEX2D: {
                gpuTexture->glTarget = GL_TEXTURE_2D;
                GL_CHECK(glGenTextures(1, &gpuTexture->glTexture));
                if (gpuTexture->size > 0) {
                    GLuint &glTexture = device->stateCache()->glTextures[device->stateCache()->texUint];
                    if (gpuTexture->glTexture != glTexture) {
                        GL_CHECK(glBindTexture(GL_TEXTURE_2D, gpuTexture->glTexture));
                        glTexture = gpuTexture->glTexture;
                    }
                    uint w = gpuTexture->width;
                    uint h = gpuTexture->height;
                    if (!GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed) {
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            GL_CHECK(glTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternalFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr));
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    } else {
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            uint imgSize = formatSize(gpuTexture->format, w, h, 1);
                            GL_CHECK(glCompressedTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternalFmt, w, h, 0, imgSize, nullptr));
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    }
                }
                break;
            }
            case TextureType::CUBE: {
                gpuTexture->glTarget = GL_TEXTURE_CUBE_MAP;
                GL_CHECK(glGenTextures(1, &gpuTexture->glTexture));
                if (gpuTexture->size > 0) {
                    GLuint &glTexture = device->stateCache()->glTextures[device->stateCache()->texUint];
                    if (gpuTexture->glTexture != glTexture) {
                        GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, gpuTexture->glTexture));
                        glTexture = gpuTexture->glTexture;
                    }
                    if (!GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed) {
                        for (uint f = 0; f < 6; ++f) {
                            uint w = gpuTexture->width;
                            uint h = gpuTexture->height;
                            for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                                GL_CHECK(glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternalFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr));
                                w = std::max(1U, w >> 1);
                                h = std::max(1U, h >> 1);
                            }
                        }
                    } else {
                        for (uint f = 0; f < 6; ++f) {
                            uint w = gpuTexture->width;
                            uint h = gpuTexture->height;
                            for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                                uint imgSize = formatSize(gpuTexture->format, w, h, 1);
                                GL_CHECK(glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternalFmt, w, h, 0, imgSize, nullptr));
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
    } else {
        gpuTexture->glInternalFmt = mapGLInternalFormat(gpuTexture->format);
        switch (gpuTexture->type) {
            case TextureType::TEX2D: {
                gpuTexture->glTarget = GL_RENDERBUFFER;
                GL_CHECK(glGenRenderbuffers(1, &gpuTexture->glRenderbuffer));
                if (gpuTexture->size > 0) {
                    GLuint &glRenderbuffer = device->stateCache()->glRenderbuffer;
                    if (gpuTexture->glRenderbuffer != glRenderbuffer) {
                        GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, gpuTexture->glRenderbuffer));
                        glRenderbuffer = gpuTexture->glRenderbuffer;
                    }
                    GL_CHECK(glRenderbufferStorageMultisampleEXT(GL_RENDERBUFFER, gpuTexture->glSamples, gpuTexture->glInternalFmt, gpuTexture->width, gpuTexture->height));
                }
                break;
            }
            default:
                CCASSERT(false, "Unsupported TextureType, create texture failed.");
                break;
        }
    }
}

void cmdFuncGLES2DestroyTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture) {
    device->framebufferCacheMap()->onTextureDestroy(gpuTexture);

    if (gpuTexture->glTexture) {
        for (GLuint &glTexture : device->stateCache()->glTextures) {
            if (glTexture == gpuTexture->glTexture) {
                glTexture = 0;
            }
        }
        GL_CHECK(glDeleteTextures(1, &gpuTexture->glTexture));
        gpuTexture->glTexture = 0;

    } else if (gpuTexture->glRenderbuffer) {
        GLuint &glRenderbuffer = device->stateCache()->glRenderbuffer;
        if (gpuTexture->glRenderbuffer == glRenderbuffer) {
            GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, 0));
            glRenderbuffer = 0;
        }
        GL_CHECK(glDeleteRenderbuffers(1, &gpuTexture->glRenderbuffer));
        gpuTexture->glRenderbuffer = 0;
    }
}

void cmdFuncGLES2ResizeTexture(GLES2Device *device, GLES2GPUTexture *gpuTexture) {
    if (gpuTexture->memoryless) return;

    if (gpuTexture->glSamples <= 1) {
        switch (gpuTexture->type) {
            case TextureType::TEX2D: {
                gpuTexture->glTarget = GL_TEXTURE_2D;
                if (gpuTexture->size > 0) {
                    GLuint &glTexture = device->stateCache()->glTextures[device->stateCache()->texUint];
                    if (gpuTexture->glTexture != glTexture) {
                        GL_CHECK(glBindTexture(GL_TEXTURE_2D, gpuTexture->glTexture));
                        glTexture = gpuTexture->glTexture;
                    }
                    uint w = gpuTexture->width;
                    uint h = gpuTexture->height;
                    if (!GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed) {
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            GL_CHECK(glTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternalFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr));
                            w = std::max(1U, w >> 1);
                            h = std::max(1U, h >> 1);
                        }
                    } else {
                        for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                            uint imgSize = formatSize(gpuTexture->format, w, h, 1);
                            GL_CHECK(glCompressedTexImage2D(GL_TEXTURE_2D, i, gpuTexture->glInternalFmt, w, h, 0, imgSize, nullptr));
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
                    GLuint &glTexture = device->stateCache()->glTextures[device->stateCache()->texUint];
                    if (gpuTexture->glTexture != glTexture) {
                        GL_CHECK(glBindTexture(GL_TEXTURE_CUBE_MAP, gpuTexture->glTexture));
                        glTexture = gpuTexture->glTexture;
                    }
                    if (!GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed) {
                        for (uint f = 0; f < 6; ++f) {
                            uint w = gpuTexture->width;
                            uint h = gpuTexture->height;
                            for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                                GL_CHECK(glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternalFmt, w, h, 0, gpuTexture->glFormat, gpuTexture->glType, nullptr));
                                w = std::max(1U, w >> 1);
                                h = std::max(1U, h >> 1);
                            }
                        }
                    } else {
                        for (uint f = 0; f < 6; ++f) {
                            uint w = gpuTexture->width;
                            uint h = gpuTexture->height;
                            for (uint i = 0; i < gpuTexture->mipLevel; ++i) {
                                uint imgSize = formatSize(gpuTexture->format, w, h, 1);
                                GL_CHECK(glCompressedTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture->glInternalFmt, w, h, 0, imgSize, nullptr));
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
    } else {
        switch (gpuTexture->type) {
            case TextureType::TEX2D: {
                if (gpuTexture->size > 0) {
                    GLuint &glRenderbuffer = device->stateCache()->glRenderbuffer;
                    if (gpuTexture->glRenderbuffer != glRenderbuffer) {
                        GL_CHECK(glBindRenderbuffer(GL_RENDERBUFFER, gpuTexture->glRenderbuffer));
                        glRenderbuffer = gpuTexture->glRenderbuffer;
                    }
                    GL_CHECK(glRenderbufferStorageMultisampleEXT(GL_RENDERBUFFER, gpuTexture->glSamples, gpuTexture->glInternalFmt, gpuTexture->width, gpuTexture->height));
                }
                break;
            }
            default:
                CCASSERT(false, "Unsupported TextureType, resize texture failed.");
                break;
        }
    }
}

void cmdFuncGLES2CreateSampler(GLES2Device * /*device*/, GLES2GPUSampler *gpuSampler) {
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

    gpuSampler->glWrapS = GLES2_WRAPS[static_cast<int>(gpuSampler->addressU)];
    gpuSampler->glWrapT = GLES2_WRAPS[static_cast<int>(gpuSampler->addressV)];
    gpuSampler->glWrapR = GLES2_WRAPS[static_cast<int>(gpuSampler->addressW)];
}

void cmdFuncGLES2DestroySampler(GLES2Device *device, GLES2GPUSampler *gpuSampler) {
}

void cmdFuncGLES2CreateShader(GLES2Device *device, GLES2GPUShader *gpuShader) {
    GLenum glShaderType = 0;
    String shaderTypeStr;
    GLint  status;

    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES2GPUShaderStage &gpuStage = gpuShader->gpuStages[i];

        switch (gpuStage.type) {
            case ShaderStageFlagBit::VERTEX: {
                glShaderType  = GL_VERTEX_SHADER;
                shaderTypeStr = "Vertex Shader";
                break;
            }
            case ShaderStageFlagBit::FRAGMENT: {
                glShaderType  = GL_FRAGMENT_SHADER;
                shaderTypeStr = "Fragment Shader";
                break;
            }
            default: {
                CCASSERT(false, "Unsupported ShaderStageFlagBit");
                return;
            }
        }

        GL_CHECK(gpuStage.glShader = glCreateShader(glShaderType));
        const char *shaderSrc = gpuStage.source.c_str();
        GL_CHECK(glShaderSource(gpuStage.glShader, 1, (const GLchar **)&shaderSrc, nullptr));
        GL_CHECK(glCompileShader(gpuStage.glShader));

        GL_CHECK(glGetShaderiv(gpuStage.glShader, GL_COMPILE_STATUS, &status));
        if (status != 1) {
            GLint logSize = 0;
            GL_CHECK(glGetShaderiv(gpuStage.glShader, GL_INFO_LOG_LENGTH, &logSize));

            ++logSize;
            auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
            GL_CHECK(glGetShaderInfoLog(gpuStage.glShader, logSize, nullptr, logs));

            CC_LOG_ERROR("%s in %s compilation failed.", shaderTypeStr.c_str(), gpuShader->name.c_str());
            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            GL_CHECK(glDeleteShader(gpuStage.glShader));
            gpuStage.glShader = 0;
            return;
        }
    }

    GL_CHECK(gpuShader->glProgram = glCreateProgram());

    // link program
    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES2GPUShaderStage &gpuStage = gpuShader->gpuStages[i];
        GL_CHECK(glAttachShader(gpuShader->glProgram, gpuStage.glShader));
    }

    GL_CHECK(glLinkProgram(gpuShader->glProgram));

    // detach & delete immediately
    for (size_t i = 0; i < gpuShader->gpuStages.size(); ++i) {
        GLES2GPUShaderStage &gpuStage = gpuShader->gpuStages[i];
        if (gpuStage.glShader) {
            GL_CHECK(glDetachShader(gpuShader->glProgram, gpuStage.glShader));
            GL_CHECK(glDeleteShader(gpuStage.glShader));
            gpuStage.glShader = 0;
        }
    }

    GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_LINK_STATUS, &status));
    if (status != 1) {
        CC_LOG_ERROR("Failed to link Shader [%s].", gpuShader->name.c_str());
        GLint logSize = 0;
        GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_INFO_LOG_LENGTH, &logSize));
        if (logSize) {
            ++logSize;
            auto *logs = static_cast<GLchar *>(CC_MALLOC(logSize));
            GL_CHECK(glGetProgramInfoLog(gpuShader->glProgram, logSize, nullptr, logs));

            CC_LOG_ERROR(logs);
            CC_FREE(logs);
            return;
        }
    }

    CC_LOG_INFO("Shader '%s' compilation succeeded.", gpuShader->name.c_str());

    GLint attrMaxLength = 0;
    GLint attrCount     = 0;
    GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_ATTRIBUTE_MAX_LENGTH, &attrMaxLength));
    GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_ATTRIBUTES, &attrCount));

    GLchar  glName[256];
    GLsizei glLength;
    GLsizei glSize;
    GLenum  glType;

    gpuShader->glInputs.resize(attrCount);
    for (GLint i = 0; i < attrCount; ++i) {
        GLES2GPUInput &gpuInput = gpuShader->glInputs[i];

        memset(glName, 0, sizeof(glName));
        GL_CHECK(glGetActiveAttrib(gpuShader->glProgram, i, attrMaxLength, &glLength, &glSize, &glType, glName));
        char *offset = strchr(glName, '[');
        if (offset) {
            glName[offset - glName] = '\0';
        }

        gpuInput.glLoc   = glGetAttribLocation(gpuShader->glProgram, glName);
        gpuInput.binding = gpuInput.glLoc;
        gpuInput.name    = glName;
        gpuInput.type    = mapType(glType);
        gpuInput.stride  = glTypeSize(glType);
        gpuInput.count   = glSize;
        gpuInput.size    = gpuInput.stride * gpuInput.count;
        gpuInput.glType  = glType;
    }

    // create uniform blocks
    if (!gpuShader->blocks.empty()) {
        gpuShader->glBlocks.resize(gpuShader->blocks.size());

        for (size_t i = 0; i < gpuShader->glBlocks.size(); ++i) {
            GLES2GPUUniformBlock &gpuBlock = gpuShader->glBlocks[i];
            UniformBlock &        block    = gpuShader->blocks[i];

            gpuBlock.name    = block.name;
            gpuBlock.set     = block.set;
            gpuBlock.binding = block.binding;
            gpuBlock.glUniforms.resize(block.members.size());

            for (size_t j = 0; j < gpuBlock.glUniforms.size(); ++j) {
                GLES2GPUUniform &gpuUniform = gpuBlock.glUniforms[j];
                Uniform &        uniform    = block.members[j];

                gpuUniform.binding = INVALID_BINDING;
                gpuUniform.name    = uniform.name;
                gpuUniform.type    = uniform.type;
                gpuUniform.stride  = GFX_TYPE_SIZES[static_cast<int>(uniform.type)];
                gpuUniform.count   = uniform.count;
                gpuUniform.size    = gpuUniform.stride * gpuUniform.count;
                gpuUniform.offset  = gpuBlock.size;
                gpuUniform.glType  = mapGLType(gpuUniform.type);
                gpuUniform.glLoc   = -1;
                gpuUniform.buff    = nullptr;

                gpuBlock.size += gpuUniform.size;
            }
        }
    } // if

    // fallback subpassInputs into samplerTextures if not using FBF or PLS
    if (device->constantRegistry()->mFBF == FBFSupportLevel::NONE) {
        for (const auto &subpassInput : gpuShader->subpassInputs) {
            auto &samplerTexture   = gpuShader->samplerTextures.emplace_back();
            samplerTexture.name    = subpassInput.name;
            samplerTexture.set     = subpassInput.set;
            samplerTexture.binding = subpassInput.binding;
            samplerTexture.count   = subpassInput.count;
            samplerTexture.type    = Type::SAMPLER2D;
        }
    }

    // create uniform samplers
    if (!gpuShader->samplerTextures.empty()) {
        gpuShader->glSamplerTextures.resize(gpuShader->samplerTextures.size());

        for (size_t i = 0; i < gpuShader->glSamplerTextures.size(); ++i) {
            UniformSamplerTexture &        samplerTexture    = gpuShader->samplerTextures[i];
            GLES2GPUUniformSamplerTexture &gpuSamplerTexture = gpuShader->glSamplerTextures[i];
            gpuSamplerTexture.set                            = samplerTexture.set;
            gpuSamplerTexture.binding                        = samplerTexture.binding;
            gpuSamplerTexture.name                           = samplerTexture.name;
            gpuSamplerTexture.count                          = samplerTexture.count;
            gpuSamplerTexture.glType                         = mapGLType(samplerTexture.type);
            gpuSamplerTexture.glLoc                          = -1;
        }
    }

    // parse glUniforms
    GLint glActiveUniforms;
    GL_CHECK(glGetProgramiv(gpuShader->glProgram, GL_ACTIVE_UNIFORMS, &glActiveUniforms));

    for (GLint i = 0; i < glActiveUniforms; ++i) {
        memset(glName, 0, sizeof(glName));
        GL_CHECK(glGetActiveUniform(gpuShader->glProgram, i, 255, &glLength, &glSize, &glType, glName));
        char *offset = strchr(glName, '[');
        if (offset) {
            glName[offset - glName] = '\0';
        }
        String name = glName;

        bool isSampler = (glType == GL_SAMPLER_2D) ||
                         (glType == GL_SAMPLER_3D_OES) ||
                         (glType == GL_SAMPLER_CUBE) ||
                         (glType == GL_SAMPLER_CUBE_MAP_ARRAY_OES) ||
                         (glType == GL_SAMPLER_CUBE_MAP_ARRAY_SHADOW_OES) ||
                         (glType == GL_INT_SAMPLER_CUBE_MAP_ARRAY_OES) ||
                         (glType == GL_UNSIGNED_INT_SAMPLER_CUBE_MAP_ARRAY_OES);
        if (!isSampler) {
            for (size_t b = 0; b < gpuShader->glBlocks.size(); ++b) {
                GLES2GPUUniformBlock &gpuBlock = gpuShader->glBlocks[b];
                for (size_t u = 0; u < gpuBlock.glUniforms.size(); ++u) {
                    if (gpuBlock.glUniforms[u].name == name) {
                        GLES2GPUUniform &gpuUniform = gpuBlock.glUniforms[u];
                        gpuUniform.glLoc            = glGetUniformLocation(gpuShader->glProgram, glName);
                        gpuUniform.buff             = static_cast<uint8_t *>(CC_MALLOC(gpuUniform.size));

                        gpuBlock.glActiveUniforms.emplace_back(gpuUniform);
                        break;
                    }
                }
            }
        }
    } // for

    // texture unit index mapping optimization
    vector<GLES2GPUUniformSamplerTexture> glActiveSamplerTextures;
    vector<GLint>                         glActiveSamplerLocations;
    const BindingMappingInfo &            bindingMappingInfo = device->bindingMappingInfo();
    unordered_map<String, uint> &         texUnitCacheMap    = device->stateCache()->texUnitCacheMap;

    // sampler bindings in the flexible set comes strictly after buffer bindings
    // so we need to subtract the buffer count for these samplers
    uint flexibleSetBaseOffset = 0U;
    for (auto &block : gpuShader->blocks) {
        if (block.set == bindingMappingInfo.flexibleSet) {
            flexibleSetBaseOffset++;
        }
    }

    uint arrayOffset = 0U;

    for (uint i = 0U; i < gpuShader->samplerTextures.size(); i++) {
        const UniformSamplerTexture &samplerTexture = gpuShader->samplerTextures[i];
        GLint                        glLoc          = glGetUniformLocation(gpuShader->glProgram, samplerTexture.name.c_str());
        if (glLoc >= 0) {
            glActiveSamplerTextures.push_back(gpuShader->glSamplerTextures[i]);
            glActiveSamplerLocations.push_back(glLoc);
        }
        if (!texUnitCacheMap.count(samplerTexture.name)) {
            uint binding = samplerTexture.binding + bindingMappingInfo.samplerOffsets[samplerTexture.set] + arrayOffset;
            if (samplerTexture.set == bindingMappingInfo.flexibleSet) binding -= flexibleSetBaseOffset;
            texUnitCacheMap[samplerTexture.name] = binding % device->getCapabilities().maxTextureUnits;
            arrayOffset += samplerTexture.count - 1;
        }
    }

    if (!glActiveSamplerTextures.empty()) {
        vector<bool> usedTexUnits(device->getCapabilities().maxTextureUnits, false);
        // try to reuse existing mappings first
        for (uint i = 0U; i < glActiveSamplerTextures.size(); i++) {
            GLES2GPUUniformSamplerTexture &glSamplerTexture = glActiveSamplerTextures[i];

            if (texUnitCacheMap.count(glSamplerTexture.name)) {
                uint cachedUnit        = texUnitCacheMap[glSamplerTexture.name];
                glSamplerTexture.glLoc = glActiveSamplerLocations[i];
                for (uint t = 0U; t < glSamplerTexture.count; t++) {
                    while (usedTexUnits[cachedUnit]) { // the shader already compiles so we should be safe to do this here
                        cachedUnit = (cachedUnit + 1) % device->getCapabilities().maxTextureUnits;
                    }
                    glSamplerTexture.units.push_back(static_cast<GLint>(cachedUnit));
                    usedTexUnits[cachedUnit] = true;
                }
            }
        }
        // fill in the rest sequencially
        uint unitIdx = 0U;
        for (uint i = 0U; i < glActiveSamplerTextures.size(); i++) {
            GLES2GPUUniformSamplerTexture &glSamplerTexture = glActiveSamplerTextures[i];

            if (glSamplerTexture.glLoc < 0) {
                glSamplerTexture.glLoc = glActiveSamplerLocations[i];
                for (uint t = 0U; t < glSamplerTexture.count; t++) {
                    while (usedTexUnits[unitIdx]) {
                        unitIdx = (unitIdx + 1) % device->getCapabilities().maxTextureUnits;
                    }
                    if (!texUnitCacheMap.count(glSamplerTexture.name)) {
                        texUnitCacheMap[glSamplerTexture.name] = unitIdx;
                    }
                    glSamplerTexture.units.push_back(static_cast<GLint>(unitIdx));
                    usedTexUnits[unitIdx] = true;
                }
            }
        }

        if (device->stateCache()->glProgram != gpuShader->glProgram) {
            GL_CHECK(glUseProgram(gpuShader->glProgram));
        }

        for (auto &gpuSamplerTexture : glActiveSamplerTextures) {
            GL_CHECK(glUniform1iv(gpuSamplerTexture.glLoc, (GLsizei)gpuSamplerTexture.units.size(), gpuSamplerTexture.units.data()));
        }

        if (device->stateCache()->glProgram != gpuShader->glProgram) {
            GL_CHECK(glUseProgram(device->stateCache()->glProgram));
        }
    }

    // strip out the inactive ones
    for (uint i = 0U; i < gpuShader->glBlocks.size();) {
        if (!gpuShader->glBlocks[i].glActiveUniforms.empty()) {
            i++;
        } else {
            gpuShader->glBlocks[i] = gpuShader->glBlocks.back();
            gpuShader->glBlocks.pop_back();
        }
    }
    gpuShader->glSamplerTextures = glActiveSamplerTextures;
}

void cmdFuncGLES2DestroyShader(GLES2Device *device, GLES2GPUShader *gpuShader) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    if (gpuShader->glProgram) {
        if (device->stateCache()->glProgram == gpuShader->glProgram) {
            GL_CHECK(glUseProgram(0));
            device->stateCache()->glProgram = 0;
            gfxStateCache.gpuPipelineState  = nullptr;
        }
        GL_CHECK(glDeleteProgram(gpuShader->glProgram));
        gpuShader->glProgram = 0;
    }
}

void cmdFuncGLES2CreateInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler) {
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

    vector<uint> streamOffsets(device->getCapabilities().maxVertexAttributes, 0U);

    gpuInputAssembler->glAttribs.resize(gpuInputAssembler->attributes.size());
    for (size_t i = 0; i < gpuInputAssembler->glAttribs.size(); ++i) {
        GLES2GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[i];
        const Attribute &  attrib       = gpuInputAssembler->attributes[i];

        auto *gpuVB = static_cast<GLES2GPUBuffer *>(gpuInputAssembler->gpuVertexBuffers[attrib.stream]);

        gpuAttribute.name           = attrib.name;
        gpuAttribute.glType         = formatToGLType(attrib.format);
        gpuAttribute.size           = GFX_FORMAT_INFOS[static_cast<int>(attrib.format)].size;
        gpuAttribute.count          = GFX_FORMAT_INFOS[static_cast<int>(attrib.format)].count;
        gpuAttribute.componentCount = glComponentCount(gpuAttribute.glType);
        gpuAttribute.isNormalized   = attrib.isNormalized;
        gpuAttribute.isInstanced    = attrib.isInstanced;
        gpuAttribute.offset         = streamOffsets[attrib.stream];

        if (gpuVB) {
            gpuAttribute.glBuffer = gpuVB->glBuffer;
            gpuAttribute.stride   = gpuVB->stride;
        }
        streamOffsets[attrib.stream] += gpuAttribute.size;
    }
}

void cmdFuncGLES2DestroyInputAssembler(GLES2Device *device, GLES2GPUInputAssembler *gpuInputAssembler) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    for (auto it = gpuInputAssembler->glVAOs.begin(); it != gpuInputAssembler->glVAOs.end(); ++it) {
        if (device->stateCache()->glVAO == it->second) {
            GL_CHECK(glBindVertexArrayOES(0));
            device->stateCache()->glVAO     = 0;
            gfxStateCache.gpuInputAssembler = nullptr;
        }
        GL_CHECK(glDeleteVertexArraysOES(1, &it->second));
    }
    gpuInputAssembler->glVAOs.clear();
}

static GLuint doCreateFramebuffer(GLES2Device *                    device,
                                  const vector<GLES2GPUTexture *> &attachments, const uint *colors, uint colorCount,
                                  const GLES2GPUTexture *depthStencil,
                                  const uint *           resolves            = nullptr,
                                  const GLES2GPUTexture *depthStencilResolve = nullptr,
                                  GLbitfield *           resolveMask         = nullptr) {
    static vector<GLenum> drawBuffers;
    GLuint                glFramebuffer{0U};
    GLES2GPUStateCache *  cache = device->stateCache();

    GL_CHECK(glGenFramebuffers(1, &glFramebuffer));
    if (cache->glFramebuffer != glFramebuffer) {
        GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, glFramebuffer));
        cache->glFramebuffer = glFramebuffer;
    }

    drawBuffers.clear();

    auto supportLevel = device->constantRegistry()->mMSRT;
    bool autoResolve  = supportLevel > MSRTSupportLevel::LEVEL1 || (supportLevel != MSRTSupportLevel::NONE && colorCount <= 1);

    for (size_t j = 0; j < colorCount; ++j) {
        GLES2GPUTexture *gpuColorTexture   = attachments[colors[j]];
        GLES2GPUTexture *gpuResolveTexture = resolves ? attachments[resolves[j]] : nullptr;
        drawBuffers.push_back(static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j));

        if (gpuResolveTexture) {
            if (autoResolve) {
                GL_CHECK(glFramebufferTexture2DMultisampleEXT(GL_FRAMEBUFFER, static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j),
                                                              gpuResolveTexture->glTarget, gpuResolveTexture->glTexture, 0,
                                                              gpuColorTexture->glSamples));
                continue;
            }
            *resolveMask |= GL_COLOR_BUFFER_BIT; // fallback to blit-based manual resolve
        }
        if (gpuColorTexture->glTexture) {
            GL_CHECK(glFramebufferTexture2D(GL_FRAMEBUFFER, static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j),
                                            gpuColorTexture->glTarget, gpuColorTexture->glTexture, 0));
        } else {
            GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, static_cast<GLenum>(GL_COLOR_ATTACHMENT0 + j),
                                               gpuColorTexture->glTarget, gpuColorTexture->glRenderbuffer));
        }
    }
    if (depthStencil) {
        bool hasStencil = GFX_FORMAT_INFOS[static_cast<int>(depthStencil->format)].hasStencil;
        if (depthStencil->glTexture) {
            GL_CHECK(glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, depthStencil->glTarget, depthStencil->glTexture, 0));
            if (hasStencil) GL_CHECK(glFramebufferTexture2D(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, depthStencil->glTarget, depthStencil->glTexture, 0));
        } else {
            GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, depthStencil->glTarget, depthStencil->glTexture));
            if (hasStencil) GL_CHECK(glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, depthStencil->glTarget, depthStencil->glTexture));
        }

        // fallback to blit-based manual resolve
        if (depthStencilResolve) *resolveMask |= hasStencil ? GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT : GL_DEPTH_BUFFER_BIT;
    }

    if (device->hasFeature(Feature::MULTIPLE_RENDER_TARGETS)) {
        GL_CHECK(glDrawBuffersEXT(drawBuffers.size(), drawBuffers.data()));
    }

    GLenum status;
    GL_CHECK(status = glCheckFramebufferStatus(GL_FRAMEBUFFER));
    if (status != GL_FRAMEBUFFER_COMPLETE) {
        switch (status) {
            case GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
                break;
            case GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
                break;
            case GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
                break;
            case GL_FRAMEBUFFER_UNSUPPORTED:
                CC_LOG_ERROR("checkFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED");
                break;
            default:
                CC_LOG_ERROR("checkFramebufferStatus() - %x", status);
                break;
        }
    }

    return glFramebuffer;
}

static void doCreateFramebufferInstance(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO, const vector<uint> &colors,
                                        uint depthStencil, GLES2GPUFramebuffer::GLFramebuffer *outFBO,
                                        const uint *resolves = nullptr, uint depthStencilResolve = INVALID_BINDING) {
    uint offscreenCount{0U};
    for (uint idx : colors) {
        const auto *colorTex = gpuFBO->gpuColorTextures[idx];
        if (colorTex) ++offscreenCount;
    }
    CCASSERT(!offscreenCount || offscreenCount == colors.size(), "Partially offscreen FBO is not supported");

    const GLES2GPUTexture *depthStencilTexture = nullptr;
    if (depthStencil != INVALID_BINDING) {
        depthStencilTexture = depthStencil < gpuFBO->gpuColorTextures.size()
                                  ? gpuFBO->gpuColorTextures[depthStencil]
                                  : gpuFBO->gpuDepthStencilTexture;
    }
    const GLES2GPUTexture *depthStencilResolveTexture = nullptr;
    if (depthStencilResolve != INVALID_BINDING) {
        depthStencilResolveTexture = depthStencilResolve < gpuFBO->gpuColorTextures.size()
                                         ? gpuFBO->gpuColorTextures[depthStencilResolve]
                                         : gpuFBO->gpuDepthStencilTexture;
    }

    if (offscreenCount || depthStencilTexture) {
        outFBO->glFramebuffer = doCreateFramebuffer(device, gpuFBO->gpuColorTextures, colors.data(), colors.size(),
                                                    depthStencilTexture, resolves, depthStencilResolveTexture, &outFBO->resolveMask);
        if (outFBO->resolveMask) {
            uint resolveCount            = outFBO->resolveMask & GL_COLOR_BUFFER_BIT ? colors.size() : 0U;
            outFBO->glResolveFramebuffer = doCreateFramebuffer(device, gpuFBO->gpuColorTextures, resolves, resolveCount, depthStencilResolveTexture);
        }
    } else {
        outFBO->glFramebuffer = device->constantRegistry()->defaultFramebuffer;
    }
}

void cmdFuncGLES2CreateFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO) {
    if (gpuFBO->gpuRenderPass->subpasses.size() > 1) {
        gpuFBO->usesFBF = device->constantRegistry()->mFBF != FBFSupportLevel::NONE;
    }

    if (gpuFBO->usesFBF) {
        gpuFBO->uberColorAttachmentIndices.clear();
        for (uint i = 0U; i < gpuFBO->gpuColorTextures.size(); ++i) {
            const auto *gpuTexture = gpuFBO->gpuColorTextures[i];
            if (!gpuTexture || gpuTexture->memoryless) continue;
            if (GFX_FORMAT_INFOS[static_cast<uint>(gpuTexture->format)].hasDepth) continue;
            gpuFBO->uberColorAttachmentIndices.push_back(i);
        }
        doCreateFramebufferInstance(device, gpuFBO, gpuFBO->uberColorAttachmentIndices, gpuFBO->gpuColorTextures.size(), &gpuFBO->uberInstance);
    } else {
        for (const auto &subpass : gpuFBO->gpuRenderPass->subpasses) {
            doCreateFramebufferInstance(device, gpuFBO, subpass.colors, subpass.depthStencil, &gpuFBO->instances.emplace_back(),
                                        subpass.resolves.empty() ? nullptr : subpass.resolves.data(), subpass.depthStencilResolve);
        }
    }
}

static void doDestroyFramebuffer(GLES2GPUStateCache *cache, GLuint *pFBO) {
    if (cache->glFramebuffer == *pFBO) {
        GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, 0));
        cache->glFramebuffer = 0;
    }
    GL_CHECK(glDeleteFramebuffers(1, pFBO));
    *pFBO = 0U;
}

void cmdFuncGLES2DestroyFramebuffer(GLES2Device *device, GLES2GPUFramebuffer *gpuFBO) {
    auto *cache      = device->stateCache();
    uint  defaultFBO = device->constantRegistry()->defaultFramebuffer;

    for (auto &instance : gpuFBO->instances) {
        if (instance.glFramebuffer != defaultFBO) {
            doDestroyFramebuffer(cache, &instance.glFramebuffer);
        }
        if (instance.glResolveFramebuffer != defaultFBO) {
            doDestroyFramebuffer(cache, &instance.glResolveFramebuffer);
        }
    }
    gpuFBO->instances.clear();

    if (gpuFBO->uberInstance.glFramebuffer != defaultFBO) {
        doDestroyFramebuffer(cache, &gpuFBO->uberInstance.glFramebuffer);
    }
    if (gpuFBO->uberInstance.glResolveFramebuffer != defaultFBO) {
        doDestroyFramebuffer(cache, &gpuFBO->uberInstance.glResolveFramebuffer);
    }
}

void cmdFuncGLES2BeginRenderPass(GLES2Device *device, uint subpassIdx, GLES2GPURenderPass *gpuRenderPass, GLES2GPUFramebuffer *gpuFramebuffer,
                                 const Rect *renderArea, const Color *clearColors, float clearDepth, uint clearStencil) {
    static uint           attachmentLoadOpRecord = 0U;
    static vector<GLenum> invalidAttachments;

    GLES2GPUStateCache *cache         = device->stateCache();
    GLES2ObjectCache &  gfxStateCache = cache->gfxStateCache;
    gfxStateCache.subpassIdx          = subpassIdx;
    if (subpassIdx) {
        gpuRenderPass  = gfxStateCache.gpuRenderPass;
        gpuFramebuffer = gfxStateCache.gpuFramebuffer;
        renderArea     = &gfxStateCache.renderArea;
        clearColors    = gfxStateCache.clearColors.data();
        clearDepth     = gfxStateCache.clearDepth;
        clearStencil   = gfxStateCache.clearStencil;
    } else {
        gfxStateCache.gpuRenderPass  = gpuRenderPass;
        gfxStateCache.gpuFramebuffer = gpuFramebuffer;
        gfxStateCache.renderArea     = *renderArea;
        gfxStateCache.clearColors.assign(clearColors, clearColors + gpuRenderPass->colorAttachments.size());
        gfxStateCache.clearDepth   = clearDepth;
        gfxStateCache.clearStencil = clearStencil;
        attachmentLoadOpRecord     = 0U;
    }

    if (gpuFramebuffer && gpuRenderPass) {
        const auto &instance = gpuFramebuffer->usesFBF ? gpuFramebuffer->uberInstance : gpuFramebuffer->instances[subpassIdx];
        if (cache->glFramebuffer != instance.glFramebuffer) {
            GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, instance.glFramebuffer));
            cache->glFramebuffer = instance.glFramebuffer;
        }

        if (cache->viewport.left != renderArea->x ||
            cache->viewport.top != renderArea->y ||
            cache->viewport.width != renderArea->width ||
            cache->viewport.height != renderArea->height) {
            GL_CHECK(glViewport(renderArea->x, renderArea->y, renderArea->width, renderArea->height));
            cache->viewport.left   = renderArea->x;
            cache->viewport.top    = renderArea->y;
            cache->viewport.width  = renderArea->width;
            cache->viewport.height = renderArea->height;
        }

        if (cache->scissor.x != renderArea->x ||
            cache->scissor.y != renderArea->y ||
            cache->scissor.width != renderArea->width ||
            cache->scissor.height != renderArea->height) {
            GL_CHECK(glScissor(renderArea->x, renderArea->y, renderArea->width, renderArea->height));
            cache->scissor.x      = renderArea->x;
            cache->scissor.y      = renderArea->y;
            cache->scissor.width  = renderArea->width;
            cache->scissor.height = renderArea->height;
        }

        GLbitfield glClears    = 0;
        bool       hasBoundFBO = instance.glFramebuffer;
        bool       maskSet     = false;
        invalidAttachments.clear();

        auto performLoadOp = [&](uint attachmentIndex, uint glAttachmentIndex) {
            const ColorAttachment &colorAttachment = gpuRenderPass->colorAttachments[attachmentIndex];
            if (colorAttachment.format != Format::UNKNOWN) {
                switch (colorAttachment.loadOp) {
                    case LoadOp::LOAD: break; // GL default behaviour
                    case LoadOp::CLEAR: {
                        // `glClearColor` clears all the attachments to the same value
                        // here we fallback to the load op of the first attachment
                        // to avoid clearing multiple times
                        if (glAttachmentIndex) break;

                        if (cache->bs.targets[0].blendColorMask != ColorMask::ALL) {
                            GL_CHECK(glColorMask(true, true, true, true));
                            maskSet = true;
                        }

                        const Color &color = clearColors[attachmentIndex];
                        GL_CHECK(glClearColor(color.x, color.y, color.z, color.w));
                        glClears |= GL_COLOR_BUFFER_BIT;
                        break;
                    }
                    case LoadOp::DISCARD:
                        // invalidate fbo
                        invalidAttachments.push_back(hasBoundFBO ? GL_COLOR_ATTACHMENT0 + glAttachmentIndex : GL_COLOR_EXT);
                        break;
                }
            }
        };

        auto performDepthStencilLoadOp = [&]() {
            if (gpuRenderPass->depthStencilAttachment.format == Format::UNKNOWN) return;

            bool hasDepth = GFX_FORMAT_INFOS[static_cast<int>(gpuRenderPass->depthStencilAttachment.format)].hasDepth;
            if (hasDepth) {
                switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                    case LoadOp::LOAD: break; // GL default behaviour
                    case LoadOp::CLEAR: {
                        if (!cache->dss.depthWrite) {
                            GL_CHECK(glDepthMask(true));
                        }
                        GL_CHECK(glClearDepthf(clearDepth));
                        glClears |= GL_DEPTH_BUFFER_BIT;
                    } break;
                    case LoadOp::DISCARD:
                        // invalidate fbo
                        invalidAttachments.push_back(hasBoundFBO ? GL_DEPTH_ATTACHMENT : GL_DEPTH_EXT);
                        break;
                }
            } // if (hasDepth)
            bool hasStencils = GFX_FORMAT_INFOS[static_cast<int>(gpuRenderPass->depthStencilAttachment.format)].hasStencil;
            if (hasStencils) {
                switch (gpuRenderPass->depthStencilAttachment.depthLoadOp) {
                    case LoadOp::LOAD: break; // GL default behaviour
                    case LoadOp::CLEAR: {
                        if (!cache->dss.stencilWriteMaskFront) {
                            GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0xffffffff));
                        }
                        if (!cache->dss.stencilWriteMaskBack) {
                            GL_CHECK(glStencilMaskSeparate(GL_BACK, 0xffffffff));
                        }
                        GL_CHECK(glClearStencil(clearStencil));
                        glClears |= GL_STENCIL_BUFFER_BIT;
                    } break;
                    case LoadOp::DISCARD:
                        // invalidate fbo
                        invalidAttachments.push_back(hasBoundFBO ? GL_STENCIL_ATTACHMENT : GL_STENCIL_EXT);
                        break;
                }
            }

            if (!invalidAttachments.empty() && device->constantRegistry()->useDiscardFramebuffer) {
                GL_CHECK(glDiscardFramebufferEXT(GL_FRAMEBUFFER, invalidAttachments.size(), invalidAttachments.data()));
            }

            if (glClears) {
                GL_CHECK(glClear(glClears));
            }

            // restore states
            if (glClears & GL_COLOR_BUFFER_BIT) {
                ColorMask colorMask = cache->bs.targets[0].blendColorMask;
                if (colorMask != ColorMask::ALL) {
                    GL_CHECK(glColorMask((GLboolean)(colorMask & ColorMask::R),
                                         (GLboolean)(colorMask & ColorMask::G),
                                         (GLboolean)(colorMask & ColorMask::B),
                                         (GLboolean)(colorMask & ColorMask::A)));
                }
            }

            if ((glClears & GL_DEPTH_BUFFER_BIT) && !cache->dss.depthWrite) {
                GL_CHECK(glDepthMask(false));
            }

            if (glClears & GL_STENCIL_BUFFER_BIT) {
                if (!cache->dss.stencilWriteMaskFront) {
                    GL_CHECK(glStencilMaskSeparate(GL_FRONT, 0));
                }
                if (!cache->dss.stencilWriteMaskBack) {
                    GL_CHECK(glStencilMaskSeparate(GL_BACK, 0));
                }
            }
        };

        uint glAttachmentIndex = 0U;
        if (gpuFramebuffer->usesFBF) {
            if (subpassIdx == 0) {
                for (const auto attachmentIndex : gpuFramebuffer->uberColorAttachmentIndices) {
                    performLoadOp(attachmentIndex, glAttachmentIndex++);
                }
                performDepthStencilLoadOp();
            }
        } else {
            for (const auto attachmentIndex : gpuRenderPass->subpasses[subpassIdx].colors) {
                if (attachmentLoadOpRecord & (1 << attachmentIndex)) continue;
                performLoadOp(attachmentIndex, glAttachmentIndex++);
                attachmentLoadOpRecord |= 1 << attachmentIndex;
            }
            performDepthStencilLoadOp();
        }
    }
}

void cmdFuncGLES2EndRenderPass(GLES2Device *device) {
    static vector<GLenum> invalidAttachments;

    GLES2GPUStateCache * cache            = device->stateCache();
    GLES2ObjectCache &   gfxStateCache    = cache->gfxStateCache;
    GLES2GPURenderPass * gpuRenderPass    = gfxStateCache.gpuRenderPass;
    GLES2GPUFramebuffer *gpuFramebuffer   = gfxStateCache.gpuFramebuffer;
    const auto &         instance         = gpuFramebuffer->usesFBF ? gpuFramebuffer->uberInstance : gpuFramebuffer->instances[gfxStateCache.subpassIdx];
    const SubpassInfo &  subpass          = gpuRenderPass->subpasses[gfxStateCache.subpassIdx];
    bool                 isTheLastSubpass = gfxStateCache.subpassIdx == gpuRenderPass->subpasses.size() - 1;
    bool                 hasBoundFBO      = instance.glFramebuffer;
    bool                 skipDiscard      = false;

    invalidAttachments.clear();
    auto performStoreOp = [&](uint attachmentIndex, uint glAttachmentIndex) {
        const ColorAttachment &colorAttachment = gpuRenderPass->colorAttachments[attachmentIndex];
        if (colorAttachment.format != Format::UNKNOWN) {
            switch (colorAttachment.storeOp) {
                case StoreOp::STORE: break;
                case StoreOp::DISCARD:
                    // invalidate fbo
                    invalidAttachments.push_back(hasBoundFBO ? GL_COLOR_ATTACHMENT0 + glAttachmentIndex : GL_COLOR_EXT);
                    break;
            }
        }
    };

    auto performDepthStencilStoreOp = [&]() {
        if (gpuRenderPass->depthStencilAttachment.format == Format::UNKNOWN) return;

        bool hasDepth = GFX_FORMAT_INFOS[static_cast<int>(gpuRenderPass->depthStencilAttachment.format)].hasDepth;
        if (hasDepth) {
            switch (gpuRenderPass->depthStencilAttachment.depthStoreOp) {
                case StoreOp::STORE: break;
                case StoreOp::DISCARD:
                    // invalidate fbo
                    invalidAttachments.push_back(hasBoundFBO ? GL_DEPTH_ATTACHMENT : GL_DEPTH_EXT);
                    break;
            }
        } // if (hasDepth)
        bool hasStencils = GFX_FORMAT_INFOS[static_cast<int>(gpuRenderPass->depthStencilAttachment.format)].hasStencil;
        if (hasStencils) {
            switch (gpuRenderPass->depthStencilAttachment.stencilStoreOp) {
                case StoreOp::STORE: break;
                case StoreOp::DISCARD:
                    // invalidate fbo
                    invalidAttachments.push_back(hasBoundFBO ? GL_STENCIL_ATTACHMENT : GL_STENCIL_EXT);
                    break;
            }
        }

        if (!skipDiscard && !invalidAttachments.empty() && device->constantRegistry()->useDiscardFramebuffer) {
            GL_CHECK(glDiscardFramebufferEXT(GL_FRAMEBUFFER, invalidAttachments.size(), invalidAttachments.data()));
        }
    };

    if (instance.resolveMask) {
        if (cache->glFramebuffer != instance.glResolveFramebuffer) {
            GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, instance.glResolveFramebuffer));
            cache->glFramebuffer = instance.glResolveFramebuffer;
        }

        TextureBlit region;

        if (instance.resolveMask & GL_COLOR_BUFFER_BIT) {
            for (uint i = 0; i < subpass.colors.size(); ++i) {
                GLES2GPUTexture *srcTexture = gpuFramebuffer->gpuColorTextures[subpass.colors[i]];
                GLES2GPUTexture *dstTexture = gpuFramebuffer->gpuColorTextures[subpass.resolves[i]];

                region.srcExtent.width  = srcTexture->width;
                region.srcExtent.height = srcTexture->height;
                region.dstExtent.width  = dstTexture->width;
                region.dstExtent.height = dstTexture->height;
                device->blitManager()->draw(srcTexture, dstTexture, &region, 1, Filter::POINT);
            }
        }

        if (instance.resolveMask & GL_DEPTH_BUFFER_BIT) {
            GLES2GPUTexture *srcTexture = subpass.depthStencil < gpuFramebuffer->gpuColorTextures.size()
                                              ? gpuFramebuffer->gpuColorTextures[subpass.depthStencil]
                                              : gpuFramebuffer->gpuDepthStencilTexture;
            GLES2GPUTexture *dstTexture = subpass.depthStencilResolve < gpuFramebuffer->gpuColorTextures.size()
                                              ? gpuFramebuffer->gpuColorTextures[subpass.depthStencilResolve]
                                              : gpuFramebuffer->gpuDepthStencilTexture;

            region.srcExtent.width  = srcTexture->width;
            region.srcExtent.height = srcTexture->height;
            region.dstExtent.width  = dstTexture->width;
            region.dstExtent.height = dstTexture->height;
            device->blitManager()->draw(srcTexture, dstTexture, &region, 1, Filter::POINT);
        }

        skipDiscard = true; // framebuffer was already stored
    }

    uint glAttachmentIndex = 0U;
    if (gpuFramebuffer->usesFBF) {
        if (isTheLastSubpass) {
            for (const auto attachmentIndex : gpuFramebuffer->uberColorAttachmentIndices) {
                performStoreOp(attachmentIndex, glAttachmentIndex++);
            }
            performDepthStencilStoreOp();
        } else if (gpuFramebuffer->usesFBF) {
            if (device->constantRegistry()->mFBF == FBFSupportLevel::NON_COHERENT_EXT) {
                glFramebufferFetchBarrierEXT();
            } else if (device->constantRegistry()->mFBF == FBFSupportLevel::NON_COHERENT_QCOM) {
                glFramebufferFetchBarrierQCOM();
            }
        }
    } else {
        if (isTheLastSubpass) {
            const auto &indices = subpass.resolves.empty() ? subpass.colors : subpass.resolves;
            for (const auto attachmentIndex : indices) {
                performStoreOp(attachmentIndex, glAttachmentIndex++);
            }
            performDepthStencilStoreOp();
        }
    }
}

void cmdFuncGLES2BindState(GLES2Device *device, GLES2GPUPipelineState *gpuPipelineState, GLES2GPUInputAssembler *gpuInputAssembler,
                           const GLES2GPUDescriptorSet *const *gpuDescriptorSets, const uint *dynamicOffsets,
                           const DynamicStates *dynamicStates) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;

    GLES2GPUStateCache *cache           = device->stateCache();
    bool                isShaderChanged = false;
    GLenum              glWrapS         = 0U;
    GLenum              glWrapT         = 0U;
    GLenum              glMinFilter     = 0U;

    if (gpuPipelineState && gpuPipelineState != gfxStateCache.gpuPipelineState) {
        gfxStateCache.gpuPipelineState = gpuPipelineState;
        gfxStateCache.glPrimitive      = gpuPipelineState->glPrimitive;

        if (gpuPipelineState->gpuShader) {
            if (cache->glProgram != gpuPipelineState->gpuShader->glProgram) {
                GL_CHECK(glUseProgram(gpuPipelineState->gpuShader->glProgram));
                cache->glProgram = gpuPipelineState->gpuShader->glProgram;
                isShaderChanged  = true;
            }
        }

        // bind rasterizer state
        if (cache->rs.cullMode != gpuPipelineState->rs.cullMode) {
            switch (gpuPipelineState->rs.cullMode) {
                case CullMode::NONE: {
                    if (cache->isCullFaceEnabled) {
                        GL_CHECK(glDisable(GL_CULL_FACE));
                        cache->isCullFaceEnabled = false;
                    }
                } break;
                case CullMode::FRONT: {
                    if (!cache->isCullFaceEnabled) {
                        GL_CHECK(glEnable(GL_CULL_FACE));
                        cache->isCullFaceEnabled = true;
                    }
                    GL_CHECK(glCullFace(GL_FRONT));
                } break;
                case CullMode::BACK: {
                    if (!cache->isCullFaceEnabled) {
                        GL_CHECK(glEnable(GL_CULL_FACE));
                        cache->isCullFaceEnabled = true;
                    }
                    GL_CHECK(glCullFace(GL_BACK));
                } break;
                default:
                    break;
            }
            cache->rs.cullMode = gpuPipelineState->rs.cullMode;
        }
        if (cache->rs.isFrontFaceCCW != gpuPipelineState->rs.isFrontFaceCCW) {
            GL_CHECK(glFrontFace(gpuPipelineState->rs.isFrontFaceCCW ? GL_CCW : GL_CW));
            cache->rs.isFrontFaceCCW = gpuPipelineState->rs.isFrontFaceCCW;
        }
        if ((cache->rs.depthBias != gpuPipelineState->rs.depthBias) ||
            (cache->rs.depthBiasSlop != gpuPipelineState->rs.depthBiasSlop)) {
            GL_CHECK(glPolygonOffset(cache->rs.depthBias, cache->rs.depthBiasSlop));
            cache->rs.depthBiasSlop = gpuPipelineState->rs.depthBiasSlop;
        }
        if (cache->rs.lineWidth != gpuPipelineState->rs.lineWidth) {
            GL_CHECK(glLineWidth(gpuPipelineState->rs.lineWidth));
            cache->rs.lineWidth = gpuPipelineState->rs.lineWidth;
        }

        // bind depth-stencil state
        if (cache->dss.depthTest != gpuPipelineState->dss.depthTest) {
            if (gpuPipelineState->dss.depthTest) {
                GL_CHECK(glEnable(GL_DEPTH_TEST));
            } else {
                GL_CHECK(glDisable(GL_DEPTH_TEST));
            }
            cache->dss.depthTest = gpuPipelineState->dss.depthTest;
        }
        if (cache->dss.depthWrite != gpuPipelineState->dss.depthWrite) {
            GL_CHECK(glDepthMask(!!gpuPipelineState->dss.depthWrite));
            cache->dss.depthWrite = gpuPipelineState->dss.depthWrite;
        }
        if (cache->dss.depthFunc != gpuPipelineState->dss.depthFunc) {
            GL_CHECK(glDepthFunc(GLES2_CMP_FUNCS[(int)gpuPipelineState->dss.depthFunc]));
            cache->dss.depthFunc = gpuPipelineState->dss.depthFunc;
        }

        // bind depth-stencil state - front
        if (gpuPipelineState->dss.stencilTestFront || gpuPipelineState->dss.stencilTestBack) {
            if (!cache->isStencilTestEnabled) {
                GL_CHECK(glEnable(GL_STENCIL_TEST));
                cache->isStencilTestEnabled = true;
            }
        } else {
            if (cache->isStencilTestEnabled) {
                GL_CHECK(glDisable(GL_STENCIL_TEST));
                cache->isStencilTestEnabled = false;
            }
        }
        if (cache->dss.stencilFuncFront != gpuPipelineState->dss.stencilFuncFront ||
            cache->dss.stencilRefFront != gpuPipelineState->dss.stencilRefFront ||
            cache->dss.stencilReadMaskFront != gpuPipelineState->dss.stencilReadMaskFront) {
            GL_CHECK(glStencilFuncSeparate(GL_FRONT,
                                           GLES2_CMP_FUNCS[(int)gpuPipelineState->dss.stencilFuncFront],
                                           gpuPipelineState->dss.stencilRefFront,
                                           gpuPipelineState->dss.stencilReadMaskFront));
            cache->dss.stencilFuncFront     = gpuPipelineState->dss.stencilFuncFront;
            cache->dss.stencilRefFront      = gpuPipelineState->dss.stencilRefFront;
            cache->dss.stencilReadMaskFront = gpuPipelineState->dss.stencilReadMaskFront;
        }
        if (cache->dss.stencilFailOpFront != gpuPipelineState->dss.stencilFailOpFront ||
            cache->dss.stencilZFailOpFront != gpuPipelineState->dss.stencilZFailOpFront ||
            cache->dss.stencilPassOpFront != gpuPipelineState->dss.stencilPassOpFront) {
            GL_CHECK(glStencilOpSeparate(GL_FRONT,
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilFailOpFront],
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilZFailOpFront],
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilPassOpFront]));
            cache->dss.stencilFailOpFront  = gpuPipelineState->dss.stencilFailOpFront;
            cache->dss.stencilZFailOpFront = gpuPipelineState->dss.stencilZFailOpFront;
            cache->dss.stencilPassOpFront  = gpuPipelineState->dss.stencilPassOpFront;
        }
        if (cache->dss.stencilWriteMaskFront != gpuPipelineState->dss.stencilWriteMaskFront) {
            GL_CHECK(glStencilMaskSeparate(GL_FRONT, gpuPipelineState->dss.stencilWriteMaskFront));
            cache->dss.stencilWriteMaskFront = gpuPipelineState->dss.stencilWriteMaskFront;
        }

        // bind depth-stencil state - back
        if (cache->dss.stencilFuncBack != gpuPipelineState->dss.stencilFuncBack ||
            cache->dss.stencilRefBack != gpuPipelineState->dss.stencilRefBack ||
            cache->dss.stencilReadMaskBack != gpuPipelineState->dss.stencilReadMaskBack) {
            GL_CHECK(glStencilFuncSeparate(GL_BACK,
                                           GLES2_CMP_FUNCS[(int)gpuPipelineState->dss.stencilFuncBack],
                                           gpuPipelineState->dss.stencilRefBack,
                                           gpuPipelineState->dss.stencilReadMaskBack));
            cache->dss.stencilFuncBack     = gpuPipelineState->dss.stencilFuncBack;
            cache->dss.stencilRefBack      = gpuPipelineState->dss.stencilRefBack;
            cache->dss.stencilReadMaskBack = gpuPipelineState->dss.stencilReadMaskBack;
        }
        if (cache->dss.stencilFailOpBack != gpuPipelineState->dss.stencilFailOpBack ||
            cache->dss.stencilZFailOpBack != gpuPipelineState->dss.stencilZFailOpBack ||
            cache->dss.stencilPassOpBack != gpuPipelineState->dss.stencilPassOpBack) {
            GL_CHECK(glStencilOpSeparate(GL_BACK,
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilFailOpBack],
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilZFailOpBack],
                                         GLES2_STENCIL_OPS[(int)gpuPipelineState->dss.stencilPassOpBack]));
            cache->dss.stencilFailOpBack  = gpuPipelineState->dss.stencilFailOpBack;
            cache->dss.stencilZFailOpBack = gpuPipelineState->dss.stencilZFailOpBack;
            cache->dss.stencilPassOpBack  = gpuPipelineState->dss.stencilPassOpBack;
        }
        if (cache->dss.stencilWriteMaskBack != gpuPipelineState->dss.stencilWriteMaskBack) {
            GL_CHECK(glStencilMaskSeparate(GL_BACK, gpuPipelineState->dss.stencilWriteMaskBack));
            cache->dss.stencilWriteMaskBack = gpuPipelineState->dss.stencilWriteMaskBack;
        }

        // bind blend state
        if (cache->bs.isA2C != gpuPipelineState->bs.isA2C) {
            if (cache->bs.isA2C) {
                GL_CHECK(glEnable(GL_SAMPLE_ALPHA_TO_COVERAGE));
            } else {
                GL_CHECK(glDisable(GL_SAMPLE_ALPHA_TO_COVERAGE));
            }
            cache->bs.isA2C = gpuPipelineState->bs.isA2C;
        }
        if (cache->bs.blendColor.x != gpuPipelineState->bs.blendColor.x ||
            cache->bs.blendColor.y != gpuPipelineState->bs.blendColor.y ||
            cache->bs.blendColor.z != gpuPipelineState->bs.blendColor.z ||
            cache->bs.blendColor.w != gpuPipelineState->bs.blendColor.w) {
            GL_CHECK(glBlendColor(gpuPipelineState->bs.blendColor.x,
                                  gpuPipelineState->bs.blendColor.y,
                                  gpuPipelineState->bs.blendColor.z,
                                  gpuPipelineState->bs.blendColor.w));
            cache->bs.blendColor = gpuPipelineState->bs.blendColor;
        }

        if (!gpuPipelineState->bs.targets.empty()) {
            BlendTarget &      cacheTarget = cache->bs.targets[0];
            const BlendTarget &target      = gpuPipelineState->bs.targets[0];
            if (cacheTarget.blend != target.blend) {
                if (!cacheTarget.blend) {
                    GL_CHECK(glEnable(GL_BLEND));
                } else {
                    GL_CHECK(glDisable(GL_BLEND));
                }
                cacheTarget.blend = target.blend;
            }
            if (cacheTarget.blendEq != target.blendEq ||
                cacheTarget.blendAlphaEq != target.blendAlphaEq) {
                GL_CHECK(glBlendEquationSeparate(GLES2_BLEND_OPS[(int)target.blendEq],
                                                 GLES2_BLEND_OPS[(int)target.blendAlphaEq]));
                cacheTarget.blendEq      = target.blendEq;
                cacheTarget.blendAlphaEq = target.blendAlphaEq;
            }
            if (cacheTarget.blendSrc != target.blendSrc ||
                cacheTarget.blendDst != target.blendDst ||
                cacheTarget.blendSrcAlpha != target.blendSrcAlpha ||
                cacheTarget.blendDstAlpha != target.blendDstAlpha) {
                GL_CHECK(glBlendFuncSeparate(GLES2_BLEND_FACTORS[(int)target.blendSrc],
                                             GLES2_BLEND_FACTORS[(int)target.blendDst],
                                             GLES2_BLEND_FACTORS[(int)target.blendSrcAlpha],
                                             GLES2_BLEND_FACTORS[(int)target.blendDstAlpha]));
                cacheTarget.blendSrc      = target.blendSrc;
                cacheTarget.blendDst      = target.blendDst;
                cacheTarget.blendSrcAlpha = target.blendSrcAlpha;
                cacheTarget.blendDstAlpha = target.blendDstAlpha;
            }
            if (cacheTarget.blendColorMask != target.blendColorMask) {
                GL_CHECK(glColorMask((GLboolean)(target.blendColorMask & ColorMask::R),
                                     (GLboolean)(target.blendColorMask & ColorMask::G),
                                     (GLboolean)(target.blendColorMask & ColorMask::B),
                                     (GLboolean)(target.blendColorMask & ColorMask::A)));
                cacheTarget.blendColorMask = target.blendColorMask;
            }
        }
    } // if

    // bind descriptor sets
    if (gpuPipelineState && gpuPipelineState->gpuShader && gpuPipelineState->gpuPipelineLayout) {
        size_t                     blockLen             = gpuPipelineState->gpuShader->glBlocks.size();
        const vector<vector<int>> &dynamicOffsetIndices = gpuPipelineState->gpuPipelineLayout->dynamicOffsetIndices;
        uint8_t *                  uniformBuffBase      = nullptr;
        uint8_t *                  uniformBuff;

        for (size_t j = 0; j < blockLen; j++) {
            const GLES2GPUUniformBlock &glBlock = gpuPipelineState->gpuShader->glBlocks[j];

            const GLES2GPUDescriptorSet *gpuDescriptorSet = gpuDescriptorSets[glBlock.set];
            const uint                   descriptorIndex  = gpuDescriptorSet->descriptorIndices->at(glBlock.binding);
            const GLES2GPUDescriptor &   gpuDescriptor    = gpuDescriptorSet->gpuDescriptors[descriptorIndex];

            if (!gpuDescriptor.gpuBuffer && !gpuDescriptor.gpuBufferView) {
                CC_LOG_ERROR("Buffer binding '%s' at set %d binding %d is not bounded",
                             glBlock.name.c_str(), glBlock.set, glBlock.binding);
                continue;
            }

            uint               offset                = 0U;
            const vector<int> &dynamicOffsetIndexSet = dynamicOffsetIndices[glBlock.set];
            if (dynamicOffsetIndexSet.size() > glBlock.binding) {
                int dynamicOffsetIndex = dynamicOffsetIndexSet[glBlock.binding];
                if (dynamicOffsetIndex >= 0) offset = dynamicOffsets[dynamicOffsetIndex];
            }

            if (gpuDescriptor.gpuBufferView) {
                uniformBuffBase = gpuDescriptor.gpuBufferView->gpuBuffer->buffer +
                                  gpuDescriptor.gpuBufferView->offset + offset;
            } else if (gpuDescriptor.gpuBuffer) {
                uniformBuffBase = gpuDescriptor.gpuBuffer->buffer + offset;
            }

            for (const auto &gpuUniform : glBlock.glActiveUniforms) {
                uniformBuff = uniformBuffBase + gpuUniform.offset;
                switch (gpuUniform.glType) {
                    case GL_BOOL:
                    case GL_INT: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform1iv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLint *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_BOOL_VEC2:
                    case GL_INT_VEC2: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform2iv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLint *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_BOOL_VEC3:
                    case GL_INT_VEC3: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform3iv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLint *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_BOOL_VEC4:
                    case GL_INT_VEC4: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform4iv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLint *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform1fv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_VEC2: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform2fv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_VEC3: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform3fv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_VEC4: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniform4fv(gpuUniform.glLoc, gpuUniform.count, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_MAT2: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniformMatrix2fv(gpuUniform.glLoc, gpuUniform.count, GL_FALSE, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_MAT3: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniformMatrix3fv(gpuUniform.glLoc, gpuUniform.count, GL_FALSE, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    case GL_FLOAT_MAT4: {
                        if (memcmp(gpuUniform.buff, uniformBuff, gpuUniform.size) != 0) {
                            GL_CHECK(glUniformMatrix4fv(gpuUniform.glLoc, gpuUniform.count, GL_FALSE, reinterpret_cast<const GLfloat *>(uniformBuff)));
                            memcpy(gpuUniform.buff, uniformBuff, gpuUniform.size);
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }

        size_t samplerLen = gpuPipelineState->gpuShader->glSamplerTextures.size();
        for (size_t j = 0; j < samplerLen; j++) {
            const GLES2GPUUniformSamplerTexture &glSamplerTexture = gpuPipelineState->gpuShader->glSamplerTextures[j];

            const GLES2GPUDescriptorSet *gpuDescriptorSet = gpuDescriptorSets[glSamplerTexture.set];
            const uint                   descriptorIndex  = gpuDescriptorSet->descriptorIndices->at(glSamplerTexture.binding);
            const GLES2GPUDescriptor *   gpuDescriptor    = &gpuDescriptorSet->gpuDescriptors[descriptorIndex];

            for (size_t u = 0; u < glSamplerTexture.units.size(); u++, gpuDescriptor++) {
                uint unit = static_cast<uint>(glSamplerTexture.units[u]);

                if (!gpuDescriptor->gpuTexture || !gpuDescriptor->gpuSampler) {
                    CC_LOG_ERROR(
                        "Sampler binding '%s' at set %d binding %d index %d is not bounded",
                        glSamplerTexture.name.c_str(), glSamplerTexture.set, glSamplerTexture.binding, u);
                    continue;
                }

                GLES2GPUTexture *gpuTexture = gpuDescriptor->gpuTexture;
                GLuint           glTexture  = gpuTexture->glTexture;
                CCASSERT(!gpuTexture->glRenderbuffer, "Can not sample renderbuffers!");

                if (cache->glTextures[unit] != glTexture) {
                    if (cache->texUint != unit) {
                        GL_CHECK(glActiveTexture(GL_TEXTURE0 + unit));
                        cache->texUint = unit;
                    }
                    GL_CHECK(glBindTexture(gpuTexture->glTarget, glTexture));
                    cache->glTextures[unit] = glTexture;
                }

                if (gpuDescriptor->gpuTexture->isPowerOf2) {
                    glWrapS = gpuDescriptor->gpuSampler->glWrapS;
                    glWrapT = gpuDescriptor->gpuSampler->glWrapT;

                    if (gpuDescriptor->gpuTexture->mipLevel <= 1 &&
                        !hasFlag(gpuDescriptor->gpuTexture->flags, TextureFlagBit::GEN_MIPMAP) &&
                        (gpuDescriptor->gpuSampler->glMinFilter == GL_LINEAR_MIPMAP_NEAREST ||
                         gpuDescriptor->gpuSampler->glMinFilter == GL_LINEAR_MIPMAP_LINEAR)) {
                        glMinFilter = GL_LINEAR;
                    } else {
                        glMinFilter = gpuDescriptor->gpuSampler->glMinFilter;
                    }
                } else {
                    glWrapS = GL_CLAMP_TO_EDGE;
                    glWrapT = GL_CLAMP_TO_EDGE;

                    if (gpuDescriptor->gpuSampler->glMinFilter == GL_LINEAR ||
                        gpuDescriptor->gpuSampler->glMinFilter == GL_LINEAR_MIPMAP_NEAREST ||
                        gpuDescriptor->gpuSampler->glMinFilter == GL_LINEAR_MIPMAP_LINEAR) {
                        glMinFilter = GL_LINEAR;
                    } else {
                        glMinFilter = GL_NEAREST;
                    }
                }

                if (gpuTexture->glWrapS != glWrapS) {
                    if (cache->texUint != unit) {
                        GL_CHECK(glActiveTexture(GL_TEXTURE0 + unit));
                        cache->texUint = unit;
                    }

                    GL_CHECK(glTexParameteri(gpuTexture->glTarget, GL_TEXTURE_WRAP_S, glWrapS));
                    gpuTexture->glWrapS = glWrapS;
                }

                if (gpuTexture->glWrapT != glWrapT) {
                    if (cache->texUint != unit) {
                        GL_CHECK(glActiveTexture(GL_TEXTURE0 + unit));
                        cache->texUint = unit;
                    }
                    GL_CHECK(glTexParameteri(gpuTexture->glTarget, GL_TEXTURE_WRAP_T, glWrapT));
                    gpuTexture->glWrapT = glWrapT;
                }

                if (gpuTexture->glMinFilter != glMinFilter) {
                    if (cache->texUint != unit) {
                        GL_CHECK(glActiveTexture(GL_TEXTURE0 + unit));
                        cache->texUint = unit;
                    }
                    GL_CHECK(glTexParameteri(gpuTexture->glTarget, GL_TEXTURE_MIN_FILTER, glMinFilter));
                    gpuTexture->glMinFilter = glMinFilter;
                }

                if (gpuTexture->glMagFilter != gpuDescriptor->gpuSampler->glMagFilter) {
                    if (cache->texUint != unit) {
                        GL_CHECK(glActiveTexture(GL_TEXTURE0 + unit));
                        cache->texUint = unit;
                    }
                    GL_CHECK(glTexParameteri(gpuTexture->glTarget, GL_TEXTURE_MAG_FILTER, gpuDescriptor->gpuSampler->glMagFilter));
                    gpuTexture->glMagFilter = gpuDescriptor->gpuSampler->glMagFilter;
                }
            }
        }
    } // if

    // bind vao
    if (gpuInputAssembler && gpuPipelineState && gpuPipelineState->gpuShader &&
        (isShaderChanged || gpuInputAssembler != gfxStateCache.gpuInputAssembler)) {
        gfxStateCache.gpuInputAssembler = gpuInputAssembler;
        if (device->constantRegistry()->useVAO) {
            size_t hash  = gpuPipelineState->gpuShader->glProgram ^ device->constantRegistry()->currentBoundThreadID;
            GLuint glVAO = gpuInputAssembler->glVAOs[hash];
            if (!glVAO) {
                GL_CHECK(glGenVertexArraysOES(1, &glVAO));
                gpuInputAssembler->glVAOs[hash] = glVAO;
                GL_CHECK(glBindVertexArrayOES(glVAO));
                GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
                GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));

                for (auto &gpuInput : gpuPipelineState->gpuShader->glInputs) {
                    for (size_t a = 0; a < gpuInputAssembler->attributes.size(); ++a) {
                        const GLES2GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[a];
                        if (gpuAttribute.name == gpuInput.name) {
                            GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuAttribute.glBuffer));

                            for (uint c = 0; c < gpuAttribute.componentCount; ++c) {
                                GLuint glLoc        = gpuInput.glLoc + c;
                                uint   attribOffset = gpuAttribute.offset + gpuAttribute.size * c;
                                GL_CHECK(glEnableVertexAttribArray(glLoc));

                                cache->glEnabledAttribLocs[glLoc] = true;
                                GL_CHECK(glVertexAttribPointer(glLoc, gpuAttribute.count,
                                                               gpuAttribute.glType,
                                                               gpuAttribute.isNormalized,
                                                               gpuAttribute.stride,
                                                               BUFFER_OFFSET(attribOffset)));

                                if (device->constantRegistry()->useInstancedArrays) {
                                    GL_CHECK(glVertexAttribDivisorEXT(glLoc, gpuAttribute.isInstanced ? 1 : 0));
                                }
                            }
                            break;
                        }
                    } // for
                }     // for

                if (gpuInputAssembler->gpuIndexBuffer) {
                    GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuInputAssembler->gpuIndexBuffer->glBuffer));
                }

                GL_CHECK(glBindVertexArrayOES(0));
                GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, 0));
                GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0));
                cache->glVAO                = 0;
                cache->glArrayBuffer        = 0;
                cache->glElementArrayBuffer = 0;
            }

            if (cache->glVAO != glVAO) {
                GL_CHECK(glBindVertexArrayOES(glVAO));
                cache->glVAO = glVAO;
            }
        } else {
            for (auto &&glCurrentAttribLoc : cache->glCurrentAttribLocs) {
                glCurrentAttribLoc = false;
            }

            for (auto &gpuInput : gpuPipelineState->gpuShader->glInputs) {
                for (size_t a = 0; a < gpuInputAssembler->attributes.size(); ++a) {
                    const GLES2GPUAttribute &gpuAttribute = gpuInputAssembler->glAttribs[a];
                    if (gpuAttribute.name == gpuInput.name) {
                        if (cache->glArrayBuffer != gpuAttribute.glBuffer) {
                            GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuAttribute.glBuffer));
                            cache->glArrayBuffer = gpuAttribute.glBuffer;
                        }

                        for (uint c = 0; c < gpuAttribute.componentCount; ++c) {
                            GLuint glLoc        = gpuInput.glLoc + c;
                            uint   attribOffset = gpuAttribute.offset + gpuAttribute.size * c;
                            GL_CHECK(glEnableVertexAttribArray(glLoc));
                            cache->glEnabledAttribLocs[glLoc] = true;
                            cache->glCurrentAttribLocs[glLoc] = true;
                            GL_CHECK(glVertexAttribPointer(glLoc, gpuAttribute.count,
                                                           gpuAttribute.glType,
                                                           gpuAttribute.isNormalized,
                                                           gpuAttribute.stride,
                                                           BUFFER_OFFSET(attribOffset)));

                            if (device->constantRegistry()->useInstancedArrays) {
                                GL_CHECK(glVertexAttribDivisorEXT(glLoc, gpuAttribute.isInstanced ? 1 : 0));
                            }
                        }
                        break;
                    }
                } // for
            }     // for

            if (gpuInputAssembler->gpuIndexBuffer) {
                if (cache->glElementArrayBuffer !=
                    gpuInputAssembler->gpuIndexBuffer->glBuffer) {
                    GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuInputAssembler->gpuIndexBuffer->glBuffer));
                    cache->glElementArrayBuffer = gpuInputAssembler->gpuIndexBuffer->glBuffer;
                }
            }

            for (uint a = 0; a < cache->glCurrentAttribLocs.size(); ++a) {
                if (cache->glEnabledAttribLocs[a] != cache->glCurrentAttribLocs[a]) {
                    GL_CHECK(glDisableVertexAttribArray(a));
                    cache->glEnabledAttribLocs[a] = false;
                }
            }
        }
    } // if

    if (gpuPipelineState && !gpuPipelineState->dynamicStates.empty()) {
        for (DynamicStateFlagBit dynamicState : gpuPipelineState->dynamicStates) {
            switch (dynamicState) {
                case DynamicStateFlagBit::VIEWPORT:
                    if (cache->viewport != dynamicStates->viewport) {
                        cache->viewport = dynamicStates->viewport;
                        GL_CHECK(glViewport(dynamicStates->viewport.left, dynamicStates->viewport.top,
                                            dynamicStates->viewport.width, dynamicStates->viewport.height));
                    }
                    break;
                case DynamicStateFlagBit::SCISSOR:
                    if (cache->scissor != dynamicStates->scissor) {
                        cache->scissor = dynamicStates->scissor;
                        GL_CHECK(glScissor(dynamicStates->scissor.x, dynamicStates->scissor.y,
                                           dynamicStates->scissor.width, dynamicStates->scissor.height));
                    }
                    break;
                case DynamicStateFlagBit::LINE_WIDTH:
                    if (cache->rs.lineWidth != dynamicStates->lineWidth) {
                        cache->rs.lineWidth = dynamicStates->lineWidth;
                        GL_CHECK(glLineWidth(dynamicStates->lineWidth));
                    }
                    break;
                case DynamicStateFlagBit::DEPTH_BIAS:
                    if ((cache->rs.depthBias != dynamicStates->depthBiasConstant) ||
                        (cache->rs.depthBiasSlop != dynamicStates->depthBiasSlope)) {
                        GL_CHECK(glPolygonOffset(dynamicStates->depthBiasConstant, dynamicStates->depthBiasSlope));
                        cache->rs.depthBias     = dynamicStates->depthBiasConstant;
                        cache->rs.depthBiasSlop = dynamicStates->depthBiasSlope;
                    }
                    break;
                case DynamicStateFlagBit::BLEND_CONSTANTS:
                    if ((cache->bs.blendColor.x != dynamicStates->blendConstant.x) ||
                        (cache->bs.blendColor.y != dynamicStates->blendConstant.y) ||
                        (cache->bs.blendColor.z != dynamicStates->blendConstant.z) ||
                        (cache->bs.blendColor.w != dynamicStates->blendConstant.w)) {
                        GL_CHECK(glBlendColor(dynamicStates->blendConstant.x,
                                              dynamicStates->blendConstant.y,
                                              dynamicStates->blendConstant.z,
                                              dynamicStates->blendConstant.w));
                        cache->bs.blendColor = dynamicStates->blendConstant;
                    }
                    break;
                case DynamicStateFlagBit::STENCIL_WRITE_MASK: {
                    const auto &front = dynamicStates->stencilStatesFront;
                    const auto &back  = dynamicStates->stencilStatesBack;
                    if (cache->dss.stencilWriteMaskFront != front.writeMask) {
                        GL_CHECK(glStencilMaskSeparate(GL_FRONT, front.writeMask));
                        cache->dss.stencilWriteMaskFront = front.writeMask;
                    }
                    if (cache->dss.stencilWriteMaskBack != back.writeMask) {
                        GL_CHECK(glStencilMaskSeparate(GL_BACK, back.writeMask));
                        cache->dss.stencilWriteMaskBack = back.writeMask;
                    }
                } break;
                case DynamicStateFlagBit::STENCIL_COMPARE_MASK: {
                    const auto &front = dynamicStates->stencilStatesFront;
                    const auto &back  = dynamicStates->stencilStatesBack;
                    if ((cache->dss.stencilRefFront != front.reference) ||
                        (cache->dss.stencilReadMaskFront != front.compareMask)) {
                        GL_CHECK(glStencilFuncSeparate(GL_FRONT,
                                                       GLES2_CMP_FUNCS[static_cast<uint>(cache->dss.stencilFuncFront)],
                                                       front.reference,
                                                       front.compareMask));
                        cache->dss.stencilRefFront      = front.reference;
                        cache->dss.stencilReadMaskFront = front.compareMask;
                    }
                    if ((cache->dss.stencilRefBack != back.reference) ||
                        (cache->dss.stencilReadMaskBack != back.compareMask)) {
                        GL_CHECK(glStencilFuncSeparate(GL_BACK,
                                                       GLES2_CMP_FUNCS[static_cast<uint>(cache->dss.stencilFuncBack)],
                                                       back.reference,
                                                       back.compareMask));
                        cache->dss.stencilRefBack      = back.reference;
                        cache->dss.stencilReadMaskBack = back.compareMask;
                    }
                } break;
                default:
                    CC_LOG_ERROR("Invalid dynamic states.");
                    break;
            }
        }
    }
}

void cmdFuncGLES2Draw(GLES2Device *device, const DrawInfo &drawInfo) {
    GLES2ObjectCache &      gfxStateCache     = device->stateCache()->gfxStateCache;
    GLES2GPUPipelineState * gpuPipelineState  = gfxStateCache.gpuPipelineState;
    GLES2GPUInputAssembler *gpuInputAssembler = gfxStateCache.gpuInputAssembler;
    GLenum                  glPrimitive       = gfxStateCache.glPrimitive;

    if (gpuInputAssembler && gpuPipelineState) {
        if (!gpuInputAssembler->gpuIndirectBuffer) {
            if (gpuInputAssembler->gpuIndexBuffer) {
                if (drawInfo.indexCount > 0) {
                    uint8_t *offset = nullptr;
                    offset += drawInfo.firstIndex * gpuInputAssembler->gpuIndexBuffer->stride;
                    if (drawInfo.instanceCount == 0) {
                        GL_CHECK(glDrawElements(glPrimitive, drawInfo.indexCount, gpuInputAssembler->glIndexType, offset));
                    } else {
                        if (device->constantRegistry()->useDrawInstanced) {
                            GL_CHECK(glDrawElementsInstancedEXT(glPrimitive, drawInfo.indexCount, gpuInputAssembler->glIndexType, offset, drawInfo.instanceCount));
                        }
                    }
                }
            } else if (drawInfo.vertexCount > 0) {
                if (drawInfo.instanceCount == 0) {
                    GL_CHECK(glDrawArrays(glPrimitive, drawInfo.firstIndex, drawInfo.vertexCount));
                } else {
                    if (device->constantRegistry()->useDrawInstanced) {
                        GL_CHECK(glDrawArraysInstancedEXT(glPrimitive, drawInfo.firstIndex, drawInfo.vertexCount, drawInfo.instanceCount));
                    }
                }
            }
        } else {
            for (size_t j = 0; j < gpuInputAssembler->gpuIndirectBuffer->indirects.size(); ++j) {
                const DrawInfo &draw = gpuInputAssembler->gpuIndirectBuffer->indirects[j];
                if (gpuInputAssembler->gpuIndexBuffer) {
                    if (draw.indexCount > 0) {
                        uint8_t *offset = nullptr;
                        offset += draw.firstIndex * gpuInputAssembler->gpuIndexBuffer->stride;
                        if (drawInfo.instanceCount == 0) {
                            GL_CHECK(glDrawElements(glPrimitive, draw.indexCount, gpuInputAssembler->glIndexType, offset));
                        } else {
                            if (device->constantRegistry()->useDrawInstanced) {
                                GL_CHECK(glDrawElementsInstancedEXT(glPrimitive, draw.indexCount, gpuInputAssembler->glIndexType, offset, draw.instanceCount));
                            }
                        }
                    }
                } else if (draw.vertexCount > 0) {
                    if (draw.instanceCount == 0) {
                        GL_CHECK(glDrawArrays(glPrimitive, draw.firstIndex, draw.vertexCount));
                    } else {
                        if (device->constantRegistry()->useDrawInstanced) {
                            GL_CHECK(glDrawArraysInstancedEXT(glPrimitive, draw.firstIndex, draw.vertexCount, draw.instanceCount));
                        }
                    }
                }
            }
        }
    }
}

void cmdFuncGLES2UpdateBuffer(GLES2Device *device, GLES2GPUBuffer *gpuBuffer, const void *buffer, uint offset, uint size) {
    GLES2ObjectCache &gfxStateCache = device->stateCache()->gfxStateCache;
    CCASSERT(buffer, "Buffer should not be nullptr");
    if ((hasFlag(gpuBuffer->usage, BufferUsageBit::UNIFORM)) ||
        (hasFlag(gpuBuffer->usage, BufferUsageBit::TRANSFER_SRC))) {
        memcpy(gpuBuffer->buffer + offset, buffer, size);
    } else if (hasFlag(gpuBuffer->usage, BufferUsageBit::INDIRECT)) {
        memcpy(reinterpret_cast<uint8_t *>(gpuBuffer->indirects.data()) + offset, buffer, size);
    } else {
        switch (gpuBuffer->glTarget) {
            case GL_ARRAY_BUFFER: {
                if (device->constantRegistry()->useVAO) {
                    if (device->stateCache()->glVAO) {
                        GL_CHECK(glBindVertexArrayOES(0));
                        device->stateCache()->glVAO     = 0;
                        gfxStateCache.gpuInputAssembler = nullptr;
                    }
                }
                if (device->stateCache()->glArrayBuffer != gpuBuffer->glBuffer) {
                    GL_CHECK(glBindBuffer(GL_ARRAY_BUFFER, gpuBuffer->glBuffer));
                    device->stateCache()->glArrayBuffer = gpuBuffer->glBuffer;
                }
                GL_CHECK(glBufferSubData(GL_ARRAY_BUFFER, offset, size, buffer));
                break;
            }
            case GL_ELEMENT_ARRAY_BUFFER: {
                if (device->constantRegistry()->useVAO) {
                    if (device->stateCache()->glVAO) {
                        GL_CHECK(glBindVertexArrayOES(0));
                        device->stateCache()->glVAO     = 0;
                        gfxStateCache.gpuInputAssembler = nullptr;
                    }
                }
                if (device->stateCache()->glElementArrayBuffer != gpuBuffer->glBuffer) {
                    GL_CHECK(glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, gpuBuffer->glBuffer));
                    device->stateCache()->glElementArrayBuffer = gpuBuffer->glBuffer;
                }
                GL_CHECK(glBufferSubData(GL_ELEMENT_ARRAY_BUFFER, offset, size, buffer));
                break;
            }
            default:
                CCASSERT(false, "Unsupported BufferType, update buffer failed.");
                break;
        }
    }
}

void cmdFuncGLES2CopyBuffersToTexture(GLES2Device *device, const uint8_t *const *buffers,
                                      GLES2GPUTexture *gpuTexture, const BufferTextureCopy *regions, uint count) {
    GLuint &glTexture = device->stateCache()->glTextures[device->stateCache()->texUint];
    if (glTexture != gpuTexture->glTexture) {
        GL_CHECK(glBindTexture(gpuTexture->glTarget, gpuTexture->glTexture));
        glTexture = gpuTexture->glTexture;
    }

    bool isCompressed = GFX_FORMAT_INFOS[static_cast<int>(gpuTexture->format)].isCompressed;
    uint n            = 0;

    switch (gpuTexture->glTarget) {
        case GL_TEXTURE_2D: {
            uint w;
            uint h;
            for (size_t i = 0; i < count; ++i) {
                const BufferTextureCopy &region = regions[i];
                w                               = region.texExtent.width;
                h                               = region.texExtent.height;
                const uint8_t *buff             = buffers[n++];
                if (isCompressed) {
                    auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, w, h, 1));
                    GL_CHECK(glCompressedTexSubImage2D(GL_TEXTURE_2D,
                                                       region.texSubres.mipLevel,
                                                       region.texOffset.x,
                                                       region.texOffset.y,
                                                       w, h,
                                                       gpuTexture->glFormat,
                                                       memSize,
                                                       (GLvoid *)buff));
                } else {
                    GL_CHECK(glTexSubImage2D(GL_TEXTURE_2D,
                                             region.texSubres.mipLevel,
                                             region.texOffset.x,
                                             region.texOffset.y,
                                             w, h,
                                             gpuTexture->glFormat,
                                             gpuTexture->glType,
                                             (GLvoid *)buff));
                }
            }
            break;
        }
        case GL_TEXTURE_2D_ARRAY: {
            uint w;
            uint h;
            for (size_t i = 0; i < count; ++i) {
                const BufferTextureCopy &region     = regions[i];
                uint                     d          = region.texSubres.layerCount;
                uint                     layerCount = d + region.texSubres.baseArrayLayer;

                for (uint z = region.texSubres.baseArrayLayer; z < layerCount; ++z) {
                    w                   = region.texExtent.width;
                    h                   = region.texExtent.height;
                    const uint8_t *buff = buffers[n++];
                    if (isCompressed) {
                        auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, w, h, 1));
                        GL_CHECK(glCompressedTexSubImage3DOES(GL_TEXTURE_2D_ARRAY,
                                                              region.texSubres.mipLevel,
                                                              region.texOffset.x,
                                                              region.texOffset.y, z,
                                                              w, h, d,
                                                              gpuTexture->glFormat,
                                                              memSize,
                                                              (GLvoid *)buff));
                    } else {
                        GL_CHECK(glTexSubImage3DOES(GL_TEXTURE_2D_ARRAY,
                                                    region.texSubres.mipLevel,
                                                    region.texOffset.x,
                                                    region.texOffset.y,
                                                    z,
                                                    w, h, d,
                                                    gpuTexture->glFormat,
                                                    gpuTexture->glType,
                                                    (GLvoid *)buff));
                    }
                }
            }
            break;
        }
        case GL_TEXTURE_3D: {
            uint w;
            uint h;
            uint d;
            for (size_t i = 0; i < count; ++i) {
                const BufferTextureCopy &region = regions[i];
                w                               = region.texExtent.width;
                h                               = region.texExtent.height;
                d                               = region.texExtent.depth;
                const uint8_t *buff             = buffers[n++];
                if (isCompressed) {
                    auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, w, h, 1));
                    GL_CHECK(glCompressedTexSubImage3DOES(GL_TEXTURE_3D,
                                                          region.texSubres.mipLevel,
                                                          region.texOffset.x,
                                                          region.texOffset.y,
                                                          region.texOffset.z,
                                                          w, h, d,
                                                          gpuTexture->glFormat,
                                                          memSize,
                                                          (GLvoid *)buff));
                } else {
                    GL_CHECK(glTexSubImage3DOES(GL_TEXTURE_3D,
                                                region.texSubres.mipLevel,
                                                region.texOffset.x,
                                                region.texOffset.y,
                                                region.texOffset.z,
                                                w, h, d,
                                                gpuTexture->glFormat,
                                                gpuTexture->glType,
                                                (GLvoid *)buff));
                }
            }
            break;
        }
        case GL_TEXTURE_CUBE_MAP: {
            uint w;
            uint h;
            uint f;
            for (size_t i = 0; i < count; ++i) {
                const BufferTextureCopy &region    = regions[i];
                uint                     faceCount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < faceCount; ++f) {
                    w                   = region.texExtent.width;
                    h                   = region.texExtent.height;
                    const uint8_t *buff = buffers[n++];
                    if (isCompressed) {
                        auto memSize = static_cast<GLsizei>(formatSize(gpuTexture->format, w, h, 1));
                        GL_CHECK(glCompressedTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f,
                                                           region.texSubres.mipLevel,
                                                           region.texOffset.x,
                                                           region.texOffset.y,
                                                           w, h,
                                                           gpuTexture->glFormat,
                                                           memSize,
                                                           (GLvoid *)buff));
                    } else {
                        GL_CHECK(glTexSubImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + f,
                                                 region.texSubres.mipLevel,
                                                 region.texOffset.x, region.texOffset.y,
                                                 w, h,
                                                 gpuTexture->glFormat,
                                                 gpuTexture->glType,
                                                 (GLvoid *)buff));
                    }
                }
            }
            break;
        }
        default:
            CCASSERT(false, "Unsupported TextureType, copy buffers to texture failed.");
            break;
    }

    if (!isCompressed && hasFlag(gpuTexture->flags, TextureFlagBit::GEN_MIPMAP)) {
        GL_CHECK(glBindTexture(gpuTexture->glTarget, gpuTexture->glTexture));
        GL_CHECK(glGenerateMipmap(gpuTexture->glTarget));
    }
}

void cmdFuncGLES2BlitTexture(GLES2Device *device, GLES2GPUTexture *gpuTextureSrc, GLES2GPUTexture *gpuTextureDst, const TextureBlit *regions, uint count, Filter filter) {
    GLES2GPUStateCache *cache = device->stateCache();

    GLuint dstFramebuffer = 0U;
    if (gpuTextureDst) {
        dstFramebuffer = device->framebufferCacheMap()->getFramebufferFromTexture(gpuTextureDst);
    } else {
        dstFramebuffer = device->constantRegistry()->defaultFramebuffer;
    }
    if (cache->glFramebuffer != dstFramebuffer) {
        GL_CHECK(glBindFramebuffer(GL_FRAMEBUFFER, dstFramebuffer));
        cache->glFramebuffer = dstFramebuffer;
    }

    device->blitManager()->draw(gpuTextureSrc, gpuTextureDst, regions, count, filter);
}

void cmdFuncGLES2ExecuteCmds(GLES2Device *device, GLES2CmdPackage *cmdPackage) {
    if (!cmdPackage->cmds.size()) return;

    static uint cmdIndices[static_cast<int>(GLESCmdType::COUNT)] = {0};
    memset(cmdIndices, 0, sizeof(cmdIndices));

    for (uint i = 0; i < cmdPackage->cmds.size(); ++i) {
        GLESCmdType cmdType = cmdPackage->cmds[i];
        uint &      cmdIdx  = cmdIndices[static_cast<int>(cmdType)];

        switch (cmdType) {
            case GLESCmdType::BEGIN_RENDER_PASS: {
                GLES2CmdBeginRenderPass *cmd = cmdPackage->beginRenderPassCmds[cmdIdx];
                cmdFuncGLES2BeginRenderPass(device, cmd->subpassIdx, cmd->gpuRenderPass, cmd->gpuFBO, &cmd->renderArea, cmd->clearColors, cmd->clearDepth, cmd->clearStencil);
                break;
            }
            case GLESCmdType::END_RENDER_PASS: {
                cmdFuncGLES2EndRenderPass(device);
                break;
            }
            case GLESCmdType::BIND_STATES: {
                GLES2CmdBindStates *cmd = cmdPackage->bindStatesCmds[cmdIdx];
                cmdFuncGLES2BindState(device, cmd->gpuPipelineState, cmd->gpuInputAssembler, cmd->gpuDescriptorSets.data(), cmd->dynamicOffsets.data(), &cmd->dynamicStates);
                break;
            }
            case GLESCmdType::DRAW: {
                GLES2CmdDraw *cmd = cmdPackage->drawCmds[cmdIdx];
                cmdFuncGLES2Draw(device, cmd->drawInfo);
                break;
            }
            case GLESCmdType::UPDATE_BUFFER: {
                GLES2CmdUpdateBuffer *cmd = cmdPackage->updateBufferCmds[cmdIdx];
                cmdFuncGLES2UpdateBuffer(device, cmd->gpuBuffer, cmd->buffer, cmd->offset, cmd->size);
                break;
            }
            case GLESCmdType::COPY_BUFFER_TO_TEXTURE: {
                GLES2CmdCopyBufferToTexture *cmd = cmdPackage->copyBufferToTextureCmds[cmdIdx];
                cmdFuncGLES2CopyBuffersToTexture(device, cmd->buffers, cmd->gpuTexture, cmd->regions, cmd->count);
                break;
            }
            case GLESCmdType::BLIT_TEXTURE: {
                GLES2CmdBlitTexture *cmd = cmdPackage->blitTextureCmds[cmdIdx];
                cmdFuncGLES2BlitTexture(device, cmd->gpuTextureSrc, cmd->gpuTextureDst, cmd->regions, cmd->count, cmd->filter);
                break;
            }
            default:
                break;
        }
        cmdIdx++;
    }
}

void GLES2GPUBlitManager::initialize() {
    _gpuShader.name = "Blit Pass";
    _gpuShader.blocks.push_back({
        0,
        0,
        "BlitParams",
        {
            {"tilingOffsetSrc", Type::FLOAT4, 1},
            {"tilingOffsetDst", Type::FLOAT4, 1},
        },
        1,
    });
    _gpuShader.samplerTextures.push_back({0, 1, "textureSrc", Type::SAMPLER2D, 1});
    _gpuShader.gpuStages.push_back({ShaderStageFlagBit::VERTEX, R"(
        precision mediump float;

        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        uniform vec4 tilingOffsetSrc;
        uniform vec4 tilingOffsetDst;

        varying vec2 v_texCoord;

        void main() {
            v_texCoord = a_texCoord * tilingOffsetSrc.xy + tilingOffsetSrc.zw;
            gl_Position = vec4((a_position + 1.0) * tilingOffsetDst.xy - 1.0 + tilingOffsetDst.zw * 2.0, 0, 1);
        }
    )"});
    _gpuShader.gpuStages.push_back({ShaderStageFlagBit::FRAGMENT, R"(
        precision mediump float;

        uniform sampler2D textureSrc;

        varying vec2 v_texCoord;

        void main() {
            gl_FragColor = texture2D(textureSrc, v_texCoord);
        }
    )"});
    cmdFuncGLES2CreateShader(GLES2Device::getInstance(), &_gpuShader);

    _gpuDescriptorSetLayout.descriptorCount   = 2;
    _gpuDescriptorSetLayout.bindingIndices    = {0, 1};
    _gpuDescriptorSetLayout.descriptorIndices = {0, 1};
    _gpuDescriptorSetLayout.bindings.push_back({0, DescriptorType::UNIFORM_BUFFER, 1, ShaderStageFlagBit::VERTEX});
    _gpuDescriptorSetLayout.bindings.push_back({1, DescriptorType::SAMPLER_TEXTURE, 1, ShaderStageFlagBit::FRAGMENT});

    _gpuPipelineLayout.setLayouts.push_back(&_gpuDescriptorSetLayout);
    _gpuPipelineLayout.dynamicOffsetIndices.emplace_back();
    _gpuPipelineLayout.dynamicOffsetOffsets.push_back(0);

    _gpuPipelineState.glPrimitive       = GL_TRIANGLE_STRIP;
    _gpuPipelineState.gpuShader         = &_gpuShader;
    _gpuPipelineState.dss.depthTest     = false;
    _gpuPipelineState.dss.depthWrite    = false;
    _gpuPipelineState.gpuPipelineLayout = &_gpuPipelineLayout;

    _gpuVertexBuffer.usage    = BufferUsage::VERTEX;
    _gpuVertexBuffer.memUsage = MemoryUsage::DEVICE;
    _gpuVertexBuffer.size     = 16 * sizeof(float);
    _gpuVertexBuffer.stride   = 4 * sizeof(float);
    _gpuVertexBuffer.count    = 4;
    cmdFuncGLES2CreateBuffer(GLES2Device::getInstance(), &_gpuVertexBuffer);
    float data[]{
        -1.F, -1.F, 0.F, 0.F,
        1.F, -1.F, 1.F, 0.F,
        -1.F, 1.F, 0.F, 1.F,
        1.F, 1.F, 1.F, 1.F};
    cmdFuncGLES2UpdateBuffer(GLES2Device::getInstance(), &_gpuVertexBuffer, data, 0, sizeof(data));

    _gpuInputAssembler.attributes.push_back({"a_position", Format::RG32F});
    _gpuInputAssembler.attributes.push_back({"a_texCoord", Format::RG32F});
    _gpuInputAssembler.gpuVertexBuffers.push_back(&_gpuVertexBuffer);
    cmdFuncGLES2CreateInputAssembler(GLES2Device::getInstance(), &_gpuInputAssembler);

    _gpuPointSampler.minFilter = Filter::POINT;
    _gpuPointSampler.magFilter = Filter::POINT;
    cmdFuncGLES2CreateSampler(GLES2Device::getInstance(), &_gpuPointSampler);

    _gpuLinearSampler.minFilter = Filter::LINEAR;
    _gpuLinearSampler.magFilter = Filter::LINEAR;
    cmdFuncGLES2CreateSampler(GLES2Device::getInstance(), &_gpuLinearSampler);

    _gpuUniformBuffer.usage    = BufferUsage::UNIFORM;
    _gpuUniformBuffer.memUsage = MemoryUsage::DEVICE | MemoryUsage::HOST;
    _gpuUniformBuffer.size     = 8 * sizeof(float);
    _gpuUniformBuffer.stride   = 8 * sizeof(float);
    _gpuUniformBuffer.count    = 1;
    cmdFuncGLES2CreateBuffer(GLES2Device::getInstance(), &_gpuUniformBuffer);

    _gpuDescriptorSet.gpuDescriptors.push_back({DescriptorType::UNIFORM_BUFFER, &_gpuUniformBuffer});
    _gpuDescriptorSet.gpuDescriptors.push_back({DescriptorType::SAMPLER_TEXTURE});
    _gpuDescriptorSet.descriptorIndices = &_gpuDescriptorSetLayout.descriptorIndices;

    _drawInfo.vertexCount = 4;
}

void GLES2GPUBlitManager::destroy() {
    GLES2Device *device = GLES2Device::getInstance();
    cmdFuncGLES2DestroyBuffer(device, &_gpuVertexBuffer);
    cmdFuncGLES2DestroyInputAssembler(device, &_gpuInputAssembler);
    cmdFuncGLES2DestroySampler(device, &_gpuPointSampler);
    cmdFuncGLES2DestroySampler(device, &_gpuLinearSampler);
    cmdFuncGLES2DestroyBuffer(device, &_gpuVertexBuffer);
    cmdFuncGLES2DestroyShader(device, &_gpuShader);
}

void GLES2GPUBlitManager::draw(GLES2GPUTexture *gpuTextureSrc, GLES2GPUTexture *gpuTextureDst,
                               const TextureBlit *regions, uint count, Filter filter) {
    GLES2GPUDescriptorSet *gpuDescriptorSet = &_gpuDescriptorSet;
    GLES2Device *          device           = GLES2Device::getInstance();
    auto &                 descriptor       = _gpuDescriptorSet.gpuDescriptors.back();

    descriptor.gpuTexture = gpuTextureSrc;
    descriptor.gpuSampler = filter == Filter::POINT ? &_gpuPointSampler : &_gpuLinearSampler;
    for (uint i = 0U; i < count; ++i) {
        const auto &region = regions[i];

        auto srcWidth  = static_cast<float>(gpuTextureSrc ? gpuTextureSrc->width : device->getWidth());
        auto srcHeight = static_cast<float>(gpuTextureSrc ? gpuTextureSrc->height : device->getHeight());
        auto dstWidth  = static_cast<float>(gpuTextureDst ? gpuTextureDst->width : device->getWidth());
        auto dstHeight = static_cast<float>(gpuTextureDst ? gpuTextureDst->height : device->getHeight());

        _uniformBuffer[0] = static_cast<float>(region.srcExtent.width) / srcWidth;
        _uniformBuffer[1] = static_cast<float>(region.srcExtent.height) / srcHeight;
        _uniformBuffer[2] = static_cast<float>(region.srcOffset.x) / srcWidth;
        _uniformBuffer[3] = static_cast<float>(region.srcOffset.y) / srcHeight;
        _uniformBuffer[4] = static_cast<float>(region.dstExtent.width) / dstWidth;
        _uniformBuffer[5] = static_cast<float>(region.dstExtent.height) / dstHeight;
        _uniformBuffer[6] = static_cast<float>(region.dstOffset.x) / dstWidth;
        _uniformBuffer[7] = static_cast<float>(region.dstOffset.y) / dstHeight;

        cmdFuncGLES2UpdateBuffer(device, &_gpuUniformBuffer, _uniformBuffer, 0, sizeof(_uniformBuffer));
        cmdFuncGLES2BindState(device, &_gpuPipelineState, &_gpuInputAssembler, &gpuDescriptorSet);
        cmdFuncGLES2Draw(device, _drawInfo);
    }
}

} // namespace gfx
} // namespace cc
