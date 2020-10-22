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
    void uploadBuffers(gfx::CommandBuffer *cmdBuffer);
    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer);
    void add(InstancedBuffer *instancedBuffer);

private:
    set<InstancedBuffer *> _queues;
};

} // namespace pipeline
} // namespace cc
