#include "CoreStd.h"
#include "GFXDef.h"

NS_CC_BEGIN

const GFXFormatInfo GFX_FORMAT_INFOS[] = {
  { "UNKNOWN", 0, 0, GFXFormatType::NONE, false, false, false, false},
  { "A8", 1, 1, GFXFormatType::UNORM, true, false, false, false},
  { "L8", 1, 1, GFXFormatType::UNORM, false, false, false, false},
  { "LA8", 1, 2, GFXFormatType::UNORM, false, false, false, false},
  
  { "R8", 1, 1, GFXFormatType::UNORM, false, false, false, false},
  { "R8SN", 1, 1, GFXFormatType::SNORM, false, false, false, false},
  { "R8UI", 1, 1, GFXFormatType::UINT, false, false, false, false},
  { "R8I", 1, 1, GFXFormatType::INT, false, false, false, false},
  { "R16F", 2, 1, GFXFormatType::FLOAT, false, false, false, false},
  { "R16UI", 2, 1, GFXFormatType::UINT, false, false, false, false},
  { "R16I", 2, 1, GFXFormatType::INT, false, false, false, false},
  { "R32F", 4, 1, GFXFormatType::FLOAT, false, false, false, false},
  { "R32UI", 4, 1, GFXFormatType::UINT, false, false, false, false},
  { "R32I", 4, 1, GFXFormatType::INT, false, false, false, false},
  
  { "RG8", 2, 2, GFXFormatType::UNORM, false, false, false, false},
  { "RG8SN", 2, 2, GFXFormatType::SNORM, false, false, false, false},
  { "RG8UI", 2, 2, GFXFormatType::UINT, false, false, false, false},
  { "RG8I", 2, 2, GFXFormatType::INT, false, false, false, false},
  { "RG16F", 4, 2, GFXFormatType::FLOAT, false, false, false, false},
  { "RG16UI", 4, 2, GFXFormatType::UINT, false, false, false, false},
  { "RG16I", 4, 2, GFXFormatType::INT, false, false, false, false},
  { "RG32F", 8, 2, GFXFormatType::FLOAT, false, false, false, false},
  { "RG32UI", 8, 2, GFXFormatType::UINT, false, false, false, false},
  { "RG32I", 8, 2, GFXFormatType::INT, false, false, false, false},
  
  { "RGB8", 3, 3, GFXFormatType::UNORM, false, false, false, false},
  { "SRGB8", 3, 3, GFXFormatType::UNORM, false, false, false, false},
  { "RGB8SN", 3, 3, GFXFormatType::SNORM, false, false, false, false},
  { "RGB8UI", 3, 3, GFXFormatType::UINT, false, false, false, false},
  { "RGB8I", 3, 3, GFXFormatType::INT, false, false, false, false},
  { "RGB16F", 6, 3, GFXFormatType::FLOAT, false, false, false, false},
  { "RGB16UI", 6, 3, GFXFormatType::UINT, false, false, false, false},
  { "RGB16I", 6, 3, GFXFormatType::INT, false, false, false, false},
  { "RGB32F", 12, 3, GFXFormatType::FLOAT, false, false, false, false},
  { "RGB32UI", 12, 3, GFXFormatType::UINT, false, false, false, false},
  { "RGB32I", 12, 3, GFXFormatType::INT, false, false, false, false},
  
  { "RGBA8", 4, 4, GFXFormatType::UNORM, true, false, false, false},
  { "BGRA8", 4, 4, GFXFormatType::UNORM, true, false, false, false},
  { "SRGB8_A8", 4, 4, GFXFormatType::UNORM, true, false, false, false},
  { "RGBA8SN", 4, 4, GFXFormatType::SNORM, true, false, false, false},
  { "RGBA8UI", 4, 4, GFXFormatType::UINT, true, false, false, false},
  { "RGBA8I", 4, 4, GFXFormatType::INT, true, false, false, false},
  { "RGBA16F", 8, 4, GFXFormatType::FLOAT, true, false, false, false},
  { "RGBA16UI", 8, 4, GFXFormatType::UINT, true, false, false, false},
  { "RGBA16I", 8, 4, GFXFormatType::INT, true, false, false, false},
  { "RGBA32F", 16, 4, GFXFormatType::FLOAT, true, false, false, false},
  { "RGBA32UI", 16, 4, GFXFormatType::UINT, true, false, false, false},
  { "RGBA32I", 16, 4, GFXFormatType::INT, true, false, false, false},
  
  { "R5G6B5", 2, 3, GFXFormatType::UNORM, false, false, false, false},
  { "R11G11B10F", 4, 3, GFXFormatType::FLOAT, false, false, false, false},
  { "RGB5A1", 2, 4, GFXFormatType::UNORM, true, false, false, false},
  { "RGBA4", 2, 4, GFXFormatType::UNORM, true, false, false, false},
  { "RGB10A2", 2, 4, GFXFormatType::UNORM, true, false, false, false},
  { "RGB10A2UI", 2, 4, GFXFormatType::UINT, true, false, false, false},
  { "RGB9E5", 2, 4, GFXFormatType::FLOAT, true, false, false, false},
  
  { "D16", 2, 1, GFXFormatType::UINT, false, true, false, false},
  { "D16S8", 3, 1, GFXFormatType::UINT, false, true, true, false},
  { "D24", 3, 1, GFXFormatType::UINT, false, true, false, false},
  { "D24S8", 2, 1, GFXFormatType::UINT, false, true, true, false},
  { "D32F", 4, 1, GFXFormatType::FLOAT, false, true, false, false},
  { "D32FS8", 5, 2, GFXFormatType::FLOAT, false, true, true, false},
  
  { "BC1", 1, 3, GFXFormatType::UNORM, false, false, false, true},
  { "BC1_ALPHA", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC1_SRGB", 1, 3, GFXFormatType::UNORM, false, false, false, true},
  { "BC1_SRGB_ALPHA", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC2", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC2_SRGB", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC3", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC3_SRGB", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC4", 1, 1, GFXFormatType::UNORM, false, false, false, true},
  { "BC4_SNORM", 1, 1, GFXFormatType::SNORM, false, false, false, true},
  { "BC5", 1, 2, GFXFormatType::UNORM, false, false, false, true},
  { "BC5_SNORM", 1, 2, GFXFormatType::SNORM, false, false, false, true},
  { "BC6H_UF16", 1, 3, GFXFormatType::UFLOAT, false, false, false, true},
  { "BC6H_SF16", 1, 3, GFXFormatType::FLOAT, false, false, false, true},
  { "BC7", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "BC7_SRGB", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  
  { "ETC_RGB8", 1, 3, GFXFormatType::UNORM, false, false, false, true},
  { "ETC2_RGB8", 1, 3, GFXFormatType::UNORM, false, false, false, true},
  { "ETC2_SRGB8", 1, 3, GFXFormatType::UNORM, false, false, false, true},
  { "ETC2_RGB8_A1", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "ETC2_SRGB8_A1", 1, 4, GFXFormatType::UNORM, true, false, false, true},
  { "EAC_R11", 1, 1, GFXFormatType::UNORM, false, false, false, true},
  { "EAC_R11SN", 1, 1, GFXFormatType::SNORM, false, false, false, true},
  { "EAC_RG11", 2, 2, GFXFormatType::UNORM, false, false, false, true},
  { "EAC_RG11SN", 2, 2, GFXFormatType::SNORM, false, false, false, true},
  
  { "PVRTC_RGB2", 2, 3, GFXFormatType::UNORM, false, false, false, true},
  { "PVRTC_RGBA2", 2, 4, GFXFormatType::UNORM, true, false, false, true},
  { "PVRTC_RGB4", 2, 3, GFXFormatType::UNORM, false, false, false, true},
  { "PVRTC_RGBA4", 2, 4, GFXFormatType::UNORM, true, false, false, true},
  { "PVRTC2_2BPP", 2, 4, GFXFormatType::UNORM, true, false, false, true},
  { "PVRTC2_4BPP", 2, 4, GFXFormatType::UNORM, true, false, false, true},
};

uint GFXFormatSize(GFXFormat format, uint width, uint height, uint depth) {
  
  if (!GFX_FORMAT_INFOS[(uint)format].isCompressed) {
    return (width * height * depth * GFX_FORMAT_INFOS[(uint)format].size);
  } else {
    switch (format) {
      case GFXFormat::BC1:
      case GFXFormat::BC1_ALPHA:
      case GFXFormat::BC1_SRGB:
      case GFXFormat::BC1_SRGB_ALPHA:
        return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 8 * depth;
      case GFXFormat::BC2:
      case GFXFormat::BC2_SRGB:
      case GFXFormat::BC3:
      case GFXFormat::BC3_SRGB:
      case GFXFormat::BC4:
      case GFXFormat::BC4_SNORM:
      case GFXFormat::BC6H_SF16:
      case GFXFormat::BC6H_UF16:
      case GFXFormat::BC7:
      case GFXFormat::BC7_SRGB:
        return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 16 * depth;
      case GFXFormat::BC5:
      case GFXFormat::BC5_SNORM:
        return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 32 * depth;
        
      case GFXFormat::ETC_RGB8:
      case GFXFormat::ETC2_RGB8:
      case GFXFormat::ETC2_SRGB8:
      case GFXFormat::ETC2_RGB8_A1:
      case GFXFormat::ETC2_SRGB8_A1:
      case GFXFormat::EAC_R11:
      case GFXFormat::EAC_R11SN:
        return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 8 * depth;
      case GFXFormat::EAC_RG11:
      case GFXFormat::EAC_RG11SN:
        return (uint)std::ceil(width / 4) * (uint)std::ceil(height / 4) * 16 * depth;
        
      case GFXFormat::PVRTC_RGB2:
      case GFXFormat::PVRTC_RGBA2:
      case GFXFormat::PVRTC2_2BPP:
        return (uint)std::ceil(std::max(width, 16U) * std::max(height, 8U) / 4) * depth;
      case GFXFormat::PVRTC_RGB4:
      case GFXFormat::PVRTC_RGBA4:
      case GFXFormat::PVRTC2_4BPP:
        return (uint)std::ceil(std::max(width, 16U) * std::max(height, 8U) / 2) * depth;
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

uint GFXFormatSurfaceSize(GFXFormat format, uint width, uint height, uint depth, uint mips) {
  
  uint size = 0;
  
  for (uint i = 0; i < mips; ++i) {
    size += GFXFormatSize(format, width, height, depth);
    width = std::max(width >> 1, 1U);
    height = std::max(height >> 1, 1U);
    depth = std::max(depth >> 1, 1U);
  }
  
  return size;
}

NS_CC_END
