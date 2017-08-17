#include "jsb_helper.hpp"

/* static */
void CleanupTask::pushTaskToAutoReleasePool(const std::function<void()>& cb)
{
    auto ret = new (std::nothrow) CleanupTask();
    ret->_cb = cb;
    ret->autorelease();
}

CleanupTask::CleanupTask()
: _cb(nullptr)
{

}

CleanupTask::~CleanupTask()
{
    if (_cb != nullptr)
    {
        _cb();
    }
}
