/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

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

#include <type_traits>
#include "base/std/container/unordered_map.h"
#include "bindings/manual/jsb_classtype.h"

namespace se {

class Object;

class NativePtrToObjectMap {
public:
    // key: native ptr, value: se::Object
    using Map = ccstd::unordered_multimap<void *, Object *>;

    static bool init();
    static void destroy();
    static bool isValid();

    CC_DEPRECATED(3.7)
    static Map::iterator find(void *v);
    CC_DEPRECATED(3.7)
    static Map::iterator begin();
    CC_DEPRECATED(3.7)
    static Map::iterator end();

    static Map::iterator erase(Map::iterator iter);
    static void erase(void *nativeObj);
    static void erase(void *nativeObj, se::Object *);
    static void clear();
    static size_t size();

    static const Map &instance();

    template <typename T>
    static se::Object *first(T *nativeObj) {
        auto itr = __nativePtrToObjectMap->find(nativeObj);
        return itr == __nativePtrToObjectMap->end() ? nullptr : itr->second;
    }
    template <typename T>
    static bool contains(T *nativeObj) {
        if constexpr (std::is_void_v<T>) {
            return __nativePtrToObjectMap->count(nativeObj) > 0;
        } else {
            auto *kls = JSBClassType::findClass(nativeObj);
            auto range = __nativePtrToObjectMap->equal_range(nativeObj);
            for (auto itr = range.first; itr != range.second; itr++) {
                if (itr->second->_getClass() == kls) {
                    return true;
                }
            }
            return false;
        }
    }
    template <typename T, typename Fn>
    static void forEach(T *nativeObj, const Fn &func) {
        se::Class *kls = nullptr;
        if constexpr (!std::is_void_v<T>) {
            kls = JSBClassType::findClass(nativeObj);
        }
        auto range = __nativePtrToObjectMap->equal_range(nativeObj);
        for (auto itr = range.first; itr != range.second; itr++) {
            if (kls != nullptr && kls != itr->second->_getClass()) {
                continue;
            }
            func(itr->second);
        }
    }
    /**
     * @brief Iterate se::Object with specified se::Class
     *
     * @tparam T
     * @tparam Fn1
     * @tparam Fn2
     * @param nativeObj
     * @param kls
     * @param eachCallback callback for each Object
     * @param emptyCallback invoke when no element found
     */
    template <typename T, typename Fn1, typename Fn2>
    static void forEach(T *nativeObj, se::Class *kls, Fn1 eachCallback, Fn2 emptyCallback) {
        int eleCount = 0;
        auto range = __nativePtrToObjectMap->equal_range(const_cast<std::remove_const_t<T> *>(nativeObj));

        if (range.first == range.second) { // empty
            if constexpr (std::is_invocable<Fn2>::value) {
                emptyCallback();
            }
        } else {
            for (auto itr = range.first; itr != range.second; ++itr) {
                if (kls != nullptr && kls != itr->second->_getClass()) {
                    continue;
                }
                eleCount++;
                assert(eleCount < 2);
                eachCallback(itr->second);
            }
            if (eleCount == 0) {
                if constexpr (std::is_invocable<Fn2>::value) {
                    emptyCallback();
                }
            }
        }
    }
    template <typename T, typename Fn1>
    static void with(T *nativeObj, se::Class *kls, Fn1 foundCb) {
        forEach(nativeObj, kls, foundCb, nullptr);
    }

private:
    static void emplace(void *nativeObj, Object *seObj);
    static Map *__nativePtrToObjectMap; // NOLINT
    static bool __isValid;              // NOLINT

    friend class Object;
};

} // namespace se
