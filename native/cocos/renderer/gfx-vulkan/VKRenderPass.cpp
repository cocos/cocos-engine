/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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

#include "VKRenderPass.h"
#include "VKCommands.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKRenderPass::CCVKRenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKRenderPass::~CCVKRenderPass() {
    destroy();
}

void CCVKRenderPass::doInit(const RenderPassInfo & /*info*/) {
    _gpuRenderPass                         = CC_NEW(CCVKGPURenderPass);
    _gpuRenderPass->colorAttachments       = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
    _gpuRenderPass->subpasses              = _subpasses;
    _gpuRenderPass->dependencies           = _dependencies;

    // assign a dummy subpass if not specified
    uint32_t colorCount = utils::toUint(_gpuRenderPass->colorAttachments.size());
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
    } else {
        // unify depth stencil index
        for (auto &subpass : _gpuRenderPass->subpasses) {
            if (subpass.depthStencil != INVALID_BINDING && subpass.depthStencil > colorCount) {
                subpass.depthStencil = colorCount;
            }
            if (subpass.depthStencilResolve != INVALID_BINDING && subpass.depthStencilResolve > colorCount) {
                subpass.depthStencilResolve = colorCount;
            }
        }
    }

    cmdFuncCCVKCreateRenderPass(CCVKDevice::getInstance(), _gpuRenderPass);
}

void CCVKRenderPass::doDestroy() {
    if (_gpuRenderPass) {
        CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuRenderPass);
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
