#ifndef CC_GFXGLES3_GLES3_BUFFER_H_
#define CC_GFXGLES3_GLES3_BUFFER_H_

NS_CC_BEGIN

class GLES3GPUBuffer;

class CC_GLES3_API GLES3Buffer : public GFXBuffer {
public:
  GLES3Buffer(GFXDevice* device);
  ~GLES3Buffer();
  
public:
  bool Initialize(const GFXBufferInfo& info);
  void destroy();
  void Resize(uint size);
  void Update(void* buffer, uint offset, uint size);
  
  CC_INLINE GLES3GPUBuffer* gpu_buffer() const { return gpu_buffer_; }

private:
  GLES3GPUBuffer* gpu_buffer_;
};

NS_CC_END

#endif
