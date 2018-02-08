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

#include "base/CCRef.h"
#include "../Types.h"
#include "../Macro.h"

RENDERER_BEGIN

class VertexBuffer;
class IndexBuffer;

class InputAssembler : public Ref
{
public:
    InputAssembler();
    ~InputAssembler();

    bool init(VertexBuffer* vb,
              IndexBuffer* ib,
              PrimitiveType pt = PrimitiveType::TRIANGLES);
    
    uint32_t getPrimitiveCount() const;

    void setVertexBuffer(VertexBuffer* vb);
    inline VertexBuffer* getVertexBuffer() const { return _vertexBuffer; }
    void setIndexBuffer(IndexBuffer* ib);
    inline IndexBuffer* getIndexBuffer() const { return _indexBuffer; }

    inline void setStart(int start) { _start = start; }
    inline int getStart() const { return _start; }
    inline void setCount(int count) { _count = count; }
    inline int getCount() const { return _count; }
    inline PrimitiveType getPrimitiveType() const { return _primitiveType; }
    inline void setPrimitiveType(PrimitiveType type) { _primitiveType = type; }

private:
    friend class BaseRenderer;
    
    VertexBuffer* _vertexBuffer = nullptr;
    IndexBuffer* _indexBuffer = nullptr;
    PrimitiveType _primitiveType = PrimitiveType::TRIANGLES;
    int _start = 0;
    int _count = -1;
};

RENDERER_END
