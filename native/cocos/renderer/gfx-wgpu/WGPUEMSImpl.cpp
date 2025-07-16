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

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <boost/preprocessor/cat.hpp>
#include <boost/preprocessor/seq/for_each.hpp>
#include <boost/preprocessor/stringize.hpp>
#include <boost/preprocessor/variadic/to_seq.hpp>
#include <vector>
#include "WGPUBuffer.h"
#include "WGPUCommandBuffer.h"
#include "WGPUDef.h"
#include "WGPUDescriptorSet.h"
#include "WGPUDescriptorSetLayout.h"
#include "WGPUDevice.h"
#include "WGPUFrameBuffer.h"
#include "WGPUInputAssembler.h"
#include "WGPUQueue.h"
#include "WGPURenderPass.h"
#include "WGPUSampler.h"
#include "WGPUShader.h"
#include "WGPUSwapchain.h"
#include "WGPUTexture.h"
#include "gfx-base/GFXDef-common.h"
#include "states/WGPUBufferBarrier.h"
#include "states/WGPUGeneralBarrier.h"
#include "states/WGPUTextureBarrier.h"
namespace cc::gfx {

using ::emscripten::allow_raw_pointers;
// using ::emscripten::convertJSArrayToNumberVector_local;
using ::emscripten::val;

#define CACHE_NAME(r, _, property) \
    const val BOOST_PP_CAT(property, _val){BOOST_PP_STRINGIZE(property)};

#define CACHE_EMS_VAL(...) \
    BOOST_PP_SEQ_FOR_EACH(CACHE_NAME, _, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__));

CACHE_EMS_VAL(length)

template <typename T>
std::vector<T> convertJSArrayToNumberVector_local(const val& v) {
    const size_t l = v[length_val].as<size_t>();

    std::vector<T> rv;
    rv.resize(l);

    // Copy the array into our vector through the use of typed arrays.
    // It will try to convert each element through Number().
    // See https://www.ecma-international.org/ecma-262/6.0/#sec-%typedarray%.prototype.set-array-offset
    // and https://www.ecma-international.org/ecma-262/6.0/#sec-tonumber
    val memoryView{emscripten::typed_memory_view(l, rv.data())};
    memoryView.call<void>("set", v);

    return rv;
}

template <typename T>
std::vector<T> vecFromJSArray_local(const val& v) {
    const size_t l = v[length_val].as<size_t>();

    std::vector<T> rv;
    rv.reserve(l);
    for (size_t i = 0; i < l; ++i) {
        rv.push_back(v[i].as<T>());
    }

    return rv;
}

#define UNREACHABLE_CONDITION CC_ABORT();

#define NUMARGS(...) (sizeof((int[]){__VA_ARGS__}) / sizeof(int))

#define ASSIGN_PROERTY_BY_SEQ(r, obj, property)                                                                                                         \
    if (!ems_##obj[BOOST_PP_CAT(property, _val)].isUndefined() && !ems_##obj[BOOST_PP_CAT(property, _val)].isNull()) {                                  \
        obj.property = decltype(obj.property){ems_##obj[BOOST_PP_CAT(property, _val)].as<GetType<decltype(obj.property)>::type>(allow_raw_pointers())}; \
    }

#define ASSIGN_FROM_EMS(obj, ...)                                                                 \
    {                                                                                             \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_PROERTY_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define SET_PROERTY_BY_SEQ(r, obj, property) \
    ems_##obj.set(BOOST_STRINGIZE(property), static_cast<GetType<decltype(obj.property)>::type>(obj.property));

#define SET_TO_EMS(obj, ...)                                                                   \
    {                                                                                          \
        BOOST_PP_SEQ_FOR_EACH(SET_PROERTY_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#define ASSIGN_VEC_BY_SEQ(r, obj, property) \
    obj.property = std::move(convertJSArrayToNumberVector_local<decltype(obj.property)::value_type>(ems_##obj[#property]));

#define ASSIGN_FROM_EMSARRAY(obj, ...)                                                        \
    {                                                                                         \
        BOOST_PP_SEQ_FOR_EACH(ASSIGN_VEC_BY_SEQ, obj, BOOST_PP_VARIADIC_TO_SEQ(__VA_ARGS__)); \
    }

#ifdef CC_DEBUG
    #define CHECK_VOID(v)                    \
        if (v.isUndefined() || v.isNull()) { \
            return;                          \
        }

    #define CHECK_PTR(v)                     \
        if (v.isUndefined() || v.isNull()) { \
            return nullptr;                  \
        }
#else
    #define CHECK_VOID(v)
    #define CHECK_PTR(v)
#endif

#define EMSArraysToU8Vec(v, i) (convertJSArrayToNumberVector_local<uint8_t>(v[i]))

void CCWGPUCommandBuffer::updateBuffer(Buffer* buff, const emscripten::val& v, uint32_t size) {
    ccstd::vector<uint8_t> buffer = convertJSArrayToNumberVector_local<uint8_t>(v);
    updateBuffer(buff, reinterpret_cast<const void*>(buffer.data()), size);
}

void CCWGPUBuffer::update(const val& v, uint32_t size) {
    // this is the most fastest way from js array to vector now
    ccstd::vector<uint8_t> buffer = convertJSArrayToNumberVector_local<uint8_t>(v);
    update(reinterpret_cast<const void*>(buffer.data()), size);
}

void CCWGPUDevice::copyTextureToBuffers(Texture* src, const emscripten::val& buffers, const emscripten::val& regions) {
    // @hana-alice
}

void CCWGPUDevice::copyBuffersToTexture(const emscripten::val& v, Texture* dst, const std::vector<BufferTextureCopy>& regions) {
    CHECK_VOID(v);
    auto len = v[length_val].as<unsigned>();
    len = v[length_val].as<unsigned>();
    std::vector<std::vector<uint8_t>> lifeProlonger(len);
    std::vector<const uint8_t*> buffers;
    for (size_t i = 0; i < len; i++) {
        lifeProlonger[i] = EMSArraysToU8Vec(v, i);
        buffers.push_back(lifeProlonger[i].data());
    }

    return copyBuffersToTexture(buffers.data(), dst, regions.data(), regions.size());
}

void CCWGPUShader::reflectBinding(const emscripten::val &vals) {
    const std::vector<uint8_t>& bindings = convertJSArrayToNumberVector<uint8_t>(vals);
    _gpuShaderObject->bindings.emplace_back(bindings);
}

} // namespace cc::gfx
