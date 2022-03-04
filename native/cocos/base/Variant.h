/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.
 
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

#pragma once

#ifdef USE_CXX_17

    #include <variant>

namespace cc {
template <class... T>
using variant = std::variant<T...>;

using monostate = std::monostate;

template <class U, class... T>
inline constexpr bool holds_alternative(variant<T...> const &v) noexcept {
    return std::holds_alternative<U, T...>(v);
}

// get_if

template <std::size_t I, class... T>
inline constexpr typename std::add_pointer<std::variant_alternative_t<I, variant<T...>>>::type get_if(variant<T...> *v) noexcept {
    return std::get_if<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr typename std::add_pointer<const std::variant_alternative_t<I, variant<T...>>>::type get_if(variant<T...> const *v) noexcept {
    return std::get_if<I, T...>(v);
}

template <class U, class... T>
inline constexpr typename std::add_pointer<U>::type get_if(variant<T...> *v) noexcept {
    return std::get_if<U, T...>(v);
}

template <class U, class... T>
inline constexpr typename std::add_pointer<U const>::type get_if(variant<T...> const *v) noexcept {
    return std::get_if<U, T...>(v);
}

// get (index)

template <std::size_t I, class... T>
inline constexpr std::variant_alternative_t<I, variant<T...>> &get(variant<T...> &v) {
    return std::get<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr std::variant_alternative_t<I, variant<T...>> &&get(variant<T...> &&v) {
    return std::get<I, T...>(std::forward<variant<T...>>(v));
}

template <std::size_t I, class... T>
inline constexpr std::variant_alternative_t<I, variant<T...>> const &get(variant<T...> const &v) {
    return std::get<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr std::variant_alternative_t<I, variant<T...>> const &&get(variant<T...> const &&v) {
    return std::get<I, T...>(v);
}

// get (type)

template <class U, class... T>
inline constexpr U &get(variant<T...> &v) {
    return std::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U &&get(variant<T...> &&v) {
    return std::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U const &get(variant<T...> const &v) {
    return std::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U const &&get(variant<T...> const &&v) {
    return std::get<U, T...>(v);
}

// visit

template <class _Visitor, class... _Vs>
inline constexpr decltype(auto) visit(_Visitor &&__visitor, _Vs &&...__vs) {
    return std::visit(std::forward<_Visitor>(__visitor), std::forward<_Vs>(__vs)...);
}

}; // namespace cc

#else

    #include "boost/variant2/variant.hpp"

namespace cc {
template <class... T>
using variant = boost::variant2::variant<T...>;

using monostate = boost::variant2::monostate;

template <class U, class... T>
inline constexpr bool holds_alternative(variant<T...> const &v) noexcept { // NOLINT // use std style
    return boost::variant2::holds_alternative<U, T...>(v);
}

// get_if

template <std::size_t I, class... T>
inline constexpr typename std::add_pointer<boost::variant2::variant_alternative_t<I, variant<T...>>>::type get_if(variant<T...> *v) noexcept { // NOLINT // use std style
    return boost::variant2::get_if<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr typename std::add_pointer<const boost::variant2::variant_alternative_t<I, variant<T...>>>::type get_if(variant<T...> const *v) noexcept { // NOLINT // use std style
    return boost::variant2::get_if<I, T...>(v);
}

template <class U, class... T>
inline constexpr typename std::add_pointer<U>::type get_if(variant<T...> *v) noexcept { // NOLINT // use std style
    return boost::variant2::get_if<U, T...>(v);
}

template <class U, class... T>
inline constexpr typename std::add_pointer<U const>::type get_if(variant<T...> const *v) noexcept { // NOLINT // use std style
    return boost::variant2::get_if<U, T...>(v);
}

// get (index)

template <std::size_t I, class... T>
inline constexpr boost::variant2::variant_alternative_t<I, variant<T...>> &get(variant<T...> &v) {
    return boost::variant2::get<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr boost::variant2::variant_alternative_t<I, variant<T...>> &&get(variant<T...> &&v) {
    return boost::variant2::get<I, T...>(std::forward<variant<T...>>(v));
}

template <std::size_t I, class... T>
inline constexpr boost::variant2::variant_alternative_t<I, variant<T...>> const &get(variant<T...> const &v) {
    return boost::variant2::get<I, T...>(v);
}

template <std::size_t I, class... T>
inline constexpr boost::variant2::variant_alternative_t<I, variant<T...>> const &&get(variant<T...> const &&v) {
    return boost::variant2::get<I, T...>(v);
}

// get (type)

template <class U, class... T>
inline constexpr U &get(variant<T...> &v) {
    return boost::variant2::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U &&get(variant<T...> &&v) {
    return boost::variant2::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U const &get(variant<T...> const &v) {
    return boost::variant2::get<U, T...>(v);
}

template <class U, class... T>
inline constexpr U const &&get(variant<T...> const &&v) {
    return boost::variant2::get<U, T...>(v);
}

// visit

template <class R = boost::variant2::detail::deduced, class F, class V1>
inline constexpr auto visit(F &&f, V1 &&v1) -> boost::variant2::detail::Vret<R, F, V1> {
    return boost::variant2::visit<R, F, V1>(std::forward<F>(f), std::forward<V1>(v1));
}

template <class R = boost::variant2::detail::deduced, class F, class V1, class V2, class... V>
inline constexpr auto visit(F &&f, V1 &&v1, V2 &&v2, V &&...v) -> boost::variant2::detail::Vret<R, F, V1, V2, V...> {
    return boost::variant2::visit<R, F, V1, V2, V...>(std::forward<F>(f), std::forward<V1>(v1), std::forward<V2>(v2), std::forward<V>(v)...);
}

}; // namespace cc
#endif
