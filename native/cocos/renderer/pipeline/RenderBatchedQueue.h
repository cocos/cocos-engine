#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class BatchedBuffer;

class CC_DLL RenderBatchedQueue : public gfx::Object {
public:
    RenderBatchedQueue() = default;
    ~RenderBatchedQueue() = default;

    void clear();
    void recordCommandBuffer(gfx::GFXDevice *, gfx::GFXRenderPass *, gfx::GFXCommandBuffer *);

    CC_INLINE const gfx::set<BatchedBuffer *> &getQueue() const { return _queue; }

private:
    gfx::set<BatchedBuffer *> _queue;
};

} // namespace pipeline
} // namespace cc
