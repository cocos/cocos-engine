#include "Simple.h"
#include <2d/assembler/Simple.h>
#include <cocos/base/TypeDef.h>

namespace cc {
Simple::Simple(/* args */) {
    this->_vertexRow = 2;
    this->_vertexCol = 2;
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

    std::vector<Render2dLayout*> dataList = entity->getRenderDataArr();
    Node* node = entity->getNode();
    const Mat4& matrix = node->getWorldMatrix();
    uint8_t stride = entity->getStride();
    float_t* vbBuffer = entity->getVbBuffer();

    Vec3 temp;
    uint8_t offset = 0;
    for (int i = 0; i < dataList.size(); i++) {
        Render2dLayout* curLayout = dataList[i];
        temp.set(curLayout->position);
        temp.transformMat4(temp, matrix);

        offset = i * stride;
        vbBuffer[offset++] = temp.x;
        vbBuffer[offset++] = temp.x;
        vbBuffer[offset++] = temp.x;
    }
}

void Simple::fillBuffers(RenderEntity* entity) {
    Node* node = entity->getNode();
    if (node->getChangedFlags() || entity->getVertDirty()) {
        this->updateWorldVerts(entity);
        entity->setVertDirty(false);
    }

    uint8_t vertexOffset = entity->getVertexOffset();
    uint16_t* ib = entity->getIDataBuffer();

    MeshBufferAttr* attr = this->_batcher->getMeshBufferAttr(entity->getBufferId());
    uint8_t indexOffset = 0;
    if (attr != nullptr) {
        //因为目前的indexOffset还在ts层修改过，所以下面的赋值可能是错误的
        //后续indexOffset全部放在c++修改与维护
        indexOffset = attr->indexOffset;
    }

    for (int curRow = 0; curRow < this->_vertexRow - 1; curRow++) {
        for (int curCol = 0; curCol < this->_vertexCol - 1; curCol++) {
            uint8_t vId = vertexOffset + curRow * this->_vertexCol + curCol;

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
            // 这句有问题，得存在一个固定的meshbuffer.indexoffset
            // 上面拿到uint8_t indexOffset = entity->getIndexOffset();也得从一个固定的地方拿
            if (attr != nullptr) {
                attr->indexOffset = indexOffset;
            }
        }
    }
}
} // namespace cc
