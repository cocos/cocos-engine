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
inline LayoutGraph::vertex_descriptor
source(const LayoutGraph::edge_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.m_source;
}

inline LayoutGraph::vertex_descriptor
target(const LayoutGraph::edge_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.m_target;
}

inline std::pair<LayoutGraph::out_edge_iterator, LayoutGraph::out_edge_iterator>
out_edges(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraph::out_edge_iterator(const_cast<LayoutGraph&>(g).out_edge_list(u).begin(), u),
        LayoutGraph::out_edge_iterator(const_cast<LayoutGraph&>(g).out_edge_list(u).end(), u));
}

inline LayoutGraph::degree_size_type
out_degree(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::degree_size_type>(g.out_edge_list(u).size());
}

inline std::pair<LayoutGraph::edge_descriptor, bool>
edge(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept {
    const auto& outEdgeList = g.out_edge_list(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraph::out_edge_type(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<LayoutGraph::in_edge_iterator, LayoutGraph::in_edge_iterator>
in_edges(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return std::make_pair(
        LayoutGraph::in_edge_iterator(const_cast<LayoutGraph&>(g).in_edge_list(u).begin(), u),
        LayoutGraph::in_edge_iterator(const_cast<LayoutGraph&>(g).in_edge_list(u).end(), u));
}

inline LayoutGraph::degree_size_type
in_degree(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::degree_size_type>(g.in_edge_list(u).size());
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
    return std::make_pair(const_cast<LayoutGraph&>(g).vertex_set().begin(), const_cast<LayoutGraph&>(g).vertex_set().end());
}

inline LayoutGraph::vertices_size_type
num_vertices(const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::vertices_size_type>(g.vertex_set().size());
}

// EdgeListGraph
inline std::pair<LayoutGraph::edge_iterator, LayoutGraph::edge_iterator>
edges(const LayoutGraph& g0) noexcept {
    auto& g = const_cast<LayoutGraph&>(g0);
    return std::make_pair(
        LayoutGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().begin(), g.vertex_set().end(), g),
        LayoutGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().end(), g.vertex_set().end(), g));
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
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(LayoutGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) noexcept { // NOLINT
    // remove out-edges
    auto& outEdgeList = g.out_edge_list(u);
    // eraseFromIncidenceList
    impl::sequenceEraseIf(outEdgeList, [v](const auto& e) {
        return e.get_target() == v;
    });

    // remove reciprocal (bidirectional) in-edges
    auto& inEdgeList = g.in_edge_list(v);
    // eraseFromIncidenceList
    impl::sequenceEraseIf(inEdgeList, [u](const auto& e) {
        return e.get_target() == u;
    });
}

inline void remove_edge(LayoutGraph::edge_descriptor e, LayoutGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.out_edge_list(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(LayoutGraph::out_edge_iterator iter, LayoutGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.out_edge_list(source(e, g));
    auto& inEdgeList  = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(LayoutGraph::vertex_descriptor u, Predicate&& pred, LayoutGraph& g) noexcept { // NOLINT
    for (auto pair = out_edges(u, g); pair.first != pair.second; ++pair.first) {
        auto& outIter = pair.first;
        auto& outEnd = pair.second;
        if (pred(*outIter)) {
            auto& inEdgeList = g.in_edge_list(target(*outIter, g));
            auto  e          = *outIter;
            impl::removeIncidenceEdge(e, inEdgeList);
        }
    }
    auto pair = out_edges(u, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& outEdgeList  = g.out_edge_list(u);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, outEdgeList, std::forward<Predicate>(pred));
}

template <class Predicate>
inline void remove_in_edge_if(LayoutGraph::vertex_descriptor v, Predicate&& pred, LayoutGraph& g) noexcept { // NOLINT
    for (auto pair = in_edges(v, g); pair.first != pair.second; ++pair.first) {
        auto& inIter = pair.first;
        auto& inEnd = pair.second;
        if (pred(*inIter)) {
            auto& outEdgeList = g.out_edge_list(source(*inIter, g));
            auto  e           = *inIter;
            impl::removeIncidenceEdge(e, outEdgeList);
        }
    }
    auto pair = in_edges(v, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& inEdgeList   = g.in_edge_list(v);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, inEdgeList, std::forward<Predicate>(pred));
}

template <class Predicate>
inline void remove_edge_if(Predicate&& pred, LayoutGraph& g) noexcept { // NOLINT
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
inline LayoutGraph::vertex_descriptor
parent(const LayoutGraph::ownership_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.m_source;
}

inline LayoutGraph::vertex_descriptor
child(const LayoutGraph::ownership_descriptor& e, const LayoutGraph& /*g*/) noexcept {
    return e.m_target;
}

inline std::pair<LayoutGraph::children_iterator, LayoutGraph::children_iterator>
children(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return std::make_pair(
        LayoutGraph::children_iterator(const_cast<LayoutGraph&>(g).children_list(u).begin(), u),
        LayoutGraph::children_iterator(const_cast<LayoutGraph&>(g).children_list(u).end(), u));
}

inline LayoutGraph::children_size_type
num_children(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::children_size_type>(g.children_list(u).size());
}

inline std::pair<LayoutGraph::ownership_descriptor, bool>
ownership(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) noexcept {
    auto& outEdgeList = g.children_list(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), LayoutGraph::out_edge_type(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {LayoutGraph::ownership_descriptor(u, v), hasEdge};
}

inline std::pair<LayoutGraph::parent_iterator, LayoutGraph::parent_iterator>
parents(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    return std::make_pair(
        LayoutGraph::parent_iterator(const_cast<LayoutGraph&>(g).parents_list(u).begin(), u),
        LayoutGraph::parent_iterator(const_cast<LayoutGraph&>(g).parents_list(u).end(), u));
}

inline LayoutGraph::children_size_type
num_parents(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<LayoutGraph::children_size_type>(g.parents_list(u).size());
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
    Expects(u != v);
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
ownerships(const LayoutGraph& g0) noexcept {
    auto& g = const_cast<LayoutGraph&>(g0);
    return std::make_pair(
        LayoutGraph::ownership_iterator(g.vertex_set().begin(), g.vertex_set().begin(), g.vertex_set().end(), g),
        LayoutGraph::ownership_iterator(g.vertex_set().begin(), g.vertex_set().end(), g.vertex_set().end(), g));
}

inline LayoutGraph::ownerships_size_type
num_ownerships(const LayoutGraph& g) noexcept { // NOLINT
    LayoutGraph::ownerships_size_type numEdges = 0;
    auto                              range    = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += num_children(*iter, g);
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
struct property_map<cc::render::LayoutGraph, cc::render::LayoutGraph::name_> {
    using const_type = cc::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraph,
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraph,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::LayoutGraph, vertex_name_t> {
    using const_type = cc::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::LayoutGraph,
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::LayoutGraph,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraph, cc::render::LayoutGraph::update_> {
    using const_type = cc::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraph,
        const container::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        const cc::render::UpdateFrequency&>;
    using type = cc::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraph,
        container::pmr::vector<cc::render::UpdateFrequency>,
        cc::render::UpdateFrequency,
        cc::render::UpdateFrequency&>;
};

// Vertex Component
template <>
struct property_map<cc::render::LayoutGraph, cc::render::LayoutGraph::layout_> {
    using const_type = cc::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraph,
        const container::pmr::vector<cc::render::LayoutData>,
        cc::render::LayoutData,
        const cc::render::LayoutData&>;
    using type = cc::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraph,
        container::pmr::vector<cc::render::LayoutData>,
        cc::render::LayoutData,
        cc::render::LayoutData&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::LayoutGraph, T cc::render::LayoutData::*> {
    using const_type = cc::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::LayoutGraph,
        const container::pmr::vector<cc::render::LayoutData>,
        T,
        const T&,
        T cc::render::LayoutData::*>;
    using type = cc::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::LayoutGraph,
        container::pmr::vector<cc::render::LayoutData>,
        T,
        T&,
        T cc::render::LayoutData::*>;
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

[[nodiscard]] inline impl::ColorMap<LayoutGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const LayoutGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<LayoutGraph, LayoutGraph::name_>::const_type
get(LayoutGraph::name_ /*tag*/, const LayoutGraph& g) noexcept {
    return {g.mName};
}

inline typename boost::property_map<LayoutGraph, LayoutGraph::name_>::type
get(LayoutGraph::name_ /*tag*/, LayoutGraph& g) noexcept {
    return {g.mName};
}

// Vertex Name
inline boost::property_map<LayoutGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const LayoutGraph& g) noexcept {
    return {g.mName};
}

// Vertex Component
inline typename boost::property_map<LayoutGraph, LayoutGraph::update_>::const_type
get(LayoutGraph::update_ /*tag*/, const LayoutGraph& g) noexcept {
    return {g.mUpdateFrequencies};
}

inline typename boost::property_map<LayoutGraph, LayoutGraph::update_>::type
get(LayoutGraph::update_ /*tag*/, LayoutGraph& g) noexcept {
    return {g.mUpdateFrequencies};
}

// Vertex Component
inline typename boost::property_map<LayoutGraph, LayoutGraph::layout_>::const_type
get(LayoutGraph::layout_ /*tag*/, const LayoutGraph& g) noexcept {
    return {g.mLayouts};
}

inline typename boost::property_map<LayoutGraph, LayoutGraph::layout_>::type
get(LayoutGraph::layout_ /*tag*/, LayoutGraph& g) noexcept {
    return {g.mLayouts};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<LayoutGraph, T LayoutData::*>::const_type
get(T LayoutData::*memberPointer, const LayoutGraph& g) noexcept {
    return {g.mLayouts, memberPointer};
}

template <class T>
inline typename boost::property_map<LayoutGraph, T LayoutData::*>::type
get(T LayoutData::*memberPointer, LayoutGraph& g) noexcept {
    return {g.mLayouts, memberPointer};
}

// PolymorphicGraph
[[nodiscard]] inline LayoutGraph::vertices_size_type
value_id(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Group_, vertex_descriptor>& h) {
                return h.mValue;
            },
            [](const impl::ValueHandle<Shader_, vertex_descriptor>& h) {
                return h.mValue;
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline LayoutGraph::vertex_tag_type
tag(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Group_, vertex_descriptor>&) {
                return LayoutGraph::vertex_tag_type{Group_{}};
            },
            [](const impl::ValueHandle<Shader_, vertex_descriptor>&) {
                return LayoutGraph::vertex_tag_type{Shader_{}};
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline LayoutGraph::vertex_value_type
value(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Group_, vertex_descriptor>& h) {
                return LayoutGraph::vertex_value_type{&g.mGroupNodes[h.mValue]};
            },
            [&](const impl::ValueHandle<Shader_, vertex_descriptor>& h) {
                return LayoutGraph::vertex_value_type{&g.mShaderNodes[h.mValue]};
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline LayoutGraph::vertex_const_value_type
value(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept {
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Group_, vertex_descriptor>& h) {
                return LayoutGraph::vertex_const_value_type{&g.mGroupNodes[h.mValue]};
            },
            [&](const impl::ValueHandle<Shader_, vertex_descriptor>& h) {
                return LayoutGraph::vertex_const_value_type{&g.mShaderNodes[h.mValue]};
            }),
        g.mVertices[u].mHandle);
}

template <class Tag>
[[nodiscard]] inline bool
holds_tag(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_tag<Group_>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Shader_>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <class ValueT>
[[nodiscard]] inline bool
holds_alternative(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_alternative<GroupNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<ShaderNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <class ValueT>
[[nodiscard]] inline ValueT&
get(LayoutGraph::vertex_descriptor /*v*/, LayoutGraph& /*g*/);

template <>
[[nodiscard]] inline GroupNodeData&
get<GroupNodeData>(LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mGroupNodes[handle.mValue];
}

template <>
[[nodiscard]] inline ShaderNodeData&
get<ShaderNodeData>(LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mShaderNodes[handle.mValue];
}

template <class ValueT>
[[nodiscard]] inline const ValueT&
get(LayoutGraph::vertex_descriptor /*v*/, const LayoutGraph& /*g*/);

template <>
[[nodiscard]] inline const GroupNodeData&
get<GroupNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mGroupNodes[handle.mValue];
}

template <>
[[nodiscard]] inline const ShaderNodeData&
get<ShaderNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mShaderNodes[handle.mValue];
}

[[nodiscard]] inline GroupNodeData&
get(Group_ /*tag*/, LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mGroupNodes[handle.mValue];
}

[[nodiscard]] inline ShaderNodeData&
get(Shader_ /*tag*/, LayoutGraph::vertex_descriptor v, LayoutGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mShaderNodes[handle.mValue];
}

[[nodiscard]] inline const GroupNodeData&
get(Group_ /*tag*/, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mGroupNodes[handle.mValue];
}

[[nodiscard]] inline const ShaderNodeData&
get(Shader_ /*tag*/, LayoutGraph::vertex_descriptor v, const LayoutGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mShaderNodes[handle.mValue];
}

template <class ValueT>
[[nodiscard]] inline ValueT*
get_if(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline GroupNodeData*
get_if<GroupNodeData>(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept { // NOLINT
    GroupNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mGroupNodes[pHandle->mValue];
    }
    return ptr;
}

template <>
[[nodiscard]] inline ShaderNodeData*
get_if<ShaderNodeData>(LayoutGraph::vertex_descriptor v, LayoutGraph* pGraph) noexcept { // NOLINT
    ShaderNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mShaderNodes[pHandle->mValue];
    }
    return ptr;
}

template <class ValueT>
[[nodiscard]] inline const ValueT*
get_if(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline const GroupNodeData*
get_if<GroupNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept { // NOLINT
    const GroupNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mGroupNodes[pHandle->mValue];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const ShaderNodeData*
get_if<ShaderNodeData>(LayoutGraph::vertex_descriptor v, const LayoutGraph* pGraph) noexcept { // NOLINT
    const ShaderNodeData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mShaderNodes[pHandle->mValue];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const LayoutGraph& g, LayoutGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
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
[[nodiscard]] inline std::ptrdiff_t
path_length(LayoutGraph::vertex_descriptor u, const LayoutGraph& g) noexcept { // NOLINT
    return impl::pathLength(u, g);
}

template <class Allocator>
inline void
path_composite( // NOLINT
    std::basic_string<char, std::char_traits<char>, Allocator>& str,
    std::ptrdiff_t& sz, LayoutGraph::vertex_descriptor u,
    const LayoutGraph& g) noexcept {
    impl::pathComposite(str, sz, u, g);
}

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
get_path( // NOLINT
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraph::vertex_descriptor u0, const LayoutGraph& g,
    boost::string_view prefix = {}, LayoutGraph::vertex_descriptor parent = LayoutGraph::null_vertex()) {
    output.clear();
    const auto sz0 = static_cast<std::ptrdiff_t>(prefix.size());
    auto       sz  = sz0;

    const auto& layoutGraph = g;
    sz += impl::pathLength(u0, layoutGraph, parent);

    output.resize(sz);

    impl::pathComposite(output, sz, u0, layoutGraph, parent);
    Ensures(sz >= sz0);

    Ensures(sz == sz0);
    std::copy(prefix.begin(), prefix.end(), output.begin());

    return output;
}

[[nodiscard]] inline std::string
get_path( // NOLINT
    LayoutGraph::vertex_descriptor u0, const LayoutGraph& g,
    boost::string_view prefix = {}, LayoutGraph::vertex_descriptor parent = LayoutGraph::null_vertex()) {
    std::string output;
    get_path(output, u0, g, prefix, parent);
    return output;
}

template <class Allocator>
inline const std::basic_string<char, std::char_traits<char>, Allocator>&
get_path( // NOLINT
    std::basic_string<char, std::char_traits<char>, Allocator>& output,
    LayoutGraph::vertex_descriptor parent, boost::string_view name, const LayoutGraph& g) { // NOLINT
    output.clear();
    auto sz = path_length(parent, g);
    output.resize(sz + name.size() + 1);
    output[sz] = '/';
    std::copy(name.begin(), name.end(), output.begin() + sz + 1);
    path_composite(output, sz, parent, g);
    Ensures(sz == 0);
    return output;
}

[[nodiscard]] inline std::string
get_path(LayoutGraph::vertex_descriptor parent, boost::string_view name, const LayoutGraph& g) { // NOLINT
    std::string output;
    get_path(output, parent, name, g);
    return output;
}

[[nodiscard]] inline LayoutGraph::vertex_descriptor
locate(boost::string_view absolute, const LayoutGraph& g) noexcept {
    auto iter = g.mPathIndex.find(absolute);
    if (iter != g.mPathIndex.end()) {
        return iter->second;
    }
    return LayoutGraph::null_vertex();
};

[[nodiscard]] inline LayoutGraph::vertex_descriptor
locate(LayoutGraph::vertex_descriptor u, boost::string_view relative, const LayoutGraph& g) {
    Expects(!relative.starts_with('/'));
    Expects(!relative.ends_with('/'));
    auto key = get_path(u, relative, g);
    cleanPath(key);
    return locate(key, g);
};

[[nodiscard]] inline bool
contains(boost::string_view absolute, const LayoutGraph& g) noexcept {
    return locate(absolute, g) != LayoutGraph::null_vertex();
}

template <class ValueT>
[[nodiscard]] inline ValueT&
get(boost::string_view pt, LayoutGraph& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraph::null_vertex()) {
        throw std::out_of_range("at LayoutGraph");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
[[nodiscard]] inline const ValueT&
get(boost::string_view pt, const LayoutGraph& g) {
    auto v = locate(pt, g);
    if (v == LayoutGraph::null_vertex()) {
        throw std::out_of_range("at LayoutGraph");
    }
    return get<ValueT>(v, g);
}

template <class ValueT>
[[nodiscard]] inline ValueT*
get_if(boost::string_view pt, LayoutGraph* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraph::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

template <class ValueT>
[[nodiscard]] inline const ValueT*
get_if(boost::string_view pt, const LayoutGraph* pGraph) noexcept { // NOLINT
    if (pGraph) {
        auto v = locate(pt, *pGraph);
        if (v != LayoutGraph::null_vertex()) {
            return get_if<ValueT>(v, pGraph);
        }
    }
    return nullptr;
}

// MutableGraph(Vertex)
inline void add_path_impl(LayoutGraph::vertex_descriptor u, LayoutGraph::vertex_descriptor v, LayoutGraph& g) { // NOLINT
    // add to parent
    if (u != LayoutGraph::null_vertex()) {
        auto& outEdgeList = g.children_list(u);
        outEdgeList.emplace_back(v);

        auto& inEdgeList = g.parents_list(v);
        inEdgeList.emplace_back(u);
    }

    // add to external path index
    auto pathName = get_path(v, g);
    auto res      = g.mPathIndex.emplace(std::move(pathName), v);
    Ensures(res.second);
}

inline void remove_path_impl(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // notice: here we use std::string, not std::pmr::string
    // we do not want to increase the memory of g
    auto pathName = get_path(u, g);
    auto iter     = g.mPathIndex.find(boost::string_view(pathName));
    Expects(iter != g.mPathIndex.end());
    g.mPathIndex.erase(iter);
    for (auto&& nvp : g.mPathIndex) {
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
    Expects(out_degree(u, g) == 0);

    // Bidirectional (OutEdges)
    auto& outEdgeList = g.out_edge_list(u);
    auto  outEnd      = outEdgeList.end();
    for (auto iter = outEdgeList.begin(); iter != outEnd; ++iter) {
        auto& inEdgeList = g.in_edge_list((*iter).get_target());
        // eraseFromIncidenceList
        impl::sequenceEraseIf(inEdgeList, [u](const auto& e) {
            return e.get_target() == u;
        });
    }
    outEdgeList.clear();
}

inline void clear_in_edges(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // AddressableGraph (Alias)
    Expects(out_degree(u, g) == 0);
    remove_path_impl(u, g);

    // Bidirectional (InEdges)
    auto& inEdgeList = g.in_edge_list(u);
    auto  inEnd      = inEdgeList.end();
    for (auto iter = inEdgeList.begin(); iter != inEnd; ++iter) {
        auto& outEdgeList = g.out_edge_list((*iter).get_target());
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

inline void remove_vertex_value_impl(const LayoutGraph::vertex_handle_type& h, LayoutGraph& g) noexcept { // NOLINT
    using vertex_descriptor = LayoutGraph::vertex_descriptor;
    cc::visit(
        overload(
            [&](const impl::ValueHandle<Group_, vertex_descriptor>& h) {
                g.mGroupNodes.erase(g.mGroupNodes.begin() + std::ptrdiff_t(h.mValue));
                if (h.mValue == g.mGroupNodes.size()) {
                    return;
                }
                impl::reindexVectorHandle<Group_>(g.mVertices, h.mValue);
            },
            [&](const impl::ValueHandle<Shader_, vertex_descriptor>& h) {
                g.mShaderNodes.erase(g.mShaderNodes.begin() + std::ptrdiff_t(h.mValue));
                if (h.mValue == g.mShaderNodes.size()) {
                    return;
                }
                impl::reindexVectorHandle<Shader_>(g.mVertices, h.mValue);
            }),
        h);
}

inline void remove_vertex(LayoutGraph::vertex_descriptor u, LayoutGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g.mVertices[u];
    remove_vertex_value_impl(vert.mHandle, g);
    impl::removeVectorVertex(const_cast<LayoutGraph&>(g), u, LayoutGraph::directed_category{});

    // remove components
    g.mName.erase(g.mName.begin() + std::ptrdiff_t(u));
    g.mUpdateFrequencies.erase(g.mUpdateFrequencies.begin() + std::ptrdiff_t(u));
    g.mLayouts.erase(g.mLayouts.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void add_vertex_impl( // NOLINT
    ValueT &&val, LayoutGraph &g, LayoutGraph::vertex_type &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, GroupNodeData>::value>* dummy = nullptr) { // NOLINT
    vert.mHandle = impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mGroupNodes.size())};
    g.mGroupNodes.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void add_vertex_impl( // NOLINT
    ValueT &&val, LayoutGraph &g, LayoutGraph::vertex_type &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, ShaderNodeData>::value>* dummy = nullptr) { // NOLINT
    vert.mHandle = impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>{
        gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mShaderNodes.size())};
    g.mShaderNodes.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class Component2, class ValueT>
inline LayoutGraph::vertex_descriptor
add_vertex(Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraph& g, LayoutGraph::vertex_descriptor u = LayoutGraph::null_vertex()) { // NOLINT
    auto v = gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mVertices.size());

    g.mVertices.emplace_back();
    auto& vert = g.mVertices.back();
    g.mName.emplace_back(std::forward<Component0>(c0));
    g.mUpdateFrequencies.emplace_back(std::forward<Component1>(c1));
    g.mLayouts.emplace_back(std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    add_vertex_impl(std::forward<ValueT>(val), g, vert);

    // AddressableGraph
    add_path_impl(u, v, g);

    return v;
}

template <class Tuple>
void add_vertex_impl(Group_ /*tag*/, Tuple &&val, LayoutGraph &g, LayoutGraph::vertex_type &vert) { // NOLINT
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.mHandle = impl::ValueHandle<Group_, LayoutGraph::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mGroupNodes.size())};
            g.mGroupNodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void add_vertex_impl(Shader_ /*tag*/, Tuple &&val, LayoutGraph &g, LayoutGraph::vertex_type &vert) { // NOLINT
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.mHandle = impl::ValueHandle<Shader_, LayoutGraph::vertex_descriptor>{
                gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mShaderNodes.size())};
            g.mShaderNodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Component2, class Tag, class ValueT>
inline LayoutGraph::vertex_descriptor
add_vertex(Tag tag, Component0&& c0, Component1&& c1, Component2&& c2, ValueT&& val, LayoutGraph& g, LayoutGraph::vertex_descriptor u = LayoutGraph::null_vertex()) { // NOLINT
    auto v = gsl::narrow_cast<LayoutGraph::vertex_descriptor>(g.mVertices.size());

    g.mVertices.emplace_back();
    auto& vert = g.mVertices.back();

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.mName.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.mUpdateFrequencies.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.mLayouts.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    add_vertex_impl(tag, std::forward<ValueT>(val), g, vert);

    // AddressableGraph
    add_path_impl(u, v, g);

    return v;
}

// MutableGraph(Vertex)
template <class Tag>
inline LayoutGraph::vertex_descriptor
add_vertex(LayoutGraph& g, Tag t, std::string&& name, LayoutGraph::vertex_descriptor parentID = LayoutGraph::null_vertex()) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(std::move(name)), // mName
        std::forward_as_tuple(),                // mUpdateFrequencies
        std::forward_as_tuple(),                // mLayouts
        std::forward_as_tuple(),                // PolymorphicType
        g, parentID);
}

template <class Tag>
inline LayoutGraph::vertex_descriptor
add_vertex(LayoutGraph& g, Tag t, const char* name, LayoutGraph::vertex_descriptor parentID = LayoutGraph::null_vertex()) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(name), // mName
        std::forward_as_tuple(),     // mUpdateFrequencies
        std::forward_as_tuple(),     // mLayouts
        std::forward_as_tuple(),     // PolymorphicType
        g, parentID);
}

} // namespace render

} // namespace cc
