/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "CommandBufferValidator.h"
#include "DeviceValidator.h"
#include "QueueValidator.h"
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
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    /////////// execute ///////////

    _actor->initialize(info);
}

void QueueValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void QueueValidator::submit(CommandBuffer *const *cmdBuffs, uint32_t count) {
    CCASSERT(isInited(), "alread destroyed?");

    if (!count) return;
    for (uint32_t i = 0U; i < count; ++i) {
        auto *cmdBuff = static_cast<CommandBufferValidator *>(cmdBuffs[i]);
        CCASSERT(cmdBuff->isInited(), "alread destroyed?");
        CCASSERT(cmdBuff->isCommandsFlushed(), "command buffers must be flushed before submit");
    }

    /////////// execute ///////////

    static vector<CommandBuffer *> cmdBuffActors;
    cmdBuffActors.resize(count);

    for (uint32_t i = 0U; i < count; ++i) {
        cmdBuffActors[i] = static_cast<CommandBufferValidator *>(cmdBuffs[i])->getActor();
    }

    _actor->submit(cmdBuffActors.data(), count);
}

} // namespace gfx
} // namespace cc
