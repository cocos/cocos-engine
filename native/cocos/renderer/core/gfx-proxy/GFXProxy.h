#pragma once

#include <memory>

namespace cc {
namespace gfx {

template <typename Remote>
class CC_DLL Proxy : public Remote {
public:
    Proxy() noexcept = delete;

    explicit Proxy(Remote *const remote, Device *const device) noexcept
    : Remote(device), _remote(remote) {}

    virtual ~Proxy() {}

    Proxy(Proxy const &) = delete;

    Proxy(Proxy &&) = delete;

    Proxy &operator=(Proxy const &) = delete;

    Proxy &operator=(Proxy &&) = delete;

    inline Remote *getRemote() const noexcept { return _remote; }

protected:
    Remote * _remote{nullptr};
};

} // namespace gfx
} // namespace cc
