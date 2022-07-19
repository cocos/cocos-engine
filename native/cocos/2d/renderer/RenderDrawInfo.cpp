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
#include "2d/renderer/Batcher2d.h"
#include "base/TypeDef.h"
#include "renderer/gfx-base/GFXDevice.h"
#include "core/Root.h"

namespace cc {

RenderDrawInfo::RenderDrawInfo(index_t bufferId, uint32_t vertexOffset, uint32_t indexOffset) { // NOLINT(bugprone-easily-swappable-parameters)
    _bufferId = bufferId;
    _vertexOffset = vertexOffset;
    _indexOffset = indexOffset;
    _stride = 0;
    _size = 0;
}

RenderDrawInfo::~RenderDrawInfo() {
    destroy();
}

void RenderDrawInfo::setAccId(index_t id) {
    _accId = id;
}

void RenderDrawInfo::setBufferId(index_t bufferId) {
    CC_ASSERT(Root::getInstance()->getBatcher2D());
    _bufferId = bufferId;
    _meshBuffer = Root::getInstance()->getBatcher2D()->getMeshBuffer(_accId, _bufferId);
}

void RenderDrawInfo::setVertexOffset(uint32_t vertexOffset) {
    _vertexOffset = vertexOffset;
}

void RenderDrawInfo::setIndexOffset(uint32_t indexOffset) {
    _indexOffset = indexOffset;
}

void RenderDrawInfo::setVbBuffer(float* vbBuffer) {
    _vbBuffer = vbBuffer;
}

void RenderDrawInfo::setIbBuffer(uint16_t* ibBuffer) {
    _ibBuffer = ibBuffer;
}

void RenderDrawInfo::setVDataBuffer(float* vDataBuffer) {
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

void RenderDrawInfo::setVertDirty(bool val) {
    _vertDirty = val;
}

void RenderDrawInfo::setDataHash(ccstd::hash_t dataHash) {
    _dataHash = dataHash;
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

void RenderDrawInfo::setModel(scene::Model* model) {
    _model = model;
}

void RenderDrawInfo::setDrawInfoType(uint32_t type) {
    _drawInfoType = static_cast<RenderDrawInfoType>(type);
}

void RenderDrawInfo::setSubNode(Node *node) {
    _subNode = node;
}

void RenderDrawInfo::setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size) { // NOLINT(bugprone-easily-swappable-parameters)
    _stride = stride;
    _size = size;
    _sharedBuffer = buffer;
}

gfx::InputAssembler* RenderDrawInfo::requestIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        initIAInfo(device);
    }
    auto* ia = _iaPool[_nextFreeIAHandle++]; // 需要 reset
    ia->setFirstIndex(getIndexOffset());
    ia->setIndexCount(getIbCount());
    return ia;
}

void RenderDrawInfo::uploadBuffers() {
    if (_vbCount == 0 || _ibCount == 0) return;
    uint32_t size = _vbCount * 9 * sizeof(float);// magic Number
    gfx::Buffer* vBuffer = _vbGFXBuffer;
    vBuffer->resize(size);
    vBuffer->update(_vDataBuffer);
    gfx::Buffer* iBuffer = _ibGFXBuffer;
    uint32_t iSize = _ibCount * 2;
    iBuffer->resize(iSize);
    iBuffer->update(_iDataBuffer);
}

void RenderDrawInfo::resetMeshIA() {
    _nextFreeIAHandle = 0;
}

void RenderDrawInfo::destroy() {
    _nextFreeIAHandle = 0;

    //TODO(): Should use _iaPool to delete vb, ib.
    if (_iaInfo != nullptr) {
        CC_SAFE_DELETE(_iaInfo->indexBuffer);
        if (!_iaInfo->vertexBuffers.empty()) {
            // only one vb
            CC_SAFE_DELETE(_iaInfo->vertexBuffers[0]);
            _iaInfo->vertexBuffers.clear();
        }
        CC_SAFE_DELETE(_iaInfo);
    }

    for (auto* ia : _iaPool) {
        //TODO(): should use these codes to delete all ib, vb.
        //        delete ia->getIndexBuffer();
        //        // only one vertex buffer
        //        delete ia->getVertexBuffers()[0];
        CC_SAFE_DELETE(ia);
    }
    _iaPool.clear();
}

gfx::InputAssembler* RenderDrawInfo::initIAInfo(gfx::Device* device) {
    if (_iaPool.empty()) {
        _iaInfo = new gfx::InputAssemblerInfo();
        uint32_t vbStride = 9 * sizeof(float);// magic Number
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

        _vbGFXBuffer = vertexBuffer;
        _ibGFXBuffer = indexBuffer;

        _iaInfo->attributes = *(Root::getInstance()->getBatcher2D()->getDefaultAttribute());
        _iaInfo->vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo->indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(*_iaInfo);
    _iaPool.emplace_back(ia);

    return ia;
}
} // namespace cc
