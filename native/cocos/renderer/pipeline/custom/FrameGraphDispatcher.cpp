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
#ifdef __clang__
    #pragma clang diagnostic ignored "-Wshorten-64-to-32"
#endif
#include <algorithm>
#include <boost/graph/adjacency_list.hpp>
#include <boost/graph/breadth_first_search.hpp>
#include <boost/graph/transitive_closure.hpp>
#include <boost/range/algorithm.hpp>
#include <iterator>
#include <limits>
#include <vector>
#include "FGDispatcherGraphs.h"
#include "FGDispatcherTypes.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphTypes.h"
#include "Range.h"
#include "RenderGraphGraphs.h"
#include "base/Log.h"
#include "boost/graph/depth_first_search.hpp"
#include "boost/graph/hawick_circuits.hpp"
#include "boost/graph/visitors.hpp"
#include "boost/lexical_cast.hpp"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDevice.h"
#include "math/Vec2.h"
#include "pipeline/custom/GslUtils.h"
#include "pipeline/custom/RenderCommonFwd.h"
#include "pipeline/custom/RenderGraphTypes.h"

namespace cc {

namespace render {

static constexpr bool ENABLE_BRANCH_CULLING = true;

void passReorder(FrameGraphDispatcher &fgDispatcher);
void memoryAliasing(FrameGraphDispatcher &fgDispatcher);
void buildBarriers(FrameGraphDispatcher &fgDispatcher);

void FrameGraphDispatcher::run() {
    if (_enablePassReorder) {
        passReorder(*this);
    }
    if (_enableMemoryAliasing) {
        memoryAliasing(*this);
    }
    buildBarriers(*this);
}

void FrameGraphDispatcher::enablePassReorder(bool enable) {
    _enablePassReorder = enable;
}

void FrameGraphDispatcher::enableMemoryAliasing(bool enable) {
    _enableMemoryAliasing = enable;
}

void FrameGraphDispatcher::setParalellWeight(float paralellExecWeight) {
    _paralellExecWeight = clampf(paralellExecWeight, 0.0F, 1.0F);
}

/////////////////////////////////////////////////////////////////////////////////////INTERNAL⚡IMPLEMENTATION/////////////////////////////////////////////////////////////////////////////////////////////

//---------------------------------------------------------------predefine------------------------------------------------------------------
using PmrString = ccstd::pmr::string;
using RAG = ResourceAccessGraph;
using LGD = LayoutGraphData;
using gfx::PassType;
using BarrierMap = FrameGraphDispatcher::BarrierMap;
using AccessVertex = ResourceAccessGraph::vertex_descriptor;
using InputStatusTuple = std::tuple<PassType /*passType*/, PmrString /*resourceName*/, gfx::ShaderStageFlagBit /*visibility*/, gfx::MemoryAccessBit /*access*/>;
using ResourceHandle = ResourceGraph::vertex_descriptor;
using ResourceNames = PmrFlatSet<PmrString>;
using EdgeList = std::pair<RAG::edge_descriptor, RAG::edge_descriptor>;
using CloseCircuit = std::pair<EdgeList, EdgeList>;
using CloseCircuits = std::vector<CloseCircuit>;
using EmptyVert = EmptyGraph::vertex_descriptor;
using EmptyVerts = std::vector<EmptyVert>;
using EmptyEdge = EmptyGraph::edge_descriptor;
using EmptyEdges = std::vector<EmptyEdge>;
using ScoreMap = std::map<EmptyVert, std::pair<int64_t /*backward*/, int64_t /*forward*/>>;
using RasterViewsMap = PmrTransparentMap<ccstd::pmr::string, RasterView>;
using ComputeViewsMap = PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>>;

struct Graphs {
    const ResourceGraph &resourceGraph;
    const LayoutGraphData &layoutGraphData;
    ResourceAccessGraph &resourceAccessGraph;
    EmptyGraph &relationGraph;
};

struct ViewStatus {
    const PmrString &name;
    const PassType passType;
    const gfx::ShaderStageFlagBit visibility;
    const gfx::MemoryAccessBit access;
};

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

// static auto toGfxAccess = GfxTypeConverter<AccessType, gfx::MemoryAccessBit>();
gfx::MemoryAccessBit toGfxAccess(AccessType type) {
    switch (type) {
        case AccessType::READ:
            return gfx::MemoryAccessBit::READ_ONLY;
        case AccessType::WRITE:
            return gfx::MemoryAccessBit::WRITE_ONLY;
        case AccessType::READ_WRITE:
            return gfx::MemoryAccessBit::READ_WRITE;
        default:
            return gfx::MemoryAccessBit::NONE;
    }
};

// AccessStatus.vertID : in resourceNode it's resource ID; in barrierNode it's pass ID.
AccessVertex dependencyCheck(RAG &rag, AccessVertex curVertID, const ResourceGraph &rg, const ViewStatus &status);
gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lgd, uint32_t passID, const PmrString &resName);

void addAccessStatus(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, const ViewStatus &status);
void addCopyAccessStatus(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, const ViewStatus &status);
void processRasterPass(const Graphs &graphs, uint32_t passID, const RasterPass &pass);
void processComputePass(const Graphs &graphs, uint32_t passID, const ComputePass &pass);
void processCopyPass(const Graphs &graphs, uint32_t passID, const CopyPass &pass);
void processRaytracePass(const Graphs &graphs, uint32_t passID, const RaytracePass &pass);
void processPresentPass(const Graphs &graphs, uint32_t passID, const PresentPass &pass);

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passLID, uint32_t passRID) {
    return std::abs(static_cast<int>(passLID) - static_cast<int>(passRID)) <= 1;
}

bool isStatusDependent(const AccessStatus &lhs, const AccessStatus &rhs);
template <typename Graph>
bool tryAddEdge(uint32_t srcVertex, uint32_t dstVertex, Graph &graph);

inline EmptyGraph::vertex_descriptor add_vertex(EmptyGraph &g) { // NOLINT
    return addVertex(g);
}

// status of resource access
void buildAccessGraph(const RenderGraph &renderGraph, const Graphs &graphs) {
    // what we need:
    //  - pass dependency
    //  - pass attachment access
    // AccessTable accessRecord;

    size_t numPasses = 1;
    numPasses += renderGraph.rasterPasses.size();
    numPasses += renderGraph.computePasses.size();
    numPasses += renderGraph.copyPasses.size();
    numPasses += renderGraph.movePasses.size();
    numPasses += renderGraph.raytracePasses.size();

    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    resourceAccessGraph.reserve(static_cast<ResourceAccessGraph::vertices_size_type>(numPasses));
    resourceAccessGraph.resourceNames.reserve(128);
    resourceAccessGraph.resourceIndex.reserve(128);

    if (!resourceAccessGraph.leafPasses.empty()) {
        resourceAccessGraph.leafPasses.clear();
    }
    if (!resourceAccessGraph.culledPasses.empty()) {
        resourceAccessGraph.culledPasses.clear();
    }

    // const auto &names = get(RenderGraph::Name, renderGraph);
    for (size_t i = 1; i <= numPasses; ++i) {
        resourceAccessGraph.leafPasses.emplace(i, LeafStatus{false, false});
    }

    auto startID = add_vertex(resourceAccessGraph, INVALID_ID);
    CC_EXPECTS(startID == EXPECT_START_ID);

    add_vertex(relationGraph);

    for (const auto passID : makeRange(vertices(renderGraph))) {
        visitObject(
            passID, renderGraph,
            [&](const RasterPass &pass) {
                processRasterPass(graphs, passID, pass);
            },
            [&](const ComputePass &pass) {
                processComputePass(graphs, passID, pass);
            },
            [&](const CopyPass &pass) {
                processCopyPass(graphs, passID, pass);
            },
            [&](const RaytracePass &pass) {
                processRaytracePass(graphs, passID, pass);
            },
            [&](const PresentPass &pass) {
                processPresentPass(graphs, passID, pass);
            },
            [&](const auto & /*pass*/) {
                // do nothing
            });
    }

    auto &rag = resourceAccessGraph;
    auto branchCulling = [](ResourceAccessGraph::vertex_descriptor vertex, ResourceAccessGraph &rag) -> void {
        CC_EXPECTS(out_degree(vertex, rag) == 0);
        using FuncType = void (*)(ResourceAccessGraph::vertex_descriptor, ResourceAccessGraph &);
        static FuncType leafCulling = [](ResourceAccessGraph::vertex_descriptor vertex, ResourceAccessGraph &rag) {
            rag.culledPasses.emplace(vertex);
            auto &attachments = get(ResourceAccessGraph::AccessNode, rag, vertex);
            attachments.attachemntStatus.clear();
            if (attachments.nextSubpass) {
                delete attachments.nextSubpass;
                attachments.nextSubpass = nullptr;
            }
            auto inEdges = in_edges(vertex, rag);
            for (auto iter = inEdges.first; iter < inEdges.second;) {
                auto inEdge = *iter;
                auto srcVert = source(inEdge, rag);
                remove_edge(inEdge, rag);
                if (out_degree(srcVert, rag) == 0) {
                    leafCulling(srcVert, rag);
                }
                inEdges = in_edges(vertex, rag);
                iter = inEdges.first;
            }
        };
        leafCulling(vertex, rag);
    };

    // no present pass found, add a fake node to gather leaf node(s).
    if (resourceAccessGraph.presentPassID == 0xFFFFFFFF) {
        auto ragEndNode = add_vertex(rag, rag.getCurrentID());
        auto rlgEndNode = add_vertex(relationGraph);
        // keep sync before pass reorder done.
        CC_EXPECTS(ragEndNode == rlgEndNode);
        resourceAccessGraph.presentPassID = ragEndNode;
        auto iter = resourceAccessGraph.leafPasses.find(ragEndNode);
        if (iter == resourceAccessGraph.leafPasses.end()) {
            resourceAccessGraph.leafPasses.emplace(ragEndNode, LeafStatus{true, false});
        } else {
            resourceAccessGraph.leafPasses.at(ragEndNode) = LeafStatus{true, false};
        }
    }

    // make leaf node closed walk for pass reorder
    for (auto pass : resourceAccessGraph.leafPasses) {
        bool isExternal = pass.second.isExternal;
        bool needCulling = pass.second.needCulling;

        if (isExternal && !needCulling) {
            if (pass.first != resourceAccessGraph.presentPassID) {
                add_edge(pass.first, resourceAccessGraph.presentPassID, resourceAccessGraph);
            }
        } else {
            // write into transient resources, culled
            if constexpr (ENABLE_BRANCH_CULLING) {
                branchCulling(pass.first, resourceAccessGraph);
            }
        }
    }
    for (auto rit = resourceAccessGraph.culledPasses.rbegin(); rit != resourceAccessGraph.culledPasses.rend(); ++rit) {
        // remove culled vertices, std::less make this set ascending order, so reverse iterate
        remove_vertex(*rit, relationGraph);
    }
}

#pragma region BUILD_BARRIERS
struct BarrierVisitor : public boost::bfs_visitor<> {
    using Vertex = ResourceAccessGraph::vertex_descriptor;
    using Edge = ResourceAccessGraph::edge_descriptor;
    using Graph = ResourceAccessGraph;

    explicit BarrierVisitor(const ResourceGraph &rg, BarrierMap &barriers, ExternalResMap &extMap, ResourceNames &externalNames, const AccessTable &accessRecordIn)
    : barrierMap(barriers), resourceGraph(rg), externalMap(extMap), externalResNames(externalNames), accessRecord(accessRecordIn) {
    }

    struct AccessNodeInfo {
        const std::vector<AccessStatus> &status;
        std::vector<Barrier> &edgeBarriers; // need to barrier front or back
        const Vertex &vertID;
    };

    void processVertex(Vertex u, const Graph &g) {
        const ResourceAccessNode &access = get(ResourceAccessGraph::AccessNode, g, u);

        if (barrierMap.find(u) == barrierMap.end()) {
            barrierMap.emplace(u, BarrierNode{{}, {}});
        }

        const auto *srcAccess = &access;

        auto *dstAccess = access.nextSubpass;
        auto &blockBarrier = barrierMap[u].blockBarrier;
        auto &barriers = barrierMap[u].subpassBarriers;
        if (!barriers.empty()) {
            return;
        }
        uint32_t subpassIndex = 1;
        bool isAdjacent = true; // subpass always adjacent to each other
        if (dstAccess) {
            // subpass at least two passes inside.
            // the very first pass becomes attachment status collection of all subpass
            CC_ASSERT(dstAccess->nextSubpass);
            srcAccess = dstAccess;
            dstAccess = dstAccess->nextSubpass;
            barriers.emplace_back();
        }
        while (dstAccess) {
            barriers.emplace_back();
            CC_ASSERT(barriers.size() == subpassIndex + 1);
            // 2 barriers at least when subpass exist
            std::vector<Barrier> &srcRearBarriers = barriers[subpassIndex - 1].rearBarriers;
            std::vector<Barrier> &dstFrontBarriers = barriers[subpassIndex].frontBarriers;

            AccessNodeInfo from = {srcAccess->attachemntStatus, srcRearBarriers, u};
            AccessNodeInfo to = {dstAccess->attachemntStatus, dstFrontBarriers, u};
            fillBarrier(from, to, isAdjacent);

            srcAccess = dstAccess;
            dstAccess = dstAccess->nextSubpass;
        }

        // last vertex front block barrier
        if (!out_degree(u, g)) {
            auto &rearBarriers = barrierMap[u].blockBarrier.rearBarriers;
            auto &frontBarriers = barrierMap[u].blockBarrier.frontBarriers;
            for (const auto &barriers : barrierMap[u].subpassBarriers) {
                for (const auto &barrier : barriers.frontBarriers) {
                    auto resID = barrier.resourceID;
                    auto findBarrierByResID = [resID](const Barrier &barrier) {
                        return barrier.resourceID == resID;
                    };
                    auto resFinalPassID = accessRecord.at(resID).currStatus.vertID;
                    auto firstMeetIter = std::find_if(frontBarriers.begin(), frontBarriers.end(), findBarrierByResID);
                    auto innerResIter = std::find_if(rearBarriers.begin(), rearBarriers.end(), findBarrierByResID);

                    if (firstMeetIter == frontBarriers.end() && innerResIter == rearBarriers.end() && resFinalPassID >= u) {
                        frontBarriers.emplace_back(barrier);
                    }
                }
            }
        }
    }

    void fillBarrier(const AccessNodeInfo &from, const AccessNodeInfo &to, bool isAdjacent) {
        const auto &[srcStatus, srcRearBarriers, srcVert] = from;
        const auto &[dstStatus, dstFrontBarriers, dstVert] = to;
        std::vector<AccessStatus> commonResources;
        std::set_intersection(srcStatus.begin(), srcStatus.end(),
                              dstStatus.begin(), dstStatus.end(),
                              std::back_inserter(commonResources),
                              [](const AccessStatus &lhs, const AccessStatus &rhs) {
                                  return lhs.vertID < rhs.vertID;
                              });
        if (commonResources.empty()) {
            // this edge is a logic edge added during pass reorder,
            // no real dependency between this two vertices.
            return;
        }

        // NOLINTNEXTLINE
        for (uint32_t i = 0; i < commonResources.size(); ++i) {
            uint32_t resourceID = commonResources[i].vertID;
            auto findAccessByID = [resourceID](const AccessStatus &resAccess) { return resAccess.vertID == resourceID; };
            auto fromIter = std::find_if(srcStatus.begin(), srcStatus.end(), findAccessByID);
            auto toIter = std::find_if(dstStatus.begin(), dstStatus.end(), findAccessByID);

            // can't happen
            CC_ASSERT(fromIter != srcStatus.end());
            CC_ASSERT(toIter != dstStatus.end());

            if (!isStatusDependent(*fromIter, *toIter)) {
                continue;
            }

            auto findBarrierNodeByResID = [resourceID](const Barrier &barrier) { return resourceID == barrier.resourceID; };

            auto srcBarrierIter = srcRearBarriers.empty() ? srcRearBarriers.end() : std::find_if(srcRearBarriers.begin(), srcRearBarriers.end(), findBarrierNodeByResID);
            auto dstBarrierIter = dstFrontBarriers.empty() ? dstFrontBarriers.end() : std::find_if(dstFrontBarriers.begin(), dstFrontBarriers.end(), findBarrierNodeByResID);

            if (srcBarrierIter == srcRearBarriers.end()) {
                srcRearBarriers.emplace_back(Barrier{
                    resourceID,
                    isAdjacent ? gfx::BarrierType::FULL : gfx::BarrierType::SPLIT_BEGIN,
                    {
                        srcVert,
                        (*fromIter).visibility,
                        (*fromIter).access,
                        (*fromIter).passType,
                        (*fromIter).range,
                    },
                    {
                        isAdjacent ? srcVert : dstVert,
                        (*toIter).visibility,
                        (*toIter).access,
                        (*toIter).passType,
                        (*toIter).range,
                    },
                });
                srcBarrierIter = std::prev(srcRearBarriers.end());
            } else {
                if (isAdjacent) {
                    (*srcBarrierIter).type = gfx::BarrierType::FULL;

                    (*srcBarrierIter).beginStatus.vertID = srcVert;
                    (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                    (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                    (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                    (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                    (*srcBarrierIter).endStatus.vertID = dstVert;
                    (*srcBarrierIter).endStatus.visibility = (*toIter).visibility;
                    (*srcBarrierIter).endStatus.access = (*toIter).access;
                    (*srcBarrierIter).endStatus.passType = (*toIter).passType;
                    (*srcBarrierIter).endStatus.range = (*toIter).range;
                } else {
                    if (srcVert >= (*srcBarrierIter).beginStatus.vertID) {
                        uint32_t siblingPass = (*srcBarrierIter).beginStatus.vertID;
                        (*srcBarrierIter).beginStatus.vertID = srcVert;
                        (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                        (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                        (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                        (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                        //
                        if (srcVert > (*srcBarrierIter).beginStatus.vertID) {
                            auto &siblingPassBarrier = barrierMap[siblingPass].blockBarrier.rearBarriers;
                            auto siblingIter = std::find_if(siblingPassBarrier.begin(), siblingPassBarrier.end(),
                                                            [resourceID](const Barrier &barrier) {
                                                                return resourceID == barrier.resourceID;
                                                            });
                            CC_ASSERT(siblingIter != siblingPassBarrier.end());
                            siblingPassBarrier.erase(siblingIter);
                        }
                    }
                }
            }

            if ((*srcBarrierIter).type == gfx::BarrierType::SPLIT_BEGIN) {
                if (dstBarrierIter == dstFrontBarriers.end()) {
                    // if isAdjacent, full barrier already in src rear barriers.
                    if (!isAdjacent) {
                        dstFrontBarriers.emplace_back(Barrier{
                            resourceID,
                            gfx::BarrierType::SPLIT_END,
                            {
                                srcVert,
                                (*fromIter).visibility,
                                (*fromIter).access,
                                (*fromIter).passType,
                                (*fromIter).range,
                            },
                            {
                                dstVert, // next use of resc varies between resources
                                (*toIter).visibility,
                                (*toIter).access,
                                (*toIter).passType,
                                (*toIter).range,
                            },
                        });
                    }
                } else {
                    if (isAdjacent) {
                        // adjacent, barrier should be commit at fromPass, and remove this iter from dstBarriers
                        (*srcBarrierIter).type = gfx::BarrierType::FULL;

                        (*srcBarrierIter).beginStatus.vertID = srcVert;
                        (*srcBarrierIter).beginStatus.visibility = (*fromIter).visibility;
                        (*srcBarrierIter).beginStatus.access = (*fromIter).access;
                        (*srcBarrierIter).beginStatus.passType = (*fromIter).passType;
                        (*srcBarrierIter).beginStatus.range = (*fromIter).range;

                        (*srcBarrierIter).endStatus.vertID = dstVert;
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
                        if (dstVert <= (*dstBarrierIter).endStatus.vertID) {
                            uint32_t siblingPass = (*dstBarrierIter).endStatus.vertID;
                            (*dstBarrierIter).endStatus.vertID = dstVert;
                            (*dstBarrierIter).endStatus.visibility = (*toIter).visibility;
                            (*dstBarrierIter).endStatus.access = (*toIter).access;
                            (*dstBarrierIter).endStatus.passType = (*toIter).passType;
                            (*dstBarrierIter).endStatus.range = (*toIter).range;

                            // remove the further redundant barrier
                            auto &siblingPassBarrier = barrierMap[siblingPass].blockBarrier.frontBarriers;
                            auto siblingIter = std::find_if(siblingPassBarrier.begin(), siblingPassBarrier.end(),
                                                            [resourceID](const Barrier &barrier) {
                                                                return resourceID == barrier.resourceID;
                                                            });
                            CC_ASSERT(siblingIter != siblingPassBarrier.end());
                            siblingPassBarrier.erase(siblingIter);
                        }
                    }
                }
            }
        }

        //----------------------------------------------check external----------------------------------------------
        auto barrierExternalRes = [&](const AccessStatus &rescAccess, bool isFrom) {
            uint32_t rescID = rescAccess.vertID;
            bool externalRes = get(get(ResourceGraph::Traits, resourceGraph), rescID).hasSideEffects();
            Vertex vert = isFrom ? from.vertID : to.vertID;
            if (externalRes) {
                const PmrString &resName = get(ResourceGraph::Name, resourceGraph, rescID);
                auto iter = externalMap.find(resName);
                // first meet in this frame
                if (externalResNames.find(resName) == externalResNames.end()) {
                    // first meet in whole program
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
                            barrierMap[vert].blockBarrier.frontBarriers.emplace_back(Barrier{
                                rescID,
                                gfx::BarrierType::SPLIT_END,
                                externalMap[resName].lastStatus,
                                externalMap[resName].currStatus,
                            });
                        }
                    }
                    externalResNames.insert(resName);
                } else {
                    if ((*iter).second.currStatus.vertID < vert) {
                        //[pass: vert] is later access than in iter.
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

        for (const AccessStatus &rescAccess : srcStatus) {
            barrierExternalRes(rescAccess, true);
        }

        for (const AccessStatus &rescAccess : dstStatus) {
            barrierExternalRes(rescAccess, false);
        }
        //---------------------------------------------------------------------------------------------------------
    }

    void examine_edge(Edge e, const Graph &g) {
        Vertex from = source(e, g);
        Vertex to = target(e, g);

        processVertex(from, g);
        processVertex(to, g);

        // hasSubpass ? fromAccess is a single node with all attachment status stored in 'attachmentStatus'
        //            : fromAccess is head of chain of subpasses, which stores all attachment status in 'attachmentStatus'
        const ResourceAccessNode &fromAccess = get(ResourceAccessGraph::AccessNode, g, from);
        const ResourceAccessNode &toAccess = get(ResourceAccessGraph::AccessNode, g, to);

        bool isAdjacent = isPassExecAdjecent(from, to);
        std::vector<AccessStatus> commonResources;

        const auto *srcHead = &fromAccess;
        const auto *dstHead = &toAccess;

        uint32_t srcSubpassIndex = 0;
        bool srcHasSubpass = srcHead->nextSubpass;
        bool dstHasSubpass = dstHead->nextSubpass;
        srcHead = srcHasSubpass ? srcHead->nextSubpass : srcHead;

        while (srcHead) {
            const std::vector<AccessStatus> &fromStatus = srcHead->attachemntStatus;
            std::vector<Barrier> &srcRearBarriers = srcHasSubpass ? barrierMap[from].subpassBarriers[srcSubpassIndex].rearBarriers : barrierMap[from].blockBarrier.rearBarriers;
            uint32_t dstSubpassIndex = 0;
            dstHead = &toAccess;
            bool dstHasSubpass = dstHead->nextSubpass;
            dstHead = dstHasSubpass ? toAccess.nextSubpass : &toAccess;
            while (dstHead) {
                const std::vector<AccessStatus> &toStatus = dstHead->attachemntStatus;
                std::vector<Barrier> &dstFrontBarriers = dstHasSubpass ? barrierMap[to].subpassBarriers[dstSubpassIndex].frontBarriers : barrierMap[to].blockBarrier.frontBarriers;
                AccessNodeInfo fromInfo = {fromStatus, srcRearBarriers, from};
                AccessNodeInfo toInfo = {toStatus, dstFrontBarriers, to};
                bool isExecAdjacent = isAdjacent && (!srcHead->nextSubpass && !dstSubpassIndex);
                fillBarrier(fromInfo, toInfo, isAdjacent);
                dstHead = dstHead->nextSubpass;
                ++dstSubpassIndex;
            }
            srcHead = srcHead->nextSubpass;
            ++srcSubpassIndex;
        }

        auto &rearBarriers = barrierMap[from].blockBarrier.rearBarriers;
        auto &frontBarriers = barrierMap[from].blockBarrier.frontBarriers;
        for (const auto &barriers : barrierMap[from].subpassBarriers) {
            for (const auto &barrier : barriers.rearBarriers) {
                auto resID = barrier.resourceID;
                auto findBarrierByResID = [resID](const Barrier &barrier) {
                    return barrier.resourceID == resID;
                };
                auto iter = std::find_if(rearBarriers.begin(), rearBarriers.end(), findBarrierByResID);
                auto resFinalPassID = accessRecord.at(resID).currStatus.vertID;

                if (resFinalPassID > from) {
                    if (iter == rearBarriers.end()) {
                        rearBarriers.emplace_back(barrier);
                    } else {
                        (*iter) = barrier;
                    }
                }
            }

            for (const auto &barrier : barriers.frontBarriers) {
                auto resID = barrier.resourceID;
                auto findBarrierByResID = [resID](const Barrier &barrier) {
                    return barrier.resourceID == resID;
                };
                auto resFinalPassID = accessRecord.at(resID).currStatus.vertID;
                auto firstMeetIter = std::find_if(frontBarriers.begin(), frontBarriers.end(), findBarrierByResID);
                auto innerResIter = std::find_if(rearBarriers.begin(), rearBarriers.end(), findBarrierByResID);

                if (firstMeetIter == frontBarriers.end() && innerResIter == rearBarriers.end() && resFinalPassID > from) {
                    frontBarriers.emplace_back(barrier);
                }
            }
        }
    }

    const AccessTable &accessRecord;
    BarrierMap &barrierMap;
    const ResourceGraph &resourceGraph;
    ExternalResMap &externalMap;     // last frame to curr frame status transition
    ResourceNames &externalResNames; // first meet in this frame
};

void buildBarriers(FrameGraphDispatcher &fgDispatcher) {
    {
        auto *scratch = fgDispatcher.scratch;
        const auto &graph = fgDispatcher.graph;
        const auto &layoutGraph = fgDispatcher.layoutGraph;
        const auto &resourceGraph = fgDispatcher.resourceGraph;
        auto &relationGraph = fgDispatcher.relationGraph;
        auto &externalResMap = fgDispatcher.externalResMap;
        auto &rag = fgDispatcher.resourceAccessGraph;

        // record resource current in-access and out-access for every single node
        if (!fgDispatcher._accessGraphBuilt) {
            const Graphs graphs{resourceGraph, layoutGraph, rag, relationGraph};
            buildAccessGraph(graph, graphs);
            fgDispatcher._accessGraphBuilt = true;
        }

        // found pass id in this map ? barriers you should commit when run into this pass
        // : or no extra barrier needed.
        BarrierMap &batchedBarriers = fgDispatcher.barrierMap;
        ResourceNames namesSet;
        {
            // _externalResNames records external resource between frames
            BarrierVisitor visitor(resourceGraph, batchedBarriers, externalResMap, namesSet, rag.accessRecord);
            auto colors = rag.colors(scratch);
            boost::queue<AccessVertex> q;

            boost::breadth_first_visit(
                rag,
                EXPECT_START_ID,
                q,
                visitor,
                get(colors, rag));
        }

        // external res barrier for next frame
        for (const auto &externalPair : externalResMap) {
            const auto &transition = externalPair.second;
            auto resID = resourceGraph.valueIndex.at(externalPair.first);
            auto passID = transition.currStatus.vertID;
            if (batchedBarriers.find(passID) == batchedBarriers.end()) {
                batchedBarriers.emplace(passID, BarrierNode{});
            }

            Barrier nextFrameResBarrier{
                resID,
                gfx::BarrierType::SPLIT_BEGIN,
                externalResMap[externalPair.first].currStatus,
                {}};

            bool hasSubpass = !batchedBarriers[passID].subpassBarriers.empty();

            if (hasSubpass) {
                auto &subpassBarriers = batchedBarriers[passID].subpassBarriers;
                for (int i = static_cast<int>(subpassBarriers.size()) - 1; i >= 0; --i) {
                    auto findBarrierByResID = [resID](const Barrier &barrier) {
                        return barrier.resourceID == resID;
                    };

                    const auto &frontBarriers = subpassBarriers[i].frontBarriers;
                    auto &rearBarriers = subpassBarriers[i].rearBarriers;
                    auto found = std::find_if(frontBarriers.begin(), frontBarriers.end(), findBarrierByResID) != frontBarriers.end() ||
                                 std::find_if(rearBarriers.begin(), rearBarriers.end(), findBarrierByResID) != rearBarriers.end();
                    if (found) {
                        // put into rear barriers in order not to stuck
                        rearBarriers.push_back({});
                        break;
                    }
                }
            } else {
                auto &rearBarriers = batchedBarriers[passID].blockBarrier.rearBarriers;
                rearBarriers.emplace_back(nextFrameResBarrier);
            }
        }
    }
}
#pragma endregion BUILD_BARRIERS

#pragma region PASS_REORDER

struct PassVisitor : boost::dfs_visitor<> {
    using Vertex = ResourceAccessGraph::vertex_descriptor;
    using Edge = ResourceAccessGraph::edge_descriptor;
    using Graph = ResourceAccessGraph;
    using InEdgeRange = std::pair<ResourceAccessGraph::in_edge_iterator, ResourceAccessGraph::in_edge_iterator>;
    using OutEdgeRange = std::pair<ResourceAccessGraph::out_edge_iterator, ResourceAccessGraph::out_edge_iterator>;

    PassVisitor(const Graph &ragIn, EmptyGraph &tcIn, CloseCircuits &circuitsIn) : _rag(ragIn), _relationGraph(tcIn), _circuits(circuitsIn) {}

    void start_vertex(Vertex u, const Graph &g) {}

    void discover_vertex(Vertex u, const Graph &g) {}

    void examine_edge(Edge e, const Graph &g) {
    }

    void tree_edge(Edge e, const Graph &g) {}

    void back_edge(Edge e, const Graph &g) {}

    void forward_or_cross_edge(Edge e, const Graph &g) {
        // the vertex which:
        // 1. is ancestor of targetID;
        // 2. sourceID is reachable at this specific vert;
        // is where the closed-path started.
        // note that `reachable` may results to multiple paths, choose the shortest one.
        auto sourceID = source(e, g);
        auto targetID = target(e, g);

        using RhsRangePair = std::pair<ResourceAccessGraph::in_edge_iterator, InEdgeRange>;

        bool foundIntersect = false;
        std::queue<RhsRangePair> vertQ;
        auto iterPair = in_edges(targetID, g);
        vertQ.emplace(RhsRangePair{iterPair.first, iterPair});

        // from source vertex on this edge back to branch point
        EdgeList rhsPath;
        bool rootEdge = true;
        while (!foundIntersect && !vertQ.empty()) {
            auto rangePair = vertQ.front();
            vertQ.pop();
            auto range = rangePair.second;
            for (auto iter = range.first; iter != range.second; ++iter) {
                auto srcID = source((*iter), g);
                if (sourceID == srcID) {
                    continue;
                }
                auto e = edge(srcID, sourceID, _relationGraph);
                auto recordIter = rootEdge ? iter : rangePair.first;
                if (!e.second) {
                    vertQ.emplace(RhsRangePair{recordIter, in_edges(srcID, g)});
                } else {
                    rhsPath = {(*iter), *recordIter};
                    foundIntersect = true;
                    break;
                }
            }
            rootEdge = false;
        }
        assert(foundIntersect);

        using LhsRangePair = std::pair<ResourceAccessGraph::out_edge_iterator, OutEdgeRange>;
        auto branchVert = source(rhsPath.first, g);
        bool found = false;
        std::queue<LhsRangePair> forwardVertQ;
        auto forwardIterPair = out_edges(branchVert, g);
        forwardVertQ.emplace(LhsRangePair{forwardIterPair.first, forwardIterPair});
        EdgeList lhsPath;
        rootEdge = true;
        while (!found && !forwardVertQ.empty()) {
            auto rangePair = forwardVertQ.front();
            forwardVertQ.pop();
            auto range = rangePair.second;
            for (auto iter = range.first; iter != range.second; ++iter) {
                if ((*iter) == rhsPath.first) {
                    continue;
                }
                auto dstID = target((*iter), g);
                auto e = edge(dstID, sourceID, _relationGraph);
                auto recordIter = rootEdge ? iter : rangePair.first;
                if (!e.second) {
                    forwardVertQ.emplace(LhsRangePair{recordIter, out_edges(dstID, g)});
                } else {
                    found = true;
                    lhsPath = {*recordIter, (*iter)};
                    break;
                }
            }
            rootEdge = true;
        }
        assert(found);
        lhsPath.second = e;

        _circuits.emplace_back(CloseCircuit{lhsPath, rhsPath});
    };

private:
    const RAG &_rag;
    EmptyGraph &_relationGraph;
    CloseCircuits &_circuits;
};

auto evaluateHeaviness(const RAG &rag, const ResourceGraph &rescGraph, EmptyVert vert, bool forward) {
    // forward:
    // -- true: how much resource this pass writes to, which has an effect of later passes;
    // -- false: how much resource this pass reads from, which is dependent from former passes.
    const ResourceAccessNode &accessNode = get(RAG::AccessNode, rag, static_cast<RAG::vertex_descriptor>(vert));
    int64_t score = 0;
    bool forceAdjacent = false;
    for (const auto &resc : accessNode.attachemntStatus) {
        int64_t eval = 0;
        auto rescID = resc.vertID;
        const ResourceDesc &desc = get(ResourceGraph::Desc, rescGraph, rescID);
        const ResourceTraits &traits = get(ResourceGraph::Traits, rescGraph, rescID);

        gfx::MemoryAccessBit filter = forward ? gfx::MemoryAccessBit::WRITE_ONLY : gfx::MemoryAccessBit::READ_ONLY;
        if (resc.access == filter) {
            continue;
        }

        switch (desc.dimension) {
            case ResourceDimension::BUFFER:
                eval = desc.width;
                break;
            case ResourceDimension::TEXTURE1D:
            case ResourceDimension::TEXTURE2D:
            case ResourceDimension::TEXTURE3D:
                eval = gfx::formatSize(desc.format, desc.width, desc.height, desc.depthOrArraySize);
                break;
        }

        if (traits.residency == ResourceResidency::MEMORYLESS) {
            forceAdjacent = true;
            score = forward ? std::numeric_limits<int64_t>::lowest() : std::numeric_limits<int64_t>::max();
            break;
        }
    }
    return std::tie(forceAdjacent, score);
};

void evaluateAndTryMerge(const RAG &rag, const ResourceGraph &rescGraph, EmptyGraph &relationGraph, const EmptyGraph &relationGraphTc, const EmptyVerts &lhsVerts, const EmptyVerts &rhsVerts) {
    assert(lhsVerts.size() >= 2);
    assert(rhsVerts.size() >= 2);

    auto evaluate = [&rag, &rescGraph](EmptyVert vert, bool forward) {
        return evaluateHeaviness(rag, rescGraph, vert, forward);
    };

    if (lhsVerts.size() == 2 || rhsVerts.size() == 2) {
        /*
               1 ----------- 2
                \       __--/
                 3 --``
            no extra choice, only 1 - 3 - 2
            */
        const EmptyVerts *shorterPath = lhsVerts.size() == 2 ? &lhsVerts : &rhsVerts;
        remove_edge((*shorterPath)[0], (*shorterPath)[1], relationGraph);
    } else {
        // fist and last pass in this circuit don't get involved in reorder.
        auto firstLhsNode = lhsVerts[1];
        auto lastLhsNode = lhsVerts[lhsVerts.size() - 2];

        const auto &lhsBackwardStatus = evaluate(firstLhsNode, false);
        bool lhsAdjacentToStart = std::get<0>(lhsBackwardStatus);
        const auto &lhsForwardStatus = evaluate(lastLhsNode, true);
        bool lhsAdjacentToEnd = std::get<0>(lhsForwardStatus);

        auto firstRhsNode = rhsVerts[1];
        auto lastRhsNode = rhsVerts[rhsVerts.size() - 2];

        const auto &rhsBackwardStatus = evaluate(firstRhsNode, true);
        bool rhsAdjacentToStart = std::get<0>(rhsBackwardStatus);
        const auto &rhsForwardStatus = evaluate(lastRhsNode, false);
        bool rhsAdjacentToEnd = std::get<0>(rhsForwardStatus);

        if (lhsAdjacentToStart || rhsAdjacentToEnd || lhsAdjacentToEnd || rhsAdjacentToStart) {
            const EmptyVerts *formerPath = &lhsVerts;
            const EmptyVerts *latterPath = &rhsVerts;
            if (rhsAdjacentToStart || lhsAdjacentToEnd) {
                swap(formerPath, latterPath);
            }

            remove_edge((*latterPath)[0], (*latterPath)[1], relationGraph);
            remove_edge((*formerPath)[formerPath->size() - 2], (*formerPath)[formerPath->size() - 1], relationGraph);

            tryAddEdge((*formerPath)[formerPath->size() - 2], (*latterPath)[1], relationGraph);
        }

        assert(lhsVerts.size() >= 3 && rhsVerts.size() >= 3);
        constexpr int64_t score = std::numeric_limits<int64_t>::lowest();
        ccstd::vector<std::queue<EmptyEdge>> candidateSections;
        std::queue<EmptyEdge> lhsSection;
        for (size_t i = 1; i < lhsVerts.size(); ++i) {
            auto tryE = edge(lhsVerts[i], lhsVerts[i - 1], relationGraphTc);
            auto tryRE = edge(lhsVerts[i - 1], lhsVerts[i], relationGraphTc);
            // check if original reachable
            if (!tryE.second && !tryRE.second) {
                remove_edge(lhsVerts[i - 1], lhsVerts[i], relationGraph);
                candidateSections.emplace_back(lhsSection);
                std::queue<EmptyEdge> clearQ;
                lhsSection.swap(clearQ);
            }
            auto e = edge(lhsVerts[i], lhsVerts[i - 1], relationGraph);
            // verts comes in order, so either real edge exist or logic edge is added.
            CC_ASSERT(e.second);

            lhsSection.emplace(e.first);
        }
        if (candidateSections.empty()) {
            // if this one is a tight edge(no logic edge, dependent from one to its next),
            // keep this whole chain as a candidate.
            remove_edge(lhsVerts[0], lhsVerts[1], relationGraph);
            remove_edge(lhsVerts[lhsVerts.size() - 2], lhsVerts[lhsVerts.size() - 1], relationGraph);
            candidateSections.emplace_back(std::move(lhsSection));
        }

        std::queue<EmptyEdge> rhsSection;
        for (size_t i = 1; i < rhsVerts.size(); ++i) {
            auto tryE = edge(rhsVerts[i], rhsVerts[i - 1], relationGraphTc);
            auto tryRE = edge(rhsVerts[i - 1], rhsVerts[i], relationGraphTc);
            if (!tryE.second && !tryRE.second) {
                remove_edge(rhsVerts[i - 1], rhsVerts[i], relationGraph);
                candidateSections.emplace_back(rhsSection);
                std::queue<EmptyEdge> clearQ;
                rhsSection.swap(clearQ);
            }
            auto e = edge(rhsVerts[i], rhsVerts[i - 1], relationGraph);
            // verts comes in order, so either real edge exist or logic edge is added.
            CC_ASSERT(e.second);
            rhsSection.emplace(e.first);
        }

        // lhs verts already put in.
        if (candidateSections.size() == 1) {
            remove_edge(rhsVerts[0], rhsVerts[1], relationGraph);
            remove_edge(rhsVerts[rhsVerts.size() - 2], rhsVerts[rhsVerts.size() - 1], relationGraph);
            candidateSections.emplace_back(std::move(rhsSection));
        }

        assert(candidateSections.size() >= 2);

        ScoreMap scMap;
        auto tailVert = lhsVerts[0];
        while (!candidateSections.empty()) {
            int64_t lightest = std::numeric_limits<int64_t>::max();
            uint32_t index = 0;
            for (size_t i = 0; i < candidateSections.size(); ++i) {
                auto e = candidateSections[i].front();
                auto srcVert = source(e, relationGraph);
                auto dstVert = target(e, relationGraph);
                int64_t srcBackwardScore = 0;
                int64_t dstForwardScore = 0;
                if (scMap.find(srcVert) == scMap.end()) {
                    auto res = evaluate(srcVert, false);
                    srcBackwardScore = std::get<1>(res);
                    res = evaluate(srcVert, true);
                    auto srcForwardScore = std::get<1>(res);
                    scMap.emplace(srcVert, std::pair<int64_t, int64_t>(srcBackwardScore, srcForwardScore));
                } else {
                    srcBackwardScore = std::get<0>(scMap.at(srcVert));
                }
                if (scMap.find(dstForwardScore) == scMap.end()) {
                    auto res = evaluate(dstVert, false);
                    dstForwardScore = std::get<1>(res);
                    res = evaluate(dstVert, true);
                    auto dstBackwardScore = std::get<1>(res);
                    scMap.emplace(dstVert, std::pair<int64_t, int64_t>(dstBackwardScore, dstForwardScore));
                } else {
                    dstForwardScore = std::get<1>(scMap.at(dstVert));
                }

                auto score = dstForwardScore - srcBackwardScore;
                if (lightest > score) {
                    lightest = score;
                    index = i;
                }
            }
            auto e = candidateSections[index].front();
            candidateSections[index].pop();
            if (candidateSections[index].empty()) {
                auto iter = candidateSections.begin();
                std::advance(iter, index);
                candidateSections.erase(iter);
            }
            auto srcVert = source(e, relationGraph);
            auto dstVert = target(e, relationGraph);
            tryAddEdge(tailVert, srcVert, relationGraph);
            tailVert = dstVert;
        }

        tryAddEdge(tailVert, lhsVerts.back(), relationGraph);
    }
}

// return : can be further reduced?
bool reduce(const RAG &rag, const ResourceGraph &rescGraph, EmptyGraph &relationGraph, EmptyGraph &relationGraphTc, const CloseCircuit &circuit) {
    auto checkPath = [&relationGraph](std::stack<EmptyGraph::vertex_descriptor> &vertices, EmptyGraph::vertex_descriptor endVert, EmptyVerts &stackTrace) {
        bool simpleGraph = true;
        while (!vertices.empty()) {
            auto vert = vertices.top();
            vertices.pop();
            stackTrace.emplace_back(vert);

            if (endVert == vert) {
                break;
            }

            if (out_degree(vert, relationGraph) > 1) {
                simpleGraph = false;
                break;
            }
            auto r = out_edges(vert, relationGraph);
            for (auto rIter = r.first; rIter != r.second; ++rIter) {
                auto dstID = target(*rIter, relationGraph);
                vertices.push(dstID);
            }
            if (r.first == r.second) {
                stackTrace.pop_back();
            }
        }
        return simpleGraph;
    };

    // check if there is a sub branch on lhs
    auto lhsEdges = circuit.first;
    auto startVert = target(lhsEdges.first, relationGraph);
    auto endVert = source(lhsEdges.second, relationGraph);

    std::stack<EmptyGraph::vertex_descriptor> vertices;
    vertices.emplace(startVert);

    EmptyVerts lhsVisited;
    auto branchStartVert = source(lhsEdges.first, relationGraph);
    auto branchEndVert = target(lhsEdges.second, relationGraph);
    lhsVisited.push_back(branchStartVert);
    // check if there is a branch on lhs path
    if (!checkPath(vertices, endVert, lhsVisited)) {
        return false;
    }
    lhsVisited.push_back(branchEndVert);
    // if it's a simple graph, lhs path must can be dfs to the end at the first time.
    assert(vertices.empty());

    auto rhsEdges = circuit.second;
    startVert = target(rhsEdges.first, relationGraph);
    endVert = source(rhsEdges.second, relationGraph);
    vertices.emplace(startVert);

    EmptyVerts rhsVisited;
    rhsVisited.push_back(branchStartVert);
    if (!checkPath(vertices, endVert, rhsVisited)) {
        return false;
    }
    rhsVisited.push_back(branchEndVert);

    // merge this circuit
    // from
    /*          2 - 3 - 4
              /           \
            1               8
              \           /
                5 - 6 - 7

        to
            1 - A - B - 8 or 1 - B - A -8 depends on algorithm

            ${A} : 2 - 3 - 4
            ${B} : 5 - 6 - 7
        */

    evaluateAndTryMerge(rag, rescGraph, relationGraph, relationGraphTc, lhsVisited, rhsVisited);

    return true;
}

template <typename RelationGraph, typename TargetGraph>
void applyRelation(RelationGraph &relationGraph, const TargetGraph &targetGraph) {
    CC_EXPECTS(relationGraph.vertices.size() == targetGraph.vertices.size());

    // remove all edges
    for (auto vert : targetGraph.vertices) {
        clear_in_edges(vert, targetGraph);
        clear_out_edges(vert, targetGraph);
    }

    for (auto vert : relationGraph.vertices) {
        auto inEdges = in_edges(vert, relationGraph);
        for (auto e : makeRange(inEdges)) {
            auto srcVert = source(e, relationGraph);
            // auto checkEdge = edge(srcVert, vert, targetGraph);
            add_edge(srcVert, vert, targetGraph);
        }
    }
}

void passReorder(FrameGraphDispatcher &fgDispatcher) {
    auto *scratch = fgDispatcher.scratch;
    const auto &graph = fgDispatcher.graph;
    const auto &layoutGraph = fgDispatcher.layoutGraph;
    const auto &resourceGraph = fgDispatcher.resourceGraph;
    auto &relationGraph = fgDispatcher.relationGraph;
    auto &rag = fgDispatcher.resourceAccessGraph;

    if (!fgDispatcher._accessGraphBuilt) {
        const Graphs graphs{resourceGraph, layoutGraph, rag, relationGraph};
        buildAccessGraph(graph, graphs);
        fgDispatcher._accessGraphBuilt = true;
    }

    {
        // determine do mem saving how many times
        EmptyGraph relationGraphTc;
        boost::transitive_closure(relationGraph, relationGraphTc);

        CloseCircuits circuits;
        std::vector<RAG::edge_descriptor> crossEdges;
        PassVisitor visitor(rag, relationGraphTc, circuits);
        auto colors = rag.colors(scratch);
        boost::depth_first_search(rag, visitor, get(colors, rag));

        float percent = 0.0F;
        uint32_t count = 0;
        auto total = circuits.size();

        float memsavePercent = 1.0F - fgDispatcher._paralellExecWeight;
        for (auto iter = circuits.begin(); (iter != circuits.end()) && (percent < memsavePercent);) {
            bool reduced = reduce(rag, resourceGraph, relationGraph, relationGraphTc, (*iter));
            if (reduced) {
                ++count;
                iter = circuits.erase(iter);
                percent = count / static_cast<float>(total);
            } else {
                ++iter;
            }
        }

        // topological sort
        bool empty = relationGraph._vertices.empty();
        ScoreMap scoreMap;
        std::queue<EmptyVert> vertQ;
        EmptyVerts candidates;

        for (size_t i = 0; i < relationGraph._vertices.size(); ++i) {
            if (in_degree(static_cast<uint32_t>(i), relationGraph) == 0) {
                if (std::find(candidates.begin(), candidates.end(), i) == candidates.end()) {
                    candidates.push_back(static_cast<uint32_t>(i));
                }
            }
        }

        std::vector<EmptyVert> candidateBuffer;
        uint32_t coloredVerts = 0;
        while (coloredVerts < relationGraph._vertices.size()) {
            // decreasing order, pop back from vector, push into queue, then it's ascending order.
            std::sort(candidates.begin(), candidates.end(), [&](EmptyVert lhsVert, EmptyVert rhsVert) {
                int64_t lhsForwardScore{0};
                int64_t rhsForwardScore{0};
                int64_t lhsBackwardScore{0};
                int64_t rhsBackwardScore{0};
                if (scoreMap.find(lhsVert) == scoreMap.end()) {
                    const auto &lhsForwardStatus = evaluateHeaviness(rag, resourceGraph, lhsVert, true);
                    lhsForwardScore = get<1>(lhsForwardStatus);
                    const auto &lhsBackwardStatus = evaluateHeaviness(rag, resourceGraph, lhsVert, false);
                    lhsBackwardScore = get<1>(lhsBackwardStatus);
                    scoreMap.emplace(lhsVert, std::pair<int64_t, int64_t>{lhsBackwardScore, lhsForwardScore});
                } else {
                    lhsBackwardScore = scoreMap[lhsVert].first;
                    lhsForwardScore = scoreMap[lhsVert].second;
                }

                if (scoreMap.find(rhsVert) == scoreMap.end()) {
                    const auto &rhsForwardStatus = evaluateHeaviness(rag, resourceGraph, rhsVert, true);
                    rhsForwardScore = get<1>(rhsForwardStatus);
                    const auto &rhsBackwardStatus = evaluateHeaviness(rag, resourceGraph, rhsVert, false);
                    rhsBackwardScore = get<1>(rhsBackwardStatus);
                    scoreMap.emplace(rhsVert, std::pair<int64_t, int64_t>{rhsBackwardScore, rhsForwardScore});
                } else {
                    rhsBackwardScore = scoreMap[rhsVert].first;
                    rhsForwardScore = scoreMap[rhsVert].second;
                }
                return lhsBackwardScore - lhsForwardScore > rhsBackwardScore - rhsForwardScore;
            });

            const auto vert = candidates.back();
            candidates.pop_back();
            vertQ.push(vert);
            if (!candidateBuffer.empty()) {
                candidates.insert(candidates.end(), candidateBuffer.begin(), candidateBuffer.end());
                candidateBuffer.clear();
            }

            for (const auto nextGeneration : makeRange(out_edges(vert, relationGraph))) {
                auto targetID = target(nextGeneration, relationGraph);
                if (in_degree(targetID, relationGraph) == 1) {
                    candidateBuffer.emplace_back(targetID);
                }
            }

            auto deprecatedEdges = out_edges(vert, relationGraph);
            for (auto iter = deprecatedEdges.first; iter < deprecatedEdges.second;) {
                remove_edge(*iter, relationGraph);
                deprecatedEdges = out_edges(vert, relationGraph);
                iter = deprecatedEdges.first;
            }

            if (candidates.empty()) {
                candidates.insert(candidates.end(), candidateBuffer.begin(), candidateBuffer.end());
                candidateBuffer.clear();
            }

            coloredVerts++;
        }

        // sort graph by the order in queue
        for (const auto &vert : makeRange(vertices(rag))) {
            clear_in_edges(vert, rag);
            clear_out_edges(vert, rag);
        }

        auto vert = vertQ.front();
        vertQ.pop();
        while (!vertQ.empty()) {
            auto nextVert = vertQ.front();
            vertQ.pop();
            add_edge(vert, nextVert, rag);
            vert = nextVert;
        }
    }
}

#pragma endregion PASS_REORDER

void memoryAliasing(FrameGraphDispatcher &fgDispatcher) {
}

#pragma region assisstantFuncDefinition
template <typename Graph>
bool tryAddEdge(uint32_t srcVertex, uint32_t dstVertex, Graph &graph) {
    auto e = edge(srcVertex, dstVertex, graph);
    if (!e.second) {
        auto res = add_edge(srcVertex, dstVertex, graph);
        CC_ENSURES(res.second);
        return true;
    }
    return false;
}

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

void addCopyAccessStatus(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, const ViewStatus &status, const Range &range) {
    const auto &[name, passType, visibility, access] = status;

    uint32_t rescID = rg.valueIndex.at(name);

    CC_EXPECTS(rg.valueIndex.find(name) != rg.valueIndex.end());
    if (std::find(rag.resourceNames.begin(), rag.resourceNames.end(), name) == rag.resourceNames.end()) {
        rag.resourceIndex.emplace(name, rescID);
        rag.resourceNames.emplace_back(name);
    }

    node.attachemntStatus.emplace_back(AccessStatus{
        rescID,
        visibility,
        access,
        passType,
        range,
    });
}

void addAccessStatus(RAG &rag, const ResourceGraph &rg, ResourceAccessNode &node, const ViewStatus &status) {
    const auto &[name, passType, visibility, access] = status;
    uint32_t rescID = rg.valueIndex.at(name);
    const auto &resourceDesc = get(ResourceGraph::Desc, rg, rescID);
    Range range;
    if (resourceDesc.dimension == ResourceDimension::BUFFER) {
        range = BufferRange{0, resourceDesc.depthOrArraySize};
    } else {
        range = TextureRange{0, 1, 0, resourceDesc.mipLevels};
    }

    CC_EXPECTS(rg.valueIndex.find(name) != rg.valueIndex.end());
    if (std::find(rag.resourceNames.begin(), rag.resourceNames.end(), name) == rag.resourceNames.end()) {
        rag.resourceIndex.emplace(name, rescID);
        rag.resourceNames.emplace_back(name);
    }

    node.attachemntStatus.emplace_back(AccessStatus{
        rescID,
        visibility,
        access,
        passType,
        range,
    });
}

AccessVertex dependencyCheck(RAG &rag, AccessVertex curVertID, const ResourceGraph &rg, const ViewStatus &viewStatus) {
    const auto &[name, passType, visibility, access] = viewStatus;
    auto &accessRecord = rag.accessRecord;

    AccessVertex lastVertID = INVALID_ID;
    CC_EXPECTS(rag.resourceIndex.find(name) != rag.resourceIndex.end());
    auto resourceID = rag.resourceIndex[name];
    bool isExternalPass = get(get(ResourceGraph::Traits, rg), resourceID).hasSideEffects() || passType == PassType::PRESENT;
    auto iter = accessRecord.find(resourceID);
    if (iter == accessRecord.end()) {
        accessRecord.emplace(
            resourceID,
            ResourceTransition{
                {},
                {curVertID, visibility, access, passType, Range{}}});
        if (isExternalPass) {
            rag.leafPasses[curVertID] = LeafStatus{true, access == gfx::MemoryAccessBit::READ_ONLY && passType != PassType::PRESENT};
        }
    } else {
        ResourceTransition &trans = iter->second;
        if (access == gfx::MemoryAccessBit::READ_ONLY && trans.currStatus.access == gfx::MemoryAccessBit::READ_ONLY &&
            (trans.currStatus.passType == passType || passType == PassType::PRESENT) && trans.currStatus.visibility == visibility) {
            // current READ, no WRITE before in this frame, it's expected to be external.
            bool dirtyExternalRes = trans.lastStatus.vertID == INVALID_ID;
            if (!dirtyExternalRes) {
                tryAddEdge(trans.lastStatus.vertID, curVertID, rag);
                if (rag.leafPasses.find(trans.lastStatus.vertID) != rag.leafPasses.end()) {
                    rag.leafPasses.erase(trans.lastStatus.vertID);
                }
            }
            if (isExternalPass) {
                rag.leafPasses[curVertID] = LeafStatus{true, access == gfx::MemoryAccessBit::READ_ONLY && passType != PassType::PRESENT};
            }
            trans.currStatus = {curVertID, visibility, access, passType, Range{}};
            lastVertID = trans.lastStatus.vertID;
        } else {
            // avoid subpass self depends
            if (trans.currStatus.vertID != curVertID) {
                lastVertID = trans.currStatus.vertID;
                trans.lastStatus = trans.currStatus;
                trans.currStatus = {curVertID, visibility, access, passType, Range{}};
                if (rag.leafPasses.find(trans.lastStatus.vertID) != rag.leafPasses.end()) {
                    rag.leafPasses.erase(trans.lastStatus.vertID);
                }
                if (rag.leafPasses.find(curVertID) != rag.leafPasses.end()) {
                    // only write into externalRes counts
                    if (isExternalPass) {
                        rag.leafPasses[curVertID] = LeafStatus{true, access == gfx::MemoryAccessBit::READ_ONLY && passType != PassType::PRESENT};
                    }
                }
            } else {
                trans.currStatus = {curVertID, visibility, trans.currStatus.access | access, passType, Range{}};
            }
        }
    }
    return lastVertID;
}

gfx::ShaderStageFlagBit getVisibilityByDescName(const LGD &lgd, uint32_t passID, const PmrString &resName) {
    auto iter = lgd.attributeIndex.find(resName);
    if (iter == lgd.attributeIndex.end()) {
        iter = lgd.constantIndex.find(resName);
        if (iter == lgd.constantIndex.end()) {
            // input or output attachment
            return gfx::ShaderStageFlagBit::NONE;
        }
    }

    auto nameID = iter->second;
    auto visIter = lgd.stages[passID].descriptorVisibility.find(nameID);
    CC_EXPECTS(visIter != lgd.stages[passID].descriptorVisibility.end());
    return visIter->second;
};

bool checkRasterViews(const Graphs &graphs, uint32_t vertID, uint32_t passID, PassType passType, ResourceAccessNode &node, const RasterViewsMap &rasterViews) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;
    bool dependent = false;

    for (const auto &pair : rasterViews) {
        const auto &rasterView = pair.second;
        gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(layoutGraphData, passID, pair.first);
        visibility = visibility == gfx::ShaderStageFlagBit::NONE ? gfx::ShaderStageFlagBit::FRAGMENT : visibility;
        auto access = toGfxAccess(rasterView.accessType);
        ViewStatus viewStatus{pair.first, passType, visibility, access};
        addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);
        auto lastVertId = dependencyCheck(resourceAccessGraph, vertID, resourceGraph, viewStatus);
        if (lastVertId != INVALID_ID && lastVertId != vertID) {
            tryAddEdge(lastVertId, vertID, resourceAccessGraph);
            tryAddEdge(lastVertId, vertID, relationGraph);
            dependent = true;
        }
    }

    // sort for vector intersection
    std::sort(node.attachemntStatus.begin(), node.attachemntStatus.end(), [](const AccessStatus &lhs, const AccessStatus &rhs) { return lhs.vertID < rhs.vertID; });

    return dependent;
}

bool checkComputeViews(const Graphs &graphs, uint32_t vertID, uint32_t passID, PassType passType, ResourceAccessNode &node, const ComputeViewsMap &computeViews) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;
    bool dependent = false;

    for (const auto &pair : computeViews) {
        const auto &values = pair.second;
        for (const auto &computeView : values) {
            gfx::ShaderStageFlagBit visibility = getVisibilityByDescName(layoutGraphData, passID, pair.first);
            visibility = visibility == gfx::ShaderStageFlagBit::NONE ? gfx::ShaderStageFlagBit::COMPUTE : visibility;
            auto access = toGfxAccess(computeView.accessType);
            ViewStatus viewStatus{pair.first, passType, visibility, access};
            addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);
            auto lastVertId = dependencyCheck(resourceAccessGraph, vertID, resourceGraph, viewStatus);
            if (lastVertId != INVALID_ID) {
                tryAddEdge(lastVertId, vertID, resourceAccessGraph);
                tryAddEdge(lastVertId, vertID, relationGraph);
                dependent = true;
            }
        }
    }

    // sort for vector intersection
    std::sort(node.attachemntStatus.begin(), node.attachemntStatus.end(), [](const AccessStatus &lhs, const AccessStatus &rhs) { return lhs.vertID < rhs.vertID; });

    return dependent;
}

void processRasterPass(const Graphs &graphs, uint32_t passID, const RasterPass &pass) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto rlgVertID = add_vertex(relationGraph);
    auto vertID = add_vertex(resourceAccessGraph, passID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &node = get(RAG::AccessNode, resourceAccessGraph, vertID);
    const auto &subpasses = get(SubpassGraph::Subpass, pass.subpassGraph);
    bool hasSubpass = !subpasses.container->empty();
    bool dependent = false;
    if (hasSubpass) {
        auto *lastNode = &node;
        for (const auto &subpass : (*subpasses.container)) {
            lastNode->nextSubpass = new ResourceAccessNode;
            auto *head = lastNode->nextSubpass;

            dependent |= checkRasterViews(graphs, vertID, passID, PassType::RASTER, *head, subpass.rasterViews);
            dependent |= checkComputeViews(graphs, vertID, passID, PassType::RASTER, *head, subpass.computeViews);

            for (const auto &attachment : head->attachemntStatus) {
                auto resID = attachment.vertID;
                auto findByResID = [resID](const AccessStatus &status) {
                    return status.vertID == resID;
                };

                auto iter = std::find_if(node.attachemntStatus.begin(), node.attachemntStatus.end(), findByResID);
                if (iter == node.attachemntStatus.end()) {
                    node.attachemntStatus.emplace_back(attachment);
                } else {
                    (*iter) = attachment;
                }
            }
            lastNode = head;
        }
    } else {
        dependent |= checkRasterViews(graphs, vertID, passID, PassType::RASTER, node, pass.rasterViews);
        dependent |= checkComputeViews(graphs, vertID, passID, PassType::RASTER, node, pass.computeViews);
    }

    if (!dependent) {
        tryAddEdge(EXPECT_START_ID, vertID, resourceAccessGraph);
        tryAddEdge(EXPECT_START_ID, rlgVertID, relationGraph);
    }
}

void processComputePass(const Graphs &graphs, uint32_t passID, const ComputePass &pass) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;
    auto rlgVertID = add_vertex(relationGraph);
    auto vertID = add_vertex(resourceAccessGraph, passID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &node = get(RAG::AccessNode, resourceAccessGraph, vertID);
    bool dependent = checkComputeViews(graphs, vertID, passID, PassType::COMPUTE, node, pass.computeViews);

    if (!dependent) {
        tryAddEdge(EXPECT_START_ID, vertID, resourceAccessGraph);
        tryAddEdge(EXPECT_START_ID, rlgVertID, relationGraph);
    }
}

void processCopyPass(const Graphs &graphs, uint32_t passID, const CopyPass &pass) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto rlgVertID = add_vertex(relationGraph);
    auto vertID = add_vertex(resourceAccessGraph, passID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &node = get(RAG::AccessNode, resourceAccessGraph, vertID);
    bool dependent = false;
    for (const auto &pair : pass.copyPairs) {
        auto sourceRange = Range{
            TextureRange{
                pair.sourceFirstSlice,
                pair.sourcePlaneSlice,
                pair.mipLevels,
                pair.numSlices,
            }};
        auto targetRange = Range{
            TextureRange{
                pair.targetFirstSlice,
                pair.targetPlaneSlice,
                pair.mipLevels,
                pair.numSlices,
            }};

        ViewStatus srcViewStatus{pair.source, PassType::COPY, defaultVisibility, gfx::MemoryAccessBit::READ_ONLY};
        addCopyAccessStatus(resourceAccessGraph, resourceGraph, node, srcViewStatus, sourceRange);
        ViewStatus dstViewStatus{pair.target, PassType::COPY, defaultVisibility, gfx::MemoryAccessBit::WRITE_ONLY};
        addCopyAccessStatus(resourceAccessGraph, resourceGraph, node, dstViewStatus, targetRange);

        uint32_t lastVertSrc = dependencyCheck(resourceAccessGraph, vertID, resourceGraph, srcViewStatus);
        if (lastVertSrc != INVALID_ID) {
            tryAddEdge(lastVertSrc, vertID, resourceAccessGraph);
            tryAddEdge(lastVertSrc, rlgVertID, relationGraph);
            dependent = true;
        }
        uint32_t lastVertDst = dependencyCheck(resourceAccessGraph, vertID, resourceGraph, dstViewStatus);
        if (lastVertDst != INVALID_ID) {
            tryAddEdge(lastVertDst, vertID, resourceAccessGraph);
            tryAddEdge(lastVertDst, rlgVertID, relationGraph);
            dependent = true;
        }
    }
    if (!dependent) {
        tryAddEdge(EXPECT_START_ID, vertID, resourceAccessGraph);
        tryAddEdge(EXPECT_START_ID, rlgVertID, relationGraph);
    }
    std::sort(node.attachemntStatus.begin(), node.attachemntStatus.end(), [](const AccessStatus &lhs, const AccessStatus &rhs) { return lhs.vertID < rhs.vertID; });
}

void processRaytracePass(const Graphs &graphs, uint32_t passID, const RaytracePass &pass) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto rlgVertID = add_vertex(relationGraph);
    auto vertID = add_vertex(resourceAccessGraph, passID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &node = get(RAG::AccessNode, resourceAccessGraph, vertID);
    bool dependent = checkComputeViews(graphs, vertID, passID, PassType::RAYTRACE, node, pass.computeViews);

    if (!dependent) {
        tryAddEdge(EXPECT_START_ID, vertID, resourceAccessGraph);
        tryAddEdge(EXPECT_START_ID, rlgVertID, relationGraph);
    }
}

void processPresentPass(const Graphs &graphs, uint32_t passID, const PresentPass &pass) {
    const auto &[resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto rlgVertID = add_vertex(relationGraph);
    auto vertID = add_vertex(resourceAccessGraph, passID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &node = get(RAG::AccessNode, resourceAccessGraph, vertID);
    bool dependent = false;
    for (const auto &pair : pass.presents) {
        ViewStatus viewStatus{pair.first, PassType::PRESENT, gfx::ShaderStageFlagBit::NONE, gfx::MemoryAccessBit::READ_ONLY};

        auto lastVertId = dependencyCheck(resourceAccessGraph, vertID, resourceGraph, viewStatus);
        addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);
        if (lastVertId != INVALID_ID) {
            tryAddEdge(lastVertId, vertID, resourceAccessGraph);
            tryAddEdge(lastVertId, rlgVertID, relationGraph);
            dependent = true;
        }
    }
    if (!dependent) {
        // LOG("~~~~~~~~~~ Found an empty pipeline! ~~~~~~~~~~");
        tryAddEdge(EXPECT_START_ID, vertID, resourceAccessGraph);
        tryAddEdge(EXPECT_START_ID, rlgVertID, relationGraph);
    }

    resourceAccessGraph.presentPassID = vertID;
    std::sort(node.attachemntStatus.begin(), node.attachemntStatus.end(), [](const AccessStatus &lhs, const AccessStatus &rhs) { return lhs.vertID < rhs.vertID; });
}

#pragma endregion assisstantFuncDefinition

} // namespace render

} // namespace cc
