#include "CoreStd.h"
#include "GFXShader.h"

namespace cc {

GFXShader::GFXShader(GFXDevice *device)
: GFXObject(GFXObjectType::SHADER), _device(device) {
}

GFXShader::~GFXShader() {
}

}
