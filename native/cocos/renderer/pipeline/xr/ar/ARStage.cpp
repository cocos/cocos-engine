/****************************************************************************
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

#include "pipeline/xr/ar/ARStage.h"
#include "ar/ARModule.h"
#include "core/scene-graph/Node.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXFramebuffer.h"
#include "gfx-base/GFXTexture.h"
#include "pipeline/Enum.h"
#include "pipeline/PipelineSceneData.h"
#include "pipeline/PipelineUBO.h"
#include "pipeline/RenderPipeline.h"
#include "pipeline/forward/ForwardPipeline.h"
#include "pipeline/xr/ar/ARBackground.h"
#include "scene/Camera.h"
#include "scene/RenderWindow.h"

namespace cc {
namespace pipeline {

RenderStageInfo ARStage::initInfo = {
    "ARStage",
    static_cast<uint>(ForwardStagePriority::AR),
    static_cast<uint>(RenderFlowTag::SCENE)};
const RenderStageInfo &ARStage::getInitializeInfo() { return ARStage::initInfo; }

ARStage::ARStage() {
    _arBackground = ccnew ARBackground;
}

ARStage::~ARStage() = default;

bool ARStage::initialize(const RenderStageInfo &info) {
    RenderStage::initialize(info);
    return true;
}

void ARStage::activate(RenderPipeline *pipeline, RenderFlow *flow) {
    RenderStage::activate(pipeline, flow);

    _arBackground->activate(pipeline, _device);
}

void ARStage::destroy() {
    CC_SAFE_DESTROY_AND_DELETE(_arBackground);
    CC_SAFE_DELETE(_pipeline);
    CC_SAFE_DELETE(_device);
    RenderStage::destroy();
}

void ARStage::render(scene::Camera *camera) {
    auto *const armodule = cc::ar::ARModule::get();
    if (!armodule) return;
    int apiState = armodule->getAPIState();
    if (apiState < 0) return;
    const Node *camNode = camera->getNode();
    if (armodule->getCameraId() != camNode->_id) return;

    struct RenderData {
        framegraph::TextureHandle outputTex;
        framegraph::TextureHandle depth;
    };
    auto *const sceneData = _pipeline->getPipelineSceneData();

    float shadingScale{sceneData->getShadingScale()};

    auto arSetup = [&](framegraph::PassNodeBuilder &builder, RenderData &data) {
        gfx::TextureInfo colorTexInfo = {
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA16F,
            static_cast<uint>(camera->getWindow()->getWidth() * shadingScale),
            static_cast<uint>(camera->getWindow()->getHeight() * shadingScale),
        };
        data.outputTex = builder.create(RenderPipeline::fgStrHandleOutColorTexture, colorTexInfo);

        framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
        colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
        colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;

        colorAttachmentInfo.endAccesses = {gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE};

        data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);

        // depth
        gfx::TextureInfo depthTexInfo{
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::DEPTH_STENCIL_ATTACHMENT,
            gfx::Format::DEPTH_STENCIL,
            static_cast<uint>(_pipeline->getWidth() * shadingScale),
            static_cast<uint>(_pipeline->getHeight() * shadingScale),
        };
        framegraph::RenderTargetAttachment::Descriptor depthAttachmentInfo;
        depthAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
        depthAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;
        depthAttachmentInfo.clearDepth = camera->getClearDepth();
        depthAttachmentInfo.clearStencil = camera->getClearStencil();
        depthAttachmentInfo.endAccesses = {gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE};

        data.depth = builder.create(RenderPipeline::fgStrHandleOutDepthTexture, depthTexInfo);
        data.depth = builder.write(data.depth, depthAttachmentInfo);

        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutColorTexture, data.outputTex);
        builder.writeToBlackboard(RenderPipeline::fgStrHandleOutDepthTexture, data.depth);
        builder.setViewport(_pipeline->getViewport(camera), _pipeline->getScissor(camera));
    };

    auto offset = _pipeline->getPipelineUBO()->getCurrentCameraUBOOffset();
    auto arExec = [this, camera, offset](const RenderData & /*data*/, const framegraph::DevicePassResourceTable &table) {
        auto *cmdBuff = _pipeline->getCommandBuffers()[0];

        auto *renderPass = table.getRenderPass();
        _arBackground->render(camera, renderPass, cmdBuff);
    };

    // add pass
    _pipeline->getFrameGraph().addPass<RenderData>(static_cast<uint>(CommonInsertPoint::DIP_AR_BACKGROUND), ForwardPipeline::fgStrHandleForwardPass, arSetup, arExec);
}

} // namespace pipeline
} // namespace cc
