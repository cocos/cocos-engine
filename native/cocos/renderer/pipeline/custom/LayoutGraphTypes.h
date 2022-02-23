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
#include "cocos/renderer/gfx-base/GFXDef-common.h"
#include "cocos/renderer/pipeline/custom/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphFwd.h"
#include "cocos/renderer/pipeline/custom/Map.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/Set.h"
#include "cocos/renderer/pipeline/custom/String.h"

namespace cc {

namespace render {

enum class DescriptorIndex {
    UNIFORM_BLOCK,
    SAMPLER_TEXTURE,
    SAMPLER,
    TEXTURE,
    STORAGE_BUFFER,
    STORAGE_TEXTURE,
    SUBPASS_INPUT,
};

struct UniformBlockDB {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {values.get_allocator().resource()};
    }

    UniformBlockDB(const allocator_type& alloc) noexcept; // NOLINT
    UniformBlockDB(UniformBlockDB&& rhs, const allocator_type& alloc);
    UniformBlockDB(UniformBlockDB const& rhs, const allocator_type& alloc);

    UniformBlockDB(UniformBlockDB&& rhs) noexcept = default;
    UniformBlockDB(UniformBlockDB const& rhs)     = delete;
    UniformBlockDB& operator=(UniformBlockDB&& rhs) = default;
    UniformBlockDB& operator=(UniformBlockDB const& rhs) = default;

    PmrTransparentMap<PmrString, gfx::Uniform> values;
};

struct Descriptor {
    Descriptor() = default;
    Descriptor(gfx::Type typeIn) noexcept // NOLINT
    : type(typeIn) {}

    gfx::Type type{gfx::Type::UNKNOWN};
    uint32_t  count{1};
};

struct DescriptorBlock {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptors.get_allocator().resource()};
    }

    DescriptorBlock(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorBlock(DescriptorBlock&& rhs, const allocator_type& alloc);
    DescriptorBlock(DescriptorBlock const& rhs, const allocator_type& alloc);

    DescriptorBlock(DescriptorBlock&& rhs) noexcept = default;
    DescriptorBlock(DescriptorBlock const& rhs)     = delete;
    DescriptorBlock& operator=(DescriptorBlock&& rhs) = default;
    DescriptorBlock& operator=(DescriptorBlock const& rhs) = default;

    PmrTransparentMap<PmrString, Descriptor>     descriptors;
    PmrTransparentMap<PmrString, UniformBlockDB> uniformBlocks;
};

struct DescriptorBlockIndex {
    DescriptorBlockIndex() = default;
    DescriptorBlockIndex(UpdateFrequency updateFrequencyIn, ParameterType parameterTypeIn, DescriptorIndex descriptorTypeIn, gfx::ShaderStageFlagBit visibilityIn) noexcept
    : updateFrequency(updateFrequencyIn),
      parameterType(parameterTypeIn),
      descriptorType(descriptorTypeIn),
      visibility(visibilityIn) {}

    UpdateFrequency         updateFrequency{UpdateFrequency::PER_INSTANCE};
    ParameterType           parameterType{ParameterType::CONSTANTS};
    DescriptorIndex         descriptorType{DescriptorIndex::UNIFORM_BLOCK};
    gfx::ShaderStageFlagBit visibility{gfx::ShaderStageFlagBit::NONE};
};

inline bool operator<(const DescriptorBlockIndex& lhs, const DescriptorBlockIndex& rhs) noexcept {
    return std::forward_as_tuple(lhs.updateFrequency, lhs.parameterType, lhs.descriptorType, lhs.visibility) <
           std::forward_as_tuple(rhs.updateFrequency, rhs.parameterType, rhs.descriptorType, rhs.visibility);
}

struct DescriptorBlockIndexDx {
    DescriptorBlockIndexDx() = default;
    DescriptorBlockIndexDx(UpdateFrequency updateFrequencyIn, ParameterType parameterTypeIn, gfx::ShaderStageFlagBit visibilityIn, DescriptorIndex descriptorTypeIn) noexcept
    : updateFrequency(updateFrequencyIn),
      parameterType(parameterTypeIn),
      visibility(visibilityIn),
      descriptorType(descriptorTypeIn) {}

    UpdateFrequency         updateFrequency{UpdateFrequency::PER_INSTANCE};
    ParameterType           parameterType{ParameterType::CONSTANTS};
    gfx::ShaderStageFlagBit visibility{gfx::ShaderStageFlagBit::NONE};
    DescriptorIndex         descriptorType{DescriptorIndex::UNIFORM_BLOCK};
};

inline bool operator<(const DescriptorBlockIndexDx& lhs, const DescriptorBlockIndexDx& rhs) noexcept {
    return std::forward_as_tuple(lhs.updateFrequency, lhs.parameterType, lhs.visibility, lhs.descriptorType) <
           std::forward_as_tuple(rhs.updateFrequency, rhs.parameterType, rhs.visibility, rhs.descriptorType);
}

struct DescriptorDB {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {blocks.get_allocator().resource()};
    }

    DescriptorDB(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorDB(DescriptorDB&& rhs, const allocator_type& alloc);
    DescriptorDB(DescriptorDB const& rhs, const allocator_type& alloc);

    DescriptorDB(DescriptorDB&& rhs) noexcept = default;
    DescriptorDB(DescriptorDB const& rhs)     = delete;
    DescriptorDB& operator=(DescriptorDB&& rhs) = default;
    DescriptorDB& operator=(DescriptorDB const& rhs) = default;

    PmrMap<DescriptorBlockIndex, DescriptorBlock> blocks;
};

struct RenderStageTag {};
struct RenderPhaseTag {};

struct RenderPhase {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {shaders.get_allocator().resource()};
    }

    RenderPhase(const allocator_type& alloc) noexcept; // NOLINT
    RenderPhase(RenderPhase&& rhs, const allocator_type& alloc);
    RenderPhase(RenderPhase const& rhs, const allocator_type& alloc);

    RenderPhase(RenderPhase&& rhs) noexcept = default;
    RenderPhase(RenderPhase const& rhs)     = delete;
    RenderPhase& operator=(RenderPhase&& rhs) = default;
    RenderPhase& operator=(RenderPhase const& rhs) = default;

    PmrTransparentSet<PmrString> shaders;
};

struct LayoutGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    LayoutGraph(const allocator_type& alloc) noexcept; // NOLINT
    LayoutGraph(LayoutGraph&& rhs, const allocator_type& alloc);
    LayoutGraph(LayoutGraph const& rhs, const allocator_type& alloc);

    LayoutGraph(LayoutGraph&& rhs) noexcept = default;
    LayoutGraph(LayoutGraph const& rhs)     = delete;
    LayoutGraph& operator=(LayoutGraph&& rhs) = default;
    LayoutGraph& operator=(LayoutGraph const& rhs) = default;

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
        LayoutGraph, vertex_descriptor, out_edge_iterator>::type;

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
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, LayoutGraph>;
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

    using ownership_iterator   = impl::DirectedEdgeIterator<vertex_iterator, children_iterator, LayoutGraph>;
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
    using VertexTag         = boost::variant2::variant<RenderStageTag, RenderPhaseTag>;
    using VertexValue       = boost::variant2::variant<uint32_t*, RenderPhase*>;
    using VertexConstValue = boost::variant2::variant<const uint32_t*, const RenderPhase*>;
    using VertexHandle      = boost::variant2::variant<
        impl::ValueHandle<RenderStageTag, vertex_descriptor>,
        impl::ValueHandle<RenderPhaseTag, vertex_descriptor>>;

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
    struct DescriptorsTag {
    } static constexpr Descriptors{}; // NOLINT

    // Vertices
    boost::container::pmr::vector<Vertex> vertices;
    // Components
    boost::container::pmr::vector<PmrString>    names;
    boost::container::pmr::vector<DescriptorDB> descriptors;
    // PolymorphicGraph
    boost::container::pmr::vector<uint32_t>    stages;
    boost::container::pmr::vector<RenderPhase> phases;
    // Path
    PmrTransparentMap<PmrString, vertex_descriptor> pathIndex;
};

struct UniformData {
    UniformData() = default;
    UniformData(gfx::Type typeIn, uint32_t valueIDIn) noexcept
    : type(typeIn),
      valueID(valueIDIn) {}

    gfx::Type type{gfx::Type::UNKNOWN};
    uint32_t  valueID{0xFFFFFFFF};
};

struct UniformBlockData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {values.get_allocator().resource()};
    }

    UniformBlockData(const allocator_type& alloc) noexcept; // NOLINT
    UniformBlockData(UniformBlockData&& rhs, const allocator_type& alloc);
    UniformBlockData(UniformBlockData const& rhs, const allocator_type& alloc);

    UniformBlockData(UniformBlockData&& rhs) noexcept = default;
    UniformBlockData(UniformBlockData const& rhs)     = delete;
    UniformBlockData& operator=(UniformBlockData&& rhs) = default;
    UniformBlockData& operator=(UniformBlockData const& rhs) = default;

    uint32_t                                   size{0};
    boost::container::pmr::vector<UniformData> values;
};

struct DescriptorData {
    DescriptorData() = default;
    DescriptorData(uint32_t idIn, gfx::Type typeIn) noexcept
    : id(idIn),
      type(typeIn) {}

    uint32_t  id{0xFFFFFFFF};
    gfx::Type type{gfx::Type::UNKNOWN};
    uint32_t  count{1};
};

struct DescriptorBlockData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptors.get_allocator().resource()};
    }

    DescriptorBlockData(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorBlockData(DescriptorIndex typeIn, uint32_t capacityIn, const allocator_type& alloc) noexcept;
    DescriptorBlockData(DescriptorBlockData&& rhs, const allocator_type& alloc);
    DescriptorBlockData(DescriptorBlockData const& rhs, const allocator_type& alloc);

    DescriptorBlockData(DescriptorBlockData&& rhs) noexcept = default;
    DescriptorBlockData(DescriptorBlockData const& rhs)     = delete;
    DescriptorBlockData& operator=(DescriptorBlockData&& rhs) = default;
    DescriptorBlockData& operator=(DescriptorBlockData const& rhs) = default;

    DescriptorIndex                               type{DescriptorIndex::UNIFORM_BLOCK};
    uint32_t                                      capacity{0};
    boost::container::pmr::vector<DescriptorData> descriptors;
};

struct DescriptorTableData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptorBlocks.get_allocator().resource()};
    }

    DescriptorTableData(const allocator_type& alloc) noexcept; // NOLINT
    DescriptorTableData(uint32_t slotIn, uint32_t capacityIn, const allocator_type& alloc) noexcept;
    DescriptorTableData(DescriptorTableData&& rhs, const allocator_type& alloc);
    DescriptorTableData(DescriptorTableData const& rhs, const allocator_type& alloc);

    DescriptorTableData(DescriptorTableData&& rhs) noexcept = default;
    DescriptorTableData(DescriptorTableData const& rhs)     = delete;
    DescriptorTableData& operator=(DescriptorTableData&& rhs) = default;
    DescriptorTableData& operator=(DescriptorTableData const& rhs) = default;

    uint32_t                                           slot{0xFFFFFFFF};
    uint32_t                                           capacity{0};
    boost::container::pmr::vector<DescriptorBlockData> descriptorBlocks;
    PmrFlatMap<uint32_t, UniformBlockData>             uniformBlocks;
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

    PmrFlatMap<gfx::ShaderStageFlagBit, DescriptorTableData> tables;
};

struct PipelineLayoutData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {descriptorSets.get_allocator().resource()};
    }

    PipelineLayoutData(const allocator_type& alloc) noexcept; // NOLINT
    PipelineLayoutData(PipelineLayoutData&& rhs, const allocator_type& alloc);
    PipelineLayoutData(PipelineLayoutData const& rhs, const allocator_type& alloc);

    PipelineLayoutData(PipelineLayoutData&& rhs) noexcept = default;
    PipelineLayoutData(PipelineLayoutData const& rhs)     = delete;
    PipelineLayoutData& operator=(PipelineLayoutData&& rhs) = default;
    PipelineLayoutData& operator=(PipelineLayoutData const& rhs) = default;

    PmrFlatMap<UpdateFrequency, DescriptorSetData> descriptorSets;
};

struct ShaderProgramData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {layout.get_allocator().resource()};
    }

    ShaderProgramData(const allocator_type& alloc) noexcept; // NOLINT
    ShaderProgramData(ShaderProgramData&& rhs, const allocator_type& alloc);
    ShaderProgramData(ShaderProgramData const& rhs, const allocator_type& alloc);

    ShaderProgramData(ShaderProgramData&& rhs) noexcept = default;
    ShaderProgramData(ShaderProgramData const& rhs)     = delete;
    ShaderProgramData& operator=(ShaderProgramData&& rhs) = default;
    ShaderProgramData& operator=(ShaderProgramData const& rhs) = default;

    PipelineLayoutData layout;
};

struct RenderPhaseData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rootSignature.get_allocator().resource()};
    }

    RenderPhaseData(const allocator_type& alloc) noexcept; // NOLINT
    RenderPhaseData(RenderPhaseData&& rhs, const allocator_type& alloc);
    RenderPhaseData(RenderPhaseData const& rhs, const allocator_type& alloc);

    RenderPhaseData(RenderPhaseData&& rhs) noexcept = default;
    RenderPhaseData(RenderPhaseData const& rhs)     = delete;
    RenderPhaseData& operator=(RenderPhaseData&& rhs) = default;
    RenderPhaseData& operator=(RenderPhaseData const& rhs) = default;

    PmrString                                        rootSignature;
    boost::container::pmr::vector<ShaderProgramData> shaderPrograms;
    PmrTransparentMap<PmrString, uint32_t>           shaderIndex;
};

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
    using VertexTag         = boost::variant2::variant<RenderStageTag, RenderPhaseTag>;
    using VertexValue       = boost::variant2::variant<uint32_t*, RenderPhaseData*>;
    using VertexConstValue = boost::variant2::variant<const uint32_t*, const RenderPhaseData*>;
    using VertexHandle      = boost::variant2::variant<
        impl::ValueHandle<RenderStageTag, vertex_descriptor>,
        impl::ValueHandle<RenderPhaseTag, vertex_descriptor>>;

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
    boost::container::pmr::vector<PmrString>          names;
    boost::container::pmr::vector<UpdateFrequency>    updateFrequencies;
    boost::container::pmr::vector<PipelineLayoutData> layouts;
    // PolymorphicGraph
    boost::container::pmr::vector<uint32_t>        stages;
    boost::container::pmr::vector<RenderPhaseData> phases;
    // Path
    PmrTransparentMap<PmrString, vertex_descriptor> pathIndex;
};

} // namespace render

} // namespace cc

// clang-format on
