#include "CoreStd.h"
#include "GFXShader.h"

NS_CC_BEGIN

GFXShader::GFXShader(GFXDevice* device)
: GFXObject(GFXObjectType::SHADER)
, _device(device)
{
}

GFXShader::~GFXShader() {
}

NS_CC_END
