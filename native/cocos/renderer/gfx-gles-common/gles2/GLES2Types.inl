namespace {
GLenum mapGLFormat(Format format) {
    switch (format) {
        case Format::A8: return GL_ALPHA;
        case Format::L8: return GL_LUMINANCE;
        case Format::LA8: return GL_LUMINANCE_ALPHA;

        case Format::R8:
        case Format::R8SN:
        case Format::R16F:
        case Format::R32F: return GL_RED_EXT;
        case Format::RG8:
        case Format::RG8SN:
        case Format::RG16F:
        case Format::RG32F: return GL_RG_EXT;
        case Format::RGB8:
        case Format::RGB8SN:
        case Format::RGB16F:
        case Format::RGB32F:
        case Format::R5G6B5:
        case Format::SRGB8: return GL_RGB;
        case Format::RGBA8:
        case Format::RGBA8SN:
        case Format::RGBA16F:
        case Format::RGBA32F:
        case Format::RGBA4:
        case Format::RGB5A1:
        case Format::RGB10A2:
        case Format::SRGB8_A8: return GL_RGBA;

        case Format::DEPTH: return GL_DEPTH_COMPONENT;
        case Format::DEPTH_STENCIL: return GL_DEPTH_STENCIL_OES;

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
            CC_ABORT();
            return GL_NONE;
        }
    }
}

GLenum mapGLInternalFormat(Format format) {
    switch (format) {
        case Format::R8: return GL_R8_EXT;
        case Format::RG8: return GL_RG8_EXT;
        case Format::SRGB8: return GL_SRGB_EXT;
        case Format::SRGB8_A8: return GL_SRGB_ALPHA_EXT;
        case Format::R16F: return GL_R16F_EXT;
        case Format::RG16F: return GL_RG16F_EXT;
        case Format::RGB16F: return GL_RGB16F_EXT;
        case Format::RGBA16F: return GL_RGBA16F_EXT;
        case Format::R32F: return GL_R32F_EXT;
        case Format::RG32F: return GL_RG32F_EXT;
        case Format::RGB32F: return GL_RGB32F_EXT;
        case Format::RGBA32F: return GL_RGBA32F_EXT;
        case Format::R5G6B5: return GL_RGB565;
        case Format::RGB5A1: return GL_RGB5_A1;
        case Format::RGBA4: return GL_RGBA4;
        case Format::DEPTH: return GL_DEPTH_COMPONENT16;
        case Format::DEPTH_STENCIL: return GL_DEPTH24_STENCIL8_OES;

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
            CC_ABORT();
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
            CC_ABORT();
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
        case Format::R16F: return GL_HALF_FLOAT_OES;
        case Format::R16UI: return GL_UNSIGNED_SHORT;
        case Format::R16I: return GL_SHORT;
        case Format::R32F: return GL_FLOAT;
        case Format::R32UI: return GL_UNSIGNED_INT;
        case Format::R32I: return GL_INT;

        case Format::RG8: return GL_UNSIGNED_BYTE;
        case Format::RG8SN: return GL_BYTE;
        case Format::RG8UI: return GL_UNSIGNED_BYTE;
        case Format::RG8I: return GL_BYTE;
        case Format::RG16F: return GL_HALF_FLOAT_OES;
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
        case Format::RGB5A1: return GL_UNSIGNED_SHORT_5_5_5_1;
        case Format::RGBA4: return GL_UNSIGNED_SHORT_4_4_4_4;
        case Format::RGB9E5: return GL_FLOAT;

        case Format::DEPTH: return GL_UNSIGNED_SHORT;
        case Format::DEPTH_STENCIL: return GL_UNSIGNED_INT_24_8_OES;

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
            CC_ABORT();
            return GL_NONE;
        }
    }
}

uint32_t glTypeSize(GLenum glType) {
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
            CC_ABORT();
            return 0;
        }
    }
}

uint32_t glComponentCount(GLenum glType) {
    switch (glType) {
        case GL_FLOAT_MAT2: return 2;
        case GL_FLOAT_MAT3: return 3;
        case GL_FLOAT_MAT4: return 4;
        default: {
            return 1;
        }
    }
}
} // namespace