#include "CoreStd.h"
#include "GFXShaderProxy.h"

namespace cc {
namespace gfx {

bool ShaderProxy::initialize(const ShaderInfo &info) {
    _name = info.name;
    _stages = info.stages;
    _attributes = info.attributes;
    _blocks = info.blocks;
    _samplers = info.samplers;

    bool res = _remote->initialize(info);

    return res;
}

void ShaderProxy::destroy() {
    _remote->destroy();
}

} // namespace gfx
} // namespace cc
