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

#include "MeshBuffer.h"
#include "base/CCGLUtils.h"

MIDDLEWARE_BEGIN

MeshBuffer::MeshBuffer(int vertexSize)
: _ib(INIT_INDEX_BUFFER_SIZE)
, _vb(MAX_VERTEX_BUFFER_SIZE * vertexSize)
{
    _vb.setMaxSize(MAX_VERTEX_BUFFER_SIZE * vertexSize);
    _vb.setFullCallback([this]
    {
        uploadVB();
        uploadIB();
        _vb.reset();
        _ib.reset();
        next();
    });
    
    _glIBArr.resize(1);
    glGenBuffers(1, &_glIBArr[0]);
    
    _glVBArr.resize(1);
    glGenBuffers(1, &_glVBArr[0]);
}

MeshBuffer::~MeshBuffer()
{
    auto num = _glVBArr.size();
    for (auto i = 0; i < num; i++)
    {
        cocos2d::ccDeleteBuffers(1, &_glIBArr[i]);
        cocos2d::ccDeleteBuffers(1, &_glVBArr[i]);
    }
    _glIBArr.clear();
    _glVBArr.clear();
}

void MeshBuffer::uploadVB()
{
    auto length = _vb.length();
    if (length == 0) return;
    
    auto glVB = _glVBArr[_bufferPos];
    cocos2d::ccBindBuffer(GL_ARRAY_BUFFER, glVB);
    glBufferData(GL_ARRAY_BUFFER, (GLsizeiptr)length, _vb.getBuffer(), GL_DYNAMIC_DRAW);
    cocos2d::ccBindBuffer(GL_ARRAY_BUFFER, 0);
}

void MeshBuffer::uploadIB()
{
    auto length = _ib.length();
    if (length == 0) return;
    
    GLint _oldGLID = 0;
    glGetIntegerv(GL_ELEMENT_ARRAY_BUFFER_BINDING, &_oldGLID);
    
    auto glIB = _glIBArr[_bufferPos];
    cocos2d::ccBindBuffer(GL_ELEMENT_ARRAY_BUFFER, glIB);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, (GLsizeiptr)length, _ib.getBuffer(), GL_STATIC_DRAW);
    cocos2d::ccBindBuffer(GL_ELEMENT_ARRAY_BUFFER, _oldGLID);
}

void MeshBuffer::next()
{
    _bufferPos++;
    if (_glIBArr.size() <= _bufferPos)
    {
        _glIBArr.resize(_bufferPos + 1);
        glGenBuffers(1, &_glIBArr[_bufferPos]);
    }
    
    if (_glVBArr.size() <= _bufferPos)
    {
        _glVBArr.resize(_bufferPos + 1);
        glGenBuffers(1, &_glVBArr[_bufferPos]);
    }
}

void MeshBuffer::reset()
{
    _bufferPos = 0;
    _vb.reset();
    _ib.reset();
}

MIDDLEWARE_END
