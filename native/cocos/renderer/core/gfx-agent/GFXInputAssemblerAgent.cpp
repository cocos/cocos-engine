#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXBufferAgent.h"
#include "GFXDeviceAgent.h"
#include "GFXInputAssemblerAgent.h"

namespace cc {
namespace gfx {

bool InputAssemblerAgent::initialize(const InputAssemblerInfo &info) {
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

    InputAssemblerInfo actorInfo = info;
    for (uint i = 0u; i < actorInfo.vertexBuffers.size(); ++i) {
        actorInfo.vertexBuffers[i] = ((BufferAgent *)actorInfo.vertexBuffers[i])->getActor();
    }
    if (actorInfo.indexBuffer) {
        actorInfo.indexBuffer = ((BufferAgent *)actorInfo.indexBuffer)->getActor();
    }
    if (actorInfo.indirectBuffer) {
        actorInfo.indirectBuffer = ((BufferAgent *)actorInfo.indirectBuffer)->getActor();
    }

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        InputAssemblerInit,
        actor, getActor(),
        info, actorInfo,
        {
            actor->initialize(info);
        });

    return true;
}

void InputAssemblerAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            InputAssemblerDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
