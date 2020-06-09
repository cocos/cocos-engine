#include "CoreStd.h"
#include "GFXSampler.h"

NS_CC_BEGIN

GFXSampler::GFXSampler(GFXDevice *device)
: GFXObject(GFXObjectType::SAMPLER), _device(device) {
    _borderColor.r = 0.0f;
    _borderColor.g = 0.0f;
    _borderColor.b = 0.0f;
    _borderColor.a = 0.0f;
}

GFXSampler::~GFXSampler() {
}

NS_CC_END
