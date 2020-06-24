#pragma once

#include "gfx/GFXCommandPool.h"
#include "MTLCommands.h"

namespace cc {
namespace gfx {

class CCMTLCommandPackage;

class CCMTLCommandAllocator : public CommandAllocator {
public:
    CCMTLCommandAllocator(Device *device);
    ~CCMTLCommandAllocator();

    virtual bool initialize(const CommandAllocatorInfo &info) override;
    virtual void destroy() override;

    void clearCommands(CCMTLCommandPackage *commandPackage);

    CC_INLINE void releaseCmds() {
        _beginRenderPassCmdPool.release();
        _bindStatesCmdPool.release();
        _drawCmdPool.release();
        _updateBufferCmdPool.release();
        _copyBufferToTextureCmdPool.release();
    }

private:
    friend class CCMTLCommandBuffer;
    CommandPool<CCMTLCmdBeginRenderPass> _beginRenderPassCmdPool;
    CommandPool<CCMTLCmdBindStates> _bindStatesCmdPool;
    CommandPool<CCMTLCmdDraw> _drawCmdPool;
    CommandPool<CCMTLCmdUpdateBuffer> _updateBufferCmdPool;
    CommandPool<CCMTLCmdCopyBufferToTexture> _copyBufferToTextureCmdPool;
};

} // namespace gfx
} // namespace cc
