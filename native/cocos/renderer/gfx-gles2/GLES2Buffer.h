#ifndef CC_GFXGLES2_GLES2_BUFFER_H_
#define CC_GFXGLES2_GLES2_BUFFER_H_

NS_CC_BEGIN

class GLES2GPUBuffer;

class CC_GLES2_API GLES2Buffer : public GFXBuffer {
public:
  GLES2Buffer(GFXDevice* device);
  ~GLES2Buffer();
  
public:
  bool initialize(const GFXBufferInfo& info);
  void destroy();
  void resize(uint size);
  void update(void* buffer, uint offset, uint size);
  
  CC_INLINE GLES2GPUBuffer* gpu_buffer() const { return gpu_buffer_; }

private:
  GLES2GPUBuffer* gpu_buffer_;
};

NS_CC_END

#endif
