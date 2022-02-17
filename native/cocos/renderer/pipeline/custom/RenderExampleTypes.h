// clang-format off
#pragma once
#include <boost/container/pmr/vector.hpp>
#include <boost/graph/adjacency_iterator.hpp>
#include <boost/graph/graph_traits.hpp>
#include <boost/graph/properties.hpp>
#include <boost/range/irange.hpp>
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderExampleFwd.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Set.h"
#include "cocos/renderer/pipeline/custom/String.h"

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
        return {mOutputs.get_allocator().resource()};
    }

    RenderPassNode(const allocator_type& alloc) noexcept; // NOLINT
    RenderPassNode(RenderPassNode&& rhs, const allocator_type& alloc);
    RenderPassNode(RenderPassNode const& rhs, const allocator_type& alloc);

    RenderPassNode(RenderPassNode&& rhs) noexcept = default;
    RenderPassNode(RenderPassNode const& rhs)     = delete;
    RenderPassNode& operator=(RenderPassNode&& rhs) = default;
    RenderPassNode& operator=(RenderPassNode const& rhs) = default;

    PmrFlatSet<uint32_t> mOutputs;
    PmrFlatSet<uint32_t> mInputs;
};

struct RenderPassTraits {
    bool mKeep = false;
};

struct RenderDependencyGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {mVertices.get_allocator().resource()};
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
    using out_edge_type = impl::StoredEdgeWithEdgeIter<
        vertex_descriptor,
        PmrList<edge_type>::iterator,
        DependencyType>;
    using out_edge_iterator = impl::OutPropertyEdgeIter<
        boost::container::pmr::vector<out_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using in_edge_type = impl::StoredEdgeWithEdgeIter<
        vertex_descriptor,
        PmrList<edge_type>::iterator,
        DependencyType>;
    using in_edge_iterator = impl::InPropertyEdgeIter<
        boost::container::pmr::vector<in_edge_type>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        RenderDependencyGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return mVertices[v].mOutEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return mVertices[v].mOutEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return mVertices[v].mInEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return mVertices[v].mInEdges;
    }

    inline boost::integer_range<vertex_descriptor> vertex_set() const noexcept { // NOLINT
        return {0, static_cast<vertices_size_type>(mVertices.size())};
    }

    inline vertex_descriptor current_id() const noexcept { // NOLINT
        return static_cast<vertex_descriptor>(mVertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(mVertices.size(), mr);
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
    struct vertex_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {mOutEdges.get_allocator().resource()};
        }

        vertex_type(const allocator_type& alloc) noexcept; // NOLINT
        vertex_type(vertex_type&& rhs, const allocator_type& alloc);
        vertex_type(vertex_type const& rhs, const allocator_type& alloc);

        vertex_type(vertex_type&& rhs) noexcept = default;
        vertex_type(vertex_type const& rhs)     = delete;
        vertex_type& operator=(vertex_type&& rhs) = default;
        vertex_type& operator=(vertex_type const& rhs) = default;

        boost::container::pmr::vector<out_edge_type> mOutEdges;
        boost::container::pmr::vector<in_edge_type>  mInEdges;
    };

    struct pass_ { // NOLINT
    } static constexpr pass = {}; // NOLINT
    struct valueID_ { // NOLINT
    } static constexpr valueID = {}; // NOLINT
    struct passID_ { // NOLINT
    } static constexpr passID = {}; // NOLINT
    struct traits_ { // NOLINT
    } static constexpr traits = {}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> mVertices;
    // Components
    boost::container::pmr::vector<RenderPassNode>                 mPasses;
    boost::container::pmr::vector<PmrFlatSet<uint32_t>>           mValueIDs;
    boost::container::pmr::vector<RenderGraph::vertex_descriptor> mPassIDs;
    boost::container::pmr::vector<RenderPassTraits>               mTraits;
    // Edges
    PmrList<edge_type> mEdges;
    // UuidGraph
    PmrUnorderedMap<RenderGraph::vertex_descriptor, vertex_descriptor> mPassIndex;
    // Members
    PmrUnorderedMap<PmrString, uint32_t>                            mValueIndex;
    boost::container::pmr::vector<PmrString>                        mValueNames;
    boost::container::pmr::vector<ResourceGraph::vertex_descriptor> mResourceHandles;
};

struct RenderValueNode {
    RenderValueNode() = default;
    RenderValueNode(uint32_t passID, uint32_t valueID) noexcept // NOLINT
    : mPassID(passID),
      mValueID(valueID) {}

    uint32_t mPassID  = 0xFFFFFFFF;
    uint32_t mValueID = 0xFFFFFFFF;
};

inline bool operator==(const RenderValueNode& lhs, const RenderValueNode& rhs) noexcept {
    return std::forward_as_tuple(lhs.mPassID, lhs.mValueID) ==
           std::forward_as_tuple(rhs.mPassID, rhs.mValueID);
}

inline bool operator!=(const RenderValueNode& lhs, const RenderValueNode& rhs) noexcept {
    return !(lhs == rhs);
}

struct RenderValueGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {mVertices.get_allocator().resource()};
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
        RenderValueGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return mVertices[v].mOutEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return mVertices[v].mOutEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return mVertices[v].mInEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return mVertices[v].mInEdges;
    }

    inline boost::integer_range<vertex_descriptor> vertex_set() const noexcept { // NOLINT
        return {0, static_cast<vertices_size_type>(mVertices.size())};
    }

    inline vertex_descriptor current_id() const noexcept { // NOLINT
        return static_cast<vertex_descriptor>(mVertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(mVertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, RenderValueGraph>;
    using edges_size_type = uint32_t;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct vertex_type { // NOLINT
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {mOutEdges.get_allocator().resource()};
        }

        vertex_type(const allocator_type& alloc) noexcept; // NOLINT
        vertex_type(vertex_type&& rhs, const allocator_type& alloc);
        vertex_type(vertex_type const& rhs, const allocator_type& alloc);

        vertex_type(vertex_type&& rhs) noexcept = default;
        vertex_type(vertex_type const& rhs)     = delete;
        vertex_type& operator=(vertex_type&& rhs) = default;
        vertex_type& operator=(vertex_type const& rhs) = default;

        boost::container::pmr::vector<out_edge_type> mOutEdges;
        boost::container::pmr::vector<in_edge_type>  mInEdges;
    };

    struct node_ { // NOLINT
    } static constexpr node = {}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> mVertices;
    // Components
    boost::container::pmr::vector<RenderValueNode> mNodes;
    // UuidGraph
    PmrUnorderedMap<RenderValueNode, vertex_descriptor> mIndex;
};

struct RenderCompiler {
    RenderCompiler(ResourceGraph& resourceGraph, RenderGraph& graph, LayoutGraph& layoutGraph, boost::container::pmr::memory_resource* scratch) noexcept
    : mResourceGraph(resourceGraph),
      mGraph(graph),
      mLayoutGraph(layoutGraph),
      mScratch(scratch) {}
    RenderCompiler(RenderCompiler&& rhs)      = delete;
    RenderCompiler(RenderCompiler const& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler&& rhs) = delete;
    RenderCompiler& operator=(RenderCompiler const& rhs) = delete;

    int validate() const;
    int audit(std::ostream& oss) const;
    int compile();

    ResourceGraph&                          mResourceGraph;
    RenderGraph&                            mGraph;
    LayoutGraph&                            mLayoutGraph;
    boost::container::pmr::memory_resource* mScratch = nullptr;
};

} // namespace example

} // namespace render

} // namespace cc

namespace std {

inline size_t hash<cc::render::example::RenderValueNode>::operator()(const cc::render::example::RenderValueNode& v) const noexcept {
    size_t seed = 0;
    boost::hash_combine(seed, v.mPassID);
    boost::hash_combine(seed, v.mValueID);
    return seed;
}

} // namespace std
