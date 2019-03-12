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

#include "RenderInfoMgr.h"
MIDDLEWARE_BEGIN
RenderInfoMgr* RenderInfoMgr::_instance = nullptr;

RenderInfoMgr::RenderInfoMgr ()
{
    init();
}

RenderInfoMgr::~RenderInfoMgr ()
{
    CC_SAFE_DELETE(_buffer);
}

void RenderInfoMgr::afterCleanupHandle()
{
    if (_buffer)
    {
        delete _buffer;
        _buffer = nullptr;
    }
    se::ScriptEngine::getInstance()->addAfterInitHook(std::bind(&RenderInfoMgr::init,this));
}

void RenderInfoMgr::init()
{
    if (!_buffer)
    {
        _buffer = new IOTypedArray(se::Object::TypedArrayType::UINT32, INIT_RENDER_INFO_BUFFER_SIZE);
        _buffer->setResizeCallback([this]
        {
           if (_resizeCallback)
           {
               _resizeCallback();
           }
        });
    }
    se::ScriptEngine::getInstance()->addAfterCleanupHook(std::bind(&RenderInfoMgr::afterCleanupHandle,this));
}

MIDDLEWARE_END
