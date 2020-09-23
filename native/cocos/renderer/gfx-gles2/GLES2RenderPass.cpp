#include "GLES2Std.h"
#include "GLES2RenderPass.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

GLES2RenderPass::GLES2RenderPass(Device *device)
: RenderPass(device) {
}

GLES2RenderPass::~GLES2RenderPass() {
}

bool GLES2RenderPass::initialize(const RenderPassInfo &info) {

    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;

    _gpuRenderPass = CC_NEW(GLES2GPURenderPass);
    _gpuRenderPass->colorAttachments = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;

    _hash = computeHash();

    return true;
}

void GLES2RenderPass::destroy() {
    if (_gpuRenderPass) {
        CC_DELETE(_gpuRenderPass);
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
