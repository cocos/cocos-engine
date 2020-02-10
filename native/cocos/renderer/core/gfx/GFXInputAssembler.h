#ifndef CC_CORE_GFX_INPUT_ASSEMBLER_H_
#define CC_CORE_GFX_INPUT_ASSEMBLER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXInputAssembler : public Object {
 public:
  GFXInputAssembler(GFXDevice* device);
  virtual ~GFXInputAssembler();
  
 public:
  virtual bool initialize(const GFXInputAssemblerInfo& info) = 0;
  virtual void destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return _device; }
  CC_INLINE const GFXAttributeList& attributes() const { return _attributes; }
  CC_INLINE const GFXBufferList& vertexBuffers() const { return _vertexBuffers; }
  CC_INLINE GFXBuffer* indexBuffer() const { return _indexBuffer; }
  CC_INLINE GFXBuffer* indirectBuffer() const { return _indirectBuffer; }
  CC_INLINE uint vertexCount() const { return _vertexCount; }
  CC_INLINE uint firstVertex() const { return _firstVertex; }
  CC_INLINE uint indexCount() const { return _indexCount; }
  CC_INLINE uint firstIndex() const { return _firstIndex; }
  CC_INLINE uint vertexOffset() const { return _vertexOffset; }
  CC_INLINE uint instanceCount() const { return _instanceCount; }
  CC_INLINE uint firstInstance() const { return _firstInstance; }
  
  CC_INLINE void setVertexCount(uint count) { _vertexCount = count; }
  CC_INLINE void setFirstVertex(uint first) { _firstVertex = first; }
  CC_INLINE void setIndexCount(uint count) { _indexCount = count; }
  CC_INLINE void setFirstIndex(uint first) { _firstIndex = first; }
  CC_INLINE void setVertexOffset(uint offset) { _vertexOffset = offset; }
  CC_INLINE void setInstanceCount(uint count) { _instanceCount = count; }
  CC_INLINE void setFirstInstance(uint first) { _firstInstance = first; }

 protected:
  GFXDevice* _device = nullptr;
  GFXAttributeList _attributes;
  GFXBufferList _vertexBuffers;
  GFXBuffer* _indexBuffer = nullptr;
  GFXBuffer* _indirectBuffer = nullptr;
  uint _vertexCount = 0;
  uint _firstVertex = 0;
  uint _indexCount = 0;
  uint _firstIndex = 0;
  uint _vertexOffset = 0;
  uint _instanceCount = 0;
  uint _firstInstance = 0;
};

NS_CC_END

#endif // CC_CORE_GFX_INPUT_ASSEMBLER_H_
