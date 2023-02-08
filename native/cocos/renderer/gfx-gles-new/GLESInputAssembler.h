#pragma once

#include "gfx-base/GFXInputAssembler.h"
#include "gfx-base/GFXDeviceObject.h"
#include "base/std/container/vector.h"
#include "gfx-gles-new/GLESBuffer.h"

namespace cc::gfx::gles {

struct GPUAttribute {
    GLenum glType = 0;
    uint32_t size = 0;
    uint32_t count = 0;
    uint32_t stride = 1;
    uint32_t componentCount = 1;
    bool isNormalized = false;
    bool isInstanced = false;
    uint32_t offset = 0;
};

struct GPUInputAssembler : public GFXDeviceObject<DefaultDeleter> {
    GPUInputAssembler() noexcept = default;
    ~GPUInputAssembler() noexcept;

    void initVAO(const AttributeList &list);

    ccstd::vector<IntrusivePtr<GPUBufferView>> vertexBuffers;
    IntrusivePtr<GPUBufferView> indexBuffer;
    GLenum indexType = GL_UNSIGNED_INT;
};

class InputAssembler : public gfx::InputAssembler {
public:
    InputAssembler();
    ~InputAssembler() override;

    GPUInputAssembler *getGPUInputAssembler() const { return _gpuIa.get(); }

private:
    void doInit(const InputAssemblerInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUInputAssembler> _gpuIa;
};

} // namespace cc::gfx::gles
