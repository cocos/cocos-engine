#ifndef CC_GFXVULKAN_CCVK_QUEUE_H_
#define CC_GFXVULKAN_CCVK_QUEUE_H_

namespace cc {
namespace gfx {

class CCVKGPUQueue;

class CC_VULKAN_API CCVKQueue : public GFXQueue {
public:
    CCVKQueue(GFXDevice *device);
    ~CCVKQueue();

    friend class CCVKDevice;

public:
    bool initialize(const GFXQueueInfo &info);
    void destroy();
    void submit(const vector<GFXCommandBuffer *> &cmdBuffs, GFXFence *fence);

    CC_INLINE CCVKGPUQueue *gpuQueue() const { return _gpuQueue; }

private:
    CCVKGPUQueue *_gpuQueue;
    uint _numDrawCalls = 0;
    uint _numInstances = 0;
    uint _numTriangles = 0;
};

} // namespace gfx
} // namespace cc

#endif
