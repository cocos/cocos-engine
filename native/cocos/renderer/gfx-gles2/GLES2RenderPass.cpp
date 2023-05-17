/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "GLES2Std.h"

#include "GLES2Commands.h"
#include "GLES2Device.h"
#include "GLES2RenderPass.h"

namespace cc {
namespace gfx {

GLES2RenderPass::GLES2RenderPass() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2RenderPass::~GLES2RenderPass() {
    destroy();
}

void GLES2RenderPass::doInit(const RenderPassInfo & /*info*/) {
    _gpuRenderPass = ccnew GLES2GPURenderPass;
    _gpuRenderPass->colorAttachments = _colorAttachments;
    _gpuRenderPass->depthStencilAttachment = _depthStencilAttachment;
    _gpuRenderPass->subpasses = _subpasses;

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

    cmdFuncGLES2CreateRenderPass(GLES2Device::getInstance(), _gpuRenderPass);
}

void GLES2RenderPass::doDestroy() {
    if (_gpuRenderPass) {
        cmdFuncGLES2CreateRenderPass(GLES2Device::getInstance(), _gpuRenderPass);
        delete _gpuRenderPass;
        _gpuRenderPass = nullptr;
    }
}

} // namespace gfx
} // namespace cc
