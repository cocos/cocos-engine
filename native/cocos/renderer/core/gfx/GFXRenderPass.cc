#include "CoreStd.h"
#include "GFXRenderPass.h"

NS_CC_BEGIN

GFXRenderPass::GFXRenderPass(GFXDevice* device)
: GFXObject(GFXObjectType::RENDER_PASS)
, _device(device) {
}

GFXRenderPass::~GFXRenderPass() {
}

uint GFXRenderPass::computeHash() const
{
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
    // 6: GFXColorAttament has 6 elements.
    // 8: GFXDepthStencilAttachment has 8 elements.
    uint seed = _colorAttachments.size() * 6 + 8;
    for (const auto& colorAttachment : _colorAttachments)
    {
        seed ^= (uint)(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)(colorAttachment.loadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)(colorAttachment.storeOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= colorAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)(colorAttachment.beginLayout) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)(colorAttachment.endLayout) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }
    
    seed ^= (uint)(_depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.depthLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.depthStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.stencilLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.depthStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= _depthStencilAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.beginLayout) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    seed ^= (uint)(_depthStencilAttachment.endLayout) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    
    return seed;
}

NS_CC_END
