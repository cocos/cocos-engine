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

#include <limits>
#include "CallbackPass.h"
#include "ImmutableState.h"
#include "RenderTargetAttachment.h"
#include "base/std/container/string.h"
#include "gfx-base/GFXDef.h"

namespace cc {
namespace framegraph {

class DevicePass final {
public:
    DevicePass() = delete;
    DevicePass(const FrameGraph &graph, ccstd::vector<PassNode *> const &subpassNodes);
    DevicePass(const DevicePass &) = delete;
    DevicePass(DevicePass &&) = delete;
    ~DevicePass() = default;
    DevicePass &operator=(const DevicePass &) = delete;
    DevicePass &operator=(DevicePass &&) = delete;

    void execute();

private:
    struct LogicPass final {
        Executable *pass{nullptr};
        bool customViewport{false};
        gfx::Viewport viewport;
        gfx::Rect scissor;
    };

    struct Subpass final {
        gfx::SubpassInfo desc;
        ccstd::vector<LogicPass> logicPasses{};
        uint32_t barrierID{0xFFFFFFFF};
    };

    struct Attachment final {
        RenderTargetAttachment attachment;
        gfx::Texture *renderTarget{nullptr};
    };

    void append(const FrameGraph &graph, const PassNode *passNode, ccstd::vector<RenderTargetAttachment> *attachments);
    void append(const FrameGraph &graph, const RenderTargetAttachment &attachment,
                ccstd::vector<RenderTargetAttachment> *attachments, gfx::SubpassInfo *subpass, const ccstd::vector<Handle> &reads);
    void begin(gfx::CommandBuffer *cmdBuff);
    void next(gfx::CommandBuffer *cmdBuff) noexcept;
    void end(gfx::CommandBuffer *cmdBuff);

    void passDependency(gfx::RenderPassInfo &rpInfo);

    ccstd::vector<Subpass> _subpasses{};
    ccstd::vector<Attachment> _attachments{};
    uint16_t _usedRenderTargetSlotMask{0};
    DevicePassResourceTable _resourceTable;

    gfx::Viewport _viewport;
    gfx::Rect _scissor;
    gfx::Viewport _curViewport;
    gfx::Rect _curScissor;
    RenderPass _renderPass;
    Framebuffer _fbo;

    std::vector<std::reference_wrapper<const PassBarrierPair>> _barriers;
};

} // namespace framegraph
} // namespace cc
