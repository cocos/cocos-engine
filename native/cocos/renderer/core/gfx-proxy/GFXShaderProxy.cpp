#include "CoreStd.h"
#include "GFXShaderProxy.h"
#include "GFXDeviceProxy.h"

namespace cc {
namespace gfx {

bool ShaderProxy::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    ENCODE_COMMAND_2(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        ShaderInit,
        remote, GetRemote(),
        info, info,
        {
            remote->initialize(info);
        });

    return true;
}

void ShaderProxy::destroy() {
    ENCODE_COMMAND_1(
        ((DeviceProxy*)_device)->getDeviceThread()->GetMainCommandEncoder(),
        ShaderDestroy,
        remote, GetRemote(),
        {
            remote->destroy();
        });
}

} // namespace gfx
} // namespace cc
