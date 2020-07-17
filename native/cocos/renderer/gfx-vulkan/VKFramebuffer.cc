#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKFramebuffer.h"
#include "VKRenderPass.h"
#include "VKTexture.h"

namespace cc {
namespace gfx {

CCVKFramebuffer::CCVKFramebuffer(Device *device)
: Framebuffer(device) {
}

CCVKFramebuffer::~CCVKFramebuffer() {
}

bool CCVKFramebuffer::initialize(const FramebufferInfo &info) {
    _renderPass = info.renderPass;
    _colorTextures = info.colorTextures;
    _depthStencilTexture = info.depthStencilTexture;

    _gpuFBO = CC_NEW(CCVKGPUFramebuffer);
    _gpuFBO->gpuRenderPass = ((CCVKRenderPass *)_renderPass)->gpuRenderPass();

    _gpuFBO->gpuColorViews.resize(_colorTextures.size());
    for (size_t i = 0; i < _colorTextures.size(); ++i) {
        CCVKTexture *colorTex = (CCVKTexture *)_colorTextures[i];
        if (colorTex) {
            _gpuFBO->gpuColorViews[i] = colorTex->gpuTextureView();
        }
    }

    if (_depthStencilTexture) {
        _gpuFBO->gpuDepthStencilView = ((CCVKTexture *)_depthStencilTexture)->gpuTextureView();
    }

    CCVKCmdFuncCreateFramebuffer((CCVKDevice *)_device, _gpuFBO);

    _status = Status::SUCCESS;

    return true;
}

void CCVKFramebuffer::destroy() {
    if (_gpuFBO) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuFBO);
        _gpuFBO = nullptr;
    }

    _status = Status::UNREADY;
}

} // namespace gfx
} // namespace cc
