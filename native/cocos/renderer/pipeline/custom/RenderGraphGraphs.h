// clang-format off
#pragma once
#include <boost/utility/string_view.hpp>
#include "cocos/renderer/pipeline/custom/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/RenderGraphTypes.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

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
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), ResourceGraph::out_edge_type(v));
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

inline void remove_edge(ResourceGraph::edge_descriptor e, ResourceGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(ResourceGraph::out_edge_iterator iter, ResourceGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    auto& inEdgeList  = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(ResourceGraph::vertex_descriptor u, Predicate&& pred, ResourceGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(ResourceGraph::vertex_descriptor v, Predicate&& pred, ResourceGraph& g) noexcept { // NOLINT
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
inline void remove_edge_if(Predicate&& pred, ResourceGraph& g) noexcept { // NOLINT
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

inline void remove_vertex(ResourceGraph::vertex_descriptor u, ResourceGraph& g) noexcept { // NOLINT
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
    g.names.erase(g.names.begin() + std::ptrdiff_t(u));
    g.descs.erase(g.descs.begin() + std::ptrdiff_t(u));
    g.traits.erase(g.traits.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class Component0, class Component1, class Component2>
inline ResourceGraph::vertex_descriptor
add_vertex(Component0&& c0, Component1&& c1, Component2&& c2, ResourceGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        const auto& uuid = c0;
        auto res = g.valueIndex.emplace(uuid, v);
        CC_ENSURES(res.second);
    }
    g.names.emplace_back(std::forward<Component0>(c0));
    g.descs.emplace_back(std::forward<Component1>(c1));
    g.traits.emplace_back(std::forward<Component2>(c2));

    return v;
}

template <class Component0, class Component1, class Component2>
inline ResourceGraph::vertex_descriptor
add_vertex(std::piecewise_construct_t, Component0&& c0, Component1&& c1, Component2&& c2, ResourceGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<ResourceGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        invoke_hpp::apply(
            [&](const auto&... args) {
                auto res = g.valueIndex.emplace(std::piecewise_construct, std::forward_as_tuple(args...), std::forward_as_tuple(v));
                CC_ENSURES(res.second);
            },
            c0);
    }

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.descs.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.traits.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    return v;
}

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
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), SubpassGraph::out_edge_type(v));
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

inline void remove_edge(SubpassGraph::edge_descriptor e, SubpassGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(SubpassGraph::out_edge_iterator iter, SubpassGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    auto& inEdgeList  = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(SubpassGraph::vertex_descriptor u, Predicate&& pred, SubpassGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(SubpassGraph::vertex_descriptor v, Predicate&& pred, SubpassGraph& g) noexcept { // NOLINT
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
inline void remove_edge_if(Predicate&& pred, SubpassGraph& g) noexcept { // NOLINT
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
    g.names.erase(g.names.begin() + std::ptrdiff_t(u));
    g.subpasses.erase(g.subpasses.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class Component0, class Component1>
inline SubpassGraph::vertex_descriptor
add_vertex(Component0&& c0, Component1&& c1, SubpassGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<SubpassGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();
    g.names.emplace_back(std::forward<Component0>(c0));
    g.subpasses.emplace_back(std::forward<Component1>(c1));

    return v;
}

template <class Component0, class Component1>
inline SubpassGraph::vertex_descriptor
add_vertex(std::piecewise_construct_t, Component0&& c0, Component1&& c1, SubpassGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<SubpassGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.names.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.subpasses.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    return v;
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
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderGraph::out_edge_type(v));
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

inline void remove_edge(RenderGraph::edge_descriptor e, RenderGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(RenderGraph::out_edge_iterator iter, RenderGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.getOutEdgeList(source(e, g));
    auto& inEdgeList  = g.getInEdgeList(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(RenderGraph::vertex_descriptor u, Predicate&& pred, RenderGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(RenderGraph::vertex_descriptor v, Predicate&& pred, RenderGraph& g) noexcept { // NOLINT
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
inline void remove_edge_if(Predicate&& pred, RenderGraph& g) noexcept { // NOLINT
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
num_children(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderGraph::children_size_type>(g.getChildrenList(u).size());
}

inline std::pair<RenderGraph::ownership_descriptor, bool>
ownership(RenderGraph::vertex_descriptor u, RenderGraph::vertex_descriptor v, RenderGraph& g) noexcept {
    auto& outEdgeList = g.getChildrenList(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderGraph::out_edge_type(v));
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
num_parents(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
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
ownerships(const RenderGraph& g0) noexcept {
    auto& g = const_cast<RenderGraph&>(g0);
    return std::make_pair(
        RenderGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().begin(), g.getVertexList().end(), g),
        RenderGraph::ownership_iterator(g.getVertexList().begin(), g.getVertexList().end(), g.getVertexList().end(), g));
}

inline RenderGraph::ownerships_size_type
num_ownerships(const RenderGraph& g) noexcept { // NOLINT
    RenderGraph::ownerships_size_type numEdges = 0;
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
struct property_map<cc::render::ResourceGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::Name_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Name
template <>
struct property_map<cc::render::ResourceGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::Desc_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::render::ResourceDesc>,
        cc::render::ResourceDesc,
        const cc::render::ResourceDesc&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::render::ResourceDesc>,
        cc::render::ResourceDesc,
        cc::render::ResourceDesc&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceGraph, T cc::render::ResourceDesc::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::render::ResourceDesc>,
        T,
        const T&,
        T cc::render::ResourceDesc::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::render::ResourceDesc>,
        T,
        T&,
        T cc::render::ResourceDesc::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::ResourceGraph, cc::render::ResourceGraph::Traits_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::render::ResourceTraits>,
        cc::render::ResourceTraits,
        const cc::render::ResourceTraits&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::render::ResourceTraits>,
        cc::render::ResourceTraits,
        cc::render::ResourceTraits&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::ResourceGraph, T cc::render::ResourceTraits::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::ResourceGraph,
        const container::pmr::vector<cc::render::ResourceTraits>,
        T,
        const T&,
        T cc::render::ResourceTraits::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::ResourceGraph,
        container::pmr::vector<cc::render::ResourceTraits>,
        T,
        T&,
        T cc::render::ResourceTraits::*>;
};

// Vertex Index
template <>
struct property_map<cc::render::SubpassGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::SubpassGraph, cc::render::SubpassGraph::Name_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::SubpassGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::SubpassGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Name
template <>
struct property_map<cc::render::SubpassGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::SubpassGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::SubpassGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Component
template <>
struct property_map<cc::render::SubpassGraph, cc::render::SubpassGraph::Subpass_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::SubpassGraph,
        const container::pmr::vector<cc::render::RasterSubpass>,
        cc::render::RasterSubpass,
        const cc::render::RasterSubpass&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::SubpassGraph,
        container::pmr::vector<cc::render::RasterSubpass>,
        cc::render::RasterSubpass,
        cc::render::RasterSubpass&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::SubpassGraph, T cc::render::RasterSubpass::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::SubpassGraph,
        const container::pmr::vector<cc::render::RasterSubpass>,
        T,
        const T&,
        T cc::render::RasterSubpass::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::SubpassGraph,
        container::pmr::vector<cc::render::RasterSubpass>,
        T,
        T&,
        T cc::render::RasterSubpass::*>;
};

// Vertex Index
template <>
struct property_map<cc::render::RenderGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::Name_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Name
template <>
struct property_map<cc::render::RenderGraph, vertex_name_t> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::Layout_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        const cc::render::RenderGraph,
        const container::pmr::vector<cc::PmrString>,
        boost::string_view,
        const cc::PmrString&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        read_write_property_map_tag,
        cc::render::RenderGraph,
        container::pmr::vector<cc::PmrString>,
        boost::string_view,
        cc::PmrString&>;
};

// Vertex Component
template <>
struct property_map<cc::render::RenderGraph, cc::render::RenderGraph::Data_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::RenderGraph,
        const container::pmr::vector<cc::render::RenderData>,
        cc::render::RenderData,
        const cc::render::RenderData&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::RenderGraph,
        container::pmr::vector<cc::render::RenderData>,
        cc::render::RenderData,
        cc::render::RenderData&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::RenderGraph, T cc::render::RenderData::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::RenderGraph,
        const container::pmr::vector<cc::render::RenderData>,
        T,
        const T&,
        T cc::render::RenderData::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::RenderGraph,
        container::pmr::vector<cc::render::RenderData>,
        T,
        T&,
        T cc::render::RenderData::*>;
};

} // namespace boost

namespace cc {

namespace render {

// Vertex Index
inline boost::property_map<ResourceGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const ResourceGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<ResourceGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, ResourceGraph& /*g*/) noexcept {
    return {};
}

[[nodiscard]] inline impl::ColorMap<ResourceGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const ResourceGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::Name_>::const_type
get(ResourceGraph::Name_ /*tag*/, const ResourceGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::Name_>::type
get(ResourceGraph::Name_ /*tag*/, ResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<ResourceGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const ResourceGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<ResourceGraph, ResourceGraph::Desc_>::const_type
get(ResourceGraph::Desc_ /*tag*/, const ResourceGraph& g) noexcept {
    return {g.descs};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::Desc_>::type
get(ResourceGraph::Desc_ /*tag*/, ResourceGraph& g) noexcept {
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
inline typename boost::property_map<ResourceGraph, ResourceGraph::Traits_>::const_type
get(ResourceGraph::Traits_ /*tag*/, const ResourceGraph& g) noexcept {
    return {g.traits};
}

inline typename boost::property_map<ResourceGraph, ResourceGraph::Traits_>::type
get(ResourceGraph::Traits_ /*tag*/, ResourceGraph& g) noexcept {
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

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const ResourceGraph& g, ResourceGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
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
[[nodiscard]] inline ResourceGraph::vertex_descriptor
vertex(const PmrString& key, const ResourceGraph& g) {
    return g.valueIndex.at(key);
}

template <class KeyLike>
[[nodiscard]] inline ResourceGraph::vertex_descriptor
vertex(const KeyLike& key, const ResourceGraph& g) {
    const auto& index = g.valueIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        throw std::out_of_range("at(key, ResourceGraph) out of range");
    }
    return iter->second;
}

template <class KeyLike>
[[nodiscard]] inline ResourceGraph::vertex_descriptor
find_vertex(const KeyLike& key, const ResourceGraph& g) noexcept { // NOLINT
    const auto& index = g.valueIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        return ResourceGraph::null_vertex();
    }
    return iter->second;
}

[[nodiscard]] inline bool
contains(const PmrString& key, const ResourceGraph& g) noexcept {
    auto iter = g.valueIndex.find(key);
    return iter != g.valueIndex.end();
}

template <class KeyLike>
[[nodiscard]] inline bool
contains(const KeyLike& key, const ResourceGraph& g) noexcept {
    auto iter = g.valueIndex.find(key);
    return iter != g.valueIndex.end();
}

// MutableGraph(Vertex)
inline ResourceGraph::vertex_descriptor
add_vertex(ResourceGraph& g, PmrString&& name) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // descs
        std::forward_as_tuple(),                // traits
        g);
}

inline ResourceGraph::vertex_descriptor
add_vertex(ResourceGraph& g, const char* name) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // descs
        std::forward_as_tuple(),     // traits
        g);
}

// Vertex Index
inline boost::property_map<SubpassGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const SubpassGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<SubpassGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, SubpassGraph& /*g*/) noexcept {
    return {};
}

[[nodiscard]] inline impl::ColorMap<SubpassGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const SubpassGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<SubpassGraph, SubpassGraph::Name_>::const_type
get(SubpassGraph::Name_ /*tag*/, const SubpassGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<SubpassGraph, SubpassGraph::Name_>::type
get(SubpassGraph::Name_ /*tag*/, SubpassGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<SubpassGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const SubpassGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<SubpassGraph, SubpassGraph::Subpass_>::const_type
get(SubpassGraph::Subpass_ /*tag*/, const SubpassGraph& g) noexcept {
    return {g.subpasses};
}

inline typename boost::property_map<SubpassGraph, SubpassGraph::Subpass_>::type
get(SubpassGraph::Subpass_ /*tag*/, SubpassGraph& g) noexcept {
    return {g.subpasses};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<SubpassGraph, T RasterSubpass::*>::const_type
get(T RasterSubpass::*memberPointer, const SubpassGraph& g) noexcept {
    return {g.subpasses, memberPointer};
}

template <class T>
inline typename boost::property_map<SubpassGraph, T RasterSubpass::*>::type
get(T RasterSubpass::*memberPointer, SubpassGraph& g) noexcept {
    return {g.subpasses, memberPointer};
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const SubpassGraph& g, SubpassGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
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
add_vertex(SubpassGraph& g, PmrString&& name) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // subpasses
        g);
}

inline SubpassGraph::vertex_descriptor
add_vertex(SubpassGraph& g, const char* name) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // subpasses
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

[[nodiscard]] inline impl::ColorMap<RenderGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const RenderGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::Name_>::const_type
get(RenderGraph::Name_ /*tag*/, const RenderGraph& g) noexcept {
    return {g.names};
}

inline typename boost::property_map<RenderGraph, RenderGraph::Name_>::type
get(RenderGraph::Name_ /*tag*/, RenderGraph& g) noexcept {
    return {g.names};
}

// Vertex Name
inline boost::property_map<RenderGraph, boost::vertex_name_t>::const_type
get(boost::vertex_name_t /*tag*/, const RenderGraph& g) noexcept {
    return {g.names};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::Layout_>::const_type
get(RenderGraph::Layout_ /*tag*/, const RenderGraph& g) noexcept {
    return {g.layoutNodes};
}

inline typename boost::property_map<RenderGraph, RenderGraph::Layout_>::type
get(RenderGraph::Layout_ /*tag*/, RenderGraph& g) noexcept {
    return {g.layoutNodes};
}

// Vertex Component
inline typename boost::property_map<RenderGraph, RenderGraph::Data_>::const_type
get(RenderGraph::Data_ /*tag*/, const RenderGraph& g) noexcept {
    return {g.data};
}

inline typename boost::property_map<RenderGraph, RenderGraph::Data_>::type
get(RenderGraph::Data_ /*tag*/, RenderGraph& g) noexcept {
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

// PolymorphicGraph
[[nodiscard]] inline RenderGraph::vertices_size_type
value_id(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept { // NOLINT
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Raster_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Compute_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Copy_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Move_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Present_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Raytrace_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Queue_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Scene_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Blit_, vertex_descriptor>& h) {
                return h.value;
            },
            [](const impl::ValueHandle<Dispatch_, vertex_descriptor>& h) {
                return h.value;
            }),
        g.vertices[u].handle);
}

[[nodiscard]] inline RenderGraph::vertex_tag_type
tag(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [](const impl::ValueHandle<Raster_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Raster_{}};
            },
            [](const impl::ValueHandle<Compute_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Compute_{}};
            },
            [](const impl::ValueHandle<Copy_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Copy_{}};
            },
            [](const impl::ValueHandle<Move_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Move_{}};
            },
            [](const impl::ValueHandle<Present_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Present_{}};
            },
            [](const impl::ValueHandle<Raytrace_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Raytrace_{}};
            },
            [](const impl::ValueHandle<Queue_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Queue_{}};
            },
            [](const impl::ValueHandle<Scene_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Scene_{}};
            },
            [](const impl::ValueHandle<Blit_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Blit_{}};
            },
            [](const impl::ValueHandle<Dispatch_, vertex_descriptor>&) {
                return RenderGraph::vertex_tag_type{Dispatch_{}};
            }),
        g.vertices[u].handle);
}

[[nodiscard]] inline RenderGraph::vertex_value_type
value(RenderGraph::vertex_descriptor u, RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Raster_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.rasterPasses[h.value]};
            },
            [&](const impl::ValueHandle<Compute_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.computePasses[h.value]};
            },
            [&](const impl::ValueHandle<Copy_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.copyPasses[h.value]};
            },
            [&](const impl::ValueHandle<Move_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.movePasses[h.value]};
            },
            [&](const impl::ValueHandle<Present_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.presentPasses[h.value]};
            },
            [&](const impl::ValueHandle<Raytrace_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.raytracePasses[h.value]};
            },
            [&](const impl::ValueHandle<Queue_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.renderQueues[h.value]};
            },
            [&](const impl::ValueHandle<Scene_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.scenes[h.value]};
            },
            [&](const impl::ValueHandle<Blit_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.blits[h.value]};
            },
            [&](const impl::ValueHandle<Dispatch_, vertex_descriptor>& h) {
                return RenderGraph::vertex_value_type{&g.dispatches[h.value]};
            }),
        g.vertices[u].handle);
}

[[nodiscard]] inline RenderGraph::vertex_const_value_type
value(RenderGraph::vertex_descriptor u, const RenderGraph& g) noexcept {
    using vertex_descriptor = RenderGraph::vertex_descriptor;
    return cc::visit(
        overload(
            [&](const impl::ValueHandle<Raster_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.rasterPasses[h.value]};
            },
            [&](const impl::ValueHandle<Compute_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.computePasses[h.value]};
            },
            [&](const impl::ValueHandle<Copy_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.copyPasses[h.value]};
            },
            [&](const impl::ValueHandle<Move_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.movePasses[h.value]};
            },
            [&](const impl::ValueHandle<Present_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.presentPasses[h.value]};
            },
            [&](const impl::ValueHandle<Raytrace_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.raytracePasses[h.value]};
            },
            [&](const impl::ValueHandle<Queue_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.renderQueues[h.value]};
            },
            [&](const impl::ValueHandle<Scene_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.scenes[h.value]};
            },
            [&](const impl::ValueHandle<Blit_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.blits[h.value]};
            },
            [&](const impl::ValueHandle<Dispatch_, vertex_descriptor>& h) {
                return RenderGraph::vertex_const_value_type{&g.dispatches[h.value]};
            }),
        g.vertices[u].handle);
}

template <class Tag>
[[nodiscard]] inline bool
holds_tag(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_tag<Raster_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Compute_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Copy_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Move_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Present_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Raytrace_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Queue_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Scene_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Blit_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_tag<Dispatch_>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
[[nodiscard]] inline bool
holds_alternative(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept; // NOLINT

template <>
[[nodiscard]] inline bool
holds_alternative<RasterPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<ComputePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<CopyPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<MovePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<PresentPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<RaytracePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<RenderQueueData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <>
[[nodiscard]] inline bool
holds_alternative<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph& g) noexcept { // NOLINT
    return boost::variant2::holds_alternative<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
}

template <class ValueT>
[[nodiscard]] inline ValueT&
get(RenderGraph::vertex_descriptor /*v*/, RenderGraph& /*g*/);

template <>
[[nodiscard]] inline RasterPassData&
get<RasterPassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.rasterPasses[handle.value];
}

template <>
[[nodiscard]] inline ComputePassData&
get<ComputePassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.computePasses[handle.value];
}

template <>
[[nodiscard]] inline CopyPassData&
get<CopyPassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.copyPasses[handle.value];
}

template <>
[[nodiscard]] inline MovePassData&
get<MovePassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.movePasses[handle.value];
}

template <>
[[nodiscard]] inline PresentPassData&
get<PresentPassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.presentPasses[handle.value];
}

template <>
[[nodiscard]] inline RaytracePassData&
get<RaytracePassData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.raytracePasses[handle.value];
}

template <>
[[nodiscard]] inline RenderQueueData&
get<RenderQueueData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.renderQueues[handle.value];
}

template <>
[[nodiscard]] inline SceneData&
get<SceneData>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.scenes[handle.value];
}

template <>
[[nodiscard]] inline Blit&
get<Blit>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.blits[handle.value];
}

template <>
[[nodiscard]] inline Dispatch&
get<Dispatch>(RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.dispatches[handle.value];
}

template <class ValueT>
[[nodiscard]] inline const ValueT&
get(RenderGraph::vertex_descriptor /*v*/, const RenderGraph& /*g*/);

template <>
[[nodiscard]] inline const RasterPassData&
get<RasterPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.rasterPasses[handle.value];
}

template <>
[[nodiscard]] inline const ComputePassData&
get<ComputePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.computePasses[handle.value];
}

template <>
[[nodiscard]] inline const CopyPassData&
get<CopyPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.copyPasses[handle.value];
}

template <>
[[nodiscard]] inline const MovePassData&
get<MovePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.movePasses[handle.value];
}

template <>
[[nodiscard]] inline const PresentPassData&
get<PresentPassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.presentPasses[handle.value];
}

template <>
[[nodiscard]] inline const RaytracePassData&
get<RaytracePassData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.raytracePasses[handle.value];
}

template <>
[[nodiscard]] inline const RenderQueueData&
get<RenderQueueData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.renderQueues[handle.value];
}

template <>
[[nodiscard]] inline const SceneData&
get<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.scenes[handle.value];
}

template <>
[[nodiscard]] inline const Blit&
get<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.blits[handle.value];
}

template <>
[[nodiscard]] inline const Dispatch&
get<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.dispatches[handle.value];
}

[[nodiscard]] inline RasterPassData&
get(Raster_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.rasterPasses[handle.value];
}

[[nodiscard]] inline ComputePassData&
get(Compute_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.computePasses[handle.value];
}

[[nodiscard]] inline CopyPassData&
get(Copy_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.copyPasses[handle.value];
}

[[nodiscard]] inline MovePassData&
get(Move_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.movePasses[handle.value];
}

[[nodiscard]] inline PresentPassData&
get(Present_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.presentPasses[handle.value];
}

[[nodiscard]] inline RaytracePassData&
get(Raytrace_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.raytracePasses[handle.value];
}

[[nodiscard]] inline RenderQueueData&
get(Queue_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.renderQueues[handle.value];
}

[[nodiscard]] inline SceneData&
get(Scene_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.scenes[handle.value];
}

[[nodiscard]] inline Blit&
get(Blit_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.blits[handle.value];
}

[[nodiscard]] inline Dispatch&
get(Dispatch_ /*tag*/, RenderGraph::vertex_descriptor v, RenderGraph& g) {
    auto& handle = boost::variant2::get<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.dispatches[handle.value];
}

[[nodiscard]] inline const RasterPassData&
get(Raster_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.rasterPasses[handle.value];
}

[[nodiscard]] inline const ComputePassData&
get(Compute_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.computePasses[handle.value];
}

[[nodiscard]] inline const CopyPassData&
get(Copy_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.copyPasses[handle.value];
}

[[nodiscard]] inline const MovePassData&
get(Move_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.movePasses[handle.value];
}

[[nodiscard]] inline const PresentPassData&
get(Present_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.presentPasses[handle.value];
}

[[nodiscard]] inline const RaytracePassData&
get(Raytrace_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.raytracePasses[handle.value];
}

[[nodiscard]] inline const RenderQueueData&
get(Queue_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.renderQueues[handle.value];
}

[[nodiscard]] inline const SceneData&
get(Scene_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.scenes[handle.value];
}

[[nodiscard]] inline const Blit&
get(Blit_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.blits[handle.value];
}

[[nodiscard]] inline const Dispatch&
get(Dispatch_ /*tag*/, RenderGraph::vertex_descriptor v, const RenderGraph& g) {
    const auto& handle = boost::variant2::get<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        g.vertices[v].handle);
    return g.dispatches[handle.value];
}

template <class ValueT>
[[nodiscard]] inline ValueT*
get_if(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline RasterPassData*
get_if<RasterPassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RasterPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline ComputePassData*
get_if<ComputePassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    ComputePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.computePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline CopyPassData*
get_if<CopyPassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    CopyPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.copyPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline MovePassData*
get_if<MovePassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    MovePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.movePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline PresentPassData*
get_if<PresentPassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    PresentPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.presentPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline RaytracePassData*
get_if<RaytracePassData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RaytracePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.raytracePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline RenderQueueData*
get_if<RenderQueueData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    RenderQueueData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.renderQueues[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline SceneData*
get_if<SceneData>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    SceneData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.scenes[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline Blit*
get_if<Blit>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    Blit* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.blits[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline Dispatch*
get_if<Dispatch>(RenderGraph::vertex_descriptor v, RenderGraph* pGraph) noexcept { // NOLINT
    Dispatch* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    auto& g       = *pGraph;
    auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.dispatches[pHandle->value];
    }
    return ptr;
}

template <class ValueT>
[[nodiscard]] inline const ValueT*
get_if(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept; // NOLINT

template <>
[[nodiscard]] inline const RasterPassData*
get_if<RasterPassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RasterPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Raster_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.rasterPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const ComputePassData*
get_if<ComputePassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const ComputePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Compute_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.computePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const CopyPassData*
get_if<CopyPassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const CopyPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Copy_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.copyPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const MovePassData*
get_if<MovePassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const MovePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Move_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.movePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const PresentPassData*
get_if<PresentPassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const PresentPassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Present_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.presentPasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const RaytracePassData*
get_if<RaytracePassData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RaytracePassData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Raytrace_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.raytracePasses[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const RenderQueueData*
get_if<RenderQueueData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const RenderQueueData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Queue_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.renderQueues[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const SceneData*
get_if<SceneData>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const SceneData* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Scene_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.scenes[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const Blit*
get_if<Blit>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const Blit* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Blit_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.blits[pHandle->value];
    }
    return ptr;
}

template <>
[[nodiscard]] inline const Dispatch*
get_if<Dispatch>(RenderGraph::vertex_descriptor v, const RenderGraph* pGraph) noexcept { // NOLINT
    const Dispatch* ptr = nullptr;
    if (!pGraph) {
        return ptr;
    }
    const auto& g       = *pGraph;
    const auto* pHandle = boost::variant2::get_if<
        impl::ValueHandle<Dispatch_, RenderGraph::vertex_descriptor>>(
        &g.vertices[v].handle);
    if (pHandle) {
        ptr = &g.dispatches[pHandle->value];
    }
    return ptr;
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const RenderGraph& g, RenderGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
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
template <class Tag>
inline RenderGraph::vertex_descriptor
add_vertex(RenderGraph& g, Tag t, PmrString&& name) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(std::move(name)), // names
        std::forward_as_tuple(),                // layoutNodes
        std::forward_as_tuple(),                // data
        std::forward_as_tuple(),                // PolymorphicType
        g);
}

template <class Tag>
inline RenderGraph::vertex_descriptor
add_vertex(RenderGraph& g, Tag t, const char* name) { // NOLINT
    return add_vertex(
        t,
        std::forward_as_tuple(name), // names
        std::forward_as_tuple(),     // layoutNodes
        std::forward_as_tuple(),     // data
        std::forward_as_tuple(),     // PolymorphicType
        g);
}

} // namespace render

} // namespace cc
