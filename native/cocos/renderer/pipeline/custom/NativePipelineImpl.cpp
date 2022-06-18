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

#include <memory>
#include <sstream>
#include <stdexcept>
#include <tuple>
#include <type_traits>
#include <utility>
#include "LayoutGraphGraphs.h"
#include "NativePipelineTypes.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "boost/utility/string_view_fwd.hpp"
#include "cocos/base/StringUtil.h"
#include "cocos/renderer/gfx-base/GFXDescriptorSetLayout.h"
#include "cocos/renderer/pipeline/Enum.h"
#include "cocos/renderer/pipeline/GlobalDescriptorSetManager.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/RenderPipeline.h"
#include "cocos/renderer/pipeline/custom/DebugUtils.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphNames.h"
#include "cocos/renderer/pipeline/custom/Pmr.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/RenderInterfaceFwd.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/RenderWindow.h"
#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/GFXSwapchain.h"
#include "gfx-base/states/GFXSampler.h"
#include "math/Mat4.h"
#include "pipeline/custom/LayoutGraphFwd.h"
#include "pipeline/custom/LayoutGraphTypes.h"
#include "pipeline/custom/NativePipelineFwd.h"
#include "pipeline/custom/Range.h"
#include "pipeline/custom/RenderGraphTypes.h"
#include "pipeline/custom/RenderInterfaceTypes.h"
#include "profiler/DebugRenderer.h"

namespace cc {

namespace render {

SceneTask *NativeSceneTransversal::transverse(SceneVisitor *visitor) const {
    std::ignore = visitor;
    return nullptr;
}

NativePipeline::NativePipeline(const allocator_type &alloc) noexcept
: device(gfx::Device::getInstance()),
  globalDSManager(std::make_unique<pipeline::GlobalDSManager>()),
  layoutGraph(alloc),
  pipelineSceneData(ccnew pipeline::PipelineSceneData()), // NOLINT
  resourceGraph(alloc),
  renderGraph(alloc) {}

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
        ManagedTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
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

    CC_EXPECTS(residency == ResourceResidency::MANAGED && residency == ResourceResidency::MEMORYLESS);

    return addVertex(
        ManagedTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        resourceGraph);
}

void NativePipeline::beginFrame() {
    renderGraph = RenderGraph(get_allocator());
}

void NativePipeline::endFrame() {
}

RasterPassBuilder *NativePipeline::addRasterPass(
    uint32_t width, uint32_t height, // NOLINT(bugprone-easily-swappable-parameters)
    const ccstd::string &layoutName, const ccstd::string &name) {
    RasterPass pass(renderGraph.get_allocator());
    pass.width = width;
    pass.height = height;

    auto passID = addVertex(
        RasterTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, layoutGraph);
    CC_EXPECTS(passLayoutID);

    return ccnew NativeRasterPassBuilder(&renderGraph, passID, &layoutGraph, passLayoutID);
}

// NOLINTNEXTLINE
RasterPassBuilder *NativePipeline::addRasterPass(uint32_t width, uint32_t height, const ccstd::string &layoutName) {
    return addRasterPass(width, height, layoutName, "Raster");
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &layoutName, const ccstd::string &name) {
    auto passID = addVertex(
        ComputeTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(layoutName.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), layoutName, layoutGraph);

    return ccnew NativeComputePassBuilder(&renderGraph, passID, &layoutGraph, passLayoutID);
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &layoutName) {
    return addComputePass(layoutName, "Compute");
}

// NOLINTNEXTLINE
MovePassBuilder *NativePipeline::addMovePass(const ccstd::string &name) {
    auto passID = addVertex(
        MoveTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return ccnew NativeMovePassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
CopyPassBuilder *NativePipeline::addCopyPass(const ccstd::string &name) {
    auto passID = addVertex(
        CopyTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    return ccnew NativeCopyPassBuilder(&renderGraph, passID);
}

// NOLINTNEXTLINE
void NativePipeline::presentAll() {
    auto passID = addVertex(
        PresentTag{},
        std::forward_as_tuple("Present"),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);
}

// NOLINTNEXTLINE
SceneTransversal *NativePipeline::createSceneTransversal(const scene::Camera *camera, const scene::RenderScene *scene) {
    return ccnew NativeSceneTransversal(camera, scene);
}

LayoutGraphBuilder *NativePipeline::getLayoutGraphBuilder() {
    return ccnew NativeLayoutGraphBuilder(device, &layoutGraph);
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout(const ccstd::string& shaderName, UpdateFrequency freq) {
    auto iter = layoutGraph.shaderLayoutIndex.find(boost::string_view(shaderName));
    if (iter != layoutGraph.shaderLayoutIndex.end()) {
        const auto& layouts = get(LayoutGraphData::Layout, layoutGraph, iter->second).descriptorSets;
        auto iter2 = layouts.find(freq);
        if (iter2 != layouts.end()) {
            return iter2->second.descriptorSetLayout.get();
        }
        return nullptr;
    }
    CC_EXPECTS(false);
    return nullptr;
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

} // namespace

// NOLINTNEXTLINE
bool NativePipeline::activate(gfx::Swapchain *swapchainIn) {
    swapchain = swapchainIn;
    macros["CC_PIPELINE_TYPE"] = 0;
    globalDSManager->activate(device);
    pipelineSceneData->activate(device);
    DebugRenderer::getInstance()->activate(device);

    // generate macros here rather than construct func because _clusterEnabled
    // switch may be changed in root.ts setRenderPipeline() function which is after
    // pipeline construct.
    generateConstantMacros(device, constantMacros, false);

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

    framegraph::FrameGraph::gc(0);

    return true;
}

// NOLINTNEXTLINE
void NativePipeline::render(const ccstd::vector<scene::Camera *> &cameras) {
    const auto *sceneData = pipelineSceneData.get();
    auto *commandBuffer = device->getCommandBuffer();
    float shadingScale = sceneData->getShadingScale();

    struct RenderData2 {
        framegraph::TextureHandle outputTex;
    };

    commandBuffer->begin();

    for (const auto *camera : cameras) {
        auto colorHandle = framegraph::FrameGraph::stringToHandle("outputTexture");

        auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, RenderData2 &data) {
            gfx::Color clearColor;
            if (hasFlag(static_cast<gfx::ClearFlags>(camera->getClearFlag()), gfx::ClearFlagBit::COLOR)) {
                clearColor.x = camera->getClearColor().x;
                clearColor.y = camera->getClearColor().y;
                clearColor.z = camera->getClearColor().z;
            }
            clearColor.w = camera->getClearColor().w;
            // color
            framegraph::Texture::Descriptor colorTexInfo;
            colorTexInfo.format = sceneData->isHDR() ? gfx::Format::RGBA16F : gfx::Format::RGBA8;
            colorTexInfo.usage = gfx::TextureUsageBit::COLOR_ATTACHMENT;
            colorTexInfo.width = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getWidth()) * shadingScale);
            colorTexInfo.height = static_cast<uint32_t>(static_cast<float>(camera->getWindow()->getHeight()) * shadingScale);
            if (shadingScale != 1.F) {
                colorTexInfo.usage |= gfx::TextureUsageBit::TRANSFER_SRC;
            }

            data.outputTex = builder.create(colorHandle, colorTexInfo);
            framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
            colorAttachmentInfo.usage = framegraph::RenderTargetAttachment::Usage::COLOR;
            colorAttachmentInfo.clearColor = clearColor;
            colorAttachmentInfo.loadOp = gfx::LoadOp::CLEAR;

            colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;

            data.outputTex = builder.write(data.outputTex, colorAttachmentInfo);
            builder.writeToBlackboard(colorHandle, data.outputTex);

            auto getRenderArea = [](const scene::Camera *camera) {
                float w{static_cast<float>(camera->getWindow()->getWidth())};
                float h{static_cast<float>(camera->getWindow()->getHeight())};

                const auto &vp = camera->getViewport();
                return gfx::Rect{
                    static_cast<int32_t>(vp.x * w),
                    static_cast<int32_t>(vp.y * h),
                    static_cast<uint32_t>(vp.z * w),
                    static_cast<uint32_t>(vp.w * h),
                };
            };

            auto getViewport = [&shadingScale, &getRenderArea](const scene::Camera *camera) {
                const gfx::Rect &rect = getRenderArea(camera);
                return gfx::Viewport{
                    static_cast<int>(static_cast<float>(rect.x) * shadingScale),
                    static_cast<int>(static_cast<float>(rect.y) * shadingScale),
                    static_cast<uint32_t>(static_cast<float>(rect.width) * shadingScale),
                    static_cast<uint32_t>(static_cast<float>(rect.height) * shadingScale)};
            };

            auto getScissor = [&shadingScale, &getRenderArea](const scene::Camera *camera) {
                const gfx::Rect &rect = getRenderArea(camera);
                return gfx::Rect{
                    static_cast<int>(static_cast<float>(rect.x) * shadingScale),
                    static_cast<int>(static_cast<float>(rect.y) * shadingScale),
                    static_cast<uint32_t>(static_cast<float>(rect.width) * shadingScale),
                    static_cast<uint32_t>(static_cast<float>(rect.height) * shadingScale)};
            };

            builder.setViewport(getViewport(camera), getScissor(camera));
        };

        auto forwardExec = [](const RenderData2 & /*data*/,
                              const framegraph::DevicePassResourceTable &table) {
            // do nothing
        };

        auto passHandle = framegraph::FrameGraph::stringToHandle("forwardPass");

        frameGraph.addPass<RenderData2>(
            static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD),
            passHandle, forwardSetup, forwardExec);

        frameGraph.presentFromBlackboard(colorHandle,
                                         camera->getWindow()->getFramebuffer()->getColorTextures()[0], true);
    }
    frameGraph.compile();
    frameGraph.execute();
    frameGraph.reset();

    ccstd::vector<gfx::CommandBuffer *> commandBuffers(1, commandBuffer);
    device->flushCommands(commandBuffers);
    device->getQueue()->submit(commandBuffers);

    commandBuffer->end();
    {
        static uint64_t frameCount{0U};
        static constexpr uint64_t INTERVAL_IN_SECONDS = 30;
        if (++frameCount % (INTERVAL_IN_SECONDS * 60) == 0) {
            framegraph::FrameGraph::gc(INTERVAL_IN_SECONDS * 60);
        }
    }
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

void NativePipeline::setMacroString(const ccstd::string& name, const ccstd::string& value) {
    macros[name] = value;
}

void NativePipeline::setMacroInt(const ccstd::string& name, int32_t value) {
    macros[name] = value;
}

void NativePipeline::setMacroBool(const ccstd::string& name, bool value) {
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

} // namespace render

} // namespace cc
