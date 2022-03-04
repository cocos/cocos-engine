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

#include "UIPhase.h"
#include "RenderPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "pipeline/PipelineStateManager.h"
#include "scene/Camera.h"
#include "scene/DrawBatch2D.h"
#include "scene/RenderScene.h"
#include "scene/SubModel.h"
#include "scene/Pass.h"

namespace cc {
namespace pipeline {

void UIPhase::activate(RenderPipeline *pipeline) {
    _pipeline = pipeline;
    _phaseID  = getPhaseID("default");
};

void UIPhase::render(scene::Camera *camera, gfx::RenderPass *renderPass) {
    auto *cmdBuff = _pipeline->getCommandBuffers()[0];

    const auto &batches = camera->getScene()->getDrawBatch2Ds();
    // Notice: The batches[0] is batchCount
    for (auto *batch : batches) {
        if (!(camera->getVisibility() & batch->visFlags)) continue;
        for (size_t i = 0; i < batch->shaders.size(); ++i) {
            const auto *pass = batch->passes[i];
            if (pass->getPhase() != _phaseID) continue;
            auto *shader         = batch->shaders[i];
            auto *inputAssembler = batch->inputAssembler;
            auto *ds             = batch->descriptorSet;
            auto *pso            = PipelineStateManager::getOrCreatePipelineState(pass, shader, inputAssembler, renderPass);
            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBuff->bindInputAssembler(inputAssembler);
            cmdBuff->bindDescriptorSet(localSet, ds);
            cmdBuff->draw(inputAssembler);
        }
    }
}

} // namespace pipeline
} // namespace cc
