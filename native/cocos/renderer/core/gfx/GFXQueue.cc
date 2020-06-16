#include "CoreStd.h"
#include "GFXQueue.h"

namespace cc {

GFXQueue::GFXQueue(GFXDevice *device)
: GFXObject(GFXObjectType::QUEUE), _device(device) {
}

GFXQueue::~GFXQueue() {
}

}
