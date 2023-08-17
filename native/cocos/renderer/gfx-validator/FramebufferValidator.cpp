/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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
    CC_ASSERT(!isInited());
    _inited = true;

    CC_ASSERT(info.renderPass && static_cast<RenderPassValidator *>(info.renderPass)->isInited());
    CC_ASSERT(!info.colorTextures.empty() || info.depthStencilTexture);
    CC_ASSERT(info.colorTextures.size() == info.renderPass->getColorAttachments().size());
    if (info.renderPass->getDepthStencilAttachment().format != Format::UNKNOWN) {
        CC_ASSERT(info.depthStencilTexture);
    }
    if (info.renderPass->getDepthStencilResolveAttachment().format != Format::UNKNOWN) {
        CC_ASSERT(info.depthStencilResolveTexture);
    }

    for (uint32_t i = 0U; i < info.colorTextures.size(); ++i) {
        const auto &desc = info.renderPass->getColorAttachments()[i];
        const auto *tex = info.colorTextures[i];
        CC_ASSERT(tex && static_cast<const TextureValidator *>(tex)->isInited());
        CC_ASSERT(hasAnyFlags(tex->getInfo().usage, TextureUsageBit::COLOR_ATTACHMENT | TextureUsageBit::DEPTH_STENCIL_ATTACHMENT | TextureUsageBit::SHADING_RATE));
        CC_ASSERT(tex->getFormat() == desc.format);
    }
    if (info.depthStencilTexture) {
        CC_ASSERT(static_cast<TextureValidator *>(info.depthStencilTexture)->isInited());
        CC_ASSERT(hasFlag(info.depthStencilTexture->getInfo().usage, TextureUsageBit::DEPTH_STENCIL_ATTACHMENT));
        CC_ASSERT(info.depthStencilTexture->getFormat() == info.renderPass->getDepthStencilAttachment().format);
    }
    if (info.depthStencilResolveTexture) {
        CC_ASSERT(static_cast<TextureValidator *>(info.depthStencilResolveTexture)->isInited());
        CC_ASSERT(hasFlag(info.depthStencilResolveTexture->getInfo().usage, TextureUsageBit::DEPTH_STENCIL_ATTACHMENT));
        CC_ASSERT(info.depthStencilResolveTexture->getFormat() == info.renderPass->getDepthStencilResolveAttachment().format);
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
    if (info.depthStencilResolveTexture) {
        actorInfo.depthStencilResolveTexture = static_cast<TextureValidator *>(info.depthStencilResolveTexture)->getActor();
    }
    actorInfo.renderPass = static_cast<RenderPassValidator *>(info.renderPass)->getActor();

    _actor->initialize(actorInfo);
}

void FramebufferValidator::doDestroy() {
    // Destroy twice?
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
