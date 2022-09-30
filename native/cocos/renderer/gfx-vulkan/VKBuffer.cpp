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

#include "VKBuffer.h"
#include "VKCommandBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"
#include "profiler/Profiler.h"

namespace cc {
namespace gfx {

CCVKBuffer::CCVKBuffer() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKBuffer::~CCVKBuffer() {
    destroy();
}

void CCVKBuffer::doInit(const BufferInfo & /*info*/) {
    _gpuBuffer = ccnew CCVKGPUBuffer;
    _gpuBuffer->size = _size;
    _gpuBuffer->count = _count;
    createBuffer();

    _gpuBufferView = ccnew CCVKGPUBufferView;
    _gpuBufferView->range = _size;
    createBufferView();
}

void CCVKBuffer::doInit(const BufferViewInfo &info) {
    auto *buffer = static_cast<CCVKBuffer *>(info.buffer);
    _gpuBuffer = buffer->gpuBuffer();
    _gpuBufferView = ccnew CCVKGPUBufferView;
    _gpuBufferView->range = _size;
    createBufferView();
}

void CCVKBuffer::createBuffer() {
    _gpuBuffer->usage = _usage;
    _gpuBuffer->memUsage = _memUsage;
    _gpuBuffer->stride = _stride;
    _gpuBuffer->init();
}

void CCVKBuffer::createBufferView() {
    _gpuBufferView->gpuBuffer = _gpuBuffer;
    _gpuBufferView->offset = _offset;
}

void CCVKBuffer::doDestroy() {
    _gpuBufferView = nullptr;
    _gpuBuffer = nullptr;
}

void CCVKBuffer::doResize(uint32_t size, uint32_t count) {
    _gpuBuffer = ccnew CCVKGPUBuffer();
    _gpuBuffer->size = size;
    _gpuBuffer->count = count;
    createBuffer();

    auto oldBufferView = _gpuBufferView;
    _gpuBufferView = ccnew CCVKGPUBufferView();
    _gpuBufferView->range = size;
    createBufferView();
    CCVKDevice::getInstance()->gpuDescriptorHub()->update(oldBufferView, _gpuBufferView);
    CCVKDevice::getInstance()->gpuIAHub()->update(oldBufferView, _gpuBufferView);
}

void CCVKBuffer::update(const void *buffer, uint32_t size) {
    CC_PROFILE(CCVKBufferUpdate);
    cmdFuncCCVKUpdateBuffer(CCVKDevice::getInstance(), _gpuBuffer, buffer, size, nullptr);
}

void CCVKGPUBuffer::shutdown() {
    CCVKDevice::getInstance()->gpuBarrierManager()->cancel(this);
    CCVKDevice::getInstance()->gpuRecycleBin()->collect(this);
    CCVKDevice::getInstance()->gpuBufferHub()->erase(this);

    CCVKDevice::getInstance()->getMemoryStatus().bufferSize -= size;
    CC_PROFILE_MEMORY_DEC(Buffer, size);
}

void CCVKGPUBuffer::init() {
    if (hasFlag(usage, BufferUsageBit::INDIRECT)) {
        const size_t drawInfoCount = size / sizeof(DrawInfo);
        indexedIndirectCmds.resize(drawInfoCount);
        indirectCmds.resize(drawInfoCount);
    }

    cmdFuncCCVKCreateBuffer(CCVKDevice::getInstance(), this);
    CCVKDevice::getInstance()->getMemoryStatus().bufferSize += size;
    CC_PROFILE_MEMORY_INC(Buffer, size);
}

void CCVKGPUBufferView::shutdown() {
    CCVKDevice::getInstance()->gpuDescriptorHub()->disengage(this);
    CCVKDevice::getInstance()->gpuIAHub()->disengage(this);
}

} // namespace gfx
} // namespace cc
