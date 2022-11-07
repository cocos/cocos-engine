/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include "cocos/base/Ptr.h"
#include "cocos/base/std/container/string.h"
#include "cocos/renderer/gfx-base/GFXFramebuffer.h"
#include "cocos/renderer/gfx-base/GFXRenderPass.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace render {

class NativeLayoutGraphBuilder final : public LayoutGraphBuilder {
public:
    NativeLayoutGraphBuilder() = default;
    NativeLayoutGraphBuilder(gfx::Device* deviceIn, LayoutGraphData* dataIn) noexcept
    : device(deviceIn),
      data(dataIn) {}

    void clear() override;
    uint32_t addRenderStage(const ccstd::string &name) override;
    uint32_t addRenderPhase(const ccstd::string &name, uint32_t parentID) override;
    void addShader(const ccstd::string &name, uint32_t parentPhaseID) override;
    void addDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex &index, const DescriptorBlockFlattened &block) override;
    void addUniformBlock(uint32_t nodeID, const DescriptorBlockIndex &index, const ccstd::string &name, const gfx::UniformBlock &uniformBlock) override;
    void reserveDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex &index, const DescriptorBlockFlattened &block) override;
    int compile() override;
    ccstd::string print() const override;

    gfx::Device* device{nullptr};
    LayoutGraphData* data{nullptr};
};

class NativeRasterQueueBuilder final : public RasterQueueBuilder {
public:
    NativeRasterQueueBuilder() = default;
    NativeRasterQueueBuilder(RenderGraph* renderGraphIn, uint32_t queueIDIn, const LayoutGraphData* layoutGraphIn) noexcept
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

    void addSceneOfCamera(scene::Camera *camera, LightInfo light, SceneFlags sceneFlags) override;
    void addScene(const ccstd::string &name, SceneFlags sceneFlags) override;
    void addFullscreenQuad(Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void addCameraQuad(scene::Camera *camera, Material *material, uint32_t passID, SceneFlags sceneFlags) override;
    void clearRenderTarget(const ccstd::string &name, const gfx::Color &color) override;
    void setViewport(const gfx::Viewport &viewport) override;

    RenderGraph* renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t queueID{RenderGraph::null_vertex()};
};

class NativeRasterPassBuilder final : public RasterPassBuilder {
public:
    NativeRasterPassBuilder() = default;
    NativeRasterPassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
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

    void addRasterView(const ccstd::string &name, const RasterView &view) override;
    void addComputeView(const ccstd::string &name, const ComputeView &view) override;
    RasterQueueBuilder *addQueue(QueueHint hint) override;
    void setViewport(const gfx::Viewport &viewport) override;

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

struct PersistentRenderPassAndFramebuffer {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {clearColors.get_allocator().resource()};
    }

    PersistentRenderPassAndFramebuffer(const allocator_type& alloc) noexcept; // NOLINT
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer&& rhs, const allocator_type& alloc);
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer const& rhs, const allocator_type& alloc);

    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer&& rhs) noexcept = default;
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer const& rhs) = delete;
    PersistentRenderPassAndFramebuffer& operator=(PersistentRenderPassAndFramebuffer&& rhs) = default;
    PersistentRenderPassAndFramebuffer& operator=(PersistentRenderPassAndFramebuffer const& rhs) = default;

    IntrusivePtr<gfx::RenderPass> renderPass;
    IntrusivePtr<gfx::Framebuffer> framebuffer;
    ccstd::pmr::vector<gfx::Color> clearColors;
    float clearDepth{0};
    uint8_t clearStencil{0};
    int32_t refCount{1};
};

struct ScenePassHandle {
    const scene::Pass* handle{nullptr};
};

inline bool operator<(const ScenePassHandle& lhs, const ScenePassHandle& rhs) noexcept {
    return std::forward_as_tuple(lhs.handle) <
           std::forward_as_tuple(rhs.handle);
}

struct ScenePass {
    uint32_t priority{0};
    float depth{0};
    uint32_t haderID{0};
    uint32_t assIndex{0};
    const scene::SubModel* subModel{nullptr};
};

struct ScenePassQueue {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {queue.get_allocator().resource()};
    }

    ScenePassQueue(const allocator_type& alloc) noexcept; // NOLINT
    ScenePassQueue(ScenePassQueue&& rhs) = delete;
    ScenePassQueue(ScenePassQueue const& rhs) = delete;
    ScenePassQueue& operator=(ScenePassQueue&& rhs) = delete;
    ScenePassQueue& operator=(ScenePassQueue const& rhs) = delete;

    ccstd::pmr::vector<ScenePass> queue;
};

struct alignas(64) RenderInstance {
    uint32_t count{0};
    uint32_t capacity{0};
    gfx::Buffer* vertexBuffer{nullptr};
    uint8_t* data{nullptr};
    gfx::InputAssembler* inputAssembler{nullptr};
    uint32_t stride{0};
    uint32_t bufferOffset{0};
    gfx::Shader* shader{nullptr};
    gfx::DescriptorSet* descriptorSet{nullptr};
    gfx::Texture* lightmap{nullptr};
};

struct RenderInstancePack {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {instances.get_allocator().resource()};
    }

    RenderInstancePack(const allocator_type& alloc) noexcept; // NOLINT
    RenderInstancePack(RenderInstancePack&& rhs, const allocator_type& alloc);

    RenderInstancePack(RenderInstancePack&& rhs) noexcept = default;
    RenderInstancePack(RenderInstancePack const& rhs) = delete;
    RenderInstancePack& operator=(RenderInstancePack&& rhs) = default;
    RenderInstancePack& operator=(RenderInstancePack const& rhs) = delete;

    ccstd::pmr::vector<RenderInstance> instances;
};

struct RenderBatch {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertexBuffers.get_allocator().resource()};
    }

    RenderBatch(const allocator_type& alloc) noexcept; // NOLINT
    RenderBatch(RenderBatch&& rhs, const allocator_type& alloc);

    RenderBatch(RenderBatch&& rhs) noexcept = default;
    RenderBatch(RenderBatch const& rhs) = delete;
    RenderBatch& operator=(RenderBatch&& rhs) = default;
    RenderBatch& operator=(RenderBatch const& rhs) = delete;

    ccstd::pmr::vector<gfx::Buffer*> vertexBuffers;
    ccstd::pmr::vector<uint8_t*> vertexBufferData;
    gfx::Buffer* indexBuffer{nullptr};
    float* indexBufferData{nullptr};
    uint32_t vertexBufferCount{0};
    uint32_t mergeCount{0};
    gfx::InputAssembler* inputAssembler{nullptr};
    ccstd::pmr::vector<uint8_t> uniformBufferData;
    gfx::Buffer* uniformBuffer{nullptr};
    gfx::DescriptorSet* descriptorSet{nullptr};
    const scene::Pass* scenePass{nullptr};
    gfx::Shader* shader{nullptr};
};

struct RenderBatchPack {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {batches.get_allocator().resource()};
    }

    RenderBatchPack(const allocator_type& alloc) noexcept; // NOLINT
    RenderBatchPack(RenderBatchPack&& rhs, const allocator_type& alloc);

    RenderBatchPack(RenderBatchPack&& rhs) noexcept = default;
    RenderBatchPack(RenderBatchPack const& rhs) = delete;
    RenderBatchPack& operator=(RenderBatchPack&& rhs) = default;
    RenderBatchPack& operator=(RenderBatchPack const& rhs) = delete;

    ccstd::pmr::vector<PmrUniquePtr<RenderBatch>> batches;
    ccstd::pmr::vector<uint32_t> bufferOffset;
};

struct NativeRenderQueue {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {scenePassQueue.get_allocator().resource()};
    }

    NativeRenderQueue(const allocator_type& alloc) noexcept; // NOLINT
    NativeRenderQueue(NativeRenderQueue&& rhs, const allocator_type& alloc);

    NativeRenderQueue(NativeRenderQueue&& rhs) noexcept = default;
    NativeRenderQueue(NativeRenderQueue const& rhs) = delete;
    NativeRenderQueue& operator=(NativeRenderQueue&& rhs) = default;
    NativeRenderQueue& operator=(NativeRenderQueue const& rhs) = delete;

    ccstd::pmr::vector<ScenePass> scenePassQueue;
    ccstd::pmr::vector<RenderBatchPack> batchingQueue;
    ccstd::pmr::vector<uint32_t> instancingQueue;
    PmrFlatMap<ScenePassHandle, PmrUniquePtr<RenderInstancePack>> instancePacks;
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

struct NativeRenderContext {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {renderPasses.get_allocator().resource()};
    }

    NativeRenderContext(const allocator_type& alloc) noexcept; // NOLINT
    NativeRenderContext(NativeRenderContext&& rhs) = delete;
    NativeRenderContext(NativeRenderContext const& rhs) = delete;
    NativeRenderContext& operator=(NativeRenderContext&& rhs) = delete;
    NativeRenderContext& operator=(NativeRenderContext const& rhs) = delete;

    ccstd::pmr::unordered_map<RasterPass, PersistentRenderPassAndFramebuffer> renderPasses;
    ccstd::pmr::vector<PmrUniquePtr<NativeRenderQueue>> freeRenderQueues;
    ccstd::pmr::vector<PmrUniquePtr<RenderInstancePack>> freeInstancePacks;
};

class NativePipeline final : public Pipeline {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {nativeContext.get_allocator().resource()};
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
    void beginFrame() override;
    void endFrame() override;
    RasterPassBuilder *addRasterPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) override;
    ComputePassBuilder *addComputePass(const ccstd::string &layoutName) override;
    MovePassBuilder *addMovePass() override;
    CopyPassBuilder *addCopyPass() override;
    void presentAll() override;
    SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) override;
    LayoutGraphBuilder *getLayoutGraphBuilder() override;
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
    scene::Model* profiler{nullptr};
    LightingMode lightingMode{LightingMode::DEFAULT};
    IntrusivePtr<pipeline::PipelineSceneData> pipelineSceneData;
    NativeRenderContext nativeContext;
    LayoutGraphData layoutGraph;
    ResourceGraph resourceGraph;
    RenderGraph renderGraph;
};

} // namespace render

} // namespace cc

// clang-format on
