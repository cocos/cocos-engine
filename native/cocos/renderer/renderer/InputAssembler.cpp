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

#include "InputAssembler.h"
#include "gfx/VertexBuffer.h"
#include "gfx/IndexBuffer.h"

RENDERER_BEGIN

InputAssembler::InputAssembler()
{
}

InputAssembler::InputAssembler(const InputAssembler& o)
{
    *this = o;
}

InputAssembler::InputAssembler(InputAssembler&& o)
{
    *this = std::move(o);
}

InputAssembler::~InputAssembler()
{
    RENDERER_SAFE_RELEASE(_vertexBuffer);
    RENDERER_SAFE_RELEASE(_indexBuffer);
}

void InputAssembler::clear()
{
    CC_SAFE_RELEASE(_vertexBuffer);
    CC_SAFE_RELEASE(_indexBuffer);
    
    _vertexBuffer = nullptr;
    _indexBuffer = nullptr;
    _primitiveType = PrimitiveType::TRIANGLES;
    _start = 0;
    _count = -1;
}

InputAssembler& InputAssembler::operator=(const InputAssembler& o)
{
    CC_SAFE_RELEASE(_vertexBuffer);
    CC_SAFE_RELEASE(_indexBuffer);
    
    _vertexBuffer = o._vertexBuffer;
    _indexBuffer = o._indexBuffer;
    _start = o._start;
    _count = o._count;
    _primitiveType = o._primitiveType;
    
    CC_SAFE_RETAIN(_vertexBuffer);
    CC_SAFE_RETAIN(_indexBuffer);
    
    return *this;
}

InputAssembler& InputAssembler::operator=(InputAssembler&& o)
{
    CC_SAFE_RELEASE(_vertexBuffer);
    CC_SAFE_RELEASE(_indexBuffer);
    
    _vertexBuffer = o._vertexBuffer;
    _indexBuffer = o._indexBuffer;
    _start = o._start;
    _count = o._count;
    _primitiveType = o._primitiveType;
    
    o._indexBuffer = nullptr;
    o._vertexBuffer = nullptr;
    o._start = 0;
    o._count = -1;
    
    return *this;
}

bool InputAssembler::init(VertexBuffer* vb,
                          IndexBuffer* ib,
                          PrimitiveType pt/* = PrimitiveType::TRIANGLES*/)
{
    setVertexBuffer(vb);
    setIndexBuffer(ib);
    _primitiveType = pt;
    return true;
}

void InputAssembler::setVertexBuffer(VertexBuffer* vb)
{
    RENDERER_SAFE_RELEASE(_vertexBuffer);
    _vertexBuffer = vb;
    RENDERER_SAFE_RETAIN(_vertexBuffer);
}

void InputAssembler::setIndexBuffer(IndexBuffer* ib)
{
    RENDERER_SAFE_RELEASE(_indexBuffer);
    _indexBuffer = ib;
    RENDERER_SAFE_RETAIN(_indexBuffer);
}

uint32_t InputAssembler::getPrimitiveCount() const
{
    if (-1 != _count)
        return _count;
    
    if (_indexBuffer)
        return _indexBuffer->getCount();
    
    assert(_vertexBuffer);
    return _vertexBuffer->getCount();
}

bool InputAssembler::isMergeable(const InputAssembler& ia) const
{
    if (_indexBuffer != ia._indexBuffer || _vertexBuffer != ia._vertexBuffer)
    {
        return false;
    }
    return (_start + _count) == ia._start;
}

RENDERER_END
