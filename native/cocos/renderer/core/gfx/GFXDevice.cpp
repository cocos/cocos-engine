#include "CoreStd.h"

#include "GFXContext.h"
#include "GFXDevice.h"

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
    // On Android, engine will check vulkan, gles3, gles2 compatibility in sequence.
    // Device::_instance will be the supported device, it may not be equal to this.
    // For example, if a vulkan is not supported and gles3 is supported by a Android
    // device. Then the function invoking sequence is:
    // - new VKDevice() -> Device::_instance == VKDevice
    // - GLES3Device() -> Device::_instance == GLES3Device
    // delete VKDevice -> Device::_instance != this
    if (this == Device::_instance) {
        Device::_instance = nullptr;
    }
}

Format Device::getColorFormat() const {
    return _context->getColorFormat();
}

Format Device::getDepthStencilFormat() const {
    return _context->getDepthStencilFormat();
}

} // namespace gfx
} // namespace cc
