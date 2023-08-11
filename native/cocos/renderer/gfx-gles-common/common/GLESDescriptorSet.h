#pragma once

#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-gles-common/common/GLESGPUObjects.h"

namespace cc::gfx {

class GLESDescriptorSet final : public DescriptorSet {
public:
    GLESDescriptorSet();
    ~GLESDescriptorSet() override;

    GLESGPUDescriptorSet *gpuDescriptorSet() const { return _gpuDescriptorSet; }

    void update() override;
    void forceUpdate() override;

protected:
    void doInit(const DescriptorSetInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GLESGPUDescriptorSet> _gpuDescriptorSet;
};

} // namespace cc::gfx
