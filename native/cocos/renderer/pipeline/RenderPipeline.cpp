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
#include "helper/Utils.h"

namespace cc {
namespace pipeline {

framegraph::StringHandle RenderPipeline::fgStrHandleOutDepthTexture = framegraph::FrameGraph::stringToHandle("depthTexture");
framegraph::StringHandle RenderPipeline::fgStrHandleOutColorTexture = framegraph::FrameGraph::stringToHandle("outputTexture");
framegraph::StringHandle RenderPipeline::fgStrHandlePostprocessPass = framegraph::FrameGraph::stringToHandle("pipelinePostPass");
framegraph::StringHandle RenderPipeline::fgStrHandleBloomOutTexture = framegraph::FrameGraph::stringToHandle("combineTex");

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

void RenderPipeline::destroyQuadInputAssembler() {
    CC_SAFE_DESTROY(_quadIB);

    for (auto *node : _quadVB) {
        CC_SAFE_DESTROY(node);
    }

    for (auto node : _quadIA) {
        CC_SAFE_DESTROY(node.second);
    }
    _quadVB.clear();
    _quadIA.clear();
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

gfx::Color RenderPipeline::getClearcolor(scene::Camera *camera) const {
    auto *const sceneData  = getPipelineSceneData();
    auto *const sharedData = sceneData->getSharedData();
    gfx::Color  clearColor{0.0, 0.0, 0.0, 1.0F};
    if (camera->clearFlag & static_cast<uint>(gfx::ClearFlagBit::COLOR)) {
        if (sharedData->isHDR) {
            srgbToLinear(&clearColor, camera->clearColor);
            const auto scale = sharedData->fpScale / camera->exposure;
            clearColor.x *= scale;
            clearColor.y *= scale;
            clearColor.z *= scale;
        } else {
            clearColor = camera->clearColor;
        }
    }

    clearColor.w = 0;
    return clearColor;
}

void RenderPipeline::updateQuadVertexData(const Vec4 &viewport, gfx::Buffer *buffer) {
    float vbData[16]    = {0};
    genQuadVertexData(viewport, vbData);
    buffer->update(vbData, sizeof(vbData));
}

gfx::InputAssembler *RenderPipeline::getIAByRenderArea(const gfx::Rect &renderArea) {
    auto bufferWidth{static_cast<float>(_width)};
    auto bufferHeight{static_cast<float>(_height)};
    Vec4 viewport{
            static_cast<float>(renderArea.x) / bufferWidth,
            static_cast<float>(renderArea.y) / bufferHeight,
            static_cast<float>(renderArea.width) / bufferWidth,
            static_cast<float>(renderArea.height) / bufferHeight,
    };

    uint32_t hash = 4;
    hash ^= *reinterpret_cast<uint32_t*>(&viewport.x) + 0x9e3779b9 + (hash << 6) + (hash >> 2);
    hash ^= *reinterpret_cast<uint32_t*>(&viewport.y) + 0x9e3779b9 + (hash << 6) + (hash >> 2);
    hash ^= *reinterpret_cast<uint32_t*>(&viewport.z) + 0x9e3779b9 + (hash << 6) + (hash >> 2);
    hash ^= *reinterpret_cast<uint32_t*>(&viewport.w) + 0x9e3779b9 + (hash << 6) + (hash >> 2);

    const auto iter = _quadIA.find(hash);
    if (iter != _quadIA.end()) {
        return iter->second;
    }

    gfx::Buffer *        vb = nullptr;
    gfx::InputAssembler *ia = nullptr;
    createQuadInputAssembler(_quadIB, &vb, &ia);
    _quadVB.push_back(vb);
    _quadIA[hash] = ia;

    updateQuadVertexData(viewport, vb);

    return ia;
}

bool RenderPipeline::createQuadInputAssembler(gfx::Buffer *quadIB, gfx::Buffer **quadVB, gfx::InputAssembler **quadIA) {
    // step 1 create vertex buffer
    uint vbStride = sizeof(float) * 4;
    uint vbSize   = vbStride * 4;

    if (*quadVB == nullptr) {
        *quadVB = _device->createBuffer({gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
                                         gfx::MemoryUsageBit::DEVICE, vbSize, vbStride});
    }

    if (*quadVB == nullptr) {
        return false;
    }

    // step 2 create input assembler
    gfx::InputAssemblerInfo info;
    info.attributes.push_back({"a_position", gfx::Format::RG32F});
    info.attributes.push_back({"a_texCoord", gfx::Format::RG32F});
    info.vertexBuffers.push_back(*quadVB);
    info.indexBuffer = quadIB;
    *quadIA          = _device->createInputAssembler(info);
    return (*quadIA) != nullptr;
}

void RenderPipeline::ensureEnoughSize(const vector<scene::Camera *> &cameras) {
    for (auto *camera : cameras) {
        _width  = std::max(camera->window->getWidth(), _width);
        _height = std::max(camera->window->getHeight(), _height);
    }
}

gfx::Rect RenderPipeline::getRenderArea(scene::Camera *camera) {
    auto scale{_pipelineSceneData->getSharedData()->shadingScale};
    auto w{static_cast<float>(camera->window->getWidth()) * scale};
    auto h{static_cast<float>(camera->window->getHeight()) * scale};

    return {
        static_cast<int>(camera->viewPort.x * w),
        static_cast<int>(camera->viewPort.y * h),
        static_cast<uint>(camera->viewPort.z * w),
        static_cast<uint>(camera->viewPort.w * h),
    };
}

void RenderPipeline::genQuadVertexData(const Vec4 &viewport, float *vbData) {
    auto minX = static_cast<float>(viewport.x);
    auto maxX = static_cast<float>(viewport.x + viewport.z);
    auto minY = static_cast<float>(viewport.y);
    auto maxY = static_cast<float>(viewport.y + viewport.w);
    if (_device->getCapabilities().screenSpaceSignY > 0) {
        std::swap(minY, maxY);
    }
    int n       = 0;
    vbData[n++] = -1.0;
    vbData[n++] = -1.0;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0;
    vbData[n++] = -1.0;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0;
    vbData[n++] = 1.0;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0;
    vbData[n++] = 1.0;
    vbData[n++] = maxX;
    vbData[n++] = minY;
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

RenderStage *RenderPipeline::getRenderstageByName(const String &name) const {
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
