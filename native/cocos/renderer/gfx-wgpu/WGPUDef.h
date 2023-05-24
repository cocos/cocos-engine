/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include <boost/preprocessor/variadic/to_seq.hpp>
#include <vector>
#include "../gfx-base/GFXDef-common.h"
#include "../gfx-base/GFXDef.h"

#ifdef CC_WGPU_WASM
    #define EXPORT_EMS(expr) expr
#else
    #define EXPORT_EMS(expr)
#endif

#ifdef CC_WGPU_DAWN
    #define EXPORT_DAWN(expr) expr
#else
    #define EXPORT_DAWN(expr)
#endif

#ifdef CC_WGPU_RS
    #define EXPORT_RS(expr) expr
#else
    #define EXPORT_RS(expr)
#endif

// https://github.com/emscripten-core/emscripten/issues/11070#issuecomment-717675128
namespace emscripten {

template <typename T, typename TWrapper = T>
std::vector<T> vecFromEMS(const val &vals) {
    uint32_t len = vals["length"].as<unsigned>();
    std::vector<T> res(len);
    const std::vector<val> Ts = vecFromJSArray<val>(vals);
    for (size_t i = 0; i < len; ++i) {
        const val &t = Ts[i];
        res[i] = static_cast<T>(t.as<TWrapper>(allow_raw_pointers()));
    }
    return res;
}

template <typename T, typename TWrapper = T>
val vecToEMS(const std::vector<T> &Ts) {
    auto arr = val::array();
    for (size_t i = 0; i < Ts.size(); ++i) {
        arr.set(i, TWrapper(Ts[i]));
    }
    return arr;
}

// template <typename T, typename std::enable_if<std::is_pointer<T>::value, bool>::type = true>
// std::vector<T> ptrVecFromEMS(const val& vals) {
//     uint32_t               len = vals["length"].as<unsigned>();
//     std::vector<T>         res(len);
//     const std::vector<val> Ts = vecFromJSArray<val>(vals);
//     for (size_t i = 0; i < len; ++i) {
//         const val& t = Ts[i];
//         t.as<Texture*>(emscripten::allow_raw_pointers());
//         res[i] = reinterpret_cast<T>(t.as<int>());
//     }
//     return res;
// }

template <typename T, typename std::enable_if<std::is_pointer<T>::value, bool>::type = true>
val ptrVecToEMS(const std::vector<T> &Ts) {
    auto arr = val::array();
    for (size_t i = 0; i < Ts.size(); ++i) {
        arr.set(i, Ts[i]);
    }
    return arr;
}

namespace internal {

// vector<T> -> [] & [] ->vector<T>
template <typename T, typename Allocator>
struct BindingType<std::vector<T, Allocator>> {
    using ValBinding = BindingType<val>;
    using WireType = ValBinding::WireType;

    static WireType toWireType(const std::vector<T, Allocator> &vec) {
        return ValBinding::toWireType(vecToEMS(vec));
    }

    static std::vector<T, Allocator> fromWireType(WireType value) {
        return vecFromJSArray<T>(ValBinding::fromWireType(value), allow_raw_pointers());
    }
};

template <typename T>
struct TypeID<T,
              typename std::enable_if_t<std::is_same<
                  typename Canonicalized<T>::type,
                  std::vector<typename Canonicalized<T>::type::value_type,
                              typename Canonicalized<T>::type::allocator_type>>::value>> {
    static constexpr TYPEID get() { return TypeID<val>::get(); }
};

} // namespace internal
} // namespace emscripten

template <typename T>
struct GenInstance {
    static T instance() {
        return T();
    }
};

template <class R, class T>
R getMemberType(R T::*);

#define MEMBER_TYPE(prop) decltype(getMemberType(prop))

template <typename T, typename U, typename V, typename FallBack = void>
struct Exporter {
    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert = false) {
        t.field(propName, field);
    }
};

template <typename T, typename U, typename V>
struct Exporter<T, U, V, typename std::enable_if<std::is_enum<U>::value>::type> {
    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert = false) {
        std::function<void(V & v, std::underlying_type_t<U> u)> set = [field](V &v, std::underlying_type_t<U> u) {
            v.*field = U{u};
        };
        std::function<std::underlying_type_t<U>(const V &v)> get = [field](const V &v) {
            return static_cast<std::underlying_type_t<U>>(v.*field);
        };
        t.field(propName, get, set);
    }
};

template <typename T, typename U, typename V>
struct Exporter<T, U, V, typename std::enable_if<std::is_pointer<U>::value>::type> {
    Exporter(T &t, const char *propName, U V::*field) {
        static_assert(!std::is_pointer<U>::value, "Export pointer with struct, try EXPORT_STRUCT_NPOD!");
    }

    Exporter(T &t, const char *propName, U V::*field, bool ignorePtrAssert) {
        t.field(propName, field);
    }
};

#define PROCESS_STRUCT_MEMBERS(r, struct_name, property) \
    { Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property); }

#define EXPORT_STRUCT_POD(struct_name, ...)                                                                \
    {                                                                                                      \
        auto obj = value_object<struct_name>(#struct_name);                                                \
        BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define PROCESS_STRUCT_MEMBERS_MAY_BE_PTR(r, struct_name, property) \
    { Exporter exporter(obj, BOOST_PP_STRINGIZE(property), &struct_name::property, true); }

#define EXPORT_STRUCT_NPOD(struct_name, ...)                                                                          \
    {                                                                                                                 \
        auto obj = value_object<struct_name>(#struct_name);                                                           \
        BOOST_PP_SEQ_FOR_EACH(PROCESS_STRUCT_MEMBERS_MAY_BE_PTR, struct_name, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define SPECIALIZE_PTR_FOR_STRUCT(r, _, TYPE)                                                                                                                       \
    template <>                                                                                                                                                     \
    struct emscripten::internal::TypeID<std::remove_cv<cc::gfx::TYPE>::type *, void> {                                                                              \
        static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<emscripten::internal::AllowedRawPointer<cc::gfx::TYPE>>::get(); } \
    };                                                                                                                                                              \
    template <>                                                                                                                                                     \
    struct emscripten::internal::TypeID<const std::remove_cv<cc::gfx::TYPE>::type *, void> {                                                                        \
        static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<emscripten::internal::AllowedRawPointer<cc::gfx::TYPE>>::get(); } \
    };

#define REGISTER_GFX_PTRS_FOR_STRUCT(...) \
    BOOST_PP_SEQ_FOR_EACH(SPECIALIZE_PTR_FOR_STRUCT, _, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

// specialize for void*
template <>
struct emscripten::internal::TypeID<void *, void> {
    static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<uintptr_t>::get(); }
};

template <typename T>
struct emscripten::internal::TypeID<T, typename std::enable_if<std::is_enum<T>::value>::type> {
    static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<typename std::underlying_type<T>::type>::get(); }
};

namespace cc::gfx {

using ::emscripten::allow_raw_pointers;
using ::emscripten::convertJSArrayToNumberVector;
using ::emscripten::val;

// template <typename T, typename std::enable_if<std::is_pointer<T>::value, bool>::type = true>
// std::vector<T> ptrVecFromEMS(const val& vals) {
//     uint32_t               len = vals["length"].as<unsigned>();
//     std::vector<T>         res(len);
//     const std::vector<val> Ts = vecFromJSArray<val>(vals);
//     for (size_t i = 0; i < len; ++i) {
//         const val& t = Ts[i];
//         t.as<Texture*>(emscripten::allow_raw_pointers());
//         res[i] = reinterpret_cast<T>(t.as<int>());
//     }
//     return res;
// }

template <typename T, typename EnumFallBack = void>
struct GetType {
    using type = T;
};

template <typename T>
struct GetType<T, typename std::enable_if<std::is_enum<T>::value>::type> {
    using type = typename std::underlying_type<T>::type;
};

} // namespace cc::gfx
