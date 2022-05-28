#pragma once
#include <cocos/base/TypeDef.h>
#include <cocos/2d/renderer/RenderEntity.h>
#include <cocos/2d/renderer/Batcher2d.h>

namespace cc {
class Simple
{

public:
    Simple(/* args */);
    Simple(Batcher2d* batcher);
    ~Simple();

    void updateWorldVerts(RenderEntity* entity);
    void fillBuffers(RenderEntity* entity);

private:
    uint8_t _vertexRow{1}; //顶点行数（一列有多少个顶点）
    uint8_t _vertexCol{1};  //顶点列数（一行有多少个顶点）

    Batcher2d* _batcher;
};

    
}
