#ifndef CC_GFXGLES3_COMMANDS_H_
#define CC_GFXGLES3_COMMANDS_H_

#include "GLES3GPUObjects.h"

NS_CC_BEGIN

class GLES3Device;

struct GLES3DepthBias {
  float constant = 0.0f;
  float clamp = 0.0f;
  float slope = 0.0f;
};

struct GLES3DepthBounds {
  float min_bounds = 0.0f;
  float max_bounds = 0.0f;
};

struct GLES3StencilWriteMask {
  GFXStencilFace face = GFXStencilFace::FRONT;
  GLuint write_mask = 0;
};

struct GLES3StencilCompareMask {
  GFXStencilFace face = GFXStencilFace::FRONT;
  GLint refrence = 0;
  GLuint compare_mask = 0;
};

struct GLES3TextureSubres {
  uint base_mip_level = 0;
  uint level_count = 1;
  uint base_array_layer = 0;
  uint layer_count = 1;
};

struct GLES3BufferTextureCopy {
  uint buff_offset = 0;
  uint buff_stride = 0;
  uint buff_tex_height = 0;
  uint tex_offset[3] = {0};
  uint tex_extent[3] = {0};
  GLES3TextureSubres tex_subres;
};

class GLES3CmdBeginRenderPass : public GFXCmd {
 public:
  GLES3GPUFramebuffer* gpu_fbo = nullptr;
  GFXRect render_area;
  GFXClearFlags clear_flags = GFXClearFlagBit::NONE;
  uint num_clear_colors = 0;
  GFXColor clear_colors[GFX_MAX_ATTACHMENTS];
  float clear_depth = 1.0f;
  int clear_stencil = 0;
  
  GLES3CmdBeginRenderPass() : GFXCmd(GFXCmdType::BEGIN_RENDER_PASS) {}
  
  void Clear() {
    gpu_fbo = nullptr;
    num_clear_colors = 0;
  }
};

enum class GLES3State : uint8_t {
  VIEWPORT,
  SCISSOR,
  LINE_WIDTH,
  DEPTH_BIAS,
  BLEND_CONSTANTS,
  DEPTH_BOUNDS,
  STENCIL_WRITE_MASK,
  STENCIL_COMPARE_MASK,
  COUNT,
};

class GLES3CmdBindStates : public GFXCmd {
 public:
  GLES3GPUPipelineState* gpu_pso = nullptr;
  GLES3GPUBindingLayout* gpu_binding_layout = nullptr;
  GLES3GPUInputAssembler* gpu_ia = nullptr;
  uint8_t state_flags[(int)GLES3State::COUNT] = {0};
  GFXViewport viewport;
  GFXRect scissor;
  float line_width = 1.0f;
  GLES3DepthBias depth_bias;
  GFXColor blend_constants;
  GLES3DepthBounds depth_bounds;
  GLES3StencilWriteMask stencil_write_mask;
  GLES3StencilCompareMask stencil_compare_mask;
  
  GLES3CmdBindStates() : GFXCmd(GFXCmdType::BIND_STATES) {}
  
  void Clear() {
    gpu_pso = nullptr;
    gpu_binding_layout = nullptr;
    gpu_ia = nullptr;
    memset(state_flags, 0, sizeof(state_flags));
  }
};

class GLES3CmdDraw : public GFXCmd {
 public:
  GFXDrawInfo draw_info;
  
  GLES3CmdDraw() : GFXCmd(GFXCmdType::DRAW) {}
  void Clear() {}
};

class GLES3CmdUpdateBuffer : public GFXCmd {
 public:
  GLES3GPUBuffer* gpu_buffer = nullptr;
  uint8_t* buffer = nullptr;
  uint size = 0;
  uint offset = 0;
  
  GLES3CmdUpdateBuffer() : GFXCmd(GFXCmdType::UPDATE_BUFFER) {}
  
  void Clear() {
    gpu_buffer = nullptr;
    buffer = nullptr;
  }
};

class GLES3CmdCopyBufferToTexture : public GFXCmd {
 public:
  GLES3GPUBuffer* gpu_buffer = nullptr;
  GLES3GPUTexture* gpu_texture = nullptr;
  GFXTextureLayout dst_layout;
  GFXBufferTextureCopyList regions;
  
  GLES3CmdCopyBufferToTexture() : GFXCmd(GFXCmdType::COPY_BUFFER_TO_TEXTURE) {}
  
  void Clear() {
    gpu_buffer = nullptr;
    gpu_texture = nullptr;
    regions.clear();
  }
};

class GLES3CmdPackage : public Object {
 public:
  CachedArray<GFXCmdType> cmd_types;
  CachedArray<GLES3CmdBeginRenderPass*> begin_render_pass_cmds;
  CachedArray<GLES3CmdBindStates*> bind_states_cmds;
  CachedArray<GLES3CmdDraw*> draw_cmds;
  CachedArray<GLES3CmdUpdateBuffer*> update_buffer_cmds;
  CachedArray<GLES3CmdCopyBufferToTexture*> copy_buffer_to_texture_cmds;
};

CC_GLES3_API void GLES3CmdFuncCreateBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer);
CC_GLES3_API void GLES3CmdFuncDestroyBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer);
CC_GLES3_API void GLES3CmdFuncResizeBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer);
CC_GLES3_API void GLES3CmdFuncUpdateBuffer(GLES3Device* device, GLES3GPUBuffer* gpu_buffer, void* buffer, uint offset, uint size);
CC_GLES3_API void GLES3CmdFuncCreateTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture);
CC_GLES3_API void GLES3CmdFuncDestroyTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture);
CC_GLES3_API void GLES3CmdFuncResizeTexture(GLES3Device* device, GLES3GPUTexture* gpu_texture);
CC_GLES3_API void GLES3CmdFuncCreateSampler(GLES3Device* device, GLES3GPUSampler* gpu_sampler);
CC_GLES3_API void GLES3CmdFuncDestroySampler(GLES3Device* device, GLES3GPUSampler* gpu_sampler);
CC_GLES3_API void GLES3CmdFuncCreateShader(GLES3Device* device, GLES3GPUShader* gpu_shader);
CC_GLES3_API void GLES3CmdFuncDestroyShader(GLES3Device* device, GLES3GPUShader* gpu_shader);
CC_GLES3_API void GLES3CmdFuncCreateInputAssembler(GLES3Device* device, GLES3GPUInputAssembler* gpu_ia);
CC_GLES3_API void GLES3CmdFuncDestroyInputAssembler(GLES3Device* device, GLES3GPUInputAssembler* gpu_ia);
CC_GLES3_API void GLES3CmdFuncCreateFramebuffer(GLES3Device* device, GLES3GPUFramebuffer* gpu_fbo);
CC_GLES3_API void GLES3CmdFuncDestroyFramebuffer(GLES3Device* device, GLES3GPUFramebuffer* gpu_fbo);
CC_GLES3_API void GLES3CmdFuncExecuteCmds(GLES3Device* device, GLES3CmdPackage* cmd_package);
CC_GLES3_API void GLES3CmdFuncCopyBuffersToTexture(GLES3Device* device, uint8_t** buffers, uint count, GLES3GPUTexture* gpu_texture, const GFXBufferTextureCopyList& regions);

NS_CC_END

#endif
