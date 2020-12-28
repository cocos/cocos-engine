#ifndef CC_GFXGLES2_BUFFER_H_
#define CC_GFXGLES2_BUFFER_H_

namespace cc {
namespace gfx {

class GLES2GPUBuffer;
class GLES2GPUBufferView;

class CC_GLES2_API GLES2Buffer final : public Buffer {
public:
    GLES2Buffer(Device *device);
    ~GLES2Buffer();

public:
    virtual bool initialize(const BufferInfo &info) override;
    virtual bool initialize(const BufferViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint size) override;

    CC_INLINE GLES2GPUBuffer *gpuBuffer() const { return _gpuBuffer; }
    CC_INLINE GLES2GPUBufferView *gpuBufferView() const { return _gpuBufferView; }

private:
    GLES2GPUBuffer *_gpuBuffer = nullptr;
    GLES2GPUBufferView *_gpuBufferView = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
