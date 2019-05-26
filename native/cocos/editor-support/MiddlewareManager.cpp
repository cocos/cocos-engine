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
#include "MiddlewareManager.h"
#include "base/CCGLUtils.h"
#include "scripting/js-bindings/jswrapper/SeApi.h"
#include "RenderInfoMgr.h"

MIDDLEWARE_BEGIN
    
MiddlewareManager* MiddlewareManager::_instance = nullptr;

MiddlewareManager::MiddlewareManager()
{
    
}

MiddlewareManager::~MiddlewareManager()
{
    for (auto it : _mbMap)
    {
        auto buffer = it.second;
        if (buffer)
        {
            delete buffer;
        }
    }
    _mbMap.clear();
}

MeshBuffer* MiddlewareManager::getMeshBuffer(int format)
{
    MeshBuffer* mb = _mbMap[format];
    if (!mb)
    {
        mb = new MeshBuffer(format);
        _mbMap[format] = mb;
    }
    return mb;
}

void MiddlewareManager::update(float dt)
{
    for (auto it : _mbMap)
    {
        auto buffer = it.second;
        if (buffer)
        {
            buffer->reset();
        }
    }
    
    // reset render info
    auto renderInfoMgr = RenderInfoMgr::getInstance();
    renderInfoMgr->reset();
    auto renderInfo = renderInfoMgr->getBuffer();
    if (renderInfo)
    {
        renderInfo->writeUint32(0);
    }
    
    isUpdating = true;
    
    for (auto it = _updateMap.begin(); it != _updateMap.end(); it++)
    {
        auto editor = it->first;
        if (_removeList.size() > 0)
        {
            auto removeIt = std::find(_removeList.begin(), _removeList.end(), editor);
            if (removeIt == _removeList.end())
            {
                editor->update(dt);
            }
        }
        else
        {
            editor->update(dt);
        }
    }
    
    isUpdating = false;
    
    for (std::size_t i = 0; i < _removeList.size(); i++)
    {
        auto editor = _removeList[i];
        auto it = _updateMap.find(editor);
        if (it != _updateMap.end())
        {
            _updateMap.erase(it);
        }
    }
    
    _removeList.clear();
    
    for (auto it : _mbMap)
    {
        auto buffer = it.second;
        if (buffer)
        {
            buffer->uploadIB();
            buffer->uploadVB();
        }
    }
}

void MiddlewareManager::addTimer(IMiddleware* editor)
{
    auto it = std::find(_removeList.begin(), _removeList.end(), editor);
    if (it != _removeList.end())
    {
        _removeList.erase(it);
    }
    _updateMap[editor] = true;
}

void MiddlewareManager::removeTimer(IMiddleware* editor)
{
    if (isUpdating)
    {
        _removeList.push_back(editor);
    }
    else
    {
        auto it = _updateMap.find(editor);
        if (it != _updateMap.end())
        {
            _updateMap.erase(it);
        }
    }
}
MIDDLEWARE_END
