#include "ForwardStage.h"
#include "../BatchedBuffer.h"
#include "../InstancedBuffer.h"
#include "../PlanarShadowQueue.h"
#include "../RenderAdditiveLightQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "ForwardPipeline.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXQueue.h"

namespace cc {
namespace pipeline {
namespace {
void SRGBToLinear(gfx::Color &out, const gfx::Color &gamma) {
    out.x = gamma.x * gamma.x;
    out.y = gamma.y * gamma.y;
    out.z = gamma.z * gamma.z;
}

void LinearToSRGB(gfx::Color &out, const gfx::Color &linear) {
    out.x = std::sqrt(linear.x);
    out.y = std::sqrt(linear.y);
    out.z = std::sqrt(linear.z);
}
} // namespace

RenderStageInfo ForwardStage::_initInfo = {
    "ForwardStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {{false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
     {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}}};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::_initInfo; }

ForwardStage::ForwardStage() : RenderStage() {
    _batchedQueue = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

ForwardStage::~ForwardStage() {
}

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID = PassPhase::getPhaseID("default");
    return true;
}

void ForwardStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    for (const auto &descriptor : _renderQueueDescriptors) {
        uint phase = 0;
        for (const auto &stage : descriptor.stages) {
            phase |= PassPhase::getPhaseID(stage);
        }

        std::function<int(const RenderPass &, const RenderPass &)> sortFunc = opaqueCompareFn;
        switch (descriptor.sortMode) {
            case RenderQueueSortMode::BACK_TO_FRONT:
                sortFunc = transparentCompareFn;
                break;
            case RenderQueueSortMode::FRONT_TO_BACK:
                sortFunc = opaqueCompareFn;
            default:
                break;
        }

        RenderQueueCreateInfo info = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }

    _additiveLightQueue = CC_NEW(RenderAdditiveLightQueue(_pipeline));
    _planarShadowQueue = CC_NEW(PlanarShadowQueue(_pipeline));
}

void ForwardStage::destroy() {
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_additiveLightQueue);
    CC_SAFE_DELETE(_planarShadowQueue);
    RenderStage::destroy();
}

void ForwardStage::render(RenderView *view) {
    _instancedQueue->clear();
    _batchedQueue->clear();
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto &renderObjects = pipeline->getRenderObjects();

    for (auto queue : _renderQueues) {
        queue->clear();
    }

    uint m = 0, p = 0;
    size_t k = 0;
    for (size_t i = 0; i < renderObjects.size(); ++i) {
        const auto &ro = renderObjects[i];
        const auto model = ro.model;
        const auto subModelID = model->getSubModelID();
        const auto subModelCount = subModelID[0];
        for (m = 1; m <= subModelCount; ++m) {
            auto subModel = model->getSubModelView(subModelID[m]);
            for (p = 0; p < subModel->passCount; ++p) {
                const PassView *pass = subModel->getPassView(p);

                if (pass->phase != _phaseID) continue;
                if (pass->getBatchingScheme() == BatchingSchemes::INSTANCING) {
                    auto instancedBuffer = InstancedBuffer::get(subModel->passID[p]);
                    instancedBuffer->merge(model, subModel, p);
                    _instancedQueue->add(instancedBuffer);
                } else if (pass->getBatchingScheme() == BatchingSchemes::VB_MERGING) {
                    auto batchedBuffer = BatchedBuffer::get(subModel->passID[p]);
                    batchedBuffer->merge(subModel, p, &ro);
                    _batchedQueue->add(batchedBuffer);
                } else {
                    for (k = 0; k < _renderQueues.size(); k++) {
                        _renderQueues[k]->insertRenderPass(ro, m, p);
                    }
                }
            }
        }
    }
    for (auto queue : _renderQueues) {
        queue->sort();
    }

    auto cmdBuff = pipeline->getCommandBuffers()[0];

    _instancedQueue->uploadBuffers(cmdBuff);
    _batchedQueue->uploadBuffers(cmdBuff);
    _additiveLightQueue->gatherLightPasses(view, cmdBuff);

    auto camera = view->getCamera();
    // render area is not oriented
    uint w = (uint)_device->getSurfaceTransform() % 2 ? camera->height : camera->width;
    uint h = (uint)_device->getSurfaceTransform() % 2 ? camera->width : camera->height;
    _renderArea.x = camera->viewportX * w;
    _renderArea.y = camera->viewportY * h;
    _renderArea.width = camera->viewportWidth * w * pipeline->getShadingScale();
    _renderArea.height = camera->viewportHeight * h * pipeline->getShadingScale();

    if (static_cast<gfx::ClearFlags>(camera->clearFlag) & gfx::ClearFlagBit::COLOR) {
        if (pipeline->isHDR()) {
            SRGBToLinear(_clearColors[0], camera->clearColor);
            auto scale = pipeline->getFpScale() / camera->exposure;
            _clearColors[0].x *= scale;
            _clearColors[0].y *= scale;
            _clearColors[0].z *= scale;
        } else {
            _clearColors[0].x = camera->clearColor.x;
            _clearColors[0].y = camera->clearColor.y;
            _clearColors[0].z = camera->clearColor.z;
        }
    }

    _clearColors[0].w = camera->clearColor.w;

    auto framebuffer = view->getWindow()->getFramebuffer();
    const auto &colorTextures = framebuffer->getColorTextures();

    auto renderPass = colorTextures.size() && colorTextures[0] ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlagBit>(camera->clearFlag));

    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea, _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBuff->bindDescriptorSet(GLOBAL_SET, _pipeline->getDescriptorSet());

    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);
    _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _batchedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _additiveLightQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    //    _planarShadowQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _renderQueues[1]->recordCommandBuffer(_device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();
}

} // namespace pipeline
} // namespace cc
