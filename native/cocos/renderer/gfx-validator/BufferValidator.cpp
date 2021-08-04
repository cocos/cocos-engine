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
#include "base/threading/MessageQueue.h"

#include "BufferValidator.h"
#include "DeviceValidator.h"
#include "ValidationUtils.h"

namespace cc {
namespace gfx {

BufferValidator::BufferValidator(Buffer *actor)
: Agent<Buffer>(actor) {
    _typedID = generateObjectID<decltype(this)>();
}

BufferValidator::~BufferValidator() {
    DeviceResourceTracker<Buffer>::erase(this);
    CC_SAFE_DELETE(_actor);
}

void BufferValidator::doInit(const BufferInfo &info) {
    CCASSERT(info.usage != BufferUsageBit::NONE, "invalid source buffer");
    CCASSERT(info.memUsage != MemoryUsageBit::NONE, "invalid source buffer");
    // CCASSERT(info.size, "zero-sized buffer?"); // be more lenient on this for now

    if (hasFlag(info.usage, BufferUsageBit::VERTEX) && !info.stride) {
        CCASSERT(false, "invalid stride for vertex buffer");
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void BufferValidator::doInit(const BufferViewInfo &info) {
    CCASSERT(info.buffer, "invalid source buffer");
    CCASSERT(info.offset + info.range <= info.buffer->getSize(), "invalid range");

    /////////// execute ///////////

    BufferViewInfo actorInfo = info;
    actorInfo.buffer         = static_cast<BufferValidator *>(info.buffer)->getActor();

    _actor->initialize(actorInfo);
}

void BufferValidator::doResize(uint size, uint /*count*/) {
    CCASSERT(!_isBufferView, "cannot resize through buffer views");
    CCASSERT(size, "invalid size");

    /////////// execute ///////////

    _actor->resize(size);
}

void BufferValidator::doDestroy() {
    _actor->destroy();
}

void BufferValidator::update(const void *buffer, uint size) {
    CCASSERT(!_isBufferView, "cannot update through buffer views");
    CCASSERT(size && size <= _size, "invalid size");
    CCASSERT(buffer, "invalid buffer data");

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const auto * drawInfo      = static_cast<const DrawInfo *>(buffer);
        const size_t drawInfoCount = size / sizeof(DrawInfo);
        const bool   isIndexed     = drawInfoCount > 0 && drawInfo->indexCount > 0;
        for (size_t i = 1U; i < drawInfoCount; ++i) {
            if ((++drawInfo)->indexCount > 0 != isIndexed) {
                CCASSERT(false, "inconsistent indirect draw infos on using index buffer");
            }
        }
    }

    sanityCheck(buffer, size);

    /////////// execute ///////////

    _actor->update(buffer, size);
}

void BufferValidator::sanityCheck(const void *buffer, uint size) {
    uint cur = DeviceValidator::getInstance()->currentFrame();

    if (cur == _lastUpdateFrame) {
        // FIXME: minggo: as current implementation need to update some buffers more than once, so disable it.
        // Should enable it when it is fixed.
        // CC_LOG_WARNING(utils::getStacktraceJS().c_str());
        // CC_LOG_WARNING("performance warning: buffer updated more than once per frame");
    }

    if (DeviceValidator::getInstance()->isRecording()) {
        _buffer.resize(_size);
        memcpy(_buffer.data(), buffer, size);
    }

    _lastUpdateFrame = cur;

    if (DeviceValidator::getInstance()->isRecording()) {
        _buffer.resize(_size);
        memcpy(_buffer.data(), buffer, size);
    }
}

} // namespace gfx
} // namespace cc
