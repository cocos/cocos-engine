#pragma once

#include "VKStd.h"
#include "gfx-base/GFXAccelerationStructure.h"

namespace cc {

namespace gfx {

struct CCVKGPUAccelerationStructure;

class CC_VULKAN_API CCVKAccelerationStructure final : public AccelerationStructure {
public:
    CCVKAccelerationStructure();
    ~CCVKAccelerationStructure() override;

    inline CCVKGPUAccelerationStructure *gpuAccelerationStructure() const { return _gpuAccelerationStructure; }

protected:
    void doInit(const AccelerationStructureInfo &info) override;
    void doDestroy() override;
    void doUpdate() override;
    void doBuild() override;

    CCVKGPUAccelerationStructure *_gpuAccelerationStructure = nullptr;
};

} // namespace gfx
} // namespace cc
