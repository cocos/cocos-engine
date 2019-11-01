#ifndef CC_CORE_GFX_INPUT_ASSEMBLER_H_
#define CC_CORE_GFX_INPUT_ASSEMBLER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXInputAssembler : public Object {
 public:
  GFXInputAssembler(GFXDevice* device);
  virtual ~GFXInputAssembler();
  
 public:
  virtual bool Initialize(const GFXInputAssemblerInfo& info) = 0;
  virtual void Destroy() = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE const GFXAttributeList& attributes() const { return attributes_; }
  CC_INLINE const GFXBufferList& vertex_buffers() const { return vertex_buffers_; }
  CC_INLINE GFXBuffer* index_buffer() const { return index_buffer_; }
  CC_INLINE GFXBuffer* indirect_buffer() const { return indirect_buffer_; }
  CC_INLINE uint vertex_count() const { return vertex_count_; }
  CC_INLINE uint first_vertex() const { return first_vertex_; }
  CC_INLINE uint index_count() const { return index_count_; }
  CC_INLINE uint first_index() const { return first_index_; }
  CC_INLINE uint vertex_offset() const { return vertex_offset_; }
  CC_INLINE uint instance_count() const { return instance_count_; }
  CC_INLINE uint first_instance() const { return first_instance_; }
  
  CC_INLINE void set_vertex_count(uint count) { vertex_count_ = count; }
  CC_INLINE void set_first_vertex(uint first) { first_vertex_ = first; }
  CC_INLINE void set_index_count(uint count) { index_count_ = count; }
  CC_INLINE void set_first_index(uint first) { first_index_ = first; }
  CC_INLINE void set_vertex_offset(uint offset) { vertex_offset_ = offset; }
  CC_INLINE void set_instance_count(uint count) { instance_count_ = count; }
  CC_INLINE void set_first_instance(uint first) { first_instance_ = first; }

 protected:
  GFXDevice* device_;
  GFXAttributeList attributes_;
  GFXBufferList vertex_buffers_;
  GFXBuffer* index_buffer_;
  GFXBuffer* indirect_buffer_;
  uint vertex_count_;
  uint first_vertex_;
  uint index_count_;
  uint first_index_;
  uint vertex_offset_;
  uint instance_count_;
  uint first_instance_;
};

NS_CC_END

#endif // CC_CORE_GFX_INPUT_ASSEMBLER_H_
