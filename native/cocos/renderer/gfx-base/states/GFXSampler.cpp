/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

#include "GFXSampler.h"
#include "../GFXSamplerUtils.h"

namespace cc {
namespace gfx {

Sampler::Sampler(const SamplerInfo &info)
: GFXObject(ObjectType::SAMPLER) {
    _info = info;
    _hash = computeHash(info);
}

ccstd::hash_t Sampler::computeHash(const SamplerInfo &info) {
    return Hasher<SamplerInfo>()(info);
}

SamplerInfo Sampler::unpackFromHash(ccstd::hash_t hash) {
    return unpackSamplerInfo(hash);
}

namespace {

constexpr bool testSamplerInfo(const SamplerInfo &info) {
    const uint32_t packed = packSamplerInfo(info);
    const SamplerInfo unpacked = unpackSamplerInfo(packed);

    return info.minFilter == unpacked.minFilter &&
           info.magFilter == unpacked.magFilter &&
           info.mipFilter == unpacked.mipFilter &&
           info.addressU == unpacked.addressU &&
           info.addressV == unpacked.addressV &&
           info.addressW == unpacked.addressW &&
           info.maxAnisotropy == unpacked.maxAnisotropy &&
           info.cmpFunc == unpacked.cmpFunc;
}

static_assert(testSamplerInfo(SamplerInfo{
    Filter::NONE,
    Filter::NONE,
    Filter::NONE,
    Address::WRAP,
    Address::WRAP,
    Address::WRAP,
    0U,
    ComparisonFunc::NEVER,
}));

static_assert(testSamplerInfo(SamplerInfo{
    Filter::ANISOTROPIC,
    Filter::ANISOTROPIC,
    Filter::ANISOTROPIC,
    Address::BORDER,
    Address::BORDER,
    Address::BORDER,
    16U,
    ComparisonFunc::ALWAYS,
}));

static_assert(testSamplerInfo(SamplerInfo{
    Filter::POINT,
    Filter::LINEAR,
    Filter::ANISOTROPIC,
    Address::MIRROR,
    Address::CLAMP,
    Address::BORDER,
    15U,
    ComparisonFunc::GREATER_EQUAL,
}));

} // namespace

} // namespace gfx
} // namespace cc
