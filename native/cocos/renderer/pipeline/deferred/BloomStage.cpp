
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

#include "BloomStage.h"
#include "../PipelineStateManager.h"
#include "../PipelineUBO.h"
#include "../RenderPipeline.h"
#include "../RenderQueue.h"
#include "frame-graph/DevicePass.h"
#include "frame-graph/PassNodeBuilder.h"
#include "frame-graph/Resource.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/states/GFXSampler.h"
#include "pipeline/Define.h"
#include "pipeline/UIPhase.h"
#include "profiler/Profiler.h"
#include "renderer/pipeline/deferred/DeferredPipelineSceneData.h"
#include "scene/Camera.h"
#include "scene/Pass.h"
#include "scene/RenderScene.h"
#include "scene/SubModel.h"

namespace cc {
namespace pipeline {
namespace {
const ccstd::string BLOOM_STAGE_NAME = "BloomStage";

framegraph::StringHandle prefilterTexHandle = framegraph::FrameGraph::stringToHandle("prefilterTex");
framegraph::StringHandle downsampleTexHandles[MAX_BLOOM_FILTER_PASS_NUM];
framegraph::StringHandle upsampleTexHandles[MAX_BLOOM_FILTER_PASS_NUM];
framegraph::StringHandle prefilterPassHandle;
framegraph::StringHandle downsamplePassHandles[MAX_BLOOM_FILTER_PASS_NUM];
framegraph::StringHandle upsamplePassHandles[MAX_BLOOM_FILTER_PASS_NUM];
framegraph::StringHandle combinePassHandle;

void initStrHandle() {
    prefilterPassHandle = framegraph::FrameGraph::stringToHandle("bloomPrefilterPass");

    ccstd::string tmp;
    for (int i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
        tmp = ccstd::string("bloomDownsamplePass") + std::to_string(i);
        downsamplePassHandles[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("bloomDownsampleTex") + std::to_string(i);
        downsampleTexHandles[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("bloomUpsamplePass") + std::to_string(i);
        upsamplePassHandles[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("bloomUpsampleTex") + std::to_string(i);
        upsampleTexHandles[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());
    }

    combinePassHandle = framegraph::FrameGraph::stringToHandle("bloomCombinePass");
}
} // namespace

RenderStageInfo BloomStage::initInfo = {
    BLOOM_STAGE_NAME,
    static_cast<uint32_t>(DeferredStagePriority::BLOOM),
    0,
    {ccnew RenderQueueDesc{true, RenderQueueSortMode::BACK_TO_FRONT, {"default"}}},
};
const RenderStageInfo &BloomStage::getInitializeInfo() { return BloomStage::initInfo; }

BloomStage::BloomStage() = default;

bool BloomStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    initStrHandle();

    return true;
}

void BloomStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _phaseID = getPhaseID("default");
}

void BloomStage::destroy() {
    CC_SAFE_DELETE(_prefilterUBO);
    CC_SAFE_DELETE(_combineUBO);
    for (int i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
        CC_SAFE_DELETE(_downsampleUBO[i]);

        CC_SAFE_DELETE(_upsampleUBO[i]);
    }
}

void BloomStage::render(scene::Camera *camera) {
    CC_PROFILE(BloomStageRender);
    auto *pipeline = _pipeline;
    CC_ASSERT_NOT_NULL(pipeline);
    if (!pipeline->isBloomEnabled() || pipeline->getPipelineSceneData()->getRenderObjects().empty()) return;

    if (_prefilterUBO == nullptr) {
        _prefilterUBO = _device->createBuffer({gfx::BufferUsage::UNIFORM, gfx::MemoryUsage::DEVICE | gfx::MemoryUsage::HOST, UBOBloom::SIZE});
        _combineUBO = _device->createBuffer({gfx::BufferUsage::UNIFORM, gfx::MemoryUsage::DEVICE | gfx::MemoryUsage::HOST, UBOBloom::SIZE});
        for (int i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            _downsampleUBO[i] = _device->createBuffer({gfx::BufferUsage::UNIFORM, gfx::MemoryUsage::DEVICE | gfx::MemoryUsage::HOST, UBOBloom::SIZE});
            _upsampleUBO[i] = _device->createBuffer({gfx::BufferUsage::UNIFORM, gfx::MemoryUsage::DEVICE | gfx::MemoryUsage::HOST, UBOBloom::SIZE});
        }

        gfx::SamplerInfo info{
            gfx::Filter::LINEAR,
            gfx::Filter::LINEAR,
            gfx::Filter::NONE,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
            gfx::Address::CLAMP,
        };
        _sampler = pipeline->getDevice()->getSampler(info);
    }

    if (hasFlag(static_cast<gfx::ClearFlags>(camera->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
        _clearColors[0].x = camera->getClearColor().x;
        _clearColors[0].y = camera->getClearColor().y;
        _clearColors[0].z = camera->getClearColor().z;
    }
    _clearColors[0].w = camera->getClearColor().w;

    framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
    colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
    colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
    colorAttachmentInfo.clearColor = _clearColors[0];
    colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;

    auto insertPoint = static_cast<uint32_t>(CommonInsertPoint::DIP_BLOOM);

    // prefilter pass
    struct PrefilterRenderData {
        framegraph::TextureHandle inputTexHandle;
        framegraph::TextureHandle outputTexHandle;
        gfx::Sampler *sampler;
        gfx::Buffer *bloomUBO;
        float textureSize[4];
    };

    auto *stage = static_cast<BloomStage *>(pipeline->getRenderstageByName(BLOOM_STAGE_NAME));
    CC_ASSERT_NOT_NULL(stage);
    int iterations = stage->getIterations();
    float intensity = stage->getIntensity();
    float threshold = stage->getThreshold();

    _renderArea = RenderPipeline::getRenderArea(camera);
    _inputAssembler = pipeline->getIAByRenderArea(_renderArea);
    _renderArea.width >>= 1;
    _renderArea.height >>= 1;
    float shadingScale{_pipeline->getPipelineSceneData()->getShadingScale()};
    auto prefilterSetup = [&](framegraph::PassNodeBuilder &builder, PrefilterRenderData &data) {
        data.sampler = _sampler;
        // read lightingout as input
        data.inputTexHandle = framegraph::TextureHandle(
            builder.readFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture));
        if (!data.inputTexHandle.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale);

            data.inputTexHandle = builder.create(
                RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        }

        data.inputTexHandle = builder.read(data.inputTexHandle);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.inputTexHandle);

        // write to bloom prefilter texture
        data.outputTexHandle = framegraph::TextureHandle(builder.readFromBlackboard(prefilterTexHandle));
        if (!data.outputTexHandle.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale);

            data.outputTexHandle = builder.create(prefilterTexHandle, colorTexInfo);
        }
        data.outputTexHandle = builder.write(data.outputTexHandle, colorAttachmentInfo);
        builder.writeToBlackboard(prefilterTexHandle, data.outputTexHandle);

        // Update threshold
        data.bloomUBO = stage->getPrefilterUBO();
        data.textureSize[2] = threshold;
    };

    auto prefilterExec = [this, camera](PrefilterRenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = _pipeline;
        gfx::RenderPass *renderPass = table.getRenderPass();

        auto *cmdBf = pipeline->getCommandBuffers()[0];
        const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBf->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

        auto *sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());
        scene::Pass *pass = sceneData->getBloomPrefilterPass();
        gfx::Shader *shader = sceneData->getBloomPrefilterPassShader();
        gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(
            pass, shader, _inputAssembler, renderPass);
        CC_ASSERT_NOT_NULL(pso);

        data.bloomUBO->update(data.textureSize, sizeof(data.textureSize));

        pass->getDescriptorSet()->bindBuffer(0, data.bloomUBO);
        pass->getDescriptorSet()->bindTexture(1, table.getRead(data.inputTexHandle));
        pass->getDescriptorSet()->bindSampler(1, data.sampler);
        pass->getDescriptorSet()->update();

        cmdBf->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBf->bindPipelineState(pso);
        cmdBf->bindInputAssembler(_inputAssembler);
        cmdBf->draw(_inputAssembler);
    };

    pipeline->getFrameGraph().addPass<PrefilterRenderData>(insertPoint, prefilterPassHandle, prefilterSetup, prefilterExec);

    struct ScalingSampleRenderData {
        framegraph::TextureHandle inputTexHandle;
        framegraph::TextureHandle outputTexHandle;
        gfx::Sampler *sampler;
        gfx::Buffer *bloomUBO;
        float textureSize[4];
        int index;
    };
    // downsample pass
    for (int i = 0; i < iterations; ++i) {
        _renderArea.width >>= 1;
        _renderArea.height >>= 1;

        auto downsampleSetup = [&, i](framegraph::PassNodeBuilder &builder, ScalingSampleRenderData &data) {
            data.sampler = _sampler;
            data.index = i;
            // read from prefilter texture or last downsample texture
            if (data.index == 0) {
                data.inputTexHandle = builder.read(framegraph::TextureHandle(
                    builder.readFromBlackboard(prefilterTexHandle)));
                builder.writeToBlackboard(prefilterTexHandle, data.inputTexHandle);
            } else {
                data.inputTexHandle = builder.read(framegraph::TextureHandle(
                    builder.readFromBlackboard(downsampleTexHandles[data.index - 1])));
                builder.writeToBlackboard(downsampleTexHandles[data.index - 1], data.inputTexHandle);
            }

            // write to downsample texture
            data.outputTexHandle = framegraph::TextureHandle(
                builder.readFromBlackboard(downsampleTexHandles[data.index]));
            if (!data.outputTexHandle.isValid()) {
                framegraph::Texture::Descriptor colorTexInfo;
                colorTexInfo.format = gfx::Format::RGBA16F;
                colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
                colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale);
                colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale);

                data.outputTexHandle = builder.create(downsampleTexHandles[data.index], colorTexInfo);
            }
            data.outputTexHandle = builder.write(data.outputTexHandle, colorAttachmentInfo);
            builder.writeToBlackboard(downsampleTexHandles[data.index], data.outputTexHandle);

            // Update cc_textureSize
            data.bloomUBO = stage->getDownsampleUBO()[data.index];
            data.textureSize[0] = static_cast<float>(static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale) << 1);
            data.textureSize[1] = static_cast<float>(static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale) << 1);
        };

        auto downsampleExec = [this, camera](ScalingSampleRenderData const &data, const framegraph::DevicePassResourceTable &table) {
            auto *pipeline = _pipeline;
            gfx::RenderPass *renderPass = table.getRenderPass();

            auto *cmdBf = pipeline->getCommandBuffers()[0];
            const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
            cmdBf->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

            auto *const sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());
            scene::Pass *pass = sceneData->getBloomDownSamplePasses()[data.index];
            gfx::Shader *shader = sceneData->getBloomDownSamplePassShader();
            gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(
                pass, shader, _inputAssembler, renderPass);
            CC_ASSERT_NOT_NULL(pso);

            data.bloomUBO->update(data.textureSize, sizeof(data.textureSize));

            pass->getDescriptorSet()->bindBuffer(0, data.bloomUBO);
            pass->getDescriptorSet()->bindTexture(1, table.getRead(data.inputTexHandle));
            pass->getDescriptorSet()->bindSampler(1, data.sampler);
            pass->getDescriptorSet()->update();

            cmdBf->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBf->bindPipelineState(pso);
            cmdBf->bindInputAssembler(_inputAssembler);
            cmdBf->draw(_inputAssembler);
        };

        pipeline->getFrameGraph().addPass<ScalingSampleRenderData>(++insertPoint, downsamplePassHandles[i], downsampleSetup, downsampleExec);
    }

    // upsample pass
    for (int i = 0; i < iterations; ++i) {
        _renderArea.width <<= 1;
        _renderArea.height <<= 1;

        auto upsampleSetup = [&, i](framegraph::PassNodeBuilder &builder, ScalingSampleRenderData &data) {
            data.index = i;
            data.sampler = _sampler;
            // read from last downsample texture or last upsample texture
            if (data.index == 0) {
                data.inputTexHandle = builder.read(framegraph::TextureHandle(
                    builder.readFromBlackboard(downsampleTexHandles[iterations - 1])));
                builder.writeToBlackboard(downsampleTexHandles[iterations - 1], data.inputTexHandle);
            } else {
                data.inputTexHandle = builder.read(framegraph::TextureHandle(
                    builder.readFromBlackboard(upsampleTexHandles[data.index - 1])));
                builder.writeToBlackboard(upsampleTexHandles[data.index - 1], data.inputTexHandle);
            }

            // write to downsample texture
            data.outputTexHandle = framegraph::TextureHandle(
                builder.readFromBlackboard(upsampleTexHandles[data.index]));
            if (!data.outputTexHandle.isValid()) {
                framegraph::Texture::Descriptor colorTexInfo;
                colorTexInfo.format = gfx::Format::RGBA16F;
                colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
                colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale);
                colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale);

                data.outputTexHandle = builder.create(
                    upsampleTexHandles[data.index], colorTexInfo);
            }
            data.outputTexHandle = builder.write(data.outputTexHandle, colorAttachmentInfo);
            builder.writeToBlackboard(upsampleTexHandles[data.index], data.outputTexHandle);

            // Update cc_textureSize
            data.bloomUBO = stage->getUpsampleUBO()[data.index];
            data.textureSize[0] = static_cast<float>(static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale) >> 1);
            data.textureSize[1] = static_cast<float>(static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale) >> 1);
        };

        auto upsampleExec = [this, camera](ScalingSampleRenderData const &data, const framegraph::DevicePassResourceTable &table) {
            auto *pipeline = _pipeline;
            gfx::RenderPass *renderPass = table.getRenderPass();

            auto *cmdBf = pipeline->getCommandBuffers()[0];
            const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
            cmdBf->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

            auto *const sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());
            scene::Pass *pass = sceneData->getBloomUpSamplePasses()[data.index];
            gfx::Shader *shader = sceneData->getBloomUpSamplePassShader();
            gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(
                pass, shader, _inputAssembler, renderPass);
            CC_ASSERT_NOT_NULL(pso);

            data.bloomUBO->update(data.textureSize, sizeof(data.textureSize));

            pass->getDescriptorSet()->bindBuffer(0, data.bloomUBO);
            pass->getDescriptorSet()->bindTexture(1, table.getRead(data.inputTexHandle));
            pass->getDescriptorSet()->bindSampler(1, data.sampler);
            pass->getDescriptorSet()->update();

            cmdBf->bindDescriptorSet(materialSet, pass->getDescriptorSet());
            cmdBf->bindPipelineState(pso);
            cmdBf->bindInputAssembler(_inputAssembler);
            cmdBf->draw(_inputAssembler);
        };

        pipeline->getFrameGraph().addPass<ScalingSampleRenderData>(++insertPoint, upsamplePassHandles[i], upsampleSetup, upsampleExec);
    }

    // combine pass
    struct CombineRenderData {
        framegraph::TextureHandle lightingOutTexHandle;
        framegraph::TextureHandle upsampleTexHandle;
        framegraph::TextureHandle bloomOutTexHandle;
        gfx::Sampler *sampler;
        gfx::Buffer *bloomUBO;
        float textureSize[4];
    };

    _renderArea.width <<= 1;
    _renderArea.height <<= 1;

    auto combineSetup = [&](framegraph::PassNodeBuilder &builder, CombineRenderData &data) {
        data.sampler = _sampler;

        // read lighting result or last upsample texture
        data.lightingOutTexHandle = builder.read(framegraph::TextureHandle(
            builder.readFromBlackboard(RenderPipeline::fgStrHandleOutColorTexture)));
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.lightingOutTexHandle);

        data.upsampleTexHandle = builder.read(framegraph::TextureHandle(
            builder.readFromBlackboard(upsampleTexHandles[iterations - 1])));
        builder.writeToBlackboard(upsampleTexHandles[iterations - 1], data.upsampleTexHandle);

        // write to bloomOut texture
        data.bloomOutTexHandle = framegraph::TextureHandle(
            builder.readFromBlackboard(RenderPipeline::fgStrHandleBloomOutTexture));
        if (!data.bloomOutTexHandle.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(_renderArea.width) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(_renderArea.height) * shadingScale);

            data.bloomOutTexHandle = builder.create(
                RenderPipeline::fgStrHandleBloomOutTexture, colorTexInfo);
        }
        data.bloomOutTexHandle = builder.write(data.bloomOutTexHandle, colorAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleBloomOutTexture, data.bloomOutTexHandle);

        // Update intensity
        data.bloomUBO = stage->getCombineUBO();
        data.textureSize[3] = intensity;
    };

    auto combineExec = [this, camera](CombineRenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = _pipeline;
        gfx::RenderPass *renderPass = table.getRenderPass();

        auto *cmdBf = pipeline->getCommandBuffers()[0];
        const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBf->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

        auto *const sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());
        scene::Pass *pass = sceneData->getBloomCombinePass();
        gfx::Shader *shader = sceneData->getBloomCombinePassShader();
        gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(
            pass, shader, _inputAssembler, renderPass);
        CC_ASSERT_NOT_NULL(pso);

        data.bloomUBO->update(data.textureSize, sizeof(data.textureSize));

        pass->getDescriptorSet()->bindBuffer(0, data.bloomUBO);
        pass->getDescriptorSet()->bindTexture(1, table.getRead(data.lightingOutTexHandle));
        pass->getDescriptorSet()->bindTexture(2, table.getRead(data.upsampleTexHandle));
        pass->getDescriptorSet()->bindSampler(1, data.sampler);
        pass->getDescriptorSet()->bindSampler(2, data.sampler);
        pass->getDescriptorSet()->update();

        cmdBf->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBf->bindPipelineState(pso);
        cmdBf->bindInputAssembler(_inputAssembler);
        cmdBf->draw(_inputAssembler);
    };

    pipeline->getFrameGraph().addPass<CombineRenderData>(++insertPoint, combinePassHandle, combineSetup, combineExec);
}
} // namespace pipeline
} // namespace cc
