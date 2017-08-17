#pragma once

#include <unordered_map>

namespace se {

    class Object;

    class NativePtrToObjectMap
    {
    public:
        // key: native ptr, value: se::Object
        using Map = std::unordered_map<void*, Object*>;

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
        static Map __nativePtrToObjectMap;

        friend class Object;
    };

    class NonRefNativePtrCreatedByCtorMap
    {
    public:
        // key: native ptr, value: non-ref object created by ctor
        using Map = std::unordered_map<void*, bool>;

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
        static Map __nonRefNativeObjectCreatedByCtorMap;
    };

} // namespace se {
