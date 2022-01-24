/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

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

#include <string>
#include <vector>
#include "CallbackPass.h"
#include "RenderTargetAttachment.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace framegraph {

class DevicePass final {
public:
    DevicePass() = delete;
    DevicePass(const FrameGraph &graph, std::vector<PassNode *> const &subpassNodes);
    DevicePass(const DevicePass &) = delete;
    DevicePass(DevicePass &&)      = delete;
    ~DevicePass()                  = default;
    DevicePass &operator=(const DevicePass &) = delete;
    DevicePass &operator=(DevicePass &&) = delete;

    void execute();

private:
    struct LogicPass final {
        Executable *  pass{nullptr};
        bool          customViewport{false};
        gfx::Viewport viewport;
        gfx::Rect     scissor;
    };

    struct Subpass final {
        std::vector<LogicPass> logicPasses{};
        gfx::SubpassInfo       desc;
    };

    struct Attachment final {
        RenderTargetAttachment attachment;
        gfx::Texture *         renderTarget{nullptr};
    };

    void append(const FrameGraph &graph, const PassNode *passNode, std::vector<RenderTargetAttachment> *attachments);
    void append(const FrameGraph &graph, const RenderTargetAttachment &attachment,
                std::vector<RenderTargetAttachment> *attachments, gfx::SubpassInfo *subpass, const std::vector<Handle> &reads);
    void begin(gfx::CommandBuffer *cmdBuff);
    void next(gfx::CommandBuffer *cmdBuff) noexcept;
    void end(gfx::CommandBuffer *cmdBuff);

    std::vector<Subpass>    _subpasses{};
    std::vector<Attachment> _attachments{};
    uint16_t                _usedRenderTargetSlotMask{0};
    DevicePassResourceTable _resourceTable;

    gfx::Viewport _viewport;
    gfx::Rect     _scissor;
    gfx::Viewport _curViewport;
    gfx::Rect     _curScissor;
    RenderPass    _renderPass;
    Framebuffer   _fbo;
};

} // namespace framegraph
} // namespace cc
