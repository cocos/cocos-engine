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
#include "base/Utils.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

RenderPass::RenderPass()
: GFXObject(ObjectType::RENDER_PASS) {
}

RenderPass::~RenderPass() = default;

// Based on render pass compatibility
uint32_t RenderPass::computeHash() {
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
    uint32_t seed = 0;
    if (!_subpasses.empty()) {
        for (const SubpassInfo &subPass : _subpasses) {
            for (const uint32_t iaIndex : subPass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint32_t caIndex : subPass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint32_t raIndex : subPass.resolves) {
                if (raIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            for (const uint32_t paIndex : subPass.preserves) {
                if (paIndex >= _colorAttachments.size()) break;
                seed += 2;
            }
            if (subPass.depthStencil != INVALID_BINDING) {
                seed += 2;
            }
        }
        for (const SubpassInfo &subpass : _subpasses) {
            for (const uint32_t iaIndex : subpass.inputs) {
                if (iaIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ia = _colorAttachments[iaIndex];
                seed ^= static_cast<uint32_t>(ia.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint32_t>(ia.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint32_t caIndex : subpass.colors) {
                if (caIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[caIndex];
                seed ^= static_cast<uint32_t>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint32_t>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint32_t raIndex : subpass.resolves) {
                if (raIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[raIndex];
                seed ^= static_cast<uint32_t>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint32_t>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            for (const uint32_t paIndex : subpass.preserves) {
                if (paIndex >= _colorAttachments.size()) break;
                const ColorAttachment &ca = _colorAttachments[paIndex];
                seed ^= static_cast<uint32_t>(ca.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                seed ^= static_cast<uint32_t>(ca.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            }
            if (subpass.depthStencil != INVALID_BINDING) {
                if (subpass.depthStencil < _colorAttachments.size()) {
                    const auto &ds = _colorAttachments[subpass.depthStencil];
                    seed ^= static_cast<uint32_t>(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                    seed ^= static_cast<uint32_t>(ds.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                } else {
                    const auto &ds = _depthStencilAttachment;
                    seed ^= static_cast<uint32_t>(ds.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                    seed ^= static_cast<uint32_t>(ds.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
                }
            }
        }
    } else {
        seed = static_cast<uint32_t>(_colorAttachments.size() * 2 + 2);
        for (const ColorAttachment &colorAttachment : _colorAttachments) {
            seed ^= static_cast<uint32_t>(colorAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
            seed ^= static_cast<uint32_t>(colorAttachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        }
        seed ^= static_cast<uint32_t>(_depthStencilAttachment.format) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
        seed ^= static_cast<uint32_t>(_depthStencilAttachment.sampleCount) + 0x9e3779b9 + (seed << 6) + (seed >> 2);
    }

    return seed;
}

uint32_t RenderPass::computeHash(const RenderPassInfo &info) {
    std::hash<RenderPassInfo> hasher;
    return utils::toUint(hasher(info));
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
