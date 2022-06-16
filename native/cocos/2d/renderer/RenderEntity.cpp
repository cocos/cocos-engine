#include <2d/renderer/Batcher2d.h>
#include <2d/renderer/RenderEntity.h>
#include <cocos/base/TypeDef.h>
#include <iostream>

namespace cc {
RenderEntity::RenderEntity() : RenderEntity(0, 0, 0) {
}

RenderEntity::RenderEntity(Batcher2d* batcher) {
    this->_batcher = batcher;
}

RenderEntity::RenderEntity(const index_t bufferId, const index_t vertexOffset, const index_t indexOffset) {
    this->_bufferId = bufferId;
    this->_vertexOffset = vertexOffset;
    this->_indexOffset = indexOffset;
    this->_stride = 0;
    this->_size = 0;
    this->_batcher = nullptr;
}

RenderEntity::~RenderEntity() {
}

void RenderEntity::setBufferId(index_t bufferId) {
    this->_bufferId = bufferId;
    this->_meshBuffer = _batcher->getMeshBuffer(_bufferId);
}

void RenderEntity::setVertexOffset(index_t vertexOffset) {
    this->_vertexOffset = vertexOffset;
}

void RenderEntity::setIndexOffset(index_t indexOffset) {
    this->_indexOffset = indexOffset;
}

void RenderEntity::setVbBuffer(float_t* vbBuffer) {
    this->_vbBuffer = vbBuffer;
}

void RenderEntity::setIbBuffer(uint16_t* ibBuffer) {
    this->_ibBuffer = ibBuffer;
}

void RenderEntity::setVDataBuffer(float_t* vDataBuffer) {
    this->_vDataBuffer = vDataBuffer;
}

void RenderEntity::setIDataBuffer(uint16_t* iDataBuffer) {
    this->_iDataBuffer = iDataBuffer;
}

void RenderEntity::setVbCount(index_t vbCount) {
    this->_vbCount = vbCount;
}

void RenderEntity::setIbCount(index_t ibCount) {
    this->_ibCount = ibCount;
}

void RenderEntity::setNode(Node* node) {
    _node = node;
    node->setUserData(this);
}

void RenderEntity::setVertDirty(bool val) {
    this->_vertDirty = val;
    _batcher->addVertDirtyRenderer(this);
}

void RenderEntity::setDataHash(uint32_t dataHash) {
    this->_dataHash = dataHash;
}

void RenderEntity::setStencilStage(index_t stencilStage) {
    this->_stencilStage = stencilStage;
}

void RenderEntity::setIsMeshBuffer(bool isMeshBuffer) {
    this->_isMeshBuffer = isMeshBuffer;
}

void RenderEntity::setMaterial(Material* material) {
    this->_material = material;
}

void RenderEntity::setTexture(gfx::Texture* texture) {
    this->_texture = texture;
}

void RenderEntity::setTextureHash(index_t textureHash) {
    this->_textureHash = textureHash;
}

void RenderEntity::setSampler(gfx::Sampler* sampler) {
    this->_sampler = sampler;
}

void RenderEntity::setBlendHash(index_t blendHash) {
    this->_blendHash = blendHash;
}

void RenderEntity::setRender2dBufferToNative(uint8_t* buffer, uint8_t stride, uint32_t size) {
    this->_stride = stride;
    this->_size = size;
    this->_sharedBuffer = buffer;
}

void RenderEntity::syncSharedBufferToNative(index_t* buffer) {
    _attrSharedBuffer = buffer;
    parseAttrLayout();
}

void RenderEntity::parseAttrLayout() {
    _entityAttrLayout = reinterpret_cast<EntityAttrLayout*>(_attrSharedBuffer);
}
} // namespace cc
