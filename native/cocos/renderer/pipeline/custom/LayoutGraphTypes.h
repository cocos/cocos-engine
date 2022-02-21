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
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

struct Constant {
    ValueType type;
    uint32_t  valueID{0xFFFFFFFF};
};

struct ConstantBuffer {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {constants.get_allocator().resource()};
    }

    ConstantBuffer(const allocator_type& alloc) noexcept; // NOLINT
    ConstantBuffer(ConstantBuffer&& rhs, const allocator_type& alloc);
    ConstantBuffer(ConstantBuffer const& rhs, const allocator_type& alloc);

    ConstantBuffer(ConstantBuffer&& rhs) noexcept = default;
    ConstantBuffer(ConstantBuffer const& rhs)     = delete;
    ConstantBuffer& operator=(ConstantBuffer&& rhs) = default;
    ConstantBuffer& operator=(ConstantBuffer const& rhs) = default;

    uint32_t                                size{0};
    boost::container::pmr::vector<Constant> constants;
};

using DescriptorType = boost::variant2::variant<CBuffer_, RWBuffer_, RWTexture_, Buffer_, Texture_, Sampler_>;

inline bool operator<(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return !(lhs == rhs);
}

struct DescriptorBlock {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {attributeIDs.get_allocator().resource()};
    }

    DescriptorBlock(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorBlock(DescriptorBlock&& rhs, const allocator_type& alloc);
    DescriptorBlock(DescriptorBlock const& rhs, const allocator_type& alloc);

    DescriptorBlock(DescriptorBlock&& rhs) noexcept = default;
    DescriptorBlock(DescriptorBlock const& rhs)     = delete;
    DescriptorBlock& operator=(DescriptorBlock&& rhs) = default;
    DescriptorBlock& operator=(DescriptorBlock const& rhs) = default;

    DescriptorType                          type;
    uint32_t                                capacity{0};
    boost::container::pmr::vector<uint32_t> attributeIDs;
};

struct DescriptorArray {
    uint32_t capacity{0};
    uint32_t attributeID{0xFFFFFFFF};
};

struct UnboundedDescriptor {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptors.get_allocator().resource()};
    }

    UnboundedDescriptor(const allocator_type& alloc) noexcept; // NOLINT
    UnboundedDescriptor(UnboundedDescriptor&& rhs, const allocator_type& alloc);
    UnboundedDescriptor(UnboundedDescriptor const& rhs, const allocator_type& alloc);

    UnboundedDescriptor(UnboundedDescriptor&& rhs) noexcept = default;
    UnboundedDescriptor(UnboundedDescriptor const& rhs)     = delete;
    UnboundedDescriptor& operator=(UnboundedDescriptor&& rhs) = default;
    UnboundedDescriptor& operator=(UnboundedDescriptor const& rhs) = default;

    DescriptorType                                 type;
    boost::container::pmr::vector<DescriptorArray> descriptors;
};

struct DescriptorTable {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {blocks.get_allocator().resource()};
    }

    DescriptorTable(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorTable(DescriptorTable&& rhs, const allocator_type& alloc);
    DescriptorTable(DescriptorTable const& rhs, const allocator_type& alloc);

    DescriptorTable(DescriptorTable&& rhs) noexcept = default;
    DescriptorTable(DescriptorTable const& rhs)     = delete;
    DescriptorTable& operator=(DescriptorTable&& rhs) = default;
    DescriptorTable& operator=(DescriptorTable const& rhs) = default;

    uint32_t                                       slot{0};
    uint32_t                                       capacity{0};
    boost::container::pmr::vector<DescriptorBlock> blocks;
};

struct DescriptorSet {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {tables.get_allocator().resource()};
    }

    DescriptorSet(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorSet(DescriptorSet&& rhs, const allocator_type& alloc);
    DescriptorSet(DescriptorSet const& rhs, const allocator_type& alloc);

    DescriptorSet(DescriptorSet&& rhs) noexcept = default;
    DescriptorSet(DescriptorSet const& rhs)     = delete;
    DescriptorSet& operator=(DescriptorSet&& rhs) = default;
    DescriptorSet& operator=(DescriptorSet const& rhs) = default;

    boost::container::pmr::vector<DescriptorTable> tables;
    UnboundedDescriptor                            unbounded;
};

struct LayoutData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {constantBuffers.get_allocator().resource()};
    }

    LayoutData(const allocator_type& alloc) noexcept; // NOLINT
    LayoutData(LayoutData&& rhs, const allocator_type& alloc);
    LayoutData(LayoutData const& rhs, const allocator_type& alloc);

    LayoutData(LayoutData&& rhs) noexcept = default;
    LayoutData(LayoutData const& rhs)     = delete;
    LayoutData& operator=(LayoutData&& rhs) = default;
    LayoutData& operator=(LayoutData const& rhs) = default;

    PmrTransparentMap<ParameterType, ConstantBuffer> constantBuffers;
    PmrTransparentMap<ParameterType, DescriptorSet>  descriptorSets;
};

struct ShaderProgramData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {layouts.get_allocator().resource()};
    }

    ShaderProgramData(const allocator_type& alloc) noexcept; // NOLINT
    ShaderProgramData(ShaderProgramData&& rhs, const allocator_type& alloc);
    ShaderProgramData(ShaderProgramData const& rhs, const allocator_type& alloc);

    ShaderProgramData(ShaderProgramData&& rhs) noexcept = default;
    ShaderProgramData(ShaderProgramData const& rhs)     = delete;
    ShaderProgramData& operator=(ShaderProgramData&& rhs) = default;
    ShaderProgramData& operator=(ShaderProgramData const& rhs) = default;

    PmrTransparentMap<UpdateFrequency, LayoutData> layouts;
};

struct GroupNodeData {
    GroupNodeData() = default;
    GroupNodeData(NodeType nodeTypeIn) noexcept // NOLINT
    : nodeType(nodeTypeIn) {}

    NodeType nodeType{NodeType::INTERNAL};
};

struct ShaderNodeData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {shaderPrograms.get_allocator().resource()};
    }

    ShaderNodeData(const allocator_type& alloc) noexcept; // NOLINT
    ShaderNodeData(ShaderNodeData&& rhs, const allocator_type& alloc);
    ShaderNodeData(ShaderNodeData const& rhs, const allocator_type& alloc);

    ShaderNodeData(ShaderNodeData&& rhs) noexcept = default;
    ShaderNodeData(ShaderNodeData const& rhs)     = delete;
    ShaderNodeData& operator=(ShaderNodeData&& rhs) = default;
    ShaderNodeData& operator=(ShaderNodeData const& rhs) = default;

    std::string                                      rootSignature;
    boost::container::pmr::vector<ShaderProgramData> shaderPrograms;
    PmrTransparentMap<std::string, uint32_t>         shaderIndex;
};

struct Group_ {};
struct Shader_ {};

struct LayoutGraphData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    LayoutGraphData(const allocator_type& alloc) noexcept; // NOLINT
    LayoutGraphData(LayoutGraphData&& rhs, const allocator_type& alloc);
    LayoutGraphData(LayoutGraphData const& rhs, const allocator_type& alloc);

    LayoutGraphData(LayoutGraphData&& rhs) noexcept = default;
    LayoutGraphData(LayoutGraphData const& rhs)     = delete;
    LayoutGraphData& operator=(LayoutGraphData&& rhs) = default;
    LayoutGraphData& operator=(LayoutGraphData const& rhs) = default;

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
        LayoutGraphData, vertex_descriptor, out_edge_iterator>::type;

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
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, LayoutGraphData>;
    using edges_size_type = uint32_t;

    // AddressableGraph (Alias)
    using ownership_descriptor = impl::EdgeDescriptor<boost::bidirectional_tag, vertex_descriptor>;

    using children_edge_type = out_edge_type;
    using children_iterator  = impl::OutEdgeIter<
        boost::container::pmr::vector<out_edge_type>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;
    using children_size_type = uint32_t;

    using parent_edge_type = in_edge_type;
    using parent_iterator  = impl::InEdgeIter<
        boost::container::pmr::vector<in_edge_type>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;

    using ownership_iterator   = impl::DirectedEdgeIterator<vertex_iterator, children_iterator, LayoutGraphData>;
    using ownerships_size_type = edges_size_type;

    // AddressableGraph help functions
    inline boost::container::pmr::vector<out_edge_type>& getChildrenList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<out_edge_type>& getChildrenList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<in_edge_type>& getParentsList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<in_edge_type>& getParentsList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    // PolymorphicGraph
    using vertex_tag_type         = boost::variant2::variant<Group_, Shader_>;
    using vertex_value_type       = boost::variant2::variant<GroupNodeData*, ShaderNodeData*>;
    using vertex_const_value_type = boost::variant2::variant<const GroupNodeData*, const ShaderNodeData*>;
    using vertex_handle_type      = boost::variant2::variant<
        impl::ValueHandle<Group_, vertex_descriptor>,
        impl::ValueHandle<Shader_, vertex_descriptor>>;

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
    struct Update_ { // NOLINT
    } static constexpr Update = {}; // NOLINT
    struct Layout_ { // NOLINT
    } static constexpr Layout = {}; // NOLINT

    // Vertices
    boost::container::pmr::vector<vertex_type> vertices;
    // Components
    boost::container::pmr::vector<std::string>     names;
    boost::container::pmr::vector<UpdateFrequency> updateFrequencies;
    boost::container::pmr::vector<LayoutData>      layouts;
    // PolymorphicGraph
    boost::container::pmr::vector<GroupNodeData>  groupNodes;
    boost::container::pmr::vector<ShaderNodeData> shaderNodes;
    // Path
    PmrTransparentMap<std::string, vertex_descriptor> pathIndex;
};

} // namespace render

} // namespace cc

// clang-format on
