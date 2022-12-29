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

#include "LightingStage.h"
#include "../BatchedBuffer.h"
#include "../Define.h"
#if CC_USE_GEOMETRY_RENDERER
    #include "../GeometryRenderer.h"
#endif
#include "../GlobalDescriptorSetManager.h"
#include "../InstancedBuffer.h"
#include "../PipelineStateManager.h"
#include "../PipelineUBO.h"
#include "../PlanarShadowQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "DeferredPipeline.h"
#include "DeferredPipelineSceneData.h"
#include "base/Utils.h"
#include "frame-graph/Blackboard.h"
#include "frame-graph/Handle.h"
#include "gfx-base/GFXDevice.h"
#include "pipeline/Define.h"
#include "profiler/Profiler.h"
#include "scene/RenderScene.h"
#include "scene/SphereLight.h"
#include "scene/SpotLight.h"

namespace cc {
namespace pipeline {
namespace {

const ccstd::string STAGE_NAME = "LightingStage";
const uint32_t MAX_REFLECTOR_SIZE = 5;
framegraph::StringHandle reflectTexHandle = framegraph::FrameGraph::stringToHandle("reflectionTex");
framegraph::StringHandle denoiseTexHandle[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprClearPass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprCompReflectPass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprCompDenoisePass[MAX_REFLECTOR_SIZE];
framegraph::StringHandle ssprRenderPass[MAX_REFLECTOR_SIZE];

framegraph::StringHandle fgStrHandleClusterLightBuffer = framegraph::FrameGraph::stringToHandle("clusterLightBuffer");
framegraph::StringHandle fgStrHandleClusterLightIndexBuffer = framegraph::FrameGraph::stringToHandle("lightIndexBuffer");
framegraph::StringHandle fgStrHandleClusterLightGridBuffer = framegraph::FrameGraph::stringToHandle("lightGridBuffer");

void initStrHandle() {
    ccstd::string tmp;
    for (int i = 0; i < MAX_REFLECTOR_SIZE; ++i) {
        tmp = ccstd::string("denoiseTexureHandle") + std::to_string(i);
        denoiseTexHandle[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("ssprClearPss") + std::to_string(i);
        ssprClearPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("ssprReflectPass") + std::to_string(i);
        ssprCompReflectPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("ssprDenoisePass") + std::to_string(i);
        ssprCompDenoisePass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());

        tmp = ccstd::string("ssprRenderPass") + std::to_string(i);
        ssprRenderPass[i] = framegraph::FrameGraph::stringToHandle(tmp.c_str());
    }
}
} // namespace

RenderStageInfo LightingStage::initInfo = {
    STAGE_NAME,
    static_cast<uint32_t>(DeferredStagePriority::LIGHTING),
    static_cast<uint32_t>(RenderFlowTag::SCENE),
};

const RenderStageInfo &LightingStage::getInitializeInfo() { return LightingStage::initInfo; }

LightingStage::LightingStage() = default;

LightingStage::~LightingStage() {
    CC_SAFE_DESTROY_AND_DELETE(_deferredLitsBufs);
    CC_SAFE_DESTROY_AND_DELETE(_deferredLitsBufView);
}

bool LightingStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID = getPhaseID("default");
    _reflectionPhaseID = getPhaseID("reflection");
    initStrHandle();

    return true;
}

void LightingStage::gatherLights(scene::Camera *camera) {
    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    auto *const sceneData = _pipeline->getPipelineSceneData();

    gfx::CommandBuffer *cmdBuf = pipeline->getCommandBuffers()[0];
    const auto *scene = camera->getScene();

    geometry::Sphere sphere;
    auto exposure = camera->getExposure();
    uint32_t idx = 0;
    int elementLen = sizeof(cc::Vec4) / sizeof(float);
    uint32_t fieldLen = elementLen * _maxDeferredLights;
    uint32_t offset = 0;
    cc::Vec4 tmpArray;

    for (const auto &light : scene->getSphereLights()) {
        if (idx >= _maxDeferredLights) {
            break;
        }

        const auto &position = light->getPosition();
        sphere.setCenter(position);
        sphere.setRadius(light->getRange());
        if (!sphere.sphereFrustum(camera->getFrustum())) {
            continue;
        }
        // position
        offset = idx * elementLen;
        _lightBufferData[offset] = position.x;
        _lightBufferData[offset + 1] = position.y;
        _lightBufferData[offset + 2] = position.z;
        _lightBufferData[offset + 3] = 0;

        // color
        const auto &color = light->getColor();
        offset = idx * elementLen + fieldLen;
        tmpArray.set(color.x, color.y, color.z, 0);
        if (light->isUseColorTemperature()) {
            const auto &colorTemperatureRGB = light->getColorTemperatureRGB();
            tmpArray.x *= colorTemperatureRGB.x;
            tmpArray.y *= colorTemperatureRGB.y;
            tmpArray.z *= colorTemperatureRGB.z;
        }

        if (sceneData->isHDR()) {
            tmpArray.w = light->getLuminanceHDR() * exposure * _lightMeterScale;
        } else {
            tmpArray.w = light->getLuminanceLDR();
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset] = light->getSize();
        _lightBufferData[offset + 1] = light->getRange();
        _lightBufferData[offset + 2] = 0;

        ++idx;
    }

    for (const auto &light : scene->getSpotLights()) {
        if (idx >= _maxDeferredLights) {
            break;
        }

        const auto &position = light->getPosition();
        sphere.setCenter(position);
        sphere.setRadius(light->getRange());
        if (!sphere.sphereFrustum(camera->getFrustum())) {
            continue;
        }
        // position
        offset = idx * elementLen;
        _lightBufferData[offset] = position.x;
        _lightBufferData[offset + 1] = position.y;
        _lightBufferData[offset + 2] = position.z;
        _lightBufferData[offset + 3] = 1;

        // color
        offset = idx * elementLen + fieldLen;
        const auto &color = light->getColor();
        tmpArray.set(color.x, color.y, color.z, 0);
        if (light->isUseColorTemperature()) {
            const auto &colorTemperatureRGB = light->getColorTemperatureRGB();
            tmpArray.x *= colorTemperatureRGB.x;
            tmpArray.y *= colorTemperatureRGB.y;
            tmpArray.z *= colorTemperatureRGB.z;
        }

        if (sceneData->isHDR()) {
            tmpArray.w = light->getLuminanceHDR() * exposure * _lightMeterScale;
        } else {
            tmpArray.w = light->getLuminanceLDR();
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset] = light->getSize();
        _lightBufferData[offset + 1] = light->getRange();
        _lightBufferData[offset + 2] = light->getSpotAngle();

        // dir
        const auto &direction = light->getDirection();
        offset = idx * elementLen + fieldLen * 3;
        _lightBufferData[offset] = direction.x;
        _lightBufferData[offset + 1] = direction.y;
        _lightBufferData[offset + 2] = direction.z;

        ++idx;
    }

    // the count of lights is set to cc_lightDir[0].w
    _lightBufferData[fieldLen * 3 + 3] = static_cast<float>(idx);
    cmdBuf->updateBuffer(_deferredLitsBufs, _lightBufferData.data());
}

void LightingStage::initLightingBuffer() {
    auto *const device = _pipeline->getDevice();

    // color/pos/dir/angle 都是vec4存储, 最后一个vec4只要x存储光源个数
    auto stride = utils::alignTo<uint32_t>(sizeof(Vec4) * 4, device->getCapabilities().uboOffsetAlignment);
    uint32_t totalSize = stride * _maxDeferredLights;

    // create lighting buffer and view
    if (_deferredLitsBufs == nullptr) {
        gfx::BufferInfo bfInfo = {
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            totalSize,
            stride,
        };
        _deferredLitsBufs = device->createBuffer(bfInfo);
    }

    if (_deferredLitsBufView == nullptr) {
        gfx::BufferViewInfo bvInfo = {_deferredLitsBufs, 0, totalSize};
        _deferredLitsBufView = device->createBuffer(bvInfo);
        _descriptorSet->bindBuffer(static_cast<uint32_t>(ModelLocalBindings::UBO_FORWARD_LIGHTS), _deferredLitsBufView);
    }

    _lightBufferData.resize(totalSize / sizeof(float));
}

void LightingStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    auto *const device = pipeline->getDevice();

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint32_t phase = convertPhase(descriptor->stages);
        RenderQueueSortFunc sortFunc = convertQueueSortFunc(descriptor->sortMode);
        RenderQueueCreateInfo info = {descriptor->isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(ccnew RenderQueue(_pipeline, std::move(info), true));
    }

    // not use cluster shading, go normal deferred render path
    if (!pipeline->isClusterEnabled()) {
        // create descriptor set/layout
        gfx::DescriptorSetLayoutInfo layoutInfo = {localDescriptorSetLayout.bindings};
        _descLayout = device->createDescriptorSetLayout(layoutInfo);

        gfx::DescriptorSetInfo setInfo = {_descLayout};
        _descriptorSet = device->createDescriptorSet(setInfo);

        // create lighting buffer and view
        initLightingBuffer();
    }

    _planarShadowQueue = ccnew PlanarShadowQueue(_pipeline);

    // create reflection resource
    RenderQueueCreateInfo info = {true, _reflectionPhaseID, transparentCompareFn};
    _reflectionComp = ccnew ReflectionComp();
    _reflectionComp->init(_device, 8, 8);

    _reflectionRenderQueue = ccnew RenderQueue(_pipeline, std::move(info));

    _defaultSampler = pipeline->getGlobalDSManager()->getPointSampler();
}

void LightingStage::destroy() {
    CC_SAFE_DESTROY_AND_DELETE(_descriptorSet);
    CC_SAFE_DESTROY_AND_DELETE(_descLayout);
    CC_SAFE_DESTROY_AND_DELETE(_planarShadowQueue);
    CC_SAFE_DELETE(_reflectionRenderQueue);
    RenderStage::destroy();

    CC_SAFE_DELETE(_reflectionComp);
}

void LightingStage::fgLightingPass(scene::Camera *camera) {
    // lights info and ubo are updated in ClusterLightCulling::update()
    // if using cluster lighting.
    if (!_pipeline->isClusterEnabled()) {
        // lighting info, ubo
        gatherLights(camera);
        _descriptorSet->update();
    }

    struct RenderData {
        framegraph::TextureHandle gbuffer[3]; // read from gbuffer stage
        framegraph::TextureHandle outputTex;  // output texture
        framegraph::TextureHandle depth;
        framegraph::TextureHandle depthStencil;
        framegraph::BufferHandle lightBuffer;      // light storage buffer
        framegraph::BufferHandle lightIndexBuffer; // light index storage buffer
        framegraph::BufferHandle lightGridBuffer;  // light grid storage buffer
    };

    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    gfx::Color clearColor = pipeline->getClearcolor(camera);
    float shadingScale{_pipeline->getPipelineSceneData()->getShadingScale()};
    _renderArea = RenderPipeline::getRenderArea(camera);
    _inputAssembler = pipeline->getIAByRenderArea(_renderArea);
    _planarShadowQueue->gatherShadowPasses(camera, pipeline->getCommandBuffers()[0]);
    auto lightingSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        builder.subpass(true);

        // read gbuffer
        for (int i = 0; i < 3; i++) {
            data.gbuffer[i] = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i])));
            builder.writeToBlackboard(DeferredPipeline::fgStrHandleGbufferTexture[i], data.gbuffer[i]);
        }

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutDepthTexture));
        data.depth = builder.read(data.depth);

        framegraph::RenderTargetAttachment::Descriptor depthInfo;
        depthInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthInfo.loadOp = gfx::LoadOp::LOAD;
        depthInfo.clearColor = gfx::Color();
        depthInfo.beginAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_READ;
        depthInfo.endAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_READ;

        data.depthStencil = builder.write(data.depth, depthInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depthStencil);

        if (_pipeline->isClusterEnabled()) {
            // read cluster and light info
            data.lightBuffer = framegraph::BufferHandle(builder.readFromBlackboard(fgStrHandleClusterLightBuffer));
            if (data.lightBuffer.isValid()) {
                builder.read(data.lightBuffer);
            }
            data.lightIndexBuffer = framegraph::BufferHandle(builder.readFromBlackboard(fgStrHandleClusterLightIndexBuffer));
            if (data.lightIndexBuffer.isValid()) {
                builder.read(data.lightIndexBuffer);
            }
            data.lightGridBuffer = framegraph::BufferHandle(builder.readFromBlackboard(fgStrHandleClusterLightGridBuffer));
            if (data.lightGridBuffer.isValid()) {
                builder.read(data.lightGridBuffer);
            }
        }

        // write to lighting output
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA16F;
        colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
        colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale);
        colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale);
        data.outputTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor = clearColor;
        colorAttachmentInfo.beginAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;
        colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;
        data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outputTex);
        // set render area
        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto lightingExec = [this, camera](RenderData const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
        auto *const sceneData = static_cast<DeferredPipelineSceneData *>(pipeline->getPipelineSceneData());

        auto *cmdBuff = pipeline->getCommandBuffers()[0];

        // no need to bind localSet in cluster
        if (!_pipeline->isClusterEnabled()) {
            ccstd::vector<uint32_t> dynamicOffsets = {0};
            cmdBuff->bindDescriptorSet(localSet, _descriptorSet, dynamicOffsets);
        }

        const ccstd::array<uint32_t, 1> globalOffsets = {_pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());
        // get PSO and draw quad
        scene::Pass *pass = sceneData->getLightPass();
        gfx::Shader *shader = sceneData->getLightPassShader();
        gfx::PipelineState *pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, _inputAssembler, table.getRenderPass(), table.getSubpassIndex());

        for (uint32_t i = 0; i < DeferredPipeline::GBUFFER_COUNT; ++i) {
            pass->getDescriptorSet()->bindTexture(i, table.getRead(data.gbuffer[i]));
            pass->getDescriptorSet()->bindSampler(i, _defaultSampler);
        }
        pass->getDescriptorSet()->bindTexture(3, table.getRead(data.depth));
        pass->getDescriptorSet()->bindSampler(3, _defaultSampler);

        if (_pipeline->isClusterEnabled()) {
            // cluster buffer bind
            if (data.lightBuffer.isValid()) {
                pass->getDescriptorSet()->bindBuffer(CLUSTER_LIGHT_BINDING, table.getRead(data.lightBuffer));
            }
            if (data.lightIndexBuffer.isValid()) {
                pass->getDescriptorSet()->bindBuffer(CLUSTER_LIGHT_INDEX_BINDING, table.getRead(data.lightIndexBuffer));
            }
            if (data.lightGridBuffer.isValid()) {
                pass->getDescriptorSet()->bindBuffer(CLUSTER_LIGHT_GRID_BINDING, table.getRead(data.lightGridBuffer));
            }
        }

        pass->getDescriptorSet()->update();

        cmdBuff->bindPipelineState(pso);
        cmdBuff->bindInputAssembler(_inputAssembler);
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet());
        cmdBuff->bindDescriptorSet(materialSet, pass->getDescriptorSet());
        cmdBuff->draw(_inputAssembler);
        if (_isTransparentQueueEmpty) {
            _planarShadowQueue->recordCommandBuffer(_device, table.getRenderPass(), cmdBuff, 1);
        }
    };

    pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint32_t>(DeferredInsertPoint::DIP_LIGHTING), DeferredPipeline::fgStrHandleLightingPass, lightingSetup, lightingExec);
}

void LightingStage::fgTransparent(scene::Camera *camera) {
    struct RenderData {
        framegraph::TextureHandle outputTex; // output texture
        framegraph::TextureHandle depth;
    };

    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    gfx::Color clearColor = pipeline->getClearcolor(camera);
    float shadingScale{_pipeline->getPipelineSceneData()->getShadingScale()};
    auto transparentSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        // write to lighting output
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        colorAttachmentInfo.beginAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;
        colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;

        data.outputTex = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutColorTexture));
        bool lightingPassValid = data.outputTex.isValid();
        if (!lightingPassValid) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA16F;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale);

            colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
            colorAttachmentInfo.clearColor = clearColor;

            data.outputTex = builder.create(DeferredPipeline::fgStrHandleOutColorTexture, colorTexInfo);
        }

        data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutColorTexture, data.outputTex);

        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        depthAttachmentInfo.beginAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;
        depthAttachmentInfo.endAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE;

        data.depth = framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutDepthTexture));
        if (!data.depth.isValid()) { // when there is no opaque object present
            gfx::TextureInfo depthTexInfo = {
                gfx::TextureType::TEX2D,
                gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
                gfx::Format::DEPTH_STENCIL,
                static_cast<uint32_t>(static_cast<float>(pipeline->getWidth()) * shadingScale),
                static_cast<uint32_t>(static_cast<float>(pipeline->getHeight()) * shadingScale),
            };
            data.depth = builder.create(DeferredPipeline::fgStrHandleOutDepthTexture, depthTexInfo);
            depthAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        }
        data.depth = builder.write(data.depth, depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutDepthTexture, data.depth);

        // set render area
        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto transparentExec = [this, camera](RenderData const & /*data*/, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
        auto *cmdBuff = pipeline->getCommandBuffers()[0];

        // no need to bind localSet in cluster
        if (!_pipeline->isClusterEnabled()) {
            ccstd::vector<uint32_t> dynamicOffsets = {0};
            cmdBuff->bindDescriptorSet(localSet, _descriptorSet, dynamicOffsets);
        }

        const ccstd::array<uint32_t, 1> globalOffsets = {pipeline->getPipelineUBO()->getCurrentCameraUBOOffset()};
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet(), utils::toUint(globalOffsets.size()), globalOffsets.data());

        // transparent
        for (auto *queue : _renderQueues) {
            queue->sort();
            queue->recordCommandBuffer(pipeline->getDevice(), camera, table.getRenderPass(), cmdBuff, table.getSubpassIndex());
        }

        _planarShadowQueue->recordCommandBuffer(_device, table.getRenderPass(), cmdBuff);
#if CC_USE_GEOMETRY_RENDERER
        if (camera->getGeometryRenderer()) {
            camera->getGeometryRenderer()->render(table.getRenderPass(), cmdBuff, pipeline->getPipelineSceneData());
        }
#endif
    };

    if (!_isTransparentQueueEmpty
#if CC_USE_GEOMETRY_RENDERER
        || (camera->getGeometryRenderer() && !camera->getGeometryRenderer()->empty())) {
#else
    ) {
#endif
        pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint32_t>(DeferredInsertPoint::DIP_TRANSPARENT),
                                                      DeferredPipeline::fgStrHandleTransparentPass, transparentSetup, transparentExec);
    }
}

void LightingStage::putTransparentObj2Queue() {
    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    auto *const sceneData = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();
    _isTransparentQueueEmpty = true;
    uint32_t m = 0;
    uint32_t p = 0;
    size_t k = 0;
    for (auto ro : renderObjects) {
        m = 0;
        const auto *const model = ro.model;
        for (const auto &subModel : model->getSubModels()) {
            p = 0;
            for (const auto &pass : subModel->getPasses()) {
                // TODO(): need to fallback unlit and gizmo material.
                if (pass->getPhase() != _phaseID) continue;
                for (k = 0; k < _renderQueues.size(); k++) {
                    if (_renderQueues[k]->insertRenderPass(ro, m, p)) _isTransparentQueueEmpty = false;
                }
                p++;
            }
            m++;
        }
    }
}

void LightingStage::fgSsprPass(scene::Camera *camera) {
    // The max reflector objects is 5.
    // for each reflector, there are 4 pass, clear pass/reflection pass/denoise pass/render pass
    // each reflector has its own denoise texture, and will be used in render pass
    // All the reflectors use the same reflect texture which is temp resource for the reflectors, and the reflect texture should be cleared for each reflector
    // we first calculate denoise textures of all reflectors one by one, the first 3 pass will be executed
    // then we render all reflectors one by one, the last render pass will be executed

    if (!_device->hasFeature(gfx::Feature::COMPUTE_SHADER)) {
        return;
    }
    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

    _denoiseIndex = 0;
    _matViewProj = camera->getMatViewProj();
    _reflectionElems.clear();

    // step 1 prepare clear model's reflection texture pass. should switch to image clear command after available
    uint32_t minSize = 512;
    uint32_t width = pipeline->getWidth();
    uint32_t height = pipeline->getHeight();
    if (height < width) {
        _ssprTexWidth = minSize * width / height;
        _ssprTexHeight = minSize;
    } else {
        _ssprTexWidth = minSize;
        _ssprTexHeight = minSize * height / width;
    }

    struct DataClear {
        framegraph::TextureHandle reflection;
    };

    auto clearSetup = [&](framegraph::PassNodeBuilder &builder, DataClear &data) {
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA8;
        colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::STORAGE |
                             gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::TRANSFER_DST;
        colorTexInfo.width = _ssprTexWidth;
        colorTexInfo.height = _ssprTexHeight;
        data.reflection = builder.create(reflectTexHandle, colorTexInfo);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        colorAttachmentInfo.clearColor = {0.F, 0.F, 0.F, 0.F};
        colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COMPUTE_SHADER_WRITE;
        data.reflection = builder.write(data.reflection, colorAttachmentInfo);
        builder.writeToBlackboard(reflectTexHandle, data.reflection);
        builder.sideEffect();
    };

    auto clearExec = [](DataClear const &data, const framegraph::DevicePassResourceTable &table) {};

    // step 2 prepare compute the reflection pass, contain 1 dispatch commands, compute pipeline
    struct DataCompReflect {
        framegraph::TextureHandle reflection;  // compute result texture
        framegraph::TextureHandle lightingOut; // read from lighting pass output texture
        framegraph::TextureHandle depth;       // read from gbuffer.depth texture
    };

    auto compReflectSetup = [&](framegraph::PassNodeBuilder &builder, DataCompReflect &data) {
        // if there is no attachment in the pass, render pass will not be created
        // read lighting out as input
        data.lightingOut = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutColorTexture)));
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutColorTexture, data.lightingOut);

        data.depth = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutDepthTexture)));
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);

        // write to reflection
        data.reflection = framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle));
        if (!data.reflection.isValid()) {
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = gfx::Format::RGBA8;
            colorTexInfo.usage = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC | gfx::TextureUsageBit::TRANSFER_DST;
            colorTexInfo.width = _ssprTexWidth;
            colorTexInfo.height = _ssprTexHeight;
            data.reflection = builder.create(reflectTexHandle, colorTexInfo);
        }

        data.reflection = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle)));
        builder.writeToBlackboard(reflectTexHandle, data.reflection);

        data.reflection = builder.write(data.reflection);
        builder.writeToBlackboard(reflectTexHandle, data.reflection);
    };

    auto compReflectExec = [this, camera](DataCompReflect const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

        gfx::Viewport vp = pipeline->getViewport(camera);
        Vec4 value = Vec4(static_cast<float>(vp.left), static_cast<float>(vp.top),
                          static_cast<float>(vp.width), static_cast<float>(vp.height));
        _reflectionComp->applyTexSize(_ssprTexWidth, _ssprTexHeight, camera->getMatView(), camera->getMatViewProj(),
                                      camera->getMatViewProjInv(), camera->getMatProjInv(), value);

        auto *texReflection = static_cast<gfx::Texture *>(table.getWrite(data.reflection));
        auto *texLightingOut = static_cast<gfx::Texture *>(table.getRead(data.lightingOut));
        auto *texDepth = static_cast<gfx::Texture *>(table.getRead(data.depth));

        // step 1 pipeline barrier before exec
        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        cmdBuff->pipelineBarrier(_reflectionComp->getBarrierPre());

        auto *textureBarrier{_device->getTextureBarrier({
            gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE,
            gfx::AccessFlagBit::COMPUTE_SHADER_READ_TEXTURE,
        })};
        cmdBuff->pipelineBarrier(nullptr, nullptr, nullptr, 0, &textureBarrier, &texDepth, 1);

        // step 2 bind descriptors
        gfx::DescriptorSet *reflectDesc = _reflectionComp->getDescriptorSet();
        gfx::Sampler *sampler = _reflectionComp->getSampler();
        gfx::Buffer *constBuffer = _reflectionComp->getConstantsBuffer();

        reflectDesc->bindBuffer(0, constBuffer);
        reflectDesc->bindSampler(1, sampler);
        reflectDesc->bindTexture(1, texLightingOut);
        reflectDesc->bindSampler(2, sampler);
        reflectDesc->bindTexture(2, texDepth);
        reflectDesc->bindTexture(3, texReflection);
        reflectDesc->bindBuffer(4, _reflectionElems[_denoiseIndex].set->getBuffer(0));
        reflectDesc->update();

        // set 1, subModel->getDescriptorSet(0)
        cmdBuff->bindPipelineState(const_cast<gfx::PipelineState *>(_reflectionComp->getPipelineState(pipeline->isEnvmapEnabled())));
        cmdBuff->bindDescriptorSet(globalSet, reflectDesc);
        cmdBuff->dispatch(_reflectionComp->getDispatchInfo());
    };

    // step 3 prepare compute the denoise pass, contain 1 dispatch commands, compute pipeline
    struct DataCompDenoise {
        framegraph::TextureHandle denoise;    // each reflector has its own denoise texture
        framegraph::TextureHandle reflection; // the texture from last pass
        framegraph::TextureHandle depth;      // each reflector has its own denoise texture
    };

    auto compDenoiseSetup = [&](framegraph::PassNodeBuilder &builder, DataCompDenoise &data) {
        // if there is no attachment in the pass, render pass will not be created
        // read reflectTexHandle
        data.reflection = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(reflectTexHandle)));
        builder.writeToBlackboard(reflectTexHandle, data.reflection);

        // write to reflection
        framegraph::Texture::Descriptor colorTexInfo;
        colorTexInfo.format = gfx::Format::RGBA8;
        colorTexInfo.usage = gfx::TextureUsageBit::STORAGE | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_SRC;
        colorTexInfo.width = _ssprTexWidth;
        colorTexInfo.height = _ssprTexHeight;
        data.denoise = builder.create(denoiseTexHandle[_denoiseIndex], colorTexInfo);

        data.depth = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(RenderPipeline::fgStrHandleOutDepthTexture)));
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);

        data.denoise = builder.write(data.denoise);
        builder.writeToBlackboard(denoiseTexHandle[_denoiseIndex], data.denoise);
    };

    auto compDenoiseExec = [this](DataCompDenoise const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);

        auto *denoiseTex = static_cast<gfx::Texture *>(table.getWrite(data.denoise));
        auto *reflectionTex = static_cast<gfx::Texture *>(table.getRead(data.reflection));
        auto *depth = static_cast<gfx::Texture *>(table.getRead(data.depth));
        auto &elem = _reflectionElems[_denoiseIndex];

        // pipeline barrier
        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        cmdBuff->pipelineBarrier(nullptr, {}, {}, const_cast<gfx::TextureBarrierList &>(_reflectionComp->getBarrierBeforeDenoise()), {reflectionTex, denoiseTex});

        // bind descriptor set
        bool useEnvmap = pipeline->isEnvmapEnabled();
        _reflectionComp->getDenoiseDescriptorSet()->bindTexture(0, reflectionTex);
        _reflectionComp->getDenoiseDescriptorSet()->bindSampler(0, _reflectionComp->getSampler());

        if (useEnvmap) {
            _reflectionComp->getDenoiseDescriptorSet()->bindTexture(1, pipeline->getDescriptorSet()->getTexture(static_cast<uint32_t>(PipelineGlobalBindings::SAMPLER_ENVIRONMENT)));
            _reflectionComp->getDenoiseDescriptorSet()->bindSampler(1, _reflectionComp->getSampler());
            _reflectionComp->getDenoiseDescriptorSet()->bindTexture(2, depth);
            _reflectionComp->getDenoiseDescriptorSet()->bindSampler(2, _reflectionComp->getSampler());
            _reflectionComp->getDenoiseDescriptorSet()->bindBuffer(3, _reflectionComp->getConstantsBuffer());
        }

        _reflectionComp->getDenoiseDescriptorSet()->update();

        elem.set->bindTexture(static_cast<uint32_t>(ModelLocalBindings::STORAGE_REFLECTION), denoiseTex);
        elem.set->bindSampler(static_cast<uint32_t>(ModelLocalBindings::STORAGE_REFLECTION), _defaultSampler);

        // for render stage usage
        elem.set->bindTexture(static_cast<uint32_t>(ModelLocalBindings::SAMPLER_REFLECTION), denoiseTex);
        elem.set->bindSampler(static_cast<uint32_t>(ModelLocalBindings::SAMPLER_REFLECTION), _defaultSampler);
        elem.set->update();

        cmdBuff->bindPipelineState(const_cast<gfx::PipelineState *>(_reflectionComp->getDenoisePipelineState(useEnvmap)));
        cmdBuff->bindDescriptorSet(globalSet, const_cast<gfx::DescriptorSet *>(_reflectionComp->getDenoiseDescriptorSet()));
        cmdBuff->bindDescriptorSet(materialSet, elem.set);
        cmdBuff->dispatch(_reflectionComp->getDenoiseDispatchInfo());

        // pipeline barrier
        // dispatch -> fragment
        cmdBuff->pipelineBarrier(nullptr, {}, {}, _reflectionComp->getBarrierAfterDenoise(), {denoiseTex});

        _denoiseIndex = (_denoiseIndex + 1) % _reflectionElems.size();
    };

    // step 4 prepare render reflector objects pass, graphics pipeline
    struct DataRender {
        framegraph::TextureHandle denoise;     // input texture
        framegraph::TextureHandle lightingOut; // attachment, load and write
        framegraph::TextureHandle depth;       // attachment, load and write
    };

    auto renderSetup = [&](framegraph::PassNodeBuilder &builder, DataRender &data) {
        data.denoise = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(denoiseTexHandle[_denoiseIndex])));
        builder.writeToBlackboard(denoiseTexHandle[_denoiseIndex], data.denoise);

        // write lighting out, as an attachment
        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        colorAttachmentInfo.clearColor = gfx::Color();
        colorAttachmentInfo.beginAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;
        colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE;

        data.lightingOut = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutColorTexture)), colorAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutColorTexture, data.lightingOut);

        // read depth, as an attachment
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp = gfx::LoadOp::LOAD;
        depthAttachmentInfo.clearColor = gfx::Color();
        depthAttachmentInfo.beginAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_READ;
        depthAttachmentInfo.endAccesses = gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_READ;

        data.depth = builder.write(framegraph::TextureHandle(builder.readFromBlackboard(DeferredPipeline::fgStrHandleOutDepthTexture)), depthAttachmentInfo);
        builder.writeToBlackboard(DeferredPipeline::fgStrHandleOutDepthTexture, data.depth);

        builder.setViewport(pipeline->getViewport(camera), pipeline->getScissor(camera));
    };

    auto renderExec = [this, camera](DataRender const &data, const framegraph::DevicePassResourceTable &table) {
        auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
        auto *cmdBuff = pipeline->getCommandBuffers()[0];
        auto &elem = _reflectionElems[_denoiseIndex];

        // bind descriptor
        cmdBuff->bindDescriptorSet(globalSet, pipeline->getDescriptorSet());

        gfx::DescriptorSet *descLocal = elem.set; // sub model descriptor set
        auto *denoiseTex = static_cast<gfx::Texture *>(table.getRead(data.denoise));

        descLocal->bindTexture(static_cast<uint32_t>(ModelLocalBindings::SAMPLER_REFLECTION), denoiseTex);
        descLocal->bindSampler(static_cast<uint32_t>(ModelLocalBindings::SAMPLER_REFLECTION), _defaultSampler);
        descLocal->update();
        cmdBuff->bindDescriptorSet(localSet, descLocal);

        _reflectionRenderQueue->clear();
        _reflectionRenderQueue->insertRenderPass(elem.renderObject, elem.modelIndex, elem.passIndex);

        gfx::RenderPass *renderPass = table.getRenderPass();
        _reflectionRenderQueue->sort();
        _reflectionRenderQueue->recordCommandBuffer(pipeline->getDevice(), camera, renderPass, cmdBuff);
    };

    // step 5 add framegraph passes
    auto *const sceneData = _pipeline->getPipelineSceneData();
    const auto &renderObjects = sceneData->getRenderObjects();
    uint32_t m = 0;
    uint32_t p = 0;
    for (const auto &ro : renderObjects) {
        const auto *model = ro.model;
        const auto &subModels = model->getSubModels();
        for (m = 0; m < subModels.size(); ++m) {
            const auto &subModel = subModels[m];
            const auto &passes = subModel->getPasses();
            auto passCount = passes.size();
            for (p = 0; p < passCount; ++p) {
                const auto &pass = passes[p];
                if (pass->getPhase() == _reflectionPhaseID) {
                    RenderElem elem = {ro, subModel->getDescriptorSet(), m, p};
                    _reflectionElems.push_back(elem);
                }
            }
        }
    }

    auto insertPoint = static_cast<uint32_t>(DeferredInsertPoint::DIP_SSPR);
    for (uint32_t i = 0; i < _reflectionElems.size(); ++i) {
        // add clear and comp passes here
        pipeline->getFrameGraph().addPass<DataClear>(insertPoint++, ssprClearPass[i], clearSetup, clearExec);
        pipeline->getFrameGraph().addPass<DataCompReflect>(insertPoint++, ssprCompReflectPass[i], compReflectSetup, compReflectExec);
        pipeline->getFrameGraph().addPass<DataCompDenoise>(insertPoint++, ssprCompDenoisePass[i], compDenoiseSetup, compDenoiseExec);
    }

    for (uint32_t i = 0; i < _reflectionElems.size(); ++i) {
        // add graphic pass here
        pipeline->getFrameGraph().addPass<DataRender>(insertPoint++, ssprRenderPass[i], renderSetup, renderExec);
    }
}

void LightingStage::render(scene::Camera *camera) {
    CC_PROFILE(LightingStageRender);
    auto *pipeline = static_cast<DeferredPipeline *>(_pipeline);
    pipeline->getPipelineUBO()->updateShadowUBO(camera);
    putTransparentObj2Queue();
    // if gbuffer pass does not exist, skip lighting pass.
    // transparent objects draw after lighting pass, can be automatically merged by FG
    if (pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleGbufferPass)) {
        fgLightingPass(camera);
    }

    fgTransparent(camera);

    // if lighting pass does not exist, skip SSPR pass.
    // switch to clear image API when available
    if (pipeline->getFrameGraph().hasPass(DeferredPipeline::fgStrHandleLightingPass)) {
        fgSsprPass(camera);
    }
}

} // namespace pipeline
} // namespace cc
