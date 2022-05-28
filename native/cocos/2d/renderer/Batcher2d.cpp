#include <2d/renderer/Batcher2d.h>
#include <cocos/base/TypeDef.h>
#include <iostream>
#include <cocos/2d/assembler/Simple.h>

namespace cc {
Batcher2d::Batcher2d() {
}

Batcher2d::~Batcher2d() {
}

void Batcher2d::syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities) {
    this->_renderEntities = std::move(renderEntities);
}

void Batcher2d::syncMeshBufferAttrToNative(uint32_t* buffer, uint8_t stride, uint32_t size) {    this->_attrSize = size;
    this->_attrStride = stride;
    this->_attrBuffer = buffer;
    parseAttr();
}

void Batcher2d::parseAttr() {
    index_t group = this->_attrSize / this->_attrStride;
    this->_meshBufferAttrArr.clear();
    for (index_t i = 0; i < this->_attrSize; i += this->_attrStride) {
        MeshBufferAttr* temp = reinterpret_cast<MeshBufferAttr*>(this->_attrBuffer+i);
        this->_meshBufferAttrArr.push_back(temp);
    }
}

MeshBufferAttr* Batcher2d::getMeshBufferAttr(index_t bufferId) {
    for (index_t i = 0; i < this->_meshBufferAttrArr.size(); i++) {
        if (this->_meshBufferAttrArr[i]->bufferId == bufferId) {
            return this->_meshBufferAttrArr[i];
        }
    }
    return nullptr;
}

void Batcher2d::ItIsDebugFuncInBatcher2d() {
    std::cout << "It is debug func in Batcher2d.";

    // test code
    Simple* simple = new Simple(this);
    for (int i = 0; i < this->_renderEntities.size(); i++) {
        RenderEntity* temp = this->_renderEntities[i];
        //暂时先用顶点数量判断是否为有效数据
        if (temp->getRenderDataArr().size() > 0) {
            simple->fillBuffers(temp);
        }
    }
}

} // namespace cc
