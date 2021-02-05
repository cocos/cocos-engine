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
#include "VKDevice.h"
#include "VKCommands.h"
#include "VKInputAssembler.h"

namespace cc {
namespace gfx {

CCVKInputAssembler::CCVKInputAssembler(Device *device)
: InputAssembler(device) {
}

CCVKInputAssembler::~CCVKInputAssembler() {
}

bool CCVKInputAssembler::initialize(const InputAssemblerInfo &info) {
    _attributes = info.attributes;
    _vertexBuffers = info.vertexBuffers;
    _indexBuffer = info.indexBuffer;
    _indirectBuffer = info.indirectBuffer;
    size_t vbCount = _vertexBuffers.size();

    if (_indexBuffer) {
        _indexCount = _indexBuffer->getCount();
        _firstIndex = 0;
    } else if (_vertexBuffers.size()) {
        _vertexCount = _vertexBuffers[0]->getCount();
        _firstVertex = 0;
        _vertexOffset = 0;
    }

    _gpuInputAssembler = CC_NEW(CCVKGPUInputAssembler);
    _gpuInputAssembler->attributes = _attributes;
    _gpuInputAssembler->gpuVertexBuffers.resize(vbCount);

    for (size_t i = 0u; i < vbCount; ++i) {
        CCVKBuffer *vb = (CCVKBuffer *)_vertexBuffers[i];
        _gpuInputAssembler->gpuVertexBuffers[i] = vb->gpuBuffer();
    }

    if (info.indexBuffer) {
        _gpuInputAssembler->gpuIndexBuffer = static_cast<CCVKBuffer *>(info.indexBuffer)->gpuBuffer();
    }

    if (info.indirectBuffer) {
        _gpuInputAssembler->gpuIndirectBuffer = static_cast<CCVKBuffer *>(info.indirectBuffer)->gpuBuffer();
    }

    _gpuInputAssembler->vertexBuffers.resize(vbCount);
    _gpuInputAssembler->vertexBufferOffsets.resize(vbCount);

    for (size_t i = 0u; i < vbCount; i++) {
        _gpuInputAssembler->vertexBuffers[i] = _gpuInputAssembler->gpuVertexBuffers[i]->vkBuffer;
        _gpuInputAssembler->vertexBufferOffsets[i] = _gpuInputAssembler->gpuVertexBuffers[i]->startOffset;
    }

    _attributesHash = computeAttributesHash();

    return true;
}

void CCVKInputAssembler::destroy() {
    if (_gpuInputAssembler) {
        _gpuInputAssembler->vertexBuffers.clear();
        _gpuInputAssembler->vertexBufferOffsets.clear();
        CC_DELETE(_gpuInputAssembler);
        _gpuInputAssembler = nullptr;
    }
}

} // namespace gfx
} // namespace cc
