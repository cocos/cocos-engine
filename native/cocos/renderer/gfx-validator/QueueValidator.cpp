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

#include "QueueValidator.h"
#include "CommandBufferValidator.h"
#include "DeviceValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

QueueValidator::QueueValidator(Queue *actor)
: Agent<Queue>(actor) {
    _typedID = actor->getTypedID();
}

QueueValidator::~QueueValidator() {
    DeviceResourceTracker<Queue>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void QueueValidator::doInit(const QueueInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    /////////// execute ///////////

    _actor->initialize(info);
}

void QueueValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void QueueValidator::submit(CommandBuffer *const *cmdBuffs, uint32_t count) {
    CC_ASSERT(isInited());

    if (!count) return;
    for (uint32_t i = 0U; i < count; ++i) {
        auto *cmdBuff = static_cast<CommandBufferValidator *>(cmdBuffs[i]);
        CC_ASSERT(cmdBuff && cmdBuff->isInited());
        // Command buffers must be flushed before submit.
        CC_ASSERT(cmdBuff->isCommandsFlushed());
    }

    /////////// execute ///////////

    static ccstd::vector<CommandBuffer *> cmdBuffActors;
    cmdBuffActors.resize(count);

    for (uint32_t i = 0U; i < count; ++i) {
        cmdBuffActors[i] = static_cast<CommandBufferValidator *>(cmdBuffs[i])->getActor();
    }

    _actor->submit(cmdBuffActors.data(), count);
}

} // namespace gfx
} // namespace cc
