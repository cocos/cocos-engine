#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKRenderPass.h"

namespace cc {
namespace gfx {

CCVKRenderPass::CCVKRenderPass(Device *device)
: RenderPass(device) {
}

CCVKRenderPass::~CCVKRenderPass() {
}

bool CCVKRenderPass::initialize(const RenderPassInfo &info) {
    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subPasses = info.subPasses;

    _gpuRenderPass = CC_NEW(CCVKGPURenderPass);
    _gpuRenderPass->colorAttachments = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
    _gpuRenderPass->subPasses = _subPasses;
    CCVKCmdFuncCreateRenderPass((CCVKDevice *)_device, _gpuRenderPass);

    _hash = computeHash();

    return true;
}

void CCVKRenderPass::destroy() {
    if (_gpuRenderPass) {
        ((CCVKDevice *)_device)->gpuRecycleBin()->collect(_gpuRenderPass);
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
