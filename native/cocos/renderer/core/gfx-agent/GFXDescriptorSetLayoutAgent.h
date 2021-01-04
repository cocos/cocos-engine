#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayoutAgent final : public Agent<DescriptorSetLayout> {
public:
    using Agent::Agent;
    DescriptorSetLayoutAgent(Device *device) = delete;
    ~DescriptorSetLayoutAgent() override;

    bool initialize(const DescriptorSetLayoutInfo &info) override;
    void destroy() override;
};

} // namespace gfx
} // namespace cc
