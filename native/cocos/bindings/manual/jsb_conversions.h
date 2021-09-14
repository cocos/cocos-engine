/****************************************************************************
 Copyright (c) 2017-2021 Xiamen Yaji Software Co., Ltd.

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

#include <cassert>
#include <cstdint>
#include <type_traits>
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_classtype.h"
#include "cocos/base/Map.h"
#include "cocos/base/Vector.h"
#include "cocos/math/Geometry.h"
#include "cocos/math/Quaternion.h"
#include "cocos/math/Vec2.h"
#include "cocos/math/Vec3.h"
#include "extensions/cocos-ext.h"
#include "network/Downloader.h"

#if USE_SPINE
    #include "cocos/editor-support/spine-creator-support/spine-cocos2dx.h"
#endif

namespace cc {
namespace gfx {
struct Rect;
struct Viewport;
struct Color;
struct Offset;
struct Extent;
struct TextureSubres;
struct TextureCopy;
struct BufferTextureCopy;
struct BufferInfo;
struct BufferViewInfo;
struct TextureInfo;
struct DescriptorSetInfo;
struct BindingMappingInfo;
struct ShaderStage;
struct UniformSampler;
struct UniformBlock;
struct Uniform;
struct ShaderInfo;
struct DrawInfo;
struct IndirectBuffer;
struct SamplerInfo;
struct ColorAttachment;
struct DepthStencilAttachment;
struct SubPassInfo;
struct RenderPassInfo;
struct QueueInfo;
struct PipelineLayoutInfo;
struct DescriptorSetLayoutBinding;
struct DescriptorSetLayoutInfo;
struct FramebufferInfo;
struct CommandBufferInfo;
struct InputAssemblerInfo;
} // namespace gfx
} // namespace cc

//#include "Box2D/Box2D.h"

#define SE_PRECONDITION2_VOID(condition, ...)                                                           \
    do {                                                                                                \
        if (!(condition)) {                                                                             \
            SE_LOGE("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            SE_LOGE(__VA_ARGS__);                                                                       \
            return;                                                                                     \
        }                                                                                               \
    } while (0)

#define SE_PRECONDITION2(condition, ret_value, ...)                                                     \
    do {                                                                                                \
        if (!(condition)) {                                                                             \
            SE_LOGE("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            SE_LOGE(__VA_ARGS__);                                                                       \
            return (ret_value);                                                                         \
        }                                                                                               \
    } while (0)

#define SE_PRECONDITION3(condition, ret_value, failed_code) \
    do {                                                    \
        if (!(condition)) {                                 \
            failed_code;                                    \
            return (ret_value);                             \
        }                                                   \
    } while (0)

#define SE_PRECONDITION4(condition, ret_value, errorCode)                                               \
    do {                                                                                                \
        if (!(condition)) {                                                                             \
            SE_LOGE("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            __glErrorCode = errorCode;                                                                  \
            return (ret_value);                                                                         \
        }                                                                                               \
    } while (0)

#define SE_PRECONDITION_ERROR_BREAK(condition, ...)                                                 \
    if (!(condition)) {                                                                             \
        SE_LOGE("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
        SE_LOGE(__VA_ARGS__);                                                                       \
        break;                                                                                      \
    }

#if CC_ENABLE_CACHE_JSB_FUNC_RESULT
    #define SE_HOLD_RETURN_VALUE(retCXXValue, thisObject, jsValue)                       \
        if (is_jsb_object_v<typename std::decay<decltype(retCXXValue)>::type>) {         \
            (thisObject)->setProperty(std::string("__cache") + __FUNCTION__, (jsValue)); \
        }
#else
    #define SE_HOLD_RETURN_VALUE(...)
#endif

#if __clang__
    #if defined(__has_feature) && __has_feature(cxx_static_assert) && __has_feature(cxx_relaxed_constexpr)
        #define HAS_CONSTEXPR 1
    #else
        #define HAS_CONSTEXPR 0
    #endif
#elif defined(_MSVC_LANG) && _MSVC_LANG >= 201703L
    #define HAS_CONSTEXPR 1
#else
    #define HAS_CONSTEXPR 0
#endif

#if HAS_CONSTEXPR
    #define CC_STATIC_ASSERT static_assert
    #define CC_CONSTEXPR     constexpr
#else
    #define CC_CONSTEXPR
    #define CC_STATIC_ASSERT(cond, msg) assert(cond)
#endif

#if __clang__
    #pragma clang diagnostic push
    #pragma clang diagnostic ignored "-Wc++17-extensions"
#endif

// se value -> native value
bool seval_to_int32(const se::Value &v, int32_t *ret);                                   // NOLINT(readability-identifier-naming)
bool seval_to_uint32(const se::Value &v, uint32_t *ret);                                 // NOLINT(readability-identifier-naming)
bool seval_to_int8(const se::Value &v, int8_t *ret);                                     // NOLINT(readability-identifier-naming)
bool seval_to_uint8(const se::Value &v, uint8_t *ret);                                   // NOLINT(readability-identifier-naming)
bool seval_to_int16(const se::Value &v, int16_t *ret);                                   // NOLINT(readability-identifier-naming)
bool seval_to_uint16(const se::Value &v, uint16_t *ret);                                 // NOLINT(readability-identifier-naming)
bool seval_to_boolean(const se::Value &v, bool *ret);                                    // NOLINT(readability-identifier-naming)
bool seval_to_float(const se::Value &v, float *ret);                                     // NOLINT(readability-identifier-naming)
bool seval_to_double(const se::Value &v, double *ret);                                   // NOLINT(readability-identifier-naming)
bool seval_to_size(const se::Value &v, size_t *ret);                                     // NOLINT(readability-identifier-naming)
bool seval_to_std_string(const se::Value &v, std::string *ret);                          // NOLINT(readability-identifier-naming)
bool seval_to_Vec2(const se::Value &v, cc::Vec2 *pt);                                    // NOLINT(readability-identifier-naming)
bool seval_to_Vec3(const se::Value &v, cc::Vec3 *pt);                                    // NOLINT(readability-identifier-naming)
bool seval_to_Vec4(const se::Value &v, cc::Vec4 *pt);                                    // NOLINT(readability-identifier-naming)
bool seval_to_Mat4(const se::Value &v, cc::Mat4 *mat);                                   // NOLINT(readability-identifier-naming)
bool seval_to_Size(const se::Value &v, cc::Size *size);                                  // NOLINT(readability-identifier-naming)
bool seval_to_ccvalue(const se::Value &v, cc::Value *ret);                               // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluemap(const se::Value &v, cc::ValueMap *ret);                         // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluemapintkey(const se::Value &v, cc::ValueMapIntKey *ret);             // NOLINT(readability-identifier-naming)
bool seval_to_ccvaluevector(const se::Value &v, cc::ValueVector *ret);                   // NOLINT(readability-identifier-naming)
bool sevals_variadic_to_ccvaluevector(const se::ValueArray &args, cc::ValueVector *ret); // NOLINT(readability-identifier-naming)
bool seval_to_std_vector_string(const se::Value &v, std::vector<std::string> *ret);      // NOLINT(readability-identifier-naming)
bool seval_to_std_vector_int(const se::Value &v, std::vector<int> *ret);                 // NOLINT(readability-identifier-naming)
bool seval_to_std_vector_uint16(const se::Value &v, std::vector<uint16_t> *ret);         // NOLINT(readability-identifier-naming)
bool seval_to_std_vector_float(const se::Value &v, std::vector<float> *ret);             // NOLINT(readability-identifier-naming)
bool seval_to_std_vector_Vec2(const se::Value &v, std::vector<cc::Vec2> *ret);           // NOLINT(readability-identifier-naming)
bool seval_to_Uint8Array(const se::Value &v, uint8_t *ret);                              // NOLINT(readability-identifier-naming)
bool seval_to_uintptr_t(const se::Value &v, uintptr_t *ret);                             // NOLINT(readability-identifier-naming)

bool seval_to_std_map_string_string(const se::Value &v, std::map<std::string, std::string> *ret); // NOLINT(readability-identifier-naming)
bool seval_to_Data(const se::Value &v, cc::Data *ret);                                            // NOLINT(readability-identifier-naming)
bool seval_to_DownloaderHints(const se::Value &v, cc::network::DownloaderHints *ret);             // NOLINT(readability-identifier-naming)

template <typename T>
bool seval_to_native_ptr(const se::Value &v, T *ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);

    if (v.isObject()) {
        T ptr = static_cast<T>(v.toObject()->getPrivateData());
        if (ptr == nullptr) {
            // This should never happen, return 'false' to mark the conversion fails.
            *ret = nullptr;
            return false;
        }

        *ret = ptr;
        return true;
    }
    if (v.isNullOrUndefined()) {
        // If js value is null or undefined, the convertion should be successful.
        // So we should return 'true' to indicate the convertion succeeds and mark
        // the out value to 'nullptr'.
        *ret = nullptr;
        return true;
    }

    // If js value isn't null, undefined and Object, mark the convertion fails.
    *ret = nullptr;
    return false;
}

template <typename T>
typename std::enable_if<std::is_class<T>::value && !std::is_same<T, std::string>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isObject()) {
        ok = false;
        return T();
    }
    T *nativeObj = static_cast<T *>(v.toObject()->getPrivateData());
    ok           = true;
    return *nativeObj;
}
template <typename T>
typename std::enable_if<std::is_integral<T>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isNumber()) {
        ok = false;
        return 0;
    }
    ok = true;
    return v.toInt32();
}

template <typename T>
typename std::enable_if<std::is_enum<T>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isNumber()) {
        ok = false;
        return static_cast<T>(0);
    }
    ok = true;
    return static_cast<T>(v.toInt32());
}

template <typename T>
typename std::enable_if<std::is_floating_point<T>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isNumber()) {
        ok = false;
        return 0;
    }
    ok = true;
    return v.toFloat();
}

template <typename T>
typename std::enable_if<std::is_same<T, std::string>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isString()) {
        ok = false;
        return "";
    }
    ok = true;
    return v.toString();
}

template <typename T>
typename std::enable_if<std::is_pointer<T>::value && std::is_class<typename std::remove_pointer<T>::type>::value, bool>::type
seval_to_std_vector(const se::Value &v, std::vector<T> *ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    assert(v.isObject());
    se::Object *obj = v.toObject();
    assert(obj->isArray());

    bool     ok  = true;
    uint32_t len = 0;
    ok           = obj->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    ret->resize(len);

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = obj->getArrayElement(i, &tmp);
        if (!ok) {
            ret->clear();
            return false;
        }

        if (tmp.isObject()) {
            T nativeObj = static_cast<T>(tmp.toObject()->getPrivateData());
            (*ret)[i]   = nativeObj;
        } else if (tmp.isNullOrUndefined()) {
            (*ret)[i] = nullptr;
        } else {
            ret->clear();
            return false;
        }
    }

    return true;
}

template <typename T>
typename std::enable_if<!std::is_pointer<T>::value, bool>::type
seval_to_std_vector(const se::Value &v, std::vector<T> *ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    assert(v.isObject());
    se::Object *obj = v.toObject();
    assert(obj->isArray());

    bool     ok  = true;
    uint32_t len = 0;
    ok           = obj->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    ret->resize(len);

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = obj->getArrayElement(i, &tmp);
        if (!ok) {
            ret->clear();
            return false;
        }
        (*ret)[i] = seval_to_type<T>(tmp, ok);
        if (!ok) {
            return false;
        }
    }

    return true;
}

template <typename T>
bool seval_to_Map_string_key(const se::Value &v, cc::Map<std::string, T> *ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    assert(v.isObject());
    se::Object *obj = v.toObject();

    std::vector<std::string> allKeys;
    bool                     ok = obj->getAllKeys(&allKeys);
    if (!ok) {
        ret->clear();
        return false;
    }

    se::Value tmp;
    for (const auto &key : allKeys) {
        ok = obj->getProperty(key.c_str(), &tmp);
        if (!ok || !tmp.isObject()) {
            ret->clear();
            return false;
        }

        T nativeObj = static_cast<T>(tmp.toObject()->getPrivateData());
        ret->insert(key, nativeObj);
    }

    return true;
}

// native value -> se value
bool int8_to_seval(int8_t v, se::Value *ret);                   // NOLINT(readability-identifier-naming)
bool uint8_to_seval(uint8_t v, se::Value *ret);                 // NOLINT(readability-identifier-naming)
bool int32_to_seval(int32_t v, se::Value *ret);                 // NOLINT(readability-identifier-naming)
bool uint32_to_seval(uint32_t v, se::Value *ret);               // NOLINT(readability-identifier-naming)
bool int16_to_seval(uint16_t v, se::Value *ret);                // NOLINT(readability-identifier-naming)
bool uint16_to_seval(uint16_t v, se::Value *ret);               // NOLINT(readability-identifier-naming)
bool boolean_to_seval(bool v, se::Value *ret);                  // NOLINT(readability-identifier-naming)
bool float_to_seval(float v, se::Value *ret);                   // NOLINT(readability-identifier-naming)
bool double_to_seval(double v, se::Value *ret);                 // NOLINT(readability-identifier-naming)
bool long_to_seval(long v, se::Value *ret);                     // NOLINT(readability-identifier-naming)
bool ulong_to_seval(unsigned long v, se::Value *ret);           // NOLINT(readability-identifier-naming)
bool longlong_to_seval(long long v, se::Value *ret);            // NOLINT(readability-identifier-naming)
bool uintptr_t_to_seval(uintptr_t v, se::Value *ret);           // NOLINT(readability-identifier-naming)
bool size_to_seval(size_t v, se::Value *ret);                   // NOLINT(readability-identifier-naming)
bool std_string_to_seval(const std::string &v, se::Value *ret); // NOLINT(readability-identifier-naming)

bool Vec2_to_seval(const cc::Vec2 &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool Vec3_to_seval(const cc::Vec3 &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool Vec4_to_seval(const cc::Vec4 &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool Mat4_to_seval(const cc::Mat4 &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool Size_to_seval(const cc::Size &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool Rect_to_seval(const cc::Rect &v, se::Value *ret);                                            // NOLINT(readability-identifier-naming)
bool ccvalue_to_seval(const cc::Value &v, se::Value *ret);                                        // NOLINT(readability-identifier-naming)
bool ccvaluemap_to_seval(const cc::ValueMap &v, se::Value *ret);                                  // NOLINT(readability-identifier-naming)
bool ccvaluemapintkey_to_seval(const cc::ValueMapIntKey &v, se::Value *ret);                      // NOLINT(readability-identifier-naming)
bool ccvaluevector_to_seval(const cc::ValueVector &v, se::Value *ret);                            // NOLINT(readability-identifier-naming)
bool std_vector_string_to_seval(const std::vector<std::string> &v, se::Value *ret);               // NOLINT(readability-identifier-naming)
bool std_vector_int_to_seval(const std::vector<int> &v, se::Value *ret);                          // NOLINT(readability-identifier-naming)
bool std_vector_uint16_to_seval(const std::vector<uint16_t> &v, se::Value *ret);                  // NOLINT(readability-identifier-naming)
bool std_vector_float_to_seval(const std::vector<float> &v, se::Value *ret);                      // NOLINT(readability-identifier-naming)
bool std_map_string_string_to_seval(const std::map<std::string, std::string> &v, se::Value *ret); // NOLINT(readability-identifier-naming)

bool ManifestAsset_to_seval(const cc::extension::ManifestAsset &v, se::Value *ret); // NOLINT(readability-identifier-naming)
bool Data_to_seval(const cc::Data &v, se::Value *ret);                              // NOLINT(readability-identifier-naming)
bool DownloadTask_to_seval(const cc::network::DownloadTask &v, se::Value *ret);     // NOLINT(readability-identifier-naming)

// TODO(minggo): should add these functions if only bind gfx.
// gfx_color_attachment_to_seval
// gfx_depth_stecil_attachment_to_seval
// sub_pass_info_to_seval

#if USE_GFX_RENDERER
#endif

template <typename T>
typename std::enable_if<!std::is_base_of<cc::Ref, T>::value, bool>::type
native_ptr_to_seval(T *v_c, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v      = const_cast<DecayT *>(v_c);
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
        // CC_LOG_DEBUGWARN("WARNING: non-Ref type: (%s) isn't catched!", typeid(*v).name());
        se::Class *cls = JSBClassType::findClass<T>(v);
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

//handle reference
template <typename T>
typename std::enable_if<!std::is_base_of<cc::Ref, T>::value && !std::is_pointer<T>::value, bool>::type
native_ptr_to_seval(T &v_ref, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<decltype(v_ref)>::type>::type;
    auto *v      = const_cast<DecayT *>(&v_ref);

    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
        // CC_LOG_DEBUGWARN("WARNING: non-Ref type: (%s) isn't catched!", typeid(*v).name());
        se::Class *cls = JSBClassType::findClass<DecayT>(v);
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

template <typename T>
bool native_ptr_to_rooted_seval( // NOLINT(readability-identifier-naming)
    typename std::enable_if<!std::is_base_of<cc::Ref, T>::value, T>::type *v,
    se::Value *ret, bool *isReturnCachedValue = nullptr) {
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(reinterpret_cast<void *>(v));
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
        se::Class *cls = JSBClassType::findClass<T>(v);
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        obj->root();
        obj->setPrivateData(reinterpret_cast<void *>(v));

        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
        // CC_LOG_DEBUGWARN("WARNING: non-Ref type: (%s) isn't catched!", typeid(*v).name());
    } else {
        obj = iter->second;
        assert(obj->isRooted());
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        // CC_LOG_DEBUG("return cached object: %s, se::Object:%p, native: %p", typeid(*v).name(), obj, v);
    }

    ret->setObject(obj);
    return true;
}

template <typename T>
typename std::enable_if<!std::is_base_of<cc::Ref, T>::value, bool>::type
native_ptr_to_seval(T *vp, se::Class *cls, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v      = const_cast<DecayT *>(vp);
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
                                                   //        CC_LOG_DEBUGWARN("WARNING: Ref type: (%s) isn't catched!", typeid(*v).name());
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);

        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

//handle ref
template <typename T>
typename std::enable_if<!std::is_base_of<cc::Ref, T>::value, bool>::type
native_ptr_to_seval(T &v_ref, se::Class *cls, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<decltype(v_ref)>::type>::type;
    auto *v      = const_cast<DecayT *>(&v_ref);

    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
        //        CC_LOG_DEBUGWARN("WARNING: Ref type: (%s) isn't catched!", typeid(*v).name());
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);

        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

template <typename T>
bool native_ptr_to_rooted_seval( // NOLINT(readability-identifier-naming)
    typename std::enable_if<!std::is_base_of<cc::Ref, T>::value, T>::type *v,
    se::Class *cls, se::Value *ret, bool *isReturnCachedValue = nullptr) {
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        obj->root();
        obj->setPrivateData(v);

        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
        // CC_LOG_DEBUGWARN("WARNING: non-Ref type: (%s) isn't catched, se::Object:%p, native: %p", typeid(*v).name(), obj, v);
    } else {
        obj = iter->second;
        assert(obj->isRooted());
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        // CC_LOG_DEBUG("return cached object: %s, se::Object:%p, native: %p", typeid(*v).name(), obj, v);
    }

    ret->setObject(obj);
    return true;
}

template <typename T>
typename std::enable_if<std::is_base_of<cc::Ref, T>::value, bool>::type
native_ptr_to_seval(T *vp, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v      = const_cast<DecayT *>(vp);
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
                                                   //        CC_LOG_DEBUGWARN("WARNING: Ref type: (%s) isn't catched!", typeid(*v).name());
        se::Class *cls = JSBClassType::findClass<T>(v);
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);
        v->retain(); // Retain the native object to unify the logic in finalize method of js object.
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        //        CC_LOG_DEBUG("INFO: Found Ref type: (%s, native: %p, se: %p) from cache!", typeid(*v).name(), v, obj);
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

template <typename T>
typename std::enable_if<std::is_base_of<cc::Ref, T>::value, bool>::type
native_ptr_to_seval(T *vp, se::Class *cls, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v      = const_cast<DecayT *>(vp);
    assert(ret != nullptr);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Object *obj  = nullptr;
    auto        iter = se::NativePtrToObjectMap::find(v);
    if (iter == se::NativePtrToObjectMap::end()) { // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
                                                   //        CC_LOG_DEBUGWARN("WARNING: Ref type: (%s) isn't catched!", typeid(*v).name());
        assert(cls != nullptr);
        obj = se::Object::createObjectWithClass(cls);
        ret->setObject(obj, true);
        obj->setPrivateData(v);
        v->retain(); // Retain the native object to unify the logic in finalize method of js object.
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = false;
        }
    } else {
        obj = iter->second;
        if (isReturnCachedValue != nullptr) {
            *isReturnCachedValue = true;
        }
        ret->setObject(obj);
    }

    return true;
}

template <typename T>
bool std_vector_to_seval(const std::vector<T> &v, se::Value *ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    bool             ok = true;
    se::HandleObject obj(se::Object::createArrayObject(v.size()));

    uint32_t  i = 0;
    se::Value tmp;
    for (const auto &e : v) {
        native_ptr_to_seval(e, &tmp);
        obj->setArrayElement(i, tmp);
        ++i;
    }

    ret->setObject(obj, true);

    return ok;
}

template <typename T>
bool seval_to_reference(const se::Value &v, T **ret) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    assert(v.isObject());
    *ret = static_cast<T *>(v.toObject()->getPrivateData());
    return true;
}

/////////////////////////////////// helpers //////////////////////////////////////////////////////////

////////////////////////// is jsb object ///////////////////////////

template <typename T>
struct is_jsb_object : std::false_type {}; // NOLINT(readability-identifier-naming)

template <typename T>
constexpr bool is_jsb_object_v = is_jsb_object<typename std::remove_const<T>::type>::value; // NOLINT(readability-identifier-naming)

#define JSB_REGISTER_OBJECT_TYPE(T) \
    template <>                     \
    struct is_jsb_object<T> : std::true_type {}

template <typename Out, typename In>
constexpr inline typename std::enable_if<std::is_same<Out, In>::value, Out>::type &
holder_convert_to(In &input) { // NOLINT(readability-identifier-naming)
    return input;
}

template <typename Out, typename In>
constexpr inline typename std::enable_if<std::is_pointer<Out>::value && std::is_same<Out, typename std::add_pointer<In>::type>::value, Out>::type &
holder_convert_to(In &input) { // NOLINT(readability-identifier-naming)
    return static_cast<Out>(&input);
}

template <typename Out, typename In>
constexpr inline typename std::enable_if<std::is_pointer<In>::value && std::is_same<Out, typename std::remove_pointer<In>::type>::value, Out>::type &
holder_convert_to(In &input) { // NOLINT(readability-identifier-naming)
    return *input;
}

template <typename T, bool is_reference>
struct HolderType {
    using type       = typename std::remove_const<T>::type;
    using local_type = typename std::conditional_t<is_reference && is_jsb_object_v<T>, std::add_pointer_t<type>, type>;
    local_type             data;
    type *                 ptr = nullptr;
    constexpr inline type &value() {
        if (ptr) return *ptr;
        return holder_convert_to<type, local_type>(data);
    }
    ~HolderType() {
        delete ptr;
    }
};

template <>
struct HolderType<const char *, false> {
    using type       = const char *;
    using local_type = std::string;
    local_type                 data;
    std::remove_const_t<type> *ptr = nullptr;
    inline type                value() const { return data.c_str(); }
};

template <typename R, typename... ARGS>
struct HolderType<std::function<R(ARGS...)>, true> {
    using type       = std::function<R(ARGS...)>;
    using local_type = std::function<R(ARGS...)>;
    local_type                 data;
    std::remove_const_t<type> *ptr = nullptr;
    inline type                value() { return data; }
};

///////////////////////////////////convertion//////////////////////////////////////////////////////////

template <typename T>
inline bool sevalue_to_native(const se::Value &from, T &&to) { // NOLINT(readability-identifier-naming)
    return sevalue_to_native(from, std::forward(to), nullptr);
}

template <typename T>
inline typename std::enable_if_t<!std::is_enum<T>::value && !std::is_pointer<T>::value, bool>
sevalue_to_native(const se::Value & /*from*/, T * /*to*/, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    SE_LOGE("Can not convert type ???\n - [[ %s ]]\n", typeid(T).name());
    CC_STATIC_ASSERT(std::is_same<T, void>::value, "sevalue_to_native not implemented for T");
    return false;
}

template <typename T>
inline typename std::enable_if_t<std::is_enum<T>::value, bool>
sevalue_to_native(const se::Value &from, T *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    typename std::underlying_type_t<T> tmp;
    bool                               ret = sevalue_to_native(from, &tmp, ctx);
    if (ret) *to = static_cast<T>(tmp);
    return ret;
}

//////////////// vector type

template <typename T, size_t CNT>
bool sevalue_to_native(const se::Value &from, std::array<T, CNT> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    assert(from.toObject());
    se::Object *array = from.toObject();
    assert(array->isArray());
    uint32_t len = 0;
    array->getArrayLength(&len);
    se::Value tmp;
    assert(len >= CNT);
    for (uint32_t i = 0; i < CNT; i++) {
        array->getArrayElement(i, &tmp);
        sevalue_to_native(tmp, &(*to)[i], ctx);
    }
    return true;
}

template <size_t CNT>
bool sevalue_to_native(const se::Value &from, std::array<uint8_t, CNT> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    assert(from.toObject());
    se::Object *array = from.toObject();
    assert(array->isArray() || array->isArrayBuffer() || array->isTypedArray());
    if (array->isTypedArray()) {
        uint8_t *data = nullptr;
        size_t   size = 0;
        array->getTypedArrayData(&data, &size);
        for (size_t i = 0; i < std::min(size, CNT); i++) {
            (*to)[i] = data[i];
        }
    } else if (array->isArrayBuffer()) {
        uint8_t *data = nullptr;
        size_t   size = 0;
        array->getArrayBufferData(&data, &size);
        for (size_t i = 0; i < std::min(size, CNT); i++) {
            (*to)[i] = data[i];
        }
    } else if (array->isArray()) {
        uint32_t len = 0;
        array->getArrayLength(&len);
        se::Value tmp;
        assert(len >= CNT);
        for (size_t i = 0; i < CNT; i++) {
            array->getArrayElement(static_cast<uint>(i), &tmp);
            sevalue_to_native(tmp, &(*to)[i], ctx);
        }
    } else {
        return false;
    }
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, std::string *to, se::Object * /*ctx*/) {
    *to = from.toString();
    return true;
}

///// integers
template <>
inline bool sevalue_to_native(const se::Value &from, bool *to, se::Object * /*ctx*/) {
    *to = from.isNullOrUndefined() ? false : (from.isNumber() ? from.toDouble() != 0 : from.toBoolean());
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, int32_t *to, se::Object * /*ctx*/) {
    *to = from.toInt32();
    return true;
}
template <>
inline bool sevalue_to_native(const se::Value &from, uint32_t *to, se::Object * /*ctx*/) {
    *to = from.toUint32();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, int16_t *to, se::Object * /*ctx*/) {
    *to = from.toInt16();
    return true;
}
template <>
inline bool sevalue_to_native(const se::Value &from, uint16_t *to, se::Object * /*ctx*/) {
    *to = from.toUint16();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, int8_t *to, se::Object * /*ctx*/) {
    *to = from.toInt8();
    return true;
}
template <>
inline bool sevalue_to_native(const se::Value &from, uint8_t *to, se::Object * /*ctx*/) {
    *to = from.toUint8();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, uint64_t *to, se::Object * /*ctx*/) {
    *to = from.toUint64();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, int64_t *to, se::Object * /*ctx*/) {
    *to = from.toInt64();
    return true;
}

#if CC_PLATFORM == CC_PLATFORM_MAC_IOS || CC_PLATFORM == CC_PLATFORM_MAC_OSX
template <>
inline bool sevalue_to_native(const se::Value &from, unsigned long *to, se::Object * /*ctx*/) {
    *to = static_cast<unsigned long>(from.toDouble());
    return true;
}
#endif

template <>
inline bool sevalue_to_native(const se::Value &from, float *to, se::Object * /*ctx*/) {
    *to = from.toFloat();
    return true;
}
inline bool sevalue_to_native(const se::Value &from, double *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    *to = from.toDouble();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value & /*from*/, void * /*to*/, se::Object * /*ctx*/) {
    assert(false); // void not supported
    return false;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::Data *to, se::Object * /*ctx*/) {
    return seval_to_Data(from, to);
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::Value *to, se::Object * /*unused*/) {
    return seval_to_ccvalue(from, to);
}

template <>
inline bool sevalue_to_native(const se::Value &from, se::Value *to, se::Object * /*unused*/) {
    *to = from;
    return true;
}

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec4 *to, se::Object * /*unused*/);

template <>
bool sevalue_to_native(const se::Value &from, cc::Mat4 *to, se::Object * /*unused*/);

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec3 *to, se::Object * /*unused*/);

template <>
bool sevalue_to_native(const se::Value &from, cc::Vec2 *to, se::Object * /*unused*/);

template <>
bool sevalue_to_native(const se::Value &from, cc::Quaternion *to, se::Object * /*unused*/);

template <>
inline bool sevalue_to_native(const se::Value &from, std::vector<se::Value> *to, se::Object * /*unused*/) {
    assert(from.isObject() && from.toObject()->isArray());
    auto *array = from.toObject();
    to->clear();
    uint32_t size;
    array->getArrayLength(&size);
    for (uint32_t i = 0; i < size; i++) {
        se::Value ele;
        array->getArrayElement(i, &ele);
        to->emplace_back(ele);
    }
    return true;
}

////////////////// pointer types

template <typename T>
typename std::enable_if_t<std::is_pointer<T>::value && !std::is_pointer<typename std::remove_pointer<T>::type>::value, bool>
sevalue_to_native(const se::Value &from, T to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    CC_STATIC_ASSERT(is_jsb_object_v<std::remove_pointer_t<T>>, "Only JSB object are accepted!");
    if (from.isNullOrUndefined()) {
        //const std::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
        //SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
        *to = nullptr;
        return true;
    }
    *to = static_cast<T *>(from.toObject()->getPrivateData());
    return true;
}

template <typename T>
typename std::enable_if_t<std::is_pointer<T>::value && std::is_pointer<typename std::remove_pointer<T>::type>::value, bool>
sevalue_to_native(const se::Value &from, T to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    using Value = typename std::remove_pointer<typename std::remove_pointer<T>::type>::type;
    CC_STATIC_ASSERT(is_jsb_object_v<Value> || std::is_arithmetic<Value>::value, "Only JSB object or arithmetic types are supported");

    if CC_CONSTEXPR (is_jsb_object_v<Value>) {
        if (from.isNullOrUndefined()) {
            //const std::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
            //SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
            *to = nullptr;
            return true;
        }
        *to = static_cast<typename std::remove_pointer<T>::type>(from.toObject()->getPrivateData());
        return true;
    } else if CC_CONSTEXPR (std::is_arithmetic<Value>::value) {
        se::Object *array = from.toObject();
        if (array->isTypedArray()) {
            uint8_t *data = nullptr;
            array->getTypedArrayData(&data, nullptr);
            *to = reinterpret_cast<Value *>(data);
        } else if (array->isArrayBuffer()) {
            uint8_t *data = nullptr;
            array->getArrayBufferData(&data, nullptr);
            *to = reinterpret_cast<Value *>(data);
        } else {
            assert(false);
            return false;
        }
        return true;
    }
}

template <typename T>
typename std::enable_if_t<!std::is_pointer<T>::value && is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value &from, T **to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        //const std::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
        //SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
        *to = nullptr;
        return true;
    }
    *to = static_cast<T *>(from.toObject()->getPrivateData());
    return true;
}

template <typename T>
typename std::enable_if_t<!std::is_pointer<T>::value && is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value &from, T ***to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        //const std::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
        //SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
        *to = nullptr;
        return true;
    }
    **to = static_cast<T *>(from.toObject()->getPrivateData());
    return true;
}

template <typename T, typename allocator>
bool sevalue_to_native(const se::Value &from, std::vector<T, allocator> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    assert(from.toObject());
    se::Object *array = from.toObject();

    if (array->isArray()) {
        uint32_t len = 0;
        array->getArrayLength(&len);
        to->resize(len);
        se::Value tmp;
        for (uint32_t i = 0; i < len; i++) {
            array->getArrayElement(i, &tmp);
            if (!sevalue_to_native(tmp, to->data() + i, ctx)) {
                SE_LOGE("vector %s convert error at %d\n", typeid(T).name(), i);
            }
        }
        return true;
    }

    if (array->isTypedArray()) {
        assert(std::is_arithmetic<T>::value);
        uint8_t *data    = nullptr;
        size_t   dataLen = 0;
        array->getTypedArrayData(&data, &dataLen);
        to->assign(reinterpret_cast<T *>(data), reinterpret_cast<T *>(data + dataLen));
        return true;
    }

    SE_LOGE("[warn] failed to convert to std::vector\n");
    return false;
}

//template<>
//bool sevalue_to_native(const se::Value &from, cc::gfx::Context **to, se::Object*) {
//    assert(from.isObject());
//    *to = (cc::gfx::Context*)from.toObject()->getPrivateData();
//    return true;
//}

template <>
inline bool sevalue_to_native(const se::Value &from, void **to, se::Object * /*ctx*/) {
    assert(to != nullptr);
    if (from.isNumber() || from.isBigInt()) {
        // NOLINTNEXTLINE(performance-no-int-to-ptr)
        *to = reinterpret_cast<void *>(from.toUint64());
        return true;
    }
    if (from.isObject()) {
        *to = from.toObject()->getPrivateData();
        return true;
    }
    SE_LOGE("[warn] failed to convert to void *\n");
    return false;
}

template <>
inline bool sevalue_to_native(const se::Value &from, std::string **to, se::Object * /*ctx*/) {
    **to = from.toString();
    return true;
}

template <>
inline bool sevalue_to_native(const se::Value &from, cc::ValueMap *to, se::Object * /*ctx*/) {
    return seval_to_ccvaluemap(from, to);
}

template <>
inline bool sevalue_to_native(const se::Value &from, std::vector<unsigned char> *to, se::Object * /*ctx*/) {
    assert(from.isObject());
    se::Object *in = from.toObject();

    if (in->isTypedArray()) {
        uint8_t *data    = nullptr;
        size_t   dataLen = 0;
        in->getTypedArrayData(&data, &dataLen);
        to->resize(dataLen);
        to->assign(data, data + dataLen);
        return true;
    }

    if (in->isArrayBuffer()) {
        uint8_t *data    = nullptr;
        size_t   dataLen = 0;
        in->getArrayBufferData(&data, &dataLen);
        to->resize(dataLen);
        to->assign(data, data + dataLen);
        return true;
    }

    if (in->isArray()) {
        uint32_t len = 0;
        in->getArrayLength(&len);
        to->resize(len);
        se::Value ele;
        for (uint32_t i = 0; i < len; i++) {
            in->getArrayElement(i, &ele);
            (*to)[i] = ele.toUint8();
        }
        return true;
    }

    SE_LOGE("type error, ArrayBuffer/TypedArray/Array expected!");
    return false;
}

template <typename R, typename... Args>
inline bool sevalue_to_native(const se::Value &from, std::function<R(Args...)> *func, se::Object *self) { // NOLINT(readability-identifier-naming)
    if (from.isObject() && from.toObject()->isFunction()) {
        se::Object *callback = from.toObject();
        self->attachObject(callback);
        *func = [callback, self](Args... inargs) {
            se::AutoHandleScope hs;
            bool                ok = true;
            se::ValueArray      args;
            int                 idx = 0;
            args.resize(sizeof...(Args));
            nativevalue_to_se_args_v(args, inargs...);
            se::Value rval;
            bool      succeed = callback->call(args, self, &rval);
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }
            if CC_CONSTEXPR (!std::is_same<R, void>::value) {
                R rawRet = {};
                sevalue_to_native(rval, &rawRet, self);
                return rawRet;
            }
        };
    } else {
        return false;
    }
    return true;
}

#if HAS_CONSTEXPR
template <typename T, bool is_reference>
inline bool sevalue_to_native(const se::Value &from, HolderType<T, is_reference> *holder, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if CC_CONSTEXPR (is_reference && is_jsb_object_v<T>) {
        void *ptr = from.toObject()->getPrivateData();
        if (ptr) {
            holder->data = static_cast<T *>(ptr);
            return true;
        }
        holder->ptr = new T;
        return sevalue_to_native(from, holder->ptr, ctx);

    } else if CC_CONSTEXPR (is_jsb_object_v<T>) {
        void *ptr = from.toObject()->getPrivateData();
        if (ptr) {
            holder->data = *static_cast<T *>(ptr);
            return true;
        }
        return sevalue_to_native(from, &(holder->data), ctx);

    } else {
        return sevalue_to_native(from, &(holder->data), ctx);
    }
}

#else
template <typename T>
inline typename std::enable_if<is_jsb_object_v<T>, bool>::type sevalue_to_native(const se::Value &from, HolderType<T, true> *holder, se::Object *ctx) {
    void *ptr = from.toObject()->getPrivateData();
    if (ptr) {
        holder->data = static_cast<T *>(ptr);
        return true;
    } else {
        holder->ptr = new T;
        return sevalue_to_native(from, holder->ptr, ctx);
    }
}

template <typename T>
inline typename std::enable_if<!is_jsb_object_v<T>, bool>::type sevalue_to_native(const se::Value &from, HolderType<T, true> *holder, se::Object *ctx) {
    return sevalue_to_native(from, &(holder->data), ctx);
}

template <typename T>
inline typename std::enable_if<is_jsb_object_v<T>, bool>::type sevalue_to_native(const se::Value &from, HolderType<T, false> *holder, se::Object *ctx) {
    void *ptr = from.toObject()->getPrivateData();
    if (ptr) {
        holder->data = *static_cast<T *>(ptr);
        return true;
    } else {
        return sevalue_to_native(from, &(holder->data), ctx);
    }
}

template <typename T>
inline typename std::enable_if<!is_jsb_object_v<T>, bool>::type sevalue_to_native(const se::Value &from, HolderType<T, false> *holder, se::Object *ctx) {
    return sevalue_to_native(from, &(holder->data), ctx);
}

#endif // HAS_CONSTEXPR

#if HAS_CONSTEXPR
template <typename T, typename allocator>
inline bool sevalue_to_native(const se::Value &from, HolderType<std::vector<T, allocator>, true> *holder, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if CC_CONSTEXPR (is_jsb_object_v<T> && std::is_pointer<T>::value) {
        auto &vec = holder->data;
        return sevalue_to_native(from, &vec, ctx);
    } else if CC_CONSTEXPR (is_jsb_object_v<T>) {
        return sevalue_to_native(from, static_cast<std::vector<T, allocator> *>(&(holder->data)), ctx);
    } else {
        return sevalue_to_native(from, &(holder->data), ctx);
    }
}

#else
template <typename T, typename allocator>
inline typename std::enable_if<is_jsb_object_v<T> && std::is_pointer<T>::value, bool>::type
sevalue_to_native(const se::Value &from, HolderType<std::vector<T, allocator>, true> *holder, se::Object *ctx) {
    auto &vec = holder->data;
    return sevalue_to_native(from, &vec, ctx);
}
template <typename T, typename allocator>
inline typename std::enable_if<is_jsb_object_v<T> && !std::is_pointer<T>::value, bool>::type
sevalue_to_native(const se::Value &from, HolderType<std::vector<T, allocator>, true> *holder, se::Object *ctx) {
    return sevalue_to_native(from, (std::vector<T, allocator> *)/* clang/xcode needs this */ &(holder->data), ctx);
}

template <typename T, typename allocator>
inline typename std::enable_if<!is_jsb_object_v<T>, bool>::type
sevalue_to_native(const se::Value &from, HolderType<std::vector<T, allocator>, true> *holder, se::Object *ctx) {
    return sevalue_to_native(from, &(holder->data), ctx);
}

#endif // HAS_CONSTEXPR

///////////////////////////////////////////////////////////////////

template <typename T>
inline bool nativevalue_to_se(T &&from, se::Value &to) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se(std::forward(from), to, nullptr);
}

#if HAS_CONSTEXPR

template <typename T>
inline bool nativevalue_to_se(const T &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if CC_CONSTEXPR (std::is_enum<T>::value) {
        to.setInt32(static_cast<int32_t>(from));
        return true;
    } else if CC_CONSTEXPR (std::is_pointer<T>::value) {
        return native_ptr_to_seval(from, &to);
    } else if CC_CONSTEXPR (is_jsb_object_v<T>) {
        return native_ptr_to_seval(from, &to);
    } else if CC_CONSTEXPR (std::is_same<T, int64_t>::value || std::is_same<T, uint64_t>::value) {
        to.setInt64(static_cast<int64_t>(from));
        return true;
    } else if CC_CONSTEXPR (std::is_arithmetic<T>::value) {
        to.setDouble(static_cast<double>(from));
        return true;
    } else {
        return nativevalue_to_se<typename std::conditional_t<std::is_const<T>::value, T, typename std::add_const<T>::type>>(from, to, ctx);
    }
}

#else

template <typename T>
inline typename std::enable_if<std::is_enum<T>::value, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object *ctx) {
    to.setInt32(static_cast<int32_t>(from));
    return true;
}

template <typename T>
inline typename std::enable_if<std::is_pointer<T>::value, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object *ctx) {
    return native_ptr_to_seval(from, &to);
}

template <typename T>
inline typename std::enable_if<is_jsb_object_v<T>, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object *ctx) {
    return native_ptr_to_seval(from, &to);
}

template <typename T>
inline typename std::enable_if<!std::is_enum<T>::value && !std::is_pointer<T>::value && !is_jsb_object_v<T>, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object *ctx) {
    return nativevalue_to_se<typename std::conditional_t<std::is_const<T>::value, T, typename std::add_const<T>::type>>(from, to, ctx);
}

#endif // HAS_CONSTEXPR

template <typename T, typename allocator>
inline bool nativevalue_to_se(const std::vector<T, allocator> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createArrayObject(from.size());
    se::Value   tmp;
    for (size_t i = 0; i < from.size(); i++) {
        nativevalue_to_se(from[i], tmp, ctx);
        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array);
    array->decRef();
    return true;
}

template <>
inline bool nativevalue_to_se(const std::vector<int8_t> &from, se::Value &to, se::Object * /*ctx*/) {
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::INT8, from.data(), from.size());
    to.setObject(array);
    array->decRef();
    return true;
}

template <>
inline bool nativevalue_to_se(const std::vector<uint8_t> &from, se::Value &to, se::Object * /*ctx*/) {
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, from.data(), from.size());
    to.setObject(array);
    array->decRef();
    return true;
}

template <typename T, size_t N>
inline bool nativevalue_to_se(const std::array<T, N> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createArrayObject(N);
    se::Value   tmp;
    for (size_t i = 0; i < N; i++) {
        nativevalue_to_se(from[i], tmp, ctx);
        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array);
    array->decRef();
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const std::array<uint8_t, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, from.data(), N);
    to.setObject(array);
    array->decRef();
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const std::array<uint16_t, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::INT16, from.data(), N * sizeof(uint16_t));
    to.setObject(array);
    array->decRef();
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const std::array<float, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *array = se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, from.data(), N * sizeof(float));
    to.setObject(array);
    array->decRef();
    return true;
}

template <>
inline bool nativevalue_to_se(const int64_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setInt64(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const uint64_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setUint64(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const int32_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setInt32(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const uint32_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setUint32(from);
    return true;
}
template <>
inline bool nativevalue_to_se(const int16_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setInt16(from);
    return true;
}
template <>
inline bool nativevalue_to_se(const uint16_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setUint16(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const int8_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setInt8(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const uint8_t &from, se::Value &to, se::Object * /*ctx*/) {
    to.setUint8(from);
    return true;
}

template <>
inline bool nativevalue_to_se(const std::string &from, se::Value &to, se::Object * /*ctx*/) {
    to.setString(from);
    return true;
}
template <>
inline bool nativevalue_to_se(const float &from, se::Value &to, se::Object * /*ctx*/) {
    to.setFloat(from);
    return true;
}
template <>
inline bool nativevalue_to_se(const double &from, se::Value &to, se::Object * /*ctx*/) {
    to.setFloat(static_cast<float>(from));
    return true;
}
template <>
inline bool nativevalue_to_se(const bool &from, se::Value &to, se::Object * /*ctx*/) {
    to.setBoolean(from);
    return true;
}

template <typename R, typename... Args>
inline bool nativevalue_to_se(std::function<R(Args...)> & /*from*/, se::Value & /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    SE_LOGE("Can not convert C++ lambda to JS object");                                                         // TODO(jiangzhan)
    return false;
}

template <typename R, typename... Args>
inline bool nativevalue_to_se(const std::function<R(Args...)> & /*from*/, se::Value & /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    SE_LOGE("Can not convert C++ const lambda to JS object");                                                         // TODO(jiangzhan)
    return false;
}

///////////////////////// function ///////////////////////

template <int i, typename T>
bool nativevalue_to_se_args(se::ValueArray &array, T &x) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se(x, array[i], nullptr);
}
template <int i, typename T, typename... Args>
bool nativevalue_to_se_args(se::ValueArray &array, T &x, Args &...args) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se_args<i, T>(array, x) && nativevalue_to_se_args<i + 1, Args...>(array, args...);
}

template <typename... Args>
bool nativevalue_to_se_args_v(se::ValueArray &array, Args &...args) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se_args<0, Args...>(array, args...);
}

/////////////////////// FIXME: remove all code bellow
///////////////// gfx type
namespace cc {
class GFXContext;
class Data;
class Value;
class Vec4;
class Size;
} // namespace cc
//template<>

// JSB_REGISTER_OBJECT_TYPE(cc::network::DownloaderHints);

template <>
bool nativevalue_to_se(const cc::Data &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Value &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const std::unordered_map<std::string, cc::Value> &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Vec2 &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Vec3 &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Vec4 &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Size &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::extension::ManifestAsset &from, se::Value &to, se::Object *ctx);

template <>
bool nativevalue_to_se(const cc::Rect &from, se::Value &to, se::Object *ctx);

template <>
inline bool nativevalue_to_se(const cc::network::DownloadTask &from, se::Value &to, se::Object * /*ctx*/) {
    return DownloadTask_to_seval(from, &to);
}

#if __clang__
    #pragma clang diagnostic pop
#endif

// Spine conversions
#if USE_SPINE

template <>
bool sevalue_to_native(const se::Value &, spine::String *, se::Object *);

template <typename T>
bool nativevalue_to_se(const spine::Vector<T> &v, se::Value &ret, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool             ok = true;

    spine::Vector<T> tmpv = v;

    auto size = static_cast<uint32_t>(tmpv.size());
    for (uint32_t i = 0; i < size; ++i) {
        se::Value tmp;
        ok = nativevalue_to_se(tmpv[i], tmp, nullptr);
        if (!ok || !obj->setArrayElement(i, tmp)) {
            ok = false;
            ret.setUndefined();
            break;
        }
    }

    if (ok) {
        ret.setObject(obj);
    }

    return ok;
}

template <typename T>
bool nativevalue_to_se(const spine::Vector<T *> &v, se::Value &ret, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool             ok = true;

    spine::Vector<T *> tmpv = v;

    auto size = static_cast<uint32_t>(tmpv.size());
    for (uint32_t i = 0; i < size; ++i) {
        se::Value tmp;
        ok = native_ptr_to_rooted_seval<T>(tmpv[i], &tmp);
        if (!ok || !obj->setArrayElement(i, tmp)) {
            ok = false;
            ret.setUndefined();
            break;
        }
    }

    if (ok) ret.setObject(obj);
    return ok;
}

template <typename T>
bool sevalue_to_native(const se::Value &v, spine::Vector<T *> *ret, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    assert(ret != nullptr);
    assert(v.isObject());
    se::Object *obj = v.toObject();
    assert(obj->isArray());

    bool     ok  = true;
    uint32_t len = 0;
    ok           = obj->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = obj->getArrayElement(i, &tmp);
        if (!ok || !tmp.isObject()) {
            ret->clear();
            return false;
        }

        T *nativeObj = static_cast<T *>(tmp.toObject()->getPrivateData());
        ret->add(nativeObj);
    }

    return true;
}

template <>
bool nativevalue_to_se(const spine::Vector<spine::String> &v, se::Value &ret, se::Object *ctx);

template <>
bool nativevalue_to_se(const spine::String &from, se::Value &to, se::Object *ctx);

template <>
bool sevalue_to_native(const se::Value &v, spine::Vector<spine::String> *ret, se::Object *ctx);

template <>
bool seval_to_Map_string_key(const se::Value &v, cc::Map<std::string, cc::middleware::Texture2D *> *ret);
#endif //USE_SPINE

#if USE_MIDDLEWARE
template <>
inline bool nativevalue_to_se(const se_object_ptr &from, se::Value &to, se::Object * /*ctx*/) {
    to.setObject(const_cast<se::Object *>(from));
    return true;
}
#endif //USE_MIDDLEWARE
