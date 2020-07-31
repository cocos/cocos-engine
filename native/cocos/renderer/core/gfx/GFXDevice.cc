#include "CoreStd.h"
#include "GFXDevice.h"
#include "GFXContext.h"
namespace cc {
namespace gfx {

Device *Device::_instance = nullptr;

Device *Device::getInstance() {
    return Device::_instance;
}

Device::Device() {
    Device::_instance = this;
    memset(_features, 0, sizeof(_features));
}

Device::~Device() {
    Device::_instance = nullptr;
}

Format Device::getColorFormat() const {
    return _context->getColorFormat();
}

Format Device::getDepthStencilFormat() const {
    return _context->getDepthStencilFormat();
}

} // namespace gfx
} // namespace cc
