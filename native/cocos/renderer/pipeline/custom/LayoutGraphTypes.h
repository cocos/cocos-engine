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
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"

namespace cc {

namespace render {

struct ConstantData {
    ValueType type;
    uint32_t  valueID{0xFFFFFFFF};
};

struct ConstantBufferData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {constants.get_allocator().resource()};
    }

    ConstantBufferData(const allocator_type& alloc) noexcept; // NOLINT
    ConstantBufferData(ConstantBufferData&& rhs, const allocator_type& alloc);
    ConstantBufferData(ConstantBufferData const& rhs, const allocator_type& alloc);

    ConstantBufferData(ConstantBufferData&& rhs) noexcept = default;
    ConstantBufferData(ConstantBufferData const& rhs)     = delete;
    ConstantBufferData& operator=(ConstantBufferData&& rhs) = default;
    ConstantBufferData& operator=(ConstantBufferData const& rhs) = default;

    uint32_t                                    size{0};
    boost::container::pmr::vector<ConstantData> constants;
};

using DescriptorType = boost::variant2::variant<CBufferTag, RWBufferTag, RWTextureTag, BufferTag, TextureTag, SamplerTag>;

inline bool operator<(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return lhs.index() < rhs.index();
}

inline bool operator==(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return lhs.index() == rhs.index();
}

inline bool operator!=(const DescriptorType& lhs, const DescriptorType& rhs) noexcept {
    return !(lhs == rhs);
}

struct DescriptorBlockData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {attributeIDs.get_allocator().resource()};
    }

    DescriptorBlockData(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorBlockData(DescriptorBlockData&& rhs, const allocator_type& alloc);
    DescriptorBlockData(DescriptorBlockData const& rhs, const allocator_type& alloc);

    DescriptorBlockData(DescriptorBlockData&& rhs) noexcept = default;
    DescriptorBlockData(DescriptorBlockData const& rhs)     = delete;
    DescriptorBlockData& operator=(DescriptorBlockData&& rhs) = default;
    DescriptorBlockData& operator=(DescriptorBlockData const& rhs) = default;

    DescriptorType                          type;
    uint32_t                                capacity{0};
    boost::container::pmr::vector<uint32_t> attributeIDs;
};

struct DescriptorArrayData {
    uint32_t capacity{0};
    uint32_t attributeID{0xFFFFFFFF};
};

struct UnboundedDescriptorData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptors.get_allocator().resource()};
    }

    UnboundedDescriptorData(const allocator_type& alloc) noexcept; // NOLINT
    UnboundedDescriptorData(UnboundedDescriptorData&& rhs, const allocator_type& alloc);
    UnboundedDescriptorData(UnboundedDescriptorData const& rhs, const allocator_type& alloc);

    UnboundedDescriptorData(UnboundedDescriptorData&& rhs) noexcept = default;
    UnboundedDescriptorData(UnboundedDescriptorData const& rhs)     = delete;
    UnboundedDescriptorData& operator=(UnboundedDescriptorData&& rhs) = default;
    UnboundedDescriptorData& operator=(UnboundedDescriptorData const& rhs) = default;

    DescriptorType                                     type;
    boost::container::pmr::vector<DescriptorArrayData> descriptors;
};

struct DescriptorTableData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {blocks.get_allocator().resource()};
    }

    DescriptorTableData(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorTableData(DescriptorTableData&& rhs, const allocator_type& alloc);
    DescriptorTableData(DescriptorTableData const& rhs, const allocator_type& alloc);

    DescriptorTableData(DescriptorTableData&& rhs) noexcept = default;
    DescriptorTableData(DescriptorTableData const& rhs)     = delete;
    DescriptorTableData& operator=(DescriptorTableData&& rhs) = default;
    DescriptorTableData& operator=(DescriptorTableData const& rhs) = default;

    uint32_t                                           slot{0};
    uint32_t                                           capacity{0};
    boost::container::pmr::vector<DescriptorBlockData> blocks;
};

struct DescriptorSetData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {tables.get_allocator().resource()};
    }

    DescriptorSetData(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorSetData(DescriptorSetData&& rhs, const allocator_type& alloc);
    DescriptorSetData(DescriptorSetData const& rhs, const allocator_type& alloc);

    DescriptorSetData(DescriptorSetData&& rhs) noexcept = default;
    DescriptorSetData(DescriptorSetData const& rhs)     = delete;
    DescriptorSetData& operator=(DescriptorSetData&& rhs) = default;
    DescriptorSetData& operator=(DescriptorSetData const& rhs) = default;

    boost::container::pmr::vector<DescriptorTableData> tables;
    UnboundedDescriptorData                            unbounded;
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

    PmrTransparentMap<ParameterType, ConstantBufferData> constantBuffers;
    PmrTransparentMap<ParameterType, DescriptorSetData>  descriptorSets;
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

struct GroupTag {};
struct ShaderTag {};

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
    using OutEdge     = impl::StoredEdge<vertex_descriptor>;
    using out_edge_iterator = impl::OutEdgeIter<
        boost::container::pmr::vector<OutEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;
    using degree_size_type = uint32_t;

    // BidirectionalGraph
    using InEdge     = impl::StoredEdge<vertex_descriptor>;
    using in_edge_iterator = impl::InEdgeIter<
        boost::container::pmr::vector<InEdge>::iterator,
        vertex_descriptor, edge_descriptor, int32_t>;

    // AdjacencyGraph
    using adjacency_iterator = boost::adjacency_iterator_generator<
        LayoutGraphData, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline boost::container::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
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

    using ChildEdge = OutEdge;
    using children_iterator  = impl::OutEdgeIter<
        boost::container::pmr::vector<OutEdge>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;
    using children_size_type = uint32_t;

    using ParentEdge = InEdge;
    using parent_iterator  = impl::InEdgeIter<
        boost::container::pmr::vector<InEdge>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;

    using ownership_iterator   = impl::DirectedEdgeIterator<vertex_iterator, children_iterator, LayoutGraphData>;
    using ownerships_size_type = edges_size_type;

    // AddressableGraph help functions
    inline boost::container::pmr::vector<OutEdge>& getChildrenList(vertex_descriptor v) noexcept {
        return vertices[v].outEdges;
    }
    inline const boost::container::pmr::vector<OutEdge>& getChildrenList(vertex_descriptor v) const noexcept {
        return vertices[v].outEdges;
    }

    inline boost::container::pmr::vector<InEdge>& getParentsList(vertex_descriptor v) noexcept {
        return vertices[v].inEdges;
    }
    inline const boost::container::pmr::vector<InEdge>& getParentsList(vertex_descriptor v) const noexcept {
        return vertices[v].inEdges;
    }

    // PolymorphicGraph
    using VertexTag         = boost::variant2::variant<GroupTag, ShaderTag>;
    using VertexValue       = boost::variant2::variant<GroupNodeData*, ShaderNodeData*>;
    using VertexConstValue = boost::variant2::variant<const GroupNodeData*, const ShaderNodeData*>;
    using VertexHandle      = boost::variant2::variant<
        impl::ValueHandle<GroupTag, vertex_descriptor>,
        impl::ValueHandle<ShaderTag, vertex_descriptor>>;

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

        boost::container::pmr::vector<OutEdge> outEdges;
        boost::container::pmr::vector<InEdge>  inEdges;
        VertexHandle                           handle;
    };

    struct NameTag {
    } static constexpr Name{}; // NOLINT
    struct UpdateTag {
    } static constexpr Update{}; // NOLINT
    struct LayoutTag {
    } static constexpr Layout{}; // NOLINT

    // Vertices
    boost::container::pmr::vector<Vertex> vertices;
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
