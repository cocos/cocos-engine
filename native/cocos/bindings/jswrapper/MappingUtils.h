/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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

#include <type_traits>
#include "base/std/container/unordered_map.h"
#include "bindings/manual/jsb_classtype.h"

namespace se {

class Object;

class NativePtrToObjectMap {
public:
    // key: native ptr, value: se::Object
    using Map = ccstd::unordered_multimap<void *, Object *>;

    struct OptionalCallback {
        se::Object *seObj{nullptr};
        /**
         * @brief Invoke callback function when object is empty
         */
        template <typename Fn>
        OptionalCallback orElse(const Fn &fn) {
            if (!seObj) {
                fn();
            }
            return *this;
        }
        /**
         * @brief Invoke callback function when object is **NOT** empty
         */
        template <typename Fn>
        OptionalCallback forEach(const Fn &fn) {
            if (seObj) {
                fn(seObj);
            }
            return *this;
        }
    };

    static bool init();
    static void destroy();
    static bool isValid();

    /**
     * @deprecated Use `contains` or `filter` to query or manipulate the elements of the map,
     */
    CC_DEPRECATED(3.7)
    static Map::iterator find(void *v);
    /**
     * @deprecated Use `contains` or `filter` to query or manipulate the elements of the map,
     */
    CC_DEPRECATED(3.7)
    static Map::iterator begin();
    /**
     * @deprecated Use `contains` or `filter` to query or manipulate the elements of the map,
     */
    CC_DEPRECATED(3.7)
    static Map::iterator end();

    static Map::iterator erase(Map::iterator iter);
    static void erase(void *nativeObj);
    static void erase(void *nativeObj, se::Object *);
    static void clear();
    static size_t size();

    static const Map &instance();

    /**
     * @brief Return the first element of the specified key
     */
    template <typename T>
    static se::Object *findFirst(T *nativeObj) {
        auto itr = __nativePtrToObjectMap->find(nativeObj);
        return itr == __nativePtrToObjectMap->end() ? nullptr : itr->second;
    }

    /**
     * @brief Check if the key exists in the map
     */
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

    /**
     * @brief Iterate se::Object with specified key
     */
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
     * @brief Filter se::Object* with key and se::Class value
     */
    template <typename T>
    static OptionalCallback filter(T *nativeObj, se::Class *kls) {
        se::Object *target{nullptr};
        findWithCallback(
            nativeObj, kls,
            [&](se::Object *seObj) {
                target = seObj;
            },
            nullptr);
        return OptionalCallback{target};
    }

private:
    /**
     * @brief Iterate se::Object with specified se::Class
     */
    template <typename T, typename Fn1, typename Fn2>
    static void findWithCallback(T *nativeObj, se::Class *kls, const Fn1 &eachCallback, const Fn2 &&emptyCallback) {
        int eleCount = 0;
        auto range = __nativePtrToObjectMap->equal_range(const_cast<std::remove_const_t<T> *>(nativeObj));
        constexpr bool hasEmptyCallback = std::is_invocable<Fn2>::value;

        if (range.first == range.second) { // empty
            if constexpr (hasEmptyCallback) {
                emptyCallback();
            }
        } else {
            for (auto itr = range.first; itr != range.second; ++itr) {
                if (kls != nullptr && kls != itr->second->_getClass()) {
                    continue;
                }
                eleCount++;
                CC_ASSERT_LT(eleCount, 2);
                eachCallback(itr->second);
            }
            if constexpr (hasEmptyCallback) {
                if (eleCount == 0) {
                    emptyCallback();
                }
            }
        }
    }
    static void emplace(void *nativeObj, Object *seObj);
    static Map *__nativePtrToObjectMap; // NOLINT
    static bool __isValid;              // NOLINT

    friend class Object;
};

} // namespace se
