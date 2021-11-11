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

#include "base/CoreStd.h"

#include "GFXDevice.h"
#include "GFXObject.h"
#include "base/memory/Memory.h"

namespace cc {
namespace gfx {

Device *Device::instance = nullptr;

Device *Device::getInstance() {
    return Device::instance;
}

Device::Device() {
    Device::instance = this;
    _features.fill(false);
}

Device::~Device() {
    Device::instance = nullptr;
}

bool Device::initialize(const DeviceInfo &info) {
    _bindingMappingInfo = info.bindingMappingInfo;
    if (_bindingMappingInfo.bufferOffsets.empty()) {
        _bindingMappingInfo.bufferOffsets.push_back(0);
    }
    if (_bindingMappingInfo.samplerOffsets.empty()) {
        _bindingMappingInfo.samplerOffsets.push_back(0);
    }

    return doInit(info);
}

void Device::destroy() {
    for (auto pair : _samplers) {
        CC_SAFE_DELETE(pair.second);
    }

    for (auto pair : _globalBarriers) {
        CC_SAFE_DELETE(pair.second);
    }

    for (auto pair : _textureBarriers) {
        CC_SAFE_DELETE(pair.second);
    }

    _bindingMappingInfo.bufferOffsets.clear();
    _bindingMappingInfo.samplerOffsets.clear();

    doDestroy();

    CC_SAFE_DELETE(_onAcquire);
}

void Device::destroySurface(void *windowHandle) {
    for (auto *swapchain :_swapchains) {
        if (swapchain->getWindowHandle() == windowHandle) {
            swapchain->destroySurface();
            break;
        }
    }
}

void Device::createSurface(void *windowHandle) {
    for (auto *swapchain :_swapchains) {
        if (!swapchain->getWindowHandle()) {
            swapchain->createSurface(windowHandle);
            break;
        }
    }
}

} // namespace gfx
} // namespace cc
