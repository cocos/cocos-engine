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

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passL, uint32_t passR) {
    return std::abs(passL - passR) == 1;
}

// status of resource access
void buildAccessGraph(const RenderGraph &rg, ResourceAccessGraph &rag, AccessTable &rescAcess) {
    //what we need:
    // - pass dependency
    // - initial access of all resource
    // - leaves
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

        std::vector<Barrier> &srcRearBarriers = barrierMap[from].rearBarriers;

        for (uint32_t i = 0; i < commonResources.size(); ++i) {
            const uint32_t resourceID     = commonResources[i].resourceID;
            auto           findAccessByID = [resourceID](const ResourceAccessDesc &resAccess) { return resAccess.resourceID == resourceID; };
            auto           fromIter       = std::find_if(fromStatus.begin(), fromStatus.end(), findAccessByID);
            auto           toIter         = std::find_if(toStatus.begin(), toStatus.end(), findAccessByID);

            // can't happen
            assert(fromIter != fromStatus.end());
            assert(toIter != toStatus.end());

            auto srcBarrierIter = std::find_if(srcRearBarriers.begin(), srcRearBarriers.end(),
                                               [resourceID](const BarrierNode &node) { return resourceID == node.resourceID; });

            if (isAdjacent) {
                if (srcBarrierIter = srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back({
                        resourceID,
                        to, // next use of resc varies between resources
                        (*fromIter).access.visibility,
                        (*toIter).access.visibility,
                        (*fromIter).access.access,
                        (*toIter).access.access,
                    });
                } else {
                    (*srcBarrierIter).nextPass        = to;
                    (*srcBarrierIter).beginVisibility = (*fromIter).access.visibility;
                    (*srcBarrierIter).endVisibility   = (*toIter).access.visibility;
                    (*srcBarrierIter).beginAccess     = (*fromIter).access.access;
                    (*srcBarrierIter).endAccess       = (*toIter).access.access;
                }
            } else {
                if (srcBarrierIter = srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back({
                        resourceID,
                        to,
                        (*fromIter).access.visibility,
                        defaultVisibility,
                        (*fromIter).access.access,
                        defaultAccess,
                    });
                } else {
                    // logic adjacent but not exec adjacent
                    // and more adjacent(further from src) than another pass which hold a use of resourceID
                    // replace previous one

                    // 1 --> 2 --> 3
                    //             ↓
                    // 4 --> 5 --> 6

                    // [if] real pass order: 1 - 2 - 4 - 5 - 3 - 6

                    // 2 and 5 read from ResA, 6 writes to ResA
                    // 5 and 6 logically adjacent but not adjacent in execution order.
                    // barrier for ResA between 2 - 6 can be totally replace by 5 - 6

                    if (to > (*srcBarrierIter).to) {
                        uint32_t siblingPass              = (*srcBarrierIter).to;
                        (*srcBarrierIter).to              = to;
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

                std::vector<Barrier> &dstRearBarriers = barrierMap[to].frontBarriers;

                auto dstBarrierIter = std::find_if(dstRearBarriers.begin(), dstRearBarriers.end(),
                                                   [resourceID](const BarrierNode &node) { return resourceID == node.resourceID; });

                if (dstBarrierIter = dstRearBarriers.end()) {
                    dstRearBarriers.emplace_back({
                        resourceID,
                        to,
                        defaultVisibility,
                        (*toIter).access.visibility,
                        defaultAccess,
                        (*toIter).access.access,
                    });
                } else {
                    if (to < (*srcBarrierIter).to) {
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

#if 0
void batchBarriers(const ResourceAccessGraph &rag, BarrierMap &batchedBarriers, AccessTable &rescAcess) {
    // - beginVisibility: not NONE, endVisibility: not NONE ===> full barrier
    // - beginVisibility: not NONE, endVisibility: NONE     ===> split begin barrier
    // - beginVisibility: NONE, endVisibility: not NONE     ===> split end barrier

    using BarrierList = std::vector<Barrier>;
    BarrierList barrierList;
    barrierList.reserve(rescAcess.size());

    for (uint32_t pathID = 0; pathID < leaves.size(); ++pathID) {
    }


    using BarrierList = std::vector<Barrier>;
    BarrierList barrierList;
    barrierList.reserve(rescAcess.size());

    for (const auto &pair : rescAcess) {
        const uint32_t    resourceID = pair.first;
        const AccessDesc &accessDesc = pair.second;
        barrierList.emplace_back(Barrier{resourceID, {accessDesc.visibility, gfx::ShaderStageFlagBit::NONE, accessDesc.access, gfx::MemoryAccessBit::NONE}, {}});
    }
    //initial state
    batchedBarriers.emplace({0, std::move(barrierList), {}});

    // const ResourceAccessNode &accessNode = get(RAG::AccessNode, rag, 0);
    // for (uint32_t i = 0; i < accessNode.outStatus.size(); ++i) {
    //     const uint32_t    resourceID = accessNode.outStatus[i].resourceID;
    //     const AccessDesc &accessDesc = accessNode.outStatus[i].access;

    //     if (rescAcess[resourceID].visibility != accessDesc.visibility || rescAcess[resourceID].access != accessDesc.access) {
    //         auto iter = std::find_if(batchedBarriers[0].begin(), batchedBarriers[0].end(), [resourceID](const ResourceAccessDesc &resAccess) { return resAccess.resourceID == resourceID; });
    //         if (iter != batchedBarriers[0].end()) {
    //             (*iter).access.endVisibility = accessDesc.visibility;
    //             (*iter).access.endAccess     = accessDesc.access;
    //         } else {
    //         }
    //         rescAcess[resourceID].visibility = accessDesc.visibility;
    //         rescAcess[resourceID].access     = accessDesc.access;
    //     }

    //     // batchedBarriers[0].emplace_back({
    //     //     gfx::ShaderStageFlagBit::NONE,
    //     //     accessDesc.visibility,
    //     //     gfx::MemoryAccessBit::NONE,
    //     //     accessDesc.access,
    //     // });
    // }

    for (uint32_t passID = 1; passID < num_vertices(rag);) {
        std::vector<ResourceAccessDesc> accessList;
        const ResourceAccessNode &      accessNode = get(RAG::AccessNode, rag, passID);

        for (uint32_t i = 0; i < accessNode.inStatus.size(); ++i) {
            uint32_t inDegrees = in_degree(passID, rag);
            for (uint32_t d = 0; d < inDegrees; ++d) {
            }
        }

        // ---------------------------front barrier: prepare for current pass---------------------------

        for (uint32_t i = 0; i < accessNode.outStatus.size(); ++i) {
            const uint32_t    resourceID = accessNode.inStatus[i].resourceID;
            const AccessDesc &accessDesc = accessNode.inStatus[i].access;
            if (rescAcess[resourceID].visibility != accessDesc.visibility || rescAcess[resourceID].access != accessDesc.access) {
            }
        }

        for (uint32_t i = 0; i < accessNode.inStatus.size(); ++i) {
            const uint32_t    resourceID = accessNode.inStatus[i].resourceID;
            const AccessDesc &accessDesc = accessNode.inStatus[i].access;

            if (rescAcess[resourceID].visibility != accessDesc.visibility || rescAcess[resourceID].access != accessDesc.access) {
                auto findAccessDescByRescID = [resourceID](const ResourceAccessDesc &resAccess) {
                    return resAccess.resourceID == resourceID; });
                auto iter = std::find_if(batchedBarriers[passID].begin(), batchedBarriers[passID].end(), findAccessDescByRescID);

                if (iter != batchedBarriers[passID].end()) {
                    PmrFlatSet<ResourceAccessDesc> &prevInStatus  = prevPass.inStatus;
                    PmrFlatSet<ResourceAccessDesc> &prevOutStatus = prevPass.outStatus;

                    auto prevInIter  = std::find_if(prevInStatus.begin(), prevInStatus.end(), findAccessDescByRescID);
                    auto prevOutIter = std::find_if(prevOutStatus.begin(), prevOutStatus.end(), findAccessDescByRescID);

                    if (prevInIter != prevInStatus.end()) { // resource access changed in adjacent pass
                        (*prevInIter).access.endVisibility = accessDesc.visibility;
                        (*prevInIter).access.endAccess     = accessDesc.access;
                    } else if (prevOutIter != prevOutIter.end()) { // ditto
                        (*prevOutIter).access.endVisibility = accessDesc.visibility;
                        (*prevOutIter).access.endAccess     = accessDesc.access;
                    } else { //resource changed before but not adjacent pass
                    }
                } else {
                    accessList.emplace_back(ResourceAccessDesc{resourceID, {accessDesc.visibility, gfx::ShaderStageFlagBit::NONE, accessDesc.access, gfx::MemoryAccessBit::NONE}});
                    batchedBarriers[passID]
                        .emplace
                }
                rescAcess[resourceID].visibility = accessDesc.visibility;
                rescAcess[resourceID].access     = accessDesc.access;
            }

            // batchedBarriers[0].emplace_back({
            //     gfx::ShaderStageFlagBit::NONE,
            //     accessDesc.visibility,
            //     gfx::MemoryAccessBit::NONE,
            //     accessDesc.access,
            // });
        }
    }

}
#endif
// void passReorder() {
// }

void run() {
    ResourceGraph &      rg   = graph;
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