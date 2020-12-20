#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL BufferAgent final : public Agent<Buffer> {
public:
    using Agent::Agent;
    BufferAgent(Device *device) = delete;

    virtual bool initialize(const BufferInfo &info) override;
    virtual bool initialize(const BufferViewInfo &info) override;
    virtual void destroy() override;
    virtual void resize(uint size) override;
    virtual void update(void *buffer, uint size) override;
};

} // namespace gfx
} // namespace cc
