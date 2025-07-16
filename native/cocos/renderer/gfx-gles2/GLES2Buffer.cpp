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

#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"
#include "GLES2Device.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

GLES2Buffer::GLES2Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2Buffer::~GLES2Buffer() {
    destroy();
}

void GLES2Buffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer = ccnew GLES2GPUBuffer;
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        _gpuBuffer->indirects.resize(_count);
    }

    cmdFuncGLES2CreateBuffer(GLES2Device::getInstance(), _gpuBuffer);
    GLES2Device::getInstance()->getMemoryStatus().bufferSize += _size;
    CC_PROFILE_MEMORY_INC(Buffer, _size);
}

void GLES2Buffer::doInit(const BufferViewInfo &info) {
    auto *buffer = static_cast<GLES2Buffer *>(info.buffer);
    _gpuBufferView = ccnew GLES2GPUBufferView;
    _gpuBufferView->gpuBuffer = buffer->gpuBuffer();
    _gpuBufferView->range = _size;
    _gpuBufferView->offset = info.offset;
}

void GLES2Buffer::doDestroy() {
    if (_gpuBuffer) {
        GLES2Device::getInstance()->getMemoryStatus().bufferSize -= _size;
        CC_PROFILE_MEMORY_DEC(Buffer, _size);
        cmdFuncGLES2DestroyBuffer(GLES2Device::getInstance(), _gpuBuffer);
        delete _gpuBuffer;
        _gpuBuffer = nullptr;
    }

    CC_SAFE_DELETE(_gpuBufferView);
}

void GLES2Buffer::doResize(uint32_t size, uint32_t count) {
    GLES2Device::getInstance()->getMemoryStatus().bufferSize -= _size;
    CC_PROFILE_MEMORY_DEC(Buffer, _size);
    _gpuBuffer->size = size;
    _gpuBuffer->count = count;
    cmdFuncGLES2ResizeBuffer(GLES2Device::getInstance(), _gpuBuffer);
    GLES2Device::getInstance()->getMemoryStatus().bufferSize += size;
    CC_PROFILE_MEMORY_INC(Buffer, size);
}

void GLES2Buffer::update(const void *buffer, uint32_t size) {
    CC_PROFILE(GLES2BufferUpdate);
    cmdFuncGLES2UpdateBuffer(GLES2Device::getInstance(), _gpuBuffer, buffer, 0U, size);
}

} // namespace gfx
} // namespace cc
