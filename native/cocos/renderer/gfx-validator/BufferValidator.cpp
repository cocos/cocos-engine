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
#include "base/Log.h"
#include "base/Macros.h"
#include "base/threading/MessageQueue.h"

#include "bindings/jswrapper/SeApi.h"

#include "BufferValidator.h"
#include "DeviceValidator.h"
#include "ValidationUtils.h"
#include "gfx-base/GFXDef-common.h"

namespace cc {
namespace gfx {

BufferValidator::BufferValidator(Buffer *actor)
: Agent<Buffer>(actor) {
    _typedID = actor->getTypedID();
}

BufferValidator::~BufferValidator() {
    DeviceResourceTracker<Buffer>::erase(this);
    CC_SAFE_DELETE(_actor);

    uint32_t lifeTime = DeviceValidator::getInstance()->currentFrame() - _creationFrame;
    // skip those that have never been updated
    if (!_isBufferView && hasFlag(_memUsage, MemoryUsageBit::HOST) && _totalUpdateTimes && _totalUpdateTimes < lifeTime / 3) {
        CC_LOG_WARNING("Triple buffer enabled for infrequently-updated buffer, consider using MemoryUsageBit::DEVICE instead");
        CC_LOG_DEBUG("Init Stacktrace: %s", _initStack.c_str());
    }
}

void BufferValidator::doInit(const BufferInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    CCASSERT(info.usage != BufferUsageBit::NONE, "invalid buffer param");
    CCASSERT(info.memUsage != MemoryUsageBit::NONE, "invalid buffer param");
    CCASSERT(info.size, "zero-sized buffer?");
    CCASSERT(info.size / info.stride * info.stride == info.size, "size is not multiple of stride?");

    _initStack = se::ScriptEngine::getInstance()->getCurrentStackTrace();

    _creationFrame    = DeviceValidator::getInstance()->currentFrame();
    _totalUpdateTimes = 0U;

    if (hasFlag(info.usage, BufferUsageBit::VERTEX) && !info.stride) {
        CCASSERT(false, "invalid stride for vertex buffer");
    }

    /////////// execute ///////////

    _actor->initialize(info);
}

void BufferValidator::doInit(const BufferViewInfo &info) {
    CCASSERT(!isInited(), "initializing twice?");
    _inited = true;

    CCASSERT(info.buffer && static_cast<BufferValidator *>(info.buffer)->isInited(), "already destroyed?");
    CCASSERT(info.offset + info.range <= info.buffer->getSize(), "invalid range");
    CCASSERT(info.range, "zero-sized buffer?");

    uint32_t stride = info.buffer->getStride();
    CCASSERT(info.offset / stride * stride == info.offset, "offset is not multiple of stride?");
    CCASSERT(info.range / stride * stride == info.range, "range is not multiple of stride?");

    /////////// execute ///////////

    BufferViewInfo actorInfo = info;
    actorInfo.buffer         = static_cast<BufferValidator *>(info.buffer)->getActor();

    _actor->initialize(actorInfo);
}

void BufferValidator::doResize(uint32_t size, uint32_t /*count*/) {
    CCASSERT(isInited(), "alread destroyed?");

    CCASSERT(!_isBufferView, "cannot resize through buffer views");
    CCASSERT(size, "invalid size");

    /////////// execute ///////////

    _actor->resize(size);
}

void BufferValidator::doDestroy() {
    CCASSERT(isInited(), "destroying twice?");
    _inited = false;

    /////////// execute ///////////

    _actor->destroy();
}

void BufferValidator::update(const void *buffer, uint32_t size) {
    CCASSERT(isInited(), "alread destroyed?");

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
    ++_totalUpdateTimes; // only count direct updates

    /////////// execute ///////////

    _actor->update(buffer, size);
}

void BufferValidator::sanityCheck(const void *buffer, uint32_t size) {
    uint32_t cur = DeviceValidator::getInstance()->currentFrame();

    if (cur == _lastUpdateFrame) {
        // FIXME: minggo: as current implementation need to update some buffers more than once, so disable it.
        // Should enable it when it is fixed.
        // CC_LOG_WARNING(se::ScriptEngine::getInstance()->getCurrentStackTrace().c_str());
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
