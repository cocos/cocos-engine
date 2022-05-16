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
#include "cocos/renderer/pipeline/custom/NativePipelineFwd.h"
#include "cocos/renderer/pipeline/custom/RenderCompilerTypes.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceTypes.h"

namespace cc {

namespace render {

class NativeLayoutGraphBuilder final : public LayoutGraphBuilder {
public:
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {data.get_allocator().resource()};
    }

    NativeLayoutGraphBuilder(const allocator_type& alloc) noexcept; // NOLINT

    uint32_t addNode(const ccstd::string& name, UpdateFrequency frequency, uint32_t parentID) override;
    void addDescriptorBlock(uint32_t nodeID, const DescriptorBlockIndex& index, const DescriptorBlock& block) override;

    LayoutGraphData data;
};

class NativePipeline final : public Pipeline {
public:
    NativePipeline() noexcept;

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

    gfx::Device*                               device{nullptr};
    gfx::Swapchain*                            swapchain{nullptr};
    MacroRecord                                macros;
    ccstd::string                              constantMacros;
    std::unique_ptr<pipeline::GlobalDSManager> globalDSManager;
    scene::Model*                              profiler{nullptr};
    IntrusivePtr<pipeline::PipelineSceneData>  pipelineSceneData;
    framegraph::FrameGraph                     frameGraph;
};

} // namespace render

} // namespace cc

// clang-format on
