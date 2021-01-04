#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXBuffer.h"

namespace cc {
namespace gfx {

class CC_DLL BufferAgent final : public Agent<Buffer> {
public:
    using Agent::Agent;
    BufferAgent(Device *device) = delete;
    ~BufferAgent() override;

    bool initialize(const BufferInfo &info) override;
    bool initialize(const BufferViewInfo &info) override;
    void destroy() override;
    void resize(uint size) override;
    void update(void *buffer, uint size) override;
};

} // namespace gfx
} // namespace cc
