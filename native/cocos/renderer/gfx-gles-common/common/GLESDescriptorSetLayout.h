#pragma once

#include "gfx-base/GFXDescriptorSetLayout.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESDescriptorSetLayout final : public DescriptorSetLayout {
public:
    GLESDescriptorSetLayout();
    ~GLESDescriptorSetLayout() override;

    GLESGPUDescriptorSetLayout *gpuDescriptorSetLayout() const { return _gpuDescriptorSetLayout; }

protected:
    void doInit(const DescriptorSetLayoutInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUDescriptorSetLayout> _gpuDescriptorSetLayout;
};

} // namespace cc::gfx
