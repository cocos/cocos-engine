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
    void push(InstancedBuffer *instancedBuffer);

private:
    set<InstancedBuffer *> _queues;
};

} // namespace pipeline
} // namespace cc
