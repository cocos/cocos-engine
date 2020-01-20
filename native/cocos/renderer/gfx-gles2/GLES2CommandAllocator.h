#ifndef CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_

#include "gfx/GFXCommandPool.h"
#include "GLES2Commands.h"

NS_CC_BEGIN

class CC_GLES2_API GLES2CommandAllocator : public GFXCommandAllocator {
public:
  GLES2CommandAllocator(GFXDevice* device);
  ~GLES2CommandAllocator();
  
  GFXCommandPool<GLES2CmdBeginRenderPass> beginRenderPassCmdPool;
  GFXCommandPool<GLES2CmdBindStates> bindStatesCmdPool;
  GFXCommandPool<GLES2CmdDraw> drawCmdPool;
  GFXCommandPool<GLES2CmdUpdateBuffer> updateBufferCmdPool;
  GFXCommandPool<GLES2CmdCopyBufferToTexture> copyBufferToTextureCmdPool;
  
public:
  bool initialize(const GFXCommandAllocatorInfo& info);
  void destroy();
  
  void clearCmds(GLES2CmdPackage* cmd_package);
  
  CC_INLINE void releaseCmds() {
    beginRenderPassCmdPool.release();
    bindStatesCmdPool.release();
    drawCmdPool.release();
    updateBufferCmdPool.release();
    copyBufferToTextureCmdPool.release();
  }
};

NS_CC_END

#endif
