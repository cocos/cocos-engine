#pragma once

#include "gfx-base/GFXDescriptorSet.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESTexture.h"
#include "gfx-gles-new/GLESBuffer.h"
#include "gfx-gles-new/GLESSampler.h"
#include "base/std/container/vector.h"

namespace cc::gfx::gles {

struct Descriptor {
    DescriptorType type = DescriptorType::UNKNOWN;
    IntrusivePtr<GPUBufferView> buffer = nullptr;
    IntrusivePtr<GPUTextureView> texture = nullptr;
    IntrusivePtr<GPUSampler> sampler = nullptr;
};

struct GPUDescriptorSet : public GFXDeviceObject<DefaultDeleter> {
    ccstd::vector<Descriptor> descriptors;
};

class DescriptorSet final : public gfx::DescriptorSet {
public:
    DescriptorSet();
    ~DescriptorSet() override;

    void update() override;
    void forceUpdate() override;

    GPUDescriptorSet *getGPUDescriptorSet() const { return _gpuSet.get(); }

protected:
    void doInit(const DescriptorSetInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUDescriptorSet> _gpuSet;
};

} // namespace cc::gfx::gles
