#include "GLES3Std.h"
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
#include "GLES3Context.h"
#include "GLES3Texture.h"

namespace cc {
namespace gfx {

GLES3Framebuffer::GLES3Framebuffer(Device *device)
: Framebuffer(device) {
}

GLES3Framebuffer::~GLES3Framebuffer() {
}

bool GLES3Framebuffer::initialize(const FramebufferInfo &info) {

    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;
    _isOffscreen = info.isOffscreen;

    _gpuFBO = CC_NEW(GLES3GPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((GLES3RenderPass *)_renderPass)->gpuRenderPass();
    _gpuFBO->depstencilMipmapLevel = info.depthStencilMipmapLevel;
    _gpuFBO->colorMipmapLevels = info.colorMipmapLevels;

    if (_isOffscreen) {
        _gpuFBO->gpuColorTextures.resize(_colorTextures.size());
        for (size_t i = 0; i < _colorTextures.size(); ++i) {
            GLES3Texture *colorTexture = (GLES3Texture *)_colorTextures[i];
            _gpuFBO->gpuColorTextures[i] = colorTexture->gpuTexture();
        }

        if (_depthStencilTexture) {
            _gpuFBO->gpuDepthStencilTexture = ((GLES3Texture *)_depthStencilTexture)->gpuTexture();
        }

        _gpuFBO->isOffscreen = _isOffscreen;

        GLES3CmdFuncCreateFramebuffer((GLES3Device *)_device, _gpuFBO);
    }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    else {
        _gpuFBO->glFramebuffer = static_cast<GLES3Context *>(_device->getContext())->getDefaultFramebuffer();
    }
#endif

    _status = Status::SUCCESS;

    return true;
}

void GLES3Framebuffer::destroy() {
    if (_gpuFBO) {
        if (isOffscreen())
            GLES3CmdFuncDestroyFramebuffer((GLES3Device *)_device, _gpuFBO);
        CC_DELETE(_gpuFBO);
        _gpuFBO = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
