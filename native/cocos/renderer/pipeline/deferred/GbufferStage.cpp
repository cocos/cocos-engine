/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.

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

#include "GbufferStage.h"
#include "../BatchedBuffer.h"
#include "../InstancedBuffer.h"
#include "../PlanarShadowQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "DeferredPipeline.h"
#include "MainFlow.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"
#include "frame-graph/DevicePassResourceTable.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/Resource.h"

namespace cc {
namespace pipeline {
namespace {
const String STAGE_NAME = "GbufferStage";

void srgbToLinear(gfx::Color *out, const gfx::Color &gamma) {
    out->x = gamma.x * gamma.x;
    out->y = gamma.y * gamma.y;
    out->z = gamma.z * gamma.z;
}

void linearToSrgb(gfx::Color *out, const gfx::Color &linear) {
    out->x = std::sqrt(linear.x);
    out->y = std::sqrt(linear.y);
    out->z = std::sqrt(linear.z);
}
} // namespace

RenderStageInfo GbufferStage::initInfo = {
    STAGE_NAME,
    static_cast<uint>(DeferredStagePriority::GBUFFER),
    static_cast<uint>(RenderFlowTag::SCENE),
    {{false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
     {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}}};
const RenderStageInfo &GbufferStage::getInitializeInfo() { return GbufferStage::initInfo; }

GbufferStage::GbufferStage() {
    _batchedQueue   = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
}

GbufferStage::~GbufferStage() = default;

bool GbufferStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID                = getPhaseID("deferred");
    return true;
}

void GbufferStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint                  phase    = convertPhase(descriptor.stages);
        RenderQueueSortFunc   sortFunc = convertQueueSortFunc(descriptor.sortMode);
        RenderQueueCreateInfo info     = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }
    _planarShadowQueue = CC_NEW(PlanarShadowQueue(_pipeline));
}

void GbufferStage::destroy() {
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DESTROY(_planarShadowQueue);
    RenderStage::destroy();
}

void GbufferStage::dispenseRenderObject2Queues() {
    _instancedQueue->clear();
    _batchedQueue->clear();

    const auto &renderObjects = _pipeline->getPipelineSceneData()->getRenderObjects();
    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    uint   subModelIdx = 0;
    uint   passIdx     = 0;
    size_t k           = 0;
    for (auto ro : renderObjects) {
        const auto *const model         = ro.model;
        const auto &      subModels     = model->getSubModels();
        auto              subModelCount = subModels.size();
        for (subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
            const auto &subModel  = subModels[subModelIdx];
            const auto &passes    = subModel->getPasses();
            auto        passCount = passes.size();
            for (passIdx = 0; passIdx < passCount; ++passIdx) {
                const auto &pass = passes[passIdx];
                if (pass->getPhase() != _phaseID) continue;
                if (pass->getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                    auto *instancedBuffer = InstancedBuffer::get(pass);
                    instancedBuffer->merge(model, subModel, passIdx);
                    _instancedQueue->add(instancedBuffer);
                } else if (pass->getBatchingScheme() == scene::BatchingSchemes::VB_MERGING) {
                    auto *batchedBuffer = BatchedBuffer::get(pass);
                    batchedBuffer->merge(subModel, passIdx, model);
                    _batchedQueue->add(batchedBuffer);
                } else {
                    for (k = 0; k < _renderQueues.size(); k++) {
                        _renderQueues[k]->insertRenderPass(ro, subModelIdx, passIdx);
                    }
                }
            }
        }
    }

    for (auto *queue : _renderQueues) {
        queue->sort();
    }
}
void GbufferStage::recordCommands(DeferredPipeline *pipeline, gfx::RenderPass *renderPass)
{
    auto *cmdBuff  = pipeline->getCommandBuffers()[0];

    // descriptorset bindings
    uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
    cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

    // record commands
    _renderQueues[0]->recordCommandBuffer(_device, renderPass, cmdBuff);
    _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
    _batchedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
}

void GbufferStage::render(scene::Camera *camera) {
    struct RenderData {
        framegraph::TextureHandle gbuffer[4];
        framegraph::TextureHandle depth;
    };

    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    _renderArea = pipeline->getRenderArea(camera, false);

    // render area is not oriented, copy buffer must be called outsize of renderpass, it shouldnot be called in execute lambda expression
    // If there are only transparent object, lighting pass is ignored, we should call getIAByRenderArea here
    (void)pipeline->getIAByRenderArea(_renderArea);

    auto gbufferSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // gbuffer setup
        gfx::Color clearColor = {0.0, 0.0, 0.0, 0.0};

        framegraph::RenderTargetAttachment::Descriptor colorInfo;
        colorInfo.usage       = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorInfo.loadOp      = gfx::LoadOp::CLEAR;
        colorInfo.clearColor  = clearColor;
        colorInfo.endAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};
        for (int i = 0; i < 4; ++i) {
            data.gbuffer[i] = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i])), colorInfo);
            builder.writeToBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i], data.gbuffer[i]);
        }

        // depth setup
        framegraph::RenderTargetAttachment::Descriptor depthInfo;
        depthInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthInfo.loadOp = gfx::LoadOp::CLEAR;
        depthInfo.clearDepth = camera->clearDepth;
        depthInfo.clearStencil = camera->clearStencil;
        depthInfo.endAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture)), depthInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        // viewport setup
        gfx::Viewport viewport{ _renderArea.x, _renderArea.y, _renderArea.width, _renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, _renderArea);
    };

    auto gbufferExec = [&] (RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        CC_UNUSED_PARAM(data);
        auto *pipeline = static_cast<DeferredPipeline *>(RenderPipeline::getInstance());
        assert(pipeline != nullptr);
        auto *stage = static_cast<GbufferStage *>(pipeline->getRenderstageByName(STAGE_NAME));
        assert(stage != nullptr);
        gfx::RenderPass *renderPass = table.getRenderPass().get();
        assert(renderPass != nullptr);
        stage->recordCommands(pipeline, renderPass);
    };

    // Command 'updateBuffer' must be recorded outside render passes, cannot put them in execute lambda
    dispenseRenderObject2Queues();
    auto *cmdBuff  = pipeline->getCommandBuffers()[0];
    _instancedQueue->uploadBuffers(cmdBuff);
    _batchedQueue->uploadBuffers(cmdBuff);

    // if empty == true, gbuffer and lightig passes will be ignored
    bool empty = _renderQueues[0]->empty() && _instancedQueue->empty() && _batchedQueue->empty();
    if (!empty) {
        pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_GBUFFER), DeferredPipeline::fgStrHandleGbufferPass, gbufferSetup, gbufferExec);
    }
}
} // namespace pipeline
} // namespace cc
