
/****************************************************************************
 Copyright (c) 2020-2021 Huawei Technologies Co., Ltd.
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

#include "PostProcessStage.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/PassNodeBuilder.h"
#include "frame-graph/Resource.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/Define.h"
#include "pipeline/UIPhase.h"
#include "pipeline/helper/Utils.h"
#include "profiler/Profiler.h"
#include "renderer/pipeline/GlobalDescriptorSetManager.h"
#include "renderer/pipeline/PipelineStateManager.h"
#include "renderer/pipeline/PipelineUBO.h"
#include "renderer/pipeline/RenderPipeline.h"
#include "renderer/pipeline/RenderQueue.h"
#include "renderer/pipeline/UIPhase.h"
#include "renderer/pipeline/deferred/DeferredPipelineSceneData.h"
#include "scene/Camera.h"
#include "scene/Pass.h"
#include "scene/RenderWindow.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {
namespace {
const ccstd::string STAGE_NAME = "PostProcessStage";
}

RenderStageInfo PostProcessStage::initInfo = {
    STAGE_NAME,
    static_cast<uint32_t>(DeferredStagePriority::POSTPROCESS),
    0,
    {ccnew RenderQueueDesc{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};
const RenderStageInfo &PostProcessStage::getInitializeInfo() { return PostProcessStage::initInfo; }

PostProcessStage::PostProcessStage() {
    _uiPhase = ccnew UIPhase;
}

bool PostProcessStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;

    return true;
}

void PostProcessStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);
    _uiPhase->activate(pipeline);
    _phaseID = getPhaseID("default");

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint32_t phase = 0;
        for (const auto &stage : descriptor->stages) {
            phase |= getPhaseID(stage);
        }

        std::function<int(const RenderPass &, const RenderPass &)> sortFunc = opaqueCompareFn;
        switch (descriptor->sortMode) {
            case RenderQueueSortMode::BACK_TO_FRONT:
                sortFunc = transparentCompareFn;
                break;
            case RenderQueueSortMode::FRONT_TO_BACK:
                sortFunc = opaqueCompareFn;
            default:
                break;
        }

        RenderQueueCreateInfo info = {descriptor->isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(ccnew RenderQueue(_pipeline, std::move(info)));
    }
}

void PostProcessStage::destroy() {
    CC_SAFE_DELETE(_uiPhase);
}

void PostProcessStage::render(scene::Camera *camera) {
    CC_PROFILE(PostProcessStageRender);
    static framegraph::StringHandle fgStrHandlePostProcessOutTexture = framegraph::FrameGraph::stringToHandle("postProcessOutputTexture");
    struct RenderData {
        framegraph::TextureHandle outColorTex; // read from lighting output
        framegraph::TextureHandle backBuffer;  // write to back buffer
        framegraph::TextureHandle depth;
    };

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->getClearColor().x;
        _clearColors[0].y = camera->getClearColor().y;
        _clearColors[0].z = camera->getClearColor().z;
    }
    _clearColors[0].w = camera->getClearColor().w;
    _renderArea = RenderPipeline::getRenderArea(camera);
    _inputAssembler = _pipeline->getIAByRenderArea(_renderArea);
    auto *pipeline = _pipeline;
    float shadingScale{_pipeline->getPipelineSceneData()->getShadingScale()};
    auto postSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        if (pipeline->isBloomEnabled()) {
            data.outColorTex = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleBloomOutTexture));
        } else {
            data.outColorTex = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture));
        }

        if (!data.outColorTex.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale);

            data.outColorTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        }

        data.outColorTex = builder.read(data.outColorTex);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outColorTex);

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

        colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses =
            camera->getWindow()->getSwapchain()
                ? gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE
                : gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;

        gfx::TextureInfo textureInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT,
            gfx::Format::RGBA8,
            static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale),
            static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale),
        };
        if (shadingScale != 1.F) {
            textureInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
        }
        data.backBuffer = builder.create(fgStrHandlePostProcessOutTexture, textureInfo);
        data.backBuffer = builder.write(data.backBuffer, colorAttachmentInfo);
        builder.writeToBlackboard(fgStrHandlePostProcessOutTexture, data.backBuffer);

        // depth
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.beginAccesses = depthAttachmentInfo.endAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutDepthTexture));
        if (!data.depth.isValid()) {
            gfx::TextureInfo depthTexInfo{
                gfx::TextureType::TEX2D,
                gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
                gfx::Format::DEPTH_STENCIL,
                static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale),
                static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale),
            };
            data.depth = builder.create(RenderPipeline::fgStrHandleOutDepthTexture, depthTexInfo);
        }
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);

        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto postExec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = _pipeline;
        gfx::RenderPass *renderPass = table.getRenderPass();

        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

        if (!pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            // post process
            auto *const sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());
            scene::Pass *pv = sceneData->getPostPass();
            gfx::Shader *sd = sceneData->getPostPassShader();
            float shadingScale{sceneData->getShadingScale()};
            // get pso and draw quad
            gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(pv, sd, _inputAssembler, renderPass);
            pipeline::GlobalDSManager *globalDS = pipeline->getGlobalDSManager();
            gfx::Sampler *sampler = shadingScale < 1.F ? globalDS->getPointSampler() : globalDS->getLinearSampler();

            pv->getDescriptorSet()->bindTexture(0, table.getRead(data.outColorTex));
            pv->getDescriptorSet()->bindSampler(0, sampler);
            pv->getDescriptorSet()->update();

            cmdBuff->bindPipelineState(pso);
            cmdBuff->bindDescriptorSet(materialSet, pv->getDescriptorSet());
            cmdBuff->bindInputAssembler(_inputAssembler);
            cmdBuff->draw(_inputAssembler);
        }

        _uiPhase->render(camera, renderPass);
        renderProfiler(renderPass, cmdBuff, pipeline->getProfiler(), camera);
#if CC_USE_DEBUG_RENDERER
        renderDebugRenderer(renderPass, cmdBuff, pipeline->getPipelineSceneData(), camera);
#endif
    };

    // add pass
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint32_t>(CommonInsertPoint::DIP_POSTPROCESS), RenderPipeline::fgStrHandlePostprocessPass, postSetup, postExec);
    pipeline->getFrameGraph().presentFromBlackboard(fgStrHandlePostProcessOutTexture, camera->getWindow()->getFramebuffer()->getColorTextures()[0], shadingScale == 1.F);
}

} // namespace pipeline
} // namespace cc
