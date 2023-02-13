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

#include "base/threading/MessageQueue.h"

#include "DeviceValidator.h"
#include "RenderPassValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

RenderPassValidator::RenderPassValidator(RenderPass *actor)
: Agent<RenderPass>(actor) {
    _typedID = actor->getTypedID();
}

RenderPassValidator::~RenderPassValidator() {
    DeviceResourceTracker<RenderPass>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void RenderPassValidator::doInit(const RenderPassInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    bool hasDepth = info.depthStencilAttachment.format != Format::UNKNOWN;
    if (!hasDepth) {
        for (const auto &subpass : info.subpasses) {
            CC_ASSERT(subpass.depthStencil == INVALID_BINDING || subpass.depthStencil < info.colorAttachments.size());
        }
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void RenderPassValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
