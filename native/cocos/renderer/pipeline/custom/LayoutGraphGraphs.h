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
#include "cocos/renderer/pipeline/custom/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/LayoutGraphTypes.h"
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

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
    // remove out-edges
    auto& outEdgeList = g.getOutEdgeList(u);
    // eraseFromIncidenceList
    impl::sequenceEraseIf(outEdgeList, [v](const auto& e) {
        return e.get_target() == v;
    });

    // remove reciprocal (bidirectional) in-edges
    auto& inEdgeList = g.getInEdgeList(v);
    // eraseFromIncidenceList
    impl::sequenceEraseIf(inEdgeList, [u](const auto& e) {
        return e.get_target() == u;
    });
}

inline void remove_edge(LayoutGraphData::edge_descriptor e, LayoutGraphData& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(LayoutGraphData::out_edge_iterator iter, LayoutGraphData& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    auto& inEdgeList  = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(LayoutGraphData::vertex_descriptor u, Predicate&& pred, LayoutGraphData& g) noexcept { // NOLINT
    for (auto pair = out_edges(u, g); pair.first != pair.second; ++pair.first) {
        auto& outIter = pair.first;
        auto& outEnd = pair.second;
        if (pred(*outIter)) {
            auto& inEdgeList = g.getInEdgeList(target(*outIter, g));
            auto  e          = *outIter;
            impl::removeIncidenceEdge(e, inEdgeList);
        }
    }
    auto pair = out_edges(u, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& outEdgeList  = g.getOutEdgeList(u);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, outEdgeList, std::forward<Predicate>(pred));
}

template <class Predicate>
inline void remove_in_edge_if(LayoutGraphData::vertex_descriptor v, Predicate&& pred, LayoutGraphData& g) noexcept { // NOLINT
    for (auto pair = in_edges(v, g); pair.first != pair.second; ++pair.first) {
        auto& inIter = pair.first;
        auto& inEnd = pair.second;
        if (pred(*inIter)) {
            auto& outEdgeList = g.getOutEdgeList(source(*inIter, g));
            auto  e           = *inIter;
            impl::removeIncidenceEdge(e, outEdgeList);
        }
    }
    auto pair = in_edges(v, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& inEdgeList   = g.getInEdgeList(v);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, inEdgeList, std::forward<Predicate>(pred));
}

template <class Predicate>
inline void remove_edge_if(Predicate&& pred, LayoutGraphData& g) noexcept { // NOLINT
    auto pair = edges(g);
    auto& ei = pair.first;
    auto& eiEnd = pair.second;
    for (auto next = ei; ei != eiEnd; ei = next) {
        ++next;
        if (pred(*ei)) {
            remove_edge(*ei, g);
        }
    }
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
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraphData,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::LayoutGraphData, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraphData,
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraphData,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraphData, cc::render::LayoutGraphData::UpdateTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const container::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        const cc::render::UpdateFrequency&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        container::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        cc::render::UpdateFrequency&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraphData, cc::render::LayoutGraphData::LayoutTag> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const container::pmr::vector<cc::render::LayoutData>,
        cc::render::LayoutData,
        const cc::render::LayoutData&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        container::pmr::vector<cc::render::LayoutData>,
        cc::render::LayoutData,
        cc::render::LayoutData&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::LayoutGraphData, T cc::render::LayoutData::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraphData,
        const container::pmr::vector<cc::render::LayoutData>,
        T,
        const T&,
        T cc::render::LayoutData::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraphData,
        container::pmr::vector<cc::render::LayoutData>,
        T,
        T&,
        T cc::render::LayoutData::*>;
};

} // namespace boost

namespace cc {

namespace render {

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
get(boost::container::pmr::vector<boost::default_color_type>& colors, const LayoutGraphData& /*g*/) noexcept {
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
inline typename boost::property_map<LayoutGraphData, T LayoutData::*>::const_type
get(T LayoutData::*memberPointer, const LayoutGraphData& g) noexcept {
    return {g.layouts, memberPointer};
}

template <class T>
inline typename boost::property_map<LayoutGraphData, T LayoutData::*>::type
get(T LayoutData::*memberPointer, LayoutGraphData& g) noexcept {
    return {g.layouts, memberPointer};
}

// PolymorphicGraph
inline LayoutGraphData::vertices_size_type
id(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<GroupTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<ShaderTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g.vertices[u].handle);
}

inline LayoutGraphData::VertexTag
tag(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<GroupTag, vertex_descriptor>&) {
                return LayoutGraphData::VertexTag{GroupTag{}};
            },
            [](const impl::ValueHandle<ShaderTag, vertex_descriptor>&) {
                return LayoutGraphData::VertexTag{ShaderTag{}};
            }),
        g.vertices[u].handle);
}

inline LayoutGraphData::VertexValue
value(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<GroupTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexValue{&g.groupNodes[h.value]};
            },
            [&](const impl::ValueHandle<ShaderTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexValue{&g.shaderNodes[h.value]};
            }),
        g.vertices[u].handle);
}

inline LayoutGraphData::VertexConstValue
value(LayoutGraphData::vertex_descriptor u, const LayoutGraphData& g) noexcept {
    using vertex_descriptor = LayoutGraphData::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<GroupTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexConstValue{&g.groupNodes[h.value]};
            },
            [&](const impl::ValueHandle<ShaderTag, vertex_descriptor>& h) {
                return LayoutGraphData::VertexConstValue{&g.shaderNodes[h.value]};
            }),
        g.vertices[u].handle);
}

template <class Tag>
inline bool
holds(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept;

template <>
inline bool
holds<GroupTag>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
    return boost::variant2::holds_alternative<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
inline bool
holds<ShaderTag>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept {
    return boost::variant2::holds_alternative<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<GroupNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
inline bool
holds_alternative<ShaderNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(LayoutGraphData::vertex_descriptor /*v*/, LayoutGraphData& /*g*/);

template <>
inline GroupNodeData&
get<GroupNodeData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.groupNodes[handle.value];
}

template <>
inline ShaderNodeData&
get<ShaderNodeData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.shaderNodes[handle.value];
}

template <class ValueT>
inline const ValueT&
get(LayoutGraphData::vertex_descriptor /*v*/, const LayoutGraphData& /*g*/);

template <>
inline const GroupNodeData&
get<GroupNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.groupNodes[handle.value];
}

template <>
inline const ShaderNodeData&
get<ShaderNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.shaderNodes[handle.value];
}

inline GroupNodeData&
get(GroupTag /*tag*/, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.groupNodes[handle.value];
}

inline ShaderNodeData&
get(ShaderTag /*tag*/, LayoutGraphData::vertex_descriptor v, LayoutGraphData& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.shaderNodes[handle.value];
}

inline const GroupNodeData&
get(GroupTag /*tag*/, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.groupNodes[handle.value];
}

inline const ShaderNodeData&
get(ShaderTag /*tag*/, LayoutGraphData::vertex_descriptor v, const LayoutGraphData& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.shaderNodes[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept; // NOLINT

template <>
inline GroupNodeData*
get_if<GroupNodeData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept { // NOLINT
    GroupNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.groupNodes[pHandle->value];
    }
    return ptr;
}

template <>
inline ShaderNodeData*
get_if<ShaderNodeData>(LayoutGraphData::vertex_descriptor v, LayoutGraphData* pGraph) noexcept { // NOLINT
    ShaderNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.shaderNodes[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept; // NOLINT

template <>
inline const GroupNodeData*
get_if<GroupNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept { // NOLINT
    const GroupNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.groupNodes[pHandle->value];
    }
    return ptr;
}

template <>
inline const ShaderNodeData*
get_if<ShaderNodeData>(LayoutGraphData::vertex_descriptor v, const LayoutGraphData* pGraph) noexcept { // NOLINT
    const ShaderNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.shaderNodes[pHandle->value];
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
    boost::string_view prefix = {}, LayoutGraphData::vertex_descriptor parent = LayoutGraphData::null_vertex()) {
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

inline std::string
getPath(
    LayoutGraphData::vertex_descriptor u0, const LayoutGraphData& g,
    boost::string_view prefix = {}, LayoutGraphData::vertex_descriptor parent = LayoutGraphData::null_vertex()) {
    std::string output;
    getPath(output, u0, g, prefix, parent);
    return output;
}

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
getPath(
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraphData::vertex_descriptor parent, boost::string_view name, const LayoutGraphData& g) {
    output.clear();
    auto sz = impl::pathLength(parent, g);
    output.resize(sz + name.size() + 1);
    output[sz] = '/';
    std::copy(name.begin(), name.end(), output.begin() + sz + 1);
    impl::pathComposite(output, sz, parent, g);
    CC_ENSURES(sz == 0);
    return output;
}

inline std::string
getPath(LayoutGraphData::vertex_descriptor parent, boost::string_view name, const LayoutGraphData& g) {
    std::string output;
    getPath(output, parent, name, g);
    return output;
}

inline LayoutGraphData::vertex_descriptor
locate(boost::string_view absolute, const LayoutGraphData& g) noexcept {
    auto iter = g.pathIndex.find(absolute);
    if (iter != g.pathIndex.end()) {
        return iter->second;
    }
    return LayoutGraphData::null_vertex();
};

inline LayoutGraphData::vertex_descriptor
locate(LayoutGraphData::vertex_descriptor u, boost::string_view relative, const LayoutGraphData& g) {
    CC_EXPECTS(!relative.starts_with('/'));
    CC_EXPECTS(!relative.ends_with('/'));
    auto key = getPath(u, relative, g);
    impl::cleanPath(key);
    return locate(key, g);
};

inline bool
contains(boost::string_view absolute, const LayoutGraphData& g) noexcept {
    return locate(absolute, g) != LayoutGraphData::null_vertex();
}

template <class ValueT>
inline ValueT&
get(boost::string_view pt, LayoutGraphData& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraphData::null_vertex()) {
        throw std::out_of_range("at LayoutGraphData");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline const ValueT&
get(boost::string_view pt, const LayoutGraphData& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraphData::null_vertex()) {
        throw std::out_of_range("at LayoutGraphData");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
inline ValueT*
get_if(boost::string_view pt, LayoutGraphData* pGraph) noexcept { // NOLINT
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
get_if(boost::string_view pt, const LayoutGraphData* pGraph) noexcept { // NOLINT
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
    auto pathName = getPath(v, g);
    auto res      = g.pathIndex.emplace(std::move(pathName), v);
    CC_ENSURES(res.second);
}

inline void removePathImpl(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept {
    // notice: here we use std::string, not std::pmr::string
    // we do not want to increase the memory of g
    auto pathName = getPath(u, g);
    auto iter     = g.pathIndex.find(boost::string_view(pathName));
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
    cc::visit(
        overload(
            [&](const impl::ValueHandle<GroupTag, vertex_descriptor>& h) {
                g.groupNodes.erase(g.groupNodes.begin() + std::ptrdiff_t(h.value));
                if (h.value == g.groupNodes.size()) {
                    return;
                }
                impl::reindexVectorHandle<GroupTag>(g.vertices, h.value);
            },
            [&](const impl::ValueHandle<ShaderTag, vertex_descriptor>& h) {
                g.shaderNodes.erase(g.shaderNodes.begin() + std::ptrdiff_t(h.value));
                if (h.value == g.shaderNodes.size()) {
                    return;
                }
                impl::reindexVectorHandle<ShaderTag>(g.vertices, h.value);
            }),
        h);
}

inline void remove_vertex(LayoutGraphData::vertex_descriptor u, LayoutGraphData& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g.vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    impl::removeVectorVertex(const_cast<LayoutGraphData&>(g), u, LayoutGraphData::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + std::ptrdiff_t(u));
    g.updateFrequencies.erase(g.updateFrequencies.begin() + std::ptrdiff_t(u));
    g.layouts.erase(g.layouts.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, GroupNodeData>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.groupNodes.size())};
    g.groupNodes.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ShaderNodeData>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.shaderNodes.size())};
    g.shaderNodes.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class Component2, class ValueT>
inline LayoutGraphData::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraphData& g, LayoutGraphData::vertex_descriptor u = LayoutGraphData::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();
    auto& vert = g.vertices.back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.updateFrequencies.emplace_back(std::forward<Component1>(c1));
    g.layouts.emplace_back(std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    // AddressableGraph
    addPathImpl(u, v, g);

    return v;
}

template <class Tuple>
void addVertexImpl(GroupTag /*tag*/, Tuple &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert) {
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<GroupTag, LayoutGraphData::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.groupNodes.size())};
            g.groupNodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(ShaderTag /*tag*/, Tuple &&val, LayoutGraphData &g, LayoutGraphData::Vertex &vert) {
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<ShaderTag, LayoutGraphData::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.shaderNodes.size())};
            g.shaderNodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Component2, class Tag, class ValueT>
inline LayoutGraphData::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraphData& g, LayoutGraphData::vertex_descriptor u = LayoutGraphData::null_vertex()) {
    auto v = gsl::narrow_cast<LayoutGraphData::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();
    auto& vert = g.vertices.back();

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.updateFrequencies.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.layouts.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

    // AddressableGraph
    addPathImpl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline LayoutGraphData::vertex_descriptor
add_vertex(LayoutGraphData& g, Tag t, std::string&& name, LayoutGraphData::vertex_descriptor parentID = LayoutGraphData::null_vertex()) { // NOLINT
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
