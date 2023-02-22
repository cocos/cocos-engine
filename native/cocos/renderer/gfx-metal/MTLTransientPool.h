/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

http://www.cocos.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated engine source code (the "Software"), a limited,
worldwide, royalty-free, non-assignable, revocable and non-exclusive license
to use Cocos Creator solely to develop games on your target platforms. You shall
not use Cocos Creator software for developing other software or tools that's
used for developing games. You are not granted to publish, distribute,
sublicense, and/or sell copies of Cocos Creator.

The software or tools in this License Agreement are licensed, not sold.
Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

#pragma once

#include "gfx-base/GFXTransientPool.h"
#include "gfx-base/allocator/Allocator.h"
#include "gfx-metal/MTLCommandBuffer.h"
#import <Metal/MTLFence.h>
#import <Metal/MTLHeap.h>
#include <memory>

namespace cc {
namespace gfx {

class CCMTLTransientPool : public TransientPool, public Allocator::IBlock {
public:
    CCMTLTransientPool();
    ~CCMTLTransientPool() override = default;

private:
    void doInit(const TransientPoolInfo &info) override;
    void doInitBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) override;
    void doResetBuffer(Buffer *buffer, PassScope scope, AccessFlags accessFlag) override;
    void doInitTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) override;
    void doResetTexture(Texture *texture, PassScope scope, AccessFlags accessFlag) override;

    void barrier(PassScope scope, CommandBuffer *) override;

    void doBeginFrame() override;
    void doEndFrame() override;

    bool allocateBlock() override;
    void freeBlock(uint32_t index) override;

    id<MTLFence> allocateFence();
    void freeFence(id<MTLFence>);

    void init(const TransientPoolInfo &info);

    std::unique_ptr<Allocator> _allocator;
    ccstd::vector<id<MTLHeap>> _heaps;

    ccstd::unordered_map<uint32_t, AliasingResourceTracked> _resources;
    std::unique_ptr<AliasingContext> _context;

    ccstd::vector<id<MTLFence>> _fences;
    ccstd::vector<id<MTLFence>> _freeList;
    ccstd::unordered_map<PassScope, ccstd::vector<id<MTLFence>>> _fencesToWait;
};

} // namespace gfx
} // namespace cc
