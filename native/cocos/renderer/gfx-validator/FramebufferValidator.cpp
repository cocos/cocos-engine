/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

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
#include "base/Macros.h"
#include "base/threading/MessageQueue.h"

#include "DeviceValidator.h"
#include "FramebufferValidator.h"
#include "RenderPassValidator.h"
#include "TextureValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

FramebufferValidator::FramebufferValidator(Framebuffer *actor)
: Agent<Framebuffer>(actor) {
    _typedID = actor->getTypedID();
}

FramebufferValidator::~FramebufferValidator() {
    DeviceResourceTracker<Framebuffer>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void FramebufferValidator::doInit(const FramebufferInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    CCASSERT(info.renderPass && static_cast<RenderPassValidator *>(info.renderPass)->isInited(), "already destroyed?");
    CCASSERT(!info.colorTextures.empty() || info.depthStencilTexture, "no attachments?");
    CCASSERT(info.colorTextures.size() == info.renderPass->getColorAttachments().size(), "attachment count mismatch");
    if (info.renderPass->getDepthStencilAttachment().format != Format::UNKNOWN) {
        CCASSERT(info.depthStencilTexture, "missing depth stencil attachment");
    }

    for (uint32_t i = 0U; i < info.colorTextures.size(); ++i) {
        const auto &desc = info.renderPass->getColorAttachments()[i];
        const auto *tex  = info.colorTextures[i];
        CCASSERT(tex && static_cast<const TextureValidator *>(tex)->isInited(), "already destroyed?");
        CCASSERT(hasAnyFlags(tex->getInfo().usage, TextureUsageBit::COLOR_ATTACHMENT | TextureUsageBit::DEPTH_STENCIL_ATTACHMENT), "Input is not an attachment");
        CCASSERT(tex->getFormat() == desc.format, "attachment format mismatch");
    }
    if (info.depthStencilTexture) {
        CCASSERT(static_cast<TextureValidator *>(info.depthStencilTexture)->isInited(), "already destroyed?");
        CCASSERT(hasFlag(info.depthStencilTexture->getInfo().usage, TextureUsageBit::DEPTH_STENCIL_ATTACHMENT), "Input is not a depth stencil attachment");
        CCASSERT(info.depthStencilTexture->getFormat() == info.renderPass->getDepthStencilAttachment().format, "attachment format mismatch");
    }

    /////////// execute ///////////

    FramebufferInfo actorInfo = info;
    for (uint32_t i = 0U; i < info.colorTextures.size(); ++i) {
        if (info.colorTextures[i]) {
            actorInfo.colorTextures[i] = static_cast<TextureValidator *>(info.colorTextures[i])->getActor();
        }
    }
    if (info.depthStencilTexture) {
        actorInfo.depthStencilTexture = static_cast<TextureValidator *>(info.depthStencilTexture)->getActor();
    }
    actorInfo.renderPass = static_cast<RenderPassValidator *>(info.renderPass)->getActor();

    _actor->initialize(actorInfo);
}

void FramebufferValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
