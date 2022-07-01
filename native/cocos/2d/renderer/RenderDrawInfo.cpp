#include <2d/renderer/Batcher2d.h>
#include <2d/renderer/RenderDrawInfo.h>
#include <cocos/base/TypeDef.h>
#include <iostream>
#include <gfx-base/GFXDevice.h>

namespace cc {
RenderDrawInfo::RenderDrawInfo() : RenderDrawInfo(nullptr) {
}

RenderDrawInfo::RenderDrawInfo(Batcher2d* batcher) {
    this->_batcher = batcher;

    _seArrayBufferObject = se::Object::createExternalArrayBufferObject(&_drawInfoAttrLayout, sizeof(DrawInfoAttrLayout), [](void* a, size_t b, void* c) {});
    _seArrayBufferObject->root();
    _attrSharedBuffer = new ArrayBuffer();
    _attrSharedBuffer->setJSArrayBuffer(_seArrayBufferObject);
}

RenderDrawInfo::RenderDrawInfo(const index_t bufferId, const uint32_t vertexOffset, const uint32_t indexOffset) {
    this->_bufferId = bufferId;
    this->_vertexOffset = vertexOffset;
    this->_indexOffset = indexOffset;
    this->_stride = 0;
    this->_size = 0;
    this->_batcher = nullptr;

    _seArrayBufferObject = se::Object::createExternalArrayBufferObject(&_drawInfoAttrLayout, sizeof(DrawInfoAttrLayout), [](void* a, size_t b, void* c) {});
    _seArrayBufferObject->root();
    _attrSharedBuffer = new ArrayBuffer();
    _attrSharedBuffer->setJSArrayBuffer(_seArrayBufferObject);
}

RenderDrawInfo::~RenderDrawInfo() {
    _seArrayBufferObject->decRef();
}

void RenderDrawInfo::setBatcher(Batcher2d* batcher) {
    _batcher = batcher;
}

void RenderDrawInfo::setAccId(index_t id) {
    _accId = id;
}

void RenderDrawInfo::setBufferId(index_t bufferId) {
    this->_bufferId = bufferId;
    this->_meshBuffer = _batcher->getMeshBuffer(_accId, _bufferId);
}

void RenderDrawInfo::setVertexOffset(uint32_t vertexOffset) {
    this->_vertexOffset = vertexOffset;
}

void RenderDrawInfo::setIndexOffset(uint32_t indexOffset) {
    this->_indexOffset = indexOffset;
}

void RenderDrawInfo::setVbBuffer(float_t* vbBuffer) {
    this->_vbBuffer = vbBuffer;
}

void RenderDrawInfo::setIbBuffer(uint16_t* ibBuffer) {
    this->_ibBuffer = ibBuffer;
}

void RenderDrawInfo::setVDataBuffer(float_t* vDataBuffer) {
    this->_vDataBuffer = vDataBuffer;
}

void RenderDrawInfo::setIDataBuffer(uint16_t* iDataBuffer) {
    this->_iDataBuffer = iDataBuffer;
}

void RenderDrawInfo::setVbCount(uint32_t vbCount) {
    this->_vbCount = vbCount;
}

void RenderDrawInfo::setIbCount(uint32_t ibCount) {
    this->_ibCount = ibCount;
}

void RenderDrawInfo::setNode(Node* node) {
    _node = node;
    //node->setUserData(this);
}

void RenderDrawInfo::setVertDirty(bool val) {
    this->_vertDirty = val;
    //_batcher->addVertDirtyRenderer(this);
}

void RenderDrawInfo::setDataHash(uint32_t dataHash) {
    this->_dataHash = dataHash;
}

void RenderDrawInfo::setStencilStage(uint32_t stencilStage) {
    this->_stencilStage = stencilStage;
}

void RenderDrawInfo::setIsMeshBuffer(bool isMeshBuffer) {
    this->_isMeshBuffer = isMeshBuffer;
}

void RenderDrawInfo::setMaterial(Material* material) {
    this->_material = material;
}

void RenderDrawInfo::setTexture(gfx::Texture* texture) {
    this->_texture = texture;
}

void RenderDrawInfo::setTextureHash(uint32_t textureHash) {
    this->_textureHash = textureHash;
}

void RenderDrawInfo::setSampler(gfx::Sampler* sampler) {
    this->_sampler = sampler;
}

void RenderDrawInfo::setBlendHash(uint32_t blendHash) {
    this->_blendHash = blendHash;
}

void RenderDrawInfo::setModel(scene::Model* model) {
    _model = model;
}

void RenderDrawInfo::setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size, uint8_t type) {
    this->_stride = stride;
    this->_size = size;
    this->_sharedBuffer = buffer;
    this->_drawType = type;
}

void RenderDrawInfo::syncSharedBufferToNative(uint32_t* buffer) {
    //_attrSharedBuffer = buffer;
    parseAttrLayout();
}

void RenderDrawInfo::parseAttrLayout() {
    //_drawInfoAttrLayout = reinterpret_cast<DrawInfoAttrLayout*>(_attrSharedBuffer);
    //_drawInfoAttrLayout = reinterpret_cast<DrawInfoAttrLayout*>();
}

const ArrayBuffer& RenderDrawInfo::getAttrSharedBufferForJS() const {
    return *_attrSharedBuffer;
}

gfx::InputAssembler* RenderDrawInfo::requestIA(gfx::Device* device) {
    if (_nextFreeIAHandle >= _iaPool.size()) {
        _initIAInfo(device);
    }
    auto* ia = _iaPool[_nextFreeIAHandle++]; // 需要 reset
    ia->setFirstIndex(this->getIndexOffset());
    ia->setIndexCount(this->getIbCount());
    return ia;
}

void RenderDrawInfo::uploadBuffers() {
    if (_vbCount == 0 || _ibCount == 0) return;
    auto size = _vbCount * 9;
    gfx::Buffer* vBuffer = vbGFXBuffer;
    vBuffer->resize(size);
    vBuffer->update(_vDataBuffer);
    gfx::Buffer* iBuffer = ibGFXBuffer;
    auto isize = _ibCount * sizeof(uint16_t);
    iBuffer->resize(isize);
    iBuffer->update(_iDataBuffer);
}

void RenderDrawInfo::resetMeshIA() {
    _nextFreeIAHandle = 0;
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

        vbGFXBuffer = vertexBuffer;
        ibGFXBuffer = indexBuffer;

        _iaInfo.attributes = _attributes;
        _iaInfo.vertexBuffers.emplace_back(vertexBuffer);
        _iaInfo.indexBuffer = indexBuffer;
    }
    auto* ia = device->createInputAssembler(_iaInfo);
    _iaPool.emplace_back(ia);

    return ia;
}

//ArrayBuffer::Ptr RenderDrawInfo::getAttrSharedBufferForJS() const {
//    ArrayBuffer::Ptr buffer = ccnew ArrayBuffer();
//    buffer->setJSArrayBuffer(_seArrayBufferObject);
//    return buffer;
//}
} // namespace cc
