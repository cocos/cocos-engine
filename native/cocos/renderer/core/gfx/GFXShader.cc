#include "CoreStd.h"
#include "GFXShader.h"

namespace cc {
namespace gfx {

Shader::Shader(Device *device)
: GFXObject(ObjectType::SHADER), _device(device) {
}

Shader::~Shader() {
}

} // namespace gfx
} // namespace cc
