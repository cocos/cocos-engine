// clang-format off
#pragma once
#include <boost/utility/string_view.hpp>
#include "cocos/renderer/pipeline/custom/GraphImpl.h"
#include "cocos/renderer/pipeline/custom/GslUtils.h"
#include "cocos/renderer/pipeline/custom/Overload.h"
#include "cocos/renderer/pipeline/custom/PathUtils.h"
#include "cocos/renderer/pipeline/custom/RenderExampleTypes.h"
#include "cocos/renderer/pipeline/custom/invoke.hpp"

namespace cc {

namespace render {

namespace example {

// IncidenceGraph
inline RenderDependencyGraph::vertex_descriptor
source(const RenderDependencyGraph::edge_descriptor& e, const RenderDependencyGraph& /*g*/) noexcept {
    return e.source;
}

inline RenderDependencyGraph::vertex_descriptor
target(const RenderDependencyGraph::edge_descriptor& e, const RenderDependencyGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<RenderDependencyGraph::out_edge_iterator, RenderDependencyGraph::out_edge_iterator>
out_edges(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderDependencyGraph::out_edge_iterator(const_cast<RenderDependencyGraph&>(g).out_edge_list(u).begin(), u),
        RenderDependencyGraph::out_edge_iterator(const_cast<RenderDependencyGraph&>(g).out_edge_list(u).end(), u));
}

inline RenderDependencyGraph::degree_size_type
out_degree(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderDependencyGraph::degree_size_type>(g.out_edge_list(u).size());
}

inline std::pair<RenderDependencyGraph::edge_descriptor, bool>
edge(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph::vertex_descriptor v, const RenderDependencyGraph& g) noexcept {
    const auto& outEdgeList = g.out_edge_list(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderDependencyGraph::out_edge_type(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {RenderDependencyGraph::edge_descriptor(u, v, (hasEdge ? &(*iter).get_property() : nullptr)), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<RenderDependencyGraph::in_edge_iterator, RenderDependencyGraph::in_edge_iterator>
in_edges(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderDependencyGraph::in_edge_iterator(const_cast<RenderDependencyGraph&>(g).in_edge_list(u).begin(), u),
        RenderDependencyGraph::in_edge_iterator(const_cast<RenderDependencyGraph&>(g).in_edge_list(u).end(), u));
}

inline RenderDependencyGraph::degree_size_type
in_degree(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderDependencyGraph::degree_size_type>(g.in_edge_list(u).size());
}

inline RenderDependencyGraph::degree_size_type
degree(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<RenderDependencyGraph::adjacency_iterator, RenderDependencyGraph::adjacency_iterator>
adjacent_vertices(RenderDependencyGraph::vertex_descriptor u, const RenderDependencyGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(RenderDependencyGraph::adjacency_iterator(edges.first, &g), RenderDependencyGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<RenderDependencyGraph::vertex_iterator, RenderDependencyGraph::vertex_iterator>
vertices(const RenderDependencyGraph& g) noexcept {
    return std::make_pair(const_cast<RenderDependencyGraph&>(g).vertex_set().begin(), const_cast<RenderDependencyGraph&>(g).vertex_set().end());
}

inline RenderDependencyGraph::vertices_size_type
num_vertices(const RenderDependencyGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderDependencyGraph::vertices_size_type>(g.vertex_set().size());
}

// EdgeListGraph
inline std::pair<RenderDependencyGraph::edge_iterator, RenderDependencyGraph::edge_iterator>
edges(const RenderDependencyGraph& g) noexcept {
    return std::make_pair(
        RenderDependencyGraph::edge_iterator(const_cast<RenderDependencyGraph&>(g).edges.begin()),
        RenderDependencyGraph::edge_iterator(const_cast<RenderDependencyGraph&>(g).edges.end()));
}

inline RenderDependencyGraph::edges_size_type
num_edges(const RenderDependencyGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderDependencyGraph::edges_size_type>(g.edges.size());
}

// MutableGraph(Edge)
inline std::pair<RenderDependencyGraph::edge_descriptor, bool>
add_edge( // NOLINT
    RenderDependencyGraph::vertex_descriptor u,
    RenderDependencyGraph::vertex_descriptor v, RenderDependencyGraph& g) {
    auto edgeIter = g.edges.emplace(g.edges.end(), u, v);
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v, edgeIter);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u, edgeIter);

    return std::make_pair(RenderDependencyGraph::edge_descriptor(u, v, &edgeIter->get_property()), true);
}

inline void remove_edge(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph::vertex_descriptor v, RenderDependencyGraph& g) noexcept { // NOLINT
    auto& outEdgeList = g.out_edge_list(u);

    impl::removeDirectedAllEdgeProperties(g, outEdgeList, v);

    // remove out-edges
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

void remove_edge(RenderDependencyGraph::out_edge_iterator iter, RenderDependencyGraph& g) noexcept; // NOLINT

inline void remove_edge(RenderDependencyGraph::edge_descriptor e, RenderDependencyGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto range = out_edges(source(e, g), g);
    range.first = std::find(range.first, range.second, e);
    CC_ENSURES(range.first != range.second);
    remove_edge(range.first, g);
}

inline void remove_edge(RenderDependencyGraph::out_edge_iterator iter, RenderDependencyGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.out_edge_list(source(e, g));
    auto& inEdgeList  = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    g.edges.erase(iter.base()->get_iter());
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(RenderDependencyGraph::vertex_descriptor u, Predicate&& pred, RenderDependencyGraph& g) { // NOLINT
    std::vector<PmrList<RenderDependencyGraph::edge_type>::iterator> garbage;
    for (auto pair = out_edges(u, g); pair.first != pair.second; ++pair.first) {
        auto& outIter = pair.first;
        auto& outEnd = pair.second;
        if (pred(*outIter)) {
            auto& inEdgeList = g.in_edge_list(target(*outIter, g));
            auto  e          = *outIter;
            impl::removeIncidenceEdge(e, inEdgeList);
            garbage.emplace_back((*outIter.base()).get_iter());
        }
    }
    auto pair = out_edges(u, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& outEdgeList  = g.out_edge_list(u);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, outEdgeList, std::forward<Predicate>(pred));
    for (const auto& v : garbage) {
        g.edges.erase(v);
    }
}

template <class Predicate>
inline void remove_in_edge_if(RenderDependencyGraph::vertex_descriptor v, Predicate&& pred, RenderDependencyGraph& g) { // NOLINT
    std::vector<PmrList<RenderDependencyGraph::edge_type>::iterator> garbage;
    for (auto pair = in_edges(v, g); pair.first != pair.second; ++pair.first) {
        auto& inIter = pair.first;
        auto& inEnd = pair.second;
        if (pred(*inIter)) {
            auto& outEdgeList = g.out_edge_list(source(*inIter, g));
            auto  e           = *inIter;
            impl::removeIncidenceEdge(e, outEdgeList);
            garbage.emplace_back((*inIter.base()).get_iter());
        }
    }
    auto pair = in_edges(v, g);
    auto& first = pair.first;
    auto& last = pair.second;
    auto& inEdgeList   = g.in_edge_list(v);
    impl::sequenceRemoveIncidenceEdgeIf(first, last, inEdgeList, std::forward<Predicate>(pred));
    for (const auto& v : garbage) {
        g.edges.erase(v);
    }
}

template <class Predicate>
inline void remove_edge_if(Predicate&& pred, RenderDependencyGraph& g) { // NOLINT
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
inline void clear_out_edges(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph& g) noexcept { // NOLINT
    // Bidirectional (OutEdges)
    auto& outEdgeList = g.out_edge_list(u);
    auto  outEnd      = outEdgeList.end();
    for (auto iter = outEdgeList.begin(); iter != outEnd; ++iter) {
        auto& inEdgeList = g.in_edge_list((*iter).get_target());
        // eraseFromIncidenceList
        impl::sequenceEraseIf(inEdgeList, [u](const auto& e) {
            return e.get_target() == u;
        });
        g.edges.erase((*iter).get_iter());
    }
    outEdgeList.clear();
}

inline void clear_in_edges(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph& g) noexcept { // NOLINT
    // Bidirectional (InEdges)
    auto& inEdgeList = g.in_edge_list(u);
    auto  inEnd      = inEdgeList.end();
    for (auto iter = inEdgeList.begin(); iter != inEnd; ++iter) {
        auto& outEdgeList = g.out_edge_list((*iter).get_target());
        // eraseFromIncidenceList
        impl::sequenceEraseIf(outEdgeList, [u](const auto& e) {
            return e.get_target() == u;
        });
        g.edges.erase((*iter).get_iter());
    }
    inEdgeList.clear();
}

inline void clear_vertex(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex(RenderDependencyGraph::vertex_descriptor u, RenderDependencyGraph& g) noexcept { // NOLINT
    { // UuidGraph
        const auto& key = g.passIDs[u];
        auto num = g.passIndex.erase(key);
        CC_ENSURES(num == 1);
        for (auto&& pair : g.passIndex) {
            auto& v = pair.second;
            if (v > u) {
                --v;
            }
        }
    }
    impl::removeVectorVertex(const_cast<RenderDependencyGraph&>(g), u, RenderDependencyGraph::directed_category{});

    // remove components
    g.passes.erase(g.passes.begin() + std::ptrdiff_t(u));
    g.valueIDs.erase(g.valueIDs.begin() + std::ptrdiff_t(u));
    g.passIDs.erase(g.passIDs.begin() + std::ptrdiff_t(u));
    g.traits.erase(g.traits.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Edge)
template <class EdgeProperty>
inline std::pair<RenderDependencyGraph::edge_descriptor, bool>
add_edge( // NOLINT
    RenderDependencyGraph::vertex_descriptor u,
    RenderDependencyGraph::vertex_descriptor v,
    EdgeProperty&& p, RenderDependencyGraph& g) {
    auto edgeIter = g.edges.emplace(g.edges.end(), u, v, std::forward<EdgeProperty>(p));
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v, edgeIter);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u, edgeIter);

    return std::make_pair(RenderDependencyGraph::edge_descriptor(u, v, &edgeIter->get_property()), true);
}

template <class... T>
inline std::pair<RenderDependencyGraph::edge_descriptor, bool>
add_edge( // NOLINT
    RenderDependencyGraph::vertex_descriptor u,
    RenderDependencyGraph::vertex_descriptor v,
    RenderDependencyGraph& g, T&&... args) {
    auto edgeIter = g.edges.emplace(g.edges.end(), u, v, std::forward<T>(args)...);
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v, edgeIter);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u, edgeIter);

    return std::make_pair(RenderDependencyGraph::edge_descriptor(u, v, &edgeIter->get_property()), true);
}

// MutablePropertyGraph(Vertex)
template <class Component0, class Component1, class Component2, class Component3>
inline RenderDependencyGraph::vertex_descriptor
add_vertex(Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, RenderDependencyGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<RenderDependencyGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        const auto& uuid = c2;
        auto res = g.passIndex.emplace(uuid, v);
        CC_ENSURES(res.second);
    }
    g.passes.emplace_back(std::forward<Component0>(c0));
    g.valueIDs.emplace_back(std::forward<Component1>(c1));
    g.passIDs.emplace_back(std::forward<Component2>(c2));
    g.traits.emplace_back(std::forward<Component3>(c3));

    return v;
}

template <class Component0, class Component1, class Component2, class Component3>
inline RenderDependencyGraph::vertex_descriptor
add_vertex(std::piecewise_construct_t, Component0&& c0, Component1&& c1, Component2&& c2, Component3&& c3, RenderDependencyGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<RenderDependencyGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        invoke_hpp::apply(
            [&](const auto&... args) {
                auto res = g.passIndex.emplace(std::piecewise_construct, std::forward_as_tuple(args...), std::forward_as_tuple(v));
                CC_ENSURES(res.second);
            },
            c2);
    }

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.passes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.valueIDs.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component1>(c1));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.passIDs.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component2>(c2));

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.traits.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component3>(c3));

    return v;
}

// IncidenceGraph
inline RenderValueGraph::vertex_descriptor
source(const RenderValueGraph::edge_descriptor& e, const RenderValueGraph& /*g*/) noexcept {
    return e.source;
}

inline RenderValueGraph::vertex_descriptor
target(const RenderValueGraph::edge_descriptor& e, const RenderValueGraph& /*g*/) noexcept {
    return e.target;
}

inline std::pair<RenderValueGraph::out_edge_iterator, RenderValueGraph::out_edge_iterator>
out_edges(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderValueGraph::out_edge_iterator(const_cast<RenderValueGraph&>(g).out_edge_list(u).begin(), u),
        RenderValueGraph::out_edge_iterator(const_cast<RenderValueGraph&>(g).out_edge_list(u).end(), u));
}

inline RenderValueGraph::degree_size_type
out_degree(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderValueGraph::degree_size_type>(g.out_edge_list(u).size());
}

inline std::pair<RenderValueGraph::edge_descriptor, bool>
edge(RenderValueGraph::vertex_descriptor u, RenderValueGraph::vertex_descriptor v, const RenderValueGraph& g) noexcept {
    const auto& outEdgeList = g.out_edge_list(u);
    auto  iter        = std::find(outEdgeList.begin(), outEdgeList.end(), RenderValueGraph::out_edge_type(v));
    bool  hasEdge     = (iter != outEdgeList.end());
    return {RenderValueGraph::edge_descriptor(u, v), hasEdge};
}

// BidirectionalGraph(Directed)
inline std::pair<RenderValueGraph::in_edge_iterator, RenderValueGraph::in_edge_iterator>
in_edges(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept { // NOLINT
    return std::make_pair(
        RenderValueGraph::in_edge_iterator(const_cast<RenderValueGraph&>(g).in_edge_list(u).begin(), u),
        RenderValueGraph::in_edge_iterator(const_cast<RenderValueGraph&>(g).in_edge_list(u).end(), u));
}

inline RenderValueGraph::degree_size_type
in_degree(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderValueGraph::degree_size_type>(g.in_edge_list(u).size());
}

inline RenderValueGraph::degree_size_type
degree(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept {
    return in_degree(u, g) + out_degree(u, g);
}

// AdjacencyGraph
inline std::pair<RenderValueGraph::adjacency_iterator, RenderValueGraph::adjacency_iterator>
adjacent_vertices(RenderValueGraph::vertex_descriptor u, const RenderValueGraph& g) noexcept { // NOLINT
    auto edges = out_edges(u, g);
    return std::make_pair(RenderValueGraph::adjacency_iterator(edges.first, &g), RenderValueGraph::adjacency_iterator(edges.second, &g));
}

// VertexListGraph
inline std::pair<RenderValueGraph::vertex_iterator, RenderValueGraph::vertex_iterator>
vertices(const RenderValueGraph& g) noexcept {
    return std::make_pair(const_cast<RenderValueGraph&>(g).vertex_set().begin(), const_cast<RenderValueGraph&>(g).vertex_set().end());
}

inline RenderValueGraph::vertices_size_type
num_vertices(const RenderValueGraph& g) noexcept { // NOLINT
    return gsl::narrow_cast<RenderValueGraph::vertices_size_type>(g.vertex_set().size());
}

// EdgeListGraph
inline std::pair<RenderValueGraph::edge_iterator, RenderValueGraph::edge_iterator>
edges(const RenderValueGraph& g0) noexcept {
    auto& g = const_cast<RenderValueGraph&>(g0);
    return std::make_pair(
        RenderValueGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().begin(), g.vertex_set().end(), g),
        RenderValueGraph::edge_iterator(g.vertex_set().begin(), g.vertex_set().end(), g.vertex_set().end(), g));
}

inline RenderValueGraph::edges_size_type
num_edges(const RenderValueGraph& g) noexcept { // NOLINT
    RenderValueGraph::edges_size_type numEdges = 0;

    auto range = vertices(g);
    for (auto iter = range.first; iter != range.second; ++iter) {
        numEdges += out_degree(*iter, g);
    }
    return numEdges;
}

// MutableGraph(Edge)
inline std::pair<RenderValueGraph::edge_descriptor, bool>
add_edge( // NOLINT
    RenderValueGraph::vertex_descriptor u,
    RenderValueGraph::vertex_descriptor v, RenderValueGraph& g) {
    auto& outEdgeList = g.out_edge_list(u);
    outEdgeList.emplace_back(v);

    auto& inEdgeList = g.in_edge_list(v);
    inEdgeList.emplace_back(u);

    return std::make_pair(RenderValueGraph::edge_descriptor(u, v), true);
}

inline void remove_edge(RenderValueGraph::vertex_descriptor u, RenderValueGraph::vertex_descriptor v, RenderValueGraph& g) noexcept { // NOLINT
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

inline void remove_edge(RenderValueGraph::edge_descriptor e, RenderValueGraph& g) noexcept { // NOLINT
    // remove_edge need rewrite
    auto& outEdgeList = g.out_edge_list(source(e, g));
    impl::removeIncidenceEdge(e, outEdgeList);
    auto& inEdgeList = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
}

inline void remove_edge(RenderValueGraph::out_edge_iterator iter, RenderValueGraph& g) noexcept { // NOLINT
    auto  e           = *iter;
    auto& outEdgeList = g.out_edge_list(source(e, g));
    auto& inEdgeList  = g.in_edge_list(target(e, g));
    impl::removeIncidenceEdge(e, inEdgeList);
    outEdgeList.erase(iter.base());
}

template <class Predicate>
inline void remove_out_edge_if(RenderValueGraph::vertex_descriptor u, Predicate&& pred, RenderValueGraph& g) noexcept { // NOLINT
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
inline void remove_in_edge_if(RenderValueGraph::vertex_descriptor v, Predicate&& pred, RenderValueGraph& g) noexcept { // NOLINT
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
inline void remove_edge_if(Predicate&& pred, RenderValueGraph& g) noexcept { // NOLINT
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
inline void clear_out_edges(RenderValueGraph::vertex_descriptor u, RenderValueGraph& g) noexcept { // NOLINT
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

inline void clear_in_edges(RenderValueGraph::vertex_descriptor u, RenderValueGraph& g) noexcept { // NOLINT
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

inline void clear_vertex(RenderValueGraph::vertex_descriptor u, RenderValueGraph& g) noexcept { // NOLINT
    clear_out_edges(u, g);
    clear_in_edges(u, g);
}

inline void remove_vertex(RenderValueGraph::vertex_descriptor u, RenderValueGraph& g) noexcept { // NOLINT
    { // UuidGraph
        const auto& key = g.nodes[u];
        auto num = g.index.erase(key);
        CC_ENSURES(num == 1);
        for (auto&& pair : g.index) {
            auto& v = pair.second;
            if (v > u) {
                --v;
            }
        }
    }
    impl::removeVectorVertex(const_cast<RenderValueGraph&>(g), u, RenderValueGraph::directed_category{});

    // remove components
    g.nodes.erase(g.nodes.begin() + std::ptrdiff_t(u));
}

// MutablePropertyGraph(Vertex)
template <class Component0>
inline RenderValueGraph::vertex_descriptor
add_vertex(Component0&& c0, RenderValueGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<RenderValueGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        const auto& uuid = c0;
        auto res = g.index.emplace(uuid, v);
        CC_ENSURES(res.second);
    }
    g.nodes.emplace_back(std::forward<Component0>(c0));

    return v;
}

template <class Component0>
inline RenderValueGraph::vertex_descriptor
add_vertex(std::piecewise_construct_t, Component0&& c0, RenderValueGraph& g) { // NOLINT
    auto v = gsl::narrow_cast<RenderValueGraph::vertex_descriptor>(g.vertices.size());

    g.vertices.emplace_back();

    { // UuidGraph
        invoke_hpp::apply(
            [&](const auto&... args) {
                auto res = g.index.emplace(std::piecewise_construct, std::forward_as_tuple(args...), std::forward_as_tuple(v));
                CC_ENSURES(res.second);
            },
            c0);
    }

    invoke_hpp::apply(
        [&](auto&&... args) {
            g.nodes.emplace_back(std::forward<decltype(args)>(args)...);
        },
        std::forward<Component0>(c0));

    return v;
}

} // namespace example

} // namespace render

} // namespace cc

namespace boost {

// Vertex Index
template <>
struct property_map<cc::render::example::RenderDependencyGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::example::RenderDependencyGraph, cc::render::example::RenderDependencyGraph::Pass_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::render::example::RenderPassNode>,
        cc::render::example::RenderPassNode,
        const cc::render::example::RenderPassNode&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::render::example::RenderPassNode>,
        cc::render::example::RenderPassNode,
        cc::render::example::RenderPassNode&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::example::RenderDependencyGraph, T cc::render::example::RenderPassNode::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::render::example::RenderPassNode>,
        T,
        const T&,
        T cc::render::example::RenderPassNode::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::render::example::RenderPassNode>,
        T,
        T&,
        T cc::render::example::RenderPassNode::*>;
};

// Vertex Component
template <>
struct property_map<cc::render::example::RenderDependencyGraph, cc::render::example::RenderDependencyGraph::ValueID_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::PmrFlatSet<uint32_t>>,
        cc::PmrFlatSet<uint32_t>,
        const cc::PmrFlatSet<uint32_t>&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::PmrFlatSet<uint32_t>>,
        cc::PmrFlatSet<uint32_t>,
        cc::PmrFlatSet<uint32_t>&>;
};

// Vertex Component
template <>
struct property_map<cc::render::example::RenderDependencyGraph, cc::render::example::RenderDependencyGraph::PassID_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::render::RenderGraph::vertex_descriptor>,
        cc::render::RenderGraph::vertex_descriptor,
        const cc::render::RenderGraph::vertex_descriptor&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::render::RenderGraph::vertex_descriptor>,
        cc::render::RenderGraph::vertex_descriptor,
        cc::render::RenderGraph::vertex_descriptor&>;
};

// Vertex Component
template <>
struct property_map<cc::render::example::RenderDependencyGraph, cc::render::example::RenderDependencyGraph::Traits_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::render::example::RenderPassTraits>,
        cc::render::example::RenderPassTraits,
        const cc::render::example::RenderPassTraits&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::render::example::RenderPassTraits>,
        cc::render::example::RenderPassTraits,
        cc::render::example::RenderPassTraits&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::example::RenderDependencyGraph, T cc::render::example::RenderPassTraits::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        const container::pmr::vector<cc::render::example::RenderPassTraits>,
        T,
        const T&,
        T cc::render::example::RenderPassTraits::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        container::pmr::vector<cc::render::example::RenderPassTraits>,
        T,
        T&,
        T cc::render::example::RenderPassTraits::*>;
};

// Edge All
template <>
struct property_map<cc::render::example::RenderDependencyGraph, edge_all_t> {
    using const_type = cc::render::impl::EdgeBundlePropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        cc::render::example::DependencyType,
        const cc::render::example::DependencyType&>;
    using type = cc::render::impl::EdgeBundlePropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        cc::render::example::DependencyType,
        cc::render::example::DependencyType&>;
};

// Edge Bundle
template <>
struct property_map<cc::render::example::RenderDependencyGraph, edge_bundle_t> {
    using const_type = cc::render::impl::EdgeBundlePropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderDependencyGraph,
        cc::render::example::DependencyType,
        const cc::render::example::DependencyType&>;
    using type = cc::render::impl::EdgeBundlePropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderDependencyGraph,
        cc::render::example::DependencyType,
        cc::render::example::DependencyType&>;
};

// Vertex Index
template <>
struct property_map<cc::render::example::RenderValueGraph, vertex_index_t> {
    using const_type = identity_property_map;
    using type       = identity_property_map;
};

// Vertex Component
template <>
struct property_map<cc::render::example::RenderValueGraph, cc::render::example::RenderValueGraph::Node_> {
    using const_type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderValueGraph,
        const container::pmr::vector<cc::render::example::RenderValueNode>,
        cc::render::example::RenderValueNode,
        const cc::render::example::RenderValueNode&>;
    using type = cc::render::impl::VectorVertexComponentPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderValueGraph,
        container::pmr::vector<cc::render::example::RenderValueNode>,
        cc::render::example::RenderValueNode,
        cc::render::example::RenderValueNode&>;
};

// Vertex ComponentMember
template <class T>
struct property_map<cc::render::example::RenderValueGraph, T cc::render::example::RenderValueNode::*> {
    using const_type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        const cc::render::example::RenderValueGraph,
        const container::pmr::vector<cc::render::example::RenderValueNode>,
        T,
        const T&,
        T cc::render::example::RenderValueNode::*>;
    using type = cc::render::impl::VectorVertexComponentMemberPropertyMap<
        lvalue_property_map_tag,
        cc::render::example::RenderValueGraph,
        container::pmr::vector<cc::render::example::RenderValueNode>,
        T,
        T&,
        T cc::render::example::RenderValueNode::*>;
};

} // namespace boost

namespace cc {

namespace render {

namespace example {

// Vertex Index
inline boost::property_map<RenderDependencyGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const RenderDependencyGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<RenderDependencyGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, RenderDependencyGraph& /*g*/) noexcept {
    return {};
}

[[nodiscard]] inline impl::ColorMap<RenderDependencyGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const RenderDependencyGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::Pass_>::const_type
get(RenderDependencyGraph::Pass_ /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g.passes};
}

inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::Pass_>::type
get(RenderDependencyGraph::Pass_ /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g.passes};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<RenderDependencyGraph, T RenderPassNode::*>::const_type
get(T RenderPassNode::*memberPointer, const RenderDependencyGraph& g) noexcept {
    return {g.passes, memberPointer};
}

template <class T>
inline typename boost::property_map<RenderDependencyGraph, T RenderPassNode::*>::type
get(T RenderPassNode::*memberPointer, RenderDependencyGraph& g) noexcept {
    return {g.passes, memberPointer};
}

// Vertex Component
inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::ValueID_>::const_type
get(RenderDependencyGraph::ValueID_ /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g.valueIDs};
}

inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::ValueID_>::type
get(RenderDependencyGraph::ValueID_ /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g.valueIDs};
}

// Vertex Component
inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassID_>::const_type
get(RenderDependencyGraph::PassID_ /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g.passIDs};
}

inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::PassID_>::type
get(RenderDependencyGraph::PassID_ /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g.passIDs};
}

// Vertex Component
inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::Traits_>::const_type
get(RenderDependencyGraph::Traits_ /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g.traits};
}

inline typename boost::property_map<RenderDependencyGraph, RenderDependencyGraph::Traits_>::type
get(RenderDependencyGraph::Traits_ /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g.traits};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<RenderDependencyGraph, T RenderPassTraits::*>::const_type
get(T RenderPassTraits::*memberPointer, const RenderDependencyGraph& g) noexcept {
    return {g.traits, memberPointer};
}

template <class T>
inline typename boost::property_map<RenderDependencyGraph, T RenderPassTraits::*>::type
get(T RenderPassTraits::*memberPointer, RenderDependencyGraph& g) noexcept {
    return {g.traits, memberPointer};
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const RenderDependencyGraph& g, RenderDependencyGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, RenderDependencyGraph& g, RenderDependencyGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, RenderDependencyGraph& g,
    RenderDependencyGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// Edge All
inline boost::property_map<RenderDependencyGraph, boost::edge_all_t>::const_type
get(boost::edge_all_t /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g};
}

inline boost::property_map<RenderDependencyGraph, boost::edge_all_t>::type
get(boost::edge_all_t /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g};
}

// Edge Bundle
inline boost::property_map<RenderDependencyGraph, boost::edge_bundle_t>::const_type
get(boost::edge_bundle_t /*tag*/, const RenderDependencyGraph& g) noexcept {
    return {g};
}

inline boost::property_map<RenderDependencyGraph, boost::edge_bundle_t>::type
get(boost::edge_bundle_t /*tag*/, RenderDependencyGraph& g) noexcept {
    return {g};
}

// Edge Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const RenderDependencyGraph& g, RenderDependencyGraph::edge_descriptor e) noexcept {
    return get(get(tag, g), e);
}

// Edge Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, RenderDependencyGraph& g, RenderDependencyGraph::edge_descriptor e) noexcept {
    return get(get(tag, g), e);
}

// Edge Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, RenderDependencyGraph& g,
    RenderDependencyGraph::edge_descriptor e,
    Args&&... args) {
    put(get(tag, g), e, std::forward<Args>(args)...);
}

// UuidGraph
[[nodiscard]] inline RenderDependencyGraph::vertex_descriptor
vertex(const RenderGraph::vertex_descriptor& key, const RenderDependencyGraph& g) {
    return g.passIndex.at(key);
}

template <class KeyLike>
[[nodiscard]] inline RenderDependencyGraph::vertex_descriptor
vertex(const KeyLike& key, const RenderDependencyGraph& g) {
    const auto& index = g.passIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        throw std::out_of_range("at(key, RenderDependencyGraph) out of range");
    }
    return iter->second;
}

template <class KeyLike>
[[nodiscard]] inline RenderDependencyGraph::vertex_descriptor
find_vertex(const KeyLike& key, const RenderDependencyGraph& g) noexcept { // NOLINT
    const auto& index = g.passIndex;
    auto iter = index.find(key);
    if (iter == index.end()) {
        return RenderDependencyGraph::null_vertex();
    }
    return iter->second;
}

[[nodiscard]] inline bool
contains(const RenderGraph::vertex_descriptor& key, const RenderDependencyGraph& g) noexcept {
    auto iter = g.passIndex.find(key);
    return iter != g.passIndex.end();
}

template <class KeyLike>
[[nodiscard]] inline bool
contains(const KeyLike& key, const RenderDependencyGraph& g) noexcept {
    auto iter = g.passIndex.find(key);
    return iter != g.passIndex.end();
}

// MutableGraph(Vertex)
inline RenderDependencyGraph::vertex_descriptor
add_vertex(RenderDependencyGraph& g, const RenderGraph::vertex_descriptor& key) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(), // passes
        std::forward_as_tuple(), // valueIDs
        std::forward_as_tuple(key), // passIDs
        std::forward_as_tuple(), // traits
        g);
}

// Vertex Index
inline boost::property_map<RenderValueGraph, boost::vertex_index_t>::const_type
get(boost::vertex_index_t /*tag*/, const RenderValueGraph& /*g*/) noexcept {
    return {};
}

inline boost::property_map<RenderValueGraph, boost::vertex_index_t>::type
get(boost::vertex_index_t /*tag*/, RenderValueGraph& /*g*/) noexcept {
    return {};
}

[[nodiscard]] inline impl::ColorMap<RenderValueGraph::vertex_descriptor>
get(boost::container::pmr::vector<boost::default_color_type>& colors, const RenderValueGraph& /*g*/) noexcept {
    return {colors};
}

// Vertex Component
inline typename boost::property_map<RenderValueGraph, RenderValueGraph::Node_>::const_type
get(RenderValueGraph::Node_ /*tag*/, const RenderValueGraph& g) noexcept {
    return {g.nodes};
}

inline typename boost::property_map<RenderValueGraph, RenderValueGraph::Node_>::type
get(RenderValueGraph::Node_ /*tag*/, RenderValueGraph& g) noexcept {
    return {g.nodes};
}

// Vertex ComponentMember
template <class T>
inline typename boost::property_map<RenderValueGraph, T RenderValueNode::*>::const_type
get(T RenderValueNode::*memberPointer, const RenderValueGraph& g) noexcept {
    return {g.nodes, memberPointer};
}

template <class T>
inline typename boost::property_map<RenderValueGraph, T RenderValueNode::*>::type
get(T RenderValueNode::*memberPointer, RenderValueGraph& g) noexcept {
    return {g.nodes, memberPointer};
}

// Vertex Constant Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, const RenderValueGraph& g, RenderValueGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Mutable Getter
template <class Tag>
[[nodiscard]] inline decltype(auto)
get(Tag tag, RenderValueGraph& g, RenderValueGraph::vertex_descriptor v) noexcept {
    return get(get(tag, g), v);
}

// Vertex Setter
template <class Tag, class... Args>
inline void put(
    Tag tag, RenderValueGraph& g,
    RenderValueGraph::vertex_descriptor v,
    Args&&... args) {
    put(get(tag, g), v, std::forward<Args>(args)...);
}

// UuidGraph
[[nodiscard]] inline RenderValueGraph::vertex_descriptor
vertex(const RenderValueNode& key, const RenderValueGraph& g) {
    return g.index.at(key);
}

template <class KeyLike>
[[nodiscard]] inline RenderValueGraph::vertex_descriptor
vertex(const KeyLike& key, const RenderValueGraph& g) {
    const auto& index = g.index;
    auto iter = index.find(key);
    if (iter == index.end()) {
        throw std::out_of_range("at(key, RenderValueGraph) out of range");
    }
    return iter->second;
}

template <class KeyLike>
[[nodiscard]] inline RenderValueGraph::vertex_descriptor
find_vertex(const KeyLike& key, const RenderValueGraph& g) noexcept { // NOLINT
    const auto& index = g.index;
    auto iter = index.find(key);
    if (iter == index.end()) {
        return RenderValueGraph::null_vertex();
    }
    return iter->second;
}

[[nodiscard]] inline bool
contains(const RenderValueNode& key, const RenderValueGraph& g) noexcept {
    auto iter = g.index.find(key);
    return iter != g.index.end();
}

template <class KeyLike>
[[nodiscard]] inline bool
contains(const KeyLike& key, const RenderValueGraph& g) noexcept {
    auto iter = g.index.find(key);
    return iter != g.index.end();
}

// MutableGraph(Vertex)
inline RenderValueGraph::vertex_descriptor
add_vertex(RenderValueGraph& g, const RenderValueNode& key) { // NOLINT
    return add_vertex(
        std::piecewise_construct,
        std::forward_as_tuple(key), // nodes
        g);
}

} // namespace example

} // namespace render

} // namespace cc
