/*Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "../Range.h"
#include "../RenderGraphGraphs.h"
#include "../RenderGraphTypes.h"
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
        rescGraph.states[rescVertexID] = std::get<3>(resc);
    }

    const auto &mem_resource = layoutGraphData.get_allocator();
    auto &stages = layoutGraphData.stages;
    stages.resize(layoutInfo.size());

    for (size_t i = 0; i < layoutInfo.size(); ++i) {
        const ccstd::string passName = "pass" + std::to_string(i);
        auto layoutVtxID = add_vertex(layoutGraphData, RenderStageTag{}, passName.c_str());

        for (size_t j = 0; j < layoutInfo[i].size(); ++j) {
            const auto &renderStageInfo = layoutInfo[i];
            for (const auto &layoutUnit : renderStageInfo) {
                const auto &rescName = std::get<0>(layoutUnit);
                const auto &nameID = std::get<1>(layoutUnit);
                const auto &shaderStage = std::get<2>(layoutUnit);
                if (layoutGraphData.attributeIndex.find(rescName) == layoutGraphData.attributeIndex.end()) {
                    layoutGraphData.attributeIndex.emplace(std::make_pair<string, NameLocalID>(rescName.c_str(), NameLocalID{nameID}));
                }
                stages[i].descriptorVisibility.emplace(NameLocalID{nameID}, shaderStage);
            }
        }
    }

    std::set<ccstd::string> nameSet;
    auto addRasterNode = [&](const vector<vector<vector<string>>> &subpasses, uint32_t count, uint32_t passID) {
        const ccstd::string name = "pass" + std::to_string(passID);
        const auto vertexID = add_vertex(renderGraph, RasterTag{}, name.c_str());
        auto &raster = get(RasterTag{}, vertexID, renderGraph);
        auto &subpassGraph = raster.subpassGraph;

        bool hasSubpass = count > 1;

        RasterSubpass *subpass = nullptr;

        for (size_t j = 0; j < count; ++j) {
            assert(subpasses[j].size() == 2); // inputs and outputs
            const auto &attachments = subpasses[j];
            bool isOutput = false;

            RasterSubpass *subpass = nullptr;
            if (hasSubpass) {
                const ccstd::string subpassName = "subpass" + std::to_string(passID);
                auto subpassVertexID = add_vertex(subpassGraph, subpassName.c_str());
                subpass = &get(SubpassGraph::Subpass, subpassGraph, subpassVertexID);
            }

            for (size_t k = 0; k < attachments.size(); ++k) {
                for (size_t l = 0; l < attachments[k].size(); ++l) {
                    const auto &inputsOrOutputs = attachments[k];
                    const auto &viewName = inputsOrOutputs[l];
                    bool firstMeet = nameSet.find(viewName.c_str()) == nameSet.end();
                    if (firstMeet) {
                        nameSet.emplace(viewName);
                    }

                    auto &rasterViews = hasSubpass ? (*subpass).rasterViews : raster.rasterViews;
                    rasterViews.emplace(viewName.c_str(), RasterView{
                                                              viewName.c_str(),
                                                              isOutput ? AccessType::WRITE : AccessType::READ,
                                                              AttachmentType::RENDER_TARGET,
                                                              firstMeet ? gfx::LoadOp::CLEAR : gfx::LoadOp::LOAD,
                                                              gfx::StoreOp::STORE,
                                                              gfx::ClearFlagBit::ALL,
                                                              gfx::Color({1.0, 0.0, 0.0, 1.0}),
                                                          });
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

                computePass.computeViews.emplace(name, ccstd::pmr::vector<ComputeView>{});
                computePass.computeViews.at(name.c_str()).emplace_back();
                computePass.computeViews.at(name.c_str()).emplace_back();
                computePass.computeViews.at(name.c_str()).front().name = inputs.front();
                computePass.computeViews.at(name.c_str()).front().accessType = AccessType::READ;
                computePass.computeViews.at(name.c_str()).back().name = outputs.front();
                computePass.computeViews.at(name.c_str()).back().accessType = AccessType::WRITE;

                break;
            }
            case PassType::PRESENT: {
                // const string name = pass.first;
                const auto &subpasses = pass.second;
                // addRasterNode(subpasses, subpasses.size() - 1, passCount++);

                const ccstd::string name = "pass" + std::to_string(passCount++);
                const auto vertexID = add_vertex(renderGraph, PresentTag{}, name.c_str());
                assert(subpasses.back().size() == 2); // inputs and outputs
                assert(subpasses.back()[1].empty());  // present pass no output
                auto &presentPass = get(PresentTag{}, vertexID, renderGraph);
                const auto &resName = subpasses.back()[0].back();
                if (presentPass.presents.find(resName.c_str()) == presentPass.presents.end()) {
                    // ?
                    presentPass.presents.emplace(resName.c_str(), Present{0, 0});
                }
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
            const auto &name = get(ResourceGraph::Name, resourceGraph, resBarrier.resourceID);
            const auto &desc = get(ResourceGraph::Desc, resourceGraph, resBarrier.resourceID);
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
    auto &barrierMap = info.barrierMap;
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

    auto passHandle = framegraph::FrameGraph::stringToHandle(get(RenderGraph::Name, renderGraph, passID).c_str());

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
                const auto &subpasses = get(SubpassGraph::Subpass, pass.subpassGraph);
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

                auto passHandle = framegraph::FrameGraph::stringToHandle(get(RenderGraph::Name, renderGraph, passID).c_str());
                framegraph.addPass<TestRenderData>(static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD), passHandle, forwardSetup, forwardExec);
            },
            [&](const RaytracePass &pass) {},
            [&](const PresentPass &pass) {
                auto forwardSetup = [&](framegraph::PassNodeBuilder &builder, TestRenderData &data) {
                    for (const auto &pair : pass.presents) {
                        auto *externalRes = gfx::Device::getInstance()->createTexture(gfx::TextureInfo{
                            gfx::TextureType::TEX2D,
                            gfx::TextureUsageBit::COLOR_ATTACHMENT,
                            gfx::Format::RGBA8,
                            960,
                            640,
                        });

                        const auto handle = framegraph::FrameGraph::stringToHandle(pair.first.c_str());
                        auto typedHandle = builder.readFromBlackboard(handle);
                        data.outputTexes.emplace_back();
                        auto &lastTex = data.outputTexes.back();
                        framegraph::Texture::Descriptor colorTexInfo;
                        colorTexInfo.format = gfx::Format::RGBA8;
                        colorTexInfo.usage = gfx::TextureUsage::SAMPLED;

                        lastTex.second = static_cast<framegraph::TextureHandle>(typedHandle);

                        if (framegraph::Handle::IndexType(typedHandle) == framegraph::Handle::UNINITIALIZED) {
                            colorTexInfo.width = 960;
                            colorTexInfo.height = 640;

                            lastTex.second = builder.create(handle, colorTexInfo);
                        }

                        auto res = builder.read(framegraph::TextureHandle(builder.readFromBlackboard(handle)));
                        builder.writeToBlackboard(handle, res);

                        framegraph.presentFromBlackboard(framegraph::FrameGraph::stringToHandle(pair.first.c_str()), externalRes, false);
                    }
                };

                auto forwardExec = [](const TestRenderData &data,
                                      const framegraph::DevicePassResourceTable &table) {
                };
                auto passHandle = framegraph::FrameGraph::stringToHandle(get(RenderGraph::Name, renderGraph, passID).c_str());
                framegraph.addPass<TestRenderData>(static_cast<uint32_t>(ForwardInsertPoint::IP_FORWARD), passHandle, forwardSetup, forwardExec);
            },
            [&](const auto & /*pass*/) {});
    }
    framegraph.compile();
    framegraph.execute();
    framegraph.reset();
}

#define TEST_CASE_DEFINE                                                                                                                                                     \
    using namespace cc::render;                                                                                                                                              \
    using cc::gfx::AccessFlagBit;                                                                                                                                            \
    using cc::gfx::BarrierType;                                                                                                                                              \
    using cc::gfx::Format;                                                                                                                                                   \
    using cc::gfx::MemoryAccessBit;                                                                                                                                          \
    using cc::gfx::SampleCount;                                                                                                                                              \
    using cc::gfx::ShaderStageFlagBit;                                                                                                                                       \
    using cc::gfx::TextureFlagBit;                                                                                                                                           \
    ResourceInfo resources = {                                                                                                                                               \
        {"0",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"1",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"2",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"3",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"4",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"5",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"6",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"7",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"8",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"9",                                                                                                                                                                \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"10",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"11",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"12",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"13",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"14",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"15",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"16",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"17",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"18",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"19",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
        {"20",                                                                                                                                                               \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::ONE, TextureFlagBit::NONE, ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT}, \
         {ResourceResidency::MANAGED},                                                                                                                                       \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                                                                             \
    };

#define TEST_CASE_1                                                      \
    TEST_CASE_DEFINE                                                     \
                                                                         \
    ViewInfo rasterData = {                                              \
        {                                                                \
            PassType::RASTER,                                            \
            {                                                            \
                {{}, {"0", "1", "2"}},                                   \
                {{"0", "1", "2"}, {"3"}},                                \
            },                                                           \
        },                                                               \
        {                                                                \
            PassType::RASTER,                                            \
            {                                                            \
                {{"3"}, {"5"}},                                          \
            },                                                           \
        },                                                               \
        {                                                                \
            PassType::PRESENT,                                           \
            {                                                            \
                {{"5"}, {}},                                             \
            },                                                           \
        },                                                               \
    };                                                                   \
                                                                         \
    LayoutInfo layoutInfo = {                                            \
        {                                                                \
            {"0", 0, cc::gfx::ShaderStageFlagBit::VERTEX},               \
            {"1", 1, cc::gfx::ShaderStageFlagBit::FRAGMENT},             \
            {"2", 2, cc::gfx::ShaderStageFlagBit::VERTEX},               \
            {"3", 3, cc::gfx::ShaderStageFlagBit::FRAGMENT},             \
        },                                                               \
        {                                                                \
            {"3", 3, cc::gfx::ShaderStageFlagBit::VERTEX},               \
            {"5", 5, cc::gfx::ShaderStageFlagBit::VERTEX},               \
        },                                                               \
        {                                                                \
            {"5", 5, cc::gfx::ShaderStageFlagBit::COMPUTE /*whatever*/}, \
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
                {{"7", "9"}, {"10"}},                          \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::PRESENT,                                 \
            {                                                  \
                {{"10"}, {}},                                  \
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
            {"10", 10, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"10", 10, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
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
            PassType::COMPUTE,                                 \
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
            PassType::COMPUTE,                                 \
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
            PassType::COMPUTE,                                 \
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
                {{"12"}, {"13"}},                              \
            },                                                 \
        },                                                     \
        {                                                      \
            PassType::PRESENT,                                 \
            {                                                  \
                {{"13"}, {}},                                  \
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
            {"1", 1, cc::gfx::ShaderStageFlagBit::VERTEX},     \
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
            {"13", 13, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
        {                                                      \
            {"13", 13, cc::gfx::ShaderStageFlagBit::FRAGMENT}, \
        },                                                     \
    };

/*
void testCase1() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraph(resource);

    ResourceInfo resources = {
        {"0", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"1", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"2", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"3", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"4", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"5", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"6", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"7", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"8", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"9", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"10", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"11", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"12", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"13", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"14", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"15", gfx::DESCRIPTOR_TEXTURE_TYPE},
    };

    ViewInfo data = {
        {
            PassType::RASTER,
            {
                {{}, {"0", "1", "2"}},
                {{"0", "1", "2", "4"}, {"3"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"3"}, {"5"}},
            },
        },
        {
            PassType::PRESENT,
            {
                {{"5"}, {}},
            },
        },
    };

    using ShaderStageMap = map<string, gfx::ShaderStageFlagBit>;

    LayoutInfo layoutInfo = {
        {
            {"0", 0, gfx::ShaderStageFlagBit::VERTEX},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"2", 2, gfx::ShaderStageFlagBit::VERTEX},
        },
        {
            {"0", 0, gfx::ShaderStageFlagBit::VERTEX},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"2", 2, gfx::ShaderStageFlagBit::VERTEX},
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
            {"4", 4, gfx::ShaderStageFlagBit::VERTEX},
        },
        {
            {"3", 3, gfx::ShaderStageFlagBit::VERTEX},
            {"5", 5, gfx::ShaderStageFlagBit::VERTEX},
        },
        {
            {"5", 5, gfx::ShaderStageFlagBit::COMPUTE},
        }};

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase2() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraph(resource);

    ResourceInfo resources = {
        {"0", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"1", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"2", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"3", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"4", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"5", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"6", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"7", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"8", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"9", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"10", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"11", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"12", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"13", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"14", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"15", gfx::DESCRIPTOR_TEXTURE_TYPE},
    };

    ViewInfo data = {
        {
            PassType::RASTER,
            {
                {{}, {"0", "1"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"0"}, {"2", "3"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"4", "5"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"3", "5"}, {"6"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"2", "4", "6"}, {"7"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{}, {"8"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"0", "8"}, {"9"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"7", "9"}, {"10"}},
            },
        },
        {
            PassType::PRESENT,
            {
                {{"10"}, {}},
            },
        },
    };

    LayoutInfo layoutInfo = {
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"0", 0, gfx::ShaderStageFlagBit::VERTEX},
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"4", 4, gfx::ShaderStageFlagBit::FRAGMENT},
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
            {"4", 4, gfx::ShaderStageFlagBit::VERTEX},
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
            {"9", 9, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
            {"9", 9, gfx::ShaderStageFlagBit::FRAGMENT},
            {"10", 10, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"10", 10, gfx::ShaderStageFlagBit::FRAGMENT},
        },
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase3() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraph(resource);

    ResourceInfo resources = {
        {"0", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"1", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"2", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"3", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"4", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"5", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"6", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"7", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"8", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"9", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"10", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"11", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"12", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"13", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"14", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"15", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"16", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"17", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"18", gfx::DESCRIPTOR_TEXTURE_TYPE},
    };

    ViewInfo data = {
        {
            PassType::RASTER,
            {
                {{}, {"0"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"0"}, {"1"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"2"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"2"}, {"3"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"3"}, {"4"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"4"}, {"5"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"5"}, {"6"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"3"}, {"7"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"7"}, {"8"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"9"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"14"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"14"}, {"15"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"15", "9"}, {"10"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"16"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"16"}, {"17"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"8", "10", "17"}, {"11"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"11", "6"}, {"12"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"12"}, {"13"}},
            },
        },
        {
            PassType::PRESENT,
            {
                {{"13"}, {}},
            },
        },
    };

    using ShaderStageMap = map<string, gfx::ShaderStageFlagBit>;

    LayoutInfo layoutInfo = {
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
            {"4", 4, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"4", 4, gfx::ShaderStageFlagBit::FRAGMENT},
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"9", 9, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"14", 14, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"14", 14, gfx::ShaderStageFlagBit::FRAGMENT},
            {"15", 15, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"15", 15, gfx::ShaderStageFlagBit::FRAGMENT},
            {"9", 9, gfx::ShaderStageFlagBit::FRAGMENT},
            {"10", 10, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"16", 16, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"16", 16, gfx::ShaderStageFlagBit::FRAGMENT},
            {"17", 17, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
            {"10", 10, gfx::ShaderStageFlagBit::FRAGMENT},
            {"17", 17, gfx::ShaderStageFlagBit::FRAGMENT},
            {"11", 11, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
            {"11", 11, gfx::ShaderStageFlagBit::FRAGMENT},
            {"12", 12, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"12", 12, gfx::ShaderStageFlagBit::FRAGMENT},
            {"13", 13, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"13", 13, gfx::ShaderStageFlagBit::FRAGMENT},
        },
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase4() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph renderGraph(resource);
    ResourceGraph rescGraph(resource);
    LayoutGraphData layoutGraph(resource);

    ResourceInfo resources = {
        {"0", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"1", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"2", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"3", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"4", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"5", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"6", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"7", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"8", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"9", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"10", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"11", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"12", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"13", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"14", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"15", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"16", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"17", gfx::DESCRIPTOR_TEXTURE_TYPE},
        {"18", gfx::DESCRIPTOR_TEXTURE_TYPE},
    };

    ViewInfo data = {
        {
            PassType::RASTER,
            {
                {{}, {"0"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"0"}, {"1"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"2"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"2"}, {"3"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"4"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"4"}, {"5"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"1"}, {"6"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"6"}, {"7"}},
            },
        },
        {
            PassType::RASTER,
            {
                {{"7", "5", "3"}, {"8"}},
            },
        },
        {
            PassType::PRESENT,
            {
                {{"8"}, {}},
            },
        }};

    using ShaderStageMap = map<string, gfx::ShaderStageFlagBit>;

    LayoutInfo layoutInfo = {
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"0", 0, gfx::ShaderStageFlagBit::FRAGMENT},
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"2", 2, gfx::ShaderStageFlagBit::FRAGMENT},
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"4", 4, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"4", 4, gfx::ShaderStageFlagBit::FRAGMENT},
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"1", 1, gfx::ShaderStageFlagBit::FRAGMENT},
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"6", 6, gfx::ShaderStageFlagBit::FRAGMENT},
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"3", 3, gfx::ShaderStageFlagBit::FRAGMENT},
            {"5", 5, gfx::ShaderStageFlagBit::FRAGMENT},
            {"7", 7, gfx::ShaderStageFlagBit::FRAGMENT},
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
        },
        {
            {"8", 8, gfx::ShaderStageFlagBit::FRAGMENT},
        },
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}
*/
} // namespace render
} // namespace cc
