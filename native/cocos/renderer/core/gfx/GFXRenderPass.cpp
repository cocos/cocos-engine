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
uint RenderPass::computeHash() const {
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
    size_t seed = _colorAttachments.size() * 2 + 2;
    if (_subPasses.size()) {
        for (const auto &subPass : _subPasses) {
            for (const auto &iaIndex : subPass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                const auto ia = _colorAttachments[iaIndex];
                seed ^= (uint)(ia.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= ia.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const auto &caIndex : subPass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                const auto ca = _colorAttachments[caIndex];
                seed ^= (uint)(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= ca.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            if (subPass.depthStencil < _colorAttachments.size()) {
                const auto ds = _colorAttachments[subPass.depthStencil];
                seed ^= (uint)(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= ds.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
        }
    } else {
        for (const auto &colorAttachment : _colorAttachments) {
            seed ^= (uint)(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            seed ^= colorAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        seed ^= (uint)(_depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= _depthStencilAttachment.sampleCount + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return static_cast<uint>(seed);
}

} // namespace gfx
} // namespace cc
