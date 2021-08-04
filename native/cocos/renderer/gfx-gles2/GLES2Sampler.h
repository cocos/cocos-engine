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

#include "gfx-base/GFXSampler.h"

namespace cc {
namespace gfx {

class GLES2GPUSampler;

class CC_GLES2_API GLES2Sampler final : public Sampler {
public:
    GLES2Sampler();
    ~GLES2Sampler();

    inline GLES2GPUSampler *gpuSampler() const { return _gpuSampler; }

protected:
    void doInit(const SamplerInfo &info) override;
    void doDestroy() override;

    GLES2GPUSampler *_gpuSampler = nullptr;
    String _name;
    Filter _minFilter = Filter::LINEAR;
    Filter _magFilter = Filter::LINEAR;
    Filter _mipFilter = Filter::NONE;
    Address _addressU = Address::WRAP;
    Address _addressV = Address::WRAP;
    Address _addressW = Address::WRAP;
    uint _maxAnisotropy = 16;
    ComparisonFunc _cmpFunc = ComparisonFunc::NEVER;
    Color _borderColor;
    uint _minLOD = 0;
    uint _maxLOD = 1000;
    float _mipLODBias = 0.0f;
};

} // namespace gfx
} // namespace cc
