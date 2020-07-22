/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#include "scripting/js-bindings/jswrapper/SeApi.h"

#include <typeinfo>

class JSBClassType
{
public:
    static bool init();
    static void destroy();

    template<typename T>
    static void registerClass(se::Class* cls)
    {
        const char* typeName = typeid(T).name();
        assert(__jsbClassTypeMap->find(typeName) == __jsbClassTypeMap->end());
        __jsbClassTypeMap->emplace(typeName, cls);
    }

    template<typename T>
    static se::Class* findClass(const T* nativeObj)
    {
        bool found = false;
        std::string typeName = typeid(*nativeObj).name();
        auto iter = __jsbClassTypeMap->find(typeName);
        if (iter == __jsbClassTypeMap->end())
        {
            typeName = typeid(T).name();
            iter = __jsbClassTypeMap->find(typeName);
            if (iter != __jsbClassTypeMap->end())
            {
                found = true;
            }
        }
        else
        {
            found = true;
        }
        return found ? iter->second : nullptr;
    }

    static void cleanup();

private:
    using Map = std::unordered_map<std::string, se::Class*>;
    static Map* __jsbClassTypeMap;
};
