#pragma once

#include "../gfx/GFXQueue.h"
#include "GFXAgent.h"

namespace cc {
namespace gfx {

class CC_DLL QueueAgent final : public Agent<Queue> {
public:
    using Agent::Agent;
    using Queue::submit;

    QueueAgent(Device *device) = delete;
    ~QueueAgent() override;

    bool initialize(const QueueInfo &info) override;
    void destroy() override;

    void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) override;
};

} // namespace gfx
} // namespace cc
