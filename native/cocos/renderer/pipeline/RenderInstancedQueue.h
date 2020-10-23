#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class InstancedBuffer;

class CC_DLL RenderInstancedQueue : public Object {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() = default;

    void recordCommandBuffer(gfx::Device *device, gfx::RenderPass *renderPass, gfx::CommandBuffer *cmdBuffer);
    void add(InstancedBuffer *instancedBuffer);
    void uploadBuffers(gfx::CommandBuffer *cmdBuffer);
    void clear();

private:
    set<InstancedBuffer *> _queues;
};

} // namespace pipeline
} // namespace cc
