/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once
#include "2d/renderer/UIMeshBuffer.h"
#include "2d/renderer/RenderDrawInfo.h"
#include "2d/renderer/UIMeshBuffer.h"
#include "base/TypeDef.h"
#include "core/assets/Material.h"
#include "renderer/gfx-base/GFXTexture.h"
#include "renderer/gfx-base/states/GFXSampler.h"
#include "scene/DrawBatch2D.h"
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

    void syncMeshBuffersToNative(uint32_t accId, ccstd::vector<UIMeshBuffer*>&& buffers);

    bool initialize();
    void update();
    void uploadBuffers();
    void reset();

    void addRootNode(Node* node);

    UIMeshBuffer* getMeshBuffer(uint32_t accId, uint32_t bufferId);
    gfx::Device* getDevice();

    void updateDescriptorSet();

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

    ccstd::vector<scene::DrawBatch2D*> _batches{};
    memop::Pool<scene::DrawBatch2D> _drawBatchPool;

    gfx::Device* _device{nullptr}; //use getDevice()

    RenderEntity* _currEntity{nullptr};
    RenderDrawInfo* _currDrawInfo{nullptr};
    UIMeshBuffer* _currMeshBuffer{nullptr};
    uint32_t _indexStart{0};
    ccstd::hash_t _currHash{0};
    uint32_t _currLayer{0};
    StencilStage _currStencilStage{StencilStage::DISABLED}; 

    Material* _currMaterial{nullptr};
    gfx::Texture* _currTexture{nullptr};
    ccstd::hash_t _currTextureHash{0};
    gfx::Sampler* _currSampler{nullptr};
    ccstd::hash_t _currSamplerHash{0};

    ccstd::vector<RenderDrawInfo*> _meshRenderDrawInfo{};

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
