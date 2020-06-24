#include "GLES2Std.h"
#include "GLES2Framebuffer.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"
#include "GLES2Context.h"
#include "GLES2Texture.h"

namespace cc {
namespace gfx {

GLES2Framebuffer::GLES2Framebuffer(Device *device)
: Framebuffer(device) {
}

GLES2Framebuffer::~GLES2Framebuffer() {
}

bool GLES2Framebuffer::initialize(const FramebufferInfo &info) {

    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;
    _isOffscreen = info.isOffscreen;

    if (info.depthStencilMipmapLevel != 0) {
        CC_LOG_WARNING("Mipmap level of depth stencil attachment should be 0 in GLES2. Convert to 0.");
    }
    if (info.colorMipmapLevels.size() > 0) {
        int i = 0;
        for (const auto mipmapLevel : info.colorMipmapLevels) {
            if (mipmapLevel != 0) {
                CC_LOG_WARNING("Mipmap level of color attachment %d should be 0 in GLES2. Convert to 0.", i);
            }
            ++i;
        }
    }

    _gpuFBO = CC_NEW(GLES2GPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((GLES2RenderPass *)_renderPass)->gpuRenderPass();

    if (_isOffscreen) {
        _gpuFBO->gpuColorTextures.resize(_colorTextures.size());
        for (size_t i = 0; i < _colorTextures.size(); ++i) {
            GLES2Texture *colorTexture = (GLES2Texture *)_colorTextures[i];
            _gpuFBO->gpuColorTextures[i] = colorTexture->gpuTexture();
        }

        if (_depthStencilTexture) {
            _gpuFBO->gpuDepthStencilTexture = ((GLES2Texture *)_depthStencilTexture)->gpuTexture();
        }

        _gpuFBO->isOffscreen = _isOffscreen;

        GLES2CmdFuncCreateFramebuffer((GLES2Device *)_device, _gpuFBO);
    }
#if (CC_PLATFORM == CC_PLATFORM_MAC_IOS)
    else {
        _gpuFBO->glFramebuffer = static_cast<GLES2Context *>(_device->getContext())->getDefaultFramebuffer();
    }
#endif
    _status = Status::SUCCESS;
    return true;
}

void GLES2Framebuffer::destroy() {
    if (_gpuFBO) {
        if (isOffscreen())
            GLES2CmdFuncDestroyFramebuffer((GLES2Device *)_device, _gpuFBO);
        CC_DELETE(_gpuFBO);
        _gpuFBO = nullptr;
    }
    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
