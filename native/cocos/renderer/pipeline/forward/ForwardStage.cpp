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
    out.r = gamma.r * gamma.r;
    out.g = gamma.g * gamma.g;
    out.b = gamma.b * gamma.b;
}

void LinearToSRGB(gfx::Color &out, const gfx::Color &linear) {
    out.r = std::sqrt(linear.r);
    out.g = std::sqrt(linear.g);
    out.b = std::sqrt(linear.b);
}
} // namespace

RenderStageInfo ForwardStage::_initInfo = {
    "ForwardStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::_initInfo; }

ForwardStage::ForwardStage() : RenderStage() {
    _batchedQueue = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    //    _planarShadowQueue = CC_NEW(PlanarShadowQueue);
}

ForwardStage::~ForwardStage() {
    destroy();
}

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = {
        {false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
        {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}};

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

    size_t m = 0, p = 0, k = 0;
    for (size_t i = 0; i < renderObjects.size(); ++i) {
        const auto &ro = renderObjects[i];
        auto model = ro.model;
        uint32_t *subModels = GET_SUBMODEL_ARRAY(model->subModelsID);
        uint32_t subModelCount = subModels[0];
        for (m = 1; m <= subModelCount; ++m) {
            auto subModel = GET_SUBMODEL(subModels[m]);
            for (p = 0; p < subModel->passCount; ++p) {
                auto pass = GET_PASS(subModel->pass0ID + p);
                if (pass->phase != _phaseID) continue;
                if (static_cast<BatchingSchemes>(pass->batchingScheme) == BatchingSchemes::INSTANCING) {
                    auto instancedBuffer = InstancedBuffer::get(pass);
                    //TODO coulsonwang
                    //                    instancedBuffer->merge(subModel, model->instancedAttributeBlock, p);
                    _instancedQueue->getQueue().emplace(instancedBuffer);
                } else if (static_cast<BatchingSchemes>(pass->batchingScheme) == BatchingSchemes::VB_MERGING) {
                    auto batchedBuffer = BatchedBuffer::get(pass);
                    batchedBuffer->merge(subModel, p, &ro);
                    _batchedQueue->getQueue().emplace(batchedBuffer);
                } else {
                    for (k = 0; k < _renderQueues.size(); k++) {
                        _renderQueues[k]->insertRenderPass(ro, m, p);
                    }
                }
            }
        }
    }
    for (auto queue : _renderQueues) {
        queue->clear();
    }

    _additiveLightQueue->gatherLightPasses(view);

    auto camera = view->getCamera();
    auto commandBuffers = pipeline->getCommandBuffers();
    auto cmdBuff = commandBuffers[0];

    auto vp = camera->viewport;
    _renderArea.x = vp.x * camera->width;
    _renderArea.y = vp.y * camera->height;
    _renderArea.width = vp.width * camera->width * pipeline->getShadingScale();
    _renderArea.height = vp.height * camera->height * pipeline->getShadingScale();

    if (static_cast<gfx::ClearFlags>(camera->clearFlag) & gfx::ClearFlagBit::COLOR) {
        if (pipeline->isHDR()) {
            SRGBToLinear(_clearColors[0], camera->clearColor);
            auto scale = pipeline->getFpScale() / camera->exposure;
            _clearColors[0].r *= scale;
            _clearColors[0].g *= scale;
            _clearColors[0].b *= scale;
        } else {
            _clearColors[0].r = camera->clearColor.r;
            _clearColors[0].g = camera->clearColor.g;
            _clearColors[0].b = camera->clearColor.b;
        }
    }

    _clearColors[0].a = camera->clearColor.a;

    auto framebuffer = GET_FRAMEBUFFER(view->getWindow()->framebufferID);
    const auto &colorTextures = framebuffer->getColorTextures();

    auto renderPass = colorTextures.size() ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlagBit>(camera->clearFlag));

    cmdBuff->begin();
    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea, _clearColors, camera->clearDepth, camera->clearStencil);
    cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), _pipeline->getDescriptorSet());

    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);
    _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _batchedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _additiveLightQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    //    _planarShadowQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _renderQueues[1]->recordCommandBuffer(_device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();
    cmdBuff->end();
    _device->getQueue()->submit(commandBuffers);
}

} // namespace pipeline
} // namespace cc
