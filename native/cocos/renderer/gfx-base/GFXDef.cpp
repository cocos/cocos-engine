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

#include "base/CoreStd.h"

#include "GFXDef.h"

namespace cc {
namespace gfx {

const DescriptorType DESCRIPTOR_BUFFER_TYPE = DescriptorType::STORAGE_BUFFER |
                                              DescriptorType::DYNAMIC_STORAGE_BUFFER |
                                              DescriptorType::UNIFORM_BUFFER |
                                              DescriptorType::DYNAMIC_UNIFORM_BUFFER;

const DescriptorType DESCRIPTOR_TEXTURE_TYPE = DescriptorType::SAMPLER_TEXTURE |
                                               DescriptorType::SAMPLER |
                                               DescriptorType::TEXTURE |
                                               DescriptorType::STORAGE_IMAGE |
                                               DescriptorType::INPUT_ATTACHMENT;

const DescriptorType DESCRIPTOR_DYNAMIC_TYPE = DescriptorType::DYNAMIC_STORAGE_BUFFER |
                                               DescriptorType::DYNAMIC_UNIFORM_BUFFER;

const uint DRAW_INFO_SIZE = 28u;

const FormatInfo GFX_FORMAT_INFOS[] = {
    {"UNKNOWN", 0, 0, FormatType::NONE, false, false, false, false},
    {"A8", 1, 1, FormatType::UNORM, true, false, false, false},
    {"L8", 1, 1, FormatType::UNORM, false, false, false, false},
    {"LA8", 1, 2, FormatType::UNORM, false, false, false, false},

    {"R8", 1, 1, FormatType::UNORM, false, false, false, false},
    {"R8SN", 1, 1, FormatType::SNORM, false, false, false, false},
    {"R8UI", 1, 1, FormatType::UINT, false, false, false, false},
    {"R8I", 1, 1, FormatType::INT, false, false, false, false},
    {"R16F", 2, 1, FormatType::FLOAT, false, false, false, false},
    {"R16UI", 2, 1, FormatType::UINT, false, false, false, false},
    {"R16I", 2, 1, FormatType::INT, false, false, false, false},
    {"R32F", 4, 1, FormatType::FLOAT, false, false, false, false},
    {"R32UI", 4, 1, FormatType::UINT, false, false, false, false},
    {"R32I", 4, 1, FormatType::INT, false, false, false, false},

    {"RG8", 2, 2, FormatType::UNORM, false, false, false, false},
    {"RG8SN", 2, 2, FormatType::SNORM, false, false, false, false},
    {"RG8UI", 2, 2, FormatType::UINT, false, false, false, false},
    {"RG8I", 2, 2, FormatType::INT, false, false, false, false},
    {"RG16F", 4, 2, FormatType::FLOAT, false, false, false, false},
    {"RG16UI", 4, 2, FormatType::UINT, false, false, false, false},
    {"RG16I", 4, 2, FormatType::INT, false, false, false, false},
    {"RG32F", 8, 2, FormatType::FLOAT, false, false, false, false},
    {"RG32UI", 8, 2, FormatType::UINT, false, false, false, false},
    {"RG32I", 8, 2, FormatType::INT, false, false, false, false},

    {"RGB8", 3, 3, FormatType::UNORM, false, false, false, false},
    {"SRGB8", 3, 3, FormatType::UNORM, false, false, false, false},
    {"RGB8SN", 3, 3, FormatType::SNORM, false, false, false, false},
    {"RGB8UI", 3, 3, FormatType::UINT, false, false, false, false},
    {"RGB8I", 3, 3, FormatType::INT, false, false, false, false},
    {"RGB16F", 6, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB16UI", 6, 3, FormatType::UINT, false, false, false, false},
    {"RGB16I", 6, 3, FormatType::INT, false, false, false, false},
    {"RGB32F", 12, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB32UI", 12, 3, FormatType::UINT, false, false, false, false},
    {"RGB32I", 12, 3, FormatType::INT, false, false, false, false},

    {"RGBA8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"BGRA8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"SRGB8_A8", 4, 4, FormatType::UNORM, true, false, false, false},
    {"RGBA8SN", 4, 4, FormatType::SNORM, true, false, false, false},
    {"RGBA8UI", 4, 4, FormatType::UINT, true, false, false, false},
    {"RGBA8I", 4, 4, FormatType::INT, true, false, false, false},
    {"RGBA16F", 8, 4, FormatType::FLOAT, true, false, false, false},
    {"RGBA16UI", 8, 4, FormatType::UINT, true, false, false, false},
    {"RGBA16I", 8, 4, FormatType::INT, true, false, false, false},
    {"RGBA32F", 16, 4, FormatType::FLOAT, true, false, false, false},
    {"RGBA32UI", 16, 4, FormatType::UINT, true, false, false, false},
    {"RGBA32I", 16, 4, FormatType::INT, true, false, false, false},

    {"R5G6B5", 2, 3, FormatType::UNORM, false, false, false, false},
    {"R11G11B10F", 4, 3, FormatType::FLOAT, false, false, false, false},
    {"RGB5A1", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGBA4", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGB10A2", 2, 4, FormatType::UNORM, true, false, false, false},
    {"RGB10A2UI", 2, 4, FormatType::UINT, true, false, false, false},
    {"RGB9E5", 2, 4, FormatType::FLOAT, true, false, false, false},

    {"D16", 2, 1, FormatType::UINT, false, true, false, false},
    {"D16S8", 3, 1, FormatType::UINT, false, true, true, false},
    {"D24", 3, 1, FormatType::UINT, false, true, false, false},
    {"D24S8", 2, 1, FormatType::UINT, false, true, true, false},
    {"D32F", 4, 1, FormatType::FLOAT, false, true, false, false},
    {"D32FS8", 5, 2, FormatType::FLOAT, false, true, true, false},

    {"BC1", 1, 3, FormatType::UNORM, false, false, false, true},
    {"BC1_ALPHA", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC1_SRGB", 1, 3, FormatType::UNORM, false, false, false, true},
    {"BC1_SRGB_ALPHA", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC2", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC2_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC3", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC3_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC4", 1, 1, FormatType::UNORM, false, false, false, true},
    {"BC4_SNORM", 1, 1, FormatType::SNORM, false, false, false, true},
    {"BC5", 1, 2, FormatType::UNORM, false, false, false, true},
    {"BC5_SNORM", 1, 2, FormatType::SNORM, false, false, false, true},
    {"BC6H_UF16", 1, 3, FormatType::UFLOAT, false, false, false, true},
    {"BC6H_SF16", 1, 3, FormatType::FLOAT, false, false, false, true},
    {"BC7", 1, 4, FormatType::UNORM, true, false, false, true},
    {"BC7_SRGB", 1, 4, FormatType::UNORM, true, false, false, true},

    {"ETC_RGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_RGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_SRGB8", 1, 3, FormatType::UNORM, false, false, false, true},
    {"ETC2_RGB8_A1", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ETC2_SRGB8_A1", 1, 4, FormatType::UNORM, true, false, false, true},
    {"EAC_R11", 1, 1, FormatType::UNORM, false, false, false, true},
    {"EAC_R11SN", 1, 1, FormatType::SNORM, false, false, false, true},
    {"EAC_RG11", 2, 2, FormatType::UNORM, false, false, false, true},
    {"EAC_RG11SN", 2, 2, FormatType::SNORM, false, false, false, true},

    {"PVRTC_RGB2", 2, 3, FormatType::UNORM, false, false, false, true},
    {"PVRTC_RGBA2", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC_RGB4", 2, 3, FormatType::UNORM, false, false, false, true},
    {"PVRTC_RGBA4", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC2_2BPP", 2, 4, FormatType::UNORM, true, false, false, true},
    {"PVRTC2_4BPP", 2, 4, FormatType::UNORM, true, false, false, true},

    {"ASTC_RGBA_4x4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_5x4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_5x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_6x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_6x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_8x8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10x8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_10x10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_12x10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_RGBA_12x12", 1, 4, FormatType::UNORM, true, false, false, true},

    {"ASTC_SRGBA_4x4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_5x4", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_5x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_6x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_6x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_8x8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10x5", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10x6", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10x8", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_10x10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_12x10", 1, 4, FormatType::UNORM, true, false, false, true},
    {"ASTC_SRGBA_12x12", 1, 4, FormatType::UNORM, true, false, false, true},
};

bool isCombinedImageSampler(Type type) { return type >= Type::SAMPLER1D && type <= Type::SAMPLER_CUBE; }
bool isSampledImage(Type type) { return type >= Type::TEXTURE1D && type <= Type::TEXTURE_CUBE; }
bool isStorageImage(Type type) { return type >= Type::IMAGE1D && type <= Type::IMAGE_CUBE; }

uint FormatSize(Format format, uint width, uint height, uint depth) {

    if (!GFX_FORMAT_INFOS[(uint)format].isCompressed) {
        return (width * height * depth * GFX_FORMAT_INFOS[(uint)format].size);
    } else {
        switch (format) {
            case Format::BC1:
            case Format::BC1_ALPHA:
            case Format::BC1_SRGB:
            case Format::BC1_SRGB_ALPHA:
                return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 8 * depth;
            case Format::BC2:
            case Format::BC2_SRGB:
            case Format::BC3:
            case Format::BC3_SRGB:
            case Format::BC4:
            case Format::BC4_SNORM:
            case Format::BC6H_SF16:
            case Format::BC6H_UF16:
            case Format::BC7:
            case Format::BC7_SRGB:
                return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 16 * depth;
            case Format::BC5:
            case Format::BC5_SNORM:
                return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 32 * depth;

            case Format::ETC_RGB8:
            case Format::ETC2_RGB8:
            case Format::ETC2_SRGB8:
            case Format::ETC2_RGB8_A1:
            case Format::EAC_R11:
            case Format::EAC_R11SN:
                return (uint)std::ceil((float)width / 4) * (uint)std::ceil((float)height / 4) * 8 * depth;
            case Format::ETC2_RGBA8:
            case Format::ETC2_SRGB8_A1:
            case Format::EAC_RG11:
            case Format::EAC_RG11SN:
                return (uint)std::ceil((float)width / 4) * (uint)std::ceil((float)height / 4) * 16 * depth;

            case Format::PVRTC_RGB2:
            case Format::PVRTC_RGBA2:
            case Format::PVRTC2_2BPP:
                return (uint)std::ceil(std::max(width, 16U) * std::max(height, 8U) / 4) * depth;
            case Format::PVRTC_RGB4:
            case Format::PVRTC_RGBA4:
            case Format::PVRTC2_4BPP:
                return (uint)std::ceil(std::max(width, 16U) * std::max(height, 8U) / 2) * depth;

            case Format::ASTC_RGBA_4x4:
            case Format::ASTC_SRGBA_4x4:
                return (uint)std::ceil((float)width / 4) * (uint)std::ceil((float)height / 4) * 16 * depth;
            case Format::ASTC_RGBA_5x4:
            case Format::ASTC_SRGBA_5x4:
                return (uint)std::ceil((float)width / 5) * (uint)std::ceil((float)height / 4) * 16 * depth;
            case Format::ASTC_RGBA_5x5:
            case Format::ASTC_SRGBA_5x5:
                return (uint)std::ceil((float)width / 5) * (uint)std::ceil((float)height / 5) * 16 * depth;
            case Format::ASTC_RGBA_6x5:
            case Format::ASTC_SRGBA_6x5:
                return (uint)std::ceil((float)width / 6) * (uint)std::ceil((float)height / 5) * 16 * depth;
            case Format::ASTC_RGBA_6x6:
            case Format::ASTC_SRGBA_6x6:
                return (uint)std::ceil((float)width / 6) * (uint)std::ceil((float)height / 6) * 16 * depth;
            case Format::ASTC_RGBA_8x5:
            case Format::ASTC_SRGBA_8x5:
                return (uint)std::ceil((float)width / 8) * (uint)std::ceil((float)height / 5) * 16 * depth;
            case Format::ASTC_RGBA_8x6:
            case Format::ASTC_SRGBA_8x6:
                return (uint)std::ceil((float)width / 8) * (uint)std::ceil((float)height / 6) * 16 * depth;
            case Format::ASTC_RGBA_8x8:
            case Format::ASTC_SRGBA_8x8:
                return (uint)std::ceil((float)width / 8) * (uint)std::ceil((float)height / 8) * 16 * depth;
            case Format::ASTC_RGBA_10x5:
            case Format::ASTC_SRGBA_10x5:
                return (uint)std::ceil((float)width / 10) * (uint)std::ceil((float)height / 5) * 16 * depth;
            case Format::ASTC_RGBA_10x6:
            case Format::ASTC_SRGBA_10x6:
                return (uint)std::ceil((float)width / 10) * (uint)std::ceil((float)height / 6) * 16 * depth;
            case Format::ASTC_RGBA_10x8:
            case Format::ASTC_SRGBA_10x8:
                return (uint)std::ceil((float)width / 10) * (uint)std::ceil((float)height / 8) * 16 * depth;
            case Format::ASTC_RGBA_10x10:
            case Format::ASTC_SRGBA_10x10:
                return (uint)std::ceil((float)width / 10) * (uint)std::ceil((float)height / 10) * 16 * depth;
            case Format::ASTC_RGBA_12x10:
            case Format::ASTC_SRGBA_12x10:
                return (uint)std::ceil((float)width / 12) * (uint)std::ceil((float)height / 10) * 16 * depth;
            case Format::ASTC_RGBA_12x12:
            case Format::ASTC_SRGBA_12x12:
                return (uint)std::ceil((float)width / 12) * (uint)std::ceil((float)height / 12) * 16 * depth;

            default: {
                return 0;
            }
        }
    }
}

const uint GFX_TYPE_SIZES[] = {
    0,  // UNKNOWN
    4,  // BOOL
    8,  // BOOL2
    12, // BOOL3
    16, // BOOL4
    4,  // INT
    8,  // INT2
    12, // INT3
    16, // INT4
    4,  // UINT
    8,  // UINT2
    12, // UINT3
    16, // UINT4
    4,  // FLOAT
    8,  // FLOAT2
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
    4,  // SAMPLER1D
    4,  // SAMPLER1D_ARRAY
    4,  // SAMPLER2D
    4,  // SAMPLER2D_ARRAY
    4,  // SAMPLER3D
    4,  // SAMPLER_CUBE
};

uint FormatSurfaceSize(Format format, uint width, uint height, uint depth, uint mips) {

    uint size = 0;

    for (uint i = 0; i < mips; ++i) {
        size += FormatSize(format, width, height, depth);
        width  = std::max(width >> 1, 1U);
        height = std::max(height >> 1, 1U);
    }

    return size;
}

} // namespace gfx
} // namespace cc
