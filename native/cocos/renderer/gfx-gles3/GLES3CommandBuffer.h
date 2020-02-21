#ifndef CC_GFXGLES3_GLES3_COMMAND_BUFFER_H_
#define CC_GFXGLES3_GLES3_COMMAND_BUFFER_H_

#include "GLES3Commands.h"

NS_CC_BEGIN

class GLES3CommandAllocator;

class CC_GLES3_API GLES3CommandBuffer : public GFXCommandBuffer {
 public:
  GLES3CommandBuffer(GFXDevice* device);
  ~GLES3CommandBuffer();

  friend class GLES3Queue;
  
 public:
  bool initialize(const GFXCommandBufferInfo& info);
  void destroy();
  
  void begin();
  void end();
  void beginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil);
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
  void copyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count);
  void execute(GFXCommandBuffer** cmd_buffs, uint count);
  
 private:
  void BindStates();
  
 private:
  GLES3CmdPackage* _cmdPackage = nullptr;
  GLES3CommandAllocator* _gles3Allocator = nullptr;
  bool _isInRenderPass = false;
  GLES3GPUPipelineState* _curGPUPipelineState = nullptr;
  GLES3GPUBindingLayout* _curGPUBlendLayout = nullptr;
  GLES3GPUInputAssembler* _curGPUInputAssember = nullptr;
  GFXViewport _curViewport;
  GFXRect _curScissor;
  float _curLineWidth = 1.0f;
  GLES3DepthBias _curDepthBias;
  GFXColor _curBlendConstants;
  GLES3DepthBounds _curDepthBounds;
  GLES3StencilWriteMask _curStencilWriteMask;
  GLES3StencilCompareMask _curStencilCompareMask;
  bool _isStateInvalid = false;
};

NS_CC_END

#endif
