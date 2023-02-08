#pragma once

#include "gfx-base/GFXBuffer.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"

namespace cc::gfx::gles {

struct GPUBuffer : public GFXDeviceObject<DefaultDeleter> {
    GLenum target      = 0;
    GLenum memoryUsage = 0;
    BufferUsage usage  = BufferUsageBit::NONE;
    uint32_t size      = 0;
    uint32_t stride    = 0;
    uint32_t count     = 0;

    // gpu handle
    GLuint bufferId = 0;

    GPUBuffer() noexcept = default;
    ~GPUBuffer() noexcept override;
    void initBuffer();
};

struct GPUBufferView : public GFXDeviceObject<DefaultDeleter> {
    IntrusivePtr<GPUBuffer> buffer;
    uint32_t offset;
    uint32_t range;
};

class Buffer final : public gfx::Buffer {
public:
    Buffer();
    ~Buffer() override;

    void update(const void *buffer, uint32_t size) override;
    GPUBufferView *getGPUBufferView() const { return _gpuBufferView; }

protected:
    void doInit(const BufferInfo &info) override;
    void doInit(const BufferViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t size, uint32_t count) override;

    void initGPUBuffer(uint32_t size, uint32_t count);

    IntrusivePtr<GPUBufferView> _gpuBufferView;
};

} // namespace cc::gfx::gles
