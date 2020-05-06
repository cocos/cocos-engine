#ifndef CC_GFXVULKAN_CCVK_BUFFER_H_
#define CC_GFXVULKAN_CCVK_BUFFER_H_

NS_CC_BEGIN

class CCVKGPUBuffer;

class CC_VULKAN_API CCVKBuffer : public GFXBuffer
{
public:
    CCVKBuffer(GFXDevice* device);
    ~CCVKBuffer();

public:
    bool initialize(const GFXBufferInfo& info);
    void destroy();
    void resize(uint size);
    void update(void* buffer, uint offset, uint size);

    CC_INLINE CCVKGPUBuffer* gpuBuffer() const { return _gpuBuffer; }

private:
    CCVKGPUBuffer* _gpuBuffer = nullptr;
};

NS_CC_END

#endif
