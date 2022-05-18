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
#include "Range.h"
#include "RenderGraphGraphs.h"
#include "boost/lexical_cast.hpp"

namespace cc {

namespace render {
#pragma region predefine
using PmrString = ccstd::pmr::string;

using RAG = ResourceAccessGraph;
using LGD = LayoutGraphData;
using BarrierMap = FlatMap<ResourceAccessGraph::vertex_descriptor, BarrierNode>;
using AccessVertex = ResourceAccessGraph::vertex_descriptor;
using InputStatusTuple = std::tuple<PassType /*passType*/, PmrString /*resourceName*/, gfx::ShaderStageFlagBit /*visibility*/, gfx::MemoryAccessBit /*access*/>;
using ResourceHandle = ResourceGraph::vertex_descriptor;
using ResourceNames = PmrFlatSet<PmrString>;

auto defaultAccess = gfx::MemoryAccessBit::NONE;
auto defaultVisibility = gfx::ShaderStageFlagBit::NONE;

constexpr uint32_t EXPECT_START_ID = 0;
constexpr uint32_t INVALID_ID = 0xFFFFFFFF;

using AccessTable = PmrFlatMap<ResourceHandle /*resourceID*/, ResourceTransition /*last-curr-status*/>;
using ExternalResMap = PmrFlatMap<PmrString /*resourceName*/, ResourceTransition /*last-curr-status*/>;

// for scoped enum only
template <typename From, typename To>
class GfxTypeConverter {
public:
    To operator()(From from) {
        return static_cast<To>(
            static_cast<std::underlying_type_t<From>>(from));
    }
};

static auto toGfxAccess = GfxTypeConverter<AccessType, gfx::MemoryAccessBit>();

//AccessStatus.vertID : in resourceNode it's resource ID; in barrierNode it's pass ID.
AccessVertex dependencyCheck(RAG &rag, AccessTable &accessRecord, AccessVertex curVertID, const InputStatusTuple &status);
gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lgd, uint32_t passID, const PmrString &slotName);

void addAccessNode(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, InputStatusTuple status, const Range &range);
void processRasterPass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RasterPass &pass);
void processComputePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const ComputePass &pass);
void processCopyPass(RAG &rag, const LGD & /*lgd*/, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const CopyPass &pass);
void processRaytracePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RaytracePass &pass);
void processPresentPass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const PresentPass &pass);

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passL, uint32_t passR) { return (passL ^ passR) == 1; }
bool isStatusDependent(const AccessStatus &lhs, const AccessStatus &rhs);

#pragma endregion predefine

#pragma region graphProcess
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

    auto startID = add_vertex(rag, INVALID_ID);
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

struct BarrierVisitor : public boost::bfs_visitor<> {
    using Vertex = ResourceAccessGraph::vertex_descriptor;
    using Edge = ResourceAccessGraph::edge_descriptor;
    using Graph = ResourceAccessGraph;

    explicit BarrierVisitor(const ResourceGraph &rg, BarrierMap &barriers, ExternalResMap &extMap, ResourceNames &externalNames)
    : barrierMap(barriers), resourceGraph(rg), externalMap(extMap), externalResNames(externalNames) {
    }

    void discover_vertex(Vertex u, const Graph &g) {
    }

    void batchBarriers(Edge e, const Graph &g) {
        // what we get:
        // - beginAccess: not NONE, endAccess: not NONE ===> full barrier
        // - beginAccess: not NONE, endAccess: NONE     ===> split begin barrier
        // - beginAccess: NONE, endAccess: not NONE     ===> split end barrier

        Vertex from = source(e, g);
        Vertex to = target(e, g);

        bool isAdjacent = isPassExecAdjecent(from, to);

        const ResourceAccessNode &fromAccess = get(ResourceAccessGraph::AccessNode, g, from);
        const ResourceAccessNode &toAccess = get(ResourceAccessGraph::AccessNode, g, to);

        std::vector<AccessStatus> commonResources;
        const std::vector<AccessStatus> &fromStatus = fromAccess.attachemntStatus;
        const std::vector<AccessStatus> &toStatus = toAccess.attachemntStatus;

        std::set_intersection(fromStatus.begin(), fromStatus.end(),
                              toStatus.begin(), toStatus.end(),
                              std::back_inserter(commonResources),
                              [](const AccessStatus &lhs, const AccessStatus &rhs) {
                                  return lhs.vertID < rhs.vertID;
                              });

        if (barrierMap.find(from) == barrierMap.end()) {
            barrierMap.emplace(from, BarrierNode{});
        }
        if (barrierMap.find(to) == barrierMap.end()) {
            barrierMap.emplace(to, BarrierNode{});
        }

        std::vector<Barrier> &srcRearBarriers = barrierMap[from].rearBarriers;
        std::vector<Barrier> &dstFrontBarriers = barrierMap[to].frontBarriers;

        // NOLINTNEXTLINE
        for (uint32_t i = 0; i < commonResources.size(); ++i) {
            const uint32_t resourceID = commonResources[i].vertID;
            auto findAccessByID = [resourceID](const AccessStatus &resAccess) { return resAccess.vertID == resourceID; };
            auto fromIter = std::find_if(fromStatus.begin(), fromStatus.end(), findAccessByID);
            auto toIter = std::find_if(toStatus.begin(), toStatus.end(), findAccessByID);

            // can't happen
            CC_ASSERT(fromIter != fromStatus.end());
            CC_ASSERT(toIter != toStatus.end());

            if (!isStatusDependent(*fromIter, *toIter)) {
                continue;
            }

            auto findBarrierNodeByResID = [resourceID](const Barrier &barrier) { return resourceID == barrier.resourceID; };

            auto srcBarrierIter = std::find_if(srcRearBarriers.begin(), srcRearBarriers.end(), findBarrierNodeByResID);
            auto dstBarrierIter = std::find_if(dstFrontBarriers.begin(), dstFrontBarriers.end(), findBarrierNodeByResID);

            if (srcBarrierIter == srcRearBarriers.end()) {
                srcRearBarriers.emplace_back(Barrier{
                    resourceID,
                    {
                        from,
                        (*fromIter).visibility,
                        (*fromIter).access,
                        (*fromIter).passType,
                        (*fromIter).range,
                    },
                    {
                        to,
                        isAdjacent ? (*toIter).visibility : defaultVisibility,
                        isAdjacent ? (*toIter).access : defaultAccess,
                        (*toIter).passType,
                        (*toIter).range,
                    },
                });

            } else {
                if (isAdjacent) {
                    (*srcBarrierIter).beginStatus.vertID = from;
                    (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                    (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                    (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                    (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                    (*srcBarrierIter).endStatus.vertID = to;
                    (*srcBarrierIter).endStatus.visibility = (*toIter).visibility;
                    (*srcBarrierIter).endStatus.access = (*toIter).access;
                    (*srcBarrierIter).endStatus.passType = (*toIter).passType;
                    (*srcBarrierIter).endStatus.range = (*toIter).range;
                } else {
                    if (from > (*srcBarrierIter).beginStatus.vertID) {
                        uint32_t siblingPass = (*srcBarrierIter).beginStatus.vertID;
                        (*srcBarrierIter).beginStatus.vertID = from;
                        (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                        (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                        (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                        (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                        auto siblingIter = std::find_if(barrierMap[siblingPass].rearBarriers.begin(), barrierMap[siblingPass].rearBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        CC_ASSERT(siblingIter != barrierMap[siblingPass].rearBarriers.end());
                        barrierMap[siblingPass].rearBarriers.erase(siblingIter);
                    }
                }
            }

            if (dstBarrierIter == dstFrontBarriers.end()) {
                //if isAdjacent, full barrier already in src rear barriers.
                if (!isAdjacent) {
                    dstFrontBarriers.emplace_back(Barrier{
                        resourceID,
                        {
                            from,
                            defaultVisibility,
                            defaultAccess,
                            (*fromIter).passType,
                            (*fromIter).range,
                        },
                        {
                            to, // next use of resc varies between resources
                            (*toIter).visibility,
                            (*toIter).access,
                            (*toIter).passType,
                            (*toIter).range,
                        },
                    });
                }
            } else {
                if (isAdjacent) {
                    //adjacent, barrier should be commit at fromPass, and remove this iter from dstBarriers
                    (*srcBarrierIter).beginStatus.vertID = from;
                    (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                    (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                    (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                    (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                    (*srcBarrierIter).endStatus.vertID = to;
                    (*srcBarrierIter).endStatus.visibility = (*toIter).visibility;
                    (*srcBarrierIter).endStatus.access = (*toIter).access;
                    (*srcBarrierIter).endStatus.passType = (*toIter).passType;
                    (*srcBarrierIter).endStatus.range = (*toIter).range;

                    dstFrontBarriers.erase(dstBarrierIter);
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
                    if (to < (*dstBarrierIter).endStatus.vertID) {
                        uint32_t siblingPass = (*dstBarrierIter).endStatus.vertID;
                        (*dstBarrierIter).endStatus.vertID = to;
                        (*dstBarrierIter).endStatus.visibility = (*toIter).visibility;
                        (*dstBarrierIter).endStatus.access = (*toIter).access;
                        (*dstBarrierIter).endStatus.passType = (*toIter).passType;
                        (*dstBarrierIter).endStatus.range = (*toIter).range;

                        //remove the further redundant barrier
                        auto siblingIter = std::find_if(barrierMap[siblingPass].frontBarriers.begin(), barrierMap[siblingPass].frontBarriers.end(),
                                                        [resourceID](const Barrier &barrier) {
                                                            return resourceID == barrier.resourceID;
                                                        });
                        CC_ASSERT(siblingIter != barrierMap[siblingPass].frontBarriers.end());
                        barrierMap[siblingPass].frontBarriers.erase(siblingIter);
                    }
                }
            }
        }

        //----------------------------------------------check external----------------------------------------------

        auto barrierExternalRes = [&](const AccessStatus &rescAccess, bool isFrom) {
            uint32_t rescID = rescAccess.vertID;
            bool externalRes = get(get(ResourceGraph::Traits, resourceGraph), rescID).hasSideEffects();
            Vertex vert = isFrom ? from : to;
            if (externalRes) {
                const PmrString &resName = get(ResourceGraph::Name, resourceGraph, rescID);
                auto iter = externalMap.find(resName);
                //first meet in this frame
                if (externalResNames.find(resName) == externalResNames.end()) {
                    //first meet in whole program
                    if (iter == externalMap.end()) {
                        externalMap.insert({resName,
                                            ResourceTransition{
                                                {
                                                    EXPECT_START_ID,
                                                    rescAccess.visibility,
                                                    rescAccess.access,
                                                    rescAccess.passType,
                                                    rescAccess.range,
                                                },
                                                {
                                                    vert,
                                                    rescAccess.visibility,
                                                    rescAccess.access,
                                                    rescAccess.passType,
                                                    rescAccess.range,
                                                },
                                            }});
                    } else {
                        externalMap[resName].lastStatus = externalMap[resName].currStatus;
                        externalMap[resName].currStatus = {
                            vert,
                            rescAccess.visibility,
                            rescAccess.access,
                            rescAccess.passType,
                            rescAccess.range,
                        };

                        if (isStatusDependent(externalMap[resName].lastStatus, externalMap[resName].currStatus)) {
                            barrierMap[vert].frontBarriers.emplace_back(Barrier{
                                rescID,
                                (*iter).second.currStatus,
                                externalMap[resName].currStatus,
                            });
                        }
                    }
                    externalResNames.insert(resName);
                } else {
                    if ((*iter).second.currStatus.vertID < vert) {
                        //[pass: vert] is later access than in iter.
                        externalMap[resName].lastStatus = externalMap[resName].currStatus;
                        externalMap[resName].currStatus = {
                            INVALID_ID,
                            rescAccess.visibility,
                            rescAccess.access,
                            rescAccess.passType,
                            rescAccess.range,
                        };
                    }
                }
            }
        };

        for (const AccessStatus &rescAccess : fromAccess.attachemntStatus) {
            barrierExternalRes(rescAccess, true);
        }

        for (const AccessStatus &rescAccess : toAccess.attachemntStatus) {
            barrierExternalRes(rescAccess, false);
        }
        //---------------------------------------------------------------------------------------------------------
    }

    void examine_edge(Edge e, const Graph &g) {
        batchBarriers(e, g);
    }

    BarrierMap &barrierMap;
    const ResourceGraph &resourceGraph;

    ExternalResMap &externalMap;     //last frame to curr frame status transition
    ResourceNames &externalResNames; //first meet in this frame
};

void FrameGraphDispatcher::buildBarriers() {
    {
        // record resource current in-access and out-access for every single node
        ResourceAccessGraph rag(scratch);
        // a mutable global resource access look-up table
        buildAccessGraph(graph, layoutGraph, resourceGraph, rag);

        // found pass id in this map ? barriers you should commit when run into this pass
        // : or no extra barrier needed.
        BarrierMap batchedBarriers;
        ResourceNames namesSet;
        {
            // _externalResNames records external resource between frames
            BarrierVisitor visitor(resourceGraph, batchedBarriers, _externalResMap, namesSet);
            auto colors = rag.colors(scratch);
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
#pragma endregion graphProcess

#pragma region assisstantFuncDefinition

bool isStatusDependent(const AccessStatus &lhs, const AccessStatus &rhs) {
    bool res = true;
    if (lhs.passType == rhs.passType &&
        lhs.visibility == rhs.visibility &&
        lhs.access == gfx::MemoryAccessBit::READ_ONLY &&
        rhs.access == gfx::MemoryAccessBit::READ_ONLY) {
        res = false;
    }
    return res;
}

void addAccessNode(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, InputStatusTuple status, const Range &range) {
    // std::tie(passType, rescName, visibility, access) ;
    PassType passType = std::get<0>(status);
    const PmrString &rescName = std::get<1>(status);
    gfx::ShaderStageFlagBit visibility = std::get<2>(status);
    gfx::MemoryAccessBit access = std::get<3>(status);

    CC_EXPECTS(rg.valueIndex.find(rescName) != rg.valueIndex.end());
    uint32_t rescID = rg.valueIndex.at(rescName);
    if (std::find(rag.resourceNames.begin(), rag.resourceNames.end(), rescName) == rag.resourceNames.end()) {
        rag.resourceIndex.emplace(rescName, rescID);
        rag.resourceNames.emplace_back(rescName);
    }

    node.attachemntStatus.emplace_back(AccessStatus{
        rescID,
        visibility,
        access,
        passType,
        range,
    });
}

AccessVertex dependencyCheck(RAG &rag, AccessTable &accessRecord, AccessVertex curVertID, const InputStatusTuple &status) {
    PassType passType = std::get<0>(status);
    const PmrString &rescName = std::get<1>(status);
    gfx::ShaderStageFlagBit visibility = std::get<2>(status);
    gfx::MemoryAccessBit access = std::get<3>(status);

    AccessVertex lastVertID = INVALID_ID;
    CC_EXPECTS(rag.resourceIndex.find(rescName) != rag.resourceIndex.end());
    auto resourceID = rag.resourceIndex[rescName];
    auto iter = accessRecord.find(resourceID);
    if (iter == accessRecord.end()) {
        accessRecord.emplace(
            resourceID,
            ResourceTransition{
                {},
                {curVertID, visibility, access, passType, Range{}}});
    } else {
        ResourceTransition &trans = iter->second;
        if (access == gfx::MemoryAccessBit::READ_ONLY && trans.currStatus.access == gfx::MemoryAccessBit::READ_ONLY) {
            // current READ, no WRITE before in this frame, it's expected to be external.
            bool dirtyExternalRes = trans.lastStatus.vertID == INVALID_ID;
            if (!dirtyExternalRes) {
                auto res = add_edge(trans.lastStatus.vertID, curVertID, rag);
                CC_ENSURES(res.second);
            }
            trans.currStatus = {curVertID, visibility, access, passType, Range{}};
            lastVertID = trans.lastStatus.vertID;
        } else {
            bool needTransition = (trans.currStatus.access != access) || (trans.currStatus.passType != passType) || (trans.currStatus.visibility != visibility);
            if (needTransition) {
                trans.lastStatus = trans.currStatus;
                trans.currStatus = {curVertID, visibility, access, passType, Range{}};
                auto res = add_edge(trans.lastStatus.vertID, curVertID, rag);
                CC_ENSURES(res.second);
                lastVertID = trans.lastStatus.vertID;
            }
        }
    }
    return lastVertID;
}

gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lgd, uint32_t passID, const PmrString &/*slotName*/) {
    auto vis = gfx::ShaderStageFlagBit::NONE;

    const auto &layout = get(LGD::Layout, lgd, passID);
    bool found = false;

    auto compare = [](const PmrString &name, const uint32_t slot) {
        return boost::lexical_cast<uint32_t>(name) == slot;
    };
/*
    for (const auto &pair : layout.descriptorSets) {
        const auto &descriptorSetData = pair.second;
        const auto &tables = descriptorSetData.tables;
        for (const auto &attrPair : tables) {
            const auto descriptorBlocks = attrPair.second.descriptorBlocks;
            for (const auto &block : descriptorBlocks) {
                for (const auto &descriptor : block.descriptors) {
                    uint32_t descirptorID = descriptor.descriptorID;
                    if (compare(slotName, descirptorID)) {
                        found = true;
                        return attrPair.first;
                    }
                }
            }
        }
    }
*/
    // UNREACHABLE
    CC_ENSURES(found);
    return vis;
};

void processRasterPass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RasterPass &pass) {
    auto vertID = add_vertex(rag, passID);
    auto &node = get(RAG::AccessNode, rag, vertID);
    bool dependent = false;
    for (const auto &pair : pass.rasterViews) {
        const auto &rasterView = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        auto access = toGfxAccess(rasterView.accessType);
        addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::RASTER, rasterView.slotName, visibility, access}, Range{});
        auto lastVertId = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::RASTER, rasterView.slotName, visibility, access});
        if (lastVertId != INVALID_ID) {
            auto res = add_edge(lastVertId, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
    }
    for (const auto &pair : pass.computeViews) {
        const auto &values = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access}, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access});
            if (lastVertId != INVALID_ID) {
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
    auto vertID = add_vertex(rag, passID);
    auto &node = get(RAG::AccessNode, rag, vertID);
    bool dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &values = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access}, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access});
            if (lastVertId != INVALID_ID) {
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

void processCopyPass(RAG &rag, const LGD & /*lgd*/, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const CopyPass &pass) {
    auto vertID = add_vertex(rag, passID);
    auto &node = get(RAG::AccessNode, rag, vertID);
    bool dependent = false;
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
        addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::READ_ONLY}, sourceRange);
        addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::COPY, pair.target, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY}, targetRange);
        uint32_t lastVertSrc = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::READ_ONLY});
        if (lastVertSrc != INVALID_ID) {
            auto res = add_edge(lastVertSrc, vertID, rag);
            CC_ENSURES(res.second);
            dependent = true;
        }
        uint32_t lastVertDst = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::COPY, pair.source, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY});
        if (lastVertDst != INVALID_ID) {
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

void processRaytracePass(RAG &rag, const LGD &lgd, const ResourceGraph &rescGraph, AccessTable &accessRecord, uint32_t passID, const RaytracePass &pass) {
    auto vertID = add_vertex(rag, passID);
    auto &node = get(RAG::AccessNode, rag, vertID);
    bool dependent = false;
    for (const auto &pair : pass.computeViews) {
        const auto &values = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        for (const auto &computeView : values) {
            auto access = toGfxAccess(computeView.accessType);
            addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access}, Range{});
            auto lastVertId = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::COMPUTE, computeView.name, visibility, access});
            if (lastVertId != INVALID_ID) {
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
    auto vertID = add_vertex(rag, passID);
    auto &node = get(RAG::AccessNode, rag, vertID);
    bool dependent = false;
    for (const auto &pair : pass.presents) {
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(lgd, passID, pair.first);
        auto lastVertId = dependencyCheck(rag, accessRecord, vertID, InputStatusTuple{PassType::PRESENT, pair.first, visibility, gfx::MemoryAccessBit::WRITE_ONLY});
        addAccessNode(rag, rescGraph, node, InputStatusTuple{PassType::PRESENT, pair.first, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY}, Range{});
        if (lastVertId != INVALID_ID) {
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
}

#pragma endregion assisstantFuncDefinition

} // namespace render

} // namespace cc
