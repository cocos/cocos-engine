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

#include <boost/functional/hash.hpp>

#include "BatchedBuffer.h"
#include "GeometryRenderer.h"
#include "InstancedBuffer.h"
#include "PipelineStateManager.h"
#include "RenderFlow.h"
#include "RenderPipeline.h"
#include "frame-graph/FrameGraph.h"
#include "gfx-base/GFXCommandBuffer.h"
#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDescriptorSetLayout.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXTexture.h"
#include "helper/Utils.h"
#include "scene/Skybox.h"

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

    _globalDSManager = new GlobalDSManager();
    _pipelineUBO     = new PipelineUBO();
}

RenderPipeline::~RenderPipeline() {
    RenderPipeline::instance = nullptr;
}

bool RenderPipeline::initialize(const RenderPipelineInfo &info) {
    _flows = info.flows;
    _tag   = info.tag;
    return true;
}

bool RenderPipeline::isEnvmapEnabled() const {
    return _pipelineSceneData->getSkybox()->isUseIBL();
}

bool RenderPipeline::activate(gfx::Swapchain * /*swapchain*/) {
    _globalDSManager->activate(_device, this);
    _descriptorSet = _globalDSManager->getGlobalDescriptorSet();
    _pipelineUBO->activate(_device, this);
    _pipelineSceneData->activate(_device, this);

    CC_ASSERT(_geometryRenderer != nullptr);
    _geometryRenderer->activate(_device, this);

    // generate macros here rather than construct func because _clusterEnabled
    // switch may be changed in root.ts setRenderPipeline() function which is after
    // pipeline construct.
    generateConstantMacros();

    for (auto *const flow : _flows) {
        flow->activate(this);
    }

    return true;
}

void RenderPipeline::render(const vector<scene::Camera *> &cameras) {
    for (auto *const flow : _flows) {
        for (auto *camera : cameras) {
            flow->render(camera);
        }
    }

    RenderPipeline::framegraphGC();
}

void RenderPipeline::destroyQuadInputAssembler() {
    CC_SAFE_DESTROY_AND_DELETE(_quadIB);

    for (auto *node : _quadVB) {
        CC_SAFE_DESTROY_AND_DELETE(node);
    }

    for (auto node : _quadIA) {
        CC_SAFE_DESTROY_AND_DELETE(node.second);
    }
    _quadVB.clear();
    _quadIA.clear();
}

bool RenderPipeline::destroy() {
    for (auto *flow : _flows) {
        flow->destroy();
    }
    _flows.clear();

    _descriptorSet = nullptr;
    CC_SAFE_DESTROY_AND_DELETE(_globalDSManager);
    CC_SAFE_DESTROY_AND_DELETE(_pipelineUBO);
    CC_SAFE_DESTROY_NULL(_pipelineSceneData);
    CC_SAFE_DESTROY_NULL(_geometryRenderer);

    for (auto *const queryPool : _queryPools) {
        queryPool->destroy();
    }
    _queryPools.clear();

    for (auto *const cmdBuffer : _commandBuffers) {
        cmdBuffer->destroy();
    }
    _commandBuffers.clear();

    PipelineStateManager::destroyAll();
    BatchedBuffer::destroyBatchedBuffer();
    InstancedBuffer::destroyInstancedBuffer();
    framegraph::FrameGraph::gc(0);

    return Super::destroy();
}

gfx::Color RenderPipeline::getClearcolor(scene::Camera *camera) const {
    auto *const sceneData = getPipelineSceneData();
    gfx::Color  clearColor{0.0F, 0.0F, 0.0F, 1.0F};
    if (static_cast<uint32_t>(camera->getClearFlag()) & static_cast<uint32_t>(gfx::ClearFlagBit::COLOR)) {
        clearColor = camera->getClearColor();
    }

    clearColor.w = 0.F;
    return clearColor;
}

void RenderPipeline::updateQuadVertexData(const Vec4 &viewport, gfx::Buffer *buffer) {
    float vbData[16] = {0.F};
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

    const auto iter = _quadIA.find(viewport);
    if (iter != _quadIA.end()) {
        return iter->second;
    }

    gfx::Buffer *        vb = nullptr;
    gfx::InputAssembler *ia = nullptr;
    createQuadInputAssembler(_quadIB, &vb, &ia);
    _quadVB.push_back(vb);
    _quadIA[viewport] = ia;

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
        _width  = std::max(camera->getWindow()->getWidth(), _width);
        _height = std::max(camera->getWindow()->getHeight(), _height);
    }
}

gfx::Viewport RenderPipeline::getViewport(scene::Camera *camera) {
    auto             scale{_pipelineSceneData->getShadingScale()};
    const gfx::Rect &rect = getRenderArea(camera);
    return {
        static_cast<int>(static_cast<float>(rect.x) * scale),
        static_cast<int>(static_cast<float>(rect.y) * scale),
        static_cast<uint>(static_cast<float>(rect.width) * scale),
        static_cast<uint>(static_cast<float>(rect.height) * scale)};
}

gfx::Rect RenderPipeline::getScissor(scene::Camera *camera) {
    auto             scale{_pipelineSceneData->getShadingScale()};
    const gfx::Rect &rect = getRenderArea(camera);
    return {
        static_cast<int>(static_cast<float>(rect.x) * scale),
        static_cast<int>(static_cast<float>(rect.y) * scale),
        static_cast<uint>(static_cast<float>(rect.width) * scale),
        static_cast<uint>(static_cast<float>(rect.height) * scale)};
}

gfx::Rect RenderPipeline::getRenderArea(scene::Camera *camera) {
    float w{static_cast<float>(camera->getWindow()->getWidth())};
    float h{static_cast<float>(camera->getWindow()->getHeight())};

    const auto &vp = camera->getViewport();
    return {
        static_cast<int32_t>(vp.x * w),
        static_cast<int32_t>(vp.y * h),
        static_cast<uint32_t>(vp.z * w),
        static_cast<uint32_t>(vp.w * h),
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
    vbData[n++] = -1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = minX; // uv
    vbData[n++] = maxY;
    vbData[n++] = 1.0F;
    vbData[n++] = -1.0F;
    vbData[n++] = maxX;
    vbData[n++] = maxY;
    vbData[n++] = -1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = minX;
    vbData[n++] = minY;
    vbData[n++] = 1.0F;
    vbData[n++] = 1.0F;
    vbData[n++] = maxX;
    vbData[n++] = minY;
}

void RenderPipeline::generateConstantMacros() {
    _constantMacros = StringUtil::format(
        R"(
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE %d
#define CC_ENABLE_CLUSTERED_LIGHT_CULLING %d
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS %d
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS %d
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT %d
        )",
        _device->hasFeature(gfx::Feature::TEXTURE_FLOAT) ? 1 : 0,
        _clusterEnabled ? 1 : 0,
        _device->getCapabilities().maxVertexUniformVectors,
        _device->getCapabilities().maxFragmentUniformVectors,
        _device->hasFeature(gfx::Feature::INPUT_ATTACHMENT_BENEFIT));
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

bool RenderPipeline::isOccluded(const scene::Camera *camera, const scene::SubModel *subModel) {
    auto *model      = subModel->getOwner();
    auto *worldBound = model->getWorldBounds();

    // assume visible if there is no worldBound.
    if (!worldBound) {
        return false;
    }

    // assume visible if camera is inside of worldBound.
    if (worldBound->contain(camera->getPosition())) {
        return false;
    }

    // assume visible if no query in the last frame.
    uint32_t id = subModel->getId();
    if (!_queryPools[0]->hasResult(id)) {
        return false;
    }

    // check query results.
    return _queryPools[0]->getResult(id) == 0;
}

void RenderPipeline::framegraphGC() {
    static uint64_t           frameCount{0U};
    static constexpr uint32_t INTERVAL_IN_SECONDS = 30;
    if (++frameCount % (INTERVAL_IN_SECONDS * 60) == 0) {
        framegraph::FrameGraph::gc(INTERVAL_IN_SECONDS * 60);
    }
}

} // namespace pipeline
} // namespace cc
