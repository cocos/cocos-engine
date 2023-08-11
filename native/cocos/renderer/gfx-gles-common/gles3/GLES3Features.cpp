#include "GLES3Commands.h"
#include "gfx-gles-common/loader/gles2w.h"
#include "gfx-gles-common/loader/gles3w.h"
#include "gfx-gles-common/common/GLESDevice.h"

namespace cc::gfx {
#define ALLOW_MULTISAMPLED_RENDER_TO_TEXTURE_ON_DESKTOP 1

void cmdFuncGLES3UpdateFormatFeatures(GLESDevice *device, ccstd::array<FormatFeature, static_cast<size_t>(Format::COUNT)> &formatFeatures) {
    FormatFeature tempFeature = {};

    // builtin
    tempFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::RENDER_TARGET | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE | FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R8)] = tempFeature;
    formatFeatures[toNumber(Format::RG8)] = tempFeature;
    formatFeatures[toNumber(Format::RGB8)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA8)] = tempFeature;

    tempFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::RENDER_TARGET | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    formatFeatures[toNumber(Format::R8SN)] = tempFeature;
    formatFeatures[toNumber(Format::RG8SN)] = tempFeature;
    formatFeatures[toNumber(Format::RGB8SN)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA8SN)] = tempFeature;
    formatFeatures[toNumber(Format::R5G6B5)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA4)] = tempFeature;
    formatFeatures[toNumber(Format::RGB5A1)] = tempFeature;
    formatFeatures[toNumber(Format::RGB10A2)] = tempFeature;

    formatFeatures[toNumber(Format::SRGB8)] = tempFeature;
    formatFeatures[toNumber(Format::SRGB8_A8)] = tempFeature;

    formatFeatures[toNumber(Format::R11G11B10F)] = tempFeature;
    formatFeatures[toNumber(Format::RGB9E5)] = tempFeature;

    formatFeatures[toNumber(Format::DEPTH)] = tempFeature;
    formatFeatures[toNumber(Format::DEPTH_STENCIL)] = tempFeature;

    tempFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::RENDER_TARGET | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE | FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R16F)] = tempFeature;
    formatFeatures[toNumber(Format::RG16F)] = tempFeature;
    formatFeatures[toNumber(Format::RGB16F)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA16F)] = tempFeature;

    tempFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::STORAGE_TEXTURE | FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R32F)] = tempFeature;
    formatFeatures[toNumber(Format::RG32F)] = tempFeature;
    formatFeatures[toNumber(Format::RGB32F)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA32F)] = tempFeature;

    formatFeatures[toNumber(Format::RGB10A2UI)] = FormatFeature::RENDER_TARGET | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE;

    tempFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::RENDER_TARGET | FormatFeature::LINEAR_FILTER | FormatFeature::STORAGE_TEXTURE | FormatFeature::VERTEX_ATTRIBUTE;

    formatFeatures[toNumber(Format::R8I)] = tempFeature;
    formatFeatures[toNumber(Format::R8UI)] = tempFeature;
    formatFeatures[toNumber(Format::R16I)] = tempFeature;
    formatFeatures[toNumber(Format::R16UI)] = tempFeature;
    formatFeatures[toNumber(Format::R32I)] = tempFeature;
    formatFeatures[toNumber(Format::R32UI)] = tempFeature;

    formatFeatures[toNumber(Format::RG8I)] = tempFeature;
    formatFeatures[toNumber(Format::RG8UI)] = tempFeature;
    formatFeatures[toNumber(Format::RG16I)] = tempFeature;
    formatFeatures[toNumber(Format::RG16UI)] = tempFeature;
    formatFeatures[toNumber(Format::RG32I)] = tempFeature;
    formatFeatures[toNumber(Format::RG32UI)] = tempFeature;

    formatFeatures[toNumber(Format::RGB8I)] = tempFeature;
    formatFeatures[toNumber(Format::RGB8UI)] = tempFeature;
    formatFeatures[toNumber(Format::RGB16I)] = tempFeature;
    formatFeatures[toNumber(Format::RGB16UI)] = tempFeature;
    formatFeatures[toNumber(Format::RGB32I)] = tempFeature;
    formatFeatures[toNumber(Format::RGB32UI)] = tempFeature;

    formatFeatures[toNumber(Format::RGBA8I)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA8UI)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA16I)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA16UI)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA32I)] = tempFeature;
    formatFeatures[toNumber(Format::RGBA32UI)] = tempFeature;

    if (device->checkExtension("color_buffer_float")) {
        formatFeatures[toNumber(Format::R32F)] |= FormatFeature::RENDER_TARGET;
        formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::RENDER_TARGET;
        formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::RENDER_TARGET;
    }

    if (device->checkExtension("texture_float_linear")) {
        formatFeatures[toNumber(Format::RGB32F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RGBA32F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::R32F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RG32F)] |= FormatFeature::LINEAR_FILTER;
    }

    if (device->checkExtension("texture_half_float_linear")) {
        formatFeatures[toNumber(Format::RGB16F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RGBA16F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::R16F)] |= FormatFeature::LINEAR_FILTER;
        formatFeatures[toNumber(Format::RG16F)] |= FormatFeature::LINEAR_FILTER;
    }

    const FormatFeature compressedFeature = FormatFeature::SAMPLED_TEXTURE | FormatFeature::LINEAR_FILTER;

    if (device->checkExtension("compressed_ETC1")) {
        formatFeatures[toNumber(Format::ETC_RGB8)] = compressedFeature;
    }

    formatFeatures[toNumber(Format::ETC2_RGB8)] = compressedFeature;
    formatFeatures[toNumber(Format::ETC2_RGBA8)] = compressedFeature;
    formatFeatures[toNumber(Format::ETC2_SRGB8)] = compressedFeature;
    formatFeatures[toNumber(Format::ETC2_SRGB8_A8)] = compressedFeature;
    formatFeatures[toNumber(Format::ETC2_RGB8_A1)] = compressedFeature;
    formatFeatures[toNumber(Format::ETC2_SRGB8_A1)] = compressedFeature;

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

void cmdFuncGLES3UpdateTextureExclusive(GLESDevice *device, ccstd::array<bool, static_cast<size_t>(Format::COUNT)> &textureExclusive) {
    textureExclusive.fill(true);

    textureExclusive[toNumber(Format::R8)] = false;
    textureExclusive[toNumber(Format::RG8)] = false;
    textureExclusive[toNumber(Format::RGB8)] = false;
    textureExclusive[toNumber(Format::R5G6B5)] = false;
    textureExclusive[toNumber(Format::RGBA4)] = false;

    textureExclusive[toNumber(Format::RGB5A1)] = false;
    textureExclusive[toNumber(Format::RGBA8)] = false;
    textureExclusive[toNumber(Format::RGB10A2)] = false;
    textureExclusive[toNumber(Format::RGB10A2UI)] = false;
    textureExclusive[toNumber(Format::SRGB8_A8)] = false;

    textureExclusive[toNumber(Format::R8I)] = false;
    textureExclusive[toNumber(Format::R8UI)] = false;
    textureExclusive[toNumber(Format::R16I)] = false;
    textureExclusive[toNumber(Format::R16UI)] = false;
    textureExclusive[toNumber(Format::R32I)] = false;
    textureExclusive[toNumber(Format::R32UI)] = false;

    textureExclusive[toNumber(Format::RG8I)] = false;
    textureExclusive[toNumber(Format::RG8UI)] = false;
    textureExclusive[toNumber(Format::RG16I)] = false;
    textureExclusive[toNumber(Format::RG16UI)] = false;
    textureExclusive[toNumber(Format::RG32I)] = false;
    textureExclusive[toNumber(Format::RG32UI)] = false;

    textureExclusive[toNumber(Format::RGBA8I)] = false;
    textureExclusive[toNumber(Format::RGBA8UI)] = false;
    textureExclusive[toNumber(Format::RGBA16I)] = false;
    textureExclusive[toNumber(Format::RGBA16UI)] = false;
    textureExclusive[toNumber(Format::RGBA32I)] = false;
    textureExclusive[toNumber(Format::RGBA32UI)] = false;

    textureExclusive[toNumber(Format::DEPTH)] = false;
    textureExclusive[toNumber(Format::DEPTH_STENCIL)] = false;

    if (device->checkExtension("render_snorm")) {
        // https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_render_snorm.txt
        // For 16, see https://www.khronos.org/registry/OpenGL/extensions/EXT/EXT_texture_norm16.txt
        textureExclusive[toNumber(Format::R8SN)] = false;
        textureExclusive[toNumber(Format::RG8SN)] = false;
        textureExclusive[toNumber(Format::RGB8SN)] = false;
        textureExclusive[toNumber(Format::RGBA8SN)] = false;
    }

    if (device->checkExtension("color_buffer_float")) {
        textureExclusive[toNumber(Format::R32F)] = false;
        textureExclusive[toNumber(Format::RG32F)] = false;
        textureExclusive[toNumber(Format::RGBA32F)] = false;
    }
    if (device->checkExtension("color_buffer_half_float")) {
        textureExclusive[toNumber(Format::R16F)] = false;
        textureExclusive[toNumber(Format::RG16F)] = false;
        textureExclusive[toNumber(Format::RGB16F)] = false;
        textureExclusive[toNumber(Format::RGBA16F)] = false;
    }
}

void cmdFuncGLES3UpdateFeatureAndCapabilities(GLESDevice *device, DeviceCaps &caps, GLESGPUConstantRegistry &constantRegistry, ccstd::array<bool, static_cast<size_t>(Feature::COUNT)> &features) {
    glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, reinterpret_cast<GLint *>(&caps.maxVertexAttributes));
    glGetIntegerv(GL_MAX_VERTEX_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&caps.maxVertexUniformVectors));
    glGetIntegerv(GL_MAX_FRAGMENT_UNIFORM_VECTORS, reinterpret_cast<GLint *>(&caps.maxFragmentUniformVectors));
    glGetIntegerv(GL_MAX_UNIFORM_BUFFER_BINDINGS, reinterpret_cast<GLint *>(&caps.maxUniformBufferBindings));
    glGetIntegerv(GL_MAX_UNIFORM_BLOCK_SIZE, reinterpret_cast<GLint *>(&caps.maxUniformBlockSize));
    glGetIntegerv(GL_MAX_DRAW_BUFFERS, reinterpret_cast<GLint *>(&caps.maxColorRenderTargets));
    glGetIntegerv(GL_MAX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&caps.maxTextureUnits));
    glGetIntegerv(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS, reinterpret_cast<GLint *>(&caps.maxVertexTextureUnits));
    glGetIntegerv(GL_MAX_TEXTURE_SIZE, reinterpret_cast<GLint *>(&caps.maxTextureSize));
    glGetIntegerv(GL_MAX_CUBE_MAP_TEXTURE_SIZE, reinterpret_cast<GLint *>(&caps.maxCubeMapTextureSize));
    glGetIntegerv(GL_UNIFORM_BUFFER_OFFSET_ALIGNMENT, reinterpret_cast<GLint *>(&caps.uboOffsetAlignment));
    glGetIntegerv(GL_MAX_ARRAY_TEXTURE_LAYERS, reinterpret_cast<GLint *>(&caps.maxArrayTextureLayers));
    glGetIntegerv(GL_MAX_3D_TEXTURE_SIZE, reinterpret_cast<GLint *>(&caps.max3DTextureSize));

    if (constantRegistry.minorVersion > 0) {
        glGetIntegerv(GL_MAX_IMAGE_UNITS, reinterpret_cast<GLint *>(&caps.maxImageUnits));
        glGetIntegerv(GL_MAX_SHADER_STORAGE_BLOCK_SIZE, reinterpret_cast<GLint *>(&caps.maxShaderStorageBlockSize));
        glGetIntegerv(GL_MAX_SHADER_STORAGE_BUFFER_BINDINGS, reinterpret_cast<GLint *>(&caps.maxShaderStorageBufferBindings));
        glGetIntegerv(GL_MAX_COMPUTE_SHARED_MEMORY_SIZE, reinterpret_cast<GLint *>(&caps.maxComputeSharedMemorySize));
        glGetIntegerv(GL_MAX_COMPUTE_WORK_GROUP_INVOCATIONS, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupInvocations));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 0, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupSize.x));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 1, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupSize.y));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_SIZE, 2, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupSize.z));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 0, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupCount.x));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 1, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupCount.y));
        glGetIntegeri_v(GL_MAX_COMPUTE_WORK_GROUP_COUNT, 2, reinterpret_cast<GLint *>(&caps.maxComputeWorkGroupCount.z));
    }

    if (device->checkExtension("occlusion_query_boolean")) {
        caps.supportQuery = true;
    }

    features[toNumber(Feature::INSTANCED_ARRAYS)] = true;
    features[toNumber(Feature::MULTIPLE_RENDER_TARGETS)] = true;
    features[toNumber(Feature::BLEND_MINMAX)] = true;
    features[toNumber(Feature::ELEMENT_INDEX_UINT)] = true;
    features[toNumber(Feature::RASTERIZATION_ORDER_NOCOHERENT)] = false;
    features[toNumber(Feature::COMPUTE_SHADER)] = constantRegistry.minorVersion > 0;

    ccstd::string fbfLevelStr = "NONE";
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

    features[toNumber(Feature::MULTI_SAMPLE_RESOLVE_DEPTH_STENCIL)] = true;

    // compressed feature
    constantRegistry.compressedFmts = "etc2 ";
    if (device->getFormatFeatures(Format::ETC_RGB8) != FormatFeature::NONE) {
        constantRegistry.compressedFmts += "etc1 ";
    }

    if (device->getFormatFeatures(Format::PVRTC_RGB2) != FormatFeature::NONE) {
        constantRegistry.compressedFmts += "pvrtc ";
    }

    if (device->getFormatFeatures(Format::ASTC_RGBA_4X4) != FormatFeature::NONE) {
        constantRegistry.compressedFmts += "astc ";
    }
}
} // namespace cc::gfx