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

#pragma once

#include <algorithm>
#include <iterator>
#include <memory>
#include <set>
#include <string>
#include <utility>
#include <variant>
#include "../../Enum.h"
#include "../FGDispatcherTypes.h"
#include "../LayoutGraphGraphs.h"
#include "../NativePipelineTypes.h"
#include "../RenderGraphGraphs.h"
#include "../RenderGraphTypes.h"
#include "../details/Range.h"
#include "GFXDeviceManager.h"
#include "cocos/base/std/container/vector.h"
#include "frame-graph/FrameGraph.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDevice.h"

namespace cc {

namespace render {

using ccstd::pmr::string;
using gfx::PassType;
using std::pair;
using std::vector;
using ViewInfo = vector<pair<PassType, vector<vector<vector<string>>>>>;
using ResourceInfo = vector<std::tuple<string, ResourceDesc, ResourceTraits, ResourceStates>>;
using LayoutUnit = std::tuple<string, uint32_t, gfx::ShaderStageFlagBit>;
using LayoutInfo = vector<vector<LayoutUnit>>;
using framegraph::PassBarrierPair;
using framegraph::ResourceBarrier;
using RasterViews = PmrTransparentMap<ccstd::pmr::string, RasterView>;
using ComputeViews = PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>>;
using BarrierMap = FrameGraphDispatcher::BarrierMap;

static void fillTestGraph(const ViewInfo &rasterData, const ResourceInfo &rescInfo, const LayoutInfo &layoutInfo, RenderGraph &renderGraph, ResourceGraph &rescGraph, LayoutGraphData &layoutGraphData) {
    for (const auto &resc : rescInfo) {
        string name = std::get<0>(resc);
        auto rescVertexID = add_vertex(rescGraph, ManagedTag{}, name.c_str());
        rescGraph.descs[rescVertexID] = std::get<1>(resc);
        rescGraph.traits[rescVertexID] = std::get<2>(resc);
        rescGraph.states[rescVertexID].states = gfx::AccessFlagBit::NONE;
    }

    const auto &mem_resource = layoutGraphData.get_allocator();
    auto &stages = layoutGraphData.stages;
    stages.resize(layoutInfo.size());

    add_vertex(layoutGraphData, RenderPhaseTag{}, "");
    auto &layout = layoutGraphData.layouts.back();
    auto &descPair = layout.descriptorSets.emplace(UpdateFrequency::PER_PASS, DescriptorSetData{renderGraph.get_allocator()});
    auto &descData = (*descPair.first).second.descriptorSetLayoutData;
    for (size_t i = 0; i < layoutInfo.size(); ++i) {
        const ccstd::string passName = "pass" + std::to_string(i);
        auto layoutVtxID = add_vertex(layoutGraphData, RenderStageTag{}, passName.c_str());
        const auto &renderStageInfo = layoutInfo[i];
        for (const auto &layoutUnit : renderStageInfo) {
            const auto &rescName = std::get<0>(layoutUnit);
            const auto &nameID = std::get<1>(layoutUnit);
            const auto &shaderStage = std::get<2>(layoutUnit);
            if (layoutGraphData.attributeIndex.find(rescName) == layoutGraphData.attributeIndex.end()) {
                layoutGraphData.attributeIndex.emplace(std::make_pair<string, NameLocalID>(rescName.c_str(), NameLocalID{nameID}));
            }
            stages[i].descriptorVisibility.emplace(NameLocalID{nameID}, shaderStage);
            auto &block = descData.descriptorBlocks.emplace_back();
            block.visibility = shaderStage;
            auto &desc = block.descriptors.emplace_back();
            desc.count = 1;
            desc.descriptorID = {nameID};
        }
    }
    renderGraph.layoutNodes.emplace_back("");

    std::set<ccstd::string> nameSet;
    auto addRasterNode = [&](const vector<vector<vector<string>>> &subpasses, uint32_t count, uint32_t passID) {
        const ccstd::string name = "pass" + std::to_string(passID);
        const auto vertexID = add_vertex(renderGraph, RasterPassTag{}, name.c_str());
        auto &raster = get(RasterPassTag{}, vertexID, renderGraph);
        auto &subpassGraph = raster.subpassGraph;

        bool hasSubpass = count > 1;

        Subpass *subpass = nullptr;
        auto &rasterViews = raster.rasterViews;

        for (size_t j = 0; j < count; ++j) {
            assert(subpasses[j].size() == 2); // inputs and outputs
            const auto &attachments = subpasses[j];
            bool isOutput = false;

            Subpass *subpass = nullptr;
            RasterSubpass *subpassNode1 = nullptr;
            PmrTransparentMap<ccstd::pmr::string, RasterView> *subpassViews = nullptr;
            if (hasSubpass) {
                const ccstd::string subpassName = "subpass" + std::to_string(passID);
                auto subpassVertexID = add_vertex(subpassGraph, subpassName.c_str());
                subpass = &get(SubpassGraph::SubpassTag{}, subpassGraph, subpassVertexID);

                RasterSubpass subpassNode(j, 1, 0, renderGraph.get_allocator());
                auto subpassID = addVertex(
                    RasterSubpassTag{},
                    std::forward_as_tuple(subpassName.c_str()),
                    std::forward_as_tuple(),
                    std::forward_as_tuple(),
                    std::forward_as_tuple(),
                    std::forward_as_tuple(std::move(subpassNode)),
                    renderGraph, vertexID);

                subpassNode1 = get_if<RasterSubpass>(subpassID, &renderGraph);
                subpassViews = &subpassNode1->rasterViews;
            }

            uint32_t slot = 0;
            for (size_t k = 0; k < attachments.size(); ++k) {
                for (size_t l = 0; l < attachments[k].size(); ++l) {
                    const auto &inputsOrOutputs = attachments[k];
                    const auto &viewName = inputsOrOutputs[l];
                    bool firstMeet = nameSet.find(viewName.c_str()) == nameSet.end();
                    if (firstMeet) {
                        nameSet.emplace(viewName);
                    }

                    auto &rasterViews = hasSubpass ? (*subpass).rasterViews : raster.rasterViews;
                    auto view = RasterView{
                        viewName.c_str(),
                        isOutput ? AccessType::WRITE : AccessType::READ,
                        AttachmentType::RENDER_TARGET,
                        firstMeet ? gfx::LoadOp::CLEAR : gfx::LoadOp::LOAD,
                        gfx::StoreOp::STORE,
                        gfx::ClearFlagBit::ALL,
                        gfx::Color({1.0, 0.0, 0.0, 1.0}),
                        gfx::ShaderStageFlagBit::NONE,
                    };
                    view.slotID = slot;
                    rasterViews.emplace(viewName.c_str(), view);
                    if (subpassViews) {
                        subpassViews->emplace(viewName.c_str(), view);

                        const auto newID = static_cast<uint32_t>(raster.attachmentIndexMap.size());
                        auto iter = raster.attachmentIndexMap.find(viewName);
                        if (iter == raster.attachmentIndexMap.end()) {
                            raster.attachmentIndexMap.emplace(viewName, newID);
                        }
                    }
                    ++slot;
                }
                isOutput = true;
            }
        }
    };

    uint32_t passCount = 0;
    for (size_t i = 0; i < rasterData.size(); ++i) {
        const auto &pass = rasterData[i];
        switch (pass.first) {
            case PassType::RASTER: {
                // const string name = pass.first;
                const auto &subpasses = pass.second;
                addRasterNode(subpasses, subpasses.size(), passCount++);
                break;
            }
            case PassType::COMPUTE: {
                // const string name = pass.first;
                const auto &subpasses = pass.second;

                const ccstd::string name = "pass" + std::to_string(passCount++);
                const auto vertexID = add_vertex(renderGraph, ComputeTag{}, name.c_str());

                assert(subpasses.back().size() == 2); // inputs and outputs
                auto &computePass = get(ComputeTag{}, vertexID, renderGraph);
                const auto &inputsAndOutputs = subpasses.back();
                const auto &inputs = inputsAndOutputs.front();
                const auto &outputs = inputsAndOutputs.back();

                std::vector<ComputeView> views(2);
                ComputeView &src = views.front();
                src.name = inputs.front();
                src.accessType = AccessType::READ;
                ComputeView &dst = views.back();
                dst.name = outputs.front();
                dst.accessType = AccessType::WRITE;

                computePass.computeViews.emplace(src.name, ccstd::pmr::vector<ComputeView>{});
                computePass.computeViews.emplace(dst.name, ccstd::pmr::vector<ComputeView>{});
                computePass.computeViews.at(src.name.c_str()).emplace_back();
                computePass.computeViews.at(dst.name.c_str()).emplace_back();
                computePass.computeViews.at(src.name.c_str()).front().name = inputs.front();
                computePass.computeViews.at(src.name.c_str()).front().accessType = AccessType::READ;
                computePass.computeViews.at(dst.name.c_str()).back().name = outputs.front();
                computePass.computeViews.at(dst.name.c_str()).back().accessType = AccessType::WRITE;

                break;
            }
            case PassType::PRESENT: {
                // noop
                break;
            }
            case PassType::COPY: {
                // const string name = pass.first;
                const auto &subpasses = pass.second;

                const ccstd::string name = "pass" + std::to_string(passCount++);
                const auto vertexID = add_vertex(renderGraph, CopyTag{}, name.c_str());
                assert(subpasses.back().size() == 2); // inputs and outputs
                auto &copyPass = get(CopyTag{}, vertexID, renderGraph);
                const auto &inputsAndOutputs = subpasses.back();
                const auto &inputs = inputsAndOutputs.front();
                const auto &outputs = inputsAndOutputs.back();
                copyPass.copyPairs.emplace_back(CopyPair{
                    inputs.front().c_str(),
                    outputs.front().c_str(),
                    1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0});

                break;
            }
        }
    }

    /* FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, layoutGraphData.resource(), layoutGraphData.resource());
    fgDispatcher.enableMemoryAliasing(true);
    fgDispatcher.enablePassReorder(true);
    fgDispatcher.setParalellWeight(0.4);
    fgDispatcher.run(); */
}

static void fillBarriers(const ResourceGraph &resourceGraph, const BarrierPair &barrierInfo, framegraph::PassNodeBuilder &builder, PassBarrierPair &barriers) {
    auto doFill = [&builder, &resourceGraph](const std::vector<Barrier> &edgeInfo, std::vector<ResourceBarrier> &edgeBarriers) {
        for (const auto &resBarrier : edgeInfo) {
            const auto &name = get(ResourceGraph::NameTag{}, resourceGraph, resBarrier.resourceID);
            const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resBarrier.resourceID);
            auto type = desc.dimension == ResourceDimension::BUFFER ? cc::framegraph::ResourceType::BUFFER : cc::framegraph::ResourceType::TEXTURE;
            framegraph::Range layerRange;
            framegraph::Range mipRange;
            if (type == framegraph::ResourceType::BUFFER) {
                auto bufferRange = ccstd::get<BufferRange>(resBarrier.beginStatus.range);
                layerRange = {0, 0};
                mipRange = {bufferRange.offset, bufferRange.size};
            } else {
                auto textureRange = ccstd::get<TextureRange>(resBarrier.beginStatus.range);
                layerRange = {textureRange.firstSlice, textureRange.numSlices};
                mipRange = {textureRange.mipLevel, textureRange.levelCount};
            }

            edgeBarriers.emplace_back(cc::framegraph::ResourceBarrier{
                type,
                resBarrier.type,
                builder.readFromBlackboard(framegraph::FrameGraph::stringToHandle(name.c_str())),
                {resBarrier.beginStatus.passType,
                 resBarrier.beginStatus.visibility,
                 resBarrier.beginStatus.access},
                {resBarrier.endStatus.passType,
                 resBarrier.endStatus.visibility,
                 resBarrier.endStatus.access},
                layerRange,
                mipRange,
            });
        }
    };

    doFill(barrierInfo.frontBarriers, barriers.frontBarriers);
    doFill(barrierInfo.rearBarriers, barriers.rearBarriers);
}

struct TestRenderData {
    ccstd::vector<std::pair<AccessType, framegraph::TextureHandle>> outputTexes;
};

struct FrameGraphPassInfo {
    framegraph::FrameGraph &frameGraph;
    const RenderGraph &renderGraph;
    const ResourceGraph &resourceGraph;
    const RasterViews &rasterViews;
    const ComputeViews &computeViews;
    const BarrierMap &barrierMap;
    uint32_t passID{0};
    bool isSubpass{false};
    bool subpassEnd{false};
};

static void addPassToFrameGraph(const FrameGraphPassInfo &info) {
    const auto &rasterViews = info.rasterViews;
    const auto &passID = info.passID;
    const auto &barrierMap = info.barrierMap;
    const auto &renderGraph = info.renderGraph;
    const auto &resourceGraph = info.resourceGraph;
    auto &frameGraph = info.frameGraph;
    bool isSupass = info.isSubpass;
    bool subpassEnd = info.subpassEnd;

    auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, TestRenderData &data) {
        if (isSupass) {
            builder.subpass(subpassEnd);
        }

        auto goThroughRasterViews = [&](const RasterViews &views) {
            for (const auto &view : views) {
                const auto handle = framegraph::FrameGraph::stringToHandle(view.second.slotName.c_str());
                auto typedHandle = builder.readFromBlackboard(handle);
                data.outputTexes.emplace_back();
                auto &lastTex = data.outputTexes.back();
                framegraph::Texture::Descriptor colorTexInfo;
                colorTexInfo.format = gfx::Format::RGBA8;

                // if (rasterView.second.accessType == AccessType::READ) {
                colorTexInfo.usage = gfx::TextureUsage::INPUT_ATTACHMENT | gfx::TextureUsage::COLOR_ATTACHMENT;
                //}
                lastTex.first = view.second.accessType;
                lastTex.second = static_cast<framegraph::TextureHandle>(typedHandle);

                if (framegraph::Handle::IndexType(typedHandle) == framegraph::Handle::UNINITIALIZED) {
                    colorTexInfo.width = 960;
                    colorTexInfo.height = 640;

                    lastTex.second = builder.create(handle, colorTexInfo);
                }

                framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;
                colorAttachmentInfo.usage = view.second.attachmentType == AttachmentType::RENDER_TARGET ? framegraph::RenderTargetAttachment::Usage::COLOR : framegraph::RenderTargetAttachment::Usage::DEPTH_STENCIL;
                colorAttachmentInfo.clearColor = view.second.clearColor;
                colorAttachmentInfo.loadOp = view.second.loadOp;
                if (view.second.accessType == AccessType::WRITE) {
                    lastTex.second = builder.write(lastTex.second, colorAttachmentInfo);
                    builder.writeToBlackboard(handle, lastTex.second);
                    colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;
                } else {
                    colorAttachmentInfo.beginAccesses = colorAttachmentInfo.endAccesses = gfx::AccessFlagBit::COLOR_ATTACHMENT_READ;
                    auto res = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(handle)));
                    builder.writeToBlackboard(handle, res);
                }
            }
        };

        auto goThroughComputeViews = [&](const ComputeViews &views) {
            for (const auto &pair : views) {
                for (const auto &view : pair.second) {
                    const auto handle = framegraph::FrameGraph::stringToHandle(view.name.c_str());
                    auto typedHandle = builder.readFromBlackboard(handle);
                    data.outputTexes.emplace_back();
                    auto &lastTex = data.outputTexes.back();
                    framegraph::Texture::Descriptor colorTexInfo;
                    colorTexInfo.format = gfx::Format::RGBA8;

                    // if (rasterView.second.accessType == AccessType::READ) {
                    colorTexInfo.usage = gfx::TextureUsage::INPUT_ATTACHMENT | gfx::TextureUsage::COLOR_ATTACHMENT;
                    //}
                    lastTex.first = view.accessType;
                    lastTex.second = static_cast<framegraph::TextureHandle>(typedHandle);

                    if (framegraph::Handle::IndexType(typedHandle) == framegraph::Handle::UNINITIALIZED) {
                        colorTexInfo.width = 960;
                        colorTexInfo.height = 640;

                        lastTex.second = builder.create(handle, colorTexInfo);
                    }

                    framegraph::RenderTargetAttachment::Descriptor colorAttachmentInfo;

                    if (view.accessType == AccessType::WRITE) {
                        lastTex.second = builder.write(lastTex.second);
                        builder.writeToBlackboard(handle, lastTex.second);
                    } else {
                        auto res = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(handle)));
                        builder.writeToBlackboard(handle, res);
                    }
                }
            }
        };

        goThroughRasterViews(info.rasterViews);
        goThroughComputeViews(info.computeViews);

        builder.setViewport({0U, 640U, 0U, 960U, 0.0F, 1.0F}, {0U, 0U, 960U, 640U});

        if (barrierMap.find(passID + 1) == barrierMap.end()) {
            return;
        }
        const auto &barrier = barrierMap.at(passID + 1);
        PassBarrierPair barrierPairs;
        fillBarriers(resourceGraph, barrier.blockBarrier, builder, barrierPairs);
        builder.setBarrier(barrierPairs);
    };

    auto forwardExec = [](const TestRenderData &data,
                          const framegraph::DevicePassResourceTable &table) {
        /*for(const auto& pair: data.outputTexes) {
            if(pair.first == AccessType::WRITE) {
                table.getWrite(pair.second);
            }
            if(pair.first == AccessType::READ) {
                table.getRead(pair.second);
            }
            if(pair.first == AccessType::READ_WRITE) {
                table.getRead(pair.second);
                table.getWrite(pair.second);
            }
        }*/
    };

    auto passHandle = framegraph::FrameGraph::stringToHandle(get(RenderGraph::NameTag{}, renderGraph, passID).c_str());

    string presentHandle;

    for (const auto &view : rasterViews) {
        // write or read_write
        if (view.second.accessType != AccessType::READ) {
            presentHandle = view.first;
            break;
        }
    }

    frameGraph.addPass<TestRenderData>(static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD), passHandle, forwardSetup, forwardExec);
}

static void runTestGraph(const RenderGraph &renderGraph, const ResourceGraph &resourceGraph, const LayoutGraphData &layoutGraphData, const FrameGraphDispatcher &fgDispatcher) {
    const auto &barriers = fgDispatcher.getBarriers();

    framegraph::FrameGraph framegraph;

    auto *device = gfx::Device::getInstance();
    if (!device) {
        device = gfx::DeviceManager::create();
    }

    for (const auto passID : makeRange(vertices(renderGraph))) {
        visitObject(
            passID, renderGraph,
            [&](const RasterPass &pass) {
                // TestRenderData tmpData;
                const auto &subpasses = get(SubpassGraph::SubpassTag{}, pass.subpassGraph);
                uint32_t count = 0;
                for (const auto &subpass : *subpasses.container) {
                    FrameGraphPassInfo info = {
                        framegraph,
                        renderGraph,
                        resourceGraph,
                        subpass.rasterViews,
                        subpass.computeViews,
                        fgDispatcher.getBarriers(),
                        passID,
                        true,
                        count < subpasses.container->size() - 1};
                    addPassToFrameGraph(info);
                    ++count;
                };
                if ((*subpasses.container).empty()) {
                    FrameGraphPassInfo info = {
                        framegraph,
                        renderGraph,
                        resourceGraph,
                        pass.rasterViews,
                        pass.computeViews,
                        fgDispatcher.getBarriers(),
                        passID,
                        false,
                        false};
                    addPassToFrameGraph(info);
                    ++count;
                }
            },
            [&](const ComputePass &pass) {
                // TestRenderData tmpData;
                FrameGraphPassInfo info = {
                    framegraph,
                    renderGraph,
                    resourceGraph,
                    {},
                    pass.computeViews,
                    fgDispatcher.getBarriers(),
                    passID,
                    false,
                    false};
                addPassToFrameGraph(info);
            },
            [&](const CopyPass &pass) {
                auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, TestRenderData &data) {
                    for (const auto &pair : pass.copyPairs) {
                        for (size_t i = 0; i < 2; ++i) {
                            bool write = (i % 2 == 0);
                            const auto handle = framegraph::FrameGraph::stringToHandle(write ? pair.target.c_str() : pair.source.c_str());
                            auto typedHandle = builder.readFromBlackboard(handle);
                            data.outputTexes.emplace_back();
                            auto &lastTex = data.outputTexes.back();
                            framegraph::Texture::Descriptor colorTexInfo;
                            colorTexInfo.format = gfx::Format::RGBA8;
                            colorTexInfo.usage = write ? gfx::TextureUsage::TRANSFER_DST : gfx::TextureUsage::TRANSFER_SRC;

                            lastTex.second = static_cast<framegraph::TextureHandle>(typedHandle);

                            if (framegraph::Handle::IndexType(typedHandle) == framegraph::Handle::UNINITIALIZED) {
                                colorTexInfo.width = 960;
                                colorTexInfo.height = 640;

                                lastTex.second = builder.create(handle, colorTexInfo);
                            }

                            if (write) {
                                lastTex.second = builder.write(lastTex.second);
                                builder.writeToBlackboard(handle, lastTex.second);
                            } else {
                                auto res = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(handle)));
                                builder.writeToBlackboard(handle, res);
                            }
                        }
                    }
                };

                auto forwardExec = [](const TestRenderData &data,
                                      const framegraph::DevicePassResourceTable &table) {
                };

                auto passHandle = framegraph::FrameGraph::stringToHandle(get(RenderGraph::NameTag{}, renderGraph, passID).c_str());
                framegraph.addPass<TestRenderData>(static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD), passHandle, forwardSetup, forwardExec);
            },
            [&](const RaytracePass &pass) {},
            [&](const auto & /*pass*/) {});
    }
    framegraph.compile();
    framegraph.execute();
    framegraph.reset();
}

#define TEST_CASE_DEFINE                                                                                          \
    using namespace cc::render;                                                                                   \
    using cc::gfx::AccessFlagBit;                                                                                 \
    using cc::gfx::BarrierType;                                                                                   \
    using cc::gfx::Format;                                                                                        \
    using cc::gfx::MemoryAccessBit;                                                                               \
    using cc::gfx::SampleCount;                                                                                   \
    using cc::gfx::ShaderStageFlagBit;                                                                            \
    using cc::gfx::TextureFlagBit;                                                                                \
    ResourceInfo resources = {                                                                                    \
        {"0",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"1",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"2",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"3",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"4",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"5",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"6",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"7",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"8",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"9",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"10",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"11",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"12",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"13",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"14",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"15",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"16",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"17",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"18",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"19",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"20",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"21",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"22",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::BACKBUFFER},                                                                         \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
    };

#define TEST_CASE_1                                            \
    TEST_CASE_DEFINE                                           \
                                                               \
    ViewInfo rasterData = {                                    \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{}, {"0", "1", "2"}},                         \
                {{"0", "1", "2"}, {"3"}},                      \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"3"}, {"22"}},                               \
            },                                                 \
        },                                                     \
    };                                                         \
                                                               \
    LayoutInfo layoutInfo = {                                  \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"22", 22, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        }};

#define TEST_CASE_2                                            \
    TEST_CASE_DEFINE                                           \
                                                               \
    ViewInfo rasterData = {                                    \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{}, {"0", "1"}},                              \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"0"}, {"2", "3"}},                           \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"4", "5"}},                           \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"3", "5"}, {"6"}},                           \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"2", "4", "6"}, {"7"}},                      \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{}, {"8"}},                                   \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"0", "8"}, {"9"}},                           \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"7", "9"}, {"22"}},                          \
            },                                                 \
        },                                                     \
    };                                                         \
                                                               \
    LayoutInfo layoutInfo = {                                  \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::VERTEX},     \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"4", 4, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"6", 6, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"4", 4, cc::gfx::ShaderStageFlagBit::VERTEX},     \
            {"6", 6, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"7", 7, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"8", 8, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"8", 8, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"9", 9, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"7", 7, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"9", 9, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"22", 22, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
    };

#define TEST_CASE_3                                            \
    TEST_CASE_DEFINE                                           \
                                                               \
    ViewInfo rasterData = {                                    \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{}, {"0"}},                                   \
                {{"0"}, {"1"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"2"}},                                \
                {{"2"}, {"3"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"3"}, {"4"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"4"}, {"5"}},                                \
                {{"5"}, {"6"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::COPY,                                    \
            {                                                  \
                {{"3"}, {"7"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::COPY,                                    \
            {                                                  \
                {{"7"}, {"8"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"9"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"14"}},                               \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::COPY,                                    \
            {                                                  \
                {{"14"}, {"15"}},                              \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"15", "9"}, {"10"}},                         \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"16"}},                               \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::COPY,                                    \
            {                                                  \
                {{"16"}, {"17"}},                              \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"8", "10", "17"}, {"11"}},                   \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"11", "5", "6"}, {"12"}},                    \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"12"}, {"22"}},                              \
            },                                                 \
        },                                                     \
    };                                                         \
                                                               \
    LayoutInfo layoutInfo = {                                  \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::VERTEX},     \
            {"4", 4, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"4", 4, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"6", 6, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"7", 7, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"7", 7, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"8", 8, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"9", 9, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"14", 14, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"14", 14, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"15", 15, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"15", 15, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"9", 9, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"10", 10, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"16", 16, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"16", 16, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"17", 17, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"8", 8, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"10", 10, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"17", 17, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"11", 11, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"6", 6, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"11", 11, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"12", 12, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"12", 12, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
            {"22", 22, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
    };

#define TEST_CASE_4                                            \
    TEST_CASE_DEFINE                                           \
                                                               \
    ViewInfo rasterData = {                                    \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{}, {"0"}},                                   \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"0"}, {"1"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"1"}, {"2"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"0"}, {"3"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"3"}, {"19"}},                               \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"3"}, {"5"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"5"}, {"6"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"2"}, {"7"}},                                \
                {{"7"}, {"20"}},                               \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"2", "21"}, {"8"}},                          \
                {{"8"}, {"9"}},                                \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::RASTER,                                  \
            {                                                  \
                {{"2"}, {"22"}},                               \
            },                                                 \
        },                                                     \
    };                                                         \
                                                               \
    LayoutInfo layoutInfo = {                                  \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"0", 0, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"19", 19, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"5", 5, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"6", 6, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
        },                                                     \
        {                                                      \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"7", 7, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"20", 20, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"8", 8, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"9", 9, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"21", 21, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"2", 2, cc::gfx::ShaderStageFlagBit::FRAGMENT},   \
            {"22", 22, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
    };
} // namespace render
} // namespace cc
