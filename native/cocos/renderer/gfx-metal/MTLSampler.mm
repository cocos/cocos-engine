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

#import "MTLStd.h"

#import "MTLDevice.h"
#import "MTLGPUObjects.h"
#import "MTLSampler.h"
#import "MTLUtils.h"
#import <Metal/MTLDevice.h>

namespace cc {
namespace gfx {
namespace {
CCMTLSampler* defaultSampler = nullptr;
};

CCMTLSampler::CCMTLSampler(const SamplerInfo& info) : Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();
    MTLSamplerDescriptor *descriptor = [[MTLSamplerDescriptor alloc] init];
#if (CC_PLATFORM == CC_PLATFORM_MAC_OSX)
    descriptor.borderColor = MTLSamplerBorderColorTransparentBlack;
#endif
    descriptor.sAddressMode = mu::toMTLSamplerAddressMode(info.addressU);
    descriptor.tAddressMode = mu::toMTLSamplerAddressMode(info.addressV);
    descriptor.rAddressMode = mu::toMTLSamplerAddressMode(info.addressW);
    descriptor.minFilter = mu::toMTLSamplerMinMagFilter(info.minFilter);
    descriptor.magFilter = mu::toMTLSamplerMinMagFilter(info.magFilter);
    descriptor.mipFilter = mu::toMTLSamplerMipFilter(info.mipFilter);
    descriptor.maxAnisotropy = info.maxAnisotropy == 0 ? 1 : info.maxAnisotropy;
    if (CCMTLDevice::getInstance()->isSamplerDescriptorCompareFunctionSupported()) {
        descriptor.compareFunction = mu::toMTLCompareFunction(info.cmpFunc);
    }

    id<MTLDevice> mtlDevice = id<MTLDevice>(CCMTLDevice::getInstance()->getMTLDevice());
    _mtlSamplerState = [mtlDevice newSamplerStateWithDescriptor:descriptor];

    [descriptor release];
}

CCMTLSampler::~CCMTLSampler() {
    id<MTLSamplerState> samplerState = _mtlSamplerState;
    _mtlSamplerState = nil;

    std::function<void(void)> destroyFunc = [samplerState]() {
        if (samplerState) {
            [samplerState release];
        }
    };
    CCMTLGPUGarbageCollectionPool::getInstance()->collect(destroyFunc);
}

CCMTLSampler* CCMTLSampler::getDefaultSampler() {
    if(!defaultSampler) {
        SamplerInfo info;
        defaultSampler = new CCMTLSampler(info);
    }
    return defaultSampler;
}
void CCMTLSampler::deleteDefaultSampler(){
    if(defaultSampler){
        delete defaultSampler;
        defaultSampler = nullptr;
    }
}
} // namespace gfx
} // namespace cc
