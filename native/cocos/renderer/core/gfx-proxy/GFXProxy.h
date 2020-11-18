#pragma once

#include <memory>

namespace cc {
namespace gfx {

template<typename Remote, typename Deleter = std::default_delete <Remote>>
class CC_DLL Proxy : public Remote {
public:

    Proxy() noexcept = delete;

    explicit Proxy(Remote *const remote, Device *const device) noexcept
    : Remote(device) { _remote.reset(remote); }

    virtual ~Proxy() { _remote.reset(); }

    Proxy(Proxy const &) = delete;

    Proxy(Proxy &&) = delete;

    Proxy &operator=(Proxy const &) = delete;

    Proxy &operator=(Proxy &&) = delete;

    inline Remote *GetRemote() const noexcept { return _remote.get(); }

protected:

    using RemotePtr = std::unique_ptr<Remote, Deleter>;
    RemotePtr _remote{nullptr};
};

} // namespace gfx
} // namespace cc
