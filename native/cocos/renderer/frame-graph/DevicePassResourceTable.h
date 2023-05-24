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

#include "Handle.h"
#include "RenderTargetAttachment.h"
#include "Resource.h"
#include "base/std/container/unordered_map.h"

namespace cc {
namespace framegraph {

class PassNode;
class FrameGraph;
class DevicePass;

class DevicePassResourceTable final {
public:
    DevicePassResourceTable() = default;
    ~DevicePassResourceTable() = default;
    DevicePassResourceTable(const DevicePassResourceTable &) = delete;
    DevicePassResourceTable(DevicePassResourceTable &&) = delete;
    DevicePassResourceTable &operator=(const DevicePassResourceTable &) = delete;
    DevicePassResourceTable &operator=(DevicePassResourceTable &&) = delete;

    template <typename Type>
    std::enable_if_t<std::is_base_of<gfx::GFXObject, typename Type::DeviceResource>::value, typename Type::DeviceResource *>
    getRead(TypedHandle<Type> handle) const noexcept;

    template <typename Type>
    std::enable_if_t<std::is_base_of<gfx::GFXObject, typename Type::DeviceResource>::value, typename Type::DeviceResource *>
    getWrite(TypedHandle<Type> handle) const noexcept;

    gfx::RenderPass *getRenderPass() const { return _renderPass; }
    uint32_t getSubpassIndex() const { return _subpassIndex; }

private:
    using ResourceDictionary = ccstd::unordered_map<Handle, gfx::GFXObject *, Handle::Hasher>;

    static gfx::GFXObject *get(const ResourceDictionary &from, Handle handle) noexcept;
    void extract(const FrameGraph &graph, const PassNode *passNode, ccstd::vector<const gfx::Texture *> const &renderTargets) noexcept;
    static void extract(const FrameGraph &graph, ccstd::vector<Handle> const &from, ResourceDictionary &to, bool ignoreRenderTarget, ccstd::vector<const gfx::Texture *> const &renderTargets) noexcept;

    ResourceDictionary _reads{};
    ResourceDictionary _writes{};

    gfx::RenderPass *_renderPass{nullptr};
    uint32_t _subpassIndex{0U};

    friend class DevicePass;
};

template <typename Type>
std::enable_if_t<std::is_base_of<gfx::GFXObject, typename Type::DeviceResource>::value, typename Type::DeviceResource *>
DevicePassResourceTable::getRead(TypedHandle<Type> handle) const noexcept {
    return static_cast<typename Type::DeviceResource *>(get(_reads, handle));
}

template <typename Type>
std::enable_if_t<std::is_base_of<gfx::GFXObject, typename Type::DeviceResource>::value, typename Type::DeviceResource *>
DevicePassResourceTable::getWrite(TypedHandle<Type> handle) const noexcept {
    return static_cast<typename Type::DeviceResource *>(get(_writes, handle));
}

} // namespace framegraph
} // namespace cc
