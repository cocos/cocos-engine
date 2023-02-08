#include "GLESSwapchain.h"
#include "GLESDevice.h"
#include "GLESTexture.h"
#include "egl/WindowSurface.h"

namespace cc::gfx::gles {

Swapchain::Swapchain() {
    _typedID = generateObjectID<decltype(this)>();
}

Swapchain::~Swapchain() {
    destroy();
}

void Swapchain::doInit(const SwapchainInfo &info) {
    // init v-sync
    switch (_vsyncMode) {
        case VsyncMode::OFF: _swapInterval = 0; break;
        case VsyncMode::ON:
        case VsyncMode::RELAXED: _swapInterval = 1; break;
        case VsyncMode::MAILBOX: _swapInterval = 0; break;
        case VsyncMode::HALF: _swapInterval = 2; break;
        default: break;
    }

    // create surface
    doCreateSurface(info.windowHandle);
}

void Swapchain::doDestroy() {
    _colorTexture = nullptr;
    _depthStencilTexture = nullptr;
    doDestroySurface();
}

void Swapchain::doResize(uint32_t width, uint32_t height, SurfaceTransform transform) {
    if (_windowHandle) {
        doCreateSurface(_windowHandle);
    }
}

void Swapchain::doDestroySurface() {
    auto *device = Device::getInstance();
    device->getMainContext()->surfaceDestroy(_surface.get());
    device->getQueue(QueueType::GRAPHICS)->surfaceDestroy(_surface.get());
    device->getQueue(QueueType::TRANSFER)->surfaceDestroy(_surface.get());
    device->waitIdle();
    _surface = nullptr;
}

void Swapchain::doCreateSurface(void *windowHandle) {
    auto *device = Device::getInstance();
    auto *windowSurface = ccnew egl::WindowSurface();
    windowSurface->init(device->getMainContext()->getConfig(), windowHandle);
    _surface = windowSurface;
    _eglWidth = windowSurface->getWidth();
    _eglHeight = windowSurface->getHeight();

    createTexture();
}

void Swapchain::createTexture() {
    // init texture
    if (!_colorTexture) {
        _colorTexture = ccnew Texture();
    }
   
    if (!_depthStencilTexture) {
        _depthStencilTexture = ccnew Texture();
    }

    SwapchainTextureInfo textureInfo;
    textureInfo.swapchain = this;
    textureInfo.format = Format::RGBA8;
    textureInfo.width = static_cast<uint32_t>(_eglWidth);
    textureInfo.height = static_cast<uint32_t>(_eglHeight);
    initTexture(textureInfo, _colorTexture);

    textureInfo.format = Format::DEPTH_STENCIL;
    initTexture(textureInfo, _depthStencilTexture);
}

}
