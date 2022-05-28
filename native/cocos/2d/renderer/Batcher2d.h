#pragma once
#include <cocos/base/TypeDef.h>
#include <cocos/2d/renderer/RenderEntity.h>
#include <vector>

namespace cc {
struct MeshBufferAttr {
    index_t bufferId;
    index_t indexOffset;

};
class Batcher2d {
public:
    Batcher2d();
    ~Batcher2d();

    void syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities);
    void syncMeshBufferAttrToNative(uint32_t* buffer, uint8_t stride, uint32_t size);
    // for debug
    void ItIsDebugFuncInBatcher2d();

public:
    void parseAttr();
    MeshBufferAttr* getMeshBufferAttr(index_t bufferId);

private:
    std::vector<RenderEntity*> _renderEntities{};

    std::vector<MeshBufferAttr*> _meshBufferAttrArr{};
    uint8_t _attrStride{0};
    uint32_t _attrSize{0};
    uint32_t* _attrBuffer{nullptr};
};
}
