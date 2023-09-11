/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include <webgpu/webgpu.h>
#include "base/std/container/vector.h"
#include "cocos/base/Macros.h"
#include "cocos/base/TypeDef.h"
#include "gfx-base/GFXDef-common.h"
namespace cc {
namespace gfx {

static WGPULoadOp toWGPULoadOp(LoadOp op) {
    switch (op) {
        case LoadOp::CLEAR:
            return WGPULoadOp::WGPULoadOp_Clear;
        case LoadOp::LOAD:
            return WGPULoadOp::WGPULoadOp_Load;
        case LoadOp::DISCARD:
            return WGPULoadOp::WGPULoadOp_Clear;
        default:
            return WGPULoadOp::WGPULoadOp_Force32;
    }
}

static WGPUStoreOp toWGPUStoreOp(StoreOp op) {
    switch (op) {
        case StoreOp::STORE:
            return WGPUStoreOp::WGPUStoreOp_Store;
        case StoreOp::DISCARD:
            return WGPUStoreOp::WGPUStoreOp_Discard;
        default:
            return WGPUStoreOp::WGPUStoreOp_Discard;
    }
}

static WGPUTextureUsageFlags toWGPUTextureUsage(TextureUsage usage) {
    if (usage == TextureUsageBit::NONE)
        return WGPUTextureUsage::WGPUTextureUsage_CopyDst;

    WGPUTextureUsageFlags res = WGPUTextureUsage::WGPUTextureUsage_None;
    if (hasFlag(usage, TextureUsageBit::TRANSFER_SRC)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_CopySrc;
    }
    if (hasFlag(usage, TextureUsageBit::TRANSFER_DST)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_CopyDst;
    }
    if (hasFlag(usage, TextureUsageBit::SAMPLED)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_TextureBinding;
    }
    if (hasFlag(usage, TextureUsageBit::STORAGE)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_StorageBinding;
    }
    if (hasFlag(usage, TextureUsageBit::INPUT_ATTACHMENT)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_TextureBinding;
    }
    if (hasFlag(usage, TextureUsageBit::COLOR_ATTACHMENT)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_RenderAttachment;
    }
    if (hasFlag(usage, TextureUsageBit::DEPTH_STENCIL_ATTACHMENT)) {
        res |= WGPUTextureUsage::WGPUTextureUsage_RenderAttachment;
    }
    // TODO_Zeqiang: unexpected texture copy in pipeline.
    // if (!hasFlag(usage, TextureUsageBit::TRANSFER_DST))
    //     res |= WGPUTextureUsage::WGPUTextureUsage_CopyDst;

    return res;
}

static WGPUTextureDimension toWGPUTextureDimension(TextureType type) {
    switch (type) {
        case TextureType::TEX1D:
        case TextureType::TEX1D_ARRAY:
            return WGPUTextureDimension::WGPUTextureDimension_1D;
        case TextureType::TEX2D:
        case TextureType::TEX2D_ARRAY:
        case TextureType::CUBE:
            return WGPUTextureDimension::WGPUTextureDimension_2D;
        case TextureType::TEX3D:
            return WGPUTextureDimension::WGPUTextureDimension_3D;
        default:
            printf("Unsupport type: %d\n", static_cast<int>(type));
            return WGPUTextureDimension::WGPUTextureDimension_Force32;
    }
}

static WGPUTextureViewDimension toWGPUTextureViewDimension(TextureType type) {
    switch (type) {
        case TextureType::TEX1D:
        case TextureType::TEX1D_ARRAY:
            return WGPUTextureViewDimension::WGPUTextureViewDimension_1D;
        case TextureType::TEX2D:
            return WGPUTextureViewDimension::WGPUTextureViewDimension_2D;
        case TextureType::TEX2D_ARRAY:
            return WGPUTextureViewDimension::WGPUTextureViewDimension_2DArray;
        case TextureType::CUBE:
            return WGPUTextureViewDimension::WGPUTextureViewDimension_Cube;
        case TextureType::TEX3D:
            return WGPUTextureViewDimension::WGPUTextureViewDimension_3D;
        default:
            printf("Unsupport type %d\n", static_cast<int>(type));
            return WGPUTextureViewDimension::WGPUTextureViewDimension_Undefined;
    }
}

static WGPUTextureSampleType textureSampleTypeTrait(Format format) {
    switch (format) {
        case Format::R8:
        case Format::R8SN:
        case Format::RG8:
        case Format::RGBA8:
        case Format::BGRA8:
        case Format::RG8SN:
        case Format::SRGB8_A8:
        case Format::RGB10A2:
        case Format::RGBA16F:
            return WGPUTextureSampleType::WGPUTextureSampleType_Float;
        case Format::R8UI:
        case Format::R16UI:
        case Format::RG8UI:
        case Format::R32UI:
        case Format::RG16UI:
        case Format::RGBA8UI:
        case Format::RG32UI:
        case Format::RGBA32UI:
        case Format::RGBA16UI:
        case Format::DEPTH_STENCIL:
            return WGPUTextureSampleType::WGPUTextureSampleType_Uint;
        case Format::R8I:
        case Format::R16I:
        case Format::RG8I:
        case Format::RG16I:
        case Format::RGBA8I:
        case Format::RG32I:
        case Format::RGBA16I:
        case Format::RGBA32I:
        case Format::R32I:
            return WGPUTextureSampleType::WGPUTextureSampleType_Sint;
        case Format::R16F:
        case Format::R32F:
        case Format::RG16F:
        case Format::R11G11B10F:
        case Format::RG32F:
        case Format::RGBA32F:
            return WGPUTextureSampleType::WGPUTextureSampleType_UnfilterableFloat;
        case Format::DEPTH:
            return WGPUTextureSampleType::WGPUTextureSampleType_Depth;
        default:
            printf("Unsupport texture sample type yet, github@hana-alice to fix.\n");
            return WGPUTextureSampleType::WGPUTextureSampleType_Undefined;
    }
}

static bool isFilterable(Format format) {
    return textureSampleTypeTrait(format) != WGPUTextureSampleType_UnfilterableFloat;
}

static WGPUTextureAspect textureAspectTrait(Format format) {
    switch (format) {
        case Format::DEPTH:
            return WGPUTextureAspect_DepthOnly;
        case Format::DEPTH_STENCIL:
            return WGPUTextureAspect_All;
        default:
            return WGPUTextureAspect_All;
    }
}

static WGPUTextureFormat toWGPUTextureFormat(Format format) {
    switch (format) {
        case Format::UNKNOWN:
            return WGPUTextureFormat::WGPUTextureFormat_Undefined;
        case Format::R8:
            return WGPUTextureFormat::WGPUTextureFormat_R8Unorm;
        case Format::R8SN:
            return WGPUTextureFormat::WGPUTextureFormat_R8Snorm;
        case Format::R8UI:
            return WGPUTextureFormat::WGPUTextureFormat_R8Uint;
        case Format::R8I:
            return WGPUTextureFormat::WGPUTextureFormat_R8Sint;
        case Format::R16UI:
            return WGPUTextureFormat::WGPUTextureFormat_R16Uint;
        case Format::R16I:
            return WGPUTextureFormat::WGPUTextureFormat_R16Sint;
        case Format::R16F:
            return WGPUTextureFormat::WGPUTextureFormat_R16Float;
        case Format::RG8:
            return WGPUTextureFormat::WGPUTextureFormat_RG8Unorm;
        case Format::RG8SN:
            return WGPUTextureFormat::WGPUTextureFormat_RG8Snorm;
        case Format::RG8UI:
            return WGPUTextureFormat::WGPUTextureFormat_RG8Uint;
        case Format::RG8I:
            return WGPUTextureFormat::WGPUTextureFormat_RG8Sint;
        case Format::R32F:
            return WGPUTextureFormat::WGPUTextureFormat_R32Float;
        case Format::R32UI:
            return WGPUTextureFormat::WGPUTextureFormat_R32Uint;
        case Format::R32I:
            return WGPUTextureFormat::WGPUTextureFormat_R32Sint;
        case Format::RG16UI:
            return WGPUTextureFormat::WGPUTextureFormat_RG16Uint;
        case Format::RG16I:
            return WGPUTextureFormat::WGPUTextureFormat_RG16Sint;
        case Format::RG16F:
            return WGPUTextureFormat::WGPUTextureFormat_RG16Float;
        case Format::RGBA8:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA8Unorm;
        case Format::SRGB8_A8:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA8UnormSrgb;
        case Format::RGBA8SN:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA8Snorm;
        case Format::RGBA8UI:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA8Uint;
        case Format::RGBA8I:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA8Sint;
        case Format::BGRA8:
            return WGPUTextureFormat::WGPUTextureFormat_BGRA8Unorm;
        case Format::RGB10A2:
            return WGPUTextureFormat::WGPUTextureFormat_RGB10A2Unorm;
        case Format::R11G11B10F:
            return WGPUTextureFormat::WGPUTextureFormat_RG11B10Ufloat;
        case Format::RGB9E5:
            return WGPUTextureFormat::WGPUTextureFormat_RGB9E5Ufloat;
        case Format::RG32F:
            return WGPUTextureFormat::WGPUTextureFormat_RG32Float;
        case Format::RG32UI:
            return WGPUTextureFormat::WGPUTextureFormat_RG32Uint;
        case Format::RG32I:
            return WGPUTextureFormat::WGPUTextureFormat_RG32Sint;
        case Format::RGBA16UI:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA16Uint;
        case Format::RGBA16I:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA16Sint;
        case Format::RGBA16F:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA16Float;
        case Format::RGBA32F:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA32Float;
        case Format::RGBA32UI:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA32Uint;
        case Format::RGBA32I:
            return WGPUTextureFormat::WGPUTextureFormat_RGBA32Sint;
        case Format::DEPTH:
            return WGPUTextureFormat::WGPUTextureFormat_Depth24Plus;
        case Format::DEPTH_STENCIL:
            return WGPUTextureFormat::WGPUTextureFormat_Depth24PlusStencil8;
        case Format::BC1:
            return WGPUTextureFormat::WGPUTextureFormat_BC1RGBAUnorm;
        case Format::BC1_SRGB:
            return WGPUTextureFormat::WGPUTextureFormat_BC1RGBAUnormSrgb;
        case Format::BC2:
            return WGPUTextureFormat::WGPUTextureFormat_BC2RGBAUnorm;
        case Format::BC2_SRGB:
            return WGPUTextureFormat::WGPUTextureFormat_BC2RGBAUnormSrgb;
        case Format::BC3:
            return WGPUTextureFormat::WGPUTextureFormat_BC3RGBAUnorm;
        case Format::BC4:
            return WGPUTextureFormat::WGPUTextureFormat_BC4RUnorm;
        case Format::BC4_SNORM:
            return WGPUTextureFormat::WGPUTextureFormat_BC4RSnorm;
        case Format::BC5:
            return WGPUTextureFormat::WGPUTextureFormat_BC5RGUnorm;
        case Format::BC5_SNORM:
            return WGPUTextureFormat::WGPUTextureFormat_BC5RGSnorm;
        case Format::BC6H_UF16:
            return WGPUTextureFormat::WGPUTextureFormat_BC6HRGBUfloat;
        case Format::BC6H_SF16:
            return WGPUTextureFormat::WGPUTextureFormat_BC6HRGBFloat;
        case Format::BC7:
            return WGPUTextureFormat::WGPUTextureFormat_BC7RGBAUnorm;
        case Format::BC7_SRGB:
            return WGPUTextureFormat::WGPUTextureFormat_BC7RGBAUnormSrgb;
        default:
            printf("Unsupport WebGPU texture format %d\n", static_cast<int>(format));
            return WGPUTextureFormat::WGPUTextureFormat_Force32;
    }
}

static WGPUAddressMode toWGPUAddressMode(Address addrMode) {
    switch (addrMode) {
        case Address::WRAP:
            return WGPUAddressMode::WGPUAddressMode_Repeat;
        case Address::CLAMP:
            return WGPUAddressMode::WGPUAddressMode_ClampToEdge;
        case Address::BORDER:
            return WGPUAddressMode::WGPUAddressMode_ClampToEdge;
        case Address::MIRROR:
            return WGPUAddressMode::WGPUAddressMode_MirrorRepeat;
    }
}

static WGPUMipmapFilterMode toWGPUMipmapFilterMode(Filter filter) {
    switch (filter) {
        case Filter::NONE:
            return WGPUMipmapFilterMode::WGPUMipmapFilterMode_Nearest;
        case Filter::POINT:
            return WGPUMipmapFilterMode::WGPUMipmapFilterMode_Nearest;
        case Filter::LINEAR:
            return WGPUMipmapFilterMode::WGPUMipmapFilterMode_Linear;
        case Filter::ANISOTROPIC:
            return WGPUMipmapFilterMode::WGPUMipmapFilterMode_Linear;
    }
}

static WGPUFilterMode toWGPUFilterMode(Filter filter) {
    switch (filter) {
        case Filter::NONE:
            return WGPUFilterMode::WGPUFilterMode_Nearest;
        case Filter::POINT:
            return WGPUFilterMode::WGPUFilterMode_Nearest;
        case Filter::LINEAR:
            return WGPUFilterMode::WGPUFilterMode_Linear;
        case Filter::ANISOTROPIC:
            return WGPUFilterMode::WGPUFilterMode_Linear;
    }
}

static WGPUCompareFunction toWGPUCompareFunction(ComparisonFunc compareFunc) {
    switch (compareFunc) {
        case ComparisonFunc::NEVER:
            return WGPUCompareFunction::WGPUCompareFunction_Never;
        case ComparisonFunc::LESS:
            return WGPUCompareFunction::WGPUCompareFunction_Less;
        case ComparisonFunc::EQUAL:
            return WGPUCompareFunction::WGPUCompareFunction_Equal;
        case ComparisonFunc::LESS_EQUAL:
            return WGPUCompareFunction::WGPUCompareFunction_LessEqual;
        case ComparisonFunc::GREATER:
            return WGPUCompareFunction::WGPUCompareFunction_Greater;
        case ComparisonFunc::NOT_EQUAL:
            return WGPUCompareFunction::WGPUCompareFunction_NotEqual;
        case ComparisonFunc::GREATER_EQUAL:
            return WGPUCompareFunction::WGPUCompareFunction_GreaterEqual;
        case ComparisonFunc::ALWAYS:
            return WGPUCompareFunction::WGPUCompareFunction_Always;
        default:
            printf("Unsupport compareFunc: %d\n", static_cast<int>(compareFunc));
            return WGPUCompareFunction::WGPUCompareFunction_Force32;
    }
}

static WGPUStencilOperation toWGPUStencilOperation(StencilOp stencilOp) {
    switch (stencilOp) {
        case StencilOp::ZERO:
            return WGPUStencilOperation::WGPUStencilOperation_Zero;
        case StencilOp::KEEP:
            return WGPUStencilOperation::WGPUStencilOperation_Keep;
        case StencilOp::REPLACE:
            return WGPUStencilOperation::WGPUStencilOperation_Replace;
        case StencilOp::INCR:
            return WGPUStencilOperation::WGPUStencilOperation_IncrementClamp;
        case StencilOp::DECR:
            return WGPUStencilOperation::WGPUStencilOperation_DecrementClamp;
        case StencilOp::INVERT:
            return WGPUStencilOperation::WGPUStencilOperation_Invert;
        case StencilOp::INCR_WRAP:
            return WGPUStencilOperation::WGPUStencilOperation_IncrementWrap;
        case StencilOp::DECR_WRAP:
            return WGPUStencilOperation::WGPUStencilOperation_DecrementWrap;
        default:
            return WGPUStencilOperation::WGPUStencilOperation_Force32;
    }
}

static WGPUShaderStageFlags toWGPUShaderStageFlag(ShaderStageFlagBit flag) {
    WGPUShaderStageFlags result = WGPUShaderStage::WGPUShaderStage_None;
    if (flag == ShaderStageFlagBit::NONE) {
        return WGPUShaderStage_None;
    }

    if (flag == ShaderStageFlagBit::ALL || hasFlag(flag, ShaderStageFlagBit::VERTEX)) {
        result |= WGPUShaderStage::WGPUShaderStage_Vertex;
    }

    if (flag == ShaderStageFlagBit::ALL || hasFlag(flag, ShaderStageFlagBit::FRAGMENT)) {
        result |= WGPUShaderStage::WGPUShaderStage_Fragment;
    }

    if (flag == ShaderStageFlagBit::ALL || hasFlag(flag, ShaderStageFlagBit::COMPUTE)) {
        result |= WGPUShaderStage::WGPUShaderStage_Compute;
    }

    if (result == WGPUShaderStage_None) {
        printf("Unsupport shader stage detected\n");
    }
    return result;
}

// TODO_Zeqiang: more flexible strategy
static uint32_t toWGPUSampleCount(SampleCount sampleCount) {
    return static_cast<uint32_t>(sampleCount);
}

// NONE         = 0,
// TRANSFER_SRC = 0x1,
// TRANSFER_DST = 0x2,
// INDEX        = 0x4,
// VERTEX       = 0x8,
// UNIFORM      = 0x10,
// STORAGE      = 0x20,
// INDIRECT     = 0x40,

static WGPUBufferUsageFlags toWGPUBufferUsage(BufferUsageBit usage) {
    if (usage == BufferUsageBit::NONE) {
        return WGPUBufferUsage::WGPUBufferUsage_Uniform | WGPUBufferUsage_CopyDst;
    }

    WGPUBufferUsageFlags res = WGPUBufferUsage::WGPUBufferUsage_None;

    if (hasFlag(usage, BufferUsageBit::TRANSFER_SRC)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_CopySrc;
    }

    if (hasFlag(usage, BufferUsageBit::TRANSFER_DST)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_CopyDst;
    }

    if (hasFlag(usage, BufferUsageBit::INDEX)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_Index;
    }

    if (hasFlag(usage, BufferUsageBit::VERTEX)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_Vertex;
    }

    if (hasFlag(usage, BufferUsageBit::UNIFORM)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_Uniform;
    }

    if (hasFlag(usage, BufferUsageBit::STORAGE)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_Storage;
    }

    if (hasFlag(usage, BufferUsageBit::INDIRECT)) {
        res |= WGPUBufferUsage::WGPUBufferUsage_Indirect;
    }

    // FIXME: depend on inputs but vertexbuffer was updated without COPY_DST.
    res |= WGPUBufferUsage::WGPUBufferUsage_CopyDst;

    return res;
}

static WGPUColor toWGPUColor(const Color& color) {
    return WGPUColor{color.x, color.y, color.z, color.w};
}

static WGPUVertexFormat toWGPUVertexFormat(Format format) {
    switch (format) {
        case Format::UNKNOWN:
            return WGPUVertexFormat_Undefined;
        case Format::RG8:
            return WGPUVertexFormat_Unorm8x2;
        case Format::RG8UI:
            return WGPUVertexFormat_Uint8x2;
        case Format::RG8I:
            return WGPUVertexFormat_Sint8x2;
        case Format::RG8SN:
            return WGPUVertexFormat_Snorm8x2;
        case Format::RGBA8:
        case Format::BGRA8:
            return WGPUVertexFormat_Unorm8x4;
        case Format::RGBA8UI:
            return WGPUVertexFormat_Uint8x4;
        case Format::SRGB8_A8:
        case Format::RGBA8I:
            return WGPUVertexFormat_Sint8x4;
        case Format::RGBA8SN:
            return WGPUVertexFormat_Snorm8x4;
        case Format::RG16UI:
            return WGPUVertexFormat_Uint16x2;
        case Format::RGBA16UI:
            return WGPUVertexFormat_Uint16x4;
        case Format::RG16I:
            return WGPUVertexFormat_Sint16x2;
        case Format::RGBA16I:
            return WGPUVertexFormat_Sint16x4;
        case Format::RG16F:
            return WGPUVertexFormat_Float16x2;
        case Format::RGBA16F:
            return WGPUVertexFormat_Float16x4;
        case Format::R32F:
            return WGPUVertexFormat_Float32;
        case Format::RG32F:
            return WGPUVertexFormat_Float32x2;
        case Format::RGB32F:
            return WGPUVertexFormat_Float32x3;
        case Format::RGBA32F:
            return WGPUVertexFormat_Float32x4;
        case Format::R32UI:
            return WGPUVertexFormat_Uint32;
        case Format::RG32UI:
            return WGPUVertexFormat_Uint32x2;
        case Format::RGB32UI:
            return WGPUVertexFormat_Uint32x3;
        case Format::RGBA32UI:
            return WGPUVertexFormat_Uint32x4;
        case Format::R32I:
            return WGPUVertexFormat_Sint32;
        case Format::RG32I:
            return WGPUVertexFormat_Sint32x2;
        case Format::RGB32I:
            return WGPUVertexFormat_Sint32x3;
        case Format::RGBA32I:
            return WGPUVertexFormat_Sint32x4;
        default:
            printf("usvf %d\n", static_cast<int>(format));
            return WGPUVertexFormat_Undefined;
    }
}

static WGPUPrimitiveTopology toWGPUPrimTopology(PrimitiveMode mode) {
    switch (mode) {
        case PrimitiveMode::POINT_LIST:
            return WGPUPrimitiveTopology_PointList;
        case PrimitiveMode::LINE_LIST:
            return WGPUPrimitiveTopology_LineList;
        case PrimitiveMode::LINE_STRIP:
            return WGPUPrimitiveTopology_LineStrip;
        case PrimitiveMode::TRIANGLE_LIST:
            return WGPUPrimitiveTopology_TriangleList;
        case PrimitiveMode::TRIANGLE_STRIP:
            return WGPUPrimitiveTopology_TriangleStrip;
        default:
            printf("Unsupport primitive topology.\n");
            return WGPUPrimitiveTopology_Force32;
    }
}

static WGPUBlendOperation toWGPUBlendOperation(BlendOp blendOp) {
    switch (blendOp) {
        case BlendOp::ADD:
            return WGPUBlendOperation::WGPUBlendOperation_Add;
        case BlendOp::SUB:
            return WGPUBlendOperation::WGPUBlendOperation_Subtract;
        case BlendOp::REV_SUB:
            return WGPUBlendOperation::WGPUBlendOperation_ReverseSubtract;
        case BlendOp::MIN:
            return WGPUBlendOperation::WGPUBlendOperation_Min;
        case BlendOp::MAX:
            return WGPUBlendOperation::WGPUBlendOperation_Max;
        default:
            return WGPUBlendOperation::WGPUBlendOperation_Add;
    }
}

static WGPUBlendFactor toWGPUBlendFactor(BlendFactor blendFactor) {
    switch (blendFactor) {
        case BlendFactor::ZERO:
            return WGPUBlendFactor::WGPUBlendFactor_Zero;
        case BlendFactor::ONE:
            return WGPUBlendFactor::WGPUBlendFactor_One;
        case BlendFactor::SRC_ALPHA:
            return WGPUBlendFactor::WGPUBlendFactor_SrcAlpha;
        case BlendFactor::DST_ALPHA:
            return WGPUBlendFactor::WGPUBlendFactor_DstAlpha;
        case BlendFactor::ONE_MINUS_SRC_ALPHA:
            return WGPUBlendFactor::WGPUBlendFactor_OneMinusSrcAlpha;
        case BlendFactor::ONE_MINUS_DST_ALPHA:
            return WGPUBlendFactor::WGPUBlendFactor_OneMinusDstAlpha;
        case BlendFactor::SRC_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_Src;
        case BlendFactor::DST_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_Dst;
        case BlendFactor::ONE_MINUS_SRC_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_OneMinusSrc;
        case BlendFactor::ONE_MINUS_DST_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_OneMinusDst;
        case BlendFactor::SRC_ALPHA_SATURATE:
            return WGPUBlendFactor::WGPUBlendFactor_SrcAlphaSaturated;
        case BlendFactor::CONSTANT_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_Constant;
        case BlendFactor::ONE_MINUS_CONSTANT_COLOR:
            return WGPUBlendFactor::WGPUBlendFactor_OneMinusConstant;
        default:
            printf("Unsupport blend factor config %d\n", static_cast<int>(blendFactor));
            return WGPUBlendFactor::WGPUBlendFactor_Force32;
    }
}

static WGPUFlags toWGPUColorWriteMask(ColorMask mask) {
    WGPUFlags result = WGPUColorWriteMask_None;
    if (mask == ColorMask::NONE) {
        return result;
    }

    if (mask & ColorMask::ALL || mask & ColorMask::R) result |= WGPUColorWriteMask::WGPUColorWriteMask_Red;
    if (mask & ColorMask::ALL || mask & ColorMask::G) result |= WGPUColorWriteMask::WGPUColorWriteMask_Green;
    if (mask & ColorMask::ALL || mask & ColorMask::B) result |= WGPUColorWriteMask::WGPUColorWriteMask_Blue;
    if (mask & ColorMask::ALL || mask & ColorMask::A) result |= WGPUColorWriteMask::WGPUColorWriteMask_Alpha;

    return result;
}

static ccstd::string getAdapterTypeName(WGPUAdapterType type) {
    switch (type) {
        case WGPUAdapterType_DiscreteGPU:
            return "WGPUAdapterType_DiscreteGPU";
        case WGPUAdapterType_IntegratedGPU:
            return "WGPUAdapterType_IntegratedGPU";
        case WGPUAdapterType_CPU:
            return "WGPUAdapterType_CPU";
        case WGPUAdapterType_Unknown:
            return "WGPUAdapterType_Unknown";
        default:
            return "unknown adapter by cc.gfx!";
    }
}

static ccstd::string getBackendTypeName(WGPUBackendType type) {
    switch (type) {
        case WGPUBackendType_Null:
            return "WGPUBackendType_Null";
        case WGPUBackendType_WebGPU:
            return "WGPUBackendType_WebGPU";
        case WGPUBackendType_D3D11:
            return "WGPUBackendType_D3D11";
        case WGPUBackendType_D3D12:
            return "WGPUBackendType_D3D12";
        case WGPUBackendType_Metal:
            return "WGPUBackendType_Metal";
        case WGPUBackendType_Vulkan:
            return "WGPUBackendType_Vulkan";
        case WGPUBackendType_OpenGL:
            return "WGPUBackendType_OpenGL";
        case WGPUBackendType_OpenGLES:
            return "WGPUBackendType_OpenGLES";
        default:
            return "unknown backend by cc.gfx!";
    }
}

class Texture;
class CommandBuffer;
// fromLevel and toLevel is included.
void genMipMap(Texture* texture, uint8_t fromLevel, uint8_t levelCount, uint32_t baseLayer, CommandBuffer* cmdBuffer);

class DescriptorSet;
class PipelineLayout;
// descriptor set layout in descriptor set not consistent with the binding in pipeline layout.
void createPipelineLayoutFallback(const ccstd::vector<DescriptorSet*>& descriptorSets, PipelineLayout* pipelineLayout, bool skipEmpty = false);

class Texture;
class CommandBuffer;
void clearRect(CommandBuffer* cmdBuffer, Texture* texture, const Rect& renderArea, const Color& color);
void genMipMap(Texture* texture, uint8_t fromLevel, uint8_t levelCount, uint32_t baseLayer, CommandBuffer* cmdBuffer);

static constexpr WGPUColor defaultClearColor{0.2, 0.2, 0.2, 1.0};

static constexpr float defaultClearDepth = 1.0f;

} // namespace gfx
} // namespace cc
