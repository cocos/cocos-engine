#pragma once
#include <cocos/base/TypeDef.h>
#include <cocos/2d/renderer/RenderEntity.h>

namespace cc {
class Batcher2d;
class Simple
{
public:
    Simple(/* args */);
    Simple(Batcher2d* batcher);
    ~Simple();

    inline void updateWorldVerts(RenderEntity* entity){
        //ccstd::vector<Render2dLayout*>& dataList = entity->getRenderDataArr();
        Node* node = entity->getNode();
        const Mat4& matrix = node->getWorldMatrix();
        uint8_t stride = entity->getStride();
        uint32_t size = entity->getVbCount() * stride;
        float_t* vbBuffer = entity->getVbBuffer();

        Vec3 temp;
        uint8_t offset = 0;
        for (int i = 0; i < size; i += stride) {
            //Render2dLayout* curLayout = dataList[i];
            Render2dLayout* curLayout = entity->getRender2dLayout(i);
            temp.transformMat4(curLayout->position, matrix);

            offset = i;
            vbBuffer[offset++] = temp.x;
            vbBuffer[offset++] = temp.y;
            vbBuffer[offset++] = temp.z;
        }
    }

    inline void fillBuffers(RenderEntity* entity){
        index_t vertexOffset = entity->getVertexOffset();
        uint16_t* ib = entity->getIDataBuffer();

        UIMeshBuffer* buffer = entity->getMeshBuffer();
        index_t indexOffset = buffer->getIndexOffset();

        uint16_t* indexb = entity->getIbBuffer();
        index_t indexCount = entity->getIbCount();

        memcpy(&ib[indexOffset], indexb, indexCount * sizeof(uint16_t));
        indexOffset += indexCount;

        // set index offset back
        buffer->setIndexOffset(indexOffset);
    };

private:
    uint8_t _vertexRow{1}; //顶点行数（一列有多少个顶点）
    uint8_t _vertexCol{1};  //顶点列数（一行有多少个顶点）

    Batcher2d* _batcher;
};

    
}
