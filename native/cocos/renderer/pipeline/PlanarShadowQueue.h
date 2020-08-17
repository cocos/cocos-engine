#pragma once
#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class Device;
class RenderPass;
class CommandBuffer;
} // namespace gfx
namespace pipeline {

class CC_DLL PlanarShadowQueue : public Object {
public:
    PlanarShadowQueue() = default;
    ~PlanarShadowQueue() = default;

    void recordCommandBuffer(gfx::Device *, gfx::RenderPass *, gfx::CommandBuffer *);

private:
};
} // namespace pipeline
} // namespace cc
