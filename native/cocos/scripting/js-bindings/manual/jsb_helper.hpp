#pragma once

#include "base/CCRef.h"

#include <functional>

class CleanupTask : public cocos2d::Ref
{
public:
    static void pushTaskToAutoReleasePool(const std::function<void()>& cb);

    CleanupTask();
    virtual ~CleanupTask();

private:
    std::function<void()> _cb;
};
