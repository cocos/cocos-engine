#include "GLESTexture.h"
#include "GLESSwapchain.h"
#include "GLESCommands.h"
#include "GLESDevice.h"

namespace cc::gfx {

GLESTexture::GLESTexture() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESTexture::~GLESTexture() {
    destroy();
}

void GLESTexture::doInit(const TextureInfo & /*info*/) {
    _gpuTexture = ccnew GLESGPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->glSamples = static_cast<GLint>(_info.samples);
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->isPowerOf2 = math::isPowerOfTwo(_info.width) && math::isPowerOfTwo(_info.height);

    if (_info.externalRes != nullptr) {
        // compatibility
        if (!hasAnyFlags(_gpuTexture->flags, TextureFlagBit::EXTERNAL_OES | TextureFlagBit::EXTERNAL_NORMAL)) {
            _gpuTexture->flags |= TextureFlagBit::EXTERNAL_OES;
        }
        _gpuTexture->glTexture = static_cast<GLuint>(reinterpret_cast<size_t>(_info.externalRes));
    }

    glesCreateTexture(GLESDevice::getInstance(), _gpuTexture);

    createTextureView();
}

void GLESTexture::doInit(const TextureViewInfo & /*info*/) {
    _gpuTexture = static_cast<GLESTexture *>(_viewInfo.texture)->gpuTexture();
    CC_ASSERT(_viewInfo.texture->getFormat() == _viewInfo.format);

    createTextureView();
}

void GLESTexture::doInit(const SwapchainTextureInfo & /*info*/) {
    _gpuTexture = ccnew GLESGPUTexture;
    _gpuTexture->type = _info.type;
    _gpuTexture->format = _info.format;
    _gpuTexture->usage = _info.usage;
    _gpuTexture->width = _info.width;
    _gpuTexture->height = _info.height;
    _gpuTexture->depth = _info.depth;
    _gpuTexture->arrayLayer = _info.layerCount;
    _gpuTexture->mipLevel = _info.levelCount;
    _gpuTexture->glSamples = static_cast<GLint>(_info.samples);
    _gpuTexture->flags = _info.flags;
    _gpuTexture->size = _size;
    _gpuTexture->memoryAllocated = false;
    _gpuTexture->swapchain = static_cast<GLESSwapchain *>(_swapchain)->gpuSwapchain();

    createTextureView();
}

void GLESTexture::createTextureView() {
    _gpuTextureView = ccnew GLESGPUTextureView;
    _gpuTextureView->texture = _gpuTexture;
    _gpuTextureView->type = _viewInfo.type;
    _gpuTextureView->format = _viewInfo.format;
    _gpuTextureView->baseLevel = _viewInfo.baseLevel;
    _gpuTextureView->levelCount = _viewInfo.levelCount;
    _gpuTextureView->baseLayer = _viewInfo.baseLayer;
    _gpuTextureView->layerCount = _viewInfo.layerCount;
}

void GLESTexture::doDestroy() {
    _gpuTexture = nullptr;
    _gpuTextureView = nullptr;
}

void GLESTexture::doResize(uint32_t width, uint32_t height, uint32_t size) {
    if (!_gpuTexture->memoryAllocated ||
        hasFlag(_gpuTexture->flags, TextureFlagBit::EXTERNAL_OES) ||
        hasFlag(_gpuTexture->flags, TextureFlagBit::EXTERNAL_NORMAL)) {
        return;
    }

    if (!_gpuTexture->immutable) {
        _gpuTexture->width  = width;
        _gpuTexture->height = height;
        _gpuTexture->size   = size;
        _gpuTexture->isPowerOf2 = math::isPowerOfTwo(_info.width) && math::isPowerOfTwo(_info.height);;
        _gpuTexture->mipLevel = _info.levelCount;

        _gpuTextureView->levelCount = _info.levelCount;
        glesResizeTexture(GLESDevice::getInstance(), _gpuTexture);
        return;
    }
    auto *gpuTexture = ccnew GLESGPUTexture;
    gpuTexture->width  = width;
    gpuTexture->height = height;
    gpuTexture->size   = size;
    gpuTexture->isPowerOf2 = math::isPowerOfTwo(_info.width) && math::isPowerOfTwo(_info.height);;
    gpuTexture->mipLevel = _info.levelCount;

    gpuTexture->depth  = _gpuTexture->depth;
    gpuTexture->type   = _gpuTexture->type;
    gpuTexture->format = _gpuTexture->format;
    gpuTexture->usage  = _gpuTexture->usage;
    gpuTexture->flags  = _gpuTexture->flags;

    gpuTexture->arrayLayer = _gpuTexture->arrayLayer;
    gpuTexture->mipLevel   = _gpuTexture->mipLevel;

    gpuTexture->immutable = _gpuTexture->immutable;
    gpuTexture->useRenderBuffer = _gpuTexture->useRenderBuffer;
    gpuTexture->memoryAllocated = _gpuTexture->memoryAllocated;

    gpuTexture->glInternalFmt  = _gpuTexture->glInternalFmt ;
    gpuTexture->glFormat       = _gpuTexture->glFormat;
    gpuTexture->glType         = _gpuTexture->glType;
    gpuTexture->glUsage        = _gpuTexture->glUsage;
    gpuTexture->glSamples      = _gpuTexture->glSamples;
    gpuTexture->glTexture      = _gpuTexture->glTexture;
    gpuTexture->glRenderbuffer = _gpuTexture->glRenderbuffer;

    gpuTexture->glWrapS = _gpuTexture->glWrapS;
    gpuTexture->glWrapT = _gpuTexture->glWrapT;
    gpuTexture->glMinFilter = _gpuTexture->glMinFilter;
    gpuTexture->glMagFilter = _gpuTexture->glMagFilter;
    gpuTexture->swapchain = _gpuTexture->swapchain;
    _gpuTexture = gpuTexture;
    glesCreateTexture(GLESDevice::getInstance(), _gpuTexture);

    createTextureView();
}

GLESGPUTexture::~GLESGPUTexture() {
    if (hasFlag(flags, TextureFlagBit::EXTERNAL_OES) ||
        hasFlag(flags, TextureFlagBit::EXTERNAL_NORMAL)) {
        return;
    }
    GLESDevice::getInstance()->recycleBin()->collect(this);
}
} // namespace cc::gfx
