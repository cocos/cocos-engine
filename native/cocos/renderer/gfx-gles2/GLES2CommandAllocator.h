#ifndef CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_

#include "GLES2CommandPool.h"

CC_NAMESPACE_BEGIN

class CC_GLES2_API GLES2CommandAllocator : public GFXCommandAllocator {
public:
  GLES2CommandAllocator(GFXDevice* device);
  ~GLES2CommandAllocator();
  
  GLES2CommandPool<GLES2CmdBeginRenderPass> begin_render_pass_cmd_pool;
  GLES2CommandPool<GLES2CmdBindStates> bind_states_cmd_pool;
  GLES2CommandPool<GLES2CmdDraw> draw_cmd_pool;
  GLES2CommandPool<GLES2CmdUpdateBuffer> update_buffer_cmd_pool;
  GLES2CommandPool<GLES2CmdCopyBufferToTexture> copy_buffer_to_texture_cmd_pool;
  
public:
  bool Initialize(const GFXCommandAllocatorInfo& info);
  void Destroy();
  
  void ClearCmds(GLES2CmdPackage* cmd_package);
  
  CC_INLINE void ReleaseCmds() {
    begin_render_pass_cmd_pool.Release();
    bind_states_cmd_pool.Release();
    draw_cmd_pool.Release();
    update_buffer_cmd_pool.Release();
    copy_buffer_to_texture_cmd_pool.Release();
  }
};

CC_NAMESPACE_END

#endif
