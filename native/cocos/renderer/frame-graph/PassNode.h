/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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

#include <memory>
#include "CallbackPass.h"
#include "Handle.h"
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
    ~PassNode()                    = default;
    PassNode(PassNode &&) noexcept = default;
    PassNode(const PassNode &)     = delete;
    PassNode &operator=(const PassNode &) = delete;
    PassNode &operator=(PassNode &&) noexcept = delete;

    Handle      read(FrameGraph &graph, const Handle &input);
    Handle      write(FrameGraph &graph, const Handle &output);
    void        createRenderTargetAttachment(RenderTargetAttachment &&attachment);
    inline void sideEffect();
    inline void subpass(bool clearActionIgnoreable, bool end);
    inline void setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor);

private:
    bool                    canMerge(const FrameGraph &graph, const PassNode &passNode) const;
    RenderTargetAttachment *getRenderTargetAttachment(const Handle &handle);
    RenderTargetAttachment *getRenderTargetAttachment(const FrameGraph &graph, const VirtualResource *resource);
    void                    requestTransientResources();
    void                    releaseTransientResources();
    void                    setDevicePassId(ID id);
    Handle                  getWriteResourceNodeHandle(const FrameGraph &graph, const VirtualResource *resource) const;

    std::unique_ptr<Executable>         _pass{nullptr};
    std::vector<Handle>                 _reads{};
    std::vector<Handle>                 _writes{};
    std::vector<RenderTargetAttachment> _attachments{};
    std::vector<VirtualResource *>      _resourceRequestArray{};
    std::vector<VirtualResource *>      _resourceReleaseArray{};
    const StringHandle                  _name;
    uint32_t                            _refCount{0};
    PassNode *                          _head{nullptr};
    PassNode *                          _next{nullptr};
    uint16_t                            _distanceToHead{0};
    uint16_t                            _usedRenderTargetSlotMask{0};
    ID const                            _id{0};
    ID                                  _devicePassId{0};
    const PassInsertPoint               _insertPoint{0};
    bool                                _sideEffect{false};
    bool                                _subpass{false};
    bool                                _subpassEnd{false};
    bool                                _hasClearedAttachment{false};
    bool                                _clearActionIgnoreable{false};

    bool          _customViewport{false};
    gfx::Viewport _viewport;
    gfx::Rect     _scissor;

    friend class FrameGraph;
    friend class DevicePass;
    friend class DevicePassResourceTable;
};

//////////////////////////////////////////////////////////////////////////

void PassNode::sideEffect() {
    _sideEffect = true;
}

void PassNode::subpass(bool clearActionIgnoreable, bool end) {
    _subpass               = true;
    _clearActionIgnoreable = clearActionIgnoreable;
    _subpassEnd            = end;
}

void PassNode::setViewport(const gfx::Viewport &viewport, const gfx::Rect &scissor) {
    _customViewport = true;
    _viewport       = viewport;
    _scissor        = scissor;
}

} // namespace framegraph
} // namespace cc
