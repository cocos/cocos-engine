/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
#include "ForwardPipeline.h"
#include "../shadow/ShadowFlow.h"
#include "ForwardFlow.h"
#include "SceneCulling.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXFramebuffer.h"
#include "gfx/GFXQueue.h"
#include "gfx/GFXRenderPass.h"
#include "gfx/GFXSampler.h"
#include "gfx/GFXTexture.h"
#include "platform/Application.h"

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

gfx::RenderPass *ForwardPipeline::getOrCreateRenderPass(gfx::ClearFlags clearFlags) {
    if (_renderPasses.find(clearFlags) != _renderPasses.end()) {
        return _renderPasses[clearFlags];
    }

    auto device = gfx::Device::getInstance();
    gfx::ColorAttachment colorAttachment;
    gfx::DepthStencilAttachment depthStencilAttachment;
    colorAttachment.format = device->getColorFormat();
    depthStencilAttachment.format = device->getDepthStencilFormat();
    depthStencilAttachment.stencilStoreOp = gfx::StoreOp::STORE;
    depthStencilAttachment.depthStoreOp = gfx::StoreOp::STORE;

    if (!(clearFlags & gfx::ClearFlagBit::COLOR)) {
        if (clearFlags & static_cast<gfx::ClearFlagBit>(SKYBOX_FLAG)) {
            colorAttachment.loadOp = gfx::LoadOp::DISCARD;
        } else {
            colorAttachment.loadOp = gfx::LoadOp::LOAD;
            colorAttachment.beginLayout = gfx::TextureLayout::PRESENT_SRC;
        }
    }

    if (static_cast<gfx::ClearFlagBit>(clearFlags & gfx::ClearFlagBit::DEPTH_STENCIL) != gfx::ClearFlagBit::DEPTH_STENCIL) {
        if (!(clearFlags & gfx::ClearFlagBit::DEPTH)) depthStencilAttachment.depthLoadOp = gfx::LoadOp::LOAD;
        if (!(clearFlags & gfx::ClearFlagBit::STENCIL)) depthStencilAttachment.stencilLoadOp = gfx::LoadOp::LOAD;
        depthStencilAttachment.beginLayout = gfx::TextureLayout::DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    }

    auto renderPass = device->createRenderPass({
        {colorAttachment},
        depthStencilAttachment,
    });
    _renderPasses[clearFlags] = renderPass;

    return renderPass;
}

void ForwardPipeline::setFog(uint fog) {
    _fog = GET_FOG(fog);
}

void ForwardPipeline::setAmbient(uint ambient) {
    _ambient = GET_AMBIENT(ambient);
}

void ForwardPipeline::setSkybox(uint skybox) {
    _skybox = GET_SKYBOX(skybox);
}

void ForwardPipeline::setShadows(uint shadows) {
    _shadows = GET_SHADOWS(shadows);
}

void ForwardPipeline::destroyShadowFrameBuffers() {
    for (auto &pair : _shadowFrameBufferMap) {
        pair.second->destroy();
        delete pair.second;
    }
    _shadowFrameBufferMap.clear();
}

bool ForwardPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.size() == 0) {
        auto shadowFlow = CC_NEW(ShadowFlow);
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto forwardFlow = CC_NEW(ForwardFlow);
        forwardFlow->initialize(ForwardFlow::getInitializeInfo());
        _flows.emplace_back(forwardFlow);
    }
    _sphere = CC_NEW(Sphere);

    return true;
}

bool ForwardPipeline::activate() {
    if (!RenderPipeline::activate()) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer()) {
        CC_LOG_ERROR("ForwardPipeline startup failed!");
        return false;
    }

    return true;
}

void ForwardPipeline::render(const vector<uint> &cameras) {
    _commandBuffers[0]->begin();
    updateGlobalUBO();
    for (const auto cameraId : cameras) {
        Camera *camera = GET_CAMERA(cameraId);
        updateCameraUBO(camera);
        for (const auto flow : _flows) {
            flow->render(camera);
        }
    }
    _commandBuffers[0]->end();
    _device->getQueue()->submit(_commandBuffers);
}

void ForwardPipeline::updateCameraUBO(Camera *camera) {
    const auto scene = camera->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    const auto ambient = _ambient;
    const auto fog = _fog;

    auto *device = gfx::Device::getInstance();
    auto &uboCameraView = _cameraUBO;

    const auto shadingWidth = std::floor(_device->getWidth());
    const auto shadingHeight = std::floor(_device->getHeight());

    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET] = camera->width / shadingWidth * _shadingScale;
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1] = camera->height / shadingHeight * _shadingScale;
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 2] = 1.0 / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET];
    uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 3] = 1.0 / uboCameraView[UBOCamera::SCREEN_SCALE_OFFSET + 1];

    const auto exposure = camera->exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET] = exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 1] = 1.0f / exposure;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 2] = _isHDR ? 1.0f : 0.0;
    uboCameraView[UBOCamera::EXPOSURE_OFFSET + 3] = _fpScale / exposure;

    if (mainLight) {
        TO_VEC3(uboCameraView, mainLight->direction, UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC3(uboCameraView, mainLight->color, UBOCamera::MAIN_LIT_COLOR_OFFSET);
        if (mainLight->useColorTemperature) {
            const auto colorTempRGB = mainLight->colorTemperatureRGB;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (_isHDR) {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * _fpScale;
        } else {
            uboCameraView[UBOCamera::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->luminance * exposure;
        }
    } else {
        TO_VEC3(uboCameraView, Vec3::UNIT_Z, UBOCamera::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(uboCameraView, Vec4::ZERO, UBOCamera::MAIN_LIT_COLOR_OFFSET);
    }

    Vec4 skyColor = ambient->skyColor;
    if (_isHDR) {
        skyColor.w = ambient->skyIllum * _fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(uboCameraView, skyColor, UBOCamera::AMBIENT_SKY_OFFSET);

    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET] = ambient->groundAlbedo.x;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 1] = ambient->groundAlbedo.y;
    uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 2] = ambient->groundAlbedo.z;
    const auto envmap = _descriptorSet->getTexture((uint)PipelineGlobalBindings::SAMPLER_ENVIRONMENT);
    if (envmap) uboCameraView[UBOCamera::AMBIENT_GROUND_OFFSET + 3] = envmap->getLevelCount();

    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_INV_OFFSET, camera->getNode()->worldMatrix.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
    memcpy(uboCameraView.data() + UBOCamera::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));
    TO_VEC3(uboCameraView, camera->position, UBOCamera::CAMERA_POS_OFFSET);

    auto projectionSignY = _device->getScreenSpaceSignY();
    if (camera->getWindow()->hasOffScreenAttachments) {
        projectionSignY *= _device->getUVSpaceSignY(); // need flipping if drawing on render targets
    }
    uboCameraView[UBOCamera::CAMERA_POS_OFFSET + 3] = projectionSignY;

    if (fog->enabled) {
        TO_VEC4(uboCameraView, fog->fogColor, UBOCamera::GLOBAL_FOG_COLOR_OFFSET);

        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET] = fog->fogStart;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 1] = fog->fogEnd;
        uboCameraView[UBOCamera::GLOBAL_FOG_BASE_OFFSET + 2] = fog->fogDensity;

        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET] = fog->fogTop;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 1] = fog->fogRange;
        uboCameraView[UBOCamera::GLOBAL_FOG_ADD_OFFSET + 2] = fog->fogAtten;
    }

    // update ubos
    _commandBuffers[0]->updateBuffer(_descriptorSet->getBuffer(UBOCamera::BINDING), _cameraUBO.data(), UBOCamera::SIZE);
}

void ForwardPipeline::updateShadowUBO(Camera *camera) {
    const auto scene = camera->getScene();
    const Light *mainLight = nullptr;
    if (scene->mainLightID) mainLight = scene->getMainLight();
    auto *device = gfx::Device::getInstance();
    const auto shadowInfo = _shadows;
    if (shadowInfo->enabled) {
        if (mainLight && shadowInfo->getShadowType() == ShadowType::SHADOWMAP) {
            if (_shadowFrameBufferMap.count(mainLight) > 0) {
                auto *texture = _shadowFrameBufferMap.at(mainLight)->getColorTextures()[0];
                if (texture) {
                    _descriptorSet->bindTexture(SHADOWMAP::BINDING, texture);
                }
            }

            const auto node = mainLight->getNode();
            cc::Mat4 matShadowCamera;

            // light proj
            float x = 0.0f, y = 0.0f, farClamp = 0.0f;
            if (shadowInfo->autoAdapt) {
                Vec3 tmpCenter;
                getShadowWorldMatrix(_sphere, node->worldRotation, mainLight->direction, matShadowCamera, tmpCenter);

                const float radius = _sphere->radius;
                x = radius * shadowInfo->aspect;
                y = radius;

                const float halfFar = tmpCenter.distance(_sphere->center);
                farClamp = std::min(halfFar * COEFFICIENT_OF_EXPANSION, SHADOW_CAMERA_MAX_FAR);
            } else {
                matShadowCamera = mainLight->getNode()->worldMatrix;

                x = shadowInfo->orthoSize * shadowInfo->aspect;
                y = shadowInfo->orthoSize;

                farClamp = shadowInfo->farValue;
            }

            const auto matShadowView = matShadowCamera.getInversed();

            Mat4 matShadowViewProj;
            const auto projectionSinY = device->getScreenSpaceSignY() * device->getUVSpaceSignY();
            Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, farClamp, device->getClipSpaceMinZ(), projectionSinY, &matShadowViewProj);

            matShadowViewProj.multiply(matShadowView);
            float shadowInfos[4] = {shadowInfo->size.x, shadowInfo->size.y, (float)shadowInfo->pcfType, shadowInfo->bias};
            memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, matShadowViewProj.m, sizeof(matShadowViewProj));
            memcpy(_shadowUBO.data() + UBOShadow::SHADOW_INFO_OFFSET, &shadowInfos, sizeof(shadowInfos));
        } else if (mainLight && shadowInfo->getShadowType() == ShadowType::PLANAR) {
            updateDirLight(shadowInfo, mainLight, _shadowUBO);
        }

        memcpy(_shadowUBO.data() + UBOShadow::SHADOW_COLOR_OFFSET, &shadowInfo->color, sizeof(Vec4));
        _commandBuffers[0]->updateBuffer(_descriptorSet->getBuffer(UBOShadow::BINDING), _shadowUBO.data(), UBOShadow::SIZE);
    }
    _descriptorSet->update();
}

void ForwardPipeline::updateGlobalUBO() {
    _descriptorSet->update();

    const auto root = GET_ROOT();
    auto &uboGlobalView = _globalUBO;

    const auto shadingWidth = std::floor(_device->getWidth());
    const auto shadingHeight = std::floor(_device->getHeight());

    // update UBOGlobal
    uboGlobalView[UBOGlobal::TIME_OFFSET] = root->cumulativeTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 1] = root->frameTime;
    uboGlobalView[UBOGlobal::TIME_OFFSET + 2] = Application::getInstance()->getTotalFrames();

    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET] = _device->getWidth();
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1] = _device->getHeight();
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::SCREEN_SIZE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    // update ubos
    _commandBuffers[0]->updateBuffer(_descriptorSet->getBuffer(UBOGlobal::BINDING), _globalUBO.data(), UBOGlobal::SIZE);
}

bool ForwardPipeline::activeRenderer() {
    _commandBuffers.push_back(_device->getCommandBuffer());

    _globalUBO.fill(0.f);
    _cameraUBO.fill(0.f);
    _shadowUBO.fill(0.f);

    auto globalUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOGlobal::SIZE,
        UBOGlobal::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    _descriptorSet->bindBuffer(UBOGlobal::BINDING, globalUBO);

    auto cameraUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOCamera::SIZE,
        UBOCamera::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    _descriptorSet->bindBuffer(UBOCamera::BINDING, cameraUBO);

    auto shadowUBO = _device->createBuffer({
        gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
        gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
        UBOShadow::SIZE,
        UBOShadow::SIZE,
        gfx::BufferFlagBit::NONE,
    });
    _descriptorSet->bindBuffer(UBOShadow::BINDING, shadowUBO);

    gfx::SamplerInfo info{
        gfx::Filter::LINEAR,
        gfx::Filter::LINEAR,
        gfx::Filter::NONE,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
        gfx::Address::CLAMP,
    };
    const auto shadowMapSamplerHash = genSamplerHash(std::move(info));
    const auto shadowMapSampler = getSampler(shadowMapSamplerHash);

    // Main light sampler binding
    this->_descriptorSet->bindSampler(SHADOWMAP::BINDING, shadowMapSampler);
    this->_descriptorSet->bindTexture(SHADOWMAP::BINDING, getDefaultTexture());

    // Spot light sampler binding
    this->_descriptorSet->bindSampler(SPOT_LIGHTING_MAP::BINDING, shadowMapSampler);
    this->_descriptorSet->bindTexture(SPOT_LIGHTING_MAP::BINDING, getDefaultTexture());

    _descriptorSet->update();

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", _isHDR);
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    return true;
}

void ForwardPipeline::destroy() {
    if (_descriptorSet) {
        _descriptorSet->getBuffer(UBOGlobal::BINDING)->destroy();
        _descriptorSet->getBuffer(UBOCamera::BINDING)->destroy();
        _descriptorSet->getBuffer(UBOShadow::BINDING)->destroy();
        _descriptorSet->getSampler(SHADOWMAP::BINDING)->destroy();
        _descriptorSet->getTexture(SHADOWMAP::BINDING)->destroy();
        _descriptorSet->getSampler(SPOT_LIGHTING_MAP::BINDING)->destroy();
        _descriptorSet->getTexture(SPOT_LIGHTING_MAP::BINDING)->destroy();
    }

    for (auto &it : _renderPasses) {
        it.second->destroy();
    }
    _renderPasses.clear();

    _commandBuffers.clear();

    CC_SAFE_DELETE(_sphere);

    _shadowFrameBufferMap.clear();

    RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
