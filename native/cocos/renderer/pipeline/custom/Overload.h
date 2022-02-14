#pragma once
#include <cocos/base/Variant.h>
#include <type_traits>
#include <utility>

namespace cc {

// https://stackoverflow.com/questions/50510122/stdvariant-with-overloaded-lambdas-alternative-with-msvc

template <class... Ts>
struct overloaded_t {}; // NOLINT

template <class T0>
struct overloaded_t<T0> : T0 {
    using T0::operator();
    overloaded_t(T0 t0) // NOLINT
    : T0(std::move(t0)) {}
};

template <class T0, class T1, class... Ts>
struct overloaded_t<T0, T1, Ts...> : T0, overloaded_t<T1, Ts...> {
    using T0::                     operator();
    using overloaded_t<T1, Ts...>::operator();
    overloaded_t(T0 t0, T1 t1, Ts... ts)
    : T0(std::move(t0)), overloaded_t<T1, Ts...>(std::move(t1), std::move(ts)...) {}
};

template <class... Ts>
overloaded_t<Ts...> overload(Ts... ts) {
    return {std::move(ts)...};
}

template <class... Ts>
struct vertex_overloaded : overloaded_t<Ts...> { // NOLINT
    vertex_overloaded(Ts... ts)                  // NOLINT
    : overloaded_t<Ts...>(std::move(ts)...) {}
    template <class T>
    auto operator()(T *ptr) {
        return this->overloaded_t<Ts...>::operator()(*ptr);
    }
};

template <class GraphT, class... Ts>
auto visit_vertex(typename GraphT::vertex_descriptor v, GraphT &g, Ts... args) { // NOLINT
    return cc::visit(vertex_overloaded<Ts...>{std::move(args)...}, value(v, g));
}

} // namespace cc
