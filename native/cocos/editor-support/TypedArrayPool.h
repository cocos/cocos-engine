/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "MiddlewareMacro.h"
#include "SeApi.h"
#include <map>
#include <vector>

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
    using objPool = std::vector<se::Object *>;
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
