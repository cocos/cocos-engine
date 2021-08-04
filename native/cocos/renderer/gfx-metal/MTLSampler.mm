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

#include "MTLStd.h"

#include "MTLDevice.h"
#include "MTLGPUObjects.h"
#include "MTLSampler.h"
#include "MTLUtils.h"
#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {

CCMTLSampler::CCMTLSampler() : Sampler() {
    _typedID = generateObjectID<decltype(this)>();
}

CCMTLSampler::~CCMTLSampler() {
    destroy();
}

void CCMTLSampler::doInit(const SamplerInfo &info) {
    MTLSamplerDescriptor *descriptor = [[MTLSamplerDescriptor alloc] init];
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    descriptor.borderColor = (MTLSamplerBorderColor)mu::toMTLSamplerBorderColor(_borderColor);
#endif
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(_addressU);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(_addressV);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(_addressW);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(_minFilter);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(_magFilter);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(_mipFilter);
    descriptor.maxAnisotropy = _maxAnisotropy == 0 ? 1 : _maxAnisotropy;
    if (CCMTLDevice::getInstance()->isSamplerDescriptorCompareFunctionSupported()) {
        descriptor.compareFunction = mu::toMTLCompareFunction(_cmpFunc);
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlSamplerState = [mtlDevice newSamplerStateWithDescriptor:descriptor];

    [descriptor release];
}

void CCMTLSampler::doDestroy() {
    id<MTLSamplerState> samplerState = _mtlSamplerState;
    _mtlSamplerState = nil;

    std::function<void(void)> destroyFunc = [=]() {
        if (samplerState) {
            [samplerState release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

} // namespace gfx
} // namespace cc
