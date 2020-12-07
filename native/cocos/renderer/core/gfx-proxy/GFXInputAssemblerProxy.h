#pragma once

#include "GFXProxy.h"
#include "../gfx/GFXInputAssembler.h"

namespace cc {
namespace gfx {

class CC_DLL InputAssemblerProxy final : public Proxy<InputAssembler> {
public:
    using Proxy::Proxy;
    InputAssemblerProxy(Device *device) = delete;

    virtual bool initialize(const InputAssemblerInfo &info) override;
    virtual void destroy() override;

    virtual void setVertexCount(uint count) override { _vertexCount = count; _remote->setVertexCount(count); }
    virtual void setFirstVertex(uint first) override { _firstVertex = first; _remote->setFirstVertex(first); }
    virtual void setIndexCount(uint count) override { _indexCount = count; _remote->setIndexCount(count); }
    virtual void setFirstIndex(uint first) override { _firstIndex = first; _remote->setFirstIndex(first); }
    virtual void setVertexOffset(uint offset) override { _vertexOffset = offset; _remote->setVertexOffset(offset); }
    virtual void setInstanceCount(uint count) override { _instanceCount = count; _remote->setInstanceCount(count); }
    virtual void setFirstInstance(uint first) override { _firstInstance = first; _remote->setFirstInstance(first); }
};

} // namespace gfx
} // namespace cc
