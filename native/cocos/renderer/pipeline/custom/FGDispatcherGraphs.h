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
#include <boost/utility/string_view.hpp>
#include "cocos/renderer/pipeline/custom/FGDispatcherTypes.h"
#include "cocos/renderer/pipeline/custom/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

// IncidenceGraph
inline ResourceAccessGraph::vertex_descriptor
source(const ResourceAccessGraph::edge_descriptor& e, const ResourceAccessGraph& /*g*/) noexcept {
    return e.source;
}

inline ResourceAccessGraph::vertex_descriptor
target(const ResourceAccessGraph::edge_descriptor& e, const ResourceAccessGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<ResourceAccessGraph::out_edge_iterator, ResourceAccessGraph::out_edge_iterator>
out_edges(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept { // NOLINT
    return std::make_pair(
        ResourceAccessGraph::out_edge_iterator(const_cast<ResourceAccessGraph&>(g).getOutEdgeList(u).begin(), u),
        ResourceAccessGraph::out_edge_iterator(const_cast<ResourceAccessGraph&>(g).getOutEdgeList(u).end(), u));
}

inline ResourceAccessGraph::degree_size_type
out_degree(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceAccessGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<ResourceAccessGraph::edge_descriptor, bool>
edge(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph::vertex_descriptor v, const ResourceAccessGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), ResourceAccessGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {ResourceAccessGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<ResourceAccessGraph::in_edge_iterator, ResourceAccessGraph::in_edge_iterator>
in_edges(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept { // NOLINT
    return std::make_pair(
        ResourceAccessGraph::in_edge_iterator(const_cast<ResourceAccessGraph&>(g).getInEdgeList(u).begin(), u),
        ResourceAccessGraph::in_edge_iterator(const_cast<ResourceAccessGraph&>(g).getInEdgeList(u).end(), u));
}

inline ResourceAccessGraph::degree_size_type
in_degree(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceAccessGraph::degree_size_type>(g.getInEdgeList(u).size());
}

inline ResourceAccessGraph::degree_size_type
degree(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<ResourceAccessGraph::adjacency_iterator, ResourceAccessGraph::adjacency_iterator>
adjacent_vertices(ResourceAccessGraph::vertex_descriptor u, const ResourceAccessGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(ResourceAccessGraph::adjacency_iterator(edges.first, &g), ResourceAccessGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<ResourceAccessGraph::vertex_iterator, ResourceAccessGraph::vertex_iterator>
vertices(const ResourceAccessGraph& g) noexcept {
    return std::make_pair(const_cast<ResourceAccessGraph&>(g).getVertexList().begin(), const_cast<ResourceAccessGraph&>(g).getVertexList().end());
}

inline ResourceAccessGraph::vertices_size_type
num_vertices(const ResourceAccessGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceAccessGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<ResourceAccessGraph::edge_iterator, ResourceAccessGraph::edge_iterator>
edges(const ResourceAccessGraph& g0) noexcept {
    auto& g = const_cast<ResourceAccessGraph&>(g0);
    return std::make_pair(
        ResourceAccessGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        ResourceAccessGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline ResourceAccessGraph::edges_size_type
num_edges(const ResourceAccessGraph& g) noexcept { // NOLINT
    ResourceAccessGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<ResourceAccessGraph::edge_descriptor, bool>
add_edge( // NOLINT
    ResourceAccessGraph::vertex_descriptor u,
    ResourceAccessGraph::vertex_descriptor v, ResourceAccessGraph& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(ResourceAccessGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph::vertex_descriptor v, ResourceAccessGraph& g) noexcept { // NOLINT
    auto& s = g.vertices[u];
    auto& t = g.vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), ResourceAccessGraph::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), ResourceAccessGraph::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(ResourceAccessGraph::out_edge_iterator outIter, ResourceAccessGraph& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g.vertices[u];
    auto& t = g.vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), ResourceAccessGraph::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(ResourceAccessGraph::edge_descriptor e, ResourceAccessGraph& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g.vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), ResourceAccessGraph::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(ResourceAccessGraph::out_edge_iterator(outIter, u), g);
}

// MutableGraph(Vertex)
inline void clear_out_edges(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph& g) noexcept { // NOLINT
    // Bidirectional (OutEdges)
    auto& outEdgeList = g.getOutEdgeList(u);
    auto  outEnd      = outEdgeList.end();
    for (auto iter = outEdgeList.begin(); iter != outEnd; ++iter) {
        auto& inEdgeList = g.getInEdgeList((*iter).get_target());
        // eraseFromIncidenceList
        impl::sequenceEraseIf(inEdgeList, [u](const auto& e) {
            return e.get_target() == u;
        });
    }
    outEdgeList.clear();
}

inline void clear_in_edges(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph& g) noexcept { // NOLINT
    // Bidirectional (InEdges)
    auto& inEdgeList = g.getInEdgeList(u);
    auto  inEnd      = inEdgeList.end();
    for (auto iter = inEdgeList.begin(); iter != inEnd; ++iter) {
        auto& outEdgeList = g.getOutEdgeList((*iter).get_target());
        // eraseFromIncidenceList
        impl::sequenceEraseIf(outEdgeList, [u](const auto& e) {
            return e.get_target() == u;
        });
    }
    inEdgeList.clear();
}

inline void clear_vertex(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex(ResourceAccessGraph::vertex_descriptor u, ResourceAccessGraph& g) noexcept { // NOLINT
    { // UuidGraph
        const auto& key = g.passID[u];
        auto num = g.passIndex.erase(key);
        CC_ENSURES(num == 1);
        for (auto&& pair : g.passIndex) {
            auto& v = pair.second;
            if (v > u) {
                --v;
            }
        }
    }
    impl::removeVectorVertex(const_cast<ResourceAccessGraph&>(g), u, ResourceAccessGraph::directed_category{});

    // remove components
    g.passID.erase(g.passID.begin() + std::ptrdiff_t(u));
    g.access.erase(g.access.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class Component0, class Component1>
inline ResourceAccessGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, ResourceAccessGraph& g) {
    auto v = gsl::narrow_cast<ResourceAccessGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        const auto& uuid = c0;
        auto res = g.passIndex.emplace(uuid, v);
        CC_ENSURES(res.second);
    }
    g.passID.emplace_back(std::forward<Component0>(c0));
    g.access.emplace_back(std::forward<Component1>(c1));

    return v;
}

template <class Component0, class Component1>
inline ResourceAccessGraph::vertex_descriptor
addVertex(std::piecewise_construct_t /*tag*/, Component0&& c0, Component1&& c1, ResourceAccessGraph& g) {
    auto v = gsl::narrow_cast<ResourceAccessGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        invoke_hpp::apply(
            [&](const auto&... args) {
                auto res = g.passIndex.emplace(std::piecewise_construct, std::forward_as_tuple(args...), std::forward_as_tuple(v));
                CC_ENSURES(res.second);
            },
            c0);
    }

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.passID.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.access.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    return v;
}

} // namespace render

} // namespace cc

namespace boost {

// Vertex Index
template <>
struct property_map<cc::render::ResourceAccessGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceAccessGraph, cc::render::ResourceAccessGraph::PassIDTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceAccessGraph,
        const ccstd::pmr::vector<cc::render::RenderGraph::vertex_descriptor>,
        cc::render::RenderGraph::vertex_descriptor,
        const cc::render::RenderGraph::vertex_descriptor&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceAccessGraph,
        ccstd::pmr::vector<cc::render::RenderGraph::vertex_descriptor>,
        cc::render::RenderGraph::vertex_descriptor,
        cc::render::RenderGraph::vertex_descriptor&>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceAccessGraph, cc::render::ResourceAccessGraph::AccessNodeTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceAccessGraph,
        const ccstd::pmr::vector<cc::render::ResourceAccessNode>,
        cc::render::ResourceAccessNode,
        const cc::render::ResourceAccessNode&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceAccessGraph,
        ccstd::pmr::vector<cc::render::ResourceAccessNode>,
        cc::render::ResourceAccessNode,
        cc::render::ResourceAccessNode&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceAccessGraph, T cc::render::ResourceAccessNode::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceAccessGraph,
        const ccstd::pmr::vector<cc::render::ResourceAccessNode>,
        T,
        const T&,
        T cc::render::ResourceAccessNode::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceAccessGraph,
        ccstd::pmr::vector<cc::render::ResourceAccessNode>,
        T,
        T&,
        T cc::render::ResourceAccessNode::*>;
};

} // namespace boost

namespace cc {

namespace render {

// Vertex Index
inline boost::property_map<ResourceAccessGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const ResourceAccessGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<ResourceAccessGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, ResourceAccessGraph& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<ResourceAccessGraph::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const ResourceAccessGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<ResourceAccessGraph, ResourceAccessGraph::PassIDTag>::const_type
get(ResourceAccessGraph::PassIDTag /*tag*/, const ResourceAccessGraph& g) noexcept {
    return {g.passID};
}

inline typename boost::property_map<ResourceAccessGraph, ResourceAccessGraph::PassIDTag>::type
get(ResourceAccessGraph::PassIDTag /*tag*/, ResourceAccessGraph& g) noexcept {
    return {g.passID};
}

// Vertex Component
inline typename boost::property_map<ResourceAccessGraph, ResourceAccessGraph::AccessNodeTag>::const_type
get(ResourceAccessGraph::AccessNodeTag /*tag*/, const ResourceAccessGraph& g) noexcept {
    return {g.access};
}

inline typename boost::property_map<ResourceAccessGraph, ResourceAccessGraph::AccessNodeTag>::type
get(ResourceAccessGraph::AccessNodeTag /*tag*/, ResourceAccessGraph& g) noexcept {
    return {g.access};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<ResourceAccessGraph, T ResourceAccessNode::*>::const_type
get(T ResourceAccessNode::*memberPointer, const ResourceAccessGraph& g) noexcept {
    return {g.access, memberPointer};
}

template <class T>
inline typename boost::property_map<ResourceAccessGraph, T ResourceAccessNode::*>::type
get(T ResourceAccessNode::*memberPointer, ResourceAccessGraph& g) noexcept {
    return {g.access, memberPointer};
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const ResourceAccessGraph& g, ResourceAccessGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, ResourceAccessGraph& g, ResourceAccessGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, ResourceAccessGraph& g,
    ResourceAccessGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// UuidGraph
inline ResourceAccessGraph::vertex_descriptor
vertex(const RenderGraph::vertex_descriptor& key, const ResourceAccessGraph& g) {
    return g.passIndex.at(key);
}

template <class KeyLike>
inline ResourceAccessGraph::vertex_descriptor
vertex(const KeyLike& key, const ResourceAccessGraph& g) {
    const auto& index = g.passIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        throw std::out_of_range("at(key, ResourceAccessGraph) out of range");
    }
    return iter->second;
}

template <class KeyLike>
inline ResourceAccessGraph::vertex_descriptor
findVertex(const KeyLike& key, const ResourceAccessGraph& g) noexcept {
    const auto& index = g.passIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        return ResourceAccessGraph::null_vertex();
    }
    return iter->second;
}

inline bool
contains(const RenderGraph::vertex_descriptor& key, const ResourceAccessGraph& g) noexcept {
    auto iter = g.passIndex.find(key);
    return iter != g.passIndex.end();
}

template <class KeyLike>
inline bool
contains(const KeyLike& key, const ResourceAccessGraph& g) noexcept {
    auto iter = g.passIndex.find(key);
    return iter != g.passIndex.end();
}

// MutableGraph(Vertex)
inline ResourceAccessGraph::vertex_descriptor
add_vertex(ResourceAccessGraph& g, const RenderGraph::vertex_descriptor& key) { // NOLINT
    return addVertex(
        std::piecewise_construct,
        std::forward_as_tuple(key), // passID
        std::forward_as_tuple(), // access
        g);
}

} // namespace render

} // namespace cc

// clang-format on
