#ifndef CC_CORE_GFX_COMMAND_BUFFER_H_
#define CC_CORE_GFX_COMMAND_BUFFER_H_

#include "GFXDef.h"

NS_CC_BEGIN

class CC_CORE_API GFXCommandBuffer : public Object {
 public:
  GFXCommandBuffer(GFXDevice* device);
  virtual ~GFXCommandBuffer();
  
public:
  virtual bool Initialize(const GFXCommandBufferInfo& info) = 0;
  virtual void destroy() = 0;
  virtual void Begin() = 0;
  virtual void End() = 0;
  virtual void BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil) = 0;
  virtual void EndRenderPass() = 0;
  virtual void BindPipelineState(GFXPipelineState* pso) = 0;
  virtual void BindBindingLayout(GFXBindingLayout* layout) = 0;
  virtual void BindInputAssembler(GFXInputAssembler* ia) = 0;
  virtual void SetViewport(const GFXViewport& vp) = 0;
  virtual void SetScissor(const GFXRect& rect) = 0;
  virtual void SetLineWidth(const float width) = 0;
  virtual void SetDepthBias(float constant, float clamp, float slope) = 0;
  virtual void SetBlendConstants(const GFXColor& constants) = 0;
  virtual void SetDepthBounds(float min_bounds, float max_bounds) = 0;
  virtual void SetStencilWriteMask(GFXStencilFace face, uint mask) = 0;
  virtual void SetStencilCompareMask(GFXStencilFace face, int ref, uint mask) = 0;
  virtual void Draw(GFXInputAssembler* ia) = 0;
  virtual void UpdateBuffer(GFXBuffer* buff, void* data, uint size, uint offset = 0) = 0;
  virtual void CopyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count) = 0;
  virtual void Execute(GFXCommandBuffer** cmd_buffs, uint count) = 0;
  
  CC_INLINE GFXDevice* device() const { return device_; }
  CC_INLINE GFXCommandAllocator* allocator() const { return allocator_; }
  CC_INLINE GFXCommandBufferType type() const { return type_; }
  CC_INLINE uint numDrawCalls() const { return _numDrawCalls; }
  CC_INLINE uint numTris() const { return _numTriangles; }
  
protected:
  GFXDevice* device_;
  GFXCommandAllocator* allocator_;
  GFXCommandBufferType type_;
  uint _numDrawCalls = 0;
  uint _numTriangles = 0;
};

NS_CC_END

#endif // CC_CORE_GFX_COMMAND_ALLOCATOR_H_
