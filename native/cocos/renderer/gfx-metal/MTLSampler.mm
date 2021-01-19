/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

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

CCMTLSampler::CCMTLSampler(Device *device) : Sampler(device) {}

bool CCMTLSampler::initialize(const SamplerInfo &info) {
    _minFilter = info.minFilter;
    _magFilter = info.magFilter;
    _mipFilter = info.mipFilter;
    _addressU = info.addressU;
    _addressV = info.addressV;
    _addressW = info.addressW;
    _maxAnisotropy = info.maxAnisotropy;
    _cmpFunc = info.cmpFunc;
    _borderColor = info.borderColor;
    _minLOD = info.minLOD;
    _maxLOD = info.maxLOD;
    _mipLODBias = info.mipLODBias;

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
    descriptor.lodMinClamp = _minLOD;
    descriptor.lodMaxClamp = _maxLOD;
    if (static_cast<CCMTLDevice *>(_device)->isSamplerDescriptorCompareFunctionSupported()) {
        descriptor.compareFunction = mu::toMTLCompareFunction(_cmpFunc);
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(static_cast<CCMTLDevice *>(_device)->getMTLDevice());
    _mtlSamplerState = [mtlDevice newSamplerStateWithDescriptor:descriptor];

    [descriptor release];

    return _mtlSamplerState != nil;
}

void CCMTLSampler::destroy() {
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
