#pragma once

#include "gfx-base/GFXInputAssembler.h"
#include "gfx-base/GFXDeviceObject.h"
#include "base/std/container/vector.h"
#include "gfx-gles-new/GLESBuffer.h"

namespace cc::gfx::gles {
struct GPUAttribute {
    GLint  size            = 0;
    GLint  count           = 0;
    GLenum type            = 0;
    GLsizei stride         = 1;
    GLuint  divisor        = 1;
    uint32_t stream        = 0;
    GLboolean isNormalized = false;
    const void * offset    = 0;
    ccstd::string name;
};

struct GPUInputAssembler : public GFXDeviceObject<DefaultDeleter> {
    GPUInputAssembler() noexcept = default;
    ~GPUInputAssembler() noexcept;

    void initInput(const AttributeList &list);

    ccstd::vector<IntrusivePtr<GPUBufferView>> vertexBuffers;
    IntrusivePtr<GPUBufferView> indexBuffer;
    GLenum indexType = GL_UNSIGNED_INT;
    ccstd::vector<GPUAttribute> attributes;
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
