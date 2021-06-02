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

#include "UIPhase.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "pipeline/PipelineStateManager.h"
#include "scene/RenderScene.h"

namespace cc {
namespace pipeline {

void UIPhase::activate(RenderPipeline *pipeline) {
    _pipeline = pipeline;
    _phaseID  = getPhaseID("default");
};

void UIPhase::render(scene::Camera *camera, gfx::RenderPass *renderPass) {
    auto *cmdBuff = _pipeline->getCommandBuffers()[0];

    const auto &batches = camera->scene->getDrawBatch2Ds();
    // Notice: The batches[0] is batchCount
    for (auto *batch : batches) {
        bool visible = false;
        if (camera->visibility & batch->visFlags) {
            visible = true;
        }

        if (!visible) continue;
        int i = 0;
        for (const auto *pass : batch->passes) {
            if (pass->getPhase() != _phaseID) continue;
            auto *const shader         = batch->shaders[i];
            auto *const inputAssembler = batch->inputAssembler;
            auto *const ds             = batch->descriptorSet;
            auto *      pso            = cc::pipeline::PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuff->bindDescriptorSet(localSet, ds);
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->draw(inputAssembler);

            ++i;
        }
    }
}

} // namespace pipeline
} // namespace cc
