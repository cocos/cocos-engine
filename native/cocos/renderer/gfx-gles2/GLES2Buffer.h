#ifndef CC_GFXGLES2_GLES2_BUFFER_H_
#define CC_GFXGLES2_GLES2_BUFFER_H_

CC_NAMESPACE_BEGIN

class GLES2GPUBuffer;

class CC_GLES2_API GLES2Buffer : public GFXBuffer {
public:
  GLES2Buffer(GFXDevice* device);
  ~GLES2Buffer();
  
public:
  bool Initialize(const GFXBufferInfo& info);
  void Destroy();
  void Resize(uint size);
  void Update(void* buffer, uint offset, uint size);
  
  CC_INLINE GLES2GPUBuffer* gpu_buffer() const { return gpu_buffer_; }

private:
  GLES2GPUBuffer* gpu_buffer_;
};

CC_NAMESPACE_END

#endif
