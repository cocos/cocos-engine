#pragma once

#include "gfx-base/GFXBuffer.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESBuffer final : public Buffer {
public:
    GLESBuffer();
    ~GLESBuffer() override;

    GLESGPUBuffer *gpuBuffer() const { return _gpuBufferView->gpuBuffer; }
    GLESGPUBufferView *gpuBufferView() const { return _gpuBufferView; }

    void update(const void *buffer, uint32_t size) override;
protected:
    void doInit(const BufferInfo &info) override;
    void doInit(const BufferViewInfo &info) override;
    void doDestroy() override;
    void doResize(uint32_t size, uint32_t count) override;

    IntrusivePtr<GLESGPUBufferView> _gpuBufferView;
};

} // namespace cc::gfx
