#ifndef CC_GFXVULKAN_CCVK_COMMAND_ALLOCATOR_H_
#define CC_GFXVULKAN_CCVK_COMMAND_ALLOCATOR_H_

namespace cc {
namespace gfx {

class CCVKGPUCommandPool;

class CC_VULKAN_API CCVKCommandAllocator : public CommandAllocator {
public:
    CCVKCommandAllocator(Device *device);
    ~CCVKCommandAllocator();

public:
    bool initialize(const CommandAllocatorInfo &info);
    void destroy();

    CC_INLINE CCVKGPUCommandPool *gpuCommandPool() { return _gpuCommandPool; }
    void reset();

private:
    CCVKGPUCommandPool *_gpuCommandPool;
};

} // namespace gfx
} // namespace cc

#endif
