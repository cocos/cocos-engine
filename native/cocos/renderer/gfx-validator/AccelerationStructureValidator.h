#pragma once

#include "base/Agent.h"
#include "gfx-base/GFXAccelerationStructure.h"

namespace cc {
namespace gfx {

class CC_DLL AccelerationStructureValidator final : public Agent<AccelerationStructure> {
public:
    explicit AccelerationStructureValidator(Texture *actor);
    ~AccelerationStructureValidator() override;

protected:
    friend class SwapchainValidator;

    void doInit(const AccelerationStructureInfo &info) override;
    void doDestroy() override;
    void doBuild() override;
    void doUpdate() override;
};

} // namespace gfx
} // namespace cc
