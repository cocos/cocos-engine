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

MIDDLEWARE_BEGIN
    
MiddlewareManager* MiddlewareManager::_instance = nullptr;

MiddlewareManager::MiddlewareManager()
:_ib(MAX_IB_BUFFER_SIZE)
{
    glGenBuffers(1, &_glIBID);
    
    _vfList.push_back(VF_XYUVC);
    _vfList.push_back(VF_XYUVCC);
    
    for(auto vf : _vfList)
    {
        glGenBuffers(1, &_glVBMap[vf]);
    }
}

MiddlewareManager::~MiddlewareManager()
{
    cocos2d::ccDeleteBuffers(1, &_glIBID);
    
    for (auto vf : _vfList)
    {
        IOBuffer* buffer = _vbMap[vf];
        if (buffer)
        {
            delete buffer;
        }
        cocos2d::ccDeleteBuffers(1, &_glVBMap[vf]);
    }
}

cocos2d::middleware::IOBuffer& MiddlewareManager::getVB(int format)
{
    auto buffer = _vbMap[format];
    if (buffer == nullptr)
    {
        buffer = new IOBuffer(MAX_VB_BUFFER_SIZE);
        _vbMap[format] = buffer;
    }
    return *buffer;
}

void MiddlewareManager::update(float dt)
{
    for (auto it : _vbMap)
    {
        auto buffer = it.second;
        if (buffer)
        {
            buffer->reset();
        }
    }
    _ib.reset();
    
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
    
    for (auto it : _vbMap)
    {
        auto buffer = it.second;
        if (buffer && buffer->isOutRange())
        {
            buffer->resize(buffer->getCapacity() + INCREASE_BUFFER_SIZE, true);
        }
    }
    
    if (_ib.isOutRange())
    {
        _ib.resize(_ib.getCapacity() + INCREASE_BUFFER_SIZE, true);
    }
    
    uploadVB();
    uploadIB();
}

void MiddlewareManager::addTimer(IMiddleware* editor)
{
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

void MiddlewareManager::uploadVB()
{
    for(auto vf : _vfList)
    {
        IOBuffer* vb = _vbMap[vf];
        if (!vb) continue;
        
        uint32_t glVBID = _glVBMap[vf];
        if (glVBID == 0)
        {
            cocos2d::log("Vertex buffer is destroyed");
            continue;
        }
        
        auto length = vb->length();
        if (length == 0) continue;
        
        cocos2d::ccBindBuffer(GL_ARRAY_BUFFER, glVBID);
        glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)length, vb->getBuffer(), GL_DYNAMIC_DRAW);
        cocos2d::ccBindBuffer(GL_ARRAY_BUFFER, 0);
    }
}

void MiddlewareManager::uploadIB()
{
    if (_glIBID == 0)
    {
        cocos2d::log("Index buffer is destroyed");
        return;
    }
    
    auto length = _ib.length();
    if (length == 0) return;
    
    GLint _oldGLID = 0;
    glGetIntegerv(GL_ELEMENT_ARRAY_BUFFER_BINDING, &_oldGLID);
    
    cocos2d::ccBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _glIBID);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)length, _ib.getBuffer(), GL_STATIC_DRAW);
    cocos2d::ccBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _oldGLID);
}
MIDDLEWARE_END
