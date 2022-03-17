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

#include <boost/graph/breadth_first_search.hpp>
#include <boost/range/algorithm.hpp>
#include "FrameGraphGraphs.h"
#include "FrameGraphTypes.h"
namespace cc {

namespace render {

using RAG         = ResourceAccessGraph;
using BarrierMap  = FlatMap<ResourceAccessGraph::vertex_descriptor, BarrierNode>;
using AccessTable = FlatMap<uint32_t, AccessDesc>;

using defaultAccess     = gfx::MemoryAccessBit::NONE;
using defaultVisibility = gfx::ShaderStageFlagBit::NONE;

// bool tryAliasing(/*from, to*/) {
//     return true;
// }

// void aliasingResource() {
// }

void addAccessNode(RenderAcc &     rdg,
                   RenderPassNode &node, PmrFlatSet<uint32_t> &values,
                   const PmrString &valueName, AccessType type) {
}

// status of resource access
void buildAccessGraph(const RenderGraph &rg, const LayoutGraph &lg, ResourceAccessGraph &rag, AccessTable &rescAcess) {
    //what we need:
    // - pass dependency
    // - pass attachment access

    // resouce access status at passID
    struct ResourceStatus {
        uint32_t   passID;
        AccessDesc access;
    };

    struct ResourceTransition {
        ResourceStatus lastStatus;
        ResourceStatus currStatus;
    };

    std::unordered_map<unt32_t, ResourceTransition> accessRecord;

    size_t numPasses = 1;
    numPasses += rg.rasterPasses.size();
    numPasses += rg.computePasses.size();
    numPasses += rg.copyPasses.size();
    numPasses += rg.movePasses.size();
    numPasses += rg.raytracePasses.size();

    rag.reserve(numPasses);
    rag.valueIndex.reserve(128);
    rag.valueNames.reserve(128);

    auto startID = add_vertex(rag, 0xFFFFFFFF);
    CC_EXPECTS(startID == 0);

    auto makeAccessType = [](const boost::container::pmr::vector<ComputeView> &values) {
        CC_EXPECTS(!values.empty());
        AccessType type = values[0].accessType;
        for (uint32_t i = 1; i != values.size(); ++i) {
            const auto &value = values[i];
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

    auto getVisibilityByDescName = [&lg](const PmrString &slotName) {
        auto                            vis    = gfx::ShaderStageFlagBit::NONE;

        auto layouts = get(LayoutGraph::LayoutTag, lg);
        bool found = false;

        auto compare = [](const PmrString& name, const uint32_t slot){
            return boost::lexical_cast<uin32_t>(name) == slot;
        }

        for(const auto& layout : layouts) {
            for(const auto& pair: layout.descriptorSets) {
                const auto& descriptorSetData = pair.second;
                uint32_t slot = descriptorSetData.second;
                if(compare(slotName, slot)) {
                    found = true;
                    vis = descriptorSetData.first;
                }
            }
        }

        CC_ENSURES(found);
        return vis;
    };

    for (const auto passID : makeRange(vertices(rg))) {
        visitObject(
            passID, rg,
            [&](const auto &pass) {
                auto  vertID = add_vertex(rag, passID);
                auto &node   = get(RAG::AccessNodesTag, rag);
                for (const auto &pair : pass.rasterViews) {
                    const auto &valueName = pair.first;
                    const auto &value     = pair.second;

                    addPassNodeValue(rag, node, value.accessType);
                }
                for (const auto &pair : pass.computeViews) {
                    const auto &valueName = pair.first;
                    const auto &values    = pair.second;
                    addPassNodeValue(rdg, node, valueIDs, valueName, makeAccessType(values));
                }
            });
    }
}

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passL, uint32_t passR) {
    return std::abs(passL - passR) == 1;
}

struct BarrierVisitor : public boost::bfs_visitor<> {
    using Vertex = FrameGraph::vertex_descriptor;
    using Edge   = FrameGraph::edge_descriptor;
    using Graph  = ResourceAccessGraph;

    BarrierVisitor(BarrierMap &barriers) : barrierMap(barriers) {
    }

    void discover_vertex(Vertex u, const Graph &g) {
    }

    void batchBarriers(Edge e, const Graph &g) {
        // what we get:
        // - beginVisibility: not NONE, endVisibility: not NONE ===> full barrier
        // - beginVisibility: not NONE, endVisibility: NONE     ===> split begin barrier
        // - beginVisibility: NONE, endVisibility: not NONE     ===> split end barrier

        Vertex from = source(e, g);
        Vertex to   = target(e, g);

        bool isAdjacent = isPassExecAdjecent(from, to);

        const ResourceAccessNode &fromAccess = get(FrameGraph::ResourceAccessNodeTag, g, from);
        const ResourceAccessNode &toAccess   = get(FrameGraph::ResourceAccessNodeTag, g, to);

        std::vector<ResourceAccessDesc>        commonResources;
        const std::vector<ResourceAccessDesc> &fromStatus = fromAccess.attachemntStatus;
        const std::vector<ResourceAccessDesc> &toStatus   = toAccess.attachemntStatus;

        std::set_intersection(fromStatus.begin(), fromStatus.end(),
                              toStatus.begin(), toStatus.end(),
                              std::back_inserter(commonResources),
                              [](const ResourceAccessDesc &lhs, const ResourceAccessDesc &rhs) {
                                  return lhs.resourceID < rhs.resourceID;
                              });

        if (barrierMap.find(from) == barrierMap.end()) {
            barrierMap.emplace({from, {}, {}});
        }

        std::vector<Barrier> &srcRearBarriers  = barrierMap[from].rearBarriers;
        std::vector<Barrier> &dstFrontBarriers = barrierMap[to].frontBarriers;

        for (uint32_t i = 0; i < commonResources.size(); ++i) {
            const uint32_t resourceID     = commonResources[i].resourceID;
            auto           findAccessByID = [resourceID](const ResourceAccessDesc &resAccess) { return resAccess.resourceID == resourceID; };
            auto           fromIter       = std::find_if(fromStatus.begin(), fromStatus.end(), findAccessByID);
            auto           toIter         = std::find_if(toStatus.begin(), toStatus.end(), findAccessByID);

            // can't happen
            assert(fromIter != fromStatus.end());
            assert(toIter != toStatus.end());

            if ((*fromIter).access.visibility == (*toIter).access.visibility && (*fromIter).access.access == (*toIter).access.access) {
                continue;
            }

            auto findBarrierNodeByResID = [resourceID](const BarrierNode &node) { return resourceID == node.resourceID; };

            auto srcBarrierIter = std::find_if(srcRearBarriers.begin(), srcRearBarriers.end(), findBarrierNodeByResID);

            auto dstBarrierIter = std::find_if(dstFrontBarriers.begin(), dstFrontBarriers.end(), findBarrierNodeByResID);

            if (isAdjacent) {
                if (srcBarrierIter = srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back({
                        resourceID,
                        from,
                        to, // next use of resc varies between resources
                        (*fromIter).access.visibility,
                        (*toIter).access.visibility,
                        (*fromIter).access.access,
                        (*toIter).access.access,
                    });
                } else {
                    (*srcBarrierIter).from            = from;
                    (*srcBarrierIter).to              = to;
                    (*srcBarrierIter).beginVisibility = (*fromIter).access.visibility;
                    (*srcBarrierIter).endVisibility   = (*toIter).access.visibility;
                    (*srcBarrierIter).beginAccess     = (*fromIter).access.access;
                    (*srcBarrierIter).endAccess       = (*toIter).access.access;
                }
            } else {
                if (srcBarrierIter = srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back({
                        resourceID,
                        from,
                        to,
                        (*fromIter).access.visibility,
                        defaultVisibility,
                        (*fromIter).access.access,
                        defaultAccess,
                    });
                } else {
                    if (from > (*srcBarrierIter).from) {
                        uint32_t siblingPass              = (*srcBarrierIter).from;
                        (*srcBarrierIter).from            = from;
                        (*srcBarrierIter).beginVisibility = (*fromIter).access.visibility;
                        (*srcBarrierIter).beginAccess     = (*fromIter).access.access;

                        auto siblingIter = std::find_if(barrierMap[siblingPass].rearBarriers.begin(), barrierMap[siblingPass].rearBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        assert(siblingIter != barrierMap.end());
                        barrierMap[siblingPass].rearBarriers.erase(siblingIter);
                    }
                }

                if (dstBarrierIter = dstFrontBarriers.end()) {
                    dstFrontBarriers.emplace_back({
                        resourceID,
                        from,
                        to,
                        defaultVisibility,
                        (*toIter).access.visibility,
                        defaultAccess,
                        (*toIter).access.access,
                    });
                } else {
                    // logic but not exec adjacent
                    // and more adjacent(further from src) than another pass which hold a use of resourceID
                    // replace previous one

                    // 1 --> 2 --> 3
                    //             ↓
                    // 4 --> 5 --> 6

                    // [if] real pass order: 1 - 2 - 4 - 5 - 3 - 6

                    // 2 and 5 read from ResA, 6 writes to ResA
                    // 5 and 6 logically adjacent but not adjacent in execution order.
                    // barrier for ResA between 2 - 6 can be totally replace by 5 - 6
                    if (to < (*dstBarrierIter).to) {
                        uint32_t siblingPass            = (*dstBarrierIter).to;
                        (*dstBarrierIter).to            = to;
                        (*dstBarrierIter).endVisibility = (*toIter).access.visibility;
                        (*dstBarrierIter).endAccess     = (*toIter).access.access;

                        //remove the further redundant barrier
                        auto siblingIter = std::find_if(barrierMap[siblingPass].frontBarriers.begin(), barrierMap[siblingPass].frontBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        assert(siblingIter != barrierMap.end());
                        barrierMap[siblingPass].frontBarriers.erase(siblingIter);
                    }
                }
            }
        }
    }

    void examine_edge(Edge e, const Graph &g) {
        batchBarriers(e, g);
    }

    BarrierMap &barrierMap;
};

// void passReorder() {
// }

void run() {
    ResourceGraph &rg = graph;

    const ResourceGraph &resg = resourceGraph;

    {
        // record resource current in-access and out-access for every single node
        ResourceAccessGraph rag(scratch);
        // a mutable global resource access look-up table
        FlatMap<uint32_t, AccessDesc> rescAccess;
        buildAccessGraph(rg, rag, rescAccess);

        // found pass id in this map ? barriers you should commit when run into this pass
        // : or no extra barrier needed.
        BarrierMap batchedBarriers;
        batchBarriers(rag, batchedBarriers, rescAcess)
    }
}

} // namespace render

} // namespace cc