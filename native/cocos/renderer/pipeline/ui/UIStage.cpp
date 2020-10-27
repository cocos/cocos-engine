#include "UIStage.h"
#include "../Define.h"
#include "../RenderQueue.h"
#include "../RenderView.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXQueue.h"

namespace cc {
namespace pipeline {
UIStage::~UIStage() {
}

RenderStageInfo UIStage::_initInfo = {
    "UIStage",
    static_cast<uint>(ForwardStagePriority::UI),
    static_cast<uint>(RenderFlowTag::SCENE),
    {{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}}};
const RenderStageInfo &UIStage::getInitializeInfo() { return UIStage::_initInfo; }

bool UIStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    return true;
}

void UIStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    for (const auto &descritpr : _renderQueueDescriptors) {
        uint phase = 0;
        for (const auto &stage : descritpr.stages) {
            phase |= PassPhase::getPhaseID(stage);
        }
        auto sortFunc = opaqueCompareFn;
        switch (descritpr.sortMode) {
            case RenderQueueSortMode::BACK_TO_FRONT:
                sortFunc = transparentCompareFn;
                break;
            case RenderQueueSortMode::FRONT_TO_BACK:
                sortFunc = opaqueCompareFn;
                break;
        }

        RenderQueueCreateInfo quue = {descritpr.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(quue))));
    }
}

void UIStage::render(RenderView *view) {
    const auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto isHDR = pipeline->isHDR();
    pipeline->setHDR(false);

    _renderQueues[0]->clear();
    const auto &renderObjects = pipeline->getRenderObjects();
    for (const auto &ro : renderObjects) {
        const auto subModelID = ro.model->getSubModelID();
        uint32_t subModelCount = subModelID[0];
        for (uint32_t i = 1; i <= subModelCount; i++) {
            const auto subModel = ro.model->getSubModelView(subModelID[i]);
            for (uint j = 0; j < subModel->passCount; j++) {
                _renderQueues[0]->insertRenderPass(ro, i, j);
            }
        }
    }
    _renderQueues[0]->sort();

    const auto camera = view->getCamera();
    _renderArea.x = camera->viewportX * camera->width;
    _renderArea.y = camera->viewportY * camera->height;
    _renderArea.width = camera->viewportWidth * camera->width;
    _renderArea.height = camera->viewportHeight * camera->height;

    auto cmdBuff = pipeline->getCommandBuffers()[0];

    auto framebuffer = view->getWindow()->getFramebuffer();

    auto renderPass = framebuffer->getColorTextures().size() && framebuffer->getColorTextures()[0] ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlags>(camera->clearFlag));

    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea,
                             {camera->clearColor}, camera->clearDepth, camera->clearStencil);
    cmdBuff->bindDescriptorSet(GLOBAL_SET, pipeline->getDescriptorSet());
    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();

    pipeline->setHDR(isHDR);
}

void UIStage::destroy() {
    RenderStage::destroy();
}

} // namespace pipeline
} // namespace cc
