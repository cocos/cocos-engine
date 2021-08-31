/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "base/CoreStd.h"

#include "GFXObject.h"
#include "GFXRenderPass.h"

namespace cc {
namespace gfx {

RenderPass::RenderPass()
: GFXObject(ObjectType::RENDER_PASS) {
}

RenderPass::~RenderPass() = default;

// Based on render pass compatibility
uint RenderPass::computeHash() {
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
    uint seed = 0;
    if (!_subpasses.empty()) {
        for (const SubpassInfo &subPass : _subpasses) {
            for (const uint iaIndex : subPass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint caIndex : subPass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint raIndex : subPass.resolves) {
                if (raIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint paIndex : subPass.preserves) {
                if (paIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            if (subPass.depthStencil != INVALID_BINDING) {
                seed += 2;
            }
        }
        for (const SubpassInfo &subpass : _subpasses) {
            for (const uint iaIndex : subpass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ia = _colorAttachments[iaIndex];
                seed ^= static_cast<uint>(ia.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint>(ia.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint caIndex : subpass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[caIndex];
                seed ^= static_cast<uint>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint raIndex : subpass.resolves) {
                if (raIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[raIndex];
                seed ^= static_cast<uint>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint paIndex : subpass.preserves) {
                if (paIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[paIndex];
                seed ^= static_cast<uint>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            if (subpass.depthStencil != INVALID_BINDING) {
                if (subpass.depthStencil < _colorAttachments.size()) {
                    const auto &ds = _colorAttachments[subpass.depthStencil];
                    seed ^= static_cast<uint>(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                    seed ^= static_cast<uint>(ds.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                } else {
                    const auto &ds = _depthStencilAttachment;
                    seed ^= static_cast<uint>(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                    seed ^= static_cast<uint>(ds.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                }
            }
        }
    } else {
        seed = static_cast<uint>(_colorAttachments.size() * 2 + 2);
        for (const ColorAttachment &colorAttachment : _colorAttachments) {
            seed ^= static_cast<uint>(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            seed ^= static_cast<uint>(colorAttachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        seed ^= static_cast<uint>(_depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(_depthStencilAttachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return seed;
}

uint RenderPass::computeHash(const RenderPassInfo &info) {
    static auto computeAttachmentHash = [](const ColorAttachment &attachment, uint &seed) {
        seed ^= static_cast<uint>(attachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.loadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.storeOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        for (AccessType type : attachment.beginAccesses) {
            seed ^= static_cast<uint>(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        for (AccessType type : attachment.endAccesses) {
            seed ^= static_cast<uint>(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
    };
    static auto computeDSAttachmentHash = [](const DepthStencilAttachment &attachment, uint &seed) {
        seed ^= static_cast<uint>(attachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.depthLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.depthStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.stencilLoadOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint>(attachment.stencilStoreOp) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        for (AccessType type : attachment.beginAccesses) {
            seed ^= static_cast<uint>(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        for (AccessType type : attachment.endAccesses) {
            seed ^= static_cast<uint>(type) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
    };
    uint seed = 0;
    if (!info.subpasses.empty()) {
        for (const SubpassInfo &subpass : info.subpasses) {
            for (const uint iaIndex : subpass.inputs) {
                if (iaIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &ia = info.colorAttachments[iaIndex];
                seed += 4 + ia.beginAccesses.size() + ia.endAccesses.size();
            }
            for (const uint caIndex : subpass.colors) {
                if (caIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &ca = info.colorAttachments[caIndex];
                seed += 4 + ca.beginAccesses.size() + ca.endAccesses.size();
            }
            for (const uint raIndex : subpass.resolves) {
                if (raIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &ra = info.colorAttachments[raIndex];
                seed += 4 + ra.beginAccesses.size() + ra.endAccesses.size();
            }
            for (const uint paIndex : subpass.preserves) {
                if (paIndex >= info.colorAttachments.size()) break;
                const ColorAttachment &pa = info.colorAttachments[paIndex];
                seed += 4 + pa.beginAccesses.size() + pa.endAccesses.size();
            }
            if (subpass.depthStencil != INVALID_BINDING) {
                if (subpass.depthStencil < info.colorAttachments.size()) {
                    const auto &ds = info.colorAttachments[subpass.depthStencil];
                    seed += 4 + ds.beginAccesses.size() + ds.endAccesses.size();
                } else {
                    const auto &ds = info.depthStencilAttachment;
                    seed += 6 + ds.beginAccesses.size() + ds.endAccesses.size();
                }
            }
        }
        for (const SubpassInfo &subpass : info.subpasses) {
            for (const uint iaIndex : subpass.inputs) {
                if (iaIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[iaIndex], seed);
            }
            for (const uint caIndex : subpass.colors) {
                if (caIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[caIndex], seed);
            }
            for (const uint raIndex : subpass.resolves) {
                if (raIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[raIndex], seed);
            }
            for (const uint paIndex : subpass.preserves) {
                if (paIndex >= info.colorAttachments.size()) break;
                computeAttachmentHash(info.colorAttachments[paIndex], seed);
            }
            if (subpass.depthStencil != INVALID_BINDING) {
                if (subpass.depthStencil < info.colorAttachments.size()) {
                    computeAttachmentHash(info.colorAttachments[subpass.depthStencil], seed);
                } else {
                    computeDSAttachmentHash(info.depthStencilAttachment, seed);
                }
            }
        }
    } else {
        for (const ColorAttachment &ca : info.colorAttachments) {
            seed += 4 + ca.beginAccesses.size() + ca.endAccesses.size();
        }
        seed += 6 + info.depthStencilAttachment.beginAccesses.size() + info.depthStencilAttachment.endAccesses.size();

        for (const ColorAttachment &ca : info.colorAttachments) {
            computeAttachmentHash(ca, seed);
        }
        computeDSAttachmentHash(info.depthStencilAttachment, seed);
    }

    return seed;
}

void RenderPass::initialize(const RenderPassInfo &info) {
    _colorAttachments       = info.colorAttachments;
    _depthStencilAttachment = info.depthStencilAttachment;
    _subpasses              = info.subpasses;
    _dependencies           = info.dependencies;
    _hash                   = computeHash();

    doInit(info);
}

void RenderPass::destroy() {
    doDestroy();

    _colorAttachments.clear();
    _subpasses.clear();
    _hash = 0U;
}

} // namespace gfx
} // namespace cc
