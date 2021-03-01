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

RenderPass::RenderPass(Device *device)
: GFXObject(ObjectType::RENDER_PASS), _device(device) {
}

RenderPass::~RenderPass() {
}

// Based on render pass compatibility
uint RenderPass::computeHash() {
    // https://stackoverflow.com/questions/20511347/a-good-hash-function-for-a-vector
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
