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
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/Map.h"
#include "cocos/renderer/pipeline/custom/details/Set.h"

namespace cc {

namespace render {

class NativeRasterQueueBuilder final : public RasterQueueBuilder {
public:
    NativeRasterQueueBuilder() = default;
    NativeRasterQueueBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t queueIDIn, const LayoutGraphData* layoutGraphIn) noexcept
    : pipelineRuntime(pipelineRuntimeIn),
      renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      queueID(queueIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void setMat4(const ccstd::string &name, const Mat4 &mat) override;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override;
    void setColor(const ccstd::string &name, const gfx::Color &color) override;
    void setVec4(const ccstd::string &name, const Vec4 &vec) override;
    void setVec2(const ccstd::string &name, const Vec2 &vec) override;
    void setFloat(const ccstd::string &name, float v) override;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override;

    void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) override;
    void addScene(const ccstd::string &name, SceneFlags sceneFlags) override;
    void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) override;
    void setViewport(const gfx::Viewport &viewport) override;

    const PipelineRuntime* pipelineRuntime{nullptr};
    RenderGraph* renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t queueID{RenderGraph::null_vertex()};
};

class NativeRasterPassBuilder final : public RasterPassBuilder {
public:
    NativeRasterPassBuilder() = default;
    NativeRasterPassBuilder(const PipelineRuntime* pipelineRuntimeIn, RenderGraph* renderGraphIn, uint32_t passIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : pipelineRuntime(pipelineRuntimeIn),
      renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      passID(passIDIn),
      layoutID(layoutIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void setMat4(const ccstd::string &name, const Mat4 &mat) override;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override;
    void setColor(const ccstd::string &name, const gfx::Color &color) override;
    void setVec4(const ccstd::string &name, const Vec4 &vec) override;
    void setVec2(const ccstd::string &name, const Vec2 &vec) override;
    void setFloat(const ccstd::string &name, float v) override;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override;

    void addRasterView(const ccstd::string &name, const RasterView &view) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    RasterQueueBuilder *addQueue(QueueHint hint) override;
    void setViewport(const gfx::Viewport &viewport) override;
    void setVersion(const ccstd::string &name, uint64_t version) override;
    bool getShowStatistics() const override;
    void setShowStatistics(bool enable) override;

    const PipelineRuntime* pipelineRuntime{nullptr};
    RenderGraph* renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t passID{RenderGraph::null_vertex()};
    uint32_t layoutID{LayoutGraphData::null_vertex()};
};

class NativeComputeQueueBuilder final : public ComputeQueueBuilder {
public:
    NativeComputeQueueBuilder() = default;
    NativeComputeQueueBuilder(RenderGraph* renderGraphIn, uint32_t queueIDIn, const LayoutGraphData* layoutGraphIn) noexcept
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      queueID(queueIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void setMat4(const ccstd::string &name, const Mat4 &mat) override;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override;
    void setColor(const ccstd::string &name, const gfx::Color &color) override;
    void setVec4(const ccstd::string &name, const Vec4 &vec) override;
    void setVec2(const ccstd::string &name, const Vec2 &vec) override;
    void setFloat(const ccstd::string &name, float v) override;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override;

    void addDispatch(const ccstd::string &shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) override;

    RenderGraph* renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t queueID{RenderGraph::null_vertex()};
};

class NativeComputePassBuilder final : public ComputePassBuilder {
public:
    NativeComputePassBuilder() = default;
    NativeComputePassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      passID(passIDIn),
      layoutID(layoutIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void setMat4(const ccstd::string &name, const Mat4 &mat) override;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override;
    void setColor(const ccstd::string &name, const gfx::Color &color) override;
    void setVec4(const ccstd::string &name, const Vec4 &vec) override;
    void setVec2(const ccstd::string &name, const Vec2 &vec) override;
    void setFloat(const ccstd::string &name, float v) override;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override;

    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    ComputeQueueBuilder *addQueue() override;

    RenderGraph* renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t passID{RenderGraph::null_vertex()};
    uint32_t layoutID{LayoutGraphData::null_vertex()};
};

class NativeMovePassBuilder final : public MovePassBuilder {
public:
    NativeMovePassBuilder() = default;
    NativeMovePassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn) noexcept
    : renderGraph(renderGraphIn),
      passID(passIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void addPair(const MovePair &pair) override;

    RenderGraph* renderGraph{nullptr};
    uint32_t passID{RenderGraph::null_vertex()};
};

class NativeCopyPassBuilder final : public CopyPassBuilder {
public:
    NativeCopyPassBuilder() = default;
    NativeCopyPassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn) noexcept
    : renderGraph(renderGraphIn),
      passID(passIDIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void addPair(const CopyPair &pair) override;

    RenderGraph* renderGraph{nullptr};
    uint32_t passID{RenderGraph::null_vertex()};
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
    const ccstd::vector<int32_t> &getBlockSizes(uint32_t phaseID, const ccstd::string &programName) const override;
    const Record<ccstd::string, uint32_t> &getHandleMap(uint32_t phaseID, const ccstd::string &programName) const override;
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

    void beginSetup() override;
    void endSetup() override;
    bool containsResource(const ccstd::string &name) const override;
    uint32_t addRenderTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) override;
    uint32_t addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    uint32_t addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    void updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) override;
    void updateRenderTarget(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) override;
    void updateDepthStencil(const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) override;
    void beginFrame() override;
    void endFrame() override;
    RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) override;
    ComputePassBuilder *addComputePass(const ccstd::string &layoutName) override;
    MovePassBuilder *addMovePass() override;
    CopyPassBuilder *addCopyPass() override;
    void presentAll() override;
    SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) override;
    gfx::DescriptorSetLayout *getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) override;

    void executeRenderGraph(const RenderGraph& rg);
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
};

class NativeProgramProxy final : public ProgramProxy {
public:
    NativeProgramProxy() = default;
    NativeProgramProxy(IntrusivePtr<gfx::Shader> shaderIn) // NOLINT
    : shader(std::move(shaderIn)) {}

    const ccstd::string &getName() const noexcept override;
    gfx::Shader *getShader() const noexcept override;

    IntrusivePtr<gfx::Shader> shader;
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

class NativeSetter final : public Setter {
public:
    NativeSetter(const LayoutGraphData& layoutGraphIn, RenderData& renderDataIn) noexcept
    : layoutGraph(layoutGraphIn),
      renderData(renderDataIn) {}

    ccstd::string getName() const override;
    void setName(const ccstd::string &name) override;

    void setMat4(const ccstd::string &name, const Mat4 &mat) override;
    void setQuaternion(const ccstd::string &name, const Quaternion &quat) override;
    void setColor(const ccstd::string &name, const gfx::Color &color) override;
    void setVec4(const ccstd::string &name, const Vec4 &vec) override;
    void setVec2(const ccstd::string &name, const Vec2 &vec) override;
    void setFloat(const ccstd::string &name, float v) override;
    void setBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setReadWriteBuffer(const ccstd::string &name, gfx::Buffer *buffer) override;
    void setReadWriteTexture(const ccstd::string &name, gfx::Texture *texture) override;
    void setSampler(const ccstd::string &name, gfx::Sampler *sampler) override;

    void setVec4ArraySize(const ccstd::string& name, uint32_t sz);
    void setVec4ArrayElem(const ccstd::string& name, const cc::Vec4& vec, uint32_t id);

    void setMat4ArraySize(const ccstd::string& name, uint32_t sz);
    void setMat4ArrayElem(const ccstd::string& name, const cc::Mat4& mat, uint32_t id);

    const LayoutGraphData& layoutGraph;
    RenderData& renderData;
};

} // namespace render

} // namespace cc

// clang-format on
