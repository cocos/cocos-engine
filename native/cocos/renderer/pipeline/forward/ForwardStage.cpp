#include "ForwardStage.h"
#include "../BatchedBuffer.h"
#include "../InstancedBuffer.h"
#include "../PlanarShadowQueue.h"
#include "../RenderAdditiveLightQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "../RenderView.h"
#include "../RenderWindow.h"
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
    static_cast<uint>(ForwardStageProperty::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::_initInfo; }

ForwardStage::ForwardStage() : RenderStage() {
    _batchedQueue = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _additiveLightQueue = CC_NEW(RenderAdditiveLightQueue);
    _planarShadowQueue = CC_NEW(PlanarShadowQueue);
}

ForwardStage::~ForwardStage() {
    destroy();
}

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = {
        {false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
        {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}};

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
}

void ForwardStage::destroy() {
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_additiveLightQueue);
    CC_SAFE_DELETE(_planarShadowQueue);

    for (auto renderQueue : _renderQueues) {
        CC_SAFE_DELETE(renderQueue);
    }
    _renderQueues.clear();
}

void ForwardStage::render(RenderView *view) {
    _instancedQueue->clear();
    _batchedQueue->clear();
    auto pipeline = static_cast<ForwardPipeline *>(_pipeline);
    const auto &validLights = pipeline->getValidLights();
    const auto &lightBuffers = pipeline->getLightBuffers();
    const auto &lightIndices = pipeline->getLightIndices();
    const auto &lightIndexOffset = pipeline->getLightIndexOffsets();
    const auto &renderObjects = pipeline->getRenderObjects();

    _additiveLightQueue->clear(validLights, lightBuffers, lightIndices);
    for (auto queue : _renderQueues) {
        queue->clear();
    }

    size_t m = 0, p = 0, k = 0;
    for (size_t i = 0; i < renderObjects.size(); ++i) {
        auto nextLightIndex = i + 1 < renderObjects.size() ? lightIndexOffset[i + 1] : lightIndices.size();
        const auto &ro = renderObjects[i];
        auto model = ro.model;

        if (model && model->isDynamicBatching) {
            for (m = 0; m < model->subModelsCount; ++m) {
                auto subModel = GET_SUBMODEL(model->subModelsID, m);
                for (p = 0; p < subModel->passesCount; ++p) {
                    auto pass = GET_PASS(subModel->materialID, p);
                    if (static_cast<BatchingSchemes>(pass->batchingScheme) == BatchingSchemes::INSTANCING) {
                        auto instancedBuffer = InstancedBuffer::get(pass);
                        //TODO coulsonwang
                        //                        instancedBuffer->merge(subModel, model->instancedAttributeBlock, GET_PSOCI(subModel->psociID, p));
                        _instancedQueue->getQueue().emplace(instancedBuffer);
                    } else if (static_cast<BatchingSchemes>(pass->batchingScheme) == BatchingSchemes::VB_MERGING) {
                        auto &batchedBuffer = BatchedBuffer::get(pass);
                        batchedBuffer->merge(subModel, p, &ro);
                        _batchedQueue->getQueue().emplace(batchedBuffer);
                    } else {
                        for (k = 0; k < _renderQueues.size(); k++) {
                            _renderQueues[k]->insertRenderPass(ro, m, p);
                        }
                        _additiveLightQueue->add(&ro, m, pass, lightIndexOffset[i], nextLightIndex);
                    }
                }
            }
        } else {
            for (m = 0; m < model->subModelsCount; m++) {
                auto subModel = GET_SUBMODEL(model->subModelsID, m);
                for (p = 0; p < subModel->passesCount; p++) {
                    auto pass = GET_PASS(subModel->passesID, p);
                    for (k = 0; k < _renderQueues.size(); k++) {
                        _renderQueues[k]->insertRenderPass(ro, m, p);
                    }
                    _additiveLightQueue->add(&ro, m, pass, lightIndexOffset[i], nextLightIndex);
                }
            }
        }
    }
    for (auto queue : _renderQueues) {
        queue->clear();
    }

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

    auto framebuffer = view->getWindow()->getFramebuffer();
    const auto &colorTextures = framebuffer->getColorTextures();
    auto device = gfx::Device::getInstance();

    auto renderPass = colorTextures.size() ? framebuffer->getRenderPass() : pipeline->getOrCreateRenderPass(static_cast<gfx::ClearFlagBit>(camera->clearFlag));

    cmdBuff->begin();
    cmdBuff->beginRenderPass(renderPass, framebuffer, _renderArea, _clearColors, camera->clearDepth, camera->clearStencil);

    _renderQueues[0]->recordCommandBuffer(device, renderPass, cmdBuff);
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _additiveLightQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _planarShadowQueue->recordCommandBuffer(device, renderPass, cmdBuff);
    _renderQueues[1]->recordCommandBuffer(device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();
    cmdBuff->end();
    device->getQueue()->submit(commandBuffers);
}

} // namespace pipeline
} // namespace cc
