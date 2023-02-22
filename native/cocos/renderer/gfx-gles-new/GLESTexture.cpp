#include "GLESTexture.h"
#include "GLESConversion.h"
#include "GLESCore.h"
#include "GLESSwapchain.h"

namespace cc::gfx::gles {

static const GLint GL_SAMPLE_COUNT[] = {
    1,
    2,
#if CC_PLATFORM == CC_PLATFORM_ANDROID || CC_PLATFORM == CC_PLATFORM_IOS
    4,
#else
    8,
#endif
    16,
};

static const TextureUsage USAGE_COLOR_OR_DS = TextureUsageBit::COLOR_ATTACHMENT | TextureUsageBit::DEPTH_STENCIL_ATTACHMENT;

static bool usageSampled(TextureUsage usage) { return (usage & TextureUsageBit::SAMPLED) == TextureUsageBit::SAMPLED; }
static bool usageStorage(TextureUsage usage) { return (usage & TextureUsageBit::STORAGE) == TextureUsageBit::STORAGE; }
static bool usageAttachment(TextureUsage usage) { return (usage & USAGE_COLOR_OR_DS) == USAGE_COLOR_OR_DS; }

static uint32_t getSampleCount(const InternalFormat &format, SampleCount samples) {
    if (samples == SampleCount::ONE) {
        return 1;
    }

    auto requestedSampleCount = GL_SAMPLE_COUNT[static_cast<uint32_t>(samples)];
    GLint size = 0;
    ccstd::vector<GLint> supportedSampleCounts;

    // target must be GL_RENDERBUFFER
    GL_CHECK(glGetInternalformativ(GL_RENDERBUFFER, format.internalFormat, GL_NUM_SAMPLE_COUNTS, 1, &size));
    supportedSampleCounts.resize(size);
    GL_CHECK(glGetInternalformativ(GL_RENDERBUFFER, format.internalFormat, GL_SAMPLES, size, supportedSampleCounts.data()));

    for (GLint sampleCount : supportedSampleCounts) {
        if (sampleCount <= requestedSampleCount) {
            return sampleCount;
        }
    }
    return 1;
}


Texture::Texture() {
    _typedID = generateObjectID<decltype(this)>();
}

Texture::~Texture() {
    destroy();
}

void Texture::initGPUTexture(uint32_t width, uint32_t height, uint32_t size) {
    const auto &formatType = getInternalType(_info.format);
    bool useSample = usageSampled(_info.usage);
    bool useUAV = usageStorage(_info.usage);
    bool useAttachment = usageAttachment(_info.usage);
    auto *gpuTexture = ccnew GPUTexture();
    gpuTexture->sampleCount = getSampleCount(formatType, _info.samples);
    gpuTexture->type = _info.type;
    gpuTexture->width = width;
    gpuTexture->height = height;
    gpuTexture->depth = _info.depth;
    gpuTexture->mipLevel = _info.levelCount;
    gpuTexture->arrayLayer = _info.layerCount;
    gpuTexture->size = size;
    gpuTexture->format = &formatType;

    if (_swapchain != nullptr) {
        gpuTexture->surface = static_cast<Swapchain *>(_swapchain)->getSurface()->getNativeHandle();
    } else if (!useSample && !useUAV && useAttachment) {
        gpuTexture->initRenderBuffer();
    } else {
        gpuTexture->initTexture();
    }
    _gpuTextureView = ccnew GPUTextureView();
    _gpuTextureView->texture = gpuTexture;
    _gpuTextureView->baseLayer = 0;
    _gpuTextureView->baseLevel = 0;
    _gpuTextureView->layerCount = _info.layerCount;
    _gpuTextureView->levelCount = _info.levelCount;
}

void Texture::doInit(const TextureInfo &info) {
    std::ignore = info;
    initGPUTexture(_info.width, _info.height, _size);
}

void Texture::doInit(const TextureViewInfo &info) {
    auto *source = static_cast<Texture*>(info.texture);
    _gpuTextureView = ccnew GPUTextureView();
    _gpuTextureView->texture = source->_gpuTextureView->texture;
    _gpuTextureView->baseLayer = info.baseLayer;
    _gpuTextureView->baseLevel = info.baseLevel;
    _gpuTextureView->layerCount = info.layerCount;
    _gpuTextureView->levelCount = info.levelCount;
}

void Texture::doInit(const SwapchainTextureInfo &info) {
    std::ignore = info;
    initGPUTexture(_info.width, _info.height, _size);
}

void Texture::doDestroy() {
    _gpuTextureView = nullptr;
}

void Texture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    initGPUTexture(width, height, size);
}

// GPU Texture
GPUTexture::~GPUTexture() noexcept {
    if (texId != 0) {
        if (isRenderBuffer) {
            glDeleteRenderbuffers(1, &texId);
        } else {
            glDeleteTextures(1, &texId);
        }
    }
}

void GPUTexture::initRenderBuffer() {
    CC_ASSERT(type == TextureType::TEX2D);

    GL_CHECK(glGenRenderbuffers(1, &texId));
    if (size > 0) {
        glBindRenderbuffer(GL_RENDERBUFFER, texId);
        if (sampleCount > 1) {
            GL_CHECK(glRenderbufferStorageMultisampleEXT(GL_RENDERBUFFER, sampleCount, format->internalFormat, width, height));
        } else {
            GL_CHECK(glRenderbufferStorage(GL_RENDERBUFFER, format->internalFormat, width, height));
        }
    }
    isRenderBuffer = true;
}

void GPUTexture::initTexture() {
    GL_CHECK(glGenTextures(1, &texId));
    if (size == 0) {
        return;
    }

    switch (type) {
        case TextureType::TEX2D:
            target = GL_TEXTURE_2D;
            GL_CHECK(glBindTexture(target, texId));
            GL_CHECK(glTexStorage2D(GL_TEXTURE_2D, mipLevel, format->internalFormat, width, height));
            break;
        case TextureType::TEX3D:
            target = GL_TEXTURE_3D;
            GL_CHECK(glBindTexture(target, texId));
            GL_CHECK(glTexStorage3D(GL_TEXTURE_3D, mipLevel, format->internalFormat, width, height, depth));
            break;
        case TextureType::CUBE:
            target = GL_TEXTURE_CUBE_MAP;
            GL_CHECK(glBindTexture(target, texId));
            GL_CHECK(glTexStorage2D(GL_TEXTURE_CUBE_MAP, mipLevel, format->internalFormat, width, height));
            break;
        case TextureType::TEX2D_ARRAY:
            target = GL_TEXTURE_2D_ARRAY;
            GL_CHECK(glBindTexture(target, texId));
            GL_CHECK(glTexStorage3D(GL_TEXTURE_2D_ARRAY, mipLevel, format->internalFormat, width, height, arrayLayer));
            break;
        default:
            CC_ABORT();
    }
    GL_CHECK(glBindTexture(target, 0));
}

} // namespace cc::gfx::gles
