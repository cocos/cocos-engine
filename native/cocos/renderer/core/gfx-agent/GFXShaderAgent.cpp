#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceAgent.h"
#include "GFXShaderAgent.h"

namespace cc {
namespace gfx {

bool ShaderAgent::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    ENCODE_COMMAND_2(
        ((DeviceAgent *)_device)->getMainEncoder(),
        ShaderInit,
        actor, getActor(),
        info, info,
        {
            actor->initialize(info);
        });

    return true;
}

void ShaderAgent::destroy() {
    if (_actor) {
        ENCODE_COMMAND_1(
            ((DeviceAgent *)_device)->getMainEncoder(),
            ShaderDestroy,
            actor, getActor(),
            {
                CC_DESTROY(actor);
            });

        _actor = nullptr;
    }
}

} // namespace gfx
} // namespace cc
