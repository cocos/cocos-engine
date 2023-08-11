#pragma once

#include "gfx-base/GFXPipelineLayout.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESPipelineLayout final : public PipelineLayout {
public:
    GLESPipelineLayout();
    ~GLESPipelineLayout() override;

    GLESGPUPipelineLayout *gpuPipelineLayout() const { return _gpuPipelineLayout.get(); }

protected:
    void doInit(const PipelineLayoutInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUPipelineLayout> _gpuPipelineLayout;
};

} // namespace cc::gfx
