#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXInputAssembler.h"

namespace cc {
namespace gfx {

class CC_DLL InputAssemblerAgent final : public Agent<InputAssembler> {
public:
    using Agent::Agent;
    InputAssemblerAgent(Device *device) = delete;
    ~InputAssemblerAgent() override;

    bool initialize(const InputAssemblerInfo &info) override;
    void destroy() override;

    void setVertexCount(uint count) override { _vertexCount = count; _actor->setVertexCount(count); }
    void setFirstVertex(uint first) override { _firstVertex = first; _actor->setFirstVertex(first); }
    void setIndexCount(uint count) override { _indexCount = count; _actor->setIndexCount(count); }
    void setFirstIndex(uint first) override { _firstIndex = first; _actor->setFirstIndex(first); }
    void setVertexOffset(uint offset) override { _vertexOffset = offset; _actor->setVertexOffset(offset); }
    void setInstanceCount(uint count) override { _instanceCount = count; _actor->setInstanceCount(count); }
    void setFirstInstance(uint first) override { _firstInstance = first; _actor->setFirstInstance(first); }
};

} // namespace gfx
} // namespace cc
