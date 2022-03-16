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
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/RenderExecutorTypes.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

// IncidenceGraph
inline DeviceResourceGraph::vertex_descriptor
source(const DeviceResourceGraph::edge_descriptor& e, const DeviceResourceGraph& /*g*/) noexcept {
    return e.source;
}

inline DeviceResourceGraph::vertex_descriptor
target(const DeviceResourceGraph::edge_descriptor& e, const DeviceResourceGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<DeviceResourceGraph::out_edge_iterator, DeviceResourceGraph::out_edge_iterator>
out_edges(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        DeviceResourceGraph::out_edge_iterator(const_cast<DeviceResourceGraph&>(g).getOutEdgeList(u).begin(), u),
        DeviceResourceGraph::out_edge_iterator(const_cast<DeviceResourceGraph&>(g).getOutEdgeList(u).end(), u));
}

inline DeviceResourceGraph::degree_size_type
out_degree(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::degree_size_type>(g.getOutEdgeList(u).size());
}

inline std::pair<DeviceResourceGraph::edge_descriptor, bool>
edge(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept {
    const auto& outEdgeList = g.getOutEdgeList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), DeviceResourceGraph::OutEdge(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {DeviceResourceGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<DeviceResourceGraph::in_edge_iterator, DeviceResourceGraph::in_edge_iterator>
in_edges(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return std::make_pair(
        DeviceResourceGraph::in_edge_iterator(const_cast<DeviceResourceGraph&>(g).getInEdgeList(u).begin(), u),
        DeviceResourceGraph::in_edge_iterator(const_cast<DeviceResourceGraph&>(g).getInEdgeList(u).end(), u));
}

inline DeviceResourceGraph::degree_size_type
in_degree(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::degree_size_type>(g.getInEdgeList(u).size());
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
    return std::make_pair(const_cast<DeviceResourceGraph&>(g).getVertexList().begin(), const_cast<DeviceResourceGraph&>(g).getVertexList().end());
}

inline DeviceResourceGraph::vertices_size_type
num_vertices(const DeviceResourceGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<DeviceResourceGraph::vertices_size_type>(g.getVertexList().size());
}

// EdgeListGraph
inline std::pair<DeviceResourceGraph::edge_iterator, DeviceResourceGraph::edge_iterator>
edges(const DeviceResourceGraph& g0) noexcept {
    auto& g = const_cast<DeviceResourceGraph&>(g0);
    return std::make_pair(
        DeviceResourceGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        DeviceResourceGraph::edge_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
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
    auto& outEdgeList = g.getOutEdgeList(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.getInEdgeList(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(DeviceResourceGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void remove_edge(DeviceResourceGraph::edge_descriptor e, DeviceResourceGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(DeviceResourceGraph::out_edge_iterator iter, DeviceResourceGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    auto& inEdgeList  = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(DeviceResourceGraph::vertex_descriptor u, Predicate&& pred, DeviceResourceGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(DeviceResourceGraph::vertex_descriptor v, Predicate&& pred, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex_value_impl(const DeviceResourceGraph::VertexHandle& h, DeviceResourceGraph& g) noexcept { // NOLINT
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    cc::visit(
        overload(
            [&](const impl::ValueHandle<BufferTag, vertex_descriptor>& h) {
                g.buffers.erase(g.buffers.begin() + std::ptrdiff_t(h.value));
                if (h.value == g.buffers.size()) {
                    return;
                }
                impl::reindexVectorHandle<BufferTag>(g.vertices, h.value);
            },
            [&](const impl::ValueHandle<TextureTag, vertex_descriptor>& h) {
                g.textures.erase(g.textures.begin() + std::ptrdiff_t(h.value));
                if (h.value == g.textures.size()) {
                    return;
                }
                impl::reindexVectorHandle<TextureTag>(g.vertices, h.value);
            }),
        h);
}

inline void remove_vertex(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept { // NOLINT
    // preserve vertex' iterators
    auto& vert = g.vertices[u];
    remove_vertex_value_impl(vert.handle, g);
    impl::removeVectorVertex(const_cast<DeviceResourceGraph&>(g), u, DeviceResourceGraph::directed_category{});

    // remove components
    g.names.erase(g.names.begin() + std::ptrdiff_t(u));
    g.refCounts.erase(g.refCounts.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, DeviceResourceGraph &g, DeviceResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, IntrusivePtr<gfx::Buffer>>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.buffers.size())};
    g.buffers.emplace_back(std::forward<ValueT>(val));
}

template <class ValueT>
void addVertexImpl( // NOLINT
    ValueT &&val, DeviceResourceGraph &g, DeviceResourceGraph::Vertex &vert, // NOLINT
    std::enable_if_t<std::is_same<std::decay_t<ValueT>, IntrusivePtr<gfx::Texture>>::value>* dummy = nullptr) { // NOLINT
    vert.handle = impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>{
        gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.textures.size())};
    g.textures.emplace_back(std::forward<ValueT>(val));
}

template <class Component0, class Component1, class ValueT>
inline DeviceResourceGraph::vertex_descriptor
addVertex(Component0&& c0, Component1&& c1, ValueT&& val, DeviceResourceGraph& g) {
    auto v = gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();
    auto& vert = g.vertices.back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.refCounts.emplace_back(std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(std::forward<ValueT>(val), g, vert);

    return v;
}

template <class Tuple>
void addVertexImpl(BufferTag /*tag*/, Tuple &&val, DeviceResourceGraph &g, DeviceResourceGraph::Vertex &vert) {
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.buffers.size())};
            g.buffers.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Tuple>
void addVertexImpl(TextureTag /*tag*/, Tuple &&val, DeviceResourceGraph &g, DeviceResourceGraph::Vertex &vert) {
    invoke_hpp::apply(
        [&](auto&&... args) {
            vert.handle = impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>{
                gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.textures.size())};
            g.textures.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Tuple>(val));
}

template <class Component0, class Component1, class Tag, class ValueT>
inline DeviceResourceGraph::vertex_descriptor
addVertex(Tag tag, Component0&& c0, Component1&& c1, ValueT&& val, DeviceResourceGraph& g) {
    auto v = gsl::narrow_cast<DeviceResourceGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();
    auto& vert = g.vertices.back();

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.refCounts.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    // PolymorphicGraph
    // if no matching overloaded function is found, Type is not supported by PolymorphicGraph
    addVertexImpl(tag, std::forward<ValueT>(val), g, vert);

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
struct property_map<cc::render::DeviceResourceGraph, cc::render::DeviceResourceGraph::NameTag> {
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
struct property_map<cc::render::DeviceResourceGraph, cc::render::DeviceResourceGraph::RefCountTag> {
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

inline impl::ColorMap<DeviceResourceGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const DeviceResourceGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::NameTag>::const_type
get(DeviceResourceGraph::NameTag /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::NameTag>::type
get(DeviceResourceGraph::NameTag /*tag*/, DeviceResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<DeviceResourceGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::RefCountTag>::const_type
get(DeviceResourceGraph::RefCountTag /*tag*/, const DeviceResourceGraph& g) noexcept {
    return {g.refCounts};
}

inline typename boost::property_map<DeviceResourceGraph, DeviceResourceGraph::RefCountTag>::type
get(DeviceResourceGraph::RefCountTag /*tag*/, DeviceResourceGraph& g) noexcept {
    return {g.refCounts};
}

// PolymorphicGraph
inline DeviceResourceGraph::vertices_size_type
id(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<BufferTag, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<TextureTag, vertex_descriptor>& h) {
                return h.value;
            }),
        g.vertices[u].handle);
}

inline DeviceResourceGraph::VertexTag
tag(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<BufferTag, vertex_descriptor>&) {
                return DeviceResourceGraph::VertexTag{BufferTag{}};
            },
            [](const impl::ValueHandle<TextureTag, vertex_descriptor>&) {
                return DeviceResourceGraph::VertexTag{TextureTag{}};
            }),
        g.vertices[u].handle);
}

inline DeviceResourceGraph::VertexValue
value(DeviceResourceGraph::vertex_descriptor u, DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<BufferTag, vertex_descriptor>& h) {
                return DeviceResourceGraph::VertexValue{&g.buffers[h.value]};
            },
            [&](const impl::ValueHandle<TextureTag, vertex_descriptor>& h) {
                return DeviceResourceGraph::VertexValue{&g.textures[h.value]};
            }),
        g.vertices[u].handle);
}

inline DeviceResourceGraph::VertexConstValue
value(DeviceResourceGraph::vertex_descriptor u, const DeviceResourceGraph& g) noexcept {
    using vertex_descriptor = DeviceResourceGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<BufferTag, vertex_descriptor>& h) {
                return DeviceResourceGraph::VertexConstValue{&g.buffers[h.value]};
            },
            [&](const impl::ValueHandle<TextureTag, vertex_descriptor>& h) {
                return DeviceResourceGraph::VertexConstValue{&g.textures[h.value]};
            }),
        g.vertices[u].handle);
}

template <class Tag>
inline bool
holds(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept;

template <>
inline bool
holds<BufferTag>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept {
    return boost::variant2::holds_alternative<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
inline bool
holds<TextureTag>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept {
    return boost::variant2::holds_alternative<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
inline bool
holds_alternative(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept; // NOLINT

template <>
inline bool
holds_alternative<IntrusivePtr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
inline bool
holds_alternative<IntrusivePtr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
inline ValueT&
get(DeviceResourceGraph::vertex_descriptor /*v*/, DeviceResourceGraph& /*g*/);

template <>
inline IntrusivePtr<gfx::Buffer>&
get<IntrusivePtr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.buffers[handle.value];
}

template <>
inline IntrusivePtr<gfx::Texture>&
get<IntrusivePtr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.textures[handle.value];
}

template <class ValueT>
inline const ValueT&
get(DeviceResourceGraph::vertex_descriptor /*v*/, const DeviceResourceGraph& /*g*/);

template <>
inline const IntrusivePtr<gfx::Buffer>&
get<IntrusivePtr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.buffers[handle.value];
}

template <>
inline const IntrusivePtr<gfx::Texture>&
get<IntrusivePtr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.textures[handle.value];
}

inline IntrusivePtr<gfx::Buffer>&
get(BufferTag /*tag*/, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.buffers[handle.value];
}

inline IntrusivePtr<gfx::Texture>&
get(TextureTag /*tag*/, DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.textures[handle.value];
}

inline const IntrusivePtr<gfx::Buffer>&
get(BufferTag /*tag*/, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.buffers[handle.value];
}

inline const IntrusivePtr<gfx::Texture>&
get(TextureTag /*tag*/, DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.textures[handle.value];
}

template <class ValueT>
inline ValueT*
get_if(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept; // NOLINT

template <>
inline IntrusivePtr<gfx::Buffer>*
get_if<IntrusivePtr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept { // NOLINT
    IntrusivePtr<gfx::Buffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.buffers[pHandle->value];
    }
    return ptr;
}

template <>
inline IntrusivePtr<gfx::Texture>*
get_if<IntrusivePtr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, DeviceResourceGraph* pGraph) noexcept { // NOLINT
    IntrusivePtr<gfx::Texture>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.textures[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
inline const ValueT*
get_if(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept; // NOLINT

template <>
inline const IntrusivePtr<gfx::Buffer>*
get_if<IntrusivePtr<gfx::Buffer>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept { // NOLINT
    const IntrusivePtr<gfx::Buffer>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<BufferTag, DeviceResourceGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.buffers[pHandle->value];
    }
    return ptr;
}

template <>
inline const IntrusivePtr<gfx::Texture>*
get_if<IntrusivePtr<gfx::Texture>>(DeviceResourceGraph::vertex_descriptor v, const DeviceResourceGraph* pGraph) noexcept { // NOLINT
    const IntrusivePtr<gfx::Texture>* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<TextureTag, DeviceResourceGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.textures[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
inline decltype(auto)
get(Tag tag, const DeviceResourceGraph& g, DeviceResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
inline decltype(auto)
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
    return addVertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // refCounts
        std::forward_as_tuple(),                // PolymorphicType
        g);
}

template <class Tag>
inline DeviceResourceGraph::vertex_descriptor
add_vertex(DeviceResourceGraph& g, Tag t, const char* name) { // NOLINT
    return addVertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // refCounts
        std::forward_as_tuple(),     // PolymorphicType
        g);
}

} // namespace render

} // namespace cc

// clang-format on
