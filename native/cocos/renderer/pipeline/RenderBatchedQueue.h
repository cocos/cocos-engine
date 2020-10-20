#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class BatchedBuffer;

class CC_DLL RenderBatchedQueue : public Object {
public:
    RenderBatchedQueue() = default;
    ~RenderBatchedQueue() = default;

    void clear();
    void uploadBuffers(gfx::CommandBuffer *cmdBuff);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

    CC_INLINE set<std::shared_ptr<BatchedBuffer>> &getQueue() { return _queues; }

private:
    set<std::shared_ptr<BatchedBuffer>> _queues;
};

} // namespace pipeline
} // namespace cc
