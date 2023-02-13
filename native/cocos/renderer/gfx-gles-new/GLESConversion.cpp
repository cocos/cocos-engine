
#include "GLESConversion.h"
#include "base/std/container/unordered_map.h"

namespace cc::gfx::gles {

const InternalFormat FORMAT_INFO_MAP[static_cast<uint32_t>(Format::COUNT)] = {
    {GL_NONE              , GL_NONE           , GL_NONE                        , false}, // UNKNOWN
    {GL_ALPHA             , GL_ALPHA          , GL_UNSIGNED_BYTE               , false}, // A8
    {GL_LUMINANCE         , GL_LUMINANCE      , GL_UNSIGNED_BYTE               , false}, // L8
    {GL_LUMINANCE_ALPHA   , GL_LUMINANCE_ALPHA, GL_UNSIGNED_BYTE               , false}, // LA8
    {GL_R8                , GL_RED            , GL_UNSIGNED_BYTE               , false}, // R8
    {GL_R8_SNORM          , GL_RED            , GL_BYTE                        , false}, // R8SN
    {GL_R8UI              , GL_RED_INTEGER    , GL_UNSIGNED_BYTE               , false}, // R8UI
    {GL_R8I               , GL_RED_INTEGER    , GL_BYTE                        , false}, // R8I
    {GL_R16F              , GL_RED            , GL_HALF_FLOAT                  , false}, // R16F
    {GL_R16UI             , GL_RED_INTEGER    , GL_UNSIGNED_SHORT              , false}, // R16UI
    {GL_R16I              , GL_RED_INTEGER    , GL_SHORT                       , false}, // R16I
    {GL_R32F              , GL_RED            , GL_FLOAT                       , false}, // R32F
    {GL_R32UI             , GL_RED_INTEGER    , GL_UNSIGNED_INT                , false}, // R32UI
    {GL_R32I              , GL_RED_INTEGER    , GL_INT                         , false}, // R32I
    {GL_RG8               , GL_RG             , GL_UNSIGNED_BYTE               , false}, // RG8
    {GL_RG8_SNORM         , GL_RG             , GL_BYTE                        , false}, // RG8SN
    {GL_RG8UI             , GL_RG_INTEGER     , GL_UNSIGNED_BYTE               , false}, // RG8UI
    {GL_RG8I              , GL_RG_INTEGER     , GL_BYTE                        , false}, // RG8I
    {GL_RG16F             , GL_RG             , GL_HALF_FLOAT                  , false}, // RG16F
    {GL_RG16UI            , GL_RG_INTEGER     , GL_UNSIGNED_SHORT              , false}, // RG16UI
    {GL_RG16I             , GL_RG_INTEGER     , GL_SHORT                       , false}, // RG16I
    {GL_R32F              , GL_RG             , GL_FLOAT                       , false}, // RG32F
    {GL_RG32UI            , GL_RG_INTEGER     , GL_UNSIGNED_INT                , false}, // RG32UI
    {GL_RG32I             , GL_RG_INTEGER     , GL_INT                         , false}, // RG32I
    {GL_RGB8              , GL_RGB            , GL_UNSIGNED_BYTE               , false}, // RGB8
    {GL_SRGB_EXT          , GL_RGB            , GL_UNSIGNED_BYTE               , false}, // SRGB8
    {GL_RGB8_SNORM        , GL_RGB            , GL_BYTE                        , false}, // RGB8SN
    {GL_RGB8UI            , GL_RGB_INTEGER    , GL_UNSIGNED_BYTE               , false}, // RGB8UI
    {GL_RGB8I             , GL_RGB_INTEGER    , GL_BYTE                        , false}, // RGB8I
    {GL_RGB16F            , GL_RGB            , GL_HALF_FLOAT                  , false}, // RGB16F
    {GL_RGB16UI           , GL_RGB_INTEGER    , GL_UNSIGNED_SHORT              , false}, // RGB16UI
    {GL_RGB16I            , GL_RGB_INTEGER    , GL_SHORT                       , false}, // RGB16I
    {GL_RGB32F            , GL_RGB            , GL_FLOAT                       , false}, // RGB32F
    {GL_RGB32UI           , GL_RGB_INTEGER    , GL_UNSIGNED_INT                , false}, // RGB32UI
    {GL_RGB32I            , GL_RGB_INTEGER    , GL_INT                         , false}, // RGB32I
    {GL_RGBA8             , GL_RGBA           , GL_UNSIGNED_BYTE               , false}, // RGBA8
    {GL_RGBA8             , GL_RGBA           , GL_UNSIGNED_BYTE               , false}, // BGRA8
    {GL_SRGB_ALPHA_EXT    , GL_RGBA           , GL_UNSIGNED_BYTE               , false}, // SRGB8_A8
    {GL_RGBA8_SNORM       , GL_RGBA           , GL_BYTE                        , false}, // RGBA8SN
    {GL_RGBA8UI           , GL_RGBA_INTEGER   , GL_UNSIGNED_BYTE               , false}, // RGBA8UI
    {GL_RGBA8I            , GL_RGBA_INTEGER   , GL_BYTE                        , false}, // RGBA8I
    {GL_RGBA16F           , GL_RGBA           , GL_HALF_FLOAT                  , false}, // RGBA16F
    {GL_RGBA16UI          , GL_RGBA_INTEGER   , GL_UNSIGNED_SHORT              , false}, // RGBA16UI
    {GL_RGBA16I           , GL_RGBA_INTEGER   , GL_SHORT                       , false}, // RGBA16I
    {GL_RGBA32F           , GL_RGBA           , GL_FLOAT                       , false}, // RGBA32F
    {GL_RGBA32UI          , GL_RGBA_INTEGER   , GL_UNSIGNED_INT                , false}, // RGBA32UI
    {GL_RGBA32I           , GL_RGBA_INTEGER   , GL_INT                         , false}, // RGBA32I
    {GL_RGB565            , GL_RGB            , GL_UNSIGNED_SHORT_5_6_5        , false}, // R5G6B5
    {GL_R11F_G11F_B10F    , GL_RGB            , GL_UNSIGNED_INT_10F_11F_11F_REV, false}, // R11G11B10F
    {GL_RGB5_A1           , GL_RGBA           , GL_UNSIGNED_SHORT_5_5_5_1      , false}, // RGB5A1
    {GL_RGBA4             , GL_RGBA           , GL_UNSIGNED_SHORT_4_4_4_4      , false}, // RGBA4
    {GL_RGB10_A2          , GL_RGBA           , GL_UNSIGNED_INT_2_10_10_10_REV , false}, // RGB10A2
    {GL_RGB10_A2UI        , GL_RGBA_INTEGER   , GL_UNSIGNED_INT_2_10_10_10_REV , false}, // RGB10A2UI
    {GL_RGB9_E5           , GL_RGB            , GL_UNSIGNED_INT_5_9_9_9_REV    , false}, // RGB9E5
    {GL_DEPTH_COMPONENT32F, GL_DEPTH_COMPONENT, GL_FLOAT                       , false}, // DEPTH
    {GL_DEPTH24_STENCIL8  , GL_DEPTH_STENCIL  , GL_UNSIGNED_INT_24_8           , false}, // DEPTH_STENCIL


    {GL_COMPRESSED_RGB_S3TC_DXT1_EXT             , GL_NONE, GL_NONE, true}, // BC1
    {GL_COMPRESSED_RGBA_S3TC_DXT1_EXT            , GL_NONE, GL_NONE, true}, // BC1_ALPHA
    {GL_COMPRESSED_SRGB_S3TC_DXT1_EXT            , GL_NONE, GL_NONE, true}, // BC1_SRGB
    {GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT      , GL_NONE, GL_NONE, true}, // BC1_SRGB_ALPHA
    {GL_COMPRESSED_RGBA_S3TC_DXT3_EXT            , GL_NONE, GL_NONE, true}, // BC2
    {GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT      , GL_NONE, GL_NONE, true}, // BC2_SRGB
    {GL_COMPRESSED_RGBA_S3TC_DXT5_EXT            , GL_NONE, GL_NONE, true}, // BC3
    {GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT      , GL_NONE, GL_NONE, true}, // BC3_SRGB
    {GL_COMPRESSED_RED_RGTC1_EXT                 , GL_NONE, GL_NONE, true}, // BC4
    {GL_COMPRESSED_SIGNED_RED_RGTC1_EXT          , GL_NONE, GL_NONE, true}, // BC4_SNORM
    {GL_COMPRESSED_RED_GREEN_RGTC2_EXT           , GL_NONE, GL_NONE, true}, // BC5
    {GL_COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT    , GL_NONE, GL_NONE, true}, // BC5_SNORM
    {GL_COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT   , GL_NONE, GL_NONE, true}, // BC6H_UF16
    {GL_COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT     , GL_NONE, GL_NONE, true}, // BC6H_SF16
    {GL_COMPRESSED_RGBA_BPTC_UNORM_EXT           , GL_NONE, GL_NONE, true}, // BC7
    {GL_COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT     , GL_NONE, GL_NONE, true}, // BC7_SRGB
    {GL_ETC1_RGB8_OES                            , GL_NONE, GL_NONE, true}, // ETC_RGB8
    {GL_COMPRESSED_RGB8_ETC2                     , GL_NONE, GL_NONE, true}, // ETC2_RGB8
    {GL_COMPRESSED_SRGB8_ETC2                    , GL_NONE, GL_NONE, true}, // ETC2_SRGB8
    {GL_COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 , GL_NONE, GL_NONE, true}, // ETC2_RGB8_A1
    {GL_COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2, GL_NONE, GL_NONE, true}, // ETC2_SRGB8_A1
    {GL_COMPRESSED_RGBA8_ETC2_EAC                , GL_NONE, GL_NONE, true}, // ETC2_RGBA8
    {GL_COMPRESSED_SRGB8_ALPHA8_ETC2_EAC         , GL_NONE, GL_NONE, true}, // ETC2_SRGB8_A8
    {GL_COMPRESSED_R11_EAC                       , GL_NONE, GL_NONE, true}, // EAC_R11
    {GL_COMPRESSED_SIGNED_R11_EAC                , GL_NONE, GL_NONE, true}, // EAC_R11SN
    {GL_COMPRESSED_RG11_EAC                      , GL_NONE, GL_NONE, true}, // EAC_RG11
    {GL_COMPRESSED_SIGNED_RG11_EAC               , GL_NONE, GL_NONE, true}, // EAC_RG11SN
    {GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG          , GL_NONE, GL_NONE, true}, // PVRTC_RGB2
    {GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG         , GL_NONE, GL_NONE, true}, // PVRTC_RGBA2
    {GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG          , GL_NONE, GL_NONE, true}, // PVRTC_RGB4
    {GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG         , GL_NONE, GL_NONE, true}, // PVRTC_RGBA4
    {GL_NONE                                     , GL_NONE, GL_NONE, true}, // PVRTC2_2BPP
    {GL_NONE                                     , GL_NONE, GL_NONE, true}, // PVRTC2_4BPP
    {GL_COMPRESSED_RGBA_ASTC_4x4_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_4X4
    {GL_COMPRESSED_RGBA_ASTC_5x4_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_5X4
    {GL_COMPRESSED_RGBA_ASTC_5x5_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_5X5
    {GL_COMPRESSED_RGBA_ASTC_6x5_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_6X5
    {GL_COMPRESSED_RGBA_ASTC_6x6_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_6X6
    {GL_COMPRESSED_RGBA_ASTC_8x5_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_8X5
    {GL_COMPRESSED_RGBA_ASTC_8x6_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_8X6
    {GL_COMPRESSED_RGBA_ASTC_8x8_KHR             , GL_NONE, GL_NONE, true}, // ASTC_RGBA_8X8
    {GL_COMPRESSED_RGBA_ASTC_10x5_KHR            , GL_NONE, GL_NONE, true}, // ASTC_RGBA_10X5
    {GL_COMPRESSED_RGBA_ASTC_10x6_KHR            , GL_NONE, GL_NONE, true}, // ASTC_RGBA_10X6
    {GL_COMPRESSED_RGBA_ASTC_10x8_KHR            , GL_NONE, GL_NONE, true}, // ASTC_RGBA_10X8
    {GL_COMPRESSED_RGBA_ASTC_10x10_KHR           , GL_NONE, GL_NONE, true}, // ASTC_RGBA_10X10
    {GL_COMPRESSED_RGBA_ASTC_12x10_KHR           , GL_NONE, GL_NONE, true}, // ASTC_RGBA_12X10
    {GL_COMPRESSED_RGBA_ASTC_12x12_KHR           , GL_NONE, GL_NONE, true}, // ASTC_RGBA_12X12
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_4X4
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_5X4
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_5X5
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_6X5
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_6X6
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_8X5
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_8X6
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR     , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_8X8
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR    , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_10X5
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR    , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_10X6
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR    , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_10X8
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR   , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_10X10
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR   , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_12X10
    {GL_COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR   , GL_NONE, GL_NONE, true}, // ASTC_SRGBA_12X12
};

const GLenum WRAPS_MAP[] = {
    GL_REPEAT,
    GL_MIRRORED_REPEAT,
    GL_CLAMP_TO_EDGE,
    GL_CLAMP_TO_EDGE,
};

const GLenum CMP_FUNCS_MAP[] = {
    GL_NEVER,
    GL_LESS,
    GL_EQUAL,
    GL_LEQUAL,
    GL_GREATER,
    GL_NOTEQUAL,
    GL_GEQUAL,
    GL_ALWAYS,
};

const GLenum STENCIL_OPS_MAP[] = {
    GL_ZERO,
    GL_KEEP,
    GL_REPLACE,
    GL_INCR,
    GL_DECR,
    GL_INVERT,
    GL_INCR_WRAP,
    GL_DECR_WRAP,
};

const GLenum BLEND_OPS_MAP[] = {
    GL_FUNC_ADD,
    GL_FUNC_SUBTRACT,
    GL_FUNC_REVERSE_SUBTRACT,
    GL_MIN,
    GL_MAX,
};

const GLenum BLEND_FACTORS_MAP[] = {
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

const GLenum PRIMITIVE_MAP[] = {
    GL_POINTS,
    GL_LINES,
    GL_LINE_STRIP,
    GL_LINE_LOOP,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_TRIANGLES,
    GL_TRIANGLE_STRIP,
    GL_TRIANGLE_FAN,
    GL_NONE,
    GL_NONE,
    GL_NONE,
    GL_NONE,
};

const InternalFormat &getInternalType(Format format) {
    return FORMAT_INFO_MAP[static_cast<uint32_t>(format)];
}

GLenum getWrapMode(Address address) {
    return WRAPS_MAP[static_cast<uint32_t>(address)];
}

GLenum getShaderStage(ShaderStageFlagBit stage) {
    if (stage == ShaderStageFlagBit::VERTEX) return GL_VERTEX_SHADER;
    if (stage == ShaderStageFlagBit::FRAGMENT) return GL_FRAGMENT_SHADER;
    if (stage == ShaderStageFlagBit::COMPUTE) return GL_COMPUTE_SHADER;
    CC_ABORT();
    return 0;
}

GLenum getCompareFunc(ComparisonFunc compare) {
    return CMP_FUNCS_MAP[static_cast<uint32_t>(compare)];
}

GLenum getStencilOP(StencilOp op) {
    return STENCIL_OPS_MAP[static_cast<uint32_t>(op)];
}

GLenum getBlendOP(BlendOp op) {
    return BLEND_OPS_MAP[static_cast<uint32_t>(op)];
}

GLenum getBlendFactor(BlendFactor factor) {
    return BLEND_FACTORS_MAP[static_cast<uint32_t>(factor)];
}

GLenum getPrimitive(PrimitiveMode primitive) {
    return PRIMITIVE_MAP[static_cast<uint32_t>(primitive)];
}

} // namespace cc::gfx::gles
