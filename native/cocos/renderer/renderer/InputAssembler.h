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

#include "../Types.h"
#include "../Macro.h"

RENDERER_BEGIN

class VertexBuffer;
class IndexBuffer;

/**
 * @addtogroup renderer
 * @{
 */

/**
 *  @brief InputAssembler is an fundamental data structure to store vertex buffer and index buffer.
 */
class InputAssembler
{
public:
    InputAssembler();
    InputAssembler(const InputAssembler& o);
    InputAssembler(InputAssembler&& o);
    ~InputAssembler();
    
    InputAssembler& operator=(const InputAssembler& o);
    InputAssembler& operator=(InputAssembler&& o);

    /**
     *  @brief Initializes with vertex buffer, index buffer and primitive type.
     */
    bool init(VertexBuffer* vb,
              IndexBuffer* ib,
              PrimitiveType pt = PrimitiveType::TRIANGLES);
    /**
     *  @brief Gets the primitive count.
     */
    uint32_t getPrimitiveCount() const;

    /**
     *  @brief Sets the vertex buffer.
     */
    void setVertexBuffer(VertexBuffer* vb);
    /**
     *  @brief Gets the vertex buffer.
     */
    inline VertexBuffer* getVertexBuffer() const { return _vertexBuffer; }
    /**
     *  @brief Sets the index buffer.
     */
    void setIndexBuffer(IndexBuffer* ib);
    /**
     *  @brief Gets the index buffer.
     */
    inline IndexBuffer* getIndexBuffer() const { return _indexBuffer; }

    /**
     *  @brief Sets the index offset in buffer.
     */
    inline void setStart(int start) { _start = start; }
    /**
     *  @brief Gets the index offset in buffer.
     */
    inline int getStart() const { return _start; }
    /**
     *  @brief Sets the count of indices.
     */
    inline void setCount(int count) { _count = count; }
    /**
     *  @brief Gets the count of indices.
     */
    inline int getCount() const { return _count; }
    /**
     *  @brief Gets the primitive type.
     */
    inline PrimitiveType getPrimitiveType() const { return _primitiveType; }
    /**
     *  @brief Sets the primitive type.
     */
    inline void setPrimitiveType(PrimitiveType type) { _primitiveType = type; }
    /**
     *  @brief Clears all field.
     */
    void clear();
    /**
     *  @brief Can be merge.
     */
    bool isMergeable(const InputAssembler& ia) const;
private:
    friend class BaseRenderer;
    
    VertexBuffer* _vertexBuffer = nullptr;
    IndexBuffer* _indexBuffer = nullptr;
    PrimitiveType _primitiveType = PrimitiveType::TRIANGLES;
    int _start = 0;
    int _count = -1;
};

// end of renderer group
/// @}
RENDERER_END
