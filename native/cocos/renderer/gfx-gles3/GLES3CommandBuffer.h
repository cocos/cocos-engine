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
  GLES3CmdPackage* cmd_package_;
  GLES3CommandAllocator* gles3_allocator_;
  bool is_in_render_pass_;
  GLES3GPUPipelineState* cur_gpu_pso_;
  GLES3GPUBindingLayout* cur_gpu_bl_;
  GLES3GPUInputAssembler* cur_gpu_ia_;
  GFXViewport cur_viewport_;
  GFXRect cur_scissor_;
  float cur_line_width_;
  GLES3DepthBias cur_depth_bias_;
  GFXColor cur_blend_constants_;
  GLES3DepthBounds cur_depth_bounds_;
  GLES3StencilWriteMask cur_stencil_write_mask_;
  GLES3StencilCompareMask cur_stencil_compare_mask_;
  bool is_state_invalid_;
};

NS_CC_END

#endif
