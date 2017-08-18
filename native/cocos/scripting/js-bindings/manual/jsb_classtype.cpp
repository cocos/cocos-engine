#include "jsb_classtype.hpp"

JSBClassType::Map* JSBClassType::__jsbClassTypeMap = nullptr;

bool JSBClassType::init()
{
    if (__jsbClassTypeMap == nullptr)
        __jsbClassTypeMap = new (std::nothrow) Map();

    return __jsbClassTypeMap != nullptr;
}

void JSBClassType::destroy()
{
    if (__jsbClassTypeMap != nullptr)
    {
        delete __jsbClassTypeMap;
        __jsbClassTypeMap = nullptr;
    }
}

void JSBClassType::cleanup()
{
    __jsbClassTypeMap->clear();
}
