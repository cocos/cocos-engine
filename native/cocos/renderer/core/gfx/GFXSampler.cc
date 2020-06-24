#include "CoreStd.h"
#include "GFXSampler.h"

namespace cc {
namespace gfx {

Sampler::Sampler(Device *device)
: GFXObject(ObjectType::SAMPLER), _device(device) {
    _borderColor.r = 0.0f;
    _borderColor.g = 0.0f;
    _borderColor.b = 0.0f;
    _borderColor.a = 0.0f;
}

Sampler::~Sampler() {
}

} // namespace gfx
} // namespace cc
