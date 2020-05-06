#ifndef CC_GFXVULKAN_CCVK_COMMAND_ALLOCATOR_H_
#define CC_GFXVULKAN_CCVK_COMMAND_ALLOCATOR_H_

NS_CC_BEGIN

class CCVKGPUCommandPool;

class CC_VULKAN_API CCVKCommandAllocator : public GFXCommandAllocator {
public:
    CCVKCommandAllocator(GFXDevice* device);
    ~CCVKCommandAllocator();

public:
    bool initialize(const GFXCommandAllocatorInfo& info);
    void destroy();

    CC_INLINE CCVKGPUCommandPool* gpuCommandPool() { return _gpuCommandPool; }

private:
    CCVKGPUCommandPool* _gpuCommandPool;
};

NS_CC_END

#endif
