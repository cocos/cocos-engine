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

#include "VKStd.h"

#include "VKBuffer.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKBuffer::CCVKBuffer() = default;

CCVKBuffer::~CCVKBuffer() {
    destroy();
}

void CCVKBuffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer = CC_NEW(CCVKGPUBuffer);
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->size = _size;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->count = _count;

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBuffer->indexedIndirectCmds.resize(drawInfoCount);
        _gpuBuffer->indirectCmds.resize(drawInfoCount);
    }

    cmdFuncCCVKCreateBuffer(CCVKDevice::getInstance(), _gpuBuffer);
    CCVKDevice::getInstance()->getMemoryStatus().bufferSize += _size;

    _gpuBufferView = CC_NEW(CCVKGPUBufferView);
    createBufferView();
}

void CCVKBuffer::doInit(const BufferViewInfo &info) {
    auto *buffer = static_cast<CCVKBuffer *>(info.buffer);
    _gpuBuffer = buffer->gpuBuffer();
    _gpuBufferView = CC_NEW(CCVKGPUBufferView);
    createBufferView();
}

void CCVKBuffer::createBufferView() {
    _gpuBufferView->gpuBuffer = _gpuBuffer;
    _gpuBufferView->offset = _offset;
    _gpuBufferView->range = _size;
    CCVKDevice::getInstance()->gpuDescriptorHub()->update(_gpuBufferView);
}

void CCVKBuffer::doDestroy() {
    if (_gpuBufferView) {
        CCVKDevice::getInstance()->gpuDescriptorHub()->disengage(_gpuBufferView);
        CC_DELETE(_gpuBufferView);
        _gpuBufferView = nullptr;
    }

    if (_gpuBuffer) {
        if (!_isBufferView) {
            CCVKDevice::getInstance()->gpuBufferHub()->erase(_gpuBuffer);
            CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuBuffer);
            CCVKDevice::getInstance()->gpuBarrierManager()->cancel(_gpuBuffer);
            CC_DELETE(_gpuBuffer);
            CCVKDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
        }
        _gpuBuffer = nullptr;
    }
}

void CCVKBuffer::doResize(uint size, uint count) {
    CCVKDevice::getInstance()->getMemoryStatus().bufferSize -= _size;
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(_gpuBuffer);

    _gpuBuffer->size = size;
    _gpuBuffer->count = count;
    cmdFuncCCVKCreateBuffer(CCVKDevice::getInstance(), _gpuBuffer);

    createBufferView();

    if (hasFlag(_usage, BufferUsageBit::INDIRECT)) {
        const size_t drawInfoCount = _size / sizeof(DrawInfo);
        _gpuBuffer->indexedIndirectCmds.resize(drawInfoCount);
        _gpuBuffer->indirectCmds.resize(drawInfoCount);
    }
    CCVKDevice::getInstance()->getMemoryStatus().bufferSize += size;
}

void CCVKBuffer::update(const void *buffer, uint size) {
    cmdFuncCCVKUpdateBuffer(CCVKDevice::getInstance(), _gpuBuffer, buffer, size, nullptr);
}

} // namespace gfx
} // namespace cc
