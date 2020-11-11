#include "ShadowStage.h"
#include "../Define.h"
#include "../RenderView.h"
#include "../ShadowMapBatchedQueue.h"
#include "../forward/ForwardPipeline.h"
#include "../helper/SharedMemory.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXTexture.h"
#include "math/Vec2.h"

namespace cc {
namespace pipeline {
ShadowStage::ShadowStage() {
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

void ShadowStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _additiveShadowQueue = CC_NEW(ShadowMapBatchedQueue(static_cast<ForwardPipeline *>(pipeline)));
}

void ShadowStage::render(RenderView *view) {
    const auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto shadowInfo = pipeline->getShadows();

    if (!_light || !_framebuffer) {
        return;
    }

    const auto camera = view->getCamera();
    auto cmdBuffer = pipeline->getCommandBuffers()[0];

    _additiveShadowQueue->gatherLightPasses(_light, cmdBuffer);

    const auto shadowMapSize = shadowInfo->size;
    _renderArea.x = (int)(camera->viewportX * shadowMapSize.x);
    _renderArea.y = (int)(camera->viewportY * shadowMapSize.y);
    _renderArea.width = (uint)(camera->viewportWidth * shadowMapSize.x * pipeline->getShadingScale());
    _renderArea.height = (uint)(camera->viewportHeight * shadowMapSize.y * pipeline->getShadingScale());

    _clearColors[0] = {1.0f, 1.0f, 1.0f, 1.0f};
    auto* renderPass = _framebuffer->getRenderPass();

    cmdBuffer->beginRenderPass(renderPass, _framebuffer, _renderArea,
                               _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBuffer->bindDescriptorSet(GLOBAL_SET, pipeline->getDescriptorSet());
    _additiveShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuffer);

    cmdBuffer->endRenderPass();
}

void ShadowStage::destroy() {	
    CC_SAFE_DESTROY(_additiveShadowQueue);

    RenderStage::destroy();
}

} // namespace pipeline
} // namespace cc
