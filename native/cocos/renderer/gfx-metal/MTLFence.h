#pragma once
#include <dispatch/dispatch.h>
namespace cc {
namespace gfx {

class CCMTLFence : public Fence {
public:
    CCMTLFence(Device *device);
    ~CCMTLFence();

    virtual bool initialize(const FenceInfo &info) override;
    virtual void destroy() override;
    virtual void wait() override;
    virtual void reset() override;
    void signal();

private:
    dispatch_semaphore_t _frameBoundarySemaphore;
};

} // namespace gfx
} // namespace cc
