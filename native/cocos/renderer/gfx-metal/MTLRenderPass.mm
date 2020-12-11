#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLRenderPass.h"
#include "MTLUtils.h"

namespace cc {
namespace gfx {

CCMTLRenderPass::CCMTLRenderPass(Device *device) : RenderPass(device) {}

bool CCMTLRenderPass::initialize(const RenderPassInfo &info) {
    _colorAttachments = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _renderTargetSizes.resize(_colorAttachments.size());

    _mtlRenderPassDescriptor = [[MTLRenderPassDescriptor alloc] init];

    int i = 0;
    for (const auto &colorAttachment : _colorAttachments) {
        _mtlRenderPassDescriptor.colorAttachments[i].loadAction = mu::toMTLLoadAction(colorAttachment.loadOp);
        _mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::toMTLStoreAction(colorAttachment.storeOp);

        ++i;
    }
    _colorRenderTargetNums = i;
    _mtlRenderPassDescriptor.depthAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.depthLoadOp);
    _mtlRenderPassDescriptor.depthAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depthStoreOp);
    _mtlRenderPassDescriptor.stencilAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.stencilLoadOp);
    _mtlRenderPassDescriptor.stencilAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.stencilStoreOp);

    _hash = computeHash();

    return true;
}

void CCMTLRenderPass::destroy() {
    if (_mtlRenderPassDescriptor) {
        [_mtlRenderPassDescriptor release];
        _mtlRenderPassDescriptor = nil;
    }
}

void CCMTLRenderPass::setColorAttachment(size_t slot, id<MTLTexture> texture, int level) {
    if (!_mtlRenderPassDescriptor) {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        return;
    }

    if (_colorRenderTargetNums < slot) {
        CC_LOG_ERROR("CCMTLRenderPass: invalid color attachment slot %d.", slot);
        return;
    }

    _mtlRenderPassDescriptor.colorAttachments[slot].texture = texture;
    _mtlRenderPassDescriptor.colorAttachments[slot].level = level;
    _renderTargetSizes[slot] = {static_cast<float>(texture.width), static_cast<float>(texture.height)};
}

void CCMTLRenderPass::setDepthStencilAttachment(id<MTLTexture> texture, int level) {
    if (!_mtlRenderPassDescriptor) {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        return;
    }

    _mtlRenderPassDescriptor.depthAttachment.texture = texture;
    _mtlRenderPassDescriptor.depthAttachment.level = level;
    _mtlRenderPassDescriptor.stencilAttachment.texture = texture;
    _mtlRenderPassDescriptor.stencilAttachment.level = level;
}

} // namespace gfx
} // namespace cc
