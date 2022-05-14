#include <2d/renderer/RenderEntry.h>
#include <cocos/base/TypeDef.h>
#include <iostream>

namespace cc {
RenderEntry::RenderEntry() : RenderEntry(0, 0, 0) {
}

RenderEntry::RenderEntry(const index_t bufferId, const index_t vertexOffset, const index_t indexOffset) {
    this->_bufferId = bufferId;
    this->_vertextOffset = vertexOffset;
    this->_indexOffset = indexOffset;
}

RenderEntry::~RenderEntry() {
}

void RenderEntry::setBufferId(index_t bufferId) {
    this->_bufferId = bufferId;
}

void RenderEntry::setVertexOffset(index_t vertexOffset) {
    this->_vertextOffset = vertexOffset;
}

void RenderEntry::setIndexOffset(index_t indexOffset) {
    this->_indexOffset = indexOffset;
}

void RenderEntry::setVbBuffer(float_t* vbBuffer) {
    this->_vbBuffer = vbBuffer;
}

void RenderEntry::setVDataBuffer(float_t* vDataBuffer) {
    this->_vDataBuffer = vDataBuffer;
}

void RenderEntry::setIDataBuffer(uint16_t* iDataBuffer) {
    this->_iDataBuffer = iDataBuffer;
}
}

