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

#include "base/threading/MessageQueue.h"

#include "BufferValidator.h"
#include "DeviceValidator.h"
#include "InputAssemblerValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

InputAssemblerValidator::InputAssemblerValidator(InputAssembler *actor)
: Agent<InputAssembler>(actor) {
    _typedID = actor->getTypedID();
}

InputAssemblerValidator::~InputAssemblerValidator() {
    DeviceResourceTracker<InputAssembler>::erase(this);
}

void InputAssemblerValidator::doInit(const InputAssemblerInfo &info) {
    CC_ASSERT(!isInited());
    _inited = true;

    // vertex attributes validations
    for (auto const &attribute : info.attributes) {
        // Format not supported for the specified features.
        CC_ASSERT(hasFlag(DeviceValidator::getInstance()->getFormatFeatures(attribute.format), FormatFeature::VERTEX_ATTRIBUTE));
    }

    for (auto *vertexBuffer : info.vertexBuffers) {
        CC_ASSERT(vertexBuffer && static_cast<BufferValidator *>(vertexBuffer)->isInited());
        CC_ASSERT(hasFlag(vertexBuffer->getUsage(), BufferUsageBit::VERTEX));
    }
    if (info.indexBuffer) {
        CC_ASSERT(static_cast<BufferValidator *>(info.indexBuffer)->isInited());
        CC_ASSERT(hasFlag(info.indexBuffer->getUsage(), BufferUsageBit::INDEX));
    }
    if (info.indirectBuffer) {
        CC_ASSERT(static_cast<BufferValidator *>(info.indirectBuffer)->isInited());
        CC_ASSERT(hasFlag(info.indirectBuffer->getUsage(), BufferUsageBit::INDIRECT));
    }

    /////////// execute ///////////

    InputAssemblerInfo actorInfo = info;
    for (auto &vertexBuffer : actorInfo.vertexBuffers) {
        vertexBuffer = static_cast<BufferValidator *>(vertexBuffer)->getActor();
    }
    if (actorInfo.indexBuffer) {
        actorInfo.indexBuffer = static_cast<BufferValidator *>(actorInfo.indexBuffer)->getActor();
    }
    if (actorInfo.indirectBuffer) {
        actorInfo.indirectBuffer = static_cast<BufferValidator *>(actorInfo.indirectBuffer)->getActor();
    }

    _actor->initialize(actorInfo);
}

void InputAssemblerValidator::doDestroy() {
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

} // namespace gfx
} // namespace cc
