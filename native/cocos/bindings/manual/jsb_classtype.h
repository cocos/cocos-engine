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

#include "bindings/jswrapper/SeApi.h"

#include <typeinfo>

class JSBClassType {
public:
    template <typename T>
    static void registerClass(se::Class *cls) {
        const char *typeName = typeid(T).name();
        CC_ASSERT(jsbClassTypeMap.find(typeName) == jsbClassTypeMap.end());
        jsbClassTypeMap.emplace(typeName, cls);
    }

    template <typename T>
    static se::Class *findClass(const T *nativeObj) {
        bool found = false;
        const char *typeNameFromValue = typeid(*nativeObj).name();
        auto iter = jsbClassTypeMap.find(typeNameFromValue);
        if (iter == jsbClassTypeMap.end()) {
            const char *typeNameFromType = typeid(T).name();
            iter = jsbClassTypeMap.find(typeNameFromType);
            if (iter != jsbClassTypeMap.end()) {
                found = true;
                jsbClassTypeMap.emplace(typeNameFromValue, iter->second);
            }
        } else {
            found = true;
        }
        return found ? iter->second : nullptr;
    }

    static void cleanup() {
        jsbClassTypeMap.clear();
    }

private:
    static ccstd::unordered_map<const char *, se::Class *> jsbClassTypeMap;
};
