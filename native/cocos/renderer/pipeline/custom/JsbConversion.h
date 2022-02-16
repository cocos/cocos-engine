#pragma once
#include <cocos/bindings/manual/jsb_conversions.h>
#include <cocos/renderer/pipeline/custom/Map.h>
#include <cocos/renderer/pipeline/custom/String.h>
#include <boost/container/vector.hpp>

template <typename T, typename allocator>
inline bool nativevalue_to_se( // NOLINT(readability-identifier-naming)
    const boost::container::vector<T, allocator>& from,
    se::Value& to, se::Object* ctx) {
    se::Object* array = se::Object::createArrayObject(from.size());
    se::Value tmp;
    for (size_t i = 0; i < from.size(); i++) {
        nativevalue_to_se(from[i], tmp, ctx);
        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array);
    array->decRef();
    return true;
}

inline bool nativevalue_to_se( // NOLINT(readability-identifier-naming)
    const cc::PmrString& from, se::Value& to, se::Object* /*ctx*/) {
    to.setString(from.c_str());
    return true;
}

template <typename T, typename allocator>
bool sevalue_to_native(const se::Value& from, boost::container::vector<T, allocator>* to, se::Object* ctx) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        to->clear();
        return true;
    }

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

    SE_LOGE("[warn] failed to convert to boost::container::vector\n");
    return false;
}

inline bool sevalue_to_native(const se::Value& from, cc::PmrString* to, se::Object* /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (!from.isNullOrUndefined()) {
        const auto& str = from.toString();
        to->assign(str.begin(), str.end());
    } else {
        to->clear();
    }
    return true;
}
