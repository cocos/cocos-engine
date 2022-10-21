/****************************************************************************
Copyright (c) 2019-2022 Xiamen Yaji Software Co., Ltd.

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

#include "gfx-validator/TransientPoolValidator.h"
#include "gfx-validator/BufferValidator.h"
#include "gfx-validator/TextureValidator.h"

namespace cc {
namespace gfx {

TransientPoolValidator::TransientPoolValidator(TransientPool *actor) : Agent<TransientPool>(actor) {
    _typedID = generateObjectID<decltype(this)>();
}

void TransientPoolValidator::doInit(const TransientPoolInfo &info) {
    _actor->initialize(info);
}

void TransientPoolValidator::doInitBuffer(Buffer *buffer) {
    CC_ASSERT(hasFlag(buffer->getFlags(), BufferFlagBit::TRANSIENT));
    CC_ASSERT(!hasFlag(buffer->getMemUsage(), MemoryUsageBit::HOST));
    auto *actorBuffer = static_cast<BufferValidator *>(buffer)->getActor();
    _actor->doInitBuffer(actorBuffer);
}

void TransientPoolValidator::doResetBuffer(Buffer *buffer) {
    auto *actorBuffer = static_cast<BufferValidator *>(buffer)->getActor();
    _actor->doResetBuffer(actorBuffer);
}

void TransientPoolValidator::doInitTexture(Texture *texture) {
    CC_ASSERT(hasFlag(texture->getInfo().flags, TextureFlagBit::TRANSIENT));
    auto *actorTexture = static_cast<TextureValidator *>(texture)->getActor();
    _actor->doInitTexture(actorTexture);
}

void TransientPoolValidator::doResetTexture(Texture *texture) {
    auto *actorTexture = static_cast<TextureValidator *>(texture)->getActor();
    _actor->doResetTexture(actorTexture);
}

} // namespace gfx
} // namespace cc
