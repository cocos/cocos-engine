#pragma once

#include "gfx-base/GFXPipelineState.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESPipelineState final : public PipelineState {
public:
    GLESPipelineState();
    ~GLESPipelineState() override;

    GLESGPUPipelineState *gpuPipelineState() const { return _gpuPipelineState.get(); }

protected:
    void doInit(const PipelineStateInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUPipelineState> _gpuPipelineState;
};


} // namespace cc::gfx
