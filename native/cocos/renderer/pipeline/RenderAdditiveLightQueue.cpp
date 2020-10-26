#include "RenderAdditiveLightQueue.h"
#include "BatchedBuffer.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "RenderView.h"
#include "forward/ForwardPipeline.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "helper/SharedMemory.h"

namespace cc {
namespace pipeline {
namespace {
const uint phaseID(PassPhase::getPhaseID("forward-add"));
int getLightPassIndex(const ModelView *model) {
    const auto subModelArrayID = model->getSubModelID();
    const auto count = subModelArrayID[0];
    for (auto i = 1; i <= count; i++) {
        const auto subModel = model->getSubModelView(subModelArrayID[i]);
        for (auto passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto pass = subModel->getPassView(passIdx);
            if (pass->phase == phaseID) {
                return passIdx;
            }
        }
    }
    return -1;
}

bool cullingLight(const Light *light, const ModelView *model) {
    switch (light->getType()) {
        case LightType::SPHERE:
            return model->worldBoundsID && !aabb_aabb(model->getWorldBounds(), light->getAABB());
        case LightType::SPOT:
            return model->worldBoundsID && (!aabb_aabb(model->getWorldBounds(), light->getAABB()) || !aabb_frustum(model->getWorldBounds(), light->getFrustum()));
        default: return false;
    }
}
} // namespace

RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline)
: _device(gfx::Device::getInstance()),
  _instancedQueue(CC_NEW(RenderInstancedQueue)),
  _batchedQueue(CC_NEW(RenderBatchedQueue)) {
    auto forwardPipline = static_cast<ForwardPipeline *>(pipeline);
    _renderObjects = forwardPipline->getRenderObjects();
    _fpScale = forwardPipline->getFpScale();
    _isHDR = forwardPipline->isHDR();
    const auto alignment = _device->getUboOffsetAlignment();
    _lightBufferStride = ((UBOForwardLight::SIZE + alignment - 1) / alignment) * alignment;
    _lightBufferElementCount = _lightBufferStride / sizeof(float);
    _lightBuffer = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        _lightBufferStride * _lightBufferCount,
        _lightBufferStride,
    });
    _firstlightBufferView = _device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
    _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
}

RenderAdditiveLightQueue ::~RenderAdditiveLightQueue() {
    CC_DELETE(_instancedQueue);
    CC_DELETE(_batchedQueue);
}

void RenderAdditiveLightQueue::recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer) {
    _instancedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);
    _batchedQueue->recordCommandBuffer(device, renderPass, cmdBuffer);

    for (const auto &lightPass : _lightPasses) {
        const auto subModel = lightPass.subModel;
        const auto pass = lightPass.pass;
        const auto &dynamicOffsets = lightPass.dynamicOffsets;
        auto shader = lightPass.shader;
        auto ia = subModel->getInputAssembler();
        auto pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);
        auto descriptorSet = subModel->getDescriptorSet();

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);

        for (auto dynamicOffset : dynamicOffsets) {
            _dynamicOffsets[0] = dynamicOffset;
            cmdBuffer->bindDescriptorSet(LOCAL_SET, descriptorSet, _dynamicOffsets);
            cmdBuffer->draw(ia);
        }
    }
}

void RenderAdditiveLightQueue::gatherLightPasses(const RenderView *view, gfx::CommandBuffer *cmdBufferer) {
    _instancedQueue->clear();
    _batchedQueue->clear();
    _validLights.clear();

    for (auto lightPass : _lightPasses) {
        lightPass.dynamicOffsets.clear();
    }

    const auto camera = view->getCamera();
    const auto scene = camera->getScene();
    const auto sphereLightArrayID = scene->getSphereLightArrayID();
    auto count = sphereLightArrayID[0];
    Sphere sphere;
    for (auto i = 1; i <= count; i++) {
        const auto light = scene->getSphereLight(sphereLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
        }
    }
    const auto spotLightArrayID = scene->getSphereLightArrayID();
    count = spotLightArrayID[0];
    for (auto i = 1; i <= count; i++) {
        const auto light = scene->getSpotLight(spotLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
        }
    }

    if (!_validLights.size()) return;

    updateUBOs(view, cmdBufferer);

    for (const auto &renderObject : _renderObjects) {
        const auto model = renderObject.model;

        // this assumes light pass index is the same for all submodels
        const auto lightPassIdx = getLightPassIndex(model);
        if (lightPassIdx < 0) continue;

        _lightIndices.clear();
        for (auto i = 0; i < _validLights.size(); i++) {
            const auto light = _validLights[i];
            bool isCulled = cullingLight(light, model);
            if (!isCulled) {
                _lightIndices.emplace_back(i);
            }
        }

        if (!_lightIndices.size()) continue;
        const auto subModelArrayID = model->getSubModelID();
        const auto subModelCount = subModelArrayID[0];
        for (auto j = 1; j <= subModelCount; j++) {
            const auto subModel = model->getSubModelView(subModelArrayID[j]);
            const auto pass = subModel->getPassView(lightPassIdx);
            const auto batchingScheme = pass->getBatchingScheme();
            auto descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BLOCK.layout.binding, _firstlightBufferView);
            descriptorSet->update();

            if (batchingScheme == BatchingSchemes::INSTANCING) { // instancing
                for (auto idx : _lightIndices) {
                    auto buffer = InstancedBuffer::get(lightPassIdx, idx);
                    buffer->merge(model, subModel, lightPassIdx);
                    buffer->setDynamicOffset(0, _lightBufferStride * idx);
                    _instancedQueue->add(buffer);
                }
            } else if (batchingScheme == BatchingSchemes::VB_MERGING) { // vb-merging
                for (auto idx : _lightIndices) {
                    auto buffer = BatchedBuffer::get(lightPassIdx, idx);
                    buffer->merge(subModel, lightPassIdx, &renderObject);
                    buffer->setDynamicOffset(0, _lightBufferStride * idx);
                    _batchedQueue->add(buffer);
                }
            } else { // standard draw
                const auto count = _lightIndices.size();
                AdditiveLightPass lightPass;
                lightPass.subModel = subModel;
                lightPass.pass = pass;
                lightPass.shader = subModel->getShader(lightPassIdx);
                lightPass.dynamicOffsets.resize(count);
                for (auto idx = 0; idx < count; idx++) {
                    lightPass.dynamicOffsets.emplace_back(_lightBufferStride * idx);
                }

                _lightPasses.emplace_back(std::move(lightPass));
            }
        }
    }
    _instancedQueue->uploadBuffers(cmdBufferer);
    _batchedQueue->uploadBuffers(cmdBufferer);
}

void RenderAdditiveLightQueue::updateUBOs(const RenderView *view, gfx::CommandBuffer *cmdBuffer) {
    const auto exposure = view->getCamera()->exposure;
    const auto validLightCount = _validLights.size();
    if (validLightCount > _lightBufferCount) {
        _firstlightBufferView->destroy();

        _lightBufferCount = nextPow2(validLightCount);
        _lightBuffer->resize(_lightBufferStride * _lightBufferCount);
        _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
        _firstlightBufferView->initialize({_lightBuffer, 0, UBOForwardLight::SIZE});
    }

    for (auto l = 0, offset = 0; l < validLightCount; l++, offset += _lightBufferElementCount) {
        const auto light = _validLights[l];

        auto index = offset + UBOForwardLight::LIGHT_POS_OFFSET;
        _lightBufferData[index++] = light->position.x;
        _lightBufferData[index++] = light->position.y;
        _lightBufferData[index] = light->position.z;

        index = offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET;
        _lightBufferData[index++] = light->size;
        _lightBufferData[index] = light->range;

        index = offset + UBOForwardLight::LIGHT_COLOR_OFFSET;
        const auto &color = light->color;
        if (light->useColorTemperature) {
            const auto &tempRGB = light->colorTemperatureRGB;
            _lightBufferData[index++] = color.x * tempRGB.x;
            _lightBufferData[index++] = color.y * tempRGB.y;
            _lightBufferData[index++] = color.z * tempRGB.z;
        } else {
            _lightBufferData[index++] = color.x;
            _lightBufferData[index++] = color.y;
            _lightBufferData[index++] = color.z;
        }
        if (_isHDR) {
            _lightBufferData[index] = light->luminance * _fpScale * _lightMeterScale;
        } else {
            _lightBufferData[index] = light->luminance * exposure * _lightMeterScale;
        }

        switch (light->getType()) {
            case LightType::SPHERE:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = 0;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = 0;
                break;
            case LightType::SPOT:
                _lightBufferData[offset + UBOForwardLight::LIGHT_POS_OFFSET + 3] = 1.0f;
                _lightBufferData[offset + UBOForwardLight::LIGHT_SIZE_RANGE_ANGLE_OFFSET + 2] = light->spotAngle;

                index = offset + UBOForwardLight::LIGHT_DIR_OFFSET;
                _lightBufferData[index++] = light->direction.x;
                _lightBufferData[index++] = light->direction.y;
                _lightBufferData[index] = light->direction.z;
                break;
            default:
                break;
        }
    }

    cmdBuffer->updateBuffer(_lightBuffer, _lightBufferData.data(), _lightBufferData.size() * sizeof(float));
}

} // namespace pipeline
} // namespace cc
