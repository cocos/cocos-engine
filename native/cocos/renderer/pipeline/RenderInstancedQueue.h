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
    void uploadBuffers(gfx::CommandBuffer *cmdBuff);
    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

    CC_INLINE set<InstancedBuffer *> &getQueue() { return _queues; }

private:
    set<InstancedBuffer *> _queues;
};

} // namespace pipeline
} // namespace cc
