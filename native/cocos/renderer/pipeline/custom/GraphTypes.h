#pragma once
#include <cocos/base/Variant.h>
#include <cocos/renderer/pipeline/custom/Overload.h>
#include <boost/container/pmr/polymorphic_allocator.hpp>
#include <boost/iterator/iterator_adaptor.hpp>
#include <boost/optional.hpp>
#include <list>
#include <memory>
#include <type_traits>

namespace boost {

struct use_default;

struct directed_tag;
struct undirected_tag;
struct bidirectional_tag;

struct no_property;

} // namespace boost

namespace cc {

template <class T>
using PmrList = std::list<T, boost::container::pmr::polymorphic_allocator<T>>;

namespace render {

template <class... Ts>
struct VertexOverloaded : Overloaded<Ts...> {
    VertexOverloaded(Ts... ts) // NOLINT
        : Overloaded<Ts...>(std::move(ts)...) {}
    template <class T>
    auto operator()(T* ptr) {
        return this->Overloaded<Ts...>::operator()(*ptr);
    }
};

template <class GraphT, class... Ts>
auto visitObject(typename GraphT::vertex_descriptor v, GraphT& g, Ts... args) {
    return cc::visit(VertexOverloaded<Ts...>{ std::move(args)... }, value(v, g));
}

namespace impl {

//--------------------------------------------------------------------
// EdgeDescriptor
//--------------------------------------------------------------------
template <class DirectedCategory, class VertexDescriptor>
struct EdgeDescriptor {
    EdgeDescriptor() = default;
    EdgeDescriptor(VertexDescriptor s, VertexDescriptor t) noexcept // NOLINT
    : source(s), target(t) {}

    void expectsNoProperty() const noexcept {
        // CC_EXPECTS(false);
    }
    VertexDescriptor source{static_cast<VertexDescriptor>(-1)};
    VertexDescriptor target{static_cast<VertexDescriptor>(-1)};
};

template <class VertexDescriptor>
inline bool operator==(
    const EdgeDescriptor<boost::directed_tag, VertexDescriptor> &lhs,
    const EdgeDescriptor<boost::directed_tag, VertexDescriptor> &rhs) noexcept {
    return lhs.source == rhs.source &&
           lhs.target == rhs.target;
}

template <class VertexDescriptor>
inline bool operator==(
    const EdgeDescriptor<boost::bidirectional_tag, VertexDescriptor> &lhs,
    const EdgeDescriptor<boost::bidirectional_tag, VertexDescriptor> &rhs) noexcept {
    return lhs.source == rhs.source &&
           lhs.target == rhs.target;
}

template <class VertexDescriptor>
inline bool operator!=(
    const EdgeDescriptor<boost::directed_tag, VertexDescriptor> &lhs,
    const EdgeDescriptor<boost::directed_tag, VertexDescriptor> &rhs) noexcept {
    return !(lhs == rhs);
}

template <class VertexDescriptor>
inline bool operator!=(
    const EdgeDescriptor<boost::bidirectional_tag, VertexDescriptor> &lhs,
    const EdgeDescriptor<boost::bidirectional_tag, VertexDescriptor> &rhs) noexcept {
    return !(lhs == rhs);
}

template <class DirectedCategory, class VertexDescriptor>
struct EdgeDescriptorWithProperty : EdgeDescriptor<DirectedCategory, VertexDescriptor> {
    using property_type = void;

    EdgeDescriptorWithProperty() = default;
    EdgeDescriptorWithProperty(VertexDescriptor s, VertexDescriptor t, const property_type *p) noexcept
    : EdgeDescriptor<DirectedCategory, VertexDescriptor>(s, t), edgeProperty(const_cast<property_type *>(p)) {}

    property_type *get_property() const noexcept { // NOLINT
        return edgeProperty;
    }

    property_type *edgeProperty{};
};

template <class DirectedCategory, class VertexDescriptor>
inline bool operator==(
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &lhs,
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &rhs) noexcept {
    return lhs.edgeProperty == rhs.edgeProperty;
}

template <class DirectedCategory, class VertexDescriptor>
inline bool operator!=(
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &lhs,
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &rhs) noexcept {
    return !(lhs == rhs);
}

template <class DirectedCategory, class VertexDescriptor>
inline bool operator<(
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &lhs,
    const EdgeDescriptorWithProperty<DirectedCategory, VertexDescriptor> &rhs) noexcept {
    return lhs.edgeProperty < rhs.edgeProperty;
}

//--------------------------------------------------------------------
// StoredEdge
//--------------------------------------------------------------------
template <class VertexDescriptor>
class StoredEdge {
public:
    StoredEdge(VertexDescriptor target) noexcept // NOLINT(google-explicit-constructor)
    : target(target) {}
    const VertexDescriptor &get_target() const noexcept { // NOLINT
        return target;
    }
    VertexDescriptor &get_target() noexcept { // NOLINT
        return target;
    }
    // auto operator<=>(const StoredEdge&) const noexcept = default;

    VertexDescriptor target;
};

template <class VertexDescriptor>
inline bool operator==(
    const StoredEdge<VertexDescriptor> &lhs,
    const StoredEdge<VertexDescriptor> &rhs) noexcept {
    return lhs.target == rhs.target;
}

template <class VertexDescriptor>
inline bool operator!=(
    const StoredEdge<VertexDescriptor> &lhs,
    const StoredEdge<VertexDescriptor> &rhs) noexcept {
    return !(lhs == rhs);
}

template <class VertexDescriptor>
inline bool operator<(
    const StoredEdge<VertexDescriptor> &lhs,
    const StoredEdge<VertexDescriptor> &rhs) noexcept {
    return lhs.target < rhs.target;
}

template <class VertexDescriptor, class EdgeProperty>
class StoredEdgeWithProperty : public StoredEdge<VertexDescriptor> {
public:
    StoredEdgeWithProperty(VertexDescriptor target, const EdgeProperty &p)
    : StoredEdge<VertexDescriptor>(target), property(new EdgeProperty(p)) {}
    StoredEdgeWithProperty(VertexDescriptor target, std::unique_ptr<EdgeProperty> &&ptr)
    : StoredEdge<VertexDescriptor>(target), property(std::move(ptr)) {}
    StoredEdgeWithProperty(VertexDescriptor target) // NOLINT(google-explicit-constructor)
    : StoredEdge<VertexDescriptor>(target) {}

    StoredEdgeWithProperty(StoredEdgeWithProperty &&) noexcept = default;
    StoredEdgeWithProperty &operator=(StoredEdgeWithProperty &&) noexcept = default;

    EdgeProperty &get_property() noexcept { // NOLINT
        CC_EXPECTS(property);
        return *property;
    }
    const EdgeProperty &get_property() const noexcept { // NOLINT
        CC_EXPECTS(property);
        return *property;
    }
    std::unique_ptr<EdgeProperty> property;
};

template <class VertexDescriptor, class EdgeListIter, class EdgeProperty = boost::no_property>
class StoredEdgeWithEdgeIter : public StoredEdge<VertexDescriptor> {
public:
    StoredEdgeWithEdgeIter(VertexDescriptor v, EdgeListIter iter) noexcept
    : StoredEdge<VertexDescriptor>(v), _edgeListIter(iter) {}
    StoredEdgeWithEdgeIter(VertexDescriptor v) noexcept // NOLINT(google-explicit-constructor)
    : StoredEdge<VertexDescriptor>(v) {}

    EdgeListIter get_iter() const noexcept { // NOLINT
        return _edgeListIter;
    }
    EdgeProperty &get_property() noexcept { // NOLINT
        return this->_edgeListIter->get_property();
    }
    const EdgeProperty &get_property() const noexcept { // NOLINT
        return this->_edgeListIter->get_property();
    }

protected:
    EdgeListIter _edgeListIter{};
};

template <class VertexDescriptor, class EdgeVec, class EdgeProperty = boost::no_property>
class StoredEdgeWithRandomAccessEdgeIter : public StoredEdge<VertexDescriptor> {
public:
    StoredEdgeWithRandomAccessEdgeIter(
        VertexDescriptor v, typename EdgeVec::iterator i, EdgeVec *edgeVec) noexcept
    : StoredEdge<VertexDescriptor>(v), _id(i - edgeVec->begin()), _vector(edgeVec) {}

    typename EdgeVec::iterator get_iter() const noexcept { // NOLINT
        CC_EXPECTS(_vector);
        return _vector->begin() + _id;
    }
    EdgeProperty &get_property() noexcept { // NOLINT
        CC_EXPECTS(this->_vector);
        return (*this->_vector)[this->_id].get_property();
    }
    const EdgeProperty &get_property() const noexcept { // NOLINT
        CC_EXPECTS(this->_vector);
        return (*this->_vector)[this->_id].get_property();
    }

protected:
    size_t   _id{static_cast<size_t>(-1)};
    EdgeVec *_vector{};
};

//--------------------------------------------------------------------
// VertexIterator
//--------------------------------------------------------------------
template <class BaseIter, class VertexDescriptor, class Difference>
struct VertexIter : boost::iterator_adaptor<
                        VertexIter<BaseIter, VertexDescriptor, Difference>,
                        BaseIter, VertexDescriptor, boost::use_default, VertexDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        VertexIter<BaseIter, VertexDescriptor, Difference>,
        BaseIter, VertexDescriptor, boost::use_default, VertexDescriptor, Difference>;

    VertexIter() = default;
    VertexIter(const BaseIter &i) noexcept // NOLINT(google-explicit-constructor)
    : Base(i) {}

    VertexDescriptor dereference() const noexcept {
        return VertexDescriptor{&(*this->base())};
    }
};

template <class BaseIter, class VertexDescriptor, class Difference>
struct VertexMapPtrIter : boost::iterator_adaptor<
                              VertexMapPtrIter<BaseIter, VertexDescriptor, Difference>,
                              BaseIter, VertexDescriptor, boost::use_default, VertexDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        VertexMapPtrIter<BaseIter, VertexDescriptor, Difference>,
        BaseIter, VertexDescriptor, boost::use_default, VertexDescriptor, Difference>;

    VertexMapPtrIter() = default;
    VertexMapPtrIter(const BaseIter &i) noexcept // NOLINT(google-explicit-constructor)
    : Base(i) {}

    VertexDescriptor dereference() const noexcept {
        return VertexDescriptor{this->base()->second.get()};
    }
};

//--------------------------------------------------------------------
// OutEdgeIterator
//--------------------------------------------------------------------
template <class BaseIter, class VertexDescriptor, class EdgeDescriptor, class Difference>
struct OutEdgeIter : boost::iterator_adaptor<
                         OutEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
                         BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        OutEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
        BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference>;

    OutEdgeIter() = default;
    OutEdgeIter(const BaseIter &i, const VertexDescriptor &src) noexcept
    : Base(i), source(src) {}

    EdgeDescriptor dereference() const noexcept {
        // this->base() return out edge list iterator
        return EdgeDescriptor{
            source, (*this->base()).get_target()};
    }
    VertexDescriptor source{};
};

template <class BaseIter, class VertexDescriptor, class EdgeDescriptor, class Difference>
struct OutPropertyEdgeIter : boost::iterator_adaptor<
                                 OutPropertyEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
                                 BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        OutPropertyEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
        BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference>;

    OutPropertyEdgeIter() = default;
    OutPropertyEdgeIter(const BaseIter &i, const VertexDescriptor &src) noexcept
    : Base(i), source(src) {}

    EdgeDescriptor dereference() const noexcept {
        // this->base() return out edge list iterator
        return EdgeDescriptor{
            source, (*this->base()).get_target(), &(*this->base()).get_property()};
    }
    VertexDescriptor source{};
};

//--------------------------------------------------------------------
// InEdgeIterator
//--------------------------------------------------------------------
template <class BaseIter, class VertexDescriptor, class EdgeDescriptor, class Difference>
struct InEdgeIter : boost::iterator_adaptor<
                        InEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
                        BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        InEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
        BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference>;

    InEdgeIter() = default;
    InEdgeIter(const BaseIter &i, const VertexDescriptor &src) noexcept
    : Base(i), source(src) {}

    EdgeDescriptor dereference() const noexcept {
        return EdgeDescriptor{
            (*this->base()).get_target(), source};
    }
    VertexDescriptor source{};
};

template <class BaseIter, class VertexDescriptor, class EdgeDescriptor, class Difference>
struct InPropertyEdgeIter : boost::iterator_adaptor<
                                InPropertyEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
                                BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        InPropertyEdgeIter<BaseIter, VertexDescriptor, EdgeDescriptor, Difference>,
        BaseIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference>;

    InPropertyEdgeIter() = default;
    InPropertyEdgeIter(const BaseIter &i, const VertexDescriptor &src) noexcept
    : Base(i), source(src) {}

    EdgeDescriptor dereference() const noexcept {
        return EdgeDescriptor{
            (*this->base()).get_target(), source, &this->base()->get_property()};
    }
    VertexDescriptor source{};
};

//--------------------------------------------------------------------
// EdgeIterator
//--------------------------------------------------------------------
// UndirectedEdgeIter (Bidirectional || Undirected)
template <class EdgeIter, class EdgeDescriptor, class Difference>
struct UndirectedEdgeIter : boost::iterator_adaptor<
                                UndirectedEdgeIter<EdgeIter, EdgeDescriptor, Difference>,
                                EdgeIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference> {
    using Base = boost::iterator_adaptor<
        UndirectedEdgeIter<EdgeIter, EdgeDescriptor, Difference>,
        EdgeIter, EdgeDescriptor, boost::use_default, EdgeDescriptor, Difference>;

    UndirectedEdgeIter() = default;
    explicit UndirectedEdgeIter(EdgeIter i) noexcept : Base(i) {}

    EdgeDescriptor dereference() const noexcept {
        return EdgeDescriptor{
            (*this->base()).source, (*this->base()).target, &this->base()->get_property()};
    }
};

// DirectedEdgeIterator
template <class VertexIterator, class OutEdgeIterator, class Graph>
class DirectedEdgeIterator {
public:
    using iterator_category = std::forward_iterator_tag;
    using value_type        = typename OutEdgeIterator::value_type;
    using reference         = typename OutEdgeIterator::reference;
    using pointer           = typename OutEdgeIterator::pointer;
    using difference_type   = typename OutEdgeIterator::difference_type;
    using distance_type     = difference_type;

    DirectedEdgeIterator() = default;
    template <class G>
    DirectedEdgeIterator(VertexIterator b, VertexIterator c, VertexIterator e, const G &g) noexcept
    : _begin(b), _curr(c), _end(e), _g(&g) {
        if (_curr != _end) {
            while (_curr != _end && out_degree(*_curr, *_g) == 0) {
                ++_curr;
            }
            if (_curr != _end) {
                _edges = out_edges(*_curr, *_g);
            }
        }
    }

    DirectedEdgeIterator &operator++() noexcept {
        ++_edges->first;
        if (_edges->first == _edges->second) {
            ++_curr;
            while (_curr != _end && out_degree(*_curr, *_g) == 0) {
                ++_curr;
            }
            if (_curr != _end) {
                _edges = out_edges(*_curr, *_g);
            }
        }
        return *this;
    }
    DirectedEdgeIterator operator++(int) noexcept {
        DirectedEdgeIterator tmp = *this;
        ++(*this);
        return tmp;
    }
    value_type operator*() const noexcept {
        return *_edges->first;
    }
    bool operator==(const DirectedEdgeIterator &x) const noexcept {
        return _curr == x._curr && (_curr == _end || _edges->first == x._edges->first);
    }
    bool operator!=(const DirectedEdgeIterator &x) const noexcept {
        return _curr != x._curr || (_curr != _end && _edges->first != x._edges->first);
    }

protected:
    VertexIterator                                               _begin{};
    VertexIterator                                               _curr{};
    VertexIterator                                               _end{};
    boost::optional<std::pair<OutEdgeIterator, OutEdgeIterator>> _edges;
    const Graph                                                 *_g{};
};

//--------------------------------------------------------------------
// EdgeListGraph
//--------------------------------------------------------------------
template <class VertexDescriptor, class EdgeProperty = boost::no_property>
struct ListEdge {
    ListEdge(VertexDescriptor s, VertexDescriptor t) // NOLINT
    : source(s), target(t) {}

    ListEdge(VertexDescriptor s, VertexDescriptor t, EdgeProperty &&p) // NOLINT
    : source(s), target(t), property(std::move(p)) {}

    ListEdge(VertexDescriptor s, VertexDescriptor t, const EdgeProperty &p) // NOLINT
    : source(s), target(t), property(p) {}

    template <class... T>
    ListEdge(VertexDescriptor s, VertexDescriptor t, T &&...args) // NOLINT
    : source(s), target(t), property(std::forward<T>(args)...) {}

    EdgeProperty       &get_property() noexcept { return property; }       // NOLINT
    const EdgeProperty &get_property() const noexcept { return property; } // NOLINT

    VertexDescriptor source{};
    VertexDescriptor target{};
    EdgeProperty     property;
};

// template<class VertexDescriptor, PmrAllocatorUserClass_ EdgeProperty>
template <class VertexDescriptor, class EdgeProperty>
struct PmrListEdge {
    using allocator_type = boost::container::pmr::polymorphic_allocator<char>;
    allocator_type get_allocator() const noexcept { // NOLINT
        return allocator_type{property.get_allocator().resource()};
    }
    // cntrs
    PmrListEdge(VertexDescriptor s, VertexDescriptor t, const allocator_type &alloc) // NOLINT
    : source(s), target(t), property(alloc) {}

    PmrListEdge(VertexDescriptor s, VertexDescriptor t, EdgeProperty &&p, const allocator_type &alloc) // NOLINT
    : source(s), target(t), property(std::move(p), alloc) {}

    PmrListEdge(VertexDescriptor s, VertexDescriptor t, const EdgeProperty &p, const allocator_type &alloc) // NOLINT
    : source(s), target(t), property(p, alloc) {}

    template <class... T>
    PmrListEdge(VertexDescriptor s, VertexDescriptor t, T &&...args) // NOLINT
    : source(s), target(t), property(std::forward<T>(args)...) {}

    // move/copy cntrs
    PmrListEdge(PmrListEdge &&rhs, const allocator_type &alloc)
    : source(std::move(rhs.source)), target(std::move(rhs.target)), property(std::move(rhs.property), alloc) {}
    PmrListEdge(const PmrListEdge &rhs, const allocator_type &alloc)
    : source(rhs.source), target(rhs.target), property(rhs.property, alloc) {}

    PmrListEdge(const PmrListEdge &) = delete;

    EdgeProperty       &get_property() noexcept { return property; }       // NOLINT
    const EdgeProperty &get_property() const noexcept { return property; } // NOLINT

    VertexDescriptor source{};
    VertexDescriptor target{};
    EdgeProperty     property;
};

// Polymorphic Graph
template <class Tag, class Handle>
struct ValueHandle : Tag {
    ValueHandle() noexcept = default;
    ValueHandle(ValueHandle &&rhs) noexcept
    : value(std::move(rhs.value)) {}
    ValueHandle(const ValueHandle &rhs) noexcept
    : value(rhs.value) {}
    ValueHandle &operator=(ValueHandle &&rhs) noexcept {
        value = std::move(rhs.value);
        return *this;
    }
    ValueHandle &operator=(const ValueHandle &rhs) noexcept {
        value = rhs.value;
        return *this;
    }

    ValueHandle(const Handle &handle) noexcept // NOLINT(google-explicit-constructor)
    : value(handle) {}
    ValueHandle(Handle &&handle) noexcept // NOLINT(google-explicit-constructor)
    : value(std::move(handle)) {}
    template <class... Args>
    ValueHandle(Args &&...args) noexcept // NOLINT(google-explicit-constructor)
    : value(std::forward<Args>(args)...) {}

    Handle value{};
};

// Reference Graph
// OwnershipIterator (Bidirectional, !EdgeProperty)
template <class VertexIterator, class OutEdgeIterator, class Graph>
class OwnershipIterator {
public:
    using iterator_category = std::forward_iterator_tag;
    using value_type        = typename OutEdgeIterator::value_type;
    using reference         = typename OutEdgeIterator::reference;
    using pointer           = typename OutEdgeIterator::pointer;
    using difference_type   = typename OutEdgeIterator::difference_type;
    using distance_type     = difference_type;

    OwnershipIterator() = default;
    template <class G>
    OwnershipIterator(VertexIterator b, VertexIterator c, VertexIterator e, const G &g) noexcept
    : _begin(b), _curr(c), _end(e), _g(&g) {
        if (_curr != _end) {
            while (_curr != _end && num_children(*_curr, *_g) == 0) {
                ++_curr;
            }
            if (_curr != _end) {
                _edges = children(*_curr, *_g);
            }
        }
    }

    OwnershipIterator &operator++() noexcept {
        ++_edges->first;
        if (_edges->first == _edges->second) {
            ++_curr;
            while (_curr != _end && num_children(*_curr, *_g) == 0) {
                ++_curr;
            }
            if (_curr != _end) {
                _edges = children(*_curr, *_g);
            }
        }
        return *this;
    }
    OwnershipIterator operator++(int) noexcept {
        OwnershipIterator tmp = *this;
        ++(*this);
        return tmp;
    }
    value_type operator*() const noexcept {
        return *_edges->first;
    }
    bool operator==(const OwnershipIterator &x) const noexcept {
        return _curr == x._curr && (_curr == _end || _edges->first == x._edges->first);
    }
    bool operator!=(const OwnershipIterator &x) const noexcept {
        return _curr != x._curr || (_curr != _end && _edges->first != x._edges->first);
    }

protected:
    VertexIterator                                               _begin{};
    VertexIterator                                               _curr{};
    VertexIterator                                               _end{};
    boost::optional<std::pair<OutEdgeIterator, OutEdgeIterator>> _edges;
    const Graph                                                 *_g{};
};

} // namespace impl

} // namespace render

} // namespace cc
