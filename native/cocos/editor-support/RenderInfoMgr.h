/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.
 
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

#include "IOTypedArray.h"
#include <functional>

MIDDLEWARE_BEGIN

class RenderInfoMgr {
public:
    static RenderInfoMgr* getInstance ()
    {
        if (_instance == nullptr)
        {
            _instance = new RenderInfoMgr();
        }
        return _instance;
    }

    static void destroyInstance ()
    {
        if (_instance)
        {
            delete _instance;
            _instance = nullptr;
        }
    }

    RenderInfoMgr ();
    virtual ~RenderInfoMgr ();
    
    void reset ()
    {
        _buffer->reset();
    }

    IOTypedArray* getBuffer()
    {
        return _buffer;
    }

    typedef std::function<void()> resizeCallback;
    void setResizeCallback(resizeCallback callback)
    {
        _resizeCallback = callback;
    }

    se_object_ptr getRenderInfo()
    {
        return _buffer->getTypeArray();
    }
private:
    void init();
    void afterCleanupHandle();
private:
    static RenderInfoMgr* _instance;
    IOTypedArray* _buffer = nullptr;
    resizeCallback _resizeCallback = nullptr;
};

MIDDLEWARE_END
