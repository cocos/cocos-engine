#ifndef CC_GFXVULKAN_BUFFER_H_
#define CC_GFXVULKAN_BUFFER_H_

namespace cc {
namespace gfx {

class CCVKGPUBuffer;
class CCVKGPUBufferView;

class CC_VULKAN_API CCVKBuffer final : public Buffer {
public:
    CCVKBuffer(Device *device);
    ~CCVKBuffer();

public:
    bool initialize(const BufferInfo &info);
    bool initialize(const BufferViewInfo &info);
    void destroy();
    void resize(uint size);
    void update(void *buffer, uint offset);

    CC_INLINE CCVKGPUBuffer *gpuBuffer() const { return _gpuBuffer; }
    CC_INLINE CCVKGPUBufferView *gpuBufferView() const { return _gpuBufferView; }

private:
    void createBufferView();

    CCVKGPUBuffer *_gpuBuffer = nullptr;
    CCVKGPUBufferView *_gpuBufferView = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
