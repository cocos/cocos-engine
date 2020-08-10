#include "ForwardPipeline.h"
#include "../RenderView.h"
#include "../RenderWindow.h"
#include "../helper/SharedMemory.h"
#include "../shadow/ShadowFlow.h"
#include "../ui/UIFlow.h"
#include "ForwardFlow.h"
#include "gfx/GFXDevice.h"
#include "gfx/GFXRenderPass.h"

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

ForwardPipeline::ForwardPipeline() {
}

ForwardPipeline::~ForwardPipeline() {
    destroy();
}

bool ForwardPipeline::initialize(const RenderPipelineInfo *info) {
    RenderPipeline::initialize(info);

    auto shadowFlow = CC_NEW(ShadowFlow);
    shadowFlow->initialize(ShadowFlow::getInitializeInfo());
    _flows.emplace_back(shadowFlow);

    auto forwardFlow = CC_NEW(ForwardFlow);
    forwardFlow->initialize(ForwardFlow::getInitializeInfo());
    _flows.emplace_back(forwardFlow);

    return true;
}

void ForwardPipeline::destroy() {
    destroyUBOs();

    for (auto &renderPass : _renderPasses) {
        renderPass.second->destroy();
    }
    _renderPasses.clear();

    RenderPipeline::destroy();
}

bool ForwardPipeline::activate() {
    if (!RenderPipeline::activate()) return false;

    auto uiFlow = CC_NEW(UIFlow);
    uiFlow->initialize(UIFlow::getInitializeInfo());
    _flows.emplace_back(uiFlow);

    if (!RenderPipeline::activate()) {
        CC_LOG_ERROR("ForwardPipeline activated failed.");
        return false;
    }

    if (!activeRenderer()) {
        CC_LOG_ERROR("ForwardPipeline startup faild.");
        return false;
    }

    return true;
}

bool ForwardPipeline::activeRenderer() {
    auto device = gfx::Device::getInstance();

    auto cmdBuffer = device->createCommandBuffer({device->getQueue(), gfx::CommandBufferType::PRIMARY});
    _commandBuffers.emplace_back(cmdBuffer);

    //TODO coulsonwang
    //create ubo and sampler

    // update global defines when all states initialized.
    _macros.setValue("CC_USE_HDR", _isHDR);
    _macros.setValue("CC_SUPPORT_FLOAT_TEXTURE", device->hasFeature(gfx::Feature::TEXTURE_FLOAT));

    return true;
}

void ForwardPipeline::updateUBOs(RenderView *view) {
    //TODO coulsonwang
    // update descriptor set

    //    auto root = GET_ROOT();
    const Root *root = nullptr;
    const auto camera = view->getCamera();
    const auto node = GET_NODE(camera->nodeID);
    const auto scene = GET_SCENE(camera->sceneID);
    const auto mainLight = GET_MAIN_LIGHT(scene->mainLightID);
    const auto ambient = GET_AMBIENT(scene->ambientID);
    const auto fog = GET_FOG(scene->fogID);

    auto &globalUBOView = _uboGlobal.view;
    auto device = gfx::Device::getInstance();

    const auto shadingWidth = std::floor(device->getWidth());
    const auto shadingHeight = std::floor(device->getHeight());

    // update UBOGlobal
    globalUBOView[UBOGlobal::TIME_OFFSET] = root->cumulativeTime;
    globalUBOView[UBOGlobal::TIME_OFFSET + 1] = root->frameTime;

    //TODO coulsonwang
    //    globalUBOView[UBOGlobal::TIME_OFFSET + 2] = legacyCC.director.getTotalFrames();

    globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET] = device->getWidth();
    globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET + 1] = device->getHeight();
    globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET + 2] = 1.0f / globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET];
    globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET + 3] = 1.0f / globalUBOView[UBOGlobal::SCREEN_SIZE_OFFSET + 1];

    globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET] = camera->width / shadingWidth * _shadingScale;
    globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET + 1] = camera->height / shadingHeight * _shadingScale;
    globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET + 2] = 1.0f / globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET];
    globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET + 3] = 1.0f / globalUBOView[UBOGlobal::SCREEN_SCALE_OFFSET + 1];

    globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET] = shadingWidth;
    globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET + 1] = shadingHeight;
    globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET + 2] = 1.0f / globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET];
    globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET + 3] = 1.0f / globalUBOView[UBOGlobal::NATIVE_SIZE_OFFSET + 1];

    memcpy(globalUBOView.data() + UBOGlobal::MAT_VIEW_OFFSET, camera->matView.m, sizeof(cc::Mat4));
    memcpy(globalUBOView.data() + UBOGlobal::MAT_VIEW_INV_OFFSET, node->worldMatrix.m, sizeof(cc::Mat4));
    memcpy(globalUBOView.data() + UBOGlobal::MAT_PROJ_OFFSET, camera->matProj.m, sizeof(cc::Mat4));
    memcpy(globalUBOView.data() + UBOGlobal::MAT_PROJ_INV_OFFSET, camera->matProjInv.m, sizeof(cc::Mat4));
    memcpy(globalUBOView.data() + UBOGlobal::MAT_VIEW_PROJ_OFFSET, camera->matViewProj.m, sizeof(cc::Mat4));
    memcpy(globalUBOView.data() + UBOGlobal::MAT_VIEW_PROJ_INV_OFFSET, camera->matViewProjInv.m, sizeof(cc::Mat4));

    TO_VEC3(globalUBOView, camera->position, UBOGlobal::CAMERA_POS_OFFSET);

    auto projectionSignY = device->getScreenSpaceSignY();
    if (view->getWindow()->hasOffScreenAttachments()) {
        projectionSignY *= device->getUVSpaceSignY(); // need flipping if drawing on render targets
    }
    globalUBOView[UBOGlobal::CAMERA_POS_OFFSET + 3] = projectionSignY;

    const auto exposure = camera->exposure;
    globalUBOView[UBOGlobal::EXPOSURE_OFFSET] = exposure;
    globalUBOView[UBOGlobal::EXPOSURE_OFFSET + 1] = 1.0f / exposure;
    globalUBOView[UBOGlobal::EXPOSURE_OFFSET + 2] = _isHDR ? 1.0f : 0.0f;
    globalUBOView[UBOGlobal::EXPOSURE_OFFSET + 3] = _fpScale / exposure;

    if (mainLight) {
        TO_VEC3(globalUBOView, mainLight->direction, UBOGlobal::MAIN_LIT_DIR_OFFSET);
        TO_VEC3(globalUBOView, mainLight->color, UBOGlobal::MAIN_LIT_COLOR_OFFSET);
        if (mainLight->useColorTemperature) {
            const auto &colorTempRGB = mainLight->colorTemperatureRGB;
            globalUBOView[UBOGlobal::MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            globalUBOView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            globalUBOView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
        }

        if (_isHDR) {
            globalUBOView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->illuminance * _fpScale;
        } else {
            globalUBOView[UBOGlobal::MAIN_LIT_COLOR_OFFSET + 3] = mainLight->illuminance * exposure;
        }
    } else {
        TO_VEC3(globalUBOView, cc::Vec3::UNIT_Z, UBOGlobal::MAIN_LIT_DIR_OFFSET);
        TO_VEC4(globalUBOView, cc::Vec4::ZERO, UBOGlobal::MAIN_LIT_COLOR_OFFSET);
    }

    auto skyColor = ambient->skyColor;
    if (_isHDR) {
        skyColor.w = ambient->skyIllum * _fpScale;
    } else {
        skyColor.w = ambient->skyIllum * exposure;
    }
    TO_VEC4(globalUBOView, skyColor, UBOGlobal::AMBIENT_SKY_OFFSET);
    TO_VEC4(globalUBOView, ambient->groundAlbedo, UBOGlobal::AMBIENT_GROUND_OFFSET);

    if (fog->enabled) {
        TO_VEC4(globalUBOView, fog->fogColor, UBOGlobal::GLOBAL_FOG_COLOR_OFFSET);

        globalUBOView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET] = fog->fogStart;
        globalUBOView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET + 1] = fog->fogEnd;
        globalUBOView[UBOGlobal::GLOBAL_FOG_BASE_OFFSET + 2] = fog->fogDensity;

        globalUBOView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET] = fog->fogTop;
        globalUBOView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET + 1] = fog->fogRange;
        globalUBOView[UBOGlobal::GLOBAL_FOG_ADD_OFFSET + 2] = fog->fogAtten;
    }
}

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

void ForwardPipeline::destroyUBOs() {
}

} // namespace pipeline
} // namespace cc
