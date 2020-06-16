#include "CoreStd.h"
#include "GFXFence.h"

namespace cc {

GFXFence::GFXFence(GFXDevice *device)
: GFXObject(GFXObjectType::FENCE), _device(device) {
}

GFXFence::~GFXFence() {
}

}
