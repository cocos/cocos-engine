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
#ifdef __clang__
    #pragma clang diagnostic ignored "-Wshorten-64-to-32"
#endif
#include <algorithm>
#include <boost/graph/adjacency_list.hpp>
#include <boost/graph/breadth_first_search.hpp>
#include <boost/graph/transitive_closure.hpp>
#include <boost/range/algorithm.hpp>
#include <boost/graph/filtered_graph.hpp>
#include <iterator>
#include <limits>
#include <numeric>
#include <vector>
#include "FGDispatcherGraphs.h"
#include "FGDispatcherTypes.h"
#include "LayoutGraphGraphs.h"
#include "LayoutGraphTypes.h"
#include "RenderGraphGraphs.h"
#include "base/Log.h"
#include "boost/graph/depth_first_search.hpp"
#include "boost/graph/hawick_circuits.hpp"
#include "boost/graph/visitors.hpp"
#include "boost/lexical_cast.hpp"
#include "details/Range.h"
#include "gfx-base/GFXBarrier.h"
#include "gfx-base/GFXDef-common.h"
#include "gfx-base/GFXDef.h"
#include "gfx-base/GFXDevice.h"
#include "gfx-base/states/GFXBufferBarrier.h"
#include "gfx-base/states/GFXTextureBarrier.h"
#include "math/Vec2.h"
#include "pipeline/custom/RenderCommonFwd.h"
#include "pipeline/custom/RenderGraphTypes.h"
#include "pipeline/custom/details/GslUtils.h"
#include "details/GraphView.h"

#ifndef BRANCH_CULLING
    #define BRANCH_CULLING 0
#endif

#define ENABLE_FGD_WARNNING 1

#ifdef ENABLE_FGD_WARNNING
    #define FGD_WARNING(...) printf(##__VA_ARGS__)
#else
    #define FGD_WARNING(...)
#endif

namespace cc {

namespace render {

static constexpr bool ENABLE_BRANCH_CULLING = BRANCH_CULLING;

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

const BarrierNode& FrameGraphDispatcher::getBarrier(RenderGraph::vertex_descriptor u) const {
    auto ragVertID = resourceAccessGraph.passIndex.at(u);
    return get(ResourceAccessGraph::BarrierTag{}, resourceAccessGraph, ragVertID);
}

const ResourceAccessNode &FrameGraphDispatcher::getAccessNode(RenderGraph::vertex_descriptor u) const {
    auto ragVertID = resourceAccessGraph.passIndex.at(u);
    return get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, ragVertID);
}

const gfx::RenderPassInfo& FrameGraphDispatcher::getRenderPassInfo(RenderGraph::vertex_descriptor u) const {
    auto ragVertID = resourceAccessGraph.passIndex.at(u);
    return get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, ragVertID).rpInfo;
}

const ccstd::vector<std::string>& FrameGraphDispatcher::getOrderedViews(RenderGraph::vertex_descriptor u) const {
    auto ragVertID = resourceAccessGraph.passIndex.at(u);
    return get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, ragVertID).orderedViews;
}

/////////////////////////////////////////////////////////////////////////////////////INTERNAL⚡IMPLEMENTATION/////////////////////////////////////////////////////////////////////////////////////////////

//---------------------------------------------------------------predefine------------------------------------------------------------------
using PmrString = ccstd::pmr::string;
using EdgeList = std::pair<RelationGraph::edge_descriptor, RelationGraph::edge_descriptor>;
using CloseCircuit = std::pair<EdgeList, EdgeList>;
using CloseCircuits = std::vector<CloseCircuit>;
using RelationVert = RelationGraph::vertex_descriptor;
using RelationVerts = std::vector<RelationVert>;
using RelationEdge = RelationGraph::edge_descriptor;
using RelationEdges = std::vector<RelationEdge>;
using ScoreMap = std::map<RelationVert, std::pair<int64_t /*backward*/, int64_t /*forward*/>>;
using RasterViewsMap = PmrTransparentMap<ccstd::pmr::string, RasterView>;
using ComputeViewsMap = PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>>;
using ResourceLifeRecordMap = PmrFlatMap<PmrString, ResourceLifeRecord>;

struct Graphs {
    const RenderGraph &renderGraph;
    const LayoutGraphData &layoutGraphData;
    ResourceGraph &resourceGraph;
    ResourceAccessGraph &resourceAccessGraph;
    RelationGraph &relationGraph;
};

struct ViewStatus {
    const ccstd::pmr::string& name;
    const AccessType access;
    const gfx::ShaderStageFlagBit visibility;
    const gfx::AccessFlags accessFlag;
    const ResourceRange &range;
};

constexpr uint32_t EXPECT_START_ID = 0;
constexpr uint32_t INVALID_ID = 0xFFFFFFFF;

// for scoped enum only
template <typename From, typename To>
class GfxTypeConverter {
public:
    To operator()(From from) {
        return static_cast<To>(
            static_cast<std::underlying_type_t<From>>(from));
    }
};

// TODO(Zeqiang): remove barrier in renderpassinfo
gfx::GeneralBarrier *getGeneralBarrier(gfx::Device *device, gfx::AccessFlagBit prevAccess, gfx::AccessFlagBit nextAccess) {
    return device->getGeneralBarrier({prevAccess, nextAccess});
}

// execution order BUT NOT LOGICALLY
bool isPassExecAdjecent(uint32_t passLID, uint32_t passRID) {
    return std::abs(static_cast<int>(passLID) - static_cast<int>(passRID)) <= 1;
}

template <uint32_t N>
constexpr uint8_t highestBitPos() {
    return highestBitPos<(N >> 1)>() + 1;
}

template <>
constexpr uint8_t highestBitPos<0>() {
    return 0;
}

constexpr uint32_t filledShift(uint8_t pos) {
    return 0xFFFFFFFF >> (32 - pos);
}

constexpr uint8_t HIGHEST_READ_POS = highestBitPos<static_cast<uint32_t>(gfx::AccessFlagBit::PRESENT)>() - 1;
constexpr uint32_t READ_ACCESS = filledShift(HIGHEST_READ_POS) | static_cast<uint32_t>(gfx::AccessFlagBit::SHADING_RATE);

inline bool hasReadAccess(gfx::AccessFlagBit flag) {
    return (static_cast<uint32_t>(flag) & READ_ACCESS) != 0;
}

inline bool isAttachmentAccess(gfx::AccessFlagBit flag) {
    return hasAnyFlags(flag, gfx::AccessFlagBit::FRAGMENT_SHADER_READ_COLOR_INPUT_ATTACHMENT |
                                 gfx::AccessFlagBit::FRAGMENT_SHADER_READ_DEPTH_STENCIL_INPUT_ATTACHMENT |
                                 gfx::AccessFlagBit::COLOR_ATTACHMENT_READ |
                                 gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE |
                                 gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE);
}

// SHADING_RATE may be ambiguos
inline bool isReadOnlyAccess(gfx::AccessFlagBit flag) {
    return static_cast<uint32_t>(flag) < static_cast<uint32_t>(gfx::AccessFlagBit::PRESENT) || flag == gfx::AccessFlagBit::SHADING_RATE;
}

bool accessDependent(const gfx::AccessFlagBit lhs, const gfx::AccessFlagBit &rhs, bool buffer) {
    bool dep{false};
    if (buffer) {
        dep = !isReadOnlyAccess(lhs) || !isReadOnlyAccess(rhs);
    } else {
        dep = (!isReadOnlyAccess(lhs) || !isReadOnlyAccess(rhs)) || (lhs != rhs);
    }
    return dep;
}

template <typename Graph>
bool tryAddEdge(uint32_t srcVertex, uint32_t dstVertex, Graph &graph);

// for transive_closure.hpp line 231
inline RelationGraph::vertex_descriptor add_vertex(RelationGraph &g) { // NOLINT
    thread_local uint32_t count = 0;                                   // unused
    return add_vertex(g, count++);
}

bool isResourceView(const ResourceGraph::vertex_descriptor v, const ResourceGraph &resg) {
    return resg.isTextureView(v); // || isBufferView
}

ResourceRange getResourceRange(const ResourceGraph::vertex_descriptor v,
                               const ResourceGraph &resg) {
    const auto &desc = get(ResourceGraph::DescTag{}, resg, v);
    ResourceRange range{
        desc.width,
        desc.height,
        desc.depthOrArraySize,
    };

    if (isResourceView(v, resg)) {
        const auto subResView = get_if<SubresourceView>(v, &resg);
        range.firstSlice = subResView->firstArraySlice;
        range.numSlices = subResView->numArraySlices;
        range.mipLevel = subResView->indexOrFirstMipLevel;
        range.levelCount = subResView->numMipLevels;
        range.basePlane = subResView->firstPlane;
        range.planeCount = subResView->numPlanes;
    } else {
        range.numSlices = desc.depthOrArraySize;
        range.levelCount = desc.mipLevels;
    }

    return range;
}

ResourceGraph::vertex_descriptor realID(const ccstd::pmr::string &name, const ResourceGraph &resg) {
    auto resID = vertex(name, resg);
    while (parent(resID, resg) != ResourceGraph::null_vertex()) {
        resID = parent(resID, resg);
    }
    return resID;
}

auto dependencyCheck(ResourceAccessGraph &rag, ResourceAccessGraph::vertex_descriptor curVertID, const ResourceGraph &resourceGraph, const ViewStatus &viewStatus) {
    auto &accessRecord = rag.resourceAccess;
    const auto &[name, access, visibility, accessFlag, originRange] = viewStatus;
    auto resourceID = rag.resourceIndex.at(name);
    const auto &states = get(ResourceGraph::StatesTag{}, resourceGraph, resourceID);
    const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resourceID);

    auto range = originRange;
    if (rag.movedResource.find(name) != rag.movedResource.end()) {
        range = rag.movedTargetStatus.at(name).range;
    }

    bool isExternalPass = get(get(ResourceGraph::TraitsTag{}, resourceGraph), resourceID).hasSideEffects();
    auto iter = accessRecord.find(name);
    ResourceAccessGraph::vertex_descriptor lastVertID{EXPECT_START_ID};
    gfx::AccessFlagBit lastAccess{gfx::AccessFlagBit::NONE};

    if (iter == accessRecord.end()) {
        accessRecord[name].emplace(curVertID, AccessStatus{accessFlag, range});
        if (isExternalPass) {
            rag.leafPasses[curVertID] = LeafStatus{true, isReadOnlyAccess(accessFlag)};
            lastAccess = states.states;
        }

        // update parent
        auto parentID = realID(name, resourceGraph);
        if (parentID != resourceID) {
            const auto &realName = get(ResourceGraph::NameTag{}, resourceGraph, parentID);
            auto lastIter = accessRecord[realName].rbegin();
            accessRecord[realName].emplace(curVertID, AccessStatus{accessFlag, range});

            accessRecord[name].emplace(lastIter->second);
        } else {
            accessRecord[name].emplace(0, AccessStatus{lastAccess, range});
        }
    } else {
        auto &transMap = iter->second;
        // single resource single usage in every rendergraph pass.
        CC_ASSERT(transMap.find(curVertID) == transMap.end());
        CC_ASSERT(!transMap.empty());

        const auto lastRecordIter = (--transMap.end());
        const auto &lastStatus = lastRecordIter->second;
        lastAccess = lastStatus.accessFlag;
        bool isBuffer = desc.dimension == ResourceDimension::BUFFER;
        bool dependent = accessDependent(lastAccess, accessFlag, isBuffer);

        if (!dependent) {
            for (auto recordIter = transMap.rbegin(); recordIter != transMap.rend(); ++recordIter) {
                if (accessDependent(recordIter->second.accessFlag, accessFlag, isBuffer)) {
                    lastVertID = recordIter->first;
                    break;
                }
            }
            if (isExternalPass) {
                // only external res will be manually record here, leaf pass with transient resource will be culled by default,
                // those leaf passes with ALL read access on external(or with transients) res can be culled.
                rag.leafPasses[curVertID].needCulling &= (access == AccessType::READ);
                lastAccess = states.states;
            }
            transMap[curVertID] = {accessFlag, range};
        } else {
            lastVertID = lastRecordIter->first;
            transMap[curVertID] = {accessFlag, range};

            if (rag.leafPasses.find(curVertID) != rag.leafPasses.end()) {
                // only write into externalRes counts
                if (isExternalPass) {
                    rag.leafPasses[curVertID].needCulling &= (access == AccessType::READ);
                }
            }
        }

        if (rag.leafPasses.find(lastVertID) != rag.leafPasses.end()) {
            rag.leafPasses.erase(lastVertID);
        }
    }
    auto lastDependentVert = lastVertID; // last dependent vert, WAW/WAR/RAW
    auto nearestAccess = lastAccess;     // last access, maybe RAR
    return std::make_tuple(lastDependentVert, nearestAccess);
}

ResourceGraph::vertex_descriptor parentResource(ResourceGraph::vertex_descriptor vert, const ResourceGraph &resg) {
    const auto &desc = get(ResourceGraph::DescTag{}, resg, vert);
    if (desc.dimension == ResourceDimension::BUFFER) {
        // TODO(Zeqaing): bufferview
        return vert;
    } else {
        auto srcParentID = vert;
        while (resg.isTextureView(srcParentID)) {
            srcParentID = parent(srcParentID, resg);
        }
        return srcParentID;
    }
}

gfx::ShaderStageFlagBit getVisibility(const RenderGraph &renderGraph, const LayoutGraphData &lgd, uint32_t passID, const PmrString &resName) { // NOLINT
    auto iter = lgd.attributeIndex.find(resName);
    if (iter == lgd.attributeIndex.end()) {
        iter = lgd.constantIndex.find(resName);
        if (iter == lgd.constantIndex.end()) {
            // resource not in descriptor: eg. input or output attachment.
            return gfx::ShaderStageFlagBit::NONE;
        }
    }
    auto slotID = iter->second;

    auto layoutName = get(RenderGraph::LayoutTag{}, renderGraph, passID);
    auto layoutID = locate(LayoutGraphData::null_vertex(), layoutName, lgd);
    const auto &layout = get(LayoutGraphData::LayoutTag{}, lgd, layoutID);
    for (const auto &pair : layout.descriptorSets) {
        for (const auto &block : pair.second.descriptorSetLayoutData.descriptorBlocks) {
            for (const auto &descriptor : block.descriptors) {
                if (descriptor.descriptorID.value == slotID.value) {
                    return block.visibility;
                }
            }
        }
    }
    // unreachable
    CC_EXPECTS(false);

    return gfx::ShaderStageFlagBit::NONE;
};

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

auto mapTextureFlags(ResourceFlags flags) {
    gfx::TextureUsage usage = gfx::TextureUsage::NONE;
    if ((flags & ResourceFlags::SAMPLED) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::SAMPLED;
    }
    if ((flags & ResourceFlags::STORAGE) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::STORAGE;
    }
    if ((flags & ResourceFlags::SHADING_RATE) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::SHADING_RATE;
    }
    if ((flags & ResourceFlags::COLOR_ATTACHMENT) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::COLOR_ATTACHMENT;
    }
    if ((flags & ResourceFlags::DEPTH_STENCIL_ATTACHMENT) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::DEPTH_STENCIL_ATTACHMENT;
    }
    if ((flags & ResourceFlags::INPUT_ATTACHMENT) != ResourceFlags::NONE) {
        usage |= gfx::TextureUsage::INPUT_ATTACHMENT;
    }
    return usage;
}

auto getTextureStatus(std::string_view name, AccessType access, gfx::ShaderStageFlags visibility, const ResourceGraph &resourceGraph, bool rasterized) {
    gfx::ShaderStageFlags vis{visibility};
    if (vis == gfx::ShaderStageFlags::NONE) {
        // attachment
        vis = gfx::ShaderStageFlagBit::FRAGMENT;
    }
    gfx::AccessFlags accesFlag;
    auto vertex = resourceGraph.valueIndex.at(name.data());

    const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, vertex);

    // can't find this resource in layoutdata, should be output attachment.
    gfx::TextureUsage texUsage = gfx::TextureUsage::NONE;
    if (access != AccessType::WRITE) {
        if ((desc.flags & ResourceFlags::INPUT_ATTACHMENT) != ResourceFlags::NONE && rasterized) {
            texUsage |= (mapTextureFlags(desc.flags) & (gfx::TextureUsage::COLOR_ATTACHMENT | gfx::TextureUsage::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsage::INPUT_ATTACHMENT));
        } else {
            texUsage |= (mapTextureFlags(desc.flags) & (gfx::TextureUsage::SAMPLED | gfx::TextureUsage::STORAGE | gfx::TextureUsage::SHADING_RATE | gfx::TextureUsage::DEPTH_STENCIL_ATTACHMENT));
        }
    }

    if (access != AccessType::READ) {
        texUsage |= (mapTextureFlags(desc.flags) & (gfx::TextureUsage::COLOR_ATTACHMENT | gfx::TextureUsage::DEPTH_STENCIL_ATTACHMENT | gfx::TextureUsage::STORAGE));
    }
    accesFlag = gfx::getAccessFlags(texUsage, toGfxAccess(access), vis);

    return std::make_tuple(vis, accesFlag);
};

auto getBufferStatus(const PmrString &name, AccessType access, gfx::ShaderStageFlags visibility, const ResourceGraph &resourceGraph) {
    gfx::AccessFlags accesFlag;
    auto vertex = resourceGraph.valueIndex.at(name);
    const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, vertex);

    gfx::BufferUsage bufferUsage{gfx::BufferUsage::NONE};
    // copy is not included in this logic because copy can be set TRANSFER_xxx directly.
    if (access != AccessType::READ) {
        bufferUsage = gfx::BufferUsage::STORAGE;
    }

    if (access != AccessType::WRITE) {
        bool uniformFlag = (desc.flags & ResourceFlags::UNIFORM) != ResourceFlags::NONE;
        bool storageFlag = (desc.flags & ResourceFlags::STORAGE) != ResourceFlags::NONE;

        // CC_EXPECTS(uniformFlag ^ storageFlag);
        //  uniform or read-only storage buffer
        bufferUsage = uniformFlag ? gfx::BufferUsage::UNIFORM : gfx::BufferUsage::STORAGE;
    }

    // those buffers not found in descriptorlayout but appear here,
    // can and only can be VERTEX/INDEX/INDIRECT BUFFER,
    // only copy pass is allowed.

    auto memAccess = toGfxAccess(access);
    accesFlag = gfx::getAccessFlags(bufferUsage, gfx::MemoryUsage::DEVICE, memAccess, visibility);
    return std::make_tuple(visibility, accesFlag);
};

void addAccessStatus(ResourceAccessGraph &rag, const ResourceGraph &rg, ResourceAccessNode &node, const ViewStatus &status) {
    const auto &[name, access, visibility, accessFlag, range] = status;
    uint32_t rescID = rg.valueIndex.at(name);
    const auto &resourceDesc = get(ResourceGraph::DescTag{}, rg, rescID);
    const auto &traits = get(ResourceGraph::TraitsTag{}, rg, rescID);

    CC_EXPECTS(rg.valueIndex.find(name) != rg.valueIndex.end());
    if (std::find(rag.resourceNames.begin(), rag.resourceNames.end(), name) == rag.resourceNames.end()) {
        rag.resourceIndex.emplace(name, rescID);
        rag.resourceNames.emplace_back(name);
    }

    node.resourceStatus.emplace(name, AccessStatus{
                                          accessFlag,
                                          range,
                                      });
}

namespace {

static const uint32_t ATTACHMENT_TYPE_WEIGHT[] = {0, 2, 1};

struct AttachmentSortKey {
    gfx::SampleCount samples;
    AccessType accessType;
    uint32_t attachmentWeight;
    const ccstd::pmr::string name;
};

struct AttachmentComparator {
    bool operator()(const AttachmentSortKey& lhs, const AttachmentSortKey& rhs) const {
        return std::tie(rhs.samples, lhs.accessType, lhs.attachmentWeight, lhs.name) < std::tie(lhs.samples, rhs.accessType, rhs.attachmentWeight, rhs.name);
    }
};

struct ViewInfo {
    gfx::Format format{gfx::Format::UNKNOWN};
    LayoutAccess access;
    gfx::LoadOp loadOp;
    gfx::StoreOp storeOp;
    AttachmentType attachmentType;
    const ccstd::pmr::string parentName;
};

using AttachmentMap = ccstd::pmr::map<AttachmentSortKey, ViewInfo, AttachmentComparator>;
} // namespace

void fillRenderPassInfo(const AttachmentMap& colorMap,
                        FGRenderPassInfo &fgRenderpassInfo) {
    for (const auto &pair : colorMap) {
        const auto &key = pair.first;
        const auto &viewInfo = pair.second;
        if (viewInfo.attachmentType == AttachmentType::DEPTH_STENCIL && key.accessType == AccessType::WRITE) {
            // put ds[sample > 1] to ds, ds[sample == 1] to dsResolve, swap them if not a ms pass in endRenderPass.
            auto &ds = key.samples != gfx::SampleCount::X1 ? fgRenderpassInfo.rpInfo.depthStencilAttachment
                                                           : fgRenderpassInfo.rpInfo.depthStencilResolveAttachment;
            if (ds.format == gfx::Format::UNKNOWN) {
                ds.depthLoadOp = viewInfo.loadOp;
                ds.stencilLoadOp = viewInfo.loadOp;
                ds.sampleCount = key.samples;
                ds.format = viewInfo.format;
                uint32_t isResolve = fgRenderpassInfo.resolveCount && key.samples == gfx::SampleCount::X1;
                fgRenderpassInfo.dsAccess.prevAccess = viewInfo.access.prevAccess;
                fgRenderpassInfo.viewIndex.emplace(std::piecewise_construct,
                                                   std::forward_as_tuple(key.name),
                                                   // viewIndex(ds will be reordered), isResolveView
                                                   std::forward_as_tuple(AttachmentInfo{gfx::INVALID_BINDING,
                                                                                        isResolve}));

                fgRenderpassInfo.rootResources.emplace(viewInfo.parentName);
            }
            ds.depthStoreOp = viewInfo.storeOp;
            ds.stencilStoreOp = viewInfo.storeOp;
            fgRenderpassInfo.dsAccess.nextAccess = viewInfo.access.nextAccess;
        } else {
            auto iter = fgRenderpassInfo.viewIndex.find(key.name.c_str());
            auto &colors = fgRenderpassInfo.rpInfo.colorAttachments;
            auto colorIndex = fgRenderpassInfo.rootResources.size();
            if (iter == fgRenderpassInfo.viewIndex.end()) {
                if (viewInfo.format == gfx::Format::DEPTH_STENCIL) {
                    // expect to be depth stencil input && depth stencil view
                    CC_EXPECTS(viewInfo.parentName != key.name);
                    bool resolve = fgRenderpassInfo.resolveCount && key.samples == gfx::SampleCount::X1;
                    auto &ds = resolve ? fgRenderpassInfo.rpInfo.depthStencilResolveAttachment : fgRenderpassInfo.rpInfo.depthStencilAttachment;
                    ds.depthStoreOp = viewInfo.storeOp;
                    ds.stencilStoreOp = viewInfo.storeOp;
                    auto &access = resolve ? fgRenderpassInfo.dsResolveAccess : fgRenderpassInfo.dsAccess;
                    access.nextAccess = viewInfo.access.nextAccess;

                    fgRenderpassInfo.viewIndex.emplace(std::piecewise_construct,
                                                       std::forward_as_tuple(key.name),
                                                       std::forward_as_tuple(AttachmentInfo{gfx::INVALID_BINDING,
                                                                                            fgRenderpassInfo.resolveCount && key.samples == gfx::SampleCount::X1}));
                } else {
                    auto& color = colors.emplace_back();
                    color.format = viewInfo.format;
                    color.loadOp = viewInfo.loadOp;
                    color.sampleCount = key.samples;
                    fgRenderpassInfo.orderedViews.emplace_back(key.name);
                    fgRenderpassInfo.colorAccesses.emplace_back(LayoutAccess{viewInfo.access.prevAccess, viewInfo.access.nextAccess});
                    fgRenderpassInfo.viewIndex.emplace(std::piecewise_construct,
                                                        std::forward_as_tuple(key.name),
                                                        std::forward_as_tuple(AttachmentInfo{static_cast<uint32_t>(fgRenderpassInfo.orderedViews.size()),
                                                                                            fgRenderpassInfo.resolveCount && key.samples == gfx::SampleCount::X1}));
                    color.storeOp = viewInfo.storeOp;
                    fgRenderpassInfo.colorAccesses[colorIndex].nextAccess = viewInfo.access.nextAccess;
                }

                fgRenderpassInfo.rootResources.emplace(viewInfo.parentName);
            } else {
                const auto &[cIndex, resolveView] = fgRenderpassInfo.viewIndex.at(key.name.c_str());
                if (cIndex == gfx::INVALID_BINDING) {
                    auto &ds = resolveView ? fgRenderpassInfo.rpInfo.depthStencilResolveAttachment : fgRenderpassInfo.rpInfo.depthStencilAttachment;
                    ds.depthStoreOp = viewInfo.storeOp;
                    ds.stencilStoreOp = viewInfo.storeOp;
                    auto &access = resolveView ? fgRenderpassInfo.dsResolveAccess : fgRenderpassInfo.dsAccess;
                    access.nextAccess = viewInfo.access.nextAccess;
                } else {
                    auto& color = fgRenderpassInfo.rpInfo.colorAttachments[cIndex];
                    color.storeOp = viewInfo.storeOp;
                    fgRenderpassInfo.colorAccesses[cIndex].nextAccess = viewInfo.access.nextAccess;
                }
            }
        }
    }
};

bool isDefaultRenderAttachment(const ccstd::pmr::string& name) {
    return name.empty() || (name == "_");
}

void extractNames(const ccstd::pmr::string& resName,
                const RasterView &view,
                ccstd::pmr::vector<ccstd::pmr::string>& names) {
    // depth_stencil
    if (view.attachmentType == AttachmentType::DEPTH_STENCIL) {
        if (!isDefaultRenderAttachment(view.slotName)) {
            names.emplace_back(resName + "/depth");
        }
        if (!isDefaultRenderAttachment(view.slotName1)) {
            names.emplace_back(resName + "/stencil");
        }
        if (names.empty()) {
            names.emplace_back(resName);
        }
    } else {
        names.emplace_back(resName);
    }

    // cube

    // array
}

auto checkRasterViews(const Graphs &graphs,
                      ResourceAccessGraph::vertex_descriptor ragVertID,
                      ResourceAccessNode &node,
                      const RasterViewsMap &rasterViews,
                      AttachmentMap &colorMap) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;
    const auto passID = get(ResourceAccessGraph::PassIDTag{}, resourceAccessGraph, ragVertID);
    bool dependent = false;
    bool hasDS = false;

    auto explicitVis = gfx::ShaderStageFlagBit::NONE;
    if (holds<ComputeTag>(passID, renderGraph)) {
        explicitVis |= gfx::ShaderStageFlagBit::COMPUTE;
    }

    for (const auto &pair : rasterViews) {
        const auto &rasterView = pair.second;
        const auto &originName = pair.first;
        ccstd::pmr::vector<ccstd::pmr::string> names(resourceAccessGraph.get_allocator());
        extractNames(originName, rasterView, names);

        for (const auto &resName : names) {
            const auto resID = vertex(resName, resourceGraph);
            auto access = rasterView.accessType;
            gfx::ShaderStageFlagBit originVis = getVisibility(renderGraph, layoutGraphData, passID, pair.second.slotName) | explicitVis | pair.second.shaderStageFlags;
            const auto &[vis, accessFlag] = getTextureStatus(resName.data(), access, originVis, resourceGraph, true);
            auto range = getResourceRange(resID, resourceGraph);

            ViewStatus viewStatus{resName, access, vis, accessFlag, range};
            addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);

            const auto &[lastVertId, lastAccess] = dependencyCheck(resourceAccessGraph, ragVertID, resourceGraph, viewStatus);
            tryAddEdge(lastVertId, ragVertID, resourceAccessGraph);
            tryAddEdge(lastVertId, ragVertID, relationGraph);
            dependent |= (lastVertId != EXPECT_START_ID);

            const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
            colorMap.emplace(AttachmentSortKey{desc.sampleCount,
                                               rasterView.accessType,
                                               ATTACHMENT_TYPE_WEIGHT[static_cast<uint32_t>(rasterView.attachmentType)],
                                               resName},
                             ViewInfo{desc.format,
                                      LayoutAccess{lastAccess, accessFlag},
                                      rasterView.loadOp,
                                      rasterView.storeOp,
                                      rasterView.attachmentType,
                                      originName});
            hasDS |= rasterView.attachmentType == AttachmentType::DEPTH_STENCIL;
        }
    }
    return std::make_tuple(dependent, hasDS);
}

bool checkComputeViews(const Graphs &graphs, ResourceAccessGraph::vertex_descriptor ragVertID, ResourceAccessNode &node, const ComputeViewsMap &computeViews) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;
    const auto passID = get(ResourceAccessGraph::PassIDTag{}, resourceAccessGraph, ragVertID);
    bool dependent = false;

    for (const auto &pair : computeViews) {
        const auto &values = pair.second;
        const auto &resName = pair.first;
        const auto resID = vertex(resName, resourceGraph);
        auto range = getResourceRange(vertex(resName, resourceGraph), resourceGraph);
        for (const auto &computeView : values) {
            gfx::ShaderStageFlagBit vis = gfx::ShaderStageFlagBit::NONE;
            for (const auto &view : pair.second) {
                vis |= getVisibility(renderGraph, layoutGraphData, passID, view.name);
                vis |= view.shaderStageFlags;
            }
            const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
            gfx::AccessFlagBit accessFlag{gfx::AccessFlagBit::NONE};
            if (desc.dimension == ResourceDimension::BUFFER) {
                const auto &[ignore0, accessFlag] = getBufferStatus(pair.first, computeView.accessType, vis, resourceGraph);
            } else {
                const auto &[ignore0, accessFlag] = getTextureStatus(pair.first, computeView.accessType, vis, resourceGraph, false);
            }
            range.firstSlice = computeView.plane;
            range.numSlices = 1;
            ViewStatus viewStatus{pair.first, computeView.accessType, vis, accessFlag, range};
            addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);
            auto [lastVertId, neareastAccess] = dependencyCheck(resourceAccessGraph, ragVertID, resourceGraph, viewStatus);

            tryAddEdge(lastVertId, ragVertID, resourceAccessGraph);
            tryAddEdge(lastVertId, ragVertID, relationGraph);
            dependent = lastVertId != EXPECT_START_ID;
        }
    }

    return dependent;
}

bool checkResolveResource(const Graphs &graphs,
        uint32_t ragVertID,
        ResourceAccessNode &node,
        const ccstd::pmr::vector<ResolvePair> &resolves,
        AttachmentMap &colorMap) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;
    const auto passID = get(ResourceAccessGraph::PassIDTag{}, resourceAccessGraph, ragVertID);
    bool dependent = false;

    for (const auto &pair : resolves) {
        const auto &resolveTargetName = pair.target;

        const auto &resID = vertex(resolveTargetName, resourceGraph);
        const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);

        bool isDS = desc.format == gfx::Format::DEPTH_STENCIL;
        auto accessFlag = isDS ? gfx::AccessFlagBit::DEPTH_STENCIL_ATTACHMENT_WRITE : gfx::AccessFlagBit::COLOR_ATTACHMENT_WRITE;

        gfx::ShaderStageFlagBit vis = gfx::ShaderStageFlagBit::FRAGMENT;
        auto range = getResourceRange(resID, resourceGraph);

        ViewStatus viewStatus{resolveTargetName, AccessType::WRITE, vis, accessFlag, range};
        addAccessStatus(resourceAccessGraph, resourceGraph, node, viewStatus);

        const auto &[lastVertId, lastAccess] = dependencyCheck(resourceAccessGraph, ragVertID, resourceGraph, viewStatus);
        tryAddEdge(lastVertId, ragVertID, resourceAccessGraph);
        tryAddEdge(lastVertId, ragVertID, relationGraph);
        dependent = lastVertId != EXPECT_START_ID;

        AttachmentType attachmentType = isDS ? AttachmentType::DEPTH_STENCIL : AttachmentType::RENDER_TARGET;
        colorMap.emplace(AttachmentSortKey{desc.sampleCount,
                                           AccessType::WRITE,
                                           ATTACHMENT_TYPE_WEIGHT[static_cast<uint32_t>(attachmentType)],
                                           resolveTargetName},
                         ViewInfo{desc.format,
                                  LayoutAccess{lastAccess, accessFlag},
                                  gfx::LoadOp::DISCARD,
                                  gfx::StoreOp::STORE,
                                  attachmentType,
                                  resolveTargetName});
    }
    return dependent;
}


uint32_t record(uint32_t index) {
    uint32_t res = 1 << index;
    return res;
}

uint32_t record(const ccstd::vector<uint32_t> &indices) {
    uint32_t res = 0;
    for (auto attachmentIndex : indices) {
        res |= 1 << attachmentIndex;
    }
    return res;
}

void extract(uint32_t val, ccstd::vector<uint32_t> &preserves) {
    uint32_t index = 0;
    while (val) {
        if (val & 0x1) {
            preserves.emplace_back(index);
        }
        val = val >> 1;
        ++index;
    }
}

void getPreserves(gfx::RenderPassInfo &rpInfo) {
    std::stack<gfx::SubpassInfo *> stack;
    for (auto &info : rpInfo.subpasses) {
        stack.push(&info);
    }

    auto dsIndex = record(rpInfo.colorAttachments.size());
    auto dsMask = record(rpInfo.colorAttachments.size()) | record(rpInfo.colorAttachments.size() + 1);

    uint32_t laterRead{0};
    while (!stack.empty()) {
        auto *tail = stack.top();
        stack.pop();

        auto readRecord = record(tail->inputs);
        auto writeRecord = record(tail->colors);
        auto resolveRecord = record(tail->resolves);

        uint32_t dsRecord = 0;
        if (tail->depthStencil != INVALID_ID) {
            dsRecord |= record(tail->depthStencil);
        }
        if (tail->depthStencilResolve != INVALID_ID) {
            dsRecord |= record(tail->depthStencilResolve);
        }
        auto shown = readRecord | writeRecord | resolveRecord | dsRecord;
        auto needPreserve = (shown | laterRead) ^ shown;
        needPreserve = (needPreserve & dsMask) == dsMask ? (needPreserve & ~dsMask) | dsIndex : (needPreserve & ~dsMask);
        extract(needPreserve, tail->preserves);
        laterRead |= readRecord;
    }
}


void startRenderPass(const Graphs &graphs, uint32_t passID, const RasterPass &pass) {
    const auto &[renderGraph, resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &fgRenderPassInfo = get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, vertID);
    if (pass.subpassGraph.subpasses.empty()) {
        AttachmentMap colorMap(resourceAccessGraph.get_allocator());
        auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, vertID);
        std::ignore = checkRasterViews(graphs, rlgVertID, accessNode, pass.rasterViews, colorMap);
        std::ignore = checkComputeViews(graphs, rlgVertID, accessNode, pass.computeViews);
        fillRenderPassInfo(colorMap, fgRenderPassInfo);
    } else {
        const auto &subpasses = pass.subpassGraph.subpasses;
        uint32_t initVal{0};
        fgRenderPassInfo.resolveCount = std::accumulate(subpasses.begin(), subpasses.end(), initVal, [](uint32_t ct, const Subpass &subpass) {
            return ct + subpass.resolvePairs.size();
        });
    }
}

void endRenderPass(const Graphs &graphs, uint32_t passID, const RasterPass &pass) {
    const auto &[renderGraph, resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = resourceAccessGraph.passIndex.at(passID);
    auto rlgVertID = relationGraph.vertexMap.at(vertID);

    auto &node = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, vertID);
    auto &fgRenderpassInfo = get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, vertID);

    bool filledDS{fgRenderpassInfo.dsAccess.nextAccess != gfx::AccessFlags::NONE};
    bool filledDSResolve{fgRenderpassInfo.dsResolveAccess.nextAccess != gfx::AccessFlags::NONE};
    if (filledDSResolve && !filledDS) {
        CC_ASSERT(fgRenderpassInfo.rpInfo.depthStencilAttachment.format == gfx::Format::UNKNOWN);
        std::swap(fgRenderpassInfo.rpInfo.depthStencilAttachment, fgRenderpassInfo.rpInfo.depthStencilResolveAttachment);
        std::swap(fgRenderpassInfo.dsAccess, fgRenderpassInfo.dsResolveAccess);
    }
    
    //std::advance(dsIter, fgRenderpassInfo.viewIndex.size() - filledDS - filledDSResolve); // ds and dsresolve maybe
    for (auto dsIter = fgRenderpassInfo.viewIndex.begin(); dsIter != fgRenderpassInfo.viewIndex.end(); ++dsIter) {
        if (dsIter->second.index == gfx::INVALID_BINDING) {
            fgRenderpassInfo.orderedViews.emplace_back(dsIter->first);
        }
    }

    if (!pass.subpassGraph.subpasses.empty()) {
        getPreserves(fgRenderpassInfo.rpInfo);
    }
}

void startRenderSubpass(const Graphs &graphs, uint32_t passID, const RasterSubpass &pass) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, rlgVertID);

    auto parentID = parent(passID, renderGraph);
    auto *uberPass = get_if<RasterPass>(parentID, &renderGraph);
    auto parentRagVertID = resourceAccessGraph.passIndex.at(parentID);
    auto &fgRenderpassInfo = get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, parentRagVertID);
    AttachmentMap colorMap(resourceAccessGraph.get_allocator());

    auto &[hasDep, hasDS] = checkRasterViews(graphs, rlgVertID, accessNode, pass.rasterViews, colorMap);
    hasDep |= checkComputeViews(graphs, rlgVertID, accessNode, pass.computeViews);
    hasDep |= checkResolveResource(graphs, rlgVertID, accessNode, pass.resolvePairs, colorMap);
    fillRenderPassInfo(colorMap, fgRenderpassInfo);

    auto &subpassInfo = fgRenderpassInfo.rpInfo.subpasses.emplace_back();
    auto &dependencies = fgRenderpassInfo.rpInfo.dependencies;

    // subpass info & subpass dependencies
    for (const auto &pair : colorMap) {
        const auto &sortKey = pair.first;
        const std::string_view name = sortKey.name;
        auto resID = vertex(sortKey.name, resourceGraph);
        const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
        const auto &[viewIndex, isResolveView] = fgRenderpassInfo.viewIndex.at(name.data());
        if (isResolveView) {
            auto resolveIter = std::find_if(pass.resolvePairs.begin(), pass.resolvePairs.end(), [&name](const ResolvePair &resolve) {
                return strcmp(resolve.target.c_str(), name.data()) == 0;
            });
            if (desc.format == gfx::Format::DEPTH_STENCIL) {
                subpassInfo.depthStencilResolve = uberPass->rasterViews.size() - hasDS + fgRenderpassInfo.resolveCount + 1;
                if (resolveIter->mode != gfx::ResolveMode::NONE) {
                    subpassInfo.depthResolveMode = resolveIter->mode;
                }
                if (resolveIter->mode1 != gfx::ResolveMode::NONE) {
                    subpassInfo.stencilResolveMode = resolveIter->mode1;
                }
            } else {
                if (subpassInfo.resolves.empty()) {
                    subpassInfo.resolves.resize(pass.rasterViews.size() - hasDS, gfx::INVALID_BINDING);
                }
                const auto &resolveSrc = resolveIter->source;
                const auto& [srcIndex, ignored] = fgRenderpassInfo.viewIndex.at(resolveSrc.c_str());
                subpassInfo.resolves[srcIndex] = viewIndex;
            }
        } else {
            if (desc.format == gfx::Format::DEPTH_STENCIL) {
                if (sortKey.accessType != AccessType::WRITE) {
                    subpassInfo.inputs.emplace_back(uberPass->rasterViews.size());
                }
                if (sortKey.accessType != AccessType::READ) {
                    subpassInfo.depthStencil = uberPass->rasterViews.size() - hasDS + fgRenderpassInfo.resolveCount;
                }
            } else {
                if (sortKey.accessType != AccessType::WRITE) {
                    subpassInfo.inputs.emplace_back(viewIndex);
                }
                if (sortKey.accessType != AccessType::READ) {
                    subpassInfo.colors.emplace_back(viewIndex);
                }

                if (sortKey.accessType == AccessType::READ_WRITE) {
                    auto &selfDependency = dependencies.emplace_back();
                    selfDependency.srcSubpass = pass.subpassID;
                    selfDependency.dstSubpass = pass.subpassID;
                    selfDependency.prevAccesses = pair.second.access.nextAccess;
                    selfDependency.nextAccesses = pair.second.access.nextAccess;
                }
            }
        }

        if (hasDep) {
            auto &dependency = dependencies.emplace_back();
            auto lastIter = ++resourceAccessGraph.resourceAccess[name.data()].rbegin();
            bool isBuffer = desc.dimension == ResourceDimension::BUFFER;
            if (accessDependent(lastIter->second.accessFlag, accessNode.resourceStatus.at(name.data()).accessFlag, isBuffer) && lastIter->second.accessFlag != gfx::AccessFlagBit::NONE) {
                auto lastVert = lastIter->first;
                auto lastPassID = get(ResourceAccessGraph::PassIDTag{}, resourceAccessGraph, lastVert);
                auto lastPassIndex = INVALID_ID;
                if (holds<RasterSubpassTag>(lastPassID, renderGraph) && (parent(lastPassID, renderGraph) == parentID)) {
                    const auto* lastPass = get_if<RasterSubpass>(lastPassID , &renderGraph);
                    lastPassIndex = lastPass->subpassID;
                }

                auto &dependency = dependencies.emplace_back();
                dependency.srcSubpass = lastPassIndex;
                dependency.dstSubpass = pass.subpassID;
                dependency.prevAccesses = lastIter->second.accessFlag;
                dependency.nextAccesses = pair.second.access.nextAccess;
            }
        }
    }
}

void startComputeSubpass(const Graphs &graphs, uint32_t passID, const ComputeSubpass &pass) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, rlgVertID);
    AttachmentMap colorMap(resourceAccessGraph.get_allocator());

    auto parentID = parent(passID, renderGraph);
    auto parentRagVertID = resourceAccessGraph.passIndex.at(parentID);
    auto &fgRenderpassInfo = get(ResourceAccessGraph::RenderPassInfoTag{}, resourceAccessGraph, parentRagVertID);

    std::ignore = checkRasterViews(graphs, rlgVertID, accessNode, pass.rasterViews, colorMap);
    std::ignore = checkComputeViews(graphs, rlgVertID, accessNode, pass.computeViews);

    fillRenderPassInfo(colorMap, fgRenderpassInfo);
}

void startComputePass(const Graphs &graphs, uint32_t passID, const ComputePass &pass) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, rlgVertID);
    std::ignore = checkComputeViews(graphs, rlgVertID, accessNode, pass.computeViews);
}

void startCopyPass(const Graphs &graphs, uint32_t passID, const CopyPass &pass) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));
    auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, rlgVertID);

    const auto &resg = resourceGraph;
    auto &rag = resourceAccessGraph;
    auto &rlg = relationGraph;
    auto checkCopy = [&](ccstd::pmr::string resName,
                         uint32_t firstSlice,
                         uint32_t firstMip,
                         uint32_t firstPlane,
                         uint32_t sliceCount,
                         uint32_t mipCount,
                         bool read) {
        auto srcID = vertex(resName, resg);
        auto srcRange = getResourceRange(srcID, resg);
        srcRange.firstSlice = firstSlice;
        srcRange.mipLevel = firstMip;
        srcRange.basePlane = firstPlane;
        srcRange.numSlices = sliceCount;
        srcRange.levelCount = mipCount;

        AccessType access = read ? AccessType::READ : AccessType::WRITE;
        gfx::AccessFlags accessFlag = read ? gfx::AccessFlags::TRANSFER_READ : gfx::AccessFlags::TRANSFER_WRITE;
        ViewStatus srcViewStatus{resName, access, gfx::ShaderStageFlagBit::NONE, accessFlag, srcRange};
        addAccessStatus(rag, resg, accessNode, srcViewStatus);
        const auto &[lastVertSrc, ignore1] = dependencyCheck(rag, vertID, resg, srcViewStatus);
        tryAddEdge(lastVertSrc, vertID, rag);
        tryAddEdge(lastVertSrc, rlgVertID, rlg);
    };

    for (const auto &copy : pass.copyPairs) {
        checkCopy(copy.source,
                  copy.sourceFirstSlice, copy.sourceMostDetailedMip, copy.sourcePlaneSlice,
                  copy.numSlices, copy.mipLevels, true);

        checkCopy(copy.target,
                  copy.targetFirstSlice, copy.targetMostDetailedMip, copy.targetPlaneSlice,
                  copy.numSlices, copy.mipLevels, false);
    }

    for (const auto &upload : pass.uploadPairs) {
        checkCopy(upload.target,
                  upload.targetFirstSlice, upload.targetMostDetailedMip, upload.targetPlaneSlice,
                  upload.numSlices, upload.mipLevels, false);
    }
}

void startRaytracePass(const Graphs &graphs, uint32_t passID, const RaytracePass &pass) {
    const auto &[renderGraph, layoutGraphData, resourceGraph, resourceAccessGraph, relationGraph] = graphs;

    auto vertID = add_vertex(resourceAccessGraph, passID);
    auto rlgVertID = add_vertex(relationGraph, vertID);
    CC_EXPECTS(static_cast<uint32_t>(rlgVertID) == static_cast<uint32_t>(vertID));

    auto &accessNode = get(ResourceAccessGraph::PassNodeTag{}, resourceAccessGraph, rlgVertID);
    std::ignore = checkComputeViews(graphs, rlgVertID, accessNode, pass.computeViews);
}

struct DependencyVisitor : boost::dfs_visitor<> {
    void discover_vertex(RenderGraph::vertex_descriptor passID,
        const AddressableView<RenderGraph> &gv) const {
        visitObject(
            passID, graphs.renderGraph,
            [&](const RasterPass &pass) {
                startRenderPass(graphs, passID, pass);
            },
            [&](const RasterSubpass &pass) {
                startRenderSubpass(graphs, passID, pass);
            },
            [&](const ComputeSubpass &pass) {
                startComputeSubpass(graphs, passID, pass);
            },
            [&](const ComputePass &pass) {
                startComputePass(graphs, passID, pass);
            },
            [&](const CopyPass &pass) {
                startCopyPass(graphs, passID, pass);
            },
            [&](const RaytracePass &pass) {
                startRaytracePass(graphs, passID, pass);
            },
            [&](const auto & /*pass*/) {
                // do nothing
            });
    }

    void finish_vertex(RenderGraph::vertex_descriptor passID,
                       const AddressableView<RenderGraph> &gv) const {
        visitObject(
            passID, graphs.renderGraph,
            [&](const RasterPass &pass) {
                endRenderPass(graphs, passID, pass);
            },
            [&](const auto & /*pass*/) {
                // do nothing
            });
    }

    const Graphs &graphs;
};

// status of resource access
void buildAccessGraph(const Graphs &graphs) {
    // what we need:
    //  - pass dependency
    //  - pass attachment access
    // AccessTable accessRecord;

    const auto &[renderGraph, resourceGraph, layoutGraphData, resourceAccessGraph, relationGraph] = graphs;
    size_t numPasses = 0;
    numPasses += renderGraph.rasterPasses.size();
    numPasses += renderGraph.computePasses.size();
    numPasses += renderGraph.copyPasses.size();
    numPasses += renderGraph.movePasses.size();
    numPasses += renderGraph.raytracePasses.size();

    resourceAccessGraph.reserve(static_cast<ResourceAccessGraph::vertices_size_type>(numPasses));
    resourceAccessGraph.resourceNames.reserve(128);
    resourceAccessGraph.resourceIndex.reserve(128);

    resourceAccessGraph.topologicalOrder.reserve(numPasses);
    resourceAccessGraph.topologicalOrder.clear();
    resourceAccessGraph.resourceLifeRecord.reserve(resourceGraph.names.size());

    if (!resourceAccessGraph.resourceLifeRecord.empty()) {
        resourceAccessGraph.resourceLifeRecord.clear();
    }

    if (!resourceAccessGraph.leafPasses.empty()) {
        resourceAccessGraph.leafPasses.clear();
    }
    if (!resourceAccessGraph.culledPasses.empty()) {
        resourceAccessGraph.culledPasses.clear();
    }

    // const auto &names = get(RenderGraph::Name, renderGraph);
    for (size_t i = 1; i <= numPasses; ++i) {
        resourceAccessGraph.leafPasses.emplace(i, LeafStatus{false, true});
    }

    auto startID = add_vertex(resourceAccessGraph, INVALID_ID - 1);
    CC_EXPECTS(startID == EXPECT_START_ID);

    add_vertex(relationGraph, startID);

    DependencyVisitor visitor{{}, graphs};
    auto colors = renderGraph.colors(renderGraph.resource());
    AddressableView gv{renderGraph};
    for (const auto passID : renderGraph.sortedVertices) {
        if (!holds<RasterSubpassTag>(passID, renderGraph) && !holds<ComputeSubpassTag>(passID, renderGraph)) {
            boost::depth_first_visit(gv, passID, visitor, get(colors, renderGraph));
        }
    }

    auto &rag = resourceAccessGraph;
    auto branchCulling = [](ResourceAccessGraph::vertex_descriptor vertex, ResourceAccessGraph &rag) -> void {
        CC_EXPECTS(out_degree(vertex, rag) == 0);
        using FuncType = void (*)(ResourceAccessGraph::vertex_descriptor, ResourceAccessGraph &);
        static FuncType leafCulling = [](ResourceAccessGraph::vertex_descriptor vertex, ResourceAccessGraph &rag) {
            rag.culledPasses.emplace(vertex);
            auto &attachments = get(ResourceAccessGraph::PassNodeTag{}, rag, vertex);
            attachments.resourceStatus.clear();
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
        auto ragEndNode = add_vertex(rag, RenderGraph::null_vertex());
        auto rlgEndNode = add_vertex(relationGraph, ragEndNode);
        // keep sync before pass reorder done.
        CC_EXPECTS(ragEndNode == rlgEndNode);
        resourceAccessGraph.presentPassID = ragEndNode;
        auto iter = resourceAccessGraph.leafPasses.find(ragEndNode);
        constexpr bool isExternal = true;
        constexpr bool needCulling = false;
        if (iter == resourceAccessGraph.leafPasses.end()) {
            resourceAccessGraph.leafPasses.emplace(ragEndNode, LeafStatus{isExternal, needCulling});
        } else {
            resourceAccessGraph.leafPasses.at(ragEndNode) = LeafStatus{isExternal, needCulling};
        }
    }

    // make leaf node closed walk for pass reorder
    for (auto pass : resourceAccessGraph.leafPasses) {
        bool isExternal = pass.second.isExternal;
        bool needCulling = pass.second.needCulling;

        if (pass.first != resourceAccessGraph.presentPassID) {
            if (isExternal && !needCulling) {
                add_edge(pass.first, resourceAccessGraph.presentPassID, resourceAccessGraph);
            } else {
                // write into transient resources, culled
                if constexpr (ENABLE_BRANCH_CULLING) {
                    branchCulling(pass.first, resourceAccessGraph);
                }
            }
        }
    }
    for (auto rit = resourceAccessGraph.culledPasses.rbegin(); rit != resourceAccessGraph.culledPasses.rend(); ++rit) {
        // remove culled vertices, std::less make this set ascending order, so reverse iterate
        remove_vertex(*rit, relationGraph);
    }

    for (auto rlgVert : makeRange(vertices(relationGraph))) {
        auto ragVert = get(RelationGraph::DescIDTag{}, relationGraph, rlgVert);
        rag.topologicalOrder.emplace_back(ragVert);
    }
}

#pragma region BUILD_BARRIERS
void buildBarriers(FrameGraphDispatcher &fgDispatcher) {
    auto *scratch = fgDispatcher.scratch;
    const auto &renderGraph = fgDispatcher.graph;
    const auto &layoutGraph = fgDispatcher.layoutGraph;
    auto &resourceGraph = fgDispatcher.resourceGraph;
    auto &relationGraph = fgDispatcher.relationGraph;
    auto &rag = fgDispatcher.resourceAccessGraph;

    // record resource current in-access and out-access for every single node
    if (!fgDispatcher._accessGraphBuilt) {
        const Graphs graphs{renderGraph, layoutGraph, resourceGraph, rag, relationGraph};
        buildAccessGraph(graphs);
        fgDispatcher._accessGraphBuilt = true;
    }

    auto getGFXBarrier = [&resourceGraph](const Barrier &barrier) {
        gfx::GFXObject *gfxBarrier{nullptr};
        const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, barrier.resourceID);
        if (desc.dimension == ResourceDimension::BUFFER) {
            gfx::BufferBarrierInfo info;
            info.prevAccesses = barrier.beginStatus.accessFlag;
            info.nextAccesses = barrier.endStatus.accessFlag;
            const auto &range = barrier.endStatus.range;
            info.offset = 0;
            info.size = range.depthOrArraySize;
            info.type = barrier.type;
            gfxBarrier = gfx::Device::getInstance()->getBufferBarrier(info);
        } else {
            gfx::TextureBarrierInfo info;
            info.prevAccesses = barrier.beginStatus.accessFlag;
            info.nextAccesses = barrier.endStatus.accessFlag;
            const auto &range = barrier.beginStatus.range;
            info.baseMipLevel = range.mipLevel;
            info.levelCount = range.levelCount;
            info.baseSlice = range.firstSlice;
            info.sliceCount = range.numSlices;
            info.type = barrier.type;
            gfxBarrier = gfx::Device::getInstance()->getTextureBarrier(info);
        }
        return gfxBarrier;
    };

    // found pass id in this map ? barriers you should commit when run into this pass
    // : or no extra barrier needed.
    for (auto &accessPair : rag.resourceAccess) {
        const auto &resName = accessPair.first;
        const auto &resID = rag.resourceIndex.at(resName);
        const auto &desc = get(ResourceGraph::DescTag{}, resourceGraph, resID);
        bool isBuffer = desc.dimension == ResourceDimension::BUFFER;

        if (rag.movedSourceStatus.find(resName) != rag.movedSourceStatus.end()) {
            // moved, history of this resource access will be copied to moved target.
            continue;
        }

        const auto &accessRecord = accessPair.second;
        auto iter = accessRecord.begin();
        for (auto nextIter = iter + 1; nextIter != accessRecord.end(); ++iter, ++nextIter) {
            auto srcRagVertID = iter->first;
            auto dstRagVertID = nextIter->first;
            auto srcPassID = get(ResourceAccessGraph::PassIDTag{}, rag, srcRagVertID);
            auto dstPassID = get(ResourceAccessGraph::PassIDTag{}, rag, dstRagVertID);

            if (holds<RasterPassTag>(dstPassID, renderGraph) || holds<RasterSubpassTag>(dstPassID, renderGraph)) {
                // renderpass info instead
                continue;
            }

            // subpass layout transition
            if ((srcRagVertID != 0) && (holds<RasterPassTag>(srcPassID, renderGraph) || holds<RasterSubpassTag>(srcPassID, renderGraph))) {
                auto ragVertID = srcRagVertID;
                if (holds<RasterSubpassTag>(srcPassID, renderGraph)) {
                    auto parentID = parent(srcPassID, renderGraph);
                    ragVertID = rag.passIndex.at(parentID);
                }
                // RenderPass Info
                auto &fgRenderPassInfo = get(ResourceAccessGraph::RenderPassInfoTag{}, rag, ragVertID);
                std::string_view resName = get(ResourceGraph::NameTag{}, resourceGraph, resID);
                auto colorIter = std::find(fgRenderPassInfo.orderedViews.begin(), fgRenderPassInfo.orderedViews.end(), resName);
                auto colorIndex = std::distance(fgRenderPassInfo.orderedViews.begin(), colorIter);
                if (colorIndex < fgRenderPassInfo.colorAccesses.size()) {
                    fgRenderPassInfo.colorAccesses[colorIndex].nextAccess = nextIter->second.accessFlag;
                } else if (colorIndex == fgRenderPassInfo.colorAccesses.size()) {
                    fgRenderPassInfo.dsAccess.nextAccess = nextIter->second.accessFlag;
                } else if (colorIndex == fgRenderPassInfo.colorAccesses.size() + 1) {
                    fgRenderPassInfo.dsResolveAccess.nextAccess = nextIter->second.accessFlag;
                }

                if (holds<RasterSubpassTag>(srcPassID, renderGraph) &&
                    accessDependent(iter->second.accessFlag, nextIter->second.accessFlag, isBuffer)) {
                    const auto* subpass = get_if<RasterSubpass>(srcPassID, &renderGraph);
                    CC_ASSERT(subpass);
                    auto subpassID = subpass->subpassID;
                    auto &dependency = fgRenderPassInfo.rpInfo.dependencies.emplace_back();
                    dependency.srcSubpass = subpass->subpassID;
                    dependency.dstSubpass = INVALID_ID;
                    dependency.prevAccesses = iter->second.accessFlag;
                    dependency.nextAccesses = nextIter->second.accessFlag;
                }
                continue;
            }

            // undefined access
            if (iter == accessRecord.begin()) {
                auto &dstBarrierNode = get(ResourceAccessGraph::BarrierTag{}, rag, dstRagVertID);
                auto &firstMeetBarrier = dstBarrierNode.frontBarriers.emplace_back();
                firstMeetBarrier.resourceID = resID;
                firstMeetBarrier.type = gfx::BarrierType::FULL;
                firstMeetBarrier.beginVert = dstPassID;
                firstMeetBarrier.endVert = dstPassID;
                firstMeetBarrier.beginStatus = iter->second;
                firstMeetBarrier.endStatus = nextIter->second;
                firstMeetBarrier.barrier = getGFXBarrier(firstMeetBarrier);
            } else if (accessDependent(iter->second.accessFlag, nextIter->second.accessFlag, isBuffer)) {
                auto &srcBarrierNode = get(ResourceAccessGraph::BarrierTag{}, rag, srcRagVertID);
                auto &beginBarrier = srcBarrierNode.rearBarriers.emplace_back();
                beginBarrier.resourceID = resID;
                beginBarrier.beginVert = srcPassID;
                beginBarrier.endVert = dstPassID;
                beginBarrier.beginStatus = iter->second;
                beginBarrier.endStatus = nextIter->second;
                if (isPassExecAdjecent(iter->first, nextIter->first)) {
                    beginBarrier.type = gfx::BarrierType::FULL;
                } else {
                    beginBarrier.type = gfx::BarrierType::SPLIT_BEGIN;

                    auto &dstBarrierNode = get(ResourceAccessGraph::BarrierTag{}, rag, dstRagVertID);
                    auto &endBarrier = dstBarrierNode.frontBarriers.emplace_back();
                    endBarrier.resourceID = resID;
                    endBarrier.type = gfx::BarrierType::SPLIT_END;
                    endBarrier.beginVert = srcPassID;
                    endBarrier.endVert = dstPassID;
                    endBarrier.beginStatus = iter->second;
                    endBarrier.endStatus = nextIter->second;
                    endBarrier.barrier = getGFXBarrier(endBarrier);
                }
                beginBarrier.barrier = getGFXBarrier(beginBarrier);
            }
        }
        const auto &traits = get(ResourceGraph::TraitsTag{}, resourceGraph, resID);
        auto &states = get(ResourceGraph::StatesTag{}, resourceGraph, resID);
        if (traits.hasSideEffects()) {
            states.states = iter->second.accessFlag;
            if (traits.residency == ResourceResidency::BACKBUFFER) {
                auto lastAccessPassID = get(ResourceAccessGraph::PassIDTag{}, rag, iter->first);
                auto &barrierNode = get(ResourceAccessGraph::BarrierTag{}, rag, iter->first);
                auto &presentBarrier = barrierNode.rearBarriers.emplace_back();
                presentBarrier.resourceID = resID;
                presentBarrier.type = gfx::BarrierType::FULL;
                presentBarrier.beginVert = lastAccessPassID;
                presentBarrier.endVert = lastAccessPassID;
                presentBarrier.beginStatus = iter->second;
                presentBarrier.endStatus = {gfx::AccessFlagBit::PRESENT, iter->second.range};
                presentBarrier.barrier = getGFXBarrier(presentBarrier);

                states.states = gfx::AccessFlagBit::NONE;
            }
        }
    }

    {
        for (auto &fgRenderpassInfo : rag.rpInfo) {
            auto &colorAttachments = fgRenderpassInfo.rpInfo.colorAttachments;
            for (uint32_t i = 0; i < colorAttachments.size(); ++i) {
                const auto &colorAccess = fgRenderpassInfo.colorAccesses[i];
                colorAttachments[i].barrier = getGeneralBarrier(cc::gfx::Device::getInstance(),
                                                                colorAccess.prevAccess,
                                                                colorAccess.nextAccess);
            }
            auto &dsAttachment = fgRenderpassInfo.rpInfo.depthStencilAttachment;
            if (dsAttachment.format != gfx::Format::UNKNOWN) {
                const auto &dsAccess = fgRenderpassInfo.dsAccess;
                dsAttachment.barrier = getGeneralBarrier(cc::gfx::Device::getInstance(),
                                                         dsAccess.prevAccess,
                                                         dsAccess.nextAccess);
            }
            auto &dsResolveAttachment = fgRenderpassInfo.rpInfo.depthStencilResolveAttachment;
            if (dsResolveAttachment.format != gfx::Format::UNKNOWN) {
                const auto &dsResolveAccess = fgRenderpassInfo.dsResolveAccess;
                dsResolveAttachment.barrier = getGeneralBarrier(cc::gfx::Device::getInstance(),
                                                                dsResolveAccess.prevAccess,
                                                                dsResolveAccess.nextAccess);
            }
        }
    }
}
#pragma endregion BUILD_BARRIERS

#pragma region PASS_REORDER

struct PassVisitor : boost::dfs_visitor<> {
    using RLGVertex = RelationGraph::vertex_descriptor;
    using RLGEdge = RelationGraph::edge_descriptor;
    using InEdgeRange = std::pair<RelationGraph::in_edge_iterator, RelationGraph::in_edge_iterator>;
    using OutEdgeRange = std::pair<RelationGraph::out_edge_iterator, RelationGraph::out_edge_iterator>;

    PassVisitor(RelationGraph &tcIn, CloseCircuits &circuitsIn) : _relationGraph(tcIn), _circuits(circuitsIn) {}

    void start_vertex(RLGVertex u, const RelationGraph &g) {}

    void discover_vertex(RLGVertex u, const RelationGraph &g) {}

    void examine_edge(RLGEdge e, const RelationGraph &g) {
    }

    void tree_edge(RLGEdge e, const RelationGraph &g) {}

    void back_edge(RLGEdge e, const RelationGraph &g) {}

    void forward_or_cross_edge(RLGEdge e, const RelationGraph &g) {
        // the vertex which:
        // 1. is ancestor of targetID;
        // 2. sourceID is reachable at this specific vert;
        // is where the closed-path started.
        // note that `reachable` may results to multiple paths, choose the shortest one.
        auto sourceID = source(e, g);
        auto targetID = target(e, g);

        using RhsRangePair = std::pair<RelationGraph::in_edge_iterator, InEdgeRange>;

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

        using LhsRangePair = std::pair<RelationGraph::out_edge_iterator, OutEdgeRange>;
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
    RelationGraph &_relationGraph;
    CloseCircuits &_circuits;
};

// forward (vertex ascending):
// -- true: how much resource this pass writes to, which has an effect of later passes;
// -- false: how much resource this pass reads from, which is dependent from former passes.
auto evaluateHeaviness(const ResourceAccessGraph &rag, const ResourceGraph &rescGraph, ResourceAccessGraph::vertex_descriptor vert, bool forward) {
    const ResourceAccessNode &accessNode = get(ResourceAccessGraph::PassNodeTag{}, rag, vert);
    int64_t score = 0;
    bool forceAdjacent = false;
    for (const auto &pair : accessNode.resourceStatus) {
        int64_t eval = 0;
        auto rescID = rag.resourceIndex.at(pair.first);
        const ResourceDesc &desc = get(ResourceGraph::DescTag{}, rescGraph, rescID);
        const ResourceTraits &traits = get(ResourceGraph::TraitsTag{}, rescGraph, rescID);

        const auto &resc = pair.second;
        if (!(isReadOnlyAccess(resc.accessFlag) ^ forward)) {
            // forward calculate write(s), backward calculate read(s).
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
    return std::make_tuple(forceAdjacent, score);
};

void evaluateAndTryMerge(const ResourceAccessGraph &rag, const ResourceGraph &rescGraph, RelationGraph &relationGraph, const RelationGraph &relationGraphTc, const RelationVerts &lhsVerts, const RelationVerts &rhsVerts) {
    assert(lhsVerts.size() >= 2);
    assert(rhsVerts.size() >= 2);

    auto evaluate = [&rag, &rescGraph, &relationGraph](RelationVert vert, bool forward) {
        auto ragVert = get(RelationGraph::DescIDTag{}, relationGraph, vert);
        return evaluateHeaviness(rag, rescGraph, ragVert, forward);
    };

    if (lhsVerts.size() == 2 || rhsVerts.size() == 2) {
        /*
               1 ----------- 2
                \       __--/
                 3 --``
            no extra choice, only 1 - 3 - 2
        */
        const RelationVerts *shorterPath = lhsVerts.size() == 2 ? &lhsVerts : &rhsVerts;
        remove_edge((*shorterPath)[0], (*shorterPath)[1], relationGraph);
    } else {
        // fist and last joint pass in this circuit don't get involved in reorder.
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
            const RelationVerts *formerPath = &lhsVerts;
            const RelationVerts *latterPath = &rhsVerts;
            if (rhsAdjacentToStart || lhsAdjacentToEnd) {
                swap(formerPath, latterPath);
            }

            remove_edge((*latterPath)[0], (*latterPath)[1], relationGraph);
            remove_edge((*formerPath)[formerPath->size() - 2], (*formerPath)[formerPath->size() - 1], relationGraph);

            tryAddEdge((*formerPath)[formerPath->size() - 2], (*latterPath)[1], relationGraph);
        }

        assert(lhsVerts.size() >= 3 && rhsVerts.size() >= 3);
        constexpr int64_t score = std::numeric_limits<int64_t>::lowest();
        ccstd::vector<std::queue<RelationEdge>> candidateSections;
        std::queue<RelationEdge> lhsSection;
        for (size_t i = 1; i < lhsVerts.size(); ++i) {
            auto tryE = edge(lhsVerts[i], lhsVerts[i - 1], relationGraphTc);
            auto tryRE = edge(lhsVerts[i - 1], lhsVerts[i], relationGraphTc);
            // check if original reachable
            if (!tryE.second && !tryRE.second) {
                remove_edge(lhsVerts[i - 1], lhsVerts[i], relationGraph);
                candidateSections.emplace_back(lhsSection);
                std::queue<RelationEdge> clearQ;
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

        std::queue<RelationEdge> rhsSection;
        for (size_t i = 1; i < rhsVerts.size(); ++i) {
            auto tryE = edge(rhsVerts[i], rhsVerts[i - 1], relationGraphTc);
            auto tryRE = edge(rhsVerts[i - 1], rhsVerts[i], relationGraphTc);
            if (!tryE.second && !tryRE.second) {
                remove_edge(rhsVerts[i - 1], rhsVerts[i], relationGraph);
                candidateSections.emplace_back(rhsSection);
                std::queue<RelationEdge> clearQ;
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
                if (scMap.find(dstVert) == scMap.end()) {
                    auto res = evaluate(dstVert, false);
                    dstForwardScore = std::get<1>(res);
                    res = evaluate(dstVert, true);
                    auto dstBackwardScore = std::get<1>(res);
                    scMap.emplace(dstVert, std::pair<int64_t, int64_t>(dstBackwardScore, dstForwardScore));
                } else {
                    dstForwardScore = std::get<1>(scMap.at(dstVert));
                }

                // we are in a simple path, so all the "input(this path)" resource of this path come from the first vertex,
                // all the "output(this path)" come to the last vertex, other resources are "internally(this path)" produced and destroyed.
                // so only input of first vertex and output of last vertex are taken into account.
                // [simple path]: path without diverged edges.
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
bool reduce(const ResourceAccessGraph &rag, const ResourceGraph &rescGraph, RelationGraph &relationGraph, RelationGraph &relationGraphTc, const CloseCircuit &circuit) {
    auto checkPath = [&relationGraph](std::stack<RelationGraph::vertex_descriptor> &vertices, RelationGraph::vertex_descriptor endVert, RelationVerts &stackTrace) {
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

    std::stack<RelationGraph::vertex_descriptor> vertices;
    vertices.emplace(startVert);

    RelationVerts lhsVisited;
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

    RelationVerts rhsVisited;
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
    const auto &renderGraph = fgDispatcher.graph;
    const auto &layoutGraph = fgDispatcher.layoutGraph;
    auto &resourceGraph = fgDispatcher.resourceGraph;
    auto &relationGraph = fgDispatcher.relationGraph;
    auto &rag = fgDispatcher.resourceAccessGraph;

    if (!fgDispatcher._accessGraphBuilt) {
        const Graphs graphs{renderGraph, layoutGraph, resourceGraph, rag, relationGraph};
        buildAccessGraph(graphs);
        fgDispatcher._accessGraphBuilt = true;
    }

    {
        // determine do mem saving how many times
        RelationGraph relationGraphTc(fgDispatcher.get_allocator());
        boost::transitive_closure(relationGraph, relationGraphTc);

        CloseCircuits circuits;
        std::vector<ResourceAccessGraph::edge_descriptor> crossEdges;
        PassVisitor visitor(relationGraphTc, circuits);
        auto colors = relationGraph.colors(scratch);
        boost::depth_first_search(relationGraph, visitor, get(colors, relationGraph));

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
        rag.topologicalOrder.clear();
        bool empty = relationGraph._vertices.empty();
        ScoreMap scoreMap;
        RelationVerts candidates;
        candidates.push_back(EXPECT_START_ID);

        std::vector<RelationVert> candidateBuffer;
        uint32_t coloredVerts = 0;
        while (coloredVerts < relationGraph._vertices.size()) {
            // decreasing order, pop back from vector, push into queue, then it's ascending order.
            std::sort(candidates.begin(), candidates.end(), [&](RelationVert lhsVert, RelationVert rhsVert) {
                int64_t lhsForwardScore{0};
                int64_t rhsForwardScore{0};
                int64_t lhsBackwardScore{0};
                int64_t rhsBackwardScore{0};
                if (scoreMap.find(lhsVert) == scoreMap.end()) {
                    auto lhsRagVert = get(RelationGraph::DescIDTag{}, relationGraph, lhsVert);
                    const auto &lhsForwardStatus = evaluateHeaviness(rag, resourceGraph, lhsRagVert, true);
                    lhsForwardScore = get<1>(lhsForwardStatus);
                    const auto &lhsBackwardStatus = evaluateHeaviness(rag, resourceGraph, lhsRagVert, false);
                    lhsBackwardScore = get<1>(lhsBackwardStatus);
                    scoreMap.emplace(lhsVert, std::pair<int64_t, int64_t>{lhsBackwardScore, lhsForwardScore});
                } else {
                    lhsBackwardScore = scoreMap[lhsVert].first;
                    lhsForwardScore = scoreMap[lhsVert].second;
                }

                if (scoreMap.find(rhsVert) == scoreMap.end()) {
                    auto rhsRagVert = get(RelationGraph::DescIDTag{}, relationGraph, rhsVert);
                    const auto &rhsForwardStatus = evaluateHeaviness(rag, resourceGraph, rhsRagVert, true);
                    rhsForwardScore = get<1>(rhsForwardStatus);
                    const auto &rhsBackwardStatus = evaluateHeaviness(rag, resourceGraph, rhsRagVert, false);
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

            auto ragVert = get(RelationGraph::DescIDTag{}, relationGraph, vert);
            rag.topologicalOrder.emplace_back(ragVert);
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

        // remove all edges
        for (auto vert : makeRange(vertices(rag))) {
            clear_in_edges(vert, rag);
            clear_out_edges(vert, rag);
        }

        // apply relation
        for (auto rlgVert : makeRange(vertices(relationGraph))) {
            auto ragVert = get(RelationGraph::DescIDTag{}, relationGraph, rlgVert);
            auto inEdges = in_edges(rlgVert, relationGraph);
            for (auto e : makeRange(inEdges)) {
                auto srcRlgVert = source(e, relationGraph);
                auto srcRagVert = get(RelationGraph::DescIDTag{}, relationGraph, srcRlgVert);
                add_edge(srcRagVert, ragVert, rag);
            }
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

bool isTransitionStatusDependent(const AccessStatus &lhs, const AccessStatus &rhs) {
    return !(isReadOnlyAccess(lhs.accessFlag) && isReadOnlyAccess(rhs.accessFlag));
}

bool isDefaultAttachment(const PmrString &name) {
    return name.empty() || name == "_";
}

bool isDefaultDepthStencilAttachment(const PmrString &name, const PmrString &name1) {
    return (name.empty() || name == "_") && (name1.empty() || name1 == "_");
}

#pragma endregion assisstantFuncDefinition

} // namespace render

} // namespace cc
