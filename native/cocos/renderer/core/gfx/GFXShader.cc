#include "CoreStd.h"

#include "GFXDevice.h"
#include "GFXShader.h"

namespace cc {
namespace gfx {

Shader::Shader(Device *device)
: GFXObject(ObjectType::SHADER), _device(device) {
    _shaderID = device->genShaderId();
}

Shader::~Shader() {
}

} // namespace gfx
} // namespace cc
