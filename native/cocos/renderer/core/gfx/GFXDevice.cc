#include "CoreStd.h"
#include "GFXDevice.h"

NS_CC_BEGIN

GFXDevice::GFXDevice()
{
  memset(_features, 0, sizeof(_features));
}

GFXDevice::~GFXDevice() {
}

NS_CC_END
