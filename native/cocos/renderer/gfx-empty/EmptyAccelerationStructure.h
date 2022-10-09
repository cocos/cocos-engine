#pragma once

#include "gfx-base/GFXAccelerationStructure.h"

namespace cc {
namespace gfx {

class CC_DLL EmptyAccelerationStructure final : public AccelerationStructure {
public:
    void doInit(const AccelerationStructureInfo& info) override;
    void doDestroy() override;
    void doUpdate() override;
    void doBuild() override;
    void doCompact() override;
};

} // namespace gfx
} // namespace cc
