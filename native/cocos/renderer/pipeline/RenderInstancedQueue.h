#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace pipeline {

class InstancedBuffer;

class CC_DLL RenderInstancedQueue : public gfx::Object {
public:
    RenderInstancedQueue() = default;
    ~RenderInstancedQueue() = default;

    void clear();
    void recordCommandBuffer(gfx::GFXDevice *, gfx::GFXRenderPass *, gfx::GFXCommandBuffer *);

    CC_INLINE const gfx::set<InstancedBuffer *> &getQueue() const { return _queue; }

private:
    gfx::set<InstancedBuffer *> _queue;
};

} // namespace pipeline
} // namespace cc
