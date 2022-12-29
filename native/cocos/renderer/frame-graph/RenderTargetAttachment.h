/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#include "Resource.h"

namespace cc {
namespace framegraph {

struct RenderTargetAttachment final {
    using StoreOp = gfx::StoreOp;
    using LoadOp = gfx::LoadOp;
    using Color = gfx::Color;

    enum class Usage : uint8_t {
        COLOR,
        DEPTH,
        STENCIL,
        DEPTH_STENCIL,
    };

    struct Descriptor final {
        Usage usage{Usage::COLOR};
        uint8_t slot{0xff};
        uint8_t writeMask{0xff};
        LoadOp loadOp{LoadOp::DISCARD};
        Color clearColor;
        float clearDepth{1.F};
        uint8_t clearStencil{0U};

        gfx::AccessFlags beginAccesses{gfx::AccessFlagBit::NONE};
        gfx::AccessFlags endAccesses{gfx::AccessFlagBit::NONE};
    };

    struct Sorter {
        inline bool operator()(const RenderTargetAttachment &a1, const RenderTargetAttachment &a2) const noexcept;
    };

    static constexpr uint8_t DEPTH_STENCIL_SLOT_START{13};

    TextureHandle textureHandle{};
    Descriptor desc;
    uint8_t level{0};
    uint8_t layer{0};
    uint8_t index{0};
    StoreOp storeOp{StoreOp::DISCARD};
    bool isGeneralLayout{false};
};

inline bool RenderTargetAttachment::Sorter::operator()(const RenderTargetAttachment &a1, const RenderTargetAttachment &a2) const noexcept {
    if (a1.desc.usage == a2.desc.usage) {
        return a1.desc.slot < a2.desc.slot;
    }
    return a1.desc.usage < a2.desc.usage;
}

} // namespace framegraph
} // namespace cc
