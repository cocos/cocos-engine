#pragma once
#include <2d/renderer/UIMeshBuffer.h>
#include <cocos/2d/renderer/RenderDrawInfo.h>
#include <cocos/2d/renderer/UIMeshBuffer.h>
#include <cocos/base/TypeDef.h>
#include <cocos/core/assets/Material.h>
#include <cocos/renderer/gfx-base/GFXTexture.h>
#include <cocos/renderer/gfx-base/states/GFXSampler.h>
#include <cocos/scene/DrawBatch2D.h>
#include <unordered_map>
#include <vector>
#include "2d/renderer/RenderEntity.h"
#include "base/Ptr.h"

namespace cc {
class Root;
typedef ccstd::vector<UIMeshBuffer*> UIMeshBufferArray;
typedef ccstd::unordered_map<uint32_t, UIMeshBufferArray> UIMeshBufferMap;
class Batcher2d final {
public:
    Batcher2d();
    explicit Batcher2d(Root* root);
    ~Batcher2d();

    void syncMeshBuffersToNative(uint32_t accId, ccstd::vector<UIMeshBuffer*>&& buffers, uint32_t length);

    bool initialize();
    void update();
    void uploadBuffers();
    void reset();
    //void updateVertDirtyRenderer();

    void addRootNode(Node* node);

public:
    //void addVertDirtyRenderer(RenderDrawInfo* drawInfo);

    UIMeshBuffer* getMeshBuffer(uint32_t accId, uint32_t bufferId);
    gfx::Device* getDevice();

    void updateDescriptorSet();

public:
    inline ccstd::vector<scene::DrawBatch2D*> getBatches() { return this->_batches; }

    void fillBuffersAndMergeBatches();
    void walk(Node* node);
    void handleColor(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode);
    void handleStaticDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode);
    void handleDynamicDrawInfo(RenderEntity* entity, RenderDrawInfo* drawInfo, Node* curNode);
    void generateBatch(RenderEntity* entity, RenderDrawInfo* drawInfo);
    void resetRenderStates();

private:
    Root* _root{nullptr};
    ccstd::vector<Node*> _rootNodeArr{};

private:
    ccstd::vector<scene::DrawBatch2D*> _batches{};
    //ccstd::vector<RenderDrawInfo*> _vertDirtyRenderers{};
    memop::Pool<scene::DrawBatch2D> _drawBatchPool;

    gfx::Device* _device{nullptr}; //use getDevice()

    RenderEntity* _currEntity{nullptr};
    RenderDrawInfo* _currDrawInfo{nullptr};
    UIMeshBuffer* _currMeshBuffer{nullptr};
    uint32_t _indexStart{0};
    uint32_t _currHash{0};
    uint32_t _currLayer{0};
    StencilStage _currStencilStage{StencilStage::DISABLED}; 

    Material* _currMaterial{nullptr};
    gfx::Texture* _currTexture{nullptr};
    uint32_t _currTextureHash{0};
    gfx::Sampler* _currSampler{nullptr};
    uint32_t _currSamplerHash{0};

private:
    ccstd::vector<RenderDrawInfo*> meshRenderDrawInfo{};

private:
    ccstd::unordered_map<ccstd::hash_t, gfx::DescriptorSet*> _descriptorSetCache{};
    gfx::DescriptorSetInfo _dsInfo{};
    gfx::DescriptorSet* getDescriptorSet(gfx::Texture* texture, gfx::Sampler* sampler, gfx::DescriptorSetLayout* _dsLayout);

private:
    inline void fillIndexBuffers(RenderDrawInfo* drawInfo) {
        uint32_t vertexOffset = drawInfo->getVertexOffset();
        uint16_t* ib = drawInfo->getIDataBuffer();

        UIMeshBuffer* buffer = drawInfo->getMeshBuffer();
        uint32_t indexOffset = buffer->getIndexOffset();

        uint16_t* indexb = drawInfo->getIbBuffer();
        uint32_t indexCount = drawInfo->getIbCount();

        memcpy(&ib[indexOffset], indexb, indexCount * sizeof(uint16_t));
        indexOffset += indexCount;

        buffer->setIndexOffset(indexOffset);
    }

    inline void fillVertexBuffers(RenderEntity* entity, RenderDrawInfo* drawInfo) {
        Node* node = entity->getNode();
        const Mat4& matrix = node->getWorldMatrix();
        uint8_t stride = drawInfo->getStride();
        uint32_t size = drawInfo->getVbCount() * stride;
        float_t* vbBuffer = drawInfo->getVbBuffer();

        Vec3 temp;
        uint32_t offset = 0;
        for (int i = 0; i < size; i += stride) {
            Render2dLayout* curLayout = drawInfo->getRender2dLayout(i);
            temp.transformMat4(curLayout->position, matrix);

            offset = i;
            vbBuffer[offset++] = temp.x;
            vbBuffer[offset++] = temp.y;
            vbBuffer[offset++] = temp.z;
        }
    }
    inline void setIndexRange(RenderDrawInfo* drawInfo) {
        UIMeshBuffer* buffer = drawInfo->getMeshBuffer();
        uint32_t indexOffset = drawInfo->getIndexOffset();
        uint32_t indexCount = drawInfo->getIbCount();
        indexOffset += indexCount;
        buffer->setIndexOffset(indexOffset);
    }

    inline void fillColors(RenderEntity* entity, RenderDrawInfo* drawInfo) {
        Color temp = entity->getColor();

        uint8_t stride = drawInfo->getStride();
        uint32_t size = drawInfo->getVbCount() * stride;
        float_t* vbBuffer = drawInfo->getVbBuffer();

        uint32_t offset = 0;
        for (int i = 0; i < size; i += stride) {
            offset = i + 5;
            vbBuffer[offset++] = temp.r / 255;
            vbBuffer[offset++] = temp.g / 255;
            vbBuffer[offset++] = temp.b / 255;
            vbBuffer[offset++] = entity->getOpacity();
        }
    }
    UIMeshBufferMap _meshBuffersMap;
};
} // namespace cc
