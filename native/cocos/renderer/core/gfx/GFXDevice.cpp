/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

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
    //EventDispatcher::addCustomEventListener(EVENT_RESTART_VM, [=](const CustomEvent&) -> void {
    //    // FIXME: wait & flush all pending gfx commands
    //    Device::_instance->destroy();
    //});
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
