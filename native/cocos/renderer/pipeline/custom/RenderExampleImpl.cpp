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

#include <cocos/renderer/pipeline/custom/Range.h>
#include <boost/graph/depth_first_search.hpp>
#include <boost/graph/reverse_graph.hpp>
#include <tuple>
#include "RenderExampleGraphs.h"
#include "RenderGraphGraphs.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphTypes.h"
#include "RenderCommonTypes.h"
#include "RenderExampleTypes.h"
#include "RenderGraphFwd.h"

namespace cc {

namespace render {

namespace example {

using RDG = RenderDependencyGraph;
using RESG = ResourceGraph;

namespace {

// validation
void checkComputeValue(const PmrTransparentMap<PmrString, boost::container::pmr::vector<ComputeView>>& values0) {
    for (const auto& pair : values0) {
        const auto& name   = pair.first;
        const auto& values = pair.second;
        bool        bWrite = false;
        int         count  = 0;
        for (const auto& v : values) {
            if (v.clearFlags != gfx::ClearFlagBit::NONE) {
                if (!v.isWrite()) {
                    throw std::invalid_argument("only write state support uav clear");
                }
            }
            if (count++ == 0) {
                bWrite = v.isWrite();
            } else {
                if (v.isWrite() != bWrite) {
                    throw std::invalid_argument("compute value read/write state inconsistent");
                }
            }
        }
    }
};

} // namespace

int RenderCompiler::validate() const {
    const auto& rg = graph;
    const auto& lg = layoutGraph;
    try {
        for (const auto& vertID : makeRange(vertices(rg))) {
            visitObject(
                vertID, rg,
                [&](const RasterPass& pass) {
                    checkComputeValue(pass.computeViews);
                },
                [&](const ComputePass& pass) {
                    checkComputeValue(pass.computeViews);
                },
                [&](const auto& /*pass*/) {
                });
        }
    } catch (const std::invalid_argument&) {
        return 1;
    }

    return 0;
}

int RenderCompiler::audit(std::ostream& oss) const { // NOLINT
    return 0;
}

namespace {

void addPassNodeValue(RenderPassNode& node, PmrFlatSet<uint32_t>& values,
                      const uint32_t valueID, AccessType type) {
    // add to values
    values.emplace(valueID);
    // add to inputs and outputs
    // inputs and outputs may overlap
    switch (type) {
        case AccessType::READ:
            node.inputs.emplace(valueID);
            break;
        case AccessType::READ_WRITE:
            node.outputs.emplace(valueID);
            node.inputs.emplace(valueID);
            break;
        case AccessType::WRITE:
            node.outputs.emplace(valueID);
            break;
        default:
            break;
    }
}

void addPassNodeValue(RenderDependencyGraph& rdg,
                      RenderPassNode& node, PmrFlatSet<uint32_t>& values,
                      const PmrString& valueName, AccessType type) {
    auto iter = rdg.valueIndex.find(valueName);
    if (iter == rdg.valueIndex.end()) {
        rdg.valueIndex.emplace(valueName, uint32_t(rdg.valueNames.size()));
        rdg.valueNames.emplace_back(valueName);
        CC_ENSURES(rdg.valueIndex.size() == rdg.valueNames.size());
    }
    addPassNodeValue(node, values, iter->second, type);
}

void buildRenderDependencyGraph(const RenderGraph& rg, RenderDependencyGraph& rdg) {
    size_t numPasses = 1; // additional init pass is the first pass
    numPasses += rg.rasterPasses.size();
    numPasses += rg.computePasses.size();
    numPasses += rg.copyPasses.size();
    numPasses += rg.movePasses.size();
    numPasses += rg.raytracePasses.size();
    rdg.passIDs.reserve(numPasses);
    rdg.valueIndex.reserve(128);
    rdg.valueNames.reserve(128);

    // add initial pass, whose id must be 0
    auto startID = add_vertex(rdg, 0xFFFFFFFF);
    CC_EXPECTS(startID == 0);

    auto makeAccessType = [](const boost::container::pmr::vector<ComputeView>& values) {
        CC_EXPECTS(!values.empty());
        AccessType type = values[0].accessType;
        for (uint32_t i = 1; i != values.size(); ++i) {
            const auto& value = values[i];
            if (value.isRead()) {
                if (type == AccessType::WRITE) {
                    type = AccessType::READ_WRITE;
                }
            }
            if (value.isWrite()) {
                if (type == AccessType::READ) {
                    type = AccessType::READ_WRITE;
                }
            }
        }
        return type;
    };

    for (const auto passID : makeRange(vertices(rg))) {
        visitObject(
            passID, rg,
            [&](const RasterPass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);
                for (const auto& pair : pass.rasterViews) {
                    const auto& valueName = pair.first;
                    const auto& value     = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, value.accessType);
                }
                for (const auto& pair : pass.computeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const ComputePass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);
                for (const auto& pair : pass.computeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const CopyPass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);

                for (const auto& pair : pass.copyPairs) {
                    addPassNodeValue(rdg, node, valueIDs, pair.source, AccessType::READ);
                    addPassNodeValue(rdg, node, valueIDs, pair.target, AccessType::WRITE);
                }
            },
            [&](const MovePass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);

                for (const auto& pair : pass.movePairs) {
                    addPassNodeValue(rdg, node, valueIDs, pair.source, AccessType::READ);
                    addPassNodeValue(rdg, node, valueIDs, pair.target, AccessType::WRITE);
                }
            },
            [&](const RaytracePass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);
                for (const auto& pair : pass.computeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const PresentPass& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::Pass, rdg, vertID);
                auto& valueIDs = get(RDG::ValueID, rdg, vertID);

                addPassNodeValue(rdg, node, valueIDs, pass.resourceName, AccessType::READ);
            },
            [&](const auto& /*pass*/) {
                // do nothing
            });
    }
    CC_ENSURES(num_vertices(rdg) == numPasses);
}

void buildRenderValueGraphAndInitialPass(RenderDependencyGraph& rdg, RenderValueGraph& rvg) {
    // add value graph nodes
    uint32_t numValues = 0;
    for (const auto& valueIDs : rdg.valueIDs) {
        numValues += gsl::narrow_cast<uint32_t>(valueIDs.size());
    }
    rvg.reserve(numValues);

    for (const auto passID : makeRange(vertices(rdg))) {
        const auto& valueIDs = get(RDG::ValueID, rdg, passID);
        for (const auto& valueID : valueIDs) {
            CC_EXPECTS(!contains(RenderValueNode(passID, valueID), rvg));
            addVertex(std::piecewise_construct,
                       std::forward_as_tuple(passID, valueID), rvg);
        }
    }

    // build value graph edges
    auto initPassID = vertex(0xFFFFFFFF, rdg);
    CC_EXPECTS(initPassID == 0);
    auto& initPass     = get(RDG::Pass, rdg, initPassID);
    auto& initValueIDs = get(RDG::ValueID, rdg, initPassID);

    for (uint32_t dstPassID = num_vertices(rdg); dstPassID-- > 0;) {
        auto& dstPass = get(RDG::Pass, rdg, dstPassID);
        for (const auto valueID : dstPass.inputs) {
            auto dstVertID = vertex(RenderValueNode(dstPassID, valueID), rvg);
            CC_EXPECTS(in_degree(dstVertID, rvg) == 0);
            // add value edge func
            auto addValueEdge = [&rdg, &rvg, dstVertID, valueID](
                                    RenderDependencyGraph::vertex_descriptor srcPassID,
                                    RenderDependencyGraph::vertex_descriptor dstPassID) {
                // get value node in value graph
                auto srcVertID = vertex(RenderValueNode(srcPassID, valueID), rvg);
                CC_EXPECTS(!edge(srcVertID, dstVertID, rvg).second); // edge shouldn't have been added
                // add value edge
                auto res = add_edge(srcVertID, dstVertID, rvg);
                CC_ENSURES(res.second); // edge must have been added
                // try get pass dependency edge
                auto e = edge(srcPassID, dstPassID, rdg);
                if (!e.second) { // no pass dependency edge, add one
                    add_edge(srcPassID, dstPassID, rdg, DependencyType::DATA);
                } else {
                    // upgrade dependency type to DependencyType::Value
                    put(boost::edge_bundle, rdg, e.first, DependencyType::DATA);
                }
            };

            // try finding matching value in upstream render passes
            bool found = false;
            for (uint32_t srcPassID = dstPassID; srcPassID-- > 0;) {
                auto& srcPass = get(RDG::Pass, rdg, srcPassID);
                // value not found in source pass
                if (!srcPass.outputs.contains(valueID)) {
                    continue;
                }
                // value is in source pass
                addValueEdge(srcPassID, dstPassID);
                found = true;
                break;
            }
            if (!found) { // input value not found, add it to initial pass
                // add init value nodes
                addPassNodeValue(initPass, initValueIDs, valueID, AccessType::WRITE);
                addValueEdge(initPassID, dstPassID);
            }
        }
    }
}

void buildRenderDependencyGraphResourceIndex(const ResourceGraph& resg, RenderDependencyGraph& rdg) {
    CC_EXPECTS(rdg.valueNames.size() == rdg.valueIndex.size());

    rdg.resourceHandles.resize(rdg.valueNames.size());

    uint32_t valueID = 0;
    for (const auto& valueName : rdg.valueNames) {
        auto handleID                 = vertex(valueName, resg);
        rdg.resourceHandles[valueID] = handleID;
        ++valueID;
    }
}

struct CullingVisitor : boost::dfs_visitor<> {
    CullingVisitor(
        const ResourceGraph&         resg0,
        const RenderGraph&           rg0,
        const RenderDependencyGraph& rdg0,

        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassTag>::const_type    passes,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::ValueIDTag>::const_type valueIDs,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassIDTag>::const_type  passIDs,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::TraitsTag>::type        traits,
        boost::property_map<ResourceGraph, ResourceGraph::TraitsTag>::const_type                  resourceTraits)
    : resg(resg0),
      rg(rg0),
      rdg(rdg0),
      mPasses(passes),
      valueIDs(valueIDs),
      passIDs(passIDs),
      traits(traits),
      mResourceTraits(resourceTraits) {}

    // WARNING!!!
    // dfs visitor must NOT contain any state, it is copied every where
    using Graph = boost::reverse_graph<RenderDependencyGraph>;

    void markVertex(Graph::edge_descriptor e, const Graph& g) const {
        auto sourceID = source(e, g);
        auto targetID = target(e, g);
        auto keep     = get(traits, sourceID).keep;
        get(traits, targetID).keep |= keep;
    }

    void start_vertex(Graph::vertex_descriptor u, const Graph& g) {
        // currently, do nothing
    }

    void discover_vertex(Graph::vertex_descriptor u, const Graph& /*g*/) {
        auto& keep = get(traits, u).keep;
        if (keep) {
            return;
        }

        auto passID = rdg.passIDs.at(u);
        if (holds<PresentTag>(passID, rg)) {
            keep = true;
            return;
        }

        const auto& pass = get(mPasses, u);
        // output values has side effects
        for (const auto valueID : pass.outputs) {
            auto handleID = rdg.resourceHandles[valueID];
            if (get(mResourceTraits, handleID).hasSideEffects()) {
                keep = true;
                break;
            }
        }
    }

    void tree_edge(Graph::edge_descriptor e, const Graph& g) { // NOLINT
        markVertex(e, g);
    }

    void back_edge(Graph::edge_descriptor e, const Graph& g) { // NOLINT
        throw std::invalid_argument("rdg is not DAG");
    }

    void forward_or_cross_edge(Graph::edge_descriptor e, const Graph& g) { // NOLINT
        markVertex(e, g);
    }

    void finish_vertex(Graph::vertex_descriptor v, const Graph& g) { // NOLINT
        // currently, do nothing
    }

    const ResourceGraph&         resg;
    const RenderGraph&           rg;
    const RenderDependencyGraph& rdg;

    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassTag>::const_type    mPasses;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::ValueIDTag>::const_type valueIDs;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassIDTag>::const_type  passIDs;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::TraitsTag>::type        traits;

    boost::property_map<ResourceGraph, ResourceGraph::TraitsTag>::const_type mResourceTraits;
};

} // namespace

int RenderCompiler::compile() {
    auto&       rg      = graph;
    const auto& resg    = resourceGraph;

    try {
        // per-condition:
        // 1. render graph is already sorted, which is ensured by the building rule.
        // 2. every render value can be found in resource graph
        // 3. every render value in a pass can be found in the corresponding layout graph node
        // 4. render value in a pass is read/write consistent, either read-only or readwrite/write
        //    a) a render value can be bound to multiple shader input parameters,
        //       so it might be read/write inconsistent.

        // convert render graph to render dependency graph
        // rdg is a sub-graph of rg, it only contains render passes
        // rdg implementation doesn't contain any string, so it's relatively faster.
        RenderDependencyGraph rdg(scratch);
        buildRenderDependencyGraph(rg, rdg);

        // try connect all render values, which are stored in RenderValueGraph (rvg)
        // compute inter-pass dependencies of rdg
        // if an input of render pass doesn't have any sources,
        // add this input value to the initial render pass
        RenderValueGraph rvg(scratch);
        buildRenderValueGraphAndInitialPass(rdg, rvg);

        // build resource handle index
        buildRenderDependencyGraphResourceIndex(resg, rdg);

        // rdg and rvg are now complete, we can do culling now
        // if an output of a pass has no out-edge, this output is called general rg-output
        // if a general rg-output is persistent or marked as output,
        // we call it rg-output. it's containing pass is called rg-output-pass
        // culling rules:
        // 1. if a pass is not culled, its upstream passes should not be culled
        // 2. rg-output-pass should not be culled
        // 3. any pass contains readwrite/write persistent value, should not be culled
        // 4. any pass contains side-effects not described here, should not be culled
        // algorithm:
        // 1. reversely search rdg
        // 2. do depth-first search
        //    a) pass has rg-output, keep
        //    b) pass has persistent write values, keep
        //    c) any downstream pass is kept, keep
        //    d) found back-edge, rdg is not DAG, abort
        // 3. any pass is not marked as keep, is culled
        {
            const auto& crdg  = rdg;
            const auto& cresg = resg;

            CullingVisitor visitor(
                resg, rg, rdg,
                get(RDG::Pass, crdg),
                get(RDG::ValueID, crdg),
                get(RDG::PassID, crdg),
                get(RDG::Traits, rdg),
                get(RESG::Traits, cresg));

            auto colors       = rdg.colors(scratch);
            auto reverseGraph = boost::make_reverse_graph(crdg);
            boost::depth_first_search(
                reverseGraph,
                visitor,
                get(colors, rdg));
        }
    } catch (const std::invalid_argument& /*e*/) {
        return 1;
    }

    addVertex(
        "name",
        UpdateFrequency::PER_INSTANCE,
        LayoutData(scratch),
        GroupNodeData{},
        layoutGraph);

    addVertex(ShaderTag{},
        std::forward_as_tuple("name"),
        std::forward_as_tuple(UpdateFrequency::PER_INSTANCE),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        layoutGraph);

    return 0;
}

} // namespace example

} // namespace render

} // namespace cc
