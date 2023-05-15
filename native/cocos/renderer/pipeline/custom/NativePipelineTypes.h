/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "base/std/container/map.h"
#include "cocos/base/Ptr.h"
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/gfx-base/GFXFramebuffer.h"
#include "cocos/renderer/gfx-base/GFXRenderPass.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/InstancedBuffer.h"
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/NativeTypes.h"
#include "cocos/renderer/pipeline/custom/details/Map.h"
#include "cocos/renderer/pipeline/custom/details/Set.h"

#ifdef _MSC_VER
    #pragma warning(push)
    #pragma warning(disable: 4250)
#endif

namespace cc {

namespace render {

class NativeRenderNode {
public:
    NativeRenderNode(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn) noexcept
    : pipelineRuntime(pipelineRuntimeIn),
      renderGraph(renderGraphIn),
      nodeID(nodeIDIn) {}

    ccstd::string getName() const /*implements*/;
    void setName(const ccstd::string &name) /*implements*/;
    void setCustomBehavior(const ccstd::string &name) /*implements*/;

    const PipelineRuntime* pipelineRuntime{nullptr};
    RenderGraph* renderGraph{nullptr};
    uint32_t nodeID{RenderGraph::null_vertex()};
};

class NativeSetter : public NativeRenderNode {
public:
    NativeSetter(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn)
    : NativeRenderNode(pipelineRuntimeIn, renderGraphIn, nodeIDIn),
      layoutGraph(layoutGraphIn),
      layoutID(layoutIDIn) {}

    void setMat4(const ccstd::string &name, const Mat4 &mat) /*implements*/;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) /*implements*/;
    void setColor(const ccstd::string &name, const gfx::Color &color) /*implements*/;
    void setVec4(const ccstd::string &name, const Vec4 &vec) /*implements*/;
    void setVec2(const ccstd::string &name, const Vec2 &vec) /*implements*/;
    void setFloat(const ccstd::string &name, float v) /*implements*/;
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) /*implements*/;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) /*implements*/;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) /*implements*/;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) /*implements*/;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) /*implements*/;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) /*implements*/;
    void setCamera(const scene::Camera *camera) /*implements*/;

    void setVec4ArraySize(const ccstd::string& name, uint32_t sz);
    void setVec4ArrayElem(const ccstd::string& name, const cc::Vec4& vec, uint32_t id);

    void setMat4ArraySize(const ccstd::string& name, uint32_t sz);
    void setMat4ArrayElem(const ccstd::string& name, const cc::Mat4& mat, uint32_t id);

    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t layoutID{LayoutGraphData::null_vertex()};
};

class NativeRenderQueueBuilder final : public RenderQueueBuilder, public NativeSetter {
public:
    NativeRenderQueueBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) override;
    void addScene(const scene::RenderScene *scene, SceneFlags sceneFlags) override;
    void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) override;
    void setViewport(const gfx::Viewport &viewport) override;
    void addCustomCommand(std::string_view customBehavior) override;
};

class NativeRenderSubpassBuilder final : public RenderSubpassBuilder, public NativeSetter {
public:
    NativeRenderSubpassBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addRenderTarget(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) override;
    void addDepthStencil(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) override;
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) override;
    void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    void setViewport(const gfx::Viewport &viewport) override;
    RenderQueueBuilder *addQueue(QueueHint hint, const ccstd::string &layoutName) override;
    bool getShowStatistics() const override;
    void setShowStatistics(bool enable) override;
    void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) override;
};

class NativeComputeSubpassBuilder final : public ComputeSubpassBuilder, public NativeSetter {
public:
    NativeComputeSubpassBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addRenderTarget(const ccstd::string &name, const ccstd::string &slotName) override;
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) override;
    void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    ComputeQueueBuilder *addQueue(const ccstd::string &layoutName) override;
    void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) override;
};

class NativeRenderPassBuilder final : public RenderPassBuilder, public NativeSetter {
public:
    NativeRenderPassBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addRenderTarget(const ccstd::string &name, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, const gfx::Color &color) override;
    void addDepthStencil(const ccstd::string &name, const ccstd::string &slotName, gfx::LoadOp loadOp, gfx::StoreOp storeOp, float depth, uint8_t stencil, gfx::ClearFlagBit clearFlags) override;
    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) override;
    void addRasterView(const ccstd::string &name, const RasterView &view) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    RenderQueueBuilder *addQueue(QueueHint hint, const ccstd::string &layoutName) override;
    void setViewport(const gfx::Viewport &viewport) override;
    void setVersion(const ccstd::string &name, uint64_t version) override;
    bool getShowStatistics() const override;
    void setShowStatistics(bool enable) override;

    void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    RenderSubpassBuilder *addRenderSubpass(const ccstd::string &layoutName) override;
    ComputeSubpassBuilder *addComputeSubpass(const ccstd::string &layoutName) override;
    void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) override;
};

class NativeComputeQueueBuilder final : public ComputeQueueBuilder, public NativeSetter {
public:
    NativeComputeQueueBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addDispatch(uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, Material *material, uint32_t passID) override;
};

class NativeComputePassBuilder final : public ComputePassBuilder, public NativeSetter {
public:
    NativeComputePassBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t nodeIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept
    : NativeSetter(pipelineRuntimeIn, renderGraphIn, nodeIDIn, layoutGraphIn, layoutIDIn) {}

    ccstd::string getName() const override {
        return NativeRenderNode::getName();
    }
    void setName(const ccstd::string &name) override {
        NativeRenderNode::setName(name);
    }
    void setCustomBehavior(const ccstd::string &name) override {
        NativeRenderNode::setCustomBehavior(name);
    }

    void setMat4(const ccstd::string &name, const Mat4 &mat) override {
        NativeSetter::setMat4(name, mat);
    }
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override {
        NativeSetter::setQuaternion(name, quat);
    }
    void setColor(const ccstd::string &name, const gfx::Color &color) override {
        NativeSetter::setColor(name, color);
    }
    void setVec4(const ccstd::string &name, const Vec4 &vec) override {
        NativeSetter::setVec4(name, vec);
    }
    void setVec2(const ccstd::string &name, const Vec2 &vec) override {
        NativeSetter::setVec2(name, vec);
    }
    void setFloat(const ccstd::string &name, float v) override {
        NativeSetter::setFloat(name, v);
    }
    void setArrayBuffer(const ccstd::string &name, const ArrayBuffer *arrayBuffer) override {
        NativeSetter::setArrayBuffer(name, arrayBuffer);
    }
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setBuffer(name, buffer);
    }
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setTexture(name, texture);
    }
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override {
        NativeSetter::setReadWriteBuffer(name, buffer);
    }
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override {
        NativeSetter::setReadWriteTexture(name, texture);
    }
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override {
        NativeSetter::setSampler(name, sampler);
    }
    void setCamera(const scene::Camera *camera) override {
        NativeSetter::setCamera(camera);
    }

    void addTexture(const ccstd::string &name, const ccstd::string &slotName, gfx::Sampler *sampler) override;
    void addStorageBuffer(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addStorageImage(const ccstd::string &name, AccessType accessType, const ccstd::string &slotName, ClearValueType clearType, const ClearValue &clearValue) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    ComputeQueueBuilder *addQueue(const ccstd::string &layoutName) override;
    void setCustomShaderStages(const ccstd::string &name, gfx::ShaderStageFlagBit stageFlags) override;
};

class NativeSceneTransversal final : public SceneTransversal {
public:
    NativeSceneTransversal() = default;
    NativeSceneTransversal(const scene::Camera* cameraIn, const scene::RenderScene* sceneIn) noexcept
    : camera(cameraIn),
      scene(sceneIn) {}

    SceneTask *transverse(SceneVisitor *visitor) const override;

    const scene::Camera* camera{nullptr};
    const scene::RenderScene* scene{nullptr};
};

struct RenderInstancingQueue {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {batches.get_allocator().resource()};
    }

    RenderInstancingQueue(const allocator_type& alloc) noexcept; // NOLINT
    RenderInstancingQueue(RenderInstancingQueue&& rhs, const allocator_type& alloc);
    RenderInstancingQueue(RenderInstancingQueue const& rhs, const allocator_type& alloc);

    RenderInstancingQueue(RenderInstancingQueue&& rhs) noexcept = default;
    RenderInstancingQueue(RenderInstancingQueue const& rhs) = delete;
    RenderInstancingQueue& operator=(RenderInstancingQueue&& rhs) = default;
    RenderInstancingQueue& operator=(RenderInstancingQueue const& rhs) = default;

    void add(pipeline::InstancedBuffer &instancedBuffer);
    void sort();
    void uploadBuffers(gfx::CommandBuffer *cmdBuffer) const;
    void recordCommandBuffer(
        gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
        gfx::DescriptorSet *ds = nullptr, uint32_t offset = 0,
        const ccstd::vector<uint32_t> *dynamicOffsets = nullptr) const;

    PmrUnorderedSet<pipeline::InstancedBuffer*> batches;
    ccstd::pmr::vector<pipeline::InstancedBuffer*> sortedBatches;
};

struct DrawInstance {
    const scene::SubModel* subModel{nullptr};
    uint32_t priority{0};
    uint32_t hash{0};
    float depth{0};
    uint32_t shaderID{0};
    uint32_t passIndex{0};
};

struct RenderDrawQueue {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {instances.get_allocator().resource()};
    }

    RenderDrawQueue(const allocator_type& alloc) noexcept; // NOLINT
    RenderDrawQueue(RenderDrawQueue&& rhs, const allocator_type& alloc);
    RenderDrawQueue(RenderDrawQueue const& rhs, const allocator_type& alloc);

    RenderDrawQueue(RenderDrawQueue&& rhs) noexcept = default;
    RenderDrawQueue(RenderDrawQueue const& rhs) = delete;
    RenderDrawQueue& operator=(RenderDrawQueue&& rhs) = default;
    RenderDrawQueue& operator=(RenderDrawQueue const& rhs) = default;

    void add(const scene::Model& model, float depth, uint32_t subModelIdx, uint32_t passIdx);
    void sortOpaqueOrCutout();
    void sortTransparent();
    void recordCommandBuffer(gfx::Device *device, const scene::Camera *camera,
        gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer,
        uint32_t subpassIndex) const;

    ccstd::pmr::vector<DrawInstance> instances;
};

struct NativeRenderQueue {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {opaqueQueue.get_allocator().resource()};
    }

    NativeRenderQueue(const allocator_type& alloc) noexcept; // NOLINT
    NativeRenderQueue(SceneFlags sceneFlagsIn, uint32_t layoutPassIDIn, const allocator_type& alloc) noexcept;
    NativeRenderQueue(NativeRenderQueue&& rhs, const allocator_type& alloc);

    NativeRenderQueue(NativeRenderQueue&& rhs) noexcept = default;
    NativeRenderQueue(NativeRenderQueue const& rhs) = delete;
    NativeRenderQueue& operator=(NativeRenderQueue&& rhs) = default;
    NativeRenderQueue& operator=(NativeRenderQueue const& rhs) = delete;

    void sort();

    RenderDrawQueue opaqueQueue;
    RenderDrawQueue transparentQueue;
    RenderInstancingQueue opaqueInstancingQueue;
    RenderInstancingQueue transparentInstancingQueue;
    SceneFlags sceneFlags{SceneFlags::NONE};
    uint32_t layoutPassID{0xFFFFFFFF};
};

class DefaultSceneVisitor final : public SceneVisitor {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    DefaultSceneVisitor(const allocator_type& alloc) noexcept; // NOLINT

    const pipeline::PipelineSceneData *getPipelineSceneData() const override;
    void setViewport(const gfx::Viewport &vp) override;
    void setScissor(const gfx::Rect &rect) override;
    void bindPipelineState(gfx::PipelineState *pso) override;
    void bindDescriptorSet(uint32_t set, gfx::DescriptorSet *descriptorSet, uint32_t dynamicOffsetCount, const uint32_t *dynamicOffsets) override;
    void bindInputAssembler(gfx::InputAssembler *ia) override;
    void updateBuffer(gfx::Buffer *buff, const void *data, uint32_t size) override;
    void draw(const gfx::DrawInfo &info) override;

    ccstd::pmr::string name;
};

class DefaultForwardLightingTransversal final : public SceneTransversal {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    DefaultForwardLightingTransversal(const allocator_type& alloc) noexcept; // NOLINT

    SceneTask *transverse(SceneVisitor *visitor) const override;

    ccstd::pmr::string name;
};

struct ResourceGroup {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {instancingBuffers.get_allocator().resource()};
    }

    ResourceGroup(const allocator_type& alloc) noexcept; // NOLINT
    ResourceGroup(ResourceGroup&& rhs) = delete;
    ResourceGroup(ResourceGroup const& rhs) = delete;
    ResourceGroup& operator=(ResourceGroup&& rhs) = delete;
    ResourceGroup& operator=(ResourceGroup const& rhs) = delete;
    ~ResourceGroup() noexcept;

    PmrUnorderedSet<IntrusivePtr<pipeline::InstancedBuffer>> instancingBuffers;
};

struct BufferPool {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {currentBuffers.get_allocator().resource()};
    }

    BufferPool(const allocator_type& alloc) noexcept; // NOLINT
    BufferPool(gfx::Device* deviceIn, uint32_t bufferSizeIn, bool dynamicIn, const allocator_type& alloc) noexcept;
    BufferPool(BufferPool&& rhs, const allocator_type& alloc);

    BufferPool(BufferPool&& rhs) noexcept = default;
    BufferPool(BufferPool const& rhs) = delete;
    BufferPool& operator=(BufferPool&& rhs) = default;
    BufferPool& operator=(BufferPool const& rhs) = delete;
    void init(gfx::Device* deviceIn, uint32_t sz, bool bDynamic);
    void syncResources();
    gfx::Buffer* allocateBuffer();

    gfx::Device* device{nullptr};
    uint32_t bufferSize{0};
    bool dynamic{false};
    ccstd::pmr::vector<IntrusivePtr<gfx::Buffer>> currentBuffers;
    ccstd::pmr::vector<IntrusivePtr<gfx::Buffer>> currentBufferViews;
    ccstd::pmr::vector<IntrusivePtr<gfx::Buffer>> freeBuffers;
    ccstd::pmr::vector<IntrusivePtr<gfx::Buffer>> freeBufferViews;
};

struct DescriptorSetPool {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {currentDescriptorSets.get_allocator().resource()};
    }

    DescriptorSetPool(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorSetPool(gfx::Device* deviceIn, IntrusivePtr<gfx::DescriptorSetLayout> setLayoutIn, const allocator_type& alloc) noexcept;
    DescriptorSetPool(DescriptorSetPool&& rhs, const allocator_type& alloc);

    DescriptorSetPool(DescriptorSetPool&& rhs) noexcept = default;
    DescriptorSetPool(DescriptorSetPool const& rhs) = delete;
    DescriptorSetPool& operator=(DescriptorSetPool&& rhs) = default;
    DescriptorSetPool& operator=(DescriptorSetPool const& rhs) = delete;
    void init(gfx::Device* deviceIn, IntrusivePtr<gfx::DescriptorSetLayout> layout);
    void syncDescriptorSets();
    const gfx::DescriptorSet& getCurrentDescriptorSet() const;
    gfx::DescriptorSet& getCurrentDescriptorSet();
    gfx::DescriptorSet* allocateDescriptorSet();

    gfx::Device* device{nullptr};
    IntrusivePtr<gfx::DescriptorSetLayout> setLayout;
    ccstd::pmr::vector<IntrusivePtr<gfx::DescriptorSet>> currentDescriptorSets;
    ccstd::pmr::vector<IntrusivePtr<gfx::DescriptorSet>> freeDescriptorSets;
};

struct UniformBlockResource {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {cpuBuffer.get_allocator().resource()};
    }

    UniformBlockResource(const allocator_type& alloc) noexcept; // NOLINT
    UniformBlockResource(UniformBlockResource&& rhs, const allocator_type& alloc);

    UniformBlockResource(UniformBlockResource&& rhs) noexcept = default;
    UniformBlockResource(UniformBlockResource const& rhs) = delete;
    UniformBlockResource& operator=(UniformBlockResource&& rhs) = default;
    UniformBlockResource& operator=(UniformBlockResource const& rhs) = delete;
    void init(gfx::Device* deviceIn, uint32_t sz, bool bDynamic);
    gfx::Buffer* createFromCpuBuffer();

    ccstd::pmr::vector<char> cpuBuffer;
    BufferPool bufferPool;
};

struct ProgramResource {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {uniformBuffers.get_allocator().resource()};
    }

    ProgramResource(const allocator_type& alloc) noexcept; // NOLINT
    ProgramResource(ProgramResource&& rhs, const allocator_type& alloc);

    ProgramResource(ProgramResource&& rhs) noexcept = default;
    ProgramResource(ProgramResource const& rhs) = delete;
    ProgramResource& operator=(ProgramResource&& rhs) = default;
    ProgramResource& operator=(ProgramResource const& rhs) = delete;
    void syncResources() noexcept;

    ccstd::pmr::unordered_map<NameLocalID, UniformBlockResource> uniformBuffers;
    DescriptorSetPool descriptorSetPool;
};

struct LayoutGraphNodeResource {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {uniformBuffers.get_allocator().resource()};
    }

    LayoutGraphNodeResource(const allocator_type& alloc) noexcept; // NOLINT
    LayoutGraphNodeResource(LayoutGraphNodeResource&& rhs, const allocator_type& alloc);

    LayoutGraphNodeResource(LayoutGraphNodeResource&& rhs) noexcept = default;
    LayoutGraphNodeResource(LayoutGraphNodeResource const& rhs) = delete;
    LayoutGraphNodeResource& operator=(LayoutGraphNodeResource&& rhs) = default;
    LayoutGraphNodeResource& operator=(LayoutGraphNodeResource const& rhs) = delete;
    void syncResources() noexcept;

    PmrFlatMap<NameLocalID, UniformBlockResource> uniformBuffers;
    DescriptorSetPool descriptorSetPool;
    PmrTransparentMap<ccstd::pmr::string, ProgramResource> programResources;
};

struct QuadResource {
    QuadResource() = default;
    QuadResource(IntrusivePtr<gfx::Buffer> quadVBIn, IntrusivePtr<gfx::Buffer> quadIBIn, IntrusivePtr<gfx::InputAssembler> quadIAIn) noexcept // NOLINT
    : quadVB(std::move(quadVBIn)),
      quadIB(std::move(quadIBIn)),
      quadIA(std::move(quadIAIn)) {}

    IntrusivePtr<gfx::Buffer> quadVB;
    IntrusivePtr<gfx::Buffer> quadIB;
    IntrusivePtr<gfx::InputAssembler> quadIA;
};

struct NativeRenderContext {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {resourceGroups.get_allocator().resource()};
    }

    NativeRenderContext(std::unique_ptr<gfx::DefaultResource> defaultResourceIn, const allocator_type& alloc) noexcept;
    NativeRenderContext(NativeRenderContext&& rhs) = delete;
    NativeRenderContext(NativeRenderContext const& rhs) = delete;
    NativeRenderContext& operator=(NativeRenderContext&& rhs) = delete;
    NativeRenderContext& operator=(NativeRenderContext const& rhs) = delete;

    void clearPreviousResources(uint64_t finishedFenceValue) noexcept;

    std::unique_ptr<gfx::DefaultResource> defaultResource;
    ccstd::pmr::map<uint64_t, ResourceGroup> resourceGroups;
    ccstd::pmr::vector<LayoutGraphNodeResource> layoutGraphResources;
    QuadResource fullscreenQuad;
    uint64_t nextFenceValue{0};
};

class NativeProgramLibrary final : public ProgramLibrary {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {layoutGraph.get_allocator().resource()};
    }

    NativeProgramLibrary(const allocator_type& alloc) noexcept; // NOLINT

    void addEffect(const EffectAsset *effectAsset) override;
    void precompileEffect(gfx::Device *device, EffectAsset *effectAsset) override;
    ccstd::string getKey(uint32_t phaseID, const ccstd::string &programName, const MacroRecord &defines) const override;
    IntrusivePtr<gfx::PipelineLayout> getPipelineLayout(gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) override;
    const gfx::DescriptorSetLayout &getMaterialDescriptorSetLayout(gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) override;
    const gfx::DescriptorSetLayout &getLocalDescriptorSetLayout(gfx::Device *device, uint32_t phaseID, const ccstd::string &programName) override;
    const IProgramInfo &getProgramInfo(uint32_t phaseID, const ccstd::string &programName) const override;
    const gfx::ShaderInfo &getShaderInfo(uint32_t phaseID, const ccstd::string &programName) const override;
    ProgramProxy *getProgramVariant(gfx::Device *device, uint32_t phaseID, const ccstd::string &name, MacroRecord &defines, const ccstd::pmr::string *key) override;
    gfx::PipelineState *getComputePipelineState(gfx::Device *device, uint32_t phaseID, const ccstd::string &name, MacroRecord &defines, const ccstd::pmr::string *key) override;
    const ccstd::vector<int32_t> &getBlockSizes(uint32_t phaseID, const ccstd::string &programName) const override;
    const ccstd::unordered_map<ccstd::string, uint32_t> &getHandleMap(uint32_t phaseID, const ccstd::string &programName) const override;
    uint32_t getProgramID(uint32_t phaseID, const ccstd::pmr::string &programName) override;
    uint32_t getDescriptorNameID(const ccstd::pmr::string &name) override;
    const ccstd::pmr::string &getDescriptorName(uint32_t nameID) override;

    void init(gfx::Device* deviceIn);
    void setPipeline(PipelineRuntime* pipelineIn);
    void destroy();

    LayoutGraphData layoutGraph;
    PmrFlatMap<uint32_t, ProgramGroup> phases;
    boost::container::pmr::unsynchronized_pool_resource unsycPool;
    bool mergeHighFrequency{false};
    bool fixedLocal{true};
    DescriptorSetLayoutData localLayoutData;
    IntrusivePtr<gfx::DescriptorSetLayout> localDescriptorSetLayout;
    IntrusivePtr<gfx::DescriptorSetLayout> emptyDescriptorSetLayout;
    IntrusivePtr<gfx::PipelineLayout> emptyPipelineLayout;
    PipelineRuntime* pipeline{nullptr};
    gfx::Device* device{nullptr};
};

struct PipelineCustomization {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {contexts.get_allocator().resource()};
    }

    PipelineCustomization(const allocator_type& alloc) noexcept; // NOLINT
    PipelineCustomization(PipelineCustomization&& rhs, const allocator_type& alloc);
    PipelineCustomization(PipelineCustomization const& rhs, const allocator_type& alloc);

    PipelineCustomization(PipelineCustomization&& rhs) noexcept = default;
    PipelineCustomization(PipelineCustomization const& rhs) = delete;
    PipelineCustomization& operator=(PipelineCustomization&& rhs) = default;
    PipelineCustomization& operator=(PipelineCustomization const& rhs) = default;

    std::shared_ptr<CustomPipelineContext> currentContext;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomPipelineContext>> contexts;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomRenderPass>> renderPasses;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomRenderSubpass>> renderSubpasses;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomComputeSubpass>> computeSubpasses;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomComputePass>> computePasses;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomRenderQueue>> renderQueues;
    PmrTransparentMap<ccstd::pmr::string, std::shared_ptr<CustomRenderCommand>> renderCommands;
};

class NativePipeline final : public Pipeline {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    NativePipeline(const allocator_type& alloc) noexcept; // NOLINT

    bool activate(gfx::Swapchain *swapchain) override;
    bool destroy() noexcept override;
    void render(const ccstd::vector<scene::Camera*> &cameras) override;
    gfx::Device *getDevice() const override;
    const MacroRecord &getMacros() const override;
    pipeline::GlobalDSManager *getGlobalDSManager() const override;
    gfx::DescriptorSetLayout *getDescriptorSetLayout() const override;
    gfx::DescriptorSet *getDescriptorSet() const override;
    const ccstd::vector<gfx::CommandBuffer*> &getCommandBuffers() const override;
    pipeline::PipelineSceneData *getPipelineSceneData() const override;
    const ccstd::string &getConstantMacros() const override;
    scene::Model *getProfiler() const override;
    void setProfiler(scene::Model *profiler) override;
    pipeline::GeometryRenderer *getGeometryRenderer() const override;
    float getShadingScale() const override;
    void setShadingScale(float scale) override;
    const ccstd::string &getMacroString(const ccstd::string &name) const override;
    int32_t getMacroInt(const ccstd::string &name) const override;
    bool getMacroBool(const ccstd::string &name) const override;
    void setMacroString(const ccstd::string &name, const ccstd::string &value) override;
    void setMacroInt(const ccstd::string &name, int32_t value) override;
    void setMacroBool(const ccstd::string &name, bool value) override;
    void onGlobalPipelineStateChanged() override;
    void setValue(const ccstd::string &name, int32_t value) override;
    void setValue(const ccstd::string &name, bool value) override;
    bool isOcclusionQueryEnabled() const override;
    void resetRenderQueue(bool reset) override;
    bool isRenderQueueReset() const override;

    PipelineType getPipelineType() const override;
    PipelineCapabilities getPipelineCapabilities() const override;
    void beginSetup() override;
    void endSetup() override;
    bool containsResource(const ccstd::string &name) const override;
    uint32_t addRenderTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) override;
    uint32_t addRenderWindow(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) override;
    void updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) override;
    uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) override;
    void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) override;
    void beginFrame() override;
    void endFrame() override;
    void addMovePass(const ccstd::vector<MovePair> &movePairs) override;
    void addCopyPass(const ccstd::vector<CopyPair> &copyPairs) override;
    gfx::DescriptorSetLayout *getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) override;

    uint32_t addStorageBuffer(const ccstd::string &name, gfx::Format format, uint32_t size, ResourceResidency residency) override;
    uint32_t addStorageTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    uint32_t addShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height, ResourceResidency residency) override;
    void updateStorageBuffer(const ccstd::string &name, uint32_t size, gfx::Format format) override;
    void updateStorageTexture(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) override;
    void updateShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height) override;
    RenderPassBuilder *addRenderPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) override;
    ComputePassBuilder *addComputePass(const ccstd::string &layoutName) override;
    uint32_t addCustomBuffer(const ccstd::string &name, const gfx::BufferInfo &info, const std::string &type) override;
    uint32_t addCustomTexture(const ccstd::string &name, const gfx::TextureInfo &info, const std::string &type) override;

    void executeRenderGraph(const RenderGraph& rg);

    void addCustomContext(std::string_view name, std::shared_ptr<CustomPipelineContext> ptr);
    void addCustomRenderPass(std::string_view name, std::shared_ptr<CustomRenderPass> ptr);
    void addCustomRenderSubpass(std::string_view name, std::shared_ptr<CustomRenderSubpass> ptr);
    void addCustomComputeSubpass(std::string_view name, std::shared_ptr<CustomComputeSubpass> ptr);
    void addCustomComputePass(std::string_view name, std::shared_ptr<CustomComputePass> ptr);
    void addCustomRenderQueue(std::string_view name, std::shared_ptr<CustomRenderQueue> ptr);
    void addCustomRenderCommand(std::string_view name, std::shared_ptr<CustomRenderCommand> ptr);

    void setCustomContext(std::string_view name);

private:
    ccstd::vector<gfx::CommandBuffer*> _commandBuffers;

public:
    boost::container::pmr::unsynchronized_pool_resource unsyncPool;
    gfx::Device* device{nullptr};
    gfx::Swapchain* swapchain{nullptr};
    MacroRecord macros;
    ccstd::string constantMacros;
    std::unique_ptr<pipeline::GlobalDSManager> globalDSManager;
    ccstd::pmr::string name;
    NativeProgramLibrary* programLibrary;
    scene::Model* profiler{nullptr};
    LightingMode lightingMode{LightingMode::DEFAULT};
    IntrusivePtr<pipeline::PipelineSceneData> pipelineSceneData;
    NativeRenderContext nativeContext;
    ResourceGraph resourceGraph;
    RenderGraph renderGraph;
    PipelineStatistics statistics;
    PipelineCustomization custom;
};

class NativeProgramProxy final : public ProgramProxy {
public:
    NativeProgramProxy() = default;
    NativeProgramProxy(IntrusivePtr<gfx::Shader> shaderIn) // NOLINT
    : shader(std::move(shaderIn)) {}
    NativeProgramProxy(IntrusivePtr<gfx::Shader> shaderIn, IntrusivePtr<gfx::PipelineState> pipelineStateIn)
    : shader(std::move(shaderIn)),
      pipelineState(std::move(pipelineStateIn)) {}

    const ccstd::string &getName() const noexcept override;
    gfx::Shader *getShader() const noexcept override;

    IntrusivePtr<gfx::Shader> shader;
    IntrusivePtr<gfx::PipelineState> pipelineState;
};

class NativeRenderingModule final : public RenderingModule {
public:
    NativeRenderingModule() = default;
    NativeRenderingModule(std::shared_ptr<NativeProgramLibrary> programLibraryIn) noexcept // NOLINT
    : programLibrary(std::move(programLibraryIn)) {}

    uint32_t getPassID(const ccstd::string &name) const override;
    uint32_t getPhaseID(uint32_t passID, const ccstd::string &name) const override;

    std::shared_ptr<NativeProgramLibrary> programLibrary;
};

} // namespace render

} // namespace cc

// clang-format on

#ifdef _MSC_VER
    #pragma warning(pop)
#endif
