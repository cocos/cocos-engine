#include "GLES3Std.h"
#include "GLES3Framebuffer.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"
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

    _gpuFBO = CC_NEW(GLES3GPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((GLES3RenderPass *)_renderPass)->gpuRenderPass();
    _gpuFBO->depthStencilMipmapLevel = info.depthStencilMipmapLevel;
    for (uint mipLevel : info.colorMipmapLevels) {
        _gpuFBO->colorMipmapLevels.push_back(mipLevel);
    }

    _gpuFBO->gpuColorTextures.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        GLES3Texture *colorTexture = (GLES3Texture *)_colorTextures[i];
        if (colorTexture) {
            _gpuFBO->gpuColorTextures[i] = colorTexture->gpuTexture();
        }
    }

    if (_depthStencilTexture) {
        _gpuFBO->gpuDepthStencilTexture = ((GLES3Texture *)_depthStencilTexture)->gpuTexture();
    }

    GLES3CmdFuncCreateFramebuffer((GLES3Device *)_device, _gpuFBO);

    _status = Status::SUCCESS;

    return true;
}

void GLES3Framebuffer::destroy() {
    if (_gpuFBO) {
        GLES3CmdFuncDestroyFramebuffer((GLES3Device *)_device, _gpuFBO);
        CC_DELETE(_gpuFBO);
        _gpuFBO = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
