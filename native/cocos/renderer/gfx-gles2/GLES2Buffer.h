#ifndef CC_GFXGLES2_GLES2_BUFFER_H_
#define CC_GFXGLES2_GLES2_BUFFER_H_

namespace cc {
namespace gfx {

class GLES2GPUBuffer;

class CC_GLES2_API GLES2Buffer : public GFXBuffer {
public:
    GLES2Buffer(GFXDevice *device);
    ~GLES2Buffer();

public:
    virtual bool initialize(const GFXBufferInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint offset, uint size) override;

    CC_INLINE GLES2GPUBuffer *gpuBuffer() const { return _gpuBuffer; }

private:
    GLES2GPUBuffer *_gpuBuffer = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
