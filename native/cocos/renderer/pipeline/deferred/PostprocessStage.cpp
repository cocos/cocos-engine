
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

#include "PostprocessStage.h"
#include "../PipelineStateManager.h"
#include "../RenderQueue.h"
#include "../forward/UIPhase.h"
#include "DeferredPipeline.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/PassNodeBuilder.h"
#include "frame-graph/Resource.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "pipeline/Define.h"
#include "pipeline/helper/Utils.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {
namespace {
const String STAGE_NAME = "PostprocessStage";
}

RenderStageInfo PostprocessStage::initInfo = {
    STAGE_NAME,
    static_cast<uint>(DeferredStagePriority::POSTPROCESS),
    0,
    {{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};
const RenderStageInfo &PostprocessStage::getInitializeInfo() { return PostprocessStage::initInfo; }

PostprocessStage::PostprocessStage() {
    _uiPhase = CC_NEW(UIPhase);
}

bool PostprocessStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;

    return true;
}

void PostprocessStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    _uiPhase->activate(pipeline);
    _phaseID = getPhaseID("default");

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint phase = 0;
        for (const auto &stage : descriptor.stages) {
            phase |= getPhaseID(stage);
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

void PostprocessStage::destroy() {
    CC_SAFE_DELETE(_uiPhase);
}

void PostprocessStage::render(scene::Camera *camera) {
    static framegraph::StringHandle fgStrHandlePostProcessOutTexture = framegraph::FrameGraph::stringToHandle("postProcessOutputTexture");
    struct RenderData {
        framegraph::TextureHandle lightingOut; // read from lighting output
        framegraph::TextureHandle backBuffer;  // write to back buffer
        framegraph::TextureHandle depth;
    };

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->clearColor.x;
        _clearColors[0].y = camera->clearColor.y;
        _clearColors[0].z = camera->clearColor.z;
    }
    _clearColors[0].w = camera->clearColor.w;

    auto *pipeline  = static_cast<DeferredPipeline *>(_pipeline);
    auto  postSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        data.lightingOut = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture));
        if (!data.lightingOut.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage  = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width  = pipeline->getWidth();
            colorTexInfo.height = pipeline->getHeight();

            data.lightingOut = builder.create<framegraph::Texture>(DeferredPipeline::fgStrHandleLightingOutTexture, colorTexInfo);
        }

        data.lightingOut = builder.read(data.lightingOut);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleLightingOutTexture, data.lightingOut);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage      = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp     = gfx::LoadOp::CLEAR;

        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
            }
        }

        colorAttachmentInfo.beginAccesses = {gfx::AccessType::TRANSFER_READ};
        colorAttachmentInfo.endAccesses   = {gfx::AccessType::TRANSFER_READ};

        gfx::TextureInfo textureInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::TRANSFER_SRC,
            gfx::Format::RGBA8,
            camera->window->getWidth(),
            camera->window->getHeight(),
        };
        data.backBuffer = builder.create<framegraph::Texture>(fgStrHandlePostProcessOutTexture, textureInfo);
        data.backBuffer = builder.write(data.backBuffer, colorAttachmentInfo);
        builder.writeToBlackboard(fgStrHandlePostProcessOutTexture, data.backBuffer);

        // depth
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage         = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp        = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses   = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture));
        if (data.depth.isValid()) {
            data.depth = builder.write(data.depth, depthAttachmentInfo);
            builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);
        }

        auto renderArea = pipeline->getRenderArea(camera, camera->window->swapchain);
        (void)pipeline->getIAByRenderArea(renderArea);
        gfx::Viewport viewport{renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto postExec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *           pipeline   = static_cast<DeferredPipeline *>(_pipeline);
        gfx::RenderPass *renderPass = table.getRenderPass();

        // bind descriptor
        auto *lightingOut = static_cast<gfx::Texture *>(table.getRead(data.lightingOut));

        auto *     cmdBuff         = pipeline->getCommandBuffers()[0];
        uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

        if (!pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            // post process
            auto *const  sceneData = pipeline->getPipelineSceneData();
            scene::Pass *pv        = sceneData->getSharedData()->deferredPostPass;
            gfx::Shader *sd        = sceneData->getSharedData()->deferredPostPassShader;

            // get pso and draw quad
            auto                 rendeArea = pipeline->getRenderArea(camera, camera->window->swapchain);
            gfx::InputAssembler *ia        = pipeline->getIAByRenderArea(rendeArea);
            gfx::PipelineState * pso       = PipelineStateManager::getOrCreatePipelineState(pv, sd, ia, renderPass);

            pv->getDescriptorSet()->bindTexture(0, table.getRead(data.lightingOut));
            pv->getDescriptorSet()->bindSampler(0, pipeline->getDevice()->getSampler({
                                                       gfx::Filter::POINT,
                                                       gfx::Filter::POINT,
                                                       gfx::Filter::NONE,
                                                       gfx::Address::CLAMP,
                                                       gfx::Address::CLAMP,
                                                       gfx::Address::CLAMP,
                                                   }));
            pv->getDescriptorSet()->update();

            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pv->getDescriptorSet());
            cmdBuff->bindInputAssembler(ia);
            cmdBuff->draw(ia);
        }

        _uiPhase->render(camera, renderPass);
        renderProfiler(renderPass, cmdBuff, pipeline->getProfiler(), camera->window->swapchain);
    };

    // add pass
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_POSTPROCESS), DeferredPipeline::fgStrHandlePostprocessPass, postSetup, postExec);
    pipeline->getFrameGraph().presentFromBlackboard(fgStrHandlePostProcessOutTexture, camera->window->frameBuffer->getColorTextures()[0]);
}

} // namespace pipeline
} // namespace cc
