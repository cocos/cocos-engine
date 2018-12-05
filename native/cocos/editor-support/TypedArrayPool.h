
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
#pragma once
#include <map>
#include <vector>
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "MiddlewareMacro.h"

MIDDLEWARE_BEGIN
/** 
 * TypeArray Pool for IOTypedArray
 */
class TypedArrayPool
{
private:
    static TypedArrayPool* _instance;
public:
    static TypedArrayPool* getInstance()
    {
        if (_instance == nullptr)
        {
            _instance = new TypedArrayPool();
            
        }
        return _instance;
    }
    
    static void destroyInstance()
    {
        if (_instance)
        {
            delete _instance;
            _instance = nullptr;
        }
    }
private:
    typedef se::Object::TypedArrayType arrayType;
    typedef std::vector<se::Object*> objPool;
    typedef std::map<std::size_t, objPool*> fitMap;
    typedef std::map<arrayType, fitMap*> typeMap;
    
    objPool* getObjPool(arrayType type, std::size_t size);
    
    TypedArrayPool();
    ~TypedArrayPool();
    
    void clearPool();
    /**
     * @brief Print all pool data
     */
    void dump();
    
    void afterCleanupHandle();
    void afterInitHandle();
private:
    typeMap _pool;
    bool allowPush = true;
public:
    /**
     * @brief pop a js TypeArray by given type and size
     * @param[in] type TypeArray type.
     * @param[in] size.
     * @return a js TypeArray Object.
     */
    se::Object* pop(arrayType type, std::size_t size);
    /**
     * @brief push a TypeArray back to pool.
     * @param[in] type TypeArray type.
     * @param[in] arrayCapacity TypeArray capacity.
     * @param[in] object TypeArray which want to put in pool.
     */
    void push(arrayType type, std::size_t arrayCapacity, se::Object* object);
};
MIDDLEWARE_END
