#include "GLESRenderPass.h"
#include "GLESDevice.h"
#include "GLESCommands.h"

namespace cc::gfx {

GLESRenderPass::GLESRenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

GLESRenderPass::~GLESRenderPass() {
    destroy();
}

void GLESRenderPass::doInit(const RenderPassInfo & /*info*/) {
    _gpuRenderPass = ccnew GLESGPURenderPass;
    _gpuRenderPass->colorAttachments = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
    _gpuRenderPass->depthStencilResolveAttachment = _depthStencilResolveAttachment;
    _gpuRenderPass->subpasses = _subpasses;
    _gpuRenderPass->dependencies = _dependencies;

    // assign a dummy subpass if not specified
    auto colorCount = static_cast<uint32_t>(_gpuRenderPass->colorAttachments.size());
    if (_gpuRenderPass->subpasses.empty()) {
        _gpuRenderPass->subpasses.emplace_back();
        auto &subpass = _gpuRenderPass->subpasses.back();
        subpass.colors.resize(_colorAttachments.size());
        for (uint32_t i = 0U; i < _colorAttachments.size(); ++i) {
            subpass.colors[i] = i;
        }
        if (_depthStencilAttachment.format != Format::UNKNOWN) {
            subpass.depthStencil = colorCount;
        }
        if (_depthStencilResolveAttachment.format != Format::UNKNOWN) {
            subpass.depthStencil = colorCount + 1;
        }
    } else {
        // unify depth stencil index
        for (auto &subpass : _gpuRenderPass->subpasses) {
            if (subpass.depthStencil != INVALID_BINDING && subpass.depthStencil >= colorCount) {
                subpass.depthStencil = colorCount;
            }
            if (subpass.depthStencilResolve != INVALID_BINDING && subpass.depthStencil >= colorCount) {
                subpass.depthStencilResolve = colorCount + 1;
            }
        }
    }
    glesCreateRenderPass(GLESDevice::getInstance(), _gpuRenderPass);
}

void GLESRenderPass::doDestroy() {
    _gpuRenderPass = nullptr;
}

} // namespace cc::gfx
