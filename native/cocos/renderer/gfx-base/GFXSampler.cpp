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

#include "GFXObject.h"
#include "GFXSampler.h"

namespace cc {
namespace gfx {

Sampler::Sampler()
: GFXObject(ObjectType::SAMPLER) {
    _borderColor.x = 0.0F;
    _borderColor.y = 0.0F;
    _borderColor.z = 0.0F;
    _borderColor.w = 0.0F;
}

Sampler::~Sampler() = default;

void Sampler::initialize(const SamplerInfo &info) {
    _minFilter     = info.minFilter;
    _magFilter     = info.magFilter;
    _mipFilter     = info.mipFilter;
    _addressU      = info.addressU;
    _addressV      = info.addressV;
    _addressW      = info.addressW;
    _maxAnisotropy = info.maxAnisotropy;
    _cmpFunc       = info.cmpFunc;
    _borderColor   = info.borderColor;
    _mipLODBias    = info.mipLODBias;

    doInit(info);
}

void Sampler::destroy() {
    doDestroy();
}

} // namespace gfx
} // namespace cc
