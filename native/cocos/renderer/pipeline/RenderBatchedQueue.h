#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class BatchedBuffer;

class CC_DLL RenderBatchedQueue : public cc::Object {
public:
    RenderBatchedQueue() = default;
    ~RenderBatchedQueue() = default;

    void clear();
    void recordCommandBuffer(cc::GFXDevice *, cc::GFXRenderPass *, cc::GFXCommandBuffer *);

    CC_INLINE const cc::set<BatchedBuffer *>::type &getQueue() const { return _queue; }

private:
    cc::set<BatchedBuffer *>::type _queue;
};

} // namespace pipeline
} // namespace cc
