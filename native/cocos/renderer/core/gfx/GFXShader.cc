#include "CoreStd.h"
#include "GFXShader.h"

CC_NAMESPACE_BEGIN

GFXShader::GFXShader(GFXDevice* device)
    : device_(device),
      hash_(0) {
}

GFXShader::~GFXShader() {
}

CC_NAMESPACE_END
