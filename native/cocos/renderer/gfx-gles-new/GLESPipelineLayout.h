#pragma once

#include "gfx-base/GFXPipelineLayout.h"
#include "gfx-gles-new/GLESDescriptorSetLayout.h"

namespace cc::gfx::gles {

struct GPUPipelineLayout : public GFXDeviceObject<DefaultDeleter> {
    ccstd::vector<IntrusivePtr<GPUDescriptorSetLayout>> setLayouts;
};

class PipelineLayout : public gfx::PipelineLayout {
public:
    PipelineLayout();
    ~PipelineLayout() override;

    GPUPipelineLayout *getGPUPipelineLayout() const { return _layout.get(); }

protected:
    void doInit(const PipelineLayoutInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUPipelineLayout> _layout;
};

} // namespace cc::gfx::gles
