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

#include <algorithm>
#include <memory>
#include <string>
#include <variant>
#include "../FGDispatcherTypes.h"
#include "../LayoutGraphGraphs.h"
#include "../NativePipelineTypes.h"
#include "../RenderGraphGraphs.h"
#include "../RenderGraphTypes.h"

namespace cc {

namespace render {

using ccstd::pmr::string;
using std::map;
using std::pair;
using std::vector;
using ViewInfo     = vector<pair<PassType, vector<vector<vector<string>>>>>;
using ResourceInfo = vector<pair<string, gfx::DescriptorType>>;
using LayoutInfo   = vector<vector<pair<UpdateFrequency, vector<pair<gfx::ShaderStageFlagBit, vector<pair<DescriptorIndex, vector<string>>>>>>>>;

void testData(const ViewInfo &rasterData, const ResourceInfo &rescInfo, const LayoutInfo &layoutInfo, RenderGraph &renderGraph, ResourceGraph &rescGraph, LayoutGraphData &layoutGraphData) {
    for (const auto &resc : rescInfo) {
        string name         = std::get<0>(resc);
        auto   rescVertexID = add_vertex(rescGraph, ManagedTag{}, name.c_str());
    }

    const auto &mem_resource = layoutGraphData.get_allocator();

    for (size_t i = 0; i < layoutInfo.size(); ++i) {
        const ccstd::string name        = "pass" + std::to_string(i);
        auto                layoutVtxID = add_vertex(layoutGraphData, RenderStageTag{}, name.c_str());
        auto &              layouts     = get(LayoutGraphData::Layout, layoutGraphData, layoutVtxID);

        for (size_t j = 0; j < layoutInfo[i].size(); ++j) {
            const auto &    freqPair = layoutInfo[i][j];
            UpdateFrequency freq     = freqPair.first;

            DescriptorSetData descSetData(mem_resource);

            const auto &dsData = freqPair.second;
            for (size_t k = 0; k < dsData.size(); ++k) {
                gfx::ShaderStageFlagBit shaderStage = dsData[k].first;
                DescriptorTableData     dsTableData(mem_resource);

                for (size_t l = 0; l < dsData[k].second.size(); ++l) {
                    DescriptorBlockData blockData(mem_resource);
                    const auto &        dsTypePair = dsData[k].second[l];
                    DescriptorIndex     index      = dsTypePair.first;
                    for (size_t m = 0; m < dsTypePair.second.size(); ++m) {
                        const string & resName = dsTypePair.second[m];
                        DescriptorData ds;
                        ds.descriptorID = rescGraph.valueIndex[resName];
                        blockData.descriptors.emplace_back(ds);
                    }
                    dsTableData.descriptorBlocks.emplace_back(blockData);
                }
                descSetData.tables.emplace(shaderStage, dsTableData);
            }
            layouts.descriptorSets.emplace(freq, descSetData);
        }
    }

    uint32_t passCount = 0;
    for (size_t i = 0; i < rasterData.size(); ++i) {
        const auto &pass = rasterData[i];
        switch (pass.first) {
            case PassType::RASTER: {
                // const string name = pass.first;
                const auto &subpasses = pass.second;
                for (size_t j = 0; j < subpasses.size(); ++j) {
                    const ccstd::string name     = "pass" + std::to_string(passCount++);
                    const auto          vertexID = add_vertex(renderGraph, RasterTag{}, name.c_str());
                    assert(subpasses[j].size() == 2); // inputs and outputs
                    const auto &attachments = subpasses[j];
                    auto &      raster      = get(RasterTag{}, vertexID, renderGraph);
                    bool        isOutput    = false;

                    for (size_t k = 0; k < attachments.size(); ++k) {
                        for (size_t l = 0; l < attachments[k].size(); ++l) {
                            const auto &inputsOrOutputs = attachments[k];
                            const auto &viewName        = inputsOrOutputs[l];
                            raster.rasterViews.emplace(viewName.c_str(), RasterView{
                                                           viewName.c_str(),
                                                           isOutput ? AccessType::WRITE : AccessType::READ,
                                                           AttachmentType::RENDER_TARGET,
                                                           gfx::LoadOp::CLEAR,
                                                           gfx::StoreOp::STORE,
                                                           gfx::ClearFlagBit::ALL,
                                                           gfx::Color({1.0, 0.0, 0.0, 1.0}),
                                                       });
                        }
                        isOutput = true;
                    }
                }
            }
        }
    }

    FrameGraphDispatcher fgDispatcher(rescGraph, renderGraph, layoutGraphData, layoutGraphData.resource(), layoutGraphData.resource());
    // fgDispatcher.buildBarriers();
    fgDispatcher.passReorder();

    // fill resource graph
}

void testCase1() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph                             renderGraph(resource);
    ResourceGraph                           rescGraph(resource);
    LayoutGraphData                         layoutGraph(resource);

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
        }};

    using ShaderStageMap  = map<string, gfx::ShaderStageFlagBit>;
    LayoutInfo layoutInfo = {
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::VERTEX, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0", "2"},
                    },
                }},
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {DescriptorIndex::TEXTURE, {"1"}},
                }},
            }}}},
        {{UpdateFrequency::PER_PASS, {
            {
                {gfx::ShaderStageFlagBit::VERTEX, {{
                    DescriptorIndex::SAMPLER_TEXTURE,
                    {"0", "2"},
                },
                    {
                        DescriptorIndex::TEXTURE,
                        {"4"},
                    }}},
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "3"},
                    },
                }},
            },
        }}},
        {{UpdateFrequency::PER_BATCH, {
            {
                {gfx::ShaderStageFlagBit::VERTEX, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"3", "5"},
                    },
                }},
            },
        }}},
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase2() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph                             renderGraph(resource);
    ResourceGraph                           rescGraph(resource);
    LayoutGraphData                         layoutGraph(resource);

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

    };

    LayoutInfo layoutInfo = {
        {
            {
                UpdateFrequency::PER_BATCH,
                {{
                    {gfx::ShaderStageFlagBit::FRAGMENT, {{
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0", "1"},
                    }}},
                }},
            },
        },
        {
            {
                UpdateFrequency::PER_PASS,
                {{
                    {gfx::ShaderStageFlagBit::VERTEX, {{
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0"},
                    }}},
                    {gfx::ShaderStageFlagBit::FRAGMENT, {{
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"2", "3"},
                    }}},
                }},
            },

        },
        {{
            UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"4", "5"},
                    },
                    {
                        DescriptorIndex::TEXTURE,
                        {"1"},
                    },
                }},
            }},
        }

        },
        {{
            UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"3", "5", "6"},
                    },
                }},
            }},
        }

        },
        {{
            UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"2"},
                    },
                }},
            }},
        },
            {
                UpdateFrequency::PER_QUEUE,
                {{
                    {
                        gfx::ShaderStageFlagBit::VERTEX,
                        {
                            {
                                DescriptorIndex::SAMPLER_TEXTURE,
                                {"4"},
                            },
                        },
                    },
                    {gfx::ShaderStageFlagBit::FRAGMENT, {{
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"6"},
                    },
                        {
                            DescriptorIndex::TEXTURE,
                            {"7"},
                        }}},
                }},
            }},
        {
            {
                UpdateFrequency::PER_PASS,
                {{
                    {gfx::ShaderStageFlagBit::FRAGMENT, {
                        {
                            DescriptorIndex::SAMPLER_TEXTURE,
                            {"8"},
                        },
                    }},
                }},
            },
        },
        {
            {
                UpdateFrequency::PER_PASS,
                {{
                    {gfx::ShaderStageFlagBit::FRAGMENT, {
                        {
                            DescriptorIndex::SAMPLER_TEXTURE,
                            {"0", "8", "9"},
                        },
                    }},
                }},
            },
        },
        {
            {
                UpdateFrequency::PER_PASS,
                {{
                    {gfx::ShaderStageFlagBit::FRAGMENT, {
                        {
                            DescriptorIndex::SAMPLER_TEXTURE,
                            {"7", "9", "10"},
                        },
                    }},
                }},
            },
        }

    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase3() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph                             renderGraph(resource);
    ResourceGraph                           rescGraph(resource);
    LayoutGraphData                         layoutGraph(resource);

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
    };

    using ShaderStageMap  = map<string, gfx::ShaderStageFlagBit>;
    LayoutInfo layoutInfo = {
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0", "1"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "2"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"2", "3"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"3", "4"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"4", "5"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"5", "6"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"3", "7"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"7", "8"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "9"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "14"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"14", "15"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"15", "9", "10"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS, {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "16"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS, {{
                                         {gfx::ShaderStageFlagBit::FRAGMENT, {
                                                                                 {
                                                                                     DescriptorIndex::SAMPLER_TEXTURE,
                                                                                     {"16", "17"},
                                                                                 },
                                                                             }},
                                     }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"8", "10", "17", "11"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
DescriptorIndex::SAMPLER_TEXTURE,
                        {"6", "11", "12"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"12", "13"},
                    },
                }},
            }}}},
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}

void testCase4() {
    boost::container::pmr::memory_resource *resource = boost::container::pmr::get_default_resource();
    RenderGraph                             renderGraph(resource);
    ResourceGraph                           rescGraph(resource);
    LayoutGraphData                         layoutGraph(resource);

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
        } 
    };

    using ShaderStageMap  = map<string, gfx::ShaderStageFlagBit>;
    LayoutInfo layoutInfo = {
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"0", "1"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "2"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"2", "3"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "4"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"4", "5"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"1", "6"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"6", "7"},
                    },
                }},
            }}}},
        {{UpdateFrequency::PER_PASS,
            {{
                {gfx::ShaderStageFlagBit::FRAGMENT, {
                    {
                        DescriptorIndex::SAMPLER_TEXTURE,
                        {"3", "5", "7", "8"},
                    },
                }},
            }}}}
    };

    testData(data, resources, layoutInfo, renderGraph, rescGraph, layoutGraph);
    // for(const auto* camera : cameras) {}
}



} // namespace render
} // namespace cc
