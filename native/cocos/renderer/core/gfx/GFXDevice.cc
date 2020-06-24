#include "CoreStd.h"
#include "GFXDevice.h"
#include "GFXContext.h"
namespace cc {
namespace gfx {

Device::Device() {
    memset(_features, 0, sizeof(_features));
}

Device::~Device() {
}

Format Device::getColorFormat() const {
    return _context->getColorFormat();
}

Format Device::getDepthStencilFormat() const {
    return _context->getDepthStencilFormat();
}

} // namespace gfx
} // namespace cc
