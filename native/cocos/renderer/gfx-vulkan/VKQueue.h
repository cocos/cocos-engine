#ifndef CC_GFXVULKAN_QUEUE_H_
#define CC_GFXVULKAN_QUEUE_H_

namespace cc {
namespace gfx {

class CCVKGPUQueue;

class CC_VULKAN_API CCVKQueue final : public Queue {
public:
    CCVKQueue(Device *device);
    ~CCVKQueue();

    friend class CCVKDevice;

public:
    bool initialize(const QueueInfo &info);
    void destroy();
    void submit(const CommandBuffer *const *cmdBuffs, uint count, Fence *fence);

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
