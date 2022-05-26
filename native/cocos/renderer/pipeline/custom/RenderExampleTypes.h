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
#include "cocos/base/std/container/string.h"
#include "cocos/base/std/container/vector.h"
#include "cocos/base/std/hash/hash.h"
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderExampleFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Set.h"

namespace cc {

namespace render {

namespace example {

enum class DependencyType {
    ORDER,
    DATA,
};

struct RenderPassNode {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {outputs.get_allocator().resource()};
    }

    RenderPassNode(const allocator_type& alloc) noexcept; // NOLINT
    RenderPassNode(RenderPassNode&& rhs, const allocator_type& alloc);
    RenderPassNode(RenderPassNode const& rhs, const allocator_type& alloc);

    RenderPassNode(RenderPassNode&& rhs) noexcept = default;
    RenderPassNode(RenderPassNode const& rhs)     = delete;
    RenderPassNode& operator=(RenderPassNode&& rhs) = default;
    RenderPassNode& operator=(RenderPassNode const& rhs) = default;

    PmrFlatSet<uint32_t> outputs;
    PmrFlatSet<uint32_t> inputs;
};

struct RenderPassTraits {
    bool keep{false};
};

struct RenderDependencyGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    RenderDependencyGraph(const allocator_type& alloc) noexcept; // NOLINT
    RenderDependencyGraph(RenderDependencyGraph&& rhs)      = delete;
    RenderDependencyGraph(RenderDependencyGraph const& rhs) = delete;
    RenderDependencyGraph& operator=(RenderDependencyGraph&& rhs) = delete;
    RenderDependencyGraph& operator=(RenderDependencyGraph const& rhs) = delete;

    // Graph
    using directed_category      = boost::bidirectional_tag;
    using vertex_descriptor      = uint32_t;
    using edge_descriptor        = impl::EdgeDescriptorWithProperty<directed_category, vertex_descriptor>;
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
    using edge_type = impl::ListEdge<vertex_descriptor, DependencyType>;

    // IncidenceGraph
    using OutEdge = impl::StoredEdgeWithEdgeIter<
        vertex_descriptor,
        PmrList<edge_type>::iterator,
        DependencyType>;
    using out_edge_iterator = impl::OutPropertyEdgeIter<
        ccstd::pmr::vector<OutEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using InEdge = impl::StoredEdgeWithEdgeIter<
        vertex_descriptor,
        PmrList<edge_type>::iterator,
        DependencyType>;
    using in_edge_iterator = impl::InPropertyEdgeIter<
        ccstd::pmr::vector<InEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        RenderDependencyGraph, vertex_descriptor, out_edge_iterator>::type;

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
    using edge_iterator = impl::UndirectedEdgeIter<
        PmrList<edge_type>::iterator,
        edge_descriptor, int32_t>;
    using edges_size_type = uint32_t;

    using edge_property_type = DependencyType;

    // PropertyGraph (Edge)
    const edge_property_type& operator[](const edge_descriptor& e) const noexcept {
        return *static_cast<edge_property_type*>(e.get_property());
    }
    edge_property_type& operator[](const edge_descriptor& e) noexcept {
        return *static_cast<edge_property_type*>(e.get_property());
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
        Vertex(Vertex const& rhs)     = delete;
        Vertex& operator=(Vertex&& rhs) = default;
        Vertex& operator=(Vertex const& rhs) = default;

        ccstd::pmr::vector<OutEdge> outEdges;
        ccstd::pmr::vector<InEdge>  inEdges;
    };

    struct PassTag {
    } static constexpr Pass{}; // NOLINT
    struct ValueIDTag {
    } static constexpr ValueID{}; // NOLINT
    struct PassIDTag {
    } static constexpr PassID{}; // NOLINT
    struct TraitsTag {
    } static constexpr Traits{}; // NOLINT

    // Vertices
    ccstd::pmr::vector<Vertex> vertices;
    // Components
    ccstd::pmr::vector<RenderPassNode>                 passes;
    ccstd::pmr::vector<PmrFlatSet<uint32_t>>           valueIDs;
    ccstd::pmr::vector<RenderGraph::vertex_descriptor> passIDs;
    ccstd::pmr::vector<RenderPassTraits>               traits;
    // Edges
    PmrList<edge_type> edges;
    // UuidGraph
    PmrUnorderedMap<RenderGraph::vertex_descriptor, vertex_descriptor> passIndex;
    // Members
    PmrUnorderedStringMap<ccstd::pmr::string, uint32_t>  valueIndex;
    ccstd::pmr::vector<ccstd::pmr::string>               valueNames;
    ccstd::pmr::vector<ResourceGraph::vertex_descriptor> resourceHandles;
};

struct RenderValueNode {
    RenderValueNode() = default;
    RenderValueNode(uint32_t passIDIn, uint32_t valueIDIn) noexcept // NOLINT
    : passID(passIDIn),
      valueID(valueIDIn) {}

    uint32_t passID{0xFFFFFFFF};
    uint32_t valueID{0xFFFFFFFF};
};

inline bool operator==(const RenderValueNode& lhs, const RenderValueNode& rhs) noexcept {
    return std::forward_as_tuple(lhs.passID, lhs.valueID) ==
           std::forward_as_tuple(rhs.passID, rhs.valueID);
}

inline bool operator!=(const RenderValueNode& lhs, const RenderValueNode& rhs) noexcept {
    return !(lhs == rhs);
}

struct RenderValueGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    RenderValueGraph(const allocator_type& alloc) noexcept; // NOLINT
    RenderValueGraph(RenderValueGraph&& rhs)      = delete;
    RenderValueGraph(RenderValueGraph const& rhs) = delete;
    RenderValueGraph& operator=(RenderValueGraph&& rhs) = delete;
    RenderValueGraph& operator=(RenderValueGraph const& rhs) = delete;

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
        RenderValueGraph, vertex_descriptor, out_edge_iterator>::type;

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
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, RenderValueGraph>;
    using edges_size_type = uint32_t;

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
        Vertex(Vertex const& rhs)     = delete;
        Vertex& operator=(Vertex&& rhs) = default;
        Vertex& operator=(Vertex const& rhs) = default;

        ccstd::pmr::vector<OutEdge> outEdges;
        ccstd::pmr::vector<InEdge>  inEdges;
    };

    struct NodeTag {
    } static constexpr Node{}; // NOLINT

    // Vertices
    ccstd::pmr::vector<Vertex> vertices;
    // Components
    ccstd::pmr::vector<RenderValueNode> nodes;
    // UuidGraph
    PmrUnorderedMap<RenderValueNode, vertex_descriptor> index;
};

struct RenderCompiler {
    RenderCompiler(ResourceGraph& resourceGraphIn, RenderGraph& graphIn, LayoutGraphData& layoutGraphIn, boost::container::pmr::memory_resource* scratchIn) noexcept
    : resourceGraph(resourceGraphIn),
      graph(graphIn),
      layoutGraph(layoutGraphIn),
      scratch(scratchIn) {}
    RenderCompiler(RenderCompiler&& rhs)      = delete;
    RenderCompiler(RenderCompiler const& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler&& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler const& rhs) = delete;

    int validate() const;
    int audit(std::ostream& oss) const;
    int compile();

    ResourceGraph&                          resourceGraph;
    RenderGraph&                            graph;
    LayoutGraphData&                        layoutGraph;
    boost::container::pmr::memory_resource* scratch{nullptr};
};

} // namespace example

} // namespace render

} // namespace cc

namespace std {

inline size_t hash<cc::render::example::RenderValueNode>::operator()(const cc::render::example::RenderValueNode& v) const noexcept {
    ccstd::hash_t seed = 0;
    ccstd::hash_combine(seed, v.passID);
    ccstd::hash_combine(seed, v.valueID);
    return static_cast<size_t>(seed);
}

} // namespace std

// clang-format on
