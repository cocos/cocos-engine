/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

#include "TypedArrayPool.h"
#include <cmath>
#include <functional>
#include "MiddlewareMacro.h"
#include "base/Log.h"
#include "base/Macros.h"
#include "cocos/bindings/event/EventDispatcher.h"

#define POOL_DEBUG 0

#if POOL_DEBUG > 0
    #define PoolLog(...)                  \
        do {                              \
            fprintf(stdout, __VA_ARGS__); \
            fflush(stdout);               \
        } while (false)
#else
    #define POOL_LOG(...)
#endif

MIDDLEWARE_BEGIN

const static std::size_t MAX_POOL_SIZE = 50;

TypedArrayPool *TypedArrayPool::instance = nullptr;

TypedArrayPool::TypedArrayPool() {
    _closeListener.bind([this]() {
        clearPool();
    });
}

TypedArrayPool::~TypedArrayPool() {
    clearPool();
}

void TypedArrayPool::clearPool() {
    POOL_LOG("*****clearPool TypeArray pool begin");

    //map
    for (auto &it : _pool) {
        //map
        fitMap &mapPool = *(it.second);
        for (auto &itMapPool : mapPool) {
            //vector
            objPool &itFitPool = *(itMapPool.second);
            POOL_LOG("clear arrayType:%d,fitSize:%lu,objSize:%lu\n", it->first, itMapPool->first, itFitPool.size());
            for (auto &itFit : itFitPool) {
                itFit->unroot();
                itFit->decRef();
            }
            delete &itFitPool;
        }
        delete &mapPool;
    }
    _pool.clear();

    POOL_LOG("*****clearPool TypeArray pool end");
}

void TypedArrayPool::dump() {
    //map
    for (auto &it : _pool) {
        //map
        fitMap &mapPool = *(it.second);
        for (auto &itMapPool : mapPool) {
            //vector
            CC_UNUSED objPool &itFitPool = *(itMapPool.second);
            POOL_LOG("arrayType:%d,fitSize:%lu,objSize:%lu\n", it->first, itMapPool->first, itFitPool.size());
        }
    }
}

se::Object *TypedArrayPool::pop(arrayType type, std::size_t size) {
    auto fitSize = static_cast<std::size_t>(std::ceil(static_cast<float>(size) / float(MIN_TYPE_ARRAY_SIZE)) * MIN_TYPE_ARRAY_SIZE);
    objPool *objPoolPtr = getObjPool(type, fitSize);

    if (!objPoolPtr->empty()) {
        se::Object *obj = objPoolPtr->back();
        objPoolPtr->pop_back();
        POOL_LOG("TypedArrayPool:pop result:success,type:%d,fitSize:%lu,objSize:%lu\n", (int)type, fitSize, objPoolPtr->size());
        return obj;
    }

    POOL_LOG("TypedArrayPool:pop result:empty,type:%d,fitSize:%lu,objSize:%lu\n", (int)type, fitSize, objPoolPtr->size());
    se::AutoHandleScope hs;
    auto *typeArray = se::Object::createTypedArray(type, nullptr, fitSize);
    typeArray->root();
    return typeArray;
}

TypedArrayPool::objPool *TypedArrayPool::getObjPool(arrayType type, std::size_t fitSize) {
    auto it = _pool.find(type);
    fitMap *fitMapPtr = nullptr;
    if (it == _pool.end()) {
        fitMapPtr = new fitMap();
        _pool[type] = fitMapPtr;
    } else {
        fitMapPtr = it->second;
    }

    auto itPool = fitMapPtr->find(fitSize);
    objPool *objPoolPtr = nullptr;
    if (itPool == fitMapPtr->end()) {
        objPoolPtr = new objPool();
        (*fitMapPtr)[fitSize] = objPoolPtr;
    } else {
        objPoolPtr = itPool->second;
    }

    return objPoolPtr;
}

void TypedArrayPool::push(arrayType type, std::size_t arrayCapacity, se::Object *object) {
    if (object == nullptr) return;

    // If script engine is cleaning,delete object directly
    if (!_allowPush) {
        object->unroot();
        object->decRef();
        object = nullptr;
        POOL_LOG("TypedArrayPool:push result:not allow,type:%d,arrayCapacity:%lu\n", (int)type, arrayCapacity);
        return;
    }

    objPool *objPoolPtr = getObjPool(type, arrayCapacity);
    auto it = std::find(objPoolPtr->begin(), objPoolPtr->end(), object);
    if (it != objPoolPtr->end()) {
        POOL_LOG("TypedArrayPool:push result:repeat\n");
        return;
    }

    if (objPoolPtr->size() < MAX_POOL_SIZE) {
        objPoolPtr->push_back(object);
        POOL_LOG("TypedArrayPool:push result:success,type:%d,arrayCapacity:%lu,objSize:%lu\n", (int)type, arrayCapacity, objPoolPtr->size());
    } else {
        object->unroot();
        object->decRef();
        object = nullptr;
    }
}

MIDDLEWARE_END
