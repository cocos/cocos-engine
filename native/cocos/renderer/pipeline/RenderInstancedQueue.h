#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class InstancedBuffer;

class CC_DLL RenderInstancedQueue : public Object {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() = default;

    void clear();
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

    CC_INLINE set<std::shared_ptr<InstancedBuffer>> &getQueue() { return _queues; }

private:
    set<std::shared_ptr<InstancedBuffer>> _queues;
};

} // namespace pipeline
} // namespace cc
