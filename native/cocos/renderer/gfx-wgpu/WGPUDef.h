#pragma once
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include <vector>
#include "../gfx-base/GFXDef-common.h"
#include "../gfx-base/GFXDef.h"
/*
value_object<PipelineLayoutInfo>("PipelineLayoutInfo")
    .field("setLayouts", &PipelineLayoutInfo::setLayouts);
function("PipelineLayoutInfo", &GenInstance<PipelineLayoutInfo>::instance);
*/
#define CC_OBJECT(NAME) \
    explicit operator const gfx::NAME() const { return obj; }
#define CTOR_FROM_CCOBJECT(NAME) \
    NAME(const gfx::NAME& other) : obj(other){};

#define ENUMTYPE(ENUMNAME) \
    std::underlying_type<gfx::ENUMNAME>::type;

#define EXPORT_ENUMFIELD_BY_SEQ(r, ENUMNAME, FIELD) \
    static constexpr ENUMTYPE(ENUMNAME) FIELD = static_cast<ENUMTYPE(ENUMNAME)>(gfx::ENUMNAME::FILED);

#define EXPORT_ENUM(ENUMNAME, ...)                                                                       \
    class ENUMNAME {                                                                                     \
    public:                                                                                              \
        ENUMNAME() = delete;                                                                             \
        using type = std::underlying_type<gfx::ENUMNAME>::type;                                          \
        BOOST_PP_SEQ_FOR_EACH(EXPORT_ENUMFIELD_BY_SEQ, ENUMNAME, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

namespace cc::gfx::ems {

using ::emscripten::allow_raw_pointers;
using ::emscripten::convertJSArrayToNumberVector;
using ::emscripten::val;

using String = ccstd::string;

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

template <typename T, typename TWrapper = T>
std::vector<T> vecFromEMS(const val& vals) {
    uint32_t len = vals["length"].as<unsigned>();
    std::vector<T> res(len);
    const std::vector<val> Ts = vecFromJSArray<val>(vals);
    for (size_t i = 0; i < len; ++i) {
        const val& t = Ts[i];
        res[i] = static_cast<T>(t.as<TWrapper>(allow_raw_pointers()));
    }
    return res;
}

template <typename T, typename TWrapper = T>
val vecToEMS(const std::vector<T>& Ts) {
    auto arr = val::array();
    for (size_t i = 0; i < Ts.size(); ++i) {
        arr.set(i, TWrapper(Ts[i]));
    }
    return arr;
}

/*--------------------------------------------------------------------------------------------*/
// struct with pointers, getter setter template function should be visible here

// EMSCRIPTEN_BINDINGS(WEBGPU_DEVICE_WASM_EXPORT) {

// }

/*--------------------------------------------------------------------------------------------*/

} // namespace cc::gfx::ems
