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
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderExecutorFwd.h"

namespace cc {

namespace render {

struct DeviceResourceGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    DeviceResourceGraph(const allocator_type& alloc) noexcept; // NOLINT
    DeviceResourceGraph(DeviceResourceGraph&& rhs)      = delete;
    DeviceResourceGraph(DeviceResourceGraph const& rhs) = delete;
    DeviceResourceGraph& operator=(DeviceResourceGraph&& rhs) = delete;
    DeviceResourceGraph& operator=(DeviceResourceGraph const& rhs) = delete;

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
        DeviceResourceGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return this->vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& out_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return this->vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) noexcept { // NOLINT
        return this->vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& in_edge_list(vertex_descriptor v) const noexcept { // NOLINT
        return this->vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> vertex_set() const noexcept { // NOLINT
        return {0, static_cast<vertices_size_type>(this->vertices.size())};
    }

    inline vertex_descriptor current_id() const noexcept { // NOLINT
        return static_cast<vertex_descriptor>(this->vertices.size());
    }

    inline boost::container::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return boost::container::pmr::vector<boost::default_color_type>(this->vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, DeviceResourceGraph>;
    using edges_size_type = uint32_t;

    // PolymorphicGraph
    using vertex_tag_type         = boost::variant2::variant<Buffer_, Texture_>;
    using vertex_value_type       = boost::variant2::variant<std::unique_ptr<gfx::Buffer>*, std::unique_ptr<gfx::Texture>*>;
    using vertex_const_value_type = boost::variant2::variant<const std::unique_ptr<gfx::Buffer>*, const std::unique_ptr<gfx::Texture>*>;
    using vertex_handle_type      = boost::variant2::variant<
        impl::ValueHandle<Buffer_, vertex_descriptor>,
        impl::ValueHandle<Texture_, vertex_descriptor>>;

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
        vertex_handle_type                           handle;
    };

    struct Name_ { // NOLINT
    } static constexpr Name = {}; // NOLINT
    struct RefCount_ { // NOLINT
    } static constexpr RefCount = {}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> vertices;
    // Components
    boost::container::pmr::vector<std::string> names;
    boost::container::pmr::vector<int32_t>     refCounts;
    // PolymorphicGraph
    boost::container::pmr::vector<std::unique_ptr<gfx::Buffer>>  buffers;
    boost::container::pmr::vector<std::unique_ptr<gfx::Texture>> textures;
};

} // namespace render

} // namespace cc
