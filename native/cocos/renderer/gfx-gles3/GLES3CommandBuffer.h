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
  bool Initialize(const GFXCommandBufferInfo& info);
  void Destroy();
  
  void Begin();
  void End();
  void BeginRenderPass(GFXFramebuffer* fbo, const GFXRect& render_area, GFXClearFlags clear_flags, GFXColor* colors, uint count, float depth, int stencil);
  void EndRenderPass();
  void BindPipelineState(GFXPipelineState* pso);
  void BindBindingLayout(GFXBindingLayout* layout);
  void BindInputAssembler(GFXInputAssembler* ia);
  void SetViewport(const GFXViewport& vp);
  void SetScissor(const GFXRect& rect);
  void SetLineWidth(const float width);
  void SetDepthBias(float constant, float clamp, float slope);
  void SetBlendConstants(const GFXColor& constants);
  void SetDepthBounds(float min_bounds, float max_bounds);
  void SetStencilWriteMask(GFXStencilFace face, uint mask);
  void SetStencilCompareMask(GFXStencilFace face, int ref, uint mask);
  void Draw(GFXInputAssembler* ia);
  void UpdateBuffer(GFXBuffer* buff, void* data, uint size, uint offset);
  void CopyBufferToTexture(GFXBuffer* src, GFXTexture* dst, GFXTextureLayout layout, GFXBufferTextureCopy* regions, uint count);
  void Execute(GFXCommandBuffer** cmd_buffs, uint count);
  
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
