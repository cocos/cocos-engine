#pragma once
#include <cocos/2d/renderer/RenderEntity.h>
#include <cocos/2d/assembler/Simple.h>
#include <cocos/base/TypeDef.h>
#include <vector>
#include <cocos/scene/DrawBatch2D.h>
#include <cocos/core/assets/Material.h>
#include <cocos/renderer/gfx-base/GFXTexture.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <2d/renderer/UIMeshBuffer.h>

namespace cc {
struct MeshBufferAttr {
    index_t bufferId;
    index_t indexOffset;
};
class Root;
class Batcher2d {
public:
    Batcher2d(); //暂时调试用，最后要删掉
    explicit Batcher2d(Root* root);
    ~Batcher2d();

    void syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities);
    void syncMeshBufferAttrToNative(uint32_t* buffer, uint8_t stride, uint32_t size);

    // for debug
    void ItIsDebugFuncInBatcher2d();

    bool initialize();
    void update();
    void uploadBuffers();
    void reset();

public:
    void parseAttr();
    MeshBufferAttr* getMeshBufferAttr(index_t bufferId);


public:
    inline std::vector<scene::DrawBatch2D*> getBatches() { return this->_batches; }

    void fillBuffersAndMergeBatches();//填充数据并生成批次队列
    void generateBatch(RenderEntity* entity); //生成batch合并批次

private:
    Root* _root{nullptr};

    std::vector<RenderEntity*> _renderEntities{};

    std::vector<MeshBufferAttr*> _meshBufferAttrArr{};
    uint8_t _attrStride{0};
    uint32_t _attrSize{0};
    uint32_t* _attrBuffer{nullptr};

private:
    //drawbatches
    std::vector<scene::DrawBatch2D*> _batches{};
    //memop::Pool<scene::DrawBatch2D*> _drawBatchPool;

    gfx::Device* _device{nullptr};

    index_t _currBID{-1};
    index_t _indexStart{0};
    int32_t _currHash{0};
    index_t _currLayer{0};

    Material* _currMaterial{nullptr};
    gfx::Texture* _currTexture{nullptr};
    index_t _currTextureHash{0};
    gfx::Sampler* _currSampler{nullptr};
    index_t _currSamplerHash{0};

    UIMeshBuffer* _currMeshBuffer{nullptr};

private:
    Simple* _simple;

};
} // namespace cc
