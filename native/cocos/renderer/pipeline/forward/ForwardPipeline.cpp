#include "ForwardPipeline.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "../shadow/ShadowFlow.h"
#include "../ui/UIFlow.h"
#include "ForwardFlow.h"
#include "SceneCulling.h"
#include "gfx/GFXBuffer.h"
#include "gfx/GFXCommandBuffer.h"
#include "gfx/GFXDescriptorSet.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXQueue.h"
#include "gfx/GFXRenderPass.h"
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

ForwardPipeline::ForwardPipeline() {
}

ForwardPipeline::~ForwardPipeline() {
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

bool ForwardPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    if (_flows.size() == 0) {
        auto shadowFlow = CC_NEW(ShadowFlow);
        shadowFlow->initialize(ShadowFlow::getInitializeInfo());
        _flows.emplace_back(shadowFlow);

        auto forwardFlow = CC_NEW(ForwardFlow);
        forwardFlow->initialize(ForwardFlow::getInitializeInfo());
        _flows.emplace_back(forwardFlow);

        auto uiFlow = CC_NEW(UIFlow);
        uiFlow->initialize(UIFlow::getInitializeInfo());
        _flows.emplace_back(uiFlow);
    }

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

void ForwardPipeline::render(const vector<RenderView *> &views) {
    _commandBuffers[0]->begin();
    for (const auto view : views) {
        sceneCulling(this, view);
        for (const auto flow : view->getFlows()) {
            flow->render(view);
        }
    }
    _commandBuffers[0]->end();
    _device->getQueue()->submit(_commandBuffers);
}

void ForwardPipeline::updateUBOs(RenderView *view) {
    updateUBO(view);
    const auto scene = GET_SCENE(view->getCamera()->getSceneID());
    const auto mainLight = GET_LIGHT(scene->mainLightID);
    const auto shadowInfo = _shadows;

    if (mainLight && shadowInfo->enabled) {
        const auto node = GET_NODE(mainLight->nodeID);

        // shadow view
        auto shadowView = node->getWorldMatrix().getInversed();

        // shadow view proj
        const auto x = shadowInfo->orthoSize * shadowInfo->aspect;
        const auto y = shadowInfo->orthoSize;
        const auto projectionSinY = _device->getScreenSpaceSignY() * _device->getUVSpaceSignY();
        Mat4 shadowViewProj;
        Mat4::createOrthographicOffCenter(-x, x, -y, y, shadowInfo->nearValue, shadowInfo->farValue, _device->getClipSpaceMinZ(), projectionSinY, &shadowViewProj);

        shadowViewProj.multiply(shadowView);
        memcpy(_shadowUBO.data() + UBOShadow::MAT_LIGHT_VIEW_PROJ_OFFSET, shadowViewProj.m, sizeof(shadowViewProj));
    }

    // update ubos
    _commandBuffers[0]->updateBuffer(_descriptorSet->getBuffer(UBOGlobal::BLOCK.binding), _globalUBO.data(), _globalUBO.size() * sizeof(float));
    _commandBuffers[0]->updateBuffer(_descriptorSet->getBuffer(UBOShadow::BLOCK.binding), _shadowUBO.data(), _shadowUBO.size() * sizeof(float));
}

void ForwardPipeline::updateUBO(RenderView *view) {
    _descriptorSet->update();

    const auto root = GET_ROOT();

    const auto camera = view->getCamera();
    const auto scene = GET_SCENE(camera->getSceneID());

    const auto mainLight = GET_LIGHT(scene->mainLightID);
    const auto ambient = _ambient;
    const auto fog = _fog;
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

    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET] = camera->getWidth() / shadingWidth * _shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1] = camera->getHeight() / shadingHeight * _shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 2] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 3] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_OFFSET, camera->getMatView().m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_INV_OFFSET, GET_NODE(camera->getNodeID())->getWorldMatrix().m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_OFFSET, camera->getMatProj().m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_INV_OFFSET, camera->getMatProjInv().m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_OFFSET, camera->getMatViewProj().m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_INV_OFFSET, camera->getMatViewProjInv().m, sizeof(cc::Mat4));
    TO_VEC3(uboGlobalView, camera->getPosition(), UBOGlobal::CAMERA_POS_OFFSET);

    auto projectionSignY = _device->getScreenSpaceSignY();
    if (view->getWindow()->hasOffScreenAttachments) {
        projectionSignY *= _device->getUVSpaceSignY(); // need flipping if drawing on render targets
    }
    uboGlobalView[UBOGlobal::CAMERA_POS_OFFSET + 3] = projectionSignY;

    const auto exposure = camera->getExposure();
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
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->illuminance * _fpScale;
        } else {
            uboGlobalView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->illuminance * exposure;
        }
    } else {
        TO_VEC3(uboGlobalView, Vec3::UNIT_Z, UBOGlobal::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(uboGlobalView, Vec4::ZERO, UBOGlobal::MAIN_LIT_COLOR_OFFSET);
    }

    auto skyColor = ambient->skyColor;
    if (_isHDR) {
        skyColor.w = ambient->skyIllum * _fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(uboGlobalView, skyColor, UBOGlobal::AMBIENT_SKY_OFFSET);
    TO_VEC4(uboGlobalView, ambient->groundAlbedo, UBOGlobal::AMBIENT_GROUND_OFFSET);

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

bool ForwardPipeline::activeRenderer() {
    _commandBuffers.push_back(_device->getCommandBuffer());

    _globalUBO.fill(0.f);
    _shadowUBO.fill(0.f);

    auto globalUBO = _device->createBuffer({gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                                            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                                            UBOGlobal::SIZE,
                                            UBOGlobal::SIZE,
                                            gfx::BufferFlagBit::NONE});
    _descriptorSet->bindBuffer(UBOGlobal::BLOCK.binding, globalUBO);

    auto shadowUBO = _device->createBuffer({gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                                            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                                            UBOShadow::SIZE,
                                            UBOShadow::SIZE,
                                            gfx::BufferFlagBit::NONE});
    _descriptorSet->bindBuffer(UBOShadow::BLOCK.binding, shadowUBO);

    gfx::SamplerInfo info;
    info.addressU = info.addressV = info.addressW = gfx::Address::CLAMP;
    auto shadowMapSamplerHash = genSamplerHash(std::move(info));
    auto shadowMapSampler = getSampler(shadowMapSamplerHash);
    _descriptorSet->bindSampler(UNIFORM_SHADOWMAP.binding, shadowMapSampler);

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", _isHDR);
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    return true;
}

void ForwardPipeline::destroy() {

    if (_descriptorSet) {
        _descriptorSet->getBuffer(UBOGlobal::BLOCK.binding)->destroy();
        _descriptorSet->getBuffer(UBOShadow::BLOCK.binding)->destroy();
    }

    for (auto &it : _renderPasses) {
        it.second->destroy();
    }
    _renderPasses.clear();

    _commandBuffers.clear();

    RenderPipeline::destroy();
}

} // namespace pipeline
} // namespace cc
