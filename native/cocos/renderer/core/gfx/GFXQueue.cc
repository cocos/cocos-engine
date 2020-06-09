#include "CoreStd.h"
#include "GFXQueue.h"

NS_CC_BEGIN

GFXQueue::GFXQueue(GFXDevice *device)
: GFXObject(GFXObjectType::QUEUE), _device(device) {
}

GFXQueue::~GFXQueue() {
}

NS_CC_END
