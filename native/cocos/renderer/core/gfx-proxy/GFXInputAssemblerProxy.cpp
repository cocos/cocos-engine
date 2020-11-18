#include "CoreStd.h"
#include "GFXInputAssemblerProxy.h"
#include "GFXBufferProxy.h"

namespace cc {
namespace gfx {

bool InputAssemblerProxy::initialize(const InputAssemblerInfo &info) {
    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
        _firstVertex = 0;
        _vertexOffset = 0;
    }
    _attributesHash = computeAttributesHash();

    InputAssemblerInfo remoteInfo = info;
    for (uint i = 0u; i < remoteInfo.vertexBuffers.size(); ++i) {
        remoteInfo.vertexBuffers[i] = ((BufferProxy*)remoteInfo.vertexBuffers[i])->GetRemote();
    }
    if (remoteInfo.indexBuffer) {
        remoteInfo.indexBuffer = ((BufferProxy*)remoteInfo.indexBuffer)->GetRemote();
    }
    if (remoteInfo.indirectBuffer) {
        remoteInfo.indirectBuffer = ((BufferProxy *)remoteInfo.indirectBuffer)->GetRemote();
    }

    bool res = _remote->initialize(remoteInfo);

    return res;
}

void InputAssemblerProxy::destroy() {
    _remote->destroy();
}

} // namespace gfx
} // namespace cc
