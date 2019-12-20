#ifndef CC_GFXGLES3_GLES3_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES3_GLES3_COMMAND_ALLOCATOR_H_

#include "gfx/GFXCommandPool.h"
#include "GLES3Commands.h"

NS_CC_BEGIN

class CC_GLES3_API GLES3CommandAllocator : public GFXCommandAllocator {
public:
  GLES3CommandAllocator(GFXDevice* device);
  ~GLES3CommandAllocator();
  
  GFXCommandPool<GLES3CmdBeginRenderPass> begin_render_pass_cmd_pool;
  GFXCommandPool<GLES3CmdBindStates> bind_states_cmd_pool;
  GFXCommandPool<GLES3CmdDraw> draw_cmd_pool;
  GFXCommandPool<GLES3CmdUpdateBuffer> update_buffer_cmd_pool;
  GFXCommandPool<GLES3CmdCopyBufferToTexture> copy_buffer_to_texture_cmd_pool;
  
public:
  bool Initialize(const GFXCommandAllocatorInfo& info);
  void Destroy();
  
  void ClearCmds(GLES3CmdPackage* cmd_package);
  
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
