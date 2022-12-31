/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"
#include "GLES3Device.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

GLES3Buffer::GLES3Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Buffer::~GLES3Buffer() {
    destroy();
}

void GLES3Buffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer = ccnew GLES3GPUBuffer;
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        _gpuBuffer->indirects.resize(_count);
    }

    cmdFuncGLES3CreateBuffer(GLES3Device::getInstance(), _gpuBuffer);
    GLES3Device::getInstance()->getMemoryStatus().bufferSize += _size;
    CC_PROFILE_MEMORY_INC(Buffer, _size);
}

void GLES3Buffer::doInit(const BufferViewInfo &info) {
    auto *buffer = static_cast<GLES3Buffer *>(info.buffer);
    _gpuBuffer = ccnew GLES3GPUBuffer;
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;
    _gpuBuffer->glTarget = buffer->_gpuBuffer->glTarget;
    _gpuBuffer->glBuffer = buffer->_gpuBuffer->glBuffer;
    _gpuBuffer->glOffset = info.offset;
    _gpuBuffer->buffer = buffer->_gpuBuffer->buffer;
    _gpuBuffer->indirects = buffer->_gpuBuffer->indirects;
}

void GLES3Buffer::doDestroy() {
    if (_gpuBuffer) {
        if (!_isBufferView) {
            cmdFuncGLES3DestroyBuffer(GLES3Device::getInstance(), _gpuBuffer);
            GLES3Device::getInstance()->getMemoryStatus().bufferSize -= _size;
            CC_PROFILE_MEMORY_DEC(Buffer, _size);
        }
        delete _gpuBuffer;
        _gpuBuffer = nullptr;
    }
}

void GLES3Buffer::doResize(uint32_t size, uint32_t count) {
    GLES3Device::getInstance()->getMemoryStatus().bufferSize -= _size;
    CC_PROFILE_MEMORY_DEC(Buffer, _size);

    _gpuBuffer->size = size;
    _gpuBuffer->count = count;
    cmdFuncGLES3ResizeBuffer(GLES3Device::getInstance(), _gpuBuffer);

    GLES3Device::getInstance()->getMemoryStatus().bufferSize += size;
    CC_PROFILE_MEMORY_INC(Buffer, size);
}

void GLES3Buffer::update(const void *buffer, uint32_t size) {
    CC_PROFILE(GLES3BufferUpdate);
    cmdFuncGLES3UpdateBuffer(GLES3Device::getInstance(), _gpuBuffer, buffer, 0U, size);
}

} // namespace gfx
} // namespace cc
