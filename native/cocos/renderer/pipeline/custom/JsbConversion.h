#pragma once
#include <cocos/bindings/manual/jsb_conversions.h>
#include <cocos/renderer/pipeline/custom/Map.h>
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
