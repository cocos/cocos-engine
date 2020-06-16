#pragma once

#import <Metal/MTLCommandQueue.h>
#import <MetalKit/MTKView.h>

namespace cc {
namespace gfx {

class CCMTLCommandPackage;

class CCMTLQueue : public GFXQueue {
    friend class CCMTLDevice;

public:
    CCMTLQueue(GFXDevice *device);
    ~CCMTLQueue();

    virtual bool initialize(const GFXQueueInfo &info) override;
    virtual void destroy() override;
    virtual void submit(const vector<GFXCommandBuffer *>::type &cmdBuffs, GFXFence *fence) override;

private:
    CC_INLINE void executeCommands(const CCMTLCommandPackage *, id<MTLCommandBuffer> mtlCommandBuffer);

private:
    MTKView *_mtkView = nil;
    dispatch_semaphore_t _frameBoundarySemaphore;
    bool _isAsync = false;
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc
