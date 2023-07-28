#include "GLESFramebuffer.h"
#include "GLESTexture.h"
#include "GLESRenderPass.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

GLESFramebuffer::GLESFramebuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESFramebuffer::~GLESFramebuffer() {
    destroy();
}

void GLESFramebuffer::updateExtent() {
    if (!_colorTextures.empty()) {
        const auto *tex = _colorTextures[0];
        _gpuFBO->width = tex->getWidth();
        _gpuFBO->height = tex->getHeight();
        return;
    }
    if (_depthStencilTexture != nullptr) {
        _gpuFBO->width = _depthStencilTexture->getWidth();
        _gpuFBO->height = _depthStencilTexture->getHeight();
        return;
    }
}

void GLESFramebuffer::doInit(const FramebufferInfo & /*info*/) {
    _gpuFBO = ccnew GLESGPUFramebuffer;
    updateExtent();

    _gpuFBO->gpuRenderPass = static_cast<GLESRenderPass *>(_renderPass)->gpuRenderPass();
    _gpuFBO->gpuColorViews.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        auto *colorTexture = static_cast<GLESTexture *>(_colorTextures.at(i));
        _gpuFBO->gpuColorViews[i] = colorTexture->gpuTextureView();
    }

    if (_depthStencilTexture) {
        auto *depthTexture = static_cast<GLESTexture *>(_depthStencilTexture);
        _gpuFBO->gpuDepthStencilView = depthTexture->gpuTextureView();
    }

    if (_depthStencilResolveTexture) {
        auto *depthTexture = static_cast<GLESTexture *>(_depthStencilResolveTexture);
        _gpuFBO->gpuDepthStencilResolveView = depthTexture->gpuTextureView();
    }
    glesCreateFramebuffer(GLESDevice::getInstance(), _gpuFBO, 0);
}

void GLESFramebuffer::doDestroy() {
    _gpuFBO = nullptr;
}

} // namespace cc::gfx
