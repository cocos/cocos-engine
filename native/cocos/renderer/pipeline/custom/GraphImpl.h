#pragma once
#include <cocos/renderer/pipeline/custom/GraphTypes.h>
#include <cocos/renderer/pipeline/custom/GslUtils.h>
#include <boost/container/pmr/vector.hpp>
#include <boost/graph/adjacency_iterator.hpp>
#include <boost/graph/properties.hpp>
#include <boost/iterator/iterator_adaptor.hpp>
#include <boost/variant2/variant.hpp>
#include <functional>

namespace cc {

namespace impl {

//--------------------------------------------------------------------
// PropertyMap
//--------------------------------------------------------------------
template <class Category, class Graph, class Value, class Reference>
struct VectorVertexBundlePropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexBundlePropertyMap<Category, Graph, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexBundlePropertyMap(Graph &g) noexcept // NOLINT(google-explicit-constructor)
    : mGraph(&g) {}

    inline reference operator[](const key_type &v) const noexcept {
        return mGraph->mVertices[v].mProperty;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph *mGraph = nullptr;
};

template <class Category, class Graph, class Value, class Reference>
struct PointerVertexBundlePropertyMap
: public boost::put_get_helper<
      Reference, PointerVertexBundlePropertyMap<Category, Graph, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    PointerVertexBundlePropertyMap(Graph &g) noexcept // NOLINT(google-explicit-constructor)
    : mGraph(&g) {}

    inline reference operator[](const key_type &v) const noexcept {
        auto *sv = static_cast<typename Graph::vertex_type *>(v);
        return sv->mProperty;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph *mGraph = nullptr;
};

template <class Category, class Graph, class Value, class Reference, class MemberPointer>
struct VectorVertexBundleMemberPropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexBundleMemberPropertyMap<Category, Graph, Value, Reference, MemberPointer>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexBundleMemberPropertyMap(Graph &g, MemberPointer ptr) noexcept
    : mGraph(&g), mMemberPointer(ptr) {}

    inline reference operator[](const key_type &v) const noexcept {
        return mGraph->mVertices[v].mProperty.*mMemberPointer;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph        *mGraph         = nullptr;
    MemberPointer mMemberPointer = {};
};

template <class Category, class Graph, class Value, class Reference, class MemberPointer>
struct PointerVertexBundleMemberPropertyMap
: public boost::put_get_helper<
      Reference, PointerVertexBundleMemberPropertyMap<Category, Graph, Value, Reference, MemberPointer>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    PointerVertexBundleMemberPropertyMap(Graph &g, MemberPointer ptr) noexcept
    : mGraph(&g), mMemberPointer(ptr) {}

    inline reference operator[](const key_type &v) const noexcept {
        auto *sv = static_cast<typename Graph::vertex_type *>(v);
        return sv->mProperty.*mMemberPointer;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph        *mGraph         = nullptr;
    MemberPointer mMemberPointer = {};
};

template <class Category, class Graph, class Container, class Value, class Reference>
struct VectorVertexComponentPropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexComponentPropertyMap<Category, Graph, Container, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexComponentPropertyMap(Container &c) noexcept // NOLINT(google-explicit-constructor)
    : mContainer(&c) {}

    inline reference operator[](const key_type &v) const noexcept {
        return (*mContainer)[v];
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Container *mContainer = nullptr;
};

template <class Category, class Graph, class Container, class Value, class Reference, class MemberPointer>
struct VectorVertexComponentMemberPropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexComponentMemberPropertyMap<Category, Graph, Container, Value, Reference, MemberPointer>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexComponentMemberPropertyMap(Container &c, MemberPointer ptr) noexcept
    : mContainer(&c), mMemberPointer(ptr) {}

    inline reference operator[](const key_type &v) const noexcept {
        return (*mContainer)[v].*mMemberPointer;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Container    *mContainer     = nullptr;
    MemberPointer mMemberPointer = {};
};

template <class Category, class Graph, class ComponentPointer, class Value, class Reference>
struct VectorVertexIteratorComponentPropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexIteratorComponentPropertyMap<Category, Graph, ComponentPointer, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexIteratorComponentPropertyMap(Graph &g, ComponentPointer component) noexcept
    : mGraph(&g), mComponentPointer(component) {}

    inline reference operator[](const key_type &v) const noexcept {
        return *(mGraph->mVertices[v].*mComponentPointer);
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph           *mGraph            = nullptr;
    ComponentPointer mComponentPointer = {};
};

template <class Category, class Graph, class ComponentPointer, class Value, class Reference, class MemberPointer>
struct VectorVertexIteratorComponentMemberPropertyMap
: public boost::put_get_helper<
      Reference, VectorVertexIteratorComponentMemberPropertyMap<Category, Graph, ComponentPointer, Value, Reference, MemberPointer>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::vertex_descriptor;
    using category   = Category;

    VectorVertexIteratorComponentMemberPropertyMap(Graph &g, ComponentPointer component, MemberPointer ptr) noexcept
    : mGraph(&g), mComponentPointer(component), mMemberPointer(ptr) {}

    inline reference operator[](const key_type &v) const noexcept {
        return (*(mGraph->mVertices[v].*mComponentPointer)).*mMemberPointer;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Graph           *mGraph            = nullptr;
    ComponentPointer mComponentPointer = {};
    MemberPointer    mMemberPointer    = {};
};

template <class Category, class VertexDescriptor, class Container, class Value, class Reference>
struct VectorPathPropertyMap
: public boost::put_get_helper<
      Reference, VectorPathPropertyMap<Category, VertexDescriptor, Container, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = VertexDescriptor;
    using category   = Category;

    VectorPathPropertyMap(Container &c) noexcept // NOLINT(google-explicit-constructor)
    : mContainer(&c) {}

    inline reference operator[](const key_type &v) const noexcept {
        return (*mContainer)[v].mPathIterator->first;
    }
    inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    Container *mContainer = nullptr;
};

template <class Category, class Graph, class Value, class Reference>
struct EdgeBundlePropertyMap
: public boost::put_get_helper<
      Reference, EdgeBundlePropertyMap<Category, Graph, Value, Reference>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::edge_descriptor;
    using category   = Category;

    EdgeBundlePropertyMap(Graph &g) noexcept // NOLINT(google-explicit-constructor)
    : mGraph(&g) {}

    inline reference operator[](const key_type &e) const noexcept {
        return *static_cast<typename Graph::edge_property_type *>(e.get_property());
    }
    inline reference operator()(const key_type &e) const noexcept {
        return this->operator[](e);
    }

    Graph *mGraph = nullptr;
};

template <class Category, class Graph, class Value, class Reference, class MemberPointer>
struct EdgeBundleMemberPropertyMap
: public boost::put_get_helper<
      Reference, EdgeBundleMemberPropertyMap<Category, Graph, Value, Reference, MemberPointer>> {
    using value_type = Value;
    using reference  = Reference;
    using key_type   = typename Graph::edge_descriptor;
    using category   = Category;

    EdgeBundleMemberPropertyMap(Graph &g, MemberPointer ptr) noexcept
    : mGraph(&g), mMemberPointer(ptr) {}

    inline reference operator[](const key_type &e) const noexcept {
        auto &p = *static_cast<typename Graph::edge_property_type *>(e.get_property());
        return p.*mMemberPointer;
    }
    inline reference operator()(const key_type &e) const noexcept {
        return this->operator[](e);
    }

    Graph        *mGraph         = nullptr;
    MemberPointer mMemberPointer = {};
};

template <class Sequence, class Predicate>
void sequenceEraseIf(Sequence &c, Predicate &&p) noexcept {
    if (!c.empty()) {
        c.erase(std::remove_if(c.begin(), c.end(), p), c.end());
    }
}

// notice: Predicate might be different from associative key
// when Predicate is associative key, it is slower than erase [lower_bound, upper_bound)
template <class AssociativeContainer, class Predicate>
void associativeEraseIf(AssociativeContainer &c, Predicate &&p) noexcept {
    auto next = c.begin();
    for (auto i = next; next != c.end(); i = next) {
        ++next;
        if (p(*i)) {
            c.erase(i);
        }
    }
}

// notice: Predicate might be different from associative key
// when Predicate is associative key, it is slower than erase [lower_bound, upper_bound)
template <class AssociativeContainer, class Predicate>
void unstableAssociativeEraseIf(AssociativeContainer &c, Predicate &&p) noexcept {
    auto n = c.size();
    while (n--) {
        for (auto i = c.begin(); i != c.end(); ++i) {
            if (p(*i)) {
                c.erase(i);
                break;
            }
        }
    }
}

template <class EdgeDescriptor, class IncidenceList>
inline void removeIncidenceEdge(EdgeDescriptor e, IncidenceList &el) noexcept {
    e.expectsNoProperty();
    for (auto i = el.begin(); i != el.end(); ++i) {
        if ((*i).get_target() == e.m_target) {
            el.erase(i);
            return;
        }
    }
}

template <class DirectedCategory, class VertexDescriptor, class IncidenceList, class EdgeProperty>
inline void removeIncidenceEdge(
    EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> e, IncidenceList &el) noexcept {
    for (auto i = el.begin(); i != el.end(); ++i) {
        if (static_cast<void *>(&(*i).get_property()) == e.get_property()) {
            el.erase(i);
            return;
        }
    }
}

template <class Graph, class IncidenceList, class VertexDescriptor>
inline void removeDirectedAllEdgeProperties(Graph &g, IncidenceList &el, VertexDescriptor v) noexcept {
    auto i   = el.begin();
    auto end = el.end();
    for (; i != end; ++i) {
        if ((*i).get_target() == v) {
            // NOTE: Wihtout this skip, this loop will double-delete
            // properties of loop edges. This solution is based on the
            // observation that the incidence edges of a vertex with a loop
            // are adjacent in the out edge list. This *may* actually hold
            // for multisets also.
            bool skip = (std::next(i) != end && i->get_iter() == std::next(i)->get_iter());
            g.mEdges.erase((*i).get_iter());
            if (skip) {
                ++i;
            }
        }
    }
}

template <class IncidenceIterator, class IncidenceList, class Predicate>
inline void sequenceRemoveIncidenceEdgeIf(IncidenceIterator first, IncidenceIterator last,
                                          IncidenceList &el, Predicate &&pred) noexcept {
    // remove_if
    while (first != last && !pred(*first)) {
        ++first;
    }
    auto i = first;
    if (first != last) {
        for (++i; i != last; ++i) {
            if (!pred(*i)) {
                *first.base() = std::move(*i.base());
                ++first;
            }
        }
    }
    el.erase(first.base(), el.end());
}

template <class IncidenceIterator, class IncidenceList, class Predicate>
inline void associativeRemoveIncidenceEdgeIf(IncidenceIterator first, IncidenceIterator last,
                                             IncidenceList &el, Predicate &&pred) noexcept {
    for (auto next = first; first != last; first = next) {
        ++next;
        if (pred(*first)) {
            el.erase(first.base());
        }
    }
}

template <class Graph, class EdgeDescriptor, class EdgeProperty>
inline void removeUndirectedEdge(Graph &g, EdgeDescriptor e, EdgeProperty &p) noexcept {
    auto                               &outEdgeList = g.out_edge_list(source(e, g));
    auto                                outEdgeIter = outEdgeList.begin();
    decltype((*outEdgeIter).get_iter()) edgeIterToErase;
    for (; outEdgeIter != outEdgeList.end(); ++outEdgeIter) {
        if (&(*outEdgeIter).get_property() == &p) {
            edgeIterToErase = (*outEdgeIter).get_iter();
            outEdgeList.erase(outEdgeIter);
            break;
        }
    }
    auto &inEdgeList = g.out_edge_list(target(e, g));
    auto  inEdgeIter = inEdgeList.begin();
    for (; inEdgeIter != inEdgeList.end(); ++inEdgeIter) {
        if (&(*inEdgeIter).get_property() == &p) {
            inEdgeList.erase(inEdgeIter);
            break;
        }
    }
    g.mEdges.erase(edgeIterToErase);
}

template <class Graph, class IncidenceIterator, class IncidenceList, class Predicate>
inline void sequenceRemoveUndirectedOutEdgeIf(Graph            &g,
                                              IncidenceIterator first, IncidenceIterator last, IncidenceList &el,
                                              Predicate &&pred) noexcept {
    // remove_if
    while (first != last && !pred(*first)) {
        ++first;
    }
    auto i               = first;
    bool selfLoopRemoved = false;
    if (first != last) {
        for (; i != last; ++i) {
            if (selfLoopRemoved) {
                /* With self loops, the descriptor will show up
                 * twice. The first time it will be removed, and now it
                 * will be skipped.
                 */
                selfLoopRemoved = false;
            } else if (!pred(*i)) {
                *first.base() = std::move(*i.base());
                ++first;
            } else {
                if (source(*i, g) == target(*i, g)) {
                    selfLoopRemoved = true;
                } else {
                    // Remove the edge from the target
                    removeIncidenceEdge(*i, g.out_edge_list(target(*i, g)));
                }

                // Erase the edge property
                g.mEdges.erase((*i.base()).get_iter());
            }
        }
    }
    el.erase(first.base(), el.end());
}

template <class Graph, class IncidenceIterator, class IncidenceList, class Predicate>
inline void associativeRemoveUndirectedOutEdgeIf(Graph            &g,
                                                 IncidenceIterator first, IncidenceIterator last, IncidenceList &el,
                                                 Predicate &&pred) noexcept {
    for (auto next = first; first != last; first = next) {
        ++next;
        if (pred(*first)) {
            if (source(*first, g) != target(*first, g)) {
                // Remove the edge from the target
                removeIncidenceEdge(*first, g.out_edge_list(target(*first, g)));
            }

            // Erase the edge property
            g.mEdges.erase((*first.base()).get_iter());

            // Erase the edge in the source
            el.erase(first.base());
        }
    }
}

// list/vector out_edge_list
template <class IncidenceList, class VertexDescriptor>
inline void reindexEdgeList(IncidenceList &el, VertexDescriptor u) {
    auto ei   = el.begin();
    auto eEnd = el.end();
    for (; ei != eEnd; ++ei) {
        if ((*ei).get_target() > u) {
            --(*ei).get_target();
        }
    }
}

template <class Tag, class Container, class HandleDescriptor>
inline void reindexVectorHandle(Container &container, HandleDescriptor u) {
    static_assert(std::is_arithmetic<HandleDescriptor>::value, "reindexVectorHandle");

    using handle_type = ValueHandle<Tag, HandleDescriptor>;
    for (auto &vert : container) {
        if (boost::variant2::holds_alternative<handle_type>(vert.mHandle)) {
            auto &v = boost::variant2::get<handle_type>(vert.mHandle).mValue;
            if (v > u) {
                --v;
            }
        }
    }
}

template <class Graph, class VertexDescriptor>
inline void removeVectorVertex(Graph &g, VertexDescriptor u, boost::directed_tag /*tag*/) {
    g.mVertices.erase(g.mVertices.begin() + u);
    auto numV = num_vertices(g);
    if (u != numV) {
        for (VertexDescriptor v = 0; v < numV; ++v) {
            reindexEdgeList(g.out_edge_list(v), u);
        }
    }
}

template <class Graph, class VertexDescriptor>
inline void removeVectorVertex(Graph &g, VertexDescriptor u, boost::undirected_tag /*tag*/) {
    g.mVertices.erase(g.mVertices.begin() + u);
    VertexDescriptor numV = num_vertices(g);
    for (VertexDescriptor v = 0; v < numV; ++v) {
        reindexEdgeList(g.out_edge_list(v), u);
    }

    auto ei    = g.mEdges.begin();
    auto eiEnd = g.mEdges.end();
    for (; ei != eiEnd; ++ei) {
        if (ei->m_source > u) {
            --ei->m_source;
        }
        if (ei->m_target > u) {
            --ei->m_target;
        }
    }
}

template <class Graph, class VertexDescriptor>
inline void removeVectorVertex(Graph &g, VertexDescriptor u, boost::bidirectional_tag /*tag*/) {
    g.mVertices.erase(g.mVertices.begin() + u);
    VertexDescriptor numV = num_vertices(g);
    VertexDescriptor v;
    if (u != numV) {
        for (v = 0; v < numV; ++v) {
            reindexEdgeList(g.out_edge_list(v), u);
        }

        for (v = 0; v < numV; ++v) {
            reindexEdgeList(g.in_edge_list(v), u);
        }
    }
}

template <class Graph, class VertexDescriptor, class EdgeList>
inline void removeVectorVertex(Graph           &g, EdgeList           &/*edges*/,
                               VertexDescriptor u, boost::bidirectional_tag /*tag*/) {
    g.mVertices.erase(g.mVertices.begin() + u);
    VertexDescriptor numV = num_vertices(g);
    VertexDescriptor v;
    if (u != numV) {
        for (v = 0; v < numV; ++v) {
            reindexEdgeList(g.out_edge_list(v), u);
        }

        for (v = 0; v < numV; ++v) {
            reindexEdgeList(g.in_edge_list(v), u);
        }

        auto ei    = g.mEdges.begin();
        auto eiEnd = g.mEdges.end();
        for (; ei != eiEnd; ++ei) {
            if (ei->m_source > u) {
                --ei->m_source;
            }
            if (ei->m_target > u) {
                --ei->m_target;
            }
        }
    }
}

template <class Graph>
inline void removeVectorOwner(Graph &g, typename Graph::vertex_descriptor u) {
    // might make children detached
    g.mObjects.erase(g.mObjects.begin() + u);
    auto numV = num_vertices(g);
    if (u != numV) {
        for (typename Graph::vertex_descriptor v = 0; v < numV; ++v) {
            reindexEdgeList(g.children_list(v), u);
        }

        for (typename Graph::vertex_descriptor v = 0; v < numV; ++v) {
            reindexEdgeList(g.parents_list(v), u);
        }
    }
}

// AddressableGraph
template <class AddressableGraph>
inline std::ptrdiff_t pathLength(typename AddressableGraph::vertex_descriptor u, const AddressableGraph &g,
                                 typename AddressableGraph::vertex_descriptor parentID = AddressableGraph::null_vertex()) noexcept {
    if (u == parentID) {
        return 0;
    }

    const auto &pmap = get(boost::vertex_name, g);

    std::ptrdiff_t sz = 0;
    while (u != parentID) {
        sz += static_cast<std::ptrdiff_t>(get(pmap, u).size()) + 1;
        u = parent(u, g);
    }

    return sz;
}

template <class AddressableGraph, class CharT, class Allocator>
inline void pathComposite(
    std::basic_string<CharT, std::char_traits<CharT>, Allocator> &str,
    std::ptrdiff_t                                               &sz,
    typename AddressableGraph::vertex_descriptor u, const AddressableGraph &g,
    typename AddressableGraph::vertex_descriptor parentID = AddressableGraph::null_vertex()) noexcept {
    const auto &pmap = get(boost::vertex_name, g);

    while (u != parentID) {
        Expects(sz <= static_cast<std::ptrdiff_t>(str.size()));

        const auto &name = get(pmap, u);
        sz -= static_cast<std::ptrdiff_t>(name.size()) + 1;
        Ensures(sz >= 0);
        str[sz] = '/';
        std::copy(name.begin(), name.end(), str.begin() + sz + 1);

        u = parent(u, g);
    }
    Ensures(sz == 0);
}

template <class Key>
struct ColorMap : public boost::put_get_helper<boost::default_color_type &, ColorMap<Key>> {
    using value_type = boost::default_color_type;
    using reference  = boost::default_color_type &;
    using key_type   = Key;
    using category   = boost::lvalue_property_map_tag;

    ColorMap(boost::container::pmr::vector<boost::default_color_type> &vec) noexcept // NOLINT(google-explicit-constructor)
    : mContainer{&vec} {}

    [[nodiscard]] inline reference operator[](const key_type &v) const noexcept {
        return (*mContainer)[v];
    }
    [[nodiscard]] inline reference operator()(const key_type &v) const noexcept {
        return this->operator[](v);
    }

    boost::container::pmr::vector<boost::default_color_type> *mContainer = nullptr;
};

} // namespace impl

} // namespace cc

namespace std {

template <class DirectedCategory, class VertexDescriptor>
struct hash<cc::impl::EdgeDescriptor<DirectedCategory, VertexDescriptor>> {
    size_t operator()(const cc::impl::EdgeDescriptor<DirectedCategory, VertexDescriptor> &e) const noexcept {
        return boost::hash_value(e.get_property());
    }
};

} // namespace std
