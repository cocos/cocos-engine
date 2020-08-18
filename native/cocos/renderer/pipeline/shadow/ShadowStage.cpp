#include "ShadowStage.h"
#include "../Define.h"
#include "../RenderQueue.h"
#include "../forward/ForwardPipeline.h"
#include "gfx/GFXDevice.h"

namespace cc {
namespace pipeline {
ShadowStage::~ShadowStage() {
    destroy();
}
RenderStageInfo ShadowStage::_initInfo = {
    "ShadowStage",
    static_cast<uint>(ForwardStagePriority::FORWARD)};
const RenderStageInfo &ShadowStage::getInitializeInfo() { return ShadowStage::_initInfo; }

bool ShadowStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    RenderQueueDesc descriptor = {true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}};
    _renderQueueDescriptors.emplace_back(std::move(descriptor));

    return true;
}

void ShadowStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
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

void ShadowStage::render(RenderView *view) {
    const auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto isHDR = pipeline->isHDR();
    pipeline->setHDR(false);

    auto device = gfx::Device::getInstance();
    _renderQueues[0]->clear();
    //    const auto &renderObjects = pipeline->getRenderObjects();
    //    for (const auto &ro : renderObjects) {
    //        for (let i = 0; i < ro.model.subModelNum; i++) {
    //            for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
    //                this._renderQueues[0].insertRenderPass(ro, i, j);
    //            }
    //        }
    //    }
    //    this._renderQueues[0].sort();
    //
    //    const camera = view.camera!;
    //    const vp = camera.viewport;
    //    this._renderArea!.x = vp.x * camera.width;
    //    this._renderArea!.y = vp.y * camera.height;
    //    this._renderArea!.width = vp.width * camera.width;
    //    this._renderArea!.height = vp.height * camera.height;
    //
    //    colors[0] = camera.clearColor;
    //
    //    const cmdBuff = pipeline.commandBuffers[0];
    //
    //    const framebuffer = view.window.framebuffer;
    //    const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);
    //
    //    cmdBuff.begin();
    //    cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
    //        [camera.clearColor], camera.clearDepth, camera.clearStencil);
    //
    //    this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);
    //
    //    cmdBuff.endRenderPass();
    //    cmdBuff.end();
    //
    //    device.queue.submit(pipeline.commandBuffers);
    //    pipeline.isHDR = isHDR;
}

void ShadowStage::destroy() {
    for (auto queue : _renderQueues) {
        CC_SAFE_DELETE(queue);
    }
    _renderQueues.clear();
    _renderQueueDescriptors.clear();
}

} // namespace pipeline
} // namespace cc
