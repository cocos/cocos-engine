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
    const auto vis = camera->visibility & static_cast<uint>(LayerList::UI_2D);
    const int batchCount = batches[0];
    // Notice: The batches[0] is batchCount
    for (int i = 1; i <= batchCount; ++i) {
        const auto batch = GET_UI_BATCH(batches[i]);
        bool visible = false;
        if (vis) {
            if (camera->visibility == batch->visFlags) {
                visible = true;
            }
        } else {
            if (camera->visibility & batch->visFlags) {
                visible = true;
            }
        }

        if (!visible) continue;
        const int count = batch->passCount;
        for (int j = 0; j < count; j++) {
            const auto pass = batch->getPassView(j);
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
