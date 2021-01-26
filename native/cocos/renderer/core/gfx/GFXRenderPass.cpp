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
uint RenderPass::computeHash() {
    uint seed = _colorAttachments.size() * 2 + 2;
    if (_subpasses.size()) {
        for (const SubpassInfo &subPass : _subpasses) {
            for (const uint8_t iaIndex : subPass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ia = _colorAttachments[iaIndex];
                seed ^= (uint)(ia.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ia.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint8_t caIndex : subPass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[caIndex];
                seed ^= (uint)(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ca.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            if (subPass.depthStencil < _colorAttachments.size()) {
                const ColorAttachment &ds = _colorAttachments[subPass.depthStencil];
                seed ^= (uint)(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= (uint)ds.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
        }
    } else {
        for (const ColorAttachment &colorAttachment : _colorAttachments) {
            seed ^= (uint)(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            seed ^= (uint)colorAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        seed ^= (uint)(_depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= (uint)_depthStencilAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return seed;
}

} // namespace gfx
} // namespace cc
