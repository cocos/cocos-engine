#include "CoreStd.h"
#include "GFXFence.h"

NS_CC_BEGIN

GFXFence::GFXFence(GFXDevice *device)
: GFXObject(GFXObjectType::FENCE), _device(device) {
}

GFXFence::~GFXFence() {
}

NS_CC_END
