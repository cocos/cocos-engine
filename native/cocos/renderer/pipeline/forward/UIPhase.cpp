/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "UIPhase.h"
#include "ForwardPipeline.h"
#include "pipeline/PipelineStateManager.h"
#include "gfx/GFXCommandBuffer.h"

namespace cc {
namespace pipeline {

void UIPhase::activate(RenderPipeline *pipeline){
    _pipeline = pipeline;
    _phaseID = getPhaseID("default");
};

void UIPhase::render(Camera *camera, gfx::RenderPass *renderPass){
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    auto cmdBuff = pipeline->getCommandBuffers()[0];

    auto batches = camera->getScene()->getUIBatches();
    const int batchCount = batches[0];
    // Notice: The batches[0] is batchCount
    for (int i = 1; i <= batchCount; ++i) {
        const auto batch = GET_UI_BATCH(batches[i]);
        bool visible = false;
        if (camera->visibility & batch->visFlags) {
            visible = true;
        }

        if (!visible) continue;
        const int count = batch->passCount;
        for (int j = 0; j < count; j++) {
            const auto pass = batch->getPassView(j);
            if (pass->phase != _phaseID) continue;
            const auto shader = batch->getShader(j);
            const auto inputAssembler = batch->getInputAssembler();
            const auto ds = batch->getDescriptorSet();
            auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
            cmdBuff->bindDescriptorSet(LOCAL_SET, ds);
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->draw(inputAssembler);
        }
    }
}

}
}
