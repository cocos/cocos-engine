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

#include "PassNode.h"

namespace cc {
namespace framegraph {

class PassNodeBuilder final {
public:
    PassNodeBuilder(FrameGraph &graph, PassNode &passNode) noexcept;
    PassNodeBuilder() = delete;
    ~PassNodeBuilder() = default;
    PassNodeBuilder(const PassNodeBuilder &) = delete;
    PassNodeBuilder(PassNodeBuilder &&) = delete;
    PassNodeBuilder &operator=(const PassNodeBuilder &) = delete;
    PassNodeBuilder &operator=(PassNodeBuilder &&) = delete;

    template <typename DescriptorType, typename ResourceType = typename ResourceTypeLookupTable<DescriptorType>::Resource>
    TypedHandle<ResourceType> create(const StringHandle &name, const DescriptorType &desc) const noexcept;
    template <typename ResourceType>
    TypedHandle<ResourceType> importExternal(const StringHandle &name, ResourceType &resource) const noexcept;
    template <typename ResourceType>
    TypedHandle<ResourceType> read(TypedHandle<ResourceType> const &input) const noexcept;
    template <typename ResourceType>
    TypedHandle<ResourceType> write(TypedHandle<ResourceType> const &output) const noexcept;
    TextureHandle write(const TextureHandle &output, uint8_t mipmapLevel, uint8_t faceId, uint8_t arrayPosition, const RenderTargetAttachment::Descriptor &attachmentDesc) const noexcept;
    TextureHandle write(const TextureHandle &output, const RenderTargetAttachment::Descriptor &attachmentDesc) const noexcept;

    inline void sideEffect() const noexcept;
    inline void subpass(bool end = false, bool clearActionIgnorable = true) const noexcept;
    inline void setViewport(const gfx::Rect &scissor) noexcept;
    inline void setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor) noexcept;
    inline void setBarrier(const PassBarrierPair &barrier);

    void writeToBlackboard(const StringHandle &name, const Handle &handle) const noexcept;
    Handle readFromBlackboard(const StringHandle &name) const noexcept;

private:
    Handle read(const Handle &input) const noexcept;

    FrameGraph &_graph;
    PassNode &_passNode;
};

//////////////////////////////////////////////////////////////////////////

template <typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::read(TypedHandle<ResourceType> const &input) const noexcept {
    return TypedHandle<ResourceType>(read(static_cast<const Handle &>(input)));
}

template <typename ResourceType>
TypedHandle<ResourceType> PassNodeBuilder::write(TypedHandle<ResourceType> const &output) const noexcept {
    return TypedHandle<ResourceType>(_passNode.write(_graph, output));
}

void PassNodeBuilder::sideEffect() const noexcept {
    _passNode.sideEffect();
}

void PassNodeBuilder::subpass(bool end, bool clearActionIgnorable) const noexcept {
    _passNode.subpass(end, clearActionIgnorable);
}

void PassNodeBuilder::setViewport(const gfx::Rect &scissor) noexcept {
    gfx::Viewport viewport{scissor.x, scissor.y, scissor.width, scissor.height, 0.F, 1.F};
    _passNode.setViewport(viewport, scissor);
}

void PassNodeBuilder::setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor) noexcept {
    _passNode.setViewport(viewport, scissor);
}

void PassNodeBuilder::setBarrier(const PassBarrierPair &barrier) {
    _passNode.setBarrier(barrier);
}

} // namespace framegraph
} // namespace cc
