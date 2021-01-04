#include "CoreStd.h"

#include "base/threading/MessageQueue.h"
#include "GFXDeviceAgent.h"
#include "GFXShaderAgent.h"

namespace cc {
namespace gfx {

ShaderAgent::~ShaderAgent() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        ShaderDestruct,
        actor, _actor,
        {
            CC_DELETE(actor);
        });
}

bool ShaderAgent::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    ENQUEUE_MESSAGE_2(
        ((DeviceAgent *)_device)->getMessageQueue(),
        ShaderInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void ShaderAgent::destroy() {
    ENQUEUE_MESSAGE_1(
        ((DeviceAgent *)_device)->getMessageQueue(),
        ShaderDestroy,
        actor, getActor(),
        {
            actor->destroy();
        });
}

} // namespace gfx
} // namespace cc
