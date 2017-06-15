#include "jsb_classtype.hpp"

std::unordered_map<std::string, se::Class*> JSBClassType::__jsbClassTypeMap;

void JSBClassType::cleanup()
{
    __jsbClassTypeMap.clear();
}
