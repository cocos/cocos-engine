#include "UIStage.h"
#include "../Define.h"
#include "../RenderQueue.h"
#include "../RenderView.h"
#include "../RenderWindow.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXQueue.h"

namespace cc {
namespace pipeline {
UIStage::~UIStage() {
    destroy();
}
RenderStageInfo UIStage::_initInfo = {
    "UIStage",
    static_cast<uint>(ForwardStagePriority::UI)};
const RenderStageInfo &UIStage::getInitializeInfo() { return UIStage::_initInfo; }

bool UIStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    _device = gfx::Device::getInstance();
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
        for (size_t i = 0; i < ro.model->subModelsCount; i++) {
            const auto subModel = GET_SUBMODEL(ro.model->subModelsID, i);
            for (size_t j = 0; j < subModel->passCount; j++) {
                _renderQueues[0]->insertRenderPass(ro, i, j);
            }
        }
    }
    _renderQueues[0]->sort();

    const auto camera = view->getCamera();
    const auto &vp = camera->viewport;
    _renderArea.x = vp.x * camera->width;
    _renderArea.y = vp.y * camera->height;
    _renderArea.width = vp.width * camera->width;
    _renderArea.height = vp.height * camera->height;

    auto &commandBuffers = pipeline->getCommandBuffers();
    auto cmdBuff = commandBuffers[0];

    auto framebuffer = view->getWindow()->getFramebuffer();
    auto renderPass = framebuffer->getColorTextures().size() ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlags>(camera->clearFlag));

    cmdBuff->begin();
    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea,
                             {camera->clearColor}, camera->clearDepth, camera->clearStencil);

    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();
    cmdBuff->end();

    _device->getQueue()->submit(commandBuffers);
    pipeline->setHDR(isHDR);
}

void UIStage::destroy() {
    for (auto queue : _renderQueues) {
        CC_SAFE_DELETE(queue);
    }
    _renderQueues.clear();
    _renderQueueDescriptors.clear();
}

} // namespace pipeline
} // namespace cc
