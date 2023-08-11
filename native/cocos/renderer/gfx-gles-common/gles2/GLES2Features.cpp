#include "GLES2Commands.h"

namespace cc::gfx {
#define ENABLE_GLES2_SUBPASS
#define ALLOW_MULTISAMPLED_RENDER_TO_TEXTURE_ON_DESKTOP 1

void cmdFuncGLES2UpdateFormatFeatures(GLESDevice *device, ccstd::array<FormatFeature, static_cast<size_t>(Format::COUNT)> &formatFeatures) {
    const FormatFeature completeFeature = FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;

    // builtin formatFeatures
    formatFeatures[toNumber(Format::RGB8)] = completeFeature;
    formatFeatures[toNumber(Format::R5G6B5)] = completeFeature;

    formatFeatures[toNumber(Format::RGBA8)] = completeFeature;
    formatFeatures[toNumber(Format::RGBA4)] = completeFeature;

    formatFeatures[toNumber(Format::RGB5A1)] = completeFeature;

    formatFeatures[toNumber(Format::R8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB8)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA8)] |= FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB8I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA8I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA8UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB16I)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA16I)] |= FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA16UI)] |= FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::VERTEX_ATTRIBUTE;

    if (device->checkExtension("OES_vertex_half_float")) {
        formatFeatures[toNumber(Format::R16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
        formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
        formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
        formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::VERTEX_ATTRIBUTE;
    }

    formatFeatures[toNumber(Format::DEPTH)] |= FormatFeature::RENDER_TARGET;
    formatFeatures[toNumber(Format::DEPTH_STENCIL)] |= FormatFeature::RENDER_TARGET;

    if (device->checkExtension("EXT_sRGB")) {
        formatFeatures[toNumber(Format::SRGB8)] |= completeFeature;
        formatFeatures[toNumber(Format::SRGB8_A8)] |= completeFeature;
    }

    if (device->checkExtension("texture_rg")) {
        formatFeatures[toNumber(Format::R8)] |= completeFeature;
        formatFeatures[toNumber(Format::RG8)] |= completeFeature;
    }

    if (device->checkExtension("texture_float")) {
        formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        if (device->checkExtension("texture_rg")) {
            formatFeatures[toNumber(Format::R32F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
            formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        }
    }

    if (device->checkExtension("texture_half_float")) {
        formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        if (device->checkExtension("texture_rg")) {
            formatFeatures[toNumber(Format::R16F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
            formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::RENDER_TARGET | FormatFeature::SAMPLED_TEXTURE;
        }
    }

    if (device->checkExtension("color_buffer_half_float")) {
        formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::RENDER_TARGET;
        formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::RENDER_TARGET;
        if (device->checkExtension("texture_rg")) {
            formatFeatures[toNumber(Format::R16F)] |= FormatFeature::RENDER_TARGET;
            formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::RENDER_TARGET;
        }
    }

    if (device->checkExtension("texture_float_linear")) {
        formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::LINEAR_FILTER;
        if (device->checkExtension("texture_rg")) {
            formatFeatures[toNumber(Format::R32F)] |= FormatFeature::LINEAR_FILTER;
            formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::LINEAR_FILTER;
        }
    }

    if (device->checkExtension("OES_texture_half_float_linear")) {
        formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::LINEAR_FILTER;
        if (device->checkExtension("texture_rg")) {
            formatFeatures[toNumber(Format::R16F)] |= FormatFeature::LINEAR_FILTER;
            formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::LINEAR_FILTER;
        }
    }

    if (device->checkExtension("depth_texture")) {
        formatFeatures[toNumber(Format::DEPTH)] |= completeFeature;
    }

    if (device->checkExtension("packed_depth_stencil")) {
        formatFeatures[toNumber(Format::DEPTH_STENCIL)] |= completeFeature;
    }

    // compressed texture feature
    const FormatFeature compressedFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;
    if (device->checkExtension("compressed_ETC1")) {
        formatFeatures[toNumber(Format::ETC_RGB8)] |= compressedFeature;
    }

    if (device->checkExtension("texture_compression_pvrtc")) {
        formatFeatures[toNumber(Format::PVRTC_RGB2)] |= compressedFeature;
        formatFeatures[toNumber(Format::PVRTC_RGBA2)] |= compressedFeature;
        formatFeatures[toNumber(Format::PVRTC_RGB4)] |= compressedFeature;
        formatFeatures[toNumber(Format::PVRTC_RGBA4)] |= compressedFeature;
    }

    if (device->checkExtension("texture_compression_astc")) {
        formatFeatures[toNumber(Format::ASTC_RGBA_4X4)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_5X4)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_5X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_6X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_6X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_8X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_8X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_8X8)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_10X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_10X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_10X8)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_10X10)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_12X10)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_RGBA_12X12)] |= compressedFeature;

        formatFeatures[toNumber(Format::ASTC_SRGBA_4X4)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_5X4)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_5X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_6X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_6X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_8X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_8X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_8X8)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_10X5)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_10X6)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_10X8)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_10X10)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_12X10)] |= compressedFeature;
        formatFeatures[toNumber(Format::ASTC_SRGBA_12X12)] |= compressedFeature;
    }
}

void cmdFuncGLES2UpdateTextureExclusive(GLESDevice *device, ccstd::array<bool, static_cast<size_t>(Format::COUNT)> &textureExclusive) {
    textureExclusive.fill(true);

    // builtin formatFeatures
    textureExclusive[toNumber(Format::R5G6B5)] = false;
    textureExclusive[toNumber(Format::RGBA4)] = false;
    textureExclusive[toNumber(Format::RGB5A1)] = false;
    textureExclusive[toNumber(Format::DEPTH)] = false;
    textureExclusive[toNumber(Format::DEPTH_STENCIL)] = false;

    if (device->checkExtension("EXT_sRGB")) {
        textureExclusive[toNumber(Format::SRGB8_A8)] = false;
    }

    if (device->checkExtension("color_buffer_half_float")) {
        textureExclusive[toNumber(Format::RGB16F)] = false;
        textureExclusive[toNumber(Format::RGBA16F)] = false;
        if (device->checkExtension("texture_rg")) {
            textureExclusive[toNumber(Format::R16F)] = false;
            textureExclusive[toNumber(Format::RG16F)] = false;
        }
    }
}

void cmdFuncGLES2UpdateFeatureAndCapabilities(GLESDevice *device, DeviceCaps &caps, GLESGPUConstantRegistry &constantRegistry, ccstd::array<bool, static_cast<size_t>(Feature::COUNT)> &features) {
    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, reinterpret_cast<GLint *>(&caps.maxVertexAttributes));
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&caps.maxVertexUniformVectors));
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&caps.maxFragmentUniformVectors));
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&caps.maxTextureUnits));
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&caps.maxVertexTextureUnits));
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, reinterpret_cast<GLint *>(&caps.maxTextureSize));
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, reinterpret_cast<GLint *>(&caps.maxCubeMapTextureSize));
    caps.uboOffsetAlignment = 16;

    constantRegistry.useVAO = device->checkExtension("vertex_array_object");
    constantRegistry.useDrawInstanced = device->checkExtension("draw_instanced");
    constantRegistry.useInstancedArrays = device->checkExtension("instanced_arrays");
    constantRegistry.useDiscardFramebuffer = device->checkExtension("discard_framebuffer");

    features[toNumber(Feature::INSTANCED_ARRAYS)] = constantRegistry.useInstancedArrays;
    features[toNumber(Feature::ELEMENT_INDEX_UINT)] = device->checkExtension("element_index_uint");
    features[toNumber(Feature::BLEND_MINMAX)] = device->checkExtension("blend_minmax");

    if (device->checkExtension("draw_buffers")) {
        features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)] = true;
        glGetIntegerv(GL_MAX_DRAW_BUFFERS_EXT, reinterpret_cast<GLint *>(&caps.maxColorRenderTargets));
    }

    if (device->checkExtension("GL_OES_texture_3D")) {
        glGetIntegerv(GL_MAX_3D_TEXTURE_SIZE_OES, reinterpret_cast<GLint *>(&caps.max3DTextureSize));
        // texture2DArray fallback to texture3DOES
        caps.maxArrayTextureLayers = caps.max3DTextureSize;
    }

    ccstd::string fbfLevelStr = "NONE";
#ifdef ENABLE_GLES2_SUBPASS
    if (device->checkExtension("framebuffer_fetch")) {
        if (device->checkExtension(CC_TOSTR(GL_EXT_shader_framebuffer_fetch_non_coherent))) {
            constantRegistry.mFBF = FBFSupportLevel::NON_COHERENT_EXT;
            features[toNumber(Feature::RASTERIZATION_ORDER_NOCOHERENT)] = true;
            fbfLevelStr = "NON_COHERENT_EXT";
        } else if (device->checkExtension(CC_TOSTR(GL_QCOM_shader_framebuffer_fetch_noncoherent))) {
            constantRegistry.mFBF = FBFSupportLevel::NON_COHERENT_QCOM;
            features[toNumber(Feature::RASTERIZATION_ORDER_NOCOHERENT)] = true;
            fbfLevelStr = "NON_COHERENT_QCOM";
        } else {
            // we only care about EXT_shader_framebuffer_fetch, the ARM version does not support MRT
            constantRegistry.mFBF = FBFSupportLevel::COHERENT;
            fbfLevelStr = "COHERENT";
        }

        features[toNumber(Feature::INPUT_ATTACHMENT_BENEFIT)] = true;
        features[toNumber(Feature::SUBPASS_COLOR_INPUT)] = true;
    }

    if (device->checkExtension(CC_TOSTR(ARM_shader_framebuffer_fetch_depth_stencil))) {
        features[toNumber(Feature::SUBPASS_DEPTH_STENCIL_INPUT)] = true;
        fbfLevelStr += "_DEPTH_STENCIL";
    }
    constantRegistry.fbfLevelStr = fbfLevelStr;
#endif

    ccstd::string msaaLevelStr = "NONE";
#if CC_PLATFORM != CC_PLATFORM_WINDOWS || ALLOW_MULTISAMPLED_RENDER_TO_TEXTURE_ON_DESKTOP
    if (device->checkExtension("multisampled_render_to_texture")) {
        if (device->checkExtension("multisampled_render_to_texture2")) {
            constantRegistry.mMSRT = MSRTSupportLevel::LEVEL2;
            msaaLevelStr = "MSRT2";
        } else {
            constantRegistry.mMSRT = MSRTSupportLevel::LEVEL1;
            msaaLevelStr = "MSRT1";
        }
    }
#endif
    constantRegistry.msaaLevelStr = msaaLevelStr;
    features[toNumber(Feature::MULTI_SAMPLE_RESOLVE_DEPTH_STENCIL)] = false; // not implement yet.

    // compressed feature
    ccstd::string compressedFmts;
    if (device->getFormatFeatures(Format::ETC_RGB8) != FormatFeature::NONE) {
        compressedFmts += "etc1 ";
    }

    if (device->getFormatFeatures(Format::PVRTC_RGB2) != FormatFeature::NONE) {
        compressedFmts += "pvrtc ";
    }

    if (device->getFormatFeatures(Format::ASTC_RGBA_4X4) != FormatFeature::NONE) {
        compressedFmts += "astc ";
    }
}

} // namespace cc::gfx