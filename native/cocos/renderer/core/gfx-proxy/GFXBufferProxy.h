#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL BufferProxy final : public Proxy<Buffer> {
public:
    using Proxy::Proxy;
    BufferProxy(Device *device) = delete;

    virtual bool initialize(const BufferInfo &info) override;
    virtual bool initialize(const BufferViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint offset, uint size) override;
};

} // namespace gfx
} // namespace cc
