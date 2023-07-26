/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "WGPURenderPass.h"
#include <webgpu/webgpu.h>
#include "WGPUDevice.h"
#include "WGPUObject.h"
#include "WGPUUtils.h"

namespace cc {
namespace gfx {

using namespace emscripten;

class CCWGPURenderPassHelper {
public:
    explicit CCWGPURenderPassHelper(const RenderPassInfo &info) {
        SampleCount samples = SampleCount::X1;
        for (size_t i = 0; i < info.colorAttachments.size(); i++) {
            colors[i].loadOp = toWGPULoadOp(info.colorAttachments[i].loadOp);
            colors[i].storeOp = toWGPUStoreOp(info.colorAttachments[i].storeOp);
            colors[i].clearValue = defaultClearColor;
            // TODO_Zeqaing : subpass
            if (info.colorAttachments[i].sampleCount != SampleCount::X1)
                samples = info.colorAttachments[i].sampleCount;
        }

        // now 1 depth stencil only
        depthStencils[0].depthLoadOp = toWGPULoadOp(info.depthStencilAttachment.depthLoadOp);
        depthStencils[0].depthStoreOp = toWGPUStoreOp(info.depthStencilAttachment.depthStoreOp);
        depthStencils[0].stencilLoadOp = toWGPULoadOp(info.depthStencilAttachment.stencilLoadOp);
        depthStencils[0].stencilStoreOp = toWGPUStoreOp(info.depthStencilAttachment.stencilStoreOp);
        depthStencils[0].depthClearValue = defaultClearDepth;
        depthStencils[0].depthReadOnly = false;
        depthStencils[0].stencilReadOnly = false;
        if (samples == SampleCount::X1)
            samples = info.depthStencilAttachment.sampleCount;

        renderPassDesc = ccnew WGPURenderPassDescriptor;

        // TODO_Zeqiang: Metal-like subpass
        renderPassDesc->colorAttachmentCount = info.colorAttachments.size();
        renderPassDesc->colorAttachments = colors.data();
        renderPassDesc->depthStencilAttachment = depthStencils.data();

        sampleCount = toWGPUSampleCount(samples);
    }

    ~CCWGPURenderPassHelper() {
        if (renderPassDesc) {
            delete renderPassDesc;
            renderPassDesc = nullptr;
        }
    }

    ccstd::array<WGPURenderPassColorAttachment, CC_WGPU_MAX_ATTACHMENTS> colors;
    ccstd::array<WGPURenderPassDepthStencilAttachment, CC_WGPU_MAX_ATTACHMENTS> depthStencils;
    WGPURenderPassDescriptor *renderPassDesc = nullptr;
    int sampleCount = 1;
};

CCWGPURenderPass::CCWGPURenderPass() : RenderPass() {
}

CCWGPURenderPass::~CCWGPURenderPass() {
    doDestroy();
}

void CCWGPURenderPass::doInit(const RenderPassInfo &info) {
    _renderPassObject = ccnew CCWGPURenderPassObject();
    _rpHelper = ccnew CCWGPURenderPassHelper(info);
    _renderPassObject->wgpuRenderPassDesc = _rpHelper->renderPassDesc;
    _renderPassObject->sampleCount = _rpHelper->sampleCount;
}

void CCWGPURenderPass::doDestroy() {
    if (_renderPassObject) {
        delete _renderPassObject;
        _renderPassObject = nullptr;
    }
    if (_rpHelper) {
        delete _rpHelper;
        _rpHelper = nullptr;
    }
}

} // namespace gfx
} // namespace cc
