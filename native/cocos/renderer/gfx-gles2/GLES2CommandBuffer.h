#ifndef CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_
#define CC_GFXGLES2_GLES2_COMMAND_BUFFER_H_

#include "GLES2Commands.h"

NS_CC_BEGIN

class GLES2CommandAllocator;

class CC_GLES2_API GLES2CommandBuffer : public GFXCommandBuffer {
 public:
  GLES2CommandBuffer(GFXDevice* device);
  ~GLES2CommandBuffer();

  friend class GLES2Queue;
  
 public:
  bool initialize(const GFXCommandBufferInfo& info);
  void destroy();
  
  void begin();
  void end();
  void beginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, const std::vector<GFXColor>& colors, float depth, int stencil);
  void endRenderPass();
  void bindPipelineState(GFXPipelineState* pso);
  void bindBindingLayout(GFXBindingLayout* layout);
  void bindInputAssembler(GFXInputAssembler* ia);
  void setViewport(const GFXViewport& vp);
  void setScissor(const GFXRect& rect);
  void setLineWidth(const float width);
  void setDepthBias(float constant, float clamp, float slope);
  void setBlendConstants(const GFXColor& constants);
  void setDepthBound(float min_bounds, float max_bounds);
  void setStencilWriteMask(GFXStencilFace face, uint mask);
  void setStencilCompareMask(GFXStencilFace face, int ref, uint mask);
  void draw(GFXInputAssembler* ia);
  void updateBuffer(GFXBuffer* buff, void* data, uint size, uint offset);
  void copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, const GFXBufferTextureCopyList& regions);
  void execute(const std::vector<GFXCommandBuffer*>& cmd_buffs, uint32_t count);
  
 private:
  void BindStates();
  
 private:
  GLES2CmdPackage* _cmdPackage = nullptr;
  GLES2CommandAllocator* _gles2Allocator = nullptr;
  bool _isInRenderPass = false;
  GLES2GPUPipelineState* _curGPUPipelineState = nullptr;
  GLES2GPUBindingLayout* _curGPUBlendLayout = nullptr;
  GLES2GPUInputAssembler* _curGPUInputAssember = nullptr;
  GFXViewport _curViewport;
  GFXRect _curScissor;
  float _curLineWidth = 1.0f;
  GLES2DepthBias _curDepthBias;
  GFXColor _curBlendConstants;
  GLES2DepthBounds _curDepthBounds;
  GLES2StencilWriteMask _curStencilWriteMask;
  GLES2StencilCompareMask _curStencilCompareMask;
  bool _isStateInvalid = false;
};

NS_CC_END

#endif
