#ifndef CC_CORE_GFX_INPUT_ASSEMBLER_H_
#define CC_CORE_GFX_INPUT_ASSEMBLER_H_

#include "GFXDef.h"

namespace cc {

class CC_CORE_API GFXInputAssembler : public GFXObject {
public:
    GFXInputAssembler(GFXDevice *device);
    virtual ~GFXInputAssembler();

public:
    virtual bool initialize(const GFXInputAssemblerInfo &info) = 0;
    virtual void destroy() = 0;

    void extractDrawInfo(GFXDrawInfo &drawInfo) const;

    CC_INLINE GFXDevice *getDevice() const { return _device; }
    CC_INLINE const GFXAttributeList &getAttributes() const { return _attributes; }
    CC_INLINE const GFXBufferList &getVertexBuffers() const { return _vertexBuffers; }
    CC_INLINE GFXBuffer *getIndexBuffer() const { return _indexBuffer; }
    CC_INLINE GFXBuffer *getIndirectBuffer() const { return _indirectBuffer; }
    CC_INLINE uint getVertexCount() const { return _vertexCount; }
    CC_INLINE uint getFirstVertex() const { return _firstVertex; }
    CC_INLINE uint getIndexCount() const { return _indexCount; }
    CC_INLINE uint getFirstIndex() const { return _firstIndex; }
    CC_INLINE uint getVertexOffset() const { return _vertexOffset; }
    CC_INLINE uint getInstanceCount() const { return _instanceCount; }
    CC_INLINE uint getFirstInstance() const { return _firstInstance; }
    CC_INLINE uint getAttributesHash() const { return _attributesHash; }

    CC_INLINE void setVertexCount(uint count) { _vertexCount = count; }
    CC_INLINE void setFirstVertex(uint first) { _firstVertex = first; }
    CC_INLINE void setIndexCount(uint count) { _indexCount = count; }
    CC_INLINE void setFirstIndex(uint first) { _firstIndex = first; }
    CC_INLINE void setVertexOffset(uint offset) { _vertexOffset = offset; }
    CC_INLINE void setInstanceCount(uint count) { _instanceCount = count; }
    CC_INLINE void setFirstInstance(uint first) { _firstInstance = first; }

protected:
    uint computeAttributesHash() const;

    GFXDevice *_device = nullptr;
    GFXAttributeList _attributes;
    GFXBufferList _vertexBuffers;
    GFXBuffer *_indexBuffer = nullptr;
    GFXBuffer *_indirectBuffer = nullptr;
    uint _vertexCount = 0;
    uint _firstVertex = 0;
    uint _indexCount = 0;
    uint _firstIndex = 0;
    uint _vertexOffset = 0;
    uint _instanceCount = 0;
    uint _firstInstance = 0;
    uint _attributesHash = 0;
};

}

#endif // CC_CORE_GFX_INPUT_ASSEMBLER_H_
