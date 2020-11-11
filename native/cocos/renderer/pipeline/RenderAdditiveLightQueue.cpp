#include <array>

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
#include "gfx/GFXFramebuffer.h"

namespace cc {
namespace pipeline {
RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline):
_pipeline(static_cast<ForwardPipeline *>(pipeline)),
    _instancedQueue(CC_NEW(RenderInstancedQueue)),
    _batchedQueue(CC_NEW(RenderBatchedQueue)) {
    _renderObjects = _pipeline->getRenderObjects();
    _fpScale = _pipeline->getFpScale();
    _isHDR = _pipeline->isHDR();
    auto *device = gfx::Device::getInstance();
    const auto alignment = device->getUboOffsetAlignment();
    _lightBufferStride = ((UBOForwardLight::SIZE + alignment - 1) / alignment) * alignment;
    _lightBufferElementCount = _lightBufferStride / sizeof(float);
    _lightBuffer = device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        _lightBufferStride * _lightBufferCount,
        _lightBufferStride,
    });
    _firstlightBufferView = device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
    _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
    _dynamicOffsets.resize(1, 0);

    gfx::SamplerInfo info{
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    };
    const auto shadowMapSamplerHash = genSamplerHash(std::move(info));
    _sampler = getSampler(shadowMapSamplerHash);

    _phaseID = getPhaseID("forward-add");
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
        auto *shader = lightPass.shader;
        const auto lights = lightPass.lights;
        auto *ia = subModel->getInputAssembler();
        auto *pso = PipelineStateManager::getOrCreatePipelineState(pass, shader, ia, renderPass);
        auto *descriptorSet = subModel->getDescriptorSet();

        cmdBuffer->bindPipelineState(pso);
        cmdBuffer->bindDescriptorSet(MATERIAL_SET, pass->getDescriptorSet());
        cmdBuffer->bindInputAssembler(ia);

        for (size_t i = 0; i < dynamicOffsets.size(); ++i) {
            const auto *light = lights[i];
            if (light->getType() == LightType::SPOT && 
                _pipeline->getShadowFramebuffer().count(light) && 
                _pipeline->getShadows()->getShadowType() == ShadowType::SHADOWMAP) {
                updateSpotUBO(descriptorSet, light, cmdBuffer);
            }
            _dynamicOffsets[0] = dynamicOffsets[i];
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
        lightPass.lights.clear();
    }
    _lightPasses.clear();

    const auto camera = view->getCamera();
    const auto scene = camera->getScene();
    const auto sphereLightArrayID = scene->getSphereLightArrayID();
    auto count = sphereLightArrayID ? sphereLightArrayID[0] : 0;
    Sphere sphere;
    for (unsigned i = 1; i <= count; i++) {
        const auto light = scene->getSphereLight(sphereLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
        }
    }
    const auto spotLightArrayID = scene->getSpotLightArrayID();
    count = spotLightArrayID ? spotLightArrayID[0] : 0;
    for (unsigned i = 1; i <= count; i++) {
        const auto light = scene->getSpotLight(spotLightArrayID[i]);
        sphere.setCenter(light->position);
        sphere.setRadius(light->range);
        if (sphere_frustum(&sphere, camera->getFrustum())) {
            _validLights.emplace_back(light);
        }
    }

    if (_validLights.empty()) return;

    updateUBOs(view, cmdBufferer);

    const auto &renderObjects = _pipeline->getRenderObjects();
    for (const auto &renderObject : renderObjects) {
        const auto model = renderObject.model;

        // this assumes light pass index is the same for all submodels
        const auto lightPassIdx = getLightPassIndex(model);
        if (lightPassIdx < 0) continue;

        _lightIndices.clear();
        for (size_t i = 0; i < _validLights.size(); i++) {
            const auto light = _validLights[i];
            const bool isCulled = cullingLight(light, model);
            if (!isCulled) {
                _lightIndices.emplace_back(i);
            }
        }

        if (_lightIndices.empty()) continue;
        const auto subModelArrayID = model->getSubModelID();
        const auto subModelCount = subModelArrayID[0];
        for (unsigned j = 1; j <= subModelCount; j++) {
            const auto subModel = model->getSubModelView(subModelArrayID[j]);
            const auto pass = subModel->getPassView(lightPassIdx);
            const auto batchingScheme = pass->getBatchingScheme();
            auto descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BLOCK.layout.binding, _firstlightBufferView);
            descriptorSet->update();

            if (batchingScheme == BatchingSchemes::INSTANCING) { // instancing
                for (auto idx : _lightIndices) {
                    auto buffer = InstancedBuffer::get(subModel->passID[lightPassIdx], idx);
                    buffer->merge(model, subModel, lightPassIdx);
                    buffer->setDynamicOffset(0, _lightBufferStride * idx);
                    _instancedQueue->add(buffer);
                }
            } else if (batchingScheme == BatchingSchemes::VB_MERGING) { // vb-merging
                for (auto idx : _lightIndices) {
                    auto buffer = BatchedBuffer::get(subModel->passID[lightPassIdx], idx);
                    buffer->merge(subModel, lightPassIdx, model);
                    buffer->setDynamicOffset(0, _lightBufferStride * idx);
                    _batchedQueue->add(buffer);
                }
            } else { // standard draw
                count = _lightIndices.size();
                AdditiveLightPass lightPass;
                lightPass.subModel = subModel;
                lightPass.pass = pass;
                lightPass.shader = subModel->getShader(lightPassIdx);
                lightPass.dynamicOffsets.resize(count);
                for (unsigned idx = 0; idx < count; idx++) {
                    lightPass.lights.emplace_back(_validLights[idx]);
                    lightPass.dynamicOffsets[idx] = _lightBufferStride * _lightIndices[idx];
                }

                _lightPasses.emplace_back(std::move(lightPass));
            }
        }
    }
    _instancedQueue->uploadBuffers(cmdBufferer);
    _batchedQueue->uploadBuffers(cmdBufferer);
}

void RenderAdditiveLightQueue::updateSpotUBO(gfx::DescriptorSet *descriptorSet, const Light *light, gfx::CommandBuffer *cmdBufferer) const {
    const auto *shadowInfo = _pipeline->getShadows();
    auto shadowUBO = _pipeline->getShadowUBO();
    if (light->getType() != LightType::SPOT) {
        return;
    }

    const auto &matShadowCamera = light->getNode()->worldMatrix;

    const auto matShadowView = matShadowCamera.getInversed();

    cc::Mat4 matShadowViewProj;
    cc::Mat4::createPerspective(light->spotAngle, light->aspect, 0.001f, light->range, &matShadowViewProj);

    matShadowViewProj.multiply(matShadowView);

    // shadow info
    float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias / 10.0f};
    memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));

    gfx::Texture *texture = nullptr;
    if (_pipeline->getShadowFramebuffer().count(light)) {
        texture = _pipeline->getShadowFramebuffer().at(light)->getColorTextures()[0];
    } else {
        return;
    }

    descriptorSet->bindTexture(UniformSpotLightingMapSampler.layout.binding, texture);
    descriptorSet->bindSampler(UniformSpotLightingMapSampler.layout.binding, _sampler);
    descriptorSet->update();

    cmdBufferer->updateBuffer(_pipeline->getDescriptorSet()->getBuffer(UBOShadow::BLOCK.layout.binding), shadowUBO.data(), UBOShadow::SIZE);
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

    for (unsigned l = 0, offset = 0; l < validLightCount; l++, offset += _lightBufferElementCount) {
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

int RenderAdditiveLightQueue::getLightPassIndex(const ModelView *model) const{
    const auto subModelArrayID = model->getSubModelID();
    const auto count = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto subModel = model->getSubModelView(subModelArrayID[i]);
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                return passIdx;
            }
        }
    }
    return -1;
}

bool RenderAdditiveLightQueue::cullingLight(const Light *light, const ModelView *model) {
    switch (light->getType()) {
        case LightType::SPHERE:
            return model->worldBoundsID && !aabb_aabb(model->getWorldBounds(), light->getAABB());
        case LightType::SPOT:
            return model->worldBoundsID && (!aabb_aabb(model->getWorldBounds(), light->getAABB()) || !aabb_frustum(model->getWorldBounds(), light->getFrustum()));
        default: return false;
    }
}

} // namespace pipeline
} // namespace cc
