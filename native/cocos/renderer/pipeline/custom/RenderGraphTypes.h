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
#include "cocos/base/Ptr.h"
#include "cocos/base/std/container/string.h"
#include "cocos/base/std/container/vector.h"
#include "cocos/base/std/hash/hash.h"
#include "cocos/core/assets/Material.h"
#include "cocos/math/Geometry.h"
#include "cocos/renderer/gfx-base/GFXBuffer.h"
#include "cocos/renderer/gfx-base/GFXFramebuffer.h"
#include "cocos/renderer/gfx-base/GFXRenderPass.h"
#include "cocos/renderer/gfx-base/GFXSwapchain.h"
#include "cocos/renderer/gfx-base/GFXTexture.h"
#include "cocos/renderer/gfx-base/states/GFXSampler.h"
#include "cocos/renderer/pipeline/custom/RenderCommonTypes.h"
#include "cocos/renderer/pipeline/custom/RenderGraphFwd.h"
#include "cocos/renderer/pipeline/custom/details/GraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/Map.h"
#include "cocos/scene/Camera.h"

namespace cc {

namespace render {

struct ResourceDesc {
    ResourceDimension dimension{ResourceDimension::BUFFER};
    uint32_t alignment{0};
    uint32_t width{0};
    uint32_t height{0};
    uint16_t depthOrArraySize{0};
    uint16_t mipLevels{0};
    gfx::Format format{gfx::Format::UNKNOWN};
    gfx::SampleCount sampleCount{gfx::SampleCount::ONE};
    gfx::TextureFlagBit textureFlags{gfx::TextureFlagBit::NONE};
    ResourceFlags flags{ResourceFlags::NONE};
};

struct ResourceTraits {
    ResourceTraits() = default;
    ResourceTraits(ResourceResidency residencyIn) noexcept // NOLINT
    : residency(residencyIn) {}

    bool hasSideEffects() const noexcept {
        return residency == ResourceResidency::PERSISTENT ||
               residency == ResourceResidency::EXTERNAL ||
               residency == ResourceResidency::BACKBUFFER;
    }

    ResourceResidency residency{ResourceResidency::MANAGED};
};

struct RenderSwapchain {
    RenderSwapchain() = default;
    RenderSwapchain(gfx::Swapchain* swapchainIn) noexcept // NOLINT
    : swapchain(swapchainIn) {}

    gfx::Swapchain* swapchain{nullptr};
    uint32_t currentID{0};
    uint32_t numBackBuffers{0};
    uint32_t generation{0xFFFFFFFF};
};

struct ResourceStates {
    gfx::AccessFlagBit states{gfx::AccessFlagBit::NONE};
};

struct ManagedBuffer {
    ManagedBuffer() = default;
    ManagedBuffer(IntrusivePtr<gfx::Buffer> bufferIn) noexcept // NOLINT
    : buffer(std::move(bufferIn)) {}

    IntrusivePtr<gfx::Buffer> buffer;
    uint64_t fenceValue{0};
};

struct ManagedTexture {
    ManagedTexture() = default;
    ManagedTexture(IntrusivePtr<gfx::Texture> textureIn) noexcept // NOLINT
    : texture(std::move(textureIn)) {}

    bool checkResource(const ResourceDesc &desc) const;

    IntrusivePtr<gfx::Texture> texture;
    uint64_t fenceValue{0};
};

struct ManagedResource {
    uint32_t unused{0};
};

struct Subpass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rasterViews.get_allocator().resource()};
    }

    Subpass(const allocator_type& alloc) noexcept; // NOLINT
    Subpass(Subpass&& rhs, const allocator_type& alloc);
    Subpass(Subpass const& rhs, const allocator_type& alloc);

    Subpass(Subpass&& rhs) noexcept = default;
    Subpass(Subpass const& rhs) = delete;
    Subpass& operator=(Subpass&& rhs) = default;
    Subpass& operator=(Subpass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, RasterView> rasterViews;
    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
};

inline bool operator==(const Subpass& lhs, const Subpass& rhs) noexcept {
    return std::forward_as_tuple(lhs.rasterViews, lhs.computeViews) ==
           std::forward_as_tuple(rhs.rasterViews, rhs.computeViews);
}

inline bool operator!=(const Subpass& lhs, const Subpass& rhs) noexcept {
    return !(lhs == rhs);
}

struct SubpassGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {_vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    SubpassGraph(const allocator_type& alloc) noexcept; // NOLINT
    SubpassGraph(SubpassGraph&& rhs, const allocator_type& alloc);
    SubpassGraph(SubpassGraph const& rhs, const allocator_type& alloc);

    SubpassGraph(SubpassGraph&& rhs) noexcept = default;
    SubpassGraph(SubpassGraph const& rhs) = delete;
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
        SubpassGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].outEdges;
    }
    inline const ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].outEdges;
    }

    inline ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].inEdges;
    }
    inline const ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(_vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(_vertices.size());
    }

    inline ccstd::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return ccstd::pmr::vector<boost::default_color_type>(_vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, SubpassGraph>;
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
        Vertex(Vertex const& rhs) = delete;
        Vertex& operator=(Vertex&& rhs) = default;
        Vertex& operator=(Vertex const& rhs) = default;

        ccstd::pmr::vector<OutEdge> outEdges;
        ccstd::pmr::vector<InEdge> inEdges;
    };

    struct NameTag {};
    struct SubpassTag {};

    // Vertices
    ccstd::pmr::vector<Vertex> _vertices;
    // Components
    ccstd::pmr::vector<ccstd::pmr::string> names;
    ccstd::pmr::vector<Subpass> subpasses;
};

inline bool operator==(const SubpassGraph& lhs, const SubpassGraph& rhs) noexcept {
    return std::forward_as_tuple(lhs.names, lhs.subpasses) ==
           std::forward_as_tuple(rhs.names, rhs.subpasses);
}

inline bool operator!=(const SubpassGraph& lhs, const SubpassGraph& rhs) noexcept {
    return !(lhs == rhs);
}

struct RasterSubpass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rasterViews.get_allocator().resource()};
    }

    RasterSubpass(uint32_t subpassIDIn, const allocator_type& alloc) noexcept;
    RasterSubpass(RasterSubpass&& rhs, const allocator_type& alloc);
    RasterSubpass(RasterSubpass const& rhs, const allocator_type& alloc);

    RasterSubpass(RasterSubpass&& rhs) noexcept = default;
    RasterSubpass(RasterSubpass const& rhs) = delete;
    RasterSubpass& operator=(RasterSubpass&& rhs) = default;
    RasterSubpass& operator=(RasterSubpass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, RasterView> rasterViews;
    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
    uint32_t subpassID{0xFFFFFFFF};
    gfx::Viewport viewport;
    bool showStatistics{false};
};

struct ComputeSubpass {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {rasterViews.get_allocator().resource()};
    }

    ComputeSubpass(uint32_t subpassIDIn, const allocator_type& alloc) noexcept;
    ComputeSubpass(ComputeSubpass&& rhs, const allocator_type& alloc);
    ComputeSubpass(ComputeSubpass const& rhs, const allocator_type& alloc);

    ComputeSubpass(ComputeSubpass&& rhs) noexcept = default;
    ComputeSubpass(ComputeSubpass const& rhs) = delete;
    ComputeSubpass& operator=(ComputeSubpass&& rhs) = default;
    ComputeSubpass& operator=(ComputeSubpass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, RasterView> rasterViews;
    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
    uint32_t subpassID{0xFFFFFFFF};
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
    RasterPass(RasterPass const& rhs) = delete;
    RasterPass& operator=(RasterPass&& rhs) = default;
    RasterPass& operator=(RasterPass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, RasterView> rasterViews;
    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
    SubpassGraph subpassGraph;
    uint32_t width{0};
    uint32_t height{0};
    gfx::Viewport viewport;
    ccstd::pmr::string versionName;
    uint64_t version{0};
    bool showStatistics{false};
};

inline bool operator==(const RasterPass& lhs, const RasterPass& rhs) noexcept {
    return std::forward_as_tuple(lhs.rasterViews, lhs.computeViews, lhs.subpassGraph, lhs.width, lhs.height) ==
           std::forward_as_tuple(rhs.rasterViews, rhs.computeViews, rhs.subpassGraph, rhs.width, rhs.height);
}

inline bool operator!=(const RasterPass& lhs, const RasterPass& rhs) noexcept {
    return !(lhs == rhs);
}

struct PersistentRenderPassAndFramebuffer {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {clearColors.get_allocator().resource()};
    }

    PersistentRenderPassAndFramebuffer(const allocator_type& alloc) noexcept; // NOLINT
    PersistentRenderPassAndFramebuffer(IntrusivePtr<gfx::RenderPass> renderPassIn, IntrusivePtr<gfx::Framebuffer> framebufferIn, const allocator_type& alloc) noexcept;
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer&& rhs, const allocator_type& alloc);
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer const& rhs, const allocator_type& alloc);

    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer&& rhs) noexcept = default;
    PersistentRenderPassAndFramebuffer(PersistentRenderPassAndFramebuffer const& rhs) = delete;
    PersistentRenderPassAndFramebuffer& operator=(PersistentRenderPassAndFramebuffer&& rhs) = default;
    PersistentRenderPassAndFramebuffer& operator=(PersistentRenderPassAndFramebuffer const& rhs) = default;

    IntrusivePtr<gfx::RenderPass> renderPass;
    IntrusivePtr<gfx::Framebuffer> framebuffer;
    ccstd::pmr::vector<gfx::Color> clearColors;
    float clearDepth{0};
    uint8_t clearStencil{0};
};

struct ManagedTag {};
struct ManagedBufferTag {};
struct ManagedTextureTag {};
struct PersistentBufferTag {};
struct PersistentTextureTag {};
struct FramebufferTag {};
struct SwapchainTag {};
struct SamplerTag {};

struct ResourceGraph {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {_vertices.get_allocator().resource()};
    }

    inline boost::container::pmr::memory_resource* resource() const noexcept {
        return get_allocator().resource();
    }

    ResourceGraph(const allocator_type& alloc) noexcept; // NOLINT
    ResourceGraph(ResourceGraph&& rhs) = delete;
    ResourceGraph(ResourceGraph const& rhs) = delete;
    ResourceGraph& operator=(ResourceGraph&& rhs) = delete;
    ResourceGraph& operator=(ResourceGraph const& rhs) = delete;

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
        ResourceGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].outEdges;
    }
    inline const ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].outEdges;
    }

    inline ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].inEdges;
    }
    inline const ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(_vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(_vertices.size());
    }

    inline ccstd::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return ccstd::pmr::vector<boost::default_color_type>(_vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, ResourceGraph>;
    using edges_size_type = uint32_t;

    // PolymorphicGraph
    using VertexTag         = ccstd::variant<ManagedTag, ManagedBufferTag, ManagedTextureTag, PersistentBufferTag, PersistentTextureTag, FramebufferTag, SwapchainTag>;
    using VertexValue       = ccstd::variant<ManagedResource*, ManagedBuffer*, ManagedTexture*, IntrusivePtr<gfx::Buffer>*, IntrusivePtr<gfx::Texture>*, IntrusivePtr<gfx::Framebuffer>*, RenderSwapchain*>;
    using VertexConstValue = ccstd::variant<const ManagedResource*, const ManagedBuffer*, const ManagedTexture*, const IntrusivePtr<gfx::Buffer>*, const IntrusivePtr<gfx::Texture>*, const IntrusivePtr<gfx::Framebuffer>*, const RenderSwapchain*>;
    using VertexHandle      = ccstd::variant<
        impl::ValueHandle<ManagedTag, vertex_descriptor>,
        impl::ValueHandle<ManagedBufferTag, vertex_descriptor>,
        impl::ValueHandle<ManagedTextureTag, vertex_descriptor>,
        impl::ValueHandle<PersistentBufferTag, vertex_descriptor>,
        impl::ValueHandle<PersistentTextureTag, vertex_descriptor>,
        impl::ValueHandle<FramebufferTag, vertex_descriptor>,
        impl::ValueHandle<SwapchainTag, vertex_descriptor>>;

    void validateSwapchains();
    void mount(gfx::Device* device, vertex_descriptor vertID);
    void unmount(uint64_t completedFenceValue);
    gfx::Texture* getTexture(vertex_descriptor resID);
    void invalidatePersistentRenderPassAndFramebuffer(gfx::Texture* pTexture);

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
        VertexHandle handle;
    };

    struct NameTag {};
    struct DescTag {};
    struct TraitsTag {};
    struct StatesTag {};
    struct SamplerTag {};

    // Vertices
    ccstd::pmr::vector<Vertex> _vertices;
    // Components
    ccstd::pmr::vector<ccstd::pmr::string> names;
    ccstd::pmr::vector<ResourceDesc> descs;
    ccstd::pmr::vector<ResourceTraits> traits;
    ccstd::pmr::vector<ResourceStates> states;
    ccstd::pmr::vector<gfx::SamplerInfo> samplerInfo;
    // PolymorphicGraph
    ccstd::pmr::vector<ManagedResource> resources;
    ccstd::pmr::vector<ManagedBuffer> managedBuffers;
    ccstd::pmr::vector<ManagedTexture> managedTextures;
    ccstd::pmr::vector<IntrusivePtr<gfx::Buffer>> buffers;
    ccstd::pmr::vector<IntrusivePtr<gfx::Texture>> textures;
    ccstd::pmr::vector<IntrusivePtr<gfx::Framebuffer>> framebuffers;
    ccstd::pmr::vector<RenderSwapchain> swapchains;
    // UuidGraph
    PmrUnorderedStringMap<ccstd::pmr::string, vertex_descriptor> valueIndex;
    // Members
    ccstd::pmr::unordered_map<RasterPass, PersistentRenderPassAndFramebuffer> renderPasses;
    uint64_t nextFenceValue{0};
    uint64_t version{0};
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
    ComputePass(ComputePass const& rhs) = delete;
    ComputePass& operator=(ComputePass&& rhs) = default;
    ComputePass& operator=(ComputePass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
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
    CopyPass(CopyPass const& rhs) = delete;
    CopyPass& operator=(CopyPass&& rhs) = default;
    CopyPass& operator=(CopyPass const& rhs) = default;

    ccstd::pmr::vector<CopyPair> copyPairs;
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
    MovePass(MovePass const& rhs) = delete;
    MovePass& operator=(MovePass&& rhs) = default;
    MovePass& operator=(MovePass const& rhs) = default;

    ccstd::pmr::vector<MovePair> movePairs;
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
    RaytracePass(RaytracePass const& rhs) = delete;
    RaytracePass& operator=(RaytracePass&& rhs) = default;
    RaytracePass& operator=(RaytracePass const& rhs) = default;

    PmrTransparentMap<ccstd::pmr::string, ccstd::pmr::vector<ComputeView>> computeViews;
};

struct QueueTag {};
struct SceneTag {};
struct DispatchTag {};
struct BlitTag {};
struct ClearTag {};
struct ViewportTag {};

struct ClearView {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {slotName.get_allocator().resource()};
    }

    ClearView(const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept; // NOLINT
    ClearView(ccstd::pmr::string slotNameIn, gfx::ClearFlagBit clearFlagsIn, gfx::Color clearColorIn, const allocator_type& alloc = boost::container::pmr::get_default_resource()) noexcept;
    ClearView(ClearView&& rhs, const allocator_type& alloc);
    ClearView(ClearView const& rhs, const allocator_type& alloc);

    ClearView(ClearView&& rhs) noexcept = default;
    ClearView(ClearView const& rhs) = delete;
    ClearView& operator=(ClearView&& rhs) = default;
    ClearView& operator=(ClearView const& rhs) = default;

    ccstd::pmr::string slotName;
    gfx::ClearFlagBit clearFlags{gfx::ClearFlagBit::ALL};
    gfx::Color clearColor;
};

struct RenderQueue {
    RenderQueue() = default;
    RenderQueue(QueueHint hintIn, uint32_t phaseIDIn) noexcept
    : hint(hintIn),
      phaseID(phaseIDIn) {}
    RenderQueue(uint32_t phaseIDIn) noexcept // NOLINT
    : phaseID(phaseIDIn) {}

    QueueHint hint{QueueHint::RENDER_OPAQUE};
    uint32_t phaseID{0xFFFFFFFF};
};

struct SceneData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {name.get_allocator().resource()};
    }

    SceneData(const allocator_type& alloc) noexcept; // NOLINT
    SceneData(ccstd::pmr::string nameIn, SceneFlags flagsIn, LightInfo lightIn, const allocator_type& alloc) noexcept;
    SceneData(SceneData&& rhs, const allocator_type& alloc);
    SceneData(SceneData const& rhs, const allocator_type& alloc);

    SceneData(SceneData&& rhs) noexcept = default;
    SceneData(SceneData const& rhs) = delete;
    SceneData& operator=(SceneData&& rhs) = default;
    SceneData& operator=(SceneData const& rhs) = default;

    ccstd::pmr::string name;
    scene::Camera* camera{nullptr};
    LightInfo light;
    SceneFlags flags{SceneFlags::NONE};
    ccstd::pmr::vector<ccstd::pmr::string> scenes;
};

struct Dispatch {
    Dispatch() = default;
    Dispatch(IntrusivePtr<Material> materialIn, uint32_t passIDIn, uint32_t threadGroupCountXIn, uint32_t threadGroupCountYIn, uint32_t threadGroupCountZIn) noexcept // NOLINT
    : material(std::move(materialIn)),
      passID(passIDIn),
      threadGroupCountX(threadGroupCountXIn),
      threadGroupCountY(threadGroupCountYIn),
      threadGroupCountZ(threadGroupCountZIn) {}

    IntrusivePtr<Material> material;
    uint32_t passID{0};
    uint32_t threadGroupCountX{0};
    uint32_t threadGroupCountY{0};
    uint32_t threadGroupCountZ{0};
};

struct Blit {
    Blit() = default;
    Blit(IntrusivePtr<Material> materialIn, uint32_t passIDIn, SceneFlags sceneFlagsIn, scene::Camera* cameraIn) noexcept
    : material(std::move(materialIn)),
      passID(passIDIn),
      sceneFlags(sceneFlagsIn),
      camera(cameraIn) {}

    IntrusivePtr<Material> material;
    uint32_t passID{0};
    SceneFlags sceneFlags{SceneFlags::NONE};
    scene::Camera* camera{nullptr};
};

struct RenderData {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return {constants.get_allocator().resource()};
    }

    RenderData(const allocator_type& alloc) noexcept; // NOLINT
    RenderData(RenderData&& rhs, const allocator_type& alloc);

    RenderData(RenderData&& rhs) noexcept = default;
    RenderData(RenderData const& rhs) = delete;
    RenderData& operator=(RenderData&& rhs) = default;
    RenderData& operator=(RenderData const& rhs) = delete;

    PmrUnorderedMap<uint32_t, ccstd::pmr::vector<char>> constants;
    PmrUnorderedMap<uint32_t, IntrusivePtr<gfx::Buffer>> buffers;
    PmrUnorderedMap<uint32_t, IntrusivePtr<gfx::Texture>> textures;
    PmrUnorderedMap<uint32_t, ObserverPtr<gfx::Sampler>> samplers;
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
    RenderGraph(RenderGraph const& rhs) = delete;
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
        RenderGraph, vertex_descriptor, out_edge_iterator>::type;

    // VertexListGraph
    using vertex_iterator    = boost::integer_range<vertex_descriptor>::iterator;
    using vertices_size_type = uint32_t;

    // VertexList help functions
    inline ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].outEdges;
    }
    inline const ccstd::pmr::vector<OutEdge>& getOutEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].outEdges;
    }

    inline ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) noexcept {
        return _vertices[v].inEdges;
    }
    inline const ccstd::pmr::vector<InEdge>& getInEdgeList(vertex_descriptor v) const noexcept {
        return _vertices[v].inEdges;
    }

    inline boost::integer_range<vertex_descriptor> getVertexList() const noexcept {
        return {0, static_cast<vertices_size_type>(_vertices.size())};
    }

    inline vertex_descriptor getCurrentID() const noexcept {
        return static_cast<vertex_descriptor>(_vertices.size());
    }

    inline ccstd::pmr::vector<boost::default_color_type> colors(boost::container::pmr::memory_resource* mr) const {
        return ccstd::pmr::vector<boost::default_color_type>(_vertices.size(), mr);
    }

    // EdgeListGraph
    using edge_iterator   = impl::DirectedEdgeIterator<vertex_iterator, out_edge_iterator, RenderGraph>;
    using edges_size_type = uint32_t;

    // AddressableGraph (Separated)
    using ownership_descriptor = impl::EdgeDescriptor<boost::bidirectional_tag, vertex_descriptor>;

    using ChildEdge = impl::StoredEdge<vertex_descriptor>;
    using children_iterator  = impl::OutEdgeIter<
        ccstd::pmr::vector<ChildEdge>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;
    using children_size_type = uint32_t;

    using ParentEdge = impl::StoredEdge<vertex_descriptor>;
    using parent_iterator  = impl::InEdgeIter<
        ccstd::pmr::vector<ParentEdge>::iterator,
        vertex_descriptor, ownership_descriptor, int32_t>;

    using ownership_iterator   = impl::OwnershipIterator<vertex_iterator, children_iterator, RenderGraph>;
    using ownerships_size_type = edges_size_type;

    // AddressableGraph help functions
    inline ccstd::pmr::vector<ChildEdge>& getChildrenList(vertex_descriptor v) noexcept {
        return objects[v].children;
    }
    inline const ccstd::pmr::vector<ChildEdge>& getChildrenList(vertex_descriptor v) const noexcept {
        return objects[v].children;
    }

    inline ccstd::pmr::vector<ParentEdge>& getParentsList(vertex_descriptor v) noexcept {
        return objects[v].parents;
    }
    inline const ccstd::pmr::vector<ParentEdge>& getParentsList(vertex_descriptor v) const noexcept {
        return objects[v].parents;
    }

    // PolymorphicGraph
    using VertexTag         = ccstd::variant<RasterPassTag, RasterSubpassTag, ComputeSubpassTag, ComputeTag, CopyTag, MoveTag, RaytraceTag, QueueTag, SceneTag, BlitTag, DispatchTag, ClearTag, ViewportTag>;
    using VertexValue       = ccstd::variant<RasterPass*, RasterSubpass*, ComputeSubpass*, ComputePass*, CopyPass*, MovePass*, RaytracePass*, RenderQueue*, SceneData*, Blit*, Dispatch*, ccstd::pmr::vector<ClearView>*, gfx::Viewport*>;
    using VertexConstValue = ccstd::variant<const RasterPass*, const RasterSubpass*, const ComputeSubpass*, const ComputePass*, const CopyPass*, const MovePass*, const RaytracePass*, const RenderQueue*, const SceneData*, const Blit*, const Dispatch*, const ccstd::pmr::vector<ClearView>*, const gfx::Viewport*>;
    using VertexHandle      = ccstd::variant<
        impl::ValueHandle<RasterPassTag, vertex_descriptor>,
        impl::ValueHandle<RasterSubpassTag, vertex_descriptor>,
        impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>,
        impl::ValueHandle<ComputeTag, vertex_descriptor>,
        impl::ValueHandle<CopyTag, vertex_descriptor>,
        impl::ValueHandle<MoveTag, vertex_descriptor>,
        impl::ValueHandle<RaytraceTag, vertex_descriptor>,
        impl::ValueHandle<QueueTag, vertex_descriptor>,
        impl::ValueHandle<SceneTag, vertex_descriptor>,
        impl::ValueHandle<BlitTag, vertex_descriptor>,
        impl::ValueHandle<DispatchTag, vertex_descriptor>,
        impl::ValueHandle<ClearTag, vertex_descriptor>,
        impl::ValueHandle<ViewportTag, vertex_descriptor>>;

    ccstd::string print(boost::container::pmr::memory_resource* scratch) const;

    // ContinuousContainer
    void reserve(vertices_size_type sz);

    // Members
    struct Object {
        using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
        allocator_type get_allocator() const noexcept { // NOLINT
            return {children.get_allocator().resource()};
        }

        Object(const allocator_type& alloc) noexcept; // NOLINT
        Object(Object&& rhs, const allocator_type& alloc);
        Object(Object const& rhs, const allocator_type& alloc);

        Object(Object&& rhs) noexcept = default;
        Object(Object const& rhs) = delete;
        Object& operator=(Object&& rhs) = default;
        Object& operator=(Object const& rhs) = default;

        ccstd::pmr::vector<ChildEdge> children;
        ccstd::pmr::vector<ParentEdge> parents;
    };

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
        VertexHandle handle;
    };

    struct NameTag {};
    struct LayoutTag {};
    struct DataTag {};
    struct ValidTag {};

    // Owners
    ccstd::pmr::vector<Object> objects;
    // Vertices
    ccstd::pmr::vector<Vertex> _vertices;
    // Components
    ccstd::pmr::vector<ccstd::pmr::string> names;
    ccstd::pmr::vector<ccstd::pmr::string> layoutNodes;
    ccstd::pmr::vector<RenderData> data;
    ccstd::pmr::vector<bool> valid;
    // PolymorphicGraph
    ccstd::pmr::vector<RasterPass> rasterPasses;
    ccstd::pmr::vector<RasterSubpass> rasterSubpasses;
    ccstd::pmr::vector<ComputeSubpass> computeSubpasses;
    ccstd::pmr::vector<ComputePass> computePasses;
    ccstd::pmr::vector<CopyPass> copyPasses;
    ccstd::pmr::vector<MovePass> movePasses;
    ccstd::pmr::vector<RaytracePass> raytracePasses;
    ccstd::pmr::vector<RenderQueue> renderQueues;
    ccstd::pmr::vector<SceneData> scenes;
    ccstd::pmr::vector<Blit> blits;
    ccstd::pmr::vector<Dispatch> dispatches;
    ccstd::pmr::vector<ccstd::pmr::vector<ClearView>> clearViews;
    ccstd::pmr::vector<gfx::Viewport> viewports;
    // Members
    PmrUnorderedStringMap<ccstd::pmr::string, uint32_t> index;
};

} // namespace render

} // namespace cc

namespace ccstd {

inline hash_t hash<cc::render::Subpass>::operator()(const cc::render::Subpass& val) const noexcept {
    hash_t seed = 0;
    hash_combine(seed, val.rasterViews);
    hash_combine(seed, val.computeViews);
    return seed;
}

inline hash_t hash<cc::render::SubpassGraph>::operator()(const cc::render::SubpassGraph& val) const noexcept {
    hash_t seed = 0;
    hash_combine(seed, val.names);
    hash_combine(seed, val.subpasses);
    return seed;
}

inline hash_t hash<cc::render::RasterPass>::operator()(const cc::render::RasterPass& val) const noexcept {
    hash_t seed = 0;
    hash_combine(seed, val.rasterViews);
    hash_combine(seed, val.computeViews);
    hash_combine(seed, val.subpassGraph);
    hash_combine(seed, val.width);
    hash_combine(seed, val.height);
    return seed;
}

} // namespace ccstd

// clang-format on
