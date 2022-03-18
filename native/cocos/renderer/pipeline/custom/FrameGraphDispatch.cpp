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

using RAG        = ResourceAccessGraph;
using LGD        = LayoutGraphData;
using BarrierMap = FlatMap<ResourceAccessGraph::vertex_descriptor, BarrierNode>;

using AccessTable = PmrFlatMap<unt32_t /*resourceID*/, ResourceTransition /*last-curr-status*/>;

using defaultAccess     = gfx::MemoryAccessBit::NONE;
using defaultVisibility = gfx::ShaderStageFlagBit::NONE;

const uint32_t EXPECT_START_ID = 0;

// resouce access status at passID
struct ResourceStatus {
    uint32_t                vertexID{0xFFFFFFFF};
    PassType                passType;
    gfx::MemoryAccessBit    access{gfx::MemoryAccessBit::NONE};
    gfx::ShaderStageFlagBit visibility{gfx::ShaderStageFlagBit::NONE};
};

struct ResourceTransition {
    bool           external{false};
    ResourceStatus lastStatus;
    ResourceStatus currStatus;
};

gfx::MemoryAccessBit toGfxAccess(AccessType type) {
    gfx::MemoryAccessBit access = defaultAccess;
    switch (type) {
        case AccessType::READ:
            access = gfx::MemoryAccessBit::READ_ONLY;
            break;
        case AccessType::WRITE:
            access = gfx::MemoryAccessBit::WRITE_ONLY;
            break;
        case AccessType::READ_WRITE:
            access = gfx::MemoryAccessBit::READ_WRITE;
            break;
        default:
            break;
    }
    return access;
};

void addAccessNode(RAG &                   rag,
                   ResourceAccessNode &    node,
                   PassType                passType,
                   uint32_t                rescID,
                   gfx::ShaderStageFlagBit visibility,
                   gfx::MemoryAccessBit    access,
                   const Range &           range) {
    auto iter = rag.names.find(rescName);
    if (iter == rag.names.end()) {
        rag.names.emplace_back(rescName);
        node.emplace_back({
            passType,
            {
                rescID,
                visibility,
                access,
                range,
            },
        });
    }
}

//return --> any pass dependency before </bold>in this frame<bold> ? true : false
uint32_t dependencyCheck(RAG &rag, AccessTable &accessRecord, uint32_t vertexID, PassType passType, uint32_t resourceID, gfx::ShaderStageFlagBit visibility, gfx::MemoryAccessBit access) {
    CC_EXPECTS(lastVertex != nullptr);
    uin32_t lastVertexID = 0xFFFFFFFF;
    auto    iter         = accessRecord.find(resourceID);
    if (iter == accessRecord.end()) {
        accessRecord.insert{resourceID, {access & gfx::MemoryAccessBit::READ_ONLY, {}, {vertexID, passType, access, visibility}}};
    } else {
        ResourceTransition &trans = iter->second;
        if (access == gfx::MemoryAccessBit::READ_ONLY && trans.currStatus.access == gfx::MemoryAccessBit::READ_ONLY) {
            trans.currStatus = {vertexID, passType, access, visibility};
            // external tex and never written before
            bool dirtyExternalRes = trans.external && trans.lastStatus.vertexID == 0xFFFFFFFF;
            if (!dirtyExternalRes) {
                auto res = add_edge(trans.lastStatus.vertexID, vertexID, rag);
                CC_ENSURES(res.second);
            }
            trans.currStatus = {vertexID, passType, access, visibility};
            lastVertexID     = trans.lastStatus.vertexID;
        } else {
            bool needTransition = (trans.currStatus.access != access) || (trans.currStatus.passType == passType && trans.currStatus.visibility != visibility);
            if (needTransition) {
                trans.lastStatus = trans.currStatus;
                trans.currStatus = {vertexID, passType, access, visibility};
                auto res         = add_edge(trans.lastStatus.vertexID, vertexID, rag);
                CC_ENSURES(res.second);
                lastVertexID = trans.lastStatus.vertexID;
            }
        }
    }
    return lastVertexID;
}

gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lg, const PmrString &slotName) {
    auto vis = gfx::ShaderStageFlagBit::NONE;

    auto layouts = get(LayoutGraph::LayoutTag, lg);
    bool found   = false;

    auto compare = [](const PmrString &name, const uint32_t slot) {
        return boost::lexical_cast<uin32_t>(name) == slot;
    }

    for (const auto &layout : layouts) {
        for (const auto &pair : layout.descriptorSets) {
            const auto &descriptorSetData = pair.second;
            uint32_t    slot              = descriptorSetData.second;
            if (compare(slotName, slot)) {
                found = true;
                vis   = descriptorSetData.first;
            }
        }
    }

    CC_ENSURES(found);
    return vis;
};

void processRasterPass(RAG &rag, const LGD &lgd, uint32_t passID, const RasterPass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNodeTag, rag);
    bool  dependent = false;
    for (const auto &pair : pass.rasterViews) {
        const auto &            rasterView = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, pair.first);
        auto                    access     = toGfxAccess(rasterView.accessType);
        addAccessNode(rag, node, PassType::Raster, rasterView.slotName, visibility, access, Range{});
        auto lastVertId = dependencyCheck(vertID, PassType::Raster, boost::hash<PmrString>(rasterView.slotName), visibility, access);
        if (lastVertId != 0xFFFFFFFF) {
            auto res = add_edge(lastVertId, vertID);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    for (const auto &pair : pass.computeViews) {
        const auto &            values     = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, pair.first);
        for (const auto &computeView : pass.computeViews) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, node, PassType::Compute, computeView.slotName, visibility, access, Range{});
            auto lastVertId = dependencyCheck(vertID, PassType::Compute, boost::hash<PmrString>(computeView.slotName), visibility, access);
            if (lastVertId != 0xFFFFFFFF) {
                auto res = add_edge(lastVertId, vertID);
                CC_ENSURES(res.second);
                dependent = true;
            }
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID);
        CC_ENSURES(res.second);
    }
}

void processComputePass(RAG &rag, const LGD &lgd, uint32_t passID, const ComputePass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNodeTag, rag);
    bool  dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &            computeView = pair.second;
        gfx::ShaderStageFlagBit visibility  = getVisibilityByDescName(lg, pair.first);
        addAccessNode(rag, node, PassType::Compute, computeView.name, visibility, toGfxAccess(computeView.accessType), Range{});
        auto access     = toGfxAccess(computeView.accessType);
        auto lastVertID = dependencyCheck(vertID, PassType::Compute, boost::hash<PmrString>(computeView.name), visibility, access);
        if (lastVertID != 0xFFFFFFFF) {
            auto res = add_edge(lastVertId, vertID);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID);
        CC_ENSURES(res.second);
    }
}

void processCopyPass(RAG &rag, const LGD &lgd, uint32_t passID, const CopyPass &pass) {
    auto  vertID = add_vertex(rag, passID);
    auto &node   = get(RAG::AccessNodeTag, rag);
    for (const auto &pair : pass.copyPairs) {
        auto sourceRange = Range{
            pair.mipLevels,
            pair.numSlices,
            pair.mostDetailedMip,
            pair.firstSlice,
            pair.planeSlice,
        };
        auto targetRange = Range{
            pair.mipLevels,
            pair.numSlices,
            pair.mostDetailedMip,
            pair.firstSlice,
            pair.planeSlice,
        };
        addAccessNode(rag, node, PassType::Copy, pair.source.name, defaultVisibility, AccessType::READ, sourceRange);
        addAccessNode(rag, node, PassType::Copy, pair.target.name, defaultVisibility, AccessType::WRITE, targetRange);
        uint32_t lastVertSrc = dependencyCheck(vertID, PassType::Copy, boost::hash<PmrString>(pair.source.name), defaultVisibility, gfx::MemoryAccessBit::READ_ONLY);
        if (lastVertSrc != 0xFFFFFFFF) {
            auto res = add_edge(lastVertSrc, vertID);
            CC_ENSURES(res.second);
            dependent = true;
        }
        uint32_t lastVertDst = dependencyCheck(vertID, PassType::Copy, boost::hash<PmrString>(pair.source.name), defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY);
        if (lastVertDst != 0xFFFFFFFF) {
            auto res = add_edge(lastVertDst, vertID);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID);
        CC_ENSURES(res.second);
    }
}

void processMovePass(RAG &rag, const LGD &lgd, uint32_t passID, const MovePass &pass) {
    // do nothing: all move passes should have been aliased when barrier happens.
}

void processRaytracePass(RAG &rag, const LGD &lgd, uint32_t passID, const RaytracePass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNodeTag, rag);
    bool  dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &            computeView = pair.second;
        gfx::ShaderStageFlagBit visibility  = getVisibilityByDescName(lg, pair.first);
        addAccessNode(rag, node, PassType::Raytrace, computeView.name, visibility, toGfxAccess(computeView.accessType), Range{});
        auto access     = toGfxAccess(computeView.accessType);
        auto lastVertID = dependencyCheck(vertID, PassType::Raytrace, boost::hash<PmrString>(computeView.name), visibility, access);
        if (lastVertID != 0xFFFFFFFF) {
            auto res = add_edge(lastVertId, vertID);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID);
        CC_ENSURES(res.second);
    }
}

void processPresentPass(RAG &rag, const LGD &lgd, uint32_t passID, const PresentPass &pass) {
    auto &node = get(RAG::AccessNodeTag, rag);
    addAccessNode(rag, node, PassType::Present, pass.resourceName, defaultVisibility, AccessType::WRITE, Range{});
    auto lastVertID = dependencyCheck(vertID, PassType::Present, boost::hash<PmrString>(pass.resourceName), defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY);
    if (lastVertID != 0xFFFFFFFF) {
        auto res = add_edge(lastVertId, vertID);
        CC_ENSURES(res.second);
    } else {
        // LOG("~~~~~~~~~~ Found an empty pass! ~~~~~~~~~~");
        auto res = add_edge(EXPECT_START_ID, vertID);
        CC_ENSURES(res.second);
    }
}
// status of resource access
void buildAccessGraph(const RenderGraph &rg, const LayoutGraphData &lgd, ResourceAccessGraph &rag) {
    //what we need:
    // - pass dependency
    // - pass attachment access

    PmrFlatMap<unt32_t /*resourceID*/, ResourceTransition /*last-curr-status*/> accessRecord;

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
    CC_EXPECTS(startID == EXPECT_START_ID);

    for (const auto passID : makeRange(vertices(rg))) {
        visitObject(
            passID, rg,
            [&](const RasterPass &pass) {
                processRasterPass(rag, lgd, passID, pass);
            },
            [&](const ComputePass &pass) {
                processComputePass(rag, lgd, passID, pass);
            },
            [&](const CopyPass &pass) {
                processCopyPass(rag, lgd, passID, pass);
            },
            [&](const MovePass &pass) {
                processMovePass(rag, lgd, passID, pass);
            },
            [&](const RaytracePass &pass) {
                processRaytracePass(rag, lgd, passID, pass);
            },
            [&](const PresentPass &pass) {
                processPresentPass(rag, lgd, passID, pass);
            },
            [&](const auto & /*pass*/) {
                // do nothing
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
        // - beginAccess: not NONE, endAccess: not NONE ===> full barrier
        // - beginAccess: not NONE, endAccess: NONE     ===> split begin barrier
        // - beginAccess: NONE, endAccess: not NONE     ===> split end barrier

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

            if ((*fromIter).visibility == (*toIter).visibility && (*fromIter).access == (*toIter).access) {
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
                        (*fromIter).visibility,
                        (*toIter).visibility,
                        (*fromIter).access,
                        (*toIter).access,
                    });
                } else {
                    (*srcBarrierIter).from            = from;
                    (*srcBarrierIter).to              = to;
                    (*srcBarrierIter).beginVisibility = (*fromIter).visibility;
                    (*srcBarrierIter).endVisibility   = (*toIter).visibility;
                    (*srcBarrierIter).beginAccess     = (*fromIter).access;
                    (*srcBarrierIter).endAccess       = (*toIter).access;
                }
            } else {
                if (srcBarrierIter = srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back({
                        resourceID,
                        from,
                        to,
                        (*fromIter).visibility,
                        defaultVisibility,
                        (*fromIter).access,
                        defaultAccess,
                    });
                } else {
                    if (from > (*srcBarrierIter).from) {
                        uint32_t siblingPass              = (*srcBarrierIter).from;
                        (*srcBarrierIter).from            = from;
                        (*srcBarrierIter).beginVisibility = (*fromIter).visibility;
                        (*srcBarrierIter).beginAccess     = (*fromIter).access;

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
                        (*toIter).visibility,
                        defaultAccess,
                        (*toIter).access,
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
                        (*dstBarrierIter).endVisibility = (*toIter).visibility;
                        (*dstBarrierIter).endAccess     = (*toIter).access;

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