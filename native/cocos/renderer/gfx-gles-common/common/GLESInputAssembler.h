#pragma once

#include "gfx-base/GFXInputAssembler.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESInputAssembler final : public InputAssembler {
public:
    GLESInputAssembler();
    ~GLESInputAssembler() override;

    GLESGPUInputAssembler *gpuInputAssembler() { return _gpuIA; }

protected:
    void doInit(const InputAssemblerInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUInputAssembler> _gpuIA;
};

} // namespace cc::gfx
