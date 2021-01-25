#include "CoreStd.h"

#include "GFXRenderPass.h"

namespace cc {
namespace gfx {

RenderPass::RenderPass(Device *device)
: GFXObject(ObjectType::RENDER_PASS), _device(device) {
}

RenderPass::~RenderPass() {
}

// Based on render pass compatibility
uint RenderPass::computeHash(const RenderPassInfo &info) {
    uint seed = info.colorAttachments.size() * 2 + 2;
    if (info.subPasses.size()) {
        for (const SubPassInfo &subPass : info.subPasses) {
            for (const uint8_t iaIndex : subPass.inputs) {
                if (iaIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &ia = info.colorAttachments[iaIndex];
                seed ^= (uint)(ia.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ia.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint8_t caIndex : subPass.colors) {
                if (caIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &ca = info.colorAttachments[caIndex];
                seed ^= (uint)(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ca.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            if (subPass.depthStencil < info.colorAttachments.size()) {
                const ColorAttachment &ds = info.colorAttachments[subPass.depthStencil];
                seed ^= (uint)(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ds.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
        }
    } else {
        for (const ColorAttachment &colorAttachment : info.colorAttachments) {
            seed ^= (uint)(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            seed ^= (uint)colorAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        seed ^= (uint)(info.depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)info.depthStencilAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return seed;
}

} // namespace gfx
} // namespace cc
