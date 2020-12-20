#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayoutAgent final : public Agent<DescriptorSetLayout> {
public:
    using Agent::Agent;
    DescriptorSetLayoutAgent(Device *device) = delete;

    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
