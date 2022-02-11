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

#include "GLES3Std.h"

#include "GLES3Buffer.h"
#include "GLES3Commands.h"
#include "GLES3Device.h"

namespace cc {
namespace gfx {

GLES3Buffer::GLES3Buffer() {
    _typedID = generateObjectID<decltype(this)>();
}

GLES3Buffer::~GLES3Buffer() {
    destroy();
}

void GLES3Buffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer           = CC_NEW(GLES3GPUBuffer);
    _gpuBuffer->usage    = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size     = _size;
    _gpuBuffer->stride   = _stride;
    _gpuBuffer->count    = _count;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        _gpuBuffer->indirects.resize(_count);
    }

    cmdFuncGLES3CreateBuffer(GLES3Device::getInstance(), _gpuBuffer);
    GLES3Device::getInstance()->getMemoryStatus().bufferSize += _size;
}

void GLES3Buffer::doInit(const BufferViewInfo &info) {
    auto *buffer          = static_cast<GLES3Buffer *>(info.buffer);
    _gpuBuffer            = CC_NEW(GLES3GPUBuffer);
    _gpuBuffer->usage     = _usage;
    _gpuBuffer->memUsage  = _memUsage;
    _gpuBuffer->size      = _size;
    _gpuBuffer->stride    = _stride;
    _gpuBuffer->count     = _count;
    _gpuBuffer->glTarget  = buffer->_gpuBuffer->glTarget;
    _gpuBuffer->glBuffer  = buffer->_gpuBuffer->glBuffer;
    _gpuBuffer->glOffset  = info.offset;
    _gpuBuffer->buffer    = buffer->_gpuBuffer->buffer;
    _gpuBuffer->indirects = buffer->_gpuBuffer->indirects;
}

void GLES3Buffer::doDestroy() {
    if (_gpuBuffer) {
        if (!_isBufferView) {
            cmdFuncGLES3DestroyBuffer(GLES3Device::getInstance(), _gpuBuffer);
            GLES3Device::getInstance()->getMemoryStatus().bufferSize -= _size;
        }
        CC_DELETE(_gpuBuffer);
        _gpuBuffer = nullptr;
    }
}

void GLES3Buffer::doResize(uint32_t size, uint32_t count) {
    GLES3Device::getInstance()->getMemoryStatus().bufferSize -= _size;

    _gpuBuffer->size  = size;
    _gpuBuffer->count = count;
    cmdFuncGLES3ResizeBuffer(GLES3Device::getInstance(), _gpuBuffer);

    GLES3Device::getInstance()->getMemoryStatus().bufferSize += size;
}

void GLES3Buffer::update(const void *buffer, uint32_t size) {
    cmdFuncGLES3UpdateBuffer(GLES3Device::getInstance(), _gpuBuffer, buffer, 0U, size);
}

} // namespace gfx
} // namespace cc
