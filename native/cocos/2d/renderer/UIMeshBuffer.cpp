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

#include "2d/renderer/UIMeshBuffer.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {

static uint32_t getAttributesStride(ccstd::vector<gfx::Attribute>& attrs) {
    uint32_t stride = 0;
    for (auto& attr : attrs) {
        const auto& info = gfx::GFX_FORMAT_INFOS[static_cast<uint32_t>(attr.format)];
        stride += info.size;
    }
    return stride;
}

UIMeshBuffer::~UIMeshBuffer() {
    destroy();
}

void UIMeshBuffer::setVData(float* vData) {
    _vData = vData;
}

void UIMeshBuffer::setIData(uint16_t* iData) {
    _iData = iData;
}

void UIMeshBuffer::initialize(ccstd::vector<gfx::Attribute>&& attrs, bool needCreateLayout) {
    _attributes = attrs;
    _vertexFormatBytes = getAttributesStride(attrs);
    if (needCreateLayout) {
        _meshBufferLayout = new MeshBufferLayout();
    }
    _needDeleteLayout = needCreateLayout;
}

void UIMeshBuffer::reset() {
    setIndexOffset(0);
    _nextFreeIAHandle = 0;
    _dirty = false;
}

void UIMeshBuffer::resetIA() {
    for (auto* ia : _iaPool) {
        ia->setFirstIndex(0);
        ia->setIndexCount(0);
    }
}

void UIMeshBuffer::destroy() {
    reset();
    _attributes.clear();
    for (auto* vb : _iaInfo.vertexBuffers) {
        delete vb;
    }
    _iaInfo.vertexBuffers.clear();
    CC_SAFE_DELETE(_iaInfo.indexBuffer);
    if (_needDeleteVData) {
        delete _vData;
        delete _iData;
    }
    _vData = nullptr;
    _iData = nullptr;
    // Destroy InputAssemblers
    for (auto* ia : _iaPool) {
        ia->destroy();
        delete ia;
    }
    _iaPool.clear();
    if (_needDeleteLayout) {
        CC_SAFE_DELETE(_meshBufferLayout);
    }
}

void UIMeshBuffer::setDirty() {
    _dirty = true;
}

gfx::InputAssembler* UIMeshBuffer::requireFreeIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        createNewIA(device);
    }
    return _iaPool[_nextFreeIAHandle++];
}

void UIMeshBuffer::uploadBuffers() {
    uint32_t byteOffset = getByteOffset();
    bool dirty = getDirty();
    if (_meshBufferLayout == nullptr || byteOffset == 0 || !dirty || _iaPool.empty()) {
        return;
    }

    uint32_t indexCount = getIndexOffset();
    uint32_t byteCount = getByteOffset();

    gfx::InputAssembler* ia = _iaPool[0];
    gfx::BufferList vBuffers = ia->getVertexBuffers();
    if (!vBuffers.empty()) {
        gfx::Buffer* vBuffer = vBuffers[0];
        if (byteCount > vBuffer->getSize()) {
            vBuffer->resize(byteCount);
        }
        vBuffer->update(_vData);
    }
    gfx::Buffer* iBuffer = ia->getIndexBuffer();
    if (indexCount * 2 > iBuffer->getSize()) {
        iBuffer->resize(indexCount * 2);
    }
    iBuffer->update(_iData);

    setDirty(false);
}

// use less
void UIMeshBuffer::recycleIA(gfx::InputAssembler* ia) {
}

gfx::InputAssembler* UIMeshBuffer::createNewIA(gfx::Device* device) {
    if (_iaPool.empty()) {
        uint32_t vbStride = _vertexFormatBytes;
        uint32_t ibStride = sizeof(uint16_t);

        auto* vertexBuffer = device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
            vbStride * 3,
            vbStride,
        });
        auto* indexBuffer = device->createBuffer({
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE | gfx::MemoryUsageBit::HOST,
            ibStride * 3,
            ibStride,
        });

        _iaInfo.attributes = _attributes;
        _iaInfo.vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo.indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(_iaInfo);
    _iaPool.emplace_back(ia);

    return ia;
}

void UIMeshBuffer::syncSharedBufferToNative(uint32_t* buffer) {
    _sharedBuffer = buffer;
    parseLayout();
}

void UIMeshBuffer::parseLayout() {
    _meshBufferLayout = reinterpret_cast<MeshBufferLayout*>(_sharedBuffer);
}

void UIMeshBuffer::setByteOffset(uint32_t byteOffset) {
    _meshBufferLayout->byteOffset = byteOffset;
}

void UIMeshBuffer::setVertexOffset(uint32_t vertexOffset) {
    _meshBufferLayout->vertexOffset = vertexOffset;
}

void UIMeshBuffer::setIndexOffset(uint32_t indexOffset) {
    _meshBufferLayout->indexOffset = indexOffset;
}

void UIMeshBuffer::setDirty(bool dirty) const {
    _meshBufferLayout->dirtyMark = dirty ? 1 : 0;
}

} // namespace cc
