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
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/details/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/details/Overload.h"
#include "cocos/renderer/pipeline/custom/details/PathUtils.h"

namespace cc {

namespace render {

// IncidenceGraph
inline LayoutGraph::vertex_descriptor
source(const LayoutGraph::edge_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.source;
}

inline LayoutGraph::vertex_descriptor
target(const LayoutGraph::edge_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<LayoutGraph::out_edge_iterator, LayoutGraph::out_edge_iterator>
out_edges(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraph::out_edge_iterator(const_cast<LayoutGraph&>(g).getOutEdgeList(u).begin(), u),
        LayoutGraph::out_edge_iterator(const_cast<LayoutGraph&>(g).getOutEdgeList(u).end(), u));
}

inline LayoutGraph::degree_size_type
out_degree(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<LayoutGraph::edge_descriptor, bool>
edge(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<LayoutGraph::in_edge_iterator, LayoutGraph::in_edge_iterator>
in_edges(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraph::in_edge_iterator(const_cast<LayoutGraph&>(g).getInEdgeList(u).begin(), u),
        LayoutGraph::in_edge_iterator(const_cast<LayoutGraph&>(g).getInEdgeList(u).end(), u));
}

inline LayoutGraph::degree_size_type
in_degree(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::degree_size_type>(g.getInEdgeList(u).size());
}

inline LayoutGraph::degree_size_type
degree(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<LayoutGraph::adjacency_iterator, LayoutGraph::adjacency_iterator>
adjacent_vertices(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(LayoutGraph::adjacency_iterator(edges.first, &g), LayoutGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<LayoutGraph::vertex_iterator, LayoutGraph::vertex_iterator>
vertices(const LayoutGraph& g) noexcept {
    return std::make_pair(const_cast<LayoutGraph&>(g).getVertexList().begin(), const_cast<LayoutGraph&>(g).getVertexList().end());
}

inline LayoutGraph::vertices_size_type
num_vertices(const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<LayoutGraph::edge_iterator, LayoutGraph::edge_iterator>
edges(const LayoutGraph& g0) noexcept {
    auto& g = const_cast<LayoutGraph&>(g0);
    return std::make_pair(
        LayoutGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        LayoutGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline LayoutGraph::edges_size_type
num_edges(const LayoutGraph& g) noexcept { // NOLINT
    LayoutGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<LayoutGraph::edge_descriptor, bool>
add_edge( // NOLINT
    LayoutGraph::vertex_descriptor u,
    LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(LayoutGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) noexcept { // NOLINT
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), LayoutGraph::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), LayoutGraph::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(LayoutGraph::out_edge_iterator outIter, LayoutGraph& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), LayoutGraph::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(LayoutGraph::edge_descriptor e, LayoutGraph& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), LayoutGraph::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(LayoutGraph::out_edge_iterator(outIter, u), g);
}

// AddressableGraph
inline LayoutGraph::vertex_descriptor
parent(const LayoutGraph::ownership_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.source;
}

inline LayoutGraph::vertex_descriptor
child(const LayoutGraph::ownership_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<LayoutGraph::children_iterator, LayoutGraph::children_iterator>
children(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return std::make_pair(
        LayoutGraph::children_iterator(const_cast<LayoutGraph&>(g).getChildrenList(u).begin(), u),
        LayoutGraph::children_iterator(const_cast<LayoutGraph&>(g).getChildrenList(u).end(), u));
}

inline LayoutGraph::children_size_type
numChildren(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return gsl::narrow_cast<LayoutGraph::children_size_type>(g.getChildrenList(u).size());
}

inline std::pair<LayoutGraph::ownership_descriptor, bool>
reference(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) noexcept {
    auto& outEdgeList = g.getChildrenList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraph::ownership_descriptor(u, v), hasEdge};
}

inline std::pair<LayoutGraph::parent_iterator, LayoutGraph::parent_iterator>
parents(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return std::make_pair(
        LayoutGraph::parent_iterator(const_cast<LayoutGraph&>(g).getParentsList(u).begin(), u),
        LayoutGraph::parent_iterator(const_cast<LayoutGraph&>(g).getParentsList(u).end(), u));
}

inline LayoutGraph::children_size_type
numParents(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return gsl::narrow_cast<LayoutGraph::children_size_type>(g.getParentsList(u).size());
}

inline LayoutGraph::vertex_descriptor
parent(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    auto r = parents(u, g);
    if (r.first == r.second) {
        return LayoutGraph::null_vertex();
    }
    return parent(*r.first, g);
}

inline bool
ancestor(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept {
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

inline std::pair<LayoutGraph::ownership_iterator, LayoutGraph::ownership_iterator>
references(const LayoutGraph& g0) noexcept {
    auto& g = const_cast<LayoutGraph&>(g0);
    return std::make_pair(
        LayoutGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        LayoutGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline LayoutGraph::ownerships_size_type
numReferences(const LayoutGraph& g) noexcept {
    LayoutGraph::ownerships_size_type numEdges = 0;
    auto                              range    = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += numChildren(*iter, g);
    }
    return numEdges;
}

// IncidenceGraph
inline LayoutGraphData::vertex_descriptor
source(const LayoutGraphData::edge_descriptor& e, const LayoutGraphData& /*g*/) noexcept {
    return e.source;
}

inline LayoutGraphData::vertex_descriptor
target(const LayoutGraphData::edge_descriptor& e, const LayoutGraphData& /*g*/) noexcept {
    return e.target;
}

inline std::pair<LayoutGraphData::out_edge_iterator, LayoutGraphData::out_edge_iterator>
out_edges(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraphData::out_edge_iterator(const_cast<LayoutGraphData&>(g).getOutEdgeList(u).begin(), u),
        LayoutGraphData::out_edge_iterator(const_cast<LayoutGraphData&>(g).getOutEdgeList(u).end(), u));
}

inline LayoutGraphData::degree_size_type
out_degree(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraphData::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<LayoutGraphData::edge_descriptor, bool>
edge(LayoutGraphData::vertex_descriptor u, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraphData::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraphData::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<LayoutGraphData::in_edge_iterator, LayoutGraphData::in_edge_iterator>
in_edges(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraphData::in_edge_iterator(const_cast<LayoutGraphData&>(g).getInEdgeList(u).begin(), u),
        LayoutGraphData::in_edge_iterator(const_cast<LayoutGraphData&>(g).getInEdgeList(u).end(), u));
}

inline LayoutGraphData::degree_size_type
in_degree(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraphData::degree_size_type>(g.getInEdgeList(u).size());
}

inline LayoutGraphData::degree_size_type
degree(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<LayoutGraphData::adjacency_iterator, LayoutGraphData::adjacency_iterator>
adjacent_vertices(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(LayoutGraphData::adjacency_iterator(edges.first, &g), LayoutGraphData::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<LayoutGraphData::vertex_iterator, LayoutGraphData::vertex_iterator>
vertices(const LayoutGraphData& g) noexcept {
    return std::make_pair(const_cast<LayoutGraphData&>(g).getVertexList().begin(), const_cast<LayoutGraphData&>(g).getVertexList().end());
}

inline LayoutGraphData::vertices_size_type
num_vertices(const LayoutGraphData& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraphData::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<LayoutGraphData::edge_iterator, LayoutGraphData::edge_iterator>
edges(const LayoutGraphData& g0) noexcept {
    auto& g = const_cast<LayoutGraphData&>(g0);
    return std::make_pair(
        LayoutGraphData::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        LayoutGraphData::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline LayoutGraphData::edges_size_type
num_edges(const LayoutGraphData& g) noexcept { // NOLINT
    LayoutGraphData::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<LayoutGraphData::edge_descriptor, bool>
add_edge( // NOLINT
    LayoutGraphData::vertex_descriptor u,
    LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(LayoutGraphData::edge_descriptor(u, v), true);
}

inline void remove_edge(LayoutGraphData::vertex_descriptor u, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) noexcept { // NOLINT
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    s.outEdges.erase(std::remove(s.outEdges.begin(), s.outEdges.end(), LayoutGraphData::OutEdge(v)), s.outEdges.end());
    t.inEdges.erase(std::remove(t.inEdges.begin(), t.inEdges.end(), LayoutGraphData::InEdge(u)), t.inEdges.end());
}

inline void remove_edge(LayoutGraphData::out_edge_iterator outIter, LayoutGraphData& g) noexcept { // NOLINT
    auto e = *outIter;
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto& t = g._vertices[v];
    auto inIter = std::find(t.inEdges.begin(), t.inEdges.end(), LayoutGraphData::InEdge(u));
    CC_EXPECTS(inIter != t.inEdges.end());
    t.inEdges.erase(inIter);
    s.outEdges.erase(outIter.base());
}

inline void remove_edge(LayoutGraphData::edge_descriptor e, LayoutGraphData& g) noexcept { // NOLINT
    const auto u = source(e, g);
    const auto v = target(e, g);
    auto& s = g._vertices[u];
    auto outIter = std::find(s.outEdges.begin(), s.outEdges.end(), LayoutGraphData::OutEdge(v));
    CC_EXPECTS(outIter != s.outEdges.end());
    remove_edge(LayoutGraphData::out_edge_iterator(outIter, u), g);
}

// AddressableGraph
inline LayoutGraphData::vertex_descriptor
parent(const LayoutGraphData::ownership_descriptor& e, const LayoutGraphData& /*g*/) noexcept {
    return e.source;
}

inline LayoutGraphData::vertex_descriptor
child(const LayoutGraphData::ownership_descriptor& e, const LayoutGraphData& /*g*/) noexcept {
    return e.target;
}

inline std::pair<LayoutGraphData::children_iterator, LayoutGraphData::children_iterator>
children(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    return std::make_pair(
        LayoutGraphData::children_iterator(const_cast<LayoutGraphData&>(g).getChildrenList(u).begin(), u),
        LayoutGraphData::children_iterator(const_cast<LayoutGraphData&>(g).getChildrenList(u).end(), u));
}

inline LayoutGraphData::children_size_type
numChildren(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    return gsl::narrow_cast<LayoutGraphData::children_size_type>(g.getChildrenList(u).size());
}

inline std::pair<LayoutGraphData::ownership_descriptor, bool>
reference(LayoutGraphData::vertex_descriptor u, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) noexcept {
    auto& outEdgeList = g.getChildrenList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraphData::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraphData::ownership_descriptor(u, v), hasEdge};
}

inline std::pair<LayoutGraphData::parent_iterator, LayoutGraphData::parent_iterator>
parents(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    return std::make_pair(
        LayoutGraphData::parent_iterator(const_cast<LayoutGraphData&>(g).getParentsList(u).begin(), u),
        LayoutGraphData::parent_iterator(const_cast<LayoutGraphData&>(g).getParentsList(u).end(), u));
}

inline LayoutGraphData::children_size_type
numParents(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    return gsl::narrow_cast<LayoutGraphData::children_size_type>(g.getParentsList(u).size());
}

inline LayoutGraphData::vertex_descriptor
parent(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    auto r = parents(u, g);
    if (r.first == r.second) {
        return LayoutGraphData::null_vertex();
    }
    return parent(*r.first, g);
}

inline bool
ancestor(LayoutGraphData::vertex_descriptor u, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
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

inline std::pair<LayoutGraphData::ownership_iterator, LayoutGraphData::ownership_iterator>
references(const LayoutGraphData& g0) noexcept {
    auto& g = const_cast<LayoutGraphData&>(g0);
    return std::make_pair(
        LayoutGraphData::ownership_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        LayoutGraphData::ownership_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline LayoutGraphData::ownerships_size_type
numReferences(const LayoutGraphData& g) noexcept {
    LayoutGraphData::ownerships_size_type numEdges = 0;
    auto                                  range    = vertices(g);
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
struct property_map<cc::render::LayoutGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraph, cc::render::LayoutGraph::NameTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::LayoutGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraph,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraph,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraph, cc::render::LayoutGraph::DescriptorsTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraph,
        const ccstd::pmr::vector<cc::render::DescriptorDB>,
        cc::render::DescriptorDB,
        const cc::render::DescriptorDB&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraph,
        ccstd::pmr::vector<cc::render::DescriptorDB>,
        cc::render::DescriptorDB,
        cc::render::DescriptorDB&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::LayoutGraph, T cc::render::DescriptorDB::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraph,
        const ccstd::pmr::vector<cc::render::DescriptorDB>,
        T,
        const T&,
        T cc::render::DescriptorDB::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraph,
        ccstd::pmr::vector<cc::render::DescriptorDB>,
        T,
        T&,
        T cc::render::DescriptorDB::*>;
};

// Vertex Index
template <>
struct property_map<cc::render::LayoutGraphData, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraphData, cc::render::LayoutGraphData::NameTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraphData,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraphData,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::LayoutGraphData, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraphData,
        const ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        const ccstd::pmr::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraphData,
        ccstd::pmr::vector<ccstd::pmr::string>,
        std::string_view,
        ccstd::pmr::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraphData, cc::render::LayoutGraphData::UpdateTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const ccstd::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        const cc::render::UpdateFrequency&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        ccstd::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        cc::render::UpdateFrequency&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraphData, cc::render::LayoutGraphData::LayoutTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const ccstd::pmr::vector<cc::render::PipelineLayoutData>,
        cc::render::PipelineLayoutData,
        const cc::render::PipelineLayoutData&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        ccstd::pmr::vector<cc::render::PipelineLayoutData>,
        cc::render::PipelineLayoutData,
        cc::render::PipelineLayoutData&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::LayoutGraphData, T cc::render::PipelineLayoutData::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const ccstd::pmr::vector<cc::render::PipelineLayoutData>,
        T,
        const T&,
        T cc::render::PipelineLayoutData::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        ccstd::pmr::vector<cc::render::PipelineLayoutData>,
        T,
        T&,
        T cc::render::PipelineLayoutData::*>;
};

} // namespace boost

namespace cc {

namespace render {

// Vertex Index
inline boost::property_map<LayoutGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const LayoutGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<LayoutGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, LayoutGraph& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<LayoutGraph::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const LayoutGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<LayoutGraph, LayoutGraph::NameTag>::const_type
get(LayoutGraph::NameTag /*tag*/, const LayoutGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<LayoutGraph, LayoutGraph::NameTag>::type
get(LayoutGraph::NameTag /*tag*/, LayoutGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<LayoutGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const LayoutGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<LayoutGraph, LayoutGraph::DescriptorsTag>::const_type
get(LayoutGraph::DescriptorsTag /*tag*/, const LayoutGraph& g) noexcept {
    return {g.descriptors};
}

inline typename boost::property_map<LayoutGraph, LayoutGraph::DescriptorsTag>::type
get(LayoutGraph::DescriptorsTag /*tag*/, LayoutGraph& g) noexcept {
    return {g.descriptors};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<LayoutGraph, T DescriptorDB::*>::const_type
get(T DescriptorDB::*memberPointer, const LayoutGraph& g) noexcept {
    return {g.descriptors, memberPointer};
}

template <class T>
inline typename boost::property_map<LayoutGraph, T DescriptorDB::*>::type
get(T DescriptorDB::*memberPointer, LayoutGraph& g) noexcept {
    return {g.descriptors, memberPointer};
}

// PolymorphicGraph
inline LayoutGraph::vertices_size_type
id(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g._vertices[u].handle);
}

inline LayoutGraph::VertexTag
tag(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RenderStageTag, vertex_descriptor>&) {
                return LayoutGraph::VertexTag{RenderStageTag{}};
            },
            [](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>&) {
                return LayoutGraph::VertexTag{RenderPhaseTag{}};
            }),
        g._vertices[u].handle);
}

inline LayoutGraph::VertexValue
value(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return LayoutGraph::VertexValue{&g.stages[h.value]};
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return LayoutGraph::VertexValue{&g.phases[h.value]};
            }),
        g._vertices[u].handle);
}

inline LayoutGraph::VertexConstValue
value(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return LayoutGraph::VertexConstValue{&g.stages[h.value]};
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return LayoutGraph::VertexConstValue{&g.phases[h.value]};
            }),
        g._vertices[u].handle);
}

template <class Tag>
inline bool
holds(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept;

template <>
inline bool
holds<RenderStageTag>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<RenderPhaseTag>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<RenderPassType>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RenderPhase>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(LayoutGraph::vertex_descriptor /*v*/, LayoutGraph& /*g*/);

template <>
inline RenderPassType&
get<RenderPassType>(LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

template <>
inline RenderPhase&
get<RenderPhase>(LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

template <class ValueT>
inline const ValueT&
get(LayoutGraph::vertex_descriptor /*v*/, const LayoutGraph& /*g*/);

template <>
inline const RenderPassType&
get<RenderPassType>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

template <>
inline const RenderPhase&
get<RenderPhase>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

inline RenderPassType&
get(RenderStageTag /*tag*/, LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

inline RenderPhase&
get(RenderPhaseTag /*tag*/, LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

inline const RenderPassType&
get(RenderStageTag /*tag*/, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

inline const RenderPhase&
get(RenderPhaseTag /*tag*/, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept; // NOLINT

template <>
inline RenderPassType*
get_if<RenderPassType>(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept { // NOLINT
    RenderPassType* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.stages[pHandle->value];
    }
    return ptr;
}

template <>
inline RenderPhase*
get_if<RenderPhase>(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept { // NOLINT
    RenderPhase* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.phases[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept; // NOLINT

template <>
inline const RenderPassType*
get_if<RenderPassType>(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept { // NOLINT
    const RenderPassType* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.stages[pHandle->value];
    }
    return ptr;
}

template <>
inline const RenderPhase*
get_if<RenderPhase>(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept { // NOLINT
    const RenderPhase* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.phases[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const LayoutGraph& g, LayoutGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, LayoutGraph& g, LayoutGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, LayoutGraph& g,
    LayoutGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// AddressableGraph

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
getPath(
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraph::vertex_descriptor u0, const LayoutGraph& g,
    std::string_view prefix = {}, LayoutGraph::vertex_descriptor parent = LayoutGraph::null_vertex()) {
    output.clear();
    const auto sz0 = static_cast<std::ptrdiff_t>(prefix.size());
    auto       sz  = sz0;

    const auto& layoutGraph = g;
    sz += impl::pathLength(u0, layoutGraph, parent);

    output.resize(sz);

    impl::pathComposite(output, sz, u0, layoutGraph, parent);
    CC_ENSURES(sz >= sz0);

    CC_ENSURES(sz == sz0);
    std::copy(prefix.begin(), prefix.end(), output.begin());

    return output;
}

inline ccstd::string
getPath(
    LayoutGraph::vertex_descriptor u0, const LayoutGraph& g,
    std::string_view prefix = {}, LayoutGraph::vertex_descriptor parent = LayoutGraph::null_vertex()) {
    ccstd::string output;
    getPath(output, u0, g, prefix, parent);
    return output;
}

inline ccstd::pmr::string
getPath(
    LayoutGraph::vertex_descriptor u0, const LayoutGraph& g,
    boost::container::pmr::memory_resource* mr, std::string_view prefix = {}, LayoutGraph::vertex_descriptor parent = LayoutGraph::null_vertex()) {
    ccstd::pmr::string output(mr);
    getPath(output, u0, g, prefix, parent);
    return output;
}

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
getPath(
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraph::vertex_descriptor parent, std::string_view name, const LayoutGraph& g) {
    output.clear();
    auto sz = impl::pathLength(parent, g);
    output.resize(sz + name.size() + 1);
    output[sz] = '/';
    std::copy(name.begin(), name.end(), output.begin() + sz + 1);
    impl::pathComposite(output, sz, parent, g);
    CC_ENSURES(sz == 0);
    return output;
}

inline ccstd::string
getPath(LayoutGraph::vertex_descriptor parent, std::string_view name, const LayoutGraph& g) {
    ccstd::string output;
    getPath(output, parent, name, g);
    return output;
}

inline ccstd::pmr::string
getPath(LayoutGraph::vertex_descriptor parent, std::string_view name, const LayoutGraph& g, boost::container::pmr::memory_resource* mr) {
    ccstd::pmr::string output(mr);
    getPath(output, parent, name, g);
    return output;
}

inline LayoutGraph::vertex_descriptor
locate(std::string_view absolute, const LayoutGraph& g) noexcept {
    auto iter = g.pathIndex.find(absolute);
    if (iter != g.pathIndex.end()) {
        return iter->second;
    }
    return LayoutGraph::null_vertex();
};

inline LayoutGraph::vertex_descriptor
locate(LayoutGraph::vertex_descriptor u, std::string_view relative, const LayoutGraph& g) {
    CC_EXPECTS(!boost::algorithm::starts_with(relative, "/"));
    CC_EXPECTS(!boost::algorithm::ends_with(relative, "/"));
    auto key = getPath(u, relative, g);
    impl::cleanPath(key);
    return locate(key, g);
};

inline bool
contains(std::string_view absolute, const LayoutGraph& g) noexcept {
    return locate(absolute, g) != LayoutGraph::null_vertex();
}

template <class ValueT>
inline ValueT&
get(std::string_view pt, LayoutGraph& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraph::null_vertex()) {
        throw std::out_of_range("at LayoutGraph");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline const ValueT&
get(std::string_view pt, const LayoutGraph& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraph::null_vertex()) {
        throw std::out_of_range("at LayoutGraph");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline ValueT*
get_if(std::string_view pt, LayoutGraph* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraph::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

template <class ValueT>
inline const ValueT*
get_if(std::string_view pt, const LayoutGraph* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraph::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

// MutableGraph(Vertex)
inline void addPathImpl(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) { // NOLINT
    // add to parent
    if (u != LayoutGraph::null_vertex()) {
        auto& outEdgeList = g.getChildrenList(u);
        outEdgeList.emplace_back(v);

        auto& inEdgeList = g.getParentsList(v);
        inEdgeList.emplace_back(u);
    }

    // add to external path index
    auto pathName = getPath(v, g, g.pathIndex.get_allocator().resource());
    auto res      = g.pathIndex.emplace(std::move(pathName), v);
    CC_ENSURES(res.second);
}

inline void removePathImpl(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept {
    // notice: here we use ccstd::string, not std::pmr::string
    // we do not want to increase the memory of g
    auto pathName = getPath(u, g);
    auto iter = g.pathIndex.find(std::string_view{pathName});
    CC_EXPECTS(iter != g.pathIndex.end());
    g.pathIndex.erase(iter);
    for (auto&& nvp : g.pathIndex) {
        auto& v = nvp.second;
        if (v > u) {
            --v;
        }
    }
}

inline void clear_out_edges(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // AddressableGraph (Alias)
    // only leaf node can be cleared.
    // clear internal node will broke tree structure.
    CC_EXPECTS(out_degree(u, g) == 0);

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

inline void clear_in_edges(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // AddressableGraph (Alias)
    CC_EXPECTS(out_degree(u, g) == 0);
    removePathImpl(u, g);

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

inline void clear_vertex(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const LayoutGraph::VertexHandle& h, LayoutGraph& g) noexcept { // NOLINT
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                g.stages.erase(g.stages.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.stages.size()) {
                    return;
                }
                impl::reindexVectorHandle<RenderStageTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                g.phases.erase(g.phases.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.phases.size()) {
                    return;
                }
                impl::reindexVectorHandle<RenderPhaseTag>(g._vertices, h.value);
            }),
        h);
}

inline void remove_vertex(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g._vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    impl::removeVectorVertex(const_cast<LayoutGraph&>(g), u, LayoutGraph::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + static_cast<std::ptrdiff_t>(u));
    g.descriptors.erase(g.descriptors.begin() + static_cast<std::ptrdiff_t>(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraph &g, LayoutGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderPassType>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.stages.size())};
    g.stages.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraph &g, LayoutGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderPhase>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.phases.size())};
    g.phases.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class ValueT>
inline LayoutGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, ValueT&& val, LayoutGraph& g, LayoutGraph::vertex_descriptor u = LayoutGraph::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.descriptors.emplace_back(std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

template <class Tuple>
void addVertexImpl(RenderStageTag /*tag*/, Tuple &&val, LayoutGraph &g, LayoutGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RenderStageTag, LayoutGraph::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.stages.size())};
            g.stages.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(RenderPhaseTag /*tag*/, Tuple &&val, LayoutGraph &g, LayoutGraph::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RenderPhaseTag, LayoutGraph::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.phases.size())};
            g.phases.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Tag, class ValueT>
inline LayoutGraph::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, ValueT&& val, LayoutGraph& g, LayoutGraph::vertex_descriptor u = LayoutGraph::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();

    std::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    std::apply(
        [&](auto&&... args) {
            g.descriptors.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline LayoutGraph::vertex_descriptor
add_vertex(LayoutGraph& g, Tag t, ccstd::pmr::string&& name, LayoutGraph::vertex_descriptor parentID = LayoutGraph::null_vertex()) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // descriptors
        std::forward_as_tuple(),                // PolymorphicType
        g, parentID);
}

template <class Tag>
inline LayoutGraph::vertex_descriptor
add_vertex(LayoutGraph& g, Tag t, const char* name, LayoutGraph::vertex_descriptor parentID = LayoutGraph::null_vertex()) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // descriptors
        std::forward_as_tuple(),     // PolymorphicType
        g, parentID);
}

// Vertex Index
inline boost::property_map<LayoutGraphData, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const LayoutGraphData& /*g*/) noexcept {
    return {};
}

inline boost::property_map<LayoutGraphData, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, LayoutGraphData& /*g*/) noexcept {
    return {};
}

inline impl::ColorMap<LayoutGraphData::vertex_descriptor>
get(ccstd::pmr::vector<boost::default_color_type>& colors, const LayoutGraphData& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<LayoutGraphData, LayoutGraphData::NameTag>::const_type
get(LayoutGraphData::NameTag /*tag*/, const LayoutGraphData& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<LayoutGraphData, LayoutGraphData::NameTag>::type
get(LayoutGraphData::NameTag /*tag*/, LayoutGraphData& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<LayoutGraphData, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const LayoutGraphData& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<LayoutGraphData, LayoutGraphData::UpdateTag>::const_type
get(LayoutGraphData::UpdateTag /*tag*/, const LayoutGraphData& g) noexcept {
    return {g.updateFrequencies};
}

inline typename boost::property_map<LayoutGraphData, LayoutGraphData::UpdateTag>::type
get(LayoutGraphData::UpdateTag /*tag*/, LayoutGraphData& g) noexcept {
    return {g.updateFrequencies};
}

// Vertex Component
inline typename boost::property_map<LayoutGraphData, LayoutGraphData::LayoutTag>::const_type
get(LayoutGraphData::LayoutTag /*tag*/, const LayoutGraphData& g) noexcept {
    return {g.layouts};
}

inline typename boost::property_map<LayoutGraphData, LayoutGraphData::LayoutTag>::type
get(LayoutGraphData::LayoutTag /*tag*/, LayoutGraphData& g) noexcept {
    return {g.layouts};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<LayoutGraphData, T PipelineLayoutData::*>::const_type
get(T PipelineLayoutData::*memberPointer, const LayoutGraphData& g) noexcept {
    return {g.layouts, memberPointer};
}

template <class T>
inline typename boost::property_map<LayoutGraphData, T PipelineLayoutData::*>::type
get(T PipelineLayoutData::*memberPointer, LayoutGraphData& g) noexcept {
    return {g.layouts, memberPointer};
}

// PolymorphicGraph
inline LayoutGraphData::vertices_size_type
id(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g._vertices[u].handle);
}

inline LayoutGraphData::VertexTag
tag(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return ccstd::visit(
        overload(
            [](const impl::ValueHandle<RenderStageTag, vertex_descriptor>&) {
                return LayoutGraphData::VertexTag{RenderStageTag{}};
            },
            [](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>&) {
                return LayoutGraphData::VertexTag{RenderPhaseTag{}};
            }),
        g._vertices[u].handle);
}

inline LayoutGraphData::VertexValue
value(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexValue{&g.stages[h.value]};
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexValue{&g.phases[h.value]};
            }),
        g._vertices[u].handle);
}

inline LayoutGraphData::VertexConstValue
value(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexConstValue{&g.stages[h.value]};
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexConstValue{&g.phases[h.value]};
            }),
        g._vertices[u].handle);
}

template <class Tag>
inline bool
holds(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept;

template <>
inline bool
holds<RenderStageTag>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds<RenderPhaseTag>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<RenderStageData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <>
inline bool
holds_alternative<RenderPhaseData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept { // NOLINT
    return ccstd::holds_alternative<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(LayoutGraphData::vertex_descriptor /*v*/, LayoutGraphData& /*g*/);

template <>
inline RenderStageData&
get<RenderStageData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

template <>
inline RenderPhaseData&
get<RenderPhaseData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

template <class ValueT>
inline const ValueT&
get(LayoutGraphData::vertex_descriptor /*v*/, const LayoutGraphData& /*g*/);

template <>
inline const RenderStageData&
get<RenderStageData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

template <>
inline const RenderPhaseData&
get<RenderPhaseData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

inline RenderStageData&
get(RenderStageTag /*tag*/, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

inline RenderPhaseData&
get(RenderPhaseTag /*tag*/, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

inline const RenderStageData&
get(RenderStageTag /*tag*/, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.stages[handle.value];
}

inline const RenderPhaseData&
get(RenderPhaseTag /*tag*/, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = ccstd::get<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        g._vertices[v].handle);
    return g.phases[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept; // NOLINT

template <>
inline RenderStageData*
get_if<RenderStageData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept { // NOLINT
    RenderStageData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.stages[pHandle->value];
    }
    return ptr;
}

template <>
inline RenderPhaseData*
get_if<RenderPhaseData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept { // NOLINT
    RenderPhaseData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.phases[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept; // NOLINT

template <>
inline const RenderStageData*
get_if<RenderStageData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept { // NOLINT
    const RenderStageData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.stages[pHandle->value];
    }
    return ptr;
}

template <>
inline const RenderPhaseData*
get_if<RenderPhaseData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept { // NOLINT
    const RenderPhaseData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = ccstd::get_if<
        impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>>(
        &g._vertices[v].handle);
    if (pHandle) {
        ptr = &g.phases[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const LayoutGraphData& g, LayoutGraphData::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, LayoutGraphData& g, LayoutGraphData::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, LayoutGraphData& g,
    LayoutGraphData::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// AddressableGraph

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
getPath(
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraphData::vertex_descriptor u0, const LayoutGraphData& g,
    std::string_view prefix = {}, LayoutGraphData::vertex_descriptor parent = LayoutGraphData::null_vertex()) {
    output.clear();
    const auto sz0 = static_cast<std::ptrdiff_t>(prefix.size());
    auto       sz  = sz0;

    const auto& layoutGraphData = g;
    sz += impl::pathLength(u0, layoutGraphData, parent);

    output.resize(sz);

    impl::pathComposite(output, sz, u0, layoutGraphData, parent);
    CC_ENSURES(sz >= sz0);

    CC_ENSURES(sz == sz0);
    std::copy(prefix.begin(), prefix.end(), output.begin());

    return output;
}

inline ccstd::string
getPath(
    LayoutGraphData::vertex_descriptor u0, const LayoutGraphData& g,
    std::string_view prefix = {}, LayoutGraphData::vertex_descriptor parent = LayoutGraphData::null_vertex()) {
    ccstd::string output;
    getPath(output, u0, g, prefix, parent);
    return output;
}

inline ccstd::pmr::string
getPath(
    LayoutGraphData::vertex_descriptor u0, const LayoutGraphData& g,
    boost::container::pmr::memory_resource* mr, std::string_view prefix = {}, LayoutGraphData::vertex_descriptor parent = LayoutGraphData::null_vertex()) {
    ccstd::pmr::string output(mr);
    getPath(output, u0, g, prefix, parent);
    return output;
}

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
getPath(
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraphData::vertex_descriptor parent, std::string_view name, const LayoutGraphData& g) {
    output.clear();
    auto sz = impl::pathLength(parent, g);
    output.resize(sz + name.size() + 1);
    output[sz] = '/';
    std::copy(name.begin(), name.end(), output.begin() + sz + 1);
    impl::pathComposite(output, sz, parent, g);
    CC_ENSURES(sz == 0);
    return output;
}

inline ccstd::string
getPath(LayoutGraphData::vertex_descriptor parent, std::string_view name, const LayoutGraphData& g) {
    ccstd::string output;
    getPath(output, parent, name, g);
    return output;
}

inline ccstd::pmr::string
getPath(LayoutGraphData::vertex_descriptor parent, std::string_view name, const LayoutGraphData& g, boost::container::pmr::memory_resource* mr) {
    ccstd::pmr::string output(mr);
    getPath(output, parent, name, g);
    return output;
}

inline LayoutGraphData::vertex_descriptor
locate(std::string_view absolute, const LayoutGraphData& g) noexcept {
    auto iter = g.pathIndex.find(absolute);
    if (iter != g.pathIndex.end()) {
        return iter->second;
    }
    return LayoutGraphData::null_vertex();
};

inline LayoutGraphData::vertex_descriptor
locate(LayoutGraphData::vertex_descriptor u, std::string_view relative, const LayoutGraphData& g) {
    CC_EXPECTS(!boost::algorithm::starts_with(relative, "/"));
    CC_EXPECTS(!boost::algorithm::ends_with(relative, "/"));
    auto key = getPath(u, relative, g);
    impl::cleanPath(key);
    return locate(key, g);
};

inline bool
contains(std::string_view absolute, const LayoutGraphData& g) noexcept {
    return locate(absolute, g) != LayoutGraphData::null_vertex();
}

template <class ValueT>
inline ValueT&
get(std::string_view pt, LayoutGraphData& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraphData::null_vertex()) {
        throw std::out_of_range("at LayoutGraphData");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline const ValueT&
get(std::string_view pt, const LayoutGraphData& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraphData::null_vertex()) {
        throw std::out_of_range("at LayoutGraphData");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline ValueT*
get_if(std::string_view pt, LayoutGraphData* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraphData::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

template <class ValueT>
inline const ValueT*
get_if(std::string_view pt, const LayoutGraphData* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraphData::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

// MutableGraph(Vertex)
inline void addPathImpl(LayoutGraphData::vertex_descriptor u, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) { // NOLINT
    // add to parent
    if (u != LayoutGraphData::null_vertex()) {
        auto& outEdgeList = g.getChildrenList(u);
        outEdgeList.emplace_back(v);

        auto& inEdgeList = g.getParentsList(v);
        inEdgeList.emplace_back(u);
    }

    // add to external path index
    auto pathName = getPath(v, g, g.pathIndex.get_allocator().resource());
    auto res      = g.pathIndex.emplace(std::move(pathName), v);
    CC_ENSURES(res.second);
}

inline void removePathImpl(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept {
    // notice: here we use ccstd::string, not std::pmr::string
    // we do not want to increase the memory of g
    auto pathName = getPath(u, g);
    auto iter = g.pathIndex.find(std::string_view{pathName});
    CC_EXPECTS(iter != g.pathIndex.end());
    g.pathIndex.erase(iter);
    for (auto&& nvp : g.pathIndex) {
        auto& v = nvp.second;
        if (v > u) {
            --v;
        }
    }
}

inline void clear_out_edges(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept { // NOLINT
    // AddressableGraph (Alias)
    // only leaf node can be cleared.
    // clear internal node will broke tree structure.
    CC_EXPECTS(out_degree(u, g) == 0);

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

inline void clear_in_edges(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept { // NOLINT
    // AddressableGraph (Alias)
    CC_EXPECTS(out_degree(u, g) == 0);
    removePathImpl(u, g);

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

inline void clear_vertex(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const LayoutGraphData::VertexHandle& h, LayoutGraphData& g) noexcept { // NOLINT
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    ccstd::visit(
        overload(
            [&](const impl::ValueHandle<RenderStageTag, vertex_descriptor>& h) {
                g.stages.erase(g.stages.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.stages.size()) {
                    return;
                }
                impl::reindexVectorHandle<RenderStageTag>(g._vertices, h.value);
            },
            [&](const impl::ValueHandle<RenderPhaseTag, vertex_descriptor>& h) {
                g.phases.erase(g.phases.begin() + static_cast<std::ptrdiff_t>(h.value));
                if (h.value == g.phases.size()) {
                    return;
                }
                impl::reindexVectorHandle<RenderPhaseTag>(g._vertices, h.value);
            }),
        h);
}

inline void remove_vertex(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g._vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    impl::removeVectorVertex(const_cast<LayoutGraphData&>(g), u, LayoutGraphData::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + static_cast<std::ptrdiff_t>(u));
    g.updateFrequencies.erase(g.updateFrequencies.begin() + static_cast<std::ptrdiff_t>(u));
    g.layouts.erase(g.layouts.begin() + static_cast<std::ptrdiff_t>(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderStageData>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.stages.size())};
    g.stages.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, RenderPhaseData>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.phases.size())};
    g.phases.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class Component2, class ValueT>
inline LayoutGraphData::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraphData& g, LayoutGraphData::vertex_descriptor u = LayoutGraphData::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.updateFrequencies.emplace_back(std::forward<Component1>(c1));
    g.layouts.emplace_back(std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

template <class Tuple>
void addVertexImpl(RenderStageTag /*tag*/, Tuple &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RenderStageTag, LayoutGraphData::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.stages.size())};
            g.stages.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(RenderPhaseTag /*tag*/, Tuple &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert) {
    std::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<RenderPhaseTag, LayoutGraphData::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.phases.size())};
            g.phases.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Component2, class Tag, class ValueT>
inline LayoutGraphData::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraphData& g, LayoutGraphData::vertex_descriptor u = LayoutGraphData::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g._vertices.size());

    g._vertices.emplace_back();
    auto& vert = g._vertices.back();

    std::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    std::apply(
        [&](auto&&... args) {
            g.updateFrequencies.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    std::apply(
        [&](auto&&... args) {
            g.layouts.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

    // ReferenceGraph
    addPathImpl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline LayoutGraphData::vertex_descriptor
add_vertex(LayoutGraphData& g, Tag t, ccstd::pmr::string&& name, LayoutGraphData::vertex_descriptor parentID = LayoutGraphData::null_vertex()) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // updateFrequencies
        std::forward_as_tuple(),                // layouts
        std::forward_as_tuple(),                // PolymorphicType
        g, parentID);
}

template <class Tag>
inline LayoutGraphData::vertex_descriptor
add_vertex(LayoutGraphData& g, Tag t, const char* name, LayoutGraphData::vertex_descriptor parentID = LayoutGraphData::null_vertex()) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // updateFrequencies
        std::forward_as_tuple(),     // layouts
        std::forward_as_tuple(),     // PolymorphicType
        g, parentID);
}

} // namespace render

} // namespace cc

// clang-format on
