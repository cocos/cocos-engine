#include <array>

#include "BatchedBuffer.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderAdditiveLightQueue.h"

#include "Application.h"
#include "RenderBatchedQueue.h"
#include "RenderInstancedQueue.h"
#include "RenderView.h"
#include "forward/ForwardPipeline.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "helper/SharedMemory.h"
#include "gfx/GFXSampler.h"
#include "gfx/GFXTexture.h"
#include "Define.h"
#include "forward/SceneCulling.h"

namespace cc {
namespace pipeline {
namespace {
#define TO_VEC3(dst, src, offset) \
    dst[offset] = src.x;          \
    dst[offset + 1] = src.y;      \
    dst[offset + 2] = src.z;
#define TO_VEC4(dst, src, offset) \
    dst[offset] = src.x;          \
    dst[offset + 1] = src.y;      \
    dst[offset + 2] = src.z;      \
    dst[offset + 3] = src.w;
} // namespace

RenderAdditiveLightQueue::RenderAdditiveLightQueue(RenderPipeline *pipeline) : _pipeline(static_cast<ForwardPipeline *>(pipeline)),
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
    _firstLightBufferView = device->createBuffer({_lightBuffer, 0, UBOForwardLight::SIZE});
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

    _globalUBO.fill(0.f);
    _shadowUBO.fill(0.f);
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
            auto *globalDescriptorSet = getOrCreateDescriptorSet(light);
            _dynamicOffsets[0] = dynamicOffsets[i];
            cmdBuffer->bindDescriptorSet(GLOBAL_SET, globalDescriptorSet);
            cmdBuffer->bindDescriptorSet(LOCAL_SET, descriptorSet, _dynamicOffsets);
            cmdBuffer->draw(ia);
        }
    }
}

void RenderAdditiveLightQueue::gatherLightPasses(const RenderView *view, gfx::CommandBuffer *cmdBufferer) {
    static vector<uint> lightPassIndices;

    clear();

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
            getOrCreateDescriptorSet(light);
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
            getOrCreateDescriptorSet(light);
        }
    }

    if (_validLights.empty()) return;

    updateUBOs(view, cmdBufferer);
    updateLightDescriptorSet(view, cmdBufferer);

    const auto &renderObjects = _pipeline->getRenderObjects();
    for (const auto &renderObject : renderObjects) {
        const auto model = renderObject.model;
        if (!getLightPassIndex(model, lightPassIndices)) continue;

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
            const auto lightPassIdx = lightPassIndices[j - 1];
            if (lightPassIdx == UINT_MAX) continue;
            const auto subModel = model->getSubModelView(subModelArrayID[j]);
            const auto pass = subModel->getPassView(lightPassIdx);
            const auto batchingScheme = pass->getBatchingScheme();
            auto descriptorSet = subModel->getDescriptorSet();
            descriptorSet->bindBuffer(UBOForwardLight::BINDING, _firstLightBufferView);
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

void RenderAdditiveLightQueue::destroy() {
    for (auto &pair : _descriptorSetMap) {
        auto *descriptorSet = pair.second;
        descriptorSet->getBuffer(UBOGlobal::BINDING)->destroy();
        descriptorSet->getBuffer(UBOShadow::BINDING)->destroy();
        descriptorSet->getSampler(SHADOWMAP::BINDING)->destroy();
        descriptorSet->getTexture(SHADOWMAP::BINDING)->destroy();
        descriptorSet->getSampler(SPOT_LIGHTING_MAP::BINDING)->destroy();
        descriptorSet->getTexture(SPOT_LIGHTING_MAP::BINDING)->destroy();
        descriptorSet->destroy();
    }
    _descriptorSetMap.clear();
}

void RenderAdditiveLightQueue::clear() {
    _instancedQueue->clear();
    _batchedQueue->clear();
    _validLights.clear();

    for (auto lightPass : _lightPasses) {
        lightPass.dynamicOffsets.clear();
        lightPass.lights.clear();
    }
    _lightPasses.clear();
}

void RenderAdditiveLightQueue::updateUBOs(const RenderView *view, gfx::CommandBuffer *cmdBuffer) {
    const auto exposure = view->getCamera()->exposure;
    const auto validLightCount = _validLights.size();
    if (validLightCount > _lightBufferCount) {
        _firstLightBufferView->destroy();

        _lightBufferCount = nextPow2(validLightCount);
        _lightBuffer->resize(_lightBufferStride * _lightBufferCount);
        _lightBufferData.resize(_lightBufferElementCount * _lightBufferCount);
        _firstLightBufferView->initialize({_lightBuffer, 0, UBOForwardLight::SIZE});
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

void RenderAdditiveLightQueue::updateLightDescriptorSet(const RenderView *view, gfx::CommandBuffer *cmdBuffer) {
    auto *shadowInfo = _pipeline->getShadows();
    const auto camera = view->getCamera();
    const auto scene = camera->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();

    for (const auto *light : _validLights) {
        auto *descriptorSet = getOrCreateDescriptorSet(light);
        if (!descriptorSet) { return; }

        descriptorSet->bindSampler(SHADOWMAP::BINDING, _sampler);
        descriptorSet->bindSampler(SPOT_LIGHTING_MAP::BINDING, _sampler);
        // Main light sampler binding
        descriptorSet->bindTexture(SHADOWMAP::BINDING, _pipeline->getDefaultTexture());
        descriptorSet->update();

        _globalUBO.fill(0.0f);
        _shadowUBO.fill(0.0f);
        updateGlobalDescriptorSet(view, cmdBuffer);

        switch (light->getType()) {
            case LightType::SPOT: {
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, _shadowUBO);
                }

                const auto &matShadowCamera = light->getNode()->worldMatrix;

                const auto matShadowView = matShadowCamera.getInversed();

                cc::Mat4 matShadowViewProj;
                cc::Mat4::createPerspective(light->spotAngle, light->aspect, 0.001f, light->range, &matShadowViewProj);

                matShadowViewProj.multiply(matShadowView);

                // shadow info
                float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias};
                memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
                memcpy(_shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));
                // Spot light sampler binding
                const auto &shadowFramebufferMap = _pipeline->getShadowFramebufferMap();
                if (shadowFramebufferMap.count(light) > 0) {
                    auto *texture = shadowFramebufferMap.at(light)->getColorTextures()[0];
                    if (texture) {
                        descriptorSet->bindTexture(SPOT_LIGHTING_MAP::BINDING, texture);
                    }
                }
            } break;
            case LightType::SPHERE: {
                // update planar PROJ
                if (mainLight) {
                    updateDirLight(shadowInfo, mainLight, _shadowUBO);
                }
                // Reserve sphere light shadow interface
            } break;
            default:;
        }
        descriptorSet->update();

        cmdBuffer->updateBuffer(descriptorSet->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
        cmdBuffer->updateBuffer(descriptorSet->getBuffer(UBOGlobal::BINDING), _globalUBO.data(),UBOGlobal::SIZE);
    }
}

void RenderAdditiveLightQueue::updateGlobalDescriptorSet(const RenderView *view, gfx::CommandBuffer *cmdBuffer) {
    const auto root = GET_ROOT();
    const auto camera = view->getCamera();
    const auto scene = camera->getScene();

    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();

    const auto ambient = _pipeline->getAmbient();
    const auto fog = _pipeline->getFog();
    const auto shadingScale = _pipeline->getShadingScale();
    auto &uboGlobalView = _globalUBO;
    auto *device = gfx::Device::getInstance();

    const auto shadingWidth = std::floor(device->getWidth());
    const auto shadingHeight = std::floor(device->getHeight());

    // update UBOGlobal
    uboGlobalView[UBOGlobal::TIME_OFFSET] = root->cumulativeTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 1] = root->frameTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 2] = Application::getInstance()->getTotalFrames();

    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET] = device->getWidth();
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1] = device->getHeight();
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1];

    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET] = camera->width / shadingWidth * shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1] = camera->height / shadingHeight * shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 2] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 3] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_INV_OFFSET, camera->getNode()->worldMatrix.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));
    TO_VEC3(uboGlobalView, camera->position, UBOGlobal::CAMERA_POS_OFFSET);

    auto projectionSignY = device->getScreenSpaceSignY();
    if (view->getWindow()->hasOffScreenAttachments) {
        projectionSignY *= device->getUVSpaceSignY(); // need flipping if drawing on render targets
    }
    uboGlobalView[UBOGlobal::CAMERA_POS_OFFSET + 3] = projectionSignY;

    const auto exposure = camera->exposure;
    uboGlobalView[UBOGlobal::EXPOSURE_OFFSET] = exposure;
    uboGlobalView[UBOGlobal::EXPOSURE_OFFSET + 1] = 1.0f / exposure;
    uboGlobalView[UBOGlobal::EXPOSURE_OFFSET + 2] = _isHDR ? 1.0f : 0.0;
    uboGlobalView[UBOGlobal::EXPOSURE_OFFSET + 3] = _fpScale / exposure;

    if (mainLight) {
        TO_VEC3(uboGlobalView, mainLight->direction, UBOGlobal::MAIN_LIT_DIR_OFFSET);
        TO_VEC3(uboGlobalView, mainLight->color, UBOGlobal::MAIN_LIT_COLOR_OFFSET);
        if (mainLight->useColorTemperature) {
            const auto colorTempRGB = mainLight->colorTemperatureRGB;
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (_isHDR) {
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * _fpScale;
        } else {
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * exposure;
        }
    } else {
        TO_VEC3(uboGlobalView, Vec3::UNIT_Z, UBOGlobal::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(uboGlobalView, Vec4::ZERO, UBOGlobal::MAIN_LIT_COLOR_OFFSET);
    }

    Vec4 skyColor = ambient->skyColor;
    if (_isHDR) {
        skyColor.w = ambient->skyIllum * _fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(uboGlobalView, skyColor, UBOGlobal::AMBIENT_SKY_OFFSET);

    uboGlobalView[UBOGlobal::AMBIENT_GROUND_OFFSET] = ambient->groundAlbedo.x;
    uboGlobalView[UBOGlobal::AMBIENT_GROUND_OFFSET + 1] = ambient->groundAlbedo.y;
    uboGlobalView[UBOGlobal::AMBIENT_GROUND_OFFSET + 2] = ambient->groundAlbedo.z;
    const auto *envmap = _pipeline->getDescriptorSet()->getTexture((uint)PipelineGlobalBindings::SAMPLER_ENVIRONMENT);
    if (envmap) uboGlobalView[UBOGlobal::AMBIENT_GROUND_OFFSET + 3] = envmap->getLevelCount();

    if (fog->enabled) {
        TO_VEC4(uboGlobalView, fog->fogColor, UBOGlobal::GLOBAL_FOG_COLOR_OFFSET);

        uboGlobalView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET] = fog->fogStart;
        uboGlobalView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET + 1] = fog->fogEnd;
        uboGlobalView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET + 2] = fog->fogDensity;

        uboGlobalView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET] = fog->fogTop;
        uboGlobalView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET + 1] = fog->fogRange;
        uboGlobalView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET + 2] = fog->fogAtten;
    }
}

bool RenderAdditiveLightQueue::getLightPassIndex(const ModelView *model, vector<uint> &lightPassIndices) const {
    lightPassIndices.clear();
    bool hasValidLightPass = false;

    const auto subModelArrayID = model->getSubModelID();
    const auto count = subModelArrayID[0];
    for (unsigned i = 1; i <= count; i++) {
        const auto subModel = model->getSubModelView(subModelArrayID[i]);
        uint lightPassIndex = UINT_MAX;
        for (unsigned passIdx = 0; passIdx < subModel->passCount; passIdx++) {
            const auto pass = subModel->getPassView(passIdx);
            if (pass->phase == _phaseID) {
                lightPassIndex = passIdx;
                hasValidLightPass = true;
                break;
            }
        }
        lightPassIndices.push_back(lightPassIndex);
    }

    return hasValidLightPass;
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

gfx::DescriptorSet *RenderAdditiveLightQueue::getOrCreateDescriptorSet(const Light *light) {
    if (!_descriptorSetMap.count(light)) {
        auto *device = gfx::Device::getInstance();
        auto *descriptorSet = device->createDescriptorSet({_pipeline->getDescriptorSetLayout()});

        auto globalUBO = device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            UBOGlobal::SIZE,
            UBOGlobal::SIZE,
            gfx::BufferFlagBit::NONE,
        });
        descriptorSet->bindBuffer(UBOGlobal::BINDING, globalUBO);

        auto shadowUBO = device->createBuffer({
            gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
            UBOShadow::SIZE,
            UBOShadow::SIZE,
            gfx::BufferFlagBit::NONE,
        });
        descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);

        // Main light sampler binding
        descriptorSet->bindSampler(SHADOWMAP::BINDING, _sampler);
        descriptorSet->bindTexture(SHADOWMAP::BINDING, _pipeline->getDefaultTexture());
        // Spot light sampler binding
        descriptorSet->bindSampler(SPOT_LIGHTING_MAP::BINDING, _sampler);
        descriptorSet->bindTexture(SPOT_LIGHTING_MAP::BINDING, _pipeline->getDefaultTexture());

        descriptorSet->update();

        _descriptorSetMap.emplace(map<const Light *, gfx::DescriptorSet *>::value_type(light, descriptorSet));

        return descriptorSet;
    }

    return _descriptorSetMap.at(light);
}

} // namespace pipeline
} // namespace cc
