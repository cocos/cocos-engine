#pragma once

#include "gfx-base/GFXDescriptorSetLayout.h"
#include "gfx-base/GFXDeviceObject.h"
#include "gfx-gles-new/GLESCore.h"
#include "base/std/container/unordered_map.h"
#include "base/std/container/vector.h"

namespace cc::gfx::gles {

struct GPUBinding {
    DescriptorType type = DescriptorType::UNKNOWN;
    uint32_t binding    = 0;  // current binding
    uint32_t count      = 0;  // current descriptor count
};

struct GPUDescriptorSetLayout : public GFXDeviceObject<DefaultDeleter> {
    // map from binding to offset of Descriptor
    ccstd::unordered_map<uint32_t, uint32_t> bindingMap;
    ccstd::vector<GPUBinding> bindings;
    uint32_t descriptorCount; // quick look at descriptor count;
};

class DescriptorSetLayout : public gfx::DescriptorSetLayout {
public:
    DescriptorSetLayout();
    ~DescriptorSetLayout() override;

    GPUDescriptorSetLayout *getGPUDescriptorSetLayout() const { return _layout.get(); }

protected:
    void doInit(const DescriptorSetLayoutInfo &info) override;
    void doDestroy() override;

    IntrusivePtr<GPUDescriptorSetLayout> _layout;
};

} // namespace cc::gfx::gles
