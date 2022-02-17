// clang-format off
#pragma once
#include <boost/utility/string_view.hpp>
#include "cocos/renderer/pipeline/custom/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/RenderExecutorTypes.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

// IncidenceGraph
inline DeviceResourceGraph::vertex_descriptor
source(const DeviceResourceGraph::edge_descriptor& e, const DeviceResourceGraph& /*g*/) noexcept {
    return e.m_source;
}

inline DeviceResourceGraph::vertex_descriptor
target(const DeviceResourceGraph::edge_descriptor& e, const DeviceResourceGraph& /*g*/) noexcept {
    return e.m_target;
}

inline std::pair<DeviceResourceGraph::out_edge_iterator, DeviceResourceGraph::out_edge_iterator>
out_edges(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        DeviceResourceGraph::out_edge_iterator(const_cast<DeviceResourceGraph&>(g).out_edge_list(u).begin(), u),
        DeviceResourceGraph::out_edge_iterator(const_cast<DeviceResourceGraph&>(g).out_edge_list(u).end(), u));
}

inline DeviceResourceGraph::degree_size_type
out_degree(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::degree_size_type>(g.out_edge_list(u).size());
}

inline std::pair<DeviceResourceGraph::edge_descriptor, bool>
edge(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept {
    const auto& outEdgeList = g.out_edge_list(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), DeviceResourceGraph::out_edge_type(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {DeviceResourceGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<DeviceResourceGraph::in_edge_iterator, DeviceResourceGraph::in_edge_iterator>
in_edges(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        DeviceResourceGraph::in_edge_iterator(const_cast<DeviceResourceGraph&>(g).in_edge_list(u).begin(), u),
        DeviceResourceGraph::in_edge_iterator(const_cast<DeviceResourceGraph&>(g).in_edge_list(u).end(), u));
}

inline DeviceResourceGraph::degree_size_type
in_degree(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::degree_size_type>(g.in_edge_list(u).size());
}

inline DeviceResourceGraph::degree_size_type
degree(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<DeviceResourceGraph::adjacency_iterator, DeviceResourceGraph::adjacency_iterator>
adjacent_vertices(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(DeviceResourceGraph::adjacency_iterator(edges.first, &g), DeviceResourceGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<DeviceResourceGraph::vertex_iterator, DeviceResourceGraph::vertex_iterator>
vertices(const DeviceResourceGraph& g) noexcept {
    return std::make_pair(const_cast<DeviceResourceGraph&>(g).vertex_set().begin(), const_cast<DeviceResourceGraph&>(g).vertex_set().end());
}

inline DeviceResourceGraph::vertices_size_type
num_vertices(const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::vertices_size_type>(g.vertex_set().size());
}

// EdgeListGraph
inline std::pair<DeviceResourceGraph::edge_iterator, DeviceResourceGraph::edge_iterator>
edges(const DeviceResourceGraph& g0) noexcept {
    auto& g = const_cast<DeviceResourceGraph&>(g0);
    return std::make_pair(
        DeviceResourceGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().begin(), g.vertex_set().end(), g),
        DeviceResourceGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().end(), g.vertex_set().end(), g));
}

inline DeviceResourceGraph::edges_size_type
num_edges(const DeviceResourceGraph& g) noexcept { // NOLINT
    DeviceResourceGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<DeviceResourceGraph::edge_descriptor, bool>
add_edge( // NOLINT
    DeviceResourceGraph::vertex_descriptor u,
    DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(DeviceResourceGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void remove_edge(DeviceResourceGraph::edge_descriptor e, DeviceResourceGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.out_edge_list(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(DeviceResourceGraph::out_edge_iterator iter, DeviceResourceGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.out_edge_list(source(e, g));
    auto& inEdgeList  = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(DeviceResourceGraph::vertex_descriptor u, Predicate&& pred, DeviceResourceGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(DeviceResourceGraph::vertex_descriptor v, Predicate&& pred, DeviceResourceGraph& g) noexcept { // NOLINT
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
inline void remove_edge_if(Predicate&& pred, DeviceResourceGraph& g) noexcept { // NOLINT
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

// MutableGraph(Vertex)
inline void clear_out_edges(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const DeviceResourceGraph::vertex_handle_type& h, DeviceResourceGraph& g) noexcept { // NOLINT
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    cc::visit(
        overload(
            [&](const impl::ValueHandle<Buffer_, vertex_descriptor>& h) {
                g.mBuffers.erase(g.mBuffers.begin() + std::ptrdiff_t(h.mValue));
                if (h.mValue == g.mBuffers.size()) {
                    return;
                }
                impl::reindexVectorHandle<Buffer_>(g.mVertices, h.mValue);
            },
            [&](const impl::ValueHandle<Texture_, vertex_descriptor>& h) {
                g.mTextures.erase(g.mTextures.begin() + std::ptrdiff_t(h.mValue));
                if (h.mValue == g.mTextures.size()) {
                    return;
                }
                impl::reindexVectorHandle<Texture_>(g.mVertices, h.mValue);
            }),
        h);
}

inline void remove_vertex(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g.mVertices[u];
    remove_vertex_value_impl(vert.mHandle, g);
    impl::removeVectorVertex(const_cast<DeviceResourceGraph&>(g), u, DeviceResourceGraph::directed_category{});

    // remove components
    g.mName.erase(g.mName.begin() + std::ptrdiff_t(u));
    g.mRefCounts.erase(g.mRefCounts.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void add_vertex_impl( // NOLINT
    ValueT &&val, DeviceResourceGraph &g, DeviceResourceGraph::vertex_type &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, std::unique_ptr<gfx::Buffer>>::value>* dummy = nullptr) { // NOLINT
    vert.mHandle = impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mBuffers.size())};
    g.mBuffers.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void add_vertex_impl( // NOLINT
    ValueT &&val, DeviceResourceGraph &g, DeviceResourceGraph::vertex_type &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, std::unique_ptr<gfx::Texture>>::value>* dummy = nullptr) { // NOLINT
    vert.mHandle = impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mTextures.size())};
    g.mTextures.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class ValueT>
inline DeviceResourceGraph::vertex_descriptor
add_vertex(Component0&& c0, Component1&& c1, ValueT&& val, DeviceResourceGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mVertices.size());

    g.mVertices.emplace_back();
    auto& vert = g.mVertices.back();
    g.mName.emplace_back(std::forward<Component0>(c0));
    g.mRefCounts.emplace_back(std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    add_vertex_impl(std::forward<ValueT>(val), g, vert);

    return v;
}

template <class Tuple>
void add_vertex_impl(Buffer_ /*tag*/, Tuple &&val, DeviceResourceGraph &g, DeviceResourceGraph::vertex_type &vert) { // NOLINT
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.mHandle = impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mBuffers.size())};
            g.mBuffers.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void add_vertex_impl(Texture_ /*tag*/, Tuple &&val, DeviceResourceGraph &g, DeviceResourceGraph::vertex_type &vert) { // NOLINT
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.mHandle = impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mTextures.size())};
            g.mTextures.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Tag, class ValueT>
inline DeviceResourceGraph::vertex_descriptor
add_vertex(Tag tag, Component0&& c0, Component1&& c1, ValueT&& val, DeviceResourceGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.mVertices.size());

    g.mVertices.emplace_back();
    auto& vert = g.mVertices.back();

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.mName.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.mRefCounts.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    add_vertex_impl(tag, std::forward<ValueT>(val), g, vert);

    return v;
}

} // namespace render

} // namespace cc

namespace boost {

// Vertex Index
template <>
struct property_map<cc::render::DeviceResourceGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::DeviceResourceGraph, cc::render::DeviceResourceGraph::name_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::DeviceResourceGraph,
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::DeviceResourceGraph,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Name
template <>
struct property_map<cc::render::DeviceResourceGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::DeviceResourceGraph,
        const container::pmr::vector<std::string>,
        boost::string_view,
        const std::string&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::DeviceResourceGraph,
        container::pmr::vector<std::string>,
        boost::string_view,
        std::string&>;
};

// Vertex Component
template <>
struct property_map<cc::render::DeviceResourceGraph, cc::render::DeviceResourceGraph::refCount_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::DeviceResourceGraph,
        const container::pmr::vector<int32_t>,
        int32_t,
        const int32_t&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::DeviceResourceGraph,
        container::pmr::vector<int32_t>,
        int32_t,
        int32_t&>;
};

} // namespace boost

namespace cc {

namespace render {

// Vertex Index
inline boost::property_map<DeviceResourceGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const DeviceResourceGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<DeviceResourceGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, DeviceResourceGraph& /*g*/) noexcept {
    return {};
}

[[nodiscard]] inline impl::ColorMap<DeviceResourceGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const DeviceResourceGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::name_>::const_type
get(DeviceResourceGraph::name_ /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.mName};
}

inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::name_>::type
get(DeviceResourceGraph::name_ /*tag*/, DeviceResourceGraph& g) noexcept {
    return {g.mName};
}

// Vertex Name
inline boost::property_map<DeviceResourceGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.mName};
}

// Vertex Component
inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::refCount_>::const_type
get(DeviceResourceGraph::refCount_ /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.mRefCounts};
}

inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::refCount_>::type
get(DeviceResourceGraph::refCount_ /*tag*/, DeviceResourceGraph& g) noexcept {
    return {g.mRefCounts};
}

// PolymorphicGraph
[[nodiscard]] inline DeviceResourceGraph::vertices_size_type
value_id(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Buffer_, vertex_descriptor>& h) {
                return h.mValue;
            },
            [](const impl::ValueHandle<Texture_, vertex_descriptor>& h) {
                return h.mValue;
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline DeviceResourceGraph::vertex_tag_type
tag(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Buffer_, vertex_descriptor>&) {
                return DeviceResourceGraph::vertex_tag_type{Buffer_{}};
            },
            [](const impl::ValueHandle<Texture_, vertex_descriptor>&) {
                return DeviceResourceGraph::vertex_tag_type{Texture_{}};
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline DeviceResourceGraph::vertex_value_type
value(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Buffer_, vertex_descriptor>& h) {
                return DeviceResourceGraph::vertex_value_type{&g.mBuffers[h.mValue]};
            },
            [&](const impl::ValueHandle<Texture_, vertex_descriptor>& h) {
                return DeviceResourceGraph::vertex_value_type{&g.mTextures[h.mValue]};
            }),
        g.mVertices[u].mHandle);
}

[[nodiscard]] inline DeviceResourceGraph::vertex_const_value_type
value(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Buffer_, vertex_descriptor>& h) {
                return DeviceResourceGraph::vertex_const_value_type{&g.mBuffers[h.mValue]};
            },
            [&](const impl::ValueHandle<Texture_, vertex_descriptor>& h) {
                return DeviceResourceGraph::vertex_const_value_type{&g.mTextures[h.mValue]};
            }),
        g.mVertices[u].mHandle);
}

template <class Tag>
[[nodiscard]] inline bool
holds_tag(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_tag<Buffer_>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Texture_>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <class ValueT>
[[nodiscard]] inline bool
holds_alternative(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_alternative<std::unique_ptr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<std::unique_ptr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
}

template <class ValueT>
[[nodiscard]] inline ValueT&
get(DeviceResourceGraph::vertex_descriptor /*v*/, DeviceResourceGraph& /*g*/);

template <>
[[nodiscard]] inline std::unique_ptr<gfx::Buffer>&
get<std::unique_ptr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mBuffers[handle.mValue];
}

template <>
[[nodiscard]] inline std::unique_ptr<gfx::Texture>&
get<std::unique_ptr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mTextures[handle.mValue];
}

template <class ValueT>
[[nodiscard]] inline const ValueT&
get(DeviceResourceGraph::vertex_descriptor /*v*/, const DeviceResourceGraph& /*g*/);

template <>
[[nodiscard]] inline const std::unique_ptr<gfx::Buffer>&
get<std::unique_ptr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mBuffers[handle.mValue];
}

template <>
[[nodiscard]] inline const std::unique_ptr<gfx::Texture>&
get<std::unique_ptr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mTextures[handle.mValue];
}

[[nodiscard]] inline std::unique_ptr<gfx::Buffer>&
get(Buffer_ /*tag*/, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mBuffers[handle.mValue];
}

[[nodiscard]] inline std::unique_ptr<gfx::Texture>&
get(Texture_ /*tag*/, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mTextures[handle.mValue];
}

[[nodiscard]] inline const std::unique_ptr<gfx::Buffer>&
get(Buffer_ /*tag*/, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mBuffers[handle.mValue];
}

[[nodiscard]] inline const std::unique_ptr<gfx::Texture>&
get(Texture_ /*tag*/, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        g.mVertices[v].mHandle);
    return g.mTextures[handle.mValue];
}

template <class ValueT>
[[nodiscard]] inline ValueT*
get_if(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline std::unique_ptr<gfx::Buffer>*
get_if<std::unique_ptr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept { // NOLINT
    std::unique_ptr<gfx::Buffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mBuffers[pHandle->mValue];
    }
    return ptr;
}

template <>
[[nodiscard]] inline std::unique_ptr<gfx::Texture>*
get_if<std::unique_ptr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept { // NOLINT
    std::unique_ptr<gfx::Texture>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mTextures[pHandle->mValue];
    }
    return ptr;
}

template <class ValueT>
[[nodiscard]] inline const ValueT*
get_if(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline const std::unique_ptr<gfx::Buffer>*
get_if<std::unique_ptr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept { // NOLINT
    const std::unique_ptr<gfx::Buffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Buffer_, DeviceResourceGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mBuffers[pHandle->mValue];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const std::unique_ptr<gfx::Texture>*
get_if<std::unique_ptr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept { // NOLINT
    const std::unique_ptr<gfx::Texture>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Texture_, DeviceResourceGraph::vertex_descriptor>>(
        &g.mVertices[v].mHandle);
    if (pHandle) {
        ptr = &g.mTextures[pHandle->mValue];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const DeviceResourceGraph& g, DeviceResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, DeviceResourceGraph& g, DeviceResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, DeviceResourceGraph& g,
    DeviceResourceGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// MutableGraph(Vertex)
template <class Tag>
inline DeviceResourceGraph::vertex_descriptor
add_vertex(DeviceResourceGraph& g, Tag t, std::string&& name) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(std::move(name)), // mName
        std::forward_as_tuple(),                // mRefCounts
        std::forward_as_tuple(),                // PolymorphicType
        g);
}

template <class Tag>
inline DeviceResourceGraph::vertex_descriptor
add_vertex(DeviceResourceGraph& g, Tag t, const char* name) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(name), // mName
        std::forward_as_tuple(),     // mRefCounts
        std::forward_as_tuple(),     // PolymorphicType
        g);
}

} // namespace render

} // namespace cc
