#pragma once

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"

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
    static se::Class* findClass(T* nativeObj)
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
