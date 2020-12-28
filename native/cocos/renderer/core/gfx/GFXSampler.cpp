#include "CoreStd.h"

#include "GFXSampler.h"

namespace cc {
namespace gfx {

Sampler::Sampler(Device *device)
: GFXObject(ObjectType::SAMPLER), _device(device) {
    _borderColor.x = 0.0f;
    _borderColor.y = 0.0f;
    _borderColor.z = 0.0f;
    _borderColor.w = 0.0f;
}

Sampler::~Sampler() {
}

} // namespace gfx
} // namespace cc
