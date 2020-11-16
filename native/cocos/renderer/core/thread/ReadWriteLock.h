#pragma once

#include <boost/thread/shared_mutex.hpp>

namespace cc {
namespace gfx {

class ReadWriteLock final
{
public:

    template <typename Function, typename... Args>
    auto                LockRead(Function&& func, Args&&... args) noexcept -> decltype(func(std::forward<Args>(args)...));

    template <typename Function, typename... Args>
    auto                LockWrite(Function&& func, Args&&... args) noexcept -> decltype(func(std::forward<Args>(args)...));

private:

    boost::shared_mutex   mMutex;
};

template <typename Function, typename... Args>
auto ReadWriteLock::LockRead(Function&& func, Args&&... args) noexcept -> decltype(func(std::forward<Args>(args)...))
{
    boost::shared_lock<boost::shared_mutex> lock(mMutex);
    return func(std::forward<Args>(args)...);
}

template <typename Function, typename... Args>
auto ReadWriteLock::LockWrite(Function&& func, Args&&... args) noexcept -> decltype(func(std::forward<Args>(args)...))
{
    boost::lock_guard<boost::shared_mutex> lock(mMutex);
    return func(std::forward<Args>(args)...);
}

} // namespace gfx
} // namespace cc
