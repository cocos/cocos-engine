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

#include "RenderPipeline.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderFlow.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDescriptorSetLayout.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXTexture.h"

namespace cc {
namespace pipeline {

RenderPipeline *RenderPipeline::instance = nullptr;

RenderPipeline *RenderPipeline::getInstance() {
    return RenderPipeline::instance;
}

RenderPipeline::RenderPipeline()
: _device(gfx::Device::getInstance()) {
    RenderPipeline::instance = this;

    generateConstantMacros();

    _globalDSManager   = new GlobalDSManager();
    _pipelineUBO       = new PipelineUBO();
    _pipelineSceneData = new PipelineSceneData();
}

RenderPipeline::~RenderPipeline() {
    RenderPipeline::instance = nullptr;
}

bool RenderPipeline::initialize(const RenderPipelineInfo &info) {
    _flows = info.flows;
    _tag   = info.tag;
    return true;
}

bool RenderPipeline::activate(gfx::Swapchain * /*swapchain*/) {
    _globalDSManager->activate(_device, this);
    _descriptorSet = _globalDSManager->getGlobalDescriptorSet();
    _pipelineUBO->activate(_device, this);
    _pipelineSceneData->activate(_device, this);

    for (auto *const flow : _flows) {
        flow->activate(this);
    }

    // has not initBuiltinRes,
    // create temporary default Texture to binding sampler2d
    if (!_defaultTexture) {
        _defaultTexture = _device->createTexture({
            gfx::TextureType::TEX2D,
            gfx::TextureUsageBit::COLOR_ATTACHMENT | gfx::TextureUsageBit::SAMPLED,
            gfx::Format::RGBA8,
            1U,
            1U,
        });
    }

    return true;
}

void RenderPipeline::render(const vector<scene::Camera *> &cameras) {
    for (auto *const flow : _flows) {
        for (auto *camera : cameras) {
            flow->render(camera);
        }
    }
}

void RenderPipeline::destroy() {
    for (auto *flow : _flows) {
        flow->destroy();
    }
    _flows.clear();

    _descriptorSet = nullptr;
    CC_SAFE_DESTROY(_globalDSManager);
    CC_SAFE_DESTROY(_pipelineUBO);
    CC_SAFE_DESTROY(_pipelineSceneData);

    for (auto *const cmdBuffer : _commandBuffers) {
        cmdBuffer->destroy();
    }
    _commandBuffers.clear();

    CC_SAFE_DESTROY(_defaultTexture);

    CC_SAFE_DELETE(_defaultTexture);

    PipelineStateManager::destroyAll();
    InstancedBuffer::destroyInstancedBuffer();
}

void RenderPipeline::setPipelineSharedSceneData(scene::PipelineSharedSceneData *data) {
    _pipelineSceneData->setPipelineSharedSceneData(data);
}

void RenderPipeline::generateConstantMacros() {
    _constantMacros = StringUtil::format(
        R"(
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE %d
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS %d
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS %d
        )",
        _device->hasFeature(gfx::Feature::TEXTURE_FLOAT) ? 1 : 0,
        _device->getCapabilities().maxVertexUniformVectors,
        _device->getCapabilities().maxFragmentUniformVectors);
}

RenderStage * RenderPipeline::getRenderstageByName(const String &name) const {
    for (auto *flow : _flows) {
        auto *val = flow->getRenderstageByName(name);
        if (val) {
            return val;
        }
    }
    return nullptr;
}

} // namespace pipeline
} // namespace cc
