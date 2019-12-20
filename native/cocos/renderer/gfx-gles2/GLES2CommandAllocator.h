#ifndef CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_

#include "gfx/GFXCommandPool.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

class CC_GLES2_API GLES2CommandAllocator : public GFXCommandAllocator {
public:
  GLES2CommandAllocator(GFXDevice* device);
  ~GLES2CommandAllocator();
  
  GFXCommandPool<GLES2CmdBeginRenderPass> begin_render_pass_cmd_pool;
  GFXCommandPool<GLES2CmdBindStates> bind_states_cmd_pool;
  GFXCommandPool<GLES2CmdDraw> draw_cmd_pool;
  GFXCommandPool<GLES2CmdUpdateBuffer> update_buffer_cmd_pool;
  GFXCommandPool<GLES2CmdCopyBufferToTexture> copy_buffer_to_texture_cmd_pool;
  
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

NS_CC_END

#endif
