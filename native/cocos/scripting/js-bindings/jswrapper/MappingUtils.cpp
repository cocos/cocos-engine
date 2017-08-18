//
//  MappingUtils.cpp
//  cocos2d_js_bindings
//
//  Created by James Chen on 8/17/17.
//
//

#include "MappingUtils.hpp"

namespace se {

// NativePtrToObjectMap
NativePtrToObjectMap::Map* NativePtrToObjectMap::__nativePtrToObjectMap = nullptr;

bool NativePtrToObjectMap::init()
{
    if (__nativePtrToObjectMap == nullptr)
        __nativePtrToObjectMap = new (std::nothrow) NativePtrToObjectMap::Map();

    return __nativePtrToObjectMap != nullptr;
}

void NativePtrToObjectMap::destroy()
{
    if (__nativePtrToObjectMap != nullptr)
    {
        delete __nativePtrToObjectMap;
        __nativePtrToObjectMap = nullptr;
    }
}

void NativePtrToObjectMap::emplace(void* nativeObj, Object* seObj)
{
    __nativePtrToObjectMap->emplace(nativeObj, seObj);
}

NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::find(void* nativeObj)
{
    return __nativePtrToObjectMap->find(nativeObj);
}

NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::erase(Map::iterator iter)
{
    return __nativePtrToObjectMap->erase(iter);
}

void NativePtrToObjectMap::erase(void* nativeObj)
{
    __nativePtrToObjectMap->erase(nativeObj);
}

void NativePtrToObjectMap::clear()
{
    __nativePtrToObjectMap->clear();
}

size_t NativePtrToObjectMap::size()
{
    return __nativePtrToObjectMap->size();
}

const NativePtrToObjectMap::Map& NativePtrToObjectMap::instance()
{
    return *__nativePtrToObjectMap;
}

NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::begin()
{
    return __nativePtrToObjectMap->begin();
}

NativePtrToObjectMap::Map::iterator NativePtrToObjectMap::end()
{
    return __nativePtrToObjectMap->end();
}

// NonRefNativePtrCreatedByCtorMap

NonRefNativePtrCreatedByCtorMap::Map* NonRefNativePtrCreatedByCtorMap::__nonRefNativeObjectCreatedByCtorMap = nullptr;

bool NonRefNativePtrCreatedByCtorMap::init()
{
    if (__nonRefNativeObjectCreatedByCtorMap == nullptr)
        __nonRefNativeObjectCreatedByCtorMap = new (std::nothrow) NonRefNativePtrCreatedByCtorMap::Map();

    return __nonRefNativeObjectCreatedByCtorMap != nullptr;
}

void NonRefNativePtrCreatedByCtorMap::destroy()
{
    if (__nonRefNativeObjectCreatedByCtorMap != nullptr)
    {
        delete __nonRefNativeObjectCreatedByCtorMap;
        __nonRefNativeObjectCreatedByCtorMap = nullptr;
    }
}

void NonRefNativePtrCreatedByCtorMap::emplace(void* nativeObj)
{
    __nonRefNativeObjectCreatedByCtorMap->emplace(nativeObj, true);
}

NonRefNativePtrCreatedByCtorMap::Map::iterator NonRefNativePtrCreatedByCtorMap::find(void* nativeObj)
{
    return __nonRefNativeObjectCreatedByCtorMap->find(nativeObj);
}

NonRefNativePtrCreatedByCtorMap::Map::iterator NonRefNativePtrCreatedByCtorMap::erase(Map::iterator iter)
{
    return __nonRefNativeObjectCreatedByCtorMap->erase(iter);
}

void NonRefNativePtrCreatedByCtorMap::erase(void* nativeObj)
{
    __nonRefNativeObjectCreatedByCtorMap->erase(nativeObj);
}

void NonRefNativePtrCreatedByCtorMap::clear()
{
    __nonRefNativeObjectCreatedByCtorMap->clear();
}

size_t NonRefNativePtrCreatedByCtorMap::size()
{
    return __nonRefNativeObjectCreatedByCtorMap->size();
}

const NonRefNativePtrCreatedByCtorMap::Map& NonRefNativePtrCreatedByCtorMap::instance()
{
    return *__nonRefNativeObjectCreatedByCtorMap;
}

NonRefNativePtrCreatedByCtorMap::Map::iterator NonRefNativePtrCreatedByCtorMap::begin()
{
    return __nonRefNativeObjectCreatedByCtorMap->begin();
}

NonRefNativePtrCreatedByCtorMap::Map::iterator NonRefNativePtrCreatedByCtorMap::end()
{
    return __nonRefNativeObjectCreatedByCtorMap->end();
}



} // namespace se {
