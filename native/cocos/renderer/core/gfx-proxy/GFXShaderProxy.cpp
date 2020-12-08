#include "CoreStd.h"

#include "threading/CommandEncoder.h"
#include "GFXDeviceProxy.h"
#include "GFXShaderProxy.h"

namespace cc {
namespace gfx {

bool ShaderProxy::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    ENCODE_COMMAND_2(
        ((DeviceProxy *)_device)->getMainEncoder(),
        ShaderInit,
        remote, getRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void ShaderProxy::destroy() {
    if (_remote) {
        ENCODE_COMMAND_1(
            ((DeviceProxy *)_device)->getMainEncoder(),
            ShaderDestroy,
            remote, getRemote(),
            {
                CC_DESTROY(remote);
            });

        _remote = nullptr;
    }
}

} // namespace gfx
} // namespace cc
