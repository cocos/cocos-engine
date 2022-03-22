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
#include "FGDispatcherGraphs.h"
#include "FGDispatcherTypes.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphTypes.h"
#include "RenderGraphGraphs.h"
#include "boost/lexical_cast.hpp"
#include "Range.h"

namespace cc {

namespace render {

using RAG          = ResourceAccessGraph;
using LGD          = LayoutGraphData;
using BarrierMap   = FlatMap<ResourceAccessGraph::vertex_descriptor, BarrierNode>;
using AccessVertex = ResourceAccessGraph::vertex_descriptor;

auto defaultAccess     = gfx::MemoryAccessBit::NONE;
auto defaultVisibility = gfx::ShaderStageFlagBit::NONE;

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

using AccessTable = PmrFlatMap<uint32_t /*resourceID*/, ResourceTransition /*last-curr-status*/>;

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
                   const ResourceGraph &   rg,
                   ResourceAccessNode &    node,
                   PassType                passType,
                   PmrString               rescName,
                   gfx::ShaderStageFlagBit visibility,
                   gfx::MemoryAccessBit    access,
                   const Range &           range) {
    node.passType = passType;
    if (passType != PassType::PRESENT) {
        CC_EXPECTS(rg.valueIndex.find(rescName) != rg.valueIndex.end());
        uint32_t rescID = rg.valueIndex.at(rescName);
        if (std::find(rag.resourceNames.begin(), rag.resourceNames.end(), rescName) == rag.resourceNames.end()) {
            rag.resourceIndex.emplace(rescName, rescID);
            rag.resourceNames.emplace_back(rescName);
        } else {
            rescID = rag.resourceIndex[rescName];
        }

        node.attachemntStatus.emplace_back(ResourceAccessDesc{
            false,
            rescID,
            visibility,
            access,
            range,
        });
    }
}

AccessVertex dependencyCheck(RAG &rag, AccessTable &accessRecord, ResourceAccessNode &node, uint32_t vertexID, PassType passType, const PmrString &rescName, gfx::ShaderStageFlagBit visibility, gfx::MemoryAccessBit access) {
    AccessVertex lastVertexID = 0xFFFFFFFF;
    CC_EXPECTS(rag.resourceIndex.find(rescName) != rag.resourceIndex.end());
    auto resourceID = rag.resourceIndex[rescName];
    auto iter       = accessRecord.find(resourceID);
    if (iter == accessRecord.end()) {
        bool external = static_cast<bool>(access & gfx::MemoryAccessBit::READ_ONLY);
        accessRecord.emplace(
            resourceID,
            ResourceTransition{
                external,
                {},
                {vertexID, passType, access, visibility}});
        node.attachemntStatus.back().external = external;
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
            bool needTransition = (trans.currStatus.access != access) || (trans.currStatus.passType != passType) || (trans.currStatus.visibility != visibility);
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

gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lgd, uint32_t passID, const PmrString &slotName) {
    auto vis = gfx::ShaderStageFlagBit::NONE;

    const auto &layout = get(LGD::Layout, lgd, passID);
    bool        found  = false;

    auto compare = [](const PmrString &name, const uint32_t slot) {
        return boost::lexical_cast<uint32_t>(name) == slot;
    };

    for (const auto &pair : layout.descriptorSets) {
        const auto &descriptorSetData = pair.second;
        const auto &tables            = descriptorSetData.tables;
        for (const auto &attrPair : tables) {
            uint32_t slot = attrPair.second.tableID;
            if (compare(slotName, slot)) {
                found = true;
                vis   = attrPair.first;
            }
        }
    }

    CC_ENSURES(found);
    return vis;
};

void processRasterPass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RasterPass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNode, rag, vertID);
    bool  dependent = false;
    for (const auto &pair : pass.rasterViews) {
        const auto &            rasterView = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        auto                    access     = toGfxAccess(rasterView.accessType);
        addAccessNode(rag, rescGraph, node, PassType::RASTER, rasterView.slotName, visibility, access, Range{});
        auto lastVertId = dependencyCheck(rag, accessRecord, node, vertID, PassType::RASTER, rasterView.slotName, visibility, access);
        if (lastVertId != 0xFFFFFFFF) {
            auto res = add_edge(lastVertId, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    for (const auto &pair : pass.computeViews) {
        const auto &            values     = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, PassType::COMPUTE, computeView.name, visibility, access, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, node, vertID, PassType::COMPUTE, computeView.name, visibility, access);
            if (lastVertId != 0xFFFFFFFF) {
                auto res = add_edge(lastVertId, vertID, rag);
                CC_ENSURES(res.second);
                dependent = true;
            }
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID, rag);
        CC_ENSURES(res.second);
    }
}

void processComputePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const ComputePass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNode, rag, vertID);
    bool  dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &            values     = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, PassType::COMPUTE, computeView.name, visibility, access, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, node, vertID, PassType::COMPUTE, computeView.name, visibility, access);
            if (lastVertId != 0xFFFFFFFF) {
                auto res = add_edge(lastVertId, vertID, rag);
                CC_ENSURES(res.second);
                dependent = true;
            }
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID, rag);
        CC_ENSURES(res.second);
    }
}

void processCopyPass(RAG &rag, const LGD &/*lgd*/, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const CopyPass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNode, rag, vertID);
    bool  dependent = false;
    for (const auto &pair : pass.copyPairs) {
        auto sourceRange = Range{
            pair.mipLevels,
            pair.numSlices,
            pair.sourceMostDetailedMip,
            pair.sourceFirstSlice,
            pair.sourcePlaneSlice,
        };
        auto targetRange = Range{
            pair.mipLevels,
            pair.numSlices,
            pair.targetMostDetailedMip,
            pair.targetFirstSlice,
            pair.targetPlaneSlice,
        };
        addAccessNode(rag, rescGraph, node, PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::READ_ONLY, sourceRange);
        addAccessNode(rag, rescGraph, node, PassType::COPY, pair.target, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY, targetRange);
        uint32_t lastVertSrc = dependencyCheck(rag, accessRecord, node, vertID, PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::READ_ONLY);
        if (lastVertSrc != 0xFFFFFFFF) {
            auto res = add_edge(lastVertSrc, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
        uint32_t lastVertDst = dependencyCheck(rag, accessRecord, node, vertID, PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY);
        if (lastVertDst != 0xFFFFFFFF) {
            auto res = add_edge(lastVertDst, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID, rag);
        CC_ENSURES(res.second);
    }
}

void processMovePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const MovePass &pass) {
    // do nothing: all move passes should have been aliased before barrier happens.
}

void processRaytracePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RaytracePass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNode, rag, vertID);
    bool  dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &            values     = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, PassType::COMPUTE, computeView.name, visibility, access, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, node, vertID, PassType::COMPUTE, computeView.name, visibility, access);
            if (lastVertId != 0xFFFFFFFF) {
                auto res = add_edge(lastVertId, vertID, rag);
                CC_ENSURES(res.second);
                dependent = true;
            }
        }
    }
    if (!dependent) {
        auto res = add_edge(EXPECT_START_ID, vertID, rag);
        CC_ENSURES(res.second);
    }
}

void processPresentPass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const PresentPass &pass) {
    auto  vertID    = add_vertex(rag, passID);
    auto &node      = get(RAG::AccessNode, rag, vertID);
    bool  dependent = false;
    addAccessNode(rag, rescGraph, node, PassType::PRESENT, "", defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY, Range{});
    for (const auto &pair : pass.presents) {
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        auto                    lastVertId = dependencyCheck(rag, accessRecord, node, vertID, PassType::PRESENT, pair.first, visibility, gfx::MemoryAccessBit::WRITE_ONLY);
        if (lastVertId != 0xFFFFFFFF) {
            auto res = add_edge(lastVertId, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    if (!dependent) {
        // LOG("~~~~~~~~~~ Found an empty pipeline! ~~~~~~~~~~");
        auto res = add_edge(EXPECT_START_ID, vertID, rag);
        CC_ENSURES(res.second);
    }
    rag.presentPasses.push_back(vertID);
}
// status of resource access
void buildAccessGraph(const RenderGraph &renderGraph, const LayoutGraphData &lgd, const ResourceGraph &rescGragh, ResourceAccessGraph &rag) {
    //what we need:
    // - pass dependency
    // - pass attachment access

    AccessTable accessRecord;

    size_t numPasses = 1;
    numPasses += renderGraph.rasterPasses.size();
    numPasses += renderGraph.computePasses.size();
    numPasses += renderGraph.copyPasses.size();
    numPasses += renderGraph.movePasses.size();
    numPasses += renderGraph.raytracePasses.size();

    rag.reserve(static_cast<ResourceAccessGraph::vertices_size_type>(numPasses));
    rag.resourceNames.reserve(128);
    rag.resourceIndex.reserve(128);

    auto startID = add_vertex(rag, 0xFFFFFFFF);
    CC_EXPECTS(startID == EXPECT_START_ID);

    for (const auto passID : makeRange(vertices(renderGraph))) {
        visitObject(
            passID, renderGraph,
            [&](const RasterPass &pass) {
                processRasterPass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const ComputePass &pass) {
                processComputePass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const CopyPass &pass) {
                processCopyPass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const MovePass &pass) {
                processMovePass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const RaytracePass &pass) {
                processRaytracePass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const PresentPass &pass) {
                processPresentPass(rag, lgd, rescGragh, accessRecord, passID, pass);
            },
            [&](const auto & /*pass*/) {
                // do nothing
            });
    }
}

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passL, uint32_t passR) {
    return (passL ^ passR) == 1;
}

struct BarrierVisitor : public boost::bfs_visitor<> {
    using Vertex = ResourceAccessGraph::vertex_descriptor;
    using Edge   = ResourceAccessGraph::edge_descriptor;
    using Graph  = ResourceAccessGraph;

    explicit BarrierVisitor(BarrierMap &barriers) : barrierMap(barriers) {
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

        const ResourceAccessNode &fromAccess = get(ResourceAccessGraph::AccessNode, g, from);
        const ResourceAccessNode &toAccess   = get(ResourceAccessGraph::AccessNode, g, to);

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
            barrierMap.emplace(from, BarrierNode{});
        }

        std::vector<Barrier> &srcRearBarriers  = barrierMap[from].rearBarriers;
        std::vector<Barrier> &dstFrontBarriers = barrierMap[to].frontBarriers;

        // NOLINTNEXTLINE
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

            auto findBarrierNodeByResID = [resourceID](const Barrier &barrier) { return resourceID == barrier.resourceID; };

            auto srcBarrierIter = std::find_if(srcRearBarriers.begin(), srcRearBarriers.end(), findBarrierNodeByResID);

            auto dstBarrierIter = std::find_if(dstFrontBarriers.begin(), dstFrontBarriers.end(), findBarrierNodeByResID);

            if (isAdjacent) {
                if (srcBarrierIter == srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back(Barrier{
                        resourceID,
                        from,
                        to, // next use of resc varies between resources
                        (*fromIter).visibility,
                        (*toIter).visibility,
                        (*fromIter).access,
                        (*toIter).access,
                        fromAccess.passType,
                        (*fromIter).range,
                        (*toIter).range,
                    });
                } else {
                    (*srcBarrierIter).from            = from;
                    (*srcBarrierIter).to              = to;
                    (*srcBarrierIter).beginVisibility = (*fromIter).visibility;
                    (*srcBarrierIter).endVisibility   = (*toIter).visibility;
                    (*srcBarrierIter).beginAccess     = (*fromIter).access;
                    (*srcBarrierIter).endAccess       = (*toIter).access;
                    (*srcBarrierIter).passType        = fromAccess.passType;
                    (*srcBarrierIter).fromRange       = (*fromIter).range;
                    (*srcBarrierIter).toRange         = (*toIter).range;
                }

                if (dstBarrierIter == dstFrontBarriers.end()) {
                    dstFrontBarriers.emplace_back(Barrier{
                        resourceID,
                        from,
                        to, // next use of resc varies between resources
                        (*fromIter).visibility,
                        (*toIter).visibility,
                        (*fromIter).access,
                        (*toIter).access,
                        toAccess.passType,
                        (*fromIter).range,
                        (*toIter).range,
                    });
                } else {
                    (*srcBarrierIter).from            = from;
                    (*srcBarrierIter).to              = to;
                    (*srcBarrierIter).beginVisibility = (*fromIter).visibility;
                    (*srcBarrierIter).endVisibility   = (*toIter).visibility;
                    (*srcBarrierIter).beginAccess     = (*fromIter).access;
                    (*srcBarrierIter).endAccess       = (*toIter).access;
                    (*srcBarrierIter).passType        = toAccess.passType;
                    (*srcBarrierIter).fromRange       = (*fromIter).range;
                    (*srcBarrierIter).toRange         = (*toIter).range;
                }
            } else {
                if (srcBarrierIter == srcRearBarriers.end()) {
                    srcRearBarriers.emplace_back(Barrier{
                        resourceID,
                        from,
                        to,
                        (*fromIter).visibility,
                        defaultVisibility,
                        (*fromIter).access,
                        defaultAccess,
                        fromAccess.passType,
                        (*fromIter).range,
                        (*toIter).range,
                    });
                } else {
                    if (from > (*srcBarrierIter).from) {
                        uint32_t siblingPass              = (*srcBarrierIter).from;
                        (*srcBarrierIter).from            = from;
                        (*srcBarrierIter).beginVisibility = (*fromIter).visibility;
                        (*srcBarrierIter).beginAccess     = (*fromIter).access;
                        (*srcBarrierIter).passType        = fromAccess.passType;
                        (*srcBarrierIter).fromRange       = (*fromIter).range;

                        auto siblingIter = std::find_if(barrierMap[siblingPass].rearBarriers.begin(), barrierMap[siblingPass].rearBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        assert(siblingIter != barrierMap[siblingPass].rearBarriers.end());
                        barrierMap[siblingPass].rearBarriers.erase(siblingIter);
                    }
                }

                if (dstBarrierIter == dstFrontBarriers.end()) {
                    dstFrontBarriers.emplace_back(Barrier{
                        resourceID,
                        from,
                        to,
                        defaultVisibility,
                        (*toIter).visibility,
                        defaultAccess,
                        (*toIter).access,
                        toAccess.passType,
                        (*fromIter).range,
                        (*toIter).range,
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
                        (*dstBarrierIter).passType      = toAccess.passType;
                        (*dstBarrierIter).toRange       = (*toIter).range;

                        //remove the further redundant barrier
                        auto siblingIter = std::find_if(barrierMap[siblingPass].frontBarriers.begin(), barrierMap[siblingPass].frontBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        assert(siblingIter != barrierMap[siblingPass].frontBarriers.end());
                        barrierMap[siblingPass].frontBarriers.erase(siblingIter);
                    }
                }
            }
        }

        //----------------------------------------------check external----------------------------------------------
        for (const ResourceAccessDesc &rescAccess : toAccess.attachemntStatus) {
            uint32_t rescID      = rescAccess.resourceID;
            bool     externalRes = rescAccess.external;
            if (rescAccess.external) {
                //first meet external
                if (externalSet.find(rescID) == externalSet.end()) {
                    barrierMap[to].rearBarriers.emplace_back(Barrier{
                        rescID,
                        0xFFFFFFFF,
                        to,
                        rescAccess.visibility,
                        gfx::ShaderStageFlagBit::NONE,
                        rescAccess.access,
                        gfx::MemoryAccessBit::NONE,
                        toAccess.passType,
                        rescAccess.range,
                        Range{},
                    });

                    externalSet.insert(rescID);
                } else {
                    if (out_degree(to, g) == 0) {
                        barrierMap[to].frontBarriers.emplace_back(Barrier{
                            rescID,
                            to,
                            0xFFFFFFFF,
                            gfx::ShaderStageFlagBit::NONE,
                            rescAccess.visibility,
                            gfx::MemoryAccessBit::NONE,
                            rescAccess.access,
                            toAccess.passType,
                            Range{},
                            rescAccess.range,
                        });
                    }
                }
            }
        }
        //---------------------------------------------------------------------------------------------------------
    }

    void examine_edge(Edge e, const Graph &g) {
        batchBarriers(e, g);
    }

    std::set<AccessVertex> externalSet;
    BarrierMap &           barrierMap;
};

void FrameGraphDispatcher::buildBarriers() const {
    {
        // record resource current in-access and out-access for every single node
        ResourceAccessGraph rag(scratch);
        // a mutable global resource access look-up table
        buildAccessGraph(graph, layoutGraph, resourceGraph, rag);

        // found pass id in this map ? barriers you should commit when run into this pass
        // : or no extra barrier needed.
        BarrierMap batchedBarriers;

        {
            BarrierVisitor             visitor(batchedBarriers);
            auto                       colors = rag.colors(scratch);
            boost::queue<AccessVertex> q;

            boost::breadth_first_visit(
                rag,
                EXPECT_START_ID,
                q,
                visitor,
                get(colors, rag));
        }
    }
}

} // namespace render

} // namespace cc
