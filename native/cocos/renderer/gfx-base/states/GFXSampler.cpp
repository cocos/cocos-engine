/****************************************************************************
 Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "GFXSampler.h"

namespace cc {
namespace gfx {

Sampler::Sampler(const SamplerInfo &info)
: GFXObject(ObjectType::SAMPLER) {
    _info = info;
    _hash = computeHash(info);
}

size_t Sampler::computeHash(const SamplerInfo &info) {
    return Hasher<SamplerInfo>()(info);
}

SamplerInfo Sampler::unpackFromHash(size_t hash) {
    SamplerInfo info;
    info.minFilter     = static_cast<Filter>((hash & ((1 << 2) - 1)) >> 0);
    info.magFilter     = static_cast<Filter>((hash & ((1 << 2) - 1)) >> 2);
    info.mipFilter     = static_cast<Filter>((hash & ((1 << 2) - 1)) >> 4);
    info.addressU      = static_cast<Address>((hash & ((1 << 2) - 1)) >> 6);
    info.addressV      = static_cast<Address>((hash & ((1 << 2) - 1)) >> 8);
    info.addressW      = static_cast<Address>((hash & ((1 << 2) - 1)) >> 10);
    info.maxAnisotropy = (hash & ((1 << 4) - 1)) >> 12;
    info.cmpFunc       = static_cast<ComparisonFunc>((hash & ((1 << 3) - 1)) >> 16);
    return info;
}

} // namespace gfx
} // namespace cc
