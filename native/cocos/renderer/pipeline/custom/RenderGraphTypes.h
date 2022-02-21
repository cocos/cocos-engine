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

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated.
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */
// clang-format off
#pragma once
#include <boost/container/pmr/vector.hpp>
#include <boost/graph/adjacency_iterator.hpp>
#include <boost/graph/graph_traits.hpp>
#include <boost/graph/properties.hpp>
#include <boost/range/irange.hpp>
#include "cocos/renderer/gfx-base/GFXBuffer.h"
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/gfx-base/GFXTexture.h"
#include "cocos/renderer/gfx-base/states/GFXSampler.h"
#include "cocos/renderer/pipeline/PipelineSceneData.h"
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"
#include "cocos/renderer/pipeline/custom/String.h"
#include "cocos/scene/Camera.h"

namespace cc {

namespace render {

enum class ResourceFlags : uint32_t {
    NONE = 0,
    ALLOW_RENDER_TARGET = 0x1,
    ALLOW_DEPTH_STENCIL = 0x2,
    ALLOW_UNORDERED_ACCESS = 0x4,
    DENY_SHADER_RESOURCE = 0x8,
    ALLOW_CROSS_ADAPTER = 0x10,
    ALLOW_SIMULTANEOUS_ACCESS = 0x20,
    VIDEO_DECODE_REFERENCE_ONLY = 0x40,
};

constexpr ResourceFlags operator|(const ResourceFlags lhs, const ResourceFlags rhs) noexcept {
    return static_cast<ResourceFlags>(static_cast<uint32_t>(lhs) | static_cast<uint32_t>(rhs));
}

constexpr ResourceFlags operator&(const ResourceFlags lhs, const ResourceFlags rhs) noexcept {
    return static_cast<ResourceFlags>(static_cast<uint32_t>(lhs) & static_cast<uint32_t>(rhs));
}

constexpr ResourceFlags& operator|=(ResourceFlags& lhs, const ResourceFlags rhs) noexcept {
    return lhs = lhs | rhs;
}

constexpr ResourceFlags& operator&=(ResourceFlags& lhs, const ResourceFlags rhs) noexcept {
    return lhs = lhs & rhs;
}

constexpr bool operator!(ResourceFlags e) noexcept {
    return e == static_cast<ResourceFlags>(0);
}

constexpr bool any(ResourceFlags e) noexcept {
    return !!e;
}

enum class TextureLayout {
    UNKNOWN,
    ROW_MAJOR,
    UNDEFINED_SWIZZLE,
    STANDARD_SWIZZLE,
};

struct ResourceDesc {
    ResourceDimension dimension{ResourceDimension::BUFFER};
    uint32_t          alignment{0};
    uint32_t          width{0};
    uint32_t          height{0};
    uint16_t          depthOrArraySize{0};
    uint16_t          mipLevels{0};
    gfx::Format       format{gfx::Format::UNKNOWN};
    gfx::SampleCount  sampleCount{gfx::SampleCount::ONE};
    TextureLayout     layout{TextureLayout::UNKNOWN};
    ResourceFlags     flags{ResourceFlags::NONE};
};

struct ResourceTraits {
    ResourceTraits() = default;
    ResourceTraits(ResourceResidency residencyIn) noexcept // NOLINT
    : residency(residencyIn) {}

    bool hasSideEffects() const noexcept {
        return boost::variant2::holds_alternative<PersistentTag>(residency) ||
               boost::variant2::holds_alternative<BackbufferTag>(residency);
    }

    ResourceResidency residency;
};

struct ResourceGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    ResourceGraph(const allocator_type& alloc) noexcept; // NOLINT
    ResourceGraph(ResourceGraph&& rhs, const allocator_type& alloc);
    ResourceGraph(ResourceGraph const& rhs, const allocator_type& alloc);

    ResourceGraph(ResourceGraph&& rhs) noexcept = default;
    ResourceGraph(ResourceGraph const& rhs)     = delete;
    ResourceGraph& operator=(ResourceGraph&& rhs) = default;
    ResourceGraph& operator=(ResourceGraph const& rhs) = default;

    // Graph
    using directed_category      = boost::bidirectional_tag;
    using vertex_descriptor      = uint32_t;
    using edge_descriptor        = impl::EdgeDescriptor<directed_category, vertex_descriptor>;
    using edge_parallel_category = boost::allow_parallel_edge_tag;
    struct traversal_category // NOLINT
    : virtual boost::incidence_graph_tag,
      virtual boost::bidirectional_graph_tag,
      virtual boost::adjacency_graph_tag,
      virtual boost::vertex_list_graph_tag,
      virtual boost::edge_list_graph_tag {};

    constexpr static vertex_descriptor null_vertex() noexcept { // NOLINT
        return std::numeric_limits<vertex_descriptor>::max();
    }

    // IncidenceGraph
    using out_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        boost::container::pmr::vector<out_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using in_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        boost::container::pmr::vector<in_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        ResourceGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(vertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, ResourceGraph>;
    using edges_size_type = uint32_t;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct vertex_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {outEdges.get_allocator().resource()};
        }

        vertex_type(const allocator_type& alloc) noexcept; // NOLINT
        vertex_type(vertex_type&& rhs, const allocator_type& alloc);
        vertex_type(vertex_type const& rhs, const allocator_type& alloc);

        vertex_type(vertex_type&& rhs) noexcept = default;
        vertex_type(vertex_type const& rhs)     = delete;
        vertex_type& operator=(vertex_type&& rhs) = default;
        vertex_type& operator=(vertex_type const& rhs) = default;

        boost::container::pmr::vector<out_edge_type> outEdges;
        boost::container::pmr::vector<in_edge_type>  inEdges;
    };

    struct NameTag {
    } static constexpr Name{}; // NOLINT
    struct DescTag {
    } static constexpr Desc{}; // NOLINT
    struct TraitsTag {
    } static constexpr Traits{}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> vertices;
    // Components
    boost::container::pmr::vector<PmrString>      names;
    boost::container::pmr::vector<ResourceDesc>   descs;
    boost::container::pmr::vector<ResourceTraits> traits;
    // UuidGraph
    PmrUnorderedMap<PmrString, vertex_descriptor> valueIndex;
};

enum class AttachmentType {
    RENDER_TARGET,
    DEPTH_STENCIL,
};

enum class AccessType {
    READ,
    READ_WRITE,
    WRITE,
};

struct RasterView {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {slotName.get_allocator().resource()};
    }

    RasterView(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    RasterView(PmrString slotNameIn, AccessType accessTypeIn, AttachmentType attachmentTypeIn, gfx::LoadOp loadOpIn, gfx::StoreOp storeOpIn, gfx::ClearFlagBit clearFlagsIn, gfx::Color clearColorIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    RasterView(RasterView&& rhs, const allocator_type& alloc);
    RasterView(RasterView const& rhs, const allocator_type& alloc);

    RasterView(RasterView&& rhs) noexcept = default;
    RasterView(RasterView const& rhs)     = delete;
    RasterView& operator=(RasterView&& rhs) = default;
    RasterView& operator=(RasterView const& rhs) = default;

    PmrString         slotName;
    AccessType        accessType{AccessType::WRITE};
    AttachmentType    attachmentType{AttachmentType::RENDER_TARGET};
    gfx::LoadOp       loadOp{gfx::LoadOp::LOAD};
    gfx::StoreOp      storeOp{gfx::StoreOp::STORE};
    gfx::ClearFlagBit clearFlags{gfx::ClearFlagBit::ALL};
    gfx::Color        clearColor;
};

enum class ClearValueType {
    FLOAT_TYPE,
    INT_TYPE,
};

struct ComputeView {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    ComputeView(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    ComputeView(ComputeView&& rhs, const allocator_type& alloc);
    ComputeView(ComputeView const& rhs, const allocator_type& alloc);

    ComputeView(ComputeView&& rhs) noexcept = default;
    ComputeView(ComputeView const& rhs)     = delete;
    ComputeView& operator=(ComputeView&& rhs) = default;
    ComputeView& operator=(ComputeView const& rhs) = default;

    bool isRead() const {
        return accessType != AccessType::WRITE;
    }
    bool isWrite() const {
        return accessType != AccessType::READ;
    }

    PmrString         name;
    AccessType        accessType{AccessType::READ};
    gfx::ClearFlagBit clearFlags{gfx::ClearFlagBit::NONE};
    gfx::Color        clearColor;
    ClearValueType    clearValueType{ClearValueType::FLOAT_TYPE};
};

struct RasterSubpass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rasterViews.get_allocator().resource()};
    }

    RasterSubpass(const allocator_type& alloc) noexcept; // NOLINT
    RasterSubpass(RasterSubpass&& rhs, const allocator_type& alloc);
    RasterSubpass(RasterSubpass const& rhs, const allocator_type& alloc);

    RasterSubpass(RasterSubpass&& rhs) noexcept = default;
    RasterSubpass(RasterSubpass const& rhs)     = delete;
    RasterSubpass& operator=(RasterSubpass&& rhs) = default;
    RasterSubpass& operator=(RasterSubpass const& rhs) = default;

    PmrTransparentMap<PmrString, RasterView>                                 rasterViews;
    PmrTransparentMap<PmrString, boost::container::pmr::vector<ComputeView>> computeViews;
};

struct SubpassGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    SubpassGraph(const allocator_type& alloc) noexcept; // NOLINT
    SubpassGraph(SubpassGraph&& rhs, const allocator_type& alloc);
    SubpassGraph(SubpassGraph const& rhs, const allocator_type& alloc);

    SubpassGraph(SubpassGraph&& rhs) noexcept = default;
    SubpassGraph(SubpassGraph const& rhs)     = delete;
    SubpassGraph& operator=(SubpassGraph&& rhs) = default;
    SubpassGraph& operator=(SubpassGraph const& rhs) = default;

    // Graph
    using directed_category      = boost::bidirectional_tag;
    using vertex_descriptor      = uint32_t;
    using edge_descriptor        = impl::EdgeDescriptor<directed_category, vertex_descriptor>;
    using edge_parallel_category = boost::allow_parallel_edge_tag;
    struct traversal_category // NOLINT
    : virtual boost::incidence_graph_tag,
      virtual boost::bidirectional_graph_tag,
      virtual boost::adjacency_graph_tag,
      virtual boost::vertex_list_graph_tag,
      virtual boost::edge_list_graph_tag {};

    constexpr static vertex_descriptor null_vertex() noexcept { // NOLINT
        return std::numeric_limits<vertex_descriptor>::max();
    }

    // IncidenceGraph
    using out_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        boost::container::pmr::vector<out_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using in_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        boost::container::pmr::vector<in_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        SubpassGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(vertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, SubpassGraph>;
    using edges_size_type = uint32_t;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct vertex_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {outEdges.get_allocator().resource()};
        }

        vertex_type(const allocator_type& alloc) noexcept; // NOLINT
        vertex_type(vertex_type&& rhs, const allocator_type& alloc);
        vertex_type(vertex_type const& rhs, const allocator_type& alloc);

        vertex_type(vertex_type&& rhs) noexcept = default;
        vertex_type(vertex_type const& rhs)     = delete;
        vertex_type& operator=(vertex_type&& rhs) = default;
        vertex_type& operator=(vertex_type const& rhs) = default;

        boost::container::pmr::vector<out_edge_type> outEdges;
        boost::container::pmr::vector<in_edge_type>  inEdges;
    };

    struct NameTag {
    } static constexpr Name{}; // NOLINT
    struct SubpassTag {
    } static constexpr Subpass{}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> vertices;
    // Components
    boost::container::pmr::vector<PmrString>     names;
    boost::container::pmr::vector<RasterSubpass> subpasses;
};

struct RasterPass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rasterViews.get_allocator().resource()};
    }

    RasterPass(const allocator_type& alloc) noexcept; // NOLINT
    RasterPass(RasterPass&& rhs, const allocator_type& alloc);
    RasterPass(RasterPass const& rhs, const allocator_type& alloc);

    RasterPass(RasterPass&& rhs) noexcept = default;
    RasterPass(RasterPass const& rhs)     = delete;
    RasterPass& operator=(RasterPass&& rhs) = default;
    RasterPass& operator=(RasterPass const& rhs) = default;

    PmrTransparentMap<PmrString, RasterView>                                 rasterViews;
    PmrTransparentMap<PmrString, boost::container::pmr::vector<ComputeView>> computeViews;
    SubpassGraph                                                             subpassGraph;
};

struct ComputePass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {computeViews.get_allocator().resource()};
    }

    ComputePass(const allocator_type& alloc) noexcept; // NOLINT
    ComputePass(ComputePass&& rhs, const allocator_type& alloc);
    ComputePass(ComputePass const& rhs, const allocator_type& alloc);

    ComputePass(ComputePass&& rhs) noexcept = default;
    ComputePass(ComputePass const& rhs)     = delete;
    ComputePass& operator=(ComputePass&& rhs) = default;
    ComputePass& operator=(ComputePass const& rhs) = default;

    PmrTransparentMap<PmrString, boost::container::pmr::vector<ComputeView>> computeViews;
};

struct CopyPair {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {source.get_allocator().resource()};
    }

    CopyPair(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    CopyPair(PmrString sourceIn, PmrString targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t sourceMostDetailedMipIn, uint32_t sourceFirstSliceIn, uint32_t sourcePlaneSliceIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    CopyPair(CopyPair&& rhs, const allocator_type& alloc);
    CopyPair(CopyPair const& rhs, const allocator_type& alloc);

    CopyPair(CopyPair&& rhs) noexcept = default;
    CopyPair(CopyPair const& rhs)     = delete;
    CopyPair& operator=(CopyPair&& rhs) = default;
    CopyPair& operator=(CopyPair const& rhs) = default;

    PmrString source;
    PmrString target;
    uint32_t  mipLevels{0xFFFFFFFF};
    uint32_t  numSlices{0xFFFFFFFF};
    uint32_t  sourceMostDetailedMip{0};
    uint32_t  sourceFirstSlice{0};
    uint32_t  sourcePlaneSlice{0};
    uint32_t  targetMostDetailedMip{0};
    uint32_t  targetFirstSlice{0};
    uint32_t  targetPlaneSlice{0};
};

struct CopyPass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {copyPairs.get_allocator().resource()};
    }

    CopyPass(const allocator_type& alloc) noexcept; // NOLINT
    CopyPass(CopyPass&& rhs, const allocator_type& alloc);
    CopyPass(CopyPass const& rhs, const allocator_type& alloc);

    CopyPass(CopyPass&& rhs) noexcept = default;
    CopyPass(CopyPass const& rhs)     = delete;
    CopyPass& operator=(CopyPass&& rhs) = default;
    CopyPass& operator=(CopyPass const& rhs) = default;

    boost::container::pmr::vector<CopyPair> copyPairs;
};

struct MovePair {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {source.get_allocator().resource()};
    }

    MovePair(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    MovePair(PmrString sourceIn, PmrString targetIn, uint32_t mipLevelsIn, uint32_t numSlicesIn, uint32_t targetMostDetailedMipIn, uint32_t targetFirstSliceIn, uint32_t targetPlaneSliceIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    MovePair(MovePair&& rhs, const allocator_type& alloc);
    MovePair(MovePair const& rhs, const allocator_type& alloc);

    MovePair(MovePair&& rhs) noexcept = default;
    MovePair(MovePair const& rhs)     = delete;
    MovePair& operator=(MovePair&& rhs) = default;
    MovePair& operator=(MovePair const& rhs) = default;

    PmrString source;
    PmrString target;
    uint32_t  mipLevels{0xFFFFFFFF};
    uint32_t  numSlices{0xFFFFFFFF};
    uint32_t  targetMostDetailedMip{0};
    uint32_t  targetFirstSlice{0};
    uint32_t  targetPlaneSlice{0};
};

struct MovePass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {movePairs.get_allocator().resource()};
    }

    MovePass(const allocator_type& alloc) noexcept; // NOLINT
    MovePass(MovePass&& rhs, const allocator_type& alloc);
    MovePass(MovePass const& rhs, const allocator_type& alloc);

    MovePass(MovePass&& rhs) noexcept = default;
    MovePass(MovePass const& rhs)     = delete;
    MovePass& operator=(MovePass&& rhs) = default;
    MovePass& operator=(MovePass const& rhs) = default;

    boost::container::pmr::vector<MovePair> movePairs;
};

struct RaytracePass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {computeViews.get_allocator().resource()};
    }

    RaytracePass(const allocator_type& alloc) noexcept; // NOLINT
    RaytracePass(RaytracePass&& rhs, const allocator_type& alloc);
    RaytracePass(RaytracePass const& rhs, const allocator_type& alloc);

    RaytracePass(RaytracePass&& rhs) noexcept = default;
    RaytracePass(RaytracePass const& rhs)     = delete;
    RaytracePass& operator=(RaytracePass&& rhs) = default;
    RaytracePass& operator=(RaytracePass const& rhs) = default;

    PmrTransparentMap<PmrString, boost::container::pmr::vector<ComputeView>> computeViews;
};

struct QueueTag {};
struct SceneTag {};
struct DispatchTag {};
struct BlitTag {};
struct PresentTag {};

struct RenderQueue {
    RenderQueue() = default;
    RenderQueue(QueueHint hintIn) noexcept // NOLINT
    : hint(hintIn) {}

    QueueHint hint{QueueHint::RENDER_OPAQUE};
};

struct SceneData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    SceneData(const allocator_type& alloc) noexcept; // NOLINT
    SceneData(PmrString nameIn, const allocator_type& alloc) noexcept;
    SceneData(SceneData&& rhs, const allocator_type& alloc);
    SceneData(SceneData const& rhs, const allocator_type& alloc);

    SceneData(SceneData&& rhs) noexcept = default;
    SceneData(SceneData const& rhs)     = delete;
    SceneData& operator=(SceneData&& rhs) = default;
    SceneData& operator=(SceneData const& rhs) = default;

    PmrString                                name;
    scene::Camera*                           camera{nullptr};
    boost::container::pmr::vector<PmrString> scenes;
};

struct Dispatch {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {shader.get_allocator().resource()};
    }

    Dispatch(const allocator_type& alloc) noexcept; // NOLINT
    Dispatch(PmrString shaderIn, uint32_t threadGroupCountXIn, uint32_t threadGroupCountYIn, uint32_t threadGroupCountZIn, const allocator_type& alloc) noexcept;
    Dispatch(Dispatch&& rhs, const allocator_type& alloc);
    Dispatch(Dispatch const& rhs, const allocator_type& alloc);

    Dispatch(Dispatch&& rhs) noexcept = default;
    Dispatch(Dispatch const& rhs)     = delete;
    Dispatch& operator=(Dispatch&& rhs) = default;
    Dispatch& operator=(Dispatch const& rhs) = default;

    PmrString shader;
    uint32_t  threadGroupCountX{0};
    uint32_t  threadGroupCountY{0};
    uint32_t  threadGroupCountZ{0};
};

struct Blit {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {shader.get_allocator().resource()};
    }

    Blit(const allocator_type& alloc) noexcept; // NOLINT
    Blit(PmrString shaderIn, const allocator_type& alloc) noexcept;
    Blit(Blit&& rhs, const allocator_type& alloc);
    Blit(Blit const& rhs, const allocator_type& alloc);

    Blit(Blit&& rhs) noexcept = default;
    Blit(Blit const& rhs)     = delete;
    Blit& operator=(Blit&& rhs) = default;
    Blit& operator=(Blit const& rhs) = default;

    PmrString shader;
};

struct PresentPass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {resourceName.get_allocator().resource()};
    }

    PresentPass(const allocator_type& alloc) noexcept; // NOLINT
    PresentPass(PmrString resourceNameIn, uint32_t syncIntervalIn, uint32_t flagsIn, const allocator_type& alloc) noexcept;
    PresentPass(PresentPass&& rhs, const allocator_type& alloc);
    PresentPass(PresentPass const& rhs, const allocator_type& alloc);

    PresentPass(PresentPass&& rhs) noexcept = default;
    PresentPass(PresentPass const& rhs)     = delete;
    PresentPass& operator=(PresentPass&& rhs) = default;
    PresentPass& operator=(PresentPass const& rhs) = default;

    PmrString resourceName;
    uint32_t  syncInterval{0};
    uint32_t  flags{0};
};

struct RenderData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {constants.get_allocator().resource()};
    }

    RenderData(const allocator_type& alloc) noexcept; // NOLINT
    RenderData(RenderData&& rhs, const allocator_type& alloc);

    RenderData(RenderData&& rhs) noexcept = default;
    RenderData(RenderData const& rhs)     = delete;
    RenderData& operator=(RenderData&& rhs) = default;
    RenderData& operator=(RenderData const& rhs) = delete;

    PmrUnorderedMap<uint32_t, boost::container::pmr::vector<uint8_t>> constants;
    PmrUnorderedMap<uint32_t, std::unique_ptr<gfx::Buffer>>           buffers;
    PmrUnorderedMap<uint32_t, std::unique_ptr<gfx::Texture>>          textures;
    PmrUnorderedMap<uint32_t, std::unique_ptr<gfx::Sampler>>          samplers;
};

struct RenderGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {objects.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    RenderGraph(const allocator_type& alloc) noexcept; // NOLINT
    RenderGraph(RenderGraph&& rhs, const allocator_type& alloc);

    RenderGraph(RenderGraph&& rhs) noexcept = default;
    RenderGraph(RenderGraph const& rhs)     = delete;
    RenderGraph& operator=(RenderGraph&& rhs) = default;
    RenderGraph& operator=(RenderGraph const& rhs) = delete;

    // Graph
    using directed_category      = boost::bidirectional_tag;
    using vertex_descriptor      = uint32_t;
    using edge_descriptor        = impl::EdgeDescriptor<directed_category, vertex_descriptor>;
    using edge_parallel_category = boost::allow_parallel_edge_tag;
    struct traversal_category // NOLINT
    : virtual boost::incidence_graph_tag,
      virtual boost::bidirectional_graph_tag,
      virtual boost::adjacency_graph_tag,
      virtual boost::vertex_list_graph_tag,
      virtual boost::edge_list_graph_tag {};

    constexpr static vertex_descriptor null_vertex() noexcept { // NOLINT
        return std::numeric_limits<vertex_descriptor>::max();
    }

    // IncidenceGraph
    using out_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        boost::container::pmr::vector<out_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using in_edge_type     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        boost::container::pmr::vector<in_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        RenderGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& getInEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(vertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, RenderGraph>;
    using edges_size_type = uint32_t;

    // AddressableGraph (Separated)
    using ownership_descriptor = impl::EdgeDescriptor<boost::bidirectional_tag, vertex_descriptor>;

    using children_edge_type = impl::StoredEdge<vertex_descriptor>;
    using children_iterator  = impl::OutEdgeIter<
        boost::container::pmr::vector<children_edge_type>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;
    using children_size_type = uint32_t;

    using parent_edge_type = impl::StoredEdge<vertex_descriptor>;
    using parent_iterator  = impl::InEdgeIter<
        boost::container::pmr::vector<parent_edge_type>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;

    using ownership_iterator   = impl::OwnershipIterator<vertex_iterator, children_iterator, RenderGraph>;
    using ownerships_size_type = edges_size_type;

    // AddressableGraph help functions
    inline boost::container::pmr::vector<children_edge_type>& getChildrenList(vertex_descriptor v) noexcept {
        return objects[v].children;
    }
    inline const boost::container::pmr::vector<children_edge_type>& getChildrenList(vertex_descriptor v) const noexcept {
        return objects[v].children;
    }

    inline boost::container::pmr::vector<parent_edge_type>& getParentsList(vertex_descriptor v) noexcept {
        return objects[v].parents;
    }
    inline const boost::container::pmr::vector<parent_edge_type>& getParentsList(vertex_descriptor v) const noexcept {
        return objects[v].parents;
    }

    // PolymorphicGraph
    using vertex_tag_type         = boost::variant2::variant<RasterTag, ComputeTag, CopyTag, MoveTag, PresentTag, RaytraceTag, QueueTag, SceneTag, BlitTag, DispatchTag>;
    using vertex_value_type       = boost::variant2::variant<RasterPass*, ComputePass*, CopyPass*, MovePass*, PresentPass*, RaytracePass*, RenderQueue*, SceneData*, Blit*, Dispatch*>;
    using vertex_const_value_type = boost::variant2::variant<const RasterPass*, const ComputePass*, const CopyPass*, const MovePass*, const PresentPass*, const RaytracePass*, const RenderQueue*, const SceneData*, const Blit*, const Dispatch*>;
    using vertex_handle_type      = boost::variant2::variant<
        impl::ValueHandle<RasterTag, vertex_descriptor>,
        impl::ValueHandle<ComputeTag, vertex_descriptor>,
        impl::ValueHandle<CopyTag, vertex_descriptor>,
        impl::ValueHandle<MoveTag, vertex_descriptor>,
        impl::ValueHandle<PresentTag, vertex_descriptor>,
        impl::ValueHandle<RaytraceTag, vertex_descriptor>,
        impl::ValueHandle<QueueTag, vertex_descriptor>,
        impl::ValueHandle<SceneTag, vertex_descriptor>,
        impl::ValueHandle<BlitTag, vertex_descriptor>,
        impl::ValueHandle<DispatchTag, vertex_descriptor>>;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct object_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {children.get_allocator().resource()};
        }

        object_type(const allocator_type& alloc) noexcept; // NOLINT
        object_type(object_type&& rhs, const allocator_type& alloc);
        object_type(object_type const& rhs, const allocator_type& alloc);

        object_type(object_type&& rhs) noexcept = default;
        object_type(object_type const& rhs)     = delete;
        object_type& operator=(object_type&& rhs) = default;
        object_type& operator=(object_type const& rhs) = default;

        boost::container::pmr::vector<children_edge_type> children;
        boost::container::pmr::vector<parent_edge_type>   parents;
    };

    struct vertex_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {outEdges.get_allocator().resource()};
        }

        vertex_type(const allocator_type& alloc) noexcept; // NOLINT
        vertex_type(vertex_type&& rhs, const allocator_type& alloc);
        vertex_type(vertex_type const& rhs, const allocator_type& alloc);

        vertex_type(vertex_type&& rhs) noexcept = default;
        vertex_type(vertex_type const& rhs)     = delete;
        vertex_type& operator=(vertex_type&& rhs) = default;
        vertex_type& operator=(vertex_type const& rhs) = default;

        boost::container::pmr::vector<out_edge_type> outEdges;
        boost::container::pmr::vector<in_edge_type>  inEdges;
        vertex_handle_type                           handle;
    };

    struct NameTag {
    } static constexpr Name{}; // NOLINT
    struct LayoutTag {
    } static constexpr Layout{}; // NOLINT
    struct DataTag {
    } static constexpr Data{}; // NOLINT

    // Owners
    boost::container::pmr::vector<object_type> objects;
    // Vertices
    boost::container::pmr::vector<vertex_type> vertices;
    // Components
    boost::container::pmr::vector<PmrString>  names;
    boost::container::pmr::vector<PmrString>  layoutNodes;
    boost::container::pmr::vector<RenderData> data;
    // PolymorphicGraph
    boost::container::pmr::vector<RasterPass>   rasterPasses;
    boost::container::pmr::vector<ComputePass>  computePasses;
    boost::container::pmr::vector<CopyPass>     copyPasses;
    boost::container::pmr::vector<MovePass>     movePasses;
    boost::container::pmr::vector<PresentPass>  presentPasses;
    boost::container::pmr::vector<RaytracePass> raytracePasses;
    boost::container::pmr::vector<RenderQueue>  renderQueues;
    boost::container::pmr::vector<SceneData>    scenes;
    boost::container::pmr::vector<Blit>         blits;
    boost::container::pmr::vector<Dispatch>     dispatches;
    // Members
    PmrUnorderedMap<PmrString, uint32_t> index;
};

} // namespace render

} // namespace cc

// clang-format on
