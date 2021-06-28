/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "GFXObject.h"

namespace cc {
namespace gfx {

class CC_DLL InputAssembler : public GFXObject {
public:
    InputAssembler();
    ~InputAssembler() override;

    void initialize(const InputAssemblerInfo &info);
    void destroy();

    void extractDrawInfo(DrawInfo &drawInfo) const;

    inline const AttributeList &getAttributes() const { return _attributes; }
    inline const BufferList &   getVertexBuffers() const { return _vertexBuffers; }
    inline Buffer *             getIndexBuffer() const { return _indexBuffer; }
    inline Buffer *             getIndirectBuffer() const { return _indirectBuffer; }
    inline uint                 getVertexCount() const { return _vertexCount; }
    inline uint                 getFirstVertex() const { return _firstVertex; }
    inline uint                 getIndexCount() const { return _indexCount; }
    inline uint                 getFirstIndex() const { return _firstIndex; }
    inline uint                 getVertexOffset() const { return _vertexOffset; }
    inline uint                 getInstanceCount() const { return _instanceCount; }
    inline uint                 getFirstInstance() const { return _firstInstance; }
    inline uint                 getAttributesHash() const { return _attributesHash; }

    virtual void setVertexCount(uint count) { _vertexCount = count; }
    virtual void setFirstVertex(uint first) { _firstVertex = first; }
    virtual void setIndexCount(uint count) { _indexCount = count; }
    virtual void setFirstIndex(uint first) { _firstIndex = first; }
    virtual void setVertexOffset(uint offset) { _vertexOffset = offset; }
    virtual void setInstanceCount(uint count) { _instanceCount = count; }
    virtual void setFirstInstance(uint first) { _firstInstance = first; }

protected:
    virtual void doInit(const InputAssemblerInfo &info) = 0;
    virtual void doDestroy()                            = 0;

    uint computeAttributesHash() const;

    AttributeList _attributes;
    BufferList    _vertexBuffers;
    Buffer *      _indexBuffer    = nullptr;
    Buffer *      _indirectBuffer = nullptr;
    uint          _vertexCount    = 0;
    uint          _firstVertex    = 0;
    uint          _indexCount     = 0;
    uint          _firstIndex     = 0;
    uint          _vertexOffset   = 0;
    uint          _instanceCount  = 0;
    uint          _firstInstance  = 0;
    uint          _attributesHash = 0;
};

} // namespace gfx
} // namespace cc
