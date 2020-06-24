#ifndef CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES2_GLES2_COMMAND_ALLOCATOR_H_

#include "gfx/GFXCommandPool.h"
#include "GLES2Commands.h"

namespace cc {
namespace gfx {

class CC_GLES2_API GLES2CommandAllocator : public CommandAllocator {
public:
    GLES2CommandAllocator(Device *device);
    ~GLES2CommandAllocator();

    CommandPool<GLES2CmdBeginRenderPass> beginRenderPassCmdPool;
    CommandPool<GLES2CmdBindStates> bindStatesCmdPool;
    CommandPool<GLES2CmdDraw> drawCmdPool;
    CommandPool<GLES2CmdUpdateBuffer> updateBufferCmdPool;
    CommandPool<GLES2CmdCopyBufferToTexture> copyBufferToTextureCmdPool;

public:
    virtual bool initialize(const CommandAllocatorInfo &info) override;
    virtual void destroy() override;

    void clearCmds(GLES2CmdPackage *cmd_package);

    CC_INLINE void releaseCmds() {
        beginRenderPassCmdPool.release();
        bindStatesCmdPool.release();
        drawCmdPool.release();
        updateBufferCmdPool.release();
        copyBufferToTextureCmdPool.release();
    }
};

} // namespace gfx
} // namespace cc

#endif
