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

#pragma once

#import "gfx-base/states/GFXSampler.h"

#import <Metal/MTLSampler.h>

namespace cc {
namespace gfx {

class CCMTLSampler final : public Sampler {
public:
    explicit CCMTLSampler(const SamplerInfo& info, uint32_t hash);
    ~CCMTLSampler();
    CCMTLSampler() = delete;
    CCMTLSampler(const CCMTLSampler &)=delete;
    CCMTLSampler(CCMTLSampler &&)=delete;
    CCMTLSampler &operator=(const CCMTLSampler &)=delete;
    CCMTLSampler &operator=(CCMTLSampler &&)=delete;

    inline id<MTLSamplerState> getMTLSamplerState() const { return _mtlSamplerState; }

protected:

    id<MTLSamplerState> _mtlSamplerState = nil;
};

} // namespace gfx
} // namespace cc
