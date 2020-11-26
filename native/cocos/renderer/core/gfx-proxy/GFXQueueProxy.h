#pragma once

#include "../gfx/GFXQueue.h"
#include "GFXProxy.h"

namespace cc {
namespace gfx {

class CC_DLL QueueProxy : public Proxy<Queue> {
public:
    using Proxy::Proxy;
    using Queue::submit;

    QueueProxy(Device *device) = delete;

    virtual bool initialize(const QueueInfo &info) override;
    virtual void destroy() override;

    virtual void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) override;
};

} // namespace gfx
} // namespace cc
