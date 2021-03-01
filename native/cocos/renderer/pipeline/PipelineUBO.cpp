/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "PipelineUBO.h"
#include "platform/Application.h"
#include "SceneCulling.h"
#include "gfx-base/GFXDevice.h"
#include "RenderPipeline.h"

namespace cc {

namespace pipeline {

#define TO_VEC3(dst, src, offset) \
    dst[offset] = src.x;          \
    dst[offset + 1] = src.y;      \
    dst[offset + 2] = src.z;
#define TO_VEC4(dst, src, offset) \
    dst[offset] = src.x;          \
    dst[offset + 1] = src.y;      \
    dst[offset + 2] = src.z;      \
    dst[offset + 3] = src.w;      \

Mat4 matShadowViewProj;

void PipelineUBO::updateGlobalUBOView(const RenderPipeline *pipeline, std::array<float, UBOGlobal::COUNT> &bufferView)
{
    const auto root = GET_ROOT();
    auto device = gfx::Device::getInstance();
    auto &uboGlobalView = bufferView;

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

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];
}

void PipelineUBO::updateCameraUBOView(const RenderPipeline *pipeline, std::array<float, UBOCamera::COUNT> &bufferView,
    const Camera *camera, bool hasOffScreenAttachments)
{
    const auto scene = camera->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    auto sceneData = pipeline->getPipelineSceneData();
    const auto sharedData = sceneData->getSharedData();
    const auto fpScale = sharedData->fpScale;
    const auto descriptorSet = pipeline->getDescriptorSet();
    auto ambient = sharedData->getAmbient();
    auto fog = sharedData->getFog();
    auto isHDR = sharedData->isHDR;
    auto shadingScale = sharedData->shadingScale;

    auto *device = gfx::Device::getInstance();
    auto &uboCameraView = bufferView;

    const auto shadingWidth = std::floor(device->getWidth());
    const auto shadingHeight = std::floor(device->getHeight());

    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET] = camera->width / shadingWidth * shadingScale;
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1] = camera->height / shadingHeight * shadingScale;
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 2] = 1.0 / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET];
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 3] = 1.0 / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1];

    const auto exposure = camera->exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET] = exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 1] = 1.0f / exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 2] = isHDR ? 1.0f : 0.0;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 3] = fpScale / exposure;

    if (mainLight) {
        TO_VEC3(uboCameraView, mainLight->direction, UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC3(uboCameraView, mainLight->color, UBOCamera::MAIN_LIT_COLOR_OFFSET);
        if (mainLight->useColorTemperature) {
            const auto colorTempRGB = mainLight->colorTemperatureRGB;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (isHDR) {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * fpScale;
        } else {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * exposure;
        }
    } else {
        TO_VEC3(uboCameraView, Vec3::UNIT_Z, UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(uboCameraView, Vec4::ZERO, UBOCamera::MAIN_LIT_COLOR_OFFSET);
    }

    Vec4 skyColor = ambient->skyColor;
    if (isHDR) {
        skyColor.w = ambient->skyIllum * fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(uboCameraView, skyColor, UBOCamera::AMBIENT_SKY_OFFSET);

    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET] = ambient->groundAlbedo.x;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 1] = ambient->groundAlbedo.y;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 2] = ambient->groundAlbedo.z;
    const auto envmap = descriptorSet->getTexture((uint)PipelineGlobalBindings::SAMPLER_ENVIRONMENT);
    if (envmap) uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 3] = envmap->getLevelCount();

    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_INV_OFFSET, camera->getNode()->worldMatrix.m, sizeof(cc::Mat4));
    TO_VEC3(uboCameraView, camera->position, UBOCamera::CAMERA_POS_OFFSET);

    if (hasOffScreenAttachments) {
        memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_OFFSET, camera->matProjOffscreen.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_INV_OFFSET, camera->matProjInvOffscreen.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_OFFSET, camera->matViewProjOffscreen.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInvOffscreen.m, sizeof(cc::Mat4));
        uboCameraView[UBOCamera::CAMERA_POS_OFFSET + 3] = device->getCapabilities().screenSpaceSignY * device->getCapabilities().UVSpaceSignY;
    }
    else {
        memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
        memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));
        uboCameraView[UBOCamera::CAMERA_POS_OFFSET + 3] = device->getCapabilities().screenSpaceSignY;
    }

    if (fog->enabled) {
        TO_VEC4(uboCameraView, fog->fogColor, UBOCamera::GLOBAL_FOG_COLOR_OFFSET);

        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET] = fog->fogStart;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 1] = fog->fogEnd;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 2] = fog->fogDensity;

        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET] = fog->fogTop;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 1] = fog->fogRange;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 2] = fog->fogAtten;
    }
}

void PipelineUBO::updateShadowUBOView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> &bufferView, const Camera *camera)
{
    const auto scene = camera->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    auto *device = gfx::Device::getInstance();
    const auto sceneData = pipeline->getPipelineSceneData();
    const auto shadowInfo = sceneData->getSharedData()->getShadows();
    auto &shadowUBO = bufferView;
    auto sphere = sceneData->getSphere();

    if (shadowInfo->enabled) {
        if (mainLight && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
            const auto node = mainLight->getNode();
            cc::Mat4 matShadowCamera;

            // light proj
            float x = 0.0f, y = 0.0f, farClamp = 0.0f;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(sphere, node->worldRotation, mainLight->direction, matShadowCamera, tmpCenter);

                const float radius = sphere->radius;
                x = radius * shadowInfo->aspect;
                y = radius;

                const float halfFar = tmpCenter.distance(sphere->center);
                farClamp = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = mainLight->getNode()->worldMatrix;

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }

            const auto matShadowView = matShadowCamera.getInversed();
            const auto projectionSinY = device->getCapabilities().screenSpaceSignY * device->getCapabilities().UVSpaceSignY;
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, farClamp, device->getCapabilities().clipSpaceMinZ, projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias};
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
            memcpy(shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));
        } else if (mainLight && shadowInfo->getShadowType() == ShadowType::PLANAR) {
            updateDirLight(shadowInfo, mainLight, shadowUBO);
        }

        memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
    }
}

void PipelineUBO::updateShadowUBOLightView(const RenderPipeline *pipeline, std::array<float, UBOShadow::COUNT> &bufferView, const Light *light)
{
    const auto sceneData = pipeline->getPipelineSceneData();
    auto shadowInfo = sceneData->getSharedData()->getShadows();
    auto *device = gfx::Device::getInstance();
    auto sphere = sceneData->getSphere();
    auto &shadowUBO = bufferView;
    switch (light->getType()) {
        case LightType::DIRECTIONAL: {
            cc::Mat4 matShadowCamera;

            float x = 0.0f, y = 0.0f, farClamp = 0.0f;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(sphere, light->getNode()->worldRotation, light->direction, matShadowCamera, tmpCenter);

                const auto radius = sphere->radius;
                x = radius * shadowInfo->aspect;
                y = radius;

                const float halfFar = tmpCenter.distance(sphere->center);
                farClamp = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = light->getNode()->worldMatrix;

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }

            const auto matShadowView = matShadowCamera.getInversed();
            const auto projectionSinY = device->getCapabilities().screenSpaceSignY * device->getCapabilities().UVSpaceSignY;
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, farClamp, device->getCapabilities().clipSpaceMinZ, projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
        } break;
        case LightType::SPOT: {
            const auto &matShadowCamera = light->getNode()->worldMatrix;

            const auto matShadowView = matShadowCamera.getInversed();
            cc::Mat4::createPerspective(light->spotAngle, light->aspect, 0.001f, light->range, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            memcpy(shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
        } break;
        default:;
    }

    float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias};
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
    memcpy(shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));
}

void PipelineUBO::activate(gfx::Device *device, RenderPipeline *pipeline)
{
    _device = device;
    _pipeline = pipeline;

    const auto descriptorSet = pipeline->getDescriptorSet();

    auto globalUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOGlobal::SIZE,
        UBOGlobal::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOGlobal::BINDING, globalUBO);

    auto cameraUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOCamera::SIZE,
        UBOCamera::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOCamera::BINDING, cameraUBO);

    auto shadowUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOShadow::SIZE,
        UBOShadow::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);
}

void PipelineUBO::destroy()
{
}

void PipelineUBO::updateGlobalUBO()
{
    const auto ds = _pipeline->getDescriptorSet();
    const auto cmdBuffer = _pipeline->getCommandBuffers()[0];
    ds->update();
    PipelineUBO::updateGlobalUBOView(_pipeline, _globalUBO);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOGlobal::BINDING), _globalUBO.data(), UBOGlobal::SIZE);
}

void PipelineUBO::updateCameraUBO(const Camera *camera, bool hasOffScreenAttachments)
{
    const auto ds = _pipeline->getDescriptorSet();
    const auto cmdBuffer = _pipeline->getCommandBuffers()[0];
    PipelineUBO::updateCameraUBOView(_pipeline, _cameraUBO, camera, hasOffScreenAttachments);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOCamera::BINDING), _cameraUBO.data(), UBOCamera::SIZE);
}

void PipelineUBO::updateShadowUBO(const Camera *camera)
{
    const auto ds = _pipeline->getDescriptorSet();
    const auto cmdBuffer = _pipeline->getCommandBuffers()[0];
    const auto sceneData = _pipeline->getPipelineSceneData();
    const auto shadowInfo = sceneData->getSharedData()->getShadows();
    const auto scene = camera->getScene();
    if (!shadowInfo->enabled) return;
    const auto &shadowFrameBufferMap = sceneData->getShadowFramebufferMap();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    ds->update();
    if (mainLight && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
        if (shadowFrameBufferMap.count(mainLight) > 0) {
            auto *texture = shadowFrameBufferMap.at(mainLight)->getColorTextures()[0];
            if (texture) {
                ds->bindTexture(SHADOWMAP::BINDING, texture);
            }
        }
    }
    PipelineUBO::updateShadowUBOView(_pipeline, _shadowUBO, camera);
    cmdBuffer->updateBuffer(ds->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
}

void PipelineUBO::updateShadowUBOLight(const Light *light)
{
    const auto ds = _pipeline->getDescriptorSet();
    const auto cmdBuffer = _pipeline->getCommandBuffers()[0];
    PipelineUBO::updateShadowUBOLightView(_pipeline, _shadowUBO, light);
    ds->getBuffer(UBOShadow::BINDING)->update(_shadowUBO.data(), UBOShadow::SIZE);
}

void PipelineUBO::updateShadowUBORange(uint offset, const Mat4* data)
{
    memcpy(_shadowUBO.data() + offset, data->m, sizeof(data));
}

} // namespace pipeline
} // namespace cc
