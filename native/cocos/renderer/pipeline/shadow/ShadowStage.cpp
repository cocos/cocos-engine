#include "ShadowStage.h"
#include "../Define.h"
#include "../RenderQueue.h"
#include "../RenderView.h"
#include "../ShadowMapBatchedQueue.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXQueue.h"
#include "math/Vec2.h"

namespace cc {
namespace pipeline {
ShadowStage::ShadowStage()
: _additiveShadowQueue(CC_NEW(ShadowMapBatchedQueue)) {
}

ShadowStage::~ShadowStage() {
}

RenderStageInfo ShadowStage::_initInfo = {
    "ShadowStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {}};
const RenderStageInfo &ShadowStage::getInitializeInfo() { return ShadowStage::_initInfo; }

bool ShadowStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    return true;
}

void ShadowStage::render(RenderView *view) {
    const auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto shadowInfo = pipeline->getShadows();
    _additiveShadowQueue->clear(pipeline->getDescriptorSet()->getBuffer(UBOShadow::BLOCK.layout.binding));

    const auto shadowObjects = pipeline->getShadowObjects();
    for (const auto &shadowObject : shadowObjects) {
        const auto subModelID = shadowObject.model->getSubModelID();
        uint32_t subModelCount = subModelID[0];
        for (uint32_t m = 1; m <= subModelCount; m++) {
            const auto subModel = shadowObject.model->getSubModelView(subModelID[m]);
            for (uint32_t p = 0; p < subModel->passCount; p++) {
                _additiveShadowQueue->add(shadowObject, m, p);
            }
        }
    }

    const auto camera = view->getCamera();
    auto cmdBuffer = pipeline->getCommandBuffers()[0];

    const auto shadowMapSize = shadowInfo->size;
    _renderArea.x = camera->viewportX * shadowMapSize.x;
    _renderArea.y = camera->viewportY * shadowMapSize.y;
    _renderArea.width = camera->viewportWidth * shadowMapSize.x * pipeline->getShadingScale();
    _renderArea.height = camera->viewportHeight * shadowMapSize.y * pipeline->getShadingScale();

    _clearColors[0] = {1.0f, 1.0f, 1.0f, 1.0f};
    auto renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBuffer->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), pipeline->getDescriptorSet());
    _additiveShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
}

void ShadowStage::destroy() {
    CC_SAFE_DESTROY(_additiveShadowQueue);

    RenderStage::destroy();
}

} // namespace pipeline
} // namespace cc
