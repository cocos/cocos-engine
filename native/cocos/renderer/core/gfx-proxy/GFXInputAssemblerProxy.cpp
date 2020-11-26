#include "CoreStd.h"

#include "../thread/CommandEncoder.h"
#include "GFXBufferProxy.h"
#include "GFXDeviceProxy.h"
#include "GFXInputAssemblerProxy.h"

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
        remoteInfo.vertexBuffers[i] = ((BufferProxy *)remoteInfo.vertexBuffers[i])->getRemote();
    }
    if (remoteInfo.indexBuffer) {
        remoteInfo.indexBuffer = ((BufferProxy *)remoteInfo.indexBuffer)->getRemote();
    }
    if (remoteInfo.indirectBuffer) {
        remoteInfo.indirectBuffer = ((BufferProxy *)remoteInfo.indirectBuffer)->getRemote();
    }

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        InputAssemblerInit,
        remote, getRemote(),
        info, remoteInfo,
        {
            remote->initialize(info);
        });

    return true;
}

void InputAssemblerProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            InputAssemblerDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
