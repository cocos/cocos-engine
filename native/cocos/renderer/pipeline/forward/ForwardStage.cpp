/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "ForwardStage.h"
#include "../BatchedBuffer.h"
#include "../GeometryRenderer.h"
#include "../InstancedBuffer.h"
#include "../PlanarShadowQueue.h"
#include "../RenderAdditiveLightQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "../helper/Utils.h"
#include "ForwardPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXFramebuffer.h"
#include "pipeline/UIPhase.h"

namespace cc {
namespace pipeline {

RenderStageInfo ForwardStage::initInfo = {
    "ForwardStage",
    static_cast<uint>(ForwardStagePriority::FORWARD),
    static_cast<uint>(RenderFlowTag::SCENE),
    {{false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
     {true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}}};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::initInfo; }

ForwardStage::ForwardStage() {
    _batchedQueue   = CC_NEW(RenderBatchedQueue);
    _instancedQueue = CC_NEW(RenderInstancedQueue);
    _uiPhase        = CC_NEW(UIPhase);
}

ForwardStage::~ForwardStage() = default;

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID                = getPhaseID("default");
    return true;
}

void ForwardStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint                  phase    = convertPhase(descriptor.stages);
        RenderQueueSortFunc   sortFunc = convertQueueSortFunc(descriptor.sortMode);
        RenderQueueCreateInfo info     = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(_pipeline, std::move(info), true)));
    }

    _additiveLightQueue = CC_NEW(RenderAdditiveLightQueue(_pipeline));
    _planarShadowQueue  = CC_NEW(PlanarShadowQueue(_pipeline));
    _uiPhase->activate(pipeline);
}

void ForwardStage::destroy() {
    CC_SAFE_DELETE(_batchedQueue);
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_additiveLightQueue);
    CC_SAFE_DELETE(_planarShadowQueue);
    CC_SAFE_DELETE(_uiPhase);
    RenderStage::destroy();
}

void ForwardStage::dispenseRenderObject2Queues() {
    _instancedQueue->clear();
    _batchedQueue->clear();

    const auto *sceneData     = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();

    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    for (auto ro : renderObjects) {
        const auto *const model         = ro.model;
        const auto &      subModels     = model->getSubModels();
        const auto        subModelCount = subModels.size();
        for (uint subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
            const auto &subModel  = subModels[subModelIdx];
            const auto &passes    = subModel->getPasses();
            const auto  passCount = passes.size();
            for (uint passIdx = 0; passIdx < passCount; ++passIdx) {
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
                    for (auto *renderQueue : _renderQueues) {
                        renderQueue->insertRenderPass(ro, subModelIdx, passIdx);
                    }
                }
            }
        }
    }

    for (auto *queue : _renderQueues) {
        queue->sort();
    }
}

void ForwardStage::render(scene::Camera *camera) {
    struct RenderData {
        framegraph::TextureHandle outputTex;
        framegraph::TextureHandle depth;
    };
    auto *      pipeline   = static_cast<ForwardPipeline *>(_pipeline);
    auto *const sceneData  = _pipeline->getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();

    float shadingScale{_pipeline->getPipelineSceneData()->getSharedData()->shadingScale};
    _renderArea = RenderPipeline::getRenderArea(camera);
    // Command 'updateBuffer' must be recorded outside render passes, cannot put them in execute lambda
    dispenseRenderObject2Queues();
    auto *cmdBuff{pipeline->getCommandBuffers()[0]};
    pipeline->getPipelineUBO()->updateShadowUBO(camera);

    _instancedQueue->uploadBuffers(cmdBuff);
    _batchedQueue->uploadBuffers(cmdBuff);
    _additiveLightQueue->gatherLightPasses(camera, cmdBuff);
    _planarShadowQueue->gatherShadowPasses(camera, cmdBuff);
    auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
            _clearColors[0].x = camera->clearColor.x;
            _clearColors[0].y = camera->clearColor.y;
            _clearColors[0].z = camera->clearColor.z;
        }
        _clearColors[0].w = camera->clearColor.w;
        // color
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = sharedData->isHDR ? gfx::Format::RGBA16F : gfx::Format::RGBA8;
        colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT;
        colorTexInfo.width  = static_cast<uint>(camera->window->getWidth() * shadingScale);
        colorTexInfo.height = static_cast<uint>(camera->window->getHeight() * shadingScale);
        if (shadingScale != 1.F) {
            colorTexInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
        }
        data.outputTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage      = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp     = gfx::LoadOp::CLEAR;
        auto clearFlags                = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
            }
        }
        colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = {gfx::AccessType::COLOR_ATTACHMENT_WRITE};

        data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outputTex);
        // depth
        gfx::TextureInfo depthTexInfo{
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
            gfx::Format::DEPTH_STENCIL,
            static_cast<uint>(camera->window->getWidth() * shadingScale),
            static_cast<uint>(camera->window->getHeight() * shadingScale),
        };

        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.clearDepth    = camera->clearDepth;
        depthAttachmentInfo.clearStencil  = camera->clearStencil;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        if (static_cast<gfx::ClearFlagBit>(clearFlags & gfx::ClearFlagBit::DEPTH_STENCIL) != gfx::ClearFlagBit::DEPTH_STENCIL && (!hasFlag(clearFlags, gfx::ClearFlagBit::DEPTH) || !hasFlag(clearFlags, gfx::ClearFlagBit::STENCIL))) {
            depthAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        }
        data.depth = builder.create(RenderPipeline::fgStrHandleOutDepthTexture, depthTexInfo);
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);
        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto offset      = _pipeline->getPipelineUBO()->getCurrentCameraUBOOffset();
    auto forwardExec = [this, camera, offset](const RenderData & /*data*/, const framegraph::DevicePassResourceTable &table) {
        auto *renderPass = table.getRenderPass();
        auto *cmdBuff    = _pipeline->getCommandBuffers()[0];
        cmdBuff->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), 1, &offset);
        if (!_pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            _renderQueues[0]->recordCommandBuffer(_device, camera, renderPass, cmdBuff);
            _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
            _batchedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);

            _additiveLightQueue->recordCommandBuffer(_device, camera, renderPass, cmdBuff);

            cmdBuff->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), 1, &offset);
            _planarShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
            _renderQueues[1]->recordCommandBuffer(_device, camera, renderPass, cmdBuff);
        }
        _pipeline->getGeometryRenderer()->render(renderPass, cmdBuff);
        _uiPhase->render(camera, renderPass);
        renderProfiler(renderPass, cmdBuff, _pipeline->getProfiler(), camera);
    };

    // add pass
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(ForwardInsertPoint::IP_FORWARD), ForwardPipeline::fgStrHandleForwardPass, forwardSetup, forwardExec);
    pipeline->getFrameGraph().presentFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture, camera->window->frameBuffer->getColorTextures()[0], true);
}

} // namespace pipeline
} // namespace cc
