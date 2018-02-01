/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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

#include <unordered_map>

namespace se {

    class Object;

    class NativePtrToObjectMap
    {
    public:
        // key: native ptr, value: se::Object
        using Map = std::unordered_map<void*, Object*>;

        static bool init();
        static void destroy();

        static Map::iterator find(void* nativeObj);
        static Map::iterator erase(Map::iterator iter);
        static void erase(void* nativeObj);
        static void clear();
        static size_t size();

        static const Map& instance();

        static Map::iterator begin();
        static Map::iterator end();

    private:
        static void emplace(void* nativeObj, Object* seObj);
        static Map* __nativePtrToObjectMap;

        friend class Object;
    };

    class NonRefNativePtrCreatedByCtorMap
    {
    public:
        // key: native ptr, value: non-ref object created by ctor
        using Map = std::unordered_map<void*, bool>;

        static bool init();
        static void destroy();

        static void emplace(void* nativeObj);
        static Map::iterator find(void* nativeObj);
        static Map::iterator erase(Map::iterator iter);
        static void erase(void* nativeObj);
        static void clear();
        static size_t size();

        static const Map& instance();

        static Map::iterator begin();
        static Map::iterator end();

    private:
        static Map* __nonRefNativeObjectCreatedByCtorMap;
    };

} // namespace se {
