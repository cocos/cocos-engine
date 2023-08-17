/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "ForwardStage.h"
#if CC_USE_GEOMETRY_RENDERER
    #include "../GeometryRenderer.h"
#endif
#include "../InstancedBuffer.h"
#include "../PipelineSceneData.h"
#include "../PipelineUBO.h"
#include "../PlanarShadowQueue.h"
#include "../RenderAdditiveLightQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "../helper/Utils.h"
#include "ForwardPipeline.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXFramebuffer.h"
#include "pipeline/UIPhase.h"
#include "profiler/Profiler.h"
#include "scene/Camera.h"
#include "scene/RenderWindow.h"

namespace cc {
namespace pipeline {

RenderStageInfo ForwardStage::initInfo = {
    "ForwardStage",
    static_cast<uint32_t>(ForwardStagePriority::FORWARD),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
    {new RenderQueueDesc{false, RenderQueueSortMode::FRONT_TO_BACK, {"default"}},
     new RenderQueueDesc{true, RenderQueueSortMode::BACK_TO_FRONT, {"default", "planarShadow"}}}};
const RenderStageInfo &ForwardStage::getInitializeInfo() { return ForwardStage::initInfo; }

ForwardStage::ForwardStage() {
    _instancedQueue = ccnew RenderInstancedQueue;
    _uiPhase = ccnew UIPhase;
}

ForwardStage::~ForwardStage() = default;

bool ForwardStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID = getPhaseID("default");
    return true;
}

void ForwardStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint32_t phase = convertPhase(descriptor->stages);
        RenderQueueSortFunc sortFunc = convertQueueSortFunc(descriptor->sortMode);
        RenderQueueCreateInfo info = {descriptor->isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(ccnew RenderQueue(_pipeline, std::move(info), true));
    }

    _additiveLightQueue = ccnew RenderAdditiveLightQueue(_pipeline);
    _planarShadowQueue = ccnew PlanarShadowQueue(_pipeline);
    _uiPhase->activate(pipeline);
}

void ForwardStage::destroy() {
    CC_SAFE_DELETE(_instancedQueue);
    CC_SAFE_DELETE(_additiveLightQueue);
    CC_SAFE_DESTROY_AND_DELETE(_planarShadowQueue);
    CC_SAFE_DELETE(_uiPhase);
    RenderStage::destroy();
}

void ForwardStage::dispenseRenderObject2Queues() {
    if (!_pipeline->isRenderQueueReset()) return;

    _instancedQueue->clear();

    const auto *sceneData = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();

    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    for (const auto &ro : renderObjects) {
        const auto *const model = ro.model;
        const auto &subModels = model->getSubModels();
        const auto subModelCount = subModels.size();
        for (uint32_t subModelIdx = 0; subModelIdx < subModelCount; ++subModelIdx) {
            const auto &subModel = subModels[subModelIdx];
            const auto &passes = *(subModel->getPasses());
            const auto passCount = passes.size();
            for (uint32_t passIdx = 0; passIdx < passCount; ++passIdx) {
                const auto &pass = passes[passIdx];
                if (pass->getPhase() != _phaseID) continue;
                if (pass->getBatchingScheme() == scene::BatchingSchemes::INSTANCING) {
                    auto *instancedBuffer = pass->getInstancedBuffer();
                    instancedBuffer->merge(subModel, passIdx);
                    _instancedQueue->add(instancedBuffer);
                } else {
                    for (auto *renderQueue : _renderQueues) {
                        renderQueue->insertRenderPass(ro, subModelIdx, passIdx);
                    }
                }
            }
        }
    }

    _instancedQueue->sort();

    for (auto *queue : _renderQueues) {
        queue->sort();
    }
}

void ForwardStage::render(scene::Camera *camera) {
    CC_PROFILE(ForwardStageRender);
    struct RenderData {
        framegraph::TextureHandle outputTex;
        framegraph::TextureHandle depth;
    };
    auto *pipeline = static_cast<ForwardPipeline *>(_pipeline);
    auto *const sceneData = _pipeline->getPipelineSceneData();

    float shadingScale{sceneData->getShadingScale()};
    _renderArea = RenderPipeline::getRenderArea(camera);
    // Command 'updateBuffer' must be recorded outside render passes, cannot put them in execute lambda
    dispenseRenderObject2Queues();
    auto *cmdBuff{pipeline->getCommandBuffers()[0]};
    pipeline->getPipelineUBO()->updateShadowUBO(camera);

    _instancedQueue->uploadBuffers(cmdBuff);
    _additiveLightQueue->gatherLightPasses(camera, cmdBuff);
    _planarShadowQueue->gatherShadowPasses(camera, cmdBuff);
    auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        if (hasFlag(static_cast<gfx::ClearFlags>(camera->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
            _clearColors[0].x = camera->getClearColor().x;
            _clearColors[0].y = camera->getClearColor().y;
            _clearColors[0].z = camera->getClearColor().z;
        }
        _clearColors[0].w = camera->getClearColor().w;
        // color
// for inserting ar background before forward stage
#if CC_USE_AR_MODULE
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->getClearFlag());

        data.outputTex = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture));
        if (!data.outputTex.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = sceneData->isHDR() ? gfx::Format::RGBA16F : gfx::Format::RGBA8;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale);
            if (shadingScale != 1.F) {
                colorTexInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
            }
            data.outputTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);

            if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
                if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                    colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
                } else {
                    colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
                }
            }
        } else {
            colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        }
#else
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = sceneData->isHDR() ? gfx::Format::RGBA16F : gfx::Format::RGBA8;
        colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT;
        colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale);
        colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale);
        if (shadingScale != 1.F) {
            colorTexInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
        }
        data.outputTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->getClearFlag());
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
            }
        }
#endif

        colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;

        data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outputTex);
        // depth
        gfx::TextureInfo depthTexInfo{
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
            gfx::Format::DEPTH_STENCIL,
            static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale),
            static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale),
        };

        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.clearDepth = camera->getClearDepth();
        depthAttachmentInfo.clearStencil = camera->getClearStencil();
        depthAttachmentInfo.beginAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;
        depthAttachmentInfo.endAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;
#if !CC_USE_AR_MODULE
        if (static_cast<gfx::ClearFlagBit>(clearFlags & gfx::ClearFlagBit::DEPTH_STENCIL) != gfx::ClearFlagBit::DEPTH_STENCIL && (!hasFlag(clearFlags, gfx::ClearFlagBit::DEPTH) || !hasFlag(clearFlags, gfx::ClearFlagBit::STENCIL))) {
            depthAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        }
#endif
        data.depth = builder.create(RenderPipeline::fgStrHandleOutDepthTexture, depthTexInfo);
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);
        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto offset = _pipeline->getPipelineUBO()->getCurrentCameraUBOOffset();
    auto forwardExec = [this, camera, offset, pipeline](const RenderData & /*data*/, const framegraph::DevicePassResourceTable &table) {
        auto *renderPass = table.getRenderPass();
        auto *cmdBuff = _pipeline->getCommandBuffers()[0];
        cmdBuff->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), 1, &offset);
        if (!_pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            _renderQueues[0]->recordCommandBuffer(_device, camera, renderPass, cmdBuff);
            _instancedQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
            _additiveLightQueue->recordCommandBuffer(_device, camera, renderPass, cmdBuff);

            cmdBuff->bindDescriptorSet(globalSet, _pipeline->getDescriptorSet(), 1, &offset);
            _planarShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuff);
            _renderQueues[1]->recordCommandBuffer(_device, camera, renderPass, cmdBuff);
        }

#if CC_USE_GEOMETRY_RENDERER
        if (camera->getGeometryRenderer()) {
            camera->getGeometryRenderer()->render(renderPass, cmdBuff, pipeline->getPipelineSceneData());
        }
#endif

        _uiPhase->render(camera, renderPass);
        renderProfiler(renderPass, cmdBuff, _pipeline->getProfiler(), camera);
#if CC_USE_DEBUG_RENDERER
        renderDebugRenderer(renderPass, cmdBuff, _pipeline->getPipelineSceneData(), camera);
#endif
    };

    // add pass
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD), ForwardPipeline::fgStrHandleForwardPass, forwardSetup, forwardExec);
    pipeline->getFrameGraph().presentFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture, camera->getWindow()->getFramebuffer()->getColorTextures()[0], true);
}

} // namespace pipeline
} // namespace cc
