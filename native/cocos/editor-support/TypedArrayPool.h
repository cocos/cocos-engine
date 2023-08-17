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

#pragma once
#include <map>
#include <vector>
#include "MiddlewareMacro.h"
#include "SeApi.h"
#include "engine/EngineEvents.h"

MIDDLEWARE_BEGIN
/** 
 * TypeArray Pool for IOTypedArray
 */
class TypedArrayPool {
private:
    static TypedArrayPool *instance;

public:
    static TypedArrayPool *getInstance() {
        if (instance == nullptr) {
            instance = new TypedArrayPool();
        }
        return instance;
    }

    static void destroyInstance() {
        if (instance) {
            delete instance;
            instance = nullptr;
        }
    }

private:
    using arrayType = se::Object::TypedArrayType;
    using objPool = ccstd::vector<se::Object *>;
    using fitMap = std::map<std::size_t, objPool *>;
    using typeMap = std::map<arrayType, fitMap *>;

    objPool *getObjPool(arrayType type, std::size_t size);

    TypedArrayPool();
    ~TypedArrayPool();

    void clearPool();
    /**
     * @brief Print all pool data
     */
    void dump();

    void afterCleanupHandle();
    void afterInitHandle();

    typeMap _pool;
    bool _allowPush = true;

    cc::events::Close::Listener _closeListener;

public:
    /**
     * @brief pop a js TypeArray by given type and size
     * @param[in] type TypeArray type.
     * @param[in] size.
     * @return a js TypeArray Object.
     */
    se::Object *pop(arrayType type, std::size_t size);
    /**
     * @brief push a TypeArray back to pool.
     * @param[in] type TypeArray type.
     * @param[in] arrayCapacity TypeArray capacity.
     * @param[in] object TypeArray which want to put in pool.
     */
    void push(arrayType type, std::size_t arrayCapacity, se::Object *object);
};
MIDDLEWARE_END
