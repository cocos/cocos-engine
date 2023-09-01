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

#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/PipelineStateManager.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphUtils.h"
#include "cocos/renderer/pipeline/custom/NativeBuiltinUtils.h"
#include "cocos/renderer/pipeline/custom/NativePipelineTypes.h"
#include "cocos/renderer/pipeline/custom/NativeRenderGraphUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphGraphs.h"
#include "cocos/renderer/pipeline/custom/RenderingModule.h"
#include "cocos/renderer/pipeline/custom/details/GslUtils.h"
#include "cocos/scene/RenderScene.h"
#include "cocos/scene/RenderWindow.h"
#if CC_USE_DEBUG_RENDERER
    #include "profiler/DebugRenderer.h"
#endif

namespace cc {

namespace render {

template<gfx::Format>
void addSubresourceNode(ResourceGraph::vertex_descriptor v, const ccstd::string &name, ResourceGraph &resg);

template <>
void addSubresourceNode<gfx::Format::DEPTH_STENCIL>(ResourceGraph::vertex_descriptor v, const ccstd::string &name, ResourceGraph &resg) {
    const auto& desc = get(ResourceGraph::DescTag{}, resg, v);
    const auto& traits = get(ResourceGraph::TraitsTag{}, resg, v);
    const auto& samplerInfo = get(ResourceGraph::SamplerTag{}, resg, v);

    SubresourceView view{
        nullptr,
        gfx::Format::DEPTH_STENCIL,
        0, // indexOrFirstMipLevel
        1, // numMipLevels
        0, // firstArraySlice
        1, // numArraySlices
        0, // firstPlane
        1, // numPlanes
        desc.viewType,
    };

    ccstd::string depthName{name};
    depthName += "/";
    depthName += DEPTH_PLANE_NAME;
    const auto depthID = addVertex(
        SubresourceViewTag{},
        std::forward_as_tuple(depthName.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(traits.residency),
        std::forward_as_tuple(),
        std::forward_as_tuple(samplerInfo),
        std::forward_as_tuple(view),
        resg,
        v);

    view.firstPlane = 1;
    ccstd::string stencilName{name};
    stencilName += "/";
    stencilName += STENCIL_PLANE_NAME;
    const auto stencilID = addVertex(
        SubresourceViewTag{},
        std::forward_as_tuple(stencilName.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(traits.residency),
        std::forward_as_tuple(),
        std::forward_as_tuple(samplerInfo),
        std::forward_as_tuple(view),
        resg,
        v);
}

NativePipeline::NativePipeline(const allocator_type &alloc) noexcept
: device(gfx::Device::getInstance()),
  globalDSManager(std::make_unique<pipeline::GlobalDSManager>()),
  programLibrary(dynamic_cast<NativeProgramLibrary *>(getProgramLibrary())),
  pipelineSceneData(ccnew pipeline::PipelineSceneData()), // NOLINT
  nativeContext(std::make_unique<gfx::DefaultResource>(device), alloc),
  resourceGraph(alloc),
  renderGraph(alloc),
  name(alloc),
  custom(alloc) {
    programLibrary->setPipeline(this);
}

gfx::Device *NativePipeline::getDevice() const {
    return device;
}

PipelineType NativePipeline::getType() const {
    return PipelineType::STANDARD;
}

PipelineCapabilities NativePipeline::getCapabilities() const {
    return PipelineCapabilities{};
}

void NativePipeline::beginSetup() {
    renderGraph = RenderGraph(get_allocator());
}

void NativePipeline::endSetup() {
}

bool NativePipeline::containsResource(const ccstd::string &name) const {
    return contains(name.c_str(), resourceGraph);
}

uint32_t NativePipeline::addExternalTexture(const ccstd::string &name, gfx::Texture *texture, ResourceFlags flags) {
    const auto &texInfo = texture->getInfo();
    ResourceDesc desc{};
    desc.dimension = getResourceDimension(texInfo.type);
    desc.width = texInfo.width;
    desc.height = texInfo.height;
    desc.depthOrArraySize = desc.dimension == ResourceDimension::TEXTURE3D ? texInfo.depth : texInfo.layerCount;
    desc.mipLevels = texInfo.levelCount;
    desc.format = texture->getFormat();
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = texture->getInfo().flags;
    desc.flags = flags;
    desc.viewType = texInfo.type;

    return addVertex(
        PersistentTextureTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(texture),
        resourceGraph);
}

void NativePipeline::updateExternalTexture(const ccstd::string &name, gfx::Texture *texture) {
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
    visitObject(
        resID, resourceGraph,
        [&](IntrusivePtr<gfx::Texture> &tex) {
            desc.width = texture->getWidth();
            desc.height = texture->getHeight();
            tex = texture;
        },
        [](const auto & /*res*/) {});
}

// NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
uint32_t NativePipeline::addRenderWindow(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, scene::RenderWindow *renderWindow) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED |
                 ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;

    CC_EXPECTS(renderWindow);

    if (!renderWindow->getSwapchain()) {
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().size() == 1);
        CC_ASSERT(renderWindow->getFramebuffer()->getColorTextures().at(0));
        desc.sampleCount = renderWindow->getFramebuffer()->getColorTextures().at(0)->getInfo().samples;
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

    desc.format = renderWindow->getFramebuffer()->getColorTextures()[0]->getFormat();

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
uint32_t NativePipeline::addStorageBuffer(const ccstd::string &name, gfx::Format format, uint32_t size, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::BUFFER;
    desc.width = size;
    desc.height = 1;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::STORAGE | ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;

    return addVertex(
        ManagedBufferTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
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
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED |
                 ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;

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
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::DEPTH_STENCIL_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT | ResourceFlags::SAMPLED |
                 ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;

    CC_EXPECTS(residency == ResourceResidency::MANAGED || residency == ResourceResidency::MEMORYLESS);

    gfx::SamplerInfo samplerInfo{};
    samplerInfo.magFilter = gfx::Filter::POINT;
    samplerInfo.minFilter = gfx::Filter::POINT;
    samplerInfo.mipFilter = gfx::Filter::NONE;

    auto resID = addVertex(
        ManagedTextureTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(samplerInfo),
        std::forward_as_tuple(),
        resourceGraph);

    addSubresourceNode<gfx::Format::DEPTH_STENCIL>(resID, name, resourceGraph);
    return resID;
}

uint32_t NativePipeline::addTexture(const ccstd::string &name, gfx::TextureType type, gfx::Format format, uint32_t width, uint32_t height, uint32_t depth, uint32_t arraySize, uint32_t mipLevels, gfx::SampleCount sampleCount, ResourceFlags flags, ResourceResidency residency) {
    const auto dimension = getResourceDimension(type);
    ResourceDesc desc{
        dimension,
        0,
        width,
        height,
        static_cast<uint16_t>(dimension == ResourceDimension::TEXTURE3D ? depth : arraySize),
        static_cast<uint16_t>(mipLevels),
        format,
        sampleCount,
        residency == ResourceResidency::MEMORYLESS ? gfx::TextureFlagBit::LAZILY_ALLOCATED : gfx::TextureFlagBit::NONE,
        flags,
        type
    };
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

void NativePipeline::updateTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, uint32_t depth, uint32_t arraySize, uint32_t mipLevels, gfx::SampleCount sampleCount) {
    updateResource(name, format, width, height, depth, arraySize, mipLevels, sampleCount);
}

uint32_t NativePipeline::addBuffer(const ccstd::string &name, uint32_t size, ResourceFlags flags, ResourceResidency residency) {
    ResourceDesc desc = {};
    desc.dimension = ResourceDimension::BUFFER;
    desc.width = size;
    desc.flags = flags;
    return addVertex(
        ManagedBufferTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{residency}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        resourceGraph);
}

void NativePipeline::updateBuffer(const ccstd::string &name, uint32_t size) {
    updateResource(name, gfx::Format::UNKNOWN, size, 0, 0, 0, 0, gfx::SampleCount::X1);
}

uint32_t NativePipeline::addResource(const ccstd::string& name, ResourceDimension dimension,
    gfx::Format format,
    uint32_t width, uint32_t height, uint32_t depth, uint32_t arraySize, uint32_t mipLevels,
    gfx::SampleCount sampleCount, ResourceFlags flags, ResourceResidency residency) {
    return dimension == ResourceDimension::BUFFER ? addBuffer(name, width, flags, residency) :
        addTexture(name, getTextureType(dimension, arraySize), format, width, height, depth, arraySize, mipLevels, sampleCount, flags, residency);
}

void NativePipeline::updateResource(const ccstd::string& name, gfx::Format format,
    uint32_t width, uint32_t height, uint32_t depth, uint32_t arraySize, uint32_t mipLevels, // NOLINT(bugprone-easily-swappable-parameters)
    gfx::SampleCount sampleCount) {
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

    // update format
    if (format == gfx::Format::UNKNOWN) {
        format = desc.format;
    }
    visitObject(
        resID, resourceGraph,
        [&](ManagedTexture &tex) {
            uint32_t depthOrArraySize = static_cast<uint16_t>(
                desc.dimension == ResourceDimension::TEXTURE3D ? depth : arraySize);
            bool invalidate =
                std::forward_as_tuple(desc.width, desc.height, desc.depthOrArraySize, desc.mipLevels, desc.format, desc.sampleCount) !=
                std::forward_as_tuple(width, height, depthOrArraySize, mipLevels, format, sampleCount);
            if (invalidate) {
                desc.width = width;
                desc.height = height;
                desc.depthOrArraySize = depthOrArraySize;
                desc.mipLevels = mipLevels;
                desc.format = format;
                desc.sampleCount = sampleCount;
                resourceGraph.invalidatePersistentRenderPassAndFramebuffer(tex.texture.get());
            }
        },
        [&](ManagedBuffer &/*buffer*/) {
            desc.width = width;
        },
        [](const auto & /*res*/) {});
}

// NOLINTNEXTLINE
uint32_t NativePipeline::addStorageTexture(const ccstd::string &name, gfx::Format format, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = format;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::STORAGE | ResourceFlags::SAMPLED | ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;;

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
// NOLINTNEXTLINE
uint32_t NativePipeline::addShadingRateTexture(const ccstd::string &name, uint32_t width, uint32_t height, ResourceResidency residency) {
    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = width;
    desc.height = height;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = gfx::Format::R8UI;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::SHADING_RATE | ResourceFlags::STORAGE | ResourceFlags::SAMPLED | ResourceFlags::TRANSFER_SRC | ResourceFlags::TRANSFER_DST;

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

uint32_t NativePipeline::addCustomBuffer(
    const ccstd::string &name,
    const gfx::BufferInfo &info, const std::string &type) {
    if (!custom.currentContext) {
        return ResourceGraph::null_vertex();
    }
    auto &ctx = *custom.currentContext;

    ResourceDesc desc{};
    desc.dimension = ResourceDimension::BUFFER;
    desc.width = info.size;
    desc.height = 1;
    desc.depthOrArraySize = 1;
    desc.mipLevels = 1;
    desc.format = gfx::Format::UNKNOWN;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = gfx::TextureFlagBit::NONE;
    desc.flags = ResourceFlags::NONE;

    auto ptr = ctx.createCustomBuffer(type, info);

    return addVertex(
        PersistentBufferTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(ptr)),
        resourceGraph);
}

uint32_t NativePipeline::addCustomTexture(
    const ccstd::string &name,
    const gfx::TextureInfo &info, const std::string &type) {
    if (!custom.currentContext) {
        return ResourceGraph::null_vertex();
    }
    auto &ctx = *custom.currentContext;

    ResourceDesc desc{};
    desc.dimension = ResourceDimension::TEXTURE2D;
    desc.width = info.width;
    desc.height = info.height;
    desc.depthOrArraySize = info.layerCount;
    desc.mipLevels = info.levelCount;
    desc.format = info.format;
    desc.sampleCount = gfx::SampleCount::X1;
    desc.textureFlags = info.flags;
    desc.flags = ResourceFlags::NONE;

    auto ptr = ctx.createCustomTexture(type, info);

    return addVertex(
        PersistentTextureTag{},
        std::forward_as_tuple(name.c_str()),
        std::forward_as_tuple(desc),
        std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(ptr)),
        resourceGraph);
}

void NativePipeline::updateRenderWindow(const ccstd::string &name, scene::RenderWindow *renderWindow) {
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
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
            auto *newSwapchain = renderWindow->getSwapchain();
            if (sc.generation != newSwapchain->getGeneration()) {
                resourceGraph.invalidatePersistentRenderPassAndFramebuffer(
                    sc.swapchain->getColorTexture());
                sc.generation = newSwapchain->getGeneration();
            }
            desc.width = renderWindow->getSwapchain()->getWidth();
            desc.height = renderWindow->getSwapchain()->getHeight();
            sc.swapchain = renderWindow->getSwapchain();
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::updateStorageBuffer(
    const ccstd::string &name, uint32_t size, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

    // update format
    if (format == gfx::Format::UNKNOWN) {
        format = desc.format;
    }

    visitObject(
        resID, resourceGraph,
        [&](ManagedBuffer &buffer) {
            std::ignore = buffer;
            bool invalidate =
                std::forward_as_tuple(desc.width, desc.format) !=
                std::forward_as_tuple(size, format);
            if (invalidate) {
                desc.width = size;
                desc.format = format;
                // TODO(zhouzhenglong): invalidate buffer
            }
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::updateRenderTarget(
    const ccstd::string &name,
    uint32_t width, uint32_t height, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

    // update format
    if (format == gfx::Format::UNKNOWN) {
        format = desc.format;
    }
    visitObject(
        resID, resourceGraph,
        [&](ManagedTexture &tex) {
            bool invalidate =
                std::forward_as_tuple(desc.width, desc.height, desc.format) !=
                std::forward_as_tuple(width, height, format);
            if (invalidate) {
                desc.width = width;
                desc.height = height;
                desc.format = format;
                resourceGraph.invalidatePersistentRenderPassAndFramebuffer(tex.texture.get());
            }
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::updateDepthStencil(
    const ccstd::string &name,
    uint32_t width, uint32_t height, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
    updateRenderTarget(name, width, height, format);
}

void NativePipeline::updateStorageTexture(
    const ccstd::string &name, uint32_t width, uint32_t height, gfx::Format format) { // NOLINT(bugprone-easily-swappable-parameters)
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

    // update format
    if (format == gfx::Format::UNKNOWN) {
        format = desc.format;
    }

    visitObject(
        resID, resourceGraph,
        [&](ManagedTexture &tex) {
            std::ignore = tex;
            bool invalidate =
                std::forward_as_tuple(desc.width, desc.height, desc.format) !=
                std::forward_as_tuple(width, height, format);
            if (invalidate) {
                desc.width = width;
                desc.height = height;
                desc.format = format;
                // TODO(zhouzhenglong): invalidate storage texture
            }
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::updateShadingRateTexture(
    const ccstd::string &name, uint32_t width, uint32_t height) { // NOLINT(bugprone-easily-swappable-parameters)
    auto resID = findVertex(ccstd::pmr::string(name, get_allocator()), resourceGraph);
    if (resID == ResourceGraph::null_vertex()) {
        return;
    }
    auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

    // update format
    visitObject(
        resID, resourceGraph,
        [&](ManagedTexture &tex) {
            std::ignore = tex;
            bool invalidate =
                std::forward_as_tuple(desc.width, desc.height) !=
                std::forward_as_tuple(width, height);
            if (invalidate) {
                desc.width = width;
                desc.height = height;
                // TODO(zhouzhenglong): invalidate shading rate texture
            }
        },
        [](const auto & /*res*/) {});
}

void NativePipeline::beginFrame() {
    // noop
}

void NativePipeline::update(const scene::Camera *camera) {
    const auto *sceneData = getPipelineSceneData();
    const auto *shadows = sceneData->getShadows();
    if (shadows && shadows->isEnabled() && shadows->getType() == scene::ShadowType::SHADOW_MAP &&
        camera && camera->getScene() && camera->getScene()->getMainLight()) {
        sceneData->getCSMLayers()->update(sceneData, camera);
    }
}

void NativePipeline::endFrame() {
    // noop
}

RenderPassBuilder *NativePipeline::addRenderPass(
    uint32_t width, uint32_t height,
    const ccstd::string &passName) {
    const auto &layoutGraph = programLibrary->layoutGraph;

    auto [passID, passLayoutID] = addRenderPassVertex(
        renderGraph, layoutGraph,
        width, height, 1, 0, passName);

    auto *builder = ccnew NativeRenderPassBuilder(
        this, &renderGraph, passID, &layoutGraph, passLayoutID);

    updateRasterPassConstants(width, height, *builder);

    return builder;
}

MultisampleRenderPassBuilder *NativePipeline::addMultisampleRenderPass(
    uint32_t width, uint32_t height,
    uint32_t count, uint32_t quality,
    const ccstd::string &passName) {
    CC_EXPECTS(count > 1);
    const auto &layoutGraph = programLibrary->layoutGraph;

    auto [passID, passLayoutID] = addRenderPassVertex(
        renderGraph, layoutGraph,
        width, height, count, quality, passName);

    auto &pass = get(RasterPassTag{}, passID, renderGraph);

    auto [subpassID, subpassLayoutID] = addRenderSubpassVertex(
        pass, renderGraph, passID,
        layoutGraph, passLayoutID,
        "", // subpassName is empty
        count, quality);

    auto *builder = ccnew NativeMultisampleRenderPassBuilder(
        this, &renderGraph, passID, &layoutGraph, passLayoutID,
        subpassID, subpassLayoutID);

    updateRasterPassConstants(pass.width, pass.height, *builder);

    return builder;
}

void NativePipeline::addResolvePass(const ccstd::vector<ResolvePair> &resolvePairs) {
    ResolvePass pass(renderGraph.get_allocator());
    pass.resolvePairs.reserve(resolvePairs.size());
    for (auto &&pair : resolvePairs) {
        pass.resolvePairs.emplace_back(pair);
    }
    std::string_view name("Resolve");
    addVertex2(
        ResolveTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);
}

// NOLINTNEXTLINE
ComputePassBuilder *NativePipeline::addComputePass(const ccstd::string &passName) {
    auto passID = addVertex2(
        ComputeTag{},
        std::forward_as_tuple(passName),
        std::forward_as_tuple(passName),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        renderGraph);

    auto passLayoutID = locate(LayoutGraphData::null_vertex(), passName, programLibrary->layoutGraph);

    return ccnew NativeComputePassBuilder(this, &renderGraph, passID, &programLibrary->layoutGraph, passLayoutID);
}

void NativePipeline::addMovePass(const ccstd::vector<MovePair> &movePairs) {
    MovePass pass(renderGraph.get_allocator());
    pass.movePairs.reserve(movePairs.size());
    for (auto &&pair : movePairs) {
        pass.movePairs.emplace_back(pair);
    }
    std::string_view name("Move");
    addVertex2(
        MoveTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);
}

namespace {

void setupGpuDrivenResources(
    NativePipeline& ppl, uint32_t cullingID, ResourceGraph& resg, const std::string &hzbName) {
    ccstd::pmr::string name(resg.get_allocator());
    { // init resource
        name = "_GpuInit";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = addVertex(
                PersistentBufferTag{},
                std::forward_as_tuple(name.c_str()),
                std::forward_as_tuple(),
                std::forward_as_tuple(ResourceTraits{ResourceResidency::EXTERNAL}),
                std::forward_as_tuple(),
                std::forward_as_tuple(),
                std::forward_as_tuple(/*xxx*/),
                resg);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            // get(PersistentBufferTag{}, resID, resg) = xxx;
        }
    }
    {
        name = "CCObjectBuffer";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = ppl.addStorageBuffer(std::string(name), gfx::Format::UNKNOWN, 0, ResourceResidency::MANAGED);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            ppl.updateStorageBuffer(std::string(name), 0, gfx::Format::UNKNOWN);
        }
    }
    {
        name = "CCInstanceBuffer";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = ppl.addStorageBuffer(std::string(name), gfx::Format::UNKNOWN, 0, ResourceResidency::MANAGED);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            ppl.updateStorageBuffer(std::string(name), 0, gfx::Format::UNKNOWN);
        }
    }
    {
        name = "CCDrawIndirectBuffer";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = ppl.addStorageBuffer(std::string(name), gfx::Format::UNKNOWN, 0, ResourceResidency::MANAGED);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            ppl.updateStorageBuffer(std::string(name), 0, gfx::Format::UNKNOWN);
        }
    }
    {
        name = "CCDrawInstanceBuffer";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = ppl.addStorageBuffer(std::string(name), gfx::Format::UNKNOWN, 0, ResourceResidency::MANAGED);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            ppl.updateStorageBuffer(std::string(name), 0, gfx::Format::UNKNOWN);
        }
    }
    {
        name = "CCVisibilityBuffer";
        name.append(std::to_string(cullingID));
        auto resID = findVertex(name, resg);
        if (resID == ResourceGraph::null_vertex()) {
            resID = ppl.addStorageBuffer(std::string(name), gfx::Format::UNKNOWN, 0, ResourceResidency::MANAGED);
        } else {
            CC_EXPECTS(holds<PersistentBufferTag>(resID, resg));
            ppl.updateStorageBuffer(std::string(name), 0, gfx::Format::UNKNOWN);
        }
    }
    if (!hzbName.empty()) {

    }
}

} // namespace

void NativePipeline::addBuiltinGpuCullingPass(
    const scene::Camera *camera, const std::string &hzbName, const scene::Light *light) {
    std::ignore = camera;
    const uint32_t cullingID = ++nativeContext.sceneCulling.gpuCullingPassID;
    setupGpuDrivenResources(*this, cullingID, resourceGraph, hzbName);

    if (light) {
        // build light culling pass
        return;
    }

    const std::string objectBuffer = "CCObjectBuffer" + std::to_string(cullingID);
    const std::string instanceBuffer = "CCInstanceBuffer" + std::to_string(cullingID);
    const std::string drawIndirectBuffer = "CCDrawIndirectBuffer" + std::to_string(cullingID);
    const std::string drawInstanceBuffer = "CCDrawInstanceBuffer" + std::to_string(cullingID);
    const std::string visibilityBuffer = "CCVisibilityBuffer" + std::to_string(cullingID);

    // init indirected buffers
    {
        CopyPass copyPass{renderGraph.get_allocator()};
        {
            CopyPair copyPair{renderGraph.get_allocator()};
            copyPair.source = "xxx";
            copyPair.target = drawIndirectBuffer;
            copyPair.mipLevels = 1;
            copyPair.numSlices = 1;
            copyPass.copyPairs.emplace_back(std::move(copyPair));
        }

        auto copyID = addVertex2(CopyTag{},
            std::forward_as_tuple("CopyInitialIndirectBuffer"),
            std::forward_as_tuple(),
            std::forward_as_tuple(),
            std::forward_as_tuple(),
            std::forward_as_tuple(std::move(copyPass)),
            renderGraph);
        CC_ENSURES(copyID != RenderGraph::null_vertex());
    }
    // run compute cullling pass
    {
        ComputePass computePass{renderGraph.get_allocator()};
        {
            auto res = computePass.computeViews.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(drawIndirectBuffer),
                std::forward_as_tuple());
            auto& view = res.first->second.emplace_back();
            view.name = "CCDrawIndirectBuffer";
            view.accessType = AccessType::WRITE;
            view.shaderStageFlags = gfx::ShaderStageFlagBit::COMPUTE;
        }
        {
            auto res = computePass.computeViews.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(drawInstanceBuffer),
                std::forward_as_tuple());
            auto& view = res.first->second.emplace_back();
            view.name = "CCDrawInstanceBuffer";
            view.accessType = AccessType::WRITE;
            view.shaderStageFlags = gfx::ShaderStageFlagBit::COMPUTE;
        }
        {
            auto res = computePass.computeViews.emplace(
                std::piecewise_construct,
                std::forward_as_tuple(visibilityBuffer),
                std::forward_as_tuple());
            auto& view = res.first->second.emplace_back();
            view.name = "CCVisibilityBuffer";
            view.accessType = AccessType::WRITE;
            view.shaderStageFlags = gfx::ShaderStageFlagBit::COMPUTE;
        }

        auto computePassID = addVertex2(ComputeTag{},
            std::forward_as_tuple("Scene"),
            std::forward_as_tuple(),
            std::forward_as_tuple(),
            std::forward_as_tuple(),
            std::forward_as_tuple(std::move(computePass)),
            renderGraph);
        CC_ENSURES(computePassID != RenderGraph::null_vertex());
    }
}

void NativePipeline::addBuiltinHzbGenerationPass(
    // NOLINTNEXTLINE(bugprone-easily-swappable-parameters)
    const std::string &sourceDepthStencilName, const std::string &targetHzbName) {
}

void NativePipeline::addCopyPass(const ccstd::vector<CopyPair> &copyPairs) {
    CopyPass pass(renderGraph.get_allocator());
    pass.copyPairs.reserve(copyPairs.size());
    for (auto &&pair : copyPairs) {
        pass.copyPairs.emplace_back(pair);
    }
    std::string_view name("Copy");
    addVertex2(
        CopyTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);
}

void NativePipeline::addUploadPass(ccstd::vector<UploadPair> &uploadPairs) {
    CopyPass pass(renderGraph.get_allocator());
    pass.uploadPairs.reserve(uploadPairs.size());
    for (auto &&pair : uploadPairs) {
        pass.uploadPairs.emplace_back(std::move(pair));
    }
    uploadPairs.clear();
    std::string_view name("Upload");
    addVertex2(
        CopyTag{},
        std::forward_as_tuple(name),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        std::forward_as_tuple(std::move(pass)),
        renderGraph);
}

gfx::DescriptorSetLayout *NativePipeline::getDescriptorSetLayout(const ccstd::string &shaderName, UpdateFrequency freq) {
    const auto &lg = programLibrary->layoutGraph;
    auto iter = lg.shaderLayoutIndex.find(std::string_view{shaderName});
    if (iter != lg.shaderLayoutIndex.end()) {
        const auto &layouts = get(LayoutGraphData::LayoutTag{}, lg, iter->second).descriptorSets;
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
        buffer.init(device, bufferSize, false);
    }
}

} // namespace

// NOLINTNEXTLINE
bool NativePipeline::activate(gfx::Swapchain *swapchainIn) {
    // setMacroInt("CC_PIPELINE_TYPE", 1);

    // disable gfx internal deduce
    gfx::Device::getInstance()->enableAutoBarrier(false);

    // shadowmap
    {
        // 0: SHADOWMAP_FLOAT, 1: SHADOWMAP_RGBE.
        const int32_t isRGBE = pipeline::supportsR32FloatTexture(getDevice()) ? 0 : 1;
        setValue("CC_SHADOWMAP_FORMAT", isRGBE);

        // 0: SHADOWMAP_LINER_DEPTH_OFF, 1: SHADOWMAP_LINER_DEPTH_ON.
        const int32_t isLinear = 0;
        setValue("CC_SHADOWMAP_USE_LINEAR_DEPTH", isLinear);

        // 0: UNIFORM_VECTORS_LESS_EQUAL_64, 1: UNIFORM_VECTORS_GREATER_EQUAL_125.
        const auto csmSupported =
            getDevice()->getCapabilities().maxFragmentUniformVectors >=
            (pipeline::UBOGlobal::COUNT + pipeline::UBOCamera::COUNT + pipeline::UBOShadow::COUNT + pipeline::UBOCSM::COUNT) >> 2;
        getPipelineSceneData()->setCSMSupported(csmSupported);
        setValue("CC_SUPPORT_CASCADED_SHADOW_MAP", csmSupported);

        // 0: CC_SHADOW_NONE, 1: CC_SHADOW_PLANAR, 2: CC_SHADOW_MAP
        setValue("CC_SHADOW_TYPE", 0);

        // 0: PCFType.HARD, 1: PCFType.SOFT, 2: PCFType.SOFT_2X, 3: PCFType.SOFT_4X
        setValue("CC_DIR_SHADOW_PCF_TYPE", static_cast<int32_t>(scene::PCFType::HARD));

        // 0: CC_DIR_LIGHT_SHADOW_PLANAR, 1: CC_DIR_LIGHT_SHADOW_UNIFORM, 2: CC_DIR_LIGHT_SHADOW_CASCADED, 3: CC_DIR_LIGHT_SHADOW_VARIANCE
        setValue("CC_DIR_LIGHT_SHADOW_TYPE", 0);

        // 0: CC_CASCADED_LAYERS_TRANSITION_OFF, 1: CC_CASCADED_LAYERS_TRANSITION_ON
        setValue("CC_CASCADED_LAYERS_TRANSITION", 0);
    }

    setValue("CC_USE_HDR", getPipelineSceneData()->isHDR());
#if ENABLE_FLOAT_OUTPUT
    setValue("CC_USE_FLOAT_OUTPUT", true);
#else
    setValue("CC_USE_FLOAT_OUTPUT", false);
#endif

    swapchain = swapchainIn;
    globalDSManager->activate(device);
    pipelineSceneData->activate(device);
#if CC_USE_DEBUG_RENDERER
    DebugRenderer::getInstance()->activate(device);
#endif
    // generate macros here rather than construct func because _clusterEnabled
    // switch may be changed in root.ts setRenderPipeline() function which is after
    // pipeline construct.
    generateConstantMacros(device, constantMacros);

    _commandBuffers.resize(1, device->getCommandBuffer());

    // reserve layout graph resource
    const auto &lg = programLibrary->layoutGraph;
    const auto numNodes = num_vertices(lg);
    nativeContext.layoutGraphResources.reserve(numNodes);

    for (uint32_t i = 0; i != numNodes; ++i) {
        auto &node = nativeContext.layoutGraphResources.emplace_back();
        const auto &layout = get(LayoutGraphData::LayoutTag{}, lg, i);
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

    // create ia
    {
        CC_EXPECTS(device);
        // create vertex buffer
        const auto vbStride = sizeof(float) * 4; // 4 float per vertex
        const auto vbSize = vbStride * 4;        // 4 vertices
        IntrusivePtr<gfx::Buffer> quadVB = device->createBuffer(gfx::BufferInfo{
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
            vbSize,
            vbStride});

        CC_ENSURES(quadVB);

        // update vertex buffer
        float vbData[16] = {};
        render::setupQuadVertexBuffer(*device, Vec4{0, 0, 1, 1}, vbData);
        static_assert(sizeof(vbData) == 16 * 4);
        CC_ENSURES(sizeof(vbData) == vbSize);
        quadVB->update(vbData, sizeof(vbData));

        // create index buffer
        const auto ibStride = sizeof(uint16_t);
        const auto ibSize = ibStride * 6;

        IntrusivePtr<gfx::Buffer> quadIB = device->createBuffer(gfx::BufferInfo{
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            ibSize,
            ibStride});

        CC_ENSURES(quadIB);

        ccstd::vector<uint16_t> indices(6);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 1;
        indices[4] = 3;
        indices[5] = 2;

        quadIB->update(indices.data(),
                       static_cast<uint32_t>(indices.size() * sizeof(decltype(indices)::value_type)));

        // create input assembler
        ccstd::vector<gfx::Attribute> attributes;
        attributes.reserve(2);
        attributes.emplace_back(gfx::Attribute{"a_position", gfx::Format::RG32F});
        attributes.emplace_back(gfx::Attribute{"a_texCoord", gfx::Format::RG32F});

        ccstd::vector<gfx::Buffer *> buffers;
        buffers.emplace_back(quadVB.get());

        IntrusivePtr<gfx::InputAssembler> quadIA = device->createInputAssembler(
            gfx::InputAssemblerInfo{attributes, buffers, quadIB});
        CC_ENSURES(quadIA);

        // init fullscreenQuad
        nativeContext.fullscreenQuad.quadIB = quadIB;
        nativeContext.fullscreenQuad.quadVB = quadVB;
        nativeContext.fullscreenQuad.quadIA = quadIA;
    }

    return true;
}

bool NativePipeline::destroy() noexcept {
#if CC_USE_DEBUG_RENDERER
    DebugRenderer::getInstance()->destroy();
#endif
    if (globalDSManager) {
        globalDSManager->destroy();
        globalDSManager.reset();
    }
    if (pipelineSceneData) {
        pipelineSceneData->destroy();
        pipelineSceneData = {};
    }
    pipeline::PipelineStateManager::destroyAll();
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

void NativePipeline::addCustomContext(std::string_view name, std::shared_ptr<CustomPipelineContext> ptr) {
    custom.contexts.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomRenderPass(std::string_view name, std::shared_ptr<CustomRenderPass> ptr) {
    custom.renderPasses.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomRenderSubpass(std::string_view name, std::shared_ptr<CustomRenderSubpass> ptr) {
    custom.renderSubpasses.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomComputeSubpass(std::string_view name, std::shared_ptr<CustomComputeSubpass> ptr) {
    custom.computeSubpasses.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomComputePass(std::string_view name, std::shared_ptr<CustomComputePass> ptr) {
    custom.computePasses.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomRenderQueue(std::string_view name, std::shared_ptr<CustomRenderQueue> ptr) {
    custom.renderQueues.emplace(name, std::move(ptr));
}

void NativePipeline::addCustomRenderCommand(std::string_view name, std::shared_ptr<CustomRenderCommand> ptr) {
    custom.renderCommands.emplace(name, std::move(ptr));
}

void NativePipeline::setCustomContext(std::string_view name) {
    auto iter = custom.contexts.find(name);
    if (iter != custom.contexts.end()) {
        custom.currentContext = iter->second;
    }
}

} // namespace render

} // namespace cc
