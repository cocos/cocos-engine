
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
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "scene/SubModel.h"
#include "frame-graph/PassNodeBuilder.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/Resource.h"

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

    gfx::DescriptorSetLayout *globalSetlayout = _device->createDescriptorSetLayout({globalDescriptorSetLayout.bindings});
    _globalSet = _device->createDescriptorSet({ globalSetlayout });
}

void PostprocessStage::destroy() {
    CC_SAFE_DELETE(_globalSetlayout);
    CC_SAFE_DELETE(_globalSet);
    CC_SAFE_DELETE(_uiPhase);
}

void PostprocessStage::render(scene::Camera *camera) {
    _fgStrHandlePostOut = DeferredPipeline::fgStrHandleBackBufferTexture;
    struct RenderData {
        framegraph::TextureHandle lightingOut;      // read from lighting output
        framegraph::TextureHandle backBuffer;       // write to back buffer
        framegraph::TextureHandle depth;
        framegraph::TextureHandle placerholder;
    };

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->clearFlag), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->clearColor.x;
        _clearColors[0].y = camera->clearColor.y;
        _clearColors[0].z = camera->clearColor.z;
    }
    _clearColors[0].w = camera->clearColor.w;

    // in post-process, the output is not always backbuffer, its frame buffer should be camera->window->frameBuffer
    // in cocos when camera->window->frameBuffer->_colorTextures[0] == nullptr, it means that render to swapchain image, that's backbuffer
    // when camera->window->frameBuffer->_colorTextures[0] != nullptr, it means that render to a staging texture
    auto *      pipeline      = static_cast<DeferredPipeline *>(_pipeline);
    if (camera->window->frameBuffer->getColorTextures()[0] != nullptr) {
        _fgStrHandlePostOut = framegraph::FrameGraph::stringToHandle("fgStrHandlePostoutTexture");
        gfx::TextureInfo textureInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA16F,
            camera->window->frameBuffer->getColorTextures()[0]->getWidth(),
            camera->window->frameBuffer->getColorTextures()[0]->getHeight(),
        };

        auto *output = new framegraph::Resource<gfx::Texture, gfx::TextureInfo>(textureInfo);
        output->createPersistent(camera->window->frameBuffer->getColorTextures()[0]);

        pipeline->getFrameGraph().getBlackboard().put(_fgStrHandlePostOut, pipeline->getFrameGraph().importExternal(_fgStrHandlePostOut, *output));
    }

    auto postSetup = [&] (framegraph::PassNodeBuilder &builder, RenderData &data) {
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

        // backbuffer is as an attachment
        if (camera->window->frameBuffer->getColorTextures()[0] != nullptr) {
            data.placerholder = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleBackBufferTexture)));
            builder.writeToBlackboard(DeferredPipeline::fgStrHandleBackBufferTexture, data.placerholder);
        }

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage       = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor  =  _clearColors[0];
        colorAttachmentInfo.loadOp      = gfx::LoadOp::CLEAR;

        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
                colorAttachmentInfo.beginAccesses = {gfx::AccessType::PRESENT};
            }
        }

        colorAttachmentInfo.endAccesses = {gfx::AccessType::PRESENT};
        data.backBuffer = framegraph::TextureHandle(builder.readFromBlackboard(_fgStrHandlePostOut));
        data.backBuffer = builder.write(data.backBuffer, colorAttachmentInfo);
        builder.writeToBlackboard(_fgStrHandlePostOut, data.backBuffer);

        // depth
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage       = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp      = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_WRITE};
        depthAttachmentInfo.endAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};

        data.depth = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexturePost)), depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        auto renderArea = pipeline->getRenderArea(camera, !camera->window->hasOffScreenAttachments);
        (void)pipeline->getIAByRenderArea(renderArea);
        gfx::Viewport viewport{ renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto postExec = [&] (RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(RenderPipeline::getInstance());
        assert(pipeline != nullptr);
        auto *stage = static_cast<PostprocessStage *>(pipeline->getRenderstageByName(STAGE_NAME));
        assert(stage != nullptr);
        gfx::RenderPass *renderPass = table.getRenderPass().get();
        assert(renderPass != nullptr);

        // bind descriptor
        auto *lightingOut = static_cast<gfx::Texture *>(table.getRead(data.lightingOut));

        gfx::SamplerInfo info{
            gfx::Filter::LINEAR,
            gfx::Filter::LINEAR,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        };

        auto *     cmdBf           = pipeline->getCommandBuffers()[0];
        stage->getGlobalSet()->bindBuffer(0, pipeline->getDescriptorSet()->getBuffer(0));
        stage->getGlobalSet()->bindBuffer(1, pipeline->getDescriptorSet()->getBuffer(1));
        const auto  samplerHash = SamplerLib::genSamplerHash(info);
        auto *const sampler     = SamplerLib::getSampler(samplerHash);
        stage->getGlobalSet()->bindSampler(static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP), sampler);
        stage->getGlobalSet()->bindTexture(static_cast<uint>(PipelineGlobalBindings::SAMPLER_LIGHTING_RESULTMAP), lightingOut);
        stage->getGlobalSet()->update();

        uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBf->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), stage->getGlobalSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

        if (!pipeline->getPipelineSceneData()->getRenderObjects().empty()) {
            // post process
            auto *const  sceneData = pipeline->getPipelineSceneData();
            scene::Pass *pv        = sceneData->getSharedData()->deferredPostPass;
            gfx::Shader *sd        = sceneData->getSharedData()->deferredPostPassShader;

            // get pso and draw quad
            auto *camera = pipeline->getFrameGraphCamera();
            auto rendeArea = pipeline->getRenderArea(camera, !camera->window->hasOffScreenAttachments);
            gfx::InputAssembler *ia = pipeline->getIAByRenderArea(rendeArea);
            gfx::PipelineState * pso = PipelineStateManager::getOrCreatePipelineState(pv, sd, ia, renderPass);
            assert(pso != nullptr);

            cmdBf->bindPipelineState(pso);
            cmdBf->bindInputAssembler(ia);
            cmdBf->draw(ia);
        }
        stage->getUIPhase()->render(pipeline->getFrameGraphCamera(), renderPass);
    };

    auto uiPhaseSetup = [&] (framegraph::PassNodeBuilder &builder, RenderData &data) {
        // backbuffer is as an attachment
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage       = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.clearColor = _clearColors[0];
        colorAttachmentInfo.loadOp      = gfx::LoadOp::CLEAR;

        auto clearFlags = static_cast<gfx::ClearFlagBit>(camera->clearFlag);
        if (!hasFlag(clearFlags, gfx::ClearFlagBit::COLOR)) {
            if (hasFlag(clearFlags, static_cast<gfx::ClearFlagBit>(skyboxFlag))) {
                colorAttachmentInfo.loadOp = gfx::LoadOp::DISCARD;
            } else {
                colorAttachmentInfo.loadOp        = gfx::LoadOp::LOAD;
                colorAttachmentInfo.beginAccesses = {gfx::AccessType::PRESENT};
            }
        }

        colorAttachmentInfo.endAccesses = {gfx::AccessType::PRESENT};

        data.backBuffer = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleBackBufferTexture)), colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleBackBufferTexture, data.backBuffer);

        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage       = framegraph::RenderTargetAttachment::Usage::DEPTH;
        depthAttachmentInfo.loadOp      = gfx::LoadOp::LOAD;
        depthAttachmentInfo.beginAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};
        depthAttachmentInfo.endAccesses = {gfx::AccessType::DEPTH_STENCIL_ATTACHMENT_READ};

        data.depth = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleDepthTexture)), depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleDepthTexture, data.depth);

        auto renderArea = pipeline->getRenderArea(camera, !camera->window->hasOffScreenAttachments);
        gfx::Viewport viewport{ renderArea.x, renderArea.y, renderArea.width, renderArea.height, 0.F, 1.F};
        builder.setViewport(viewport, renderArea);
    };

    auto uiPhaseExec = [&] (RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        CC_UNUSED_PARAM(data);
        auto *pipeline = static_cast<DeferredPipeline *>(RenderPipeline::getInstance());
        assert(pipeline != nullptr);
        auto *stage = static_cast<PostprocessStage *>(pipeline->getRenderstageByName(STAGE_NAME));
        assert(stage != nullptr);
        gfx::RenderPass *renderPass = table.getRenderPass().get();
        assert(renderPass != nullptr);

        stage->getGlobalSet()->bindBuffer(0, pipeline->getDescriptorSet()->getBuffer(0));
        stage->getGlobalSet()->bindBuffer(1, pipeline->getDescriptorSet()->getBuffer(1));

        stage->getGlobalSet()->update();

        auto *     cmdBf           = pipeline->getCommandBuffers()[0];
        uint const globalOffsets[] = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBf->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), stage->getGlobalSet(), static_cast<uint>(std::size(globalOffsets)), globalOffsets);

        stage->getUIPhase()->render(pipeline->getFrameGraphCamera(), renderPass);
    };

    // add pass
    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(DeferredInsertPoint::IP_POSTPROCESS), DeferredPipeline::fgStrHandlePostprocessPass, postSetup, postExec);
    pipeline->getFrameGraph().presentFromBlackboard(DeferredPipeline::fgStrHandleBackBufferTexture);
}
} // namespace pipeline
} // namespace cc
