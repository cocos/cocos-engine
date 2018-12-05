/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
 
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
#include "TypedArrayPool.h"
#include "base/CCLog.h"
#include "base/ccMacros.h"
#include <functional>
#include "MiddlewareMacro.h"

#define POOL_DEBUG 0

#if POOL_DEBUG > 0
#define PoolLog(...) do { fprintf(stdout, __VA_ARGS__); fflush(stdout); } while (false)
#else
#define PoolLog(...)
#endif

MIDDLEWARE_BEGIN
    
const static std::size_t maxPoolSize = 50;

TypedArrayPool* TypedArrayPool::_instance = nullptr;

TypedArrayPool::TypedArrayPool()
{
    se::ScriptEngine::getInstance()->addAfterCleanupHook(std::bind(&TypedArrayPool::afterCleanupHandle,this));
}

TypedArrayPool::~TypedArrayPool()
{
    clearPool();
}

void TypedArrayPool::afterCleanupHandle()
{
    this->allowPush = false;
    clearPool();
    se::ScriptEngine::getInstance()->addAfterInitHook(std::bind(&TypedArrayPool::afterInitHandle,this));
}

void TypedArrayPool::afterInitHandle()
{
    this->allowPush = true;
    se::ScriptEngine::getInstance()->addAfterCleanupHook(std::bind(&TypedArrayPool::afterCleanupHandle,this));
}

void TypedArrayPool::clearPool()
{
    PoolLog("*****clearPool TypeArray pool begin");
    
    //map
    for (auto it = _pool.begin(); it != _pool.end(); it++)
    {
        //map
        fitMap& mapPool = *(it->second);
        for (auto itMapPool = mapPool.begin(); itMapPool != mapPool.end(); itMapPool++)
        {
            //vector
            objPool& itFitPool = *(itMapPool->second);
            PoolLog("clear arrayType:%d,fitSize:%lu,objSize:%lu\n", it->first, itMapPool->first, itFitPool.size());
            for (auto itFit = itFitPool.begin(); itFit != itFitPool.end(); itFit++)
            {
                (*itFit)->unroot();
                (*itFit)->decRef();
            }
            delete &itFitPool;
        }
        delete &mapPool;
    }
    _pool.clear();
    
    PoolLog("*****clearPool TypeArray pool end");
}

void TypedArrayPool::dump()
{
    //map
    for (auto it = _pool.begin(); it != _pool.end(); it++)
    {
        //map
        fitMap& mapPool = *(it->second);
        for (auto itMapPool = mapPool.begin(); itMapPool != mapPool.end(); itMapPool++)
        {
            //vector
            CC_UNUSED objPool& itFitPool = *(itMapPool->second);
            PoolLog("arrayType:%d,fitSize:%lu,objSize:%lu\n", it->first, itMapPool->first, itFitPool.size());
        }
    }
}

se::Object* TypedArrayPool::pop(arrayType type, std::size_t size)
{
    std::size_t fitSize = ceil(size / float(MIN_TYPE_ARRAY_SIZE)) * MIN_TYPE_ARRAY_SIZE;
    objPool* objPoolPtr = getObjPool(type, fitSize);
    
    if (objPoolPtr->size() > 0)
    {
        se::Object* obj = objPoolPtr->back();
        objPoolPtr->pop_back();
        PoolLog("TypedArrayPool:pop result:success,type:%d,fitSize:%lu,objSize:%lu\n", (int)type, fitSize, objPoolPtr->size());
        return obj;
    }
    
    PoolLog("TypedArrayPool:pop result:empty,type:%d,fitSize:%lu,objSize:%lu\n", (int)type, fitSize, objPoolPtr->size());
    se::AutoHandleScope hs;
    auto typeArray = se::Object::createTypedArray(type, nullptr, fitSize);
    typeArray->root();
    return typeArray;
}

TypedArrayPool::objPool* TypedArrayPool::getObjPool(arrayType type, std::size_t fitSize)
{
    auto it = _pool.find(type);
    fitMap* fitMapPtr = nullptr;
    if (it == _pool.end())
    {
        fitMapPtr = new fitMap();
        _pool[type] = fitMapPtr;
    }
    else
    {
        fitMapPtr = it->second;
    }
    
    auto itPool = fitMapPtr->find(fitSize);
    objPool* objPoolPtr = nullptr;
    if (itPool == fitMapPtr->end())
    {
        objPoolPtr = new objPool();
        (*fitMapPtr)[fitSize] = objPoolPtr;
    }
    else
    {
        objPoolPtr = itPool->second;
    }
    
    return objPoolPtr;
}

void TypedArrayPool::push(arrayType type, std::size_t arrayCapacity, se::Object* object)
{
    if (object == nullptr) return;
    
    // If script engine is cleaning,delete object directly
    if (!allowPush)
    {
        object->unroot();
        object->decRef();
        object = nullptr;
        PoolLog("TypedArrayPool:push result:not allow,type:%d,arrayCapacity:%lu\n", (int)type, arrayCapacity);
        return;
    }
    
    objPool* objPoolPtr = getObjPool(type, arrayCapacity);
    auto it = std::find(objPoolPtr->begin(), objPoolPtr->end(), object);
    if (it != objPoolPtr->end())
    {
        PoolLog("TypedArrayPool:push result:repeat\n");
        return;
    }
    
    if (objPoolPtr->size() < maxPoolSize)
    {
        objPoolPtr->push_back(object);
        PoolLog("TypedArrayPool:push result:success,type:%d,arrayCapacity:%lu,objSize:%lu\n", (int)type, arrayCapacity, objPoolPtr->size());
    }
    else{
        object->unroot();
        object->decRef();
        object = nullptr;
    }
}

MIDDLEWARE_END
