#pragma once

namespace cc {
namespace gfx {
class Fence;
class CCMTLQueue : public Queue {
    friend class CCMTLDevice;

public:
    CCMTLQueue(Device *device);
    ~CCMTLQueue();

    virtual bool initialize(const QueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence) override;

    Fence *getFence() const { return _fence; }

private:
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
    Fence *_fence = nullptr;
};

} // namespace gfx
} // namespace cc
