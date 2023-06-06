/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include <QuartzCore/CAMetalLayer.h>
#include "MTLDevice.h"
#include "MTLRenderPass.h"
#include "MTLUtils.h"
#include "MTLTexture.h"
#include "MTLSwapchain.h"
#include "base/Log.h"

namespace cc {
namespace gfx {

CCMTLRenderPass::CCMTLRenderPass() : RenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLRenderPass::~CCMTLRenderPass() {
    destroy();
}

void CCMTLRenderPass::doInit(const RenderPassInfo& info) {
    _renderTargetSizes.resize(_colorAttachments.size());
    _mtlRenderPassDescriptor = [[MTLRenderPassDescriptor alloc] init];

    uint32_t i = 0;
    for (const auto& colorAttachment : _colorAttachments) {
        _mtlRenderPassDescriptor.colorAttachments[i].loadAction = mu::toMTLLoadAction(colorAttachment.loadOp);
        _mtlRenderPassDescriptor.colorAttachments[i].storeAction = mu::toMTLStoreAction(colorAttachment.storeOp);

        ++i;
    }
    _colorRenderTargetNums = i;
    _mtlRenderPassDescriptor.depthAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.depthLoadOp);
    _mtlRenderPassDescriptor.depthAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.depthStoreOp);
    _mtlRenderPassDescriptor.stencilAttachment.loadAction = mu::toMTLLoadAction(_depthStencilAttachment.stencilLoadOp);
    _mtlRenderPassDescriptor.stencilAttachment.storeAction = mu::toMTLStoreAction(_depthStencilAttachment.stencilStoreOp);
    
    uint32_t colorCount = utils::toUint(_colorAttachments.size());
    if (_subpasses.empty()) {
        _subpasses.emplace_back();
        auto &subpass = _subpasses.back();
        subpass.colors.resize(_colorAttachments.size());
        for (uint32_t i = 0U; i < _colorAttachments.size(); ++i) {
            subpass.colors[i] = i;
        }
        if (_depthStencilAttachment.format != Format::UNKNOWN) {
            subpass.depthStencil = colorCount;
        }
    } else {
        // unify depth stencil index
        for (auto &subpass : _subpasses) {
            if (subpass.depthStencil != INVALID_BINDING && subpass.depthStencil > colorCount) {
                subpass.depthStencil = colorCount;
            }
            if (subpass.depthStencilResolve != INVALID_BINDING && subpass.depthStencilResolve > colorCount) {
                subpass.depthStencilResolve = colorCount;
            }
        }
    }

    _colorIndices.resize(_colorAttachments.size(), INVALID_BINDING);
    _drawBuffers.resize(_subpasses.size());
    _readBuffers.resize(_subpasses.size());
    std::vector<uint32_t> colors;

    for (uint32_t i = 0; i < _subpasses.size(); ++i) {
        auto &subPass = _subpasses[i];
        auto &readBuffer = _readBuffers[i];
        auto &drawBuffer = _drawBuffers[i];

        for (auto &input : subPass.inputs) {
            auto index = INVALID_BINDING;
            if(input < _colorAttachments.size()) {
                index = _colorIndices[input];
            } else {
                // ds input
                index = input;
            }
            CC_ASSERT(index != INVALID_BINDING); // input should not appear before color or depthstencil.
            readBuffer.emplace_back(index);
        }

        for (auto &color : subPass.colors) {
            auto &index = _colorIndices[color];
            if (index == INVALID_BINDING) {
                index = static_cast<uint32_t>(colors.size());
                colors.emplace_back(color);
            }
            drawBuffer.emplace_back(index);
        }
    }
}

void CCMTLRenderPass::doDestroy() {
    if (_mtlRenderPassDescriptor) {
        [_mtlRenderPassDescriptor release];
        _mtlRenderPassDescriptor = nil;
    }
}

void CCMTLRenderPass::setColorAttachment(size_t slot, CCMTLTexture* cctex, int level) {
    if (!_mtlRenderPassDescriptor) {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        return;
    }

    if (_colorRenderTargetNums < slot) {
        CC_LOG_ERROR("CCMTLRenderPass: invalid color attachment slot %d.", slot);
        return;
    }

    id<MTLTexture> texture = nil;
    if (cctex->swapChain()) {
        auto* swapchain = static_cast<CCMTLSwapchain*>(cctex->swapChain());
        texture = swapchain->colorTexture()->getMTLTexture();
    } else {
        texture = cctex->getMTLTexture();
    }

    _mtlRenderPassDescriptor.colorAttachments[slot].texture = texture;
    _mtlRenderPassDescriptor.colorAttachments[slot].level = level;
    _renderTargetSizes[slot] = {static_cast<float>(texture.width), static_cast<float>(texture.height)};
}

void CCMTLRenderPass::setDepthStencilAttachment(CCMTLTexture* cctex, int level) {
    if (!_mtlRenderPassDescriptor) {
        CC_LOG_ERROR("CCMTLRenderPass: MTLRenderPassDescriptor should not be nullptr.");
        return;
    }

    id<MTLTexture> texture = nil;
    if (cctex->swapChain()) {
        auto* swapchain = static_cast<CCMTLSwapchain*>(cctex->swapChain());
        texture = swapchain->depthStencilTexture()->getMTLTexture();
    } else {
        texture = cctex->getMTLTexture();
    }

    _mtlRenderPassDescriptor.depthAttachment.texture = texture;
    _mtlRenderPassDescriptor.depthAttachment.level = level;
    if (cctex->getFormat() == Format::DEPTH_STENCIL) {
        _mtlRenderPassDescriptor.stencilAttachment.texture = texture;
        _mtlRenderPassDescriptor.stencilAttachment.level = level;
    }

    if(_renderTargetSizes.empty()) {
        _renderTargetSizes.emplace_back(static_cast<float>(texture.width), static_cast<float>(texture.height));
    }
}

} // namespace gfx
} // namespace cc
