#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXDescriptorSetLayout.h"

namespace cc {
namespace gfx {

class CC_DLL DescriptorSetLayoutProxy : public Proxy<DescriptorSetLayout> {
public:
    using Proxy::Proxy;
    DescriptorSetLayoutProxy(Device *device) = delete;

    virtual bool initialize(const DescriptorSetLayoutInfo &info) override;
    virtual void destroy() override;
};

} // namespace gfx
} // namespace cc
