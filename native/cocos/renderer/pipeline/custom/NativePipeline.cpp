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

#include <boost/utility/string_view_fwd.hpp>
#include <memory>
#include <sstream>
#include <stdexcept>
#include <tuple>
#include <type_traits>
#include <utility>
#include "LayoutGraphFwd.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphNames.h"
#include "LayoutGraphTypes.h"
#include "NativePipelineFwd.h"
#include "NativePipelineTypes.h"
#include "RenderCommonTypes.h"
#include "RenderGraphGraphs.h"
#include "RenderGraphTypes.h"
#include "RenderInterfaceFwd.h"
#include "RenderInterfaceTypes.h"
#include "RenderingModule.h"
#include "cocos/application/ApplicationManager.h"
#include "cocos/base/Macros.h"
#include "cocos/base/Ptr.h"
#include "cocos/base/StringUtil.h"
#include "cocos/base/std/container/string.h"
#include "cocos/core/Root.h"
#include "cocos/math/Mat4.h"
#include "cocos/renderer/gfx-base/GFXBuffer.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXDescriptorSetLayout.h"
#include "cocos/renderer/gfx-base/GFXDevice.h"
#include "cocos/renderer/gfx-base/GFXSwapchain.h"
#include "cocos/renderer/gfx-base/states/GFXSampler.h"
#include "cocos/renderer/pipeline/Enum.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/RenderWindow.h"
#include "details/DebugUtils.h"
#include "details/GslUtils.h"
#include "pipeline/custom/LayoutGraphUtils.h"

#if CC_USE_DEBUG_RENDERER
    #include "profiler/DebugRenderer.h"
#endif

namespace cc {

namespace render {

SceneTask *NativeSceneTransversal::transverse(SceneVisitor *visitor) const {
    std::ignore = visitor;
    return nullptr;
}

NativePipeline::NativePipeline(const allocator_type &alloc) noexcept
: device(gfx::Device::getInstance()),
  globalDSManager(std::make_unique<pipeline::GlobalDSManager>()),
  programLibrary(dynamic_cast<NativeProgramLibrary *>(getProgramLibrary())),
  pipelineSceneData(ccnew pipeline::PipelineSceneData()), // NOLINT
  nativeContext(std::make_unique<gfx::DefaultResource>(device), alloc),
  dummyLayoutGraph(alloc),
  resourceGraph(alloc),
  renderGraph(alloc),
  name(alloc) {}

gfx::Device *NativePipeline::getDevice() const {
    return device;
}

void NativePipeline::beginSetup() {
    renderGraph = RenderGraph(get_allocator());
}

void NativePipeline::endSetup() {
}

bool NativePipeline::containsResource(const ccstd::string &name) const {
    return contains(name.c_str(), resourceGraph);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    CC_EXPECTS(renderWindow);

    if (!renderWindow->getSwapchain()) {
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().size() == 1);
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().at(0));
        return addVertex(
            FramebufferTag{},
            std::forward_as_tuple(name.c_str()),
            std::forward_as_tuple(desc),
            std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
            std::forward_as_tuple(),
            std::forward_as_tuple(),
            std::forward_as_tuple(IntrusivePtr<gfx::Framebuffer>(renderWindow->getFramebuffer())),
            resourceGraph);
    }

    CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().size() == 1);
    CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().at(0));
    return addVertex(
        SwapchainTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{ResourceResidency::BACKBUFFER}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(RenderSwapchain{renderWindow->getSwapchain()}),
        resourceGraph);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addRenderTarget(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    return addVertex(
        ManagedTextureTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        resourceGraph);
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addDepthStencil(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::ONE;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::DEPTH_STENCIL_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED;

    CC_EXPECTS(residency == ResourceResidency::MANAGED || residency == ResourceResidency::MEMORYLESS);

    gfx::SamplerInfo samplerInfo{};
    samplerInfo.magFilter = gfx::Filter::POINT;
    samplerInfo.minFilter = gfx::Filter::POINT;
    samplerInfo.mipFilter = gfx::Filter::NONE;
    return addVertex(
        ManagedTextureTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(samplerInfo),
        std::forward_as_tuple(),
        resourceGraph);
}

void NativePipeline::updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) {
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::Desc, resourceGraph, resID);
    visitObject(
        resID, resourceGraph,
        [&](IntrusivePtr<gfx::Framebuffer> &fb) {
            CC_EXPECTS(!renderWindow->getSwapchain());
            desc.width = renderWindow->getWidth();
            desc.height = renderWindow->getHeight();
            fb = renderWindow->getFramebuffer();
        },
        [&](RenderSwapchain &sc) {
            CC_EXPECTS(renderWindow->getSwapchain());
            desc.width = renderWindow->getSwapchain()->getWidth();
            desc.height = renderWindow->getSwapchain()->getHeight();
            sc.swapchain = renderWindow->getSwapchain();
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::updateRenderTarget(
    const ccstd::string &name,
    uint32_t width, uint32_t height, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
}

void NativePipeline::updateDepthStencil(
    const ccstd::string &name,
    uint32_t width, uint32_t height, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::Desc, resourceGraph, resID);
    visitObject(
        resID, resourceGraph,
        [&](ManagedTexture &tex) {
            desc.width = width;
            desc.height = height;
        },
        [](const auto & /*res*/) {});

}

void NativePipeline::beginFrame() {
}

void NativePipeline::endFrame() {
}

namespace {

void updateRasterPassConstants(uint32_t width, uint32_t height, Setter &setter) {
    const auto &root = *Root::getInstance();
    const auto &shadingWidth = width;
    const auto &shadingHeight = height;
    setter.setVec4(
        "cc_time",
        Vec4(
            root.getCumulativeTime(),
            root.getFrameTime(),
            static_cast<float>(CC_CURRENT_ENGINE()->getTotalFrames()),
            0.0F));

    setter.setVec4(
        "cc_screenSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));
    setter.setVec4(
        "cc_nativeSize",
        Vec4(shadingWidth, shadingHeight, 1.0F / shadingWidth, 1.0F / shadingHeight));
    const auto *debugView = root.getDebugView();
    if (debugView) {
        setter.setVec4(
            "cc_debug_view_mode",
            Vec4(static_cast<float>(debugView->getSingleMode()),
                 debugView->isLightingWithAlbedo() ? 1.0F : 0.0F,
                 debugView->isCsmLayerColoration() ? 1.0F : 0.0F,
                 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = debugView->isCompositeModeEnabled(i) ? 1.0F : 0.0F;
            const auto packIdx = static_cast<uint32_t>(floor(i / 4.0F));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    } else {
        setter.setVec4("cc_debug_view_mode", Vec4(0.0F, 1.0F, 0.0F, 0.0F));
        Vec4 debugPackVec{};
        for (auto i = static_cast<uint32_t>(pipeline::DebugViewCompositeType::DIRECT_DIFFUSE);
             i < static_cast<uint32_t>(pipeline::DebugViewCompositeType::MAX_BIT_COUNT); ++i) {
            const auto idx = i % 4;
            (&debugPackVec.x)[idx] = 1.0F;
            const auto packIdx = static_cast<uint32_t>(floor(i / 4.0));
            if (idx == 3) {
                std::string name("cc_debug_view_composite_pack_");
                name.append(std::to_string(packIdx + 1));
                setter.setVec4(name, debugPackVec);
            }
        }
    }
}

} // namespace

RasterPassBuilder *NativePipeline::addRasterPass(
    uint32_t width, uint32_t height, // NOLINT(bugprone-easily-swappable-parameters)
    const ccstd::string &layoutName) {
    std::string_view name("Raster");
    RasterPass pass(renderGraph.get_allocator());
    pass.width = width;
    pass.height = height;
    pass.viewport.width = width;
    pass.viewport.height = height;

    auto passID = addVertex(
        RasterTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, programLibrary->layoutGraph);
    CC_EXPECTS(passLayoutID != LayoutGraphData::null_vertex());

    auto *builder = ccnew NativeRasterPassBuilder(this, &renderGraph, passID, &programLibrary->layoutGraph, passLayoutID);
    updateRasterPassConstants(width, height, *builder);

    return builder;
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &layoutName) {
    std::string_view name("Compute");
    auto passID = addVertex(
        ComputeTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, programLibrary->layoutGraph);

    return ccnew NativeComputePassBuilder(&renderGraph, passID, &programLibrary->layoutGraph, passLayoutID);
}

// NOLINTNEXTLINE
MovePassBuilder *NativePipeline::addMovePass() {
    std::string_view name("Move");
    auto passID = addVertex(
        MoveTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return ccnew NativeMovePassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
CopyPassBuilder *NativePipeline::addCopyPass() {
    std::string_view name("Copy");
    auto passID = addVertex(
        CopyTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return ccnew NativeCopyPassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
void NativePipeline::presentAll() {
    PresentPass present(renderGraph.get_allocator());

    for (const auto &rasterPass : renderGraph.rasterPasses) {
        for (const auto &[name, view] : rasterPass.rasterViews) {
            const auto &resourceID = findVertex(name, resourceGraph);
            const auto &traits = get(ResourceGraph::Traits, resourceGraph, resourceID);
            if (traits.residency == ResourceResidency::BACKBUFFER) {
                present.presents.emplace(
                    std::piecewise_construct,
                    std::forward_as_tuple(name),
                    std::forward_as_tuple());
            }
        }
    }
    auto passID = addVertex(
        PresentTag{},
        std::forward_as_tuple("Present"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(present)),
        renderGraph);
}

// NOLINTNEXTLINE
SceneTransversal *NativePipeline::createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) {
    return ccnew NativeSceneTransversal(camera, scene);
}

LayoutGraphBuilder *NativePipeline::getLayoutGraphBuilder() {
    return ccnew NativeLayoutGraphBuilder(device, &dummyLayoutGraph);
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) {
    const auto &lg = programLibrary->layoutGraph;
    auto iter = lg.shaderLayoutIndex.find(std::string_view{shaderName});
    if (iter != lg.shaderLayoutIndex.end()) {
        const auto &layouts = get(LayoutGraphData::Layout, lg, iter->second).descriptorSets;
        auto iter2 = layouts.find(freq);
        if (iter2 != layouts.end()) {
            return iter2->second.descriptorSetLayout.get();
        }
        return nullptr;
    }
    CC_EXPECTS(false);
    return nullptr;
}

gfx::DescriptorSet *NativePipeline::getDescriptorSet() const {
    return globalDSManager->getGlobalDescriptorSet();
}

const ccstd::vector<gfx::CommandBuffer *> &NativePipeline::getCommandBuffers() const {
    return _commandBuffers;
}

namespace {

void generateConstantMacros(
    gfx::Device *device,
    ccstd::string &constantMacros, bool clusterEnabled) {
    constantMacros = StringUtil::format(
        R"(
#define CC_DEVICE_SUPPORT_FLOAT_TEXTURE %d
#define CC_ENABLE_CLUSTERED_LIGHT_CULLING %d
#define CC_DEVICE_MAX_VERTEX_UNIFORM_VECTORS %d
#define CC_DEVICE_MAX_FRAGMENT_UNIFORM_VECTORS %d
#define CC_DEVICE_CAN_BENEFIT_FROM_INPUT_ATTACHMENT %d
#define CC_PLATFORM_ANDROID_AND_WEBGL 0
#define CC_ENABLE_WEBGL_HIGHP_STRUCT_VALUES 0
        )",
        hasAnyFlags(device->getFormatFeatures(gfx::Format::RGBA32F),
                    gfx::FormatFeature::RENDER_TARGET | gfx::FormatFeature::SAMPLED_TEXTURE),
        clusterEnabled ? 1 : 0,
        device->getCapabilities().maxVertexUniformVectors,
        device->getCapabilities().maxFragmentUniformVectors,
        device->hasFeature(gfx::Feature::INPUT_ATTACHMENT_BENEFIT));
}

void buildLayoutGraphNodeBuffer(
    gfx::Device *device,
    const DescriptorSetLayoutData &data,
    LayoutGraphNodeResource &node) {
    for (const auto &[nameID, uniformBlock] : data.uniformBlocks) {
        auto res = node.uniformBuffers.emplace(
            std::piecewise_construct,
            std::forward_as_tuple(nameID),
            std::forward_as_tuple());
        CC_ENSURES(res.second);
        auto &buffer = res.first->second;
        CC_EXPECTS(uniformBlock.count);
        const auto bufferSize =
            getUniformBlockSize(uniformBlock.members) * uniformBlock.count;

        CC_ENSURES(bufferSize);
        buffer.init(device, bufferSize);
    }
}

} // namespace

// NOLINTNEXTLINE
bool NativePipeline::activate(gfx::Swapchain *swapchainIn) {
    swapchain = swapchainIn;
    macros["CC_PIPELINE_TYPE"] = 0;
    globalDSManager->activate(device);
    pipelineSceneData->activate(device);
#if CC_USE_DEBUG_RENDERER
    DebugRenderer::getInstance()->activate(device);
#endif
    // generate macros here rather than construct func because _clusterEnabled
    // switch may be changed in root.ts setRenderPipeline() function which is after
    // pipeline construct.
    generateConstantMacros(device, constantMacros, false);

    _commandBuffers.resize(1, device->getCommandBuffer());

    // reserve layout graph resource
    const auto &lg = programLibrary->layoutGraph;
    const auto numNodes = num_vertices(lg);
    nativeContext.layoutGraphResources.reserve(numNodes);

    for (uint32_t i = 0; i != numNodes; ++i) {
        auto &node = nativeContext.layoutGraphResources.emplace_back();
        const auto &layout = get(LayoutGraphData::Layout, lg, i);
        if (holds<RenderStageTag>(i, lg)) {
            auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PASS);
            if (iter == layout.descriptorSets.end()) {
                continue;
            }
            const auto &set = iter->second;
            // reserve buffer
            buildLayoutGraphNodeBuffer(device, set.descriptorSetLayoutData, node);
            // reserve descriptor sets
            node.descriptorSetPool.init(device, set.descriptorSetLayout);
        } else {
            auto iter = layout.descriptorSets.find(UpdateFrequency::PER_PHASE);
            if (iter == layout.descriptorSets.end()) {
                continue;
            }
            const auto &set = iter->second;
            // reserve buffer
            buildLayoutGraphNodeBuffer(device, set.descriptorSetLayoutData, node);
            // reserve descriptor sets
            node.descriptorSetPool.init(device, set.descriptorSetLayout);
        }
    }
    return true;
}

bool NativePipeline::destroy() noexcept {
    if (globalDSManager) {
        globalDSManager->destroy();
        globalDSManager.reset();
    }
    if (pipelineSceneData) {
        pipelineSceneData->destroy();
        pipelineSceneData = {};
    }

    return true;
}

void NativePipeline::render(const ccstd::vector<scene::Camera *> &cameras) {
    std::ignore = cameras;
    const auto *sceneData = pipelineSceneData.get();
    auto *commandBuffer = device->getCommandBuffer();

    executeRenderGraph(renderGraph);
}

const MacroRecord &NativePipeline::getMacros() const {
    return macros;
}

pipeline::GlobalDSManager *NativePipeline::getGlobalDSManager() const {
    return globalDSManager.get();
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout() const {
    return globalDSManager->getDescriptorSetLayout();
}

pipeline::PipelineSceneData *NativePipeline::getPipelineSceneData() const {
    return pipelineSceneData;
}

const ccstd::string &NativePipeline::getConstantMacros() const {
    return constantMacros;
}

scene::Model *NativePipeline::getProfiler() const {
    return profiler;
}

// NOLINTNEXTLINE
void NativePipeline::setProfiler(scene::Model *profilerIn) {
    profiler = profilerIn;
}

pipeline::GeometryRenderer *NativePipeline::getGeometryRenderer() const {
    return nullptr;
}

float NativePipeline::getShadingScale() const {
    return pipelineSceneData->getShadingScale();
}

void NativePipeline::setShadingScale(float scale) {
    pipelineSceneData->setShadingScale(scale);
}

const ccstd::string &NativePipeline::getMacroString(const ccstd::string &name) const {
    static const ccstd::string EMPTY_STRING;
    auto iter = macros.find(name);
    if (iter == macros.end()) {
        return EMPTY_STRING;
    }
    return ccstd::get<ccstd::string>(iter->second);
}

int32_t NativePipeline::getMacroInt(const ccstd::string &name) const {
    auto iter = macros.find(name);
    if (iter == macros.end()) {
        return 0;
    }
    return ccstd::get<int32_t>(iter->second);
}

bool NativePipeline::getMacroBool(const ccstd::string &name) const {
    auto iter = macros.find(name);
    if (iter == macros.end()) {
        return false;
    }
    return ccstd::get<bool>(iter->second);
}

void NativePipeline::setMacroString(const ccstd::string &name, const ccstd::string &value) {
    macros[name] = value;
}

void NativePipeline::setMacroInt(const ccstd::string &name, int32_t value) {
    macros[name] = value;
}

void NativePipeline::setMacroBool(const ccstd::string &name, bool value) {
    macros[name] = value;
}

void NativePipeline::onGlobalPipelineStateChanged() {
    pipelineSceneData->updatePipelineSceneData();
}

void NativePipeline::setValue(const ccstd::string &name, int32_t value) {
    macros[name] = value;
}

void NativePipeline::setValue(const ccstd::string &name, bool value) {
    macros[name] = value;
}

bool NativePipeline::isOcclusionQueryEnabled() const {
    return false;
}

void NativePipeline::resetRenderQueue(bool reset) {
    // noop
}

bool NativePipeline::isRenderQueueReset() const {
    return true;
}

} // namespace render

} // namespace cc
