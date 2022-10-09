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

#include "VKInputAssembler.h"
#include "VKBuffer.h"
#include "VKCommands.h"
#include "VKDevice.h"

namespace cc {
namespace gfx {

CCVKInputAssembler::CCVKInputAssembler() {
    _typedID = generateObjectID<decltype(this)>();
}

CCVKInputAssembler::~CCVKInputAssembler() {
    destroy();
}

void CCVKInputAssembler::doInit([[maybe_unused]] const InputAssemblerInfo &info) {
    _gpuInputAssembler = ccnew CCVKGPUInputAssembler;
    _gpuInputAssembler->attributes = _attributes;
    doUpdate();
}

void CCVKInputAssembler::doDestroy() {
    _gpuInputAssembler = nullptr;
}

void CCVKInputAssembler::doUpdate() {
    size_t vbCount = _vertexBuffers.size();

    _gpuInputAssembler->gpuVertexBuffers.resize(vbCount);

    for (size_t i = 0U; i < vbCount; ++i) {
        auto *vertexBuffer = static_cast<CCVKBuffer *>(_vertexBuffers[i]);
        _gpuInputAssembler->gpuVertexBuffers[i] = vertexBuffer->gpuBufferView();
    }

    if (_indexBuffer != nullptr) {
        _gpuInputAssembler->gpuIndexBuffer = static_cast<CCVKBuffer *>(_indexBuffer)->gpuBufferView();
    }

    if (_indirectBuffer) {
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<CCVKBuffer *>(_indirectBuffer)->gpuBufferView();
    }

    _gpuInputAssembler->vertexBuffers.resize(vbCount);
    _gpuInputAssembler->vertexBufferOffsets.resize(vbCount);

    CCVKGPUDevice *gpuDevice = CCVKDevice::getInstance()->gpuDevice();
    for (size_t i = 0U; i < vbCount; i++) {
        _gpuInputAssembler->vertexBuffers[i] = _gpuInputAssembler->gpuVertexBuffers[i]->gpuBuffer->vkBuffer;
        _gpuInputAssembler->vertexBufferOffsets[i] = _gpuInputAssembler->gpuVertexBuffers[i]->getStartOffset(gpuDevice->curBackBufferIndex);
    }
}

} // namespace gfx
} // namespace cc
