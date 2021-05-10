/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

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

#include "GLES2Std.h"

#include "GLES2Buffer.h"
#include "GLES2Commands.h"
#include "GLES2Device.h"

namespace cc {
namespace gfx {

GLES2Buffer::GLES2Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES2Buffer::~GLES2Buffer() {
    destroy();
}

void GLES2Buffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer           = CC_NEW(GLES2GPUBuffer);
    _gpuBuffer->usage    = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size     = _size;
    _gpuBuffer->stride   = _stride;
    _gpuBuffer->count    = _count;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        _gpuBuffer->indirects.resize(_count);
    }

    cmdFuncGLES2CreateBuffer(GLES2Device::getInstance(), _gpuBuffer);
    GLES2Device::getInstance()->getMemoryStatus().bufferSize += _size;
}

void GLES2Buffer::doInit(const BufferViewInfo &info) {
    auto *buffer              = static_cast<GLES2Buffer *>(info.buffer);
    _gpuBufferView            = CC_NEW(GLES2GPUBufferView);
    _gpuBufferView->gpuBuffer = buffer->gpuBuffer();
    _gpuBufferView->range     = _size;
    _gpuBufferView->offset    = info.offset;
}

void GLES2Buffer::doDestroy() {
    if (_gpuBuffer) {
        GLES2Device::getInstance()->getMemoryStatus().bufferSize -= _size;
        cmdFuncGLES2DestroyBuffer(GLES2Device::getInstance(), _gpuBuffer);
        CC_DELETE(_gpuBuffer);
        _gpuBuffer = nullptr;
    }

    CC_SAFE_DELETE(_gpuBufferView);
}

void GLES2Buffer::doResize(uint size, uint count) {
    GLES2Device::getInstance()->getMemoryStatus().bufferSize -= _size;
    _gpuBuffer->size  = size;
    _gpuBuffer->count = count;
    cmdFuncGLES2ResizeBuffer(GLES2Device::getInstance(), _gpuBuffer);
    GLES2Device::getInstance()->getMemoryStatus().bufferSize += size;
}

void GLES2Buffer::update(const void *buffer, uint size) {
    cmdFuncGLES2UpdateBuffer(GLES2Device::getInstance(), _gpuBuffer, buffer, 0U, size);
}

} // namespace gfx
} // namespace cc
