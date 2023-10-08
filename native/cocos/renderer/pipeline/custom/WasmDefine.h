#pragma once

#include <emscripten/bind.h>
#include <boost/container/pmr/polymorphic_allocator.hpp>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include <boost/preprocessor/variadic/to_seq.hpp>

template <typename T>
T cloneCustom(const T& v) {
    return T{v, boost::container::pmr::get_default_resource()};
}

template <typename Inst>
Inst creator() {
    return Inst{boost::container::pmr::get_default_resource()};
}

template <typename T>
void assignVal(T& to, const T& from) {
    to = from;
};

template <typename T>
emscripten::val toEMS(const T& vals) {
    return emscripten::val::object();
}

template <typename T>
T fromEMS(const emscripten::val& vals);

#define SPECIALIZE_PTR_FOR_STRUCT(r, _, TYPE)                                            \
    namespace emscripten::internal {                                                     \
    template <>                                                                          \
    struct TypeID<std::remove_cv<TYPE>::type*, void> {                                   \
        static constexpr TYPEID get() { return TypeID<AllowedRawPointer<TYPE>>::get(); } \
    };                                                                                   \
    template <>                                                                          \
    struct TypeID<const std::remove_cv<TYPE>::type*, void> {                             \
        static constexpr TYPEID get() { return TypeID<AllowedRawPointer<TYPE>>::get(); } \
    };                                                                                   \
    }

#define REGISTER_PTRS(...) \
    BOOST_PP_SEQ_FOR_EACH(SPECIALIZE_PTR_FOR_STRUCT, _, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

// specialize for void*
template <>
struct emscripten::internal::TypeID<void*, void> {
    static constexpr emscripten::internal::TYPEID get() { return emscripten::internal::TypeID<uintptr_t>::get(); }
};
