/****************************************************************************
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

#include <cstdint>
#include <functional>
#include <type_traits>
#include <utility>
#include "MappingUtils.h"
#include "base/Macros.h"
#include "base/Ptr.h"
#include "base/RefCounted.h"
#include "base/std/any.h"
#include "base/std/container/map.h"
#include "base/std/container/vector.h"
#include "base/std/optional.h"
#include "base/std/variant.h"
#include "bindings/jswrapper/HandleObject.h"
#include "bindings/jswrapper/SeApi.h"
#include "bindings/manual/jsb_classtype.h"
#include "jsb_conversions_spec.h"
#include "core/data/JSBNativeDataHolder.h"

#if CC_USE_SPINE
    #include "cocos/editor-support/spine-creator-support/spine-cocos2dx.h"
#endif

#include "core/assets/EffectAsset.h"
#include "core/geometry/Geometry.h"
#include "math/Color.h"
#include "math/Math.h"
#include "renderer/gfx-base/states/GFXSampler.h"

#include "base/HasMemberFunction.h"

#define SE_PRECONDITION2_VOID(condition, ...)                                                                   \
    do {                                                                                                        \
        if (!(condition)) {                                                                                     \
            DO_CC_LOG_ERROR("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            DO_CC_LOG_ERROR(__VA_ARGS__);                                                                       \
            return;                                                                                             \
        }                                                                                                       \
    } while (0)

#define SE_PRECONDITION2_FUNCNAME_VOID(condition, funcName, ...)                                            \
    do {                                                                                                    \
        if (!(condition)) {                                                                                 \
            DO_CC_LOG_ERROR("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, funcName); \
            DO_CC_LOG_ERROR(__VA_ARGS__);                                                                   \
            return;                                                                                         \
        }                                                                                                   \
    } while (0)

#define SE_PRECONDITION2(condition, ret_value, ...)                                                             \
    do {                                                                                                        \
        if (!(condition)) {                                                                                     \
            DO_CC_LOG_ERROR("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            DO_CC_LOG_ERROR(__VA_ARGS__);                                                                       \
            return (ret_value);                                                                                 \
        }                                                                                                       \
    } while (0)

#define SE_PRECONDITION3(condition, ret_value, failed_code) \
    do {                                                    \
        if (!(condition)) {                                 \
            failed_code;                                    \
            return (ret_value);                             \
        }                                                   \
    } while (0)

#define SE_PRECONDITION4(condition, ret_value, errorCode)                                                       \
    do {                                                                                                        \
        if (!(condition)) {                                                                                     \
            DO_CC_LOG_ERROR("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
            __glErrorCode = errorCode;                                                                          \
            return (ret_value);                                                                                 \
        }                                                                                                       \
    } while (0)

#define SE_PRECONDITION_ERROR_BREAK(condition, ...)                                                         \
    if (!(condition)) {                                                                                     \
        DO_CC_LOG_ERROR("jsb: ERROR: File %s: Line: %d, Function: %s\n", __FILE__, __LINE__, __FUNCTION__); \
        DO_CC_LOG_ERROR(__VA_ARGS__);                                                                       \
        break;                                                                                              \
    }

#if CC_ENABLE_CACHE_JSB_FUNC_RESULT
    #define SE_HOLD_RETURN_VALUE(retCXXValue, thisObject, jsValue)                         \
        if (is_jsb_object_v<typename std::decay<decltype(retCXXValue)>::type>) {           \
            (thisObject)->setProperty(ccstd::string("__cache") + __FUNCTION__, (jsValue)); \
        }
#else
    #define SE_HOLD_RETURN_VALUE(...)
#endif

template <typename T>
bool seval_to_native_ptr(const se::Value &v, T *ret) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);

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
typename std::enable_if<std::is_class<T>::value && !std::is_same<T, ccstd::string>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isObject()) {
        ok = false;
        return T();
    }
    T *nativeObj = static_cast<T *>(v.toObject()->getPrivateData());
    ok = true;
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
typename std::enable_if<std::is_same<T, ccstd::string>::value, T>::type
seval_to_type(const se::Value &v, bool &ok) { // NOLINT(readability-identifier-naming)
    if (!v.isString()) {
        ok = false;
        return "";
    }
    ok = true;
    return v.toString();
}

inline se::HandleObject unwrapProxyObject(se::Object *obj) {
    if (obj->isProxy()) {
        return se::HandleObject(se::Object::createProxyTarget(obj));
    }
    obj->incRef();
    return se::HandleObject(obj);
}

template <typename T>
typename std::enable_if<std::is_pointer<T>::value && std::is_class<typename std::remove_pointer<T>::type>::value, bool>::type
seval_to_std_vector(const se::Value &v, ccstd::vector<T> *ret) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    se::HandleObject array(unwrapProxyObject(v.toObject()));
    CC_ASSERT(array->isArray());

    bool ok = true;
    uint32_t len = 0;
    ok = array->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    ret->resize(len);

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = array->getArrayElement(i, &tmp);
        if (!ok) {
            ret->clear();
            return false;
        }

        if (tmp.isObject()) {
            T nativeObj = static_cast<T>(tmp.toObject()->getPrivateData());
            (*ret)[i] = nativeObj;
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
seval_to_std_vector(const se::Value &v, ccstd::vector<T> *ret) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    se::HandleObject array(unwrapProxyObject(v.toObject()));
    CC_ASSERT(array->isArray());

    bool ok = true;
    uint32_t len = 0;
    ok = array->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    ret->resize(len);

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = array->getArrayElement(i, &tmp);
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
bool seval_to_Map_string_key(const se::Value &v, cc::RefMap<ccstd::string, T> *ret) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    se::Object *obj = v.toObject();

    ccstd::vector<ccstd::string> allKeys;
    bool ok = obj->getAllKeys(&allKeys);
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

template <typename T>
void cc_tmp_set_private_data(se::Object *obj, T *v) { // NOLINT(readability-identifier-naming)
    if constexpr (std::is_base_of_v<cc::RefCounted, T>) {
        obj->setPrivateData(v);
    } else {
        obj->setRawPrivateData(v);
    }
}

//  handle reference
template <typename T>
typename std::enable_if<!std::is_pointer<T>::value, bool>::type
native_ptr_to_seval(T &v_ref, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<decltype(v_ref)>::type>::type;
    auto *v = const_cast<DecayT *>(&v_ref);

    CC_ASSERT_NOT_NULL(ret);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Class *cls = JSBClassType::findClass(v);
    se::NativePtrToObjectMap::filter(v, cls)
        .forEach([&](se::Object *foundObj) {
            if (isReturnCachedValue != nullptr) {
                *isReturnCachedValue = true;
            }
            ret->setObject(foundObj);
        })
        .orElse([&]() {
            // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
            // CC_LOG_DEBUGWARN("WARNING: non-Ref type: (%s) isn't catched!", typeid(*v).name());
            CC_ASSERT_NOT_NULL(cls);
            se::Object *obj = se::Object::createObjectWithClass(cls);
            ret->setObject(obj, true);
            cc_tmp_set_private_data(obj, v);

            se::Value property;
            bool foundCtor = false;
            if (!cls->_getCtor().has_value()) {
                foundCtor = obj->getProperty("_ctor", &property, true);
                if (foundCtor) {
                    cls->_setCtor(property.toObject());
                } else {
                    cls->_setCtor(nullptr);
                }
            } else {
                auto *ctorObj = cls->_getCtor().value();
                if (ctorObj != nullptr) {
                    property.setObject(ctorObj);
                    foundCtor = true;
                }
            }

            if (foundCtor) {
                property.toObject()->call(se::EmptyValueArray, obj);
            }

            if (isReturnCachedValue != nullptr) {
                *isReturnCachedValue = false;
            }
        });

    return true;
}

template <typename T>
bool native_ptr_to_seval(T *vp, se::Class *cls, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v = const_cast<DecayT *>(vp);
    CC_ASSERT_NOT_NULL(ret);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    if constexpr (cc::has_getScriptObject<DecayT, se::Object *()>::value) {
        if (v->getScriptObject() != nullptr) {
            if (isReturnCachedValue != nullptr) {
                *isReturnCachedValue = true;
            }
            ret->setObject(v->getScriptObject());
            return true;
        }
    }

    se::NativePtrToObjectMap::filter(v, cls)
        .forEach(
            [&](se::Object *foundObj) {
                if (isReturnCachedValue != nullptr) {
                    *isReturnCachedValue = true;
                }
                ret->setObject(foundObj);
            })
        .orElse([&]() {
            // If we couldn't find native object in map, then the native object is created from native code. e.g. TMXLayer::getTileAt
            // CC_LOG_DEBUGWARN("WARNING: Ref type: (%s) isn't catched!", typeid(*v).name());
            CC_ASSERT_NOT_NULL(cls);
            auto *obj = se::Object::createObjectWithClass(cls);
            ret->setObject(obj, true);
            cc_tmp_set_private_data(obj, v);

            se::Value property;
            bool foundCtor = false;
            if (!cls->_getCtor().has_value()) {
                foundCtor = obj->getProperty("_ctor", &property, true);
                if (foundCtor) {
                    cls->_setCtor(property.toObject());
                } else {
                    cls->_setCtor(nullptr);
                }
            } else {
                auto *ctorObj = cls->_getCtor().value();
                if (ctorObj != nullptr) {
                    property.setObject(ctorObj);
                    foundCtor = true;
                }
            }

            if (foundCtor) {
                property.toObject()->call(se::EmptyValueArray, obj);
            }

            if (isReturnCachedValue != nullptr) {
                *isReturnCachedValue = false;
            }
        });

    return true;
}

template <typename T>
bool native_ptr_to_seval(T *vp, se::Value *ret, bool *isReturnCachedValue = nullptr) { // NOLINT(readability-identifier-naming)
    using DecayT = typename std::decay<typename std::remove_const<T>::type>::type;
    auto *v = const_cast<DecayT *>(vp);
    CC_ASSERT_NOT_NULL(ret);
    if (v == nullptr) {
        ret->setNull();
        return true;
    }

    se::Class *cls = JSBClassType::findClass(v);
    return native_ptr_to_seval<T>(vp, cls, ret, isReturnCachedValue);
}
template <typename T>
bool std_vector_to_seval(const ccstd::vector<T> &v, se::Value *ret) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);
    bool ok = true;
    se::HandleObject obj(se::Object::createArrayObject(v.size()));

    uint32_t i = 0;
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
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    *ret = static_cast<T *>(v.toObject()->getPrivateData());
    return true;
}

/////////////////////////////////// helpers //////////////////////////////////////////////////////////

////////////////////////// is jsb object ///////////////////////////

template <typename T>
struct is_jsb_object : std::false_type {}; // NOLINT(readability-identifier-naming)

template <typename T>
constexpr bool is_jsb_object_v = is_jsb_object<typename std::remove_cv_t<typename std::remove_reference_t<T>>>::value; // NOLINT

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
    using type = typename std::remove_const<typename std::remove_reference<T>::type>::type;
    using local_type = typename std::conditional_t<is_reference && is_jsb_object_v<T>, std::add_pointer_t<type>, type>;
    local_type data;
    type *ptr = nullptr;
    struct alignas(T) EmbedField {
        uint8_t inlineObject[is_reference && is_jsb_object_v<T> ? sizeof(T) : 1];
    } inlineObject;

    constexpr inline type &value() {
        if (ptr) return *ptr;
        return holder_convert_to<type, local_type>(data);
    }
    ~HolderType() {
        // delete ptr;
        if (ptr) {
            ptr->~type();
        }
    }
};

template <>
struct HolderType<char *, false> {
    using type = const char *;
    using local_type = ccstd::string;
    local_type data;
    std::remove_const_t<type> *ptr = nullptr;
    inline type value() const { return data.c_str(); }
};

template <>
struct HolderType<const char *, false> {
    using type = const char *;
    using local_type = ccstd::string;
    local_type data;
    std::remove_const_t<type> *ptr = nullptr;
    inline type value() const { return data.c_str(); }
};

///////////////////////////////////convertion//////////////////////////////////////////////////////////

////////////////// optional
template <typename T, typename Enable = void>
struct is_optional : std::false_type {}; // NOLINT

template <typename T>
struct is_optional<ccstd::optional<T>> : std::true_type {}; // NOLINT

template <typename... Args>
struct is_variant : std::false_type {}; // NOLINT
template <typename... Args>
struct is_variant<ccstd::variant<Args...>> : std::true_type {}; // NOLINT

template <typename T>
inline typename std::enable_if_t<!std::is_enum<T>::value && !std::is_pointer<T>::value && !is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value & /*from*/, T * /*to*/, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    SE_LOGE("Missing conversion impl `sevalue_to_native` for type [[%s]]\n", typeid(T).name());
    static_assert(!is_variant<T>::value, "should not match cc::variant");
    static_assert((std::is_same<T, void>::value), "Type incorrect or implementation not found!");
    return false;
}

template <typename T>
inline typename std::enable_if_t<!std::is_enum<T>::value && !std::is_pointer<T>::value && is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value &from, T *to, se::Object * /*unused*/) { // NOLINT(readability-identifier-naming)
    auto *obj = from.toObject();
    if constexpr (std::is_copy_assignable<T>::value) {
        *to = *static_cast<T *>(obj->getPrivateData());
    } else {
        CC_ABORT(); // can not copy
    }
    return true;
}

template <typename T>
inline typename std::enable_if_t<std::is_enum<T>::value, bool>
sevalue_to_native(const se::Value &from, T *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    typename std::underlying_type_t<T> tmp;
    bool ret = sevalue_to_native(from, &tmp, ctx);
    if (ret) *to = static_cast<T>(tmp);
    return ret;
}

//////////////////////////////// forward declaration : sevalue_to_native ////////////////////////////////

// ccstd::variant<...>>ss
template <typename... Args>
bool sevalue_to_native(const se::Value &from, ccstd::variant<Args...> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)

template <typename T>
bool sevalue_to_native(const se::Value &from, ccstd::optional<T> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
/// ccstd::unordered_map<ccstd::string, V>
template <typename V>
bool sevalue_to_native(const se::Value &from, ccstd::unordered_map<ccstd::string, V> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
/// ccstd::map<ccstd::string, V>
template <typename V>
bool sevalue_to_native(const se::Value &from, ccstd::map<ccstd::string, V> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
// std::tuple
template <typename... Args>
bool sevalue_to_native(const se::Value &from, std::tuple<Args...> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
// std::shared_ptr
template <typename T>
bool sevalue_to_native(const se::Value &from, std::shared_ptr<ccstd::vector<T>> *out, se::Object *ctx); // NOLINT(readability-identifier-naming)
template <typename T>
bool sevalue_to_native(const se::Value &from, std::shared_ptr<T> *out, se::Object *ctx); // NOLINT(readability-identifier-naming)
// ccstd::vector
template <typename T>
bool sevalue_to_native(const se::Value &from, ccstd::vector<T> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)
// ccstd::vector
template <typename T, size_t N>
bool sevalue_to_native(const se::Value &from, ccstd::array<T, N> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)

template <typename T>
bool sevalue_to_native(const se::Value &from, cc::IntrusivePtr<T> *to, se::Object *ctx); // NOLINT(readability-identifier-naming)

//////////////////// ccstd::array

template <typename T, size_t CNT>
bool sevalue_to_native(const se::Value &from, ccstd::array<T, CNT> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    CC_ASSERT(from.toObject());
    se::Object *array = from.toObject();
    CC_ASSERT(array->isArray());
    uint32_t len = 0;
    array->getArrayLength(&len);
    se::Value tmp;
    CC_ASSERT_GE(len, CNT);
    for (uint32_t i = 0; i < CNT; i++) {
        array->getArrayElement(i, &tmp);
        sevalue_to_native(tmp, &(*to)[i], ctx);
    }
    return true;
}

template <size_t CNT>
bool sevalue_to_native(const se::Value &from, ccstd::array<uint8_t, CNT> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    CC_ASSERT(from.toObject());
    se::Object *array = from.toObject();
    CC_ASSERT(array->isArray() || array->isArrayBuffer() || array->isTypedArray());
    if (array->isTypedArray()) {
        uint8_t *data = nullptr;
        size_t size = 0;
        array->getTypedArrayData(&data, &size);
        for (size_t i = 0; i < std::min(size, CNT); i++) {
            (*to)[i] = data[i];
        }
    } else if (array->isArrayBuffer()) {
        uint8_t *data = nullptr;
        size_t size = 0;
        array->getArrayBufferData(&data, &size);
        for (size_t i = 0; i < std::min(size, CNT); i++) {
            (*to)[i] = data[i];
        }
    } else if (array->isArray()) {
        uint32_t len = 0;
        array->getArrayLength(&len);
        se::Value tmp;
        CC_ASSERT_GE(len, CNT);
        for (size_t i = 0; i < CNT; i++) {
            array->getArrayElement(static_cast<uint32_t>(i), &tmp);
            sevalue_to_native(tmp, &(*to)[i], ctx);
        }
    } else {
        return false;
    }
    return true;
}

template <typename T>
bool sevalue_to_native(const se::Value &from, ccstd::variant<ccstd::monostate, T, ccstd::vector<T>> *to, se::Object *ctx) { // NOLINT
    bool ok = false;
    if (from.isObject() && from.toObject()->isArray()) {
        ccstd::vector<T> result;
        ok = sevalue_to_native(from, &result, ctx);
        if (ok) {
            *to = std::move(result);
        }
    } else {
        T result{};
        ok = sevalue_to_native(from, &result, ctx);
        if (ok) {
            *to = std::move(result);
        }
    }
    return ok;
}

////////////////// TypedArray

template <typename T>
inline typename std::enable_if<std::is_arithmetic<T>::value, bool>::type
sevalue_to_native(const se::Value &from, cc::TypedArrayTemp<T> *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to->setJSTypedArray(from.toObject());
    return true;
}

////////////////// pointer types

template <typename T>
typename std::enable_if_t<!std::is_pointer<T>::value && is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value &from, T **to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        // const ccstd::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
        // SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
        *to = nullptr;
        return true;
    }
    *to = static_cast<T *>(from.toObject()->getPrivateData());
    return true;
}

// duplicate extern to resolve the circular reference jsb_cocos_auto.h
// see jsb_cocos_auto.h 
extern se::Class *__jsb_cc_JSBNativeDataHolder_class; // NOLINT

template <typename T>
typename std::enable_if_t<!std::is_pointer<T>::value && std::is_arithmetic<T>::value, bool>
sevalue_to_native(const se::Value &from, T **to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::Object *data = from.toObject();
    uint8_t *tmp;
    if (data->isArrayBuffer()) {
        data->getArrayBufferData(&tmp, nullptr);
    } else if (data->isTypedArray()) {
        data->getTypedArrayData(&tmp, nullptr);
    } else {
        void *privateData = data->getPrivateData();
        if (privateData != nullptr && data->_getClass() == __jsb_cc_JSBNativeDataHolder_class) {
            auto *dataHolder = static_cast<cc::JSBNativeDataHolder *>(privateData);
            if (dataHolder != nullptr) {
                tmp = dataHolder->getData();
            } else {
                CC_ABORT(); // bad type
                return false;
            }
        } else {
            CC_ABORT(); // bad type
            return false;
        }
    }
    *to = reinterpret_cast<T *>(tmp);
    return true;
}

template <typename T>
typename std::enable_if_t<!std::is_pointer<T>::value && is_jsb_object_v<T>, bool>
sevalue_to_native(const se::Value &from, T ***to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        // const ccstd::string stack = se::ScriptEngine::getInstance()->getCurrentStackTrace();
        // SE_LOGE("[ERROR] sevalue_to_native jsval is null/undefined: %s\nstack: %s", typeid(T).name(), stack.c_str());
        *to = nullptr;
        return true;
    }
    **to = static_cast<T *>(from.toObject()->getPrivateData());
    return true;
}

template <typename T>
bool sevalue_to_native(const se::Value &from, ccstd::vector<T> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)

    if (from.isNullOrUndefined()) {
        to->clear();
        return true;
    }

    CC_ASSERT(from.toObject());
    se::HandleObject array(unwrapProxyObject(from.toObject()));

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
        CC_ASSERT(std::is_arithmetic<T>::value);
        if constexpr (std::is_arithmetic<T>::value) {
            uint8_t *data = nullptr;
            size_t dataLen = 0;
            array->getTypedArrayData(&data, &dataLen);
            to->assign(reinterpret_cast<T *>(data), reinterpret_cast<T *>(data + dataLen));
            return true;
        }
    }

    SE_LOGE("[warn] failed to convert to ccstd::vector\n");
    return false;
}

template <typename K, typename V>
bool sevalue_to_native(const se::Value &from, cc::StablePropertyMap<K, V> *to, se::Object *ctx) { // NOLINT
    // convert object to attribute/value list: [{"prop1", v1}, {"prop2", v2}... {"propN", vn}]
    CC_ASSERT_NOT_NULL(to);
    CC_ASSERT(from.isObject());
    auto *jsObj = from.toObject();
    ccstd::vector<ccstd::string> objectKeys;
    jsObj->getAllKeys(&objectKeys);
    to->clear();
    se::Value valueJS;
    for (auto &attr : objectKeys) {
        V value;

        if (!jsObj->getProperty(attr, &valueJS)) {
            continue;
        }
        if (!sevalue_to_native(valueJS, &value, ctx)) {
            continue;
        }
        to->emplace_back(std::make_pair(std::move(attr), std::move(value)));
    }
    return true;
}

///////////////////// function
///

template <typename... Args>
bool nativevalue_to_se_args_v(se::ValueArray &array, Args &&...args); // NOLINT(readability-identifier-naming)

template <typename R>
inline bool sevalue_to_native(const se::Value &from, std::function<R()> *func, se::Object *self) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        *func = nullptr;
        return true;
    }

    if (from.isObject() && from.toObject()->isFunction()) {
        CC_ASSERT(from.toObject()->isRooted());
        *func = [from, self]() {
            se::AutoHandleScope hs;
            bool ok = true;
            se::ValueArray args;
            se::Value rval;
            bool succeed = from.toObject()->call(se::EmptyValueArray, self, &rval);
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }

            R rawRet{};
            sevalue_to_native(rval, &rawRet, self);
            return rawRet;
        };
    } else {
        return false;
    }
    return true;
}

template <typename R, typename... Args>
inline bool sevalue_to_native(const se::Value &from, std::function<R(Args...)> *func, se::Object *self) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        *func = nullptr;
        return true;
    }

    if (from.isObject() && from.toObject()->isFunction()) {
        CC_ASSERT(from.toObject()->isRooted());
        *func = [from, self](Args... inargs) {
            se::AutoHandleScope hs;
            bool ok = true;
            se::ValueArray args;
            int idx = 0;
            args.resize(sizeof...(Args));
            nativevalue_to_se_args_v(args, inargs...);
            se::Value rval;
            bool succeed = from.toObject()->call(args, self, &rval);
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }
            if constexpr (!std::is_same<R, void>::value) {
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

inline bool sevalue_to_native(const se::Value &from, std::function<void()> *func, se::Object *self) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        *func = nullptr;
        return true;
    }

    if (from.isObject() && from.toObject()->isFunction()) {
        CC_ASSERT(from.toObject()->isRooted());
        *func = [from, self]() {
            se::AutoHandleScope hs;
            bool ok = true;
            se::ValueArray args;
            se::Value rval;
            bool succeed = from.toObject()->call(se::EmptyValueArray, self, &rval);
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }
        };
    } else {
        return false;
    }
    return true;
}

template <typename... Args>
inline bool sevalue_to_native(const se::Value &from, std::function<void(Args...)> *func, se::Object *self) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        *func = nullptr;
        return true;
    }

    if (from.isObject() && from.toObject()->isFunction()) {
        CC_ASSERT(from.toObject()->isRooted());
        *func = [from, self](Args... inargs) {
            se::AutoHandleScope hs;
            bool ok = true;
            se::ValueArray args;
            int idx = 0;
            args.resize(sizeof...(Args));
            nativevalue_to_se_args_v(args, inargs...);
            se::Value rval;
            bool succeed = from.toObject()->call(args, self, &rval);
            if (!succeed) {
                se::ScriptEngine::getInstance()->clearException();
            }
        };
    } else {
        return false;
    }
    return true;
}

//////////////////////// ccstd::variant

template <typename... Args>
inline bool sevalue_to_native(const se::Value & /*from*/, ccstd::variant<Args...> * /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    static_assert(sizeof...(Args) == 0, "should not pass variant from js -> native");
    CC_ABORT();
    return false;
}

template <typename T, bool is_reference>
inline bool sevalue_to_native(const se::Value &from, HolderType<T, is_reference> *holder, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if constexpr (is_reference && is_jsb_object_v<T>) {
        void *ptr = from.toObject()->getPrivateData();
        if (ptr) {
            holder->data = static_cast<T *>(ptr);
            return true;
        }
        if constexpr (std::is_constructible<T>::value) {
            holder->ptr = ccnew_placement(&holder->inlineObject) T;
        } else {
            CC_ABORT(); // default construtor not provided
        }
        return sevalue_to_native(from, holder->ptr, ctx);
    } else if constexpr (is_jsb_object_v<T>) {
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

template <typename T>
inline bool sevalue_to_native(const se::Value &from, HolderType<ccstd::vector<T>, true> *holder, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if constexpr (is_jsb_object_v<T> && std::is_pointer<T>::value) {
        auto &vec = holder->data;
        return sevalue_to_native(from, &vec, ctx);
    } else if constexpr (is_jsb_object_v<T>) {
        return sevalue_to_native(from, static_cast<ccstd::vector<T> *>(&(holder->data)), ctx);
    } else {
        return sevalue_to_native(from, &(holder->data), ctx);
    }
}

/////////////////// std::shared_ptr

template <typename T>
bool sevalue_to_native(const se::Value &from, std::shared_ptr<ccstd::vector<T>> *out, se::Object *ctx) {
    if (from.isNullOrUndefined()) {
        out->reset();
        return true;
    }

    *out = std::make_shared<ccstd::vector<T>>();
    return sevalue_to_native(from, out->get(), ctx);
}

template <typename T>
bool sevalue_to_native(const se::Value &from, std::shared_ptr<T> *out, se::Object * /*ctx*/) {
    if (from.isNullOrUndefined()) {
        out->reset();
        return true;
    }
    *out = from.toObject()->getPrivateSharedPtr<T>();
    return true;
}

template <typename T>
inline typename std::enable_if<std::is_arithmetic<T>::value, bool>::type
sevalue_to_native(const se::Value &from, cc::IntrusivePtr<cc::TypedArrayTemp<T>> *out, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    *out = ccnew cc::TypedArrayTemp<T>();
    sevalue_to_native(from, out->get(), ctx);
    return true;
}

template <typename T>
bool sevalue_to_native(const se::Value &from, cc::IntrusivePtr<T> *to, se::Object *ctx) {
    if (from.isNullOrUndefined()) {
        to = nullptr;
        return true;
    }
    *to = from.toObject()->getPrivateInstrusivePtr<T>();
    return true;
}

/////////////////// std::tuple
template <typename Tuple, typename F, std::size_t... Indices>
void se_for_each_tuple_impl(Tuple &&tuple, F &&f, std::index_sequence<Indices...> /*seq*/) { // NOLINT(readability-identifier-naming)
    using swallow = int[];
    (void)swallow{1,
                  (f(Indices, std::get<Indices>(std::forward<Tuple>(tuple))), void(), int{})...};
}

template <typename Tuple, typename F>
void se_for_each_tuple(Tuple &&tuple, F &&f) { // NOLINT(readability-identifier-naming)
    constexpr std::size_t n = std::tuple_size<std::remove_reference_t<Tuple>>::value;
    se_for_each_tuple_impl(std::forward<Tuple>(tuple), std::forward<F>(f),
                           std::make_index_sequence<n>{});
}

template <typename... Args>
bool sevalue_to_native(const se::Value &from, std::tuple<Args...> *to, se::Object *ctx) { // NOLINT
    constexpr size_t argsize = std::tuple_size<std::tuple<Args...>>::value;
    bool result = true;
    se_for_each_tuple(*to, [&](auto i, auto &param) {
        se::Value tmp;
        from.toObject()->getArrayElement(static_cast<uint32_t>(i), &tmp);
        result &= sevalue_to_native(tmp, &param, ctx);
    });
    return result;
}

////////////// ccstd::unordered_map
template <typename V>
bool sevalue_to_native(const se::Value &from, ccstd::unordered_map<ccstd::string, V> *to, se::Object *ctx) { // NOLINT
    se::Object *jsmap = from.toObject();
    ccstd::vector<ccstd::string> allKeys;
    jsmap->getAllKeys(&allKeys);
    bool ret = true;
    se::Value property;
    for (auto &it : allKeys) {
        if (jsmap->getProperty(it.c_str(), &property)) {
            auto &output = (*to)[it];
            ret &= sevalue_to_native(property, &output, jsmap);
        }
    }
    return true;
}

////////////// ccstd::map
template <typename V>
bool sevalue_to_native(const se::Value &from, ccstd::map<ccstd::string, V> *to, se::Object *ctx) { // NOLINT
    se::Object *jsmap = from.toObject();
    ccstd::vector<ccstd::string> allKeys;
    jsmap->getAllKeys(&allKeys);
    bool ret = true;
    se::Value property;
    for (auto &it : allKeys) {
        if (jsmap->getProperty(it.c_str(), &property)) {
            auto &output = (*to)[it];
            ret &= sevalue_to_native(property, &output, jsmap);
        }
    }
    return true;
}

///////////////// ccstd::optional
template <typename T>
bool sevalue_to_native(const se::Value &from, ccstd::optional<T> *to, se::Object *ctx) { // NOLINT
    static_assert(!is_optional<T>::value, "bad match ?");
    if (from.isNullOrUndefined()) {
        to->reset();
        return true;
    }
    T tmp{};
    bool ret = sevalue_to_native(from, &tmp, ctx);
    if constexpr (std::is_move_assignable<T>::value) {
        *to = std::move(tmp);
    } else {
        *to = tmp;
    }
    return ret;
}

//////////////////////  shoter form
template <typename T>
inline bool sevalue_to_native(const se::Value &from, T &&to) { // NOLINT(readability-identifier-naming)
    return sevalue_to_native(from, std::forward<T>(to), static_cast<se::Object *>(nullptr));
}

///////////////////////////////////////////////////////////////////
//////////////////  nativevalue_to_se   ///////////////////////////
///////////////////////////////////////////////////////////////////

template <typename T>
inline bool nativevalue_to_se(T &&from, se::Value &to); // NOLINT(readability-identifier-naming)

template <typename... ARGS>
bool nativevalue_to_se(const ccstd::variant<ARGS...> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename... ARGS>
bool nativevalue_to_se(const ccstd::variant<ARGS...> *from, se::Value &to, se::Object *ctx) { // NOLINT
    if (from) {
        return nativevalue_to_se(*from, to, ctx);
    }

    to.setNull();
    return true;
}

template <typename... ARGS>
bool nativevalue_to_se(ccstd::variant<ARGS...> *from, se::Value &to, se::Object *ctx) { // NOLINT
    if (from != nullptr) {
        return nativevalue_to_se(*from, to, ctx);
    }
    to.setNull();
    return true;
}

template <typename T>
inline bool nativevalue_to_se(const ccstd::vector<T> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename T>
inline bool nativevalue_to_se(const ccstd::vector<T> *from, se::Value &to, se::Object *ctx) { // NOLINT
    return nativevalue_to_se(*from, to, ctx);
}

template <typename T>
inline bool nativevalue_to_se(ccstd::vector<T> *const from, se::Value &to, se::Object *ctx) { // NOLINT
    return nativevalue_to_se(*from, to, ctx);
}

template <typename T>
inline typename std::enable_if<std::is_enum<T>::value, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT
    to.setInt32(static_cast<int32_t>(from));
    return true;
}

template <typename T>
inline typename std::enable_if<std::is_pointer<T>::value, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT
    return native_ptr_to_seval(from, &to);
}

template <typename T>
inline typename std::enable_if<is_jsb_object_v<T>, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT
    return native_ptr_to_seval(from, &to);
}

template <typename T>
inline typename std::enable_if<std::is_arithmetic<T>::value, bool>::type
nativevalue_to_se(const T &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    to.setDouble(static_cast<double>(from));
    return true;
}

// #endif // HAS_CONSTEXPR

//////////////////////////////// forward declaration: nativevalue_to_se ////////////////////////////////

template <typename T>
inline bool nativevalue_to_se(const std::shared_ptr<T> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename T>
inline bool nativevalue_to_se(const cc::IntrusivePtr<T> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename T>
bool nativevalue_to_se(const std::reference_wrapper<T> ref, se::Value &to, se::Object *ctx); // NOLINT

template <typename... ARGS>
bool nativevalue_to_se(const std::tuple<ARGS...> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename T>
inline bool nativevalue_to_se(const ccstd::vector<T> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename K, typename V>
inline bool nativevalue_to_se(const ccstd::unordered_map<K, V> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename K, typename V>
inline bool nativevalue_to_se(const ccstd::map<K, V> &from, se::Value &to, se::Object *ctx); // NOLINT

template <typename T>
inline bool nativevalue_to_se(const cc::TypedArrayTemp<T> &typedArray, se::Value &to, se::Object *ctx); // NOLINT

template <typename K, typename V>
bool nativevalue_to_se(const cc::StablePropertyMap<K, V> &from, se::Value &to, se::Object *ctx); // NOLINT

/// nativevalue_to_se ccstd::optional
template <typename T>
bool nativevalue_to_se(const ccstd::optional<T> &from, se::Value &to, se::Object *ctx) { // NOLINT
    if (!from.has_value()) {
        to.setUndefined();
        return true;
    }
    return nativevalue_to_se(from.value(), to, ctx);
}

template <typename T>
inline bool nativevalue_to_se(const cc::TypedArrayTemp<T> &typedArray, se::Value &to, se::Object *ctx) { // NOLINT
    to.setObject(typedArray.getJSTypedArray());
    return true;
}

template <typename T>
inline bool nativevalue_to_se(const ccstd::vector<T> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    se::HandleObject array(se::Object::createArrayObject(from.size()));
    se::Value tmp;
    for (size_t i = 0; i < from.size(); i++) {
        // If from[i] is on stack, then should create a new object, or
        // JS will hold a freed object.
        if constexpr (!std::is_pointer<T>::value && is_jsb_object_v<T>) {
            auto *pFrom = ccnew T(from[i]);
            nativevalue_to_se(pFrom, tmp, ctx);
            tmp.toObject()->getPrivateObject()->tryAllowDestroyInGC();
        } else {
            nativevalue_to_se(from[i], tmp, ctx);
        }

        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array, true);
    return true;
}

inline bool nativevalue_to_se(const ccstd::vector<bool> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT
    se::HandleObject array(se::Object::createArrayObject(from.size()));
    for (auto i = 0; i < from.size(); i++) {
        array->setArrayElement(i, se::Value(from[i]));
    }
    to.setObject(array);
    return true;
}

template <typename T>
void cc_tmp_set_property(se::Object *obj, T &key, se::Value &value) { // NOLINT(readability-identifier-naming)
    if constexpr (std::is_convertible<T, ccstd::string>::value) {
        obj->setProperty(key, value);
    } else {
        obj->setProperty(std::to_string(key), value);
    }
}

template <typename K, typename V>
inline bool nativevalue_to_se(const ccstd::unordered_map<K, V> &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject ret{se::Object::createPlainObject()};
    se::Value value;
    bool ok = true;
    for (auto &it : from) {
        ok &= nativevalue_to_se(it.second, value, ctx);
        cc_tmp_set_property(ret, it.first, value);
    }
    to.setObject(ret);
    return true;
}
template <typename K, typename V>
inline bool nativevalue_to_se(const ccstd::map<K, V> &from, se::Value &to, se::Object *ctx) { // NOLINT
    se::HandleObject ret{se::Object::createPlainObject()};
    se::Value value;
    bool ok = true;
    for (auto &it : from) {
        ok &= nativevalue_to_se(it.second, value, ctx);
        cc_tmp_set_property(ret, it.first, value);
    }
    to.setObject(ret);
    return true;
}

template <typename T, size_t N>
inline bool nativevalue_to_se(const ccstd::array<T, N> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    se::HandleObject array{se::Object::createArrayObject(N)};
    se::Value tmp;
    for (size_t i = 0; i < N; i++) {
        nativevalue_to_se(from[i], tmp, ctx);
        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array);
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const ccstd::array<uint8_t, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject array{se::Object::createTypedArray(se::Object::TypedArrayType::UINT8, from.data(), N)};
    to.setObject(array);
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const ccstd::array<uint16_t, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject array{se::Object::createTypedArray(se::Object::TypedArrayType::INT16, from.data(), N * sizeof(uint16_t))};
    to.setObject(array);
    return true;
}

template <size_t N>
inline bool nativevalue_to_se(const ccstd::array<float, N> &from, se::Value &to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject array{se::Object::createTypedArray(se::Object::TypedArrayType::FLOAT32, from.data(), N * sizeof(float))};
    to.setObject(array);
    return true;
}

template <typename R, typename... Args>
inline bool nativevalue_to_se(const std::function<R(Args...)> & /*from*/, se::Value & /*to*/, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    SE_LOGE("Can not convert C++ const lambda to JS object");
    return false;
}

template <typename K, typename V>
bool nativevalue_to_se(const cc::StablePropertyMap<K, V> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming
    // convert to object from  attribute/value list: [{"prop1", v1}, {"prop2", v2}... {"propN", vn}]
    se::HandleObject ret(se::Object::createPlainObject());
    for (const auto &ele : from) {
        se::Value keyJS;
        se::Value valueJS;
        if (!nativevalue_to_se(ele.first, keyJS, ctx)) {
            continue;
        }
        if (!nativevalue_to_se(ele.second, valueJS, ctx)) {
            continue;
        }
        ret->setProperty(keyJS.toString(), valueJS);
    }
    to.setObject(ret);
    return true;
}

///////////////////////// function ///////////////////////

template <int i, typename T>
bool nativevalue_to_se_args(se::ValueArray &array, T &&x) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se(std::forward<T>(x), array[i], nullptr);
}
template <int i, typename T, typename... Args>
bool nativevalue_to_se_args(se::ValueArray &array, T &&x, Args &&...args) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se_args<i, T>(array, std::forward<T>(x)) && nativevalue_to_se_args<i + 1, Args...>(array, std::forward<Args>(args)...);
}

template <typename... Args>
bool nativevalue_to_se_args_v(se::ValueArray &array, Args &&...args) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se_args<0, Args...>(array, std::forward<Args>(args)...);
}

// Spine conversions
#if CC_USE_SPINE

template <typename T>
bool nativevalue_to_se(const spine::Vector<T> &v, se::Value &ret, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    se::HandleObject obj(se::Object::createArrayObject(v.size()));
    bool ok = true;

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
    bool ok = true;

    spine::Vector<T *> tmpv = v;

    auto size = static_cast<uint32_t>(tmpv.size());
    for (uint32_t i = 0; i < size; ++i) {
        se::Value tmp;
        ok = native_ptr_to_seval<T>(tmpv[i], &tmp);
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
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    se::Object *obj = v.toObject();
    CC_ASSERT(obj->isArray());

    bool ok = true;
    uint32_t len = 0;
    ok = obj->getArrayLength(&len);
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

template <typename T, typename = std::enable_if<std::is_arithmetic_v<T>>>
bool sevalue_to_native(const se::Value &v, spine::Vector<T> *ret, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    CC_ASSERT_NOT_NULL(ret);
    CC_ASSERT(v.isObject());
    se::Object *obj = v.toObject();
    CC_ASSERT(obj->isArray());

    bool ok = true;
    uint32_t len = 0;
    ok = obj->getArrayLength(&len);
    if (!ok) {
        ret->clear();
        return false;
    }

    se::Value tmp;
    for (uint32_t i = 0; i < len; ++i) {
        ok = obj->getArrayElement(i, &tmp);
        if (!ok || !tmp.isNumber()) {
            ret->clear();
            return false;
        }

        T nativeObj = static_cast<T>(tmp.toDouble());
        ret->add(nativeObj);
    }

    return true;
}
#endif // CC_USE_SPINE

/////////////////// shorter form
template <typename T>
inline bool nativevalue_to_se(T &&from, se::Value &to) { // NOLINT(readability-identifier-naming)
    return nativevalue_to_se(std::forward<typename std::add_const<T>::type>(from), to, nullptr);
}

template <typename... ARGS>
bool nativevalue_to_se(const ccstd::variant<ARGS...> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    bool ok = false;
    ccstd::visit(
        [&](auto &param) {
            ok = nativevalue_to_se(param, to, ctx);
        },
        from);
    return ok;
}

template <typename T>
inline bool nativevalue_to_se(const std::shared_ptr<ccstd::vector<T>> &from, se::Value &to, se::Object *ctx) { // NOLINT
    return nativevalue_to_se(*from, to, ctx);
}

template <typename T>
inline bool nativevalue_to_se(const std::shared_ptr<T> &from, se::Value &to, se::Object *ctx) { // NOLINT

    auto *nativePtr = from.get();
    if (!nativePtr) {
        to.setNull();
        return true;
    }
    se::Class *cls = JSBClassType::findClass(nativePtr);
    se::NativePtrToObjectMap::filter(nativePtr, cls)
        .forEach([&](se::Object *foundObj) {
            to.setObject(foundObj);
        })
        .orElse([&]() {
            CC_ASSERT(cls);
            se::Object *obj = se::Object::createObjectWithClass(cls);
            to.setObject(obj, true);
            obj->setPrivateData(from);
        });
    return true;
}

template <typename T>
inline bool nativevalue_to_se(const cc::IntrusivePtr<T> &from, se::Value &to, se::Object *ctx) { // NOLINT

    auto *nativePtr = from.get();
    if (!nativePtr) {
        to.setNull();
        return true;
    }
    se::Class *cls = JSBClassType::findClass(nativePtr);
    se::NativePtrToObjectMap::filter(nativePtr, cls)
        .forEach([&](se::Object *foundObj) {
            to.setObject(foundObj);
        })
        .orElse([&]() {
            CC_ASSERT(cls);
            se::Object *obj = se::Object::createObjectWithClass(cls);
            to.setObject(obj, true);
            obj->setPrivateData(from);
        });
    return true;
}

template <typename... ARGS>
bool nativevalue_to_se(const std::tuple<ARGS...> &from, se::Value &to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    bool ok = true;
    se::Value tmp;
    se::HandleObject array{se::Object::createArrayObject(sizeof...(ARGS))};
    se_for_each_tuple(
        from, [&](auto i, auto &param) {
            ok &= nativevalue_to_se(param, tmp, ctx);
            array->setArrayElement(static_cast<uint32_t>(i), tmp);
        });
    to.setObject(array);
    return ok;
}

template <typename T>
bool nativevalue_to_se(const std::reference_wrapper<T> ref, se::Value &to, se::Object *ctx) { // NOLINT
    return nativevalue_to_se(ref.get(), to, ctx);
}

// Remove this in near future.
#include "jsb_conversions_deprecated.h"
