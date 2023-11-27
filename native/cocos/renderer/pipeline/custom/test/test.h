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

    add_vertex(layoutGraphData, RenderPhaseTag{}, "default");
    auto &layout = layoutGraphData.layouts.back();
    const auto &descPair = layout.descriptorSets.emplace(UpdateFrequency::PER_PASS, DescriptorSetData{renderGraph.get_allocator()});
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
        auto& layoutName = get(RenderGraph::LayoutTag{}, renderGraph, vertexID);
        layoutName = "default";

        renderGraph.sortedVertices.emplace_back(vertexID);
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

                    auto &views = hasSubpass ? (*subpass).rasterViews : raster.rasterViews;
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
                    views.emplace(viewName.c_str(), view);
                    if (subpassViews) {
                        subpassViews->emplace(viewName.c_str(), view);

                        const auto newID = static_cast<uint32_t>(raster.attachmentIndexMap.size());
                        auto iter = raster.attachmentIndexMap.find(viewName);
                        if (iter == raster.attachmentIndexMap.end()) {
                            raster.attachmentIndexMap.emplace(viewName, newID);
                        }
                        rasterViews.emplace(viewName, view);
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
                renderGraph.sortedVertices.emplace_back(vertexID);

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
                renderGraph.sortedVertices.emplace_back(vertexID);
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
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"1",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"2",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"3",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"4",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"5",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"6",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"7",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"8",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"9",                                                                                                     \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"10",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"11",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"12",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"13",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"14",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"15",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"16",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"17",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"18",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::MANAGED},                                                                            \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"19",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"20",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"21",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
          ResourceFlags::SAMPLED | ResourceFlags::COLOR_ATTACHMENT | ResourceFlags::INPUT_ATTACHMENT},            \
         {ResourceResidency::EXTERNAL},                                                                           \
         {AccessFlagBit::FRAGMENT_SHADER_READ_TEXTURE | AccessFlagBit::COLOR_ATTACHMENT_WRITE}},                  \
        {"22",                                                                                                    \
         {ResourceDimension::TEXTURE2D, 4, 960, 640, 1, 0, Format::RGBA8, SampleCount::X1, TextureFlagBit::NONE, \
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
