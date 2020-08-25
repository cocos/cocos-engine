#ifndef CC_GFXGLES3_COMMAND_ALLOCATOR_H_
#define CC_GFXGLES3_COMMAND_ALLOCATOR_H_

#include "GLES3Commands.h"

namespace cc {
namespace gfx {

class CC_GLES3_API GLES3CommandAllocator : public Object {
public:
    GLES3CommandAllocator();
    ~GLES3CommandAllocator();

    CommandPool<GLES3CmdBeginRenderPass> beginRenderPassCmdPool;
    CommandPool<GLES3CmdBindStates> bindStatesCmdPool;
    CommandPool<GLES3CmdDraw> drawCmdPool;
    CommandPool<GLES3CmdUpdateBuffer> updateBufferCmdPool;
    CommandPool<GLES3CmdCopyBufferToTexture> copyBufferToTextureCmdPool;

public:
    void clearCmds(GLES3CmdPackage *cmd_package);

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
