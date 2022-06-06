#include "Simple.h"
#include <2d/assembler/Simple.h>
#include <cocos/base/TypeDef.h>
#include <cocos/2d/renderer/Batcher2d.h>

namespace cc {
Simple::Simple(/* args */) {
    this->_vertexRow = 2;
    this->_vertexCol = 2;
    this->_batcher = nullptr;
}

Simple::Simple(Batcher2d* batcher) {
    this->_vertexRow = 2;
    this->_vertexCol = 2;
    this->_batcher = batcher;
}

Simple::~Simple() {
}

void Simple::updateWorldVerts(RenderEntity* entity) {
    if (entity == nullptr) {
        return;
    }

    ccstd::vector<Render2dLayout*>& dataList = entity->getRenderDataArr();
    Node* node = entity->getNode();
    const Mat4& matrix = node->getWorldMatrix();
    uint8_t stride = entity->getStride();
    float_t* vbBuffer = entity->getVbBuffer();

    Vec3 temp;
    uint8_t offset = 0;
    for (int i = 0; i < dataList.size(); i++) {
        Render2dLayout* curLayout = dataList[i];
        temp.transformMat4(curLayout->position, matrix);

        offset = i * stride;
        vbBuffer[offset++] = temp.x;
        vbBuffer[offset++] = temp.y;
        vbBuffer[offset++] = temp.z;
    }
}

void Simple::fillBuffers(RenderEntity* entity) {
    Node* node = entity->getNode();
    if (node == nullptr) {
        return;
    }
    if ( node->getChangedFlags() || entity->getVertDirty()) {
        this->updateWorldVerts(entity);
        entity->setVertDirty(false);
    }

    index_t vertexOffset = entity->getVertexOffset();
    uint16_t* ib = entity->getIDataBuffer();

    UIMeshBuffer* buffer = _batcher->getMeshBuffer(entity->getBufferId());
    index_t indexOffset = 0;
    if (buffer != nullptr) {
        //因为目前的indexOffset还在ts层修改过，所以下面的赋值可能是错误的
        //后续indexOffset全部放在c++修改与维护
        indexOffset = buffer->getIndexOffset();
    }

    for (int curRow = 0; curRow < this->_vertexRow - 1; curRow++) {
        for (int curCol = 0; curCol < this->_vertexCol - 1; curCol++) {
            index_t vId = vertexOffset + curRow * this->_vertexCol + curCol;

            // left bottom
            ib[indexOffset++] = vId;
            // right bottom
            ib[indexOffset++] = vId + 1;
            // left top
            ib[indexOffset++] = vId + this->_vertexCol;

            // right bottom
            ib[indexOffset++] = vId + 1;
            // right top
            ib[indexOffset++] = vId + 1 + this->_vertexCol;
            // left top
            ib[indexOffset++] = vId + this->_vertexCol;

            // set index offset back
            if (buffer != nullptr) {
                buffer->setIndexOffset(indexOffset);
            }
        }
    }
}
} // namespace cc
