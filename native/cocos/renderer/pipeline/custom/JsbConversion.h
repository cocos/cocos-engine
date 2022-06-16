/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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
#include "base/std/container/string.h"
#include "base/std/container/vector.h"
#include "base/std/container/map.h"
#include "bindings/manual/jsb_conversions.h"
#include "renderer/pipeline/custom/Map.h"

template <typename T, typename allocator>
inline bool nativevalue_to_se( // NOLINT(readability-identifier-naming)
    const ccstd::vector<T, allocator> &from,
    se::Value &to, se::Object *ctx) {
    se::Object *array = se::Object::createArrayObject(from.size());
    se::Value tmp;
    for (size_t i = 0; i < from.size(); i++) {
        nativevalue_to_se(from[i], tmp, ctx);
        array->setArrayElement(static_cast<uint32_t>(i), tmp);
    }
    to.setObject(array);
    array->decRef();
    return true;
}

template <typename Value, typename Less, typename Allocator>
inline bool nativevalue_to_se( // NOLINT(readability-identifier-naming)
    const ccstd::map<ccstd::string, Value, Less, Allocator> &from,
    se::Value &to, se::Object *ctx) {
    se::Object *ret = se::Object::createPlainObject();
    se::Value value;
    bool ok = true;
    for (auto &it : from) {
        ok &= nativevalue_to_se(it.second, value, ctx);
        cc_tmp_set_property(ret, it.first, value);
    }
    to.setObject(ret);
    ret->decRef();
    return true;
}

inline bool nativevalue_to_se( // NOLINT(readability-identifier-naming)
    const ccstd::pmr::string &from, se::Value &to, se::Object * /*ctx*/) {
    to.setString(from.c_str());
    return true;
}

template <typename T, typename allocator>
bool sevalue_to_native(const se::Value &from, ccstd::vector<T, allocator> *to, se::Object *ctx) { // NOLINT(readability-identifier-naming)
    if (from.isNullOrUndefined()) {
        to->clear();
        return true;
    }

    CC_ASSERT(from.toObject());
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
        CC_ASSERT(std::is_arithmetic<T>::value);
        uint8_t *data = nullptr;
        size_t dataLen = 0;
        array->getTypedArrayData(&data, &dataLen);
        to->assign(reinterpret_cast<T *>(data), reinterpret_cast<T *>(data + dataLen));
        return true;
    }

    SE_LOGE("[warn] failed to convert to ccstd::vector\n");
    return false;
}

template <typename Value, typename Less, typename Allocator>
bool sevalue_to_native(const se::Value &from, ccstd::map<ccstd::string, Value, Less, Allocator> *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
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

inline bool sevalue_to_native(const se::Value &from, ccstd::pmr::string *to, se::Object * /*ctx*/) { // NOLINT(readability-identifier-naming)
    if (!from.isNullOrUndefined()) {
        const auto &str = from.toString();
        to->assign(str.begin(), str.end());
    } else {
        to->clear();
    }
    return true;
}
