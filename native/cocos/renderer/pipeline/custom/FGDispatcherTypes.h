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
#include <boost/graph/adjacency_iterator.hpp>
#include <boost/graph/graph_traits.hpp>
#include <boost/graph/properties.hpp>
#include <boost/range/irange.hpp>
#include <variant>
#include "cocos/base/std/container/string.h"
#include "cocos/base/std/container/vector.h"
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {

namespace render {

struct NullTag {};

struct BufferRange {
    uint32_t offset{0};
    uint32_t size{0};
};

inline bool operator<(const BufferRange& lhs, const BufferRange& rhs) noexcept {
    return std::forward_as_tuple(lhs.offset, lhs.size) <
           std::forward_as_tuple(rhs.offset, rhs.size);
}

struct TextureRange {
    uint32_t firstSlice{0};
    uint32_t numSlices{1};
    uint32_t mipLevel{0};
    uint32_t levelCount{1};
};

inline bool operator<(const TextureRange& lhs, const TextureRange& rhs) noexcept {
    return std::forward_as_tuple(lhs.firstSlice, lhs.numSlices, lhs.mipLevel, lhs.levelCount) <
           std::forward_as_tuple(rhs.firstSlice, rhs.numSlices, rhs.mipLevel, rhs.levelCount);
}

using Range = ccstd::variant<BufferRange, TextureRange>;

struct AccessStatus {
    uint32_t vertID{0xFFFFFFFF};
    gfx::ShaderStageFlagBit visibility{gfx::ShaderStageFlagBit::NONE};
    gfx::MemoryAccessBit access{gfx::MemoryAccessBit::NONE};
    gfx::PassType passType{gfx::PassType::RASTER};
    Range range;
};

struct ResourceTransition {
    AccessStatus lastStatus;
    AccessStatus currStatus;
};

struct ResourceAccessNode {
    std::vector<AccessStatus> attachemntStatus;
    struct ResourceAccessNode* nextSubpass{nullptr};
};

struct ResourceAccessGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    ResourceAccessGraph(const allocator_type& alloc) noexcept; // NOLINT
    ResourceAccessGraph(ResourceAccessGraph&& rhs) = delete;
    ResourceAccessGraph(ResourceAccessGraph const& rhs) = delete;
    ResourceAccessGraph& operator=(ResourceAccessGraph&& rhs) = delete;
    ResourceAccessGraph& operator=(ResourceAccessGraph const& rhs) = delete;

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
    using OutEdge     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        ccstd::pmr::vector<OutEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using InEdge     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        ccstd::pmr::vector<InEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        ResourceAccessGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(vertices.size());
    }

    inline ccstd::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return ccstd::pmr::vector<boost::default_color_type>(vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, ResourceAccessGraph>;
    using edges_size_type = uint32_t;

    ~ResourceAccessGraph() {
        for (auto& node : access) {
            auto* resNode = node.nextSubpass;
            node.nextSubpass = nullptr;
            while(resNode) {
                auto* oldResNode = resNode;
                resNode = resNode->nextSubpass;
                oldResNode->nextSubpass = nullptr;
                delete oldResNode;
            }
        }
    }


    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct Vertex {
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {outEdges.get_allocator().resource()};
        }

        Vertex(const allocator_type& alloc) noexcept; // NOLINT
        Vertex(Vertex&& rhs, const allocator_type& alloc);
        Vertex(Vertex const& rhs, const allocator_type& alloc);

        Vertex(Vertex&& rhs) noexcept = default;
        Vertex(Vertex const& rhs) = delete;
        Vertex& operator=(Vertex&& rhs) = default;
        Vertex& operator=(Vertex const& rhs) = default;

        ccstd::pmr::vector<OutEdge> outEdges;
        ccstd::pmr::vector<InEdge> inEdges;
    };

    struct PassIDTag {
    } static constexpr PassID{}; // NOLINT
    struct AccessNodeTag {
    } static constexpr AccessNode{}; // NOLINT

    // Vertices
    ccstd::pmr::vector<Vertex> vertices;
    // Components
    ccstd::pmr::vector<RenderGraph::vertex_descriptor> passID;
    ccstd::pmr::vector<ResourceAccessNode> access;
    // UuidGraph
    PmrUnorderedMap<RenderGraph::vertex_descriptor, vertex_descriptor> passIndex;
    // Members
    ccstd::pmr::vector<ccstd::pmr::string> resourceNames;
    PmrUnorderedStringMap<ccstd::pmr::string, uint32_t> resourceIndex;
    RenderGraph::vertex_descriptor presentPassID{0xFFFFFFFF};
    ccstd::pmr::vector<RenderGraph::vertex_descriptor> externalPasses;
    PmrFlatMap<uint32_t, ResourceTransition> accessRecord;
};

struct EmptyGraph {
    EmptyGraph() = default;
    EmptyGraph(EmptyGraph&& rhs) = delete;
    EmptyGraph(EmptyGraph const& rhs) = delete;
    EmptyGraph& operator=(EmptyGraph&& rhs) = delete;
    EmptyGraph& operator=(EmptyGraph const& rhs) = delete;

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
    using OutEdge     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        std::vector<OutEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using InEdge     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        std::vector<InEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        EmptyGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline std::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const std::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline std::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const std::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(vertices.size());
    }

    inline ccstd::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return ccstd::pmr::vector<boost::default_color_type>(vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, EmptyGraph>;
    using edges_size_type = uint32_t;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct Vertex {
        std::vector<OutEdge> outEdges;
        std::vector<InEdge> inEdges;
    };
    // Vertices
    std::vector<Vertex> vertices;
};

struct Barrier {
    RenderGraph::vertex_descriptor resourceID{0xFFFFFFFF};
    gfx::BarrierType type{gfx::BarrierType::FULL};
    AccessStatus beginStatus;
    AccessStatus endStatus;
};

struct BarrierPair {
    std::vector<Barrier> frontBarriers;
    std::vector<Barrier> rearBarriers;
};

struct BarrierNode {
    BarrierPair blockBarrier;
    std::vector<BarrierPair> subpassBarriers;
};

struct FrameGraphDispatcher {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {resourceAccessGraph.get_allocator().resource()};
    }

    FrameGraphDispatcher(ResourceGraph& resourceGraphIn, RenderGraph& graphIn, LayoutGraphData& layoutGraphIn, boost::container::pmr::memory_resource* scratchIn, const allocator_type& alloc) noexcept;
    FrameGraphDispatcher(FrameGraphDispatcher&& rhs) = delete;
    FrameGraphDispatcher(FrameGraphDispatcher const& rhs) = delete;
    FrameGraphDispatcher& operator=(FrameGraphDispatcher&& rhs) = delete;
    FrameGraphDispatcher& operator=(FrameGraphDispatcher const& rhs) = delete;

    using BarrierMap = FlatMap<ResourceAccessGraph::vertex_descriptor, BarrierNode>;

    void enablePassReorder(bool enable);

    // how much paralell-execution weights during pass reorder,
    // eg:0.3 means 30% of effort aim to paralellize execution, other 70% aim to decrease memory using.
    // 0 by default 
    void setParalellWeight(float paralellExecWeight);

    void enableMemoryAliasing(bool enable);

    void run();

    inline const BarrierMap& getBarriers() const { return barrierMap; }

    BarrierMap barrierMap;

    ResourceAccessGraph resourceAccessGraph;
    ResourceGraph& resourceGraph;
    RenderGraph& graph;
    LayoutGraphData& layoutGraph;
    boost::container::pmr::memory_resource* scratch{nullptr};
    PmrFlatMap<ccstd::pmr::string, ResourceTransition> externalResMap;
    EmptyGraph relationGraph;
    bool _enablePassReorder{false};
    bool _enableAutoBarrier{true};
    bool _enableMemoryAliasing{false};
    bool _accessGraphBuilt{false};
    float _paralellExecWeight{0.0F};
};

} // namespace render

} // namespace cc

// clang-format on
