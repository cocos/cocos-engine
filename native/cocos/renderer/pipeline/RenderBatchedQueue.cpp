#include "RenderBatchedQueue.h"
#include "BatchedBuffer.h"

namespace cc {
namespace pipeline {

void RenderBatchedQueue::clear() {
    for(auto it : _queues) {
        it->clear();
    }
    _queues.clear();
}

void RenderBatchedQueue::recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *) {
    
}
}
} // namespace cc
