#include "CoreStd.h"
#include "GFXDevice.h"
#include "GFXContext.h"
NS_CC_BEGIN

GFXDevice::GFXDevice() {
    memset(_features, 0, sizeof(_features));
}

GFXDevice::~GFXDevice() {
}

GFXFormat GFXDevice::getColorFormat() const {
    return _context->getColorFormat();
}

GFXFormat GFXDevice::getDepthStencilFormat() const {
    return _context->getDepthStencilFormat();
}

NS_CC_END
