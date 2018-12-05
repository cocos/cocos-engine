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

#include "IOBuffer.h"
#include "base/ccMacros.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "MiddlewareMacro.h"

MIDDLEWARE_BEGIN
/**
 * Inherit from IOBuffer.
 */
class IOTypedArray: public IOBuffer
{
public:
    /**
     * @brief constructor
     * @param[in] arrayType TypeArray type
     * @param[in] defaultSize TypeArray capacity
     * @param[in] usePool If true,will get TypeArray from pool,or create TypeArray,default false.
     */
    IOTypedArray (se::Object::TypedArrayType arrayType, std::size_t defaultSize, bool usePool = false);
    virtual ~IOTypedArray ();
    
    inline se::Object* getTypeArray () const
    {
        return _typeArray;
    }

    virtual void resize(std::size_t newLen, bool needCopy = false) override;
    
private:
    se::Object::TypedArrayType  _arrayType = se::Object::TypedArrayType::NONE;
    se::Object*                 _typeArray = nullptr;
    bool                        _usePool = false;
};

MIDDLEWARE_END
