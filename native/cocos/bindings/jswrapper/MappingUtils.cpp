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

#include "MappingUtils.h"
#include "base/memory/Memory.h"

namespace se {

// NativePtrToObjectMap
NativePtrToObjectMap::Map *NativePtrToObjectMap::__nativePtrToObjectMap = nullptr; // NOLINT
bool NativePtrToObjectMap::__isValid = false;                                      // NOLINT

bool NativePtrToObjectMap::init() {
    if (__nativePtrToObjectMap == nullptr) {
        __nativePtrToObjectMap = ccnew NativePtrToObjectMap::Map();
    }
    __isValid = true;
    return __nativePtrToObjectMap != nullptr;
}

void NativePtrToObjectMap::destroy() {
    if (__nativePtrToObjectMap != nullptr) {
        delete __nativePtrToObjectMap;
        __nativePtrToObjectMap = nullptr;
    }
    __isValid = false;
}

bool NativePtrToObjectMap::isValid() {
    return __isValid;
}

CC_DEPRECATED(3.7)
NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::find(void *v) {
    return __nativePtrToObjectMap->find(v);
}

CC_DEPRECATED(3.7)
NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::begin() {
    return __nativePtrToObjectMap->begin();
}

CC_DEPRECATED(3.7)
NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::end() {
    return __nativePtrToObjectMap->end();
}

void NativePtrToObjectMap::emplace(void *nativeObj, Object *seObj) {
    __nativePtrToObjectMap->emplace(nativeObj, seObj);
}

NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::erase(Map::iterator iter) {
    return __nativePtrToObjectMap->erase(iter);
}

void NativePtrToObjectMap::erase(void *nativeObj) {
    __nativePtrToObjectMap->erase(nativeObj);
}

void NativePtrToObjectMap::erase(void *nativeObj, se::Object *obj) {
    auto range = __nativePtrToObjectMap->equal_range(nativeObj);
    for (auto itr = range.first; itr != range.second; itr++) {
        if (itr->second == obj) {
            __nativePtrToObjectMap->erase(itr);
            break;
        }
    }
}

void NativePtrToObjectMap::clear() {
    __nativePtrToObjectMap->clear();
}

size_t NativePtrToObjectMap::size() {
    return __nativePtrToObjectMap->size();
}

const NativePtrToObjectMap::Map &NativePtrToObjectMap::instance() {
    return *__nativePtrToObjectMap;
}

} // namespace se
