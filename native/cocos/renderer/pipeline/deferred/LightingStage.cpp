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

#include "LightingStage.h"
#include "../BatchedBuffer.h"
#include "../InstancedBuffer.h"
#include "../PipelineStateManager.h"
#include "../PlanarShadowQueue.h"
#include "../RenderBatchedQueue.h"
#include "../RenderInstancedQueue.h"
#include "../RenderQueue.h"
#include "../helper/SharedMemory.h"
#include "DeferredPipeline.h"
#include "LightingFlow.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXQueue.h"

namespace cc {
namespace pipeline {
namespace {
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

RenderStageInfo LightingStage::initInfo = {
    "LightingStage",
    static_cast<uint>(DeferredStagePriority::LIGHTING),
    static_cast<uint>(RenderFlowTag::SCENE),
};

const RenderStageInfo &LightingStage::getInitializeInfo() { return LightingStage::initInfo; }

LightingStage::LightingStage() = default;

LightingStage::~LightingStage() {
    _deferredLitsBufs->destroy();
    _deferredLitsBufs = nullptr;
    _deferredLitsBufView->destroy();
    _deferredLitsBufView = nullptr;
}

bool LightingStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    _renderQueueDescriptors = info.renderQueues;
    _phaseID                = getPhaseID("default");
    _defPhaseID             = getPhaseID("deferred");
    return true;
}

void LightingStage::gatherLights(Camera *camera) {
    auto *pipeline = dynamic_cast<DeferredPipeline *>(_pipeline);
    if (!pipeline) {
        return;
    }

    auto *const sceneData  = _pipeline->getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();

    gfx::CommandBuffer *cmdBuf             = pipeline->getCommandBuffers()[0];
    const auto *        scene              = camera->getScene();
    const auto *const   sphereLightArrayID = scene->getSphereLightArrayID();
    auto                sphereCount        = sphereLightArrayID ? sphereLightArrayID[0] : 0;
    const auto *const   spotLightArrayID   = scene->getSpotLightArrayID();
    auto                spotCount          = spotLightArrayID ? spotLightArrayID[0] : 0;

    Sphere   sphere;
    auto     exposure   = camera->exposure;
    uint     idx        = 0;
    int      elementLen = sizeof(cc::Vec4) / sizeof(float);
    uint     fieldLen   = elementLen * _maxDeferredLights;
    uint     offset     = 0;
    cc::Vec4 tmpArray;

    for (uint i = 1; i <= sphereCount && idx < _maxDeferredLights; i++, idx++) {
        const auto *const light = cc::pipeline::Scene::getSphereLight(sphereLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (!sphere_frustum(&sphere, camera->getFrustum())) {
            continue;
        }
        // position
        offset                       = idx * elementLen;
        _lightBufferData[offset]     = light->position.x;
        _lightBufferData[offset + 1] = light->position.y;
        _lightBufferData[offset + 2] = light->position.z;
        _lightBufferData[offset + 3] = 0;

        // color
        offset = idx * elementLen + fieldLen;
        tmpArray.set(light->color.x, light->color.y, light->color.z, 0);
        if (light->useColorTemperature) {
            tmpArray.x *= light->colorTemperatureRGB.x;
            tmpArray.y *= light->colorTemperatureRGB.y;
            tmpArray.z *= light->colorTemperatureRGB.z;
        }

        if (sharedData->isHDR) {
            tmpArray.w = light->luminance * sharedData->fpScale * _lightMeterScale;
        } else {
            tmpArray.w = light->luminance * exposure * _lightMeterScale;
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset                       = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset]     = light->size;
        _lightBufferData[offset + 1] = light->range;
        _lightBufferData[offset + 2] = 0;
    }

    for (uint i = 1; i <= spotCount && idx < _maxDeferredLights; i++, idx++) {
        const auto *const light = cc::pipeline::Scene::getSpotLight(spotLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (!sphere_frustum(&sphere, camera->getFrustum())) {
            continue;
        }
        // position
        offset                       = idx * elementLen;
        _lightBufferData[offset]     = light->position.x;
        _lightBufferData[offset + 1] = light->position.y;
        _lightBufferData[offset + 2] = light->position.z;
        _lightBufferData[offset + 3] = 1;

        // color
        offset = idx * elementLen + fieldLen;
        tmpArray.set(light->color.x, light->color.y, light->color.z, 0);
        if (light->useColorTemperature) {
            tmpArray.x *= light->colorTemperatureRGB.x;
            tmpArray.y *= light->colorTemperatureRGB.y;
            tmpArray.z *= light->colorTemperatureRGB.z;
        }

        if (sharedData->isHDR) {
            tmpArray.w = light->luminance * sharedData->fpScale * _lightMeterScale;
        } else {
            tmpArray.w = light->luminance * exposure * _lightMeterScale;
        }

        _lightBufferData[offset + 0] = tmpArray.x;
        _lightBufferData[offset + 1] = tmpArray.y;
        _lightBufferData[offset + 2] = tmpArray.z;
        _lightBufferData[offset + 3] = tmpArray.w;

        // size range angle
        offset                       = idx * elementLen + fieldLen * 2;
        _lightBufferData[offset]     = light->size;
        _lightBufferData[offset + 1] = light->range;
        _lightBufferData[offset + 2] = light->spotAngle;

        // dir
        offset                       = idx * elementLen + fieldLen * 3;
        _lightBufferData[offset]     = light->direction.x;
        _lightBufferData[offset + 1] = light->direction.y;
        _lightBufferData[offset + 2] = light->direction.z;
    }

    // the count of lights is set to cc_lightDir[0].w
    _lightBufferData[fieldLen * 3 + 3] = static_cast<float>(idx);
    cmdBuf->updateBuffer(_deferredLitsBufs, _lightBufferData.data());
}

void LightingStage::initLightingBuffer() {
    auto *const device = _pipeline->getDevice();

    // color/pos/dir/angle 都是vec4存储, 最后一个vec4只要x存储光源个数
    uint totalSize = sizeof(Vec4) * 4 * _maxDeferredLights;
    totalSize      = static_cast<uint>(std::ceil(static_cast<float>(totalSize) / device->getCapabilities().uboOffsetAlignment) * device->getCapabilities().uboOffsetAlignment);

    // create lighting buffer and view
    if (_deferredLitsBufs == nullptr) {
        gfx::BufferInfo bfInfo = {
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            totalSize,
            static_cast<uint>(device->getCapabilities().uboOffsetAlignment),
        };
        _deferredLitsBufs = device->createBuffer(bfInfo);
        assert(_deferredLitsBufs != nullptr);
    }

    if (_deferredLitsBufView == nullptr) {
        gfx::BufferViewInfo bvInfo = {_deferredLitsBufs, 0, totalSize};
        _deferredLitsBufView       = device->createBuffer(bvInfo);
        assert(_deferredLitsBufView != nullptr);
        _descriptorSet->bindBuffer(static_cast<uint>(ModelLocalBindings::UBO_FORWARD_LIGHTS), _deferredLitsBufView);
    }

    _lightBufferData.resize(totalSize / sizeof(float));
}

void LightingStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    auto *const device = pipeline->getDevice();

    for (const auto &descriptor : _renderQueueDescriptors) {
        uint                  phase    = convertPhase(descriptor.stages);
        RenderQueueSortFunc   sortFunc = convertQueueSortFunc(descriptor.sortMode);
        RenderQueueCreateInfo info     = {descriptor.isTransparent, phase, sortFunc};
        _renderQueues.emplace_back(CC_NEW(RenderQueue(std::move(info))));
    }

    // create descriptorset/layout
    gfx::DescriptorSetLayoutInfo layoutInfo = {localDescriptorSetLayout.bindings};
    _descLayout                             = device->createDescriptorSetLayout(layoutInfo);

    gfx::DescriptorSetInfo setInfo = {_descLayout};
    _descriptorSet                 = device->createDescriptorSet(setInfo);

    // create lighting buffer and view
    initLightingBuffer();

    _planarShadowQueue = CC_NEW(PlanarShadowQueue(_pipeline));
}

void LightingStage::destroy() {
    CC_SAFE_DELETE(_planarShadowQueue);
    RenderStage::destroy();
}

void LightingStage::render(Camera *camera) {
    auto *      pipeline      = static_cast<DeferredPipeline *>(_pipeline);
    auto *const sceneData     = _pipeline->getPipelineSceneData();
    auto *const sharedData    = sceneData->getSharedData();
    const auto &renderObjects = sceneData->getRenderObjects();

    if (renderObjects.empty()) {
        return;
    }

    auto *cmdBuff = pipeline->getCommandBuffers()[0];

    // lighting info
    gatherLights(camera);
    _descriptorSet->update();

    vector<uint> dynamicOffsets = {0};
    cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::LOCAL), _descriptorSet, dynamicOffsets);

    // draw quad
    gfx::Rect renderArea = pipeline->getRenderArea(camera, false);

    gfx::Color clearColor = {0.0, 0.0, 0.0, 1.0};
    if (camera->clearFlag & static_cast<uint>(gfx::ClearFlagBit::COLOR)) {
        if (sharedData->isHDR) {
            srgbToLinear(&clearColor, camera->clearColor);
            const auto scale = sharedData->fpScale / camera->exposure;
            clearColor.x *= scale;
            clearColor.y *= scale;
            clearColor.z *= scale;
        } else {
            clearColor = camera->clearColor;
        }
    }

    clearColor.w = 0;

    auto *const deferredData = pipeline->getDeferredRenderData();
    auto *      frameBuffer  = deferredData->lightingFrameBuff;
    auto *      renderPass   = frameBuffer->getRenderPass();

    cmdBuff->beginRenderPass(renderPass, frameBuffer, renderArea, &clearColor,
                             camera->clearDepth, camera->clearStencil);

    cmdBuff->bindDescriptorSet(static_cast<uint>(SetIndex::GLOBAL), pipeline->getDescriptorSet());

    // get pso and draw quad
    PassView *   pass   = sceneData->getSharedData()->getDeferredLightPass();
    gfx::Shader *shader = sceneData->getSharedData()->getDeferredLightPassShader();

    gfx::InputAssembler *inputAssembler = pipeline->getQuadIAOffScreen();
    gfx::PipelineState * pState         = PipelineStateManager::getOrCreatePipelineState(
        pass, shader, inputAssembler, renderPass);
    assert(pState != nullptr);

    cmdBuff->bindPipelineState(pState);
    cmdBuff->bindInputAssembler(inputAssembler);
    cmdBuff->draw(inputAssembler);

    // transparent
    for (auto *queue : _renderQueues) {
        queue->clear();
    }

    uint   m = 0;
    uint   p = 0;
    size_t k = 0;
    for (auto ro : renderObjects) {
        const auto *const model         = ro.model;
        const auto *const subModelID    = model->getSubModelID();
        const auto        subModelCount = subModelID[0];
        for (m = 1; m <= subModelCount; ++m) {
            const auto *subModel = cc::pipeline::ModelView::getSubModelView(subModelID[m]);
            for (p = 0; p < subModel->passCount; ++p) {
                const PassView *pass = subModel->getPassView(p);
                // TODO(xwx): need fallback of unlit and gizmo material.
                if (pass->phase != _phaseID && pass->phase != _defPhaseID) continue;
                for (k = 0; k < _renderQueues.size(); k++) {
                    _renderQueues[k]->insertRenderPass(ro, m, p);
                }
            }
        }
    }

    for (auto *queue : _renderQueues) {
        queue->sort();
        queue->recordCommandBuffer(_device, renderPass, cmdBuff);
    }

    // planerQueue
    _planarShadowQueue->recordCommandBuffer(_device, renderPass, cmdBuff);

    cmdBuff->endRenderPass();
}

} // namespace pipeline
} // namespace cc
