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
    // Device instance is created and hold by TS. Native should hold it too
    // to make sure it exists after JavaScript virtural machine is destroyed.
    // Then will destory the Device instance in native.
    addRef();
    _features.fill(false);
    _formatFeatures.fill(FormatFeature::NONE);
}

Device::~Device() {
    Device::instance = nullptr;
    CC_SAFE_RELEASE(_cmdBuff);
    CC_SAFE_RELEASE(_queue);
}

bool Device::initialize(const DeviceInfo &info) {
    _bindingMappingInfo = info.bindingMappingInfo;

#if CC_CPU_ARCH == CC_CPU_ARCH_32
    static_assert(sizeof(void *) == 4, "pointer size assumption broken");
#else
    static_assert(sizeof(void *) == 8, "pointer size assumption broken");
#endif

    _xr = CC_GET_XR_INTERFACE();
    bool result = doInit(info);

    CC_SAFE_ADD_REF(_cmdBuff);
    CC_SAFE_ADD_REF(_queue);
    return result;
}

void Device::destroy() {
    for (auto pair : _samplers) {
        CC_SAFE_DELETE(pair.second);
    }
    _samplers.clear();

    for (auto pair : _generalBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _generalBarriers.clear();

    for (auto pair : _textureBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _textureBarriers.clear();

    for (auto pair : _bufferBarriers) {
        CC_SAFE_DELETE(pair.second);
    }
    _bufferBarriers.clear();

    doDestroy();

    CC_SAFE_DELETE(_onAcquire);
}

void Device::destroySurface(void *windowHandle) {
    for (const auto &swapchain : _swapchains) {
        if (swapchain->getWindowHandle() == windowHandle) {
            swapchain->destroySurface();
            break;
        }
    }
}

void Device::createSurface(void *windowHandle) {
    for (const auto &swapchain : _swapchains) {
        if (!swapchain->getWindowHandle()) {
            swapchain->createSurface(windowHandle);
            break;
        }
    }
}

Sampler *Device::getSampler(const SamplerInfo &info) {
    if (!_samplers.count(info)) {
        _samplers[info] = createSampler(info);
    }
    return _samplers[info];
}

GeneralBarrier *Device::getGeneralBarrier(const GeneralBarrierInfo &info) {
    if (!_generalBarriers.count(info)) {
        _generalBarriers[info] = createGeneralBarrier(info);
    }
    return _generalBarriers[info];
}

TextureBarrier *Device::getTextureBarrier(const TextureBarrierInfo &info) {
    if (!_textureBarriers.count(info)) {
        _textureBarriers[info] = createTextureBarrier(info);
    }
    return _textureBarriers[info];
}

BufferBarrier *Device::getBufferBarrier(const BufferBarrierInfo &info) {
    if (!_bufferBarriers.count(info)) {
        _bufferBarriers[info] = createBufferBarrier(info);
    }
    return _bufferBarriers[info];
}


Swapchain *Device::createXRSwapchain(const SwapchainInfo &info) {
    _xr->createXRSwapchains();
    int swapChainWidth = _xr->getXRConfig(xr::XRConfigKey::SWAPCHAIN_WIDTH).getInt();
    int swapChainHeight = _xr->getXRConfig(xr::XRConfigKey::SWAPCHAIN_HEIGHT).getInt();
    Swapchain *res = createSwapchain();
    _xr->updateXRSwapchainTypedID(res->getTypedID());
    SwapchainInfo swapchainInfo;
    swapchainInfo.copy(info);
    swapchainInfo.width = swapChainWidth;
    swapchainInfo.height = swapChainHeight;
    res->initialize(swapchainInfo);
    _swapchains.push_back(res);
    return res;
}

} // namespace gfx
} // namespace cc
