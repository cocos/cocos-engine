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

#include "GLES3Std.h"

#include "GLES3Commands.h"
#include "GLES3RenderPass.h"
#include "base/Utils.h"

namespace cc {
namespace gfx {

GLES3RenderPass::GLES3RenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3RenderPass::~GLES3RenderPass() {
    destroy();
}

void GLES3RenderPass::doInit(const RenderPassInfo & /*info*/) {
    _gpuRenderPass                         = CC_NEW(GLES3GPURenderPass);
    _gpuRenderPass->colorAttachments       = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
    _gpuRenderPass->subpasses              = _subpasses;

    // assign a dummy subpass if not specified
    if (_gpuRenderPass->subpasses.empty()) {
        auto &subpass = _gpuRenderPass->subpasses.emplace_back();
        subpass.colors.resize(_colorAttachments.size());
        for (uint i = 0U; i < _colorAttachments.size(); ++i) {
            subpass.colors[i] = i;
        }
        if (_depthStencilAttachment.format != Format::UNKNOWN) {
            subpass.depthStencil = _colorAttachments.size();
        }
    }

    _gpuRenderPass->barriers.resize(_subpasses.size() + 1);
    for (auto &dependency : _dependencies) {
        size_t idx = dependency.dstSubpass == SUBPASS_EXTERNAL ? _subpasses.size() : dependency.dstSubpass;
        cmdFuncGLES3CreateGlobalBarrier(dependency.srcAccesses, dependency.dstAccesses, &_gpuRenderPass->barriers[idx]);
    }
}

void GLES3RenderPass::doDestroy() {
    if (_gpuRenderPass) {
        CC_DELETE(_gpuRenderPass);
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
