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
#include <string_view>
#include <tuple>
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/details/Overload.h"
#include "cocos/renderer/pipeline/custom/details/PathUtils.h"

namespace cc {

namespace render {

// IncidenceGraph
inline SubpassGraph::vertex_descriptor
source(const SubpassGraph::edge_descriptor& e, const SubpassGraph& /*g*/) noexcept {
    return e.source;
}

inline SubpassGraph::vertex_descriptor
target(const SubpassGraph::edge_descriptor& e, const SubpassGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<SubpassGraph::out_edge_iterator, SubpassGraph::out_edge_iterator>
out_edges(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept { // NOLINT
    return std::make_pair(
        SubpassGraph::out_edge_iterator(const_cast<SubpassGraph&>(g).getOutEdgeList(u).begin(), u),
        SubpassGraph::out_edge_iterator(const_cast<SubpassGraph&>(g).getOutEdgeList(u).end(), u));
}

inline SubpassGraph::degree_size_type
out_degree(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<SubpassGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<SubpassGraph::edge_descriptor, bool>
edge(SubpassGraph::vertex_descriptor u, SubpassGraph::vertex_descriptor v, const SubpassGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), SubpassGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {SubpassGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<SubpassGraph::in_edge_iterator, SubpassGraph::in_edge_iterator>
in_edges(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept { // NOLINT
    return std::make_pair(
        SubpassGraph::in_edge_iterator(const_cast<SubpassGraph&>(g).getInEdgeList(u).begin(), u),
        SubpassGraph::in_edge_iterator(const_cast<SubpassGraph&>(g).getInEdgeList(u).end(), u));
}

inline SubpassGraph::degree_size_type
in_degree(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<SubpassGraph::degree_size_type>(g.getInEdgeList(u).size());
}

inline SubpassGraph::degree_size_type
degree(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<SubpassGraph::adjacency_iterator, SubpassGraph::adjacency_iterator>
adjacent_vertices(SubpassGraph::vertex_descriptor u, const SubpassGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(SubpassGraph::adjacency_iterator(edges.first, &g), SubpassGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<SubpassGraph::vertex_iterator, SubpassGraph::vertex_iterator>
vertices(const SubpassGraph& g) noexcept {
    return std::make_pair(const_cast<SubpassGraph&>(g).getVertexList().begin(), const_cast<SubpassGraph&>(g).getVertexList().end());
}

inline SubpassGraph::vertices_size_type
num_vertices(const SubpassGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<SubpassGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<SubpassGraph::edge_iterator, SubpassGraph::edge_iterator>
edges(const SubpassGraph& g0) noexcept {
    auto& g = const_cast<SubpassGraph&>(g0);
    return std::make_pair(
        SubpassGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        SubpassGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline SubpassGraph::edges_size_type
num_edges(const SubpassGraph& g) noexcept { // NOLINT
    SubpassGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<SubpassGraph::edge_descriptor, bool>
add_edge( // NOLINT
    SubpassGraph::vertex_descriptor u,
    SubpassGraph::vertex_descriptor v, SubpassGraph& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(SubpassGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(SubpassGraph::vertex_descriptor u, SubpassGraph::vertex_descriptor v, SubpassGraph& g) noexcept { // NOLINT
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), SubpassGraph::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), SubpassGraph::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(SubpassGraph::out_edge_iterator outIter, SubpassGraph& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), SubpassGraph::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(SubpassGraph::edge_descriptor e, SubpassGraph& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), SubpassGraph::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(SubpassGraph::out_edge_iterator(outIter, u), g);
}

// MutableGraph(Vertex)
inline void clear_out_edges(SubpassGraph::vertex_descriptor u, SubpassGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(SubpassGraph::vertex_descriptor u, SubpassGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(SubpassGraph::vertex_descriptor u, SubpassGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex(SubpassGraph::vertex_descriptor u, SubpassGraph& g) noexcept { // NOLINT
    impl::removeVectorVertex(const_cast<SubpassGraph&>(g), u, SubpassGraph::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + static_cast<std::ptrdiff_t>(u));
    g.subpasses.erase(g.subpasses.begin() + static_cast<std::ptrdiff_t>(u));
}

// MutablePropertyGraph(Vertex)
template <class Component0, class Component1>
inline SubpassGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, SubpassGraph& g) {
    auto v = gsl::narrow_cast<SubpassGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.subpasses.emplace_back(std::forward<Component1>(c1));

    return v;
}

template <class Component0, class Component1>
inline SubpassGraph::vertex_descriptor
addVertex(std::piecewise_construct_t /*tag*/, Component0&& c0, Component1&& c1, SubpassGraph& g) {
    auto v = gsl::narrow_cast<SubpassGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();

    std::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    std::apply(
        [&](auto&&... args) {
            g.subpasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    return v;
}

// IncidenceGraph
inline ResourceGraph::vertex_descriptor
source(const ResourceGraph::edge_descriptor& e, const ResourceGraph& /*g*/) noexcept {
    return e.source;
}

inline ResourceGraph::vertex_descriptor
target(const ResourceGraph::edge_descriptor& e, const ResourceGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<ResourceGraph::out_edge_iterator, ResourceGraph::out_edge_iterator>
out_edges(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        ResourceGraph::out_edge_iterator(const_cast<ResourceGraph&>(g).getOutEdgeList(u).begin(), u),
        ResourceGraph::out_edge_iterator(const_cast<ResourceGraph&>(g).getOutEdgeList(u).end(), u));
}

inline ResourceGraph::degree_size_type
out_degree(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<ResourceGraph::edge_descriptor, bool>
edge(ResourceGraph::vertex_descriptor u, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), ResourceGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {ResourceGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<ResourceGraph::in_edge_iterator, ResourceGraph::in_edge_iterator>
in_edges(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        ResourceGraph::in_edge_iterator(const_cast<ResourceGraph&>(g).getInEdgeList(u).begin(), u),
        ResourceGraph::in_edge_iterator(const_cast<ResourceGraph&>(g).getInEdgeList(u).end(), u));
}

inline ResourceGraph::degree_size_type
in_degree(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceGraph::degree_size_type>(g.getInEdgeList(u).size());
}

inline ResourceGraph::degree_size_type
degree(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<ResourceGraph::adjacency_iterator, ResourceGraph::adjacency_iterator>
adjacent_vertices(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(ResourceGraph::adjacency_iterator(edges.first, &g), ResourceGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<ResourceGraph::vertex_iterator, ResourceGraph::vertex_iterator>
vertices(const ResourceGraph& g) noexcept {
    return std::make_pair(const_cast<ResourceGraph&>(g).getVertexList().begin(), const_cast<ResourceGraph&>(g).getVertexList().end());
}

inline ResourceGraph::vertices_size_type
num_vertices(const ResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<ResourceGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<ResourceGraph::edge_iterator, ResourceGraph::edge_iterator>
edges(const ResourceGraph& g0) noexcept {
    auto& g = const_cast<ResourceGraph&>(g0);
    return std::make_pair(
        ResourceGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        ResourceGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline ResourceGraph::edges_size_type
num_edges(const ResourceGraph& g) noexcept { // NOLINT
    ResourceGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<ResourceGraph::edge_descriptor, bool>
add_edge( // NOLINT
    ResourceGraph::vertex_descriptor u,
    ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(ResourceGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(ResourceGraph::vertex_descriptor u, ResourceGraph::vertex_descriptor v, ResourceGraph& g) noexcept { // NOLINT
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), ResourceGraph::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), ResourceGraph::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(ResourceGraph::out_edge_iterator outIter, ResourceGraph& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), ResourceGraph::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(ResourceGraph::edge_descriptor e, ResourceGraph& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), ResourceGraph::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(ResourceGraph::out_edge_iterator(outIter, u), g);
}

// AddressableGraph
inline ResourceGraph::vertex_descriptor
parent(const ResourceGraph::ownership_descriptor& e, const ResourceGraph& /*g*/) noexcept {
    return e.source;
}

inline ResourceGraph::vertex_descriptor
child(const ResourceGraph::ownership_descriptor& e, const ResourceGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<ResourceGraph::children_iterator, ResourceGraph::children_iterator>
children(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    return std::make_pair(
        ResourceGraph::children_iterator(const_cast<ResourceGraph&>(g).getChildrenList(u).begin(), u),
        ResourceGraph::children_iterator(const_cast<ResourceGraph&>(g).getChildrenList(u).end(), u));
}

inline ResourceGraph::children_size_type
numChildren(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    return gsl::narrow_cast<ResourceGraph::children_size_type>(g.getChildrenList(u).size());
}

inline std::pair<ResourceGraph::ownership_descriptor, bool>
reference(ResourceGraph::vertex_descriptor u, ResourceGraph::vertex_descriptor v, ResourceGraph& g) noexcept {
    auto& outEdgeList = g.getChildrenList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), ResourceGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {ResourceGraph::ownership_descriptor(u, v), hasEdge};
}

inline std::pair<ResourceGraph::parent_iterator, ResourceGraph::parent_iterator>
parents(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    return std::make_pair(
        ResourceGraph::parent_iterator(const_cast<ResourceGraph&>(g).getParentsList(u).begin(), u),
        ResourceGraph::parent_iterator(const_cast<ResourceGraph&>(g).getParentsList(u).end(), u));
}

inline ResourceGraph::children_size_type
numParents(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    return gsl::narrow_cast<ResourceGraph::children_size_type>(g.getParentsList(u).size());
}

inline ResourceGraph::vertex_descriptor
parent(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    auto r = parents(u, g);
    if (r.first == r.second) {
        return ResourceGraph::null_vertex();
    }
    return parent(*r.first, g);
}

inline bool
ancestor(ResourceGraph::vertex_descriptor u, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    CC_EXPECTS(u != v);
    bool isAncestor = false;
    auto r          = parents(v, g);
    while (r.first != r.second) {
        v = parent(*r.first, g);
        if (u == v) {
            isAncestor = true;
            break;
        }
        r = parents(v, g);
    }
    return isAncestor;
}

inline std::pair<ResourceGraph::ownership_iterator, ResourceGraph::ownership_iterator>
references(const ResourceGraph& g0) noexcept {
    auto& g = const_cast<ResourceGraph&>(g0);
    return std::make_pair(
        ResourceGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        ResourceGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline ResourceGraph::ownerships_size_type
numReferences(const ResourceGraph& g) noexcept {
    ResourceGraph::ownerships_size_type numEdges = 0;
    auto                                range    = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += numChildren(*iter, g);
    }
    return numEdges;
}

// IncidenceGraph
inline RenderGraph::vertex_descriptor
source(const RenderGraph::edge_descriptor& e, const RenderGraph& /*g*/) noexcept {
    return e.source;
}

inline RenderGraph::vertex_descriptor
target(const RenderGraph::edge_descriptor& e, const RenderGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<RenderGraph::out_edge_iterator, RenderGraph::out_edge_iterator>
out_edges(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderGraph::out_edge_iterator(const_cast<RenderGraph&>(g).getOutEdgeList(u).begin(), u),
        RenderGraph::out_edge_iterator(const_cast<RenderGraph&>(g).getOutEdgeList(u).end(), u));
}

inline RenderGraph::degree_size_type
out_degree(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<RenderGraph::edge_descriptor, bool>
edge(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {RenderGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<RenderGraph::in_edge_iterator, RenderGraph::in_edge_iterator>
in_edges(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderGraph::in_edge_iterator(const_cast<RenderGraph&>(g).getInEdgeList(u).begin(), u),
        RenderGraph::in_edge_iterator(const_cast<RenderGraph&>(g).getInEdgeList(u).end(), u));
}

inline RenderGraph::degree_size_type
in_degree(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderGraph::degree_size_type>(g.getInEdgeList(u).size());
}

inline RenderGraph::degree_size_type
degree(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<RenderGraph::adjacency_iterator, RenderGraph::adjacency_iterator>
adjacent_vertices(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(RenderGraph::adjacency_iterator(edges.first, &g), RenderGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<RenderGraph::vertex_iterator, RenderGraph::vertex_iterator>
vertices(const RenderGraph& g) noexcept {
    return std::make_pair(const_cast<RenderGraph&>(g).getVertexList().begin(), const_cast<RenderGraph&>(g).getVertexList().end());
}

inline RenderGraph::vertices_size_type
num_vertices(const RenderGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<RenderGraph::edge_iterator, RenderGraph::edge_iterator>
edges(const RenderGraph& g0) noexcept {
    auto& g = const_cast<RenderGraph&>(g0);
    return std::make_pair(
        RenderGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        RenderGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline RenderGraph::edges_size_type
num_edges(const RenderGraph& g) noexcept { // NOLINT
    RenderGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<RenderGraph::edge_descriptor, bool>
add_edge( // NOLINT
    RenderGraph::vertex_descriptor u,
    RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(RenderGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, RenderGraph& g) noexcept { // NOLINT
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), RenderGraph::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), RenderGraph::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(RenderGraph::out_edge_iterator outIter, RenderGraph& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), RenderGraph::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(RenderGraph::edge_descriptor e, RenderGraph& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), RenderGraph::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(RenderGraph::out_edge_iterator(outIter, u), g);
}

// AddressableGraph
inline RenderGraph::vertex_descriptor
parent(const RenderGraph::ownership_descriptor& e, const RenderGraph& /*g*/) noexcept {
    return e.source;
}

inline RenderGraph::vertex_descriptor
child(const RenderGraph::ownership_descriptor& e, const RenderGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<RenderGraph::children_iterator, RenderGraph::children_iterator>
children(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    return std::make_pair(
        RenderGraph::children_iterator(const_cast<RenderGraph&>(g).getChildrenList(u).begin(), u),
        RenderGraph::children_iterator(const_cast<RenderGraph&>(g).getChildrenList(u).end(), u));
}

inline RenderGraph::children_size_type
numChildren(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    return gsl::narrow_cast<RenderGraph::children_size_type>(g.getChildrenList(u).size());
}

inline std::pair<RenderGraph::ownership_descriptor, bool>
reference(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, RenderGraph& g) noexcept {
    auto& outEdgeList = g.getChildrenList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {RenderGraph::ownership_descriptor(u, v), hasEdge};
}

inline std::pair<RenderGraph::parent_iterator, RenderGraph::parent_iterator>
parents(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    return std::make_pair(
        RenderGraph::parent_iterator(const_cast<RenderGraph&>(g).getParentsList(u).begin(), u),
        RenderGraph::parent_iterator(const_cast<RenderGraph&>(g).getParentsList(u).end(), u));
}

inline RenderGraph::children_size_type
numParents(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    return gsl::narrow_cast<RenderGraph::children_size_type>(g.getParentsList(u).size());
}

inline RenderGraph::vertex_descriptor
parent(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    auto r = parents(u, g);
    if (r.first == r.second) {
        return RenderGraph::null_vertex();
    }
    return parent(*r.first, g);
}

inline bool
ancestor(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    CC_EXPECTS(u != v);
    bool isAncestor = false;
    auto r          = parents(v, g);
    while (r.first != r.second) {
        v = parent(*r.first, g);
        if (u == v) {
            isAncestor = true;
            break;
        }
        r = parents(v, g);
    }
    return isAncestor;
}

inline std::pair<RenderGraph::ownership_iterator, RenderGraph::ownership_iterator>
references(const RenderGraph& g0) noexcept {
    auto& g = const_cast<RenderGraph&>(g0);
    return std::make_pair(
        RenderGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        RenderGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline RenderGraph::ownerships_size_type
numReferences(const RenderGraph& g) noexcept {
    RenderGraph::ownerships_size_type numEdges = 0;
    auto                              range    = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += numChildren(*iter, g);
    }
    return numEdges;
}

} // namespace render

} // namespace cc

namespace boost {

// Vertex Index
template <>
struct property_map<cc::render::SubpassGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::SubpassGraph, cc::render::SubpassGraph::NameTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::SubpassGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::SubpassGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::SubpassGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::SubpassGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::SubpassGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::SubpassGraph, cc::render::SubpassGraph::SubpassTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::SubpassGraph,
        const ccstd::pmr::vector<cc::render::Subpass>,
        cc::render::Subpass,
        const cc::render::Subpass&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::SubpassGraph,
        ccstd::pmr::vector<cc::render::Subpass>,
        cc::render::Subpass,
        cc::render::Subpass&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::SubpassGraph, T cc::render::Subpass::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::SubpassGraph,
        const ccstd::pmr::vector<cc::render::Subpass>,
        T,
        const T&,
        T cc::render::Subpass::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::SubpassGraph,
        ccstd::pmr::vector<cc::render::Subpass>,
        T,
        T&,
        T cc::render::Subpass::*>;
};

// Vertex Index
template <>
struct property_map<cc::render::ResourceGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::NameTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::ResourceGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::DescTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceDesc>,
        cc::render::ResourceDesc,
        const cc::render::ResourceDesc&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceDesc>,
        cc::render::ResourceDesc,
        cc::render::ResourceDesc&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceGraph, T cc::render::ResourceDesc::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceDesc>,
        T,
        const T&,
        T cc::render::ResourceDesc::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceDesc>,
        T,
        T&,
        T cc::render::ResourceDesc::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::TraitsTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceTraits>,
        cc::render::ResourceTraits,
        const cc::render::ResourceTraits&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceTraits>,
        cc::render::ResourceTraits,
        cc::render::ResourceTraits&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceGraph, T cc::render::ResourceTraits::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceTraits>,
        T,
        const T&,
        T cc::render::ResourceTraits::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceTraits>,
        T,
        T&,
        T cc::render::ResourceTraits::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::StatesTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceStates>,
        cc::render::ResourceStates,
        const cc::render::ResourceStates&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceStates>,
        cc::render::ResourceStates,
        cc::render::ResourceStates&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceGraph, T cc::render::ResourceStates::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::render::ResourceStates>,
        T,
        const T&,
        T cc::render::ResourceStates::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::render::ResourceStates>,
        T,
        T&,
        T cc::render::ResourceStates::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::SamplerTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const ccstd::pmr::vector<cc::gfx::SamplerInfo>,
        cc::gfx::SamplerInfo,
        const cc::gfx::SamplerInfo&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        ccstd::pmr::vector<cc::gfx::SamplerInfo>,
        cc::gfx::SamplerInfo,
        cc::gfx::SamplerInfo&>;
};

// Vertex Index
template <>
struct property_map<cc::render::RenderGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::NameTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::RenderGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::LayoutTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::DataTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<cc::render::RenderData>,
        cc::render::RenderData,
        const cc::render::RenderData&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<cc::render::RenderData>,
        cc::render::RenderData,
        cc::render::RenderData&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::RenderGraph, T cc::render::RenderData::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<cc::render::RenderData>,
        T,
        const T&,
        T cc::render::RenderData::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<cc::render::RenderData>,
        T,
        T&,
        T cc::render::RenderData::*>;
};

// Vertex ComponentMember(String)
template <>
struct property_map<cc::render::RenderGraph, ccstd::pmr::string cc::render::RenderData::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<cc::render::RenderData>,
        std::string_view,
        const ccstd::pmr::string&,
        const ccstd::pmr::string cc::render::RenderData::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<cc::render::RenderData>,
        std::string_view,
        ccstd::pmr::string&,
        ccstd::pmr::string cc::render::RenderData::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::ValidTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::RenderGraph,
        const ccstd::pmr::vector<bool>,
        bool,
        const bool&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::RenderGraph,
        ccstd::pmr::vector<bool>,
        bool,
        bool&>;
};

} // namespace boost

namespace cc {

namespace render {

// Vertex Index
inline boost::property_map<SubpassGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const SubpassGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<SubpassGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, SubpassGraph& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<SubpassGraph::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const SubpassGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<SubpassGraph, SubpassGraph::NameTag>::const_type
get(SubpassGraph::NameTag /*tag*/, const SubpassGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<SubpassGraph, SubpassGraph::NameTag>::type
get(SubpassGraph::NameTag /*tag*/, SubpassGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<SubpassGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const SubpassGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<SubpassGraph, SubpassGraph::SubpassTag>::const_type
get(SubpassGraph::SubpassTag /*tag*/, const SubpassGraph& g) noexcept {
    return {g.subpasses};
}

inline typename boost::property_map<SubpassGraph, SubpassGraph::SubpassTag>::type
get(SubpassGraph::SubpassTag /*tag*/, SubpassGraph& g) noexcept {
    return {g.subpasses};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<SubpassGraph, T Subpass::*>::const_type
get(T Subpass::*memberPointer, const SubpassGraph& g) noexcept {
    return {g.subpasses, memberPointer};
}

template <class T>
inline typename boost::property_map<SubpassGraph, T Subpass::*>::type
get(T Subpass::*memberPointer, SubpassGraph& g) noexcept {
    return {g.subpasses, memberPointer};
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const SubpassGraph& g, SubpassGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, SubpassGraph& g, SubpassGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, SubpassGraph& g,
    SubpassGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// MutableGraph(Vertex)
inline SubpassGraph::vertex_descriptor
add_vertex(SubpassGraph& g, ccstd::pmr::string&& name) { // NOLINT
    return addVertex(
        std::piecewise_construct,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // subpasses
        g);
}

inline SubpassGraph::vertex_descriptor
add_vertex(SubpassGraph& g, const char* name) { // NOLINT
    return addVertex(
        std::piecewise_construct,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // subpasses
        g);
}

// Vertex Index
inline boost::property_map<ResourceGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const ResourceGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<ResourceGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, ResourceGraph& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<ResourceGraph::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const ResourceGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::NameTag>::const_type
get(ResourceGraph::NameTag /*tag*/, const ResourceGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::NameTag>::type
get(ResourceGraph::NameTag /*tag*/, ResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<ResourceGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const ResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::DescTag>::const_type
get(ResourceGraph::DescTag /*tag*/, const ResourceGraph& g) noexcept {
    return {g.descs};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::DescTag>::type
get(ResourceGraph::DescTag /*tag*/, ResourceGraph& g) noexcept {
    return {g.descs};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceDesc::*>::const_type
get(T ResourceDesc::*memberPointer, const ResourceGraph& g) noexcept {
    return {g.descs, memberPointer};
}

template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceDesc::*>::type
get(T ResourceDesc::*memberPointer, ResourceGraph& g) noexcept {
    return {g.descs, memberPointer};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::TraitsTag>::const_type
get(ResourceGraph::TraitsTag /*tag*/, const ResourceGraph& g) noexcept {
    return {g.traits};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::TraitsTag>::type
get(ResourceGraph::TraitsTag /*tag*/, ResourceGraph& g) noexcept {
    return {g.traits};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceTraits::*>::const_type
get(T ResourceTraits::*memberPointer, const ResourceGraph& g) noexcept {
    return {g.traits, memberPointer};
}

template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceTraits::*>::type
get(T ResourceTraits::*memberPointer, ResourceGraph& g) noexcept {
    return {g.traits, memberPointer};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::StatesTag>::const_type
get(ResourceGraph::StatesTag /*tag*/, const ResourceGraph& g) noexcept {
    return {g.states};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::StatesTag>::type
get(ResourceGraph::StatesTag /*tag*/, ResourceGraph& g) noexcept {
    return {g.states};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceStates::*>::const_type
get(T ResourceStates::*memberPointer, const ResourceGraph& g) noexcept {
    return {g.states, memberPointer};
}

template <class T>
inline typename boost::property_map<ResourceGraph, T ResourceStates::*>::type
get(T ResourceStates::*memberPointer, ResourceGraph& g) noexcept {
    return {g.states, memberPointer};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::SamplerTag>::const_type
get(ResourceGraph::SamplerTag /*tag*/, const ResourceGraph& g) noexcept {
    return {g.samplerInfo};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::SamplerTag>::type
get(ResourceGraph::SamplerTag /*tag*/, ResourceGraph& g) noexcept {
    return {g.samplerInfo};
}

// PolymorphicGraph
inline ResourceGraph::vertices_size_type
id(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    using vertex_descriptor = ResourceGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<ManagedTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ManagedBufferTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ManagedTextureTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<PersistentBufferTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<PersistentTextureTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<FramebufferTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<SwapchainTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<FormatViewTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<SubresourceViewTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g._vertices[u].handle);
}

inline ResourceGraph::VertexTag
tag(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    using vertex_descriptor = ResourceGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<ManagedTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{ManagedTag{}};
            },
            [](const impl::ValueHandle<ManagedBufferTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{ManagedBufferTag{}};
            },
            [](const impl::ValueHandle<ManagedTextureTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{ManagedTextureTag{}};
            },
            [](const impl::ValueHandle<PersistentBufferTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{PersistentBufferTag{}};
            },
            [](const impl::ValueHandle<PersistentTextureTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{PersistentTextureTag{}};
            },
            [](const impl::ValueHandle<FramebufferTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{FramebufferTag{}};
            },
            [](const impl::ValueHandle<SwapchainTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{SwapchainTag{}};
            },
            [](const impl::ValueHandle<FormatViewTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{FormatViewTag{}};
            },
            [](const impl::ValueHandle<SubresourceViewTag, vertex_descriptor>&) {
                return ResourceGraph::VertexTag{SubresourceViewTag{}};
            }),
        g._vertices[u].handle);
}

inline ResourceGraph::VertexValue
value(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept {
    using vertex_descriptor = ResourceGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<ManagedTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.resources[h.value]};
            },
            [&](const impl::ValueHandle<ManagedBufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.managedBuffers[h.value]};
            },
            [&](const impl::ValueHandle<ManagedTextureTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.managedTextures[h.value]};
            },
            [&](const impl::ValueHandle<PersistentBufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.buffers[h.value]};
            },
            [&](const impl::ValueHandle<PersistentTextureTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.textures[h.value]};
            },
            [&](const impl::ValueHandle<FramebufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.framebuffers[h.value]};
            },
            [&](const impl::ValueHandle<SwapchainTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.swapchains[h.value]};
            },
            [&](const impl::ValueHandle<FormatViewTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.formatViews[h.value]};
            },
            [&](const impl::ValueHandle<SubresourceViewTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexValue{&g.subresourceViews[h.value]};
            }),
        g._vertices[u].handle);
}

inline ResourceGraph::VertexConstValue
value(ResourceGraph::vertex_descriptor u, const ResourceGraph& g) noexcept {
    using vertex_descriptor = ResourceGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<ManagedTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.resources[h.value]};
            },
            [&](const impl::ValueHandle<ManagedBufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.managedBuffers[h.value]};
            },
            [&](const impl::ValueHandle<ManagedTextureTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.managedTextures[h.value]};
            },
            [&](const impl::ValueHandle<PersistentBufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.buffers[h.value]};
            },
            [&](const impl::ValueHandle<PersistentTextureTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.textures[h.value]};
            },
            [&](const impl::ValueHandle<FramebufferTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.framebuffers[h.value]};
            },
            [&](const impl::ValueHandle<SwapchainTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.swapchains[h.value]};
            },
            [&](const impl::ValueHandle<FormatViewTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.formatViews[h.value]};
            },
            [&](const impl::ValueHandle<SubresourceViewTag, vertex_descriptor>& h) {
                return ResourceGraph::VertexConstValue{&g.subresourceViews[h.value]};
            }),
        g._vertices[u].handle);
}

template <class Tag>
inline bool
holds(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept;

template <>
inline bool
holds<ManagedTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ManagedBufferTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ManagedTextureTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<PersistentBufferTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<PersistentTextureTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<FramebufferTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<SwapchainTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<FormatViewTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<SubresourceViewTag>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<ManagedResource>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ManagedBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ManagedTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<PersistentBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<PersistentTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<IntrusivePtr<gfx::Framebuffer>>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RenderSwapchain>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<FormatView>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<SubresourceView>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(ResourceGraph::vertex_descriptor /*v*/, ResourceGraph& /*g*/);

template <>
inline ManagedResource&
get<ManagedResource>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resources[handle.value];
}

template <>
inline ManagedBuffer&
get<ManagedBuffer>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedBuffers[handle.value];
}

template <>
inline ManagedTexture&
get<ManagedTexture>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedTextures[handle.value];
}

template <>
inline PersistentBuffer&
get<PersistentBuffer>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.buffers[handle.value];
}

template <>
inline PersistentTexture&
get<PersistentTexture>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.textures[handle.value];
}

template <>
inline IntrusivePtr<gfx::Framebuffer>&
get<IntrusivePtr<gfx::Framebuffer>>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.framebuffers[handle.value];
}

template <>
inline RenderSwapchain&
get<RenderSwapchain>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.swapchains[handle.value];
}

template <>
inline FormatView&
get<FormatView>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.formatViews[handle.value];
}

template <>
inline SubresourceView&
get<SubresourceView>(ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.subresourceViews[handle.value];
}

template <class ValueT>
inline const ValueT&
get(ResourceGraph::vertex_descriptor /*v*/, const ResourceGraph& /*g*/);

template <>
inline const ManagedResource&
get<ManagedResource>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resources[handle.value];
}

template <>
inline const ManagedBuffer&
get<ManagedBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedBuffers[handle.value];
}

template <>
inline const ManagedTexture&
get<ManagedTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedTextures[handle.value];
}

template <>
inline const PersistentBuffer&
get<PersistentBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.buffers[handle.value];
}

template <>
inline const PersistentTexture&
get<PersistentTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.textures[handle.value];
}

template <>
inline const IntrusivePtr<gfx::Framebuffer>&
get<IntrusivePtr<gfx::Framebuffer>>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.framebuffers[handle.value];
}

template <>
inline const RenderSwapchain&
get<RenderSwapchain>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.swapchains[handle.value];
}

template <>
inline const FormatView&
get<FormatView>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.formatViews[handle.value];
}

template <>
inline const SubresourceView&
get<SubresourceView>(ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.subresourceViews[handle.value];
}

inline ManagedResource&
get(ManagedTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resources[handle.value];
}

inline ManagedBuffer&
get(ManagedBufferTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedBuffers[handle.value];
}

inline ManagedTexture&
get(ManagedTextureTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedTextures[handle.value];
}

inline PersistentBuffer&
get(PersistentBufferTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.buffers[handle.value];
}

inline PersistentTexture&
get(PersistentTextureTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.textures[handle.value];
}

inline IntrusivePtr<gfx::Framebuffer>&
get(FramebufferTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.framebuffers[handle.value];
}

inline RenderSwapchain&
get(SwapchainTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.swapchains[handle.value];
}

inline FormatView&
get(FormatViewTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.formatViews[handle.value];
}

inline SubresourceView&
get(SubresourceViewTag /*tag*/, ResourceGraph::vertex_descriptor v, ResourceGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.subresourceViews[handle.value];
}

inline const ManagedResource&
get(ManagedTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resources[handle.value];
}

inline const ManagedBuffer&
get(ManagedBufferTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedBuffers[handle.value];
}

inline const ManagedTexture&
get(ManagedTextureTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.managedTextures[handle.value];
}

inline const PersistentBuffer&
get(PersistentBufferTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.buffers[handle.value];
}

inline const PersistentTexture&
get(PersistentTextureTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.textures[handle.value];
}

inline const IntrusivePtr<gfx::Framebuffer>&
get(FramebufferTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.framebuffers[handle.value];
}

inline const RenderSwapchain&
get(SwapchainTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.swapchains[handle.value];
}

inline const FormatView&
get(FormatViewTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.formatViews[handle.value];
}

inline const SubresourceView&
get(SubresourceViewTag /*tag*/, ResourceGraph::vertex_descriptor v, const ResourceGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.subresourceViews[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept; // NOLINT

template <>
inline ManagedResource*
get_if<ManagedResource>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    ManagedResource* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.resources[pHandle->value];
    }
    return ptr;
}

template <>
inline ManagedBuffer*
get_if<ManagedBuffer>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    ManagedBuffer* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.managedBuffers[pHandle->value];
    }
    return ptr;
}

template <>
inline ManagedTexture*
get_if<ManagedTexture>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    ManagedTexture* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.managedTextures[pHandle->value];
    }
    return ptr;
}

template <>
inline PersistentBuffer*
get_if<PersistentBuffer>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    PersistentBuffer* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.buffers[pHandle->value];
    }
    return ptr;
}

template <>
inline PersistentTexture*
get_if<PersistentTexture>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    PersistentTexture* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.textures[pHandle->value];
    }
    return ptr;
}

template <>
inline IntrusivePtr<gfx::Framebuffer>*
get_if<IntrusivePtr<gfx::Framebuffer>>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    IntrusivePtr<gfx::Framebuffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.framebuffers[pHandle->value];
    }
    return ptr;
}

template <>
inline RenderSwapchain*
get_if<RenderSwapchain>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    RenderSwapchain* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.swapchains[pHandle->value];
    }
    return ptr;
}

template <>
inline FormatView*
get_if<FormatView>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    FormatView* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.formatViews[pHandle->value];
    }
    return ptr;
}

template <>
inline SubresourceView*
get_if<SubresourceView>(ResourceGraph::vertex_descriptor v, ResourceGraph* pGraph) noexcept { // NOLINT
    SubresourceView* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.subresourceViews[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept; // NOLINT

template <>
inline const ManagedResource*
get_if<ManagedResource>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const ManagedResource* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.resources[pHandle->value];
    }
    return ptr;
}

template <>
inline const ManagedBuffer*
get_if<ManagedBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const ManagedBuffer* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.managedBuffers[pHandle->value];
    }
    return ptr;
}

template <>
inline const ManagedTexture*
get_if<ManagedTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const ManagedTexture* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.managedTextures[pHandle->value];
    }
    return ptr;
}

template <>
inline const PersistentBuffer*
get_if<PersistentBuffer>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const PersistentBuffer* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.buffers[pHandle->value];
    }
    return ptr;
}

template <>
inline const PersistentTexture*
get_if<PersistentTexture>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const PersistentTexture* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.textures[pHandle->value];
    }
    return ptr;
}

template <>
inline const IntrusivePtr<gfx::Framebuffer>*
get_if<IntrusivePtr<gfx::Framebuffer>>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const IntrusivePtr<gfx::Framebuffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.framebuffers[pHandle->value];
    }
    return ptr;
}

template <>
inline const RenderSwapchain*
get_if<RenderSwapchain>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const RenderSwapchain* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.swapchains[pHandle->value];
    }
    return ptr;
}

template <>
inline const FormatView*
get_if<FormatView>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const FormatView* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.formatViews[pHandle->value];
    }
    return ptr;
}

template <>
inline const SubresourceView*
get_if<SubresourceView>(ResourceGraph::vertex_descriptor v, const ResourceGraph* pGraph) noexcept { // NOLINT
    const SubresourceView* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.subresourceViews[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const ResourceGraph& g, ResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, ResourceGraph& g, ResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, ResourceGraph& g,
    ResourceGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// UuidGraph
inline ResourceGraph::vertex_descriptor
vertex(const ccstd::pmr::string& key, const ResourceGraph& g) {
    return g.valueIndex.at(key);
}

template <class KeyLike>
inline ResourceGraph::vertex_descriptor
vertex(const KeyLike& key, const ResourceGraph& g) {
    const auto& index = g.valueIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        throw std::out_of_range("at(key, ResourceGraph) out of range");
    }
    return iter->second;
}

template <class KeyLike>
inline ResourceGraph::vertex_descriptor
findVertex(const KeyLike& key, const ResourceGraph& g) noexcept {
    const auto& index = g.valueIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        return ResourceGraph::null_vertex();
    }
    return iter->second;
}

inline bool
contains(const ccstd::pmr::string& key, const ResourceGraph& g) noexcept {
    auto iter = g.valueIndex.find(key);
    return iter != g.valueIndex.end();
}

template <class KeyLike>
inline bool
contains(const KeyLike& key, const ResourceGraph& g) noexcept {
    auto iter = g.valueIndex.find(key);
    return iter != g.valueIndex.end();
}

// MutableGraph(Vertex)
inline void addPathImpl(ResourceGraph::vertex_descriptor u, ResourceGraph::vertex_descriptor v, ResourceGraph& g) { // NOLINT
    // add to parent
    if (u != ResourceGraph::null_vertex()) {
        auto& outEdgeList = g.getChildrenList(u);
        outEdgeList.emplace_back(v);

        auto& inEdgeList = g.getParentsList(v);
        inEdgeList.emplace_back(u);
    }
}

inline void clear_out_edges(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const ResourceGraph::VertexHandle& h, ResourceGraph& g) noexcept { // NOLINT
    using vertex_descriptor = ResourceGraph::vertex_descriptor;
    ccstd::visit(
        overload(
            [&](const impl::ValueHandle<ManagedTag, vertex_descriptor>& h) {
                g.resources.erase(g.resources.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.resources.size()) {
                    return;
                }
                impl::reindexVectorHandle<ManagedTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ManagedBufferTag, vertex_descriptor>& h) {
                g.managedBuffers.erase(g.managedBuffers.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.managedBuffers.size()) {
                    return;
                }
                impl::reindexVectorHandle<ManagedBufferTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ManagedTextureTag, vertex_descriptor>& h) {
                g.managedTextures.erase(g.managedTextures.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.managedTextures.size()) {
                    return;
                }
                impl::reindexVectorHandle<ManagedTextureTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<PersistentBufferTag, vertex_descriptor>& h) {
                g.buffers.erase(g.buffers.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.buffers.size()) {
                    return;
                }
                impl::reindexVectorHandle<PersistentBufferTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<PersistentTextureTag, vertex_descriptor>& h) {
                g.textures.erase(g.textures.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.textures.size()) {
                    return;
                }
                impl::reindexVectorHandle<PersistentTextureTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<FramebufferTag, vertex_descriptor>& h) {
                g.framebuffers.erase(g.framebuffers.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.framebuffers.size()) {
                    return;
                }
                impl::reindexVectorHandle<FramebufferTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<SwapchainTag, vertex_descriptor>& h) {
                g.swapchains.erase(g.swapchains.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.swapchains.size()) {
                    return;
                }
                impl::reindexVectorHandle<SwapchainTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<FormatViewTag, vertex_descriptor>& h) {
                g.formatViews.erase(g.formatViews.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.formatViews.size()) {
                    return;
                }
                impl::reindexVectorHandle<FormatViewTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<SubresourceViewTag, vertex_descriptor>& h) {
                g.subresourceViews.erase(g.subresourceViews.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.subresourceViews.size()) {
                    return;
                }
                impl::reindexVectorHandle<SubresourceViewTag>(g._vertices, h.value);
            }),
        h);
}

inline void remove_vertex(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g._vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    { // UuidGraph
        const auto& key = g.names[u];
        auto num = g.valueIndex.erase(key);
        CC_ENSURES(num == 1);
        for (auto&& pair : g.valueIndex) {
            auto& v = pair.second;
            if (v > u) {
                --v;
            }
        }
    }
    impl::removeVectorVertex(const_cast<ResourceGraph&>(g), u, ResourceGraph::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + static_cast<std::ptrdiff_t>(u));
    g.descs.erase(g.descs.begin() + static_cast<std::ptrdiff_t>(u));
    g.traits.erase(g.traits.begin() + static_cast<std::ptrdiff_t>(u));
    g.states.erase(g.states.begin() + static_cast<std::ptrdiff_t>(u));
    g.samplerInfo.erase(g.samplerInfo.begin() + static_cast<std::ptrdiff_t>(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ManagedResource>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.resources.size())};
    g.resources.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ManagedBuffer>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.managedBuffers.size())};
    g.managedBuffers.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ManagedTexture>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.managedTextures.size())};
    g.managedTextures.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, PersistentBuffer>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.buffers.size())};
    g.buffers.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, PersistentTexture>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.textures.size())};
    g.textures.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, IntrusivePtr<gfx::Framebuffer>>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.framebuffers.size())};
    g.framebuffers.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderSwapchain>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.swapchains.size())};
    g.swapchains.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, FormatView>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.formatViews.size())};
    g.formatViews.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, ResourceGraph &g, ResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, SubresourceView>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.subresourceViews.size())};
    g.subresourceViews.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class Component2, class Component3, class Component4, class ValueT>
inline ResourceGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, Component4&& c4, ValueT&& val, ResourceGraph& g, ResourceGraph::vertex_descriptor u = ResourceGraph::null_vertex()) {
    auto v = gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();

    { // UuidGraph
        const auto& uuid = c0;
        auto res = g.valueIndex.emplace(uuid, v);
        CC_ENSURES(res.second);
    }
    g.names.emplace_back(std::forward<Component0>(c0));
    g.descs.emplace_back(std::forward<Component1>(c1));
    g.traits.emplace_back(std::forward<Component2>(c2));
    g.states.emplace_back(std::forward<Component3>(c3));
    g.samplerInfo.emplace_back(std::forward<Component4>(c4));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

template <class Tuple>
void addVertexImpl(ManagedTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ManagedTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.resources.size())};
            g.resources.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ManagedBufferTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ManagedBufferTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.managedBuffers.size())};
            g.managedBuffers.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ManagedTextureTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ManagedTextureTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.managedTextures.size())};
            g.managedTextures.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(PersistentBufferTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<PersistentBufferTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.buffers.size())};
            g.buffers.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(PersistentTextureTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<PersistentTextureTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.textures.size())};
            g.textures.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(FramebufferTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<FramebufferTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.framebuffers.size())};
            g.framebuffers.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(SwapchainTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<SwapchainTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.swapchains.size())};
            g.swapchains.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(FormatViewTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<FormatViewTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.formatViews.size())};
            g.formatViews.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(SubresourceViewTag /*tag*/, Tuple &&val, ResourceGraph &g, ResourceGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<SubresourceViewTag, ResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.subresourceViews.size())};
            g.subresourceViews.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Component2, class Component3, class Component4, class Tag, class ValueT>
inline ResourceGraph::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, Component4&& c4, ValueT&& val, ResourceGraph& g, ResourceGraph::vertex_descriptor u = ResourceGraph::null_vertex()) {
    auto v = gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();

    { // UuidGraph
        std::apply(
            [&](const auto&... args) {
                auto res = g.valueIndex.emplace(std::piecewise_construct, std::forward_as_tuple(args...), std::forward_as_tuple(v));
                CC_ENSURES(res.second);
            },
            c0);
    }

    std::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    std::apply(
        [&](auto&&... args) {
            g.descs.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    std::apply(
        [&](auto&&... args) {
            g.traits.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    std::apply(
        [&](auto&&... args) {
            g.states.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component3>(c3));

    std::apply(
        [&](auto&&... args) {
            g.samplerInfo.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component4>(c4));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline ResourceGraph::vertex_descriptor
add_vertex(ResourceGraph& g, Tag t, ccstd::pmr::string&& name) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // descs
        std::forward_as_tuple(),                // traits
        std::forward_as_tuple(),                // states
        std::forward_as_tuple(),                // samplerInfo
        std::forward_as_tuple(),                // PolymorphicType
        g);
}

template <class Tag>
inline ResourceGraph::vertex_descriptor
add_vertex(ResourceGraph& g, Tag t, const char* name) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // descs
        std::forward_as_tuple(),     // traits
        std::forward_as_tuple(),     // states
        std::forward_as_tuple(),     // samplerInfo
        std::forward_as_tuple(),     // PolymorphicType
        g);
}

// Vertex Index
inline boost::property_map<RenderGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const RenderGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<RenderGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, RenderGraph& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<RenderGraph::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const RenderGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::NameTag>::const_type
get(RenderGraph::NameTag /*tag*/, const RenderGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<RenderGraph, RenderGraph::NameTag>::type
get(RenderGraph::NameTag /*tag*/, RenderGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<RenderGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const RenderGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::LayoutTag>::const_type
get(RenderGraph::LayoutTag /*tag*/, const RenderGraph& g) noexcept {
    return {g.layoutNodes};
}

inline typename boost::property_map<RenderGraph, RenderGraph::LayoutTag>::type
get(RenderGraph::LayoutTag /*tag*/, RenderGraph& g) noexcept {
    return {g.layoutNodes};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::DataTag>::const_type
get(RenderGraph::DataTag /*tag*/, const RenderGraph& g) noexcept {
    return {g.data};
}

inline typename boost::property_map<RenderGraph, RenderGraph::DataTag>::type
get(RenderGraph::DataTag /*tag*/, RenderGraph& g) noexcept {
    return {g.data};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<RenderGraph, T RenderData::*>::const_type
get(T RenderData::*memberPointer, const RenderGraph& g) noexcept {
    return {g.data, memberPointer};
}

template <class T>
inline typename boost::property_map<RenderGraph, T RenderData::*>::type
get(T RenderData::*memberPointer, RenderGraph& g) noexcept {
    return {g.data, memberPointer};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::ValidTag>::const_type
get(RenderGraph::ValidTag /*tag*/, const RenderGraph& g) noexcept {
    return {g.valid};
}

inline typename boost::property_map<RenderGraph, RenderGraph::ValidTag>::type
get(RenderGraph::ValidTag /*tag*/, RenderGraph& g) noexcept {
    return {g.valid};
}

// PolymorphicGraph
inline RenderGraph::vertices_size_type
id(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RasterPassTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<RasterSubpassTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ComputeTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ResolveTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<CopyTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<MoveTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<RaytraceTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<QueueTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<SceneTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<BlitTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<DispatchTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ClearTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ViewportTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g._vertices[u].handle);
}

inline RenderGraph::VertexTag
tag(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RasterPassTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{RasterPassTag{}};
            },
            [](const impl::ValueHandle<RasterSubpassTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{RasterSubpassTag{}};
            },
            [](const impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{ComputeSubpassTag{}};
            },
            [](const impl::ValueHandle<ComputeTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{ComputeTag{}};
            },
            [](const impl::ValueHandle<ResolveTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{ResolveTag{}};
            },
            [](const impl::ValueHandle<CopyTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{CopyTag{}};
            },
            [](const impl::ValueHandle<MoveTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{MoveTag{}};
            },
            [](const impl::ValueHandle<RaytraceTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{RaytraceTag{}};
            },
            [](const impl::ValueHandle<QueueTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{QueueTag{}};
            },
            [](const impl::ValueHandle<SceneTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{SceneTag{}};
            },
            [](const impl::ValueHandle<BlitTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{BlitTag{}};
            },
            [](const impl::ValueHandle<DispatchTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{DispatchTag{}};
            },
            [](const impl::ValueHandle<ClearTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{ClearTag{}};
            },
            [](const impl::ValueHandle<ViewportTag, vertex_descriptor>&) {
                return RenderGraph::VertexTag{ViewportTag{}};
            }),
        g._vertices[u].handle);
}

inline RenderGraph::VertexValue
value(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RasterPassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.rasterPasses[h.value]};
            },
            [&](const impl::ValueHandle<RasterSubpassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.rasterSubpasses[h.value]};
            },
            [&](const impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.computeSubpasses[h.value]};
            },
            [&](const impl::ValueHandle<ComputeTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.computePasses[h.value]};
            },
            [&](const impl::ValueHandle<ResolveTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.resolvePasses[h.value]};
            },
            [&](const impl::ValueHandle<CopyTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.copyPasses[h.value]};
            },
            [&](const impl::ValueHandle<MoveTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.movePasses[h.value]};
            },
            [&](const impl::ValueHandle<RaytraceTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.raytracePasses[h.value]};
            },
            [&](const impl::ValueHandle<QueueTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.renderQueues[h.value]};
            },
            [&](const impl::ValueHandle<SceneTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.scenes[h.value]};
            },
            [&](const impl::ValueHandle<BlitTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.blits[h.value]};
            },
            [&](const impl::ValueHandle<DispatchTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.dispatches[h.value]};
            },
            [&](const impl::ValueHandle<ClearTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.clearViews[h.value]};
            },
            [&](const impl::ValueHandle<ViewportTag, vertex_descriptor>& h) {
                return RenderGraph::VertexValue{&g.viewports[h.value]};
            }),
        g._vertices[u].handle);
}

inline RenderGraph::VertexConstValue
value(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RasterPassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.rasterPasses[h.value]};
            },
            [&](const impl::ValueHandle<RasterSubpassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.rasterSubpasses[h.value]};
            },
            [&](const impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.computeSubpasses[h.value]};
            },
            [&](const impl::ValueHandle<ComputeTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.computePasses[h.value]};
            },
            [&](const impl::ValueHandle<ResolveTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.resolvePasses[h.value]};
            },
            [&](const impl::ValueHandle<CopyTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.copyPasses[h.value]};
            },
            [&](const impl::ValueHandle<MoveTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.movePasses[h.value]};
            },
            [&](const impl::ValueHandle<RaytraceTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.raytracePasses[h.value]};
            },
            [&](const impl::ValueHandle<QueueTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.renderQueues[h.value]};
            },
            [&](const impl::ValueHandle<SceneTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.scenes[h.value]};
            },
            [&](const impl::ValueHandle<BlitTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.blits[h.value]};
            },
            [&](const impl::ValueHandle<DispatchTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.dispatches[h.value]};
            },
            [&](const impl::ValueHandle<ClearTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.clearViews[h.value]};
            },
            [&](const impl::ValueHandle<ViewportTag, vertex_descriptor>& h) {
                return RenderGraph::VertexConstValue{&g.viewports[h.value]};
            }),
        g._vertices[u].handle);
}

template <class Tag>
inline bool
holds(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept;

template <>
inline bool
holds<RasterPassTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<RasterSubpassTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ComputeSubpassTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ComputeTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ResolveTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<CopyTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<MoveTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<RaytraceTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<QueueTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<SceneTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<BlitTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<DispatchTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ClearTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<ViewportTag>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<RasterPass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RasterSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ComputeSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ComputePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ResolvePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<CopyPass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<MovePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RaytracePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RenderQueue>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<ccstd::pmr::vector<ClearView>>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<gfx::Viewport>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(RenderGraph::vertex_descriptor /*v*/, RenderGraph& /*g*/);

template <>
inline RasterPass&
get<RasterPass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterPasses[handle.value];
}

template <>
inline RasterSubpass&
get<RasterSubpass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterSubpasses[handle.value];
}

template <>
inline ComputeSubpass&
get<ComputeSubpass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computeSubpasses[handle.value];
}

template <>
inline ComputePass&
get<ComputePass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computePasses[handle.value];
}

template <>
inline ResolvePass&
get<ResolvePass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resolvePasses[handle.value];
}

template <>
inline CopyPass&
get<CopyPass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.copyPasses[handle.value];
}

template <>
inline MovePass&
get<MovePass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.movePasses[handle.value];
}

template <>
inline RaytracePass&
get<RaytracePass>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.raytracePasses[handle.value];
}

template <>
inline RenderQueue&
get<RenderQueue>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.renderQueues[handle.value];
}

template <>
inline SceneData&
get<SceneData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.scenes[handle.value];
}

template <>
inline Blit&
get<Blit>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.blits[handle.value];
}

template <>
inline Dispatch&
get<Dispatch>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.dispatches[handle.value];
}

template <>
inline ccstd::pmr::vector<ClearView>&
get<ccstd::pmr::vector<ClearView>>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.clearViews[handle.value];
}

template <>
inline gfx::Viewport&
get<gfx::Viewport>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.viewports[handle.value];
}

template <class ValueT>
inline const ValueT&
get(RenderGraph::vertex_descriptor /*v*/, const RenderGraph& /*g*/);

template <>
inline const RasterPass&
get<RasterPass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterPasses[handle.value];
}

template <>
inline const RasterSubpass&
get<RasterSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterSubpasses[handle.value];
}

template <>
inline const ComputeSubpass&
get<ComputeSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computeSubpasses[handle.value];
}

template <>
inline const ComputePass&
get<ComputePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computePasses[handle.value];
}

template <>
inline const ResolvePass&
get<ResolvePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resolvePasses[handle.value];
}

template <>
inline const CopyPass&
get<CopyPass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.copyPasses[handle.value];
}

template <>
inline const MovePass&
get<MovePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.movePasses[handle.value];
}

template <>
inline const RaytracePass&
get<RaytracePass>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.raytracePasses[handle.value];
}

template <>
inline const RenderQueue&
get<RenderQueue>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.renderQueues[handle.value];
}

template <>
inline const SceneData&
get<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.scenes[handle.value];
}

template <>
inline const Blit&
get<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.blits[handle.value];
}

template <>
inline const Dispatch&
get<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.dispatches[handle.value];
}

template <>
inline const ccstd::pmr::vector<ClearView>&
get<ccstd::pmr::vector<ClearView>>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.clearViews[handle.value];
}

template <>
inline const gfx::Viewport&
get<gfx::Viewport>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.viewports[handle.value];
}

inline RasterPass&
get(RasterPassTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterPasses[handle.value];
}

inline RasterSubpass&
get(RasterSubpassTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterSubpasses[handle.value];
}

inline ComputeSubpass&
get(ComputeSubpassTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computeSubpasses[handle.value];
}

inline ComputePass&
get(ComputeTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computePasses[handle.value];
}

inline ResolvePass&
get(ResolveTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resolvePasses[handle.value];
}

inline CopyPass&
get(CopyTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.copyPasses[handle.value];
}

inline MovePass&
get(MoveTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.movePasses[handle.value];
}

inline RaytracePass&
get(RaytraceTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.raytracePasses[handle.value];
}

inline RenderQueue&
get(QueueTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.renderQueues[handle.value];
}

inline SceneData&
get(SceneTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.scenes[handle.value];
}

inline Blit&
get(BlitTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.blits[handle.value];
}

inline Dispatch&
get(DispatchTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.dispatches[handle.value];
}

inline ccstd::pmr::vector<ClearView>&
get(ClearTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.clearViews[handle.value];
}

inline gfx::Viewport&
get(ViewportTag /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.viewports[handle.value];
}

inline const RasterPass&
get(RasterPassTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterPasses[handle.value];
}

inline const RasterSubpass&
get(RasterSubpassTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.rasterSubpasses[handle.value];
}

inline const ComputeSubpass&
get(ComputeSubpassTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computeSubpasses[handle.value];
}

inline const ComputePass&
get(ComputeTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.computePasses[handle.value];
}

inline const ResolvePass&
get(ResolveTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.resolvePasses[handle.value];
}

inline const CopyPass&
get(CopyTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.copyPasses[handle.value];
}

inline const MovePass&
get(MoveTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.movePasses[handle.value];
}

inline const RaytracePass&
get(RaytraceTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.raytracePasses[handle.value];
}

inline const RenderQueue&
get(QueueTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.renderQueues[handle.value];
}

inline const SceneData&
get(SceneTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.scenes[handle.value];
}

inline const Blit&
get(BlitTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.blits[handle.value];
}

inline const Dispatch&
get(DispatchTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.dispatches[handle.value];
}

inline const ccstd::pmr::vector<ClearView>&
get(ClearTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.clearViews[handle.value];
}

inline const gfx::Viewport&
get(ViewportTag /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.viewports[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept; // NOLINT

template <>
inline RasterPass*
get_if<RasterPass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RasterPass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterPasses[pHandle->value];
    }
    return ptr;
}

template <>
inline RasterSubpass*
get_if<RasterSubpass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RasterSubpass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterSubpasses[pHandle->value];
    }
    return ptr;
}

template <>
inline ComputeSubpass*
get_if<ComputeSubpass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    ComputeSubpass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.computeSubpasses[pHandle->value];
    }
    return ptr;
}

template <>
inline ComputePass*
get_if<ComputePass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    ComputePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.computePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline ResolvePass*
get_if<ResolvePass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    ResolvePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.resolvePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline CopyPass*
get_if<CopyPass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    CopyPass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.copyPasses[pHandle->value];
    }
    return ptr;
}

template <>
inline MovePass*
get_if<MovePass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    MovePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.movePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline RaytracePass*
get_if<RaytracePass>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RaytracePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.raytracePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline RenderQueue*
get_if<RenderQueue>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RenderQueue* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.renderQueues[pHandle->value];
    }
    return ptr;
}

template <>
inline SceneData*
get_if<SceneData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    SceneData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.scenes[pHandle->value];
    }
    return ptr;
}

template <>
inline Blit*
get_if<Blit>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    Blit* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.blits[pHandle->value];
    }
    return ptr;
}

template <>
inline Dispatch*
get_if<Dispatch>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    Dispatch* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.dispatches[pHandle->value];
    }
    return ptr;
}

template <>
inline ccstd::pmr::vector<ClearView>*
get_if<ccstd::pmr::vector<ClearView>>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    ccstd::pmr::vector<ClearView>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.clearViews[pHandle->value];
    }
    return ptr;
}

template <>
inline gfx::Viewport*
get_if<gfx::Viewport>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    gfx::Viewport* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.viewports[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept; // NOLINT

template <>
inline const RasterPass*
get_if<RasterPass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RasterPass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterPasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const RasterSubpass*
get_if<RasterSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RasterSubpass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterSubpasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const ComputeSubpass*
get_if<ComputeSubpass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const ComputeSubpass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.computeSubpasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const ComputePass*
get_if<ComputePass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const ComputePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.computePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const ResolvePass*
get_if<ResolvePass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const ResolvePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.resolvePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const CopyPass*
get_if<CopyPass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const CopyPass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.copyPasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const MovePass*
get_if<MovePass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const MovePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.movePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const RaytracePass*
get_if<RaytracePass>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RaytracePass* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.raytracePasses[pHandle->value];
    }
    return ptr;
}

template <>
inline const RenderQueue*
get_if<RenderQueue>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RenderQueue* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.renderQueues[pHandle->value];
    }
    return ptr;
}

template <>
inline const SceneData*
get_if<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const SceneData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.scenes[pHandle->value];
    }
    return ptr;
}

template <>
inline const Blit*
get_if<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const Blit* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.blits[pHandle->value];
    }
    return ptr;
}

template <>
inline const Dispatch*
get_if<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const Dispatch* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.dispatches[pHandle->value];
    }
    return ptr;
}

template <>
inline const ccstd::pmr::vector<ClearView>*
get_if<ccstd::pmr::vector<ClearView>>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const ccstd::pmr::vector<ClearView>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.clearViews[pHandle->value];
    }
    return ptr;
}

template <>
inline const gfx::Viewport*
get_if<gfx::Viewport>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const gfx::Viewport* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.viewports[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const RenderGraph& g, RenderGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, RenderGraph& g, RenderGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, RenderGraph& g,
    RenderGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// MutableGraph(Vertex)
inline void addPathImpl(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, RenderGraph& g) { // NOLINT
    // add to parent
    if (u != RenderGraph::null_vertex()) {
        auto& outEdgeList = g.getChildrenList(u);
        outEdgeList.emplace_back(v);

        auto& inEdgeList = g.getParentsList(v);
        inEdgeList.emplace_back(u);
    }
}

inline void clear_out_edges(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const RenderGraph::VertexHandle& h, RenderGraph& g) noexcept { // NOLINT
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RasterPassTag, vertex_descriptor>& h) {
                g.rasterPasses.erase(g.rasterPasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.rasterPasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<RasterPassTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<RasterSubpassTag, vertex_descriptor>& h) {
                g.rasterSubpasses.erase(g.rasterSubpasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.rasterSubpasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<RasterSubpassTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ComputeSubpassTag, vertex_descriptor>& h) {
                g.computeSubpasses.erase(g.computeSubpasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.computeSubpasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<ComputeSubpassTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ComputeTag, vertex_descriptor>& h) {
                g.computePasses.erase(g.computePasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.computePasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<ComputeTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ResolveTag, vertex_descriptor>& h) {
                g.resolvePasses.erase(g.resolvePasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.resolvePasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<ResolveTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<CopyTag, vertex_descriptor>& h) {
                g.copyPasses.erase(g.copyPasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.copyPasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<CopyTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<MoveTag, vertex_descriptor>& h) {
                g.movePasses.erase(g.movePasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.movePasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<MoveTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<RaytraceTag, vertex_descriptor>& h) {
                g.raytracePasses.erase(g.raytracePasses.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.raytracePasses.size()) {
                    return;
                }
                impl::reindexVectorHandle<RaytraceTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<QueueTag, vertex_descriptor>& h) {
                g.renderQueues.erase(g.renderQueues.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.renderQueues.size()) {
                    return;
                }
                impl::reindexVectorHandle<QueueTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<SceneTag, vertex_descriptor>& h) {
                g.scenes.erase(g.scenes.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.scenes.size()) {
                    return;
                }
                impl::reindexVectorHandle<SceneTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<BlitTag, vertex_descriptor>& h) {
                g.blits.erase(g.blits.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.blits.size()) {
                    return;
                }
                impl::reindexVectorHandle<BlitTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<DispatchTag, vertex_descriptor>& h) {
                g.dispatches.erase(g.dispatches.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.dispatches.size()) {
                    return;
                }
                impl::reindexVectorHandle<DispatchTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ClearTag, vertex_descriptor>& h) {
                g.clearViews.erase(g.clearViews.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.clearViews.size()) {
                    return;
                }
                impl::reindexVectorHandle<ClearTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<ViewportTag, vertex_descriptor>& h) {
                g.viewports.erase(g.viewports.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.viewports.size()) {
                    return;
                }
                impl::reindexVectorHandle<ViewportTag>(g._vertices, h.value);
            }),
        h);
}

inline void remove_vertex(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g._vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    impl::removeVectorVertex(const_cast<RenderGraph&>(g), u, RenderGraph::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + static_cast<std::ptrdiff_t>(u));
    g.layoutNodes.erase(g.layoutNodes.begin() + static_cast<std::ptrdiff_t>(u));
    g.data.erase(g.data.begin() + static_cast<std::ptrdiff_t>(u));
    g.valid.erase(g.valid.begin() + static_cast<std::ptrdiff_t>(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RasterPass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.rasterPasses.size())};
    g.rasterPasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RasterSubpass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.rasterSubpasses.size())};
    g.rasterSubpasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ComputeSubpass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.computeSubpasses.size())};
    g.computeSubpasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ComputePass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.computePasses.size())};
    g.computePasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ResolvePass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.resolvePasses.size())};
    g.resolvePasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, CopyPass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.copyPasses.size())};
    g.copyPasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, MovePass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.movePasses.size())};
    g.movePasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RaytracePass>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.raytracePasses.size())};
    g.raytracePasses.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderQueue>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.renderQueues.size())};
    g.renderQueues.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, SceneData>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.scenes.size())};
    g.scenes.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, Blit>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.blits.size())};
    g.blits.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, Dispatch>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.dispatches.size())};
    g.dispatches.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ccstd::pmr::vector<ClearView>>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.clearViews.size())};
    g.clearViews.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, RenderGraph &g, RenderGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, gfx::Viewport>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>{
        gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.viewports.size())};
    g.viewports.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class Component2, class Component3, class ValueT>
inline RenderGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, ValueT&& val, RenderGraph& g, RenderGraph::vertex_descriptor u = RenderGraph::null_vertex()) {
    auto v = gsl::narrow_cast<RenderGraph::vertex_descriptor>(g._vertices.size());

    g.objects.emplace_back();

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.layoutNodes.emplace_back(std::forward<Component1>(c1));
    g.data.emplace_back(std::forward<Component2>(c2));
    g.valid.emplace_back(std::forward<Component3>(c3));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

template <class Tuple>
void addVertexImpl(RasterPassTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RasterPassTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.rasterPasses.size())};
            g.rasterPasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(RasterSubpassTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RasterSubpassTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.rasterSubpasses.size())};
            g.rasterSubpasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ComputeSubpassTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ComputeSubpassTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.computeSubpasses.size())};
            g.computeSubpasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ComputeTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ComputeTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.computePasses.size())};
            g.computePasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ResolveTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ResolveTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.resolvePasses.size())};
            g.resolvePasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(CopyTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<CopyTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.copyPasses.size())};
            g.copyPasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(MoveTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<MoveTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.movePasses.size())};
            g.movePasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(RaytraceTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RaytraceTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.raytracePasses.size())};
            g.raytracePasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(QueueTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<QueueTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.renderQueues.size())};
            g.renderQueues.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(SceneTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<SceneTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.scenes.size())};
            g.scenes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(BlitTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<BlitTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.blits.size())};
            g.blits.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(DispatchTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<DispatchTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.dispatches.size())};
            g.dispatches.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ClearTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ClearTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.clearViews.size())};
            g.clearViews.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ViewportTag /*tag*/, Tuple &&val, RenderGraph &g, RenderGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ViewportTag, RenderGraph::vertex_descriptor>{
                gsl::narrow_cast<RenderGraph::vertex_descriptor>(g.viewports.size())};
            g.viewports.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Component2, class Component3, class Tag, class ValueT>
inline RenderGraph::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, ValueT&& val, RenderGraph& g, RenderGraph::vertex_descriptor u = RenderGraph::null_vertex()) {
    auto v = gsl::narrow_cast<RenderGraph::vertex_descriptor>(g._vertices.size());

    g.objects.emplace_back();

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();

    std::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    std::apply(
        [&](auto&&... args) {
            g.layoutNodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    std::apply(
        [&](auto&&... args) {
            g.data.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    std::apply(
        [&](auto&&... args) {
            g.valid.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component3>(c3));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline RenderGraph::vertex_descriptor
add_vertex(RenderGraph& g, Tag t, ccstd::pmr::string&& name) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // layoutNodes
        std::forward_as_tuple(),                // data
        std::forward_as_tuple(),                // valid
        std::forward_as_tuple(),                // PolymorphicType
        g);
}

template <class Tag>
inline RenderGraph::vertex_descriptor
add_vertex(RenderGraph& g, Tag t, const char* name) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // layoutNodes
        std::forward_as_tuple(),     // data
        std::forward_as_tuple(),     // valid
        std::forward_as_tuple(),     // PolymorphicType
        g);
}

} // namespace render

} // namespace cc

// clang-format on
