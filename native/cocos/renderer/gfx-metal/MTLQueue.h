#pragma once

#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

class CCMTLCommandPackage;

class CCMTLQueue : public Queue {
    friend class CCMTLDevice;

public:
    CCMTLQueue(Device *device);
    ~CCMTLQueue();

    virtual bool initialize(const QueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const vector<CommandBuffer *> &cmdBuffs, Fence *fence) override;

private:
    CC_INLINE void executeCommands(const CCMTLCommandPackage *, id<MTLCommandBuffer> mtlCommandBuffer);

private:
    MTKView *_mtkView = nil;
    dispatch_semaphore_t _frameBoundarySemaphore;
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc
