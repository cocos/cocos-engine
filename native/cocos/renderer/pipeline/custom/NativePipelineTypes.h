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
#include "cocos/renderer/frame-graph/FrameGraph.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/RenderCompilerTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace render {

class NativeLayoutGraphBuilder final : public LayoutGraphBuilder {
public:
    NativeLayoutGraphBuilder() = default;
    NativeLayoutGraphBuilder(gfx::Device* deviceIn, LayoutGraphData* dataIn) noexcept
    : device(deviceIn),
      data(dataIn) {}

    uint32_t addRenderStage(const ccstd::string& name) override;
    uint32_t addRenderPhase(const ccstd::string& name, uint32_t parentID) override;
    void addDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const DescriptorBlock& block) override;
    void reserveDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const DescriptorBlock& block) override;
    int compile() override;

    ccstd::string print() const override;

    gfx::Device*     device{nullptr};
    LayoutGraphData* data{nullptr};
};

class NativeRasterQueueBuilder final : public RasterQueueBuilder {
public:
    NativeRasterQueueBuilder() = default;
    NativeRasterQueueBuilder(RenderGraph* renderGraphIn, uint32_t queueIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      queueID(queueIDIn),
      layoutID(layoutIDIn) {}

    void addSceneOfCamera(scene::Camera* camera, const ccstd::string& name) override;
    void addSceneOfCamera(scene::Camera* camera) override;
    void addScene(const ccstd::string& name) override;
    void addFullscreenQuad(const ccstd::string& shader, const ccstd::string& name) override;
    void addFullscreenQuad(const ccstd::string& shader) override;

    void setMat4(const ccstd::string& name, const cc::Mat4& mat) override;
    void setQuaternion(const ccstd::string& name, const cc::Quaternion& quat) override;
    void setColor(const ccstd::string& name, const gfx::Color& color) override;
    void setVec4(const ccstd::string& name, const cc::Vec4& vec) override;
    void setVec2(const ccstd::string& name, const cc::Vec2& vec) override;
    void setFloat(const ccstd::string& name, float v) override;

    void setBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setReadWriteBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setReadWriteTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setSampler(const ccstd::string& name, gfx::Sampler* sampler) override;

    RenderGraph*           renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t               queueID{RenderGraph::null_vertex()};
    uint32_t               layoutID{LayoutGraphData::null_vertex()};
};

class NativeRasterPassBuilder final : public RasterPassBuilder {
public:
    NativeRasterPassBuilder() = default;
    NativeRasterPassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      passID(passIDIn),
      layoutID(layoutIDIn) {}

    void                addRasterView(const ccstd::string& name, const RasterView& view) override;
    void                addComputeView(const ccstd::string& name, const ComputeView& view) override;
    RasterQueueBuilder *addQueue(QueueHint hint, const ccstd::string& layoutName, const ccstd::string& name) override;
    RasterQueueBuilder *addQueue(QueueHint hint, const ccstd::string& layoutName) override;
    RasterQueueBuilder *addQueue(QueueHint hint) override;
    void                addFullscreenQuad(const ccstd::string& shader, const ccstd::string& layoutName, const ccstd::string& name) override;
    void                addFullscreenQuad(const ccstd::string& shader, const ccstd::string& layoutName) override;
    void                addFullscreenQuad(const ccstd::string& shader) override;

    void setMat4(const ccstd::string& name, const cc::Mat4& mat) override;
    void setQuaternion(const ccstd::string& name, const cc::Quaternion& quat) override;
    void setColor(const ccstd::string& name, const gfx::Color& color) override;
    void setVec4(const ccstd::string& name, const cc::Vec4& vec) override;
    void setVec2(const ccstd::string& name, const cc::Vec2& vec) override;
    void setFloat(const ccstd::string& name, float v) override;

    void setBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setReadWriteBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setReadWriteTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setSampler(const ccstd::string& name, gfx::Sampler* sampler) override;

    RenderGraph*           renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t               passID{RenderGraph::null_vertex()};
    uint32_t               layoutID{LayoutGraphData::null_vertex()};
};

class NativeComputeQueueBuilder final : public ComputeQueueBuilder {
public:
    NativeComputeQueueBuilder() = default;
    NativeComputeQueueBuilder(RenderGraph* renderGraphIn, uint32_t queueIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      queueID(queueIDIn),
      layoutID(layoutIDIn) {}

    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& layoutName, const ccstd::string& name) override;
    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& layoutName) override;
    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) override;

    void setMat4(const ccstd::string& name, const cc::Mat4& mat) override;
    void setQuaternion(const ccstd::string& name, const cc::Quaternion& quat) override;
    void setColor(const ccstd::string& name, const gfx::Color& color) override;
    void setVec4(const ccstd::string& name, const cc::Vec4& vec) override;
    void setVec2(const ccstd::string& name, const cc::Vec2& vec) override;
    void setFloat(const ccstd::string& name, float v) override;

    void setBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setReadWriteBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setReadWriteTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setSampler(const ccstd::string& name, gfx::Sampler* sampler) override;

    RenderGraph*           renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t               queueID{RenderGraph::null_vertex()};
    uint32_t               layoutID{LayoutGraphData::null_vertex()};
};

class NativeComputePassBuilder final : public ComputePassBuilder {
public:
    NativeComputePassBuilder() = default;
    NativeComputePassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn, const LayoutGraphData* layoutGraphIn, uint32_t layoutIDIn) noexcept // NOLINT
    : renderGraph(renderGraphIn),
      layoutGraph(layoutGraphIn),
      passID(passIDIn),
      layoutID(layoutIDIn) {}

    void addComputeView(const ccstd::string& name, const ComputeView& view) override;

    ComputeQueueBuilder *addQueue(const ccstd::string& layoutName, const ccstd::string& name) override;
    ComputeQueueBuilder *addQueue(const ccstd::string& layoutName) override;
    ComputeQueueBuilder *addQueue() override;

    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& layoutName, const ccstd::string& name) override;
    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ, const ccstd::string& layoutName) override;
    void addDispatch(const ccstd::string& shader, uint32_t threadGroupCountX, uint32_t threadGroupCountY, uint32_t threadGroupCountZ) override;

    void setMat4(const ccstd::string& name, const cc::Mat4& mat) override;
    void setQuaternion(const ccstd::string& name, const cc::Quaternion& quat) override;
    void setColor(const ccstd::string& name, const gfx::Color& color) override;
    void setVec4(const ccstd::string& name, const cc::Vec4& vec) override;
    void setVec2(const ccstd::string& name, const cc::Vec2& vec) override;
    void setFloat(const ccstd::string& name, float v) override;

    void setBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setReadWriteBuffer(const ccstd::string& name, gfx::Buffer* buffer) override;
    void setReadWriteTexture(const ccstd::string& name, gfx::Texture* texture) override;
    void setSampler(const ccstd::string& name, gfx::Sampler* sampler) override;

    RenderGraph*           renderGraph{nullptr};
    const LayoutGraphData* layoutGraph{nullptr};
    uint32_t               passID{RenderGraph::null_vertex()};
    uint32_t               layoutID{LayoutGraphData::null_vertex()};
};

class NativeMovePassBuilder final : public MovePassBuilder {
public:
    NativeMovePassBuilder() = default;
    NativeMovePassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn) noexcept
    : renderGraph(renderGraphIn),
      passID(passIDIn) {}

    void addPair(const MovePair& pair) override;

    RenderGraph* renderGraph{nullptr};
    uint32_t     passID{RenderGraph::null_vertex()};
};

class NativeCopyPassBuilder final : public CopyPassBuilder {
public:
    NativeCopyPassBuilder() = default;
    NativeCopyPassBuilder(RenderGraph* renderGraphIn, uint32_t passIDIn) noexcept
    : renderGraph(renderGraphIn),
      passID(passIDIn) {}

    void addPair(const CopyPair& pair) override;

    RenderGraph* renderGraph{nullptr};
    uint32_t     passID{RenderGraph::null_vertex()};
};

class NativeSceneTransversal final : public SceneTransversal {
public:
    NativeSceneTransversal() = default;
    NativeSceneTransversal(const scene::Camera* cameraIn, const scene::RenderScene* sceneIn) noexcept
    : camera(cameraIn),
      scene(sceneIn) {}

    SceneTask* transverse(SceneVisitor *visitor) const override;

    const scene::Camera*      camera{nullptr};
    const scene::RenderScene* scene{nullptr};
};

class NativePipeline final : public Pipeline {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {layoutGraphs.get_allocator().resource()};
    }

    NativePipeline(const allocator_type& alloc) noexcept; // NOLINT

    uint32_t            addRenderTexture(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow* renderWindow) override;
    uint32_t            addRenderTarget(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    uint32_t            addDepthStencil(const ccstd::string& name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) override;
    void                beginFrame() override;
    void                endFrame() override;
    RasterPassBuilder  *addRasterPass(uint32_t width, uint32_t height, const ccstd::string& layoutName, const ccstd::string& name) override;
    RasterPassBuilder  *addRasterPass(uint32_t width, uint32_t height, const ccstd::string& layoutName) override;
    ComputePassBuilder *addComputePass(const ccstd::string& layoutName, const ccstd::string& name) override;
    ComputePassBuilder *addComputePass(const ccstd::string& layoutName) override;
    MovePassBuilder    *addMovePass(const ccstd::string& name) override;
    CopyPassBuilder    *addCopyPass(const ccstd::string& name) override;
    void                presentAll() override;

    SceneTransversal *createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) override;
    LayoutGraphBuilder *createLayoutGraph(const ccstd::string& name) override;

    bool activate(gfx::Swapchain * swapchain) override;
    bool destroy() noexcept override;
    void render(const ccstd::vector<scene::Camera*>& cameras) override;

    const MacroRecord           &getMacros() const override;
    pipeline::GlobalDSManager   *getGlobalDSManager() const override;
    gfx::DescriptorSetLayout    *getDescriptorSetLayout() const override;
    pipeline::PipelineSceneData *getPipelineSceneData() const override;
    const ccstd::string         &getConstantMacros() const override;
    scene::Model                *getProfiler() const override;
    void                         setProfiler(scene::Model *profiler) override;

    float getShadingScale() const override;
    void  setShadingScale(float scale) override;

    void onGlobalPipelineStateChanged() override;

    void setValue(const ccstd::string& name, int32_t value) override;
    void setValue(const ccstd::string& name, bool value) override;

    bool isOcclusionQueryEnabled() const override;

    gfx::Device*                                           device{nullptr};
    gfx::Swapchain*                                        swapchain{nullptr};
    MacroRecord                                            macros;
    ccstd::string                                          constantMacros;
    std::unique_ptr<pipeline::GlobalDSManager>             globalDSManager;
    scene::Model*                                          profiler{nullptr};
    PmrTransparentMap<ccstd::pmr::string, LayoutGraphData> layoutGraphs;
    IntrusivePtr<pipeline::PipelineSceneData>              pipelineSceneData;
    const LayoutGraphData*                                 layoutGraph{nullptr};
    framegraph::FrameGraph                                 frameGraph;
    ResourceGraph                                          resourceGraph;
    RenderGraph                                            renderGraph;
};

} // namespace render

} // namespace cc

// clang-format on
