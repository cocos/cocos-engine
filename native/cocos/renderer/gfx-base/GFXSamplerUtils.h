/****************************************************************************
 Copyright (c) 2019-2024 Xiamen Yaji Software Co., Ltd.

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

#pragma once
#include "cocos/renderer/gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

constexpr uint32_t compressSamplerInfo(const SamplerInfo &info) noexcept {
    CC_ASSERT(static_cast<uint32_t>(info.minFilter) < (1 << 2));
    CC_ASSERT(static_cast<uint32_t>(info.magFilter) < (1 << 2));
    CC_ASSERT(static_cast<uint32_t>(info.mipFilter) < (1 << 2));
    CC_ASSERT(static_cast<uint32_t>(info.addressU) < (1 << 2));
    CC_ASSERT(static_cast<uint32_t>(info.addressV) < (1 << 2));
    CC_ASSERT(static_cast<uint32_t>(info.addressW) < (1 << 2));
    CC_ASSERT(info.maxAnisotropy <= 16);
    CC_ASSERT(static_cast<uint32_t>(info.cmpFunc) < (1 << 3));

    auto packed = static_cast<uint32_t>(info.minFilter);
    packed |= static_cast<uint32_t>(info.magFilter) << 2;
    packed |= static_cast<uint32_t>(info.mipFilter) << 4;
    packed |= static_cast<uint32_t>(info.addressU) << 6;
    packed |= static_cast<uint32_t>(info.addressV) << 8;
    packed |= static_cast<uint32_t>(info.addressW) << 10;
    packed |= static_cast<uint32_t>(info.maxAnisotropy) << 12;
    packed |= static_cast<uint32_t>(info.cmpFunc) << 17;
    return packed;
}

constexpr SamplerInfo uncompressSamplerInfo(const uint32_t packed) noexcept {
    SamplerInfo info{};
    info.minFilter = static_cast<Filter>(packed & ((1 << 2) - 1));
    info.magFilter = static_cast<Filter>((packed >> 2) & ((1 << 2) - 1));
    info.mipFilter = static_cast<Filter>((packed >> 4) & ((1 << 2) - 1));
    info.addressU = static_cast<Address>((packed >> 6) & ((1 << 2) - 1));
    info.addressV = static_cast<Address>((packed >> 8) & ((1 << 2) - 1));
    info.addressW = static_cast<Address>((packed >> 10) & ((1 << 2) - 1));
    info.maxAnisotropy = (packed >> 12) & ((1 << 5) - 1);
    info.cmpFunc = static_cast<ComparisonFunc>((packed >> 17) & ((1 << 3) - 1));
    return info;
}

} // namespace gfx
} // namespace cc
