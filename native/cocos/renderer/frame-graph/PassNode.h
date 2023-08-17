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

#include <memory>
#include "CallbackPass.h"
#include "Handle.h"
#include "ImmutableState.h"
#include "PassInsertPointManager.h"
#include "RenderTargetAttachment.h"
#include "VirtualResource.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace framegraph {

class FrameGraph;

class PassNode final {
public:
    PassNode(PassInsertPoint inserPoint, StringHandle name, const ID &id, Executable *pass);
    ~PassNode() = default;
    PassNode(PassNode &&) noexcept = default;
    PassNode(const PassNode &) = delete;
    PassNode &operator=(const PassNode &) = delete;
    PassNode &operator=(PassNode &&) noexcept = delete;

    Handle read(FrameGraph &graph, const Handle &input);
    Handle write(FrameGraph &graph, const Handle &output);
    void createRenderTargetAttachment(RenderTargetAttachment &&attachment);
    void setBarrier(const PassBarrierPair &barrier);

    inline void sideEffect();
    inline void subpass(bool end, bool clearActionIgnorable);
    inline void setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor);
    inline const PassBarrierPair &getBarriers() const;

private:
    bool canMerge(const FrameGraph &graph, const PassNode &passNode) const;
    RenderTargetAttachment *getRenderTargetAttachment(const Handle &handle);
    RenderTargetAttachment *getRenderTargetAttachment(const FrameGraph &graph, const VirtualResource *resource);
    void requestTransientResources();
    void releaseTransientResources();
    void setDevicePassId(ID id);
    Handle getWriteResourceNodeHandle(const FrameGraph &graph, const VirtualResource *resource) const;

    std::unique_ptr<Executable> _pass{nullptr};
    ccstd::vector<Handle> _reads{};
    ccstd::vector<Handle> _writes{};
    ccstd::vector<RenderTargetAttachment> _attachments{};
    ccstd::vector<VirtualResource *> _resourceRequestArray{};
    ccstd::vector<VirtualResource *> _resourceReleaseArray{};
    const StringHandle _name;
    uint32_t _refCount{0};
    PassNode *_head{nullptr};
    PassNode *_next{nullptr};
    uint16_t _distanceToHead{0};
    uint16_t _usedRenderTargetSlotMask{0};
    ID const _id{0};
    ID _devicePassId{0};
    const PassInsertPoint _insertPoint{0};
    bool _sideEffect{false};
    bool _subpass{false};
    bool _subpassEnd{false};
    bool _hasClearedAttachment{false};
    bool _clearActionIgnorable{false};

    bool _customViewport{false};
    gfx::Viewport _viewport;
    gfx::Rect _scissor;

    PassBarrierPair _barriers;

    friend class FrameGraph;
    friend class DevicePass;
    friend class DevicePassResourceTable;
};

//////////////////////////////////////////////////////////////////////////

const PassBarrierPair &PassNode::getBarriers() const {
    return _barriers;
}

void PassNode::sideEffect() {
    _sideEffect = true;
}

void PassNode::subpass(bool end, bool clearActionIgnorable) {
    _subpass = true;
    _subpassEnd = end;
    _clearActionIgnorable = clearActionIgnorable;
}

void PassNode::setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor) {
    _customViewport = true;
    _viewport = viewport;
    _scissor = scissor;
}

} // namespace framegraph
} // namespace cc
