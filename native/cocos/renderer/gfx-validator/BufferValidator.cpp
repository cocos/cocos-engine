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

#include "BufferValidator.h"
#include <cstring>
#include "DeviceValidator.h"
#include "ValidationUtils.h"
#include "base/Log.h"

namespace cc {
namespace gfx {

BufferValidator::BufferValidator(Buffer *actor)
: Agent<Buffer>(actor) {
    _typedID = actor->getTypedID();
}

BufferValidator::~BufferValidator() {
    DeviceResourceTracker<Buffer>::erase(this);

    uint64_t lifeTime = DeviceValidator::getInstance()->currentFrame() - _creationFrame;
    // skip those that have never been updated
    if (!_isBufferView && hasFlag(_memUsage, MemoryUsageBit::HOST) && _totalUpdateTimes && _totalUpdateTimes < lifeTime / 3) {
        CC_LOG_WARNING("Triple buffer enabled for infrequently-updated buffer, consider using MemoryUsageBit::DEVICE instead");
        CC_LOG_DEBUG("Init Stacktrace: %s", _initStack.c_str());
    }
}

void BufferValidator::doInit(const BufferInfo &info) {
    // Initialize twice?
    CC_ASSERT(!isInited());
    _inited = true;

    CC_ASSERT(info.usage != BufferUsageBit::NONE);
    CC_ASSERT(info.memUsage != MemoryUsageBit::NONE);
    CC_ASSERT(info.size);
    CC_ASSERT(info.size / info.stride * info.stride == info.size);

    _initStack = utils::getStacktraceJS();
    _creationFrame = DeviceValidator::getInstance()->currentFrame();
    _totalUpdateTimes = 0U;

    if (hasFlag(info.usage, BufferUsageBit::VERTEX) && !info.stride) {
        // Invalid stride for vertex buffer.
        CC_ASSERT(false);
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void BufferValidator::doInit(const BufferViewInfo &info) {
    // Initialize twice?
    CC_ASSERT(!isInited());
    _inited = true;

    // Already been destroyed?
    CC_ASSERT(info.buffer && static_cast<BufferValidator *>(info.buffer)->isInited());
    CC_ASSERT(info.offset + info.range <= info.buffer->getSize());
    // zero-sized buffer?
    CC_ASSERT(info.range);

    uint32_t stride = info.buffer->getStride();
    // Offset is not multiple of stride?
    CC_ASSERT(info.offset / stride * stride == info.offset);

    /////////// execute ///////////

    BufferViewInfo actorInfo = info;
    actorInfo.buffer = static_cast<BufferValidator *>(info.buffer)->getActor();

    _actor->initialize(actorInfo);
}

void BufferValidator::doResize(uint32_t size, uint32_t /*count*/) {
    // Already been destroyed?
    CC_ASSERT(isInited());

    // Cannot resize through buffer views.
    CC_ASSERT(!_isBufferView);
    CC_ASSERT(size);

    /////////// execute ///////////

    _actor->resize(size);
}

void BufferValidator::doDestroy() {
    // Be destroyed twice?"
    CC_ASSERT(isInited());
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void BufferValidator::update(const void *buffer, uint32_t size) {
    CC_ASSERT(isInited());

    // Cannot update through buffer views.
    CC_ASSERT(!_isBufferView);
    CC_ASSERT(size && size <= _size);
    CC_ASSERT(buffer);

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const auto *drawInfo = static_cast<const DrawInfo *>(buffer);
        const size_t drawInfoCount = size / sizeof(DrawInfo);
        const bool isIndexed = drawInfoCount > 0 && drawInfo->indexCount > 0;
        for (size_t i = 1U; i < drawInfoCount; ++i) {
            if ((++drawInfo)->indexCount > 0 != isIndexed) {
                // Inconsistent indirect draw infos on using index buffer.
                CC_ASSERT(false);
            }
        }
    }

    sanityCheck(buffer, size);
    ++_totalUpdateTimes; // only count direct updates

    /////////// execute ///////////

    _actor->update(buffer, size);
}

void BufferValidator::sanityCheck(const void *buffer, uint32_t size) {
    uint64_t cur = DeviceValidator::getInstance()->currentFrame();

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
}

} // namespace gfx
} // namespace cc
