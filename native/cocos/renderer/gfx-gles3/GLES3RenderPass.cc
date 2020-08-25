#include "GLES3Std.h"
#include "GLES3RenderPass.h"
#include "GLES3Commands.h"

namespace cc {
namespace gfx {

GLES3RenderPass::GLES3RenderPass(Device *device)
: RenderPass(device) {
}

GLES3RenderPass::~GLES3RenderPass() {
}

bool GLES3RenderPass::initialize(const RenderPassInfo &info) {

    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;

    _gpuRenderPass = CC_NEW(GLES3GPURenderPass);
    _gpuRenderPass->colorAttachments = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;

    _hash = computeHash();

    return true;
}

void GLES3RenderPass::destroy() {
    if (_gpuRenderPass) {
        CC_DELETE(_gpuRenderPass);
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
