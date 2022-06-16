#pragma once
#include <2d/renderer/UIMeshBuffer.h>
#include <cocos/2d/renderer/RenderEntity.h>
#include <cocos/2d/renderer/UIMeshBuffer.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/assets/Material.h>
#include <cocos/renderer/gfx-base/GFXTexture.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <cocos/scene/DrawBatch2D.h>
#include <unordered_map>
#include <vector>
#include "base/Ptr.h"

namespace cc {
class Root;
class Batcher2d {
public:
    Batcher2d();
    explicit Batcher2d(Root* root);
    ~Batcher2d();

    void syncMeshBuffersToNative(std::vector<UIMeshBuffer*>&& buffers, uint32_t length);
    void syncRenderEntitiesToNative(std::vector<RenderEntity*>&& renderEntities);

    void ItIsDebugFuncInBatcher2d();

    bool initialize();
    void update();
    void uploadBuffers();
    void reset();
    void updateVertDirtyRenderer();

    //void addNewRenderEntity(RenderEntity* entity);
    void addVertDirtyRenderer(RenderEntity* entity);

    //inline RenderEntity* getFirstEntity() const { return _firstEntity; };
    //void setFirstEntity(RenderEntity* entity);

    //inline Node* getRootNode() const { return _rootNode; }
    void addRootNode(Node* node);

public:
    UIMeshBuffer* getMeshBuffer(index_t bufferId);
    gfx::Device* getDevice();

    void updateDescriptorSet();

public:
    inline ccstd::vector<scene::DrawBatch2D*> getBatches() { return this->_batches; }

    void fillBuffersAndMergeBatches();
    void walk(Node* node);
    void generateBatch(RenderEntity* entity);
    void resetRenderStates();

private:
    Root* _root{nullptr};

    //ccstd::vector<RenderEntity*> _renderEntities{};
    //ccstd::vector<RenderEntity*> _newRenderEntities{};
    //RenderEntity* _firstEntity;
    ccstd::vector<Node*> _rootNodeArr{};
    //ccstd::unordered_map<ccstd::string, RenderEntity*>::iterator _mapEnd;
    //ccstd::unordered_map<ccstd::string, RenderEntity*> _nodeEntityMap;

private:
    ccstd::vector<scene::DrawBatch2D*> _batches{};
    ccstd::vector<RenderEntity*> _vertDirtyRenderers{};
    memop::Pool<scene::DrawBatch2D> _drawBatchPool;

    gfx::Device* _device{nullptr}; //use getDevice()

    RenderEntity* _currEntity{nullptr};
    index_t _currBID{-1};
    index_t _indexStart{0};
    uint32_t _currHash{0};
    index_t _currLayer{0};

    Material* _currMaterial{nullptr};
    gfx::Texture* _currTexture{nullptr};
    index_t _currTextureHash{0};
    gfx::Sampler* _currSampler{nullptr};
    index_t _currSamplerHash{0};

private:
    //TODO:destroy
    ccstd::unordered_map<ccstd::hash_t, gfx::DescriptorSet*> _descriptorSetCache{};
    gfx::DescriptorSetInfo _dsInfo{};
    gfx::DescriptorSet* getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, gfx::DescriptorSetLayout* _dsLayout);

private:
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
    }

    inline void updateWorldVerts(RenderEntity* entity){
        //ccstd::vector<Render2dLayout*>& dataList = entity->getRenderDataArr();
        Node* node = entity->getNode();
        const Mat4& matrix = node->getWorldMatrix();
        uint8_t stride = entity->getStride();
        uint32_t size = entity->getVbCount() * stride;
        float_t* vbBuffer = entity->getVbBuffer();

        Vec3 temp;
        uint32_t offset = 0;
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

    ccstd::vector<UIMeshBuffer*> _meshBuffers{nullptr};
};
} // namespace cc
