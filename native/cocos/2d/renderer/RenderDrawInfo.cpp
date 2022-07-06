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

#include "2d/renderer/RenderDrawInfo.h"
#include <iostream>
#include "2d/renderer/Batcher2d.h"
#include "base/TypeDef.h"
#include "renderer/gfx-base/GFXDevice.h"

namespace cc {
RenderDrawInfo::RenderDrawInfo() : RenderDrawInfo(nullptr) {
}

RenderDrawInfo::RenderDrawInfo(Batcher2d* batcher) : _batcher(batcher) {
    _seArrayBufferObject = se::Object::createExternalArrayBufferObject(&_drawInfoAttrLayout, sizeof(DrawInfoAttrLayout), [](void* a, size_t b, void* c) {});
    _seArrayBufferObject->root();
    _attrSharedBuffer = new ArrayBuffer();
    _attrSharedBuffer->setJSArrayBuffer(_seArrayBufferObject);
}

RenderDrawInfo::RenderDrawInfo(const index_t bufferId, const uint32_t vertexOffset, const uint32_t indexOffset) {
    _bufferId = bufferId;
    _vertexOffset = vertexOffset;
    _indexOffset = indexOffset;
    _stride = 0;
    _size = 0;
    _batcher = nullptr;

    _seArrayBufferObject = se::Object::createExternalArrayBufferObject(&_drawInfoAttrLayout, sizeof(DrawInfoAttrLayout), [](void* a, size_t b, void* c) {});
    _seArrayBufferObject->root();
    _attrSharedBuffer = new ArrayBuffer();
    _attrSharedBuffer->setJSArrayBuffer(_seArrayBufferObject);
}

RenderDrawInfo::~RenderDrawInfo() {
    _seArrayBufferObject->decRef();
    destroy();
}

void RenderDrawInfo::setBatcher(Batcher2d* batcher) {
    _batcher = batcher;
}

void RenderDrawInfo::setAccId(index_t id) {
    _accId = id;
}

void RenderDrawInfo::setBufferId(index_t bufferId) {
    _bufferId = bufferId;
    _meshBuffer = _batcher->getMeshBuffer(_accId, _bufferId);
}

void RenderDrawInfo::setVertexOffset(uint32_t vertexOffset) {
    _vertexOffset = vertexOffset;
}

void RenderDrawInfo::setIndexOffset(uint32_t indexOffset) {
    _indexOffset = indexOffset;
}

void RenderDrawInfo::setVbBuffer(float_t* vbBuffer) {
    _vbBuffer = vbBuffer;
}

void RenderDrawInfo::setIbBuffer(uint16_t* ibBuffer) {
    _ibBuffer = ibBuffer;
}

void RenderDrawInfo::setVDataBuffer(float_t* vDataBuffer) {
    _vDataBuffer = vDataBuffer;
}

void RenderDrawInfo::setIDataBuffer(uint16_t* iDataBuffer) {
    _iDataBuffer = iDataBuffer;
}

void RenderDrawInfo::setVbCount(uint32_t vbCount) {
    _vbCount = vbCount;
}

void RenderDrawInfo::setIbCount(uint32_t ibCount) {
    _ibCount = ibCount;
}

void RenderDrawInfo::setNode(Node* node) {
    _node = node;
}

void RenderDrawInfo::setVertDirty(bool val) {
    _vertDirty = val;
}

void RenderDrawInfo::setDataHash(ccstd::hash_t dataHash) {
    _dataHash = dataHash;
}

void RenderDrawInfo::setStencilStage(uint32_t stencilStage) {
    _stencilStage = stencilStage;
}

void RenderDrawInfo::setIsMeshBuffer(bool isMeshBuffer) {
    _isMeshBuffer = isMeshBuffer;
}

void RenderDrawInfo::setMaterial(Material* material) {
    _material = material;
}

void RenderDrawInfo::setTexture(gfx::Texture* texture) {
    _texture = texture;
}

void RenderDrawInfo::setTextureHash(uint32_t textureHash) {
    _textureHash = textureHash;
}

void RenderDrawInfo::setSampler(gfx::Sampler* sampler) {
    _sampler = sampler;
}

void RenderDrawInfo::setBlendHash(uint32_t blendHash) {
    _blendHash = blendHash;
}

void RenderDrawInfo::setModel(scene::Model* model) {
    _model = model;
}

void RenderDrawInfo::setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size, uint8_t type) {
    _stride = stride;
    _size = size;
    _sharedBuffer = buffer;
    _drawType = type;
}

const ArrayBuffer& RenderDrawInfo::getAttrSharedBufferForJS() const {
    return *_attrSharedBuffer;
}

gfx::InputAssembler* RenderDrawInfo::requestIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        _initIAInfo(device);
    }
    auto* ia = _iaPool[_nextFreeIAHandle++]; // 需要 reset
    ia->setFirstIndex(getIndexOffset());
    ia->setIndexCount(getIbCount());
    return ia;
}

void RenderDrawInfo::uploadBuffers() {
    if (_vbCount == 0 || _ibCount == 0) return;
    auto size = _vbCount * 9;
    gfx::Buffer* vBuffer = _vbGFXBuffer;
    vBuffer->resize(size);
    vBuffer->update(_vDataBuffer);
    gfx::Buffer* iBuffer = _ibGFXBuffer;
    auto isize = _ibCount * sizeof(uint16_t);
    iBuffer->resize(isize);
    iBuffer->update(_iDataBuffer);
}

void RenderDrawInfo::resetMeshIA() {
    _nextFreeIAHandle = 0;
}

void RenderDrawInfo::destroy() {
    _nextFreeIAHandle = 0;
    _attributes.clear();
    for (auto* vb : _iaInfo.vertexBuffers) {
        delete vb;
    }
    _iaInfo.vertexBuffers.clear();
    CC_SAFE_DELETE(_iaInfo.indexBuffer);

    for (auto* ia : _iaPool) {
        ia->destroy();
        delete ia;
    }
    _iaPool.clear();
}

gfx::InputAssembler* RenderDrawInfo::_initIAInfo(gfx::Device* device) {
    if (_iaPool.empty()) {
        uint32_t vbStride = 9 * sizeof(float); // hack
        uint32_t ibStride = sizeof(uint16_t);
        auto* vertexBuffer = device->createBuffer({
            gfx::BufferUsageBit::VERTEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            vbStride * 3,
            vbStride,
        });
        auto* indexBuffer = device->createBuffer({
            gfx::BufferUsageBit::INDEX | gfx::BufferUsageBit::TRANSFER_DST,
            gfx::MemoryUsageBit::DEVICE,
            ibStride * 3,
            ibStride,
        });

        _vbGFXBuffer = vertexBuffer;
        _ibGFXBuffer = indexBuffer;

        _iaInfo.attributes = _attributes;
        _iaInfo.vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo.indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(_iaInfo);
    _iaPool.emplace_back(ia);

    return ia;
}
} // namespace cc
