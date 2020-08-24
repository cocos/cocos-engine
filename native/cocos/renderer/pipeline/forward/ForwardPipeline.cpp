#include "ForwardPipeline.h"
#include "../RenderView.h"
#include "../helper/SharedMemory.h"
#include "../shadow/ShadowFlow.h"
#include "../ui/UIFlow.h"
#include "ForwardFlow.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXRenderPass.h"
#include "platform/CCApplication.h"

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

ForwardPipeline::ForwardPipeline()
: _device(gfx::Device::getInstance()) {
}

ForwardPipeline::~ForwardPipeline() {
    destroy();
}

bool ForwardPipeline::initialize(const RenderPipelineInfo &info) {
    RenderPipeline::initialize(info);

    auto shadowFlow = CC_NEW(ShadowFlow);
    shadowFlow->initialize(ShadowFlow::getInitializeInfo());
    _flows.emplace_back(shadowFlow);

    auto forwardFlow = CC_NEW(ForwardFlow);
    forwardFlow->initialize(ForwardFlow::getInitializeInfo());
    _flows.emplace_back(forwardFlow);

    return true;
}

bool ForwardPipeline::activate() {
    auto uiFlow = CC_NEW(UIFlow);
    uiFlow->initialize(UIFlow::getInitializeInfo());
    _flows.emplace_back(uiFlow);

    if (!RenderPipeline::activate()) {
        CC_LOG_ERROR("RenderPipeline active failed.");
        return false;
    }

    if (!activeRenderer()) {
        CC_LOG_ERROR("ForwardPipeline startup failed!");
        return false;
    }

    //TODO ambient, fog, skybox, planarShadows
    return true;
}

void ForwardPipeline::updateUBOs(RenderView *view) {
    updateUBO(view);
    const auto scene = GET_SCENE(view->getCamera()->sceneID);
    const auto mainLight = GET_MAIN_LIGHT(scene->mainLightID);

    if (mainLight) {
        const auto node = GET_NODE(mainLight->nodeID);
        const auto &shadowCamera_W_P = node->worldPosition;
        const auto &shadowCamera_W_R = node->worldRotation;
        const auto &shadowCamera_W_S = node->worldScale;

        //TODO coulsonwang
        //        // world Transfrom
        //        Mat4.fromRTS(shadowCamera_W_T, shadowCamera_W_R, shadowCamera_W_P, shadowCamera_W_S);
        //
        //        // camera view
        //        Mat4.invert(shadowCamera_M_V, shadowCamera_W_T);
        //
        //        // camera proj
        //        // Mat4.perspective(shadowCamera_M_P, shadowCamera_Fov, shadowCamera_Aspect, shadowCamera_Near, shadowCamera_Far);
        //        const x = shadowCamera_OrthoSize * shadowCamera_Aspect;
        //        const y = shadowCamera_OrthoSize;
        //        Mat4.ortho(shadowCamera_M_P, -x, x, -y, y, shadowCamera_Near, shadowCamera_Far,
        //             device.clipSpaceMinZ, device.screenSpaceSignY);
        //
        //        // camera viewProj
        //        Mat4.multiply(shadowCamera_M_V_P, shadowCamera_M_P, shadowCamera_M_V);

        cc::Mat4 shadowCamera_M_V_P;
        memcpy(_globalUBO.data() + UBOGlobal::MAIN_SHADOW_MATRIX_OFFSET, shadowCamera_M_V_P.m, sizeof(cc::Mat4));
    }

    //TODO coulsonwang
    //    // update ubos
    //    this._descriptorSet.getBuffer(UBOGlobal.BLOCK.binding).update(this._uboGlobal.view);
    //
    //    // Fill Shadow UBO
    //    // Fill cc_shadowMatViewProj
    //    Mat4.toArray(this._uboPCFShadow.view, shadowCamera_M_V_P, UBOPCFShadow.MAT_SHADOW_VIEW_PROJ_OFFSET);
    //    this._descriptorSet.getBuffer(UBOPCFShadow.BLOCK.binding).update(this._uboPCFShadow.view);
}

void ForwardPipeline::updateUBO(RenderView *view) {
    //TODO coulsonwang
    //    this._descriptorSet.update();

    const auto root = GET_ROOT(0);

    const auto camera = view->getCamera();
    const auto scene = GET_SCENE(camera->sceneID);

    const auto mainLight = GET_MAIN_LIGHT(scene->mainLightID);
    const auto ambient = GET_AMBIENT(scene->ambientID);
    const auto fog = GET_FOG(scene->fogID);
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

    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET] = camera->width / shadingWidth * _shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1] = camera->height / shadingHeight * _shadingScale;
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 2] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET];
    uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 3] = 1.0 / uboGlobalView[UBOGlobal::SCREEN_SCALE_OFFSET + 1];

    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET];
    uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / uboGlobalView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_INV_OFFSET, GET_NODE(camera->nodeID)->worldMatrix.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
    memcpy(uboGlobalView.data() + UBOGlobal::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));
    TO_VEC3(uboGlobalView, camera->position, UBOGlobal::CAMERA_POS_OFFSET);

    auto projectionSignY = _device->getScreenSpaceSignY();
    if (view->getWindow()->hasOffScreenAttachments) {
        projectionSignY *= _device->getUVSpaceSignY(); // need flipping if drawing on render targets
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
    _commandBuffers.emplace_back(_device->createCommandBuffer({
        _device->getQueue(),
        gfx::CommandBufferType::PRIMARY,
    }));

    auto globalUBO = _device->createBuffer({gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                                            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                                            UBOGlobal::SIZE,
                                            UBOGlobal::SIZE,
                                            gfx::BufferFlagBit::NONE});
    //TODO coulsonwang
    //    this._descriptorSet.bindBuffer(UBOGlobal.BLOCK.binding, globalUBO);

    auto shadowUBO = _device->createBuffer({gfx::BufferUsageBit::UNIFORM | gfx::BufferUsageBit::TRANSFER_DST,
                                            gfx::MemoryUsageBit::HOST | gfx::MemoryUsageBit::DEVICE,
                                            UBOShadow::SIZE,
                                            UBOShadow::SIZE,
                                            gfx::BufferFlagBit::NONE});
    //    this._descriptorSet.bindBuffer(UBOShadow.BLOCK.binding, shadowUBO);

    gfx::SamplerInfo info;
    info.addressU = info.addressV = info.addressW = gfx::Address::CLAMP;
    auto shadowMapSamplerHash = genSamplerHash(std::move(info));
    auto shadowMapSampler = getSampler(shadowMapSamplerHash);
    //    this._descriptorSet.bindSampler(UNIFORM_SHADOWMAP.binding, shadowMapSampler);

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", _isHDR);
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", _device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    return true;
}

void ForwardPipeline::destroy() {

    //TODO coulsonwang
    //destroyUBOs();
    //descriptorSet.destroy();
    for (auto &it : _renderPasses) {
        it.second->destroy();
    }
    _renderPasses.clear();
}

} // namespace pipeline
} // namespace cc
