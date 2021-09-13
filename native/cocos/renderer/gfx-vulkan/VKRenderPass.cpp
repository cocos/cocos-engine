/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "VKStd.h"

#include "VKCommands.h"
#include "VKDevice.h"
#include "VKRenderPass.h"

namespace cc {
namespace gfx {

CCVKRenderPass::CCVKRenderPass() = default;

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
    // the depth stencil attachment is the default fallback
    // when none are specified in subpass
    const bool hasDepth = _depthStencilAttachment.format != Format::UNKNOWN;
    if (_gpuRenderPass->subpasses.empty()) {
        _gpuRenderPass->subpasses.emplace_back(SubpassInfo());
        auto &subpass = *_gpuRenderPass->subpasses.rbegin();
        subpass.colors.resize(_colorAttachments.size());
        for (uint i = 0U; i < _colorAttachments.size(); ++i) {
            subpass.colors[i] = i;
        }
        subpass.depthStencil = hasDepth ? _colorAttachments.size() : INVALID_BINDING;
    } else {
        for (auto &subpass : _gpuRenderPass->subpasses) {
            if (hasDepth && subpass.depthStencil == INVALID_BINDING) {
                subpass.depthStencil = static_cast<uint>(_colorAttachments.size());
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
