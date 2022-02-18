#pragma once
#include <cocos/base/Variant.h>
#include <boost/mp11/algorithm.hpp>
#include <type_traits>
#include <utility>

namespace cc {

// https://stackoverflow.com/questions/50510122/stdvariant-with-overloaded-lambdas-alternative-with-msvc

template <class... Ts>
struct Overloaded {}; // NOLINT

template <class T0>
struct Overloaded<T0> : T0 {
    using T0::operator();
    Overloaded(T0 t0) // NOLINT
    : T0(std::move(t0)) {}
};

template <class T0, class T1, class... Ts>
struct Overloaded<T0, T1, Ts...> : T0, Overloaded<T1, Ts...> {
    using T0::                     operator();
    using Overloaded<T1, Ts...>::operator();
    Overloaded(T0 t0, T1 t1, Ts... ts)
    : T0(std::move(t0)), Overloaded<T1, Ts...>(std::move(t1), std::move(ts)...) {}
};

template <class... Ts>
Overloaded<Ts...> overload(Ts... ts) {
    return {std::move(ts)...};
}

template <typename V>
auto variantFromIndex(size_t index) -> V { // NOLINT
    return boost::mp11::mp_with_index<boost::mp11::mp_size<V>>(index,
        [](auto i) { return V(boost::variant2::in_place_index<i>); });
}

} // namespace cc
