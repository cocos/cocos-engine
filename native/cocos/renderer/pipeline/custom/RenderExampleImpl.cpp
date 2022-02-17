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
            if (v.mClearFlags != gfx::ClearFlagBit::NONE) {
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
    const auto& rg = mGraph;
    const auto& lg = mLayoutGraph;
    try {
        for (const auto& vertID : make_range(vertices(rg))) {
            visit_vertex(
                vertID, rg,
                [&](const RasterPassData& pass) {
                    checkComputeValue(pass.mComputeViews);
                },
                [&](const ComputePassData& pass) {
                    checkComputeValue(pass.mComputeViews);
                },
                [&](const auto&) {
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
            node.mInputs.emplace(valueID);
            break;
        case AccessType::READ_WRITE:
            node.mOutputs.emplace(valueID);
            node.mInputs.emplace(valueID);
            break;
        case AccessType::WRITE:
            node.mOutputs.emplace(valueID);
            break;
        default:
            break;
    }
}

void addPassNodeValue(RenderDependencyGraph& rdg,
                      RenderPassNode& node, PmrFlatSet<uint32_t>& values,
                      const PmrString& valueName, AccessType type) {
    auto iter = rdg.mValueIndex.find(valueName);
    if (iter == rdg.mValueIndex.end()) {
        rdg.mValueIndex.emplace(valueName, uint32_t(rdg.mValueNames.size()));
        rdg.mValueNames.emplace_back(valueName);
        CC_ENSURES(rdg.mValueIndex.size() == rdg.mValueNames.size());
    }
    addPassNodeValue(node, values, iter->second, type);
}

void buildRenderDependencyGraph(const RenderGraph& rg, RenderDependencyGraph& rdg) {
    size_t numPasses = 1; // additional init pass is the first pass
    numPasses += rg.mRasterPasses.size();
    numPasses += rg.mComputePasses.size();
    numPasses += rg.mCopyPasses.size();
    numPasses += rg.mMovePasses.size();
    numPasses += rg.mRaytracePasses.size();
    rdg.mPassIDs.reserve(numPasses);
    rdg.mValueIndex.reserve(128);
    rdg.mValueNames.reserve(128);

    // add initial pass, whose id must be 0
    auto startID = add_vertex(rdg, 0xFFFFFFFF);
    CC_EXPECTS(startID == 0);

    auto makeAccessType = [](const boost::container::pmr::vector<ComputeView>& values) {
        CC_EXPECTS(!values.empty());
        AccessType type = values[0].mAccessType;
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

    for (const auto passID : make_range(vertices(rg))) {
        visit_vertex(
            passID, rg,
            [&](const RasterPassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);
                for (const auto& pair : pass.mRasterViews) {
                    const auto& valueName = pair.first;
                    const auto& value     = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, value.mAccessType);
                }
                for (const auto& pair : pass.mComputeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const ComputePassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);
                for (const auto& pair : pass.mComputeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const CopyPassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);

                for (const auto& pair : pass.mCopyPairs) {
                    addPassNodeValue(rdg, node, valueIDs, pair.mSource, AccessType::READ);
                    addPassNodeValue(rdg, node, valueIDs, pair.mTarget, AccessType::WRITE);
                }
            },
            [&](const MovePassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);

                for (const auto& pair : pass.mMovePairs) {
                    addPassNodeValue(rdg, node, valueIDs, pair.mSource, AccessType::READ);
                    addPassNodeValue(rdg, node, valueIDs, pair.mTarget, AccessType::WRITE);
                }
            },
            [&](const RaytracePassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);
                for (const auto& pair : pass.mComputeViews) {
                    const auto& valueName = pair.first;
                    const auto& values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            },
            [&](const PresentPassData& pass) {
                auto  vertID   = add_vertex(rdg, passID);
                auto& node     = get(RDG::pass, rdg, vertID);
                auto& valueIDs = get(RDG::valueID, rdg, vertID);

                addPassNodeValue(rdg, node, valueIDs, pass.mResourceName, AccessType::READ);
            },
            [&](const auto&) {
                // do nothing
            });
    }
    CC_ENSURES(num_vertices(rdg) == numPasses);
}

void buildRenderValueGraphAndInitialPass(RenderDependencyGraph& rdg, RenderValueGraph& rvg) {
    // add value graph nodes
    uint32_t numValues = 0;
    for (const auto& valueIDs : rdg.mValueIDs) {
        numValues += gsl::narrow_cast<uint32_t>(valueIDs.size());
    }
    rvg.reserve(numValues);

    for (const auto passID : make_range(vertices(rdg))) {
        const auto& valueIDs = get(RDG::valueID, rdg, passID);
        for (const auto& valueID : valueIDs) {
            CC_EXPECTS(!contains(RenderValueNode(passID, valueID), rvg));
            add_vertex(std::piecewise_construct,
                       std::forward_as_tuple(passID, valueID), rvg);
        }
    }

    // build value graph edges
    auto initPassID = vertex(0xFFFFFFFF, rdg);
    CC_EXPECTS(initPassID == 0);
    auto& initPass     = get(RDG::pass, rdg, initPassID);
    auto& initValueIDs = get(RDG::valueID, rdg, initPassID);

    for (uint32_t dstPassID = num_vertices(rdg); dstPassID-- > 0;) {
        auto& dstPass = get(RDG::pass, rdg, dstPassID);
        for (const auto valueID : dstPass.mInputs) {
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
                auto& srcPass = get(RDG::pass, rdg, srcPassID);
                // value not found in source pass
                if (!srcPass.mOutputs.contains(valueID)) {
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
    CC_EXPECTS(rdg.mValueNames.size() == rdg.mValueIndex.size());

    rdg.mResourceHandles.resize(rdg.mValueNames.size());

    uint32_t valueID = 0;
    for (const auto& valueName : rdg.mValueNames) {
        auto handleID                 = vertex(valueName, resg);
        rdg.mResourceHandles[valueID] = handleID;
        ++valueID;
    }
}

struct CullingVisitor : boost::dfs_visitor<> {
    CullingVisitor(
        const ResourceGraph&         resg0,
        const RenderGraph&           rg0,
        const RenderDependencyGraph& rdg0,

        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::pass_>::const_type    passes,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::valueID_>::const_type valueIDs,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::passID_>::const_type  passIDs,
        boost::property_map<RenderDependencyGraph, RenderDependencyGraph::traits_>::type        traits,
        boost::property_map<ResourceGraph, ResourceGraph::traits_>::const_type                  resourceTraits)
    : resg(resg0),
      rg(rg0),
      rdg(rdg0),
      mPasses(passes),
      mValueIDs(valueIDs),
      mPassIDs(passIDs),
      mTraits(traits),
      mResourceTraits(resourceTraits) {}

    // WARNING!!!
    // dfs visitor must NOT contain any state, it is copied every where
    using Graph = boost::reverse_graph<RenderDependencyGraph>;

    void markVertex(Graph::edge_descriptor e, const Graph& g) const {
        auto sourceID = source(e, g);
        auto targetID = target(e, g);
        auto keep     = get(mTraits, sourceID).mKeep;
        get(mTraits, targetID).mKeep |= keep;
    }

    void start_vertex(Graph::vertex_descriptor u, const Graph& g) {
        // currently, do nothing
    }

    void discover_vertex(Graph::vertex_descriptor u, const Graph& /*g*/) {
        auto& keep = get(mTraits, u).mKeep;
        if (keep) {
            return;
        }

        auto passID = rdg.mPassIDs.at(u);
        if (holds_tag<Present_>(passID, rg)) {
            keep = true;
            return;
        }

        const auto& pass = get(mPasses, u);
        // output values has side effects
        for (const auto valueID : pass.mOutputs) {
            auto handleID = rdg.mResourceHandles[valueID];
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

    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::pass_>::const_type    mPasses;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::valueID_>::const_type mValueIDs;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::passID_>::const_type  mPassIDs;
    boost::property_map<RenderDependencyGraph, RenderDependencyGraph::traits_>::type        mTraits;

    boost::property_map<ResourceGraph, ResourceGraph::traits_>::const_type mResourceTraits;
};

} // namespace

int RenderCompiler::compile() {
    auto*       scratch = mScratch;
    auto&       rg      = mGraph;
    const auto& resg    = mResourceGraph;

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
                get(RDG::pass, crdg),
                get(RDG::valueID, crdg),
                get(RDG::passID, crdg),
                get(RDG::traits, rdg),
                get(RESG::traits, cresg));

            auto colors       = rdg.colors(scratch);
            auto reverseGraph = boost::make_reverse_graph(crdg);
            boost::depth_first_search(
                reverseGraph,
                visitor,
                get(colors, rdg));
        }
    } catch (const std::invalid_argument&) {
        return 1;
    }

    add_vertex(
        "name",
        UpdateFrequency::PER_INSTANCE,
        LayoutData(scratch),
        GroupNodeData{},
        mLayoutGraph);

    add_vertex(Shader_{},
        std::forward_as_tuple("name"),
        std::forward_as_tuple(UpdateFrequency::PER_INSTANCE),
        std::forward_as_tuple(),
        std::forward_as_tuple(),
        mLayoutGraph);

    return 0;
}

} // namespace example

} // namespace render

} // namespace cc
