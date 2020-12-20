#pragma once

#include <memory>

namespace cc {
namespace gfx {

template <typename Actor>
class CC_DLL Agent : public Actor {
public:
    Agent() noexcept = delete;

    explicit Agent(Actor *const actor, Device *const device) noexcept
    : Actor(device), _actor(actor) {}

    virtual ~Agent() {}

    Agent(Agent const &) = delete;

    Agent(Agent &&) = delete;

    Agent &operator=(Agent const &) = delete;

    Agent &operator=(Agent &&) = delete;

    inline Actor *getActor() const noexcept { return _actor; }

protected:
    Actor * _actor{nullptr};
};

} // namespace gfx
} // namespace cc
