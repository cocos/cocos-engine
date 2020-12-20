#pragma once

#include "GFXAgent.h"
#include "../gfx/GFXInputAssembler.h"

namespace cc {
namespace gfx {

class CC_DLL InputAssemblerAgent final : public Agent<InputAssembler> {
public:
    using Agent::Agent;
    InputAssemblerAgent(Device *device) = delete;

    virtual bool initialize(const InputAssemblerInfo &info) override;
    virtual void destroy() override;

    virtual void setVertexCount(uint count) override { _vertexCount = count; _actor->setVertexCount(count); }
    virtual void setFirstVertex(uint first) override { _firstVertex = first; _actor->setFirstVertex(first); }
    virtual void setIndexCount(uint count) override { _indexCount = count; _actor->setIndexCount(count); }
    virtual void setFirstIndex(uint first) override { _firstIndex = first; _actor->setFirstIndex(first); }
    virtual void setVertexOffset(uint offset) override { _vertexOffset = offset; _actor->setVertexOffset(offset); }
    virtual void setInstanceCount(uint count) override { _instanceCount = count; _actor->setInstanceCount(count); }
    virtual void setFirstInstance(uint first) override { _firstInstance = first; _actor->setFirstInstance(first); }
};

} // namespace gfx
} // namespace cc
