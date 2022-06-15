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

    //inline void setNodeEntity(ccstd::string id, RenderEntity* entity) {
    //    _nodeEntityMap[id] = entity;
    //}

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
    void updateWorldVerts(RenderEntity* entity);
    void fillBuffers(RenderEntity* entity);

    ccstd::vector<UIMeshBuffer*> _meshBuffers{nullptr};
};
} // namespace cc
